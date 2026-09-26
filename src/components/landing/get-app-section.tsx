'use client';

import React from 'react';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';

export function GetAppSection() {
  return (
    <section 
      id="idl-learning-app"
      aria-label="IDL Learning App"
      className="w-full py-6 sm:py-8 md:py-9 lg:py-8 bg-white dark:bg-background relative z-10"
    >
      <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-7xl">
        
        {/* Main Section Card: Clean, Calm & Minimal Showcase */}
        <div className="relative rounded-[24px] sm:rounded-[30px] lg:rounded-[32px] bg-gradient-to-br from-[#FAFCFF] via-[#F6F9FE] to-[#EEF5FC] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-800/60 border border-[#E2ECF8] dark:border-slate-800/80 px-5 pt-6 pb-7 sm:px-8 sm:pt-8 sm:pb-9 lg:px-10 lg:py-7 xl:px-12 xl:py-8 overflow-hidden shadow-[0_4px_30px_-6px_rgba(6,43,103,0.04)]">
          
          {/* ============================================================== */}
          {/* BACKGROUND DECORATIVE ELEMENTS (Clean & Subtle, Dotted Removed)*/}
          {/* ============================================================== */}

          {/* Top-Right Soft Curved Oversized Ring Arc */}
          <div className="absolute -top-28 -right-28 w-[340px] h-[340px] rounded-full border-[20px] border-blue-100/40 dark:border-blue-900/20 pointer-events-none" />
          <div className="absolute -top-40 -right-40 w-[460px] h-[460px] rounded-full border border-blue-200/35 dark:border-blue-800/20 pointer-events-none" />

          {/* Ambient Corner Soft Radial Glow */}
          <div className="absolute top-0 right-0 w-[340px] h-[260px] bg-gradient-to-bl from-blue-100/30 via-blue-50/15 to-transparent rounded-tr-[32px] pointer-events-none" />

          {/* ============================================================== */}
          {/* DESKTOP LAYOUT (Clean Balanced 2-Column Showcase - Compacted)   */}
          {/* ============================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-5 xl:gap-8 items-center relative z-10">
            
            {/* LEFT COLUMN: Phone with Forward-Placed Pedestal Base */}
            <div className="lg:col-span-6 xl:col-span-6 w-full flex items-center justify-center">
              <div className="relative w-full aspect-[3/2] max-w-[430px] xl:max-w-[465px] 2xl:max-w-[490px] flex items-center justify-center">
                
                {/* 3D Pedestal Stage (Scaled down proportionally & placed directly underneath phone) */}
                <div className="absolute -bottom-1.5 xl:-bottom-2 left-[49%] -translate-x-1/2 w-[240px] xl:w-[270px] h-[34px] xl:h-[38px] pointer-events-none z-0">
                  {/* Soft Ambient Contact Shadow Under Pedestal */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[92%] h-[12px] rounded-[50%] bg-blue-900/12 dark:bg-black/40 blur-[6px]" />
                  {/* Pedestal Cylinder Rim */}
                  <div className="absolute inset-x-0 top-[11px] xl:top-[12px] h-[14px] xl:h-[16px] bg-gradient-to-b from-[#E2EEFC] to-[#D0E4FB] dark:from-slate-800 dark:to-slate-900 rounded-b-[50%] border-x border-b border-[#C8DFFA] dark:border-slate-700 shadow-[0_4px_8px_rgba(10,92,255,0.05)]" />
                  {/* Pedestal Top Ellipse Surface */}
                  <div className="absolute inset-x-0 top-0 h-[22px] xl:h-[24px] rounded-[50%] bg-gradient-to-b from-[#FFFFFF] via-[#F4F9FF] to-[#E5F1FD] dark:from-slate-800 dark:to-slate-900 border border-[#C8DFFA] dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(10,92,255,0.06)]" />
                </div>

                {/* Main Hero Visual (idlapp.png) */}
                <div className="relative w-full h-full z-10 scale-[0.90] origin-bottom">
                  <Image
                    src="/mobile.png"
                    alt="IDL Learning App on smartphone"
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(6,43,103,0.08)]"
                    sizes="(max-width: 1024px) 50vw, 490px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Copy & Store Badges */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left space-y-2.5 xl:space-y-3 pl-1 xl:pl-3">
              
              {/* IDL LEARNING APP Pill Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 border border-[#D0E2FF] dark:border-blue-800/60 text-[#0A5CFF] dark:text-blue-300 text-[10.5px] font-bold tracking-wider uppercase select-none">
                <Smartphone className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400" />
                <span>IDL LEARNING APP</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-[28px] lg:text-[30px] xl:text-[34px] 2xl:text-[38px] font-bold text-[#062B67] dark:text-white leading-[1.16] tracking-tight">
                Best Exam Prep App{' '}
                <span className="text-[#0A5CFF] dark:text-blue-400">for</span>
              </h2>

              {/* Target Exams Subtitle */}
              <p className="text-[13.5px] xl:text-[15px] font-semibold text-slate-600 dark:text-slate-300 tracking-normal">
                JEE | NEET | Foundation | Olympiad
              </p>

              {/* Download Section with Official Badges */}
              <div className="pt-1.5 w-full">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  DOWNLOAD THE IDL LEARNING APP
                </p>
                
                <div className="flex flex-wrap items-center gap-3 xl:gap-3.5">
                  {/* Google Play */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download on Google Play Store"
                  >
                    <Image
                      src="/badges/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width={130}
                      height={38}
                      className="h-[36px] xl:h-[38px] w-auto object-contain"
                    />
                  </a>

                  {/* App Store */}
                  <a
                    href="https://apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Download on Apple App Store"
                  >
                    <Image
                      src="/badges/app-store-badge.svg"
                      alt="Download on the App Store"
                      width={130}
                      height={38}
                      className="h-[36px] xl:h-[38px] w-auto object-contain"
                    />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ============================================================== */}
          {/* MOBILE DESIGN (Order-Preserved, Compact, Mobile-First)          */}
          {/* ============================================================== */}
          <div className="flex flex-col lg:hidden space-y-2.5 relative z-10">
            
            {/* 1. Eyebrow Badge */}
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 border border-[#D0E2FF] dark:border-blue-800/60 text-[#0A5CFF] dark:text-blue-300 text-[10px] font-bold tracking-wider uppercase select-none">
                <Smartphone className="w-3 h-3 text-[#0A5CFF] dark:text-blue-400" />
                <span>IDL LEARNING APP</span>
              </div>
            </div>

            {/* 2. Main Headline */}
            <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#062B67] dark:text-white leading-[1.18] tracking-tight text-left">
              Best Exam Prep App{' '}
              <span className="text-[#0A5CFF] dark:text-blue-400">for</span>
            </h2>

            {/* 3. Subtitle */}
            <p className="text-[13px] sm:text-[14px] font-bold text-slate-700 dark:text-slate-200 tracking-wide text-left">
              JEE | NEET | Foundation | Olympiad
            </p>

            {/* 4. Download Area with Badges */}
            <div className="w-full pt-0.5 pb-0.5">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-left mb-2">
                DOWNLOAD THE IDL LEARNING APP
              </p>
              
              <div className="flex items-center justify-start gap-2.5">
                {/* Google Play */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform active:scale-95"
                  aria-label="Download on Google Play Store"
                >
                  <Image
                    src="/badges/google-play-badge.svg"
                    alt="Google Play"
                    width={120}
                    height={36}
                    className="h-[34px] sm:h-[36px] w-auto object-contain"
                  />
                </a>
                
                {/* App Store */}
                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform active:scale-95"
                  aria-label="Download on Apple App Store"
                >
                  <Image
                    src="/badges/app-store-badge.svg"
                    alt="App Store"
                    width={120}
                    height={36}
                    className="h-[34px] sm:h-[36px] w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            {/* 5. Hero Visual with Pedestal — reduced ~12% */}
            <div className="w-full flex items-center justify-center pt-1 pb-0">
              <div className="relative w-full aspect-[3/2] max-w-[295px] sm:max-w-[350px] flex items-center justify-center">
                
                {/* 3D Pedestal on Mobile */}
                <div className="absolute -bottom-1 left-[49%] -translate-x-1/2 w-[190px] sm:w-[220px] h-[28px] sm:h-[32px] pointer-events-none z-0">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-[10px] rounded-[50%] bg-blue-900/12 dark:bg-black/40 blur-[5px]" />
                  <div className="absolute inset-x-0 top-[9px] h-[12px] bg-gradient-to-b from-[#E2EEFC] to-[#D0E4FB] dark:from-slate-800 dark:to-slate-900 rounded-b-[50%] border-x border-b border-[#C8DFFA] dark:border-slate-700" />
                  <div className="absolute inset-x-0 top-0 h-[18px] rounded-[50%] bg-gradient-to-b from-[#FFFFFF] via-[#F4F9FF] to-[#E5F1FD] dark:from-slate-800 dark:to-slate-900 border border-[#C8DFFA] dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(10,92,255,0.06)]" />
                </div>

                {/* Main Hero Visual (mobile.png) */}
                <div className="relative w-full h-full z-10 scale-[0.88] origin-bottom">
                  <Image
                    src="/mobile.png"
                    alt="IDL Learning App on smartphone"
                    fill
                    className="object-contain drop-shadow-[0_6px_14px_rgba(6,43,103,0.07)]"
                    sizes="(max-width: 640px) 295px, 350px"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
