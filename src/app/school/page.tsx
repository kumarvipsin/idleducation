'use client';

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    BookOpen, 
    GraduationCap, 
    Sparkles, 
    Sigma, 
    TestTube2, 
    BookText, 
    Landmark, 
    Scale, 
    TrendingUp, 
    Eye, 
    Download, 
    FileText,
    CheckCircle2,
    Trophy,
    MessageSquare,
    Layers,
    Phone,
    FileCheck,
    Bot,
    ChevronRight,
    Award
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { ContactModal } from "@/components/contact-modal";

// ── ILLUSTRATED COLORFUL SUBJECT ICONS (Matching Courses We Offer Style) ──
function ScienceIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#ECFDF5" />
            <path d="M16 11V15.5L10.8 24.2C10.1 25.4 11 27 12.4 27H27.6C29 27 29.9 25.4 29.2 24.2L24 15.5V11" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 11H25" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
            <path d="M12.5 22H27.5L26.5 25H13.5L12.5 22Z" fill="#10B981" />
            <circle cx="16" cy="24" r="1.5" fill="#34D399" />
            <circle cx="21" cy="21" r="2" fill="#6EE7B7" />
            <circle cx="23" cy="24" r="1" fill="#A7F3D0" />
            <path d="M28 10L29 7L32 6L29 5L28 2L27 5L24 6L27 7L28 10Z" fill="#F59E0B" />
        </svg>
    );
}

function MathsIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
            <rect x="10" y="10" width="20" height="20" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
            <rect x="13" y="13" width="14" height="6" rx="2" fill="#DBEAFE" />
            <path d="M15 22H17M23 22H25M15 26H17M23 26H25" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 22V26" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="31" cy="11" r="2" fill="#F59E0B" />
        </svg>
    );
}

function EnglishIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#EEF2FF" />
            <path d="M9 13C9 11.8954 9.89543 11 11 11H20V28H11C9.89543 28 9 27.1046 9 26V13Z" fill="#6366F1" />
            <path d="M31 13C31 11.8954 30.1046 11 29 11H20V28H29C30.1046 28 31 27.1046 31 26V13Z" fill="#818CF8" />
            <path d="M20 11V28" stroke="#4338CA" strokeWidth="1.5" />
            <path d="M12 15H17M12 19H17M12 23H15" stroke="#E0E7FF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M23 15H28M23 19H28M23 23H26" stroke="#EEF2FF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M27 9L28.5 6L31.5 5L28.5 4L27 1L25.5 4L22.5 5L25.5 6L27 9Z" fill="#EC4899" />
        </svg>
    );
}

function SocialIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#FFFBEB" />
            <circle cx="20" cy="19" r="9.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <path d="M11 19C11 19 14 16 18 18C22 20 25 17 28.5 18.5" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="20" cy="19" rx="9.5" ry="4" stroke="#D97706" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M20 9.5V28.5" stroke="#D97706" strokeWidth="1.2" opacity="0.6" />
            <path d="M14 29H26" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 28.5V31" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function PoliticalIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#EEF2FF" />
            <path d="M20 8V28" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 13H29" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 13L8 21H14L11 13Z" fill="#818CF8" />
            <path d="M29 13L26 21H32L29 13Z" fill="#818CF8" />
            <path d="M16 29H24" stroke="#312E81" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="8" r="2" fill="#F59E0B" />
        </svg>
    );
}

function HistoryIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#FFFBEB" />
            <rect x="11" y="9" width="18" height="3" rx="1" fill="#D97706" />
            <rect x="11" y="27" width="18" height="3" rx="1" fill="#D97706" />
            <path d="M14 12V27M20 12V27M26 12V27" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M9 31H31" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 7H31" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function EconomicsIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#ECFDF5" />
            <rect x="10" y="22" width="4" height="7" rx="1" fill="#A7F3D0" stroke="#059669" strokeWidth="1" />
            <rect x="16" y="17" width="4" height="12" rx="1" fill="#34D399" stroke="#059669" strokeWidth="1" />
            <rect x="22" y="12" width="4" height="17" rx="1" fill="#10B981" stroke="#047857" strokeWidth="1" />
            <rect x="28" y="8" width="4" height="21" rx="1" fill="#047857" stroke="#065F46" strokeWidth="1" />
            <path d="M10 20L17 14L23 16L30 7" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 7H30V11" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── SUBJECT CONFIGURATIONS WITH ILLUSTRATED ICONS ──
