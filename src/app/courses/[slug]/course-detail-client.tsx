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
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { createRazorpayOrder } from '@/app/actions/forms';

// ── Course Catalog Data ────────────────────────────────────────────────
interface CourseDetailData {
    slug: string;
    programBadge: string;
    title: string;
    classMeta: string;
    subjects: string;
    offerings: string[];
    conceptPoints: string[];
    doubtPoints: string[];
    testPoints: string[];
    feeAnnual: number;
    feeLumpSum: number;
    installment1: number;
    installment2: number;
    startDates: string[];
}

const COURSES_CATALOG: Record<string, CourseDetailData> = {
    'class-9': {
        slug: 'class-9',
        programBadge: 'CLASSROOM PROGRAM',
        title: 'PRE-NURTURE CLASS IX',
        classMeta: 'Class 9 • 1 Year',
        subjects: 'Mental Ability, Physics, Social Science, Biology, Chemistry, English, Maths',
        offerings: [
            "Ideal for students preparing for competitive exams with a structured yearlong preparation plan.",
            "Classroom Sessions by experienced IDL Education expert faculty.",
            "Mentor Guidance & Performance Tracking throughout the academic session.",
            "Printed study material, DPPs, and comprehensive All-India test series.",
        ],
        conceptPoints: [
            "Air-conditioned, modern lecture halls with smart audio-visual teaching systems.",
            "Deep conceptual foundation building to ensure effortless understanding of school & Olympiad topics.",
        ],
        doubtPoints: [
            "Dedicated one-on-one doubt removal desks after every classroom session.",
            "Continuous faculty guidance so no student is left behind on any chapter.",
        ],
        testPoints: [
            "Weekly minor tests, periodic major exams & full-length mock tests on latest CBSE pattern.",
            "In-depth performance analytics reports shared with students and parents.",
        ],
        feeAnnual: 36000,
        feeLumpSum: 32000,
        installment1: 18000,
        installment2: 14000,
        startDates: ['06 April, 2026', '21 April, 2026', '12 May, 2026'],
    },
    'class-10': {
        slug: 'class-10',
        programBadge: 'CLASSROOM PROGRAM',
        title: 'PRE-NURTURE CLASS X',
        classMeta: 'Class 10 • 1 Year',
        subjects: 'Mental Ability, Physics, Social Science, Biology, Chemistry, English, Maths, IT',
        offerings: [
            "Targeted 95%+ CBSE Board strategy with rigorous concept coverage.",
            "Classroom Sessions by veteran IDL Education top faculty with proven board results.",
            "Previous 10 Years Question Papers (PYQs) solving drills & marking scheme guidance.",
            "Mentor Guidance & Performance Tracking throughout the session.",
        ],
        conceptPoints: [
            "100% NCERT line-by-line coverage combined with higher-order application problems.",
            "Modern air-conditioned classrooms with interactive digital whiteboards.",
        ],
        doubtPoints: [
            "Personalized daily doubt clearance sessions with senior subject experts.",
            "Special answer-writing masterclasses to maximize board theory presentation marks.",
        ],
        testPoints: [
            "Real exam environment pre-board simulation series with detailed paper evaluation.",
            "Personalized diagnostic reports identifying weak areas with customized remedial sheets.",
        ],
        feeAnnual: 40000,
        feeLumpSum: 36000,
        installment1: 20000,
        installment2: 16000,
        startDates: ['06 April, 2026', '21 April, 2026', '12 May, 2026'],
    },
    'class-11': {
        slug: 'class-11',
        programBadge: 'CLASSROOM PROGRAM',
        title: 'CAREER FOUNDATION CLASS XI',
        classMeta: 'Class 11 • 2 Years',
        subjects: 'Physics, Chemistry, Mathematics / Biology, English (or Accounts, Economics, BST)',
        offerings: [
            "Seamless bridge from Class 10 to higher secondary CBSE & competitive foundation.",
            "Integrated curriculum preparing students simultaneously for CBSE Boards & Entrance (JEE/NEET/CUET).",
            "Classroom Sessions by veteran faculties from top educational hubs.",
            "Mentor Guidance & Performance Tracking throughout the session.",
        ],
        conceptPoints: [
            "In-depth physical and mathematical derivations with real-world applications.",
            "Graded problem sheets taking students from basic concepts to advanced problem solving.",
        ],
        doubtPoints: [
            "Dedicated doubt counters with senior professors open throughout center working hours.",
            "One-on-one mentorship sessions to manage board and entrance preparation balance.",
        ],
        testPoints: [
            "Weekly chapter-wise tests and cumulative terminal exams matching CBSE and competitive patterns.",
            "National percentile ranking and time-management analytics for every test.",
        ],
        feeAnnual: 55000,
        feeLumpSum: 49000,
        installment1: 28000,
        installment2: 21000,
        startDates: ['10 April, 2026', '28 April, 2026', '15 May, 2026'],
    },
    'class-12': {
        slug: 'class-12',
        programBadge: 'CLASSROOM PROGRAM',
        title: 'BOARD & ENTRANCE CLASS XII',
        classMeta: 'Class 12 • 1 Year',
        subjects: 'Physics, Chemistry, Mathematics / Biology, English (or Accounts, Economics, BST)',
        offerings: [
            "Complete Class 12 CBSE Board syllabus mastery with comprehensive revision cycles.",
            "High-impact entrance score booster modules for JEE, NEET, and CUET (UG).",
            "Classroom Sessions by veteran IDL Education master teachers.",
            "Mentor Guidance & Performance Tracking throughout the session.",
        ],
        conceptPoints: [
            "Fast-track concept revision and high-yield formula recap booklets.",
            "Comprehensive printed modules with previous board questions and entrance level questions.",
        ],
        doubtPoints: [
            "Immediate doubt clearance during and after lectures by faculty mentors.",
            "Special remedial batches for students needing reinforcement in difficult chapters.",
        ],
        testPoints: [
            "Strict CBSE board pattern mock examinations with step-by-step scoring feedback.",
            "All India Computer Based Test (CBT) series with detailed error analysis.",
        ],
        feeAnnual: 60000,
        feeLumpSum: 54000,
        installment1: 30000,
        installment2: 24000,
        startDates: ['08 April, 2026', '24 April, 2026', '10 May, 2026'],
    },
};

