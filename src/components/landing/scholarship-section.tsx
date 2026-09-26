'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { User, GraduationCap, BookOpen, BarChart3, Building2, Users, Trophy, CalendarDays, ArrowRight } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   WHY IDL EDUCATION — Premium Trust Section
   Polished design: unified panel + organic navy element with student overlap + refined cards + trust strip
   ══════════════════════════════════════════════════════════════════ */

/* ── InView hook for subtle scroll reveal ── */
function useInView(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold, rootMargin: '0px 0px -30px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

/* ── Card data (CONTENT LOCKED) ── */
const cards = [
    { num: '01', icon: User,          title: 'Student-Centric Approach',       desc: 'Every student is unique. We focus on individual learning needs, pace and goals.',                        accent: '#0A5CFF' },
    { num: '02', icon: GraduationCap,  title: 'Experienced & Caring Faculty',   desc: 'Learn from subject experts who simplify concepts and guide students at every step.',                    accent: '#D97706' },
    { num: '03', icon: BookOpen,       title: 'Complete Academic Support',      desc: 'Regular classes, doubt resolution, study material, tests and continuous guidance.',                     accent: '#059669' },
    { num: '04', icon: BarChart3,      title: 'Proven Track Record',            desc: 'Consistent results and real progress across school boards and competitive exams.',                      accent: '#DC2626' },
];

export function ScholarshipSection() {
    const section = useInView(0.08);

    /* ── Trust strip data (Fixed numbers) ── */
    const trustStats = [
        { icon: CalendarDays, value: '2016',            label: 'Our Journey Began' },
        { icon: Building2,    value: '5+',              label: 'Branches in Delhi' },
        { icon: Users,        value: '1000+',           label: 'Students Guided' },
        { icon: Trophy,       value: 'Academic Growth', label: 'Every Step Forward' },
    ];

    return (
        <section className="w-full bg-white dark:bg-background overflow-hidden">

            {/* ═══════════════════════════════════════════════
                UNIFIED PANEL — Hero + Cards inside one container
            ═══════════════════════════════════════════════ */}
            <div className="container max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 pt-5 sm:pt-7 md:pt-10 lg:pt-12">
                <div
                    ref={section.ref}
                    className={`
                        relative
                        rounded-[24px] sm:rounded-[28px] lg:rounded-[32px]
                        bg-gradient-to-br from-[#FAFCFF] via-[#F3F7FD] to-[#EBF2FB]
                        dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950
                        border border-[#E2EAF4] dark:border-slate-800
                        shadow-[0_4px_24px_rgba(11,29,63,0.03)]
                        overflow-visible
                        transition-all duration-700
                        ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    `}
                >
                    {/* Extremely subtle soft radial glows for depth */}
                    <div className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 bg-[#0A5CFF]/[0.02] rounded-full blur-3xl" />
                    <div className="pointer-events-none absolute top-1/4 right-[8%] w-80 h-80 bg-[#0A5CFF]/[0.025] rounded-full blur-3xl" />

                    {/* ─────────────────────────────────────────────
                        HERO CONTENT: Text (left) + Student (right)
                    ───────────────────────────────────────────── */}
                    <div className="relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 items-start lg:items-end">

                            {/* ── LEFT: Text ── */}
                            <div className="lg:col-span-6 xl:col-span-5 px-5 sm:px-7 md:px-9 lg:px-10 pt-4 sm:pt-5 md:pt-7 lg:pt-8 pb-2 sm:pb-3 lg:pb-6 flex flex-col justify-start">

                                {/* Main Heading */}
                                <h2
                                    className={`
                                        text-[30px] sm:text-[36px] md:text-[42px] lg:text-[46px] xl:text-[48px]
                                        font-extrabold leading-[1.08] tracking-[-0.025em]
                                        mb-2.5 sm:mb-3
                                        transition-all duration-600 delay-150
                                        ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                                    `}
                                >
                                    <span className="text-[#0B1D3F] dark:text-white block sm:inline lg:block mr-2 sm:mr-2.5 lg:mr-0">Why</span>
                                    <span className="text-[#0A5CFF] dark:text-blue-400">IDL Education?</span>
                                </h2>

                                {/* Description */}
                                <p
                                    className={`
                                        text-[13.5px] sm:text-[14px] md:text-[14.5px] lg:text-[15px]
                                        text-[#4F6382] dark:text-slate-400
                                        font-normal leading-[1.65]
                                        max-w-[400px]
                                        mb-3 sm:mb-4 lg:mb-5
                                        transition-all duration-600 delay-200
                                        ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                                    `}
                                >
                                    More than coaching — a complete learning ecosystem designed for every student&apos;s success.
                                </p>

                                {/* Students First badge */}
                                <div
                                    className={`
                                        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                                        bg-[#0A5CFF]/[0.08] hover:bg-[#0A5CFF]/[0.12]
                                        border border-[#0A5CFF]/15
                                        text-[#0A5CFF] dark:text-blue-400
                                        w-fit mb-2 sm:mb-3 lg:mb-4
                                        transition-all duration-600 delay-250
                                        ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                                    `}
                                >
                                    <span className="text-[12px] sm:text-[12.5px] font-bold italic tracking-tight">Students First</span>
                                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                                </div>

                            </div>

                            {/* ── RIGHT: Student Image with Organic Navy Panel ── */}
                            <div className="lg:col-span-6 xl:col-span-7 relative flex items-end justify-center lg:justify-end min-h-[210px] sm:min-h-[245px] lg:min-h-[315px] xl:min-h-[350px]">

                                {/* Subtle organic geometric backdrop behind navy panel */}
                                <div className="pointer-events-none absolute -top-6 right-2 sm:right-6 lg:right-10 w-44 sm:w-56 lg:w-72 h-44 sm:h-56 lg:h-72 rounded-full bg-[#0A5CFF]/[0.03] blur-2xl" />

                                {/* Navy geometric panel — refined height (approx 5-8% reduced) with natural head overlap */}
                                <div
                                    className={`
                                        absolute bottom-0
                                        w-[86%] sm:w-[76%] lg:w-[88%] xl:w-[84%]
                                        h-[78%] sm:h-[80%] lg:h-[82%]
                                        left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-0
                                        bg-gradient-to-tr from-[#081735] via-[#0B1D3F] to-[#102750]
                                        dark:from-slate-950 dark:via-blue-950/90 dark:to-blue-900/60
                                        rounded-t-[32px] sm:rounded-t-[46px] lg:rounded-tl-[100px] lg:rounded-tr-none
                                        rounded-b-none lg:rounded-br-[32px]
                                        transition-all duration-700 delay-100
                                        ${section.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                                    `}
                                />

                                {/* Student image — overlaps above navy panel naturally */}
                                <div
                                    className={`
                                        relative z-10
                                        w-[200px] h-[235px]
                                        min-[400px]:w-[225px] min-[400px]:h-[265px]
                                        sm:w-[250px] sm:h-[295px]
                                        md:w-[275px] md:h-[320px]
                                        lg:w-[295px] lg:h-[340px]
                                        xl:w-[325px] xl:h-[375px]
                                        mx-auto lg:mr-6 xl:mr-12
                                        transition-all duration-700 delay-200
                                        ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                                    `}
                                >
                                    <Image
                                        src="/scholarship.png"
                                        alt="IDL Education Student"
                                        fill
                                        className="object-contain object-bottom select-none pointer-events-none"
                                        sizes="(max-width: 640px) 230px, (max-width: 1024px) 300px, 360px"
                                        priority
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ─────────────────────────────────────────────
                        FEATURE CARDS — Overlapping bottom of panel
                    ───────────────────────────────────────────── */}
                    <div className="relative z-20 px-3 sm:px-4 md:px-6 lg:px-8 -mb-7 sm:-mb-9 lg:-mb-11">

                        {/* ── Desktop: 4-column grid ── */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3.5 lg:gap-4">
                            {cards.map((c, i) => {
                                const Icon = c.icon;
                                return (
                                    <div
                                        key={i}
                                        className={`
                                            group bg-white dark:bg-slate-900
                                            rounded-[20px]
                                            border border-[#E2EAF4] dark:border-slate-800
                                            shadow-[0_2px_12px_rgba(11,29,63,0.035)]
                                            hover:shadow-[0_8px_24px_rgba(11,29,63,0.07)]
                                            hover:-translate-y-1 transition-all duration-300
                                            overflow-hidden flex flex-col justify-between
                                            ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                                        `}
                                        style={{ transitionDelay: section.visible ? `${300 + i * 70}ms` : '0ms' }}
                                    >
                                        <div className="p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
                                            {/* Icon + Number row */}
                                            <div className="flex items-center justify-between mb-3.5 lg:mb-4">
                                                <div
                                                    className="w-[42px] h-[42px] lg:w-[44px] lg:h-[44px] rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: `${c.accent}0E` }}
                                                >
                                                    <Icon className="w-5 h-5" style={{ color: c.accent }} strokeWidth={2} />
                                                </div>
                                                <span className="text-[12px] lg:text-[13px] font-semibold font-mono tracking-wider text-[#94A3B8] dark:text-slate-500">
                                                    {c.num}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-[14.5px] lg:text-[15.5px] font-bold text-[#0B1D3F] dark:text-white leading-[1.3] mb-1.5">
                                                {c.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-[12px] lg:text-[12.5px] text-[#5D718F] dark:text-slate-400 font-normal leading-[1.6]">
                                                {c.desc}
                                            </p>
                                        </div>

                                        {/* Thin elegant accent line */}
                                        <div className="h-[2px] w-full" style={{ background: c.accent }} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Mobile: Single column compact cards ── */}
                        <div className="flex flex-col gap-2.5 sm:hidden">
                            {cards.map((c, i) => {
                                const Icon = c.icon;
                                return (
                                    <div
                                        key={i}
                                        className={`
                                            group bg-white dark:bg-slate-900
                                            rounded-[16px]
                                            border border-[#E2EAF4] dark:border-slate-800
                                            shadow-[0_1px_8px_rgba(11,29,63,0.03)]
                                            overflow-hidden
                                            transition-all duration-500 ease-out
                                            ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                                        `}
                                        style={{ transitionDelay: section.visible ? `${350 + i * 60}ms` : '0ms' }}
                                    >
                                        <div className="flex items-start gap-3 p-3.5 pr-3.5">
                                            {/* Icon circle */}
                                            <div
                                                className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ backgroundColor: `${c.accent}0E` }}
                                            >
                                                <Icon className="w-[18px] h-[18px]" style={{ color: c.accent }} strokeWidth={2} />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-[13.5px] font-bold text-[#0B1D3F] dark:text-white leading-snug">
                                                        {c.title}
                                                    </h3>
                                                    <span className="text-[11.5px] font-semibold font-mono text-[#94A3B8] dark:text-slate-500 tracking-wider shrink-0 mt-0.5">
                                                        {c.num}
                                                    </span>
                                                </div>
                                                <p className="text-[11.5px] text-[#5D718F] dark:text-slate-400 font-normal leading-[1.55] mt-1">
                                                    {c.desc}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Thin elegant accent line */}
                                        <div className="h-[2px] w-full" style={{ background: c.accent }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Spacer for overlapping cards ── */}
            <div className="h-10 sm:h-12 lg:h-14" />

            {/* ═══════════════════════════════════════════════
                NAVY TRUST STRIP
            ═══════════════════════════════════════════════ */}
            <div
                className={`
                    bg-gradient-to-r from-[#081735] via-[#0B1D3F] to-[#081735]
                    dark:from-slate-950 dark:via-blue-950/80 dark:to-slate-950
                    transition-all duration-700 delay-200
                    ${section.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
            >
                <div className="container max-w-[1280px] mx-auto px-4 md:px-6">

                    {/* Desktop: 4 in a row */}
                    <div className="hidden sm:grid sm:grid-cols-4 divide-x divide-white/[0.08]">
                        {trustStats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="flex items-center justify-center gap-3.5 py-5 md:py-6 lg:py-6 px-3">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 md:w-4.5 md:h-4.5 text-white/70" />
                                    </div>
                                    <div>
                                        <div className="text-[17px] md:text-[18px] lg:text-[20px] font-extrabold text-white leading-none tracking-tight">
                                            {s.value}
                                        </div>
                                        <div className="text-[10.5px] md:text-[11px] font-medium text-white/50 mt-1">
                                            {s.label}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile: 2×2 grid */}
                    <div className="grid grid-cols-2 gap-px sm:hidden bg-white/[0.06]">
                        {trustStats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="flex items-center gap-2.5 py-3.5 px-3 bg-[#0B1D3F]">
                                    <div className="w-7 h-7 rounded-lg bg-white/[0.07] border border-white/[0.06] flex items-center justify-center shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-white/65" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-extrabold text-white leading-none tracking-tight">
                                            {s.value}
                                        </div>
                                        <div className="text-[9.5px] font-medium text-white/45 mt-0.5">
                                            {s.label}
                                        </div>
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
