import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLASS_9_SOCIAL_SCIENCE_CHAPTERS } from '@/lib/study-resources-data';
import { ChapterNotesReader } from '@/components/study-resources/chapter-notes-reader';
import { CLASS_9_SOCIAL_SCIENCE_CH1_DATA } from '@/lib/class-9-notes-data';

interface ChapterPageProps {
  params: Promise<{
    chapter: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapter } = await params;
  const currentChapter = CLASS_9_SOCIAL_SCIENCE_CHAPTERS.find((c) => c.slug === chapter);

  if (!currentChapter) {
    return {
      title: 'Social Science Notes | Class 9 | IDL Education',
    };
  }

  return {
    title: `अध्याय ${currentChapter.number} ${currentChapter.name} Notes | Class 9 Social Science | IDL Education`,
    description: `Complete chapter notes, key events timeline, concept definitions, and exam questions for Class 9 Social Science Chapter ${currentChapter.number} ${currentChapter.name}.`,
  };
}

export default async function Class9SocialScienceChapterPage({ params }: ChapterPageProps) {
  const { chapter } = await params;
  const chapterIndex = CLASS_9_SOCIAL_SCIENCE_CHAPTERS.findIndex((c) => c.slug === chapter);

  if (chapterIndex === -1) {
    notFound();
  }

  const currentChapter = CLASS_9_SOCIAL_SCIENCE_CHAPTERS[chapterIndex];
  const previousChapter = chapterIndex > 0 ? CLASS_9_SOCIAL_SCIENCE_CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CLASS_9_SOCIAL_SCIENCE_CHAPTERS.length - 1 ? CLASS_9_SOCIAL_SCIENCE_CHAPTERS[chapterIndex + 1] : null;

  return (
    <ChapterNotesReader
      classId="9"
      className="Class 9"
      subjectId="social-science"
      subjectName="Social Science"
      currentChapter={currentChapter}
      chapterIndex={chapterIndex}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
      chapterListUrl="/study-resources?class=9&subject=social-science"
      chapterData={CLASS_9_SOCIAL_SCIENCE_CH1_DATA}
    />
  );
}
