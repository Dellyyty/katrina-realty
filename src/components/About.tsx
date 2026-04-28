import { agent } from '../data/agent';

export default function About() {
  return (
    <section id="about" className="relative w-full bg-white py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 sm:gap-20 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: '#6F6F6F' }}>
            About
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
            style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
          >
            Meet <em style={{ color: '#6F6F6F' }}>Katrina.</em>
          </h2>
          <p className="mt-8 text-base sm:text-lg leading-relaxed" style={{ color: '#6F6F6F' }}>
            {agent.bio}
          </p>

          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
              Specialties &amp; Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.certifications.map((c) => (
                <span
                  key={c}
                  className="text-xs sm:text-sm px-4 py-1.5 rounded-full bg-black text-white"
                >
                  {c}
                </span>
              ))}
              {agent.specialties.map((s) => {
                const highlighted = s === 'First Time Homebuyers' || s === 'Luxury Homes';
                return (
                  <span
                    key={s}
                    className={
                      highlighted
                        ? 'text-xs sm:text-sm px-4 py-1.5 rounded-full bg-black text-white'
                        : 'text-xs sm:text-sm px-4 py-1.5 rounded-full border border-black/10 text-black'
                    }
                  >
                    {s}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <div className="font-display text-3xl text-black">{agent.totalSales}</div>
              <div className="text-xs uppercase tracking-[0.15em] mt-1" style={{ color: '#6F6F6F' }}>
                Total Sales
              </div>
            </div>
            <div>
              <div className="font-display text-3xl text-black">{agent.salesLast12Months}</div>
              <div className="text-xs uppercase tracking-[0.15em] mt-1" style={{ color: '#6F6F6F' }}>
                Sales Last 12 Months
              </div>
            </div>
            <div>
              <div className="font-display text-3xl text-black">{agent.rating.toFixed(1)}</div>
              <div className="text-xs uppercase tracking-[0.15em] mt-1" style={{ color: '#6F6F6F' }}>
                Zillow Rating
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-100">
            <img
              src={agent.photoPath}
              alt={agent.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="mt-6 text-center md:text-left">
            <p className="font-display text-2xl text-black">{agent.name}</p>
            <p className="text-sm mt-1" style={{ color: '#6F6F6F' }}>
              {agent.title} · {agent.brokerage}
            </p>
            <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 mt-4">
              <a
                href={agent.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs border-b border-black/30 pb-0.5 hover:border-black transition-colors text-black"
              >
                Samson Properties Profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
              <a
                href={agent.zillowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs border-b border-black/15 pb-0.5 hover:border-black transition-colors"
                style={{ color: '#6F6F6F' }}
              >
                Zillow · 5.0 ★
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
