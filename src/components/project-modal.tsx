'use client';

import * as React from 'react';
import Image from 'next/image';
import { ExternalLink, Layers, Github, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { projects } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type Project = (typeof projects)[0];

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [activeImage, setActiveImage] = React.useState<ImagePlaceholder | null>(null);

  React.useEffect(() => {
    if (project) {
      setActiveImage(project.image);
    }
  }, [project]);

  if (!project) return null;

  const currentImage = activeImage || project.image;
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
  const isCompetition = project.category?.toLowerCase() === 'competition';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8 md:p-10 border-2 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-2">
          {/* Left Column: Big Main Image Preview & Extra Small Photo Placeholders */}
          <div className="md:col-span-7 flex flex-col gap-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/40 shadow-lg group">
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.description || project.title}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium inline-block truncate shadow-sm">
                {currentImage.description || project.title}
              </div>
            </div>

            {/* Extra Small Photos Placeholder Gallery */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>More Previews</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {gallery.map((img, idx) => {
                  const isActive = currentImage.imageUrl === img.imageUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        'relative h-20 w-28 overflow-hidden rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary',
                        isActive
                          ? 'border-primary ring-2 ring-primary/40 scale-105 opacity-100 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:border-muted-foreground/30'
                      )}
                    >
                      <Image
                        src={img.imageUrl}
                        alt={img.description}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Description, Technologies & External Action Link */}
          <div className="md:col-span-5 flex flex-col h-full justify-between gap-6">
            <div className="space-y-5">
              <div>
                <Badge variant="outline" className="mb-2.5 uppercase text-[10px] tracking-widest font-semibold px-2.5 py-0.5">
                  {project.category}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {project.title}
                </h2>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                  About Project
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2.5">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 text-xs font-medium">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 border-t flex flex-col gap-3 w-full mt-auto">
              {isCompetition ? (
                <Button asChild className="w-full justify-center shadow-md h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href={currentImage.imageUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </a>
                </Button>
              ) : (
                <>
                  {project.url && project.url !== '#' ? (
                    <Button asChild className="w-full justify-center shadow-md h-11 text-sm font-medium">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <span>Visit Live Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="w-full justify-center opacity-60 h-11 text-sm font-medium">
                      Internal Project
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary font-medium h-11 text-sm transition-colors"
                  >
                    <a
                      href={(project as any).githubUrl || 'https://github.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub Repository</span>
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
