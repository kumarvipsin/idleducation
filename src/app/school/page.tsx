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

// ── SUBJECT CONFIGURATIONS WITH VECTOR MOTIFS ──
const schoolSubjects = [
    { 
        name: "Science", 
        key: "science", 
        icon: <TestTube2 className="w-5 h-5" />, 
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        badgeBg: "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        // Subtle flask/atom motif SVG
        motif: (
            <svg className="w-24 h-24 text-emerald-500/10 dark:text-emerald-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 22H5a1 1 0 0 1-1-1v-1a4 4 0 0 1 2.34-3.66l2.66-1.33V10h-1a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2h-1v5.01l2.66 1.33A4 4 0 0 1 20 20v1a1 1 0 0 1-1 1zM8.5 13l-3.32 1.66A2 2 0 0 0 4 16.5V17h16v-.5a2 2 0 0 0-1.18-1.84L15.5 13V10h-7v3z"/>
            </svg>
        )
    },
    { 
        name: "Mathematics", 
        key: "maths", 
        icon: <Sigma className="w-5 h-5" />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        badgeBg: "bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        motif: (
            <svg className="w-24 h-24 text-blue-500/10 dark:text-blue-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6H6.83l5.58 6-5.58 6H18a1 1 0 0 1 0 2H4a1 1 0 0 1-.74-1.67L9.58 12 3.26 5.67A1 1 0 0 1 4 4h14a1 1 0 0 1 0 2z"/>
            </svg>
        )
    },
    { 
        name: "English", 
        key: "english", 
        icon: <BookText className="w-5 h-5" />, 
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40",
        badgeBg: "bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
        motif: (
            <svg className="w-24 h-24 text-indigo-500/10 dark:text-indigo-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5zm2 0a.5.5 0 0 0 .5.5H18V4H6.5a.5.5 0 0 0-.5.5v15zM8 7h8v2H8V7zm0 4h8v2H8v-2z"/>
            </svg>
        )
    },
    { 
        name: "Social Studies", 
        key: "social", 
        icon: <Landmark className="w-5 h-5" />, 
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        badgeBg: "bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
        motif: (
            <svg className="w-24 h-24 text-amber-500/10 dark:text-amber-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1H7a1 1 0 0 1-1-1v-2.07A8 8 0 0 1 12 4a7.92 7.92 0 0 1 5.66 2.34L16 8a1 1 0 0 0 0 1.41l2 2a1 1 0 0 0 1.41 0l.52-.52A8 8 0 0 1 13 19.93z"/>
            </svg>
        )
    },
];

const seniorSubjects = [
    { 
        name: "Political Science", 
        key: "political-science", 
        icon: <Scale className="w-5 h-5" />, 
        color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-900/40",
        badgeBg: "bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
        motif: (
            <svg className="w-24 h-24 text-indigo-500/10 dark:text-indigo-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v2h18V7l-9-5zm-7 9v8h2v-8H5zm5 0v8h2v-8h-2zm5 0v8h2v-8h-2zm5 0v8h2v-8h-2zM2 21h20v2H2v-2z"/>
            </svg>
        )
    },
    { 
        name: "History", 
        key: "history", 
        icon: <Landmark className="w-5 h-5" />, 
        color: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        badgeBg: "bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
        motif: (
            <svg className="w-24 h-24 text-amber-500/10 dark:text-amber-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 0-1-1h-1a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1H7a1 1 0 0 1-1-1v-2.07A8 8 0 0 1 12 4a7.92 7.92 0 0 1 5.66 2.34L16 8a1 1 0 0 0 0 1.41l2 2a1 1 0 0 0 1.41 0l.52-.52A8 8 0 0 1 13 19.93z"/>
            </svg>
        )
    },
    { 
        name: "English", 
        key: "english", 
        icon: <BookText className="w-5 h-5" />, 
        color: "bg-blue-50 text-[#1D4ED8] dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/40",
        badgeBg: "bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        motif: (
            <svg className="w-24 h-24 text-blue-500/10 dark:text-blue-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5zm2 0a.5.5 0 0 0 .5.5H18V4H6.5a.5.5 0 0 0-.5.5v15zM8 7h8v2H8V7zm0 4h8v2H8v-2z"/>
            </svg>
        )
    },
    { 
        name: "Economics", 
        key: "economics", 
        icon: <TrendingUp className="w-5 h-5" />, 
        color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        badgeBg: "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
        motif: (
            <svg className="w-24 h-24 text-emerald-500/10 dark:text-emerald-400/10 absolute -right-2 -bottom-2 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
            </svg>
        )
    },
];

