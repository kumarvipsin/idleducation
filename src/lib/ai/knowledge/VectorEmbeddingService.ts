import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Normalizes a vector to unit length (L2 norm) so dot product equals cosine similarity.
 */
export function normalizeVector(vec: number[]): number[] {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq) || 1e-10;
  return vec.map(v => v / norm);
}

/**
 * Computes cosine similarity between two unit vectors via dot product.
 */
export function cosineSimilarity(a: number[] | Float32Array, b: number[] | Float32Array): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export class VectorEmbeddingService {
  private static apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  private static client: GoogleGenerativeAI | null = null;
  private static EMBEDDING_MODEL = 'text-embedding-004';
  private static VECTOR_DIM = 768;

  private static getClient(): GoogleGenerativeAI | null {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) return null;
    if (!this.client || this.apiKey !== key) {
      this.apiKey = key;
      this.client = new GoogleGenerativeAI(key);
    }
    return this.client;
  }

  /**
   * Generates a 768-dimensional semantic embedding for a given text snippet.
   * If Gemini API Key is available, uses Google Gemini's text-embedding-004.
   * If offline or no API key, uses a deterministic pseudo-semantic hashing fallback.
   */
  static async embedText(text: string): Promise<number[]> {
    const client = this.getClient();
    const cleanText = text.trim();
    if (!cleanText) {
      return new Array(this.VECTOR_DIM).fill(0);
    }

    if (client) {
      try {
        const model = client.getGenerativeModel({ model: this.EMBEDDING_MODEL });
        const res = await model.embedContent(cleanText);
        const values = res.embedding?.values;
        if (values && values.length > 0) {
          return normalizeVector(values);
        }
      } catch (err) {
        console.warn(`[VectorEmbeddingService] Gemini text-embedding-004 error, falling back to local vectorizer:`, (err as Error).message);
      }
    }

    // High-resolution local semantic fallback vectorizer (768 dimensions)
    return this.generateLocalFallbackEmbedding(cleanText);
  }

  /**
   * Batch embeds multiple texts.
   */
  static async embedBatch(texts: string[]): Promise<number[][]> {
    const client = this.getClient();
    if (client && texts.length > 0) {
      try {
        const model = client.getGenerativeModel({ model: this.EMBEDDING_MODEL });
        // Gemini batchEmbedContents
        const requests = texts.map(t => ({
          content: { parts: [{ text: t }] },
        }));
        const res = await model.batchEmbedContents({ requests });
        if (res.embeddings && res.embeddings.length === texts.length) {
          return res.embeddings.map(e => normalizeVector(e.values));
        }
      } catch (err) {
        console.warn(`[VectorEmbeddingService] Batch embedding failed, processing individually:`, (err as Error).message);
      }
    }

    // Fallback: embed sequentially or locally
    const embeddings: number[][] = [];
    for (const t of texts) {
      embeddings.push(await this.embedText(t));
    }
    return embeddings;
  }

  /**
   * Deterministic 768-dimension feature vectorizer for offline/local environments.
   */
  private static generateLocalFallbackEmbedding(text: string): number[] {
    const vec = new Float64Array(this.VECTOR_DIM);
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'with', 'to', 'from',
      'how', 'what', 'why', 'when', 'where', 'who', 'does', 'can', 'are', 'was', 'were', 'will', 'idl',
      'tell', 'me', 'about', 'please', 'give', 'details', 'know', 'there', 'any', 'available', 'i', 'do', 'it'
    ]);
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));

    if (words.length === 0) {
      // If only stopwords existed, fall back to all words
      const rawWords = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      words.push(...rawWords);
    }

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let h1 = 0x811c9dc5;
      let h2 = 0x5bd1e995;

      for (let j = 0; j < word.length; j++) {
        const code = word.charCodeAt(j);
        h1 = Math.imul(h1 ^ code, 0x01000193);
        h2 = Math.imul(h2 ^ code, 0x5bd1e995) + (code << 3);
      }

      const idx1 = Math.abs(h1) % this.VECTOR_DIM;
      const idx2 = Math.abs(h2) % this.VECTOR_DIM;
      const idx3 = (idx1 + idx2 + i) % this.VECTOR_DIM;

      vec[idx1] += 1.0;
      vec[idx2] += 0.75;
      vec[idx3] += 0.5;
    }

    const raw = Array.from(vec);
    return normalizeVector(raw);
  }
}
