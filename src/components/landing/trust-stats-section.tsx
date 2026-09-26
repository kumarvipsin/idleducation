'use client';

import React from 'react';
import { CalendarDays, Building2, Users, Trophy } from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TRUST STATS SECTION — Standalone 100% Full-Width Rectangular Strip
   Independent section displaying key IDL Education trust metrics.
   ══════════════════════════════════════════════════════════════════ */

const trustStats = [
  { icon: CalendarDays, value: '2016',            label: 'Our Journey Began' },
  { icon: Building2,    value: '5+',              label: 'Branches in Delhi' },
  { icon: Users,        value: '1000+',           label: 'Students Guided' },
  { icon: Trophy,       value: 'Academic Growth', label: 'Every Step Forward' },
];

export function TrustStatsSection() {
  return (
    <section 
      id="trust-stats"
      aria-label="IDL Education Milestones"
      className="w-full bg-gradient-to-r from-[#061C43] via-[#09265E] to-[#061C43] dark:from-slate-950 dark:via-blue-950/80 dark:to-slate-950 border-y border-blue-900/50 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(6,28,67,0.18)] relative z-20"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Layout: 4 columns in 1 line with clean dividers */}
        <div className="hidden sm:grid sm:grid-cols-4 divide-x divide-white/[0.08]">
          {trustStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center justify-center gap-3.5 py-5 sm:py-6 px-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-blue-200" />
                </div>
                <div>
                  <div className="text-[18px] lg:text-[20px] font-[750] text-white leading-tight tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] lg:text-[11.5px] font-[550] text-[#94B5E6] leading-snug mt-1">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Layout: 2x2 grid */}
        <div className="grid grid-cols-2 gap-px sm:hidden bg-white/[0.08]">
          {trustStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 py-4 px-3.5 bg-[#081F4B]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.1] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-blue-200" />
                </div>
                <div>
                  <div className="text-[14px] font-[750] text-white leading-tight tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] font-[550] text-[#94B5E6] leading-snug mt-0.5">
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
