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
    <div className="text-center mb-3.5 min-[380px]:mb-4 sm:mb-7 relative">
      {/* Eyebrow — bullet point */}
      <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3 mb-1.5 min-[390px]:mb-2 sm:mb-3.5 select-none">
        <span className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
        <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[17px] font-[800] sm:font-[900] tracking-tight">
          <span className="text-[#062B67] dark:text-blue-200">{titlePrefix}</span>
          <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">{titleHighlight}</span>
        </span>
      </div>

      {/* Description heading */}
      <h2 className="text-[15px] min-[360px]:text-[15.5px] min-[390px]:text-[16.5px] sm:text-[28px] md:text-[36px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto whitespace-nowrap">
        <span className="text-[#062B67] dark:text-white">Expert Guidance.{' '}</span>
        <span className="text-[#155EEF] dark:text-blue-400">Meaningful Learning.</span>
      </h2>

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
