'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
    BookOpen, 
    Check, 
    Calendar, 
    MapPin, 
    ArrowLeft, 
    ChevronDown, 
    Sparkles, 
    ShieldCheck, 
    Phone, 
    GraduationCap,
    Clock,
    Award,
    CheckCircle2,
    Users,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder } from '@/app/actions/forms';

// ── Course Catalog Data ────────────────────────────────────────────────
interface AboutSection {
    id: string;
    title: string;
    illustrationType: 'concept' | 'material' | 'test' | 'doubt';
    points: string[];
}

interface CourseDetailData {
    slug: string;
    title: string;
    classMeta: string;
    durationLabel: string;
    subjects: string;
    aboutSections: AboutSection[];
    feeAnnual: number;
    feeLumpSum: number;
    installment1: number;
    installment2: number;
    startDates: string[];
}

const COURSES_CATALOG: Record<string, CourseDetailData> = {
    'class-9': {
        slug: 'class-9',
        title: 'Class 9 CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Maths, Science, English, Social Studies',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced systems.',
                    'Expert-Led Lectures: 90-mins sessions aligned with the exam pattern by experienced faculty.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Concept-driven exercises for speed and accuracy improvement.',
                    'Topic-wise Booklets: Multi-level exercises, including PYQs and brain-teasers.',
                    'GRP Sheets: Guided Revision Practice sheets post-course completion.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: On current topics for ongoing assessment.',
                    'Cumulative Tests: Periodic syllabus review to identify learning gaps.',
                    'Major Tests: Full-length tests aligned with CBSE board pattern with in-depth analytics.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: One-on-one sessions with senior faculty mentors after lectures.',
                    'Faculty Mentorship: Continuous guidance and tracking to ensure zero concept backlogs.',
                    'Remedial Practice: Customized problem sheets targeting challenging chapters and topics.',
                ],
            },
        ],
        feeAnnual: 39999,
        feeLumpSum: 39999,
        installment1: 39999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-10': {
        slug: 'class-10',
        title: 'Class 10 CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Maths, Science, English, Social Studies',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced digital whiteboards.',
                    'Expert-Led Lectures: 90-mins comprehensive sessions targeting 95%+ in CBSE Boards.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Concept-driven exercises for speed and accuracy improvement.',
                    'Topic-wise Booklets: Last 10 years solved CBSE board papers (PYQs) & exemplar drills.',
                    'GRP Sheets: Guided Revision Practice sheets post-course completion.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: On current topics for ongoing assessment.',
                    'Cumulative Tests: Periodic syllabus review to identify and plug learning gaps.',
                    'Pre-Board Simulations: Real exam environment test series evaluated strictly on CBSE marking schemes.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: One-on-one sessions with senior faculty mentors after lectures.',
                    'Faculty Mentorship: Continuous guidance and tracking to ensure zero concept backlogs.',
                    'Remedial Practice: Customized problem sheets targeting challenging chapters and topics.',
                ],
            },
        ],
        feeAnnual: 39999,
        feeLumpSum: 39999,
        installment1: 39999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-11': {
        slug: 'class-11',
        title: 'Class 11 CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Physics, Chemistry, Maths / Biology, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced smart audio-visual systems.',
                    'Expert-Led Lectures: Rigorous theoretical foundations integrated with competitive entrance depth.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Concept-driven exercises for speed and accuracy improvement.',
                    'Topic-wise Booklets: 3-tier graded problem sets from board fundamentals to advanced application.',
                    'GRP Sheets: Guided Revision Practice sheets post-course completion.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Chapter-wise tests for continuous concept tracking.',
                    'Cumulative Tests: Periodic review exams measuring time management and accuracy.',
                    'Major Tests: Comprehensive simulated tests with national percentile and diagnostic error analysis.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Full-time faculty available for instant conceptual doubt resolution.',
                    'Academic Mentorship: One-on-one sessions balancing school exams and foundation preparation.',
                    'Remedial Practice: Customized problem sets reinforcing difficult mathematical and scientific concepts.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-12': {
        slug: 'class-12',
        title: 'Class 12 CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Physics, Chemistry, Maths / Biology, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced systems.',
                    'Expert-Led Lectures: Intensive board-focused sessions covering 100% NCERT theory and derivations.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Concept-driven exercises for speed and accuracy improvement.',
                    'Topic-wise Booklets: Exhaustive 10-year board paper question bank and quick formula handbooks.',
                    'GRP Sheets: Guided Revision Practice sheets post-course completion.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: On current topics for ongoing assessment.',
                    'Cumulative Tests: Periodic syllabus review to identify learning gaps.',
                    'Pre-Board Simulations: Full-length mock board tests with detailed scoring feedback and error analysis.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Immediate post-lecture faculty sessions for zero backlog.',
                    'Answer Presentation Mentorship: Special guidance from veteran examiners to maximize board marks.',
                    'Remedial Practice: Targeted revision sets for numericals, reactions, and lengthy derivations.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-11-science': {
        slug: 'class-11-science',
        title: 'Class 11 Science CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Physics, Chemistry, Maths / Biology, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced smart audio-visual systems.',
                    'Expert-Led Lectures: Rigorous theoretical foundations integrated with competitive entrance depth.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Concept-driven exercises for speed and accuracy improvement.',
                    'Topic-wise Booklets: 3-tier graded problem sets from board fundamentals to advanced application.',
                    'GRP Sheets: Guided Revision Practice sheets post-course completion.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Chapter-wise tests for continuous concept tracking.',
                    'Cumulative Tests: Periodic review exams measuring time management and accuracy.',
                    'Major Tests: Comprehensive simulated tests with national percentile and diagnostic error analysis.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Full-time faculty available for instant conceptual doubt resolution.',
                    'Academic Mentorship: One-on-one sessions balancing school exams and foundation preparation.',
                    'Remedial Practice: Customized problem sets reinforcing difficult mathematical and scientific concepts.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-11-commerce': {
        slug: 'class-11-commerce',
        title: 'Class 11 Commerce CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Accountancy, Business Studies, Economics, English / Maths',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with interactive multimedia systems.',
                    'Expert-Led Lectures: Real-world business cases, ledger mechanics, and macroeconomics analysis.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Practical problem drills for financial accounting balance sheets and journals.',
                    'Topic-wise Booklets: NCERT & reference exemplar problem sets graded by difficulty.',
                    'GRP Sheets: Guided Revision Practice sheets for quarterly and annual exams.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Subject-wise objective and subjective tests aligned with CBSE guidelines.',
                    'Cumulative Tests: Terminal exam practice simulating actual school board testing patterns.',
                    'Major Tests: Comprehensive diagnostic evaluations with step-marking feedback.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: On-desk faculty available for accounting entries and numerical doubts.',
                    'Academic Mentorship: Career counseling for CUET, CA Foundation, and commerce degrees.',
                    'Remedial Practice: Targeted worksheets for complex economic curves and ledger balancing.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-11-arts': {
        slug: 'class-11-arts',
        title: 'Class 11 Arts CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'History, Political Science, Geography, Economics, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Spacious lecture rooms with visual timeline and cartographic projection tools.',
                    'Expert-Led Lectures: In-depth analytical discussions linking historical events with contemporary politics.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Source-based questions, map-work exercises, and data interpretation sheets.',
                    'Topic-wise Booklets: High-scoring essay frameworks and structured chapter summaries.',
                    'GRP Sheets: Guided Revision Practice booklets for mid-term and annual exams.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Chapter-wise tests emphasizing analytical and evaluative questions.',
                    'Cumulative Tests: Periodic exam series assessing answer presentation and time management.',
                    'Major Tests: Full-length CBSE pattern mock tests with detailed subjective grading.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: One-on-one sessions for answer refinement and theoretical queries.',
                    'Academic Mentorship: Strategic planning for CUET humanities preparation and top universities.',
                    'Remedial Practice: Writing clinics to improve flow, vocabulary, and thesis arguments.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-12-science': {
        slug: 'class-12-science',
        title: 'Class 12 Science CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Physics, Chemistry, Maths / Biology, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Air-conditioned, spacious lecture halls with advanced systems.',
                    'Expert-Led Lectures: Intensive board-focused sessions covering 100% NCERT theory and derivations.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Daily question sets designed to master application, formulas, and diagrams.',
                    'Topic-wise Booklets: Last 10 years solved CBSE board papers (PYQs) & exemplar drills.',
                    'GRP Sheets: Comprehensive final revision modules and formula handbooks.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Chapter-wise subjective tests strictly mirroring CBSE marking schemes.',
                    'Cumulative Tests: Complete syllabus revision cycles ahead of board pre-boards.',
                    'Pre-Board Simulations: Real exam environment test series evaluated strictly on CBSE marking schemes.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Immediate post-lecture faculty sessions for zero backlog.',
                    'Answer Presentation Mentorship: Special guidance from veteran examiners to maximize board marks.',
                    'Remedial Practice: Targeted revision sets for numericals, reactions, and lengthy derivations.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-12-commerce': {
        slug: 'class-12-commerce',
        title: 'Class 12 Commerce CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'Accountancy, Business Studies, Economics, English / Maths',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: Modern interactive lecture halls optimized for commerce and calculations.',
                    'Expert-Led Lectures: Partnership accounts, company accounts, macroeconomic policies, and BST case studies.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Target drills for cash flow statements, ratio analysis, and national income.',
                    'Topic-wise Booklets: 10-year solved CBSE questions, model papers, and presentation blueprints.',
                    'GRP Sheets: Quick recap booklets and key formulas before terminal and board exams.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Weekly timed chapter exams for accurate numerical and theoretical mastery.',
                    'Pre-Board Simulations: Full-length 80-mark mock papers with strict step-wise evaluation.',
                    'Major Tests: All-India rank benchmarking with comprehensive diagnostic breakdown.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Dedicated faculty support for complex ledger accounts and BST cases.',
                    'Examiner Mentorship: Answer presentation strategies to avoid common board marking deductions.',
                    'Remedial Practice: Step-by-step problem sessions for students aiming for 95%+ in boards.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
    'class-12-arts': {
        slug: 'class-12-arts',
        title: 'Class 12 Arts CBSE — Session 2026–27',
        classMeta: 'Course Duration | 1 Year',
        durationLabel: '1 Year',
        subjects: 'History, Political Science, Geography, Economics, English',
        aboutSections: [
            {
                id: 'concept-building',
                title: 'Concept Building',
                illustrationType: 'concept',
                points: [
                    'Modern Classrooms: State-of-the-art multimedia lecture spaces for humanities learning.',
                    'Expert-Led Lectures: Comprehensive syllabus coverage with deep source analysis and critical historiography.',
                ],
            },
            {
                id: 'smart-study-material',
                title: 'Smart Study Material',
                illustrationType: 'material',
                points: [
                    'RACE Sheets: Source analysis exercises, map plotting drills, and timeline flowcharts.',
                    'Topic-wise Booklets: CBSE board PYQs categorized by weightage with model answers.',
                    'GRP Sheets: Final sprint revision booklets summarizing all key events, treaties, and concepts.',
                ],
            },
            {
                id: 'intelligent-test-system',
                title: 'Intelligent Test System',
                illustrationType: 'test',
                points: [
                    'Unit Tests: Regular subjective tests to build speed and stamina for long-answer writing.',
                    'Pre-Board Simulations: Complete 3-hour board simulations evaluated on CBSE marking guidelines.',
                    'Major Tests: In-depth personalized feedback on argument structuring and conclusion quality.',
                ],
            },
            {
                id: 'doubt-resolution',
                title: 'Doubt Resolution Desks',
                illustrationType: 'doubt',
                points: [
                    'Daily Doubt Counters: Full-time faculty desks for individual question reviews.',
                    'CUET & Board Guidance: Dedicated mentorship bridging CBSE Class 12 and university entrances.',
                    'Remedial Practice: Specialized sessions on high-weightage topics and map evaluation.',
                ],
            },
        ],
        feeAnnual: 49999,
        feeLumpSum: 49999,
        installment1: 49999,
        installment2: 0,
        startDates: ['06 April, 2026', '12 May, 2026'],
    },
};

// ── Mode-wise Fee Calculator (Including GST) ───────────────────────────
// Class 9 & 10: Online ₹29,999 | Offline ₹39,999 | Hybrid ₹49,999
// Class 11 & 12: Online ₹39,999 | Offline ₹49,999 | Hybrid ₹59,999
export function calculateCourseFee(slugOrClass: string, mode: string = 'Offline Mode'): number {
    const s = slugOrClass.toLowerCase();
    const isJunior = s.includes('9') || s.includes('10');
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

// ── 4 IDL Learning Branches ────────────────────────────────────────────
const BRANCHES = [
    { id: 'mukherjee-nagar', label: 'Mukherjee Nagar, Delhi', address: 'Commercial Complex, Mukherjee Nagar, Delhi-110009' },
    { id: 'mangol-puri', label: 'Mangol Puri, Delhi', address: 'Main Road, Mangol Puri, Delhi-110083' },
    { id: 'budh-vihar', label: 'Budh Vihar, Delhi', address: 'Phase 1, Budh Vihar, Delhi-110086' },
    { id: 'krishan-vihar', label: 'Krishan Vihar, Delhi', address: 'Main Kanjhawala Road, Krishan Vihar, Delhi-110086' },
];

// ── Illustrations matching user reference screenshot ───────────────────
function ConceptBuildingIllustration() {
    return (
        <svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[110px]">
            {/* Back light blue card */}
            <rect x="42" y="28" width="58" height="38" rx="6" fill="#93C5FD" fillOpacity="0.75" />
            {/* Middle teal card */}
            <rect x="32" y="18" width="58" height="38" rx="6" fill="#0D9488" />
            <rect x="38" y="24" width="20" height="4" rx="2" fill="white" fillOpacity="0.8" />
            {/* Front royal blue card */}
            <rect x="14" y="6" width="58" height="38" rx="6" fill="#2563EB" />
            <circle cx="23" cy="15" r="3.5" fill="#FCD34D" />
            <rect x="32" y="13" width="28" height="5" rx="2.5" fill="white" />
            {/* Green connection flow lines and arrow heads */}
            <path d="M14 26H5V58H30" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M27 55L31 58L27 61" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 42H30" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M27 39L31 42L27 45" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SmartStudyMaterialIllustration() {
    return (
        <svg width="124" height="96" viewBox="0 0 124 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[120px]">
            {/* Blue device outer body */}
            <rect x="8" y="20" width="108" height="66" rx="14" fill="#3B82F6" />
            <rect x="12" y="24" width="100" height="58" rx="10" fill="white" />
            {/* Quizzes card (Blue) */}
            <rect x="18" y="30" width="42" height="46" rx="6" fill="#2563EB" />
            <text x="39" y="41" fill="white" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">Quizzes</text>
            <rect x="25" y="47" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
            <rect x="37" y="47" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
            <rect x="25" y="58" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
            <rect x="37" y="58" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
            {/* Revision Byte card (Yellow) */}
            <rect x="64" y="30" width="42" height="30" rx="6" fill="#FBBF24" />
            <text x="85" y="41" fill="#78350F" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">Revision</text>
            <text x="85" y="49" fill="#78350F" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">Byte</text>
            <rect x="70" y="53" width="30" height="2" rx="1" fill="#78350F" fillOpacity="0.4" />
            {/* Homework card (Emerald) */}
            <rect x="26" y="66" width="64" height="15" rx="5" fill="#10B981" />
            <text x="58" y="77" fill="white" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">Home work</text>
        </svg>
    );
}

function IntelligentTestSystemIllustration() {
    return (
        <svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[110px]">
            {/* Yellow Sparkle at top */}
            <path d="M16 12L17.5 17L22.5 18.5L17.5 20L16 25L14.5 20L9.5 18.5L14.5 17L16 12Z" fill="#F59E0B" />
            {/* Blue device casing */}
            <rect x="14" y="24" width="84" height="54" rx="12" fill="#2563EB" />
            <rect x="18" y="28" width="76" height="46" rx="8" fill="white" />
            {/* Slider / toggle */}
            <rect x="25" y="36" width="30" height="14" rx="7" fill="#E2E8F0" />
            <circle cx="32" cy="43" r="5" fill="#3B82F6" />
            {/* Test progress score circle */}
            <circle cx="70" cy="48" r="14" stroke="#E2E8F0" strokeWidth="3" />
            <circle cx="70" cy="48" r="14" stroke="#10B981" strokeWidth="3" strokeDasharray="60 30" strokeLinecap="round" />
            <text x="70" y="51" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">95%</text>
            {/* Check lines */}
            <path d="M25 58H45" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function DoubtResolutionIllustration() {
    return (
        <svg width="112" height="96" viewBox="0 0 112 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-[110px]">
            {/* Sparkle */}
            <path d="M96 14L97.5 18L101.5 19.5L97.5 21L96 25L94.5 21L90.5 19.5L94.5 18L96 14Z" fill="#6366F1" />
            {/* Mentor Bubble */}
            <rect x="12" y="18" width="50" height="36" rx="10" fill="#4F46E5" />
            <circle cx="26" cy="33" r="5" fill="#C7D2FE" />
            <rect x="35" y="31" width="18" height="4" rx="2" fill="white" />
            {/* Student Bubble with Checkmark */}
            <rect x="46" y="38" width="52" height="38" rx="10" fill="#10B981" />
            <circle cx="61" cy="54" r="5" fill="#A7F3D0" />
            <path d="M72 54L75 57L83 49" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function CourseDetailClient({ slug }: { slug: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    // Normalized slug
    const normalizedSlug = (slug || 'class-9').toLowerCase();
    const course = COURSES_CATALOG[normalizedSlug] || COURSES_CATALOG['class-9'];

    // Read Mode from search params or default to student's selection
    const modeParam = searchParams.get('mode');
    const [selectedMode, setSelectedMode] = useState<string>(() => {
        if (modeParam) {
            const lower = modeParam.toLowerCase();
            if (lower.includes('online')) return 'Online Mode';
            if (lower.includes('hybrid')) return 'Hybrid Mode';
            return 'Offline Mode';
        }
        return 'Offline Mode';
    });

    // Dynamically calculate course fee based on class and mode (Including GST)
    const currentFee = calculateCourseFee(course.slug, selectedMode);
    const baseFee = Math.round(currentFee / 1.18);
    const gstFee = currentFee - baseFee;
    const [feeStructureOpen, setFeeStructureOpen] = useState(false);

    // Branch selection (defaults to search param or Mukherjee Nagar)
    const centerParam = searchParams.get('center') || 'Mukherjee Nagar';
    const [selectedBranch, setSelectedBranch] = useState<string>(() => {
        const found = BRANCHES.find(b => b.label.toLowerCase().includes(centerParam.toLowerCase()) || b.id === centerParam.toLowerCase());
        return found ? found.label : BRANCHES[0].label;
    });

    // Preferences
    const [selectedLanguage, setSelectedLanguage] = useState<'English'>('English');
    const [selectedStartDate, setSelectedStartDate] = useState<string>(course.startDates[0]);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentSuccessData, setPaymentSuccessData] = useState<{
        paymentId: string;
        orderId?: string;
        amount: number;
    } | null>(null);

    // Sync start date on course change
    useEffect(() => {
        if (course.startDates.length > 0) {
            setSelectedStartDate(course.startDates[0]);
        }
    }, [course]);

    // Ensure Razorpay script is ready
    const ensureRazorpayLoaded = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Handle "Enroll Now" click
    const handleEnrollNow = async () => {
        // Step 1: Check if student is logged in
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to proceed with enrollment and fee payment.",
            });
            const currentFullUrl = `${pathname}?${searchParams.toString()}`;
            router.push(`/login?redirect=${encodeURIComponent(currentFullUrl)}`);
            return;
        }

        // Step 2: Student is logged in -> Trigger Razorpay Payment Gateway
        try {
            setIsProcessingPayment(true);
            const scriptLoaded = await ensureRazorpayLoaded();
            if (!scriptLoaded) {
                toast({
                    variant: "destructive",
                    title: "Payment Error",
                    description: "Unable to load Razorpay payment service. Please check your internet connection.",
                });
                setIsProcessingPayment(false);
                return;
            }

            // Create Order on Server with dynamically computed mode fee
            const amountInPaise = currentFee * 100;
            const orderResult = await createRazorpayOrder({ amount: amountInPaise, currency: 'INR' });

            if (!orderResult.success || !orderResult.orderId) {
                toast({
                    variant: "destructive",
                    title: "Order Creation Failed",
                    description: orderResult.message || "Failed to create payment order. Please try again.",
                });
                setIsProcessingPayment(false);
                return;
            }

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RKEYtYbYMDeMpw';

            const options = {
                key: razorpayKey,
                amount: orderResult.amount,
                currency: orderResult.currency || 'INR',
                name: 'IDL Education',
                description: `${course.title} (${selectedMode}) - ${selectedBranch}`,
                order_id: orderResult.orderId,
                prefill: {
                    name: user.name || (user as any).displayName || 'Student',
                    email: user.email || '',
                    contact: (user as any).phoneNumber || '',
                },
                theme: {
                    color: '#1D4ED8',
                },
                handler: function (response: any) {
                    setIsProcessingPayment(false);
                    setPaymentSuccessData({
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        amount: currentFee,
                    });
                    toast({
                        title: "Payment Successful!",
                        description: `Your enrollment for ${course.title} is confirmed. Payment ID: ${response.razorpay_payment_id}`,
                    });
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessingPayment(false);
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setIsProcessingPayment(false);
                toast({
                    variant: "destructive",
                    title: "Payment Failed",
                    description: response.error?.description || "Transaction was not completed.",
                });
            });
            rzp.open();
        } catch (error: any) {
            console.error("Payment error:", error);
            setIsProcessingPayment(false);
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: error?.message || "An unexpected error occurred during checkout.",
            });
        }
    };

    // Helper for rendering section illustrations
    const renderIllustration = (type: AboutSection['illustrationType']) => {
        switch (type) {
            case 'concept':
                return <ConceptBuildingIllustration />;
            case 'material':
                return <SmartStudyMaterialIllustration />;
            case 'test':
                return <IntelligentTestSystemIllustration />;
            case 'doubt':
                return <DoubtResolutionIllustration />;
            default:
                return <ConceptBuildingIllustration />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 py-5 sm:py-8">
            <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back to Courses Link */}
                <div className="mb-5">
                    <Link 
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1D4ED8] dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to All Courses</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
                    
                    {/* ── LEFT COLUMN: Course Header, Subjects & About ── */}
                    <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 space-y-6">
                        
                        {/* 1. Course Header */}
                        <div>
                            {/* Dynamic Mode Badge */}
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#10B981] text-white text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider shadow-xs mb-2.5">
                                {selectedMode.toUpperCase()}
                            </div>

                            {/* Main Heading: Clear, refined weight */}
                            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                                {course.title}
                            </h1>

                            {/* Secondary Information: Course Duration | 1 Year */}
                            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] font-medium">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Course Duration</span>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <span className="text-slate-700 dark:text-slate-300 font-semibold">{course.durationLabel}</span>
                            </div>
                        </div>

                        {/* 2. Subjects Card - Full Width & Cleanly Integrated */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(11,40,88,0.03)] flex items-center gap-4 w-full">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                <BookOpen className="w-5 h-5 stroke-[1.75]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Subjects
                                </span>
                                <p className="text-[14px] sm:text-[15px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                                    {course.subjects}
                                </p>
                            </div>
                        </div>

                        {/* 3. About the Course Section (Exact style from Reference Screenshot) */}
                        <div className="pt-2">
                            {/* Section Heading matching screenshot */}
                            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                                About the Course
                            </h2>

                            {/* Single Large White Card enclosing all sections with dashed dividers */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[24px] p-6 sm:p-8 shadow-[0_2px_12px_rgba(11,40,88,0.03)]">
                                {course.aboutSections.map((sec, idx) => (
                                    <React.Fragment key={sec.id}>
                                        {idx > 0 && (
                                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-6" />
                                        )}
                                        <div className="flex items-center justify-between gap-4 sm:gap-6">
                                            <div className="flex-1 min-w-0 pr-1">
                                                <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white mb-3">
                                                    {sec.title}
                                                </h3>
                                                <ul className="space-y-2.5 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {sec.points.map((pt, pIdx) => {
                                                        const colonIndex = pt.indexOf(': ');
                                                        const label = colonIndex !== -1 ? pt.slice(0, colonIndex + 1) : '';
                                                        const text = colonIndex !== -1 ? pt.slice(colonIndex + 2) : pt;

                                                        return (
                                                            <li key={pIdx} className="flex items-start gap-2.5">
                                                                <span className="text-slate-700 dark:text-slate-300 text-sm leading-none mt-1 shrink-0">•</span>
                                                                <span className="leading-relaxed">
                                                                    {label && <strong className="font-semibold text-slate-800 dark:text-slate-200">{label} </strong>}
                                                                    {text}
                                                                </span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <div className="shrink-0 w-24 sm:w-28 flex items-center justify-center">
                                                {renderIllustration(sec.illustrationType)}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN: Sticky Course Preference & Enrollment Card ── */}
                    <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 lg:sticky lg:top-20">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_2px_16px_rgba(11,40,88,0.04)]">
                            
                            {/* Card Title */}
                            <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#0B1F4B] dark:text-white mb-2.5 tracking-tight">
                                Select your course preference
                            </h3>

                            {/* Preference Options Box */}
                            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-3 bg-white dark:bg-slate-900">
                                

                                {/* 1. SELECT LANGUAGE */}
                                <div>
                                    <span className="text-[12px] sm:text-[12.5px] font-bold text-[#0B1F4B] dark:text-slate-200 block mb-1.5">
                                        Language
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            id="select-lang-english"
                                            onClick={() => setSelectedLanguage('English')}
                                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all bg-[#E0F2FE] border border-[#38BDF8] text-[#0369A1] shadow-xs cursor-pointer"
                                        >
                                            English
                                        </button>

                                        <button
                                            type="button"
                                            id="select-lang-hindi"
                                            disabled
                                            className="px-4 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                                        >
                                            Hindi
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800" />

                                {/* 2. SELECT START DATE */}
                                <div>
                                    <span className="text-[12px] sm:text-[12.5px] font-bold text-[#0B1F4B] dark:text-slate-200 block mb-1.5">
                                        Start Date
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {course.startDates.map((date) => (
                                            <button
                                                key={date}
                                                type="button"
                                                onClick={() => setSelectedStartDate(date)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                    selectedStartDate === date
                                                        ? 'bg-[#E0F2FE] border border-[#38BDF8] text-[#0369A1] shadow-xs'
                                                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {date}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800" />

                                {/* 3. DIRECT BRANCH DISPLAY WITH INLINE CHANGE OPTION */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[12px] sm:text-[12.5px] font-bold text-[#0B1F4B] dark:text-slate-200">
                                            Preferred Branch
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    type="button"
                                                    id="change-branch-link"
                                                    className="text-[11.5px] font-semibold text-[#1D4ED8] dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                                                >
                                                    <span>Change</span>
                                                    <ChevronDown className="w-3 h-3 text-[#1D4ED8] dark:text-blue-400" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent 
                                                align="end" 
                                                className="w-[calc(100vw-3rem)] sm:w-[300px] max-w-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-1.5 shadow-xl rounded-xl z-50"
                                            >
                                                <div className="px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
                                                    Change Learning Branch
                                                </div>
                                                {BRANCHES.map((b) => (
                                                    <DropdownMenuItem
                                                        key={b.id}
                                                        onClick={() => setSelectedBranch(b.label)}
                                                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-xs my-0.5 ${
                                                            selectedBranch === b.label 
                                                                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold' 
                                                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="font-semibold text-xs">{b.label}</div>
                                                            <div className="text-[10px] text-slate-400 font-normal">{b.address}</div>
                                                        </div>
                                                        {selectedBranch === b.label && (
                                                            <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 ml-2" />
                                                        )}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                                                <MapPin className="w-2.5 h-2.5 text-[#2563EB]" />
                                            </span>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                {selectedBranch}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                                            Selected
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Course Fee & Fee Structure */}
                            <div className="mt-3.5 sm:mt-4 space-y-2">
                                <div className="flex items-baseline justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className="text-[17px] sm:text-[18px] lg:text-[20px] xl:text-[21px] font-bold text-[#0B1F4B] dark:text-white leading-tight whitespace-nowrap">
                                            Course Fee
                                        </h4>
                                        <button
                                            type="button"
                                            id="view-fee-structure-btn"
                                            onClick={() => setFeeStructureOpen(!feeStructureOpen)}
                                            className="mt-0.5 text-[12px] sm:text-[13px] lg:text-[13.5px] font-medium text-[#155EEF] dark:text-blue-400 hover:text-[#0052CC] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                                        >
                                            <span className="underline underline-offset-2">View fee structure</span>
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${feeStructureOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[22px] sm:text-[24px] lg:text-[26px] xl:text-[28px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-none whitespace-nowrap">
                                            ₹{currentFee.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Expandable Fee Breakdown: Base Fee, GST (18%), and Total Fee */}
                                {feeStructureOpen && (
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-1.5 text-xs transition-all animate-in fade-in duration-200">
                                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                            <span className="font-medium">Course Fee:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">₹{baseFee.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                            <span className="font-medium">GST (18% included):</span>
                                            <span className="font-bold text-slate-900 dark:text-white">₹{gstFee.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                            <span>Total Course Fee:</span>
                                            <span className="text-[#155EEF] dark:text-blue-400 font-extrabold text-sm sm:text-base">₹{currentFee.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="text-[10px] sm:text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                                            ✓ Single One-Time Payment • No Installments • No Hidden Charges
                                        </div>
                                    </div>
                                )}

                                {/* Enroll Now Button - Compact, sleek & premium */}
                                <button
                                    type="button"
                                    id="enroll-now-button"
                                    disabled={isProcessingPayment}
                                    onClick={handleEnrollNow}
                                    className="w-full h-[44px] sm:h-[46px] lg:h-[48px] bg-[#155EEF] hover:bg-[#0052CC] text-white font-semibold rounded-full text-[14.5px] sm:text-[15px] lg:text-[15.5px] shadow-xs hover:shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            <span>Opening Payment Gateway...</span>
                                        </>
                                    ) : (
                                        <span>Enroll Now</span>
                                    )}
                                </button>
                            </div>

                            {/* Counselling Area - Subtle Support Row */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                                <a 
                                    href="tel:+918860040010"
                                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-normal text-slate-400 hover:text-[#155EEF] dark:text-slate-500 transition-colors"
                                >
                                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>Need Admission Counseling? Call +91 8860040010</span>
                                </a>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* ── PAYMENT SUCCESS CONFIRMATION MODAL ── */}
            {paymentSuccessData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-emerald-200">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3.5">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                            Enrollment Successful!
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Thank you for enrolling with IDL Education. Your payment has been received and your batch seat is reserved.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 text-xs text-left space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Course:</span>
                                <strong className="text-slate-900 dark:text-white font-bold">{course.title}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Branch:</span>
                                <strong className="text-slate-900 dark:text-white font-bold">{selectedBranch}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Batch Start:</span>
                                <strong className="text-slate-900 dark:text-white font-bold">{selectedStartDate}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Amount Paid:</span>
                                <strong className="text-emerald-600 font-bold">₹{paymentSuccessData.amount.toLocaleString('en-IN')}</strong>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                                <span className="text-slate-500">Payment ID:</span>
                                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{paymentSuccessData.paymentId}</span>
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <Button 
                                onClick={() => setPaymentSuccessData(null)}
                                variant="outline"
                                className="flex-1 rounded-xl text-xs font-semibold cursor-pointer"
                            >
                                Close
                            </Button>
                            <Link href="/student/dashboard" className="flex-1">
                                <Button className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-semibold cursor-pointer">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
