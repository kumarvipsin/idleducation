
// src/app/actions/types.ts

// This file defines the TypeScript types for the content structure
// used in Firestore and throughout the content management actions.

export interface TSubTopic {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  shortNotePdfUrl?: string;
  primumNotePdfUrl?: string;
  order: number;
}

export interface TTopic {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  shortNotePdfUrl?: string;
  primumNotePdfUrl?: string;
  subTopics?: TSubTopic[];
  order: number;
}

export interface TChapter {
  name: string;
  createdAt: string;
  pdfUrl?: string;
  longNotePdfUrl?: string;
  shortNotePdfUrl?: string;
  primumNotePdfUrl?: string;
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

export interface TTestimonial {
  id: string;
  name: string;
  achievement: string;
  testimonial: string;
  testimonial_hi?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TTopperTestimonial {
  id: string;
  studentName: string;
  studentClass: string;
  videoId: string;
  createdAt: string;
}

export interface TExcellenceResult {
  id: string;
  categoryName: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}

export interface TGalleryImage {
    id: string;
    title: string;
    category: string;
    alt: string;
    imageUrl: string;
    className?: string;
    createdAt: string;
}

export interface TExamCategory {
  id: string;
  name: string;
  group: 'school' | 'competitive';
  order: number;
  createdAt: string;
  teacherIds?: string[];
  imageUrl?: string;
  href: string;
}

export interface TTeamMember {
  id: string;
  name: string;
  designation: string;
  experience: string;
  biography?: string;
  avatarUrl: string;
  order: number;
  createdAt: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface TReferenceBook {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    rating: number;
    imageUrl: string;
    class: string;
    subject: string;
    edition: string;
    set: string;
    category: 'IDL Store' | 'Reference Books';
    buyLink?: string;
    createdAt: string;
    productId?: number;
}

export interface Paper {
  title: string;
  pdfUrl?: string;
}

export interface SubjectWithPapers {
  name: string;
  papers: Paper[];
}

export interface TPreviousYearQuestion {
  id: string;
  exam: string;
  year: number;
  title: string;
  subjects: SubjectWithPapers[];
  createdAt: string;
}
