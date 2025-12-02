'use client';

import { useState, useEffect } from 'react';

export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoaded(true);
              setTimeout(onLoaded, 500); // wait for fade out
            }, 300);
            return 100;
          }
          return prev + 1;
        });
      }, 20); 
      return () => clearInterval(interval);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative text-center">
        <h1 
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary"
          style={{
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage: `linear-gradient(to right, black ${progress}%, transparent ${progress}%)`,
            maskImage: `linear-gradient(to right, black ${progress}%, transparent ${progress}%)`,
            transition: 'all 0.1s linear',
          }}
        >
          Evan Pranawa Armansyah
        </h1>
        <h1 
          className="absolute inset-0 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground/20 -z-10"
          aria-hidden="true"
        >
          Evan Pranawa Armansyah
        </h1>
      </div>
    </div>
  );
}
