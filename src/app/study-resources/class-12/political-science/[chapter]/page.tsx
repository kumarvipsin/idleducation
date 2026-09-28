import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLASS_12_POLITICAL_SCIENCE_CHAPTERS } from '@/lib/study-resources-data';
import { PoliticalScienceChapterReader } from '@/components/study-resources/political-science-chapter-reader';

interface ChapterPageProps {
  params: Promise<{
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const currentChapter = CLASS_12_POLITICAL_SCIENCE_CHAPTERS.find((c) => c.slug === chapter);

  if (!currentChapter) {
    return {
      title: 'Political Science Notes | Class 12 | IDL Education',
    };
  }

  return {
    title: `अध्याय ${currentChapter.number} ${currentChapter.name} Notes | Class 12 Political Science | IDL Education`,
    description: `Complete Hindi Medium notes for Class 12 Political Science Chapter ${currentChapter.number} ${currentChapter.name}. Revision points, key topics, and board exam questions.`,
  };
}

export default async function Class12PoliticalScienceChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const chapterIndex = CLASS_12_POLITICAL_SCIENCE_CHAPTERS.findIndex((c) => c.slug === chapter);

  if (chapterIndex === -1) {
    notFound();
  }

  const currentChapter = CLASS_12_POLITICAL_SCIENCE_CHAPTERS[chapterIndex];
  const previousChapter = chapterIndex > 0 ? CLASS_12_POLITICAL_SCIENCE_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < CLASS_12_POLITICAL_SCIENCE_CHAPTERS.length - 1
      ? CLASS_12_POLITICAL_SCIENCE_CHAPTERS[chapterIndex + 1]
      : null;

  return (
    <PoliticalScienceChapterReader
      currentChapter={currentChapter}
      chapterIndex={chapterIndex}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
    />
  );
}
