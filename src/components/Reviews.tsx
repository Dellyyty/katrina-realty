import { reviews } from '../data/reviews';

export default function Reviews() {
  return (
    <section id="reviews" className="relative w-full bg-white py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
            Client Stories
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
            style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
          >
            Words from <em style={{ color: '#6F6F6F' }}>the people</em> who matter most.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <article key={r.id} className="border border-black/10 rounded-sm p-8 flex flex-col">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < r.rating ? '#000' : 'none'}
                    stroke="#000"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="font-display text-xl text-black flex-1" style={{ lineHeight: 1.3 }}>
                "{r.body}"
              </p>
              <div className="mt-8 pt-6 border-t border-black/10">
                <div className="text-sm text-black">{r.reviewer_name}</div>
                <div className="text-xs mt-1" style={{ color: '#6F6F6F' }}>
                  {r.source} · {new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
