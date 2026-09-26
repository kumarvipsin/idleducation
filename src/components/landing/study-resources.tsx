'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  accentColor: string; // Hex for badge, button & bottom stripe
  lightBg: string;     // Tailwind class or style
  arrowBg: string;
  arrowText: string;
}

const resources: ResourceItem[] = [
  {
    id: "revision-notes",
    title: "Revision Notes",
    description: "Concise notes for concepts and quick revision.",
    href: "/resources/notes",
    imageUrl: "/notes.jpg",
    imageAlt: "Revision Notes",
    accentColor: "#0A5CFF",
    lightBg: "bg-gradient-to-b from-[#EBF3FF] to-[#DFEEFF]",
    arrowBg: "bg-[#EFF6FF]",
    arrowText: "text-[#0A5CFF]",
  },
  {
    id: "ncert-solutions",
    title: "NCERT Solutions",
    description: "Step-by-step solutions for NCERT exercises.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.jpg",
    imageAlt: "NCERT Solutions",
    accentColor: "#F59E0B",
    lightBg: "bg-gradient-to-b from-[#FFF9EE] to-[#FFF1D6]",
    arrowBg: "bg-[#FFF7ED]",
    arrowText: "text-[#F59E0B]",
  },
  {
    id: "previous-year-qp",
    title: "Previous Year QP",
    description: "Solved previous-year papers for better exam practice.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.jpg",
    imageAlt: "Previous Year QP",
    accentColor: "#10B981",
    lightBg: "bg-gradient-to-b from-[#EDFAF3] to-[#DBF5E7]",
    arrowBg: "bg-[#ECFDF5]",
    arrowText: "text-[#10B981]",
  },
];

export function StudyResources() {
  return (
    <section 
      id="free-learning-resources"
      aria-label="Free Learning Resources"
      className="w-full pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-[#F1F6FD] via-[#F6F9FE] to-[#EDF4FC] dark:from-slate-950 dark:via-slate-900/70 dark:to-slate-950 border-t border-[#E2ECF8] dark:border-slate-800/80 relative overflow-hidden select-none"
    >
      {/* ── Background Organic Ambient Wave Shapes (Matching Reference Design) ── */}
      <div className="pointer-events-none absolute -top-12 -left-20 w-[420px] h-[340px] rounded-[50%] bg-[#EBF3FF]/60 dark:bg-blue-950/20 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-[480px] h-[380px] rounded-[50%] bg-[#E8F2FD]/50 dark:bg-blue-950/20 blur-3xl -z-10" />

      {/* Subtle background SVG flowing curve */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full text-blue-100/35 dark:text-blue-950/20 -z-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 480"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-50,180 C280,320 540,60 920,210 C1200,320 1350,140 1500,200 L1500,-50 L-50,-50 Z"
          fill="currentColor"
        />
      </svg>

      <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-7xl relative z-10">

        {/* ══════════════════════════════════════════════════
            HEADER AREA: Clean Heading
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 md:mb-10">
          {/* Main Heading — exact same font size & leading as IDL Stars, strictly single line */}
          <h2 className="text-[20px] min-[360px]:text-[22px] min-[400px]:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A1E42] dark:text-white leading-[1.15] whitespace-nowrap">
            Free Learning{' '}
            <span className="text-[#1D4ED8] dark:text-blue-400">
              Resources
            </span>
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════
            DESKTOP VIEW: 3 Side-by-Side Equal Cards
            ══════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6 xl:gap-7 items-stretch">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block h-full focus:outline-none"
            >
              <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[24px] lg:rounded-[26px] border border-[#E9EFF7] dark:border-slate-800 shadow-[0_6px_24px_rgba(11,29,63,0.04)] hover:shadow-[0_14px_36px_rgba(11,29,63,0.09)] hover:-translate-y-1.5 transition-all duration-300 p-3.5 sm:p-4 lg:p-4.5 pb-4 sm:pb-4.5 lg:pb-5 relative overflow-hidden">
                
                {/* Top Illustration Box */}
                <div className="relative w-full aspect-[16/10.5] rounded-[18px] lg:rounded-[20px] overflow-hidden mb-3.5 sm:mb-4 bg-[#F5F8FD] dark:bg-slate-800/80 border border-[#E5EEF9] dark:border-slate-700/60">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 33vw, 380px"
                    priority
                  />
                </div>

                {/* Content: Title & Description on left, Circular Arrow Button on right */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-1">
                  
                  {/* Left: Title + Description */}
                  <div className="flex flex-col text-left flex-1 min-w-0 pr-1">
                    <h3 className="font-extrabold text-[17.5px] lg:text-[18.5px] xl:text-[19.5px] text-[#0B1D3F] dark:text-white leading-[1.2] tracking-tight mb-1 group-hover:text-[#0A5CFF] dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[12.5px] lg:text-[13px] text-[#64748B] dark:text-slate-300 font-normal leading-[1.45] line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Circular Arrow Action Button */}
                  <div
                    className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full ${item.arrowBg} ${item.arrowText} dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm`}
                  >
                    <ArrowRight className="w-4 h-4 lg:w-4.5 lg:h-4.5 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>

                </div>

                {/* Bottom Left Colored Accent Stripe (Matching Reference) */}
                <div 
                  className="w-11 sm:w-12 h-1 rounded-full mt-3 sm:mt-3.5 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: item.accentColor }}
                />

              </div>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            MOBILE VIEW: 3 Horizontal Cards Stacked Vertically
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col md:hidden space-y-3.5 max-w-[440px] mx-auto w-full">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block w-full focus:outline-none"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-[#E9EFF7] dark:border-slate-800 shadow-[0_4px_16px_rgba(11,29,63,0.04)] active:scale-[0.99] transition-all duration-200 p-3 sm:p-3.5 flex flex-col relative overflow-hidden">
                
                {/* Main Row: Thumbnail + Copy + Circular Arrow */}
                <div className="flex items-center gap-3 sm:gap-3.5">
                  
                  {/* Left: Thumbnail Image Box */}
                  <div className="relative w-[78px] h-[78px] sm:w-[86px] sm:h-[86px] rounded-[14px] sm:rounded-[16px] overflow-hidden shrink-0 bg-[#F5F8FD] dark:bg-slate-800/80 border border-[#E5EEF9] dark:border-slate-700/60">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="90px"
                    />
                  </div>

                  {/* Middle: Title & Description */}
                  <div className="flex flex-col text-left flex-1 min-w-0 pr-1">
                    <h3 className="font-extrabold text-[15px] sm:text-[16px] text-[#0B1D3F] dark:text-white leading-[1.2] tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11.5px] sm:text-[12px] text-[#64748B] dark:text-slate-300 font-normal leading-[1.4] line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Circular Arrow Action Button */}
                  <div
                    className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full ${item.arrowBg} ${item.arrowText} dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                  </div>

                </div>

                {/* Bottom Left Colored Accent Stripe */}
                <div 
                  className="w-10 h-1 rounded-full mt-2.5 ml-1"
                  style={{ backgroundColor: item.accentColor }}
                />

              </div>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            PAGINATION DOTS (Matching Reference: 1 Pill + 2 Dots)
            ══════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center gap-1.5 mt-6 sm:mt-8 md:mt-10">
          <div className="w-5 sm:w-6 h-2 rounded-full bg-[#0A5CFF]" />
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

      </div>
    </section>
  );
}
