'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import {
  CLASSES,
  CLASS_9_SUBJECTS,
  CLASS_12_SUBJECTS,
  getSubjectsForClass,
  type ClassId,
} from '@/lib/study-resources-data';

interface Class9SubjectCardsProps {
  onSelectSubject?: (subjectId: string) => void;
  selectedClass?: ClassId;
  onSelectClass?: (classId: ClassId) => void;
  linkPattern?: (subjectId: string) => string;
}

export function Class9SubjectCards({
  onSelectSubject,
  selectedClass: propSelectedClass,
  onSelectClass,
  linkPattern,
}: Class9SubjectCardsProps) {
  const [internalClass, setInternalClass] = useState<ClassId>('class-9');
  const activeClass = propSelectedClass || internalClass;

  const handleClassClick = (classId: ClassId) => {
    if (onSelectClass) onSelectClass(classId);
    else setInternalClass(classId);
  };

  const handleSubjectClick = (subjectId: string) => {
    if (onSelectSubject) onSelectSubject(subjectId);
  };

  return (
    <div className="w-full">
      {/* ── CLASS NAVIGATION TABS (MODERN SEGMENTED PILL DOCK) ── */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 w-full">
        <div className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#EDF3FA] dark:bg-slate-800/90 border border-[#DCE7F5] dark:border-slate-700/80 shadow-[inset_0_1px_3px_rgba(11,43,99,0.04)] max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CLASSES.map((cls) => {
            const isActive = activeClass === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => handleClassClick(cls.id)}
                className={`relative flex items-center gap-1.5 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[14.5px] transition-all duration-200 cursor-pointer whitespace-nowrap outline-none ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-[#155EEF] dark:text-blue-400 font-extrabold shadow-[0_2px_8px_rgba(21,94,239,0.12)] border border-[#D5E3F8]/80 dark:border-blue-900/60'
                    : 'text-[#64748B] hover:text-[#062B67] dark:text-slate-400 dark:hover:text-white font-semibold'
                }`}
              >
                <span>{cls.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>


      </div>

      {/* ── SUBJECT CARDS GRID ── */}
      <div className="w-full">
        {(() => {
          const subjects = getSubjectsForClass(activeClass);
          const classNum = activeClass.replace('class-', '');
          const classPad = classNum.padStart(2, '0');

          if (subjects.length > 0) {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full items-stretch">
                {subjects.map((subj) => {
                  const cardInner = (
                    <div
                      className={`group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-[#E2ECF8] dark:border-slate-800 rounded-[22px] sm:rounded-[24px] p-4 sm:p-5 shadow-[0_4px_16px_rgba(11,37,74,0.03)] hover:shadow-[0_18px_36px_-6px_rgba(11,37,74,0.09)] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                        subj.borderHover || 'hover:border-[#155EEF]/50'
                      }`}
                    >
                      {/* Subtle Watermark in background */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 text-[40px] sm:text-[44px] font-black leading-none text-[#F1F5F9] dark:text-slate-800/40 select-none pointer-events-none tracking-tight font-sans z-0"
                      >
                        {`${(subj.badgeNumber || classPad).replace(/th$/i, '')}th`}
                      </span>

                      {/* Top Header: Title + Chapter Count Badge */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: subj.accentColor || '#155EEF' }}
                            />
                            <h3 className="text-[19px] sm:text-[21px] font-extrabold text-[#062B67] dark:text-white tracking-tight leading-tight">
                              {subj.name}
                            </h3>
                          </div>


                        </div>

                        {/* Thin accent line */}
                        <div
                          className="h-[3px] w-7 rounded-full mt-2 mb-1"
                          style={{ backgroundColor: subj.accentColor || '#155EEF' }}
                        />
                      </div>

                      {/* 3D Book Cover Visual Stage */}
                      <div className="relative z-10 w-full h-[145px] sm:h-[150px] my-3 rounded-[16px] overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#F7FAFD] to-[#EDF4FC] dark:from-slate-800/60 dark:to-slate-800/20 border border-[#E9F0F8] dark:border-slate-800">
                        {/* Ambient Glow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              subj.glowBg ||
                              'radial-gradient(circle, rgba(21,94,239,0.12) 0%, transparent 70%)',
                          }}
                        />

                        {/* Subtle dotted grid texture */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none bg-[radial-gradient(#0B254A_1px,transparent_1px)] [background-size:12px_12px]"
                        />

                        {/* 3D Book Graphic with Hover Floating Effect */}
                        {subj.image ? (
                          <div className="relative z-10 w-[110px] h-[130px] sm:w-[115px] sm:h-[135px] flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-108 group-hover:-rotate-2 group-hover:-translate-y-1">
                            <Image
                              src={subj.image}
                              alt={`${subj.name} Class ${classNum} NCERT Revision Book`}
                              fill
                              sizes="(max-width: 640px) 130px, 140px"
                              className="object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.14)] group-hover:drop-shadow-[0_16px_20px_rgba(0,0,0,0.22)] transition-all duration-300"
                              priority
                            />
                          </div>
                        ) : (
                          <BookOpen
                            className="w-12 h-12 stroke-[1.5]"
                            style={{ color: subj.accentColor || '#155EEF' }}
                          />
                        )}


                      </div>



                      {/* Description */}
                      <p className="relative z-10 text-[12.5px] sm:text-[13px] leading-[1.5] text-[#5B6B86] dark:text-slate-400 font-normal mb-3.5 flex-1">
                        {subj.description}
                      </p>

                      {/* Bottom Tactile Action Button */}
                      <div className="relative z-10 mt-auto pt-1">
                        <div
                          className="w-full py-2.5 px-3.5 rounded-xl font-bold text-[13px] sm:text-[13.5px] flex items-center justify-between transition-all duration-200 shadow-2xs group-hover:shadow-xs"
                          style={{
                            backgroundColor: subj.cardBgLight || '#F0F6FE',
                            color: subj.accentColor || '#155EEF',
                          }}
                        >
                          <span className="tracking-tight">
                            {subj.chapterCount ? `Explore ${subj.chapterCount} Chapters` : 'View Chapters'}
                          </span>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                            style={{
                              backgroundColor: subj.accentColor || '#155EEF',
                              color: '#FFFFFF',
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );

                  if (onSelectSubject) {
                    return (
                      <div
                        key={subj.id}
                        onClick={() => handleSubjectClick(subj.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSubjectClick(subj.id);
                          }
                        }}
                        className="h-full focus:outline-none flex flex-col"
                      >
                        {cardInner}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={subj.id}
                      href={linkPattern ? linkPattern(subj.id) : `/study-resources?class=${classNum}&subject=${subj.id}`}
                      className="h-full focus:outline-none flex flex-col"
                    >
                      {cardInner}
                    </Link>
                  );
                })}
              </div>
            );
          }

          return (
            <div className="bg-white dark:bg-slate-900 border border-[#E2ECF8] dark:border-slate-800 rounded-[24px] py-12 sm:py-16 px-6 text-center max-w-md mx-auto shadow-[0_4px_20px_rgba(11,43,99,0.04)]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 bg-[#F0F6FE] dark:bg-blue-950/60 border border-[#D5E3F8] dark:border-blue-900 px-3.5 py-1 rounded-full mb-3">
                Curriculum in Progress
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#062B67] dark:text-white tracking-tight">
                {CLASSES.find((c) => c.id === activeClass)?.name} Notes Releasing Soon
              </h3>
              <p className="mt-2 text-sm text-[#5B6B86] dark:text-slate-400 leading-relaxed">
                Revision notes and NCERT solutions for {CLASSES.find((c) => c.id === activeClass)?.name} are currently being crafted by our educators.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleClassClick('class-9')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#155EEF] hover:bg-[#0047CC] text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Explore Class 9 Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

