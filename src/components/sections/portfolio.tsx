import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import Link from 'next/link';

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-muted/50 py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A collection of my favorite projects in code and music.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 pb-4">
          {projects.map((project) => (
            <div key={project.id} className="w-[300px]">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <ProjectCard project={project} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
