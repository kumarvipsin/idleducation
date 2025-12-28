'use server';
/**
 * @fileOverview Personalized study plan generator flow.
 *
 * This file defines a Genkit flow that generates a personalized study plan
 * based on the user's class, subjects, exam goals, and available time.
 *
 * @interface PersonalizedStudyPlanInput - The input type for the flow.
 * @interface PersonalizedStudyPlanOutput - The output type for the flow.
 * @function generatePersonalizedStudyPlan - The main function to generate a personalized study plan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStudyPlanInputSchema = z.object({
  gradeLevel: z
    .number()
    .min(4)
    .max(12)
    .describe('The grade level of the student (4 to 12).'),
  subjects: z
    .array(z.string())
    .describe('The subjects the student wants to study.'),
  examGoals: z.string().describe('The student’s goals for the exams.'),
  availableTime: z
    .string()
    .describe(
      'The amount of time the student has available to study (e.g., 2 hours per day).'
    ),
});
export type PersonalizedStudyPlanInput = z.infer<typeof PersonalizedStudyPlanInputSchema>;

const PersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z
    .string()
    .describe('A personalized study plan based on the input parameters.'),
});
export type PersonalizedStudyPlanOutput = z.infer<typeof PersonalizedStudyPlanOutputSchema>;

const personalizedStudyPlanPrompt = ai.definePrompt({
  name: 'personalizedStudyPlanPrompt',
  input: {schema: PersonalizedStudyPlanInputSchema},
  output: {schema: PersonalizedStudyPlanOutputSchema},
  prompt: `You are an AI study plan generator. Generate a personalized study plan for a student.

  Consider the student's grade level, subjects, exam goals, and available time to create an effective and efficient study plan. The student's goals should be the primary driver for the study plan.

  Grade Level: {{{gradeLevel}}}
  Subjects: {{#each subjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Exam Goals: {{{examGoals}}}
  Available Time: {{{availableTime}}}

  Study Plan:
`,
});

const personalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'personalizedStudyPlanFlow',
    inputSchema: PersonalizedStudyPlanInputSchema,
    outputSchema: PersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await personalizedStudyPlanPrompt(input);
    return output!;
  }
);

export async function generatePersonalizedStudyPlan(
  input: PersonalizedStudyPlanInput
): Promise<PersonalizedStudyPlanOutput> {
  return personalizedStudyPlanFlow(input);
}
