import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLASS_9_MATHS_CHAPTERS } from '@/lib/study-resources-data';
import { ChapterNotesReader } from '@/components/study-resources/chapter-notes-reader';
import { CLASS_9_MATHS_CH1_DATA } from '@/lib/class-9-notes-data';

interface ChapterPageProps {
  params: Promise<{
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const currentChapter = CLASS_9_MATHS_CHAPTERS.find((c) => c.slug === chapter);

  if (!currentChapter) {
    return {
      title: 'Maths Notes | Class 9 | IDL Education',
    };
  }

  return {
    title: `अध्याय ${currentChapter.number} ${currentChapter.name} Notes | Class 9 Maths | IDL Education`,
    description: `Complete chapter notes, formulas, step-by-step solutions and revision summary for Class 9 Maths Chapter ${currentChapter.number} ${currentChapter.name}.`,
  };
}

export default async function Class9MathsChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const chapterIndex = CLASS_9_MATHS_CHAPTERS.findIndex((c) => c.slug === chapter);

  if (chapterIndex === -1) {
    notFound();
  }

  const currentChapter = CLASS_9_MATHS_CHAPTERS[chapterIndex];
  const previousChapter = chapterIndex > 0 ? CLASS_9_MATHS_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CLASS_9_MATHS_CHAPTERS.length - 1 ? CLASS_9_MATHS_CHAPTERS[chapterIndex + 1] : null;

  return (
    <ChapterNotesReader
      classId="9"
      className="Class 9"
      subjectId="maths"
      subjectName="Mathematics"
      currentChapter={currentChapter}
      chapterIndex={chapterIndex}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
      chapterListUrl="/study-resources?class=9&subject=maths"
      chapterData={CLASS_9_MATHS_CH1_DATA}
    />
  );
}
