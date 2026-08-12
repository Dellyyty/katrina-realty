import { useState } from 'react';

const encode = (data: Record<string, string>): string =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

export default function BlogSubscribe({ source }: { source: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'blog-subscribe', email, source, 'bot-field': '' }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl px-8 py-10 text-center" style={{ background: '#F8F7F4' }}>
        <p className="font-display text-2xl text-black">You're on the list.</p>
        <p className="mt-2 text-sm" style={{ color: '#6F6F6F' }}>
          Katrina will send local market insight straight to your inbox. Welcome home.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl px-8 py-10" style={{ background: '#F8F7F4' }}>
      <p className="text-xs uppercase tracking-[0.2em] mb-3 text-center" style={{ color: '#6F6F6F' }}>
        Stay in the Know
      </p>
      <p className="font-display text-2xl sm:text-3xl text-black text-center" style={{ letterSpacing: '-0.5px' }}>
        Local market insight, <em style={{ color: '#6F6F6F' }}>no fluff.</em>
      </p>
      <p className="mt-3 text-sm text-center max-w-md mx-auto" style={{ color: '#6F6F6F' }}>
        Get Katrina's latest MD · DC · PA market notes and homeowner tips by email.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm text-black placeholder:text-[#6F6F6F] focus:outline-none focus:border-black/40"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-full px-8 py-3 text-sm bg-black text-white transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {status === 'submitting' ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-3 text-xs text-center text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
