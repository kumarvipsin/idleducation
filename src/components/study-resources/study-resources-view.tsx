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
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pt-3 pb-24 sm:pt-5 sm:pb-28 overflow-x-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ── BREADCRUMBS & DESKTOP BACK BUTTON ── */}
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
          <nav aria-label="Breadcrumbs">
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

          {/* Desktop Outlined Back Button */}
          {currentSubject && (
            <button
              type="button"
              onClick={handleResetToClass}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D0E1F9] dark:border-blue-900/60 bg-[#F4F8FE] dark:bg-blue-950/40 text-[#155EEF] dark:text-blue-400 hover:text-[#0047CC] hover:bg-[#EAF3FE] hover:border-[#155EEF]/40 dark:hover:bg-blue-950/70 text-[12px] font-semibold transition-all duration-150 shadow-[0_1px_2px_rgba(21,94,239,0.04)] cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.25]" />
              <span>Back to Subjects</span>
            </button>
          )}
        </div>

        {/* ── SUBJECT SELECTION WITH HORIZONTAL CLASS TABS ── */}
        {!currentSubject && (
          <section aria-labelledby="select-subjects-heading">
            {/* Center Heading */}
            <div className="flex flex-col items-center justify-center text-center mb-5 sm:mb-6 md:mb-7">
              {/* Eyebrow with bullet point */}
              <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
                <span className="text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                  <span className="text-[#062B67] dark:text-blue-200">Select Your </span>
                  <span className="text-[#155EEF] dark:text-blue-400">Subjects</span>
                </span>
              </div>

              {/* Description heading — single line on mobile and desktop */}
              <h1 id="select-subjects-heading" className="text-[13.5px] min-[360px]:text-[14.5px] min-[400px]:text-[16px] sm:text-[24px] md:text-[30px] lg:text-[34px] font-[700] tracking-[-0.02em] leading-normal max-w-4xl mx-auto whitespace-nowrap text-[#64748B] dark:text-slate-400">
                Explore focused revision notes for every subject.
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
            {/* Page Header Banner */}
            <div className="pb-5 sm:pb-6 border-b border-slate-200/80 dark:border-slate-800">
              <div className="max-w-3xl">
                {/* Small green label */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11.5px] sm:text-[12px] font-bold uppercase tracking-wider text-[#16A34A] dark:text-emerald-400"
                  >
                    {currentClass.name.toUpperCase()} &bull; {currentSubject.name.toUpperCase()}
                  </span>
                </div>

                {/* Main heading */}
                <h1 id="chapter-notes-heading" className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-[#062B67] dark:text-white tracking-tight leading-tight">
                  Chapter-wise Notes
                </h1>

                {/* Short modern description */}
                <p className="mt-1.5 text-[13.5px] sm:text-[14px] text-[#5B6B86] dark:text-slate-400 font-normal leading-relaxed">
                  Learn smarter with concise notes, quick revision and complete chapter coverage.
                </p>

                {/* Mobile Back to Subjects Button */}
                <div className="sm:hidden mt-3.5">
                  <button
                    type="button"
                    onClick={handleResetToClass}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D0E1F9] dark:border-blue-900/60 bg-[#F4F8FE] dark:bg-blue-950/40 text-[#155EEF] dark:text-blue-400 hover:bg-[#EAF3FE] text-xs font-semibold transition-all shadow-[0_1px_2px_rgba(21,94,239,0.04)] cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[2.25]" />
                    <span>Back to Subjects</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chapter Cards List */}
            <div className="space-y-3 sm:space-y-3.5">
              {currentChapters.map((chapter, index) => {
                const isFirst = index === 0;
                const chapterNum = String(chapter.number).padStart(2, '0');

                return (
                  <Link
                    key={chapter.id}
                    href={`/study-resources/${currentClass.id}/${currentSubject.id}/${chapter.slug}`}
                    className={`group block rounded-[16px] border transition-all duration-200 cursor-pointer overflow-hidden px-4 py-3.5 sm:px-6 sm:py-4 ${
                      isFirst
                        ? 'bg-[#F6FAFF] dark:bg-slate-900 border-[#C4DCF9] dark:border-blue-900/70 shadow-[0_2px_8px_rgba(21,94,239,0.04)] hover:border-[#155EEF]'
                        : 'bg-white dark:bg-slate-900 border-[#E2ECF8] dark:border-slate-800 hover:border-[#BED8F8] dark:hover:border-blue-800/60 hover:bg-[#F9FBFE] dark:hover:bg-slate-800/50 shadow-[0_1px_3px_rgba(6,43,103,0.02)] hover:shadow-[0_4px_14px_rgba(21,94,239,0.04)]'
                    }`}
                  >
                    {/* ── DESKTOP VIEW ── */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between gap-5">
                      {/* Left: Number + Title + Supporting text */}
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Chapter Number Box */}
                        <div className="w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-xl bg-[#EEF5FF] dark:bg-blue-950/60 border border-[#D4E4FA] dark:border-blue-900/50 flex items-center justify-center font-bold text-[14px] sm:text-[15px] text-[#155EEF] dark:text-blue-400 shrink-0 select-none shadow-2xs group-hover:bg-[#155EEF] group-hover:text-white group-hover:border-[#155EEF] transition-all duration-200">
                          {chapterNum}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-[15px] sm:text-[16px] font-bold text-[#062B67] dark:text-white group-hover:text-[#155EEF] transition-colors tracking-tight leading-snug">
                            {chapter.name}
                          </h3>
                          <p className="mt-1 text-[12px] sm:text-[12.5px] text-[#64748B] dark:text-slate-400 font-medium leading-none">
                            {chapter.supportingText || 'Chapter Notes • English / Hindi'}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Resource Badges */}
                      <div className="flex items-center gap-2 shrink-0 select-none">
                        {/* Quick Revision Badge */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F4FAF6] dark:bg-emerald-950/30 border border-[#E2F5E8] dark:border-emerald-800/30 text-[#16A34A] dark:text-emerald-400 text-[11px] font-semibold tracking-tight">
                          Quick Revision
                        </span>

                        {/* Detailed Notes Badge */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFFBF5] dark:bg-amber-950/30 border border-[#FDEED5] dark:border-amber-800/30 text-[#D97706] dark:text-amber-400 text-[11px] font-semibold tracking-tight">
                          Detailed Notes
                        </span>
                      </div>

                      {/* Right: View Notes Action */}
                      <div className="flex items-center gap-2.5 shrink-0 pl-2">
                        <span className="text-[13px] sm:text-[13.5px] font-bold text-[#155EEF] dark:text-blue-400 group-hover:text-[#0047CC] transition-colors tracking-tight">
                          View Notes
                        </span>
                        <div className="w-[30px] h-[30px] rounded-full bg-[#EEF4FE] dark:bg-blue-950/60 border border-[#D5E3F9] dark:border-blue-900/50 text-[#155EEF] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#155EEF] group-hover:text-white group-hover:border-[#155EEF] transition-all duration-200 shadow-2xs">
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.25] group-hover:translate-x-0.5 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>

                    {/* ── MOBILE VIEW ── */}
                    <div className="flex sm:hidden items-center justify-between gap-3">
                      {/* Left: Number + Details */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-[#EEF5FF] dark:bg-blue-950/70 border border-[#D4E4FA] dark:border-blue-900/50 flex items-center justify-center font-bold text-xs text-[#155EEF] dark:text-blue-400 shrink-0 select-none mt-0.5 shadow-2xs">
                          {chapterNum}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-[14.5px] font-bold text-[#062B67] dark:text-white tracking-tight leading-snug line-clamp-2">
                            {chapter.name}
                          </h3>
                          <p className="mt-0.5 text-[11.5px] text-[#64748B] dark:text-slate-400 font-medium">
                            {chapter.supportingText || 'Chapter Notes • English / Hindi'}
                          </p>

                          {/* Stacked badges below info */}
                          <div className="flex items-center flex-wrap gap-1.5 mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#F4FAF6] dark:bg-emerald-950/30 border border-[#E2F5E8] dark:border-emerald-800/30 text-[#16A34A] dark:text-emerald-400 text-[10px] font-semibold">
                              Quick Revision
                            </span>

                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFFBF5] dark:bg-amber-950/30 border border-[#FDEED5] dark:border-amber-800/30 text-[#D97706] dark:text-amber-400 text-[10px] font-semibold">
                              Detailed Notes
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Light Circle Button with Arrow */}
                      <div className="w-[28px] h-[28px] rounded-full bg-[#EEF4FE] dark:bg-blue-950/60 border border-[#D5E3F9] dark:border-blue-900/50 text-[#155EEF] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#155EEF] group-hover:text-white group-hover:border-[#155EEF] transition-all duration-200 shadow-2xs">
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.25]" />
                      </div>
                    </div>
                  </Link>
                );
              })}
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
