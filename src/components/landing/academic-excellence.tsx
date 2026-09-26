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
  Quote, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  X,
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
  headlineTitle: string;
  headlineHighlight: string;
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
    headlineTitle: 'CLASS 10',
    headlineHighlight: '2026 RESULTS',
    description: 'Celebrating extraordinary foundation milestones and high-scoring board accomplishments.',
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
        grade: 'Class 10 | All Subjects',
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
        grade: 'Class 10 | All Subjects',
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
        grade: 'Class 10 | All Subjects',
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
        grade: 'Class 10 | All Subjects',
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
        grade: 'Class 10 | All Subjects',
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
        grade: 'Class 10 | All Subjects',
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
    headlineTitle: 'CLASS 12',
    headlineHighlight: '2026 RESULTS',
    description: 'Our students continue to achieve outstanding results in board examinations.',
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
        grade: 'Class 12 | Science',
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
        grade: 'Class 12 | Commerce',
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
        grade: 'Class 12 | Science',
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
        grade: 'Class 12 | Humanities',
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
        grade: 'Class 12 | Science',
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
        grade: 'Class 12 | Commerce',
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
    headlineTitle: 'CUET (UG)',
    headlineHighlight: '2026 RESULTS',
    description: '100 Percentilers securing dream colleges across Delhi University and premier central universities.',
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
        grade: 'CUET UG | SRCC DU',
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
        grade: 'CUET UG | Hindu College',
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
        grade: 'CUET UG | Hansraj College',
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
        grade: 'CUET UG | BHU Campus',
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
        grade: 'CUET UG | Jamia Millia',
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
        grade: 'CUET UG | KMC DU',
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

