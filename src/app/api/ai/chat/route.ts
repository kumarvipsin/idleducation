import { NextRequest, NextResponse } from 'next/server';
import { ProviderFactory } from '@/lib/ai/provider/ProviderFactory';
import { AIConfig } from '@/lib/ai/config';
import { AIWebsiteTools } from '@/lib/ai/tools/actions';
import { PDFKnowledgeService } from '@/lib/ai/knowledge/PDFKnowledgeService';
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

    // 2. Parse and Validate Request
    const body = await req.json();
    const result = ChatRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.errors },
        { status: 400 }
      );
    }

    const { messages, context } = result.data;
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const lastMessageLower = lastUserMessage.toLowerCase();

    // 3. Search verified PDF Q&A Knowledge Base (Semantic Vector + Keyword RAG)
    const hybridResults = await PDFKnowledgeService.searchKnowledgeAsync(lastUserMessage, 4);
    const pdfQAContext = await PDFKnowledgeService.getFormattedContext(lastUserMessage, 4);

    // 4. Validate AI Configuration & API Key
    const hasApiKey = !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    if (!hasApiKey) {
      // Graceful fallback: If an exact or close semantic Q&A match exists in the PDF knowledge base, return it!
      const directMatch = await PDFKnowledgeService.findDirectMatch(lastUserMessage);
      const matchedQA = directMatch || (hybridResults.qas.length > 0 ? hybridResults.qas[0] : null);

      if (matchedQA) {
        const sourceName = matchedQA.source.replace(/_/g, ' ').replace(/\.pdf$/i, '');
        const isAcademic = /class|science|math|ch\d|chapter|notes|cell|physics|chemistry|biology/i.test(matchedQA.source) ||
                           /cell|organism|microscope|science|equation|formula|theorem/i.test(lastUserMessage);

        let formattedAnswer = matchedQA.answer;

        // Enrich with related key points from the same PDF notes if available
        const related = hybridResults.qas.filter(q => q.id !== matchedQA.id && q.source === matchedQA.source).slice(0, 2);
        if (related.length > 0) {
          formattedAnswer += `\n\n**Related Notes from Chapter:**\n` + related.map(r => `• **${r.question}**: ${r.answer}`).join('\n');
        }

        formattedAnswer += `\n\n📖 *Verified from: ${sourceName}*`;

        const dynamicPrompts = hybridResults.qas
          .filter(q => q.id !== matchedQA.id)
          .map(q => q.question)
          .slice(0, 3);

        const actions = isAcademic
          ? [{ id: 'act-resources', label: 'Explore Study Resources', type: 'navigation', href: '/study-resources', url: '/study-resources' }]
          : [
              { id: 'act-adm', label: 'Admission 2026–27', type: 'navigation', href: '/admission', url: '/admission' },
              { id: 'act-courses', label: 'Explore Courses', type: 'navigation', href: '/study-resources', url: '/study-resources' }
            ];

        return NextResponse.json({
          answer: formattedAnswer,
          actions,
          suggestedPrompts: dynamicPrompts.length > 0 ? dynamicPrompts : [
            "What courses are offered?",
            "How can I apply for scholarship?",
            "Where are the branch centers located?"
          ],
          metadata: { provider: 'pdf-knowledge-base', source: matchedQA.source },
        }, { status: 200 });
      }

      console.warn('[AI] GEMINI_API_KEY is not configured and no direct PDF match found');
      return NextResponse.json({
        answer: "Welcome to IDL Education! To connect directly with our academic counselor, call or WhatsApp us at +91 88600 40010.",
        actions: [
          { id: 'act-adm', label: 'Admission 2026–27', type: 'navigation', href: '/admission', url: '/admission' },
          { id: 'act-demo', label: 'Book Free Demo', type: 'navigation', href: '/demo', url: '/demo' }
        ],
        suggestedPrompts: [
          "Tell me about Class 11th & 12th JEE/NEET",
          "What are the branch locations?",
          "How to get admission?"
        ],
        metadata: { provider: 'fallback' },
      }, { status: 200 });
    }

    // 5. Instantiate Provider (Gemini by default)
    const provider = ProviderFactory.getProvider();
    provider.initialize();

    // 6. Gather intent-based tool data & inject PDF Q&A context
    let additionalContext = "";
    
    if (pdfQAContext) {
      additionalContext += `\n\n${pdfQAContext}`;
    }

    if (lastMessageLower.includes("course") || lastMessageLower.includes("class")) {
      const courses = await AIWebsiteTools.searchCourses(context?.studentClass, context?.subject);
      additionalContext += `\n\nVerified Courses Data:\n${JSON.stringify(courses).substring(0, 3000)}`;
    }
    if (lastMessageLower.includes("teacher") || lastMessageLower.includes("faculty")) {
      const teachers = await AIWebsiteTools.getTeachers(context?.subject);
      additionalContext += `\n\nVerified Teachers Data:\n${JSON.stringify(teachers).substring(0, 3000)}`;
    }
    if (lastMessageLower.includes("admission")) {
      const admission = await AIWebsiteTools.getAdmissionInfo();
      additionalContext += `\n\nVerified Admission Info:\n${JSON.stringify(admission)}`;
    }

    const finalSystemPrompt = AIConfig.SYSTEM_INSTRUCTION + additionalContext;

    // 7. Generate Response from Google Gemini Model
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
