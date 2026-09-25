'use client';

import React from 'react';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';

export function GetAppSection() {
  return (
    <section 
      id="idl-learning-app"
      aria-label="IDL Learning App"
      className="w-full py-6 sm:py-8 md:py-12 bg-white dark:bg-background relative z-10"
    >
      <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-7xl">
        
        {/* Main Section Card: Clean, Calm & Minimal Showcase */}
        <div className="relative rounded-[24px] sm:rounded-[30px] lg:rounded-[36px] bg-gradient-to-br from-[#FAFCFF] via-[#F6F9FE] to-[#EEF5FC] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-800/60 border border-[#E2ECF8] dark:border-slate-800/80 px-5 pt-6 pb-7 sm:px-8 sm:pt-8 sm:pb-9 lg:px-12 lg:py-12 overflow-hidden shadow-[0_4px_30px_-6px_rgba(6,43,103,0.04)]">
          
          {/* ============================================================== */}
          {/* BACKGROUND DECORATIVE ELEMENTS (Clean & Subtle, Dotted Removed)*/}
          {/* ============================================================== */}

          {/* Top-Right Soft Curved Oversized Ring Arc */}
          <div className="absolute -top-36 -right-36 w-[420px] h-[420px] rounded-full border-[24px] border-blue-100/40 dark:border-blue-900/20 pointer-events-none" />
          <div className="absolute -top-52 -right-52 w-[580px] h-[580px] rounded-full border border-blue-200/35 dark:border-blue-800/20 pointer-events-none" />

          {/* Ambient Corner Soft Radial Glow */}
          <div className="absolute top-0 right-0 w-[420px] h-[340px] bg-gradient-to-bl from-blue-100/30 via-blue-50/15 to-transparent rounded-tr-[36px] pointer-events-none" />

          {/* ============================================================== */}
          {/* DESKTOP LAYOUT (Clean Balanced 2-Column Showcase)               */}
          {/* ============================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 xl:gap-10 items-center relative z-10">
            
            {/* LEFT COLUMN: Phone with Forward-Placed Pedestal Base */}
            <div className="lg:col-span-6 xl:col-span-6 w-full flex items-center justify-center">
              <div className="relative w-full aspect-[3/2] max-w-[540px] xl:max-w-[580px] flex items-center justify-center">
                
                {/* 3D Pedestal Stage (Placed forward so phone sits comfortably on top) */}
                <div className="absolute -bottom-2 xl:-bottom-3.5 left-[49%] -translate-x-1/2 w-[310px] sm:w-[340px] xl:w-[380px] h-[44px] xl:h-[50px] pointer-events-none z-0">
                  {/* Soft Ambient Contact Shadow Under Pedestal */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[92%] h-[16px] rounded-[50%] bg-blue-900/12 dark:bg-black/40 blur-[8px]" />
                  {/* Pedestal Cylinder Rim */}
                  <div className="absolute inset-x-0 top-[14px] xl:top-[16px] h-[18px] xl:h-[22px] bg-gradient-to-b from-[#E2EEFC] to-[#D0E4FB] dark:from-slate-800 dark:to-slate-900 rounded-b-[50%] border-x border-b border-[#C8DFFA] dark:border-slate-700 shadow-[0_6px_12px_rgba(10,92,255,0.05)]" />
                  {/* Pedestal Top Ellipse Surface */}
                  <div className="absolute inset-x-0 top-0 h-[28px] xl:h-[32px] rounded-[50%] bg-gradient-to-b from-[#FFFFFF] via-[#F4F9FF] to-[#E5F1FD] dark:from-slate-800 dark:to-slate-900 border border-[#C8DFFA] dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_8px_rgba(10,92,255,0.06)]" />
                </div>

                {/* Main Hero Visual (idlapp.png) */}
                <div className="relative w-full h-full z-10">
                  <Image
                    src="/idlapp.png"
                    alt="IDL Learning App on smartphone"
                    fill
                    className="object-contain drop-shadow-[0_12px_24px_rgba(6,43,103,0.08)]"
                    sizes="(max-width: 1024px) 50vw, 580px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Copy & Store Badges */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left space-y-4 xl:space-y-5 pl-2 xl:pl-4">
              
              {/* IDL LEARNING APP Pill Eyebrow */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 border border-[#D0E2FF] dark:border-blue-800/60 text-[#0A5CFF] dark:text-blue-300 text-[11px] font-bold tracking-wider uppercase select-none">
                <Smartphone className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400" />
                <span>IDL LEARNING APP</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-[34px] xl:text-[42px] font-extrabold text-[#062B67] dark:text-white leading-[1.18] tracking-tight">
                Best Exam Prep App{' '}
                <span className="text-[#0A5CFF] dark:text-blue-400">for</span>
              </h2>

              {/* Target Exams Subtitle */}
              <p className="text-[16px] xl:text-[18px] font-bold text-slate-700 dark:text-slate-200 tracking-normal">
                JEE | NEET | Foundation | Olympiad
              </p>

              {/* Download Section with Official Badges */}
              <div className="pt-2 w-full">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  DOWNLOAD THE IDL LEARNING APP
                </p>
                
                <div className="flex flex-wrap items-center gap-3.5 xl:gap-4">
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
                      width={142}
                      height={42}
                      className="h-[42px] xl:h-[44px] w-auto object-contain"
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
                      width={142}
                      height={42}
                      className="h-[42px] xl:h-[44px] w-auto object-contain"
                    />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ============================================================== */}
          {/* MOBILE DESIGN (Order-Preserved, Compact, Mobile-First)          */}
          {/* ============================================================== */}
          <div className="flex flex-col lg:hidden space-y-3.5 relative z-10">
            
            {/* 1. Eyebrow Badge */}
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3FF] dark:bg-blue-950/60 border border-[#D0E2FF] dark:border-blue-800/60 text-[#0A5CFF] dark:text-blue-300 text-[10px] font-bold tracking-wider uppercase select-none">
                <Smartphone className="w-3 h-3 text-[#0A5CFF] dark:text-blue-400" />
                <span>IDL LEARNING APP</span>
              </div>
            </div>

            {/* 2. Main Headline */}
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#062B67] dark:text-white leading-[1.2] tracking-tight text-left">
              Best Exam Prep App{' '}
              <span className="text-[#0A5CFF] dark:text-blue-400">for</span>
            </h2>

            {/* 3. Subtitle */}
            <p className="text-[13.5px] sm:text-[15px] font-bold text-slate-700 dark:text-slate-200 tracking-wide text-left">
              JEE | NEET | Foundation | Olympiad
            </p>

            {/* 4. Hero Visual with Forward-Placed Pedestal */}
            <div className="w-full flex items-center justify-center py-2">
              <div className="relative w-full aspect-[3/2] max-w-[340px] sm:max-w-[400px] flex items-center justify-center">
                
                {/* 3D Pedestal on Mobile */}
                <div className="absolute -bottom-1.5 left-[49%] -translate-x-1/2 w-[220px] sm:w-[250px] h-[32px] sm:h-[36px] pointer-events-none z-0">
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[90%] h-[12px] rounded-[50%] bg-blue-900/12 dark:bg-black/40 blur-[6px]" />
                  <div className="absolute inset-x-0 top-[10px] h-[14px] bg-gradient-to-b from-[#E2EEFC] to-[#D0E4FB] dark:from-slate-800 dark:to-slate-900 rounded-b-[50%] border-x border-b border-[#C8DFFA] dark:border-slate-700" />
                  <div className="absolute inset-x-0 top-0 h-[20px] rounded-[50%] bg-gradient-to-b from-[#FFFFFF] via-[#F4F9FF] to-[#E5F1FD] dark:from-slate-800 dark:to-slate-900 border border-[#C8DFFA] dark:border-slate-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(10,92,255,0.06)]" />
                </div>

                {/* Main Hero Visual (idlapp.png) */}
                <div className="relative w-full h-full z-10">
                  <Image
                    src="/idlapp.png"
                    alt="IDL Learning App on smartphone"
                    fill
                    className="object-contain drop-shadow-[0_8px_16px_rgba(6,43,103,0.08)]"
                    sizes="(max-width: 640px) 340px, 400px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 5. Download Area with Badges */}
            <div className="w-full pt-2.5 pb-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-left mb-2.5">
                DOWNLOAD THE IDL LEARNING APP
              </p>
              
              <div className="flex items-center justify-start gap-3">
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
                    width={125}
                    height={36}
                    className="h-[36px] w-auto object-contain"
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
                    width={125}
                    height={36}
                    className="h-[36px] w-auto object-contain"
                  />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
