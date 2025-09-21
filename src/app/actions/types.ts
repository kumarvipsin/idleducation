// src/app/actions/types.ts

// This file defines the TypeScript types for the content structure
// used in Firestore and throughout the content management actions.

export interface TSubTopic {
  name: string;
  createdAt: string;
  pdfUrl?: string;
}

export interface TTopic {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  subTopics?: TSubTopic[];
}

export interface TChapter {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  topics?: TTopic[];
}

export interface TPart {
  name: string;
  createdAt: string;
  chapters: TChapter[];
  order: number;
}

export interface TSubject {
  name: string;
  createdAt: string;
  parts?: { [key: string]: TPart };
  chapters?: TChapter[];
  order: number;
}

export interface TClass {
  name: string;
  subjects: { [key: string]: TSubject };
  order: number;
}
