'use client';

import { useEffect, useRef } from 'react';

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
      }
    };

    const render = () => {
      raf = 0;
      if (!stack.offsetParent) {
        lines.forEach((line) => (line.style.transform = ''));
        stack.style.height = '';
        return;
      }

      const viewportHeight = window.innerHeight;
      const top = stack.getBoundingClientRect().top;
      const total = stack.getBoundingClientRect().height;

      let progress = Math.min(Math.max((viewportHeight - top) / total, 0), 1);
      progress = 1 - Math.pow(1 - progress, 1.5);

      lines.forEach((line, index) => {
        line.style.transform = `translateY(${(
          index *
          (1 - progress) *
          FAN_SPREAD_EM
        ).toFixed(3)}em)`;
      });

      // Animate the box height so it hugs the fanned layers and the
      // copyright below rides along with the lowest layer.
      if (fontSizePx > 0) {
        const heightPx = fontSizePx * (1.1 + FAN_SPREAD_EM * 2 * (1 - progress));
        stack.style.height = `${heightPx.toFixed(1)}px`;
      }
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
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', refit);
    schedule();

    return () => {
      window.clearTimeout(retry);
      document.fonts.removeEventListener('loadingdone', refit);
      window.removeEventListener('scroll', schedule);
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