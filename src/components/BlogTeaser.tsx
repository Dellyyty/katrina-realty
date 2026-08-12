import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogIndex, formatPostDate, type BlogPostMeta } from '../lib/blog';

export default function BlogTeaser() {
  const [posts, setPosts] = useState<BlogPostMeta[]>([]);

  useEffect(() => {
    fetchBlogIndex().then((all) => setPosts(all.slice(0, 3))).catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="w-full py-24 sm:py-32 px-6" style={{ background: '#F8F7F4' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: '#6F6F6F' }}>
            From the Blog
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black"
            style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
          >
            Local insight, <em style={{ color: '#6F6F6F' }}>fresh daily.</em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group rounded-2xl bg-white border border-black/10 p-8 flex flex-col transition-all duration-200 hover:border-black/30 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-xs" style={{ color: '#6F6F6F' }}>
                <span className="rounded-full bg-[#F8F7F4] px-3 py-1 text-black">{p.category}</span>
                <span>{formatPostDate(p.date)}</span>
              </div>
              <h3
                className="font-display text-2xl mt-5 text-black group-hover:opacity-70 transition-opacity"
                style={{ lineHeight: 1.15, letterSpacing: '-0.5px' }}
              >
                {p.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed flex-1" style={{ color: '#6F6F6F' }}>
                {p.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-block rounded-full px-10 py-4 text-sm bg-black text-white transition-transform hover:scale-[1.03]"
          >
            Read the Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
