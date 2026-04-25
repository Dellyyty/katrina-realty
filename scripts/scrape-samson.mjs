#!/usr/bin/env node
/**
 * Scrapes Katrina's Samson Properties profile page and writes her active
 * listings to src/data/samson-listings.json.
 *
 * Runs at build time (see package.json "build" script) so Netlify rebuilds
 * keep the site in sync with her Samson page. Falls back to the existing
 * JSON file if Samson is unreachable.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'samson-listings.json');
const SOURCE_URL = 'https://katrinakirtonsherrod.samsonproperties.net/';
const SITE_BASE = 'https://katrinakirtonsherrod.samsonproperties.net';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function decode(s) {
  return s.replace(/\\\//g, '/').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function parsePrice(p) {
  if (typeof p === 'number') return p;
  return Number(String(p).replace(/[^0-9.]/g, '')) || 0;
}

function listingTypeBadge(label) {
  switch ((label || '').toLowerCase()) {
    case 'townhouse':
      return 'Townhouse';
    case 'rentals':
      return 'For Rent';
    case 'commercial':
      return 'Commercial';
    case 'land':
      return 'Land';
    case 'condo':
      return 'Condo';
    case 'multi family':
    case 'multi-family':
      return 'Multi-Family';
    default:
      return 'Single Family';
  }
}

async function scrape() {
  const res = await fetch(SOURCE_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Samson returned ${res.status}`);
  const html = await res.text();

  // The page embeds an array under "mylistings":[{...}] — extract by balancing brackets.
  const marker = '"mylistings":[';
  const idx = html.indexOf(marker);
  if (idx === -1) throw new Error('mylistings array not found in page source');

  // Walk forward and balance brackets to find the closing ].
  let depth = 0;
  let start = idx + marker.length - 1; // position of opening [
  let end = -1;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error('Could not find end of mylistings array');

  const arrayJson = html.slice(start, end);
  const raw = JSON.parse(arrayJson);

  const listings = raw.map((l) => {
    const url = l.url ? `${SITE_BASE}${decode(l.url)}` : SITE_BASE;
    return {
      id: (l.url || l.address || crypto.randomUUID()).replace(/[^a-z0-9]/gi, '-').slice(0, 80),
      address: l.address || '',
      city: l.city || '',
      state: l.state || '',
      zip: l.zip || '',
      beds: typeof l.beds === 'number' ? l.beds : Number(l.beds) || null,
      baths: typeof l.baths === 'number' ? l.baths : Number(l.baths) || null,
      sqft: typeof l.footage === 'number' ? l.footage : Number(l.footage) || null,
      price: parsePrice(l.price),
      property_type: listingTypeBadge(l.listing_type_label),
      photo_url: l.photo ? decode(l.photo) : null,
      url,
      listing_date: l.listing_date ? new Date(l.listing_date * 1000).toISOString() : null,
    };
  });

  // Sort by listing_date desc, then dedupe by id.
  listings.sort((a, b) => (b.listing_date || '').localeCompare(a.listing_date || ''));
  const seen = new Set();
  const deduped = listings.filter((l) => (seen.has(l.id) ? false : seen.add(l.id)));

  return deduped;
}

async function main() {
  let listings;
  try {
    console.log('→ Scraping', SOURCE_URL);
    listings = await scrape();
    console.log(`✓ Parsed ${listings.length} listings`);
  } catch (err) {
    console.warn('⚠ Scrape failed:', err.message);
    if (fs.existsSync(OUT_PATH)) {
      console.warn('  Keeping existing samson-listings.json');
      return;
    }
    console.warn('  Writing empty array');
    listings = [];
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUT_PATH,
    JSON.stringify({ scraped_at: new Date().toISOString(), source: SOURCE_URL, listings }, null, 2)
  );
  console.log('✓ Wrote', path.relative(process.cwd(), OUT_PATH));
}

main().catch((err) => {
  console.error('✗', err);
  process.exit(0); // never fail the build
});
