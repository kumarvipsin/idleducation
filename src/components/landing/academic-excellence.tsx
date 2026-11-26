'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FormModalDialogContent } from '@/components/ui/form-modal-dialog';

// Structured data interfaces for future Admin / CMS integration
export interface StudentPerformer {
  id: string;
  name: string;
  score: string;
  scoreLabel?: string;
  grade: string;
  stream?: string;
  image: string;
  badge?: string;
  rank?: string;
  percentile?: string;
  subjects?: { name: string; marks: string }[];
  dreamCollege?: string;
  testimonial?: string;
}

export interface CategoryResultData {
  id: string;
  categoryName: string;
  tabLabel: string;
  year: string;
  badge: string;
  headlineTitle: string;
  headlineHighlight: string;
  subheading: string;
  description: string;
  stats: {
    highestScore: {
      value: string;
      label: string;
    };
    students90Plus: {
      value: string;
      label: string;
    };
    students95Plus: {
      value: string;
      label: string;
    };
  };
  quote: {
    text: string;
    highlight: string;
  };
  topPerformers: StudentPerformer[];
}

// Complete data for all categories matching IDL Education brand
const RESULTS_DATA: CategoryResultData[] = [
  {
    id: 'class-10',
    categoryName: 'CLASS 10',
    tabLabel: 'CLASS 10',
    year: '2026',
    badge: 'BOARD EXAMINATION',
    headlineTitle: 'CLASS 10',
    headlineHighlight: '2026 RESULTS',
    subheading: 'Outstanding Board Performance',
    description: 'STRONG CBSE FOUNDATIONS & TOP SCORES',
    stats: {
      highestScore: {
        value: '99.4%',
        label: 'Highest Score'
      },
      students90Plus: {
        value: '56',
        label: 'Students 90%+'
      },
      students95Plus: {
        value: '24',
        label: 'Students 95%+'
      }
    },
    quote: {
      text: 'Strong fundamentals, rigorous concept building and consistent practice yielded ',
      highlight: 'remarkable results.'
    },
    topPerformers: [
      {
        id: 'c10-1',
        name: 'Aman Singh',
        score: '99.4%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'School Topper',
        subjects: [
          { name: 'Mathematics', marks: '100/100' },
          { name: 'Science', marks: '99/100' },
          { name: 'Social Science', marks: '99/100' },
          { name: 'English', marks: '99/100' },
        ],
        dreamCollege: 'Science Stream (PCM+CS)',
        testimonial: 'IDL’s structured test series and mentorship turned tough concepts into my biggest strengths.'
      },
      {
        id: 'c10-2',
        name: 'Ishita Verma',
        score: '98.6%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Star Achiever',
        subjects: [
          { name: 'Mathematics', marks: '99/100' },
          { name: 'Science', marks: '98/100' },
          { name: 'Social Science', marks: '99/100' },
          { name: 'English', marks: '98/100' },
        ],
        dreamCollege: 'Commerce Stream',
        testimonial: 'Daily practice papers and instant doubt solving made my board prep calm and stress-free.'
      },
      {
        id: 'c10-3',
        name: 'Raghav Sharma',
        score: '98.2%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Merit Scholar',
        subjects: [
          { name: 'Mathematics', marks: '100/100' },
          { name: 'Science', marks: '97/100' },
          { name: 'Social Science', marks: '98/100' },
          { name: 'English', marks: '98/100' },
        ],
        dreamCollege: 'IIT JEE Foundation',
        testimonial: 'Teachers at IDL never left a single concept unclear—their guidance built my confidence.'
      },
      {
        id: 'c10-4',
        name: 'Mehak Jain',
        score: '97.6%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Excellence Award',
        subjects: [
          { name: 'Science', marks: '98/100' },
          { name: 'Mathematics', marks: '97/100' },
          { name: 'English', marks: '98/100' },
          { name: 'Hindi', marks: '97/100' },
        ],
        dreamCollege: 'Medical Stream (PCB)',
        testimonial: 'Weekly assessments and paper reviews gave me real exam readiness well before boards.'
      },
      {
        id: 'c10-5',
        name: 'Kavya Patel',
        score: '97.0%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'High Performer',
        subjects: [
          { name: 'Mathematics', marks: '98/100' },
          { name: 'Science', marks: '96/100' },
          { name: 'Social Science', marks: '97/100' },
        ],
        testimonial: 'Consistent revision modules and concise notes kept my entire syllabus crystal clear.'
      },
      {
        id: 'c10-6',
        name: 'Aditya Sharma',
        score: '96.4%',
        grade: 'Class 10 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Top Scorer',
        subjects: [
          { name: 'Mathematics', marks: '97/100' },
          { name: 'Science', marks: '96/100' },
          { name: 'Social Science', marks: '96/100' },
        ],
        testimonial: 'Step-by-step doubt sessions removed exam fear and helped me stay disciplined all year.'
      }
    ]
  },
  {
    id: 'class-12',
    categoryName: 'CLASS 12',
    tabLabel: 'CLASS 12',
    year: '2026',
    badge: 'BOARD EXAMINATION',
    headlineTitle: 'CLASS 12',
    headlineHighlight: '2026 RESULTS',
    subheading: 'Outstanding Board Performance',
    description: 'PROVEN BOARD MASTERY ACROSS ALL STREAMS',
    stats: {
      highestScore: {
        value: '99.2%',
        label: 'Highest Score'
      },
      students90Plus: {
        value: '42',
        label: 'Students 90%+'
      },
      students95Plus: {
        value: '18',
        label: 'Students 95%+'
      }
    },
    quote: {
      text: 'Consistent guidance, focused preparation and the right support help our students achieve ',
      highlight: 'great results.'
    },
    topPerformers: [
      {
        id: 'c12-1',
        name: 'Aman Singh',
        score: '98.6%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'State Topper Rank 4',
        subjects: [
          { name: 'Physics', marks: '99/100' },
          { name: 'Chemistry', marks: '98/100' },
          { name: 'Mathematics', marks: '99/100' },
          { name: 'Computer Science', marks: '98/100' },
        ],
        dreamCollege: 'IIT Delhi / B.Tech Computer Science',
        testimonial: 'Conceptual clarity and mock analysis at IDL gave me a strong edge for boards and JEE.'
      },
      {
        id: 'c12-2',
        name: 'Ishita Verma',
        score: '97.8%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Stream Topper',
        subjects: [
          { name: 'Accountancy', marks: '99/100' },
          { name: 'Economics', marks: '98/100' },
          { name: 'Business Studies', marks: '98/100' },
          { name: 'Applied Math', marks: '96/100' },
        ],
        dreamCollege: 'SRCC Delhi / B.Com (Hons)',
        testimonial: 'Past-paper drills with targeted teacher feedback pushed my score well past 97%.'
      },
      {
        id: 'c12-3',
        name: 'Raghav Sharma',
        score: '97.4%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Physics Centum',
        subjects: [
          { name: 'Physics', marks: '100/100' },
          { name: 'Chemistry', marks: '97/100' },
          { name: 'Mathematics', marks: '97/100' },
          { name: 'English', marks: '96/100' },
        ],
        dreamCollege: 'BITS Pilani / Mechanical Engg',
        testimonial: 'Personalized mentorship and Physics doubt clinics helped me achieve a perfect 100/100.'
      },
      {
        id: 'c12-4',
        name: 'Mehak Jain',
        score: '96.8%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Merit Scholar',
        subjects: [
          { name: 'Psychology', marks: '99/100' },
          { name: 'Political Science', marks: '97/100' },
          { name: 'Economics', marks: '96/100' },
          { name: 'History', marks: '95/100' },
        ],
        dreamCollege: 'Lady Shri Ram College / BA Psychology',
        testimonial: 'Answer-writing workshops and structured reviews completely elevated my exam presentation.'
      },
      {
        id: 'c12-5',
        name: 'Kavya Patel',
        score: '96.2%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Bio Gold Medalist',
        subjects: [
          { name: 'Biology', marks: '98/100' },
          { name: 'Chemistry', marks: '96/100' },
          { name: 'Physics', marks: '95/100' },
        ],
        dreamCollege: 'AIIMS / MBBS',
        testimonial: 'Rigorous NCERT drills and constant faculty support kept my confidence high all year.'
      },
      {
        id: 'c12-6',
        name: 'Aditya Sharma',
        score: '95.8%',
        grade: 'Class 12 | CBSE',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Honor Roll',
        subjects: [
          { name: 'Accountancy', marks: '97/100' },
          { name: 'Economics', marks: '96/100' },
          { name: 'Business Studies', marks: '95/100' },
        ],
        dreamCollege: 'Hansraj College / Economics Hons',
        testimonial: 'My mentor’s weekly study schedule kept me consistent and well-prepared for boards.'
      }
    ]
  },
  {
    id: 'cuet',
    categoryName: 'CUET (UG)',
    tabLabel: 'CUET (UG)',
    year: '2026',
    badge: 'ENTRANCE EXAMINATION',
    headlineTitle: 'CUET (UG)',
    headlineHighlight: '2026 RESULTS',
    subheading: 'Outstanding NTA CUET Performance',
    description: 'TOP NTA PERCENTILES FOR DREAM COLLEGES',
    stats: {
      highestScore: {
        value: '100%ile',
        label: 'Highest Score'
      },
      students90Plus: {
        value: '52',
        label: '98%+ Percentile'
      },
      students95Plus: {
        value: '26',
        label: '100%ile Subjects'
      }
    },
    quote: {
      text: 'Domain syllabus mastery, general test aptitude drills and simulated CBT mock testing unlocked ',
      highlight: 'top universities.'
    },
    topPerformers: [
      {
        id: 'cuet-1',
        name: 'Mehak Jain',
        score: '100%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Triple 100%iler',
        subjects: [
          { name: 'Economics', marks: '100%ile' },
          { name: 'Business Studies', marks: '100%ile' },
          { name: 'English', marks: '100%ile' },
          { name: 'Accountancy', marks: '99.8%ile' },
        ],
        dreamCollege: 'Shri Ram College of Commerce (SRCC)',
        testimonial: 'IDL’s domain practice modules and CBT mocks helped me reach 100%ile and secure SRCC.'
      },
      {
        id: 'cuet-2',
        name: 'Ishita Verma',
        score: '99.9%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Dual 100%iler',
        subjects: [
          { name: 'Political Science', marks: '100%ile' },
          { name: 'History', marks: '100%ile' },
          { name: 'English', marks: '99.6%ile' },
        ],
        dreamCollege: 'Hindu College, Delhi University',
        testimonial: 'Realistic NTA mock tests and NCERT mastery made Political Science and History my strengths.'
      },
      {
        id: 'cuet-3',
        name: 'Aman Singh',
        score: '99.7%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Top Scorer',
        subjects: [
          { name: 'Mathematics', marks: '100%ile' },
          { name: 'Physics', marks: '99.6%ile' },
          { name: 'General Test', marks: '99.4%ile' },
        ],
        dreamCollege: 'Hansraj College / B.Sc Physics',
        testimonial: 'Concise General Test capsules and daily MCQ sprints gave me the exact speed for CUET.'
      },
      {
        id: 'cuet-4',
        name: 'Raghav Sharma',
        score: '99.4%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'Merit List',
        subjects: [
          { name: 'Economics', marks: '99.6%ile' },
          { name: 'Mathematics', marks: '99.2%ile' },
        ],
        dreamCollege: 'Banaras Hindu University (BHU)',
        testimonial: 'Chapter-wise speed tests and mock reviews boosted my accuracy before exam day.'
      },
      {
        id: 'cuet-5',
        name: 'Aditya Sharma',
        score: '99.1%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-boy.jpg',
        badge: 'High Performer',
        subjects: [
          { name: 'English', marks: '99.5%ile' },
          { name: 'General Test', marks: '98.8%ile' },
        ],
        dreamCollege: 'Jamia Millia Islamia',
        testimonial: 'Strong coaching and careful course preference guidance made my CUET journey smooth.'
      },
      {
        id: 'cuet-6',
        name: 'Kavya Patel',
        score: '98.8%ile',
        grade: 'CUET (UG)',
        image: '/images/results/idl-student-girl.jpg',
        badge: 'Honor Roll',
        subjects: [
          { name: 'Psychology', marks: '99.4%ile' },
          { name: 'English', marks: '98.4%ile' },
        ],
        dreamCollege: 'Kirori Mal College (KMC)',
        testimonial: 'NCERT-aligned revision sheets and regular mock feedback saved hours in the final weeks.'
      }
    ]
  }
];

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1.5" y="8" width="3" height="8" rx="1" />
      <rect x="6.5" y="2" width="3" height="14" rx="1" />
      <rect x="11.5" y="5" width="3" height="11" rx="1" />
    </svg>
  );
}

