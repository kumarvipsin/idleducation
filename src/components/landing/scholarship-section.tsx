'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   WHY IDL EDUCATION — Modern, Balanced & Suitable Redesign
   Features:
   - Clean, centered section header matching IDL Stars & Study Resources
   - Split layout: Human visual showcase card (Left) + 4 Value Pillars in 2x2 grid (Right)
   - High-trust bottom metrics banner cleanly integrated within the container
   - Pure, harmonious color palette without harsh or awkward cutouts
   ══════════════════════════════════════════════════════════════════ */

/* ── InView hook for subtle scroll reveal ── */
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold, rootMargin: '0px 0px -20px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Core Value Pillars Data ── */
const cards = [
  { 
    num: '01', 
    icon: User, 
    title: 'Student-Centric Approach', 
    desc: 'Every student is unique. We focus on individual learning needs, pace and personal academic goals.', 
    accent: '#1D4ED8' 
  },
  { 
    num: '02', 
    icon: GraduationCap, 
    title: 'Experienced & Caring Faculty', 
    desc: 'Learn from seasoned subject experts who simplify concepts and mentor students at every single step.', 
    accent: '#D97706' 
  },
  { 
    num: '03', 
    icon: BookOpen, 
    title: 'Complete Academic Support', 
    desc: 'Regular interactive classes, doubt resolution, curated study material, tests and continuous guidance.', 
    accent: '#059669' 
  },
  { 
    num: '04', 
    icon: BarChart3, 
    title: 'Proven Track Record', 
    desc: 'Consistent top board results and measurable progress across school examinations and competitions.', 
    accent: '#7C3AED' 
  },
];

export function ScholarshipSection() {
  const section = useInView(0.06);

  return (
    <section 
      id="why-idl-education" 
      className="w-full py-12 sm:py-16 md:py-20 bg-white dark:bg-background overflow-hidden relative"
    >
      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-blue-500/[0.025] dark:bg-blue-500/[0.015] rounded-full blur-3xl" />

      <div ref={section.ref} className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── 1. Section Header ── */}
        <div className={`text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14 transition-all duration-700 ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-[#1D4ED8] dark:text-blue-400 text-xs font-semibold mb-3 tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-blue-400" />
            <span>The IDL Difference</span>
          </div>

          <h2 className="text-[24px] sm:text-[30px] md:text-[38px] font-[720] tracking-[-0.02em] text-[#062B67] dark:text-white leading-[1.15] mb-3">
            Why <span className="text-[#155EEF] dark:text-blue-400">IDL Education?</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
            More than coaching — a complete learning ecosystem designed for every student&apos;s academic excellence, clarity, and overall growth.
          </p>
        </div>

        {/* ── 2. Main Content Split Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* ── LEFT: Human Visual Showcase Card (lg:col-span-5) ── */}
          <div 
            className={`
              lg:col-span-5 relative rounded-[24px] sm:rounded-[28px] overflow-hidden 
              bg-gradient-to-b from-[#EEF4FD] via-[#F4F8FE] to-[#E3EDFA] 
              dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 
              border border-blue-100/90 dark:border-slate-800 
              shadow-[0_4px_20px_-4px_rgba(10,30,66,0.06)] 
              flex flex-col justify-between p-6 sm:p-7 min-h-[420px] lg:min-h-full
              transition-all duration-700 delay-100
              ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            {/* Subtle decorative concentric rings in backdrop */}
            <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full border border-blue-200/40 dark:border-blue-900/30" />
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full border border-blue-200/25 dark:border-blue-900/20" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-60 h-60 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-2xl" />

            {/* Top Badge & Micro-pitch */}
            <div className="relative z-20 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/70 dark:border-slate-700 shadow-sm text-xs font-semibold text-[#0A1E42] dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Students First Philosophy</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-[#1D4ED8] dark:text-blue-300 text-[11px] font-semibold">
                <span>Since 2016</span>
              </div>
            </div>

            {/* Student Image with Natural Floor Stance */}
            <div className="relative z-10 w-[230px] sm:w-[270px] lg:w-[290px] xl:w-[310px] h-[270px] sm:h-[310px] lg:h-[340px] xl:h-[360px] mx-auto mt-4 sm:mt-6 flex items-end justify-center">
              <Image
                src="/scholarship.png"
                alt="IDL Education Confident Student"
                fill
                className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(10,30,66,0.12)]"
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 290px, 330px"
                priority
              />
            </div>

            {/* Bottom Floating Stats Pill */}
            <div className="relative z-20 mt-3 pt-2">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-[0_4px_16px_rgba(10,30,66,0.06)]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#1D4ED8] dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-[13px] font-bold text-[#0A1E42] dark:text-white leading-tight truncate">
                      Personalized Mentorship
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-none mt-0.5 truncate">
                      Tailored guidance for every individual learner
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-[#1D4ED8] dark:text-blue-400 shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: 4 Core Pillars in 2x2 Grid (lg:col-span-7) ── */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-full">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className={`
                    group relative bg-white dark:bg-slate-900 
                    rounded-[22px] p-5 sm:p-6 
                    border border-slate-200/80 dark:border-slate-800 
                    shadow-[0_2px_12px_-4px_rgba(10,30,66,0.04)] 
                    hover:shadow-[0_12px_28px_-6px_rgba(10,30,66,0.09)] 
                    hover:-translate-y-1 
                    transition-all duration-300 
                    flex flex-col justify-between overflow-hidden
                    ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                  `}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                >
                  {/* Subtle hover background accent aura */}
                  <div 
                    className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" 
                    style={{ backgroundColor: `${c.accent}18` }}
                  />

                  <div>
                    {/* Top Row: Icon Container + Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                          backgroundColor: `${c.accent}12`, 
                          color: c.accent 
                        }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.2} />
                      </div>
                      <span className="text-[12px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {c.num}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#0A1E42] dark:text-white leading-snug mb-2 group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors">
                      {c.title}
                    </h3>

                    {/* Card Description */}
                    <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-400 font-normal leading-[1.6]">
                      {c.desc}
                    </p>
                  </div>

                  {/* Micro Accent Bar at bottom */}
                  <div className="pt-4 mt-2">
                    <div 
                      className="h-[2.5px] w-8 rounded-full transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: c.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
