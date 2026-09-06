'use client';

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { 
  ArrowRight, Compass, 
  BookOpen, TrendingUp, MessageSquare, Phone,
  Cpu, Palette, Sparkles
} from "lucide-react";
import { ContactModal } from "@/components/contact-modal";

export default function AboutPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const team = [
      {
        name: "Manish Kumar",
        title: "Head Product & Director",
        department: "Product & Technology",
        imageUrl: "/manish.png",
        imageAlt: "Manish Kumar",
        imageClass: "scale-[1.52] origin-[center_18%]",
        icon: Cpu,
        dotColor: "bg-[#1F4FA3]",
        accentLine: "bg-[#1F4FA3]",
        iconColor: "text-[#1F4FA3]",
        hoverBorder: "hover:border-[#1F4FA3]/35",
      },
      {
        name: "Chandra Prakash",
        title: "Head Graphic Media",
        department: "Design & Creative Media",
        imageUrl: "/chandu.png",
        imageAlt: "Chandra Prakash",
        imageClass: "scale-[1.78] origin-[center_13%] -translate-y-2.5",
        icon: Palette,
        dotColor: "bg-[#FF6B00]",
        accentLine: "bg-[#FF6B00]",
        iconColor: "text-[#FF6B00]",
        hoverBorder: "hover:border-[#FF6B00]/35",
      },
      {
        name: "Vidhi Sharma",
        title: "Head Content Media",
        department: "Content & Editorial Strategy",
        imageUrl: "/vidhi.png",
        imageAlt: "Vidhi Sharma",
        imageClass: "scale-[1.62] origin-[center_18%]",
        icon: Sparkles,
        dotColor: "bg-emerald-600",
        accentLine: "bg-emerald-600",
        iconColor: "text-emerald-600",
        hoverBorder: "hover:border-emerald-500/35",
      },
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        loop: true,
        align: "start",
      },
      [
        Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
      ]
    );
    const [activeIndex, setActiveIndex] = useState(0);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setActiveIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;
      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, onSelect]);

    function TeamCard({ member }: { member: (typeof team)[0] }) {
      const IconComponent = member.icon;
      return (
        <div 
          className={cn(
            "group rounded-2xl bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_-3px_rgba(11,31,75,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(11,31,75,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col overflow-hidden relative h-full",
            member.hoverBorder
          )}
        >
          {/* Portrait Container with Subtle Cool-Grey/Blue Background (No White Fade) */}
          <div className="relative w-full h-52 sm:h-56 lg:h-60 overflow-hidden bg-gradient-to-b from-[#F4F7FB] via-[#EFF3F9] to-[#E5EDF6] dark:from-slate-800/80 dark:to-slate-900/80 flex items-end justify-center border-b border-slate-100 dark:border-slate-800/60">
            <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
              <Image
                src={member.imageUrl}
                alt={member.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 32vw, 340px"
                className={cn(
                  "object-contain object-bottom grayscale contrast-[1.08] transition-transform duration-500 ease-out group-hover:scale-[1.01]",
                  member.imageClass
                )}
              />
            </div>
          </div>

          {/* Profile Info Area — Clean, Structured, No Watermark */}
          <div className="p-4 sm:p-5 flex flex-col items-center justify-between flex-1 bg-white dark:bg-card relative z-10 text-center">
            <div className="flex flex-col items-center w-full">
              {/* Role Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.14em] bg-slate-50/90 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 mb-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", member.dotColor)} />
                <span>{member.title}</span>
              </div>

              {/* Member Name */}
              <h3 className="text-xl sm:text-[22px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-snug">
                {member.name}
              </h3>

              {/* Micro Accent Divider */}
              <div className="my-2 flex items-center justify-center w-full">
                <div className={cn("h-[2px] w-7 rounded-full transition-all duration-300 group-hover:w-10", member.accentLine)} />
              </div>

              {/* Department Metadata */}
              <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 tracking-wide flex items-center justify-center gap-1.5">
                <IconComponent className={cn("w-3.5 h-3.5 shrink-0 opacity-75 transition-opacity group-hover:opacity-100", member.iconColor)} />
                <span>{member.department}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="bg-white dark:bg-background">
      {/* 1. WHO WE ARE SECTION — PREMIUM FOCUS + VISUAL POLISH */}
      <section className="relative overflow-hidden py-10 sm:py-12 lg:py-14 bg-gradient-to-b from-[#FFFFFF] via-[#F8FBFE] to-[#F1F6FD] dark:from-[#070C18] dark:to-[#0B132B] min-h-[480px] lg:min-h-[510px] flex items-center">
        {/* Soft Pale-Blue Radial Ambient Tint behind negative space & illustration */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 72% 48%, rgba(220, 236, 254, 0.55) 0%, rgba(240, 246, 255, 0.25) 45%, transparent 75%)"
          }}
        />

        {/* Extremely Subtle Educational Dot Grid Texture (Restrained, low-opacity) */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0b_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff0a_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_85%_75%_at_65%_50%,#000_40%,transparent_100%)] opacity-70" 
        />

        {/* Subtle Educational Pathway Curve (Negative Space Only - Extremely Low Opacity) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="hidden lg:block absolute left-[38%] bottom-[16%] w-[32%] h-[75px] pointer-events-none z-0 overflow-visible"
        >
          <svg className="w-full h-full overflow-visible" viewBox="0 0 340 75" fill="none">
            <path
              d="M 10 50 C 90 50, 140 22, 220 30 C 270 35, 300 18, 335 8"
              stroke="url(#journeyPathGrad)"
              strokeWidth="1.2"
              strokeDasharray="4 5"
            />
            <defs>
              <linearGradient id="journeyPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1F4FA3" stopOpacity="0.04" />
                <stop offset="60%" stopColor="#1F4FA3" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <circle cx="10" cy="50" r="2" fill="#1F4FA3" fillOpacity="0.15" />
            <circle cx="165" cy="30" r="2" fill="#1F4FA3" fillOpacity="0.2" />
            <circle cx="335" cy="8" r="2.5" fill="#FF6B00" fillOpacity="0.3" />
          </svg>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT COLUMN: Editorial Text (7 cols on lg ~ 45-48% visual focus) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              {/* Eyebrow Label — Small, Uppercase, Controlled Tracking, Medium/Semibold */}
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="inline-flex items-center gap-2 mb-3 sm:mb-3.5"
              >
                <span className="w-3.5 h-[2px] rounded-full bg-[#FF6B00] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1F4B]/85 dark:text-slate-200">
                  Who We Are
                </span>
              </motion.div>

              {/* Main Headline — Primary Focus of Left Column (Compact Editorial Relationship) */}
              <motion.h1 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
                className="text-[38px] sm:text-[48px] md:text-[56px] lg:text-[62px] xl:text-[68px] 2xl:text-[72px] font-black tracking-tight leading-[1.03] text-[#0B1F4B] dark:text-white"
              >
                <span className="block">Transforming</span>
                <span className="block text-[#0B1F4B] dark:text-white">
                  Student <span className="text-[#1F4FA3] dark:text-blue-400">Potential</span>
                </span>
              </motion.h1>

              {/* Supporting Description — Intentionally Grouped, Controlled Readable Width */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
                className="mt-3.5 sm:mt-4 lg:mt-4.5 text-[17px] sm:text-[19px] lg:text-[20px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed sm:leading-[1.6] max-w-[540px]"
              >
                IDL Education helps students build strong concepts, stay consistent, and move forward with the right guidance.
              </motion.p>

              {/* 3-Point Value Strip — Horizontal, Controlled Tracking, Restrained Separators */}
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                className="mt-6 sm:mt-7 flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-4 text-xs sm:text-[12.5px] lg:text-[13px] font-bold tracking-[0.14em] uppercase text-[#0B1F4B] dark:text-slate-200"
              >
                <span className="tracking-[0.14em]">Strong Concepts</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0 opacity-90" aria-hidden="true" />
                <span className="tracking-[0.14em]">Right Guidance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1F4FA3] dark:bg-blue-400 shrink-0 opacity-90" aria-hidden="true" />
                <span className="tracking-[0.14em]">Real Progress</span>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Illustration with Soft Radial Glow & Ambient Light (5 cols on lg ~ 52-55%) */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center lg:justify-end w-full relative"
            >
              {/* Very Soft Radial Glow + Subtle Cool-Blue Ambient Light */}
              <div 
                className="absolute -inset-10 sm:-inset-14 rounded-full pointer-events-none blur-3xl opacity-80"
                style={{
                  background: "radial-gradient(circle at center, rgba(37, 99, 235, 0.12) 0%, rgba(56, 189, 248, 0.08) 40%, transparent 70%)"
                }}
              />
              <div 
                className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none blur-xl opacity-60"
                style={{
                  background: "radial-gradient(circle at center, rgba(224, 242, 254, 0.6) 0%, transparent 75%)"
                }}
              />

              {/* Calm, Subtle Floating Container (2–4px idle movement on desktop) */}
              <motion.div 
                animate={{ y: [0, -3.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center"
              >
                <Image
                  src="/about.png"
                  alt="Transforming Student Potential - IDL Education"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 46vw, 520px"
                  className="object-contain object-center drop-shadow-[0_16px_32px_rgba(11,31,75,0.08)] select-none"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MEET OUR FOUNDERS SECTION — ORIGINAL BOLD CONTRAST (PREMIUM POLISHED) */}
      <section className="w-full bg-[#080C14] relative overflow-hidden py-10 sm:py-12 md:py-12 lg:py-14 border-b border-white/10">
        {/* Subtle Ambient Lighting Glows */}
        <div className="absolute -left-20 top-1/3 w-96 h-96 bg-amber-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -right-20 top-1/3 w-96 h-96 bg-sky-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header Title */}
          <div className="text-center mb-6 sm:mb-8 md:mb-9 max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Meet Our Founders
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              The vision behind IDL Education.
            </p>
          </div>

          {/* 2 Founder Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
            {/* FOUNDER 1: AMOD SHARMA (WARM GOLDEN YELLOW) */}
            <div className="group relative overflow-hidden rounded-[2rem] pt-7 px-6 sm:px-7 pb-6 sm:pb-7 flex flex-col justify-between min-h-[520px] sm:min-h-[550px] md:min-h-[570px] bg-gradient-to-b from-[#F5A623] via-[#EFA11E] to-[#E59411] border border-amber-300/40 shadow-[0_20px_50px_-15px_rgba(245,166,35,0.3)] transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(245,166,35,0.4)] hover:-translate-y-1">
              {/* Subtle top highlight rim */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* Subtle Ambient Radial Glow in Negative Space (Replaces vertical text) */}
              <div className="absolute right-0 top-1/4 w-72 h-72 bg-amber-300/15 rounded-full blur-3xl pointer-events-none z-0" />

              {/* Name & Role (Top) */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-950">
                  AMOD SHARMA
                </h3>
                <p className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-900/85">
                  Founder & CEO
                </p>
              </div>

              {/* Portrait Container (Middle) */}
              <div className="absolute inset-x-0 bottom-28 sm:bottom-32 top-20 sm:top-24 md:top-26 flex items-end justify-center pointer-events-none z-10">
                <div className="relative w-80 sm:w-96 md:w-[430px] h-[96%] sm:h-[98%] scale-105 sm:scale-110 origin-bottom transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.12]">
                  <Image
                    src="/director.png"
                    alt="Amod Sharma"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>

              {/* White Quote Panel (Bottom) */}
              <div className="relative z-20 bg-white dark:bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-100/90 mt-auto">
                <svg className="w-5 h-5 text-amber-500 mb-2 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm sm:text-[15px] md:text-base font-bold text-slate-900 leading-snug tracking-tight">
                  &ldquo;My vision is to make quality education more accessible, meaningful, and transformative—empowering every student to dream bigger, learn better, and build a brighter future.&rdquo;
                </p>
              </div>
            </div>

            {/* FOUNDER 2: VIJAY VERMA (REFINED BLUE) */}
            <div className="group relative overflow-hidden rounded-[2rem] pt-7 px-6 sm:px-7 pb-6 sm:pb-7 flex flex-col justify-between min-h-[520px] sm:min-h-[550px] md:min-h-[570px] bg-gradient-to-b from-[#0EA5E9] via-[#0284C7] to-[#0369A1] border border-sky-300/40 shadow-[0_20px_50px_-15px_rgba(2,132,199,0.35)] transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(2,132,199,0.45)] hover:-translate-y-1">
              {/* Subtle top highlight rim */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* Subtle Ambient Radial Glow in Negative Space (Replaces vertical text) */}
              <div className="absolute right-0 top-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />

              {/* Name & Role (Top) */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                  VIJAY VERMA
                </h3>
                <p className="text-xs sm:text-sm font-extrabold tracking-wide text-sky-100">
                  Co-Founder
                </p>
              </div>

              {/* Portrait Container (Middle) */}
              <div className="absolute inset-x-0 bottom-28 sm:bottom-32 top-20 sm:top-24 md:top-26 flex items-end justify-center pointer-events-none z-10">
                <div className="relative w-80 sm:w-96 md:w-[430px] h-[96%] sm:h-[98%] scale-105 sm:scale-110 origin-bottom transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.12]">
                  <Image
                    src="/vijay.png"
                    alt="Vijay Verma"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
                  />
                </div>
              </div>

              {/* White Quote Panel (Bottom) */}
              <div className="relative z-20 bg-white dark:bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-100/90 mt-auto">
                <svg className="w-5 h-5 text-sky-500 mb-2 fill-current" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm sm:text-[15px] md:text-base font-bold text-slate-900 leading-snug tracking-tight">
                  &ldquo;We are committed to putting students first and leveraging technology to make learning more accessible and impactful—empowering and inspiring the next generation across Bharat.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEET OUR TEAM SECTION — PREMIUM EDITORIAL PROFILE SHOWCASE */}
      <section className="w-full py-12 sm:py-14 md:py-16 bg-gradient-to-b from-[#F8FAFD] via-[#F3F6FB] to-[#F8FAFD] dark:from-[#060A12] dark:via-[#090E1A] dark:to-[#060A12] relative overflow-hidden border-b border-border/40">
        {/* Subtle Background Texture & Radial Ambient Light */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B1F4B08_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-400/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Heading & Subtitle */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0B1F4B] dark:text-white">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              The people working behind the learning experience at IDL Education.
            </p>
            {/* Minimal IDL-style section accent: short refined blue underline with subtle orange endpoint */}
            <div className="flex items-center justify-center gap-1 pt-1">
              <span className="w-8 h-[2px] rounded-full bg-[#1F4FA3]" />
              <span className="w-2 h-[2px] rounded-full bg-[#FF6B00]" />
            </div>
          </div>
          
          {/* Desktop Layout: 3 Equal-Importance Cards in a Balanced Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-7 max-w-5xl mx-auto items-stretch">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>

          {/* Mobile Layout: Swipable Carousel with 1 Full Card + 10-15% Next-Card Peek */}
          <div className="block md:hidden">
            <div className="overflow-hidden w-full" ref={emblaRef}>
              <div className="flex">
                {team.map((member) => (
                  <div key={member.name} className="basis-[78%] sm:basis-[80%] shrink-0 grow-0 min-w-0 mr-3.5">
                    <TeamCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-5" aria-label="Team carousel pagination">
              {team.map((member, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={member.name}
                    type="button"
                    onClick={() => emblaApi?.scrollTo(idx)}
                    aria-label={`View ${member.name}'s profile`}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none",
                      isActive 
                        ? "w-6 bg-[#1F4FA3] dark:bg-blue-400" 
                        : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* 4. JOURNEY TEASER (COMPACT CTA LINKING TO /journey) */}
      <section className="py-12 sm:py-14 bg-white dark:bg-background border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-[#0B1F4B] via-[#0E2864] to-[#143B8E] text-white p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Background subtle watermark / timeline path */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none select-none flex items-center justify-end font-black text-[9rem] tracking-tighter">
              2021-26
            </div>

            <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                Milestones & Evolution
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Discover the Journey of IDL
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                Explore the milestones, people and moments that shaped IDL Education from its foundational start in 2021 to a nationwide platform.
              </p>
            </div>

            <div className="shrink-0 relative z-10">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#E56000] text-white text-sm font-bold transition-transform active:scale-95 shadow-md"
              >
                <span>Explore Our Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT / CLOSING CTA */}
      <section className="py-14 sm:py-16 md:py-20 bg-[#FAFBFD] dark:bg-slate-900/30">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1F4FA3] dark:text-blue-400">
            Partner In Your Success
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight mt-2">
            Let’s Build Better Learning Together.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
            Have questions about our programs, teaching approach, or admissions? Reach out to our academic team today.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="h-11 sm:h-12 min-w-[150px] sm:min-w-[160px] px-6 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0B1F4B] dark:text-white inline-flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#1F4FA3] dark:text-blue-400" />
              <span>Contact Us</span>
            </button>

            <a
              href="tel:8860040010"
              className="h-11 sm:h-12 min-w-[150px] sm:min-w-[160px] px-6 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0B1F4B] dark:text-white inline-flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#1F4FA3] dark:text-blue-400" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
}
