import { AIProvider, AIProviderConfig, AIResponse, AIMessage, AIAction } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;

  initialize(config?: AIProviderConfig): void {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('[AI] GEMINI_API_KEY is not set in environment variables.');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    context?: Record<string, any>
  ): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('[AI] GeminiProvider not initialized. Call initialize() first.');
    }

    let fullSystemPrompt = systemPrompt;
    if (context && Object.keys(context).length > 0) {
      fullSystemPrompt += `\n\nStudent Context:\n${JSON.stringify(context, null, 2)}`;
    }

    // Instruct model to return structured JSON
    fullSystemPrompt += `

IMPORTANT: Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "answer": "<your full answer>",
  "actions": [],
  "suggestedPrompts": ["<follow-up 1>", "<follow-up 2>"]
}`;

    console.log('[AI] raw model request started');

    const model = this.client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: fullSystemPrompt,
    });

    // Build history (all except last message)
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const rawText = result.response.text();

    console.log('[AI] raw model response received');
    console.log('[NORMALIZER] started');

    let parsed: any;
    try {
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[NORMALIZER] JSON parse failed, using raw text');
      parsed = { answer: rawText, actions: [], suggestedPrompts: [] };
    }

    console.log('[NORMALIZER] completed');
    console.log('[API] response sent');

    return {
      answer: parsed.answer || rawText,
      actions: (parsed.actions || []) as AIAction[],
      suggestedPrompts: (parsed.suggestedPrompts || []) as string[],
      metadata: { provider: 'gemini', model: 'gemini-1.5-flash' },
    } as AIResponse;
  }
}
