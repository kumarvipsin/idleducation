'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Sparkles, Building2, Smartphone, Trophy, Users, Rocket,
  ArrowRight, Calendar, CheckCircle2
} from 'lucide-react';

const milestones = [
  {
    year: '2021',
    title: 'The Foundation of IDL',
    subtitle: 'Democratizing Quality Education',
    icon: Sparkles,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    iconBg: 'bg-amber-500 text-white',
    image: '/baground.jpg',
    imageAlt: 'IDL Foundation Team in 2021',
    points: [
      'Amod Sharma & Vijay Verma laid the foundation of IDL Education with a visionary mission to democratize quality education across Bharat.',
      'Pioneered the personalized two-teacher hybrid learning pedagogy to ensure conceptual mastery.',
    ],
  },
  {
    year: '2022',
    title: 'Offline Learning Centers',
    subtitle: 'Direct Classroom Mentorship',
    icon: Building2,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    iconBg: 'bg-[#1F4FA3] text-white',
    image: '/baground.jpg',
    imageAlt: 'IDL Learning Centers in 2022',
    points: [
      'Inaugurated dedicated offline learning centers to provide direct classroom mentorship and structured guidance.',
      'Crossed 5,000+ active students preparing for competitive and foundational examinations.',
    ],
  },
  {
    year: '2023',
    title: 'Digital Learning App Launch',
    subtitle: 'Anytime, Anywhere Learning',
    icon: Smartphone,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    iconBg: 'bg-emerald-600 text-white',
    image: '/baground.jpg',
    imageAlt: 'IDL Digital Learning App in 2023',
    points: [
      'Launched the proprietary IDL Learning App, bringing interactive live classes, smart practice tests, and 24/7 doubt resolution directly to students\' smartphones.',
      'Expanded comprehensive curriculums for national entrance exams including CUET and Olympiads.',
    ],
  },
  {
    year: '2024',
    title: 'Historic Academic Results',
    subtitle: 'Merit Scholarships & Top Ranks',
    icon: Trophy,
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    iconBg: 'bg-[#FF6B00] text-white',
    image: '/baground.jpg',
    imageAlt: 'IDL Academic Results in 2024',
    points: [
      'Delivered historic academic results with students securing top ranks and 99+ percentiles in competitive examinations.',
      'Instituted merit-based scholarships to empower underprivileged and deserving talent across Bharat.',
    ],
  },
  {
    year: '2025',
    title: 'Pan-Bharat Student Community',
    subtitle: 'Diagnostic Learning Pathways',
    icon: Users,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    iconBg: 'bg-purple-600 text-white',
    image: '/baground.jpg',
    imageAlt: 'Pan-Bharat Student Community in 2025',
    points: [
      'Crossed 25,000+ empowered learners across digital cohorts and physical learning hubs nationwide.',
      'Introduced AI-assisted diagnostic learning pathways and specialized educator training programs.',
    ],
  },
  {
    year: '2026',
    title: 'Nationwide Expansion & Vision',
    subtitle: 'Smart Classrooms & Community Hubs',
    icon: Rocket,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    iconBg: 'bg-[#0B1F4B] text-white',
    image: '/baground.jpg',
    imageAlt: 'IDL Smart Classrooms and Nationwide Hubs in 2026',
    points: [
      'Scaling the educational footprint nationwide with advanced smart classrooms, holistic pedagogy, and community learning hubs.',
      'Empowering the next generation of students across Bharat to dream bigger, learn better, and build a brighter future.',
    ],
  },
];

