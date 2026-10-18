import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { skillsData, type SkillItem } from '@/lib/data';

function SkillPill({ name, icon }: SkillItem) {
  const icons = Array.isArray(icon) ? icon : [icon];

  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#dfe7f2] dark:bg-secondary/70 hover:bg-[#d5e2ef] dark:hover:bg-secondary border border-[#c4d6e8] dark:border-border/70 px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground transition-all duration-200 select-none shadow-xs hover:scale-105">
      <div className="flex items-center -space-x-1">
        {icons.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={name}
            className="h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-xs object-contain"
            loading="lazy"
          />
        ))}
      </div>
      <span>{name}</span>
    </div>
  );
}

export function Skills() {
  const { header, infrastructure, categories } = skillsData;

  return (
    <section id="skills" className="py-20 md:py-28 scroll-mt-16">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-9 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {header.title}
          </h2>
          <p className="mx-auto mt-2 text-sm sm:text-base text-muted-foreground">
            {header.subtitle}
          </p>
        </div>

        {/* 2-Column Bento Grid with optimized compact gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
          {/* Left Column: Infrastructure Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#e8f0f8]/80 dark:bg-card/75 border border-[#c7d8e8] dark:border-border/80 p-4 sm:p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between">
            {/* Photo container */}
            <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#d6e3f0] dark:bg-muted/40 border border-[#c2d4e6] dark:border-border/60 flex items-center justify-center p-6 text-center select-none shadow-inner group/photo">
              {infrastructure.image ? (
                <Image
                  src={infrastructure.image}
                  alt={infrastructure.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-300 group-hover/photo:scale-105"
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground font-medium leading-relaxed max-w-xs">
                  {infrastructure.imagePlaceholderText}
                </p>
              )}
            </div>

            {/* Title, Extended Description & Link shifted up */}
            <div className="mt-4 sm:mt-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {infrastructure.title}
                  </h3>
                  {infrastructure.linkHref && (
                    <a
                      href={infrastructure.linkHref}
                      className="group/link flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 dark:text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>{infrastructure.linkText}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                </div>

                {/* Extended description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  {infrastructure.description}
                </p>
              </div>

              {/* Infrastructure Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {infrastructure.skills.map((skill) => (
                  <SkillPill key={skill.name} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 3 Stacked Cards with tighter spacing */}
          <div className="flex flex-col gap-3 sm:gap-3.5 justify-between">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl sm:rounded-3xl bg-[#e8f0f8]/80 dark:bg-card/75 border border-[#c7d8e8] dark:border-border/80 p-4 sm:p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      {category.title}
                    </h3>
                    {category.linkHref && (
                      <a
                        href={category.linkHref}
                        className="text-slate-500 hover:text-foreground transition-colors p-1 group/arrow"
                        aria-label={`View ${category.title} projects`}
                      >
                        <ArrowUpRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
                      </a>
                    )}
                  </div>

                  {/* 2-3 line description */}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3.5">
                    {category.description}
                  </p>
                </div>

                <div>
                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {category.skills.map((skill) => (
                      <SkillPill key={skill.name} name={skill.name} icon={skill.icon} />
                    ))}
                  </div>

                  {/* Optional footer caption (e.g. instruments) */}
                  {category.footerText && (
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-muted-foreground font-medium">
                      {category.footerText}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
