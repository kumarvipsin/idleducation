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
}

const resources: ResourceItem[] = [
  {
    id: "revision-notes",
    title: "Revision Notes",
    description: "Get easy-to-revise notes for important topics and concepts.",
    href: "/resources/notes",
    imageUrl: "/notes.jpg",
    imageAlt: "Revision Notes",
  },
  {
    id: "ncert-solutions",
    title: "Ncert Solutions",
    description: "Explore detailed NCERT solutions across subjects and classes.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.jpg",
    imageAlt: "Ncert Solutions",
  },
  {
    id: "previous-year-papers",
    title: "Previous Year Papers",
    description: "Access past exam papers for practice and preparation.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.jpg",
    imageAlt: "Previous Year Papers",
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
          <h2 className="text-[24px] sm:text-[30px] md:text-[38px] font-[720] tracking-[-0.02em] text-[#062B67] dark:text-white leading-[1.15] whitespace-nowrap">
            Study{' '}
            <span className="text-[#155EEF] dark:text-blue-400">
              Resources
            </span>
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
              <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[18px] lg:rounded-[20px] border border-[#E0EAFF] dark:border-slate-800 shadow-[0_2px_12px_rgba(6,43,103,0.04)] hover:shadow-[0_8px_24px_rgba(6,43,103,0.08)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative">

                {/* Text Content — top left */}
                <div className="pt-6 px-6 lg:pt-7 lg:px-7 pb-0 flex flex-col items-start text-left z-10 relative">
                  {/* Heading */}
                  <h3 className="text-[20px] lg:text-[22px] font-bold text-[#062B67] dark:text-white leading-[1.2] tracking-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13.5px] lg:text-[14px] text-[#64748B] dark:text-slate-400 font-normal leading-[1.5] mt-2 max-w-[85%]">
                    {item.description}
                  </p>

                  {/* CTA: Explore → */}
                  <div className="inline-flex items-center gap-1.5 text-[13.5px] lg:text-[14px] font-semibold text-[#155EEF] group-hover:text-[#0047CC] dark:text-blue-400 mt-3 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Illustration — 100% left, 100% right, 100% bottom */}
                <div className="relative w-full h-[170px] lg:h-[185px] mt-auto">
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    fill
                    className="object-contain object-bottom transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1280px) 33vw, 420px"
                    priority
                  />
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
              <div className="bg-white dark:bg-slate-900 rounded-[16px] border border-[#E0EAFF] dark:border-slate-800 shadow-[0_2px_10px_rgba(6,43,103,0.04)] active:scale-[0.99] transition-all duration-200 px-4 py-4 relative overflow-hidden flex flex-row items-center min-h-[110px]">

                {/* Left: Text & CTA */}
                <div className="flex flex-col items-start text-left max-w-[60%] sm:max-w-[65%] z-10 relative">
                  <h3 className="font-bold text-[16px] sm:text-[17px] text-[#062B67] dark:text-white leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-[#64748B] dark:text-slate-400 font-normal leading-[1.4] mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Explore Link */}
                  <div className="inline-flex items-center gap-1 text-[13px] sm:text-[13.5px] font-semibold text-[#155EEF] dark:text-blue-400 mt-2 group-active:text-[#0047CC]">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>

                {/* Right: Illustration — 100% right, 100% bottom */}
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
