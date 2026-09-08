'use client';

import React, { useState, useMemo } from 'react';
import type { TTopperTestimonial } from '@/app/actions/types';
import { TopperStoryCard } from '@/components/landing/topper-story-card';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactModal } from '@/components/contact-modal';
import { AdmissionModal } from '@/components/admission-modal';

interface IdlStarsClientProps {
  initialTestimonials: TTopperTestimonial[];
}

const FILTER_OPTIONS = [
  "All",
  "CBSE",
  "Class 10",
  "Class 12",
  "JEE",
  "NEET",
] as const;

type FilterType = typeof FILTER_OPTIONS[number];

export function IdlStarsClient({ initialTestimonials }: IdlStarsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);

  // Client-side filtering logic: matches category AND search term
  const filteredTestimonials = useMemo(() => {
    if (!initialTestimonials || initialTestimonials.length === 0) return [];

    const query = searchTerm.trim().toLowerCase();

    return initialTestimonials.filter((item) => {
      // 1. Category match
      let matchesCategory = true;
      if (activeFilter !== "All") {
        const target = `${item.studentClass || ''} ${item.studentName || ''} ${item.achievement || ''} ${item.quote || ''}`.toLowerCase();
        if (activeFilter === "CBSE") matchesCategory = target.includes("cbse") || target.includes("board");
        else if (activeFilter === "Class 10") matchesCategory = target.includes("10") || target.includes("x");
        else if (activeFilter === "Class 12") matchesCategory = target.includes("12") || target.includes("xii");
        else if (activeFilter === "JEE") matchesCategory = target.includes("jee") || target.includes("iit") || target.includes("mains") || target.includes("advanced");
        else if (activeFilter === "NEET") matchesCategory = target.includes("neet") || target.includes("medical");
      }

      // 2. Search query match
      let matchesSearch = true;
      if (query) {
        const searchPool = `${item.studentName || ''} ${item.studentClass || ''} ${item.achievement || ''} ${item.quote || ''}`.toLowerCase();
        matchesSearch = searchPool.includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [initialTestimonials, activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 sm:pb-20 pt-6 sm:pt-8" data-page="idl-stars">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">

        {/* ── Student Stories Trust / Community Banner (Background Color & Lighting Polish) ── */}
        <div className="relative rounded-[16px] sm:rounded-[18px] overflow-hidden mb-6 sm:mb-8 bg-[linear-gradient(115deg,#06163A_0%,#092254_36%,#0D2C6D_72%,#143884_100%)] px-6 py-6 sm:px-8 sm:py-7 md:px-10 md:py-8 shadow-[0_8px_30px_-6px_rgba(6,22,58,0.4)] border border-blue-400/[0.16]">

          {/* Primary Atmospheric Glow (Soft royal blue sheen toward upper-right & right area) */}
          <div className="pointer-events-none absolute -top-20 -right-12 w-[380px] sm:w-[460px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22)_0%,rgba(29,78,216,0.1)_45%,transparent_70%)] blur-[55px]" />

          {/* Secondary Blue Light (Faint depth highlight behind the right-side CTA area) */}
          <div className="pointer-events-none absolute bottom-0 right-8 sm:right-16 w-[240px] sm:w-[280px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] blur-[40px]" />

          {/* Subtle Journey Geometry Texture (Ultra-low opacity 5% for authentic depth) */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute right-0 top-0 h-full w-[45%] opacity-[0.05] overflow-hidden select-none"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <path
              d="M15,185 C75,135 125,75 195,50 C240,32 270,60 295,90"
              stroke="#93C5FD"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            <circle cx="80" cy="130" r="2.5" fill="#93C5FD" />
            <circle cx="155" cy="76" r="2.5" fill="#BFDBFE" />
            <circle cx="225" cy="52" r="3" fill="#93C5FD" />
            <circle cx="290" cy="85" r="3.5" fill="#BFDBFE" />
          </svg>

          {/* Main Two-Column Layout (Stacked on Mobile, Balanced Two-Column on Desktop) */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6 md:gap-8">
            
            {/* LEFT COLUMN: Hero Number + Headings + Supporting Copy + Community Metadata (45-55% width) */}
            <div className="w-full md:max-w-[55%] flex flex-col text-left">
              {/* 1. Hero Number (Dominant Visual Anchor, IDL Orange, Bold, No Gradient) */}
              <span className="text-[36px] sm:text-[44px] md:text-[50px] font-black text-[#F59E0B] tracking-tight leading-none">
                1000+
              </span>

              {/* 2. Primary Heading (Strong White Typography, Visually Connected) */}
              <h2 className="text-[20px] sm:text-[23px] md:text-[25px] font-bold text-white tracking-tight leading-snug mt-2">
                Students &amp; Growing
              </h2>

              {/* 3. Supporting Description (Muted White / Blue-Grey, max 2 lines desktop) */}
              <p className="text-[13px] sm:text-[14px] text-slate-300 font-normal leading-relaxed max-w-[460px] mt-2.5">
                Every student has a story.
                <br className="hidden sm:inline" /> Every journey inspires the next.
              </p>

              {/* 4. Micro Metadata Label (Restrained Uppercase Styling) */}
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-400 uppercase mt-3.5">
                <span>REAL STUDENTS</span>
                <span className="text-slate-500/60">·</span>
                <span>REAL JOURNEYS</span>
                <span className="text-slate-500/60">·</span>
                <span>REAL STORIES</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Share CTA (Mobile: Left-aligned, content width, refined green tint; Desktop: Vertically Centered IDL green) */}
            <div className="w-full md:w-auto shrink-0 flex items-center justify-start md:justify-end md:self-center pt-1 md:pt-0">
              <a
                href={`https://api.whatsapp.com/send?phone=918860040010&text=${encodeURIComponent(
                  "Hi IDL Education! 🎉 I'd like to share my success story and video with you. Please add it to the Stories of our Brightest Stars showcase!\n\nName:\nClass / Course:\nMy Achievement / Story:"
                )}`}
                onClick={(e) => {
                  e.preventDefault();
                  const targetUrl = `https://api.whatsapp.com/send?phone=918860040010&text=${encodeURIComponent(
                    "Hi IDL Education! 🎉 I'd like to share my success story and video with you. Please add it to the Stories of our Brightest Stars showcase!\n\nName:\nClass / Course:\nMy Achievement / Story:"
                  )}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1DB954]/15 hover:bg-[#1DB954]/25 text-[#25D366] border border-[#1DB954]/35 md:bg-[#1DB954] md:hover:bg-[#189a46] md:text-white md:border-white/10 md:shadow-[0_2px_8px_rgba(29,185,84,0.2)] md:hover:shadow-[0_4px_12px_rgba(29,185,84,0.28)] font-semibold text-[12.5px] sm:text-[13.5px] md:text-[14px] h-[38px] sm:h-10 md:h-11 px-4 sm:px-5 md:px-6 rounded-[10px] transition-all duration-150 cursor-pointer w-fit md:w-[230px] shrink-0"
                aria-label="Share your IDL story on WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.776.979-.951 1.179-.175.2-.351.226-.651.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.131-.612.136-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.12 3.237 5.136 4.54.717.31 1.277.495 1.713.633.72.228 1.375.196 1.893.118.577-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.275-.2-.576-.35z" />
                  <path d="M12.04 2c-5.464 0-9.91 4.446-9.91 9.91 0 1.75.457 3.456 1.325 4.96L2 22l5.253-1.378c1.454.793 3.09 1.21 4.787 1.21 5.464 0 9.91-4.446 9.91-9.91 0-5.464-4.446-9.91-9.91-9.91zm0 18.15c-1.477 0-2.926-.397-4.19-1.148l-.3-.178-3.116.818.832-3.037-.195-.312c-.825-1.314-1.261-2.836-1.261-4.403 0-4.542 3.696-8.238 8.24-8.238 4.543 0 8.24 3.696 8.24 8.238 0 4.543-3.697 8.24-8.24 8.24z" />
                </svg>
                <span>Share Your IDL Story →</span>
              </a>
            </div>

          </div>
        </div>

        {/* ── Filter Pills & Search Control Row (Single Unified Row on Mobile & Desktop) ── */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-3 mb-5 sm:mb-6 min-h-[38px] max-w-full">
          
          {/* LEFT: Horizontally Scrollable Category Filter Pills */}
          <div className="flex-1 min-w-0 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none flex items-center gap-1.5">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setActiveVideoId(null);
                }}
                className={cn(
                  "px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none leading-none shrink-0",
                  activeFilter === filter
                    ? "bg-[#0B1F4B] text-white shadow-2xs dark:bg-[#1D4ED8]"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* RIGHT: Search Control (Always Visually Anchored to the Right) */}
          <div className="shrink-0 flex items-center">
            <div 
              className={cn(
                "flex items-center h-9 sm:h-[38px] transition-all duration-200 ease-out rounded-full box-border",
                isSearchOpen || searchTerm
                  ? "w-44 min-[420px]:w-52 sm:w-64 px-2.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs"
                  : "w-9 sm:w-[38px] justify-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#1D4ED8] transition-colors shrink-0 cursor-pointer border-none outline-none focus:outline-none"
                aria-label="Search student stories"
              >
                <Search className="h-4 w-4" />
              </button>
              
              {(isSearchOpen || searchTerm) && (
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => { if (!searchTerm) setIsSearchOpen(false); }}
                  className="flex-1 min-w-0 h-7 border-0 shadow-none outline-none focus:outline-none text-xs placeholder:text-muted-foreground/70 bg-transparent px-1.5 leading-none text-slate-800 dark:text-slate-100"
                  autoFocus
                />
              )}

              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => { setSearchTerm(''); setIsSearchOpen(false); }} 
                  className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0 cursor-pointer border-none outline-none"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ── Video Short Cards Grid ── */}
        {filteredTestimonials.length > 0 ? (
          <div className="grid grid-cols-2 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {filteredTestimonials.map((testimonial, index) => {
              const cardId = testimonial.id || testimonial.videoId || String(index);
              const isPlaying = activeVideoId === cardId;

              return (
                <TopperStoryCard
                  key={cardId}
                  testimonial={testimonial}
                  isPlaying={isPlaying}
                  onPlay={() => setActiveVideoId(cardId)}
                  onClose={() => setActiveVideoId(null)}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6">
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
              {searchTerm
                ? `No stories found matching "${searchTerm}".`
                : `No video stories found for category "${activeFilter}".`}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
                setIsSearchOpen(false);
              }}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              Reset filters &amp; search
            </button>
          </div>
        )}

      </div>

      {/* Modals if needed */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
    </div>
  );
}
