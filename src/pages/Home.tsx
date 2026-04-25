import Hero from '../components/Hero';
import About from '../components/About';
import Listings from '../components/Listings';
import ServiceAreas from '../components/ServiceAreas';
import OpenHouseForm from '../components/OpenHouseForm';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Listings />
      <ServiceAreas />
      <OpenHouseForm />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}
