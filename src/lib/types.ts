export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  price: number;
  status: 'for_sale' | 'sold' | 'pending' | 'for_rent';
  photo_url: string | null;
  zillow_url: string | null;
  description: string | null;
  featured: boolean;
  open_house_date: string | null;
  created_at: string;
}

export interface OpenHouseSignin {
  id: string;
  listing_id: string | null;
  listing_address: string | null;
  name: string;
  email: string;
  phone: string;
  working_with_agent: boolean;
  notes: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  body: string;
  source: string;
  date: string;
}
