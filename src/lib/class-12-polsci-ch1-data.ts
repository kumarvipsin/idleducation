/**
 * Class 12 Political Science - Chapter 1: दो ध्रुवीयता का अंत (The End of Bipolarity)
 * Full study notes extracted directly from the syllabus curriculum and structured
 * for modern, accessible learning with topics, sub-topics, callouts, and board exam questions.
 */

export interface PolSciTopic {
  id: string;
  number: string;
  titleHi: string;
  titleEn: string;
  badge: string;
  accentColor: string; // Tailwind color token or hex
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  summaryHi?: string;
  summaryEn?: string;
  keyStats?: { labelHi: string; labelEn: string; value: string }[];
  bulletPointsHi?: string[];
  bulletPointsEn?: string[];
  subTopics?: {
    subtitleHi: string;
    subtitleEn: string;
    pointsHi: string[];
    pointsEn: string[];
  }[];
  calloutBox?: {
    type: 'concept' | 'warning' | 'exam-tip' | 'quote';
    titleHi: string;
    titleEn: string;
    contentHi: string;
    contentEn: string;
  };
}

export interface PolSciBoardQuestion {
  id: string;
  marks: string;
  typeHi: string;
  typeEn: string;
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
}

export interface PolSciChapterData {
  chapterNumber: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  classText: string;
  subjectText: string;
  overviewHi: string[];
  overviewEn: string[];
  topics: PolSciTopic[];
  quickRevisionPointsHi: string[];
  quickRevisionPointsEn: string[];
  boardQuestions: PolSciBoardQuestion[];
}

