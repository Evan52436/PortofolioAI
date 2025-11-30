'use client';

import { Music, Code } from 'lucide-react';
import { useAppTheme } from '@/context/theme-provider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'coding' ? (
              <Music className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
              <Code className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme === 'coding' ? 'Music' : 'Coding'} Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
