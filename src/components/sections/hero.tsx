'use client';

import { useState } from 'react';
import Image from 'next/image';
import { studentData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function Hero() {
  const photos =
    studentData.profilePictures && studentData.profilePictures.length > 0
      ? studentData.profilePictures
      : [studentData.profilePicture];

  const [isFlipped, setIsFlipped] = useState(false);

  const handlePhotoClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const frontPhoto = photos[0];
  const backPhoto = photos[1] || photos[0];

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden py-10 sm:py-14 md:py-16 scroll-mt-16"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Whoami, Name, Subtitle, Bio, Buttons, Achievements */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-7">
            <p className="font-code text-sm sm:text-base text-primary/90 font-medium mb-3 tracking-tight select-none">
              chargerleptop@Archpad:~$ whoami
            </p>

            <h1 className="mb-3 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-foreground">
              Evan Pranawa<br />Armansyah
            </h1>

            <h2 className="mb-4 text-lg font-medium text-primary sm:text-xl md:text-2xl tracking-tight">
              Software engineering student and SysAdmin
            </h2>

            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              I&apos;m a Junior System Administrator (SysAdmin) based in Bogor, Indonesia, majoring in CS Cybersecurity &amp; Networking. I build homelab servers and network mapping projects that shape my foundation in cybersecurity, alongside hands-on music experience as a live performer, Event Audio Engineer, and DAW producer.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="bg-[#89abd2] hover:bg-[#789ac1] text-slate-950 font-semibold px-7 py-6 rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              >
                <a href="#contact">Contact me</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-foreground/30 hover:border-foreground/80 hover:bg-foreground/5 text-foreground font-semibold px-7 py-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <a href="#portfolio">See my works</a>
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground/90 font-medium flex flex-wrap items-center justify-center lg:justify-start gap-2 select-none">
              <span>Finalist AI Open Innovation</span>
              <span className="text-muted-foreground/40 font-bold">·</span>
              <span>Top 10 Clash of Cyberheist</span>
              <span className="w-full text-center lg:text-left">Vice President of Devaccto RPL</span>
            </div>
          </div>

          {/* Right Column: Natural Ratio Flippable Photo Card & Corner Status Widget */}
          <div className="lg:col-span-5 flex justify-center items-center w-full">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[420px] aspect-square">
              {/* 3D Flip Card Container */}
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
                <div
                  className={`relative h-full w-full rounded-2xl sm:rounded-3xl transition-all duration-700 ease-in-out transform-style-3d shadow-xl hover:shadow-2xl ${isFlipped ? 'rotate-y-180' : ''
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

              {/* Corner Bottom-Left Overlapping Equalizer Widget (Dense, Landscape, White-Bluish BG, #89abd2 Bars, No Text) */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 z-20 w-36 h-16 sm:w-44 sm:h-20 rounded-xl bg-[#dfe7f2]/95 dark:bg-[#1a2332]/95 border border-[#c4d5e7] dark:border-slate-700/80 p-2.5 sm:p-3 shadow-xl backdrop-blur-md select-none pointer-events-auto flex items-end justify-center">
                <div className="flex items-end justify-between gap-[2px] sm:gap-[2.5px] h-full w-full">
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-1" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-2" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-3" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-4" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-5" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-6" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-7" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-8" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-9" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-10" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-11" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-12" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-13" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-14" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-15" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-16" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-17" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-18" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-19" />
                  <div className="flex-1 h-full bg-[#89abd2] rounded-none animate-eq-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
