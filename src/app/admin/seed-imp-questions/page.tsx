
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedImportantQuestions } from '@/app/actions';
import { Database } from 'lucide-react';

// Placeholder data for important questions.
// This structure can be expanded with actual questions, answers, and metadata.
const importantQuestionsData: { [key: string]: any } = {
  'class-5': {
    maths: [{ chapter: 'The Fish Tale', questions: ['Question 1...', 'Question 2...'] }],
    science: [{ chapter: 'Super Senses', questions: ['Question 1...'] }],
    social: [{ chapter: 'Globes and Maps', questions: ['Question 1...'] }],
    english: [{ chapter: 'Ice-Cream Man', questions: ['Question 1...'] }],
  },
  'class-6': {
    maths: [{ chapter: 'Knowing Our Numbers', questions: ['Question 1...'] }],
    science: [{ chapter: 'Food: Where Does It Come From?', questions: ['Question 1...'] }],
    social: [{ chapter: 'What, Where, How and When?', questions: ['Question 1...'] }],
    english: [{ chapter: 'Who Did Patrick’s Homework?', questions: ['Question 1...'] }],
  },
  'class-7': {
    maths: [{ chapter: 'Integers', questions: ['Question 1...'] }],
    science: [{ chapter: 'Nutrition in Plants', questions: ['Question 1...'] }],
    social: [{ chapter: 'Tracing Changes Through A Thousand Years', questions: ['Question 1...'] }],
    english: [{ chapter: 'Three Questions', questions: ['Question 1...'] }],
  },
  'class-8': {
    maths: [{ chapter: 'Rational Numbers', questions: ['Question 1...'] }],
    science: [{ chapter: 'Crop Production and Management', questions: ['Question 1...'] }],
    social: [{ chapter: 'How, When and Where', questions: ['Question 1...'] }],
    english: [{ chapter: 'The Best Christmas Present in the World', questions: ['Question 1...'] }],
  },
  'class-9': {
    maths: [{ chapter: 'Number Systems', questions: ['Question 1...'] }],
    science: [{ chapter: 'Matter in Our Surroundings', questions: ['Question 1...'] }],
    social: [{ chapter: 'The French Revolution', questions: ['Question 1...'] }],
    english: [{ chapter: 'The Fun They Had', questions: ['Question 1...'] }],
  },
  'class-10': {
    maths: [{ chapter: 'Real Numbers', questions: ['Question 1...'] }],
    science: [{ chapter: 'Chemical Reactions and Equations', questions: ['Question 1...'] }],
    social: [{ chapter: 'The Rise of Nationalism in Europe', questions: ['Question 1...'] }],
    english: [{ chapter: 'A Letter to God', questions: ['Question 1...'] }],
  },
  'class-11': {
    maths: [{ chapter: 'Sets', questions: ['Question 1...'] }],
    physics: [{ chapter: 'Units and Measurements', questions: ['Question 1...'] }],
    chemistry: [{ chapter: 'Some Basic Concepts of Chemistry', questions: ['Question 1...'] }],
    biology: [{ chapter: 'The Living World', questions: ['Question 1...'] }],
  },
  'class-12': {
    maths: [{ chapter: 'Relations and Functions', questions: ['Question 1...'] }],
    physics: [{ chapter: 'Electric Charges and Fields', questions: ['Question 1...'] }],
    chemistry: [{ chapter: 'The Solid State', questions: ['Question 1...'] }],
    biology: [{ chapter: 'Reproduction in Organisms', questions: ['Question 1...'] }],
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
