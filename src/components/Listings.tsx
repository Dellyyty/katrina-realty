import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { seedListings } from '../data/listings';
import type { Listing } from '../lib/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [filter, setFilter] = useState<'for_sale' | 'sold' | 'all'>('for_sale');

  useEffect(() => {
    if (!supabaseConfigured || !supabase) return;
    void (async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setListings(data as Listing[]);
      }
    })();
  }, []);

  const filtered = listings.filter((l) => filter === 'all' || l.status === filter);

  return (
    <section id="listings" className="relative w-full py-24 sm:py-32 px-6" style={{ background: '#F8F7F4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
              Listings
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
              style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              Homes <em style={{ color: '#6F6F6F' }}>worth</em> the journey.
            </h2>
          </div>
          <div className="flex gap-2">
            <FilterBtn active={filter === 'for_sale'} onClick={() => setFilter('for_sale')}>For Sale</FilterBtn>
            <FilterBtn active={filter === 'sold'} onClick={() => setFilter('sold')}>Recently Sold</FilterBtn>
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterBtn>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: '#6F6F6F' }}>
            No listings in this view yet.
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href="https://www.zillow.com/profile/KatrinaKirtonSherrod"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm border-b border-black/30 pb-1 hover:border-black transition-colors text-black"
          >
            View all 58 listings &amp; sales on Zillow
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-5 py-2 rounded-full border transition-colors ${
        active
          ? 'bg-black text-white border-black'
          : 'bg-transparent text-[#6F6F6F] border-black/15 hover:text-black hover:border-black/40'
      }`}
    >
      {children}
    </button>
  );
}

const KATRINA_ZILLOW = 'https://www.zillow.com/profile/KatrinaKirtonSherrod';

function ListingCard({ listing }: { listing: Listing }) {
  const statusLabel = {
    for_sale: 'For Sale',
    sold: 'Sold',
    pending: 'Pending',
    for_rent: 'For Rent',
  }[listing.status];

  const linkUrl = listing.zillow_url ?? KATRINA_ZILLOW;

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-sm overflow-hidden border border-black/5 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-200 to-stone-300 overflow-hidden">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.address}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1">
              <path d="M3 12l9-9 9 9M5 10v10h14V10" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              listing.status === 'for_sale'
                ? 'bg-black text-white'
                : listing.status === 'sold'
                ? 'bg-white/90 text-black'
                : 'bg-white/90 text-black'
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="font-display text-2xl text-black" style={{ letterSpacing: '-0.5px' }}>
          {fmt(listing.price)}
        </div>
        <div className="mt-2 text-sm text-black">{listing.address}</div>
        <div className="text-sm" style={{ color: '#6F6F6F' }}>
          {listing.city}, {listing.state} {listing.zip}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: '#6F6F6F' }}>
          {listing.beds !== null && <span>{listing.beds} bed</span>}
          {listing.baths !== null && <span>{listing.baths} bath</span>}
          {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
        </div>
      </div>
    </a>
  );
}
