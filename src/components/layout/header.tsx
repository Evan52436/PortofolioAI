'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { NavLink } from './nav-link';

const navLinks = [
  { href: '#portfolio', label: 'My Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#resume', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  
  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <nav className="hidden flex-1 items-center md:flex">
          <ul className="flex space-x-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild variant="outline" className="hidden md:inline-flex">
            <a href="/PortofolioLegacy/index.html" target="_blank">
              Legacy Site
            </a>
          </Button>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-8 flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} onClick={closeSheet} className="text-lg">
                      {link.label}
                    </NavLink>
                  ))}
                   <a href="/PortofolioLegacy/index.html" target="_blank" className="text-lg text-muted-foreground transition-colors hover:text-primary" onClick={closeSheet}>
                    Legacy Site
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
