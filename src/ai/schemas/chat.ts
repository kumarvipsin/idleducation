/**
 * @fileOverview Schemas and types for the chatbot functionality.
 */
import { z } from 'zod';

export const ChatbotInputSchema = z.string();
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

export const ChatbotOutputSchema = z.string();
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;
