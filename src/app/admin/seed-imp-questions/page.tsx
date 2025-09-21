
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
        { name: "Looking Around Textbook for Class V", lang: "en", chapters: [{ name: "Super Senses" }] },
        { name: "आस-पास, कक्षा V", lang: "hi", chapters: [{ name: "कैसे पहचाना चींटी ने दोस्त को?" }] }
      ]
    },
    social: {
       books: [
        { name: "Social Studies Class V", lang: "en", chapters: [{ name: "Globes and Maps" }] },
        { name: "सामाजिक अध्ययन, कक्षा V", lang: "hi", chapters: [{ name: "ग्लोब और मानचित्र" }] }
      ]
    },
    english: {
      books: [
        { name: "Marigold Textbook in English for Class V", lang: "en", chapters: [{ name: "Ice-Cream Man" }] }
      ]
    },
  },
  'class-6': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class VI", lang: "en", chapters: [{ name: "Knowing Our Numbers" }] },
        { name: "गणित, कक्षा VI", lang: "hi", chapters: [{ name: "अपनी संख्याओं की जानकारी" }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VI", lang: "en", chapters: [{ name: "Food: Where Does It Come From?" }] },
        { name: "विज्ञान, कक्षा VI", lang: "hi", chapters: [{ name: "भोजन: यह कहाँ से आता है?" }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - I", lang: "en", chapters: [{ name: "What, Where, How and When?" }] },
        { name: "हमारे अतीत - I", lang: "hi", chapters: [{ name: "क्या, कब, कहाँ और कैसे?" }] }
      ]
    },
    english: {
      books: [
        { name: "Honeysuckle", lang: "en", chapters: [{ name: "Who Did Patrick’s Homework?" }] }
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
