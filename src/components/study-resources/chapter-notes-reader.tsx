'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Check, 
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ListOrdered,
  Search,
  X,
  Lightbulb
} from 'lucide-react';
import { type ChapterItem } from '@/lib/study-resources-data';
import { 
  getClass9ChapterData, 
  type UniversalChapterNotesData,
  type ChapterTopic 
} from '@/lib/class-9-notes-data';
import { useToast } from '@/hooks/use-toast';

export interface ChapterNotesReaderProps {
  classId?: string;
  className?: string;
  subjectId?: string;
  subjectName?: string;
  currentChapter: ChapterItem;
  chapterIndex: number;
  previousChapter: ChapterItem | null;
  nextChapter: ChapterItem | null;
  chapterListUrl?: string;
  chapterData?: UniversalChapterNotesData;
}

export function ChapterNotesReader({
  classId = '9',
  className = 'Class 9',
  subjectId = 'science',
  subjectName = 'Science',
  currentChapter,
  chapterIndex: _chapterIndex,
  previousChapter: _previousChapter,
  nextChapter: _nextChapter,
  chapterListUrl = '/study-resources?class=9&subject=science',
  chapterData,
}: ChapterNotesReaderProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [activeSection, setActiveSection] = useState<string>('chapter-overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Questions state: expand first question by default
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    q1: true,
    'm-q1': true,
    'eng-q1': true,
    'sst-q1': true,
  });

  const isHindi = language === 'hindi';
  const data: UniversalChapterNotesData = chapterData || getClass9ChapterData(subjectId, currentChapter.slug);

  // Language-specific class and subject labels (clean separation, no mixed text)
  const classLabel = isHindi ? `कक्षा ${classId}` : `Class ${classId}`;
  const getSubjectHi = (id: string, defName: string) => {
    switch (id.toLowerCase()) {
      case 'science': return 'विज्ञान';
      case 'maths':
      case 'mathematics': return 'गणित';
      case 'english': return 'अंग्रेज़ी';
      case 'social-science':
      case 'sst': return 'सामाजिक विज्ञान';
      case 'political-science': return 'राजनीति विज्ञान';
      default: return defName;
    }
  };
  const subjectLabel = isHindi ? getSubjectHi(subjectId, subjectName) : subjectName;

  // Build Table of Contents list
  const baseTocItems = [
    {
      id: 'chapter-overview',
      labelHi: 'अध्याय परिचय',
      labelEn: 'Chapter Overview',
    },
    ...data.topics.map((t) => ({
      id: t.id,
      labelHi: `${t.number}. ${t.titleHi}`,
      labelEn: `${t.number}. ${t.titleEn}`,
    })),
    {
      id: 'quick-revision',
      labelHi: 'त्वरित पुनरीक्षण',
      labelEn: 'Quick Revision',
    },
    {
      id: 'board-questions',
      labelHi: 'महत्वपूर्ण परीक्षा प्रश्न',
      labelEn: 'Important Questions',
    },
    {
      id: 'download-notes',
      labelHi: 'नोट्स डाउनलोड (PDF)',
      labelEn: 'Download Notes (PDF)',
    },
  ];

  const tocItems = searchQuery
    ? baseTocItems.filter((item) =>
        (isHindi ? item.labelHi : item.labelEn)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : baseTocItems;

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = baseTocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(baseTocItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(baseTocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [baseTocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
      setMobileTocOpen(false);
    }
  };

  const handleDownloadClick = (type: 'free' | 'premium') => {
    if (type === 'free') {
      toast({
        title: 'Free Revision PDF Preview Ready',
        description: `Official printable PDF for ${className} ${subjectName} Chapter ${currentChapter.number} will download automatically upon syllabus release.`,
      });
    } else {
      toast({
        title: 'Premium Full Study Kit',
        description: `Complete study kit for Chapter ${currentChapter.number} with diagrams & formula sheets is verified and ready.`,
      });
    }
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllQuestions = () => {
    const allExpanded = data.boardQuestions.every((q) => expandedQuestions[q.id]);
    const nextState: Record<string, boolean> = {};
    data.boardQuestions.forEach((q) => {
      nextState[q.id] = !allExpanded;
    });
    setExpandedQuestions(nextState);
  };

  const filteredTopics = searchQuery
    ? data.topics.filter(
        (t) =>
          (isHindi ? t.titleHi : t.titleEn).toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.number.includes(searchQuery)
      )
    : data.topics;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans pb-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

        {/* ── 1. BREADCRUMBS ── */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link href="/study-resources" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Study Resources
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link href={`/study-resources?class=${classId}`} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                {className}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link href={chapterListUrl} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                {subjectName}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
              {isHindi ? data.titleHi : data.titleEn}
            </li>
          </ol>
        </nav>

        {/* ── 2. HEADER CARD (CLEAN, MINIMAL, NO SHADOW) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 sm:p-7 shadow-none mb-6 relative overflow-hidden">
          {/* Subtle accent top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#062B67] via-[#155EEF] to-blue-500" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FF] text-[#062B67] dark:bg-blue-950/60 dark:text-blue-300 border border-[#D5E3F9] dark:border-blue-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                  <span>{classLabel} • {subjectLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F5FF] text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-[#D5E3F9] dark:border-blue-900/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                  <span>{isHindi ? `अध्याय ${data.chapterNumber}` : `Chapter ${data.chapterNumber}`}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F4FAF6] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-300 border border-[#E2F5E8] dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                  <span>{isHindi ? 'NCERT पाठ्यक्रम अनुसार' : 'NCERT Syllabus (Complete Notes)'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-[800] text-[#062B67] dark:text-white tracking-tight mb-2 leading-[1.3]">
                {isHindi ? data.titleHi : data.titleEn}
              </h1>
              <p className="text-[14.5px] sm:text-[15.5px] text-[#475569] dark:text-slate-300 max-w-3xl leading-relaxed font-semibold mt-1">
                {isHindi ? data.subtitleHi : data.subtitleEn}
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center shrink-0 self-start md:self-center">
              <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setLanguage('hindi')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all font-hindi cursor-pointer ${
                    isHindi
                      ? 'bg-white dark:bg-slate-900 text-[#155EEF] dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('english')}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all font-sans cursor-pointer ${
                    !isHindi
                      ? 'bg-white dark:bg-slate-900 text-[#155EEF] dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </div>

          {/* Quick Chapter Highlights Strip */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-hindi">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#155EEF]" />
              <span>{isHindi ? 'अध्ययन समय: 45 मिनट' : 'Study Time: 45 mins'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#155EEF]" />
              <span>
                {data.topics.length} {isHindi ? 'विस्तृत विषय एवं उप-विषय' : 'Detailed Topics'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'परीक्षा उपयोगी मॉडल प्रश्न व उत्तर' : 'Exam Model Q&A'}</span>
            </div>
          </div>
        </div>

        {/* ── 3. MAIN CONTENT LAYOUT (NOTES ON LEFT, TOPIC TOC ON RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── 3A. UNIFIED CHAPTER READING DOCUMENT (DISTINCT SECTIONS WITH SUBTLE LIGHT COLORS) ── */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* 1. OVERVIEW SECTION */}
            <section
              id="chapter-overview"
              className="bg-[#F8FBFE] dark:bg-slate-900/90 border border-[#E2ECF8] dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_1px_3px_rgba(6,43,103,0.02)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#D5E3F9] dark:border-slate-700 text-xs font-bold text-[#155EEF] dark:text-blue-300 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                  <span>{isHindi ? 'अध्याय अवलोकन' : 'Chapter Overview'}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-[26px] font-[800] text-[#062B67] dark:text-white mb-4 tracking-tight leading-snug">
                {isHindi ? 'अध्याय का संक्षिप्त परिचय एवं पृष्ठभूमि' : 'Chapter Summary & Overview'}
              </h2>
              <div className="space-y-4 text-slate-900 dark:text-slate-100 text-[15.5px] sm:text-[16.5px] leading-[1.85] font-semibold">
                {(isHindi ? data.overviewHi : data.overviewEn).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* 2. DYNAMIC TOPICS */}
            {filteredTopics.map((topic: ChapterTopic) => (
              <article
                key={topic.id}
                id={topic.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_1px_3px_rgba(6,43,103,0.02)]"
              >
                {/* 2A. Topic Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F5FF] dark:bg-blue-950/60 border border-[#D5E3F9] dark:border-blue-900/40 text-xs font-bold text-[#155EEF] dark:text-blue-300 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                    <span>{isHindi ? `विषय ${topic.number} • ${topic.badge}` : `Topic ${topic.number} • ${topic.badge}`}</span>
                  </span>
                </div>

                {/* 2B. Topic Heading */}
                <h3 className="text-xl sm:text-2xl md:text-[24px] font-[800] text-[#062B67] dark:text-white mb-3 tracking-tight leading-snug">
                  {isHindi ? topic.titleHi : topic.titleEn}
                </h3>

                {/* 2C. Optional Topic Summary / Quote */}
                {topic.summaryHi && (
                  <p className="text-[15px] sm:text-[16px] text-slate-900 dark:text-slate-100 font-semibold leading-[1.8] mb-5 border-l-4 border-l-[#155EEF] pl-4 py-2.5 bg-[#F8FAFD] dark:bg-slate-800/40 rounded-r-xl border border-l-0 border-[#E2ECF8] dark:border-slate-800">
                    {isHindi ? topic.summaryHi : topic.summaryEn}
                  </p>
                )}

                {/* 2D. Key Stats Bar if exists */}
                {topic.keyStats && topic.keyStats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                    {topic.keyStats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-[#F8FBFE] dark:bg-slate-800/50 rounded-xl p-3 border border-[#E5EFFB] dark:border-slate-800 text-center shadow-none"
                      >
                        <span className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1 font-hindi">
                          {isHindi ? stat.labelHi : stat.labelEn}
                        </span>
                        <span className="block text-base sm:text-lg font-bold text-[#062B67] dark:text-blue-400 font-sans">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2E. Bullet Points List with exact IDL Blog bullet style */}
                {((isHindi ? topic.bulletPointsHi : topic.bulletPointsEn) || []).length > 0 && (
                  <div className="space-y-3.5 mt-4">
                    {((isHindi ? topic.bulletPointsHi : topic.bulletPointsEn) || []).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-0.5 group">
                        <div className="bg-[#155EEF]/10 dark:bg-blue-900/40 p-1 rounded-full mt-1.5 shrink-0 group-hover:bg-[#155EEF] transition-colors">
                          <div className="w-1.5 h-1.5 bg-[#155EEF] dark:bg-blue-400 rounded-full group-hover:bg-white transition-colors" />
                        </div>
                        <p className="text-[15.5px] sm:text-[16.5px] text-slate-900 dark:text-slate-100 leading-[1.85] font-semibold flex-1">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2F. Sub-topics: Clean nested cards with arrow indicators */}
                {topic.subTopics && topic.subTopics.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {topic.subTopics.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-[#F9FBFE] dark:bg-slate-800/40 border border-[#E4EEF8] dark:border-slate-800 rounded-xl p-4 sm:p-5">
                        <h4 className="text-base sm:text-[17px] font-[800] text-[#062B67] dark:text-white flex items-center gap-2 mb-3 border-l-3 border-[#155EEF] pl-3">
                          <span>{isHindi ? sub.subtitleHi : sub.subtitleEn}</span>
                        </h4>
                        <div className="space-y-2.5 pl-2">
                          {(isHindi ? sub.pointsHi : sub.pointsEn).map((p, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5">
                              <ArrowRight className="w-4 h-4 text-[#155EEF] shrink-0 mt-1" />
                              <p className="text-[15px] sm:text-[16px] text-slate-900 dark:text-slate-100 leading-[1.8] flex-1 font-semibold">
                                {p}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2G. Callout Box (Academic highlight) */}
                {topic.calloutBox && (
                  <div className="mt-6 rounded-xl border border-[#FDE8C5] dark:border-amber-900/30 border-l-4 border-l-[#D97706] bg-[#FFFBF5] dark:bg-amber-950/20 p-4 sm:p-5 shadow-none">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D97706] dark:text-amber-400 mb-1.5">
                      <Lightbulb className="w-4 h-4 text-[#D97706]" />
                      <span>{isHindi ? topic.calloutBox.titleHi : topic.calloutBox.titleEn}</span>
                    </div>
                    <p className="text-[15px] sm:text-[15.5px] text-slate-900 dark:text-slate-100 leading-[1.8] font-semibold">
                      {isHindi ? topic.calloutBox.contentHi : topic.calloutBox.contentEn}
                    </p>
                  </div>
                )}
              </article>
            ))}

            {/* 3. QUICK REVISION POINTS */}
            <section
              id="quick-revision"
              className="bg-[#F6FAF8] dark:bg-emerald-950/20 border border-[#D8EFE2] dark:border-emerald-900/30 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_1px_3px_rgba(6,43,103,0.02)]"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-5 pb-3 border-b border-[#E2F2E8] dark:border-emerald-900/30">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#CDEBD8] dark:border-emerald-800/40 text-xs font-bold text-[#16A34A] dark:text-emerald-400 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                    <span>{isHindi ? 'त्वरित पुनरीक्षण' : 'Quick Revision'}</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-[800] text-[#062B67] dark:text-white tracking-tight">
                    {isHindi ? 'त्वरित पुनरीक्षण बिंदु' : 'Quick Revision Key Takeaways'}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-[#16A34A] dark:text-emerald-400 border border-[#D0F0D9] dark:border-emerald-800/40">
                  {data.quickRevisionPointsHi.length} {isHindi ? 'मुख्य बिंदु' : 'Key Points'}
                </span>
              </div>

              <div className="space-y-3">
                {(isHindi ? data.quickRevisionPointsHi : data.quickRevisionPointsEn).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#E2F0E7] dark:border-emerald-900/30 shadow-2xs"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#ECF8F0] text-[#16A34A] dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#D0F0D9] dark:border-emerald-800/40 font-sans">
                      {idx + 1}
                    </span>
                    <p className="text-[15px] sm:text-[16px] text-slate-900 dark:text-slate-100 leading-[1.8] font-semibold flex-1">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. BOARD / EXAM QUESTIONS SECTION */}
            <section
              id="board-questions"
              className="bg-[#F8FAFD] dark:bg-blue-950/20 border border-[#DCE7F6] dark:border-blue-900/30 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_1px_3px_rgba(6,43,103,0.02)]"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-[#D5E4F7] dark:border-blue-900/30">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#D5E3F9] dark:border-blue-900/40 text-xs font-bold text-[#155EEF] dark:text-blue-400 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] shrink-0" />
                    <span>{isHindi ? 'परीक्षा तैयारी' : 'Exam Practice'}</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-[800] text-[#062B67] dark:text-white tracking-tight">
                    {isHindi ? 'परीक्षा उपयोगी महत्वपूर्ण प्रश्न' : 'Important Examination Questions'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={toggleAllQuestions}
                  className="text-xs font-bold text-[#155EEF] dark:text-blue-400 hover:text-[#0052CC] underline underline-offset-2 cursor-pointer"
                >
                  {isHindi ? 'सभी खोलें / बंद करें' : 'Expand / Collapse All'}
                </button>
              </div>

              <div className="space-y-3.5">
                {data.boardQuestions.map((q) => {
                  const isExpanded = !!expandedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden transition-all bg-white dark:bg-slate-900 shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleQuestion(q.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#155EEF] dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 shrink-0 mt-0.5 font-sans">
                            {q.marks}
                          </span>
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                              {isHindi ? q.typeHi : q.typeEn}
                            </span>
                            <span className="block text-base font-[800] text-[#062B67] dark:text-white leading-snug">
                              {isHindi ? q.questionHi : q.questionEn}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180 text-[#155EEF]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-[#F9FBFE] dark:bg-slate-800/20 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          <div className="font-bold text-[#155EEF] dark:text-blue-400 mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isHindi ? 'आदर्श उत्तर (Model Answer):' : 'Model Answer:'}</span>
                          </div>
                          <div className="text-[15px] sm:text-[16px] leading-[1.85] text-slate-900 dark:text-slate-100 font-semibold">
                            {isHindi ? q.answerHi : q.answerEn}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. STUDY KIT & PDF DOWNLOADS */}
            <section
              id="download-notes"
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-9 shadow-[0_1px_3px_rgba(6,43,103,0.02)] space-y-6"
            >
              {/* Eyebrow & Title */}
              <div className="text-center max-w-xl mx-auto">
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  STUDY KIT &amp; PDF DOWNLOADS
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  Download Notes
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400">
                  {isHindi
                    ? 'अपनी परीक्षा की तैयारी के लिए सबसे उपयुक्त नोट्स प्रारूप चुनें।'
                    : 'Choose the notes format that works best for your preparation.'}
                </p>
              </div>

              {/* 2 Comparison Cards (Clean, Flat, Minimal - shadow-none) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 items-stretch">
                
                {/* ── CARD 1: Free Revision Notes ── */}
                <div className="bg-[#F9FBFE] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between hover:border-blue-300 transition-all">
                  <div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3 border border-slate-200/70 dark:border-slate-700">
                      Quick Revision
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white">
                      Free Revision Notes
                    </h3>
                    
                    <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal">
                      {isHindi
                        ? 'त्वरित रिवीजन के लिए संक्षिप्त एवं सटीक नोट्स।'
                        : 'Short and focused notes for quick revision.'}
                    </p>

                    <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Essential concepts (मुख्य अवधारणाएं)' : 'Essential concepts'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Key definitions (प्रमुख परिभाषाएं)' : 'Key definitions'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Quick revision points (रिवीजन बिंदु)' : 'Quick revision points'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      id="download-free-pdf-btn"
                      onClick={() => handleDownloadClick('free')}
                      className="w-full h-11 rounded-xl border border-[#155EEF] text-[#155EEF] hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none active:scale-[0.99]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Free PDF (Demo Preview) &rarr;</span>
                    </button>
                    <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      PDF connection ready for official syllabus
                    </p>
                  </div>
                </div>

                {/* ── CARD 2: Premium Full Notes (RECOMMENDED) ── */}
                <div className="bg-white dark:bg-slate-900 border-2 border-[#155EEF] rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between relative mt-2 md:mt-0 transition-all">
                  {/* Top Right Floating Badge */}
                  <div className="absolute -top-3.5 right-6 bg-[#155EEF] text-white text-[10.5px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    RECOMMENDED
                  </div>

                  <div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-semibold text-xs mb-3">
                      Complete Study Kit
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white">
                      Premium Full Notes
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal">
                      {isHindi
                        ? 'विस्तृत परीक्षा तैयारी हेतु सम्पूर्ण अध्याय नोट्स।'
                        : 'Complete chapter notes for detailed preparation.'}
                    </p>

                    <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Detailed explanations (विस्तृत व्याख्या)' : 'Detailed explanations'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Important examples (महत्वपूर्ण उदाहरण)' : 'Important examples'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Diagrams & Mindmaps (आरेख व टाइमलाइन)' : 'Diagrams'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Exam-focused points (परीक्षा केंद्रित बिंदु)' : 'Exam-focused points'}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span>{isHindi ? 'Complete chapter coverage (सम्पूर्ण पाठ्यक्रम)' : 'Complete chapter coverage'}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      id="download-premium-pdf-btn"
                      onClick={() => handleDownloadClick('premium')}
                      className="w-full h-11 rounded-xl bg-[#155EEF] hover:bg-[#0052CC] text-white font-semibold text-xs sm:text-sm shadow-none transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Get Full Notes (Demo Preview) &rarr;</span>
                    </button>
                    <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
                      PDF connection ready for official syllabus
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </main>

          {/* ── 3B. STICKY TABLE OF CONTENTS (RIGHT - 4 OR 3 COLS) ── */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-none max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#155EEF] dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#062B67] dark:text-slate-200 font-hindi">
                    {isHindi ? 'विषय सूची (TOC)' : 'Table of Contents'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#155EEF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full font-sans">
                  {tocItems.length}
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'विषय खोजें...' : 'Search topics...'}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#155EEF] font-hindi"
                />
              </div>

              {/* TOC Nav List */}
              <nav className="space-y-1 text-xs">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg font-medium transition-all flex items-center justify-between group cursor-pointer font-hindi ${
                        isActive
                          ? 'bg-blue-50/90 text-[#062B67] dark:bg-blue-950/70 dark:text-blue-300 font-semibold border-l-2 border-[#155EEF]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#062B67] dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {isHindi ? item.labelHi : item.labelEn}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActive
                            ? 'text-[#155EEF] dark:text-blue-400 translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>

        {/* ── 4. MOBILE FLOATING TOC TRIGGER ── */}
        <div className="lg:hidden fixed bottom-6 left-6 z-40">
          <button
            type="button"
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#062B67] hover:bg-[#0A3A8A] text-white rounded-full shadow-md font-semibold text-xs transition-all active:scale-95 border border-blue-400/30 font-hindi"
          >
            <ListOrdered className="w-4 h-4 text-blue-300" />
            <span>{isHindi ? 'विषय सूची' : 'Topics'} ({tocItems.length})</span>
          </button>
        </div>

        {/* ── 5. MOBILE TOC SLIDE-UP DRAWER ── */}
        {mobileTocOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
            <div 
              className="fixed inset-0" 
              onClick={() => setMobileTocOpen(false)} 
              aria-label="Close Drawer Overlay" 
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 max-h-[80vh] flex flex-col shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#155EEF] dark:text-blue-400" />
                  <span className="text-sm font-bold text-[#062B67] dark:text-slate-200 font-hindi">
                    {isHindi ? 'विषय सूची (TOC)' : 'Table of Contents'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#155EEF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full font-sans">
                    {tocItems.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'विषय खोजें...' : 'Search topics...'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#155EEF] font-hindi"
                />
              </div>

              {/* TOC Nav List */}
              <nav className="space-y-1 text-xs overflow-y-auto pr-1 flex-1 font-hindi">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between group font-hindi ${
                        isActive
                          ? 'bg-blue-50 text-[#062B67] dark:bg-blue-950/60 dark:text-blue-300 font-semibold border-l-2 border-[#155EEF]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {isHindi ? item.labelHi : item.labelEn}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive
                            ? 'text-[#155EEF] dark:text-blue-400 translate-x-0.5'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
