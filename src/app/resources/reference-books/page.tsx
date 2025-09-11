
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, Filter, Star, ShoppingCart, PanelLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
    { title: 'Secondary School Mathematics for Class 9', author: 'R.S. Aggarwal', description: 'Popular for building a strong foundation with a variety of problems.', price: 520, originalPrice: 600, rating: 4.7, imageUrl: 'https://picsum.photos/seed/rsaggarwal9/300/400', imageHint: 'math textbook', subject: 'Maths' },
    { title: 'All in One Mathematics CBSE Class 9', author: 'Arihant Experts', description: 'Complete study material with theory, examples, and questions.', price: 480, originalPrice: 550, rating: 4.6, imageUrl: 'https://picsum.photos/seed/arihantmath9/300/400', imageHint: 'math textbook', subject: 'Maths' },
  ],
  'Class 10': [
    { title: 'Mathematics for Class 10', author: 'R.D. Sharma', description: 'A comprehensive book for in-depth understanding and practice.', price: 600, originalPrice: 700, rating: 4.9, imageUrl: 'https://picsum.photos/seed/rdsharma10/300/400', imageHint: 'math textbook', subject: 'Maths' },
    { title: 'Science for Class 10', author: 'Lakhmir Singh & Manjit Kaur', description: 'Covers Physics, Chemistry, and Biology with clear explanations.', price: 650, originalPrice: 750, rating: 4.9, imageUrl: 'https://picsum.photos/seed/lakhmir10/300/400', imageHint: 'science textbook', subject: 'Science' },
    { title: 'All in One Social Science CBSE Class 10', author: 'Arihant Experts', description: 'Complete study material with theory, examples, and questions.', price: 500, originalPrice: 600, rating: 4.8, imageUrl: 'https://picsum.photos/seed/arihant10/300/400', imageHint: 'social studies textbook', subject: 'Social Studies' },
    { title: 'English Language & Literature Class 10', author: 'Oswaal Books', description: 'Includes grammar, writing skills, and literature.', price: 400, originalPrice: 475, rating: 4.7, imageUrl: 'https://picsum.photos/seed/oswaal10/300/400', imageHint: 'english textbook', subject: 'English' },
    { title: 'Secondary School Mathematics for Class 10', author: 'R.S. Aggarwal', description: 'A classic choice for board exam preparation with extensive question banks.', price: 580, originalPrice: 650, rating: 4.8, imageUrl: 'https://picsum.photos/seed/rsaggarwal10/300/400', imageHint: 'math textbook', subject: 'Maths' },
  ],
  'Class 11': [],
  'Class 12': [],
};

const classes = ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

const BookCard = ({ book, index }: { book: Book, index: number }) => {
    const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
    return (
        <Card 
            className="group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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

const FilterSidebarContent = ({ activeClass, onClassChange, onDone }: { activeClass: string; onClassChange: (c: string) => void, onDone?: () => void }) => (
    <>
        <h2 className="text-lg font-bold mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" />Filters</h2>
        <Accordion type="single" collapsible defaultValue="category" className="w-full">
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
                                onClick={() => {
                                    onClassChange(c);
                                    onDone?.();
                                }}
                            >
                                {c} Books
                            </Button>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </>
);

export default function ReferenceBooksPage() {
  const [activeClass, setActiveClass] = useState('Class 9');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const books = booksByClass[activeClass] || [];
  const [animationKey, setAnimationKey] = useState(0);

  const handleClassChange = (className: string) => {
    setActiveClass(className);
    setAnimationKey(prev => prev + 1); // Trigger animation
  };

  return (
    <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
                <FilterSidebarContent activeClass={activeClass} onClassChange={handleClassChange} />
            </aside>
            <main className="flex-1">
                <div className="md:hidden mb-4">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                             <Button variant="outline">
                                <PanelLeft className="mr-2 h-4 w-4" />
                                Filter Books
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80%]">
                             <SheetHeader>
                                <SheetTitle className="sr-only">Filter Books</SheetTitle>
                             </SheetHeader>
                             <FilterSidebarContent 
                                activeClass={activeClass} 
                                onClassChange={handleClassChange}
                                onDone={() => setIsSidebarOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
                <div key={animationKey} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up">
                    {books.length > 0 ? (
                        books.map((book, index) => <BookCard key={`${activeClass}-${index}`} book={book} index={index} />)
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
