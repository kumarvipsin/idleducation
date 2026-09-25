'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
    MapPin, 
    GraduationCap, 
    ChevronDown, 
    ChevronRight, 
    SlidersHorizontal, 
    Check, 
    Calendar, 
    IndianRupee, 
    Sparkles, 
    Phone, 
    BookOpen
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── IDL 4 Offline Centers in Delhi ─────────────────────────────────────
const CENTERS = [
    { id: 'mukherjee-nagar', name: 'Mukherjee Nagar', address: 'Mukherjee Nagar, Delhi-110009' },
    { id: 'mangol-puri', name: 'Mangol Puri', address: 'Mangol Puri, Delhi-110083' },
    { id: 'budh-vihar', name: 'Budh Vihar', address: 'Budh Vihar, Delhi-110086' },
    { id: 'krishan-vihar', name: 'Krishan Vihar', address: 'Krishan Vihar, Delhi-110086' },
];

// ── Stream: Only "Grade 9-12" ──────────────────────────────────────────
const STREAMS = [
    { id: 'Grade 9-12', label: 'Grade 9-12' },
];

// ── Classes 9 to 12 Only ───────────────────────────────────────────────
const AVAILABLE_CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const;

// ── 3 Modes Only ───────────────────────────────────────────────────────
const MODES = ['Offline Mode', 'Online Mode', 'Hybrid Mode'] as const;

interface CourseCardData {
    id: string;
    classCode: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
    title: string;
    targetMoving: string;
    duration: string;
    features: string[];
    feeAnnual: number;
    feeLumpSum: number;
    installment1: number;
    installment2: number;
    batchPhases: { phase: string; date: string; status: string }[];
}

