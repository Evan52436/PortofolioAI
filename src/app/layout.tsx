import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Evan Pranawa Armansyah - Software Engineer & Cybersecurity Enthusiast',
  description: 'The portfolio of Evan Pranawa Armansyah, a vocational high school student specializing in software engineering (Rekayasa Perangkat Lunak) and cybersecurity. Explore my projects, skills, and journey in the world of technology.',
  keywords: ['Evan Pranawa Armansyah', 'Evan', 'Pranawa', 'Armansyah', 'Portfolio', 'Software Engineer', 'Cybersecurity', 'Rekayasa Perangkat Lunak', 'Web Developer', 'Bogor', 'Indonesia'],
  authors: [{ name: 'Evan Pranawa Armansyah', url: 'https://evanpranawa.my.id' }],
  creator: 'Evan Pranawa Armansyah',
  publisher: 'Evan Pranawa Armansyah',
  metadataBase: new URL('https://evanpranawa.my.id'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Evan Pranawa Armansyah - Software Engineer & Cybersecurity Enthusiast',
    description: 'Explore the portfolio of Evan Pranawa Armansyah, showcasing projects in software engineering and cybersecurity.',
    url: 'https://evanpranawa.my.id',
    siteName: 'Evan Pranawa Armansyah Portfolio',
    images: [
      {
        url: '/main.jpeg', // Should be a path to a good OG image
        width: 1200,
        height: 630,
        alt: 'Evan Pranawa Armansyah Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evan Pranawa Armansyah - Software Engineer & Cybersecurity Enthusiast',
    description: 'Explore the portfolio of Evan Pranawa Armansyah, showcasing projects in software engineering and cybersecurity.',
    images: ['/main.jpeg'], // Should be a path to a good Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
