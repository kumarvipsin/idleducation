
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart } from "lucide-react";
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
        discount: 14,
        imageUrl: "https://picsum.photos/seed/maths-10/400/500",
        imageHint: "math textbook",
        class: "Class 10",
        subject: "Maths"
    },
    {
        title: "Secondary School Mathematics for Class 10",
        author: "by R.S. Aggarwal",
        price: 580,
        originalPrice: 650,
        discount: 11,
        imageUrl: "https://picsum.photos/seed/maths-10-rs/400/500",
        imageHint: "math textbook",
        class: "Class 10",
        subject: "Maths"
    },
     {
        title: "All In One Social Science CBSE Class 10th",
        author: "by Arihant Experts",
        price: 520,
        originalPrice: 595,
        discount: 13,
        imageUrl: "https://picsum.photos/seed/social-science-10/400/500",
        imageHint: "social science textbook",
        class: "Class 10",
        subject: "Social Studies"
    },
    {
        title: "All in One Science CBSE Class 10",
        author: "by Arihant Experts",
        price: 550,
        originalPrice: 625,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/science-10/400/500",
        imageHint: "science textbook",
        class: "Class 10",
        subject: "Science"
    },
    {
        title: "All in One English Language & Literature CBSE Class 10",
        author: "by Arihant Experts",
        price: 450,
        originalPrice: 510,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/english-10/400/500",
        imageHint: "english textbook",
        class: "Class 10",
        subject: "English"
    },
    {
        title: "Mathematics for Class 12",
        author: "by R.D. Sharma",
        price: 1100,
        originalPrice: 1250,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/maths-12/400/500",
        imageHint: "math textbook",
        class: "Class 12",
        subject: "Maths"
    },
    {
        title: "Concepts of Physics",
        author: "by H.C. Verma",
        price: 750,
        originalPrice: 850,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/physics-book/400/500",
        imageHint: "physics textbook",
        class: "Class 12",
        subject: "Physics"
    },
    {
        title: "Objective Chemistry",
        author: "by Dr. R.K. Gupta",
        price: 700,
        originalPrice: 799,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/chem-book/400/500",
        imageHint: "chemistry textbook",
        class: "Class 12",
        subject: "Chemistry"
    },
    {
        title: "Trueman's Elementary Biology",
        author: "by K.N. Bhatia & M.P. Tyagi",
        price: 950,
        originalPrice: 1050,
        discount: 10,
        imageUrl: "https://picsum.photos/seed/bio-book/400/500",
        imageHint: "biology textbook",
        class: "Class 12",
        subject: "Biology"
    },
    {
        title: "Indian Polity",
        author: "by M. Laxmikanth",
        price: 800,
        originalPrice: 900,
        discount: 11,
        imageUrl: "https://picsum.photos/seed/polity-book/400/500",
        imageHint: "polity textbook",
        class: "Class 12",
        subject: "Political Science"
    },
    {
        title: "History of Modern India",
        author: "by Bipan Chandra",
        price: 450,
        originalPrice: 500,
        discount: 10,
        imageUrl: "https://picsum.photos/seed/history-book/400/500",
        imageHint: "history textbook",
        class: "Class 12",
        subject: "History"
    },
    {
        title: "Indian Economy",
        author: "by Ramesh Singh",
        price: 650,
        originalPrice: 750,
        discount: 13,
        imageUrl: "https://picsum.photos/seed/economy-book/400/500",
        imageHint: "economy textbook",
        class: "Class 12",
        subject: "Economics"
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
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
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
                        <Card key={index} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up group rounded-lg bg-card" style={{ animationDelay: `${index * 50}ms` }}>
                            <CardContent className="p-0 flex flex-col h-full">
                                <div className="relative aspect-[3/4] w-full">
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        data-ai-hint={book.imageHint}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {book.discount && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                                            {book.discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-base leading-tight truncate flex-grow" title={book.title}>{book.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <p className="text-xl font-bold text-foreground">₹{book.price}</p>
                                        {book.originalPrice && <p className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</p>}
                                    </div>
                                    <Button className="w-full mt-4 bg-blue-900 hover:bg-blue-800">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
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
