/**
 * macOS Genie / Magic Lamp — Canvas mesh-warp engine.
 *
 * A `clip-path` band is a flat DOM rectangle, so no pile of scale/skew on
 * bands can ever form a curve; that approach always reads as stacked strips.
 * To make the card behave like one flexible sheet we instead:
 *
 *   1. rasterise the card ONCE (pre-warmed while the progress bar runs),
 *   2. subdivide it into a COLS x ROWS grid of quads,
 *   3. push every grid vertex through a single continuous warp function,
 *   4. draw each quad as two affine-mapped triangles.
 *
 * Because step 3 is a continuous function of (u, v), neighbouring quads share
 * vertices exactly — there are no seams, no strips, and no fades needed to
 * hide them. The sheet just bends.
 */

import { toSvg } from 'html-to-image';

export interface GenieGeo {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Snapshot {
  /** The rasterised card. Kept as a canvas so drawImage needs no decode. */
  tex: HTMLCanvasElement;
  geo: GenieGeo;
}

/**
 * Load an image with a HARD timeout.
 *
 * html-to-image's own `createImage` has a real bug: its `onload` handler calls
 * `img.decode().then(...)` with no `.catch()`. Firefox (mobile especially)
 * rejects `decode()` for large SVG data-URIs, and because there is no catch
 * path, that promise NEVER settles — `toCanvas` hangs forever and the exit
 * animation is blocked permanently. Loading the image ourselves means we can
 * always resolve or reject, never hang.
 */
function loadImage(src: string, timeoutMs: number): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let done = false;

    const settle = (fn: () => void) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn();
    };

    const timer = setTimeout(
      () => settle(() => reject(new Error('snapshot image load timed out'))),
      timeoutMs,
    );

    img.onload = () =>
      settle(() => {
        // decode() is a nice-to-have (guarantees paint-ready pixels); a
        // rejection must not be fatal here, which is the bug we're avoiding.
        if (typeof img.decode === 'function') {
          img.decode().then(
            () => resolve(img),
            () => resolve(img),
          );
        } else {
          resolve(img);
        }
      });
    img.onerror = () => settle(() => reject(new Error('snapshot image failed to load')));

    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

/** Rasterise an element once. Rejects cheaply if the element has no layout. */
export async function snapshotCard(
  el: HTMLElement,
  pixelRatio = 2,
  timeoutMs = 4000,
): Promise<Snapshot | null> {
  // Fonts must be in before we rasterise, or the texture ships fallback glyphs.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* non-fatal */
    }
  }

  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;

  /**
   * Deliberately NO `backgroundColor` option. html-to-image applies that with
   * a `fillRect` over the whole canvas, which squares off the card's rounded
   * corners in the texture. The card now paints its own opaque `bg-card`, so
   * its corners are genuinely opaque and no fill is needed.
   *
   * We take the SVG route and rasterise it ourselves rather than calling
   * `toCanvas`, so the image-load step is the timeout-guarded one above.
   */
  const dataUrl = await toSvg(el, {
    cacheBust: true,
    // Inline the webfonts (Poppins / JetBrains Mono) into the snapshot.
    skipFonts: false,
  });

  const img = await loadImage(dataUrl, timeoutMs);

  const w = Math.round(r.width * pixelRatio);
  const h = Math.round(r.height * pixelRatio);
  const tex = document.createElement('canvas');
  tex.width = w;
  tex.height = h;
  const ctx = tex.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);

  return {
    tex,
    geo: { left: r.left, top: r.top, width: r.width, height: r.height },
  };
}

/* ------------------------------------------------------------------ */
/* Triangle rasterisation                                              */
/* ------------------------------------------------------------------ */

