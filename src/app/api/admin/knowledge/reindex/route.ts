import { NextResponse } from 'next/server';
import { PDFKnowledgeParser } from '@/lib/ai/knowledge/PDFKnowledgeParser';
import { PDFKnowledgeService } from '@/lib/ai/knowledge/PDFKnowledgeService';

export async function POST() {
  try {
    const res = await PDFKnowledgeParser.scanAndIndexAllPDFs();
    PDFKnowledgeService.invalidateCache();
    return NextResponse.json({
      success: true,
      message: `Re-indexed ${res.totalFiles} PDF file(s). Found ${res.totalQAs} Q&As and ${res.totalChunks} document sections.`,
      data: res,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to re-index knowledge PDFs.' },
      { status: 500 }
    );
  }
}