export const CLASS_12_POLSCI_CH1_DATA: PolSciChapterData = {
  chapterNumber: '01',
  titleHi: 'दो ध्रुवीयता का अंत',
  titleEn: 'The End of Bipolarity',
  subtitleHi: 'कक्षा 12वीं राजनीति विज्ञान (समकालीन विश्व राजनीति) — अध्याय 1 सम्पूर्ण हस्तलिखित व अध्ययन नोट्स',
  subtitleEn: 'Class 12th Political Science (Contemporary World Politics) — Chapter 1 Complete Study Notes',
  classText: 'कक्षा 12 (Class 12)',
  subjectText: 'राजनीति विज्ञान (Political Science)',

  overviewHi: [
    'द्वितीय विश्वयुद्ध (1939-1945) के बाद विश्व राजनीति में दो महाशक्तियों — संयुक्त राज्य अमेरिका (USA) और सोवियत संघ (USSR) का उदय हुआ। विश्व दो विरोधी खेमों में बंट गया, जिसे "दो ध्रुवीय विश्व" (Bipolar World) कहा गया।',
    'यह अध्याय सोवियत संघ की साम्यवादी प्रणाली, 1989 में बर्लिन की दीवार के पतन, 1991 में सोवियत संघ के ऐतिहासिक विघटन, शॉक थेरेपी की प्रक्रिया, एकध्रुवीय विश्व में अमेरिकी वर्चस्व, प्रथम व द्वितीय खाड़ी युद्ध, 9/11 की घटना, सोवियत-अफगान संकट तथा पश्चिम एशिया में अरब स्प्रिंग (Arab Spring) का सम्पूर्ण एवं गहन अध्ययन प्रस्तुत करता है।'
  ],
  overviewEn: [
    'After World War II (1939-1945), global politics witnessed the rise of two superpowers — the United States of America (USA) and the Union of Soviet Socialist Republics (USSR). The world was divided into two competing ideological blocs, known as the "Bipolar World".',
    'This chapter provides a comprehensive analysis of the Soviet socialist system, the fall of the Berlin Wall in 1989, the historic collapse of the USSR in 1991, the economic Shock Therapy, emerging US hegemony in a unipolar world, the First & Second Gulf Wars, 9/11 attacks, the Soviet-Afghan conflict, and the Arab Spring in West Asia.'
  ],

  topics: [
    {
      id: 'berlin-wall',
      number: '01',
      titleHi: 'बर्लिन की दीवार (The Berlin Wall)',
      titleEn: 'The Berlin Wall — Symbol of Cold War Division',
      badge: 'शीतयुद्ध का प्रतीक',
      accentColor: '#3B82F6',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      borderClass: 'border-blue-500',
      bgLightClass: 'bg-blue-50/40 dark:bg-blue-950/20',
      summaryHi: 'बर्लिन की दीवार पूंजीवादी और साम्यवादी विश्व के बीच विभाजन का सबसे बड़ा प्रतीक थी, जिसका गिरना शीतयुद्ध के अंत का उद्घोषक बना।',
      summaryEn: 'The Berlin Wall was the most prominent tangible symbol of division between the capitalist and communist worlds; its collapse marked the end of the Cold War.',
      keyStats: [
        { labelHi: 'निर्माण वर्ष', labelEn: 'Constructed', value: '1961' },
        { labelHi: 'कुल लम्बाई', labelEn: 'Total Length', value: '150 KM' },
        { labelHi: 'अस्तित्व अवधि', labelEn: 'Stood For', value: '28 वर्ष' },
        { labelHi: 'पतन की तिथि', labelEn: 'Demolished', value: '9 Nov 1989' },
      ],
      bulletPointsHi: [
        'बर्लिन की दीवार 1961 में बनाई गई थी।',
        'यह दीवार पश्चिमी बर्लिन को पूर्वी बर्लिन से अलग करती थी।',
        'यह दीवार पूंजीवादी विश्व (पश्चिमी खेमा) और साम्यवादी विश्व (पूर्वी खेमा) के विभाजन का प्रतीक थी।',
        'इस ऐतिहासिक दीवार की कुल लम्बाई 150 किलोमीटर थी।',
        'यह दीवार 28 वर्षों तक शीतयुद्ध के अग्रिम मोर्चे के रूप में खड़ी रही।',
        '9 नवम्बर 1989 को आम जनता द्वारा इस दीवार को तोड़ दिया गया, जिससे दोनों जर्मनी का एकीकरण संभव हुआ और सोवियत गुट का विघटन शुरू हुआ।'
      ],
      bulletPointsEn: [
        'The Berlin Wall was constructed in 1961.',
        'It separated West Berlin (capitalist) from East Berlin (communist).',
        'It symbolized the division between the capitalist bloc and the socialist/communist bloc.',
        'The total length of the wall was over 150 kilometers.',
        'The wall stood for 28 years dividing families and ideologies.',
        'On 9 November 1989, it was brought down by ordinary citizens, paving the way for German reunification and the collapse of the Soviet bloc.'
      ],
      calloutBox: {
        type: 'concept',
        titleHi: 'परीक्षा बिंदु : बर्लिन की दीवार का पतन',
        titleEn: 'Exam Takeaway: Fall of Berlin Wall',
        contentHi: '9 नवम्बर 1989 को बर्लिन की दीवार का टूटना शीतयुद्ध की समाप्ति तथा "दूसरी दुनिया" (समाजवादी खेमे) के अंत का ऐतिहासिक आरम्भ बिंदु माना जाता है।',
        contentEn: 'The demolition of the Berlin Wall on 9 November 1989 is officially marked as the historic opening chapter of the collapse of the Second World and the culmination of the Cold War.'
      }
    },

    {
      id: 'soviet-system-origin',
      number: '02',
      titleHi: 'सोवियत प्रणाली क्या थी? एवं सोवियत संघ का जन्म',
      titleEn: 'What was the Soviet System & Origin of USSR',
      badge: '1917 की बोल्शेविक क्रांति',
      accentColor: '#DC2626',
      badgeClass: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
      borderClass: 'border-red-500',
      bgLightClass: 'bg-red-50/40 dark:bg-red-950/20',
      summaryHi: 'सोवियत प्रणाली समाजवाद व समतामूलक समाज के आदर्शों पर आधारित थी, जिसका जन्म 1917 की रूसी बोल्शेविक क्रांति से हुआ।',
      summaryEn: 'The Soviet system was founded on the ideals of socialism and an egalitarian society, born from the Russian Bolshevik Revolution of 1917.',
      bulletPointsHi: [
        'सोवियत प्रणाली से अभिप्राय : समाजवाद एवं समतामूलक समाज के आदर्शों पर आधारित साम्यवादी शासन व्यवस्था से है।',
        '1917 में रूस में समाजवादी क्रांति (बोल्शेविक क्रांति) हुई थी।',
        'यह क्रांति पूंजीवादी व्यवस्था के विरोध में और निजी संपत्ति के खात्मे के पक्ष में हुई।',
        'यह क्रांति समाजवाद एवं समतामूलक समाज के आदर्शों पर आधारित थी।',
        'इस महान क्रांति के नायक व्लादिमीर लेनिन (Vladimir Lenin) थे।',
        'व्लादिमीर लेनिन कम्युनिस्ट पार्टी (बोल्शेविक दल) के संस्थापक थे।',
        'इस क्रांति के परिणामस्वरूप 15 गणराज्यों को मिलाकर "समाजवादी सोवियत गणराज्य" (USSR - Union of Soviet Socialist Republics) की स्थापना हुई।'
      ],
      bulletPointsEn: [
        'Definition of Soviet System: A socialist state order founded on equality, state ownership, and communist ideology.',
        'The Socialist Revolution (Bolshevik Revolution) took place in Russia in 1917.',
        'This revolution was fought in explicit opposition to capitalism and private ownership of production.',
        'It was anchored in the ideals of an egalitarian society and social justice.',
        'Vladimir Lenin was the supreme architect and leader of this revolution.',
        'Lenin was the founder of the Russian Communist Party (Bolshevik Party).',
        'As an outcome of this revolution, the Union of Soviet Socialist Republics (USSR) was established comprising 15 republics.'
      ],
      calloutBox: {
        type: 'concept',
        titleHi: 'महत्वपूर्ण शब्दावली : व्लादिमीर लेनिन (1870-1924)',
        titleEn: 'Key Personality: Vladimir Lenin (1870-1924)',
        contentHi: 'बोल्शेविक कम्युनिस्ट पार्टी के संस्थापक, 1917 की रूसी क्रांति के नेता और क्रांति के बाद सोवियत संघ के सबसे कठिन दौर में इसके प्रेरक व संस्थापक प्रमुख।',
        contentEn: 'Founder of the Bolshevik Party, leader of the 1917 Russian Revolution, and prime architect of the socialist Soviet state during its formative era.'
      }
    },

    {
      id: 'second-world',
      number: '03',
      titleHi: 'दूसरी दुनिया के देश (The Second World / Socialist Blocs)',
      titleEn: 'Second World Countries & The Socialist Bloc',
      badge: 'पूर्वी यूरोप एवं वारसा पैक्ट',
      accentColor: '#9333EA',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
      borderClass: 'border-purple-500',
      bgLightClass: 'bg-purple-50/40 dark:bg-purple-950/20',
      summaryHi: 'द्वितीय विश्वयुद्ध के बाद सोवियत संघ के समाजवादी मॉडल को अपनाने वाले पूर्वी यूरोप के देशों को "दूसरी दुनिया" कहा गया।',
      summaryEn: 'The East European countries that adopted the Soviet socialist system after World War II came to be known as the "Second World".',
      bulletPointsHi: [
        'द्वितीय विश्वयुद्ध (1945) के बाद पूर्वी यूरोप के देशों को सोवियत सेना ने फासीवादी ताकतों (नाजी जर्मनी) के चंगुल से मुक्त कराया।',
        'इन सभी देशों की राजनीतिक और सामाजिक व्यवस्था को सोवियत संघ की समाजवादी तर्ज पर ढाला गया।',
        'देशों के इस समूह को "दूसरी दुनिया के देश" अथवा "समाजवादी गुट / खेमे" (Socialist Blocs) के देश कहा जाता है।',
        'इस समाजवादी खेमे का निर्विवाद नेता समाजवादी सोवियत गणराज्य (USSR) था।',
        'इस गुट को सैन्य रूप से एकजुट रखने के लिए सोवियत संघ के नेतृत्व में 1955 में "वारसा पैक्ट" (Warsaw Pact) बनाया गया था।'
      ],
      bulletPointsEn: [
        'Following World War II, the East European countries liberated from Nazi control by the Soviet Red Army were brought under Soviet influence.',
        'The political, economic, and social structures of these countries were modeled precisely on the Soviet socialist pattern.',
        'This confederation of countries was historically termed "The Second World" or the "Socialist Bloc".',
        'The undisputed leader of this entire socialist alliance was the USSR.',
        'To counterbalance NATO, the military treaty known as the Warsaw Pact was signed in 1955 under Soviet leadership.'
      ]
    },

    {
      id: 'soviet-features',
      number: '04',
      titleHi: 'सोवियत प्रणाली की प्रमुख विशेषताएं (Features of the Soviet System)',
      titleEn: 'Key Features & Strengths of the Soviet System',
      badge: 'नियोजित अर्थव्यवस्था व जनकल्याण',
      accentColor: '#059669',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      borderClass: 'border-emerald-500',
      bgLightClass: 'bg-emerald-50/40 dark:bg-emerald-950/20',
      summaryHi: 'सोवियत प्रणाली एक सुदृढ़, नियोजित एवं राज्य-नियंत्रित अर्थव्यवस्था थी जिसने अपने नागरिकों को न्यूनतम जीवन स्तर, रोजगार और सामाजिक सुरक्षा दी।',
      summaryEn: 'The Soviet system was a state-directed, centrally planned economy that guaranteed citizens a minimum standard of living, employment, and comprehensive social safety nets.',
      bulletPointsHi: [
        'पूंजीवादी व्यवस्था का विरोध : सोवियत प्रणाली पूंजीवाद के पूरी तरह विरोध तथा समाजवाद के आदर्शों से प्रेरित थी।',
        'नियोजित अर्थव्यवस्था : संपूर्ण अर्थव्यवस्था राज्य द्वारा केंद्रीय स्तर पर नियोजित (Five Year Plans) और संचालित थी।',
        'कम्युनिस्ट पार्टी का एकाधिकार : सोवियत राजनीतिक व्यवस्था में केवल एक पार्टी (कम्युनिस्ट पार्टी) का पूर्ण दबदबा था; किसी अन्य दल या विपक्ष की अनुमति नहीं थी।',
        'विकसित अर्थव्यवस्था : अमेरिका को छोड़कर सोवियत संघ की अर्थव्यवस्था शेष विश्व की तुलना में कहीं अधिक उन्नत और आत्मनिर्भर थी।',
        'उन्नत संचार प्रणाली : सोवियत संघ के पास एक अत्यंत जटिल और उन्नत संचार व सूचना तंत्र था।',
        'विशाल ऊर्जा संसाधन : सोवियत संघ के पास खनिज तेल, प्राकृतिक गैस, लोहा, इस्पात और मशीनरी के अकूत ऊर्जा भंडार थे।',
        'सुगम परिवहन व्यवस्था : दूर-दराज के दुर्गम इलाके भी आवागमन और रेल/सड़क परिवहन की बेहतर व्यवस्था से मजबूती से जुड़े हुए थे।',
        'उन्नत उपभोक्ता उद्योग : घरेलू स्तर पर एक छोटी पिन/सुई से लेकर बड़ी-बड़ी कारों और हवाई जहाजों तक का निर्माण सोवियत कारखानों में होता था।',
        'न्यूनतम जीवन स्तर की गारंटी : सरकार सभी नागरिकों के लिए भोजन, वस्त्र, आवास, स्वास्थ्य, शिक्षा और बच्चों की देखभाल जैसी बुनियादी जरूरतें रियायती दरों पर सुनिश्चित करती थी।',
        'बेरोजगारी का न होना : सोवियत संघ में कोई व्यक्ति बेरोजगार नहीं था; काम का अधिकार एक संवैधानिक अधिकार था।',
        'मिल्कियत का स्वरूप : उत्पादन के सभी साधनों, भूमि, खानों और कारखानों पर केवल राज्य (सरकार) का एकाधिकार था, निजी संपत्ति का कोई अस्तित्व नहीं था।'
      ],
      bulletPointsEn: [
        'Rejection of Capitalism: Completely opposed private profit and free market capitalism, rooting itself in Marxist-Leninist socialism.',
        'Centrally Planned Economy: Economic planning was 100% state-controlled through comprehensive central five-year plans.',
        'Single-Party Monopoly: The Communist Party enjoyed total institutional dominance; no opposition parties were permitted.',
        'Advanced Economy: After the USA, the Soviet Union stood as the second-largest and most self-reliant economy globally.',
        'Sophisticated Communication Network: Highly evolved, interconnected communication network spanning vast geographical boundaries.',
        'Vast Energy Reserves: Immense reserves of mineral oil, natural gas, coal, iron, and heavy steel production.',
        'Comprehensive Transportation: Even the most remote corners of Siberia and Central Asia were integrated through state rail and road links.',
        'Vibrant Consumer Industry: Manufactured everything domestically from safety pins to luxury automobiles and aircraft.',
        'Guaranteed Minimum Standard of Living: Subsidized basic necessities including housing, public education, healthcare, and child welfare.',
        'Zero Unemployment: Full employment was legally and structurally guaranteed by the state apparatus.',
        'State Ownership: Complete abolition of private property; all land, resources, and factories belonged to the public collective under state stewardship.'
      ]
    },

    {
      id: 'causes-of-disintegration',
      number: '05',
      titleHi: 'सोवियत संघ के विघटन के कारण (Causes of Disintegration)',
      titleEn: 'Causes Behind the Collapse of the Soviet Union',
      badge: 'विघटन के प्रमुख कारण',
      accentColor: '#D97706',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      borderClass: 'border-amber-500',
      bgLightClass: 'bg-amber-50/40 dark:bg-amber-950/20',
      summaryHi: 'नौकरशाही का शिकंजा, हथियारों की होड़, आर्थिक गतिरोध, रूस का प्रभुत्व और राष्ट्रवादी भावनाओं का उभार सोवियत संघ के टूटने के मुख्य कारण बने।',
      summaryEn: 'Bureaucratic rigidity, military arms race overspending, economic stagnation, Russian chauvinism, and soaring nationalist aspirations triggered the Soviet collapse.',
      bulletPointsHi: [
        'नागरिकों की आकांक्षाओं की विफलता : सोवियत व्यवस्था अपने नागरिकों की बढ़ती राजनीतिक और आर्थिक आकांक्षाओं को पूरा करने में असमर्थ रही।',
        'नौकरशाही का कड़ा शिकंजा : सोवियत प्रणाली अत्यंत नौकरशाह और सत्तावादी हो गई, जिससे आम नागरिकों की व्यक्तिगत स्वतंत्रता और अभिव्यक्ति की आजादी छिन गई।',
        'कम्युनिस्ट पार्टी का निरंकुश नियंत्रण : 70 से अधिक वर्षों तक शासन करने वाली कम्युनिस्ट पार्टी जनता के प्रति बिल्कुल भी जवाबदेह नहीं रह गई थी।',
        'संसाधनों की सैन्य होड़ में बर्बादी : सोवियत संघ ने अपने अधिकांश बहुमूल्य आर्थिक संसाधनों को अमेरिका से मुकाबला करने के लिए परमाणु हथियारों और हथियारों की होड़ में झोंक दिया।',
        'प्रौद्योगिकी में पिछड़ना : पश्चिमी पूंजीवादी देशों की तुलना में सोवियत संघ आधुनिक तकनीक, कंप्यूटर, उपभोक्ता वस्तुओं और बुनियादी ढांचे में बहुत पीछे छूट गया।',
        'रूस का अत्यधिक दबदबा : सोवियत संघ 15 गणराज्यों से मिलकर बना था, लेकिन हर निर्णय में केवल रूस का दबदबा रहता था, जिससे बाकी गणराज्यों के लोगों में उपेक्षा व अलगाव की भावना बढ़ी।',
        'गोर्बाचेव के सुधारों की विफलता : मिखाइल गोर्बाचेव द्वारा शुरू की गई नीतियां — पेरेस्त्रोइका (पुनर्गठन) और ग्लासनोस्त (खुलापन) — जनता की अपेक्षाओं की गति से मेल नहीं खा सकीं और पार्टी के कट्टरपंथियों ने भी उनका विरोध किया।',
        'आर्थिक गतिरोध व वस्तुओं की कमी : 1970 के दशक के उत्तरार्ध से सोवियत अर्थव्यवस्था ठप पड़ गई थी और दैनिक उपभोक्ता वस्तुओं तथा भोजन की भारी किल्लत हो गई थी।',
        'राष्ट्रवादी भावनाओं और संप्रभुता का उभार : रूस, बाल्टिक गणराज्यों (एस्टोनिया, लातविया, लिथुआनिया), यूक्रेन और जॉर्जिया में संप्रभुता की तीव्र इच्छा और राष्ट्रवादी भावनाएं भड़क उठीं जो विघटन का तात्कालिक कारण बनीं।'
      ],
      bulletPointsEn: [
        'Unfulfilled Aspirations: The state failed to meet the rapidly expanding political liberties and economic demands of its citizenry.',
        'Bureaucratic Stifling: The system grew intensely bureaucratic and authoritarian, choking freedom of speech and democratic dissent.',
        'Unaccountable One-Party Rule: The Communist Party, ruling for over seven decades, enjoyed institutional privileges while remaining unaccountable to common citizens.',
        'Overbearing Military Burden: Disproportionate state funds were poured into maintaining parity with the US in nuclear arsenals and satellite states.',
        'Lagging Technology & Infrastructure: Fell significantly behind Western advancements in computing, logistics, transport, and consumer goods.',
        'Russian Dominance: Although technically a federation of 15 equal republics, Russia dominated political decisions, alienating non-Russian cultures.',
        'Backlash against Gorbachev’s Reforms: Policies of Perestroika (restructuring) and Glasnost (openness) alienated hardliners without satisfying reformers.',
        'Severe Economic Stagnation: From the late 1970s, agricultural productivity collapsed, resulting in food shortages and humiliating import dependencies.',
        'Surge in Nationalism: Rising ethnic pride and demands for national sovereignty swept through Russia, the Baltic States, Ukraine, and Georgia, precipitating the breakup.'
      ],
      calloutBox: {
        type: 'warning',
        titleHi: 'विघटन का तात्कालिक कारण : राष्ट्रवादी उभार',
        titleEn: 'Primary Immediate Trigger: Nationalist Surge',
        contentHi: 'रूस, यूक्रेन, बेलारूस और बाल्टिक देशों में राष्ट्रवादी भावनाओं और अपनी संप्रभुता कायम करने की इच्छा ने सोवियत संघ के ताबूत में आखिरी कील ठोकी।',
        contentEn: 'The explosion of national identity and sovereignty movements across Russia, Ukraine, Belarus, and the Baltics proved to be the decisive catalyst for dissolution.'
      }
    },

    {
      id: 'consequences-of-disintegration',
      number: '06',
      titleHi: 'सोवियत संघ के विघटन के परिणाम (Consequences of Disintegration)',
      titleEn: 'Geopolitical Consequences of Soviet Disintegration',
      badge: 'शीतयुद्ध की समाप्ति व नए देश',
      accentColor: '#4F46E5',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      borderClass: 'border-indigo-500',
      bgLightClass: 'bg-indigo-50/40 dark:bg-indigo-950/20',
      summaryHi: 'सोवियत संघ के पतन से शीतयुद्ध का अंत हुआ, विचारधाराओं की जंग खत्म हुई, 15 नए देशों का उदय हुआ और अमेरिका एकमात्र महाशक्ति बना।',
      summaryEn: 'The collapse terminated the Cold War, concluded ideological warfare, birthed 15 independent nations, and left the United States as the sole global superpower.',
      bulletPointsHi: [
        'शीतयुद्ध की समाप्ति : दशकों से चली आ रही अमेरिका और सोवियत संघ के बीच की भू-राजनीतिक प्रतिद्वंद्विता और शीतयुद्ध का हमेशा के लिए अंत हो गया।',
        'हथियारों की होड़ की समाप्ति : परमाणु और पारंपरिक हथियारों की खतरनाक होड़ समाप्त हुई तथा निरस्त्रीकरण के नए समझौते संभव हुए।',
        'विचारधाराओं की लड़ाई का अंत : समाजवाद बनाम पूंजीवाद की वैचारिक लड़ाई खत्म हो गई और उदारवादी पूंजीवादी लोकतंत्र को सर्वश्रेष्ठ व्यवस्था माना गया।',
        'एकध्रुवीय विश्व का उदय : सोवियत संघ के खात्मे के साथ ही विश्व में अमेरिका का निर्विवाद वर्चस्व (US Hegemony) स्थापित हुआ।',
        'सोवियत संघ का टूटना : 25 दिसंबर 1991 को सोवियत संघ का औपचारिक विघटन हुआ और वह 15 स्वतंत्र गणराज्यों में विभाजित हो गया।',
        'नए संप्रभु देशों का उदय : विश्व मानचित्र पर 15 नए स्वतंत्र देशों का उदय हुआ, जिनमें बाल्टिक देश (एस्टोनिया, लातविया, लिथुआनिया) नाटो और यूरोपीय संघ में शामिल हो गए।',
        'रूस बना सोवियत संघ का उत्तराधिकारी : रूस को अंतरराष्ट्रीय मंचों पर सोवियत संघ का कानूनी उत्तराधिकारी स्वीकार किया गया; उसे यूएनओ की सुरक्षा परिषद में स्थायी सीट और सोवियत संघ की परमाणु शक्ति विरासत में मिली।',
        'वैश्विक शक्ति संबंधों में बदलाव : अंतरराष्ट्रीय राजनीति में शक्ति संबंध पूरी तरह बदल गए और विश्व बैंक तथा आईएमएफ जैसी पश्चिमी संस्थाओं का प्रभाव अत्यधिक बढ़ गया।'
      ],
      bulletPointsEn: [
        'Termination of the Cold War: Concluded decades-long ideological and military confrontation between East and West.',
        'Halt to the Arms Race: Slowed massive nuclear stockpiling, enabling bilateral disarmament pacts.',
        'End of Ideological Contestation: The historic clash between socialist planning and capitalist democracy was decided in favor of liberal democracy.',
        'Dawn of a Unipolar World: Left the United States as the lone global superpower, establishing American unipolar hegemony.',
        'Dissolution of USSR: On 25 December 1991, the Soviet Union was formally dissolved into 15 sovereign republics.',
        'Emergence of New Nations: 15 independent states emerged; Baltic states swiftly integrated into the European Union and NATO.',
        'Russia as Successor State: Russia inherited the USSR’s permanent seat at the UN Security Council, diplomatic status, and nuclear arsenal.',
        'Realignment of Global Institutions: Western financial institutions like the World Bank and IMF emerged as dominant economic arbiters for developing nations.'
      ]
    },

    {
      id: 'shock-therapy',
      number: '07',
      titleHi: 'शॉक थेरेपी (Shock Therapy) — अर्थ, विशेषताएं एवं परिणाम',
      titleEn: 'Shock Therapy — Meaning, Features & Catastrophic Fallouts',
      badge: 'इतिहास की सबसे बड़ी गराज सेल',
      accentColor: '#EA580C',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
      borderClass: 'border-orange-500',
      bgLightClass: 'bg-orange-50/40 dark:bg-orange-950/20',
      summaryHi: 'शॉक थेरेपी साम्यवाद से पूंजीवाद की ओर संक्रमण का तीव्र मॉडल था जिसने रूसी अर्थव्यवस्था को बर्बाद कर "इतिहास की सबसे बड़ी गराज सेल" को जन्म दिया।',
      summaryEn: 'Shock Therapy was a rapid transition model from communism to free-market capitalism that wrecked the Russian economy and spawned the largest garage sale in history.',
      subTopics: [
        {
          subtitleHi: 'शॉक थेरेपी का अर्थ एवं स्वरूप',
          subtitleEn: 'Concept & Mechanism of Shock Therapy',
          pointsHi: [
            'शाब्दिक अर्थ : "आघात पहुँचाकर उपचार करना" (Treatment through shock)।',
            'साम्यवाद के पतन के बाद सोवियत संघ के पूर्व गणराज्यों को विश्व बैंक (World Bank) और अंतर्राष्ट्रीय मुद्रा कोष (IMF) द्वारा निर्देशित मॉडल अपनाना पड़ा।',
            'इस मॉडल के तहत समाजवादी व्यवस्था को पूरी तरह छोड़कर, सीधे पूंजीवादी मुक्त बाजार व्यवस्था को अपनाना था। इसे ही "शॉक थेरेपी" कहा जाता है।'
          ],
          pointsEn: [
            'Literal definition: "Healing by administering an electric shock".',
            'Post-communist republics were mandated to adopt an economic transformation model guided by the World Bank and IMF.',
            'It entailed an instantaneous leap from a state-controlled command economy to pure laissez-faire free-market capitalism without transition phases.'
          ]
        },
        {
          subtitleHi: 'शॉक थेरेपी की मुख्य विशेषताएं',
          subtitleEn: 'Core Features of Shock Therapy',
          pointsHi: [
            'मिल्कियत का प्रमुख रूप निजी स्वामित्व (Private Ownership) में बदलना।',
            'राज्य की संपदा और सरकारी उपक्रमों का त्वरित निजीकरण।',
            'सामूहिक फार्मों (Collective Farms) की जगह निजी फार्मों की स्थापना।',
            'मुक्त व्यापार (Free Trade) व्यवस्था और प्रत्यक्ष विदेशी निवेश (FDI) को पूर्ण अनुमति।',
            'मुद्राओं की आपसी परिवर्तनीयता (Currency Convertibility) लागू करना।',
            'पश्चिमी देशों की वित्तीय व्यवस्था और पूंजीवादी तंत्र से सीधा जुड़ाव।',
            'पूंजीवाद के अतिरिक्त किसी भी वैकल्पिक या मिश्रित अर्थव्यवस्था को अस्वीकार करना।'
          ],
          pointsEn: [
            'Primacy of Private Property: Systematic transfer of state assets to private hands.',
            'Privatization of State Enterprises: Rapid sell-off of public industries.',
            'Dismantling Collective Farming: Replacement of cooperative farms with private commercial plots.',
            'Adoption of Free Trade: Eliminating tariffs and inviting foreign direct investment.',
            'Currency Convertibility: Immediate free float and open exchange of currencies.',
            'Integration with Western Markets: Reorienting trade away from regional partners to Western capitals.',
            'Total Exclusion of Mixed Economic Alternatives: Zero tolerance for gradual democratic socialist reforms.'
          ]
        },
        {
          subtitleHi: 'शॉक थेरेपी के विनाशकारी परिणाम',
          subtitleEn: 'Catastrophic Results of Shock Therapy',
          pointsHi: [
            'अर्थव्यवस्था का विनाश : पूरे क्षेत्र की अर्थव्यवस्था पूरी तरह तहस-नहस हो गई और जनता पर अकल्पनीय आर्थिक संकट टूट पड़ा।',
            'औद्योगिक ढांचा चरमराया : रूस का दशकों पुराना मजबूत सरकारी औद्योगिक ढांचा ध्वस्त हो गया।',
            '90% उद्योगों की बिक्री : लगभग 90 प्रतिशत बड़े सरकारी उद्योगों को निजी हाथों और कंपनियों को कौड़ियों के भाव बेच दिया गया।',
            'इतिहास की सबसे बड़ी गराज सेल : रणनीतिक महत्व के उद्योगों को औने-पौने दामों (Undervalued) पर बेचे जाने के कारण इसे "इतिहास की सबसे बड़ी गराज सेल" कहा जाता है।',
            'रूबल मुद्रा का अवमूल्यन : रूसी मुद्रा "रूबल" के मूल्य में नाटकीय रूप से भारी गिरावट आई।',
            'बेलगाम महंगाई : मुद्रास्फीति इतनी तेजी से बढ़ी कि लोगों की जीवन भर की जमा पूंजी और बचत समाप्त हो गई।',
            'खाद्यान्न संकट : रूस को अपनी जनता का पेट भरने के लिए विदेशों से भारी मात्रा में अनाज आयात करना पड़ा।',
            'सरकारी रियायतों की समाप्ति : सरकार द्वारा दी जाने वाली सामाजिक सुरक्षा, सब्सिडी और कल्याणकारी सुविधाएं बंद कर दी गईं जिससे करोड़ों लोग गरीबी रेखा के नीचे चले गए।',
            'अमीर और गरीब का तीखा विभाजन : समाज में आर्थिक विषमता अत्यधिक बढ़ गई और माफिया वर्ग का अभूतपूर्व उभार हुआ।'
          ],
          pointsEn: [
            'Economic Collapse: Total devastation of productive industries throughout the post-Soviet sphere.',
            'Industrial Disintegration: Russia’s colossal industrial infrastructure broke down almost overnight.',
            'Fire Sale of 90% Industries: Around 90% of state-owned enterprises were liquidated to private individuals and corporate oligarchs.',
            'The Largest Garage Sale in History: Critical state monopolies were sold at laughable fractions of their true value, famously dubbed the largest garage sale in human history.',
            'Crashing of the Ruble: The value of the Russian Ruble depreciated precipitously.',
            'Hyperinflation: Soaring inflation wiped out life savings and pensions of ordinary Russian citizens.',
            'Food Security Crises: Russia was forced to import grain and food basics from abroad to avert famine.',
            'Abolition of Social Subsidies: State healthcare, housing, and food subsidies were eradicated, plunging millions into extreme poverty.',
            'Extreme Wealth Disparity & Mafia Rise: Generated vast inequality and paved the way for powerful oligarchs and criminal mafia syndicates.'
          ]
        }
      ],
      calloutBox: {
        type: 'quote',
        titleHi: 'इतिहास की सबसे बड़ी गराज सेल (The Largest Garage Sale in History)',
        titleEn: 'The Largest Garage Sale in History',
        contentHi: 'शॉक थेरेपी के दौरान रूस के 90% बहुमूल्य सरकारी उद्योगों को औने-पौने दामों पर बेच दिया गया। नागरिकों को दिए गए अधिकार-पत्रों (Vouchers) को माफियाओं ने सस्ते में खरीद लिया। इसी कारण इतिहासकारों ने इसे "विश्व इतिहास की सबसे बड़ी गराज सेल" नाम दिया।',
        contentEn: 'During Shock Therapy, over 90% of high-value Soviet state enterprises were auctioned off at rock-bottom prices. Citizen vouchers were usurped by black-market mafias, prompting historians to term it the largest garage sale in human history.'
      }
    },

    {
      id: 'us-hegemony',
      number: '08',
      titleHi: 'अमेरिकी वर्चस्व एवं एकध्रुवीय विश्व (US Hegemony / Unipolar World)',
      titleEn: 'US Hegemony and the Unipolar World Order',
      badge: 'एकध्रुवीय विश्व व्यवस्था',
      accentColor: '#0284C7',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
      borderClass: 'border-sky-500',
      bgLightClass: 'bg-sky-50/40 dark:bg-sky-950/20',
      summaryHi: '1991 में सोवियत संघ के पतन के बाद अंतरराष्ट्रीय पटल पर संयुक्त राज्य अमेरिका का निर्विवाद वर्चस्व स्थापित हुआ जिसे "एकध्रुवीय विश्व" कहा जाता है।',
      summaryEn: 'Following the 1991 Soviet dissolution, unmatched American economic, military, and cultural power produced a unipolar world.',
      bulletPointsHi: [
        '1991 में सोवियत संघ के विघटन के बाद विश्व में अमेरिका का वर्चस्व खुलकर सामने आया।',
        'एकध्रुवीय व्यवस्था की परिभाषा : जब अंतरराष्ट्रीय व्यवस्था पर एकमात्र महाशक्ति का प्रभुत्व और नियंत्रण होता है, तो उसे "एकध्रुवीय व्यवस्था" (Unipolar World) कहा जाता है।',
        'यद्यपि अमेरिकी वर्चस्व के पहलुओं का इतिहास वर्ष 1991 तक ही सीमित नहीं है, बल्कि इसके मूल 1945 के द्वितीय विश्वयुद्ध के अंत से ही देखे जा सकते हैं।',
        'सैन्य शक्ति (Hard Power), आर्थिक शक्ति (Structural Power) और सांस्कृतिक प्रभाव (Soft Power) तीनों क्षेत्रों में अमेरिका का कोई प्रतिस्पर्धी नहीं बचा।'
      ],
      bulletPointsEn: [
        'Following the 1991 Soviet breakup, overt American hegemony surfaced across global geopolitical arenas.',
        'Definition of Unipolarity: An international structure where a single superpower possesses supreme, unchallenged predominance.',
        'While formalized after 1991, the roots of American structural hegemony trace back to the aftermath of World War II in 1945.',
        'The US held uncontested supremacy across hard military power, structural global trade, and soft cultural persuasion.'
      ]
    },

    {
      id: 'first-gulf-war',
      number: '09',
      titleHi: 'प्रथम खाड़ी युद्ध (First Gulf War) — ऑपरेशन डेजर्ट स्टॉर्म',
      titleEn: 'First Gulf War — Operation Desert Storm (1990-1991)',
      badge: 'कंप्यूटर युद्ध / वीडियो गेम वॉर',
      accentColor: '#10B981',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      borderClass: 'border-teal-500',
      bgLightClass: 'bg-teal-50/40 dark:bg-teal-950/20',
      summaryHi: 'कुवैत पर इराकी कब्जे के खिलाफ 34 देशों की संयुक्त सेना ने "ऑपरेशन डेजर्ट स्टॉर्म" चलाया, जिसे स्मार्ट बमों के कारण "वीडियो गेम वॉर" कहा गया।',
      summaryEn: 'A coalition of 34 countries launched Operation Desert Storm to liberate Kuwait from Iraqi occupation, characterized by smart bombs as a video game war.',
      bulletPointsHi: [
        'कुवैत पर इराक का कब्जा : अगस्त 1990 में इराक ने पड़ोसी छोटे तेल-समृद्ध देश कुवैत पर आक्रमण कर कब्जा कर लिया।',
        'कूटनीतिक विफलता : इराक को अंतरराष्ट्रीय स्तर पर काफी समझाया गया परंतु वह कब्जा हटाने को तैयार नहीं हुआ।',
        'संयुक्त राष्ट्र संघ की अनुमति : संयुक्त राष्ट्र संघ (UNO) ने कुवैत को मुक्त कराने के लिए बल प्रयोग की अनुमति दी।',
        'ऐतिहासिक नाटकीय फैसला : शीतयुद्ध के पिछले 45 वर्षों में यूएनओ ने कभी इतना बड़ा सैन्य फैसला नहीं लिया था।',
        'नई विश्व व्यवस्था (New World Order) : तत्कालीन अमेरिकी राष्ट्रपति जॉर्ज एच.डब्ल्यू. बुश ने इसे "नयी विश्व व्यवस्था" की संज्ञा दी।',
        'सैन्य गठबंधन : इस युद्ध में 34 देशों के 6,60,000 सैनिकों ने भाग लिया।',
        'अमेरिकी नेतृत्व : अमेरिकी जनरल नॉर्मन श्वार्जकॉव (General Norman Schwarzkopf) इस विशाल संयुक्त सैन्य अभियान के प्रमुख थे।',
        'ऑपरेशन डेजर्ट स्टॉर्म (Operation Desert Storm) : इस ऐतिहासिक सैन्य अभियान को "ऑपरेशन डेजर्ट स्टॉर्म" कहा गया।',
        'स्मार्ट बमों का प्रयोग : इस युद्ध में पहली बार बड़े पैमाने पर कंप्यूटर निर्देशित "स्मार्ट बमों" (Smart Bombs) का प्रयोग हुआ, जिसे "कंप्यूटर युद्ध" भी कहा गया।',
        'लाइव प्रसारण : इस युद्ध का दुनिया भर के टेलीविजन पर 24 घंटे लाइव प्रसारण दिखाया गया, जिस कारण इसे "वीडियो गेम वॉर" भी कहा जाता है।',
        'सौ जंगों की एक जंग : इराकी राष्ट्रपति सद्दाम हुसैन ने दावा किया था कि यह युद्ध "सौ जंगों की एक जंग" साबित होगी, लेकिन इराकी सेना कुछ ही दिनों में बुरी तरह पराजित हो गई और कुवैत मुक्त हुआ।',
        'अमेरिका का वित्तीय मुनाफा : अमेरिका ने इस युद्ध में जितना धन खर्च किया था, उससे कहीं ज्यादा रकम उसे जर्मनी, जापान और सऊदी अरब जैसे मित्र देशों से मुआवजे के रूप में प्राप्त हुई।'
      ],
      bulletPointsEn: [
        'Iraqi Annexation of Kuwait: In August 1990, Iraq invaded and occupied neighboring oil-rich Kuwait.',
        'Diplomatic Failure: Multiple international diplomatic resolutions were rebuffed by Saddam Hussein.',
        'UN Authorization: The United Nations approved the use of force to liberate Kuwait.',
        'Historic UN Landmark: This dramatic decision was the first collective military enforcement by the UN in 45 years.',
        'New World Order: US President George H.W. Bush termed this moment the beginning of a "New World Order".',
        'Coalition Strength: 660,000 troops from 34 nations joined the US-led coalition.',
        'US Command: American General Norman Schwarzkopf commanded the multilateral coalition forces.',
        'Operation Desert Storm: The formal military campaign was designated Operation Desert Storm.',
        'Smart Bombs & Computer War: Extensive utilization of laser-guided smart bombs dubbed it a "Computer War".',
        'Video Game War: Broadcast live globally via satellite TV networks (CNN), earning the title "Video Game War".',
        'The Mother of All Battles: Iraqi President Saddam Hussein boasted it would be the "mother of all battles", yet Iraq faced swift defeat.',
        'Economic Profit: The US actually made net financial profits because subsidies from Germany, Japan, and Saudi Arabia surpassed campaign costs.'
      ]
    },

    {
      id: 'second-gulf-war',
      number: '10',
      titleHi: 'दूसरा खाड़ी युद्ध / इराक पर अमेरिकी हमला (Operation Iraqi Freedom)',
      titleEn: 'Second Gulf War — Operation Iraqi Freedom (2003)',
      badge: 'ऑपरेशन इराकी फ्रीडम',
      accentColor: '#DC2626',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
      borderClass: 'border-rose-500',
      bgLightClass: 'bg-rose-50/40 dark:bg-rose-950/20',
      summaryHi: '19 मार्च 2003 को अमेरिका ने यूएनओ की अनुमति के बिना इराक पर हमला किया, जिसके मुख्य उद्देश्य तेल भंडारों पर कब्जा और मनपसंद सरकार बनाना था।',
      summaryEn: 'On 19 March 2003, the US attacked Iraq without UN consent under the pretext of WMDs, aiming to control oil fields and install a puppet regime.',
      bulletPointsHi: [
        'अभियान की तिथि : 19 मार्च 2003 को अमेरिका ने इराक के खिलाफ "ऑपरेशन इराकी फ्रीडम" (Operation Iraqi Freedom) शुरू किया।',
        'संयुक्त राष्ट्र संघ की अनुमति नहीं : यूएनओ ने इराक पर हमले की अनुमति नहीं दी थी; इसके बावजूद अमेरिका ने अंतरराष्ट्रीय कानून की अनदेखी कर हमला किया।',
        'इच्छुकों का गठबंधन (Coalition of the Willing) : इस युद्ध में अमेरिका के साथ 40 से अधिक सहयोगी देश शामिल थे।',
        'अमेरिका का झूठा बहाना : अमेरिका ने आरोप लगाया कि इराक घातक जनसंहार के हथियार (WMD - Weapons of Mass Destruction) बना रहा है, जबकि जांच के बाद इराक में ऐसे कोई हथियार नहीं मिले।',
        'हमले के वास्तविक उद्देश्य : (1) इराक के विशाल तेल-भंडार और खनिज संसाधनों पर नियंत्रण पाना। (2) इराक में सद्दाम हुसैन को हटाकर अपनी मनपसंद अमेरिकी-समर्थक सरकार बनाना।',
        'अमेरिकी कमजोरी का उजागर होना : अमेरिका सैन्य रूप से युद्ध जीत गया और सद्दाम हुसैन की सरकार गिरा दी, लेकिन वह इराक में शांति, कानून व्यवस्था और स्थिर राजनीतिक व्यवस्था बनाने में पूरी तरह असफल रहा।',
        'इराकी जनता का व्यापक प्रतिरोध : इराकी जनता ने अमेरिकी सैनिकों के खिलाफ जबरदस्त छापामार विद्रोह किया जिसमें हजारों अमेरिकी सैनिक और लाखों इराकी नागरिक मारे गए।'
      ],
      bulletPointsEn: [
        'Launch of Operation: On 19 March 2003, the US launched "Operation Iraqi Freedom" against Iraq.',
        'Bypassing the UN: The attack was carried out without UN Security Council authorization.',
        'Coalition of the Willing: Over 40 nations participated in the US-led invading coalition.',
        'False Pretext of WMDs: The US claimed Iraq harbored Weapons of Mass Destruction, though UN inspectors found none.',
        'Real Imperial Objectives: (1) Gain direct control over Iraqi oil reserves; (2) Install a friendly puppet regime in Baghdad.',
        'Exposure of US Vulnerability: Although the US easily defeated Saddam Hussein militarily, it completely failed to pacify Iraq or govern the post-war state.',
        'Savage Insurgency: Violent guerrilla resistance erupted, killing thousands of coalition personnel and causing catastrophic Iraqi civilian casualties.'
      ]
    },

    {
      id: 'nine-eleven',
      number: '11',
      titleHi: '9/11 की आतंकवादी घटना (The 9/11 Terrorist Attacks)',
      titleEn: 'The 9/11 Attacks and Operation Enduring Freedom',
      badge: 'अमेरिका पर सबसे बड़ा हमला',
      accentColor: '#991B1B',
      badgeClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-700',
      borderClass: 'border-red-700',
      bgLightClass: 'bg-red-50/50 dark:bg-red-950/30',
      summaryHi: '11 सितम्बर 2001 को आतंकवादियों ने 4 अमेरिकी विमानों का अपहरण कर वर्ल्ड ट्रेड सेंटर और पेंटागन पर हमला किया जिसे "9/11" कहा जाता है।',
      summaryEn: 'On 11 September 2001, 19 hijackers seized 4 commercial planes striking the World Trade Center and Pentagon, termed 9/11.',
      bulletPointsHi: [
        'घटना की तिथि : 11 सितंबर 2001 को अरब देशों के 19 अलकायदा आतंकवादियों ने उड़ान भरने के बाद 4 अमेरिकी व्यावसायिक विमानों का अपहरण कर लिया।',
        'हमले की योजना : अपहरणकर्ता इन विमानों को अमेरिका की सर्वाधिक महत्वपूर्ण और रणनीतिक इमारतों की ओर ले गए।',
        'वर्ल्ड ट्रेड सेंटर पर हमला : पहले दो विमान न्यूयॉर्क स्थित 110 मंजिला "वर्ल्ड ट्रेड सेंटर" (WTC) के उत्तरी और दक्षिणी टावरों से टकराए, जिससे दोनों विशाल टावर ढह गए।',
        'पेंटागन पर हमला : तीसरा विमान वर्जीनिया के अर्लिंग्टन स्थित अमेरिकी रक्षा मंत्रालय के मुख्यालय "पेंटागन" (Pentagon) से टकराया।',
        'कैपिटल इमारत का लक्ष्य : चौथा विमान अमेरिकी संसद (US Congress) की मुख्य इमारत से टकराना था, परंतु यात्रियों के साहसिक प्रतिरोध के कारण वह पेंसिल्वेनिया के एक खेत में गिर गया।',
        'भारी जनहानि : इस आतंकवादी हमले में लगभग 3,000 निर्दोष लोग मारे गए।',
        'अमेरिकी प्रतिक्रिया (Operation Enduring Freedom) : इसके जवाब में अमेरिका ने आतंकवाद के खिलाफ वैश्विक युद्ध छेड़ते हुए अलकायदा और अफगानिस्तान के तालिबान शासन के विरुद्ध "ऑपरेशन एंड्योरिंग फ्रीडम" शुरू किया।'
      ],
      bulletPointsEn: [
        'Hijacking Event: On 11 September 2001, 19 Arab hijackers linked to Al-Qaeda hijacked four US commercial airliners.',
        'Targeted Strikes: Planes were weaponized to strike core military, commercial, and political landmarks of the United States.',
        'Twin Towers Collapsed: Two planes struck the North and South Towers of the World Trade Center in New York, completely destroying both towers.',
        'Strike on Pentagon: The third plane hit the Pentagon building, headquarters of the US Department of Defense in Arlington, Virginia.',
        'Crash in Pennsylvania: The fourth plane, aimed at the US Capitol building, crashed into a field in Shanksville, Pennsylvania after passengers revolted.',
        'Loss of 3,000 Lives: Nearly 3,000 citizens from over 80 nations perished in the deadliest terror strike on American soil.',
        'Global War on Terror: US responded by launching "Operation Enduring Freedom" to topple the Taliban regime in Afghanistan.'
      ]
    },

    {
      id: 'afghanistan-crisis',
      number: '12',
      titleHi: 'अफगानिस्तान संकट एवं सोवियत हस्तक्षेप (1979-1989)',
      titleEn: 'Afghanistan Crisis and Soviet Military Intervention (1979-1989)',
      badge: 'सोवियत संघ vs मुजाहिदीन',
      accentColor: '#B45309',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700',
      borderClass: 'border-amber-700',
      bgLightClass: 'bg-amber-50/50 dark:bg-amber-950/30',
      summaryHi: '1979 में सोवियत सेना ने अफगानिस्तान में हस्तक्षेप किया जिसका मुजाहिदीन व पश्चिमी देशों ने विरोध किया; 1989 में सोवियत सेना को लौटना पड़ा।',
      summaryEn: 'In 1979, Soviet forces entered Afghanistan sparking fierce resistance from Mujahideen backed by the US; Soviet troops withdrew in 1989.',
      subTopics: [
        {
          subtitleHi: 'अफगानिस्तान की जनसांख्यिकी व भौगोलिक स्थिति',
          subtitleEn: 'Demographics & Geography of Afghanistan',
          pointsHi: [
            'जनसंख्या वितरण : पश्तून (Pashtun) - 42%, ताजिक (Tajik) - 27%, हजारा (Hazara) - 8%, उज्बेक (Uzbek) - 9%।',
            'भौगोलिक स्थिति : अनुपजाऊ भूमि, विशाल हिन्दुकुश पर्वतमाला, शुष्क रेगिस्तानी इलाका तथा चारों तरफ से भूमि से घिरा (Landlocked) देश।'
          ],
          pointsEn: [
            'Ethnic breakdown: Pashtuns 42%, Tajiks 27%, Hazaras 8%, Uzbeks 9%.',
            'Geographic reality: Landlocked, barren terrain dominated by rugged Hindu Kush mountains and arid deserts.'
          ]
        },
        {
          subtitleHi: 'ऐतिहासिक पृष्ठभूमि एवं राजनीतिक बदलाव',
          subtitleEn: 'Historical Backdrop & Political Upheavals',
          pointsHi: [
            '1960 के दशक में राजा जाहिर शाह ने अफगानिस्तान में आधुनिक सुधार किए (महिलाओं की शिक्षा, चुनाव प्रक्रिया, राजनीतिक अधिकार)।',
            '1973 में जाहिर शाह के परिवार के दाऊद खान ने तख्तापलट कर सत्ता हासिल की।',
            '1978 में वामपंथी पार्टी "पीपल्स डेमोक्रेटिक पार्टी ऑफ अफगानिस्तान" (PDPA) ने दाऊद खान को हटाकर कम्युनिस्ट सरकार बनाई।'
          ],
          pointsEn: [
            '1960s Modernization: King Zahir Shah introduced progressive reforms including female schooling and constitutional elections.',
            '1973 Coup: Daoud Khan overthrew the monarchy to establish a republic.',
            '1978 Saur Revolution: The leftist People’s Democratic Party of Afghanistan (PDPA) seized power and instituted communist policies.'
          ]
        },
        {
          subtitleHi: 'सोवियत सैन्य हस्तक्षेप एवं वापसी (1979-1989)',
          subtitleEn: 'Soviet Intervention & Eventual Withdrawal',
          pointsHi: [
            '24 दिसंबर 1979 को सोवियत संघ ने अपनी विशाल सेना अफगानिस्तान में भेजी।',
            'वैश्विक विरोध : मुस्लिम देशों, अफगान जनता, संयुक्त राष्ट्र संघ (UNO) और अमेरिका ने सोवियत हस्तक्षेप का कड़ा विरोध किया।',
            'सोवियत संघ बनाम जनता : सभी विद्रोही गुट एकजुट हुए और इसे धार्मिक युद्ध (जिहाद) नाम दिया; सोवियत सेना से लड़ने वाले "मुजाहिदीन" कहलाए।',
            'विदेशी सहायता : मुजाहिदीन को अमेरिका, पाकिस्तान, चीन और सऊदी अरब ने आधुनिक हथियार (जैसे स्टिंगर मिसाइलें) और भारी धन दिया।',
            'गोर्बाचेव का फैसला व वापसी : 1985 में सोवियत महासचिव मिखाइल गोर्बाचेव ने इस सैन्य दलदल को "नासूर" मानते हुए सेना वापसी का निर्णय लिया और 1989 तक सोवियत सेना पूरी तरह वापस लौट गई।'
          ],
          pointsEn: [
            'Soviet Invasion: On 24 December 1979, the Soviet Union deployed troops to prop up the embattled communist regime.',
            'Global Condemnation: Condemned by the UN General Assembly, Islamic nations, and the Western alliance.',
            'Mujahideen Resistance: Local rebels declared a Holy War (Jihad) and organized as the Mujahideen.',
            'Foreign Proxy Funding: The CIA, Pakistan’s ISI, Saudi Arabia, and China supplied billions in funds and Stinger antiaircraft missiles.',
            'Soviet Withdrawal: Gorbachev termed the occupation a "bleeding wound" and pulled out all Soviet troops by February 1989.'
          ]
        }
      ]
    },

    {
      id: 'arab-spring',
      number: '13',
      titleHi: 'अरब क्रांति / अरब स्प्रिंग (Arab Spring)',
      titleEn: 'The Arab Spring — Democratic Movements in West Asia',
      badge: 'लोकतंत्रीकरण की लहर',
      accentColor: '#0D9488',
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
      borderClass: 'border-teal-500',
      bgLightClass: 'bg-teal-50/40 dark:bg-teal-950/20',
      summaryHi: '2009-10 में ट्यूनीशिया से शुरू हुई लोकतांत्रिक क्रांति मिस्र, लीबिया, यमन और सीरिया में फैल गई जिसे "अरब स्प्रिंग" कहा जाता है।',
      summaryEn: 'Initiated in Tunisia in 2010, the pro-democracy revolution rippled across Egypt, Libya, Yemen, and Syria, termed the Arab Spring.',
      bulletPointsHi: [
        'परिचय : 21वीं सदी में पश्चिम एशियाई और उत्तरी अफ्रीकी देशों में तानाशाही के विरुद्ध लोकतंत्र की स्थापना के लिए शुरू हुए जनांदोलनों को "अरब स्प्रिंग" (Arab Spring) कहा जाता है।',
        'आरंभ : इसका आरंभ 2009/2010 में ट्यूनीशिया (Tunisia) से हुआ, जहाँ जनता ने भ्रष्टाचार, बेरोजगारी और गरीबी के खिलाफ संघर्ष छेड़ा।',
        'राजनीतिक आंदोलन में बदलाव : जनता तत्कालीन सामाजिक-आर्थिक समस्याओं को निरंकुश तानाशाही का परिणाम मानती थी, इसलिए यह विरोध सीधे तख्तापलट के आंदोलन में बदल गया।',
        'मिस्र में ऐतिहासिक पतन : मिस्र में 1979 से सत्ता पर काबिज निरंकुश राष्ट्रपति होस्नी मुबारक (Hosni Mubarak) को भारी लोकतांत्रिक विरोध प्रदर्शनों के आगे झुकना पड़ा और इस्तीफा देना पड़ा।',
        'अन्य अरब देशों में प्रसार : अरब क्रांति का व्यापक असर यमन, बहरीन, लीबिया तथा सीरिया में भी देखा गया जहाँ लोकतंत्र की मांग ने पूरे क्षेत्र में राजनीतिक जागृति पैदा की।'
      ],
      bulletPointsEn: [
        'Genesis: Pro-democracy civilian uprisings that swept West Asia and North Africa starting in late 2010.',
        'Tunisian Spark: Triggered in Tunisia in December 2010 against systemic corruption, poverty, and youth unemployment.',
        'Transforming into Regime Change: Public discontent translated into demands for dismantling autocratic police states.',
        'Fall of Hosni Mubarak: In Egypt, President Hosni Mubarak—in power since 1979—was toppled after massive demonstrations in Tahrir Square.',
        'Regional Conflagration: Spread rapidly to Yemen, Bahrain, Libya, and Syria, forever altering the geopolitical landscape of the Arab world.'
      ],
      subTopics: [
        {
          subtitleHi: 'अरब स्प्रिंग के मुख्य उद्देश्य',
          subtitleEn: 'Objectives of Arab Spring',
          pointsHi: [
            'शासन व्यवस्था में व्यापक लोकतांत्रिक सुधार करना।',
            'तानाशाही को समाप्त कर वास्तविक जन-प्रतिनिधि सरकार की स्थापना।',
            'शिक्षा, रोजगार और आर्थिक विकास के समान अवसर प्रदान करना।',
            'सामाजिक समानता, नागरिक स्वतंत्रता और मानवाधिकारों की रक्षा।'
          ],
          pointsEn: [
            'Comprehensive democratic overhaul of repressive governance.',
            'Termination of lifetime dictatorships and establishment of free elections.',
            'Expansion of job opportunities, public education, and poverty eradication.',
            'Protection of basic civil liberties, press freedoms, and human rights.'
          ]
        },
        {
          subtitleHi: 'अरब स्प्रिंग के मुख्य कारण',
          subtitleEn: 'Root Causes of Arab Spring',
          pointsHi: [
            'भीषण गरीबी और आम लोगों के जीवन स्तर में गिरावट।',
            'युवाओं में बड़े पैमाने पर बेरोजगारी की समस्या।',
            'शासक वर्ग और नौकरशाही में फैला चरम भ्रष्टाचार।',
            'सोशल मीडिया (Facebook, Twitter) का क्रांतिकारी प्रभाव, जिसने सूचनाओं को तेजी से प्रसारित किया।',
            'दशकों से चले आ रहे सत्तावादी व निरंकुश शासन के खिलाफ जनता का आक्रोश।'
          ],
          pointsEn: [
            'Entrenched poverty and spiraling cost of living.',
            'Unprecedented youth unemployment and lack of economic mobility.',
            'Widespread kleptocracy and nepotism among ruling elites.',
            'Catalytic role of social media platforms in mobilizing and broadcasting protests.',
            'Accumulated frustration against police state brutality and denial of dignity.'
          ]
        }
      ]
    }
  ],

  quickRevisionPointsHi: [
    'बर्लिन की दीवार (1961 में निर्मित, 150 किमी लम्बी, 28 वर्ष अस्तित्व) का 9 नवम्बर 1989 को गिरना शीतयुद्ध के अंत का प्रतीक बना।',
    'सोवियत प्रणाली 1917 की बोल्शेविक क्रांति (नायक: व्लादिमीर लेनिन) से जन्मी, जो समतामूलक समाज और राज्य स्वामित्व पर आधारित थी।',
    'पूर्वी यूरोप के समाजवादी देशों के समूह को "दूसरी दुनिया" (Socialist Bloc) कहा गया जिसका सैन्य संगठन वारसा पैक्ट (1955) था।',
    'सोवियत प्रणाली की प्रमुख ताकतें: नियोजित अर्थव्यवस्था, उन्नत संचार, विशाल ऊर्जा भंडार, सुई से कार तक घरेलू निर्माण, शून्य बेरोजगारी व न्यूनतम जीवन स्तर की गारंटी।',
    'विघटन के प्रमुख कारण: नौकरशाही का शिकंजा, हथियारों की होड़ में आर्थिक बर्बादी, तकनीकी पिछड़ापन, रूस का प्रभुत्व, गोर्बाचेव के सुधारों का विरोध और राष्ट्रवादी उभार।',
    '25 दिसंबर 1991 को सोवियत संघ का 15 देशों में विघटन हुआ; रूस को यूएन सुरक्षा परिषद में स्थायी सीट और कानूनी उत्तराधिकार मिला।',
    'शॉक थेरेपी (आघात पहुँचाकर उपचार करना) विश्व बैंक व आईएमएफ का मॉडल था जिसने 90% उद्योगों को कौड़ियों के दाम बेचकर "इतिहास की सबसे बड़ी गराज सेल" रची और रूबल को गिराया।',
    '1991 के बाद "एकध्रुवीय विश्व" में अमेरिकी वर्चस्व स्थापित हुआ।',
    'प्रथम खाड़ी युद्ध (1990-91): कुवैत को इराक से छुड़ाने हेतु 34 देशों के 6.6 लाख सैनिकों का अभियान "ऑपरेशन डेजर्ट स्टॉर्म", जिसे स्मार्ट बमों के कारण "वीडियो गेम वॉर" कहा गया।',
    'द्वितीय खाड़ी युद्ध (19 मार्च 2003): अमेरिका ने बिना यूएन अनुमति के "ऑपरेशन इराकी फ्रीडम" चलाया जिसका गुप्त उद्देश्य इराक के तेल भंडारों पर कब्जा करना था।',
    '9/11 हमला (11 सितम्बर 2001): 19 अलकायदा आतंकियों द्वारा 4 विमानों का अपहरण, वर्ल्ड ट्रेड सेंटर व पेंटागन पर हमला, 3000 मौतें; जवाब में "ऑपरेशन एंड्योरिंग फ्रीडम"।',
    'सोवियत-अफगान युद्ध (1979-1989): सोवियत संघ ने 24 दिसम्बर 1979 को सेना भेजी; मुजाहिदीन के कड़े प्रतिरोध के बाद 1989 में गोर्बाचेव ने सेना वापस बुलाई।',
    'अरब स्प्रिंग (2009-10): ट्यूनीशिया से शुरू होकर मिस्र (होस्नी मुबारक का पतन), लीबिया, यमन तक फैली लोकतंत्र की क्रांति, जिसके मुख्य कारण गरीबी, बेरोजगारी व सोशल मीडिया थे।'
  ],
  quickRevisionPointsEn: [
    'Berlin Wall (built 1961, 150 km long, stood 28 years) fell on 9 Nov 1989, inaugurating the end of the Cold War.',
    'Soviet system emerged from the 1917 Bolshevik Revolution led by Vladimir Lenin, predicated on socialist equality and public ownership.',
    'Second World comprised East European socialist republics aligned under the Warsaw Pact (1955).',
    'Key Soviet strengths: state planning, massive natural energy resources, consumer manufacturing from pin to car, zero unemployment, universal welfare.',
    'Downfall causes: bureaucratic opacity, catastrophic arms race spending, technical stagnation, Russian chauvinism, and nationalist sovereignty surges.',
    'On 25 Dec 1991, USSR broke into 15 republics; Russia inherited its UN Security Council seat and nuclear mantle.',
    'Shock Therapy was the IMF/World Bank shock-privatization package that collapsed the Ruble and generated "the largest garage sale in history".',
    'Soviet collapse inaugurated an era of Unipolarity dominated by American structural hegemony.',
    'First Gulf War (1990-91): Operation Desert Storm by 34 nations to liberate Kuwait, broadcast live globally as the "Video Game War".',
    'Second Gulf War (2003): Operation Iraqi Freedom launched without UN mandate to seize oil reserves and oust Saddam Hussein.',
    '9/11 Attacks: 19 hijackers struck the World Trade Center and Pentagon; triggered the global War on Terror and Operation Enduring Freedom.',
    'Soviet-Afghan War (1979-1989): Soviet forces invaded on 24 Dec 1979; faced Mujahideen resistance armed by the US, withdrawing in 1989.',
    'Arab Spring (2010): Pro-democracy revolutions sparked in Tunisia, toppling Hosni Mubarak in Egypt, driven by poverty, unemployment, and social media.'
  ],

  boardQuestions: [
    {
      id: 'q1',
      marks: '1 Mark',
      typeHi: 'अति लघु उत्तरीय प्रश्न',
      typeEn: 'Very Short Answer Question',
      questionHi: 'बर्लिन की दीवार कब बनाई गई थी और इसे कब तोड़ा गया?',
      questionEn: 'When was the Berlin Wall constructed and when was it demolished?',
      answerHi: 'बर्लिन की दीवार 1961 में बनाई गई थी और 9 नवम्बर 1989 को आम जनता द्वारा इसे तोड़ दिया गया।',
      answerEn: 'The Berlin Wall was constructed in 1961 and demolished by ordinary citizens on 9 November 1989.'
    },
    {
      id: 'q2',
      marks: '1 Mark',
      typeHi: 'अति लघु उत्तरीय प्रश्न',
      typeEn: 'Very Short Answer Question',
      questionHi: 'सोवियत संघ में 1917 की क्रांति किसके नेतृत्व में हुई थी?',
      questionEn: 'Under whose leadership did the 1917 Russian Revolution take place?',
      answerHi: 'सोवियत संघ में 1917 की समाजवादी (बोल्शेविक) क्रांति व्लादिमीर लेनिन (Vladimir Lenin) के नेतृत्व में हुई थी।',
      answerEn: 'The 1917 Socialist Bolshevik Revolution took place under the leadership of Vladimir Lenin.'
    },
    {
      id: 'q3',
      marks: '2 Marks',
      typeHi: 'लघु उत्तरीय प्रश्न',
      typeEn: 'Short Answer Question',
      questionHi: '"शॉक थेरेपी" से क्या अभिप्राय है?',
      questionEn: 'What is meant by "Shock Therapy"?',
      answerHi: 'शॉक थेरेपी का शाब्दिक अर्थ है — "आघात पहुँचाकर उपचार करना"। साम्यवाद के पतन के बाद सोवियत संघ के गणराज्यों द्वारा विश्व बैंक और आईएमएफ के निर्देशन में समाजवादी अर्थव्यवस्था से पूंजीवादी मुक्त बाजार व्यवस्था में तेजी से बदलाव के मॉडल को शॉक थेरेपी कहा जाता है।',
      answerEn: 'Shock Therapy literally means "healing through trauma". It refers to the rapid, painful transition model guided by the World Bank and IMF to shift post-Soviet socialist economies directly into private free-market capitalism.'
    },
    {
      id: 'q4',
      marks: '2 Marks',
      typeHi: 'लघु उत्तरीय प्रश्न',
      typeEn: 'Short Answer Question',
      questionHi: 'इतिहास की "सबसे बड़ी गराज सेल" किसे और क्यों कहा जाता है?',
      questionEn: 'What is referred to as "the largest garage sale in history" and why?',
      answerHi: 'शॉक थेरेपी के दौरान रूस के लगभग 90% बहुमूल्य सरकारी उद्योगों को औने-पौने दामों (काफी कम कीमत) पर निजी हाथों और कंपनियों को बेच दिया गया। इसलिए इसे इतिहास की सबसे बड़ी गराज सेल कहा जाता है।',
      answerEn: 'During Shock Therapy, around 90% of massive state-owned industrial conglomerates in Russia were privatized and auctioned off at rock-bottom prices, earning it the moniker "the largest garage sale in history".'
    },
    {
      id: 'q5',
      marks: '4 Marks',
      typeHi: 'दीर्घ उत्तरीय प्रश्न',
      typeEn: 'Long Answer Question',
      questionHi: 'सोवियत प्रणाली की कोई चार प्रमुख विशेषताएं लिखिए।',
      questionEn: 'State any four salient features of the Soviet System.',
      answerHi: 'सोवियत प्रणाली की चार प्रमुख विशेषताएं निम्नलिखित थीं:\n1. नियोजित अर्थव्यवस्था : अर्थव्यवस्था का संपूर्ण नियंत्रण व नियोजन राज्य के हाथों में था।\n2. एकदलीय शासन : कम्युनिस्ट पार्टी का पूर्ण एकाधिकार था और विपक्ष की अनुमति नहीं थी।\n3. न्यूनतम जीवन स्तर की गारंटी : सरकार प्रत्येक नागरिक को भोजन, वस्त्र, आवास, स्वास्थ्य व शिक्षा रियायती दरों पर सुनिश्चित करती थी।\n4. बेरोजगारी का अभाव : प्रत्येक नागरिक को काम का संवैधानिक अधिकार प्राप्त था और बेरोजगारी शून्य थी।',
      answerEn: 'Four key features of the Soviet system were:\n1. Centrally Planned Economy: State controlled all production and distribution.\n2. Single-Party Monopoly: The Communist Party exercised complete political power without opposition.\n3. Guaranteed Minimum Living Standards: Subsidized housing, food, schooling, and healthcare for all citizens.\n4. Universal Employment: Employment was legally guaranteed, resulting in zero unemployment.'
    },
    {
      id: 'q6',
      marks: '4 Marks',
      typeHi: 'दीर्घ उत्तरीय प्रश्न',
      typeEn: 'Long Answer Question',
      questionHi: 'सोवियत संघ के विघटन के कोई चार प्रमुख कारण स्पष्ट कीजिए।',
      questionEn: 'Explain any four key causes of the disintegration of the Soviet Union.',
      answerHi: 'सोवियत संघ के विघटन के चार प्रमुख कारण निम्नलिखित थे:\n1. नौकरशाही का शिकंजा : व्यवस्था सत्तावादी हो गई और जनता की लोकतांत्रिक स्वतंत्रताएं समाप्त हो गईं।\n2. हथियारों की होड़ में संसाधनों की बर्बादी : आर्थिक संसाधनों का बड़ा हिस्सा परमाणु हथियारों और सेना पर खर्च किया गया।\n3. रूस का अत्यधिक दबदबा : 15 गणराज्यों में रूस की प्रमुखता से बाकी गणराज्यों में भारी असंतोष पैदा हुआ।\n4. राष्ट्रवादी भावनाओं का उभार : रूस, यूक्रेन, जॉर्जिया और बाल्टिक देशों में संप्रभुता की तीव्र इच्छा ने विघटन को अपरिहार्य बना दिया।',
      answerEn: 'Four prominent causes of the Soviet collapse were:\n1. Bureaucratic Stifling: System turned autocratic, depriving people of civil liberties.\n2. Excessive Military Spending: Huge resources were diverted to maintain nuclear parity with the US.\n3. Russian Chauvinism: Over-centralization in Moscow alienated the other 14 constituent republics.\n4. Nationalist Surge: Intense nationalist desires for sovereignty across Russia, Ukraine, and the Baltics hastened the dissolution.'
    },
    {
      id: 'q7',
      marks: '6 Marks',
      typeHi: 'निबंधात्मक प्रश्न',
      typeEn: 'Essay Type Question',
      questionHi: 'प्रथम खाड़ी युद्ध के कारणों एवं इसके प्रमुख परिणामों का वर्णन कीजिए। इसे "वीडियो गेम वॉर" क्यों कहा गया?',
      questionEn: 'Describe the causes and major consequences of the First Gulf War. Why was it called a "Video Game War"?',
      answerHi: 'कारण :\nअगस्त 1990 में इराक द्वारा कुवैत पर अवैध कब्जा कर लेना और यूएनओ की चेतावनियों की अनदेखी करना।\n\nप्रमुख परिणाम :\n1. यूएनओ के अनुमोदन पर 34 देशों के 6,60,000 सैनिकों ने "ऑपरेशन डेजर्ट स्टॉर्म" चलाकर इराक को पराजित किया और कुवैत को मुक्त कराया।\n2. अमेरिकी राष्ट्रपति जॉर्ज बुश ने इसे "नई विश्व व्यवस्था" की संज्ञा दी।\n3. अमेरिका की निर्विवाद तकनीकी व सैन्य सर्वोच्चता विश्व के सामने सिद्ध हुई।\n\nइसे वीडियो गेम वॉर क्यों कहा गया? :\nइस युद्ध में पहली बार बड़े पैमाने पर कंप्यूटर-गाइडेड "स्मार्ट बमों" का उपयोग हुआ और दुनिया भर के समाचार चैनलों (जैसे CNN) पर 24 घंटे इसका सीधा लाइव प्रसारण किया गया, जिससे यह टीवी स्क्रीन पर किसी वीडियो गेम जैसा प्रतीत होता था।',
      answerEn: 'Causes:\nIraq’s aggressive invasion and annexation of Kuwait in August 1990 and refusal to withdraw despite UN resolutions.\n\nConsequences:\n1. A 34-nation coalition launched Operation Desert Storm, liberating Kuwait and crushing Iraqi forces.\n2. US President George Bush declared the arrival of a "New World Order".\n3. It conclusively proved overwhelming US military and technological supremacy.\n\nWhy called a Video Game War?:\nIt was the first conflict dominated by computer laser-guided "smart bombs", with extensive 24-hour live television satellite coverage, making battlefield strikes look like arcade video game graphics.'
    },
    {
      id: 'q8',
      marks: '6 Marks',
      typeHi: 'निबंधात्मक प्रश्न',
      typeEn: 'Essay Type Question',
      questionHi: 'अरब स्प्रिंग (Arab Spring) से क्या तात्पर्य है? इसके प्रमुख कारण और उद्देश्यों का परीक्षण कीजिए।',
      questionEn: 'What is meant by the Arab Spring? Examine its key causes and objectives.',
      answerHi: 'तात्पर्य :\n21वीं शताब्दी (2010) में पश्चिम एशिया व उत्तरी अफ्रीका के अरब देशों में तानाशाही शासन के विरुद्ध जनता द्वारा लोकतंत्र की स्थापना के लिए शुरू किए गए जन-आंदोलनों को "अरब स्प्रिंग" कहा जाता है। इसकी शुरुआत ट्यूनीशिया से हुई और यह मिस्र, लीबिया, यमन व सीरिया में फैल गई।\n\nप्रमुख कारण :\n1. भीषण गरीबी और युवाओं में बढ़ती बेरोजगारी।\n2. दशकों से चली आ रही निरंकुश व दमनकारी तानाशाही शासन व्यवस्था।\n3. शासन में फैला चरम भ्रष्टाचार।\n4. सोशल मीडिया (Facebook, Twitter) द्वारा जनक्रांति का त्वरित प्रसार।\n\nप्रमुख उद्देश्य :\n1. तानाशाही का खात्मा और वास्तविक लोकतंत्र की स्थापना।\n2. शासन व्यवस्था में जवाबदेही और पारदर्शिता लाना।\n3. शिक्षा, रोजगार और समान आर्थिक अवसरों का सृजन।\n4. नागरिकों के मौलिक अधिकारों और मानवाधिकारों की रक्षा।',
      answerEn: 'Meaning:\nThe Arab Spring refers to the wave of pro-democracy popular rebellions that began in late 2010 across the Arab world against authoritarian regimes. Originating in Tunisia, it quickly engulfed Egypt, Libya, Yemen, and Syria.\n\nKey Causes:\n1. Chronic poverty and spiraling youth unemployment.\n2. Decades of police brutality and repressive autocratic dictatorships.\n3. Deep-rooted corruption and nepotism.\n4. Rapid social mobilization facilitated by modern social media platforms.\n\nKey Objectives:\n1. Ousting dictators and establishing genuine constitutional democracies.\n2. Transparent, accountable, and citizen-centric governance.\n3. Creating jobs, improving public healthcare, and delivering economic dignity.\n4. Upholding civil liberties and fundamental human rights.'
    }
  ]
};