function getStudentMotivation(student: StudentPerformer): string {
  const firstName = student.name.split(' ')[0] || student.name;
  const isPercentile = student.score.toLowerCase().includes('ile');
  const perfectSubject = student.subjects?.find(
    (s) => s.marks.startsWith('100/') || s.marks.toLowerCase().startsWith('100%')
  );

  if (isPercentile) {
    return `Focused prep and consistency earned ${firstName} ${student.score} in ${student.grade}—a proud step toward a bright future.`;
  }
  if (perfectSubject) {
    return `Discipline and clarity earned ${firstName} ${student.score}—including ${perfectSubject.marks} in ${perfectSubject.name}.`;
  }
  return `Steady dedication and clarity earned ${firstName} ${student.score} in ${student.grade}—reflecting bright future potential.`;
}

export function AcademicExcellence() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(1); // Default: CLASS 12 (index 1)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformer | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAllResultsModal, setShowAllResultsModal] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const activeCategory = useMemo(() => {
    return RESULTS_DATA[activeCategoryIndex] || RESULTS_DATA[0];
  }, [activeCategoryIndex]);

  // Synchronize carousel events
  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) return;
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
    setCurrentSlideIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSnaps = () => {
      const snaps = carouselApi.scrollSnapList();
      setScrollSnaps(snaps && snaps.length > 0 ? snaps : [0, 1, 2, 3, 4]);
      onCarouselSelect();
    };
    updateSnaps();
    carouselApi.on('select', onCarouselSelect);
    carouselApi.on('reInit', updateSnaps);
    return () => {
      carouselApi.off('select', onCarouselSelect);
      carouselApi.off('reInit', updateSnaps);
    };
  }, [carouselApi, onCarouselSelect]);

  // Reset selected card when active category changes
  useEffect(() => {
    setSelectedCardId(null);
  }, [activeCategoryIndex]);

  // Reset carousel snap without elastic bounce whenever active category changes
  useEffect(() => {
    if (carouselApi && carouselApi.selectedScrollSnap() !== 0) {
      carouselApi.scrollTo(0, true);
    }
  }, [activeCategoryIndex, carouselApi]);

  // Lock body & html scroll/overscroll and handle Escape key for student profile popup
  useEffect(() => {
    if (selectedStudent) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedStudent(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedStudent]);

  // Reset carousel to first card when category tab changes
  const handleTabChange = (index: number) => {
    setActiveCategoryIndex(index);
    if (carouselApi && carouselApi.selectedScrollSnap() !== 0) {
      carouselApi.scrollTo(0, true);
    }
  };

  const scrollPrev = () => {
    carouselApi?.scrollPrev();
  };

  const scrollNext = () => {
    carouselApi?.scrollNext();
  };

  return (
    <section 
      id="academic-results" 
      aria-label="Academic Results"
      className="w-full idl-section-y bg-white dark:bg-slate-950 overflow-hidden relative"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Container aligned with Courses We Offer width (max-w-[1360px]) */}
      <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        
        {/* ===================== HEADER SECTION ===================== */}
        <div className="flex flex-col items-center justify-center text-center mb-4 sm:mb-4">
          {/* Eyebrow — small section label in Title Case */}
          <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 mb-2 sm:mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
            <span className="text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Academic </span>
              <span className="text-[#155EEF] dark:text-blue-400">Results</span>
            </span>
          </div>

          {/* Description heading — single line on mobile and desktop */}
          <h2 className="text-[15px] min-[360px]:text-[15.5px] min-[390px]:text-[16.5px] sm:text-[24px] md:text-[30px] lg:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Results That Reflect.{' '}</span>
            <span className="text-[#155EEF] dark:text-blue-400">Excellence That Inspires.</span>
          </h2>
        </div>

        {/* ===================== CATEGORY TABS (TEXT ONLY WITH UNDERLINE, NO BUTTON SHAPE) ===================== */}
        <div className="w-full mb-[20px] sm:mb-[26px]">
          <div className="flex justify-center px-2">
            <div 
              role="tablist" 
              aria-label="Result Categories"
              className="inline-flex items-center justify-center gap-6 min-[360px]:gap-7 sm:gap-8 select-none"
            >
              {RESULTS_DATA.map((cat, idx) => {
                const isActive = activeCategoryIndex === idx;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    id={`tab-${cat.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${cat.id}`}
                    onClick={() => handleTabChange(idx)}
                    className={cn(
                      "pb-1 sm:pb-0.5 text-[11.5px] sm:text-[12.5px] font-[900] tracking-wider uppercase transition-all duration-200 cursor-pointer bg-transparent outline-none focus-visible:outline-none border-b-2 sm:border-b-[1.5px] text-[#64748B] hover:text-[#062B67] dark:text-slate-400 dark:hover:text-white",
                      isActive
                        ? "border-[#155EEF] dark:border-blue-400 text-[#062B67] dark:text-white"
                        : "border-transparent"
                    )}
                  >
                    <span>{cat.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================== MAIN RESULTS CONTAINER (EXACT MATCH TO BEST EXAM PREP APP SECTION) ===================== */}
        <div 
          id={`panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="relative w-full rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-[#FAFCFF] via-[#F6F9FE] to-[#EEF5FC] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-800/60 border border-[#E2ECF8] dark:border-slate-800/80 p-4 sm:p-5 lg:p-6 pb-5 sm:pb-6 lg:pb-7 shadow-[0_4px_24px_rgba(6,43,103,0.03)] overflow-hidden transition-all duration-300"
        >
          {/* ----------------- TOP SECTION: SUMMARY + 3 STATS ----------------- */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 lg:gap-5 pb-2 sm:pb-2.5">
            
            {/* Left: Heading + Single-line Description */}
            <div className="w-full lg:w-[32%] xl:w-[30%] shrink-0 flex flex-col justify-center min-w-0">
              <h3 className="text-[22px] sm:text-[25px] lg:text-[27px] font-[950] tracking-tight flex items-center gap-2 leading-tight">
                <span className="text-[#062B67] dark:text-white">
                  {activeCategory.headlineTitle}
                </span>
                <span className="text-[#B45309] font-bold">•</span>
                <span className="text-[#B45309] dark:text-amber-400">
                  {activeCategory.headlineHighlight}
                </span>
              </h3>
              <p className="mt-1.5 text-[11px] sm:text-[11.5px] lg:text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.04em] text-[#475E82] dark:text-slate-400 leading-snug whitespace-nowrap truncate">
                {activeCategory.description}
              </p>
            </div>

            {/* Right: 3 Typographic Data Displays in 1 Horizontal Row with 3D Icons */}
            <div className="w-full lg:flex-1 min-w-0 pt-3.5 sm:pt-3.5 lg:pt-0 border-t border-[#E2ECF8]/80 dark:border-slate-800/80 lg:border-t-0 lg:border-l lg:border-[#E2ECF8] lg:pl-6 xl:pl-7">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 lg:gap-3 xl:gap-3.5 w-full">
                
                {/* Stat 1: Highest Score (Trophy Cup) */}
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 md:gap-2.5 lg:gap-2.5 xl:gap-3 p-2 min-[360px]:p-2.5 sm:p-2.5 md:p-3 xl:p-3.5 rounded-[14px] sm:rounded-[18px] xl:rounded-[20px] bg-[#FFFDF5] dark:bg-amber-950/20 border border-[#FDE68A]/35 dark:border-amber-500/20 transition-colors duration-200 min-w-0">
                  {(() => {
                    const raw = activeCategory.stats.highestScore.value;
                    const isPercentile = raw.includes('%ile');
                    const isPercent = raw.includes('%');
                    const num = raw.replace('%ile', '').replace('%', '');
                    return (
                      <>
                        <div className="relative w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 shrink-0 flex items-center justify-center">
                          <Image
                            src="/cup.png"
                            alt="Highest Score Trophy"
                            width={56}
                            height={56}
                            className="w-full h-full object-contain"
                            priority
                          />
                        </div>
                        <div className="flex flex-col items-center sm:items-start min-w-0 text-center sm:text-left">
                          <div className="flex items-baseline justify-center sm:justify-start">
                            <span className="text-[16px] min-[360px]:text-[17.5px] sm:text-[22px] md:text-[23px] lg:text-[25px] xl:text-[26px] font-[950] text-[#0A1E4A] dark:text-white leading-none tracking-tight">
                              {num}
                            </span>
                            <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13px] lg:text-[14px] font-bold text-[#0A1E4A]/80 dark:text-white/80 ml-0.5 leading-none">
                              {isPercentile ? '%ile' : isPercent ? '%' : ''}
                            </span>
                          </div>
                          <div className="mt-1 sm:mt-1.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-[19px] sm:h-[22px] lg:h-[24px] px-1.5 min-[360px]:px-2 sm:px-2.5 rounded-full text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] xl:text-[10.5px] font-bold bg-[#FEF08A] dark:bg-amber-900/40 text-[#92400E] dark:text-amber-300 max-w-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                            <span className="truncate">{activeCategory.stats.highestScore.label}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Stat 2: Students 95%+ (Gold Medal) */}
                {(() => {
                  const isCuet = activeCategory.id === 'cuet';
                  const topNumber = isCuet ? '100%ile' : '95%+';
                  const bottomLabel = isCuet ? `${activeCategory.stats.students95Plus.value} Subjects` : `${activeCategory.stats.students95Plus.value} Students`;
                  const numOnly = topNumber.replace('%ile', '').replace('%+', '').replace('%', '');
                  const symbol = topNumber.includes('%ile') ? '%ile' : topNumber.includes('%+') ? '%+' : '%';

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 md:gap-2.5 lg:gap-2.5 xl:gap-3 p-2 min-[360px]:p-2.5 sm:p-2.5 md:p-3 xl:p-3.5 rounded-[14px] sm:rounded-[18px] xl:rounded-[20px] bg-[#F2FBF7] dark:bg-emerald-950/20 border border-[#BBF7D0]/35 dark:border-emerald-500/20 transition-colors duration-200 min-w-0">
                      <div className="relative w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 shrink-0 flex items-center justify-center">
                        <Image
                          src="/gold.png"
                          alt="Gold Medal"
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                          priority
                        />
                      </div>
                      <div className="flex flex-col items-center sm:items-start min-w-0 text-center sm:text-left">
                        <div className="flex items-baseline justify-center sm:justify-start">
                          <span className="text-[16px] min-[360px]:text-[17.5px] sm:text-[22px] md:text-[23px] lg:text-[25px] xl:text-[26px] font-[950] text-[#0A1E4A] dark:text-white leading-none tracking-tight">
                            {numOnly}
                          </span>
                          <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13px] lg:text-[14px] font-bold text-[#059669] dark:text-emerald-400 ml-0.5 leading-none">
                            {symbol}
                          </span>
                        </div>
                        <div className="mt-1 sm:mt-1.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-[19px] sm:h-[22px] lg:h-[24px] px-1.5 min-[360px]:px-2 sm:px-2.5 rounded-full text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] xl:text-[10.5px] font-bold bg-[#DCFCE7] dark:bg-emerald-900/40 text-[#065F46] dark:text-emerald-300 max-w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0" />
                          <span className="truncate">{bottomLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Stat 3: Students 90%+ (Silver Medal) */}
                {(() => {
                  const isCuet = activeCategory.id === 'cuet';
                  const topNumber = isCuet ? '98%+' : '90%+';
                  const bottomLabel = `${activeCategory.stats.students90Plus.value} Students`;
                  const numOnly = topNumber.replace('%+', '').replace('%', '');
                  const symbol = topNumber.includes('%+') ? '%+' : '%';

                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 md:gap-2.5 lg:gap-2.5 xl:gap-3 p-2 min-[360px]:p-2.5 sm:p-2.5 md:p-3 xl:p-3.5 rounded-[14px] sm:rounded-[18px] xl:rounded-[20px] bg-[#F0F6FE] dark:bg-blue-950/20 border border-[#BFDBFE]/35 dark:border-blue-500/20 transition-colors duration-200 min-w-0">
                      <div className="relative w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-14 xl:h-14 shrink-0 flex items-center justify-center">
                        <Image
                          src="/silver.png"
                          alt="Silver Medal"
                          width={56}
                          height={56}
                          className="w-full h-full object-contain"
                          priority
                        />
                      </div>
                      <div className="flex flex-col items-center sm:items-start min-w-0 text-center sm:text-left">
                        <div className="flex items-baseline justify-center sm:justify-start">
                          <span className="text-[16px] min-[360px]:text-[17.5px] sm:text-[22px] md:text-[23px] lg:text-[25px] xl:text-[26px] font-[950] text-[#0A1E4A] dark:text-white leading-none tracking-tight">
                            {numOnly}
                          </span>
                          <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13px] lg:text-[14px] font-bold text-[#2563EB] dark:text-blue-400 ml-0.5 leading-none">
                            {symbol}
                          </span>
                        </div>
                        <div className="mt-1 sm:mt-1.5 inline-flex items-center justify-center gap-1 sm:gap-1.5 h-[19px] sm:h-[22px] lg:h-[24px] px-1.5 min-[360px]:px-2 sm:px-2.5 rounded-full text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] xl:text-[10.5px] font-bold bg-[#DBEAFE] dark:bg-blue-900/40 text-[#1E40AF] dark:text-blue-300 max-w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                          <span className="truncate">{bottomLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

          </div>

          {/* ----------------- MIDDLE ROW: TOP PERFORMERS HEADER + NAV ARROWS ----------------- */}
          <div className="relative z-10 flex items-center justify-between mt-3 sm:mt-2.5 mb-2 sm:mb-2 px-0.5 w-full">
            {/* Left: Bar Chart Icon + Title */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <BarChartIcon className="w-[18px] h-[18px] text-[#F59E0B] shrink-0" />
              <h4 className="text-[#0A1E4A] dark:text-white font-[950] text-[16px] sm:text-[17.5px] tracking-tight">
                Top Performers
              </h4>
            </div>

            {/* Right: Circular Navigation Chevron Buttons matching screenshot (Endless loop enabled) */}
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={scrollPrev} 
                aria-label="Previous slide" 
                className="w-7 h-7 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:text-[#0A1E4A] hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                onClick={scrollNext} 
                aria-label="Next slide" 
                className="w-7 h-7 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-500 hover:text-[#0A1E4A] hover:border-slate-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ----------------- CAROUSEL OF STUDENT CARDS ----------------- */}
          <div className="relative z-10 w-full">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-2.5 lg:-ml-3 py-1">
                {activeCategory.topPerformers.map((student) => {
                  const isPercentile = student.score.includes('%ile');
                  const scoreValue = isPercentile ? student.score.replace('%ile', '') : student.score.replace('%', '');

                  return (
                    <CarouselItem 
                      key={student.id} 
                      className="pl-2 sm:pl-2.5 lg:pl-3 basis-full sm:basis-[32%] md:basis-[24%] lg:basis-1/5"
                    >
                      {/* Student Card: Clean, balanced card with subtle soft border (not harsh or prominently visible) */}
                      <div 
                        onClick={() => setSelectedCardId(student.id)}
                        className="bg-white rounded-[20px] sm:rounded-[22px] border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_10px_rgba(10,30,74,0.04),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(10,30,74,0.08)] hover:border-[#BFDBFE]/70 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 flex flex-col group h-full select-none overflow-hidden cursor-pointer max-w-none mx-auto outline-none focus:outline-none focus:ring-0 active:outline-none p-3 sm:p-2.5"
                      >
                        
                        {/* Student image: IDL Star style with outer margin/padding and rounded-[15px] corners */}
                        <div className="relative w-full aspect-square rounded-[14px] sm:rounded-[15px] bg-[#EAF2FC] overflow-hidden">
                          <Image
                            src={student.image}
                            alt={student.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover object-top group-hover:scale-103 transition-transform duration-500"
                            priority={false}
                          />
                        </div>

                        {/* Lower Information Area: Structured Layout eliminating empty gaps */}
                        <div className="relative pt-3 sm:pt-2.5 px-0.5 pb-0.5 flex flex-col justify-between flex-1">
                          
                          {/* Top Row: Name + Grade on Left, Big Bold Yellow Marks on Right */}
                          <div className="flex items-center justify-between gap-2.5">
                            
                            {/* Left: Name and Grade */}
                            <div className="min-w-0 flex-1 text-left">
                              <h5 className="font-[950] text-[18px] min-[360px]:text-[19.5px] sm:text-[14px] lg:text-[14.5px] tracking-tight leading-tight truncate text-[#0A1E4A] dark:text-white">
                                {student.name}
                              </h5>
                              <p className="text-[13px] min-[360px]:text-[13.5px] sm:text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate" title={student.grade}>
                                {student.grade}
                              </p>
                            </div>

                            {/* Right: Big Prominent Yellow Marks */}
                            <div className="shrink-0 flex items-baseline justify-end text-right">
                              <span className="text-[28px] min-[360px]:text-[32px] sm:text-[22px] lg:text-[24px] font-[950] text-[#E5A000] dark:text-[#FACC15] leading-none tracking-tight">
                                {scoreValue}
                              </span>
                              <span className="text-[15px] min-[360px]:text-[16px] sm:text-[12.5px] font-[950] text-[#E5A000] dark:text-[#FACC15] ml-0.5">
                                {isPercentile ? '%ile' : '%'}
                              </span>
                            </div>

                          </div>

                          {/* Bottom Row: View Profile Action */}
                          <div className="mt-3 sm:mt-2 pt-2.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCardId(student.id);
                                setSelectedStudent(student);
                              }}
                              className="text-[13px] min-[360px]:text-[13.5px] sm:text-[11.5px] inline-flex items-center gap-1.5 leading-none group/btn transition-colors cursor-pointer text-left font-bold text-[#155EEF] hover:text-[#0A1E4A] py-0.5"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 sm:w-3 sm:h-3 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                            </button>
                          </div>

                        </div>

                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </div>

          {/* ----------------- PAGINATION INDICATORS (BLUE ACTIVE PILL) ----------------- */}
          <div className="w-full flex justify-center items-center gap-1.5 sm:gap-2 mt-3.5 sm:mt-4 mb-0.5">
            {activeCategory.topPerformers.map((_, i) => (
              <button
                key={i}
                onClick={() => carouselApi?.scrollTo(i)}
                aria-label={`Jump to slide ${i + 1}`}
                className="p-1 cursor-pointer flex items-center justify-center min-w-[18px] min-h-[18px]"
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300",
                    (currentSlideIndex % activeCategory.topPerformers.length) === i 
                      ? "w-6 sm:w-7 h-1.5 bg-[#155EEF]" 
                      : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  )}
                />
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ===================== STUDENT ACHIEVEMENT PROFILE MODAL ===================== */}
      {selectedStudent && (() => {
        const isModalPercentile = selectedStudent.score.toLowerCase().includes('ile');
        const modalScoreValue = selectedStudent.score.replace('%ile', '').replace('%', '');
        const motivationalMessage = getStudentMotivation(selectedStudent);

        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-3.5 py-3 md:p-4 overscroll-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-profile-title"
          >
            {/* Dimmed & Blurred Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px] transition-opacity overscroll-none"
              onClick={() => setSelectedStudent(null)}
            />

            {/* Balanced Compact Minimal White Editorial Modal (mobile-optimized stack, desktop unchanged) */}
            <div
              className="relative w-full md:w-[92vw] max-w-[600px] h-auto bg-white dark:bg-slate-950 rounded-2xl shadow-[0_18px_48px_-14px_rgba(10,30,74,0.19)] border border-slate-200/90 dark:border-slate-800 overflow-hidden max-h-[calc(100dvh-1.5rem)] md:max-h-[calc(100dvh-2rem)] flex flex-col pointer-events-auto my-auto overscroll-none"
              style={{ animation: 'studentModalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes studentModalIn {
                  from { opacity: 0; transform: scale(0.97) translateY(5px); }
                  to   { opacity: 1; transform: scale(1) translateY(0); }
                }
              ` }} />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-white/90 md:bg-transparent text-slate-400 hover:text-[#0A1E4A] hover:bg-slate-100 dark:bg-slate-950/90 md:dark:bg-transparent dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Editorial Body (Smooth mobile scroll if needed; no desktop scroll stretch) */}
              <div className="overflow-y-auto md:overflow-y-visible overscroll-contain md:overscroll-none p-3.5 sm:p-4 md:p-6">

                {/* ==================== MOBILE LAYOUT (< md) ==================== */}
                <div className="flex flex-col md:hidden text-left">
                  {/* Top Row: Larger Photo on Left + Name, Class & Overall Score on Right */}
                  <div className="grid grid-cols-[128px_minmax(0,1fr)] min-[390px]:grid-cols-[138px_minmax(0,1fr)] sm:grid-cols-[152px_minmax(0,1fr)] gap-3.5 items-center pr-6">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-900/[0.06] dark:ring-white/10 shrink-0">
                      <Image
                        src={selectedStudent.image}
                        alt={selectedStudent.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 138px, 152px"
                        className="object-cover object-top"
                      />
                    </div>

                    <div className="min-w-0 flex flex-col justify-center">
                      <h4
                        id="student-profile-title"
                        className="text-[16.5px] min-[390px]:text-[17.5px] font-extrabold text-[#0A1E4A] dark:text-white leading-tight tracking-[-0.02em]"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {selectedStudent.name}
                      </h4>
                      <p className="mt-0.5 text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                        {selectedStudent.grade}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                        <div className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                          Overall Score
                        </div>
                        <div className="mt-0.5 inline-flex items-baseline leading-none tabular-nums">
                          <span className="text-[28px] min-[390px]:text-[32px] font-black tracking-[-0.03em] text-[#0A1E4A] dark:text-white">
                            {modalScoreValue}
                          </span>
                          <span className="text-[15px] min-[390px]:text-[17px] font-extrabold text-[#155EEF] dark:text-blue-400 ml-0.5">
                            {isModalPercentile ? '%ile' : '%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivational Note */}
                  <p className="mt-3 text-[11.5px] text-slate-600 dark:text-slate-300 leading-[1.48] font-medium border-l-2 border-[#155EEF]/35 pl-2.5">
                    {motivationalMessage}
                  </p>

                  {/* Subject Performance (Below Overall Score) */}
                  {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                      <h6 className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-1">
                        Subject Performance
                      </h6>
                      <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {selectedStudent.subjects.map((sub, i) => (
                          <li
                            key={i}
                            className="py-1.5 flex items-center justify-between gap-2.5"
                          >
                            <span className="text-[12px] font-medium text-[#0A1E4A] dark:text-slate-200">
                              {sub.name}
                            </span>
                            <span className="text-[13px] font-extrabold text-[#155EEF] dark:text-blue-400 tabular-nums tracking-tight shrink-0">
                              {sub.marks}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Student Experience (Below Subject Performance) */}
                  {selectedStudent.testimonial && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                        Student Experience
                      </div>
                      <p className="mt-1 text-[11.5px] text-slate-600 dark:text-slate-300 leading-[1.5] italic font-normal">
                        &ldquo;{selectedStudent.testimonial}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Target / Accomplishment */}
                  {selectedStudent.dreamCollege && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                        Target / Accomplishment
                      </div>
                      <div
                        className="mt-0.5 text-[13px] font-bold text-[#0A1E4A] dark:text-white leading-snug"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {selectedStudent.dreamCollege}
                      </div>
                    </div>
                  )}
                </div>

                {/* ==================== DESKTOP LAYOUT (md+, UNCHANGED) ==================== */}
                <div className="hidden md:grid md:grid-cols-[204px_minmax(0,1fr)] md:gap-6 items-stretch">

                  {/* LEFT SECTION: Student Portrait, Identity & Compact Student Experience */}
                  <div className="flex flex-col items-start text-left border-r border-slate-200/80 dark:border-slate-800 pr-5">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 ring-1 ring-slate-900/[0.06] dark:ring-white/10 shrink-0">
                      <Image
                        src={selectedStudent.image}
                        alt={selectedStudent.name}
                        fill
                        unoptimized
                        sizes="184px"
                        className="object-cover object-top"
                      />
                    </div>

                    <div className="mt-3 w-full">
                      <h4
                        id="student-profile-title-desktop"
                        className="text-[18px] font-extrabold text-[#0A1E4A] dark:text-white leading-tight tracking-[-0.02em]"
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {selectedStudent.name}
                      </h4>
                      <p className="mt-0.5 text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
                        {selectedStudent.grade}
                      </p>
                    </div>

                    {/* Compact Student Experience */}
                    {selectedStudent.testimonial && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 w-full text-left">
                        <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                          Student Experience
                        </div>
                        <p className="mt-1.5 text-[12px] text-slate-600 dark:text-slate-300 leading-[1.55] italic font-normal">
                          &ldquo;{selectedStudent.testimonial}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RIGHT SECTION: Overall Score, Motivation, Subject Marks & Target/Accomplishment */}
                  <div className="min-w-0 flex flex-col text-left pr-2">

                    {/* Achievement Score & Student-Specific Motivational Message */}
                    <div>
                      <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                        Overall Score
                      </div>
                      <div className="mt-1 inline-flex items-baseline leading-none tabular-nums">
                        <span className="text-[34px] font-black tracking-[-0.03em] text-[#0A1E4A] dark:text-white">
                          {modalScoreValue}
                        </span>
                        <span className="text-[19px] font-extrabold text-[#155EEF] dark:text-blue-400 ml-0.5">
                          {isModalPercentile ? '%ile' : '%'}
                        </span>
                      </div>

                      <p className="mt-2 text-[12.5px] text-slate-600 dark:text-slate-300 leading-[1.55] font-medium border-l-2 border-[#155EEF]/35 pl-3">
                        {motivationalMessage}
                      </p>
                    </div>

                    {/* Subject Performance (Clean Plain-White Rows with Subtle Dividers) */}
                    {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                        <h6 className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-1.5">
                          Subject Performance
                        </h6>
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                          {selectedStudent.subjects.map((sub, i) => (
                            <li
                              key={i}
                              className="py-1.5 flex items-center justify-between gap-3"
                            >
                              <span className="text-[13px] font-medium text-[#0A1E4A] dark:text-slate-200">
                                {sub.name}
                              </span>
                              <span className="text-[14.5px] font-extrabold text-[#155EEF] dark:text-blue-400 tabular-nums tracking-tight shrink-0">
                                {sub.marks}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Target / Accomplishment (Compact Plain Text Section) */}
                    {selectedStudent.dreamCollege && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                        <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                          Target / Accomplishment
                        </div>
                        <div
                          className="mt-1 text-[14px] font-bold text-[#0A1E4A] dark:text-white leading-snug"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                        >
                          {selectedStudent.dreamCollege}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================== VIEW ALL RESULTS MODAL ===================== */}
      <Dialog open={showAllResultsModal} onOpenChange={setShowAllResultsModal}>
        <FormModalDialogContent
          maxWidthClass="max-w-4xl"
          className="w-[94vw] sm:w-[92vw] md:w-[90vw] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
        >
          {/* Modal Header: Pinned with subtle bottom border */}
          <DialogHeader className="px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-200 dark:border-slate-800 text-left shrink-0 pr-14 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
            <DialogTitle className="text-[19px] sm:text-[22px] font-bold tracking-tight leading-tight">
              <span className="text-[#0A1E4A] dark:text-white">Bright Minds.</span>{' '}
              <span className="text-[#155EEF] dark:text-blue-400">Brighter Futures.</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Academic results and topper achievements of IDL Education students.
            </DialogDescription>
          </DialogHeader>

          {/* Modal Body: Scrollable Results Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6 sm:space-y-7 text-left overscroll-contain">
            {RESULTS_DATA.map((category) => (
              <div key={category.id} className="space-y-3 sm:space-y-3.5">
                {/* Result Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <h5 className="font-bold text-[13px] sm:text-[14px] text-[#0A1E4A] dark:text-slate-100 tracking-wide uppercase">
                    {category.headlineTitle} {category.headlineHighlight}
                  </h5>
                  <span className="text-[12px] sm:text-[12.5px] font-medium text-slate-500">
                    Highest: <strong className="font-bold text-[#155EEF] ml-1 text-[13px] sm:text-[13.5px]">{category.stats.highestScore.value}</strong>
                  </span>
                </div>

                {/* Result Cards Grid: 1 col on mobile, 2 on sm, 3 on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                  {category.topPerformers.map((performer) => (
                    <div 
                      key={performer.id}
                      className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFD] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-slate-300"
                    >
                      {/* Student Photo */}
                      <div className="relative w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-lg overflow-hidden shrink-0 bg-[#EAF2FC] border border-slate-200">
                        <Image
                          src={performer.image}
                          alt={performer.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      </div>

                      {/* Student Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h6 className="font-bold text-[13.5px] sm:text-[14px] text-[#0A1E4A] truncate">
                            {performer.name}
                          </h6>
                          <span className="px-2 py-0.5 rounded-full bg-[#FEF08A] text-[#0A1E4A] font-bold text-[12px] shrink-0">
                            {performer.score}
                          </span>
                        </div>
                        <p className="text-[11.5px] sm:text-[12px] font-medium text-slate-400 truncate mt-0.5">
                          {performer.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormModalDialogContent>
      </Dialog>

    </section>
  );
}
