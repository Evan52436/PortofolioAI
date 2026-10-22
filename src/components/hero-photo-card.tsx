'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { SnowCap } from '@/components/ui/snow-cap';

interface HeroPhotoCardProps {
  frontPhoto: ImagePlaceholder;
  backPhoto: ImagePlaceholder;
}

export function HeroPhotoCard({ frontPhoto, backPhoto }: HeroPhotoCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePhotoClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      onClick={handlePhotoClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePhotoClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Click to flip profile photo"
      className="group relative h-full w-full cursor-pointer perspective-1000 focus:outline-none"
    >
      <SnowCap size="lg" flingTrigger={isFlipped} />
      <div
        className={`relative h-full w-full rounded-2xl sm:rounded-3xl transition-all duration-700 ease-in-out transform-style-3d shadow-xl hover:shadow-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl backface-hidden border-2 border-border/80 bg-muted/40">
          <Image
            src={frontPhoto.imageUrl}
            alt={frontPhoto.description}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl backface-hidden rotate-y-180 border-2 border-border/80 bg-muted/40">
          <Image
            src={backPhoto.imageUrl}
            alt={backPhoto.description}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Top-Right Flip Button: Almost fully transparent, only visible when photo is hovered */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handlePhotoClick();
        }}
        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-lg bg-background/25 hover:bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm border border-border/30 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 select-none pointer-events-none group-hover:pointer-events-auto"
        aria-label="Flip photo"
      >
        <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
        <span>flip</span>
      </button>
    </div>
  );
}
