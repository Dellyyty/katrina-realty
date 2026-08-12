import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BlogSubscribe from '../components/BlogSubscribe';
import { fetchBlogIndex, formatPostDate, type BlogPostMeta } from '../lib/blog';

const PAGE_SIZE = 9;

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostMeta[] | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [category, setCategory] = useState<string>('All');

  useEffect(() => {
    document.title = 'Real Estate Blog | Katrina Kirton Sherrod — MD · DC · PA REALTOR®';
    window.scrollTo(0, 0);
    fetchBlogIndex().then(setPosts).catch(() => setPosts([]));
  }, []);

  const categories = posts ? ['All', ...Array.from(new Set(posts.map((p) => p.category)))] : ['All'];
  const filtered = posts?.filter((p) => category === 'All' || p.category === category) ?? [];
  const shown = filtered.slice(0, visible);

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <header className="max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-14 text-center">
        <p className="text-xs uppercase tracking-[0.2em] mb-4 animate-fade-rise" style={{ color: '#6F6F6F' }}>
          The KKS Home Group Blog
        </p>
        <h1
          className="font-display text-5xl sm:text-6xl md:text-7xl text-black animate-fade-rise-delay"
          style={{ lineHeight: 1, letterSpacing: '-1.5px' }}
        >
          Real estate, <em style={{ color: '#6F6F6F' }}>explained.</em>
        </h1>
        <p className="mt-6 text-base max-w-2xl mx-auto animate-fade-rise-delay-2" style={{ color: '#6F6F6F' }}>
          Market updates, buyer and seller education, and neighborhood insight across Maryland,
          Washington D.C., Pennsylvania, and Delaware — from a full-time local REALTOR®.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setVisible(PAGE_SIZE); }}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                category === c ? 'bg-black text-white' : 'bg-[#F8F7F4] text-[#6F6F6F] hover:text-black'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {posts === null && (
          <p className="text-center py-20 text-sm" style={{ color: '#6F6F6F' }}>Loading posts…</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shown.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group rounded-2xl border border-black/10 p-8 flex flex-col transition-all duration-200 hover:border-black/30 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 text-xs" style={{ color: '#6F6F6F' }}>
                <span className="rounded-full bg-[#F8F7F4] px-3 py-1 text-black">{p.category}</span>
                <span>{p.readTime} min read</span>
              </div>
              <h2
                className="font-display text-2xl mt-5 text-black group-hover:opacity-70 transition-opacity"
                style={{ lineHeight: 1.15, letterSpacing: '-0.5px' }}
              >
                {p.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed flex-1" style={{ color: '#6F6F6F' }}>
                {p.excerpt}
              </p>
              <p className="mt-6 text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>
                {formatPostDate(p.date)}
              </p>
            </Link>
          ))}
        </div>

        {filtered.length > visible && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full px-10 py-4 text-sm bg-black text-white transition-transform hover:scale-[1.03]"
            >
              Load More
            </button>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-20 mb-24">
          <BlogSubscribe source="blog-index" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
