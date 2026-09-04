'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
        imageClass: "scale-[1.55] origin-[center_18%]",
        icon: Cpu,
        dotColor: "bg-[#1F4FA3]",
        accentLine: "bg-[#1F4FA3]",
        iconColor: "text-slate-400 group-hover:text-[#1F4FA3]",
        hoverBorder: "hover:border-blue-400/60",
      },
      {
        name: "Chandra Prakash",
        title: "Head Graphic Media",
        department: "Design & Creative Media",
        imageUrl: "/chandu.png",
        imageAlt: "Chandra Prakash",
        imageClass: "scale-[1.82] origin-[center_12%] -translate-y-3",
        icon: Palette,
        dotColor: "bg-[#FF6B00]",
        accentLine: "bg-[#FF6B00]",
        iconColor: "text-slate-400 group-hover:text-[#FF6B00]",
        hoverBorder: "hover:border-amber-400/60",
      },
      {
        name: "Vidhi Sharma",
        title: "Head Content Media",
        department: "Content & Editorial Strategy",
        imageUrl: "/vidhi.png",
        imageAlt: "Vidhi Sharma",
        imageClass: "scale-[1.5] origin-[center_18%]",
        icon: Sparkles,
        dotColor: "bg-emerald-600",
        accentLine: "bg-emerald-600",
        iconColor: "text-slate-400 group-hover:text-emerald-600",
        hoverBorder: "hover:border-emerald-400/60",
      },
    ];

  return (
    <div className="bg-white dark:bg-background">
      {/* 1. WHO WE ARE SECTION — CLEAN EDITORIAL BRAND INTRODUCTION */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#FAFBFD] dark:bg-background border-b border-border/40 relative overflow-hidden">
        {/* Subtle Ambient Backing Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT / MAIN CONTENT (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-3.5 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B00]">
                  Who We Are
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-slate-950 dark:text-white tracking-tight leading-[1.14] max-w-[640px]">
                Transforming Student Potential
              </h1>

              {/* Supporting Paragraph */}
              <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-[19px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-[600px]">
                IDL Education helps students build strong concepts, stay consistent, and move forward with the right guidance.
              </p>

              {/* One Compact Value Points Line */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center text-xs sm:text-[13px] font-bold tracking-wider uppercase text-slate-800 dark:text-slate-200">
                <span>Strong Concepts</span>
                <span className="mx-2.5 sm:mx-3 text-[#FF6B00] font-black select-none">·</span>
                <span>Right Guidance</span>
                <span className="mx-2.5 sm:mx-3 text-[#1F4FA3] dark:text-blue-400 font-black select-none">·</span>
                <span>Real Progress</span>
              </div>
            </div>

            {/* RIGHT / WHO WE ARE VISUAL (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] aspect-[3/2] flex items-center justify-center">
                <Image
                  src="/about.png"
                  alt="Who We Are - IDL Education"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 540px"
                  className="object-contain object-center drop-shadow-sm select-none"
                />
              </div>
            </div>
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

              {/* Subtle Decorative Name Watermark (readable from left side) */}
              <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
                <svg className="w-12 sm:w-14 md:w-16 h-72 sm:h-80 md:h-96 overflow-visible" viewBox="0 0 60 360">
                  <text
                    x="30"
                    y="180"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="rotate(90, 30, 180)"
                    className="font-black text-4xl sm:text-5xl md:text-[52px] uppercase tracking-wider fill-amber-900/[0.12] select-none"
                  >
                    AMOD SHARMA
                  </text>
                </svg>
              </div>

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

              {/* Subtle Decorative Name Watermark (readable from left side) */}
              <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
                <svg className="w-12 sm:w-14 md:w-16 h-72 sm:h-80 md:h-96 overflow-visible" viewBox="0 0 60 360">
                  <text
                    x="30"
                    y="180"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="rotate(90, 30, 180)"
                    className="font-black text-4xl sm:text-5xl md:text-[52px] uppercase tracking-wider fill-white/[0.14] select-none"
                  >
                    VIJAY VERMA
                  </text>
                </svg>
              </div>

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

      {/* 3. MEET OUR TEAM SECTION — PREMIUM EDITORIAL DESIGN */}
      <section className="w-full py-12 sm:py-14 md:py-16 bg-[#FAFBFE] dark:bg-background relative overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              The people working behind the learning experience at IDL Education.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {team.map((member) => {
              const IconComponent = member.icon;
              return (
                <div 
                  key={member.name}
                  className={cn(
                    "group rounded-2xl sm:rounded-[1.75rem] bg-white dark:bg-card border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col overflow-hidden relative",
                    member.hoverBorder
                  )}
                >
                  {/* Photo Area */}
                  <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-100/90 to-slate-200/60 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-900/60 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={member.imageUrl}
                        alt={member.imageAlt}
                        fill
                        className={cn(
                          "object-contain drop-shadow-md grayscale contrast-[1.12] transition-all duration-500 group-hover:contrast-[1.18] group-hover:scale-[1.02]",
                          member.imageClass
                        )}
                      />
                    </div>
                    {/* Subtle bottom fade into profile card content */}
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-card dark:via-card/80 pointer-events-none z-10" />
                  </div>

                  {/* Profile Info Area */}
                  <div className="p-6 flex flex-col justify-between flex-1 bg-white dark:bg-card relative z-10 text-center">
                    {/* Faint Oversized IDL Watermark in lower profile area */}
                    <div className="absolute inset-x-0 bottom-1 flex justify-center items-center select-none pointer-events-none font-black text-6xl text-slate-900/[0.03] dark:text-white/[0.03] tracking-tighter leading-none z-0">
                      IDL
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      {/* Top Role Label */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.14em] bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 mb-2.5">
                        <span className={cn("w-1.5 h-1.5 rounded-full", member.dotColor)} />
                        <span>{member.title}</span>
                      </div>

                      {/* Name */}
                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                        {member.name}
                      </h3>

                      {/* Subtle Divider with Accent Line */}
                      <div className="flex items-center justify-center gap-1.5 my-3 w-full max-w-[120px]">
                        <div className="h-[1px] flex-1 bg-slate-200/80 dark:bg-slate-700/80" />
                        <div className={cn("h-[2px] w-4 rounded-full transition-all duration-300 group-hover:w-7", member.accentLine)} />
                        <div className="h-[1px] flex-1 bg-slate-200/80 dark:bg-slate-700/80" />
                      </div>

                      {/* Department with Icon */}
                      <p className="text-xs sm:text-[13px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide flex items-center justify-center gap-1.5">
                        <IconComponent className={cn("w-3.5 h-3.5 shrink-0 transition-colors duration-300", member.iconColor)} />
                        <span>{member.department}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F4B] hover:bg-[#142B63] text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Academic Counselor</span>
            </button>
            <a
              href="tel:8860040010"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call 8860040010</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />
    </div>
  );
}
