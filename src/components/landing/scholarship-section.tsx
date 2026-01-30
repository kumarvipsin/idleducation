'use client';

import { Button } from "@/components/ui/button";
import { Award, Trophy } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export function ScholarshipSection() {
    return (
        <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Get up to 70% scholarship with the <span className="text-orange-500">IDL Scholarship Admission Test</span></h2>
                            <div className="space-y-2 flex flex-col items-start">
                                <div className="flex items-center gap-2 justify-start">
                                    <Trophy className="h-6 w-6 text-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">Upto 70% Scholarship on IDL Course Admissions</p>
                                </div>
                                <div className="flex items-center gap-2 justify-start">
                                    <Award className="h-6 w-6 text-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">Get 2X Scholarship by taking the Test at Our Centre</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                                    <Link href="/scholarship">Register For FREE</Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">Hurry, limited seats are left</p>
                            </div>
                        </div>
                        <div className="h-64 md:h-80 flex items-center justify-center">
                           <div className="relative w-full h-full">
                                <Image
                                    src="/ssp.jpg"
                                    alt="Student with trophy"
                                    data-ai-hint="student trophy"
                                    fill
                                    className="object-cover"
                                />
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
