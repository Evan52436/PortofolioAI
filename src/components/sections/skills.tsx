'use client';

import {
  BrainCircuit,
  Database,
  Globe,
  Guitar,
  Music,
  Server,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const skills = [
  {
    name: 'Web Development',
    icon: <Globe className="h-10 w-10 text-primary mb-4" />,
    description: 'HTML5, CSS3, JavaScript, Java',
  },
  {
    name: 'Backend',
    icon: <Server className="h-10 w-10 text-primary mb-4" />,
    description: 'Docker',
  },
  {
    name: 'Databases',
    icon: <Database className="h-10 w-10 text-primary mb-4" />,
    description: 'SQL dan MariaDB',
  },
  {
    name: 'Cybersecurity',
    icon: <BrainCircuit className="h-10 w-10 text-primary mb-4" />,
    description: 'Networking & CTF',
  },
  {
    name: 'Music Production',
    icon: <Music className="h-10 w-10 text-primary mb-4" />,
    description: 'Presonus Studio One & Vocaloid',
  },
  {
    name: 'Instruments',
    icon: <Guitar className="h-10 w-10 text-primary mb-4" />,
    description: 'Piano & Guitar',
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            My Skills
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A look at my proficiency in various technologies and musical
            talents.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card
              key={skill.name}
              className="flex flex-col items-center justify-center p-6 text-center"
            >
              <CardHeader className="p-0 flex items-center">
                {skill.icon}
                <CardTitle className="mt-4">{skill.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
