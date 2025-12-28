'use server';

/**
 * @fileOverview Recommends relevant learning materials based on a student's study history and current curriculum.
 *
 * - recommendContent - A function that recommends learning content.
 * - ContentRecommenderInput - The input type for the recommendContent function.
 * - ContentRecommenderOutput - The return type for the recommendContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRecommenderInputSchema = z.object({
  studyHistory: z
    .string()
    .describe(
      'The user study history, including subjects studied, time spent, and performance.'
    ),
  currentCurriculum: z
    .string()
    .describe('The curriculum the user is currently following.'),
});
export type ContentRecommenderInput = z.infer<typeof ContentRecommenderInputSchema>;

const ContentRecommenderOutputSchema = z.object({
  recommendedMaterials: z
    .string()
    .describe('A list of recommended learning materials with brief descriptions.'),
});
export type ContentRecommenderOutput = z.infer<typeof ContentRecommenderOutputSchema>;

export async function recommendContent(
  input: ContentRecommenderInput
): Promise<ContentRecommenderOutput> {
  return contentRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentRecommenderPrompt',
  input: {schema: ContentRecommenderInputSchema},
  output: {schema: ContentRecommenderOutputSchema},
  prompt: `You are an AI assistant designed to recommend learning materials to students.

  Based on the student's study history and current curriculum, suggest relevant learning materials.

  Study History: {{{studyHistory}}}
  Current Curriculum: {{{currentCurriculum}}}

  Recommended Materials:`,
});

const contentRecommenderFlow = ai.defineFlow(
  {
    name: 'contentRecommenderFlow',
    inputSchema: ContentRecommenderInputSchema,
    outputSchema: ContentRecommenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
