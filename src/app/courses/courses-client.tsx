'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    MapPin, 
    Building2,
    GraduationCap, 
    ChevronDown, 
    ChevronRight, 
    ArrowRight,
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
import { useToast } from "@/hooks/use-toast";

// ── IDL 4 Offline Centers in Delhi ─────────────────────────────────────
const CENTERS = [
    { id: 'mukherjee-nagar', name: 'Mukherjee Nagar', address: 'Mukherjee Nagar, Delhi-110009' },
    { id: 'mangol-puri', name: 'Mangol Puri', address: 'Mangol Puri, Delhi-110083' },
    { id: 'budh-vihar', name: 'Budh Vihar', address: 'Budh Vihar, Delhi-110086' },
    { id: 'krishan-vihar', name: 'Krishan Vihar', address: 'Krishan Vihar, Delhi-110086' },
];

// ── Stream Options: Class 11 & 12 Only (Science / Commerce / Arts) ──
const STREAMS = [
    { id: 'All', label: 'All Streams' },
    { id: 'Science', label: 'Science' },
    { id: 'Commerce', label: 'Commerce' },
    { id: 'Arts', label: 'Arts' },
];

// ── Classes 9 to 12 Only ───────────────────────────────────────────────
const AVAILABLE_CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const;

// ── 3 Modes Only ───────────────────────────────────────────────────────
const MODES = ['Offline Mode', 'Online Mode', 'Hybrid Mode'] as const;

// ── Mode-wise Fee Calculator (Including GST) ───────────────────────────
// Class 9 & 10: Online ₹29,999 | Offline ₹39,999 | Hybrid ₹49,999
// Class 11 & 12: Online ₹39,999 | Offline ₹49,999 | Hybrid ₹59,999
export function calculateCourseFee(classCode: string, mode: string = 'Offline Mode'): number {
    const isJunior = classCode.includes('9') || classCode.includes('10');
    const m = mode.toLowerCase();
    if (m.includes('online')) {
        return isJunior ? 29999 : 39999;
    }
    if (m.includes('hybrid')) {
        return isJunior ? 49999 : 59999;
    }
    // Offline Mode (default)
    return isJunior ? 39999 : 49999;
}

