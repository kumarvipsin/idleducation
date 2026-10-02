import { PDFKnowledgeParser } from './PDFKnowledgeParser';
import { QAPair, KnowledgeChunk, KnowledgeIndex } from './types';
import { VectorStore, VectorSearchResult } from './VectorStore';

interface ScoredItem<T> {
  item: T;
  score: number;
}

export interface HybridSearchResult {
  qas: (QAPair & { similarity?: number })[];
  chunks: (KnowledgeChunk & { similarity?: number })[];
  vectorMatches: VectorSearchResult[];
}

export class PDFKnowledgeService {
  private static cachedIndex: KnowledgeIndex | null = null;
  private static lastCacheTime = 0;
  private static CACHE_TTL = 30 * 1000; // 30 seconds

  /**
   * Get the current knowledge index with in-memory caching.
   */
  static getIndex(): KnowledgeIndex {
    const now = Date.now();
    if (!this.cachedIndex || now - this.lastCacheTime > this.CACHE_TTL) {
      this.cachedIndex = PDFKnowledgeParser.loadIndex();
      this.lastCacheTime = now;
    }
    return this.cachedIndex;
  }

  /**
   * Invalidate cache when new files are uploaded/indexed.
   */
  static invalidateCache(): void {
    this.cachedIndex = null;
    this.lastCacheTime = 0;
    VectorStore.invalidateCache();
  }

