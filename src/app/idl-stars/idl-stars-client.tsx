'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TTestimonial } from '@/app/actions/types';
import { GcsImage } from '@/components/gcs-image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VideoModalDialogContent } from '@/components/ui/video-modal-dialog';
import { PlayCircle, Quote, Sparkles, ArrowRight, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { ContactModal } from '@/components/contact-modal';
import { AdmissionModal } from '@/components/admission-modal';

interface IdlStarsClientProps {
  initialTestimonials: TTestimonial[];
}

const FILTER_OPTIONS = [
  "All",
  "CBSE",
  "JEE",
  "NEET",
  "Classes 6–10",
  "Classes 11–12",
] as const;

type FilterType = typeof FILTER_OPTIONS[number];

function IdlStarCard({
  testimonial,
  onOpenVideo,
  onOpenDetail,
}: {
  testimonial: TTestimonial;
  onOpenVideo: (testimonial: TTestimonial) => void;
  onOpenDetail: (testimonial: TTestimonial) => void;
}) {
  return (
    <Card className="h-full w-full flex flex-col shadow-[0_4px_16px_-4px_rgba(11,31,75,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(11,31,75,0.12)] hover:-translate-y-1 transition-all duration-200 ease-out bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 group/card">
      <CardContent className="p-2.5 min-[360px]:p-3 sm:p-5 flex flex-col items-start h-full justify-between w-full">
        {/* Photo / Video Thumbnail Area (Visual emphasis ~55-60%) */}
        <div className="relative w-full aspect-[4/3] min-[360px]:aspect-square mb-2 min-[360px]:mb-2.5 sm:mb-4 rounded-lg min-[360px]:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">
          <GcsImage
            filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
            alt={testimonial.name}
            fill
            className="object-cover contrast-[1.02] transition-transform duration-300 ease-out group-hover/card:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />

          {/* White Circular Play Button (only rendered on photo if videoId exists) */}
          {testimonial.videoId && (
            <button
              type="button"
              onClick={() => onOpenVideo(testimonial)}
              className="absolute bottom-1.5 right-1.5 min-[360px]:bottom-2 min-[360px]:right-2 sm:bottom-3 sm:right-3 transition-all duration-200 active:scale-95 group-hover/card:scale-110 z-10 p-1 min-[360px]:p-1.5 sm:p-2 rounded-full bg-white text-[#1D4ED8] hover:text-[#0B1F4B] cursor-pointer shadow-md border border-slate-100"
              aria-label={`Watch ${testimonial.name}'s video story`}
            >
              <PlayCircle className="w-5 h-5 min-[360px]:w-6 min-[360px]:h-6 sm:w-8 sm:h-8 fill-[#1D4ED8] text-white" />
            </button>
          )}
        </div>

        {/* Student Name */}
        <h3 className="font-bold text-xs min-[360px]:text-sm sm:text-lg md:text-xl text-[#0B1F4B] dark:text-white tracking-tight leading-snug mb-1 truncate w-full text-left">
          {testimonial.name}
        </h3>

        {/* Score / Achievement Badge */}
        {testimonial.achievement && (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 min-[360px]:px-2 min-[360px]:py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-50/80 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-300 text-[9.5px] min-[360px]:text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 min-[360px]:mb-2 border border-blue-200/60 dark:border-blue-900/40 shrink-0 max-w-full">
            <Award className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 shrink-0" />
            <span className="truncate">{testimonial.achievement}</span>
          </div>
        )}

        {/* Testimonial Story Preview */}
        <div className="relative w-full flex-1 flex flex-col justify-between mt-auto space-y-1.5 min-[360px]:space-y-2 sm:space-y-3">
          <div className="flex items-start gap-1 min-[360px]:gap-1.5 sm:gap-2 w-full min-h-[36px] min-[360px]:min-h-[44px] sm:min-h-[80px]">
            <Quote className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-3.5 sm:h-3.5 text-[#1D4ED8] dark:text-blue-400 shrink-0 mt-0.5 sm:mt-1 stroke-[1.75]" />
            <blockquote className="text-[10.5px] min-[360px]:text-[11.5px] sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-tight min-[360px]:leading-snug sm:leading-relaxed text-left line-clamp-2 min-[360px]:line-clamp-3 sm:line-clamp-4 flex-1">
              {testimonial.testimonial}
            </blockquote>
          </div>

          {/* Read Full Story Button */}
          <div className="pt-1.5 min-[360px]:pt-2 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => onOpenDetail(testimonial)}
              className="text-[11px] min-[360px]:text-xs sm:text-sm font-bold text-[#1D4ED8] hover:text-[#0B1F4B] dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1 transition-colors cursor-pointer group/link"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 transition-transform duration-150 group-hover/link:translate-x-1" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IdlStarsClient({ initialTestimonials }: IdlStarsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Modals state
  const [selectedVideoTestimonial, setSelectedVideoTestimonial] = useState<TTestimonial | null>(null);
  const [selectedDetailTestimonial, setSelectedDetailTestimonial] = useState<TTestimonial | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);

  // Client-side filtering logic
  const filteredTestimonials = useMemo(() => {
    if (!initialTestimonials || initialTestimonials.length === 0) return [];
    if (activeFilter === "All") return initialTestimonials;

    return initialTestimonials.filter((item) => {
      const target = `${item.achievement || ''} ${item.name || ''} ${item.testimonial || ''}`.toLowerCase();
      if (activeFilter === "CBSE") return target.includes("cbse") || target.includes("board");
      if (activeFilter === "JEE") return target.includes("jee") || target.includes("iit") || target.includes("mains") || target.includes("advanced");
      if (activeFilter === "NEET") return target.includes("neet") || target.includes("medical");
      if (activeFilter === "Classes 6–10") return target.includes("6") || target.includes("7") || target.includes("8") || target.includes("9") || target.includes("10") || target.includes("foundation");
      if (activeFilter === "Classes 11–12") return target.includes("11") || target.includes("12") || target.includes("senior");
      return true;
    });
  }, [initialTestimonials, activeFilter]);

  const visibleStories = useMemo(() => {
    return filteredTestimonials.slice(0, visibleCount);
  }, [filteredTestimonials, visibleCount]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setVisibleCount(9);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 sm:pb-20 pt-6 sm:pt-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
        
        {/* Hero CTA Banner — IDL Stars Share Section */}
        <div className="relative rounded-[20px] overflow-hidden mb-5 sm:mb-8 bg-gradient-to-br from-[#0A1D45] via-[#0E2560] to-[#1A3D8A] px-5 py-5 sm:px-10 sm:py-9 shadow-[0_8px_28px_-8px_rgba(10,29,69,0.36),0_2px_8px_-3px_rgba(10,29,69,0.18)] border border-[#1a3570]/40">

          {/* === BACKGROUND LAYER: Smooth radial glow — no rectangular patches === */}
          {/* Broad soft blue glow — bottom-right corner only, very low opacity */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-[#3B6CE8]/12 blur-[60px]" />
          {/* Tiny warm glow near heading — left anchor, barely visible */}
          <div className="pointer-events-none absolute -top-8 -left-8 w-48 h-48 rounded-full bg-[#1D4ED8]/8 blur-[40px]" />

          {/* === ABSTRACT LEARNING JOURNEY SVG — DESKTOP: right side === */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute right-0 top-0 h-full w-[48%] opacity-[0.07] hidden sm:block"
            viewBox="0 0 300 180"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Journey path 1 — main flowing arc */}
            <path
              d="M30,160 C70,120 110,60 180,40 C230,24 270,50 290,80"
              stroke="#60A5FA"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            {/* Journey path 2 — secondary smaller arc below */}
            <path
              d="M20,170 C80,145 140,110 210,95 C250,85 280,100 300,115"
              stroke="#93C5FD"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeDasharray="3 8"
            />
            {/* Small nodes — milestone dots along path 1 */}
            <circle cx="70" cy="118" r="2.5" fill="#60A5FA" />
            <circle cx="70" cy="118" r="5" stroke="#60A5FA" strokeWidth="0.5" />
            <circle cx="145" cy="68" r="2" fill="#93C5FD" />
            <circle cx="145" cy="68" r="4.5" stroke="#93C5FD" strokeWidth="0.5" />
            <circle cx="220" cy="44" r="2.5" fill="#60A5FA" />
            <circle cx="220" cy="44" r="5.5" stroke="#60A5FA" strokeWidth="0.5" />
            {/* Endpoint node — destination */}
            <circle cx="285" cy="76" r="3.5" fill="#93C5FD" />
            <circle cx="285" cy="76" r="7" stroke="#93C5FD" strokeWidth="0.6" />
            {/* Small connector tick marks */}
            <line x1="108" y1="58" x2="114" y2="65" stroke="#60A5FA" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="178" y1="40" x2="182" y2="48" stroke="#60A5FA" strokeWidth="0.7" strokeLinecap="round" />
          </svg>

          {/* === ABSTRACT LEARNING JOURNEY SVG — MOBILE: bottom-right, very faint === */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute bottom-0 right-0 w-[60%] h-[55%] opacity-[0.04] sm:hidden"
            viewBox="0 0 200 120"
            preserveAspectRatio="xMaxYMax slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10,110 C50,80 90,40 140,30 C170,22 190,40 200,60"
              stroke="#60A5FA"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="3 7"
            />
            <circle cx="90" cy="50" r="2" fill="#93C5FD" />
            <circle cx="90" cy="50" r="4.5" stroke="#93C5FD" strokeWidth="0.5" />
            <circle cx="160" cy="32" r="2.5" fill="#60A5FA" />
            <circle cx="160" cy="32" r="5" stroke="#60A5FA" strokeWidth="0.5" />
          </svg>

          {/* === CONTENT === */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-10">

            {/* LEFT — Headline + body — kept clean, no decorations behind */}
            <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">

              <h1 className="text-[22px] sm:text-[28px] md:text-[32px] tracking-tight leading-snug">
                <span className="font-black text-[#F59E0B]">1000+</span>
                <span className="font-extrabold text-white"> happy students</span>
                <br />
                <span className="font-bold text-white/90">and still counting</span>
              </h1>

              {/* Minimal amber accent line — tighter to heading on mobile */}
              <div className="w-8 h-[2.5px] rounded-full bg-[#F59E0B]/55 !mt-1.5 sm:!mt-2.5" />

              <p className="text-[12.5px] sm:text-[13.5px] text-blue-100/70 font-normal leading-relaxed max-w-[300px] sm:max-w-[390px]">
                Every story here is a testimony to their wonderful learning journey with IDL Education.
                You too can share your learning experience with us.
              </p>
            </div>

            {/* RIGHT (desktop) / BELOW centered (mobile) — WhatsApp CTA */}
            <div className="flex justify-center sm:justify-end sm:pl-4">
              <a
                href={`https://wa.me/918860040010?text=${encodeURIComponent("Hi IDL Education! 🎉 I'd like to share my success story and video with you. Please add it to the IDL Stars Hall of Fame!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#189a46] active:scale-[0.97] text-white font-semibold text-[13px] sm:text-[14px] w-[78%] sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-[13px] shadow-[0_2px_8px_rgba(29,185,84,0.16)] hover:shadow-[0_4px_12px_rgba(29,185,84,0.22)] hover:-translate-y-px transition-all duration-150 cursor-pointer shrink-0 border border-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] fill-current shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.776.979-.951 1.179-.175.2-.351.226-.651.075-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.131-.612.136-.135.301-.351.451-.526.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.588-.492-.508-.676-.518-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.12 3.237 5.136 4.54.717.31 1.277.495 1.713.633.72.228 1.375.196 1.893.118.577-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.275-.2-.576-.35z" />
                  <path d="M12.04 2c-5.464 0-9.91 4.446-9.91 9.91 0 1.75.457 3.456 1.325 4.96L2 22l5.253-1.378c1.454.793 3.09 1.21 4.787 1.21 5.464 0 9.91-4.446 9.91-9.91 0-5.464-4.446-9.91-9.91-9.91zm0 18.15c-1.477 0-2.926-.397-4.19-1.148l-.3-.178-3.116.818.832-3.037-.195-.312c-.825-1.314-1.261-2.836-1.261-4.403 0-4.542 3.696-8.238 8.24-8.238 4.543 0 8.24 3.696 8.24 8.238 0 4.543-3.697 8.24-8.24 8.24z" />
                </svg>
                Click to share your IDL Story
              </a>
            </div>

          </div>
        </div>

        {/* Placeholder comment: Duplicate CTA block removed */}

        {/* Single-line Horizontal Scrollable Filters Bar */}
        <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max mx-auto px-1">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-180 cursor-pointer shrink-0 ${
                  activeFilter === filter
                    ? 'bg-[#0B1F4B] text-white shadow-md border border-[#0B1F4B]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Student Story Grid (1 column below 360px, 2 columns on 360px-767px mobile, 2 columns on md tablet, 3 columns on lg desktop) */}
        {visibleStories.length > 0 ? (
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 min-[360px]:gap-3 sm:gap-6 md:gap-8 items-stretch mb-10 sm:mb-12">
            {visibleStories.map((testimonial) => (
              <IdlStarCard
                key={testimonial.id}
                testimonial={testimonial}
                onOpenVideo={(t) => setSelectedVideoTestimonial(t)}
                onOpenDetail={(t) => setSelectedDetailTestimonial(t)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto mb-12">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No stories found under &quot;{activeFilter}&quot;</p>
            <p className="text-xs text-slate-500 mt-1">Try switching to &quot;All&quot; to view all student stories.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-xs font-semibold"
            >
              View All Stories
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredTestimonials.length && (
          <div className="text-center mb-12 sm:mb-16">
            <Button
              type="button"
              onClick={handleLoadMore}
              className="px-5 py-2 sm:px-6 sm:py-2.5 h-auto text-xs sm:text-sm font-bold rounded-xl bg-[#0B1F4B] text-white hover:bg-blue-900 shadow-md cursor-pointer"
            >
              Load More Student Stories ({filteredTestimonials.length - visibleCount} Remaining)
            </Button>
          </div>
        )}

        {/* Bottom Closing CTA Banner */}
        <div className="rounded-2xl p-5 sm:p-8 bg-gradient-to-r from-[#0B1F4B] via-[#102A68] to-[#1D4ED8] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 border border-blue-900/30">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Want to be the Next IDL Star?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-xl leading-relaxed">
              Join IDL Education today for diagnostic learning, expert faculty guidance, and structured academic success.
            </p>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAdmissionOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-5 rounded-xl cursor-pointer shadow transition-all active:scale-95"
            >
              Apply for Admission →
            </button>
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/40 font-bold text-xs sm:text-sm h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              Contact Faculty
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Dialog */}
      {selectedVideoTestimonial?.videoId && (
        <Dialog open={Boolean(selectedVideoTestimonial)} onOpenChange={(open) => !open && setSelectedVideoTestimonial(null)}>
          <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*9/16),420px)] aspect-[9/16] h-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedVideoTestimonial.name} - Success Story Video</DialogTitle>
              <DialogDescription>Watch video success story from {selectedVideoTestimonial.name}.</DialogDescription>
            </DialogHeader>
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                className="block w-full h-full border-0"
                src={`https://www.youtube.com/embed/${selectedVideoTestimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`YouTube video for ${selectedVideoTestimonial.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </VideoModalDialogContent>
        </Dialog>
      )}

      {/* Story Detailed View Modal (Compacted IDL Stars Card Style) */}
      {selectedDetailTestimonial && (
        <Dialog open={Boolean(selectedDetailTestimonial)} onOpenChange={(open) => !open && setSelectedDetailTestimonial(null)}>
          <DialogContent className="w-[92vw] sm:max-w-lg p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedDetailTestimonial.name} Story</DialogTitle>
              <DialogDescription>Full student story of {selectedDetailTestimonial.name}</DialogDescription>
            </DialogHeader>

            {/* Identity Header: Photo + Name + Achievement Badge */}
            <div className="flex items-start gap-3.5 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 bg-slate-100 shadow-xs">
                <GcsImage
                  filePath={selectedDetailTestimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                  alt={selectedDetailTestimonial.name}
                  fill
                  className="object-cover"
                />
                {selectedDetailTestimonial.videoId && (
                  <button
                    type="button"
                    onClick={() => {
                      const temp = selectedDetailTestimonial;
                      setSelectedDetailTestimonial(null);
                      setSelectedVideoTestimonial(temp);
                    }}
                    className="absolute bottom-1.5 right-1.5 transition-all duration-180 active:scale-95 hover:scale-105 z-10 p-1 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-sm text-white cursor-pointer shadow-md ring-1 ring-white/20 border border-white/10"
                    aria-label={`Watch ${selectedDetailTestimonial.name}'s video`}
                  >
                    <PlayCircle className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-[#0B1F4B] dark:text-white truncate leading-snug">
                  {selectedDetailTestimonial.name}
                </h3>

                {selectedDetailTestimonial.achievement && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50/80 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-300 text-xs font-bold uppercase tracking-wide border border-blue-200/60 dark:border-blue-900/40">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedDetailTestimonial.achievement}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Story Text Area (Direct focus with quote icon) */}
            <div className="pt-3.5 sm:pt-4 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <Quote className="w-4 h-4 text-[#1D4ED8] dark:text-blue-400 shrink-0 mt-1 stroke-[1.75]" />
                <div className="space-y-2.5 flex-1">
                  {selectedDetailTestimonial.testimonial
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, idx) => (
                      <p key={idx} className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal antialiased">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Modal */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />

      {/* Admission Form Popup Modal */}
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
    </div>
  );
}