// ── SECONDARY RESOURCE CATEGORIES DISCOVERY ──
const additionalResourceTypes = [
    { name: "Syllabus", desc: "Official CBSE curriculum guide", icon: <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />, href: "/resources/syllabus" },
    { name: "Revision Notes", desc: "Key concept summaries", icon: <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />, href: "/resources/notes" },
    { name: "NCERT Solutions", desc: "Step-by-step exercise answers", icon: <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />, href: "/resources/ncert-solutions" },
    { name: "Sample Papers", desc: "Mock exams & marking scheme", icon: <FileCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />, href: "/resources/sample-papers" },
    { name: "Previous Papers", desc: "Past board question papers", icon: <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />, href: "/resources/pyq" },
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

    const quickInfoCards = [
        {
            title: "Prepare Smarter",
            category: "CBSE SYLLABUS",
            description: "Official curriculum breakdown →",
            icon: <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            href: "/resources/syllabus",
            iconBg: "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40",
            hoverBorder: "hover:border-amber-400/50 dark:hover:border-amber-600/50"
        },
        {
            title: "Revision Notes",
            category: "CHAPTER SUMMARY",
            description: "Quick concept maps & summaries →",
            icon: <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            href: "/resources/notes",
            iconBg: "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40",
            hoverBorder: "hover:border-blue-400/50 dark:hover:border-blue-600/50"
        },
        {
            title: "NCERT Solutions",
            category: "STEP-BY-STEP",
            description: "Detailed exercise solutions →",
            icon: <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            href: "/resources/ncert-solutions",
            iconBg: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40",
            hoverBorder: "hover:border-emerald-400/50 dark:hover:border-emerald-600/50"
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFCFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── 1. BALANCED TWO-COLUMN HERO WITH PREMIUM ILLUSTRATION ── */}
                <section className="mb-8">
                    <div className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-xs relative overflow-hidden">
                        {/* Faint blue atmosphere glow */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                            
                            {/* LEFT COLUMN: Content */}
                            <div className="lg:col-span-7 space-y-4 text-left">
                                {/* Eyebrow Badge */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-[#1D4ED8] dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>STUDY RESOURCES</span>
                                </div>

                                {/* Main Title */}
                                <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-[1.15]">
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
                            <div className="lg:col-span-5 flex items-center justify-center relative">
                                <div className="relative w-full max-w-[320px] aspect-[4/3] sm:aspect-square flex items-center justify-center p-4 rounded-[20px] bg-gradient-to-b from-[#F4F7FF] to-[#EEF2FF] dark:from-slate-800/60 dark:to-slate-900/60 border border-[#DCE4FF] dark:border-slate-800 shadow-inner overflow-hidden">
                                    
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

                {/* ── 3. QUICK RESOURCE SHORTCUT CARDS (3 COMPACT CARDS) ── */}
                <section className="mb-10 sm:mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickInfoCards.map((card, idx) => (
                            <Link 
                                key={idx} 
                                href={card.href}
                                className="group block"
                            >
                                <div className={cn(
                                    "h-full bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-4px_rgba(29,78,216,0.08)] flex items-start gap-4",
                                    card.hoverBorder
                                )}>
                                    <div className={cn("p-3 rounded-[12px] border shrink-0 transition-transform duration-200 group-hover:scale-105", card.iconBg)}>
                                        {card.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-0.5">
                                            {card.category}
                                        </span>
                                        <h3 className="text-[15.5px] font-bold text-[#0B1F4B] dark:text-white group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors leading-tight mb-1">
                                            {card.title}
                                        </h3>
                                        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex items-center gap-1 group-hover:text-[#1D4ED8]">
                                            <span>{card.description}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ── 4. SUBJECT-WISE CURRICULUM & MATERIALS ── */}
                <section className="mb-12">
                    {/* Header Line */}
                    <div className="mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="inline-flex items-center gap-2 mb-1">
                            <Layers className="w-4.5 h-4.5 text-[#1D4ED8]" />
                            <h2 className="text-[22px] sm:text-[25px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">
                                Subject-wise Resources
                            </h2>
                        </div>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
                            Official curriculum and learning materials for <span className="font-semibold text-slate-700 dark:text-slate-200">{activeTab}</span> (Session 2026–27).
                        </p>
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {currentSubjects.map((subject) => (
                            <div 
                                key={subject.key} 
                                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-5.5 hover:border-[#1D4ED8]/30 hover:shadow-[0_6px_24px_-4px_rgba(11,31,75,0.08)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                {/* Vector Motif Background Overlay */}
                                {subject.motif}

                                {/* Subject Info */}
                                <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                                    <div className={cn("p-3 rounded-[12px] border shrink-0 transition-transform duration-200 group-hover:scale-105", subject.color)}>
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
                    <div className="mb-5">
                        <h3 className="text-[17px] font-bold text-[#0B1F4B] dark:text-white tracking-tight">
                            More Resource Formats
                        </h3>
                        <p className="text-[12.5px] text-slate-500 dark:text-slate-400 font-medium">
                            Browse by specialized study material format for targeted preparation.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {additionalResourceTypes.map((res, idx) => (
                            <Link 
                                key={idx}
                                href={res.href}
                                className="group p-3.5 rounded-[12px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#1D4ED8]/40 hover:shadow-2xs transition-all flex flex-col justify-between gap-2"
                            >
                                <div className="p-2 rounded-[8px] bg-slate-50 dark:bg-slate-800 w-fit group-hover:scale-105 transition-transform">
                                    {res.icon}
                                </div>
                                <div>
                                    <h4 className="text-[13.5px] font-bold text-[#0B1F4B] dark:text-white group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors">
                                        {res.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1 mt-0.5">
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
