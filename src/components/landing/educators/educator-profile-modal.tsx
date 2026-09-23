'use client';

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Award,
  Clock,
  Sparkles,
  UserCheck,
  Calculator,
  BookOpen,
  BarChart3,
  Users,
} from "lucide-react";
import type { TExpertTeacher } from "@/app/actions/types";

function getSubjectBadgeIcon(subject?: string | null) {
  if (!subject) return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  const s = subject.toLowerCase();
  if (s.includes("econ") || s.includes("commerce")) {
    return <BarChart3 className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("math") || s.includes("quant")) {
    return <Calculator className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("social") || s.includes("history") || s.includes("geo") || s.includes("civics")) {
    return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  if (s.includes("sci") || s.includes("phys") || s.includes("chem") || s.includes("bio")) {
    return <Sparkles className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
  }
  return <BookOpen className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2.2]" />;
}

interface EducatorProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: TExpertTeacher;
  displaySrc: string;
  designation?: string;
  specializationBadge?: string | null;
  expDisplay?: string;
  qualDisplay?: string;
  bioText?: string;
}

export function EducatorProfileModal({
  isOpen,
  onOpenChange,
  teacher,
  displaySrc,
  designation,
  specializationBadge,
  expDisplay,
  qualDisplay,
  bioText,
}: EducatorProfileModalProps) {
  const hasExp = Boolean(expDisplay);
  const hasQual = Boolean(qualDisplay);
  const hasPhoto = Boolean(displaySrc);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-lg md:max-w-[560px] p-0 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-h-[88vh] overflow-hidden flex flex-col [&>button]:hidden">
        
        {/* Hidden Accessibility Header */}
        <DialogHeader className="sr-only">
          <DialogTitle>{teacher.name} - Full Profile</DialogTitle>
          <DialogDescription>Full profile and background details for {teacher.name}</DialogDescription>
        </DialogHeader>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-4.5 items-start">
          
          {/* ── LEFT: COMPACT BALANCED PHOTO CONTAINER ── */}
          <div className="w-full sm:w-[145px] shrink-0">
            <div
              className="relative w-full aspect-[4/3.5] sm:aspect-[3/3.7] rounded-xl overflow-hidden bg-black border border-slate-200/80 dark:border-slate-800 shadow-xs"
              style={{
                background: "linear-gradient(145deg, #18181B 0%, #0F0F12 40%, #000000 100%)",
              }}
            >
              {/* Teacher Photo */}
              {hasPhoto ? (
                <div className="absolute inset-0 z-10">
                  <Image
                    src={displaySrc}
                    alt={teacher.name}
                    fill
                    sizes="(max-width: 640px) 90vw, 160px"
                    className="object-cover object-top"
                    style={teacher.photoPosition ? { objectPosition: teacher.photoPosition } : undefined}
                    unoptimized={true}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white/15" />
                </div>
              )}

              {/* Subtle bottom fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-8 z-20 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: DETAILS & STATS ── */}
          <div className="flex-1 min-w-0 flex flex-col space-y-3 text-left w-full">
            
            {/* Header: Subject Badge + Name + Designation */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
              {specializationBadge && (
                <div className="inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-md bg-blue-50/90 text-[#155EEF] text-[10px] font-bold tracking-[0.03em] uppercase border border-blue-100/90 mb-1.5">
                  {getSubjectBadgeIcon(specializationBadge)}
                  <span className="truncate max-w-[180px]">{specializationBadge}</span>
                </div>
              )}
              <h3 className="font-extrabold text-[17px] sm:text-[18px] text-[#062B67] dark:text-blue-50 tracking-tight leading-snug truncate">
                {teacher.name}
              </h3>
              {designation && (
                <p className="text-[11.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                  {designation}
                </p>
              )}
            </div>

            {/* Stats Row: Qualification (Left) + Experience (Right) */}
            {(hasQual || hasExp) && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {hasQual && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 border-l-2 border-l-[#155EEF]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-0.5">
                      <Award className="w-2.5 h-2.5 text-[#155EEF] shrink-0 stroke-[2.2]" />
                      Qualification
                    </span>
                    <span className="font-bold text-[11.5px] sm:text-[12px] text-[#062B67] dark:text-slate-100 block truncate" title={qualDisplay}>
                      {qualDisplay}
                    </span>
                  </div>
                )}
                {hasExp && (
                  <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 border-l-2 border-l-[#155EEF]">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 mb-0.5">
                      <Clock className="w-2.5 h-2.5 text-[#155EEF] shrink-0 stroke-[2.2]" />
                      Experience
                    </span>
                    <span className="font-bold text-[11.5px] sm:text-[12px] text-[#062B67] dark:text-slate-100 block truncate">
                      {expDisplay}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Approach & About Educator Blocks */}
            {(teacher.teachingFocus || bioText) && (
              <div className="space-y-2.5 pt-0.5">
                {teacher.teachingFocus && (
                  <div className="rounded-lg bg-slate-50/80 dark:bg-slate-900/40 p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-800/70">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-3 rounded-full bg-[#155EEF] shrink-0" />
                      <Sparkles className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2]" />
                      <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#062B67] dark:text-blue-200">
                        Teaching Approach
                      </span>
                    </div>
                    <p className="text-[11.5px] sm:text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {teacher.teachingFocus}
                    </p>
                  </div>
                )}

                {bioText && (
                  <div className="rounded-lg bg-slate-50/80 dark:bg-slate-900/40 p-2.5 sm:p-3 border border-slate-200/60 dark:border-slate-800/70">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-3 rounded-full bg-[#155EEF] shrink-0" />
                      <UserCheck className="w-3 h-3 text-[#155EEF] shrink-0 stroke-[2]" />
                      <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-[#062B67] dark:text-blue-200">
                        About Educator
                      </span>
                    </div>
                    <p className="text-[11.5px] sm:text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {bioText}
                    </p>
                  </div>
                )}
              </div>
            )}


          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