/**
 * Draw `img` mapped affinely from source triangle (u*, v*) to destination
 * triangle (x*, y*). Standard three-point affine solve + clip.
 *
 * Coordinates are pre-multiplied by dpr, and `img` is a device-pixel texture,
 * so the source coords are already in texture space.
 */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x0: number, y0: number, x1: number, y1: number, x2: number, y2: number,
  u0: number, v0: number, u1: number, v1: number, u2: number, v2: number,
) {
  const denom = (u1 - u0) * (v2 - v0) - (u2 - u0) * (v1 - v0);
  if (denom === 0) return;

  const a = ((x1 - x0) * (v2 - v0) - (x2 - x0) * (v1 - v0)) / denom;
  const b = ((y1 - y0) * (v2 - v0) - (y2 - y0) * (v1 - v0)) / denom;
  const c = ((x2 - x0) * (u1 - u0) - (x1 - x0) * (u2 - u0)) / denom;
  const d = ((y2 - y0) * (u1 - u0) - (y1 - y0) * (u2 - u0)) / denom;
  const e = x0 - a * u0 - c * v0;
  const f = y0 - b * u0 - d * v0;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.clip();
  ctx.transform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/** Grow a triangle 1.5% about its centroid to hide antialiasing hairlines. */
function expand(
  x0: number, y0: number, x1: number, y1: number, x2: number, y2: number,
): [number, number, number, number, number, number] {
  const cx = (x0 + x1 + x2) / 3;
  const cy = (y0 + y1 + y2) / 3;
  const k = 1.015;
  return [
    cx + (x0 - cx) * k, cy + (y0 - cy) * k,
    cx + (x1 - cx) * k, cy + (y1 - cy) * k,
    cx + (x2 - cx) * k, cy + (y2 - cy) * k,
  ];
}

/* ------------------------------------------------------------------ */
/* Warp                                                                */
/* ------------------------------------------------------------------ */

export interface WarpOptions {
  cols?: number;
  rows?: number;
  /** How far the bottom rows lead the top rows. Higher = more dramatic pour. */
  stagger?: number;
  /** Lateral bulge of the mid-sheet, as a fraction of card width. */
  fold?: number;
}

export interface GenieTarget {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * Render the sheet at progress `t` (0 = rest, 1 = fully poured into the lamp).
 * `ctx` is expected to already be sized to the viewport in device pixels.
 */
export function renderGenie(
  ctx: CanvasRenderingContext2D,
  tex: CanvasImageSource,
  geo: GenieGeo,
  target: GenieTarget,
  t: number,
  dpr: number,
  opts: WarpOptions = {},
) {
  const cols = opts.cols ?? 18;
  const rows = opts.rows ?? 22;
  const STAGGER = opts.stagger ?? 0.38;
  const FOLD = opts.fold ?? 0.14;

  const W = geo.width;
  const H = geo.height;
  const texW = (tex as HTMLCanvasElement).width || W * dpr;
  const texH = (tex as HTMLCanvasElement).height || H * dpr;

  const cardCx = geo.left + W / 2;
  // The fold leans toward whichever side the lamp is on.
  const foldDir = Math.sign(target.x - cardCx) || 1;
  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

  /**
   * Continuous warp function supporting both point targets (e.g. taskbar)
   * and rectangular card targets (e.g. parent project card).
   */
  const warp = (u: number, v: number): [number, number] => {
    const sx = geo.left + u * W;
    const sy = geo.top + v * H;

    // Direct the leading edge toward the target
    const isBelow = target.y >= (geo.top + H / 2);
    const lead = isBelow ? (1 - v) : v;
    const ti = clamp01((t - lead * STAGGER) / (1 - STAGGER));
    const e = Math.pow(ti, 1.35);

    const targetLeft = target.width ? (target.x - target.width / 2) : target.x;
    const destX = target.width ? (targetLeft + u * target.width) : target.x;
    const targetTop = target.height ? (target.y - target.height / 2) : target.y;
    const destY = target.height ? (targetTop + v * target.height) : target.y;

    const baseDx = sx + (destX - sx) * e;
    const baseDy = sy + (destY - sy) * e;

    let dx = baseDx;
    let dy = baseDy;

    if (target.width) {
      // Sinusoidal neck pinch mid-flight
      const midT = Math.sin(Math.PI * ti);
      const pinch = midT * 0.38;
      const currentCenterX = (geo.left + W / 2) + (target.x - (geo.left + W / 2)) * e;
      dx = currentCenterX + (dx - currentCenterX) * (1 - pinch);
    } else {
      // Squeeze toward the single-point lamp
      const pinch = 0.92 * e;
      dx = target.x + (dx - target.x) * (1 - pinch);
    }

    // Bulge out sideways through the middle of the sheet (macOS magic lamp curve)
    dx += FOLD * W * e * (1 - e) * Math.sin(Math.PI * v) * foldDir;

    return [dx, dy];
  };

  // Build the vertex grid once per frame: xs[j][i], ys[j][i].
  const xs: number[][] = [];
  const ys: number[][] = [];
  for (let j = 0; j <= rows; j++) {
    const rx: number[] = [];
    const ry: number[] = [];
    for (let i = 0; i <= cols; i++) {
      const [dx, dy] = warp(i / cols, j / rows);
      rx.push(dx * dpr);
      ry.push(dy * dpr);
    }
    xs.push(rx);
    ys.push(ry);
  }

  // Everything converges to the lamp; smooth fade at the very tip
  if (target.width) {
    ctx.globalAlpha = t > 0.94 ? Math.max(0, 1 - (t - 0.94) / 0.06) : 1;
  } else {
    ctx.globalAlpha = t > 0.92 ? Math.max(0, 1 - (t - 0.92) / 0.08) : 1;
  }
  ctx.imageSmoothingEnabled = true;

  const tw = texW / cols;
  const th = texH / rows;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const u0 = i * tw, v0 = j * th;
      const u1 = (i + 1) * tw, v1 = (j + 1) * th;

      const x00 = xs[j][i], y00 = ys[j][i];
      const x10 = xs[j][i + 1], y10 = ys[j][i + 1];
      const x01 = xs[j + 1][i], y01 = ys[j + 1][i];
      const x11 = xs[j + 1][i + 1], y11 = ys[j + 1][i + 1];

      // Quad split into two triangles, sharing the u0,v0 -> u1,v1 diagonal.
      let [a0x, a0y, a1x, a1y, a2x, a2y] = expand(x00, y00, x10, y10, x01, y01);
      drawTriangle(ctx, tex, a0x, a0y, a1x, a1y, a2x, a2y, u0, v0, u1, v0, u0, v1);

      [a0x, a0y, a1x, a1y, a2x, a2y] = expand(x10, y10, x11, y11, x01, y01);
      drawTriangle(ctx, tex, a0x, a0y, a1x, a1y, a2x, a2y, u1, v0, u1, v1, u0, v1);
    }
  }

  ctx.globalAlpha = 1;
}
