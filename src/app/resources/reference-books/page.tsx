
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Search, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Book = {
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  href: string;
  imageHint: string;
};

type SubjectBooks = {
  subject: string;
  books: Book[];
};

const booksByClass: { [key: string]: SubjectBooks[] } = {
  'Class 9': [
    {
      subject: 'Mathematics',
      books: [
        { title: 'Mathematics for Class 9', author: 'R.D. Sharma', description: 'A comprehensive book for in-depth understanding of mathematical concepts.', imageUrl: 'https://picsum.photos/seed/rd9/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Secondary School Mathematics for Class 9', author: 'R.S. Aggarwal', description: 'A popular choice for building a strong foundation in maths.', imageUrl: 'https://picsum.photos/seed/rs9/200/300', href: '#', imageHint: 'math textbook' },
      ]
    },
    {
      subject: 'Science',
      books: [
        { title: 'Science for Class 9', author: 'Lakhmir Singh & Manjit Kaur', description: 'Covers Physics, Chemistry, and Biology in a simple, easy-to-understand language.', imageUrl: 'https://picsum.photos/seed/ls9/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'All in One Science CBSE Class 9', author: 'Arihant Experts', description: 'An all-encompassing guide with theory, practicals, and practice questions.', imageUrl: 'https://picsum.photos/seed/arihant9/200/300', href: '#', imageHint: 'science textbook' },
      ]
    },
  ],
  'Class 10': [
    {
      subject: 'Mathematics',
      books: [
        { title: 'Mathematics for Class 10', author: 'R.D. Sharma', description: 'Comprehensive guide with a wide range of problems for practice.', imageUrl: 'https://picsum.photos/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Secondary School Mathematics for Class 10', author: 'R.S. Aggarwal', description: 'Excellent for building a strong conceptual foundation.', imageUrl: 'https://picsum.photos/201/300', href: '#', imageHint: 'math textbook' },
      ]
    },
    {
      subject: 'Science',
      books: [
        { title: 'Science for Class 10', author: 'Lakhmir Singh & Manjit Kaur', description: 'Covers Physics, Chemistry, and Biology in a simple, easy-to-understand language.', imageUrl: 'https://picsum.photos/200/301', href: '#', imageHint: 'science textbook' },
        { title: 'S. Chand\'s Science for Class 10', author: 'S. Chand', description: 'A detailed book that clarifies complex scientific concepts effectively.', imageUrl: 'https://picsum.photos/201/301', href: '#', imageHint: 'science textbook' },
      ]
    },
  ],
  'Class 11': [
    {
      subject: 'Physics',
      books: [
        { title: 'Concepts of Physics', author: 'H.C. Verma', description: 'A must-have for every competitive exam aspirant.', imageUrl: 'https://picsum.photos/seed/hcv11/200/300', href: '#', imageHint: 'physics textbook' },
        { title: 'Fundamentals of Physics', author: 'Halliday, Resnick & Walker', description: 'An internationally acclaimed book for deep conceptual understanding.', imageUrl: 'https://picsum.photos/seed/halliday11/200/300', href: '#', imageHint: 'physics textbook' },
      ]
    },
    {
      subject: 'Chemistry',
      books: [
        { title: 'Modern ABC of Chemistry', author: 'S.P. Jauhar', description: 'Covers the entire syllabus with detailed explanations and practice questions.', imageUrl: 'https://picsum.photos/seed/abc11/200/300', href: '#', imageHint: 'chemistry textbook' },
        { title: 'Organic Chemistry', author: 'O.P. Tandon', description: 'Specialized book for mastering organic chemistry concepts.', imageUrl: 'https://picsum.photos/seed/tandon11/200/300', href: '#', imageHint: 'chemistry textbook' },
      ]
    },
  ],
  'Class 12': [
    {
      subject: 'Physics',
      books: [
        { title: 'Concepts of Physics', author: 'H.C. Verma', description: 'A must-have for every competitive exam aspirant.', imageUrl: 'https://picsum.photos/200/302', href: '#', imageHint: 'physics textbook' },
        { title: 'Fundamentals of Physics', author: 'Halliday, Resnick & Walker', description: 'An internationally acclaimed book for deep conceptual understanding.', imageUrl: 'https://picsum.photos/201/302', href: '#', imageHint: 'physics textbook' },
      ]
    },
    {
      subject: 'Chemistry',
      books: [
        { title: 'Modern ABC of Chemistry', author: 'S.P. Jauhar', description: 'Covers the entire syllabus with detailed explanations and practice questions.', imageUrl: 'https://picsum.photos/200/303', href: '#', imageHint: 'chemistry textbook' },
        { title: 'Organic Chemistry', author: 'O.P. Tandon', description: 'Specialized book for mastering organic chemistry concepts.', imageUrl: 'https://picsum.photos/201/303', href: '#', imageHint: 'chemistry textbook' },
      ]
    },
  ],
};

const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];

export default function ReferenceBooksPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = booksByClass[selectedClass]?.map(subject => ({
    ...subject,
    books: subject.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(subject => subject.books.length > 0);
  
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reference Books for {selectedClass}</h1>
            <p className="text-muted-foreground">Explore our curated list of reference books to deepen your understanding.</p>
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
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-1/3 lg:w-1/4 rounded-full h-9"
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

        <div key={selectedClass} className="space-y-4">
          {filteredBooks && filteredBooks.length > 0 ? (
            <Accordion type="multiple" defaultValue={filteredBooks.map(s => s.subject)}>
              {filteredBooks.map((subject, index) => (
                <AccordionItem value={subject.subject} key={index}>
                  <AccordionTrigger className="text-xl font-semibold text-primary">{subject.subject}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                      {subject.books.map((book, bookIndex) => (
                         <Card key={bookIndex} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex flex-col h-full">
                                <div className="flex-shrink-0 flex items-center justify-center p-4 bg-muted/30">
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        data-ai-hint={book.imageHint}
                                        width={150}
                                        height={225}
                                        className="object-contain h-48 w-auto rounded-md shadow-md"
                                    />
                                </div>
                                <CardContent className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-base font-bold text-foreground">{book.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>
                                    <p className="text-sm text-foreground/80 flex-grow">{book.description}</p>
                                    <Button asChild className="w-full mt-4">
                                        <Link href={book.href}>
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Buy on Amazon
                                        </Link>
                                    </Button>
                                </CardContent>
                            </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <div className="col-span-full text-center py-12">
                <Card className="p-8 inline-block">
                    <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No books found.</p>
                    <p className="text-sm text-muted-foreground">Please select another class or clear your search.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
