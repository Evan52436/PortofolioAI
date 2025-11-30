'use client';
import Link from 'next/link';
import { Code, Music } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center justify-center">
                <Code className="h-6 w-6 text-primary" />
                <Music className="h-6 w-6 text-accent" />
            </div>
          <span className="font-bold sm:inline-block">
            Code & Cadence
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
