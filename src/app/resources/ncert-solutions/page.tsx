
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCheck, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type Solution = {
  subject: string;
  imageUrl: string;
  imageHint: string;
};

const solutionsByClass: { [key: string]: Solution[] } = {
  'Class 6': [
    { subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math book' },
    { subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1581093582522-220963a52d29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science textbook' },
    { subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1447023197998-c3a5f27a616d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'history manuscript' },
  ],
  'Class 7': [
    { subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1592527212953-e53b4742517c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math textbook' },
    { subject: 'Geography', imageUrl: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'world map' },
    { subject: 'Civics', imageUrl: 'https://images.unsplash.com/photo-1583464595882-ce2d56d12399?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'parliament building' },
  ],
  'Class 8': [
    { subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'open book' },
    { subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science experiment' },
  ],
  'Class 9': [
    { subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1632500022039-651553c7a727?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics equations' },
    { subject: 'Chemistry', imageUrl: 'https://images.unsplash.com/photo-1554475901-4538adb7524d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry beakers' },
    { subject: 'Biology', imageUrl: 'https://images.unsplash.com/photo-1576092762791-d01e1b0c01b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'dna model' },
  ],
  'Class 10': [
    { subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math problems' },
    { subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1532187643623-dbf2f39d20c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'biology microscope' },
  ],
  'Class 11': [
    { subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics textbook' },
    { subject: 'Chemistry', imageUrl: 'https://images.unsplash.com/photo-1627866762144-4050b1a0d778?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry set' },
    { subject: 'Biology', imageUrl: 'https://images.unsplash.com/photo-1582719202042-0655f891a27a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'plant biology' },
  ],
  'Class 12': [
    { subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics book' },
    { subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math formulas' },
    { subject: 'Accountancy', imageUrl: 'https://images.unsplash.com/photo-1606166303233-1525b6a715f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'calculator accounting' },
  ],
};

const classes = Object.keys(solutionsByClass);

export default function NcertSolutionsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSolutions = solutionsByClass[selectedClass]?.filter(solution =>
    solution.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
              className={`py-1 px-3 whitespace-nowrap text-xs font-medium rounded-full transition-colors
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
         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-1/2 lg:w-1/3 rounded-full h-9"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSolutions && filteredSolutions.length > 0 ? (
            filteredSolutions.map((solution, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={solution.imageUrl}
                    alt={solution.subject}
                    data-ai-hint={solution.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mt-2 truncate">{solution.subject}</h3>
                  <div className="mt-auto pt-4">
                     <Button asChild variant="outline" className="w-full">
                        <Link href="#">
                            <BookCheck className="mr-2 h-4 w-4" />
                            View Solutions
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
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