export default function JourneyPage() {
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const currentMilestone = milestones[activeYearIndex];

  return (
    <div className="bg-white dark:bg-background min-h-screen">
      {/* 1. HERO SECTION — PREMIUM EDITORIAL DESIGN */}
      <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-[#061026] via-[#0B1F4B] to-[#0A1A3F] text-white min-h-[500px] lg:min-h-[540px] flex items-center justify-center border-b border-white/10">
        {/* Subtle Atmospheric Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-70" />
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/[0.12] to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-28 -right-20 w-[460px] h-[460px] bg-gradient-to-tl from-[#FF6B00]/[0.08] to-transparent rounded-full blur-[130px] pointer-events-none" />

        {/* Subtle Decorative Journey Trajectory Line (Faint Atmospheric Motif) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-3 w-[600px] lg:w-[720px] h-[65px] pointer-events-none z-0 overflow-visible"
        >
          <svg className="w-full h-full overflow-visible" viewBox="0 0 720 65" fill="none">
            <path
              d="M 10 50 C 180 50, 260 16, 410 24 C 530 30, 610 12, 710 8"
              stroke="url(#journeyHeroPath)"
              strokeWidth="1.25"
              strokeDasharray="4 5"
            />
            <defs>
              <linearGradient id="journeyHeroPath" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <circle cx="10" cy="50" r="2.5" fill="#60A5FA" fillOpacity="0.35" />
            <circle cx="340" cy="26" r="2.5" fill="#93C5FD" fillOpacity="0.45" />
            <circle cx="710" cy="8" r="3.5" fill="#FF6B00" fillOpacity="0.8" />
          </svg>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          {/* Eyebrow Label */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="inline-flex items-center gap-2 mb-3.5 sm:mb-4"
          >
            <span className="w-2.5 h-0.5 rounded-full bg-[#FF6B00] shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
              Our Growth Story
            </span>
          </motion.div>

          {/* Large Editorial Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="text-[38px] sm:text-[46px] md:text-[54px] lg:text-[64px] xl:text-[70px] font-black tracking-tight text-white leading-[1.08]"
          >
            <span>The Journey of </span><span className="text-[#FF6B00]">IDL</span>
          </motion.h1>

          {/* Supporting Statement */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
            className="mt-4 sm:mt-5 text-[17px] sm:text-[19px] lg:text-[20px] text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            From foundational beginnings to empowering students through learning, guidance and growth.
          </motion.p>

          {/* Compact Factual Highlights Row */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            className="mt-7 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-2 gap-x-3 sm:gap-x-4 text-xs sm:text-[13px] font-semibold text-slate-300 select-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
              <span>Founded 2021</span>
            </div>
            <span className="text-white/20 select-none">·</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>Offline &amp; Digital Hubs</span>
            </div>
            <span className="text-white/20 select-none">·</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Nationwide Vision</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DESKTOP INTERACTIVE TIMELINE (Hidden on mobile <768px) */}
      <section className="hidden md:block py-14 sm:py-16 lg:py-20 bg-[#FAFBFD] dark:bg-[#070C18] relative overflow-hidden border-b border-border/40">
        {/* Subtle Ambient Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#102a6809_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/[0.04] to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-10 lg:mb-12 max-w-xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#1F4FA3] dark:text-blue-400">
              Chronological Growth
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-slate-950 dark:text-white tracking-tight mt-1.5 leading-tight">
              Milestone Timeline
            </h2>
          </div>

          {/* Refined Horizontal Timeline Stepper */}
          <div className="relative max-w-4xl mx-auto mb-10 lg:mb-12 px-4">
            {/* Connecting Line Track */}
            <div className="absolute top-[2.75rem] left-10 right-10 h-[1.5px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-[2.75rem] left-10 h-[1.5px] bg-[#1F4FA3] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(activeYearIndex / (milestones.length - 1)) * (100 - 10)}%` }}
            />

            {/* Stepper Interactive Nodes */}
            <div className="flex items-center justify-between relative z-10 py-1">
              {milestones.map((milestone, idx) => {
                const IconComponent = milestone.icon;
                const isActive = idx === activeYearIndex;
                return (
                  <button
                    key={milestone.year}
                    type="button"
                    onClick={() => setActiveYearIndex(idx)}
                    className="flex flex-col items-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none active:outline-none select-none transition-all duration-200"
                  >
                    <span className={cn(
                      "text-xs lg:text-[13px] font-bold mb-2 transition-all duration-200",
                      isActive 
                        ? "text-[#102A68] dark:text-white font-black scale-105" 
                        : "text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                    )}>
                      {milestone.year}
                    </span>
                    <div className={cn(
                      "w-11 h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-200 border",
                      isActive 
                        ? "bg-[#102A68] text-white border-[#102A68] shadow-md ring-4 ring-[#1F4FA3]/15 scale-105" 
                        : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 group-hover:border-[#1F4FA3]/40 group-hover:text-slate-700 dark:group-hover:text-slate-300 shadow-xs"
                    )}>
                      <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestone Detail Card (Balanced 52/48 composition) */}
          <div className="relative max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMilestone.year}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-card p-6 sm:p-8 lg:p-9 shadow-xs"
              >
                <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">
                  {/* Left Column: Real Milestone Photo (6 cols on lg) */}
                  <div className="col-span-12 lg:col-span-6 relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <Image
                      src={currentMilestone.image}
                      alt={currentMilestone.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 60vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>

                  {/* Right Column: Milestone Narrative (6 cols on lg) */}
                  <div className="col-span-12 lg:col-span-6 space-y-3.5">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#1F4FA3] border border-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/50">
                        <Calendar className="w-3 h-3" />
                        <span>MILESTONE</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-950 dark:text-white tracking-tight pt-0.5">
                        In <span className="text-[#FF6B00]">{currentMilestone.year}</span>
                      </h3>
                      <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        {currentMilestone.title}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1.5">
                      {currentMilestone.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#1F4FA3] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 dark:border-blue-900/50">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-sm lg:text-[14.5px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. MOBILE VERTICAL TIMELINE (Visible on mobile <768px) */}
      <section className="block md:hidden py-10 sm:py-12 bg-[#FAFBFD] dark:bg-[#070C18] border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1F4FA3] dark:text-blue-400">
              Chronological Growth
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-1 tracking-tight">
              Milestone Timeline
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 ml-3">
            {milestones.map((milestone) => {
              const IconComponent = milestone.icon;
              return (
                <div key={milestone.year} className="relative">
                  {/* Node icon pinned on timeline line */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#102A68] text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-slate-950">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider">
                        Year {milestone.year}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {milestone.subtitle}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white tracking-tight">
                      {milestone.title}
                    </h3>

                    {/* Milestone Image */}
                    <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <Image
                        src={milestone.image}
                        alt={milestone.imageAlt}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Points */}
                    <div className="space-y-2 pt-1">
                      {milestone.points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4FA3] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CLOSING CTA TO ABOUT US & COURSES */}
      <section className="py-14 sm:py-16 md:py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#FF6B00]">
            The Journey Continues
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-1.5">
            Be Part of Our Next Chapter
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
            Discover how IDL Education pairs passionate educators with structured pedagogy to help students thrive.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F4B] hover:bg-[#142B63] text-white text-sm font-bold transition-colors shadow-sm"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/free-courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold transition-colors"
            >
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
