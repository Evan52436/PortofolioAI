'use client';

import * as React from 'react';
import Image from 'next/image';
import { ExternalLink, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  'dashboard_mobile.webp': 0.46,
  'file preview_mobile.png': 0.46,
  'file preview_mobile.webp': 0.46,
  'belakang.jpeg': 1.0,
  'belakang.webp': 1.0,
  'epuy.jpeg': 1.0,
  'epuy.webp': 1.0,
  'iroha.jpeg': 1.0,
  'iroha.webp': 1.0,
  'logo.png': 1.0,
  'logo.webp': 1.0,
  'main.jpeg': 1.0,
  'main.webp': 1.0,
  'profile-placeholder.svg': 1.0,
  'preview.png': 1.22,
  'preview.webp': 1.22,
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

      for (let i = 0; i < count; i++) {
        const currentInner = inners[i];
        if (!currentInner) continue;

        // Effect 1: Next card (i + 1) arriving over Card i (1 card behind front)
        let p1 = 0;
        const target1 = i + 1;
        if (target1 < count && outers[target1]) {
          const sticky1 = BASE_STICKY_TOP + target1 * STACK_STEP;
          const rect1 = outers[target1]!.getBoundingClientRect();
          const dist1 = rect1.top - sticky1;
          const travel1 = Math.max(rect1.height * 0.8, 360);
          p1 = Math.min(Math.max((travel1 - dist1) / travel1, 0), 1);
        }

        // Effect 2: Card (i + 2) arriving over Card (i + 1) (2 cards behind front)
        // Remains solid in the stack.
        let p2 = 0;
        const target2 = i + 2;
        if (target2 < count && outers[target2]) {
          const sticky2 = BASE_STICKY_TOP + target2 * STACK_STEP;
          const rect2 = outers[target2]!.getBoundingClientRect();
          const dist2 = rect2.top - sticky2;
          const travel2 = Math.max(rect2.height * 0.8, 360);
          p2 = Math.min(Math.max((travel2 - dist2) / travel2, 0), 1);
        }

        // Effect 3: Card (i + 3) arriving over Card (i + 2) (3 cards behind front).
        // Only Card i swipes away when Card (i + 3) arrives. Only one card moves at a time!
        let discardProgress = 0;
        const target3 = i + 3;
        if (target3 < count && outers[target3]) {
          const sticky3 = BASE_STICKY_TOP + target3 * STACK_STEP;
          const rect3 = outers[target3]!.getBoundingClientRect();
          const dist3 = rect3.top - sticky3;
          const travel3 = Math.max(rect3.height * 0.8, 360);
          discardProgress = Math.min(Math.max((travel3 - dist3) / travel3, 0), 1);
        }

        const direction = i % 2 === 0 ? -1 : 1;
        const eased = Math.pow(discardProgress, 1.2);

        // Clears the viewport completely without lingering
        const x = direction * eased * 165;
        const rot = direction * eased * 14;
        const y = -eased * 25;
        const baseScale = 1 - p1 * 0.015 - p2 * 0.015;
        const scale = Math.max(0.85, baseScale - eased * 0.03);
        const opacity = discardProgress > 0 ? Math.max(0, 1 - Math.pow(discardProgress, 1.4)) : 1;

        if (discardProgress > 0) {
          currentInner.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          currentInner.style.opacity = opacity.toFixed(3);
          currentInner.style.pointerEvents = discardProgress > 0.4 ? 'none' : 'auto';
        } else {
          currentInner.style.transform = p1 > 0.005 || p2 > 0.005 ? `scale(${baseScale.toFixed(4)})` : 'scale(1)';
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
    <section id="resume" className="bg-muted/50 py-20 md:py-28 overflow-x-clip scroll-mt-16">
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
                  className="experience-stacked-card group relative flex origin-top flex-col overflow-hidden rounded-2xl md:rounded-3xl w-full min-h-0 md:min-h-[480px] cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {/* Separated Top Header Part - Extends all the way across to the right */}
                  <div className="flex w-full items-center justify-between border-b border-border bg-muted/25 px-4 py-2.5 sm:px-6 sm:py-3.5 md:px-8 md:py-4">
                    <span className="font-semibold text-primary text-xs sm:text-sm md:text-base truncate max-w-[65%]">
                      {exp.company}
                    </span>
                    <span className="text-[11px] text-muted-foreground sm:text-xs md:text-sm font-medium whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  {/* Main Card Body (Left Details + Right Picture Showcase) */}
                  <div className="flex flex-1 flex-col md:flex-row md:items-stretch overflow-hidden">
                    {/* Left: Experience Details - Anchored to top with blue divider & View More button */}
                    <div className="flex w-full flex-col justify-between p-4 sm:p-6 md:p-7 lg:p-8 md:w-1/2">
                      <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground whitespace-pre-line leading-snug">
                          {exp.role}
                        </h3>

                        {/* Blue divider line below title and above description - really long and extends past text on hover */}
                        <div className="my-2 sm:my-3 md:my-4 h-[2px] w-[85%] bg-primary rounded-full transition-all duration-500 ease-out group-hover:w-[calc(100%+1.5rem)] lg:group-hover:w-[calc(100%+2rem)]" />

                        {/* Description: truncated on mobile with ... so card fits on screen, fully displayed on desktop */}
                        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
                          {exp.description}
                        </p>
                      </div>

                      {/* View More button with reduced top/bottom spacing */}
                      <div className="pt-2.5 sm:pt-4 md:pt-5 mt-auto">
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExperience(exp);
                          }}
                          className="w-full justify-center shadow-md h-9 sm:h-10 md:h-11 text-xs sm:text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md gap-2 group/btn"
                        >
                          <span>View More</span>
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Right: Picture Showcase */}
                    <div className="flex w-full flex-col justify-center p-4 pt-0 sm:p-6 sm:pt-0 md:p-7 md:w-1/2 lg:p-8 md:pl-0">
                      {/* MOBILE PREVIEW (< md): Single image with +N more indicator */}
                      {imageList[0] && (
                        <div className="block md:hidden w-full">
                          <div className="relative aspect-[16/10] max-h-[170px] sm:max-h-[200px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300">
                            <Image
                              src={imageList[0].imageUrl}
                              alt={imageList[0].description || exp.role}
                              fill
                              sizes="(max-width: 768px) 100vw, 360px"
                              className="object-cover"
                              data-ai-hint={imageList[0].imageHint}
                            />
                            {imageList.length > 1 && (
                              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-md border border-white/15">
                                <Layers className="h-3 w-3" />
                                <span>+{imageList.length - 1} more</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* DESKTOP PREVIEW (md+): Up to 2 images max */}
                      <div className="hidden md:flex md:h-full md:w-full md:flex-col md:justify-center">
                        {isDualPortrait ? (
                          /* 2 portrait images: side by side */
                          <div className="relative flex h-full w-full flex-row items-center justify-center gap-3 py-1">
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
                                {imgIdx === 1 && imageList.length > 2 && (
                                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-md border border-white/15">
                                    <Layers className="h-3 w-3" />
                                    <span>+{imageList.length - 2} more</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isDualImages ? (
                          /* 2 landscape images: one on top, one below (only first 2 displayed on card) */
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
                                {imgIdx === 1 && imageList.length > 2 && (
                                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-md border border-white/15">
                                    <Layers className="h-3 w-3" />
                                    <span>+{imageList.length - 2} more</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isSinglePortrait && imageList[0] ? (
                          /* Single portrait image: centered and big */
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="relative aspect-[9/16] h-full max-h-[350px] sm:max-h-[380px] w-auto overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40">
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
                            <div className="relative aspect-square h-full max-h-[350px] sm:max-h-[380px] w-auto max-w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40">
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
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/80 bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/40">
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
