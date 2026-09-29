/**
 * Class 9 Study Notes Data
 * Comprehensive notes for all Class 9 subjects (Science, Maths, English, Social Science)
 * Structured with high-quality bilingual (Hindi + English) content, topics, subtopics,
 * stats, key takeaways, and exam questions matching the Class 12 Chapter 1 minimal style.
 */

export interface ChapterTopic {
  id: string;
  number: string;
  titleHi: string;
  titleEn: string;
  badge: string;
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
    type?: 'concept' | 'warning' | 'exam-tip' | 'quote';
    titleHi: string;
    titleEn: string;
    contentHi: string;
    contentEn?: string;
  };
}

export interface ChapterExamQuestion {
  id: string;
  marks: string;
  typeHi: string;
  typeEn: string;
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
}

export interface UniversalChapterNotesData {
  chapterNumber: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  classText: string;
  subjectText: string;
  overviewHi: string[];
  overviewEn: string[];
  topics: ChapterTopic[];
  quickRevisionPointsHi: string[];
  quickRevisionPointsEn: string[];
  boardQuestions: ChapterExamQuestion[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLASS 9 SCIENCE - CHAPTER 01: MATTER IN OUR SURROUNDINGS (हमारे आस-पास के पदार्थ)
// ─────────────────────────────────────────────────────────────────────────────
export const CLASS_9_SCIENCE_CH1_DATA: UniversalChapterNotesData = {
  chapterNumber: '01',
  titleHi: 'हमारे आस-पास के पदार्थ',
  titleEn: 'Matter in Our Surroundings',
  subtitleHi: 'कक्षा 9वीं विज्ञान — अध्याय 1 सम्पूर्ण हस्तलिखित व अध्ययन नोट्स (NCERT पाठ्यक्रम)',
  subtitleEn: 'Class 9th Science — Chapter 1 Complete Notes, Concepts & Revision Guide',
  classText: 'कक्षा 9 (Class 9)',
  subjectText: 'विज्ञान (Science)',

  overviewHi: [
    'हमारे चारों ओर अनगिनत वस्तुएं मौजूद हैं जिनका आकार, रंग, रूप और बनावट अलग-अलग होती है। वैज्ञानिकों के अनुसार, ब्रह्मांड की प्रत्येक वस्तु जिस सामग्री से बनी है, उसे "पदार्थ" (Matter) कहा जाता है।',
    'पदार्थ वह वस्तु है जो कुछ स्थान (आयतन) घेरती है और जिसमें द्रव्यमान (भार) होता है। प्राचीन भारतीय दार्शनिकों ने पदार्थ को पंचतत्व (वायु, पृथ्वी, अग्नि, जल और आकाश) में वर्गीकृत किया था। आधुनिक विज्ञान में पदार्थ को उसके भौतिक और रासायनिक गुणों के आधार पर वर्गीकृत किया जाता है।'
  ],
  overviewEn: [
    'Everything in this universe that has mass and occupies volume (space) is called matter. From the air we breathe, the water we drink, to stones, clouds, stars, plants, and animals — everything is composed of matter.',
    'Ancient Indian philosophers classified matter into five basic elements ("Panch Tatva": Air, Earth, Fire, Sky, and Water). In modern science, matter is classified broadly on the basis of its physical properties and chemical nature.'
  ],

  topics: [
    {
      id: 'matter-nature-particles',
      number: '01',
      titleHi: 'पदार्थ का भौतिक स्वरूप एवं कणों के अभिलक्षण',
      titleEn: 'Physical Nature & Characteristics of Particles of Matter',
      badge: 'मूल अवधारणा',
      summaryHi: 'पदार्थ अत्यंत सूक्ष्म कणों से मिलकर बना होता है जो निरंतर गतिशील रहते हैं।',
      summaryEn: 'Matter is made up of minute particles that have spaces between them and move continuously.',
      keyStats: [
        { labelHi: 'एसआई मात्रक (द्रव्यमान)', labelEn: 'SI Unit (Mass)', value: 'kg' },
        { labelHi: 'एसआई मात्रक (आयतन)', labelEn: 'SI Unit (Volume)', value: 'm³' },
        { labelHi: 'कणों की गति', labelEn: 'Particle Motion', value: 'सतत गतिशील' },
        { labelHi: 'ताप का प्रभाव', labelEn: 'Temp Effect', value: 'गतिज ऊर्जा ↑' }
      ],
      bulletPointsHi: [
        'पदार्थ कणों से मिलकर बना होता है: पदार्थ निरंतर (continuous) न होकर बालू या नमक की भांति छोटे-छोटे कणों से बना है।',
        'पदार्थ के कण अत्यंत छोटे होते हैं: इतने छोटे कि हम साधारण आंखों या सामान्य माइक्रोस्कोप से इनकी कल्पना भी नहीं कर सकते।',
        'पदार्थ के कणों के बीच रिक्त स्थान (Intermolecular Space) होता है: जब हम पानी में चीनी या नमक घोलते हैं, तो वह पानी के कणों के बीच रिक्त स्थानों में समा जाते हैं।',
        'पदार्थ के कण निरंतर गतिशील होते हैं: कणों में गतिज ऊर्जा (Kinetic Energy) होती है। तापमान बढ़ाने से कणों की गतिज ऊर्जा और गति तेज हो जाती है।',
        'विसरण (Diffusion): दो विभिन्न पदार्थों के कणों का स्वतः मिलना विसरण कहलाता है। तापमान बढ़ने पर विसरण की दर बढ़ जाती है।'
      ],
      bulletPointsEn: [
        'Matter is particulate: Matter is not continuous like a block of wood, but made up of tiny particles like grains of sand.',
        'Particles are exceedingly small: Beyond our imagination and microscopic visibility.',
        'Intermolecular Space exists: When sugar or salt is dissolved in water, the particles get accommodated between the water molecules.',
        'Continuous kinetic motion: Particles possess kinetic energy. Increasing temperature increases particle speed and kinetic energy.',
        'Diffusion: The spontaneous intermixing of particles of two different types of matter. Rate of diffusion increases with temperature.'
      ],
      calloutBox: {
        type: 'concept',
        titleHi: 'महत्वपूर्ण वैज्ञानिक तथ्य: विसरण (Diffusion)',
        titleEn: 'Key Concept: Diffusion',
        contentHi: 'गर्म खाने की खुशबू कई मीटर दूर तक पहुंच जाती है, जबकि ठंडे खाने की महक लेने के लिए हमें पास जाना पड़ता है। ऐसा इसलिए होता है क्योंकि उच्च तापमान पर विसरण की दर अत्यधिक तीव्र हो जाती है।'
      }
    },
    {
      id: 'three-states-of-matter',
      number: '02',
      titleHi: 'पदार्थ की तीन प्रमुख अवस्थाएं: ठोस, द्रव एवं गैस',
      titleEn: 'Three States of Matter: Solid, Liquid & Gas',
      badge: 'अवस्था तुलना',
      summaryHi: 'कणों के बीच आकर्षण बल और रिक्त स्थान के आधार पर पदार्थ तीन मुख्य भौतिक अवस्थाओं में पाया जाता है।',
      summaryEn: 'Based on intermolecular attraction and spacing, matter exists as Solid, Liquid, or Gas.',
      keyStats: [
        { labelHi: 'ठोस का आकार', labelEn: 'Solid Shape', value: 'निश्चित (Definite)' },
        { labelHi: 'द्रव का आयतन', labelEn: 'Liquid Volume', value: 'निश्चित (Definite)' },
        { labelHi: 'गैस की संपीड़्यता', labelEn: 'Gas Compressibility', value: 'अत्यधिक (High)' },
        { labelHi: 'सीएनजी/एलपीजी', labelEn: 'CNG / LPG', value: 'संपीड़ित गैसें' }
      ],
      subTopics: [
        {
          subtitleHi: '1. ठोस अवस्था (Solid State)',
          subtitleEn: '1. Solid State',
          pointsHi: [
            'ठोस का निश्चित आकार, स्पष्ट सीमाएं तथा स्थिर आयतन होता है।',
            'ठोसों में संपीड़्यता (Compressibility) नगण्य होती है।',
            'बाह्य बल लगाने पर ठोस अपना आकार बनाए रखते हैं, अर्थात ये दृढ़ (Rigid) होते हैं।',
            'कणों के बीच आकर्षण बल अधिकतम और रिक्त स्थान न्यूनतम होता है।'
          ],
          pointsEn: [
            'Solids have definite shape, distinct boundaries, and fixed volumes.',
            'Negligible compressibility.',
            'Solids maintain their shape under external force; they are rigid.',
            'Maximum intermolecular force of attraction and minimum interparticle space.'
          ]
        },
        {
          subtitleHi: '2. द्रव अवस्था (Liquid State)',
          subtitleEn: '2. Liquid State',
          pointsHi: [
            'द्रव का कोई निश्चित आकार नहीं होता, जिस बर्तन में रखे जाते हैं उसी का आकार ले लेते हैं।',
            'द्रव का आयतन निश्चित होता है।',
            'इनमें बहाव होता है और इनका आकार बदलता है, इसलिए ये दृढ़ नहीं बल्कि तरल (Fluid) होते हैं।',
            'ठोस, द्रव और गैस तीनों का विसरण द्रवों में संभव है।'
          ],
          pointsEn: [
            'Liquids have no fixed shape; they take the shape of the container.',
            'Liquids have a fixed volume.',
            'They flow and change shape; hence they are fluids, not rigid.',
            'Solids, liquids, and gases can all diffuse into liquids.'
          ]
        },
        {
          subtitleHi: '3. गैसीय अवस्था (Gaseous State)',
          subtitleEn: '3. Gaseous State',
          pointsHi: [
            'गैसों का न तो कोई निश्चित आकार होता है और न ही निश्चित आयतन।',
            'गैसों में संपीड़्यता ठोस और द्रव की तुलना में काफी अधिक होती है (उदा: LPG सिलेंडर, ऑक्सीजन सिलेंडर, CNG)।',
            'गैस के कण अत्यधिक तीव्र गति और अनियमित दिशा में गति करते हैं।',
            'बर्तन की दीवारों पर गैस के कणों द्वारा प्रति इकाई क्षेत्रफल पर लगने वाले बल के कारण गैस का दबाव बनता है।'
          ],
          pointsEn: [
            'Gases have neither fixed shape nor fixed volume.',
            'High compressibility compared to solids and liquids (e.g., LPG, Oxygen cylinders, CNG).',
            'Particles move randomly at high speeds.',
            'Gas pressure is caused by the force exerted by gas particles per unit area on the container walls.'
          ]
        }
      ]
    },
    {
      id: 'effect-temperature-change',
      number: '03',
      titleHi: 'तापमान परिवर्तन का प्रभाव एवं अवस्था रूपांतरण',
      titleEn: 'Effect of Change of Temperature & Latent Heat',
      badge: 'ताप गतिकी',
      summaryHi: 'तापमान बढ़ाकर या घटाकर पदार्थ की एक भौतिक अवस्था को दूसरी अवस्था में बदला जा सकता है।',
      summaryEn: 'By heating or cooling, matter can be transformed from one physical state to another.',
      bulletPointsHi: [
        'गलनांक (Melting Point): जिस तापमान पर कोई ठोस पिघलकर द्रव बन जाता है, वह उसका गलनांक कहलाता है। बर्फ का गलनांक 273.15 K (0°C) होता है।',
        'क्वथनांक (Boiling Point): वायुमंडलीय दाब पर वह तापमान जिस पर कोई द्रव उबलने लगता है, उसका क्वथनांक कहलाता है। जल का क्वथनांक 373 K (100°C) होता है।',
        'प्रसुप्त ऊष्मा / गुप्त ऊष्मा (Latent Heat): अवस्था परिवर्तन के समय जो ऊष्मा तापमान में कोई वृद्धि दिखाए बिना अवशोषित होती है, उसे गुप्त ऊष्मा कहते हैं।',
        'संगलन की प्रसुप्त ऊष्मा: 1 किग्रा ठोस को उसके गलनांक पर द्रव में बदलने हेतु आवश्यक ऊष्मीय ऊर्जा।',
        'वाष्पीकरण की प्रसुप्त ऊष्मा: 1 किग्रा द्रव को उसके क्वथनांक पर वाष्प में बदलने हेतु आवश्यक ऊष्मीय ऊर्जा।'
      ],
      bulletPointsEn: [
        'Melting Point: The minimum temperature at which a solid melts into liquid at atmospheric pressure. Ice melts at 273.15 K (0°C).',
        'Boiling Point: The temperature at which a liquid starts boiling at atmospheric pressure. Water boils at 373 K (100°C).',
        'Latent Heat: The hidden heat absorbed during state change without showing any rise in temperature.',
        'Latent Heat of Fusion: Heat required to convert 1 kg of solid into liquid at its melting point.',
        'Latent Heat of Vaporisation: Heat required to convert 1 kg of liquid into gas at its boiling point.'
      ],
      calloutBox: {
        type: 'exam-tip',
        titleHi: 'परीक्षा टिप: केल्विन एवं सेल्सियस रूपांतरण',
        titleEn: 'Exam Formula: Kelvin & Celsius Conversion',
        contentHi: 'तापमान (K) = तापमान (°C) + 273.15। उदाहरण: 25°C = 25 + 273 = 298 K। 100°C = 100 + 273 = 373 K।'
      }
    },
    {
      id: 'evaporation-cooling',
      number: '04',
      titleHi: 'वाष्पीकरण एवं दैनिक जीवन में इसके शीतलन प्रभाव',
      titleEn: 'Evaporation & Evaporative Cooling in Daily Life',
      badge: 'दैनिक अनुप्रयोग',
      summaryHi: 'क्वथनांक से कम तापमान पर द्रव का वाष्प में बदलना वाष्पीकरण कहलाता है, जिससे शीतलता उत्पन्न होती है।',
      summaryEn: 'Evaporation causes cooling and occurs at temperatures below the boiling point.',
      bulletPointsHi: [
        'वाष्पीकरण को प्रभावित करने वाले 4 कारक: (1) सतह का क्षेत्रफल बढ़ने पर वाष्पीकरण बढ़ता है, (2) तापमान बढ़ने पर बढ़ता है, (3) आर्द्रता (Humidity) घटने पर बढ़ता है, (4) वायु की गति बढ़ने पर बढ़ता है।',
        'वाष्पीकरण के कारण शीतलता: वाष्पीकरण के दौरान कम हुई ऊर्जा को पुनः प्राप्त करने के लिए द्रव के कण आसपास से ऊर्जा अवशोषित करते हैं, जिससे शीतलता होती है।',
        'गर्मियों में घड़े (मटके) का पानी ठंडा क्यों रहता है? घड़े की मिट्टी में असंख्य सूक्ष्म छिद्र होते हैं जिनसे जल रिसकर वाष्पीकृत होता है और अंदर का पानी ठंडा रहता है।',
        'गर्मियों में सूती कपड़े पहनने की सलाह: सूती कपड़े पसीने का अच्छा अवशोषक होते हैं, पसीना वाष्पीकृत होकर शरीर को ठंडक प्रदान करता है।'
      ],
      bulletPointsEn: [
        '4 Factors affecting evaporation: (1) Surface area increase, (2) Temperature rise, (3) Decrease in humidity, (4) Increase in wind speed.',
        'Why evaporation causes cooling: Escaping particles absorb heat energy from surroundings, lowering surrounding temperature.',
        'Why earthen pot water stays cool: Microscopic pores allow continuous surface evaporation, taking away latent heat.',
        'Cotton clothes in summer: Cotton absorbs sweat, exposing it to air for quick evaporation and natural cooling.'
      ]
    }
  ],

  quickRevisionPointsHi: [
    'पदार्थ कणों से मिलकर बना है, जो अत्यंत सूक्ष्म, निरंतर गतिशील तथा परस्पर आकर्षित होते हैं।',
    'ठोस का निश्चित आकार व आयतन होता है; द्रव का निश्चित आयतन पर अनिश्चित आकार होता है; गैस का न निश्चित आकार होता है न आयतन।',
    'गैसों की संपीड़्यता अत्यधिक उच्च होती है, जिसे LPG और CNG में उपयोग किया जाता है।',
    'तापमान का एसआई मात्रक केल्विन (K) है: K = °C + 273.15।',
    'उर्ध्वपातन (Sublimation): ठोस अवस्था से सीधे गैस बनने की प्रक्रिया (उदा: कपूर, अमोनियम क्लोराइड)।',
    'निक्षेपण (Deposition): गैस से सीधे ठोस बनने की प्रक्रिया।',
    'वाष्पीकरण सतह पर होने वाली प्रक्रिया है, जबकि क्वथन एक समष्टि (bulk) परिघटना है।'
  ],
  quickRevisionPointsEn: [
    'Matter is composed of particles that are minuscule, constantly moving, and attract each other.',
    'Solids have fixed shape and volume; liquids have fixed volume but no fixed shape; gases have neither.',
    'High compressibility of gases enables storage in cylinders as LPG and CNG.',
    'SI unit of temperature is Kelvin (K): K = °C + 273.15.',
    'Sublimation is direct change from solid to gas without entering liquid state (e.g. Camphor).',
    'Deposition is direct change from gas to solid without liquid state.',
    'Evaporation is a surface phenomenon, whereas boiling is a bulk phenomenon.'
  ],

  boardQuestions: [
    {
      id: 'q1',
      marks: '2 Marks',
      typeHi: 'लघु उत्तरीय प्रश्न',
      typeEn: 'Short Answer Question',
      questionHi: 'गर्मियों में घड़े का जल ठंडा क्यों होता है?',
      questionEn: 'Why does water kept in an earthen pot become cool during summer?',
      answerHi: 'मिट्टी के घड़े में बहुत छोटे-छोटे छिद्र होते हैं। इन छिद्रों से जल निरंतर बाहर रिसता रहता है और घड़े की सतह पर आ जाता है। यह जल वाष्पीकरण के लिए आवश्यक गुप्त ऊष्मा घड़े और अंदर के जल से अवशोषित करता है। इस ऊष्मा के निकल जाने से घड़े के अंदर का जल ठंडा हो जाता है।',
      answerEn: 'An earthen pot (matka) has minute pores. Water continually seeps out through these pores to the outer surface and evaporates. The heat required for evaporation is taken from the pot and remaining water, causing the water to cool down.'
    },
    {
      id: 'q2',
      marks: '3 Marks',
      typeHi: 'दीर्घ उत्तरीय प्रश्न',
      typeEn: 'Concept Differentiation',
      questionHi: 'वाष्पीकरण एवं क्वथन (Boiling) में तीन मुख्य अंतर स्पष्ट कीजिए।',
      questionEn: 'State three main differences between Evaporation and Boiling.',
      answerHi: '1. वाष्पीकरण क्वथनांक से कम किसी भी तापमान पर होता है, जबकि क्वथन केवल एक निश्चित तापमान (क्वथनांक) पर होता है।\n2. वाष्पीकरण केवल सतह पर होने वाली (surface) प्रक्रिया है, जबकि क्वथन पूरे द्रव (bulk) में होता है।\n3. वाष्पीकरण से शीतलता उत्पन्न होती है, जबकि क्वथन से शीतलन प्रभाव नहीं होता।',
      answerEn: '1. Evaporation occurs at any temperature below boiling point, whereas boiling occurs only at a fixed boiling point.\n2. Evaporation is a surface phenomenon; boiling is a bulk phenomenon.\n3. Evaporation causes cooling; boiling does not cause cooling.'
    },
    {
      id: 'q3',
      marks: '3 Marks',
      typeHi: 'वैज्ञानिक कारण',
      typeEn: 'Scientific Reasoning',
      questionHi: 'उबलते हुए जल अथवा भाप में से जलने की तीव्रता किसमें अधिक महसूस होती है और क्यों?',
      questionEn: 'Which causes more severe burns: boiling water or steam at 100°C? Give reasons.',
      answerHi: '373 K (100°C) पर भाप के कणों में उसी तापमान पर जल के कणों की अपेक्षा अधिक ऊर्जा होती है। ऐसा इसलिए है क्योंकि भाप के कणों ने वाष्पीकरण की गुप्त ऊष्मा (Latent Heat of Vaporisation) के रूप में अतिरिक्त ऊष्मा अवशोषित कर रखी है। अतः भाप से जलने पर अधिक तीव्र जलन महसूस होती है।',
      answerEn: 'Steam at 373 K (100°C) produces more severe burns than boiling water because steam particles possess extra energy in the form of latent heat of vaporisation, transferring greater heat energy upon contact.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CLASS 9 MATHS - CHAPTER 01: NUMBER SYSTEMS (संख्या पद्धति)
// ─────────────────────────────────────────────────────────────────────────────
export const CLASS_9_MATHS_CH1_DATA: UniversalChapterNotesData = {
  chapterNumber: '01',
  titleHi: 'संख्या पद्धति',
  titleEn: 'Number Systems',
  subtitleHi: 'कक्षा 9वीं गणित — अध्याय 1 सम्पूर्ण हस्तलिखित व अध्ययन नोट्स (NCERT पाठ्यक्रम)',
  subtitleEn: 'Class 9th Mathematics — Chapter 1 Complete Notes, Formulas & Solutions',
  classText: 'कक्षा 9 (Class 9)',
  subjectText: 'गणित (Mathematics)',

  overviewHi: [
    'संख्या पद्धति गणित की आधारशिला है। पिछली कक्षाओं में हमने संख्या रेखा पर विभिन्न प्रकार की संख्याओं जैसे प्राकृत संख्याएं, पूर्ण संख्याएं तथा पूर्णांकों का अध्ययन किया है।',
    'इस अध्याय में हम परिमेय संख्याओं के गुण, अपरिमेय संख्याओं की खोज, वास्तविक संख्याओं के दशमलव प्रसार, संख्या रेखा पर वास्तविक संख्याओं का निरूपण, हर का परिमेयकरण तथा वास्तविक संख्याओं के लिए घातांक नियमों का विस्तृत अध्ययन करेंगे।'
  ],
  overviewEn: [
    'Number systems form the bedrock of mathematics. In earlier classes, we explored natural numbers, whole numbers, and integers on the number line.',
    'In this chapter, we extend our knowledge to irrational numbers, decimal expansions of real numbers, representing real numbers on the number line, rationalising the denominator, and laws of exponents for real numbers.'
  ],

  topics: [
    {
      id: 'real-numbers-classification',
      number: '01',
      titleHi: 'वास्तविक संख्याओं का वर्गीकरण: प्राकृत से परिमेय संख्याएं तक',
      titleEn: 'Classification of Real Numbers: Natural to Rational Numbers',
      badge: 'संख्या वर्गीकरण',
      summaryHi: 'सभी परिमेय और अपरिमेय संख्याओं का संग्रह वास्तविक संख्याएं (Real Numbers) कहलाता है।',
      summaryEn: 'The collection of all rational and irrational numbers forms the set of Real Numbers (R).',
      keyStats: [
        { labelHi: 'प्राकृत संख्याएं (N)', labelEn: 'Natural (N)', value: '1, 2, 3, ...' },
        { labelHi: 'पूर्ण संख्याएं (W)', labelEn: 'Whole (W)', value: '0, 1, 2, ...' },
        { labelHi: 'पूर्णांक (Z)', labelEn: 'Integers (Z)', value: '..., -1, 0, 1, ...' },
        { labelHi: 'परिमेय (Q)', labelEn: 'Rational (Q)', value: 'p/q (q ≠ 0)' }
      ],
      bulletPointsHi: [
        'प्राकृत संख्याएं (Natural Numbers, N): गिनती की संख्याएं: 1, 2, 3, 4, ...',
        'पूर्ण संख्याएं (Whole Numbers, W): शून्य सहित प्राकृत संख्याएं: 0, 1, 2, 3, ...',
        'पूर्णांक (Integers, Z): सभी धनात्मक, ऋणात्मक और शून्य: ..., -3, -2, -1, 0, 1, 2, 3, ...',
        'परिमेय संख्याएं (Rational Numbers, Q): ऐसी संख्याएं जिन्हें p/q के रूप में लिखा जा सकता है, जहाँ p और q पूर्णांक हैं तथा q ≠ 0।',
        'प्रत्येक पूर्णांक एक परिमेय संख्या है क्योंकि किसी भी पूर्णांक m को m/1 के रूप में लिखा जा सकता है।'
      ],
      bulletPointsEn: [
        'Natural Numbers (N): Counting numbers starting from 1, 2, 3, ...',
        'Whole Numbers (W): Counting numbers along with zero: 0, 1, 2, 3, ...',
        'Integers (Z): All positive and negative numbers including zero: ..., -2, -1, 0, 1, 2, ...',
        'Rational Numbers (Q): Any number expressible in the form p/q, where p and q are integers and q ≠ 0.',
        'Every integer m is a rational number expressible as m/1.'
      ]
    },
    {
      id: 'irrational-numbers-geometry',
      number: '02',
      titleHi: 'अपरिमेय संख्याएं एवं संख्या रेखा पर निरूपण',
      titleEn: 'Irrational Numbers & Representation on the Number Line',
      badge: 'ज्यामितीय निरूपण',
      summaryHi: 'वह संख्या जिसे p/q के रूप में व्यक्त न किया जा सके, अपरिमेय संख्या कहलाती है (जैसे √2, √3, π)।',
      summaryEn: 'Numbers that cannot be written in p/q form are irrational (e.g. √2, √3, √5, π).',
      keyStats: [
        { labelHi: '√2 का मान', labelEn: 'Value of √2', value: '1.414213...' },
        { labelHi: '√3 का मान', labelEn: 'Value of √3', value: '1.732050...' },
        { labelHi: 'पाई (π)', labelEn: 'Pi (π)', value: 'अपरिमेय संख्या' },
        { labelHi: 'पाइथागोरस प्रमेय', labelEn: 'Pythagoras', value: 'H² = B² + P²' }
      ],
      bulletPointsHi: [
        'पाइथागोरस के अनुयायियों (ग्रीस, लगभग 400 ई.पू.) ने सर्वप्रथम ऐसी संख्याओं की खोज की जो परिमेय नहीं थीं (जैसे √2)।',
        'संख्या रेखा पर √2 का स्थान निर्धारण: समकोण त्रिभुज OAB में आधार OA = 1 इकाई और लम्ब AB = 1 इकाई लेकर पाइथागोरस प्रमेय से कर्ण OB = √(1² + 1²) = √2 इकाई प्राप्त होता है। परकार से OB त्रिज्या का चाप संख्या रेखा पर काटकर √2 को निरूपित किया जाता है।',
        'संख्या रेखा का प्रत्येक बिंदु एक अद्वितीय वास्तविक संख्या को निरूपित करता है, इसलिए संख्या रेखा को "वास्तविक संख्या रेखा" भी कहा जाता है।'
      ],
      bulletPointsEn: [
        'Pythagoreans around 400 BC first discovered numbers that were not rational, such as √2.',
        'Locating √2 on number line: Construct right triangle with base = 1 and perpendicular = 1; hypotenuse = √(1 + 1) = √2. Swing an arc using compass.',
        'Every point on the number line represents a unique real number.'
      ]
    },
    {
      id: 'decimal-expansions',
      number: '03',
      titleHi: 'दशमलव प्रसार: सांत, अनवसानी आवर्ती एवं अनावर्ती',
      titleEn: 'Decimal Expansions: Terminating, Repeating & Non-Repeating',
      badge: 'दशमलव स्वरूप',
      summaryHi: 'परिमेय संख्याओं का दशमलव प्रसार या तो सांत होता है या अनवसानी आवर्ती। अपरिमेय संख्याओं का अनावर्ती होता है।',
      summaryEn: 'Rationals have terminating or recurring decimal expansions; Irrationals have non-terminating non-recurring expansions.',
      bulletPointsHi: [
        'सांत दशमलव (Terminating Decimals): जब शेषफल शून्य हो जाता है (उदा: 1/2 = 0.5, 7/8 = 0.875)।',
        'अनवसानी आवर्ती (Non-terminating Recurring): जब शेषफल कभी शून्य नहीं होता बल्कि अंकों की पुनरावृत्ति होती है (उदा: 1/3 = 0.333... = 0.3̄, 1/7 = 0.142857̄)। यह भी परिमेय संख्या है।',
        'अनवसानी अनावर्ती (Non-terminating Non-recurring): जब दशमलव प्रसार न तो समाप्त होता है और न ही आवर्ती होता है (उदा: 0.1010010001..., √2, π)। यह अपरिमेय संख्या की पहचान है।'
      ],
      bulletPointsEn: [
        'Terminating: Remainder becomes zero (e.g., 1/2 = 0.5, 7/8 = 0.875).',
        'Non-terminating Recurring: Remainder never becomes zero, repeating digits in cycles (e.g., 1/3 = 0.3̄). These are rational numbers.',
        'Non-terminating Non-recurring: Digits neither terminate nor repeat periodically. This characterizes irrational numbers.'
      ],
      calloutBox: {
        type: 'concept',
        titleHi: 'रूपांतरण नियम: 0.p̄ को p/q रूप में बदलना',
        titleEn: 'Conversion Method: 0.p̄ into p/q form',
        contentHi: 'यदि x = 0.333... है, तो 10x = 3.333... होगा। समीकरण (2) से (1) घटाने पर: 9x = 3 ⇒ x = 3/9 = 1/3 प्राप्त होता है।'
      }
    },
    {
      id: 'rationalisation-laws-exponents',
      number: '04',
      titleHi: 'हर का परिमेयकरण एवं वास्तविक संख्याओं के घातांक नियम',
      titleEn: 'Rationalisation of the Denominator & Laws of Exponents',
      badge: 'बीजगणितीय संक्रियाएं',
      summaryHi: 'जब किसी भिन्न के हर में अपरिमेय पद हो, तो उपयुक्त परिमेयकारी गुणक से गुणा कर हर को परिमेय बनाना।',
      summaryEn: 'Rationalising the denominator eliminates radicals from the denominator using conjugate surds.',
      bulletPointsHi: [
        '1/√a के हर का परिमेयकरण: अंश व हर को √a से गुणा करने पर √a/a प्राप्त होता है।',
        '1/(a + √b) के हर का परिमेयकरण: संयुग्मी (Conjugate) (a - √b) से अंश व हर को गुणा किया जाता है।',
        'घातांक नियम 1: aᵐ × aⁿ = aᵐ⁺ⁿ',
        'घातांक नियम 2: (aᵐ)ⁿ = aᵐⁿ',
        'घातांक नियम 3: aᵐ / aⁿ = aᵐ⁻ⁿ (जहाँ m > n)',
        'घातांक नियम 4: aᵐ × bᵐ = (ab)ᵐ, तथा a⁰ = 1'
      ],
      bulletPointsEn: [
        'Rationalising 1/√a: Multiply numerator and denominator by √a to yield √a/a.',
        'Rationalising 1/(a + √b): Multiply numerator and denominator by conjugate (a - √b).',
        'Exponent Law 1: aᵐ · aⁿ = aᵐ⁺ⁿ',
        'Exponent Law 2: (aᵐ)ⁿ = aᵐⁿ',
        'Exponent Law 3: aᵐ / aⁿ = aᵐ⁻ⁿ',
        'Exponent Law 4: aᵐ · bᵐ = (ab)ᵐ, and a⁰ = 1'
      ]
    }
  ],

  quickRevisionPointsHi: [
    'संख्या r परिमेय कहलाती है यदि इसे p/q के रूप में लिखा जा सके, जहाँ p व q पूर्णांक हैं और q ≠ 0।',
    'संख्या s अपरिमेय कहलाती है यदि इसे p/q रूप में न लिखा जा सके।',
    'एक परिमेय संख्या का दशमलव प्रसार सांत या अनवसानी आवर्ती होता है।',
    'एक अपरिमेय संख्या का दशमलव प्रसार अनवसानी अनावर्ती होता है।',
    'एक परिमेय और अपरिमेय संख्या का योग या अंतर सदैव अपरिमेय होता है।',
    'एक शून्येतर परिमेय संख्या और अपरिमेय संख्या का गुणनफल या भागफल सदैव अपरिमेय होता है।',
    'किसी धनात्मक वास्तविक संख्या a के लिए, (√a + √b)(√a - √b) = a - b होता है।'
  ],
  quickRevisionPointsEn: [
    'A number is rational if expressible as p/q (p, q ∈ Z, q ≠ 0).',
    'A number is irrational if it cannot be written in p/q form.',
    'Decimals of rationals terminate or recur; decimals of irrationals never terminate or repeat.',
    'The sum or difference of a rational and irrational number is always irrational.',
    'The product or quotient of a non-zero rational and an irrational number is irrational.',
    '(√a + √b)(√a - √b) = a - b for positive real numbers a and b.'
  ],

  boardQuestions: [
    {
      id: 'm-q1',
      marks: '2 Marks',
      typeHi: 'मान ज्ञात कीजिए',
      typeEn: 'Solve / Simplify',
      questionHi: '3 और 4 के बीच छह परिमेय संख्याएं ज्ञात कीजिए।',
      questionEn: 'Find six rational numbers between 3 and 4.',
      answerHi: 'छह परिमेय संख्याएं प्राप्त करने के लिए, हम अंश और हर में (6 + 1) = 7 से गुणा करते हैं:\n3 = 3 × 7/7 = 21/7\n4 = 4 × 7/7 = 28/7\nअतः 21/7 और 28/7 के बीच छह परिमेय संख्याएं हैं: 22/7, 23/7, 24/7, 25/7, 26/7, और 27/7।',
      answerEn: 'To find 6 rational numbers, multiply and divide by (6 + 1) = 7:\n3 = 21/7 and 4 = 28/7.\nThe six rational numbers are: 22/7, 23/7, 24/7, 25/7, 26/7, 27/7.'
    },
    {
      id: 'm-q2',
      marks: '3 Marks',
      typeHi: 'p/q रूप में निरूपण',
      typeEn: 'Representation in p/q form',
      questionHi: '0.2353535... = 0.23̄5̄ को p/q के रूप में व्यक्त कीजिए, जहाँ p और q पूर्णांक हैं तथा q ≠ 0।',
      questionEn: 'Express 0.2353535... in the form p/q, where p and q are integers and q ≠ 0.',
      answerHi: 'माना x = 0.2353535... — (1)\nदोनों पक्षों को 10 से गुणा करने पर:\n10x = 2.353535... — (2)\nसमीकरण (2) को 100 से गुणा करने पर (क्योंकि 2 अंकों की पुनरावृत्ति है):\n1000x = 235.353535... — (3)\nसमीकरण (3) में से (2) घटाने पर:\n990x = 233 ⇒ x = 233 / 990। अतः p/q रूप = 233/990 है।',
      answerEn: 'Let x = 0.2353535... (1)\nMultiply by 10: 10x = 2.353535... (2)\nMultiply by 100: 1000x = 235.353535... (3)\nSubtract (2) from (3): 990x = 233 ⇒ x = 233/990.'
    },
    {
      id: 'm-q3',
      marks: '3 Marks',
      typeHi: 'परिमेयकरण',
      typeEn: 'Rationalisation',
      questionHi: '1 / (7 + 3√2) के हर का परिमेयकरण कीजिए।',
      questionEn: 'Rationalise the denominator of 1 / (7 + 3√2).',
      answerHi: 'हर के संयुग्मी (7 - 3√2) से अंश तथा हर में गुणा करने पर:\n[1 × (7 - 3√2)] / [(7 + 3√2)(7 - 3√2)]\n= (7 - 3√2) / [7² - (3√2)²]\n= (7 - 3√2) / [49 - (9 × 2)]\n= (7 - 3√2) / [49 - 18] = (7 - 3√2) / 31।',
      answerEn: 'Multiply numerator and denominator by conjugate (7 - 3√2):\n= (7 - 3√2) / (7² - (3√2)²)\n= (7 - 3√2) / (49 - 18) = (7 - 3√2) / 31.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLASS 9 ENGLISH - CHAPTER 01: THE FUN THEY HAD (द फन दे हैड)
// ─────────────────────────────────────────────────────────────────────────────
export const CLASS_9_ENGLISH_CH1_DATA: UniversalChapterNotesData = {
  chapterNumber: '01',
  titleHi: 'द फन दे हैड (The Fun They Had)',
  titleEn: 'The Fun They Had',
  subtitleHi: 'कक्षा 9वीं अंग्रेजी (Beehive) — अध्याय 1 सम्पूर्ण अध्ययन नोट्स व सारांश',
  subtitleEn: 'Class 9th English (Beehive) — Chapter 1 Complete Study Notes & Character Analysis',
  classText: 'कक्षा 9 (Class 9)',
  subjectText: 'अंग्रेजी (English)',

  overviewHi: [
    '"The Fun They Had" प्रसिद्ध विज्ञान-कथा लेखक इसहाक असीमोव (Isaac Asimov) द्वारा रचित एक भविष्योन्मुखी (futuristic) कहानी है। यह कहानी वर्ष 2157 में घटित होती है, जब विद्यालय और शिक्षा पूरी तरह से डिजिटल और व्यक्तिगत हो चुके हैं।',
    'कहानी दो बच्चों — मार्गी (Margie - 11 वर्ष) और टॉमी (Tommy - 13 वर्ष) के इर्द-गिर्द घूमती है, जिन्हें अटारी में एक असली कागजी किताब मिलती है। इस किताब के माध्यम से उन्हें पता चलता है कि सैकड़ों वर्ष पूर्व विद्यालय एक विशेष इमारत में होते थे, जहाँ सभी बच्चे एक साथ जाकर इंसानी शिक्षकों से पढ़ते थे।'
  ],
  overviewEn: [
    '"The Fun They Had" is a celebrated science fiction story by Isaac Asimov set in the year 2157, depicting a future where human teachers and traditional physical schools have been replaced by mechanical tele-teachers and virtual classrooms.',
    'The story follows Margie (11) and Tommy (13), who discover an old printed book in the attic. Through this relic, Margie learns about centuries-old schools where children learned together under human teachers, prompting her to reflect nostalgically on "the fun they had".'
  ],

  topics: [
    {
      id: 'story-setting-characters',
      number: '01',
      titleHi: 'कहानी की पृष्ठभूमि एवं प्रमुख पात्र',
      titleEn: 'Setting, Futuristic Context & Characters',
      badge: 'पात्र परिचय',
      summaryHi: 'वर्ष 2157 का परिवेश जहाँ विद्यालय घर के एक कमरे में कंप्यूटर स्क्रीन तक सीमित है।',
      summaryEn: 'Set in 2157 where schools are computerized mechanical monitors inside bedrooms.',
      keyStats: [
        { labelHi: 'कहानी का वर्ष', labelEn: 'Story Year', value: '2157 AD' },
        { labelHi: 'मार्गी की आयु', labelEn: 'Margie Age', value: '11 वर्ष' },
        { labelHi: 'टॉमी की आयु', labelEn: 'Tommy Age', value: '13 वर्ष' },
        { labelHi: 'डायरी प्रविष्टि', labelEn: 'Diary Date', value: '17 मई 2157' }
      ],
      bulletPointsHi: [
        'मार्गी (Margie): 11 वर्षीय बालिका जो अपनी डायरी में 17 मई 2157 को लिखती है: "आज टॉमी को एक असली किताब मिली!"',
        'टॉमी (Tommy): 13 वर्षीय जिज्ञासु बालक, जिसे अपने घर की अटारी (attic) में अपने परदादा के समय की छपी हुई पुस्तक मिलती है।',
        'कागजी पुस्तक (Real Book): इसके पन्ने पीले और मुड़े-तुड़े थे। बच्चों के लिए शब्दों का स्थिर रहना आश्चर्यजनक था क्योंकि वे स्क्रीन पर चलने वाले शब्दों (Telebooks) के आदी थे।',
        'भविष्य के विद्यालय: कोई खेल का मैदान नहीं, कोई सहपाठी नहीं; केवल शयनकक्ष के बगल वाला कमरा जिसमें कंप्यूटर शिक्षक लगा है।'
      ],
      bulletPointsEn: [
        'Margie: An 11-year-old girl who records in her diary on 17 May 2157: "Today Tommy found a real book!"',
        'Tommy: A 13-year-old boy who discovers the century-old printed book in his attic.',
        'The Printed Book: Yellow, crinkly pages with static words that did not move across screens.',
        'Futuristic Schools: No school buildings or classmates; education takes place alone via personal screens.'
      ]
    },
    {
      id: 'mechanical-teacher-problem',
      number: '02',
      titleHi: 'यांत्रिक शिक्षक एवं काउंटी इंस्पेक्टर की यात्रा',
      titleEn: 'The Mechanical Teacher & The County Inspector',
      badge: 'तकनीकी संकट',
      summaryHi: 'मार्गी का भूगोल में गिरता प्रदर्शन और यांत्रिक शिक्षक की मरम्मत।',
      summaryEn: 'Margie struggles in geography until the County Inspector slows the machine down.',
      bulletPointsHi: [
        'यांत्रिक शिक्षक (Mechanical Teacher): एक बड़ी काली स्क्रीन जिस पर सभी पाठ दिखाए जाते थे और प्रश्न पूछे जाते थे। इसमें एक स्लॉट (slot) था जहाँ मार्गी को पंच कोड में गृहकार्य डालना होता था।',
        'मार्गी की नापसंदगी: यांत्रिक शिक्षक उसे भूगोल में लगातार कठिन टेस्ट दे रहा था और उसका प्रदर्शन गिरता जा रहा था।',
        'काउंटी इंस्पेक्टर का आगमन: एक गोल-मटोल लाल चेहरे वाला व्यक्ति जो औजारों और तारों का बक्सा लेकर आया।',
        'समस्या का निदान: इंस्पेक्टर ने बताया कि मार्गी की कोई गलती नहीं थी; भूगोल सेक्टर का स्तर कुछ तेज गति पर सेट हो गया था। उसने उसे 10 वर्ष के बच्चे के स्तर पर धीमा कर दिया।'
      ],
      bulletPointsEn: [
        'Mechanical Teacher: A large monitor delivering lessons and instant grading via a punch-code slot.',
        'Margie’s Dislike: Endless geography test failures made her despise the mechanical device.',
        'The County Inspector: A round little man with a red face and a box of tools and dials.',
        'The Fault: The geography sector was geared too fast for her age; he adjusted it to an average 10-year level.'
      ]
    },
    {
      id: 'old-schools-nostalgia',
      number: '03',
      titleHi: 'प्राचीन विद्यालय एवं मार्गी के विचार: "The Fun They Had"',
      titleEn: 'Centuries-Old Schools & Margie’s Nostalgia',
      badge: 'केंद्रीय संदेश',
      summaryHi: 'मार्गी सोचती है कि पुराने समय में जब बच्चे एक साथ पढ़ते थे तो उन्हें कितना आनंद आता होगा।',
      summaryEn: 'Margie reflects on the joy of collaborative learning and human connection in old schools.',
      bulletPointsHi: [
        'मानव शिक्षक: टॉमी मार्गी को बताता है कि पुराने समय में शिक्षक मशीन नहीं बल्कि जीवित इंसान होते थे।',
        'विशेष भवन (Special Building): सभी बच्चे एक निश्चित स्थान (स्कूल) पर जाते थे, एक ही उम्र के बच्चे एक जैसी चीजें सीखते थे।',
        'सहयोगात्मक अध्ययन: बच्चे एक दूसरे के साथ गृहकार्य में मदद कर सकते थे और उस पर चर्चा कर सकते थे।',
        'कहानी का समापन: जब मार्गी अपने कमरे में यांत्रिक शिक्षक के सामने गणित के भिन्न जोड़ रही थी, उसका ध्यान पुराने स्कूलों में बच्चों द्वारा मिलकर हंसने, खेलने और पढ़ाई के उस आनंद ("the fun they had") पर लगा हुआ था।'
      ],
      bulletPointsEn: [
        'Human Teachers: Real people who taught groups of kids in separate buildings.',
        'Collaborative Learning: Children shared homework, played together, and discussed ideas.',
        'Story Conclusion: Margie sits before her glowing screen, dreaming of the joy and fun those children enjoyed in past schools.'
      ],
      calloutBox: {
        type: 'quote',
        titleHi: 'कहानी का गहरा संदेश',
        titleEn: 'Core Theme of the Story',
        contentHi: 'तकनीक कितनी भी उन्नत हो जाए, वह इंसानी सहानुभूति, सामाजिक संपर्क और सहपाठियों के साथ सीखने के स्वाभाविक आनंद का स्थान कभी नहीं ले सकती।'
      }
    }
  ],

  quickRevisionPointsHi: [
    'कहानी 2157 ईस्वी के भविष्य की शिक्षा प्रणाली पर आधारित है।',
    'टॉमी को अटारी में कागज पर छपी एक वास्तविक पुरानी पुस्तक मिलती है।',
    'मार्गी अपने यांत्रिक शिक्षक से नफरत करती है क्योंकि वह बिना किसी मानवीय संवेदना के निरंतर टेस्ट लेता है।',
    'काउंटी इंस्पेक्टर भूगोल क्षेत्र की गति को 10 वर्ष के स्तर पर नियंत्रित करता है।',
    'पुराने स्कूलों में सभी बच्चे एक साथ पढ़ते थे, जिससे उनमें मित्रता और सामाजिक विकास होता था।',
    'कहानी शिक्षा में मानवीय सहभागिता और सहपाठी वातावरण के महत्व को रेखांकित करती है।'
  ],
  quickRevisionPointsEn: [
    'Story is set in 2157 envisioning home-based computerized schooling.',
    'Tommy finds an authentic printed paper book in his attic.',
    'Margie despises mechanical schooling due to rigid, isolated drill testing.',
    'County Inspector adjusts the machine speed to match Margie’s pace.',
    'Old schools fostered empathy, teamwork, and collective joy among children.',
    'Story underscores the irreplaceable value of human interaction in education.'
  ],

  boardQuestions: [
    {
      id: 'eng-q1',
      marks: '2 Marks',
      typeHi: 'लघु उत्तरीय प्रश्न',
      typeEn: 'Short Answer',
      questionHi: 'मार्गी ने अपनी डायरी में क्या लिखा और क्यों?',
      questionEn: 'What did Margie write in her diary on 17 May 2157?',
      answerHi: 'मार्गी ने 17 मई 2157 को अपनी डायरी में लिखा: "आज टॉमी को एक असली किताब मिली!" उसने ऐसा इसलिए लिखा क्योंकि उसके युग में सभी पुस्तकें केवल कंप्यूटर स्क्रीन पर इलेक्ट्रॉनिक रूप (Telebooks) में उपलब्ध थीं और कागजी किताब देखना एक दुर्लभ घटना थी।',
      answerEn: 'Margie wrote: "Today Tommy found a real book!" She recorded this because in her digital era of 2157, books were solely electronic telebooks, making a physical printed book an extraordinary discovery.'
    },
    {
      id: 'eng-q2',
      marks: '3 Marks',
      typeHi: 'तुलनात्मक प्रश्न',
      typeEn: 'Comparison',
      questionHi: 'मार्गी के विद्यालय और 20वीं सदी के पारंपरिक विद्यालय में क्या अंतर है?',
      questionEn: 'How does Margie’s school differ from traditional schools of our times?',
      answerHi: '1. मार्गी का स्कूल उसके घर के एक कमरे में है, जबकि पारंपरिक स्कूल एक अलग सार्वजनिक इमारत में होता है।\n2. मार्गी को एक यांत्रिक कंप्यूटर शिक्षक पढ़ाता है, जबकि पारंपरिक स्कूल में जीवित मानव शिक्षक पढ़ाते हैं।\n3. मार्गी अकेली पढ़ती है, जबकि पारंपरिक स्कूल में समान आयु के सभी बच्चे एक साथ बैठकर सहयोगपूर्वक सीखते हैं।',
      answerEn: '1. Margie’s school is an isolated room in her home, unlike external shared buildings.\n2. She is taught by an impersonal mechanical screen, whereas traditional schools feature human teachers.\n3. She studies in solitude, whereas conventional schools cultivate social interaction and mutual support.'
    },
    {
      id: 'eng-q3',
      marks: '5 Marks',
      typeHi: 'दीर्घ उत्तरीय प्रश्न (विचारपरक)',
      typeEn: 'Long Essay / Theme Question',
      questionHi: 'शीर्षक "The Fun They Had" का औचित्य सिद्ध कीजिए। मार्गी किस आनंद की कल्पना कर रही थी?',
      questionEn: 'Justify the title "The Fun They Had". What fun was Margie thinking about at the end?',
      answerHi: 'कहानी का शीर्षक अत्यंत सार्थक और विचारोत्तेजक है। कहानी के अंत में मार्गी अपने कंप्यूटर शिक्षक के सामने बैठी है, परंतु उसका मन पुराने जमाने के बच्चों के आनंद में डूबा हुआ है। वह सोचती है कि उस समय जब पूरे मोहल्ले के बच्चे हंसते-खेलते एक साथ स्कूल जाते थे, एक ही कक्षा में बैठकर समान पाठ सीखते थे और गृहकार्य में एक-दूसरे की मदद करते थे, तो उन्हें कितना आनंद आता होगा ("the fun they had")। यह शीर्षक आधुनिक एकाकी तकनीक के मुकाबले मानवीय सामाजिक शिक्षा की श्रेष्ठता को खूबसूरती से प्रकट करता है।',
      answerEn: 'The title "The Fun They Had" is apt and deeply poignant. While sitting in front of her mechanical tutor, Margie dreams of children from past centuries walking together to school, laughing, learning the same lessons, and helping one another with homework. The title emphasizes the irreplaceable warmth, joy, and camaraderie of human classroom experiences over cold technological automation.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLASS 9 SOCIAL SCIENCE - CHAPTER 01: THE FRENCH REVOLUTION (फ्रांसीसी क्रांति)
// ─────────────────────────────────────────────────────────────────────────────
export const CLASS_9_SOCIAL_SCIENCE_CH1_DATA: UniversalChapterNotesData = {
  chapterNumber: '01',
  titleHi: 'फ्रांसीसी क्रांति (The French Revolution)',
  titleEn: 'The French Revolution',
  subtitleHi: 'कक्षा 9वीं सामाजिक विज्ञान (इतिहास) — अध्याय 1 सम्पूर्ण अध्ययन नोट्स (NCERT पाठ्यक्रम)',
  subtitleEn: 'Class 9th Social Science (History) — Chapter 1 Complete Notes & Timeline',
  classText: 'कक्षा 9 (Class 9)',
  subjectText: 'सामाजिक विज्ञान (Social Science)',

  overviewHi: [
    '14 जुलाई 1789 की सुबह, पेरिस नगर में आतंक का माहौल था। सम्राट ने सेना को शहर में प्रवेश का आदेश दिया था। लगभग 7,000 पुरुषों और महिलाओं ने जन-सेना (People\'s Militia) का गठन किया और बास्तील (Bastille) के किले की जेल को तोड़ दिया। यह घटना फ्रांसीसी क्रांति की शुरुआत मानी जाती है।',
    'फ्रांसीसी क्रांति ने न केवल फ्रांस में निरंकुश राजतंत्र और सामंती व्यवस्था का अंत किया, बल्कि पूरे विश्व को स्वतंत्रता (Liberty), समानता (Equality) और बंधुत्व (Fraternity) के अमर विचार दिए, जो आधुनिक लोकतंत्र के स्तंभ हैं।'
  ],
  overviewEn: [
    'On the morning of 14 July 1789, the storming of the fortress-prison Bastille marked the outbreak of the French Revolution, which toppled absolute monarchy and aristocratic feudal privileges.',
    'The French Revolution introduced the revolutionary concepts of Liberty, Equality, and Fraternity, fundamentally altering political landscapes across Europe and inspiring global democratic movements.'
  ],

  topics: [
    {
      id: 'french-society-late-18th-century',
      number: '01',
      titleHi: '18वीं सदी के उत्तरार्ध में फ्रांसीसी समाज एवं तीन एस्टेट्स',
      titleEn: 'French Society in the Late 18th Century & The Three Estates',
      badge: 'सामाजिक संरचना',
      summaryHi: 'फ्रांसीसी समाज तीन श्रेणियों (Estates) में बंटा हुआ था और केवल तृतीय एस्टेट ही कर चुकाता था।',
      summaryEn: 'French society was divided into three estates; tax burdens fell solely upon the Third Estate.',
      keyStats: [
        { labelHi: 'क्रांति वर्ष', labelEn: 'Revolution Year', value: '1789' },
        { labelHi: 'शासक', labelEn: 'Monarch', value: 'लुई XVI (बूर्बों राजवंश)' },
        { labelHi: 'एस्टेट्स संख्या', labelEn: 'Estates Count', value: '3 श्रेणियां' },
        { labelHi: 'करदाता जनसंख्या', labelEn: 'Taxpaying Population', value: 'लगभग 90%' }
      ],
      bulletPointsHi: [
        'प्रथम एस्टेट (First Estate): पादरी वर्ग (Clergy) — चर्च से संबंधित लोग, जिन्हें जन्मजात कर-मुक्ति और विशेषाधिकार प्राप्त थे।',
        'द्वितीय एस्टेट (Second Estate): कुलीन वर्ग (Nobility) — सामंत और राजदरबारी, जो किसानों से सामंती कर वसूलते थे और करों से मुक्त थे।',
        'तृतीय एस्टेट (Third Estate): बड़े व्यवसायी, व्यापारी, वकील, किसान, कारीगर और भूमिहीन मजदूर — जनसंख्या का लगभग 90% हिस्सा किसान थे, परंतु सारा कर केवल इसी वर्ग पर था।',
        'धार्मिक कर (Tithes): चर्च द्वारा किसानों से वसूला जाने वाला कृषि उपज का दसवां हिस्सा।',
        'प्रत्यक्ष कर (Taille): राज्य द्वारा तृतीय एस्टेट पर लगाया जाने वाला सीधा कर।'
      ],
      bulletPointsEn: [
        'First Estate (Clergy): Enjoyed birth privileges and complete exemption from state taxes.',
        'Second Estate (Nobility): Aristocrats who extracted feudal dues from peasants and paid zero taxes.',
        'Third Estate: Comprising businessmen, merchants, court officials, peasants, and laborers — bearing 100% of all taxation.',
        'Tithes: Religious tax extracted by the Church comprising one-tenth of agricultural produce.',
        'Taille: Direct tax levied by the French crown on the Third Estate.'
      ]
    },
    {
      id: 'subsistence-crisis-outbreak',
      number: '02',
      titleHi: 'जीविका संकट एवं क्रांति का सूत्रपात (1789)',
      titleEn: 'The Subsistence Crisis & Outbreak of the Revolution',
      badge: 'क्रांति का कारण',
      summaryHi: 'जनसंख्या वृद्धि, सूखे-ओले का प्रकोप, पाव रोटी के दाम में बेतहाशा वृद्धि और एस्टेट्स जनरल की बैठक।',
      summaryEn: 'Population explosion, bread price inflation, subsistence crisis, and the Estates-General deadlock.',
      bulletPointsHi: [
        'जीविका संकट (Subsistence Crisis): फ्रांस की जनसंख्या 1715 में 2.3 करोड़ से बढ़कर 1789 में 2.8 करोड़ हो गई। अनाज की मांग तेजी से बढ़ी लेकिन उत्पादन कम रहा, जिससे पाव रोटी के दाम आसमान छूने लगे।',
        'दार्शनिकों की भूमिका: जॉन लॉक (John Locke), ज्यां जाक रूसो (Rousseau) और मॉन्टेस्क्यू (Montesquieu) के विचारों ने लोगों में समानता और अधिकारों की चेतना जगाई। मॉन्टेस्क्यू ने "द स्पिरिट ऑफ द लॉज" में शक्ति के पृथक्करण (कार्यपालिका, विधायिका, न्यायपालिका) का सिद्धांत दिया।',
        'एस्टेट्स जनरल की बैठक (5 मई 1789): लुई 16वें ने नए कर लगाने हेतु बैठक बुलाई। तृतीय एस्टेट ने प्रत्येक सदस्य को एक मत देने की मांग की, जिसे राजा ने ठुकरा दिया।',
        'टेनिस कोर्ट की शपथ (20 जून 1789): तृतीय एस्टेट के प्रतिनिधियों ने वर्साय के इंडोर टेनिस कोर्ट में एकत्रित होकर "नेशनल असेंबली" की घोषणा की और नया संविधान बनाने की शपथ ली।'
      ],
      bulletPointsEn: [
        'Subsistence Crisis: Rapid population growth from 23 to 28 million led to food shortages and bread inflation.',
        'Enlightenment Philosophers: Locke, Rousseau, and Montesquieu challenged divine monarchy and advocated separation of powers.',
        'Estates-General (5 May 1789): Third Estate demanded one-member-one-vote, leading to walkout upon monarchical refusal.',
        'Tennis Court Oath (20 June 1789): Third Estate declared itself the National Assembly, vowing to draft a constitution.'
      ]
    },
    {
      id: 'constitutional-monarchy-terror',
      number: '03',
      titleHi: 'संवैधानिक राजतंत्र एवं आतंक का राज (रोबेस्पियर 1793-1794)',
      titleEn: 'Constitutional Monarchy & The Reign of Terror (1793-1794)',
      badge: 'ऐतिहासिक मोड़',
      summaryHi: 'मानव अधिकारों की घोषणा, जैकोबिन क्लब और रोबेस्पियर का गिलोटिन आधारित आतंक का शासन।',
      summaryEn: 'Declaration of Rights, Jacobin radicalism, and Robespierre’s guillotine-dominated terror.',
      bulletPointsHi: [
        'संविधान 1791: नेशनल असेंबली ने संविधान का प्रारूप पूरा किया, जिससे राजा की शक्तियों को सीमित कर शक्ति का विभाजन किया गया।',
        'मानव एवं नागरिक अधिकारों की घोषणा: स्वतंत्रता, समानता, जीवन का अधिकार और विचार अभिव्यक्ति की स्वतंत्रता को "प्राकृतिक एवं अहरणीय" अधिकार घोषित किया गया।',
        'जैकोबिन क्लब (Jacobin Club): मैक्सिमिलियन रोबेस्पियर के नेतृत्व में निम्न मध्यम वर्ग का शक्तिशाली राजनीतिक दल।',
        'आतंक का राज (1793-1794): रोबेस्पियर ने अपने सभी विरोधियों को "गिलोटिन" (सिर काटने की मशीन) पर चढ़वा दिया। जुलाई 1794 में उसे स्वयं दोषी ठहराकर गिलोटिन पर चढ़ा दिया गया।'
      ],
      bulletPointsEn: [
        'Constitution of 1791: Converted France into a constitutional monarchy limiting royal power.',
        'Declaration of the Rights of Man and Citizen: Established natural rights to liberty, equality, and free speech.',
        'Jacobin Club: Radical political club led by Maximilien Robespierre.',
        'Reign of Terror (1793-1794): Severe control and execution of dissidents via the guillotine until Robespierre’s downfall.'
      ],
      calloutBox: {
        type: 'concept',
        titleHi: 'क्रांति की वैश्विक विरासत (Global Legacy)',
        titleEn: 'Global Legacy of the French Revolution',
        contentHi: 'स्वतंत्रता और जनवादी अधिकारों के विचार फ्रांसीसी क्रांति की सबसे महत्वपूर्ण विरासत थे। 19वीं सदी में ये विचार पूरे यूरोप में फैले और भारत में टीपू सुल्तान व राजा राममोहन राय जैसे विचारकों को गहराई से प्रेरित किया।'
      }
    }
  ],

  quickRevisionPointsHi: [
    '14 जुलाई 1789 को बास्तील के पतन के साथ फ्रांसीसी क्रांति का उद्घोष हुआ।',
    'पुराने शासन में समाज 3 एस्टेट्स में बंटा था, जिसमें केवल तृतीय एस्टेट सभी कर भरता था।',
    'मॉन्टेस्क्यू ने शासन की शक्तियों के विभाजन (विधायिका, कार्यपालिका, न्यायपालिका) का सिद्धांत प्रतिपादित किया।',
    '20 जून 1789 को टेनिस कोर्ट की शपथ में नेशनल असेंबली गठित की गई।',
    '1791 के संविधान ने फ्रांस को संवैधानिक राजतंत्र बनाया।',
    '1793-1794 का काल रोबेस्पियर के नेतृत्व में "आतंक का राज" कहलाया।',
    '1804 में नेपोलियन बोनापार्ट ने स्वयं को फ्रांस का सम्राट घोषित किया।'
  ],
  quickRevisionPointsEn: [
    'The storming of the Bastille on 14 July 1789 triggered the revolution.',
    'Only the Third Estate bore the complete burden of feudal taxes.',
    'Montesquieu proposed separation of governmental powers in "The Spirit of the Laws".',
    'National Assembly declared during the historic Tennis Court Oath on 20 June 1789.',
    'Constitution of 1791 created a constitutional monarchy.',
    '1793-1794 marked the Reign of Terror under Robespierre.',
    'Napoleon Bonaparte crowned himself Emperor of France in 1804.'
  ],

  boardQuestions: [
    {
      id: 'sst-q1',
      marks: '2 Marks',
      typeHi: 'अति लघु उत्तरीय',
      typeEn: 'Short Question',
      questionHi: 'बास्तील का पतन (Storming of the Bastille) क्यों महत्वपूर्ण माना जाता है?',
      questionEn: 'Why is the storming of the Bastille considered a historic landmark?',
      answerHi: 'बास्तील का किला फ्रांस के राजा की निरंकुश और दमनकारी शक्तियों का प्रतीक था। 14 जुलाई 1789 को आम जनता द्वारा इस किले को तोड़ना सामंतवाद और निरंकुश राजतंत्र के विरुद्ध जनता की सीधी जीत थी। इसी दिन से फ्रांसीसी क्रांति का औपचारिक आरंभ माना जाता है।',
      answerEn: 'The fortress-prison Bastille symbolized the despotic power of the French absolute monarchy. Its destruction by the revolutionaries on 14 July 1789 marked the collapse of feudal tyranny and the true beginning of the French Revolution.'
    },
    {
      id: 'sst-q2',
      marks: '3 Marks',
      typeHi: 'सामाजिक कारण',
      typeEn: 'Social Factors',
      questionHi: '18वीं सदी के फ्रांस में "तीन एस्टेट्स" की व्यवस्था का वर्णन कीजिए।',
      questionEn: 'Describe the Three Estates system of 18th-century French society.',
      answerHi: '1. प्रथम एस्टेट (पादरी): चर्च के सदस्य, जिनके पास अपार भूमि थी और वे करों से पूर्णतः मुक्त थे।\n2. द्वितीय एस्टेट (कुलीन): सामंत और उच्च दरबारी, जिन्हें विशेषाधिकार प्राप्त थे और वे किसानों से सामंती कर वसूलते थे।\n3. तृतीय एस्टेट (सामान्य जन): 90% किसान, व्यापारी, शिक्षक व मजदूर, जो बिना किसी विशेषाधिकार के राज्य और चर्च के समस्त कर (Taille व Tithes) चुकाते थे।',
      answerEn: '1. First Estate (Clergy): Owned extensive land and paid zero taxes.\n2. Second Estate (Nobility): Aristocrats enjoying birth privileges and extracting feudal rents without paying taxes.\n3. Third Estate (Commoners): 90% peasants alongside professionals, carrying the entire tax burden without political voice.'
    },
    {
      id: 'sst-q3',
      marks: '5 Marks',
      typeHi: 'दीर्घ उत्तरीय प्रश्न (विरासत)',
      typeEn: 'Long Essay Question',
      questionHi: 'फ्रांसीसी क्रांति के विश्वव्यापी प्रभावों एवं इसकी विरासत का मूल्यांकन कीजिए।',
      questionEn: 'Evaluate the worldwide impact and legacy of the French Revolution.',
      answerHi: '1. स्वतंत्रता, समानता और बंधुत्व के विचार: फ्रांसीसी क्रांति ने विश्व को लोकतांत्रिक अधिकारों की सौगात दी।\n2. सामंतवाद का अंत: यूरोप भर में सामंती विशेषाधिकारों और निरंकुश राजतंत्रों की जड़ें हिल गईं।\n3. राष्ट्रवाद का उदय: क्रांति ने आधुनिक संप्रभु राष्ट्र-राज्य (Nation-state) की अवधारणा को जन्म दिया।\n4. औपनिवेशिक मुक्ति आंदोलनों को प्रेरणा: एशिया और अफ्रीका के औपनिवेशिक देशों ने इससे प्रेरणा लेकर अपनी आजादी की लड़ाई लड़ी। भारत में टीपू सुल्तान और राजा राममोहन राय इस क्रांति के क्रांतिकारी विचारों से अत्यधिक प्रभावित हुए।',
      answerEn: '1. Democratic ideals of Liberty, Equality, and Fraternity became global principles.\n2. Feudalism and aristocratic birth privileges were abolished across Western Europe.\n3. Catalyzed modern nationalism and sovereign constitutional nation-states.\n4. Inspired anti-colonial freedom movements in Asia and Africa, directly impacting Indian leaders like Tipu Sultan and Raja Rammohan Roy.'
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER TO GET CLASS 9 CHAPTER DATA
// ─────────────────────────────────────────────────────────────────────────────
export function getClass9ChapterData(subjectId: string, _chapterSlug?: string): UniversalChapterNotesData {
  if (subjectId === 'maths') return CLASS_9_MATHS_CH1_DATA;
  if (subjectId === 'english') return CLASS_9_ENGLISH_CH1_DATA;
  if (subjectId === 'social-science') return CLASS_9_SOCIAL_SCIENCE_CH1_DATA;
  // Default to Science
  return CLASS_9_SCIENCE_CH1_DATA;
}
