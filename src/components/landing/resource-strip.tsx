'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── COURSES WE OFFER (Exact sequence, names, subtitles and icons from user's screenshot) ───
const coursesOffer = [
  {
    id: "cbse",
    label: "CBSE BOARD",
    description: "Classes 9–12",
    href: "/courses",
    cardBg: "bg-[#FFFDF5] hover:bg-[#FEF9E7] dark:bg-amber-950/25 dark:hover:bg-amber-950/45 border-[#FDE68A] dark:border-amber-900/50",
    iconBg: "bg-[#FEF3C7] dark:bg-amber-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-700 dark:text-amber-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" fill="#FEF3C7" fillOpacity="0.5" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M12 2v6l2-1.5 2 1.5V2" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "jee-neet",
    label: "JEE & NEET",
    description: "Classes 11–12",
    href: "/courses",
    cardBg: "bg-[#F4F8FF] hover:bg-[#EBF3FF] dark:bg-blue-950/25 dark:hover:bg-blue-950/45 border-[#DCE9FE] dark:border-blue-900/50",
    iconBg: "bg-[#DBEAFE] dark:bg-blue-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-blue-600 dark:text-blue-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="7.5" fill="#DBEAFE" fillOpacity="0.5" />
        <polyline points="12 9.5 12 13 14.5 15" stroke="#2563EB" strokeWidth="2" />
        <path d="M5 3.5L2.5 6" stroke="#2563EB" />
        <path d="M21.5 6l-2.5-2.5" stroke="#2563EB" />
        <path d="M6.5 19L4.5 21" />
        <path d="M17.5 19L19.5 21" />
      </svg>
    ),
  },
  {
    id: "cuet",
    label: "CUET (UG)",
    description: "Classes 11–12",
    href: "/courses",
    cardBg: "bg-[#F0FDF4] hover:bg-[#E6FAED] dark:bg-emerald-950/25 dark:hover:bg-emerald-950/45 border-[#DCFCE7] dark:border-emerald-900/50",
    iconBg: "bg-[#DCFCE7] dark:bg-emerald-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3.5" width="20" height="13" rx="2" fill="#DCFCE7" fillOpacity="0.5" />
        <line x1="8" y1="20.5" x2="16" y2="20.5" />
        <line x1="12" y1="16.5" x2="12" y2="20.5" />
        <line x1="6" y1="7.5" x2="11" y2="7.5" stroke="#16A34A" strokeWidth="1.8" />
        <line x1="6" y1="10.5" x2="13" y2="10.5" stroke="#16A34A" strokeWidth="1.8" />
        <path d="M14.5 11l4 4-2 .5-1.5 2.5z" fill="#16A34A" />
      </svg>
    ),
  },
  {
    id: "test-series",
    label: "TEST SERIES",
    description: "Mock Tests & PYQs",
    href: "/school",
    cardBg: "bg-[#FFF1F2] hover:bg-[#FFE4E7] dark:bg-rose-950/25 dark:hover:bg-rose-950/45 border-[#FFE4E6] dark:border-rose-900/50",
    iconBg: "bg-[#FFE4E6] dark:bg-rose-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-rose-600 dark:text-rose-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" fill="#FFE4E6" fillOpacity="0.5" />
        <rect x="8" y="2" width="8" height="3.5" rx="1" fill="#E11D48" stroke="#BE123C" />
        <path d="M8.5 10.5l1.8 1.8 3.5-3.5" stroke="#E11D48" strokeWidth="1.8" />
        <path d="M8.5 15.5l1.8 1.8 3.5-3.5" stroke="#E11D48" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "free-courses",
    label: "FREE COURSES",
    description: "Classes 9–12 • YouTube",
    href: "/free-courses",
    cardBg: "bg-[#FFF7ED] hover:bg-[#FFEFDC] dark:bg-orange-950/25 dark:hover:bg-orange-950/45 border-[#FFEDD5] dark:border-orange-900/50",
    iconBg: "bg-[#FFEDD5] dark:bg-orange-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-orange-600 dark:text-orange-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4" width="19" height="14" rx="2" fill="#FFEDD5" fillOpacity="0.5" />
        <polygon points="10 8 15.5 11 10 14 10 8" fill="#EA580C" stroke="#EA580C" strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="7" y1="21" x2="17" y2="21" stroke="#EA580C" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: "premium-courses",
    label: "PREMIUM COURSES",
    description: "Exclusive & Live",
    href: "/paid-courses",
    cardBg: "bg-[#F5F3FF] hover:bg-[#EDE9FE] dark:bg-purple-950/25 dark:hover:bg-purple-950/45 border-[#EDE9FE] dark:border-purple-900/50",
    iconBg: "bg-[#EDE9FE] dark:bg-purple-900/60",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3.5" width="20" height="13" rx="2" fill="#EDE9FE" fillOpacity="0.5" />
        <line x1="8" y1="20.5" x2="16" y2="20.5" />
        <line x1="12" y1="16.5" x2="12" y2="20.5" />
        <polygon points="10 7 14.5 10 10 13 10 7" fill="#4F46E5" stroke="#4F46E5" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="18" cy="5.5" r="2.8" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
      </svg>
    ),
  },
];

export function ResourceStrip() {
  return (
    <section
      id="courses-we-offer"
      className="relative z-30 -mt-5 sm:-mt-8 md:-mt-10 lg:-mt-12 w-full px-3 sm:px-4 md:px-6 pointer-events-auto"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Floating white container overlapping the hero - reduced border radius & compact padding */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl sm:rounded-2xl py-2 px-2 sm:py-2.5 sm:px-2.5 md:py-3 md:px-3 shadow-[0_10px_28px_-6px_rgba(0,0,0,0.1),0_3px_10px_-2px_rgba(0,0,0,0.05)] border border-slate-200/80 dark:border-slate-800">
          
          {/* Eyebrow: • COURSES WE OFFER */}
          <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-[10px] sm:text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-[#0B1F4B] dark:text-slate-200">
              COURSES WE OFFER
            </span>
          </div>

          {/* 6-Card layout: compact height, less rounded corners */}
          <div className="flex lg:grid lg:grid-cols-6 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x">
            {coursesOffer.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                id={`course-offer-${c.id}`}
                className={`flex flex-col justify-between p-2 sm:p-2.5 rounded-lg sm:rounded-xl border ${c.cardBg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs shrink-0 min-w-[155px] sm:min-w-[170px] lg:min-w-0 flex-1 snap-start group select-none relative min-h-[74px] sm:min-h-[80px]`}
              >
                {/* Top: Icon Box */}
                <div className="flex items-center justify-between w-full mb-1 sm:mb-1.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${c.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}>
                    {c.icon}
                  </div>
                </div>

                {/* Bottom: Text + Subtle Arrow */}
                <div className="flex items-end justify-between w-full gap-1">
                  <div className="flex flex-col min-w-0 flex-1 pr-1">
                    <span className="text-[11.5px] sm:text-[12px] font-extrabold text-[#0B1F4B] dark:text-white leading-tight truncate">
                      {c.label}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-normal mt-0.5 truncate">
                      {c.description}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
