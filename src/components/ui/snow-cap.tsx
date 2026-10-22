'use client';

import React, { useRef, useEffect } from 'react';
import type { MotionValue } from 'motion/react';

export interface SnowCapProps {
  /** Optional container ref (defaults to parentElement if omitted) */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Size scale: 'sm' for buttons/badges (4-5px), 'md' for cards (7-8px), 'lg' for large hero cards (9-10px) */
  size?: 'sm' | 'md' | 'lg';
  /** Optional MotionValues for spring follow motion */
  springX?: MotionValue<number>;
  springY?: MotionValue<number>;
  /** Discard progress (0 to 1) for experience cards in resume */
  discardProgress?: number;
  /** Discard direction (-1 for left, +1 for right) */
  discardDirection?: number;
  /** Fling trigger (e.g. photo flip state change) */
  flingTrigger?: boolean | number;
  /** Whether mere pointer hover dislodges snow (defaults to false so hovering does not clear snow) */
  dislodgeOnHover?: boolean;
  /** Whether the snow falls off when hovered (for cards that pop up on hover, like My Works) */
  shedOnHover?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  decay: number;
}

interface IncomingFlake {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const TOP_PAD = 18;
const LEFT_PAD = 14;
const RIGHT_PAD = 10;
const BOTTOM_PAD = 22;
const HARD_BASE = 0.38; // Hard packed base snow ratio (requires vigorous shake)

export function SnowCap({
  containerRef,
  size = 'md',
  springX,
  springY,
  discardProgress = 0,
  discardDirection = 1,
  flingTrigger,
  dislodgeOnHover = false,
  shedOnHover = false,
  className = '',
}: SnowCapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const discardRef = useRef({ progress: discardProgress, direction: discardDirection });
  const flingRef = useRef(flingTrigger);

  useEffect(() => {
    discardRef.current = { progress: discardProgress, direction: discardDirection };
  }, [discardProgress, discardDirection]);

  useEffect(() => {
    flingRef.current = flingTrigger;
  }, [flingTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const target = containerRef?.current || canvas.parentElement;
    if (!target) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let targetW = target.clientWidth || 200;
    let targetH = target.clientHeight || 100;

    // Movement tracking
    let prevSpringX = springX ? springX.get() : 0;
    let prevSpringY = springY ? springY.get() : 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerSpeed = 0;

    // Accumulation scale (0 to 1)
    let accumScale = 1.0;
    let lastFlingVal = flingRef.current;
    let flingCooldown = 0;

    const particles: Particle[] = [];
    const incomingFlakes: IncomingFlake[] = [];

    // Dark mode check
    let isDark = document.documentElement.classList.contains('dark');
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    let isHovered = false;

    // Hover pop-up shed handler (for cards and buttons that shed when hovered)
    const handlePointerEnter = () => {
      isHovered = true;
      if (shedOnHover && accumScale > 0.05) {
        // Shakes loose a cascade of falling snowflakes!
        spawnFlakes(size === 'sm' ? 14 : 24, (Math.random() - 0.5) * 1.5 + 0.4, 2.0, false);
        // Snow blanket fully sheds
        accumScale = 0;
      }
    };

    const handlePointerLeave = () => {
      isHovered = false;
    };

    if (shedOnHover) {
      target.addEventListener('pointerenter', handlePointerEnter as EventListener, { passive: true });
      target.addEventListener('pointerleave', handlePointerLeave as EventListener, { passive: true });
    }

    // Pointer move listener
    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      pointerSpeed = Math.hypot(dx, dy);

      if (shedOnHover && pointerSpeed > 4 && accumScale > 0.02) {
        accumScale = Math.max(0, accumScale - 0.03);
        if (Math.random() < 0.3) {
          spawnFlakes(2, (dx * 0.2) + 0.4, 1.4, false);
        }
      } else if (dislodgeOnHover && pointerSpeed > 5 && accumScale > HARD_BASE) {
        // Dislodge soft top snow only
        const lost = Math.min(accumScale - HARD_BASE, 0.05);
        accumScale -= lost;
        spawnFlakes(2, (dx * 0.2) + 0.5, 1.2, false);
      }
    };

    if (dislodgeOnHover || shedOnHover) {
      target.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    }

    // Size parameters (balanced, not dominant to the left)
    const getParams = () => {
      if (size === 'sm') {
        return { maxT: 4.8, flankT: 1.1, flankH: 3, rightT: 4.0 };
      }
      if (size === 'lg') {
        return { maxT: 9.5, flankT: 2.0, flankH: 6, rightT: 8.0 };
      }
      return { maxT: 8.0, flankT: 1.6, flankH: 5, rightT: 6.8 };
    };

    // Calculate boundary points
    const getPoints = (w: number, currentAccum: number) => {
      const style = window.getComputedStyle(target);
      const rTL = Math.min(w * 0.35, parseFloat(style.borderTopLeftRadius) || (size === 'sm' ? 8 : 18));
      const rTR = Math.min(w * 0.35, parseFloat(style.borderTopRightRadius) || (size === 'sm' ? 8 : 18));
      const { maxT, flankT, flankH, rightT } = getParams();

      const outerPoints: { x: number; y: number }[] = [];
      const innerPoints: { x: number; y: number }[] = [];

      const x0 = LEFT_PAD;
      const y0 = TOP_PAD;

      // 1. Left flank (subtle gentle rounding, not dominant)
      const flankSteps = 4;
      for (let i = 0; i <= flankSteps; i++) {
        const t = i / flankSteps;
        const curY = y0 + rTL + flankH * (1 - t);
        const curX = x0;
        const curT = flankT * Math.sin((t * Math.PI) / 2) * currentAccum;

        innerPoints.push({ x: curX, y: curY });
        outerPoints.push({ x: curX - curT, y: curY });
      }

      // 2. Top-left corner (gentle breeze crest)
      const tlSteps = 8;
      for (let i = 0; i <= tlSteps; i++) {
        const t = i / tlSteps;
        const angle = Math.PI - (t * Math.PI) / 2;
        const curX = x0 + rTL + rTL * Math.cos(angle);
        const curY = y0 + rTL - rTL * Math.sin(angle);
        const nx = Math.cos(angle);
        const ny = -Math.sin(angle);
        const curT = (flankT + (maxT - flankT) * Math.sin((t * Math.PI) / 2)) * currentAccum;

        innerPoints.push({ x: curX, y: curY });
        outerPoints.push({ x: curX + nx * curT, y: curY + ny * curT });
      }

      // 3. Top edge (balanced, luscious snow blanket across the entire top)
      const topSteps = 16;
      const topWidth = Math.max(0, w - rTL - rTR);
      for (let i = 1; i <= topSteps; i++) {
        const t = i / topSteps;
        const curX = x0 + rTL + topWidth * t;
        const curY = y0;
        // Gentle linear slope from maxT to rightT (e.g. 9.5px to 8.0px)
        const curT = (maxT + (rightT - maxT) * t) * currentAccum;

        innerPoints.push({ x: curX, y: curY });
        outerPoints.push({ x: curX, y: curY - curT });
      }

      // 4. Top-right corner (smoothly tapers around shoulder)
      const trSteps = 8;
      for (let i = 1; i <= trSteps; i++) {
        const t = i / trSteps;
        const angle = Math.PI / 2 - (t * (Math.PI / 2) * 0.85);
        const curX = x0 + w - rTR + rTR * Math.cos(angle);
        const curY = y0 + rTR - rTR * Math.sin(angle);
        const nx = Math.cos(angle);
        const ny = -Math.sin(angle);
        const curT = rightT * (1 - t) * currentAccum;

        innerPoints.push({ x: curX, y: curY });
        outerPoints.push({ x: curX + nx * curT, y: curY + ny * curT });
      }

      return { outerPoints, innerPoints };
    };

    // Helper to spawn snow particles
    const spawnFlakes = (count: number, baseVx: number, baseVy: number, isHardChunk = false) => {
      const { outerPoints } = getPoints(targetW, accumScale);
      if (outerPoints.length === 0) return;

      for (let i = 0; i < count; i++) {
        const pt = outerPoints[Math.floor(Math.random() * outerPoints.length)];
        particles.push({
          x: pt.x + (Math.random() - 0.5) * 5,
          y: pt.y + (Math.random() - 0.5) * 3,
          vx: baseVx + (Math.random() - 0.5) * 1.6,
          vy: baseVy + Math.random() * 1.5,
          size: isHardChunk
            ? (size === 'sm' ? 1.8 + Math.random() * 1.5 : 2.5 + Math.random() * 2.2)
            : (size === 'sm' ? 1.1 + Math.random() * 1.0 : 1.4 + Math.random() * 1.6),
          opacity: 0.95,
          life: 1.0,
          decay: 0.012 + Math.random() * 0.014,
        });
      }
    };

    // Resize handling
    const updateDimensions = () => {
      if (!target || !canvas) return;
      const rect = target.getBoundingClientRect();
      targetW = rect.width;
      targetH = rect.height;

      const dpr = window.devicePixelRatio || 1;
      const totalW = targetW + LEFT_PAD + RIGHT_PAD;
      const totalH = targetH + TOP_PAD + BOTTOM_PAD;

      canvas.width = Math.round(totalW * dpr);
      canvas.height = Math.round(totalH * dpr);
      canvas.style.width = `${totalW}px`;
      canvas.style.height = `${totalH}px`;
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => updateDimensions());
    resizeObserver.observe(target);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) isVisible = entry.isIntersecting;
      },
      { rootMargin: '80px' }
    );
    intersectionObserver.observe(target);

    let frameCount = 0;

    // Animation Loop
    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (!isVisible) return;

      frameCount++;
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, targetW + LEFT_PAD + RIGHT_PAD, targetH + TOP_PAD + BOTTOM_PAD);

      // A. Discard Animation & Falling Snow (for Experience Cards in Resume)
      const domDiscard = parseFloat(target.dataset.discard || '0');
      const domDir = parseFloat(target.dataset.direction || '1');
      const currentDiscard = domDiscard > 0 ? domDiscard : discardRef.current.progress;
      const discardDir = domDiscard !== 0 ? domDir : discardRef.current.direction;

      let discardFade = 1.0;
      if (currentDiscard > 0.01) {
        // Smooth fade-out of the snow blanket as the card is discarded
        discardFade = Math.max(0, 1 - currentDiscard * 2.2);

        // Continuously shed falling snow particles cascading downward!
        if (currentDiscard < 0.8 && frameCount % 2 === 0) {
          const spawnCount = Math.floor(2 + Math.random() * 3);
          for (let s = 0; s < spawnCount; s++) {
            const rx = LEFT_PAD + Math.random() * targetW;
            particles.push({
              x: rx,
              y: TOP_PAD + Math.random() * 5,
              vx: (discardDir * (1.6 + Math.random() * 2.4)) + (Math.random() - 0.5) * 1.4,
              vy: 1.8 + Math.random() * 2.6, // Downward falling velocity with gravity!
              size: 1.4 + Math.random() * 2.0,
              opacity: 0.95,
              life: 1.0,
              decay: 0.014 + Math.random() * 0.012,
            });
          }
        }
      }

      // B. Fling Trigger (e.g. Photo Flip)
      if (flingRef.current !== lastFlingVal) {
        lastFlingVal = flingRef.current;
        if (accumScale > 0.05) {
          spawnFlakes(32, (Math.random() - 0.5) * 6 + 0.8, Math.random() * 2.5 + 1.2, true);
          accumScale = 0; // FULLY GONE so no snow is left stranded in mid-air!
          flingCooldown = 65; // ~1100ms pause during the 700ms 3D flip animation
        }
      }

      if (flingCooldown > 0) {
        flingCooldown--;
      }

      // C. Spring Motion Tracking with Two-Layer Snow Resistance:
      // - Moderate shake dislodges the soft powdery top snow (down to HARD_BASE).
      // - Hard, vigorous shake (speed > 2.2) cracks the stubborn hard base snow!
      let springSpeed = 0;
      let sdx = 0;
      let sdy = 0;
      if (springX && springY) {
        const sx = springX.get();
        const sy = springY.get();
        sdx = sx - prevSpringX;
        sdy = sy - prevSpringY;
        prevSpringX = sx;
        prevSpringY = sy;
        springSpeed = Math.hypot(sdx, sdy);

        if (springSpeed > 0.6) {
          if (accumScale > HARD_BASE) {
            // Shed loose powdery top snow
            const softLost = Math.min(accumScale - HARD_BASE, (springSpeed - 0.4) * 0.08);
            accumScale -= softLost;
            if (softLost > 0.01 && Math.random() < 0.35) {
              spawnFlakes(2, (sdx * 0.25) + 0.4, Math.random() * 1.4 + 0.6, false);
            }
          } else if (springSpeed > 2.2) {
            // HARD VIGOROUS SHAKE: cracks the hard base snow!
            const hardLost = (springSpeed - 2.2) * 0.05;
            accumScale = Math.max(0, accumScale - hardLost);
            if (hardLost > 0.01 && Math.random() < 0.45) {
              spawnFlakes(3, (sdx * 0.35) + 0.5, Math.random() * 1.8 + 1.0, true);
            }
          }
        }
      }

      // D. Accumulation Recovery when Resting
      const isResting =
        currentDiscard < 0.02 &&
        springSpeed < 0.3 &&
        pointerSpeed < 2 &&
        flingCooldown <= 0 &&
        (!shedOnHover || !isHovered);
      pointerSpeed *= 0.9;

      if (isResting && accumScale < 1.0) {
        accumScale = Math.min(1.0, accumScale + 0.0035); // Rebuilds in ~5-6s
      }

      // E. Incoming Flakes from Top-Left (Gentle ambient drift)
      if (incomingFlakes.length < 5 && Math.random() < 0.12 && isResting) {
        incomingFlakes.push({
          x: Math.random() * (targetW * 0.7) - 5,
          y: -2,
          vx: 0.8 + Math.random() * 0.6,
          vy: 1.0 + Math.random() * 0.6,
          size: size === 'sm' ? 1.0 : 1.3,
        });
      }

      for (let i = incomingFlakes.length - 1; i >= 0; i--) {
        const flake = incomingFlakes[i];
        flake.x += flake.vx;
        flake.y += flake.vy;

        if (flake.y >= TOP_PAD - 4 && flake.x >= 0 && flake.x <= targetW + LEFT_PAD) {
          accumScale = Math.min(1.0, accumScale + 0.012);
          incomingFlakes.splice(i, 1);
        } else if (flake.y > targetH + TOP_PAD) {
          incomingFlakes.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.95)';
          ctx.fill();
        }
      }

      // F. Render Smooth Snow Blanket with Discard Fade
      if (accumScale > 0.03 && discardFade > 0.02) {
        const { outerPoints, innerPoints } = getPoints(targetW, accumScale);

        if (outerPoints.length > 3 && innerPoints.length > 3) {
          ctx.save();
          ctx.globalAlpha = discardFade;

          ctx.beginPath();
          ctx.moveTo(outerPoints[0].x, outerPoints[0].y);

          // Smooth quadratic bezier curve across all outer points
          for (let i = 0; i < outerPoints.length - 1; i++) {
            const curr = outerPoints[i];
            const next = outerPoints[i + 1];
            const midX = (curr.x + next.x) / 2;
            const midY = (curr.y + next.y) / 2;
            ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
          }
          const lastOuter = outerPoints[outerPoints.length - 1];
          ctx.lineTo(lastOuter.x, lastOuter.y);

          // Connect to inner boundary
          const lastInner = innerPoints[innerPoints.length - 1];
          ctx.lineTo(lastInner.x, lastInner.y);

          // Trace inner boundary back along card border
          for (let i = innerPoints.length - 1; i >= 0; i--) {
            const pt = innerPoints[i];
            ctx.lineTo(pt.x, pt.y + 0.5);
          }
          ctx.closePath();

          // Soft pillowy white gradient fill
          const grad = ctx.createLinearGradient(
            LEFT_PAD,
            TOP_PAD - 12,
            LEFT_PAD + targetW * 0.8,
            TOP_PAD + 4
          );
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(
            1,
            isDark ? 'rgba(226, 235, 248, 0.95)' : 'rgba(235, 244, 255, 0.98)'
          );
          ctx.fillStyle = grad;
          ctx.fill();

          // Subtle soft underside shading anchoring snow to card
          ctx.strokeStyle = isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(150, 180, 215, 0.35)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Gentle soft highlight along the upper crest
          ctx.beginPath();
          const crestIdx = Math.min(outerPoints.length - 1, 12);
          for (let i = 2; i <= crestIdx; i++) {
            const p = outerPoints[i];
            if (i === 2) ctx.moveTo(p.x, p.y + 1);
            else ctx.lineTo(p.x, p.y + 1);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          ctx.restore();
        }
      }

      // G. Render Falling / Thrown Particles (Falling Cascade)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // gravity acceleration
        p.vx += 0.02; // gentle air drift to right
        p.vx *= 0.98; // air drag
        p.life -= p.decay;

        if (p.life <= 0 || p.y > targetH + TOP_PAD + BOTTOM_PAD) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life * p.opacity);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (shedOnHover) {
        target.removeEventListener('pointerenter', handlePointerEnter as EventListener);
        target.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      }
      if (dislodgeOnHover || shedOnHover) {
        target.removeEventListener('pointermove', handlePointerMove as EventListener);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [containerRef, size, springX, springY, dislodgeOnHover, shedOnHover]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute z-[25] ${className}`}
      style={{
        top: `-${TOP_PAD}px`,
        left: `-${LEFT_PAD}px`,
      }}
    />
  );
}
