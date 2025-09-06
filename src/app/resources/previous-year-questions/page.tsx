
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type Note = {
  title: string;
  description: string;
  language: string;
  bgColor: string;
  textColor: string;
  buttons: { text: string; href: string; }[];
};

const topCourses = [
    {
        title: "Science",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-indigo-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
    {
        title: "Maths",
        description: "Test Paper",
        language: "Ncert | Basic To Advance",
        bgColor: "bg-emerald-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
    {
        title: "Science",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
];

const papersByClass: { [key: string]: Note[] } = {
  'Class 6': topCourses,
  'Class 7': topCourses,
  'Class 8': topCourses,
  'Class 9': topCourses,
  'Class 10': topCourses,
  'Class 11': topCourses,
  'Class 12': topCourses,
};

const classes = Object.keys(papersByClass);

export default function PreviousYearQuestionsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papersByClass[selectedClass]?.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Questions for {selectedClass}</h1>
        <p className="text-muted-foreground">Practice with past exam papers to familiarize yourself with the format and question types.</p>
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
                className="pl-9 w-full md:w-1/3 lg:w-1/4 rounded-full h-8"
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
          {filteredPapers && filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <div key={index} className="p-1 h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${paper.bgColor}`}>
                    <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                    <h3 className={`text-xl font-semibold mb-2 ${paper.textColor}`}>
                        {paper.title}
                    </h3>
                      {paper.description && <p className={`text-sm mb-2 ${paper.textColor}`}>{paper.description}</p>}
                      {paper.language && <p className={`text-xs ${paper.textColor}`}>{paper.language}</p>}
                    <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                            <Link href="#">VIEW MORE</Link>
                        </Button>
                    </div>
                    </CardContent>
                </Card>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-12 animate-fade-in-up">
                <Card className="p-8 inline-block">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No papers found matching your criteria.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
