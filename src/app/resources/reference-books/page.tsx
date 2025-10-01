
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter, Star, ShoppingCart, PanelLeft, ShoppingBag } from 'lucide-react';
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
  subject: 'Maths' | 'Science' | 'Social Studies' | 'English' | 'General';
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
  'JEE': [],
  'NEET': [],
  'CUET': [
    { title: 'CUET (UG) General Test', author: 'Arihant Experts', description: 'Comprehensive guide for the Common University Entrance Test.', price: 450, originalPrice: 525, rating: 4.7, imageUrl: 'https://picsum.photos/seed/cuetbook/300/400', imageHint: 'exam textbook', subject: 'General' }
  ],
  'CLAT': [
      { title: 'CLAT & AILET Chapter-wise Solved Papers', author: 'Arihant Experts', description: 'Solved papers for Common Law Admission Test.', price: 550, originalPrice: 620, rating: 4.8, imageUrl: 'https://picsum.photos/seed/clatbook/300/400', imageHint: 'exam textbook', subject: 'General' }
  ],
  'GATE': [],
  'SSC': [
      { title: 'SSC CGL Tier-I & II Solved Papers', author: 'Kiran Prakashan', description: 'A collection of solved papers for the SSC CGL exam.', price: 490, originalPrice: 580, rating: 4.7, imageUrl: 'https://picsum.photos/seed/sscbook/300/400', imageHint: 'exam textbook', subject: 'General' }
  ],
  'DELHI POLICE': [],
};

const allCategories = [
  'Class 9', 'Class 10', 'Class 11', 'Class 12',
  'JEE', 'NEET', 'CUET', 'CLAT', 'GATE', 'SSC', 'DELHI POLICE'
];

const subjectColors: { [key in Book['subject']]: string } = {
  Maths: 'shadow-green-500/50',
  Science: 'shadow-blue-500/50',
  'Social Studies': 'shadow-amber-500/50',
  English: 'shadow-purple-500/50',
  General: 'shadow-gray-500/50',
};

const BookCard = ({ book }: { book: Book }) => {
    const discount = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);

    return (
        <Link href="#" className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
            <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
              <CardContent className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{book.title}</h3>
                <p className="text-sm mt-2 text-muted-foreground flex-grow">{book.description}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <p className="text-xl font-bold">₹{book.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground line-through">₹{book.originalPrice.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-destructive">{discount}% OFF</p>
                </div>
              </CardContent>
              <div className="relative aspect-[4/3] w-full mt-auto">
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  data-ai-hint={book.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
        </Link>
    );
};

export default function ReferenceBooksPage() {
  const [activeClass, setActiveClass] = useState('Class 10');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const books = booksByClass[activeClass] || [];
  const [animationKey, setAnimationKey] = useState(0);

  const handleClassChange = (className: string) => {
    setActiveClass(className);
    setAnimationKey(prev => prev + 1); // Trigger animation
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="container mx-auto">
        <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Reference Books</h1>
            <p className="text-muted-foreground mt-2">Explore a curated collection of reference books to supplement your learning.</p>
        </div>

        <div className="mb-8">
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {allCategories.map((c) => (
                    <button
                    key={c}
                    onClick={() => handleClassChange(c)}
                    className={cn(
                        'py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border rounded-md',
                        activeClass === c
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    >
                    {c}
                    </button>
                ))}
                </div>
            </div>
        </div>

        <main className="flex-1">
            <div key={animationKey} className="relative animate-fade-in-up">
            {books.length > 0 ? (
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {books.map((book, index) => <BookCard key={`${activeClass}-${index}`} book={book} />)}
                    </div>
                </div>
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
