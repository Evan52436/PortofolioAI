'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates a starting point or template for a student's portfolio based on their provided skills and projects.
 *
 * - generatePortfolioStartingPoint - A function that takes a description of skills and projects as input and returns a portfolio template.
 * - GeneratePortfolioStartingPointInput - The input type for the generatePortfolioStartingPoint function.
 * - GeneratePortfolioStartingPointOutput - The return type for the generatePortfolioStartingPoint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePortfolioStartingPointInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  major: z.enum(['Computer Science', 'Music']).describe('The student\u0027s major.'),
  skillsAndProjectsDescription: z
    .string()
    .describe(
      'A description of the student\u0027s skills, projects, and any other relevant information for their portfolio.'
    ),
});
export type GeneratePortfolioStartingPointInput = z.infer<
  typeof GeneratePortfolioStartingPointInputSchema
>;

const GeneratePortfolioStartingPointOutputSchema = z.object({
  portfolioTemplate: z
    .string()
    .describe(
      'A portfolio template in a suitable format (e.g., JSON, Markdown, HTML) that can be used as a starting point.'
    ),
  suggestions: z.array(z.string()).describe('Suggestions for improving the portfolio.'),
});
export type GeneratePortfolioStartingPointOutput = z.infer<
  typeof GeneratePortfolioStartingPointOutputSchema
>;

export async function generatePortfolioStartingPoint(
  input: GeneratePortfolioStartingPointInput
): Promise<GeneratePortfolioStartingPointOutput> {
  return generatePortfolioStartingPointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioStartingPointPrompt',
  input: {schema: GeneratePortfolioStartingPointInputSchema},
  output: {schema: GeneratePortfolioStartingPointOutputSchema},
  prompt: `You are an AI portfolio generator designed to help students create a portfolio based on a short description of the student's skills and projects.

You will be provided with the student's name, major and a description of the student's skills and projects. Your task is to generate a portfolio template and suggestions for improvement.

Student Name: {{{studentName}}}
Major: {{{major}}}
Skills and Projects Description: {{{skillsAndProjectsDescription}}}

Portfolio Template:
`, // No Handlebars await calls.
});

const generatePortfolioStartingPointFlow = ai.defineFlow(
  {
    name: 'generatePortfolioStartingPointFlow',
    inputSchema: GeneratePortfolioStartingPointInputSchema,
    outputSchema: GeneratePortfolioStartingPointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
