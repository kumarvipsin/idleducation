
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
        { name: "Math-Magic Textbook for Class V", lang: "en", chapters: [{ name: "The Fish Tale", questions: ["Question 1...", "Question 2..."] }] },
        { name: "गणित का जादू, कक्षा V", lang: "hi", chapters: [{ name: "मछली उछली", questions: ["प्रश्न 1...", "प्रश्न 2..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Looking Around Textbook for Class V", lang: "en", chapters: [{ name: "Super Senses", questions: ["Question 1..."] }] },
        { name: "आस-पास, कक्षा V", lang: "hi", chapters: [{ name: "कैसे पहचाना चींटी ने दोस्त को?", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
       books: [
        { name: "Social Studies Class V", lang: "en", chapters: [{ name: "Globes and Maps", questions: ["Question 1..."] }] },
        { name: "सामाजिक अध्ययन, कक्षा V", lang: "hi", chapters: [{ name: "ग्लोब और मानचित्र", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
      books: [
        { name: "Marigold Textbook in English for Class V", lang: "en", chapters: [{ name: "Ice-Cream Man", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-6': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class VI", lang: "en", chapters: [{ name: "Knowing Our Numbers", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा VI", lang: "hi", chapters: [{ name: "अपनी संख्याओं की जानकारी", questions: ["प्रश्न 1..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VI", lang: "en", chapters: [{ name: "Food: Where Does It Come From?", questions: ["Question 1..."] }] },
        { name: "विज्ञान, कक्षा VI", lang: "hi", chapters: [{ name: "भोजन: यह कहाँ से आता है?", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - I", lang: "en", chapters: [{ name: "What, Where, How and When?", questions: ["Question 1..."] }] },
        { name: "हमारे अतीत - I", lang: "hi", chapters: [{ name: "क्या, कब, कहाँ और कैसे?", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
      books: [
        { name: "Honeysuckle", lang: "en", chapters: [{ name: "Who Did Patrick’s Homework?", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-7': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class VII", lang: "en", chapters: [{ name: "Integers", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा VII", lang: "hi", chapters: [{ name: "पूर्णांक", questions: ["प्रश्न 1..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VII", lang: "en", chapters: [{ name: "Nutrition in Plants", questions: ["Question 1..."] }] },
        { name: "विज्ञान, कक्षा VII", lang: "hi", chapters: [{ name: "पादपों में पोषण", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - II", lang: "en", chapters: [{ name: "Tracing Changes Through A Thousand Years", questions: ["Question 1..."] }] },
        { name: "हमारे अतीत - II", lang: "hi", chapters: [{ name: "हज़ार वर्षों के दौरान हुए परिवर्तनों की पड़ताल", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
       books: [
        { name: "Honeycomb", lang: "en", chapters: [{ name: "Three Questions", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-8': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class VIII", lang: "en", chapters: [{ name: "Rational Numbers", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा VIII", lang: "hi", chapters: [{ name: "परिमेय संख्याएँ", questions: ["प्रश्न 1..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class VIII", lang: "en", chapters: [{ name: "Crop Production and Management", questions: ["Question 1..."] }] },
        { name: "विज्ञान, कक्षा VIII", lang: "hi", chapters: [{ name: "फसल उत्पादन एवं प्रबंध", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
      books: [
        { name: "Our Pasts - III", lang: "en", chapters: [{ name: "How, When and Where", questions: ["Question 1..."] }] },
        { name: "हमारे अतीत - III", lang: "hi", chapters: [{ name: "कैसे, कब और कहाँ", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
      books: [
        { name: "Honeydew", lang: "en", chapters: [{ name: "The Best Christmas Present in the World", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-9': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class IX", lang: "en", chapters: [{ name: "Number Systems", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा IX", lang: "hi", chapters: [{ name: "संख्या पद्धति", questions: ["प्रश्न 1..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Science Textbook for Class IX", lang: "en", chapters: [{ name: "Matter in Our Surroundings", questions: ["Question 1..."] }] },
        { name: "विज्ञान, कक्षा IX", lang: "hi", chapters: [{ name: "हमारे आस-पास के पदार्थ", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
       books: [
        { name: "India and the Contemporary World - I", lang: "en", chapters: [{ name: "The French Revolution", questions: ["Question 1..."] }] },
        { name: "भारत और समकालीन विश्व - I", lang: "hi", chapters: [{ name: "फ्रांसीसी क्रांति", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
      books: [
        { name: "Beehive", lang: "en", chapters: [{ name: "The Fun They Had", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-10': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class X", lang: "en", chapters: [{ name: "Real Numbers", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा X", lang: "hi", chapters: [{ name: "वास्तविक संख्याएँ", questions: ["प्रश्न 1..."] }] }
      ]
    },
    science: {
      books: [
        { name: "Science Class X (2025 Syllabus)", lang: "en", chapters: [{ name: "Chemical Reactions and Equations", questions: ["Question 1..."] }] },
        { name: "विज्ञान (2025 Syllabus)", lang: "hi", chapters: [{ name: "रासायनिक अभिक्रियाएँ एवं समीकरण", questions: ["प्रश्न 1..."] }] }
      ]
    },
    social: {
      books: [
        { name: "India and the Contemporary World - II", lang: "en", chapters: [{ name: "The Rise of Nationalism in Europe", questions: ["Question 1..."] }] },
        { name: "भारत और समकालीन विश्व - II", lang: "hi", chapters: [{ name: "यूरोप में राष्ट्रवाद का उदय", questions: ["प्रश्न 1..."] }] }
      ]
    },
    english: {
      books: [
        { name: "First Flight", lang: "en", chapters: [{ name: "A Letter to God", questions: ["Question 1..."] }] }
      ]
    },
  },
  'class-11': {
    maths: {
      books: [
        { name: "Mathematics Textbook for Class XI", lang: "en", chapters: [{ name: "Sets", questions: ["Question 1..."] }] },
        { name: "गणित, कक्षा XI", lang: "hi", chapters: [{ name: "समुच्चय", questions: ["प्रश्न 1..."] }] }
      ]
    },
    physics: {
      books: [
        { name: "Physics Part - I", lang: "en", chapters: [{ name: "Units and Measurements", questions: ["Question 1..."] }] },
        { name: "भौतिकी भाग I", lang: "hi", chapters: [{ name: "मात्रक और मापन", questions: ["प्रश्न 1..."] }] }
      ]
    },
    chemistry: {
      books: [
        { name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Some Basic Concepts of Chemistry", questions: ["Question 1..."] }] },
        { name: "रसायन विज्ञान भाग I", lang: "hi", chapters: [{ name: "रसायन विज्ञान की कुछ मूल अवधारणाएँ", questions: ["प्रश्न 1..."] }] }
      ]
    },
    biology: {
      books: [
        { name: "Biology Textbook for Class XI", lang: "en", chapters: [{ name: "The Living World", questions: ["Question 1..."] }] },
        { name: "जीव विज्ञान, कक्षा XI", lang: "hi", chapters: [{ name: "जीव जगत", questions: ["प्रश्न 1..."] }] }
      ]
    },
  },
  'class-12': {
    maths: {
      books: [
        { name: "Mathematics Part - I", lang: "en", chapters: [{ name: "Relations and Functions", questions: ["Question 1..."] }] },
        { name: "गणित भाग I", lang: "hi", chapters: [{ name: "संबंध एवं फलन", questions: ["प्रश्न 1..."] }] }
      ]
    },
    physics: {
      books: [
        { name: "Physics Part - I", lang: "en", chapters: [{ name: "Electric Charges and Fields", questions: ["Question 1..."] }] },
        { name: "भौतिकी भाग I", lang: "hi", chapters: [{ name: "वैद्युत आवेश तथा क्षेत्र", questions: ["प्रश्न 1..."] }] }
      ]
    },
    chemistry: {
      books: [
        { name: "Chemistry Part - I", lang: "en", chapters: [{ name: "Solutions", questions: ["Question 1..."] }] },
        { name: "रसायन विज्ञान भाग I", lang: "hi", chapters: [{ name: "विलयन", questions: ["प्रश्न 1..."] }] }
      ]
    },
    biology: {
      books: [
        { name: "Biology Textbook for Class XII", lang: "en", chapters: [{ name: "Sexual Reproduction in Flowering Plants", questions: ["Question 1..."] }] },
        { name: "जीव विज्ञान, कक्षा XII", lang: "hi", chapters: [{ name: "पुष्पी पादपों में लैंगिक जनन", questions: ["प्रश्न 1..."] }] }
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
