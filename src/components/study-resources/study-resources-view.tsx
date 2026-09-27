'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

import {
  type ClassId,
  CLASSES,
  CLASS_9_10_SUBJECTS,
  STREAMS,
  CLASS_9_SCIENCE_CHAPTERS,
  normalizeClassId,
} from '@/lib/study-resources-data';

export function StudyResourcesView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedClass, setSelectedClass] = useState<ClassId | null>(() => normalizeClassId(searchParams.get('class')));
  const [selectedSubject, setSelectedSubject] = useState<string | null>(() => {
    const classFromUrl = normalizeClassId(searchParams.get('class'));
    if (classFromUrl === 'class-9' || classFromUrl === 'class-10') {
      const subjectFromUrl = searchParams.get('subject');
      const validSubj = CLASS_9_10_SUBJECTS.find((s) => s.id === subjectFromUrl?.toLowerCase());
      return validSubj ? validSubj.id : null;
    }
    return null;
  });
  const [selectedStream, setSelectedStream] = useState<string | null>(() => {
    const classFromUrl = normalizeClassId(searchParams.get('class'));
    if (classFromUrl === 'class-11' || classFromUrl === 'class-12') {
      const streamFromUrl = searchParams.get('stream');
      const validStream = STREAMS.find((s) => s.id === streamFromUrl?.toLowerCase());
      return validStream ? validStream.id : null;
    }
    return null;
  });

  // Sync state from URL search params on mount or when searchParams change
  useEffect(() => {
    const classFromUrl = normalizeClassId(searchParams.get('class'));
    const subjectFromUrl = searchParams.get('subject');
    const streamFromUrl = searchParams.get('stream');

    setSelectedClass(classFromUrl);

    if (classFromUrl === 'class-9' || classFromUrl === 'class-10') {
      const validSubj = CLASS_9_10_SUBJECTS.find((s) => s.id === subjectFromUrl?.toLowerCase());
      setSelectedSubject(validSubj ? validSubj.id : null);
      setSelectedStream(null);
    } else if (classFromUrl === 'class-11' || classFromUrl === 'class-12') {
      const validStream = STREAMS.find((s) => s.id === streamFromUrl?.toLowerCase());
      setSelectedStream(validStream ? validStream.id : null);
      setSelectedSubject(null);
    } else {
      setSelectedSubject(null);
      setSelectedStream(null);
    }
  }, [searchParams]);

  const updateUrl = useCallback((cls: ClassId | null, subj: string | null, strm: string | null) => {
    const params = new URLSearchParams();
    if (cls) {
      params.set('class', cls.replace('class-', ''));
    }
    if (subj) {
      params.set('subject', subj);
    }
    if (strm) {
      params.set('stream', strm);
    }
    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    window.history.pushState(null, '', newUrl);
  }, [pathname]);

  const handleSelectClass = (classId: ClassId) => {
    setSelectedClass(classId);
    setSelectedSubject(null);
    setSelectedStream(null);
    updateUrl(classId, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubject(subjectId);
    updateUrl(selectedClass, subjectId, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStream = (streamId: string) => {
    setSelectedStream(streamId);
    updateUrl(selectedClass, null, streamId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToRoot = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedStream(null);
    updateUrl(null, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToClass = () => {
    setSelectedSubject(null);
    setSelectedStream(null);
    updateUrl(selectedClass, null, null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active items
  const currentClass = CLASSES.find((c) => c.id === selectedClass);
  const currentSubject = CLASS_9_10_SUBJECTS.find((s) => s.id === selectedSubject);
  const currentStream = STREAMS.find((s) => s.id === selectedStream);

  const isJuniorClass = selectedClass === 'class-9' || selectedClass === 'class-10';
  const isSeniorClass = selectedClass === 'class-11' || selectedClass === 'class-12';
  const isClass9Science = currentClass?.id === 'class-9' && currentSubject?.id === 'science';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pt-3 pb-24 sm:pt-5 sm:pb-28">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── BREADCRUMBS ── */}
        <nav aria-label="Breadcrumbs" className="mb-4 sm:mb-6">
          <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-[#5B6B86] dark:text-slate-400">
            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </>
              ) : (
                <span className="font-semibold text-[#062B67] dark:text-white">
                  Study Resources
                </span>
              )}
            </li>

            {currentClass && (
              <li className="flex items-center gap-1.5 sm:gap-2">
                {(currentSubject || currentStream) ? (
                  <>
                    <button
                      type="button"
                      onClick={handleResetToClass}
                      className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      {currentClass.name}
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </>
                ) : (
                  <span className="font-semibold text-[#062B67] dark:text-white">
                    {currentClass.name}
                  </span>
                )}
              </li>
            )}

            {currentSubject && (
              <li>
                <span className="font-semibold text-[#062B67] dark:text-white">
                  {currentSubject.name}
                </span>
              </li>
            )}

            {currentStream && (
              <li>
                <span className="font-semibold text-[#062B67] dark:text-white">
                  {currentStream.name}
                </span>
              </li>
            )}
          </ol>
        </nav>

        {/* ── VIEW 1: CHOOSE YOUR CLASS ── */}
        {!selectedClass && (
          <section aria-labelledby="choose-class-heading" className="space-y-5 sm:space-y-6">
            <div className="text-center">
              <h1 id="choose-class-heading" className="text-2xl sm:text-3xl md:text-[30px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                Choose Your Class
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {CLASSES.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => handleSelectClass(cls.id)}
                  className="group relative flex flex-col justify-between text-left h-full bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(6,43,103,0.03)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.08)] transition-all duration-150 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectClass(cls.id);
                    }
                  }}
                >
                  {/* Top Content */}
                  <div className="flex flex-col">
                    {/* Small category badge */}
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F0F5FF] dark:bg-blue-950/60 text-[#155EEF] dark:text-blue-400 font-bold text-[10.5px] uppercase tracking-wider">
                        {cls.badge}
                      </span>
                    </div>

                    {/* Class Name (Main Visual Focus) */}
                    <h3 className="text-xl sm:text-[22px] font-extrabold text-[#062B67] dark:text-white group-hover:text-[#155EEF] transition-colors tracking-tight">
                      {cls.name}
                    </h3>

                    {/* Short Description */}
                    <p className="mt-2 text-xs sm:text-[13px] text-[#5B6B86] dark:text-slate-400 leading-relaxed font-normal">
                      {cls.description}
                    </p>
                  </div>

                  {/* Bottom Action with Divider */}
                  <div className="pt-3.5 mt-4 sm:mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs sm:text-[13px] font-semibold text-[#155EEF] dark:text-blue-400 group-hover:text-[#0052CC] inline-flex items-center gap-1 transition-colors">
                      <span>Explore Resources</span>
                      <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── VIEW 2A: CLASS 9 / CLASS 10 (SUBJECT SELECTION) ── */}
        {isJuniorClass && currentClass && !currentSubject && (
          <section aria-labelledby="subject-heading" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                    {currentClass.name}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    CBSE Board
                  </span>
                </div>
                <h2 id="subject-heading" className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  Revision Notes
                </h2>
                <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#5B6B86] dark:text-slate-400">
                  Select a subject to explore chapter-wise notes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetToRoot}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Classes</span>
              </button>
            </div>

            {/* Subject Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {CLASS_9_10_SUBJECTS.map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => handleSelectSubject(subj.id)}
                  className="group relative flex flex-col justify-between text-left h-full min-h-[170px] sm:min-h-[185px] bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(6,43,103,0.03)] hover:shadow-[0_8px_24px_rgba(21,94,239,0.08)] transition-all duration-200 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSubject(subj.id);
                    }
                  }}
                >
                  <div>
                    <h3 className="text-[18px] sm:text-[19px] font-bold text-[#062B67] dark:text-white group-hover:text-[#155EEF] transition-colors tracking-tight">
                      {subj.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                      Chapter-wise Notes
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#155EEF] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      View Chapters &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── VIEW 2A-SUB: CLASS 9 SCIENCE CHAPTER LISTING UI ── */}
        {isJuniorClass && currentClass && currentSubject && isClass9Science && (
          <section aria-labelledby="chapter-notes-heading" className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                {/* Small eyebrow */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11.5px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                    CLASS 9 &bull; Science
                  </span>
                </div>

                {/* Main heading */}
                <h1 id="chapter-notes-heading" className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  Science &bull; Chapter-wise Notes
                </h1>

                {/* Subtitle */}
                <p className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-[#5B6B86] dark:text-slate-400 font-normal">
                  Comprehensive chapter-wise notes and study material for Class 9 Science.
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
              {CLASS_9_SCIENCE_CHAPTERS.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/study-resources/class-9/science/${chapter.slug}`}
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

        {/* ── VIEW 2A-SUB: OTHER JUNIOR SUBJECTS (PLACEHOLDER) ── */}
        {isJuniorClass && currentClass && currentSubject && !isClass9Science && (
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

        {/* ── VIEW 2B: CLASS 11 / CLASS 12 (STREAM SELECTION) ── */}
        {isSeniorClass && currentClass && !currentStream && (
          <section aria-labelledby="stream-heading" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                    {currentClass.name}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Senior Secondary
                  </span>
                </div>
                <h2 id="stream-heading" className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  Choose Your Stream
                </h2>
                <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#5B6B86] dark:text-slate-400">
                  Select your academic stream to access specialized study material and revision notes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetToRoot}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Classes</span>
              </button>
            </div>

            {/* Stream Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {STREAMS.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => handleSelectStream(stream.id)}
                  className="group relative flex flex-col justify-between text-left h-full min-h-[190px] sm:min-h-[210px] bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(6,43,103,0.03)] hover:shadow-[0_8px_24px_rgba(21,94,239,0.08)] transition-all duration-200 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectStream(stream.id);
                    }
                  }}
                >
                  <div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#F0F5FF] dark:bg-blue-950/60 text-[#155EEF] dark:text-blue-400 font-bold text-[11px] mb-3">
                      Academic Stream
                    </div>

                    <h3 className="text-[19px] sm:text-[20px] font-bold text-[#062B67] dark:text-white group-hover:text-[#155EEF] transition-colors tracking-tight">
                      {stream.name}
                    </h3>

                    <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {stream.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#155EEF] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      View Stream &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── VIEW 2B-SUB: CLASS 11 / 12 STREAM SUBJECTS ARCHITECTURE PLACEHOLDER ── */}
        {isSeniorClass && currentClass && currentStream && (
          <section aria-labelledby="stream-subjects-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                    {currentClass.name}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {currentStream.name} Stream
                  </span>
                </div>
                <h2 id="stream-subjects-heading" className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  {currentClass.name} &bull; {currentStream.name}
                </h2>
                <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#5B6B86] dark:text-slate-400">
                  Stream-based curriculum and chapter notes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetToClass}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:underline cursor-pointer self-start sm:self-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Streams</span>
              </button>
            </div>

            {/* Clean, minimal placeholder state */}
            <div className="bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 rounded-[20px] p-6 sm:p-8 md:p-10 shadow-[0_2px_14px_rgba(6,43,103,0.03)] text-center max-w-xl mx-auto my-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-semibold text-xs mb-3">
                {currentClass.name} &bull; {currentStream.name} Stream
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                Stream Subjects
              </h3>
              <p className="mt-2 text-sm text-[#5B6B86] dark:text-slate-400 leading-relaxed">
                Subjects for {currentClass.name} {currentStream.name} will be added in the next step.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetToClass}
                  className="px-5 py-2.5 rounded-lg bg-[#155EEF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  &larr; Choose Another Stream
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
