-- Katrina Realty — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

create extension if not exists "uuid-ossp";

create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  address text not null,
  city text not null,
  state text not null default 'MD',
  zip text not null,
  beds int,
  baths numeric,
  sqft int,
  price bigint not null,
  status text not null default 'for_sale' check (status in ('for_sale', 'sold', 'pending', 'for_rent')),
  photo_url text,
  zillow_url text,
  description text,
  featured boolean not null default false,
  open_house_date timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_featured_idx on public.listings(featured) where featured = true;

create table if not exists public.open_house_signins (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete set null,
  listing_address text,
  name text not null,
  email text not null,
  phone text,
  working_with_agent boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists signins_created_idx on public.open_house_signins(created_at desc);
create index if not exists signins_listing_idx on public.open_house_signins(listing_id);

-- Row Level Security
alter table public.listings enable row level security;
alter table public.open_house_signins enable row level security;

-- Public read on listings
drop policy if exists "Listings are publicly readable" on public.listings;
create policy "Listings are publicly readable"
  on public.listings for select
  using (true);

-- Anonymous can write listings (admin-only via PIN gate on the frontend; harden later with auth)
drop policy if exists "Anyone can write listings" on public.listings;
create policy "Anyone can write listings"
  on public.listings for all
  using (true)
  with check (true);

-- Anyone can submit a sign-in
drop policy if exists "Anyone can insert signins" on public.open_house_signins;
create policy "Anyone can insert signins"
  on public.open_house_signins for insert
  with check (true);

-- Anyone can read signins (admin-only via PIN gate on the frontend; harden later with auth)
drop policy if exists "Anyone can read signins" on public.open_house_signins;
create policy "Anyone can read signins"
  on public.open_house_signins for select
  using (true);

drop policy if exists "Anyone can delete signins" on public.open_house_signins;
create policy "Anyone can delete signins"
  on public.open_house_signins for delete
  using (true);
