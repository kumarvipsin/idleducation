
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, Filter, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Book = {
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  imageUrl: string;
  imageHint: string;
  subject: 'Maths' | 'Science' | 'Social Studies' | 'English';
};

const booksByClass: { [key: string]: Book[] } = {
  'Class 9': [
    { title: 'Mathematics for Class 9', author: 'R.D. Sharma', description: 'A comprehensive book for in-depth understanding and practice.', price: 550, originalPrice: 650, rating: 4.8, imageUrl: 'https://picsum.photos/seed/rdsharma9/300/400', imageHint: 'math textbook', subject: 'Maths' },
    { title: 'Science for Class 9', author: 'Lakhmir Singh & Manjit Kaur', description: 'Covers Physics, Chemistry, and Biology with clear explanations.', price: 600, originalPrice: 700, rating: 4.9, imageUrl: 'https://picsum.photos/seed/lakhmir9/300/400', imageHint: 'science textbook', subject: 'Science' },
    { title: 'All in One Social Science CBSE Class 9', author: 'Arihant Experts', description: 'Complete study material with theory, examples, and questions.', price: 450, originalPrice: 550, rating: 4.7, imageUrl: 'https://picsum.photos/seed/arihant9/300/400', imageHint: 'social studies textbook', subject: 'Social Studies' },
    { title: 'English Communicative for Class 9', author: 'Oswaal Books', description: 'Includes grammar, writing skills, and literature.', price: 350, originalPrice: 425, rating: 4.6, imageUrl: 'https://picsum.photos/seed/oswaal9/300/400', imageHint: 'english textbook', subject: 'English' },
    ],
  'Class 10': [
    { title: 'Mathematics for Class 10', author: 'R.D. Sharma', description: 'A comprehensive book for in-depth understanding and practice.', price: 600, originalPrice: 700, rating: 4.9, imageUrl: 'https://picsum.photos/seed/rdsharma10/300/400', imageHint: 'math textbook', subject: 'Maths' },
    { title: 'Science for Class 10', author: 'Lakhmir Singh & Manjit Kaur', description: 'Covers Physics, Chemistry, and Biology with clear explanations.', price: 650, originalPrice: 750, rating: 4.9, imageUrl: 'https://picsum.photos/seed/lakhmir10/300/400', imageHint: 'science textbook', subject: 'Science' },
    { title: 'All in One Social Science CBSE Class 10', author: 'Arihant Experts', description: 'Complete study material with theory, examples, and questions.', price: 500, originalPrice: 600, rating: 4.8, imageUrl: 'https://picsum.photos/seed/arihant10/300/400', imageHint: 'social studies textbook', subject: 'Social Studies' },
    { title: 'English Language & Literature Class 10', author: 'Oswaal Books', description: 'Includes grammar, writing skills, and literature.', price: 400, originalPrice: 475, rating: 4.7, imageUrl: 'https://picsum.photos/seed/oswaal10/300/400', imageHint: 'english textbook', subject: 'English' },
  ],
  'Class 11': [],
  'Class 12': [],
};

const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const BookCard = ({ book, index }: { book: Book, index: number }) => {
    const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
    return (
        <Card 
            className="group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <CardContent className="p-0">
                <div className="relative aspect-[3/4] w-full">
                    <Image
                        src={book.imageUrl}
                        alt={book.title}
                        data-ai-hint={book.imageHint}
                        fill
                        className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                     <div className="absolute top-2 left-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-background bg-green-600/90 px-2 py-0.5 rounded-sm">
                            <Star className="w-3 h-3 fill-background" />
                            <span>{book.rating}</span>
                        </div>
                    </div>
                     <div className="absolute bottom-2 left-2 right-2 p-2">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:whitespace-normal group-hover:text-clip">{book.title}</h3>
                    </div>
                </div>
                <div className="p-4 bg-background">
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-lg font-bold">₹{book.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground line-through">₹{book.originalPrice.toLocaleString()}</p>
                        <p className="text-xs font-semibold text-destructive">{discount}% OFF</p>
                    </div>
                     <Button className="w-full mt-3 bg-primary/90 hover:bg-primary">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                    </Button>
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
                <Accordion type="multiple" defaultValue={["category"]} className="w-full">
                    <AccordionItem value="category" className="border-b-0">
                        <AccordionTrigger className="font-semibold text-sm py-2 hover:no-underline">CATEGORY</AccordionTrigger>
                        <AccordionContent>
                             <div className="pl-2 space-y-1">
                                {classes.map(c => (
                                     <Button 
                                        key={c} 
                                        variant="ghost" 
                                        className={cn(
                                            "w-full justify-start text-sm",
                                            activeClass === c && "bg-primary/10 text-primary font-semibold"
                                        )}
                                        onClick={() => setActiveClass(c)}
                                     >
                                        {c} Books
                                    </Button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </aside>
            <main className="flex-1">
                <div key={activeClass} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {books.length > 0 ? (
                        books.map((book, index) => <BookCard key={`${activeClass}-${index}`} book={book} index={index} />)
                    ) : (
                        <div className="col-span-full text-center py-16">
                             <Card className="p-8 inline-block animate-fade-in-up">
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
