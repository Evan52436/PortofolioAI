'use client';

import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
        className
      )}
    >
      {children}
    </a>
  );
}
