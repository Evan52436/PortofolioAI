'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import {
  renderGenie,
  snapshotCard,
  type GenieGeo,
  type Snapshot,
} from '@/lib/genie';

/**
 * macOS Genie / Magic Lamp exit — canvas mesh warp.
 *
 * See `src/lib/genie.ts` for the warp itself. The contract here is:
 *
 *   warmUp()  rasterise the card while the progress bar is still running, so
 *             the exit is instant instead of stalling on a snapshot.
 *   play      swap the live card for the warped sheet and pour it into the lamp.
 *
 * The sheet is a single warped mesh, so there are no slice seams to hide.
 */

/** The "mouth of the lamp": viewport px the card pours into. */
export interface GenieTarget {
  x: number;
  y: number;
}

/** Imperative handle so the loader can pre-warm the snapshot. */
export interface GenieHandle {
  warmUp: () => Promise<void>;
}

interface GenieTerminalTransitionProps {
  children: React.ReactNode;
  target: GenieTarget;
  /** Flip to true to pour the card into the lamp. */
  play: boolean;
  /** Called after the mesh has finished and the overlay is torn down. */
  onComplete: () => void;
  /** Duration in ms. macOS sits around 600-800. */
  duration?: number;
  /** Classes for the real card. */
  className?: string;
  /** Mesh resolution overrides. */
  cols?: number;
  rows?: number;
}

const MAX_DPR = 2;

export const GenieTerminalTransition = forwardRef<
  GenieHandle,
  GenieTerminalTransitionProps
>(function GenieTerminalTransition(
  { children, target, play, onComplete, duration = 700, className, cols, rows },
  ref,
) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapRef = useRef<Snapshot | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const runningRef = useRef(false);

  const [showCanvas, setShowCanvas] = useState(false);
  const [cardHidden, setCardHidden] = useState(false);

  /** Rasterise the card. Safe to call repeatedly; the last one wins. */
  const warmUp = useCallback(async () => {
    const card = cardRef.current;
    if (!card) return;
    try {
      const snap = await snapshotCard(card, MAX_DPR);
      if (snap) snapRef.current = snap;
    } catch (err) {
      // Surfaced deliberately: a silent failure here means the genie degrades
      // to an instant cut, which is very hard to diagnose from the outside.
      console.error('[genie] card snapshot failed — falling back to a cut', err);
    }
  }, []);

  useImperativeHandle(ref, () => ({ warmUp }), [warmUp]);

  // Pour the sheet once `play` flips.
  useEffect(() => {
    if (!play || runningRef.current) return;
    runningRef.current = true;

    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    (async () => {
      // Prefer the pre-warmed texture; snapshot on the spot only if we must.
      let snap = snapRef.current;
      if (!snap) {
        await warmUp();
        snap = snapRef.current;
      }

      // Measure fresh: the card may have moved since the warm-up.
      const r = card.getBoundingClientRect();
      const geo: GenieGeo = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      };
      if (!r.width || !r.height) {
        onComplete();
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx || !snap) {
        // No texture available: hand off immediately rather than show a
        // half-drawn frame.
        setCardHidden(true);
        setShowCanvas(false);
        onComplete();
        return;
      }

      setShowCanvas(true);

      const paint = (t: number) => {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderGenie(ctx, snap!.tex, geo, target, t, dpr, { cols, rows });
      };

      // Frame zero: the mesh is the identity transform, so the canvas is
      // pixel-identical to the live card. Only then do we hide the card.
      paint(0);
      await new Promise<void>((res) => requestAnimationFrame(() => res()));
      if (cancelled) return;
      setCardHidden(true);

      const state = { t: 0 };
      tl = gsap.timeline({
        onComplete: () => {
          setShowCanvas(false);
          setCardHidden(false);
          runningRef.current = false;
          onComplete();
        },
      });
      tl.to(state, {
        t: 1,
        duration: duration / 1000,
        // Slow start, fast pour, then the trailing top edge lingers in.
        ease: 'power2.inOut',
        onUpdate: () => paint(state.t),
      });
      tlRef.current = tl;
    })();

    return () => {
      cancelled = true;
      tl?.kill();
      runningRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

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

      {/* The canvas must exist in the DOM before the effect paints to it, so
          it's always mounted; only its visibility is switched. */}
      <canvas
        ref={canvasRef}
        className={
          showCanvas ? 'pointer-events-none fixed inset-0 z-[80]' : 'hidden'
        }
        aria-hidden
      />
    </>
  );
});