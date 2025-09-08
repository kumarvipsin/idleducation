
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, X, Download } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type Paper = {
  subject: string;
  year: number;
  href: string;
};

const papersByExam: { [key: string]: Paper[] } = {
  'CBSE Class 10': [
    { subject: 'Science', year: 2024, href: '#' },
    { subject: 'Maths', year: 2024, href: '#' },
    { subject: 'Social Studies', year: 2024, href: '#' },
    { subject: 'English', year: 2024, href: '#' },
    { subject: 'Science', year: 2023, href: '#' },
    { subject: 'Maths', year: 2023, href: '#' },
    { subject: 'Social Studies', year: 2023, href: '#' },
    { subject: 'English', year: 2023, href: '#' },
    { subject: 'Science', year: 2022, href: '#' },
    { subject: 'Maths', year: 2022, href: '#' },
    { subject: 'Social Studies', year: 2022, href: '#' },
    { subject: 'English', year: 2022, href: '#' },
    { subject: 'Science', year: 2021, href: '#' },
    { subject: 'Maths', year: 2021, href: '#' },
    { subject: 'Social Studies', year: 2021, href: '#' },
    { subject: 'English', year: 2021, href: '#' },
    { subject: 'Science', year: 2020, href: '#' },
    { subject: 'Maths', year: 2020, href: '#' },
    { subject: 'Social Studies', year: 2020, href: '#' },
    { subject: 'English', year: 2020, href: '#' },
  ],
  'CBSE Class 12': [
    { subject: 'Physics', year: 2024, href: '#' },
    { subject: 'Chemistry', year: 2024, href: '#' },
    { subject: 'Maths', year: 2024, href: '#' },
    { subject: 'Biology', year: 2024, href: '#' },
    { subject: 'Physics', year: 2023, href: '#' },
    { subject: 'Chemistry', year: 2023, href: '#' },
    { subject: 'Maths', year: 2023, href: '#' },
    { subject: 'Biology', year: 2023, href: '#' },
    { subject: 'Physics', year: 2022, href: '#' },
    { subject: 'Chemistry', year: 2022, href: '#' },
    { subject: 'Maths', year: 2022, href: '#' },
    { subject: 'Biology', year: 2022, href: '#' },
     { subject: 'Physics', year: 2021, href: '#' },
    { subject: 'Chemistry', year: 2021, href: '#' },
    { subject: 'Maths', year: 2021, href: '#' },
    { subject: 'Biology', year: 2021, href: '#' },
     { subject: 'Physics', year: 2020, href: '#' },
    { subject: 'Chemistry', year: 2020, href: '#' },
    { subject: 'Maths', year: 2020, href: '#' },
    { subject: 'Biology', year: 2020, href: '#' },
  ],
  'NEET': [
    { subject: 'Biology', year: 2024, href: '#' },
    { subject: 'Physics', year: 2024, href: '#' },
    { subject: 'Chemistry', year: 2024, href: '#' },
    { subject: 'Biology', year: 2023, href: '#' },
    { subject: 'Physics', year: 2023, href: '#' },
    { subject: 'Chemistry', year: 2023, href: '#' },
  ],
  'JEE': [
    { subject: 'Maths', year: 2024, href: '#' },
    { subject: 'Physics', year: 2024, href: '#' },
    { subject: 'Chemistry', year: 2024, href: '#' },
    { subject: 'Maths', year: 2023, href: '#' },
    { subject: 'Physics', year: 2023, href: '#' },
    { subject: 'Chemistry', year: 2023, href: '#' },
  ],
};

const examCategories = Object.keys(papersByExam);

export default function PreviousYearQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papersByExam[selectedExam]?.filter(paper =>
    paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.year.toString().includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Question Papers</h1>
        <p className="text-muted-foreground">Practice with past exam papers for {selectedExam} to familiarize yourself with the format and question types.</p>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-8">
        <div className="flex items-center overflow-x-auto space-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {examCategories.map((examName) => (
            <button
              key={examName}
              onClick={() => setSelectedExam(examName)}
              className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                ${selectedExam === examName 
                  ? 'border-primary text-primary bg-primary/10 rounded-md' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
            >
              {examName}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1">
        <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by subject or year..."
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
        <div key={selectedExam} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPapers && filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <div key={index} className="p-1 h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <Card className="flex flex-col h-full rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all duration-300">
                    <CardContent className="p-4 flex flex-col flex-grow items-center justify-center text-center bg-muted/30">
                        <FileText className="w-12 h-12 text-primary mb-3" />
                        <h3 className="text-lg font-semibold text-foreground">
                            {paper.subject}
                        </h3>
                        <p className="text-sm text-muted-foreground font-mono">{paper.year}</p>
                    </CardContent>
                    <div className="p-3 border-t">
                         <Button asChild variant="secondary" className="w-full">
                            <Link href={paper.href}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Link>
                        </Button>
                    </div>
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
