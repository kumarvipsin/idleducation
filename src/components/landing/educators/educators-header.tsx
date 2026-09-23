'use client';

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EducatorsHeaderProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  subtitle?: string;
  showNavigation?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function EducatorsHeader({
  eyebrow,
  titlePrefix = "Meet Our ",
  titleHighlight = "Educators",
  subtitle,
  showNavigation = false,
  onPrev,
  onNext,
}: EducatorsHeaderProps) {
  return (
    <div className="text-center mb-8 sm:mb-10 relative">
      {/* Eyebrow */}
      {eyebrow && (
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-6 sm:w-8 bg-[#155EEF]/30" />
          <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.16em] uppercase text-[#155EEF]">
            {eyebrow}
          </span>
          <span className="h-px w-6 sm:w-8 bg-[#155EEF]/30" />
        </div>
      )}

      {/* Main heading */}
      <h2 className={`text-[26px] sm:text-[32px] md:text-[38px] font-extrabold tracking-[-0.025em] leading-[1.15] ${subtitle ? 'mb-2.5' : 'mb-0'}`}>
        <span className="text-[#062B67]">{titlePrefix}</span>
        <span className="text-[#155EEF]">{titleHighlight}</span>
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
          {subtitle}
        </p>
      )}

      {/* Navigation arrows — desktop top right */}
      {showNavigation && (
        <div className="hidden sm:flex items-center gap-2 absolute right-0 top-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous educator"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white text-[#062B67] flex items-center justify-center hover:bg-[#F0F5FF] hover:border-[#155EEF]/40 hover:text-[#155EEF] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next educator"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white text-[#062B67] flex items-center justify-center hover:bg-[#F0F5FF] hover:border-[#155EEF]/40 hover:text-[#155EEF] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
