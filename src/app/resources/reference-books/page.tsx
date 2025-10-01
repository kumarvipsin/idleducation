'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

const books = [
    {
        title: "Mathematics for Class 10",
        author: "by R.D. Sharma",
        price: 600,
        originalPrice: 700,
        rating: 4.5,
        reviews: 120,
        imageUrl: "https://picsum.photos/seed/maths-10/400/500",
        imageHint: "math textbook",
        class: "Class 10",
        subject: "Maths",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "Secondary School Mathematics for Class 10",
        author: "by R.S. Aggarwal",
        price: 580,
        originalPrice: 650,
        rating: 4.4,
        reviews: 95,
        imageUrl: "https://picsum.photos/seed/maths-10-rs/400/500",
        imageHint: "math textbook",
        class: "Class 10",
        subject: "Maths",
        edition: "2025",
        set: "Set of - 1 Book"
    },
     {
        title: "All In One Social Science CBSE Class 10th",
        author: "by Arihant Experts",
        price: 520,
        originalPrice: 595,
        rating: 4.6,
        reviews: 250,
        imageUrl: "https://picsum.photos/seed/social-science-10/400/500",
        imageHint: "social science textbook",
        class: "Class 10",
        subject: "Social Studies",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "All in One Science CBSE Class 10",
        author: "by Arihant Experts",
        price: 550,
        originalPrice: 625,
        rating: 4.7,
        reviews: 310,
        imageUrl: "https://picsum.photos/seed/science-10/400/500",
        imageHint: "science textbook",
        class: "Class 10",
        subject: "Science",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "All in One English Language & Literature CBSE Class 10",
        author: "by Arihant Experts",
        price: 450,
        originalPrice: 510,
        rating: 4.5,
        reviews: 180,
        imageUrl: "https://picsum.photos/seed/english-10/400/500",
        imageHint: "english textbook",
        class: "Class 10",
        subject: "English",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "Mathematics for Class 12",
        author: "by R.D. Sharma",
        price: 1100,
        originalPrice: 1250,
        rating: 4.8,
        reviews: 450,
        imageUrl: "https://picsum.photos/seed/maths-12/400/500",
        imageHint: "math textbook",
        class: "Class 12",
        subject: "Maths",
        edition: "2025",
        set: "Set of - 2 Books"
    },
    {
        title: "Concepts of Physics",
        author: "by H.C. Verma",
        price: 750,
        originalPrice: 850,
        rating: 4.9,
        reviews: 800,
        imageUrl: "https://picsum.photos/seed/physics-book/400/500",
        imageHint: "physics textbook",
        class: "Class 12",
        subject: "Physics",
        edition: "2025",
        set: "Set of - 2 Books"
    },
    {
        title: "Objective Chemistry",
        author: "by Dr. R.K. Gupta",
        price: 700,
        originalPrice: 799,
        rating: 4.6,
        reviews: 320,
        imageUrl: "https://picsum.photos/seed/chem-book/400/500",
        imageHint: "chemistry textbook",
        class: "Class 12",
        subject: "Chemistry",
        edition: "2025",
        set: "Set of - 3 Books"
    },
    {
        title: "Trueman's Elementary Biology",
        author: "by K.N. Bhatia & M.P. Tyagi",
        price: 950,
        originalPrice: 1050,
        rating: 4.7,
        reviews: 400,
        imageUrl: "https://picsum.photos/seed/bio-book/400/500",
        imageHint: "biology textbook",
        class: "Class 12",
        subject: "Biology",
        edition: "2025",
        set: "Set of - 2 Books"
    },
    {
        title: "Indian Polity",
        author: "by M. Laxmikanth",
        price: 800,
        originalPrice: 900,
        rating: 4.9,
        reviews: 1200,
        imageUrl: "https://picsum.photos/seed/polity-book/400/500",
        imageHint: "polity textbook",
        class: "Class 12",
        subject: "Political Science",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "History of Modern India",
        author: "by Bipan Chandra",
        price: 450,
        originalPrice: 500,
        rating: 4.7,
        reviews: 600,
        imageUrl: "https://picsum.photos/seed/history-book/400/500",
        imageHint: "history textbook",
        class: "Class 12",
        subject: "History",
        edition: "2025",
        set: "Set of - 1 Book"
    },
    {
        title: "Indian Economy",
        author: "by Ramesh Singh",
        price: 650,
        originalPrice: 750,
        rating: 4.6,
        reviews: 550,
        imageUrl: "https://picsum.photos/seed/economy-book/400/500",
        imageHint: "economy textbook",
        class: "Class 12",
        subject: "Economics",
        edition: "2025",
        set: "Set of - 1 Book"
    }
];

const classes = ["Class 10", "Class 12"];

export default function ReferenceBooksPage() {
    const [selectedClass, setSelectedClass] = useState('Class 10');
    const [selectedSubject, setSelectedSubject] = useState('All');

    const subjects = useMemo(() => {
        const classSubjects = books
            .filter(book => book.class === selectedClass)
            .map(book => book.subject);
        return ['All', ...Array.from(new Set(classSubjects))];
    }, [selectedClass]);

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
                                    className={cn(`py-2 px-6 text-sm font-medium transition-colors rounded-full`,
                                        selectedClass === c
                                        ? 'bg-primary shadow text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground bg-muted/50'
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((book, index) => (
                        <Card key={index} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up group rounded-lg bg-card flex flex-col" style={{ animationDelay: `${index * 50}ms` }}>
                            <CardContent className="p-4 flex flex-col flex-1">
                                <div className="relative aspect-[4/5] w-full mb-4">
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        data-ai-hint={book.imageHint}
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
                    ))}
                </div>
            </div>
        </div>
    );
}
