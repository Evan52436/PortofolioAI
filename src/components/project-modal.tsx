'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ExternalLink, Layers, Github, Download, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import type { projects } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type Project = (typeof projects)[0];

interface ProjectModalProps {
  project: Project | null;
  originCardEl?: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({
  project,
  originCardEl,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState<ImagePlaceholder | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const imageBoxRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const isClosingRef = React.useRef(false);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (project) {
      setActiveImage(project.image);
    }
  }, [project]);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  // Main Expanding Opening Animation (No stretching, true ratio, no end-morphing)
  useIsomorphicLayoutEffect(() => {
    if (!isOpen || !project) {
      return;
    }

    isClosingRef.current = false;
    document.body.style.overflow = 'hidden';

    const modalEl = modalRef.current;
    const backdrop = backdropRef.current;
    const titleEl = titleRef.current;
    const detailsEl = detailsRef.current;

    if (!modalEl || !backdrop) return;

    // Kill any active animations
    timelineRef.current?.kill();

    const originRect = originCardEl?.getBoundingClientRect();

    if (!originRect) {
      // Fallback simple reveal if origin card rect is missing
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        modalEl,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }
      );
      return;
    }

    // Modal final natural dimensions in the center of the screen
    const finalWidth = modalEl.offsetWidth;
    const finalHeight = modalEl.offsetHeight;

    // Origin small card starting dimensions & center offset
    const startWidth = originRect.width;
    const startHeight = originRect.height;
    const startX = originRect.left + originRect.width / 2 - window.innerWidth / 2;
    const startY = originRect.top + originRect.height / 2 - window.innerHeight / 2;

    // Initial state: animate real dimensions and positions without distortion scales
    gsap.set(modalEl, {
      x: startX,
      y: startY,
      width: startWidth,
      height: startHeight,
      borderRadius: '0.75rem',
      opacity: 1,
      overflow: 'hidden',
    });

    gsap.set(backdrop, {
      opacity: 0,
    });

    if (titleEl) {
      gsap.set(titleEl, {
        scale: 0.9,
        transformOrigin: 'left top',
      });
    }

    if (detailsEl) {
      gsap.set(detailsEl, {
        opacity: 0,
        y: 10,
      });
    }

    // Snappy intro animation duration (320ms)
    const duration = 0.32;

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (modalEl) {
          modalEl.style.overflowY = 'auto';
        }
      },
      onReverseComplete: () => {
        document.body.style.overflow = '';
        onClose();
      },
    });

    // 1. Backdrop fades in
    tl.to(
      backdrop,
      {
        opacity: 1,
        duration: duration * 0.9,
        ease: 'power2.out',
      },
      0
    );

    // 2. Card container grows smoothly from small card to full modal size
    tl.to(
      modalEl,
      {
        x: 0,
        y: 0,
        width: finalWidth,
        height: finalHeight,
        borderRadius: '1rem',
        duration: duration,
        ease: 'power3.out',
      },
      0
    );

    // 3. Title scales smoothly without layout reflow or wrapping jumps
    if (titleEl) {
      tl.to(
        titleEl,
        {
          scale: 1,
          duration: duration,
          ease: 'power3.out',
        },
        0
      );
    }

    // 4. Details fade in smoothly as card expands
    if (detailsEl) {
      tl.to(
        detailsEl,
        {
          opacity: 1,
          y: 0,
          duration: duration * 0.7,
          ease: 'power2.out',
        },
        duration * 0.3
      );
    }

    timelineRef.current = tl;
    tl.play();

    return () => {
      tl.kill();
    };
  }, [isOpen, project, originCardEl, onClose]);

  // Handle Closing with Reverse Shrinking Animation (Mirror of Opening)
  const handleClose = React.useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const modalEl = modalRef.current;
    const backdrop = backdropRef.current;

    if (modalEl) {
      modalEl.scrollTop = 0;
      modalEl.style.overflowY = 'hidden';
    }

    if (timelineRef.current && timelineRef.current.progress() > 0) {
      timelineRef.current.reverse();
    } else {
      if (modalEl && backdrop) {
        gsap.to([modalEl, backdrop], {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            document.body.style.overflow = '';
            onClose();
          },
        });
      } else {
        document.body.style.overflow = '';
        onClose();
      }
    }
  }, [onClose]);

  // Handle browser window resize gracefully
  React.useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      const modalEl = modalRef.current;
      if (modalEl && !isClosingRef.current) {
        modalEl.style.width = '';
        modalEl.style.height = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Keyboard Escape listener
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  if (!mounted || !isOpen || !project) return null;

  const currentImage = activeImage || project.image;
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const isCompetition = project.category?.toLowerCase() === 'competition';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Dark Backdrop Overlay */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        aria-hidden="true"
      />

      {/* Expanding Interactive Modal Content Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        style={{ opacity: 0, willChange: 'transform, width, height, border-radius' }}
        className={cn(
          'relative z-[110] max-w-5xl lg:max-w-6xl w-full max-h-[92vh] overflow-hidden p-6 sm:p-8 md:p-10 border-2 rounded-2xl bg-background shadow-2xl'
        )}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-20"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-2">
          {/* Left Column: Big Main Image Preview & Extra Small Photo Placeholders */}
          <div className="md:col-span-7 flex flex-col gap-5">
            <div
              ref={imageBoxRef}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/40 shadow-lg group"
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.description || project.title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium inline-block truncate shadow-sm">
                {currentImage.description || project.title}
              </div>
            </div>

            {/* Extra Small Photos Placeholder Gallery */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>More Previews</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {gallery.map((img, idx) => {
                  const isActive = currentImage.imageUrl === img.imageUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        'relative h-20 w-28 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary',
                        isActive
                          ? 'border-primary ring-2 ring-primary/40 scale-105 opacity-100 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:border-muted-foreground/30'
                      )}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={img.description}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Description, Technologies & External Action Link */}
          <div className="md:col-span-5 flex flex-col h-full justify-between gap-6">
            <div className="space-y-5">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2.5 uppercase text-[10px] tracking-widest font-semibold px-2.5 py-0.5"
                >
                  {project.category}
                </Badge>
                <h2
                  ref={titleRef}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
                >
                  {project.title}
                </h2>
              </div>

              {/* Collapsible Details Container that fades in during expansion */}
              <div ref={detailsRef} className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                    About Project
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2.5">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="px-3 py-1 text-xs font-medium"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t flex flex-col gap-3 w-full mt-auto">
              {isCompetition ? (
                <Button
                  asChild
                  className="w-full justify-center shadow-md h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href={currentImage.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </a>
                </Button>
              ) : (
                <>
                  {project.url && project.url !== '#' ? (
                    <Button
                      asChild
                      className="w-full justify-center shadow-md h-11 text-sm font-medium"
                    >
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <span>Visit Live Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full justify-center opacity-60 h-11 text-sm font-medium"
                    >
                      Internal Project
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary font-medium h-11 text-sm transition-colors"
                  >
                    <a
                      href={(project as any).githubUrl || 'https://github.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub Repository</span>
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
