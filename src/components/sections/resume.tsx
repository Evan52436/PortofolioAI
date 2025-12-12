import { resume } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export function Resume() {
  return (
    <section id="resume" className="bg-muted/50 py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Experience</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A list project from my experience.
          </p>
        </div>
        <div className="mx-auto max-w-4xl space-y-8">
          <Card className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-primary" />
                <span>Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{exp.company}</h3>
                    <p className="text-sm text-muted-foreground">{exp.period}</p>
                  </div>
                  <p className="text-muted-foreground">{exp.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
