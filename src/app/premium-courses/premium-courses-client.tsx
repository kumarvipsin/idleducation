'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import {
  Play,
  PlayCircle,
  Search,
  X,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getUserPurchasedCourses, recordCoursePurchase, createRazorpayOrder } from '@/app/actions';
import { CourseCard } from '@/components/course-card';
import type { TPaidCourse } from '@/app/actions/types';

// ── ILLUSTRATED COLORFUL SUBJECT ICONS (Matching Free Courses & CBSE Syllabus Style) ──
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

function GeneralIllustIcon({ className }: { className?: string }) {
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

// Helper to order subjects: Math -> Science -> English -> Social Studies
function getSubjectSortWeight(subjectName: string = ''): number {
  const s = subjectName.toLowerCase().trim();
  if (s.includes('math')) return 1;
  if (s.includes('sci') || s.includes('phy') || s.includes('chem') || s.includes('bio')) return 2;
  if (s.includes('eng')) return 3;
  if (s.includes('soc') || s.includes('sst') || s.includes('geo') || s.includes('hist') || s.includes('civic') || s.includes('polit') || s.includes('eco')) return 4;
  return 99;
}

function getSubjectDetails(subjectName: string = '') {
  const lower = subjectName.toLowerCase();
  if (lower.includes('math')) {
    return {
      icon: <MathsIllustIcon />,
      badgeBg: 'bg-blue-50/90 text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40',
    };
  }
  if (lower.includes('sci') || lower.includes('phy') || lower.includes('chem') || lower.includes('bio')) {
    return {
      icon: <ScienceIllustIcon />,
      badgeBg: 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    };
  }
  if (lower.includes('eng')) {
    return {
      icon: <EnglishIllustIcon />,
      badgeBg: 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40',
    };
  }
  if (lower.includes('eco')) {
    return {
      icon: <EconomicsIllustIcon />,
      badgeBg: 'bg-emerald-50/90 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    };
  }
  if (lower.includes('polit') || lower.includes('civic')) {
    return {
      icon: <PoliticalIllustIcon />,
      badgeBg: 'bg-indigo-50/90 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40',
    };
  }
  if (lower.includes('hist')) {
    return {
      icon: <HistoryIllustIcon />,
      badgeBg: 'bg-amber-50/90 text-amber-800 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    };
  }
  if (lower.includes('soc') || lower.includes('sst') || lower.includes('geo')) {
    return {
      icon: <SocialIllustIcon />,
      badgeBg: 'bg-amber-50/90 text-amber-800 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    };
  }
  return {
    icon: <GeneralIllustIcon />,
    badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700/60',
  };
}

interface PremiumCoursesClientProps {
  courses: TPaidCourse[];
}

export function PremiumCoursesClient({ courses }: PremiumCoursesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [processingCourseId, setProcessingCourseId] = useState<string | null>(null);
  const [exploringCourse, setExploringCourse] = useState<TPaidCourse | null>(null);

  // Navigation state: class selection with URL & session persistence
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlClass = new URLSearchParams(window.location.search).get('class');
      if (urlClass) return urlClass;
      try {
        const saved = sessionStorage.getItem('idl_premium_courses_class');
        if (saved) return saved;
      } catch {}
    }
    return searchParams.get('class') || 'Class 9';
  });

  const [selectedSubject, setSelectedSubject] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const urlSubj = new URLSearchParams(window.location.search).get('subject');
      if (urlSubj) return urlSubj;
    }
    return searchParams.get('subject') || null;
  });

  const [selectedChapter, setSelectedChapter] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const urlChap = new URLSearchParams(window.location.search).get('chapter');
      if (urlChap) return urlChap;
    }
    return searchParams.get('chapter') || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load user purchased courses
  useEffect(() => {
    if (user?.uid) {
      getUserPurchasedCourses(user.uid).then(res => {
        if (res.success && res.data) {
          setPurchasedCourseIds(res.data);
        }
      });
    }
  }, [user]);

  // Sync with URL search params
  useEffect(() => {
    const urlClass = searchParams.get('class');
    const urlSubj = searchParams.get('subject');
    const urlChap = searchParams.get('chapter');

    if (urlClass && urlClass !== selectedClass) {
      setSelectedClass(urlClass);
      try { sessionStorage.setItem('idl_premium_courses_class', urlClass); } catch {}
    }
    if (urlSubj !== selectedSubject) {
      setSelectedSubject(urlSubj || null);
    }
    if (urlChap !== selectedChapter) {
      setSelectedChapter(urlChap || null);
    }
  }, [searchParams, selectedClass, selectedSubject, selectedChapter]);

  const classList = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const handleSelectClass = (cls: string) => {
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedChapter(null);
    try { sessionStorage.setItem('idl_premium_courses_class', cls); } catch {}
    const params = new URLSearchParams(window.location.search);
    params.set('class', cls);
    params.delete('subject');
    params.delete('chapter');
    router.push(`/premium-courses?${params.toString()}`, { scroll: false });
  };

  const handleSelectSubject = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedChapter(null);
    const params = new URLSearchParams(window.location.search);
    params.set('class', selectedClass);
    params.set('subject', subj);
    params.delete('chapter');
    router.push(`/premium-courses?${params.toString()}`, { scroll: false });
  };

  const handleSelectChapter = (chap: string | null) => {
    setSelectedChapter(chap);
    const params = new URLSearchParams(window.location.search);
    params.set('class', selectedClass);
    if (selectedSubject) params.set('subject', selectedSubject);
    if (chap) {
      params.set('chapter', chap);
    } else {
      params.delete('chapter');
    }
    router.push(`/premium-courses?${params.toString()}`, { scroll: false });
  };

  const handleResetBreadcrumb = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    const params = new URLSearchParams(window.location.search);
    params.set('class', selectedClass);
    params.delete('subject');
    params.delete('chapter');
    router.push(`/premium-courses?${params.toString()}`, { scroll: false });
  };

  // Buy Now action with Razorpay
  const handleBuyNow = async (course: TPaidCourse) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll in this premium course.",
      });
      router.push('/login?callbackUrl=/premium-courses');
      return;
    }

    const price = course.price ?? 4999;
    setProcessingCourseId(course.id);

    try {
      const result = await createRazorpayOrder({ amount: price * 100, currency: 'INR' });
      if (!result.success || !result.order) {
        toast({
          variant: 'destructive',
          title: 'Payment Error',
          description: result.message || 'Could not initiate payment. Please try again.',
        });
        setProcessingCourseId(null);
        return;
      }

      const order = result.order;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'IDL Education',
        description: `Enroll in ${course.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          const enrollResult = await recordCoursePurchase(user.uid, course.id, response.razorpay_payment_id);
          if (enrollResult.success) {
            toast({ title: 'Enrollment Successful!', description: enrollResult.message || 'Welcome to the premium batch.' });
            setPurchasedCourseIds(prev => [...prev, course.id]);
          } else {
            toast({ variant: 'destructive', title: 'Enrollment Error', description: enrollResult.message });
          }
          setProcessingCourseId(null);
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#0B1F4B',
        },
        modal: {
          ondismiss: function() {
            setProcessingCourseId(null);
          }
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: err.message || 'Payment system error occurred.',
      });
      setProcessingCourseId(null);
    }
  };

  // Filter courses by selected class
  const classFilteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const cls = (c.class || c.courseClass || '').toLowerCase().trim();
      const target = selectedClass.toLowerCase().trim();
      return cls === target || cls.includes(target) || target.includes(cls);
    });
  }, [courses, selectedClass]);

  // Filter courses by search query
  const searchFilteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return classFilteredCourses;
    const q = searchQuery.toLowerCase().trim();
    return classFilteredCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.chapter?.toLowerCase().includes(q) ||
        c.shortDescription?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [classFilteredCourses, searchQuery]);

  // Group by Subjects for current class view
  const subjectsMap = useMemo(() => {
    const map = new Map<string, { courses: TPaidCourse[]; videoCount: number }>();
    classFilteredCourses.forEach((c) => {
      const subj = c.subject || 'General Studies';
      if (!map.has(subj)) {
        map.set(subj, { courses: [], videoCount: 0 });
      }
      const entry = map.get(subj)!;
      entry.courses.push(c);
      entry.videoCount += c.chapters?.length ? c.chapters.reduce((acc, ch) => acc + (ch.videos?.length || 1), 0) : 8;
    });
    return map;
  }, [classFilteredCourses]);

  // Order subjects: 1. Mathematics, 2. Science, 3. English, 4. Social Studies
  const sortedSubjectEntries = useMemo(() => {
    return Array.from(subjectsMap.entries()).sort(([subjA], [subjB]) => {
      const orderA = getSubjectSortWeight(subjA);
      const orderB = getSubjectSortWeight(subjB);
      if (orderA !== orderB) return orderA - orderB;
      return subjA.localeCompare(subjB);
    });
  }, [subjectsMap]);

  // Group by Chapters for current subject view
  const chaptersMap = useMemo(() => {
    if (!selectedSubject) return new Map();
    const map = new Map<string, TPaidCourse[]>();
    const subjCourses = classFilteredCourses.filter(
      (c) => (c.subject || 'General Studies').toLowerCase() === selectedSubject.toLowerCase()
    );
    subjCourses.forEach((c) => {
      const chap = c.chapter || c.title || 'General Curriculum';
      if (!map.has(chap)) {
        map.set(chap, []);
      }
      map.get(chap)!.push(c);
    });
    return map;
  }, [classFilteredCourses, selectedSubject]);

  // Courses list for selected chapter view
  const chapterCourses = useMemo(() => {
    if (!selectedChapter || !selectedSubject) return [];
    return classFilteredCourses.filter(
      (c) =>
        (c.subject || 'General Studies').toLowerCase() === selectedSubject.toLowerCase() &&
        (c.chapter || c.title || 'General Curriculum').toLowerCase() === selectedChapter.toLowerCase()
    );
  }, [classFilteredCourses, selectedSubject, selectedChapter]);

  return (
    <div data-page="premium-courses" className="min-h-screen bg-[#F5F7FA] dark:bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-24">
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── HERO — Refined, Premium, Sophisticated Pitch-Black Aesthetic (Matching Free Courses Style) ── */}
      <section className="relative overflow-hidden pt-8 pb-9 sm:py-12 lg:py-16 text-white bg-black select-none">
        {/* 1. Subtle Dark Dot Grid Texture */}
        <div 
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" 
        />

        {/* 2. Top Edge Subtle Refined Micro-Rim Line */}
        <div 
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 via-white/15 to-transparent pointer-events-none" 
        />

        {/* 3. Ultra-subtle Warm Amber Ambient Depth */}
        <div 
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[220px] sm:h-[280px] rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.04) 50%, transparent 75%)'
          }}
        />

        {/* 4. Bottom Horizon Subtle Divider Line */}
        <div 
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" 
        />

        <div className="container mx-auto px-5 md:px-6 relative z-10 max-w-4xl text-center">

          {/* Eyebrow — refined subtle gold badge */}
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/[0.04] border border-amber-400/20 cursor-default select-none">
              <Sparkles className="w-3 h-3 text-amber-400/90" />
              <span className="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
                IDL Education Premium
              </span>
            </div>
          </div>

          {/* Headline — Elegant, Balanced Typography: Crisp White + Warm Golden Gradient */}
          <h1 className="font-extrabold leading-[1.12] tracking-[-0.025em]
            text-[28px] sm:text-[40px] md:text-[48px] lg:text-[54px]
            max-w-[340px] sm:max-w-none mx-auto">
            <span className="text-white">
              Explore{" "}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706]">
              Premium Learning
            </span>
          </h1>

          {/* Description — Connected, naturally readable lines with harmonious weighting */}
          <p className="mt-3 sm:mt-4
            text-[13.5px] sm:text-[15px]
            font-normal leading-[1.65] sm:leading-[1.7]
            max-w-[340px] sm:max-w-[660px] mx-auto">
            <span className="text-zinc-300/90 block">
              Access premium video lectures for Classes 9–12, organised subject-wise and chapter-wise.
            </span>
            <span className="text-[#E5B869] block mt-1 sm:mt-1.5">
              Explore IDL Education&apos;s structured batches, test series, and learn at your own pace.
            </span>
          </p>

          {/* Stats strip — Consistent, subtle dark information badges */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-white/[0.08]
            flex flex-wrap items-center justify-center
            gap-x-2.5 gap-y-2 sm:gap-x-3.5
            text-[11.5px] sm:text-[12.5px] font-medium text-zinc-300">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>Premium Curriculum</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
              <span>Class 9–12</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span>Comprehensive Access</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Transition band + breathing space: pitch black → page background ── */}
      <div className="h-1 bg-gradient-to-b from-black to-[#F5F7FA] dark:to-background" />

      {/* ── Main Library Area ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-20 sm:pb-24">

        {/* Desktop Search + Filter bar */}
        {!selectedSubject && (
          <div className="py-3 sm:py-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 sm:gap-4">

            {/* Filter tabs — refined navy-blue active indicator and balanced muted grey */}
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0 -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 md:gap-10 whitespace-nowrap -mb-[1px]">
                {classList.map((cls) => {
                  const isActive = selectedClass === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => handleSelectClass(cls)}
                      className={cn(
                        "text-[13.5px] sm:text-[14.5px] tracking-tight transition-all duration-200 pb-2.5 border-b-[2.5px] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus:ring-0 cursor-pointer shrink-0",
                        isActive
                          ? "text-[#0B1F4B] dark:text-blue-400 font-bold border-[#0B1F4B] dark:border-blue-400"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium border-transparent hover:border-slate-300/70"
                      )}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expandable search */}
            <div className="relative flex items-center justify-end shrink-0 h-9">
              <div
                className={cn(
                  "flex items-center h-9 transition-all duration-300 ease-in-out rounded-full overflow-hidden",
                  isSearchOpen || searchQuery
                    ? "w-52 sm:w-60 px-2.5 bg-slate-100 dark:bg-slate-800/80"
                    : "w-9 justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                  className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shrink-0 p-1 cursor-pointer border-none outline-none shadow-none focus:outline-none focus:ring-0"
                  aria-label="Search courses"
                >
                  <Search className="h-4 w-4" />
                </button>
                {(isSearchOpen || searchQuery) && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search premium courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
                    className="flex-1 border-0 shadow-none outline-none focus:outline-none text-xs text-slate-700 dark:text-slate-300 placeholder:text-muted-foreground/70 bg-transparent h-full px-2"
                    aria-label="Search premium courses"
                  />
                )}
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                    className="text-muted-foreground hover:text-foreground shrink-0 p-1 cursor-pointer border-none outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumbs — refined typography & hierarchy */}
        {(selectedClass !== 'all' || selectedSubject || selectedChapter) && (
          <div className="flex items-center flex-wrap gap-1.5 py-3 sm:py-3.5 text-[12px] sm:text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
            <button onClick={() => handleSelectClass('all')} className="hover:text-[#0B1F4B] dark:hover:text-blue-400 transition-colors">
              Premium Courses
            </button>
            {selectedClass !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400/80 shrink-0" />
                <button onClick={handleResetBreadcrumb} className={cn("hover:text-[#0B1F4B] dark:hover:text-blue-400 transition-colors", !selectedSubject && "text-[#0B1F4B] dark:text-slate-100 font-semibold")}>
                  {selectedClass}
                </button>
              </>
            )}
            {selectedSubject && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400/80 shrink-0" />
                <button onClick={() => handleSelectChapter(null)} className={cn("hover:text-[#0B1F4B] dark:hover:text-blue-400 transition-colors", !selectedChapter && "text-[#0B1F4B] dark:text-slate-100 font-semibold")}>
                  {selectedSubject}
                </button>
              </>
            )}
            {selectedChapter && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400/80 shrink-0" />
                <span className="text-[#0B1F4B] dark:text-blue-400 font-semibold">{selectedChapter}</span>
              </>
            )}
          </div>
        )}

        {/* ── VIEW LEVEL 3: Courses inside a Chapter ── */}
        {selectedChapter && selectedSubject ? (
          <div className="py-4 sm:py-5">
            <div className="grid grid-cols-1 gap-3">
              {chapterCourses.map((course) => {
                const isPurchased = purchasedCourseIds.includes(course.id);
                return (
                  <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 min-w-0">
                      <div className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        {course.coverImageUrl || course.thumbnailUrl ? (
                          <Image
                            src={course.coverImageUrl || course.thumbnailUrl || ''}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-slate-800 text-[#0B1F4B]">
                            <GraduationCap className="w-8 h-8 opacity-60" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 mb-1">
                          {course.batchName || 'Academic Batch 2026–27'}
                        </span>
                        <h4 className="text-[14px] sm:text-[15.5px] font-bold text-slate-900 dark:text-white line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {course.shortDescription || course.description || `${course.subject} · ${course.class}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[14px] font-bold text-[#0B1F4B] dark:text-white">
                            ₹{course.price ? course.price.toLocaleString('en-IN') : '4,999'}
                          </span>
                          {course.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{course.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(course)}
                        disabled={processingCourseId === course.id}
                        className="bg-[#0B1F4B] hover:bg-[#1D4ED8] text-white font-semibold text-xs px-4 h-9 rounded-lg"
                      >
                        {processingCourseId === course.id ? 'Processing…' : isPurchased ? 'Access Batch' : 'Buy Now'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        ) : selectedSubject ? (
          /* ── VIEW LEVEL 2: Chapters in Subject ── */
          <div className="py-4 sm:py-5">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 text-left">
              <span className="w-1 h-4 rounded-full bg-[#0B1F4B] dark:bg-blue-400 shrink-0" />
              <h2 className="text-[15.5px] sm:text-[17px] font-bold text-[#0B1F4B] dark:text-slate-100 tracking-tight">
                {selectedClass} — {selectedSubject} Chapters
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Array.from(chaptersMap.entries()).map(([chapName, chapCourses]) => (
                <div
                  key={chapName}
                  onClick={() => handleSelectChapter(chapName)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 hover:border-[#0B1F4B]/30 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="text-sm font-bold text-[#0B1F4B] dark:text-white truncate group-hover:text-[#1D4ED8] transition-colors">
                      {chapName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {chapCourses.length} Premium Batch{chapCourses.length > 1 ? 'es' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B1F4B] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ── VIEW LEVEL 1: Primary Course Library ── */
          <div className="pt-1 pb-5 sm:pb-6 space-y-6 sm:space-y-8">

            {/* Subject-wise Video Courses — Styled identically to Free Courses & School CBSE Syllabus Section */}
            {selectedClass !== 'all' && subjectsMap.size > 0 && (
              <section className="mb-8 sm:mb-10">
                {/* Header with refined typography and subtle accent pill */}
                <div className="mb-4 sm:mb-5 flex items-center gap-2.5 text-left">
                  <span className="w-1 h-4 sm:h-4.5 rounded-full bg-[#0B1F4B] dark:bg-blue-400 shrink-0" aria-hidden="true" />
                  <h2 className="text-[15.5px] sm:text-[17px] font-bold text-[#0B1F4B] dark:text-slate-100 tracking-tight">
                    {selectedClass} — Explore by Subject
                  </h2>
                </div>

                {/* 2-Column Grid (Ordered: Mathematics -> Science -> English -> Social Studies) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4.5">
                  {sortedSubjectEntries.map(([subjName, data]) => {
                    const details = getSubjectDetails(subjName);
                    const chaptersCount = new Set(data.courses.map((c) => c.chapter || c.title || 'General Curriculum')).size;
                    return (
                      <div
                        key={subjName}
                        onClick={() => handleSelectSubject(subjName)}
                        className="group relative overflow-hidden bg-gradient-to-b from-white to-[#F9FAFC] dark:from-slate-900 dark:to-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 sm:p-4 md:p-4.5 hover:border-[#0B1F4B]/30 dark:hover:border-blue-400/30 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_12px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_20px_-4px_rgba(11,31,75,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer min-h-[82px] sm:min-h-[88px]"
                      >
                        {/* 1. Left: Icon Box */}
                        <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 relative z-10">
                          {details.icon}
                        </div>

                        {/* 2. Center: Flexible Content Area */}
                        <div className="min-w-0 flex-1 relative z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[14.5px] sm:text-[16px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-tight truncate group-hover:text-[#1D4ED8] transition-colors">
                              {subjName}
                            </h3>
                            <span className={cn("text-[10px] sm:text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 tracking-wide", details.badgeBg)}>
                              {data.courses.length} Batch{data.courses.length > 1 ? 'es' : ''}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-[12px] font-normal text-slate-500 dark:text-slate-400 truncate">
                            Academic Session 2026–27 · {chaptersCount} Chapter{chaptersCount > 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* 3. Right: Fixed Action Area (Never Wraps) */}
                        <div className="shrink-0 flex items-center justify-end relative z-10 pl-1">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#1D4ED8] dark:text-blue-400 group-hover:text-[#0B1F4B] dark:group-hover:text-blue-300 transition-colors whitespace-nowrap">
                            <span className="whitespace-nowrap">View Now</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Course grid section */}
            <div className="space-y-3">
              {/* Section header */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {selectedClass === 'all' ? 'Premium Courses' : `${selectedClass} — Premium Courses`}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Showing {searchFilteredCourses.length} premium learning resource{searchFilteredCourses.length !== 1 ? 's' : ''}
                </p>
              </div>

              {searchFilteredCourses.length === 0 ? (
                /* Empty state */
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl py-12 px-6 text-center max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">No premium courses found</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Try another class or search term.</p>
                  <Button variant="outline" size="sm" onClick={() => { handleSelectClass('Class 9'); setSearchQuery(''); }} className="mt-4 text-xs font-semibold rounded-lg">
                    View Class 9 Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {searchFilteredCourses.map((course) => {
                    const isPurchased = purchasedCourseIds.includes(course.id);
                    return (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        type="premium"
                        thumbnailUrl={course.coverImageUrl || course.thumbnailUrl}
                        onThumbnailClick={() => handleBuyNow(course)}
                        courseClass={course.class || course.courseClass}
                        medium={course.medium || 'Hinglish / English'}
                        subject={course.subject}
                        title={course.title}
                        onTitleClick={() => handleBuyNow(course)}
                        audience={course.audience || 'Target Academic Batch 2026–27'}
                        startDate={course.startDate}
                        endDate={course.endDate}
                        description={course.shortDescription || course.description}
                        price={course.price ?? 4999}
                        originalPrice={course.originalPrice ?? 8999}
                        batchName={course.batchName || 'Academic Batch 2026–27'}
                        validity={course.validity || '1 Year Full Access'}
                        isPurchased={isPurchased}
                        onBuyNow={() => handleBuyNow(course)}
                        isProcessing={processingCourseId === course.id}
                      />
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

