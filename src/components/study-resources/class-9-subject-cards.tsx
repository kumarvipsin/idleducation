'use client';

import React, { useState } from 'react';
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
                    <div className="group relative flex flex-col justify-between h-full flex-1 bg-white dark:bg-slate-900 border border-[#E8EEF5] dark:border-slate-800 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 lg:p-[22px] shadow-[0_2px_10px_rgba(11,43,99,0.03)] hover:shadow-[0_12px_28px_rgba(11,43,99,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden">

                      {/* Watermark */}
                      <span
                        aria-hidden="true"
                        className="absolute top-3.5 right-4 sm:top-4 sm:right-5 lg:top-4 lg:right-5 text-[26px] sm:text-[30px] lg:text-[32px] font-black leading-none text-[#CBD5E1] dark:text-slate-700/60 select-none pointer-events-none tracking-tight font-sans z-0"
                      >
                        {`${(subj.badgeNumber || classPad).replace(/th$/i, '')}th`}
                      </span>

                      {/* Header: Title + Accent Line */}
                      <div className="relative z-10">
                        <div className="h-[28px] sm:h-[30px] flex items-center">
                          <h3 className="text-[19px] sm:text-[21px] font-bold text-[#0B254A] dark:text-white tracking-tight leading-none whitespace-nowrap">
                            {subj.name}
                          </h3>
                        </div>
                        <div
                          className="h-[3px] w-7 rounded-full mt-2 sm:mt-2.5 mb-2 sm:mb-2.5"
                          style={{ backgroundColor: subj.accentColor || '#155EEF' }}
                        />
                      </div>

                      {/* Middle Content: Description */}
                      <div className="relative z-10 flex-1 flex flex-col justify-start my-1 sm:my-1.5">
                        <p className="text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.5] sm:leading-[1.45] text-[#64748B] dark:text-slate-400 font-medium">
                          {subj.description}
                        </p>
                      </div>

                      {/* Bottom CTA: Text with Arrow */}
                      <div className="relative z-10 mt-auto pt-2.5 sm:pt-3">
                        <span className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-bold text-[#155EEF] dark:text-blue-400 group-hover:text-[#0047CC] transition-colors">
                          <span>View Chapters</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-200" />
                        </span>
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
