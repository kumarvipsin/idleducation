'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DemoSubjectSelectorConfig } from '@/lib/branch-courses';

interface DemoSubjectSelectorProps {
  config: DemoSubjectSelectorConfig;
  selectedSubjects: string[];
  onChange: (next: string[]) => void;
  variant?: 'underline' | 'hero';
}

export function DemoSubjectSelector({
  config,
  selectedSubjects,
  onChange,
  variant = 'underline',
}: DemoSubjectSelectorProps) {
  if (config.mode !== 'stream' || config.options.length === 0) {
    return null;
  }

  const handleToggle = (value: string) => {
    if (config.singleSelect) {
      onChange(selectedSubjects.includes(value) ? [] : [value]);
      return;
    }
    if (selectedSubjects.includes(value)) {
      onChange(selectedSubjects.filter((item) => item !== value));
    } else {
      onChange([...selectedSubjects, value]);
    }
  };

  const isFourOptions = config.options.length >= 4;

  return (
    <div
      data-demo-subject-selector
      className={cn(
        variant === 'underline'
          ? 'space-y-2.5 pt-1 pb-2.5 border-b border-slate-200 dark:border-slate-700/85 text-left'
          : 'rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 bg-[#F8FAFD] md:bg-slate-50/35 px-3.5 py-2.5 space-y-2 text-left'
      )}
    >
      <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.09em] uppercase text-[#173568]/75 dark:text-slate-400 block leading-none select-none">
        {config.heading}
      </span>

      <div
        className={cn(
          'w-full',
          !isFourOptions
            ? 'flex items-center flex-nowrap gap-7 sm:gap-10'
            : variant === 'hero'
              ? 'grid grid-cols-2 gap-x-4 gap-y-2'
              : 'grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:items-center sm:justify-between sm:flex-wrap sm:gap-x-3 sm:gap-y-2'
        )}
      >
        {config.options.map((opt) => {
          const isSelected = selectedSubjects.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              title={opt.value}
              onClick={() => handleToggle(opt.value)}
              className="flex items-center gap-2 text-left cursor-pointer group py-0.5 select-none focus:outline-none transition-colors shrink-0"
            >
              <div
                className={cn(
                  'w-[15px] h-[15px] rounded-[4px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150',
                  isSelected
                    ? 'border-[#2864E8] bg-[#2864E8] text-white shadow-[0_1px_3px_rgba(40,100,232,0.28)]'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-[#2864E8]/80 group-hover:bg-[#F4F8FF]/60'
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span
                className={cn(
                  'text-[12.5px] sm:text-[13px] leading-[15px] whitespace-nowrap transition-colors',
                  isSelected
                    ? 'font-semibold text-[#173568] dark:text-white'
                    : 'font-medium text-[#173568]/80 dark:text-slate-300 group-hover:text-[#173568]'
                )}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
