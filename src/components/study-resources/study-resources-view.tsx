'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

import {
  type ClassId,
  CLASSES,
  CLASS_9_10_SUBJECTS,
  getSubjectsForClass,
  getChaptersForSubject,
  normalizeClassId,
} from '@/lib/study-resources-data';
import { Class9SubjectCards } from '@/components/study-resources/class-9-subject-cards';

export function StudyResourcesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedClass, setSelectedClass] = useState<ClassId | null>(() => normalizeClassId(searchParams.get('class')) || 'class-9');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(() => {
    const classFromUrl = normalizeClassId(searchParams.get('class')) || 'class-9';
    const subjectFromUrl = searchParams.get('subject');
    const validSubj = getSubjectsForClass(classFromUrl).find((s) => s.id === subjectFromUrl?.toLowerCase());
    return validSubj ? validSubj.id : null;
  });

  // Sync state from URL search params on mount or when searchParams change
  useEffect(() => {
    const classFromUrl = normalizeClassId(searchParams.get('class')) || 'class-9';
    const subjectFromUrl = searchParams.get('subject');

    setSelectedClass(classFromUrl);

    const validSubj = getSubjectsForClass(classFromUrl).find((s) => s.id === subjectFromUrl?.toLowerCase());
    setSelectedSubject(validSubj ? validSubj.id : null);
  }, [searchParams]);

  const updateUrl = useCallback((cls: ClassId | null, subj: string | null) => {
    const params = new URLSearchParams();
    if (cls) {
      params.set('class', cls.replace('class-', ''));
    }
    if (subj) {
      params.set('subject', subj);
    }
    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    window.history.pushState(null, '', newUrl);
  }, [pathname]);

  const handleSelectClass = (classId: ClassId) => {
    setSelectedClass(classId);
    setSelectedSubject(null);
    updateUrl(classId, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    updateUrl(selectedClass, subjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToRoot = () => {
    setSelectedClass('class-9');
    setSelectedSubject(null);
    updateUrl('class-9', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToClass = () => {
    setSelectedSubject(null);
    updateUrl(selectedClass, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active items
  const currentClass = CLASSES.find((c) => c.id === selectedClass);
  const currentSubject = selectedClass ? getSubjectsForClass(selectedClass).find((s) => s.id === selectedSubject) : null;
  const currentChapters = currentClass && currentSubject ? getChaptersForSubject(currentClass.id, currentSubject.id) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pt-3 pb-24 sm:pt-5 sm:pb-28 overflow-x-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ── BREADCRUMBS (Home › Study Resources › Class 9) ── */}
        <nav aria-label="Breadcrumbs" className="mb-4 sm:mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[12.5px] sm:text-[13px] text-[#64748B] dark:text-slate-400">
            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <span className="text-[#94A3B8] font-normal">&rsaquo;</span>
            </li>

            <li className="flex items-center gap-1.5 sm:gap-2">
              {currentClass ? (
                <>
                  <button
                    type="button"
                    onClick={handleResetToRoot}
                    className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Study Resources
                  </button>
                  <span className="text-[#94A3B8] font-normal">&rsaquo;</span>
                </>
              ) : (
                <span className="font-semibold text-[#0B2B63] dark:text-white">
                  Study Resources
                </span>
              )}
            </li>

            {currentClass && (
              <li className="flex items-center gap-1.5 sm:gap-2">
                {currentSubject ? (
                  <>
                    <button
                      type="button"
                      onClick={handleResetToClass}
                      className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      {currentClass.name}
                    </button>
                    <span className="text-[#94A3B8] font-normal">&rsaquo;</span>
                  </>
                ) : (
                  <span className="font-bold text-[#0B2B63] dark:text-white">
                    {currentClass.name}
                  </span>
                )}
              </li>
            )}

            {currentSubject && (
              <li>
                <span className="font-bold text-[#0B2B63] dark:text-white">
                  {currentSubject.name}
                </span>
              </li>
            )}
          </ol>
        </nav>

        {/* ── SUBJECT SELECTION WITH HORIZONTAL CLASS TABS ── */}
        {!currentSubject && (
          <section aria-labelledby="select-subjects-heading">
            {/* Center Heading */}
            <div className="text-center mb-5 sm:mb-6 md:mb-7">
              <h1 id="select-subjects-heading" className="text-[28px] sm:text-[34px] md:text-[38px] font-extrabold text-[#0B2B63] dark:text-white tracking-[-0.02em] leading-tight">
                Select Your Subjects
              </h1>
            </div>

            {/* Class Tabs & Class 9 Subject Cards */}
            <Class9SubjectCards
              selectedClass={selectedClass || 'class-9'}
              onSelectClass={handleSelectClass}
              onSelectSubject={handleSelectSubject}
            />
          </section>
        )}

        {/* ── VIEW 2A-SUB: DYNAMIC CHAPTER LISTING UI (ALL SUBJECTS) ── */}
        {currentClass && currentSubject && currentChapters.length > 0 && (
          <section aria-labelledby="chapter-notes-heading" className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                {/* Small eyebrow */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[11.5px] sm:text-xs font-bold uppercase tracking-wider"
                    style={{ color: currentSubject.accentColor || '#155EEF' }}
                  >
                    {currentClass.name.toUpperCase()} &bull; {currentSubject.name.toUpperCase()}
                  </span>
                </div>

                {/* Main heading */}
                <h1 id="chapter-notes-heading" className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  {currentSubject.name} &bull; Chapter-wise Notes
                </h1>

                {/* Subtitle */}
                <p className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-[#5B6B86] dark:text-slate-400 font-normal">
                  Comprehensive chapter-wise short revision notes for quick learning, plus detailed Premium Notes.
                </p>
              </div>

              {/* Right side: Back to Subjects */}
              <button
                type="button"
                onClick={handleResetToClass}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#155EEF] dark:text-blue-400 hover:text-[#0052CC] hover:underline cursor-pointer self-start sm:self-center shrink-0 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Subjects</span>
              </button>
            </div>

            {/* Chapter List */}
            <div className="space-y-3 sm:space-y-3.5">
              {currentChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/study-resources/${currentClass.id}/${currentSubject.id}/${chapter.slug}`}
                  className="group block bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] hover:bg-[#F8FBFE] dark:hover:bg-slate-800/60 rounded-xl p-4 sm:px-6 sm:py-4.5 shadow-[0_1px_4px_rgba(6,43,103,0.02)] hover:shadow-[0_4px_16px_rgba(21,94,239,0.06)] transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Number + Title + Supporting text */}
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                      <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#F0F5FF] dark:bg-blue-950/70 border border-[#DCE7F6] dark:border-blue-900/50 flex items-center justify-center font-bold text-xs sm:text-[13px] text-[#155EEF] dark:text-blue-400">
                        {chapter.number}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#062B67] dark:text-white group-hover:text-[#155EEF] transition-colors tracking-tight leading-snug">
                          {chapter.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#5B6B86] dark:text-slate-400 font-medium">
                          {chapter.supportingText}
                        </p>
                      </div>
                    </div>

                    {/* Right: View Notes Action */}
                    <div className="flex items-center justify-end sm:shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#155EEF] dark:text-blue-400 group-hover:text-[#0052CC] transition-colors">
                        <span>View Notes</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── VIEW 2C-SUB: OTHER SUBJECTS (PLACEHOLDER) ── */}
        {currentClass && currentSubject && currentChapters.length === 0 && (
          <section aria-labelledby="chapter-notes-placeholder-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                    {currentClass.name}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {currentSubject.name}
                  </span>
                </div>
                <h2 id="chapter-notes-placeholder-heading" className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  {currentSubject.name} &bull; Chapter-wise Notes
                </h2>
                <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#5B6B86] dark:text-slate-400">
                  Comprehensive notes and textbook summaries.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetToClass}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Subjects</span>
              </button>
            </div>

            {/* Clean, minimal placeholder state */}
            <div className="bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 rounded-[20px] p-6 sm:p-8 md:p-10 shadow-[0_2px_14px_rgba(6,43,103,0.03)] text-center max-w-xl mx-auto my-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-semibold text-xs mb-3">
                {currentClass.name} &bull; {currentSubject.name}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                Chapter-wise Notes
              </h3>
              <p className="mt-2 text-sm text-[#5B6B86] dark:text-slate-400 leading-relaxed">
                Chapter notes and study material for {currentSubject.name} will be added in the next step.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetToClass}
                  className="px-5 py-2.5 rounded-lg bg-[#155EEF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  &larr; Choose Another Subject
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
