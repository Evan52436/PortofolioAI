'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(onLoaded, 500); // wait half a second before fading out
            return 100;
          }
          return prev + 20;
        });
      }, 100); // fast progress
      return () => clearInterval(interval);
    }, 500); // initial delay
    
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Evan Pranawa Armansyah</h1>
        <Progress value={progress} className="mx-auto h-2 w-64 md:w-80" />
      </div>
    </div>
  );
}
