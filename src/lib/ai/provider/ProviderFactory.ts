import { AIProvider, AIProviderConfig } from '../types';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';

export class ProviderFactory {
  static getProvider(providerName?: string): AIProvider {
    // Default to Gemini if no provider specified or project is unconfigured
    const name = providerName || process.env.AI_PROVIDER || 'gemini';
    
    switch (name.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider();
      case 'openai':
        return new OpenAIProvider();
      default:
        console.warn(`Unknown provider '${name}', falling back to Gemini.`);
        return new GeminiProvider();
    }
  }
}
