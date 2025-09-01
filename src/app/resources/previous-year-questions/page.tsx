
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type QuestionPaper = {
  subject: string;
  year: number;
  imageUrl: string;
  imageHint: string;
};

const papersByClass: { [key: string]: QuestionPaper[] } = {
  'Class 6': [],
  'Class 7': [],
  'Class 8': [],
  'Class 9': [],
  'Class 10': [],
  'Class 11': [],
  'Class 12': [],
};

const classes = Object.keys(papersByClass);

export default function PreviousYearQuestionsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papersByClass[selectedClass]?.filter(paper =>
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredPapers && filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={paper.imageUrl}
                    alt={`${paper.subject} ${paper.year}`}
                    data-ai-hint={paper.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mt-2 truncate">{paper.subject} - {paper.year}</h3>
                  <div className="mt-auto pt-4">
                     <Button asChild variant="outline" className="w-full">
                        <Link href="#">
                            <FileText className="mr-2 h-4 w-4" />
                            View Paper
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
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