const COURSES_DATA: CourseCardData[] = [
    {
        id: 'class-9',
        classCode: 'Class 9',
        title: 'CLASS IX',
        targetMoving: 'CLASS VIII TO IX MOVING STUDENTS',
        duration: '1 YEAR',
        features: [
            "Learn in a classroom with India’s top faculties.",
            "Printed study material, DPPs, and test series.",
            "Peer-to-peer interaction and healthy competition.",
        ],
        feeAnnual: 36000,
        feeLumpSum: 32000,
        installment1: 18000,
        installment2: 14000,
        batchPhases: [
            { phase: 'Phase I', date: '06 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '21 April 2026', status: 'Filling Fast' },
            { phase: 'Phase III', date: '12 May 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-10',
        classCode: 'Class 10',
        title: 'CLASS X',
        targetMoving: 'CLASS IX TO X MOVING STUDENTS',
        duration: '1 YEAR',
        features: [
            "Learn in a classroom with India’s top faculties.",
            "Printed study material, DPPs, and test series.",
            "Peer-to-peer interaction and healthy competition.",
        ],
        feeAnnual: 40000,
        feeLumpSum: 36000,
        installment1: 20000,
        installment2: 16000,
        batchPhases: [
            { phase: 'Phase I', date: '06 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '21 April 2026', status: 'Filling Fast' },
            { phase: 'Phase III', date: '12 May 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-11',
        classCode: 'Class 11',
        title: 'CLASS XI',
        targetMoving: 'CLASS X TO XI MOVING STUDENTS',
        duration: '2 YEARS',
        features: [
            "Learn in a classroom with India’s top faculties.",
            "Printed study material, DPPs, and test series.",
            "Peer-to-peer interaction and healthy competition.",
        ],
        feeAnnual: 55000,
        feeLumpSum: 49000,
        installment1: 28000,
        installment2: 21000,
        batchPhases: [
            { phase: 'Phase I', date: '10 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '28 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-12',
        classCode: 'Class 12',
        title: 'CLASS XII',
        targetMoving: 'CLASS XI TO XII MOVING STUDENTS',
        duration: '1 YEAR',
        features: [
            "Learn in a classroom with India’s top faculties.",
            "Printed study material, DPPs, and test series.",
            "Peer-to-peer interaction and healthy competition.",
        ],
        feeAnnual: 60000,
        feeLumpSum: 54000,
        installment1: 30000,
        installment2: 24000,
        batchPhases: [
            { phase: 'Phase I', date: '08 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '24 April 2026', status: 'Upcoming' },
        ],
    },
];

export function CoursesClient() {
    const searchParams = useSearchParams();

    // Query params
    const centerParam = searchParams.get('center') || 'Mukherjee Nagar';
    const classParam = searchParams.get('class');
    const modeParam = searchParams.get('mode');
    const sessionParam = searchParams.get('session') || '2026–27';

    // State
    const [selectedCenter, setSelectedCenter] = useState<string>(() => {
        const found = CENTERS.find(c => c.name.toLowerCase() === centerParam.toLowerCase() || c.id === centerParam.toLowerCase());
        return found ? found.name : 'Mukherjee Nagar';
    });

    const [session, setSession] = useState<string>(sessionParam || '2026–27');
    const [selectedClass, setSelectedClass] = useState<string | null>(() => {
        if (!classParam) return null;
        const normalized = AVAILABLE_CLASSES.find(c => c.toLowerCase() === classParam.toLowerCase());
        return normalized || null;
    });

    const [selectedMode, setSelectedMode] = useState<string>(() => {
        if (!modeParam) return 'Offline Mode';
        const lower = modeParam.toLowerCase();
        if (lower.includes('online')) return 'Online Mode';
        if (lower.includes('hybrid')) return 'Hybrid Mode';
        return 'Offline Mode';
    });

    // Details Modal State
    const [selectedCourseDetails, setSelectedCourseDetails] = useState<CourseCardData | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // Filtered courses: strictly Class 9 to 12
    const filteredCourses = useMemo(() => {
        let list = COURSES_DATA;

        if (selectedClass) {
            list = list.filter(c => c.classCode.toLowerCase() === selectedClass.toLowerCase());
        }

        return list;
    }, [selectedClass]);

    // Handle course details click
    const handleOpenCourseDetails = (course: CourseCardData) => {
        setSelectedCourseDetails(course);
        setDetailsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pb-20">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10">
                
                {/* ── 1. TOP HEADER SELECTOR BAR: "Courses for: [CENTER] [STREAM Grade 9-12]" ── */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
                    <span className="text-[17px] sm:text-[19px] md:text-[20px] font-bold text-slate-900 dark:text-white shrink-0">
                        Courses for:
                    </span>

                    {/* Center Selector Dropdown - IDL 4 Centers Only */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="center-selector-dropdown"
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-extrabold text-[11px] sm:text-[11.5px] tracking-wider uppercase shrink-0">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                        <MapPin className="w-2.5 h-2.5 text-[#2563EB] fill-[#2563EB]" />
                                    </span>
                                    <span>CENTER</span>
                                </div>
                                <span className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white">
                                    {selectedCenter}
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-1.5 shadow-xl rounded-xl z-50">
                            <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                                IDL Offline Learning Centres
                            </div>
                            {CENTERS.map((c) => (
                                <DropdownMenuItem
                                    key={c.id}
                                    onClick={() => setSelectedCenter(c.name)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold ${selectedCenter === c.name ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <div>
                                        <div className="font-bold">{c.name}</div>
                                        <div className="text-[10px] text-slate-400 font-normal">{c.address}</div>
                                    </div>
                                    {selectedCenter === c.name && <Check className="w-4 h-4 text-[#2563EB]" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Stream Selector Dropdown - Only "Grade 9-12" */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="stream-selector-dropdown"
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-extrabold text-[11px] sm:text-[11.5px] tracking-wider uppercase shrink-0">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                        <GraduationCap className="w-2.5 h-2.5 text-[#2563EB]" />
                                    </span>
                                    <span>STREAM</span>
                                </div>
                                <span className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white">
                                    Grade 9-12
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-1.5 shadow-xl rounded-xl z-50">
                            <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                                Academic Stream
                            </div>
                            {STREAMS.map((s) => (
                                <DropdownMenuItem
                                    key={s.id}
                                    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950/60"
                                >
                                    <span>{s.label}</span>
                                    <Check className="w-4 h-4 text-[#2563EB]" />
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* ── 2. MAIN TITLE: "Classes 9 - 12 CBSE 2026" ── */}
                <div className="mt-5 sm:mt-6 mb-3 sm:mb-4">
                    <h1 className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
                        Classes 9 - 12 CBSE 2026
                    </h1>
                </div>

                {/* ── 3. FILTER BADGES ROW ── */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8">
                    {/* Filters button */}
                    <button 
                        onClick={() => setFilterModalOpen(true)}
                        id="filters-button"
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                        <span>Filters</span>
                    </button>

                    {/* Subtle Vertical Divider */}
                    <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

                    {/* Session Selector (Active Pill) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="session-selector-pill"
                                className="px-4 py-1.5 rounded-full bg-[#E0F2FE] dark:bg-blue-950/70 border border-[#BAE6FD] dark:border-blue-800 text-[#0369A1] dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-[#D0EBFD] dark:hover:bg-blue-900/60 transition-colors outline-none"
                            >
                                <span>Session: {session}</span>
                                <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-1 z-50">
                            <DropdownMenuItem onClick={() => setSession('2026–27')} className="cursor-pointer text-xs font-bold text-[#0369A1]">
                                Session: 2026–27
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSession('2027–28')} className="cursor-pointer text-xs text-slate-700 dark:text-slate-200">
                                Session: 2027–28
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Class Selector Dropdown - Only Class 9, 10, 11, 12 */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="class-selector-pill"
                                className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors outline-none ${selectedClass ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                            >
                                <span>{selectedClass ? selectedClass : 'Class'}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-1 z-50">
                            <DropdownMenuItem onClick={() => setSelectedClass(null)} className="cursor-pointer text-xs font-semibold">
                                All Classes
                            </DropdownMenuItem>
                            {AVAILABLE_CLASSES.map((cls) => (
                                <DropdownMenuItem 
                                    key={cls} 
                                    onClick={() => setSelectedClass(cls)}
                                    className={`cursor-pointer text-xs ${selectedClass === cls ? 'font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-200'}`}
                                >
                                    {cls}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mode Selector Pill - 3 Modes Only: Offline Mode, Online Mode, Hybrid Mode */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="mode-selector-pill"
                                className="px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors outline-none border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                            >
                                <span>Mode: {selectedMode}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-1 z-50">
                            {MODES.map((mode) => (
                                <DropdownMenuItem 
                                    key={mode} 
                                    onClick={() => setSelectedMode(mode)}
                                    className={`cursor-pointer text-xs ${selectedMode === mode ? 'font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-200'}`}
                                >
                                    {mode}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset Filters (if active) */}
                    {selectedClass && (
                        <button 
                            onClick={() => setSelectedClass(null)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold px-2 py-1"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* ── 4. CATEGORY TITLE: "CBSE BOARD & COMPETITIVE FOUNDATION" ── */}
                <div className="mb-5 sm:mb-6">
                    <h2 className="text-[14px] sm:text-[15.5px] font-extrabold tracking-[0.06em] text-slate-900 dark:text-slate-100 uppercase">
                        CBSE BOARD & COMPETITIVE FOUNDATION
                    </h2>
                </div>

                {/* ── 5. COURSE CARDS GRID: CLASSES 9, 10, 11, 12 ONLY ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            id={`course-card-${course.id}`}
                            className="bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(11,40,88,0.05)] hover:shadow-[0_12px_32px_-6px_rgba(11,40,88,0.12)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                        >
                            <div>
                                {/* Mode Badge: OFFLINE MODE (or active mode) */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D1527] text-white text-[10.5px] sm:text-[11px] font-black tracking-widest uppercase mb-4 self-start shadow-xs">
                                    {selectedMode.toUpperCase()}
                                </div>

                                {/* Course Title */}
                                <h3 className="text-[19px] sm:text-[21px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                                    {course.title}
                                </h3>

                                {/* Subtitle: Moving Students / Duration */}
                                <p className="text-[11px] sm:text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight mt-1 mb-5 sm:mb-6 leading-snug">
                                    {course.targetMoving} (DURATION : {course.duration})
                                </p>

                                {/* 3 Checkmarked Bullet Points */}
                                <ul className="space-y-3 sm:space-y-3.5 mb-7">
                                    {course.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-slate-700 dark:text-slate-300 leading-snug font-normal">
                                            <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0 mt-0.5 select-none">
                                                ✓
                                            </span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Bottom Link CTA: "Check course start dates and Fee >" */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                <Link
                                    href={`/courses/${course.id}?center=${encodeURIComponent(selectedCenter)}&mode=${encodeURIComponent(selectedMode)}`}
                                    className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-bold text-[#1D4ED8] dark:text-blue-400 hover:text-[#1E40AF] dark:hover:text-blue-300 transition-colors group/link mt-2 text-left cursor-pointer"
                                >
                                    <span>Check course start dates and Fee</span>
                                    <ChevronRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover/link:translate-x-1 shrink-0" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── COURSE DATES & FEE DETAILS DIALOG MODAL ── */}
            <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl">
                    {selectedCourseDetails && (
                        <div>
                            {/* Modal Header */}
                            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border-b border-slate-200/80 dark:border-slate-800 relative">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#0D1527] text-white text-[10px] font-black uppercase tracking-wider">
                                        {selectedMode.toUpperCase()}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                        {selectedCenter} Center
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                        Session: {session}
                                    </span>
                                </div>
                                <DialogTitle className="text-xl sm:text-2xl font-black text-[#0B1F4B] dark:text-white">
                                    {selectedCourseDetails.title} — CBSE 2026
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">
                                    {selectedCourseDetails.targetMoving} • Duration: {selectedCourseDetails.duration}
                                </DialogDescription>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                
                                {/* 1. Batch Starting Dates */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        <Calendar className="w-4 h-4 text-[#2563EB]" />
                                        <span>Upcoming Batch Start Dates ({selectedCenter} Center)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {selectedCourseDetails.batchPhases.map((phase, idx) => (
                                            <div 
                                                key={idx}
                                                className={`p-3 rounded-xl border text-left transition-all ${idx === 0 ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-1 ring-blue-400/30' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}
                                            >
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                                                    <span>{phase.phase}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${idx === 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                        {phase.status}
                                                    </span>
                                                </div>
                                                <div className="text-[13.5px] font-black text-slate-900 dark:text-white">
                                                    {phase.date}
                                                </div>
                                                <div className="text-[10.5px] text-slate-500 mt-0.5">
                                                    {selectedMode}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Fee Structure Breakdown */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        <IndianRupee className="w-4 h-4 text-[#2563EB]" />
                                        <span>Course Fee & Installment Structure</span>
                                    </div>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Standard Fee</span>
                                                <div className="text-xl font-black text-slate-900 dark:text-white">
                                                    ₹{selectedCourseDetails.feeAnnual.toLocaleString('en-IN')}
                                                    <span className="text-xs font-normal text-slate-400 ml-1">/ session</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">One-Time Lump Sum (Discounted)</span>
                                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                    ₹{selectedCourseDetails.feeLumpSum.toLocaleString('en-IN')}
                                                    <span className="text-xs font-bold text-emerald-500 ml-1.5">(Save ₹{(selectedCourseDetails.feeAnnual - selectedCourseDetails.feeLumpSum).toLocaleString('en-IN')})</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Installments */}
                                        <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
                                            <div>
                                                <span className="font-semibold text-slate-500">1st Installment (At Admission):</span>{' '}
                                                <strong className="text-slate-900 dark:text-white font-bold">₹{selectedCourseDetails.installment1.toLocaleString('en-IN')}</strong>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-500">2nd Installment (After 60 Days):</span>{' '}
                                                <strong className="text-slate-900 dark:text-white font-bold">₹{selectedCourseDetails.installment2.toLocaleString('en-IN')}</strong>
                                            </div>
                                        </div>

                                        {/* Scholarship Note */}
                                        <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-[11.5px] text-amber-900 dark:text-amber-200">
                                            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <strong>IDL Scholarship Test (IST):</strong> Up to <strong>90% tuition fee waiver</strong> based on student performance in admission test.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. What is Included */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        <BookOpen className="w-4 h-4 text-[#2563EB]" />
                                        <span>Included in this Program</span>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>Full CBSE Syllabus & Concept Lectures</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>Printed Modules & DPP Booklets</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>Weekly Minor & Periodic Major Tests</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>Dedicated Doubt Removal Counters</span>
                                        </li>
                                    </ul>
                                </div>

                            </div>

                            {/* Modal Footer / CTAs */}
                            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                <a 
                                    href="tel:+919997177141"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                                >
                                    <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                                    <span>Helpline: +91 99971 77141</span>
                                </a>

                                <div className="flex items-center gap-2.5 ml-auto">
                                    <Link href={`/book-demo?course=${encodeURIComponent(selectedCourseDetails.title)}&center=${encodeURIComponent(selectedCenter)}`}>
                                        <Button variant="outline" size="sm" className="font-bold text-xs rounded-xl border-slate-300">
                                            Book Free Demo
                                        </Button>
                                    </Link>
                                    <Link href={`/admission?class=${encodeURIComponent(selectedCourseDetails.classCode)}&center=${encodeURIComponent(selectedCenter)}`}>
                                        <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs rounded-xl shadow-md">
                                            Apply for Admission
                                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ── FILTER MODAL FOR MOBILE / QUICK ACCESS ── */}
            <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogContent className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        <span>Filter Courses</span>
                    </div>

                    <div className="space-y-4 pt-2">
                        {/* Center */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">IDL Learning Centre</label>
                            <select 
                                value={selectedCenter} 
                                onChange={(e) => setSelectedCenter(e.target.value)}
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                {CENTERS.map(c => <option key={c.id} value={c.name}>{c.name} ({c.address})</option>)}
                            </select>
                        </div>

                        {/* Stream - Fixed to Grade 9-12 */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Academic Stream</label>
                            <input 
                                type="text"
                                readOnly
                                value="Grade 9-12"
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Class */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Class</label>
                            <select 
                                value={selectedClass || ''} 
                                onChange={(e) => setSelectedClass(e.target.value || null)}
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="">All Classes (Class 9 - 12)</option>
                                {AVAILABLE_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>

                        {/* Mode */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Mode</label>
                            <select 
                                value={selectedMode} 
                                onChange={(e) => setSelectedMode(e.target.value)}
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setSelectedClass(null);
                                    setSelectedMode('Offline Mode');
                                    setFilterModalOpen(false);
                                }}
                                className="text-xs"
                            >
                                Reset
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={() => setFilterModalOpen(false)}
                                className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
