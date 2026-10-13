'use client';

import { useState, useEffect } from 'react';

const TOTAL_BLOCKS = 20;
const REVEAL = { whoami: 5, role: 22, load: 40 };

function Prompt() {
  return (
    <span className="mr-1.5 select-none">
      <span className="text-muted-foreground">[</span>
      <span className="font-semibold text-foreground">chargerleptop</span>
      <span className="text-muted-foreground">@</span>
      <span className="text-accent">Archpad</span>
      <span className="text-muted-foreground">]</span>
      <span className="text-primary">$</span>{' '}
    </span>
  );
}

export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Loading is done: hold for a second, then reveal the finished
            // prompt, and only fade out after it has been visible a moment.
            setTimeout(() => setReady(true), 1000);
            setTimeout(() => {
              setIsLoaded(true);
              setTimeout(onLoaded, 500); // wait for fade out
            }, 1800);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  const loadProgress =
    progress <= REVEAL.load
      ? 0
      : Math.round(((progress - REVEAL.load) / (100 - REVEAL.load)) * 100);
  const filled = Math.round((loadProgress / 100) * TOTAL_BLOCKS);
  const bar = '█'.repeat(filled) + '░'.repeat(TOTAL_BLOCKS - filled);

  const shown = (at: number) => (progress >= at ? 'opacity-100' : 'opacity-0');

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-xl transition-opacity duration-500 ${isLoaded ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card/75 shadow-2xl backdrop-blur-md">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-3">
          <span className="h-3.5 w-3.5 rounded-full bg-primary" />
          <span className="h-3.5 w-3.5 rounded-full bg-accent" />
          <span className="h-3.5 w-3.5 rounded-full bg-muted-foreground/40" />
          <p className="ml-2 font-code text-sm text-muted-foreground">
            chargerleptop — bash
          </p>
        </div>

        {/* Terminal body */}
        <div className="min-h-[30rem] px-7 py-6 font-code text-base leading-relaxed">
          <div className={`mb-3 transition-opacity duration-300 ${shown(REVEAL.whoami)}`}>
            <p>
              <Prompt />
              <span className="text-foreground">whoami</span>
            </p>
            <p className="text-foreground/80">Evan Pranawa Armansyah</p>
          </div>

          <div className={`mb-3 transition-opacity duration-300 ${shown(REVEAL.role)}`}>
            <p>
              <Prompt />
              <span className="text-foreground">cat role.txt</span>
            </p>
            <p className="text-foreground/80">Software Engineer &amp; Cybersecurity Enthusiast</p>
          </div>

          <div className={`mb-3 transition-opacity duration-300 ${shown(REVEAL.load)}`}>
            <p>
              <Prompt />
              <span className="text-foreground">./porfolio-epuy.AppImage</span>
            </p>
            <p className="text-foreground/80">
              <span className="text-primary">{bar}</span>
              <span className="ml-2 tabular-nums text-muted-foreground">{loadProgress}%</span>
            </p>
          </div>

          {/* Finished line + fresh empty prompt: only after the whole load is done */}
          <p
            className={`mb-3 text-accent transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'
              }`}
          >
            ✓ done <span className="text-muted-foreground">— welcome</span>
          </p>

          <p
            className={`flex items-center transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Prompt />
            <span className="inline-block h-4 w-2 animate-pulse bg-foreground" />
          </p>
        </div>
      </div>
    </div>
  );
}