
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCheck, Search, X, ArrowRight, Sigma, TestTube2, Landmark, Atom, Dna } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Note = {
  title: string;
  gradient: string;
  buttons: { text: string; href: string; }[];
  icon: React.ReactNode;
};

const class10Courses: Note[] = [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
];

const solutionsByClass: { [key: string]: Note[] } = {
  'Class 5': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
  ],
  'Class 6': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
  ],
  'Class 7': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
  ],
  'Class 8': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
  ],
  'Class 9': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Science",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-science" }],
        icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    {
        title: "Social Studies",
        gradient: "from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-social" }],
        icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    },
  ],
  'Class 10': class10Courses,
  'Class 11': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Physics",
        gradient: "from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-physics" }],
        icon: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
    },
    {
        title: "Chemistry",
        gradient: "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-chemistry" }],
        icon: <TestTube2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    },
    {
        title: "Biology",
        gradient: "from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-biology" }],
        icon: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
    },
  ],
  'Class 12': [
    {
        title: "Maths",
        gradient: "from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-maths" }],
        icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    {
        title: "Physics",
        gradient: "from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-physics" }],
        icon: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
    },
    {
        title: "Chemistry",
        gradient: "from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-chemistry" }],
        icon: <TestTube2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    },
    {
        title: "Biology",
        gradient: "from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-biology" }],
        icon: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
    },
  ],
};

const classes = Object.keys(solutionsByClass);

export default function NcertSolutionsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');

  const filteredSolutions = solutionsByClass[selectedClass];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">NCERT Solutions for {selectedClass}</h1>
        <p className="text-muted-foreground">Explore our detailed, step-by-step solutions for your NCERT textbooks.</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                ${selectedClass === className 
                  ? 'border-primary text-primary bg-primary/10 rounded-md' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">
        <div key={selectedClass} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSolutions && filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution, index) => (
              <Card 
                key={index} 
                className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${solution.gradient} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                    <div className="flex justify-between items-start w-full mb-4">
                        {solution.icon}
                        <Badge variant="secondary">{selectedClass}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1 flex-grow">{solution.title}</h3>
                    <Button asChild variant="default" className="mt-auto w-full">
                        <Link href={solution.buttons[0].href}>
                            {solution.buttons[0].text} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12 animate-fade-in-up">
                <Card className="p-8 inline-block">
                    <BookCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No solutions found for this class.</p>
                    <p className="text-sm text-muted-foreground">Please select another class to see available solutions.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
