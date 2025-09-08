
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, X, Download } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Paper = {
  subject: string;
  year: number;
  title: string;
  href: string;
};

const papersByExam: { [key: string]: Paper[] } = {
  'CBSE Class 10': [
    // 2024
    { subject: 'Science', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Science', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Science', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Maths (Standard)', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Maths (Basic)', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Social Studies', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Social Studies', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Social Studies', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'English', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'English', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'English', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Hindi A', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Hindi A', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Hindi A', year: 2024, title: 'Set 3', href: '#' },

    // 2023
    { subject: 'Science', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Science', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Science', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Maths (Standard)', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Hindi B', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Hindi B', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Hindi B', year: 2023, title: 'Set 3', href: '#' },
    
    // 2022
    { subject: 'Science', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Science', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Science', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Maths', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Maths', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Maths', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Social Studies', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Social Studies', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Social Studies', year: 2022, title: 'Set 3', href: '#' },

    // 2021
    { subject: 'Science', year: 2021, title: 'Set 1', href: '#' },
    { subject: 'Science', year: 2021, title: 'Set 2', href: '#' },
    { subject: 'Science', year: 2021, title: 'Set 3', href: '#' },
    { subject: 'Maths', year: 2021, title: 'Set 1', href: '#' },
    { subject: 'Maths', year: 2021, title: 'Set 2', href: '#' },
    { subject: 'Maths', year: 2021, title: 'Set 3', href: '#' },
    { subject: 'Social Studies', year: 2021, title: 'Set 1', href: '#' },
    { subject: 'Social Studies', year: 2021, title: 'Set 2', href: '#' },
    { subject: 'Social Studies', year: 2021, title: 'Set 3', href: '#' },

    // 2020
    { subject: 'Science', year: 2020, title: 'Set 1', href: '#' },
    { subject: 'Science', year: 2020, title: 'Set 2', href: '#' },
    { subject: 'Science', year: 2020, title: 'Set 3', href: '#' },
    { subject: 'Maths', year: 2020, title: 'Set 1', href: '#' },
    { subject: 'Maths', year: 2020, title: 'Set 2', href: '#' },
    { subject: 'Maths', year: 2020, title: 'Set 3', href: '#' },
  ],
  'CBSE Class 12': [
    // 2024
    { subject: 'Physics', year: 2024, title: 'Set A', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Set A', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Maths', year: 2024, title: 'Set A', href: '#' },
    { subject: 'Maths', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Maths', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Biology', year: 2024, title: 'Set A', href: '#' },
    { subject: 'Biology', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Biology', year: 2024, title: 'Set C', href: '#' },
    { subject: 'English', year: 2024, title: 'Set A', href: '#' },
    { subject: 'English', year: 2024, title: 'Set B', href: '#' },
    { subject: 'English', year: 2024, title: 'Set C', href: '#' },

    // 2023
    { subject: 'Physics', year: 2023, title: 'Main Paper', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Chemistry', year: 2023, title: 'Main Paper', href: '#' },
    { subject: 'Chemistry', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Chemistry', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Main Paper', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'English', year: 2023, title: 'Set 3', href: '#' },

    // 2022
    { subject: 'Physics', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Physics', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Physics', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 3', href: '#' },
  ],
  'NEET': [
    { subject: 'Biology', year: 2024, title: 'Official Paper', href: '#' },
    { subject: 'Biology', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Biology', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Official Paper', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Official Paper', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Set B', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Set C', href: '#' },
    { subject: 'Biology', year: 2023, title: 'Official Paper', href: '#' },
    { subject: 'Biology', year: 2023, title: 'Set B', href: '#' },
    { subject: 'Biology', year: 2023, title: 'Set C', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Official Paper', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Set B', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Set C', href: '#' },
  ],
  'JEE': [
    { subject: 'Maths', year: 2024, title: 'Paper 1', href: '#' },
    { subject: 'Maths', year: 2024, title: 'Paper 2', href: '#' },
    { subject: 'Maths', year: 2024, title: 'Paper 3', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Paper 1', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Paper 2', href: '#' },
    { subject: 'Physics', year: 2024, title: 'Paper 3', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Paper 1', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Paper 2', href: '#' },
    { subject: 'Chemistry', year: 2024, title: 'Paper 3', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Paper 1', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Paper 2', href: '#' },
    { subject: 'Maths', year: 2023, title: 'Paper 3', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Paper 1', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Paper 2', href: '#' },
    { subject: 'Physics', year: 2023, title: 'Paper 3', href: '#' },
  ],
};

const examCategories = Object.keys(papersByExam);

type GroupedPapers = {
  [year: number]: {
    [subject: string]: Paper[];
  };
};

export default function PreviousYearQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const papersGrouped: GroupedPapers = papersByExam[selectedExam]
    ?.filter(paper => 
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paper.year.toString().includes(searchTerm)
    )
    .reduce((acc, paper) => {
        const { year, subject } = paper;
        if (!acc[year]) {
            acc[year] = {};
        }
        if (!acc[year][subject]) {
            acc[year][subject] = [];
        }
        acc[year][subject].push(paper);
        return acc;
    }, {} as GroupedPapers);

  const sortedYears = papersGrouped ? Object.keys(papersGrouped).map(Number).sort((a, b) => b - a) : [];
  
  const defaultAccordionValue = sortedYears.length > 0 ? [`year-${sortedYears[0]}`] : [];

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
        <Card>
            <CardHeader>
                <CardTitle>Available Papers for {selectedExam}</CardTitle>
                <CardDescription>Click on a year to expand and view the question papers.</CardDescription>
            </CardHeader>
            <CardContent>
                {sortedYears.length > 0 ? (
                    <Accordion type="multiple" defaultValue={defaultAccordionValue} className="w-full space-y-2">
                        {sortedYears.map((year) => (
                            <AccordionItem value={`year-${year}`} key={year} className="border rounded-lg shadow-sm bg-background/50">
                                <AccordionTrigger className="font-semibold text-lg p-4 hover:no-underline">
                                    {year} Question Papers
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Subject</TableHead>
                                                    <TableHead>Sets / Papers Available</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                               {Object.entries(papersGrouped[year]).map(([subject, papers]) => (
                                                    <TableRow key={subject}>
                                                        <TableCell className="font-medium align-top py-4">{subject}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-2 items-start">
                                                                {papers.map((paper, index) => (
                                                                    <div key={index} className="flex items-center justify-between w-full">
                                                                        <span>{paper.title}</span>
                                                                        <Button asChild size="sm" variant="outline">
                                                                            <Link href={paper.href}>
                                                                                <Download className="mr-2 h-4 w-4" />
                                                                                Download
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="p-8 inline-block">
                            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No papers found matching your criteria.</p>
                            <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
