'use client';

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TExpertTeacher } from "@/app/actions/types";
import { getSignedUrlForPdf } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { GraduationCap, BookOpen, Briefcase, Sparkles, UserCheck } from "lucide-react";

/**
 * Universal Image Renderer supporting local assets (/image.png), GCS paths, and external URLs.
 * Handles GCS signed URLs, custom photoPosition crop, and graceful fallback.
 */
function TeacherAvatarImage({ src, alt, photoPosition }: { src?: string; alt: string; photoPosition?: string }) {
  const [imgSrc, setImgSrc] = useState<string>(src || "/director.png");

  useEffect(() => {
    let active = true;
    const raw = src || "/director.png";
    if (raw.includes('storage.googleapis.com') && !raw.includes('GoogleAccessId=')) {
      getSignedUrlForPdf(raw).then((res) => {
        if (active && res.success && res.url) {
          setImgSrc(res.url);
        }
      });
    } else {
      setImgSrc(raw);
    }
    return () => {
      active = false;
    };
  }, [src]);

  const posStyle = photoPosition ? { objectPosition: photoPosition } : undefined;
  const isGcs = imgSrc.includes('storage.googleapis.com') || imgSrc.includes('GoogleAccessId=');

  return (
    <div className="relative w-full h-full">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 84vw, (max-width: 1024px) 48vw, 33vw"
        className="object-cover contrast-[1.03] transition-transform duration-200 ease-out group-hover/card:scale-[1.012]"
        style={posStyle ?? { objectPosition: 'top' }}
        unoptimized={isGcs}
        onError={() => {
          setImgSrc("/director.png");
        }}
      />
    </div>
  );
}

/**
 * Extracts clean YouTube video ID from standard watch URL, share URL, embed URL, or raw ID.
 */
function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

/**
 * Single Expert Teacher Card.
 * Refined visual hierarchy: Photo → Name → Badge → Meta → Bio → View Profile.
 * Play button: white/translucent surface with IDL-blue icon.
 * Equal footer baseline: fixed-height footer row always rendered.
 */
