'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { useDoorTransition } from "@/components/ui/door-transition";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const { triggerDoorTransition } = useDoorTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      onClick?.();
      triggerDoorTransition(href);
    } else {
      onClick?.();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer",
        className
      )}
    >
      {children}
    </a>
  );
}
