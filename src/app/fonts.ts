import { Poppins, Archivo_Black, JetBrains_Mono } from 'next/font/google';

/**
 * Self-hosted fonts via next/font.
 *
 * These used to be a `<link>` to fonts.googleapis.com. That third-party
 * stylesheet is cross-origin, so reading `sheet.cssRules` throws a
 * SecurityError — which is exactly what crashes the html-to-image snapshot
 * that feeds the genie. next/font downloads the files at build time and serves
 * the CSS + woff2 from our own origin, so the snapshot can inline them.
 *
 * It also removes a render-blocking external request.
 */

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-archivo-black',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const fontClassNames = [
  poppins.variable,
  archivoBlack.variable,
  jetbrainsMono.variable,
].join(' ');