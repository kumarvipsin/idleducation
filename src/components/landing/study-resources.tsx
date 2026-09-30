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
  glowGradient: string;
}

const resources: ResourceItem[] = [
  {
    id: "revision-notes",
    title: "NCERT Notes",
    description: "Get easy-to-revise notes for important topics and concepts.",
    href: "/resources/notes",
    imageUrl: "/notes.jpg",
    imageAlt: "NCERT Notes",
    glowGradient: "radial-gradient(ellipse at 50% 85%, rgba(199,210,254,0.45) 0%, rgba(214,255,228,0.2) 60%, transparent 80%)",
  },
  {
    id: "ncert-solutions",
    title: "NCERT Solutions",
    description: "Explore detailed NCERT solutions across subjects and classes.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.jpg",
    imageAlt: "NCERT Solutions",
    glowGradient: "radial-gradient(ellipse at 50% 85%, rgba(186,230,253,0.5) 0%, rgba(214,255,228,0.2) 60%, transparent 80%)",
  },
  {
    id: "previous-year-papers",
    title: "Previous Year Papers (PYQ)",
    description: "Access past exam papers for practice and preparation.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.jpg",
    imageAlt: "Previous Year Papers (PYQ)",
    glowGradient: "radial-gradient(ellipse at 50% 85%, rgba(167,243,208,0.5) 0%, rgba(214,255,228,0.2) 60%, transparent 80%)",
  },
];

export function StudyResources() {
  return (
    <section
      id="free-learning-resources"
      aria-label="Study Resources"
      className="w-full pt-2 sm:pt-3 md:pt-4 pb-10 sm:pb-12 md:pb-14 scroll-mt-24 bg-white dark:bg-slate-950 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1260px] relative z-10">

        {/* ══════════════════════════════════════════════════
            HEADER: "Study Resources"
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-7 md:mb-8">
          {/* Eyebrow — bullet point */}
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-3.5">
            <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
            <span className="text-[15px] sm:text-[17px] font-[900] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Study </span>
              <span className="text-[#155EEF] dark:text-blue-400">Resources</span>
            </span>
          </div>

          {/* Description heading */}
          <h2 className="text-[15px] min-[360px]:text-[16.5px] min-[400px]:text-[18px] sm:text-[28px] md:text-[36px] font-[750] tracking-[-0.02em] leading-[1.2] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Everything You Need.{' '}</span>
            <span className="text-[#155EEF] dark:text-blue-400">All in One Place.</span>
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════
            DESKTOP: 3 Cards in horizontal row
            ══════════════════════════════════════════════════ */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block h-full focus:outline-none"
            >
              <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[18px] lg:rounded-[20px] border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_10px_-2px_rgba(6,43,103,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(6,43,103,0.06)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative">

                {/* Text Content — top left with clean consistent alignment */}
                <div className="pt-6 px-6 lg:pt-7 lg:px-7 pb-0 flex flex-col items-start text-left z-10 relative">
                  {/* Heading — Preserved exact font size & weight, softened navy contrast & relaxed tracking */}
                  <h3 
                    className="text-[18px] lg:text-[18.9px] font-black text-[#072458] dark:text-white leading-[1.3] tracking-[-0.012em] whitespace-nowrap" 
                    style={{ 
                      fontWeight: 900, 
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description — Preserved exact font size & weight, improved line-height & softer dark-gray tone */}
                  <p 
                    className="text-[13.6px] lg:text-[13.8px] text-[#4B586E] dark:text-slate-300 font-bold leading-[1.55] mt-2.5 max-w-[92%]" 
                    style={{ 
                      fontWeight: 700, 
                    }}
                  >
                    {item.description}
                  </p>

                  {/* CTA: Explore → */}
                  <div className="inline-flex items-center gap-1.5 text-[13.5px] lg:text-[14px] font-semibold text-[#155EEF] group-hover:text-[#062B67] dark:text-blue-400 mt-3.5 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Dedicated Illustration Visual Area */}
                <div className="relative w-full h-[170px] lg:h-[185px] mt-auto overflow-hidden">
                  
                  {/* Layer 1: Soft Colored Background & Atmospheric Glow */}
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#D6FFE4]/90 via-[#EDFAF2]/60 to-transparent" />
                    <div 
                      className="absolute inset-0 opacity-80 dark:opacity-30" 
                      style={{ background: item.glowGradient }} 
                    />
                  </div>

                  {/* Layer 2: Illustration */}
                  <div 
                    className="relative w-full h-full flex items-end justify-center transform origin-bottom md:scale-[0.78] group-hover:md:scale-[0.80] transition-transform duration-300 ease-out"
                    style={{
                      maskImage: 'radial-gradient(ellipse 90% 90% at 50% 90%, black 65%, rgba(0,0,0,0.85) 80%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 90%, black 65%, rgba(0,0,0,0.85) 80%, transparent 100%)',
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      className="object-contain object-bottom"
                      sizes="(max-width: 1280px) 33vw, 420px"
                      priority
                    />
                  </div>

                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            MOBILE: Stacked vertical cards
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col md:hidden space-y-3 max-w-[480px] mx-auto w-full">
          {resources.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block w-full focus:outline-none"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[16px] border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_8px_-2px_rgba(6,43,103,0.03)] active:scale-[0.99] transition-all duration-200 px-4 py-3.5 relative overflow-hidden flex flex-row items-center min-h-[110px]">

                {/* Left: Text & CTA */}
                <div className="flex flex-col items-start text-left w-full z-10 relative">
                  {/* Heading — Preserved exact mobile size & weight, natural font rendering */}
                  <h3 
                    className="text-[16.5px] min-[380px]:text-[17.5px] font-black text-[#072458] dark:text-white leading-[1.28] tracking-[-0.012em] whitespace-nowrap" 
                    style={{ 
                      fontWeight: 900,
                    }}
                  >
                    {item.title}
                  </h3>
                  {/* Description — Preserved exact mobile size & weight, improved line-height & softer tone */}
                  <p 
                    className="text-[12.8px] min-[380px]:text-[13.4px] text-[#4B586E] dark:text-slate-300 font-bold leading-[1.5] mt-1.5 line-clamp-2 max-w-[62%] sm:max-w-[66%]" 
                    style={{ 
                      fontWeight: 700,
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Explore Link */}
                  <div className="inline-flex items-center gap-1 text-[13px] sm:text-[13.5px] font-semibold text-[#155EEF] dark:text-blue-400 mt-2.5 group-active:text-[#062B67]">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>

                {/* Right: Illustration */}
                <div className="absolute right-0 bottom-0 w-[120px] min-[390px]:w-[135px] h-[95px] min-[390px]:h-[100px] pointer-events-none z-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-contain object-right-bottom"
                    sizes="140px"
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
