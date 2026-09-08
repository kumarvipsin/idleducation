'use client';

import * as React from "react";
import Image from "next/image";
import type { TTopperTestimonial } from "@/app/actions/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function toNormalCase(str?: string | null) {
  if (!str) return "";
  const trimmed = str.trim();
  // If string is all uppercase, convert to standard Title/Normal case
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 2) {
    return trimmed
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return trimmed;
}

export interface TopperStoryCardProps {
  testimonial: TTopperTestimonial;
  isPlaying: boolean;
  onPlay: () => void;
  onClose: () => void;
  className?: string;
}

export const TopperStoryCard = ({
  testimonial,
  isPlaying,
  onPlay,
  onClose,
  className,
}: TopperStoryCardProps) => {
  // Independent local hover state — strictly isolated to THIS specific card
  const [isHovered, setIsHovered] = React.useState(false);

  const [imgSrc, setImgSrc] = React.useState(
    testimonial.thumbnailUrl ||
    `https://img.youtube.com/vi/${testimonial.videoId}/maxresdefault.jpg`
  );

  // Big prominent message text (matching Toppers' Talk style)
  const displayMessage =
    testimonial.quote?.trim() ||
    (testimonial.achievement?.trim()
      ? `Scored ${testimonial.achievement}! Thank you IDL Education!`
      : `I love all my mentors : They help me with all my doubts`);

  // Student Name & Class in clean Normal case
  const formattedName = toNormalCase(testimonial.studentName);
  const formattedClass = toNormalCase(testimonial.studentClass);
  const studentMeta = formattedClass ? `${formattedName}, ${formattedClass}` : formattedName;

  // ── STEP 3: PLAY STATE (Plays inline only inside this card) ──
  if (isPlaying) {
    return (
      <div className={cn("relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800", className)}>
        <iframe
          className="block w-full h-full border-0"
          src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={`${testimonial.studentName}'s story`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Close Button to return back to clean resting state */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            onClose();
          }}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/85 hover:bg-black text-white flex items-center justify-center shadow-lg transition-all cursor-pointer border border-white/25"
          aria-label="Close video"
          title="Close video"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── STEPS 1 & 2: RESTING & HOVER STATES (Strictly Isolated) ──
  return (
    <div
      onClick={() => {
        setIsHovered(false);
        onPlay();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsHovered(false);
          onPlay();
        }
      }}
      className={cn(
        "relative aspect-[9/16] w-full text-left cursor-pointer select-none",
        "rounded-2xl overflow-hidden bg-slate-950",
        "border border-slate-200/80 dark:border-slate-800",
        "shadow-[0_2px_10px_-2px_rgba(11,31,75,0.08)]",
        "transition-all duration-300",
        isHovered
          ? "shadow-[0_16px_32px_-6px_rgba(11,31,75,0.22)] -translate-y-1"
          : "hover:shadow-md",
        className
      )}
      aria-label={`Watch ${testimonial.studentName}'s story: ${displayMessage}`}
    >
      {/* 1. Video Thumbnail / Poster (Clean in resting state) */}
      <Image
        src={imgSrc}
        alt={`${testimonial.studentName} — Stories of our Brightest Stars`}
        fill
        unoptimized
        loading="lazy"
        className={cn(
          "object-cover transition-transform duration-500",
          isHovered ? "scale-105" : "scale-100"
        )}
        onError={() => {
          setImgSrc(`https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`);
        }}
      />

      {/* 2. Exact YouTube Shorts Icon provided by user (APPEARS ONLY ON HOVER OF THIS SPECIFIC CARD) */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-all duration-300",
          isHovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        )}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)] transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
          <Image
            src="/images/youtube-shorts-icon.png"
            alt="YouTube Shorts"
            width={72}
            height={72}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* 3. Bottom Smooth Gradient Overlay behind text */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none z-10 transition-opacity duration-300",
          isHovered ? "opacity-35" : "opacity-100"
        )}
      />

      {/* 4. Bottom Text: Big Message + Name/Class (VISIBLE BY DEFAULT, HIDES ONLY ON HOVER OF THIS SPECIFIC CARD!) */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left z-20 pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Big prominent message text */}
        <p className="text-[17px] min-[360px]:text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white leading-[1.25] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-4 mb-2">
          {displayMessage}
        </p>

        {/* Student Name, Class / State — Normal Case, Bigger & Bold */}
        <p className="text-[16px] sm:text-[17px] md:text-[18px] font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] line-clamp-1 tracking-normal">
          {studentMeta}
        </p>
      </div>
    </div>
  );
};
