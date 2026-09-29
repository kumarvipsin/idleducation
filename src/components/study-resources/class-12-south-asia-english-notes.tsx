'use client';

import React from 'react';
import { Download, Sparkles, Check, HelpCircle } from 'lucide-react';

interface Class12SouthAsiaEnglishNotesProps {
  onSwitchToHindi?: () => void;
  onDownloadClick?: (type: 'free' | 'premium') => void;
}

export function Class12SouthAsiaEnglishNotes({
  onSwitchToHindi,
  onDownloadClick,
}: Class12SouthAsiaEnglishNotesProps) {
  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 font-sans">
      
      {/* ── 1. CHAPTER MIND MAP (how everything connects) ── */}
      <section id="mind-map" className="border-2 border-[#8B5CF6] bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs">
        <h2 className="text-center font-bold text-base sm:text-lg text-[#7C3AED] mb-5 sm:mb-6">
          Chapter Mind Map: how everything connects
        </h2>

        {/* Desktop Mind Map Diagram (md+) */}
        <div className="hidden md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center relative min-h-[250px]">
          
          {/* Left Column (Boxes 1, 2, 3) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 1 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                1 · What is South Asia
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Seven countries, a shared history, and different paths
              </div>
            </div>

            {/* Box 2 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                2 · The path to democracy
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Pakistan, Bangladesh, Nepal and Sri Lanka
              </div>
            </div>

            {/* Box 3 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                3 · Conflict and tension
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Ethnic conflict and border disputes
              </div>
            </div>
          </div>

          {/* Center Connector & Core Node (Cols 5-8) */}
          <div className="col-span-4 h-[230px] flex items-center justify-center relative px-2">
            {/* SVG Connecting Lines between Left, Center, and Right */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 230"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* Left branches to center */}
              <path d="M 0 38 H 40 V 115 H 55" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 0 115 H 55" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 192 H 40 V 115 H 55" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Right branches from center */}
              <path d="M 145 115 H 160 V 38 H 200" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 145 115 H 200" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 145 115 H 160 V 192 H 200" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            {/* Central Node */}
            <div className="bg-[#7C3AED] text-white font-bold text-sm sm:text-base text-center py-4 px-4 sm:px-6 rounded-2xl shadow-md z-10 leading-tight">
              <div>Contemporary</div>
              <div>South Asia</div>
            </div>
          </div>

          {/* Right Column (Boxes 4, 5, 6) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 4 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                4 · India–Pakistan
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Kashmir, wars and attempts at dialogue
              </div>
            </div>

            {/* Box 5 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                5 · India and its neighbours
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Ties with Bangladesh, Nepal and Sri Lanka
              </div>
            </div>

            {/* Box 6 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                6 · SAARC
              </div>
              <div className="text-xs text-slate-700 font-medium leading-snug">
                Regional cooperation and SAFTA
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Mind Map Stack (< md) */}
        <div className="md:hidden space-y-3">
          <div className="bg-[#7C3AED] text-white font-bold text-sm text-center py-2.5 rounded-xl">
            Contemporary South Asia
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-lg p-2.5">
              <span className="font-bold text-[#6D28D9] block">1 · What is South Asia</span>
              <span className="text-slate-700">Seven countries, a shared history, and different paths</span>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-lg p-2.5">
              <span className="font-bold text-[#15803D] block">2 · The path to democracy</span>
              <span className="text-slate-700">Pakistan, Bangladesh, Nepal and Sri Lanka</span>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-lg p-2.5">
              <span className="font-bold text-[#C2410C] block">3 · Conflict and tension</span>
              <span className="text-slate-700">Ethnic conflict and border disputes</span>
            </div>
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-lg p-2.5">
              <span className="font-bold text-[#6D28D9] block">4 · India–Pakistan</span>
              <span className="text-slate-700">Kashmir, wars and attempts at dialogue</span>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-lg p-2.5">
              <span className="font-bold text-[#15803D] block">5 · India and its neighbours</span>
              <span className="text-slate-700">Ties with Bangladesh, Nepal and Sri Lanka</span>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-lg p-2.5">
              <span className="font-bold text-[#C2410C] block">6 · SAARC</span>
              <span className="text-slate-700">Regional cooperation and SAFTA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEYWORD PILLS ── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
        {['South Asia', 'SAARC', 'SAFTA', 'Indus Waters Treaty', 'LTTE', 'Maoists'].map((keyword) => (
          <span
            key={keyword}
            className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#E6F4EA] text-[#065F46] border border-[#A7F3D0] shadow-2xs"
          >
            {keyword}
          </span>
        ))}
      </div>

      {/* ── 3. SECTION 1: WHAT IS SOUTH ASIA? ── */}
      <section id="section-1" className="space-y-4">
        {/* Lavender Heading Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#312E81]">
            What Is South Asia?
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          South Asia is generally understood to comprise <strong className="font-bold text-slate-900">seven countries</strong>: <strong className="font-bold text-slate-900">India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka and the Maldives</strong>. The Himalayas to the north and the Indian Ocean to the south make this region one geographical unit. These countries share a common history, but their political paths diverged after independence.
        </p>

        {/* Countries & Political Experience Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#4F46E5] text-white">
                <th className="py-2.5 px-4 font-bold w-1/3">Country</th>
                <th className="py-2.5 px-4 font-bold">Political Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">India, Sri Lanka</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  A democratic system has continued since independence
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Pakistan, Bangladesh</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  Repeated shifts between democratic and military rule
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Nepal</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  A long struggle from monarchy towards democracy
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Bhutan</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  A monarchy that has gradually moved towards democracy
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Maldives</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed">
                  From a sultanate to a republic, and then multi-party democracy
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. SECTION 2: THE PATH TO DEMOCRACY ── */}
      <section id="section-2" className="space-y-4">
        {/* Lavender Heading Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#312E81]">
            The Path to Democracy
          </h2>
        </div>

        {/* 4 Cards Grid (Pakistan, Bangladesh, Nepal, Sri Lanka) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Card 1: Pakistan */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
                Pakistan
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Military rule returned repeatedly because of the influence of the army, religious organisations and the landowning class, and weak democratic institutions.
            </p>
          </div>

          {/* Card 2: Bangladesh */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
                Bangladesh
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Became an independent nation by separating from Pakistan in <strong className="font-bold text-slate-900">1971</strong>; went through spells of military rule later, before multi-party democracy returned.
            </p>
          </div>

          {/* Card 3: Nepal */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
                Nepal
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Monarchy continued for a long time; a democratic transition took place in <strong className="font-bold text-slate-900">2006</strong> after movements by the people and the Maoists.
            </p>
          </div>

          {/* Card 4: Sri Lanka */}
          <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-900">
                Sri Lanka
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Democracy survived, but the Sinhala–Tamil ethnic conflict turned into a long civil war; the <strong className="font-bold text-slate-900">LTTE was defeated in 2009</strong>.
            </p>
          </div>

        </div>

        {/* EXAM TIP Callout Box */}
        <div className="border border-[#FDE68A] bg-[#FEF3C7]/40 rounded-xl p-4 sm:p-5">
          <div className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider mb-1">
            EXAM TIP
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            For any question on “experiences of democracy in South Asia”, be sure to write that <strong className="font-bold text-slate-900">ordinary people across the region support democracy</strong>, whatever form of government their own country has had: this is the chapter’s main conclusion.
          </p>
        </div>
      </section>

      {/* ── 5. SECTION 3: INDIA AND PAKISTAN ── */}
      <section id="section-3" className="space-y-4">
        {/* Lavender Heading Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shrink-0">
            3
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#312E81]">
            India and Pakistan
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          The dispute over <strong className="font-bold text-slate-900">Kashmir</strong> began right after Partition, and remains the biggest knot in relations between the two countries to this day. The two countries fought wars in <strong className="font-bold text-slate-900">1947–48, 1965 and 1971</strong>, and the <strong className="font-bold text-slate-900">Kargil conflict took place in 1999</strong>.
        </p>

        {/* WORTH NOTING Callout Box */}
        <div className="border border-[#2DD4BF] bg-[#F0FDFA] rounded-xl p-4 sm:p-5 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider">
              WORTH NOTING
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              The <strong className="font-bold text-slate-900">Indus Waters Treaty (1960)</strong> is the region’s most successful example of cooperation: it has held continuously despite wars and tension. When the exam asks for “an example of cooperation”, this is the strongest answer.
            </p>
          </div>
        </div>

        {/* 2 Comparison Boxes: Points of Conflict vs Attempts at Cooperation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Left Box: Points of Conflict */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-[#0284C7]">
              Points of Conflict
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0 mt-1.5" />
                <span>The Kashmir dispute</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0 mt-1.5" />
                <span>Control over the Siachen Glacier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0 mt-1.5" />
                <span>Cross-border terrorism</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0 mt-1.5" />
                <span>Sharing of river waters</span>
              </li>
            </ul>
          </div>

          {/* Right Box: Attempts at Cooperation */}
          <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-[#D97706]">
              Attempts at Cooperation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                <span>The <strong className="font-bold text-slate-900">1960 Indus Waters Treaty</strong>: has held despite tensions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                <span>Confidence-building steps such as bus services and trade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                <span>Summit talks and people-to-people contact</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ── 6. SECTION 4: INDIA AND ITS OTHER NEIGHBOURS ── */}
      <section id="section-4" className="space-y-4">
        {/* Lavender Heading Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shrink-0">
            4
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#312E81]">
            India and Its Other Neighbours
          </h2>
        </div>

        {/* Table: Country | Cooperation | Points of Difference */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#4F46E5] text-white">
                <th className="py-2.5 px-4 font-bold w-1/4">Country</th>
                <th className="py-2.5 px-4 font-bold w-5/12">Cooperation</th>
                <th className="py-2.5 px-4 font-bold w-1/3">Points of Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Bangladesh</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  India’s support in 1971; partnership on disaster management and the environment
                </td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  Sharing of river waters, illegal migration, border disputes
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Nepal</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  An open border, deep social–cultural ties, trade
                </td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  Periodic differences over trade and security
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Sri Lanka</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  The <strong className="font-bold text-slate-900">1987 India–Sri Lanka Accord</strong> and the peacekeeping force; economic cooperation
                </td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  Differences over India’s role on the Tamil question
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-900 align-top">Bhutan, Maldives</td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  Friendly relations with India; cooperation on development and security
                </td>
                <td className="py-3 px-4 text-slate-800 leading-relaxed align-top">
                  No major dispute
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 7. SECTION 5: SAARC AND REGIONAL COOPERATION ── */}
      <section id="section-5" className="space-y-4">
        {/* Lavender Heading Banner */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-2.5 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-[#4F46E5] text-white font-bold text-sm flex items-center justify-center shrink-0">
            5
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#312E81]">
            SAARC and Regional Cooperation
          </h2>
        </div>

        {/* Definition 1: SAARC */}
        <div className="border border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative shadow-2xs">
          <span className="absolute top-3.5 right-4 bg-[#0284C7] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            Remember this
          </span>
          <div className="font-bold text-xs text-[#0284C7] uppercase tracking-wider mb-1">
            DEFINITION 1
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pr-24 font-medium">
            <strong className="font-bold text-slate-900">SAARC</strong>: the South Asian Association for Regional Cooperation, whose charter was signed in <strong className="font-bold text-slate-900">December 1985</strong>. It is a platform for economic, social and cultural cooperation among the countries of the region.
          </p>
        </div>

        {/* Definition 2: SAFTA */}
        <div className="border border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative shadow-2xs">
          <span className="absolute top-3.5 right-4 bg-[#0284C7] text-white text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            Remember this
          </span>
          <div className="font-bold text-xs text-[#0284C7] uppercase tracking-wider mb-1">
            DEFINITION 2
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pr-24 font-medium">
            <strong className="font-bold text-slate-900">SAFTA</strong>: the South Asian Free Trade Area, signed at the 12th SAARC summit in <strong className="font-bold text-slate-900">January 2004</strong>. Its aim is to create a free-trade area within the region by lowering tariffs on trade.
          </p>
        </div>

        {/* SAARC Concluding Note */}
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          SAARC’s success has been limited, because political differences among member states, especially between India and Pakistan, have repeatedly come in the way of cooperation. Even so, it remains an important platform for dialogue.
        </p>
      </section>

      {/* ── 8. QUICK RECAP: READ THIS THE NIGHT BEFORE THE EXAM ── */}
      <section id="quick-recap" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h2 className="font-bold text-sm sm:text-base text-[#047857] mb-3">
          Quick Recap: read this the night before the exam
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>The seven countries of South Asia: India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka, Maldives</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>Democracy continued in India and Sri Lanka; Pakistan and Bangladesh saw spells of military rule</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>Bangladesh became independent in 1971; Nepal’s democratic transition came in 2006</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>Ethnic conflict in Sri Lanka; the LTTE was defeated in 2009</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>India–Pakistan wars in 1947–48, 1965, 1971, and Kargil in 1999</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>The Indus Waters Treaty, 1960: held despite tensions, the best example of cooperation</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>The SAARC charter, December 1985; SAFTA, January 2004</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0 mt-2" />
            <span>Ordinary people across the region support democracy: the chapter’s main conclusion</span>
          </li>
        </ul>
      </section>

      {/* ── 9. PRACTICE QUESTIONS: 1 MARK ── */}
      <section id="practice-questions-1" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h2 className="font-bold text-sm sm:text-base text-[#C2410C] mb-4">
          Practice Questions: 1 Mark
        </h2>
        <div className="space-y-3">
          {[
            'Which seven countries are generally counted as South Asia?',
            'When was the SAARC charter signed?',
            'In which year was SAFTA signed?',
            'In which year did Bangladesh become independent?',
            'In which year was the Indus Waters Treaty signed?',
            'In which year did the democratic transition in Nepal take place?',
            'When was the LTTE defeated in Sri Lanka?',
            'In which year did the Kargil conflict take place?',
          ].map((question, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 last:border-b-0">
              <span className="text-xs sm:text-sm font-medium text-slate-800">
                <strong className="text-[#4F46E5] font-bold">{idx + 1}.</strong> {question}
              </span>
              <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                1 Mark
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. PRACTICE QUESTIONS: 2 AND 4 MARKS ── */}
      <section id="practice-questions-2-4" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h2 className="font-bold text-sm sm:text-base text-[#C2410C] mb-4">
          Practice Questions: 2 and 4 Marks
        </h2>
        <div className="space-y-3">
          {[
            { q: 'Why has the path to democracy been difficult in Pakistan? Give any two reasons.', marks: '2 Marks' },
            { q: 'Why is the Indus Waters Treaty considered a good example of cooperation?', marks: '2 Marks' },
            { q: 'Briefly describe the ethnic conflict in Sri Lanka.', marks: '2 Marks' },
            { q: 'State four issues of conflict between India and Pakistan.', marks: '4 Marks' },
            { q: 'Write the points of cooperation and difference in India’s relations with Bangladesh and Nepal.', marks: '4 Marks' },
            { q: 'Compare the democratic experiences of the countries of South Asia.', marks: '4 Marks' },
            { q: 'Why has SAARC’s success been limited?', marks: '4 Marks' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 last:border-b-0">
              <span className="text-xs sm:text-sm font-medium text-slate-800">
                <strong className="text-[#4F46E5] font-bold">{idx + 1}.</strong> {item.q}
              </span>
              <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                {item.marks}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. PRACTICE QUESTIONS: 6 MARKS ── */}
      <section id="practice-questions-6" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h2 className="font-bold text-sm sm:text-base text-[#C2410C] mb-4">
          Practice Questions: 6 Marks
        </h2>
        <div className="space-y-3">
          {[
            'Describe in detail the experience of democracy in South Asia.',
            'Explain both the conflict and cooperation aspects of India–Pakistan relations.',
            'Throw light on the aims and achievements of SAARC and SAFTA.',
          ].map((question, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-100 last:border-b-0">
              <span className="text-xs sm:text-sm font-medium text-slate-800">
                <strong className="text-[#4F46E5] font-bold">{idx + 1}.</strong> {question}
              </span>
              <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                6 Marks
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. MULTIPLE CHOICE QUESTIONS (MCQs) ── */}
      <section id="mcqs" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
        <h2 className="font-bold text-sm sm:text-base text-[#C2410C]">
          Multiple Choice Questions
        </h2>

        {/* MCQ 1 */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              <strong className="text-[#4F46E5] font-bold">1.</strong> The SAARC charter was signed in:
            </span>
            <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-700 pl-4">
            <span>(a) 1971</span>
            <span>(b) 1985</span>
            <span>(c) 1999</span>
            <span>(d) 2004</span>
          </div>
        </div>

        {/* MCQ 2 */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              <strong className="text-[#4F46E5] font-bold">2.</strong> SAFTA was signed at which SAARC summit?
            </span>
            <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-700 pl-4">
            <span>(a) 10th</span>
            <span>(b) 11th</span>
            <span>(c) 12th</span>
            <span>(d) 14th</span>
          </div>
        </div>

        {/* MCQ 3 */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              <strong className="text-[#4F46E5] font-bold">3.</strong> In which year was the Indus Waters Treaty signed?
            </span>
            <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-700 pl-4">
            <span>(a) 1947</span>
            <span>(b) 1960</span>
            <span>(c) 1971</span>
            <span>(d) 1985</span>
          </div>
        </div>

        {/* MCQ 4 */}
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              <strong className="text-[#4F46E5] font-bold">4.</strong> Bangladesh became independent in:
            </span>
            <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-700 pl-4">
            <span>(a) 1965</span>
            <span>(b) 1971</span>
            <span>(c) 1975</span>
            <span>(d) 1987</span>
          </div>
        </div>

        {/* MCQ 5 */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs sm:text-sm font-medium text-slate-800">
              <strong className="text-[#4F46E5] font-bold">5.</strong> The LTTE was defeated in Sri Lanka in:
            </span>
            <span className="shrink-0 bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-slate-700 pl-4">
            <span>(a) 1987</span>
            <span>(b) 1999</span>
            <span>(c) 2006</span>
            <span>(d) 2009</span>
          </div>
        </div>
      </section>

      {/* ── 13. ASSERTION AND REASON ── */}
      <section id="assertion-reason" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-[#C2410C]">
            Assertion and Reason
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-medium">
            Options: <strong className="font-semibold text-slate-800">(a)</strong> Both true, R correctly explains A · <strong className="font-semibold text-slate-800">(b)</strong> Both true, R does not explain A · <strong className="font-semibold text-slate-800">(c)</strong> A true, R false · <strong className="font-semibold text-slate-800">(d)</strong> A false, R true.
          </p>
        </div>

        {/* Question 1 */}
        <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-4 relative space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#4F46E5] text-xs sm:text-sm">1.</span>
            <span className="bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 font-medium pl-3">
            <div>
              <strong className="text-[#0284C7] font-bold">Assertion (A):</strong> The Indus Waters Treaty is an example of India–Pakistan cooperation.
            </div>
            <div>
              <strong className="text-[#0284C7] font-bold">Reason (R):</strong> The treaty has held despite wars and tension.
            </div>
          </div>
        </div>

        {/* Question 2 */}
        <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-4 relative space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[#4F46E5] text-xs sm:text-sm">2.</span>
            <span className="bg-[#F97316] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
              1 Mark
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 space-y-1 font-medium pl-3">
            <div>
              <strong className="text-[#0284C7] font-bold">Assertion (A):</strong> Democracy has looked the same in every South Asian country.
            </div>
            <div>
              <strong className="text-[#0284C7] font-bold">Reason (R):</strong> Pakistan and Bangladesh went through spells of military rule.
            </div>
          </div>
        </div>
      </section>

      {/* ── 14. ANSWER KEY ── */}
      <section id="answer-key" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h2 className="font-bold text-xs sm:text-sm text-[#047857] mb-1.5">
          Answer Key
        </h2>
        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
          <strong className="text-[#047857] font-bold">MCQ 1–5:</strong> (b) (c) (b) (b) (d) · <strong className="text-[#047857] font-bold">Assertion–Reason:</strong> 1(a) · 2(d): Assertion false, experiences have differed
        </div>
      </section>

      {/* ── 15. STUDY KIT & PDF DOWNLOADS (CONSISTENT SECTION) ── */}
      <section id="download-notes" className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-[#155EEF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#155EEF]">
              Study Kit & PDF Downloads
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#062B67] dark:text-white tracking-tight">
            Download Chapter 3 Notes PDF
          </h2>
          <p className="text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 mt-1">
            Choose free revision summary or unlock complete high-scoring study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* Card 1: Free Revision Notes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between transition-all">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3">
                Free Revision Kit
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white">
                Basic Revision Notes
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium">
                Essential points, quick recap bullets, and mind map for rapid exam revision.
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Key Concepts (South Asia, Democracy, SAARC, SAFTA)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Important Treaties & Dates (Indus Waters Treaty, 1985 SAARC)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Exam Night Quick Recap Summary</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-free-pdf-btn-ch3"
                onClick={() => onDownloadClick?.('free')}
                className="w-full h-11 rounded-xl border border-[#155EEF] text-[#155EEF] hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>Download Free PDF Notes &rarr;</span>
              </button>
              <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
                100% Free • Direct Download
              </p>
            </div>
          </div>

          {/* Card 2: Premium Full Notes (RECOMMENDED) */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#155EEF] rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between relative mt-2 md:mt-0 transition-all">
            <div className="absolute -top-3.5 right-6 bg-[#155EEF] text-white text-[10.5px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              RECOMMENDED
            </div>

            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-semibold text-xs mb-3">
                Complete Exam Kit
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white">
                Premium Full Notes
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium">
                Comprehensive chapter guide with detailed Q&A for scoring maximum marks.
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>In-depth explanations (Democracy, Conflicts & Relations)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Comprehensive Comparison Tables & Flow Diagrams</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>High-yield Mind Map & Summary Charts</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Model Exam Questions (1, 2, 4, 6 Marks + MCQs + Assertion)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Complete NCERT Syllabus Coverage & Topper Answers</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-premium-pdf-btn-ch3"
                onClick={() => onDownloadClick?.('premium')}
                className="w-full h-11 rounded-xl bg-[#155EEF] hover:bg-[#0052CC] text-white font-semibold text-xs sm:text-sm shadow-none transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Full Study Kit &rarr;</span>
              </button>
              <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium">
                Instant access to complete printable edition
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 16. BOTTOM SWITCHER ── */}
      <section className="border border-slate-200 rounded-2xl bg-white p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3 shadow-2xs">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
          READ THIS CHAPTER IN:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4F46E5] text-white shadow-2xs cursor-default font-sans"
          >
            English Medium
          </button>
          <button
            type="button"
            onClick={onSwitchToHindi}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer font-hindi"
          >
            हिंदी माध्यम
          </button>
        </div>
      </section>

    </div>
  );
}
