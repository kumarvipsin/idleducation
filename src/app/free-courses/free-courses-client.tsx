'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Play,
  PlayCircle,
  BookOpen,
  Search,
  X,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ListVideo,
  Video,
  BookText,
  Clock,
  Layers,
  CheckCircle2,
  Youtube,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { parseYouTubeUrl } from '@/lib/youtube';
import type { TFreeCourse } from '@/app/actions/types';
import { CourseCardActionBar } from '@/components/course-card-action-bar';
import { CourseCard } from '@/components/course-card';

// ── ILLUSTRATED COLORFUL SUBJECT ICONS (Matching School Page & Courses We Offer Style) ──
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

function getSubjectDetails(subjectName: string = '') {
  const lower = subjectName.toLowerCase();
  if (lower.includes('math')) {
    return {
      icon: <MathsIllustIcon />,
      badgeBg: 'bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    };
  }
  if (lower.includes('sci') || lower.includes('phy') || lower.includes('chem') || lower.includes('bio')) {
    return {
      icon: <ScienceIllustIcon />,
      badgeBg: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }
  if (lower.includes('eng')) {
    return {
      icon: <EnglishIllustIcon />,
      badgeBg: 'bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    };
  }
  if (lower.includes('eco')) {
    return {
      icon: <EconomicsIllustIcon />,
      badgeBg: 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }
  if (lower.includes('polit') || lower.includes('civic')) {
    return {
      icon: <PoliticalIllustIcon />,
      badgeBg: 'bg-indigo-100/70 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    };
  }
  if (lower.includes('hist')) {
    return {
      icon: <HistoryIllustIcon />,
      badgeBg: 'bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    };
  }
  if (lower.includes('soc') || lower.includes('sst') || lower.includes('geo')) {
    return {
      icon: <SocialIllustIcon />,
      badgeBg: 'bg-amber-100/70 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    };
  }
  return {
    icon: <GeneralIllustIcon />,
    badgeBg: 'bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  };
}

interface FreeCoursesClientProps {
  courses: TFreeCourse[];
}

// Extract robust YouTube embed URL supporting mobile playsinline & clean playback
function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const parsed = parseYouTubeUrl(url);

  if (parsed.playlistId && (!parsed.videoId || parsed.type === 'playlist')) {
    return `https://www.youtube.com/embed/videoseries?list=${parsed.playlistId}&rel=0&playsinline=1`;
  }

  if (parsed.videoId) {
    return `https://www.youtube.com/embed/${parsed.videoId}?rel=0&playsinline=1${parsed.playlistId ? `&list=${parsed.playlistId}` : ''}`;
  }

  // Direct regex fallback for any 11-character video ID
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0&playsinline=1`;
  }

  return url;
}

interface WatchingCourse {
  title: string;
  url: string;
  isPlaylist: boolean;
}

export function FreeCoursesClient({ courses }: FreeCoursesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Navigation state: drill-down hierarchy with URL & sessionStorage persistence
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlClass = new URLSearchParams(window.location.search).get('class');
      if (urlClass) return urlClass;
      try {
        const saved = sessionStorage.getItem('idl_free_courses_class');
        if (saved) return saved;
      } catch {}
    }
    return searchParams.get('class') || 'all';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [watchingCourse, setWatchingCourse] = useState<WatchingCourse | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setWatchingCourse(null); };
    if (watchingCourse) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [watchingCourse]);

  // Restore and sync URL & state on mount, reload and browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlClass = urlParams.get('class');
    const urlSubject = urlParams.get('subject');
    const urlChapter = urlParams.get('chapter');

    if (urlClass) {
      setSelectedClass(urlClass);
      try { sessionStorage.setItem('idl_free_courses_class', urlClass); } catch {}
    } else {
      try {
        const saved = sessionStorage.getItem('idl_free_courses_class');
        if (saved && saved !== 'all') {
          setSelectedClass(saved);
          urlParams.set('class', saved);
          window.history.replaceState(null, '', `?${urlParams.toString()}`);
        }
      } catch {}
    }

    if (urlSubject) setSelectedSubject(urlSubject);
    if (urlChapter) setSelectedChapter(urlChapter);

    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedClass(params.get('class') || 'all');
      setSelectedSubject(params.get('subject') || null);
      setSelectedChapter(params.get('chapter') || null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync with searchParams if updated from external router
  useEffect(() => {
    const cls = searchParams.get('class');
    if (cls && cls !== selectedClass) {
      setSelectedClass(cls);
    }
  }, [searchParams]);

  // Navigation handlers that keep the URL query string updated so page reload stays on the same class
  const handleSelectClass = (cls: string) => {
    setSelectedClass(cls);
    setSelectedSubject(null);
    setSelectedChapter(null);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (cls === 'all') {
        params.delete('class');
        try { sessionStorage.removeItem('idl_free_courses_class'); } catch {}
      } else {
        params.set('class', cls);
        try { sessionStorage.setItem('idl_free_courses_class', cls); } catch {}
      }
      params.delete('subject');
      params.delete('chapter');

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const handleSelectSubject = (subj: string | null) => {
    setSelectedSubject(subj);
    setSelectedChapter(null);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (selectedClass && selectedClass !== 'all') {
        params.set('class', selectedClass);
      }
      if (subj) {
        params.set('subject', subj);
      } else {
        params.delete('subject');
      }
      params.delete('chapter');

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const handleSelectChapter = (chap: string | null) => {
    setSelectedChapter(chap);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (selectedClass && selectedClass !== 'all') {
        params.set('class', selectedClass);
      }
      if (selectedSubject) {
        params.set('subject', selectedSubject);
      }
      if (chap) {
        params.set('chapter', chap);
      } else {
        params.delete('chapter');
      }

      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };

  // Reset drill-down
  const handleResetBreadcrumb = () => {
    handleSelectSubject(null);
  };

  // Only Class 9, Class 10, Class 11, and Class 12
  const classList = useMemo(() => {
    return ['Class 9', 'Class 10', 'Class 11', 'Class 12'];
  }, []);

  // Filter courses by selected class (restrict to allowed classes)
  const classFilteredCourses = useMemo(() => {
    const allowed = ['class 9', 'class 10', 'class 11', 'class 12'];
    if (selectedClass === 'all') {
      // Show only courses that belong to allowed classes or have no class
      return courses.filter((c) => {
        if (!c.class) return true;
        return allowed.includes(c.class.toLowerCase().trim());
      });
    }
    // Specific class selected
    return courses.filter(
      (c) => c.class?.toLowerCase().trim() === selectedClass.toLowerCase().trim()
    );
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
        c.shortDescription?.toLowerCase().includes(q)
    );
  }, [classFilteredCourses, searchQuery]);

  // Group by Subjects for current class view
  const subjectsMap = useMemo(() => {
    const map = new Map<string, { courses: TFreeCourse[]; videoCount: number }>();
    classFilteredCourses.forEach((c) => {
      const subj = c.subject || 'General Studies';
      if (!map.has(subj)) {
        map.set(subj, { courses: [], videoCount: 0 });
      }
      const entry = map.get(subj)!;
      entry.courses.push(c);
      entry.videoCount += c.youtubeType === 'playlist' ? 5 : 1;
    });
    return map;
  }, [classFilteredCourses]);

  // Group by Chapters for current subject view
  const chaptersMap = useMemo(() => {
    if (!selectedSubject) return new Map();
    const map = new Map<string, TFreeCourse[]>();
    const subjCourses = classFilteredCourses.filter(
      (c) => (c.subject || 'General Studies').toLowerCase() === selectedSubject.toLowerCase()
    );
    subjCourses.forEach((c) => {
      const chap = c.chapter || c.title || 'General Lessons';
      if (!map.has(chap)) {
        map.set(chap, []);
      }
      map.get(chap)!.push(c);
    });
    return map;
  }, [classFilteredCourses, selectedSubject]);

  // Videos list for selected chapter view
  const chapterVideos = useMemo(() => {
    if (!selectedChapter || !selectedSubject) return [];
    return classFilteredCourses.filter(
      (c) =>
        (c.subject || 'General Studies').toLowerCase() === selectedSubject.toLowerCase() &&
        (c.chapter || c.title || 'General Lessons').toLowerCase() === selectedChapter.toLowerCase()
    );
  }, [classFilteredCourses, selectedSubject, selectedChapter]);


  return (
    <div data-page="free-courses" className="min-h-screen bg-[#F5F7FA] dark:bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-24">

      {/* ── YouTube Video Modal (Exact Sample Reference: White Top Bar, Left Close Button, Mobile & Desktop Responsive) ── */}
      {watchingCourse && (
        <>
          {/* Backdrop Overlay — covers full screen, no click-to-close as per user requirement */}
          <div
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Centering Wrapper — pointer-events-none so touches/taps are not intercepted by the viewport flex layer */}
          <div
            className="fixed inset-0 z-[121] flex items-center justify-center p-3 sm:p-5 md:p-6 pointer-events-none overscroll-contain"
            role="dialog"
            aria-modal="true"
            aria-label={watchingCourse.title}
          >
            {/* Modal Card — pointer-events-auto enables all clicks/touches cleanly on the card & iframe */}
            <div
              className="pointer-events-auto relative w-[min(calc(100vw-1.5rem),calc((86dvh)*16/9),880px)] bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl flex flex-col my-auto border-0"
            >
              {/* Top White Bar with Left Circular Close Button (X) matching sample */}
              <div className="w-full bg-white dark:bg-slate-900 px-3 py-2 sm:py-2.5 flex items-center justify-start border-b border-slate-100 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setWatchingCourse(null)}
                  className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-slate-200/90 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                  aria-label="Close video"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Video Player Container — 16:9, playsinline */}
              <div className="relative aspect-video w-full bg-black overflow-hidden pointer-events-auto">
                <iframe
                  key={watchingCourse.url}
                  className="w-full h-full border-0 block pointer-events-auto"
                  src={getYouTubeEmbedUrl(watchingCourse.url)}
                  title={watchingCourse.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </>
      )}


      {/* ── HERO — Dark Navy, Compact (Refined Mobile Height) ── */}
      <section className="relative overflow-hidden pt-5 pb-5 sm:py-10 lg:py-14 bg-gradient-to-b from-[#061026] via-[#0B1F4B] to-[#0A1A3F] text-white border-b border-white/10">
        {/* Dot texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
        {/* Glow blobs */}
        <div className="absolute -top-28 -left-16 w-[380px] h-[380px] bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-12 w-[340px] h-[340px] bg-gradient-to-tl from-[#FF6B00]/[0.07] to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-5 md:px-6 relative z-10 max-w-4xl">

          {/* Eyebrow — secondary, refined */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-5">
            <span className="w-3.5 sm:w-4 h-px bg-[#FF6B00]/60 shrink-0" />
            <span className="text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.28em] text-[#FF6B00]">IDL Education</span>
            <span className="w-3.5 sm:w-4 h-px bg-[#FF6B00]/60 shrink-0" />
          </div>

          {/* Headline — deliberate 2-line on mobile */}
          <h1 className="text-center font-black text-white leading-[1.06] tracking-[-0.025em]
            text-[28px] sm:text-[42px] md:text-[50px] lg:text-[58px]
            max-w-[320px] sm:max-w-none mx-auto sm:mx-0">
            Free <span className="text-[#FF6B00]">Courses</span>&nbsp;&amp;<br className="sm:hidden" /> Video Library
          </h1>

          {/* Description */}
          <p className="text-center mt-2.5 sm:mt-4
            text-[13px] sm:text-[14.5px]
            text-slate-400 font-normal
            leading-[1.45] sm:leading-[1.52]
            max-w-[320px] sm:max-w-[480px] mx-auto">
            Free lessons, chapter one-shots, and exam revision resources from IDL Education. Watch anytime on YouTube.
          </p>

          {/* Stats strip */}
          <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-white/[0.08]
            flex flex-wrap items-center justify-center
            gap-x-4 gap-y-1.5 sm:gap-x-7 sm:gap-y-2
            text-[12px] sm:text-[13px] font-medium text-slate-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[#FF6B00] shrink-0" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-blue-400 shrink-0" />
              <span>Class 9–12</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-emerald-400 shrink-0" />
              <span>Powered by YouTube</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Transition band + breathing space: dark → light ── */}
      <div className="h-1.5 sm:h-1 bg-gradient-to-b from-[#0A1A3F] to-[#F5F7FA] dark:to-background" />

      {/* ── Main Library Area ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">

        {/* Desktop Search + Filter bar */}
        {!selectedSubject && (
          <div className="py-3 sm:py-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 sm:gap-4">

            {/* Filter tabs — horizontal scroll, no wrap */}
            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0">
              <div className="flex items-center gap-1 whitespace-nowrap">
                {(['all', ...classList] as string[]).map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleSelectClass(cls)}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-[8px] text-[11px] sm:text-xs font-semibold transition-all duration-150 whitespace-nowrap border",
                      selectedClass === cls
                        ? "bg-[#0B1F4B] text-white border-[#0B1F4B] shadow-sm"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:text-slate-800"
                    )}
                  >
                    {cls === 'all' ? 'All Classes' : cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog-style expandable search — right side, mobile + desktop */}
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
                    placeholder="Search lessons, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => { if (!searchQuery) setIsSearchOpen(false); }}
                    className="flex-1 border-0 shadow-none outline-none focus:outline-none text-xs text-slate-700 dark:text-slate-300 placeholder:text-muted-foreground/70 bg-transparent h-full px-2"
                    aria-label="Search free courses"
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

        {/* Breadcrumbs */}
        {(selectedClass !== 'all' || selectedSubject || selectedChapter) && (
          <div className="flex items-center flex-wrap gap-1.5 py-3 text-xs font-medium text-muted-foreground">
            <button onClick={() => handleSelectClass('all')} className="hover:text-primary transition-colors">
              Free Courses
            </button>
            {selectedClass !== 'all' && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <button onClick={handleResetBreadcrumb} className={cn("hover:text-primary transition-colors", !selectedSubject && "text-foreground font-semibold")}>
                  {selectedClass}
                </button>
              </>
            )}
            {selectedSubject && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <button onClick={() => handleSelectChapter(null)} className={cn("hover:text-primary transition-colors", !selectedChapter && "text-foreground font-semibold")}>
                  {selectedSubject}
                </button>
              </>
            )}
            {selectedChapter && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-primary font-semibold">{selectedChapter}</span>
              </>
            )}
          </div>
        )}

        {/* ── VIEW LEVEL 3: Videos inside a Chapter ── */}
        {selectedChapter && selectedSubject ? (
          <div className="py-4 sm:py-5">
            <div className="grid grid-cols-1 gap-3">
              {chapterVideos.map((video) => (
                <div key={video.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow group">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setWatchingCourse({ title: video.title, url: video.youtubeUrl || '', isPlaylist: false })}
                      className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 block group/thumb cursor-pointer"
                      aria-label={`Watch ${video.title}`}
                    >
                      {video.thumbnailUrl || video.coverImageUrl ? (
                        <Image src={video.thumbnailUrl || video.coverImageUrl || ''} alt={video.title} fill unoptimized className="object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                      ) : null}
                      <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                          <Play className="w-3.5 h-3.5 fill-[#0B1F4B] text-[#0B1F4B]" />
                        </div>
                      </div>
                    </button>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-medium leading-none"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />FREE</span>
                        {video.category && <span className="text-[10px] font-medium text-primary">{video.category}</span>}
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{video.shortDescription || video.description || ''}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                      Medium:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {video.medium || 'Hinglish'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : selectedSubject ? (
          /* ── VIEW LEVEL 2: Chapters inside a Subject ── */
          <div className="py-4 sm:py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from(chaptersMap.entries()).map(([chapterName, chapterItems]) => (
                <div key={chapterName} onClick={() => handleSelectChapter(chapterName)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-slate-500">
                      <BookText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{chapterName}</h3>
                      <p className="text-[11px] text-muted-foreground">{chapterItems.length} Free Video{chapterItems.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ── VIEW LEVEL 1: Primary Course Library ── */
          <div className="pt-1 pb-5 sm:pb-6 space-y-6 sm:space-y-8">

            {/* Subject-wise Video Courses — Only shown when a specific class is selected and has courses */}
            {selectedClass !== 'all' && subjectsMap.size > 0 && (
              <section className="mb-6 sm:mb-8">
                {/* Section Header — Left-aligned, purposeful video learning introduction */}
                <div className="mb-4 sm:mb-5 pb-3 sm:pb-3.5 border-b border-slate-200/60 dark:border-slate-800/80 text-left">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#1D4ED8] shrink-0 stroke-[2.2]" />
                    <h2 className="text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
                      Explore by Subject
                    </h2>
                  </div>
                  <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 font-normal mt-1 sm:mt-1.5 leading-normal">
                    Free video lessons organised by subject.
                  </p>
                </div>

                {/* 2-Column Grid — 10-15% more compact, uniform height and optical balance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {Array.from(subjectsMap.entries()).map(([subjName, data]) => {
                    const details = getSubjectDetails(subjName);
                    const chaptersCount = new Set(data.courses.map((c) => c.chapter || c.title || 'General Lessons')).size;
                    return (
                      <div
                        key={subjName}
                        onClick={() => handleSelectSubject(subjName)}
                        className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200/70 dark:border-slate-800/80 h-[84px] sm:h-[86px] px-3 sm:px-4 py-3 sm:py-3.5 hover:border-[#1D4ED8]/30 dark:hover:border-blue-500/30 hover:shadow-[0_6px_20px_-3px_rgba(11,31,75,0.08)] shadow-[0_2px_8px_-2px_rgba(11,31,75,0.04)] transition-all duration-200 flex items-center justify-between gap-3 sm:gap-3.5 cursor-pointer"
                      >
                        {/* 1. Left: Normalized Fixed Icon Box */}
                        <div className="w-11 h-11 shrink-0 flex items-center justify-center relative z-10 transition-transform duration-200 group-hover:scale-105 drop-shadow-xs">
                          {details.icon}
                        </div>

                        {/* 2. Center: Subject Title + Video Badge + Academic Session Subtitle */}
                        <div className="min-w-0 flex-1 relative z-10 flex flex-col justify-center">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-none truncate group-hover:text-[#1D4ED8] transition-colors">
                              {subjName}
                            </h3>
                            <span className={cn("text-[9.5px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 leading-none h-[18px] inline-flex items-center", details.badgeBg)}>
                              {data.courses.length} Video{data.courses.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-[11.5px] font-medium text-slate-400 dark:text-slate-500 truncate leading-tight mt-1.5">
                            Academic Session 2026–27 · {chaptersCount} Chapter{chaptersCount > 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* 3. Right: Fixed Size View Button */}
                        <div className="shrink-0 relative z-10">
                          <div
                            className={cn(
                              "w-[76px] sm:w-[84px] h-[34px] sm:h-[36px] rounded-[8px]",
                              "text-[11.5px] sm:text-[12px] font-semibold whitespace-nowrap",
                              "text-[#1D4ED8]/80 dark:text-blue-400",
                              "bg-[#EEF4FF]/60 dark:bg-[#1a2f5e]/30",
                              "border border-[#1D4ED8]/15 dark:border-blue-500/20",
                              "group-hover:bg-[#EEF4FF] dark:group-hover:bg-[#1a2f5e]/50",
                              "group-hover:border-[#1D4ED8]/30 dark:group-hover:border-blue-500/40",
                              "shadow-none transition-all duration-150 flex items-center justify-center gap-0.5"
                            )}
                          >
                            <span>View</span>
                            <span className="opacity-70 text-[11px] leading-none ml-0.5">→</span>
                          </div>
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
                  {selectedClass === 'all' ? 'Free Courses' : `${selectedClass} — Free Courses`}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Showing {searchFilteredCourses.length} free learning resource{searchFilteredCourses.length !== 1 ? 's' : ''}
                </p>
              </div>

              {searchFilteredCourses.length === 0 ? (
                /* Empty state */
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl py-12 px-6 text-center max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">No free courses found</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Try another class or search term.</p>
                  <Button variant="outline" size="sm" onClick={() => { handleSelectClass('all'); setSearchQuery(''); }} className="mt-4 text-xs font-semibold rounded-lg">
                    View All Classes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                  {searchFilteredCourses.map((course) => {
                    const isPlaylist = course.youtubeType === 'playlist';
                    return (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        type="free"
                        thumbnailUrl={course.thumbnailUrl || course.coverImageUrl}
                        onThumbnailClick={() => setWatchingCourse({ title: course.title, url: course.youtubeUrl || '', isPlaylist })}
                        courseClass={course.class}
                        medium={course.medium}
                        subject={course.subject}
                        title={course.title}
                        onTitleClick={() => setWatchingCourse({ title: course.title, url: course.youtubeUrl || '', isPlaylist })}
                        audience={course.audience}
                        startDate={course.startDate}
                        endDate={course.endDate}
                        description={course.shortDescription || course.description}
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

