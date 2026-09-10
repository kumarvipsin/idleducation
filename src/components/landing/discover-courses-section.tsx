'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Clean 2D Illustrated Academic Textbooks (Tile 01 - CBSE)
function CbseBookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="31" rx="11" ry="1.5" fill="#B45309" opacity="0.12" />

            {/* Bottom Book (Deep Navy / Academic Core) */}
            <rect x="6" y="22" width="24" height="6" rx="2" fill="#1E3A8A" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="6" y="22" width="4" height="6" rx="1.2" fill="#0F172A" />
            <line x1="12" y1="25" x2="26" y2="25" stroke="#93C5FD" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />

            {/* Middle Book (Forest Green / Science) */}
            <rect x="7.5" y="15.5" width="21" height="6" rx="2" fill="#059669" stroke="#064E3B" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="7.5" y="15.5" width="3.5" height="6" rx="1.2" fill="#047857" />
            <line x1="13" y1="18.5" x2="24.5" y2="18.5" stroke="#A7F3D0" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />

            {/* Top Book (Warm Amber CBSE Gold) */}
            <rect x="5.5" y="9" width="23" height="6" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" strokeLinejoin="round" />
            <rect x="5.5" y="9" width="3.8" height="6" rx="1.2" fill="#D97706" />
            <line x1="11.5" y1="12" x2="24" y2="12" stroke="#FEF3C7" strokeWidth="1.1" strokeLinecap="round" />

            {/* Clean Bookmark Ribbon */}
            <path d="M21 9V18L23.5 16.5L26 18V9H21Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.1" strokeLinejoin="round" />

            {/* Subtle Gold Star Badge on Spine */}
            <circle cx="15.5" cy="12" r="1.3" fill="#FEF08A" />
        </svg>
    );
}

// 2. Clean 2D Precision Exam Timer (Tile 02 - JEE & NEET)
function AlarmClockIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="32" rx="9" ry="1.5" fill="#312E81" opacity="0.12" />

            {/* Angled Feet */}
            <line x1="11" y1="26" x2="8.5" y2="30.5" stroke="#4338CA" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="25" y1="26" x2="27.5" y2="30.5" stroke="#4338CA" strokeWidth="2.2" strokeLinecap="round" />

            {/* Twin Top Bells */}
            <path d="M7 11C7 7.5 10.5 6 13 8L12 11.5L7 11Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M29 11C29 7.5 25.5 6 23 8L24 11.5L29 11Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.3" strokeLinejoin="round" />
            {/* Center Hammer */}
            <rect x="17" y="5.5" width="2" height="3.5" rx="0.8" fill="#B45309" />
            <circle cx="18" cy="5.5" r="1.6" fill="#F59E0B" />

            {/* Main Clock Outer Ring */}
            <circle cx="18" cy="19" r="10.5" fill="#EEF2FF" stroke="#4338CA" strokeWidth="1.6" />
            <circle cx="18" cy="19" r="8.5" fill="#FFFFFF" />

            {/* 4 Cardinal Hour Ticks */}
            <line x1="18" y1="12" x2="18" y2="13.5" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="18" y1="24.5" x2="18" y2="26" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="11" y1="19" x2="12.5" y2="19" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="23.5" y1="19" x2="25" y2="19" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" />

            {/* Clock Hands (Targeting Exam Precision) */}
            <line x1="18" y1="19" x2="14.5" y2="16" stroke="#312E81" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="18" y1="19" x2="22" y2="15" stroke="#4338CA" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="18" y1="20" x2="18" y2="13.5" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />

            {/* Center Pivot */}
            <circle cx="18" cy="19" r="1.6" fill="#F59E0B" stroke="#B45309" strokeWidth="0.7" />
        </svg>
    );
}

