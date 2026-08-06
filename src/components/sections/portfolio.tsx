'use client';

import * as React from 'react';
import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';

type Project = (typeof projects)[0];

export function Portfolio() {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  return (
    <section id="portfolio" className="bg-muted/50 py-20 md:py-28 overflow-hidden">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A collection of my Projects and Achievements.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 pb-4">
          {projects.map((project) => (
            <div key={project.id} className="w-[300px]">
              <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
            </div>
          ))}
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
