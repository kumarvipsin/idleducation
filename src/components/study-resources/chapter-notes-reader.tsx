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
  ListFilter, 
  Bookmark, 
  Info, 
  BookOpen,
  HelpCircle,
  FlaskConical
} from 'lucide-react';
import { type ChapterItem } from '@/lib/study-resources-data';
import { DEMO_CHAPTER_01_DATA, type ChapterContentData } from '@/lib/study-resources-demo-data';
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
  chapterData?: ChapterContentData;
}

export function ChapterNotesReader({
  classId = '9',
  className = 'Class 9',
  subjectId = 'science',
  subjectName = 'Science',
  currentChapter,
  chapterIndex: _chapterIndex,
  previousChapter,
  nextChapter,
  chapterListUrl = '/study-resources?class=9&subject=science',
  chapterData = DEMO_CHAPTER_01_DATA,
}: ChapterNotesReaderProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [activeSection, setActiveSection] = useState<string>('chapter-overview');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  
  // Interactive Important Questions state: expand first question by default
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    q1: true,
  });

  const isHindi = language === 'hindi';
  const data = chapterData;

  // TOC sections (8 total sections including Important Questions)
  const tocItems = [
    { id: 'chapter-overview', labelEn: '1. Chapter Overview', labelHi: '1. अध्याय अवलोकन' },
    { id: 'matter-characteristics', labelEn: '2. Characteristics of Matter', labelHi: '2. पदार्थ के अभिलक्षण' },
    { id: 'states-of-matter', labelEn: '3. States of Matter', labelHi: '3. पदार्थ की अवस्थाएं' },
    { id: 'change-of-state', labelEn: '4. Change of State', labelHi: '4. अवस्था परिवर्तन' },
    { id: 'evaporation', labelEn: '5. Evaporation', labelHi: '5. वाष्पीकरण' },
    { id: 'quick-revision', labelEn: '6. Quick Revision Points', labelHi: '6. त्वरित पुनरीक्षण' },
    { id: 'important-questions', labelEn: '7. Important Questions', labelHi: '7. महत्वपूर्ण प्रश्न' },
    { id: 'download-notes', labelEn: '8. Download Notes', labelHi: '8. नोट्स डाउनलोड करें' },
  ];

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
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
        title: 'PDF Downloads Coming Soon (Demo Mode)',
        description: `Official printable PDF for ${className} ${subjectName} Chapter ${currentChapter.number} is ready for linking and will be enabled upon syllabus publication.`,
      });
    } else {
      toast({
        title: 'Premium Full Notes Coming Soon (Demo Mode)',
        description: `Complete study package for Chapter ${currentChapter.number} with diagrams & formula sheets will be enabled upon official content release.`,
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
    const allExpanded = data.importantQuestions.questions.every((q) => expandedQuestions[q.id]);
    const nextState: Record<string, boolean> = {};
    data.importantQuestions.questions.forEach((q) => {
      nextState[q.id] = !allExpanded;
    });
    setExpandedQuestions(nextState);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 pt-3 pb-28 sm:pt-5 sm:pb-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 0. DEMO PREVIEW MODE BANNER (PROFESSIONAL & INTENTIONAL) ── */}
        <div className="mb-4 bg-[#F0F6FE] dark:bg-blue-950/30 border border-[#DCE7F6] dark:border-blue-900/40 rounded-xl px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#062B67] dark:text-blue-200">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#155EEF] text-white">
              DEMO PREVIEW MODE
            </span>
            <span className="hidden sm:inline font-medium text-slate-700 dark:text-slate-300">
              Template testing active: verified for typography, responsive layout, language switching, and navigation. Official syllabus notes will populate this structure.
            </span>
            <span className="sm:hidden font-medium text-slate-700 dark:text-slate-300">
              Template preview: UI, layout &amp; navigation test.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#155EEF] dark:text-blue-400 shrink-0 hidden md:inline">
            Template v1.0 • Ready for Content
          </span>
        </div>

        {/* ── 1. BREADCRUMBS ── */}
        <nav aria-label="Breadcrumbs" className="mb-3.5 sm:mb-5">
          <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-[#5B6B86] dark:text-slate-400">
            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </li>

            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/study-resources" className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                Study Resources
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </li>

            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href={`/study-resources?class=${classId}`} className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                {className}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </li>

            <li className="flex items-center gap-1.5 sm:gap-2">
              <Link href={chapterListUrl} className="hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors">
                {subjectName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </li>

            <li className="truncate max-w-[190px] sm:max-w-none">
              <span className="font-semibold text-[#062B67] dark:text-white">
                {currentChapter.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* ── 2. PAGE HEADER ── */}
        <div className="pb-4 sm:pb-5 border-b border-slate-200/90 dark:border-slate-800 mb-5 sm:mb-7">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400">
                  {className.toUpperCase()} &bull; {subjectName.toUpperCase()} &bull; CHAPTER {currentChapter.number}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl sm:text-2xl md:text-[30px] font-extrabold text-[#062B67] dark:text-white tracking-tight leading-snug">
                {isHindi ? data.titleHi : data.titleEn}
              </h1>

              {/* Subtitle */}
              <p className="mt-1 text-[13px] sm:text-[14.5px] text-[#5B6B86] dark:text-slate-400 font-normal">
                {isHindi ? data.subtitleHi : data.subtitleEn}
              </p>
            </div>

            {/* Back button */}
            <Link
              href={chapterListUrl}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#155EEF] dark:text-blue-400 hover:text-[#0052CC] hover:underline cursor-pointer self-start shrink-0 transition-colors pt-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Chapter List</span>
            </Link>
          </div>

          {/* ── LANGUAGE SWITCH & METADATA BAR (ZERO LAYOUT SHIFT) ── */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#062B67] dark:text-slate-300">
                Language / भाषा:
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  id="lang-switch-en"
                  onClick={() => setLanguage('english')}
                  className={`w-[68px] py-1 rounded-md text-xs font-semibold text-center transition-all cursor-pointer ${
                    !isHindi
                      ? 'bg-white dark:bg-slate-900 text-[#155EEF] dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  id="lang-switch-hi"
                  onClick={() => setLanguage('hindi')}
                  className={`w-[68px] py-1 rounded-md text-xs font-semibold text-center transition-all cursor-pointer ${
                    isHindi
                      ? 'bg-white dark:bg-slate-900 text-[#155EEF] dark:text-blue-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              <FlaskConical className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>NCERT Curriculum &bull; 2026–27</span>
            </div>
          </div>
        </div>

        {/* ── MOBILE "ON THIS PAGE" COLLAPSIBLE CONTROL ── */}
        <div className="block lg:hidden mb-5">
          <div className="bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 rounded-xl p-2.5 sm:p-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#062B67] dark:text-white cursor-pointer py-0.5"
            >
              <div className="flex items-center gap-2">
                <ListFilter className="w-3.5 h-3.5 text-[#155EEF]" />
                <span>On this page: Jump to section</span>
              </div>
              <span className="text-[#155EEF] font-semibold text-xs">
                {mobileTocOpen ? 'Hide ▲' : 'Show ▼'}
              </span>
            </button>

            {mobileTocOpen && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-blue-50 dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    • {isHindi ? item.labelHi : item.labelEn}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 3. MAIN NOTES TWO-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT COLUMN: MAIN NOTES CONTENT ── */}
          <main className="lg:col-span-8 xl:col-span-8.5 space-y-8 sm:space-y-11">
            
            {/* ════ SECTION 1: CHAPTER OVERVIEW ════ */}
            <section id="chapter-overview" className="scroll-mt-24 space-y-3.5 sm:space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.overview.titleHi : data.overview.titleEn}
                </h2>
              </div>

              <div className="text-[14px] sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                {(isHindi ? data.overview.paragraphsHi : data.overview.paragraphsEn).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* ════ SECTION 2: MATTER AND ITS CHARACTERISTICS ════ */}
            <section id="matter-characteristics" className="scroll-mt-24 space-y-4 sm:space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.keyConcept.titleHi : data.keyConcept.titleEn}
                </h2>
              </div>

              {/* DEFINITION BOX */}
              <div className="bg-[#F0F6FE] dark:bg-blue-950/40 border-l-[3.5px] border-[#155EEF] rounded-r-xl p-3.5 sm:p-4.5 shadow-2xs">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  {isHindi ? data.keyConcept.definitionTitleHi : data.keyConcept.definitionTitleEn}
                </div>
                <p className="text-[14px] sm:text-[15.5px] font-semibold text-[#062B67] dark:text-slate-100 leading-snug">
                  {isHindi ? data.keyConcept.definitionHi : data.keyConcept.definitionEn}
                </p>
              </div>

              {/* CHARACTERISTICS BULLET LIST */}
              <div className="space-y-2.5 text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <h3 className="text-sm sm:text-base font-bold text-[#062B67] dark:text-white">
                  {isHindi ? data.keyConcept.characteristicsTitleHi : data.keyConcept.characteristicsTitleEn}
                </h3>

                <ul className="space-y-2 pl-0.5">
                  {(isHindi ? data.keyConcept.characteristicsHi : data.keyConcept.characteristicsEn).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#155EEF] dark:text-blue-400 font-bold mt-0.5 text-sm">•</span>
                      <span>
                        <strong className="text-[#062B67] dark:text-white font-semibold">
                          {item.title}
                        </strong>{' '}
                        {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* REMEMBER HIGHLIGHT BOX */}
              <div className="bg-[#FEF9EE] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-900/60 rounded-xl p-3.5 sm:p-4.5">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#B45309] dark:text-amber-400 mb-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isHindi ? data.keyConcept.rememberTitleHi : data.keyConcept.rememberTitleEn}</span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] text-[#78350F] dark:text-amber-200 leading-relaxed font-medium">
                  {isHindi ? data.keyConcept.rememberHi : data.keyConcept.rememberEn}
                </p>
              </div>
            </section>

            {/* ════ SECTION 3: STATES OF MATTER ════ */}
            <section id="states-of-matter" className="scroll-mt-24 space-y-4 sm:space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.comparisonSection.titleHi : data.comparisonSection.titleEn}
                </h2>
              </div>

              <p className="text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {isHindi ? data.comparisonSection.introHi : data.comparisonSection.introEn}
              </p>

              {/* RESPONSIVE COMPARISON TABLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-[#062B67] dark:text-white uppercase tracking-wider">
                    {isHindi ? data.comparisonSection.tableHeadingHi : data.comparisonSection.tableHeadingEn}
                  </h3>
                  <span className="sm:hidden text-[10.5px] text-slate-400 font-medium">
                    Scroll horizontally &rarr;
                  </span>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-[13px] border-collapse min-w-[520px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[#062B67] dark:text-slate-200 font-bold">
                        {(isHindi ? data.comparisonSection.headersHi : data.comparisonSection.headersEn).map((h, i) => (
                          <th key={i} className="py-2.5 px-3 sm:px-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {(isHindi ? data.comparisonSection.rowsHi : data.comparisonSection.rowsEn).map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}>
                          <td className="py-2.5 px-3 sm:px-4 font-semibold text-[#062B67] dark:text-white">{row.property}</td>
                          <td className="py-2.5 px-3 sm:px-4">{row.solid}</td>
                          <td className="py-2.5 px-3 sm:px-4">{row.liquid}</td>
                          <td className="py-2.5 px-3 sm:px-4">{row.gas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compressed gas note */}
              <div className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5">
                <strong className="text-[#062B67] dark:text-white">
                  {isHindi ? 'दैनिक जीवन में अनुप्रयोग:' : 'Real-world Application:'}
                </strong>{' '}
                {isHindi ? data.comparisonSection.realWorldNoteHi : data.comparisonSection.realWorldNoteEn}
              </div>
            </section>

            {/* ════ SECTION 4: CHANGE OF STATE ════ */}
            <section id="change-of-state" className="scroll-mt-24 space-y-4 sm:space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.changeOfState.titleHi : data.changeOfState.titleEn}
                </h2>
              </div>

              <p className="text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {isHindi ? data.changeOfState.introHi : data.changeOfState.introEn}
              </p>

              {/* FORMULA HIGHLIGHT BOX */}
              <div className="bg-[#F0F5FF] dark:bg-blue-950/40 border border-[#DCE7F6] dark:border-blue-900/60 rounded-xl p-3.5 sm:p-4.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  {isHindi ? data.changeOfState.formulaTitleHi : data.changeOfState.formulaTitleEn}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#062B67] dark:text-white font-mono">
                  {data.changeOfState.formulaText}
                </div>
                <p className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {isHindi ? data.changeOfState.formulaExampleHi : data.changeOfState.formulaExampleEn}
                </p>
              </div>

              {/* DIAGRAM AREA */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-[#062B67] dark:text-slate-200 text-xs sm:text-sm">
                    {isHindi ? 'अवस्थाओं का अंतःरूपांतरण (Interconversion Schematic)' : 'Interconversion of States of Matter'}
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#155EEF] uppercase tracking-wider">
                    Core Concept
                  </span>
                </div>

                <div className="py-3 px-1 flex flex-col sm:flex-row items-center justify-around gap-3 text-center">
                  {/* SOLID */}
                  <div className="w-24 sm:w-28 py-2.5 rounded-xl bg-[#F0F5FF] border border-[#BFDBFE] dark:border-blue-800 text-center">
                    <span className="text-xs font-bold text-[#1E40AF]">SOLID</span>
                    <span className="block text-[10px] text-slate-500">e.g. Ice</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 text-[10.5px] sm:text-[11px] font-semibold text-[#155EEF]">
                    <span>⇄ Fusion / Solidification ⇄</span>
                  </div>

                  {/* LIQUID */}
                  <div className="w-24 sm:w-28 py-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] dark:border-emerald-800 text-center">
                    <span className="text-xs font-bold text-[#065F46]">LIQUID</span>
                    <span className="block text-[10px] text-slate-500">e.g. Water</span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5 text-[10.5px] sm:text-[11px] font-semibold text-[#10B981]">
                    <span>⇄ Vaporization / Condensation ⇄</span>
                  </div>

                  {/* GAS */}
                  <div className="w-24 sm:w-28 py-2.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] dark:border-amber-800 text-center">
                    <span className="text-xs font-bold text-[#92400E]">GAS</span>
                    <span className="block text-[10px] text-slate-500">e.g. Steam</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] sm:text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  Direct Solid ⇄ Gas change: <strong>Sublimation</strong> (ठोस से सीधे गैस) &amp; <strong>Deposition</strong> (गैस से सीधे ठोस)
                </div>
              </div>

              {/* DEFINITION: LATENT HEAT */}
              <div className="bg-[#F0F6FE] dark:bg-blue-950/40 border-l-[3.5px] border-[#155EEF] rounded-r-xl p-3.5 sm:p-4.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  {isHindi ? data.changeOfState.latentHeatTitleHi : data.changeOfState.latentHeatTitleEn}
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#062B67] dark:text-slate-100 leading-relaxed font-medium">
                  {isHindi ? data.changeOfState.latentHeatDefHi : data.changeOfState.latentHeatDefEn}
                </p>
              </div>
            </section>

            {/* ════ SECTION 5: EVAPORATION ════ */}
            <section id="evaporation" className="scroll-mt-24 space-y-4 sm:space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.evaporationSection.titleHi : data.evaporationSection.titleEn}
                </h2>
              </div>

              <div className="bg-[#F0F6FE] dark:bg-blue-950/40 border-l-[3.5px] border-[#155EEF] rounded-r-xl p-3.5 sm:p-4.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  {isHindi ? data.evaporationSection.defTitleHi : data.evaporationSection.defTitleEn}
                </div>
                <p className="text-[13.5px] sm:text-[14px] font-semibold text-[#062B67] dark:text-slate-100 leading-snug">
                  {isHindi ? data.evaporationSection.defHi : data.evaporationSection.defEn}
                </p>
              </div>

              <div className="space-y-2.5 text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <h3 className="text-sm sm:text-base font-bold text-[#062B67] dark:text-white">
                  {isHindi ? data.evaporationSection.factorsTitleHi : data.evaporationSection.factorsTitleEn}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-0.5">
                  {(isHindi ? data.evaporationSection.factorsHi : data.evaporationSection.factorsEn).map((factor, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <strong className="text-[#062B67] dark:text-white block text-xs uppercase tracking-wider mb-1">
                        {factor.title}
                      </strong>
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                        {factor.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOW EVAPORATION CAUSES COOLING */}
              <div className="bg-[#FEF9EE] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-900/60 rounded-xl p-3.5 sm:p-4.5">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#B45309] dark:text-amber-400 mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>{isHindi ? data.evaporationSection.coolingTitleHi : data.evaporationSection.coolingTitleEn}</span>
                </div>
                <p className="text-[13px] sm:text-[13.5px] text-[#78350F] dark:text-amber-200 leading-relaxed font-medium">
                  {isHindi ? data.evaporationSection.coolingHi : data.evaporationSection.coolingEn}
                </p>
              </div>
            </section>

            {/* ════ SECTION 6: QUICK REVISION ════ */}
            <section id="quick-revision" className="scroll-mt-24 space-y-3.5 sm:space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.quickRevision.titleHi : data.quickRevision.titleEn}
                </h2>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-2.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                <div className="font-bold text-[#062B67] dark:text-white text-xs sm:text-sm pb-0.5">
                  {isHindi ? data.quickRevision.cardHeadingHi : data.quickRevision.cardHeadingEn}
                </div>
                <ul className="space-y-2">
                  {(isHindi ? data.quickRevision.pointsHi : data.quickRevision.pointsEn).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ════ SECTION 7: IMPORTANT QUESTIONS (DEMO PRACTICE) ════ */}
            <section id="important-questions" className="scroll-mt-24 space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#062B67] dark:text-white tracking-tight">
                  {isHindi ? data.importantQuestions.titleHi : data.importantQuestions.titleEn}
                </h2>

                <button
                  type="button"
                  id="toggle-all-questions-btn"
                  onClick={toggleAllQuestions}
                  className="text-xs font-semibold text-[#155EEF] hover:text-[#0052CC] hover:underline cursor-pointer"
                >
                  {data.importantQuestions.questions.every((q) => expandedQuestions[q.id])
                    ? (isHindi ? 'सभी उत्तर छिपाएं' : 'Collapse All')
                    : (isHindi ? 'सभी उत्तर देखें' : 'Expand All')}
                </button>
              </div>

              <p className="text-[13px] sm:text-[13.5px] text-slate-600 dark:text-slate-400">
                {isHindi
                  ? 'अध्याय के महत्वपूर्ण प्रश्न एवं मॉडल उत्तर (उत्तर देखने के लिए प्रश्न पर क्लिक करें):'
                  : 'Key practice questions with model answers. Click on any question to view the answer:'}
              </p>

              <div className="space-y-2.5">
                {data.importantQuestions.questions.map((q, idx) => {
                  const isExpanded = !!expandedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleQuestion(q.id)}
                        className="w-full p-3 sm:p-3.5 flex items-start justify-between gap-3 text-left cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 select-none transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 text-[10.5px] font-bold shrink-0 mt-0.5">
                            {q.marks}
                          </span>
                          <span className="font-semibold text-xs sm:text-[13.5px] text-[#062B67] dark:text-white leading-snug">
                            Q{idx + 1}. {isHindi ? q.questionHi : q.questionEn}
                          </span>
                        </div>
                        <span className="text-[#155EEF] text-xs font-semibold shrink-0 pt-0.5">
                          {isExpanded ? 'Hide ▲' : 'Answer ▼'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-1.5 border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC]/70 dark:bg-slate-950/40">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{isHindi ? 'मॉडल उत्तर (Model Solution):' : 'Model Answer:'}</span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                            {isHindi ? q.answerHi : q.answerEn}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ════ SECTION 8: DOWNLOAD NOTES ════ */}
            <section id="download-notes" className="scroll-mt-24 pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-800 space-y-5">
              <div className="text-center max-w-xl mx-auto">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  8. STUDY KIT &amp; PDF DOWNLOADS
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#062B67] dark:text-white tracking-tight">
                  Download Notes
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400">
                  Choose the notes format that works best for your preparation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* OPTION 1: Free Revision Notes */}
                <div className="bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10.5px] mb-2.5">
                      Quick Revision
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold text-[#062B67] dark:text-white">
                      Free Revision Notes
                    </h3>
                    
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      Short and focused notes for quick revision.
                    </p>

                    <ul className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                        <span>Essential concepts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                        <span>Key definitions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />
                        <span>Quick revision points</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      id="download-free-pdf-btn"
                      onClick={() => handleDownloadClick('free')}
                      className="w-full h-10 rounded-xl border border-[#155EEF] text-[#155EEF] hover:bg-[#F0F5FF] dark:hover:bg-blue-950/50 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Free PDF (Demo Preview) &rarr;</span>
                    </button>
                    <p className="mt-1.5 text-center text-[10px] text-slate-400 font-medium">PDF connection ready for official syllabus</p>
                  </div>
                </div>

                {/* OPTION 2: Premium Full Notes */}
                <div className="bg-white dark:bg-slate-900 border-2 border-[#155EEF] rounded-2xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(21,94,239,0.08)] flex flex-col justify-between relative">
                  <div className="absolute -top-3 right-4 bg-[#155EEF] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended
                  </div>

                  <div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-bold text-[10.5px] mb-2.5">
                      Complete Study Kit
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#062B67] dark:text-white">
                      Premium Full Notes
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      Complete chapter notes for detailed preparation.
                    </p>

                    <ul className="mt-3.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Detailed explanations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Important examples</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Diagrams</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Exam-focused points</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Complete chapter coverage</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      id="download-premium-pdf-btn"
                      onClick={() => handleDownloadClick('premium')}
                      className="w-full h-10 rounded-xl bg-[#155EEF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Get Full Notes (Demo Preview) &rarr;</span>
                    </button>
                    <p className="mt-1.5 text-center text-[10px] text-slate-400 font-medium">PDF connection ready for official syllabus</p>
                  </div>
                </div>

              </div>
            </section>

            {/* ════ BOTTOM CHAPTER NAVIGATION ════ */}
            <nav aria-label="Chapter Navigation" className="pt-6 sm:pt-7 border-t border-slate-200/90 dark:border-slate-800">
              {/* Desktop layout: 3 columns */}
              <div className="hidden sm:flex items-center justify-between gap-3">
                {/* Previous chapter button */}
                {previousChapter ? (
                  <Link
                    href={`/study-resources/class-${classId}/${subjectId}/${previousChapter.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#062B67] dark:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                    <ArrowLeft className="w-4 h-4 opacity-50" />
                    <span>Previous Chapter</span>
                  </div>
                )}

                {/* Back to chapter list */}
                <Link
                  href={chapterListUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#155EEF] dark:text-blue-400 hover:underline transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Back to Chapter List</span>
                </Link>

                {/* Next chapter button */}
                {nextChapter ? (
                  <Link
                    href={`/study-resources/class-${classId}/${subjectId}/${nextChapter.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#DCE7F6] dark:border-slate-800 hover:border-[#155EEF] bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#155EEF] dark:text-blue-400 transition-colors"
                  >
                    <span>Next Chapter</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                    <span>Next Chapter</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </div>
                )}
              </div>

              {/* Mobile layout: 2-column Prev/Next + centered Back link */}
              <div className="flex flex-col gap-2.5 sm:hidden">
                <div className="grid grid-cols-2 gap-2.5">
                  {previousChapter ? (
                    <Link
                      href={`/study-resources/class-${classId}/${subjectId}/${previousChapter.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-[#062B67] dark:text-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev Chapter</span>
                    </Link>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                      <ArrowLeft className="w-3.5 h-3.5 opacity-50" />
                      <span>Prev Chapter</span>
                    </div>
                  )}

                  {nextChapter ? (
                    <Link
                      href={`/study-resources/class-${classId}/${subjectId}/${nextChapter.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-[#155EEF] bg-blue-50/50 dark:bg-blue-950/40 text-xs font-semibold text-[#155EEF] dark:text-blue-400 transition-colors"
                    >
                      <span>Next Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed select-none">
                      <span>Next Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    </div>
                  )}
                </div>

                <Link
                  href={chapterListUrl}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:underline transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Back to Chapter List</span>
                </Link>
              </div>
            </nav>

          </main>

          {/* ── RIGHT COLUMN: STICKY "ON THIS PAGE" TOC (DESKTOP) ── */}
          <aside className="lg:col-span-4 xl:col-span-3.5 hidden lg:block sticky top-24">
            <div className="bg-white dark:bg-slate-900 border border-[#DCE7F6] dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(6,43,103,0.03)] space-y-3.5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <ListFilter className="w-4 h-4 text-[#155EEF]" />
                <h3 className="text-xs font-bold text-[#062B67] dark:text-white uppercase tracking-wider">
                  On this page
                </h3>
              </div>

              <nav className="space-y-1 text-xs">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-bold border-l-2 border-[#155EEF]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        {isHindi ? item.labelHi : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Language:</span>
                  <span className="font-semibold text-[#062B67] dark:text-white">
                    {isHindi ? 'हिंदी' : 'English'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
