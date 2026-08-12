// Autonomous blog post generator.
//
// Called by .github/workflows/blog-post.yml three times a day:
//   POST_TYPE=evergreen  -> human-voice educational/lifestyle post
//   POST_TYPE=news       -> market/rates/local news post (real sources)
//   POST_TYPE=news-law   -> legal/regulatory real estate news post (real sources)
//
// Requires ANTHROPIC_API_KEY. Writes content/posts/YYYY-MM-DD-<slug>.md
import fs from 'node:fs';
import path from 'node:path';
import { POSTS_DIR, SITE_URL, readAllPosts, parseFrontmatter, slugify } from './blog-lib.mjs';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set');
  process.exit(1);
}
const POST_TYPE = process.env.POST_TYPE || 'evergreen';
const MODEL = process.env.BLOG_MODEL || 'claude-sonnet-4-5';

// Today in Eastern Time
const todayET = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
const dayOfYear = Math.floor(
  (Date.parse(todayET) - Date.parse(`${todayET.slice(0, 4)}-01-01`)) / 86400000
);

// ---------------------------------------------------------------- topics
const COUNTIES = [
  "Prince George's County, MD", 'Montgomery County, MD', 'Howard County, MD',
  'Anne Arundel County, MD', 'Baltimore County, MD', 'Baltimore City, MD',
  'Harford County, MD', 'Cecil County, MD', 'Charles County, MD',
  'Washington, D.C.', 'York County, PA', 'Lancaster County, PA', 'New Castle County, DE',
];

const EVERGREEN_TOPICS = [
  'buyer education (offers, inspections, appraisals, contingencies)',
  'seller education (pricing, prep, negotiating, net proceeds)',
  'first-time homebuyer guidance and down-payment assistance programs (MMP, DC HPAP, PHFA)',
  'real estate investing in Maryland/DC/PA (rentals, house hacking, BRRRR basics)',
  `a neighborhood/county spotlight on ${COUNTIES[dayOfYear % COUNTIES.length]} — schools, commute, lifestyle, price points`,
  'advice for fellow realtors and referral partners working the MD/DC/PA/DE region (co-op and referral angle)',
  'mortgage and financing education (loan types, rate buydowns, pre-approval, credit prep)',
  'home staging, curb appeal, and photo-day preparation',
  'the closing process in Maryland/DC/PA explained step by step (title, transfer taxes, settlement)',
  'seasonal real estate strategy (what this time of year means for buyers and sellers locally)',
  'military relocation and PCS moves in the Maryland/DC region (Katrina is MRP certified)',
  'senior communities, downsizing, and multi-generational living in Maryland',
  'renting vs buying math in the Baltimore–Washington corridor',
  'real estate law and rules explained in plain English (agency agreements, disclosures, fair housing, landlord-tenant basics in MD/DC/PA)',
];

// ---------------------------------------------------------------- news fetching
const FEEDS = [
  { name: 'HousingWire', url: 'https://www.housingwire.com/feed/' },
  { name: 'Redfin News', url: 'https://www.redfin.com/news/feed/' },
  { name: 'Zillow Research', url: 'https://www.zillow.com/research/feed/' },
  { name: 'Mortgage News Daily', url: 'https://www.mortgagenewsdaily.com/rss/full' },
  { name: 'Realtor.com News', url: 'https://www.realtor.com/news/feed/' },
];

