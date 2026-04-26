import { useState } from 'react';
import { samson } from '../lib/samson';

const NETLIFY_FORM_NAME = 'open-house-signin';

const encode = (data: Record<string, string>): string =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

interface FormState {
  name: string;
  email: string;
  phone: string;
  listing_id: string;
  working_with_agent: 'yes' | 'no' | '';
  notes: string;
}

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  listing_id: '',
  working_with_agent: '',
  notes: '',
};

export default function OpenHouseForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const listings = samson.listings.filter((l) => l.property_type !== 'For Rent');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setStatus('error');
      setErrorMsg('Please fill in your name and email.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const selectedListing = listings.find((l) => l.id === form.listing_id);
    const propertyLabel = selectedListing
      ? `${selectedListing.address}, ${selectedListing.city}, ${selectedListing.state}`
      : '';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': NETLIFY_FORM_NAME,
          name: form.name,
          email: form.email,
          phone: form.phone,
          property: propertyLabel,
          working_with_agent: form.working_with_agent === 'yes' ? 'Yes' : 'No',
          notes: form.notes,
          'bot-field': '',
        }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setStatus('success');
      setForm(empty);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not submit. Try again.');
    }
  };

  if (status === 'success') {
    return (
      <section id="open-house" className="relative w-full py-24 sm:py-32 px-6" style={{ background: '#F8F7F4' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
            Thank You
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
            style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
          >
            You're <em style={{ color: '#6F6F6F' }}>signed in.</em>
          </h2>
          <p className="mt-6 text-base leading-relaxed" style={{ color: '#6F6F6F' }}>
            Katrina has your details and will be in touch soon. Welcome home.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-10 rounded-full px-10 py-4 text-sm bg-black text-white transition-transform hover:scale-[1.03]"
          >
            Submit Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="open-house" className="relative w-full py-24 sm:py-32 px-6" style={{ background: '#F8F7F4' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
            Open House Sign-In
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
            style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
          >
            Stop by. <em style={{ color: '#6F6F6F' }}>Sign in.</em>
          </h2>
          <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: '#6F6F6F' }}>
            Visiting an open house? Drop your details below and Katrina will follow up
            with listings, market insights, or simply to say thanks for stopping by.
          </p>
        </div>

        <form
          name={NETLIFY_FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 rounded-sm p-8 sm:p-10 space-y-6"
        >
          <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
          <p hidden>
            <label>Don't fill this out: <input name="bot-field" /></label>
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Full Name *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Email *">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Phone">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Which property?">
              <select
                value={form.listing_id}
                onChange={(e) => setForm({ ...form, listing_id: e.target.value })}
                className="input"
              >
                <option value="">— Select —</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.address}, {l.city}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Are you currently working with another agent?">
            <div className="flex gap-3 mt-2">
              {(['yes', 'no'] as const).map((v) => (
                <label
                  key={v}
                  className={`flex-1 text-center text-sm py-3 rounded-sm border cursor-pointer transition-colors ${
                    form.working_with_agent === v
                      ? 'bg-black text-white border-black'
                      : 'border-black/15 text-black hover:border-black/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="agent"
                    value={v}
                    checked={form.working_with_agent === v}
                    onChange={() => setForm({ ...form, working_with_agent: v })}
                    className="sr-only"
                  />
                  {v === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Anything you'd like Katrina to know?">
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input resize-none"
            />
          </Field>

          {status === 'error' && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
              {errorMsg || 'Something went wrong. Please try again.'}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-full px-10 py-5 text-base bg-black text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            {status === 'submitting' ? 'Signing you in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.15);
          padding: 0.875rem 1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: #000;
          border-radius: 2px;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .input:focus {
          border-color: #000;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.15em] mb-2 block" style={{ color: '#6F6F6F' }}>
        {label}
      </span>
      {children}
    </label>
  );
}
