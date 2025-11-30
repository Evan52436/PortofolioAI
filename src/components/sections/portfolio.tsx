import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';

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
        <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4">
          {projects.map((project) => (
            <div key={project.id} className="min-w-[300px] flex-shrink-0 sm:min-w-[350px]">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
