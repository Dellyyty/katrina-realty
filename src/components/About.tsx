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
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((s) => (
                <span
                  key={s}
                  className="text-xs sm:text-sm px-4 py-1.5 rounded-full border border-black/10 text-black"
                >
                  {s}
                </span>
              ))}
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
          </div>
        </div>
      </div>
    </section>
  );
}
