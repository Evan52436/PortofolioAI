'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    __swarmRebuild?: {
      toggle: () => void;
      start: () => void;
      stop: (reveal?: boolean) => void;
      restart: () => void;
      app: any;
      debug: any;
    };
  }
}

export function SwarmIntro() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const startSwarm = () => {
      if (window.__swarmRebuild) {
        window.__swarmRebuild.start();
      } else {
        const existingScript = document.querySelector('script[src="/swarm-rebuild.js"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = '/swarm-rebuild.js';
          script.async = true;
          document.body.appendChild(script);
        }
      }
    };

    // Give DOM a moment to ensure fonts, hydration, and layout are stable
    const timer = setTimeout(startSwarm, 150);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}
