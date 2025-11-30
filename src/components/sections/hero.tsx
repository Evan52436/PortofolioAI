import Image from 'next/image';
import { studentData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden py-20 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="mb-4 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {studentData.name}
            </h1>
            <p className="mb-2 text-lg font-medium text-primary md:text-xl">
              {studentData.major}
            </p>
            <p className="max-w-xl text-muted-foreground md:text-lg">
              {studentData.bio}
            </p>
            <Button asChild size="lg" className="mt-8 transition-transform duration-300 hover:scale-105">
              <a href="#contact">
                Get in Touch <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
          <div className="relative mx-auto w-fit">
            <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl md:h-80 md:w-80 lg:h-96 lg:w-96">
              <Image
                src={studentData.profilePicture.imageUrl}
                alt={studentData.profilePicture.description}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                data-ai-hint={studentData.profilePicture.imageHint}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-accent opacity-20 blur-2xl" />
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
