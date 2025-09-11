
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation'
import { Suspense, use } from "react";
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
  'acids-bases-and-salts': {
    en: {
      title: 'Chapter 2: Acids, Bases and Salts',
      content: `### Properties of Acids and Bases
- **Acids:**
- - Have a sour taste.
- - Turn blue litmus paper red.
- - Give H⁺ ions in aqueous solution.
- - Examples: Hydrochloric acid (HCl), Sulphuric acid (H₂SO₄), Nitric acid (HNO₃), Acetic acid (CH₃COOH).
- **Bases:**
- - Have a bitter taste.
- - Turn red litmus paper blue.
- - Feel soapy to touch.
- - Give OH⁻ ions in aqueous solution.
- - Examples: Sodium hydroxide (NaOH), Potassium hydroxide (KOH), Calcium hydroxide (Ca(OH)₂).
- **Alkalis:** Bases which are soluble in water are called alkalis.

### Indicators
- **Indicators:** Substances which change their colour or odour in different types of substances.
- **Natural Indicators:** Litmus (from lichens), Turmeric.
- **Synthetic Indicators:** Methyl orange, Phenolphthalein.
- **Olfactory Indicators:** Substances which have a different odour in acidic and basic mediums. Ex: Onion, Vanilla essence.

### Chemical Properties of Acids and Bases
- **Reaction of Acids with Metals:** Acid + Metal → Salt + Hydrogen gas. (e.g., 2HCl + Zn → ZnCl₂ + H₂)
- **Reaction of Bases with Metals:** Base + Metal → Salt + Hydrogen gas. (e.g., 2NaOH + Zn → Na₂ZnO₂ + H₂)
- **Reaction of Acids with Metal Carbonates/Hydrogen Carbonates:** Acid + Metal Carbonate → Salt + Carbon dioxide + Water. (e.g., 2HCl + Na₂CO₃ → 2NaCl + CO₂ + H₂O)
- **Neutralisation Reaction:** Acid + Base → Salt + Water. (e.g., HCl + NaOH → NaCl + H₂O)
- **Reaction of Acids with Metallic Oxides:** Metallic Oxide + Acid → Salt + Water. (Metallic oxides are basic in nature).
- **Reaction of Bases with Non-metallic Oxides:** Non-metallic Oxide + Base → Salt + Water. (Non-metallic oxides are acidic in nature).

### pH Scale
- **pH Scale:** A scale for measuring hydrogen ion concentration in a solution.
- The 'p' in pH stands for 'potenz' in German, meaning power.
- pH = 7 → Neutral solution (e.g., pure water).
- pH < 7 → Acidic solution.
- pH > 7 → Basic solution.
- The strength of an acid or base depends on the number of H⁺ or OH⁻ ions produced.

### More about Salts
- **Salts:** An ionic compound formed from the neutralisation reaction of an acid and a base.
- **Family of Salts:** Salts having the same positive or negative radicals are said to belong to a family. (e.g., NaCl and KCl belong to the family of chloride salts).
- **pH of Salts:**
- - Salts of a strong acid and a strong base are neutral with pH value of 7.
- - Salts of a strong acid and a weak base are acidic with pH value less than 7.
- - Salts of a strong base and a weak acid are basic in nature, with pH value more than 7.

### Common Chemicals from Common Salt (NaCl)
- **Sodium Hydroxide (NaOH):** Produced by the electrolysis of an aqueous solution of NaCl (brine). This is called the chlor-alkali process.
- **Bleaching Powder (CaOCl₂):** Produced by the action of chlorine on dry slaked lime.
- **Baking Soda (NaHCO₃):** Sodium hydrogen carbonate. Used in baking, as an antacid, and in soda-acid fire extinguishers.
- **Washing Soda (Na₂CO₃·10H₂O):** Sodium carbonate. Used in glass, soap, and paper industries, and for removing permanent hardness of water.
- **Plaster of Paris (CaSO₄·½H₂O):** Calcium sulphate hemihydrate. On mixing with water, it changes to gypsum, a hard solid mass. Used for supporting fractured bones and for making decorative materials.`
    },
    hi: {
      title: 'अध्याय 2: अम्ल, क्षारक एवं लवण',
      content: `### अम्ल और क्षारक के गुण
- **अम्ल:**
- - स्वाद में खट्टे होते हैं।
- - नीले लिटमस पत्र को लाल कर देते हैं।
- - जलीय विलयन में H⁺ आयन देते हैं।
- - उदाहरण: हाइड्रोक्लोरिक अम्ल (HCl), सल्फ्यूरिक अम्ल (H₂SO₄), नाइट्रिक अम्ल (HNO₃), एसिटिक अम्ल (CH₃COOH)।
- **क्षारक:**
- - स्वाद में कड़वे होते हैं।
- - लाल लिटमस पत्र को नीला कर देते हैं।
- - छूने में साबुन जैसे लगते हैं।
- - जलीय विलयन में OH⁻ आयन देते हैं।
- - उदाहरण: सोडियम हाइड्रॉक्साइड (NaOH), पोटेशियम हाइड्रॉक्साइड (KOH), कैल्शियम हाइड्रॉक्साइड (Ca(OH)₂)।
- **क्षार:** जल में घुलनशील क्षारक को क्षार कहते हैं।

### सूचक
- **सूचक:** वे पदार्थ जो विभिन्न प्रकार के पदार्थों में अपना रंग या गंध बदल देते हैं।
- **प्राकृतिक सूचक:** लिटमस (लाइकेन से), हल्दी।
- **संश्लिष्ट सूचक:** मेथिल ऑरेंज, फेनोल्फथेलिन।
- **गंधीय सूचक:** वे पदार्थ जिनकी गंध अम्लीय और क्षारीय माध्यमों में भिन्न होती है। उदा: प्याज, वैनिला एसेंस।

### अम्ल और क्षारक के रासायनिक गुण
- **अम्लों की धातुओं के साथ अभिक्रिया:** अम्ल + धातु → लवण + हाइड्रोजन गैस। (उदा., 2HCl + Zn → ZnCl₂ + H₂)
- **क्षारकों की धातुओं के साथ अभिक्रिया:** क्षारक + धातु → लवण + हाइड्रोजन गैस। (उदा., 2NaOH + Zn → Na₂ZnO₂ + H₂)
- **अम्लों की धातु कार्बोनेट/हाइड्रोजन कार्बोनेट के साथ अभिक्रिया:** अम्ल + धातु कार्बोनेट → लवण + कार्बन डाइऑक्साइड + जल। (उदा., 2HCl + Na₂CO₃ → 2NaCl + CO₂ + H₂O)
- **उदासीनीकरण अभिक्रिया:** अम्ल + क्षारक → लवण + जल। (उदा., HCl + NaOH → NaCl + H₂O)
- **अम्लों की धात्विक ऑक्साइडों के साथ अभिक्रिया:** धात्विक ऑक्साइड + अम्ल → लवण + जल। (धात्विक ऑक्साइड प्रकृति में क्षारीय होते हैं)।
- **क्षारकों की अधात्विक ऑक्साइडों के साथ अभिक्रिया:** अधात्विक ऑक्साइड + क्षारक → लवण + जल। (अधात्विक ऑक्साइड प्रकृति में अम्लीय होते हैं)।

### pH स्केल
- **pH स्केल:** किसी विलयन में हाइड्रोजन आयन सांद्रता को मापने के लिए एक पैमाना।
- pH में 'p' जर्मन में 'पोटेंज़' के लिए है, जिसका अर्थ है शक्ति।
- pH = 7 → उदासीन विलयन (उदा., शुद्ध जल)।
- pH < 7 → अम्लीय विलयन।
- pH > 7 → क्षारीय विलयन।
- किसी अम्ल या क्षारक की प्रबलता उत्पन्न H⁺ या OH⁻ आयनों की संख्या पर निर्भर करती है।

### लवणों के बारे में अधिक जानकारी
- **लवण:** एक आयनिक यौगिक जो एक अम्ल और एक क्षारक की उदासीनीकरण अभिक्रिया से बनता है।
- **लवणों का परिवार:** समान धनात्मक या ऋणात्मक मूलक वाले लवणों को एक परिवार से संबंधित कहा जाता है। (उदा., NaCl और KCl क्लोराइड लवणों के परिवार से संबंधित हैं)।
- **लवणों का pH:**
- - एक प्रबल अम्ल और एक प्रबल क्षारक के लवण 7 के pH मान के साथ उदासीन होते हैं।
- - एक प्रबल अम्ल और एक दुर्बल क्षारक के लवण 7 से कम pH मान के साथ अम्लीय होते हैं।
- - एक प्रबल क्षारक और एक दुर्बल अम्ल के लवण प्रकृति में क्षारीय होते हैं, जिनका pH मान 7 से अधिक होता है।

### साधारण नमक (NaCl) से सामान्य रसायन
- **सोडियम हाइड्रॉक्साइड (NaOH):** NaCl (ब्राइन) के जलीय विलयन के विद्युत अपघटन द्वारा उत्पादित। इसे क्लोर-क्षार प्रक्रिया कहा जाता है।
- **विरंजक चूर्ण (CaOCl₂):** शुष्क बुझे हुए चूने पर क्लोरीन की क्रिया द्वारा उत्पादित।
- **बेकिंग सोडा (NaHCO₃):** सोडियम हाइड्रोजन कार्बोनेट। बेकिंग में, एक एंटासिड के रूप में, और सोडा-एसिड अग्निशामक में उपयोग किया जाता है।
- **धोने का सोडा (Na₂CO₃·10H₂O):** सोडियम कार्बोनेट। कांच, साबुन और कागज उद्योगों में, और पानी की स्थायी कठोरता को दूर करने के लिए उपयोग किया जाता है।
- **प्लास्टर ऑफ पेरिस (CaSO₄·½H₂O):** कैल्शियम सल्फेट हेमीहाइड्रेट। पानी के साथ मिलाने पर, यह जिप्सम, एक कठोर ठोस द्रव्यमान में बदल जाता है। टूटी हुई हड्डियों को सहारा देने और सजावटी सामग्री बनाने के लिए उपयोग किया जाता है।`
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
'knowing-our-numbers': {
    en: {
      title: 'Chapter 1: Knowing Our Numbers',
      content: `### Comparing Numbers
- To compare two numbers, we look at the number of digits. The number with more digits is greater.
- If the number of digits is the same, we compare the digits from the leftmost place.
- **Example:** Comparing 4875 and 3542. Both have 4 digits. The leftmost digit in 4875 is 4 and in 3542 is 3. Since 4 > 3, 4875 > 3542.

### Large Numbers
- We use commas to read and write large numbers.
- **Indian System of Numeration:** We use commas after the 3rd, 5th, and 7th digits from the right. The periods are ones, thousands, lakhs, crores.
- **Example:** 5,08,01,592 is read as 'Five crore eight lakh one thousand five hundred ninety-two'.
- **International System of Numeration:** We use commas after every 3 digits from the right. The periods are ones, thousands, millions, billions.
- **Example:** 50,801,592 is read as 'Fifty million, eight hundred one thousand, five hundred ninety-two'.

### Estimation
- Estimation is finding a number that is close enough to the right answer.
- **Rounding to the nearest tens:** Look at the ones digit. If it is 5 or more, round up. If it is less than 5, round down.
- **Example:** 58 is rounded to 60. 52 is rounded to 50.
- **Rounding to the nearest hundreds:** Look at the tens digit.
- **Example:** 648 is rounded to 600. 688 is rounded to 700.
- **Rounding to the nearest thousands:** Look at the hundreds digit.
- **Example:** 2573 is rounded to 3000. 2345 is rounded to 2000.

### Roman Numerals
- A system of numerical notation based on letters of the ancient Roman alphabet.
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.
- **Rules:**
- - A symbol is not repeated more than three times.
- - If a symbol of smaller value is written to the right of a symbol of greater value, its value gets added. (e.g., VI = 5 + 1 = 6).
- - If a symbol of smaller value is written to the left of a symbol of greater value, its value is subtracted. (e.g., IV = 5 - 1 = 4).
`
    },
    hi: {
      title: 'अध्याय 1: अपनी संख्याओं की जानकारी',
      content: `### संख्याओं की तुलना
- दो संख्याओं की तुलना करने के लिए, हम अंकों की संख्या देखते हैं। अधिक अंकों वाली संख्या बड़ी होती है।
- यदि अंकों की संख्या समान है, तो हम सबसे बाईं ओर के स्थान से अंकों की तुलना करते हैं।
- **उदाहरण:** 4875 और 3542 की तुलना। दोनों में 4 अंक हैं। 4875 में सबसे बायां अंक 4 है और 3542 में 3 है। चूँकि 4 > 3, इसलिए 4875 > 3542।

### बड़ी संख्याएँ
- हम बड़ी संख्याओं को पढ़ने और लिखने के लिए अल्पविराम का उपयोग करते हैं।
- **भारतीय संख्यांकन पद्धति:** हम दाईं ओर से तीसरे, पांचवें और सातवें अंक के बाद अल्पविराम का उपयोग करते हैं। आवर्त क्रमशः इकाई, हजार, लाख, करोड़ हैं।
- **उदाहरण:** 5,08,01,592 को 'पांच करोड़ आठ लाख एक हजार पांच सौ बानवे' पढ़ा जाता है।
- **अंतर्राष्ट्रीय संख्यांकन पद्धति:** हम दाईं ओर से प्रत्येक 3 अंकों के बाद अल्पविराम का उपयोग करते हैं। आवर्त क्रमशः इकाई, हजार, मिलियन, बिलियन हैं।
- **उदाहरण:** 50,801,592 को 'पचास मिलियन, आठ सौ एक हजार, पांच सौ बानवे' पढ़ा जाता है।

### आकलन (Estimation)
- आकलन एक ऐसी संख्या ज्ञात करना है जो सही उत्तर के काफी करीब हो।
- **निकटतम दहाई तक सन्निकटन:** इकाई अंक को देखें। यदि यह 5 या अधिक है, तो इसे बढ़ा दें। यदि यह 5 से कम है, तो इसे घटा दें।
- **उदाहरण:** 58 को 60 तक सन्निकटित किया जाता है। 52 को 50 तक सन्निकटित किया जाता है।
- **निकटतम सौ तक सन्निकटन:** दहाई अंक को देखें।
- **उदाहरण:** 648 को 600 तक सन्निकटित किया जाता है। 688 को 700 तक सन्निकटित किया जाता है।
- **निकटतम हजार तक सन्निकटन:** सौ के अंक को देखें।
- **उदाहरण:** 2573 को 3000 तक सन्निकटित किया जाता है। 2345 को 2000 तक सन्निकटित किया जाता है।

### रोमन संख्यांक
- प्राचीन रोमन वर्णमाला के अक्षरों पर आधारित एक संख्यात्मक अंकन प्रणाली।
- I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000।
- **नियम:**
- - एक प्रतीक को तीन बार से अधिक दोहराया नहीं जाता है।
- - यदि छोटे मान का प्रतीक बड़े मान के प्रतीक के दाईं ओर लिखा जाता है, तो उसका मान जुड़ जाता है (जैसे, VI = 5 + 1 = 6)।
- - यदि छोटे मान का प्रतीक बड़े मान के प्रतीक के बाईं ओर लिखा जाता है, तो उसका मान घटाया जाता है (जैसे, IV = 5 - 1 = 4)।
`
    }
  },
  'whole-numbers': {
    en: {
      title: 'Chapter 2: Whole Numbers',
      content: `### Introduction to Whole Numbers
- **Natural Numbers:** Counting numbers 1, 2, 3, 4, ... are called natural numbers.
- **Whole Numbers:** Natural numbers along with zero (0) form the collection of whole numbers. So, 0, 1, 2, 3, ... are whole numbers.
- Every natural number is a whole number, but 0 is a whole number which is not a natural number.

### The Number Line
- A number line is a visual representation of numbers on a straight line.
- To represent whole numbers, we draw a line, mark a point 0 on it. Then we mark points 1, 2, 3, ... at equal distances to the right of 0.
- **Operations on the number line:**
- - **Addition:** To add 3 and 4, start from 3 and make 4 jumps to the right. You reach 7. So, 3 + 4 = 7.
- - **Subtraction:** To subtract 5 from 7, start from 7 and make 5 jumps to the left. You reach 2. So, 7 - 5 = 2.
- - **Multiplication:** To multiply 3 by 4, start from 0, make 3 jumps of 4 units each to the right. You reach 12. So, 3 x 4 = 12.

### Properties of Whole Numbers
- **Closure Property:** Whole numbers are closed under addition and multiplication. If a and b are two whole numbers, then a + b and a × b are also whole numbers.
- **Commutative Property:** Addition and multiplication are commutative for whole numbers. a + b = b + a and a × b = b × a.
- **Associative Property:** Addition and multiplication are associative for whole numbers. (a + b) + c = a + (b + c) and (a × b) × c = a × (b × c).
- **Distributive Property of Multiplication over Addition:** a × (b + c) = (a × b) + (a × c).
- **Identity for Addition:** Zero is the additive identity. a + 0 = a.
- **Identity for Multiplication:** One is the multiplicative identity. a × 1 = a.
`
    },
    hi: {
      title: 'अध्याय 2: पूर्ण संख्याएँ',
      content: `### पूर्ण संख्याओं का परिचय
- **प्राकृत संख्याएँ:** गिनती की संख्याएँ 1, 2, 3, 4, ... प्राकृत संख्याएँ कहलाती हैं।
- **पूर्ण संख्याएँ:** प्राकृत संख्याएँ शून्य (0) के साथ मिलकर पूर्ण संख्याओं का संग्रह बनाती हैं। तो, 0, 1, 2, 3, ... पूर्ण संख्याएँ हैं।
- प्रत्येक प्राकृत संख्या एक पूर्ण संख्या है, लेकिन 0 एक पूर्ण संख्या है जो प्राकृत संख्या नहीं है।

### संख्या रेखा
- संख्या रेखा एक सीधी रेखा पर संख्याओं का एक दृश्य प्रतिनिधित्व है।
- पूर्ण संख्याओं को दर्शाने के लिए, हम एक रेखा खींचते हैं, उस पर एक बिंदु 0 अंकित करते हैं। फिर हम 0 के दाईं ओर समान दूरी पर बिंदु 1, 2, 3, ... अंकित करते हैं।
- **संख्या रेखा पर संक्रियाएँ:**
- - **योग:** 3 और 4 को जोड़ने के लिए, 3 से शुरू करें और दाईं ओर 4 छलांग लगाएं। आप 7 पर पहुँचते हैं। तो, 3 + 4 = 7।
- - **घटाव:** 7 में से 5 घटाने के लिए, 7 से शुरू करें और बाईं ओर 5 छलांग लगाएं। आप 2 पर पहुँचते हैं। तो, 7 - 5 = 2।
- - **गुणा:** 3 को 4 से गुणा करने के लिए, 0 से शुरू करें, प्रत्येक 4 इकाइयों की 3 छलांग दाईं ओर लगाएं। आप 12 पर पहुँचते हैं। तो, 3 x 4 = 12।

### पूर्ण संख्याओं के गुणधर्म
- **संवृत गुण:** पूर्ण संख्याएँ योग और गुणन के अंतर्गत संवृत होती हैं। यदि a और b दो पूर्ण संख्याएँ हैं, तो a + b और a × b भी पूर्ण संख्याएँ होंगी।
- **क्रमविनिमेय गुण:** योग और गुणन पूर्ण संख्याओं के लिए क्रमविनिमेय हैं। a + b = b + a और a × b = b × a।
- **साहचर्य गुण:** योग और गुणन पूर्ण संख्याओं के लिए साहचर्य हैं। (a + b) + c = a + (b + c) और (a × b) × c = a × (b × c)।
- **योग पर गुणन का वितरण गुण:** a × (b + c) = (a × b) + (a × c)।
- **योज्य तत्समक:** शून्य योज्य तत्समक है। a + 0 = a।
- **गुणन तत्समक:** एक गुणन तत्समक है। a × 1 = a।
`
    }
  },
  'playing-with-numbers': {
    en: {
      title: 'Chapter 3: Playing with Numbers',
      content: `### Factors and Multiples
- **Factor:** A factor of a number is an exact divisor of that number.
- **Example:** Factors of 12 are 1, 2, 3, 4, 6, and 12.
- **Multiple:** A number is a multiple of each of its factors.
- **Example:** Multiples of 3 are 3, 6, 9, 12, ...

### Prime and Composite Numbers
- **Prime Numbers:** Numbers having exactly two factors, 1 and the number itself.
- **Example:** 2, 3, 5, 7, 11, ...
- **Composite Numbers:** Numbers having more than two factors.
- **Example:** 4, 6, 8, 9, 10, ...
- **Note:** 1 is neither a prime nor a composite number.

### Tests for Divisibility of Numbers
- **Divisibility by 2:** If the ones digit is 0, 2, 4, 6, or 8.
- **Divisibility by 3:** If the sum of the digits is divisible by 3.
- **Divisibility by 4:** If the number formed by the last two digits is divisible by 4.
- **Divisibility by 5:** If the ones digit is 0 or 5.
- **Divisibility by 6:** If the number is divisible by both 2 and 3.
- **Divisibility by 8:** If the number formed by the last three digits is divisible by 8.
- **Divisibility by 9:** If the sum of the digits is divisible by 9.
- **Divisibility by 10:** If the ones digit is 0.
- **Divisibility by 11:** Find the difference between the sum of the digits at odd places (from the right) and the sum of the digits at even places. If the difference is either 0 or divisible by 11, then the number is divisible by 11.

### HCF and LCM
- **Highest Common Factor (HCF):** The HCF of two or more given numbers is the highest of their common factors.
- **Lowest Common Multiple (LCM):** The LCM of two or more given numbers is the lowest of their common multiples.
`
    },
    hi: {
      title: 'अध्याय 3: संख्याओं के साथ खेलना',
      content: `### गुणनखंड और गुणज
- **गुणनखंड:** किसी संख्या का गुणनखंड उस संख्या का एक सटीक भाजक होता है।
- **उदाहरण:** 12 के गुणनखंड 1, 2, 3, 4, 6 और 12 हैं।
- **गुणज:** एक संख्या अपने प्रत्येक गुणनखंड का एक गुणज होती है।
- **उदाहरण:** 3 के गुणज 3, 6, 9, 12, ... हैं।

### अभाज्य और भाज्य संख्याएँ
- **अभाज्य संख्याएँ:** वे संख्याएँ जिनके ठीक दो गुणनखंड होते हैं, 1 और स्वयं वह संख्या।
- **उदाहरण:** 2, 3, 5, 7, 11, ...
- **भाज्य संख्याएँ:** वे संख्याएँ जिनके दो से अधिक गुणनखंड होते हैं।
- **उदाहरण:** 4, 6, 8, 9, 10, ...
- **नोट:** 1 न तो अभाज्य संख्या है और न ही भाज्य संख्या।

### संख्याओं की विभाज्यता की जाँच
- **2 से विभाज्यता:** यदि इकाई का अंक 0, 2, 4, 6, या 8 हो।
- **3 से विभाज्यता:** यदि अंकों का योग 3 से विभाज्य हो।
- **4 से विभाज्यता:** यदि अंतिम दो अंकों से बनी संख्या 4 से विभाज्य हो।
- **5 से विभाज्यता:** यदि इकाई का अंक 0 या 5 हो।
- **6 से विभाज्यता:** यदि संख्या 2 और 3 दोनों से विभाज्य हो।
- **8 से विभाज्यता:** यदि अंतिम तीन अंकों से बनी संख्या 8 से विभाज्य हो।
- **9 से विभाज्यता:** यदि अंकों का योग 9 से विभाज्य हो।
- **10 से विभाज्यता:** यदि इकाई का अंक 0 हो।
- **11 से विभाज्यता:** विषम स्थानों (दाईं ओर से) के अंकों के योग और सम स्थानों के अंकों के योग के बीच का अंतर ज्ञात करें। यदि अंतर या तो 0 है या 11 से विभाज्य है, तो संख्या 11 से विभाज्य है।

### महत्तम समापवर्तक (HCF) और लघुत्तम समापवर्त्य (LCM)
- **महत्तम समापवर्तक (HCF):** दो या दो से अधिक दी गई संख्याओं का HCF उनके सार्व गुणनखंडों में सबसे बड़ा होता है।
- **लघुत्तम समापवर्त्य (LCM):** दो या दो से अधिक दी गई संख्याओं का LCM उनके सार्व गुणजों में सबसे छोटा होता है।
`
    }
  },
    'basic-geometrical-ideas': {
    en: {
        title: 'Chapter 4: Basic Geometrical Ideas',
        content: `### Points, Lines, and Planes
- **Point:** A point determines a location. It is usually denoted by a capital letter.
- **Line Segment:** The shortest distance between two points. It has two endpoints. A line segment joining points A and B is denoted by AB.
- **Line:** When a line segment is extended on both sides indefinitely, we get a line. It has no endpoints.
- **Ray:** A part of a line that starts at a point (called the starting point or initial point) and goes on endlessly in a specified direction.
- **Intersecting Lines:** If two lines have one common point, they are called intersecting lines.
- **Parallel Lines:** Two lines in a plane are said to be parallel if they do not meet.

### Curves
- **Curve:** Any drawing (straight or non-straight) done without lifting the pencil may be called a curve.
- **Simple Curve:** A curve that does not cross itself.
- **Open Curve:** A curve where the endpoints do not meet.
- **Closed Curve:** A curve where the endpoints meet, enclosing an area.

### Polygons
- **Polygon:** A simple closed figure made up entirely of line segments.
- **Sides:** The line segments forming a polygon.
- **Vertices:** The meeting point of a pair of sides.
- **Adjacent Sides:** Any two sides with a common endpoint.
- **Adjacent Vertices:** The endpoints of the same side.
- **Diagonals:** A line segment connecting two non-consecutive vertices of a polygon.

### Angles
- **Angle:** An angle is made up of two rays starting from a common initial point.
- **Vertex:** The common initial point.
- **Arms (or sides):** The two rays forming the angle.
- **Interior and Exterior:** An angle divides the plane into three parts: the interior of the angle, the angle itself, and the exterior of the angle.

### Triangles and Quadrilaterals
- **Triangle:** A three-sided polygon. It has 3 sides, 3 vertices, and 3 angles.
- **Quadrilateral:** A four-sided polygon. It has 4 sides, 4 vertices, and 4 angles.
`
    },
    hi: {
        title: 'अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ',
        content: `### बिंदु, रेखाएँ और तल
- **बिंदु:** एक बिंदु एक स्थान को निर्धारित करता है। इसे आमतौर पर एक बड़े अक्षर से दर्शाया जाता है।
- **रेखाखंड:** दो बिंदुओं के बीच की सबसे छोटी दूरी। इसके दो अंत बिंदु होते हैं। बिंदु A और B को मिलाने वाले रेखाखंड को AB से दर्शाया जाता है।
- **रेखा:** जब एक रेखाखंड को दोनों तरफ अनिश्चित काल तक बढ़ाया जाता है, तो हमें एक रेखा मिलती है। इसका कोई अंत बिंदु नहीं होता है।
- **किरण:** एक रेखा का वह भाग जो एक बिंदु (जिसे प्रारंभिक बिंदु कहा जाता है) से शुरू होता है और एक निर्दिष्ट दिशा में अंतहीन रूप से चलता है।
- **प्रतिच्छेदी रेखाएँ:** यदि दो रेखाओं में एक उभयनिष्ठ बिंदु होता है, तो उन्हें प्रतिच्छेदी रेखाएँ कहा जाता है।
- **समांतर रेखाएँ:** एक तल में दो रेखाएँ समांतर कहलाती हैं यदि वे मिलती नहीं हैं।

### वक्र
- **वक्र:** पेंसिल उठाए बिना किया गया कोई भी चित्र (सीधा या गैर-सीधा) वक्र कहा जा सकता है।
- **सरल वक्र:** एक वक्र जो स्वयं को नहीं काटता है।
- **खुला वक्र:** एक वक्र जहाँ अंत बिंदु नहीं मिलते हैं।
- **बंद वक्र:** एक वक्र जहाँ अंत बिंदु मिलते हैं, एक क्षेत्र को घेरते हैं।

### बहुभुज
- **बहुभुज:** पूरी तरह से रेखाखंडों से बनी एक सरल बंद आकृति।
- **भुजाएँ:** एक बहुभुज बनाने वाले रेखाखंड।
- **शीर्ष:** भुजाओं के एक जोड़े का मिलन बिंदु।
- **आसन्न भुजाएँ:** एक उभयनिष्ठ अंत बिंदु वाली कोई भी दो भुजाएँ।
- **आसन्न शीर्ष:** एक ही भुजा के अंत बिंदु।
- **विकर्ण:** एक बहुभुज के दो गैर-क्रमागत शीर्षों को मिलाने वाला एक रेखाखंड।

### कोण
- **कोण:** एक कोण एक उभयनिष्ठ प्रारंभिक बिंदु से शुरू होने वाली दो किरणों से बनता है।
- **शीर्ष:** उभयनिष्ठ प्रारंभिक बिंदु।
- **भुजाएँ:** कोण बनाने वाली दो किरणें।
- **अभ्यंतर और बहिर्भाग:** एक कोण तल को तीन भागों में विभाजित करता है: कोण का अभ्यंतर, स्वयं कोण, और कोण का बहिर्भाग।

### त्रिभुज और चतुर्भुज
- **त्रिभुज:** एक तीन भुजाओं वाला बहुभुज। इसकी 3 भुजाएँ, 3 शीर्ष और 3 कोण होते हैं।
- **चतुर्भुज:** एक चार भुजाओं वाला बहुभुज। इसकी 4 भुजाएँ, 4 शीर्ष और 4 कोण होते हैं।
`
    }
},
  'understanding-elementary-shapes': {
    en: {
        title: 'Chapter 5: Understanding Elementary Shapes',
        content: `### Measuring Line Segments
- **Comparison by Observation:** Just by looking at them. This method is not always accurate.
- **Comparison by Tracing:** Using tracing paper to compare lengths.
- **Comparison using Ruler and a Divider:** A ruler measures length in cm and mm. A divider is used to compare lengths more accurately than just using a ruler.

### Angles - Right and Straight
- **Right Angle:** An angle that measures exactly 90°. It is like a corner of a square.
- **Straight Angle:** An angle that measures exactly 180°. It forms a straight line.
- **Complete Angle:** An angle that measures 360°. It represents a full turn.

### Angles - Acute, Obtuse and Reflex
- **Acute Angle:** An angle that is less than a right angle (less than 90°).
- **Obtuse Angle:** An angle that is greater than a right angle but less than a straight angle (between 90° and 180°).
- **Reflex Angle:** An angle that is greater than a straight angle (more than 180° but less than 360°).

### Triangles
- **Naming triangles based on sides:**
- - **Scalene Triangle:** A triangle with all three sides of different lengths.
- - **Isosceles Triangle:** A triangle with two sides of equal length.
- - **Equilateral Triangle:** A triangle with all three sides of equal length.
- **Naming triangles based on angles:**
- - **Acute Angled Triangle:** A triangle where all angles are acute.
- - **Right Angled Triangle:** A triangle with one right angle.
- - **Obtuse Angled Triangle:** A triangle with one obtuse angle.

### Quadrilaterals
- **Rectangle:** A quadrilateral with opposite sides equal and all angles right angles.
- **Square:** A rectangle with all four sides equal.
- **Parallelogram:** A quadrilateral with opposite sides parallel.
- **Rhombus:** A parallelogram with all four sides of equal length.
- **Trapezium:** A quadrilateral with one pair of parallel sides.
`
    },
    hi: {
        title: 'अध्याय 5: प्रारंभिक आकारों को समझना',
        content: `### रेखाखंडों को मापना
- **अवलोकन द्वारा तुलना:** केवल उन्हें देखकर। यह विधि हमेशा सटीक नहीं होती है।
- **अनुरेखण द्वारा तुलना:** लंबाइयों की तुलना करने के लिए ट्रेसिंग पेपर का उपयोग करना।
- **रूलर और डिवाइडर का उपयोग करके तुलना:** एक रूलर सेमी और मिमी में लंबाई मापता है। केवल रूलर का उपयोग करने की तुलना में लंबाइयों की अधिक सटीक तुलना करने के लिए एक डिवाइडर का उपयोग किया जाता है।

### कोण - समकोण और ऋजु कोण
- **समकोण:** एक कोण जो ठीक 90° का होता है। यह एक वर्ग के कोने जैसा होता है।
- **ऋजु कोण:** एक कोण जो ठीक 180° का होता है। यह एक सीधी रेखा बनाता है।
- **संपूर्ण कोण:** एक कोण जो 360° का होता है। यह एक पूर्ण घुमाव को दर्शाता है।

### कोण - न्यून, अधिक और प्रतिवर्ती
- **न्यून कोण:** एक कोण जो समकोण से कम होता है (90° से कम)।
- **अधिक कोण:** एक कोण जो समकोण से बड़ा लेकिन ऋजु कोण से कम होता है (90° और 180° के बीच)।
- **प्रतिवर्ती कोण:** एक कोण जो ऋजु कोण से बड़ा होता है (180° से अधिक लेकिन 360° से कम)।

### त्रिभुज
- **भुजाओं के आधार पर त्रिभुजों का नामकरण:**
- - **विषमबाहु त्रिभुज:** एक त्रिभुज जिसकी तीनों भुजाएँ अलग-अलग लंबाई की होती हैं।
- - **समद्विबाहु त्रिभुज:** एक त्रिभुज जिसकी दो भुजाएँ समान लंबाई की होती हैं।
- - **समबाहु त्रिभुज:** एक त्रिभुज जिसकी तीनों भुजाएँ समान लंबाई की होती हैं।
- **कोणों के आधार पर त्रिभुजों का नामकरण:**
- - **न्यून कोण त्रिभुज:** एक त्रिभुज जहाँ सभी कोण न्यून होते हैं।
- - **समकोण त्रिभुज:** एक समकोण वाला त्रिभुज।
- - **अधिक कोण त्रिभुज:** एक अधिक कोण वाला त्रिभुज।

### चतुर्भुज
- **आयत:** एक चतुर्भुज जिसकी सम्मुख भुजाएँ बराबर और सभी कोण समकोण होते हैं।
- **वर्ग:** एक आयत जिसकी चारों भुजाएँ बराबर होती हैं।
- **समांतर चतुर्भुज:** एक चतुर्भुज जिसकी सम्मुख भुजाएँ समांतर होती हैं।
- **समचतुर्भुज:** एक समांतर चतुर्भुज जिसकी चारों भुजाएँ समान लंबाई की होती हैं।
- **समलंब:** एक चतुर्भुज जिसकी समांतर भुजाओं का एक युग्म होता है।
`
    }
},
  'integers': {
    en: {
        title: 'Chapter 6: Integers',
        content: `### What are Integers?
- Integers are a collection of whole numbers and their negative counterparts.
- The set of integers is denoted by Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}.
- **Positive Integers:** 1, 2, 3, ...
- **Negative Integers:** -1, -2, -3, ...
- **Zero (0)** is an integer that is neither positive nor negative.

### Integers on a Number Line
- We can represent integers on a number line.
- Positive integers are to the right of 0, and negative integers are to the left of 0.
- As we move to the right on the number line, the value of the integer increases.
- As we move to the left, the value of the integer decreases.
- **Example:** -3 < -1, and 2 > -5.

### Addition of Integers
- **Adding two positive integers:** Add them like whole numbers. Ex: (+3) + (+4) = 7.
- **Adding two negative integers:** Add their absolute values and put a negative sign. Ex: (-3) + (-4) = -7.
- **Adding a positive and a negative integer:** Find the difference between their absolute values and take the sign of the integer with the greater absolute value. Ex: (-7) + (+4) = -3. Ex: (+7) + (-4) = 3.

### Subtraction of Integers
- To subtract an integer from another integer, we add the additive inverse (opposite) of the integer that is being subtracted.
- **Additive Inverse:** The additive inverse of an integer 'a' is '-a'. The sum of an integer and its additive inverse is 0.
- **Example:** To subtract 5 from 3, we do 3 - 5. This is the same as 3 + (-5), which equals -2.
- **Example:** To subtract (-5) from 3, we do 3 - (-5). This is the same as 3 + 5, which equals 8.
`
    },
    hi: {
        title: 'अध्याय 6: पूर्णांक',
        content: `### पूर्णांक क्या हैं?
- पूर्णांक पूर्ण संख्याओं और उनके ऋणात्मक समकक्षों का एक संग्रह है।
- पूर्णांकों के समुच्चय को Z = {..., -3, -2, -1, 0, 1, 2, 3, ...} से दर्शाया जाता है।
- **धनात्मक पूर्णांक:** 1, 2, 3, ...
- **ऋणात्मक पूर्णांक:** -1, -2, -3, ...
- **शून्य (0)** एक पूर्णांक है जो न तो धनात्मक है और न ही ऋणात्मक।

### संख्या रेखा पर पूर्णांक
- हम संख्या रेखा पर पूर्णांकों को दर्शा सकते हैं।
- धनात्मक पूर्णांक 0 के दाईं ओर होते हैं, और ऋणात्मक पूर्णांक 0 के बाईं ओर होते हैं।
- जैसे-जैसे हम संख्या रेखा पर दाईं ओर बढ़ते हैं, पूर्णांक का मान बढ़ता है।
- जैसे-जैसे हम बाईं ओर बढ़ते हैं, पूर्णांक का मान घटता है।
- **उदाहरण:** -3 < -1, और 2 > -5।

### पूर्णांकों का योग
- **दो धनात्मक पूर्णांकों को जोड़ना:** उन्हें पूर्ण संख्याओं की तरह जोड़ें। उदा: (+3) + (+4) = 7।
- **दो ऋणात्मक पूर्णांकों को जोड़ना:** उनके निरपेक्ष मानों को जोड़ें और एक ऋणात्मक चिह्न लगाएं। उदा: (-3) + (-4) = -7।
- **एक धनात्मक और एक ऋणात्मक पूर्णांक को जोड़ना:** उनके निरपेक्ष मानों के बीच का अंतर ज्ञात करें और बड़े निरपेक्ष मान वाले पूर्णांक का चिह्न लें। उदा: (-7) + (+4) = -3। उदा: (+7) + (-4) = 3।

### पूर्णांकों का घटाव
- एक पूर्णांक से दूसरे पूर्णांक को घटाने के लिए, हम उस पूर्णांक का योज्य प्रतिलोम (विपरीत) जोड़ते हैं जिसे घटाया जा रहा है।
- **योज्य प्रतिलोम:** एक पूर्णांक 'a' का योज्य प्रतिलोम '-a' है। एक पूर्णांक और उसके योज्य प्रतिलोम का योग 0 होता है।
- **उदाहरण:** 3 में से 5 घटाने के लिए, हम 3 - 5 करते हैं। यह 3 + (-5) के समान है, जो -2 के बराबर है।
- **उदाहरण:** 3 में से (-5) घटाने के लिए, हम 3 - (-5) करते हैं। यह 3 + 5 के समान है, जो 8 के बराबर है।
`
    }
},
  'fractions': {
    en: {
        title: 'Chapter 7: Fractions',
        content: `### What is a Fraction?
- A fraction is a number representing a part of a whole.
- It is written as a/b, where 'a' is the numerator and 'b' is the denominator. The denominator cannot be zero.

### Types of Fractions
- **Proper Fraction:** A fraction where the numerator is less than the denominator. It represents a part less than a whole. Ex: 1/2, 3/4.
- **Improper Fraction:** A fraction where the numerator is greater than or equal to the denominator. It represents a whole and a part. Ex: 5/4, 7/3.
- **Mixed Fraction:** An improper fraction can be written as a combination of a whole and a proper fraction. Ex: 5/4 can be written as 1 1/4.

### Equivalent Fractions
- Fractions that represent the same value.
- To find an equivalent fraction, you can multiply or divide both the numerator and the denominator by the same non-zero number.
- **Example:** 1/2 is equivalent to 2/4, 3/6, etc.

### Comparing Fractions
- **Like Fractions (same denominator):** The fraction with the greater numerator is greater. Ex: 5/7 > 3/7.
- **Unlike Fractions (different denominators):** Convert them into like fractions by finding the LCM of the denominators. Then compare.
- **Example:** To compare 2/3 and 3/4. LCM of 3 and 4 is 12. 2/3 = 8/12 and 3/4 = 9/12. Since 9/12 > 8/12, then 3/4 > 2/3.

### Operations on Fractions
- **Addition/Subtraction of Like Fractions:** Add/subtract the numerators and keep the denominator the same.
- **Addition/Subtraction of Unlike Fractions:** First, convert them to like fractions, then add/subtract.
`
    },
    hi: {
        title: 'अध्याय 7: भिन्न',
        content: `### भिन्न क्या है?
- भिन्न एक संख्या है जो एक पूर्ण के एक हिस्से का प्रतिनिधित्व करती है।
- इसे a/b के रूप में लिखा जाता है, जहाँ 'a' अंश है और 'b' हर है। हर शून्य नहीं हो सकता।

### भिन्न के प्रकार
- **उचित भिन्न:** एक भिन्न जहाँ अंश हर से कम होता है। यह एक पूर्ण से कम हिस्से का प्रतिनिधित्व करता है। उदा: 1/2, 3/4।
- **विषम भिन्न:** एक भिन्न जहाँ अंश हर से बड़ा या बराबर होता है। यह एक पूर्ण और एक हिस्से का प्रतिनिधित्व करता है। उदा: 5/4, 7/3।
- **मिश्रित भिन्न:** एक विषम भिन्न को एक पूर्ण और एक उचित भिन्न के संयोजन के रूप में लिखा जा सकता है। उदा: 5/4 को 1 1/4 के रूप में लिखा जा सकता है।

### तुल्य भिन्न
- वे भिन्न जो समान मान का प्रतिनिधित्व करती हैं।
- एक तुल्य भिन्न खोजने के लिए, आप अंश और हर दोनों को समान गैर-शून्य संख्या से गुणा या भाग कर सकते हैं।
- **उदाहरण:** 1/2, 2/4, 3/6, आदि के तुल्य है।

### भिन्नों की तुलना
- **समान भिन्न (समान हर):** बड़े अंश वाली भिन्न बड़ी होती है। उदा: 5/7 > 3/7।
- **असमान भिन्न (अलग-अलग हर):** हरों का LCM ज्ञात करके उन्हें समान भिन्नों में बदलें। फिर तुलना करें।
- **उदाहरण:** 2/3 और 3/4 की तुलना करने के लिए। 3 और 4 का LCM 12 है। 2/3 = 8/12 और 3/4 = 9/12। चूँकि 9/12 > 8/12, तो 3/4 > 2/3।

### भिन्नों पर संक्रियाएँ
- **समान भिन्नों का योग/घटाव:** अंशों को जोड़ें/घटाएँ और हर को वही रखें।
- **असमान भिन्नों का योग/घटाव:** पहले, उन्हें समान भिन्नों में बदलें, फिर जोड़ें/घटाएँ।
`
    }
},
  'decimals': {
    en: {
        title: 'Chapter 8: Decimals',
        content: `### Understanding Decimals
- Decimals are a way of writing numbers that are not whole numbers. They are another way to write fractions.
- The dot in a decimal number is called a decimal point.
- **Place Value:** The place value of digits to the right of the decimal point are tenths (1/10), hundredths (1/100), thousandths (1/1000), and so on.
- **Example:** In 23.456, 4 is in the tenths place, 5 is in the hundredths place, and 6 is in the thousandths place.

### Comparing Decimals
- To compare decimals, first compare the whole number part.
- If the whole number parts are equal, compare the tenths digits.
- If the tenths digits are also equal, compare the hundredths digits, and so on.
- **Example:** 12.5 > 12.45 because the tenths digit 5 is greater than 4.

### Using Decimals
- **Money:** We use decimals to represent money. For example, ₹5 and 50 paise is written as ₹5.50.
- **Length:** We use decimals to represent length. For example, 5 cm 3 mm = 5.3 cm. (Since 10 mm = 1 cm).
- **Weight:** We use decimals to represent weight. For example, 2 kg 500 g = 2.5 kg. (Since 1000 g = 1 kg).

### Addition and Subtraction of Decimals
- To add or subtract decimals, write the numbers one below the other with the decimal points lined up.
- Add or subtract as you would with whole numbers.
- Place the decimal point in the answer directly below the decimal points in the numbers being added or subtracted.
- **Example:** 21.36 + 37.35.
-   21.36
- + 37.35
- --------
-   58.71
`
    },
    hi: {
        title: 'अध्याय 8: दशमलव',
        content: `### दशमलव को समझना
- दशमलव उन संख्याओं को लिखने का एक तरीका है जो पूर्ण संख्याएँ नहीं हैं। वे भिन्न लिखने का एक और तरीका हैं।
- दशमलव संख्या में बिंदु को दशमलव बिंदु कहा जाता है।
- **स्थानीय मान:** दशमलव बिंदु के दाईं ओर के अंकों का स्थानीय मान दशांश (1/10), शतांश (1/100), सहस्रांश (1/1000), आदि है।
- **उदाहरण:** 23.456 में, 4 दशांश स्थान पर है, 5 शतांश स्थान पर है, और 6 सहस्रांश स्थान पर है।

### दशमलव की तुलना
- दशमलव की तुलना करने के लिए, पहले पूर्ण संख्या भाग की तुलना करें।
- यदि पूर्ण संख्या भाग बराबर हैं, तो दशांश अंकों की तुलना करें।
- यदि दशांश अंक भी बराबर हैं, तो शतांश अंकों की तुलना करें, और इसी तरह आगे।
- **उदाहरण:** 12.5 > 12.45 क्योंकि दशांश अंक 5, 4 से बड़ा है।

### दशमलव का उपयोग
- **धन:** हम धन का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, ₹5 और 50 पैसे को ₹5.50 लिखा जाता है।
- **लंबाई:** हम लंबाई का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, 5 सेमी 3 मिमी = 5.3 सेमी। (चूंकि 10 मिमी = 1 सेमी)।
- **वजन:** हम वजन का प्रतिनिधित्व करने के लिए दशमलव का उपयोग करते हैं। उदाहरण के लिए, 2 किलो 500 ग्राम = 2.5 किलो। (चूंकि 1000 ग्राम = 1 किलो)।

### दशमलव का योग और घटाव
- दशमलव को जोड़ने या घटाने के लिए, संख्याओं को एक के नीचे एक लिखें और दशमलव बिंदुओं को एक सीध में रखें।
- जैसे आप पूर्ण संख्याओं के साथ करते हैं वैसे ही जोड़ें या घटाएँ।
- उत्तर में दशमलव बिंदु को सीधे जोड़ी या घटाई जा रही संख्याओं के दशमलव बिंदुओं के नीचे रखें।
- **उदाहरण:** 21.36 + 37.35।
-   21.36
- + 37.35
- --------
-   58.71
`
    }
},
  'data-handling': {
    en: {
        title: 'Chapter 9: Data Handling',
        content: `### Introduction to Data
- **Data:** A collection of numbers gathered to give some information.
- **Recording Data:** We need to organize data to draw meaningful inferences. We can use a frequency distribution table.
- **Tally Marks:** A quick way to keep track of numbers in groups of five. The fifth tally mark is a diagonal line across the first four.

### Pictograph
- A pictograph represents data through pictures of objects.
- It helps answer the questions on the data at a glance.
- A key or scale must be provided to understand the pictograph. For example, one symbol might represent 10 items.

### Bar Graph
- A bar graph is a display of information using bars of uniform width, their heights being proportional to the respective values.
- **Drawing a Bar Graph:**
- - Draw two perpendicular lines: one horizontal (x-axis) and one vertical (y-axis).
- - Along the horizontal axis, choose a uniform width for bars and a uniform gap between them.
- - Choose a suitable scale to determine the heights of the bars along the vertical axis.
- **Interpreting a Bar Graph:** A bar graph can be used to compare quantities easily.
`
    },
    hi: {
        title: 'अध्याय 9: आँकड़ों का प्रबंधन',
        content: `### आँकड़ों का परिचय
- **आँकड़े:** कुछ जानकारी देने के लिए एकत्रित की गई संख्याओं का एक संग्रह।
- **आँकड़ों को रिकॉर्ड करना:** सार्थक निष्कर्ष निकालने के लिए हमें आँकड़ों को व्यवस्थित करने की आवश्यकता है। हम एक बारंबारता बंटन सारणी का उपयोग कर सकते हैं।
- **मिलान चिह्न:** पाँच के समूहों में संख्याओं का हिसाब रखने का एक त्वरित तरीका। पाँचवाँ मिलान चिह्न पहले चार पर एक विकर्ण रेखा होती है।

### चित्रालेख
- एक चित्रालेख वस्तुओं के चित्रों के माध्यम से आँकड़ों का प्रतिनिधित्व करता है।
- यह एक नज़र में आँकड़ों पर प्रश्नों का उत्तर देने में मदद करता है।
- चित्रालेख को समझने के लिए एक कुंजी या पैमाना प्रदान किया जाना चाहिए। उदाहरण के लिए, एक प्रतीक 10 वस्तुओं का प्रतिनिधित्व कर सकता है।

### दंड आलेख
- एक दंड आलेख एक समान चौड़ाई के दंडों का उपयोग करके जानकारी का एक प्रदर्शन है, जिनकी ऊँचाई संबंधित मानों के समानुपाती होती है।
- **एक दंड आलेख बनाना:**
- - दो लंबवत रेखाएँ खींचें: एक क्षैतिज (x-अक्ष) और एक ऊर्ध्वाधर (y-अक्ष)।
- - क्षैतिज अक्ष के साथ, दंडों के लिए एक समान चौड़ाई और उनके बीच एक समान अंतर चुनें।
- - ऊर्ध्वाधर अक्ष के साथ दंडों की ऊँचाई निर्धारित करने के लिए एक उपयुक्त पैमाना चुनें।
- **एक दंड आलेख की व्याख्या:** एक दंड आलेख का उपयोग मात्राओं की आसानी से तुलना करने के लिए किया जा सकता है।
`
    }
},
  'mensuration': {
    en: {
        title: 'Chapter 10: Mensuration',
        content: `### Perimeter
- **Perimeter:** The distance around a closed figure.
- **Perimeter of a Rectangle:** 2 × (length + breadth).
- **Perimeter of a Square:** 4 × length of a side.
- **Perimeter of an Equilateral Triangle:** 3 × length of a side.

### Area
- **Area:** The amount of surface enclosed by a closed figure.
- **Area of a Rectangle:** length × breadth.
- **Area of a Square:** side × side.
- **Units:** Area is measured in square units, like square centimeters (cm²) or square meters (m²).

### Finding Area of Irregular Shapes
- We can find the area of an irregular shape by placing it on a squared paper.
- **Method:**
- - Count the number of full squares enclosed.
- - Count the number of half squares enclosed.
- - Count the number of squares more than half enclosed.
- - Ignore the squares less than half enclosed.
- - The approximate area is the sum of the counts from the first three steps.
`
    },
    hi: {
        title: 'अध्याय 10: क्षेत्रमिति',
        content: `### परिमाप
- **परिमाप:** एक बंद आकृति के चारों ओर की दूरी।
- **आयत का परिमाप:** 2 × (लंबाई + चौड़ाई)।
- **वर्ग का परिमाप:** 4 × एक भुजा की लंबाई।
- **समबाहु त्रिभुज का परिमाप:** 3 × एक भुजा की लंबाई।

### क्षेत्रफल
- **क्षेत्रफल:** एक बंद आकृति द्वारा घेरी गई सतह की मात्रा।
- **आयत का क्षेत्रफल:** लंबाई × चौड़ाई।
- **वर्ग का क्षेत्रफल:** भुजा × भुजा।
- **इकाइयाँ:** क्षेत्रफल को वर्ग इकाइयों में मापा जाता है, जैसे वर्ग सेंटीमीटर (cm²) या वर्ग मीटर (m²)।

### अनियमित आकृतियों का क्षेत्रफल ज्ञात करना
- हम एक अनियमित आकृति को एक वर्गांकित कागज पर रखकर उसका क्षेत्रफल ज्ञात कर सकते हैं।
- **विधि:**
- - घेरे गए पूर्ण वर्गों की संख्या गिनें।
- - घेरे गए आधे वर्गों की संख्या गिनें।
- - आधे से अधिक घेरे गए वर्गों की संख्या गिनें।
- - आधे से कम घेरे गए वर्गों को अनदेखा करें।
- - अनुमानित क्षेत्रफल पहले तीन चरणों की गिनती का योग है।
`
    }
},
  'algebra': {
    en: {
        title: 'Chapter 11: Algebra',
        content: `### Introduction to Algebra
- Algebra is a branch of mathematics that uses letters to represent numbers.
- **Variable:** A letter that can take various values. Its value is not fixed. Variables are usually represented by letters like x, y, z, a, b, etc.
- **Constant:** A value that does not change. Ex: 5, -10, 2/3.

### Expressions
- **Expression:** A combination of constants, variables, and operations (+, -, ×, ÷).
- **Example:** 2x + 5 is an expression.
- Expressions are formed by performing operations on variables and constants. For example, the expression 4xy + 7 is formed from variables x and y and constants 4 and 7.

### Equations
- **Equation:** A statement that two expressions are equal. It has an equal sign (=).
- **Example:** 2x + 5 = 15 is an equation.
- An equation has two sides: the Left Hand Side (LHS) and the Right Hand Side (RHS).
- **Solution of an Equation:** A value of the variable which makes the equation a true statement.
- **Solving an Equation:** Finding the solution. We can use trial-and-error method or systematic methods like balancing.
`
    },
    hi: {
        title: 'अध्याय 11: बीजगणित',
        content: `### बीजगणित का परिचय
- बीजगणित गणित की एक शाखा है जो संख्याओं का प्रतिनिधित्व करने के लिए अक्षरों का उपयोग करती है।
- **चर:** एक अक्षर जो विभिन्न मान ले सकता है। इसका मान निश्चित नहीं होता है। चरों को आमतौर पर x, y, z, a, b, आदि जैसे अक्षरों से दर्शाया जाता है।
- **अचर:** एक मान जो बदलता नहीं है। उदा: 5, -10, 2/3।

### व्यंजक
- **व्यंजक:** अचरों, चरों और संक्रियाओं (+, -, ×, ÷) का एक संयोजन।
- **उदाहरण:** 2x + 5 एक व्यंजक है।
- व्यंजक चरों और अचरों पर संक्रियाएँ करके बनाए जाते हैं। उदाहरण के लिए, व्यंजक 4xy + 7 चर x और y और अचर 4 और 7 से बना है।

### समीकरण
- **समीकरण:** एक कथन कि दो व्यंजक बराबर हैं। इसमें एक बराबर का चिह्न (=) होता है।
- **उदाहरण:** 2x + 5 = 15 एक समीकरण है।
- एक समीकरण के दो पक्ष होते हैं: बायाँ पक्ष (LHS) और दायाँ पक्ष (RHS)।
- **समीकरण का हल:** चर का एक मान जो समीकरण को एक सत्य कथन बनाता है।
- **समीकरण को हल करना:** हल खोजना। हम प्रयत्न और भूल विधि या संतुलन जैसी व्यवस्थित विधियों का उपयोग कर सकते हैं।
`
    }
},
  'ratio-and-proportion': {
    en: {
        title: 'Chapter 12: Ratio and Proportion',
        content: `### Ratio
- **Ratio:** A way of comparing two quantities of the same kind by division.
- The ratio of a to b is written as a : b or a/b.
- The two quantities in a ratio must have the same units.
- A ratio is in its simplest form if the two terms have no common factor other than 1.
- **Example:** The ratio of 20 cm to 100 cm is 20:100, which simplifies to 1:5.

### Proportion
- **Proportion:** A statement that two ratios are equal.
- If two ratios a:b and c:d are equal, we say that a, b, c, d are in proportion. This is written as a : b :: c : d.
- **Terms:** 'a' and 'd' are called the extreme terms. 'b' and 'c' are called the middle terms.
- **Rule of Proportion:** If four numbers are in proportion, then Product of extremes = Product of means. So, a × d = b × c.
- **Example:** Are 1, 2, 3, 6 in proportion? Product of extremes = 1 × 6 = 6. Product of means = 2 × 3 = 6. Since they are equal, the numbers are in proportion.

### Unitary Method
- The method in which we first find the value of one unit and then the value of the required number of units is called the unitary method.
- **Example:** If the cost of 6 pens is ₹30, what is the cost of 10 pens?
- - Cost of 6 pens = ₹30
- - Cost of 1 pen = ₹30 / 6 = ₹5
- - Cost of 10 pens = ₹5 × 10 = ₹50.
`
    },
    hi: {
        title: 'अध्याय 12: अनुपात और समानुपात',
        content: `### अनुपात
- **अनुपात:** एक ही प्रकार की दो मात्राओं की विभाजन द्वारा तुलना करने का एक तरीका।
- a का b से अनुपात a : b या a/b के रूप में लिखा जाता है।
- अनुपात में दोनों मात्राओं की इकाइयाँ समान होनी चाहिए।
- एक अनुपात अपने सरलतम रूप में होता है यदि दोनों पदों का 1 के अलावा कोई उभयनिष्ठ गुणनखंड न हो।
- **उदाहरण:** 20 सेमी का 100 सेमी से अनुपात 20:100 है, जो सरल होकर 1:5 हो जाता है।

### समानुपात
- **समानुपात:** एक कथन कि दो अनुपात बराबर हैं।
- यदि दो अनुपात a:b और c:d बराबर हैं, तो हम कहते हैं कि a, b, c, d समानुपात में हैं। इसे a : b :: c : d के रूप में लिखा जाता है।
- **पद:** 'a' और 'd' को चरम पद कहा जाता है। 'b' और 'c' को मध्य पद कहा जाता है।
- **समानुपात का नियम:** यदि चार संख्याएँ समानुपात में हैं, तो चरम पदों का गुणनफल = मध्य पदों का गुणनफल। तो, a × d = b × c।
- **उदाहरण:** क्या 1, 2, 3, 6 समानुपात में हैं? चरम पदों का गुणनफल = 1 × 6 = 6। मध्य पदों का गुणनफल = 2 × 3 = 6। चूँकि वे बराबर हैं, संख्याएँ समानुपात में हैं।

### ऐकिक विधि
- वह विधि जिसमें हम पहले एक इकाई का मान ज्ञात करते हैं और फिर आवश्यक संख्या में इकाइयों का मान ज्ञात करते हैं, ऐकिक विधि कहलाती है।
- **उदाहरण:** यदि 6 पेनों की कीमत ₹30 है, तो 10 पेनों की कीमत क्या है?
- - 6 पेनों की कीमत = ₹30
- - 1 पेन की कीमत = ₹30 / 6 = ₹5
- - 10 पेनों की कीमत = ₹5 × 10 = ₹50।
`
    }
},
'number-systems': {
    en: {
      title: 'Chapter 1: Number Systems',
      content: `### Introduction to Number Systems
- **Natural Numbers (N):** Counting numbers: 1, 2, 3, 4, ...
- **Whole Numbers (W):** Natural numbers including zero: 0, 1, 2, 3, ...
- **Integers (Z):** Whole numbers and their negative counterparts: ..., -3, -2, -1, 0, 1, 2, 3, ...
- **Rational Numbers (Q):** Numbers that can be expressed in the form p/q, where p and q are integers and q ≠ 0.

### Rational Numbers
- There are infinitely many rational numbers between any two given rational numbers.
- **Finding Rational Numbers:** To find 'n' rational numbers between x and y, you can use the formula d = (y-x)/(n+1) and the numbers will be x+d, x+2d, ..., x+nd.

### Irrational Numbers
- A number is called irrational if it cannot be written in the form p/q, where p and q are integers and q ≠ 0.
- **Examples:** √2, √3, √5, π, 0.101101110...
- The decimal expansion of an irrational number is **non-terminating and non-recurring**.

### Real Numbers and their Decimal Expansions
- **Real Numbers (R):** The collection of all rational and irrational numbers. Every real number is represented by a unique point on the number line.
- **Decimal expansion of Rational Numbers:** Either terminating or non-terminating recurring.
- **Decimal expansion of Irrational Numbers:** Non-terminating non-recurring.

### Representing Real Numbers on the Number Line
- We can represent real numbers on the number line using the process of successive magnification.
- For irrational numbers like √x, we can use geometric constructions (Pythagoras' theorem).

### Operations on Real Numbers
- The sum, difference, product, and quotient of two rational numbers are always rational.
- The sum, difference, product, and quotient of a rational and an irrational number are irrational.
- **Rationalising the Denominator:** To convert a number with an irrational denominator to an equivalent expression whose denominator is a rational number.
- - **Example:** To rationalise 1/(√a + b), we multiply the numerator and denominator by (√a - b).

### Laws of Exponents for Real Numbers
- Let a > 0 be a real number and m, n be rational numbers. Then,
- - 1. aᵐ ⋅ aⁿ = aᵐ⁺ⁿ
- - 2. (aᵐ)ⁿ = aᵐⁿ
- - 3. aᵐ / aⁿ = aᵐ⁻ⁿ
- - 4. aᵐbᵐ = (ab)ᵐ
`
    },
    hi: {
      title: 'अध्याय 1: संख्या पद्धति',
      content: `### संख्या पद्धतियों का परिचय
- **प्राकृत संख्याएँ (N):** गिनती की संख्याएँ: 1, 2, 3, 4, ...
- **पूर्ण संख्याएँ (W):** शून्य सहित प्राकृत संख्याएँ: 0, 1, 2, 3, ...
- **पूर्णांक (Z):** पूर्ण संख्याएँ और उनके ऋणात्मक समकक्ष: ..., -3, -2, -1, 0, 1, 2, 3, ...
- **परिमेय संख्याएँ (Q):** वे संख्याएँ जिन्हें p/q के रूप में व्यक्त किया जा सकता है, जहाँ p और q पूर्णांक हैं और q ≠ 0।

### परिमेय संख्याएँ
- किन्हीं दो दी गई परिमेय संख्याओं के बीच अपरिमित रूप से अनेक परिमेय संख्याएँ होती हैं।
- **परिमेय संख्याएँ ज्ञात करना:** x और y के बीच 'n' परिमेय संख्याएँ ज्ञात करने के लिए, आप d = (y-x)/(n+1) सूत्र का उपयोग कर सकते हैं और संख्याएँ x+d, x+2d, ..., x+nd होंगी।

### अपरिमेय संख्याएँ
- एक संख्या अपरिमेय कहलाती है यदि उसे p/q के रूप में नहीं लिखा जा सकता है, जहाँ p और q पूर्णांक हैं और q ≠ 0।
- **उदाहरण:** √2, √3, √5, π, 0.101101110...
- एक अपरिमेय संख्या का दशमलव प्रसार **असांत अनावर्ती** होता है।

### वास्तविक संख्याएँ और उनके दशमलव प्रसार
- **वास्तविक संख्याएँ (R):** सभी परिमेय और अपरिमेय संख्याओं का संग्रह। प्रत्येक वास्तविक संख्या को संख्या रेखा पर एक अद्वितीय बिंदु द्वारा दर्शाया जाता है।
- **परिमेय संख्याओं का दशमलव प्रसार:** या तो सांत या असांत आवर्ती।
- **अपरिमेय संख्याओं का दशमलव प्रसार:** असांत अनावर्ती।

### संख्या रेखा पर वास्तविक संख्याओं का निरूपण
- हम उत्तरोत्तर आवर्धन की प्रक्रिया का उपयोग करके संख्या रेखा पर वास्तविक संख्याओं को निरूपित कर सकते हैं।
- √x जैसी अपरिमेय संख्याओं के लिए, हम ज्यामितीय रचनाओं (पाइथागोरस प्रमेय) का उपयोग कर सकते हैं।

### वास्तविक संख्याओं पर संक्रियाएँ
- दो परिमेय संख्याओं का योग, अंतर, गुणनफल और भागफल हमेशा परिमेय होता है।
- एक परिमेय और एक अपरिमेय संख्या का योग, अंतर, गुणनफल और भागफल अपरिमेय होता है।
- **हर का परिमेयकरण:** एक अपरिमेय हर वाली संख्या को एक समतुल्य व्यंजक में बदलना जिसका हर एक परिमेय संख्या हो।
- - **उदाहरण:** 1/(√a + b) का परिमेयकरण करने के लिए, हम अंश और हर को (√a - b) से गुणा करते हैं।

### वास्तविक संख्याओं के लिए घातांक के नियम
- मान लीजिए a > 0 एक वास्तविक संख्या है और m, n परिमेय संख्याएँ हैं। तब,
- - 1. aᵐ ⋅ aⁿ = aᵐ⁺ⁿ
- - 2. (aᵐ)ⁿ = aᵐⁿ
- - 3. aᵐ / aⁿ = aᵐ⁻ⁿ
- - 4. aᵐbᵐ = (ab)ᵐ
`
    }
  },
    'the-french-revolution': {
    en: {
      title: 'Chapter 1: The French Revolution',
      content: `### Causes of the French Revolution
- **Social:** French society was divided into three Estates. The First Estate (clergy) and Second Estate (nobility) enjoyed privileges, while the Third Estate (commoners) bore the tax burden.
- **Economic:** Long years of war had drained the financial resources of France. The cost of maintaining an extravagant court at the immense palace of Versailles also added to the debt.
- **Political:** Louis XVI was an autocratic ruler who could not solve the economic crisis.
- **Intellectual:** Philosophers like John Locke, Jean Jacques Rousseau, and Montesquieu spread the ideas of liberty, equality, and fraternity.

### The Outbreak of the Revolution
- On 5 May 1789, Louis XVI called together an assembly of the Estates General to pass proposals for new taxes.
- The Third Estate demanded that voting now be conducted by the assembly as a whole, where each member would have one vote. This was rejected.
- On 20 June, they assembled in the hall of an indoor tennis court in the grounds of Versailles and declared themselves a National Assembly.
- On 14 July, the agitated crowd stormed and destroyed the Bastille.

### France Becomes a Constitutional Monarchy
- The National Assembly completed the draft of the constitution in 1791.
- Its main object was to limit the powers of the monarch.
- The Constitution of 1791 vested the power to make laws in the National Assembly, which was indirectly elected.

### France Abolishes Monarchy and Becomes a Republic
- In 1792 the Jacobins planned an insurrection and imprisoned the royal family.
- Elections were held. The newly elected assembly was called the Convention.
- On 21 September 1792, it abolished the monarchy and declared France a republic.
- Louis XVI was executed publicly on 21 January 1793. Queen Marie Antoinette met with the same fate shortly after.

### The Reign of Terror
- The period from 1793 to 1794 is referred to as the Reign of Terror.
- Robespierre followed a policy of severe control and punishment. All those whom he saw as being ‘enemies’ of the republic were arrested, imprisoned and then tried by a revolutionary tribunal.
- He was convicted by a court in July 1794, arrested and on the next day sent to the guillotine.

### A Directory Rules France
- The fall of the Jacobin government allowed the wealthier middle classes to seize power.
- A new constitution was introduced which provided for two elected legislative councils. These then appointed a Directory, an executive made up of five members.
- The political instability of the Directory paved the way for the rise of a military dictator, Napoleon Bonaparte.

### The Rise of Napoleon Bonaparte
- In 1804, Napoleon Bonaparte crowned himself Emperor of France.
- He introduced many laws such as the protection of private property and a uniform system of weights and measures provided by the decimal system.
- He was finally defeated at Waterloo in 1815.
`
    },
    hi: {
      title: 'अध्याय 1: फ्रांसीसी क्रांति',
      content: `### फ्रांसीसी क्रांति के कारण
- **सामाजिक:** फ्रांसीसी समाज तीन एस्टेट में विभाजित था। प्रथम एस्टेट (पादरी) और द्वितीय एस्टेट (कुलीन) को विशेषाधिकार प्राप्त थे, जबकि तृतीय एस्टेट (आम लोग) कर का बोझ उठाते थे।
- **आर्थिक:** लंबे समय तक चले युद्धों ने फ्रांस के वित्तीय संसाधनों को समाप्त कर दिया था। वर्साय के विशाल महल में एक असाधारण दरबार को बनाए रखने की लागत ने भी कर्ज को बढ़ा दिया।
- **राजनीतिक:** लुई सोलहवाँ एक निरंकुश शासक था जो आर्थिक संकट को हल नहीं कर सका।
- **बौद्धिक:** जॉन लॉक, जीन जैक्स रूसो और मोंटेस्क्यू जैसे दार्शनिकों ने स्वतंत्रता, समानता और बंधुत्व के विचारों को फैलाया।

### क्रांति का प्रकोप
- 5 मई 1789 को, लुई सोलहवें ने नए करों के प्रस्तावों को पारित करने के लिए एस्टेट्स जनरल की एक सभा बुलाई।
- तीसरे एस्टेट ने मांग की कि अब मतदान पूरी सभा द्वारा किया जाए, जहाँ प्रत्येक सदस्य का एक मत होगा। इसे अस्वीकार कर दिया गया।
- 20 जून को, वे वर्साय के मैदान में एक इनडोर टेनिस कोर्ट के हॉल में इकट्ठे हुए और खुद को एक नेशनल असेंबली घोषित कर दिया।
- 14 जुलाई को, उत्तेजित भीड़ ने बास्तील पर धावा बोल दिया और उसे नष्ट कर दिया।

### फ्रांस एक संवैधानिक राजतंत्र बन गया
- नेशनल असेंबली ने 1791 में संविधान का मसौदा पूरा किया।
- इसका मुख्य उद्देश्य सम्राट की शक्तियों को सीमित करना था।
- 1791 के संविधान ने कानून बनाने की शक्ति नेशनल असेंबली को दी, जो अप्रत्यक्ष रूप से चुनी गई थी।

### फ्रांस ने राजशाही को समाप्त कर दिया और एक गणतंत्र बन गया
- 1792 में जैकोबिन्स ने एक विद्रोह की योजना बनाई और शाही परिवार को कैद कर लिया।
- चुनाव हुए। नवनिर्वाचित सभा को कन्वेंशन कहा गया।
- 21 सितंबर 1792 को, इसने राजशाही को समाप्त कर दिया और फ्रांस को एक गणतंत्र घोषित कर दिया।
- लुई सोलहवें को 21 जनवरी 1793 को सार्वजनिक रूप से मार दिया गया। रानी मैरी एंटोनेट को भी कुछ समय बाद उसी भाग्य का सामना करना पड़ा।

### आतंक का शासन
- 1793 से 1794 तक की अवधि को आतंक के शासन के रूप में जाना जाता है।
- रोबेस्पयेर ने गंभीर नियंत्रण और दंड की नीति का पालन किया। उन सभी को जिन्हें वह गणतंत्र के 'दुश्मन' के रूप में देखता था, गिरफ्तार किया गया, कैद किया गया और फिर एक क्रांतिकारी न्यायाधिकरण द्वारा मुकदमा चलाया गया।
- उसे जुलाई 1794 में एक अदालत द्वारा दोषी ठहराया गया, गिरफ्तार किया गया और अगले दिन गिलोटिन भेज दिया गया।

### एक डायरेक्टरी फ्रांस पर शासन करती है
- जैकोबिन सरकार के पतन ने धनी मध्य वर्गों को सत्ता पर कब्जा करने की अनुमति दी।
- एक नया संविधान पेश किया गया जिसमें दो निर्वाचित विधान परिषदों का प्रावधान था। इन्होंने तब एक डायरेक्टरी नियुक्त की, जो पांच सदस्यों से बनी एक कार्यकारिणी थी।
- डायरेक्टरी की राजनीतिक अस्थिरता ने एक सैन्य तानाशाह, नेपोलियन बोनापार्ट के उदय का मार्ग प्रशस्त किया।

### नेपोलियन बोनापार्ट का उदय
- 1804 में, नेपोलियन बोनापार्ट ने खुद को फ्रांस का सम्राट बनाया।
- उन्होंने कई कानून पेश किए जैसे कि निजी संपत्ति की सुरक्षा और दशमलव प्रणाली द्वारा प्रदान किए गए भार और माप की एक समान प्रणाली।
- वह अंततः 1815 में वाटरलू में हार गया।
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
    <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 p-6 bg-muted/30 border-l-4 border-primary rounded-r-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{notes.title}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Detailed notes for your study and revision.
                        </p>
                    </div>
                </div>
            </header>
            <main>
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <NotesContentRenderer content={notes.content} />
                    </CardContent>
                </Card>
            </main>
        </div>
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
