#!/bin/bash
# Saves the latest image from your clipboard or Downloads as Katrina's headshot.
# Usage:
#   ./scripts/save-photo.sh                    # uses most-recent image in ~/Downloads
#   ./scripts/save-photo.sh /path/to/file.jpg  # uses an explicit path

set -e

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/katrina.jpg"

if [ -n "$1" ]; then
  SRC="$1"
else
  # Find most recent image in Downloads
  SRC=$(ls -t ~/Downloads/*.{jpg,jpeg,png,webp,heic} 2>/dev/null | head -1)
fi

if [ -z "$SRC" ] || [ ! -f "$SRC" ]; then
  echo "No image found. Save Katrina's photo to ~/Downloads, then re-run."
  echo "Or pass a path: ./scripts/save-photo.sh /path/to/photo.jpg"
  exit 1
fi

# Convert HEIC if needed (requires sips on macOS)
case "$SRC" in
  *.heic|*.HEIC)
    echo "Converting HEIC → JPG…"
    sips -s format jpeg "$SRC" --out "$DEST" >/dev/null
    ;;
  *)
    cp "$SRC" "$DEST"
    ;;
esac

echo "✓ Saved: $DEST"
echo "  Source: $SRC"
echo ""
echo "Next: git add public/katrina.jpg && git commit -m 'Add headshot' && git push"
echo "Then: netlify deploy --prod --dir=dist"
