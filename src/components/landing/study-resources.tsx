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
    description: "Get easy-to-revise notes for important topics and concepts.",
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
    description: "Explore detailed NCERT solutions across subjects and classes.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.jpg",
    imageAlt: "NCERT Solutions",
    accentColor: "#F59E0B",
    lightBg: "bg-gradient-to-b from-[#FFF9EE] to-[#FFF1D6]",
    arrowBg: "bg-[#FFF7ED]",
    arrowText: "text-[#F59E0B]",
  },
  {
    id: "previous-year-papers",
    title: "Previous year papers",
    description: "Access past exam papers for practice and preparation.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.jpg",
    imageAlt: "Previous year papers",
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
      aria-label="Study Resources"
      className="w-full pt-14 sm:pt-16 md:pt-18 pb-10 sm:pb-12 md:pb-14 scroll-mt-24 bg-white dark:bg-slate-950 border-t border-[#E2ECF8] dark:border-slate-800/80 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1260px] relative z-10">

        {/* ══════════════════════════════════════════════════
            HEADER AREA: "Study Resources" (Matched to IDL Stars scale & boldness)
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-7 sm:mb-8 md:mb-9">
          <h2 className="text-2xl sm:text-[28px] md:text-[32px] font-bold tracking-tight text-[#0A1E42] dark:text-white leading-[1.2] whitespace-nowrap">
            Study{' '}
            <span className="text-[#1D4ED8] dark:text-blue-400">
              Resources
            </span>
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════
            DESKTOP VIEW: 3 Cards (Width +5%, Height -10%, Image 100% Left/Right/Bottom)
            ══════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block h-full focus:outline-none"
            >
              <div className="h-[345px] lg:h-[355px] flex flex-col justify-between bg-white dark:bg-slate-900 rounded-[22px] lg:rounded-[24px] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_28px_rgba(11,29,63,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                
                {/* Top Content: Text scaled 5% smaller */}
                <div className="pt-6 px-6 lg:pt-6.5 lg:px-6.5 pb-0 flex flex-col items-start text-left z-10 relative">
                  {/* 1. Heading (5% smaller) */}
                  <h3 className="text-[21.5px] lg:text-[23px] font-[650] text-[#0F172A] dark:text-white leading-[1.2] tracking-tight">
                    {item.title}
                  </h3>

                  {/* 2. Description (5% smaller) */}
                  <p className="text-[14px] lg:text-[14.5px] text-[#64748B] dark:text-slate-400 font-normal leading-[1.45] mt-2 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* 3. Explore link (5% smaller) */}
                  <div className="inline-flex items-center gap-1.5 text-[14px] lg:text-[14.5px] font-semibold text-[#0A5CFF] group-hover:text-[#0047CC] dark:text-blue-400 mt-3 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* 4. Illustration: 100% Left, 100% Right, 100% Bottom */}
                <div className="relative w-full h-[180px] lg:h-[190px] mt-auto overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-bottom transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1280px) 33vw, 420px"
                    priority
                  />
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            MOBILE VIEW: Horizontal Compact Cards
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col md:hidden space-y-3.5 max-w-[480px] mx-auto w-full">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block w-full focus:outline-none"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[24px] border border-[#E2E8F0] dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all duration-200 p-5 relative overflow-hidden flex flex-col justify-center min-h-[126px]">
                
                {/* Left: Text & CTA */}
                <div className="flex flex-col items-start text-left max-w-[62%] sm:max-w-[65%] z-10 relative">
                  <h3 className="font-bold text-[17px] sm:text-[18px] text-[#0F172A] dark:text-white leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] sm:text-[14px] text-[#64748B] dark:text-slate-400 font-normal leading-snug mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Explore Link */}
                  <div className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-[#0A5CFF] dark:text-blue-400 mt-2.5 group-active:text-[#0047CC]">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
                  </div>
                </div>

                {/* Right: Illustration Graphic (100% Right & 100% Bottom) */}
                <div className="absolute right-0 bottom-0 w-[140px] h-[104px] min-[390px]:w-[155px] min-[390px]:h-[112px] pointer-events-none z-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-contain object-right-bottom"
                    sizes="160px"
                    priority
                  />
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
