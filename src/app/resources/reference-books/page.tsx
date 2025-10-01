
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const books = [
    {
        title: "Mathematics for Class 10",
        author: "by R.D. Sharma",
        price: 600,
        originalPrice: 700,
        discount: 14,
        imageUrl: "https://picsum.photos/seed/maths-10/400/500",
        imageHint: "math textbook"
    },
    {
        title: "Secondary School Mathematics for Class 10",
        author: "by R.S. Aggarwal",
        price: 580,
        originalPrice: 650,
        discount: 11,
        imageUrl: "https://picsum.photos/seed/maths-10-rs/400/500",
        imageHint: "math textbook"
    },
    {
        title: "Educart CBSE Class 10 Maths Sample Papers",
        author: "by Educart",
        price: 350,
        originalPrice: 400,
        discount: 13,
        imageUrl: "https://picsum.photos/seed/maths-sample/400/500",
        imageHint: "math sample papers"
    },
    {
        title: "Concepts of Physics",
        author: "by H.C. Verma",
        price: 750,
        originalPrice: 850,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/physics-book/400/500",
        imageHint: "physics textbook"
    },
    {
        title: "Objective Chemistry",
        author: "by Dr. R.K. Gupta",
        price: 700,
        originalPrice: 799,
        discount: 12,
        imageUrl: "https://picsum.photos/seed/chem-book/400/500",
        imageHint: "chemistry textbook"
    },
    {
        title: "Trueman's Elementary Biology",
        author: "by K.N. Bhatia & M.P. Tyagi",
        price: 950,
        originalPrice: 1050,
        discount: 10,
        imageUrl: "https://picsum.photos/seed/bio-book/400/500",
        imageHint: "biology textbook"
    },
    {
        title: "History of Modern India",
        author: "by Bipan Chandra",
        price: 450,
        originalPrice: 500,
        discount: 10,
        imageUrl: "https://picsum.photos/seed/history-book/400/500",
        imageHint: "history textbook"
    },
    {
        title: "Indian Polity",
        author: "by M. Laxmikanth",
        price: 850,
        originalPrice: 950,
        discount: 11,
        imageUrl: "https://picsum.photos/seed/polity-book/400/500",
        imageHint: "polity textbook"
    },
];

export default function ReferenceBooksPage() {
    return (
        <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book, index) => (
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