function ExpertTeacherCard({ teacher }: { teacher: TExpertTeacher }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const photoUrl = teacher.photoUrl || teacher.avatarUrl || teacher.photo || "/director.png";
  const videoId = getYouTubeId(teacher.videoUrl || teacher.videoId || teacher.introVideo);

  // Subject / Exam badge label
  const specializationBadge = teacher.specialization || (
    teacher.subject && teacher.examFocus
      ? `${teacher.subject.toUpperCase()} · ${teacher.examFocus.toUpperCase()}`
      : teacher.subject
        ? `${teacher.subject.toUpperCase()} FACULTY`
        : null
  );

  // Compact metadata: [Experience] · [Qualification]
  const metaParts: string[] = [];
  if (teacher.experience) metaParts.push(teacher.experience);
  if (teacher.qualification) metaParts.push(teacher.qualification);
  const metaLine = metaParts.join(" · ");

  const bioText = teacher.shortBio || teacher.teachingFocus || "Dedicated to building deep conceptual clarity and academic excellence.";

  return (
    <>
      <Card
        className="h-full w-full flex flex-col shadow-[0_2px_12px_-3px_rgba(11,31,75,0.06)] hover:shadow-[0_8px_28px_-4px_rgba(11,31,75,0.10)] hover:-translate-y-[3px] transition-all duration-200 ease-out bg-white dark:bg-card text-foreground rounded-[20px] overflow-hidden border border-slate-200/70 dark:border-border/60 group/card"
      >
        <CardContent className="p-0 flex flex-col h-full">

          {/* ── 1. PHOTO BLOCK ──
               aspect-[5/4]: height = 0.8×width (~6.7% taller than previous 4/3).
               At ~390px card width: photo ≈ 312px → ~57–59% of card. Balanced portrait.
               Photo is clean — no play button overlay.
          */}
          <div className="relative w-full aspect-[5/4] overflow-hidden bg-slate-100 dark:bg-muted shrink-0">
            <TeacherAvatarImage src={photoUrl} alt={teacher.name} photoPosition={teacher.photoPosition} />

            {/* Subtle depth gradient at bottom — purely aesthetic */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          </div>

          {/* ── 2. CARD CONTENT ── */}
          <div className="flex flex-col flex-1 px-4 pt-4 pb-4 sm:px-5 sm:pt-4.5 sm:pb-5">

            {/* Teacher Name — Strongest text in content area */}
            <h3 className="font-extrabold text-[17px] sm:text-[18px] text-[#0B1F4B] dark:text-white tracking-[-0.02em] leading-snug mb-1.5 truncate w-full shrink-0">
              {teacher.name}
            </h3>

            {/* Subject / Exam badge — subtle blue tint, tight */}
            {specializationBadge ? (
              <div className="inline-flex items-center self-start h-[20px] px-2 rounded-[4px] bg-blue-50 dark:bg-blue-950/30 text-[#1A3DB5] dark:text-blue-300 text-[10px] font-semibold tracking-[0.04em] uppercase leading-none mb-2 border border-blue-100 dark:border-blue-900/30 shrink-0 max-w-full truncate">
                {specializationBadge}
              </div>
            ) : (
              <div className="h-[20px] mb-2 shrink-0" />
            )}

            {/* Experience · Qualification — readable secondary metadata */}
            {metaLine ? (
              <p className="text-[11.5px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-3 shrink-0 truncate w-full">
                {metaLine}
              </p>
            ) : (
              <div className="h-[17px] mb-3 shrink-0" />
            )}

            {/* ── Bio + Footer: grows to fill; footer always anchored at bottom ── */}
            <div className="flex flex-col flex-1 justify-between">

              {/* Bio with vertical connector line from icon downward */}
              <div className="flex items-stretch gap-2.5 w-full">

                {/* Left column: icon + thin connector line */}
                <div className="flex flex-col items-center shrink-0 pt-[3px]">
                  {/* Graduation cap icon */}
                  <GraduationCap className="w-3.5 h-3.5 text-[#1D4ED8]/50 dark:text-blue-400/50 shrink-0 stroke-[1.75]" />
                  {/* Vertical connector line: runs from icon bottom to end of bio */}
                  <div className="w-px flex-1 mt-1.5 bg-gradient-to-b from-blue-300/40 via-blue-200/20 to-transparent dark:from-blue-700/30 dark:to-transparent" />
                </div>

                {/* Bio text */}
                <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-300 font-normal leading-[1.55] tracking-[-0.005em] text-left line-clamp-3 antialiased flex-1">
                  {bioText}
                </p>
              </div>

              {/* Footer: two-action row — equal card height baseline */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 shrink-0 w-full min-h-[34px]">

                {/* Primary: Watch Intro — only if videoId exists */}
                {videoId ? (
                  <button
                    type="button"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label={`Watch introduction of ${teacher.name}`}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-[29px] sm:h-[30px] rounded-[6px] bg-blue-50/90 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 border border-blue-200/80 hover:border-blue-300 dark:border-blue-800/60 text-[#1D4ED8] dark:text-blue-300 text-[11px] sm:text-[11.5px] font-semibold transition-all duration-150 cursor-pointer shrink-0 hover:shadow-sm hover:-translate-y-[0.5px]"
                  >
                    {/* Compact solid triangle play icon */}
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 shrink-0" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="whitespace-nowrap">Watch Intro</span>
                  </button>
                ) : (
                  <div className="shrink-0" />
                )}

                {/* Secondary: View Profile — only if profileUrl exists */}
                {teacher.profileUrl ? (
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    aria-label={`View profile of ${teacher.name}`}
                    className="group/profile inline-flex items-center gap-1 px-2.5 sm:px-3 h-[29px] sm:h-[30px] rounded-[6px] bg-white/90 hover:bg-slate-50/90 dark:bg-card dark:hover:bg-muted/60 border border-slate-200/90 hover:border-[#1D4ED8]/60 dark:border-border/70 dark:hover:border-blue-400/60 text-[#0B1F4B] hover:text-[#1D4ED8] dark:text-slate-200 dark:hover:text-white text-[11px] sm:text-[11.5px] font-semibold transition-all duration-150 cursor-pointer shrink-0"
                  >
                    <span className="whitespace-nowrap">View Profile</span>
                    <span className="transition-transform duration-150 ease-out group-hover/profile:translate-x-0.5" aria-hidden="true">→</span>
                  </button>
                ) : null}

              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intro Video Modal Dialog */}
      {videoId && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*16/9),720px)] aspect-video h-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{teacher.name} - Faculty Introduction</DialogTitle>
              <DialogDescription>Introduction video for {teacher.name}</DialogDescription>
            </DialogHeader>
            <div className="relative w-full h-full overflow-hidden bg-black">
              <iframe
                className="block w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title={`Introduction video for ${teacher.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </VideoModalDialogContent>
        </Dialog>
      )}

      {/* View Profile Modal Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="w-[92vw] sm:max-w-md p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header section with soft blue-tinted background treatment */}
          <DialogHeader className="text-left p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50/70 via-slate-50/60 to-blue-50/30 dark:from-slate-900/90 dark:to-slate-900/50 border border-blue-100/70 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 border-white dark:border-slate-800 bg-slate-100 shadow-md ring-2 ring-blue-500/15 dark:ring-blue-400/20">
                <TeacherAvatarImage src={photoUrl} alt={teacher.name} photoPosition={teacher.photoPosition} />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <DialogTitle className="text-lg sm:text-xl font-bold text-[#0B1F4B] dark:text-blue-50 truncate leading-snug">
                  {teacher.name}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                  {teacher.designation || teacher.subject}
                </p>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Full profile details for {teacher.name}
            </DialogDescription>
          </DialogHeader>

          {/* Modal Body */}
          <div className="space-y-4 pt-3 text-left">
            {/* Subject / Specialization Badge */}
            {specializationBadge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/80 dark:bg-blue-950/50 text-[#0B1F4B] dark:text-blue-200 text-xs font-semibold border border-blue-200/70 dark:border-blue-800/50 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{specializationBadge}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" title="Faculty Focus" />
              </div>
            )}

            {/* Experience & Qualification Stat Cards */}
            {(teacher.experience || teacher.qualification) && (
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {teacher.experience && (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 border-l-2 border-l-blue-600 dark:border-l-blue-500 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                      Experience
                    </span>
                    <span className="font-bold text-sm text-[#0B1F4B] dark:text-slate-100 block">
                      {teacher.experience}
                    </span>
                  </div>
                )}
                {teacher.qualification && (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 border-l-2 border-l-blue-600 dark:border-l-blue-500 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                      Qualification
                    </span>
                    <span className="font-bold text-sm text-[#0B1F4B] dark:text-slate-100 block truncate" title={teacher.qualification}>
                      {teacher.qualification}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Teaching Approach */}
            {teacher.teachingFocus && (
              <div className="border-l-2 border-l-blue-600 dark:border-l-blue-500 pl-3 py-0.5 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F4B] dark:text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  Teaching Approach
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {teacher.teachingFocus}
                </p>
              </div>
            )}

            {/* About Educator */}
            {bioText && (
              <div className="border-l-2 border-l-blue-600 dark:border-l-blue-500 pl-3 py-0.5 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F4B] dark:text-blue-200 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  About Educator
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {bioText}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Our Expert Teachers Section Component.
 *
 * Desktop: exactly 3 complete cards — no overflow/clip, carousel loops through full set.
 * Tablet (sm–md): 2 cards visible.
 * Mobile: 1 full card + 10–15% next-card preview.
 *
 * Key carousel config:
 *  - align: "center" prevents partial outer cards at loop boundaries.
 *  - basis values match visible count exactly.
 *  - Outer wrapper uses overflow-hidden (not clip) so dots/pagination remain visible.
 */
export function ExpertTeachersSection({ teachers }: { teachers?: TExpertTeacher[] }) {
  const [loading, setLoading] = useState(!teachers);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const isHoveredRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (teachers) {
      setLoading(false);
    }
  }, [teachers]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Reduced motion support
  useEffect(() => {
    if (!api || typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      api.plugins()?.autoplay?.stop();
    }
  }, [api]);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const canAutoplay = useCallback(() => {
    if (!api) return false;
    const snaps = api.scrollSnapList();
    return Boolean(snaps && snaps.length > 1);
  }, [api]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!canAutoplay()) return;
    try { api?.plugins()?.autoplay?.stop(); } catch { /* safe */ }
  }, [api, canAutoplay]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!canAutoplay()) return;
    try { api?.plugins()?.autoplay?.play(); } catch { /* safe */ }
  }, [api, canAutoplay]);

  const handleTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canAutoplay()) return;
    try { api?.plugins()?.autoplay?.stop(); } catch { /* safe */ }
  }, [api, canAutoplay]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canAutoplay()) return;
    touchTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && canAutoplay()) {
        try { api?.plugins()?.autoplay?.play(); } catch { /* safe */ }
      }
    }, 1200);
  }, [api, canAutoplay]);

  const scrollTo = useCallback(
    (index: number) => { api?.scrollTo(index); },
    [api]
  );

  const teacherList = teachers && teachers.length > 0 ? teachers : [];

  return (
    <section
      id="expert-teachers"
      className="relative w-full pt-12 sm:pt-14 md:pt-16 pb-10 sm:pb-12 md:pb-14 bg-[#F8FAFD] dark:bg-slate-950 overflow-hidden"
    >

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col">

          {/* Section Heading */}
          <div className="text-center space-y-2 sm:space-y-2.5 mb-7 sm:mb-8 md:mb-9">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Our Expert{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Teachers</span>
                <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                  <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-[#1F4FA3] fill-none stroke-current stroke-[10] opacity-60">
                    <path d="M0,15 Q50,5 100,15" />
                  </svg>
                </div>
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
              Experienced educators. Clear concepts. Better learning.
            </p>
          </div>

          {/* Carousel / Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-5xl mx-auto w-full">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-[20px]" />
              ))}
            </div>
          ) : teacherList.length > 0 ? (
            /*
             * CAROUSEL WRAPPER:
             * - overflow-hidden on this div clips the carousel track so no partial cards
             *   bleed outside on desktop.
             * - On mobile (basis-[86%]) the 10–15% peek of the next card is intentional
             *   and visible within this same overflow area.
             * - max-w-5xl + mx-auto keeps the 3-card desktop view well-proportioned.
             */
            <div
              className="relative w-full overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onFocusCapture={handleMouseEnter}
              onBlurCapture={handleMouseLeave}
            >
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                  duration: 32,
                }}
                plugins={[
                  Autoplay({
                    delay: 4500,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                className="w-full"
              >
                {/*
                 * Negative margin (-ml-*) + matching pl-* on items = gap between cards.
                 *
                 * Gap: pl-4 (16px) on each item → between cards = 16px per gap.
                 * For N visible cards with N items each contributing a left-padding:
                 *   mobile  (<640px):  basis-[85%]              → 1 full card + ~15% peek
                 *   sm (640–1023px):   basis-[calc(50%-8px)]    → 2 full cards
                 *   lg (≥1024px):      basis-[calc(33.333%-11px)] → exactly 3 full cards
                 *
                 * The wrapper has overflow-hidden so no partial card bleeds on desktop.
                 */}
                {/*
                 * CAROUSEL BASIS MATH — CRITICAL:
                 *
                 * With -ml-4 (16px negative offset) on CarouselContent and pl-4 (16px)
                 * on each item, the track starts at -16px. For N cards to fill the
                 * container with NO gap (which Embla would fill with a clone sliver):
                 *
                 *   N × item_width = container_width + 16px
                 *   item_width = container_width/N + 16/N
                 *   basis = 1/N + 16/(N×container_width)  ≈  1/N + small px
                 *
                 * Using ADDITION ensures the track overflows by ~2px (clipped by
                 * the wrapper overflow-hidden) so no 4th-card gap ever appears.
                 * Using SUBTRACTION (the previous error) underflows, creating the gap.
                 *
                 *   mobile  (<640px):  basis-[86%]           → 1 full card + ~14% peek
                 *   sm (640–1023px):   basis-[calc(50%+8px)]  → exactly 2 full cards
                 *   lg (≥1024px):      basis-[calc(33.333%+6px)] → exactly 3 full cards
                 */}
                <CarouselContent className="-ml-4 items-stretch">
                  {teacherList.map((teacher, index) => (
                    <CarouselItem
                      key={teacher.id || index}
                      className="pl-4 basis-[86%] sm:basis-[calc(50%+8px)] lg:basis-[calc(33.333%+6px)] flex flex-col"
                    >
                      <div className="h-full flex flex-col flex-1">
                        <ExpertTeacherCard teacher={teacher} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Centered Pagination Dots */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
                {teacherList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      current === i
                        ? "w-6 sm:w-8 bg-[#0A225C] dark:bg-primary"
                        : "w-1.5 sm:w-2 bg-slate-300/70 dark:bg-muted-foreground/30 hover:bg-slate-400"
                    )}
                    aria-label={`Go to teacher slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-xs text-muted-foreground italic font-medium">
              Faculty profiles coming soon!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
