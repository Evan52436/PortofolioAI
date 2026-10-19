'use client';

import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface SpringCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  maxX?: number;
  maxY?: number;
  className?: string;
}

/**
 * SpringCard provides a bounded spring cursor-follow effect inspired by
 * https://motion.dev/examples/js-spring-follow-cursor with limited movement space.
 */
export function SpringCard({
  children,
  maxX = 28,
  maxY = 20,
  className = '',
  ...props
}: SpringCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Less stiff, bouncier spring physics with physical elasticity
  const springX = useSpring(x, { stiffness: 150, damping: 11, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 150, damping: 11, mass: 0.6 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Don't apply follow on touch screens to ensure mobile scrolling remains frictionless
      if (e.pointerType === 'touch') return;
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const halfW = rect.width / 2 || 1;
      const halfH = rect.height / 2 || 1;

      // Constrain displacement to the limited movement space
      const targetX = Math.max(-maxX, Math.min(maxX, (deltaX / halfW) * maxX));
      const targetY = Math.max(-maxY, Math.min(maxY, (deltaY / halfH) * maxY));

      x.set(targetX);
      y.set(targetY);
    },
    [maxX, maxY, x, y]
  );

  const handlePointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        x: springX,
        y: springY,
        willChange: 'transform',
      }}
      className={cn('relative hover:z-20', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