export function AcademicExcellence() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(1); // Default to CLASS 12 matching reference
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformer | null>(null);
  const [showAllResultsModal, setShowAllResultsModal] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeCategory = useMemo(() => {
    return RESULTS_DATA[activeCategoryIndex] || RESULTS_DATA[1];
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
    onCarouselSelect();
    carouselApi.on('select', onCarouselSelect);
    carouselApi.on('reInit', onCarouselSelect);
    return () => {
      carouselApi.off('select', onCarouselSelect);
      carouselApi.off('reInit', onCarouselSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  // Reset carousel to first card when category tab changes
  const handleTabChange = (index: number) => {
    setActiveCategoryIndex(index);
    if (carouselApi) {
      carouselApi.scrollTo(0);
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
      className="w-full pt-6 pb-6 sm:pt-8 sm:pb-9 md:pt-12 md:pb-11 bg-white dark:bg-background overflow-hidden relative"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* ===================== HEADER SECTION ===================== */}
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-3">
          <h2 className="text-[24px] sm:text-[30px] md:text-[38px] font-[720] tracking-[-0.02em] leading-[1.15]">
            <span className="text-[#062B67] dark:text-white">Academic</span>{' '}
            <span className="text-[#155EEF] dark:text-blue-400">Results</span>
          </h2>
        </div>

        {/* ===================== CATEGORY TABS ===================== */}
        {/* Minimal text-tab navigation */}
        <div className="w-full mb-3 sm:mb-4 md:mb-5">
          <div className="flex justify-center px-2">
            <div 
              role="tablist" 
              aria-label="Result Categories"
              className="inline-flex items-center justify-center gap-7 sm:gap-8 md:gap-9 select-none"
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
                      "relative pb-1.5 sm:pb-2 text-[13.5px] sm:text-[15px] md:text-[16px] tracking-wide uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap bg-transparent border-0 shadow-none rounded-none outline-none focus-visible:outline-none",
                      isActive
                        ? "text-[#062B67] dark:text-white font-[680]"
                        : "text-[#5A6E85] dark:text-slate-400 font-[520] hover:text-[#062B67] dark:hover:text-white"
                    )}
                  >
                    <span>{cat.tabLabel}</span>
                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#155EEF] dark:bg-blue-400 rounded-full transition-all duration-200" 
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================== RESULTS CONTAINER ===================== */}
        {/* Compact, premium container with delicate borders and soft surfaces */}
        <div 
          id={`panel-${activeCategory.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory.id}`}
          className="relative rounded-[22px] sm:rounded-[28px] lg:rounded-[32px] bg-[#F6FAFE] dark:bg-slate-900/90 border border-[#DCE8F8] dark:border-slate-800 p-3.5 sm:p-5 lg:p-6 shadow-[0_6px_24px_-6px_rgba(6,43,103,0.04)] dark:shadow-none overflow-hidden"
        >
          {/* Background Soft Fluid Organic Waves Matching Reference */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Top-Right Organic Wave Accent */}
            <svg 
              className="absolute -top-10 -right-10 w-[380px] sm:w-[500px] lg:w-[620px] h-auto text-[#E6F1FD]/80 dark:text-blue-950/30" 
              viewBox="0 0 680 440" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M140 0C300 110 460 40 680 200V0H140Z" 
                fill="currentColor" 
              />
              <path 
                d="M260 0C400 140 520 90 680 270V0H260Z" 
                fill="currentColor" 
                opacity="0.5" 
              />
            </svg>

            {/* Bottom-Left Organic Wave Accent */}
            <svg 
              className="absolute -bottom-14 -left-14 w-[320px] sm:w-[440px] lg:w-[540px] h-auto text-[#E6F1FD]/70 dark:text-blue-950/20" 
              viewBox="0 0 620 400" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0 220C150 160 300 240 480 380H0V220Z" 
                fill="currentColor" 
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-stretch">
            
            {/* ----------------- LEFT SIDE: SUMMARY CARD (Compact, Strong & Premium) ----------------- */}
            <div className="w-full lg:w-[35%] xl:w-[34%] shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-[18px] sm:rounded-[22px] p-4 sm:p-5 pb-3.5 sm:pb-4 border border-[#DFEAF8] dark:border-slate-800 shadow-[0_2px_14px_rgba(6,43,103,0.03)] h-full flex flex-col justify-between relative z-10">
                
                {/* Title & Description */}
                <div>
                  {/* Top orange accent bar - short & premium */}
                  <div className="w-8 sm:w-10 h-1 sm:h-1.5 rounded-full bg-[#FF5500] mb-2 sm:mb-2.5" />
                  
                  {/* Category Title e.g. CLASS 12 • 2026 RESULTS */}
                  <h3 className="text-[17px] xs:text-[19px] sm:text-[22px] lg:text-[24px] font-[750] tracking-tight flex items-center gap-1.5 sm:gap-2 leading-none">
                    <span className="text-[#062B67] dark:text-white font-[750]">
                      {activeCategory.headlineTitle}
                    </span>
                    <span className="text-[#CBD5E1] dark:text-slate-700 font-normal">•</span>
                    <span className="text-[#155EEF] dark:text-blue-400 font-[750]">
                      {activeCategory.headlineHighlight}
                    </span>
                  </h3>

                  <p className="text-[12px] sm:text-[13px] lg:text-[13.5px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
                    {activeCategory.description}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-slate-100 dark:bg-slate-800/80 my-3 sm:my-3.5" />

                {/* 3 Key Statistics in 1 Tight Balanced Row with Clean Dividers */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 py-0">
                  
                  {/* Stat 1: Highest Score */}
                  <div className="flex flex-col items-center text-center px-1 sm:px-2">
                    <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-[#FFF5EA] dark:bg-amber-950/40 text-[#FF7A00] flex items-center justify-center mb-1 mx-auto">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-[#062B67] dark:text-white font-[750] text-[20px] xs:text-[22px] sm:text-[25px] lg:text-[27px] tracking-tight leading-none mb-0.5">
                      {activeCategory.stats.highestScore.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] lg:text-[11.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      {activeCategory.stats.highestScore.label}
                    </span>
                  </div>

                  {/* Stat 2: Students 90%+ */}
                  <div className="flex flex-col items-center text-center px-1 sm:px-2">
                    <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-[#EBF3FE] dark:bg-blue-950/40 text-[#0A5CFF] dark:text-blue-400 flex items-center justify-center mb-1 mx-auto">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-[#062B67] dark:text-white font-[750] text-[20px] xs:text-[22px] sm:text-[25px] lg:text-[27px] tracking-tight leading-none mb-0.5">
                      {activeCategory.stats.students90Plus.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] lg:text-[11.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      {activeCategory.stats.students90Plus.label}
                    </span>
                  </div>

                  {/* Stat 3: Students 95%+ */}
                  <div className="flex flex-col items-center text-center px-1 sm:px-2">
                    <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-[#E8F8EE] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 flex items-center justify-center mb-1 mx-auto">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-[#062B67] dark:text-white font-[750] text-[20px] xs:text-[22px] sm:text-[25px] lg:text-[27px] tracking-tight leading-none mb-0.5">
                      {activeCategory.stats.students95Plus.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] lg:text-[11.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      {activeCategory.stats.students95Plus.label}
                    </span>
                  </div>
                </div>

                {/* Motivational Quote at Bottom - compact & neat */}
                <div className="mt-3 sm:mt-3.5 bg-[#F4F8FD] dark:bg-slate-800/60 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-[#E2EDF8] dark:border-slate-800/80 text-[11px] sm:text-[12px] text-slate-600 dark:text-slate-300 leading-snug flex items-start gap-1.5 sm:gap-2">
                  <span className="text-[#0A5CFF] text-base sm:text-lg font-serif font-black leading-none shrink-0 mt-0.5">“</span>
                  <p className="italic">
                    {activeCategory.quote.text.trim()}{' '}
                    <strong className="text-[#0A5CFF] dark:text-blue-400 not-italic font-bold">
                      {activeCategory.quote.highlight}
                    </strong>
                  </p>
                </div>

              </div>
            </div>

            {/* ----------------- RIGHT SIDE: TOP PERFORMERS CAROUSEL ----------------- */}
            <div className="w-full lg:w-[65%] xl:w-[66%] flex flex-col justify-between mt-1 sm:mt-0">
              
              {/* Top Performers Header + Navigation Arrows */}
              <div className="flex items-center justify-between mb-2 sm:mb-2.5 px-0.5">
                <h4 className="text-[#062B67] dark:text-white font-bold text-[15px] sm:text-[17px] tracking-tight">
                  Top Performers
                </h4>

                {/* Small, subtle circular arrows beside heading */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={scrollPrev}
                    aria-label="Previous performer"
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-[#DCE6F5] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#062B67] dark:text-white flex items-center justify-center hover:bg-[#F0F5FF] dark:hover:bg-slate-800 hover:border-[#155EEF]/40 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    aria-label="Next performer"
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full border border-[#DCE6F5] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#062B67] dark:text-white flex items-center justify-center hover:bg-[#F0F5FF] dark:hover:bg-slate-800 hover:border-[#155EEF]/40 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Carousel Container */}
              {/* Desktop: 4 cards visible at once. Mobile: Horizontal swipe carousel with partial neighboring cards (peek effect) */}
              <div className="relative w-full overflow-hidden">
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
                    {activeCategory.topPerformers.map((student) => (
                      <CarouselItem 
                        key={student.id} 
                        className="pl-2.5 sm:pl-3 lg:pl-3 basis-[80%] xs:basis-[75%] sm:basis-[45%] md:basis-[33%] lg:basis-1/4"
                      >
                        {/* Student Card - Match Reference Screenshot */}
                        <div className="bg-white dark:bg-slate-900 rounded-[16px] sm:rounded-[18px] border border-[#DCE6F5] dark:border-slate-800 shadow-[0_2px_10px_rgba(6,43,103,0.03)] hover:shadow-[0_6px_18px_rgba(6,43,103,0.07)] transition-all duration-300 flex flex-col group h-full select-none overflow-hidden">
                          
                          {/* Student Portrait Image: Flush with top & sides */}
                          <div className="relative w-full aspect-[4/4.3] bg-[#E9F0FA] dark:bg-slate-800 overflow-hidden">
                            <Image
                              src={student.image}
                              alt={student.name}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 65vw, (max-width: 1024px) 30vw, 22vw"
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              priority={false}
                            />
                          </div>

                          {/* Overlapping Orange Score Badge */}
                          <div className="relative -mt-3 sm:-mt-3.5 z-20 flex justify-center">
                            <div className="bg-[#FF6B21] text-white text-[11px] sm:text-[11.5px] font-bold px-3 py-0.5 rounded-full shadow-[0_2px_6px_rgba(255,107,33,0.3)] whitespace-nowrap tracking-tight">
                              {student.score}
                            </div>
                          </div>

                          {/* Student Info Body */}
                          <div className="pt-2 pb-2.5 sm:pb-3 px-1.5 text-center flex flex-col items-center flex-1 justify-between">
                            <div className="w-full">
                              <h5 className="font-bold text-[13px] sm:text-[14px] text-[#062B67] dark:text-white group-hover:text-[#155EEF] dark:group-hover:text-blue-400 transition-colors truncate">
                                {student.name}
                              </h5>
                              <p className="text-[11px] sm:text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5" title={student.grade}>
                                {student.grade}
                              </p>
                            </div>

                            {/* View Profile Action - Subtle text link matching reference */}
                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="text-[11px] sm:text-[11.5px] font-semibold text-[#155EEF] dark:text-blue-400 hover:text-[#062B67] dark:hover:text-white inline-flex items-center gap-1 mt-1.5 sm:mt-2 group/btn transition-colors cursor-pointer"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* Small Carousel Dots */}
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5">
                {activeCategory.topPerformers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => carouselApi?.scrollTo(i)}
                    aria-label={`Jump to performer ${i + 1}`}
                    className="p-2 cursor-pointer group flex items-center justify-center min-w-[32px] min-h-[32px]"
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all duration-300",
                        currentSlideIndex === i 
                          ? "w-7 sm:w-8 h-2 bg-[#062B67] dark:bg-blue-400" 
                          : "w-2 h-2 bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400"
                      )}
                    />
                  </button>
                ))}
              </div>

            </div>
          </div>

          {/* ===================== VIEW ALL RESULTS CTA (TEXT ONLY) ===================== */}
          <div className="mt-2.5 sm:mt-3.5 pt-0.5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllResultsModal(true)}
              className="inline-flex items-center justify-center gap-1.5 text-[#062B67] dark:text-blue-400 hover:text-[#155EEF] dark:hover:text-blue-300 text-[12.5px] sm:text-[13px] font-bold py-1 px-3 transition-colors cursor-pointer group bg-transparent border-0 shadow-none"
            >
              <span>View All Results</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* ===================== STUDENT PROFILE MODAL ===================== */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full p-0 overflow-hidden bg-white dark:bg-slate-900 border border-[#DCE6F5] dark:border-slate-800 rounded-[22px] shadow-2xl [&>button:last-child]:hidden">
          {selectedStudent && (
            <div>
              {/* Header Gradient Banner */}
              <div className="relative bg-gradient-to-r from-[#062B67] to-[#155EEF] p-5 text-white">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-white/80 overflow-hidden shadow-md shrink-0 bg-slate-100">
                    <Image
                      src={selectedStudent.image}
                      alt={selectedStudent.name}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <div className="inline-block bg-[#FF6B21] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mb-1">
                      {selectedStudent.score}
                    </div>
                    <DialogTitle className="text-lg font-bold text-white leading-tight">
                      {selectedStudent.name}
                    </DialogTitle>
                    <DialogDescription className="text-white/80 text-xs">
                      {selectedStudent.grade}
                    </DialogDescription>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Subject Scores / Breakdown */}
                {selectedStudent.subjects && selectedStudent.subjects.length > 0 && (
                  <div>
                    <h6 className="text-xs font-bold text-[#062B67] dark:text-slate-200 uppercase tracking-wider mb-2">
                      Subject Performance
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedStudent.subjects.map((sub, i) => (
                        <div 
                          key={i} 
                          className="bg-[#F8FAFF] dark:bg-slate-800/80 p-2.5 rounded-lg border border-[#E8EFFB] dark:border-slate-700/60 flex items-center justify-between"
                        >
                          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {sub.name}
                          </span>
                          <span className="text-xs font-bold text-[#155EEF] dark:text-blue-400">
                            {sub.marks}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target / Destination */}
                {selectedStudent.dreamCollege && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-[#FF6B21] shrink-0" />
                    <div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                        Target / Accomplishment
                      </div>
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-bold">
                        {selectedStudent.dreamCollege}
                      </div>
                    </div>
                  </div>
                )}

                {/* Testimonial Quote */}
                {selectedStudent.testimonial && (
                  <div className="bg-[#F8FAFF] dark:bg-slate-800/50 p-3.5 rounded-xl border border-[#E8EFFB] dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    <span className="font-semibold text-[#155EEF] dark:text-blue-400 not-italic block mb-0.5">
                      Student Experience:
                    </span>
                    “{selectedStudent.testimonial}”
                  </div>
                )}


              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===================== VIEW ALL RESULTS MODAL ===================== */}
      <Dialog open={showAllResultsModal} onOpenChange={setShowAllResultsModal}>
        <DialogContent className="max-w-3xl w-[94vw] max-h-[88vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border border-[#DCE6F5] dark:border-slate-800 rounded-[22px] shadow-2xl">
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-[#DCE6F5] dark:border-slate-800 px-4 sm:px-5 py-3 sm:py-3.5 z-20 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B21]" />
                <span className="text-[11px] font-bold text-[#155EEF] uppercase tracking-wider">
                  Roll of Honour • 2026
                </span>
              </div>
              <DialogTitle className="text-[13.5px] sm:text-[15px] font-extrabold text-slate-500 dark:text-slate-400 leading-tight">
                All Academic Results & Top Performers
              </DialogTitle>
              <DialogDescription className="sr-only">
                All Academic Results & Top Performers
              </DialogDescription>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {RESULTS_DATA.map((category) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h5 className="font-extrabold text-[#062B67] dark:text-blue-400 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-[#FF6B21]" />
                    {category.headlineTitle} {category.headlineHighlight}
                  </h5>
                  <span className="text-xs font-medium text-slate-500">
                    Highest: <strong className="text-[#FF6B21]">{category.stats.highestScore.value}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.topPerformers.map((performer) => (
                    <div 
                      key={performer.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#DCE6F5] dark:border-slate-800 bg-[#F9FBFE] dark:bg-slate-800/60"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <Image
                          src={performer.image}
                          alt={performer.name}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h6 className="font-bold text-xs text-[#062B67] dark:text-white truncate">
                            {performer.name}
                          </h6>
                          <span className="text-[11px] font-extrabold text-[#FF6B21] shrink-0">
                            {performer.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {performer.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

    </section>
  );
}
