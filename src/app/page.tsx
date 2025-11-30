'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Skills } from '@/components/sections/skills';
import { Resume } from '@/components/sections/resume';
import { Contact } from '@/components/sections/contact';
import { LoadingScreen } from '@/components/loading-screen';

export default function Home() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onLoaded={() => setLoading(false)} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
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
  );
}
