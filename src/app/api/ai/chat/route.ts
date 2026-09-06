import { NextRequest, NextResponse } from 'next/server';
import { ProviderFactory } from '@/lib/ai/provider/ProviderFactory';
import { AIConfig } from '@/lib/ai/config';
import { AIWebsiteTools } from '@/lib/ai/tools/actions';
import { z } from 'zod';

// Simple payload validation
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(2000)
  })).max(20),
  context: z.object({
    studentClass: z.string().optional(),
    exam: z.string().optional(),
    subject: z.string().optional(),
    language: z.string().optional(),
  }).optional()
});

// Simple in-memory rate limiting (Note: In a multi-instance edge deployment, consider Redis or Firestore)
// We will use a basic Map here as a foundational placeholder structure.
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Validate Configuration
    const configResult = AIConfig.validateConfig();
    const hasApiKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    if (!hasApiKey) {
      console.error('[AI] PROVIDER_ERROR: GEMINI_API_KEY is not configured');
      return NextResponse.json({
        answer: "The AI service is not configured yet. Please contact the administrator.",
        actions: [],
        suggestedPrompts: [],
        metadata: { provider: 'gemini' },
      }, { status: 200 });
    }

    // 3. Parse and Validate Request
    const body = await req.json();
    const result = ChatRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.errors },
        { status: 400 }
      );
    }

    const { messages, context } = result.data;

    // 4. Instantiate Provider (Gemini by default)
    const provider = ProviderFactory.getProvider();
    provider.initialize();

    // 5. Gather intent-based tool data if requested
    // In a fully developed agent, the model would trigger tool calls dynamically.
    // For Phase 1 backend foundation, we simulate the retrieval if the last message mentions specific keywords.
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    let additionalContext = "";
    
    if (lastMessage.includes("course") || lastMessage.includes("class")) {
      const courses = await AIWebsiteTools.searchCourses(context?.studentClass, context?.subject);
      additionalContext += `\n\nVerified Courses Data:\n${JSON.stringify(courses).substring(0, 3000)}`;
    }
    if (lastMessage.includes("teacher") || lastMessage.includes("faculty")) {
      const teachers = await AIWebsiteTools.getTeachers(context?.subject);
      additionalContext += `\n\nVerified Teachers Data:\n${JSON.stringify(teachers).substring(0, 3000)}`;
    }
    if (lastMessage.includes("admission")) {
      const admission = await AIWebsiteTools.getAdmissionInfo();
      additionalContext += `\n\nVerified Admission Info:\n${JSON.stringify(admission)}`;
    }

    const finalSystemPrompt = AIConfig.SYSTEM_INSTRUCTION + additionalContext;

    // 6. Generate Response
    const aiResponse = await provider.generateResponse(messages, finalSystemPrompt, context);

    // 7. Source Transparency Tracking (Internal logs)
    console.log(`[AI Response Generated] Provider: ${aiResponse.metadata?.provider}, IP: ${ip}`);

    // Return the normalized response
    return NextResponse.json(aiResponse);

  } catch (error: any) {
    // Classify the error type for better server-side diagnostics
    const msg = error?.message || String(error);
    if (msg.includes('API_KEY') || msg.includes('FAILED_PRECONDITION') || msg.includes('not configured')) {
      console.error('[AI] PROVIDER_ERROR — API Key / Config issue:', msg);
    } else if (msg.includes('KNOWLEDGE') || msg.includes('getCourse') || msg.includes('getTeacher')) {
      console.error('[AI] KNOWLEDGE_ERROR:', msg);
    } else if (msg.includes('JSON') || msg.includes('parse') || msg.includes('NORMALIZER')) {
      console.error('[AI] NORMALIZATION_ERROR:', msg);
    } else {
      console.error('[AI] UNKNOWN_ERROR:', msg);
    }

    // Safe browser response — never expose internals
    return NextResponse.json({
      answer: "Sorry, I'm having trouble right now. Please try again in a moment.",
      actions: [],
      suggestedPrompts: [],
      metadata: { provider: 'gemini' },
    }, { status: 200 });
  }
}