async function fetchText(url, timeoutMs = 15000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (blog-bot; +https://kkstherealtor.com)' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function parseRss(xml, source, max = 8) {
  const items = [];
  const chunks = xml.split(/<item[\s>]/).slice(1, max + 1);
  for (const c of chunks) {
    const pick = (tag) => {
      const m = c.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      if (!m) return '';
      return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
    };
    const title = pick('title');
    const link = pick('link') || (c.match(/<link[^>]*>([^<]+)/) || [])[1] || '';
    const date = pick('pubDate');
    const desc = pick('description').slice(0, 300);
    if (title && link) items.push({ source, title, link: link.trim(), date, desc });
  }
  return items;
}

async function gatherNews() {
  const all = [];
  for (const f of FEEDS) {
    try {
      const xml = await fetchText(f.url);
      all.push(...parseRss(xml, f.name));
      console.log(`feed ok: ${f.name}`);
    } catch (e) {
      console.warn(`feed failed: ${f.name} (${e.message})`);
    }
  }
  // Freddie Mac PMMS current rates
  let pmms = '';
  try {
    const csv = await fetchText('https://www.freddiemac.com/pmms/docs/PMMS_history.csv');
    const rows = csv.trim().split('\n');
    pmms = `Freddie Mac PMMS latest weekly survey (date,30yr,fees,15yr,...): ${rows[rows.length - 1]} (header: ${rows[0]}). Cite as https://www.freddiemac.com/pmms`;
  } catch (e) {
    console.warn(`PMMS fetch failed (${e.message})`);
  }
  return { headlines: all, pmms };
}

// ---------------------------------------------------------------- prompt
const posts = readAllPosts();
const recent = posts.slice(0, 15).map((p) => `- "${p.title}" (${p.date}, ${p.category}) -> ${SITE_URL}/blog/${p.slug}`).join('\n');

const VOICE = `You are ghost-writing as Katrina Kirton Sherrod ("KKS The REALTOR®"), a warm, plain-spoken
REALTOR® with Samson Properties (Bel Air, MD office), licensed in Maryland, Washington D.C.,
Pennsylvania, and Delaware. She spent 20+ years in education and leadership before real estate,
so she teaches rather than sells. First person, conversational, genuinely human. She serves:
Cecil, Harford, Montgomery, Howard, Anne Arundel, Charles, Baltimore County and Baltimore City
in MD; Prince George's County; Washington D.C.; York and Lancaster Counties in PA; New Castle
County, DE.

VOICE RULES (critical):
- Vary sentence length. Short punches. Then a longer, wandering thought like a person actually talking to a client at a kitchen table.
- Sprinkle in small personal touches (open houses, client stories kept anonymous, life in the Baltimore-Washington corridor, her educator background).
- BANNED: "in today's fast-paced world", "whether you're X or Y", "look no further", "it's important to note", "in conclusion", "game-changer", "unlock", "navigate the world of", "dive into". No more than ONE em-dash in the whole article. Do not overuse bullet lists — at most one short list.
- Do NOT sound like a brochure. Opinions are allowed. Mild humor is allowed.`;

const SEO = `SEO REQUIREMENTS:
- 1,000–1,800 words of body text.
- Naturally weave in local keywords such as "Maryland realtor", "[county] realtor", "homes for sale in [county/city]", "sell my house in [county]", and DC/PA/DE equivalents where they genuinely fit. Title/H1 and slug should carry a primary local keyword. Never keyword-stuff.
- Use markdown with ## and ### subheadings.
- Include 3–6 helpful OUTBOUND links to reputable primary sources (NAR nar.realtor, Freddie Mac freddiemac.com/pmms, HUD, county government sites, state housing agencies, Maryland REALTORS, court/legislature pages) as markdown links.
- Include 2–3 INTERNAL links: at least one to ${SITE_URL}/#listings or ${SITE_URL}/#contact, and link to relevant prior posts from this list when on-topic:
${recent || '(no prior posts yet)'}
- Do NOT include a signature, byline, branding block, or closing quote. The site appends those automatically.
- Do NOT include the title as an H1 in the body; the site renders the title.`;

const FORMAT = `OUTPUT FORMAT — return ONLY this, no commentary:
---
title: <compelling, human title with a local keyword, 50-70 chars>
slug: <kebab-case-slug-with-keyword>
date: ${todayET}
category: <one of: Buyer Education | Seller Education | Market Update | First-Time Buyers | Investing | County Spotlight | For Realtors | Mortgage & Financing | Staging & Prep | Closing Process | Real Estate Law | Local Life>
type: ${POST_TYPE}
excerpt: <1-2 sentence teaser, max 220 chars, plain text>
metaDescription: <SEO meta description, 140-160 chars>
keywords: <5-8 comma-separated target keywords>
---
<the article body in markdown>`;

async function buildPrompt() {
  if (POST_TYPE === 'evergreen') {
    const topic = EVERGREEN_TOPICS[dayOfYear % EVERGREEN_TOPICS.length];
    return `${VOICE}

Write today's (${todayET}) evergreen blog post. Topic area: ${topic}.
Pick one specific, useful angle inside that topic that has NOT been covered by the recent posts listed below. This is the "human" post of the day — lead with a story, an observation from her week, or an opinion, then teach something concrete and locally specific.

${SEO}

${FORMAT}`;
  }

  const { headlines, pmms } = await gatherNews();
  const headlineBlock = headlines
    .slice(0, 40)
    .map((h) => `- [${h.source}] ${h.title} (${h.date}) ${h.link}${h.desc ? ` — ${h.desc}` : ''}`)
    .join('\n');

  const lawFocus =
    POST_TYPE === 'news-law'
      ? `FOCUS: REAL ESTATE LAW / REGULATION. From the headlines (or well-established ongoing legal stories), pick the most relevant legal or regulatory development for MD/DC/PA/DE consumers: NAR settlement and buyer-agency agreement rules, commission practice changes, new Maryland/DC/Pennsylvania housing legislation, disclosure law changes, fair-housing rulings or enforcement, landlord-tenant law updates, property tax or transfer tax changes. Explain it in plain English for buyers and sellers: what changed, who it affects, what to actually do. You MUST include this sentence near the end, verbatim: "This is general information, not legal advice — for your specific situation, please consult a licensed real estate attorney." Link to primary sources (statute pages, court documents, nar.realtor, state REALTOR associations, legislature sites) wherever possible.`
      : `FOCUS: MARKET NEWS. Pick the 1-2 most consequential current stories for MD/DC/PA/DE buyers and sellers (mortgage rates, inventory, prices, local market data, economic news that hits housing). Translate national numbers into what they mean on the ground in her local counties.`;

  return `${VOICE}

Write today's (${todayET}) NEWS-DRIVEN blog post. Below are real, current headlines pulled minutes ago, plus the latest Freddie Mac mortgage-rate survey data. Ground the post in these — quote real numbers, name and LINK the actual sources you draw on (link the article/source URLs given). Do not invent statistics; if a number isn't in the material below, either omit it or describe it qualitatively.

${lawFocus}

CURRENT HEADLINES:
${headlineBlock || '(feeds unavailable — write from well-established recent context and clearly date-stamp claims cautiously, still citing primary sources like freddiemac.com/pmms and nar.realtor)'}

${pmms}

${SEO}

${FORMAT}`;
}

// ---------------------------------------------------------------- Anthropic call
async function generate(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data = await res.json();
  return data.content.map((b) => b.text || '').join('');
}

const prompt = await buildPrompt();
console.log(`Generating ${POST_TYPE} post for ${todayET} with ${MODEL}...`);
let out = await generate(prompt);
out = out.trim().replace(/^```(?:markdown)?\n?/, '').replace(/\n?```$/, '').trim();

// Validate + normalize
const { meta, body } = parseFrontmatter(out);
if (!meta.title || !body || body.split(/\s+/).length < 600) {
  throw new Error(`Generated post failed validation (title="${meta.title}", words=${body.split(/\s+/).length})`);
}
let slug = slugify(meta.slug || meta.title);
const existing = new Set(posts.map((p) => p.slug));
if (existing.has(slug)) slug = `${slug}-${todayET.replace(/-/g, '')}`;
meta.slug = slug;
meta.date = todayET;
meta.type = POST_TYPE;

const fm = ['title', 'slug', 'date', 'category', 'type', 'excerpt', 'metaDescription', 'keywords']
  .map((k) => `${k}: "${String(meta[k] || '').replace(/"/g, "'")}"`)
  .join('\n');
const file = path.join(POSTS_DIR, `${todayET}-${slug}.md`);
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(file, `---\n${fm}\n---\n\n${body}\n`);
console.log(`Wrote ${file}`);

// Expose for the workflow (IndexNow ping)
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `post_url=${SITE_URL}/blog/${slug}\nslug=${slug}\n`);
}
