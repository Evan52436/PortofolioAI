'use client';

import * as React from 'react';
import Image from 'next/image';
import { resume } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { ExperienceModal } from '@/components/experience-modal';

type ExperienceItem = (typeof resume.experience)[number] & {
  image?: ImagePlaceholder;
  images?: ImagePlaceholder[];
  orientation?: 'portrait' | 'landscape' | 'square';
};

// Known aspect ratios for files in /public (width / height)
const KNOWN_ASPECT_RATIOS: Record<string, number> = {
  'dashboard_mobile.png': 0.46,
  'file preview_mobile.png': 0.46,
  'belakang.jpeg': 1.0,
  'epuy.jpeg': 1.0,
  'iroha.jpeg': 1.0,
  'logo.png': 1.0,
  'main.jpeg': 1.0,
  'profile-placeholder.svg': 1.0,
  'preview.png': 1.22,
};

type ImageShape = 'portrait' | 'square' | 'landscape';

function getImageShape(img?: ImagePlaceholder): ImageShape {
  if (!img || !img.imageUrl) return 'landscape';
  const clean = img.imageUrl.toLowerCase().replace(/^\//, '');

  if (KNOWN_ASPECT_RATIOS[clean] !== undefined) {
    const ratio = KNOWN_ASPECT_RATIOS[clean];
    if (ratio < 0.85) return 'portrait';
    if (ratio <= 1.25) return 'square';
    return 'landscape';
  }

  if (clean.includes('mobile') || clean.includes('portrait')) {
    return 'portrait';
  }
  if (clean.includes('square') || clean.includes('avatar') || clean.includes('profile')) {
    return 'square';
  }
  return 'landscape';
}

const BASE_STICKY_TOP = 84;
const STACK_STEP = 24;

export function Resume() {
  const outerRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [selectedExperience, setSelectedExperience] = React.useState<ExperienceItem | null>(null);

  React.useEffect(() => {
    let rafId = 0;

    const updateStackEffects = () => {
      rafId = 0;
      const outers = outerRefs.current;
      const inners = innerRefs.current;
      const count = outers.length;
      if (count === 0) return;

      // 1. Calculate continuous front progress of the stack (0.0 to count - 1)
      let frontProgress = 0;
      for (let j = 0; j < count; j++) {
        const outerJ = outers[j];
        if (!outerJ) continue;
        const stickyJ = BASE_STICKY_TOP + j * STACK_STEP;
        const rectJ = outerJ.getBoundingClientRect();
        const distJ = rectJ.top - stickyJ;

        if (distJ <= 0) {
          // Card j has reached its sticky top
          frontProgress = j;
        } else {
          // Card j is approaching its sticky top
          const prevOuter = j > 0 ? outers[j - 1] : null;
          const stepDist = prevOuter
            ? Math.max(outerJ.offsetTop - prevOuter.offsetTop - STACK_STEP, 300)
            : Math.max(rectJ.height * 0.85, 360);
          const frac = Math.min(Math.max(1 - distJ / stepDist, 0), 1);
          frontProgress = Math.max(0, j - 1) + frac;
          break;
        }
      }

      // 2. Flight timing:
      // Each card takes flightDuration to fly off.
      // Next card starts at step = flightDuration * 0.5 (when the previous card is exactly halfway through).
      const flightDuration = 1.4;
      const step = flightDuration * 0.5; // 0.7: triggers next card when current is at 50%
      const startBase = 2.0; // Card 0 starts when 3 cards have arrived in stack

      for (let i = 0; i < count; i++) {
        const currentInner = inners[i];
        if (!currentInner) continue;

        // Card i only swipes away if there are at least 3 cards ahead in stack (i + 3 < count)
        const canDiscard = i + 3 < count;
        let discardProgress = 0;

        if (canDiscard) {
          const start = startBase + i * step;
          if (frontProgress > start) {
            discardProgress = Math.min(Math.max((frontProgress - start) / flightDuration, 0), 1);
          }
        }

        const direction = i % 2 === 0 ? -1 : 1;
        const eased = Math.pow(discardProgress, 1.2);

        const x = direction * eased * 125;
        const rot = direction * eased * 14;
        const y = -eased * 25;

        // Depth scale for cards resting in stack
        const depth = Math.max(0, Math.min(2, frontProgress - i));
        const baseScale = 1 - depth * 0.015;
        const scale = Math.max(0.85, baseScale - eased * 0.03);
        const opacity = eased > 0.85 ? Math.max(0, 1 - (eased - 0.85) / 0.15) : 1;

        if (discardProgress > 0) {
          currentInner.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          currentInner.style.opacity = opacity.toFixed(3);
          currentInner.style.pointerEvents = discardProgress > 0.6 ? 'none' : 'auto';
        } else {
          currentInner.style.transform = depth > 0.05 ? `scale(${baseScale.toFixed(4)})` : 'scale(1)';
          currentInner.style.opacity = '1';
          currentInner.style.pointerEvents = 'auto';
        }
      }
    };

    const onScrollOrResize = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateStackEffects);
      }
    };

    updateStackEffects();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="resume" className="bg-muted/50 py-20 md:py-28 overflow-x-clip">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Experience</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A list of my personal experience.
          </p>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-10 md:gap-14 pb-12">
          {resume.experience.map((expItem, index) => {
            const exp = expItem as ExperienceItem;
            const stickyTop = BASE_STICKY_TOP + index * STACK_STEP;

            // Normalize image list
            const imageList: ImagePlaceholder[] =
              exp.images && exp.images.length > 0
                ? exp.images
                : exp.image
                  ? [exp.image]
                  : [];

            // Detect image shapes
            const firstShape: ImageShape =
              exp.orientation || (imageList[0] ? getImageShape(imageList[0]) : 'landscape');
            const secondShape: ImageShape =
              imageList[1] ? getImageShape(imageList[1]) : firstShape;

            // Layout determination
            const isDualImages = imageList.length >= 2;
            const isDualPortrait = isDualImages && firstShape === 'portrait' && secondShape === 'portrait';
            const isSinglePortrait = !isDualImages && firstShape === 'portrait';
            const isSingleSquare = !isDualImages && firstShape === 'square';

            return (
              <div
                key={`${exp.role}-${index}`}
                ref={(el) => {
                  outerRefs.current[index] = el;
                }}
                style={{
                  top: `${stickyTop}px`,
                  zIndex: 10 + index, // Kept well below modal z-[100] to prevent layering bugs
                }}
                className="sticky"
              >
                <div
                  ref={(el) => {
                    innerRefs.current[index] = el;
                  }}
                  onClick={() => setSelectedExperience(exp)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedExperience(exp);
                    }
                  }}
                  aria-label={`Open details for ${exp.role}`}
                  className="experience-stacked-card group relative flex origin-top flex-col overflow-hidden rounded-2xl md:rounded-3xl w-full md:aspect-[16/10] min-h-[420px] md:min-h-[480px] cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {/* Separated Top Header Part - Extends all the way across to the right */}
                  <div className="flex w-full items-center justify-between border-b border-border bg-muted/25 px-6 py-3.5 sm:px-8 sm:py-4">
                    <span className="font-semibold text-primary text-sm sm:text-base">
                      {exp.company}
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-sm font-medium">
                      {exp.period}
                    </span>
                  </div>

                  {/* Main Card Body (Left Details + Right Picture Showcase) */}
                  <div className="flex flex-1 flex-col md:flex-row md:items-stretch overflow-hidden">
                    {/* Left: Experience Details - Anchored to top with blue divider */}
                    <div className="flex w-full flex-col justify-start p-6 sm:p-7 md:w-1/2 lg:p-8">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl whitespace-pre-line">
                        {exp.role}
                      </h3>

                      {/* Blue divider line below title and above description - really long and extends past text on hover */}
                      <div className="my-4 sm:my-5 h-[2px] w-[85%] bg-primary rounded-full transition-all duration-500 ease-out group-hover:w-[calc(100%+1.5rem)] lg:group-hover:w-[calc(100%+2rem)]" />

                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-6">
                        {exp.description}
                      </p>
                    </div>

                    {/* Right: Picture Showcase */}
                    <div className="flex w-full flex-col justify-center p-6 sm:p-7 md:w-1/2 lg:p-8 md:pl-0">
                      {isDualPortrait ? (
                        /* 2 portrait images: side by side */
                        <div className="flex h-full w-full flex-row items-center justify-center gap-3 py-1">
                          {imageList.slice(0, 2).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative aspect-[9/16] h-full max-h-[340px] sm:max-h-[360px] w-auto max-w-[48%] overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40"
                            >
                              <Image
                                src={img.imageUrl}
                                alt={img.description || exp.role}
                                fill
                                sizes="(max-width: 768px) 50vw, 240px"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                data-ai-hint={img.imageHint}
                              />
                            </div>
                          ))}
                        </div>
                      ) : isDualImages ? (
                        /* 2 landscape images: one on top, one below */
                        <div className="flex h-full w-full flex-col justify-center gap-3">
                          {imageList.slice(0, 2).map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40"
                            >
                              <Image
                                src={img.imageUrl}
                                alt={img.description || exp.role}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                data-ai-hint={img.imageHint}
                              />
                            </div>
                          ))}
                        </div>
                      ) : isSinglePortrait && imageList[0] ? (
                        /* Single portrait image: centered and big */
                        <div className="flex h-full w-full items-center justify-center">
                          <div
                            className="relative aspect-[9/16] h-full max-h-[350px] sm:max-h-[380px] w-auto overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40"
                          >
                            <Image
                              src={imageList[0].imageUrl}
                              alt={imageList[0].description || exp.role}
                              fill
                              sizes="(max-width: 768px) 80vw, 360px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              data-ai-hint={imageList[0].imageHint}
                            />
                          </div>
                        </div>
                      ) : isSingleSquare && imageList[0] ? (
                        /* Single semi-square image: centered and big */
                        <div className="flex h-full w-full items-center justify-center">
                          <div
                            className="relative aspect-square h-full max-h-[350px] sm:max-h-[380px] w-auto max-w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40"
                          >
                            <Image
                              src={imageList[0].imageUrl}
                              alt={imageList[0].description || exp.role}
                              fill
                              sizes="(max-width: 768px) 80vw, 380px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              data-ai-hint={imageList[0].imageHint}
                            />
                          </div>
                        </div>
                      ) : imageList[0] ? (
                        /* Single landscape image: centered and big */
                        <div className="flex h-full w-full items-center justify-center">
                          <div
                            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40"
                          >
                            <Image
                              src={imageList[0].imageUrl}
                              alt={imageList[0].description || exp.role}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                              data-ai-hint={imageList[0].imageHint}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience Details Modal - Matching the Project Modal from My Works section */}
      <ExperienceModal
        experience={selectedExperience}
        isOpen={selectedExperience !== null}
        onClose={() => setSelectedExperience(null)}
      />
    </section>
  );
}
