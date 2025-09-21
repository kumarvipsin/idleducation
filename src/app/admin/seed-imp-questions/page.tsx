
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedImportantQuestions } from '@/app/actions';
import { Database } from 'lucide-react';

// Placeholder data for important questions.
const importantQuestionsData: { [key: string]: any } = {
  'class-5': {
    maths: {
      books: [
        { 
          name: "Math-Magic Textbook for Class V", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: The Fish Tale" },
            { name: "Chapter 2: Shapes and Angles" },
            { name: "Chapter 3: How Many Squares?" },
            { name: "Chapter 4: Parts and Wholes" },
            { name: "Chapter 5: Does it Look the Same?" },
            { name: "Chapter 6: Be My Multiple, I'll be Your Factor" },
            { name: "Chapter 7: Can You See the Pattern?" },
            { name: "Chapter 8: Mapping Your Way" },
            { name: "Chapter 9: Boxes and Sketches" },
            { name: "Chapter 10: Tenths and Hundredths" },
            { name: "Chapter 11: Area and its Boundary" },
            { name: "Chapter 12: Smart Charts" },
            { name: "Chapter 13: Ways to Multiply and Divide" },
            { name: "Chapter 14: How Big, How Heavy?" },
          ] 
        },
        { 
          name: "गणित का जादू, कक्षा V", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: मछली उछली" },
            { name: "अध्याय 2: आकृतियाँ और कोण" },
            { name: "अध्याय 3: कितने वर्ग?" },
            { name: "अध्याय 4: हिस्से और पूरे" },
            { name: "अध्याय 5: क्या यह एक जैसा दिखता है?" },
            { name: "अध्याय 6: मैं तेरा गुणनखंड, गुणज तू मेरा" },
            { name: "अध्याय 7: क्या तुम्हें पैटर्न दिखा?" },
            { name: "अध्याय 8: नक्शा" },
            { name: "अध्याय 9: डिब्बे और स्कैच" },
            { name: "अध्याय 10: दसवाँ और सौवाँ भाग" },
            { name: "अध्याय 11: क्षेत्रफल और घेरा" },
            { name: "अध्याय 12: स्मार्ट चार्ट" },
            { name: "अध्याय 13: गुणा और भाग के तरीके" },
            { name: "अध्याय 14: कितना बड़ा, कितना भारी?" },
          ] 
        }
      ]
    },
    science: {
      books: [
        { 
            name: "Looking Around Textbook for Class V", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: Super Senses" },
                { name: "Chapter 2: A Snake Charmer's Story" },
                { name: "Chapter 3: From Tasting to Digesting" },
                { name: "Chapter 4: Mangoes Round the Year" },
                { name: "Chapter 5: Seeds and Seeds" },
                { name: "Chapter 6: Every Drop Counts" },
                { name: "Chapter 7: Experiments with Water" },
                { name: "Chapter 8: A Treat for Mosquitoes" },
                { name: "Chapter 9: Up You Go!" },
                { name: "Chapter 10: Walls Tell Stories" },
            ] 
        },
        { 
            name: "आस-पास, कक्षा V", 
            lang: "hi", 
            chapters: [
                { name: "अध्याय 1: कैसे पहचाना चींटी ने दोस्त को?" },
                { name: "अध्याय 2: कहानी सँपेरों की" },
                { name: "अध्याय 3: चखने से पचने तक" },
                { name: "अध्याय 4: खाएँ आम बारहों महीने" },
                { name: "अध्याय 5: बीज, बीज, बीज" },
                { name: "अध्याय 6: बूँद-बूँद, दरिया-दरिया" },
                { name: "अध्याय 7: पानी के प्रयोग" },
                { name: "अध्याय 8: मच्छरों की दावत?" },
                { name: "अध्याय 9: डायरी: कमर सीधी, ऊपर चढ़ो!" },
                { name: "अध्याय 10: बोलती इमारतें" },
            ] 
        }
      ]
    },
    social: {
       books: [
        { 
            name: "Social Studies Class V", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: Globes and Maps" },
                { name: "Chapter 2: The Earth's Movements" },
                { name: "Chapter 3: Weather and Climate" },
                { name: "Chapter 4: Major Landforms" },
                { name: "Chapter 5: Our Rich Heritage" },
            ] 
        },
        { 
            name: "सामाजिक अध्ययन, कक्षा V", 
            lang: "hi", 
            chapters: [
                { name: "अध्याय 1: ग्लोब और मानचित्र" },
                { name: "अध्याय 2: पृथ्वी की गतियाँ" },
                { name: "अध्याय 3: मौसम और जलवायु" },
                { name: "अध्याय 4: प्रमुख स्थलाकृतियाँ" },
                { name: "अध्याय 5: हमारी समृद्ध विरासत" },
            ] 
        }
      ]
    },
    english: {
      books: [
        { 
            name: "Marigold Textbook in English for Class V", 
            lang: "en", 
            chapters: [
                { name: "Unit 1: Ice-Cream Man (Poem) & Wonderful Waste! (Story)" },
                { name: "Unit 2: Teamwork (Poem) & Flying Together (Story)" },
                { name: "Unit 3: My Shadow (Poem) & Robinson Crusoe Discovers a Footprint (Story)" },
                { name: "Unit 4: Crying (Poem) & My Elder Brother (Story)" },
                { name: "Unit 5: The Lazy Frog (Poem) & Rip Van Winkle (Story)" },
                { name: "Unit 6: Class Discussion (Poem) & The Talkative Barber (Story)" },
                { name: "Unit 7: Topsy-turvy Land (Poem) & Gulliver’s Travels (Story)" },
                { name: "Unit 8: Nobody’s Friend (Poem) & The Little Bully (Story)" },
                { name: "Unit 9: Sing a Song of People (Poem) & Around the World (Story)" },
                { name: "Unit 10: Malu Bhalu (Poem) & Who Will be Ningthou? (Story)" },
            ] 
        }
      ]
    },
  },
  'class-6': {
    maths: {
      books: [
        { 
            name: "Mathematics Textbook for Class VI", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: Knowing Our Numbers" },
                { name: "Chapter 2: Whole Numbers" },
                { name: "Chapter 3: Playing with Numbers" },
                { name: "Chapter 4: Basic Geometrical Ideas" },
                { name: "Chapter 5: Understanding Elementary Shapes" },
                { name: "Chapter 6: Integers" },
                { name: "Chapter 7: Fractions" },
                { name: "Chapter 8: Decimals" },
                { name: "Chapter 9: Data Handling" },
                { name: "Chapter 10: Mensuration" },
                { name: "Chapter 11: Algebra" },
                { name: "Chapter 12: Ratio and Proportion" },
            ] 
        },
        { 
            name: "गणित, कक्षा VI", 
            lang: "hi", 
            chapters: [
                { name: "अध्याय 1: अपनी संख्याओं की जानकारी" },
                { name: "अध्याय 2: पूर्ण संख्याएँ" },
                { name: "अध्याय 3: संख्याओं के साथ खेलना" },
                { name: "अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ" },
                { name: "अध्याय 5: प्रारंभिक आकारों को समझना" },
                { name: "अध्याय 6: पूर्णांक" },
                { name: "अध्याय 7: भिन्न" },
                { name: "अध्याय 8: दशमलव" },
                { name: "अध्याय 9: आँकड़ों का प्रबंधन" },
                { name: "अध्याय 10: क्षेत्रमिति" },
                { name: "अध्याय 11: बीजगणित" },
                { name: "अध्याय 12: अनुपात और समानुपात" },
            ] 
        }
      ]
    },
    science: {
      books: [
        { 
            name: "Science Textbook for Class VI", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: Food: Where Does It Come From?" },
                { name: "Chapter 2: Components of Food" },
                { name: "Chapter 3: Fibre to Fabric" },
                { name: "Chapter 4: Sorting Materials into Groups" },
                { name: "Chapter 5: Separation of Substances" },
                { name: "Chapter 6: Changes Around Us" },
                { name: "Chapter 7: Getting to Know Plants" },
                { name: "Chapter 8: Body Movements" },
                { name: "Chapter 9: The Living Organisms and Their Surroundings" },
                { name: "Chapter 10: Motion and Measurement of Distances" },
                { name: "Chapter 11: Light, Shadows and Reflections" },
                { name: "Chapter 12: Electricity and Circuits" },
            ] 
        },
        { 
            name: "विज्ञान, कक्षा VI", 
            lang: "hi", 
            chapters: [
                { name: "अध्याय 1: भोजन: यह कहाँ से आता है?" },
                { name: "अध्याय 2: भोजन के घटक" },
                { name: "अध्याय 3: तंतु से वस्त्र तक" },
                { name: "अध्याय 4: वस्तुओं के समूह बनाना" },
                { name: "अध्याय 5: पदार्थों का पृथक्करण" },
                { name: "अध्याय 6: हमारे चारों ओर के परिवर्तन" },
                { name: "अध्याय 7: पौधों को जानिए" },
                { name: "अध्याय 8: शरीर में गति" },
                { name: "अध्याय 9: सजीव एवं उनका परिवेश" },
                { name: "अध्याय 10: गति एवं दूरियों का मापन" },
                { name: "अध्याय 11: प्रकाश – छायाएँ एवं परावर्तन" },
                { name: "अध्याय 12: विद्युत् तथा परिपथ" },
            ] 
        }
      ]
    },
    social: {
      books: [
        { 
          name: "Our Pasts - I", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: What, Where, How and When?" },
            { name: "Chapter 2: On The Trail of The Earliest People" },
            { name: "Chapter 3: In the Earliest Cities" },
            { name: "Chapter 4: What Books and Burials Tell Us" },
            { name: "Chapter 5: Kingdoms, Kings and an Early Republic" },
            { name: "Chapter 6: New Questions and Ideas" },
            { name: "Chapter 7: Ashoka, The Emperor Who Gave Up War" },
            { name: "Chapter 8: Vital Villages, Thriving Towns" },
            { name: "Chapter 9: Traders, Kings and Pilgrims" },
            { name: "Chapter 10: New Empires and Kingdoms" },
            { name: "Chapter 11: Buildings, Paintings and Books" },
          ]
        },
        { 
          name: "The Earth: Our Habitat", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: The Earth in the Solar System" },
            { name: "Chapter 2: Globe: Latitudes and Longitudes" },
            { name: "Chapter 3: Motions of the Earth" },
            { name: "Chapter 4: Maps" },
            { name: "Chapter 5: Major Domains of the Earth" },
            { name: "Chapter 6: Major Landforms of the Earth" },
            { name: "Chapter 7: Our Country - India" },
            { name: "Chapter 8: India: Climate, Vegetation and Wildlife" },
          ]
        },
        { 
          name: "Social and Political Life - I", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: Understanding Diversity" },
            { name: "Chapter 2: Diversity and Discrimination" },
            { name: "Chapter 3: What is Government?" },
            { name: "Chapter 4: Key Elements of a Democratic Government" },
            { name: "Chapter 5: Panchayati Raj" },
            { name: "Chapter 6: Rural Administration" },
            { name: "Chapter 7: Urban Administration" },
            { name: "Chapter 8: Rural Livelihoods" },
            { name: "Chapter 9: Urban Livelihoods" },
          ]
        },
        { 
          name: "हमारे अतीत - I", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: क्या, कब, कहाँ और कैसे?" },
            { name: "अध्याय 2: आखेट-खाद्य संग्रह से भोजन उत्पादन तक" },
            { name: "अध्याय 3: आरंभिक नगर" },
            { name: "अध्याय 4: क्या बताती हैं हमें किताबें और कब्रें" },
            { name: "अध्याय 5: राज्य, राजा और एक प्राचीन गणराज्य" },
            { name: "अध्याय 6: नए प्रश्न नए विचार" },
            { name: "अध्याय 7: अशोक: एक अनोखा सम्राट जिसने युद्ध का त्याग किया" },
            { name: "अध्याय 8: खुशहाल गाँव और समृद्ध शहर" },
            { name: "अध्याय 9: व्यापारी, राजा और तीर्थयात्री" },
            { name: "अध्याय 10: नए साम्राज्य और राज्य" },
            { name: "अध्याय 11: इमारतें, चित्र तथा किताबें" },
          ]
        },
        { 
          name: "पृथ्वी: हमारा आवास", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: सौरमंडल में पृथ्वी" },
            { name: "अध्याय 2: ग्लोब: अक्षांश एवं देशांतर" },
            { name: "अध्याय 3: पृथ्वी की गतियाँ" },
            { name: "अध्याय 4: मानचित्र" },
            { name: "अध्याय 5: पृथ्वी के प्रमुख परिमंडल" },
            { name: "अध्याय 6: पृथ्वी के प्रमुख स्थलरूप" },
            { name: "अध्याय 7: हमारा देश: भारत" },
            { name: "अध्याय 8: भारत: जलवायु, वनस्पति तथा वन्य प्राणी" },
          ]
        },
        { 
          name: "सामाजिक एवं राजनीतिक जीवन - I", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: विविधता की समझ" },
            { name: "अध्याय 2: विविधता एवं भेदभाव" },
            { name: "अध्याय 3: सरकार क्या है?" },
            { name: "अध्याय 4: लोकतांत्रिक सरकार के मुख्य तत्त्व" },
            { name: "अध्याय 5: पंचायती राज" },
            { name: "अध्याय 6: गाँव का प्रशासन" },
            { name: "अध्याय 7: नगर का प्रशासन" },
            { name: "अध्याय 8: ग्रामीण क्षेत्र में आजीविका" },
            { name: "अध्याय 9: शहरी क्षेत्र में आजीविका" },
          ]
        },
      ]
    },
    english: {
      books: [
        { 
            name: "Honeysuckle", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: Who Did Patrick’s Homework?" },
                { name: "Chapter 2: How the Dog Found Himself a New Master!" },
                { name: "Chapter 3: Taro’s Reward" },
                { name: "Chapter 4: An Indian – American Woman in Space: Kalpana Chawla" },
                { name: "Chapter 5: A Different Kind of School" },
                { name: "Chapter 6: Who I Am" },
                { name: "Chapter 7: Fair Play" },
                { name: "Chapter 8: A Game of Chance" },
                { name: "Chapter 9: Desert Animals" },
                { name: "Chapter 10: The Banyan Tree" },
            ] 
        },
        { 
            name: "A Pact with the Sun", 
            lang: "en", 
            chapters: [
                { name: "Chapter 1: A Tale of Two Birds" },
                { name: "Chapter 2: The Friendly Mongoose" },
                { name: "Chapter 3: The Shepherd’s Treasure" },
            ] 
        }
      ]
    },
  },
  'class-7': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class VII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Integers" },
            { name: "Chapter 2: Fractions and Decimals" },
            { name: "Chapter 3: Data Handling" },
            { name: "Chapter 4: Simple Equations" },
            { name: "Chapter 5: Lines and Angles" },
            { name: "Chapter 6: The Triangle and its Properties" },
            { name: "Chapter 7: Congruence of Triangles" },
            { name: "Chapter 8: Comparing Quantities" },
            { name: "Chapter 9: Rational Numbers" },
            { name: "Chapter 10: Practical Geometry" },
            { name: "Chapter 11: Perimeter and Area" },
            { name: "Chapter 12: Algebraic Expressions" },
            { name: "Chapter 13: Exponents and Powers" },
            { name: "Chapter 14: Symmetry" },
            { name: "Chapter 15: Visualising Solid Shapes" },
          ],
        },
        {
          name: "गणित, कक्षा VII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पूर्णांक" },
            { name: "अध्याय 2: भिन्न एवं दशमलव" },
            { name: "अध्याय 3: आँकड़ो का प्रबंधन" },
            { name: "अध्याय 4: सरल समीकरण" },
            { name: "अध्याय 5: रेखा एवं कोण" },
            { name: "अध्याय 6: त्रिभुज और उसके गुण" },
            { name: "अध्याय 7: त्रिभुजों की सर्वांगसमता" },
            { name: "अध्याय 8: राशियों की तुलना" },
            { name: "अध्याय 9: परिमेय संख्याएँ" },
            { name: "अध्याय 10: प्रायोगिक ज्यामिति" },
            { name: "अध्याय 11: परिमाप और क्षेत्रफल" },
            { name: "अध्याय 12: बीजीय व्यंजक" },
            { name: "अध्याय 13: घातांक और घात" },
            { name: "अध्याय 14: सममिति" },
            { name: "अध्याय 15: ठोस आकारों का चित्रण" },
          ],
        },
      ],
    },
    science: {
      books: [
        {
          name: "Science Textbook for Class VII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Nutrition in Plants" },
            { name: "Chapter 2: Nutrition in Animals" },
            { name: "Chapter 3: Fibre to Fabric" },
            { name: "Chapter 4: Heat" },
            { name: "Chapter 5: Acids, Bases and Salts" },
            { name: "Chapter 6: Physical and Chemical Changes" },
            { name: "Chapter 7: Weather, Climate and Adaptations of Animals to Climate" },
            { name: "Chapter 8: Winds, Storms and Cyclones" },
            { name: "Chapter 9: Soil" },
            { name: "Chapter 10: Respiration in Organisms" },
            { name: "Chapter 11: Transportation in Animals and Plants" },
            { name: "Chapter 12: Reproduction in Plants" },
            { name: "Chapter 13: Motion and Time" },
            { name: "Chapter 14: Electric Current and its Effects" },
            { name: "Chapter 15: Light" },
            { name: "Chapter 16: Water: A Precious Resource" },
            { name: "Chapter 17: Forests: Our Lifeline" },
            { name: "Chapter 18: Wastewater Story" },
          ],
        },
        {
          name: "विज्ञान, कक्षा VII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पादपों में पोषण" },
            { name: "अध्याय 2: प्राणियों में पोषण" },
            { name: "अध्याय 3: रेशों से वस्त्र तक" },
            { name: "अध्याय 4: ऊष्मा" },
            { name: "अध्याय 5: अम्ल, क्षारक और लवण" },
            { name: "अध्याय 6: भौतिक एवं रासायनिक परिवर्तन" },
            { name: "अध्याय 7: मौसम, जलवायु तथा जलवायु के अनुरूप जंतुओं द्वारा अनुकूलन" },
            { name: "अध्याय 8: पवन, तूफ़ान और चक्रवात" },
            { name: "अध्याय 9: मृदा" },
            { name: "अध्याय 10: जीवों में श्वसन" },
            { name: "अध्याय 11: जंतुओं और पादप में परिवहन" },
            { name: "अध्याय 12: पादप में जनन" },
            { name: "अध्याय 13: गति एवं समय" },
            { name: "अध्याय 14: विद्युत धारा और इसके प्रभाव" },
            { name: "अध्याय 15: प्रकाश" },
            { name: "अध्याय 16: जल: एक बहुमूल्य संसाधन" },
            { name: "अध्याय 17: वन: हमारी जीवन रेखा" },
            { name: "अध्याय 18: अपशिष्ट जल की कहानी" },
          ],
        },
      ],
    },
    social: {
      books: [
        {
          name: "Our Pasts - II",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Tracing Changes Through A Thousand Years" },
            { name: "Chapter 2: New Kings And Kingdoms" },
            { name: "Chapter 3: The Delhi Sultans" },
            { name: "Chapter 4: The Mughal Empire" },
            { name: "Chapter 5: Rulers And Buildings" },
            { name: "Chapter 6: Towns, Traders And Craftspersons" },
            { name: "Chapter 7: Tribes, Nomads And Settled Communities" },
            { name: "Chapter 8: Devotional Paths To The Divine" },
          ],
        },
        {
          name: "Our Environment",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Environment" },
            { name: "Chapter 2: Inside Our Earth" },
            { name: "Chapter 3: Our Changing Earth" },
            { name: "Chapter 4: Air" },
            { name: "Chapter 5: Water" },
            { name: "Chapter 6: Human Environment–Interaction: The Tropical and the Subtropical Region" },
            { name: "Chapter 7: Life in the Deserts" },
          ],
        },
        {
          name: "Social and Political Life - II",
          lang: "en",
          chapters: [
            { name: "Chapter 1: On Equality" },
            { name: "Chapter 2: Role of the Government in Health" },
            { name: "Chapter 3: How the State Government Works" },
            { name: "Chapter 4: Growing Up as Boys and Girls" },
            { name: "Chapter 5: Women Change the World" },
            { name: "Chapter 6: Understanding Media" },
            { name: "Chapter 7: Markets Around Us" },
            { name: "Chapter 8: A Shirt in the Market" },
          ],
        },
        {
          name: "हमारे अतीत - II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: हज़ार वर्षों के दौरान हुए परिवर्तनों की पड़ताल" },
            { name: "अध्याय 2: नये राजा और उनके राज्य" },
            { name: "अध्याय 3: दिल्ली के सुलतान" },
            { name: "अध्याय 4: मुग़ल साम्राज्य" },
            { name: "अध्याय 5: शासक और इमारतें" },
            { name: "अध्याय 6: नगर, व्यापारी और शिल्पीजन" },
            { name: "अध्याय 7: जनजातियाँ, खानाबदोश और एक जगह बसे हुए समुदाय" },
            { name: "अध्याय 8: ईश्वर से अनुराग" },
          ],
        },
        {
          name: "हमारा पर्यावरण",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पर्यावरण" },
            { name: "अध्याय 2: हमारी पृथ्वी के अंदर" },
            { name: "अध्याय 3: हमारी बदलती पृथ्वी" },
            { name: "अध्याय 4: वायु" },
            { name: "अध्याय 5: जल" },
            { name: "अध्याय 6: मानव-पर्यावरण अन्योन्यक्रिया: उष्णकटिबंधीय एवं उपोष्ण प्रदेश" },
            { name: "अध्याय 7: रेगिस्तान में जीवन" },
          ],
        },
        {
          name: "सामाजिक एवं राजनीतिक जीवन - II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समानता" },
            { name: "अध्याय 2: स्वास्थ्य में सरकार की भूमिका" },
            { name: "अध्याय 3: राज्य शासन कैसे काम करता है" },
            { name: "अध्याय 4: लड़के और लड़कियों के रूप में बड़ा होना" },
            { name: "अध्याय 5: औरतों ने बदली दुनिया" },
            { name: "अध्याय 6: संचार माध्यमों को समझना" },
            { name: "अध्याय 7: हमारे आस-पास के बाज़ार" },
            { name: "अध्याय 8: बाज़ार में एक कमीज़" },
          ],
        },
      ],
    },
    english: {
       books: [
        {
          name: "Honeycomb",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Three Questions" },
            { name: "Chapter 2: A Gift of Chappals" },
            { name: "Chapter 3: Gopal and the Hilsa Fish" },
            { name: "Chapter 4: The Ashes That Made Trees Bloom" },
            { name: "Chapter 5: Quality" },
          ],
        },
        {
          name: "An Alien Hand",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Tiny Teacher" },
            { name: "Chapter 2: Bringing Up Kari" },
            { name: "Chapter 3: The Desert" },
          ],
        },
      ]
    },
  },
  'class-8': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class VIII", lang: "en", chapters: [{ name: "Rational Numbers" }] },
        { name: "गणित, कक्षा VIII", lang: "hi", chapters: [{ name: "परिमेय संख्याएँ" }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VIII", lang: "en", chapters: [{ name: "Crop Production and Management" }] },
        { name: "विज्ञान, कक्षा VIII", lang: "hi", chapters: [{ name: "फसल उत्पादन एवं प्रबंध" }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - III", lang: "en", chapters: [{ name: "How, When and Where" }] },
        { name: "हमारे अतीत - III", lang: "hi", chapters: [{ name: "कैसे, कब और कहाँ" }] }
      ]
    },
    english: {
      books: [
        { name: "Honeydew", lang: "en", chapters: [{ name: "The Best Christmas Present in the World" }] }
      ]
    },
  },
  'class-9': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class IX", lang: "en", chapters: [{ name: "Number Systems" }] },
        { name: "गणित, कक्षा IX", lang: "hi", chapters: [{ name: "संख्या पद्धति" }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class IX", lang: "en", chapters: [{ name: "Matter in Our Surroundings" }] },
        { name: "विज्ञान, कक्षा IX", lang: "hi", chapters: [{ name: "हमारे आस-पास के पदार्थ" }] }
      ]
    },
    social: {
       books: [
        { name: "India and the Contemporary World - I", lang: "en", chapters: [{ name: "The French Revolution" }] },
        { name: "भारत और समकालीन विश्व - I", lang: "hi", chapters: [{ name: "फ्रांसीसी क्रांति" }] }
      ]
    },
    english: {
      books: [
        { name: "Beehive", lang: "en", chapters: [{ name: "The Fun They Had" }] }
      ]
    },
  },
  'class-10': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class X",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Real Numbers" },
            { name: "Chapter 2: Polynomials" },
            { name: "Chapter 3: Pair of Linear Equations in Two Variables" },
            { name: "Chapter 4: Quadratic Equations" },
            { name: "Chapter 5: Arithmetic Progressions" },
            { name: "Chapter 6: Triangles" },
            { name: "Chapter 7: Coordinate Geometry" },
            { name: "Chapter 8: Introduction to Trigonometry" },
            { name: "Chapter 9: Some Applications of Trigonometry" },
            { name: "Chapter 10: Circles" },
            { name: "Chapter 11: Areas Related to Circles" },
            { name: "Chapter 12: Surface Areas and Volumes" },
            { name: "Chapter 13: Statistics" },
            { name: "Chapter 14: Probability" },
          ],
        },
        {
          name: "गणित, कक्षा X",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: वास्तविक संख्याएँ" },
            { name: "अध्याय 2: बहुपद" },
            { name: "अध्याय 3: दो चर वाले रैखिक समीकरण युग्म" },
            { name: "अध्याय 4: द्विघात समीकरण" },
            { name: "अध्याय 5: समांतर श्रेढ़ियाँ" },
            { name: "अध्याय 6: त्रिभुज" },
            { name: "अध्याय 7: निर्देशांक ज्यामिति" },
            { name: "अध्याय 8: त्रिकोणमिति का परिचय" },
            { name: "अध्याय 9: त्रिकोणमिति के कुछ अनुप्रयोग" },
            { name: "अध्याय 10: वृत्त" },
            { name: "अध्याय 11: वृत्तों से संबंधित क्षेत्रफल" },
            { name: "अध्याय 12: पृष्ठीय क्षेत्रफल और आयतन" },
            { name: "अध्याय 13: सांख्यिकी" },
            { name: "अध्याय 14: प्रायिकता" },
          ],
        },
      ],
    },
    science: {
      books: [
        {
          name: "Science Class X (2025 Syllabus)",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Chemical Reactions and Equations" },
            { name: "Chapter 2: Acids, Bases and Salts" },
            { name: "Chapter 3: Metals and Non-metals" },
            { name: "Chapter 4: Carbon and its Compounds" },
            { name: "Chapter 5: Life Processes" },
            { name: "Chapter 6: Control and Coordination" },
            { name: "Chapter 7: How do Organisms Reproduce?" },
            { name: "Chapter 8: Heredity" },
            { name: "Chapter 9: Light – Reflection and Refraction" },
            { name: "Chapter 10: The Human Eye and the Colourful World" },
            { name: "Chapter 11: Electricity" },
            { name: "Chapter 12: Magnetic Effects of Electric Current" },
            { name: "Chapter 13: Our Environment" },
          ],
        },
        {
          name: "विज्ञान (2025 Syllabus)",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण" },
            { name: "अध्याय 2: अम्ल, क्षारक एवं लवण" },
            { name: "अध्याय 3: धातु एवं अधातु" },
            { name: "अध्याय 4: कार्बन एवं उसके यौगिक" },
            { name: "अध्याय 5: जैव प्रक्रम" },
            { name: "अध्याय 6: नियंत्रण एवं समन्वय" },
            { name: "अध्याय 7: जीव जनन कैसे करते हैं?" },
            { name: "अध्याय 8: आनुवंशिकता" },
            { name: "अध्याय 9: प्रकाश – परावर्तन तथा अपवर्तन" },
            { name: "अध्याय 10: मानव नेत्र तथा रंगबिरंगा संसार" },
            { name: "अध्याय 11: विद्युत" },
            { name: "अध्याय 12: विद्युत धारा के चुंबकीय प्रभाव" },
            { name: "अध्याय 13: हमारा पर्यावरण" },
          ],
        },
      ],
    },
    social: {
      books: [
        {
          name: "India and the Contemporary World - II",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Rise of Nationalism in Europe" },
            { name: "Chapter 2: Nationalism in India" },
            { name: "Chapter 3: The Making of a Global World" },
            { name: "Chapter 4: The Age of Industrialisation" },
            { name: "Chapter 5: Print Culture and the Modern World" },
          ],
        },
        {
          name: "भारत और समकालीन विश्व - II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: यूरोप में राष्ट्रवाद का उदय" },
            { name: "अध्याय 2: भारत में राष्ट्रवाद" },
            { name: "अध्याय 3: भूमंडलीकृत विश्व का बनना" },
            { name: "अध्याय 4: औद्योगिकीकरण का युग" },
            { name: "अध्याय 5: मुद्रण संस्कृति और आधुनिक दुनिया" },
          ],
        },
      ],
    },
    english: {
      books: [
        {
          name: "First Flight",
          lang: "en",
          chapters: [{ name: "A Letter to God" }],
        },
      ],
    },
  },
  'class-11': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class XI", lang: "en", chapters: [{ name: "Sets" }] },
        { name: "गणित, कक्षा XI", lang: "hi", chapters: [{ name: "समुच्चय" }] }
      ]
    },
    physics: {
      books: [
        { name: "Physics Part - I", lang: "en", chapters: [{ name: "Units and Measurements" }] },
        { name: "भौतिकी भाग I", lang: "hi", chapters: [{ name: "मात्रक और मापन" }] }
      ]
    },
    chemistry: {
      books: [
        { name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Some Basic Concepts of Chemistry" }] },
        { name: "रसायन विज्ञान भाग I", lang: "hi", chapters: [{ name: "रसायन विज्ञान की कुछ मूल अवधारणाएँ" }] }
      ]
    },
    biology: {
      books: [
        { name: "Biology Textbook for Class XI", lang: "en", chapters: [{ name: "The Living World" }] },
        { name: "जीव विज्ञान, कक्षा XI", lang: "hi", chapters: [{ name: "जीव जगत" }] }
      ]
    },
  },
  'class-12': {
    maths: {
      books: [
        { name: "Mathematics Part - I", lang: "en", chapters: [{ name: "Relations and Functions" }] },
        { name: "गणित भाग I", lang: "hi", chapters: [{ name: "संबंध एवं फलन" }] }
      ]
    },
    physics: {
      books: [
        { name: "Physics Part - I", lang: "en", chapters: [{ name: "Electric Charges and Fields" }] },
        { name: "भौतिकी भाग I", lang: "hi", chapters: [{ name: "वैद्युत आवेश तथा क्षेत्र" }] }
      ]
    },
    chemistry: {
      books: [
        { name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Solutions" }] },
        { name: "रसायन विज्ञान भाग I", lang: "hi", chapters: [{ name: "विलयन" }] }
      ]
    },
    biology: {
      books: [
        { name: "Biology Textbook for Class XII", lang: "en", chapters: [{ name: "Sexual Reproduction in Flowering Plants" }] },
        { name: "जीव विज्ञान, कक्षा XII", lang: "hi", chapters: [{ name: "पुष्पी पादपों में लैंगिक जनन" }] }
      ]
    },
  },
};

export default function SeedImpQuestionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSeedData = async (className: string, data: any) => {
    setLoading(className);
    try {
      const result = await seedImportantQuestions(className, data);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to seed data. Check console for details.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seed Important Questions</CardTitle>
        <CardDescription>
          Use this page to populate your Firestore database with important questions for various classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(importantQuestionsData).map(([className, data]) => (
          <Button
            key={className}
            onClick={() => handleSeedData(className, data)}
            disabled={loading === className}
          >
            <Database className="mr-2 h-4 w-4" />
            {loading === className ? `Seeding ${className.replace('-', ' ')}...` : `Seed ${className.replace('-', ' ')} Imp. Questions`}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
