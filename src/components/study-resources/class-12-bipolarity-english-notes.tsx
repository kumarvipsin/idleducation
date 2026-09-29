'use client';

import React from 'react';
import { Download, Sparkles, Check } from 'lucide-react';

interface Class12BipolarityEnglishNotesProps {
  onSwitchToHindi?: () => void;
  onDownloadClick?: (type: 'free' | 'premium') => void;
}

export function Class12BipolarityEnglishNotes({
  onSwitchToHindi,
  onDownloadClick,
}: Class12BipolarityEnglishNotesProps) {
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
                1 · The Soviet system
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                Socialism, one-party rule, and a planned economy
              </div>
            </div>

            {/* Box 2 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                2 · Weaknesses
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                Stagnant economy, arms race, Afghanistan
              </div>
            </div>

            {/* Box 3 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                3 · Gorbachev&apos;s reforms
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                Perestroika and Glasnost
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
              <div>The End of</div>
              <div>Bipolarity</div>
            </div>
          </div>

          {/* Right Column (Boxes 4, 5, 6) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 4 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                4 · Disintegration
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                The 1991 coup, Yeltsin and the CIS
              </div>
            </div>

            {/* Box 5 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                5 · Shock therapy
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                A sudden leap to capitalism, and its cost
              </div>
            </div>

            {/* Box 6 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                6 · India–Russia ties
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                Strategic partnership and its benefits
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Mind Map Layout (<md) */}
        <div className="md:hidden space-y-3">
          <div className="bg-[#7C3AED] text-white font-bold text-sm text-center py-3 px-4 rounded-xl shadow-xs mb-3">
            The End of Bipolarity
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">1 · The Soviet system</div>
              <div className="text-[11px] text-slate-700 font-semibold">Socialism, one-party rule, and a planned economy</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">2 · Weaknesses</div>
              <div className="text-[11px] text-slate-700 font-semibold">Stagnant economy, arms race, Afghanistan</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">3 · Gorbachev&apos;s reforms</div>
              <div className="text-[11px] text-slate-700 font-semibold">Perestroika and Glasnost</div>
            </div>
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">4 · Disintegration</div>
              <div className="text-[11px] text-slate-700 font-semibold">The 1991 coup, Yeltsin and the CIS</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">5 · Shock therapy</div>
              <div className="text-[11px] text-slate-700 font-semibold">A sudden leap to capitalism, and its cost</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">6 · India–Russia ties</div>
              <div className="text-[11px] text-slate-700 font-semibold">Strategic partnership and its benefits</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEYWORD PILLS ROW (ORIGINAL MINT-GREEN) ── */}
      <section className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {[
          'Berlin Wall',
          'Warsaw Pact',
          'Perestroika',
          'Glasnost',
          'Shock Therapy',
          'CIS',
          'Bipolarity',
        ].map((pill) => (
          <span
            key={pill}
            className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] shadow-2xs"
          >
            {pill}
          </span>
        ))}
      </section>

      {/* ── 3. SECTION 1: WHAT WAS THE SOVIET SYSTEM? (ORIGINAL LAVENDER BANNER & TABLE) ── */}
      <section id="section-1" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            1
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            What Was the Soviet System?
          </h3>
        </div>

        {/* Paragraph (IDL Blog Typography) */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          The <strong className="font-black text-slate-950">Berlin Wall</strong> was the biggest symbol of the divide between the capitalist and communist worlds: built in 1961, more than 150 kilometres long, standing for 28 years, and pulled down by the people on <strong className="font-black text-slate-950">9 November 1989</strong>.
        </p>

        {/* DEFINITION 1 (Original Sky Blue Box) */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs">
            Remember this
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5">
            DEFINITION 1
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24">
            The <strong className="font-black text-slate-950">Union of Soviet Socialist Republics (USSR)</strong> was formed after the socialist revolution of 1917. It was an attempt to build a society based on equality, as opposed to capitalism, in which the institution of private property was abolished and the state owned the means of production.
          </p>
        </div>

        {/* Table (Original Purple Header) */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">Aspect</th>
                <th className="px-4 py-3">Feature of the Soviet System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Politics</td>
                <td className="px-4 py-3">One-party rule: the Communist Party of the Soviet Union; no opposition</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Economy</td>
                <td className="px-4 py-3">Planned and controlled by the state; state ownership</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Bloc</td>
                <td className="px-4 py-3">
                  The “Second World” or socialist camp, bound by the <strong className="font-black text-slate-950">Warsaw Pact</strong>; led by the USSR
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Strength</td>
                <td className="px-4 py-3">
                  The second most developed economy after the US; oil, iron, steel; a minimum standard of living for all; subsidised health, education and childcare
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. SECTION 2: WEAKNESSES OF THE SOVIET SYSTEM ── */}
      <section id="section-2" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            2
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            Weaknesses of the Soviet System
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          The very same system grew weak from within. It became <strong className="font-black text-slate-950">bureaucratic and authoritarian</strong>; there was no democracy or freedom of speech; the party was not accountable to the people; and the desire of the <strong className="font-black text-slate-950">fifteen republics</strong> to run their own cultural and political affairs was constantly overlooked: on paper Russia was one republic among fifteen, but in practice it dominated the rest.
        </p>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              1
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              The Arms Race
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              Matched the US, but at a very heavy economic cost.
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              2
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              Technological Lag
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              Fell behind the West in technology, transport and energy infrastructure.
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              3
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              Afghanistan, 1979
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              The invasion weakened the system further.
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2">
              4
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              Shortage of Consumer Goods
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              Wages kept rising but productivity did not; the economy stagnated by the late 1970s.
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION 3: GORBACHEV'S REFORMS ── */}
      <section id="section-3" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            3
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            Gorbachev’s Reforms
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          <strong className="font-black text-slate-950">Mikhail Gorbachev</strong> became General Secretary of the Communist Party in 1985 and wanted to reform the system, so that the Soviet Union could keep pace with the information and technology revolution taking place in the West.
        </p>

        {/* DEFINITION 2 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs">
            Remember this
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5">
            DEFINITION 2
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24">
            <strong className="font-black text-slate-950">Perestroika</strong> means <strong className="font-black text-slate-950">restructuring</strong>: reforming the economy. <strong className="font-black text-slate-950">Glasnost</strong> means <strong className="font-black text-slate-950">openness</strong>: political openness and freedom of expression.
          </p>
        </div>

        {/* Unintended effect paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          But these reforms had an unintended effect. People in Eastern Europe rose up against their own governments and against Soviet control, and this time the <strong className="font-black text-slate-950">Soviet Union did not intervene</strong>: communist governments fell one after another.
        </p>
      </section>

      {/* ── 6. SECTION 4: HOW THE DISINTEGRATION HAPPENED ── */}
      <section id="section-4" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            4
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            How the Disintegration Happened
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          In <strong className="font-black text-slate-950">August 1991</strong>, hardliners within the party attempted a coup, but the people had already tasted freedom. <strong className="font-black text-slate-950">Boris Yeltsin</strong> opposed the coup and emerged as a national hero. In <strong className="font-black text-slate-950">December 1991</strong>, <strong className="font-black text-slate-950">Russia, Ukraine and Belarus</strong> scrapped the 1922 Treaty of Union and declared the Soviet Union dissolved.
        </p>

        {/* Timeline (Original Purple & Cyan Colors) */}
        <div className="space-y-2.5">
          {[
            {
              date: 'March 1985',
              text: 'Gorbachev becomes General Secretary of the Communist Party; reforms begin',
              isPurple: true,
            },
            {
              date: 'June 1988',
              text: 'Independence movement in Lithuania; later spreads to Estonia and Latvia',
              isPurple: false,
            },
            {
              date: 'October 1989',
              text: 'Warsaw Pact countries declared free to determine their own future; the Berlin Wall falls in November',
              isPurple: true,
            },
            {
              date: 'February 1990',
              text: 'The Communist Party’s 72-year monopoly on power ends; multi-party politics allowed',
              isPurple: false,
            },
            {
              date: 'March 1990',
              text: 'Lithuania: the first republic to declare independence',
              isPurple: true,
            },
            {
              date: 'June 1991',
              text: 'Yeltsin elected President of Russia',
              isPurple: false,
            },
            {
              date: 'August 1991',
              text: 'The hardliners’ coup fails',
              isPurple: true,
            },
            {
              date: 'December 1991',
              text: 'Russia, Belarus and Ukraine form the CIS; Russia gets the USSR’s seat at the UN',
              isPurple: false,
            },
            {
              date: '25 December 1991',
              text: 'Gorbachev resigns: the end of the Soviet Union',
              isPurple: true,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-xl p-3 sm:p-3.5 bg-white flex items-start gap-3 shadow-2xs"
            >
              {/* Vertical pill line with dot */}
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isPurple ? 'bg-[#7C3AED]' : 'bg-[#0284C7]'
                  }`}
                />
                <span
                  className={`w-0.5 h-6 mt-1 rounded-full ${
                    item.isPurple ? 'bg-[#C084FC]' : 'bg-[#7DD3FC]'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={`font-bold text-xs sm:text-sm mb-0.5 ${
                    item.isPurple ? 'text-[#7C3AED]' : 'text-[#0284C7]'
                  }`}
                >
                  {item.date}
                </div>
                <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXAM TIP (Original Warm Amber) */}
        <div className="border-2 border-[#FDE68A] bg-[#FFFBEB] rounded-2xl p-4 sm:p-5 mt-4">
          <div className="text-[#D97706] font-bold text-xs uppercase tracking-wider mb-1.5">
            EXAM TIP
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8]">
            “Three reasons for the disintegration of the Soviet Union” is asked almost every year. Write three distinct points: <strong className="font-black text-slate-950">(1)</strong> internal economic stagnation and technological backwardness, <strong className="font-black text-slate-950">(2)</strong> the cost of the arms race and the war in Afghanistan, <strong className="font-black text-slate-950">(3)</strong> Gorbachev’s reforms and nationalist discontent among the republics: strongest in Russia and the Baltic region.
          </p>
        </div>
      </section>

      {/* ── 7. SECTION 5: SHOCK THERAPY AND ITS CONSEQUENCES ── */}
      <section id="section-5" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            5
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            Shock Therapy and Its Consequences
          </h3>
        </div>

        {/* DEFINITION 3 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs">
            Remember this
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5">
            DEFINITION 3
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24">
            <strong className="font-black text-slate-950">Shock therapy:</strong> the model for a sudden and complete transition from communism to capitalism, suggested by the <strong className="font-black text-slate-950">World Bank and the International Monetary Fund (IMF)</strong>.
          </p>
        </div>

        {/* 2 Comparison Cards (Original Blue vs Amber) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Left: What it involved */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="text-[#0284C7] font-bold text-sm sm:text-base mb-3">
              What it involved
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>Private property made supreme; privatisation of industry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>Collective farms replaced by private farming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>Free trade; direct links with the Western economies</span>
              </li>
            </ul>
          </div>

          {/* Card Right: What it cost */}
          <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="text-[#EA580C] font-bold text-sm sm:text-base mb-3">
              What it cost
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>Sharp devaluation of the ruble, runaway inflation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>People’s lifetime savings wiped out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>Rise of the mafia; the economy collapsed in 1998</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>Collapse of the middle class, and migration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regional Conflicts Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] mt-2">
          The disintegration was also followed by conflicts in several regions: <strong className="font-black text-slate-950">Chechnya and Dagestan</strong> in Russia, civil war in <strong className="font-black text-slate-950">Tajikistan</strong>, <strong className="font-black text-slate-950">Nagorno-Karabakh</strong> in Azerbaijan, and the break-up of <strong className="font-black text-slate-950">Yugoslavia</strong>. The Central Asian republics hold vast reserves of oil and gas, which keeps outside powers competing over oil pipelines through the region.
        </p>
      </section>

      {/* ── 8. SECTION 6: INDIA AND RUSSIA'S RELATIONSHIP ── */}
      <section id="section-6" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0">
            6
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight">
            India and Russia’s Relationship
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82]">
          India and Russia have signed <strong className="font-black text-slate-950">more than 80 bilateral agreements</strong>, and the <strong className="font-black text-slate-950">2001 India–Russia Strategic Partnership</strong> is the basis of this relationship.
        </p>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">Area</th>
                <th className="px-4 py-3">Benefit to India</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Defence</td>
                <td className="px-4 py-3">
                  India is the second-largest buyer of Russian weapons; defence deals and joint production
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Energy</td>
                <td className="px-4 py-3">
                  Supply of oil and gas; nuclear power plants such as Kudankulam
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Science & Technology</td>
                <td className="px-4 py-3">
                  Cryogenic rocket technology and space cooperation
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">Diplomacy</td>
                <td className="px-4 py-3">
                  Support for India on the Kashmir issue and at the United Nations
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 9. QUICK RECAP CONTAINER (ORIGINAL EMERALD GREEN) ── */}
      <section id="quick-recap" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-3.5">
          Quick Recap: read this the night before the exam
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-semibold">
          {[
            'The Berlin Wall was built in 1961 and fell on 9 November 1989: the symbol of the end of bipolarity',
            'Soviet system = socialism + one-party rule + a planned economy; the bloc was bound by the Warsaw Pact',
            'Three causes of disintegration: economic stagnation, the arms race and Afghanistan, Gorbachev’s reforms and nationalism',
            'Perestroika = restructuring, Glasnost = openness',
            'December 1991: the CIS was formed, Russia got the USSR’s seat; Gorbachev resigned on 25 December',
            'Shock therapy was the World Bank–IMF model; it wrecked the economy',
            'India–Russia Strategic Partnership, 2001: defence, energy, space and diplomatic support',
          ].map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 10. PRACTICE QUESTIONS: 1 MARK (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-1" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 1 Mark
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'When was the Berlin Wall built and when was it pulled down?' },
            { q: 'After which revolution was the Soviet Union formed?' },
            { q: 'What was the Warsaw Pact?' },
            { q: 'Write the meaning of Perestroika and Glasnost.' },
            { q: 'How many republics did the Soviet Union have?' },
            { q: 'What does CIS stand for?' },
            { q: 'On what date did Gorbachev resign?' },
            { q: 'Shock therapy was based on the model of which two institutions?' },
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

      {/* ── 11. PRACTICE QUESTIONS: 2 AND 4 MARKS (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-2-4" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 2 and 4 Marks
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'State any two strengths of the Soviet system.', marks: '2 Marks' },
            { q: 'How did the invasion of Afghanistan weaken the Soviet Union?', marks: '2 Marks' },
            { q: 'How did Boris Yeltsin become a national hero?', marks: '2 Marks' },
            { q: 'Explain the three main reasons for the disintegration of the Soviet Union.', marks: '4 Marks' },
            { q: 'What was shock therapy, and what were its consequences?', marks: '4 Marks' },
            { q: 'Write four weaknesses of the Soviet system.', marks: '4 Marks' },
            { q: 'Mention any four conflicts that emerged after the disintegration.', marks: '4 Marks' },
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

      {/* ── 12. PRACTICE QUESTIONS: 6 MARKS (ORIGINAL ORANGE) ── */}
      <section id="practice-questions-6" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Practice Questions: 6 Marks
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'Write, in sequence, the timeline of the disintegration of the Soviet Union from 1985 to 1991.', marks: '6 Marks' },
            { q: 'Explain the India–Russia relationship with examples from four areas.', marks: '6 Marks' },
            { q: 'Explain the statement: “Gorbachev’s reforms did not produce the result he wanted.”', marks: '6 Marks' },
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

      {/* ── 13. MULTIPLE CHOICE QUESTIONS (ORIGINAL ORANGE) ── */}
      <section id="mcqs" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4">
          Multiple Choice Questions
        </h3>
        <div className="space-y-4 font-semibold">
          {[
            {
              q: 'In which year was the Berlin Wall brought down?',
              options: ['(a) 1961', '(b) 1985', '(c) 1989', '(d) 1991'],
            },
            {
              q: 'Perestroika means:',
              options: ['(a) Openness', '(b) Restructuring', '(c) Privatisation', '(d) Non-alignment'],
            },
            {
              q: 'The 1979 Soviet invasion is associated with which country?',
              options: ['(a) Iran', '(b) Afghanistan', '(c) China', '(d) Poland'],
            },
            {
              q: 'The first Soviet republic to declare independence was:',
              options: ['(a) Estonia', '(b) Latvia', '(c) Lithuania', '(d) Ukraine'],
            },
            {
              q: 'Who received the Soviet Union’s seat at the United Nations?',
              options: ['(a) Ukraine', '(b) Belarus', '(c) Russia', '(d) Kazakhstan'],
            },
            {
              q: 'In which year was the India–Russia Strategic Partnership signed?',
              options: ['(a) 1991', '(b) 1998', '(c) 2001', '(d) 2005'],
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

      {/* ── 14. ASSERTION AND REASON (ORIGINAL ORANGE / SKY BLUE) ── */}
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
                <strong className="font-bold text-[#0284C7]">Assertion (A):</strong> The disintegration of the Soviet Union was not the result of military defeat.
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">Reason (R):</strong> Popular movements and an internal economic crisis brought the system down.
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
                <strong className="font-bold text-[#0284C7]">Assertion (A):</strong> Shock therapy immediately strengthened the Russian economy.
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">Reason (R):</strong> It caused the devaluation of the ruble and the economy collapsed in 1998.
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs">
              1 Mark
            </span>
          </div>
        </div>
      </section>

      {/* ── 15. ANSWER KEY (ORIGINAL EMERALD GREEN) ── */}
      <section id="answer-key" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-2">
          Answer Key
        </h3>
        <div className="text-xs sm:text-[13.5px] text-slate-900 font-semibold leading-relaxed flex items-center flex-wrap gap-x-2 gap-y-1">
          <span className="font-bold text-emerald-800">MCQ 1–6</span>
          <span>(c) (b) (b) (c) (c) (c)</span>
          <span className="text-emerald-500 font-bold">·</span>
          <span className="font-bold text-emerald-800">Assertion–Reason</span>
          <span>1(a) · 2(d): Assertion is false, shock therapy wrecked the economy</span>
        </div>
      </section>

      {/* ── 16. STUDY KIT & PDF DOWNLOADS (EXACT SCREENSHOT 2) ── */}
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
            अपनी परीक्षा की तैयारी के लिए सबसे उपयुक्त नोट्स प्रारूप चुनें।
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
                त्वरित रिवीजन के लिए संक्षिप्त एवं सटीक नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Essential concepts (मुख्य अवधारणाएं)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Key definitions (प्रमुख परिभाषाएं)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>Quick revision points (रिवीज़न बिंदु)</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-free-pdf-btn"
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
                विस्तृत परीक्षा तैयारी हेतु सम्पूर्ण अध्याय नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Detailed explanations (विस्तृत व्याख्या)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Important examples (महत्वपूर्ण उदाहरण)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Diagrams &amp; Mindmaps (आरेख व टाइमलाइन)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Exam-focused points (परीक्षा केंद्रित बिंदु)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Complete chapter coverage (सम्पूर्ण पाठ्यक्रम)</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-premium-pdf-btn"
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

      {/* ── 17. BOTTOM SWITCHER ── */}
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