// 3. Clean 2D Computer-Based Test Screen (Tile 03 - CUET Exam)
function CuetCbtExamIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="31" rx="9" ry="1.4" fill="#065F46" opacity="0.12" />

            {/* Pedestal Stand */}
            <path d="M13 28H23" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="16.5" y="23" width="3" height="5" rx="1" fill="#059669" stroke="#047857" strokeWidth="1" />

            {/* Monitor Outer Frame */}
            <rect x="5.5" y="6.5" width="25" height="17.5" rx="2.5" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
            {/* Top Exam Header Strip */}
            <path d="M6.5 7.5H29.5V11H6.5V7.5Z" fill="#A7F3D0" />
            <circle cx="9" cy="9.2" r="0.9" fill="#047857" />
            <line x1="12" y1="9.2" x2="16" y2="9.2" stroke="#047857" strokeWidth="0.9" strokeLinecap="round" />
            <rect x="23" y="8.2" width="5" height="2" rx="0.6" fill="#047857" />

            {/* Question Line */}
            <line x1="8.5" y1="13.5" x2="18.5" y2="13.5" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" />

            {/* Option A: Selected Checkmark */}
            <circle cx="10" cy="17" r="1.8" fill="#10B981" />
            <path d="M9.1 17L9.8 17.7L11.1 16.3" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="13.5" y1="17" x2="20" y2="17" stroke="#047857" strokeWidth="1.1" strokeLinecap="round" />

            {/* Option B: Unselected Circle */}
            <circle cx="10" cy="20.5" r="1.5" stroke="#6EE7B7" strokeWidth="0.9" fill="#FFFFFF" />
            <line x1="13.5" y1="20.5" x2="18" y2="20.5" stroke="#9CA3AF" strokeWidth="0.9" strokeLinecap="round" />

            {/* Small Sleek Cursor */}
            <path d="M21 16L24.5 19.5L23 20L24 22L22.8 22.5L21.8 20.5L20.5 21.5V16Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" strokeLinejoin="round" />
        </svg>
    );
}

// 4. Clean 2D Assessment Clipboard (Tile 04 - Test Series)
function TestSeriesClipboardIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="31" rx="8.5" ry="1.4" fill="#881337" opacity="0.12" />

            {/* Clipboard Backing Board */}
            <rect x="7" y="6.5" width="22" height="24" rx="2.8" fill="#FFE4E6" stroke="#BE123C" strokeWidth="1.5" />

            {/* Inner Paper */}
            <rect x="9.5" y="9.5" width="17" height="19.5" rx="1.5" fill="#FFFFFF" stroke="#FECDD3" strokeWidth="0.8" />

            {/* Top Metal Clamp Clip */}
            <rect x="13.5" y="4.5" width="9" height="4.5" rx="1.4" fill="#FACC15" stroke="#A16207" strokeWidth="1.1" />
            <circle cx="18" cy="6.8" r="0.8" fill="#78350F" />

            {/* Checklist Question 1 */}
            <path d="M11.5 13.5L12.5 14.5L14.5 12.5" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16.5" y1="13.5" x2="23.5" y2="13.5" stroke="#E11D48" strokeWidth="1.1" strokeLinecap="round" />

            {/* Checklist Question 2 */}
            <path d="M11.5 17.5L12.5 18.5L14.5 16.5" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16.5" y1="17.5" x2="22.5" y2="17.5" stroke="#E11D48" strokeWidth="1.1" strokeLinecap="round" />

            {/* Checklist Question 3 */}
            <path d="M11.5 21.5L12.5 22.5L14.5 20.5" stroke="#16A34A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16.5" y1="21.5" x2="21" y2="21.5" stroke="#E11D48" strokeWidth="1.1" strokeLinecap="round" />

            {/* Golden Star Achievement Seal on bottom right */}
            <circle cx="21" cy="24.5" r="2.8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            <path d="M21 23.2L21.4 24.1L22.4 24.2L21.6 24.9L21.8 25.8L21 25.3L20.2 25.8L20.4 24.9L19.6 24.2L20.6 24.1L21 23.2Z" fill="#D97706" />
        </svg>
    );
}

// 5. Clean 2D Video Learning Screen (Tile 05 - Free Courses)
function FreeCourseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="30" rx="9" ry="1.4" fill="#9A3412" opacity="0.12" />

            {/* Video Player Device Frame */}
            <rect x="6" y="7.5" width="24" height="19.5" rx="3" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" />

            {/* Top Device Header Bar */}
            <line x1="6.5" y1="11.5" x2="29.5" y2="11.5" stroke="#FED7AA" strokeWidth="0.9" />
            <circle cx="18" cy="9.5" r="0.7" fill="#C2410C" />

            {/* Centered Video Play Button */}
            <circle cx="18" cy="17.5" r="4.2" fill="#F97316" stroke="#C2410C" strokeWidth="0.9" />
            <path d="M16.8 15.8L20 17.5L16.8 19.2V15.8Z" fill="#FFFFFF" />

            {/* Video Progress Bar at Bottom of Screen */}
            <rect x="9.5" y="23" width="17" height="1.4" rx="0.7" fill="#FED7AA" />
            <rect x="9.5" y="23" width="9.5" height="1.4" rx="0.7" fill="#EA580C" />
            <circle cx="19" cy="23.7" r="1" fill="#C2410C" />
        </svg>
    );
}

