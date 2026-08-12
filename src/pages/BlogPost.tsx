import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import BlogSubscribe from '../components/BlogSubscribe';
import { agent } from '../data/agent';
import { fetchBlogPost, formatPostDate, type BlogPostFull } from '../lib/blog';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [loaded, setLoaded] = useState<BlogPostFull | null>(null);
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo(0, 0);
    fetchBlogPost(slug)
      .then((p) => {
        setLoaded(p);
        document.title = `${p.title} | Katrina Kirton Sherrod, REALTOR®`;
      })
      .catch(() => setNotFoundSlug(slug));
  }, [slug]);

  const post = loaded && loaded.slug === slug ? loaded : null;
  const notFound = notFoundSlug === slug;

  if (notFound) {
    return (
      <div className="bg-white min-h-screen">
        <NavBar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-4xl text-black">Post not found.</h1>
          <Link to="/blog" className="inline-block mt-8 rounded-full px-8 py-3 text-sm bg-black text-white">
            Back to the Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      {post === null ? (
        <p className="text-center py-32 text-sm" style={{ color: '#6F6F6F' }}>Loading…</p>
      ) : (
        <article className="max-w-3xl mx-auto px-6 sm:px-8 pt-8 pb-20">
          <nav className="text-xs mb-8" style={{ color: '#6F6F6F' }}>
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-black transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{post.category}</span>
          </nav>

          <div className="flex items-center gap-3 text-xs" style={{ color: '#6F6F6F' }}>
            <span className="rounded-full bg-[#F8F7F4] px-3 py-1 text-black">{post.category}</span>
            <span>{formatPostDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl text-black mt-6 animate-fade-rise"
            style={{ lineHeight: 1.05, letterSpacing: '-1.5px' }}
          >
            {post.title}
          </h1>

          <div className="blog-body mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* Branding block + witty quote */}
          <div className="mt-16 rounded-2xl border border-black/10 p-8 sm:p-10">
            <div className="flex items-start gap-5">
              <img
                src={agent.photoPath}
                alt={agent.name}
                className="h-16 w-16 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-display text-2xl text-black" style={{ letterSpacing: '-0.5px' }}>
                  {agent.name}
                </p>
                <p className="text-sm mt-1" style={{ color: '#6F6F6F' }}>
                  {agent.title} · {agent.brokerage} · Licensed in {agent.licensedStates.join(', ')}
                </p>
                <p className="text-sm mt-2" style={{ color: '#6F6F6F' }}>
                  <a href={`tel:${agent.phone.replace(/\D/g, '')}`} className="hover:text-black transition-colors">{agent.phone}</a>
                  {' · '}
                  <a href={`mailto:${agent.email}`} className="hover:text-black transition-colors">{agent.email}</a>
                </p>
                <p className="text-sm mt-1" style={{ color: '#6F6F6F' }}>
                  <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Samson Properties Profile</a>
                  {' · '}
                  <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Instagram</a>
                  {' · '}
                  <a href={agent.zillowUrl} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Zillow Reviews</a>
                </p>
              </div>
            </div>
            <blockquote className="mt-8 pt-6 border-t border-black/10">
              <p className="font-display text-xl text-black italic" style={{ letterSpacing: '-0.3px' }}>
                “{post.quote.text}”
              </p>
              <cite className="block mt-2 text-xs not-italic" style={{ color: '#6F6F6F' }}>
                — {post.quote.by}
              </cite>
            </blockquote>
          </div>

          <div className="mt-10">
            <BlogSubscribe source={`post:${post.slug}`} />
          </div>

          {/* prev / next */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {post.prev ? (
              <Link to={`/blog/${post.prev.slug}`} className="group rounded-2xl border border-black/10 p-6 hover:border-black/30 transition-colors">
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>← Older</p>
                <p className="mt-2 text-sm text-black group-hover:opacity-70">{post.prev.title}</p>
              </Link>
            ) : <span />}
            {post.next && (
              <Link to={`/blog/${post.next.slug}`} className="group rounded-2xl border border-black/10 p-6 text-right hover:border-black/30 transition-colors">
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: '#6F6F6F' }}>Newer →</p>
                <p className="mt-2 text-sm text-black group-hover:opacity-70">{post.next.title}</p>
              </Link>
            )}
          </div>
        </article>
      )}
      <Footer />
    </div>
  );
}
