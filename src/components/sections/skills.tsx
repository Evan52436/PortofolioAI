import { skills } from '@/lib/data';
import { SkillsChart } from '@/components/skills-chart';

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Skills</h2>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
            A look at my proficiency in various technologies and musical talents.
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
            <SkillsChart skills={skills} />
        </div>
      </div>
    </section>
  );
}
