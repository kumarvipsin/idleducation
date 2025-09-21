
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
      ],
    },
    social: {
      books: [
        { name: "Our Pasts - I", chapters: [
          { name: "Chapter 1: What, Where, How and When?", slug: "what-where-how-and-when" },
          { name: "Chapter 2: On The Trail of The Earliest People", slug: "from-hunting-gathering-to-growing-food" },
        ]},
        { name: "The Earth: Our Habitat", chapters: [
          { name: "Chapter 1: The Earth in the Solar System", slug: "the-earth-in-the-solar-system" },
          { name: "Chapter 2: Globe: Latitudes and Longitudes", slug: "globe-latitudes-and-longitudes" },
        ]},
        { name: "Social and Political Life - I", chapters: [
          { name: "Chapter 1: Understanding Diversity", slug: "understanding-diversity" },
        ]},
      ]
    },
    english: {
      books: [
        {
          name: "Honeysuckle",
          chapters: [
            { name: "Chapter 1: Who Did Patrick’s Homework?", slug: "c6-en-h-unit1" },
            { name: "Chapter 2: How the Dog Found Himself a New Master!", slug: "c6-en-h-unit2" },
          ],
        },
        {
          name: "A Pact with the Sun",
          chapters: [
            { name: "Chapter 1: A Tale of Two Birds", slug: "c6-en-p-unit1" },
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