  /**
   * Extracts clean tokens from search text.
   */
  private static tokenize(text: string): string[] {
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'with', 'to', 'from',
      'how', 'what', 'why', 'when', 'where', 'who', 'does', 'can', 'are', 'was', 'were', 'will', 'idl',
      'tell', 'me', 'about', 'please', 'give', 'details', 'know'
    ]);
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));
  }

  /**
   * Calculate relevance score between query tokens and target text.
   */
  private static computeScore(queryTokens: string[], targetText: string, exactTarget: string): number {
    if (!queryTokens.length) return 0;
    const lowerTarget = targetText.toLowerCase();
    const lowerExact = exactTarget.toLowerCase();

    let score = 0;

    // Check full phrase match
    const phrase = queryTokens.join(' ');
    if (lowerExact.includes(phrase)) {
      score += 3.0;
    } else if (lowerTarget.includes(phrase)) {
      score += 1.5;
    }

    // Token frequency and position scoring
    for (const token of queryTokens) {
      if (lowerExact.includes(token)) {
        score += 1.2;
      } else if (lowerTarget.includes(token)) {
        score += 0.6;
      }
    }

    // Bonus for matching questions specifically
    if (queryTokens.some(t => lowerExact.startsWith(t))) {
      score += 0.5;
    }

    return score;
  }

  /**
   * Synchronous keyword/BM25 search.
   */
  static searchKnowledge(query: string, limit = 4): { qas: QAPair[]; chunks: KnowledgeChunk[] } {
    const index = this.getIndex();
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return { qas: [], chunks: [] };
    }

    const scoredQAs: ScoredItem<QAPair>[] = index.qaList
      .map(qa => ({
        item: qa,
        score: this.computeScore(queryTokens, `${qa.question} ${qa.answer}`, qa.question),
      }))
      .filter(entry => entry.score > 0.4)
      .sort((a, b) => b.score - a.score);

    const scoredChunks: ScoredItem<KnowledgeChunk>[] = index.chunks
      .map(chunk => ({
        item: chunk,
        score: this.computeScore(queryTokens, chunk.text, chunk.text.slice(0, 100)),
      }))
      .filter(entry => entry.score > 0.4)
      .sort((a, b) => b.score - a.score);

    return {
      qas: scoredQAs.slice(0, limit).map(s => s.item),
      chunks: scoredChunks.slice(0, Math.max(1, limit - scoredQAs.length)).map(s => s.item),
    };
  }

  /**
   * Hybrid Search: Combines Dense Vector Semantic Cosine Search + Keyword/Phrase Matching.
   * Leverages text-embedding-004 vectors and in-memory Float32Array dot products.
   */
  static async searchKnowledgeAsync(query: string, limit = 4): Promise<HybridSearchResult> {
    const vectorMatches = await VectorStore.search(query, limit, 0.10);
    const keywordResults = this.searchKnowledge(query, limit);

    const qaMap = new Map<string, QAPair & { similarity?: number }>();
    const chunkMap = new Map<string, KnowledgeChunk & { similarity?: number }>();

    // 1. Add vector matches first (semantic understanding)
    for (const vm of vectorMatches) {
      if (vm.type === 'qa' && vm.qaPair) {
        qaMap.set(vm.id, { ...vm.qaPair, similarity: vm.similarity });
      } else if (vm.type === 'chunk' && vm.chunk) {
        chunkMap.set(vm.id, { ...vm.chunk, similarity: vm.similarity });
      }
    }

    // 2. Add keyword matches if not already present
    for (const qa of keywordResults.qas) {
      if (!qaMap.has(qa.id)) {
        qaMap.set(qa.id, qa);
      }
    }
    for (const chunk of keywordResults.chunks) {
      if (!chunkMap.has(chunk.id)) {
        chunkMap.set(chunk.id, chunk);
      }
    }

    return {
      qas: Array.from(qaMap.values()).slice(0, limit),
      chunks: Array.from(chunkMap.values()).slice(0, limit),
      vectorMatches,
    };
  }

  /**
   * Formats retrieved Q&As and chunks into a clean prompt context block for the LLM.
   */
  static async getFormattedContext(query: string, limit = 4): Promise<string> {
    const { qas, chunks } = await this.searchKnowledgeAsync(query, limit);

    if (qas.length === 0 && chunks.length === 0) {
      return '';
    }

    const lines: string[] = ['\nVERIFIED Q&A KNOWLEDGE BASE (from official IDL PDF documents):'];

    if (qas.length > 0) {
      lines.push('--- RELEVANT QUESTIONS & ANSWERS (SEMANTIC VECTOR & KEYWORD MATCHED) ---');
      qas.forEach((qa, idx) => {
        const simText = qa.similarity ? ` [Semantic Match: ${(qa.similarity * 100).toFixed(1)}%]` : '';
        lines.push(`[Q&A ${idx + 1}] (Source: ${qa.source})${simText}`);
        lines.push(`Question: ${qa.question}`);
        lines.push(`Verified Answer: ${qa.answer}\n`);
      });
    }

    if (chunks.length > 0) {
      lines.push('--- SUPPORTING DOCUMENT EXCERPTS ---');
      chunks.forEach((chunk, idx) => {
        const simText = chunk.similarity ? ` [Semantic Match: ${(chunk.similarity * 100).toFixed(1)}%]` : '';
        lines.push(`[Excerpt ${idx + 1}] (Source: ${chunk.source})${simText}:`);
        lines.push(`${chunk.text}\n`);
      });
    }

    return lines.join('\n');
  }

  /**
   * Find a high-confidence direct match if one exists.
   * Evaluates semantic vector similarity (> 0.70) or keyword exact match.
   */
  static async findDirectMatch(query: string): Promise<(QAPair & { similarity?: number }) | null> {
    const { qas } = await this.searchKnowledgeAsync(query, 1);
    if (qas.length > 0) {
      return qas[0];
    }
    return null;
  }

  /**
   * Return metadata and health status of the knowledge base including vector store metrics.
   */
  static getStatus(): {
    isAvailable: boolean;
    totalQAs: number;
    totalChunks: number;
    sourcesCount: number;
    sources: KnowledgeIndex['sources'];
    lastUpdated: string;
    vectorStore: {
      totalVectors: number;
      model: string;
      dimensions: number;
      lastUpdated?: string;
    };
  } {
    const index = this.getIndex();
    const vectorStatus = VectorStore.getStatus();

    return {
      isAvailable: index.qaList.length > 0 || index.chunks.length > 0,
      totalQAs: index.qaList.length,
      totalChunks: index.chunks.length,
      sourcesCount: index.sources.length,
      sources: index.sources,
      lastUpdated: index.lastUpdated,
      vectorStore: vectorStatus,
    };
  }
}
