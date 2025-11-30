import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-muted/50 py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A collection of my favorite projects in code and music.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="mx-auto w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ProjectCard project={project} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
