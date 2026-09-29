'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  BookOpen,
  HelpCircle,
  Clock,
  Search,
  ListOrdered,
  Sparkles,
  X
} from 'lucide-react';
import { type ChapterItem } from '@/lib/study-resources-data';
import { CLASS_12_POLSCI_CH1_DATA } from '@/lib/class-12-polsci-ch1-data';
import { useToast } from '@/hooks/use-toast';
import { Class12BipolarityEnglishNotes } from './class-12-bipolarity-english-notes';
import { Class12BipolarityHindiNotes } from './class-12-bipolarity-hindi-notes';
import { Class12CentresOfPowerEnglishNotes } from './class-12-centres-of-power-english-notes';
import { Class12CentresOfPowerHindiNotes } from './class-12-centres-of-power-hindi-notes';
import { Class12SouthAsiaEnglishNotes } from './class-12-south-asia-english-notes';

export interface PoliticalScienceChapterReaderProps {
  currentChapter: ChapterItem;
  chapterIndex: number;
  previousChapter: ChapterItem | null;
  nextChapter: ChapterItem | null;
}

export function PoliticalScienceChapterReader({
  currentChapter,
  previousChapter: _previousChapter,
  nextChapter: _nextChapter,
}: PoliticalScienceChapterReaderProps) {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'hindi' | 'english'>('english');
  const [activeSection, setActiveSection] = useState<string>('chapter-overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const isHindi = language === 'hindi';
  const data = CLASS_12_POLSCI_CH1_DATA;

  const isChapter3 = currentChapter.slug === 'contemporary-south-asia';
  const isChapter2 = currentChapter.slug === 'contemporary-centres-of-power';
  const chapterNumber = isChapter3 ? '03' : isChapter2 ? '02' : '01';
  const chapterTitleHi = isChapter3
    ? 'समकालीन दक्षिण एशिया'
    : isChapter2
      ? 'सत्ता के समकालीन केंद्र'
      : 'दो ध्रुवीयता का अंत';
  const chapterTitleEn = isChapter3
    ? 'Contemporary South Asia'
    : isChapter2
      ? 'Contemporary Centres of Power'
      : 'The End of Bipolarity';
  const chapterSubtitleHi = isChapter3
    ? 'समकालीन विश्व राजनीति • दक्षिण एशिया में लोकतंत्र, संघर्ष, सहयोग एवं सार्क (SAARC)'
    : isChapter2
      ? 'समकालीन विश्व राजनीति • यूरोपीय संघ, आसियान, चीन का आर्थिक उत्थान एवं भारत-चीन संबंध'
      : 'समकालीन विश्व राजनीति • एनसीईआरटी पाठ्यक्रम अनुसार संपूर्ण परीक्षा उपयोगी नोट्स';
  const chapterSubtitleEn = isChapter3
    ? 'Contemporary World Politics • Democracy in South Asia, Conflicts, Bilateral Relations & SAARC'
    : isChapter2
      ? 'Contemporary World Politics • European Union, ASEAN, Rise of China & India–China Relations'
      : 'Contemporary World Politics • Complete NCERT Syllabus Revision & Exam Notes';

  // Language-specific class and subject labels
  const classLabel = isHindi ? 'कक्षा 12' : 'Class 12';
  const subjectLabel = isHindi ? 'राजनीति विज्ञान' : 'Political Science';

  // Chapter 1 English TOC
  const ch1EnglishTocItems = [
    { id: 'mind-map', label: 'Chapter Mind Map (Overview)' },
    { id: 'section-1', label: '01. What Was the Soviet System?' },
    { id: 'section-2', label: '02. Weaknesses of the Soviet System' },
    { id: 'section-3', label: '03. Gorbachev’s Reforms' },
    { id: 'section-4', label: '04. How Disintegration Happened' },
    { id: 'section-5', label: '05. Shock Therapy & Consequences' },
    { id: 'section-6', label: '06. India–Russia Relationship' },
    { id: 'quick-recap', label: '07. Quick Recap (Exam Night Revision)' },
    { id: 'practice-questions-1', label: '08. Practice Questions: 1 Mark' },
    { id: 'practice-questions-2-4', label: '09. Practice Questions: 2 & 4 Marks' },
    { id: 'practice-questions-6', label: '10. Practice Questions: 6 Marks' },
    { id: 'mcqs', label: '11. Multiple Choice Questions (MCQ)' },
    { id: 'assertion-reason', label: '12. Assertion and Reason' },
    { id: 'answer-key', label: '13. Official Answer Key' },
    { id: 'download-notes', label: '14. Study Kit & PDF Downloads' },
  ];

  // Chapter 1 Hindi TOC
  const ch1HindiTocItems = [
    { id: 'mind-map', label: 'अध्याय का माइंड मैप (अवलोकन)' },
    { id: 'section-1', label: '01. सोवियत प्रणाली क्या थी?' },
    { id: 'section-2', label: '02. सोवियत प्रणाली की कमज़ोरियाँ' },
    { id: 'section-3', label: '03. गोर्बाचेव के सुधार' },
    { id: 'section-4', label: '04. विघटन कैसे हुआ' },
    { id: 'section-5', label: '05. शॉक थेरेपी और उसके परिणाम' },
    { id: 'section-6', label: '06. भारत और रूस के संबंध' },
    { id: 'quick-recap', label: '07. झटपट दोहराव (परीक्षा से पूर्व)' },
    { id: 'practice-questions-1', label: '08. अभ्यास प्रश्न: 1 अंक' },
    { id: 'practice-questions-2-4', label: '09. अभ्यास प्रश्न: 2 और 4 अंक' },
    { id: 'practice-questions-6', label: '10. अभ्यास प्रश्न: 6 अंक' },
    { id: 'mcqs', label: '11. बहुविकल्पीय प्रश्न (MCQ)' },
    { id: 'assertion-reason', label: '12. अभिकथन और कारण' },
    { id: 'answer-key', label: '13. उत्तर कुंजी (Answer Key)' },
    { id: 'download-notes', label: '14. स्टडी किट एवं पीडीएफ डाउनलोड' },
  ];

  // Chapter 2 English TOC
  const ch2EnglishTocItems = [
    { id: 'mind-map', label: 'Chapter Mind Map (Overview)' },
    { id: 'section-1', label: '01. Why Alternative Centres Emerged?' },
    { id: 'section-2', label: '02. The European Union' },
    { id: 'section-3', label: '03. ASEAN & The “ASEAN Way”' },
    { id: 'section-4', label: '04. China’s Economic Rise' },
    { id: 'section-5', label: '05. India–China Relations' },
    { id: 'quick-recap', label: '06. Quick Recap (Exam Night Revision)' },
    { id: 'practice-questions-1', label: '07. Practice Questions: 1 Mark' },
    { id: 'practice-questions-2-4', label: '08. Practice Questions: 2 & 4 Marks' },
    { id: 'practice-questions-6', label: '09. Practice Questions: 6 Marks' },
    { id: 'mcqs', label: '10. Multiple Choice Questions (MCQ)' },
    { id: 'assertion-reason', label: '11. Assertion and Reason' },
    { id: 'answer-key', label: '12. Official Answer Key' },
    { id: 'download-notes', label: '13. Study Kit & PDF Downloads' },
  ];

  // Chapter 2 Hindi TOC
  const ch2HindiTocItems = [
    { id: 'mind-map', label: 'अध्याय का माइंड मैप (अवलोकन)' },
    { id: 'section-1', label: '01. सत्ता के वैकल्पिक केंद्र क्यों उभरे?' },
    { id: 'section-2', label: '02. यूरोपीय संघ (European Union)' },
    { id: 'section-3', label: '03. आसियान एवं “आसियान शैली”' },
    { id: 'section-4', label: '04. चीन का आर्थिक उत्थान' },
    { id: 'section-5', label: '05. भारत–चीन संबंध' },
    { id: 'quick-recap', label: '06. झटपट दोहराव (परीक्षा से पूर्व)' },
    { id: 'practice-questions-1', label: '07. अभ्यास प्रश्न: 1 अंक' },
    { id: 'practice-questions-2-4', label: '08. अभ्यास प्रश्न: 2 और 4 अंक' },
    { id: 'practice-questions-6', label: '09. अभ्यास प्रश्न: 6 अंक' },
    { id: 'mcqs', label: '10. बहुविकल्पीय प्रश्न (MCQ)' },
    { id: 'assertion-reason', label: '11. अभिकथन और कारण' },
    { id: 'answer-key', label: '12. उत्तर कुंजी (Answer Key)' },
    { id: 'download-notes', label: '13. स्टडी किट एवं पीडीएफ डाउनलोड' },
  ];

  // Chapter 3 English TOC
  const ch3EnglishTocItems = [
    { id: 'mind-map', label: 'Chapter Mind Map (Overview)' },
    { id: 'section-1', label: '01. What Is South Asia?' },
    { id: 'section-2', label: '02. The Path to Democracy' },
    { id: 'section-3', label: '03. India and Pakistan' },
    { id: 'section-4', label: '04. India and Its Other Neighbours' },
    { id: 'section-5', label: '05. SAARC and Regional Cooperation' },
    { id: 'quick-recap', label: '06. Quick Recap (Exam Night Revision)' },
    { id: 'practice-questions-1', label: '07. Practice Questions: 1 Mark' },
    { id: 'practice-questions-2-4', label: '08. Practice Questions: 2 and 4 Marks' },
    { id: 'practice-questions-6', label: '09. Practice Questions: 6 Marks' },
    { id: 'mcqs', label: '10. Multiple Choice Questions (MCQ)' },
    { id: 'assertion-reason', label: '11. Assertion and Reason' },
    { id: 'answer-key', label: '12. Official Answer Key' },
    { id: 'download-notes', label: '13. Study Kit & PDF Downloads' },
  ];

  // Chapter 3 Hindi TOC
  const ch3HindiTocItems = [
    { id: 'mind-map', label: 'अध्याय का माइंड मैप (अवलोकन)' },
    { id: 'section-1', label: '01. दक्षिण एशिया क्या है?' },
    { id: 'section-2', label: '02. लोकतंत्र की राह' },
    { id: 'section-3', label: '03. भारत और पाकिस्तान' },
    { id: 'section-4', label: '04. भारत और उसके अन्य पड़ोसी' },
    { id: 'section-5', label: '05. सार्क और क्षेत्रीय सहयोग' },
    { id: 'quick-recap', label: '06. झटपट दोहराव (परीक्षा से पूर्व)' },
    { id: 'practice-questions-1', label: '07. अभ्यास प्रश्न: 1 अंक' },
    { id: 'practice-questions-2-4', label: '08. अभ्यास प्रश्न: 2 और 4 अंक' },
    { id: 'practice-questions-6', label: '09. अभ्यास प्रश्न: 6 अंक' },
    { id: 'mcqs', label: '10. बहुविकल्पीय प्रश्न (MCQ)' },
    { id: 'assertion-reason', label: '11. अभिकथन और कारण' },
    { id: 'answer-key', label: '12. उत्तर कुंजी (Answer Key)' },
    { id: 'download-notes', label: '13. स्टडी किट एवं पीडीएफ डाउनलोड' },
  ];

  const currentNavItems = isChapter3
    ? (isHindi ? ch3HindiTocItems : ch3EnglishTocItems)
    : isChapter2
      ? (isHindi ? ch2HindiTocItems : ch2EnglishTocItems)
      : (isHindi ? ch1HindiTocItems : ch1EnglishTocItems);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = currentNavItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(currentNavItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(currentNavItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentNavItems]);

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
        ? `कक्षा 12वीं राजनीति विज्ञान अध्याय ${chapterNumber} का आधिकारिक पीडीएफ संस्करण डाउनलोड के लिए तैयार किया जा रहा है।`
        : `Official downloadable PDF for Class 12 Political Science Chapter ${chapterNumber} is being generated.`,
    });
  };

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
              {isHindi ? chapterTitleHi : chapterTitleEn}
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
                  <span>{isHindi ? `अध्याय ${chapterNumber}` : `Chapter ${chapterNumber}`}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F4FAF6] text-[#16A34A] dark:bg-emerald-950/40 dark:text-emerald-300 border border-[#E2F5E8] dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />
                  <span>{isHindi ? 'NCERT पाठ्यक्रम अनुसार' : 'NCERT Syllabus (Complete Notes)'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#062B67] dark:text-white tracking-tight mb-2 font-hindi leading-[1.3]">
                {isHindi ? chapterTitleHi : chapterTitleEn}
              </h1>
              <p className="text-sm sm:text-base text-[#5B6B86] dark:text-slate-300 max-w-3xl leading-relaxed font-hindi">
                {isHindi ? chapterSubtitleHi : chapterSubtitleEn}
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
          </div>
        </div>

        {/* ── 3. MAIN CONTENT LAYOUT (NOTES ON LEFT, TOPIC TOC ON RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── 3A. UNIFIED CHAPTER READING DOCUMENT ── */}
          <main className="lg:col-span-8 xl:col-span-9 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-none divide-y divide-slate-100 dark:divide-slate-800/80 pb-16">
            {isChapter3 ? (
              !isHindi ? (
                <Class12SouthAsiaEnglishNotes
                  onSwitchToHindi={() => setLanguage('hindi')}
                  onDownloadClick={handleDownloadClick}
                />
              ) : (
                <div className="py-12 text-center space-y-4 font-hindi">
                  <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-950 text-[#155EEF]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    अध्याय 3: समकालीन दक्षिण एशिया
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    हिंदी माध्यम नोट्स के स्क्रीनशॉट मिलते ही इसे तुरंत 1:1 सक्रिय किया जाएगा। अभी अंग्रेजी माध्यम में नोट्स पढ़ें।
                  </p>
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className="px-5 py-2.5 rounded-xl bg-[#155EEF] hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    View in English Medium (अंग्रेजी माध्यम में देखें)
                  </button>
                </div>
              )
            ) : isChapter2 ? (
              !isHindi ? (
                <Class12CentresOfPowerEnglishNotes
                  onSwitchToHindi={() => setLanguage('hindi')}
                  onDownloadClick={handleDownloadClick}
                />
              ) : (
                <Class12CentresOfPowerHindiNotes
                  onSwitchToEnglish={() => setLanguage('english')}
                  onDownloadClick={handleDownloadClick}
                />
              )
            ) : (
              !isHindi ? (
                <Class12BipolarityEnglishNotes
                  onSwitchToHindi={() => setLanguage('hindi')}
                  onDownloadClick={handleDownloadClick}
                />
              ) : (
                <Class12BipolarityHindiNotes
                  onSwitchToEnglish={() => setLanguage('english')}
                  onDownloadClick={handleDownloadClick}
                />
              )
            )}

          </main>

          {/* ── 3B. STICKY TABLE OF CONTENTS (RIGHT - 4 OR 3 COLS - MATCHING SCREENSHOT 1) ── */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-none max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#155EEF] dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#062B67] dark:text-slate-200 font-sans">
                    {isHindi ? 'विषय सूची (TOC)' : 'Table of Contents (TOC)'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#155EEF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full font-sans">
                  {currentNavItems.length}
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'विषय खोजें...' : 'Search sections...'}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#155EEF] font-sans"
                />
              </div>

              {/* TOC Nav List */}
              <nav className="space-y-1 text-xs">
                {currentNavItems
                  .filter((item) =>
                    searchQuery.trim()
                      ? item.label.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg font-medium transition-all flex items-center justify-between group cursor-pointer font-sans ${
                          isActive
                            ? 'bg-blue-50/90 text-[#062B67] dark:bg-blue-950/70 dark:text-blue-300 font-semibold border-l-2 border-[#155EEF]'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#062B67] dark:hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate pr-2 font-medium">
                          {item.label}
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

        {/* ── 4. QUICK FLOATING NAVIGATION TRIGGER (BOTTOM-LEFT) ── */}
        <div className={`${!isHindi ? 'fixed' : 'lg:hidden fixed'} bottom-6 left-6 z-40`}>
          <button
            type="button"
            onClick={() => setMobileTocOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#062B67] hover:bg-[#0A3A8A] text-white rounded-full shadow-lg hover:shadow-xl font-semibold text-xs transition-all active:scale-95 border border-blue-400/30 font-sans cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-blue-300" />
            <span>{isHindi ? 'विषय सूची' : 'Quick Navigation'} ({currentNavItems.length})</span>
          </button>
        </div>

        {/* ── 5. QUICK NAVIGATION DRAWER (ACCESSIBLE IN BOTH ENGLISH & HINDI) ── */}
        {mobileTocOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 p-0 sm:p-4">
            <div 
              className="fixed inset-0" 
              onClick={() => setMobileTocOpen(false)} 
              aria-label="Close Drawer Overlay" 
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-5 max-h-[80vh] w-full sm:max-w-md flex flex-col shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#155EEF] dark:text-blue-400" />
                  <span className="text-sm font-bold text-[#062B67] dark:text-slate-200 font-sans">
                    {isHindi ? 'विषय सूची (TOC)' : 'Quick Navigation'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#155EEF] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full font-sans">
                    {currentNavItems.length}
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
                  placeholder={isHindi ? 'विषय खोजें...' : 'Search sections...'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#155EEF] font-sans"
                />
              </div>

              {/* Nav List */}
              <nav className="space-y-1 text-xs overflow-y-auto pr-1 flex-1 font-sans">
                {currentNavItems
                  .filter((item) =>
                    searchQuery.trim()
                      ? item.label.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? 'bg-blue-50 text-[#062B67] dark:bg-blue-950/60 dark:text-blue-300 font-semibold border-l-2 border-[#155EEF]'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate pr-2">{item.label}</span>
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
