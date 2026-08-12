import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Listings from '../components/Listings';
import ServiceAreas from '../components/ServiceAreas';
import OpenHouseForm from '../components/OpenHouseForm';
import Reviews from '../components/Reviews';
import BlogTeaser from '../components/BlogTeaser';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <>
      <Hero />
      <About />
      <Listings />
      <ServiceAreas />
      <OpenHouseForm />
      <Reviews />
      <BlogTeaser />
      <Contact />
      <Footer />
    </>
  );
}
