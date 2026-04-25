#!/bin/bash
# Save Katrina's headshot to public/katrina.jpg.
#
# Usage:
#   ./scripts/save-photo.sh                    # uses clipboard (copy image first)
#   ./scripts/save-photo.sh /path/to/file.jpg  # uses an explicit path
#   ./scripts/save-photo.sh --downloads        # uses most-recent image in ~/Downloads

set -e

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/katrina.jpg"
TMP_PNG="/tmp/_katrina_$(date +%s).png"

case "$1" in
  "")
    # Clipboard mode (default)
    echo "Reading image from clipboard…"
    osascript >/dev/null 2>&1 \
      -e "set png_data to (the clipboard as «class PNGf»)" \
      -e "set fp to open for access POSIX file \"$TMP_PNG\" with write permission" \
      -e "set eof fp to 0" \
      -e "write png_data to fp" \
      -e "close access fp" || {
        echo "❌ No image in clipboard. Copy the photo first (right-click → Copy Image), then re-run."
        exit 1
      }
    sips -s format jpeg "$TMP_PNG" --out "$DEST" >/dev/null
    rm -f "$TMP_PNG"
    ;;
  --downloads)
    SRC=$(ls -t ~/Downloads/*.{jpg,jpeg,png,webp,heic} 2>/dev/null | head -1)
    if [ -z "$SRC" ]; then
      echo "❌ No image found in ~/Downloads"
      exit 1
    fi
    case "$SRC" in
      *.heic|*.HEIC) sips -s format jpeg "$SRC" --out "$DEST" >/dev/null ;;
      *) cp "$SRC" "$DEST" ;;
    esac
    ;;
  *)
    SRC="$1"
    if [ ! -f "$SRC" ]; then
      echo "❌ File not found: $SRC"
      exit 1
    fi
    case "$SRC" in
      *.heic|*.HEIC) sips -s format jpeg "$SRC" --out "$DEST" >/dev/null ;;
      *) cp "$SRC" "$DEST" ;;
    esac
    ;;
esac

echo "✓ Saved → $DEST"
echo ""
echo "Push & redeploy:"
echo "  git add public/katrina.jpg && git -c commit.gpgsign=false commit -m 'Add headshot' && git push && netlify deploy --prod --dir=dist"
