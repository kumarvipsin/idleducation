'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    ArrowRight, 
    ChevronLeft, 
    X, 
    GraduationCap, 
    Atom, 
    TrendingUp, 
    Palette, 
    Building2, 
    Globe, 
    Layers,
    Sparkles,
    Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Jee2DIcon,
    Neet2DIcon,
    Cbse2DIcon,
    Cuet2DIcon,
    TestSeries2DIcon,
    Youtube2DIcon,
    Olympiad2DIcon
} from './course-2d-icons';

// ── Course Item Interface & Data ──────────────────────────────────────
interface CourseItem {
    id: string;
    title: string;
    subtitle: string;
    href: string;
    cardBg: string;
    cardBorder: string;
    hoverBorder: string;
    badgeBg: string;
    badgeBorder: string;
    waveColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

const courses: CourseItem[] = [
    {
        id: 'jee',
        title: 'JEE',
        subtitle: 'Main & Advanced',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#F9FBFF] to-[#F1F6FF] dark:from-blue-950/30 dark:to-blue-900/15',
        cardBorder: 'border-[#E1EDFC] dark:border-blue-900/40',
        hoverBorder: 'hover:border-[#93C5FD] dark:hover:border-blue-500',
        badgeBg: 'bg-white dark:bg-blue-950/80',
        badgeBorder: 'border-[#DBEAFE] dark:border-blue-800/50',
        waveColor: '#BFDBFE',
        icon: Jee2DIcon,
    },
    {
        id: 'neet',
        title: 'NEET',
        subtitle: 'Medical Entrance',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#F7FDF9] to-[#ECF9F2] dark:from-emerald-950/30 dark:to-emerald-900/15',
        cardBorder: 'border-[#D1F4E2] dark:border-emerald-900/40',
        hoverBorder: 'hover:border-[#86EFAC] dark:hover:border-emerald-500',
        badgeBg: 'bg-white dark:bg-emerald-950/80',
        badgeBorder: 'border-[#BBF7D0] dark:border-emerald-800/50',
        waveColor: '#A7F3D0',
        icon: Neet2DIcon,
    },
    {
        id: 'cbse',
        title: 'CBSE',
        subtitle: 'Classes 9–12',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#FFFDF7] to-[#FEF8EB] dark:from-amber-950/30 dark:to-amber-900/15',
        cardBorder: 'border-[#FDEAC0] dark:border-amber-900/40',
        hoverBorder: 'hover:border-[#FCD34D] dark:hover:border-amber-500',
        badgeBg: 'bg-white dark:bg-amber-950/80',
        badgeBorder: 'border-[#FDE68A] dark:border-amber-800/50',
        waveColor: '#FDE68A',
        icon: Cbse2DIcon,
    },
    {
        id: 'cuet',
        title: 'CUET (UG)',
        subtitle: 'Classes 11–12',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#F6FDFB] to-[#ECFAF6] dark:from-teal-950/30 dark:to-teal-900/15',
        cardBorder: 'border-[#CCF3EA] dark:border-teal-900/40',
        hoverBorder: 'hover:border-[#5EEAD4] dark:hover:border-teal-500',
        badgeBg: 'bg-white dark:bg-teal-950/80',
        badgeBorder: 'border-[#99F6E4] dark:border-teal-800/50',
        waveColor: '#99F6E4',
        icon: Cuet2DIcon,
    },
    {
        id: 'olympiad',
        title: 'OLYMPIAD',
        subtitle: 'Classes 6–10',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#FFF8F8] to-[#FDF0F0] dark:from-rose-950/30 dark:to-rose-900/15',
        cardBorder: 'border-[#FDD5D5] dark:border-rose-900/40',
        hoverBorder: 'hover:border-[#FDA4AF] dark:hover:border-rose-500',
        badgeBg: 'bg-white dark:bg-rose-950/80',
        badgeBorder: 'border-[#FECDD3] dark:border-rose-800/50',
        waveColor: '#FECDD3',
        icon: Olympiad2DIcon,
    },
    {
        id: 'test-series',
        title: 'TEST SERIES',
        subtitle: 'Mock Tests & PYQs',
        href: '#',
        cardBg: 'bg-gradient-to-b from-[#FAF7FF] to-[#F4ECFF] dark:from-purple-950/30 dark:to-purple-900/15',
        cardBorder: 'border-[#EBDCFF] dark:border-purple-900/40',
        hoverBorder: 'hover:border-[#D8B4FE] dark:hover:border-purple-500',
        badgeBg: 'bg-white dark:bg-purple-950/80',
        badgeBorder: 'border-[#E9D5FF] dark:border-purple-800/50',
        waveColor: '#E9D5FF',
        icon: TestSeries2DIcon,
    }
];

// ── Subtle Bottom-Right Wave Decoration (Matches Reference Image) ─────
function CardWave({ waveColor }: { waveColor: string }) {
    return (
        <svg
            className="absolute right-0 bottom-0 pointer-events-none z-0 rounded-br-[14px]"
            width="68"
            height="44"
            viewBox="0 0 68 44"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M0 44C18 44 36 28 68 14V44H0Z"
                fill={waveColor}
                opacity="0.22"
            />
            <path
                d="M18 44C34 44 46 32 68 21V44H18Z"
                fill={waveColor}
                opacity="0.42"
            />
        </svg>
    );
}

// ── CBSE Class Selector Modal ──────────────────────────────────────────
const CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const;

const STREAM_DATA = [
    {
        id: 'science', 
        label: 'Science Stream (PCM / PCB)',
        icon: Atom,
    },
    {
        id: 'commerce', 
        label: 'Commerce Stream',
        icon: TrendingUp,
    },
    {
        id: 'arts', 
        label: 'Arts Stream',
        icon: Palette,
    },
];

const MODES = [
    {
        id: 'offline', 
        label: 'Offline Mode',
        icon: Building2,
    },
    {
        id: 'online', 
        label: 'Online Mode',
        icon: Globe,
    },
    {
        id: 'hybrid', 
        label: 'Hybrid Mode',
        icon: Layers,
    },
];

function CbseModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [step, setStep] = React.useState<'class' | 'stream' | 'mode'>('class');
    const [selectedClass, setSelectedClass] = React.useState<string | null>(null);
    const [selectedStream, setSelectedStream] = React.useState<string | null>(null);
    const [selectedMode, setSelectedMode] = React.useState<string | null>(null);

