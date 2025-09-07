
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
      content: `### What is South Asia?
- The expression ‘South Asia’ usually includes the following countries: **Bangladesh, Bhutan, India, the Maldives, Nepal, Pakistan and Sri Lanka**.
- **Geography:** The mighty Himalayas in the north and the vast Indian Ocean, the Arabian Sea and the Bay of Bengal in the south, west and east respectively provide a natural insularity to the region.
- **Political Systems:** Despite the mixed record of the democratic experience, the people in all these countries share the aspiration for democracy.
- - **India and Sri Lanka:** Have successfully operated a democratic system since their independence.
- - **Pakistan and Bangladesh:** Have experienced both civilian and military rulers.
- - **Nepal:** Was a constitutional monarchy, but is now a democratic republic.
- - **Bhutan:** Became a constitutional monarchy in 2008.
- - **Maldives:** Was a sultanate till 1968 when it was transformed into a republic with a presidential form of government.

### The Military and Democracy in Pakistan
- After Pakistan framed its first constitution, **General Ayub Khan** took over the administration and got himself elected. He was overthrown by a military coup led by **General Yahya Khan**.
- A democratic government was formed under the leadership of **Zulfikar Ali Bhutto** from 1971 to 1977.
- Bhutto's government was removed by **General Zia-ul-Haq** in 1977.
- After 1988, an elected democratic government was established under **Benazir Bhutto** and **Nawaz Sharif**.
- In 1999, **General Pervez Musharraf** removed Prime Minister Nawaz Sharif in a military coup. In 2008, a democratic government was re-established.
- **Reasons for failure of stable democracy:** The social dominance of the military, clergy, and landowning aristocracy has led to the frequent overthrow of elected governments. Pakistan's conflict with India has made the pro-military groups more powerful.

### Democracy in Bangladesh
- Bangladesh was a part of Pakistan from 1947 to 1971.
- The people of this region resented the domination of western Pakistan and the imposition of the Urdu language.
- The protest against this was led by **Sheikh Mujibur Rahman**, who led the popular struggle for autonomy.
- In the 1970 elections, the Awami League led by Sheikh Mujib won all the seats in East Pakistan.
- The West Pakistani leadership refused to convene the assembly. **General Yahya Khan** launched an army crackdown, leading to a large-scale migration into India.
- The government of India supported the demand for independence and helped them financially and militarily. This resulted in a war between India and Pakistan in December 1971 that ended with the surrender of the Pakistani forces in East Pakistan and the formation of **Bangladesh** as an independent country.
- In 1975, Sheikh Mujib got the constitution amended to shift from the parliamentary to presidential form of government, abolishing all parties except his own, the Awami League. He was assassinated in a military uprising in August 1975.
- A military ruler, **Ziaur Rahman**, was also assassinated, and another military takeover followed under **Lt Gen H.M. Ershad**.
- Since 1991, representative democracy based on multi-party elections has been working in Bangladesh.

### Monarchy and Democracy in Nepal
- Nepal was a **Hindu kingdom** in the past and then a constitutional monarchy for many years.
- A pro-democracy movement in 2006 led to the end of the monarchy, and Nepal emerged as a democratic republic.
- The country's new constitution was adopted in **2015**.

### Ethnic Conflict and Democracy in Sri Lanka
- Sri Lanka (formerly Ceylon) has retained democracy since its independence in 1948.
- **The Ethnic Conflict:** The major issue has been the conflict between the majority **Sinhala** community and the minority **Tamil** community.
- The Sinhala nationalists thought that Sri Lanka should not give ‘concessions’ to the Tamils because Sri Lanka belongs to the Sinhala people only.
- From 1983 onwards, the militant organisation, the **Liberation Tigers of Tamil Eelam (LTTE)**, has been fighting an armed struggle with the army of Sri Lanka and demanding ‘Tamil Eelam’ or a separate country for the Tamils of Sri Lanka.
- The conflict came to a violent end in **2009**, with the defeat of the LTTE.

### India-Pakistan Conflicts
- The relations between India and Pakistan have been marred by conflicts over issues like **Kashmir, Siachen glacier, and sharing of river waters**.
- The two countries have fought major wars in **1947-48, 1965, and 1971**.
- In 1998, India conducted nuclear tests in Pokhran. Pakistan responded by conducting its own tests in the Chagai Hills.
- In 1999, the **Kargil conflict** took place.

### India and its Neighbours
- **Bangladesh:** Differences have arisen over the sharing of the Ganga and Brahmaputra river waters.
- **Nepal:** The two countries share a friendly relationship but have had trade-related disputes in the past.
- **Sri Lanka:** The Indian government has periodically had to manage the pressures from the Tamil population in India to intervene in Sri Lanka.
- **Bhutan:** India enjoys a very special relationship with Bhutan, and Indian efforts in Bhutan’s development are widely appreciated.
- **Maldives:** India has supported the Maldives' economy and has come to its aid during crises.

### Peace and Cooperation
- **South Asian Association for Regional Cooperation (SAARC):** This is a major regional initiative by the South Asian states to evolve cooperation through multilateral means. It was established in **1985**.
- **South Asian Free Trade Area (SAFTA):** The agreement was signed in 2004 and came into effect on 1 January 2006. SAFTA aims at lowering trade tariffs.
`
    },
    hi: {
      title: 'अध्याय 5: समकालीन दक्षिण एशिया',
      content: `### दक्षिण एशिया क्या है?
- 'दक्षिण एशिया' अभिव्यक्ति में आमतौर पर निम्नलिखित देश शामिल होते हैं: **बांग्लादेश, भूटान, भारत, मालदीव, नेपाल, पाकिस्तान और श्रीलंका**।
- **भूगोल:** उत्तर में शक्तिशाली हिमालय और दक्षिण, पश्चिम और पूर्व में विशाल हिंद महासागर, अरब सागर और बंगाल की खाड़ी इस क्षेत्र को एक प्राकृतिक द्वीपीयता प्रदान करते हैं।
- **राजनीतिक प्रणालियाँ:** लोकतांत्रिक अनुभव के मिश्रित रिकॉर्ड के बावजूद, इन सभी देशों के लोग लोकतंत्र की आकांक्षा साझा करते हैं।
- - **भारत और श्रीलंका:** ने अपनी स्वतंत्रता के बाद से एक लोकतांत्रिक प्रणाली का सफलतापूर्वक संचालन किया है।
- - **पाकिस्तान और बांग्लादेश:** ने नागरिक और सैन्य दोनों शासकों का अनुभव किया है।
- - **नेपाल:** एक संवैधानिक राजतंत्र था, लेकिन अब एक लोकतांत्रिक गणराज्य है।
- - **भूटान:** 2008 में एक संवैधानिक राजतंत्र बना।
- - **मालदीव:** 1968 तक एक सल्तनत था जब इसे सरकार के राष्ट्रपति के रूप के साथ एक गणराज्य में बदल दिया गया था।

### पाकिस्तान में सेना और लोकतंत्र
- पाकिस्तान द्वारा अपना पहला संविधान बनाने के बाद, **जनरल अयूब खान** ने प्रशासन संभाला और खुद को निर्वाचित करवाया। उन्हें **जनरल याह्या खान** के नेतृत्व में एक सैन्य तख्तापलट द्वारा उखाड़ फेंका गया।
- 1971 से 1977 तक **जुल्फिकार अली भुट्टो** के नेतृत्व में एक लोकतांत्रिक सरकार का गठन किया गया।
- भुट्टो की सरकार को 1977 में **जनरल जिया-उल-हक** ने हटा दिया।
- 1988 के बाद, **बेनजीर भुट्टो** और **नवाज शरीफ** के तहत एक निर्वाचित लोकतांत्रिक सरकार की स्थापना हुई।
- 1999 में, **जनरल परवेज मुशर्रफ** ने एक सैन्य तख्तापलट में प्रधानमंत्री नवाज शरीफ को हटा दिया। 2008 में, एक लोकतांत्रिक सरकार को फिर से स्थापित किया गया।
- **स्थिर लोकतंत्र की विफलता के कारण:** सेना, पादरियों और भू-स्वामी अभिजात वर्ग के सामाजिक प्रभुत्व ने निर्वाचित सरकारों के बार-बार उखाड़ फेंकने का कारण बना है। भारत के साथ पाकिस्तान के संघर्ष ने सैन्य-समर्थक समूहों को और अधिक शक्तिशाली बना दिया है।

### बांग्लादेश में लोकतंत्र
- बांग्लादेश 1947 से 1971 तक पाकिस्तान का हिस्सा था।
- इस क्षेत्र के लोगों ने पश्चिमी पाकिस्तान के प्रभुत्व और उर्दू भाषा को थोपे जाने का विरोध किया।
- इसके खिलाफ विरोध का नेतृत्व **शेख मुजीबुर रहमान** ने किया, जिन्होंने स्वायत्तता के लिए लोकप्रिय संघर्ष का नेतृत्व किया।
- 1970 के चुनावों में, शेख मुजीब के नेतृत्व वाली अवामी लीग ने पूर्वी पाकिस्तान में सभी सीटें जीतीं।
- पश्चिमी पाकिस्तानी नेतृत्व ने विधानसभा बुलाने से इनकार कर दिया। **जनरल याह्या खान** ने एक सेना की कार्रवाई शुरू की, जिससे भारत में बड़े पैमाने पर प्रवासन हुआ।
- भारत सरकार ने स्वतंत्रता की मांग का समर्थन किया और उन्हें आर्थिक और सैन्य रूप से मदद की। इसके परिणामस्वरूप दिसंबर 1971 में भारत और पाकिस्तान के बीच एक युद्ध हुआ जो पूर्वी पाकिस्तान में पाकिस्तानी सेना के आत्मसमर्पण और एक स्वतंत्र देश के रूप में **बांग्लादेश** के गठन के साथ समाप्त हुआ।
- 1975 में, शेख मुजीब ने अपनी पार्टी, अवामी लीग को छोड़कर सभी दलों को समाप्त करते हुए, संसदीय से सरकार के राष्ट्रपति के रूप में स्थानांतरित करने के लिए संविधान में संशोधन करवाया। अगस्त 1975 में एक सैन्य विद्रोह में उनकी हत्या कर दी गई।
- एक सैन्य शासक, **जियाउर रहमान** की भी हत्या कर दी गई, और **लेफ्टिनेंट जनरल एच.एम. इरशाद** के तहत एक और सैन्य अधिग्रहण हुआ।
- 1991 से, बांग्लादेश में बहु-दलीय चुनावों पर आधारित प्रतिनिधि लोकतंत्र काम कर रहा है।

### नेपाल में राजतंत्र और लोकतंत्र
- नेपाल अतीत में एक **हिंदू साम्राज्य** था और फिर कई वर्षों तक एक संवैधानिक राजतंत्र था।
- 2006 में एक लोकतंत्र-समर्थक आंदोलन ने राजशाही के अंत का नेतृत्व किया, और नेपाल एक लोकतांत्रिक गणराज्य के रूप में उभरा।
- देश का नया संविधान **2015** में अपनाया गया था।

### श्रीलंका में जातीय संघर्ष और लोकतंत्र
- श्रीलंका (पूर्व में सीलोन) ने 1948 में अपनी स्वतंत्रता के बाद से लोकतंत्र को बनाए रखा है।
- **जातीय संघर्ष:** प्रमुख मुद्दा बहुसंख्यक **सिंहली** समुदाय और अल्पसंख्यक **तमिल** समुदाय के बीच संघर्ष रहा है।
- सिंहली राष्ट्रवादियों ने सोचा कि श्रीलंका को तमिलों को 'रियायतें' नहीं देनी चाहिए क्योंकि श्रीलंका केवल सिंहली लोगों का है।
- 1983 के बाद से, उग्रवादी संगठन, **लिबरेशन टाइगर्स ऑफ तमिल ईलम (लिट्टे)**, श्रीलंका की सेना के साथ एक सशस्त्र संघर्ष लड़ रहा है और 'तमिल ईलम' या श्रीलंका के तमिलों के लिए एक अलग देश की मांग कर रहा है।
- यह संघर्ष **2009** में लिट्टे की हार के साथ एक हिंसक अंत तक पहुंचा।

### भारत-पाकिस्तान संघर्ष
- भारत और पाकिस्तान के बीच संबंध **कश्मीर, सियाचिन ग्लेशियर और नदी के पानी के बंटवारे** जैसे मुद्दों पर संघर्षों से खराब हुए हैं।
- दोनों देशों ने **1947-48, 1965, और 1971** में बड़े युद्ध लड़े हैं।
- 1998 में, भारत ने पोखरण में परमाणु परीक्षण किए। पाकिस्तान ने चगाई पहाड़ियों में अपने स्वयं के परीक्षण करके जवाब दिया।
- 1999 में, **कारगिल संघर्ष** हुआ।

### भारत और उसके पड़ोसी
- **बांग्लादेश:** गंगा और ब्रह्मपुत्र नदी के पानी के बंटवारे को लेकर मतभेद पैदा हुए हैं।
- **नेपाल:** दोनों देशों के बीच एक दोस्ताना संबंध है लेकिन अतीत में व्यापार से संबंधित विवाद हुए हैं।
- **श्रीलंका:** भारत सरकार को समय-समय पर भारत में तमिल आबादी के दबावों का प्रबंधन करना पड़ा है ताकि वे श्रीलंका में हस्तक्षेप कर सकें।
- **भूटान:** भारत का भूटान के साथ एक बहुत ही विशेष संबंध है, और भूटान के विकास में भारतीय प्रयासों की व्यापक रूप से सराहना की जाती है।
- **मालदीव:** भारत ने मालदीव की अर्थव्यवस्था का समर्थन किया है और संकटों के दौरान इसकी सहायता के लिए आया है।

### शांति और सहयोग
- **दक्षिण एशियाई क्षेत्रीय सहयोग संगठन (सार्क):** यह दक्षिण एशियाई राज्यों द्वारा बहुपक्षीय माध्यमों से सहयोग विकसित करने के लिए एक प्रमुख क्षेत्रीय पहल है। इसकी स्थापना **1985** में हुई थी।
- **दक्षिण एशियाई मुक्त व्यापार क्षेत्र (साफ्टा):** इस समझौते पर 2004 में हस्ताक्षर किए गए थे और यह 1 जनवरी 2006 को लागू हुआ। साफ्टा का उद्देश्य व्यापार शुल्कों को कम करना है।
`
    }
  },
  'international-organisations': {
    en: {
      title: 'Chapter 6: International Organisations',
      content: `### Why International Organisations?
- International organisations are not a 'super-state' but are created by states to help them cooperate on various issues.
- **Reasons for their need:**
- - **Preventing War and Promoting Peace:** Organisations like the United Nations (UN) provide a platform for countries to discuss issues and find peaceful solutions, preventing conflicts from escalating into full-blown wars.
- - **Tackling Global Challenges:** Many problems, such as disease, climate change, and terrorism, cannot be solved by one country alone. International organisations help countries work together to address these shared challenges.
- - **Economic Cooperation:** They create rules and frameworks for international trade and finance, promoting economic growth and stability. Examples include the World Bank and the International Monetary Fund (IMF).
- - **Producing Information and Ideas:** They conduct research and publish reports on important global issues, providing valuable data and ideas for member states.

### Evolution of the UN
- The United Nations was founded as a successor to the **League of Nations**. The League was established after World War I but failed to prevent the Second World War.
- **Founding of the UN:** The UN was established in **1945**, immediately after World War II. It was founded by 51 states who signed the **UN Charter**.
- **Objective:** The UN's main objective is to prevent international conflict and to facilitate cooperation among states. It aims to bring countries together to improve the prospects of social and economic development all over the world.
- **Membership:** By 2011, the UN had **193 member states**, encompassing almost every independent state.

### The UN's Principal Organs
- **The General Assembly:** All 193 members of the UN have one vote each. Major decisions require a two-thirds majority, while others need a simple majority.
- **The Security Council:** This is the most powerful organ. It has **15 members** in total.
- - **Five Permanent Members (P5):** The United States, Russia, the United Kingdom, France, and China. These countries have the **veto power**, meaning they can block any decision.
- - **Ten Non-Permanent Members:** Elected by the General Assembly for two-year terms.
- **The International Court of Justice:** Located in The Hague, it settles legal disputes between states. It has 15 judges elected for nine-year terms.
- **The Secretariat:** Headed by the **Secretary-General**, it handles the administrative work of the UN.
- **The Economic and Social Council (ECOSOC):** It deals with economic, social, and environmental issues.

### Reform of the UN after the Cold War
- After the Cold War, there have been calls for reforming the UN's structure and processes. Two basic kinds of reforms are being demanded:
- **1. Reform of the Organisation's Structures and Processes:** The biggest discussion has been on the functioning of the **Security Council**. There is a demand to increase the number of both permanent and non-permanent members.
- **2. Review of the Issues that Fall within the Jurisdiction of the UN:** Some countries want the UN to play a greater role in peace and security missions, while others want it to focus more on development and humanitarian work (health, education, etc.).

### Reform of the Security Council
- **Why the demand for change?:** The Security Council's composition, with its five permanent members, reflects the post-World War II reality and is seen as outdated. It is dominated by Western powers and does not represent contemporary global power structures.
- **Proposed Criteria for New Permanent Members:** In 1997, UN Secretary-General Kofi Annan initiated an inquiry. Some proposed criteria include being:
- - A major economic power.
- - A major military power.
- - A substantial contributor to the UN budget.
- - A big nation in terms of its population.
- - A nation that respects democracy and human rights.
- **The Veto Power Issue:** A major point of contention is the veto power of the P5 members. Many view it as undemocratic and want it to be abolished or modified. However, the P5 countries are unlikely to give it up.

### The UN in a Unipolar World
- After the collapse of the Soviet Union, the **United States** stands as the only superpower.
- This has affected the UN's functioning. The US has significant influence over the UN due to its large financial contribution and its political power.
- The UN is not a perfect organisation, but in a world dominated by one superpower, it provides a crucial space for discussion and can sometimes act as a check on US power. For many countries, it is the only platform to voice their concerns.

### Key UN Agencies
- **World Health Organisation (WHO):** Deals with international public health.
- **United Nations Development Programme (UNDP):** Works on poverty reduction and human development.
- **United Nations Human Rights Commission (UNHRC):** Promotes and protects human rights.
- **United Nations Children's Fund (UNICEF):** Works for the rights and well-being of children.
- **United Nations Educational, Scientific and Cultural Organisation (UNESCO):** Promotes education, science, and culture.
- **International Monetary Fund (IMF):** Oversees the global financial system.
- **World Bank:** Provides loans and grants for development projects in poorer countries.
- **World Trade Organisation (WTO):** Sets the rules for global trade.
`
    },
    hi: {
      title: 'अध्याय 6: अंतर्राष्ट्रीय संगठन',
      content: `### अंतर्राष्ट्रीय संगठन क्यों?
- अंतर्राष्ट्रीय संगठन कोई 'सुपर-स्टेट' नहीं हैं, बल्कि वे राज्यों द्वारा विभिन्न मुद्दों पर सहयोग करने में मदद करने के लिए बनाए जाते हैं।
- **उनकी आवश्यकता के कारण:**
- - **युद्ध को रोकना और शांति को बढ़ावा देना:** संयुक्त राष्ट्र (यूएन) जैसे संगठन देशों को मुद्दों पर चर्चा करने और शांतिपूर्ण समाधान खोजने के लिए एक मंच प्रदान करते हैं, जिससे संघर्षों को पूर्ण युद्धों में बदलने से रोका जा सके।
- - **वैश्विक चुनौतियों से निपटना:** बीमारी, जलवायु परिवर्तन और आतंकवाद जैसी कई समस्याओं का समाधान अकेले एक देश नहीं कर सकता। अंतर्राष्ट्रीय संगठन इन साझा चुनौतियों का समाधान करने के लिए देशों को मिलकर काम करने में मदद करते हैं।
- - **आर्थिक सहयोग:** वे अंतर्राष्ट्रीय व्यापार और वित्त के लिए नियम और रूपरेखा बनाते हैं, जिससे आर्थिक विकास और स्थिरता को बढ़ावा मिलता है। उदाहरणों में विश्व बैंक और अंतर्राष्ट्रीय मुद्रा कोष (आईएमएफ) शामिल हैं।
- - **सूचना और विचारों का उत्पादन:** वे महत्वपूर्ण वैश्विक मुद्दों पर शोध करते हैं और रिपोर्ट प्रकाशित करते हैं, जो सदस्य राज्यों के लिए मूल्यवान डेटा और विचार प्रदान करते हैं।

### संयुक्त राष्ट्र का विकास
- संयुक्त राष्ट्र की स्थापना **राष्ट्र संघ (League of Nations)** के उत्तराधिकारी के रूप में हुई थी। राष्ट्र संघ की स्थापना प्रथम विश्व युद्ध के बाद हुई थी लेकिन यह द्वितीय विश्व युद्ध को रोकने में विफल रहा।
- **संयुक्त राष्ट्र की स्थापना:** संयुक्त राष्ट्र की स्थापना **1945** में, द्वितीय विश्व युद्ध के तुरंत बाद हुई थी। इसकी स्थापना 51 राज्यों ने की थी जिन्होंने **संयुक्त राष्ट्र चार्टर** पर हस्ताक्षर किए थे।
- **उद्देश्य:** संयुक्त राष्ट्र का मुख्य उद्देश्य अंतर्राष्ट्रीय संघर्ष को रोकना और राज्यों के बीच सहयोग को सुविधाजनक बनाना है। इसका उद्देश्य दुनिया भर में सामाजिक और आर्थिक विकास की संभावनाओं को बेहतर बनाने के लिए देशों को एक साथ लाना है।
- **सदस्यता:** 2011 तक, संयुक्त राष्ट्र में **193 सदस्य देश** थे, जिसमें लगभग हर स्वतंत्र राज्य शामिल था।

### संयुक्त राष्ट्र के प्रमुख अंग
- **महासभा (The General Assembly):** संयुक्त राष्ट्र के सभी 193 सदस्यों में से प्रत्येक का एक वोट होता है। प्रमुख निर्णयों के लिए दो-तिहाई बहुमत की आवश्यकता होती है, जबकि अन्य के लिए साधारण बहुमत की आवश्यकता होती है।
- **सुरक्षा परिषद (The Security Council):** यह सबसे शक्तिशाली अंग है। इसमें कुल **15 सदस्य** हैं।
- - **पांच स्थायी सदस्य (P5):** संयुक्त राज्य अमेरिका, रूस, यूनाइटेड किंगडम, फ्रांस और चीन। इन देशों के पास **वीटो शक्ति** है, जिसका अर्थ है कि वे किसी भी निर्णय को रोक सकते हैं।
- - **दस अस्थायी सदस्य:** महासभा द्वारा दो साल के कार्यकाल के लिए चुने जाते हैं।
- **अंतर्राष्ट्रीय न्यायालय (The International Court of Justice):** हेग में स्थित, यह राज्यों के बीच कानूनी विवादों का निपटारा करता है। इसमें 15 न्यायाधीश हैं जो नौ साल के कार्यकाल के लिए चुने जाते हैं।
- **सचिवालय (The Secretariat):** **महासचिव** के नेतृत्व में, यह संयुक्त राष्ट्र के प्रशासनिक कार्यों को संभालता है।
- **आर्थिक और सामाजिक परिषद (ECOSOC):** यह आर्थिक, सामाजिक और पर्यावरणीय मुद्दों से संबंधित है।

### शीत युद्ध के बाद संयुक्त राष्ट्र में सुधार
- शीत युद्ध के बाद, संयुक्त राष्ट्र की संरचना और प्रक्रियाओं में सुधार की मांग की गई है। दो बुनियादी प्रकार के सुधारों की मांग की जा रही है:
- **1. संगठन की संरचनाओं और प्रक्रियाओं में सुधार:** सबसे बड़ी चर्चा **सुरक्षा परिषद** के कामकाज पर हुई है। स्थायी और अस्थायी दोनों सदस्यों की संख्या बढ़ाने की मांग है।
- **2. संयुक्त राष्ट्र के अधिकार क्षेत्र में आने वाले मुद्दों की समीक्षा:** कुछ देश चाहते हैं कि संयुक्त राष्ट्र शांति और सुरक्षा मिशनों में एक बड़ी भूमिका निभाए, जबकि अन्य चाहते हैं कि यह विकास और मानवीय कार्यों (स्वास्थ्य, शिक्षा, आदि) पर अधिक ध्यान केंद्रित करे।

### सुरक्षा परिषद में सुधार
- **बदलाव की मांग क्यों?:** सुरक्षा परिषद की संरचना, अपने पांच स्थायी सदस्यों के साथ, द्वितीय विश्व युद्ध के बाद की वास्तविकता को दर्शाती है और इसे पुराना माना जाता है। इस पर पश्चिमी शक्तियों का प्रभुत्व है और यह समकालीन वैश्विक शक्ति संरचनाओं का प्रतिनिधित्व नहीं करती है।
- **नए स्थायी सदस्यों के लिए प्रस्तावित मानदंड:** 1997 में, संयुक्त राष्ट्र महासचिव कोफी अन्नान ने एक जांच शुरू की। कुछ प्रस्तावित मानदंडों में शामिल हैं:
- - एक बड़ी आर्थिक शक्ति होना।
- - एक बड़ी सैन्य शक्ति होना।
- - संयुक्त राष्ट्र के बजट में एक बड़ा योगदानकर्ता होना।
- - अपनी जनसंख्या के मामले में एक बड़ा राष्ट्र होना।
- - एक ऐसा राष्ट्र जो लोकतंत्र और मानवाधिकारों का सम्मान करता हो।
- **वीटो शक्ति का मुद्दा:** एक बड़ा विवाद का मुद्दा P5 सदस्यों की वीटो शक्ति है। कई लोग इसे अलोकतांत्रिक मानते हैं और इसे समाप्त या संशोधित करना चाहते हैं। हालांकि, P5 देशों द्वारा इसे छोड़ने की संभावना नहीं है।

### एकध्रुवीय विश्व में संयुक्त राष्ट्र
- सोवियत संघ के पतन के बाद, **संयुक्त राज्य अमेरिका** एकमात्र महाशक्ति के रूप में खड़ा है।
- इसने संयुक्त राष्ट्र के कामकाज को प्रभावित किया है। अपने बड़े वित्तीय योगदान और अपनी राजनीतिक शक्ति के कारण संयुक्त राष्ट्र पर अमेरिका का महत्वपूर्ण प्रभाव है।
- संयुक्त राष्ट्र एक आदर्श संगठन नहीं है, लेकिन एक महाशक्ति के प्रभुत्व वाली दुनिया में, यह चर्चा के लिए एक महत्वपूर्ण स्थान प्रदान करता है और कभी-कभी अमेरिकी शक्ति पर एक जांच के रूप में कार्य कर सकता है। कई देशों के लिए, यह अपनी चिंताओं को उठाने का एकमात्र मंच है।

### प्रमुख संयुक्त राष्ट्र एजेंसियां
- **विश्व स्वास्थ्य संगठन (WHO):** अंतर्राष्ट्रीय सार्वजनिक स्वास्थ्य से संबंधित है।
- **संयुक्त राष्ट्र विकास कार्यक्रम (UNDP):** गरीबी में कमी और मानव विकास पर काम करता है।
- **संयुक्त राष्ट्र मानवाधिकार आयोग (UNHRC):** मानवाधिकारों को बढ़ावा देता है और उनकी रक्षा करता है।
- **संयुक्त राष्ट्र बाल कोष (UNICEF):** बच्चों के अधिकारों और कल्याण के लिए काम करता है।
- **संयुक्त राष्ट्र शैक्षिक, वैज्ञानिक और सांस्कृतिक संगठन (UNESCO):** शिक्षा, विज्ञान और संस्कृति को बढ़ावा देता है।
- **अंतर्राष्ट्रीय मुद्रा कोष (IMF):** वैश्विक वित्तीय प्रणाली की देखरेख करता है।
- **विश्व बैंक:** गरीब देशों में विकास परियोजनाओं के लिए ऋण और अनुदान प्रदान करता है।
- **विश्व व्यापार संगठन (WTO):** वैश्विक व्यापार के लिए नियम निर्धारित करता है।
`
    }
  },
  'security-in-the-contemporary-world': {
    en: {
      title: 'Chapter 7: Security in the Contemporary World',
      content: `### What is Security?
- At its most basic, security implies freedom from threats. It is a fundamental concern of human existence.
- However, what constitutes a 'threat' and who should be protected is a matter of debate. This leads to different notions of security.

### Traditional Notion of Security
- The traditional conception of security is primarily concerned with the state. The referent (the entity to be protected) is the **state**, and its core values are **sovereignty, independence, and territorial integrity**.
- **External Threats:** The greatest danger to a country is seen as military threats from another country. This threat endangers the core values of the state.
- **State's Response to External Threats:**
- - **Deterrence:** Preventing a war by threatening massive retaliation.
- - **Defence:** Defending a country's borders during a war to repel the attacking forces.
- - **Balance of Power:** When countries are in a balance of power, a major war is less likely. A state tries to maintain a favorable balance of power with its neighbors or rivals.
- - **Alliance Building:** States form alliances to increase their power relative to another country or alliance (e.g., NATO).
- **Internal Threats:** Traditional security also acknowledges internal threats, such as civil wars or separatist movements, which can threaten the state from within.

### Non-Traditional Notions of Security
- Non-traditional notions of security challenge the state-centric view. They broaden the concept of security to include a wider range of threats affecting human beings.
- **Human Security:** The focus shifts from protecting the state to protecting **people**. It is about 'freedom from want' and 'freedom from fear'. It includes protection from threats like poverty, disease, hunger, and violence.
- **Global Security:** This concept recognizes that some threats, like climate change, international terrorism, and pandemics (like AIDS, bird flu), are global in nature and require international cooperation.

### New Sources of Threats
- **Terrorism:** It refers to political violence that targets civilians deliberately and indiscriminately. It uses violence to create a climate of fear.
- **Human Rights:** These are basic rights that every human being is entitled to. Violations of human rights (political, economic, or social) are now considered a threat to security.
- **Global Poverty:** A significant disparity between the rich Global North and the poor Global South is a source of insecurity. Poverty in the South leads to large-scale migration to the North, creating international friction.
- **Health Epidemics:** Diseases like HIV-AIDS, bird flu, and SARS have spread rapidly across borders due to migration, tourism, and business travel, posing a serious threat to global security.

### Cooperative Security
- The non-traditional threats to security are often international in nature and cannot be solved by one country alone.
- **Cooperative security** is the idea that international cooperation is essential to deal with these threats. This cooperation can be bilateral, regional, or global.
- It involves international organizations (like the UN, WHO, World Bank), non-governmental organizations (NGOs like Amnesty International), and social movements.
- Strategies can include arms control, disarmament, and confidence-building measures between countries.
`
    },
    hi: {
      title: 'अध्याय 7: समकालीन विश्व में सुरक्षा',
      content: `### सुरक्षा क्या है?
- अपने सबसे बुनियादी रूप में, सुरक्षा का अर्थ है खतरों से मुक्ति। यह मानव अस्तित्व की एक मौलिक चिंता है।
- हालाँकि, 'खतरा' क्या है और किसकी रक्षा की जानी चाहिए, यह बहस का विषय है। इससे सुरक्षा की विभिन्न धारणाएँ बनती हैं।

### सुरक्षा की पारंपरिक धारणा
- सुरक्षा की पारंपरिक अवधारणा मुख्य रूप से राज्य से संबंधित है। इसका मुख्य केंद्र (जिसकी रक्षा की जानी है) **राज्य** है, और इसके मूल मूल्य **संप्रभुता, स्वतंत्रता और क्षेत्रीय अखंडता** हैं।
- **बाहरी खतरे:** किसी देश के लिए सबसे बड़ा खतरा दूसरे देश से सैन्य खतरा माना जाता है। यह खतरा राज्य के मूल मूल्यों को खतरे में डालता है।
- **बाहरी खतरों पर राज्य की प्रतिक्रिया:**
- - **अपरोध (Deterrence):** बड़े पैमाने पर जवाबी कार्रवाई की धमकी देकर युद्ध को रोकना।
- - **रक्षा (Defence):** हमलावर ताकतों को खदेड़ने के लिए युद्ध के दौरान देश की सीमाओं की रक्षा करना।
- - **शक्ति-संतुलन (Balance of Power):** जब देश शक्ति-संतुलन की स्थिति में होते हैं, तो एक बड़े युद्ध की संभावना कम होती है। एक राज्य अपने पड़ोसियों या प्रतिद्वंद्वियों के साथ एक अनुकूल शक्ति-संतुलन बनाए रखने की कोशिश करता है।
- - **गठबंधन बनाना (Alliance Building):** राज्य किसी अन्य देश या गठबंधन के सापेक्ष अपनी शक्ति बढ़ाने के लिए गठबंधन बनाते हैं (जैसे, नाटो)।
- **आंतरिक खतरे:** पारंपरिक सुरक्षा आंतरिक खतरों को भी स्वीकार करती है, जैसे कि गृहयुद्ध या अलगाववादी आंदोलन, जो राज्य को भीतर से खतरे में डाल सकते हैं।

### सुरक्षा की अपारंपरिक धारणाएँ
- सुरक्षा की अपारंपरिक धारणाएँ राज्य-केंद्रित दृष्टिकोण को चुनौती देती हैं। वे सुरक्षा की अवधारणा को व्यापक बनाती हैं ताकि मनुष्यों को प्रभावित करने वाले खतरों की एक विस्तृत श्रृंखला को शामिल किया जा सके।
- **मानवीय सुरक्षा:** इसका ध्यान राज्य की रक्षा करने से हटकर **लोगों** की रक्षा करने पर केंद्रित होता है। यह 'अभाव से मुक्ति' और 'भय से मुक्ति' के बारे में है। इसमें गरीबी, बीमारी, भूख और हिंसा जैसे खतरों से सुरक्षा शामिल है।
- **वैश्विक सुरक्षा:** यह अवधारणा मानती है कि जलवायु परिवर्तन, अंतर्राष्ट्रीय आतंकवाद और महामारियाँ (जैसे एड्स, बर्ड फ्लू) जैसे कुछ खतरे प्रकृति में वैश्विक हैं और अंतर्राष्ट्रीय सहयोग की आवश्यकता है।

### खतरों के नए स्रोत
- **आतंकवाद:** यह उस राजनीतिक हिंसा को संदर्भित करता है जो जानबूझकर और अंधाधुंध नागरिकों को निशाना बनाती है। यह भय का माहौल बनाने के लिए हिंसा का उपयोग करता है।
- **मानवाधिकार:** ये वे बुनियादी अधिकार हैं जिनका हर इंसान हकदार है। मानवाधिकारों का उल्लंघन (राजनीतिक, आर्थिक या सामाजिक) अब सुरक्षा के लिए एक खतरा माना जाता है।
- **वैश्विक गरीबी:** अमीर ग्लोबल नॉर्थ और गरीब ग्लोबल साउथ के बीच एक महत्वपूर्ण असमानता असुरक्षा का एक स्रोत है। दक्षिण में गरीबी उत्तर की ओर बड़े पैमाने पर प्रवास की ओर ले जाती है, जिससे अंतर्राष्ट्रीय घर्षण पैदा होता है।
- **स्वास्थ्य महामारियाँ:** एचआईवी-एड्स, बर्ड फ्लू और सार्स जैसी बीमारियाँ प्रवासन, पर्यटन और व्यापार यात्रा के कारण सीमाओं के पार तेजी से फैल गई हैं, जिससे वैश्विक सुरक्षा के लिए एक गंभीर खतरा पैदा हो गया है।

### सहयोगात्मक सुरक्षा
- सुरक्षा के लिए अपारंपरिक खतरे अक्सर प्रकृति में अंतर्राष्ट्रीय होते हैं और अकेले एक देश द्वारा हल नहीं किए जा सकते।
- **सहयोगात्मक सुरक्षा** यह विचार है कि इन खतरों से निपटने के लिए अंतर्राष्ट्रीय सहयोग आवश्यक है। यह सहयोग द्विपक्षीय, क्षेत्रीय या वैश्विक हो सकता है।
- इसमें अंतर्राष्ट्रीय संगठन (जैसे संयुक्त राष्ट्र, डब्ल्यूएचओ, विश्व बैंक), गैर-सरकारी संगठन (एनजीओ जैसे एमनेस्टी इंटरनेशनल), और सामाजिक आंदोलन शामिल हैं।
- रणनीतियों में देशों के बीच हथियार नियंत्रण, निरस्त्रीकरण और विश्वास-बहाली के उपाय शामिल हो सकते हैं।
`
    }
  },
  'environment-and-natural-resources': {
    en: {
      title: 'Chapter 8: Environment and Natural Resources',
      content: `### Environmental Concerns in Global Politics
- Environmental issues became a significant concern in global politics from the 1960s onwards.
- **Why the concern?:** Certain environmental issues can only be tackled through international cooperation. Issues like climate change, ozone layer depletion, and coastal pollution affect all countries.
- **'Tragedy of the Commons':** This term describes how shared resources are often overused and degraded because no single person or country has the incentive to maintain them.
- **The Club of Rome (1972):** This global think tank published a book called **'Limits to Growth'**, which highlighted the potential consequences of growing world population and resource depletion.
- **UNEP and Earth Summit:** The United Nations Environment Programme (UNEP) began holding international conferences. The most significant was the **United Nations Conference on Environment and Development** held in **Rio de Janeiro, Brazil, in 1992**. This is also called the **Earth Summit**.
- **Rio Summit Outcome:** It produced conventions dealing with climate change, biodiversity, and forestry, and adopted **Agenda 21**, a list of development practices for sustainable development.

### The Protection of Global Commons
- **What are 'Global Commons'?:** These are resources that are not owned by any one state but are shared by the international community.
- **Examples:** Earth’s atmosphere, Antarctica, the ocean floor, and outer space.
- **Cooperation on Commons:** There have been significant agreements to protect these commons:
- - **Antarctic Treaty (1959):** Established Antarctica as a demilitarized zone, open for scientific research.
- - **Montreal Protocol (1987):** An agreement to phase out chlorofluorocarbons (CFCs) to protect the ozone layer.
- - **Antarctic Environmental Protocol (1991):** Committed to the comprehensive protection of the Antarctic environment.

### Common but Differentiated Responsibilities
- This principle acknowledges that while all states share responsibility for protecting the environment, the developed countries of the **Global North** have a greater historical responsibility due to their long history of industrialization.
- **The North vs. South Debate:**
- - **Developed Countries (North):** Argue that environmental protection is a shared responsibility and all countries should participate equally.
- - **Developing Countries (South):** Argue that the ecological degradation is largely the product of industrial development by the North. They believe their primary priority is economic development and poverty eradication.
- **UNFCCC (1992):** The United Nations Framework Convention on Climate Change also endorsed this principle, stating that "parties should act... on the basis of equity and in accordance with their common but differentiated responsibilities and respective capabilities."
- **Kyoto Protocol (1997):** This international agreement set binding targets for industrialized countries to reduce their greenhouse gas emissions. China and India were exempted from these requirements.

### India’s Stand on Environmental Issues
- India signed and ratified the **Kyoto Protocol in 2002**.
- India believes that the major responsibility of curbing emissions rests with the developed countries, who have been the largest emitters historically.
- **India's Initiatives:**
- - **National Auto-fuel Policy:** Mandated cleaner fuels for vehicles.
- - **The Energy Conservation Act (2001):** Outlined initiatives to improve energy efficiency.
- - **The Electricity Act of 2003:** Encourages the use of renewable energy.
- - **National Mission on Biodiesel:** Aims to increase the use of biodiesel.
- - India is a leading participant in the **International Solar Alliance**.

### Resource Geopolitics
- This field deals with who gets what, when, where, and how in terms of natural resources.
- **Historical Context:** Throughout history, access to resources has been a major reason for interstate rivalry. Western colonial powers were often motivated by the need to secure resources.
- **Oil:** This is the most important resource in global strategy. The politics of oil is a story of wealth and power. The immense wealth associated with oil generates political struggles. West Asia (the Middle East) is a critical region due to its vast oil reserves.
- **Water:** Water is another critical resource that is a source of conflict. Disputes and disagreements over sharing river waters are common between states, leading to what some call 'hydro-politics'. Examples include conflicts between Israel/Syria/Jordan and Turkey/Syria/Iraq.

### Rights of Indigenous Peoples
- **Who are they?:** The UN defines indigenous populations as the descendants of peoples who inhabited a country or a geographical region at the time of conquest or colonisation. In India, they are often referred to as **'Adivasis' or Scheduled Tribes**.
- **Struggles:** Indigenous people worldwide have been fighting for their rights to their land, resources, and cultural identity, which have been threatened by development projects and political marginalization.
- **Global Voice:** The **World Council of Indigenous Peoples** was formed in 1975, which became the first of 11 indigenous NGOs to get consultative status in the UN.
- They demand that their rights to their lands be recognized and that they have a say in decisions affecting their lives.
`
    },
    hi: {
      title: 'अध्याय 8: पर्यावरण और प्राकृतिक संसाधन',
      content: `### वैश्विक राजनीति में पर्यावरण की चिंता
- 1960 के दशक से वैश्विक राजनीति में पर्यावरण के मुद्दे एक महत्वपूर्ण चिंता का विषय बन गए।
- **यह चिंता क्यों?:** कुछ पर्यावरणीय मुद्दों का समाधान केवल अंतर्राष्ट्रीय सहयोग के माध्यम से ही किया जा सकता है। जलवायु परिवर्तन, ओजोन परत का क्षरण, और तटीय प्रदूषण जैसे मुद्दे सभी देशों को प्रभावित करते हैं।
- **'सांझी त्रासदी' (Tragedy of the Commons):** यह शब्द बताता है कि कैसे साझा संसाधनों का अक्सर अत्यधिक उपयोग और क्षरण होता है क्योंकि किसी एक व्यक्ति या देश के पास उन्हें बनाए रखने के लिए कोई प्रोत्साहन नहीं होता है।
- **क्लब ऑफ रोम (1972):** इस वैश्विक थिंक टैंक ने **'लिमिट्स टू ग्रोथ'** नामक एक पुस्तक प्रकाशित की, जिसमें विश्व की बढ़ती जनसंख्या और संसाधनों की कमी के संभावित परिणामों पर प्रकाश डाला गया।
- **यूएनईपी और पृथ्वी शिखर सम्मेलन:** संयुक्त राष्ट्र पर्यावरण कार्यक्रम (यूएनईपी) ने अंतर्राष्ट्रीय सम्मेलन आयोजित करना शुरू किया। सबसे महत्वपूर्ण **1992 में ब्राजील के रियो डी जनेरियो** में आयोजित **संयुक्त राष्ट्र पर्यावरण और विकास सम्मेलन** था। इसे **पृथ्वी शिखर सम्मेलन** भी कहा जाता है।
- **रियो शिखर सम्मेलन का परिणाम:** इसने जलवायु परिवर्तन, जैव विविधता और वानिकी से संबंधित सम्मेलनों का निर्माण किया, और सतत विकास के लिए विकास प्रथाओं की एक सूची **एजेंडा 21** को अपनाया।

### वैश्विक संपदा की सुरक्षा
- **'वैश्विक संपदा' क्या है?:** ये ऐसे संसाधन हैं जो किसी एक राज्य के स्वामित्व में नहीं हैं, बल्कि अंतर्राष्ट्रीय समुदाय द्वारा साझा किए जाते हैं।
- **उदाहरण:** पृथ्वी का वायुमंडल, अंटार्कटिका, समुद्री सतह और बाहरी अंतरिक्ष।
- **संपदा पर सहयोग:** इन संपदाओं की रक्षा के लिए महत्वपूर्ण समझौते हुए हैं:
- - **अंटार्कटिक संधि (1959):** अंटार्कटिका को एक गैर-सैन्यीकृत क्षेत्र के रूप में स्थापित किया, जो वैज्ञानिक अनुसंधान के लिए खुला है।
- - **मॉन्ट्रियल प्रोटोकॉल (1987):** ओजोन परत की रक्षा के लिए क्लोरोफ्लोरोकार्बन (सीएफसी) को चरणबद्ध तरीके से समाप्त करने का एक समझौता।
- - **अंटार्कटिक पर्यावरणीय प्रोटोकॉल (1991):** अंटार्कटिक पर्यावरण के व्यापक संरक्षण के लिए प्रतिबद्ध।

### साझी परंतु अलग-अलग जिम्मेदारियाँ
- यह सिद्धांत स्वीकार करता है कि यद्यपि पर्यावरण की रक्षा के लिए सभी राज्यों की साझा जिम्मेदारी है, **उत्तरी गोलार्ध** के विकसित देशों की औद्योगीकरण के अपने लंबे इतिहास के कारण एक बड़ी ऐतिहासिक जिम्मेदारी है।
- **उत्तर बनाम दक्षिण बहस:**
- - **विकसित देश (उत्तर):** तर्क देते हैं कि पर्यावरण संरक्षण एक साझा जिम्मेदारी है और सभी देशों को समान रूप से भाग लेना चाहिए।
- - **विकासशील देश (दक्षिण):** तर्क देते हैं कि पारिस्थितिक क्षरण काफी हद तक उत्तर द्वारा औद्योगिक विकास का उत्पाद है। उनका मानना है कि उनकी प्राथमिक प्राथमिकता आर्थिक विकास और गरीबी उन्मूलन है।
- **यूएनएफसीसीसी (1992):** जलवायु परिवर्तन पर संयुक्त राष्ट्र फ्रेमवर्क कन्वेंशन ने भी इस सिद्धांत का समर्थन किया, जिसमें कहा गया कि "पक्षों को... समानता के आधार पर और उनकी साझी परंतु अलग-अलग जिम्मेदारियों और संबंधित क्षमताओं के अनुसार कार्य करना चाहिए।"
- **क्योटो प्रोटोकॉल (1997):** इस अंतर्राष्ट्रीय समझौते ने औद्योगिक देशों के लिए अपने ग्रीनहाउस गैस उत्सर्जन को कम करने के लिए बाध्यकारी लक्ष्य निर्धारित किए। चीन और भारत को इन आवश्यकताओं से छूट दी गई थी।

### पर्यावरण के मसलों पर भारत का पक्ष
- भारत ने 2002 में **क्योटो प्रोटोकॉल** पर हस्ताक्षर और पुष्टि की।
- भारत का मानना है कि उत्सर्जन को रोकने की प्रमुख जिम्मेदारी विकसित देशों पर है, जो ऐतिहासिक रूप से सबसे बड़े उत्सर्जक रहे हैं।
- **भारत की पहल:**
- - **राष्ट्रीय ऑटो-ईंधन नीति:** वाहनों के लिए स्वच्छ ईंधन अनिवार्य किया।
- - **ऊर्जा संरक्षण अधिनियम (2001):** ऊर्जा दक्षता में सुधार के लिए पहल की रूपरेखा तैयार की।
- - **विद्युत अधिनियम 2003:** नवीकरणीय ऊर्जा के उपयोग को प्रोत्साहित करता है।
- - **बायोडीजल पर राष्ट्रीय मिशन:** बायोडीजल के उपयोग को बढ़ाने का लक्ष्य है।
- - भारत **अंतर्राष्ट्रीय सौर गठबंधन** में एक प्रमुख भागीदार है।

### संसाधन भू-राजनीति
- यह क्षेत्र प्राकृतिक संसाधनों के संदर्भ में कौन, क्या, कब, कहाँ और कैसे प्राप्त करता है, से संबंधित है।
- **ऐतिहासिक संदर्भ:** पूरे इतिहास में, संसाधनों तक पहुंच अंतर-राज्यीय प्रतिद्वंद्विता का एक प्रमुख कारण रही है। पश्चिमी औपनिवेशिक शक्तियाँ अक्सर संसाधनों को सुरक्षित करने की आवश्यकता से प्रेरित थीं।
- **तेल:** यह वैश्विक रणनीति में सबसे महत्वपूर्ण संसाधन है। तेल की राजनीति धन और शक्ति की कहानी है। तेल से जुड़ा अपार धन राजनीतिक संघर्षों को जन्म देता है। पश्चिम एशिया (मध्य पूर्व) अपने विशाल तेल भंडार के कारण एक महत्वपूर्ण क्षेत्र है।
- **जल:** जल एक और महत्वपूर्ण संसाधन है जो संघर्ष का स्रोत है। नदी के पानी को साझा करने पर विवाद और असहमति राज्यों के बीच आम है, जिससे कुछ लोग 'जल-राजनीति' कहते हैं। उदाहरणों में इज़राइल/सीरिया/जॉर्डन और तुर्की/सीरिया/इराक के बीच संघर्ष शामिल हैं।

### मूलवासियों के अधिकार
- **वे कौन हैं?:** संयुक्त राष्ट्र स्वदेशी आबादी को उन लोगों के वंशज के रूप में परिभाषित करता है जो विजय या उपनिवेशीकरण के समय किसी देश या भौगोलिक क्षेत्र में रहते थे। भारत में, उन्हें अक्सर **'आदिवासी' या अनुसूचित जनजाति** कहा जाता है।
- **संघर्ष:** दुनिया भर में स्वदेशी लोग अपनी भूमि, संसाधनों और सांस्कृतिक पहचान के अपने अधिकारों के लिए लड़ रहे हैं, जिन्हें विकास परियोजनाओं और राजनीतिक हाशिए पर जाने से खतरा है।
- **वैश्विक आवाज:** **विश्व स्वदेशी जन परिषद** का गठन 1975 में हुआ था, जो संयुक्त राष्ट्र में परामर्शी दर्जा प्राप्त करने वाले 11 स्वदेशी गैर-सरकारी संगठनों में से पहला बन गया।
- वे मांग करते हैं कि उनकी भूमि पर उनके अधिकारों को मान्यता दी जाए और उनके जीवन को प्रभावित करने वाले निर्णयों में उनकी बात सुनी जाए।
`
    }
  },
  'globalisation': {
    en: {
      title: 'Chapter 9: Globalisation',
      content: `### What is Globalisation?
- **Definition:** Globalisation is the flow of ideas, capital, commodities, and people across different parts of the world. It involves increasing interconnectedness and integration.
- **Multi-dimensional Concept:** It is not just about economics; it has **political, economic, and cultural** dimensions.
- **Example:** An Indian call centre employee using a Western accent to serve a customer in the US is a manifestation of globalisation.

### Causes of Globalisation
- **Technology:** This is a critical factor. The invention of the **telegraph, the telephone, and the microchip** has revolutionised communication. The internet has created a global village.
- **Interconnectedness:** The ability of ideas, capital, commodities, and people to move more easily from one part of the world to another has been made possible by technological advances.
- **Awareness:** People are now more aware of events happening in other parts of the world, fostering a sense of global connection.

### Political Consequences
- **Erosion of State Capacity:** Globalisation is often said to reduce the capacity of the state. The old **'welfare state'** is now giving way to a more minimalist state that performs only core functions like maintaining law and order and security.
- **Market is the new priority:** The market becomes the prime determinant of economic and social priorities, reducing the state's role in areas like social welfare.
- **State remains important:** Despite the erosion, the state continues to be important. It still performs its essential functions. In some areas, the state's capacity has actually been enhanced by technology.

### Economic Consequences
- **Increased Trade:** Economic globalisation involves a greater flow of trade in commodities across the globe. There are fewer restrictions on imports.
- **Flow of Capital:** The movement of capital between countries has increased. This allows investors to invest their money in countries other than their own.
- **Flow of Ideas:** Ideas now travel across national boundaries, driven by the internet and communication technologies.
- **Role of International Institutions:** Institutions like the **International Monetary Fund (IMF)** and the **World Trade Organisation (WTO)** play a crucial role in shaping economic policies across the world.
- **Criticism:** Critics argue that economic globalisation benefits the rich and a small section of the population, while making the poor even poorer. It has led to **de-industrialisation** in some developing countries and has not generated sufficient employment.

### Cultural Consequences
- **Cultural Homogenisation:** Globalisation leads to the rise of a uniform culture, often referred to as **'Westernisation'**. This is the fear that the culture of the politically and economically dominant society (the West) will take over, and we will lose our local cultures.
- - **Example:** The popularity of blue jeans or American fast food.
- **Cultural Heterogenisation:** This is the opposite effect. Globalisation can also lead to the mixing of cultures, creating new hybrid cultures. It does not lead to the emergence of a single culture but promotes cultural diversity.
- **Strengthening of Local Cultures:** Sometimes, the rise of a uniform global culture makes people more conscious and protective of their own local cultures.

### India and Globalisation
- During the colonial period, India was an exporter of raw materials and an importer of finished goods.
- After independence, India decided to protect its own producers by putting restrictions on imports.
- **New Economic Policy (1991):** Facing a financial crisis, India embarked on a program of economic reforms that sought greater integration with the world economy. This opened up India to foreign trade and investment.

### Resistance to Globalisation
- **Criticism from the Left:** Critics from the political left argue that contemporary globalisation is a new phase of **capitalism** that makes the rich richer and the poor poorer. They are against the weakening of the state.
- **Criticism from the Right:** Critics from the political right are anxious about its political, economic, and cultural effects. They fear the erosion of state sovereignty and the loss of national culture.
- **World Social Forum (WSF):** This is a global platform that brings together a wide coalition of human rights activists, environmentalists, labour, youth, and women activists opposed to neo-liberal globalisation.
`
    },
    hi: {
      title: 'अध्याय 9: वैश्वीकरण',
      content: `### वैश्वीकरण क्या है?
- **परिभाषा:** वैश्वीकरण दुनिया के विभिन्न हिस्सों में विचारों, पूंजी, वस्तुओं और लोगों का प्रवाह है। इसमें बढ़ती अंतर्संबंध और एकीकरण शामिल है।
- **बहु-आयामी अवधारणा:** यह केवल अर्थशास्त्र के बारे में नहीं है; इसके **राजनीतिक, आर्थिक और सांस्कृतिक** आयाम हैं।
- **उदाहरण:** एक भारतीय कॉल सेंटर कर्मचारी जो अमेरिका में एक ग्राहक की सेवा के लिए पश्चिमी लहजे का उपयोग करता है, वैश्वीकरण का एक प्रकटीकरण है।

### वैश्वीकरण के कारण
- **प्रौद्योगिकी:** यह एक महत्वपूर्ण कारक है। **टेलीग्राफ, टेलीफोन और माइक्रोचिप** के आविष्कार ने संचार में क्रांति ला दी है। इंटरनेट ने एक वैश्विक गांव बनाया है।
- **अंतर्संबंध:** विचारों, पूंजी, वस्तुओं और लोगों की दुनिया के एक हिस्से से दूसरे हिस्से में अधिक आसानी से जाने की क्षमता तकनीकी प्रगति से संभव हुई है।
- **जागरूकता:** लोग अब दुनिया के अन्य हिस्सों में होने वाली घटनाओं के बारे में अधिक जागरूक हैं, जिससे वैश्विक जुड़ाव की भावना को बढ़ावा मिलता है।

### राजनीतिक परिणाम
- **राज्य की क्षमता का क्षरण:** अक्सर कहा जाता है कि वैश्वीकरण राज्य की क्षमता को कम करता है। पुराना **'कल्याणकारी राज्य'** अब एक अधिक न्यूनतम राज्य को रास्ता दे रहा है जो केवल कानून और व्यवस्था और सुरक्षा बनाए रखने जैसे मुख्य कार्य करता है।
- **बाजार नई प्राथमिकता है:** बाजार आर्थिक और सामाजिक प्राथमिकताओं का प्रमुख निर्धारक बन जाता है, जिससे सामाजिक कल्याण जैसे क्षेत्रों में राज्य की भूमिका कम हो जाती है।
- **राज्य महत्वपूर्ण बना हुआ है:** क्षरण के बावजूद, राज्य महत्वपूर्ण बना हुआ है। यह अभी भी अपने आवश्यक कार्य करता है। कुछ क्षेत्रों में, प्रौद्योगिकी द्वारा राज्य की क्षमता वास्तव में बढ़ गई है।

### आर्थिक परिणाम
- **व्यापार में वृद्धि:** आर्थिक वैश्वीकरण में दुनिया भर में वस्तुओं के व्यापार का अधिक प्रवाह शामिल है। आयातों पर कम प्रतिबंध हैं।
- **पूंजी का प्रवाह:** देशों के बीच पूंजी की आवाजाही बढ़ी है। यह निवेशकों को अपने पैसे को अपने देश के अलावा अन्य देशों में निवेश करने की अनुमति देता है।
- **विचारों का प्रवाह:** विचार अब इंटरनेट और संचार प्रौद्योगिकियों द्वारा संचालित राष्ट्रीय सीमाओं के पार यात्रा करते हैं।
- **अंतर्राष्ट्रीय संस्थानों की भूमिका:** **अंतर्राष्ट्रीय मुद्रा कोष (IMF)** और **विश्व व्यापार संगठन (WTO)** जैसे संस्थान दुनिया भर में आर्थिक नीतियों को आकार देने में महत्वपूर्ण भूमिका निभाते हैं।
- **आलोचना:** आलोचकों का तर्क है कि आर्थिक वैश्वीकरण अमीरों और आबादी के एक छोटे से हिस्से को लाभ पहुंचाता है, जबकि गरीबों को और भी गरीब बनाता है। इसने कुछ विकासशील देशों में **वि-औद्योगीकरण** को जन्म दिया है और पर्याप्त रोजगार उत्पन्न नहीं किया है।

### सांस्कृतिक परिणाम
- **सांस्कृतिक समरूपीकरण:** वैश्वीकरण एक समान संस्कृति के उदय की ओर ले जाता है, जिसे अक्सर **'पश्चिमीकरण'** कहा जाता है। यह डर है कि राजनीतिक और आर्थिक रूप से प्रमुख समाज (पश्चिम) की संस्कृति हावी हो जाएगी, और हम अपनी स्थानीय संस्कृतियों को खो देंगे।
- - **उदाहरण:** नीली जींस या अमेरिकी फास्ट फूड की लोकप्रियता।
- **सांस्कृतिक विषमरूपता:** यह विपरीत प्रभाव है। वैश्वीकरण संस्कृतियों के मिश्रण का कारण भी बन सकता है, जिससे नई संकर संस्कृतियों का निर्माण होता है। यह एक एकल संस्कृति के उद्भव की ओर नहीं ले जाता है बल्कि सांस्कृतिक विविधता को बढ़ावा देता है।
- **स्थानीय संस्कृतियों का सुदृढ़ीकरण:** कभी-कभी, एक समान वैश्विक संस्कृति का उदय लोगों को अपनी स्थानीय संस्कृतियों के प्रति अधिक जागरूक और सुरक्षात्मक बनाता है।

### भारत और वैश्वीकरण
- औपनिवेशिक काल के दौरान, भारत कच्चे माल का निर्यातक और तैयार माल का आयातक था।
- स्वतंत्रता के बाद, भारत ने आयातों पर प्रतिबंध लगाकर अपने स्वयं के उत्पादकों की रक्षा करने का निर्णय लिया।
- **नई आर्थिक नीति (1991):** एक वित्तीय संकट का सामना करते हुए, भारत ने आर्थिक सुधारों का एक कार्यक्रम शुरू किया जिसने विश्व अर्थव्यवस्था के साथ अधिक एकीकरण की मांग की। इसने भारत को विदेशी व्यापार और निवेश के लिए खोल दिया।

### वैश्वीकरण का प्रतिरोध
- **वामपंथ की ओर से आलोचना:** राजनीतिक वामपंथ के आलोचकों का तर्क है कि समकालीन वैश्वीकरण **पूंजीवाद** का एक नया चरण है जो अमीरों को और अमीर और गरीबों को और गरीब बनाता है। वे राज्य के कमजोर होने के खिलाफ हैं।
- **दक्षिणपंथ की ओर से आलोचना:** राजनीतिक दक्षिणपंथ के आलोचक इसके राजनीतिक, आर्थिक और सांस्कृतिक प्रभावों के बारे में चिंतित हैं। उन्हें राज्य की संप्रभुता के क्षरण और राष्ट्रीय संस्कृति के नुकसान का डर है।
- **वर्ल्ड सोशल फोरम (WSF):** यह एक वैश्विक मंच है जो नव-उदारवादी वैश्वीकरण का विरोध करने वाले मानवाधिकार कार्यकर्ताओं, पर्यावरणविदों, श्रमिकों, युवाओं और महिला कार्यकर्ताओं के एक विस्तृत गठबंधन को एक साथ लाता है।
`
    }
  },
    'challenges-of-nation-building': {
    en: {
      title: 'Chapter 1: Challenges of Nation Building',
      content: `### Challenges For The New Nation
- India became independent at the hour of midnight on 14-15 August 1947.
- Jawaharlal Nehru, the first Prime Minister, addressed a special session of the Constituent Assembly with his famous **'Tryst with Destiny'** speech.
- Post-independence, there was a consensus on two main goals:
- 1. **Running the country through democratic government.**
- 2. **Ensuring the development and well-being of all sections of society.**
- However, the country was born in very difficult circumstances, facing three major challenges.

### Three Challenges
- **1. To Shape a Nation:** The first challenge was to shape a nation that was united, yet accommodative of the diversity in our society. India is a land of continental size and diversity, with different languages, cultures, and religions. The partition of the country created serious doubts about the future of India.
- **2. To Establish Democracy:** The second challenge was to establish a democratic system. The Constitution granted fundamental rights and the right to vote to every citizen. India adopted representative democracy based on a parliamentary form of government. The challenge was to develop democratic practices in line with the Constitution.
- **3. To Ensure Development and Well-being:** The third challenge was to ensure the development and well-being of the entire society. The Constitution laid down the principle of equality and special protection for socially disadvantaged groups and minorities. The real challenge was to evolve effective policies for economic development and eradication of poverty.

### Partition: Displacement and Rehabilitation
- **The 'Two-Nation Theory':** This theory, advanced by the Muslim League, stated that India consisted of two 'people', Hindus and Muslims, and therefore demanded Pakistan, a separate country for the Muslims. The Congress opposed this theory.
- **Process of Partition:**
- - **No single belt of Muslim majority:** Muslim populations were concentrated in two areas, one in the west and one in the east. There was no way to join them. It was decided that Pakistan would comprise two territories, West and East Pakistan.
- - **Not all Muslim-majority areas wanted to join Pakistan:** **Khan Abdul Ghaffar Khan**, the leader of the North West Frontier Province (NWFP), was staunchly opposed to the two-nation theory. His voice was ignored, and the NWFP was merged with Pakistan.
- - **Problem of Punjab and Bengal:** These two provinces had large non-Muslim majority areas. It was decided to bifurcate these provinces, which caused the deepest trauma of Partition.
- - **Problem of Minorities:** Lakhs of Hindus and Sikhs in what was now Pakistan, and a large number of Muslims on the Indian side of Punjab and Bengal, became undesirable aliens in their own homes.
- **Consequences of Partition:**
- - The year 1947 saw one of the largest, most abrupt, unplanned, and tragic transfers of population in human history.
- - There were killings and atrocities on both sides of the border in the name of religion.
- - Minorities on both sides fled their homes and often had to live in refugee camps.
- - Women were abducted, raped, and forced to convert.
- - It is estimated that the Partition forced about **80 lakh** people to migrate across the new border. Between **5 to 10 lakh** people were killed in Partition-related violence.

### Integration of Princely States
- British India was divided into British Indian Provinces and Princely States.
- The Princely States were ruled by princes who enjoyed some form of control over their internal affairs under British supremacy. There were **565** such states.
- With the end of British rule, the princely states were given the option to join either India or Pakistan or remain independent.
- The government’s approach was guided by three considerations:
- - 1. The people of most of the princely states clearly wanted to become part of the Indian union.
- - 2. The government was prepared to be flexible in giving autonomy to some regions.
- - 3. In the backdrop of Partition, the integration and consolidation of the territorial boundaries of the nation had assumed supreme importance.
- **Sardar Vallabhbhai Patel**, India's first Deputy Prime Minister and Home Minister, played a historic role in negotiating with the rulers of the princely states and bringing most of them into the Indian Union.
- The accession of **Junagadh, Hyderabad, Kashmir, and Manipur** proved more difficult than the rest.

### Reorganisation of States
- The boundaries of the states needed to be redrawn to reflect linguistic and cultural plurality without affecting the unity of the nation.
- **The Vishalandhra movement** in the old Madras province demanded that the Telugu-speaking areas be separated to form a separate Andhra state.
- **Potti Sriramulu**, a Congress leader, went on an indefinite fast that led to his death after 56 days, causing great unrest. In December 1952, the Prime Minister announced the formation of a separate Andhra State.
- This led to the formation of the **States Reorganisation Commission (SRC)** in 1953.
- The Commission, in its report, accepted that the boundaries of the state should reflect the boundaries of different languages.
- On the basis of its report, the **States Reorganisation Act was passed in 1956**. This led to the creation of **14 states and 6 union territories**.
`
    },
    hi: {
      title: 'अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ',
      content: `### नए राष्ट्र की चुनौतियाँ
- भारत 14-15 अगस्त 1947 की मध्यरात्रि को स्वतंत्र हुआ।
- प्रथम प्रधानमंत्री, जवाहरलाल नेहरू ने अपने प्रसिद्ध भाषण **'भाग्यवधू से चिर-प्रतीक्षित भेंट' (ट्रिस्ट विद डेस्टिनी)** के साथ संविधान सभा के एक विशेष सत्र को संबोधित किया।
- स्वतंत्रता के बाद, दो मुख्य लक्ष्यों पर आम सहमति थी:
- 1. **देश का शासन लोकतांत्रिक सरकार के माध्यम से चलाना।**
- 2. **समाज के सभी वर्गों के विकास और कल्याण को सुनिश्चित करना।**
- हालाँकि, देश का जन्म बहुत ही कठिन परिस्थितियों में हुआ था, जिसे तीन प्रमुख चुनौतियों का सामना करना पड़ा।

### तीन चुनौतियाँ
- **1. एक राष्ट्र को आकार देना:** पहली चुनौती एक ऐसे राष्ट्र को आकार देना था जो एकजुट हो, फिर भी हमारे समाज में विविधता को समायोजित करने वाला हो। भारत महाद्वीपीय आकार और विविधता की भूमि है, जिसमें विभिन्न भाषाएँ, संस्कृतियाँ और धर्म हैं। देश के विभाजन ने भारत के भविष्य के बारे में गंभीर संदेह पैदा कर दिए।
- **2. लोकतंत्र स्थापित करना:** दूसरी चुनौती एक लोकतांत्रिक व्यवस्था स्थापित करना था। संविधान ने प्रत्येक नागरिक को मौलिक अधिकार और मतदान का अधिकार प्रदान किया। भारत ने संसदीय स्वरूप की सरकार पर आधारित प्रतिनिधि लोकतंत्र को अपनाया। चुनौती संविधान के अनुरूप लोकतांत्रिक प्रथाओं को विकसित करना था।
- **3. विकास और कल्याण सुनिश्चित करना:** तीसरी चुनौती पूरे समाज के विकास और कल्याण को सुनिश्चित करना था। संविधान ने समानता के सिद्धांत और सामाजिक रूप से वंचित समूहों और अल्पसंख्यकों के लिए विशेष सुरक्षा निर्धारित की। असली चुनौती आर्थिक विकास और गरीबी उन्मूलन के लिए प्रभावी नीतियां विकसित करना था।

### विभाजन: विस्थापन और पुनर्वास
- **'द्वि-राष्ट्र सिद्धांत':** मुस्लिम लीग द्वारा उन्नत इस सिद्धांत में कहा गया था कि भारत में दो 'लोग', हिंदू और मुसलमान शामिल थे, और इसलिए मुसलमानों के लिए एक अलग देश पाकिस्तान की मांग की। कांग्रेस ने इस सिद्धांत का विरोध किया।
- **विभाजन की प्रक्रिया:**
- - **मुस्लिम बहुमत का कोई एकल क्षेत्र नहीं:** मुस्लिम आबादी दो क्षेत्रों में केंद्रित थी, एक पश्चिम में और एक पूर्व में। उन्हें जोड़ने का कोई तरीका नहीं था। यह तय किया गया कि पाकिस्तान में दो क्षेत्र, पश्चिमी और पूर्वी पाकिस्तान शामिल होंगे।
- - **सभी मुस्लिम-बहुल क्षेत्र पाकिस्तान में शामिल नहीं होना चाहते थे:** उत्तर पश्चिम सीमा प्रांत (NWFP) के नेता **खान अब्दुल गफ्फार खान** द्वि-राष्ट्र सिद्धांत के कट्टर विरोधी थे। उनकी आवाज को नजरअंदाज कर दिया गया, और NWFP को पाकिस्तान में मिला दिया गया।
- - **पंजाब और बंगाल की समस्या:** इन दो प्रांतों में बड़े गैर-मुस्लिम बहुल क्षेत्र थे। इन प्रांतों का विभाजन करने का निर्णय लिया गया, जिससे विभाजन का सबसे गहरा आघात लगा।
- - **अल्पसंख्यकों की समस्या:** जो अब पाकिस्तान था, उसमें लाखों हिंदू और सिख, और पंजाब और बंगाल के भारतीय हिस्से में बड़ी संख्या में मुसलमान, अपने ही घरों में अवांछनीय विदेशी बन गए।
- **विभाजन के परिणाम:**
- - वर्ष 1947 में मानव इतिहास में सबसे बड़े, सबसे अचानक, अनियोजित और दुखद जनसंख्या हस्तांतरण में से एक देखा गया।
- - धर्म के नाम पर सीमा के दोनों ओर हत्याएं और अत्याचार हुए।
- - दोनों तरफ के अल्पसंख्यकों ने अपने घर छोड़ दिए और अक्सर शरणार्थी शिविरों में रहना पड़ा।
- - महिलाओं का अपहरण, बलात्कार और धर्म परिवर्तन के लिए मजबूर किया गया।
- - अनुमान है कि विभाजन ने लगभग **80 लाख** लोगों को नई सीमा के पार प्रवास करने के लिए मजबूर किया। विभाजन से संबंधित हिंसा में **5 से 10 लाख** लोगों की मौत हो गई।

### रियासतों का एकीकरण
- ब्रिटिश भारत को ब्रिटिश भारतीय प्रांतों और रियासतों में विभाजित किया गया था।
- रियासतों पर राजकुमारों का शासन था, जिन्हें ब्रिटिश वर्चस्व के तहत अपने आंतरिक मामलों पर कुछ हद तक नियंत्रण प्राप्त था। ऐसी **565** रियासतें थीं।
- ब्रिटिश शासन के अंत के साथ, रियासतों को भारत या पाकिस्तान में शामिल होने या स्वतंत्र रहने का विकल्प दिया गया था।
- सरकार का दृष्टिकोण तीन विचारों द्वारा निर्देशित था:
- - 1. अधिकांश रियासतों के लोग स्पष्ट रूप से भारतीय संघ का हिस्सा बनना चाहते थे।
- - 2. सरकार कुछ क्षेत्रों को स्वायत्तता देने में लचीला होने के लिए तैयार थी।
- - 3. विभाजन की पृष्ठभूमि में, राष्ट्र की क्षेत्रीय सीमाओं के एकीकरण और समेकन ने सर्वोच्च महत्व मान लिया था।
- **सरदार वल्लभभाई पटेल**, भारत के पहले उप प्रधानमंत्री और गृह मंत्री, ने रियासतों के शासकों के साथ बातचीत करने और उनमें से अधिकांश को भारतीय संघ में लाने में एक ऐतिहासिक भूमिका निभाई।
- **जूनागढ़, हैदराबाद, कश्मीर और मणिपुर** का विलय बाकी की तुलना में अधिक कठिन साबित हुआ।

### राज्यों का पुनर्गठन
- राष्ट्र की एकता को प्रभावित किए बिना भाषाई और सांस्कृतिक बहुलता को प्रतिबिंबित करने के लिए राज्यों की सीमाओं को फिर से खींचने की आवश्यकता थी।
- पुराने मद्रास प्रांत में **विशालान्ध्र आंदोलन** ने मांग की कि तेलुगु भाषी क्षेत्रों को एक अलग आंध्र राज्य बनाने के लिए अलग किया जाए।
- एक कांग्रेस नेता **पोट्टी श्रीरामुलु** अनिश्चितकालीन अनशन पर चले गए, जिसके कारण 56 दिनों के बाद उनकी मृत्यु हो गई, जिससे भारी अशांति फैल गई। दिसंबर 1952 में, प्रधानमंत्री ने एक अलग आंध्र राज्य के गठन की घोषणा की।
- इससे 1953 में **राज्य पुनर्गठन आयोग (SRC)** का गठन हुआ।
- आयोग ने अपनी रिपोर्ट में स्वीकार किया कि राज्य की सीमाएं विभिन्न भाषाओं की सीमाओं को प्रतिबिंबित करनी चाहिए।
- इसकी रिपोर्ट के आधार पर, **राज्य पुनर्गठन अधिनियम 1956 में पारित किया गया था**। इससे **14 राज्यों और 6 केंद्र शासित प्रदेशों** का निर्माण हुआ।
`
    }
  },
  'era-of-one-party-dominance': {
    en: {
      title: 'Chapter 2: Era of One-Party Dominance',
      content: `### Challenge of building democracy
- After achieving independence, the leaders of India decided to establish a democracy.
- **Constitution:** The Indian Constitution was adopted on 26 November 1949 and signed on 24 January 1950. It came into effect on 26 January 1950.
- **Election Commission:** The Election Commission of India was set up in January 1950. **Sukumar Sen** became the first Chief Election Commissioner.

### Challenges for the First General Election
- Holding a free and fair election in a country of India's size was a massive challenge.
- **Voter List:** Preparing the first draft of the electoral rolls was difficult as nearly 40 lakh women were not recorded by name but as "wife of..." or "daughter of...".
- **Scale:** There were **17 crore** eligible voters, who had to elect about **3,200 MLAs and 489 MPs**.
- **Literacy:** Only **15 per cent** of the voters were literate, posing a challenge for the voting method. Special methods like using symbols on ballot boxes for each party were devised.
- It required about **3 lakh officers and polling staff** to be trained.

### First General Election (1952)
- The election was originally scheduled for 1951 but had to be postponed twice and was finally held from October 1951 to February 1952.
- **Result:** The **Indian National Congress (INC)** won a landslide victory, securing **364 out of the 489 seats** in the Lok Sabha. The **Communist Party of India (CPI)** came in second with 16 seats.
- Jawaharlal Nehru became the first elected Prime Minister of India.

### Congress Dominance in the First Three Elections
- The Congress maintained its dominance in the first three general elections (1952, 1957, and 1962).
- It won a three-fourths majority of seats in all three elections.
- This one-party dominance in India was different from other countries because it happened under democratic conditions, with free and fair competition from other parties.

### Nature of Congress Dominance
- **Legacy of the Freedom Struggle:** The Congress was seen as the inheritor of the national movement. Many leaders who were at the forefront of the struggle were now Congress candidates.
- **Well-Organized Party:** It was a well-organized party with a network that spread down to the local levels.
- **All-inclusive Nature:** The Congress was a **'social and ideological coalition'**. It represented a rainbow-like gathering of diverse interests and classes. This meant that any group could find a space within the Congress, preventing it from becoming an exclusive party.
- **Management of Factions:** The coalition-like nature of the Congress tolerated and encouraged various **factions** (groups within the party). These factions, based on either ideological considerations or personal ambitions, were an internal balancing mechanism, preventing the party from becoming rigid.

### Emergence of Opposition Parties
- Many opposition parties had emerged even before the first general election.
- **Socialist Party:** Formed in 1934 by a group of young leaders within the Congress who wanted a more radical and egalitarian Congress. They split from the Congress in 1948. Key leaders included **Jayaprakash Narayan and Rammanohar Lohia**.
- **Communist Party of India (CPI):** Inspired by the Bolshevik revolution in Russia, communist groups emerged in the early 1920s. The party was mainly strong in states like Andhra Pradesh, West Bengal, Bihar, and Kerala.
- **Swatantra Party:** Formed in August 1959. It advocated for a market-based economy and opposed state intervention. It was critical of the public sector and favored closer ties with the USA. Key leaders included **C. Rajagopalachari and K.M. Munshi**.
- **Bharatiya Jana Sangh:** Formed in 1951 by **Syama Prasad Mukherjee**. Its ideology was based on the principles of **'One Country, One Culture, and One Nation'**. It called for the reunion of India and Pakistan to form 'Akhand Bharat'.
`
    },
    hi: {
      title: 'अध्याय 2: एक दल के प्रभुत्व का दौर',
      content: `### लोकतंत्र स्थापित करने की चुनौती
- स्वतंत्रता प्राप्त करने के बाद, भारत के नेताओं ने लोकतंत्र स्थापित करने का निर्णय लिया।
- **संविधान:** भारतीय संविधान 26 नवंबर 1949 को अपनाया गया और 24 जनवरी 1950 को इस पर हस्ताक्षर किए गए। यह 26 जनवरी 1950 को लागू हुआ।
- **चुनाव आयोग:** भारत का चुनाव आयोग जनवरी 1950 में स्थापित किया गया था। **सुकुमार सेन** पहले मुख्य चुनाव आयुक्त बने।

### पहले आम चुनाव के लिए चुनौतियाँ
- भारत के आकार के देश में एक स्वतंत्र और निष्पक्ष चुनाव कराना एक बहुत बड़ी चुनौती थी।
- **मतदाता सूची:** मतदाता सूची का पहला मसौदा तैयार करना मुश्किल था क्योंकि लगभग 40 लाख महिलाओं का नाम दर्ज नहीं था, बल्कि उन्हें "की पत्नी..." या "की बेटी..." के रूप में दर्ज किया गया था।
- **पैमाना:** **17 करोड़** पात्र मतदाता थे, जिन्हें लगभग **3,200 विधायक और 489 सांसद** चुनने थे।
- **साक्षरता:** केवल **15 प्रतिशत** मतदाता ही साक्षर थे, जिससे मतदान पद्धति के लिए एक चुनौती उत्पन्न हुई। प्रत्येक पार्टी के लिए मतपेटियों पर प्रतीकों का उपयोग करने जैसी विशेष विधियाँ तैयार की गईं।
- इसके लिए लगभग **3 लाख अधिकारियों और मतदान कर्मचारियों** को प्रशिक्षित करने की आवश्यकता थी।

### पहला आम चुनाव (1952)
- चुनाव मूल रूप से 1951 के लिए निर्धारित किया गया था, लेकिन इसे दो बार स्थगित करना पड़ा और अंततः अक्टूबर 1951 से फरवरी 1952 तक आयोजित किया गया।
- **परिणाम:** **भारतीय राष्ट्रीय कांग्रेस (INC)** ने लोकसभा की 489 सीटों में से **364 सीटें** हासिल करके एक शानदार जीत हासिल की। **भारतीय कम्युनिस्ट पार्टी (CPI)** 16 सीटों के साथ दूसरे स्थान पर रही।
- जवाहरलाल नेहरू भारत के पहले निर्वाचित प्रधानमंत्री बने।

### पहले तीन चुनावों में कांग्रेस का प्रभुत्व
- कांग्रेस ने पहले तीन आम चुनावों (1952, 1957 और 1962) में अपना प्रभुत्व बनाए रखा।
- इसने तीनों चुनावों में तीन-चौथाई बहुमत से सीटें जीतीं।
- भारत में यह एक-दलीय प्रभुत्व अन्य देशों से अलग था क्योंकि यह लोकतांत्रिक परिस्थितियों में, अन्य दलों से स्वतंत्र और निष्पक्ष प्रतिस्पर्धा के साथ हुआ था।

### कांग्रेस के प्रभुत्व की प्रकृति
- **स्वतंत्रता संग्राम की विरासत:** कांग्रेस को राष्ट्रीय आंदोलन के उत्तराधिकारी के रूप में देखा जाता था। संघर्ष में सबसे आगे रहने वाले कई नेता अब कांग्रेस के उम्मीदवार थे।
- **सुसंगठित पार्टी:** यह एक सुसंगठित पार्टी थी जिसका नेटवर्क स्थानीय स्तर तक फैला हुआ था।
- **सर्व-समावेशी प्रकृति:** कांग्रेस एक **'सामाजिक और वैचारिक गठबंधन'** थी। इसने विविध हितों और वर्गों के एक इंद्रधनुषी जमावड़े का प्रतिनिधित्व किया। इसका मतलब था कि कोई भी समूह कांग्रेस के भीतर एक जगह पा सकता था, जिससे यह एक विशेष पार्टी बनने से बच गई।
- **गुटों का प्रबंधन:** कांग्रेस की गठबंधन जैसी प्रकृति ने विभिन्न **गुटों** (पार्टी के भीतर के समूहों) को सहन और प्रोत्साहित किया। ये गुट, चाहे वैचारिक विचारों पर आधारित हों या व्यक्तिगत महत्वाकांक्षाओं पर, एक आंतरिक संतुलन तंत्र थे, जो पार्टी को कठोर बनने से रोकते थे।

### विपक्षी दलों का उदय
- कई विपक्षी दल पहले आम चुनाव से पहले ही उभर चुके थे।
- **सोशलिस्ट पार्टी:** 1934 में कांग्रेस के भीतर युवा नेताओं के एक समूह द्वारा गठित की गई जो एक अधिक कट्टरपंथी और समतावादी कांग्रेस चाहते थे। वे 1948 में कांग्रेस से अलग हो गए। प्रमुख नेताओं में **जयप्रकाश नारायण और राममनोहर लोहिया** शामिल थे।
- **भारतीय कम्युनिस्ट पार्टी (CPI):** रूस में बोल्शेविक क्रांति से प्रेरित होकर, 1920 के दशक की शुरुआत में कम्युनिस्ट समूह उभरे। पार्टी मुख्य रूप से आंध्र प्रदेश, पश्चिम बंगाल, बिहार और केरल जैसे राज्यों में मजबूत थी।
- **स्वतंत्र पार्टी:** अगस्त 1959 में गठित। इसने बाजार आधारित अर्थव्यवस्था की वकालत की और राज्य के हस्तक्षेप का विरोध किया। यह सार्वजनिक क्षेत्र की आलोचक थी और संयुक्त राज्य अमेरिका के साथ घनिष्ठ संबंधों के पक्ष में थी। प्रमुख नेताओं में **सी. राजगोपालाचारी और के.एम. मुंशी** शामिल थे।
- **भारतीय जनसंघ:** 1951 में **श्यामा प्रसाद मुखर्जी** द्वारा गठित। इसकी विचारधारा **'एक देश, एक संस्कृति और एक राष्ट्र'** के सिद्धांतों पर आधारित थी। इसने 'अखंड भारत' बनाने के लिए भारत और पाकिस्तान के पुनर्मिलन का आह्वान किया।
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
      content: `### Background to Emergency
- **Economic Context:** The country faced severe economic challenges in the early 1970s. The **Bangladesh crisis** had put a heavy strain on the economy. The **1971 India-Pak war** was followed by a halt in US aid. The **oil price hike** in international markets led to high inflation. Industrial growth was low, and unemployment was very high.
- **Gujarat Movement (January 1974):** Students in Gujarat protested against rising prices and corruption. The movement became widespread, leading to the imposition of President's rule. The opposition parties demanded fresh elections, which were held in June 1975, and the Congress was defeated.
- **Bihar Movement (March 1974):** Students in Bihar also protested against rising prices, unemployment, and corruption. They invited veteran Gandhian leader **Jayaprakash Narayan (JP)** to lead them. JP accepted on the condition that the movement remains non-violent and does not limit itself to Bihar. He demanded the dismissal of the Congress government in Bihar and gave a call for **'Total Revolution'** in the social, economic, and political spheres.
- **Conflict with Judiciary:** The government had a difficult relationship with the judiciary. The Supreme Court rejected the government's arguments in cases like the **Kesavananda Bharati Case (1973)**, where the court ruled that there are some basic features of the Constitution that Parliament cannot amend. The appointment of **A. N. Ray** as the Chief Justice of India, superseding three senior judges, also created a major controversy.

### Declaration of Emergency
- **The Allahabad High Court Verdict (June 12, 1975):** Justice Jagmohanlal Sinha of the Allahabad High Court declared Indira Gandhi's Lok Sabha election of 1971 as invalid on the grounds of using government machinery for her election campaign. This meant she could no longer remain an MP and Prime Minister.
- **Response of the Opposition:** JP led a massive demonstration in Delhi's Ramlila ground on June 25, 1975, and announced a nationwide satyagraha, asking the army, the police, and government employees not to obey 'illegal and immoral orders'.
- **The Government's Response:** In response, the government declared a state of **Emergency on the night of 25 June 1975**. The government argued that there was a threat of 'internal disturbances' (as per **Article 352** of the Constitution) and that the opposition's actions were aimed at destabilizing the country.

### Consequences of Emergency
- **Suspension of Fundamental Rights:** The government suspended the enforcement of most fundamental rights, including the right to move the court for the restoration of one's rights.
- **Preventive Detention:** A large number of opposition leaders and workers were arrested under laws like the **Maintenance of Internal Security Act (MISA)**.
- **Press Censorship:** The government imposed strict censorship on the press. Newspapers were asked to get prior approval for all material to be published.
- **Constitutional Amendments:** The most controversial was the **42nd Amendment (1976)**, which made several changes to the Constitution, such as making the judiciary's powers subordinate to the Parliament and extending the duration of the Lok Sabha.
- The government also put forward a **20-Point Programme** to bring about social and economic development.

### Lessons of the Emergency
- **Weaknesses and Strengths of Indian Democracy:** It brought out both the weaknesses and strengths of India's democracy. The ease with which the Emergency was imposed showed that democratic functioning could be suspended. However, it also showed that normal democratic functioning could be resumed within a short span of time.
- **Importance of Civil Liberties:** The Emergency made everyone more aware of the value of civil liberties.
- **Ambiguities in the Constitution:** The Emergency highlighted some ambiguities regarding the provision of 'internal disturbances'. This was later amended to **'armed rebellion'** to make it more specific.

### Politics after Emergency
- **The 1977 Lok Sabha Elections:** The government, confident of its position, announced elections in January 1977.
- **The Janata Party:** All major opposition parties came together to form a new party, the **Janata Party**, under the leadership of Jayaprakash Narayan.
- **The Verdict:** For the first time since independence, the **Congress party was defeated** in the Lok Sabha elections. The Janata Party and its allies won a massive majority.
- **The Janata Government:** The Janata Party government was formed with **Morarji Desai** as the Prime Minister. However, the government was plagued by internal competition and factionalism and could not remain in power for long. It collapsed in less than 18 months.
- **Return of Congress:** Fresh Lok Sabha elections were held in 1980, in which the Congress party, led by Indira Gandhi, came back to power with a landslide victory.
`
    },
    hi: {
      title: 'अध्याय 6: लोकतांत्रिक व्यवस्था का संकट',
      content: `### आपातकाल की पृष्ठभूमि
- **आर्थिक संदर्भ:** 1970 के दशक की शुरुआत में देश को गंभीर आर्थिक चुनौतियों का सामना करना पड़ा। **बांग्लादेश संकट** ने अर्थव्यवस्था पर भारी दबाव डाला था। **1971 के भारत-पाक युद्ध** के बाद अमेरिकी सहायता बंद हो गई थी। अंतर्राष्ट्रीय बाजारों में **तेल की कीमतों में वृद्धि** से उच्च मुद्रास्फीति हुई। औद्योगिक विकास कम था, और बेरोजगारी बहुत अधिक थी।
- **गुजरात आंदोलन (जनवरी 1974):** गुजरात में छात्रों ने बढ़ती कीमतों और भ्रष्टाचार के खिलाफ विरोध प्रदर्शन किया। आंदोलन व्यापक हो गया, जिससे राष्ट्रपति शासन लगाना पड़ा। विपक्षी दलों ने नए सिरे से चुनाव की मांग की, जो जून 1975 में हुए, और कांग्रेस हार गई।
- **बिहार आंदोलन (मार्च 1974):** बिहार में भी छात्रों ने बढ़ती कीमतों, बेरोजगारी और भ्रष्टाचार के खिलाफ विरोध प्रदर्शन किया। उन्होंने अनुभवी गांधीवादी नेता **जयप्रकाश नारायण (जेपी)** को उनका नेतृत्व करने के लिए आमंत्रित किया। जेपी ने इस शर्त पर स्वीकार किया कि आंदोलन अहिंसक रहेगा और खुद को बिहार तक सीमित नहीं रखेगा। उन्होंने बिहार में कांग्रेस सरकार की बर्खास्तगी की मांग की और सामाजिक, आर्थिक और राजनीतिक क्षेत्रों में **'संपूर्ण क्रांति'** का आह्वान किया।
- **न्यायपालिका के साथ संघर्ष:** सरकार के न्यायपालिका के साथ संबंध कठिन थे। सुप्रीम कोर्ट ने **केशवानंद भारती मामले (1973)** जैसे मामलों में सरकार के तर्कों को खारिज कर दिया, जहाँ अदालत ने फैसला सुनाया कि संविधान की कुछ बुनियादी विशेषताएं हैं जिन्हें संसद संशोधित नहीं कर सकती है। तीन वरिष्ठ न्यायाधीशों को हटाकर **ए. एन. रे** को भारत के मुख्य न्यायाधीश के रूप में नियुक्त करने से भी एक बड़ा विवाद खड़ा हो गया।

### आपातकाल की घोषणा
- **इलाहाबाद उच्च न्यायालय का फैसला (12 जून, 1975):** इलाहाबाद उच्च न्यायालय के न्यायमूर्ति जगमोहनलाल सिन्हा ने अपने चुनाव अभियान के लिए सरकारी मशीनरी का उपयोग करने के आधार पर इंदिरा गांधी के 1971 के लोकसभा चुनाव को अमान्य घोषित कर दिया। इसका मतलब था कि वह अब सांसद और प्रधानमंत्री नहीं रह सकती थीं।
- **विपक्ष की प्रतिक्रिया:** जेपी ने 25 जून, 1975 को दिल्ली के रामलीला मैदान में एक बड़े प्रदर्शन का नेतृत्व किया और एक राष्ट्रव्यापी सत्याग्रह की घोषणा की, जिसमें सेना, पुलिस और सरकारी कर्मचारियों से 'अवैध और अनैतिक आदेशों' का पालन न करने के लिए कहा गया।
- **सरकार की प्रतिक्रिया:** जवाब में, सरकार ने **25 जून 1975 की रात को आपातकाल** की स्थिति घोषित कर दी। सरकार ने तर्क दिया कि 'आंतरिक गड़बड़ी' का खतरा था (संविधान के **अनुच्छेद 352** के अनुसार) और विपक्ष की कार्रवाइयों का उद्देश्य देश को अस्थिर करना था।

### आपातकाल के परिणाम
- **मौलिक अधिकारों का निलंबन:** सरकार ने अधिकांश मौलिक अधिकारों के प्रवर्तन को निलंबित कर दिया, जिसमें किसी के अधिकारों की बहाली के लिए अदालत जाने का अधिकार भी शामिल था।
- **निवारक नजरबंदी:** **आंतरिक सुरक्षा व्यवस्था अधिनियम (मीसा)** जैसे कानूनों के तहत बड़ी संख्या में विपक्षी नेताओं और कार्यकर्ताओं को गिरफ्तार किया गया।
- **प्रेस सेंसरशिप:** सरकार ने प्रेस पर सख्त सेंसरशिप लगा दी। समाचार पत्रों को प्रकाशित होने वाली सभी सामग्री के लिए पूर्व अनुमोदन प्राप्त करने के लिए कहा गया।
- **संवैधानिक संशोधन:** सबसे विवादास्पद **42वां संशोधन (1976)** था, जिसने संविधान में कई बदलाव किए, जैसे कि न्यायपालिका की शक्तियों को संसद के अधीन करना और लोकसभा की अवधि बढ़ाना।
- सरकार ने सामाजिक और आर्थिक विकास लाने के लिए एक **20-सूत्रीय कार्यक्रम** भी प्रस्तुत किया।

### आपातकाल से सीख
- **भारतीय लोकतंत्र की कमजोरियां और ताकतें:** इसने भारत के लोकतंत्र की कमजोरियों और ताकतों दोनों को सामने लाया। जिस आसानी से आपातकाल लगाया गया, उससे पता चला कि लोकतांत्रिक कामकाज को निलंबित किया जा सकता है। हालांकि, इसने यह भी दिखाया कि सामान्य लोकतांत्रिक कामकाज को थोड़े समय के भीतर फिर से शुरू किया जा सकता है।
- **नागरिक स्वतंत्रता का महत्व:** आपातकाल ने सभी को नागरिक स्वतंत्रता के मूल्य के बारे में अधिक जागरूक बनाया।
- **संविधान में अस्पष्टता:** आपातकाल ने 'आंतरिक गड़बड़ी' के प्रावधान के संबंध में कुछ अस्पष्टताओं पर प्रकाश डाला। बाद में इसे और अधिक विशिष्ट बनाने के लिए **'सशस्त्र विद्रोह'** में संशोधित किया गया।

### आपातकाल के बाद की राजनीति
- **1977 के लोकसभा चुनाव:** अपनी स्थिति के प्रति आश्वस्त सरकार ने जनवरी 1977 में चुनावों की घोषणा की।
- **जनता पार्टी:** सभी प्रमुख विपक्षी दल जयप्रकाश नारायण के नेतृत्व में एक नई पार्टी, **जनता पार्टी** बनाने के लिए एक साथ आए।
- **जनादेश:** स्वतंत्रता के बाद पहली बार, लोकसभा चुनावों में **कांग्रेस पार्टी हार गई**। जनता पार्टी और उसके सहयोगियों ने भारी बहुमत हासिल किया।
- **जनता सरकार:** **मोरारजी देसाई** को प्रधानमंत्री के रूप में लेकर जनता पार्टी की सरकार बनी। हालांकि, सरकार आंतरिक प्रतिस्पर्धा और गुटबाजी से त्रस्त थी और लंबे समय तक सत्ता में नहीं रह सकी। यह 18 महीने से भी कम समय में ढह गई।
- **कांग्रेस की वापसी:** 1980 में नए लोकसभा चुनाव हुए, जिसमें इंदिरा गांधी के नेतृत्व वाली कांग्रेस पार्टी ने शानदार जीत के साथ सत्ता में वापसी की।
`
    }
  },
  'rise-of-popular-movements': {
    en: {
      title: 'Chapter 7: Rise of Popular Movements',
      content: `### Nature of Popular Movements
- The 1970s saw the rise of various popular movements. These were different from traditional political parties.
- They were **'party-less'** movements, often led by students, middle-class people, and social activists.
- These movements raised issues that were not being addressed by the mainstream political parties, such as environmental protection, women's rights, and issues of caste and class.
- They represented a new form of political participation for groups who felt their voices were not being heard in electoral politics.

### Chipko Movement (Early 1970s)
- **What was it?:** A unique environmental movement that started in the hills of **Uttarakhand** (then part of Uttar Pradesh).
- **The Issue:** Villagers protested against the felling of trees by commercial contractors. The government had denied the villagers permission to cut ash trees for making agricultural tools, but had allotted the same patch of forest to a sports goods manufacturer.
- **Method of Protest:** Villagers, especially **women**, used a novel tactic: they **hugged the trees** (hence the name 'Chipko', which means 'to stick to') to prevent them from being cut.
- **Key Demands:**
- - The movement was not just about saving trees. It raised questions about **local communities' control over their natural resources**.
- - They demanded that no forest-exploiting contracts should be given to outsiders.
- - The movement also highlighted the issue of ecological balance and sustainable development.
- **Key Leader:** **Sunderlal Bahuguna** was a prominent leader of the movement.
- **Success:** The movement was a success. The government issued a 15-year ban on felling of trees in the Himalayan region.

### Dalit Panthers (1972)
- **What was it?:** A militant organisation of Dalit youth formed in **Maharashtra in 1972**.
- **Background:** Despite the Constitution guaranteeing equality and abolishing untouchability, Dalits faced continued atrocities and caste-based inequalities in social and economic spheres.
- **Inspiration:** They were inspired by the **Black Panther Party** in the US and the writings of leaders like **Dr. B.R. Ambedkar and Jyotiba Phule**.
- **Key Demands:** Their main agenda was to fight against caste-based inequalities and atrocities. They demanded effective implementation of reservations and other policies for social justice.
- **Activities:** They used mass action, including protests and literature (poems, stories), to raise their voice. Their writings became a powerful tool for expressing the anger and anguish of the Dalit community.
- **Decline:** The organization split in the late 1970s and later declined. Many of the activists joined **BAMCEF** (Backward and Minority Communities Employees Federation).

### Bharatiya Kisan Union (BKU)
- **What was it?:** An organisation of farmers from western **Uttar Pradesh and Haryana**, which became prominent in the late 1980s.
- **The Issue:** They protested against the government's economic policies, which they saw as anti-farmer.
- **Key Demands:**
- - Higher government floor prices for sugarcane and wheat.
- - Abolition of restrictions on the inter-state movement of farm produce.
- - Guaranteed supply of electricity at reasonable rates.
- - Waiving of repayments of loans to farmers.
- **Methods of Protest:** They organized massive rallies, dharnas, and jail bharo (courting arrest) campaigns in district headquarters across the states.
- **Characteristics:** It was a movement of affluent, cash-crop farmers. They used caste and community linkages to mobilize support. Unlike most other movements, it did not involve political parties.
- **Success:** Their mobilization and lobbying power made them an influential pressure group in national politics.

### Anti-Arrack Movement
- **What was it?:** A spontaneous movement of rural women in the state of **Andhra Pradesh in the early 1990s**.
- **The Issue:** The movement was against the widespread sale of **'arrack'** (a cheap, locally brewed alcohol).
- **Impact on Women:** The increased consumption of arrack was leading to indebtedness, neglect of families, and a rise in domestic violence against women.
- **How it started:** It began when women in a village in the Dubagunta district of Nellore protested against the auction of arrack contracts. The protest spread rapidly.
- **Key Slogan:** 'Prohibit arrack sales'.
- **Outcome:** The movement was successful in forcing the government to impose a ban on the sale of arrack. It also raised broader issues like domestic violence, women's property rights, and the need for women's representation in politics.

### Narmada Bachao Andolan (NBA)
- **What was it?:** A social movement that mobilized against the construction of large dams on the **Narmada river**.
- **The Project:** The Sardar Sarovar Project in Gujarat and the Narmada Sagar Project in Madhya Pradesh were two of the biggest multi-purpose dams planned.
- **The Issue:** The construction of these dams would submerge a vast area of land, displacing hundreds of thousands of people, mostly tribal communities.
- **Initial Demand:** The movement initially focused on the proper **rehabilitation** of the displaced people.
- **Shift in Demand:** Later, the movement questioned the very model of development that involved such large-scale projects. They argued that the social costs (displacement, loss of livelihood, ecological damage) were too high compared to the economic benefits.
- **Key Leader:** **Medha Patkar** has been the central organizer of the movement.
- **Debate:** The NBA has been at the forefront of the debate on 'development' vs. 'environment' and the rights of displaced communities.

### Lessons from Popular Movements
- These movements show that routine democratic politics and functioning of political parties have their limitations.
- They represent the voice of marginalized groups and bring new issues to the forefront.
- They have helped deepen democracy by increasing political participation and awareness.
- **Criticism:** Critics argue that these movements, with their protests and rallies, can disrupt the functioning of the government and delay decision-making.

### Right to Information (RTI)
- **The Movement:** The RTI movement began in **Rajasthan in 1990**. A rural organization, **Mazdoor Kisan Shakti Sangathan (MKSS)**, demanded records of famine relief work and accounts of labourers.
- **The Demand:** They demanded the 'right to know' how government funds were being spent.
- **Success:** The movement grew, and after years of struggle, the **Right to Information Act was passed in 2005**. This law gives citizens the right to access information from government bodies, promoting transparency and accountability.
`
    },
    hi: {
      title: 'अध्याय 7: जन आंदोलनों का उदय',
      content: `### जन आंदोलनों की प्रकृति
- 1970 के दशक में विभिन्न जन आंदोलनों का उदय हुआ। ये पारंपरिक राजनीतिक दलों से अलग थे।
- ये **'गैर-दलीय'** आंदोलन थे, जिनका नेतृत्व अक्सर छात्र, मध्यम वर्ग के लोग और सामाजिक कार्यकर्ता करते थे।
- इन आंदोलनों ने ऐसे मुद्दे उठाए जिन्हें मुख्यधारा के राजनीतिक दल संबोधित नहीं कर रहे थे, जैसे कि पर्यावरण संरक्षण, महिलाओं के अधिकार, और जाति और वर्ग के मुद्दे।
- उन्होंने उन समूहों के लिए राजनीतिक भागीदारी का एक नया रूप प्रस्तुत किया जो महसूस करते थे कि चुनावी राजनीति में उनकी आवाज नहीं सुनी जा रही है।

### चिपको आंदोलन (1970 के दशक की शुरुआत)
- **यह क्या था?:** एक अनूठा पर्यावरण आंदोलन जो **उत्तराखंड** (तब उत्तर प्रदेश का हिस्सा) की पहाड़ियों में शुरू हुआ।
- **मुद्दा:** ग्रामीणों ने वाणिज्यिक ठेकेदारों द्वारा पेड़ों की कटाई का विरोध किया। सरकार ने ग्रामीणों को कृषि उपकरण बनाने के लिए अंगू के पेड़ काटने की अनुमति देने से इनकार कर दिया था, लेकिन उसी जंगल के टुकड़े को एक खेल के सामान के निर्माता को आवंटित कर दिया था।
- **विरोध का तरीका:** ग्रामीणों, विशेषकर **महिलाओं** ने एक नई रणनीति का इस्तेमाल किया: वे पेड़ों को कटने से बचाने के लिए उनसे **लिपट गए** (इसलिए इसका नाम 'चिपको' पड़ा)।
- **प्रमुख मांगें:**
- - यह आंदोलन सिर्फ पेड़ बचाने के बारे में नहीं था। इसने **स्थानीय समुदायों के अपने प्राकृतिक संसाधनों पर नियंत्रण** के बारे में सवाल उठाए।
- - उन्होंने मांग की कि जंगल-शोषण के कोई भी ठेके बाहरी लोगों को नहीं दिए जाने चाहिए।
- - आंदोलन ने पारिस्थितिक संतुलन और सतत विकास के मुद्दे पर भी प्रकाश डाला।
- **प्रमुख नेता:** **सुंदरलाल बहुगुणा** आंदोलन के एक प्रमुख नेता थे।
- **सफलता:** आंदोलन एक सफलता थी। सरकार ने हिमालयी क्षेत्र में पेड़ों की कटाई पर 15 साल का प्रतिबंध लगा दिया।

### दलित पैंथर्स (1972)
- **यह क्या था?:** **1972 में महाराष्ट्र** में गठित दलित युवाओं का एक उग्रवादी संगठन।
- **पृष्ठभूमि:** संविधान द्वारा समानता की गारंटी और अस्पृश्यता के उन्मूलन के बावजूद, दलितों को सामाजिक और आर्थिक क्षेत्रों में निरंतर अत्याचार और जाति-आधारित असमानताओं का सामना करना पड़ रहा था।
- **प्रेरणा:** वे अमेरिका में **ब्लैक पैंथर पार्टी** और **डॉ. बी.आर. अंबेडकर और ज्योतिबा फुले** जैसे नेताओं के लेखन से प्रेरित थे।
- **प्रमुख मांगें:** उनका मुख्य एजेंडा जाति-आधारित असमानताओं और अत्याचारों के खिलाफ लड़ना था। उन्होंने आरक्षण और सामाजिक न्याय के लिए अन्य नीतियों के प्रभावी कार्यान्वयन की मांग की।
- **गतिविधियाँ:** उन्होंने अपनी आवाज उठाने के लिए विरोध प्रदर्शन और साहित्य (कविताएं, कहानियां) सहित जन कार्रवाई का इस्तेमाल किया। उनके लेखन दलित समुदाय के गुस्से और पीड़ा को व्यक्त करने के लिए एक शक्तिशाली उपकरण बन गए।
- **पतन:** संगठन 1970 के दशक के अंत में विभाजित हो गया और बाद में इसका पतन हो गया। कई कार्यकर्ता **बामसेफ** (पिछड़ा और अल्पसंख्यक समुदाय कर्मचारी महासंघ) में शामिल हो गए।

### भारतीय किसान यूनियन (BKU)
- **यह क्या था?:** पश्चिमी **उत्तर प्रदेश और हरियाणा** के किसानों का एक संगठन, जो 1980 के दशक के अंत में प्रमुख हो गया।
- **मुद्दा:** उन्होंने सरकार की आर्थिक नीतियों का विरोध किया, जिसे वे किसान-विरोधी मानते थे।
- **प्रमुख मांगें:**
- - गन्ना और गेहूं के लिए उच्च सरकारी न्यूनतम समर्थन मूल्य।
- - कृषि उपज के अंतर-राज्यीय आवागमन पर प्रतिबंधों का उन्मूलन।
- - उचित दरों पर बिजली की गारंटीकृत आपूर्ति।
- - किसानों के ऋणों की चुकौती माफ करना।
- **विरोध के तरीके:** उन्होंने राज्यों भर के जिला मुख्यालयों में विशाल रैलियां, धरने और जेल भरो (गिरफ्तारी देना) अभियान आयोजित किए।
- **विशेषताएं:** यह संपन्न, नकदी-फसल किसानों का एक आंदोलन था। उन्होंने समर्थन जुटाने के लिए जाति और समुदाय के संबंधों का इस्तेमाल किया। अधिकांश अन्य आंदोलनों के विपरीत, इसमें राजनीतिक दल शामिल नहीं थे।
- **सफलता:** उनकी लामबंदी और पैरवी की शक्ति ने उन्हें राष्ट्रीय राजनीति में एक प्रभावशाली दबाव समूह बना दिया।

### ताड़ी-विरोधी आंदोलन
- **यह क्या था?:** **1990 के दशक की शुरुआत में आंध्र प्रदेश** राज्य में ग्रामीण महिलाओं का एक स्वतःस्फूर्त आंदोलन।
- **मुद्दा:** यह आंदोलन **'ताड़ी'** (एक सस्ती, स्थानीय रूप से बनाई गई शराब) की व्यापक बिक्री के खिलाफ था।
- **महिलाओं पर प्रभाव:** ताड़ी की बढ़ती खपत से ऋणग्रस्तता, परिवारों की उपेक्षा और महिलाओं के खिलाफ घरेलू हिंसा में वृद्धि हो रही थी।
- **यह कैसे शुरू हुआ:** यह तब शुरू हुआ जब नेल्लोर जिले के दुबागंटा गांव की महिलाओं ने ताड़ी के ठेकों की नीलामी का विरोध किया। विरोध तेजी से फैल गया।
- **प्रमुख नारा:** 'ताड़ी की बिक्री बंद करो'।
- **परिणाम:** यह आंदोलन सरकार को ताड़ी की बिक्री पर प्रतिबंध लगाने के लिए मजबूर करने में सफल रहा। इसने घरेलू हिंसा, महिलाओं के संपत्ति अधिकार और राजनीति में महिलाओं के प्रतिनिधित्व की आवश्यकता जैसे व्यापक मुद्दों को भी उठाया।

### नर्मदा बचाओ आंदोलन (NBA)
- **यह क्या था?:** एक सामाजिक आंदोलन जो **नर्मदा नदी** पर बड़े बांधों के निर्माण के खिलाफ लामबंद हुआ।
- **परियोजना:** गुजरात में सरदार सरोवर परियोजना और मध्य प्रदेश में नर्मदा सागर परियोजना नियोजित दो सबसे बड़े बहुउद्देशीय बांध थे।
- **मुद्दा:** इन बांधों के निर्माण से भूमि का एक विशाल क्षेत्र जलमग्न हो जाएगा, जिससे सैकड़ों हजारों लोग, जिनमें ज्यादातर आदिवासी समुदाय थे, विस्थापित हो जाएंगे।
- **प्रारंभिक मांग:** आंदोलन ने शुरू में विस्थापित लोगों के उचित **पुनर्वास** पर ध्यान केंद्रित किया।
- **मांग में बदलाव:** बाद में, आंदोलन ने विकास के उस मॉडल पर ही सवाल उठाया जिसमें इतनी बड़ी परियोजनाएं शामिल थीं। उन्होंने तर्क दिया कि आर्थिक लाभों की तुलना में सामाजिक लागत (विस्थापन, आजीविका का नुकसान, पारिस्थितिक क्षति) बहुत अधिक थी।
- **प्रमुख नेता:** **मेधा पाटकर** आंदोलन की केंद्रीय आयोजक रही हैं।
- **बहस:** एनबीए 'विकास' बनाम 'पर्यावरण' और विस्थापित समुदायों के अधिकारों पर बहस में सबसे आगे रहा है।

### जन आंदोलनों से सीख
- ये आंदोलन दिखाते हैं कि नियमित लोकतांत्रिक राजनीति और राजनीतिक दलों के कामकाज की अपनी सीमाएँ हैं।
- वे हाशिए पर पड़े समूहों की आवाज का प्रतिनिधित्व करते हैं और नए मुद्दों को सामने लाते हैं।
- उन्होंने राजनीतिक भागीदारी और जागरूकता बढ़ाकर लोकतंत्र को गहरा करने में मदद की है।
- **आलोचना:** आलोचकों का तर्क है कि ये आंदोलन, अपने विरोध प्रदर्शनों और रैलियों के साथ, सरकार के कामकाज को बाधित कर सकते हैं और निर्णय लेने में देरी कर सकते हैं।

### सूचना का अधिकार (RTI)
- **आंदोलन:** आरटीआई आंदोलन **1990 में राजस्थान** में शुरू हुआ। एक ग्रामीण संगठन, **मजदूर किसान शक्ति संगठन (MKSS)** ने अकाल राहत कार्यों के रिकॉर्ड और मजदूरों के खातों की मांग की।
- **मांग:** उन्होंने यह 'जानने का अधिकार' मांगा कि सरकारी धन कैसे खर्च किया जा रहा था।
- **सफलता:** आंदोलन बढ़ा, और वर्षों के संघर्ष के बाद, **2005 में सूचना का अधिकार अधिनियम पारित किया गया**। यह कानून नागरिकों को सरकारी निकायों से जानकारी प्राप्त करने का अधिकार देता है, जिससे पारदर्शिता और जवाबदेही को बढ़ावा मिलता है।
`
    }
  },
  'regional-aspirations': {
    en: {
      title: 'Chapter 8: Regional Aspirations',
      content: `### What are Regional Aspirations?
- Regional aspirations refer to the demands raised by people of certain regions for the recognition of their distinct culture, language, or for greater political autonomy.
- These expressions are a normal part of democratic politics. It is not necessarily about separatism.
- The Indian approach has been to accommodate these aspirations through democratic negotiations rather than suppressing them.

### Areas of Tension
- After independence, India faced challenges from various regions. The most prominent cases were:
- **1. Jammu and Kashmir:** A story of conflict and contested integration.
- **2. Punjab:** The demand for a separate Sikh nation (Khalistan) and the subsequent turmoil.
- **3. The North-East:** A region with vast diversity, facing issues of autonomy, secession, and opposition to 'outsiders'.
- **4. The Dravidian Movement in the South:** A movement for regional pride and against the imposition of Hindi.

### Jammu and Kashmir
- **The Issue:** J&K was a Princely State. Its Hindu ruler, **Hari Singh**, wanted to remain independent. The population was overwhelmingly Muslim.
- **Accession to India (1947):** When tribal infiltrators from Pakistan invaded, the Maharaja signed the **Instrument of Accession** with India in October 1947 in return for military help.
- **Special Status:** India agreed to grant J&K special status, which was incorporated in **Article 370** of the Indian Constitution, giving it greater autonomy compared to other states.
- **Politics since 1948:**
- - **Sheikh Abdullah** of the National Conference became the Prime Minister of the state. He initiated land reforms but his push for greater autonomy led to his dismissal and arrest in 1953.
- - For the next two decades, the state was ruled by Congress-led governments, often with allegations of rigged elections.
- **External and Internal Disputes:**
- - **External:** Pakistan has always claimed Kashmir. This led to wars in 1947-48 and 1965. Pakistan also supports a separatist movement.
- - **Internal:** The issue of identity and the desire for greater autonomy (or 'azadi') has been a consistent feature. There are three main political strands:
- - - 1. Separatists who want a separate Kashmiri nation.
- - - 2. Those who want to merge with Pakistan.
- - - 3. Those who want to remain with India but with greater autonomy.
- **Insurgency (Post-1989):** The 1980s saw the rise of a militant insurgency demanding a separate Kashmir. This was fueled by rigged elections in 1987 and support from Pakistan.
- **Recent Developments:** In August 2019, the Government of India revoked Article 370, ending the special status of J&K. The state was bifurcated into two Union Territories: **Jammu & Kashmir** and **Ladakh**.

### Punjab
- **The Anandpur Sahib Resolution (1973):** The Akali Dal passed this resolution, demanding greater autonomy for Punjab. It did not ask for secession but had a federalist character.
- **Rise of Extremism:** A section of Akalis started demanding a separate Sikh nation, **'Khalistan'**. This movement gained momentum and turned into an armed insurgency, led by **Jarnail Singh Bhindranwale**.
- **Operation Blue Star (June 1984):** The Golden Temple in Amritsar had become the headquarters of the militants. The Indian army entered the temple to flush out the militants in an operation called 'Operation Blue Star'. This deeply hurt Sikh sentiments.
- **Aftermath:** Prime Minister **Indira Gandhi was assassinated** by her Sikh bodyguards in October 1984, leading to anti-Sikh riots in Delhi and other parts of North India.
- **Punjab Accord (1985):** Prime Minister **Rajiv Gandhi** signed an accord with Akali leader Harchand Singh Longowal to restore peace. However, peace was restored only in the mid-1990s.

### The North-East
- This region, comprising seven states (the 'Seven Sisters'), is culturally diverse and economically underdeveloped.
- **Three main issues have dominated its politics:**
- **1. Demands for Autonomy:** Various tribes and communities have demanded separate states or greater autonomy. This has led to the creation of states like **Nagaland, Meghalaya, Mizoram, and Arunachal Pradesh**.
- **2. Secessionist Movements:** Some groups have demanded complete separation from India. The movements in **Mizoram** (led by Laldenga) and **Nagaland** were the most prominent. The Indian government used a mix of military force and political negotiations (e.g., the Mizoram Accord with Laldenga in 1986) to deal with these.
- **3. Movements against 'Outsiders':** The large-scale migration of people from other parts of India and from neighboring countries has led to social tension. The **Assam Movement (1979-1985)** against 'illegal' migrants from Bangladesh is the best example. It ended with the **Assam Accord** signed by Rajiv Gandhi.

### Lessons from Regional Aspirations
- Regional aspirations are a part of democratic politics.
- The best way to deal with them is through democratic negotiation and power-sharing, not suppression.
- Economic development and addressing the sense of neglect can help reduce regional tensions.
`
    },
    hi: {
      title: 'अध्याय 8: क्षेत्रीय आकांक्षाएँ',
      content: `### क्षेत्रीय आकांक्षाएँ क्या हैं?
- क्षेत्रीय आकांक्षाएँ कुछ क्षेत्रों के लोगों द्वारा अपनी विशिष्ट संस्कृति, भाषा की मान्यता या अधिक राजनीतिक स्वायत्तता के लिए उठाई गई मांगों को संदर्भित करती हैं।
- ये अभिव्यक्तियाँ लोकतांत्रिक राजनीति का एक सामान्य हिस्सा हैं। यह आवश्यक रूप से अलगाववाद के बारे में नहीं है।
- भारतीय दृष्टिकोण इन आकांक्षाओं को दबाने के बजाय लोकतांत्रिक वार्ताओं के माध्यम से समायोजित करने का रहा है।

### तनाव के क्षेत्र
- स्वतंत्रता के बाद, भारत को विभिन्न क्षेत्रों से चुनौतियों का सामना करना पड़ा। सबसे प्रमुख मामले थे:
- **1. जम्मू और कश्मीर:** संघर्ष और विवादित एकीकरण की कहानी।
- **2. पंजाब:** एक अलग सिख राष्ट्र (खालिस्तान) की मांग और उसके बाद की उथल-पुथल।
- **3. पूर्वोत्तर:** विशाल विविधता वाला एक क्षेत्र, जो स्वायत्तता, अलगाव और 'बाहरी लोगों' के विरोध जैसे मुद्दों का सामना कर रहा है।
- **4. दक्षिण में द्रविड़ आंदोलन:** क्षेत्रीय गौरव और हिंदी थोपे जाने के खिलाफ एक आंदोलन।

### जम्मू और कश्मीर
- **मुद्दा:** जम्मू-कश्मीर एक रियासत थी। इसके हिंदू शासक, **हरि सिंह**, स्वतंत्र रहना चाहते थे। जनसंख्या überwiegend मुस्लिम थी।
- **भारत में विलय (1947):** जब पाकिस्तान से कबायली घुसपैठियों ने आक्रमण किया, तो महाराजा ने सैन्य सहायता के बदले में अक्टूबर 1947 में भारत के साथ **विलय पत्र** पर हस्ताक्षर किए।
- **विशेष दर्जा:** भारत जम्मू-कश्मीर को विशेष दर्जा देने पर सहमत हुआ, जिसे भारतीय संविधान के **अनुच्छेद 370** में शामिल किया गया, जिससे इसे अन्य राज्यों की तुलना में अधिक स्वायत्तता मिली।
- **1948 के बाद की राजनीति:**
- - नेशनल कॉन्फ्रेंस के **शेख अब्दुल्ला** राज्य के प्रधानमंत्री बने। उन्होंने भूमि सुधारों की शुरुआत की, लेकिन अधिक स्वायत्तता के लिए उनके दबाव के कारण 1953 में उनकी बर्खास्तगी और गिरफ्तारी हुई।
- - अगले दो दशकों तक, राज्य पर कांग्रेस के नेतृत्व वाली सरकारों का शासन रहा, जिन पर अक्सर धांधली वाले चुनावों के आरोप लगते थे।
- **बाहरी और आंतरिक विवाद:**
- - **बाहरी:** पाकिस्तान ने हमेशा कश्मीर पर दावा किया है। इससे 1947-48 और 1965 में युद्ध हुए। पाकिस्तान एक अलगाववादी आंदोलन का भी समर्थन करता है।
- - **आंतरिक:** पहचान का मुद्दा और अधिक स्वायत्तता (या 'आज़ादी') की इच्छा एक सुसंगत विशेषता रही है। तीन मुख्य राजनीतिक धाराएँ हैं:
- - - 1. अलगाववादी जो एक अलग कश्मीरी राष्ट्र चाहते हैं।
- - - 2. जो पाकिस्तान के साथ विलय करना चाहते हैं।
- - - 3. जो भारत के साथ रहना चाहते हैं लेकिन अधिक स्वायत्तता के साथ।
- **उग्रवाद (1989 के बाद):** 1980 के दशक में एक अलग कश्मीर की मांग करने वाले एक उग्रवादी विद्रोह का उदय हुआ। इसे 1987 में धांधली वाले चुनावों और पाकिस्तान से मिले समर्थन ने हवा दी।
- **हाल के घटनाक्रम:** अगस्त 2019 में, भारत सरकार ने अनुच्छेद 370 को निरस्त कर दिया, जिससे जम्मू-कश्मीर का विशेष दर्जा समाप्त हो गया। राज्य को दो केंद्र शासित प्रदेशों में विभाजित किया गया: **जम्मू और कश्मीर** और **लद्दाख**।

### पंजाब
- **आनंदपुर साहिब प्रस्ताव (1973):** अकाली दल ने यह प्रस्ताव पारित किया, जिसमें पंजाब के लिए अधिक स्वायत्तता की मांग की गई। इसने अलगाव की मांग नहीं की, बल्कि इसका एक संघवादी चरित्र था।
- **उग्रवाद का उदय:** अकालियों के एक वर्ग ने एक अलग सिख राष्ट्र, **'खालिस्तान'** की मांग शुरू कर दी। इस आंदोलन ने गति पकड़ी और **जरनैल सिंह भिंडरांवाले** के नेतृत्व में एक सशस्त्र विद्रोह में बदल गया।
- **ऑपरेशन ब्लू स्टार (जून 1984):** अमृतसर में स्वर्ण मंदिर उग्रवादियों का मुख्यालय बन गया था। 'ऑपरेशन ब्लू स्टार' नामक एक अभियान में उग्रवादियों को बाहर निकालने के लिए भारतीय सेना ने मंदिर में प्रवेश किया। इसने सिख भावनाओं को बहुत आहत किया।
- **परिणाम:** प्रधानमंत्री **इंदिरा गांधी की हत्या** अक्टूबर 1984 में उनके सिख अंगरक्षकों द्वारा कर दी गई, जिससे दिल्ली और उत्तर भारत के अन्य हिस्सों में सिख विरोधी दंगे हुए।
- **पंजाब समझौता (1985):** प्रधानमंत्री **राजीव गांधी** ने शांति बहाल करने के लिए अकाली नेता हरचंद सिंह लोंगोवाल के साथ एक समझौते पर हस्ताक्षर किए। हालांकि, शांति केवल 1990 के दशक के मध्य में बहाल हुई।

### पूर्वोत्तर
- यह क्षेत्र, जिसमें सात राज्य ('सात बहनें') शामिल हैं, सांस्कृतिक रूप से विविध और आर्थिक रूप से अविकसित है।
- **इसकी राजनीति पर तीन मुख्य मुद्दों का प्रभुत्व रहा है:**
- **1. स्वायत्तता की मांग:** विभिन्न जनजातियों और समुदायों ने अलग राज्यों या अधिक स्वायत्तता की मांग की है। इससे **नागालैंड, मेघालय, मिजोरम और अरुणाचल प्रदेश** जैसे राज्यों का निर्माण हुआ है।
- **2. अलगाववादी आंदोलन:** कुछ समूहों ने भारत से पूर्ण अलगाव की मांग की है। **मिजोरम** (लालडेंगा के नेतृत्व में) और **नागालैंड** में आंदोलन सबसे प्रमुख थे। भारत सरकार ने इनसे निपटने के लिए सैन्य बल और राजनीतिक वार्ताओं (जैसे, 1986 में लालडेंगा के साथ मिजोरम समझौता) के मिश्रण का उपयोग किया।
- **3. 'बाहरी लोगों' के खिलाफ आंदोलन:** भारत के अन्य हिस्सों और पड़ोसी देशों से लोगों के बड़े पैमाने पर प्रवास ने सामाजिक तनाव को जन्म दिया है। बांग्लादेश से 'अवैध' प्रवासियों के खिलाफ **असम आंदोलन (1979-1985)** इसका सबसे अच्छा उदाहरण है। यह राजीव गांधी द्वारा हस्ताक्षरित **असम समझौते** के साथ समाप्त हुआ।

### क्षेत्रीय आकांक्षाओं से सीख
- क्षेत्रीय आकांक्षाएँ लोकतांत्रिक राजनीति का हिस्सा हैं।
- इनसे निपटने का सबसे अच्छा तरीका दमन नहीं, बल्कि लोकतांत्रिक बातचीत और सत्ता-साझाकरण है।
- आर्थिक विकास और उपेक्षा की भावना को दूर करने से क्षेत्रीय तनाव को कम करने में मदद मिल सकती है।
`
    }
  },
  'recent-developments-in-indian-politics': {
    en: {
      title: 'Chapter 9: Recent Developments in Indian Politics',
      content: `### Context of the 1990s
- The decade of the 1990s was a period of significant change in Indian politics, marked by five major developments.
- **1. End of the Congress System:** The 1989 election marked the end of Congress's dominance. It was the single largest party, but it did not have a majority. This started the era of **coalition governments**.
- **2. The Mandal Issue:** The National Front government, led by V.P. Singh in 1990, decided to implement the recommendations of the **Mandal Commission**. This provided **27% reservation** for **Other Backward Classes (OBCs)** in central government jobs. This led to widespread protests but also politically mobilized the OBCs.
- **3. New Economic Policies (Liberalisation):** Successive governments, starting with the Congress government under P.V. Narasimha Rao in 1991, adopted new economic policies of **liberalization, privatization, and globalization (LPG)**. These policies radically changed the direction of the Indian economy.
- **4. Babri Masjid Demolition (December 1992):** The dispute over the Babri Masjid in Ayodhya came to a head, leading to its demolition. This event intensified the debate about secularism and fueled the rise of the **Bharatiya Janata Party (BJP)** and Hindutva politics.
- **5. Assassination of Rajiv Gandhi (May 1991):** Rajiv Gandhi was assassinated during an election campaign. This led to the Congress emerging as the single largest party in the 1991 elections.

### Era of Coalitions
- **Decline of Congress:** From 1989 onwards, no single party secured a clear majority in the Lok Sabha until 2014. This period was dominated by **coalition governments**.
- **Rise of Regional Parties:** Many powerful regional parties emerged and played a crucial role in forming coalition governments at the Centre.
- **United Front (1996):** A coalition of regional parties and the left, supported by the Congress from the outside.
- **National Democratic Alliance (NDA) (1998):** A coalition led by the **BJP**. The BJP-led NDA government under **Atal Bihari Vajpayee** was the first coalition government to complete a full five-year term (1999-2004).
- **United Progressive Alliance (UPA) (2004):** A coalition led by the **Congress**. The UPA governed India for two consecutive terms from 2004 to 2014 under Prime Minister **Manmohan Singh**.

### Mandal Commission and 'Politics of the OBCs'
- **Background:** The Mandal Commission was set up in 1978 to identify the 'socially or educationally backward classes'. It submitted its report in 1980.
- **Recommendation:** Its main recommendation was to reserve **27% of seats** in government jobs and educational institutions for the **OBCs**.
- **Implementation:** The V.P. Singh government implemented this recommendation in 1990.
- **Consequences:**
- - It led to violent 'anti-Mandal' protests in many cities in northern India.
- - It helped in the rise of many parties that sought to represent the OBCs, like the Janata Dal and its offshoots. This is often called the 'Mandalisation' of Indian politics.

### Communalism, Secularism, and Democracy
- **The Ayodhya Dispute:** The dispute involved a mosque known as **Babri Masjid**, which was built in Ayodhya in the 16th century. Some Hindus believed it was built after demolishing a temple that marked the birthplace of Lord Ram.
- **Rise of Hindutva Politics:** In the 1980s, the BJP made this issue a central part of its politics. It organized a massive march, or **Rath Yatra**, led by L.K. Advani.
- **Demolition of Babri Masjid (6 December 1992):** Thousands of 'Karsevaks' demolished the mosque. This led to communal riots in many parts of the country.
- **Aftermath:** The demolition and the riots had a lasting impact on Indian politics, sharpening the debate between secular and communal forces.
- **Gujarat Riots (2002):** A bogey of a train carrying Karsevaks returning from Ayodhya was set on fire in Godhra. This was followed by large-scale communal violence against Muslims in Gujarat.

### Emergence of a New Consensus
- By the early 2000s, a broad consensus had emerged among most political parties on four key issues.
- **1. New Economic Policies:** Most parties came to believe that the new economic policies of liberalization were necessary for the country's prosperity.
- **2. Acceptance of OBC Political Role:** Political parties recognized the social and political claims of the OBCs and started giving them adequate representation.
- **3. Acceptance of Regional Parties' Role:** The era of coalitions forced national parties to form alliances with regional parties.
- **4. Emphasis on Pragmatism:** There was a shift from ideological politics to a more pragmatic, non-ideological approach focused on governance and development.

### Lok Sabha Elections 2014 and Beyond
- The 2014 Lok Sabha elections marked a major shift. The **Bharatiya Janata Party (BJP)**, led by **Narendra Modi**, won a clear majority on its own for the first time since 1984.
- This was seen by some as the end of the coalition era and the beginning of a new era of **BJP dominance**.
- The political discourse shifted towards themes of **development, good governance (vikas), and nationalism**.
`
    },
    hi: {
      title: 'अध्याय 9: भारतीय राजनीति: नए बदलाव',
      content: `### 1990 के दशक का संदर्भ
- 1990 का दशक भारतीय राजनीति में महत्वपूर्ण बदलावों का काल था, जिसे पांच प्रमुख घटनाओं द्वारा चिह्नित किया गया।
- **1. कांग्रेस प्रणाली की समाप्ति:** 1989 के चुनाव ने कांग्रेस के प्रभुत्व के अंत को चिह्नित किया। यह सबसे बड़ी पार्टी थी, लेकिन इसके पास बहुमत नहीं था। इसने **गठबंधन सरकारों** के युग की शुरुआत की।
- **2. मंडल मुद्दा:** 1990 में वी.पी. सिंह के नेतृत्व वाली राष्ट्रीय मोर्चा सरकार ने **मंडल आयोग** की सिफारिशों को लागू करने का निर्णय लिया। इसने केंद्र सरकार की नौकरियों में **अन्य पिछड़ा वर्ग (OBC)** के लिए **27% आरक्षण** प्रदान किया। इससे व्यापक विरोध हुआ लेकिन इसने OBC को राजनीतिक रूप से लामबंद भी किया।
- **3. नई आर्थिक नीतियां (उदारीकरण):** 1991 में पी.वी. नरसिम्हा राव के तहत कांग्रेस सरकार से शुरू होकर, क्रमिक सरकारों ने **उदारीकरण, निजीकरण और वैश्वीकरण (LPG)** की नई आर्थिक नीतियों को अपनाया। इन नीतियों ने भारतीय अर्थव्यवस्था की दिशा को मौलिक रूप से बदल दिया।
- **4. बाबरी मस्जिद विध्वंस (दिसंबर 1992):** अयोध्या में बाबरी मस्जिद पर विवाद चरम पर पहुंच गया, जिसके कारण इसका विध्वंस हो गया। इस घटना ने धर्मनिरपेक्षता पर बहस को तेज कर दिया और **भारतीय जनता पार्टी (भाजपा)** और हिंदुत्व की राजनीति के उदय को बढ़ावा दिया।
- **5. राजीव गांधी की हत्या (मई 1991):** एक चुनाव अभियान के दौरान राजीव गांधी की हत्या कर दी गई। इसके कारण 1991 के चुनावों में कांग्रेस सबसे बड़ी पार्टी के रूप में उभरी।

### गठबंधन का युग
- **कांग्रेस का पतन:** 1989 से, 2014 तक किसी भी एक पार्टी ने लोकसभा में स्पष्ट बहुमत हासिल नहीं किया। इस अवधि में **गठबंधन सरकारों** का प्रभुत्व था।
- **क्षेत्रीय दलों का उदय:** कई शक्तिशाली क्षेत्रीय दल उभरे और केंद्र में गठबंधन सरकारें बनाने में महत्वपूर्ण भूमिका निभाई।
- **संयुक्त मोर्चा (1996):** क्षेत्रीय दलों और वामपंथियों का एक गठबंधन, जिसे कांग्रेस ने बाहर से समर्थन दिया।
- **राष्ट्रीय जनतांत्रिक गठबंधन (NDA) (1998):** **भाजपा** के नेतृत्व वाला एक गठबंधन। **अटल बिहारी वाजपेयी** के तहत भाजपा के नेतृत्व वाली राजग सरकार अपना पूरा पांच साल का कार्यकाल (1999-2004) पूरा करने वाली पहली गठबंधन सरकार थी।
- **संयुक्त प्रगतिशील गठबंधन (UPA) (2004):** **कांग्रेस** के नेतृत्व वाला एक गठबंधन। यूपीए ने प्रधानमंत्री **मनमोहन सिंह** के तहत 2004 से 2014 तक लगातार दो कार्यकालों तक भारत पर शासन किया।

### मंडल आयोग और 'ओबीसी की राजनीति'
- **पृष्ठभूमि:** मंडल आयोग की स्थापना 1978 में 'सामाजिक या शैक्षिक रूप से पिछड़े वर्गों' की पहचान के लिए की गई थी। इसने 1980 में अपनी रिपोर्ट प्रस्तुत की।
- **सिफारिश:** इसकी मुख्य सिफारिश सरकारी नौकरियों और शैक्षणिक संस्थानों में **ओबीसी** के लिए **27% सीटें** आरक्षित करना था।
- **कार्यान्वयन:** वी.पी. सिंह सरकार ने 1990 में इस सिफारिश को लागू किया।
- **परिणाम:**
- - इसके कारण उत्तर भारत के कई शहरों में हिंसक 'मंडल-विरोधी' विरोध प्रदर्शन हुए।
- - इसने ओबीसी का प्रतिनिधित्व करने वाली कई पार्टियों, जैसे जनता दल और उसकी शाखाओं के उदय में मदद की। इसे अक्सर भारतीय राजनीति का 'मंडलीकरण' कहा जाता है।

### सांप्रदायिकता, धर्मनिरपेक्षता और लोकतंत्र
- **अयोध्या विवाद:** इस विवाद में **बाबरी मस्जिद** नामक एक मस्जिद शामिल थी, जिसे 16वीं शताब्दी में अयोध्या में बनाया गया था। कुछ हिंदुओं का मानना था कि इसे भगवान राम के जन्मस्थान को चिह्नित करने वाले एक मंदिर को ध्वस्त करने के बाद बनाया गया था।
- **हिंदुत्व की राजनीति का उदय:** 1980 के दशक में, भाजपा ने इस मुद्दे को अपनी राजनीति का एक केंद्रीय हिस्सा बनाया। इसने लालकृष्ण आडवाणी के नेतृत्व में एक विशाल मार्च, या **रथ यात्रा** का आयोजन किया।
- **बाबरी मस्जिद का विध्वंस (6 दिसंबर 1992):** हजारों 'कारसेवकों' ने मस्जिद को ध्वस्त कर दिया। इससे देश के कई हिस्सों में सांप्रदायिक दंगे हुए।
- **परिणाम:** विध्वंस और दंगों का भारतीय राजनीति पर एक स्थायी प्रभाव पड़ा, जिससे धर्मनिरपेक्ष और सांप्रदायिक ताकतों के बीच बहस तेज हो गई।
- **गुजरात दंगे (2002):** अयोध्या से लौट रहे कारसेवकों को ले जा रही एक ट्रेन के एक डिब्बे में गोधरा में आग लगा दी गई। इसके बाद गुजरात में मुसलमानों के खिलाफ बड़े पैमाने पर सांप्रदायिक हिंसा हुई।

### एक नई सहमति का उदय
- 2000 के दशक की शुरुआत तक, अधिकांश राजनीतिक दलों के बीच चार प्रमुख मुद्दों पर एक व्यापक सहमति बन गई थी।
- **1. नई आर्थिक नीतियां:** अधिकांश दल यह मानने लगे कि देश की समृद्धि के लिए उदारीकरण की नई आर्थिक नीतियां आवश्यक थीं।
- **2. ओबीसी की राजनीतिक भूमिका की स्वीकृति:** राजनीतिक दलों ने ओबीसी के सामाजिक और राजनीतिक दावों को मान्यता दी और उन्हें पर्याप्त प्रतिनिधित्व देना शुरू कर दिया।
- **3. क्षेत्रीय दलों की भूमिका की स्वीकृति:** गठबंधन के युग ने राष्ट्रीय दलों को क्षेत्रीय दलों के साथ गठबंधन बनाने के लिए मजबूर किया।
- **4. व्यवहारवाद पर जोर:** वैचारिक राजनीति से हटकर शासन और विकास पर केंद्रित एक अधिक व्यावहारिक, गैर-वैचारिक दृष्टिकोण की ओर एक बदलाव आया।

### लोकसभा चुनाव 2014 और उसके बाद
- 2014 के लोकसभा चुनावों ने एक बड़ा बदलाव चिह्नित किया। **नरेंद्र मोदी** के नेतृत्व वाली **भारतीय जनता पार्टी (भाजपा)** ने 1984 के बाद पहली बार अपने दम पर स्पष्ट बहुमत हासिल किया।
- इसे कुछ लोगों ने गठबंधन युग के अंत और **भाजपा के प्रभुत्व** के एक नए युग की शुरुआत के रूप में देखा।
- राजनीतिक विमर्श **विकास, सुशासन (विकास), और राष्ट्रवाद** के विषयों की ओर स्थानांतरित हो गया।
`
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
