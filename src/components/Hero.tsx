import { useEffect, useRef } from 'react';
import NavBar from './NavBar';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const FADE_DURATION = 0.5;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      const v = videoRef.current;
      if (!v) return;
      const dur = v.duration;
      const t = v.currentTime;
      if (Number.isFinite(dur) && dur > 0) {
        let opacity = 1;
        if (t < FADE_DURATION) {
          opacity = t / FADE_DURATION;
        } else if (t > dur - FADE_DURATION) {
          opacity = Math.max(0, (dur - t) / FADE_DURATION);
        }
        v.style.opacity = String(opacity);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      const v = videoRef.current;
      if (!v) return;
      v.style.opacity = '0';
      window.setTimeout(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    void video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Warm cream-to-gold gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBF4E3] via-[#F4E8CC] to-[#E8D4A8]" />

        {/* Visible animated gold orbs — large and on-screen */}
        <div className="absolute top-20 -right-20 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#C99B4A] opacity-40 blur-2xl hero-orb-1" />
        <div className="absolute top-1/2 -left-32 w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#A07832] opacity-30 blur-2xl hero-orb-2" />
        <div className="absolute -bottom-20 right-1/4 w-[360px] h-[360px] sm:w-[580px] sm:h-[580px] rounded-full bg-[#D4A85A] opacity-35 blur-2xl hero-orb-3" />

        {/* Animated flowing architectural lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 800 1200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="100%" stopColor="#C99B4A" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q200,300 400,450 T800,400"
            stroke="url(#lineGrad)"
            strokeWidth="2"
            fill="none"
            className="hero-line-1"
          />
          <path
            d="M0,700 Q300,600 500,750 T800,700"
            stroke="url(#lineGrad)"
            strokeWidth="1.5"
            fill="none"
            className="hero-line-2"
          />
          <path
            d="M0,1000 Q250,900 450,1050 T800,1000"
            stroke="url(#lineGrad)"
            strokeWidth="1"
            fill="none"
            className="hero-line-3"
          />
        </svg>

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Desktop-only video enhancement */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          autoPlay
          preload="metadata"
          className="hidden md:block absolute w-full h-auto object-cover mix-blend-multiply"
          style={{ top: '300px', inset: 'auto 0 0 0', opacity: 0, transition: 'opacity 50ms linear' }}
        />

        {/* Top + bottom soft fade so text always reads cleanly */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
      </div>

      <div className="relative z-10">
        <NavBar onCtaClick={() => scrollTo('contact')} />

        <div
          className="flex flex-col items-center justify-center text-center px-6 pb-40"
          style={{ paddingTop: 'calc(8rem - 75px)' }}
        >
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal animate-fade-rise"
            style={{
              lineHeight: 0.95,
              letterSpacing: '-2.46px',
              color: '#000000',
            }}
          >
            Beyond <em className="not-italic" style={{ color: '#6F6F6F', fontStyle: 'italic' }}>houses,</em> we
            <br className="hidden sm:block" /> find you a place
            <br className="hidden sm:block" /> to call <em className="not-italic" style={{ color: '#6F6F6F', fontStyle: 'italic' }}>home.</em>
          </h1>

          <p
            className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay"
            style={{ color: '#6F6F6F' }}
          >
            Guiding first-time buyers, growing families, and seasoned investors through
            Maryland, Washington D.C., and Pennsylvania. Trusted advisor, practiced negotiator,
            neighborhood expert.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-rise-delay-2">
            <button
              onClick={() => scrollTo('contact')}
              className="rounded-full px-14 py-5 text-base bg-black text-white transition-transform duration-200 hover:scale-[1.03]"
            >
              Begin Journey
            </button>
            <button
              onClick={() => scrollTo('listings')}
              className="rounded-full px-14 py-5 text-base bg-transparent text-black border border-black/10 transition-colors hover:bg-black/5"
            >
              View Listings
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 sm:gap-16 animate-fade-rise-delay-3">
            <Stat value="56" label="Total Sales" />
            <Stat value="5.0" label="Zillow Rating" />
            <Stat value="11+" label="Counties Served" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-display text-4xl sm:text-5xl text-black" style={{ letterSpacing: '-1px' }}>
        {value}
      </div>
      <div className="text-xs sm:text-sm mt-1" style={{ color: '#6F6F6F' }}>{label}</div>
    </div>
  );
}
