'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Calendar, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { format, lastDayOfMonth } from "date-fns";
import Link from 'next/link';

export function ScholarshipSection() {
    const [examDates, setExamDates] = useState({ sat: '', sun: '', monthYear: '' });

    useEffect(() => {
        const today = new Date();
        const lastDay = lastDayOfMonth(today);
        let lastSunday = new Date(lastDay);
        let lastSaturday = new Date(lastDay);

        while (lastSunday.getDay() !== 0) {
            lastSunday.setDate(lastSunday.getDate() - 1);
        }
        
        lastSaturday.setDate(lastSunday.getDate() - 1);
        
        if (lastDay.getDay() === 6) {
            lastSaturday = lastDay;
            lastSunday = new Date(lastDay);
            lastSunday.setDate(lastDay.getDate() - 1);
        }

        setExamDates({
            sat: format(lastSaturday, 'do'),
            sun: format(lastSunday, 'do'),
            monthYear: format(today, 'MMMM yyyy')
        });
    }, []);

    return (
        <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl overflow-hidden">
                    <CardContent className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6 text-center lg:text-left">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight">IDL Scholarship & Admission Test</h2>
                                <p className="text-lg text-blue-200">For Class IV - XII</p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-lg">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-6 h-6 text-yellow-300" />
                                        <span>Cash Prize: <span className="font-bold">₹50K</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-6 h-6 text-yellow-300" />
                                        <span>Scholarships: <span className="font-bold">₹75K</span></span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center lg:justify-start gap-2 bg-white/10 p-3 rounded-lg">
                                    <Calendar className="w-5 h-5 text-yellow-300" />
                                    <p className="font-semibold">Exam Dates: {examDates.sat} & {examDates.sun} {examDates.monthYear}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 rounded-lg h-14 px-8 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
                                    <Link href="/scholarship">Register Now</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
