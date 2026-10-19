import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Resume } from '@/components/sections/resume';
import { Contact } from '@/components/sections/contact';
import { LoadingScreen } from '@/components/loading-screen';
import { Skills } from '@/components/sections/skills';
import { DoorTransitionProvider } from '@/components/ui/door-transition';
import { SnowfallEffect } from '@/components/snowfall-effect';
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider';

export default function Home() {
  return (
    <DoorTransitionProvider>
      <SmoothScrollProvider>
        <div className="flex min-h-screen flex-col">
          {/* Page renders underneath the loader so the hero shows through the blur */}
          <LoadingScreen />
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
