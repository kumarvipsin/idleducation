
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
        { name: "Mathematics Textbook for Class VII", lang: "en", chapters: [{ name: "Integers" }] },
        { name: "गणित, कक्षा VII", lang: "hi", chapters: [{ name: "पूर्णांक" }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VII", lang: "en", chapters: [{ name: "Nutrition in Plants" }] },
        { name: "विज्ञान, कक्षा VII", lang: "hi", chapters: [{ name: "पादपों में पोषण" }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - II", lang: "en", chapters: [{ name: "Tracing Changes Through A Thousand Years" }] },
        { name: "हमारे अतीत - II", lang: "hi", chapters: [{ name: "हज़ार वर्षों के दौरान हुए परिवर्तनों की पड़ताल" }] }
      ]
    },
    english: {
       books: [
        { name: "Honeycomb", lang: "en", chapters: [{ name: "Three Questions" }] }
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
        { name: "Mathematics Textbook for Class X", lang: "en", chapters: [{ name: "Real Numbers" }] },
        { name: "गणित, कक्षा X", lang: "hi", chapters: [{ name: "वास्तविक संख्याएँ" }] }
      ]
    },
    science: {
      books: [
        { name: "Science Class X (2025 Syllabus)", lang: "en", chapters: [{ name: "Chemical Reactions and Equations" }] },
        { name: "विज्ञान (2025 Syllabus)", lang: "hi", chapters: [{ name: "रासायनिक अभिक्रियाएँ एवं समीकरण" }] }
      ]
    },
    social: {
      books: [
        { name: "India and the Contemporary World - II", lang: "en", chapters: [{ name: "The Rise of Nationalism in Europe" }] },
        { name: "भारत और समकालीन विश्व - II", lang: "hi", chapters: [{ name: "यूरोप में राष्ट्रवाद का उदय" }] }
      ]
    },
    english: {
      books: [
        { name: "First Flight", lang: "en", chapters: [{ name: "A Letter to God" }] }
      ]
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
