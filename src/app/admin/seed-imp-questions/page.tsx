
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedImportantQuestions } from '@/app/actions';
import { Database } from 'lucide-react';

const importantQuestionsData: { [key: string]: any } = {
  'class-9': {
    maths: {
      name: 'Mathematics',
      parts: {
        'part-1': {
          name: 'Part 1',
          chapters: [
            { name: 'Chapter 1: Number Systems', topics: [{ name: 'Topic 1.1', subTopics: [] }] },
            { name: 'Chapter 2: Polynomials', topics: [] },
          ]
        }
      }
    },
    science: {
      name: 'Science',
      chapters: [
        { name: 'Chapter 1: Matter in Our Surroundings', topics: [] },
        { name: 'Chapter 2: Is Matter Around Us Pure', topics: [] },
      ]
    }
  },
  'class-10': {
    maths: {
      name: 'Mathematics',
      chapters: [
        { name: 'Chapter 1: Real Numbers', topics: [] },
        { name: 'Chapter 2: Polynomials', topics: [] },
      ]
    },
    science: {
      name: 'Science',
      parts: {
        'physics': {
          name: 'Physics',
          chapters: [
            { name: 'Chapter 10: Light – Reflection and Refraction', topics: [] },
            { name: 'Chapter 11: Human Eye and Colourful World', topics: [] },
          ]
        },
        'chemistry': {
          name: 'Chemistry',
          chapters: [
            { name: 'Chapter 1: Chemical Reactions and Equations', topics: [] },
          ]
        }
      }
    }
  }
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
