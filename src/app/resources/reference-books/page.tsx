
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getReferenceBooks } from '@/app/actions';
import type { TReferenceBook } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';


export default function ReferenceBooksPage() {
    const [books, setBooks] = useState<TReferenceBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All');

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const result = await getReferenceBooks();
            if (result.success && result.data) {
                setBooks(result.data as TReferenceBook[]);
                const classes = Array.from(new Set((result.data as TReferenceBook[]).map(b => b.class))).sort();
                if(classes.length > 0) {
                    setSelectedClass(classes.find(c => c.includes('10')) || classes[0]);
                }
            }
            setLoading(false);
        };
        fetchBooks();
    }, []);

    const classes = useMemo(() => Array.from(new Set(books.map(book => book.class))).sort(), [books]);

    const subjects = useMemo(() => {
        const classSubjects = books
            .filter(book => book.class === selectedClass)
            .map(book => book.subject);
        return ['All', ...Array.from(new Set(classSubjects))];
    }, [selectedClass, books]);

    useEffect(() => {
        if (!subjects.includes(selectedSubject)) {
            setSelectedSubject('All');
        }
    }, [subjects, selectedSubject]);

    const filteredBooks = books.filter(book => 
        (book.class === selectedClass) &&
        (selectedSubject === 'All' || book.subject === selectedSubject)
    );

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
            <Link href="/" className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon">
                    <Home className="h-6 w-6 text-primary" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>
            <div className="relative z-10 container mx-auto py-12">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Reference Books</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        A curated collection of books to supplement your learning.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 mb-8">
                     <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                        <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                            {classes.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedClass(c)}
                                    className={cn(`py-2 px-6 text-sm font-medium transition-colors border rounded-full`,
                                        selectedClass === c
                                        ? 'border-primary text-primary bg-primary/10 shadow'
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                   <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                        <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                            {subjects.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSubject(s)}
                                    className={cn(`py-1 px-4 text-xs font-medium transition-colors border rounded-full`,
                                        selectedSubject === s
                                        ? 'border-primary text-primary bg-primary/10' 
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                 
                <div className="relative">
                    <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                         <div className="flex gap-6 px-4 md:px-[10%]">
                             {loading ? (
                                [...Array(4)].map((_, index) => (
                                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
                                        <Skeleton className="h-[450px] w-full rounded-lg" />
                                    </div>
                                ))
                             ) : (
                                filteredBooks.map((book, index) => (
                                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up group rounded-lg bg-card flex flex-col h-full" style={{ animationDelay: `${index * 50}ms` }}>
                                        <CardContent className="p-4 flex flex-col flex-1">
                                            <div className="relative aspect-[4/5] w-full mb-4">
                                                <GcsImage
                                                    filePath={book.imageUrl}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="text-xs h-6 rounded-md">{book.set}</Button>
                                                <Button variant="outline" size="sm" className="text-xs h-6 rounded-md">Edition - {book.edition}</Button>
                                            </div>
                                            <h3 className="font-bold text-base leading-tight mt-2 flex-grow" title={book.title}>{book.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(book.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-muted-foreground font-semibold">{book.rating}</span>
                                            </div>
                                            
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <p className="text-xl font-bold text-foreground">₹{book.price}</p>
                                                <p className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</p>
                                                <p className="text-sm font-semibold text-destructive">{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% Off</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <Button variant="outline">
                                                    Add To Cart
                                                </Button>
                                                <Button className="bg-orange-500 hover:bg-orange-600">
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    </div>
                                ))
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
