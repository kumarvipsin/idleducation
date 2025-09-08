
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
    { subject: 'Hindi B', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Hindi B', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Hindi B', year: 2024, title: 'Set 3', href: '#' },

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
    { subject: 'Political Science', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Political Science', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Political Science', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'History', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'History', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'History', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Geography', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Geography', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Geography', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Economics', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Economics', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Economics', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Sociology', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Sociology', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Sociology', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Psychology', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Psychology', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Psychology', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Accountancy', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Accountancy', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Accountancy', year: 2024, title: 'Set 3', href: '#' },
    { subject: 'Business Studies', year: 2024, title: 'Set 1', href: '#' },
    { subject: 'Business Studies', year: 2024, title: 'Set 2', href: '#' },
    { subject: 'Business Studies', year: 2024, title: 'Set 3', href: '#' },

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
    { subject: 'Political Science', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Political Science', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Political Science', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'History', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'History', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'History', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Geography', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Geography', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Geography', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Economics', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Economics', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Economics', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Accountancy', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Accountancy', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Accountancy', year: 2023, title: 'Set 3', href: '#' },
    { subject: 'Business Studies', year: 2023, title: 'Set 1', href: '#' },
    { subject: 'Business Studies', year: 2023, title: 'Set 2', href: '#' },
    { subject: 'Business Studies', year: 2023, title: 'Set 3', href: '#' },

    // 2022
    { subject: 'Physics', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Physics', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Physics', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Chemistry', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Political Science', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Political Science', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Political Science', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'History', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'History', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'History', year: 2022, title: 'Set 3', href: '#' },
    { subject: 'Economics', year: 2022, title: 'Set 1', href: '#' },
    { subject: 'Economics', year: 2022, title: 'Set 2', href: '#' },
    { subject: 'Economics', year: 2022, title: 'Set 3', href: '#' },
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

type GroupedPapersBySubject = {
  [subject: string]: {
    [year: number]: Paper[];
  };
};

export default function PreviousYearQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');

  const papersGrouped: GroupedPapersBySubject = papersByExam[selectedExam]
    ?.reduce((acc, paper) => {
        const { subject, year } = paper;
        if (!acc[subject]) {
            acc[subject] = {};
        }
        if (!acc[subject][year]) {
            acc[subject][year] = [];
        }
        acc[subject][year].push(paper);
        // Sort papers by title within the year
        acc[subject][year].sort((a, b) => a.title.localeCompare(b.title));
        return acc;
    }, {} as GroupedPapersBySubject);

    const sortedSubjects = papersGrouped ? Object.keys(papersGrouped).sort() : [];
    const defaultAccordionValue = sortedSubjects.length > 0 ? [`subject-${sortedSubjects[0]}`] : [];

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
        <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <CardTitle>Available Papers for {selectedExam}</CardTitle>
                <CardDescription className="text-primary-foreground/80">Click on a subject to expand and view the question papers.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                {sortedSubjects.length > 0 ? (
                    <Accordion type="multiple" defaultValue={defaultAccordionValue} className="w-full space-y-2">
                        {sortedSubjects.map((subject) => {
                           const yearsForSubject = Object.keys(papersGrouped[subject]).map(Number).sort((a, b) => b - a);
                           return (
                            <AccordionItem value={`subject-${subject}`} key={subject} className="border rounded-lg shadow-sm bg-background/50">
                                <AccordionTrigger className="font-semibold text-lg p-4 hover:no-underline hover:bg-muted/50 rounded-t-lg data-[state=open]:bg-muted/50">
                                    {subject}
                                </AccordionTrigger>
                                <AccordionContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[120px]">Year</TableHead>
                                                    <TableHead>Sets / Papers Available</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                               {yearsForSubject.map(year => (
                                                    <TableRow key={year}>
                                                        <TableCell className="font-medium align-top py-4">{year}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-2 items-start">
                                                                {papersGrouped[subject][year].map((paper, index) => (
                                                                    <div key={index} className="flex items-center justify-between w-full max-w-sm">
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
                           )
                        })}
                    </Accordion>
                ) : (
                    <div className="col-span-full text-center py-12">
                        <div className="p-8 inline-block">
                            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No papers found for this exam.</p>
                            <p className="text-sm text-muted-foreground">Please select another exam category.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
