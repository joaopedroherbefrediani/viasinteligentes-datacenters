import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ContentProvider } from './lib/useSiteContent';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Infrastructure } from './sections/Infrastructure';
import { Process } from './sections/Process';
import { Services } from './sections/Services';
import { Sustainability } from './sections/Sustainability';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ContentProvider>
        <a
          href="#sobre"
          className="sr-only z-[60] rounded-full bg-brand-green px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Pular para o conteúdo
        </a>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Infrastructure />
          <Process />
          <Sustainability />
          <Contact />
        </main>
        <Footer />
      </ContentProvider>
    </MotionConfig>
  );
}
