
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, Search, X } from 'lucide-react';
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
        buttons: [{ text: "VIEW MORE", href: "/resources/science-details" }],
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
        title: "Social Studies",
        description: "Ncert Besd",
        language: "English Medium | Hindi Medium",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        buttons: [{ text: "VIEW MORE", href: "#" }],
    },
];

const notesByClass: { [key: string]: Note[] } = {
  'Class 6': topCourses,
  'Class 7': topCourses,
  'Class 8': topCourses,
  'Class 9': topCourses,
  'Class 10': topCourses,
  'Class 11': topCourses,
  'Class 12': topCourses,
};

const classes = Object.keys(notesByClass);

export default function NotesPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notesByClass[selectedClass]?.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <div key={index} className="p-1 h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${note.bgColor}`}>
                    <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                    <h3 className={`text-xl font-semibold mb-2 ${note.textColor}`}>
                        {note.title}
                    </h3>
                      {note.description && <p className={`text-sm mb-2 ${note.textColor}`}>{note.description}</p>}
                      {note.language && <p className={`text-xs ${note.textColor}`}>{note.language}</p>}
                    <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                            <Link href={note.buttons[0].href}>{note.buttons[0].text}</Link>
                        </Button>
                    </div>
                    </CardContent>
                </Card>
              </div>
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