// ── 4 IDL Learning Campuses ────────────────────────────────────────────
const CAMPUSES = [
    { id: 'mukherjee-nagar', label: 'Mukherjee Nagar, Delhi', address: 'Mukherjee Nagar, Delhi-110009' },
    { id: 'mangol-puri', label: 'Mangol Puri, Delhi', address: 'Mangol Puri, Delhi-110083' },
    { id: 'budh-vihar', label: 'Budh Vihar, Delhi', address: 'Budh Vihar, Delhi-110086' },
    { id: 'krishan-vihar', label: 'Krishan Vihar, Delhi', address: 'Krishan Vihar, Delhi-110086' },
];

export function CourseDetailClient({ slug }: { slug: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    // Normalized slug
    const normalizedSlug = (slug || 'class-9').toLowerCase();
    const course = COURSES_CATALOG[normalizedSlug] || COURSES_CATALOG['class-9'];

    // Campus selection (defaults to search param or Mukherjee Nagar)
    const centerParam = searchParams.get('center') || 'Mukherjee Nagar';
    const [selectedCampus, setSelectedCampus] = useState<string>(() => {
        const found = CAMPUSES.find(c => c.label.toLowerCase().includes(centerParam.toLowerCase()) || c.id === centerParam.toLowerCase());
        return found ? found.label : CAMPUSES[0].label;
    });

    // Preferences
    const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hinglish'>('English');
    const [selectedStartDate, setSelectedStartDate] = useState<string>(course.startDates[0]);
    const [feeStructureOpen, setFeeStructureOpen] = useState(false);
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

            // Create Order on Server
            const amountInPaise = course.feeAnnual * 100;
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
                description: `${course.title} Enrollment - ${selectedCampus}`,
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
                        amount: course.feeAnnual,
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

    return (
        <div className="min-h-screen bg-[#F4F8FC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 py-6 sm:py-10">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Back to Courses Link */}
                <div className="mb-6">
                    <Link 
                        href="/courses"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1D4ED8] dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Courses</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* ── LEFT COLUMN: Course Header & Details (Matching Screenshot) ── */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-7">
                        
                        {/* 1. Header Section */}
                        <div>
                            {/* Green Badge: CLASSROOM PROGRAM */}
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#10B981] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs mb-3">
                                {course.programBadge}
                            </div>

                            {/* Main Title: PRE-NURTURE CLASS IX */}
                            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                                {course.title}
                            </h1>

                            {/* Class & Duration Meta */}
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm sm:text-base mt-1.5">
                                {course.classMeta}
                            </p>
                        </div>

                        {/* 2. Subjects Box (Exact Design from Screenshot) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                <BookOpen className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div>
                                <span className="text-[11.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Subjects
                                </span>
                                <p className="text-[13.5px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200 leading-snug">
                                    {course.subjects}
                                </p>
                            </div>
                        </div>

                        {/* 3. Course Offerings (Exact Bullet List from Screenshot) */}
                        <div>
                            <h2 className="text-lg sm:text-[20px] font-black text-[#0B1F4B] dark:text-white mb-3 tracking-tight">
                                Course Offerings
                            </h2>
                            <ul className="space-y-2.5 text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                                {course.offerings.map((offering, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 dark:bg-slate-400 shrink-0 mt-2" />
                                        <span>{offering}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 4. About the Course (Concept Building Cards from Screenshot) */}
                        <div className="pt-2">
                            <h2 className="text-lg sm:text-[20px] font-black text-[#0B1F4B] dark:text-white mb-4 tracking-tight">
                                About the Course
                            </h2>

                            <div className="space-y-4">
                                {/* Card 1: Concept Building */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-2.5">
                                        Concept Building
                                    </h3>
                                    <ul className="space-y-2 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300">
                                        {course.conceptPoints.map((p, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Card 2: Doubt Resolution */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-2.5">
                                        Doubt Resolution Desks
                                    </h3>
                                    <ul className="space-y-2 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300">
                                        {course.doubtPoints.map((p, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Card 3: Test Series & Assessment */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-2.5">
                                        Periodic Testing & Diagnostics
                                    </h3>
                                    <ul className="space-y-2 text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-300">
                                        {course.testPoints.map((p, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ── RIGHT COLUMN: Sticky Course Preference & Enrollment Card ── */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-white dark:bg-slate-900 rounded-[26px] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-[0_12px_36px_rgba(11,40,88,0.06)]">
                            
                            {/* Card Title */}
                            <h3 className="text-[17px] sm:text-[18px] font-black text-[#0B1F4B] dark:text-white mb-5 tracking-tight">
                                Select your course preference
                            </h3>

                            {/* Preference Options Box (Bordered box matching screenshot) */}
                            <div className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900">
                                
                                {/* 1. SELECT LANGUAGE */}
                                <div>
                                    <span className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                                        SELECT LANGUAGE
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {(['English', 'Hinglish'] as const).map((lang) => (
                                            <button
                                                key={lang}
                                                type="button"
                                                onClick={() => setSelectedLanguage(lang)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    selectedLanguage === lang
                                                        ? 'bg-[#E0F2FE] border border-[#38BDF8] text-[#0369A1] shadow-xs'
                                                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-800" />

                                {/* 2. SELECT START DATE */}
                                <div>
                                    <span className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                                        SELECT START DATE
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {course.startDates.map((date) => (
                                            <button
                                                key={date}
                                                type="button"
                                                onClick={() => setSelectedStartDate(date)}
                                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
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

                                {/* 3. SELECT CAMPUS (4 IDL Centers) */}
                                <div>
                                    <span className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                                        SELECT CAMPUS
                                    </span>
                                    <div className="space-y-1.5">
                                        {CAMPUSES.map((campus) => (
                                            <button
                                                key={campus.id}
                                                type="button"
                                                onClick={() => setSelectedCampus(campus.label)}
                                                className={`w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                                                    selectedCampus === campus.label
                                                        ? 'bg-[#E0F2FE] border border-[#38BDF8] text-[#0369A1] shadow-xs'
                                                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <span>{campus.label}</span>
                                                {selectedCampus === campus.label && (
                                                    <Check className="w-3.5 h-3.5 text-[#0369A1] shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Fee Row: Left = Course Fee + View fee structure; Right = ₹Price */}
                            <div className="mt-5 pt-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white block">
                                            Course Fee
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setFeeStructureOpen(!feeStructureOpen)}
                                            className="text-xs font-bold text-[#1D4ED8] dark:text-blue-400 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                                        >
                                            <span>View fee structure</span>
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${feeStructureOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="text-2xl sm:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">
                                        ₹{course.feeAnnual.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                {/* Expandable Fee Structure */}
                                {feeStructureOpen && (
                                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
                                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                            <span>Standard Annual Fee:</span>
                                            <strong className="text-slate-900 dark:text-white">₹{course.feeAnnual.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                                            <span>One-Time Lump Sum:</span>
                                            <strong>₹{course.feeLumpSum.toLocaleString('en-IN')} (Save ₹{(course.feeAnnual - course.feeLumpSum).toLocaleString('en-IN')})</strong>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                                            <span>1st Installment (At Admission):</span>
                                            <strong className="text-slate-800 dark:text-slate-200">₹{course.installment1.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                            <span>2nd Installment (After 60 Days):</span>
                                            <strong className="text-slate-800 dark:text-slate-200">₹{course.installment2.toLocaleString('en-IN')}</strong>
                                        </div>
                                        <div className="pt-1.5 text-[11px] text-amber-700 dark:text-amber-300">
                                            ★ <strong>IDL Scholarship:</strong> Up to 90% fee waiver applicable via admission test.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Authentication Status Banner */}
                            {user ? (
                                <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                                    <span className="flex items-center gap-1.5 font-bold truncate">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="truncate">Logged in: {user.name || user.email}</span>
                                    </span>
                                    <span className="text-[10.5px] uppercase font-extrabold tracking-wider bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-md">
                                        Verified
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-4 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11.5px] text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Student login required before proceeding with online payment.</span>
                                </div>
                            )}

                            {/* Enroll Now Button (Exact Vibrant Blue Button from Screenshot) */}
                            <button
                                type="button"
                                id="enroll-now-button"
                                disabled={isProcessingPayment}
                                onClick={handleEnrollNow}
                                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black py-3.5 px-6 rounded-2xl text-[15px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        <span>Opening Payment Gateway...</span>
                                    </>
                                ) : (
                                    <span>Enroll Now</span>
                                )}
                            </button>

                            {/* Helpline */}
                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                                <a 
                                    href="tel:+919997177141"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400"
                                >
                                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Need Admission Counseling? Call +91 99971 77141</span>
                                </a>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* ── PAYMENT SUCCESS CONFIRMATION MODAL ── */}
            {paymentSuccessData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-emerald-200">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                            Enrollment Successful!
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Thank you for enrolling with IDL Education. Your payment has been received and your batch seat is reserved.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-xs text-left space-y-2 mb-5">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Course:</span>
                                <strong className="text-slate-900 dark:text-white font-bold">{course.title}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Center:</span>
                                <strong className="text-slate-900 dark:text-white font-bold">{selectedCampus}</strong>
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
                                className="flex-1 rounded-xl text-xs font-bold"
                            >
                                Close
                            </Button>
                            <Link href="/student/dashboard" className="flex-1">
                                <Button className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-bold">
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
