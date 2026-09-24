'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Jee2DIcon,
    Neet2DIcon,
    Cbse2DIcon,
    Cuet2DIcon,
    TestSeries2DIcon,
    Youtube2DIcon
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
        cardBg: 'bg-gradient-to-br from-[#F0F6FF] via-[#F8FBFF] to-[#E5F0FF] dark:from-blue-950/40 dark:via-slate-900 dark:to-blue-900/25',
        cardBorder: 'border-[#CCE2FE] dark:border-blue-900/60',
        hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
        badgeBg: 'bg-white/95 dark:bg-blue-950/90',
        badgeBorder: 'border-[#BFDBFE] dark:border-blue-800',
        waveColor: '#D4E7FE',
        icon: Jee2DIcon,
    },
    {
        id: 'neet',
        title: 'NEET',
        subtitle: 'Medical Entrance',
        href: '#',
        cardBg: 'bg-gradient-to-br from-[#ECFDF5] via-[#F6FEFA] to-[#DCFCE7] dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-900/25',
        cardBorder: 'border-[#Bbf0d6] dark:border-emerald-900/60',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
        badgeBg: 'bg-white/95 dark:bg-emerald-950/90',
        badgeBorder: 'border-[#A7F3D0] dark:border-emerald-800',
        waveColor: '#C4F3DC',
        icon: Neet2DIcon,
    },
    {
        id: 'cbse',
        title: 'CBSE',
        subtitle: 'Classes 9–12',
        href: '#',
        cardBg: 'bg-gradient-to-br from-[#FFFDF5] via-[#FFFEFA] to-[#FEF3C7] dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-900/25',
        cardBorder: 'border-[#FDE2A7] dark:border-amber-900/60',
        hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
        badgeBg: 'bg-white/95 dark:bg-amber-950/90',
        badgeBorder: 'border-[#FCD34D] dark:border-amber-800',
        waveColor: '#FDE4B6',
        icon: Cbse2DIcon,
    },
    {
        id: 'cuet',
        title: 'CUET EXAM',
        subtitle: 'Classes 11–12',
        href: '#',
        cardBg: 'bg-gradient-to-br from-[#F0FDFA] via-[#F7FEFD] to-[#CCFBF1] dark:from-teal-950/40 dark:via-slate-900 dark:to-teal-900/25',
        cardBorder: 'border-[#B2F5EA] dark:border-teal-900/60',
        hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-500',
        badgeBg: 'bg-white/95 dark:bg-teal-950/90',
        badgeBorder: 'border-[#99F6E4] dark:border-teal-800',
        waveColor: '#BEF2E7',
        icon: Cuet2DIcon,
    },
    {
        id: 'test-series',
        title: 'TEST SERIES',
        subtitle: 'Mock Tests & PYQs',
        href: '#',
        cardBg: 'bg-gradient-to-br from-[#FAF5FF] via-[#FCF9FF] to-[#F3E8FF] dark:from-purple-950/40 dark:via-slate-900 dark:to-purple-900/25',
        cardBorder: 'border-[#E5D0FD] dark:border-purple-900/60',
        hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
        badgeBg: 'bg-white/95 dark:bg-purple-950/90',
        badgeBorder: 'border-[#D8B4FE] dark:border-purple-800',
        waveColor: '#E6D0FC',
        icon: TestSeries2DIcon,
    },
    {
        id: 'youtube-channel',
        title: 'YOUTUBE',
        subtitle: 'Free Video Lectures',
        href: 'https://youtube.com/@idleducation',
        cardBg: 'bg-gradient-to-br from-[#FFF5F5] via-[#FFFAFA] to-[#FEE2E2] dark:from-rose-950/40 dark:via-slate-900 dark:to-rose-900/25',
        cardBorder: 'border-[#FDC7C7] dark:border-rose-900/60',
        hoverBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
        badgeBg: 'bg-white/95 dark:bg-rose-950/90',
        badgeBorder: 'border-[#FECACA] dark:border-rose-800',
        waveColor: '#FCCC CC'.replace(' ', ''),
        icon: Youtube2DIcon,
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
                opacity="0.45"
            />
            <path
                d="M18 44C34 44 46 32 68 21V44H18Z"
                fill={waveColor}
                opacity="0.75"
            />
        </svg>
    );
}

// ── CBSE Class Selector Modal ──────────────────────────────────────────
const CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const;

function CbseModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = React.useState<'class' | 'stream' | 'mode'>('class');
    const [, setSelectedClass] = React.useState<string | null>(null);
    const [, setSelectedStream] = React.useState<string | null>(null);
    const [, setSelectedMode] = React.useState<string | null>(null);

    const handleClassClick = (cls: string) => {
        setSelectedClass(cls);
        setSelectedStream(null);
        setSelectedMode(null);
        const is11_12 = cls === 'Class 11' || cls === 'Class 12';
        setTimeout(() => setStep(is11_12 ? 'stream' : 'mode'), 150);
    };

    const handleStreamClick = (id: string) => {
        setSelectedStream(id);
        setTimeout(() => setStep('mode'), 150);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);
        setTimeout(() => onClose(), 200);
    };

    const MODES = [
        {
            id: 'offline', label: 'Offline Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors" aria-hidden="true">
                    <rect x="2" y="4" width="14" height="10" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
                    <path d="M2 14h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'online', label: 'Online Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M2.5 9h13M9 2.5C7 5 6 7 6 9s1 4 3 6.5M9 2.5C11 5 12 7 12 9s-1 4-3 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'hybrid', label: 'Hybrid Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-amber-500 transition-colors" aria-hidden="true">
                    <circle cx="7" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <circle cx="11" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                </svg>
            ),
        },
    ];

    const STREAM_DATA = [
        {
            id: 'science', label: 'Science Stream',
            color: 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <circle cx="9" cy="9" r="3" fill="#3B82F6" opacity="0.8"/>
                    <ellipse cx="9" cy="9" rx="8" ry="3" stroke="#3B82F6" strokeWidth="1" opacity="0.6"/>
                    <ellipse cx="9" cy="9" rx="8" ry="3" transform="rotate(60 9 9)" stroke="#3B82F6" strokeWidth="1" opacity="0.6"/>
                    <ellipse cx="9" cy="9" rx="8" ry="3" transform="rotate(120 9 9)" stroke="#3B82F6" strokeWidth="1" opacity="0.6"/>
                </svg>
            ),
        },
        {
            id: 'commerce', label: 'Commerce Stream',
            color: 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <rect x="2" y="10" width="3" height="6" rx="1" fill="#10B981"/>
                    <rect x="7" y="7" width="3" height="9" rx="1" fill="#10B981" opacity="0.7"/>
                    <rect x="12" y="4" width="3" height="12" rx="1" fill="#10B981" opacity="0.5"/>
                    <path d="M3.5 9L8.5 6L13.5 3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1"/>
                </svg>
            ),
        },
        {
            id: 'arts', label: 'Arts Stream',
            color: 'border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <path d="M4 14C4 14 6 8 9 6C12 4 15 7 14 10C13 13 9 13 9 13" stroke="#A855F7" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="5" cy="13" r="2" fill="#A855F7" opacity="0.5"/>
                    <circle cx="9" cy="5" r="1.5" fill="#EC4899" opacity="0.6"/>
                </svg>
            ),
        },
    ];

    const stepTitle = step === 'class' ? 'Select Your Class'
        : step === 'stream' ? 'Select Your Stream'
        : 'Select Course Mode';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-200/60 dark:border-amber-800/40 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes cbseModalIn {
                        from { opacity: 0; transform: scale(0.92) translateY(12px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    .slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
                ` }} />

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 border-b border-amber-100 dark:border-amber-800/30">
                    <div className="flex items-center gap-2">
                        {step !== 'class' && (
                            <button
                                onClick={() => step === 'mode' ? setStep('stream') : setStep('class')}
                                className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 hover:bg-amber-200 transition-colors"
                                aria-label="Back"
                            >
                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M7.5 2L4 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                        )}
                        <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                                <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" strokeLinejoin="round"/>
                                <path d="M7 11.5V17C7 17 9 19 12 19C15 19 17 17 17 17V11.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 tracking-widest uppercase">CBSE</p>
                            <h3 className="text-[13.5px] font-bold text-slate-800 dark:text-white leading-tight">{stepTitle}</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors" aria-label="Close">
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {step === 'class' && (
                        <div className="slide-up grid grid-cols-2 gap-2">
                            {CLASSES.map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => handleClassClick(cls)}
                                    className="relative flex items-center justify-center px-3 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[13px] transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
                                >
                                    {cls}
                                    <ArrowRight className="absolute right-3 w-3.5 h-3.5 text-slate-300 group-hover:text-amber-400" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'stream' && (
                        <div className="slide-up flex flex-col gap-2">
                            {STREAM_DATA.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStreamClick(s.id)}
                                    className={cn(
                                        "flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 font-semibold text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]",
                                        s.color
                                    )}
                                >
                                    {s.icon}
                                    {s.label}
                                    <ArrowRight className="ml-auto w-3.5 h-3.5 opacity-50" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2">
                            {MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeClick(mode.id)}
                                    className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[13px] text-left transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
                                >
                                    {mode.icon}
                                    <span>{mode.label}</span>
                                    <ArrowRight className="ml-auto w-4 h-4 opacity-50 shrink-0 group-hover:text-amber-500 transition-colors" />
                                </button>
                            ))}
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
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true">
                <rect x="2" y="2" width="14" height="14" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 9h8M9 5v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        id: 'jee-advanced',
        label: 'JEE Advanced',
        desc: 'IIT Entrance · Top 2.5 Lakh',
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-violet-400 hover:bg-violet-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-violet-500 transition-colors" aria-hidden="true">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                <ellipse cx="9" cy="9" rx="7" ry="2.5" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                <ellipse cx="9" cy="9" rx="7" ry="2.5" transform="rotate(60 9 9)" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
                <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
            </svg>
        ),
    },
    {
        id: 'jee-both',
        label: 'JEE Main + Advanced',
        desc: 'Complete Preparation Bundle',
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-400 hover:bg-cyan-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-cyan-500 transition-colors" aria-hidden="true">
                <path d="M2 9L6 5L9 9L12 5L16 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 13L6 9L9 13L12 9L16 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
        ),
    },
];

function JeeModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = React.useState<'course' | 'mode'>('course');
    const [, setSelectedCourse] = React.useState<string | null>(null);
    const [, setSelectedMode] = React.useState<string | null>(null);

    const handleCourseClick = (id: string) => {
        setSelectedCourse(id);
        setSelectedMode(null);
        setTimeout(() => setStep('mode'), 150);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);
        setTimeout(() => onClose(), 200);
    };

    const JEE_MODES = [
        {
            id: 'offline', label: 'Offline Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true">
                    <rect x="2" y="4" width="14" height="10" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
                    <path d="M2 14h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'online', label: 'Online Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M2.5 9h13M9 2.5C7 5 6 7 6 9s1 4 3 6.5M9 2.5C11 5 12 7 12 9s-1 4-3 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'hybrid', label: 'Hybrid Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" aria-hidden="true">
                    <circle cx="7" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <circle cx="11" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                </svg>
            ),
        },
    ];

    const stepTitle = step === 'course' ? 'Select Your Course' : 'Select Course Mode';

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Select JEE Exam Type"
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-200/60 dark:border-indigo-800/40 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/30 border-b border-indigo-100 dark:border-indigo-800/30">
                    <div className="flex items-center gap-2.5">
                        {step === 'mode' && (
                            <button
                                onClick={() => setStep('course')}
                                className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors mr-0.5"
                                aria-label="Back"
                            >
                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                                    <path d="M7.5 2L4 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="#6366F1" strokeWidth="1.4" fill="#6366F1" fillOpacity="0.1"/>
                                <ellipse cx="12" cy="12" rx="10" ry="3.5" stroke="#6366F1" strokeWidth="1" opacity="0.6"/>
                                <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" stroke="#6366F1" strokeWidth="1" opacity="0.6"/>
                                <circle cx="12" cy="12" r="2.5" fill="#6366F1"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">JEE</p>
                            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{stepTitle}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
                    {step === 'course' && (
                        <div className="slide-up flex flex-col gap-2">
                            {JEE_OPTIONS.map((opt, i) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleCourseClick(opt.id)}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    className={cn(
                                        "streams-enter flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-[13px] w-full text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]",
                                        opt.color
                                    )}
                                >
                                    {opt.icon}
                                    <span>{opt.label}</span>
                                    <ArrowRight className="ml-auto w-4 h-4 opacity-50 shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2 mt-1">
                            {JEE_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeClick(mode.id)}
                                    className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[13px] text-left transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
                                >
                                    {mode.icon}
                                    <span>{mode.label}</span>
                                    <ArrowRight className="ml-auto w-4 h-4 opacity-50 shrink-0 group-hover:text-indigo-500 transition-colors" />
                                </button>
                            ))}
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
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                <path d="M4 14h10M4 10h10M9 4v10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        id: 'neet-12',
        label: 'For Class 12th',
        desc: '1 Year Target Course',
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                <path d="M9 5v8M5 9h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        id: 'neet-pass',
        label: 'For Class 12th Pass',
        desc: 'Dropper/Repeater Batch',
        color: 'group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60',
        icon: (
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                <path d="M3 9l3.5 3.5L15 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
];

function NeetModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = React.useState<'course' | 'mode'>('course');
    const [, setSelectedCourse] = React.useState<string | null>(null);
    const [, setSelectedMode] = React.useState<string | null>(null);

    const handleCourseClick = (id: string) => {
        setSelectedCourse(id);
        setSelectedMode(null);
        setTimeout(() => setStep('mode'), 150);
    };

    const handleModeClick = (id: string) => {
        setSelectedMode(id);
        setTimeout(() => onClose(), 200);
    };

    const NEET_MODES = [
        {
            id: 'offline', label: 'Offline Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                    <rect x="2" y="4" width="14" height="10" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2"/>
                    <circle cx="9" cy="9" r="2.5" fill="currentColor"/>
                    <path d="M2 14h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'online', label: 'Online Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M2.5 9h13M9 2.5C7 5 6 7 6 9s1 4 3 6.5M9 2.5C11 5 12 7 12 9s-1 4-3 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
            ),
        },
        {
            id: 'hybrid', label: 'Hybrid Mode',
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-emerald-500 transition-colors" aria-hidden="true">
                    <circle cx="7" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                    <circle cx="11" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1"/>
                </svg>
            ),
        },
    ];

    const stepTitle = step === 'course' ? 'Select Your Course' : 'Select Course Mode';

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Select NEET Exam Type"
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-200/60 dark:border-emerald-800/40 overflow-hidden"
                style={{ animation: 'cbseModalIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-b border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-center gap-2.5">
                        {step === 'mode' && (
                            <button
                                onClick={() => setStep('course')}
                                className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors mr-0.5"
                                aria-label="Back"
                            >
                                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                                    <path d="M7.5 2L4 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
                                <path d="M12 21.5C12 21.5 4 16.5 4 9.5C4 6.5 6.5 4 9.5 4C11.5 4 12 5.5 12 5.5C12 5.5 12.5 4 14.5 4C17.5 4 20 6.5 20 9.5C20 16.5 12 21.5 12 21.5Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#10B981" fillOpacity="0.1"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">NEET</p>
                            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight">{stepTitle}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
                    {step === 'course' && (
                        <div className="slide-up flex flex-col gap-2">
                            {NEET_OPTIONS.map((opt, i) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleCourseClick(opt.id)}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    className={cn(
                                        "streams-enter flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-bold text-[13px] w-full text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]",
                                        opt.color
                                    )}
                                >
                                    {opt.icon}
                                    <span>{opt.label}</span>
                                    <ArrowRight className="ml-auto w-4 h-4 opacity-50 shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'mode' && (
                        <div className="slide-up flex flex-col gap-2 mt-1">
                            {NEET_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeClick(mode.id)}
                                    className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[13px] text-left transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/60 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
                                >
                                    {mode.icon}
                                    <span>{mode.label}</span>
                                    <ArrowRight className="ml-auto w-4 h-4 opacity-50 shrink-0 group-hover:text-emerald-500 transition-colors" />
                                </button>
                            ))}
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
                    <div className="relative bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-[0_14px_38px_-6px_rgba(11,40,88,0.08),0_2px_8px_-2px_rgba(11,40,88,0.03)] p-3.5 sm:p-4 md:p-5 overflow-hidden">
                        
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
                                            "group relative flex items-center justify-between rounded-[14px] border shadow-[0_4px_14px_-3px_rgba(11,40,88,0.06),0_1px_3px_rgba(11,40,88,0.03)]",
                                            "hover:shadow-[0_10px_24px_-4px_rgba(11,40,88,0.13)] transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]",
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
                                            <h3 className="text-[12px] min-[360px]:text-[13px] sm:text-[14px] lg:text-[13px] min-[1150px]:text-[14px] xl:text-[15px] font-black text-[#0B2858] dark:text-white uppercase tracking-tight leading-tight whitespace-nowrap overflow-visible group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-[10px] min-[360px]:text-[10.5px] sm:text-[11px] lg:text-[10px] min-[1150px]:text-[10.5px] xl:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-tight">
                                                {course.subtitle}
                                            </p>
                                        </div>

                                        {/* Right: Arrow Symbol Only (No Background) */}
                                        <div className="relative z-10 flex items-center justify-center shrink-0 ml-1.5 sm:ml-2 text-[#0B2858] dark:text-blue-300 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                                            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 stroke-[2.2] group-hover:translate-x-1 transition-transform duration-200" />
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
