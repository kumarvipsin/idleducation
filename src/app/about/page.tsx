'use client';

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sparkles, Building2, Smartphone, Trophy, Users, Rocket } from "lucide-react";

export default function AboutPage() {
    const team = [
      {
        name: "Manish Kumar",
        title: "Head Product & Director",
        department: "Product & Technology",
        imageUrl: "/manish.png",
        imageAlt: "Manish Kumar",
        imageClass: "scale-[1.55] origin-[center_18%]",
      },
      {
        name: "Chandra Prakash",
        title: "Head Graphic Media",
        department: "Design & Creative Media",
        imageUrl: "/chandu.png",
        imageAlt: "Chandra Prakash",
        imageClass: "scale-[1.82] origin-[center_12%] -translate-y-3",
      },
      {
        name: "Vidhi Sharma",
        title: "Head Content Media",
        department: "Content & Editorial Strategy",
        imageUrl: "/vidhi.png",
        imageAlt: "Vidhi Sharma",
        imageClass: "scale-[1.5] origin-[center_18%]",
      },
    ];

    const journeyMilestones = [
      {
        year: "2021",
        icon: Sparkles,
        image: "/baground.jpg",
        imageAlt: "IDL Foundation in 2021",
        points: [
          "Amod Sharma & Vijay Verma laid the foundation of IDL Education with a visionary mission to democratize quality education across Bharat.",
          "Pioneered the personalized two-teacher hybrid learning pedagogy.",
        ],
      },
      {
        year: "2022",
        icon: Building2,
        image: "/baground.jpg",
        imageAlt: "IDL Learning Centers in 2022",
        points: [
          "Inaugurated dedicated offline learning centers to provide direct classroom mentorship and structured guidance.",
          "Crossed 5,000+ active students preparing for competitive and foundational examinations.",
        ],
      },
      {
        year: "2023",
        icon: Smartphone,
        image: "/baground.jpg",
        imageAlt: "IDL Digital App Launch in 2023",
        points: [
          "Launched the proprietary IDL Learning App, bringing interactive live classes, smart practice tests, and 24/7 doubt resolution directly to students' smartphones.",
          "Expanded comprehensive curriculums for national entrance exams including CUET and Olympiads.",
        ],
      },
      {
        year: "2024",
        icon: Trophy,
        image: "/baground.jpg",
        imageAlt: "IDL Academic Results in 2024",
        points: [
          "Delivered historic academic results with students securing top ranks and 99+ percentiles in competitive examinations.",
          "Instituted merit-based scholarships to empower underprivileged and deserving talent.",
        ],
      },
      {
        year: "2025",
        icon: Users,
        image: "/baground.jpg",
        imageAlt: "Pan-Bharat Student Community in 2025",
        points: [
          "Crossed 25,000+ empowered learners across digital cohorts and physical learning hubs nationwide.",
          "Introduced AI-assisted diagnostic learning pathways and specialized educator training programs.",
        ],
      },
      {
        year: "2026",
        icon: Rocket,
        image: "/baground.jpg",
        imageAlt: "IDL Nationwide Platform Launch in 2026",
        points: [
          "Scaling the educational footprint nationwide with advanced smart classrooms, holistic pedagogy, and community learning hubs.",
          "Empowering the next generation of students across Bharat to dream bigger, learn better, and build a brighter future.",
        ],
      },
    ];

    const [activeYearIndex, setActiveYearIndex] = useState(0);
    const currentMilestone = journeyMilestones[activeYearIndex];

  return (
    <div className="bg-white dark:bg-background">
        {/* MEET OUR FOUNDERS SECTION - FULL BLACK BG LEFT-TO-RIGHT WITH MINIMAL TOP/BOTTOM SPACING */}
        <section className="w-full bg-[#050507] relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-14 border-b border-white/10">
            {/* Ambient Lighting Glows */}
            <div className="absolute -left-28 top-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -right-28 top-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute left-1/2 top-4 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Title - Elegant & Premium Typography */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white/85 tracking-normal mb-0.5">
                        Meet Our
                    </h2>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent pb-1">
                        Founders
                    </h1>
                </div>

                {/* 2 Founder Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-9 max-w-5xl lg:max-w-6xl mx-auto items-stretch">
                    {/* FOUNDER 1: AMOD SHARMA (YELLOW / GOLD CARD) */}
                    <div className="group relative overflow-hidden rounded-[2rem] pt-8 px-7 pb-7 flex flex-col justify-between min-h-[540px] sm:min-h-[570px] md:min-h-[590px] lg:min-h-[610px] bg-gradient-to-br from-[#FAB714] via-[#F8B513] to-[#EE9E02] shadow-[0_25px_60px_-15px_rgba(245,183,19,0.35)] transition-shadow duration-500 hover:shadow-[0_30px_70px_-15px_rgba(245,183,19,0.5)]">
                        {/* Header Info */}
                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                                Amod Sharma
                            </h3>
                            <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-900/80 mt-1">
                                Founder & CEO
                            </p>
                        </div>

                        {/* Single-line Vertical Watermark Text on Right */}
                        <div 
                            className="absolute right-2 sm:right-3 top-0 bottom-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden"
                            aria-hidden="true"
                        >
                            <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-black/[0.08] tracking-widest uppercase [writing-mode:vertical-rl] whitespace-nowrap leading-none">
                                AMOD SHARMA
                            </span>
                        </div>

                        {/* Cutout Image of Founder - Lowered 25% with smooth hover floating motion */}
                        <div className="absolute inset-x-0 bottom-28 sm:bottom-32 top-20 sm:top-24 md:top-28 flex items-end justify-center pointer-events-none z-10">
                            <div className="relative w-80 sm:w-96 md:w-[420px] h-[95%] sm:h-[98%] scale-105 sm:scale-110 origin-bottom transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.12]">
                                <Image
                                    src="/director.png"
                                    alt="Amod Sharma"
                                    fill
                                    priority
                                    className="object-contain object-bottom drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* White Quote Box - 25% Larger & Extra Bold Typography */}
                        <div className="relative z-20 bg-white rounded-2xl p-5 sm:p-6 shadow-xl mt-auto">
                            <svg className="w-6 h-6 text-slate-400 mb-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-[15px] sm:text-[17px] md:text-lg font-bold sm:font-extrabold text-slate-900 leading-snug tracking-tight">
                                &ldquo;My vision is to make quality education more accessible, meaningful, and transformative—empowering every student to dream bigger, learn better, and build a brighter future.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* FOUNDER 2: VIJAY VERMA (SKY BLUE CARD) */}
                    <div className="group relative overflow-hidden rounded-[2rem] pt-8 px-7 pb-7 flex flex-col justify-between min-h-[540px] sm:min-h-[570px] md:min-h-[590px] lg:min-h-[610px] bg-gradient-to-br from-[#4EA8F9] via-[#439DF5] to-[#2587E8] shadow-[0_25px_60px_-15px_rgba(67,157,245,0.4)] transition-shadow duration-500 hover:shadow-[0_30px_70px_-15px_rgba(67,157,245,0.55)]">
                        {/* Header Info */}
                        <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#07192f]">
                                Vijay Verma
                            </h3>
                            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#0c2a50]/80 mt-1">
                                Co-Founder
                            </p>
                        </div>

                        {/* Single-line Vertical Watermark Text on Right */}
                        <div 
                            className="absolute right-2 sm:right-3 top-0 bottom-0 flex items-center justify-center select-none pointer-events-none z-0 overflow-hidden"
                            aria-hidden="true"
                        >
                            <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-white/[0.18] tracking-widest uppercase [writing-mode:vertical-rl] whitespace-nowrap leading-none">
                                VIJAY VERMA
                            </span>
                        </div>

                        {/* Cutout Image of Co-Founder - Lowered 25% with smooth hover floating motion */}
                        <div className="absolute inset-x-0 bottom-28 sm:bottom-32 top-20 sm:top-24 md:top-28 flex items-end justify-center pointer-events-none z-10">
                            <div className="relative w-80 sm:w-96 md:w-[420px] h-[95%] sm:h-[98%] scale-105 sm:scale-110 origin-bottom transition-transform duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-[1.12]">
                                <Image
                                    src="/vijay.png"
                                    alt="Vijay Verma"
                                    fill
                                    priority
                                    className="object-contain object-bottom drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* White Quote Box - Matching Card 1 */}
                        <div className="relative z-20 bg-white rounded-2xl p-5 sm:p-6 shadow-xl mt-auto">
                            <svg className="w-6 h-6 text-slate-400 mb-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-[15px] sm:text-[17px] md:text-lg font-bold sm:font-extrabold text-slate-900 leading-snug tracking-tight">
                                &ldquo;We are committed to putting students first and leveraging technology to make learning more accessible and impactful—empowering and inspiring the next generation across Bharat.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* MEET OUR TEAM SECTION - SOLID, REFINED CORPORATE ARCHITECTURE */}
        <section className="w-full py-14 sm:py-16 md:py-20 bg-white dark:bg-background relative overflow-hidden border-t border-border/40">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header - Bolder, Prominent & High-Contrast Typography */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Meet Our Team
                    </h2>
                    <p className="text-sm sm:text-base text-foreground/80 font-bold mt-2.5 leading-relaxed">
                        The strategic leaders driving academic excellence, product innovation, and creative media at IDL Education.
                    </p>
                </div>
                
                {/* 3 Executive Cards Grid - Black & White Portrait with Ultra-Premium Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
                    {team.map((member) => (
                        <div 
                            key={member.name}
                            className="rounded-2xl bg-white dark:bg-card border border-border/80 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden"
                        >
                            {/* Top Half: Zoomed Black & White Portrait starting from hands */}
                            <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-100/90 to-slate-200/50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900/60 flex items-center justify-center">
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={member.imageUrl}
                                        alt={member.imageAlt}
                                        fill
                                        className={cn("object-contain drop-shadow-md grayscale contrast-[1.08]", member.imageClass)}
                                    />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/[0.06] to-transparent pointer-events-none" />
                            </div>

                            {/* Bottom Half: Ultra-Premium Editorial Typography Block */}
                            <div className="p-6 flex flex-col justify-between flex-1 bg-white dark:bg-card border-t border-border/40 text-center">
                                <div>
                                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 mb-2.5">
                                        {member.title}
                                    </span>
                                    <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                                        {member.name}
                                    </h3>
                                </div>
                                <div className="pt-3 mt-3 border-t border-border/50">
                                    <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                                        {member.department}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* OUR JOURNEY TIMELINE SECTION (2021 - 2026) - CLEAN PREMIUM LIGHT BG */}
        <section className="w-full py-16 sm:py-20 md:py-24 bg-[#f8f9fc] dark:bg-slate-900/40 relative overflow-hidden border-t border-border/30">

            {/* Giant Background Watermark Year */}
            <div 
                className="absolute top-14 left-1/2 -translate-x-1/2 select-none pointer-events-none font-black text-[8rem] sm:text-[12rem] md:text-[15rem] text-slate-200/80 dark:text-slate-800/30 tracking-tighter leading-none z-0 transition-all duration-500"
                aria-hidden="true"
            >
                {currentMilestone.year}
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header - Pure Black Typography */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white pb-1">
                        The Journey of IDL
                    </h2>
                    <p className="text-sm sm:text-base text-foreground/85 font-extrabold mt-2.5 leading-relaxed">
                        From foundational beginnings to empowering millions across Bharat
                    </p>
                </div>

                {/* Horizontal Stepper / Timeline Tracker - Completely unclipped on all screen sizes */}
                <div className="relative max-w-4xl mx-auto mb-10 sm:mb-14 px-2 sm:px-4">
                    {/* Connecting Dashed Line */}
                    <div className="absolute top-[2.75rem] sm:top-[3.25rem] left-8 right-8 h-[2px] border-t-2 border-dashed border-slate-300 dark:border-slate-700 -translate-y-1/2 z-0 hidden sm:block" />

                    <div className="flex items-center justify-between relative z-10 py-2 gap-1 sm:gap-2">
                        {journeyMilestones.map((milestone, idx) => {
                            const IconComponent = milestone.icon;
                            const isActive = idx === activeYearIndex;
                            return (
                                <button
                                    key={milestone.year}
                                    type="button"
                                    onClick={() => setActiveYearIndex(idx)}
                                    className="flex flex-col items-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 active:outline-none select-none transition-all duration-300 flex-1 min-w-0"
                                >
                                    <span className={cn(
                                        "text-[11px] sm:text-sm font-bold mb-2 transition-all duration-300",
                                        isActive ? "text-primary font-black scale-105" : "text-muted-foreground group-hover:text-foreground"
                                    )}>
                                        {milestone.year}
                                    </span>
                                    <div className={cn(
                                        "w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300",
                                        isActive 
                                            ? "bg-primary text-white shadow-md ring-2 sm:ring-4 ring-primary/25 scale-105" 
                                            : "bg-white dark:bg-card text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 group-hover:border-primary/50 group-hover:text-foreground"
                                    )}>
                                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Milestone Detail Card - Light Outline, Zero Shadow, Perfectly Fitted 3:2 Image */}
                <div className="relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-card p-4 sm:p-7 md:p-9 shadow-none transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 lg:gap-9 items-center">
                        {/* Left: Image Container - Strictly 3:2 aspect ratio matching idlbranch.png native size (1536x1024) so no portion is cut off */}
                        <div className="md:col-span-7 relative w-full aspect-[3/2] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <Image
                                src={currentMilestone.image}
                                alt={currentMilestone.imageAlt}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 58vw"
                                className="object-cover object-center transition-all duration-500"
                            />
                        </div>

                        {/* Right: Milestone Content (5 Cols) */}
                        <div className="md:col-span-5 space-y-4 sm:space-y-5">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                    Milestone
                                </span>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mt-1">
                                    In <span className="text-primary">{currentMilestone.year}</span>
                                </h3>
                            </div>

                            <div className="space-y-3 sm:space-y-3.5">
                                {currentMilestone.points.map((point, pIdx) => (
                                    <div key={pIdx} className="flex items-start gap-3">
                                        <span className="text-amber-500 text-lg sm:text-xl shrink-0 leading-none mt-0.5 select-none">
                                            ★
                                        </span>
                                        <p className="text-sm sm:text-base text-foreground/90 font-medium leading-relaxed">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}
