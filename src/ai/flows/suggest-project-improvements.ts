'use server';

/**
 * @fileOverview An AI agent that suggests improvements for student projects.
 *
 * - suggestProjectImprovements - A function that provides suggestions for project improvements.
 * - SuggestProjectImprovementsInput - The input type for the suggestProjectImprovements function.
 * - SuggestProjectImprovementsOutput - The return type for the suggestProjectImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectImprovementsInputSchema = z.object({
  projectType: z.enum(['code', 'music']).describe('The type of the project (code or music).'),
  projectDescription: z.string().describe('A description of the project.'),
  projectContent: z.string().describe('The content of the project (e.g., code snippet, music sample).'),
});
export type SuggestProjectImprovementsInput = z.infer<typeof SuggestProjectImprovementsInputSchema>;

const SuggestProjectImprovementsOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered suggestions for improving the project.'),
});
export type SuggestProjectImprovementsOutput = z.infer<typeof SuggestProjectImprovementsOutputSchema>;

export async function suggestProjectImprovements(
  input: SuggestProjectImprovementsInput
): Promise<SuggestProjectImprovementsOutput> {
  return suggestProjectImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectImprovementsPrompt',
  input: {schema: SuggestProjectImprovementsInputSchema},
  output: {schema: SuggestProjectImprovementsOutputSchema},
  prompt: `You are an AI expert in both computer science and music.

You will analyze the student's project based on its type ({{projectType}}), description, and content, and provide specific, actionable suggestions for improvement.

Project Description: {{{projectDescription}}}
Project Content: {{{projectContent}}}

Suggestions:
`,
});

const suggestProjectImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestProjectImprovementsFlow',
    inputSchema: SuggestProjectImprovementsInputSchema,
    outputSchema: SuggestProjectImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
