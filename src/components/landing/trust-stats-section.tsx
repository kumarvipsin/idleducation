'use client';

import React from 'react';
import { CalendarDays, Building2, Users, Trophy } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TRUST STATS SECTION — Standalone 100% Full-Width Rectangular Strip
   Independent section displaying key IDL Education trust metrics.
   ══════════════════════════════════════════════════════════════════ */

const trustStats = [
  { icon: CalendarDays, value: '2021',            label: 'Our Journey Began' },
  { icon: Building2,    value: '5+',              label: 'Branches in Delhi' },
  { icon: Users,        value: '1000+',           label: 'Students Guided' },
  { icon: Trophy,       value: 'Academic Growth', label: 'Every Step Forward' },
];

export function TrustStatsSection() {
  return (
    <section 
      id="trust-stats"
      aria-label="IDL Education Milestones"
      className="w-full bg-gradient-to-r from-[#061C43] via-[#09265E] to-[#061C43] dark:from-slate-950 dark:via-blue-950/80 dark:to-slate-950 border-y border-white/[0.08] dark:border-white/[0.06] shadow-[0_4px_20px_rgba(6,28,67,0.14)] relative z-20"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Layout: 4 columns in 1 line with clean dividers & balanced 92–98px height */}
        <div className="hidden sm:grid sm:grid-cols-4 divide-x divide-white/[0.07] min-h-[92px] lg:min-h-[98px]">
          {trustStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center justify-center gap-3.5 lg:gap-4 py-6 lg:py-7 px-4 lg:px-6">
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <div className="text-[19px] lg:text-[21px] xl:text-[22px] font-bold text-white leading-tight tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11.5px] lg:text-[12px] font-medium text-[#94B5E6] leading-snug mt-1">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Layout: 2x2 grid with equal widths, preserved compact height */}
        <div className="grid grid-cols-2 gap-px sm:hidden bg-white/[0.07]">
          {trustStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 py-3.5 px-3 min-[380px]:px-4 bg-[#081F4B]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] min-[380px]:text-[14px] font-bold text-white leading-tight tracking-tight truncate">
                    {s.value}
                  </div>
                  <div className="text-[10px] min-[380px]:text-[10.5px] font-medium text-[#94B5E6] leading-snug mt-0.5 truncate">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
