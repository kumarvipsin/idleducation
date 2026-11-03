import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, ArrowRight, Train, Star, Sparkles, Building2, ShieldCheck, Monitor, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRANCHES_DATA } from '@/data/branches-data';

export const metadata: Metadata = {
  title: 'Offline Branches in Delhi - Budh Vihar, Krishna Vihar, Mangolpuri, Mukherjee Nagar | IDL Education',
  description: 'Explore IDL Education offline learning centres across Delhi: Budh Vihar, Krishna Vihar, Mangolpuri, and Mukherjee Nagar. Modern smart classrooms, expert CBSE faculty, CUET coaching, and personalized doubt sessions.',
};

export default function BranchesIndexPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-background relative selection:bg-[#102A68]/10 selection:text-[#102A68]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-20 relative z-10">
        
        {/* ── TOP HERO: Delhi Network & 3D Artwork ───────────────────── */}
        <div className="relative rounded-[22px] sm:rounded-[26px] bg-gradient-to-b from-[#F5F8FF] via-white to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900/40 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 mb-10 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 text-left space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-xs sm:text-[13px] font-bold text-[#102A68] dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" />
                <span>DELHI NETWORK • 4 CENTRES</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#102A68] dark:text-white tracking-tight leading-[1.1]">
                <span className="block">4 CENTRES.</span>
                <span className="block text-[#155EEF] dark:text-blue-400">ONE COMMITMENT.</span>
              </h1>

              <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-snug">
                Quality CBSE & Competitive Education across premier offline learning hubs in <span className="text-[#FF6B00] font-bold">Delhi</span>.
              </p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Monitor className="w-3.5 h-3.5 text-blue-600" /> Smart Classrooms
                </span>
                <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Daily Doubt Desks
                </span>
                <span className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Max 25-30 Students
                </span>
              </div>
            </div>

            {/* Right Visual Map */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[580px]">
                <Image
                  src="/branchmap1.png"
                  alt="IDL Offline Centres Map - Delhi Network"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-contain max-h-[380px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION HEADER ─────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <h2 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-sm sm:text-base font-bold text-[#102A68] dark:text-white tracking-tight shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" />
            <span>Select Your Nearest IDL Learning Centre</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Click on any branch below to view its full details, faculty, batches, facilities, and Google Maps directions.
          </p>
        </div>

        {/* ── 4 BRANCH CARDS GRID ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES_DATA.map((branch) => (
            <div
              key={branch.id}
              className="group bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(16,42,104,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(16,42,104,0.12)] hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 transition-all duration-200 flex flex-col h-full overflow-hidden"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={branch.imageUrl}
                  alt={branch.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{branch.rating}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    <Link href={`/branches/${branch.slug}`}>
                      {branch.shortName}
                    </Link>
                  </h3>

                  <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 mt-2 min-h-[38px] text-xs leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#2563EB]" />
                    <span>{branch.fullAddress}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mt-2 text-xs">
                    <Train className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span className="truncate">{branch.nearestMetro}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <Button
                    asChild
                    className="w-full h-10 px-4 rounded-[8px] font-bold text-xs sm:text-sm bg-[#102A68] hover:bg-[#0B1E4B] text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Link href={`/branches/${branch.slug}`}>
                      View Branch Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8.5 rounded-[6px] text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <a href={`tel:${branch.phone}`} className="flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        Call
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8.5 rounded-[6px] text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Link href={branch.mapLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                        Map
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
