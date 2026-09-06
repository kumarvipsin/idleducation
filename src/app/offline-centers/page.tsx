'use client';

import { Button } from "@/components/ui/button";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import React from 'react';

const centers = [
  {
    name: "Mukherjee Nagar",
    address: "Mukherjee Nagar, Delhi-110009",
    imageUrl: "/idlbranch.png",
    imageHint: "IDL Education branch building",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
  },
  {
    name: "Mangol Puri",
    address: "Mangol Puri, Delhi-110083",
    imageUrl: "/idlbranch.png",
    imageHint: "IDL Education branch building",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
  },
  {
    name: "Budh Vihar",
    address: "Budh Vihar, Delhi-110086",
    imageUrl: "/idlbranch.png",
    imageHint: "IDL Education branch building",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
  },
  {
    name: "Krishan Vihar",
    address: "Krishan Vihar, Delhi-110086",
    imageUrl: "/idlbranch.png",
    imageHint: "IDL Education branch building",
    mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
  }
];

export default function OfflineCentersPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-background relative selection:bg-[#102A68]/10 selection:text-[#102A68]">

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-14 sm:pb-16 relative z-10">
        
        {/* TOP MAP HERO: Balanced Editorial Copy & 3D Map Artwork */}
        <div className="relative rounded-[20px] sm:rounded-[24px] bg-white dark:bg-slate-900 pt-2 sm:pt-4 pb-3 sm:pb-5 px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
            {/* Left Copy: Strong Navy, Orange Accent, Clean Hierarchy */}
            <div className="lg:col-span-5 text-left space-y-2.5 sm:space-y-3.5 pl-1 sm:pl-3 lg:pl-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
                <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-[#102A68] dark:text-blue-200">
                  DELHI NETWORK
                </span>
              </div>

              {/* Main Headline: Dominant, Two Balanced Lines, Cohesive Navy Weight */}
              <h1 className="text-[30px] sm:text-[40px] lg:text-[46px] font-black text-[#102A68] dark:text-white tracking-tight leading-[1.08]">
                <span className="block">4 CENTRES.</span>
                <span className="block">ONE COMMITMENT.</span>
              </h1>

              {/* Supporting Subheading: Clean Medium/Semibold Weight, Restrained Orange Accent */}
              <p className="text-[15px] sm:text-[18px] lg:text-[19px] font-medium sm:font-semibold text-slate-600 dark:text-slate-300 pt-0.5 leading-snug">
                Quality Education Across{' '}
                <span className="text-[#FF6B00]">Delhi</span>
              </p>
            </div>

            {/* Right Map Visual: Dominant 3D Delhi Artwork */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="relative w-full max-w-[680px] flex items-center justify-center">
                <Image
                  src="/branchmap1.png"
                  alt="IDL Offline Centres Map - 4 Centres across Delhi"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-contain max-h-[460px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* CENTRES SECTION INTRO: Centered, Compact Highlighted Tag with Short Bold Description */}
        <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 flex flex-col items-center justify-center text-center">
          <h2 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-[14px] sm:text-[15.5px] font-bold text-[#102A68] dark:text-white tracking-tight shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
            <span>Our Learning Centres in</span>
            <span className="text-[#2563EB] dark:text-blue-400 font-extrabold">Delhi</span>
          </h2>
          <p className="text-[12px] sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-2 tracking-wide">
            Purpose-built spaces for focused learning.
          </p>
        </div>

        {/* CENTRE CARDS GRID: 4 equal-height cards on desktop, 2x2 on tablet, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
          {centers.map((center) => (
            <div
              key={center.name}
              className="group bg-white dark:bg-slate-900 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(16,42,104,0.05)] hover:shadow-[0_12px_28px_-6px_rgba(16,42,104,0.09)] hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col h-full overflow-hidden"
            >
              {/* Card Image Area: Consistent dimensions & rounded top */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={center.imageUrl}
                  alt={center.name}
                  data-ai-hint={center.imageHint}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Card Content: Fixed hierarchy with strictly equal height layout */}
              <div className="p-5 sm:p-5.5 flex-1 flex flex-col">
                {/* Centre Name */}
                <h3 className="text-[20px] sm:text-[21px] font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
                  {center.name}
                </h3>

                {/* Location Metadata */}
                <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 mt-2 min-h-[42px]">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#2563EB]/80" />
                  <p className="text-[14px] leading-snug font-normal">
                    {center.address}
                  </p>
                </div>

                {/* Card Actions: Primary + Secondary CTAs with clear hierarchy */}
                <div className="mt-auto pt-4.5 flex flex-col gap-2.5">
                  {/* Primary CTA: Visit Centre */}
                  <Button
                    asChild
                    className="w-full h-11 rounded-[8px] font-semibold text-[13.5px] bg-[#102A68] hover:bg-[#0B1E4B] text-white shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                  >
                    <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">
                      Visit Centre
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>

                  {/* Secondary CTA: Call Us */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 rounded-[8px] font-medium text-[13px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#102A68] dark:text-slate-200 border border-[#102A68]/20 dark:border-slate-700 hover:border-[#102A68]/45 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <a href="tel:8860040010">
                      <Phone className="w-3.5 h-3.5 opacity-70" />
                      Call Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

