import samsonData from '../data/samson-listings.json';

export interface SamsonListing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  price: number;
  property_type: string;
  photo_url: string | null;
  url: string;
  listing_date: string | null;
}

export interface SamsonData {
  scraped_at: string;
  source: string;
  listings: SamsonListing[];
}

export const samson = samsonData as SamsonData;

const JUST_LISTED_DAYS = 30;

export function isJustListed(l: SamsonListing): boolean {
  if (!l.listing_date) return false;
  const ageMs = Date.now() - new Date(l.listing_date).getTime();
  return ageMs < JUST_LISTED_DAYS * 24 * 60 * 60 * 1000;
}
