'use client';

import { Button } from "@/components/ui/button";
import { Award, Trophy } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export function ScholarshipSection() {
    return (
        <section className="w-full py-2 md:py-4 bg-muted/20 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-3 md:p-5 border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-4 text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">Get up to 70% scholarship with the <span className="text-orange-500">IDL Scholarship & Admission Test</span></h2>
                            <div className="space-y-1.5 flex flex-col items-start">
                                <div className="flex items-center gap-2 justify-start">
                                    <Trophy className="h-5 w-5 text-primary flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground font-bold">Upto 70% Scholarship on IDL Course Admissions</p>
                                </div>
                                <div className="flex items-center gap-2 justify-start">
                                    <Award className="h-5 w-5 text-primary flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground font-bold">Get 2X Scholarship by taking the Test at Our Centre</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <Button asChild className="h-11 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all border-none">
                                    <Link href="/scholarship">Register For FREE</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="h-48 md:h-64 flex items-center justify-center">
                           <div className="relative w-full h-full">
                                <Image
                                    src="https://picsum.photos/seed/trophy/800/600"
                                    alt="Student with trophy"
                                    data-ai-hint="student trophy"
                                    fill
                                    className="object-cover rounded-xl"
                                />
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
