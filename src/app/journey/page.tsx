'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Sparkles, Building2, Smartphone, Trophy, Users, Rocket,
  ArrowRight, Calendar, Compass, ShieldCheck, HeartHandshake, CheckCircle2
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
    image: '/idlbranch.png',
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
    image: '/idlapp.png',
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
    image: '/result.jpg',
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
    image: '/students-banner.jpg',
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
    image: '/idlbranch1.png',
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
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 bg-gradient-to-b from-[#0B1F4B] via-[#0D265C] to-[#0B1F4B] text-white border-b border-white/10">
        {/* Subtle Ambient Glows */}
        <div className="absolute -left-20 top-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-amber-300 mb-5 select-none">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Growth Story</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            The Journey of <span className="text-[#FF6B00]">IDL</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto">
            From foundational beginnings to empowering students through learning, guidance and growth.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-300 font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
              <span>Founded 2021</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Offline & Digital Hubs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Nationwide Vision</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESKTOP INTERACTIVE TIMELINE (Hidden on mobile <768px) */}
      <section className="hidden md:block py-16 lg:py-20 bg-[#F8FAFD] dark:bg-slate-900/40 relative overflow-hidden border-b border-border/40">
        {/* Giant Background Watermark Year */}
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none font-black text-[13rem] lg:text-[16rem] text-slate-200/70 dark:text-slate-800/30 tracking-tighter leading-none z-0 transition-all duration-300"
          aria-hidden="true"
        >
          {currentMilestone.year}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Horizontal Stepper / Progress line */}
          <div className="relative max-w-4xl mx-auto mb-12 lg:mb-16">
            {/* Connecting Horizontal Line */}
            <div className="absolute top-[3rem] left-10 right-10 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-[3rem] left-10 h-[2px] bg-[#1F4FA3] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(activeYearIndex / (milestones.length - 1)) * 100}%` }}
            />

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between relative z-10 py-2">
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
                      "text-xs lg:text-sm font-bold mb-2.5 transition-colors",
                      isActive ? "text-[#1F4FA3] dark:text-blue-400 font-extrabold scale-105" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                    )}>
                      {milestone.year}
                    </span>
                    <div className={cn(
                      "w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-200 border",
                      isActive 
                        ? "bg-[#1F4FA3] text-white border-[#1F4FA3] shadow-lg ring-4 ring-blue-500/20 scale-105" 
                        : "bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-800 group-hover:border-[#1F4FA3]/50 group-hover:text-slate-700 dark:group-hover:text-slate-300 shadow-sm"
                    )}>
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestone Detail Presentation Card */}
          <div className="relative max-w-5xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-card p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300">
            <div className="grid grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Milestone Photo (7 cols) */}
              <div className="col-span-7 relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-inner">
                <Image
                  src={currentMilestone.image}
                  alt={currentMilestone.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 60vw, 55vw"
                  className="object-cover object-center transition-all duration-500"
                />
              </div>

              {/* Right Column: Milestone Narrative (5 cols) */}
              <div className="col-span-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#1F4FA3] border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                    <Calendar className="w-3 h-3" />
                    <span>Milestone Year</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                    In <span className="text-[#FF6B00]">{currentMilestone.year}</span>
                  </h2>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {currentMilestone.title}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {currentMilestone.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#1F4FA3] dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm lg:text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
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

      {/* 3. MOBILE VERTICAL TIMELINE (Visible on mobile <768px) */}
      <section className="block md:hidden py-10 sm:py-14 bg-[#F8FAFD] dark:bg-slate-900/40 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4FA3] dark:text-blue-400">
              Chronological Growth
            </span>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white mt-1">
              Milestone Timeline
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-10 ml-3">
            {milestones.map((milestone) => {
              const IconComponent = milestone.icon;
              return (
                <div key={milestone.year} className="relative">
                  {/* Node icon pinned on timeline line */}
                  <div className="absolute -left-[37px] sm:-left-[45px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1F4FA3] text-white flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-950">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-[#FF6B00] uppercase tracking-wider">
                        Year {milestone.year}
                      </span>
                      <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        {milestone.subtitle}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-950 dark:text-white tracking-tight">
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
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
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
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B00]">
            The Journey Continues
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
            Be Part of Our Next Chapter
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
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
