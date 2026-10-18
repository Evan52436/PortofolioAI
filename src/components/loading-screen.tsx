'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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

export function LoadingScreen({ onLoaded }: { onLoaded?: () => void } = {}) {
  const [mounted, setMounted] = useState(false);
  const [terminalIn, setTerminalIn] = useState(false);
  const [terminalOut, setTerminalOut] = useState(false);
  const [step, setStep] = useState(1);
  const [barLoaded, setBarLoaded] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      sessionStorage.setItem('portfolio_booted', '1');
    } catch {
      // ignore
    }
    setTerminalOut(true);
    setTimeout(() => {
      setMounted(false);
      onLoaded?.();
    }, 250);
  }, [onLoaded]);

  useEffect(() => {
    // 1. Session check: only run once per session
    try {
      if (sessionStorage.getItem('portfolio_booted')) {
        onLoaded?.();
        return;
      }
    } catch {
      // ignore
    }

    // 2. Reduced motion check: skip entirely if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        sessionStorage.setItem('portfolio_booted', '1');
      } catch {
        // ignore
      }
      onLoaded?.();
      return;
    }

    setMounted(true);
    setTerminalIn(true);

    // Pacing adjusted to be clearly legible (~3.2s total), skippable anytime
    const t1 = setTimeout(() => setStep(2), 550);
    const t2 = setTimeout(() => {
      setStep(3);
      requestAnimationFrame(() => setBarLoaded(true));
    }, 1250);
    const t3 = setTimeout(() => setStep(4), 2450);
    const t4 = setTimeout(() => {
      try {
        sessionStorage.setItem('portfolio_booted', '1');
      } catch {
        // ignore
      }
      setTerminalOut(true);
    }, 3200);
    const t5 = setTimeout(() => {
      setMounted(false);
      onLoaded?.();
    }, 3650);

    // Allow skip by any key
    const handleKeyDown = () => dismiss();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss, onLoaded]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      onClick={dismiss}
      onTouchStart={dismiss}
      role="button"
      tabIndex={0}
      aria-label="Terminal boot screen. Click or press any key to skip."
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center bg-background/70 px-4 backdrop-blur-xl transition-opacity duration-300 cursor-pointer ${
        terminalOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all ${
          terminalOut
            ? 'terminal-genie-out'
            : terminalIn
            ? 'terminal-genie'
            : 'opacity-0'
        }`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3 select-none">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-primary" />
            <span className="h-3.5 w-3.5 rounded-full bg-accent" />
            <span className="h-3.5 w-3.5 rounded-full bg-muted-foreground/40" />
            <p className="ml-2 font-code text-sm text-muted-foreground">
              chargerleptop — bash
            </p>
          </div>
          <span className="text-xs text-muted-foreground/70 hidden sm:inline">
            [ESC / click to skip]
          </span>
        </div>

        {/* Terminal body */}
        <div className="min-h-[22rem] sm:min-h-[28rem] px-6 sm:px-7 py-5 sm:py-6 font-code text-sm sm:text-base leading-relaxed">
          {/* whoami */}
          <div className={`mb-3 transition-opacity duration-200 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <p>
              <Prompt />
              <span className="text-foreground">whoami</span>
            </p>
            <p className="text-foreground/80">Evan Pranawa Armansyah</p>
          </div>

          {/* role */}
          <div className={`mb-3 transition-opacity duration-200 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <p>
              <Prompt />
              <span className="text-foreground">cat role.txt</span>
            </p>
            <p className="text-foreground/80">Software Engineer &amp; Cybersecurity Enthusiast</p>
          </div>

          {/* appimage progress bar */}
          <div className={`mb-3 transition-opacity duration-200 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <p>
              <Prompt />
              <span className="text-foreground">./portfolio-epuy.AppImage</span>
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="h-3 w-48 sm:w-64 rounded bg-muted/70 overflow-hidden border border-border/70">
                <div
                  className={`h-full bg-primary origin-left transition-transform duration-1000 ease-out ${
                    barLoaded ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{ willChange: 'transform' }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {barLoaded ? '100%' : '0%'}
              </span>
            </div>
          </div>

          {/* Finished line */}
          <p
            className={`mb-3 text-accent transition-opacity duration-200 ${
              step >= 4 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            ✓ done <span className="text-muted-foreground">— welcome</span>
          </p>

          <p
            className={`flex items-center transition-opacity duration-200 ${
              step >= 4 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Prompt />
            <span className="inline-block h-4 w-2 animate-pulse bg-foreground" />
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/60 select-none">
        Click anywhere, tap, or press any key to skip
      </p>
    </div>
  );
}
