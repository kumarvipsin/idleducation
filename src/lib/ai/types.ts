export interface AIAction {
  label: string;
  type: 'navigation' | 'external';
  href: string;
}

export interface AIResponse {
  answer: string;
  actions?: AIAction[];
  suggestedPrompts?: string[];
  sources?: string[];
  metadata?: Record<string, any>;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderConfig {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  /**
   * Initialize the provider
   */
  initialize(config?: AIProviderConfig): void;
  
  /**
   * Generate a response based on conversation history and system prompt
   */
  generateResponse(
    messages: AIMessage[], 
    systemPrompt: string, 
    context?: Record<string, any>
  ): Promise<AIResponse>;
}

export interface StudentContext {
  studentClass?: string;
  exam?: string;
  subject?: string;
  language?: string;
}

export interface AIRequestPayload {
  messages: AIMessage[];
  context?: StudentContext;
}

// TAIKnowledge - For Admin managed knowledge
export interface TAIKnowledge {
  id: string;
  title: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
