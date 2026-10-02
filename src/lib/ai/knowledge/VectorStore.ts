import fs from 'fs';
import path from 'path';
import { QAPair, KnowledgeChunk } from './types';
import { VectorEmbeddingService, cosineSimilarity } from './VectorEmbeddingService';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'src', 'data', 'knowledge-base');
const VECTOR_FILE = path.join(KNOWLEDGE_DIR, 'vector-store.json');

export interface VectorRecord {
  id: string;
  source: string;
  type: 'qa' | 'chunk';
  text: string;
  metadata?: {
    question?: string;
    answer?: string;
    tags?: string[];
  };
  embedding: number[];
}

export interface VectorSearchResult {
  id: string;
  source: string;
  type: 'qa' | 'chunk';
  text: string;
  similarity: number; // 0.0 to 1.0
  qaPair?: QAPair;
  chunk?: KnowledgeChunk;
}

export class VectorStore {
  private static cachedRecords: VectorRecord[] | null = null;
  private static floatArrayCache: Map<string, Float32Array> = new Map();
  private static lastLoaded = 0;
  private static CACHE_TTL = 30 * 1000;

  /**
   * Loads records from disk with in-memory Float32Array optimization.
   */
  static loadRecords(): VectorRecord[] {
    const now = Date.now();
    if (this.cachedRecords && now - this.lastLoaded < this.CACHE_TTL) {
      return this.cachedRecords;
    }

    try {
      if (fs.existsSync(VECTOR_FILE)) {
        const raw = fs.readFileSync(VECTOR_FILE, 'utf8');
        const data = JSON.parse(raw);
        this.cachedRecords = Array.isArray(data) ? data : (data.records || []);
      } else {
        this.cachedRecords = [];
      }
    } catch (err) {
      console.error('[VectorStore] Error loading vector-store.json:', err);
      this.cachedRecords = [];
    }

    // Refresh Float32Array cache for high-speed dot products
    this.floatArrayCache.clear();
    for (const rec of this.cachedRecords) {
      this.floatArrayCache.set(rec.id, new Float32Array(rec.embedding));
    }

    this.lastLoaded = now;
    return this.cachedRecords;
  }

  /**
   * Persists vector records to disk.
   */
  static saveRecords(records: VectorRecord[]): void {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    }
    fs.writeFileSync(
      VECTOR_FILE,
      JSON.stringify({ model: 'text-embedding-004', dimensions: 768, updatedAt: new Date().toISOString(), records }, null, 2),
      'utf8'
    );
    this.cachedRecords = records;
    this.floatArrayCache.clear();
    for (const rec of records) {
      this.floatArrayCache.set(rec.id, new Float32Array(rec.embedding));
    }
    this.lastLoaded = Date.now();
  }

  /**
   * Clear in-memory cache to force reload on next call.
   */
  static invalidateCache(): void {
    this.cachedRecords = null;
    this.floatArrayCache.clear();
    this.lastLoaded = 0;
  }

  /**
   * Embeds and stores vector representations for Q&As and chunks.
   */
  static async syncIndexWithVectors(qaList: QAPair[], chunks: KnowledgeChunk[]): Promise<number> {
    const records: VectorRecord[] = [];

    // 1. Embed Q&As (Semantic weighting: Question is primary, Answer is secondary context)
    const qaTextsToEmbed = qaList.map(qa => `Question: ${qa.question}\nAnswer: ${qa.answer}`);
    const qaEmbeddings = await VectorEmbeddingService.embedBatch(qaTextsToEmbed);

    for (let i = 0; i < qaList.length; i++) {
      const qa = qaList[i];
      records.push({
        id: qa.id,
        source: qa.source,
        type: 'qa',
        text: `Question: ${qa.question}\nAnswer: ${qa.answer}`,
        metadata: {
          question: qa.question,
          answer: qa.answer,
          tags: qa.tags,
        },
        embedding: qaEmbeddings[i],
      });
    }

    // 2. Embed Chunks
    if (chunks.length > 0) {
      const chunkTexts = chunks.map(c => c.text);
      const chunkEmbeddings = await VectorEmbeddingService.embedBatch(chunkTexts);

      for (let i = 0; i < chunks.length; i++) {
        const c = chunks[i];
        records.push({
          id: c.id,
          source: c.source,
          type: 'chunk',
          text: c.text,
          embedding: chunkEmbeddings[i],
        });
      }
    }

    this.saveRecords(records);
    return records.length;
  }

  /**
   * Performs semantic vector search using cosine similarity.
   */
  static async search(query: string, topK = 4, minSimilarity = 0.10): Promise<VectorSearchResult[]> {
    const records = this.loadRecords();
    if (records.length === 0) return [];

    const queryEmbedding = await VectorEmbeddingService.embedText(query);
    const queryVec = new Float32Array(queryEmbedding);

    const scored: { record: VectorRecord; similarity: number }[] = [];

    for (const rec of records) {
      let vec = this.floatArrayCache.get(rec.id);
      if (!vec) {
        vec = new Float32Array(rec.embedding);
        this.floatArrayCache.set(rec.id, vec);
      }
      const similarity = cosineSimilarity(queryVec, vec);
      if (similarity >= minSimilarity) {
        scored.push({ record: rec, similarity });
      }
    }

    // Sort descending by cosine similarity
    scored.sort((a, b) => b.similarity - a.similarity);
    const top = scored.slice(0, topK);

    return top.map(({ record, similarity }) => {
      let qaPair: QAPair | undefined;
      let chunk: KnowledgeChunk | undefined;

      if (record.type === 'qa') {
        qaPair = {
          id: record.id,
          question: record.metadata?.question || '',
          answer: record.metadata?.answer || record.text,
          source: record.source,
          tags: record.metadata?.tags,
        };
      } else {
        chunk = {
          id: record.id,
          source: record.source,
          text: record.text,
        };
      }

      return {
        id: record.id,
        source: record.source,
        type: record.type,
        text: record.text,
        similarity,
        qaPair,
        chunk,
      };
    });
  }

  /**
   * Returns vector store metrics.
   */
  static getStatus(): {
    totalVectors: number;
    model: string;
    dimensions: number;
    lastUpdated?: string;
  } {
    const records = this.loadRecords();
    return {
      totalVectors: records.length,
      model: 'text-embedding-004',
      dimensions: 768,
      lastUpdated: fs.existsSync(VECTOR_FILE) ? fs.statSync(VECTOR_FILE).mtime.toISOString() : undefined,
    };
  }
}
