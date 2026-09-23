'use client';

import React from "react";
import { Users, ArrowRight } from "lucide-react";

interface EducatorsFooterProps {
  buttonText?: string;
  buttonHref?: string;
}

export function EducatorsFooter({
  buttonText = "View All Educators",
  buttonHref = "/educators",
}: EducatorsFooterProps) {
  return (
    <div className="mt-8 sm:mt-10">
      {/* View All Educators CTA — centered */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <a
          href={buttonHref}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#062B67] hover:bg-[#0A3580] text-white text-[13px] sm:text-[13.5px] font-semibold transition-all duration-200 shadow-[0_3px_14px_rgba(6,43,103,0.2)] hover:shadow-[0_5px_20px_rgba(6,43,103,0.28)] group cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>{buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Bottom taglines */}
      <div className="flex items-center justify-between px-1">
        <div className="hidden sm:flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <span className="w-4 h-[2px] bg-[#155EEF] rounded-full" />
              <span className="w-2 h-[2px] bg-[#155EEF]/50 rounded-full" />
              <span className="w-1 h-[2px] bg-[#155EEF]/25 rounded-full" />
            </div>
          </div>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 leading-tight">
            Better Teachers
          </p>
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400 leading-tight -mt-px">
            Brighter Futures
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] uppercase text-slate-400">
          <span>Education</span>
          <span className="text-slate-300">|</span>
          <span>Opportunity</span>
          <span className="text-slate-300">|</span>
          <span>A Brighter Bharat</span>
        </div>
      </div>
    </div>
  );
}
