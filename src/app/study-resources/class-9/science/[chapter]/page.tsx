import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLASS_9_SCIENCE_CHAPTERS } from '@/lib/study-resources-data';
import { ChapterNotesReader } from '@/components/study-resources/chapter-notes-reader';

interface ChapterPageProps {
  params: Promise<{
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const currentChapter = CLASS_9_SCIENCE_CHAPTERS.find((c) => c.slug === chapter);

  if (!currentChapter) {
    return {
      title: 'Chapter Notes | IDL Education',
    };
  }

  return {
    title: `${currentChapter.number} ${currentChapter.name} Notes | Class 9 Science | IDL Education`,
    description: `Complete chapter notes, key definitions, and revision summary for Class 9 Science Chapter ${currentChapter.number} ${currentChapter.name}.`,
  };
}

export default async function ChapterNotesPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const chapterIndex = CLASS_9_SCIENCE_CHAPTERS.findIndex((c) => c.slug === chapter);

  if (chapterIndex === -1) {
    notFound();
  }

  const currentChapter = CLASS_9_SCIENCE_CHAPTERS[chapterIndex];
  const previousChapter = chapterIndex > 0 ? CLASS_9_SCIENCE_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CLASS_9_SCIENCE_CHAPTERS.length - 1 ? CLASS_9_SCIENCE_CHAPTERS[chapterIndex + 1] : null;

  return (
    <ChapterNotesReader
      classId="9"
      className="Class 9"
      subjectId="science"
      subjectName="Science"
      currentChapter={currentChapter}
      chapterIndex={chapterIndex}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
      chapterListUrl="/study-resources?class=9&subject=science"
    />
  );
}
