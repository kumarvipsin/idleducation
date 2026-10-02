import fs from 'fs';
import path from 'path';
import { QAPair, KnowledgeChunk, KnowledgeIndex } from './types';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'src', 'data', 'knowledge-base');
const INDEX_FILE = path.join(KNOWLEDGE_DIR, 'indexed-qa.json');

import { execFile } from 'child_process';
import { promisify } from 'util';
import { VectorStore } from './VectorStore';

const execFileAsync = promisify(execFile);

export class PDFKnowledgeParser {
  /**
   * Parse a raw PDF Buffer into plain text using pure node extractor worker.
   */
  static async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const tempFileName = `.temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.pdf`;
    const tempFilePath = path.join(KNOWLEDGE_DIR, tempFileName);

    try {
      if (!fs.existsSync(KNOWLEDGE_DIR)) {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
      }
      fs.writeFileSync(tempFilePath, buffer);

      const scriptPath = path.join(process.cwd(), 'src', 'lib', 'ai', 'knowledge', 'pdf-extractor.js');
      const { stdout, stderr } = await execFileAsync(process.execPath, [scriptPath, tempFilePath], {
        maxBuffer: 10 * 1024 * 1024,
      });

      if (stderr && !stdout) {
        throw new Error(stderr);
      }

      const result = JSON.parse(stdout.trim());
      if (result.error) {
        throw new Error(result.error);
      }

      return result.text || '';
    } catch (err) {
      console.error('[PDFKnowledgeParser] Error parsing PDF buffer via worker:', err);
      throw new Error(`Failed to extract text from PDF: ${(err as Error).message}`);
    } finally {
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch {
          // ignore cleanup error
        }
      }
    }
  }

  /**
   * Intelligently parses raw text into structured Q&A pairs and semantic chunks.
   */
  static parseTextToQA(rawText: string, sourceName: string): { qaList: QAPair[]; chunks: KnowledgeChunk[] } {
    const qaList: QAPair[] = [];
    const chunks: KnowledgeChunk[] = [];

    // Normalize line breaks & tabs, remove page numbers
    const cleanedText = rawText
      .replace(/-- \d+ of \d+ --/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    const seenQuestions = new Set<string>();
    let index = 1;

    // 1. Standard Question-Answer format (Q: ... Ans: ..., Q1. ... Ans. ...)
    const qaBlockRegex = /(?:(?:^|\n+)(?:Q(?:uestion)?\s*(?:\d+[\.:]|\.|\:)?|\d+\.))\s*([^\n\?]+(?:\?|[^\n]+))\s*\n+(?:(?:Ans(?:wer)?\s*(?:\d+[\.:]|\.|\:)?|A\s*[:\.]))\s*([\s\S]+?)(?=(?:\n+(?:Q(?:uestion)?\s*(?:\d+[\.:]|\.|\:)?|\d+\.)|\n{3,}|$))/gi;

    let match: RegExpExecArray | null;
    while ((match = qaBlockRegex.exec(cleanedText)) !== null) {
      const question = match[1]?.trim();
      const answer = match[2]?.trim();

      const isMetaHeader = /^(?:important questions|very short answer|short answer|multiple choice|exercise|summary)\b/i.test(question || '');

      if (question && answer && question.length > 5 && answer.length > 5 && !isMetaHeader) {
        const qKey = question.toLowerCase();
        if (!seenQuestions.has(qKey)) {
          seenQuestions.add(qKey);
          qaList.push({
            id: `qa-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${index++}`,
            question,
            answer,
            source: sourceName,
            tags: this.extractKeywords(question),
          });
        }
      }
    }

    // 2. Extract Numbered Chapter Sections & Study Notes (e.g. "1. What is a Cell?", "3. Magnification & Microscopes")
    const sectionRegex = /(?:^|\n)(\d+)\.\s+([^\n]+)\n([\s\S]+?)(?=(?:\n\d+\.\s+[^\n]+|$))/g;
    let sectionMatch: RegExpExecArray | null;

    while ((sectionMatch = sectionRegex.exec(cleanedText)) !== null) {
      const title = sectionMatch[2]?.trim();
      const body = sectionMatch[3]?.trim();

      const isMeta = /^(?:important questions|exercises|summary|contents)\b/i.test(title || '');

      if (title && body && title.length > 3 && body.length > 30 && !isMeta) {
        const qKey = title.toLowerCase().replace(/[\?\.\:]+$/, '');
        const existing = qaList.find(item => item.question.toLowerCase().replace(/[\?\.\:]+$/, '') === qKey);
        if (existing) {
          if (body.length > existing.answer.length) {
            existing.answer = `${body}\n\n**Quick Answer:**\n${existing.answer}`;
          }
        } else {
          seenQuestions.add(qKey);
          qaList.push({
            id: `sec-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${index++}`,
            question: title,
            answer: body,
            source: sourceName,
            tags: this.extractKeywords(title),
          });
        }
      }
    }

    // 3. Fallback: Check for loose "FAQ" lines if nothing matched
    if (qaList.length === 0) {
      const lines = cleanedText.split('\n').map(l => l.trim()).filter(Boolean);
      let currentQuestion = '';
      let currentAnswerLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isQuestion =
          /^(?:Q[:.]|Question\s*\d*[:.]|\d+[\.)]\s+.*\?|\bWhat\b|\bHow\b|\bWhy\b|\bWhen\b|\bWhere\b|\bWhich\b|\bCan\b|\bDo\b|\bIs\b|\bAre\b).*\??$/i.test(line) &&
          line.length > 10;

        if (isQuestion) {
          if (currentQuestion && currentAnswerLines.length > 0) {
            qaList.push({
              id: `qa-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${index++}`,
              question: currentQuestion,
              answer: currentAnswerLines.join('\n').trim(),
              source: sourceName,
              tags: this.extractKeywords(currentQuestion),
            });
            currentAnswerLines = [];
          }
          currentQuestion = line.replace(/^(?:Q[:.]|Question\s*\d*[:.]|\d+[\.)])\s*/i, '').trim();
        } else if (currentQuestion) {
          const cleanLine = line.replace(/^(?:Ans(?:wer)?[:.]|A[:.])\s*/i, '').trim();
          if (cleanLine) currentAnswerLines.push(cleanLine);
        }
      }

      if (currentQuestion && currentAnswerLines.length > 0) {
        qaList.push({
          id: `qa-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${index++}`,
          question: currentQuestion,
          answer: currentAnswerLines.join('\n').trim(),
          source: sourceName,
          tags: this.extractKeywords(currentQuestion),
        });
      }
    }

    // Semantic chunking: In all cases, also split the document into clean paragraphs/sections
    // so any general explanations, course details, or notes that aren't strict Q&A pairs are fully searchable.
    const paragraphs = cleanedText.split(/\n\s*\n+/);
    let currentChunk = '';
    let chunkIndex = 1;

    for (const para of paragraphs) {
      const cleanPara = para.trim();
      if (!cleanPara) continue;

      if ((currentChunk + '\n\n' + cleanPara).length < 800) {
        currentChunk = currentChunk ? `${currentChunk}\n\n${cleanPara}` : cleanPara;
      } else {
        if (currentChunk) {
          chunks.push({
            id: `chunk-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${chunkIndex++}`,
            text: currentChunk,
            source: sourceName,
          });
        }
        currentChunk = cleanPara;
      }
    }

    if (currentChunk) {
      chunks.push({
        id: `chunk-${sourceName.replace(/[^a-zA-Z0-9_-]/g, '_')}-${chunkIndex++}`,
        text: currentChunk,
        source: sourceName,
      });
    }

    return { qaList, chunks };
  }

  /**
   * Helper to extract simple keyword tokens from a string.
   */
  private static extractKeywords(text: string): string[] {
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'of', 'for', 'with', 'to', 'from',
      'how', 'what', 'why', 'when', 'where', 'who', 'does', 'can', 'are', 'was', 'were', 'will', 'idl'
    ]);
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.has(w));
  }

  /**
   * Loads the existing index or creates an empty one.
   */
  static loadIndex(): KnowledgeIndex {
    if (fs.existsSync(INDEX_FILE)) {
      try {
        const raw = fs.readFileSync(INDEX_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.warn('[PDFKnowledgeParser] Corrupt index file. Re-creating empty index.');
      }
    }
    return {
      lastUpdated: new Date().toISOString(),
      sources: [],
      qaList: [],
      chunks: [],
    };
  }

  /**
   * Saves the index to disk.
   */
  static saveIndex(index: KnowledgeIndex): void {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    }
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  }

  /**
   * Indexes a single PDF buffer and updates the persistent index.
   */
  static async indexPDFBuffer(buffer: Buffer, filename: string): Promise<{ qaCount: number; chunkCount: number }> {
    const text = await this.extractTextFromPDF(buffer);
    const { qaList, chunks } = this.parseTextToQA(text, filename);

    const index = this.loadIndex();

    // Remove existing records from this source if replacing
    index.qaList = index.qaList.filter(item => item.source !== filename);
    index.chunks = index.chunks.filter(chunk => chunk.source !== filename);
    index.sources = index.sources.filter(s => s.filename !== filename);

    // Append new records
    index.qaList.push(...qaList);
    index.chunks.push(...chunks);
    index.sources.push({
      filename,
      filesize: buffer.length,
      parsedAt: new Date().toISOString(),
      qaCount: qaList.length,
      chunkCount: chunks.length,
    });
    index.lastUpdated = new Date().toISOString();

    this.saveIndex(index);

    // Sync dense vector embeddings
    try {
      await VectorStore.syncIndexWithVectors(index.qaList, index.chunks);
    } catch (err) {
      console.warn('[PDFKnowledgeParser] Vector sync warning:', (err as Error).message);
    }

    return { qaCount: qaList.length, chunkCount: chunks.length };
  }

  /**
   * Scans the knowledge directory for any .pdf files and re-indexes them.
   */
  static async scanAndIndexAllPDFs(): Promise<{ totalFiles: number; totalQAs: number; totalChunks: number }> {
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
      fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
      return { totalFiles: 0, totalQAs: 0, totalChunks: 0 };
    }

    const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    let totalQAs = 0;
    let totalChunks = 0;

    for (const file of files) {
      const filePath = path.join(KNOWLEDGE_DIR, file);
      const buffer = fs.readFileSync(filePath);
      const res = await this.indexPDFBuffer(buffer, file);
      totalQAs += res.qaCount;
      totalChunks += res.chunkCount;
    }

    // Ensure vectors are up to date even if 0 new PDFs were added but index exists
    const index = this.loadIndex();
    if (index.qaList.length > 0 || index.chunks.length > 0) {
      try {
        await VectorStore.syncIndexWithVectors(index.qaList, index.chunks);
      } catch (err) {
        console.warn('[PDFKnowledgeParser] Vector sync warning:', (err as Error).message);
      }
    }

    return { totalFiles: files.length, totalQAs, totalChunks };
  }
}
