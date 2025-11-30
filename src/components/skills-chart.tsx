'use client';

import { useAppTheme } from '@/context/theme-provider';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Skill = {
  name: string;
  proficiency: number;
  category: string;
};

export function SkillsChart({ skills }: { skills: Skill[] }) {
  const { theme } = useAppTheme();
  
  const filteredSkills = skills.filter(skill => 
    theme === 'coding' ? skill.category === 'code' : skill.category === 'music'
  );

  const chartConfig = {
    proficiency: {
      label: "Proficiency",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{theme} Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={filteredSkills} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  width={80}
                />
                <XAxis dataKey="proficiency" type="number" hide />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="proficiency" fill="var(--color-proficiency)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
