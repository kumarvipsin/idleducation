
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react";
import { NotesContentRenderer } from "@/components/notes-content-renderer";
import { BookOpen } from "lucide-react";

const notesData: { [key: string]: { en: { title: string, content: string }, hi: { title: string, content: string } } } = {
  'matter-in-our-surroundings': {
    en: {
      title: 'Chapter 1: Matter in Our Surroundings',
      content: `### Matter
- Anything that occupies space and has mass is called matter.
- Early Indian philosophers classified matter in the form of five basic elements – the ‘Panch Tatva’ – air, earth, fire, sky and water.

### Physical Nature of Matter
- **Matter is made up of particles:** These particles are very small.
- **Characteristics of Particles of Matter:**
- - Particles of matter have space between them.
- - Particles of matter are continuously moving.
- - Particles of matter attract each other.

### States of Matter
- **The Solid State:**
- - Have definite shape and fixed volume.
- - The space between the particles is minimum.
- - The force of attraction between the particles is maximum.
- - The movement of the particles is minimum.
- - They are least compressible.
- **The Liquid State:**
- - Have no definite shape but have a fixed volume. They take the shape of the container.
- - The space between the particles is intermediate.
- - The force of attraction between the particles is intermediate.
- - The movement of the particles is intermediate.
- - They are slightly more compressible than solids.
- **The Gaseous State:**
- - Have no definite shape or fixed volume. They occupy the whole space of the container.
- - The space between the particles is maximum.
- - The force of attraction between the particles is minimum.
- - The movement of the particles is maximum.
- - They are highly compressible.

### Change of State of Matter
- **Effect of Change of Temperature:**
- - **Melting (Fusion):** The process in which a solid changes into a liquid. The temperature at which a solid melts to become a liquid at atmospheric pressure is called its **melting point**.
- - **Boiling:** The process in which a liquid changes into a gas. The temperature at which a liquid starts boiling at the atmospheric pressure is known as its **boiling point**.
- - **Latent Heat of Fusion:** The amount of heat energy required to change 1 kg of a solid into liquid at its melting point.
- - **Latent Heat of Vaporisation:** The amount of heat energy required to change 1 kg of a liquid into gas at its boiling point.
- - **Sublimation:** The change of state directly from solid to gas without changing into liquid state (or vice-versa). Example: Camphor, Ammonium chloride.
- **Effect of Change of Pressure:**
- - By applying pressure and reducing temperature, we can liquefy gases. Solid carbon dioxide (dry ice) is converted directly to a gaseous state on the decrease of pressure.

### Evaporation
- The phenomenon of change of a liquid into vapours at any temperature below its boiling point is called evaporation.
- **Factors Affecting Evaporation:**
- - **Surface Area:** An increase in the surface area increases the rate of evaporation.
- - **Temperature:** An increase in temperature increases the rate of evaporation.
- - **Humidity:** A decrease in humidity increases the rate of evaporation.
- - **Wind Speed:** An increase in wind speed increases the rate of evaporation.
- **Evaporation causes cooling:** The particles of liquid absorb energy from the surroundings to regain the energy lost during evaporation. This absorption of energy from the surroundings makes the surroundings cool.
`
    },
    hi: {
      title: 'अध्याय 1: हमारे आस-पास के पदार्थ',
      content: `### पदार्थ
- कोई भी वस्तु जो स्थान घेरती है और जिसमें द्रव्यमान होता है, पदार्थ कहलाती है।
- प्राचीन भारतीय दार्शनिकों ने पदार्थ को पाँच मूल तत्वों - 'पंच तत्व' - वायु, पृथ्वी, अग्नि, आकाश और जल के रूप में वर्गीकृत किया था।

### पदार्थ का भौतिक स्वरूप
- **पदार्थ कणों से मिलकर बना होता है:** ये कण बहुत छोटे होते हैं।
- **पदार्थ के कणों के अभिलाक्षणिक गुण:**
- - पदार्थ के कणों के बीच रिक्त स्थान होता है।
- - पदार्थ के कण निरंतर गतिशील होते हैं।
- - पदार्थ के कण एक-दूसरे को आकर्षित करते हैं।

### पदार्थ की अवस्थाएँ
- **ठोस अवस्था:**
- - इनका निश्चित आकार और स्थिर आयतन होता है।
- - कणों के बीच रिक्त स्थान न्यूनतम होता है।
- - कणों के बीच आकर्षण बल अधिकतम होता है।
- - कणों की गति न्यूनतम होती है।
- - वे सबसे कम संपीड्य होते हैं।
- **द्रव अवस्था:**
- - इनका कोई निश्चित आकार नहीं होता है लेकिन आयतन निश्चित होता है। वे बर्तन का आकार ले लेते हैं।
- - कणों के बीच रिक्त स्थान मध्यवर्ती होता है।
- - कणों के बीच आकर्षण बल मध्यवर्ती होता है।
- - कणों की गति मध्यवर्ती होती है।
- - वे ठोसों की तुलना में थोड़े अधिक संपीड्य होते हैं।
- **गैसीय अवस्था:**
- - इनका कोई निश्चित आकार या स्थिर आयतन नहीं होता है। वे बर्तन की पूरी जगह घेर लेते हैं।
- - कणों के बीच रिक्त स्थान अधिकतम होता है।
- - कणों के बीच आकर्षण बल न्यूनतम होता है।
- - कणों की गति अधिकतम होती है।
- - वे अत्यधिक संपीड्य होते हैं।

### पदार्थ की अवस्था में परिवर्तन
- **तापमान परिवर्तन का प्रभाव:**
- - **गलन (संलयन):** वह प्रक्रिया जिसमें कोई ठोस द्रव में बदल जाता है। वह तापमान जिस पर कोई ठोस वायुमंडलीय दाब पर पिघलकर द्रव बन जाता है, उसका **गलनांक** कहलाता है।
- - **क्वथन:** वह प्रक्रिया जिसमें कोई द्रव गैस में बदल जाता है। वह तापमान जिस पर कोई द्रव वायुमंडलीय दाब पर उबलने लगता है, उसका **क्वथनांक** कहलाता है।
- - **संलयन की प्रसुप्त ऊष्मा:** गलनांक पर 1 किलो ठोस को द्रव में बदलने के लिए आवश्यक ऊष्मा ऊर्जा की मात्रा।
- - **वाष्पीकरण की प्रसुप्त ऊष्मा:** क्वथनांक पर 1 किलो द्रव को गैस में बदलने के लिए आवश्यक ऊष्मा ऊर्जा की मात्रा।
- - **ऊर्ध्वपातन:** द्रव अवस्था में परिवर्तित हुए बिना ठोस अवस्था से सीधे गैस में बदलने की प्रक्रिया (या इसके विपरीत)। उदाहरण: कपूर, अमोनियम क्लोराइड।
- **दाब परिवर्तन का प्रभाव:**
- - दाब लगाकर और तापमान कम करके, हम गैसों को द्रवित कर सकते हैं। ठोस कार्बन डाइऑक्साइड (शुष्क बर्फ) दाब कम होने पर सीधे गैसीय अवस्था में परिवर्तित हो जाती है।

### वाष्पीकरण
- क्वथनांक से कम किसी भी तापमान पर द्रव के वाष्प में बदलने की घटना को वाष्पीकरण कहते हैं।
- **वाष्पीकरण को प्रभावित करने वाले कारक:**
- - **सतह क्षेत्र:** सतह क्षेत्र में वृद्धि से वाष्पीकरण की दर बढ़ जाती है।
- - **तापमान:** तापमान में वृद्धि से वाष्पीकरण की दर बढ़ जाती है।
- - **आर्द्रता:** आर्द्रता में कमी से वाष्पीकरण की दर बढ़ जाती है।
- - **वायु की गति:** वायु की गति में वृद्धि से वाष्पीकरण की दर बढ़ जाती है।
- **वाष्पीकरण से शीतलता होती है:** द्रव के कण वाष्पीकरण के दौरान खोई हुई ऊर्जा को पुनः प्राप्त करने के लिए आसपास से ऊर्जा अवशोषित करते हैं। आसपास से ऊर्जा के इस अवशोषण से आसपास का वातावरण ठंडा हो जाता है।
`
    }
  },
  'the-rise-of-nationalism-in-europe': {
    en: {
      title: 'Chapter 1: The Rise of Nationalism in Europe',
      content: `### The French Revolution and the Idea of the Nation
- The first clear expression of nationalism came with the French Revolution in 1789.
- **Steps taken by French revolutionaries:**
- - Introduction of ideas like *la patrie* (the fatherland) and *le citoyen* (the citizen).
- - A new French flag, the tricolour, was chosen to replace the former royal standard.
- - The Estates General was elected by the body of active citizens and renamed the National Assembly.
- - New hymns were composed, oaths taken and martyrs commemorated, all in the name of the nation.
- - A centralised administrative system was put in place and it formulated uniform laws for all citizens.
- - Internal customs duties and dues were abolished and a uniform system of weights and measures was adopted.
- - Regional dialects were discouraged and French, as it was spoken and written in Paris, became the common language of the nation.

### The Napoleonic Code (Civil Code of 1804)
- Did away with all privileges based on birth.
- Established equality before the law.
- Secured the right to property.
- Abolished the feudal system and freed peasants from serfdom and manorial dues.
- In the towns, guild restrictions were removed.
- Transport and communication systems were improved.

### The Making of Nationalism in Europe
- Before the 18th century, there were no 'nation-states' in Europe. Germany, Italy and Switzerland were divided into kingdoms, duchies and cantons whose rulers had their autonomous territories.
- **The Aristocracy and the New Middle Class:**
- - The aristocracy was the dominant class, united by a common way of life.
- - Industrialisation led to the emergence of a new working class and a middle class made up of industrialists, businessmen, and professionals.
- - It was among the educated, liberal middle classes that ideas of national unity following the abolition of aristocratic privileges gained popularity.

### Liberal Nationalism
- **Politically:** It stood for the concept of government by consent, end of autocracy and clerical privileges, a constitution and representative government through parliament.
- **Economically:** It stood for the freedom of markets and the abolition of state-imposed restrictions on the movement of goods and capital.
- - In 1834, a customs union or *zollverein* was formed at the initiative of Prussia. The union abolished tariff barriers and reduced the number of currencies from over thirty to two.

### The Age of Revolutions: 1830-1848
- **July Revolution (France, 1830):** The Bourbon kings were overthrown by liberal revolutionaries who installed a constitutional monarchy with Louis Philippe at its head.
- **Greek War of Independence (1821-1832):** Greece, which had been part of the Ottoman Empire, struggled for independence. The Treaty of Constantinople of 1832 recognised Greece as an independent nation.
- **Romanticism:** A cultural movement which sought to develop a particular form of nationalist sentiment. Romantics focused on emotions, intuition and mystical feelings. They tried to create a sense of a shared collective heritage, a common cultural past, as the basis of a nation.

### The Making of Germany and Italy
- **Germany:**
- - In 1848, the middle class tried to unite the different regions of the German confederation into a nation-state.
- - Prussia took on the leadership of the movement. Its chief minister, Otto von Bismarck, was the architect of this process.
- - Three wars over seven years with Austria, Denmark and France ended in Prussian victory and completed the process of unification.
- - In January 1871, the Prussian king, William I, was proclaimed German Emperor in a ceremony held at Versailles.
- **Italy:**
- - During the 1830s, Giuseppe Mazzini had sought to put together a coherent programme for a unitary Italian Republic and formed a secret society called Young Italy.
- - The unification of Italy was a result of the diplomatic and military efforts of Chief Minister Cavour, who led the movement. He formed a tactful diplomatic alliance with France.
- - In 1860, they marched into South Italy and the Kingdom of the Two Sicilies and succeeded in winning the support of the local peasants in order to drive out the Spanish rulers.
- - In 1861 Victor Emmanuel II was proclaimed king of united Italy.

### Visualising the Nation
- Artists in the 18th and 19th centuries represented a country as if it were a person (nation-as-personification).
- These female figures became an allegory of the nation.
- **Marianne:** The female allegory for France. She was characterised by the ideas of Liberty and the Republic – the red cap, the tricolour, the cockade.
- **Germania:** Became the allegory of the German nation. Germania wears a crown of oak leaves, as the German oak stands for heroism.

### Nationalism and Imperialism
- By the last quarter of the 19th century, nationalism became a narrow creed with limited ends.
- **The Balkans:** The most serious source of nationalist tension in Europe after 1871. It was a region of geographical and ethnic variation.
- A large part of the Balkans was under the control of the Ottoman Empire. The spread of the ideas of romantic nationalism in the Balkans together with the disintegration of the Ottoman Empire made this region very explosive.
- The Balkan peoples based their claims for independence on nationality. They used history to prove that they had once been independent but had subsequently been subjugated by foreign powers.
- The Balkan area became an area of intense conflict. The Balkan states were fiercely jealous of each other and each hoped to gain more territory at the expense of the others.
- This led to a series of wars in the region and finally the First World War.
`
    },
    hi: {
      title: 'अध्याय 1: यूरोप में राष्ट्रवाद का उदय',
      content: `### फ्रांसीसी क्रांति और राष्ट्र का विचार
- राष्ट्रवाद की पहली स्पष्ट अभिव्यक्ति 1789 में फ्रांसीसी क्रांति के साथ हुई।
- **फ्रांसीसी क्रांतिकारियों द्वारा उठाए गए कदम:**
- - *ला पैट्री* (पितृभूमि) और *ले सिटोयेन* (नागरिक) जैसे विचारों का परिचय।
- - पूर्व शाही मानक को बदलने के लिए एक नया फ्रांसीसी झंडा, तिरंगा चुना गया।
- - एस्टेट्स जनरल को सक्रिय नागरिकों के निकाय द्वारा चुना गया और इसका नाम बदलकर नेशनल असेंबली कर दिया गया।
- - राष्ट्र के नाम पर नई स्तुतियाँ रची गईं, शपथ ली गईं और शहीदों का स्मरण किया गया।
- - एक केंद्रीकृत प्रशासनिक व्यवस्था लागू की गई और इसने सभी नागरिकों के लिए एक समान कानून बनाए।
- - आंतरिक सीमा शुल्क और बकाया समाप्त कर दिए गए और भार और माप की एक समान प्रणाली अपनाई गई।
- - क्षेत्रीय बोलियों को हतोत्साहित किया गया और पेरिस में बोली और लिखी जाने वाली फ्रेंच, राष्ट्र की आम भाषा बन गई।

### नेपोलियन संहिता (1804 की नागरिक संहिता)
- जन्म पर आधारित सभी विशेषाधिकारों को समाप्त कर दिया।
- कानून के समक्ष समानता स्थापित की।
- संपत्ति का अधिकार सुरक्षित किया।
- सामंती व्यवस्था को समाप्त कर दिया और किसानों को भू-दासता और जागीरदारी शुल्कों से मुक्त कर दिया।
- कस्बों में, श्रेणी-संघों के प्रतिबंध हटा दिए गए।
- परिवहन और संचार प्रणालियों में सुधार किया गया।

### यूरोप में राष्ट्रवाद का निर्माण
- 18वीं शताब्दी से पहले, यूरोप में कोई 'राष्ट्र-राज्य' नहीं थे। जर्मनी, इटली और स्विट्जरलैंड राज्यों, डचियों और कैंटनों में विभाजित थे जिनके शासकों के अपने स्वायत्त क्षेत्र थे।
- **अभिजात वर्ग और नया मध्य वर्ग:**
- - अभिजात वर्ग एक सामान्य जीवन शैली से एकजुट, प्रमुख वर्ग था।
- - औद्योगीकरण ने एक नए मजदूर वर्ग और उद्योगपतियों, व्यापारियों और पेशेवरों से बने एक मध्य वर्ग के उद्भव का नेतृत्व किया।
- - शिक्षित, उदार मध्य वर्गों के बीच ही अभिजात वर्ग के विशेषाधिकारों की समाप्ति के बाद राष्ट्रीय एकता के विचार लोकप्रिय हुए।

### उदारवादी राष्ट्रवाद
- **राजनीतिक रूप से:** यह सहमति से सरकार की अवधारणा, निरंकुशता और लिपिकीय विशेषाधिकारों की समाप्ति, एक संविधान और संसद के माध्यम से प्रतिनिधि सरकार के लिए खड़ा था।
- **आर्थिक रूप से:** यह बाजारों की स्वतंत्रता और माल और पूंजी की आवाजाही पर राज्य द्वारा लगाए गए प्रतिबंधों को समाप्त करने के लिए खड़ा था।
- - 1834 में, प्रशिया की पहल पर एक सीमा शुल्क संघ या *ज़ोलवेरिन* का गठन किया गया। संघ ने टैरिफ बाधाओं को समाप्त कर दिया और मुद्राओं की संख्या तीस से घटाकर दो कर दी।

### क्रांतियों का युग: 1830-1848
- **जुलाई क्रांति (फ्रांस, 1830):** उदार क्रांतिकारियों द्वारा बॉर्बन राजाओं को उखाड़ फेंका गया, जिन्होंने लुई फिलिप को अपने मुखिया के रूप में एक संवैधानिक राजतंत्र स्थापित किया।
- **ग्रीक स्वतंत्रता संग्राम (1821-1832):** ग्रीस, जो ओटोमन साम्राज्य का हिस्सा था, ने स्वतंत्रता के लिए संघर्ष किया। 1832 की कॉन्स्टेंटिनोपल की संधि ने ग्रीस को एक स्वतंत्र राष्ट्र के रूप में मान्यता दी।
- **स्वच्छंदतावाद (रोमांटिसिज़्म):** एक सांस्कृतिक आंदोलन जिसने राष्ट्रवादी भावना का एक विशेष रूप विकसित करने की मांग की। स्वच्छंदतावादियों ने भावनाओं, अंतर्ज्ञान और रहस्यमय भावनाओं पर ध्यान केंद्रित किया। उन्होंने एक राष्ट्र के आधार के रूप में एक साझा सामूहिक विरासत, एक सामान्य सांस्कृतिक अतीत की भावना पैदा करने की कोशिश की।

### जर्मनी और इटली का निर्माण
- **जर्मनी:**
- - 1848 में, मध्य वर्ग ने जर्मन परिसंघ के विभिन्न क्षेत्रों को एक राष्ट्र-राज्य में एकजुट करने का प्रयास किया।
- - प्रशिया ने आंदोलन का नेतृत्व संभाला। इसके मुख्यमंत्री, ओटो वॉन बिस्मार्क, इस प्रक्रिया के वास्तुकार थे।
- - ऑस्ट्रिया, डेनमार्क और फ्रांस के साथ सात वर्षों में तीन युद्ध प्रशिया की जीत में समाप्त हुए और एकीकरण की प्रक्रिया पूरी हुई।
- - जनवरी 1871 में, प्रशिया के राजा, विलियम प्रथम को वर्साय में आयोजित एक समारोह में जर्मन सम्राट घोषित किया गया।
- **इटली:**
- - 1830 के दशक के दौरान, ग्यूसेप मैज़िनी ने एक एकात्मक इतालवी गणराज्य के लिए एक सुसंगत कार्यक्रम बनाने की मांग की थी और यंग इटली नामक एक गुप्त समाज का गठन किया था।
- - इटली का एकीकरण आंदोलन का नेतृत्व करने वाले मुख्यमंत्री कैवूर के राजनयिक और सैन्य प्रयासों का परिणाम था। उन्होंने फ्रांस के साथ एक चतुराईपूर्ण राजनयिक गठबंधन बनाया।
- - 1860 में, उन्होंने दक्षिण इटली और दो सिसिली के साम्राज्य में मार्च किया और स्पेनिश शासकों को बाहर निकालने के लिए स्थानीय किसानों का समर्थन जीतने में सफल रहे।
- - 1861 में विक्टर इमैनुएल द्वितीय को एकीकृत इटली का राजा घोषित किया गया।

### राष्ट्र की कल्पना
- 18वीं और 19वीं शताब्दी में कलाकारों ने एक देश का प्रतिनिधित्व ऐसे किया जैसे कि वह एक व्यक्ति हो (राष्ट्र-का-मानवीकरण)।
- ये महिला आकृतियाँ राष्ट्र का रूपक बन गईं।
- **मारियान:** फ्रांस के लिए महिला रूपक। उन्हें स्वतंत्रता और गणराज्य के विचारों - लाल टोपी, तिरंगा, कॉकेड द्वारा चित्रित किया गया था।
- **जर्मेनिया:** जर्मन राष्ट्र का रूपक बन गया। जर्मेनिया ओक के पत्तों का मुकुट पहनती है, क्योंकि जर्मन ओक वीरता का प्रतीक है।

### राष्ट्रवाद और साम्राज्यवाद
- 19वीं शताब्दी की अंतिम तिमाही तक, राष्ट्रवाद सीमित सिरों वाला एक संकीर्ण पंथ बन गया।
- **बाल्कन:** 1871 के बाद यूरोप में राष्ट्रवादी तनाव का सबसे गंभीर स्रोत। यह भौगोलिक और जातीय भिन्नता का एक क्षेत्र था।
- - बाल्कन का एक बड़ा हिस्सा ओटोमन साम्राज्य के नियंत्रण में था। बाल्कन में स्वच्छंदतावादी राष्ट्रवाद के विचारों के प्रसार के साथ-साथ ओटोमन साम्राज्य के विघटन ने इस क्षेत्र को बहुत विस्फोटक बना दिया।
- - बाल्कन लोगों ने राष्ट्रीयता पर स्वतंत्रता के लिए अपने दावों को आधारित किया। उन्होंने यह साबित करने के लिए इतिहास का इस्तेमाल किया कि वे कभी स्वतंत्र थे लेकिन बाद में विदेशी शक्तियों द्वारा उन्हें अधीन कर लिया गया था।
- - बाल्कन क्षेत्र तीव्र संघर्ष का क्षेत्र बन गया। बाल्कन राज्य एक-दूसरे से बहुत ईर्ष्या करते थे और प्रत्येक को दूसरों की कीमत पर अधिक क्षेत्र प्राप्त करने की उम्मीद थी।
- - इससे इस क्षेत्र में युद्धों की एक श्रृंखला हुई और अंत में प्रथम विश्व युद्ध हुआ।
`
    }
  },
  'real-numbers': {
    en: {
      title: 'Chapter 1: Real Numbers',
      content: `### Euclid's Division Lemma
- For any two given positive integers a and b, there exist unique whole numbers q and r such that **a = bq + r**, where **0 ≤ r < b**.
- Here, 'a' is the dividend, 'b' is the divisor, 'q' is the quotient, and 'r' is the remainder.
- This lemma is used to find the Highest Common Factor (HCF) of two positive integers.

### Euclid's Division Algorithm
- An algorithm is a series of well-defined steps which gives a procedure for solving a type of problem.
- It is a technique to compute the HCF of two given positive integers.
- **Steps to find HCF(a, b) where a > b:**
- - **Step 1:** Apply Euclid’s division lemma to a and b to find whole numbers q and r such that a = bq + r, 0 ≤ r < b.
- - **Step 2:** If r = 0, the HCF is b. If r ≠ 0, apply the division lemma to b and r.
- - **Step 3:** Continue the process till the remainder is zero. The divisor at this stage will be the required HCF.

### The Fundamental Theorem of Arithmetic
- Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique, apart from the order in which the prime factors occur.
- This is also known as the **Unique Prime Factorization Theorem**.
- **Example:** 36 = 2 × 2 × 3 × 3 = 2² × 3²
- The prime factorization of a natural number is unique, except for the order of its factors.

### HCF and LCM using Prime Factorization
- **HCF (Highest Common Factor):** Product of the smallest power of each common prime factor in the numbers.
- **LCM (Lowest Common Multiple):** Product of the greatest power of each prime factor involved in the numbers.
- **Important Property:** For any two positive integers a and b, **HCF(a, b) × LCM(a, b) = a × b**.

### Revisiting Irrational Numbers
- **Rational Numbers:** A number that can be written in the form p/q, where p and q are integers and q ≠ 0. Their decimal expansion is either terminating or non-terminating recurring.
- **Irrational Numbers:** A number that cannot be written in the form p/q. Their decimal expansion is non-terminating and non-recurring.
- **Example:** √2, √3, √5, π
- **Theorem:** If a prime number 'p' divides a², then 'p' also divides 'a', where 'a' is a positive integer. This theorem is used to prove the irrationality of numbers like √2.

### Decimal Expansions of Rational Numbers
- Let x be a rational number whose decimal expansion terminates. Then x can be expressed in the form p/q, where p and q are coprime, and the prime factorisation of q is of the form **2ⁿ5ᵐ**, where n, m are non-negative integers.
- Let x = p/q be a rational number, such that the prime factorisation of q is not of the form 2ⁿ5ᵐ. Then, x has a decimal expansion which is **non-terminating recurring** (repeating).
`
    },
    hi: {
      title: 'अध्याय 1: वास्तविक संख्याएँ',
      content: `### यूक्लिड की विभाजन प्रमेयिका
- दो दिए गए धनात्मक पूर्णांकों a और b के लिए, ऐसी अद्वितीय पूर्ण संख्याएँ q और r मौजूद हैं कि **a = bq + r**, जहाँ **0 ≤ r < b**।
- यहाँ, 'a' भाज्य है, 'b' भाजक है, 'q' भागफल है, और 'r' शेषफल है।
- इस प्रमेयिका का उपयोग दो धनात्मक पूर्णांकों का महत्तम समापवर्तक (HCF) ज्ञात करने के लिए किया जाता है।

### यूक्लिड की विभाजन एल्गोरिथ्म
- एक एल्गोरिथ्म सुपरिभाषित चरणों की एक श्रृंखला है जो एक प्रकार की समस्या को हल करने के लिए एक प्रक्रिया देती है।
- यह दो दिए गए धनात्मक पूर्णांकों का HCF परिकलित करने की एक तकनीक है।
- **HCF(a, b) ज्ञात करने के चरण जहाँ a > b:**
- - **चरण 1:** a और b पर यूक्लिड की विभाजन प्रमेयिका का प्रयोग करके पूर्ण संख्याएँ q और r ज्ञात करें ताकि a = bq + r, 0 ≤ r < b हो।
- - **चरण 2:** यदि r = 0 है, तो HCF b है। यदि r ≠ 0 है, तो b और r पर विभाजन प्रमेयिका का प्रयोग करें।
- - **चरण 3:** प्रक्रिया को तब तक जारी रखें जब तक शेषफल शून्य न हो जाए। इस चरण में भाजक ही आवश्यक HCF होगा।

### अंकगणित की आधारभूत प्रमेय
- प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक गुणनफल के रूप में व्यक्त (गुणनखंडित) किया जा सकता है, तथा यह गुणनखंडन अभाज्य गुणनखंडों के आने वाले क्रम के बिना अद्वितीय होता है।
- इसे **अद्वितीय अभाज्य गुणनखंडन प्रमेय** के रूप में भी जाना जाता है।
- **उदाहरण:** 36 = 2 × 2 × 3 × 3 = 2² × 3²
- एक प्राकृत संख्या का अभाज्य गुणनखंडन, उसके गुणनखंडों के क्रम को छोड़कर, अद्वितीय होता है।

### अभाज्य गुणनखंडन का उपयोग करके HCF और LCM
- **HCF (महत्तम समापवर्तक):** संख्याओं में प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की सबसे छोटी घात का गुणनफल।
- **LCM (लघुत्तम समापवर्त्य):** संख्याओं में शामिल प्रत्येक अभाज्य गुणनखंड की सबसे बड़ी घात का गुणनफल।
- **महत्वपूर्ण गुण:** किन्हीं दो धनात्मक पूर्णांकों a और b के लिए, **HCF(a, b) × LCM(a, b) = a × b**।

### अपरिमेय संख्याओं का पुनरीक्षण
- **परिमेय संख्याएँ:** एक संख्या जिसे p/q के रूप में लिखा जा सकता है, जहाँ p और q पूर्णांक हैं और q ≠ 0। उनका दशमलव प्रसार या तो सांत होता है या असांत आवर्ती।
- **अपरिमेय संख्याएँ:** एक संख्या जिसे p/q के रूप में नहीं लिखा जा सकता है। उनका दशमलव प्रसार असांत और अनावर्ती होता है।
- **उदाहरण:** √2, √3, √5, π
- **प्रमेय:** यदि एक अभाज्य संख्या 'p', a² को विभाजित करती है, तो 'p', 'a' को भी विभाजित करेगी, जहाँ 'a' एक धनात्मक पूर्णांक है। इस प्रमेय का उपयोग √2 जैसी संख्याओं की अपरिमेयता सिद्ध करने के लिए किया जाता है।

### परिमेय संख्याओं का दशमलव प्रसार
- मान लीजिए x एक परिमेय संख्या है जिसका दशमलव प्रसार सांत है। तब x को p/q के रूप में व्यक्त किया जा सकता है, जहाँ p और q सह-अभाज्य हैं, और q का अभाज्य गुणनखंडन **2ⁿ5ᵐ** के रूप का है, जहाँ n, m गैर-ऋणात्मक पूर्णांक हैं।
- मान लीजिए x = p/q एक परिमेय संख्या है, जैसे कि q का अभाज्य गुणनखंडन 2ⁿ5ᵐ के रूप का नहीं है। तब, x का एक दशमलव प्रसार होता है जो **असांत आवर्ती** (दोहराव वाला) होता है।
`
    }
  },
  'chemical-reactions-and-equations': {
    en: {
      title: 'Chapter 1: Chemical Reactions and Equations',
      content: `### Chemical Reactions
- A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.
- **Reactants:** The substances that undergo chemical change in the reaction.
- **Products:** The new substances formed during the reaction.
- **Observations that help determine a chemical reaction:**
- - Change in state
- - Change in colour
- - Evolution of a gas
- - Change in temperature

### Chemical Equations
- A chemical equation is the symbolic representation of a chemical reaction in the form of symbols and formulae.
- **Word Equation:** Magnesium + Oxygen → Magnesium oxide
- **Symbolic Equation:** 2Mg + O₂ → 2MgO

### Balanced Chemical Equations
- A balanced chemical equation has an equal number of atoms of each element on both sides of the equation.
- **Law of Conservation of Mass:** Mass can neither be created nor destroyed in a chemical reaction. Therefore, the total mass of the elements present in the products must be equal to the total mass of the elements present in the reactants.
- **Steps to Balance a Chemical Equation (Hit and Trial Method):**
- - 1. Write the word equation and then the skeletal chemical equation.
- - 2. List the number of atoms of different elements present in the unbalanced equation.
- - 3. Start balancing with the compound that contains the maximum number of atoms. It may be a reactant or a product.
- - 4. Balance the elements one by one by putting coefficients.
- - 5. Check the correctness of the balanced equation by counting the atoms of each element on both sides.
- - 6. Write symbols of the physical state of reactants and products (s for solid, l for liquid, g for gas, aq for aqueous).

### Types of Chemical Reactions
- **Combination Reaction:** A reaction in which two or more reactants combine to form a single product.
- - **Example:** CaO(s) + H₂O(l) → Ca(OH)₂(aq) (Quick lime + Water → Slaked lime)
- - Burning of coal: C(s) + O₂(g) → CO₂(g)
- **Decomposition Reaction:** A reaction in which a single reactant breaks down to give simpler products.
- - **Thermal Decomposition:** Decomposition carried out by heating.
- - - **Example:** 2FeSO₄(s) --(Heat)--> Fe₂O₃(s) + SO₂(g) + SO₃(g)
- - **Electrolytic Decomposition (Electrolysis):** Decomposition carried out by passing electricity.
- - - **Example:** 2H₂O(l) --(Electrolysis)--> 2H₂(g) + O₂(g)
- - **Photolytic Decomposition (Photolysis):** Decomposition carried out in the presence of sunlight.
- - - **Example:** 2AgCl(s) --(Sunlight)--> 2Ag(s) + Cl₂(g)
- **Displacement Reaction:** A reaction in which a more reactive element displaces a less reactive element from its compound.
- - **Example:** Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s) (Iron displaces Copper)
- **Double Displacement Reaction:** A reaction in which there is an exchange of ions between the reactants.
- - **Example:** Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)
- - **Precipitation Reaction:** Any reaction that produces a precipitate (an insoluble solid). The above example is also a precipitation reaction as BaSO₄ is a white precipitate.
- **Oxidation and Reduction (Redox Reactions):**
- - **Oxidation:** The gain of oxygen or loss of hydrogen. A substance is oxidized if it gains oxygen or loses hydrogen.
- - **Reduction:** The loss of oxygen or gain of hydrogen. A substance is reduced if it loses oxygen or gains hydrogen.
- - **Oxidizing Agent:** The substance which gives oxygen or gains hydrogen.
- - **Reducing Agent:** The substance which gains oxygen or gives hydrogen.
- - **Example:** CuO + H₂ → Cu + H₂O. Here, CuO is reduced to Cu, and H₂ is oxidized to H₂O. CuO is the oxidizing agent, and H₂ is the reducing agent.

### Effects of Oxidation in Daily Life
- **Corrosion:** The process where metals are attacked by substances around it such as moisture, acids, etc.
- - **Example:** Rusting of iron (formation of a reddish-brown coating of hydrated ferric oxide), black coating on silver, green coating on copper.
- **Rancidity:** The process of oxidation of fats and oils in food, resulting in an unpleasant smell and taste.
- - **Prevention:** It can be prevented by adding antioxidants, storing food in airtight containers, or flushing food packages with nitrogen gas.
`
    },
    hi: {
      title: 'अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण',
      content: `### रासायनिक अभिक्रियाएँ
- रासायनिक अभिक्रिया एक ऐसी प्रक्रिया है जिसमें एक या अधिक रासायनिक पदार्थ परिवर्तित होकर दूसरे रासायनिक पदार्थ बनाते हैं।
- **अभिकारक:** वे पदार्थ जो अभिक्रिया में रासायनिक परिवर्तन से गुजरते हैं।
- **उत्पाद:** अभिक्रिया के दौरान बनने वाले नए पदार्थ।
- **अवलोकन जो रासायनिक अभिक्रिया का निर्धारण करने में मदद करते हैं:**
- - अवस्था में परिवर्तन
- - रंग में परिवर्तन
- - गैस का उत्सर्जन
- - तापमान में परिवर्तन

### रासायनिक समीकरण
- रासायनिक समीकरण प्रतीकों और सूत्रों के रूप में एक रासायनिक अभिक्रिया का प्रतीकात्मक प्रतिनिधित्व है।
- **शब्द समीकरण:** मैग्नीशियम + ऑक्सीजन → मैग्नीशियम ऑक्साइड
- **प्रतीकात्मक समीकरण:** 2Mg + O₂ → 2MgO

### संतुलित रासायनिक समीकरण
- एक संतुलित रासायनिक समीकरण में समीकरण के दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की संख्या बराबर होती है।
- **द्रव्यमान संरक्षण का नियम:** किसी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण किया जा सकता है और न ही विनाश। इसलिए, उत्पादों में मौजूद तत्वों का कुल द्रव्यमान अभिकारकों में मौजूद तत्वों के कुल द्रव्यमान के बराबर होना चाहिए।
- **रासायनिक समीकरण को संतुलित करने के चरण (हिट एंड ट्रायल विधि):**
- - 1. शब्द समीकरण और फिर कंकालीय रासायनिक समीकरण लिखें।
- - 2. असंतुलित समीकरण में मौजूद विभिन्न तत्वों के परमाणुओं की संख्या को सूचीबद्ध करें।
- - 3. उस यौगिक से संतुलन शुरू करें जिसमें परमाणुओं की अधिकतम संख्या हो। यह एक अभिकारक या उत्पाद हो सकता है।
- - 4. गुणांक लगाकर एक-एक करके तत्वों को संतुलित करें।
- - 5. दोनों पक्षों में प्रत्येक तत्व के परमाणुओं की गिनती करके संतुलित समीकरण की शुद्धता की जाँच करें।
- - 6. अभिकारकों और उत्पादों की भौतिक अवस्था के प्रतीक लिखें (s ठोस के लिए, l तरल के लिए, g गैस के लिए, aq जलीय विलयन के लिए)।

### रासायनिक अभिक्रियाओं के प्रकार
- **संयोजन अभिक्रिया:** एक अभिक्रिया जिसमें दो या दो से अधिक अभिकारक मिलकर एक एकल उत्पाद बनाते हैं।
- - **उदाहरण:** CaO(s) + H₂O(l) → Ca(OH)₂(aq) (बिना बुझा चूना + पानी → बुझा हुआ चूना)
- - कोयले का दहन: C(s) + O₂(g) → CO₂(g)
- **वियोजन अभिक्रिया:** एक अभिक्रिया जिसमें एक एकल अभिकारक टूटकर सरल उत्पाद देता है।
- - **ऊष्मीय वियोजन:** गर्म करके किया गया वियोजन।
- - - **उदाहरण:** 2FeSO₄(s) --(ऊष्मा)--> Fe₂O₃(s) + SO₂(g) + SO₃(g)
- - **विद्युत-अपघटनी वियोजन (विद्युत-अपघटन):** विद्युत प्रवाहित करके किया गया वियोजन।
- - - **उदाहरण:** 2H₂O(l) --(विद्युत-अपघटन)--> 2H₂(g) + O₂(g)
- - **प्रकाशीय वियोजन (प्रकाश-अपघटन):** सूर्य के प्रकाश की उपस्थिति में किया गया वियोजन।
- - - **उदाहरण:** 2AgCl(s) --(सूर्य का प्रकाश)--> 2Ag(s) + Cl₂(g)
- **विस्थापन अभिक्रिया:** एक अभिक्रिया जिसमें एक अधिक क्रियाशील तत्व अपने यौगिक से कम क्रियाशील तत्व को विस्थापित करता है।
- - **उदाहरण:** Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s) (लोहा तांबे को विस्थापित करता है)
- **द्विविस्थापन अभिक्रिया:** एक अभिक्रिया जिसमें अभिकारकों के बीच आयनों का आदान-प्रदान होता है।
- - **उदाहरण:** Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)
- - **अवक्षेपण अभिक्रिया:** कोई भी अभिक्रिया जो एक अवक्षेप (एक अघुलनशील ठोस) उत्पन्न करती है। उपरोक्त उदाहरण भी एक अवक्षेपण अभिक्रिया है क्योंकि BaSO₄ एक सफेद अवक्षेप है।
- **उपचयन और अपचयन (रेडॉक्स अभिक्रियाएँ):**
- - **उपचयन (ऑक्सीकरण):** ऑक्सीजन का लाभ या हाइड्रोजन की हानि। यदि कोई पदार्थ ऑक्सीजन प्राप्त करता है या हाइड्रोजन खोता है तो वह उपचयित होता है।
- - **अपचयन:** ऑक्सीजन की हानि या हाइड्रोजन का लाभ। यदि कोई पदार्थ ऑक्सीजन खोता है या हाइड्रोजन प्राप्त करता है तो वह अपचयित होता है।
- - **उपचायक (ऑक्सीकारक):** वह पदार्थ जो ऑक्सीजन देता है या हाइड्रोजन प्राप्त करता है।
- - **अपचायक:** वह पदार्थ जो ऑक्सीजन प्राप्त करता है या हाइड्रोजन देता है।
- - **उदाहरण:** CuO + H₂ → Cu + H₂O। यहाँ, CuO का Cu में अपचयन होता है, और H₂ का H₂O में उपचयन होता है। CuO उपचायक है, और H₂ अपचायक है।

### दैनिक जीवन में उपचयन के प्रभाव
- **संक्षारण:** वह प्रक्रिया जिसमें धातुएँ अपने आस-पास के पदार्थों जैसे नमी, अम्ल आदि द्वारा आक्रमित होती हैं।
- - **उदाहरण:** लोहे में जंग लगना (जलयोजित फेरिक ऑक्साइड की लाल-भूरी परत का बनना), चांदी पर काली परत, तांबे पर हरी परत।
- **विकृतगंधिता:** भोजन में वसा और तेलों के उपचयन की प्रक्रिया, जिसके परिणामस्वरूप एक अप्रिय गंध और स्वाद होता है।
- - **रोकथाम:** इसे प्रतिऑक्सीकारक मिलाकर, भोजन को वायुरोधी कंटेनरों में संग्रहीत करके, या खाद्य पैकेजों को नाइट्रोजन गैस से फ्लश करके रोका जा सकता है।
`
    }
  },
    'metals-and-non-metals': {
    en: {
      title: 'Chapter 3: Metals and Non-metals',
      content: `### Physical Properties of Metals
- **Lustre:** Metals have a shining surface.
- **Hardness:** Metals are generally hard.
- **Malleability:** Some metals can be beaten into thin sheets.
- **Ductility:** The ability of metals to be drawn into thin wires.
- **Conductors of Heat and Electricity:** Metals are good conductors of heat and have high melting points. They are also good conductors of electricity.
- **Sonorous:** Metals that produce a sound on striking a hard surface are said to be sonorous.

### Physical Properties of Non-Metals
- Non-metals are either solids or gases except for bromine which is a liquid.
- Non-metals do not have lustre, are not sonorous or malleable. They are poor conductors of heat and electricity.

### Chemical Properties of Metals
- **Reaction with Air:** Metals combine with oxygen to form metal oxides. Metal oxide + Water → Metal hydroxide.
- **Reaction with Water:** Metals react with water to produce metal oxide and hydrogen gas. Metal oxide that is soluble in water dissolves in it to further form metal hydroxide.
- **Reaction with Acids:** Metal + Dilute acid → Salt + Hydrogen.
- **Reaction with Solutions of other Metal Salts:** Reactive metals can displace less reactive metals from their compounds in solution or molten form.

### The Reactivity Series
- The reactivity series is a list of metals arranged in the order of their decreasing activities.
- **K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au**

### How do Metals and Non-metals React?
- The reactivity of elements is the tendency to attain a completely filled valence shell.
- Atoms of the metals lose electrons from their valence shells to form cations.
- Atoms of the non-metals gain electrons in the valence shell to form anions.
- **Ionic Compounds:** The compounds formed by the transfer of electrons from a metal to a non-metal are known as ionic compounds or electrovalent compounds.

### Properties of Ionic Compounds
- **Physical Nature:** They are solid and hard due to the strong force of attraction between the positive and negative ions.
- **Melting and Boiling Points:** They have high melting and boiling points.
- **Solubility:** Generally soluble in water and insoluble in solvents such as kerosene, petrol, etc.
- **Conduction of Electricity:** Ionic compounds in the solid state do not conduct electricity. However, they conduct electricity in the molten state.

### Occurrence of Metals
- **Minerals:** The elements or compounds which occur naturally in the earth’s crust are known as minerals.
- **Ores:** Minerals from which metals can be extracted profitably are called ores.

### Extraction of Metals
- **Enrichment of Ores:** Removal of the gangue from ores.
- **Extracting Metals Low in the Activity Series:** By heating them in the air.
- **Extracting Metals in the Middle of the Activity Series:** By calcination or roasting.
- **Extracting Metals towards the Top of the Activity Series:** By electrolysis.

### Refining of Metals
- The most widely used method for refining impure metals is electrolytic refining.

### Corrosion
- The surface of some metals gets corroded when they are exposed to moist air for a long period of time. This is called corrosion.

### Prevention of Corrosion
- **Rusting of iron can be prevented by painting, oiling, greasing, galvanising, chrome plating, anodising or making alloys.**

### Alloys
- **Alloy:** An alloy is a homogeneous mixture of two or more metals, or a metal and a non-metal.`
    },
    hi: {
      title: 'अध्याय 3: धातु एवं अधातु',
      content: `### धातुओं के भौतिक गुणधर्म
- **धात्विक चमक:** धातुओं की सतह चमकदार होती है।
- **कठोरता:** धातुएँ सामान्यतः कठोर होती हैं।
- **आघातवर्ध्यता:** कुछ धातुओं को पीटकर पतली चादर बनाया जा सकता है।
- **तन्यता:** धातुओं को पतले तार के रूप में खींचने की क्षमता को तन्यता कहते हैं।
- **ऊष्मा तथा विद्युत के चालक:** धातुएँ ऊष्मा की सुचालक होती हैं तथा उनका गलनांक अधिक होता है। वे विद्युत की भी सुचालक होती हैं।
- **ध्वानिक:** जो धातुएँ किसी कठोर सतह से टकराने पर आवाज़ उत्पन्न करती हैं, उन्हें ध्वानिक कहते हैं।

### अधातुओं के भौतिक गुणधर्म
- अधातुएँ या तो ठोस या गैस होती हैं, सिवाय ब्रोमीन के जो एक द्रव है।
- अधातुओं में चमक नहीं होती, वे ध्वानिक या आघातवर्ध्य नहीं होती हैं। वे ऊष्मा और विद्युत की कुचालक होती हैं।

### धातुओं के रासायनिक गुणधर्म
- **वायु के साथ अभिक्रिया:** धातुएँ ऑक्सीजन के साथ मिलकर धातु ऑक्साइड बनाती हैं। धातु ऑक्साइड + जल → धातु हाइड्रॉक्साइड।
- **जल के साथ अभिक्रिया:** धातुएँ जल के साथ अभिक्रिया करके धातु ऑक्साइड और हाइड्रोजन गैस उत्पन्न करती हैं। जो धातु ऑक्साइड जल में घुलनशील होते हैं, वे उसमें घुलकर आगे धातु हाइड्रॉक्साइड बनाते हैं।
- **अम्लों के साथ अभिक्रिया:** धातु + तनु अम्ल → लवण + हाइड्रोजन।
- **अन्य धातु लवणों के विलयनों के साथ अभिक्रिया:** अभिक्रियाशील धातुएँ कम अभिक्रियाशील धातुओं को उनके यौगिकों से विलयन या गलित रूप में विस्थापित कर सकती हैं।

### सक्रियता श्रेणी
- सक्रियता श्रेणी धातुओं की एक सूची है जिसे उनकी घटती हुई गतिविधियों के क्रम में व्यवस्थित किया गया है।
- **K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au**

### धातुएँ एवं अधातुएँ कैसे अभिक्रिया करती हैं?
- तत्वों की अभिक्रियाशीलता पूरी तरह से भरे हुए संयोजकता कोश को प्राप्त करने की प्रवृत्ति है।
- धातुओं के परमाणु धनायन बनाने के लिए अपने संयोजकता कोशों से इलेक्ट्रॉन खो देते हैं।
- अधातुओं के परमाणु ऋणायन बनाने के लिए संयोजकता कोश में इलेक्ट्रॉन प्राप्त करते हैं।
- **आयनिक यौगिक:** एक धातु से एक अधातु में इलेक्ट्रॉनों के स्थानांतरण द्वारा बने यौगिकों को आयनिक यौगिक या वैद्युतसंयोजक यौगिक के रूप में जाना जाता है।

### आयनिक यौगिकों के गुणधर्म
- **भौतिक प्रकृति:** धनात्मक और ऋणात्मक आयनों के बीच मजबूत आकर्षण बल के कारण वे ठोस और कठोर होते हैं।
- **गलनांक एवं क्वथनांक:** इनके गलनांक एवं क्वथनांक उच्च होते हैं।
- **घुलनशीलता:** सामान्यतः जल में विलेय तथा केरोसिन, पेट्रोल आदि जैसे विलायकों में अविलेय।
- **विद्युत चालकता:** ठोस अवस्था में आयनिक यौगिक विद्युत का चालन नहीं करते हैं। हालाँकि, वे गलित अवस्था में विद्युत का चालन करते हैं।

### धातुओं की प्राप्ति
- **खनिज:** पृथ्वी की भूपर्पटी में प्राकृतिक रूप से पाए जाने वाले तत्वों या यौगिकों को खनिज के रूप में जाना जाता है।
- **अयस्क:** वे खनिज जिनसे धातुओं का निष्कर्षण लाभप्रद रूप से किया जा सकता है, अयस्क कहलाते हैं।

### धातुओं का निष्कर्षण
- **अयस्कों का समृद्धीकरण:** अयस्कों से गैंग को हटाना।
- **सक्रियता श्रेणी में नीचे आने वाली धातुओं का निष्कर्षण:** उन्हें हवा में गर्म करके।
- **सक्रियता श्रेणी के मध्य में स्थित धातुओं का निष्कर्षण:** निस्तापन या भर्जन द्वारा।
- **सक्रियता श्रेणी में सबसे ऊपर की धातुओं का निष्कर्षण:** विद्युत अपघटन द्वारा।

### धातुओं का परिष्करण
- अशुद्ध धातुओं के परिष्करण के लिए सबसे व्यापक रूप से उपयोग की जाने वाली विधि विद्युत अपघटनी परिष्करण है।

### संक्षारण
- कुछ धातुओं की सतह संक्षारित हो जाती है जब वे लंबे समय तक नम हवा के संपर्क में रहती हैं। इसे संक्षारण कहते हैं।

### संक्षारण से सुरक्षा
- **लोहे को जंग लगने से पेंट करके, तेल लगाकर, ग्रीस लगाकर, यशदलेपन, क्रोमियम लेपन, एनोडीकरण या मिश्रधातु बनाकर रोका जा सकता है।**

### मिश्रधातु
- **मिश्रधातु:** एक मिश्रधातु दो या दो से अधिक धातुओं, या एक धातु और एक अधातु का एक समांगी मिश्रण है।`
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto py-8 md:py-12">
          <Card className="shadow-lg border-primary/10 overflow-hidden bg-background/80 backdrop-blur-sm">
            <div className="p-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-base md:text-xl font-bold">{notes.title}</h1>
                    </div>
                </div>
            </div>
            <CardContent className="p-6 md:p-8">
                <NotesContentRenderer content={notes.content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function NotesDetailsPage({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotesContent slug={slug} />
        </Suspense>
    )
}
