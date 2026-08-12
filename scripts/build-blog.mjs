// Build step: content/posts/*.md -> public/blog-data/*.json + public/sitemap.xml
// Runs as part of `prebuild` so the SPA and the prerender step both have data.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { ROOT, SITE_URL, readAllPosts, readTime, pickQuote } from './blog-lib.mjs';

const OUT = path.join(ROOT, 'public', 'blog-data');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));

marked.setOptions({ gfm: true });

const posts = readAllPosts();

const index = posts.map((p) => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  category: p.category || 'Real Estate',
  type: p.type || 'evergreen',
  excerpt: p.excerpt || '',
  readTime: readTime(p.body),
}));

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));

posts.forEach((p, i) => {
  // External links open in a new tab.
  let html = marked.parse(p.body);
  html = html.replace(/<a href="(https?:\/\/(?!kkstherealtor\.com)[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  const prev = posts[i + 1] ? { slug: posts[i + 1].slug, title: posts[i + 1].title } : null;
  const next = posts[i - 1] ? { slug: posts[i - 1].slug, title: posts[i - 1].title } : null;
  const full = {
    ...index[i],
    metaDescription: p.metaDescription || p.excerpt || '',
    keywords: p.keywords || '',
    html,
    quote: pickQuote(p.slug),
    prev,
    next,
  };
  fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify(full, null, 1));
});

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, lastmod: today, priority: '1.0' },
  { loc: `${SITE_URL}/blog`, lastmod: posts[0]?.date || today, priority: '0.9' },
  ...posts.map((p) => ({ loc: `${SITE_URL}/blog/${p.slug}`, lastmod: p.date, priority: '0.8' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);

console.log(`build-blog: ${posts.length} posts -> public/blog-data + sitemap.xml`);
