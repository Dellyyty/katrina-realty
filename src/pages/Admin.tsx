import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import type { Listing, OpenHouseSignin } from '../lib/types';
import { seedListings } from '../data/listings';

const ADMIN_PIN_HASH = import.meta.env.VITE_ADMIN_PIN_HASH as string | undefined;

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const csv = (rows: OpenHouseSignin[]): string => {
  const headers = ['Date', 'Listing', 'Name', 'Email', 'Phone', 'Has Agent', 'Notes'];
  const lines = rows.map((r) =>
    [
      new Date(r.created_at).toLocaleString(),
      r.listing_address ?? '',
      r.name,
      r.email,
      r.phone,
      r.working_with_agent ? 'Yes' : 'No',
      (r.notes ?? '').replace(/"/g, '""'),
    ]
      .map((v) => `"${v}"`)
      .join(',')
  );
  return [headers.join(','), ...lines].join('\n');
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [tab, setTab] = useState<'signins' | 'listings'>('signins');

  useEffect(() => {
    if (sessionStorage.getItem('kks_admin') === '1') setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!ADMIN_PIN_HASH) {
      // Dev fallback: PIN "1234"
      if (pin === '1234') {
        sessionStorage.setItem('kks_admin', '1');
        setAuthed(true);
        return;
      }
      setPinError('Invalid PIN. (Configure VITE_ADMIN_PIN_HASH in env.)');
      return;
    }

    const hash = await sha256(pin);
    if (hash === ADMIN_PIN_HASH.toLowerCase()) {
      sessionStorage.setItem('kks_admin', '1');
      setAuthed(true);
    } else {
      setPinError('Invalid PIN.');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="font-display text-4xl text-black mb-2" style={{ letterSpacing: '-1px' }}>
            Admin
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6F6F6F' }}>
            Enter your PIN to manage listings and sign-ins.
          </p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-2xl tracking-[0.5em] border border-black/15 px-6 py-4 rounded-sm outline-none focus:border-black"
            autoFocus
          />
          {pinError && <div className="text-sm text-red-700 mt-3">{pinError}</div>}
          <button
            type="submit"
            className="w-full mt-6 rounded-full px-10 py-4 text-sm bg-black text-white transition-transform hover:scale-[1.02]"
          >
            Enter
          </button>
          <a href="/" className="block text-center text-xs mt-6" style={{ color: '#6F6F6F' }}>
            ← Back to site
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="font-display text-2xl text-black">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm" style={{ color: '#6F6F6F' }}>
              View Site
            </a>
            <button
              onClick={() => {
                sessionStorage.removeItem('kks_admin');
                setAuthed(false);
              }}
              className="text-sm text-black hover:opacity-70"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-black/10">
          <TabBtn active={tab === 'signins'} onClick={() => setTab('signins')}>
            Open House Sign-Ins
          </TabBtn>
          <TabBtn active={tab === 'listings'} onClick={() => setTab('listings')}>
            Listings
          </TabBtn>
        </div>

        {tab === 'signins' && <SigninsTab />}
        {tab === 'listings' && <ListingsTab />}
      </div>
    </div>
  );
}

function TabBtn({
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
      className={`px-4 py-3 text-sm transition-colors border-b-2 -mb-px ${
        active ? 'border-black text-black' : 'border-transparent text-[#6F6F6F] hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}

function SigninsTab() {
  const [signins, setSignins] = useState<OpenHouseSignin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabaseConfigured || !supabase) {
      setError('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars.');
      setLoading(false);
      return;
    }
    void (async () => {
      const { data, error } = await supabase
        .from('open_house_signins')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setSignins((data ?? []) as OpenHouseSignin[]);
      setLoading(false);
    })();
  }, []);

  const exportCsv = () => {
    const blob = new Blob([csv(signins)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-house-signins-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ color: '#6F6F6F' }}>Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl text-black">Sign-Ins ({signins.length})</h2>
        <button
          onClick={exportCsv}
          disabled={signins.length === 0}
          className="rounded-full px-6 py-2.5 text-sm bg-black text-white disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-sm mb-6">
          {error}
        </div>
      )}

      {signins.length === 0 && !error && (
        <div className="text-center py-16 border border-dashed border-black/10 rounded-sm" style={{ color: '#6F6F6F' }}>
          No sign-ins yet. They'll appear here as visitors fill out the form.
        </div>
      )}

      {signins.length > 0 && (
        <div className="overflow-x-auto border border-black/10 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider" style={{ color: '#6F6F6F' }}>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Has Agent</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {signins.map((s) => (
                <tr key={s.id} className="border-b border-black/5 hover:bg-stone-50">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{s.listing_address ?? '—'}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3"><a href={`mailto:${s.email}`} className="underline">{s.email}</a></td>
                  <td className="px-4 py-3">{s.phone || '—'}</td>
                  <td className="px-4 py-3">{s.working_with_agent ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{s.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ListingsTab() {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Partial<Listing> | null>(null);

  const refresh = async () => {
    if (!supabaseConfigured || !supabase) return;
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else if (data) setListings(data as Listing[]);
  };

  useEffect(() => {
    if (!supabaseConfigured) {
      setError('Supabase not configured. Showing seed data only.');
      setLoading(false);
      return;
    }
    void refresh().then(() => setLoading(false));
  }, []);

  const saveListing = async () => {
    if (!editing || !supabase) return;
    const payload = {
      address: editing.address ?? '',
      city: editing.city ?? '',
      state: editing.state ?? 'MD',
      zip: editing.zip ?? '',
      beds: editing.beds ?? null,
      baths: editing.baths ?? null,
      sqft: editing.sqft ?? null,
      price: editing.price ?? 0,
      status: editing.status ?? 'for_sale',
      photo_url: editing.photo_url ?? null,
      zillow_url: editing.zillow_url ?? null,
      description: editing.description ?? null,
      featured: editing.featured ?? false,
      open_house_date: editing.open_house_date ?? null,
    };
    if (editing.id) {
      await supabase.from('listings').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('listings').insert(payload);
    }
    setEditing(null);
    await refresh();
  };

  const deleteListing = async (id: string) => {
    if (!supabase || !confirm('Delete this listing?')) return;
    await supabase.from('listings').delete().eq('id', id);
    await refresh();
  };

  if (loading) return <div style={{ color: '#6F6F6F' }}>Loading…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl text-black">Listings ({listings.length})</h2>
        <button
          onClick={() =>
            setEditing({
              address: '',
              city: '',
              state: 'MD',
              zip: '',
              price: 0,
              status: 'for_sale',
              featured: false,
            })
          }
          className="rounded-full px-6 py-2.5 text-sm bg-black text-white"
        >
          + New Listing
        </button>
      </div>

      {error && (
        <div className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((l) => (
          <div key={l.id} className="border border-black/10 rounded-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="font-display text-xl text-black">{fmt(l.price)}</div>
              <span className="text-xs px-2 py-1 rounded-full bg-stone-100">{l.status}</span>
            </div>
            <div className="text-sm">{l.address}</div>
            <div className="text-xs" style={{ color: '#6F6F6F' }}>
              {l.city}, {l.state} {l.zip}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditing(l)}
                className="text-xs px-3 py-1 border border-black/15 rounded-full hover:border-black"
              >
                Edit
              </button>
              <button
                onClick={() => deleteListing(l.id)}
                className="text-xs px-3 py-1 border border-red-300 text-red-700 rounded-full hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-sm w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-black mb-4">
              {editing.id ? 'Edit Listing' : 'New Listing'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Address" value={editing.address ?? ''} onChange={(v) => setEditing({ ...editing, address: v })} />
              <Input label="City" value={editing.city ?? ''} onChange={(v) => setEditing({ ...editing, city: v })} />
              <Input label="State" value={editing.state ?? ''} onChange={(v) => setEditing({ ...editing, state: v })} />
              <Input label="Zip" value={editing.zip ?? ''} onChange={(v) => setEditing({ ...editing, zip: v })} />
              <Input label="Beds" type="number" value={String(editing.beds ?? '')} onChange={(v) => setEditing({ ...editing, beds: v ? Number(v) : null })} />
              <Input label="Baths" type="number" value={String(editing.baths ?? '')} onChange={(v) => setEditing({ ...editing, baths: v ? Number(v) : null })} />
              <Input label="Sqft" type="number" value={String(editing.sqft ?? '')} onChange={(v) => setEditing({ ...editing, sqft: v ? Number(v) : null })} />
              <Input label="Price" type="number" value={String(editing.price ?? 0)} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: '#6F6F6F' }}>Status</label>
                <select
                  value={editing.status ?? 'for_sale'}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as Listing['status'] })}
                  className="w-full border border-black/15 rounded-sm px-3 py-2 text-sm"
                >
                  <option value="for_sale">For Sale</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="for_rent">For Rent</option>
                </select>
              </div>
              <Input label="Photo URL" value={editing.photo_url ?? ''} onChange={(v) => setEditing({ ...editing, photo_url: v })} className="sm:col-span-2" />
              <Input label="Zillow URL" value={editing.zillow_url ?? ''} onChange={(v) => setEditing({ ...editing, zillow_url: v })} className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: '#6F6F6F' }}>Description</label>
                <textarea
                  rows={3}
                  value={editing.description ?? ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-black/15 rounded-sm px-3 py-2 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                <span className="text-sm">Featured on homepage</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveListing} className="flex-1 rounded-full bg-black text-white py-3 text-sm">Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-black/15 py-3 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: '#6F6F6F' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-black/15 rounded-sm px-3 py-2 text-sm outline-none focus:border-black"
      />
    </div>
  );
}
