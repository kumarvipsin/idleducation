
'use client';

import { Button } from "@/components/ui/button";
import { Award, Trophy } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export function ScholarshipSection() {
    return (
         <section className="bg-blue-50 dark:bg-blue-900/20 py-12 mt-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Get up to 70% scholarship with the <span className="text-orange-500">IDL Scholarship Admission Test</span></h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Trophy className="h-8 w-8 text-primary" />
                                <p className="text-gray-600 dark:text-gray-300">Upto 70% Scholarship on IDL Course Admissions</p>
                            </div>
                             <div className="flex items-center gap-4">
                                <Award className="h-8 w-8 text-primary" />
                                <p className="text-gray-600 dark:text-gray-300">Get 2X Scholarship by taking the Test at Our Centre</p>
                            </div>
                        </div>
                        <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                            <Link href="/scholarship">Register For FREE</Link>
                        </Button>
                        <p className="text-xs text-muted-foreground">Hurry, limited seats are left</p>
                    </div>
                    <div className="relative h-80">
                        <Image
                            src="https://images.unsplash.com/photo-1633061273960-9c33bf7cc0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzY2hvbGFyc2hpcHxlbnwwfHx8fDE3NjkwNTUyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Student with trophy"
                            data-ai-hint="student trophy"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
