'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

/* ══════════════════════════════════════════════════════════════════
   IDL EDUCATION — 4-Stage Academic Success Framework
   “From Foundation to Future. Built for Every Step.”
   
   Exact Match to Reference Design:
   • Eyebrow: "• OUR LEARNING APPROACH" pill badge
   • Heading: "From Foundation to Future. Built for Every Step."
   • Subtitle: "A structured learning journey designed to help every student learn better, grow stronger and achieve more."
   • Desktop (>= lg): 4 Large White Circular Feature Cards with Arched Connector Line & Nodes
   • Mobile (< lg): 4 Horizontal Rounded Cards with Left Icon Disc, Number Badge & Right Text
   ══════════════════════════════════════════════════════════════════ */

interface PillarItem {
  id: string;
  badge: string;
  badgeColor: 'blue' | 'yellow';
  iconSrc: string;
  iconGlow: 'blue' | 'yellow';
  titleDark: string;
  titleBlue: string;
  descriptionMobile: string;
  descriptionLine1: string;
  descriptionLine2: string;
  descriptionLine3: string;
}

const pillars: PillarItem[] = [
  {
    id: '01',
    badge: '01',
    badgeColor: 'blue',
    iconSrc: '/001.png',
    iconGlow: 'blue',
    titleDark: 'Focused',
    titleBlue: 'Learning',
    descriptionMobile: 'Structured learning with complete clarity for conceptual mastery.',
    descriptionLine1: 'Structured learning with',
    descriptionLine2: 'complete clarity for',
    descriptionLine3: 'conceptual mastery.',
  },
  {
    id: '02',
    badge: '02',
    badgeColor: 'yellow',
    iconSrc: '/02.png',
    iconGlow: 'yellow',
    titleDark: 'Expert',
    titleBlue: 'Teachers',
    descriptionMobile: 'Learn from top mentors with years of proven experience.',
    descriptionLine1: 'Learn from top mentors',
    descriptionLine2: 'with years of proven',
    descriptionLine3: 'experience.',
  },
  {
    id: '03',
    badge: '03',
    badgeColor: 'blue',
    iconSrc: '/03.png',
    iconGlow: 'blue',
    titleDark: 'Proven',
    titleBlue: 'Progress',
    descriptionMobile: 'Regular assessments and continuous performance tracking.',
    descriptionLine1: 'Regular assessments and',
    descriptionLine2: 'continuous performance',
    descriptionLine3: 'tracking.',
  },
  {
    id: '04',
    badge: '04',
    badgeColor: 'yellow',
    iconSrc: '/04.png',
    iconGlow: 'yellow',
    titleDark: 'Future',
    titleBlue: 'Ready',
    descriptionMobile: 'Comprehensive preparation for board exams and top university admissions.',
    descriptionLine1: 'Comprehensive preparation',
    descriptionLine2: 'for board exams and top',
    descriptionLine3: 'university admissions.',
  },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Triggers entrance motion ONLY once the element is meaningfully inside the
 * viewport (preventing premature off-screen animation), keeps it visible while
 * partially on screen, and silently resets once 100% scrolled out of view so
 * every scroll up or down replays the motion cleanly.
 */
function useReplayOnScroll(
  ref: React.RefObject<Element | null>,
  enterThreshold = 0.3,
  disabled = false,
  enterRootMargin = '-6% 0px -8% 0px'
) {
  const [inView, setInView] = useState<boolean>(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    // 1. Trigger once element clearly enters the viewing area (never early off-screen,
    //    and responsive enough on mobile so there is zero blank delay).
    const enterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      {
        threshold: enterThreshold,
        rootMargin: enterRootMargin,
      }
    );

    // 2. Reset ONLY once element is 100% scrolled out of the real viewport
    //    (above or below), so scrolling back up/down replays every time cleanly.
    const exitObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setInView(false);
        }
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    enterObserver.observe(el);
    exitObserver.observe(el);

    return () => {
      enterObserver.disconnect();
      exitObserver.disconnect();
    };
  }, [ref, enterThreshold, disabled, enterRootMargin]);

  return inView;
}

interface MobilePillarCardProps {
  item: PillarItem;
  idx: number;
  isActive: boolean;
  prefersReducedMotion: boolean;
  onTap: (idx: number) => void;
}

