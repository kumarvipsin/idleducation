
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Note = {
  subject: string;
  imageUrl: string;
  imageHint: string;
};

const notesByClass: { [key: string]: Note[] } = {
  'Class 6': [
    { subject: 'Maths Notes', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math book' },
    { subject: 'Science Notes', imageUrl: 'https://images.unsplash.com/photo-1581093582522-220963a52d29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science textbook' },
  ],
  'Class 7': [
    { subject: 'History Notes', imageUrl: 'https://images.unsplash.com/photo-1569033397943-9376a4a1a5a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'history book' },
    { subject: 'Geography Notes', imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'world map' },
  ],
  'Class 8': [
    { subject: 'Maths Notes', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'open book' },
    { subject: 'Science Notes', imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science experiment' },
  ],
  'Class 9': [
    { subject: 'Physics Notes', imageUrl: 'https://images.unsplash.com/photo-1632500022039-651553c7a727?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics equations' },
    { subject: 'Chemistry Notes', imageUrl: 'https://images.unsplash.com/photo-1554475901-4538adb7524d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry beakers' },
    { subject: 'Biology Notes', imageUrl: 'https://images.unsplash.com/photo-1576092762791-d01e1b0c01b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'dna model' },
  ],
  'Class 10': [
    { subject: 'Maths Notes', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math problems' },
    { subject: 'Science Notes', imageUrl: 'https://images.unsplash.com/photo-1532187643623-dbf2f39d20c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'biology microscope' },
  ],
  'Class 11': [
    { subject: 'Physics Notes', imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics textbook' },
    { subject: 'Chemistry Notes', imageUrl: 'https://images.unsplash.com/photo-1627866762144-4050b1a0d778?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry set' },
  ],
  'Class 12': [
    { subject: 'Maths Notes', imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math formulas' },
    { subject: 'Biology Notes', imageUrl: 'https://images.unsplash.com/photo-1582719202042-0655f891a27a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'plant biology' },
  ],
};

const classes = Object.keys(notesByClass);

export default function NotesPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');

  const notes = notesByClass[selectedClass] || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Study Notes for {selectedClass}</h1>
        <p className="text-muted-foreground">Find concise and comprehensive notes to help you revise and learn effectively.</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium rounded-full transition-colors
                ${selectedClass === className 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {className}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={note.imageUrl}
                    alt={note.subject}
                    data-ai-hint={note.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mt-2 truncate">{note.subject}</h3>
                  <div className="mt-auto pt-4">
                     <Button asChild variant="outline" className="w-full">
                        <Link href="#">
                            <BookText className="mr-2 h-4 w-4" />
                            View Notes
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
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
