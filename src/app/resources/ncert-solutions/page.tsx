
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCheck, Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type Note = {
  title: string;
  description: string;
  language: string;
  gradient: string;
  buttons: { text: string; href: string; }[];
};

const class10Courses = [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-10-social" }],
    },
];

const solutionsByClass: { [key: string]: Note[] } = {
  'Class 5': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-5-social" }],
    },
  ],
  'Class 6': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-6-social" }],
    },
  ],
  'Class 7': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-7-social" }],
    },
  ],
  'Class 8': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-8-social" }],
    },
  ],
  'Class 9': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-maths" }],
    },
    {
        title: "Science",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-blue-500 to-indigo-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-science" }],
    },
    {
        title: "Social Studies",
        description: "History, Geography, Civics",
        language: "English Medium | Hindi Medium",
        gradient: "from-amber-500 to-orange-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-9-social" }],
    },
  ],
  'Class 10': class10Courses,
  'Class 11': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-maths" }],
    },
    {
        title: "Physics",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-sky-500 to-cyan-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-physics" }],
    },
    {
        title: "Chemistry",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-purple-500 to-violet-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-11-chemistry" }],
    },
  ],
  'Class 12': [
    {
        title: "Maths",
        description: "Complete Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-green-500 to-emerald-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-maths" }],
    },
    {
        title: "Physics",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-sky-500 to-cyan-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-physics" }],
    },
    {
        title: "Chemistry",
        description: "Chapter-wise Solutions",
        language: "NCERT | Basic To Advance",
        gradient: "from-purple-500 to-violet-600",
        buttons: [{ text: "VIEW MORE", href: "/resources/class-12-chemistry" }],
    },
  ],
};

const classes = Object.keys(solutionsByClass);

export default function NcertSolutionsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSolutions = solutionsByClass[selectedClass]?.filter(solution =>
    solution.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-1/4 lg:w-1/5 rounded-full h-9"
            />
             {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-full rounded-l-none"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
        </div>
        <div key={selectedClass} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSolutions && filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution, index) => (
              <Card key={index} className={`flex flex-col text-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${solution.gradient} animate-fade-in-up`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardContent className="p-6 flex flex-col flex-grow items-start">
                      <h3 className="text-2xl font-bold mb-2 flex-grow">{solution.title}</h3>
                      {solution.description && <p className={`text-sm mb-2 opacity-90`}>{solution.description}</p>}
                      {solution.language && <p className={`text-xs opacity-80 mb-6`}>{solution.language}</p>}
                      <Button asChild variant="secondary" className="mt-auto bg-white/90 text-black hover:bg-white w-full">
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
