
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
      books: [{ name: "Mathematics Textbook for Class VII", lang: "en", chapters: [{ name: "Chapter 1: Integers", slug: "integers-7" }] }]
    },
    science: {
      books: [{ name: "Science Textbook for Class VII", lang: "en", chapters: [{ name: "Chapter 1: Nutrition in Plants", slug: "nutrition-in-plants" }] }]
    },
    social: {
      books: [{ name: "Our Pasts - II", lang: "en", chapters: [{ name: "Chapter 1: Tracing Changes Through A Thousand Years", slug: "tracing-changes-through-a-thousand-years" }] }]
    },
    english: {
      books: [{ name: "Honeycomb", lang: "en", chapters: [{ name: "Chapter 1: Three Questions", slug: "c7-en-h-unit1" }] }]
    },
  },
  'class-8': {
    maths: {
      books: [{ name: "Mathematics Textbook for Class VIII", lang: "en", chapters: [{ name: "Chapter 1: Rational Numbers", slug: "rational-numbers" }] }]
    },
    science: {
      books: [{ name: "Science Textbook for Class VIII", lang: "en", chapters: [{ name: "Chapter 1: Crop Production and Management", slug: "crop-production-and-management" }] }]
    },
    social: {
      books: [{ name: "Our Pasts - III", lang: "en", chapters: [{ name: "Chapter 1: How, When and Where", slug: "how-when-and-where" }] }]
    },
    english: {
      books: [{ name: "Honeydew", lang: "en", chapters: [{ name: "Chapter 1: The Best Christmas Present in the World", slug: "c8-en-h-unit1" }] }]
    },
  },
  'class-9': {
    maths: {
      books: [{ name: "Mathematics Textbook for Class IX", lang: "en", chapters: [{ name: "Chapter 1: Number Systems", slug: "number-systems" }] }]
    },
    science: {
      books: [{ name: "Science Textbook for Class IX", lang: "en", chapters: [{ name: "Chapter 1: Matter in Our Surroundings", slug: "matter-in-our-surroundings" }] }]
    },
    social: {
      books: [{ name: "India and the Contemporary World - I", lang: "en", chapters: [{ name: "Chapter 1: The French Revolution", slug: "the-french-revolution" }] }]
    },
    english: {
      books: [{ name: "Beehive", lang: "en", chapters: [{ name: "Chapter 1: The Fun They Had", slug: "the-fun-they-had" }] }]
    },
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
      books: [{ name: "Mathematics Textbook for Class XI", lang: "en", chapters: [{ name: "Chapter 1: Sets", slug: "sets" }] }]
    },
    physics: {
      books: [{ name: "Physics Part - I", lang: "en", chapters: [{ name: "Chapter 1: Units and Measurements", slug: "units-and-measurements" }] }]
    },
    chemistry: {
      books: [{ name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Chapter 1: Some Basic Concepts of Chemistry", slug: "some-basic-concepts-of-chemistry" }] }]
    },
    biology: {
      books: [{ name: "Biology Textbook for Class XI", lang: "en", chapters: [{ name: "Chapter 1: The Living World", slug: "the-living-world" }] }]
    },
  },
  'class-12': {
    maths: {
      books: [{ name: "Mathematics Part - I", lang: "en", chapters: [{ name: "Chapter 1: Relations and Functions", slug: "relations-and-functions-12" }] }]
    },
    physics: {
      books: [{ name: "Physics Part - I", lang: "en", chapters: [{ name: "Chapter 1: Electric Charges and Fields", slug: "electric-charges-and-fields" }] }]
    },
    chemistry: {
      books: [{ name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Chapter 1: Solutions", slug: "solutions" }] }]
    },
    biology: {
      books: [{ name: "Biology Textbook for Class XII", lang: "en", chapters: [{ name: "Chapter 1: Sexual Reproduction in Flowering Plants", slug: "sexual-reproduction-in-flowering-plants" }] }]
    },
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
