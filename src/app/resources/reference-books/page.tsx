
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, Filter, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Book = {
  title: string;
  edition: string;
  price: number;
  originalPrice: number;
  rating: number;
  imageUrl: string;
  imageHint: string;
  subject: 'Maths' | 'Science' | 'Social Studies' | 'English';
};

const booksByClass: { [key: string]: Book[] } = {
  'Class 9': [
    { title: 'NEEV For Class 9 Physics, Chemistry, Mathematics Part A...', edition: '2025 Edition', price: 1748, originalPrice: 1999, rating: 4.8, imageUrl: 'https://picsum.photos/seed/neev-bio/300/400', imageHint: 'textbook cover', subject: 'Science' },
    { title: 'CBSE Question & Concept Bank (QCB) Class 9 Science...', edition: '2025 Edition', price: 1186, originalPrice: 1396, rating: 4.5, imageUrl: 'https://picsum.photos/seed/qcb-science/300/400', imageHint: 'textbook cover', subject: 'Science' },
    { title: 'CBSE Class 9 Most Probable 20 Combined Sample Question...', edition: '2025 Edition', price: 270, originalPrice: 299, rating: 4.8, imageUrl: 'https://picsum.photos/seed/20-sample/300/400', imageHint: 'textbook cover', subject: 'Science' },
    { title: 'CBSE Class 9 Mind Maps Book For 2025 Board Exam L...', edition: '2024 Edition', price: 467, originalPrice: 549, rating: 4.8, imageUrl: 'https://picsum.photos/seed/mind-maps/300/400', imageHint: 'textbook cover', subject: 'Maths' },
    { title: 'Complete Course Class 9 2025', edition: '2025 Edition', price: 3499, originalPrice: 4999, rating: 4.9, imageUrl: 'https://picsum.photos/seed/course9/300/400', imageHint: 'textbook cover', subject: 'Social Studies' },
    { title: 'English Grammar & Composition Class 9', edition: '2025 Edition', price: 450, originalPrice: 550, rating: 4.7, imageUrl: 'https://picsum.photos/seed/english9/300/400', imageHint: 'textbook cover', subject: 'English' },
  ],
  'Class 10': [
    { title: 'All in One Mathematics CBSE Class 10', edition: '2025 Edition', price: 599, originalPrice: 750, rating: 4.8, imageUrl: 'https://picsum.photos/seed/arihant10/300/400', imageHint: 'textbook cover', subject: 'Maths' },
    { title: 'Science for Class 10 by Lakhmir Singh', edition: '2025 Edition', price: 899, originalPrice: 1100, rating: 4.9, imageUrl: 'https://picsum.photos/seed/lakhmir10/300/400', imageHint: 'textbook cover', subject: 'Science' },
    { title: 'Social Science Contemporary India II', edition: '2025 Edition', price: 350, originalPrice: 400, rating: 4.7, imageUrl: 'https://picsum.photos/seed/sst10/300/400', imageHint: 'textbook cover', subject: 'Social Studies' },
    { title: 'First Flight - English Class 10', edition: '2025 Edition', price: 250, originalPrice: 300, rating: 4.6, imageUrl: 'https://picsum.photos/seed/english10/300/400', imageHint: 'textbook cover', subject: 'English' },
  ],
  'Class 11': [],
  'Class 12': [],
};

const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const BookCard = ({ book }: { book: Book }) => {
    const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
    return (
        <Card className="group relative overflow-visible rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="absolute -top-2 left-2 z-10">
                <div className="relative text-xs font-semibold text-white bg-green-600 px-2 py-1">
                    <svg className="absolute -left-[7px] top-0 h-full w-2 text-green-600" x="0px" y="0px" viewBox="0 0 9 30"><polygon fill="#16a34a" points="0,0 9,0 0,30"></polygon></svg>
                    Price Drop
                </div>
            </div>
            <CardContent className="p-2">
                <div className="relative aspect-[3/4] w-full mb-2">
                    <Image
                        src={book.imageUrl}
                        alt={book.title}
                        data-ai-hint={book.imageHint}
                        fill
                        className="object-cover rounded-md"
                    />
                    <div className="absolute bottom-2 right-2">
                        <Button variant="outline" className="bg-background/80 backdrop-blur-sm border-purple-300 text-purple-600 hover:bg-purple-100 hover:text-purple-700">
                            ADD
                        </Button>
                    </div>
                </div>
                <div className="px-1">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:whitespace-normal group-hover:text-clip">{book.title}</h3>
                    <p className="text-xs text-blue-500 font-medium my-1">{book.edition}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">₹{book.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground line-through">₹{book.originalPrice.toLocaleString()}</p>
                        <p className="text-sm font-semibold text-green-600">({discount}% OFF)</p>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1 text-xs font-bold text-white bg-green-600 px-2 py-0.5 rounded-sm">
                            <Star className="w-3 h-3 fill-white" />
                            <span>{book.rating}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


export default function ReferenceBooksPage() {
  const [activeClass, setActiveClass] = useState('Class 9');
  const books = booksByClass[activeClass] || [];

  return (
    <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
                <h2 className="text-lg font-bold mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" />Filters</h2>
                <Accordion type="single" collapsible defaultValue="category" className="w-full">
                    <AccordionItem value="category" className="border-b-0">
                        <AccordionTrigger className="font-semibold text-sm py-2 hover:no-underline">CATEGORY</AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="single" collapsible defaultValue="class-9-books" className="w-full pl-2">
                                {classes.map(c => (
                                    <AccordionItem key={c} value={`${c.toLowerCase().replace(' ','-')}-books`}>
                                        <AccordionTrigger 
                                            className="text-sm font-medium py-2 hover:no-underline [&[data-state=open]>svg]:text-primary"
                                            onClick={() => setActiveClass(c)}
                                        >
                                            {c} Books
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="pl-4 text-muted-foreground text-sm space-y-2">
                                                <p className="hover:text-primary cursor-pointer">{c} Modules</p>
                                                <p className="hover:text-primary cursor-pointer">{c} Question Banks</p>
                                                <p className="hover:text-primary cursor-pointer">{c} Revision Books</p>
                                                <p className="hover:text-primary cursor-pointer">{c} Sample Papers</p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </aside>
            <main className="flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {books.length > 0 ? (
                        books.map((book, index) => <BookCard key={index} book={book} />)
                    ) : (
                        <div className="col-span-full text-center py-16">
                             <Card className="p-8 inline-block">
                                <p className="text-muted-foreground font-semibold">No books found for {activeClass}.</p>
                                <p className="text-sm text-muted-foreground">Please check back later.</p>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    </div>
  );
}