// 6. Clean 2D Premium Video & Academic Crest (Tile 06 - Premium Courses)
function PremiumCourseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Subtle grounding shadow */}
            <ellipse cx="18" cy="30" rx="9" ry="1.4" fill="#1E3A8A" opacity="0.12" />

            {/* Video Player Device Frame (IDL Royal Blue) */}
            <rect x="6" y="7.5" width="24" height="19.5" rx="3" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />

            {/* Top Device Header Bar */}
            <line x1="6.5" y1="11.5" x2="29.5" y2="11.5" stroke="#BFDBFE" strokeWidth="0.9" />
            <circle cx="18" cy="9.5" r="0.7" fill="#1D4ED8" />

            {/* Centered Video Play Button */}
            <circle cx="18" cy="17.5" r="4.2" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.9" />
            <path d="M16.8 15.8L20 17.5L16.8 19.2V15.8Z" fill="#FFFFFF" />

            {/* Video Progress Bar at Bottom of Screen */}
            <rect x="9.5" y="23" width="17" height="1.4" rx="0.7" fill="#BFDBFE" />
            <rect x="9.5" y="23" width="10.5" height="1.4" rx="0.7" fill="#2563EB" />
            <circle cx="20" cy="23.7" r="1" fill="#1D4ED8" />

            {/* Gold Academic Achievement Star Badge on Top-Right */}
            <circle cx="25.5" cy="7.5" r="2.8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            <path d="M25.5 6.2L25.9 7.1L26.9 7.2L26.1 7.9L26.3 8.8L25.5 8.3L24.7 8.8L24.9 7.9L24.1 7.2L25.1 7.1L25.5 6.2Z" fill="#D97706" />
        </svg>
    );
}

