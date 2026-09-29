'use client';

import React from 'react';
import { Download, Sparkles, Check, ArrowDown } from 'lucide-react';

interface Class12CentresOfPowerHindiNotesProps {
  onSwitchToEnglish?: () => void;
  onDownloadClick?: (type: 'free' | 'premium') => void;
}

export function Class12CentresOfPowerHindiNotes({
  onSwitchToEnglish,
  onDownloadClick,
}: Class12CentresOfPowerHindiNotesProps) {
  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 font-hindi">
      
      {/* ── 1. CHAPTER MIND MAP (अध्याय का माइंड मैप: सब कुछ कैसे जुड़ा है) ── */}
      <section id="mind-map" className="border-2 border-[#8B5CF6] bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs font-hindi">
        <h2 className="text-center font-bold text-base sm:text-lg text-[#7C3AED] mb-5 sm:mb-6">
          अध्याय का माइंड मैप: सब कुछ कैसे जुड़ा है
        </h2>

        {/* Desktop Mind Map Diagram (md+) */}
        <div className="hidden md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center relative min-h-[250px]">
          
          {/* Left Column (Boxes 1, 2, 3) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 1 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                1 · वैकल्पिक केंद्र क्यों
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                दो ध्रुवीयता के बाद नई शक्तियों का उदय
              </div>
            </div>

            {/* Box 2 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                2 · यूरोपीय संघ
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                युद्ध की राख से बना आर्थिक और राजनीतिक संगठन
              </div>
            </div>

            {/* Box 3 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                3 · आसियान
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                ‘आसियान शैली’ और तीन स्तंभों वाला समुदाय
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
              <div>सत्ता के</div>
              <div>समकालीन केंद्र</div>
            </div>
          </div>

          {/* Right Column (Boxes 4, 5, 6) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 4 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                4 · चीन का उदय
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                खुले द्वार की नीति और आर्थिक महाशक्ति बनना
              </div>
            </div>

            {/* Box 5 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                5 · चीन की चुनौतियाँ
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                बेरोज़गारी, पर्यावरण और असमानता
              </div>
            </div>

            {/* Box 6 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                6 · भारत–चीन संबंध
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                टकराव से व्यापार तक का सफ़र
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Mind Map Layout (<md) */}
        <div className="md:hidden space-y-3">
          <div className="bg-[#7C3AED] text-white font-bold text-sm text-center py-3 px-4 rounded-xl shadow-xs mb-3">
            सत्ता के समकालीन केंद्र
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">1 · वैकल्पिक केंद्र क्यों</div>
              <div className="text-[11px] text-slate-700 font-semibold">दो ध्रुवीयता के बाद नई शक्तियों का उदय</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">2 · यूरोपीय संघ</div>
              <div className="text-[11px] text-slate-700 font-semibold">युद्ध की राख से बना आर्थिक और राजनीतिक संगठन</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">3 · आसियान</div>
              <div className="text-[11px] text-slate-700 font-semibold">‘आसियान शैली’ और तीन स्तंभों वाला समुदाय</div>
            </div>
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">4 · चीन का उदय</div>
              <div className="text-[11px] text-slate-700 font-semibold">खुले द्वार की नीति और आर्थिक महाशक्ति बनना</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">5 · चीन की चुनौतियाँ</div>
              <div className="text-[11px] text-slate-700 font-semibold">बेरोज़गारी, पर्यावरण और असमानता</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">6 · भारत–चीन संबंध</div>
              <div className="text-[11px] text-slate-700 font-semibold">टकराव से व्यापार तक का सफ़र</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEYWORD PILLS ROW (ORIGINAL MINT-GREEN) ── */}
      <section className="flex items-center flex-wrap gap-2 sm:gap-2.5 font-hindi">
        {[
          'मास्ट्रिस्ट संधि',
          'यूरो',
          'आसियान शैली',
          'ARF',
          'खुले द्वार की नीति',
          'विशेष आर्थिक क्षेत्र',
        ].map((pill) => (
          <span
            key={pill}
            className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] shadow-2xs font-hindi"
          >
            {pill}
          </span>
        ))}
      </section>

      {/* ── 3. SECTION 1: वैकल्पिक केंद्र क्यों उभरे? ── */}
      <section id="section-1" className="space-y-4 font-hindi">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            1
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            वैकल्पिक केंद्र क्यों उभरे?
          </h3>
        </div>

        {/* Paragraph (IDL Blog Typography) */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          दो ध्रुवीय व्यवस्था के अंत के बाद यह प्रश्न उठा कि अमेरिकी वर्चस्व का विकल्प क्या हो सकता है। इसका एक उत्तर था: <strong className="font-black text-slate-950">क्षेत्रीय संगठन</strong>। यूरोप में <strong className="font-black text-slate-950">यूरोपीय संघ</strong> और एशिया में <strong className="font-black text-slate-950">आसियान</strong> ऐसे ही विकल्प बनकर उभरे, जबकि <strong className="font-black text-slate-950">चीन</strong> ने अपनी अर्थव्यवस्था के बल पर यह स्थान बनाया।
        </p>
      </section>

      {/* ── 4. SECTION 2: यूरोपीय संघ ── */}
      <section id="section-2" className="space-y-4 font-hindi">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            2
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            यूरोपीय संघ
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          दूसरे विश्वयुद्ध के बाद यूरोप तबाह हो चुका था। अमेरिका ने <strong className="font-black text-slate-950">मार्शल योजना</strong> के तहत सहायता दी और 1949 में <strong className="font-black text-slate-950">यूरोप परिषद</strong> बनी। धीरे-धीरे आर्थिक सहयोग बढ़ा और सोवियत खेमे के पतन के बाद यह प्रक्रिया तेज़ हो गई।
        </p>

        {/* DEFINITION 1 (Sky Blue Box) */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative font-hindi">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs font-hindi">
            याद रखें
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5 font-hindi">
            परिभाषा 1
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24 font-hindi">
            <strong className="font-black text-slate-950">यूरोपीय संघ (European Union)</strong> की स्थापना <strong className="font-black text-slate-950">7 फ़रवरी 1992 की मास्ट्रिस्ट संधि</strong> से हुई। इसने आर्थिक सहयोग को एक साझा विदेश व सुरक्षा नीति तथा साझा नागरिकता तक विस्तृत कर दिया।
          </p>
        </div>

        {/* Nation-state resemblance paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          संघ का अपना <strong className="font-black text-slate-950">झंडा, गान, स्थापना दिवस और साझा मुद्रा: यूरो</strong> है। इस अर्थ में यह केवल आर्थिक संगठन नहीं, बल्कि एक <strong className="font-black text-slate-950">राष्ट्र-राज्य जैसा</strong> स्वरूप रखता है।
        </p>

        {/* Table (प्रभाव का क्षेत्र vs यूरोपीय संघ की ताक़त) */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs font-hindi">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[28%] border-r border-[#6366F1]/40">प्रभाव का क्षेत्र</th>
                <th className="px-4 py-3">यूरोपीय संघ की ताक़त</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">आर्थिक</td>
                <td className="px-4 py-3">
                  विश्व की सबसे बड़ी अर्थव्यवस्थाओं में; इसकी मुद्रा यूरो डॉलर को चुनौती देती है; विश्व व्यापार में बड़ा हिस्सा
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">राजनीतिक–कूटनीतिक</td>
                <td className="px-4 py-3">
                  फ्रांस सुरक्षा परिषद का स्थायी सदस्य; कई सदस्य अस्थायी सदस्य; इससे अमेरिकी नीतियों को प्रभावित करने की क्षमता
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">सैन्य</td>
                <td className="px-4 py-3">
                  अमेरिका के बाद सबसे बड़ा रक्षा बजट; फ्रांस और ब्रिटेन के पास परमाणु हथियार
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Callout Box: सीमाएँ भी याद रखें (Rose/Pink border & bg) */}
        <div className="border-2 border-[#FECDD3] bg-[#FFF1F2] rounded-2xl p-4 sm:p-5 mt-4 font-hindi">
          <div className="text-[#E11D48] font-bold text-xs uppercase tracking-wider mb-1.5 font-hindi">
            सीमाएँ भी याद रखें
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8] font-hindi">
            यूरोपीय संघ की अपनी कमज़ोरियाँ हैं। सदस्य देश अपनी <strong className="font-black text-slate-950">संप्रभुता</strong> छोड़ने को तैयार नहीं हैं; कुछ देशों ने यूरो नहीं अपनाया; और <strong className="font-black text-slate-950">2003 में साझा संविधान बनाने की कोशिश विफल</strong> रही। इसलिए विदेश और रक्षा नीति पर सदस्य अक्सर अलग-अलग रुख अपनाते हैं।
          </p>
        </div>
      </section>

      {/* ── 5. SECTION 3: आसियान ── */}
      <section id="section-3" className="space-y-4 font-hindi">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            3
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            आसियान
          </h3>
        </div>

        {/* DEFINITION 2 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative font-hindi">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs font-hindi">
            याद रखें
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5 font-hindi">
            परिभाषा 2
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24 font-hindi">
            <strong className="font-black text-slate-950">आसियान (ASEAN)</strong> की स्थापना <strong className="font-black text-slate-950">1967 में बैंकॉक घोषणा</strong> द्वारा पाँच देशों, इंडोनेशिया, मलेशिया, फ़िलीपींस, सिंगापुर और थाईलैंड, ने की। उद्देश्य थे आर्थिक विकास, सामाजिक प्रगति, सांस्कृतिक विकास और क्षेत्र में शांति।
          </p>
        </div>

        {/* ASEAN Way Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          आसियान की कार्यशैली को <strong className="font-black text-slate-950">‘आसियान शैली’</strong> कहते हैं: अनौपचारिक, टकराव-रहित और सहयोग पर आधारित बातचीत।
        </p>

        {/* 3 Community Cards (with purple circular badges 1, 2, 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-hindi">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              1
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              आसियान सुरक्षा समुदाय
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              क्षेत्रीय विवाद सैन्य टकराव तक न पहुँचें: शांतिपूर्ण समाधान पर बल।
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              2
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              आसियान आर्थिक समुदाय
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              साझा बाज़ार और उत्पादन आधार; निवेश, श्रम और पूँजी की आवाजाही आसान बनाना।
            </div>
          </div>

          {/* Card 3 (spans full width on md+) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs md:col-span-2">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              3
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              आसियान सामाजिक–सांस्कृतिक समुदाय
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              क्षेत्र के लोगों के बीच सहयोग और साझा पहचान का विकास।
            </div>
          </div>
        </div>

        {/* ARF Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          <strong className="font-black text-slate-950">आसियान क्षेत्रीय मंच (ARF)</strong> की स्थापना <strong className="font-black text-slate-950">1994</strong> में हुई, जो सुरक्षा और विदेश नीति पर बातचीत का मंच है। आसियान की असली ताक़त <strong className="font-black text-slate-950">बातचीत और सहयोग</strong> है, सैन्य शक्ति नहीं। भारत ने भी सिंगापुर और थाईलैंड जैसे देशों से मुक्त व्यापार समझौते किए हैं।
        </p>
      </section>

      {/* ── 6. SECTION 4: चीन का आर्थिक उदय ── */}
      <section id="section-4" className="space-y-4 font-hindi">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            4
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            चीन का आर्थिक उदय
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          चीन ने अपनी अर्थव्यवस्था को धीरे-धीरे और सोच-समझकर खोला: एक ही झटके में नहीं, जैसा सोवियत संघ के बाद रूस ने किया था।
        </p>

        {/* Vertical Step Flow (5 Flow Nodes with down arrows ↓) */}
        <div className="space-y-2.5 max-w-2xl mx-auto my-6 font-hindi">
          {/* Step 1 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5 font-sans">
              1972
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              अमेरिका से संबंध सामान्य कर राजनीतिक अलगाव समाप्त किया
            </div>
          </div>

          <div className="flex justify-center text-[#6366F1]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 2 */}
          <div className="border border-[#34D399] bg-[#ECFDF5] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#059669] mb-0.5 font-sans">
              1973
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              चाऊ एन-लाई ने <strong className="font-black text-slate-950">चार आधुनिकीकरण</strong> का प्रस्ताव रखा: कृषि, उद्योग, विज्ञान-प्रौद्योगिकी और सेना
            </div>
          </div>

          <div className="flex justify-center text-[#10B981]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 3 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5 font-sans">
              1978
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              देंग शियाओ पेंग ने <strong className="font-black text-slate-950">‘खुले द्वार की नीति’</strong> की घोषणा की
            </div>
          </div>

          <div className="flex justify-center text-[#6366F1]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 4 */}
          <div className="border border-[#34D399] bg-[#ECFDF5] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#059669] mb-0.5">
              क्रमिक निजीकरण
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              पहले कृषि, फिर उद्योग: इससे ग्रामीण आय और बचत बढ़ी
            </div>
          </div>

          <div className="flex justify-center text-[#10B981]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Step 5 */}
          <div className="border border-[#818CF8] bg-[#EEF2FF] rounded-xl p-3 sm:p-3.5 text-center shadow-2xs">
            <div className="font-bold text-xs sm:text-sm text-[#4338CA] mb-0.5 font-sans">
              2001
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              विश्व व्यापार संगठन (WTO) की सदस्यता
            </div>
          </div>
        </div>

        {/* SEZs Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          विदेशी पूँजी और तकनीक लाने के लिए <strong className="font-black text-slate-950">विशेष आर्थिक क्षेत्र (SEZ)</strong> बनाए गए, जहाँ विदेशी निवेशकों को विशेष छूट मिली। इसी कारण चीन विश्व की सबसे तेज़ी से बढ़ती अर्थव्यवस्था बना।
        </p>

        {/* Callout Box: आम ग़लती (Rose/Pink border & bg) */}
        <div className="border-2 border-[#FECDD3] bg-[#FFF1F2] rounded-2xl p-4 sm:p-5 mt-4 font-hindi">
          <div className="text-[#E11D48] font-bold text-xs uppercase tracking-wider mb-1.5 font-hindi">
            आम ग़लती
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8] font-hindi">
            यह मत लिखिए कि चीन ने “शॉक थेरेपी” अपनाई। चीन ने <strong className="font-black text-slate-950">क्रमिक और नियंत्रित</strong> ढंग से बाज़ार खोला और राजनीतिक व्यवस्था पर कम्युनिस्ट पार्टी का नियंत्रण बनाए रखा: रूस की अचानक छलाँग इसके ठीक उलट थी।
          </p>
        </div>

        {/* Costs Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] mt-2 font-hindi">
          पर इस उदय की क़ीमत भी है: <strong className="font-black text-slate-950">बेरोज़गारी</strong>, ग्रामीण-शहरी और तटीय-भीतरी क्षेत्रों के बीच बढ़ती <strong className="font-black text-slate-950">असमानता</strong>, <strong className="font-black text-slate-950">पर्यावरण का नुक़सान</strong> और <strong className="font-black text-slate-950">भ्रष्टाचार</strong>।
        </p>
      </section>

      {/* ── 7. SECTION 5: भारत–चीन संबंध ── */}
      <section id="section-5" className="space-y-4 font-hindi">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            5
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            भारत–चीन संबंध
          </h3>
        </div>

        {/* Table: दौर vs क्या हुआ */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs font-hindi">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">दौर</th>
                <th className="px-4 py-3">क्या हुआ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">1962</td>
                <td className="px-4 py-3">
                  सीमा विवाद पर युद्ध: संबंधों में लंबा अविश्वास
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">1976 के बाद</td>
                <td className="px-4 py-3">
                  राजनयिक संबंध फिर बहाल; बातचीत की शुरुआत
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">1988 से</td>
                <td className="px-4 py-3">
                  उच्चस्तरीय यात्राओं से रिश्ते सुधरे; सीमा विवाद अलग रखकर अन्य क्षेत्रों में सहयोग
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">आज</td>
                <td className="px-4 py-3">
                  व्यापार तेज़ी से बढ़ा; पर सीमा विवाद और व्यापार असंतुलन बड़ी चुनौतियाँ बने हुए हैं
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 8. QUICK RECAP CONTAINER (झटपट दोहराव) ── */}
      <section id="quick-recap" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-3.5 font-hindi">
          झटपट दोहराव: परीक्षा से एक रात पहले पढ़ें
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-semibold font-hindi">
          {[
            'यूरोपीय संघ की स्थापना 7 फ़रवरी 1992 की मास्ट्रिस्ट संधि से हुई; साझा मुद्रा यूरो',
            'यूरोपीय संघ का प्रभाव तीन तरह का: आर्थिक, राजनीतिक–कूटनीतिक और सैन्य',
            'इसकी सीमा: सदस्य देश संप्रभुता नहीं छोड़ना चाहते; 2003 का साझा संविधान विफल',
            'आसियान 1967 में बैंकॉक घोषणा से बना; संस्थापक पाँच देश',
            'आसियान समुदाय के तीन स्तंभ: सुरक्षा, आर्थिक और सामाजिक–सांस्कृतिक',
            'ARF 1994 में बना; आसियान की ताक़त बातचीत है, सैन्य शक्ति नहीं',
            'चीन: 1978 खुले द्वार की नीति, क्रमिक निजीकरण, SEZ, 2001 में WTO',
            'चीन का रास्ता क्रमिक था, रूस की शॉक थेरेपी जैसा अचानक नहीं',
          ].map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 9. PRACTICE QUESTIONS: 1 MARK (अभ्यास प्रश्न: 1 अंक) ── */}
      <section id="practice-questions-1" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 1 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'मास्ट्रिस्ट संधि कब हुई?' },
            { q: 'यूरोपीय संघ की साझा मुद्रा क्या है?' },
            { q: 'आसियान की स्थापना कब और किस घोषणा से हुई?' },
            { q: 'आसियान के पाँच संस्थापक देश कौन-से थे?' },
            { q: 'ARF की स्थापना किस वर्ष हुई?' },
            { q: '‘खुले द्वार की नीति’ किसने और कब घोषित की?' },
            { q: 'चीन WTO का सदस्य कब बना?' },
            { q: 'विशेष आर्थिक क्षेत्र (SEZ) क्या हैं?' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5 font-sans">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
                1 अंक
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. PRACTICE QUESTIONS: 2 AND 4 MARKS (अभ्यास प्रश्न: 2 और 4 अंक) ── */}
      <section id="practice-questions-2-4" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 2 और 4 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: '‘आसियान शैली’ से क्या तात्पर्य है?', marks: '2 अंक' },
            { q: 'चार आधुनिकीकरण कौन-से थे?', marks: '2 अंक' },
            { q: 'यूरोपीय संघ को ‘राष्ट्र-राज्य जैसा’ क्यों कहा जाता है?', marks: '2 अंक' },
            { q: 'यूरोपीय संघ के आर्थिक, राजनीतिक और सैन्य प्रभाव का वर्णन कीजिए।', marks: '4 अंक' },
            { q: 'आसियान समुदाय के तीन स्तंभों को समझाइए।', marks: '4 अंक' },
            { q: 'चीन की आर्थिक सफलता के कारण बताइए।', marks: '4 अंक' },
            { q: 'चीन के आर्थिक उदय की चार समस्याएँ लिखिए।', marks: '4 अंक' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5 font-sans">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
                {item.marks}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. PRACTICE QUESTIONS: 6 MARKS (अभ्यास प्रश्न: 6 अंक) ── */}
      <section id="practice-questions-6" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 6 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'यूरोपीय संघ एक प्रभावशाली क्षेत्रीय संगठन कैसे बना? उसकी सीमाओं का भी उल्लेख कीजिए।', marks: '6 अंक' },
            { q: 'चीन ने अपनी अर्थव्यवस्था किस क्रम में खोली? रूस की शॉक थेरेपी से इसकी तुलना कीजिए।', marks: '6 अंक' },
            { q: 'भारत और चीन के संबंधों के विकास का वर्णन कीजिए।', marks: '6 अंक' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="text-slate-900 leading-snug">
                <span className="font-bold text-[#4F46E5] mr-1.5 font-sans">{idx + 1}.</span>
                <span>{item.q}</span>
              </div>
              <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
                {item.marks}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 12. MULTIPLE CHOICE QUESTIONS (बहुविकल्पीय प्रश्न) ── */}
      <section id="mcqs" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          बहुविकल्पीय प्रश्न
        </h3>
        <div className="space-y-4 font-semibold">
          {[
            {
              q: 'यूरोपीय संघ की स्थापना किस संधि से हुई?',
              options: ['(क) रोम संधि', '(ख) मास्ट्रिस्ट संधि', '(ग) वारसा संधि', '(घ) पेरिस संधि'],
            },
            {
              q: 'आसियान की स्थापना किस वर्ष हुई?',
              options: ['(क) 1957', '(ख) 1967', '(ग) 1978', '(घ) 1992'],
            },
            {
              q: '‘खुले द्वार की नीति’ किससे जुड़ी है?',
              options: ['(क) चाऊ एन-लाई', '(ख) माओ', '(ग) देंग शियाओ पेंग', '(घ) गोर्बाचेव'],
            },
            {
              q: 'ARF का संबंध किससे है?',
              options: ['(क) यूरोपीय संघ', '(ख) आसियान', '(ग) सार्क', '(घ) नाटो'],
            },
            {
              q: 'चीन WTO में शामिल हुआ:',
              options: ['(क) 1991', '(ख) 1995', '(ग) 2001', '(घ) 2005'],
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="text-slate-900 leading-snug">
                  <span className="font-bold text-[#4F46E5] mr-1.5 font-sans">{idx + 1}.</span>
                  <span>{item.q}</span>
                </div>
                <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
                  1 अंक
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

      {/* ── 13. ASSERTION AND REASON (अभिकथन एवं कारण) ── */}
      <section id="assertion-reason" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-1.5 font-hindi">
          अभिकथन एवं कारण
        </h3>
        <p className="text-xs text-slate-700 font-semibold mb-4 leading-relaxed font-hindi">
          विकल्प: <strong className="font-semibold text-slate-800">(क)</strong> दोनों सही, कारण सही व्याख्या · <strong className="font-semibold text-slate-800">(ख)</strong> दोनों सही, पर व्याख्या नहीं · <strong className="font-semibold text-slate-800">(ग)</strong> अभिकथन सही, कारण ग़लत · <strong className="font-semibold text-slate-800">(घ)</strong> अभिकथन ग़लत, कारण सही।
        </p>

        <div className="space-y-3 font-semibold">
          {/* Item 1 */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-3.5 sm:p-4 flex items-start justify-between gap-3 font-hindi">
            <div className="text-xs sm:text-[13.5px] space-y-1.5 text-slate-900">
              <div className="leading-snug">
                <span className="font-bold text-[#4F46E5] mr-2 font-sans">1.</span>
                <strong className="font-bold text-[#0284C7]">अभिकथन (A):</strong> आसियान की ताक़त उसकी सैन्य शक्ति है।
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">कारण (R):</strong> आसियान बातचीत और सहयोग की ‘आसियान शैली’ पर चलता है।
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
              1 अंक
            </span>
          </div>

          {/* Item 2 */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-3.5 sm:p-4 flex items-start justify-between gap-3 font-hindi">
            <div className="text-xs sm:text-[13.5px] space-y-1.5 text-slate-900">
              <div className="leading-snug">
                <span className="font-bold text-[#4F46E5] mr-2 font-sans">2.</span>
                <strong className="font-bold text-[#0284C7]">अभिकथन (A):</strong> यूरोपीय संघ की विदेश नीति हमेशा एकमत नहीं होती।
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">कारण (R):</strong> सदस्य देश अपनी संप्रभुता छोड़ने को तैयार नहीं हैं।
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
              1 अंक
            </span>
          </div>
        </div>
      </section>

      {/* ── 14. ANSWER KEY (उत्तर कुंजी) ── */}
      <section id="answer-key" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-4 sm:p-5 shadow-2xs font-hindi">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-2 font-hindi">
          उत्तर कुंजी
        </h3>
        <div className="text-xs sm:text-[13.5px] text-slate-900 font-semibold leading-relaxed flex items-center flex-wrap gap-x-2 gap-y-1 font-hindi">
          <span className="font-bold text-emerald-800">बहुविकल्पीय 1–5</span>
          <span>(ख) (ख) (ग) (ख) (ग)</span>
          <span className="text-emerald-500 font-bold">·</span>
          <span className="font-bold text-emerald-800">अभिकथन</span>
          <span>1(घ): अभिकथन ग़लत, ताक़त बातचीत है · 2(क)</span>
        </div>
      </section>

      {/* ── 15. STUDY KIT & PDF DOWNLOADS (8. अध्ययन किट एवं पीडीएफ डाउनलोड) ── */}
      <section id="download-notes" className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 font-hindi">
        {/* Eyebrow & Title */}
        <div className="text-center max-w-xl mx-auto">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#155EEF] dark:text-blue-400 mb-1">
            8. STUDY KIT &amp; PDF DOWNLOADS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#062B67] dark:text-white tracking-tight font-hindi">
            नोट्स डाउनलोड करें (Download Notes)
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 font-hindi">
            अपनी परीक्षा की तैयारी के लिए सबसे उपयुक्त नोट्स प्रारूप चुनें।
          </p>
        </div>

        {/* 2 Comparison Cards (Clean, Flat, Minimal) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 items-stretch font-hindi">
          
          {/* ── CARD 1: Free Revision Notes ── */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between hover:border-blue-300 transition-all">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs mb-3 font-hindi">
                त्वरित रिवीज़न (Quick Revision)
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white font-hindi">
                निःशुल्क रिवीज़न नोट्स
              </h3>
              
              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium font-hindi">
                त्वरित रिवीजन के लिए संक्षिप्त एवं सटीक नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hindi">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>मुख्य अवधारणाएं (यूरोपीय संघ, आसियान, चीन)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>प्रमुख संधियां व तिथियां (मास्ट्रिस्ट संधि, बैंकॉक घोषणा)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>त्वरित परीक्षा रिवीज़न बिंदु</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-free-pdf-btn-ch2-hi"
                onClick={() => onDownloadClick?.('free')}
                className="w-full h-11 rounded-xl border border-[#155EEF] text-[#155EEF] hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none active:scale-[0.99] font-hindi"
              >
                <Download className="w-4 h-4" />
                <span>निःशुल्क PDF डाउनलोड करें (डेमो प्रीव्यू) &rarr;</span>
              </button>
              <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium font-hindi">
                आधिकारिक पाठ्यक्रम अनुसार तैयार पीडीएफ
              </p>
            </div>
          </div>

          {/* ── CARD 2: Premium Full Notes (RECOMMENDED) ── */}
          <div className="bg-white dark:bg-slate-900 border-2 border-[#155EEF] rounded-2xl p-5 sm:p-6 shadow-none flex flex-col justify-between relative mt-2 md:mt-0 transition-all font-hindi">
            {/* Top Right Floating Badge */}
            <div className="absolute -top-3.5 right-6 bg-[#155EEF] text-white text-[10.5px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-hindi">
              अनुशंसित (RECOMMENDED)
            </div>

            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#F0F5FF] dark:bg-blue-950 text-[#155EEF] dark:text-blue-400 font-semibold text-xs mb-3 font-hindi">
                संपूर्ण अध्ययन किट (Complete Study Kit)
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#062B67] dark:text-white font-hindi">
                प्रीमियम संपूर्ण नोट्स
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium font-hindi">
                विस्तृत परीक्षा तैयारी हेतु सम्पूर्ण अध्याय नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hindi">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>विस्तृत व्याख्या (EU, ASEAN, चीन व भारत-चीन संबंध)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>महत्वपूर्ण टाइमलाइन फ्लोचार्ट्स एवं तालिकाएं</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>आरेख व माइंडमैप (अध्याय अवलोकन)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>परीक्षा केंद्रित प्रश्न (1, 2, 4, 6 अंक + MCQ + अभिकथन)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>सम्पूर्ण एनसीईआरटी पाठ्यक्रम कवरेज</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-premium-pdf-btn-ch2-hi"
                onClick={() => onDownloadClick?.('premium')}
                className="w-full h-11 rounded-xl bg-[#155EEF] hover:bg-[#0052CC] text-white font-semibold text-xs sm:text-sm shadow-none transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] font-hindi"
              >
                <Sparkles className="w-4 h-4" />
                <span>सम्पूर्ण नोट्स प्राप्त करें (डेमो प्रीव्यू) &rarr;</span>
              </button>
              <p className="mt-2 text-center text-[10px] sm:text-[11px] text-slate-400 font-medium font-hindi">
                आधिकारिक पाठ्यक्रम अनुसार तैयार संपूर्ण किट
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 16. BOTTOM SWITCHER ── */}
      <section className="border border-slate-200 rounded-2xl bg-white p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3 shadow-2xs font-hindi">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase font-hindi">
          यही अध्याय पढ़ें:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToEnglish}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer font-sans"
          >
            English Medium
          </button>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#4F46E5] text-white shadow-2xs cursor-default font-hindi"
          >
            हिंदी माध्यम
          </button>
        </div>
      </section>

    </div>
  );
}
