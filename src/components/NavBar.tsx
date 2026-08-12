import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavBarProps {
  onCtaClick?: () => void;
}

export default function NavBar({ onCtaClick }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  const handleNav = (id: string) => {
    setMenuOpen(false);
    if (onHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const sectionLink = (id: string, label: string, primary = false) => (
    <button
      onClick={() => handleNav(id)}
      className={`text-sm transition-colors ${primary ? 'text-black hover:opacity-70' : 'text-[#6F6F6F] hover:text-black'}`}
    >
      {label}
    </button>
  );

  return (
    <nav className="relative z-20 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-8 py-6">
        <button
          onClick={() => handleNav('top')}
          aria-label="KKS Home Group — Home"
          className="flex items-center"
        >
          <img
            src="/kks-logo.png"
            alt="KKS Home Group of Samson Properties"
            className="h-28 sm:h-32 w-auto"
          />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {sectionLink('top', 'Home', onHome)}
          {sectionLink('about', 'About')}
          {sectionLink('listings', 'Listings')}
          {sectionLink('open-house', 'Open House')}
          {sectionLink('reviews', 'Reviews')}
          <Link
            to="/blog"
            onClick={() => setMenuOpen(false)}
            className={`text-sm transition-colors ${!onHome ? 'text-black hover:opacity-70' : 'text-[#6F6F6F] hover:text-black'}`}
          >
            Blog
          </Link>
          {sectionLink('contact', 'Contact')}
        </div>

        <button
          onClick={onCtaClick ?? (() => handleNav('contact'))}
          className="hidden md:inline-block rounded-full px-6 py-2.5 text-sm bg-black text-white transition-transform duration-200 hover:scale-[1.03]"
        >
          Begin Journey
        </button>

        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          <button onClick={() => handleNav('top')} className="text-left text-sm text-black">Home</button>
          <button onClick={() => handleNav('about')} className="text-left text-sm text-[#6F6F6F]">About</button>
          <button onClick={() => handleNav('listings')} className="text-left text-sm text-[#6F6F6F]">Listings</button>
          <button onClick={() => handleNav('open-house')} className="text-left text-sm text-[#6F6F6F]">Open House</button>
          <button onClick={() => handleNav('reviews')} className="text-left text-sm text-[#6F6F6F]">Reviews</button>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="text-left text-sm text-[#6F6F6F]">Blog</Link>
          <button onClick={() => handleNav('contact')} className="text-left text-sm text-[#6F6F6F]">Contact</button>
          <button
            onClick={onCtaClick ?? (() => handleNav('contact'))}
            className="rounded-full px-6 py-2.5 text-sm bg-black text-white text-center"
          >
            Begin Journey
          </button>
        </div>
      )}
    </nav>
  );
}
