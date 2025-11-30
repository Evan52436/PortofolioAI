'use client';

import Image from 'next/image';
import { Code, Music } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
            layout="fill"
            objectFit="cover"
            data-ai-hint={project.image.imageHint}
          />
        </div>
        <CardTitle className="flex items-center justify-between">
          <span>{project.title}</span>
          {project.category === 'code' ? (
            <Code className="h-5 w-5 text-accent" />
          ) : (
            <Music className="h-5 w-5 text-accent" />
          )}
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
