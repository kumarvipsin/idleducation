'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight, Compass,
  BookOpen, TrendingUp, MessageSquare, Phone
} from "lucide-react";
import { ContactModal } from "@/components/contact-modal";

export default function AboutPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const team = [
    {
      name: "Vijay Verma",
      department: "Branch Head - Mangolpuri",
      imageUrl: "/vijay.png",
      imageAlt: "Vijay Verma",
      hoverBorder: "hover:border-[#155EEF]/30",
    },
    {
      name: "Manish Kumar",
      department: "Branch Head - Krishan Vihar",
      imageUrl: "/manish.png",
      imageAlt: "Manish Kumar",
      hoverBorder: "hover:border-[#1D4ED8]/30",
    },
    {
      name: "Chandra Prakash",
      department: "Branch Head - Budh Vihar",
      imageUrl: "/chandu.png",
      imageAlt: "Chandra Prakash",
      hoverBorder: "hover:border-[#EA580C]/30",
    },
    {
      name: "Vidhi Sharma",
      department: "Branch Head - Mukherjee Nagar",
      imageUrl: "/vidhi.png",
      imageAlt: "Vidhi Sharma",
      hoverBorder: "hover:border-emerald-600/30",
    },
  ];

  function TeamCard({ member }: { member: (typeof team)[0] }) {
    return (
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_1px_2px_rgba(11,34,77,0.04),0_6px_20px_-10px_rgba(11,34,77,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(11,34,77,0.06),0_16px_30px_-14px_rgba(11,34,77,0.12)]",
          member.hoverBorder
        )}
      >
        {/* Full-Bleed Square Portrait Frame (Consistent across mobile horizontal scroll & desktop 4-col grid without cropping head or hands) */}
        <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/80">
          <Image
            src={member.imageUrl}
            alt={member.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 268px, (max-width: 1024px) 45vw, 280px"
            className="object-cover object-[50%_20%] grayscale contrast-[1.04] transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>

        {/* Clean, Minimal Profile Info Area */}
        <div className="flex flex-1 flex-col items-center p-4 lg:px-3.5 lg:py-4 xl:p-5 text-center">
          {/* Member Name */}
          <h3 className="text-[18px] sm:text-[19px] lg:text-[17.5px] xl:text-[19px] font-extrabold tracking-[-0.015em] leading-snug text-[#0B224D] dark:text-white">
            {member.name}
          </h3>

          {/* Department Label */}
          <div className="mt-auto pt-3 w-full">
            <p className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[12.5px] lg:text-[11.5px] xl:text-[12.5px] font-medium tracking-[0.005em] text-[#475E82] dark:text-slate-400 truncate">
              {member.department}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="bg-white dark:bg-background">
      {/* 1. WHO WE ARE SECTION — PREMIUM FOCUS + 3D GROWTH-PATH VISUAL */}
      <section className="relative overflow-hidden pt-6 pb-4 sm:pt-8 sm:pb-5 lg:pt-14 lg:pb-6 bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#FFFFFF] dark:from-[#070C18] dark:to-background flex items-center">
        {/* Subtle Pale-Blue Ambient Wash behind right-side 3D visual */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 42% 50% at 68% 52%, rgba(219, 234, 254, 0.30) 0%, rgba(239, 246, 255, 0.12) 46%, transparent 70%)"
          }}
        />

        {/* Restrained Low-Opacity Dot Grid Texture (fades out cleanly before bottom edge) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0a_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff09_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_78%_68%_at_64%_46%,#000_34%,transparent_92%)] opacity-50"
        />

        <div className="w-full md:container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT COLUMN: Editorial Text (Aligned directly below Navbar IDL Logo) */}
            <div className="flex flex-col justify-center text-left lg:pb-2">
              {/* Eyebrow Label — Small, Uppercase, Controlled Tracking */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="inline-flex items-center gap-2 mb-2.5 sm:mb-3"
              >
                <span className="w-3.5 h-[2px] rounded-full bg-[#FF6B00] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1F4B]/85 dark:text-slate-200">
                  Who We Are
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
                className="text-[32px] min-[390px]:text-[35px] sm:text-[44px] md:text-[48px] lg:text-[54px] xl:text-[58px] font-black tracking-[-0.025em] leading-[1.06] text-[#0B1F4B] dark:text-white"
              >
                <span className="block">Transforming</span>
                <span className="block text-[#0B1F4B] dark:text-white">
                  Student <span className="text-[#1F4FA3] dark:text-blue-400">Potential</span>
                </span>
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
                className="mt-3 sm:mt-4 lg:mt-[18px] text-[15px] sm:text-[16px] lg:text-[16.5px] text-[#475E82] dark:text-slate-300 font-medium leading-[1.65] max-w-[535px] [text-wrap:balance]"
              >
                IDL Education helps students build strong concepts, stay consistent, and move forward with the right guidance.
              </motion.p>

              {/* 3-Point Value Strip */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                className="mt-4 sm:mt-5 lg:mt-6 flex flex-wrap items-center gap-y-2 gap-x-1.5 sm:gap-x-2.5 text-[9px] min-[390px]:text-[9.5px] sm:text-[11px] font-bold tracking-[0.03em] min-[390px]:tracking-[0.045em] sm:tracking-[0.11em] uppercase leading-none text-[#162D54] dark:text-slate-200"
              >
                <span className="whitespace-nowrap">Strong Concepts</span>
                <span className="inline-flex items-center gap-x-1.5 sm:gap-x-2.5 whitespace-nowrap">
                  <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span>Right Guidance</span>
                </span>
                <span className="inline-flex items-center gap-x-1.5 sm:gap-x-2.5 whitespace-nowrap">
                  <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-[#1F4FA3] dark:bg-blue-400 shrink-0" aria-hidden="true" />
                  <span>Real Progress</span>
                </span>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: 3D Ascending Growth-Path Visual */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: "easeOut" }}
              className="flex justify-center w-full lg:w-auto lg:pr-4 xl:pr-10 relative"
            >
              {/* Focused, Subtle Blue Illumination behind the staircase */}
              <div
                aria-hidden="true"
                className="absolute inset-8 sm:inset-10 rounded-full pointer-events-none blur-2xl opacity-50"
                style={{
                  background: "radial-gradient(circle at 52% 50%, rgba(37, 99, 235, 0.09) 0%, rgba(96, 165, 250, 0.04) 45%, transparent 70%)"
                }}
              />

              {/* Proportionate Natural-Ratio Hero Visual Container (1536x1024 -> 3:2) */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-[300px] min-[390px]:max-w-[325px] sm:max-w-[380px] md:max-w-[420px] lg:w-[460px] lg:max-w-none xl:w-[500px] aspect-[3/2] flex items-center justify-center"
              >
                <Image
                  src="/about.png"
                  alt="Transforming Student Potential - IDL Education"
                  fill
                  priority
                  sizes="(max-width: 640px) 325px, (max-width: 1024px) 420px, 500px"
                  className="object-contain object-center select-none dark:invert dark:opacity-90"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MEET OUR FOUNDER HEADER (PURE WHITE MATCHING MEET OUR TEAM TOP WHITE GAP) */}
      <div className="w-full bg-white dark:bg-background pt-9 pb-5 sm:pt-12 sm:pb-6 md:pt-14 lg:pt-16 lg:pb-7">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 min-[390px]:mb-2 select-none">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67] dark:text-blue-200">Meet Our </span>
                <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">Founder</span>
              </span>
            </div>

            <h2 className="text-[17px] min-[360px]:text-[18px] min-[390px]:text-[19px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto">
              <span className="text-[#062B67] dark:text-white">The vision behind{' '}</span>
              <span className="text-[#155EEF] dark:text-blue-400">IDL Education.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 2B. MEET OUR FOUNDER — REFINED DARK NAVY PROFILE SECTION */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-[#0A1B3D] via-[#0D2149] to-[#091734] md:from-[#040B1C] md:via-[#06122B] md:to-[#030918] py-8 sm:py-10 md:py-14 lg:py-16 border-y border-[#1E3A8A]/25 md:border-white/[0.06]">
        {/* Subtle IDL Navy/Blue Ambient Depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 72% 46% at 50% 0%, rgba(59, 130, 246, 0.18), transparent 72%), radial-gradient(ellipse 52% 48% at 50% 42%, rgba(96, 165, 250, 0.08), transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Balanced Founder Profile Composition */}
          <div className="max-w-[980px] mx-auto">
            <div className="relative rounded-[20px] md:rounded-2xl bg-gradient-to-b from-white/[0.065] via-white/[0.03] to-white/[0.015] md:bg-gradient-to-br md:from-[#0B1938]/90 md:via-[#08142E]/95 md:to-[#061026]/95 border border-white/[0.10] md:border-white/[0.08] shadow-[0_12px_32px_-14px_rgba(4,12,32,0.45),inset_0_1px_0_rgba(255,255,255,0.11)] md:shadow-[0_18px_44px_-16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.07)] px-5 py-6 sm:px-7 sm:py-7 md:p-9 lg:p-10">
              <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                {/* Left / Top: Integrated Founder Portrait Frame */}
                <div className="w-[186px] min-[390px]:w-[198px] sm:w-[228px] md:w-[270px] lg:w-[295px] shrink-0">
                  <div className="p-[4px] md:p-0 rounded-[18px] md:rounded-xl bg-gradient-to-b from-white/[0.16] via-blue-300/[0.09] to-white/[0.04] md:bg-none">
                    <div className="relative w-full aspect-[11/12] overflow-hidden rounded-[14px] md:rounded-xl bg-[#EBF3FF] ring-1 ring-white/10 md:ring-white/15 shadow-[0_8px_22px_-8px_rgba(4,12,32,0.52)] md:shadow-[0_12px_28px_-10px_rgba(2,6,23,0.75)]">
                      <Image
                        src="/director.png"
                        alt="Amod Sharma"
                        fill
                        priority
                        sizes="(max-width: 640px) 198px, (max-width: 1024px) 270px, 295px"
                        className="object-cover object-top"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[14px] md:rounded-xl ring-1 ring-inset ring-black/10 bg-gradient-to-t from-[#0A1B3D]/30 via-transparent to-[#0A1B3D]/[0.04] md:from-[#040B1C]/20 md:to-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Right / Bottom: Identity & Integrated Editorial Vision Quote */}
                <div className="flex-1 min-w-0 flex flex-col justify-center text-center md:text-left">
                  <div>
                    <h3 className="text-[20px] min-[390px]:text-[21px] sm:text-[25px] md:text-[28px] lg:text-[30px] font-extrabold uppercase tracking-[0.04em] md:tracking-[0.025em] leading-tight text-white">
                      AMOD SHARMA
                    </h3>
                    <p className="mt-1.5 text-[12.5px] min-[390px]:text-[13px] sm:text-[14.5px] lg:text-[16px] font-semibold tracking-[0.07em] md:tracking-[0.05em] text-[#93C5FD] md:text-[#60A5FA]">
                      Founder & CEO
                    </p>
                  </div>

                  {/* Integrated Editorial Quote Block */}
                  <blockquote className="mt-4 md:mt-5 relative md:border-l-[2.5px] md:border-[#3B82F6] md:bg-gradient-to-r md:from-[#3B82F6]/[0.07] md:via-white/[0.02] md:to-transparent md:rounded-r-lg px-1 py-0.5 sm:px-3 md:pl-5 md:pr-4 md:py-3.5 text-center md:text-left">
                    <svg
                      aria-hidden="true"
                      className="mx-auto md:mx-0 w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#93C5FD]/45 md:text-[#60A5FA]/50 mb-1.5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-[13.5px] min-[390px]:text-[14px] sm:text-[15px] lg:text-[17px] font-normal md:font-medium text-slate-200/90 md:text-slate-200/95 leading-[1.72] md:leading-[1.7] tracking-[0.005em] [text-wrap:pretty]">
                      &ldquo;My vision is to make quality education more accessible, meaningful, and transformative—empowering every student to dream bigger, learn better, and build a brighter future.&rdquo;
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEET OUR TEAM SECTION — CONTACT US 1ST SECTION VISUAL PARITY */}
      <section className="w-full pt-9 pb-10 sm:py-12 md:py-14 lg:py-16 bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#FFFFFF] dark:from-[#070C18] dark:to-background relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/60">
        {/* Subtle Pale-Blue Ambient Wash (Matching Contact Us 1st Section) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 58% 54% at 50% 58%, rgba(219, 234, 254, 0.30) 0%, rgba(239, 246, 255, 0.12) 48%, transparent 72%)",
          }}
        />

        {/* Restrained Low-Opacity Dot Grid Texture (Matching Contact Us 1st Section) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0a_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff09_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_80%_68%_at_50%_56%,#000_34%,transparent_92%)] opacity-50"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Heading & Subtitle (Landing page header style, no underline) */}
          <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 md:mb-9 lg:mb-10">
            {/* Eyebrow with small blue bullet point */}
            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 min-[390px]:mb-2 select-none">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67] dark:text-blue-200">Meet Our </span>
                <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">Team</span>
              </span>
            </div>

            {/* Larger description headline */}
            <h2 className="text-[17px] min-[360px]:text-[18px] min-[390px]:text-[19px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto">
              <span className="text-[#062B67] dark:text-white">The team behind{' '}</span>
              <span className="text-[#155EEF] dark:text-blue-400">IDL Education.</span>
            </h2>
          </div>

          {/* Responsive Leadership Showcase: Smooth horizontal scroll on mobile, 2x2 on tablet, 4-column single row on desktop */}
          <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-auto md:px-0 pt-1 pb-3 md:py-0 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 md:max-w-2xl lg:max-w-[1180px] overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 items-stretch [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {team.map((member) => (
              <div
                key={member.name}
                className="w-[74vw] max-w-[268px] sm:w-[280px] md:w-auto md:max-w-none shrink-0 snap-start"
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONTACT / CLOSING CTA */}
      <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FFFFFF] to-[#FAFCFF] dark:from-slate-900/35 dark:to-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-[15.5px] min-[360px]:text-[17.5px] min-[390px]:text-[19px] min-[425px]:text-[21px] sm:text-[28px] md:text-[32px] font-extrabold text-[#0B1F4B] dark:text-white tracking-[-0.015em] leading-[1.2] whitespace-nowrap">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mt-2 sm:mt-2.5 text-[12px] min-[360px]:text-[12.5px] min-[390px]:text-[13.5px] sm:text-[15.5px] text-[#526789] dark:text-slate-400 font-medium leading-[1.55] mx-auto min-[360px]:whitespace-nowrap">
            Have questions? Reach out to our team.
          </p>
          <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:inline-flex items-center justify-center gap-2.5 sm:gap-3.5 max-w-[330px] sm:max-w-none mx-auto">
            <Link
              href="/contact"
              className="h-11 sm:h-[46px] sm:min-w-[160px] px-4 sm:px-6 rounded-xl bg-[#0A1E4A] hover:bg-[#122D68] text-white inline-flex items-center justify-center gap-2 text-[13.5px] sm:text-sm font-bold shadow-[0_2px_8px_rgba(11,34,77,0.16)] hover:shadow-[0_6px_16px_rgba(11,34,77,0.22)] lg:hover:-translate-y-[1px] active:translate-y-0 transition-[background-color,box-shadow,transform] duration-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white/90 shrink-0" />
              <span>Contact Us</span>
            </Link>

            <a
              href="tel:8860040010"
              className="h-11 sm:h-[46px] sm:min-w-[160px] px-4 sm:px-6 rounded-xl bg-white hover:bg-[#F5F8FD] dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/90 hover:border-[#1F4FA3]/30 dark:border-slate-700 text-[#0B1F4B] dark:text-white inline-flex items-center justify-center gap-2 text-[13.5px] sm:text-sm font-bold shadow-[0_1px_2px_rgba(11,34,77,0.05)] hover:shadow-[0_4px_12px_rgba(11,34,77,0.08)] lg:hover:-translate-y-[1px] active:translate-y-0 transition-[background-color,border-color,box-shadow,transform] duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#1F4FA3] dark:text-blue-400 shrink-0" />
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
