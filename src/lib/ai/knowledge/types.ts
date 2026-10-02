export interface QAPair {
  id: string;
  question: string;
  answer: string;
  source: string;
  page?: number;
  tags?: string[];
}

export interface KnowledgeChunk {
  id: string;
  text: string;
  source: string;
  page?: number;
}

export interface KnowledgeIndex {
  lastUpdated: string;
  sources: {
    filename: string;
    filesize: number;
    parsedAt: string;
    qaCount: number;
    chunkCount: number;
  }[];
  qaList: QAPair[];
  chunks: KnowledgeChunk[];
}
