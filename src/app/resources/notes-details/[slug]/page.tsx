
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";
import { NotesContentRenderer } from "@/components/notes-content-renderer";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'the-cold-war-era': {
    en: {
      title: 'Chapter 1: The Cold War Era',
      content: `### What was the Cold War?
- The Cold War refers to the period of geopolitical tension after World War II between the **United States** and the **Soviet Union (USSR)**.
- It was not a direct 'hot' war with large-scale fighting between the two superpowers, but involved military buildups, proxy wars, and ideological struggles.
- **Ideological Conflict:** The USA, leading the Western bloc, represented liberal democracy and capitalism. The USSR, leading the Eastern bloc, represented socialism and communism.
- **End of World War II:** The war ended when the US dropped atomic bombs on Hiroshima and Nagasaki in August 1945. This demonstrated the immense power of the US and marked a new phase in world politics.

### The Emergence of Two Power Blocs
- The world became divided into two rival alliances or blocs.
- **The Western Alliance (First World):** Led by the **United States**, this was a bloc of democratic and capitalist countries. They formed a military alliance called the **North Atlantic Treaty Organization (NATO)** in April 1949. NATO's principle was that an armed attack on any one of them would be regarded as an attack on all of them.
- **The Eastern Alliance (Second World):** Led by the **Soviet Union**, this bloc consisted of socialist countries. They created the **Warsaw Pact** in 1955 as a direct response to NATO. Its principal function was to counter NATO's forces in Europe.
- Smaller states joined these alliances for protection, weapons, and economic aid. The superpowers needed these smaller states for vital resources (like oil), territory to launch weapons, and military bases.

### Arenas of the Cold War
- 'Arenas' refer to the areas where crises and wars occurred or threatened to occur between the two blocs, but did not cross the line into a full-scale nuclear war.
- **The Cuban Missile Crisis (1962):** This was a high point of the Cold War. The USSR placed nuclear missiles in Cuba, just off the coast of the US. The world was on the brink of nuclear war, but it was averted through diplomacy.
- **Deterrence Logic:** Both sides had nuclear weapons and could retaliate against an attack. This is called **deterrence** - the idea that the fear of massive destruction prevents either side from starting a war. This logic helped prevent a 'hot' war.
- Other major confrontations occurred in **Korea (1950-53), Berlin (1958-62), and the Congo (early 1960s)**.

### Challenge to Bipolarity: Non-Alignment
- Many newly independent countries of Asia, Africa, and Latin America did not want to join either of the superpower blocs. They chose to stay non-aligned.
- **The Non-Aligned Movement (NAM):** This movement was founded by five leaders: **Jawaharlal Nehru (India)**, Josip Broz Tito (Yugoslavia), Gamal Abdel Nasser (Egypt), Sukarno (Indonesia), and Kwame Nkrumah (Ghana).
- **First NAM Summit:** It was held in **Belgrade in 1961**.
- **What is Non-Alignment?:** It was not about 'isolationism' (staying away from world affairs) or 'neutrality' (staying out of wars). It meant actively participating in world affairs to promote peace and deciding on issues independently, not based on what the superpowers wanted.
- NAM gave the newly independent countries a way to protect their hard-won freedom and pursue their own foreign policies.

### New International Economic Order (NIEO)
- Most of the non-aligned countries were categorized as **Least Developed Countries (LDCs)**. They were economically poor and dependent on the richer Western countries.
- The idea of a **New International Economic Order (NIEO)** originated from the realization that economic development was crucial for political freedom.
- The **United Nations Conference on Trade and Development (UNCTAD)** brought out a report in 1972 titled **'Towards a New Trade Policy for Development'**.
- **The report proposed reforms to the global trading system to:**
- - Give LDCs control over their own natural resources.
- - Give them access to Western markets.
- - Provide technology from the West at a lower cost.
- - Give LDCs a greater role in international economic institutions.

### India and the Cold War
- India followed a two-fold policy:
- 1.  It stayed away from the two alliances.
- 2.  It raised its voice against these alliances and worked to reduce Cold War tensions.
- India's policy of non-alignment was criticized by some for being 'unprincipled'. For example, India signed a 20-year **Treaty of Friendship with the USSR in August 1971**, which was seen by some as joining the Soviet camp. India's view was that this treaty was necessary to counter the US-Pakistan-China axis during the Bangladesh crisis and did not stop India from having good relations with the US.
- India's non-alignment served its own interests. It allowed India to take international decisions that served its interests rather than the interests of the superpowers.
`
    },
    hi: {
      title: 'अध्याय 1: शीतयुद्ध का दौर',
      content: `### शीतयुद्ध क्या था?
- शीतयुद्ध द्वितीय विश्व युद्ध के बाद **संयुक्त राज्य अमेरिका (USA)** और **सोवियत संघ (USSR)** के बीच भू-राजनीतिक तनाव की अवधि को संदर्भित करता है।
- यह दोनों महाशक्तियों के बीच बड़े पैमाने पर लड़ाई वाला सीधा 'गर्म' युद्ध नहीं था, बल्कि इसमें सैन्य तैयारी, प्रॉक्सी युद्ध (दूसरे देशों में लड़ाई) और वैचारिक संघर्ष शामिल थे।
- **वैचारिक संघर्ष:** अमेरिका, जो पश्चिमी गुट का नेतृत्व कर रहा था, उदार लोकतंत्र और पूंजीवाद का प्रतिनिधित्व करता था। सोवियत संघ, जो पूर्वी गुट का नेतृत्व कर रहा था, समाजवाद और साम्यवाद का प्रतिनिधित्व करता था।
- **द्वितीय विश्व युद्ध का अंत:** युद्ध तब समाप्त हुआ जब अमेरिका ने अगस्त 1945 में हिरोशिमा और नागासाकी पर परमाणु बम गिराए। इसने अमेरिका की अपार शक्ति का प्रदर्शन किया और विश्व राजनीति में एक नए चरण को चिह्नित किया।

### दो ध्रुवीय विश्व का आरंभ
- दुनिया दो प्रतिद्वंद्वी गठबंधनों या गुटों में विभाजित हो गई।
- **पश्चिमी गठबंधन (पहली दुनिया):** इसका नेतृत्व **संयुक्त राज्य अमेरिका** कर रहा था। यह लोकतांत्रिक और पूंजीवादी देशों का एक गुट था। उन्होंने अप्रैल 1949 में **उत्तर अटलांटिक संधि संगठन (नाटो)** नामक एक सैन्य गठबंधन बनाया। नाटो का सिद्धांत यह था कि उनमें से किसी एक पर सशस्त्र हमला उन सभी पर हमला माना जाएगा।
- **पूर्वी गठबंधन (दूसरी दुनिया):** इसका नेतृत्व **सोवियत संघ** कर रहा था। इस गुट में समाजवादी देश शामिल थे। उन्होंने नाटो की प्रतिक्रिया के रूप में 1955 में **वारसा संधि** बनाई। इसका मुख्य कार्य यूरोप में नाटो की सेनाओं का मुकाबला करना था।
- छोटे राज्य सुरक्षा, हथियार और आर्थिक सहायता के लिए इन गठबंधनों में शामिल हो गए। महाशक्तियों को इन छोटे राज्यों की आवश्यकता महत्वपूर्ण संसाधनों (जैसे तेल), हथियार लॉन्च करने के लिए क्षेत्र और सैन्य ठिकानों के लिए थी।

### शीतयुद्ध के दायरे
- 'दायरे' उन क्षेत्रों को संदर्भित करते हैं जहां दोनों गुटों के बीच संकट और युद्ध हुए या होने का खतरा था, लेकिन एक पूर्ण पैमाने पर परमाणु युद्ध की सीमा को पार नहीं किया।
- **क्यूबा मिसाइल संकट (1962):** यह शीतयुद्ध का एक चरम बिंदु था। सोवियत संघ ने अमेरिका के तट के ठीक बाहर क्यूबा में परमाणु मिसाइलें तैनात कीं। दुनिया परमाणु युद्ध के कगार पर थी, लेकिन कूटनीति के माध्यम से इसे टाल दिया गया।
- **अपरोध का तर्क (Deterrence):** दोनों पक्षों के पास परमाणु हथियार थे और वे हमले का जवाब दे सकते थे। इसे **अपरोध** कहा जाता है - यह विचार कि बड़े पैमाने पर विनाश का डर किसी भी पक्ष को युद्ध शुरू करने से रोकता है। इस तर्क ने 'गर्म' युद्ध को रोकने में मदद की।
- **कोरिया (1950-53), बर्लिन (1958-62), और कांगो (1960 के दशक की शुरुआत)** में भी बड़े टकराव हुए।

### गुटनिरपेक्षता: द्विध्रुवीयता को चुनौती
- एशिया, अफ्रीका और लैटिन अमेरिका के कई नव-स्वतंत्र देश किसी भी महाशक्ति गुट में शामिल नहीं होना चाहते थे। उन्होंने गुटनिरपेक्ष रहने का विकल्प चुना।
- **गुटनिरपेक्ष आंदोलन (NAM):** इस आंदोलन की स्थापना पांच नेताओं ने की थी: **जवाहरलाल नेहरू (भारत)**, जोसिप ब्रोज़ टीटो (यूगोस्लाविया), गमाल अब्देल नासिर (मिस्र), सुकर्णो (इंडोनेशिया), और क्वामे न्क्रूमा (घाना)।
- **पहला गुटनिरपेक्ष शिखर सम्मेलन:** यह **1961 में बेलग्रेड** में आयोजित किया गया था।
- **गुटनिरपेक्षता क्या है?:** यह 'अलगाववाद' (विश्व मामलों से दूर रहना) या 'तटस्थता' (युद्धों से बाहर रहना) के बारे में नहीं था। इसका मतलब था शांति को बढ़ावा देने के लिए विश्व मामलों में सक्रिय रूप से भाग लेना और महाशक्तियों की इच्छा के आधार पर नहीं, बल्कि स्वतंत्र रूप से मुद्दों पर निर्णय लेना।
- गुटनिरपेक्ष आंदोलन ने नव-स्वतंत्र देशों को अपनी कड़ी मेहनत से अर्जित स्वतंत्रता की रक्षा करने और अपनी विदेश नीतियों को आगे बढ़ाने का एक तरीका दिया।

### नव अंतर्राष्ट्रीय आर्थिक व्यवस्था (NIEO)
- अधिकांश गुटनिरपेक्ष देशों को **अल्प विकसित देशों (LDCs)** के रूप में वर्गीकृत किया गया था। वे आर्थिक रूप से गरीब थे और अमीर पश्चिमी देशों पर निर्भर थे।
- **नव अंतर्राष्ट्रीय आर्थिक व्यवस्था (NIEO)** का विचार इस अहसास से उत्पन्न हुआ कि राजनीतिक स्वतंत्रता के लिए आर्थिक विकास महत्वपूर्ण था।
- **संयुक्त राष्ट्र व्यापार और विकास सम्मेलन (UNCTAD)** ने 1972 में **'विकास के लिए एक नई व्यापार नीति की ओर'** शीर्षक से एक रिपोर्ट निकाली।
- **रिपोर्ट में वैश्विक व्यापार प्रणाली में सुधारों का प्रस्ताव दिया गया ताकि:**
- - LDCs को अपने स्वयं के प्राकृतिक संसाधनों पर नियंत्रण दिया जा सके।
- - उन्हें पश्चिमी बाजारों तक पहुंच दी जा सके।
- - पश्चिम से कम लागत पर प्रौद्योगिकी प्रदान की जा सके।
- - LDCs को अंतर्राष्ट्रीय आर्थिक संस्थानों में एक बड़ी भूमिका दी जा सके।

### भारत और शीतयुद्ध
- भारत ने दोहरी नीति का पालन किया:
- 1. यह दोनों गठबंधनों से दूर रहा।
- 2. इसने इन गठबंधनों के खिलाफ अपनी आवाज उठाई और शीतयुद्ध के तनाव को कम करने के लिए काम किया।
- भारत की गुटनिरपेक्षता की नीति की कुछ लोगों ने 'सिद्धांतहीन' होने के लिए आलोचना की। उदाहरण के लिए, भारत ने अगस्त 1971 में सोवियत संघ के साथ 20 साल की **मैत्री संधि** पर हस्ताक्षर किए, जिसे कुछ लोगों ने सोवियत खेमे में शामिल होने के रूप में देखा। भारत का विचार था कि यह संधि बांग्लादेश संकट के दौरान अमेरिका-पाकिस्तान-चीन धुरी का मुकाबला करने के लिए आवश्यक थी और इसने भारत को अमेरिका के साथ अच्छे संबंध रखने से नहीं रोका।
- भारत की गुटनिरपेक्षता ने अपने हितों की पूर्ति की। इसने भारत को महाशक्तियों के हितों के बजाय अपने हितों की सेवा करने वाले अंतर्राष्ट्रीय निर्णय लेने की अनुमति दी।
`
    }
  },
  'the-end-of-bipolarity': {
    en: {
      title: 'Chapter 2: The End of Bipolarity',
      content: `### What was the Soviet System?
- **Formation:** The Union of Soviet Socialist Republics (USSR) was formed after the Socialist Revolution in Russia in 1917. It was inspired by the ideals of socialism and was fundamentally opposed to capitalism.
- **Political System:** It was a **one-party system** dominated by the Communist Party. The state had absolute control, and the system became authoritarian with no space for opposition or freedom of speech.
- **Economic System:** The economy was **planned and controlled by the state**. After World War II, many Eastern European countries came under Soviet influence, forming the 'socialist bloc' or the Second World, held together by the Warsaw Pact military alliance.
- **Strengths:** The Soviet economy was developed, with vast energy resources and a complex communication network. The state ensured a **minimum standard of living** for all citizens through subsidies for essential goods.
- **Weaknesses:** Over time, the system became bureaucratic and stagnant. It failed to meet the political and economic aspirations of its people, and its technology lagged behind the West.

### Gorbachev and the Disintegration
- **Mikhail Gorbachev**, who became General Secretary of the Communist Party in 1985, initiated reforms to democratize and revitalize the stagnant Soviet system.
- His key policies were **Perestroika (restructuring)** and **Glasnost (openness)**, aimed at reforming the economy and the political system.
- However, these reforms unleashed forces and expectations that were difficult to control. A wave of **nationalism and the desire for sovereignty** rose within various republics of the Soviet Union.
- A coup occurred in 1991 by Communist Party hardliners, which failed but further weakened Gorbachev's authority and accelerated the collapse. **Boris Yeltsin** emerged as a national hero for opposing the coup.
- In **December 1991**, under the leadership of Russia (Yeltsin), Ukraine, and Belarus, the Soviet Union was formally dissolved. The **Commonwealth of Independent States (CIS)** was formed as a loose successor entity.

### Reasons for the Soviet Collapse
- **Economic Stagnation:** The Soviet economy lagged behind the West for years. Severe shortages of consumer goods and massive military spending to keep up with the US in the arms race crippled the economy.
- **Political and Administrative Stagnation:** The single-party system became unaccountable and corrupt. The centralized authority was insensitive to the needs of the people in the 15 constituent republics.
- **Gorbachev’s Reforms:** While intended to save the system, Glasnost and Perestroika provided more freedom, which allowed long-suppressed nationalist feelings and discontent to surface.
- **Rise of Nationalism:** The desire for sovereignty among various republics (like Russia, the Baltic republics, Ukraine, and Georgia) was a primary and immediate cause of the disintegration.

### Consequences of Disintegration
- **End of the Cold War:** The collapse marked the end of the Cold War, the arms race, and the ideological confrontation between communism and capitalism.
- **Shift in World Power:** The bipolar world order ended, leaving the **United States as the sole superpower**, leading to a unipolar world.
- **Emergence of New Countries:** Many new countries emerged with their own independent aspirations, especially in Eastern Europe and Central Asia.
- **Shock Therapy:** Most of these newly independent countries transitioned from state-controlled socialism to democratic capitalism. This process, known as **'Shock Therapy'**, involved a rapid and radical shift to a market-based economy, which led to immense economic hardship for the general population in the initial years. It is often described as the largest garage sale in history, as valuable state assets were sold at throwaway prices.
`
    },
    hi: {
      title: 'अध्याय 2: दो ध्रुवीयता का अंत',
      content: `### सोवियत प्रणाली क्या थी?
- **गठन:** सोवियत समाजवादी गणराज्य संघ (USSR) का गठन 1917 में रूस में समाजवादी क्रांति के बाद हुआ था। यह समाजवाद के आदर्शों से प्रेरित था और पूंजीवाद का मौलिक रूप से विरोधी था।
- **राजनीतिक व्यवस्था:** यह एक **एक-दलीय व्यवस्था** थी जिस पर कम्युनिस्ट पार्टी का प्रभुत्व था। राज्य का पूर्ण नियंत्रण था, और यह प्रणाली विपक्ष या भाषण की स्वतंत्रता के लिए कोई जगह न होने के कारण सत्तावादी हो गई।
- **आर्थिक व्यवस्था:** अर्थव्यवस्था **राज्य द्वारा नियोजित और नियंत्रित** थी। द्वितीय विश्व युद्ध के बाद, कई पूर्वी यूरोपीय देश सोवियत प्रभाव में आ गए, जिन्होंने 'समाजवादी गुट' या दूसरी दुनिया का गठन किया, जो वारसा संधि सैन्य गठबंधन द्वारा एक साथ बंधे हुए थे।
- **ताकत:** सोवियत अर्थव्यवस्था विकसित थी, जिसमें विशाल ऊर्जा संसाधन और एक जटिल संचार नेटवर्क था। राज्य ने आवश्यक वस्तुओं पर सब्सिडी के माध्यम से सभी नागरिकों के लिए **न्यूनतम जीवन स्तर** सुनिश्चित किया।
- **कमजोरियां:** समय के साथ, यह प्रणाली नौकरशाही और स्थिर हो गई। यह अपने लोगों की राजनीतिक और आर्थिक आकांक्षाओं को पूरा करने में विफल रही, और इसकी तकनीक पश्चिम से पीछे रह गई।

### गोर्बाचेव और विघटन
- **मिखाइल गोर्बाचेव**, जो 1985 में कम्युनिस्ट पार्टी के महासचिव बने, ने स्थिर सोवियत प्रणाली को लोकतांत्रिक बनाने और पुनर्जीवित करने के लिए सुधार शुरू किए।
- उनकी प्रमुख नीतियां **पेरेस्त्रोइका (पुनर्गठन)** और **ग्लास्नोस्त (खुलापन)** थीं, जिनका उद्देश्य अर्थव्यवस्था और राजनीतिक व्यवस्था में सुधार करना था।
- हालांकि, इन सुधारों ने ऐसी ताकतों और अपेक्षाओं को जन्म दिया जिन्हें नियंत्रित करना मुश्किल था। सोवियत संघ के विभिन्न गणराज्यों के भीतर **राष्ट्रवाद और संप्रभुता की इच्छा** की लहर उठी।
- 1991 में कम्युनिस्ट पार्टी के कट्टरपंथियों द्वारा एक तख्तापलट हुआ, जो विफल रहा लेकिन गोर्बाचेव के अधिकार को और कमजोर कर दिया और पतन को तेज कर दिया। **बोरिस येल्तसिन** तख्तापलट का विरोध करने के लिए एक राष्ट्रीय नायक के रूप में उभरे।
- **दिसंबर 1991 में**, रूस (येल्तसिन), यूक्रेन और बेलारूस के नेतृत्व में, सोवियत संघ को औपचारिक रूप से भंग कर दिया गया। **स्वतंत्र राज्यों के राष्ट्रमंडल (CIS)** को एक ढीले उत्तराधिकारी इकाई के रूप में बनाया गया।

### सोवियत पतन के कारण
- **आर्थिक ठहराव:** सोवियत अर्थव्यवस्था वर्षों तक पश्चिम से पीछे रही। उपभोक्ता वस्तुओं की गंभीर कमी और हथियारों की दौड़ में अमेरिका के साथ बने रहने के लिए बड़े पैमाने पर सैन्य खर्च ने अर्थव्यवस्था को पंगु बना दिया।
- **राजनीतिक और प्रशासनिक ठहराव:** एक-दलीय प्रणाली गैर-जवाबदेह और भ्रष्ट हो गई। केंद्रीकृत प्राधिकरण 15 घटक गणराज्यों में लोगों की जरूरतों के प्रति असंवेदनशील था।
- **गोर्बाचेव के सुधार:** जबकि प्रणाली को बचाने का इरादा था, ग्लास्नोस्त और पेरेस्त्रोइका ने अधिक स्वतंत्रता प्रदान की, जिससे लंबे समय से दमित राष्ट्रवादी भावनाओं और असंतोष को सतह पर आने दिया।
- **राष्ट्रवाद का उदय:** विभिन्न गणराज्यों (जैसे रूस, बाल्टिक गणराज्य, यूक्रेन और जॉर्जिया) के बीच संप्रभुता की इच्छा विघटन का एक प्राथमिक और तत्काल कारण था।

### विघटन के परिणाम
- **शीत युद्ध का अंत:** पतन ने शीत युद्ध, हथियारों की दौड़ और साम्यवाद और पूंजीवाद के बीच वैचारिक टकराव के अंत को चिह्नित किया।
- **विश्व शक्ति में बदलाव:** द्विध्रुवीय विश्व व्यवस्था समाप्त हो गई, जिससे **संयुक्त राज्य अमेरिका एकमात्र महाशक्ति** बन गया, जिससे एकध्रुवीय दुनिया का उदय हुआ।
- **नए देशों का उदय:** कई नए देश अपनी स्वतंत्र आकांक्षाओं के साथ उभरे, विशेष रूप से पूर्वी यूरोप और मध्य एशिया में।
- **शॉक थेरेपी:** इनमें से अधिकांश नए स्वतंत्र देश राज्य-नियंत्रित समाजवाद से लोकतांत्रिक पूंजीवाद में परिवर्तित हो गए। इस प्रक्रिया को **'शॉक थेरेपी'** के रूप में जाना जाता है, जिसमें बाजार-आधारित अर्थव्यवस्था में तेजी से और कट्टरपंथी बदलाव शामिल था, जिससे शुरुआती वर्षों में आम आबादी के लिए भारी आर्थिक कठिनाई हुई। इसे अक्सर इतिहास की सबसे बड़ी गैराज सेल के रूप में वर्णित किया जाता है, क्योंकि मूल्यवान राज्य संपत्ति को कौड़ियों के भाव बेच दिया गया था।
`
    }
  },
    'us-hegemony-in-world-politics': {
    en: {
      title: 'Chapter 3: US Hegemony in World Politics',
      content: `### Beginning of the 'New World Order'
- The sudden collapse of the Soviet Union left the **US as the sole superpower**. This marked the beginning of a unipolar world, dominated by the US.
- The term 'New World Order' was used by then-US President **George H. W. Bush** to describe this new era of American dominance.

### The First Gulf War (Operation Desert Storm)
- **Background:** In August 1990, **Iraq invaded Kuwait**. After diplomatic attempts failed, the United Nations mandated the liberation of Kuwait.
- **The War:** This was a massive coalition operation of forces from **34 countries**, led by the US. It was known as **Operation Desert Storm**.
- **Technological Gap:** The war revealed the vast technological gap between the US military and other states. The use of 'smart bombs' led some to call it a **'computer war'**. The worldwide television coverage made it a **'video game war'**.
- **Outcome:** Iraq was defeated and forced to withdraw from Kuwait. The war established US military and technological supremacy.

### The Clinton Years and Soft Power
- Despite winning the First Gulf War, George H. W. Bush lost the 1992 presidential election to **Bill Clinton**.
- The Clinton administration focused more on **'soft issues'** like democracy promotion, climate change, and world trade, rather than 'hard politics' of military power.
- However, the US still showed its military readiness during this period, for example, with the bombing of Yugoslavia in 1999 over the Kosovo issue.

### 9/11 and the 'Global War on Terror'
- **The Attacks:** On **September 11, 2001**, nineteen hijackers from the terrorist group **Al-Qaeda** crashed four commercial airplanes into the World Trade Center in New York, the Pentagon building in Virginia, and a field in Pennsylvania.
- **US Response:** The US launched the **'Global War on Terror'**. Their main target was Al-Qaeda and the **Taliban regime** in Afghanistan, which was harboring them.
- **Operation Enduring Freedom:** This was the name given to the US-led military campaign against Afghanistan. The Taliban was quickly overthrown, but a long-term insurgency began.

### The Iraq Invasion (Operation Iraqi Freedom)
- **Background:** In March 2003, the US invaded Iraq, claiming that Iraq possessed **weapons of mass destruction (WMD)**. The UN did not sanction this invasion.
- **The 'Coalition of the Willing':** The US led a coalition of more than 40 countries, but the real objective was widely believed to be controlling Iraqi oil fields and installing a friendly regime.
- **Outcome:** Saddam Hussein's government was toppled, but no WMDs were ever found. The invasion led to a prolonged and bloody insurgency against US forces, resulting in massive casualties and instability in the region.

### What is Hegemony?
- Hegemony means the leadership or dominance of one state over others. US hegemony is not just about military power.
- **Hegemony as Hard Power:** This is about military might. The US military is technologically advanced and has a global reach with bases all over the world.
- **Hegemony as Structural Power:** This refers to control over the world economy. The US provides **global public goods** like the Sea Lanes of Communication (SLOCs) and the Internet. Key economic institutions like the **World Bank, IMF, and WTO** are dominated by the US. The **US dollar** is the primary currency for international trade.
- **Hegemony as Soft Power:** This is about cultural and ideological influence. The US way of life, its culture (e.g., blue jeans, fast food), and its political ideals (like democracy) are influential worldwide. This is about manufacturing consent, making others want what you want.

### Constraints on American Power
- **Institutional Architecture:** The American system of government has a **separation of powers** (between the executive, legislative, and judicial branches) which can check the president's power.
- **Open Nature of American Society:** There is a deep skepticism regarding the purposes of government in American culture. This can constrain US military action.
- **NATO:** The North Atlantic Treaty Organization is the only organization that can moderate the exercise of American power, as the US has an interest in keeping the alliance of democracies together.

### India's Relationship with the US
- India's foreign policy has shifted significantly since the Cold War. It now has a more pragmatic relationship with the US.
- There are areas of cooperation (economic ties, technology) and disagreement.
- Observers debate whether India should maintain its distance from the US, take advantage of the US hegemony, or lead a coalition of countries to balance US power.
`
    },
    hi: {
      title: 'अध्याय 3: समकालीन विश्व में अमरीकी वर्चस्व',
      content: `### 'नई विश्व व्यवस्था' की शुरुआत
- सोवियत संघ के अचानक पतन ने **अमेरिका को एकमात्र महाशक्ति** के रूप में छोड़ दिया। इसने एकध्रुवीय दुनिया की शुरुआत को चिह्नित किया, जिस पर अमेरिका का प्रभुत्व था।
- 'नई विश्व व्यवस्था' शब्द का इस्तेमाल तत्कालीन अमेरिकी राष्ट्रपति **जॉर्ज एच. डब्ल्यू. बुश** ने अमेरिकी प्रभुत्व के इस नए युग का वर्णन करने के लिए किया था।

### प्रथम खाड़ी युद्ध (ऑपरेशन डेजर्ट स्टॉर्म)
- **पृष्ठभूमि:** अगस्त 1990 में, **इराक ने कुवैत पर आक्रमण किया**। राजनयिक प्रयासों के विफल होने के बाद, संयुक्त राष्ट्र ने कुवैत की मुक्ति के लिए जनादेश दिया।
- **युद्ध:** यह अमेरिका के नेतृत्व में **34 देशों** की सेनाओं का एक विशाल गठबंधन अभियान था। इसे **ऑपरेशन डेजर्ट स्टॉर्म** के नाम से जाना जाता था।
- **तकनीकी अंतर:** युद्ध ने अमेरिकी सेना और अन्य राज्यों के बीच विशाल तकनीकी अंतर को उजागर किया। 'स्मार्ट बम' के उपयोग ने कुछ लोगों को इसे **'कंप्यूटर युद्ध'** कहने पर मजबूर कर दिया। दुनिया भर में टेलीविजन कवरेज ने इसे **'वीडियो गेम युद्ध'** बना दिया।
- **परिणाम:** इराक हार गया और कुवैत से हटने के लिए मजबूर हो गया। युद्ध ने अमेरिका की सैन्य और तकनीकी सर्वोच्चता स्थापित की।

### क्लिंटन के वर्ष और सॉफ्ट पावर
- प्रथम खाड़ी युद्ध जीतने के बावजूद, जॉर्ज एच. डब्ल्यू. बुश 1992 का राष्ट्रपति चुनाव **बिल क्लिंटन** से हार गए।
- क्लिंटन प्रशासन ने सैन्य शक्ति की 'कठोर राजनीति' के बजाय लोकतंत्र को बढ़ावा देने, जलवायु परिवर्तन और विश्व व्यापार जैसे **'नरम मुद्दों'** पर अधिक ध्यान केंद्रित किया।
- हालांकि, अमेरिका ने इस अवधि के दौरान भी अपनी सैन्य तैयारी दिखाई, उदाहरण के लिए, कोसोवो मुद्दे पर 1999 में यूगोस्लाविया पर बमबारी।

### 9/11 और 'आतंक के विरुद्ध वैश्विक युद्ध'
- **हमले:** **11 सितंबर, 2001** को, आतंकवादी समूह **अल-कायदा** के उन्नीस अपहरणकर्ताओं ने न्यूयॉर्क में वर्ल्ड ट्रेड सेंटर, वर्जीनिया में पेंटागन भवन और पेंसिल्वेनिया के एक खेत में चार वाणिज्यिक विमानों को दुर्घटनाग्रस्त कर दिया।
- **अमेरिकी प्रतिक्रिया:** अमेरिका ने **'आतंक के विरुद्ध वैश्विक युद्ध'** शुरू किया। उनका मुख्य लक्ष्य अल-कायदा और अफगानिस्तान में **तालिबान शासन** था, जो उन्हें पनाह दे रहा था।
- **ऑपरेशन एंड्योरिंग फ्रीडम:** यह अफगानिस्तान के खिलाफ अमेरिका के नेतृत्व वाले सैन्य अभियान को दिया गया नाम था। तालिबान को जल्दी से उखाड़ फेंका गया, लेकिन एक दीर्घकालिक विद्रोह शुरू हो गया।

### इराक पर आक्रमण (ऑपरेशन इराकी फ्रीडम)
- **पृष्ठभूमि:** मार्च 2003 में, अमेरिका ने यह दावा करते हुए इराक पर आक्रमण किया कि इराक के पास **सामूहिक विनाश के हथियार (WMD)** हैं। संयुक्त राष्ट्र ने इस आक्रमण को मंजूरी नहीं दी।
- **'इच्छुकों का गठबंधन':** अमेरिका ने 40 से अधिक देशों के गठबंधन का नेतृत्व किया, लेकिन वास्तविक उद्देश्य व्यापक रूप से इराकी तेल क्षेत्रों को नियंत्रित करना और एक मित्रवत शासन स्थापित करना माना जाता था।
- **परिणाम:** सद्दाम हुसैन की सरकार को गिरा दिया गया, लेकिन कोई WMD कभी नहीं मिला। आक्रमण ने अमेरिकी सेनाओं के खिलाफ एक लंबे और खूनी विद्रोह को जन्म दिया, जिसके परिणामस्वरूप क्षेत्र में बड़े पैमाने पर हताहत हुए और अस्थिरता पैदा हुई।

### वर्चस्व क्या है?
- वर्चस्व का अर्थ है दूसरों पर एक राज्य का नेतृत्व या प्रभुत्व। अमेरिकी वर्चस्व केवल सैन्य शक्ति के बारे में नहीं है।
- **कठोर शक्ति के रूप में वर्चस्व:** यह सैन्य शक्ति के बारे में है। अमेरिकी सेना तकनीकी रूप से उन्नत है और दुनिया भर में ठिकानों के साथ इसकी वैश्विक पहुंच है।
- **ढांचागत शक्ति के रूप में वर्चस्व:** यह विश्व अर्थव्यवस्था पर नियंत्रण को संदर्भित करता है। अमेरिका **वैश्विक सार्वजनिक वस्तुएं** प्रदान करता है जैसे समुद्री संचार लेन (SLOCs) और इंटरनेट। **विश्व बैंक, IMF और WTO** जैसे प्रमुख आर्थिक संस्थान अमेरिका के प्रभुत्व में हैं। **अमेरिकी डॉलर** अंतर्राष्ट्रीय व्यापार के लिए प्राथमिक मुद्रा है।
- **सॉफ्ट पावर के रूप में वर्चस्व:** यह सांस्कृतिक और वैचारिक प्रभाव के बारे में है। अमेरिकी जीवन शैली, इसकी संस्कृति (जैसे, नीली जींस, फास्ट फूड), और इसके राजनीतिक आदर्श (जैसे लोकतंत्र) दुनिया भर में प्रभावशाली हैं। यह सहमति बनाने, दूसरों को वह चाहने पर मजबूर करने के बारे में है जो आप चाहते हैं।

### अमेरिकी शक्ति पर बाधाएं
- **संस्थागत ढांचा:** अमेरिकी सरकार की प्रणाली में **शक्तियों का पृथक्करण** (कार्यकारी, विधायी और न्यायिक शाखाओं के बीच) है जो राष्ट्रपति की शक्ति पर अंकुश लगा सकता है।
- **अमेरिकी समाज की खुली प्रकृति:** अमेरिकी संस्कृति में सरकार के उद्देश्यों के बारे में गहरा संदेह है। यह अमेरिकी सैन्य कार्रवाई को बाधित कर सकता है।
- **नाटो:** उत्तर अटलांटिक संधि संगठन एकमात्र संगठन है जो अमेरिकी शक्ति के प्रयोग को नियंत्रित कर सकता है, क्योंकि अमेरिका का हित लोकतंत्रों के गठबंधन को एक साथ रखने में है।

### भारत के अमेरिका के साथ संबंध
- शीत युद्ध के बाद से भारत की विदेश नीति में काफी बदलाव आया है। अब अमेरिका के साथ इसके अधिक व्यावहारिक संबंध हैं।
- सहयोग के क्षेत्र (आर्थिक संबंध, प्रौद्योगिकी) और असहमति हैं।
- पर्यवेक्षक इस बात पर बहस करते हैं कि क्या भारत को अमेरिका से अपनी दूरी बनाए रखनी चाहिए, अमेरिकी वर्चस्व का लाभ उठाना चाहिए, या अमेरिकी शक्ति को संतुलित करने के लिए देशों के गठबंधन का नेतृत्व करना चाहिए।
`
    }
  },
  'alternative-centres-of-power': {
    en: {
      title: 'Chapter 4: Alternative Centres of Power',
      content: `### European Union (EU)
- **Background:** After the end of World War II in 1945, many European leaders grappled with the question of Europe's future. The USA extended massive financial help for reviving Europe’s economy under the **Marshall Plan**. The Organisation for European Economic Co-operation (OEEC) was established in 1948 to channel aid to the west European states.
- **Formation:** The process of economic integration of European capitalist countries led to the formation of the **European Economic Community (EEC)** in 1957. The collapse of the Soviet bloc put Europe on a fast track and resulted in the establishment of the **European Union (EU) in 1992**.
- **Objectives:** The EU has evolved from an economic union to an increasingly political one. It aims for a common foreign and security policy, cooperation on justice and home affairs, and the creation of a single currency (the Euro).
- **Economic Power:** The EU is the world's biggest economy with a GDP of more than **$17 trillion** in 2016, next to that of the US. Its currency, the **Euro**, can pose a threat to the dominance of the US dollar. Its share of world trade is three times larger than that of the United States.
- **Political and Diplomatic Power:** Two members of the EU, **Britain and France**, hold permanent seats in the UN Security Council. The EU's use of diplomacy, economic investments, and negotiation has been effective, for example, in its dealings with Iran's nuclear program.
- **Military Power:** The EU’s combined armed forces are the second largest in the world. Its total spending on defence is second after the US.
- **Limitations:** Member states have their own foreign relations and defence policies that are often at odds with each other. For example, Britain's Prime Minister Tony Blair was America's partner in the Iraq invasion, while Germany and France opposed it.

### Association of Southeast Asian Nations (ASEAN)
- **Formation:** ASEAN was established in **1967** by five countries of the region – Indonesia, Malaysia, the Philippines, Singapore and Thailand – by signing the **Bangkok Declaration**.
- **Objectives:** The primary objectives of ASEAN were to accelerate economic growth and through that social progress and cultural development. A secondary objective was to promote regional peace and stability based on the rule of law and the principles of the United Nations Charter.
- **The ASEAN Way:** This is a form of interaction that is informal, non-confrontationist and cooperative.
- **ASEAN Community:** In 2003, ASEAN moved along the path of the EU by agreeing to establish an ASEAN Community comprising three pillars: the **ASEAN Security Community**, the **ASEAN Economic Community**, and the **ASEAN Socio-Cultural Community**.
- **Economic Strength:** The ASEAN economy is growing much faster than the US, EU and Japan. ASEAN has focused on creating a **Free Trade Area (FTA)** for investment, labour, and services.
- **ASEAN Regional Forum (ARF):** Established in 1994, the ARF is an organisation that carries out coordination of security and foreign policy.
- **India and ASEAN:** India has signed FTAs with three ASEAN members—Singapore, Thailand and Malaysia.

### The Rise of China as an Economic Power
- **Economic Reforms:** China has been the fastest growing economy since the reforms of 1978. It is projected to overtake the US as the world’s largest economy by 2040.
- **Shift in Policy:** After the inception of the People’s Republic of China in 1949, it followed the Soviet model of state-owned heavy industries. It was short of foreign exchange and had to substitute imports with domestic goods.
- **Ending Isolation:** China ended its political and economic isolation with the establishment of relations with the United States in 1972. Premier **Zhou Enlai** proposed the **'four modernisations'** (agriculture, industry, science and technology and military) in 1973.
- **Open Door Policy:** In 1978, the then leader **Deng Xiaoping** announced the **'open door' policy** and economic reforms in China. This was to generate higher productivity by investments of capital and technology from abroad.
- **Privatisation and SEZs:** The privatisation of agriculture in 1982 was followed by the privatisation of industry in 1998. **Special Economic Zones (SEZs)** were set up to attract foreign investors.
- **Global Influence:** China became a member of the **World Trade Organisation (WTO) in 2001**.
- **Challenges:** While the Chinese economy has improved dramatically, not everyone has received the benefits of the reforms. Unemployment has risen, and environmental degradation and corruption have increased.

### India-China Relations
- **Historical Context:** After India gained its independence, there was hope that both countries would come together to shape the future of the developing world. For a brief while, the slogan of **'Hindi-Chini bhai-bhai'** was popular.
- **1962 War:** The military conflict over the border issue in 1962 soured the relationship.
- **Improved Relations:** Relations began to improve from the late 1980s. In 1988, Prime Minister **Rajiv Gandhi's** visit to China improved the momentum of India-China relations.
- **Economic Ties:** Bilateral trade between India and China has increased from **$338 million** in 1992 to more than **$84 billion** in 2017.
- **Areas of Conflict:** Issues like the border dispute and China's strategic relations with Pakistan remain sources of irritation.
`
    },
    hi: {
      title: 'अध्याय 4: सत्ता के वैकल्पिक केंद्र',
      content: `### यूरोपीय संघ (EU)
- **पृष्ठभूमि:** 1945 में द्वितीय विश्व युद्ध की समाप्ति के बाद, कई यूरोपीय नेताओं ने यूरोप के भविष्य के सवाल से जूझना शुरू किया। अमेरिका ने **मार्शल योजना** के तहत यूरोप की अर्थव्यवस्था को पुनर्जीवित करने के लिए भारी वित्तीय सहायता प्रदान की। पश्चिमी यूरोपीय राज्यों को सहायता पहुँचाने के लिए 1948 में **यूरोपीय आर्थिक सहयोग संगठन (OEEC)** की स्थापना की गई।
- **गठन:** यूरोपीय पूंजीवादी देशों के आर्थिक एकीकरण की प्रक्रिया के कारण 1957 में **यूरोपीय आर्थिक समुदाय (EEC)** का गठन हुआ। सोवियत गुट के पतन ने यूरोप को एक तेज गति दी और इसके परिणामस्वरूप **1992 में यूरोपीय संघ (EU) की स्थापना** हुई।
- **उद्देश्य:** यूरोपीय संघ एक आर्थिक संघ से विकसित होकर एक राजनीतिक संघ बन गया है। इसका लक्ष्य एक साझा विदेश और सुरक्षा नीति, न्याय और घरेलू मामलों पर सहयोग, और एक एकल मुद्रा (यूरो) का निर्माण करना है।
- **आर्थिक शक्ति:** 2016 में **17 ट्रिलियन डॉलर** से अधिक की जीडीपी के साथ यूरोपीय संघ दुनिया की सबसे बड़ी अर्थव्यवस्था है, जो अमेरिका के बाद दूसरे स्थान पर है। इसकी मुद्रा, **यूरो**, अमेरिकी डॉलर के प्रभुत्व के लिए खतरा पैदा कर सकती है। विश्व व्यापार में इसकी हिस्सेदारी संयुक्त राज्य अमेरिका की तुलना में तीन गुना बड़ी है।
- **राजनीतिक और राजनयिक शक्ति:** यूरोपीय संघ के दो सदस्य, **ब्रिटेन और फ्रांस**, संयुक्त राष्ट्र सुरक्षा परिषद में स्थायी सीटें रखते हैं। यूरोपीय संघ की कूटनीति, आर्थिक निवेश और बातचीत का उपयोग प्रभावी रहा है, उदाहरण के लिए, ईरान के परमाणु कार्यक्रम के साथ इसके व्यवहार में।
- **सैन्य शक्ति:** यूरोपीय संघ की संयुक्त सशस्त्र सेनाएँ दुनिया में दूसरी सबसे बड़ी हैं। रक्षा पर इसका कुल खर्च अमेरिका के बाद दूसरे स्थान पर है।
- **सीमाएँ:** सदस्य देशों की अपनी विदेश संबंध और रक्षा नीतियां हैं जो अक्सर एक-दूसरे के साथ भिन्न होती हैं। उदाहरण के लिए, ब्रिटेन के प्रधानमंत्री टोनी ब्लेयर इराक पर आक्रमण में अमेरिका के भागीदार थे, जबकि जर्मनी और फ्रांस ने इसका विरोध किया।

### दक्षिण-पूर्व एशियाई राष्ट्रों का संगठन (आसियान)
- **गठन:** आसियान की स्थापना **1967** में क्षेत्र के पांच देशों - इंडोनेशिया, मलेशिया, फिलीपींस, सिंगापुर और थाईलैंड - द्वारा **बैंकॉक घोषणा** पर हस्ताक्षर करके की गई थी।
- **उद्देश्य:** आसियान के प्राथमिक उद्देश्य आर्थिक विकास को गति देना और उसके माध्यम से सामाजिक प्रगति और सांस्कृतिक विकास करना था। एक द्वितीयक उद्देश्य कानून के शासन और संयुक्त राष्ट्र चार्टर के सिद्धांतों पर आधारित क्षेत्रीय शांति और स्थिरता को बढ़ावा देना था।
- **आसियान शैली:** यह बातचीत का एक रूप है जो अनौपचारिक, गैर-टकराववादी और सहकारी है।
- **आसियान समुदाय:** 2003 में, आसियान ने तीन स्तंभों वाले एक आसियान समुदाय की स्थापना के लिए सहमत होकर यूरोपीय संघ के रास्ते पर आगे बढ़ा: **आसियान सुरक्षा समुदाय**, **आसियान आर्थिक समुदाय**, और **आसियान सामाजिक-सांस्कृतिक समुदाय**।
- **आर्थिक ताकत:** आसियान की अर्थव्यवस्था अमेरिका, यूरोपीय संघ और जापान की तुलना में बहुत तेजी से बढ़ रही है। आसियान ने निवेश, श्रम और सेवाओं के लिए एक **मुक्त व्यापार क्षेत्र (FTA)** बनाने पर ध्यान केंद्रित किया है।
- **आसियान क्षेत्रीय मंच (ARF):** 1994 में स्थापित, ARF एक ऐसा संगठन है जो सुरक्षा और विदेश नीति का समन्वय करता है।
- **भारत और आसियान:** भारत ने तीन आसियान सदस्यों - सिंगापुर, थाईलैंड और मलेशिया के साथ एफटीए पर हस्ताक्षर किए हैं।

### एक आर्थिक शक्ति के रूप में चीन का उदय
- **आर्थिक सुधार:** 1978 के सुधारों के बाद से चीन सबसे तेजी से बढ़ती अर्थव्यवस्था रहा है। यह 2040 तक दुनिया की सबसे बड़ी अर्थव्यवस्था के रूप में अमेरिका को पछाड़ने का अनुमान है।
- **नीति में बदलाव:** 1949 में पीपुल्स रिपब्लिक ऑफ चाइना की स्थापना के बाद, इसने राज्य के स्वामित्व वाले भारी उद्योगों के सोवियत मॉडल का पालन किया। इसके पास विदेशी मुद्रा की कमी थी और उसे घरेलू सामानों के साथ आयातों को प्रतिस्थापित करना पड़ा।
- **अलगाव का अंत:** चीन ने 1972 में संयुक्त राज्य अमेरिका के साथ संबंधों की स्थापना के साथ अपने राजनीतिक और आर्थिक अलगाव को समाप्त कर दिया। प्रधानमंत्री **झोउ एनलाई** ने 1973 में **'चार आधुनिकीकरण'** (कृषि, उद्योग, विज्ञान और प्रौद्योगिकी और सैन्य) का प्रस्ताव रखा।
- **'खुले द्वार' की नीति:** 1978 में, तत्कालीन नेता **डेंग शियाओपिंग** ने चीन में **'खुले द्वार' की नीति** और आर्थिक सुधारों की घोषणा की। यह विदेशों से पूंजी और प्रौद्योगिकी के निवेश द्वारा उच्च उत्पादकता उत्पन्न करने के लिए था।
- **निजीकरण और SEZ:** 1982 में कृषि के निजीकरण के बाद 1998 में उद्योग का निजीकरण हुआ। विदेशी निवेशकों को आकर्षित करने के लिए **विशेष आर्थिक क्षेत्र (SEZ)** स्थापित किए गए।
- **वैश्विक प्रभाव:** चीन 2001 में **विश्व व्यापार संगठन (WTO)** का सदस्य बना।
- **चुनौतियाँ:** जबकि चीनी अर्थव्यवस्था में नाटकीय रूप से सुधार हुआ है, हर किसी को सुधारों का लाभ नहीं मिला है। बेरोजगारी बढ़ी है, और पर्यावरण क्षरण और भ्रष्टाचार में वृद्धि हुई है।

### भारत-चीन संबंध
- **ऐतिहासिक संदर्भ:** भारत को स्वतंत्रता मिलने के बाद, यह आशा थी कि दोनों देश विकासशील दुनिया के भविष्य को आकार देने के लिए एक साथ आएंगे। कुछ समय के लिए, **'हिंदी-चीनी भाई-भाई'** का नारा लोकप्रिय था।
- **1962 का युद्ध:** 1962 में सीमा मुद्दे पर सैन्य संघर्ष ने संबंधों को खराब कर दिया।
- **सुधारित संबंध:** 1980 के दशक के अंत से संबंधों में सुधार होना शुरू हुआ। 1988 में, प्रधानमंत्री **राजीव गांधी** की चीन यात्रा ने भारत-चीन संबंधों की गति में सुधार किया।
- **आर्थिक संबंध:** भारत और चीन के बीच द्विपक्षीय व्यापार 1992 में **338 मिलियन डॉलर** से बढ़कर 2017 में **84 बिलियन डॉलर** से अधिक हो गया है।
- **संघर्ष के क्षेत्र:** सीमा विवाद और पाकिस्तान के साथ चीन के रणनीतिक संबंध जैसे मुद्दे जलन के स्रोत बने हुए हैं।
`
    }
  },
  'contemporary-south-asia': {
    en: {
      title: 'Chapter 5: Contemporary South Asia',
      content: 'This chapter provides an overview of the political dynamics in South Asia. It covers the experiences of democracy, conflict, and cooperation among the countries in the region.'
    },
    hi: {
      title: 'अध्याय 5: समकालीन दक्षिण एशिया',
      content: 'यह अध्याय दक्षिण एशिया में राजनीतिक गतिशीलता का अवलोकन प्रदान करता है। इसमें क्षेत्र के देशों के बीच लोकतंत्र, संघर्ष और सहयोग के अनुभवों को शामिल किया गया है।'
    }
  },
  'international-organisations': {
    en: {
      title: 'Chapter 6: International Organisations',
      content: 'This chapter discusses the role of international organizations in world politics, with a special focus on the United Nations. It assesses their relevance and effectiveness in the contemporary world.'
    },
    hi: {
      title: 'अध्याय 6: अंतर्राष्ट्रीय संगठन',
      content: 'यह अध्याय विश्व राजनीति में अंतरराष्ट्रीय संगठनों की भूमिका पर चर्चा करता है, जिसमें संयुक्त राष्ट्र पर विशेष ध्यान दिया गया है। यह समकालीन दुनिया में उनकी प्रासंगिकता और प्रभावशीलता का आकलन करता है।'
    }
  },
  'security-in-the-contemporary-world': {
    en: {
      title: 'Chapter 7: Security in the Contemporary World',
      content: 'This chapter explores the concept of security in the contemporary world, covering both traditional and non-traditional threats. It discusses issues like terrorism, human rights, and global poverty.'
    },
    hi: {
      title: 'अध्याय 7: समकालीन विश्व में सुरक्षा',
      content: 'यह अध्याय पारंपरिक और गैर-पारंपरिक दोनों खतरों को कवर करते हुए समकालीन दुनिया में सुरक्षा की अवधारणा की पड़ताल करता है। इसमें आतंकवाद, मानवाधिकार और वैश्विक गरीबी जैसे मुद्दों पर चर्चा की गई है।'
    }
  },
  'environment-and-natural-resources': {
    en: {
      title: 'Chapter 8: Environment and Natural Resources',
      content: 'This chapter deals with the growing significance of environmental issues and natural resources in global politics. It highlights global environmental concerns and efforts to address them.'
    },
    hi: {
      title: 'अध्याय 8: पर्यावरण और प्राकृतिक संसाधन',
      content: 'यह अध्याय वैश्विक राजनीति में पर्यावरणीय मुद्दों और प्राकृतिक संसाधनों के बढ़ते महत्व से संबंधित है। यह वैश्विक पर्यावरणीय चिंताओं और उन्हें दूर करने के प्रयासों पर प्रकाश डालता है।'
    }
  },
  'globalisation': {
    en: {
      title: 'Chapter 9: Globalisation',
      content: 'This chapter explains the concept of globalization, its causes, and its consequences in various spheres. It critically assesses the impact of globalization on different parts of the world.'
    },
    hi: {
      title: 'अध्याय 9: वैश्वीकरण',
      content: 'यह अध्याय वैश्वीकरण की अवधारणा, इसके कारणों और विभिन्न क्षेत्रों में इसके परिणामों की व्याख्या करता है। यह दुनिया के विभिन्न हिस्सों पर वैश्वीकरण के प्रभाव का आलोचनात्मक मूल्यांकन करता है।'
    }
  },
    'challenges-of-nation-building': {
    en: {
      title: 'Chapter 1: Challenges of Nation Building',
      content: `### India's Independence
- At the midnight of 14-15 August 1947, India became independent.
- Jawaharlal Nehru, the first Prime Minister of free India, addressed a special session of the Constituent Assembly that night. This speech was known as the **'Tryst with Destiny'**.
- During the freedom struggle, there was consensus on two things: first, that after independence, the country would be governed democratically.
- Second, that the government would work for the good of all sections of society (with special attention to the poor and weak).

### Two-Nation Theory
- This theory was adopted by the **Muslim League**. According to this theory, India was not one nation but a country of two nations, Hindu and Muslim.
- For this reason, the Muslim League demanded a separate country, **Pakistan**, for Muslims. Congress opposed this theory.

### Problems of Partition
- **Geographical Division:** There was no single belt of Muslim majority areas in British India. There were two areas of concentration, one in the east and one in the west. There was no way these two parts could be joined.
- **Not all Muslim areas wanted to be in Pakistan:** **Khan Abdul Ghaffar Khan**, the undisputed leader of the North-Western Frontier Province, was staunchly opposed to the two-nation theory. His voice was ignored, and the NWFP was made to merge with Pakistan.
- **Division of Punjab and Bengal:** These two provinces also had very large areas where the non-Muslims were in a majority. Eventually, it was decided that these two provinces would be bifurcated.
- **Problem of Minorities:** On both sides of the border lay large populations of minorities. The areas that were now in Pakistan had lakhs of Hindu and Sikh population. Similarly, the Indian territory of Punjab and Bengal had lakhs of Muslim population. These people feared what would become of them.

### Consequences of Partition
- The country was divided in the name of religion, which led to riots on both sides.
- Women were abducted, forcibly married, and made to convert their religion.
- In many cases, family members themselves killed their own women to protect the 'family honour'.
- People had to live in refugee camps.

### Challenges of Nation Building
- Free India faced three major challenges. The first and the immediate challenge was **to shape a nation that was united**, yet accommodative of the diversity in our society.
- **Integrity and Unity:** India, in its size and diversity, was like a continent. There were people speaking different languages, with different cultures, and followers of different religions. Uniting them all was a huge challenge.
- **Establishment of Democracy:** The second challenge was to establish democracy. The Indian Constitution **guaranteed fundamental rights** and gave every citizen the right to vote. India adopted a representative democracy based on the parliamentary form of government.
- **Development:** The third challenge was to ensure the development and well-being of the entire society and not only of some sections. The Constitution made it clear that everyone would be treated equally and that socially disadvantaged groups and religious and cultural minority communities would be given special protection.

### Problem of Princely States
- At the time of independence, there were **565 princely states** in India, big and small.
- The rulers of the princely states were given the freedom by the British government to join either India or Pakistan or to maintain their independent existence.
- The right to take this decision was given to the king, not the people.
- It was India's good fortune that a visionary statesman like **Sardar Patel** took on the task of reorganizing the Indian states in that difficult time.
- The rulers of most of the princely states signed a document called the **'Instrument of Accession'** which meant that their state agreed to become a part of the Union of India.

### Reorganisation of States
- **Vishalandhra Movement:** This movement was for a separate state of **Andhra Pradesh** for Telugu-speaking areas. Congress leader **Potti Sriramulu** went on an indefinite fast that led to his death. Finally, in December 1952, the Prime Minister announced the formation of a separate Andhra state.
- **States Reorganisation Commission:** The Central Government set up the **States Reorganisation Commission** in 1953. On the basis of its report, the **States Reorganisation Act** was passed in 1956. This led to the creation of 14 states and 6 union territories.
`
    },
    hi: {
      title: 'अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ',
      content: `### भारत की आज़ादी
- 14-15 अगस्त 1947 की मध्य रात्रि को भारत आज़ाद हुआ।
- जवाहरलाल नेहरू, स्वतंत्र भारत के प्रथम प्रधानमंत्री, ने इस रात संविधान सभा के एक विशेष सत्र को सम्बोधित किया। उनका यह भाषण **'भाग्यवधू से चिर-प्रतीक्षित भेंट'** या **'ट्रिस्ट विद डेस्टिनी'** के नाम से जाना गया।
- आज़ादी की लड़ाई के समय दो बातों पर सबकी सहमति थी: पहली, कि आज़ादी के बाद देश का शासन लोकतांत्रिक तरीके से चलाया जाएगा।
- दूसरी, कि सरकार समाज के सभी वर्गों के लिए कार्य करेगी (गरीब और कमजोर लोगों का विशेष ध्यान रखेगी)।

### द्विराष्ट्र सिद्धांत
- इस सिद्धांत को **मुस्लिम लीग** ने अपनाया था। इस सिद्धांत के अनुसार भारत किसी एक कौम का नहीं बल्कि हिंदू और मुसलमान नाम की दो कौमों का देश था।
- इसी कारण मुस्लिम लीग ने मुसलमानों के लिए एक अलग देश **पाकिस्तान** की मांग की। कांग्रेस ने इस सिद्धांत का विरोध किया।

### विभाजन की समस्या
- **भौगोलिक विभाजन:** भारत में ऐसा कोई क्षेत्र नहीं था जहाँ मुसलमान बहुसंख्यक हों। केवल दो क्षेत्र थे, एक पूर्व में और एक पश्चिम में, जहाँ मुसलमान बहुसंख्यक थे। ऐसा कोई तरीका नहीं था जिससे इन दोनों क्षेत्रों को जोड़ा जा सके।
- **सभी मुस्लिम क्षेत्र पाकिस्तान में जाने को राज़ी नहीं थे:** पश्चिमोत्तर सीमा प्रांत के निर्विवाद नेता **खान अब्दुल गफ्फार खान** द्विराष्ट्र सिद्धांत के एकदम खिलाफ थे। उनकी आवाज को अनसुना कर दिया गया और पश्चिमोत्तर सीमा प्रांत को पाकिस्तान में शामिल कर लिया गया।
- **पंजाब और बंगाल का विभाजन:** इन दोनों राज्यों में भी बहुसंख्यक गैर-मुस्लिम थे। ऐसे में इन दोनों राज्यों का भी बंटवारा किया गया।
- **अल्पसंख्यकों की समस्या:** सीमा के दोनों तरफ अल्पसंख्यक थे। जो क्षेत्र अब पाकिस्तान में थे, वहां लाखों की संख्या में हिंदू और सिख थे। इसी तरह पंजाब और बंगाल के भारतीय भूभाग में भी लाखों की संख्या में मुस्लिम आबादी थी। इन लोगों के मन में यह डर था कि अब हमारा क्या होगा?

### विभाजन के परिणाम
- देश का बंटवारा धर्म के नाम पर हुआ था, इसीलिए दोनों तरफ दंगे हुए।
- औरतों को अगवा किया गया, जबरन शादी कर धर्म बदलवाया गया।
- कई मामलों में तो खुद परिवार के लोगों ने अपनी 'कुल की इज्जत' बचाने के लिए घर की बहू-बेटियों को मार डाला।
- लोगों को शरणार्थी शिविरों में जीवन बिताना पड़ा।

### राष्ट्र निर्माण की चुनौतियां
- स्वतंत्र भारत के सामने तीन मुख्य चुनौतियां थीं। पहली और तात्कालिक चुनौती **एकता के सूत्र में बंधे एक ऐसे भारत को गढ़ने की थी**, जिसमें भारतीय समाज की सारी विविधताओं के लिए स्थान हो।
- **अखंडता और एकता:** भारत अपने आकार और विविधता में किसी महादेश के बराबर था। यहां अलग-अलग बोली बोलने वाले लोग थे, उनकी संस्कृति अलग थी और वे अलग-अलग धर्मों के अनुयाई थे। इन सभी को एकजुट करना एक बहुत बड़ी चुनौती थी।
- **लोकतंत्र की स्थापना:** दूसरी चुनौती लोकतंत्र को कायम करने की थी। भारतीय संविधान में **मौलिक अधिकारों की गारंटी** दी गई है और हर नागरिक को मतदान का अधिकार दिया गया है। भारत ने संसदीय शासन पर आधारित प्रतिनिधित्वमूलक लोकतंत्र को अपनाया।
- **विकास:** तीसरी चुनौती ऐसे विकास की थी जिससे समूचे समाज का भला होता हो, न कि कुछ एक वर्गों का। संविधान में यह बात साफ कर दी गई थी कि सबके साथ समानता का बर्ताव किया जाएगा और सामाजिक रूप से वंचित वर्गों तथा धार्मिक-सांस्कृतिक अल्पसंख्यक समुदायों को विशेष सुरक्षा दी जाएगी।

### रजवाड़ों की समस्या
- आजादी के समय भारत में छोटे-बड़े **565 रजवाड़े** थे।
- रजवाड़ों के शासकों को ब्रिटिश सरकार ने यह आजादी दी कि वे चाहे तो भारत में शामिल हों या पाकिस्तान में, या चाहे तो अपना स्वतंत्र अस्तित्व भी बनाए रख सकते हैं।
- यह फैसला लेने का अधिकार राजा को दिया गया था, न कि प्रजा को।
- भारत का यह सौभाग्य था कि **सरदार पटेल** जैसे दूरदर्शी राजनेता ने उस कठिन घड़ी में भारतीय राज्यों के पुनर्गठन का बीड़ा उठाया।
- अधिकतर रजवाड़ों के शासकों ने भारतीय संघ में अपने विलय के एक सहमति पत्र पर हस्ताक्षर किए थे। इस सहमति पत्र को **'इंस्ट्रूमेंट आफ एक्सेशन'** कहा जाता है।

### राज्यों का पुनर्गठन
- **विशालान्ध्र आंदोलन:** यह आंदोलन तेलुगु भाषी क्षेत्रों के लिए एक अलग राज्य **आंध्र प्रदेश** बनाने के लिए था। कांग्रेस के नेता **पोट्टी श्रीरामुलु** अनिश्चितकालीन भूख हड़ताल पर बैठ गए, जिससे उनकी मृत्यु हो गई। आखिरकार, दिसंबर 1952 में प्रधानमंत्री ने एक अलग आंध्र राज्य बनाने की घोषणा की।
- **राज्य पुनर्गठन आयोग:** केंद्र सरकार ने 1953 में **राज्य पुनर्गठन आयोग** बनाया। इस आयोग की रिपोर्ट के आधार पर 1956 में **राज्य पुनर्गठन अधिनियम** पास हुआ। इस अधिनियम के आधार पर 14 राज्य और 6 केंद्र शासित प्रदेश बनाए गए।
`
    }
  },
  'era-of-one-party-dominance': {
    en: {
      title: 'Chapter 2: Era of One-Party Dominance',
      content: 'This chapter discusses the dominance of the Congress party in the first three general elections in India. It analyzes the factors responsible for this dominance and the nature of opposition parties.'
    },
    hi: {
      title: 'अध्याय 2: एक दल के प्रभुत्व का दौर',
      content: `### लोकतंत्र स्थापित करने की चुनौती
- पहली समस्या का सामना करने के बाद भारत के सामने दूसरी मुख्य समस्या लोकतंत्र स्थापित करने की थी। 15 अगस्त 1947 में आज़ादी प्राप्त करने के बाद भारत ने संविधान निर्माण की प्रक्रिया को पूरा किया।
- **संविधान निर्माण:** भारतीय संविधान को बनने में 2 साल 11 महीने और 18 दिनों का समय लगा।
- **लागू होना:** भारतीय संविधान 26 नवंबर 1949 को बन कर पूरा हुआ और 26 जनवरी 1950 को लागू कर दिया गया।
- संविधान लागु होने के बाद सबसे बड़ा काम था लोकतंत्र की स्थापना करना।

### चुनाव आयोग की स्थापना
- जनवरी 1950 में चुनाव आयोग की स्थापना की गई और **सुकुमार सेन** देश के पहले चुनाव आयुक्त बने।

### चुनाव करवाने की चुनौतियाँ
- देश में चुनाव करवाना किसी चुनौती से कम नहीं था। ऐसा इसीलिए था क्योंकि:
- **साक्षरता:** देश में केवल 16 प्रतिशत लोग ही पढ़े लिखे थे।
- **गरीबी:** देश की अधिकांश जनसँख्या गरीबी से जूझ रही थी।
- **संसाधनों का आभाव:** संचार के साधनों एवं प्रौद्योगिकी का आभाव था।
- **विशाल मतदाता:** 17 करोड़ मतदाताओं द्वारा 3200 विधायक और 489 सांसद चुने जाने थे।
- **चुनाव क्षेत्रों का निर्धारण:** चुनाव क्षेत्रों का निर्धारण किया जाना था।

### भारत का पहला आम चुनाव (1952)
- देश में पहले आम चुनाव करवाने के लिए:
- - लगभग 3 लाख लोगो को प्रशिक्षित किया गया।
- - चुनाव क्षेत्रों का सीमांकन किया गया।
- - मतदाता सूची बनाई गई (प्रत्येक व्यक्ति जो 21 वर्ष से अधिक आयु का था)।
- - देश में चुनाव प्रचार शुरू हुआ।

### पहले तीन चुनावों में कांग्रेस का प्रभुत्व
- इस पहले चुनाव में भारतीय राष्ट्रीय कांग्रेस ने कुल 489 सीटों में से **364 सीटें** जीती।
- कम्युनिस्ट पार्टी ऑफ इंडिया 16 सीटें जीतकर दूसरे स्थान पर रही।
- भारत में पहले तीन आम चुनाव (1952, 1957, 1962) में भारतीय राष्ट्रीय कांग्रेस का दबदबा रहा।

### कांग्रेस के प्रभुत्व के कारण
- **सबसे पुरानी पार्टी होना:** स्वतंत्रता संग्राम में मुख्य भूमिका।
- **सबसे मजबूत संगठन:** पूरे देश में फैला हुआ था।
- **बड़े नेता:** कई बड़े और मुख्य नेता कांग्रेस में थे।
- **सभी वर्गों का समर्थन:** सभी वर्गों का समर्थन प्राप्त था।

### मुख्य विपक्षी पार्टियां
- **सोशलिस्ट पार्टी:** 1934 में कांग्रेस के भीतर ही जयप्रकाश नारायण और राम मनोहर लोहिया जैसे नेताओं द्वारा गठित।
- **कम्युनिस्ट पार्टी ऑफ इंडिया:** 1920 के दशक में रूस में हुई बोल्शेविक क्रांति से प्रेरित।
- **स्वतंत्र पार्टी:** अगस्त 1959 में गठित, जिसने सरकार के अर्थव्यवस्था में हस्तक्षेप का विरोध किया।
- **भारतीय जनसंघ:** 1951 में श्यामा प्रसाद मुखर्जी द्वारा गठित, जिसने एक देश, एक संस्कृति और एक राष्ट्र पर जोर दिया।
`
    }
  },
  'politics-of-planned-development': {
    en: {
      title: 'Chapter 3: Politics of Planned Development',
      content: `### Ideas of Development
- After independence, India had two models of development to choose from: the liberal-capitalist model (like in the USA) and the socialist model (like in the USSR).
- **Jawaharlal Nehru** and many other leaders preferred the **socialist model**, but not the authoritarian version of the USSR. They favored a **'mixed economy'** where both private and public sectors would coexist.
- **Development** meant both economic growth and social and economic justice. The goal was to lift people out of poverty and create a modern, industrial nation.

### Planning Commission and Five Year Plans
- The **Planning Commission** was established in **March 1950** with the Prime Minister as its chairperson. It was the central body for making plans for India's development.
- India adopted the system of **Five Year Plans (FYPs)**, an idea borrowed from the Soviet Union.
- The budget was divided into **Plan Budget** (for new projects and development) and **Non-Plan Budget** (for routine annual expenses).

### First Five Year Plan (1951-1956)
- **Main Focus:** The primary focus was on the **agricultural sector**.
- **Key Goals:** To address food shortages, control inflation, and build infrastructure for agriculture like irrigation and power projects.
- **Key Economist:** **K. N. Raj** argued that India should 'hasten slowly' for the first two decades.
- **Major Projects:** Huge investments were made in large-scale projects like the **Bhakra Nangal Dam**.
- **Outcome:** The plan was largely successful in achieving its targets for agricultural growth.

### Second Five Year Plan (1956-1961)
- **Main Focus:** A major shift towards **heavy industries** and rapid industrialization.
- **Key Economist:** The plan was based on the model developed by **P.C. Mahalanobis**.
- **Key Goals:** To build a strong industrial base, develop public sector enterprises, and impose tariffs on imports to protect domestic industries.
- **Outcome:** While it laid the foundation for India's industrial development, it faced problems like foreign exchange shortages and rising inflation.

### Key Controversies
- **Agriculture vs. Industry:** Many critics, like Gandhian economist **J. C. Kumarappa**, argued that the Second Plan neglected agriculture and rural India, which could lead to food crises.
- **Public vs. Private Sector:** The plan's reliance on a large public sector was criticized by those who favored a more open, private-sector-led economy. They argued that state control created inefficiency and corruption.

### Major Outcomes and Legacy
- **Foundations of Growth:** The planning era laid the foundation for India's future economic growth by creating key infrastructure like dams, power plants, and heavy industries.
- **Land Reforms:** Several land reform measures were undertaken, such as the abolition of the zamindari system, but they were not fully successful.
- **The Green Revolution (late 1960s):** To overcome food shortages, the government focused on high-yield variety (HYV) seeds, fertilizers, and irrigation. It led to a massive increase in the production of wheat and rice, making India self-sufficient.
- **The White Revolution (Operation Flood):** This program, led by **Verghese Kurien**, created a nationwide milk grid and made India the world's largest milk producer.
`
    },
    hi: {
      title: 'अध्याय 3: नियोजित विकास की राजनीति',
      content: `### विकास की धारणाएँ
- स्वतंत्रता के बाद, भारत के पास विकास के दो मॉडल थे: उदार-पूंजीवादी मॉडल (जैसे संयुक्त राज्य अमेरिका में) और समाजवादी मॉडल (जैसे यूएसएसआर में)।
- **जवाहरलाल नेहरू** और कई अन्य नेताओं ने **समाजवादी मॉडल** को प्राथमिकता दी, लेकिन यूएसएसआर का सत्तावादी संस्करण नहीं। उन्होंने एक **'मिश्रित अर्थव्यवस्था'** का समर्थन किया जहाँ निजी और सार्वजनिक दोनों क्षेत्र सह-अस्तित्व में रहेंगे।
- **विकास** का अर्थ आर्थिक विकास और सामाजिक और आर्थिक न्याय दोनों था। लक्ष्य लोगों को गरीबी से बाहर निकालना और एक आधुनिक, औद्योगिक राष्ट्र का निर्माण करना था।

### योजना आयोग और पंचवर्षीय योजनाएँ
- **योजना आयोग** की स्थापना **मार्च 1950** में प्रधानमंत्री की अध्यक्षता में की गई थी। यह भारत के विकास के लिए योजनाएँ बनाने वाली केंद्रीय संस्था थी।
- भारत ने **पंचवर्षीय योजनाओं (FYPs)** की प्रणाली अपनाई, यह विचार सोवियत संघ से लिया गया था।
- बजट को **योजना बजट** (नई परियोजनाओं और विकास के लिए) और **गैर-योजना बजट** (नियमित वार्षिक खर्चों के लिए) में विभाजित किया गया था।

### पहली पंचवर्षीय योजना (1951-1956)
- **मुख्य फोकस:** प्राथमिक ध्यान **कृषि क्षेत्र** पर था।
- **प्रमुख लक्ष्य:** खाद्य कमी को दूर करना, मुद्रास्फीति को नियंत्रित करना और सिंचाई और बिजली परियोजनाओं जैसे कृषि के लिए बुनियादी ढांचे का निर्माण करना।
- **प्रमुख अर्थशास्त्री:** **के. एन. राज** ने तर्क दिया कि भारत को पहले दो दशकों तक 'धीरे-धीरे आगे बढ़ना' चाहिए।
- **प्रमुख परियोजनाएं:** **भाखड़ा नांगल बांध** जैसी बड़े पैमाने की परियोजनाओं में भारी निवेश किया गया।
- **परिणाम:** यह योजना कृषि विकास के अपने लक्ष्यों को प्राप्त करने में काफी हद तक सफल रही।

### दूसरी पंचवर्षीय योजना (1956-1961)
- **मुख्य फोकस:** **भारी उद्योगों** और तीव्र औद्योगिकीकरण की ओर एक बड़ा बदलाव।
- **प्रमुख अर्थशास्त्री:** यह योजना **पी. सी. महालनोबिस** द्वारा विकसित मॉडल पर आधारित थी।
- **प्रमुख लक्ष्य:** एक मजबूत औद्योगिक आधार बनाना, सार्वजनिक क्षेत्र के उद्यमों का विकास करना, और घरेलू उद्योगों की रक्षा के लिए आयातों पर शुल्क लगाना।
- **परिणाम:** यद्यपि इसने भारत के औद्योगिक विकास की नींव रखी, लेकिन इसे विदेशी मुद्रा की कमी और बढ़ती मुद्रास्फीति जैसी समस्याओं का सामना करना पड़ा।

### प्रमुख विवाद
- **कृषि बनाम उद्योग:** गांधीवादी अर्थशास्त्री **जे. सी. कुमारप्पा** जैसे कई आलोचकों ने तर्क दिया कि दूसरी योजना ने कृषि और ग्रामीण भारत की उपेक्षा की, जिससे खाद्य संकट पैदा हो सकता है।
- **सार्वजनिक बनाम निजी क्षेत्र:** एक बड़े सार्वजनिक क्षेत्र पर योजना की निर्भरता की उन लोगों द्वारा आलोचना की गई जो अधिक खुली, निजी क्षेत्र के नेतृत्व वाली अर्थव्यवस्था के पक्ष में थे। उन्होंने तर्क दिया कि राज्य के नियंत्रण ने अक्षमता और भ्रष्टाचार पैदा किया।

### प्रमुख परिणाम और विरासत
- **विकास की नींव:** योजना युग ने बांधों, बिजली संयंत्रों और भारी उद्योगों जैसे प्रमुख बुनियादी ढांचे का निर्माण करके भारत के भविष्य के आर्थिक विकास की नींव रखी।
- **भूमि सुधार:** ज़मींदारी प्रथा के उन्मूलन जैसे कई भूमि सुधार उपाय किए गए, लेकिन वे पूरी तरह से सफल नहीं हुए।
- **हरित क्रांति (1960 के दशक के अंत में):** खाद्य कमी को दूर करने के लिए, सरकार ने उच्च उपज वाली किस्म (HYV) के बीज, उर्वरकों और सिंचाई पर ध्यान केंद्रित किया। इससे गेहूं और चावल के उत्पादन में भारी वृद्धि हुई, जिससे भारत आत्मनिर्भर हो गया।
- **श्वेत क्रांति (ऑपरेशन फ्लड):** **वर्गीज कुरियन** के नेतृत्व में इस कार्यक्रम ने एक राष्ट्रव्यापी दूध ग्रिड बनाया और भारत को दुनिया का सबसे बड़ा दूध उत्पादक बनाया।
`
    }
  },
  'indias-external-relations': {
    en: {
      title: 'Chapter 4: India’s External Relations',
      content: `### The International Context
- India was born into a very challenging international context, marked by the devastation of World War II and the beginning of the **Cold War** between the two superpowers: the USA (leading the Western alliance) and the Soviet Union (leading the Eastern alliance).
- The world was being divided into these two camps. India's leadership was determined to carve its own path and not be a pawn in the games of these powerful blocs.

### The Policy of Non-Alignment (NAM)
- **What is it?:** Non-Alignment was the cornerstone of India's foreign policy. It meant staying away from the military alliances formed by the USA and the USSR. **Jawaharlal Nehru**, as the first Prime Minister and Foreign Minister, was the chief architect of this policy.
- **Why did India adopt it?:**
- - **To protect sovereignty:** By not joining either bloc, India could make its own decisions without pressure from a superpower.
- - **To focus on development:** India's priority was to overcome poverty and develop its economy, not get entangled in military conflicts.
- - **To play an active role:** Non-alignment was not about isolation. It was about actively participating in world affairs to reduce Cold War tensions and promote peace.
- **The Bandung Conference (1955):** This Afro-Asian conference was a key moment in the establishment of the Non-Aligned Movement. The first NAM summit was held in **Belgrade in 1961**.

### Relations with China
- **Initial Friendship:** In the beginning, India and China had a friendly relationship, based on the slogan **'Hindi-Chini Bhai-Bhai'**.
- **Panchsheel (1954):** Nehru and Chinese Premier Zhou Enlai signed the **Panchsheel Agreement**, the Five Principles of Peaceful Coexistence.
- **The Tibet Issue:** The relationship soured when China annexed Tibet in 1950. When the Dalai Lama was given asylum in India in 1959, China accused India of interfering.
- **The 1962 War:** China launched a swift and massive invasion in October 1962 over a border dispute. The Indian army was unprepared and suffered a major defeat. This war had a lasting impact on India's foreign policy and military modernization.

### Relations with Pakistan
- **Conflict from the start:** The relationship has been marked by conflict and suspicion right from the partition, especially over the issue of **Kashmir**.
- **The 1947-48 War:** This was the first conflict over Kashmir, which led to the division of the state.
- **The 1965 War:** A second war was fought over Kashmir, which ended in a stalemate and the **Tashkent Agreement**.
- **The 1971 War and the Birth of Bangladesh:** India supported the freedom struggle of Bangladesh, leading to a decisive victory for the Indian army and the creation of Bangladesh. This was followed by the **Shimla Agreement**.
- **The Kargil Conflict (1999):** India won a conflict to reclaim strategic high points captured by Pakistani forces on the Indian side of the Line of Control (LoC).

### India's Nuclear Policy
- India's nuclear policy has been guided by the principle of **'No First Use'**.
- India refused to sign the Nuclear Non-Proliferation Treaty (NPT) of 1968, calling it discriminatory.
- **First Nuclear Test (1974):** India conducted its first nuclear test, terming it a 'peaceful explosion'.
- **Second Nuclear Tests (1998):** India conducted a series of nuclear tests at Pokhran, establishing itself as a nuclear power.
`
    },
    hi: {
      title: 'अध्याय 4: भारत के विदेश संबंध',
      content: `### अंतर्राष्ट्रीय संदर्भ
- भारत का जन्म एक बहुत ही चुनौतीपूर्ण अंतर्राष्ट्रीय संदर्भ में हुआ था, जो द्वितीय विश्व युद्ध की तबाही और दो महाशक्तियों: संयुक्त राज्य अमेरिका (पश्चिमी गठबंधन का नेतृत्व) और सोवियत संघ (पूर्वी गठबंधन का नेतृत्व) के बीच **शीत युद्ध** की शुरुआत से चिह्नित था।
- दुनिया इन दो खेमों में बंट रही थी। भारत का नेतृत्व अपना रास्ता खुद बनाने और इन शक्तिशाली गुटों के खेल में एक मोहरा न बनने के लिए दृढ़ था।

### गुटनिरपेक्षता की नीति (NAM)
- **यह क्या है?:** गुटनिरपेक्षता भारत की विदेश नीति का आधार थी। इसका मतलब संयुक्त राज्य अमेरिका और सोवियत संघ द्वारा बनाए गए सैन्य गठबंधनों से दूर रहना था। पहले प्रधानमंत्री और विदेश मंत्री के रूप में **जवाहरलाल नेहरू** इस नीति के मुख्य वास्तुकार थे।
- **भारत ने इसे क्यों अपनाया?:**
- - **संप्रभुता की रक्षा के लिए:** किसी भी गुट में शामिल न होकर, भारत एक महाशक्ति के दबाव के बिना अपने फैसले खुद कर सकता था।
- - **विकास पर ध्यान केंद्रित करने के लिए:** भारत की प्राथमिकता गरीबी को दूर करना और अपनी अर्थव्यवस्था का विकास करना था, न कि सैन्य संघर्षों में उलझना।
- - **एक सक्रिय भूमिका निभाने के लिए:** गुटनिरपेक्षता अलगाव के बारे में नहीं थी। यह शीत युद्ध के तनाव को कम करने और शांति को बढ़ावा देने के लिए विश्व मामलों में सक्रिय रूप से भाग लेने के बारे में थी।
- **बांडुंग सम्मेलन (1955):** यह एफ्रो-एशियाई सम्मेलन गुटनिरपेक्ष आंदोलन की स्थापना में एक महत्वपूर्ण क्षण था। पहला NAM शिखर सम्मेलन **1961 में बेलग्रेड** में आयोजित किया गया था।

### चीन के साथ संबंध
- **प्रारंभिक मित्रता:** शुरुआत में, भारत और चीन के बीच **'हिंदी-चीनी भाई-भाई'** के नारे पर आधारित एक दोस्ताना रिश्ता था।
- **पंचशील (1954):** नेहरू और चीनी प्रधानमंत्री झोउ एनलाई ने **पंचशील समझौते** पर हस्ताक्षर किए, जो शांतिपूर्ण सह-अस्तित्व के पांच सिद्धांत थे।
- **तिब्बत मुद्दा:** जब चीन ने 1950 में तिब्बत पर कब्जा कर लिया तो संबंध खराब हो गए। जब 1959 में दलाई लामा को भारत में शरण दी गई, तो चीन ने भारत पर हस्तक्षेप करने का आरोप लगाया।
- **1962 का युद्ध:** चीन ने एक सीमा विवाद को लेकर अक्टूबर 1962 में एक तेज और बड़े पैमाने पर आक्रमण किया। भारतीय सेना तैयार नहीं थी और उसे एक बड़ी हार का सामना करना पड़ा। इस युद्ध का भारत की विदेश नीति और सैन्य आधुनिकीकरण पर एक स्थायी प्रभाव पड़ा।

### पाकिस्तान के साथ संबंध
- **शुरुआत से ही संघर्ष:** विभाजन के ठीक बाद से, विशेष रूप से **कश्मीर** के मुद्दे पर, संबंध संघर्ष और संदेह से चिह्नित रहे हैं।
- **1947-48 का युद्ध:** यह कश्मीर पर पहला संघर्ष था, जिसके कारण राज्य का विभाजन हुआ।
- **1965 का युद्ध:** कश्मीर पर दूसरा युद्ध लड़ा गया, जो एक गतिरोध और **ताशकंद समझौते** में समाप्त हुआ।
- **1971 का युद्ध और बांग्लादेश का जन्म:** भारत ने बांग्लादेश के स्वतंत्रता संग्राम का समर्थन किया, जिससे भारतीय सेना की निर्णायक जीत हुई और बांग्लादेश का निर्माण हुआ। इसके बाद **शिमला समझौता** हुआ।
- **कारगिल संघर्ष (1999):** भारत ने नियंत्रण रेखा (LoC) के भारतीय हिस्से में पाकिस्तानी सेना द्वारा कब्जा किए गए रणनीतिक ऊंचे स्थानों को पुनः प्राप्त करने के लिए एक संघर्ष जीता।

### भारत की परमाणु नीति
- भारत की परमाणु नीति **'पहले उपयोग नहीं'** के सिद्धांत द्वारा निर्देशित की गई है।
- भारत ने 1968 की परमाणु अप्रसार संधि (NPT) पर हस्ताक्षर करने से इनकार कर दिया, इसे भेदभावपूर्ण बताया।
- **पहला परमाणु परीक्षण (1974):** भारत ने अपना पहला परमाणु परीक्षण किया, इसे 'शांतिपूर्ण विस्फोट' करार दिया।
- **दूसरा परमाणु परीक्षण (1998):** भारत ने पोखरण में कई परमाणु परीक्षण किए, जिससे वह एक परमाणु शक्ति के रूप में स्थापित हो गया।
`
    }
  },
  'challenges-to-and-restoration-of-the-congress-system': {
    en: {
      title: 'Chapter 5: Challenges to and Restoration of the Congress System',
      content: `### From Nehru to Shastri
- Prime Minister Jawaharlal Nehru passed away in **May 1964**. His death led to speculation about India's democratic future, but the transition was smooth.
- **Lal Bahadur Shastri** became the next Prime Minister (1964-1966). He was known for his simplicity and commitment to principles.
- **Challenges during Shastri's tenure:** He faced an economic crisis and the **War with Pakistan (1965)**. He gave the famous slogan **'Jai Jawan, Jai Kisan'** (Hail the soldier, Hail the farmer). The war ended with the **Tashkent Agreement**, but Shastri passed away in Tashkent shortly after.

### From Shastri to Indira Gandhi
- After Shastri's death, there was a competition between **Morarji Desai** and **Indira Gandhi** for the post of Prime Minister.
- The powerful group of Congress leaders, known as the **'Syndicate'**, supported Indira Gandhi.
- Indira Gandhi defeated Morarji Desai and became the Prime Minister.

### The Fourth General Election, 1967
- **Context of the election:** This period was marked by serious economic problems, food scarcity, rising prices, and widespread protests.
- **Non-Congressism:** This term was coined by socialist leader **Ram Manohar Lohia**. He argued that all non-Congress parties should unite to oust the Congress.
- **Election Verdict - A 'Political Earthquake':** The Congress managed to form a government at the Centre but with its lowest-ever tally of seats. It lost the majority in **nine states**. This was the first time Congress faced such a significant challenge to its dominance.
- **Coalitions:** The 1967 elections marked the beginning of the era of coalitions. Various non-Congress parties formed joint legislative parties called **Samyukta Vidhayak Dal (SVD)** to form governments.

### Split in the Congress
- **Syndicate vs. Indira Gandhi:** Indira Gandhi faced a challenge from the 'Syndicate' within her own party.
- **Presidential Election, 1969:** The conflict came to a head during the presidential election. The Syndicate nominated **N. Sanjeeva Reddy**, while Indira Gandhi supported **V.V. Giri** as an independent candidate.
- V.V. Giri won the election, which was a major setback for the Syndicate.
- This led to a formal split in **1969**. The Congress party was divided into **Congress (Organisation)** led by the Syndicate, and **Congress (Requisitionists)** led by Indira Gandhi.

### The 1971 Election and Restoration of Congress
- Indira Gandhi's government lost its majority after the split but continued in power with the support of other parties.
- **Indira Gandhi's Strategy:** She adopted a bold and leftist strategy.
- - **Abolition of Privy Purse:** She moved to abolish the 'privy purse', a special payment given to the former princes.
- - **Garibi Hatao (Remove Poverty):** This was her main slogan for the 1971 election. In contrast, the opposition parties formed a **'Grand Alliance'** with the slogan **'Indira Hatao'** (Remove Indira).
- **Election Outcome:** The results were a landslide victory for Indira Gandhi's Congress (R). This election not only restored the dominance of the Congress but also established Indira Gandhi as the undisputed leader of the party and the country.
`
    },
    hi: {
      title: 'अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना',
      content: `### नेहरू से शास्त्री तक
- प्रधानमंत्री जवाहरलाल नेहरू का **मई 1964** में निधन हो गया। उनकी मृत्यु ने भारत के लोकतांत्रिक भविष्य के बारे में अटकलों को जन्म दिया, लेकिन सत्ता का हस्तांतरण सुचारू रूप से हुआ।
- **लाल बहादुर शास्त्री** अगले प्रधानमंत्री (1964-1966) बने। वे अपनी सादगी और सिद्धांतों के प्रति प्रतिबद्धता के लिए जाने जाते थे।
- **शास्त्री के कार्यकाल के दौरान चुनौतियाँ:** उन्होंने एक आर्थिक संकट और **पाकिस्तान के साथ युद्ध (1965)** का सामना किया। उन्होंने प्रसिद्ध नारा **'जय जवान, जय किसान'** दिया। युद्ध **ताशकंद समझौते** के साथ समाप्त हुआ, लेकिन इसके तुरंत बाद ताशकंद में शास्त्री का निधन हो गया।

### शास्त्री से इंदिरा गांधी तक
- शास्त्री की मृत्यु के बाद, प्रधानमंत्री पद के लिए **मोरारजी देसाई** और **इंदिरा गांधी** के बीच प्रतिस्पर्धा हुई।
- कांग्रेस के शक्तिशाली नेताओं का समूह, जिसे **'सिंडिकेट'** के नाम से जाना जाता है, ने इंदिरा गांधी का समर्थन किया।
- इंदिरा गांधी ने मोरारजी देसाई को हराया और प्रधानमंत्री बनीं।

### चौथा आम चुनाव, 1967
- **चुनाव का संदर्भ:** यह अवधि गंभीर आर्थिक समस्याओं, भोजन की कमी, बढ़ती कीमतों और व्यापक विरोध प्रदर्शनों से चिह्नित थी।
- **गैर-कांग्रेसवाद:** यह शब्द समाजवादी नेता **राम मनोहर लोहिया** द्वारा गढ़ा गया था। उन्होंने तर्क दिया कि कांग्रेस को बाहर निकालने के लिए सभी गैर-कांग्रेसी दलों को एकजुट होना चाहिए।
- **चुनाव परिणाम - एक 'राजनीतिक भूकंप':** कांग्रेस केंद्र में सरकार बनाने में कामयाब रही, लेकिन अपनी अब तक की सबसे कम सीटों के साथ। इसने **नौ राज्यों** में बहुमत खो दिया। यह पहली बार था जब कांग्रेस को अपने प्रभुत्व के लिए इतनी महत्वपूर्ण चुनौती का सामना करना पड़ा।
- **गठबंधन:** 1967 के चुनावों ने गठबंधन के युग की शुरुआत को चिह्नित किया। विभिन्न गैर-कांग्रेसी दलों ने सरकारें बनाने के लिए **संयुक्त विधायक दल (SVD)** नामक संयुक्त विधायी दल बनाए।

### कांग्रेस में विभाजन
- **सिंडिकेट बनाम इंदिरा गांधी:** इंदिरा गांधी को अपनी ही पार्टी के भीतर 'सिंडिकेट' से एक चुनौती का सामना करना पड़ा।
- **राष्ट्रपति चुनाव, 1969:** राष्ट्रपति चुनाव के दौरान संघर्ष चरम पर पहुंच गया। सिंडिकेट ने **एन. संजीव रेड्डी** को नामित किया, जबकि इंदिरा गांधी ने एक स्वतंत्र उम्मीदवार के रूप में **वी.वी. गिरि** का समर्थन किया।
- वी.वी. गिरि ने चुनाव जीता, जो सिंडिकेट के लिए एक बड़ा झटका था।
- इससे **1969** में एक औपचारिक विभाजन हुआ। कांग्रेस पार्टी सिंडिकेट के नेतृत्व वाली **कांग्रेस (संगठन)** और इंदिरा गांधी के नेतृत्व वाली **कांग्रेस (रिक्विजिशनिस्ट)** में विभाजित हो गई।

### 1971 का चुनाव और कांग्रेस की पुनर्स्थापना
- विभाजन के बाद इंदिरा गांधी की सरकार ने अपना बहुमत खो दिया, लेकिन अन्य दलों के समर्थन से सत्ता में बनी रही।
- **इंदिरा गांधी की रणनीति:** उन्होंने एक साहसिक और वामपंथी रणनीति अपनाई।
- - **प्रिवी पर्स का उन्मूलन:** उन्होंने पूर्व राजकुमारों को दिए जाने वाले एक विशेष भुगतान 'प्रिवी पर्स' को समाप्त करने का कदम उठाया।
- - **गरीबी हटाओ:** यह 1971 के चुनाव के लिए उनका मुख्य नारा था। इसके विपरीत, विपक्षी दलों ने **'इंदिरा हटाओ'** के नारे के साथ एक **'ग्रैंड अलायंस'** बनाया।
- **चुनाव परिणाम:** परिणाम इंदिरा गांधी की कांग्रेस (आर) के लिए एक शानदार जीत थी। इस चुनाव ने न केवल कांग्रेस के प्रभुत्व को बहाल किया, बल्कि इंदिरा गांधी को पार्टी और देश की निर्विवाद नेता के रूप में भी स्थापित किया।
`
    }
  },
  'the-crisis-of-democratic-order': {
    en: {
      title: 'Chapter 6: The Crisis of Democratic Order',
      content: 'This chapter discusses the political turmoil of the 1970s, culminating in the imposition of the Emergency. It examines the causes and consequences of this period.'
    },
    hi: {
      title: 'अध्याय 6: लोकतांत्रिक व्यवस्था का संकट',
      content: 'यह अध्याय 1970 के दशक की राजनीतिक उथल-पुथल पर चर्चा करता है, जिसकी परिणति आपातकाल लागू होने में हुई। यह इस अवधि के कारणों और परिणामों की जांच करता है।'
    }
  },
  'rise-of-popular-movements': {
    en: {
      title: 'Chapter 7: Rise of Popular Movements',
      content: 'This chapter highlights the emergence of various popular movements in India during the 1970s and 1980s, reflecting social and political discontent.'
    },
    hi: {
      title: 'अध्याय 7: जन आंदोलनों का उदय',
      content: 'यह अध्याय 1970 और 1980 के दशक के दौरान भारत में विभिन्न लोकप्रिय आंदोलनों के उद्भव पर प्रकाश डालता है, जो सामाजिक और राजनीतिक असंतोष को दर्शाता है।'
    }
  },
  'regional-aspirations': {
    en: {
      title: 'Chapter 8: Regional Aspirations',
      content: 'This chapter examines the rise of regional aspirations and movements in different parts of India, and the response of the central government to these demands.'
    },
    hi: {
      title: 'अध्याय 8: क्षेत्रीय आकांक्षाएँ',
      content: 'यह अध्याय भारत के विभिन्न हिस्सों में क्षेत्रीय आकांक्षाओं और आंदोलनों के उदय और इन मांगों पर केंद्र सरकार की प्रतिक्रिया की जांच करता है।'
    }
  },
  'recent-developments-in-indian-politics': {
    en: {
      title: 'Chapter 9: Recent Developments in Indian Politics',
      content: 'This chapter covers the major political developments in India since the late 1980s, including the rise of coalition politics, Mandal Commission, and economic reforms.'
    },
    hi: {
      title: 'अध्याय 9: भारतीय राजनीति: नए बदलाव',
      content: 'यह अध्याय 1980 के दशक के अंत से भारत में प्रमुख राजनीतिक विकास को शामिल करता है, जिसमें गठबंधन की राजनीति का उदय, मंडल आयोग और आर्थिक सुधार शामिल हैं।'
    }
  },
  'default': {
    en: {
      title: 'Notes Not Found',
      content: 'Detailed notes for this chapter will be available soon. Please check back later.'
    },
    hi: {
      title: 'नोट्स नहीं मिले',
      content: 'इस अध्याय के विस्तृत नोट्स जल्द ही उपलब्ध होंगे। कृपया बाद में फिर से देखें।'
    }
  }
};


function NotesContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  
  const chapterNotes = notesData[slug] || notesData['default'];
  const notes = chapterNotes[lang];

  return (
     <div className="container mx-auto py-12 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{notes.title}</CardTitle>
          <CardDescription>Detailed notes for your study and revision.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotesContentRenderer content={notes.content} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function NotesDetailsPage({ params }: { params: { slug: string } }) {
    const { slug } = use(params);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotesContent slug={slug} />
        </Suspense>
    )
}
