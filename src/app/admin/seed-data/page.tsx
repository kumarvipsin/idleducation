
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { seedNcertSolutions } from '@/app/actions';
import { Database } from 'lucide-react';

const ncertSolutionsData = {
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
          name: "विषय सूचि",
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
  }
};


export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await seedNcertSolutions('class-10', ncertSolutionsData['class-10']);
      if (result.success) {
        toast({
          title: "Success",
          description: "Class 10 NCERT solutions data has been seeded successfully.",
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
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seed Database</CardTitle>
        <CardDescription>
          Use this page to populate your Firestore database with initial data. 
          Click the button below to add the NCERT Solutions for Class 10.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedData} disabled={loading}>
          <Database className="mr-2 h-4 w-4" />
          {loading ? 'Seeding Data...' : 'Seed Class 10 Maths Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
