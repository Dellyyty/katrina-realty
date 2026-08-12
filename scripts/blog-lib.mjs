// Shared helpers for the blog pipeline (build + generate scripts).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const POSTS_DIR = path.join(ROOT, 'content', 'posts');
export const SITE_URL = 'https://kkstherealtor.com';

export const WITTY_QUOTES = [
  { text: 'The best time to buy a home was five years ago. The second best time is after we talk.', by: 'Every honest realtor, eventually' },
  { text: 'Real estate cannot be lost or stolen, nor can it be carried away. It is about the safest investment in the world.', by: 'Franklin D. Roosevelt (paraphrased)' },
  { text: 'Buy land — they are not making it anymore.', by: 'Mark Twain' },
  { text: 'A house is made of walls and beams; a home is built with love and dreams.', by: 'Ralph Waldo Emerson (attributed)' },
  { text: 'The house you looked at today and wanted to think about until tomorrow may be the same house someone looked at yesterday and will buy today.', by: 'Koki Adasi' },
  { text: 'Ninety percent of all millionaires become so through owning real estate.', by: 'Andrew Carnegie' },
  { text: 'Buyers decide in the first eight seconds of seeing a home if they are interested. Get out of the car, walk in the door — sold.', by: 'Barbara Corcoran' },
  { text: 'Owning a home is a keystone of wealth — both financial affluence and emotional security.', by: 'Suze Orman' },
  { text: 'Location, location, location — the only real estate advice that has never once needed a market update.', by: 'Old broker wisdom' },
  { text: 'Don’t wait to buy real estate. Buy real estate and wait.', by: 'Will Rogers (attributed)' },
  { text: 'The problem with waiting for the perfect house is that someone imperfect already bought it.', by: 'Anonymous open-house guest' },
  { text: 'Home is the nicest word there is.', by: 'Laura Ingalls Wilder' },
];

export function pickQuote(slug) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return WITTY_QUOTES[h % WITTY_QUOTES.length];
}

// Minimal frontmatter parser: --- key: value --- (values may be quoted)
export function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error('Missing frontmatter');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    meta[kv[1]] = v;
  }
  return { meta, body: m[2].trim() };
}

export function readAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = [];
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (!f.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    if (!meta.title || !meta.slug || !meta.date) {
      console.warn(`Skipping ${f}: missing title/slug/date`);
      continue;
    }
    posts.push({ ...meta, body, file: f });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

export function readTime(body) {
  const words = body.split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export function slugify(s) {
  return s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
