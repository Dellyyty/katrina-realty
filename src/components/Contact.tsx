import { agent } from '../data/agent';

export default function Contact() {
  return (
    <section id="contact" className="relative w-full py-24 sm:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
          Reach Out
        </p>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
          style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
        >
          Let's <em style={{ color: '#6F6F6F' }}>begin</em> the journey.
        </h2>
        <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#6F6F6F' }}>
          Whether you're buying your first home, selling a property, or relocating to the
          DMV, Katrina is ready to help.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {agent.phone && (
            <a
              href={`tel:${agent.phone.replace(/\D/g, '')}`}
              className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors"
            >
              <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Call</div>
              <div className="font-display text-xl text-black mt-2">{agent.phone}</div>
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors"
            >
              <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Email</div>
              <div className="font-display text-xl text-black mt-2 break-all">{agent.email}</div>
            </a>
          )}
          <a
            href={agent.zillowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors"
          >
            <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Zillow</div>
            <div className="font-display text-xl text-black mt-2">View Profile</div>
          </a>
        </div>

        <div className="mt-12">
          <a
            href={`mailto:${agent.email || 'hello@example.com'}`}
            className="inline-block rounded-full px-14 py-5 text-base bg-black text-white transition-transform hover:scale-[1.03]"
          >
            Send a Message
          </a>
        </div>
      </div>
    </section>
  );
}
