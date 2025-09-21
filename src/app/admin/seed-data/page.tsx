
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedNcertSolutions } from '@/app/actions';
import { Database } from 'lucide-react';

const ncertSolutionsData: { [key: string]: any } = {
  'class-5': {
    maths: {
      books: [
        {
          name: "Math-Magic Textbook for Class V",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Fish Tale", slug: "the-fish-tale" },
            { name: "Chapter 2: Shapes and Angles", slug: "shapes-and-angles" },
            { name: "Chapter 3: How Many Squares?", slug: "how-many-squares" },
            { name: "Chapter 4: Parts and Wholes", slug: "parts-and-wholes" },
            { name: "Chapter 5: Does it Look the Same?", slug: "does-it-look-the-same" },
            { name: "Chapter 6: Be My Multiple, I'll be Your Factor", slug: "be-my-multiple-ill-be-your-factor" },
            { name: "Chapter 7: Can You See the Pattern?", slug: "can-you-see-the-pattern" },
            { name: "Chapter 8: Mapping Your Way", slug: "mapping-your-way" },
            { name: "Chapter 9: Boxes and Sketches", slug: "boxes-and-sketches" },
            { name: "Chapter 10: Tenths and Hundredths", slug: "tenths-and-hundredths" },
            { name: "Chapter 11: Area and its Boundary", slug: "area-and-its-boundary" },
            { name: "Chapter 12: Smart Charts", slug: "smart-charts" },
            { name: "Chapter 13: Ways to Multiply and Divide", slug: "ways-to-multiply-and-divide" },
            { name: "Chapter 14: How Big, How Heavy?", slug: "how-big-how-heavy" },
          ],
        },
        {
          name: "गणित का जादू, कक्षा V",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: मछली उछली", slug: "the-fish-tale" },
            { name: "अध्याय 2: आकृतियाँ और कोण", slug: "shapes-and-angles" },
            { name: "अध्याय 3: कितने वर्ग?", slug: "how-many-squares" },
            { name: "अध्याय 4: हिस्से और पूरे", slug: "parts-and-wholes" },
            { name: "अध्याय 5: क्या यह एक जैसा दिखता है?", slug: "does-it-look-the-same" },
            { name: "अध्याय 6: मैं तेरा गुणनखंड, गुणज तू मेरा", slug: "be-my-multiple-ill-be-your-factor" },
            { name: "अध्याय 7: क्या तुम्हें पैटर्न दिखा?", slug: "can-you-see-the-pattern" },
            { name: "अध्याय 8: नक्शा", slug: "mapping-your-way" },
            { name: "अध्याय 9: डिब्बे और स्कैच", slug: "boxes-and-sketches" },
            { name: "अध्याय 10: दसवाँ और सौवाँ भाग", slug: "tenths-and-hundredths" },
            { name: "अध्याय 11: क्षेत्रफल और घेरा", slug: "area-and-its-boundary" },
            { name: "अध्याय 12: स्मार्ट चार्ट", slug: "smart-charts" },
            { name: "अध्याय 13: गुणा और भाग के तरीके", slug: "ways-to-multiply-and-divide" },
            { name: "अध्याय 14: कितना बड़ा, कितना भारी?", slug: "how-big-how-heavy" },
          ]
        }
      ],
    },
    science: {
      books: [
        {
          name: "Looking Around Textbook for Class V",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Super Senses", slug: "super-senses" },
            { name: "Chapter 2: A Snake Charmer's Story", slug: "a-snake-charmers-story" },
            { name: "Chapter 3: From Tasting to Digesting", slug: "from-tasting-to-digesting" },
            { name: "Chapter 4: Mangoes Round the Year", slug: "mangoes-round-the-year" },
            { name: "Chapter 5: Seeds and Seeds", slug: "seeds-and-seeds" },
            { name: "Chapter 6: Every Drop Counts", slug: "every-drop-counts" },
            { name: "Chapter 7: Experiments with Water", slug: "experiments-with-water" },
            { name: "Chapter 8: A Treat for Mosquitoes", slug: "a-treat-for-mosquitoes" },
            { name: "Chapter 9: Up You Go!", slug: "up-you-go" },
            { name: "Chapter 10: Walls Tell Stories", slug: "walls-tell-stories" },
          ],
        },
        {
          name: "आस-पास, कक्षा V",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: कैसे पहचाना चींटी ने दोस्त को?", slug: "super-senses" },
            { name: "अध्याय 2: कहानी सँपेरों की", slug: "a-snake-charmers-story" },
            { name: "अध्याय 3: चखने से पचने तक", slug: "from-tasting-to-digesting" },
            { name: "अध्याय 4: खाएँ आम बारहों महीने", slug: "mangoes-round-the-year" },
            { name: "अध्याय 5: बीज, बीज, बीज", slug: "seeds-and-seeds" },
            { name: "अध्याय 6: बूँद-बूँद, दरिया-दरिया", slug: "every-drop-counts" },
            { name: "अध्याय 7: पानी के प्रयोग", slug: "experiments-with-water" },
            { name: "अध्याय 8: मच्छरों की दावत?", slug: "a-treat-for-mosquitoes" },
            { name: "अध्याय 9: डायरी: कमर सीधी, ऊपर चढ़ो!", slug: "up-you-go" },
            { name: "अध्याय 10: बोलती इमारतें", slug: "walls-tell-stories" },
          ]
        }
      ],
    },
    social: {
      books: [
        {
          name: "Social Studies Class V",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Globes and Maps", slug: "globes-and-maps" },
            { name: "Chapter 2: The Earth's Movements", slug: "the-earths-movements" },
            { name: "Chapter 3: Weather and Climate", slug: "weather-and-climate" },
            { name: "Chapter 4: Major Landforms", slug: "major-landforms" },
            { name: "Chapter 5: Our Rich Heritage", slug: "our-rich-heritage" },
          ],
        },
        {
          name: "सामाजिक अध्ययन, कक्षा V",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: ग्लोब और मानचित्र", slug: "globes-and-maps" },
            { name: "अध्याय 2: पृथ्वी की गतियाँ", slug: "the-earths-movements" },
            { name: "अध्याय 3: मौसम और जलवायु", slug: "weather-and-climate" },
            { name: "अध्याय 4: प्रमुख स्थलाकृतियाँ", slug: "major-landforms" },
            { name: "अध्याय 5: हमारी समृद्ध विरासत", slug: "our-rich-heritage" },
          ]
        }
      ],
    },
    english: {
      books: [
        {
          name: "Marigold Textbook in English for Class V",
          lang: "en",
          chapters: [
            { name: "Unit 1: Ice-Cream Man (Poem) & Wonderful Waste! (Story)", slug: "c5-en-unit1" },
            { name: "Unit 2: Teamwork (Poem) & Flying Together (Story)", slug: "c5-en-unit2" },
            { name: "Unit 3: My Shadow (Poem) & Robinson Crusoe Discovers a Footprint (Story)", slug: "c5-en-unit3" },
            { name: "Unit 4: Crying (Poem) & My Elder Brother (Story)", slug: "c5-en-unit4" },
            { name: "Unit 5: The Lazy Frog (Poem) & Rip Van Winkle (Story)", slug: "c5-en-unit5" },
            { name: "Unit 6: Class Discussion (Poem) & The Talkative Barber (Story)", slug: "c5-en-unit6" },
            { name: "Unit 7: Topsy-turvy Land (Poem) & Gulliver’s Travels (Story)", slug: "c5-en-unit7" },
            { name: "Unit 8: Nobody’s Friend (Poem) & The Little Bully (Story)", slug: "c5-en-unit8" },
            { name: "Unit 9: Sing a Song of People (Poem) & Around the World (Story)", slug: "c5-en-unit9" },
            { name: "Unit 10: Malu Bhalu (Poem) & Who Will be Ningthou? (Story)", slug: "c5-en-unit10" },
          ],
        },
      ],
    }
  },
  'class-6': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class VI",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Knowing Our Numbers", slug: "knowing-our-numbers" },
            { name: "Chapter 2: Whole Numbers", slug: "whole-numbers" },
            { name: "Chapter 3: Playing with Numbers", slug: "playing-with-numbers" },
            { name: "Chapter 4: Basic Geometrical Ideas", slug: "basic-geometrical-ideas" },
            { name: "Chapter 5: Understanding Elementary Shapes", slug: "understanding-elementary-shapes" },
            { name: "Chapter 6: Integers", slug: "integers" },
            { name: "Chapter 7: Fractions", slug: "fractions" },
            { name: "Chapter 8: Decimals", slug: "decimals" },
            { name: "Chapter 9: Data Handling", slug: "data-handling" },
            { name: "Chapter 10: Mensuration", slug: "mensuration" },
            { name: "Chapter 11: Algebra", slug: "algebra" },
            { name: "Chapter 12: Ratio and Proportion", slug: "ratio-and-proportion" },
          ],
        },
        {
          name: "गणित, कक्षा VI",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: अपनी संख्याओं की जानकारी", slug: "knowing-our-numbers" },
            { name: "अध्याय 2: पूर्ण संख्याएँ", slug: "whole-numbers" },
            { name: "अध्याय 3: संख्याओं के साथ खेलना", slug: "playing-with-numbers" },
            { name: "अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ", slug: "basic-geometrical-ideas" },
            { name: "अध्याय 5: प्रारंभिक आकारों को समझना", slug: "understanding-elementary-shapes" },
            { name: "अध्याय 6: पूर्णांक", slug: "integers" },
            { name: "अध्याय 7: भिन्न", slug: "fractions" },
            { name: "अध्याय 8: दशमलव", slug: "decimals" },
            { name: "अध्याय 9: आँकड़ों का प्रबंधन", slug: "data-handling" },
            { name: "अध्याय 10: क्षेत्रमिति", slug: "mensuration" },
            { name: "अध्याय 11: बीजगणित", slug: "algebra" },
            { name: "अध्याय 12: अनुपात और समानुपात", slug: "ratio-and-proportion" },
          ]
        }
      ],
    },
    science: {
      books: [
        {
          name: "Science Textbook for Class VI",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Food: Where Does It Come From?", slug: "food-where-does-it-come-from" },
            { name: "Chapter 2: Components of Food", slug: "components-of-food" },
            { name: "Chapter 3: Fibre to Fabric", slug: "fibre-to-fabric" },
            { name: "Chapter 4: Sorting Materials into Groups", slug: "sorting-materials-into-groups" },
            { name: "Chapter 5: Separation of Substances", slug: "separation-of-substances" },
            { name: "Chapter 6: Changes Around Us", slug: "changes-around-us" },
            { name: "Chapter 7: Getting to Know Plants", slug: "getting-to-know-plants" },
            { name: "Chapter 8: Body Movements", slug: "body-movements" },
            { name: "Chapter 9: The Living Organisms and Their Surroundings", slug: "the-living-organisms-and-their-surroundings" },
            { name: "Chapter 10: Motion and Measurement of Distances", slug: "motion-and-measurement-of-distances" },
            { name: "Chapter 11: Light, Shadows and Reflections", slug: "light-shadows-and-reflections" },
            { name: "Chapter 12: Electricity and Circuits", slug: "electricity-and-circuits" },
          ],
        },
        {
          name: "विज्ञान, कक्षा VI",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भोजन: यह कहाँ से आता है?", slug: "food-where-does-it-come-from" },
            { name: "अध्याय 2: भोजन के घटक", slug: "components-of-food" },
            { name: "अध्याय 3: तंतु से वस्त्र तक", slug: "fibre-to-fabric" },
            { name: "अध्याय 4: वस्तुओं के समूह बनाना", slug: "sorting-materials-into-groups" },
            { name: "अध्याय 5: पदार्थों का पृथक्करण", slug: "separation-of-substances" },
            { name: "अध्याय 6: हमारे चारों ओर के परिवर्तन", slug: "changes-around-us" },
            { name: "अध्याय 7: पौधों को जानिए", slug: "getting-to-know-plants" },
            { name: "अध्याय 8: शरीर में गति", slug: "body-movements" },
            { name: "अध्याय 9: सजीव एवं उनका परिवेश", slug: "the-living-organisms-and-their-surroundings" },
            { name: "अध्याय 10: गति एवं दूरियों का मापन", slug: "motion-and-measurement-of-distances" },
            { name: "अध्याय 11: प्रकाश – छायाएँ एवं परावर्तन", slug: "light-shadows-and-reflections" },
            { name: "अध्याय 12: विद्युत् तथा परिपथ", slug: "electricity-and-circuits" },
          ]
        }
      ],
    },
    social: {
      books: [
        { 
          name: "Our Pasts - I", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: What, Where, How and When?", slug: "what-where-how-and-when" },
            { name: "Chapter 2: On The Trail of The Earliest People", slug: "from-hunting-gathering-to-growing-food" },
            { name: "Chapter 3: In the Earliest Cities", slug: "in-the-earliest-cities" },
            { name: "Chapter 4: What Books and Burials Tell Us", slug: "what-books-and-burials-tell-us" },
            { name: "Chapter 5: Kingdoms, Kings and an Early Republic", slug: "kingdoms-kings-and-an-early-republic" },
            { name: "Chapter 6: New Questions and Ideas", slug: "new-questions-and-ideas" },
            { name: "Chapter 7: Ashoka, The Emperor Who Gave Up War", slug: "ashoka-the-emperor-who-gave-up-war" },
            { name: "Chapter 8: Vital Villages, Thriving Towns", slug: "vital-villages-thriving-towns" },
            { name: "Chapter 9: Traders, Kings and Pilgrims", slug: "traders-kings-and-pilgrims" },
            { name: "Chapter 10: New Empires and Kingdoms", slug: "new-empires-and-kingdoms" },
            { name: "Chapter 11: Buildings, Paintings and Books", slug: "buildings-paintings-and-books" },
          ]
        },
        { 
          name: "The Earth: Our Habitat", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: The Earth in the Solar System", slug: "the-earth-in-the-solar-system" },
            { name: "Chapter 2: Globe: Latitudes and Longitudes", slug: "globe-latitudes-and-longitudes" },
            { name: "Chapter 3: Motions of the Earth", slug: "motions-of-the-earth" },
            { name: "Chapter 4: Maps", slug: "maps" },
            { name: "Chapter 5: Major Domains of the Earth", slug: "major-domains-of-the-earth" },
            { name: "Chapter 6: Major Landforms of the Earth", slug: "major-landforms-of-the-earth" },
            { name: "Chapter 7: Our Country - India", slug: "our-country-india" },
            { name: "Chapter 8: India: Climate, Vegetation and Wildlife", slug: "india-climate-vegetation-and-wildlife" },
          ]
        },
        { 
          name: "Social and Political Life - I", 
          lang: "en", 
          chapters: [
            { name: "Chapter 1: Understanding Diversity", slug: "understanding-diversity" },
            { name: "Chapter 2: Diversity and Discrimination", slug: "diversity-and-discrimination" },
            { name: "Chapter 3: What is Government?", slug: "what-is-government" },
            { name: "Chapter 4: Key Elements of a Democratic Government", slug: "key-elements-of-a-democratic-government" },
            { name: "Chapter 5: Panchayati Raj", slug: "panchayati-raj" },
            { name: "Chapter 6: Rural Administration", slug: "rural-administration" },
            { name: "Chapter 7: Urban Administration", slug: "urban-administration" },
            { name: "Chapter 8: Rural Livelihoods", slug: "rural-livelihoods" },
            { name: "Chapter 9: Urban Livelihoods", slug: "urban-livelihoods" },
          ]
        },
        { 
          name: "हमारे अतीत - I", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: क्या, कब, कहाँ और कैसे?", slug: "what-where-how-and-when" },
            { name: "अध्याय 2: आखेट-खाद्य संग्रह से भोजन उत्पादन तक", slug: "from-hunting-gathering-to-growing-food" },
            { name: "अध्याय 3: आरंभिक नगर", slug: "in-the-earliest-cities" },
            { name: "अध्याय 4: क्या बताती हैं हमें किताबें और कब्रें", slug: "what-books-and-burials-tell-us" },
            { name: "अध्याय 5: राज्य, राजा और एक प्राचीन गणराज्य", slug: "kingdoms-kings-and-an-early-republic" },
            { name: "अध्याय 6: नए प्रश्न नए विचार", slug: "new-questions-and-ideas" },
            { name: "अध्याय 7: अशोक: एक अनोखा सम्राट जिसने युद्ध का त्याग किया", slug: "ashoka-the-emperor-who-gave-up-war" },
            { name: "अध्याय 8: खुशहाल गाँव और समृद्ध शहर", slug: "vital-villages-thriving-towns" },
            { name: "अध्याय 9: व्यापारी, राजा और तीर्थयात्री", slug: "traders-kings-and-pilgrims" },
            { name: "अध्याय 10: नए साम्राज्य और राज्य", slug: "new-empires-and-kingdoms" },
            { name: "अध्याय 11: इमारतें, चित्र तथा किताबें", slug: "buildings-paintings-and-books" },
          ]
        },
        { 
          name: "पृथ्वी: हमारा आवास", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: सौरमंडल में पृथ्वी", slug: "the-earth-in-the-solar-system" },
            { name: "अध्याय 2: ग्लोब: अक्षांश एवं देशांतर", slug: "globe-latitudes-and-longitudes" },
            { name: "अध्याय 3: पृथ्वी की गतियाँ", slug: "motions-of-the-earth" },
            { name: "अध्याय 4: मानचित्र", slug: "maps" },
            { name: "अध्याय 5: पृथ्वी के प्रमुख परिमंडल", slug: "major-domains-of-the-earth" },
            { name: "अध्याय 6: पृथ्वी के प्रमुख स्थलरूप", slug: "major-landforms-of-the-earth" },
            { name: "अध्याय 7: हमारा देश: भारत", slug: "our-country-india" },
            { name: "अध्याय 8: भारत: जलवायु, वनस्पति तथा वन्य प्राणी", slug: "india-climate-vegetation-and-wildlife" },
          ]
        },
        { 
          name: "सामाजिक एवं राजनीतिक जीवन - I", 
          lang: "hi", 
          chapters: [
            { name: "अध्याय 1: विविधता की समझ", slug: "understanding-diversity" },
            { name: "अध्याय 2: विविधता एवं भेदभाव", slug: "diversity-and-discrimination" },
            { name: "अध्याय 3: सरकार क्या है?", slug: "what-is-government" },
            { name: "अध्याय 4: लोकतांत्रिक सरकार के मुख्य तत्त्व", slug: "key-elements-of-a-democratic-government" },
            { name: "अध्याय 5: पंचायती राज", slug: "panchayati-raj" },
            { name: "अध्याय 6: गाँव का प्रशासन", slug: "rural-administration" },
            { name: "अध्याय 7: नगर का प्रशासन", slug: "urban-administration" },
            { name: "अध्याय 8: ग्रामीण क्षेत्र में आजीविका", slug: "rural-livelihoods" },
            { name: "अध्याय 9: शहरी क्षेत्र में आजीविका", slug: "urban-livelihoods" },
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
            { name: "Chapter 1: Who Did Patrick’s Homework?", slug: "c6-en-h-unit1" },
            { name: "Chapter 2: How the Dog Found Himself a New Master!", slug: "c6-en-h-unit2" },
            { name: "Chapter 3: Taro’s Reward", slug: "c6-en-h-unit3" },
            { name: "Chapter 4: An Indian – American Woman in Space: Kalpana Chawla", slug: "c6-en-h-unit4" },
            { name: "Chapter 5: A Different Kind of School", slug: "c6-en-h-unit5" },
            { name: "Chapter 6: Who I Am", slug: "c6-en-h-unit6" },
            { name: "Chapter 7: Fair Play", slug: "c6-en-h-unit7" },
            { name: "Chapter 8: A Game of Chance", slug: "c6-en-h-unit8" },
            { name: "Chapter 9: Desert Animals", slug: "c6-en-h-unit9" },
            { name: "Chapter 10: The Banyan Tree", slug: "c6-en-h-unit10" },
          ],
        },
        {
          name: "A Pact with the Sun",
          lang: "en",
          chapters: [
            { name: "Chapter 1: A Tale of Two Birds", slug: "c6-en-p-unit1" },
            { name: "Chapter 2: The Friendly Mongoose", slug: "c6-en-p-unit2" },
            { name: "Chapter 3: The Shepherd’s Treasure", slug: "c6-en-p-unit3" },
          ],
        },
      ],
    },
  },
  'class-7': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class VII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Integers", slug: "integers-7" },
            { name: "Chapter 2: Fractions and Decimals", slug: "fractions-and-decimals-7" },
            { name: "Chapter 3: Data Handling", slug: "data-handling-7" },
            { name: "Chapter 4: Simple Equations", slug: "simple-equations" },
            { name: "Chapter 5: Lines and Angles", slug: "lines-and-angles" },
            { name: "Chapter 6: The Triangle and its Properties", slug: "the-triangle-and-its-properties" },
            { name: "Chapter 7: Congruence of Triangles", slug: "congruence-of-triangles" },
            { name: "Chapter 8: Comparing Quantities", slug: "comparing-quantities-7" },
            { name: "Chapter 9: Rational Numbers", slug: "rational-numbers-7" },
            { name: "Chapter 10: Practical Geometry", slug: "practical-geometry" },
            { name: "Chapter 11: Perimeter and Area", slug: "perimeter-and-area" },
            { name: "Chapter 12: Algebraic Expressions", slug: "algebraic-expressions" },
            { name: "Chapter 13: Exponents and Powers", slug: "exponents-and-powers-7" },
            { name: "Chapter 14: Symmetry", slug: "symmetry" },
            { name: "Chapter 15: Visualising Solid Shapes", slug: "visualising-solid-shapes" },
          ],
        },
        {
          name: "गणित, कक्षा VII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पूर्णांक", slug: "integers-7" },
            { name: "अध्याय 2: भिन्न एवं दशमलव", slug: "fractions-and-decimals-7" },
            { name: "अध्याय 3: आँकड़ो का प्रबंधन", slug: "data-handling-7" },
            { name: "अध्याय 4: सरल समीकरण", slug: "simple-equations" },
            { name: "अध्याय 5: रेखा एवं कोण", slug: "lines-and-angles" },
            { name: "अध्याय 6: त्रिभुज और उसके गुण", slug: "the-triangle-and-its-properties" },
            { name: "अध्याय 7: त्रिभुजों की सर्वांगसमता", slug: "congruence-of-triangles" },
            { name: "अध्याय 8: राशियों की तुलना", slug: "comparing-quantities-7" },
            { name: "अध्याय 9: परिमेय संख्याएँ", slug: "rational-numbers-7" },
            { name: "अध्याय 10: प्रायोगिक ज्यामिति", slug: "practical-geometry" },
            { name: "अध्याय 11: परिमाप और क्षेत्रफल", slug: "perimeter-and-area" },
            { name: "अध्याय 12: बीजीय व्यंजक", slug: "algebraic-expressions" },
            { name: "अध्याय 13: घातांक और घात", slug: "exponents-and-powers-7" },
            { name: "अध्याय 14: सममिति", slug: "symmetry" },
            { name: "अध्याय 15: ठोस आकारों का चित्रण", slug: "visualising-solid-shapes" },
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
            { name: "Chapter 1: Nutrition in Plants", slug: "nutrition-in-plants" },
            { name: "Chapter 2: Nutrition in Animals", slug: "nutrition-in-animals" },
            { name: "Chapter 3: Fibre to Fabric", slug: "fibre-to-fabric-7" },
            { name: "Chapter 4: Heat", slug: "heat" },
            { name: "Chapter 5: Acids, Bases and Salts", slug: "acids-bases-and-salts-7" },
            { name: "Chapter 6: Physical and Chemical Changes", slug: "physical-and-chemical-changes" },
            { name: "Chapter 7: Weather, Climate and Adaptations of Animals to Climate", slug: "weather-climate-and-adaptations" },
            { name: "Chapter 8: Winds, Storms and Cyclones", slug: "winds-storms-and-cyclones" },
            { name: "Chapter 9: Soil", slug: "soil" },
            { name: "Chapter 10: Respiration in Organisms", slug: "respiration-in-organisms" },
            { name: "Chapter 11: Transportation in Animals and Plants", slug: "transportation-in-animals-and-plants" },
            { name: "Chapter 12: Reproduction in Plants", slug: "reproduction-in-plants" },
            { name: "Chapter 13: Motion and Time", slug: "motion-and-time" },
            { name: "Chapter 14: Electric Current and its Effects", slug: "electric-current-and-its-effects" },
            { name: "Chapter 15: Light", slug: "light-7" },
            { name: "Chapter 16: Water: A Precious Resource", slug: "water-a-precious-resource" },
            { name: "Chapter 17: Forests: Our Lifeline", slug: "forests-our-lifeline" },
            { name: "Chapter 18: Wastewater Story", slug: "wastewater-story" },
          ],
        },
        {
          name: "विज्ञान, कक्षा VII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पादपों में पोषण", slug: "nutrition-in-plants" },
            { name: "अध्याय 2: प्राणियों में पोषण", slug: "nutrition-in-animals" },
            { name: "अध्याय 3: रेशों से वस्त्र तक", slug: "fibre-to-fabric-7" },
            { name: "अध्याय 4: ऊष्मा", slug: "heat" },
            { name: "अध्याय 5: अम्ल, क्षारक और लवण", slug: "acids-bases-and-salts-7" },
            { name: "अध्याय 6: भौतिक एवं रासायनिक परिवर्तन", slug: "physical-and-chemical-changes" },
            { name: "अध्याय 7: मौसम, जलवायु तथा जलवायु के अनुरूप जंतुओं द्वारा अनुकूलन", slug: "weather-climate-and-adaptations" },
            { name: "अध्याय 8: पवन, तूफ़ान और चक्रवात", slug: "winds-storms-and-cyclones" },
            { name: "अध्याय 9: मृदा", slug: "soil" },
            { name: "अध्याय 10: जीवों में श्वसन", slug: "respiration-in-organisms" },
            { name: "अध्याय 11: जंतुओं और पादप में परिवहन", slug: "transportation-in-animals-and-plants" },
            { name: "अध्याय 12: पादप में जनन", slug: "reproduction-in-plants" },
            { name: "अध्याय 13: गति एवं समय", slug: "motion-and-time" },
            { name: "अध्याय 14: विद्युत धारा और इसके प्रभाव", slug: "electric-current-and-its-effects" },
            { name: "अध्याय 15: प्रकाश", slug: "light-7" },
            { name: "अध्याय 16: जल: एक बहुमूल्य संसाधन", slug: "water-a-precious-resource" },
            { name: "अध्याय 17: वन: हमारी जीवन रेखा", slug: "forests-our-lifeline" },
            { name: "अध्याय 18: अपशिष्ट जल की कहानी", slug: "wastewater-story" },
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
            { name: "Chapter 1: Tracing Changes Through A Thousand Years", slug: "tracing-changes-through-a-thousand-years" },
            { name: "Chapter 2: New Kings And Kingdoms", slug: "new-kings-and-kingdoms" },
            { name: "Chapter 3: The Delhi Sultans", slug: "the-delhi-sultans" },
            { name: "Chapter 4: The Mughal Empire", slug: "the-mughal-empire" },
            { name: "Chapter 5: Rulers And Buildings", slug: "rulers-and-buildings" },
            { name: "Chapter 6: Towns, Traders And Craftspersons", slug: "towns-traders-and-craftspersons" },
            { name: "Chapter 7: Tribes, Nomads And Settled Communities", slug: "tribes-nomads-and-settled-communities" },
            { name: "Chapter 8: Devotional Paths To The Divine", slug: "devotional-paths-to-the-divine" },
          ],
        },
        {
          name: "Our Environment",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Environment", slug: "environment" },
            { name: "Chapter 2: Inside Our Earth", slug: "inside-our-earth" },
            { name: "Chapter 3: Our Changing Earth", slug: "our-changing-earth" },
            { name: "Chapter 4: Air", slug: "air" },
            { name: "Chapter 5: Water", slug: "water" },
            { name: "Chapter 6: Human Environment–Interaction: The Tropical and the Subtropical Region", slug: "human-environment-interaction-tropical-subtropical" },
            { name: "Chapter 7: Life in the Deserts", slug: "life-in-the-deserts" },
          ],
        },
        {
          name: "Social and Political Life - II",
          lang: "en",
          chapters: [
            { name: "Chapter 1: On Equality", slug: "on-equality" },
            { name: "Chapter 2: Role of the Government in Health", slug: "role-of-government-in-health" },
            { name: "Chapter 3: How the State Government Works", slug: "how-the-state-government-works" },
            { name: "Chapter 4: Growing Up as Boys and Girls", slug: "growing-up-as-boys-and-girls" },
            { name: "Chapter 5: Women Change the World", slug: "women-change-the-world" },
            { name: "Chapter 6: Understanding Media", slug: "understanding-media" },
            { name: "Chapter 7: Markets Around Us", slug: "markets-around-us" },
            { name: "Chapter 8: A Shirt in the Market", slug: "a-shirt-in-the-market" },
          ],
        },
        {
          name: "हमारे अतीत - II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: हज़ार वर्षों के दौरान हुए परिवर्तनों की पड़ताल", slug: "tracing-changes-through-a-thousand-years" },
            { name: "अध्याय 2: नये राजा और उनके राज्य", slug: "new-kings-and-kingdoms" },
            { name: "अध्याय 3: दिल्ली के सुलतान", slug: "the-delhi-sultans" },
            { name: "अध्याय 4: मुग़ल साम्राज्य", slug: "the-mughal-empire" },
            { name: "अध्याय 5: शासक और इमारतें", slug: "rulers-and-buildings" },
            { name: "अध्याय 6: नगर, व्यापारी और शिल्पीजन", slug: "towns-traders-and-craftspersons" },
            { name: "अध्याय 7: जनजातियाँ, खानाबदोश और एक जगह बसे हुए समुदाय", slug: "tribes-nomads-and-settled-communities" },
            { name: "अध्याय 8: ईश्वर से अनुराग", slug: "devotional-paths-to-the-divine" },
          ],
        },
        {
          name: "हमारा पर्यावरण",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पर्यावरण", slug: "environment" },
            { name: "अध्याय 2: हमारी पृथ्वी के अंदर", slug: "inside-our-earth" },
            { name: "अध्याय 3: हमारी बदलती पृथ्वी", slug: "our-changing-earth" },
            { name: "अध्याय 4: वायु", slug: "air" },
            { name: "अध्याय 5: जल", slug: "water" },
            { name: "अध्याय 6: मानव-पर्यावरण अन्योन्यक्रिया: उष्णकटिबंधीय एवं उपोष्ण प्रदेश", slug: "human-environment-interaction-tropical-subtropical" },
            { name: "अध्याय 7: रेगिस्तान में जीवन", slug: "life-in-the-deserts" },
          ],
        },
        {
          name: "सामाजिक एवं राजनीतिक जीवन - II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समानता", slug: "on-equality" },
            { name: "अध्याय 2: स्वास्थ्य में सरकार की भूमिका", slug: "role-of-government-in-health" },
            { name: "अध्याय 3: राज्य शासन कैसे काम करता है", slug: "how-the-state-government-works" },
            { name: "अध्याय 4: लड़के और लड़कियों के रूप में बड़ा होना", slug: "growing-up-as-boys-and-girls" },
            { name: "अध्याय 5: औरतों ने बदली दुनिया", slug: "women-change-the-world" },
            { name: "अध्याय 6: संचार माध्यमों को समझना", slug: "understanding-media" },
            { name: "अध्याय 7: हमारे आस-पास के बाज़ार", slug: "markets-around-us" },
            { name: "अध्याय 8: बाज़ार में एक कमीज़", slug: "a-shirt-in-the-market" },
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
            { name: "Chapter 1: Three Questions", slug: "c7-en-h-unit1" },
            { name: "Chapter 2: A Gift of Chappals", slug: "c7-en-h-unit2" },
            { name: "Chapter 3: Gopal and the Hilsa Fish", slug: "c7-en-h-unit3" },
            { name: "Chapter 4: The Ashes That Made Trees Bloom", slug: "c7-en-h-unit4" },
            { name: "Chapter 5: Quality", slug: "c7-en-h-unit5" },
          ],
        },
        {
          name: "An Alien Hand",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Tiny Teacher", slug: "c7-en-a-unit1" },
            { name: "Chapter 2: Bringing Up Kari", slug: "c7-en-a-unit2" },
            { name: "Chapter 3: The Desert", slug: "c7-en-a-unit3" },
          ],
        },
      ],
    }
  },
  'class-8': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class VIII",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Rational Numbers", slug: "rational-numbers" },
            { name: "Chapter 2: Linear Equations in One Variable", slug: "linear-equations-in-one-variable" },
            { name: "Chapter 3: Understanding Quadrilaterals", slug: "understanding-quadrilaterals" },
            { name: "Chapter 4: Data Handling", slug: "data-handling-8" },
            { name: "Chapter 5: Squares and Square Roots", slug: "squares-and-square-roots" },
            { name: "Chapter 6: Cubes and Cube Roots", slug: "cubes-and-cube-roots" },
            { name: "Chapter 7: Comparing Quantities", slug: "comparing-quantities" },
            { name: "Chapter 8: Algebraic Expressions and Identities", slug: "algebraic-expressions-and-identities" },
            { name: "Chapter 9: Mensuration", slug: "mensuration-8" },
            { name: "Chapter 10: Exponents and Powers", slug: "exponents-and-powers" },
            { name: "Chapter 11: Direct and Inverse Proportions", slug: "direct-and-inverse-proportions" },
            { name: "Chapter 12: Factorisation", slug: "factorisation" },
            { name: "Chapter 13: Introduction to Graphs", slug: "introduction-to-graphs" },
          ],
        },
        {
          name: "गणित, कक्षा VIII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिमेय संख्याएँ", slug: "rational-numbers" },
            { name: "अध्याय 2: एक चर वाले रैखिक समीकरण", slug: "linear-equations-in-one-variable" },
            { name: "अध्याय 3: चतुर्भुजों को समझना", slug: "understanding-quadrilaterals" },
            { name: "अध्याय 4: आँकड़ों का प्रबंधन", slug: "data-handling-8" },
            { name: "अध्याय 5: वर्ग और वर्गमूल", slug: "squares-and-square-roots" },
            { name: "अध्याय 6: घन और घनमूल", slug: "cubes-and-cube-roots" },
            { name: "अध्याय 7: राशियों की तुलना", slug: "comparing-quantities" },
            { name: "अध्याय 8: बीजीय व्यंजक एवं सर्वसमिकाएँ", slug: "algebraic-expressions-and-identities" },
            { name: "अध्याय 9: क्षेत्रमिति", slug: "mensuration-8" },
            { name: "अध्याय 10: घातांक और घात", slug: "exponents-and-powers" },
            { name: "अध्याय 11: सीधा और प्रतिलोम समानुपात", slug: "direct-and-inverse-proportions" },
            { name: "अध्याय 12: गुणनखंडन", slug: "factorisation" },
            { name: "अध्याय 13: आलेखों से परिचय", slug: "introduction-to-graphs" },
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
            { name: "Chapter 1: Crop Production and Management", slug: "crop-production-and-management" },
            { name: "Chapter 2: Microorganisms: Friend and Foe", slug: "microorganisms-friend-and-foe" },
            { name: "Chapter 3: Coal and Petroleum", slug: "coal-and-petroleum" },
            { name: "Chapter 4: Combustion and Flame", slug: "combustion-and-flame" },
            { name: "Chapter 5: Conservation of Plants and Animals", slug: "conservation-of-plants-and-animals" },
            { name: "Chapter 6: Reproduction in Animals", slug: "reproduction-in-animals" },
            { name: "Chapter 7: Reaching the Age of Adolescence", slug: "reaching-the-age-of-adolescence" },
            { name: "Chapter 8: Force and Pressure", slug: "force-and-pressure" },
            { name: "Chapter 9: Friction", slug: "friction" },
            { name: "Chapter 10: Sound", slug: "sound-8" },
            { name: "Chapter 11: Chemical Effects of Electric Current", slug: "chemical-effects-of-electric-current" },
            { name: "Chapter 12: Some Natural Phenomena", slug: "some-natural-phenomena" },
            { name: "Chapter 13: Light", slug: "light" },
          ],
        },
        {
          name: "विज्ञान, कक्षा VIII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: फसल उत्पादन एवं प्रबंध", slug: "crop-production-and-management" },
            { name: "अध्याय 2: सूक्ष्मजीव: मित्र एवं शत्रु", slug: "microorganisms-friend-and-foe" },
            { name: "अध्याय 3: कोयला और पेट्रोलियम", slug: "coal-and-petroleum" },
            { name: "अध्याय 4: दहन और ज्वाला", slug: "combustion-and-flame" },
            { name: "अध्याय 5: पौधों एवं जंतुओं का संरक्षण", slug: "conservation-of-plants-and-animals" },
            { name: "अध्याय 6: जंतुओं में जनन", slug: "reproduction-in-animals" },
            { name: "अध्याय 7: किशोरावस्था की ओर", slug: "reaching-the-age-of-adolescence" },
            { name: "अध्याय 8: बल तथा दाब", slug: "force-and-pressure" },
            { name: "अध्याय 9: घर्षण", slug: "friction" },
            { name: "अध्याय 10: ध्वनि", slug: "sound-8" },
            { name: "अध्याय 11: विद्युत धारा के रासायनिक प्रभाव", slug: "chemical-effects-of-electric-current" },
            { name: "अध्याय 12: कुछ प्राकृतिक परिघटनाएँ", slug: "some-natural-phenomena" },
            { name: "अध्याय 13: प्रकाश", slug: "light" },
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
            { name: "Chapter 1: How, When and Where", slug: "how-when-and-where" },
            { name: "Chapter 2: From Trade to Territory", slug: "from-trade-to-territory" },
            { name: "Chapter 3: Ruling the Countryside", slug: "ruling-the-countryside" },
            { name: "Chapter 4: Tribals, Dikus and the Vision of a Golden Age", slug: "tribals-dikus-and-the-vision-of-a-golden-age" },
            { name: "Chapter 5: When People Rebel", slug: "when-people-rebel" },
            { name: "Chapter 6: Weavers, Iron Smelters and Factory Owners", slug: "weavers-iron-smelters-and-factory-owners" },
            { name: "Chapter 7: Civilising the 'Native', Educating the Nation", slug: "civilising-the-native-educating-the-nation" },
            { name: "Chapter 8: Women, Caste and Reform", slug: "women-caste-and-reform" },
            { name: "Chapter 9: The Making of the National Movement: 1870s-1947", slug: "the-making-of-the-national-movement" },
            { name: "Chapter 10: India After Independence", slug: "india-after-independence" },
          ],
        },
        {
          name: "Resources and Development",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Resources", slug: "resources" },
            { name: "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources", slug: "land-soil-water-natural-vegetation-and-wildlife-resources" },
            { name: "Chapter 3: Agriculture", slug: "agriculture-8" },
            { name: "Chapter 4: Industries", slug: "industries" },
            { name: "Chapter 5: Human Resources", slug: "human-resources" },
          ],
        },
        {
          name: "Social and Political Life - III",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Indian Constitution", slug: "the-indian-constitution" },
            { name: "Chapter 2: Understanding Secularism", slug: "understanding-secularism" },
            { name: "Chapter 3: Parliament and the Making of Laws", slug: "parliament-and-the-making-of-laws" },
            { name: "Chapter 4: The Judiciary", slug: "the-judiciary" },
            { name: "Chapter 5: Understanding Marginalisation", slug: "understanding-marginalisation" },
            { name: "Chapter 6: Confronting Marginalisation", slug: "confronting-marginalisation" },
            { name: "Chapter 7: Public Facilities", slug: "public-facilities" },
            { name: "Chapter 8: Law and Social Justice", slug: "law-and-social-justice" },
          ],
        },
        {
          name: "हमारे अतीत - III",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: कैसे, कब और कहाँ", slug: "how-when-and-where" },
            { name: "अध्याय 2: व्यापार से साम्राज्य तक", slug: "from-trade-to-territory" },
            { name: "अध्याय 3: ग्रामीण क्षेत्र पर शासन चलाना", slug: "ruling-the-countryside" },
            { name: "अध्याय 4: आदिवासी, दीकु और एक स्वर्ण युग की कल्पना", slug: "tribals-dikus-and-the-vision-of-a-golden-age" },
            { name: "अध्याय 5: जब जनता बग़ावत करती है", slug: "when-people-rebel" },
            { name: "अध्याय 6: बुनकर, लोहा बनाने वाले और फैक्ट्री मालिक", slug: "weavers-iron-smelters-and-factory-owners" },
            { name: "अध्याय 7: 'देशी' जनता को सभ्य बनाना, राष्ट्र को शिक्षित करना", slug: "civilising-the-native-educating-the-nation" },
            { name: "अध्याय 8: महिलाएँ, जाति एवं सुधार", slug: "women-caste-and-reform" },
            { name: "अध्याय 9: राष्ट्रीय आंदोलन का संघटन: 1870 के दशक से 1947 तक", slug: "the-making-of-the-national-movement" },
            { name: "अध्याय 10: स्वतंत्रता के बाद भारत", slug: "india-after-independence" },
          ],
        },
        {
          name: "संसाधन एवं विकास",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संसाधन", slug: "resources" },
            { name: "अध्याय 2: भूमि, मृदा, जल, प्राकृतिक वनस्पति और वन्य जीवन संसाधन", slug: "land-soil-water-natural-vegetation-and-wildlife-resources" },
            { name: "अध्याय 3: कृषि", slug: "agriculture-8" },
            { name: "अध्याय 4: उद्योग", slug: "industries" },
            { name: "अध्याय 5: मानव संसाधन", slug: "human-resources" },
          ],
        },
        {
          name: "सामाजिक एवं राजनीतिक जीवन - III",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारतीय संविधान", slug: "the-indian-constitution" },
            { name: "अध्याय 2: धर्मनिरपेक्षता की समझ", slug: "understanding-secularism" },
            { name: "अध्याय 3: संसद तथा कानूनों का निर्माण", slug: "parliament-and-the-making-of-laws" },
            { name: "अध्याय 4: न्यायपालिका", slug: "the-judiciary" },
            { name: "अध्याय 5: हाशियाकरण की समझ", slug: "understanding-marginalisation" },
            { name: "अध्याय 6: हाशियाकरण से निपटना", slug: "confronting-marginalisation" },
            { name: "अध्याय 7: जनसुविधाएँ", slug: "public-facilities" },
            { name: "अध्याय 8: कानून और सामाजिक न्याय", slug: "law-and-social-justice" },
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
            { name: "Chapter 1: The Best Christmas Present in the World", slug: "c8-en-h-unit1" },
            { name: "Chapter 2: The Tsunami", slug: "c8-en-h-unit2" },
            { name: "Chapter 3: Glimpses of the Past", slug: "c8-en-h-unit3" },
            { name: "Chapter 4: Bepin Choudhury’s Lapse of Memory", slug: "c8-en-h-unit4" },
          ],
        },
        {
          name: "It So Happened",
          lang: "en",
          chapters: [
            { name: "Chapter 1: How the Camel got his Hump", slug: "c8-en-i-unit1" },
            { name: "Chapter 2: Children at Work", slug: "c8-en-i-unit2" },
            { name: "Chapter 3: The Selfish Giant", slug: "c8-en-i-unit3" },
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
            { name: "Chapter 1: Number Systems", slug: "number-systems" },
            { name: "Chapter 2: Polynomials", slug: "polynomials" },
            { name: "Chapter 3: Coordinate Geometry", slug: "coordinate-geometry" },
            { name: "Chapter 4: Linear Equations in Two Variables", slug: "linear-equations-in-two-variables" },
            { name: "Chapter 5: Introduction to Euclid's Geometry", slug: "introduction-to-euclids-geometry" },
            { name: "Chapter 6: Lines and Angles", slug: "lines-and-angles-9" },
            { name: "Chapter 7: Triangles", slug: "triangles-9" },
            { name: "Chapter 8: Quadrilaterals", slug: "quadrilaterals" },
            { name: "Chapter 9: Circles", slug: "circles-9" },
            { name: "Chapter 10: Heron's Formula", slug: "herons-formula" },
            { name: "Chapter 11: Surface Areas and Volumes", slug: "surface-areas-and-volumes-9" },
            { name: "Chapter 12: Statistics", slug: "statistics-9" },
          ],
        },
        {
          name: "गणित, कक्षा IX",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संख्या पद्धति", slug: "number-systems" },
            { name: "अध्याय 2: बहुपद", slug: "polynomials" },
            { name: "अध्याय 3: निर्देशांक ज्यामिति", slug: "coordinate-geometry" },
            { name: "अध्याय 4: दो चरों वाले रैखिक समीकरण", slug: "linear-equations-in-two-variables" },
            { name: "अध्याय 5: यूक्लिड की ज्यामिति का परिचय", slug: "introduction-to-euclids-geometry" },
            { name: "अध्याय 6: रेखाएँ और कोण", slug: "lines-and-angles-9" },
            { name: "अध्याय 7: त्रिभुज", slug: "triangles-9" },
            { name: "अध्याय 8: चतुर्भुज", slug: "quadrilaterals" },
            { name: "अध्याय 9: वृत्त", slug: "circles-9" },
            { name: "अध्याय 10: हीरोन का सूत्र", slug: "herons-formula" },
            { name: "अध्याय 11: पृष्ठीय क्षेत्रफल और आयतन", slug: "surface-areas-and-volumes-9" },
            { name: "अध्याय 12: सांख्यिकी", slug: "statistics-9" },
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
            { name: "Chapter 1: Matter in Our Surroundings", slug: "matter-in-our-surroundings" },
            { name: "Chapter 2: Is Matter Around Us Pure", slug: "is-matter-around-us-pure" },
            { name: "Chapter 3: Atoms and Molecules", slug: "atoms-and-molecules" },
            { name: "Chapter 4: Structure of the Atom", slug: "structure-of-the-atom" },
            { name: "Chapter 5: The Fundamental Unit of Life", slug: "the-fundamental-unit-of-life" },
            { name: "Chapter 6: Tissues", slug: "tissues" },
            { name: "Chapter 7: Motion", slug: "motion" },
            { name: "Chapter 8: Force and Laws of Motion", slug: "force-and-laws-of-motion" },
            { name: "Chapter 9: Gravitation", slug: "gravitation" },
            { name: "Chapter 10: Work and Energy", slug: "work-and-energy" },
            { name: "Chapter 11: Sound", slug: "sound" },
            { name: "Chapter 12: Improvement in Food Resources", slug: "improvement-in-food-resources" },
          ],
        },
        {
          name: "विज्ञान, कक्षा IX",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: हमारे आस-पास के पदार्थ", slug: "matter-in-our-surroundings" },
            { name: "अध्याय 2: क्या हमारे आस-पास के पदार्थ शुद्ध हैं", slug: "is-matter-around-us-pure" },
            { name: "अध्याय 3: परमाणु एवं अणु", slug: "atoms-and-molecules" },
            { name: "अध्याय 4: परमाणु की संरचना", slug: "structure-of-the-atom" },
            { name: "अध्याय 5: जीवन की मौलिक इकाई", slug: "the-fundamental-unit-of-life" },
            { name: "अध्याय 6: ऊतक", slug: "tissues" },
            { name: "अध्याय 7: गति", slug: "motion" },
            { name: "अध्याय 8: बल तथा गति के नियम", slug: "force-and-laws-of-motion" },
            { name: "अध्याय 9: गुरुत्वाकर्षण", slug: "gravitation" },
            { name: "अध्याय 10: कार्य तथा ऊर्जा", slug: "work-and-energy" },
            { name: "अध्याय 11: ध्वनि", slug: "sound" },
            { name: "अध्याय 12: खाद्य संसाधनों में सुधार", slug: "improvement-in-food-resources" },
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
            { name: "Chapter 1: The French Revolution", slug: "the-french-revolution" },
            { name: "Chapter 2: Socialism in Europe and the Russian Revolution", slug: "socialism-in-europe-and-the-russian-revolution" },
            { name: "Chapter 3: Nazism and the Rise of Hitler", slug: "nazism-and-the-rise-of-hitler" },
            { name: "Chapter 4: Forest Society and Colonialism", slug: "forest-society-and-colonialism" },
            { name: "Chapter 5: Pastoralists in the Modern World", slug: "pastoralists-in-the-modern-world" },
          ],
        },
        {
          name: "Contemporary India - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: India - Size and Location", slug: "india-size-and-location" },
            { name: "Chapter 2: Physical Features of India", slug: "physical-features-of-india" },
            { name: "Chapter 3: Drainage", slug: "drainage" },
            { name: "Chapter 4: Climate", slug: "climate" },
            { name: "Chapter 5: Natural Vegetation and Wildlife", slug: "natural-vegetation-and-wildlife" },
            { name: "Chapter 6: Population", slug: "population" },
          ],
        },
        {
          name: "Democratic Politics - I",
          lang: "en",
          chapters: [
            { name: "Chapter 1: What is Democracy? Why Democracy?", slug: "what-is-democracy-why-democracy" },
            { name: "Chapter 2: Constitutional Design", slug: "constitutional-design" },
            { name: "Chapter 3: Electoral Politics", slug: "electoral-politics" },
            { name: "Chapter 4: Working of Institutions", slug: "working-of-institutions" },
            { name: "Chapter 5: Democratic Rights", slug: "democratic-rights" },
          ],
        },
        {
          name: "Economics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Story of Village Palampur", slug: "the-story-of-village-palampur" },
            { name: "Chapter 2: People as Resource", slug: "people-as-resource" },
            { name: "Chapter 3: Poverty as a Challenge", slug: "poverty-as-a-challenge" },
            { name: "Chapter 4: Food Security in India", slug: "food-security-in-india" },
          ],
        },
        {
          name: "भारत और समकालीन विश्व - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: फ्रांसीसी क्रांति", slug: "the-french-revolution" },
            { name: "अध्याय 2: यूरोप में समाजवाद एवं रूसी क्रांति", slug: "socialism-in-europe-and-the-russian-revolution" },
            { name: "अध्याय 3: नात्सीवाद और हिटलर का उदय", slug: "nazism-and-the-rise-of-hitler" },
            { name: "अध्याय 4: वन्य समाज एवं उपनिवेशवाद", slug: "forest-society-and-colonialism" },
            { name: "अध्याय 5: आधुनिक विश्व में चरवाहे", slug: "pastoralists-in-the-modern-world" },
          ],
        },
        {
          name: "समकालीन भारत - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारत - आकार और स्थिति", slug: "india-size-and-location" },
            { name: "अध्याय 2: भारत का भौतिक स्वरूप", slug: "physical-features-of-india" },
            { name: "अध्याय 3: अपवाह", slug: "drainage" },
            { name: "अध्याय 4: जलवायु", slug: "climate" },
            { name: "अध्याय 5: प्राकृतिक वनस्पति तथा वन्य प्राणी", slug: "natural-vegetation-and-wildlife" },
            { name: "अध्याय 6: जनसंख्या", slug: "population" },
          ],
        },
        {
          name: "लोकतांत्रिक राजनीति - I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: लोकतंत्र क्या? लोकतंत्र क्यों?", slug: "what-is-democracy-why-democracy" },
            { name: "अध्याय 2: संविधान निर्माण", slug: "constitutional-design" },
            { name: "अध्याय 3: चुनावी राजनीति", slug: "electoral-politics" },
            { name: "अध्याय 4: संस्थाओं का कामकाज", slug: "working-of-institutions" },
            { name: "अध्याय 5: लोकतांत्रिक अधिकार", slug: "democratic-rights" },
          ],
        },
        {
          name: "अर्थशास्त्र",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पालमपुर गाँव की कहानी", slug: "the-story-of-village-palampur" },
            { name: "अध्याय 2: संसाधन के रूप में लोग", slug: "people-as-resource" },
            { name: "अध्याय 3: निर्धनता: एक चुनौती", slug: "poverty-as-a-challenge" },
            { name: "अध्याय 4: भारत में खाद्य सुरक्षा", slug: "food-security-in-india" },
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
            { name: "Chapter 1: The Fun They Had", slug: "the-fun-they-had" },
            { name: "Chapter 2: The Sound of Music", slug: "the-sound-of-music" },
            { name: "Chapter 3: The Little Girl", slug: "the-little-girl" },
          ],
        },
        {
          name: "Moments",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Lost Child", slug: "the-lost-child" },
            { name: "Chapter 2: The Adventures of Toto", slug: "the-adventures-of-toto" },
            { name: "Chapter 3: Iswaran the Storyteller", slug: "iswaran-the-storyteller" },
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
            { name: "Chapter 1: Real Numbers", slug: "real-numbers" },
            { name: "Chapter 2: Polynomials", slug: "polynomials-10" },
            { name: "Chapter 3: Pair of Linear Equations in Two Variables", slug: "pair-of-linear-equations-in-two-variables" },
            { name: "Chapter 4: Quadratic Equations", slug: "quadratic-equations" },
            { name: "Chapter 5: Arithmetic Progressions", slug: "arithmetic-progressions" },
            { name: "Chapter 6: Triangles", slug: "triangles" },
            { name: "Chapter 7: Coordinate Geometry", slug: "coordinate-geometry-10" },
            { name: "Chapter 8: Introduction to Trigonometry", slug: "introduction-to-trigonometry" },
            { name: "Chapter 9: Some Applications of Trigonometry", slug: "some-applications-of-trigonometry" },
            { name: "Chapter 10: Circles", slug: "circles" },
            { name: "Chapter 11: Areas Related to Circles", slug: "areas-related-to-circles" },
            { name: "Chapter 12: Surface Areas and Volumes", slug: "surface-areas-and-volumes" },
            { name: "Chapter 13: Statistics", slug: "statistics" },
            { name: "Chapter 14: Probability", slug: "probability" },
          ],
        },
        {
          name: "गणित, कक्षा X",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: वास्तविक संख्याएँ", slug: "real-numbers" },
            { name: "अध्याय 2: बहुपद", slug: "polynomials-10" },
            { name: "अध्याय 3: दो चर वाले रैखिक समीकरण युग्म", slug: "pair-of-linear-equations-in-two-variables" },
            { name: "अध्याय 4: द्विघात समीकरण", slug: "quadratic-equations" },
            { name: "अध्याय 5: समांतर श्रेढ़ियाँ", slug: "arithmetic-progressions" },
            { name: "अध्याय 6: त्रिभुज", slug: "triangles" },
            { name: "अध्याय 7: निर्देशांक ज्यामिति", slug: "coordinate-geometry-10" },
            { name: "अध्याय 8: त्रिकोणमिति का परिचय", slug: "introduction-to-trigonometry" },
            { name: "अध्याय 9: त्रिकोणमिति के कुछ अनुप्रयोग", slug: "some-applications-of-trigonometry" },
            { name: "अध्याय 10: वृत्त", slug: "circles" },
            { name: "अध्याय 11: वृत्तों से संबंधित क्षेत्रफल", slug: "areas-related-to-circles" },
            { name: "अध्याय 12: पृष्ठीय क्षेत्रफल और आयतन", slug: "surface-areas-and-volumes" },
            { name: "अध्याय 13: सांख्यिकी", slug: "statistics" },
            { name: "अध्याय 14: प्रायिकता", slug: "probability" },
          ],
        },
      ],
    }
  },
  'class-11': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class XI",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Sets", slug: "sets" },
            { name: "Chapter 2: Relations and Functions", slug: "relations-and-functions" },
            { name: "Chapter 3: Trigonometric Functions", slug: "trigonometric-functions" },
            { name: "Chapter 4: Principle of Mathematical Induction", slug: "principle-of-mathematical-induction" },
            { name: "Chapter 5: Complex Numbers and Quadratic Equations", slug: "complex-numbers-and-quadratic-equations" },
            { name: "Chapter 6: Linear Inequalities", slug: "linear-inequalities" },
            { name: "Chapter 7: Permutations and Combinations", slug: "permutations-and-combinations" },
            { name: "Chapter 8: Binomial Theorem", slug: "binomial-theorem" },
            { name: "Chapter 9: Sequences and Series", slug: "sequences-and-series" },
            { name: "Chapter 10: Straight Lines", slug: "straight-lines" },
            { name: "Chapter 11: Conic Sections", slug: "conic-sections" },
            { name: "Chapter 12: Introduction to Three Dimensional Geometry", slug: "introduction-to-three-dimensional-geometry" },
            { name: "Chapter 13: Limits and Derivatives", slug: "limits-and-derivatives" },
            { name: "Chapter 14: Mathematical Reasoning", slug: "mathematical-reasoning" },
            { name: "Chapter 15: Statistics", slug: "statistics-11" },
            { name: "Chapter 16: Probability", slug: "probability-11" },
          ],
        },
        {
          name: "गणित, कक्षा XI",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समुच्चय", slug: "sets" },
            { name: "अध्याय 2: संबंध एवं फलन", slug: "relations-and-functions" },
            { name: "अध्याय 3: त्रिकोणमितीय फलन", slug: "trigonometric-functions" },
            { name: "अध्याय 4: गणितीय आगमन का सिद्धांत", slug: "principle-of-mathematical-induction" },
            { name: "अध्याय 5: सम्मिश्र संख्याएँ और द्विघातीय समीकरण", slug: "complex-numbers-and-quadratic-equations" },
            { name: "अध्याय 6: रैखिक असमिकाएँ", slug: "linear-inequalities" },
            { name: "अध्याय 7: क्रमचय और संचय", slug: "permutations-and-combinations" },
            { name: "अध्याय 8: द्विपद प्रमेय", slug: "binomial-theorem" },
            { name: "अध्याय 9: अनुक्रम तथा श्रेणी", slug: "sequences-and-series" },
            { name: "अध्याय 10: सरल रेखाएँ", slug: "straight-lines" },
            { name: "अध्याय 11: शंकु परिच्छेद", slug: "conic-sections" },
            { name: "अध्याय 12: त्रिविमीय ज्यामिति का परिचय", slug: "introduction-to-three-dimensional-geometry" },
            { name: "अध्याय 13: सीमा और अवकलज", slug: "limits-and-derivatives" },
            { name: "अध्याय 14: गणितीय विवेचन", slug: "mathematical-reasoning" },
            { name: "अध्याय 15: सांख्यिकी", slug: "statistics-11" },
            { name: "अध्याय 16: प्रायिकता", slug: "probability-11" },
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
            { name: "Chapter 1: Units and Measurements", slug: "units-and-measurements" },
            { name: "Chapter 2: Motion in a Straight Line", slug: "motion-in-a-straight-line" },
            { name: "Chapter 3: Motion in a Plane", slug: "motion-in-a-plane" },
            { name: "Chapter 4: Laws of Motion", slug: "laws-of-motion" },
            { name: "Chapter 5: Work, Energy and Power", slug: "work-energy-and-power" },
            { name: "Chapter 6: System of Particles and Rotational Motion", slug: "system-of-particles-and-rotational-motion" },
            { name: "Chapter 7: Gravitation", slug: "gravitation-11" },
          ],
        },
        {
          name: "Physics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 8: Mechanical Properties of Solids", slug: "mechanical-properties-of-solids" },
            { name: "Chapter 9: Mechanical Properties of Fluids", slug: "mechanical-properties-of-fluids" },
            { name: "Chapter 10: Thermal Properties of Matter", slug: "thermal-properties-of-matter" },
            { name: "Chapter 11: Thermodynamics", slug: "thermodynamics" },
            { name: "Chapter 12: Kinetic Theory", slug: "kinetic-theory" },
            { name: "Chapter 13: Oscillations", slug: "oscillations" },
            { name: "Chapter 14: Waves", slug: "waves" },
          ],
        },
        {
          name: "भौतिकी भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: मात्रक और मापन", slug: "units-and-measurements" },
            { name: "अध्याय 2: सरल रेखा में गति", slug: "motion-in-a-straight-line" },
            { name: "अध्याय 3: समतल में गति", slug: "motion-in-a-plane" },
            { name: "अध्याय 4: गति के नियम", slug: "laws-of-motion" },
            { name: "अध्याय 5: कार्य, ऊर्जा और शक्ति", slug: "work-energy-and-power" },
            { name: "अध्याय 6: कणों के निकाय तथा घूर्णी गति", slug: "system-of-particles-and-rotational-motion" },
            { name: "अध्याय 7: गुरुत्वाकर्षण", slug: "gravitation-11" },
          ],
        },
        {
          name: "भौतिकी भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 8: ठोसों के यांत्रिक गुण", slug: "mechanical-properties-of-solids" },
            { name: "अध्याय 9: तरलों के यांत्रिकी गुण", slug: "mechanical-properties-of-fluids" },
            { name: "अध्याय 10: द्रव्य के तापीय गुण", slug: "thermal-properties-of-matter" },
            { name: "अध्याय 11: ऊष्मागतिकी", slug: "thermodynamics" },
            { name: "अध्याय 12: अणुगति सिद्धांत", slug: "kinetic-theory" },
            { name: "अध्याय 13: दोलन", slug: "oscillations" },
            { name: "अध्याय 14: तरंगें", slug: "waves" },
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
            { name: "Chapter 1: Some Basic Concepts of Chemistry", slug: "some-basic-concepts-of-chemistry" },
            { name: "Chapter 2: Structure of Atom", slug: "structure-of-atom" },
            { name: "Chapter 3: Classification of Elements and Periodicity in Properties", slug: "classification-of-elements-and-periodicity-in-properties" },
            { name: "Chapter 4: Chemical Bonding and Molecular Structure", slug: "chemical-bonding-and-molecular-structure" },
            { name: "Chapter 5: Thermodynamics", slug: "thermodynamics-11" },
            { name: "Chapter 6: Equilibrium", slug: "equilibrium" },
          ],
        },
        {
          name: "Chemistry Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 7: Redox Reactions", slug: "redox-reactions" },
            { name: "Chapter 8: Organic Chemistry – Some Basic Principles and Techniques", slug: "organic-chemistry-some-basic-principles-and-techniques" },
            { name: "Chapter 9: Hydrocarbons", slug: "hydrocarbons" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ", slug: "some-basic-concepts-of-chemistry" },
            { name: "अध्याय 2: परमाणु की संरचना", slug: "structure-of-atom" },
            { name: "अध्याय 3: तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता", slug: "classification-of-elements-and-periodicity-in-properties" },
            { name: "अध्याय 4: रासायनिक आबंधन तथा आण्विक संरचना", slug: "chemical-bonding-and-molecular-structure" },
            { name: "अध्याय 5: ऊष्मागतिकी", slug: "thermodynamics-11" },
            { name: "अध्याय 6: साम्यावस्था", slug: "equilibrium" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 7: अपचयोपचय अभिक्रियाएँ", slug: "redox-reactions" },
            { name: "अध्याय 8: कार्बनिक रसायन – कुछ आधारभूत सिद्धांत तथा तकनीकें", slug: "organic-chemistry-some-basic-principles-and-techniques" },
            { name: "अध्याय 9: हाइड्रोकार्बन", slug: "hydrocarbons" },
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
            { name: "Chapter 1: The Living World", slug: "the-living-world" },
            { name: "Chapter 2: Biological Classification", slug: "biological-classification" },
            { name: "Chapter 3: Plant Kingdom", slug: "plant-kingdom" },
            { name: "Chapter 4: Animal Kingdom", slug: "animal-kingdom" },
            { name: "Chapter 5: Morphology of Flowering Plants", slug: "morphology-of-flowering-plants" },
            { name: "Chapter 6: Anatomy of Flowering Plants", slug: "anatomy-of-flowering-plants" },
            { name: "Chapter 7: Structural Organisation in Animals", slug: "structural-organisation-in-animals" },
            { name: "Chapter 8: Cell: The Unit of Life", slug: "cell-the-unit-of-life" },
            { name: "Chapter 9: Biomolecules", slug: "biomolecules" },
            { name: "Chapter 10: Cell Cycle and Cell Division", slug: "cell-cycle-and-cell-division" },
            { name: "Chapter 11: Photosynthesis in Higher Plants", slug: "photosynthesis-in-higher-plants" },
            { name: "Chapter 12: Respiration in Plants", slug: "respiration-in-plants" },
            { name: "Chapter 13: Plant Growth and Development", slug: "plant-growth-and-development" },
            { name: "Chapter 14: Breathing and Exchange of Gases", slug: "breathing-and-exchange-of-gases" },
            { name: "Chapter 15: Body Fluids and Circulation", slug: "body-fluids-and-circulation" },
            { name: "Chapter 16: Excretory Products and their Elimination", slug: "excretory-products-and-their-elimination" },
            { name: "Chapter 17: Locomotion and Movement", slug: "locomotion-and-movement" },
            { name: "Chapter 18: Neural Control and Coordination", slug: "neural-control-and-coordination" },
            { name: "Chapter 19: Chemical Coordination and Integration", slug: "chemical-coordination-and-integration" },
          ],
        },
        {
            name: "जीव विज्ञान, कक्षा XI",
            lang: "hi",
            chapters: [
              { name: "अध्याय 1: जीव जगत", slug: "the-living-world" },
              { name: "अध्याय 2: जीव जगत का वर्गीकरण", slug: "biological-classification" },
              { name: "अध्याय 3: वनस्पति जगत", slug: "plant-kingdom" },
              { name: "अध्याय 4: प्राणि जगत", slug: "animal-kingdom" },
              { name: "अध्याय 5: पुष्पी पादपों की आकारिकी", slug: "morphology-of-flowering-plants" },
              { name: "अध्याय 6: पुष्पी पादपों का शरीर", slug: "anatomy-of-flowering-plants" },
              { name: "अध्याय 7: प्राणियों में संरचनात्मक संगठन", slug: "structural-organisation-in-animals" },
              { name: "अध्याय 8: कोशिका: जीवन की इकाई", slug: "cell-the-unit-of-life" },
              { name: "अध्याय 9: जैव अणु", slug: "biomolecules" },
              { name: "अध्याय 10: कोशिका चक्र और कोशिका विभाजन", slug: "cell-cycle-and-cell-division" },
              { name: "अध्याय 11: उच्च पादपों में प्रकाश संश्लेषण", slug: "photosynthesis-in-higher-plants" },
              { name: "अध्याय 12: पादप में श्वसन", slug: "respiration-in-plants" },
              { name: "अध्याय 13: पादप वृद्धि एवं परिवर्धन", slug: "plant-growth-and-development" },
              { name: "अध्याय 14: श्वसन और गैसों का विनिमय", slug: "breathing-and-exchange-of-gases" },
              { name: "अध्याय 15: शरीर द्रव तथा परिसंचरण", slug: "body-fluids-and-circulation" },
              { name: "अध्याय 16: उत्सर्जी उत्पाद एवं उनका निष्कासन", slug: "excretory-products-and-their-elimination" },
              { name: "अध्याय 17: गमन एवं संचलन", slug: "locomotion-and-movement" },
              { name: "अध्याय 18: तंत्रिकीय नियंत्रण एवं समन्वय", slug: "neural-control-and-coordination" },
              { name: "अध्याय 19: रासायनिक समन्वय तथा एकीकरण", slug: "chemical-coordination-and-integration" },
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
            { name: "Chapter 1: From the Beginning of Time", slug: "from-the-beginning-of-time" },
            { name: "Chapter 2: Writing and City Life", slug: "writing-and-city-life" },
            { name: "Chapter 3: An Empire Across Three Continents", slug: "an-empire-across-three-continents" },
            { name: "Chapter 4: The Central Islamic Lands", slug: "the-central-islamic-lands" },
            { name: "Chapter 5: Nomadic Empires", slug: "nomadic-empires" },
            { name: "Chapter 6: The Three Orders", slug: "the-three-orders" },
            { name: "Chapter 7: Changing Cultural Traditions", slug: "changing-cultural-traditions" },
            { name: "Chapter 8: Confrontation of Cultures", slug: "confrontation-of-cultures" },
            { name: "Chapter 9: The Industrial Revolution", slug: "the-industrial-revolution" },
            { name: "Chapter 10: Displacing Indigenous Peoples", slug: "displacing-indigenous-peoples" },
            { name: "Chapter 11: Paths to Modernisation", slug: "paths-to-modernisation" },
          ],
        },
        {
          name: "विश्व इतिहास के कुछ विषय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: समय की शुरुआत से", slug: "from-the-beginning-of-time" },
            { name: "अध्याय 2: लेखन कला और शहरी जीवन", slug: "writing-and-city-life" },
            { name: "अध्याय 3: तीन महाद्वीपों में फैला हुआ साम्राज्य", slug: "an-empire-across-three-continents" },
            { name: "अध्याय 4: इस्लाम का उदय और विस्तार—लगभग 570-1200 ई.", slug: "the-central-islamic-lands" },
            { name: "अध्याय 5: यायावर साम्राज्य", slug: "nomadic-empires" },
            { name: "अध्याय 6: तीन वर्ग", slug: "the-three-orders" },
            { name: "अध्याय 7: बदलती हुई सांस्कृतिक परंपराएँ", slug: "changing-cultural-traditions" },
            { name: "अध्याय 8: संस्कृतियों का टकराव", slug: "confrontation-of-cultures" },
            { name: "अध्याय 9: औद्योगिक क्रांति", slug: "the-industrial-revolution" },
            { name: "अध्याय 10: मूल निवासियों का विस्थापन", slug: "displacing-indigenous-peoples" },
            { name: "अध्याय 11: आधुनिकीकरण के रास्ते", slug: "paths-to-modernisation" },
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
            { name: "Chapter 1: Geography as a Discipline", slug: "geography-as-a-discipline" },
            { name: "Chapter 2: The Origin and Evolution of the Earth", slug: "the-origin-and-evolution-of-the-earth" },
            { name: "Chapter 3: Interior of the Earth", slug: "interior-of-the-earth" },
            { name: "Chapter 4: Distribution of Oceans and Continents", slug: "distribution-of-oceans-and-continents" },
            { name: "Chapter 5: Minerals and Rocks", slug: "minerals-and-rocks" },
            { name: "Chapter 6: Geomorphic Processes", slug: "geomorphic-processes" },
            { name: "Chapter 7: Landforms and their Evolution", slug: "landforms-and-their-evolution" },
            { name: "Chapter 8: Composition and Structure of Atmosphere", slug: "composition-and-structure-of-atmosphere" },
            { name: "Chapter 9: Solar Radiation, Heat Balance and Temperature", slug: "solar-radiation-heat-balance-and-temperature" },
            { name: "Chapter 10: Atmospheric Circulation and Weather Systems", slug: "atmospheric-circulation-and-weather-systems" },
            { name: "Chapter 11: Water in the Atmosphere", slug: "water-in-the-atmosphere" },
            { name: "Chapter 12: World Climate and Climate Change", slug: "world-climate-and-climate-change" },
            { name: "Chapter 13: Water (Oceans)", slug: "water-oceans" },
            { name: "Chapter 14: Movements of Ocean Water", slug: "movements-of-ocean-water" },
            { name: "Chapter 15: Life on the Earth", slug: "life-on-the-earth" },
            { name: "Chapter 16: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
          ],
        },
        {
          name: "India Physical Environment",
          lang: "en",
          chapters: [
            { name: "Chapter 1: India - Location", slug: "india-location" },
            { name: "Chapter 2: Structure and Physiography", slug: "structure-and-physiography" },
            { name: "Chapter 3: Drainage System", slug: "drainage-system" },
            { name: "Chapter 4: Climate", slug: "climate-11" },
            { name: "Chapter 5: Natural Vegetation", slug: "natural-vegetation" },
            { name: "Chapter 6: Soils", slug: "soils" },
            { name: "Chapter 7: Natural Hazards and Disasters", slug: "natural-hazards-and-disasters" },
          ],
        },
        {
          name: "भौतिक भूगोल के मूल सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भूगोल एक विषय के रूप में", slug: "geography-as-a-discipline" },
            { name: "अध्याय 2: पृथ्वी की उत्पत्ति एवं विकास", slug: "the-origin-and-evolution-of-the-earth" },
            { name: "अध्याय 3: पृथ्वी की आंतरिक संरचना", slug: "interior-of-the-earth" },
            { name: "अध्याय 4: महासागरों और महाद्वीपों का वितरण", slug: "distribution-of-oceans-and-continents" },
            { name: "अध्याय 5: खनिज एवं शैल", slug: "minerals-and-rocks" },
            { name: "अध्याय 6: भू-आकृतिक प्रक्रियाएँ", slug: "geomorphic-processes" },
            { name: "अध्याय 7: भू-आकृतियाँ तथा उनका विकास", slug: "landforms-and-their-evolution" },
            { name: "अध्याय 8: वायुमंडल का संघटन तथा संरचना", slug: "composition-and-structure-of-atmosphere" },
            { name: "अध्याय 9: सौर विकिरण, ऊष्मा संतुलन एवं तापमान", slug: "solar-radiation-heat-balance-and-temperature" },
            { name: "अध्याय 10: वायुमंडलीय परिसंचरण तथा मौसम प्रणालियाँ", slug: "atmospheric-circulation-and-weather-systems" },
            { name: "अध्याय 11: वायुमंडल में जल", slug: "water-in-the-atmosphere" },
            { name: "अध्याय 12: विश्व की जलवायु एवं जलवायु परिवर्तन", slug: "world-climate-and-climate-change" },
            { name: "अध्याय 13: महासागरीय जल", slug: "water-oceans" },
            { name: "अध्याय 14: महासागरीय जल संचलन", slug: "movements-of-ocean-water" },
            { name: "अध्याय 15: पृथ्वी पर जीवन", slug: "life-on-the-earth" },
            { name: "अध्याय 16: जैव-विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
          ],
        },
        {
          name: "भारत भौतिक पर्यावरण",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: भारत - स्थिति", slug: "india-location" },
            { name: "अध्याय 2: संरचना तथा भू-आकृति विज्ञान", slug: "structure-and-physiography" },
            { name: "अध्याय 3: अपवाह तंत्र", slug: "drainage-system" },
            { name: "अध्याय 4: जलवायु", slug: "climate-11" },
            { name: "अध्याय 5: प्राकृतिक वनस्पति", slug: "natural-vegetation" },
            { name: "अध्याय 6: मृदा", slug: "soils" },
            { name: "अध्याय 7: प्राकृतिक संकट तथा आपदाएँ", slug: "natural-hazards-and-disasters" },
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
            { name: "Chapter 1: Constitution: Why and How?", slug: "constitution-why-and-how" },
            { name: "Chapter 2: Rights in the Indian Constitution", slug: "rights-in-the-indian-constitution" },
            { name: "Chapter 3: Election and Representation", slug: "election-and-representation" },
            { name: "Chapter 4: Executive", slug: "executive" },
            { name: "Chapter 5: Legislature", slug: "legislature" },
            { name: "Chapter 6: Judiciary", slug: "judiciary" },
            { name: "Chapter 7: Federalism", slug: "federalism-11" },
            { name: "Chapter 8: Local Governments", slug: "local-governments" },
            { name: "Chapter 9: Constitution as a Living Document", slug: "constitution-as-a-living-document" },
            { name: "Chapter 10: The Philosophy of the Constitution", slug: "the-philosophy-of-the-constitution" },
          ],
        },
        {
          name: "Political Theory",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Political Theory: An Introduction", slug: "political-theory-an-introduction" },
            { name: "Chapter 2: Freedom", slug: "freedom-11" },
            { name: "Chapter 3: Equality", slug: "equality" },
            { name: "Chapter 4: Social Justice", slug: "social-justice" },
            { name: "Chapter 5: Rights", slug: "rights" },
            { name: "Chapter 6: Citizenship", slug: "citizenship" },
            { name: "Chapter 7: Nationalism", slug: "nationalism" },
            { name: "Chapter 8: Secularism", slug: "secularism" },
            { name: "Chapter 9: Peace", slug: "peace" },
            { name: "Chapter 10: Development", slug: "development-11" },
          ],
        },
        {
          name: "भारत का संविधान: सिद्धांत और व्यवहार",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संविधान: क्यों और कैसे?", slug: "constitution-why-and-how" },
            { name: "अध्याय 2: भारतीय संविधान में अधिकार", slug: "rights-in-the-indian-constitution" },
            { name: "अध्याय 3: चुनाव और प्रतिनिधित्व", slug: "election-and-representation" },
            { name: "अध्याय 4: कार्यपालिका", slug: "executive" },
            { name: "अध्याय 5: विधायिका", slug: "legislature" },
            { name: "अध्याय 6: न्यायपालिका", slug: "judiciary" },
            { name: "अध्याय 7: संघवाद", slug: "federalism-11" },
            { name: "अध्याय 8: स्थानीय शासन", slug: "local-governments" },
            { name: "अध्याय 9: संविधान: एक जीवंत दस्तावेज़", slug: "constitution-as-a-living-document" },
            { name: "अध्याय 10: संविधान का राजनीतिक दर्शन", slug: "the-philosophy-of-the-constitution" },
          ],
        },
        {
          name: "राजनीतिक सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: राजनीतिक सिद्धांत: एक परिचय", slug: "political-theory-an-introduction" },
            { name: "अध्याय 2: स्वतंत्रता", slug: "freedom-11" },
            { name: "अध्याय 3: समानता", slug: "equality" },
            { name: "अध्याय 4: सामाजिक न्याय", slug: "social-justice" },
            { name: "अध्याय 5: अधिकार", slug: "rights" },
            { name: "अध्याय 6: नागरिकता", slug: "citizenship" },
            { name: "अध्याय 7: राष्ट्रवाद", slug: "nationalism" },
            { name: "अध्याय 8: धर्मनिरपेक्षता", slug: "secularism" },
            { name: "अध्याय 9: शांति", slug: "peace" },
            { name: "अध्याय 10: विकास", slug: "development-11" },
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
            { name: "Chapter 1: Indian Economy on the Eve of Independence", slug: "indian-economy-on-the-eve-of-independence" },
            { name: "Chapter 2: Indian Economy 1950-1990", slug: "indian-economy-1950-1990" },
            { name: "Chapter 3: Liberalisation, Privatisation and Globalisation: An Appraisal", slug: "liberalisation-privatisation-and-globalisation" },
            { name: "Chapter 4: Poverty", slug: "poverty" },
            { name: "Chapter 5: Human Capital Formation in India", slug: "human-capital-formation-in-india" },
            { name: "Chapter 6: Rural Development", slug: "rural-development" },
            { name: "Chapter 7: Employment: Growth, Informalisation and other Issues", slug: "employment-growth-informalisation-and-other-issues" },
            { name: "Chapter 8: Infrastructure", slug: "infrastructure" },
            { name: "Chapter 9: Environment and Sustainable Development", slug: "environment-and-sustainable-development" },
            { name: "Chapter 10: Comparative Development Experiences of India and its Neighbours", slug: "comparative-development-experiences" },
          ],
        },
        {
          name: "Statistics for Economics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Introduction", slug: "introduction-stats" },
            { name: "Chapter 2: Collection of Data", slug: "collection-of-data" },
            { name: "Chapter 3: Organisation of Data", slug: "organisation-of-data" },
            { name: "Chapter 4: Presentation of Data", slug: "presentation-of-data" },
            { name: "Chapter 5: Measures of Central Tendency", slug: "measures-of-central-tendency" },
            { name: "Chapter 6: Measures of Dispersion", slug: "measures-of-dispersion" },
            { name: "Chapter 7: Correlation", slug: "correlation" },
            { name: "Chapter 8: Index Numbers", slug: "index-numbers" },
          ],
        },
        {
          name: "भारतीय आर्थिक विकास",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: स्वतंत्रता की पूर्व संध्या पर भारतीय अर्थव्यवस्था", slug: "indian-economy-on-the-eve-of-independence" },
            { name: "अध्याय 2: भारतीय अर्थव्यवस्था 1950-1990", slug: "indian-economy-1950-1990" },
            { name: "अध्याय 3: उदारीकरण, निजीकरण और वैश्वीकरण: एक समीक्षा", slug: "liberalisation-privatisation-and-globalisation" },
            { name: "अध्याय 4: निर्धनता", slug: "poverty" },
            { name: "अध्याय 5: भारत में मानव पूँजी का निर्माण", slug: "human-capital-formation-in-india" },
            { name: "अध्याय 6: ग्रामीण विकास", slug: "rural-development" },
            { name: "अध्याय 7: रोजगार-संवृद्धि, अनौपचारीकरण एवं अन्य मुद्दे", slug: "employment-growth-informalisation-and-other-issues" },
            { name: "अध्याय 8: आधारिक संरचना", slug: "infrastructure" },
            { name: "अध्याय 9: पर्यावरण और धारणीय विकास", slug: "environment-and-sustainable-development" },
            { name: "अध्याय 10: भारत और उसके पड़ोसी देशों के तुलनात्मक विकास अनुभव", slug: "comparative-development-experiences" },
          ],
        },
        {
          name: "अर्थशास्त्र में सांख्यिकी",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय", slug: "introduction-stats" },
            { name: "अध्याय 2: आँकड़ों का संग्रह", slug: "collection-of-data" },
            { name: "अध्याय 3: आँकड़ों का संगठन", slug: "organisation-of-data" },
            { name: "अध्याय 4: आँकड़ों का प्रस्तुतीकरण", slug: "presentation-of-data" },
            { name: "अध्याय 5: केंद्रीय प्रवृत्ति की माप", slug: "measures-of-central-tendency" },
            { name: "अध्याय 6: परिक्षेपण के माप", slug: "measures-of-dispersion" },
            { name: "अध्याय 7: सहसंबंध", slug: "correlation" },
            { name: "अध्याय 8: सूचकांक", slug: "index-numbers" },
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
            { name: "Chapter 1: The Portrait of a Lady", slug: "the-portrait-of-a-lady" },
            { name: "Chapter 2: We’re Not Afraid to Die... if We Can All Be Together", slug: "we-are-not-afraid-to-die" },
            { name: "Chapter 3: Discovering Tut: the Saga Continues", slug: "discovering-tut" },
          ],
        },
        {
          name: "Snapshots",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Summer of the Beautiful White Horse", slug: "the-summer-of-the-beautiful-white-horse" },
            { name: "Chapter 2: The Address", slug: "the-address" },
            { name: "Chapter 3: Ranga’s Marriage", slug: "rangas-marriage" },
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
            { name: "Chapter 1: Relations and Functions", slug: "relations-and-functions-12" },
            { name: "Chapter 2: Inverse Trigonometric Functions", slug: "inverse-trigonometric-functions" },
            { name: "Chapter 3: Matrices", slug: "matrices" },
            { name: "Chapter 4: Determinants", slug: "determinants" },
            { name: "Chapter 5: Continuity and Differentiability", slug: "continuity-and-differentiability" },
            { name: "Chapter 6: Application of Derivatives", slug: "application-of-derivatives" },
          ],
        },
        {
          name: "Mathematics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 7: Integrals", slug: "integrals" },
            { name: "Chapter 8: Application of Integrals", slug: "application-of-integrals" },
            { name: "Chapter 9: Differential Equations", slug: "differential-equations" },
            { name: "Chapter 10: Vector Algebra", slug: "vector-algebra" },
            { name: "Chapter 11: Three Dimensional Geometry", slug: "three-dimensional-geometry" },
            { name: "Chapter 12: Linear Programming", slug: "linear-programming" },
            { name: "Chapter 13: Probability", slug: "probability-12" },
          ],
        },
        {
          name: "गणित भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: संबंध एवं फलन", slug: "relations-and-functions-12" },
            { name: "अध्याय 2: प्रतिलोम त्रिकोणमितीय फलन", slug: "inverse-trigonometric-functions" },
            { name: "अध्याय 3: आव्यूह", slug: "matrices" },
            { name: "अध्याय 4: सारणिक", slug: "determinants" },
            { name: "अध्याय 5: सांतत्य तथा अवकलनीयता", slug: "continuity-and-differentiability" },
            { name: "अध्याय 6: अवकलज के अनुप्रयोग", slug: "application-of-derivatives" },
          ],
        },
        {
          name: "गणित भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 7: समाकलन", slug: "integrals" },
            { name: "अध्याय 8: समाकलनों के अनुप्रयोग", slug: "application-of-integrals" },
            { name: "अध्याय 9: अवकल समीकरण", slug: "differential-equations" },
            { name: "अध्याय 10: सदिश बीजगणित", slug: "vector-algebra" },
            { name: "अध्याय 11: त्रिविमीय ज्यामिति", slug: "three-dimensional-geometry" },
            { name: "अध्याय 12: रैखिक प्रोग्रामन", slug: "linear-programming" },
            { name: "अध्याय 13: प्रायिकता", slug: "probability-12" },
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
            { name: "Chapter 1: Electric Charges and Fields", slug: "electric-charges-and-fields" },
            { name: "Chapter 2: Electrostatic Potential and Capacitance", slug: "electrostatic-potential-and-capacitance" },
            { name: "Chapter 3: Current Electricity", slug: "current-electricity" },
            { name: "Chapter 4: Moving Charges and Magnetism", slug: "moving-charges-and-magnetism" },
            { name: "Chapter 5: Magnetism and Matter", slug: "magnetism-and-matter" },
            { name: "Chapter 6: Electromagnetic Induction", slug: "electromagnetic-induction" },
            { name: "Chapter 7: Alternating Current", slug: "alternating-current" },
            { name: "Chapter 8: Electromagnetic Waves", slug: "electromagnetic-waves" },
          ],
        },
        {
          name: "Physics Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 9: Ray Optics and Optical Instruments", slug: "ray-optics-and-optical-instruments" },
            { name: "Chapter 10: Wave Optics", slug: "wave-optics" },
            { name: "Chapter 11: Dual Nature of Radiation and Matter", slug: "dual-nature-of-radiation-and-matter" },
            { name: "Chapter 12: Atoms", slug: "atoms" },
            { name: "Chapter 13: Nuclei", slug: "nuclei" },
            { name: "Chapter 14: Semiconductor Electronics: Materials, Devices and Simple Circuits", slug: "semiconductor-electronics" },
          ],
        },
        {
          name: "भौतिकी भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: वैद्युत आवेश तथा क्षेत्र", slug: "electric-charges-and-fields" },
            { name: "अध्याय 2: स्थिरवैद्युत विभव तथा धारिता", slug: "electrostatic-potential-and-capacitance" },
            { name: "अध्याय 3: विद्युत धारा", slug: "current-electricity" },
            { name: "अध्याय 4: गतिमान आवेश और चुंबकत्व", slug: "moving-charges-and-magnetism" },
            { name: "अध्याय 5: चुंबकत्व एवं द्रव्य", slug: "magnetism-and-matter" },
            { name: "अध्याय 6: वैद्युतचुंबकीय प्रेरण", slug: "electromagnetic-induction" },
            { name: "अध्याय 7: प्रत्यावर्ती धारा", slug: "alternating-current" },
            { name: "अध्याय 8: वैद्युतचुंबकीय तरंगें", slug: "electromagnetic-waves" },
          ],
        },
        {
          name: "भौतिकी भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 9: किरण प्रकाशिकी एवं प्रकाशिक यंत्र", slug: "ray-optics-and-optical-instruments" },
            { name: "अध्याय 10: तरंग-प्रकाशिकी", slug: "wave-optics" },
            { name: "अध्याय 11: विकिरण तथा द्रव्य की द्वैत प्रकृति", slug: "dual-nature-of-radiation-and-matter" },
            { name: "अध्याय 12: परमाणु", slug: "atoms" },
            { name: "अध्याय 13: नाभिक", slug: "nuclei" },
            { name: "अध्याय 14: अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ", slug: "semiconductor-electronics" },
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
            { name: "Chapter 1: Solutions", slug: "solutions" },
            { name: "Chapter 2: Electrochemistry", slug: "electrochemistry" },
            { name: "Chapter 3: Chemical Kinetics", slug: "chemical-kinetics" },
            { name: "Chapter 4: The d- and f-Block Elements", slug: "the-d-and-f-block-elements" },
            { name: "Chapter 5: Coordination Compounds", slug: "coordination-compounds" },
          ],
        },
         {
          name: "Chemistry Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 6: Haloalkanes and Haloarenes", slug: "haloalkanes-and-haloarenes" },
            { name: "Chapter 7: Alcohols, Phenols and Ethers", slug: "alcohols-phenols-and-ethers" },
            { name: "Chapter 8: Aldehydes, Ketones and Carboxylic Acids", slug: "aldehydes-ketones-and-carboxylic-acids" },
            { name: "Chapter 9: Amines", slug: "amines" },
            { name: "Chapter 10: Biomolecules", slug: "biomolecules-12" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग I",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: विलयन", slug: "solutions" },
            { name: "अध्याय 2: वैद्युतरसायन", slug: "electrochemistry" },
            { name: "अध्याय 3: रासायनिक बलगतिकी", slug: "chemical-kinetics" },
            { name: "अध्याय 4: d- एवं f- ब्लॉक के तत्त्व", slug: "the-d-and-f-block-elements" },
            { name: "अध्याय 5: उपसहसंयोजन यौगिक", slug: "coordination-compounds" },
          ],
        },
        {
          name: "रसायन विज्ञान भाग II",
          lang: "hi",
          chapters: [
            { name: "अध्याय 6: हैलोऐल्केन तथा हैलोऐरीन", slug: "haloalkanes-and-haloarenes" },
            { name: "अध्याय 7: ऐल्कोहॉल, फ़िनॉल एवं ईथर", slug: "alcohols-phenols-and-ethers" },
            { name: "अध्याय 8: ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल", slug: "aldehydes-ketones-and-carboxylic-acids" },
            { name: "अध्याय 9: ऐमीन", slug: "amines" },
            { name: "अध्याय 10: जैव-अणु", slug: "biomolecules-12" },
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
            { name: "Chapter 1: Sexual Reproduction in Flowering Plants", slug: "sexual-reproduction-in-flowering-plants" },
            { name: "Chapter 2: Human Reproduction", slug: "human-reproduction" },
            { name: "Chapter 3: Reproductive Health", slug: "reproductive-health" },
            { name: "Chapter 4: Principles of Inheritance and Variation", slug: "principles-of-inheritance-and-variation" },
            { name: "Chapter 5: Molecular Basis of Inheritance", slug: "molecular-basis-of-inheritance" },
            { name: "Chapter 6: Evolution", slug: "evolution" },
            { name: "Chapter 7: Human Health and Disease", slug: "human-health-and-disease" },
            { name: "Chapter 8: Microbes in Human Welfare", slug: "microbes-in-human-welfare" },
            { name: "Chapter 9: Biotechnology: Principles and Processes", slug: "biotechnology-principles-and-processes" },
            { name: "Chapter 10: Biotechnology and its Applications", slug: "biotechnology-and-its-applications" },
            { name: "Chapter 11: Organisms and Populations", slug: "organisms-and-populations" },
            { name: "Chapter 12: Ecosystem", slug: "ecosystem" },
            { name: "Chapter 13: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
          ],
        },
        {
          name: "जीव विज्ञान, कक्षा XII",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: पुष्पी पादपों में लैंगिक जनन", slug: "sexual-reproduction-in-flowering-plants" },
            { name: "अध्याय 2: मानव जनन", slug: "human-reproduction" },
            { name: "अध्याय 3: जनन स्वास्थ्य", slug: "reproductive-health" },
            { name: "अध्याय 4: वंशागति तथा विविधता के सिद्धांत", slug: "principles-of-inheritance-and-variation" },
            { name: "अध्याय 5: वंशागति के आणविक आधार", slug: "molecular-basis-of-inheritance" },
            { name: "अध्याय 6: विकास", slug: "evolution" },
            { name: "अध्याय 7: मानव स्वास्थ्य तथा रोग", slug: "human-health-and-disease" },
            { name: "अध्याय 8: मानव कल्याण में सूक्ष्म जीव", slug: "microbes-in-human-welfare" },
            { name: "अध्याय 9: जैव प्रौद्योगिकी-सिद्धांत व प्रक्रम", slug: "biotechnology-principles-and-processes" },
            { name: "अध्याय 10: जैव प्रौद्योगिकी एवं उसके उपयोग", slug: "biotechnology-and-its-applications" },
            { name: "अध्याय 11: जीव और समष्टियाँ", slug: "organisms-and-populations" },
            { name: "अध्याय 12: पारितंत्र", slug: "ecosystem" },
            { name: "अध्याय 13: जैव विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
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
            { name: "Chapter 1: Bricks, Beads and Bones", slug: "bricks-beads-and-bones" },
            { name: "Chapter 2: Kings, Farmers and Towns", slug: "kings-farmers-and-towns" },
            { name: "Chapter 3: Kinship, Caste and Class", slug: "kinship-caste-and-class" },
            { name: "Chapter 4: Thinkers, Beliefs and Buildings", slug: "thinkers-beliefs-and-buildings" },
          ],
        },
        {
          name: "Themes in Indian History Part - II",
          lang: "en",
          chapters: [
            { name: "Chapter 5: Through the Eyes of Travellers", slug: "through-the-eyes-of-travellers" },
            { name: "Chapter 6: Bhakti-Sufi Traditions", slug: "bhakti-sufi-traditions" },
            { name: "Chapter 7: An Imperial Capital: Vijayanagara", slug: "an-imperial-capital-vijayanagara" },
            { name: "Chapter 8: Peasants, Zamindars and the State", slug: "peasants-zamindars-and-the-state" },
          ],
        },
         {
          name: "Themes in Indian History Part - III",
          lang: "en",
          chapters: [
            { name: "Chapter 9: Colonialism and the Countryside", slug: "colonialism-and-the-countryside" },
            { name: "Chapter 10: Rebels and the Raj", slug: "rebels-and-the-raj" },
            { name: "Chapter 11: Mahatma Gandhi and the Nationalist Movement", slug: "mahatma-gandhi-and-the-nationalist-movement" },
            { name: "Chapter 12: Framing the Constitution", slug: "framing-the-constitution" },
          ],
        },
        {
          name: "भारतीय इतिहास के कुछ विषय - भाग I",
          lang: "hi",
          chapters: [
            { name: "विषय 1: ईंटें, मनके तथा अस्थियाँ", slug: "bricks-beads-and-bones" },
            { name: "विषय 2: राजा, किसान और नगर", slug: "kings-farmers-and-towns" },
            { name: "विषय 3: बंधुत्व, जाति तथा वर्ग", slug: "kinship-caste-and-class" },
            { name: "विषय 4: विचारक, विश्वास और इमारतें", slug: "thinkers-beliefs-and-buildings" },
          ],
        },
        {
          name: "भारतीय इतिहास के कुछ विषय - भाग II",
          lang: "hi",
          chapters: [
            { name: "विषय 5: यात्रियों के नज़रिए", slug: "through-the-eyes-of-travellers" },
            { name: "विषय 6: भक्ति-सूफ़ी परंपराएँ", slug: "bhakti-sufi-traditions" },
            { name: "विषय 7: एक साम्राज्य की राजधानी: विजयनगर", slug: "an-imperial-capital-vijayanagara" },
            { name: "विषय 8: किसान, ज़मींदार और राज्य", slug: "peasants-zamindars-and-the-state" },
          ],
        },
         {
          name: "भारतीय इतिहास के कुछ विषय - भाग III",
          lang: "hi",
          chapters: [
            { name: "विषय 9: उपनिवेशवाद और देहात", slug: "colonialism-and-the-countryside" },
            { name: "विषय 10: विद्रोही और राज", slug: "rebels-and-the-raj" },
            { name: "विषय 11: महात्मा गांधी और राष्ट्रीय आंदोलन", slug: "mahatma-gandhi-and-the-nationalist-movement" },
            { name: "विषय 12: संविधान का निर्माण", slug: "framing-the-constitution" },
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
            { name: "Chapter 1: Human Geography: Nature and Scope", slug: "human-geography-nature-and-scope" },
            { name: "Chapter 2: The World Population: Distribution, Density and Growth", slug: "the-world-population-distribution-density-and-growth" },
            { name: "Chapter 3: Human Development", slug: "human-development" },
            { name: "Chapter 4: Primary Activities", slug: "primary-activities" },
            { name: "Chapter 5: Secondary Activities", slug: "secondary-activities" },
            { name: "Chapter 6: Tertiary and Quaternary Activities", slug: "tertiary-and-quaternary-activities" },
            { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication" },
            { name: "Chapter 8: International Trade", slug: "international-trade" },
          ],
        },
        {
          name: "India: People and Economy",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Population: Distribution, Density, Growth and Composition", slug: "population-distribution-density-growth-and-composition" },
            { name: "Chapter 2: Human Settlements", slug: "human-settlements" },
            { name: "Chapter 3: Land Resources and Agriculture", slug: "land-resources-and-agriculture" },
            { name: "Chapter 4: Water Resources", slug: "water-resources-12" },
            { name: "Chapter 5: Mineral and Energy Resources", slug: "mineral-and-energy-resources-12" },
            { name: "Chapter 6: Planning and Sustainable Development in Indian Context", slug: "planning-and-sustainable-development-in-indian-context" },
            { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication-india" },
            { name: "Chapter 8: International Trade", slug: "international-trade-india" },
            { name: "Chapter 9: Geographical Perspective on Selected Issues and Problems", slug: "geographical-perspective-on-selected-issues-and-problems" },
          ],
        },
        {
          name: "मानव भूगोल के मूल सिद्धांत",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: मानव भूगोल – प्रकृति एवं विषय क्षेत्र", slug: "human-geography-nature-and-scope" },
            { name: "अध्याय 2: विश्व जनसंख्या-वितरण, घनत्व और वृद्धि", slug: "the-world-population-distribution-density-and-growth" },
            { name: "अध्याय 3: मानव विकास", slug: "human-development" },
            { name: "अध्याय 4: प्राथमिक क्रियाएँ", slug: "primary-activities" },
            { name: "अध्याय 5: द्वितीयक क्रियाएँ", slug: "secondary-activities" },
            { name: "अध्याय 6: तृतीयक और चतुर्थ क्रियाकलाप", slug: "tertiary-and-quaternary-activities" },
            { name: "अध्याय 7: परिवहन एवं संचार", slug: "transport-and-communication" },
            { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade" },
          ],
        },
        {
          name: "भारत - लोग और अर्थव्यवस्था",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: जनसंख्या: वितरण, घनत्व, वृद्धि और संघटन", slug: "population-distribution-density-growth-and-composition" },
            { name: "अध्याय 2: मानव बस्तियाँ", slug: "human-settlements" },
            { name: "अध्याय 3: भूसंसाधन तथा कृषि", slug: "land-resources-and-agriculture" },
            { name: "अध्याय 4: जल-संसाधन", slug: "water-resources-12" },
            { name: "अध्याय 5: खनिज तथा ऊर्जा संसाधन", slug: "mineral-and-energy-resources-12" },
            { name: "अध्याय 6: भारत के संदर्भ में नियोजन और सततपोषणीय विकास", slug: "planning-and-sustainable-development-in-indian-context" },
            { name: "अध्याय 7: परिवहन तथा संचार", slug: "transport-and-communication-india" },
            { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade-india" },
            { name: "अध्याय 9: भौगोलिक परिप्रेक्ष्य में चयनित कुछ मुद्दे एवं समस्याएँ", slug: "geographical-perspective-on-selected-issues-and-problems" },
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
            { name: "Chapter 1: The End of Bipolarity", slug: "the-end-of-bipolarity" },
            { name: "Chapter 2: Contemporary Centres of Power", slug: "contemporary-centres-of-power" },
            { name: "Chapter 3: Contemporary South Asia", slug: "contemporary-south-asia" },
            { name: "Chapter 4: International Organisations", slug: "international-organisations" },
            { name: "Chapter 5: Security in the Contemporary World", slug: "security-in-the-contemporary-world" },
            { name: "Chapter 6: Environment and Natural Resources", slug: "environment-and-natural-resources" },
            { name: "Chapter 7: Globalisation", slug: "globalisation" },
          ],
        },
        {
          name: "Politics in India Since Independence",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Challenges of Nation Building", slug: "challenges-of-nation-building" },
            { name: "Chapter 2: Era of One-party Dominance", slug: "era-of-one-party-dominance" },
            { name: "Chapter 3: Politics of Planned Development", slug: "politics-of-planned-development" },
            { name: "Chapter 4: India’s External Relations", slug: "indias-external-relations" },
            { name: "Chapter 5: Challenges to and Restoration of the Congress System", slug: "challenges-to-and-restoration-of-the-congress-system" },
            { name: "Chapter 6: The Crisis of Democratic Order", slug: "the-crisis-of-democratic-order" },
            { name: "Chapter 7: Regional Aspirations", slug: "regional-aspirations" },
            { name: "Chapter 8: Recent Developments in Indian Politics", slug: "recent-developments-in-indian-politics" },
          ],
        },
        {
          name: "समकालीन विश्व राजनीति",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: दो ध्रुवीयता का अंत", slug: "the-end-of-bipolarity" },
            { name: "अध्याय 2: सत्ता के समकालीन केंद्र", slug: "contemporary-centres-of-power" },
            { name: "अध्याय 3: समकालीन दक्षिण एशिया", slug: "contemporary-south-asia" },
            { name: "अध्याय 4: अंतर्राष्ट्रीय संगठन", slug: "international-organisations" },
            { name: "अध्याय 5: समकालीन विश्व में सुरक्षा", slug: "security-in-the-contemporary-world" },
            { name: "अध्याय 6: पर्यावरण और प्राकृतिक संसाधन", slug: "environment-and-natural-resources" },
            { name: "अध्याय 7: वैश्वीकरण", slug: "globalisation" },
          ],
        },
        {
          name: "स्वतंत्र भारत में राजनीति",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ", slug: "challenges-of-nation-building" },
            { name: "अध्याय 2: एक दल के प्रभुत्व का दौर", slug: "era-of-one-party-dominance" },
            { name: "अध्याय 3: नियोजित विकास की राजनीति", slug: "politics-of-planned-development" },
            { name: "अध्याय 4: भारत के विदेश संबंध", slug: "indias-external-relations" },
            { name: "अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना", slug: "challenges-to-and-restoration-of-the-congress-system" },
            { name: "अध्याय 6: लोकतांत्रिक व्यवस्था का संकट", slug: "the-crisis-of-democratic-order" },
            { name: "अध्याय 7: क्षेत्रीय आकांक्षाएँ", slug: "regional-aspirations" },
            { name: "अध्याय 8: भारतीय राजनीति: नए बदलाव", slug: "recent-developments-in-indian-politics" },
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
            { name: "Chapter 1: Introduction", slug: "introduction-micro" },
            { name: "Chapter 2: Theory of Consumer Behaviour", slug: "theory-of-consumer-behaviour" },
            { name: "Chapter 3: Production and Costs", slug: "production-and-costs" },
            { name: "Chapter 4: The Theory of the Firm under Perfect Competition", slug: "theory-of-firm-perfect-competition" },
            { name: "Chapter 5: Market Equilibrium", slug: "market-equilibrium" },
            { name: "Chapter 6: Non-Competitive Markets", slug: "non-competitive-markets" },
          ],
        },
        {
          name: "Introductory Macroeconomics",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Introduction", slug: "introduction-macro" },
            { name: "Chapter 2: National Income Accounting", slug: "national-income-accounting" },
            { name: "Chapter 3: Money and Banking", slug: "money-and-banking" },
            { name: "Chapter 4: Determination of Income and Employment", slug: "determination-of-income-and-employment" },
            { name: "Chapter 5: Government Budget and the Economy", slug: "government-budget-and-the-economy" },
            { name: "Chapter 6: Open Economy Macroeconomics", slug: "open-economy-macroeconomics" },
          ],
        },
        {
          name: "व्यष्टि अर्थशास्त्र: एक परिचय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय", slug: "introduction-micro" },
            { name: "अध्याय 2: उपभोक्ता के व्यवहार का सिद्धांत", slug: "theory-of-consumer-behaviour" },
            { name: "अध्याय 3: उत्पादन तथा लागत", slug: "production-and-costs" },
            { name: "अध्याय 4: पूर्ण प्रतिस्पर्धा की स्थिति में फर्म का सिद्धांत", slug: "theory-of-firm-perfect-competition" },
            { name: "अध्याय 5: बाजार संतुलन", slug: "market-equilibrium" },
            { name: "अध्याय 6: प्रतिस्पर्धारहित बाजार", slug: "non-competitive-markets" },
          ],
        },
        {
          name: "समष्टि अर्थशास्त्र: एक परिचय",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: परिचय", slug: "introduction-macro" },
            { name: "अध्याय 2: राष्ट्रीय आय का लेखांकन", slug: "national-income-accounting" },
            { name: "अध्याय 3: मुद्रा और बैंकिंग", slug: "money-and-banking" },
            { name: "अध्याय 4: आय और रोजगार के निर्धारण", slug: "determination-of-income-and-employment" },
            { name: "अध्याय 5: सरकारी बजट एवं अर्थव्यवस्था", slug: "government-budget-and-the-economy" },
            { name: "अध्याय 6: खुली अर्थव्यवस्था - समष्टि अर्थशास्त्र", slug: "open-economy-macroeconomics" },
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
            { name: "Chapter 1: The Last Lesson", slug: "the-last-lesson" },
            { name: "Chapter 2: Lost Spring", slug: "lost-spring" },
            { name: "Chapter 3: Deep Water", slug: "deep-water" },
            { name: "Chapter 4: The Rattrap", slug: "the-rattrap" },
            { name: "Chapter 5: Indigo", slug: "indigo" },
            { name: "Chapter 6: Poets and Pancakes", slug: "poets-and-pancakes" },
            { name: "Chapter 7: The Interview", slug: "the-interview" },
            { name: "Chapter 8: Going Places", slug: "going-places" },
          ],
        },
        {
          name: "Vistas",
          lang: "en",
          chapters: [
            { name: "Chapter 1: The Third Level", slug: "the-third-level" },
            { name: "Chapter 2: The Tiger King", slug: "the-tiger-king" },
            { name: "Chapter 3: Journey to the end of the Earth", slug: "journey-to-the-end-of-the-earth" },
            { name: "Chapter 4: The Enemy", slug: "the-enemy" },
            { name: "Chapter 5: On the face of It", slug: "on-the-face-of-it" },
            { name: "Chapter 6: Memories of Childhood", slug: "memories-of-childhood" },
          ],
        },
      ]
    }
  },
};

export default function SeedDataPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSeedData = async (className: string, data: any) => {
    setLoading(className);
    try {
      const result = await seedNcertSolutions(className, data);
      if (result.success) {
        toast({
          title: "Success",
          description: `Data for ${className.replace('-', ' ')} has been seeded successfully.`,
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
        <CardTitle>Seed Database</CardTitle>
        <CardDescription>
          Use this page to populate your Firestore database with initial data for NCERT Solutions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ncertSolutionsData).map(([className, data]) => (
          <Button
            key={className}
            onClick={() => handleSeedData(className, data)}
            disabled={loading === className}
          >
            <Database className="mr-2 h-4 w-4" />
            {loading === className ? `Seeding ${className.replace('-', ' ')}...` : `Seed ${className.replace('-', ' ')} Data`}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
