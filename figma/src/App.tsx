import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
