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
  other: {
    'Google-Extended': 'disallow: /',
    'GPTBot': 'disallow: /',
    'CCBot': 'disallow: /',
    'anthropic-ai': 'disallow: /',
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

      {/* 
        NERD TWEAK: Added flex, flex-col, and min-h-screen. 
        This is a classic CSS trick to ensure the footer always pushes to the bottom 
        even if the page content (children) is completely empty! 
      */}
      <body className="font-body antialiased flex flex-col min-h-screen">

        {/* Main dynamically wraps the page content and flex-grow ensures it takes up available vertical space */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Footer injected here so it appears across the whole site */}
        <footer className="w-full py-8 flex flex-col items-center justify-center gap-2">

          <img
            src="https://skillicons.dev/icons?i=blender,bash,vscode,php,figma,discord"
            alt="My Tech Stack: Blender, Bash, VS Code, PHP, Figma, and Discord"
            // Adding a little Tailwind padding so it doesn't touch the edges on mobile screens
            className="max-w-full px-4"
          />
          <br /> {/* The properly closed JSX break tag */}

          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Evan Pranawa Armansyah.
          </p>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}