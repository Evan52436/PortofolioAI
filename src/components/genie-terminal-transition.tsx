'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * macOS Genie / Magic Lamp — Pure CSS 30-Slice Method, BOTH directions.
 *
 * No canvas, no `html-to-image`, no single-element scale. The card is cloned
 * into N absolutely-positioned slices, each clipped to a 1/N height band with
 * `clip-path: inset(...)`. GSAP tweens a single scalar `t` and every frame we
 * write one GPU transform (translate3d + skewX + scaleX/scaleY) per slice.
 *
 *  - exit : t 0 -> 1, slices get sucked DOWN into the lamp target.
 *  - enter: t 1 -> 0, slices shoot UP out of the lamp target into place.
 *
 * `will-change: transform` keeps each band on its own compositor layer.
 */

/** Number of horizontal bands the card is cut into. */
export const SLICES = 30;

/** The "mouth of the lamp": viewport px the card collapses into. */
export interface GenieTarget {
  x: number;
  y: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface GenieTerminalTransitionProps {
  /** The terminal card markup (cloned once per slice while a genie runs). */
  children: React.ReactNode;
  /** Point the card is sucked into / shot out of (viewport coordinates). */
  target: GenieTarget;
  /** Flip to true to run the entrance genie (lamp -> card). */
  enter?: boolean;
  /** Flip to true to run the exit genie (card -> lamp). */
  exit?: boolean;
  /** Called after the entrance slice layer is torn down. */
  onEnterComplete?: () => void;
  /** Called after the exit slice layer is torn down. */
  onExitComplete?: () => void;
  /** Duration of each genie, ms. macOS sits around 600-800. */
  duration?: number;
  /** Classes for the real card. */
  className?: string;
  /**
   * Classes for the cloned slices. Should be the card's *chrome* only
   * (background, border, radius) — NOT the entrance animation, and ideally
   * without `backdrop-blur` (30 blurred layers is expensive).
   */
  sliceClassName?: string;
  /**
   * Hide the real card until the first entrance completes. Defaults to true
   * because this app always enters; pass false for exit-only usage.
   */
  startHidden?: boolean;
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export function GenieTerminalTransition({
  children,
  target,
  enter = false,
  exit = false,
  onEnterComplete,
  onExitComplete,
  duration = 600,
  className,
  sliceClassName,
  startHidden = true,
}: GenieTerminalTransitionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const direction = useRef<'enter' | 'exit'>('exit');

  const [rect, setRect] = useState<Rect | null>(null);
  const [active, setActive] = useState(false); // slice layer mounted?
  const [cardHidden, setCardHidden] = useState(startHidden);

  /**
   * Per-slice deformation. `t` 0→1 (exit), `yn` = band position (0 top → 1 bottom).
   *
   *  - translateX : deltaX * t^1.5 * sin((yn*PI)/2)   → S-curve drift toward the lamp
   *  - scaleX     : max(0, 1 - t*(0.3 + 0.7*yn^2))    → bottom pinches faster (trapezoid)
   *  - translateY : (targetY - bandCenterY) * t^1.3   → all bands converge down into the lamp
   *  - scaleY     : max(0, 1 - t*(0.35 + 0.65*yn))    → lower bands flatten hardest (pile-up)
   *  - skewX      : tiny lean toward the target        → the organic curved-S look
   *
   * The entrance simply runs `t` from 1→0, so the same math plays in reverse.
   */
  const applySlices = (t: number, g: Rect) => {
    const N = SLICES;
    const bandH = g.height / N;
    const centerX = g.left + g.width / 2;
    const deltaX = target.x - centerX;
    const leanSign = deltaX < 0 ? -1 : 1;

    const easeX = Math.pow(t, 1.5);
    const easeY = Math.pow(t, 1.3);

    for (let i = 0; i < N; i++) {
      const el = sliceRefs.current[i];
      if (!el) continue;

      const yn = i / (N - 1);
      const bandCenterY = g.top + (i + 0.5) * bandH;

      const translateX = deltaX * easeX * Math.sin((yn * Math.PI) / 2);
      const scaleX = Math.max(0, 1 - t * (0.3 + 0.7 * yn * yn));
      const translateY = (target.y - bandCenterY) * easeY;
      const scaleY = Math.max(0, 1 - t * (0.35 + 0.65 * yn));
      const skewX = -leanSign * t * 0.2 * yn;

      el.style.transform =
        `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) ` +
        `skewX(${skewX.toFixed(3)}deg) ` +
        `scaleX(${scaleX.toFixed(4)}) scaleY(${scaleY.toFixed(4)})`;

      // Progressive opacity fall-off only at the tail of t (near the lamp).
      el.style.opacity = t > 0.85 ? (1 - (t - 0.85) / 0.15).toFixed(3) : '1';
    }
  };

  const measure = () => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
  };

  // Entrance trigger: hide the card at once and mount slices at the lamp.
  useEffect(() => {
    if (!enter) return;
    direction.current = 'enter';
    setCardHidden(true);
    measure();
    setActive(true);
  }, [enter]);

  // Exit trigger: keep the card visible; slices mount on top, then swap.
  useEffect(() => {
    if (!exit) return;
    direction.current = 'exit';
    measure();
    setActive(true);
  }, [exit]);

  // Play the genie once the slice layer is mounted and measured.
  useEffect(() => {
    if (!active || !rect) return;

    const dir = direction.current;
    const from = dir === 'enter' ? 1 : 0;
    const to = dir === 'enter' ? 0 : 1;

    applySlices(from, rect);

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    (async () => {
      // Commit the first slice frame before hiding the real card → no flash.
      await nextFrame();
      if (cancelled) return;
      setCardHidden(true);

      const state = { t: from };
      tl = gsap.timeline({
        onComplete: () => {
          setActive(false); // unmount the slice layer
          setCardHidden(false); // reveal the real card
          direction.current === 'enter' ? onEnterComplete?.() : onExitComplete?.();
        },
      });
      tl.to(state, {
        t: to,
        duration: duration / 1000,
        // exit accelerates INTO the lamp; enter bursts OUT and settles.
        ease: dir === 'enter' ? 'power2.out' : 'power2.in',
        onUpdate: () => applySlices(state.t, rect),
      });
      tlRef.current = tl;
    })();

    return () => {
      cancelled = true;
      tl?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, rect]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={className}
        style={{ visibility: cardHidden ? 'hidden' : 'visible' }}
        aria-hidden={cardHidden}
      >
        {children}
      </div>

      {active && rect && (
        <div className="pointer-events-none fixed inset-0 z-[80]">
          {Array.from({ length: SLICES }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                sliceRefs.current[i] = el;
              }}
              className="absolute will-change-transform"
              style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                // Cut this clone down to its 1/N band.
                clipPath: `inset(${(i / SLICES) * 100}% 0 ${
                  (1 - (i + 1) / SLICES) * 100
                }% 0)`,
                // Scale around the band's own centre so the pinch reads cleanly.
                transformOrigin: `50% ${(((i + 0.5) / SLICES) * 100).toFixed(4)}%`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className={sliceClassName} style={{ width: '100%', height: '100%' }}>
                {children}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}