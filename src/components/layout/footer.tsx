'use client';

import { useEffect, useRef } from 'react';
import { scroll } from 'motion';

const FAN_SPREAD_EM = 0.2;

export function Footer() {
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const lines = Array.from(
      stack.querySelectorAll<HTMLElement>('.footer-stack-line'),
    );
    const measure = stack.querySelector<HTMLElement>('.footer-stack-measure');
    let raf = 0;
    let fontSizePx = 0;
    let stackDocTop = 0;
    let stackHeight = 0;

    const fit = () => {
      if (!measure) return;
      measure.style.fontSize = '100px';
      const wordWidth = measure.offsetWidth;
      if (wordWidth > 0) {
        // 96% of viewport width: a touch smaller than full-bleed so the
        // first/last letters never clip, still reading as edge-to-edge.
        const px = ((stack.clientWidth * 0.96) / wordWidth) * 100;
        fontSizePx = px;
        stack.style.setProperty('--fs', `${px}px`);
        const heightPx = px * (1.1 + FAN_SPREAD_EM * 2);
        stack.style.height = `${heightPx.toFixed(1)}px`;
        stackHeight = heightPx;

        let top = 0;
        let curr: HTMLElement | null = stack;
        while (curr) {
          top += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }
        stackDocTop = top || (stack.getBoundingClientRect().top + (window.scrollY || 0));
      }
    };

    const render = () => {
      raf = 0;
      if (!stack.offsetParent) {
        lines.forEach((line) => (line.style.transform = ''));
        return;
      }

      const viewportHeight = window.innerHeight;
      const scrollY = typeof window !== 'undefined' ? (window.lenis?.scroll ?? window.scrollY ?? 0) : 0;
      const top = stackDocTop - scrollY;
      const total = stackHeight || 200;

      let progress = Math.min(Math.max((viewportHeight - top) / total, 0), 1);
      progress = 1 - Math.pow(1 - progress, 1.5);

      lines.forEach((line, index) => {
        line.style.transform = `translateY(${(
          index *
          (1 - progress) *
          FAN_SPREAD_EM
        ).toFixed(3)}em)`;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onResize = () => {
      fit();
      schedule();
    };

    fit();
    // Re-measure once the real font is in: Archivo Black loads async, so the
    // first fit() may have measured with the Poppins fallback (narrower),
    // which would overflow once Archivo Black renders.
    const refit = () => fit();
    document.fonts.load('400 100px "Archivo Black"').then(refit).catch(() => {});
    document.fonts.addEventListener('loadingdone', refit);
    const retry = window.setTimeout(refit, 300);
    const cancelMotionScroll = scroll(() => schedule());
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', refit);
    schedule();

    return () => {
      window.clearTimeout(retry);
      document.fonts.removeEventListener('loadingdone', refit);
      cancelMotionScroll();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', refit);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <footer className="overflow-hidden">
      <div
        ref={stackRef}
        className="footer-stack"
        role="img"
        aria-label="chargerleptop"
      >
        <span className="footer-stack-line">chargerleptop</span>
        <span className="footer-stack-line" aria-hidden="true">
          chargerleptop
        </span>
        <span className="footer-stack-line" aria-hidden="true">
          chargerleptop
        </span>
        <span className="footer-stack-measure" aria-hidden="true">
          chargerleptop
        </span>
      </div>
      <p className="pt-3 pb-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Evan Pranawa Armansyah.
      </p>
    </footer>
  );
}