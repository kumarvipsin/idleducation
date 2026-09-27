export interface ChapterContentData {
  chapterId: string;
  chapterNumber: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  overview: {
    titleEn: string;
    titleHi: string;
    paragraphsEn: string[];
    paragraphsHi: string[];
  };
  keyConcept: {
    titleEn: string;
    titleHi: string;
    definitionTitleEn: string;
    definitionTitleHi: string;
    definitionEn: string;
    definitionHi: string;
    characteristicsTitleEn: string;
    characteristicsTitleHi: string;
    characteristicsEn: { title: string; desc: string }[];
    characteristicsHi: { title: string; desc: string }[];
    rememberTitleEn: string;
    rememberTitleHi: string;
    rememberEn: string;
    rememberHi: string;
  };
  comparisonSection: {
    titleEn: string;
    titleHi: string;
    tableHeadingEn: string;
    tableHeadingHi: string;
    introEn: string;
    introHi: string;
    headersEn: string[];
    headersHi: string[];
    rowsEn: { property: string; solid: string; liquid: string; gas: string }[];
    rowsHi: { property: string; solid: string; liquid: string; gas: string }[];
    realWorldNoteEn: string;
    realWorldNoteHi: string;
  };
  changeOfState: {
    titleEn: string;
    titleHi: string;
    introEn: string;
    introHi: string;
    formulaTitleEn: string;
    formulaTitleHi: string;
    formulaText: string;
    formulaExampleEn: string;
    formulaExampleHi: string;
    latentHeatTitleEn: string;
    latentHeatTitleHi: string;
    latentHeatDefEn: string;
    latentHeatDefHi: string;
  };
  evaporationSection: {
    titleEn: string;
    titleHi: string;
    defTitleEn: string;
    defTitleHi: string;
    defEn: string;
    defHi: string;
    factorsTitleEn: string;
    factorsTitleHi: string;
    factorsEn: { title: string; desc: string }[];
    factorsHi: { title: string; desc: string }[];
    coolingTitleEn: string;
    coolingTitleHi: string;
    coolingEn: string;
    coolingHi: string;
  };
  quickRevision: {
    titleEn: string;
    titleHi: string;
    cardHeadingEn: string;
    cardHeadingHi: string;
    pointsEn: string[];
    pointsHi: string[];
  };
  importantQuestions: {
    titleEn: string;
    titleHi: string;
    questions: {
      id: string;
      marks: string;
      questionEn: string;
      questionHi: string;
      answerEn: string;
      answerHi: string;
    }[];
  };
}

