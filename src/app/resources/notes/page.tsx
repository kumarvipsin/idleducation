
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, TestTube2, Scale, Globe, Landmark, Atom, Sigma, Dna, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Subject = {
  name: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

const notesByClass: { [key: string]: Subject[] } = {
  'Class 5': [
    { name: 'Maths', href: '/resources/class-5-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-5-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-5-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-5-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 6': [
    { name: 'Maths', href: '/resources/class-6-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-6-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-6-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-6-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 7': [
    { name: 'Maths', href: '/resources/class-7-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-7-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-7-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-7-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 8': [
    { name: 'Maths', href: '/resources/class-8-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-8-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-8-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-8-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 9': [
    { name: 'Maths', href: '/resources/class-9-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-9-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-9-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-9-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 10': [
    { name: 'Maths', href: '/resources/class-10-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Science', href: '/resources/class-10-science', icon: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />, gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' },
    { name: 'Social Studies', href: '/resources/class-10-social', icon: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />, gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30' },
    { name: 'English', href: '/resources/class-10-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 11': [
    { name: 'Maths', href: '/resources/class-11-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Physics', href: '/resources/class-11-physics', icon: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />, gradient: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30' },
    { name: 'Chemistry', href: '/resources/class-11-chemistry', icon: <TestTube2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
    { name: 'Biology', href: '/resources/class-11-biology', icon: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />, gradient: 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30' },
    { name: 'History', href: '/resources/class-11-history', icon: <Landmark className="w-8 h-8 text-red-600 dark:text-red-400" />, gradient: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30' },
    { name: 'Geography', href: '/resources/class-11-geography', icon: <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />, gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30' },
    { name: 'Political Science', href: '/resources/class-11-polsci', icon: <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />, gradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30' },
    { name: 'Economics', href: '/resources/class-11-economics', icon: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />, gradient: 'from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30' },
    { name: 'English', href: '/resources/class-11-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
  'Class 12': [
    { name: 'Maths', href: '/resources/class-12-maths', icon: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />, gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' },
    { name: 'Physics', href: '/resources/class-12-physics', icon: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />, gradient: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30' },
    { name: 'Chemistry', href: '/resources/class-12-chemistry', icon: <TestTube2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
    { name: 'Biology', href: '/resources/class-12-biology', icon: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />, gradient: 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30' },
    { name: 'History', href: '/resources/class-12-history', icon: <Landmark className="w-8 h-8 text-red-600 dark:text-red-400" />, gradient: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30' },
    { name: 'Geography', href: '/resources/class-12-geography', icon: <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />, gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30' },
    { name: 'Political Science', href: '/resources/political-science-details', icon: <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />, gradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30' },
    { name: 'Economics', href: '/resources/class-12-economics', icon: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />, gradient: 'from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30' },
     { name: 'English', href: '/resources/class-12-english', icon: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />, gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30' },
  ],
};

const classes = Object.keys(notesByClass);

export default function NotesPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');

  const subjects = notesByClass[selectedClass];

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Study Notes for {selectedClass}</h1>
        <p className="text-muted-foreground">Find concise and comprehensive notes to help you revise and learn effectively.</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
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
      </div>

      <main className="flex-1">
        <div key={selectedClass} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects && subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <Card 
                key={index} 
                className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${subject.gradient} animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                    <div className="flex justify-between items-start w-full mb-4">
                        {subject.icon}
                        <Badge variant="secondary">{selectedClass}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1 flex-grow">{subject.name}</h3>
                    <Button asChild variant="default" className="mt-auto w-full">
                        <Link href={subject.href}>
                            VIEW MORE <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12 animate-fade-in-up">
                <Card className="p-8 inline-block">
                    <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                    <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
