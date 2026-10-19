'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { animate, scroll, frame, cancelFrame, easeInOut } from 'motion';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, any>) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Lenis smooths the scroll. Motion's frame loop drives it.
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    window.lenis = lenis;

    // 2. "setup" runs before Motion measures scroll in "read", so scroll()
    // sees the scroll position Lenis writes in the same frame.
    const frameHandle = frame.setup(({ timestamp }) => {
      lenis.raf(timestamp);
    }, true);

    // 3. Scroll-linked progress bar: hardware accelerated with Motion's scroll() and animate()
    const progressBar = document.querySelector<HTMLElement>('.lenis-progress');
    let cancelScrollProgress: (() => void) | undefined;
    if (progressBar) {
      cancelScrollProgress = scroll(
        animate(
          progressBar,
          { transform: ['scaleX(0)', 'scaleX(1)'] },
          { ease: 'linear' }
        )
      );
    }

    return () => {
      cancelFrame(frameHandle);
      cancelScrollProgress?.();
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete window.lenis;
      }
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: Record<string, any>) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.4,
        easing: easeInOut,
        ...options,
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {/* Scroll-linked progress bar made with Motion and Lenis */}
      <div
        className="lenis-progress fixed top-0 left-0 right-0 h-[2.5px] bg-primary origin-left z-[9999] pointer-events-none"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
      {children}
    </SmoothScrollContext.Provider>
  );
}