    const handleClassClick = (cls: string) => {
        setSelectedClass(cls);
        setSelectedStream(null);
        setSelectedMode(null);
        const is11_12 = cls === 'Class 11' || cls === 'Class 12';
        setTimeout(() => setStep(is11_12 ? 'stream' : 'mode'), 120);
    };

    const handleStreamClick = (id: string) => {
        setSelectedStream(id);
        setTimeout(() => setStep('mode'), 120);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);

        const modeMap: Record<string, string> = {
            offline: 'Offline Mode',
            online: 'Online Mode',
            hybrid: 'Hybrid Mode',
        };
        const modeParam = modeMap[id] || 'Offline Mode';

        const streamMap: Record<string, string> = {
            science: 'Science',
            commerce: 'Commerce',
            arts: 'Arts',
        };
        const streamParam = selectedStream ? (streamMap[selectedStream] || 'All') : 'All';

        setTimeout(() => {
            onClose();
            router.push(`/courses?stream=${encodeURIComponent(streamParam)}&class=${encodeURIComponent(selectedClass || 'Class 9')}&mode=${encodeURIComponent(modeParam)}&session=2026-27`);
        }, 120);
    };

    const stepTitle = step === 'class' ? 'Select Your Class'
        : step === 'stream' ? 'Select Your Stream'
        : 'Select Course Mode';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
            
            {/* Modal Container */}
            <div
                className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes cbseModalIn {
                        from { opacity: 0; transform: scale(0.96) translateY(6px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(6px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .slide-up { animation: slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) both; }
                ` }} />

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {step !== 'class' && (
                            <button
                                onClick={() => {
                                    if (step === 'mode') {
                                        const is11_12 = selectedClass === 'Class 11' || selectedClass === 'Class 12';
                                        setStep(is11_12 ? 'stream' : 'class');
                                    } else {
                                        setStep('class');
                                    }
                                }}
                                className="w-7 h-7 -ml-1 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 outline-none"
                                aria-label="Back"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                        <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-extrabold tracking-wider text-amber-600 dark:text-amber-400 uppercase leading-none">CBSE</span>
                            <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0B1F4B] dark:text-white leading-tight mt-1 truncate">{stepTitle}</h3>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-7 h-7 -mr-1 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors outline-none cursor-pointer shrink-0" 
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                    {/* Step 1: Select Your Class */}
                    {step === 'class' && (
                        <div className="slide-up grid grid-cols-2 gap-2.5">
                            {CLASSES.map((cls) => {
                                const isSelected = selectedClass === cls;
                                return (
                                    <button
                                        key={cls}
                                        onClick={() => handleClassClick(cls)}
                                        className={cn(
                                            "group relative flex items-center justify-between py-3.5 px-4 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-[14px] font-bold transition-colors",
                                            isSelected
                                                ? "text-[#0B1F4B] dark:text-blue-200"
                                                : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                        )}>
                                            {cls}
                                        </span>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Step 2: Select Your Stream */}
                    {step === 'stream' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {STREAM_DATA.map((s) => {
                                const isSelected = selectedStream === s.id;
                                const Icon = s.icon;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => handleStreamClick(s.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                isSelected
                                                    ? "text-[#0B1F4B] dark:text-blue-200"
                                                    : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                            )}>
                                                {s.label}
                                            </span>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Step 3: Select Course Mode */}
                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {MODES.map((mode) => {
                                const isSelected = selectedMode === mode.id;
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => handleModeClick(mode.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                isSelected
                                                    ? "text-[#0B1F4B] dark:text-blue-200"
                                                    : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                            )}>
                                                {mode.label}
                                            </span>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── JEE Exam Selector Modal ────────────────────────────────────────────
const JEE_OPTIONS = [
    {
        id: 'jee-main',
        label: 'JEE Main',
        desc: 'Paper 1 & 2 · NTA Conducted',
        icon: Atom,
    },
    {
        id: 'jee-advanced',
        label: 'JEE Advanced',
        desc: 'IIT Entrance · Top 2.5 Lakh',
        icon: Sparkles,
    },
    {
        id: 'jee-both',
        label: 'JEE Main + Advanced',
        desc: 'Complete Preparation Bundle',
        icon: Layers,
    },
];

const JEE_MODES = [
    {
        id: 'offline', 
        label: 'Offline Mode',
        icon: Building2,
    },
    {
        id: 'online', 
        label: 'Online Mode',
        icon: Globe,
    },
    {
        id: 'hybrid', 
        label: 'Hybrid Mode',
        icon: Layers,
    },
];

function JeeModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [step, setStep] = React.useState<'course' | 'mode'>('course');
    const [selectedCourse, setSelectedCourse] = React.useState<string | null>(null);
    const [selectedMode, setSelectedMode] = React.useState<string | null>(null);

    const handleCourseClick = (id: string) => {
        setSelectedCourse(id);
        setSelectedMode(null);
        setTimeout(() => setStep('mode'), 120);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);
        const modeMap: Record<string, string> = { offline: 'Classroom', online: 'Online', hybrid: 'Hybrid' };
        setTimeout(() => {
            onClose();
            router.push(`/courses?stream=JEE&mode=${encodeURIComponent(modeMap[id] || 'Classroom')}&session=2026-27`);
        }, 120);
    };

    const stepTitle = step === 'course' ? 'Select Your Course' : 'Select Course Mode';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Select JEE Exam Type">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
            
            {/* Modal Container */}
            <div
                className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {step !== 'course' && (
                            <button
                                onClick={() => setStep('course')}
                                className="w-7 h-7 -ml-1 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 outline-none"
                                aria-label="Back"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center shrink-0">
                            <Atom className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase leading-none">JEE</span>
                            <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0B1F4B] dark:text-white leading-tight mt-1 truncate">{stepTitle}</h3>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-7 h-7 -mr-1 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors outline-none cursor-pointer shrink-0" 
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                    {step === 'course' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {JEE_OPTIONS.map((opt) => {
                                const isSelected = selectedCourse === opt.id;
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleCourseClick(opt.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={cn(
                                                    "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                    isSelected
                                                        ? "text-[#0B1F4B] dark:text-blue-200"
                                                        : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                                )}>
                                                    {opt.label}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                                                    {opt.desc}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {JEE_MODES.map((mode) => {
                                const isSelected = selectedMode === mode.id;
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => handleModeClick(mode.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                isSelected
                                                    ? "text-[#0B1F4B] dark:text-blue-200"
                                                    : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                            )}>
                                                {mode.label}
                                            </span>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── NEET Exam Selector Modal ───────────────────────────────────────────
const NEET_OPTIONS = [
    {
        id: 'neet-11',
        label: 'For Class 11th',
        desc: '2 Year Foundation Course',
        icon: GraduationCap,
    },
    {
        id: 'neet-12',
        label: 'For Class 12th',
        desc: '1 Year Target Course',
        icon: GraduationCap,
    },
    {
        id: 'neet-pass',
        label: 'For Class 12th Pass',
        desc: 'Dropper/Repeater Batch',
        icon: Sparkles,
    },
];

const NEET_MODES = [
    {
        id: 'offline', 
        label: 'Offline Mode',
        icon: Building2,
    },
    {
        id: 'online', 
        label: 'Online Mode',
        icon: Globe,
    },
    {
        id: 'hybrid', 
        label: 'Hybrid Mode',
        icon: Layers,
    },
];

function NeetModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [step, setStep] = React.useState<'course' | 'mode'>('course');
    const [selectedCourse, setSelectedCourse] = React.useState<string | null>(null);
    const [selectedMode, setSelectedMode] = React.useState<string | null>(null);

    const handleCourseClick = (id: string) => {
        setSelectedCourse(id);
        setSelectedMode(null);
        setTimeout(() => setStep('mode'), 120);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);
        const modeMap: Record<string, string> = { offline: 'Classroom', online: 'Online', hybrid: 'Hybrid' };
        setTimeout(() => {
            onClose();
            router.push(`/courses?stream=NEET&mode=${encodeURIComponent(modeMap[id] || 'Classroom')}&session=2026-27`);
        }, 120);
    };

    const stepTitle = step === 'course' ? 'Select Your Course' : 'Select Course Mode';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Select NEET Exam Type">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
            
            {/* Modal Container */}
            <div
                className="relative w-full max-w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.22s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {step !== 'course' && (
                            <button
                                onClick={() => setStep('course')}
                                className="w-7 h-7 -ml-1 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 outline-none"
                                aria-label="Back"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        )}
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase leading-none">NEET</span>
                            <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0B1F4B] dark:text-white leading-tight mt-1 truncate">{stepTitle}</h3>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-7 h-7 -mr-1 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors outline-none cursor-pointer shrink-0" 
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5">
                    {step === 'course' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {NEET_OPTIONS.map((opt) => {
                                const isSelected = selectedCourse === opt.id;
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleCourseClick(opt.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={cn(
                                                    "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                    isSelected
                                                        ? "text-[#0B1F4B] dark:text-blue-200"
                                                        : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                                )}>
                                                    {opt.label}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                                                    {opt.desc}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2.5">
                            {NEET_MODES.map((mode) => {
                                const isSelected = selectedMode === mode.id;
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => handleModeClick(mode.id)}
                                        className={cn(
                                            "group flex items-center justify-between w-full px-4 py-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-2xs",
                                            isSelected
                                                ? "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#2563EB] dark:border-blue-500"
                                                : "bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/80 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                                isSelected
                                                    ? "bg-blue-100 dark:bg-blue-900/50 text-[#2563EB] dark:text-blue-300"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40"
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "text-[13.5px] sm:text-[14px] font-bold truncate transition-colors",
                                                isSelected
                                                    ? "text-[#0B1F4B] dark:text-blue-200"
                                                    : "text-[#0F172A] dark:text-slate-100 group-hover:text-[#0B1F4B]"
                                            )}>
                                                {mode.label}
                                            </span>
                                        </div>
                                        <ArrowRight className={cn(
                                            "w-4 h-4 shrink-0 transition-all ml-2",
                                            isSelected
                                                ? "text-[#2563EB] dark:text-blue-400 translate-x-0.5"
                                                : "text-slate-300 dark:text-slate-600 group-hover:text-[#2563EB] group-hover:translate-x-0.5"
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main DiscoverCoursesSection Component ─────────────────────────────
export function DiscoverCoursesSection() {
    const [cbseOpen, setCbseOpen] = React.useState(false);
    const [jeeOpen, setJeeOpen] = React.useState(false);
    const [neetOpen, setNeetOpen] = React.useState(false);

    return (
        <>
            {/* CBSE Modal */}
            {cbseOpen && <CbseModal onClose={() => setCbseOpen(false)} />}
            {/* JEE Modal */}
            {jeeOpen && <JeeModal onClose={() => setJeeOpen(false)} />}
            {/* NEET Modal */}
            {neetOpen && <NeetModal onClose={() => setNeetOpen(false)} />}

            <section 
                suppressHydrationWarning 
                aria-label="Courses We Offer"
                className="relative w-full z-30 -mt-6 min-[390px]:-mt-8 sm:-mt-8 md:-mt-10 lg:-mt-12 px-3 sm:px-4 md:px-6 pointer-events-auto pb-4 sm:pb-6"
            >
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(14px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fade-up {
                        animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        opacity: 0;
                    }
                ` }} />
                
                {/* Clean Centered Container with Generous Margins */}
                <div className="container mx-auto px-0 max-w-[1360px] relative z-10">
                    <div className="relative bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-[0_10px_30px_-6px_rgba(11,40,88,0.06),0_2px_6px_rgba(11,40,88,0.02)] p-3.5 sm:p-4 md:p-5 overflow-hidden">
                        
                        {/* Section Header / Eyebrow */}
                        <div className="relative z-10 flex items-center justify-center mb-4 sm:mb-5">
                            <p className="inline-flex items-center text-sm sm:text-base font-extrabold tracking-[0.02em] text-[#0B2858] select-none bg-[#FCD34D] rounded-full px-5 py-1.5 shadow-sm">
                                Courses We Offer
                            </p>
                        </div>

                        {/* Six Course Cards: 1 Horizontal Row on Desktop, 2 Columns on Mobile */}
                        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-2 xl:gap-3">
                            {courses.map((course, index) => {
                                const IconComponent = course.icon;
                                const isCbse = course.id === 'cbse';
                                return (
                                    <Link
                                        key={course.id}
                                        href={isCbse || course.id === 'jee' || course.id === 'neet' ? '#' : course.href}
                                        target={course.id === 'youtube-channel' ? '_blank' : undefined}
                                        rel={course.id === 'youtube-channel' ? 'noopener noreferrer' : undefined}
                                        style={{ animationDelay: `${index * 60}ms` }}
                                        onClick={(e) => {
                                            if (isCbse) {
                                                e.preventDefault();
                                                setCbseOpen(true);
                                            } else if (course.id === 'jee') {
                                                e.preventDefault();
                                                setJeeOpen(true);
                                            } else if (course.id === 'neet') {
                                                e.preventDefault();
                                                setNeetOpen(true);
                                            } else if (course.href === '#') {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={cn(
                                            "group relative flex items-center justify-between rounded-[14px] border",
                                            "shadow-[0_2px_8px_-2px_rgba(11,40,88,0.04),0_1px_2px_rgba(11,40,88,0.02)]",
                                            "hover:shadow-[0_6px_18px_-3px_rgba(11,40,88,0.08)] transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]",
                                            "h-[88px] min-[360px]:h-[92px] sm:h-[96px] lg:h-[90px] xl:h-[96px]",
                                            "px-3 py-3 sm:px-3.5 sm:py-3.5 lg:px-2.5 lg:py-3 xl:px-3 xl:py-3.5",
                                            "animate-fade-up overflow-hidden",
                                            course.cardBg,
                                            course.cardBorder,
                                            course.hoverBorder
                                        )}
                                    >
                                        {/* Subtle Course Color Accent Wave on Bottom-Right */}
                                        <CardWave waveColor={course.waveColor} />

                                        {/* Left: 2D Icon Container with Soft Circular Badge */}
                                        <div className={cn(
                                            "relative z-10 w-11 h-11 sm:w-12 sm:h-12 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-full border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-all duration-200",
                                            course.badgeBg,
                                            course.badgeBorder
                                        )}>
                                            <IconComponent className="w-[60%] h-[60%]" />
                                        </div>

                                        {/* Middle: Course Title & Subtitle in IDL Navy (#0B2858) */}
                                        <div className="relative z-10 flex flex-col min-w-0 flex-1 justify-center ml-2.5 sm:ml-3 lg:ml-2.5 xl:ml-3">
                                            <h4 className="text-[12px] min-[360px]:text-[13px] sm:text-[14px] lg:text-[13px] min-[1150px]:text-[14px] xl:text-[15px] font-extrabold text-[#0B2858] dark:text-white uppercase tracking-tight leading-tight whitespace-nowrap overflow-visible group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                                {course.title}
                                            </h4>
                                            <p className="text-[10px] min-[360px]:text-[10.5px] sm:text-[11px] lg:text-[10px] min-[1150px]:text-[10.5px] xl:text-[11px] font-medium text-slate-500/90 dark:text-slate-400 truncate mt-0.5 leading-tight">
                                                {course.subtitle}
                                            </p>
                                        </div>

                                        {/* Right: Arrow Symbol Only (No Background) */}
                                        <div className="relative z-10 flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 text-[#0B2858]/65 dark:text-blue-300/80 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform duration-200" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
