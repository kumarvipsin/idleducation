
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Book, Library, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const books = [
    {
        title: "Concepts of Physics",
        author: "by H.C. Verma",
        subject: "Physics",
        class: "Class: 11 & 12",
        imageUrl: "https://picsum.photos/seed/physics-book/400/500",
        imageHint: "physics textbook"
    },
    {
        title: "Objective Chemistry",
        author: "by Dr. R.K. Gupta",
        subject: "Chemistry",
        class: "Class: NEET",
        imageUrl: "https://picsum.photos/seed/chem-book/400/500",
        imageHint: "chemistry textbook"
    },
    {
        title: "Trueman's Elementary Biology",
        author: "by K.N. Bhatia & M.P. Tyagi",
        subject: "Biology",
        class: "Class: NEET",
        imageUrl: "https://picsum.photos/seed/bio-book/400/500",
        imageHint: "biology textbook"
    },
    {
        title: "Mathematics for Class 10",
        author: "by R.D. Sharma",
        subject: "Mathematics",
        class: "Class: 10",
        imageUrl: "https://picsum.photos/seed/math-book/400/500",
        imageHint: "math textbook"
    },
    {
        title: "History of Modern India",
        author: "by Bipan Chandra",
        subject: "History",
        class: "Class: UPSC",
        imageUrl: "https://picsum.photos/seed/history-book/400/500",
        imageHint: "history textbook"
    },
    {
        title: "Oxford Student Atlas for India",
        author: "by Oxford University Press",
        subject: "Geography",
        class: "Class: All",
        imageUrl: "https://picsum.photos/seed/geo-book/400/500",
        imageHint: "atlas book"
    },
    {
        title: "Indian Polity",
        author: "by M. Laxmikanth",
        subject: "Political Science",
        class: "Class: UPSC",
        imageUrl: "https://picsum.photos/seed/polity-book/400/500",
        imageHint: "polity textbook"
    },
    {
        title: "Indian Economy",
        author: "by Ramesh Singh",
        subject: "Economics",
        class: "Class: UPSC",
        imageUrl: "https://picsum.photos/seed/econ-book/400/500",
        imageHint: "economy textbook"
    },
    {
        title: "Verbal and Non-Verbal Reasoning",
        author: "by R.S. Aggarwal",
        subject: "Reasoning",
        class: "Class: Competitive Exams",
        imageUrl: "https://picsum.photos/seed/reasoning-book/400/500",
        imageHint: "reasoning textbook"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {books.map((book, index) => (
                        <Card key={index} className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up group rounded-lg" style={{ animationDelay: `${index * 50}ms` }}>
                            <CardContent className="p-0">
                                <div className="relative aspect-[3/4] w-full">
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        data-ai-hint={book.imageHint}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                                <div className="p-4 bg-background">
                                    <h3 className="font-bold text-base leading-tight truncate" title={book.title}>{book.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                                    <div className="flex items-center justify-between text-xs mt-3 text-primary">
                                        <div className="flex items-center gap-1.5 font-semibold">
                                            <Library className="w-3.5 h-3.5" />
                                            <span>{book.subject}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-semibold">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            <span>{book.class}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
