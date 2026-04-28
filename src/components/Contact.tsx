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

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <a
            href={`tel:${agent.phone.replace(/\D/g, '')}`}
            className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors text-center"
          >
            <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Call</div>
            <div className="font-display text-xl text-black mt-2">{agent.phone}</div>
          </a>
          <a
            href={agent.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors text-center"
          >
            <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Listings</div>
            <div className="font-display text-xl text-black mt-2">SAMSON Profile</div>
          </a>
          <a
            href={agent.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors text-center"
          >
            <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Instagram</div>
            <div className="font-display text-xl text-black mt-2">@kkstherealtor</div>
          </a>
          <a
            href={agent.zillowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black/10 rounded-sm p-6 hover:border-black transition-colors text-center"
          >
            <div className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Reviews</div>
            <div className="font-display text-xl text-black mt-2">Zillow · 5.0 ★</div>
          </a>
        </div>

        <div className="mt-12 text-sm" style={{ color: '#6F6F6F' }}>
          <div className="font-medium text-black">{agent.officeName}</div>
          <div className="mt-1">{agent.officeAddress}</div>
        </div>
      </div>
    </section>
  );
}
