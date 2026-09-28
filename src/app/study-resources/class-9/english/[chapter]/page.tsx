import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLASS_9_ENGLISH_CHAPTERS } from '@/lib/study-resources-data';
import { ChapterNotesReader } from '@/components/study-resources/chapter-notes-reader';
import { CLASS_9_ENGLISH_CH1_DATA } from '@/lib/class-9-notes-data';

interface ChapterPageProps {
  params: Promise<{
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const currentChapter = CLASS_9_ENGLISH_CHAPTERS.find((c) => c.slug === chapter);

  if (!currentChapter) {
    return {
      title: 'English Notes | Class 9 | IDL Education',
    };
  }

  return {
    title: `Chapter ${currentChapter.number} ${currentChapter.name} Notes | Class 9 English | IDL Education`,
    description: `Complete chapter notes, theme analysis, character sketches, and questions for Class 9 English Chapter ${currentChapter.number} ${currentChapter.name}.`,
  };
}

export default async function Class9EnglishChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const chapterIndex = CLASS_9_ENGLISH_CHAPTERS.findIndex((c) => c.slug === chapter);

  if (chapterIndex === -1) {
    notFound();
  }

  const currentChapter = CLASS_9_ENGLISH_CHAPTERS[chapterIndex];
  const previousChapter = chapterIndex > 0 ? CLASS_9_ENGLISH_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CLASS_9_ENGLISH_CHAPTERS.length - 1 ? CLASS_9_ENGLISH_CHAPTERS[chapterIndex + 1] : null;

  return (
    <ChapterNotesReader
      classId="9"
      className="Class 9"
      subjectId="english"
      subjectName="English"
      currentChapter={currentChapter}
      chapterIndex={chapterIndex}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
      chapterListUrl="/study-resources?class=9&subject=english"
      chapterData={CLASS_9_ENGLISH_CH1_DATA}
    />
  );
}
