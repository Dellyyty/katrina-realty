import { agent } from '../data/agent';

export default function ServiceAreas() {
  return (
    <section id="areas" className="relative w-full py-24 sm:py-32 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 text-white/60">Service Areas</p>
            <h2
              className="font-display text-4xl sm:text-5xl md:text-6xl"
              style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
            >
              Serving the <em className="text-white/60">DMV</em> &amp; beyond.
            </h2>
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-white/70 max-w-md">
              Maryland, Washington D.C., and Pennsylvania. From Baltimore row homes to
              Harford County estates, Katrina knows the streets, the schools, and the
              stories behind every neighborhood.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 self-center">
            {agent.serviceCounties.map((c) => (
              <div key={c} className="flex items-center gap-3 text-sm text-white/80">
                <span className="w-1 h-1 rounded-full bg-white/60" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