export const DEMO_CHAPTER_01_DATA: ChapterContentData = {
  chapterId: 'matter-in-our-surroundings',
  chapterNumber: '01',
  titleEn: 'Matter in Our Surroundings',
  titleHi: 'हमारे आस-पास के पदार्थ',
  subtitleEn: 'Revision notes, key definitions, sample concepts, and exam questions (Demo Preview Mode).',
  subtitleHi: 'रिवीजन नोट्स, मुख्य परिभाषाएं, नमूना अवधारणाएं और परीक्षा प्रश्न (डेमो प्रीव्यू मोड)।',
  
  overview: {
    titleEn: '1. Chapter Overview',
    titleHi: '1. अध्याय अवलोकन (Chapter Overview)',
    paragraphsEn: [
      'As we look at our surroundings, we see a large variety of things with different shapes, sizes, and textures. Everything in this universe is made up of material which scientists have named "matter".',
      'Since early times, human beings have been trying to understand their surroundings. Early Indian philosophers classified matter in the form of five basic elements — the "Panch Tatva": Air, Earth, Fire, Sky, and Water.',
      'Modern day scientists have evolved two types of classification of matter based on their physical properties and chemical nature. In this chapter, we focus on the physical nature of matter with foundational concepts and illustrative experiments.'
    ],
    paragraphsHi: [
      'जब हम अपने चारों ओर देखते हैं, तो हमें विभिन्न प्रकार की वस्तुएं नजर आती हैं जिनका आकार, रूप और बनावट अलग-अलग होती है। विश्व की प्रत्येक वस्तु जिस सामग्री से बनी है, उसे वैज्ञानिकों ने "पदार्थ" (Matter) का नाम दिया है।',
      'प्राचीन काल से ही मानव अपने आस-पास को समझने का प्रयास करता रहा है। भारत के प्राचीन दार्शनिकों ने पदार्थ को पाँच मूल तत्वों में वर्गीकृत किया था, जिसे "पंचतत्व" कहा गया: वायु, पृथ्वी, अग्नि, आकाश और जल।',
      'आधुनिक वैज्ञानिकों ने पदार्थ को उसके भौतिक गुणों (Physical Properties) और रासायनिक प्रकृति (Chemical Nature) के आधार पर दो प्रकार से वर्गीकृत किया है। इस अध्याय में हम पदार्थ के भौतिक स्वरूप का विस्तृत अध्ययन करते हैं।'
    ]
  },

  keyConcept: {
    titleEn: '2. Matter and Its Characteristics',
    titleHi: '2. पदार्थ और उसके अभिलक्षण (Matter and Its Characteristics)',
    definitionTitleEn: 'DEFINITION',
    definitionTitleHi: 'परिभाषा (DEFINITION)',
    definitionEn: 'Matter is anything that has mass and occupies space (volume). It encompasses everything around us that can be perceived by our senses.',
    definitionHi: 'पदार्थ वह प्रत्येक वस्तु है जिसका द्रव्यमान होता है और जो स्थान (आयतन) घेरती है। हमारे आस-पास की वे सभी वस्तुएं जिनका अनुभव हम अपनी ज्ञानेंद्रियों से कर सकते हैं, पदार्थ हैं।',
    characteristicsTitleEn: 'Characteristics of Particles of Matter:',
    characteristicsTitleHi: 'पदार्थ के कणों के मुख्य अभिलक्षण:',
    characteristicsEn: [
      {
        title: 'Particles of matter have spaces between them:',
        desc: 'When we dissolve salt, sugar, or potassium permanganate in water, particles get evenly distributed between the spaces of water particles without an increase in total volume.'
      },
      {
        title: 'Particles of matter are continuously moving:',
        desc: 'Particles possess kinetic energy. As temperature rises, particles move faster because their kinetic energy increases substantially.'
      },
      {
        title: 'Particles of matter attract each other:',
        desc: 'An intermolecular force of attraction holds particles together. It is strongest in solids, moderate in liquids, and weakest in gases.'
      }
    ],
    characteristicsHi: [
      {
        title: 'पदार्थ के कणों के बीच रिक्त स्थान होता है:',
        desc: 'जब हम पानी में नमक, चीनी या पोटैशियम परमैंगनेट घोलते हैं, तो वे जल के कणों के बीच समान रूप से वितरित हो जाते हैं।'
      },
      {
        title: 'पदार्थ के कण निरंतर गतिशील होते हैं:',
        desc: 'कणों में गतिज ऊर्जा (Kinetic Energy) होती है। तापमान बढ़ाने पर कणों की गति और तेज हो जाती है क्योंकि ऊर्जा बढ़ जाती है।'
      },
      {
        title: 'पदार्थ के कण एक-दूसरे को आकर्षित करते हैं:',
        desc: 'कणों के मध्य अंतराआण्विक आकर्षण बल कार्य करता है, जो ठोसों में सबसे अधिक, द्रवों में मध्यम और गैसों में सबसे कम होता है।'
      }
    ],
    rememberTitleEn: 'REMEMBER',
    rememberTitleHi: 'याद रखें (REMEMBER)',
    rememberEn: 'Diffusion: The intermixing of particles of two different types of matter on their own is called diffusion. The rate of diffusion increases with heating because the kinetic energy of particles increases.',
    rememberHi: 'विसरण (Diffusion): दो विभिन्न पदार्थों के कणों का स्वतः मिलना विसरण कहलाता है। तापमान बढ़ाने पर विसरण की दर बढ़ जाती है क्योंकि कणों की गतिज ऊर्जा में वृद्धि होती है।'
  },

  comparisonSection: {
    titleEn: '3. States of Matter',
    titleHi: '3. पदार्थ की अवस्थाएं (States of Matter)',
    tableHeadingEn: 'Comparison: Solids, Liquids, and Gases',
    tableHeadingHi: 'ठोस, द्रव एवं गैस की तुलना',
    introEn: 'Matter around us exists in three distinct physical states due to differences in the characteristics of its particles: Solid, Liquid, and Gas.',
    introHi: 'पदार्थ अपने कणों के विभिन्न अभिलक्षणों के कारण तीन भौतिक अवस्थाओं में पाया जाता है: ठोस (Solid), द्रव (Liquid), और गैस (Gas)।',
    headersEn: ['Property', 'Solids (ठोस)', 'Liquids (द्रव)', 'Gases (गैस)'],
    headersHi: ['गुणधर्म', 'ठोस (Solids)', 'द्रव (Liquids)', 'गैस (Gases)'],
    rowsEn: [
      {
        property: 'Shape & Volume',
        solid: 'Definite shape & fixed volume',
        liquid: 'No fixed shape, fixed volume',
        gas: 'Neither fixed shape nor volume'
      },
      {
        property: 'Compressibility',
        solid: 'Negligible compressibility',
        liquid: 'Very low / Incompressible',
        gas: 'Highly compressible under pressure'
      },
      {
        property: 'Particle Packing',
        solid: 'Closely packed in fixed positions',
        liquid: 'Loosely packed, particles can slide',
        gas: 'Very loosely packed with large voids'
      },
      {
        property: 'Intermolecular Force',
        solid: 'Maximum force of attraction',
        liquid: 'Moderate force of attraction',
        gas: 'Minimum / Negligible force'
      },
      {
        property: 'Diffusion Rate',
        solid: 'Extremely slow diffusion',
        liquid: 'Moderate diffusion rate',
        gas: 'Very rapid diffusion rate'
      }
    ],
    rowsHi: [
      {
        property: 'आकार एवं आयतन',
        solid: 'निश्चित आकार और निश्चित आयतन',
        liquid: 'अनिश्चित आकार, निश्चित आयतन',
        gas: 'न तो निश्चित आकार, न आयतन'
      },
      {
        property: 'संपीड्यता (Compressibility)',
        solid: 'नगण्य (Negligible)',
        liquid: 'बहुत कम (Very low)',
        gas: 'अत्यधिक संपीड्य (High)'
      },
      {
        property: 'कणों की व्यवस्था',
        solid: 'पास-पास और स्थिर स्थिति में',
        liquid: 'कम घने, फिसलने में सक्षम',
        gas: 'बहुत दूर-दूर और स्वतंत्र गति'
      },
      {
        property: 'अंतराआण्विक बल',
        solid: 'अधिकतम आकर्षण बल',
        liquid: 'मध्यम आकर्षण बल',
        gas: 'न्यूनतम / नगण्य आकर्षण बल'
      },
      {
        property: 'विसरण की दर',
        solid: 'अत्यंत धीमी',
        liquid: 'मध्यम दर',
        gas: 'अत्यधिक तीव्र'
      }
    ],
    realWorldNoteEn: 'Real-world Application: Due to its high compressibility, large volumes of gas can be compressed into a small cylinder and transported easily, e.g., Liquefied Petroleum Gas (LPG) cylinders used at home and Compressed Natural Gas (CNG) used in vehicles.',
    realWorldNoteHi: 'दैनिक जीवन में अनुप्रयोग: गैसों की संपीड्यता अधिक होने के कारण अधिक मात्रा में गैस को कम आयतन वाले सिलेंडरों में संपीड़ित किया जा सकता है, जैसे तरलीकृत पेट्रोलियम गैस (LPG) और संपीडित प्राकृतिक गैस (CNG)।'
  },

  changeOfState: {
    titleEn: '4. Change of State',
    titleHi: '4. अवस्था परिवर्तन (Change of State)',
    introEn: 'Matter can change its physical state from one form to another by altering temperature and pressure conditions.',
    introHi: 'तापमान और दाब में परिवर्तन करके किसी पदार्थ की भौतिक अवस्था को एक रूप से दूसरे रूप में परिवर्तित किया जा सकता है।',
    formulaTitleEn: 'TEMPERATURE SCALE CONVERSION FORMULA',
    formulaTitleHi: 'तापमान का SI मात्रक एवं रूपांतरण सूत्र',
    formulaText: 'T (in Kelvin) = T (in °C) + 273.15',
    formulaExampleEn: 'Standard: 0°C = 273.15 K (conventionally taken as 273 K) • 100°C = 373 K (Boiling point of water)',
    formulaExampleHi: 'मानक मान: 0°C = 273.15 K (सामान्यता 273 K लेते हैं) • 100°C = 373 K (जल का क्वथनांक)',
    latentHeatTitleEn: 'DEFINITION: LATENT HEAT (गुप्त ऊष्मा)',
    latentHeatTitleHi: 'परिभाषा: प्रसुप्त ऊष्मा (Latent Heat)',
    latentHeatDefEn: 'Latent Heat of Fusion: The amount of heat energy required to change 1 kg of a solid into liquid at atmospheric pressure at its melting point is known as the latent heat of fusion.',
    latentHeatDefHi: 'संगलन की प्रसुप्त ऊष्मा (Latent Heat of Fusion): वायुमंडलीय दाब पर 1 किलोग्राम ठोस को उसके गलनांक पर द्रव में बदलने के लिए जितनी ऊष्मीय ऊर्जा की आवश्यकता होती है, उसे संगलन की प्रसुप्त ऊष्मा कहते हैं।'
  },

  evaporationSection: {
    titleEn: '5. Evaporation',
    titleHi: '5. वाष्पीकरण (Evaporation)',
    defTitleEn: 'DEFINITION',
    defTitleHi: 'परिभाषा (DEFINITION)',
    defEn: 'The phenomenon of change of a liquid into vapours at any temperature below its boiling point is called evaporation.',
    defHi: 'क्वथनांक से कम तापमान पर द्रव के वाष्प में परिवर्तित होने की इस प्रक्रिया को वाष्पीकरण कहते हैं।',
    factorsTitleEn: 'Factors Affecting the Rate of Evaporation:',
    factorsTitleHi: 'वाष्पीकरण की दर को प्रभावित करने वाले कारक:',
    factorsEn: [
      {
        title: '1. Surface Area',
        desc: 'Evaporation is a surface phenomenon. Increasing surface area increases the rate of evaporation (e.g. spreading clothes to dry).'
      },
      {
        title: '2. Temperature',
        desc: 'With an increase in temperature, more particles get enough kinetic energy to escape into the vapor state.'
      },
      {
        title: '3. Humidity',
        desc: 'Humidity is the amount of water vapor in air. If humidity is high, the rate of evaporation decreases.'
      },
      {
        title: '4. Wind Speed',
        desc: 'With an increase in wind speed, particles of water vapor move away with the wind, increasing evaporation.'
      }
    ],
    factorsHi: [
      {
        title: '1. सतह क्षेत्र (Surface Area)',
        desc: 'वाष्पीकरण एक सतही प्रक्रिया है। सतह क्षेत्र बढ़ने पर वाष्पीकरण की दर बढ़ जाती है (जैसे कपड़े फैलाना)।'
      },
      {
        title: '2. तापमान (Temperature)',
        desc: 'तापमान बढ़ने पर कणों को पर्याप्त गतिज ऊर्जा मिलती है जिससे वे वाष्प में जल्दी बदलते हैं।'
      },
      {
        title: '3. आर्द्रता (Humidity)',
        desc: 'हवा में उपस्थित जलवाष्प की मात्रा आर्द्रता कहलाती है। आर्द्रता अधिक होने पर वाष्पीकरण की दर घट जाती है।'
      },
      {
        title: '4. वायु की गति (Wind Speed)',
        desc: 'हवा तेज चलने से जलवाष्प के कण हवा के साथ उड़ जाते हैं, जिससे वाष्पीकरण बढ़ जाता है।'
      }
    ],
    coolingTitleEn: 'HOW EVAPORATION CAUSES COOLING',
    coolingTitleHi: 'वाष्पीकरण के कारण शीतलता क्यों होती है?',
    coolingEn: 'The particles of liquid absorb energy from the surroundings to regain the energy lost during evaporation. This absorption of heat from surroundings makes the surroundings cool (e.g. water in earthen pots, wearing cotton clothes in summer).',
    coolingHi: 'वाष्पीकरण के दौरान कम हुई ऊर्जा को पुनः प्राप्त करने के लिए द्रव के कण अपने आस-पास से ऊर्जा अवशोषित कर लेते हैं। इस अवशोषण के कारण आस-पास शीतलता आ जाती है (जैसे मिट्टी के मटके का ठंडा पानी, गर्मियों में सूती कपड़े)।'
  },

  quickRevision: {
    titleEn: '6. Quick Revision Points',
    titleHi: '6. त्वरित पुनरीक्षण (Quick Revision)',
    cardHeadingEn: 'Key Chapter Takeaways for Exam:',
    cardHeadingHi: 'परीक्षा के लिए महत्वपूर्ण बिंदु:',
    pointsEn: [
      'Matter is made up of small particles that have spaces, possess kinetic energy, and attract each other.',
      'The three states of matter are solid, liquid, and gas. They differ in molecular attraction and particle movement.',
      'States of matter are interconvertible by altering temperature and pressure conditions.',
      'Latent heat of fusion changes solid to liquid without temperature change at melting point.',
      'Evaporation is a surface phenomenon occurring below the boiling point and causes a cooling effect.'
    ],
    pointsHi: [
      'पदार्थ छोटे कणों से मिलकर बना है जिनके बीच रिक्त स्थान, गतिज ऊर्जा और आकर्षण बल होता है।',
      'पदार्थ की तीन अवस्थाएं ठोस, द्रव और गैस हैं जो आण्विक आकर्षण और कण गतिशीलता में भिन्न हैं।',
      'तापमान और दाब में परिवर्तन करके अवस्थाओं को आपस में बदला जा सकता है।',
      'संगलन की प्रसुप्त ऊष्मा बिना तापमान बढ़ाए गलनांक पर ठोस को द्रव में बदलती है।',
      'वाष्पीकरण क्वथनांक से कम तापमान पर होने वाली सतही प्रक्रिया है जो ठंडक उत्पन्न करती है।'
    ]
  },

  importantQuestions: {
    titleEn: '7. Important Questions (Demo Practice)',
    titleHi: '7. महत्वपूर्ण प्रश्न (Important Questions)',
    questions: [
      {
        id: 'q1',
        marks: '1 Mark',
        questionEn: 'Why do solids have a definite shape and fixed volume?',
        questionHi: 'ठोस पदार्थों का निश्चित आकार और निश्चित आयतन क्यों होता है?',
        answerEn: 'Solids have strong intermolecular forces of attraction and negligible intermolecular spaces between their particles, keeping their particles in fixed positions.',
        answerHi: 'ठोस के कणों के बीच अत्यधिक प्रबल अंतराआण्विक आकर्षण बल तथा नगण्य रिक्त स्थान होता है, जिसके कारण कण अपनी निश्चित स्थिति पर स्थिर रहते हैं।'
      },
      {
        id: 'q2',
        marks: '2 Marks',
        questionEn: 'Why does a desert cooler cool better on a hot dry day?',
        questionHi: 'गर्म और शुष्क दिन में डेजर्ट कूलर अधिक ठंडक क्यों प्रदान करता है?',
        answerEn: 'On a hot dry day, the temperature is high and humidity is low. Both factors increase the rate of evaporation of water. High evaporation causes higher cooling.',
        answerHi: 'गर्म और शुष्क दिन में तापमान अधिक तथा वायु में नमी (आर्द्रता) कम होती है। इन दोनों कारणों से जल के वाष्पीकरण की दर बढ़ जाती है, जिससे अधिक ठंडक मिलती है।'
      },
      {
        id: 'q3',
        marks: '3 Marks',
        questionEn: 'Convert the following temperatures: (a) 300 K to Celsius scale, (b) 25°C to Kelvin scale.',
        questionHi: 'निम्नलिखित तापमान को रूपांतरित करें: (a) 300 K को सेल्सियस में, (b) 25°C को केल्विन में।',
        answerEn: '(a) T(°C) = 300 - 273 = 27°C.\n(b) T(K) = 25 + 273 = 298 K.',
        answerHi: '(a) T(°C) = 300 - 273 = 27°C.\n(b) T(K) = 25 + 273 = 298 K.'
      },
      {
        id: 'q4',
        marks: '3 Marks',
        questionEn: 'Why do we see water droplets on the outer surface of a glass containing ice-cold water?',
        questionHi: 'बर्फ वाले ठंडे पानी से भरे गिलास की बाहरी सतह पर जल की बूंदें क्यों दिखाई देती हैं?',
        answerEn: 'Water vapor present in air comes in contact with the cold surface of the glass, loses kinetic energy, and condenses into liquid water droplets.',
        answerHi: 'वायु में उपस्थित जलवाष्प जब गिलास की ठंडी सतह के संपर्क में आती है, तो उसकी ऊर्जा कम हो जाती है और वह संघनित होकर द्रव की बूंदों के रूप में बदल जाती है।'
      }
    ]
  }
};
