import { NextRequest, NextResponse } from 'next/server';
import { PDFKnowledgeService } from '@/lib/ai/knowledge/PDFKnowledgeService';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, message: 'Query string is required.' }, { status: 400 });
    }

    const hybridResults = await PDFKnowledgeService.searchKnowledgeAsync(query, 5);
    const directMatch = await PDFKnowledgeService.findDirectMatch(query);

    return NextResponse.json({
      success: true,
      data: {
        query,
        directMatch,
        matchedQAs: hybridResults.qas,
        matchedChunks: hybridResults.chunks,
        vectorMatches: hybridResults.vectorMatches.map(vm => ({
          id: vm.id,
          type: vm.type,
          similarity: Number((vm.similarity * 100).toFixed(1)),
          source: vm.source,
          preview: vm.text.slice(0, 120) + (vm.text.length > 120 ? '...' : ''),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Search failed.' },
      { status: 500 }
    );
  }
}
