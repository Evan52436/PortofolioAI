'use client';

import { useState } from 'react';
import Image from 'next/image';
import { studentData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowDown, RefreshCw, Sparkles } from 'lucide-react';

export function Hero() {
  const photos = studentData.profilePictures && studentData.profilePictures.length > 0
    ? studentData.profilePictures
    : [studentData.profilePicture];

  const [isFlipped, setIsFlipped] = useState(false);

  const handlePhotoClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const frontPhoto = photos[0];
  const backPhoto = photos[1] || photos[0];

  return (
    <section id="home" className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {studentData.name}
            </h1>
            <div className="mb-2 text-lg font-medium text-primary md:text-xl">
              {studentData.major.split(' & ').map((part, index) => (
                <p key={index}>{part}</p>
              ))}
            </div>
            <p className="max-w-xl text-muted-foreground md:text-lg">
              {studentData.bio}
            </p>
            <Button asChild size="lg" className="mt-8 transition-transform duration-300 hover:scale-105">
              <a href="#contact">
                Contact Me <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="relative mx-auto w-fit">
            {/* Interactive 3D Flip Profile Container */}
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
              className="group relative cursor-pointer perspective-1000 focus:outline-none"
            >
              <div
                className={`relative h-64 w-64 rounded-full shadow-lg transition-all duration-600 ease-in-out transform-style-3d md:h-80 md:w-80 lg:h-96 lg:w-96 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-primary/40 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 overflow-hidden rounded-full backface-hidden border-4 border-background/60">
                  <Image
                    src={frontPhoto.imageUrl}
                    alt={frontPhoto.description}
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={frontPhoto.imageHint}
                    priority
                  />
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 overflow-hidden rounded-full backface-hidden rotate-y-180 border-4 border-background/60">
                  <Image
                    src={backPhoto.imageUrl}
                    alt={backPhoto.description}
                    fill
                    sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={backPhoto.imageHint}
                  />
                </div>
              </div>

              {/* Subtle Easter-Egg Hint Badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-md backdrop-blur-md border border-border/50 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary select-none z-10">
                <RefreshCw className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" />
                <span className="hidden group-hover:inline transition-all duration-300">flip</span>
              </div>
            </div>

            {/* Glowing Backdrop Ambient Lights */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-accent opacity-20 blur-2xl pointer-events-none" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary opacity-20 blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

