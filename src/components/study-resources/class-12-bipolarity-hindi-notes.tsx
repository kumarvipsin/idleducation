'use client';

import React from 'react';
import { Download, Sparkles, Check } from 'lucide-react';

interface Class12BipolarityHindiNotesProps {
  onSwitchToEnglish?: () => void;
  onDownloadClick?: (type: 'free' | 'premium') => void;
}

export function Class12BipolarityHindiNotes({
  onSwitchToEnglish,
  onDownloadClick,
}: Class12BipolarityHindiNotesProps) {
  return (
    <div className="space-y-6 sm:space-y-8 text-slate-900 font-hindi">
      
      {/* ── 1. CHAPTER MIND MAP (अध्याय का माइंड मैप - ORIGINAL SCREENSHOT 1 COLORS) ── */}
      <section id="mind-map" className="border-2 border-[#8B5CF6] bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs">
        <h2 className="text-center font-bold text-base sm:text-lg text-[#7C3AED] mb-5 sm:mb-6 font-hindi">
          अध्याय का माइंड मैप: सब कुछ कैसे जुड़ा है
        </h2>

        {/* Desktop Mind Map Diagram (md+) */}
        <div className="hidden md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center relative min-h-[250px]">
          
          {/* Left Column (Boxes 1, 2, 3) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 1 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                1 · सोवियत प्रणाली
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                समाजवाद, एकदलीय शासन और नियोजित अर्थव्यवस्था
              </div>
            </div>

            {/* Box 2 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                2 · कमज़ोरियाँ
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                ठहरी अर्थव्यवस्था, हथियारों की होड़, अफ़ग़ानिस्तान
              </div>
            </div>

            {/* Box 3 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                3 · गोर्बाचेव के सुधार
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                पेरेस्त्रोइका और ग्लासनोस्त
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
              <div>दो ध्रुवीयता का</div>
              <div>अंत</div>
            </div>
          </div>

          {/* Right Column (Boxes 4, 5, 6) */}
          <div className="col-span-4 flex flex-col justify-between h-[230px]">
            {/* Box 4 (Purple) */}
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#6D28D9] mb-0.5">
                4 · विघटन
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                1991 का तख़्तापलट, येल्तसिन और CIS
              </div>
            </div>

            {/* Box 5 (Green) */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#15803D] mb-0.5">
                5 · शॉक थेरेपी
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                पूँजीवाद की ओर अचानक छलाँग और उसकी क़ीमत
              </div>
            </div>

            {/* Box 6 (Orange) */}
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-3 relative shadow-2xs">
              <div className="font-bold text-xs sm:text-sm text-[#C2410C] mb-0.5">
                6 · भारत–रूस संबंध
              </div>
              <div className="text-xs text-slate-700 font-semibold leading-snug">
                सामरिक साझेदारी और उसके लाभ
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Mind Map Layout (<md) */}
        <div className="md:hidden space-y-3">
          <div className="bg-[#7C3AED] text-white font-bold text-sm text-center py-3 px-4 rounded-xl shadow-xs mb-3">
            दो ध्रुवीयता का अंत
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">1 · सोवियत प्रणाली</div>
              <div className="text-[11px] text-slate-700 font-semibold">समाजवाद, एकदलीय शासन और नियोजित अर्थव्यवस्था</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">2 · कमज़ोरियाँ</div>
              <div className="text-[11px] text-slate-700 font-semibold">ठहरी अर्थव्यवस्था, हथियारों की होड़, अफ़ग़ानिस्तान</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">3 · गोर्बाचेव के सुधार</div>
              <div className="text-[11px] text-slate-700 font-semibold">पेरेस्त्रोइका और ग्लासनोस्त</div>
            </div>
            <div className="border border-[#C084FC] bg-[#FAF5FF] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#6D28D9]">4 · विघटन</div>
              <div className="text-[11px] text-slate-700 font-semibold">1991 का तख़्तापलट, येल्तसिन और CIS</div>
            </div>
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#15803D]">5 · शॉक थेरेपी</div>
              <div className="text-[11px] text-slate-700 font-semibold">पूँजीवाद की ओर अचानक छलाँग और उसकी क़ीमत</div>
            </div>
            <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-xl p-2.5">
              <div className="font-bold text-xs text-[#C2410C]">6 · भारत–रूस संबंध</div>
              <div className="text-[11px] text-slate-700 font-semibold">सामरिक साझेदारी और उसके लाभ</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KEYWORD PILLS ROW (ORIGINAL MINT-GREEN) ── */}
      <section className="flex items-center flex-wrap gap-2 sm:gap-2.5">
        {[
          'बर्लिन की दीवार',
          'वारसा संधि',
          'पेरेस्त्रोइका',
          'ग्लासनोस्त',
          'शॉक थेरेपी',
          'CIS',
          'दो ध्रुवीयता',
        ].map((pill) => (
          <span
            key={pill}
            className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] border border-[#A8DAB5] text-[#137333] shadow-2xs font-hindi"
          >
            {pill}
          </span>
        ))}
      </section>

      {/* ── 3. SECTION 1: सोवियत प्रणाली क्या थी? (ORIGINAL SCREENSHOT 1) ── */}
      <section id="section-1" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            1
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            सोवियत प्रणाली क्या थी?
          </h3>
        </div>

        {/* Paragraph (IDL Blog Typography) */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          <strong className="font-black text-slate-950">बर्लिन की दीवार</strong> पूँजीवादी और साम्यवादी दुनिया के बँटवारे का सबसे बड़ा प्रतीक थी: 1961 में बनी, 150 किलोमीटर से अधिक लंबी, 28 वर्ष खड़ी रही, और <strong className="font-black text-slate-950">9 नवम्बर 1989</strong> को जनता ने इसे गिरा दिया।
        </p>

        {/* DEFINITION 1 (Original Sky Blue Box) */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative font-hindi">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs font-hindi">
            याद रखें
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5 font-hindi">
            परिभाषा 1
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24 font-hindi">
            <strong className="font-black text-slate-950">सोवियत संघ (USSR)</strong> की स्थापना 1917 की समाजवादी क्रांति के बाद हुई। यह पूँजीवाद के विरोध में समानता पर आधारित समाज बनाने का प्रयास था, जिसमें निजी संपत्ति की संस्था समाप्त कर दी गई और उत्पादन के साधनों पर राज्य का स्वामित्व रहा।
          </p>
        </div>

        {/* Table (Original Purple Header) */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs font-hindi">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">पक्ष</th>
                <th className="px-4 py-3">सोवियत प्रणाली की विशेषता</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">राजनीति</td>
                <td className="px-4 py-3">एकदलीय शासन: सोवियत कम्युनिस्ट पार्टी; कोई विपक्ष नहीं</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">अर्थव्यवस्था</td>
                <td className="px-4 py-3">राज्य द्वारा नियोजित और नियंत्रित; राज्य का स्वामित्व</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">खेमा</td>
                <td className="px-4 py-3">
                  ‘दूसरी दुनिया’ या समाजवादी खेमा, <strong className="font-black text-slate-950">वारसा संधि</strong> से बँधा; नेता USSR
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">ताक़त</td>
                <td className="px-4 py-3">
                  अमेरिका के बाद सबसे विकसित अर्थव्यवस्था; तेल, लोहा, इस्पात; सबके लिए न्यूनतम जीवन-स्तर; स्वास्थ्य, शिक्षा और शिशु-देखभाल पर सब्सिडी
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 4. SECTION 2: सोवियत प्रणाली की कमज़ोरियाँ (ORIGINAL SCREENSHOT 1 & 2) ── */}
      <section id="section-2" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            2
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            सोवियत प्रणाली की कमज़ोरियाँ
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          यही प्रणाली भीतर से कमज़ोर पड़ती गई। व्यवस्था <strong className="font-black text-slate-950">नौकरशाही और अधिनायकवादी</strong> हो गई; लोकतंत्र और अभिव्यक्ति की स्वतंत्रता नहीं थी; पार्टी जनता के प्रति जवाबदेह नहीं थी; और <strong className="font-black text-slate-950">15 गणराज्यों</strong> की अपनी संस्कृति व मामलों को स्वयं चलाने की आकांक्षा को लगातार अनदेखा किया गया: काग़ज़ पर रूस पंद्रह में से एक था, पर असल में उसी का वर्चस्व था।
        </p>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-hindi">
          {/* Card 1 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              1
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              हथियारों की होड़
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              अमेरिका की बराबरी तो की, पर बहुत भारी आर्थिक क़ीमत पर।
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              2
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              तकनीकी पिछड़ापन
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              पश्चिम की तुलना में तकनीक, परिवहन और ऊर्जा-ढाँचे में पीछे रह गया।
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              3
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              अफ़ग़ानिस्तान, 1979
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              आक्रमण ने व्यवस्था को और कमज़ोर किया।
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center mb-2 font-sans">
              4
            </div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              उपभोक्ता वस्तुओं की कमी
            </div>
            <div className="text-xs sm:text-[13.5px] text-slate-700 font-semibold leading-relaxed">
              वेतन बढ़ता रहा पर उत्पादकता नहीं; 1970 के दशक के अंत तक अर्थव्यवस्था ठहर गई।
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION 3: गोर्बाचेव के सुधार (ORIGINAL SCREENSHOT 2) ── */}
      <section id="section-3" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            3
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            गोर्बाचेव के सुधार
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          <strong className="font-black text-slate-950">मिखाइल गोर्बाचेव</strong> 1985 में कम्युनिस्ट पार्टी के महासचिव बने और व्यवस्था को सुधारना चाहा, ताकि सोवियत संघ पश्चिम में हो रही सूचना और तकनीकी क्रांति के साथ चल सके।
        </p>

        {/* DEFINITION 2 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative font-hindi">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs font-hindi">
            याद रखें
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5 font-hindi">
            परिभाषा 2
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24 font-hindi">
            <strong className="font-black text-slate-950">पेरेस्त्रोइका</strong> का अर्थ है <strong className="font-black text-slate-950">पुनर्गठन</strong>: अर्थव्यवस्था में सुधार। <strong className="font-black text-slate-950">ग्लासनोस्त</strong> का अर्थ है <strong className="font-black text-slate-950">खुलापन</strong>: राजनीतिक खुलापन और अभिव्यक्ति की छूट।
          </p>
        </div>

        {/* Unintended effect paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          पर इन सुधारों का एक अनचाहा असर हुआ। पूर्वी यूरोप के लोग अपनी सरकारों और सोवियत नियंत्रण के विरुद्ध खड़े हो गए, और इस बार <strong className="font-black text-slate-950">सोवियत संघ ने हस्तक्षेप नहीं किया</strong>: एक के बाद एक साम्यवादी सरकारें गिरती चली गईं।
        </p>
      </section>

      {/* ── 6. SECTION 4: विघटन कैसे हुआ (ORIGINAL SCREENSHOT 2 & 3) ── */}
      <section id="section-4" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            4
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            विघटन कैसे हुआ
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          <strong className="font-black text-slate-950">अगस्त 1991</strong> में पार्टी के कट्टरपंथियों ने तख़्तापलट की कोशिश की, पर जनता स्वतंत्रता का स्वाद चख चुकी थी। <strong className="font-black text-slate-950">बोरिस येल्तसिन</strong> इसका विरोध करके राष्ट्रीय नायक बन गए। दिसम्बर 1991 में रूस, यूक्रेन और बेलारूस ने 1922 की संधि रद्द कर दी और सोवियत संघ भंग घोषित कर दिया।
        </p>

        {/* Timeline (Original Purple & Cyan Colors - 9 nodes) */}
        <div className="space-y-2.5 font-hindi">
          {[
            {
              date: '1985 मार्च',
              text: 'गोर्बाचेव कम्युनिस्ट पार्टी के महासचिव बने; सुधारों की शुरुआत',
              isPurple: true,
            },
            {
              date: '1988 जून',
              text: 'लिथुआनिया में स्वतंत्रता आंदोलन; बाद में एस्टोनिया और लातविया तक फैला',
              isPurple: false,
            },
            {
              date: '1989 अक्टूबर',
              text: 'वारसा संधि के देश अपना भविष्य तय करने को स्वतंत्र घोषित; नवम्बर में बर्लिन की दीवार गिरी',
              isPurple: true,
            },
            {
              date: '1990 फ़रवरी',
              text: 'कम्युनिस्ट पार्टी का 72 वर्ष पुराना सत्ता-एकाधिकार समाप्त; बहुदलीय राजनीति की अनुमति',
              isPurple: false,
            },
            {
              date: '1990 मार्च',
              text: 'लिथुआनिया: स्वतंत्रता घोषित करने वाला पहला गणराज्य',
              isPurple: true,
            },
            {
              date: '1991 जून',
              text: 'येल्तसिन रूस के राष्ट्रपति निर्वाचित',
              isPurple: false,
            },
            {
              date: '1991 अगस्त',
              text: 'कट्टरपंथियों का तख़्तापलट विफल',
              isPurple: true,
            },
            {
              date: '1991 दिसम्बर',
              text: 'रूस, बेलारूस, यूक्रेन ने CIS बनाया; रूस को संयुक्त राष्ट्र में USSR की सीट',
              isPurple: false,
            },
            {
              date: '25 दिसम्बर 1991',
              text: 'गोर्बाचेव का इस्तीफ़ा: सोवियत संघ का अंत',
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

        {/* EXAM TIP (परीक्षा संकेत - Original Warm Amber) */}
        <div className="border-2 border-[#FDE68A] bg-[#FFFBEB] rounded-2xl p-4 sm:p-5 mt-4 font-hindi">
          <div className="text-[#D97706] font-bold text-xs uppercase tracking-wider mb-1.5 font-hindi">
            परीक्षा संकेत
          </div>
          <p className="text-slate-900 font-semibold text-xs sm:text-sm leading-[1.8] font-hindi">
            “सोवियत संघ के विघटन के तीन कारण” लगभग हर वर्ष पूछा जाता है। तीन अलग-अलग बिंदु लिखें: <strong className="font-black text-slate-950">(1)</strong> आंतरिक आर्थिक ठहराव और तकनीकी पिछड़ापन, <strong className="font-black text-slate-950">(2)</strong> हथियारों की होड़ तथा अफ़ग़ानिस्तान युद्ध की लागत, <strong className="font-black text-slate-950">(3)</strong> गोर्बाचेव के सुधार और गणराज्यों का राष्ट्रवादी असंतोष, जो रूस और बाल्टिक क्षेत्र में सबसे प्रबल था।
          </p>
        </div>
      </section>

      {/* ── 7. SECTION 5: शॉक थेरेपी और उसके परिणाम (ORIGINAL SCREENSHOT 3 & 4) ── */}
      <section id="section-5" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            5
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            शॉक थेरेपी और उसके परिणाम
          </h3>
        </div>

        {/* DEFINITION 3 */}
        <div className="border-2 border-[#38BDF8] bg-[#F0F9FF] rounded-xl p-4 sm:p-5 relative font-hindi">
          <span className="absolute top-3.5 right-3.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#0284C7] text-white shadow-2xs font-hindi">
            याद रखें
          </span>
          <div className="text-[#0284C7] font-bold text-xs tracking-wider uppercase mb-1.5 font-hindi">
            परिभाषा 3
          </div>
          <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] pr-20 sm:pr-24 font-hindi">
            <strong className="font-black text-slate-950">शॉक थेरेपी:</strong> साम्यवाद से पूँजीवाद की ओर अचानक और पूर्ण संक्रमण का वह मॉडल जो <strong className="font-black text-slate-950">विश्व बैंक और अंतरराष्ट्रीय मुद्रा कोष (IMF)</strong> ने सुझाया था।
          </p>
        </div>

        {/* 2 Comparison Cards (Original Blue vs Amber) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-hindi">
          {/* Card Left: इसमें क्या किया गया */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="text-[#0284C7] font-bold text-sm sm:text-base mb-3 font-hindi">
              इसमें क्या किया गया
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>निजी स्वामित्व सर्वोच्च; उद्योगों का निजीकरण</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>सामूहिक खेती की जगह निजी खेती</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                <span>मुक्त व्यापार; पश्चिम से सीधा जुड़ाव</span>
              </li>
            </ul>
          </div>

          {/* Card Right: क़ीमत क्या चुकानी पड़ी */}
          <div className="border border-[#FED7AA] bg-[#FFFBEB] rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="text-[#EA580C] font-bold text-sm sm:text-base mb-3 font-hindi">
              क़ीमत क्या चुकानी पड़ी
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13.5px] text-slate-800 font-semibold leading-snug">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>रूबल का भारी अवमूल्यन, बेतहाशा मुद्रास्फीति</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>लोगों की जीवन भर की बचत समाप्त</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>माफ़िया का उदय; 1998 में अर्थव्यवस्था का पतन</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-1.5 shrink-0" />
                <span>मध्यवर्ग का पतन और पलायन</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regional Conflicts Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] mt-2 font-hindi">
          विघटन के बाद कई क्षेत्रों में टकराव भी उभरे: रूस में <strong className="font-black text-slate-950">चेचन्या और दागिस्तान</strong>, <strong className="font-black text-slate-950">ताजिकिस्तान</strong> में गृहयुद्ध, अज़रबैजान में <strong className="font-black text-slate-950">नागोर्नो-काराबाख</strong>, और <strong className="font-black text-slate-950">यूगोस्लाविया</strong> का विघटन। मध्य एशिया के गणराज्यों में तेल और गैस के विशाल भंडार हैं, इसलिए वहाँ तेल पाइपलाइनों को लेकर बाहरी शक्तियों की प्रतिस्पर्धा बनी रहती है।
        </p>
      </section>

      {/* ── 8. SECTION 6: भारत और रूस के संबंध (ORIGINAL SCREENSHOT 4) ── */}
      <section id="section-6" className="space-y-4">
        {/* Banner */}
        <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
          <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold shrink-0 font-sans">
            6
          </span>
          <h3 className="text-[#4F46E5] font-bold text-base sm:text-lg tracking-tight font-hindi">
            भारत और रूस के संबंध
          </h3>
        </div>

        {/* Paragraph */}
        <p className="text-slate-900 font-semibold text-sm sm:text-base leading-[1.82] font-hindi">
          भारत और रूस के बीच <strong className="font-black text-slate-950">80 से अधिक द्विपक्षीय समझौते</strong> हैं और <strong className="font-black text-slate-950">2001 की भारत–रूस सामरिक साझेदारी</strong> इनका आधार है।
        </p>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border border-slate-200 mt-4 shadow-2xs font-hindi">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#4F46E5] text-white text-xs sm:text-sm font-semibold">
                <th className="px-4 py-3 w-[26%] border-r border-[#6366F1]/40">क्षेत्र</th>
                <th className="px-4 py-3">भारत को लाभ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-900 font-semibold bg-white">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">रक्षा</td>
                <td className="px-4 py-3">
                  भारत रूसी हथियारों का दूसरा सबसे बड़ा खरीदार; रक्षा सौदे और संयुक्त उत्पादन
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">ऊर्जा</td>
                <td className="px-4 py-3">
                  तेल और गैस की आपूर्ति; कुडनकुलम जैसे परमाणु ऊर्जा संयंत्र
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">विज्ञान–तकनीक</td>
                <td className="px-4 py-3">
                  क्रायोजेनिक रॉकेट तकनीक और अंतरिक्ष सहयोग
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-200">कूटनीति</td>
                <td className="px-4 py-3">
                  कश्मीर मुद्दे पर तथा संयुक्त राष्ट्र में भारत को समर्थन
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 9. QUICK RECAP CONTAINER (झटपट दोहराव - ORIGINAL EMERALD GREEN SCREENSHOT 4 & 5) ── */}
      <section id="quick-recap" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-3.5 font-hindi">
          झटपट दोहराव: परीक्षा से एक रात पहले पढ़ें
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-900 font-semibold font-hindi">
          {[
            'बर्लिन की दीवार 1961 में बनी और 9 नवम्बर 1989 को गिरी: दो ध्रुवीयता के अंत का प्रतीक',
            'सोवियत प्रणाली = समाजवाद + एकदलीय शासन + नियोजित अर्थव्यवस्था; खेमा वारसा संधि से बँधा था',
            'विघटन के तीन कारण: आर्थिक ठहराव, हथियारों की होड़ व अफ़ग़ानिस्तान, गोर्बाचेव के सुधार और राष्ट्रवाद',
            'पेरेस्त्रोइका = पुनर्गठन, ग्लासनोस्त = खुलापन',
            'दिसम्बर 1991: CIS बना, रूस को UN में USSR की सीट; 25 दिसम्बर को गोर्बाचेव का इस्तीफ़ा',
            'शॉक थेरेपी विश्व बैंक और IMF का मॉडल था; इसने अर्थव्यवस्था को तबाह कर दिया',
            'भारत–रूस सामरिक साझेदारी 2001: रक्षा, ऊर्जा, अंतरिक्ष और कूटनीतिक समर्थन',
          ].map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 10. PRACTICE QUESTIONS: 1 MARK (अभ्यास प्रश्न: 1 अंक - ORIGINAL SCREENSHOT 5) ── */}
      <section id="practice-questions-1" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 1 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'बर्लिन की दीवार कब बनी और कब गिराई गई?' },
            { q: 'सोवियत संघ की स्थापना किस क्रांति के बाद हुई?' },
            { q: 'वारसा संधि क्या थी?' },
            { q: 'पेरेस्त्रोइका और ग्लासनोस्त का अर्थ लिखिए।' },
            { q: 'सोवियत संघ में कितने गणराज्य थे?' },
            { q: 'CIS का पूरा नाम क्या है?' },
            { q: 'गोर्बाचेव ने किस तिथि को इस्तीफ़ा दिया?' },
            { q: 'शॉक थेरेपी किन दो संस्थाओं के मॉडल पर आधारित थी?' },
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

      {/* ── 11. PRACTICE QUESTIONS: 2 AND 4 MARKS (अभ्यास प्रश्न: 2 और 4 अंक - ORIGINAL SCREENSHOT 5) ── */}
      <section id="practice-questions-2-4" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 2 और 4 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'सोवियत प्रणाली की कोई दो ताक़तें बताइए।', marks: '2 अंक' },
            { q: 'अफ़ग़ानिस्तान पर आक्रमण ने सोवियत संघ को कैसे कमज़ोर किया?', marks: '2 अंक' },
            { q: 'बोरिस येल्तसिन राष्ट्रीय नायक कैसे बने?', marks: '2 अंक' },
            { q: 'सोवियत संघ के विघटन के तीन प्रमुख कारण समझाइए।', marks: '4 अंक' },
            { q: 'शॉक थेरेपी क्या थी और उसके क्या परिणाम हुए?', marks: '4 अंक' },
            { q: 'सोवियत प्रणाली की चार कमज़ोरियाँ लिखिए।', marks: '4 अंक' },
            { q: 'विघटन के बाद उभरे किन्हीं चार टकरावों का उल्लेख कीजिए।', marks: '4 अंक' },
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

      {/* ── 12. PRACTICE QUESTIONS: 6 MARKS (अभ्यास प्रश्न: 6 अंक - ORIGINAL SCREENSHOT 5) ── */}
      <section id="practice-questions-6" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          अभ्यास प्रश्न: 6 अंक
        </h3>
        <div className="space-y-3 font-semibold">
          {[
            { q: 'सोवियत संघ के विघटन की समयरेखा 1985 से 1991 तक क्रमवार लिखिए।', marks: '6 अंक' },
            { q: 'भारत और रूस के संबंधों को चार क्षेत्रों के उदाहरण देकर समझाइए।', marks: '6 अंक' },
            { q: 'इस कथन को स्पष्ट कीजिए: “गोर्बाचेव के सुधारों ने वह परिणाम नहीं दिया जो वे चाहते थे।”', marks: '6 अंक' },
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

      {/* ── 13. MULTIPLE CHOICE QUESTIONS (बहुविकल्पीय प्रश्न - MATCHING ENGLISH) ── */}
      <section id="mcqs" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-4 font-hindi">
          बहुविकल्पीय प्रश्न (MCQ)
        </h3>
        <div className="space-y-4 font-semibold">
          {[
            {
              q: 'बर्लिन की दीवार किस वर्ष गिराई गई थी?',
              options: ['(क) 1961', '(ख) 1985', '(ग) 1989', '(घ) 1991'],
            },
            {
              q: '‘पेरेस्त्रोइका’ का क्या अर्थ है?',
              options: ['(क) खुलापन', '(ख) पुनर्गठन', '(ग) निजीकरण', '(घ) गुटनिरपेक्षता'],
            },
            {
              q: '1979 का सोवियत सैन्य आक्रमण किस देश से जुड़ा है?',
              options: ['(क) ईरान', '(ख) अफ़ग़ानिस्तान', '(ग) चीन', '(घ) पोलैंड'],
            },
            {
              q: 'स्वतंत्रता की घोषणा करने वाला पहला सोवियत गणराज्य कौन सा था?',
              options: ['(क) एस्टोनिया', '(ख) लातविया', '(ग) लिथुआनिया', '(घ) यूक्रेन'],
            },
            {
              q: 'संयुक्त राष्ट्र संघ में सोवियत संघ की स्थायी सीट किस देश को मिली?',
              options: ['(क) यूक्रेन', '(ख) बेलारूस', '(ग) रूस', '(घ) कज़ाकिस्तान'],
            },
            {
              q: 'भारत–रूस सामरिक साझेदारी समझौता किस वर्ष हस्ताक्षरित हुआ?',
              options: ['(क) 1991', '(ख) 1998', '(ग) 2001', '(घ) 2005'],
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

      {/* ── 14. ASSERTION AND REASON (अभिकथन और कारण) ── */}
      <section id="assertion-reason" className="border-2 border-[#FB923C] bg-white rounded-2xl p-5 sm:p-6 shadow-2xs font-hindi">
        <h3 className="text-[#EA580C] font-bold text-sm sm:text-base mb-1.5 font-hindi">
          अभिकथन और कारण
        </h3>
        <p className="text-xs text-slate-700 font-semibold mb-4 leading-relaxed font-hindi">
          विकल्प: <strong className="font-semibold text-slate-800">(क)</strong> A और R दोनों सही हैं, और R, A की सही व्याख्या करता है · <strong className="font-semibold text-slate-800">(ख)</strong> A और R दोनों सही हैं, लेकिन R, A की सही व्याख्या नहीं करता · <strong className="font-semibold text-slate-800">(ग)</strong> A सही है, R गलत है · <strong className="font-semibold text-slate-800">(घ)</strong> A गलत है, R सही है।
        </p>

        <div className="space-y-3 font-semibold">
          {/* Item 1 */}
          <div className="border border-[#BAE6FD] bg-[#F0F9FF] rounded-xl p-3.5 sm:p-4 flex items-start justify-between gap-3 font-hindi">
            <div className="text-xs sm:text-[13.5px] space-y-1.5 text-slate-900">
              <div className="leading-snug">
                <span className="font-bold text-[#4F46E5] mr-2 font-sans">1.</span>
                <strong className="font-bold text-[#0284C7]">अभिकथन (A):</strong> सोवियत संघ का विघटन किसी सैन्य पराजय का परिणाम नहीं था।
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">कारण (R):</strong> जनआंदोलनों और आंतरिक आर्थिक संकट ने इस व्यवस्था को ध्वस्त किया।
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
                <strong className="font-bold text-[#0284C7]">अभिकथन (A):</strong> शॉक थेरेपी ने तुरंत रूसी अर्थव्यवस्था को मज़बूत कर दिया।
              </div>
              <div className="leading-snug pl-5 text-slate-800 font-medium">
                <strong className="font-bold text-[#0284C7]">कारण (R):</strong> इसने रूबल का अवमूल्यन किया और 1998 में अर्थव्यवस्था का पतन हो गया।
              </div>
            </div>
            <span className="bg-[#EA580C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 shadow-2xs font-hindi">
              1 अंक
            </span>
          </div>
        </div>
      </section>

      {/* ── 15. ANSWER KEY (उत्तर कुंजी - ORIGINAL EMERALD GREEN) ── */}
      <section id="answer-key" className="border-2 border-[#10B981] bg-[#ECFDF5] rounded-2xl p-4 sm:p-5 shadow-2xs font-hindi">
        <h3 className="text-[#059669] font-bold text-sm sm:text-base mb-2 font-hindi">
          उत्तर कुंजी (Answer Key)
        </h3>
        <div className="text-xs sm:text-[13.5px] text-slate-900 font-semibold leading-relaxed flex items-center flex-wrap gap-x-2 gap-y-1 font-hindi">
          <span className="font-bold text-emerald-800">MCQ 1–6</span>
          <span>(ग) (ख) (ख) (ग) (ग) (ग)</span>
          <span className="text-emerald-500 font-bold">·</span>
          <span className="font-bold text-emerald-800">अभिकथन–कारण</span>
          <span>1(क) · 2(घ): अभिकथन गलत है, शॉक थेरेपी ने अर्थव्यवस्था को तबाह कर दिया</span>
        </div>
      </section>

      {/* ── 16. STUDY KIT & PDF DOWNLOADS (8. अध्ययन किट एवं पीडीएफ डाउनलोड) ── */}
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
                निःशुल्क रिवीज़न नोट्स (Free Notes)
              </h3>
              
              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium font-hindi">
                त्वरित रिवीजन के लिए संक्षिप्त एवं सटीक नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hindi">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>मुख्य अवधारणाएं (Essential concepts)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>प्रमुख परिभाषाएं (Key definitions)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[2.5]" />
                  <span>रिवीज़न बिंदु (Quick revision points)</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-free-pdf-btn-hi"
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
                प्रीमियम संपूर्ण नोट्स (Full Notes)
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-[#5B6B86] dark:text-slate-400 leading-normal font-medium font-hindi">
                विस्तृत परीक्षा तैयारी हेतु सम्पूर्ण अध्याय नोट्स।
              </p>

              <ul className="mt-4 sm:mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-hindi">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>विस्तृत व्याख्या (Detailed explanations)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>महत्वपूर्ण उदाहरण (Important examples)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>आरेख व टाइमलाइन (Diagrams &amp; Timeline)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>परीक्षा केंद्रित बिंदु (Exam-focused points)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>सम्पूर्ण पाठ्यक्रम कवरेज (Complete chapter coverage)</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="download-premium-pdf-btn-hi"
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

      {/* ── 17. BOTTOM SWITCHER ── */}
      <section className="border border-slate-200 rounded-2xl bg-white p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3 shadow-2xs font-hindi">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase font-hindi">
          इस अध्याय को पढ़ें (READ THIS CHAPTER IN):
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