function MobilePillarCard({
  item,
  idx,
  isActive,
  prefersReducedMotion,
  onTap,
}: MobilePillarCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardInView = useReplayOnScroll(cardRef, 0.2, prefersReducedMotion, '-4% 0px -5% 0px');
  const isYellow = item.badgeColor === 'yellow';

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={
        cardInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 16, scale: 0.985 }
      }
      transition={
        cardInView
          ? {
              duration: 0.36,
              ease: EASE_OUT_EXPO,
            }
          : { duration: 0 }
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      onClick={() => onTap(idx)}
      className={`relative w-full bg-white dark:bg-slate-900 rounded-[14px] min-[390px]:rounded-[16px] border px-3.5 py-3 min-[390px]:px-4 min-[390px]:py-3.5 flex items-center gap-3 min-[390px]:gap-3.5 transition-colors duration-200 cursor-pointer touch-manipulation ${
        isActive
          ? isYellow
            ? 'border-[#F59E0B]/50 dark:border-amber-500/45 shadow-[0_4px_14px_rgba(245,158,11,0.09)]'
            : 'border-[#155EEF]/45 dark:border-blue-500/45 shadow-[0_4px_14px_rgba(21,94,239,0.09)]'
          : 'border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_8px_rgba(6,43,103,0.03)]'
      }`}
    >
      {/* Left Icon Disc with Number Badge */}
      <div className="relative shrink-0">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : isActive
                ? { scale: 1.05, y: -1 }
                : { scale: 1, y: 0 }
          }
          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
          className={`w-[54px] h-[54px] min-[390px]:w-[58px] min-[390px]:h-[58px] rounded-full flex items-center justify-center p-2 border transition-colors duration-200 ${
            item.iconGlow === 'yellow'
              ? isActive
                ? 'bg-[#FEF9EC] dark:bg-amber-950/30 border-[#F59E0B]/45'
                : 'bg-[#FEF9EC] dark:bg-amber-950/30 border-[#FDE8B5] dark:border-amber-900/40'
              : isActive
                ? 'bg-[#F0F6FE] dark:bg-blue-950/30 border-[#155EEF]/40'
                : 'bg-[#F0F6FE] dark:bg-blue-950/30 border-[#D8E6F8] dark:border-blue-900/40'
          }`}
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? undefined
                : isActive
                  ? { rotate: idx % 2 === 0 ? -4 : 4 }
                  : { rotate: 0 }
            }
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
          >
            <Image
              src={item.iconSrc}
              alt={`${item.titleDark} ${item.titleBlue}`}
              width={44}
              height={44}
              unoptimized
              className="w-[32px] h-[32px] min-[390px]:w-[35px] min-[390px]:h-[35px] object-contain drop-shadow-xs"
            />
          </motion.div>
        </motion.div>

        {/* Badge at bottom-right of icon disc */}
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : isActive
                ? { scale: 1.1 }
                : { scale: 1 }
          }
          transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          className={`absolute -bottom-0.5 -right-0.5 w-[19px] h-[19px] rounded-full flex items-center justify-center text-white text-[9.5px] font-[800] leading-none border-[1.5px] border-white dark:border-slate-900 shadow-xs ${
            isYellow ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
          }`}
        >
          {item.badge}
        </motion.div>
      </div>

      {/* Right Text Column - vertically balanced */}
      <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
        <h3 className="text-[15px] min-[390px]:text-[16px] font-[800] leading-snug tracking-[-0.01em]">
          <span className="text-[#062B67] dark:text-white">{item.titleDark} </span>
          <span className="text-[#155EEF] dark:text-blue-400">{item.titleBlue}</span>
        </h3>

        {/* Animated Accent Dash Under Title (GPU scaleX instead of layout width!) */}
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { scaleX: isActive ? 1.75 : 1 }
          }
          transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
          style={{ transformOrigin: 'left center' }}
          className={`w-[20px] h-[2px] rounded-full mt-1 mb-1.5 ${
            isYellow ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
          }`}
        />

        {/* Description */}
        <p className="text-[12px] min-[390px]:text-[12.6px] text-[#4A5872] dark:text-slate-300 font-[500] leading-[1.44] text-pretty">
          {item.descriptionMobile}
        </p>
      </div>
    </motion.div>
  );
}

