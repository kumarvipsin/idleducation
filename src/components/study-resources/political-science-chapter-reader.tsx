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
  Bookmark, 
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  Search,
  Quote,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ListOrdered,
  ChevronDown,
  X
} from 'lucide-react';
import { type ChapterItem } from '@/lib/study-resources-data';
import { CLASS_12_POLSCI_CH1_DATA, type PolSciTopic } from '@/lib/class-12-polsci-ch1-data';
import { useToast } from '@/hooks/use-toast';

export interface PoliticalScienceChapterReaderProps {
  currentChapter: ChapterItem;
  chapterIndex: number;
  previousChapter: ChapterItem | null;
  nextChapter: ChapterItem | null;
}

export function PoliticalScienceChapterReader({
  currentChapter,
  chapterIndex: _chapterIndex,
  previousChapter,
  nextChapter,
}: PoliticalScienceChapterReaderProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const [activeSection, setActiveSection] = useState<string>('chapter-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    q1: true,
    q3: true,
  });

  const isHindi = language === 'hindi';
  const data = CLASS_12_POLSCI_CH1_DATA;

  // Build TOC items from topics
  const tocItems = [
    { id: 'chapter-overview', labelHi: 'अध्याय परिचय', labelEn: 'Chapter Overview' },
    ...data.topics.map((t) => ({
      id: t.id,
      labelHi: `${t.number}. ${t.titleHi.split('(')[0].trim()}`,
      labelEn: `${t.number}. ${t.titleEn.split('—')[0].trim()}`,
    })),
    { id: 'quick-revision', labelHi: 'त्वरित पुनरीक्षण', labelEn: 'Quick Revision' },
    { id: 'board-questions', labelHi: 'बोर्ड परीक्षा प्रश्न', labelEn: 'Board Exam Questions' },
    { id: 'download-notes', labelHi: 'नोट्स डाउनलोड (PDF)', labelEn: 'Download Notes' },
  ];

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
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
    setMobileTocOpen(false);
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
    }
  };

  const handleDownloadClick = (type: 'free' | 'premium' = 'free') => {
    toast({
      title: type === 'premium'
        ? (isHindi ? 'प्रीमियम नोट्स किट तैयार हो रहा है' : 'Preparing Premium Study Kit')
        : (isHindi ? 'निःशुल्क रिवीज़न नोट्स पीडीएफ' : 'Free Revision Notes PDF'),
      description: isHindi
        ? 'कक्षा 12वीं राजनीति विज्ञान अध्याय 1 का आधिकारिक पीडीएफ संस्करण डाउनलोड के लिए तैयार किया जा रहा है।'
        : 'Official downloadable PDF for Class 12 Political Science Chapter 1 is being generated.',
    });
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

  // Filter topics if search query is entered
  const filteredTopics = searchQuery.trim()
    ? data.topics.filter(
        (t) =>
          t.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.bulletPointsHi?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          t.bulletPointsEn?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          t.subTopics?.some(
            (st) =>
              st.subtitleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
              st.subtitleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
              st.pointsHi.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
              st.pointsEn.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
          )
      )
    : data.topics;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-100 selection:text-purple-900 pt-3 pb-28 sm:pt-5 sm:pb-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">

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
              <Link href="/study-resources?class=12" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Class 12
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <li>
              <Link href="/study-resources?class=12&subject=political-science" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                Political Science
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
              <div className="flex items-center flex-wrap gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-[#062B67] dark:bg-slate-800 dark:text-blue-300 font-sans">
                  <BookOpen className="w-3.5 h-3.5 text-[#155EEF]" />
                  {data.classText} • {data.subjectText}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-hindi">
                  <Layers className="w-3.5 h-3.5" />
                  अध्याय {data.chapterNumber} (Chapter {data.chapterNumber})
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 font-hindi">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  NCERT पाठ्यक्रम अनुसार (Complete Notes)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#062B67] dark:text-white tracking-tight mb-2 font-hindi leading-[1.3]">
                {isHindi ? data.titleHi : data.titleEn}
              </h1>
              <p className="text-sm sm:text-base text-[#5B6B86] dark:text-slate-300 max-w-3xl leading-relaxed font-hindi">
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
              <span>{isHindi ? '13 विस्तृत विषय एवं उप-विषय' : '13 Detailed Topics'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'बोर्ड परीक्षा मॉडल प्रश्न व उत्तर' : 'Board Exam Q&A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? '100% विज्ञापन-मुक्त एवं स्पष्ट' : '100% Ad-Free Format'}</span>
            </div>
          </div>
        </div>

        {/* ── 3. MAIN CONTENT LAYOUT (NOTES ON LEFT, TOPIC TOC ON RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── 3A. UNIFIED CHAPTER READING DOCUMENT (ONE CONTINUOUS MINIMAL PAGE VIEW) ── */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-none divide-y divide-slate-100 dark:divide-slate-800/80 pb-16">

            {/* 1. OVERVIEW SECTION */}
            <section
              id="chapter-overview"
              className="pb-10 pt-2 first:pt-0"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-bold text-[#062B67] dark:text-blue-300 font-sans tracking-wide">
                  Overview
                </span>
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-hindi">
                  अध्याय अवलोकन
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white mb-4 font-hindi tracking-tight leading-[1.35]">
                {isHindi ? 'अध्याय का संक्षिप्त परिचय एवं पृष्ठभूमि' : 'Chapter Summary & Historical Context'}
              </h2>
              <div className="space-y-3.5 text-slate-700 dark:text-slate-300 text-[15px] sm:text-base font-hindi leading-[1.82]">
                {(isHindi ? data.overviewHi : data.overviewEn).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* 2. DYNAMIC TOPICS (UNIFIED VISUAL DESIGN SYSTEM - MINIMAL CONTINUOUS VIEW) */}
            {filteredTopics.map((topic: PolSciTopic) => (
              <article
                key={topic.id}
                id={topic.id}
                className="py-10 first:pt-0"
              >
                {/* 2A. Topic Header: Section Number + Consistent Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-bold text-[#062B67] dark:text-blue-300 font-sans tracking-wide">
                    Topic {topic.number}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-hindi">
                    {topic.badge}
                  </span>
                </div>

                {/* 2B. Topic Heading */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white mb-2 font-hindi tracking-tight leading-[1.35]">
                  {isHindi ? topic.titleHi : topic.titleEn}
                </h3>

                {/* 2C. Optional Topic Summary / Quote */}
                {topic.summaryHi && (
                  <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 dark:text-slate-300 italic font-hindi leading-[1.75] mb-5 border-l-2 border-[#155EEF] pl-3.5 py-1 bg-slate-50/50 dark:bg-slate-800/30 rounded-r-lg">
                    {isHindi ? topic.summaryHi : topic.summaryEn}
                  </p>
                )}

                {/* 2D. Key Stats Bar if exists */}
                {topic.keyStats && topic.keyStats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                    {topic.keyStats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-center shadow-none"
                      >
                        <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 font-hindi">
                          {isHindi ? stat.labelHi : stat.labelEn}
                        </span>
                        <span className="block text-base sm:text-lg font-bold text-[#062B67] dark:text-blue-400 font-sans">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2E. Bullet Points List */}
                {((isHindi ? topic.bulletPointsHi : topic.bulletPointsEn) || []).length > 0 && (
                  <div className="space-y-3 mt-4">
                    {((isHindi ? topic.bulletPointsHi : topic.bulletPointsEn) || []).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 flex items-center justify-center shrink-0 mt-1 border border-blue-100 dark:border-blue-900/50">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 font-hindi leading-[1.82] flex-1">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2F. Sub-topics: Flowing cleanly like a digital textbook without nested box cards */}
                {topic.subTopics && topic.subTopics.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    {topic.subTopics.map((sub, sIdx) => (
                      <div key={sIdx}>
                        <h4 className="text-base sm:text-lg font-bold text-[#062B67] dark:text-white font-hindi flex items-center gap-2 mb-3">
                          <span className="w-1.5 h-4 rounded-full bg-[#155EEF] shrink-0" />
                          <span>{isHindi ? sub.subtitleHi : sub.subtitleEn}</span>
                        </h4>
                        <div className="space-y-2.5 pl-3.5">
                          {(isHindi ? sub.pointsHi : sub.pointsEn).map((p, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5">
                              <span className="text-[#155EEF] font-bold text-sm leading-relaxed mt-0.5">•</span>
                              <p className="text-[14.5px] sm:text-[15.5px] text-slate-700 dark:text-slate-300 font-hindi leading-[1.8] flex-1">
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
                  <div className="mt-6 rounded-xl border border-slate-200/80 dark:border-slate-700 border-l-4 border-l-[#155EEF] bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 shadow-none">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#062B67] dark:text-blue-300 mb-1.5">
                      <Lightbulb className="w-4 h-4 text-[#155EEF]" />
                      <span className="font-hindi">{isHindi ? topic.calloutBox.titleHi : topic.calloutBox.titleEn}</span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 font-hindi leading-[1.75]">
                      {isHindi ? topic.calloutBox.contentHi : topic.calloutBox.contentEn}
                    </p>
                  </div>
                )}
              </article>
            ))}

            {/* 3. QUICK REVISION POINTS */}
            <section
              id="quick-revision"
              className="py-10"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-bold text-[#062B67] dark:text-blue-300 font-sans tracking-wide">
                    Summary
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-hindi">
                    त्वरित पुनरीक्षण
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white font-hindi tracking-tight">
                    {isHindi ? 'त्वरित पुनरीक्षण बिंदु' : 'Quick Revision Key Takeaways'}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-hindi">
                  {data.quickRevisionPointsHi.length} {isHindi ? 'मुख्य बिंदु' : 'Key Points'}
                </span>
              </div>

              <div className="space-y-3">
                {(isHindi ? data.quickRevisionPointsHi : data.quickRevisionPointsEn).map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 shadow-none"
                  >
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#155EEF] dark:bg-blue-950 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-sans">
                      {idx + 1}
                    </span>
                    <p className="text-[14.5px] sm:text-[15.5px] text-slate-700 dark:text-slate-300 font-hindi leading-[1.8] flex-1">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. BOARD EXAM QUESTIONS SECTION */}
            <section
              id="board-questions"
              className="py-10"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-bold text-[#062B67] dark:text-blue-300 font-sans tracking-wide">
                    Practice
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#155EEF] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 font-hindi">
                    बोर्ड परीक्षा तैयारी
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#062B67] dark:text-white font-hindi tracking-tight">
                    {isHindi ? 'बोर्ड परीक्षा उपयोगी महत्वपूर्ण प्रश्न' : 'Important Board Examination Questions'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={toggleAllQuestions}
                  className="text-xs font-semibold text-[#155EEF] dark:text-blue-400 hover:text-[#0052CC] underline underline-offset-2 font-hindi cursor-pointer"
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
                      className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all bg-white dark:bg-slate-900 shadow-none"
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
                            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5 font-hindi">
                              {isHindi ? q.typeHi : q.typeEn}
                            </span>
                            <span className="block text-sm sm:text-base font-bold text-[#062B67] dark:text-slate-100 font-hindi leading-snug">
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
                        <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-hindi">
                          <div className="font-semibold text-[#155EEF] dark:text-blue-400 mb-1.5 flex items-center gap-1.5 font-hindi">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{isHindi ? 'आदर्श उत्तर (Model Answer):' : 'Model Answer:'}</span>
                          </div>
                          <div className="text-[14px] sm:text-[15px] leading-[1.8] text-slate-700 dark:text-slate-300">
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
              className="py-10 space-y-6"
            >
              {/* Eyebrow & Title */}
              <div className="text-center max-w-xl mx-auto">
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
                  8. STUDY KIT &amp; PDF DOWNLOADS
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between hover:border-blue-300 transition-all">
                  <div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3">
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

            {/* 6. CHAPTER NAVIGATION FOOTER */}
            <div className="flex items-center justify-between gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
              {previousChapter ? (
                <Link
                  href={`/study-resources/class-12/political-science/${previousChapter.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-400 transition-all shadow-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isHindi ? 'पिछला अध्याय' : 'Previous Chapter'}</span>
                </Link>
              ) : (
                <Link
                  href="/study-resources?class=12&subject=political-science"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-400 transition-all shadow-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isHindi ? 'अध्याय सूची' : 'Chapter List'}</span>
                </Link>
              )}

              {nextChapter ? (
                <Link
                  href={`/study-resources/class-12/political-science/${nextChapter.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold shadow-none transition-all"
                >
                  <span>{isHindi ? `अगला: ${nextChapter.name}` : `Next: ${nextChapter.name}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection('download-notes')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#155EEF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-semibold shadow-none transition-all cursor-pointer font-hindi"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHindi ? 'नोट्स डाउनलोड करें' : 'Download Complete Notes'}</span>
                </button>
              )}
            </div>

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

        {/* ── 4. MOBILE FLOATING TOC TRIGGER (POSITIONED BOTTOM-LEFT TO NEVER OVERLAP WHATSAPP / AI ASSISTANT) ── */}
        <div className="lg:hidden fixed bottom-6 left-6 z-40">
          <button
            type="button"
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#062B67] hover:bg-[#0A3A8A] text-white rounded-full shadow-lg hover:shadow-xl font-semibold text-xs transition-all active:scale-95 border border-blue-400/30 font-hindi"
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