interface CourseItem {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    href: string;
    bgColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

const courses: CourseItem[] = [
    {
        id: 'cbse',
        number: '01',
        title: 'CBSE BOARD',
        subtitle: 'Classes 9–12',
        href: '#',
        bgColor: 'bg-[#FFF8EB] hover:bg-[#FEF1D4] dark:bg-amber-950/40',
        borderColor: 'border-[#FCE5BA] dark:border-amber-800/50',
        icon: CbseBookIcon,
    },
    {
        id: 'jee-neet',
        number: '02',
        title: 'JEE & NEET',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#EDF4FE] hover:bg-[#E1ECFE] dark:bg-indigo-950/40',
        borderColor: 'border-[#D0E2FD] dark:border-indigo-800/50',
        icon: AlarmClockIcon,
    },
    {
        id: 'cuet',
        number: '03',
        title: 'CUET EXAM',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#E6F9EE] hover:bg-[#D7F5E4] dark:bg-emerald-950/40',
        borderColor: 'border-[#BEEFD5] dark:border-emerald-800/50',
        icon: CuetCbtExamIcon,
    },
    {
        id: 'test-series',
        number: '04',
        title: 'TEST SERIES',
        subtitle: 'Mock Tests & PYQs',
        href: '#',
        bgColor: 'bg-[#FEEBF0] hover:bg-[#FDE0E6] dark:bg-rose-950/40',
        borderColor: 'border-[#FCC8D4] dark:border-rose-800/50',
        icon: TestSeriesClipboardIcon,
    },
    {
        id: 'free-courses',
        number: '05',
        title: 'FREE COURSES',
        subtitle: 'Classes 9–12 • YouTube',
        href: '/free-courses',
        bgColor: 'bg-[#FFF6EE] hover:bg-[#FFF0E4] dark:bg-orange-950/30',
        borderColor: 'border-[#FEDDC7] dark:border-orange-800/40',
        icon: FreeCourseIcon,
    },
    {
        id: 'premium-courses',
        number: '06',
        title: 'PREMIUM COURSES',
        subtitle: 'Exclusive & Live',
        href: '#',
        bgColor: 'bg-[#EEF3FE] hover:bg-[#E2EBFE] dark:bg-blue-950/40',
        borderColor: 'border-[#CFDCFD] dark:border-blue-800/50',
        icon: PremiumCourseIcon,
    },
];

export function DiscoverCoursesSection() {
    return (
        <section suppressHydrationWarning className="relative w-full bg-gradient-to-b from-transparent via-[#F7F9FD] to-[#F7F9FD] dark:bg-background -mt-5 sm:-mt-7 md:-mt-9 lg:-mt-11 z-20 pt-6 sm:pt-7 md:pt-8 pb-5 sm:pb-6 overflow-hidden">
            
            {/* Ambient Background Texture: Faint Academic Dot Grid (3-4% Opacity) */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                  backgroundSize: '16px 16px'
                }}
            />

            {/* Soft Ambient Depth: Low-Opacity Blue Radial Wash on Left/Center */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute -top-12 left-1/4 w-[520px] h-[340px] bg-blue-500/[0.045] dark:bg-blue-500/[0.03] blur-3xl rounded-full" 
            />

            {/* Very Subtle Warm Orange Accent toward Right Side */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute -bottom-12 right-1/6 w-[380px] h-[260px] bg-orange-500/[0.03] dark:bg-orange-500/[0.02] blur-3xl rounded-full" 
            />

            <div className="container mx-auto px-2.5 min-[360px]:px-3.5 sm:px-6 md:px-8 lg:px-8 xl:px-10 max-w-[1240px] relative z-10">
                
                {/* Floating Pure White Course Shelf (Visual Separation from #F7F9FD Background) */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 min-[360px]:p-3.5 sm:p-4 shadow-[0_12px_36px_-6px_rgba(16,42,104,0.07),0_4px_16px_-2px_rgba(16,42,104,0.03)] overflow-hidden">
                    
                    {/* Eyebrow: Subtle section eyebrow with tiny IDL orange accent (no button/pill styling) */}
                    <div className="relative z-10 flex items-center justify-center gap-2 mb-3 min-[360px]:mb-3.5 sm:mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B16] shrink-0" aria-hidden="true" />
                        <span className="text-[11px] sm:text-[11.5px] font-bold tracking-wider text-[#0B1F4B] dark:text-blue-200 uppercase select-none">
                            Courses We Offer
                        </span>
                    </div>

                    {/* Mobile: 2x3 (grid-cols-2) | Tablet: 3x2 (md:grid-cols-3) | Desktop: 1 Row of 6 (lg:grid-cols-6) with distinct gap */}
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 min-[360px]:gap-3 sm:gap-3.5 lg:gap-2.5 xl:gap-3">
                        {courses.map((course) => {
                            const Icon = course.icon;
                            return (
                                <Link
                                    key={course.id}
                                    href={course.href}
                                    onClick={(e) => {
                                        if (course.href === '#') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className={cn(
                                        "group relative flex flex-col justify-between rounded-xl border-[1.5px]",
                                        // Rebalanced height: cohesive icon-to-title rhythm without excessive dead space
                                        "h-[110px] min-[360px]:h-[114px] min-[390px]:h-[118px] sm:h-[124px] lg:h-[96px] xl:h-[102px]",
                                        // Balanced internal padding preventing bottom cramping
                                        "px-2.5 pt-2.5 pb-2 min-[360px]:px-2.5 min-[360px]:pt-2.5 min-[360px]:pb-2 sm:px-3 sm:pt-3 sm:pb-2.5 lg:px-2.5 lg:pt-2.5 lg:pb-2 xl:px-3 xl:pt-3 xl:pb-2.5",
                                        "shadow-[0_2px_8px_-2px_rgba(16,42,104,0.06)] hover:shadow-[0_6px_16px_-3px_rgba(16,42,104,0.12)] transition-all duration-180 ease-out hover:-translate-y-0.5",
                                        course.bgColor,
                                        course.borderColor
                                    )}
                                >
                                    {/* Top Row: Category Icon (+6-7% desktop presence) */}
                                    <div className="flex items-start justify-start">
                                        <div className="shrink-0">
                                            <Icon className="w-[34px] h-[34px] min-[360px]:w-9 min-[360px]:h-9 sm:w-[38px] sm:h-[38px] lg:w-[30px] lg:h-[30px] xl:w-[34px] xl:h-[34px] transition-transform duration-180 ease-out group-hover:scale-105" />
                                        </div>
                                    </div>

                                    {/* 
                                      Bottom Row:
                                      - Course Title: Full text visible without clipping or ellipsis, calibrated font size & tracking
                                      - Supporting Subtitle + Arrow: balanced vertical margin avoiding bottom tightness
                                    */}
                                    <div className="mt-auto w-full">
                                        <h4 className="text-[11.5px] min-[360px]:text-[12px] min-[390px]:text-[12.8px] sm:text-[13.5px] lg:text-[11px] xl:text-[11.5px] font-semibold text-[#0B2154] dark:text-white tracking-[-0.015em] leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap overflow-visible">
                                            {course.title}
                                        </h4>
                                        <div className="flex items-center justify-between gap-1 mt-0.5 min-[360px]:mt-1 lg:mt-0.5">
                                            <p className="text-[9.5px] min-[360px]:text-[10px] min-[390px]:text-[10.5px] lg:text-[8.5px] xl:text-[9px] font-medium text-slate-500 dark:text-slate-400 leading-tight truncate">
                                                {course.subtitle}
                                            </p>
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 lg:w-3 lg:h-3 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200 shrink-0 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
