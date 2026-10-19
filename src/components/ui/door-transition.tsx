'use client';

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

// Website Tech Stack colors: Blue, Nginx Green, JavaScript Yellow
export const TECH_STACK_COLORS = [
  { name: 'Blue', color: '#89abd2' },
  { name: 'Nginx Green', color: '#009639' },
  { name: 'JavaScript Yellow', color: '#f0db4f' },
];

const SLAT_COUNT = 10;

interface DoorTransitionContextType {
  triggerDoorTransition: (targetHref: string, onBeforeScroll?: () => void) => void;
  isTransitioning: boolean;
}

const DoorTransitionContext = createContext<DoorTransitionContextType | null>(null);

export function useDoorTransition() {
  const context = useContext(DoorTransitionContext);
  if (!context) {
    throw new Error('useDoorTransition must be used within a DoorTransitionProvider');
  }
  return context;
}

interface DoorTransitionProviderProps {
  children: React.ReactNode;
}

/**
 * Curtains: Blinds page navigation transition inspired by:
 * https://motion.dev/examples/js-curtains-blinds
 *
 * Divides the viewport into staggered venetian blind slats that scale down to cover
 * the screen, instantly scrolls to the destination section, and then scales down to
 * unveil the new content with hardware-accelerated transforms.
 */
export function DoorTransitionProvider({ children }: DoorTransitionProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const isTransitioningRef = useRef(false);
  const slatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Clean up GSAP timeline on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const triggerDoorTransition = useCallback(
    (targetHref: string, onBeforeScroll?: () => void) => {
      if (isTransitioningRef.current) return;

      const id = targetHref.replace(/^#/, '');

      // Check prefers-reduced-motion for accessibility
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        onBeforeScroll?.();
        const targetEl = document.getElementById(id);
        if (targetEl) {
          if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(targetEl, { immediate: true });
          } else {
            targetEl.scrollIntoView({ behavior: 'auto' });
          }
        }
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#' + id);
        }
        return;
      }

      const slats = slatRefs.current.filter((el): el is HTMLDivElement => el !== null);

      if (slats.length === 0) {
        onBeforeScroll?.();
        const targetEl = document.getElementById(id);
        if (targetEl) {
          if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(targetEl, { duration: 1.2 });
          } else if (id === 'portfolio') {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        return;
      }

      isTransitioningRef.current = true;
      setIsActive(true);

      // Kill any running timeline
      timelineRef.current?.kill();

      // Reset slats: origin top, collapsed
      gsap.set(slats, { scaleY: 0, transformOrigin: 'center top' });

      const tl = gsap.timeline({
        onComplete: () => {
          setIsActive(false);
          isTransitioningRef.current = false;
        },
      });

      // 1. Cover Phase: Venetian blinds drop down sequentially from top to bottom
      tl.to(slats, {
        scaleY: 1,
        duration: 0.35,
        ease: 'power3.inOut',
        stagger: {
          each: 0.03,
          from: 'start',
        },
      });

      // 2. Midpoint: Scroll target section into position while covered
      tl.add(() => {
        onBeforeScroll?.();
        const targetEl = document.getElementById(id);
        if (targetEl) {
          if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(targetEl, { immediate: true });
          } else if (id === 'portfolio') {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
          } else {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#' + id);
        }

        // Switch transform-origin to bottom so blinds reveal downwards
        gsap.set(slats, { transformOrigin: 'center bottom' });
      }, '+=0.04');

      // 3. Reveal Phase: Blinds collapse down to bottom to unveil target section
      tl.to(
        slats,
        {
          scaleY: 0,
          duration: 0.35,
          ease: 'power3.inOut',
          stagger: {
            each: 0.03,
            from: 'start',
          },
        },
        '+=0.03'
      );

      timelineRef.current = tl;
    },
    []
  );

  return (
    <DoorTransitionContext.Provider
      value={{
        triggerDoorTransition,
        isTransitioning: isActive,
      }}
    >
      {children}

      {/* Curtains: Blinds Navigation Transition Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[9999] overflow-hidden pointer-events-none transition-opacity duration-150',
          isActive ? 'pointer-events-auto opacity-100' : 'opacity-0 invisible'
        )}
        aria-hidden={!isActive}
      >
        {Array.from({ length: SLAT_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              slatRefs.current[i] = el;
            }}
            className="absolute left-0 right-0 bg-[#eef4fb] dark:bg-[#070b13] border-b border-[#c8d9ea] dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.45)] overflow-hidden"
            style={{
              top: `${(i / SLAT_COUNT) * 100}%`,
              height: `calc(${100 / SLAT_COUNT}% + 1px)`,
              transform: 'scaleY(0)',
              transformOrigin: 'center top',
              willChange: 'transform',
            }}
          >
            {/* Dot Grid Texture */}
            <div
              className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(hsl(var(--primary) / 0.35) 1.2px, transparent 1.2px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Website Blue Accent Line on slat seam */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#89abd2] opacity-55 dark:opacity-40 pointer-events-none"
            />
          </div>
        ))}
      </div>
    </DoorTransitionContext.Provider>
  );
}
