
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, ShoppingCart, Sigma, TestTube2, Landmark, BookText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
  icon: React.ReactNode;
  gradient: string;
  books: Book[];
};

const booksByClass: { [key: string]: SubjectBooks[] } = {
  'Class 9': [
    {
      subject: 'Mathematics',
      icon: <Sigma className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-600',
      books: [
        { title: 'Mathematics for Class 9', author: 'R.D. Sharma', description: 'A comprehensive book for in-depth understanding and practice.', imageUrl: 'https://picsum.photos/seed/rd9/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Secondary School Mathematics for Class 9', author: 'R.S. Aggarwal', description: 'Popular for building a strong foundation with a variety of problems.', imageUrl: 'https://picsum.photos/seed/rs9/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'All in One Mathematics CBSE Class 9', author: 'Arihant Experts', description: 'Complete study material with theory, examples, and questions.', imageUrl: 'https://picsum.photos/seed/arihantmath9/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Mathematics for Class 9', author: 'S. Chand', description: 'Follows the latest CBSE syllabus with clear explanations.', imageUrl: 'https://picsum.photos/seed/schandmath9/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'NCERT Exemplar Problems-Solutions Mathematics Class 9', author: 'NCERT', description: 'Contains higher-level questions to promote deeper understanding.', imageUrl: 'https://picsum.photos/seed/ncertmath9/200/300', href: '#', imageHint: 'math textbook' },
      ]
    },
    {
      subject: 'Science',
      icon: <TestTube2 className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      books: [
        { title: 'Science for Class 9 (Physics, Chemistry & Biology)', author: 'Lakhmir Singh & Manjit Kaur', description: 'Simple language and clear concepts for Physics, Chemistry, and Biology.', imageUrl: 'https://picsum.photos/seed/ls9/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'All in One Science CBSE Class 9', author: 'Arihant Experts', description: 'An all-encompassing guide with theory, practicals, and practice questions.', imageUrl: 'https://picsum.photos/seed/arihant9/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'S. Chand\'s Science for Class 9', author: 'S. Chand', description: 'Detailed explanations for a thorough understanding of scientific principles.', imageUrl: 'https://picsum.photos/seed/schandsci9/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'NCERT Exemplar Problems-Solutions Science Class 9', author: 'NCERT', description: 'Challenging questions to develop analytical skills in science.', imageUrl: 'https://picsum.photos/seed/ncertsci9/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'Foundation Science (Physics/Chemistry/Biology) for Class 9', author: 'H.C. Verma', description: 'Builds a strong base for competitive exams like JEE and NEET.', imageUrl: 'https://picsum.photos/seed/hcv9/200/300', href: '#', imageHint: 'science textbook' },
      ]
    },
    {
      subject: 'Social Studies',
      icon: <Landmark className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-600',
      books: [
        { title: 'All in One Social Science CBSE Class 9', author: 'Arihant Experts', description: 'Comprehensive coverage of History, Geography, Civics, and Economics.', imageUrl: 'https://picsum.photos/seed/arihantsst9/200/300', href: '#', imageHint: 'history book' },
        { title: 'Golden Social Science for Class 9', author: 'Sudha Rastogi', description: 'A question-bank style guide for exam preparation.', imageUrl: 'https://picsum.photos/seed/goldensst9/200/300', href: '#', imageHint: 'history book' },
        { title: 'Xam Idea Social Science for Class 9', author: 'VK Global Publications', description: 'Includes chapter summaries, important questions, and sample papers.', imageUrl: 'https://picsum.photos/seed/xamidea9/200/300', href: '#', imageHint: 'history book' },
        { title: 'India and the Contemporary World-I', author: 'NCERT', description: 'The official textbook for History, essential for CBSE exams.', imageUrl: 'https://picsum.photos/seed/history9/200/300', href: '#', imageHint: 'history book' },
        { title: 'Democratic Politics-I', author: 'NCERT', description: 'The official textbook for Civics, crucial for understanding political science.', imageUrl: 'https://picsum.photos/seed/civics9/200/300', href: '#', imageHint: 'history book' },
      ]
    },
    {
      subject: 'English',
      icon: <BookText className="w-6 h-6" />,
      gradient: 'from-rose-500 to-pink-600',
      books: [
        { title: 'All in One English Language & Literature CBSE Class 9', author: 'Arihant Experts', description: 'A complete guide covering literature, grammar, and writing skills.', imageUrl: 'https://picsum.photos/seed/arihanteng9/200/300', href: '#', imageHint: 'english book' },
        { title: 'BBC Compacta English for Class 9', author: 'Brajindra Singh', description: 'Focuses on grammar, writing, and comprehension skills.', imageUrl: 'https://picsum.photos/seed/bbceng9/200/300', href: '#', imageHint: 'english book' },
        { title: 'High School English Grammar and Composition', author: 'Wren & Martin', description: 'A classic grammar book for building a strong foundation in English.', imageUrl: 'https://picsum.photos/seed/wrenmartin9/200/300', href: '#', imageHint: 'english book' },
        { title: 'Beehive - Textbook in English for Class 9', author: 'NCERT', description: 'The official literature textbook for Class 9.', imageUrl: 'https://picsum.photos/seed/beehive9/200/300', href: '#', imageHint: 'english book' },
        { title: 'Moments - Supplementary Reader in English for Class 9', author: 'NCERT', description: 'The official supplementary reader for Class 9.', imageUrl: 'https://picsum.photos/seed/moments9/200/300', href: '#', imageHint: 'english book' },
      ]
    },
  ],
  'Class 10': [
     {
      subject: 'Mathematics',
      icon: <Sigma className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-600',
      books: [
        { title: 'Mathematics for Class 10', author: 'R.D. Sharma', description: 'Comprehensive guide with a wide range of problems for practice.', imageUrl: 'https://picsum.photos/seed/rd10/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Secondary School Mathematics for Class 10', author: 'R.S. Aggarwal', description: 'Excellent for building a strong conceptual foundation.', imageUrl: 'https://picsum.photos/seed/rs10/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'All in One Mathematics CBSE Class 10', author: 'Arihant Experts', description: 'Complete study and practice material in a single book.', imageUrl: 'https://picsum.photos/seed/arihantmath10/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'Mathematics for Class 10', author: 'S. Chand', description: 'Structured according to the CBSE syllabus with solved examples.', imageUrl: 'https://picsum.photos/seed/schandmath10/200/300', href: '#', imageHint: 'math textbook' },
        { title: 'NCERT Exemplar Problems-Solutions Mathematics Class 10', author: 'NCERT', description: 'A collection of higher-order thinking skill questions.', imageUrl: 'https://picsum.photos/seed/ncertmath10/200/300', href: '#', imageHint: 'math textbook' },
      ]
    },
    {
      subject: 'Science',
      icon: <TestTube2 className="w-6 h-6" />,
      gradient: 'from-blue-500 to-indigo-600',
      books: [
        { title: 'Science for Class 10 (Physics, Chemistry & Biology)', author: 'Lakhmir Singh & Manjit Kaur', description: 'Simple language and clear concepts for board exams.', imageUrl: 'https://picsum.photos/seed/ls10/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'S. Chand\'s Science for Class 10', author: 'S. Chand', description: 'A detailed book that clarifies complex scientific concepts effectively.', imageUrl: 'https://picsum.photos/seed/schandsci10/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'All in One Science CBSE Class 10', author: 'Arihant Experts', description: 'Comprehensive theory, practice questions, and sample papers.', imageUrl: 'https://picsum.photos/seed/arihantsci10/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'NCERT Exemplar Problems-Solutions Science Class 10', author: 'NCERT', description: 'Advanced problems to prepare for competitive exams.', imageUrl: 'https://picsum.photos/seed/ncertsci10/200/300', href: '#', imageHint: 'science textbook' },
        { title: 'Foundation Science (Physics/Chemistry/Biology) for Class 10', author: 'H.C. Verma', description: 'Strengthens the foundation for future science studies.', imageUrl: 'https://picsum.photos/seed/hcv10/200/300', href: '#', imageHint: 'science textbook' },
      ]
    },
     {
      subject: 'Social Studies',
      icon: <Landmark className="w-6 h-6" />,
      gradient: 'from-amber-500 to-orange-600',
      books: [
        { title: 'All in One Social Science CBSE Class 10', author: 'Arihant Experts', description: 'A complete resource covering the entire syllabus with maps and projects.', imageUrl: 'https://picsum.photos/seed/arihantsst10/200/300', href: '#', imageHint: 'history book' },
        { title: 'Golden Social Science for Class 10', author: 'Sudha Rastogi', description: 'A comprehensive question bank for extensive practice.', imageUrl: 'https://picsum.photos/seed/goldensst10/200/300', href: '#', imageHint: 'history book' },
        { title: 'Xam Idea Social Science for Class 10', author: 'VK Global Publications', description: 'Includes chapter summaries, value-based questions, and mock tests.', imageUrl: 'https://picsum.photos/seed/xamidea10/200/300', href: '#', imageHint: 'history book' },
        { title: 'India and the Contemporary World-II', author: 'NCERT', description: 'The core textbook for History required for the CBSE curriculum.', imageUrl: 'https://picsum.photos/seed/history10/200/300', href: '#', imageHint: 'history book' },
        { title: 'Contemporary India-II', author: 'NCERT', description: 'The main textbook for Geography, essential for board exam preparation.', imageUrl: 'https://picsum.photos/seed/geo10/200/300', href: '#', imageHint: 'history book' },
      ]
    },
     {
      subject: 'English',
      icon: <BookText className="w-6 h-6" />,
      gradient: 'from-rose-500 to-pink-600',
      books: [
        { title: 'All in One English Language & Literature CBSE Class 10', author: 'Arihant Experts', description: 'Covers all sections of the English syllabus with ample practice material.', imageUrl: 'https://picsum.photos/seed/arihanteng10/200/300', href: '#', imageHint: 'english book' },
        { title: 'BBC Compacta English for Class 10', author: 'Brajindra Singh', description: 'An excellent resource for grammar, writing, and comprehension practice.', imageUrl: 'https://picsum.photos/seed/bbceng10/200/300', href: '#', imageHint: 'english book' },
        { title: 'High School English Grammar and Composition', author: 'Wren & Martin', description: 'A timeless classic for mastering English grammar rules.', imageUrl: 'https://picsum.photos/seed/wrenmartin10/200/300', href: '#', imageHint: 'english book' },
        { title: 'First Flight - Textbook in English for Class 10', author: 'NCERT', description: 'The official literature textbook for Class 10 CBSE.', imageUrl: 'https://picsum.photos/seed/firstflight10/200/300', href: '#', imageHint: 'english book' },
        { title: 'Footprints Without Feet - Supplementary Reader for Class 10', author: 'NCERT', description: 'The supplementary reader to enhance reading comprehension.', imageUrl: 'https://picsum.photos/seed/footprints10/200/300', href: '#', imageHint: 'english book' },
      ]
    },
  ],
  'Class 11': [],
  'Class 12': [],
};

const classes = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];

const BookCard = ({ book }: { book: Book }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card className="group relative w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <Link href={book.href} target="_blank" rel="noopener noreferrer">
                            <div className="aspect-[2/3] w-full">
                                <Image
                                    src={book.imageUrl}
                                    alt={book.title}
                                    data-ai-hint={book.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-sm font-bold text-white truncate group-hover:whitespace-normal">{book.title}</h3>
                                <p className="text-xs text-white/80">{book.author}</p>
                            </div>
                        </Link>
                    </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center" className="max-w-xs">
                    <p>{book.description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default function ReferenceBooksPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');

  const subjects = booksByClass[selectedClass];
  
  return (
    <div className="animate-fade-in-up">
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reference Books for {selectedClass}</h1>
            <p className="text-muted-foreground">Explore our curated list of reference books to deepen your understanding.</p>
        </div>
      
      <Tabs value={selectedClass} onValueChange={setSelectedClass}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-8">
            {classes.map(c => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>

          {classes.map(className => (
            <TabsContent key={className} value={className} className="mt-6">
                <div className="space-y-10">
                {booksByClass[className] && booksByClass[className].length > 0 ? (
                    booksByClass[className].map((subject, index) => (
                    <div key={index}>
                        <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-r ${subject.gradient}`}>
                           <div className="p-2 bg-white/20 rounded-full text-white">
                                {subject.icon}
                           </div>
                           <h2 className="text-2xl font-bold text-white">{subject.subject}</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {subject.books.map((book, bookIndex) => (
                                <BookCard key={bookIndex} book={book} />
                            ))}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Card className="p-8 inline-block">
                            <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No books found for {className}.</p>
                            <p className="text-sm text-muted-foreground">Please check back later.</p>
                        </Card>
                    </div>
                )}
                </div>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
}
