import { useMemo, useState } from 'react';
import { samson, isJustListed, type SamsonListing } from '../lib/samson';

const KATRINA_SITE = 'https://katrinakirtonsherrod.samsonproperties.net';

const fmtPrice = (n: number, type: string): string => {
  if (type === 'For Rent') {
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)}/mo`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
};

const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

type Filter = 'all' | 'for_sale' | 'rent';

export default function Listings() {
  const [filter, setFilter] = useState<Filter>('all');

  const all = samson.listings;

  const filtered = useMemo(() => {
    if (filter === 'rent') return all.filter((l) => l.property_type === 'For Rent');
    if (filter === 'for_sale') return all.filter((l) => l.property_type !== 'For Rent');
    return all;
  }, [all, filter]);

  const lastUpdated = useMemo(() => {
    if (!samson.scraped_at) return null;
    const d = new Date(samson.scraped_at);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  return (
    <section id="listings" className="relative w-full py-24 sm:py-32 px-6" style={{ background: '#F8F7F4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
              Just Listed
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
              style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              Homes <em style={{ color: '#6F6F6F' }}>worth</em> the journey.
            </h2>
            {lastUpdated && (
              <p className="text-xs mt-3" style={{ color: '#6F6F6F' }}>
                Live from SAMSON PROPERTIES · synced {lastUpdated}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>
              All ({all.length})
            </FilterBtn>
            <FilterBtn active={filter === 'for_sale'} onClick={() => setFilter('for_sale')}>
              For Sale
            </FilterBtn>
            <FilterBtn active={filter === 'rent'} onClick={() => setFilter('rent')}>
              For Rent
            </FilterBtn>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: '#6F6F6F' }}>
            No listings in this view.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href={KATRINA_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm border-b border-black/30 pb-1 hover:border-black transition-colors text-black"
          >
            See all listings on SAMSON PROPERTIES
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

function ListingCard({ listing }: { listing: SamsonListing }) {
  const justListed = isJustListed(listing);

  return (
    <a
      href={listing.url}
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
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1">
              <path d="M3 12l9-9 9 9M5 10v10h14V10" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          {justListed && (
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-black text-white">
              Just Listed
            </span>
          )}
          <span className="text-[10px] font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-white/95 text-black">
            {listing.property_type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="font-display text-2xl text-black" style={{ letterSpacing: '-0.5px' }}>
          {fmtPrice(listing.price, listing.property_type)}
        </div>
        <div className="mt-2 text-sm text-black">{listing.address}</div>
        <div className="text-sm" style={{ color: '#6F6F6F' }}>
          {listing.city}, {listing.state} {listing.zip}
        </div>

        <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-3 gap-2 text-xs">
          <Spec label="Beds" value={listing.beds !== null && listing.beds > 0 ? String(listing.beds) : '—'} />
          <Spec label="Baths" value={listing.baths !== null && listing.baths > 0 ? String(listing.baths) : '—'} />
          <Spec label="SqFt" value={listing.sqft && listing.sqft > 0 ? fmtNum(listing.sqft) : '—'} />
        </div>
      </div>
    </a>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="uppercase tracking-wider text-[10px]" style={{ color: '#6F6F6F' }}>
        {label}
      </div>
      <div className="text-sm text-black mt-0.5">{value}</div>
    </div>
  );
}
