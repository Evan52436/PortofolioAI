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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex h-full transform flex-col overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader>
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={project.image.imageUrl}
            alt={project.image.description}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={project.image.imageHint}
          />
        </div>
        <CardTitle className="flex items-center justify-between">
          <span>{project.title}</span>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
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
