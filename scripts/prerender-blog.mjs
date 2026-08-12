// Post-build prerender: emits static, fully crawlable HTML for /blog and each
// /blog/<slug> page into dist/. Netlify serves real files before the SPA
// redirect, so Google sees full article content with zero JS. React takes
// over on load for interactivity.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_URL, esc } from './blog-lib.mjs';

const DIST = path.join(ROOT, 'dist');
const DATA = path.join(DIST, 'blog-data');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const index = JSON.parse(fs.readFileSync(path.join(DATA, 'index.json'), 'utf8'));

const fmtDate = (d) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function page({ title, description, canonical, jsonld, rootHtml, ogType = 'article' }) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`);
  html = html.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${ogType}$2`);
  const headExtra = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    ...jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`),
  ].join('\n    ');
  html = html.replace('</head>', `    ${headExtra}\n  </head>`);
  html = html.replace('<div id="root"></div>', () => `<div id="root">${rootHtml}</div>`);
  return html;
}

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  })),
});

const wrap = (inner) =>
  `<div style="font-family:Georgia,serif;max-width:760px;margin:0 auto;padding:48px 24px;color:#111;line-height:1.7">${inner}</div>`;

// ---- /blog index ----
const listHtml = index
  .map(
    (p) =>
      `<article style="margin-bottom:2.5em"><h2 style="margin:0 0 .2em"><a href="/blog/${p.slug}" style="color:#111">${esc(p.title)}</a></h2><p style="color:#6F6F6F;font-size:.9em;margin:0 0 .5em">${esc(p.category)} · ${fmtDate(p.date)} · ${p.readTime} min read</p><p>${esc(p.excerpt)}</p></article>`
  )
  .join('');

fs.mkdirSync(path.join(DIST, 'blog'), { recursive: true });
fs.writeFileSync(
  path.join(DIST, 'blog', 'index.html'),
  page({
    title: 'Real Estate Blog | Katrina Kirton Sherrod — Maryland, DC & PA REALTOR®',
    description:
      'Local real estate insight from Katrina Kirton Sherrod, REALTOR® with Samson Properties — buying, selling, market updates and neighborhood guides across Maryland, Washington D.C., Pennsylvania, and Delaware.',
    canonical: `${SITE_URL}/blog`,
    ogType: 'website',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Katrina Kirton Sherrod — Real Estate Blog',
        url: `${SITE_URL}/blog`,
        author: { '@type': 'Person', name: 'Katrina Kirton Sherrod' },
        blogPost: index.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${SITE_URL}/blog/${p.slug}`,
          datePublished: p.date,
        })),
      },
      breadcrumb([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'Blog', url: `${SITE_URL}/blog` },
      ]),
    ],
    rootHtml: wrap(
      `<nav><a href="/" style="color:#6F6F6F">← kkstherealtor.com</a></nav><h1>The KKS Home Group Blog</h1><p style="color:#6F6F6F">Real estate insight for Maryland, Washington D.C., Pennsylvania &amp; Delaware.</p>${listHtml}`
    ),
  })
);

// ---- individual posts ----
for (const p of index) {
  const full = JSON.parse(fs.readFileSync(path.join(DATA, `${p.slug}.json`), 'utf8'));
  const canonical = `${SITE_URL}/blog/${p.slug}`;
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: full.metaDescription,
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: canonical,
      keywords: full.keywords,
      articleSection: p.category,
      author: {
        '@type': 'Person',
        name: 'Katrina Kirton Sherrod',
        jobTitle: 'REALTOR®',
        url: SITE_URL,
        worksFor: { '@type': 'Organization', name: 'Samson Properties' },
      },
      publisher: { '@type': 'Organization', name: 'KKS Home Group of Samson Properties', url: SITE_URL },
    },
    breadcrumb([
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: p.title, url: canonical },
    ]),
  ];
  const rootHtml = wrap(
    `<nav><a href="/blog" style="color:#6F6F6F">← All posts</a></nav><p style="color:#6F6F6F;font-size:.9em">${esc(p.category)} · ${fmtDate(p.date)} · ${p.readTime} min read</p><h1>${esc(p.title)}</h1>${full.html}<hr /><p><strong>Katrina Kirton Sherrod</strong>, REALTOR® · Samson Properties · Licensed in MD, DC, PA &amp; DE · <a href="tel:4436169770">443-616-9770</a> · <a href="mailto:Katrina@kkstherealtor.com">Katrina@kkstherealtor.com</a></p><p style="color:#6F6F6F"><em>“${esc(full.quote.text)}” — ${esc(full.quote.by)}</em></p>`
  );
  const dir = path.join(DIST, 'blog', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    page({ title: `${p.title} | Katrina Kirton Sherrod, REALTOR®`, description: full.metaDescription, canonical, jsonld, rootHtml })
  );
}

console.log(`prerender-blog: wrote /blog + ${index.length} post pages into dist/`);
