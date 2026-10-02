import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PDFKnowledgeParser } from '@/lib/ai/knowledge/PDFKnowledgeParser';
import { PDFKnowledgeService } from '@/lib/ai/knowledge/PDFKnowledgeService';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'src', 'data', 'knowledge-base');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum limit of 25MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    }

    // Save the PDF file to disk for persistence
    const safeFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const targetFilePath = path.join(KNOWLEDGE_DIR, safeFilename);
    fs.writeFileSync(targetFilePath, buffer);

    // Parse and index the PDF
    const result = await PDFKnowledgeParser.indexPDFBuffer(buffer, safeFilename);

    // Invalidate memory cache so next chatbot query uses new knowledge immediately
    PDFKnowledgeService.invalidateCache();

    return NextResponse.json({
      success: true,
      message: `Successfully parsed and indexed ${result.qaCount} Question-Answer pairs and ${result.chunkCount} document sections from "${file.name}".`,
      data: {
        filename: safeFilename,
        filesize: file.size,
        qaCount: result.qaCount,
        chunkCount: result.chunkCount,
      },
    });
  } catch (error: any) {
    console.error('[Admin Upload PDF Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process and index PDF.' },
      { status: 500 }
    );
  }
}
