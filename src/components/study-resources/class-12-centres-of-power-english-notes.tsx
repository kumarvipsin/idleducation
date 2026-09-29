'use client';

import React from 'react';
import { Download, Sparkles, Check, ArrowDown } from 'lucide-react';

interface Class12CentresOfPowerEnglishNotesProps {
  onSwitchToHindi?: () => void;
  onDownloadClick?: (type: 'free' | 'premium') => void;
}

export function Class12CentresOfPowerEnglishNotes({
  onSwitchToHindi,
  onDownloadClick,
}: Class12CentresOfPowerEnglishNotesProps) {
  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 font-sans">
      
      {/* ── 1. CHAPTER MIND MAP (ORIGINAL COLORS) ── */}
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
                1 · Why alternative centres
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                New powers rise after bipolarity ends
              </div>
            </div>

            {/* Box 2 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                2 · The European Union
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                An economic and political union built out of the ashes of war
              </div>
            </div>

            {/* Box 3 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                3 · ASEAN
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                The “ASEAN Way” and a community with three pillars
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
              <div>Centres of</div>
              <div>Power</div>
            </div>
          </div>

          {/* Right Column (Boxes 4, 5, 6) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 4 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                4 · The rise of China
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                The Open Door Policy and becoming an economic superpower
              </div>
            </div>

            {/* Box 5 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                5 · China’s challenges
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                Unemployment, environment and inequality
              </div>
            </div>

            {/* Box 6 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                6 · India–China relations
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                From conflict to trade
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Mind Map Layout (<md) */}
        <div className="md:hidden space-y-3">
          <div className="bg-[#7C3AED] text-white font-bold text-sm text-center py-3 px-4 rounded-xl shadow-xs mb-3">
            Contemporary Centres of Power
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">1 · Why alternative centres</div>
              <div className="text-[11px] text-slate-700 font-semibold">New powers rise after bipolarity ends</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">2 · The European Union</div>
              <div className="text-[11px] text-slate-700 font-semibold">An economic and political union built out of the ashes of war</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">3 · ASEAN</div>
              <div className="text-[11px] text-slate-700 font-semibold">The “ASEAN Way” and a community with three pillars</div>
            </div>
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">4 · The rise of China</div>
              <div className="text-[11px] text-slate-700 font-semibold">The Open Door Policy and becoming an economic superpower</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">5 · China’s challenges</div>
              <div className="text-[11px] text-slate-700 font-semibold">Unemployment, environment and inequality</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">6 · India–China relations</div>
              <div className="text-[11px] text-slate-700 font-semibold">From conflict to trade</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEYWORD PILLS ROW (ORIGINAL MINT-GREEN) ── */}
      <section className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {[
          'Maastricht Treaty',
          'Euro',
          'ASEAN Way',
          'ARF',
          'Open Door Policy',
          'Special Economic Zones',
        ].map((pill) => (
          <span
            key={pill}
            className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] shadow-2xs"
          >
            {pill}
          </span>
        ))}
      </section>

      {/* ── 3. SECTION 1: WHY DID ALTERNATIVE CENTRES OF POWER EMERGE? ── */}
      <section id="section-1" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            1
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            Why Did Alternative Centres of Power Emerge?
          </h3>
        </div>

        {/* Paragraph (IDL Blog Typography) */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          After the end of the bipolar world, the question arose: what could be an alternative to American dominance? One answer was <strong className="font-black text-slate-950">regional organisations</strong>. In Europe the <strong className="font-black text-slate-950">European Union</strong> and in Asia <strong className="font-black text-slate-950">ASEAN</strong> emerged as such alternatives, while <strong className="font-black text-slate-950">China</strong> carved out this position through the strength of its economy.
        </p>
      </section>

      {/* ── 4. SECTION 2: THE EUROPEAN UNION ── */}
      <section id="section-2" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            2
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            The European Union
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          Europe lay devastated after the Second World War. The US gave assistance under the <strong className="font-black text-slate-950">Marshall Plan</strong>, and the <strong className="font-black text-slate-950">Council of Europe</strong> was set up in 1949. Economic cooperation grew gradually, and this process sped up after the collapse of the Soviet bloc.
        </p>

        {/* DEFINITION 1 (Sky Blue Box) */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs">
            Remember this
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5">
            DEFINITION 1
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24">
            The <strong className="font-black text-slate-950">European Union</strong> was established by the <strong className="font-black text-slate-950">Maastricht Treaty of 7 February 1992</strong>. It extended economic cooperation to a common foreign and security policy and common citizenship.
          </p>
        </div>

        {/* Nation-state resemblance paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          The Union has its own <strong className="font-black text-slate-950">flag, anthem, founding day, and a common currency: the euro</strong>. In this sense it is not merely an economic organisation but has come to resemble a <strong className="font-black text-slate-950">nation-state</strong>.
        </p>

        {/* Table (Area of Influence vs Strength) */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[28%] border-r border-[#6366F1]/40">Area of Influence</th>
                <th className="px-4 py-3">Strength of the European Union</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Economic</td>
                <td className="px-4 py-3">
                  Among the largest economies in the world; its currency, the euro, challenges the dollar; a large share of world trade
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Political–diplomatic</td>
                <td className="px-4 py-3">
                  France is a permanent member of the Security Council; several members are non-permanent members, giving it capacity to shape American policies
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Military</td>
                <td className="px-4 py-3">
                  The second-largest defence spender after the US; France and Britain hold nuclear weapons
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout Box: REMEMBER ITS LIMITS TOO (Rose/Pink border & bg) */}
        <div className="border-2 border-[#FECDD3] bg-[#FFF1F2] rounded-2xl p-4 sm:p-5 mt-4">
          <div className="text-[#E11D48] font-bold text-xs uppercase tracking-wider mb-1.5">
            REMEMBER ITS LIMITS TOO
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8]">
            The European Union has its own weaknesses. Member states are not willing to give up their <strong className="font-black text-slate-950">sovereignty</strong>; some have not adopted the euro; and the <strong className="font-black text-slate-950">attempt in 2003 to create a common constitution failed</strong>. So members often take different positions on foreign and defence policy.
          </p>
        </div>
      </section>

      {/* ── 5. SECTION 3: ASEAN ── */}
      <section id="section-3" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            3
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            ASEAN
          </h3>
        </div>

        {/* DEFINITION 2 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs">
            Remember this
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5">
            DEFINITION 2
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24">
            <strong className="font-black text-slate-950">ASEAN</strong> was established in <strong className="font-black text-slate-950">1967 by the Bangkok Declaration</strong>, by five countries: Indonesia, Malaysia, the Philippines, Singapore and Thailand. Its aims were economic growth, social progress, cultural development, and peace in the region.
          </p>
        </div>

        {/* ASEAN Way Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          ASEAN’s way of working is called the <strong className="font-black text-slate-950">“ASEAN Way”</strong>: informal, non-confrontational, and based on cooperative dialogue.
        </p>

        {/* 3 Community Cards (with purple circular badges 1, 2, 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              1
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              ASEAN Security Community
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              Ensures regional disputes do not escalate to armed conflict: emphasis on peaceful resolution.
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              2
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              ASEAN Economic Community
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              A common market and production base; easier movement of investment, labour and capital.
            </div>
          </div>

          {/* Card 3 (spans full width on md+) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs md:col-span-2">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              3
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              ASEAN Socio-Cultural Community
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              Building cooperation and a shared identity among the region’s people.
            </div>
          </div>
        </div>

        {/* ARF Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          The <strong className="font-black text-slate-950">ASEAN Regional Forum (ARF)</strong> was set up in <strong className="font-black text-slate-950">1994</strong> as a platform for dialogue on security and foreign-policy issues. ASEAN’s real strength lies in <strong className="font-black text-slate-950">dialogue and cooperation</strong>, not military power. India too has signed free-trade agreements with ASEAN countries such as Singapore and Thailand.
        </p>
      </section>

      {/* ── 6. SECTION 4: CHINA'S ECONOMIC RISE ── */}
      <section id="section-4" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            4
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            China’s Economic Rise
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          China opened up its economy gradually and deliberately, not in one sudden move, unlike what Russia did after the Soviet collapse.
        </p>

        {/* Vertical Step Flow (5 Flow Nodes with down arrows ↓) */}
        <div className="space-y-2.5 max-w-2xl mx-auto my-6">
          {/* Step 1 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5">
              1972
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              Normalised relations with the US, ending political isolation
            </div>
          </div>

          <div className="flex justify-center text-[#6366F1]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 2 */}
          <div className="border border-[#34D399] bg-[#ECFDF5] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#059669] mb-0.5">
              1973
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              Zhou Enlai proposed the <strong className="font-black text-slate-950">Four Modernisations</strong>: agriculture, industry, science &amp; technology, and the military
            </div>
          </div>

          <div className="flex justify-center text-[#10B981]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 3 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5">
              1978
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              Deng Xiaoping announced the <strong className="font-black text-slate-950">“Open Door” policy</strong>
            </div>
          </div>

          <div className="flex justify-center text-[#6366F1]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 4 */}
          <div className="border border-[#34D399] bg-[#ECFDF5] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#059669] mb-0.5">
              Gradual privatisation
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              Agriculture first, then industry: this raised rural income and savings
            </div>
          </div>

          <div className="flex justify-center text-[#10B981]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 5 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5">
              2001
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              Membership of the World Trade Organisation (WTO)
            </div>
          </div>
        </div>

        {/* SEZs Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          <strong className="font-black text-slate-950">Special Economic Zones (SEZs)</strong> were created to bring in foreign capital and technology, offering special concessions to foreign investors. This is why China became the fastest-growing economy in the world.
        </p>

        {/* Callout Box: COMMON MISTAKE (Rose/Pink border & bg) */}
        <div className="border-2 border-[#FECDD3] bg-[#FFF1F2] rounded-2xl p-4 sm:p-5 mt-4">
          <div className="text-[#E11D48] font-bold text-xs uppercase tracking-wider mb-1.5">
            COMMON MISTAKE
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8]">
            Do not write that China adopted “shock therapy”. China opened its markets in a <strong className="font-black text-slate-950">gradual and controlled</strong> manner and kept political control firmly with the Communist Party: the exact opposite of Russia’s sudden leap.
          </p>
        </div>

        {/* Costs Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] mt-2">
          But this rise has also come at a cost: <strong className="font-black text-slate-950">unemployment</strong>, growing <strong className="font-black text-slate-950">inequality</strong> between rural–urban and coastal–inland regions, <strong className="font-black text-slate-950">environmental damage</strong>, and <strong className="font-black text-slate-950">corruption</strong>.
        </p>
      </section>

      {/* ── 7. SECTION 5: INDIA–CHINA RELATIONS ── */}
      <section id="section-5" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            5
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            India–China Relations
          </h3>
        </div>

        {/* Table: Period vs What Happened */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">Period</th>
                <th className="px-4 py-3">What Happened</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">1962</td>
                <td className="px-4 py-3">
                  War over the border dispute: created lasting distrust in relations
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">After 1976</td>
                <td className="px-4 py-3">
                  Diplomatic relations restored; dialogue begins
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Since 1988</td>
                <td className="px-4 py-3">
                  High-level visits improve relations; the border dispute is set aside to allow cooperation in other areas
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Today</td>
                <td className="px-4 py-3">
                  Trade has grown rapidly; but the border dispute and trade imbalance remain major challenges
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 8. QUICK RECAP CONTAINER (ORIGINAL EMERALD GREEN) ── */}
      <section id="quick-recap" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-3.5">
          Quick Recap: read this the night before the exam
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-semibold">
          {[
            'The European Union was established by the Maastricht Treaty of 7 February 1992; common currency is the euro',
            'The EU’s influence is threefold: economic, political-diplomatic and military',
            'Its limits: member states are unwilling to give up sovereignty; the 2003 common constitution failed',
            'ASEAN was formed in 1967 by the Bangkok Declaration; five founding countries',
            'The three pillars of the ASEAN Community: security, economic and socio-cultural',
            'The ARF was set up in 1994; ASEAN’s strength is dialogue, not military power',
            'China: 1978 Open Door Policy, gradual privatisation, SEZs, WTO in 2001',
            'China’s path was gradual, not a sudden leap like Russia’s shock therapy',
          ].map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 9. PRACTICE QUESTIONS: 1 MARK (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-1" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 1 Mark
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'When was the Maastricht Treaty signed?' },
            { q: 'What is the European Union’s common currency?' },
            { q: 'When was ASEAN established, and by which declaration?' },
            { q: 'Who were the five founding members of ASEAN?' },
            { q: 'In which year was the ARF established?' },
            { q: 'Who announced the “Open Door” policy, and when?' },
            { q: 'When did China become a member of the WTO?' },
            { q: 'What are Special Economic Zones (SEZs)?' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                1 Mark
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. PRACTICE QUESTIONS: 2 AND 4 MARKS (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-2-4" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 2 and 4 Marks
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'What is meant by the “ASEAN Way”?', marks: '2 Marks' },
            { q: 'What were the Four Modernisations?', marks: '2 Marks' },
            { q: 'Why is the European Union described as resembling a “nation-state”?', marks: '2 Marks' },
            { q: 'Describe the economic, political and military influence of the European Union.', marks: '4 Marks' },
            { q: 'Explain the three pillars of the ASEAN Community.', marks: '4 Marks' },
            { q: 'Give reasons for China’s economic success.', marks: '4 Marks' },
            { q: 'Write four problems arising from China’s economic rise.', marks: '4 Marks' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                {item.marks}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. PRACTICE QUESTIONS: 6 MARKS (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-6" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 6 Marks
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'How did the European Union become an influential regional organisation? Also mention its limitations.', marks: '6 Marks' },
            { q: 'In what sequence did China open up its economy? Compare it with Russia’s shock therapy.', marks: '6 Marks' },
            { q: 'Describe the development of India–China relations.', marks: '6 Marks' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                {item.marks}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. MULTIPLE CHOICE QUESTIONS (ORIGINAL ORANGE) ── */}
      <section id="mcqs" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Multiple Choice Questions
        </h3>
        <div className="space-y-4 font-semibold">
          {[
            {
              q: 'Which treaty established the European Union?',
              options: ['(a) Treaty of Rome', '(b) Maastricht Treaty', '(c) Warsaw Pact', '(d) Treaty of Paris'],
            },
            {
              q: 'In which year was ASEAN established?',
              options: ['(a) 1957', '(b) 1967', '(c) 1978', '(d) 1992'],
            },
            {
              q: 'The “Open Door” policy is associated with:',
              options: ['(a) Zhou Enlai', '(b) Mao', '(c) Deng Xiaoping', '(d) Gorbachev'],
            },
            {
              q: 'The ARF is associated with:',
              options: ['(a) European Union', '(b) ASEAN', '(c) SAARC', '(d) NATO'],
            },
            {
              q: 'China joined the WTO in:',
              options: ['(a) 1991', '(b) 1995', '(c) 2001', '(d) 2005'],
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="text-slate-900 leading-snug">
                  <span className="font-bold text-[#4F46E5] mr-1.5">{idx + 1}.</span>
                  <span>{item.q}</span>
                </div>
                <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
                  1 Mark
                </span>
              </div>
              <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-xs sm:text-[13px] text-slate-600 pl-4 font-medium">
                {item.options.map((opt, oIdx) => (
                  <span key={oIdx}>{opt}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 13. ASSERTION AND REASON (ORIGINAL ORANGE / SKY BLUE) ── */}
      <section id="assertion-reason" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-1.5">
          Assertion and Reason
        </h3>
        <p className="text-xs text-slate-700 font-semibold mb-4 leading-relaxed">
          Options: <strong className="font-semibold text-slate-800">(a)</strong> Both true, R correctly explains A · <strong className="font-semibold text-slate-800">(b)</strong> Both true, R does not explain A · <strong className="font-semibold text-slate-800">(c)</strong> A true, R false · <strong className="font-semibold text-slate-800">(d)</strong> A false, R true.
        </p>

        <div className="space-y-3 font-semibold">
          {/* Item 1 */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-3.5 sm:p-4 flex items-start justify-between gap-3">
            <div className="text-xs sm:text-[13.5px] space-y-1.5 text-slate-900">
              <div className="leading-snug">
                <span className="font-bold text-[#4F46E5] mr-2">1.</span>
                <strong className="font-bold text-[#0284C7]">Assertion (A):</strong> ASEAN’s strength lies in its military power.
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">Reason (R):</strong> ASEAN functions on the “ASEAN Way” of dialogue and cooperation.
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
              1 Mark
            </span>
          </div>

          {/* Item 2 */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-3.5 sm:p-4 flex items-start justify-between gap-3">
            <div className="text-xs sm:text-[13.5px] space-y-1.5 text-slate-900">
              <div className="leading-snug">
                <span className="font-bold text-[#4F46E5] mr-2">2.</span>
                <strong className="font-bold text-[#0284C7]">Assertion (A):</strong> The European Union’s foreign policy is not always unanimous.
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">Reason (R):</strong> Member states are unwilling to give up their sovereignty.
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
              1 Mark
            </span>
          </div>
        </div>
      </section>

      {/* ── 14. ANSWER KEY (ORIGINAL EMERALD GREEN) ── */}
      <section id="answer-key" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-2">
          Answer Key
        </h3>
        <div className="text-xs sm:text-[13.5px] text-slate-900 font-semibold leading-relaxed flex items-center flex-wrap gap-x-2 gap-y-1">
          <span className="font-bold text-emerald-800">MCQ 1–5</span>
          <span>(b) (b) (c) (b) (c)</span>
          <span className="text-emerald-500 font-bold">·</span>
          <span className="font-bold text-emerald-800">Assertion–Reason</span>
          <span>1(d): Assertion false, strength is dialogue · 2(a)</span>
        </div>
      </section>

      {/* ── 15. STUDY KIT & PDF DOWNLOADS (MATCHING CHAPTER 1) ── */}
      <section id="download-notes" className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
        {/* Eyebrow & Title */}
        <div className="text-center max-w-xl mx-auto">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
            8. STUDY KIT &amp; PDF DOWNLOADS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B67] dark:text-white tracking-tight">
            Download Notes
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400">
            Choose the most suitable notes format for your exam preparation.
          </p>
        </div>

        {/* 2 Comparison Cards (Clean, Flat, Minimal) */}
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
              
              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium">
                Concise and high-yield notes for rapid revision before exams.
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Essential concepts (European Union, ASEAN, China)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Key treaties &amp; dates (Maastricht Treaty, Bangkok Declaration)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Quick exam revision points</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-free-pdf-btn-ch2"
                onClick={() => onDownloadClick?.('free')}
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

              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium">
                Comprehensive chapter study material for top scores in board exams.
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Detailed explanations for EU, ASEAN, China &amp; India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Important timeline flowcharts &amp; tables</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Diagrams &amp; Mindmaps (Chapter Overview)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Exam-focused questions (1, 2, 4, 6 Marks + MCQs)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Complete NCERT syllabus coverage</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-premium-pdf-btn-ch2"
                onClick={() => onDownloadClick?.('premium')}
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

      {/* ── 16. BOTTOM SWITCHER ── */}
      <section className="border border-slate-200 rounded-2xl bg-white p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3 shadow-2xs">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
          READ THIS CHAPTER IN:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4F46E5] text-white shadow-2xs cursor-default"
          >
            English Medium
          </button>
          <button
            type="button"
            onClick={onSwitchToHindi}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            हिंदी माध्यम
          </button>
        </div>
      </section>

    </div>
  );
}
