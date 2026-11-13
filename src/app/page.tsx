import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Resume } from '@/components/sections/resume';
import { Contact } from '@/components/sections/contact';
import { SwarmIntro } from '@/components/swarm-intro';
import { Skills } from '@/components/sections/skills';
import { DoorTransitionProvider } from '@/components/ui/door-transition';
import { SnowfallEffect } from '@/components/snowfall-effect';
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider';
import { ConsoleEasterEgg } from '@/components/console-easter-egg';

export default function Home() {
  return (
    <DoorTransitionProvider>
      <SmoothScrollProvider>
        <div className="flex min-h-screen flex-col">
          <ConsoleEasterEgg />
          {/* Swarm Cursors rebuild & prototyping intro animation */}
          <SwarmIntro />
          <SnowfallEffect />
          <Header />
          <main className="flex-1">
            <Hero />
            <Portfolio />
            <Skills />
            <Resume />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </DoorTransitionProvider>
  );
}