const schoolSubjects = [
    { 
        name: "Science", 
        key: "science", 
        icon: <ScienceIllustIcon />, 
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        badgeBg: "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
    { 
        name: "Mathematics", 
        key: "maths", 
        icon: <MathsIllustIcon />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        badgeBg: "bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    },
    { 
        name: "English", 
        key: "english", 
        icon: <EnglishIllustIcon />, 
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40",
        badgeBg: "bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    },
    { 
        name: "Social Studies", 
        key: "social", 
        icon: <SocialIllustIcon />, 
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        badgeBg: "bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    },
];

const seniorSubjects = [
    { 
        name: "Political Science", 
        key: "political-science", 
        icon: <PoliticalIllustIcon />, 
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40",
        badgeBg: "bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    },
    { 
        name: "History", 
        key: "history", 
        icon: <HistoryIllustIcon />, 
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        badgeBg: "bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    },
    { 
        name: "English", 
        key: "english", 
        icon: <EnglishIllustIcon />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        badgeBg: "bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    },
    { 
        name: "Economics", 
        key: "economics", 
        icon: <EconomicsIllustIcon />, 
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        badgeBg: "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    },
];

function ReferenceBookIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#EFF6FF" />
            <path d="M10 12C10 10.8954 10.8954 10 12 10H20V28H12C10.8954 28 10 27.1046 10 26V12Z" fill="#3B82F6" />
            <path d="M30 12C30 10.8954 29.1046 10 28 10H20V28H28C29.1046 28 30 27.1046 30 26V12Z" fill="#60A5FA" />
            <path d="M20 10V28" stroke="#1D4ED8" strokeWidth="1.5" />
            <rect x="22" y="8" width="3" height="8" fill="#F59E0B" rx="1" />
            <circle cx="30" cy="10" r="1.5" fill="#F59E0B" />
        </svg>
    );
}

function NotesIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#EEF2FF" />
            <rect x="11" y="9" width="18" height="22" rx="3" fill="#6366F1" stroke="#4338CA" strokeWidth="1.5" />
            <rect x="13" y="11" width="14" height="18" rx="2" fill="#EEF2FF" />
            <path d="M16 15H24M16 19H24M16 23H21" stroke="#4338CA" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="27" cy="11" r="2" fill="#EC4899" />
        </svg>
    );
}

function NcertIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#ECFDF5" />
            <path d="M20 11L7 17.5L20 24L33 17.5L20 11Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M12 20.5V25.5C12 27.5 15.5 29.5 20 29.5C24.5 29.5 28 27.5 28 25.5V20.5" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M30 19V26" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="30" cy="27" r="1.5" fill="#F59E0B" />
        </svg>
    );
}

function PyqIllustIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("w-11 h-11 shrink-0", className)}>
            <circle cx="20" cy="20" r="18" fill="#FFFBEB" />
            <rect x="11" y="9" width="18" height="22" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <rect x="13" y="11" width="14" height="18" rx="2" fill="#FFFBEB" />
            <path d="M16 15H24M16 19H22" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 9L29 7L31 6L29 5L28 3L27 5L25 6L27 7L28 9Z" fill="#EA580C" />
        </svg>
    );
}

// ── SECONDARY RESOURCE CATEGORIES DISCOVERY ──
const additionalResourceTypes = [
    { 
        name: "Revision Notes", 
        desc: "Key concept summaries", 
        icon: <NotesIllustIcon />, 
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40",
        href: "/resources/notes" 
    },
    { 
        name: "NCERT Solutions", 
        desc: "Step-by-step exercise answers", 
        icon: <NcertIllustIcon />, 
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        href: "/resources/ncert-solutions" 
    },
    { 
        name: "Previous Papers", 
        desc: "Past board question papers", 
        icon: <PyqIllustIcon />, 
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        href: "/resources/previous-year-questions" 
    },
    { 
        name: "Reference Books", 
        desc: "Curated supplementary books", 
        icon: <ReferenceBookIllustIcon />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        href: "" 
    },
];

function SchoolPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const classParam = searchParams.get('class') || 'Class 9';
    
    const [activeTab, setActiveTab] = useState(classParam);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const classes = ["Class 9", "Class 10", "Class 11", "Class 12"];
    
    useEffect(() => {
        if (classParam) {
            setActiveTab(classParam);
        }
    }, [classParam]);

    const handleClassChange = (className: string) => {
        setActiveTab(className);
        router.push(`/school?class=${encodeURIComponent(className)}`, { scroll: false });
    };

    const currentSubjects = (activeTab === 'Class 11' || activeTab === 'Class 12') ? seniorSubjects : schoolSubjects;



    return (
        <div className="min-h-screen bg-[#FAFCFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-16 sm:pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── 1. CLEAN TWO-COLUMN HERO WITH MATCHED BACKGROUND ── */}
                <section className="mb-6">
                    <div className="rounded-[20px] bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-xs relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center relative z-10">
                            
                            {/* LEFT COLUMN: Content */}
                            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-left">
                                {/* Subtle Eyebrow Label */}
                                <div className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-bold text-[#1D4ED8] dark:text-blue-400 tracking-wider uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-blue-400" />
                                    <span>STUDY RESOURCES</span>
                                </div>

                                {/* Main Title (Target Class primary emphasis + CBSE 2026–27 academic context) */}
                                <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                                    Target <span className="text-[#1D4ED8] dark:text-blue-400">{activeTab}</span>
                                    <span className="block sm:inline sm:ml-2.5 text-[16px] sm:text-[20px] md:text-[22px] font-bold text-slate-500 dark:text-slate-400">
                                        CBSE 2026–27
                                    </span>
                                </h1>

                                {/* Supporting Text */}
                                <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                                    Complete preparation resources for <span className="font-semibold text-[#0B1F4B] dark:text-white">{activeTab}</span> — official syllabus, revision notes, NCERT solutions, and academic guidance.
                                </p>

                                {/* Single Key Feature Strip with Light Divider */}
                                <div className="pt-2.5 sm:pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Updated 2026–27 Syllabus</span>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Seamless Supporting Educational Illustration */}
                            <div className="lg:col-span-5 flex items-center justify-center relative">
                                <div className="relative w-full max-w-[240px] sm:max-w-[340px] lg:max-w-[380px] flex items-center justify-center">
                                    <Image 
                                        src="/hub.png" 
                                        alt="Target Class CBSE 2026–27 Study Hub" 
                                        width={1536} 
                                        height={1024} 
                                        priority 
                                        className="w-full h-auto object-contain select-none"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ── 2. CLASS SELECTOR NAVIGATION ── */}
                <section className="mb-7">
                    <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex justify-start sm:justify-center items-center gap-8 whitespace-nowrap px-4 sm:px-0">
                            {classes.map((className) => {
                                const isActive = activeTab === className;
                                return (
                                    <button
                                        key={className}
                                        onClick={() => handleClassChange(className)}
                                        className={cn(
                                            "text-sm font-bold transition-all duration-300 pb-2 border-b-2 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:ring-0 cursor-pointer",
                                            isActive
                                                ? "text-primary border-primary"
                                                : "text-muted-foreground/60 border-transparent hover:text-foreground hover:border-muted-foreground/20"
                                        )}
                                    >
                                        {className}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>



                {/* ── 4. SUBJECT-WISE CURRICULUM & MATERIALS ── */}
                <section id="curriculum" className="mb-12 scroll-mt-24">
                    {/* Header */}
                    <div className="mb-5 flex items-center gap-2">
                        <h2 className="text-[15px] sm:text-[16px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                            {activeTab} — CBSE Syllabus 2026-27
                        </h2>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                        {currentSubjects.map((subject) => (
                            <div 
                                key={subject.key} 
                                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-5 hover:border-[#1D4ED8]/30 hover:shadow-[0_6px_24px_-4px_rgba(11,31,75,0.08)] transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4"
                            >
                                {/* Left Icon Area */}
                                <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 drop-shadow-xs flex items-center justify-center relative z-10">
                                    {subject.icon}
                                </div>

                                {/* Center Flexible Content Area */}
                                <div className="min-w-0 flex-1 relative z-10">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                                        <h3 className="text-[14px] sm:text-[16.5px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-snug truncate">
                                            {subject.name}
                                        </h3>
                                        <span className={cn("text-[9.5px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0", subject.badgeBg)}>
                                            4 Modules
                                        </span>
                                    </div>
                                    <p className="text-[10.5px] sm:text-[11.5px] font-medium text-slate-400 dark:text-slate-500 truncate">
                                        Academic Session 2026–27
                                    </p>
                                </div>

                                {/* Right Fixed Action Area (Never Wraps) */}
                                <div className="shrink-0 flex items-center justify-end relative z-10">
                                    <Link 
                                        href={`/blog/cbse-class-${activeTab.match(/\d+/)?.[0] || '12'}-syllabus-2026-27`}
                                        className="inline-flex items-center gap-1 sm:gap-1.5 text-[13px] sm:text-[14px] font-bold text-[#1D4ED8] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 group-hover:translate-x-0.5 whitespace-nowrap"
                                    >
                                        <span className="whitespace-nowrap">Read More</span>
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5. MORE RESOURCE TYPES (DISCOVERY ROW) ── */}
                <section className="mb-12">
                    {/* Header */}
                    <div className="mb-5 flex items-center gap-2">
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">
                            {activeTab} — Study Materials by Format
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {additionalResourceTypes.map((res, idx) => {
                            const classQuery = encodeURIComponent(activeTab);
                            const isReferenceBooks = res.name === "Reference Books" || res.name === "Reference Book";
                            let targetHref = res.href;
                            if (res.name === "Revision Notes") {
                                targetHref = `/resources/notes?class=${classQuery}`;
                            } else if (res.name === "NCERT Solutions") {
                                targetHref = `/resources/ncert-solutions?class=${classQuery}`;
                            } else if (res.name === "Previous Papers") {
                                targetHref = `/resources/previous-year-questions?class=${classQuery}`;
                            }

                            if (isReferenceBooks) {
                                return (
                                    <div 
                                        key={idx}
                                        className="group p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 cursor-default select-none"
                                    >
                                        <div className={cn("p-2.5 rounded-[10px] border shadow-2xs flex items-center justify-center shrink-0", res.color)}>
                                            {res.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[14px] font-extrabold text-[#0B1F4B] dark:text-white transition-colors truncate">
                                                {res.name}
                                            </h4>
                                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                                                {res.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link 
                                    key={idx}
                                    href={targetHref}
                                    className="group p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#1D4ED8]/40 hover:shadow-2xs transition-all flex items-center gap-3.5"
                                >
                                    <div className={cn("p-2.5 rounded-[10px] border shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center shrink-0", res.color)}>
                                        {res.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-[14px] font-extrabold text-[#0B1F4B] dark:text-white group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors truncate">
                                            {res.name}
                                        </h4>
                                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                                            {res.desc}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ── 6. RESULTS & ACHIEVEMENTS GATEWAY ── */}
                <section className="mb-10 sm:mb-12">
                    <div className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 lg:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
                        
                        {/* LEFT COLUMN: Eyebrow, Heading & Description */}
                        <div className="space-y-2 max-w-xl text-left relative z-10">
                            {/* Subtle Eyebrow Label with delicate orange accent */}
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>RESULTS & ACHIEVEMENTS</span>
                            </div>

                            {/* Main Heading */}
                            <h3 className="text-[19px] sm:text-[21px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight leading-snug">
                                Academic Results & Achievements
                            </h3>

                            {/* Concise Description */}
                            <p className="text-[13px] sm:text-[13.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                                Board performance, merit ranks, and student achievements for the academic session.
                            </p>
                        </div>

                        {/* RIGHT COLUMN: Subtle 2D Achievement Visual + View Results CTA */}
                        <div className="flex items-center gap-3.5 shrink-0 relative z-10 self-start md:self-center">
                            {/* Deliberate subtle 2D trophy motif badge */}
                            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <Trophy className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            {/* Premium IDL Outline Button */}
                            <Button 
                                asChild
                                variant="outline"
                                className="h-10 sm:h-10.5 px-4 sm:px-5 rounded-[8px] font-bold text-xs bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0B1F4B] dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <Link href="/#academic-results">
                                    <span>View Results</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#1D4ED8]" />
                                </Link>
                            </Button>
                        </div>

                    </div>
                </section>

                {/* ── 7. FINAL GUIDANCE CTA BANNER ── */}
                <section className="mb-6">
                    <div className="rounded-[20px] bg-gradient-to-r from-[#102A68] via-[#0F285C] to-[#1D4ED8] p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        
                        {/* Background guidance compass motif overlay */}
                        <div className="absolute right-0 top-0 bottom-0 opacity-10 text-white pointer-events-none hidden lg:block">
                            <svg className="h-full w-auto" viewBox="0 0 200 200" fill="currentColor">
                                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M100 20 L110 90 L180 100 L110 110 L100 180 L90 110 L20 100 L90 90 Z" />
                            </svg>
                        </div>

                        <div className="space-y-1.5 text-left relative z-10 max-w-xl">
                            <h3 className="text-[20px] sm:text-[23px] font-extrabold tracking-tight text-white">
                                Need guidance for {activeTab}?
                            </h3>
                            <p className="text-[13.5px] text-blue-100 font-medium leading-relaxed">
                                Talk to an IDL academic counselor or ask IDL AI for instant course recommendations.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                            {/* Ask IDL AI CTA Button */}
                            <Button 
                                onClick={() => setIsContactOpen(true)}
                                className="h-11 px-5 rounded-[8px] font-bold text-xs bg-white text-[#102A68] hover:bg-blue-50 shadow-sm hover:shadow-md transition-all cursor-pointer border-none flex items-center gap-1.5"
                            >
                                <Bot className="w-4 h-4 text-[#1D4ED8]" />
                                <span>Ask IDL AI →</span>
                            </Button>

                            {/* Call Now CTA Button */}
                            <Button 
                                asChild
                                variant="outline"
                                className="h-11 px-5 rounded-[8px] font-bold text-xs bg-white/10 hover:bg-white/20 text-white border-white/30 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <a href="tel:8860040010">
                                    <Phone className="w-3.5 h-3.5 text-white" />
                                    <span>Call Now</span>
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Contact Us Popup Modal */}
                <ContactModal isOpen={isContactOpen} onOpenChange={setIsContactOpen} />

            </div>
        </div>
    );
}

export default function SchoolPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#102A68]" />
            </div>
        }>
            <SchoolPageContent />
        </Suspense>
    );
}
