
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";
import { NotesContentRenderer } from "@/components/notes-content-renderer";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'the-cold-war-era': {
    en: {
      title: 'Chapter 1: The Cold War Era',
      content: 'This chapter provides an overview of the Cold War, a period of geopolitical tension between the United States and the Soviet Union and their respective allies. Key topics include the ideological conflict, the arms race, and major international crises.'
    },
    hi: {
      title: 'अध्याय 1: शीतयुद्ध का दौर',
      content: 'यह अध्याय शीत युद्ध का अवलोकन प्रदान करता है, जो संयुक्त राज्य अमेरिका और सोवियत संघ और उनके संबंधित सहयोगियों के बीच भू-राजनीतिक तनाव का काल था। प्रमुख विषयों में वैचारिक संघर्ष, हथियारों की दौड़ और प्रमुख अंतर्राष्ट्रीय संकट शामिल हैं।'
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
1.  **Economic Stagnation:** The Soviet economy lagged behind the West for years. Severe shortages of consumer goods and massive military spending to keep up with the US in the arms race crippled the economy.
2.  **Political and Administrative Stagnation:** The single-party system became unaccountable and corrupt. The centralized authority was insensitive to the needs of the people in the 15 constituent republics.
3.  **Gorbachev’s Reforms:** While intended to save the system, Glasnost and Perestroika provided more freedom, which allowed long-suppressed nationalist feelings and discontent to surface.
4.  **Rise of Nationalism:** The desire for sovereignty among various republics (like Russia, the Baltic republics, Ukraine, and Georgia) was a primary and immediate cause of the disintegration.

### Consequences of Disintegration
1.  **End of the Cold War:** The collapse marked the end of the Cold War, the arms race, and the ideological confrontation between communism and capitalism.
2.  **Shift in World Power:** The bipolar world order ended, leaving the **United States as the sole superpower**, leading to a unipolar world.
3.  **Emergence of New Countries:** Many new countries emerged with their own independent aspirations, especially in Eastern Europe and Central Asia.
4.  **Shock Therapy:** Most of these newly independent countries transitioned from state-controlled socialism to democratic capitalism. This process, known as **'Shock Therapy'**, involved a rapid and radical shift to a market-based economy, which led to immense economic hardship for the general population in the initial years. It is often described as the largest garage sale in history, as valuable state assets were sold at throwaway prices.
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
1.  **आर्थिक ठहराव:** सोवियत अर्थव्यवस्था वर्षों तक पश्चिम से पीछे रही। उपभोक्ता वस्तुओं की गंभीर कमी और हथियारों की दौड़ में अमेरिका के साथ बने रहने के लिए बड़े पैमाने पर सैन्य खर्च ने अर्थव्यवस्था को पंगु बना दिया।
2.  **राजनीतिक और प्रशासनिक ठहराव:** एक-दलीय प्रणाली गैर-जवाबदेह और भ्रष्ट हो गई। केंद्रीकृत प्राधिकरण 15 घटक गणराज्यों में लोगों की जरूरतों के प्रति असंवेदनशील था।
3.  **गोर्बाचेव के सुधार:** जबकि प्रणाली को बचाने का इरादा था, ग्लास्नोस्त और पेरेस्त्रोइका ने अधिक स्वतंत्रता प्रदान की, जिससे लंबे समय से दमित राष्ट्रवादी भावनाओं और असंतोष को सतह पर आने दिया।
4.  **राष्ट्रवाद का उदय:** विभिन्न गणराज्यों (जैसे रूस, बाल्टिक गणराज्य, यूक्रेन और जॉर्जिया) के बीच संप्रभुता की इच्छा विघटन का एक प्राथमिक और तत्काल कारण था।

### विघटन के परिणाम
1.  **शीत युद्ध का अंत:** पतन ने शीत युद्ध, हथियारों की दौड़ और साम्यवाद और पूंजीवाद के बीच वैचारिक टकराव के अंत को चिह्नित किया।
2.  **विश्व शक्ति में बदलाव:** द्विध्रुवीय विश्व व्यवस्था समाप्त हो गई, जिससे **संयुक्त राज्य अमेरिका एकमात्र महाशक्ति** बन गया, जिससे एकध्रुवीय दुनिया का उदय हुआ।
3.  **नए देशों का उदय:** कई नए देश अपनी स्वतंत्र आकांक्षाओं के साथ उभरे, विशेष रूप से पूर्वी यूरोप और मध्य एशिया में।
4.  **शॉक थेरेपी:** इनमें से अधिकांश नए स्वतंत्र देश राज्य-नियंत्रित समाजवाद से लोकतांत्रिक पूंजीवाद में परिवर्तित हो गए। इस प्रक्रिया को **'शॉक थेरेपी'** के रूप में जाना जाता है, जिसमें बाजार-आधारित अर्थव्यवस्था में तेजी से और कट्टरपंथी बदलाव शामिल था, जिससे शुरुआती वर्षों में आम आबादी के लिए भारी आर्थिक कठिनाई हुई। इसे अक्सर इतिहास की सबसे बड़ी गैराज सेल के रूप में वर्णित किया जाता है, क्योंकि मूल्यवान राज्य संपत्ति को कौड़ियों के भाव बेच दिया गया था।
`
    }
  },
    'us-hegemony-in-world-politics': {
    en: {
      title: 'Chapter 3: US Hegemony in World Politics',
      content: 'This chapter analyzes the period of American dominance in global politics after the Cold War. It explores the nature of US hegemony and its impact on international relations.'
    },
    hi: {
      title: 'अध्याय 3: समकालीन विश्व में अमरीकी वर्चस्व',
      content: 'यह अध्याय शीत युद्ध के बाद वैश्विक राजनीति में अमेरिकी प्रभुत्व के काल का विश्लेषण करता है। यह अमेरिकी वर्चस्व की प्रकृति और अंतरराष्ट्रीय संबंधों पर इसके प्रभाव की पड़ताल करता है।'
    }
  },
  'alternative-centres-of-power': {
    en: {
      title: 'Chapter 4: Alternative Centres of Power',
      content: 'This chapter examines the rise of alternative centers of power that challenge the unipolar world order. It focuses on the European Union, ASEAN, and the rise of China as significant global players.'
    },
    hi: {
      title: 'अध्याय 4: सत्ता के वैकल्पिक केंद्र',
      content: 'यह अध्याय सत्ता के वैकल्पिक केंद्रों के उदय की जांच करता है जो एकध्रुवीय विश्व व्यवस्था को चुनौती देते हैं। यह यूरोपीय संघ, आसियान और चीन के महत्वपूर्ण वैश्विक खिलाड़ियों के रूप में उदय पर केंद्रित है।'
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
### Geographical Division
- There was no single belt of Muslim majority areas in British India. There were two areas of concentration, one in the east and one in the west. There was no way these two parts could be joined.

### Not all Muslim areas wanted to be in Pakistan.
- **Khan Abdul Ghaffar Khan**, the undisputed leader of the North-Western Frontier Province, was staunchly opposed to the two-nation theory.
- His voice was ignored, and the NWFP was made to merge with Pakistan.

### Division of Punjab and Bengal
- These two provinces also had very large areas where the non-Muslims were in a majority. Eventually, it was decided that these two provinces would be bifurcated.

### Problem of Minorities
- On both sides of the border lay large populations of minorities. The areas that were now in Pakistan had lakhs of Hindu and Sikh population.
- Similarly, the Indian territory of Punjab and Bengal had lakhs of Muslim population. These people feared what would become of them.

### Consequences of Partition
- The country was divided in the name of religion, which led to riots on both sides.
- Women were abducted, forcibly married, and made to convert their religion.
- In many cases, family members themselves killed their own women to protect the 'family honour'.
- People had to live in refugee camps.

### Challenges of Nation Building
Free India faced three major challenges. The first and the immediate challenge was **to shape a nation that was united**, yet accommodative of the diversity in our society.

### Integrity and Unity
- India, in its size and diversity, was like a continent. There were people speaking different languages, with different cultures, and followers of different religions. Uniting them all was a huge challenge.

### Establishment of Democracy
- The second challenge was to establish democracy. The Indian Constitution **guaranteed fundamental rights** and gave every citizen the right to vote.
- India adopted a representative democracy based on the parliamentary form of government.

### Development
- The third challenge was to ensure the development and well-being of the entire society and not only of some sections.
- The Constitution made it clear that everyone would be treated equally and that socially disadvantaged groups and religious and cultural minority communities would be given special protection.

### Problem of Princely States
- At the time of independence, there were **565 princely states** in India, big and small.
- The rulers of the princely states were given the freedom by the British government to join either India or Pakistan or to maintain their independent existence.
- The right to take this decision was given to the king, not the people.

### Sardar Vallabhbhai Patel and National Integration
- It was India's good fortune that a visionary statesman like **Sardar Patel** took on the task of reorganizing the Indian states in that difficult time.

### Junagadh and Hyderabad
- The rulers of these two states wanted to go with Pakistan. But Sardar Patel, with his wisdom, integrated both these states into India.
- Junagadh was merged into India through a **plebiscite**.
- And for Hyderabad, India had to undertake military action (**Operation Polo**).

### Travancore and Bhopal
- The king of Travancore announced that his state had decided on Independence.
- The Nawab of Bhopal was unwilling to join the Constituent Assembly.

### Jammu and Kashmir
- A similar problem existed in Kashmir. Most of the people here were Muslim, but the king was Hindu (**Raja Hari Singh**).
- He also refused to join India. But later, seeing the pressure from Pakistan, he sought help from India and decided to merge with India.

### Outcome
- By independence, most of the princely states had joined the Indian Union.
- The rulers of most of the princely states signed a document called the **'Instrument of Accession'** which meant that their state agreed to become a part of the Union of India.
- The rulers of the princely states were persuaded to join the Indian Union. They were given some special rights like the **Privy Purse** (some special allowances).

### Manipur
- A few days before independence, the Maharaja of Manipur, **Bodhchandra Singh**, signed the Instrument of Accession with the Indian government.
- In return, he was assured that the internal autonomy of Manipur would be maintained.
- Under the pressure of public opinion, the Maharaja held elections in Manipur in June 1948, and the state became a constitutional monarchy.
- Manipur was the first part of India to hold an election based on the **universal adult franchise**.
- The Government of India succeeded in pressuring the Maharaja into signing a Merger Agreement in 1949.

### Reorganisation of States
### States on the basis of Language
- During the British rule, the provinces were formed for administrative convenience.
- But in independent India, there was a demand for the formation of states on the basis of language and culture.

### Vishalandhra Movement
- This movement was for a separate state of **Andhra Pradesh**.
- This movement took place in the Telugu-speaking areas of the Madras province.
- Congress leader and veteran Gandhian, **Potti Sriramulu**, went on an indefinite fast that led to his death after 56 days.
- Finally, in December 1952, the Prime Minister announced the formation of a separate Andhra state.

### States Reorganisation Commission
- The Central Government set up the **States Reorganisation Commission** in 1953.
- The task of this commission was to look into the matter of redrawing the boundaries of states.
- On the basis of its report, the **States Reorganisation Act** was passed in 1956.
- This led to the creation of 14 states and 6 union territories.

### Creation of New States
- **1960:** Maharashtra and Gujarat
- **1963:** Nagaland
- **1966:** Haryana and Himachal Pradesh carved out of Punjab
- **1972:** Meghalaya, Manipur, and Tripura carved out of Assam
- **1987:** Arunachal Pradesh and Mizoram
- **2000:** Chhattisgarh, Uttarakhand, and Jharkhand
- **2014:** Telangana carved out of Andhra Pradesh
`
    },
    hi: {
      title: 'अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ',
      content: `### भारत की आज़ादी
- 14, 15 अगस्त 1947 की मध्य रात्रि को भारत आज़ाद हुआ।
- स्वतंत्र भारत के प्रथम प्रधानमंत्री जवाहरलाल नेहरू ने इस रात संविधान सभा के एक विशेष सत्र को सम्बोधित किया। उनका यह भाषण **'भाग्यवधू से चिर-प्रतीक्षित भेंट'** या **'ट्रिस्ट विद डेस्टिनी'** के नाम से जाना गया।
- आज़ादी की लड़ाई के समय दो बातों पर सबकी सहमति थी पहली कि आज़ादी के बाद देश का शासन लोकतांत्रिक तरीके से चलाया जाएगा।
- दूसरी यह कि सरकार समाज के सभी वर्गों के लिए कार्य करेगी (गरीब और कमजोर लोगों का विशेष ध्यान रखेगी)।

### द्विराष्ट्र सिद्धांत
- इस सिद्धांत को **मुस्लिम लीग** ने अपनाया था। इस सिद्धांत के अनुसार भारत किसी एक कौम का नहीं बल्कि हिंदू और मुसलमान नाम की दो कौमो का देश था।
- इसी कारण मुस्लिम लीग ने मुसलमानो के लिए एक अलग देश **पाकिस्तान** की मांग की। कांग्रेस ने इस सिद्धांत का विरोध किया।

### विभाजन की समस्या
### भू-विभाजन
- भारत में ऐसा कोई क्षेत्र नहीं था जहाँ मुसलमान बहुसंख्यक हो। केवल दो क्षेत्र थे एक पूर्व में और एक पश्चिम में जहाँ मुसलमान बहुसंख्यक थे। ऐसा कोई तरीका नहीं था जिससे इन दोनों क्षेत्रों को जोड़ा जा सके।

### सभी मुस्लिम क्षेत्र पाकिस्तान में जाने को राज़ी नहीं थे।
- **खान अब्दुल गफ्फार खान** पश्चिमोत्तर सीमा प्रांत के निर्विवाद नेता थे। वे द्विराष्ट्र सिद्धांत के एकदम खिलाफ थे।
- उनकी आवाज को अनसुना कर दिया गया और पश्चिमोत्तर सीमा प्रांत को पाकिस्तान में शामिल कर लिया गया।

### पंजाब और बंगाल का विभाजन
- इन दोनों राज्यों में भी बहुसंख्यक गैर मुस्लिम थे। ऐसे में इन दोनों राज्यों का भी बंटवारा किया गया।

### अल्पसंख्यकों की समस्या
- सीमा के दोनों तरफ अल्पसंख्यक थे। जो क्षेत्र अब पाकिस्तान में थे वहां लाखों की संख्या में हिंदू और सिख थे।
- इसी तरह पंजाब और बंगाल के भारतीय भूभाग में भी लाखों की संख्या में मुस्लिम आबादी थी। इन लोगों के मन में यह डर था कि अब हमारा क्या होगा?

### विभाजन के परिणाम
- देश का बंटवारा धर्म के नाम पर हुआ था इसीलिए दोनों तरफ दंगे हुए।
- औरतों को अगवा किया गया, जबरन शादी कर धर्म बदलवाया गया।
- कई मामलों में तो खुद परिवार के लोगों ने अपनी कुल की इज्जत बचाने के लिए घर की बहू बेटियों को मार डाला।
- शरणार्थी शिविरों में जीवन बिताना पड़ा।

### राष्ट्र निर्माण की चुनौतियां
स्वतंत्र भारत के सामने तीन मुख्य चुनौतियां थी। पहली और तात्कालिक चुनौती **एकता के सूत्र में बंधे एक ऐसे भारत को गढ़ने की थी**, जिसमें भारतीय समाज की सारी विविधताओं के लिए स्थान हो।

### अखंडता और एकता
- भारत अपने आकार और विविधता में किसी महादेश के बराबर था। यहां अलग-अलग बोली बोलने वाले लोग थे, उनकी संस्कृति अलग थी और वे अलग-अलग धर्मों के अनुयाई थे। इन सभी को एकजुट करना एक बहुत बड़ी चुनौती थी।

### लोकतंत्र की स्थापना
- दूसरी चुनौती लोकतंत्र को कायम करने की थी। भारतीय संविधान में **मौलिक अधिकारों की गारंटी** दी गई है और हर नागरिक को मतदान का अधिकार दिया गया है।
- भारत ने संसदीय शासन पर आधारित प्रतिनिधित्वमूलक लोकतंत्र को अपनाया।

### विकास
- तीसरी चुनौती ऐसे विकास की थी जिससे समूचे समाज का भला होता हो न कि कुछ एक वर्गों का।
- संविधान में यह बात साफ कर दी गई थी कि सबके साथ समानता का बर्ताव किया जाएगा और सामाजिक रूप से वंचित वर्गों तथा धार्मिक सांस्कृतिक अल्पसंख्यक समुदायों को विशेष सुरक्षा दी जाएगी।

### रजवाड़ों की समस्या
- आजादी के समय भारत में छोटे-बड़े **565 रजवाड़े** थे।
- रजवाड़ों के शासकों को ब्रिटिश सरकार ने यह आजादी दी की वे चाहे तो भारत में शामिल हो या पाकिस्तान में या चाहे तो अपना स्वतंत्र अस्तित्व भी बनाए रख सकते हैं।
- यह फैसला लेने का अधिकार राजा को दिया गया था ना की प्रजा को।

### सरदार वल्लभ भाई पटेल और राष्ट्रीय एकता
- भारत का यह सौभाग्य था कि **सरदार पटेल** जैसे दूरदर्शी राजनेता ने उस कठिन घड़ी में भारतीय राज्यों के पुनर्गठन का बीड़ा उठाया।

### जूनागढ़ और हैदराबाद
- इन दोनों रियासतों के शासक पाकिस्तान के साथ जाना चाहते थे। पर सरदार पटेल ने अपनी सूझबूझ से इन दोनों रियासतों को भारत में शामिल कर लिया।
- जूनागढ़ को भारत में **जनमत संग्रह** के द्वारा मिलाया गया।
- और हैदराबाद के खिलाफ भारत को सैनिक कार्रवाई करनी पड़ी (**ऑपरेशन पोलो**)।

### त्रावणकोर और भोपाल
- त्रावणकोर के राजा ने अपने राज्य को आजाद रखने की घोषणा की।
- भोपाल के नवाब संविधान सभा में शामिल नहीं होना चाहते थे।

### जम्मू एवं कश्मीर
- इसी तरह की समस्या कश्मीर में भी थी। यहां की अधिकांश जनता मुस्लिम थी पर यहां का राजा हिंदू था (**राजा हरि सिंह**)।
- उसने भी भारत में शामिल होने से इंकार कर दिया। पर बाद में पाकिस्तान के दबाव को देखते हुए उसने भारत से मदद मांगी और भारत में शामिल होने का फैसला किया।

### परिणाम
- आजादी तक अधिकतर रजवाड़े भारतीय संघ में शामिल हो चुके थे।
- अधिकतर रजवाड़ों के शासकों ने भारतीय संघ में अपने विलय के एक सहमति पत्र पर हस्ताक्षर किए थे। इस सहमति पत्र को (**इंस्ट्रूमेंट आफ एक्सेशन**) कहा जाता है।
- रजवाड़ों के शासकों को भारतीय संघ में शामिल होने के लिए मनाया गया। उन्हें कुछ विशेष अधिकार दिए गए जैसे की **प्रिवी पर्स** (कुछ विशेष भत्ते)।

### मणिपुर
- आजादी के कुछ समय पहले मणिपुर के महाराजा **बोधचंद्र सिंह** ने भारत सरकार के साथ भारतीय संघ में अपनी रियासत के विलय के एक सहमति पत्र पर हस्ताक्षर किए थे।
- इसके बदले में उन्हें यह आश्वासन दिया गया था कि मणिपुर की आंतरिक स्वायत्तता बरकरार रहेगी।
- जनमत के दबाव में महाराजा ने 1948 के जून में चुनाव करवाया और इस चुनाव के फलस्वरूप मणिपुर में संवैधानिक राजतंत्र कायम हुआ।
- मणिपुर भारत का पहला भाग है जहां **सार्वभौमिक वयस्क मताधिकार** के सिद्धांत को अपनाकर चुनाव हुए।
- भारत सरकार ने 1949 में महाराजा पर दबाव डालकर विलय पत्र पर हस्ताक्षर करवा लिए।

### राज्यों का पुनर्गठन
### भाषा के आधार पर राज्यों की स्थिति
- अंग्रेजी शासन के समय प्रांतों का गठन प्रशासनिक सुविधा के अनुसार किया गया था।
- लेकिन स्वतंत्र भारत में भाषा और संस्कृति के आधार पर राज्यों के गठन की मांग उठी।

### विशालान्ध्र आंदोलन
- यह आंदोलन **आंध्र प्रदेश** नाम से अलग राज्य बनाने के लिए किया गया।
- यह आंदोलन मद्रास प्रांत के तेलुगु भाषी क्षेत्रों में हुआ।
- कांग्रेस के नेता और दिग्गज गांधीवादी **पोट्टी श्रीरामुलु** अनिश्चितकालीन भूख हड़ताल पर बैठ गए। 56 दिनों की भूख हड़ताल के बाद उनकी मृत्यु हो गई।
- आखिरकार 1952 के दिसंबर में प्रधानमंत्री ने आंध्र प्रदेश नाम से अलग राज्य बनाने की घोषणा की।

### राज्य पुनर्गठन आयोग
- केंद्र सरकार ने 1953 में **राज्य पुनर्गठन आयोग** बनाया।
- इस आयोग का काम राज्यों के सीमांकन के मामले पर गौर करना था।
- इस आयोग की रिपोर्ट के आधार पर 1956 में **राज्य पुनर्गठन अधिनियम** पास हुआ।
- इस अधिनियम के आधार पर 14 राज्य और 6 केंद्र शासित प्रदेश बनाए गए।

### नए राज्यों का निर्माण
- **1960:** महाराष्ट्र और गुजरात
- **1963:** नागालैंड
- **1966:** पंजाब से अलग करके हरियाणा और हिमाचल प्रदेश
- **1972:** असम से अलग करके मेघालय, मणिपुर और त्रिपुरा
- **1987:** अरुणाचल प्रदेश और मिजोरम
- **2000:** छत्तीसगढ़, उत्तराखंड और झारखंड
- **2014:** आंध्र प्रदेश से अलग करके तेलंगाना
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
देश में चुनाव करवाना किसी चुनौती से कम नहीं था। ऐसा इसीलिए था क्योंकि:
- **साक्षरता:** देश में केवल 16 प्रतिशत लोग ही पढ़े लिखे थे।
- **गरीबी:** देश की अधिकांश जनसँख्या गरीबी से जूझ रही थी।
- **संसाधनों का आभाव:** संचार के साधनों एवं प्रौद्योगिकी का आभाव था।
- **विशाल मतदाता:** 17 करोड़ मतदाताओं द्वारा 3200 विधायक और 489 सांसद चुने जाने थे।
- **चुनाव क्षेत्रों का निर्धारण:** चुनाव क्षेत्रों का निर्धारण किया जाना था।

### भारत का पहला आम चुनाव (1952)
देश में पहले आम चुनाव करवाने के लिए:
- लगभग 3 लाख लोगो को प्रशिक्षित किया गया।
- चुनाव क्षेत्रों का सीमांकन किया गया।
- मतदाता सूची बनाई गई (प्रत्येक व्यक्ति जो 21 वर्ष से अधिक आयु का था)।
- देश में चुनाव प्रचार शुरू हुआ।

### पहले तीन चुनावों में कांग्रेस का प्रभुत्व
- इस पहले चुनाव में भारतीय राष्ट्रीय कांग्रेस ने कुल 489 सीटों में से **364 सीटें** जीती।
- कम्युनिस्ट पार्टी ऑफ इंडिया 16 सीटें जीतकर दूसरे स्थान पर रही।
- भारत में पहले तीन आम चुनाव (1952, 1957, 1962) में भारतीय राष्ट्रीय कांग्रेस का दबदबा रहा।
- **केरल में 1957** में हुए विधानसभा चुनाव में कम्युनिस्ट पार्टी ऑफ इंडिया ने सरकार बनाई। पर 1959 में कांग्रेस ने **संविधान के अनुच्छेद 356** का प्रयोग करके इनकी सरकार को बर्खास्त कर दिया।

### कांग्रेस के प्रभुत्व के कारण
- **सबसे पुरानी पार्टी होना:** स्वतंत्रता संग्राम में मुख्य भूमिका।
- **सबसे मजबूत संगठन:** पूरे देश में फैला हुआ था।
- **बड़े नेता:** कई बड़े और मुख्य नेता कांग्रेस में थे।
- **सभी वर्गों का समर्थन:** सभी वर्गों का समर्थन प्राप्त था।

### कांग्रेस के प्रभुत्व की प्रकृति
- भारत में पहले तीन आम चुनाव में कांग्रेस का प्रभुत्व रहा पर यह प्रभुत्व दुनिया के अन्य देशों से अलग था।
- बाकी देशों में एक पार्टी का प्रभुत्व तानाशाही के बल पर था जबकि भारत में लोकतंत्रिक तरीके से था।
- (उदाहरण के लिए चीन, क्यूबा और सीरिया जैसे देशों में संविधान में ही एक पार्टी को शासन करने की अनुमति है)
- (म्यांमार, बेलारूस और इरीट्रिया जैसे देशों में सैन्य शासन की वजह से)
- भारत में ऐसा कुछ भी नहीं था यहां पर लोकतंत्रिक तरीके से कांग्रेस पार्टी बार बार चुनाव जीत रही थी।

### मुख्य पार्टियां
### सोशलिस्ट पार्टी
- सोशलिस्ट पार्टी का गठन **1934 में कांग्रेस के अंदर** ही जयप्रकाश नारायण, राम मनोहर लोहिया, आचार्य नरेंद्र देव और अशोक मेहता जैसे युवा नेताओं द्वारा किया गया था।
- **विचारधारा:** समाजवाद में विश्वास, अमीर और पूंजीपतियों का विरोध कर गरीबों की भलाई करना।

### कम्युनिस्ट पार्टी ऑफ इंडिया
- 1920 के दशक में रूस में हुई बोल्शेविक क्रांति से प्रेरित होकर भारत के कई हिस्सों में साम्यवादी गुट उभरे।
- **विचारधारा:** साम्यवाद में विश्वास। इस पार्टी का मुख्य प्रभाव आंध्र प्रदेश, पश्चिम बंगाल, बिहार और केरल में था।
- 1964 में यह पार्टी दो हिस्सों में बट गई: **भारतीय कम्युनिस्ट पार्टी (CPI)** और **भारतीय कम्युनिस्ट पार्टी (मार्क्सवादी) (CPIM)**।

### स्वतंत्र पार्टी
- अगस्त 1959 में इस पार्टी का गठन हुआ।
- **विचारधारा:** इस पार्टी ने सरकार के अर्थव्यवस्था में हस्तक्षेप का विरोध किया, निजी क्षेत्र को छूट देने की बात कही, और विदेशी मामलों में अमेरिका से दोस्ती का समर्थन किया।
- **मुख्य नेता:** सी. राजगोपालाचारी, के. एम. मुंशी, एन. जी. रंगा, मीनू मसानी।

### भारतीय जनसंघ
- इसका गठन **1951 में श्यामा प्रसाद मुखर्जी** द्वारा किया गया था।
- **विचारधारा:** एक देश एक संस्कृति और एक राष्ट्र, हिंदी को राजभाषा बनाना, और भारत और पाकिस्तान को मिलाकर अखंड भारत बनाना।
- **मुख्य नेता:** श्यामा प्रसाद मुखर्जी, दीनदयाल उपाध्याय, बलराज मधोक।
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
1.  **Agriculture vs. Industry:** Many critics, like Gandhian economist **J. C. Kumarappa**, argued that the Second Plan neglected agriculture and rural India, which could lead to food crises. Others, like **Chaudhary Charan Singh**, emphasized that without a prosperous agricultural sector, industrialization could not be sustained.
2.  **Public vs. Private Sector:** The plan's reliance on a large public sector was criticized by those who favored a more open, private-sector-led economy. They argued that state control created inefficiency, corruption, and a 'license-permit raj' that stifled private enterprise.

### Major Outcomes and Legacy
- **Foundations of Growth:** The planning era laid the foundation for India's future economic growth by creating key infrastructure like dams, power plants, and heavy industries.
- **Land Reforms:** Several land reform measures were undertaken, such as the abolition of the zamindari system, but they were not fully successful due to legal loopholes and political opposition.
- **The Green Revolution (late 1960s):** To overcome food shortages, the government focused on high-yield variety (HYV) seeds, fertilizers, and irrigation.
- **Benefits:** It led to a massive increase in the production of wheat and rice, making India self-sufficient in food grains. It particularly benefited farmers in Punjab, Haryana, and Western Uttar Pradesh.
- **Criticism:** It increased the gap between rich and poor farmers and favored regions with better irrigation.
- **The White Revolution (Operation Flood):** This program, led by **Verghese Kurien** (the "Milkman of India"), created a nationwide milk grid and made India the world's largest milk producer. It was based on a cooperative model (Amul).
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
1.  **कृषि बनाम उद्योग:** गांधीवादी अर्थशास्त्री **जे. सी. कुमारप्पा** जैसे कई आलोचकों ने तर्क दिया कि दूसरी योजना ने कृषि और ग्रामीण भारत की उपेक्षा की, जिससे खाद्य संकट पैदा हो सकता है। **चौधरी चरण सिंह** जैसे अन्य लोगों ने इस बात पर जोर दिया कि एक समृद्ध कृषि क्षेत्र के बिना औद्योगिकीकरण को बनाए नहीं रखा जा सकता है।
2.  **सार्वजनिक बनाम निजी क्षेत्र:** एक बड़े सार्वजनिक क्षेत्र पर योजना की निर्भरता की उन लोगों द्वारा आलोचना की गई जो अधिक खुली, निजी क्षेत्र के नेतृत्व वाली अर्थव्यवस्था के पक्ष में थे। उन्होंने तर्क दिया कि राज्य के नियंत्रण ने अक्षमता, भ्रष्टाचार और एक 'लाइसेंस-परमिट राज' बनाया जिसने निजी उद्यम को बाधित किया।

### प्रमुख परिणाम और विरासत
- **विकास की नींव:** योजना युग ने बांधों, बिजली संयंत्रों और भारी उद्योगों जैसे प्रमुख बुनियादी ढांचे का निर्माण करके भारत के भविष्य के आर्थिक विकास की नींव रखी।
- **भूमि सुधार:** ज़मींदारी प्रथा के उन्मूलन जैसे कई भूमि सुधार उपाय किए गए, लेकिन कानूनी खामियों और राजनीतिक विरोध के कारण वे पूरी तरह से सफल नहीं हुए।
- **हरित क्रांति (1960 के दशक के अंत में):** खाद्य कमी को दूर करने के लिए, सरकार ने उच्च उपज वाली किस्म (HYV) के बीज, उर्वरकों और सिंचाई पर ध्यान केंद्रित किया।
- **लाभ:** इससे गेहूं और चावल के उत्पादन में भारी वृद्धि हुई, जिससे भारत खाद्यान्न में आत्मनिर्भर हो गया। इसने विशेष रूप से पंजाब, हरियाणा और पश्चिमी उत्तर प्रदेश के किसानों को लाभान्वित किया।
- **आलोचना:** इसने अमीर और गरीब किसानों के बीच की खाई को बढ़ा दिया और बेहतर सिंचाई वाले क्षेत्रों का पक्ष लिया।
- **श्वेत क्रांति (ऑपरेशन फ्लड):** **वर्गीज कुरियन** ("मिल्कमैन ऑफ इंडिया") के नेतृत्व में इस कार्यक्रम ने एक राष्ट्रव्यापी दूध ग्रिड बनाया और भारत को दुनिया का सबसे बड़ा दूध उत्पादक बनाया। यह एक सहकारी मॉडल (अमूल) पर आधारित था।
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
- - **To play an active role:** Non-alignment was not about isolation. It was about actively participating in world affairs to reduce Cold War tensions and promote peace. India often tried to mediate between the two blocs.
- **The Bandung Conference (1955):** This Afro-Asian conference was a key moment in the establishment of the Non-Aligned Movement. The first NAM summit was held in **Belgrade in 1961**.
- **Criticism:** India's policy was sometimes criticized for being inconsistent. For instance, India signed a **Treaty of Friendship with the Soviet Union in 1971** for 20 years, which some saw as a departure from non-alignment. India's stance was that this was necessary for national interest, especially given the context of the Bangladesh war and growing US-Pakistan-China ties.

### Relations with China
- **Initial Friendship:** In the beginning, India and China had a friendly relationship, based on the slogan **'Hindi-Chini Bhai-Bhai'** (Indians and Chinese are brothers).
- **Panchsheel (1954):** Nehru and Chinese Premier Zhou Enlai signed the **Panchsheel Agreement**, the Five Principles of Peaceful Coexistence. This was meant to be the bedrock of their relationship.
- **The Tibet Issue:** The relationship soured when China annexed Tibet in 1950. When the Dalai Lama was given asylum in India in 1959, China accused India of interfering in its internal affairs.
- **The Border Dispute:** The main conflict was over the border. China claimed Aksai Chin in Ladakh and a large part of Arunachal Pradesh.
- **The 1962 War:** China launched a swift and massive invasion in October 1962 on both disputed fronts. The Indian army was unprepared and suffered a major defeat. This war had a lasting impact:
- - It shattered Nehru's image and India's international prestige.
- - India's military underwent significant modernization.
- - Relations with China remained strained for a very long time. It was only in the late 1980s that diplomatic relations began to improve.

### Relations with Pakistan
- **Conflict from the start:** The relationship has been marked by conflict and suspicion right from the partition, especially over the issue of **Kashmir**.
- **The 1947-48 War:** This was the first conflict over Kashmir, which led to the division of the state into Pakistan-occupied Kashmir (PoK) and the Indian state of Jammu and Kashmir, with the Line of Control (LoC) between them.
- **The 1965 War:** A second war was fought over Kashmir. The war ended in a stalemate, followed by the **Tashkent Agreement** in 1966, mediated by the Soviet Union.
- **The 1971 War and the Birth of Bangladesh:**
- - The conflict began due to internal problems in Pakistan. The people of East Pakistan (now Bangladesh) were protesting against unfair treatment by West Pakistan.
- - Pakistan's military launched a brutal crackdown, leading to a massive refugee crisis in India.
- - India supported the freedom struggle of Bangladesh and, after Pakistan attacked Indian airbases, a full-scale war broke out in December 1971.
- - The Indian army won a decisive victory, leading to the creation of Bangladesh. This was followed by the **Shimla Agreement** between Indira Gandhi and Zulfikar Ali Bhutto in 1972.
- **The Kargil Conflict (1999):** Pakistani forces captured several strategic high points on the Indian side of the LoC in the Kargil sector. This led to a conflict which India won, reclaiming the occupied territories.

### India's Nuclear Policy
- India's nuclear policy has been guided by the principle of **'No First Use'**.
- India has always argued for a nuclear-free world but also insisted that this should be universal and non-discriminatory. India refused to sign the Nuclear Non-Proliferation Treaty (NPT) of 1968, calling it discriminatory.
- **First Nuclear Test (1974):** India conducted its first nuclear test, terming it a 'peaceful explosion'.
- **Second Nuclear Tests (1998):** India conducted a series of nuclear tests at Pokhran, demonstrating its capacity to build nuclear weapons. This led to international sanctions but also established India as a nuclear power.
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
- - **एक सक्रिय भूमिका निभाने के लिए:** गुटनिरपेक्षता अलगाव के बारे में नहीं थी। यह शीत युद्ध के तनाव को कम करने और शांति को बढ़ावा देने के लिए विश्व मामलों में सक्रिय रूप से भाग लेने के बारे में थी। भारत ने अक्सर दोनों गुटों के बीच मध्यस्थता करने की कोशिश की।
- **बांडुंग सम्मेलन (1955):** यह एफ्रो-एशियाई सम्मेलन गुटनिरपेक्ष आंदोलन की स्थापना में एक महत्वपूर्ण क्षण था। पहला NAM शिखर सम्मेलन **1961 में बेलग्रेड** में आयोजित किया गया था।
- **आलोचना:** भारत की नीति की कभी-कभी असंगत होने के लिए आलोचना की जाती थी। उदाहरण के लिए, भारत ने 20 वर्षों के लिए **1971 में सोवियत संघ के साथ मैत्री संधि** पर हस्ताक्षर किए, जिसे कुछ लोगों ने गुटनिरपेक्षता से विचलन के रूप में देखा। भारत का रुख यह था कि यह राष्ट्रीय हित के लिए आवश्यक था, विशेष रूप से बांग्लादेश युद्ध और बढ़ते अमेरिका-पाकिस्तान-चीन संबंधों के संदर्भ में।

### चीन के साथ संबंध
- **प्रारंभिक मित्रता:** शुरुआत में, भारत और चीन के बीच **'हिंदी-चीनी भाई-भाई'** के नारे पर आधारित एक दोस्ताना रिश्ता था।
- **पंचशील (1954):** नेहरू और चीनी प्रधानमंत्री झोउ एनलाई ने **पंचशील समझौते** पर हस्ताक्षर किए, जो शांतिपूर्ण सह-अस्तित्व के पांच सिद्धांत थे। यह उनके संबंधों का आधार बनने वाला था।
- **तिब्बत मुद्दा:** जब चीन ने 1950 में तिब्बत पर कब्जा कर लिया तो संबंध खराब हो गए। जब 1959 में दलाई लामा को भारत में शरण दी गई, तो चीन ने भारत पर अपने आंतरिक मामलों में हस्तक्षेप करने का आरोप लगाया।
- **सीमा विवाद:** मुख्य संघर्ष सीमा को लेकर था। चीन ने लद्दाख में अक्साई चिन और अरुणाचल प्रदेश के एक बड़े हिस्से पर दावा किया।
- **1962 का युद्ध:** चीन ने अक्टूबर 1962 में दोनों विवादित मोर्चों पर एक तेज और बड़े पैमाने पर आक्रमण किया। भारतीय सेना तैयार नहीं थी और उसे एक बड़ी हार का सामना करना पड़ा। इस युद्ध का एक स्थायी प्रभाव पड़ा:
- - इसने नेहरू की छवि और भारत की अंतर्राष्ट्रीय प्रतिष्ठा को चकनाचूर कर दिया।
- - भारत की सेना का महत्वपूर्ण आधुनिकीकरण हुआ।
- - चीन के साथ संबंध बहुत लंबे समय तक तनावपूर्ण बने रहे। 1980 के दशक के अंत में ही राजनयिक संबंधों में सुधार शुरू हुआ।

### पाकिस्तान के साथ संबंध
- **शुरुआत से ही संघर्ष:** विभाजन के ठीक बाद से, विशेष रूप से **कश्मीर** के मुद्दे पर, संबंध संघर्ष और संदेह से चिह्नित रहे हैं।
- **1947-48 का युद्ध:** यह कश्मीर पर पहला संघर्ष था, जिसके कारण राज्य को पाकिस्तान के कब्जे वाले कश्मीर (PoK) और भारतीय राज्य जम्मू और कश्मीर में विभाजित किया गया, जिसके बीच नियंत्रण रेखा (LoC) थी।
- **1965 का युद्ध:** कश्मीर पर दूसरा युद्ध लड़ा गया। युद्ध एक गतिरोध में समाप्त हुआ, जिसके बाद 1966 में सोवियत संघ की मध्यस्थता में **ताशकंद समझौता** हुआ।
- **1971 का युद्ध और बांग्लादेश का जन्म:**
- - यह संघर्ष पाकिस्तान की आंतरिक समस्याओं के कारण शुरू हुआ। पूर्वी पाकिस्तान (अब बांग्लादेश) के लोग पश्चिमी पाकिस्तान द्वारा अनुचित व्यवहार के खिलाफ विरोध कर रहे थे।
- - पाकिस्तान की सेना ने एक क्रूर कार्रवाई की, जिससे भारत में एक बड़ा शरणार्थी संकट पैदा हो गया।
- - भारत ने बांग्लादेश के स्वतंत्रता संग्राम का समर्थन किया और पाकिस्तान द्वारा भारतीय हवाई अड्डों पर हमला करने के बाद, दिसंबर 1971 में एक पूर्ण पैमाने पर युद्ध छिड़ गया।
- - भारतीय सेना ने एक निर्णायक जीत हासिल की, जिससे बांग्लादेश का निर्माण हुआ। इसके बाद 1972 में इंदिरा गांधी और जुल्फिकार अली भुट्टो के बीच **शिमला समझौता** हुआ।
- **कारगिल संघर्ष (1999):** पाकिस्तानी सेना ने कारगिल क्षेत्र में LoC के भारतीय हिस्से में कई रणनीतिक ऊंचाइयों पर कब्जा कर लिया। इससे एक संघर्ष हुआ जिसे भारत ने जीता, और कब्जे वाले क्षेत्रों को पुनः प्राप्त किया।

### भारत की परमाणु नीति
- भारत की परमाणु नीति **'पहले उपयोग नहीं'** के सिद्धांत द्वारा निर्देशित की गई है।
- भारत ने हमेशा परमाणु मुक्त दुनिया के लिए तर्क दिया है, लेकिन इस बात पर भी जोर दिया है कि यह सार्वभौमिक और गैर-भेदभावपूर्ण होना चाहिए। भारत ने 1968 की परमाणु अप्रसार संधि (NPT) पर हस्ताक्षर करने से इनकार कर दिया, इसे भेदभावपूर्ण बताया।
- **पहला परमाणु परीक्षण (1974):** भारत ने अपना पहला परमाणु परीक्षण किया, इसे 'शांतिपूर्ण विस्फोट' करार दिया।
- **दूसरा परमाणु परीक्षण (1998):** भारत ने पोखरण में कई परमाणु परीक्षण किए, जिससे परमाणु हथियार बनाने की अपनी क्षमता का प्रदर्शन हुआ। इससे अंतर्राष्ट्रीय प्रतिबंध लगे लेकिन भारत को एक परमाणु शक्ति के रूप में भी स्थापित किया गया।
`
    }
  },
  'challenges-to-and-restoration-of-the-congress-system': {
    en: {
      title: 'Chapter 5: Challenges to and Restoration of the Congress System',
      content: `### From Nehru to Shastri
- Prime Minister Jawaharlal Nehru passed away in **May 1964**. His death led to speculation about India's democratic future, but the transition was smooth.
- **Lal Bahadur Shastri** became the next Prime Minister (1964-1966). He was known for his simplicity and commitment to principles.
- **Challenges during Shastri's tenure:**
- - **Economic Crisis:** India faced food shortages and a monsoon failure.
- - **War with Pakistan (1965):** Shastri's leadership during the war was widely praised. He gave the famous slogan **'Jai Jawan, Jai Kisan'** (Hail the soldier, Hail the farmer) to unite the country.
- The war ended with the **Tashkent Agreement** in January 1966, mediated by the Soviet Union. Shastri passed away in Tashkent shortly after.

### From Shastri to Indira Gandhi
- After Shastri's death, there was an intense competition between **Morarji Desai** and **Indira Gandhi** for the post of Prime Minister.
- The powerful group of Congress leaders, known as the **'Syndicate'**, supported Indira Gandhi, believing she would be dependent on their guidance.
- Indira Gandhi defeated Morarji Desai and became the Prime Minister.

### The Fourth General Election, 1967
- **Context of the election:** This period was marked by serious economic problems, food scarcity, rising prices, and widespread protests. The opposition parties organized protests and called for **'bandhs'**.
- **Non-Congressism:** This term was coined by socialist leader **Ram Manohar Lohia**. He argued that the Congress rule was undemocratic and that all non-Congress parties should unite to oust it.
- **Election Verdict - A 'Political Earthquake':**
- - The Congress managed to form a government at the Centre but with its lowest-ever tally of seats and vote share.
- - Many senior Congress leaders (including K. Kamaraj and S.K. Patil) lost their seats.
- - The Congress lost majority in **nine states**, and non-Congress governments were formed. This was the first time Congress faced such a significant challenge to its dominance.
- **Coalitions:** The 1967 elections marked the beginning of the era of coalitions. Since no single party got a majority in many states, various non-Congress parties formed joint legislative parties called **Samyukta Vidhayak Dal (SVD)** to form governments.

### Split in the Congress
- **Syndicate vs. Indira Gandhi:** Indira Gandhi faced a challenge from the 'Syndicate' within her own party. They had supported her but now found her asserting her independence.
- **Presidential Election, 1969:** The conflict came to a head during the presidential election after the death of President Zakir Hussain.
- - The Syndicate nominated **N. Sanjeeva Reddy** as the official Congress candidate.
- - Indira Gandhi encouraged the then Vice-President, **V.V. Giri**, to file his nomination as an independent candidate. She called for a **'conscience vote'**, indirectly asking Congress MPs and MLAs to vote for Giri.
- - V.V. Giri won the election, which was a major setback for the Syndicate.
- The Congress President expelled Indira Gandhi from the party, but she claimed that her group was the real Congress.
- This led to a formal split in **1969**. The Congress party was divided into:
- - **Congress (Organisation)** or Congress (O): Led by the Syndicate.
- - **Congress (Requisitionists)** or Congress (R): Led by Indira Gandhi. This was the new Congress.

### The 1971 Election and Restoration of Congress
- Indira Gandhi's government lost its majority after the split but continued in power with the support of some other parties like the DMK and CPI.
- **Indira Gandhi's Strategy:** She adopted a very bold and leftist strategy.
- - **Abolition of Privy Purse:** She moved to abolish the 'privy purse', a special payment given to the former princes, arguing it was against the principle of equality.
- - **Garibi Hatao (Remove Poverty):** This was her main slogan for the 1971 election. It was a powerful slogan that connected with the poor and marginalized.
- - In contrast, the opposition parties formed a **'Grand Alliance'** with the simple slogan **'Indira Hatao'** (Remove Indira).
- **Election Outcome:**
- - The results were a landslide victory for Indira Gandhi's Congress (R). The Congress (R) and CPI alliance won **375 seats** in the Lok Sabha.
- - The Grand Alliance was a massive failure.
- This election was a significant turning point. It not only restored the dominance of the Congress but also established Indira Gandhi as the undisputed leader of the party and the country. The "new" Congress was now completely different from the old one, with its support base among the poor, women, Dalits, Adivasis, and minorities.
`
    },
    hi: {
      title: 'अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना',
      content: `### नेहरू से शास्त्री तक
- प्रधानमंत्री जवाहरलाल नेहरू का **मई 1964** में निधन हो गया। उनकी मृत्यु ने भारत के लोकतांत्रिक भविष्य के बारे में अटकलों को जन्म दिया, लेकिन सत्ता का हस्तांतरण सुचारू रूप से हुआ।
- **लाल बहादुर शास्त्री** अगले प्रधानमंत्री (1964-1966) बने। वे अपनी सादगी और सिद्धांतों के प्रति प्रतिबद्धता के लिए जाने जाते थे।
- **शास्त्री के कार्यकाल के दौरान चुनौतियाँ:**
- - **आर्थिक संकट:** भारत को भोजन की कमी और मानसून की विफलता का सामना करना पड़ा।
- - **पाकिस्तान के साथ युद्ध (1965):** युद्ध के दौरान शास्त्री के नेतृत्व की व्यापक रूप से प्रशंसा की गई। उन्होंने देश को एकजुट करने के लिए प्रसिद्ध नारा **'जय जवान, जय किसान'** दिया।
- युद्ध जनवरी 1966 में सोवियत संघ की मध्यस्थता में **ताशकंद समझौते** के साथ समाप्त हुआ। इसके तुरंत बाद ताशकंद में शास्त्री का निधन हो गया।

### शास्त्री से इंदिरा गांधी तक
- शास्त्री की मृत्यु के बाद, प्रधानमंत्री पद के लिए **मोरारजी देसाई** और **इंदिरा गांधी** के बीच तीव्र प्रतिस्पर्धा हुई।
- कांग्रेस के शक्तिशाली नेताओं का समूह, जिसे **'सिंडिकेट'** के नाम से जाना जाता है, ने इंदिरा गांधी का समर्थन किया, यह मानते हुए कि वह उनके मार्गदर्शन पर निर्भर रहेंगी।
- इंदिरा गांधी ने मोरारजी देसाई को हराया और प्रधानमंत्री बनीं।

### चौथा आम चुनाव, 1967
- **चुनाव का संदर्भ:** यह अवधि गंभीर आर्थिक समस्याओं, भोजन की कमी, बढ़ती कीमतों और व्यापक विरोध प्रदर्शनों से चिह्नित थी। विपक्षी दलों ने विरोध प्रदर्शन आयोजित किए और **'बंद'** का आह्वान किया।
- **गैर-कांग्रेसवाद:** यह शब्द समाजवादी नेता **राम मनोहर लोहिया** द्वारा गढ़ा गया था। उन्होंने तर्क दिया कि कांग्रेस का शासन अलोकतांत्रिक था और इसे बाहर निकालने के लिए सभी गैर-कांग्रेसी दलों को एकजुट होना चाहिए।
- **चुनाव परिणाम - एक 'राजनीतिक भूकंप':**
- - कांग्रेस केंद्र में सरकार बनाने में कामयाब रही, लेकिन अपनी अब तक की सबसे कम सीटों और वोट हिस्सेदारी के साथ।
- - कई वरिष्ठ कांग्रेसी नेता (के. कामराज और एस.के. पाटिल सहित) अपनी सीटें हार गए।
- - कांग्रेस ने **नौ राज्यों** में बहुमत खो दिया, और गैर-कांग्रेसी सरकारें बनीं। यह पहली बार था जब कांग्रेस को अपने प्रभुत्व के लिए इतनी महत्वपूर्ण चुनौती का सामना करना पड़ा।
- **गठबंधन:** 1967 के चुनावों ने गठबंधन के युग की शुरुआत को चिह्नित किया। चूंकि कई राज्यों में किसी एक पार्टी को बहुमत नहीं मिला, इसलिए विभिन्न गैर-कांग्रेसी दलों ने सरकारें बनाने के लिए **संयुक्त विधायक दल (SVD)** नामक संयुक्त विधायी दल बनाए।

### कांग्रेस में विभाजन
- **सिंडिकेट बनाम इंदिरा गांधी:** इंदिरा गांधी को अपनी ही पार्टी के भीतर 'सिंडिकेट' से एक चुनौती का सामना करना पड़ा। उन्होंने उनका समर्थन किया था लेकिन अब पाया कि वह अपनी स्वतंत्रता का दावा कर रही हैं।
- **राष्ट्रपति चुनाव, 1969:** राष्ट्रपति जाकिर हुसैन की मृत्यु के बाद राष्ट्रपति चुनाव के दौरान संघर्ष चरम पर पहुंच गया।
- - सिंडिकेट ने **एन. संजीव रेड्डी** को आधिकारिक कांग्रेस उम्मीदवार के रूप में नामित किया।
- - इंदिरा गांधी ने तत्कालीन उपराष्ट्रपति **वी.वी. गिरि** को एक स्वतंत्र उम्मीदवार के रूप में अपना नामांकन दाखिल करने के लिए प्रोत्साहित किया। उन्होंने **'अंतरात्मा की आवाज पर वोट'** का आह्वान किया, अप्रत्यक्ष रूप से कांग्रेस सांसदों और विधायकों से गिरि के लिए वोट करने के लिए कहा।
- - वी.वी. गिरि ने चुनाव जीता, जो सिंडिकेट के लिए एक बड़ा झटका था।
- कांग्रेस अध्यक्ष ने इंदिरा गांधी को पार्टी से निष्कासित कर दिया, लेकिन उन्होंने दावा किया कि उनका समूह ही असली कांग्रेस है।
- इससे **1969** में एक औपचारिक विभाजन हुआ। कांग्रेस पार्टी विभाजित हो गई:
- - **कांग्रेस (संगठन)** या कांग्रेस (ओ): सिंडिकेट के नेतृत्व में।
- - **कांग्रेस (रिक्विजिशनिस्ट)** या कांग्रेस (आर): इंदिरा गांधी के नेतृत्व में। यह नई कांग्रेस थी।

### 1971 का चुनाव और कांग्रेस की पुनर्स्थापना
- विभाजन के बाद इंदिरा गांधी की सरकार ने अपना बहुमत खो दिया, लेकिन डीएमके और सीपीआई जैसे कुछ अन्य दलों के समर्थन से सत्ता में बनी रही।
- **इंदिरा गांधी की रणनीति:** उन्होंने एक बहुत ही साहसिक और वामपंथी रणनीति अपनाई।
- - **प्रिवी पर्स का उन्मूलन:** उन्होंने पूर्व राजकुमारों को दिए जाने वाले एक विशेष भुगतान 'प्रिवी पर्स' को समाप्त करने का कदम उठाया, यह तर्क देते हुए कि यह समानता के सिद्धांत के खिलाफ था।
- - **गरीबी हटाओ:** यह 1971 के चुनाव के लिए उनका मुख्य नारा था। यह एक शक्तिशाली नारा था जो गरीबों और हाशिए पर पड़े लोगों से जुड़ा था।
- - इसके विपरीत, विपक्षी दलों ने **'इंदिरा हटाओ'** के सरल नारे के साथ एक **'ग्रैंड अलायंस'** बनाया।
- **चुनाव परिणाम:**
- - परिणाम इंदिरा गांधी की कांग्रेस (आर) के लिए एक शानदार जीत थी। कांग्रेस (आर) और सीपीआई गठबंधन ने लोकसभा में **375 सीटें** जीतीं।
- - ग्रैंड अलायंस एक बड़ी विफलता थी।
- यह चुनाव एक महत्वपूर्ण मोड़ था। इसने न केवल कांग्रेस के प्रभुत्व को बहाल किया, बल्कि इंदिरा गांधी को पार्टी और देश की निर्विवाद नेता के रूप में भी स्थापित किया। "नई" कांग्रेस अब पुरानी से पूरी तरह से अलग थी, जिसका समर्थन आधार गरीबों, महिलाओं, दलितों, आदिवासियों और अल्पसंख्यकों के बीच था।
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
