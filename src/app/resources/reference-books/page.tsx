
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Search, X } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

type Book = {
  title: string;
  author: string;
  subject: string;
  imageUrl: string;
  imageHint: string;
};

const booksByClass: { [key: string]: Book[] } = {
  'Class 6': [
    { title: 'Mathematics for Class 6', author: 'R.S. Aggarwal', subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math book' },
    { title: 'Science for Class 6', author: 'Lakhmir Singh', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1581093582522-220963a52d29?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science textbook' },
  ],
  'Class 7': [
    { title: 'Mathematics for Class 7', author: 'R.D. Sharma', subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1592527212953-e53b4742517c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math textbook' },
    { title: 'History for Class 7', author: 'Romila Thapar', subject: 'History', imageUrl: 'https://images.unsplash.com/photo-1569033397943-9376a4a1a5a8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'history book' },
  ],
  'Class 8': [
    { title: 'Mathematics for Class 8', author: 'R.S. Aggarwal', subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'open book' },
    { title: 'Science for Class 8', author: 'Lakhmir Singh', subject: 'Science', imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'science experiment' },
  ],
  'Class 9': [
    { title: 'Concepts of Physics', author: 'H.C. Verma', subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1632500022039-651553c7a727?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics equations' },
    { title: 'Chemistry for Class 9', author: 'S. Chand', subject: 'Chemistry', imageUrl: 'https://images.unsplash.com/photo-1554475901-4538adb7524d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry beakers' },
  ],
  'Class 10': [
    { title: 'Mathematics for Class 10', author: 'R.D. Sharma', subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math problems' },
    { title: 'Biology for Class 10', author: 'S. Chand', subject: 'Biology', imageUrl: 'https://images.unsplash.com/photo-1532187643623-dbf2f39d20c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'biology microscope' },
  ],
  'Class 11': [
    { title: 'Concepts of Physics Vol 1', author: 'H.C. Verma', subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics textbook' },
    { title: 'Organic Chemistry', author: 'O.P. Tandon', subject: 'Chemistry', imageUrl: 'https://images.unsplash.com/photo-1627866762144-4050b1a0d778?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'chemistry set' },
  ],
  'Class 12': [
    { title: 'Concepts of Physics Vol 2', author: 'H.C. Verma', subject: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'physics book' },
    { title: 'Mathematics for Class 12', author: 'R.D. Sharma', subject: 'Maths', imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8', imageHint: 'math formulas' },
  ],
};

const classes = Object.keys(booksByClass);

export default function ReferenceBooksPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = booksByClass[selectedClass]?.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Reference Books for {selectedClass}</h1>
            <p className="text-muted-foreground">Explore our curated list of reference books to deepen your understanding.</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <div className="flex items-center overflow-x-auto space-x-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by title, author, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-2/3 lg:w-1/2"
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
          {filteredBooks && filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    data-ai-hint={book.imageHint}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <span className="text-xs font-semibold uppercase text-primary bg-primary/10 py-1 px-2 rounded-full">{book.subject}</span>
                  <h3 className="text-lg font-bold mt-2 truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                </CardContent>
              </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
                <Card className="p-8 inline-block">
                    <Book className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No books found matching your criteria.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
