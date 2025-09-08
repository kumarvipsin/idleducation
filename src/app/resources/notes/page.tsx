
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, Search, X, TestTube2, Scale, Microscope, Globe, Landmark, Languages, Atom, Sigma, Dna } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type Subject = {
  name: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

const notesByClass: { [key: string]: Subject[] } = {
  'Class 5': [
    { name: 'Maths', href: '/resources/class-5-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-5-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-5-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 6': [
    { name: 'Maths', href: '/resources/class-6-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-6-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-6-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 7': [
    { name: 'Maths', href: '/resources/class-7-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-7-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-7-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 8': [
    { name: 'Maths', href: '/resources/class-8-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-8-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-8-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 9': [
    { name: 'Maths', href: '/resources/class-9-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-9-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-9-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 10': [
    { name: 'Maths', href: '/resources/class-10-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Science', href: '/resources/class-10-science', icon: <TestTube2 />, gradient: 'from-blue-400 to-blue-600' },
    { name: 'Social Studies', href: '/resources/class-10-social', icon: <Landmark />, gradient: 'from-amber-400 to-amber-600' },
  ],
  'Class 11': [
    { name: 'Maths', href: '/resources/class-11-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Physics', href: '/resources/class-11-physics', icon: <Atom />, gradient: 'from-sky-400 to-sky-600' },
    { name: 'Chemistry', href: '/resources/class-11-chemistry', icon: <TestTube2 />, gradient: 'from-purple-400 to-purple-600' },
    { name: 'Biology', href: '/resources/class-11-biology', icon: <Dna />, gradient: 'from-lime-400 to-lime-600' },
    { name: 'History', href: '/resources/class-11-history', icon: <Landmark />, gradient: 'from-red-400 to-red-600' },
    { name: 'Geography', href: '/resources/class-11-geography', icon: <Globe />, gradient: 'from-orange-400 to-orange-600' },
    { name: 'Political Science', href: '/resources/class-11-polsci', icon: <Scale />, gradient: 'from-indigo-400 to-indigo-600' },
  ],
  'Class 12': [
    { name: 'Maths', href: '/resources/class-12-maths', icon: <Sigma />, gradient: 'from-green-400 to-green-600' },
    { name: 'Physics', href: '/resources/class-12-physics', icon: <Atom />, gradient: 'from-sky-400 to-sky-600' },
    { name: 'Chemistry', href: '/resources/class-12-chemistry', icon: <TestTube2 />, gradient: 'from-purple-400 to-purple-600' },
    { name: 'Biology', href: '/resources/class-12-biology', icon: <Dna />, gradient: 'from-lime-400 to-lime-600' },
    { name: 'History', href: '/resources/class-12-history', icon: <Landmark />, gradient: 'from-red-400 to-red-600' },
    { name: 'Geography', href: '/resources/class-12-geography', icon: <Globe />, gradient: 'from-orange-400 to-orange-600' },
    { name: 'Political Science', href: '/resources/political-science-details', icon: <Scale />, gradient: 'from-indigo-400 to-indigo-600' },
  ],
};

const classes = Object.keys(notesByClass);

export default function NotesPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = notesByClass[selectedClass]?.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Study Notes for {selectedClass}</h1>
        <p className="text-muted-foreground">Find concise and comprehensive notes to help you revise and learn effectively.</p>
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
                <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
        <div key={selectedClass} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubjects && filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <Link href={subject.href} key={index} className="block group animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Card className={`h-full rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${subject.gradient}`}>
                    <CardContent className="p-6 text-center text-white flex flex-col items-center justify-center h-full">
                        <div className="mb-4 text-white/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-white">
                           {React.cloneElement(subject.icon, { className: "w-12 h-12" })}
                        </div>
                        <h3 className="text-lg font-bold">
                            {subject.name}
                        </h3>
                    </CardContent>
                </Card>
              </Link>
            ))
          ) : (
             <div className="col-span-full text-center py-12 animate-fade-in-up">
                <Card className="p-8 inline-block">
                    <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No notes found matching your criteria.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