export function ScholarshipSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const desktopPodsRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  const isHeaderInView = useReplayOnScroll(headerRef, 0.35, prefersReducedMotion, '-6% 0px -8% 0px');
  const isDesktopPodsInView = useReplayOnScroll(desktopPodsRef, 0.4, prefersReducedMotion, '-10% 0px -14% 0px');
  const isVisibleForCycle = useReplayOnScroll(sectionRef, 0.25, prefersReducedMotion, '0px');

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Reset active highlight to stage 01 whenever user scrolls back into section
  useEffect(() => {
    if (isVisibleForCycle) {
      setActiveIndex(0);
    }
  }, [isVisibleForCycle]);

  // Subtle living sequential highlight across stages 01 -> 02 -> 03 -> 04 when visible
  useEffect(() => {
    if (prefersReducedMotion || !isVisibleForCycle || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pillars.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isVisibleForCycle, isPaused]);

  const handleMobileTap = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
  };

  // Resume gentle auto-cycle after 6s of inactivity on mobile tap
  useEffect(() => {
    if (!isPaused) return;
    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
    }, 6000);
    return () => clearTimeout(resumeTimer);
  }, [isPaused, activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="why-idl-education"
      aria-label="Why Choose IDL"
      className="relative w-full pt-6 sm:pt-7 md:pt-8 lg:pt-9 pb-6 sm:pb-10 md:pb-12 lg:pb-14 bg-white dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════
          Ambient Light Background Glows
          ══════════════════════════════════════════════════ */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {/* Static GPU-friendly ambient bloom (no continuous large-layer repaint on mobile) */}
        <div 
          className="absolute inset-x-0 bottom-4 sm:bottom-8 mx-auto w-full max-w-[1260px] h-[360px] dark:hidden opacity-50"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 60%, #EBF4FE 0%, #F5F9FE 42%, rgba(255, 255, 255, 0) 80%)',
          }}
        />

        {/* Dark mode center bloom */}
        <div 
          className="hidden dark:block absolute inset-x-0 bottom-4 sm:bottom-8 mx-auto w-full max-w-[1260px] h-[360px]"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 60%, rgba(30, 58, 138, 0.15) 0%, rgba(30, 58, 138, 0.05) 45%, rgba(2, 6, 23, 0) 80%)',
          }}
        />
      </div>

      <div className="w-full md:container relative z-10 mx-auto px-3 sm:px-4 md:px-6 max-w-[1260px]">
        
        {/* ══════════════════════════════════════════════════
            1. HEADER AREA
            “● Why think IDL ?”
            “Learn Better. Grow Stronger.” with animated smile underline
            ══════════════════════════════════════════════════ */}
        <div
          ref={headerRef}
          className="flex flex-col items-center justify-center text-center mb-4 min-[390px]:mb-5 sm:mb-10 md:mb-12"
        >
          {/* Eyebrow: "● Why think IDL ?" */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={
              isHeaderInView
                ? { duration: 0.45, ease: EASE_OUT_EXPO }
                : { duration: 0 }
            }
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 min-[390px]:mb-2 select-none"
          >
            <span className="relative flex items-center justify-center w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] shrink-0">
              {!prefersReducedMotion && (
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: [1, 2.1, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-[#155EEF]/60 dark:bg-blue-400/60"
                />
              )}
              <span className="relative w-full h-full rounded-full bg-[#155EEF] dark:bg-blue-400" />
            </span>
            <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Why think </span>
              <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">IDL ?</span>
            </span>
          </motion.div>

          {/* Main Heading: Matches exact size & clean hierarchy */}
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={
              isHeaderInView
                ? { duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO }
                : { duration: 0 }
            }
            className="text-[15px] min-[360px]:text-[15.5px] min-[390px]:text-[16.5px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto whitespace-nowrap"
          >
            <span className="text-[#062B67] dark:text-white">
              Learn Better.{' '}
            </span>
            <span className="text-[#155EEF] dark:text-blue-400 inline-block">
              Grow{' '}
              <span className="relative inline-block">
                Stronger.
                {/* Animated curved blue smile underline stroke */}
                <svg 
                  className="absolute -bottom-1 min-[390px]:-bottom-1.5 sm:-bottom-2 md:-bottom-2.5 left-0 w-full h-[5px] sm:h-[7px] md:h-[8px] overflow-visible pointer-events-none" 
                  viewBox="0 0 100 12" 
                  fill="none" 
                  aria-hidden="true"
                >
                  <motion.path 
                    d="M 2 3 Q 50 13, 98 3" 
                    stroke="currentColor" 
                    strokeWidth="2.8" 
                    strokeLinecap="round" 
                    className="text-[#155EEF] dark:stroke-blue-400"
                    initial={prefersReducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    animate={
                      isHeaderInView
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={
                      isHeaderInView
                        ? { duration: 0.75, delay: 0.25, ease: EASE_OUT_EXPO }
                        : { duration: 0 }
                    }
                  />
                </svg>
              </span>
            </span>
          </motion.h2>
        </div>

        {/* ══════════════════════════════════════════════════
            2A. DESKTOP VIEW (>= lg): 4 CIRCULAR PODS IN 1 ROW
            ══════════════════════════════════════════════════ */}
        <div
          ref={desktopPodsRef}
          className="hidden lg:block relative w-full mx-auto"
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle animated journey connector arc behind the 4 pods */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-[128px] left-1/2 -translate-x-1/2 w-[82%] h-[76px] z-0 overflow-visible"
          >
            <motion.path
              d="M 40 60 Q 220 12, 400 60 T 760 60 T 1160 60"
              stroke="url(#idlJourneyLineGrad)"
              strokeWidth="2"
              strokeDasharray="6 7"
              strokeLinecap="round"
              initial={prefersReducedMotion ? { pathLength: 1, opacity: 0.65 } : { pathLength: 0, opacity: 0 }}
              animate={
                isDesktopPodsInView
                  ? { pathLength: 1, opacity: 0.7 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={
                isDesktopPodsInView
                  ? { duration: 1.05, delay: 0.15, ease: EASE_OUT_EXPO }
                  : { duration: 0 }
              }
            />
            <defs>
              <linearGradient id="idlJourneyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#155EEF" stopOpacity="0.18" />
                <stop offset="35%" stopColor="#155EEF" stopOpacity="0.45" />
                <stop offset="68%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.18" />
              </linearGradient>
            </defs>
          </svg>

          {/* 4 Large Perfect Circular Cards Grid */}
          <div className="grid grid-cols-4 gap-6 xl:gap-8 relative z-10 items-center justify-items-center">
            {pillars.map((item, idx) => {
              const isActive = activeIndex === idx;
              const isYellow = item.badgeColor === 'yellow';

              return (
                <motion.div 
                  key={item.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
                  animate={
                    isDesktopPodsInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 28, scale: 0.94 }
                  }
                  transition={
                    isDesktopPodsInView
                      ? {
                          duration: 0.58,
                          delay: 0.06 + idx * 0.1,
                          ease: EASE_OUT_EXPO,
                        }
                      : { duration: 0 }
                  }
                  onMouseEnter={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                  className="relative pt-[34px] w-full max-w-[270px] flex flex-col items-center group select-none cursor-pointer"
                >
                  {/* Floating Icon Medallion: outer wrapper keeps center alignment while inner motion floats */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : isActive
                            ? { y: -6, scale: 1.06 }
                            : { y: [0, -3.5, 0], scale: 1 }
                      }
                      transition={
                        isActive
                          ? { type: 'spring', stiffness: 280, damping: 20 }
                          : { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.65 }
                      }
                      className="relative"
                    >
                      <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center p-2.5 relative border-2 border-white dark:border-slate-800 transition-shadow duration-300 ${
                        item.iconGlow === 'yellow'
                          ? isActive
                            ? 'bg-gradient-to-b from-[#FEF9E7] to-[#FDE8B3] ring-4 ring-amber-200/70 dark:ring-amber-800/40 shadow-[0_8px_24px_rgba(245,158,11,0.26)]'
                            : 'bg-gradient-to-b from-[#FEF9E7] to-[#FDE8B3] ring-[3px] ring-amber-50/70 dark:ring-amber-900/30 shadow-[0_4px_16px_rgba(245,158,11,0.14)]'
                          : isActive
                            ? 'bg-gradient-to-b from-[#EBF4FE] to-[#D7E9FD] ring-4 ring-blue-200/70 dark:ring-blue-800/40 shadow-[0_8px_24px_rgba(21,94,239,0.24)]'
                            : 'bg-gradient-to-b from-[#EBF4FE] to-[#D7E9FD] ring-[3px] ring-blue-50/70 dark:ring-blue-900/30 shadow-[0_4px_16px_rgba(21,94,239,0.12)]'
                      }`}>
                        <motion.div
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : isActive
                                ? { rotate: idx % 2 === 0 ? -4 : 4, scale: 1.06 }
                                : { rotate: 0, scale: 1 }
                          }
                          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        >
                          <Image
                            src={item.iconSrc}
                            alt={`${item.titleDark} ${item.titleBlue}`}
                            width={56}
                            height={56}
                            unoptimized
                            className="w-[50px] h-[50px] object-contain drop-shadow-sm"
                          />
                        </motion.div>
                      </div>

                      {/* Centered Number Badge at bottom of disc */}
                      <motion.div
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : isActive
                              ? { scale: 1.14 }
                              : { scale: 1 }
                        }
                        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        className={`absolute -bottom-2.5 inset-x-0 mx-auto w-[25px] h-[25px] rounded-full flex items-center justify-center text-white text-[11px] font-black border-2 border-white dark:border-slate-900 shadow-sm ${
                          isYellow ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                        }`}
                      >
                        {item.badge}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Large White Circle Card Body — 3D Convex Dome / Hemisphere Shape */}
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : isActive
                          ? { y: -6 }
                          : { y: 0 }
                    }
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className={`idl-hemisphere-pod w-full aspect-square rounded-full border transition-colors duration-300 flex flex-col items-center justify-center pt-[64px] pb-5 px-5 text-center relative z-10 ${
                      isActive
                        ? isYellow
                          ? 'border-[#F59E0B]/45 dark:border-amber-500/40'
                          : 'border-[#155EEF]/40 dark:border-blue-500/40'
                        : 'border-[#DCE6F5]/80 dark:border-slate-800/80'
                    }`}
                  >
                    {/* Two-Tone Title */}
                    <h3 
                      className="text-[18px] sm:text-[18.9px] font-black tracking-[-0.01em] text-center leading-snug"
                      style={{ 
                        fontWeight: 900,
                      }}
                    >
                      <span className="text-[#062B67] dark:text-white" style={{ fontWeight: 900 }}>{item.titleDark} </span>
                      <span className="text-[#155EEF] dark:text-blue-400" style={{ fontWeight: 900 }}>{item.titleBlue}</span>
                    </h3>

                    {/* Animated Accent Dash Bar (GPU scaleX for 60fps zero-reflow) */}
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { scaleX: isActive ? 1.6 : 1 }
                      }
                      transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                      className={`w-[26px] h-[2.5px] rounded-full mx-auto mt-2 mb-2.5 ${
                        isYellow ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                      }`}
                    />

                    {/* Centered Description */}
                    <p 
                      className="text-[13.6px] sm:text-[13.8px] text-[#4A5872] dark:text-slate-300 font-bold leading-[1.58] text-center"
                      style={{ 
                        fontWeight: 700,
                      }}
                    >
                      <span className="block">{item.descriptionLine1}</span>
                      <span className="block">{item.descriptionLine2}</span>
                      <span className="block">{item.descriptionLine3}</span>
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* ══════════════════════════════════════════════════
            2B. MOBILE VIEW (< lg): HORIZONTAL CARDS STACK
            Each card triggers on-time as it enters viewport & replays on every scroll
            ══════════════════════════════════════════════════ */}
        <div className="block lg:hidden w-full max-w-none md:max-w-[480px] mx-auto space-y-2.5 min-[390px]:space-y-3">
          {pillars.map((item, idx) => (
            <MobilePillarCard
              key={item.id}
              item={item}
              idx={idx}
              isActive={activeIndex === idx}
              prefersReducedMotion={prefersReducedMotion}
              onTap={handleMobileTap}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
