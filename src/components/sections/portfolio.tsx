'use client';

import * as React from 'react';
import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

type Project = (typeof projects)[0];

export function Portfolio() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 330;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="portfolio" className="bg-muted/50 py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-12 relative">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A collection of my Projects and Achievements.
          </p>
        </div>

        <div className="relative">
          {/* Left Fading Edge (disappears at start) */}
          <div
            className={cn(
              'pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-r from-background via-background/60 to-transparent z-10 transition-opacity duration-300',
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Right Fading Edge (disappears at end) */}
          <div
            className={cn(
              'pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-14 bg-gradient-to-l from-background via-background/60 to-transparent z-10 transition-opacity duration-300',
              canScrollRight ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Scroll Left Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className={cn(
              'absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 rounded-full shadow-xl bg-background/95 backdrop-blur-md hover:bg-background border-2 border-primary/40 text-primary transition-all duration-300 hover:scale-110',
              canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Horizontal Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div key={project.id} className="w-[310px] shrink-0 snap-start">
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className={cn(
              'absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-11 w-11 rounded-full shadow-xl bg-background/95 backdrop-blur-md hover:bg-background border-2 border-primary/40 text-primary transition-all duration-300 hover:scale-110',
              canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