interface CourseCardData {
    id: string;
    classCode: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
    stream: 'Foundation' | 'Science' | 'Commerce' | 'Arts';
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
        stream: 'Foundation',
        title: 'Class 9',
        targetMoving: 'For Students Moving to Class 9',
        duration: '1 Year',
        features: [
            "Strong foundation in Maths, Science & English",
            "CBSE-focused learning with concept clarity",
            "Regular tests, DPPs & doubt support",
        ],
        feeAnnual: 39999,
        feeLumpSum: 39999,
        installment1: 39999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '06 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '12 May 2026', status: 'Admissions Open' },
        ],
    },
    {
        id: 'class-10',
        classCode: 'Class 10',
        stream: 'Foundation',
        title: 'Class 10',
        targetMoving: 'For Students Moving to Class 10',
        duration: '1 Year',
        features: [
            "Complete CBSE board exam preparation",
            "NCERT-based concepts, practice & revision",
            "Regular tests, PYQs & performance analysis",
        ],
        feeAnnual: 39999,
        feeLumpSum: 39999,
        installment1: 39999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '06 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '12 May 2026', status: 'Admissions Open' },
        ],
    },
    {
        id: 'class-11-science',
        classCode: 'Class 11',
        stream: 'Science',
        title: 'Class 11 - Science',
        targetMoving: 'For Students Moving to Class 11',
        duration: '1 Year',
        features: [
            "Strong foundation for Class 11 & 12 Science",
            "Physics, Chemistry & Maths/Biology clarity",
            "Board preparation with competitive foundation",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '10 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '28 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-11-commerce',
        classCode: 'Class 11',
        stream: 'Commerce',
        title: 'Class 11 - Commerce',
        targetMoving: 'For Students Moving to Class 11',
        duration: '1 Year',
        features: [
            "Strong foundation for Class 11 & 12 Commerce",
            "Accountancy, Economics & Business Studies",
            "Board preparation with CUET & CA foundation",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '10 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '28 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-11-arts',
        classCode: 'Class 11',
        stream: 'Arts',
        title: 'Class 11 - Arts',
        targetMoving: 'For Students Moving to Class 11',
        duration: '1 Year',
        features: [
            "Strong foundation for Class 11 & 12 Arts",
            "History, Political Science & Geography depth",
            "Board preparation with CUET foundation",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '10 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '28 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-12-science',
        classCode: 'Class 12',
        stream: 'Science',
        title: 'Class 12 - Science',
        targetMoving: 'For Students Moving to Class 12',
        duration: '1 Year',
        features: [
            "Focused Class 12 board preparation for Science",
            "Chapter-wise practice, PYQs & mock tests",
            "Exam strategy, revision & performance tracking",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '08 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '24 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-12-commerce',
        classCode: 'Class 12',
        stream: 'Commerce',
        title: 'Class 12 - Commerce',
        targetMoving: 'For Students Moving to Class 12',
        duration: '1 Year',
        features: [
            "Focused Class 12 board preparation for Commerce",
            "Accountancy, Economics & BST mock drills",
            "PYQs, revision & pre-board performance tracking",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '08 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '24 April 2026', status: 'Upcoming' },
        ],
    },
    {
        id: 'class-12-arts',
        classCode: 'Class 12',
        stream: 'Arts',
        title: 'Class 12 - Arts',
        targetMoving: 'For Students Moving to Class 12',
        duration: '1 Year',
        features: [
            "Focused Class 12 board preparation for Arts",
            "Long-answer writing, maps & 10-year PYQ tests",
            "Comprehensive revision & board score optimization",
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        batchPhases: [
            { phase: 'Phase I', date: '08 April 2026', status: 'Admissions Open' },
            { phase: 'Phase II', date: '24 April 2026', status: 'Upcoming' },
        ],
    },
];

export function CoursesClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Query params
    const centerParam = searchParams.get('center');
    const stateParam = searchParams.get('state');
    const classParam = searchParams.get('class');
    const streamParam = searchParams.get('stream');
    const modeParam = searchParams.get('mode');
    const sessionParam = searchParams.get('session') || '2026–27';

    // State
    const [selectedState, setSelectedState] = useState<string>(() => {
        if (stateParam && stateParam.toLowerCase().includes('bihar')) return 'Bihar';
        return 'Delhi';
    });

    // Center is null by default so student selects manually
    const [selectedCenter, setSelectedCenter] = useState<string | null>(() => {
        if (!centerParam) return null;
        const found = CENTERS.find(c => c.name.toLowerCase() === centerParam.toLowerCase() || c.id === centerParam.toLowerCase());
        return found ? found.name : null;
    });

    const { toast } = useToast();
    const [centerRequiredNotice, setCenterRequiredNotice] = useState(false);

    const handleSelectState = (st: string) => {
        setSelectedState(st);
        setSelectedCenter(null);
        setCenterRequiredNotice(false);
    };

    const [session, setSession] = useState<string>(sessionParam || '2026–27');
    const [selectedClass, setSelectedClass] = useState<string | null>(() => {
        if (!classParam) return null;
        const normalized = AVAILABLE_CLASSES.find(c => c.toLowerCase() === classParam.toLowerCase());
        return normalized || null;
    });

    const [selectedStream, setSelectedStream] = useState<string | null>(() => {
        if (!streamParam) return null;
        const lower = streamParam.toLowerCase();
        if (lower.includes('science')) return 'Science';
        if (lower.includes('commerce')) return 'Commerce';
        if (lower.includes('arts') || lower.includes('humanities')) return 'Arts';
        return null;
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

    const handleSelectClass = (cls: string | null) => {
        setSelectedClass(cls);
        if (cls !== 'Class 11' && cls !== 'Class 12') {
            setSelectedStream(null);
        }
    };

    // Filtered courses: strictly reactive to Class, Stream & Mode
    const filteredCourses = useMemo(() => {
        let list = COURSES_DATA;

        // Filter by Class
        if (selectedClass) {
            list = list.filter(c => c.classCode.toLowerCase() === selectedClass.toLowerCase());
        }

        // Filter by Stream (Only applies to Class 11 & 12 courses)
        if (selectedStream && selectedStream !== 'All') {
            const streamLower = selectedStream.toLowerCase();
            list = list.filter(c => {
                if (c.classCode === 'Class 9' || c.classCode === 'Class 10') {
                    return selectedClass === c.classCode;
                }
                return c.stream.toLowerCase() === streamLower;
            });
        }

        return list;
    }, [selectedClass, selectedStream]);

    // Handle course details click
    const handleOpenCourseDetails = (course: CourseCardData) => {
        setSelectedCourseDetails(course);
        setDetailsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pb-20">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-10">
                
                {/* ── 1. TOP HEADER SELECTOR BAR: STATE & CENTER (NO "Courses for:", NO STREAM) ── */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-5 border-b border-slate-200/80 dark:border-slate-800">
                    {/* State Selector Dropdown - Delhi & Bihar */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button 
                                id="state-selector-dropdown"
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-extrabold text-[11px] sm:text-[11.5px] tracking-wider uppercase shrink-0">
                                    <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                        <Building2 className="w-2.5 h-2.5 text-[#2563EB]" />
                                    </span>
                                    <span>STATE</span>
                                </div>
                                <span className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white">
                                    {selectedState}
                                </span>
                                <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-1.5 shadow-xl rounded-xl z-50">
                            <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                                Select State
                            </div>
                            {['Delhi', 'Bihar'].map((st) => (
                                <DropdownMenuItem
                                    key={st}
                                    onClick={() => handleSelectState(st)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs font-semibold ${selectedState === st ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <span className="font-bold">{st}</span>
                                    {selectedState === st && <Check className="w-4 h-4 text-[#2563EB]" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Center / Branch Selector: Shows Delhi branches if Delhi, Disabled if Bihar */}
                    {selectedState === 'Bihar' ? (
                        <div 
                            className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 opacity-60 cursor-not-allowed select-none"
                            title="Offline branches are currently not available in Bihar"
                        >
                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-extrabold text-[11px] sm:text-[11.5px] tracking-wider uppercase shrink-0">
                                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                </span>
                                <span>CENTER</span>
                            </div>
                            <span className="text-[13px] sm:text-[14px] font-medium text-slate-400 dark:text-slate-500">
                                No Branch Available
                            </span>
                        </div>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="relative inline-block">
                                    <button 
                                        id="center-selector-dropdown"
                                        className={`bg-white dark:bg-slate-900 border rounded-xl px-3 sm:px-3.5 py-1.5 sm:py-2 flex items-center gap-2.5 sm:gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                                            !selectedCenter && centerRequiredNotice 
                                                ? 'border-red-500 ring-4 ring-red-400/50 bg-red-50/70 dark:bg-red-950/40 shadow-lg shadow-red-500/20 animate-pulse' 
                                                : 'border-slate-200 dark:border-slate-700/80'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-blue-400 font-extrabold text-[11px] sm:text-[11.5px] tracking-wider uppercase shrink-0">
                                            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                                <MapPin className="w-2.5 h-2.5 text-[#2563EB] fill-[#2563EB]" />
                                            </span>
                                            <span>CENTER</span>
                                        </div>
                                        <span className={`text-[13.5px] sm:text-[14.5px] ${selectedCenter ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-500 dark:text-slate-400'}`}>
                                            {selectedCenter || 'Select Center'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5 shrink-0" />
                                    </button>
                                    {!selectedCenter && centerRequiredNotice && (
                                        <span className="absolute -top-2.5 -right-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold tracking-wider uppercase shadow-md animate-bounce">
                                            Select Here
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-1.5 shadow-xl rounded-xl z-50">
                                <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                                    IDL Offline Learning Centres (Delhi)
                                </div>
                                {CENTERS.map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        onClick={() => {
                                            setSelectedCenter(c.name);
                                            setCenterRequiredNotice(false);
                                        }}
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
                    )}
                </div>

                {/* ── 2. MAIN TITLE (Fixed for all classes & streams) ── */}
                <div className="mt-5 sm:mt-6 mb-3 sm:mb-4">
                    <h1 className="text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
                        Offline, Online, Hybrid + Class 9–12 + Science/Commerce/Arts
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
                            <DropdownMenuItem onClick={() => handleSelectClass(null)} className="cursor-pointer text-xs font-semibold">
                                All Classes
                            </DropdownMenuItem>
                            {AVAILABLE_CLASSES.map((cls) => (
                                <DropdownMenuItem 
                                    key={cls} 
                                    onClick={() => handleSelectClass(cls)}
                                    className={`cursor-pointer text-xs ${selectedClass === cls ? 'font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-200'}`}
                                >
                                    {cls}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Stream Selector Pill - Shown ONLY for Class 11 and Class 12 */}
                    {(selectedClass === 'Class 11' || selectedClass === 'Class 12') && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button 
                                    id="stream-selector-pill"
                                    className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors outline-none ${selectedStream ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 text-blue-700 dark:text-blue-300 font-bold' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                                >
                                    <span>{selectedStream ? `Stream: ${selectedStream}` : 'Stream'}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-1 z-50">
                                <DropdownMenuItem onClick={() => setSelectedStream(null)} className="cursor-pointer text-xs font-semibold">
                                    All Streams
                                </DropdownMenuItem>
                                {['Science', 'Commerce', 'Arts'].map((st) => (
                                    <DropdownMenuItem 
                                        key={st} 
                                        onClick={() => setSelectedStream(st)}
                                        className={`cursor-pointer text-xs ${selectedStream === st ? 'font-bold text-[#2563EB] bg-blue-50 dark:bg-blue-950' : 'text-slate-700 dark:text-slate-200'}`}
                                    >
                                        {st} Stream
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

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
                    {(selectedClass || selectedStream || selectedMode !== 'Offline Mode' || selectedState !== 'Delhi' || selectedCenter !== null) && (
                        <button 
                            onClick={() => {
                                setSelectedClass(null);
                                setSelectedStream(null);
                                setSelectedMode('Offline Mode');
                                setSelectedState('Delhi');
                                setSelectedCenter(null);
                                setCenterRequiredNotice(false);
                            }}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            id={`course-card-${course.id}`}
                            className="bg-white dark:bg-slate-900 rounded-[22px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(11,40,88,0.05)] hover:shadow-[0_12px_32px_-6px_rgba(11,40,88,0.12)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full"
                        >
                            <div>
                                {/* Mode Badge: OFFLINE CLASSROOM */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0D1527] text-white text-[10.5px] sm:text-[11px] font-black tracking-widest uppercase mb-4 self-start shadow-xs">
                                    {selectedMode === 'Offline Mode' || selectedMode.toLowerCase().includes('offline') ? 'OFFLINE CLASSROOM' : selectedMode.toUpperCase()}
                                </div>

                                {/* Course Title */}
                                <h3 className="text-[19px] sm:text-[21px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                                    {course.title}
                                </h3>

                                {/* Subtitle: Moving Students & Duration */}
                                <div className="text-[11.5px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-1 mb-5 sm:mb-6 leading-snug">
                                    <p>{course.targetMoving}</p>
                                    <p>Duration: {course.duration}</p>
                                </div>

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

                            {/* Bottom Link CTA: "View Course Details →" */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!selectedCenter) {
                                            setCenterRequiredNotice(true);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            return;
                                        }
                                        router.push(`/courses/${course.id}?center=${encodeURIComponent(selectedCenter)}&mode=${encodeURIComponent(selectedMode)}&stream=${encodeURIComponent(course.stream)}`);
                                    }}
                                    className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-bold text-[#1D4ED8] dark:text-blue-400 hover:text-[#1E40AF] dark:hover:text-blue-300 transition-colors group/link text-left cursor-pointer w-full"
                                >
                                    <span>View Course Details</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover/link:translate-x-1 shrink-0" />
                                </button>
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

                                {/* 2. Fee Structure */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                                        <IndianRupee className="w-4 h-4 text-[#2563EB]" />
                                        <span>Course Fee Details</span>
                                    </div>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700">
                                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                                            <div>
                                                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Total Course Fee ({selectedMode})</span>
                                                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                                                    ₹{calculateCourseFee(selectedCourseDetails.classCode, selectedMode).toLocaleString('en-IN')}
                                                    <span className="text-xs font-normal text-slate-400 ml-1.5">(One-Time)</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                                                    ✓ Including GST
                                                </span>
                                                <span className="text-[10px] text-slate-400 block mt-1">Single Payment • No Installments</span>
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
                                    href="tel:+918860040010"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                                >
                                    <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                                    <span>Admission Counseling: +91 8860040010</span>
                                </a>

                                <div className="flex items-center gap-2.5 ml-auto">
                                    <Link href={`/book-demo?course=${encodeURIComponent(selectedCourseDetails.title)}&center=${encodeURIComponent(selectedCenter || 'Mukherjee Nagar')}`}>
                                        <Button variant="outline" size="sm" className="font-bold text-xs rounded-xl border-slate-300">
                                            Book Free Demo
                                        </Button>
                                    </Link>
                                    <Link href={`/admission?class=${encodeURIComponent(selectedCourseDetails.classCode)}&center=${encodeURIComponent(selectedCenter || 'Mukherjee Nagar')}`}>
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
                        {/* State */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">State</label>
                            <select 
                                value={selectedState} 
                                onChange={(e) => handleSelectState(e.target.value)}
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="Delhi">Delhi</option>
                                <option value="Bihar">Bihar</option>
                            </select>
                        </div>

                        {/* Center / Branch */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">IDL Learning Centre</label>
                            {selectedState === 'Bihar' ? (
                                <select 
                                    disabled
                                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-75"
                                >
                                    <option>No Branch Available (Bihar)</option>
                                </select>
                            ) : (
                                <select 
                                    value={selectedCenter || ''} 
                                    onChange={(e) => setSelectedCenter(e.target.value || null)}
                                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="">Select Center...</option>
                                    {CENTERS.map(c => <option key={c.id} value={c.name}>{c.name} ({c.address})</option>)}
                                </select>
                            )}
                        </div>

                        {/* Class */}
                        <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Class</label>
                            <select 
                                value={selectedClass || ''} 
                                onChange={(e) => handleSelectClass(e.target.value || null)}
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="">All Classes (Class 9 – 12)</option>
                                {AVAILABLE_CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>

                        {/* Academic Stream - Shown ONLY for Class 11 and Class 12 */}
                        {(selectedClass === 'Class 11' || selectedClass === 'Class 12') && (
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Academic Stream</label>
                                <select 
                                    value={selectedStream || ''} 
                                    onChange={(e) => setSelectedStream(e.target.value || null)}
                                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="">All Streams</option>
                                    <option value="Science">Science Stream</option>
                                    <option value="Commerce">Commerce Stream</option>
                                    <option value="Arts">Arts Stream</option>
                                </select>
                            </div>
                        )}

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
                                    setSelectedStream(null);
                                    setSelectedMode('Offline Mode');
                                    setSelectedState('Delhi');
                                    setSelectedCenter(null);
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
