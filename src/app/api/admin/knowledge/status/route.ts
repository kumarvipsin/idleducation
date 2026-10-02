import { NextResponse } from 'next/server';
import { PDFKnowledgeService } from '@/lib/ai/knowledge/PDFKnowledgeService';

export async function GET() {
  try {
    const status = PDFKnowledgeService.getStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to retrieve knowledge base status' },
      { status: 500 }
    );
  }
}
