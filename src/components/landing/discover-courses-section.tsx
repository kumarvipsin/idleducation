import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Purple Alarm Clock (Tile 01)
function AlarmClockIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Vibration ticks */}
            <path d="M7 11C6.2 12.2 5.8 13.5 5.8 15" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M33 11C33.8 12.2 34.2 13.5 34.2 15" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
            {/* Bells on top */}
            <path d="M12.5 10.5C11 11.8 10 13.5 9.5 15.5L14.5 13.5L12.5 10.5Z" fill="#7C3AED" />
            <path d="M27.5 10.5C29 11.8 30 13.5 30.5 15.5L25.5 13.5L27.5 10.5Z" fill="#7C3AED" />
            {/* Feet */}
            <path d="M12 32L10 35" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M28 32L30 35" stroke="#6D28D9" strokeWidth="2.2" strokeLinecap="round" />
            {/* Clock Body */}
            <circle cx="20" cy="22" r="11" fill="#7C3AED" />
            <circle cx="20" cy="22" r="9" fill="#8B5CF6" />
            {/* Clock Face */}
            <circle cx="20" cy="22" r="7.5" fill="#EDE9FE" />
            {/* Clock Hands */}
            <path d="M20 18.5V22.2L22.5 23.8" stroke="#4C1D95" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="22" r="1.2" fill="#4C1D95" />
        </svg>
    );
}

// 2. Orange Video Play Card with Sparkles (Tile 02)
function VideoPlayIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Sparkles */}
            <path d="M11 9L9.5 7" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 6V4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M18 8.5L20 7" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
            {/* Shadow line underneath */}
            <path d="M12 33C17 34 26 34 30 33" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            {/* Card Body */}
            <rect x="10" y="11" width="21" height="19" rx="5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <rect x="11.5" y="12.5" width="18" height="16" rx="4" fill="#EF4444" />
            {/* Play Triangle */}
            <path d="M18 16.5L25 20.5L18 24.5V16.5Z" fill="#FFFFFF" stroke="#991B1B" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
    );
}

// 3. Mint Green Diploma Scroll with Ribbon Bow (Tile 03)
function DiplomaIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Sparkles */}
            <path d="M20 7V5" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M15 8.5L13.5 7" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M25 8.5L26.5 7" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
            {/* Scroll Roll */}
            <rect x="7" y="15" width="26" height="11" rx="4" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
            <path d="M10 15V26" stroke="#047857" strokeWidth="1.5" />
            <path d="M30 15V26" stroke="#047857" strokeWidth="1.5" />
            {/* Ribbon Wrap */}
            <rect x="18" y="14" width="4.5" height="13" rx="1" fill="#065F46" />
            {/* Ribbon Bow on top */}
            <circle cx="20.2" cy="13.5" r="2.2" fill="#047857" />
            {/* Ribbon Tails */}
            <path d="M19 27L17 33L19.5 31.5L21.5 33L21 27" fill="#065F46" />
            <path d="M21 27L23 33L21 31.5L19 33" fill="#047857" opacity="0.7" />
        </svg>
    );
}

// 4. Pink Notebook with Pencil (Tile 04)
function NotebookPencilIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Sparkles */}
            <path d="M28 8L30 6" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 11H34" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round" />
            {/* Notebook Base */}
            <rect x="10" y="11" width="18" height="22" rx="3.5" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
            <rect x="12" y="13" width="14" height="18" rx="2" fill="#FFF1F2" />
            <path d="M15 17H22" stroke="#F43F5E" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M15 21H22" stroke="#F43F5E" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M15 25H20" stroke="#F43F5E" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="10" y="11" width="3.5" height="22" rx="1.5" fill="#9F1239" />
            {/* Angled Pencil */}
            <g transform="rotate(35 25 18)">
                <rect x="22" y="7" width="4.5" height="15" rx="1" fill="#FACC15" stroke="#A16207" strokeWidth="1" />
                <path d="M22 22L24.2 25L26.5 22H22Z" fill="#EA580C" />
                <circle cx="24.2" cy="24.5" r="0.6" fill="#111827" />
                <rect x="22" y="6" width="4.5" height="2" fill="#E11D48" />
            </g>
        </svg>
    );
}

