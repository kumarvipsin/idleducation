
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
        {
          name: "Mathematics Textbook for Class VIII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Rational Numbers" },
            { name: "Chapter 2: Linear Equations in One Variable" },
            { name: "Chapter 3: Understanding Quadrilaterals" },
            { name: "Chapter 4: Data Handling" },
            { name: "Chapter 5: Squares and Square Roots" },
            { name: "Chapter 6: Cubes and Cube Roots" },
            { name: "Chapter 7: Comparing Quantities" },
            { name: "Chapter 8: Algebraic Expressions and Identities" },
            { name: "Chapter 9: Mensuration" },
            { name: "Chapter 10: Exponents and Powers" },
            { name: "Chapter 11: Direct and Inverse Proportions" },
            { name: "Chapter 12: Factorisation" },
            { name: "Chapter 13: Introduction to Graphs" },
          ],
        },
        {
          name: "गणित, कक्षा VIII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिमेय संख्याएँ" },
            { name: "अध्याय 2: एक चर वाले रैखिक समीकरण" },
            { name: "अध्याय 3: चतुर्भुजों को समझना" },
            { name: "अध्याय 4: आँकड़ों का प्रबंधन" },
            { name: "अध्याय 5: वर्ग और वर्गमूल" },
            { name: "अध्याय 6: घन और घनमूल" },
            { name: "अध्याय 7: राशियों की तुलना" },
            { name: "अध्याय 8: बीजीय व्यंजक एवं सर्वसमिकाएँ" },
            { name: "अध्याय 9: क्षेत्रमिति" },
            { name: "अध्याय 10: घातांक और घात" },
            { name: "अध्याय 11: सीधा और प्रतिलोम समानुपात" },
            { name: "अध्याय 12: गुणनखंडन" },
            { name: "अध्याय 13: आलेखों से परिचय" },
          ],
        },
      ],
    },
    science: {
      books: [
        {
          name: "Science Textbook for Class VIII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Crop Production and Management" },
            { name: "Chapter 2: Microorganisms: Friend and Foe" },
            { name: "Chapter 3: Coal and Petroleum" },
            { name: "Chapter 4: Combustion and Flame" },
            { name: "Chapter 5: Conservation of Plants and Animals" },
            { name: "Chapter 6: Reproduction in Animals" },
            { name: "Chapter 7: Reaching the Age of Adolescence" },
            { name: "Chapter 8: Force and Pressure" },
            { name: "Chapter 9: Friction" },
            { name: "Chapter 10: Sound" },
            { name: "Chapter 11: Chemical Effects of Electric Current" },
            { name: "Chapter 12: Some Natural Phenomena" },
            { name: "Chapter 13: Light" },
          ],
        },
        {
          name: "विज्ञान, कक्षा VIII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: फसल उत्पादन एवं प्रबंध" },
            { name: "अध्याय 2: सूक्ष्मजीव: मित्र एवं शत्रु" },
            { name: "अध्याय 3: कोयला और पेट्रोलियम" },
            { name: "अध्याय 4: दहन और ज्वाला" },
            { name: "अध्याय 5: पौधों एवं जंतुओं का संरक्षण" },
            { name: "अध्याय 6: जंतुओं में जनन" },
            { name: "अध्याय 7: किशोरावस्था की ओर" },
            { name: "अध्याय 8: बल तथा दाब" },
            { name: "अध्याय 9: घर्षण" },
            { name: "अध्याय 10: ध्वनि" },
            { name: "अध्याय 11: विद्युत धारा के रासायनिक प्रभाव" },
            { name: "अध्याय 12: कुछ प्राकृतिक परिघटनाएँ" },
            { name: "अध्याय 13: प्रकाश" },
          ],
        },
      ],
    },
    social: {
      books: [
        {
          name: "Our Pasts - III",
          lang: "en",
          chapters: [
            { name: "Chapter 1: How, When and Where" },
            { name: "Chapter 2: From Trade to Territory" },
            { name: "Chapter 3: Ruling the Countryside" },
            { name: "Chapter 4: Tribals, Dikus and the Vision of a Golden Age" },
            { name: "Chapter 5: When People Rebel" },
            { name: "Chapter 6: Weavers, Iron Smelters and Factory Owners" },
            { name: "Chapter 7: Civilising the 'Native', Educating the Nation" },
            { name: "Chapter 8: Women, Caste and Reform" },
            { name: "Chapter 9: The Making of the National Movement: 1870s-1947" },
            { name: "Chapter 10: India After Independence" },
          ],
        },
        {
          name: "Resources and Development",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Resources" },
            { name: "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources" },
            { name: "Chapter 3: Agriculture" },
            { name: "Chapter 4: Industries" },
            { name: "Chapter 5: Human Resources" },
          ],
        },
        {
          name: "Social and Political Life - III",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Indian Constitution" },
            { name: "Chapter 2: Understanding Secularism" },
            { name: "Chapter 3: Parliament and the Making of Laws" },
            { name: "Chapter 4: The Judiciary" },
            { name: "Chapter 5: Understanding Marginalisation" },
            { name: "Chapter 6: Confronting Marginalisation" },
            { name: "Chapter 7: Public Facilities" },
            { name: "Chapter 8: Law and Social Justice" },
          ],
        },
        {
          name: "हमारे अतीत - III",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: कैसे, कब और कहाँ" },
            { name: "अध्याय 2: व्यापार से साम्राज्य तक" },
            { name: "अध्याय 3: ग्रामीण क्षेत्र पर शासन चलाना" },
            { name: "अध्याय 4: आदिवासी, दीकु और एक स्वर्ण युग की कल्पना" },
            { name: "अध्याय 5: जब जनता बग़ावत करती है" },
            { name: "अध्याय 6: बुनकर, लोहा बनाने वाले और फैक्ट्री मालिक" },
            { name: "अध्याय 7: 'देशी' जनता को सभ्य बनाना, राष्ट्र को शिक्षित करना" },
            { name: "अध्याय 8: महिलाएँ, जाति एवं सुधार" },
            { name: "अध्याय 9: राष्ट्रीय आंदोलन का संघटन: 1870 के दशक से 1947 तक" },
            { name: "अध्याय 10: स्वतंत्रता के बाद भारत" },
          ],
        },
        {
          name: "संसाधन एवं विकास",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संसाधन" },
            { name: "अध्याय 2: भूमि, मृदा, जल, प्राकृतिक वनस्पति और वन्य जीवन संसाधन" },
            { name: "अध्याय 3: कृषि" },
            { name: "अध्याय 4: उद्योग" },
            { name: "अध्याय 5: मानव संसाधन" },
          ],
        },
        {
          name: "सामाजिक एवं राजनीतिक जीवन - III",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारतीय संविधान" },
            { name: "अध्याय 2: धर्मनिरपेक्षता की समझ" },
            { name: "अध्याय 3: संसद तथा कानूनों का निर्माण" },
            { name: "अध्याय 4: न्यायपालिका" },
            { name: "अध्याय 5: हाशियाकरण की समझ" },
            { name: "अध्याय 6: हाशियाकरण से निपटना" },
            { name: "अध्याय 7: जनसुविधाएँ" },
            { name: "अध्याय 8: कानून और सामाजिक न्याय" },
          ],
        },
      ],
    },
    english: {
      books: [
        {
          name: "Honeydew",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Best Christmas Present in the World" },
            { name: "Chapter 2: The Tsunami" },
            { name: "Chapter 3: Glimpses of the Past" },
            { name: "Chapter 4: Bepin Choudhury’s Lapse of Memory" },
          ],
        },
        {
          name: "It So Happened",
          lang: "en",
          chapters: [
            { name: "Chapter 1: How the Camel got his Hump" },
            { name: "Chapter 2: Children at Work" },
            { name: "Chapter 3: The Selfish Giant" },
          ],
        },
      ],
    }
  },
  'class-9': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class IX",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Number Systems" },
            { name: "Chapter 2: Polynomials" },
            { name: "Chapter 3: Coordinate Geometry" },
            { name: "Chapter 4: Linear Equations in Two Variables" },
            { name: "Chapter 5: Introduction to Euclid's Geometry" },
            { name: "Chapter 6: Lines and Angles" },
            { name: "Chapter 7: Triangles" },
            { name: "Chapter 8: Quadrilaterals" },
            { name: "Chapter 9: Circles" },
            { name: "Chapter 10: Heron's Formula" },
            { name: "Chapter 11: Surface Areas and Volumes" },
            { name: "Chapter 12: Statistics" },
          ],
        },
        {
          name: "गणित, कक्षा IX",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संख्या पद्धति" },
            { name: "अध्याय 2: बहुपद" },
            { name: "अध्याय 3: निर्देशांक ज्यामिति" },
            { name: "अध्याय 4: दो चरों वाले रैखिक समीकरण" },
            { name: "अध्याय 5: यूक्लिड की ज्यामिति का परिचय" },
            { name: "अध्याय 6: रेखाएँ और कोण" },
            { name: "अध्याय 7: त्रिभुज" },
            { name: "अध्याय 8: चतुर्भुज" },
            { name: "अध्याय 9: वृत्त" },
            { name: "अध्याय 10: हीरोन का सूत्र" },
            { name: "अध्याय 11: पृष्ठीय क्षेत्रफल और आयतन" },
            { name: "अध्याय 12: सांख्यिकी" },
          ],
        },
      ]
    },
    science: {
      books: [
        {
          name: "Science Textbook for Class IX",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Matter in Our Surroundings" },
            { name: "Chapter 2: Is Matter Around Us Pure" },
            { name: "Chapter 3: Atoms and Molecules" },
            { name: "Chapter 4: Structure of the Atom" },
            { name: "Chapter 5: The Fundamental Unit of Life" },
            { name: "Chapter 6: Tissues" },
            { name: "Chapter 7: Motion" },
            { name: "Chapter 8: Force and Laws of Motion" },
            { name: "Chapter 9: Gravitation" },
            { name: "Chapter 10: Work and Energy" },
            { name: "Chapter 11: Sound" },
            { name: "Chapter 12: Improvement in Food Resources" },
          ],
        },
        {
          name: "विज्ञान, कक्षा IX",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: हमारे आस-पास के पदार्थ" },
            { name: "अध्याय 2: क्या हमारे आस-पास के पदार्थ शुद्ध हैं" },
            { name: "अध्याय 3: परमाणु एवं अणु" },
            { name: "अध्याय 4: परमाणु की संरचना" },
            { name: "अध्याय 5: जीवन की मौलिक इकाई" },
            { name: "अध्याय 6: ऊतक" },
            { name: "अध्याय 7: गति" },
            { name: "अध्याय 8: बल तथा गति के नियम" },
            { name: "अध्याय 9: गुरुत्वाकर्षण" },
            { name: "अध्याय 10: कार्य तथा ऊर्जा" },
            { name: "अध्याय 11: ध्वनि" },
            { name: "अध्याय 12: खाद्य संसाधनों में सुधार" },
          ],
        },
      ]
    },
    social: {
      books: [
        {
          name: "India and the Contemporary World - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The French Revolution" },
            { name: "Chapter 2: Socialism in Europe and the Russian Revolution" },
            { name: "Chapter 3: Nazism and the Rise of Hitler" },
            { name: "Chapter 4: Forest Society and Colonialism" },
            { name: "Chapter 5: Pastoralists in the Modern World" },
          ],
        },
        {
          name: "Contemporary India - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: India - Size and Location" },
            { name: "Chapter 2: Physical Features of India" },
            { name: "Chapter 3: Drainage" },
            { name: "Chapter 4: Climate" },
            { name: "Chapter 5: Natural Vegetation and Wildlife" },
            { name: "Chapter 6: Population" },
          ],
        },
        {
          name: "Democratic Politics - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: What is Democracy? Why Democracy?" },
            { name: "Chapter 2: Constitutional Design" },
            { name: "Chapter 3: Electoral Politics" },
            { name: "Chapter 4: Working of Institutions" },
            { name: "Chapter 5: Democratic Rights" },
          ],
        },
        {
          name: "Economics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Story of Village Palampur" },
            { name: "Chapter 2: People as Resource" },
            { name: "Chapter 3: Poverty as a Challenge" },
            { name: "Chapter 4: Food Security in India" },
          ],
        },
        {
          name: "भारत और समकालीन विश्व - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: फ्रांसीसी क्रांति" },
            { name: "अध्याय 2: यूरोप में समाजवाद एवं रूसी क्रांति" },
            { name: "अध्याय 3: नात्सीवाद और हिटलर का उदय" },
            { name: "अध्याय 4: वन्य समाज एवं उपनिवेशवाद" },
            { name: "अध्याय 5: आधुनिक विश्व में चरवाहे" },
          ],
        },
        {
          name: "समकालीन भारत - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारत - आकार और स्थिति" },
            { name: "अध्याय 2: भारत का भौतिक स्वरूप" },
            { name: "अध्याय 3: अपवाह" },
            { name: "अध्याय 4: जलवायु" },
            { name: "अध्याय 5: प्राकृतिक वनस्पति तथा वन्य प्राणी" },
            { name: "अध्याय 6: जनसंख्या" },
          ],
        },
        {
          name: "लोकतांत्रिक राजनीति - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: लोकतंत्र क्या? लोकतंत्र क्यों?" },
            { name: "अध्याय 2: संविधान निर्माण" },
            { name: "अध्याय 3: चुनावी राजनीति" },
            { name: "अध्याय 4: संस्थाओं का कामकाज" },
            { name: "अध्याय 5: लोकतांत्रिक अधिकार" },
          ],
        },
        {
          name: "अर्थशास्त्र",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पालमपुर गाँव की कहानी" },
            { name: "अध्याय 2: संसाधन के रूप में लोग" },
            { name: "अध्याय 3: निर्धनता: एक चुनौती" },
            { name: "अध्याय 4: भारत में खाद्य सुरक्षा" },
          ],
        },
      ]
    },
    english: {
      books: [
        {
          name: "Beehive",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Fun They Had" },
            { name: "Chapter 2: The Sound of Music" },
            { name: "Chapter 3: The Little Girl" },
          ],
        },
        {
          name: "Moments",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Lost Child" },
            { name: "Chapter 2: The Adventures of Toto" },
            { name: "Chapter 3: Iswaran the Storyteller" },
          ],
        },
      ],
    }
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
        {
          name: "Mathematics Textbook for Class XI",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Sets" },
            { name: "Chapter 2: Relations and Functions" },
            { name: "Chapter 3: Trigonometric Functions" },
            { name: "Chapter 4: Principle of Mathematical Induction" },
            { name: "Chapter 5: Complex Numbers and Quadratic Equations" },
            { name: "Chapter 6: Linear Inequalities" },
            { name: "Chapter 7: Permutations and Combinations" },
            { name: "Chapter 8: Binomial Theorem" },
            { name: "Chapter 9: Sequences and Series" },
            { name: "Chapter 10: Straight Lines" },
            { name: "Chapter 11: Conic Sections" },
            { name: "Chapter 12: Introduction to Three Dimensional Geometry" },
            { name: "Chapter 13: Limits and Derivatives" },
            { name: "Chapter 14: Mathematical Reasoning" },
            { name: "Chapter 15: Statistics" },
            { name: "Chapter 16: Probability" },
          ],
        },
        {
          name: "गणित, कक्षा XI",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समुच्चय" },
            { name: "अध्याय 2: संबंध एवं फलन" },
            { name: "अध्याय 3: त्रिकोणमितीय फलन" },
            { name: "अध्याय 4: गणितीय आगमन का सिद्धांत" },
            { name: "अध्याय 5: सम्मिश्र संख्याएँ और द्विघातीय समीकरण" },
            { name: "अध्याय 6: रैखिक असमिकाएँ" },
            { name: "अध्याय 7: क्रमचय और संचय" },
            { name: "अध्याय 8: द्विपद प्रमेय" },
            { name: "अध्याय 9: अनुक्रम तथा श्रेणी" },
            { name: "अध्याय 10: सरल रेखाएँ" },
            { name: "अध्याय 11: शंकु परिच्छेद" },
            { name: "अध्याय 12: त्रिविमीय ज्यामिति का परिचय" },
            { name: "अध्याय 13: सीमा और अवकलज" },
            { name: "अध्याय 14: गणितीय विवेचन" },
            { name: "अध्याय 15: सांख्यिकी" },
            { name: "अध्याय 16: प्रायिकता" },
          ],
        },
      ]
    },
    physics: {
      books: [
        {
          name: "Physics Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Units and Measurements" },
            { name: "Chapter 2: Motion in a Straight Line" },
            { name: "Chapter 3: Motion in a Plane" },
            { name: "Chapter 4: Laws of Motion" },
            { name: "Chapter 5: Work, Energy and Power" },
            { name: "Chapter 6: System of Particles and Rotational Motion" },
            { name: "Chapter 7: Gravitation" },
          ],
        },
        {
          name: "Physics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 8: Mechanical Properties of Solids" },
            { name: "Chapter 9: Mechanical Properties of Fluids" },
            { name: "Chapter 10: Thermal Properties of Matter" },
            { name: "Chapter 11: Thermodynamics" },
            { name: "Chapter 12: Kinetic Theory" },
            { name: "Chapter 13: Oscillations" },
            { name: "Chapter 14: Waves" },
          ],
        },
        {
          name: "भौतिकी भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: मात्रक और मापन" },
            { name: "अध्याय 2: सरल रेखा में गति" },
            { name: "अध्याय 3: समतल में गति" },
            { name: "अध्याय 4: गति के नियम" },
            { name: "अध्याय 5: कार्य, ऊर्जा और शक्ति" },
            { name: "अध्याय 6: कणों के निकाय तथा घूर्णी गति" },
            { name: "अध्याय 7: गुरुत्वाकर्षण" },
          ],
        },
        {
          name: "भौतिकी भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 8: ठोसों के यांत्रिक गुण" },
            { name: "अध्याय 9: तरलों के यांत्रिकी गुण" },
            { name: "अध्याय 10: द्रव्य के तापीय गुण" },
            { name: "अध्याय 11: ऊष्मागतिकी" },
            { name: "अध्याय 12: अणुगति सिद्धांत" },
            { name: "अध्याय 13: दोलन" },
            { name: "अध्याय 14: तरंगें" },
          ],
        },
      ]
    },
    chemistry: {
      books: [
        {
          name: "Chemistry Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Some Basic Concepts of Chemistry" },
            { name: "Chapter 2: Structure of Atom" },
            { name: "Chapter 3: Classification of Elements and Periodicity in Properties" },
            { name: "Chapter 4: Chemical Bonding and Molecular Structure" },
            { name: "Chapter 5: Thermodynamics" },
            { name: "Chapter 6: Equilibrium" },
          ],
        },
        {
          name: "Chemistry Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 7: Redox Reactions" },
            { name: "Chapter 8: Organic Chemistry – Some Basic Principles and Techniques" },
            { name: "Chapter 9: Hydrocarbons" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ" },
            { name: "अध्याय 2: परमाणु की संरचना" },
            { name: "अध्याय 3: तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता" },
            { name: "अध्याय 4: रासायनिक आबंधन तथा आण्विक संरचना" },
            { name: "अध्याय 5: ऊष्मागतिकी" },
            { name: "अध्याय 6: साम्यावस्था" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 7: अपचयोपचय अभिक्रियाएँ" },
            { name: "अध्याय 8: कार्बनिक रसायन – कुछ आधारभूत सिद्धांत तथा तकनीकें" },
            { name: "अध्याय 9: हाइड्रोकार्बन" },
          ],
        },
      ]
    },
    biology: {
      books: [
        {
          name: "Biology Textbook for Class XI",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Living World" },
            { name: "Chapter 2: Biological Classification" },
            { name: "Chapter 3: Plant Kingdom" },
            { name: "Chapter 4: Animal Kingdom" },
            { name: "Chapter 5: Morphology of Flowering Plants" },
            { name: "Chapter 6: Anatomy of Flowering Plants" },
            { name: "Chapter 7: Structural Organisation in Animals" },
            { name: "Chapter 8: Cell: The Unit of Life" },
            { name: "Chapter 9: Biomolecules" },
            { name: "Chapter 10: Cell Cycle and Cell Division" },
            { name: "Chapter 11: Photosynthesis in Higher Plants" },
            { name: "Chapter 12: Respiration in Plants" },
            { name: "Chapter 13: Plant Growth and Development" },
            { name: "Chapter 14: Breathing and Exchange of Gases" },
            { name: "Chapter 15: Body Fluids and Circulation" },
            { name: "Chapter 16: Excretory Products and their Elimination" },
            { name: "Chapter 17: Locomotion and Movement" },
            { name: "Chapter 18: Neural Control and Coordination" },
            { name: "Chapter 19: Chemical Coordination and Integration" },
          ],
        },
        {
            name: "जीव विज्ञान, कक्षा XI",
            lang: "hi",
            chapters: [
              { name: "अध्याय 1: जीव जगत" },
              { name: "अध्याय 2: जीव जगत का वर्गीकरण" },
              { name: "अध्याय 3: वनस्पति जगत" },
              { name: "अध्याय 4: प्राणि जगत" },
              { name: "अध्याय 5: पुष्पी पादपों की आकारिकी" },
              { name: "अध्याय 6: पुष्पी पादपों का शरीर" },
              { name: "अध्याय 7: प्राणियों में संरचनात्मक संगठन" },
              { name: "अध्याय 8: कोशिका: जीवन की इकाई" },
              { name: "अध्याय 9: जैव अणु" },
              { name: "अध्याय 10: कोशिका चक्र और कोशिका विभाजन" },
              { name: "अध्याय 11: उच्च पादपों में प्रकाश संश्लेषण" },
              { name: "अध्याय 12: पादप में श्वसन" },
              { name: "अध्याय 13: पादप वृद्धि एवं परिवर्धन" },
              { name: "अध्याय 14: श्वसन और गैसों का विनिमय" },
              { name: "अध्याय 15: शरीर द्रव तथा परिसंचरण" },
              { name: "अध्याय 16: उत्सर्जी उत्पाद एवं उनका निष्कासन" },
              { name: "अध्याय 17: गमन एवं संचलन" },
              { name: "अध्याय 18: तंत्रिकीय नियंत्रण एवं समन्वय" },
              { name: "अध्याय 19: रासायनिक समन्वय तथा एकीकरण" },
            ],
        }
      ]
    },
    history: {
      books: [
        {
          name: "Themes in World History",
          lang: "en",
          chapters: [
            { name: "Chapter 1: From the Beginning of Time" },
            { name: "Chapter 2: Writing and City Life" },
            { name: "Chapter 3: An Empire Across Three Continents" },
            { name: "Chapter 4: The Central Islamic Lands" },
            { name: "Chapter 5: Nomadic Empires" },
            { name: "Chapter 6: The Three Orders" },
            { name: "Chapter 7: Changing Cultural Traditions" },
            { name: "Chapter 8: Confrontation of Cultures" },
            { name: "Chapter 9: The Industrial Revolution" },
            { name: "Chapter 10: Displacing Indigenous Peoples" },
            { name: "Chapter 11: Paths to Modernisation" },
          ],
        },
        {
          name: "विश्व इतिहास के कुछ विषय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समय की शुरुआत से" },
            { name: "अध्याय 2: लेखन कला और शहरी जीवन" },
            { name: "अध्याय 3: तीन महाद्वीपों में फैला हुआ साम्राज्य" },
            { name: "अध्याय 4: इस्लाम का उदय और विस्तार—लगभग 570-1200 ई." },
            { name: "अध्याय 5: यायावर साम्राज्य" },
            { name: "अध्याय 6: तीन वर्ग" },
            { name: "अध्याय 7: बदलती हुई सांस्कृतिक परंपराएँ" },
            { name: "अध्याय 8: संस्कृतियों का टकराव" },
            { name: "अध्याय 9: औद्योगिक क्रांति" },
            { name: "अध्याय 10: मूल निवासियों का विस्थापन" },
            { name: "अध्याय 11: आधुनिकीकरण के रास्ते" },
          ],
        },
      ]
    },
    geography: {
      books: [
        {
          name: "Fundamentals of Physical Geography",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Geography as a Discipline" },
            { name: "Chapter 2: The Origin and Evolution of the Earth" },
            { name: "Chapter 3: Interior of the Earth" },
            { name: "Chapter 4: Distribution of Oceans and Continents" },
            { name: "Chapter 5: Minerals and Rocks" },
            { name: "Chapter 6: Geomorphic Processes" },
            { name: "Chapter 7: Landforms and their Evolution" },
            { name: "Chapter 8: Composition and Structure of Atmosphere" },
            { name: "Chapter 9: Solar Radiation, Heat Balance and Temperature" },
            { name: "Chapter 10: Atmospheric Circulation and Weather Systems" },
            { name: "Chapter 11: Water in the Atmosphere" },
            { name: "Chapter 12: World Climate and Climate Change" },
            { name: "Chapter 13: Water (Oceans)" },
            { name: "Chapter 14: Movements of Ocean Water" },
            { name: "Chapter 15: Life on the Earth" },
            { name: "Chapter 16: Biodiversity and Conservation" },
          ],
        },
        {
          name: "India Physical Environment",
          lang: "en",
          chapters: [
            { name: "Chapter 1: India - Location" },
            { name: "Chapter 2: Structure and Physiography" },
            { name: "Chapter 3: Drainage System" },
            { name: "Chapter 4: Climate" },
            { name: "Chapter 5: Natural Vegetation" },
            { name: "Chapter 6: Soils" },
            { name: "Chapter 7: Natural Hazards and Disasters" },
          ],
        },
        {
          name: "भौतिक भूगोल के मूल सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भूगोल एक विषय के रूप में" },
            { name: "अध्याय 2: पृथ्वी की उत्पत्ति एवं विकास" },
            { name: "अध्याय 3: पृथ्वी की आंतरिक संरचना" },
            { name: "अध्याय 4: महासागरों और महाद्वीपों का वितरण" },
            { name: "अध्याय 5: खनिज एवं शैल" },
            { name: "अध्याय 6: भू-आकृतिक प्रक्रियाएँ" },
            { name: "अध्याय 7: भू-आकृतियाँ तथा उनका विकास" },
            { name: "अध्याय 8: वायुमंडल का संघटन तथा संरचना" },
            { name: "अध्याय 9: सौर विकिरण, ऊष्मा संतुलन एवं तापमान" },
            { name: "अध्याय 10: वायुमंडलीय परिसंचरण तथा मौसम प्रणालियाँ" },
            { name: "अध्याय 11: वायुमंडल में जल" },
            { name: "अध्याय 12: विश्व की जलवायु एवं जलवायु परिवर्तन" },
            { name: "अध्याय 13: महासागरीय जल" },
            { name: "अध्याय 14: महासागरीय जल संचलन" },
            { name: "अध्याय 15: पृथ्वी पर जीवन" },
            { name: "अध्याय 16: जैव-विविधता एवं संरक्षण" },
          ],
        },
        {
          name: "भारत भौतिक पर्यावरण",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारत - स्थिति" },
            { name: "अध्याय 2: संरचना तथा भू-आकृति विज्ञान" },
            { name: "अध्याय 3: अपवाह तंत्र" },
            { name: "अध्याय 4: जलवायु" },
            { name: "अध्याय 5: प्राकृतिक वनस्पति" },
            { name: "अध्याय 6: मृदा" },
            { name: "अध्याय 7: प्राकृतिक संकट तथा आपदाएँ" },
          ],
        },
      ]
    },
    polsci: {
      books: [
        {
          name: "Indian Constitution at Work",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Constitution: Why and How?" },
            { name: "Chapter 2: Rights in the Indian Constitution" },
            { name: "Chapter 3: Election and Representation" },
            { name: "Chapter 4: Executive" },
            { name: "Chapter 5: Legislature" },
            { name: "Chapter 6: Judiciary" },
            { name: "Chapter 7: Federalism" },
            { name: "Chapter 8: Local Governments" },
            { name: "Chapter 9: Constitution as a Living Document" },
            { name: "Chapter 10: The Philosophy of the Constitution" },
          ],
        },
        {
          name: "Political Theory",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Political Theory: An Introduction" },
            { name: "Chapter 2: Freedom" },
            { name: "Chapter 3: Equality" },
            { name: "Chapter 4: Social Justice" },
            { name: "Chapter 5: Rights" },
            { name: "Chapter 6: Citizenship" },
            { name: "Chapter 7: Nationalism" },
            { name: "Chapter 8: Secularism" },
            { name: "Chapter 9: Peace" },
            { name: "Chapter 10: Development" },
          ],
        },
        {
          name: "भारत का संविधान: सिद्धांत और व्यवहार",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संविधान: क्यों और कैसे?" },
            { name: "अध्याय 2: भारतीय संविधान में अधिकार" },
            { name: "अध्याय 3: चुनाव और प्रतिनिधित्व" },
            { name: "अध्याय 4: कार्यपालिका" },
            { name: "अध्याय 5: विधायिका" },
            { name: "अध्याय 6: न्यायपालिका" },
            { name: "अध्याय 7: संघवाद" },
            { name: "अध्याय 8: स्थानीय शासन" },
            { name: "अध्याय 9: संविधान: एक जीवंत दस्तावेज़" },
            { name: "अध्याय 10: संविधान का राजनीतिक दर्शन" },
          ],
        },
        {
          name: "राजनीतिक सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: राजनीतिक सिद्धांत: एक परिचय" },
            { name: "अध्याय 2: स्वतंत्रता" },
            { name: "अध्याय 3: समानता" },
            { name: "अध्याय 4: सामाजिक न्याय" },
            { name: "अध्याय 5: अधिकार" },
            { name: "अध्याय 6: नागरिकता" },
            { name: "अध्याय 7: राष्ट्रवाद" },
            { name: "अध्याय 8: धर्मनिरपेक्षता" },
            { name: "अध्याय 9: शांति" },
            { name: "अध्याय 10: विकास" },
          ],
        },
      ]
    },
    economics: {
      books: [
        {
          name: "Indian Economic Development",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Indian Economy on the Eve of Independence" },
            { name: "Chapter 2: Indian Economy 1950-1990" },
            { name: "Chapter 3: Liberalisation, Privatisation and Globalisation: An Appraisal" },
            { name: "Chapter 4: Poverty" },
            { name: "Chapter 5: Human Capital Formation in India" },
            { name: "Chapter 6: Rural Development" },
            { name: "Chapter 7: Employment: Growth, Informalisation and other Issues" },
            { name: "Chapter 8: Infrastructure" },
            { name: "Chapter 9: Environment and Sustainable Development" },
            { name: "Chapter 10: Comparative Development Experiences of India and its Neighbours" },
          ],
        },
        {
          name: "Statistics for Economics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Introduction" },
            { name: "Chapter 2: Collection of Data" },
            { name: "Chapter 3: Organisation of Data" },
            { name: "Chapter 4: Presentation of Data" },
            { name: "Chapter 5: Measures of Central Tendency" },
            { name: "Chapter 6: Measures of Dispersion" },
            { name: "Chapter 7: Correlation" },
            { name: "Chapter 8: Index Numbers" },
          ],
        },
        {
          name: "भारतीय आर्थिक विकास",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: स्वतंत्रता की पूर्व संध्या पर भारतीय अर्थव्यवस्था" },
            { name: "अध्याय 2: भारतीय अर्थव्यवस्था 1950-1990" },
            { name: "अध्याय 3: उदारीकरण, निजीकरण और वैश्वीकरण: एक समीक्षा" },
            { name: "अध्याय 4: निर्धनता" },
            { name: "अध्याय 5: भारत में मानव पूँजी का निर्माण" },
            { name: "अध्याय 6: ग्रामीण विकास" },
            { name: "अध्याय 7: रोजगार-संवृद्धि, अनौपचारीकरण एवं अन्य मुद्दे" },
            { name: "अध्याय 8: आधारिक संरचना" },
            { name: "अध्याय 9: पर्यावरण और धारणीय विकास" },
            { name: "अध्याय 10: भारत और उसके पड़ोसी देशों के तुलनात्मक विकास अनुभव" },
          ],
        },
        {
          name: "अर्थशास्त्र में सांख्यिकी",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय" },
            { name: "अध्याय 2: आँकड़ों का संग्रह" },
            { name: "अध्याय 3: आँकड़ों का संगठन" },
            { name: "अध्याय 4: आँकड़ों का प्रस्तुतीकरण" },
            { name: "अध्याय 5: केंद्रीय प्रवृत्ति की माप" },
            { name: "अध्याय 6: परिक्षेपण के माप" },
            { name: "अध्याय 7: सहसंबंध" },
            { name: "अध्याय 8: सूचकांक" },
          ],
        },
      ]
    },
    english: {
      books: [
        {
          name: "Hornbill",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Portrait of a Lady" },
            { name: "Chapter 2: We’re Not Afraid to Die... if We Can All Be Together" },
            { name: "Chapter 3: Discovering Tut: the Saga Continues" },
          ],
        },
        {
          name: "Snapshots",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Summer of the Beautiful White Horse" },
            { name: "Chapter 2: The Address" },
            { name: "Chapter 3: Ranga’s Marriage" },
          ],
        },
      ]
    }
  },
  'class-12': {
    maths: {
      books: [
        {
          name: "Mathematics Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Relations and Functions" },
            { name: "Chapter 2: Inverse Trigonometric Functions" },
            { name: "Chapter 3: Matrices" },
            { name: "Chapter 4: Determinants" },
            { name: "Chapter 5: Continuity and Differentiability" },
            { name: "Chapter 6: Application of Derivatives" },
          ],
        },
        {
          name: "Mathematics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 7: Integrals" },
            { name: "Chapter 8: Application of Integrals" },
            { name: "Chapter 9: Differential Equations" },
            { name: "Chapter 10: Vector Algebra" },
            { name: "Chapter 11: Three Dimensional Geometry" },
            { name: "Chapter 12: Linear Programming" },
            { name: "Chapter 13: Probability" },
          ],
        },
        {
          name: "गणित भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संबंध एवं फलन" },
            { name: "अध्याय 2: प्रतिलोम त्रिकोणमितीय फलन" },
            { name: "अध्याय 3: आव्यूह" },
            { name: "अध्याय 4: सारणिक" },
            { name: "अध्याय 5: सांतत्य तथा अवकलनीयता" },
            { name: "अध्याय 6: अवकलज के अनुप्रयोग" },
          ],
        },
        {
          name: "गणित भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 7: समाकलन" },
            { name: "अध्याय 8: समाकलनों के अनुप्रयोग" },
            { name: "अध्याय 9: अवकल समीकरण" },
            { name: "अध्याय 10: सदिश बीजगणित" },
            { name: "अध्याय 11: त्रिविमीय ज्यामिति" },
            { name: "अध्याय 12: रैखिक प्रोग्रामन" },
            { name: "अध्याय 13: प्रायिकता" },
          ],
        },
      ]
    },
    physics: {
      books: [
        {
          name: "Physics Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Electric Charges and Fields" },
            { name: "Chapter 2: Electrostatic Potential and Capacitance" },
            { name: "Chapter 3: Current Electricity" },
            { name: "Chapter 4: Moving Charges and Magnetism" },
            { name: "Chapter 5: Magnetism and Matter" },
            { name: "Chapter 6: Electromagnetic Induction" },
            { name: "Chapter 7: Alternating Current" },
            { name: "Chapter 8: Electromagnetic Waves" },
          ],
        },
        {
          name: "Physics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 9: Ray Optics and Optical Instruments" },
            { name: "Chapter 10: Wave Optics" },
            { name: "Chapter 11: Dual Nature of Radiation and Matter" },
            { name: "Chapter 12: Atoms" },
            { name: "Chapter 13: Nuclei" },
            { name: "Chapter 14: Semiconductor Electronics: Materials, Devices and Simple Circuits" },
          ],
        },
        {
          name: "भौतिकी भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: वैद्युत आवेश तथा क्षेत्र" },
            { name: "अध्याय 2: स्थिरवैद्युत विभव तथा धारिता" },
            { name: "अध्याय 3: विद्युत धारा" },
            { name: "अध्याय 4: गतिमान आवेश और चुंबकत्व" },
            { name: "अध्याय 5: चुंबकत्व एवं द्रव्य" },
            { name: "अध्याय 6: वैद्युतचुंबकीय प्रेरण" },
            { name: "अध्याय 7: प्रत्यावर्ती धारा" },
            { name: "अध्याय 8: वैद्युतचुंबकीय तरंगें" },
          ],
        },
        {
          name: "भौतिकी भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 9: किरण प्रकाशिकी एवं प्रकाशिक यंत्र" },
            { name: "अध्याय 10: तरंग-प्रकाशिकी" },
            { name: "अध्याय 11: विकिरण तथा द्रव्य की द्वैत प्रकृति" },
            { name: "अध्याय 12: परमाणु" },
            { name: "अध्याय 13: नाभिक" },
            { name: "अध्याय 14: अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ" },
          ],
        },
      ]
    },
    chemistry: {
      books: [
        {
          name: "Chemistry Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Solutions" },
            { name: "Chapter 2: Electrochemistry" },
            { name: "Chapter 3: Chemical Kinetics" },
            { name: "Chapter 4: The d- and f-Block Elements" },
            { name: "Chapter 5: Coordination Compounds" },
          ],
        },
         {
          name: "Chemistry Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 6: Haloalkanes and Haloarenes" },
            { name: "Chapter 7: Alcohols, Phenols and Ethers" },
            { name: "Chapter 8: Aldehydes, Ketones and Carboxylic Acids" },
            { name: "Chapter 9: Amines" },
            { name: "Chapter 10: Biomolecules" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: विलयन" },
            { name: "अध्याय 2: वैद्युतरसायन" },
            { name: "अध्याय 3: रासायनिक बलगतिकी" },
            { name: "अध्याय 4: d- एवं f- ब्लॉक के तत्त्व" },
            { name: "अध्याय 5: उपसहसंयोजन यौगिक" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 6: हैलोऐल्केन तथा हैलोऐरीन" },
            { name: "अध्याय 7: ऐल्कोहॉल, फ़िनॉल एवं ईथर" },
            { name: "अध्याय 8: ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल" },
            { name: "अध्याय 9: ऐमीन" },
            { name: "अध्याय 10: जैव-अणु" },
          ],
        },
      ]
    },
    biology: {
      books: [
        {
          name: "Biology Textbook for Class XII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Sexual Reproduction in Flowering Plants" },
            { name: "Chapter 2: Human Reproduction" },
            { name: "Chapter 3: Reproductive Health" },
            { name: "Chapter 4: Principles of Inheritance and Variation" },
            { name: "Chapter 5: Molecular Basis of Inheritance" },
            { name: "Chapter 6: Evolution" },
            { name: "Chapter 7: Human Health and Disease" },
            { name: "Chapter 8: Microbes in Human Welfare" },
            { name: "Chapter 9: Biotechnology: Principles and Processes" },
            { name: "Chapter 10: Biotechnology and its Applications" },
            { name: "Chapter 11: Organisms and Populations" },
            { name: "Chapter 12: Ecosystem" },
            { name: "Chapter 13: Biodiversity and Conservation" },
          ],
        },
        {
          name: "जीव विज्ञान, कक्षा XII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पुष्पी पादपों में लैंगिक जनन" },
            { name: "अध्याय 2: मानव जनन" },
            { name: "अध्याय 3: जनन स्वास्थ्य" },
            { name: "अध्याय 4: वंशागति तथा विविधता के सिद्धांत" },
            { name: "अध्याय 5: वंशागति के आणविक आधार" },
            { name: "अध्याय 6: विकास" },
            { name: "अध्याय 7: मानव स्वास्थ्य तथा रोग" },
            { name: "अध्याय 8: मानव कल्याण में सूक्ष्म जीव" },
            { name: "अध्याय 9: जैव प्रौद्योगिकी-सिद्धांत व प्रक्रम" },
            { name: "अध्याय 10: जैव प्रौद्योगिकी एवं उसके उपयोग" },
            { name: "अध्याय 11: जीव और समष्टियाँ" },
            { name: "अध्याय 12: पारितंत्र" },
            { name: "अध्याय 13: जैव विविधता एवं संरक्षण" },
          ],
        },
      ]
    },
    history: {
      books: [
        {
          name: "Themes in Indian History Part - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Bricks, Beads and Bones" },
            { name: "Chapter 2: Kings, Farmers and Towns" },
            { name: "Chapter 3: Kinship, Caste and Class" },
            { name: "Chapter 4: Thinkers, Beliefs and Buildings" },
          ],
        },
        {
          name: "Themes in Indian History Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 5: Through the Eyes of Travellers" },
            { name: "Chapter 6: Bhakti-Sufi Traditions" },
            { name: "Chapter 7: An Imperial Capital: Vijayanagara" },
            { name: "Chapter 8: Peasants, Zamindars and the State" },
          ],
        },
         {
          name: "Themes in Indian History Part - III",
          lang: "en",
          chapters: [
            { name: "Chapter 9: Colonialism and the Countryside" },
            { name: "Chapter 10: Rebels and the Raj" },
            { name: "Chapter 11: Mahatma Gandhi and the Nationalist Movement" },
            { name: "Chapter 12: Framing the Constitution" },
          ],
        },
        {
          name: "भारतीय इतिहास के कुछ विषय - भाग I",
          lang: "hi",
          chapters: [
            { name: "विषय 1: ईंटें, मनके तथा अस्थियाँ" },
            { name: "विषय 2: राजा, किसान और नगर" },
            { name: "विषय 3: बंधुत्व, जाति तथा वर्ग" },
            { name: "विषय 4: विचारक, विश्वास और इमारतें" },
          ],
        },
        {
          name: "भारतीय इतिहास के कुछ विषय - भाग II",
          lang: "hi",
          chapters: [
            { name: "विषय 5: यात्रियों के नज़रिए" },
            { name: "विषय 6: भक्ति-सूफ़ी परंपराएँ" },
            { name: "विषय 7: एक साम्राज्य की राजधानी: विजयनगर" },
            { name: "विषय 8: किसान, ज़मींदार और राज्य" },
          ],
        },
         {
          name: "भारतीय इतिहास के कुछ विषय - भाग III",
          lang: "hi",
          chapters: [
            { name: "विषय 9: उपनिवेशवाद और देहात" },
            { name: "विषय 10: विद्रोही और राज" },
            { name: "विषय 11: महात्मा गांधी और राष्ट्रीय आंदोलन" },
            { name: "विषय 12: संविधान का निर्माण" },
          ],
        },
      ]
    },
    geography: {
      books: [
        {
          name: "Fundamentals of Human Geography",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Human Geography: Nature and Scope" },
            { name: "Chapter 2: The World Population: Distribution, Density and Growth" },
            { name: "Chapter 3: Human Development" },
            { name: "Chapter 4: Primary Activities" },
            { name: "Chapter 5: Secondary Activities" },
            { name: "Chapter 6: Tertiary and Quaternary Activities" },
            { name: "Chapter 7: Transport and Communication" },
            { name: "Chapter 8: International Trade" },
          ],
        },
        {
          name: "India: People and Economy",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Population: Distribution, Density, Growth and Composition" },
            { name: "Chapter 2: Human Settlements" },
            { name: "Chapter 3: Land Resources and Agriculture" },
            { name: "Chapter 4: Water Resources" },
            { name: "Chapter 5: Mineral and Energy Resources" },
            { name: "Chapter 6: Planning and Sustainable Development in Indian Context" },
            { name: "Chapter 7: Transport and Communication" },
            { name: "Chapter 8: International Trade" },
            { name: "Chapter 9: Geographical Perspective on Selected Issues and Problems" },
          ],
        },
        {
          name: "मानव भूगोल के मूल सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: मानव भूगोल – प्रकृति एवं विषय क्षेत्र" },
            { name: "अध्याय 2: विश्व जनसंख्या-वितरण, घनत्व और वृद्धि" },
            { name: "अध्याय 3: मानव विकास" },
            { name: "अध्याय 4: प्राथमिक क्रियाएँ" },
            { name: "अध्याय 5: द्वितीयक क्रियाएँ" },
            { name: "अध्याय 6: तृतीयक और चतुर्थ क्रियाकलाप" },
            { name: "अध्याय 7: परिवहन एवं संचार" },
            { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार" },
          ],
        },
        {
          name: "भारत - लोग और अर्थव्यवस्था",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: जनसंख्या: वितरण, घनत्व, वृद्धि और संघटन" },
            { name: "अध्याय 2: मानव बस्तियाँ" },
            { name: "अध्याय 3: भूसंसाधन तथा कृषि" },
            { name: "अध्याय 4: जल-संसाधन" },
            { name: "अध्याय 5: खनिज तथा ऊर्जा संसाधन" },
            { name: "अध्याय 6: भारत के संदर्भ में नियोजन और सततपोषणीय विकास" },
            { name: "अध्याय 7: परिवहन तथा संचार" },
            { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार" },
            { name: "अध्याय 9: भौगोलिक परिप्रेक्ष्य में चयनित कुछ मुद्दे एवं समस्याएँ" },
          ],
        },
      ]
    },
    polsci: {
      books: [
        {
          name: "Contemporary World Politics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The End of Bipolarity" },
            { name: "Chapter 2: Contemporary Centres of Power" },
            { name: "Chapter 3: Contemporary South Asia" },
            { name: "Chapter 4: International Organisations" },
            { name: "Chapter 5: Security in the Contemporary World" },
            { name: "Chapter 6: Environment and Natural Resources" },
            { name: "Chapter 7: Globalisation" },
          ],
        },
        {
          name: "Politics in India Since Independence",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Challenges of Nation Building" },
            { name: "Chapter 2: Era of One-party Dominance" },
            { name: "Chapter 3: Politics of Planned Development" },
            { name: "Chapter 4: India’s External Relations" },
            { name: "Chapter 5: Challenges to and Restoration of the Congress System" },
            { name: "Chapter 6: The Crisis of Democratic Order" },
            { name: "Chapter 7: Regional Aspirations" },
            { name: "Chapter 8: Recent Developments in Indian Politics" },
          ],
        },
        {
          name: "समकालीन विश्व राजनीति",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: दो ध्रुवीयता का अंत" },
            { name: "अध्याय 2: सत्ता के समकालीन केंद्र" },
            { name: "अध्याय 3: समकालीन दक्षिण एशिया" },
            { name: "अध्याय 4: अंतर्राष्ट्रीय संगठन" },
            { name: "अध्याय 5: समकालीन विश्व में सुरक्षा" },
            { name: "अध्याय 6: पर्यावरण और प्राकृतिक संसाधन" },
            { name: "अध्याय 7: वैश्वीकरण" },
          ],
        },
        {
          name: "स्वतंत्र भारत में राजनीति",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ" },
            { name: "अध्याय 2: एक दल के प्रभुत्व का दौर" },
            { name: "अध्याय 3: नियोजित विकास की राजनीति" },
            { name: "अध्याय 4: भारत के विदेश संबंध" },
            { name: "अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना" },
            { name: "अध्याय 6: लोकतांत्रिक व्यवस्था का संकट" },
            { name: "अध्याय 7: क्षेत्रीय आकांक्षाएँ" },
            { name: "अध्याय 8: भारतीय राजनीति: नए बदलाव" },
          ],
        },
      ]
    },
    economics: {
      books: [
        {
          name: "Introductory Microeconomics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Introduction" },
            { name: "Chapter 2: Theory of Consumer Behaviour" },
            { name: "Chapter 3: Production and Costs" },
            { name: "Chapter 4: The Theory of the Firm under Perfect Competition" },
            { name: "Chapter 5: Market Equilibrium" },
            { name: "Chapter 6: Non-Competitive Markets" },
          ],
        },
        {
          name: "Introductory Macroeconomics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Introduction" },
            { name: "Chapter 2: National Income Accounting" },
            { name: "Chapter 3: Money and Banking" },
            { name: "Chapter 4: Determination of Income and Employment" },
            { name: "Chapter 5: Government Budget and the Economy" },
            { name: "Chapter 6: Open Economy Macroeconomics" },
          ],
        },
        {
          name: "व्यष्टि अर्थशास्त्र: एक परिचय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय" },
            { name: "अध्याय 2: उपभोक्ता के व्यवहार का सिद्धांत" },
            { name: "अध्याय 3: उत्पादन तथा लागत" },
            { name: "अध्याय 4: पूर्ण प्रतिस्पर्धा की स्थिति में फर्म का सिद्धांत" },
            { name: "अध्याय 5: बाजार संतुलन" },
            { name: "अध्याय 6: प्रतिस्पर्धारहित बाजार" },
          ],
        },
        {
          name: "समष्टि अर्थशास्त्र: एक परिचय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय" },
            { name: "अध्याय 2: राष्ट्रीय आय का लेखांकन" },
            { name: "अध्याय 3: मुद्रा और बैंकिंग" },
            { name: "अध्याय 4: आय और रोजगार के निर्धारण" },
            { name: "अध्याय 5: सरकारी बजट एवं अर्थव्यवस्था" },
            { name: "अध्याय 6: खुली अर्थव्यवस्था - समष्टि अर्थशास्त्र" },
          ],
        },
      ]
    },
    english: {
      books: [
        {
          name: "Flamingo",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Last Lesson" },
            { name: "Chapter 2: Lost Spring" },
            { name: "Chapter 3: Deep Water" },
            { name: "Chapter 4: The Rattrap" },
            { name: "Chapter 5: Indigo" },
            { name: "Chapter 6: Poets and Pancakes" },
            { name: "Chapter 7: The Interview" },
            { name: "Chapter 8: Going Places" },
          ],
        },
        {
          name: "Vistas",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Third Level" },
            { name: "Chapter 2: The Tiger King" },
            { name: "Chapter 3: Journey to the end of the Earth" },
            { name: "Chapter 4: The Enemy" },
            { name: "Chapter 5: On the face of It" },
            { name: "Chapter 6: Memories of Childhood" },
          ],
        },
      ]
    }
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
