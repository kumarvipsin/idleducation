'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Users, 
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
    description: 'Our students continue to achieve strong results through focused preparation and consistent guidance.',
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
        testimonial: 'IDL Education structured test series and mentorship turned complex topics into my strongest strengths.'
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
        testimonial: 'Daily practice papers and immediate doubt solving made board preparation stress-free.'
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
        testimonial: 'The teachers at IDL never let us leave any concept half-understood. Truly indebted to their support.'
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
        testimonial: 'The weekly assessments gave me real exam temperament months before the actual boards.'
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
        testimonial: 'Consistent revision modules kept all my revision notes crystal clear.'
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
        testimonial: 'Focused doubt-solving sessions resolved every problem step-by-step.'
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
    description: 'Our students continue to achieve strong results through focused preparation and consistent guidance.',
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
        testimonial: 'The conceptual clarity and mock question analysis at IDL Education gave me the winning edge.'
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
        testimonial: 'Solving past 10 years papers with targeted feedback made the difference between 90% and 98%.'
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
        testimonial: 'IDL’s personalized mentorship guided me whenever I felt overwhelmed with dual board and entrance prep.'
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
        testimonial: 'Writing skills workshops and structured answer keys elevated my presentation completely.'
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
        testimonial: 'Rigorous revision drills and teacher encouragement gave me unwavering confidence.'
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
        testimonial: 'Systematic study schedule created by my mentor kept me consistent throughout the year.'
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
    description: 'Our students continue to achieve strong results through focused preparation and consistent guidance.',
    stats: {
      highestScore: {
        value: '100%ile',
        label: 'Highest Percentile'
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
        testimonial: 'Getting into my dream course at SRCC was made possible by IDL’s domain-specific practice modules.'
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
        testimonial: 'The computerized mock test interface reflected the actual NTA portal exactly.'
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
        testimonial: 'The General Test reasoning and current affairs capsules were concise and immensely high-yielding.'
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
        testimonial: 'Targeted chapterwise speed tests boosted my question accuracy significantly.'
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
        testimonial: 'Expert faculty guided us on university course preference mapping meticulously.'
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
        testimonial: 'Comprehensive study materials saved countless hours searching across textbooks.'
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

export function AcademicExcellence() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // Starts at CLASS 10 -> CLASS 12 -> CUET (UG) -> repeat
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

  // Lock body scroll and handle Escape key for student profile popup
  useEffect(() => {
    if (selectedStudent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedStudent(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
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
      className="w-full pt-7 pb-9 sm:pt-9 sm:pb-12 md:pt-11 md:pb-14 bg-gradient-to-b from-white via-[#F4F8FD] to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 overflow-hidden relative"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Container aligned with Courses We Offer width (max-w-[1360px]) */}
      <div className="w-full max-w-[1360px] mx-auto px-3 sm:px-4 md:px-6">
        
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
          <h2 className="text-[13.5px] min-[360px]:text-[14.5px] min-[400px]:text-[16px] sm:text-[24px] md:text-[30px] lg:text-[34px] font-[750] tracking-[-0.02em] leading-normal max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Results That Reflect.{' '}</span>
            <span className="text-[#155EEF] dark:text-blue-400">Excellence That Inspires.</span>
          </h2>
        </div>

        {/* ===================== CATEGORY TABS (TEXT ONLY WITH UNDERLINE, NO BUTTON SHAPE) ===================== */}
        <div className="w-full mb-[22px] sm:mb-[26px]">
          <div className="flex justify-center px-2">
            <div 
              role="tablist" 
              aria-label="Result Categories"
              className="inline-flex items-center justify-center gap-6 sm:gap-8 select-none"
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
                      "pb-1 text-[11.5px] sm:text-[12.5px] font-[900] tracking-wider uppercase transition-all duration-200 cursor-pointer bg-transparent outline-none focus-visible:outline-none border-b-2",
                      isActive
                        ? "border-[#155EEF] text-[#155EEF] dark:border-blue-400 dark:text-blue-300"
                        : "border-transparent text-[#64748B] hover:text-[#062B67] dark:text-slate-400 dark:hover:text-white"
                    )}
                  >
                    <span>{cat.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================== MAIN RESULTS CONTAINER ===================== */}
        {/* Premium pure-white rounded container elevated with soft shadow and thin blue top border */}
        <div 
          id={`panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="relative w-full rounded-[20px] sm:rounded-[24px] bg-[#F0F6FE] dark:bg-slate-900 border border-[#CCE0FB] border-t-2 border-t-[#155EEF] dark:border-slate-800 dark:border-t-[#155EEF] p-3.5 sm:p-5 lg:p-6 shadow-[0_4px_24px_-4px_rgba(6,43,103,0.06),0_1px_3px_rgba(6,43,103,0.02)] overflow-hidden transition-all duration-300"
        >
          {/* Background Soft Ambient Light - subtle glow in bottom left */}
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl pointer-events-none" />

          {/* ----------------- TOP SECTION: SUMMARY + 3 STATS ----------------- */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 sm:gap-5 lg:gap-8 pb-2.5 sm:pb-3.5">
            
            {/* Left: Heading + Refined Description */}
            <div className="w-full min-w-0 lg:w-[48%] xl:w-[50%] flex flex-col justify-center">
              <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-[950] tracking-tight flex items-center gap-2 leading-tight text-[#062B67] dark:text-white">
                <span>
                  {activeCategory.headlineTitle}
                </span>
                <span className="text-slate-400 font-bold">•</span>
                <span>
                  {activeCategory.headlineHighlight}
                </span>
              </h3>

              <p className="text-[13px] sm:text-[14px] text-slate-600 dark:text-slate-300 mt-2 sm:mt-2.5 leading-relaxed font-semibold max-w-xl break-words">
                {activeCategory.description}
              </p>
            </div>

            {/* Right: 3 Typographic Data Displays */}
            <div className="w-full min-w-0 pt-2.5 lg:pt-0 border-t border-[#CCE0FB] lg:border-t-0 lg:border-l lg:border-[#CCE0FB] dark:border-slate-800 lg:pl-5 xl:pl-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3 w-full">
                
                {/* Stat 1: Highest Score (Modern Premium Card) */}
                <div className="group relative flex flex-col items-center justify-center text-center p-2.5 sm:p-3 lg:p-3.5 min-h-[76px] sm:min-h-[84px] h-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-t-[2.5px] border-t-[#EA580C] shadow-[0_2px_8px_-2px_rgba(234,88,12,0.08),0_1px_2px_rgba(6,43,103,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  {/* Strong Navy Number with colored symbol */}
                  {(() => {
                    const raw = activeCategory.stats.highestScore.value;
                    const isPercentile = raw.includes('%ile');
                    const isPercent = raw.includes('%');
                    const num = raw.replace('%ile', '').replace('%', '');
                    return (
                      <div className="text-[#062B67] dark:text-white font-[950] text-[20px] xs:text-[22px] sm:text-[26px] lg:text-[30px] tracking-tight leading-none h-[28px] xs:h-[30px] sm:h-[34px] flex items-baseline justify-center">
                        <span>{num}</span>
                        {isPercentile ? (
                          <span className="text-[10px] xs:text-[11px] sm:text-[13px] font-extrabold text-[#EA580C] dark:text-orange-400 ml-0.5">%ile</span>
                        ) : isPercent ? (
                          <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-extrabold text-[#EA580C] dark:text-orange-400 ml-0.5">%</span>
                        ) : null}
                      </div>
                    );
                  })()}
                  <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 py-0.5 rounded-full text-[9.5px] xs:text-[10px] sm:text-[11px] font-bold bg-[#FFF7ED] dark:bg-orange-950/30 text-[#C2410C] dark:text-orange-300 border border-[#FFEDD5] dark:border-orange-900/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shrink-0" />
                    <span className="truncate">{activeCategory.stats.highestScore.label}</span>
                  </div>
                </div>

                {/* Stat 2: Students 95%+ (Top: 95%+, Bottom: Student Count) */}
                {(() => {
                  const isCuet = activeCategory.id === 'cuet';
                  const topNumber = isCuet ? '100%ile' : '95%+';
                  const bottomLabel = isCuet ? `${activeCategory.stats.students95Plus.value} Subjects` : `${activeCategory.stats.students95Plus.value} Students`;
                  const numOnly = topNumber.replace('%ile', '').replace('%+', '').replace('%', '');
                  const symbol = topNumber.includes('%ile') ? '%ile' : topNumber.includes('%+') ? '%+' : '%';

                  return (
                    <div className="group relative flex flex-col items-center justify-center text-center p-2.5 sm:p-3 lg:p-3.5 min-h-[76px] sm:min-h-[84px] h-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-t-[2.5px] border-t-[#10B981] shadow-[0_2px_8px_-2px_rgba(16,185,129,0.08),0_1px_2px_rgba(6,43,103,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="text-[#062B67] dark:text-white font-[950] text-[20px] xs:text-[22px] sm:text-[26px] lg:text-[30px] tracking-tight leading-none h-[28px] xs:h-[30px] sm:h-[34px] flex items-baseline justify-center">
                        <span>{numOnly}</span>
                        <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-extrabold text-[#10B981] dark:text-emerald-400 ml-0.5">{symbol}</span>
                      </div>
                      <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 py-0.5 rounded-full text-[9.5px] xs:text-[10px] sm:text-[11px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/30 text-[#059669] dark:text-emerald-300 border border-[#D1FAE5] dark:border-emerald-900/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                        <span className="truncate">{bottomLabel}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Stat 3: Students 90%+ (Top: 90%+, Bottom: Student Count) */}
                {(() => {
                  const isCuet = activeCategory.id === 'cuet';
                  const topNumber = isCuet ? '98%+' : '90%+';
                  const bottomLabel = `${activeCategory.stats.students90Plus.value} Students`;
                  const numOnly = topNumber.replace('%+', '').replace('%', '');
                  const symbol = topNumber.includes('%+') ? '%+' : '%';

                  return (
                    <div className="group relative flex flex-col items-center justify-center text-center p-2.5 sm:p-3 lg:p-3.5 min-h-[76px] sm:min-h-[84px] h-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 border-t-[2.5px] border-t-[#155EEF] shadow-[0_2px_8px_-2px_rgba(21,94,239,0.08),0_1px_2px_rgba(6,43,103,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className="text-[#062B67] dark:text-white font-[950] text-[20px] xs:text-[22px] sm:text-[26px] lg:text-[30px] tracking-tight leading-none h-[28px] xs:h-[30px] sm:h-[34px] flex items-baseline justify-center">
                        <span>{numOnly}</span>
                        <span className="text-[11px] xs:text-[12px] sm:text-[14px] font-extrabold text-[#155EEF] dark:text-blue-400 ml-0.5">{symbol}</span>
                      </div>
                      <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 xs:px-2.5 py-0.5 rounded-full text-[9.5px] xs:text-[10px] sm:text-[11px] font-bold bg-[#EFF6FF] dark:bg-blue-950/30 text-[#155EEF] dark:text-blue-300 border border-[#DBEAFE] dark:border-blue-900/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                        <span className="truncate">{bottomLabel}</span>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

          </div>

          {/* ----------------- MIDDLE ROW: TOP PERFORMERS HEADER ----------------- */}
          <div className="relative z-10 flex items-center justify-between mt-2.5 sm:mt-3 mb-3 sm:mb-3.5 px-0.5 w-full">
            {/* Left: Bar Chart Icon + Title */}
            <div className="flex items-center gap-2 shrink-0">
              <BarChartIcon className="w-[18px] h-[18px] text-[#062B67] dark:text-blue-400 shrink-0" />
              <h4 className="text-[#062B67] dark:text-white font-[950] text-[16px] sm:text-[17.5px] tracking-tight">
                Top Performers
              </h4>
            </div>
          </div>

          {/* ----------------- CAROUSEL OF STUDENT CARDS ----------------- */}
          <div className="relative z-10 w-full overflow-hidden">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: 'start',
                loop: false,
                dragFree: false,
                containScroll: 'trimSnaps'
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-2.5 lg:-ml-3">
                {activeCategory.topPerformers.map((student) => {
                  const isPercentile = student.score.includes('%ile');
                  const scoreValue = isPercentile ? student.score.replace('%ile', '') : student.score.replace('%', '');

                  return (
                    <CarouselItem 
                      key={student.id} 
                      className="pl-2 sm:pl-2.5 lg:pl-3 basis-[47%] xs:basis-[44%] sm:basis-[32%] md:basis-[24%] lg:basis-1/5"
                    >
                      {/* Student Card (Clean, uniform, no highlighted border) */}
                      <div 
                        onClick={() => setSelectedCardId(student.id)}
                        className="bg-white dark:bg-slate-900 rounded-[16px] border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_4px_rgba(10,30,66,0.02)] hover:shadow-[0_4px_16px_rgba(10,30,66,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col group h-full select-none overflow-hidden cursor-pointer"
                      >
                        
                        {/* Student image: subtle 5-8% reduction on mobile (aspect-[1/0.93]) for ideal text balance */}
                        <div className="relative w-full aspect-[1/0.93] sm:aspect-square bg-[#EAF2FC] dark:bg-slate-800 overflow-hidden">
                          <Image
                            src={student.image}
                            alt={student.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover object-top group-hover:scale-103 transition-transform duration-500"
                            priority={false}
                          />
                        </div>

                        {/* Lower Information Area: Two-Column Composition + Clean Bottom Action Area */}
                        <div className="relative pt-2.5 sm:pt-3 pb-2.5 sm:pb-3 px-2.5 sm:px-3 lg:px-3.5 flex flex-col flex-1 justify-between overflow-hidden">
                          
                          {/* Two-Column Composition: Left = Student Identity, Right = Percentage */}
                          <div className="relative z-10 flex items-center justify-between gap-1.5 sm:gap-2 min-h-[48px] sm:min-h-[52px]">
                            
                            {/* Left Column: Student Name + Class/Stream/College with comfortable breathing room */}
                            <div className="min-w-0 flex-1 text-left flex flex-col justify-center pr-1 sm:pr-1.5">
                              <h5 className="font-[800] text-[12.5px] xs:text-[13px] sm:text-[14px] lg:text-[14.5px] tracking-tight leading-[1.22] transition-colors break-words text-[#062B67] dark:text-white group-hover:text-[#155EEF]">
                                {student.name}
                              </h5>
                              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-[1.2] break-words" title={student.grade}>
                                {student.grade}
                              </p>
                            </div>

                            {/* Right Column: Visually strong percentage with slightly secondary % symbol */}
                            <div className="relative shrink-0 text-right flex flex-col items-end justify-center min-w-[36px] sm:min-w-[44px]">
                              {isPercentile ? (
                                <div className="relative z-10 flex flex-col items-end">
                                  <span className="text-[18px] sm:text-[20px] lg:text-[22px] font-[950] text-[#EA580C] dark:text-orange-400 tracking-tight leading-none">
                                    {scoreValue}
                                  </span>
                                  <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#10B981] dark:text-emerald-400 tracking-wider uppercase mt-0.5 leading-none">
                                    %ile
                                  </span>
                                </div>
                              ) : (
                                <div className="relative z-10 flex items-baseline">
                                  <span className="text-[18px] sm:text-[20px] lg:text-[22px] font-[950] text-[#EA580C] dark:text-orange-400 tracking-tight leading-none">
                                    {scoreValue}
                                  </span>
                                  <span className="text-[10.5px] sm:text-[11.5px] font-bold text-[#EA580C]/75 dark:text-orange-400/80 ml-0.5 leading-none">
                                    %
                                  </span>
                                </div>
                              )}
                            </div>

                          </div>

                          {/* Bottom Action Area: Clean View Profile with Subtle Top Divider */}
                          <div className="relative z-10 w-full pt-2 sm:pt-2.5 mt-auto border-t border-slate-100 dark:border-slate-800 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCardId(student.id);
                                setSelectedStudent(student);
                              }}
                              className="text-[11px] sm:text-[11.5px] lg:text-[12px] inline-flex items-center gap-1.5 leading-none group/btn transition-colors cursor-pointer text-left font-semibold text-[#155EEF] hover:text-[#062B67] dark:text-blue-400 dark:hover:text-white"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform shrink-0" />
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

          {/* ----------------- PAGINATION INDICATORS WITH COMFORTABLE SPACING ----------------- */}
          <div className="w-full flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 mb-0.5">
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
                    currentSlideIndex === i 
                      ? "w-5 sm:w-6 h-1.5 bg-[#155EEF] dark:bg-blue-400" 
                      : "w-1.5 h-1.5 bg-[#CCE0FB] dark:bg-slate-700 hover:bg-[#155EEF]/50"
                  )}
                />
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* ===================== STUDENT PROFILE FLOATING POPUP (PREMIUM IDL DESIGN) ===================== */}
      {selectedStudent && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-5 md:p-6" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="student-profile-title"
        >
          {/* Dimmed & Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px] transition-opacity" 
            onClick={() => setSelectedStudent(null)} 
          />
          
          {/* Centered Floating Modal Card */}
          <div
            className="relative w-[92vw] max-w-[460px] sm:max-w-[480px] bg-white dark:bg-slate-950 rounded-[24px] sm:rounded-[26px] shadow-[0_8px_24px_-6px_rgba(11,46,107,0.08),0_20px_56px_-12px_rgba(11,46,107,0.13)] border border-[#D7E4F5] dark:border-slate-800 overflow-hidden max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] flex flex-col pointer-events-auto my-auto"
            style={{ animation: 'studentModalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes studentModalIn {
                from { opacity: 0; transform: scale(0.96) translateY(6px); }
                to   { opacity: 1; transform: scale(1) translateY(0); }
              }
            ` }} />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-3 right-3.5 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0B2E6B] hover:bg-[#F5F8FD] dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Header: Student Identity */}
            <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 bg-white dark:bg-slate-950 border-b border-[#E8EFF8] dark:border-slate-800/80 shrink-0 pr-12 sm:pr-14">
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                {/* Circular Profile Photo with brand accent ring */}
                <div className="relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-full shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#246BFF]/20 to-[#246BFF]/5 dark:from-blue-500/20 dark:to-blue-500/5 p-[2.5px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#F5F8FD] dark:bg-slate-800">
                      <Image
                        src={selectedStudent.image}
                        alt={selectedStudent.name}
                        fill
                        unoptimized
                        sizes="68px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Name & Class */}
                <div className="min-w-0 text-left">
                  <h4 id="student-profile-title" className="text-[18px] sm:text-[19px] font-[800] text-[#0B2E6B] dark:text-white leading-tight tracking-[-0.01em]" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {selectedStudent.name}
                  </h4>
                  <p className="text-[#64748B] dark:text-slate-400 text-[11.5px] sm:text-[12px] font-medium leading-normal mt-0.5 tracking-[0.01em]">
                    {selectedStudent.grade}
                  </p>
                </div>
              </div>

              {/* Percentage on the right */}
              <div className="shrink-0 ml-3 text-right">
                <span className="text-[22px] sm:text-[24px] font-[900] text-[#F26500] leading-none tracking-tight">
                  {selectedStudent.score}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-3.5 sm:space-y-4 overflow-y-auto overscroll-contain text-left">
              {/* Subject Scores / Breakdown */}
              {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                <div>
                  <h6 className="text-[10px] sm:text-[10.5px] font-bold text-[#0B2E6B]/70 dark:text-slate-400 uppercase tracking-[0.08em] mb-2 sm:mb-2.5">
                    Subject Performance
                  </h6>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {selectedStudent.subjects.map((sub, i) => (
                      <div 
                        key={i} 
                        className="bg-[#F5F8FD] dark:bg-slate-900/60 px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-[14px] sm:rounded-[15px] border border-[#D7E4F5] dark:border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-[46px] transition-colors duration-200 hover:border-[#B4CCE8] dark:hover:border-slate-700"
                      >
                        <span className="text-[11px] min-[380px]:text-[11.5px] sm:text-[12.5px] text-[#0B2E6B] dark:text-slate-200 font-semibold leading-[1.2] tracking-tight">
                          {sub.name}
                        </span>
                        <span className="text-[12px] sm:text-[13.5px] font-extrabold text-[#246BFF] dark:text-blue-400 shrink-0 text-right tabular-nums tracking-tight">
                          {sub.marks}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target / Accomplishment */}
              {selectedStudent.dreamCollege && (
                <div className="bg-[#FFFAF3] dark:bg-amber-950/20 px-4 sm:px-4.5 py-3 sm:py-3.5 rounded-[14px] sm:rounded-[15px] border border-[#FBE5C8] dark:border-amber-900/40 text-left">
                  <div className="text-[9.5px] sm:text-[10px] font-bold text-[#C26500] dark:text-amber-400 uppercase tracking-[0.1em] leading-none mb-1.5">
                    Target / Accomplishment
                  </div>
                  <div className="text-[13.5px] sm:text-[14.5px] text-[#0B2E6B] dark:text-slate-100 font-bold leading-snug" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {selectedStudent.dreamCollege}
                  </div>
                </div>
              )}

              {/* Student Experience */}
              {selectedStudent.testimonial && (
                <div className="relative bg-[#F5F8FD] dark:bg-blue-950/20 px-4 sm:px-4.5 py-3 sm:py-3.5 rounded-[14px] sm:rounded-[15px] border border-[#D7E4F5] dark:border-blue-900/40 text-left overflow-hidden">
                  {/* Oversized quotation watermark */}
                  <div className="absolute top-1 right-2 text-[52px] sm:text-[60px] leading-none font-serif text-[#0B2E6B]/[0.04] dark:text-white/[0.04] select-none pointer-events-none" aria-hidden="true">
                    &ldquo;
                  </div>
                  <div className="relative z-[1]">
                    <div className="text-[9.5px] sm:text-[10px] font-bold text-[#246BFF] dark:text-blue-400 uppercase tracking-[0.1em] leading-none mb-2">
                      Student Experience
                    </div>
                    <p className="text-[12px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-[1.65] italic font-normal">
                      &ldquo;{selectedStudent.testimonial}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW ALL RESULTS MODAL ===================== */}
      <Dialog open={showAllResultsModal} onOpenChange={setShowAllResultsModal}>
        <FormModalDialogContent
          maxWidthClass="max-w-4xl"
          className="w-[94vw] sm:w-[92vw] md:w-[90vw]"
        >
          {/* Modal Header: Pinned with subtle bottom border */}
          <DialogHeader className="px-6 sm:px-8 py-4 sm:py-5 border-b border-[#DCE7F6] dark:border-slate-800 text-left shrink-0 pr-14 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
            <DialogTitle className="text-[19px] sm:text-[22px] font-bold tracking-tight leading-tight">
              <span className="text-[#0B1F4B] dark:text-white">Bright Minds.</span>{' '}
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
                {/* Result Section Header: Clean title on left, Highest score on right */}
                <div className="flex items-center justify-between border-b border-[#DCE7F6] dark:border-slate-800/80 pb-2.5">
                  <h5 className="font-bold text-[13px] sm:text-[14px] text-[#0B1F4B] dark:text-slate-100 tracking-wide uppercase">
                    {category.headlineTitle} {category.headlineHighlight}
                  </h5>
                  <span className="text-[12px] sm:text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
                    Highest: <strong className="font-bold text-[#FF6B21] ml-1 text-[13px] sm:text-[13.5px]">{category.stats.highestScore.value}</strong>
                  </span>
                </div>

                {/* Result Cards Grid: 1 col on mobile, 2 on sm, 3 on lg */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                  {category.topPerformers.map((performer) => (
                    <div 
                      key={performer.id}
                      className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-3.5 rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-[#B9D0ED] dark:hover:border-slate-700"
                    >
                      {/* Student Photo */}
                      <div className="relative w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-[#DCE7F6]/80 dark:border-slate-700">
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
                          <h6 className="font-bold text-[13.5px] sm:text-[14px] text-[#0B1F4B] dark:text-slate-100 truncate">
                            {performer.name}
                          </h6>
                          <span className="font-bold text-[13px] sm:text-[13.5px] text-[#FF6B21] shrink-0">
                            {performer.score}
                          </span>
                        </div>
                        <p className="text-[11.5px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
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