// 5. Peach Device with Question Mark (Tile 05)
function TabletQuestionIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Sparkles on top */}
            <path d="M17 6L16 4" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 5V3" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M23 6L24 4" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
            {/* Tablet Body */}
            <rect x="12" y="9" width="16" height="24" rx="3.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <rect x="14" y="11.5" width="12" height="17" rx="2" fill="#FFF7ED" />
            {/* Question Mark */}
            <path d="M18.2 16.5C18.2 15.5 19 14.8 20 14.8C21 14.8 21.8 15.5 21.8 16.5C21.8 17.5 20.6 18 20 18.8V20" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="20" cy="22.5" r="0.9" fill="#C2410C" />
            {/* Home button */}
            <circle cx="20" cy="30.5" r="1.1" fill="#FFF7ED" />
        </svg>
    );
}

// 6. Baby Blue Laptop & One-to-One Classroom (Tile 06)
function LaptopClassIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)}>
            {/* Laptop Screen */}
            <rect x="9" y="11" width="22" height="16" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
            <rect x="11" y="13" width="18" height="12" rx="1.5" fill="#EFF6FF" />
            {/* Teacher on Screen */}
            <circle cx="15.5" cy="17" r="2" fill="#EF4444" />
            <path d="M12.5 22.5C12.5 20.8 13.8 19.8 15.5 19.8C17.2 19.8 18.5 20.8 18.5 22.5" fill="#EF4444" />
            {/* Chat bubble on screen */}
            <rect x="20" y="15" width="7" height="4.5" rx="1.5" fill="#93C5FD" />
            {/* Laptop Base */}
            <path d="M6.5 27.5C6.5 26.7 7.2 26 8 26H32C32.8 26 33.5 26.7 33.5 27.5V29C33.5 29.5 33 30 32.5 30H7.5C7 30 6.5 29.5 6.5 29V27.5Z" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.2" />
            <rect x="17" y="26.5" width="6" height="1.2" rx="0.6" fill="#BFDBFE" />
            {/* Student avatar at bottom-right */}
            <circle cx="29.5" cy="27" r="2.2" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <path d="M26.5 33C26.5 31.2 27.8 30 29.5 30C31.2 30 32.5 31.2 32.5 33" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
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
        title: 'CBSE',
        subtitle: 'Classes 6–12',
        href: '/free-courses',
        bgColor: 'bg-[#FEF1D4] hover:bg-[#FDE8BE] dark:bg-amber-950/50',
        borderColor: 'border-[#FBD99B] dark:border-amber-800/60',
        icon: VideoPlayIcon,
    },
    {
        id: 'jee-neet',
        number: '02',
        title: 'JEE & NEET',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#E1ECFE] hover:bg-[#D4E3FD] dark:bg-indigo-950/50',
        borderColor: 'border-[#BED5FC] dark:border-indigo-800/60',
        icon: AlarmClockIcon,
    },
    {
        id: 'cuet',
        number: '03',
        title: 'CUET EXAM',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#D5F5E5] hover:bg-[#C2EED7] dark:bg-emerald-950/50',
        borderColor: 'border-[#A8E6C8] dark:border-emerald-800/60',
        icon: DiplomaIcon,
    },
    {
        id: 'govt-exams',
        number: '04',
        title: 'GOVT EXAMS',
        subtitle: 'SSC · Banking',
        href: '#',
        bgColor: 'bg-[#FDE0E6] hover:bg-[#FCCED7] dark:bg-rose-950/50',
        borderColor: 'border-[#FBB6C4] dark:border-rose-800/60',
        icon: NotebookPencilIcon,
    },
    {
        id: 'free-courses',
        number: '05',
        title: 'FREE COURSES',
        subtitle: 'Classes 9–10',
        href: '/free-courses',
        bgColor: 'bg-[#FEE6D4] hover:bg-[#FED8BE] dark:bg-orange-950/50',
        borderColor: 'border-[#FDC49F] dark:border-orange-800/60',
        icon: TabletQuestionIcon,
    },
    {
        id: 'test-series',
        number: '06',
        title: 'TEST SERIES',
        subtitle: 'Practice & Mock',
        href: '#',
        bgColor: 'bg-[#DCEBFE] hover:bg-[#CBE0FD] dark:bg-blue-950/50',
        borderColor: 'border-[#B5D5FC] dark:border-blue-800/60',
        icon: LaptopClassIcon,
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
                    
                    {/* Compact Label: Small orange dot + Courses We Offer */}
                    <div className="relative z-10 flex justify-center mb-2.5 min-[360px]:mb-3 sm:mb-3.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 min-[360px]:px-3.5 rounded-full bg-white/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70 shadow-[0_1px_3px_rgba(16,42,104,0.04)] text-[#102A68] dark:text-blue-200 font-semibold text-[10.5px] min-[360px]:text-[11px] sm:text-[11.5px] tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
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
                                    className={cn(
                                        "group relative flex flex-col justify-between rounded-xl border-[1.5px]",
                                        // Refined height: 130-138px on mobile; 100-106px on desktop (unchanged)
                                        "h-[130px] min-[360px]:h-[134px] min-[390px]:h-[138px] sm:h-[142px] lg:h-[100px] xl:h-[106px]",
                                        // Balanced internal text-safe padding: gives comfortable breathing room from all boundaries
                                        "p-3 min-[360px]:p-3.5 sm:p-4 lg:p-3 xl:p-3.5",
                                        "shadow-[0_2px_8px_-2px_rgba(16,42,104,0.06)] hover:shadow-[0_6px_16px_-3px_rgba(16,42,104,0.12)] transition-all duration-180 ease-out hover:-translate-y-0.5",
                                        course.bgColor,
                                        course.borderColor
                                    )}
                                >
                                    {/* 
                                      Top Row:
                                      - Mobile: Number on upper-left (order-1), Enriched larger Icon on upper-right (order-2)
                                      - Desktop: Icon on left (lg:order-1), Number on right (lg:order-2)
                                    */}
                                    <div className="flex items-start justify-between">
                                        <span className="order-1 lg:order-2 text-[10px] min-[360px]:text-[10.5px] lg:text-[9px] xl:text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 leading-none select-none">
                                            {course.number}
                                        </span>
                                        <div className="order-2 lg:order-1 shrink-0">
                                            <Icon className="w-12 h-12 min-[360px]:w-[50px] min-[360px]:h-[50px] sm:w-[52px] sm:h-[52px] lg:w-[34px] lg:h-[34px] xl:w-[38px] xl:h-[38px] transition-transform duration-180 ease-out group-hover:scale-105" />
                                        </div>
                                    </div>

                                    {/* 
                                      Bottom Row:
                                      - Course Title: Strong IDL Navy (#0B2154), controlled line-height, comfortable safe-insets
                                      - Supporting Class Info + Arrow: small controlled gap, comfortable spacing from tile boundaries
                                    */}
                                    <div className="mt-auto w-full">
                                        <h4 className="text-[12.5px] min-[360px]:text-[13.5px] min-[390px]:text-[14px] sm:text-[14.5px] lg:text-[11px] xl:text-[11.5px] font-extrabold text-[#0B2154] dark:text-white tracking-tight leading-[1.25] group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {course.title}
                                        </h4>
                                        <div className="flex items-center justify-between gap-1.5 mt-1 min-[360px]:mt-1.5 lg:mt-1">
                                            <p className="text-[10px] min-[360px]:text-[10.5px] min-[390px]:text-[11px] lg:text-[8.5px] xl:text-[9px] font-semibold text-slate-600 dark:text-slate-300 leading-none truncate">
                                                {course.subtitle}
                                            </p>
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-3 lg:h-3 text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-100 shrink-0 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
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
