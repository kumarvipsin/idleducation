'use server';
/**
 * @fileOverview A chatbot AI flow for IDL EDUCATION.
 *
 * - askChatbot - A function that handles chatbot queries.
 */

import { ai } from '@/ai/genkit';
import { ChatbotInputSchema, type ChatbotInput, ChatbotOutputSchema, type ChatbotOutput } from '@/ai/schemas/chat';


export async function askChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  const { output } = await chatFlow(input);
  return output!;
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for IDL EDUCATION, an online learning platform.
  Your role is to answer questions from students and parents accurately and concisely.

  Here is some information about IDL EDUCATION:
  - We offer comprehensive learning programs and classes for students from Class 4 to Class 10.
  - We have a personalized learning app for students to learn anytime, anywhere.
  - We offer online tutoring with a unique two-teacher model to ensure doubts are cleared instantly.
  - Students can book a free online or offline session to experience our platform.
  - Key subjects offered include Mathematics, Science, History, and Arts.

  When responding, please adhere to the following guidelines:
  - Be polite, encouraging, and professional.
  - Keep your answers brief and to the point.
  - If you don't know the answer to a question, say "I'm not sure about that. For more details, you can contact IDL EDUCATION at contact@idleducation.com."
  - Do not answer questions that are not related to IDL EDUCATION or education in general.

  User query: {{{prompt}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (prompt) => {
    const { output } = await ai.generate({
      prompt,
      model: ai.model,
    });
    return output as string;
  }
);
