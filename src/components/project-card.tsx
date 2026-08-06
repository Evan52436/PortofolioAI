'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { projects } from '@/lib/data';

type Project = (typeof projects)[0];

export function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="group flex h-full cursor-pointer transform flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/50"
    >
      <CardHeader>
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={project.image.imageUrl}
            alt={project.image.description}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={project.image.imageHint}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur-sm shadow-md">
              Click to Preview
            </span>
          </div>
        </div>
        <CardTitle className="my-2 flex items-center justify-between">
          <span>{project.title}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
