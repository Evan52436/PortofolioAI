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

// Website Tech Stack colors: Blue, Nginx Green, JavaScript Yellow (exact single-tone hex codes)
export const TECH_STACK_COLORS = [
  { name: 'Blue', color: '#89abd2' },
  { name: 'Nginx Green', color: '#009639' },
  { name: 'JavaScript Yellow', color: '#f0db4f' },
];

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

export function DoorTransitionProvider({ children }: DoorTransitionProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const isTransitioningRef = useRef(false);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
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
      isTransitioningRef.current = true;
      setIsActive(true);

      const leftDoor = leftDoorRef.current;
      const rightDoor = rightDoorRef.current;

      if (!leftDoor || !rightDoor) {
        onBeforeScroll?.();
        const id = targetHref.replace(/^#/, '');
        const targetEl = document.getElementById(id);
        if (targetEl) {
          if (id === 'portfolio') {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        isTransitioningRef.current = false;
        setIsActive(false);
        return;
      }

      // Kill any running timeline
      timelineRef.current?.kill();

      // Reset starting positions: fully open
      gsap.set(leftDoor, { xPercent: -100 });
      gsap.set(rightDoor, { xPercent: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          setIsActive(false);
          isTransitioningRef.current = false;
        },
      });

      // 1. Closing animation: doors slide in from edges to center
      tl.to(
        leftDoor,
        {
          xPercent: 0,
          duration: 0.65,
          ease: 'power3.inOut',
        },
        0
      );
      tl.to(
        rightDoor,
        {
          xPercent: 0,
          duration: 0.65,
          ease: 'power3.inOut',
        },
        0
      );

      // 2. Pause briefly at center and navigate/scroll to target section
      tl.add(() => {
        onBeforeScroll?.();
        const id = targetHref.replace(/^#/, '');
        const targetEl = document.getElementById(id);
        if (targetEl) {
          if (id === 'portfolio') {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });
          } else {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#' + id);
        }
      }, '+=0.08');

      // 3. Opening animation: doors slide out from center to reveal target section
      tl.to(
        leftDoor,
        {
          xPercent: -100,
          duration: 0.65,
          ease: 'power3.inOut',
        },
        '+=0.08'
      );
      tl.to(
        rightDoor,
        {
          xPercent: 100,
          duration: 0.65,
          ease: 'power3.inOut',
        },
        '<'
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

      {/* Elevator Door Transition Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[9999] overflow-hidden pointer-events-none transition-opacity duration-150',
          isActive ? 'pointer-events-auto opacity-100' : 'opacity-0 invisible'
        )}
        aria-hidden={!isActive}
      >
        {/* Left Door Panel */}
        <div
          ref={leftDoorRef}
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-background shadow-[8px_0px_28px_rgba(0,0,0,0.22)] dark:shadow-[8px_0px_35px_rgba(0,0,0,0.65)] overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Subtle Dot Grid Texture */}
          <div
            className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(hsl(var(--primary) / 0.35) 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Single-Tone Vertical Lining (Right seam of left door) */}
          <div className="absolute top-0 right-0 bottom-0 w-1.5 md:w-2 flex flex-col z-30 pointer-events-none">
            {TECH_STACK_COLORS.map((item) => (
              <div
                key={item.name}
                className="flex-1 w-full"
                style={{ backgroundColor: item.color }}
                title={item.name}
              />
            ))}
          </div>
        </div>

        {/* Right Door Panel */}
        <div
          ref={rightDoorRef}
          className="absolute top-0 bottom-0 right-0 w-1/2 bg-background shadow-[-8px_0px_28px_rgba(0,0,0,0.22)] dark:shadow-[-8px_0px_35px_rgba(0,0,0,0.65)] overflow-hidden"
          style={{ willChange: 'transform' }}
        >
          {/* Subtle Dot Grid Texture */}
          <div
            className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(hsl(var(--primary) / 0.35) 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Single-Tone Vertical Lining (Left seam of right door) */}
          <div className="absolute top-0 left-0 bottom-0 w-1.5 md:w-2 flex flex-col z-30 pointer-events-none">
            {TECH_STACK_COLORS.map((item) => (
              <div
                key={item.name}
                className="flex-1 w-full"
                style={{ backgroundColor: item.color }}
                title={item.name}
              />
            ))}
          </div>
        </div>
      </div>
    </DoorTransitionContext.Provider>
  );
}
