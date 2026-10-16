'use client';

import * as React from 'react';
import Image from 'next/image';
import { Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { resume } from '@/lib/data';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type Experience = (typeof resume.experience)[number] & {
  image?: ImagePlaceholder;
  images?: ImagePlaceholder[];
};

interface ExperienceModalProps {
  experience: Experience | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExperienceModal({ experience, isOpen, onClose }: ExperienceModalProps) {
  const [activeImage, setActiveImage] = React.useState<ImagePlaceholder | null>(null);

  const gallery = React.useMemo(() => {
    if (!experience) return [];
    if (experience.images && experience.images.length > 0) return experience.images;
    if (experience.image) return [experience.image];
    return [];
  }, [experience]);

  React.useEffect(() => {
    if (gallery.length > 0) {
      setActiveImage(gallery[0]);
    } else {
      setActiveImage(null);
    }
  }, [gallery]);

  if (!experience) return null;

  const currentImage = activeImage || gallery[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl lg:max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8 md:p-10 border-2 shadow-2xl z-[100]">
        <DialogHeader className="sr-only">
          <DialogTitle>{experience.role}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mt-2">
          {/* Left Column: Big Main Image Preview & Thumbnail Gallery if multiple */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {currentImage && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted/40 shadow-lg group">
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.description || experience.role}
                  fill
                  className="object-contain transition-all duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-medium inline-block truncate shadow-sm">
                  {currentImage.description || experience.role}
                </div>
              </div>
            )}

            {/* Thumbnail Previews if more than 1 image */}
            {gallery.length > 1 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5" />
                  <span>More Previews</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {gallery.map((img, idx) => {
                    const isActive = currentImage?.imageUrl === img.imageUrl;
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
            )}
          </div>

          {/* Right Column: Title, Blue Divider, Description & Timeline */}
          <div className="md:col-span-5 flex flex-col h-full justify-between gap-6">
            <div className="space-y-5">
              <div>
                <Badge variant="outline" className="mb-2.5 uppercase text-[10px] tracking-widest font-semibold px-2.5 py-0.5">
                  {experience.company}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground whitespace-pre-line">
                  {experience.role}
                </h2>
                {/* Blue divider line */}
                <div className="my-4 h-[2px] w-full max-w-[320px] bg-primary rounded-full" />
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                  About Experience
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                  Timeline
                </h3>
                <p className="text-sm font-medium text-foreground">
                  {experience.period}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
