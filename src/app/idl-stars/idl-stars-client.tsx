'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { TTopperTestimonial } from '@/app/actions/types';
import { TopperStoryCard } from '@/components/landing/topper-story-card';
import { Search, X, Sparkles, Star, Users } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const totalCount = initialTestimonials?.length || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" data-page="idl-stars">
      
      {/* ════════════════════════════════════════════════════════════════════════
          HERO BANNER — Premium navy gradient with animated ambient orbs
          Matches the landing page's deep-navy brand palette (#062B67 → #0B1F4B)
         ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#031534_0%,#062B67_30%,#0D2C6D_60%,#143884_100%)]">
        
        {/* Animated ambient orbs — depth & premium feel */}
        <div className="pointer-events-none absolute -top-32 -right-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,transparent_65%)] blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-16 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.1)_0%,transparent_60%)] blur-[70px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(29,78,216,0.12)_0%,transparent_70%)] blur-[60px]" />

        {/* Subtle geometric texture (journey path) */}
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute right-0 top-0 h-full w-[50%] opacity-[0.04] overflow-hidden select-none"
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

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl py-10 sm:py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">

            {/* LEFT — Hero messaging */}
            <div className="w-full md:max-w-[58%] flex flex-col text-left">
              {/* Eyebrow badge */}
              <div className={cn(
                "inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm mb-4 transition-all duration-700",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}>
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-[11px] sm:text-xs font-semibold text-white/80 tracking-wide">Stories of our Brightest Stars</span>
              </div>

              {/* Hero number — dominant visual anchor */}
              <div className={cn(
                "flex items-baseline gap-3 mb-2 transition-all duration-700 delay-100",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}>
                <span className="text-[42px] sm:text-[52px] md:text-[60px] font-black text-[#F59E0B] tracking-tight leading-none">
                  {totalCount > 0 ? `${totalCount}+` : '1000+'}
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 tracking-tight">
                  Student Stories
                </span>
              </div>

              {/* Supporting description */}
              <p className={cn(
                "text-[13px] sm:text-[14px] md:text-[15px] text-slate-300/90 font-normal leading-relaxed max-w-[520px] mb-4 transition-all duration-700 delay-200",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}>
                Every student has a unique story. Real journeys, real achievements, 
                real inspiration — straight from the IDL Education community.
              </p>

              {/* Stats row */}
              <div className={cn(
                "flex items-center flex-wrap gap-4 sm:gap-6 transition-all duration-700 delay-300",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium leading-none mb-0.5">Real Students</p>
                    <p className="text-xs font-bold text-white leading-none">Verified Stories</p>
                  </div>
                </div>
                <div className="w-px h-6 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium leading-none mb-0.5">Growing Daily</p>
                    <p className="text-xs font-bold text-white leading-none">Community Driven</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Share CTA */}
            <div className={cn(
              "w-full md:w-auto shrink-0 flex items-center justify-start md:justify-end md:self-center transition-all duration-700 delay-400",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}>
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
                className="group inline-flex items-center justify-center gap-2.5 bg-[#16A34A] hover:bg-[#15803d] active:scale-[0.98] text-white font-semibold text-xs sm:text-[13px] md:text-sm h-11 md:h-12 px-5 sm:px-6 md:px-7 rounded-xl shadow-[0_4px_16px_-3px_rgba(22,163,74,0.35)] hover:shadow-[0_6px_20px_-3px_rgba(22,163,74,0.45)] transition-all duration-200 cursor-pointer w-fit"
                aria-label="Share your IDL story on WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.776.979-.951 1.179-.175.2-.351.226-.651.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.131-.612.136-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.12 3.237 5.136 4.54.717.31 1.277.495 1.713.633.72.228 1.375.196 1.893.118.577-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.275-.2-.576-.35z" />
                  <path d="M12.04 2c-5.464 0-9.91 4.446-9.91 9.91 0 1.75.457 3.456 1.325 4.96L2 22l5.253-1.378c1.454.793 3.09 1.21 4.787 1.21 5.464 0 9.91-4.446 9.91-9.91 0-5.464-4.446-9.91-9.91-9.91zm0 18.15c-1.477 0-2.926-.397-4.19-1.148l-.3-.178-3.116.818.832-3.037-.195-.312c-.825-1.314-1.261-2.836-1.261-4.403 0-4.542 3.696-8.238 8.24-8.238 4.543 0 8.24 3.696 8.24 8.238 0 4.543-3.697 8.24-8.24 8.24z" />
                </svg>
                <span>Share Your IDL Story →</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA — Filter bar + Grid
         ════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#F8FAFD] dark:bg-slate-950 pb-16 sm:pb-20">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">

          {/* ── Filter Pills & Search — Sticky bar with glassmorphism ── */}
          <div className="sticky top-0 z-40 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 bg-[#F8FAFD]/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-3 min-h-[44px] sm:min-h-[48px]">
            
              {/* LEFT: Horizontally Scrollable Category Filter Pills */}
              <div className="flex-1 min-w-0 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none flex items-center gap-1.5 sm:gap-2">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setActiveFilter(filter);
                      setActiveVideoId(null);
                    }}
                    className={cn(
                      "px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none leading-none shrink-0",
                      activeFilter === filter
                        ? "bg-[#062B67] text-white shadow-[0_2px_8px_-2px_rgba(6,43,103,0.4)] dark:bg-[#1D4ED8] dark:shadow-[0_2px_8px_-2px_rgba(29,78,216,0.4)]"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* RIGHT: Search Control */}
              <div className="shrink-0 flex items-center">
                <div 
                  className={cn(
                    "flex items-center h-[40px] sm:h-[42px] transition-all duration-200 ease-out rounded-full box-border",
                    isSearchOpen || searchTerm
                      ? "w-44 min-[420px]:w-52 sm:w-64 px-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm"
                      : "w-[40px] sm:w-[42px] justify-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#062B67] dark:text-slate-400 dark:hover:text-white transition-colors shrink-0 cursor-pointer border-none outline-none focus:outline-none"
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
          </div>

          {/* ── Results count ── */}
          <div className="flex items-center justify-between mt-5 sm:mt-6 mb-4 sm:mb-5">
            <p className="text-[13px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {filteredTestimonials.length === totalCount 
                ? <span>Showing all <strong className="text-[#062B67] dark:text-white">{totalCount}</strong> stories</span>
                : <span>Showing <strong className="text-[#062B67] dark:text-white">{filteredTestimonials.length}</strong> of {totalCount} stories</span>
              }
            </p>
            {(activeFilter !== "All" || searchTerm) && (
              <button
                type="button"
                onClick={() => { setActiveFilter("All"); setSearchTerm(''); setIsSearchOpen(false); }}
                className="text-xs font-semibold text-[#1D4ED8] dark:text-blue-400 hover:text-[#062B67] dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* ── Video Story Cards Grid ── */}
          {filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-2 min-[480px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {filteredTestimonials.map((testimonial, index) => {
                const cardId = testimonial.id || testimonial.videoId || String(index);
                const isPlaying = activeVideoId === cardId;

                return (
                  <div
                    key={cardId}
                    className={cn(
                      "transition-all duration-500 ease-out",
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: mounted ? `${Math.min(index * 60, 600)}ms` : '0ms' }}
                  >
                    <TopperStoryCard
                      testimonial={testimonial}
                      isPlaying={isPlaying}
                      onPlay={() => setActiveVideoId(cardId)}
                      onClose={() => setActiveVideoId(null)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Empty State — Premium styled ── */
            <div className="py-20 sm:py-24 text-center space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                <Search className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="space-y-1.5">
                <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">
                  No stories found
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-sm mx-auto">
                  {searchTerm
                    ? `No stories matching "${searchTerm}" in the current category.`
                    : `No video stories found for "${activeFilter}" category.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("All");
                  setSearchTerm("");
                  setIsSearchOpen(false);
                }}
                className="inline-flex items-center gap-1.5 mt-2 px-5 py-2 rounded-lg bg-[#062B67] hover:bg-[#0B1F4B] text-white text-sm font-semibold shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
              >
                Reset filters & search
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Modals if needed */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
    </div>
  );
}
