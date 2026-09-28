'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      {/* ── CLASS NAVIGATION TABS ── */}
      <div className="flex justify-center items-center mb-7 sm:mb-9 md:mb-10 w-full overflow-hidden">
        <div className="inline-flex items-center justify-center gap-6 sm:gap-11 md:gap-14 overflow-x-auto max-w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 py-1">
          {CLASSES.map((cls) => {
            const isActive = activeClass === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => handleClassClick(cls.id)}
                className={`group flex flex-col items-center cursor-pointer transition-colors outline-none whitespace-nowrap ${
                  isActive
                    ? 'text-[#155EEF] font-bold'
                    : 'text-[#8A9BA8] hover:text-[#475569] dark:text-slate-500 dark:hover:text-slate-300 font-medium'
                }`}
              >
                <span className="text-[14.5px] sm:text-[16px] tracking-tight">
                  {cls.name}
                </span>
                {/* Active indicator bar */}
                <span
                  className={`h-[3px] rounded-full mt-1.5 transition-all duration-200 ${
                    isActive
                      ? 'w-8 sm:w-10 bg-[#155EEF] opacity-100'
                      : 'w-0 bg-transparent opacity-0'
                  }`}
                />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full">
                {subjects.map((subj) => {
                  const cardInner = (
                    <div className="group relative flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-[#E8EEF5] dark:border-slate-800 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 shadow-[0_2px_10px_rgba(11,43,99,0.03)] hover:shadow-[0_12px_28px_rgba(11,43,99,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden">

                      {/* Watermark */}
                      <span
                        aria-hidden="true"
                        className="absolute top-3.5 right-4 sm:top-5 sm:right-6 text-[44px] sm:text-[52px] font-black leading-none text-[#E2E8F0] dark:text-slate-800/40 select-none pointer-events-none tracking-tight font-sans"
                      >
                        {subj.badgeNumber || classPad}
                      </span>

                      {/* Header: Title + Accent Line */}
                      <div className="relative z-10">
                        <div className="h-[28px] sm:h-[30px] flex items-center">
                          <h3 className="text-[19px] sm:text-[21px] font-bold text-[#0B254A] dark:text-white tracking-tight leading-none whitespace-nowrap">
                            {subj.name}
                          </h3>
                        </div>
                        <div className={`h-[3px] w-7 rounded-full mt-2 sm:mt-2.5 mb-2.5 sm:mb-3 ${subj.accentBarClass || 'bg-[#155EEF]'}`} />
                      </div>

                      {/* Desktop Middle Content (Strict vertical alignment: Description -> Book Area) */}
                      <div className="relative z-10 hidden sm:flex flex-col flex-1">
                        <p className="h-[62px] text-[13px] leading-[1.55] text-[#64748B] dark:text-slate-400 font-normal">
                          {subj.description}
                        </p>

                        <div className="relative w-full h-[180px] shrink-0 flex items-center justify-center my-2">
                          {/* Pastel Glow Aura Circle */}
                          <div
                            aria-hidden="true"
                            className="absolute w-[140px] h-[140px] rounded-full pointer-events-none"
                            style={{ background: subj.glowBg }}
                          />

                          {subj.image && (
                            <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-[1.03] transition-transform duration-300 ease-out">
                              <Image
                                src={subj.image}
                                alt={`Class ${classNum} ${subj.name} Textbook`}
                                fill
                                className="object-contain object-center"
                                sizes="(max-width: 1024px) 240px, 280px"
                                priority
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile Middle Content (Horizontal split: Description left, Book right per reference) */}
                      <div className="relative z-10 flex sm:hidden flex-row items-center justify-between gap-3 my-2 flex-1">
                        <p className="flex-1 text-[12px] min-[360px]:text-[12.5px] leading-[1.5] text-[#64748B] dark:text-slate-400 font-normal pr-1">
                          {subj.description}
                        </p>

                        <div className="relative w-[96px] h-[108px] shrink-0 flex items-center justify-center">
                          {/* Pastel Glow Aura Circle */}
                          <div
                            aria-hidden="true"
                            className="absolute w-[82px] h-[82px] rounded-full pointer-events-none"
                            style={{ background: subj.glowBg }}
                          />

                          {subj.image && (
                            <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-[1.03] transition-transform duration-300 ease-out">
                              <Image
                                src={subj.image}
                                alt={`Class ${classNum} ${subj.name} Textbook`}
                                fill
                                className="object-contain object-center"
                                sizes="96px"
                                priority
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom CTA Pill Container */}
                      <div className="relative z-10 mt-auto pt-2">
                        <div className="w-full h-[38px] sm:h-[44px] bg-[#F0F6FE] dark:bg-slate-800/80 border border-[#E0ECFD] dark:border-slate-700/60 group-hover:bg-[#E5F0FD] dark:group-hover:bg-slate-800 rounded-full px-3.5 sm:px-4 flex items-center justify-between transition-colors duration-200">
                          <span className="text-[12.5px] sm:text-[13.5px] font-bold text-[#155EEF] dark:text-blue-400 inline-flex items-center gap-1.5 tracking-tight">
                            View Chapters &rarr;
                          </span>

                          {/* Solid Circular Blue Button */}
                          <div className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-full bg-[#155EEF] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 group-hover:bg-[#0047CC] transition-all duration-200">
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
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
                        className="h-full focus:outline-none"
                      >
                        {cardInner}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={subj.id}
                      href={linkPattern ? linkPattern(subj.id) : `/study-resources?class=${classNum}&subject=${subj.id}`}
                      className="h-full focus:outline-none block"
                    >
                      {cardInner}
                    </Link>
                  );
                })}
              </div>
            );
          }

          return (
            <div className="bg-white dark:bg-slate-900 border border-[#E8EEF5] dark:border-slate-800 rounded-[22px] py-12 sm:py-16 px-6 text-center max-w-md mx-auto shadow-[0_2px_12px_rgba(11,43,99,0.03)]">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 bg-[#F0F6FE] dark:bg-blue-950/60 px-3 py-1 rounded-full mb-3">
                Coming Soon
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B2B63] dark:text-white tracking-tight">
                {CLASSES.find((c) => c.id === activeClass)?.name} Notes
              </h3>
              <p className="mt-2 text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                Revision notes for this class are being prepared. Explore Class 9 resources available now.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleClassClick('class-9')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#155EEF] hover:bg-[#0047CC] text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>View Class 9</span>
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
