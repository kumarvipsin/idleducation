'use client';

import React, { useState, useEffect, Suspense } from "react";
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

function SyllabusIllustIcon({ className }: { className?: string }) {
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
        name: "Syllabus", 
        desc: "Official CBSE curriculum guide", 
        icon: <SyllabusIllustIcon />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        href: "/resources/syllabus" 
    },
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
        href: "/resources/pyq" 
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
                
                {/* ── 1. BALANCED TWO-COLUMN HERO WITH PREMIUM ILLUSTRATION ── */}
                <section className="mb-6 sm:mb-7">
                    <div className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 lg:p-7 shadow-xs relative overflow-hidden">
                        {/* Faint blue atmosphere glow */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                            
                            {/* LEFT COLUMN: Content */}
                            <div className="lg:col-span-8 space-y-4 text-left">
                                {/* Eyebrow Badge */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-[#1D4ED8] dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>STUDY RESOURCES</span>
                                </div>

                                {/* Main Title (Guaranteed Single Line on Desktop) */}
                                <h1 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[34px] xl:text-[38px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-snug whitespace-normal lg:whitespace-nowrap">
                                    Target <span className="text-[#1D4ED8] dark:text-blue-400">{activeTab}</span> CBSE 2026–27
                                </h1>

                                {/* Supporting Text */}
                                <p className="text-[14px] sm:text-[15.5px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
                                    Complete preparation resources for <span className="font-bold text-[#0B1F4B] dark:text-white">{activeTab}</span> — official syllabus, revision notes, NCERT solutions, and academic guidance.
                                </p>

                                {/* Verification Strip */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-6 text-[12px] font-semibold text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>Updated 2026–27 Syllabus</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>NCERT Solutions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>100% Free Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Refined Educational Illustration */}
                            <div className="lg:col-span-4 flex items-center justify-center relative">
                                <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[4/3] sm:aspect-square flex items-center justify-center p-4 rounded-[20px] bg-gradient-to-b from-[#F4F7FF] to-[#EEF2FF] dark:from-slate-800/60 dark:to-slate-900/60 border border-[#DCE4FF] dark:border-slate-800 shadow-inner overflow-hidden">
                                    
                                    {/* Background decorative subtle dotted grid */}
                                    <svg className="absolute inset-0 w-full h-full opacity-20 text-[#1D4ED8]" fill="none">
                                        <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                                            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                                        </pattern>
                                        <rect width="100%" height="100%" fill="url(#dotPattern)" />
                                    </svg>

                                    {/* Curved Progress Path Line */}
                                    <svg className="absolute inset-0 w-full h-full text-[#1D4ED8]/25" fill="none" viewBox="0 0 200 200">
                                        <path d="M 20,160 Q 100,40 180,120" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
                                    </svg>

                                    {/* Central SVG Study Desk Illustration */}
                                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                                        <div className="relative flex items-center justify-center mb-2">
                                            {/* Glowing IDL Crest Badge */}
                                            <div className="w-20 h-20 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center text-[#102A68] dark:text-blue-400 relative">
                                                <GraduationCap className="w-10 h-10 text-[#1D4ED8]" />
                                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                                                    ✓
                                                </div>
                                            </div>

                                            {/* Floating Achievement Node 1 */}
                                            <div className="absolute -left-10 top-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 shadow-xs flex items-center gap-1 text-[11px] font-bold text-[#0B1F4B] dark:text-slate-200">
                                                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                                <span>CBSE</span>
                                            </div>

                                            {/* Floating Achievement Node 2 */}
                                            <div className="absolute -right-8 bottom-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 shadow-xs flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                                <Award className="w-3.5 h-3.5" />
                                                <span>2026–27</span>
                                            </div>
                                        </div>

                                        <p className="text-[12px] font-extrabold text-[#102A68] dark:text-blue-300 uppercase tracking-widest mt-3">
                                            IDL STUDY HUB
                                        </p>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                            Verified Learning Modules
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ── 2. SEGMENTED CLASS SELECTOR NAVIGATION ── */}
                <section className="mb-8">
                    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[14px] p-2 shadow-xs">
                        <div className="overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 hidden sm:inline-block">
                                    TARGET CLASS:
                                </span>
                                {classes.map((className) => {
                                    const isActive = activeTab === className;
                                    return (
                                        <button
                                            key={className}
                                            onClick={() => handleClassChange(className)} 
                                            className={cn(
                                                "h-10 px-5 rounded-[9px] text-[13px] font-bold transition-all duration-180 cursor-pointer shrink-0 border",
                                                isActive 
                                                    ? "bg-[#102A68] text-white border-[#102A68] shadow-sm" 
                                                    : "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1D4ED8]"
                                            )}
                                        >
                                            {className}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>



                {/* ── 4. SUBJECT-WISE CURRICULUM & MATERIALS ── */}
                <section className="mb-12">
                    {/* Header Block (Centered) */}
                    <div className="mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                        {/* Top Line: Centered Bullet + Light Blue Subject-wise Resources Label */}
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0" />
                            <h2 className="text-[14px] sm:text-[15px] font-extrabold text-[#1D4ED8] dark:text-blue-400 tracking-tight">
                                Subject-wise Resources
                            </h2>
                        </div>

                        {/* Bottom Line: Large Grey Target Class Description Text */}
                        <p className="text-[20px] sm:text-[24px] lg:text-[26px] font-black text-slate-600 dark:text-slate-300 tracking-tight">
                            {activeTab} CBSE 2026-27 (Syllabus PDF)
                        </p>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {currentSubjects.map((subject) => (
                            <div 
                                key={subject.key} 
                                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-5.5 hover:border-[#1D4ED8]/30 hover:shadow-[0_6px_24px_-4px_rgba(11,31,75,0.08)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                {/* Subject Info */}
                                <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                                    <div className="shrink-0 transition-transform duration-200 group-hover:scale-105 drop-shadow-xs">
                                        {subject.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-[16.5px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-snug truncate">
                                                {subject.name}
                                            </h3>
                                            <span className={cn("text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0", subject.badgeBg)}>
                                                4 Modules
                                            </span>
                                        </div>
                                        <p className="text-[11.5px] font-medium text-slate-400 dark:text-slate-500">
                                            Academic Session 2026–27
                                        </p>
                                    </div>
                                </div>

                                {/* Action CTAs: View + Get */}
                                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 relative z-10">
                                    {/* VIEW Button: Primary Action */}
                                    <Button 
                                        asChild 
                                        variant="outline" 
                                        className="h-9 px-4 rounded-[8px] text-[12.5px] font-bold bg-[#EEF2FF] hover:bg-[#E0E7FF] dark:bg-[#1e2d5a]/60 dark:hover:bg-[#1e2d5a] text-[#1D4ED8] dark:text-blue-300 border border-[#C7D4FF]/80 dark:border-[#2a3a70] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <Link href={`/resources/notes`}>
                                            <Eye className="w-3.5 h-3.5 opacity-90" />
                                            <span>View</span>
                                        </Link>
                                    </Button>

                                    {/* GET Button: Secondary Action */}
                                    <Button 
                                        asChild 
                                        variant="outline" 
                                        className="h-9 px-4 rounded-[8px] text-[12.5px] font-bold bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <Link href={`/resources/ncert-solutions`}>
                                            <Download className="w-3.5 h-3.5 opacity-90" />
                                            <span>Get</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 5. MORE RESOURCE TYPES (DISCOVERY ROW) ── */}
                <section className="mb-12">
                    {/* Header Block (Centered) */}
                    <div className="mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                        {/* Top Line: Centered Bullet + Light Blue More Resource Formats Label */}
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] shrink-0" />
                            <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#1D4ED8] dark:text-blue-400 tracking-tight">
                                More Resource Formats
                            </h3>
                        </div>

                        {/* Bottom Line: Large Grey Short Description Text */}
                        <p className="text-[20px] sm:text-[24px] lg:text-[26px] font-black text-slate-600 dark:text-slate-300 tracking-tight">
                            {activeTab} Study Materials by Format
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {additionalResourceTypes.map((res, idx) => (
                            <Link 
                                key={idx}
                                href={res.href}
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
                        ))}
                    </div>
                </section>

                {/* ── 6. RESULTS & ACHIEVEMENTS ANNOUNCEMENT ── */}
                <section className="mb-12">
                    <div className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        {/* Background subtle medal outline motif */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500/5 dark:text-amber-400/10 pointer-events-none hidden lg:block">
                            <Trophy className="w-44 h-44" />
                        </div>

                        <div className="space-y-2 max-w-xl text-left relative z-10">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                                <Trophy className="w-3.5 h-3.5" />
                                <span>RESULTS & ACHIEVEMENTS</span>
                            </div>
                            <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight leading-snug">
                                Board Exam Performance & Merit Ranks
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Board performance, merit ranks, and student achievements for the upcoming academic session will be published here.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 relative z-10">
                            <Button 
                                asChild
                                variant="outline"
                                className="h-11 px-5 rounded-[8px] font-bold text-xs bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#102A68] dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2"
                            >
                                <Link href="/idl-stars">
                                    <span>View IDL Stars</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
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
