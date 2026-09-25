'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export function GetAppSection() {
  return (
    <section className="w-full pt-4 sm:pt-6 pb-8 sm:pb-10 md:pb-12 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="relative rounded-[22px] bg-white dark:bg-card p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md overflow-hidden">
          {/* Background Texture & Map Silhouette */}
          <div className="absolute inset-0 bg-dot-pattern opacity-[0.12] dark:opacity-[0.06] pointer-events-none" />
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4 w-full h-full max-w-2xl">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_silhouette.svg" 
              alt="India Map silhouette" 
              fill 
              className="object-contain"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* LEFT (Desktop) / TOP (Mobile): Prominent Smartphone Illustration (+30-40% visual size) */}
            <div className="lg:col-span-6 relative w-full h-60 sm:h-72 md:h-80 lg:h-[350px] flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-4 bg-primary/5 rounded-[2rem] blur-2xl pointer-events-none" />
                <Image
                  src="/idlapp.png"
                  alt="IDL Education App Features"
                  data-ai-hint="education app mobile"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* RIGHT (Desktop) / BELOW (Mobile): Content, Bullets & Download/QR */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-3.5 sm:space-y-4">
              <div>
                <h2 className="text-[21px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight leading-tight antialiased">
                  <span className="font-bold text-[#0B1F4B] dark:text-white">IDL </span>
                  <span className="font-semibold text-[#1A3673] dark:text-blue-200">
                    Learning App
                  </span>
                </h2>
              </div>

              <ul className="space-y-2 w-full">
                {[
                  "Access free high-quality video lessons",
                  "Interactive doubt clearing sessions",
                  "Premium study materials and mock tests"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-start gap-2.5">
                    <div className="bg-blue-50/80 dark:bg-blue-950/50 p-1 rounded-full text-[#1F4FA3] dark:text-blue-400 shrink-0 border border-blue-100/70 dark:border-blue-900/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4FA3] dark:text-blue-400 stroke-[2.2]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Download / QR Quick Scan Area */}
              <div className="w-full pt-1 sm:pt-1.5">
                <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 p-3 sm:p-3.5 bg-slate-50/90 dark:bg-slate-900/40 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-xs w-full sm:w-fit">
                  {/* Store Badges */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {/* Google Play */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xs border border-border/50 flex items-center gap-2">
                      <Image
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-play-store-icon.png"
                        alt="Google Play"
                        data-ai-hint="google play"
                        width={20}
                        height={20}
                        className="object-contain shrink-0"
                      />
                      <div className="flex flex-col -space-y-1">
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tight">GET IT ON</span>
                        <span className="text-[11px] font-extrabold text-foreground tracking-tight">Google Play</span>
                      </div>
                    </div>
                    
                    {/* App Store */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xs border border-border/50 flex items-center gap-2">
                      <Image
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/apple-app-store-icon.png"
                        alt="App Store"
                        data-ai-hint="app store"
                        width={20}
                        height={20}
                        className="object-contain shrink-0"
                      />
                      <div className="flex flex-col -space-y-1">
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tight">Download on</span>
                        <span className="text-[11px] font-extrabold text-foreground tracking-tight">App Store</span>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="min-w-0 sm:shrink-0 pr-1 sm:pr-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-0.5">Quick Scan</p>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight text-foreground">Get IDL Learning App</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl shadow-xs border border-border/60 shrink-0 flex items-center justify-center">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                      alt="QR Code"
                      data-ai-hint="qr code"
                      width={70}
                      height={70}
                      className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] object-contain opacity-95"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
