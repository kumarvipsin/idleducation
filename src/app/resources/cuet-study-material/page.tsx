'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Download, 
    ShoppingCart, 
    Home, 
    ArrowLeft,
    Sigma,
    TestTube2,
    Landmark,
    Scale,
    TrendingUp,
    Globe,
    BookText,
    Zap,
    Atom,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const subjects = [
    {
        name: "CUET Physics",
        description: "Comprehensive notes covering the entire NCERT Class 12 Physics syllabus with CUET-focused MCQ practice sets and formula sheets.",
        icon: <Atom />,
        price: 299,
        originalPrice: 999,
        color: "bg-blue-50 text-blue-600",
        iconBg: "bg-blue-100"
    },
    {
        name: "CUET Chemistry",
        description: "In-depth revision material for Physical, Organic, and Inorganic Chemistry. Includes summary tables and quick revision charts.",
        icon: <TestTube2 />,
        price: 299,
        originalPrice: 999,
        color: "bg-emerald-50 text-emerald-600",
        iconBg: "bg-emerald-100"
    },
    {
        name: "CUET Mathematics",
        description: "Short-cut methods and detailed explanations for Calculus, Algebra, and Vectors specifically tailored for the CUET entrance level.",
        icon: <Sigma />,
        price: 299,
        originalPrice: 999,
        color: "bg-indigo-50 text-indigo-600",
        iconBg: "bg-indigo-100"
    },
    {
        name: "CUET English",
        description: "Master Reading Comprehension, Verbal Ability, and Vocabulary with our high-yield question bank and grammar guide.",
        icon: <BookText />,
        price: 199,
        originalPrice: 799,
        color: "bg-purple-50 text-purple-600",
        iconBg: "bg-purple-100"
    },
    {
        name: "CUET General Test",
        description: "All-in-one guide for Quantitative Reasoning, Logical Ability, and General Awareness. The most vital resource for Section III.",
        icon: <Zap />,
        price: 249,
        originalPrice: 899,
        color: "bg-amber-50 text-amber-600",
        iconBg: "bg-amber-100"
    },
    {
        name: "CUET History",
        description: "Detailed chronological notes from Class 12 Themes in Indian History. Optimized for quick recall of important events and dates.",
        icon: <Landmark />,
        price: 199,
        originalPrice: 799,
        color: "bg-rose-50 text-rose-600",
        iconBg: "bg-rose-100"
    },
    {
        name: "CUET Pol. Science",
        description: "Expert coverage of Contemporary World Politics and Politics in India Since Independence. Includes practice MCQs for every chapter.",
        icon: <Scale />,
        price: 199,
        originalPrice: 799,
        color: "bg-cyan-50 text-cyan-600",
        iconBg: "bg-cyan-100"
    },
    {
        name: "CUET Economics",
        description: "Clarify concepts of Macroeconomics and Indian Economic Development with simplified definitions and graph-based questions.",
        icon: <TrendingUp />,
        price: 199,
        originalPrice: 799,
        color: "bg-orange-50 text-orange-600",
        iconBg: "bg-orange-100"
    },
];

export default function CuetStudyMaterialPage() {
    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="container mx-auto py-10 px-4 md:px-6 max-w-6xl relative z-10">
                
                {/* Back Button */}
                <div className="mb-6">
                    <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[9px] h-8">
                        <Link href="/category/cuet">
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> 
                            Back to CUET Portal
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                        PREMIUM STUDY VAULT
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        CUET 2026{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-primary">Study Material</span>
                            <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h1>
                    <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-tight opacity-80">
                        Expert-Curated Academic Assets For India's Toughest Entrance Exams.
                    </p>
                </div>

                {/* Subject Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {subjects.map((subject, index) => (
                        <Card key={index} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-500 group/card flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                            <CardContent className="p-0 flex flex-col h-full">
                                {/* Subject Identity Header */}
                                <div className={cn("p-4 flex items-center gap-4 transition-colors border-b border-black/[0.03]", subject.color)}>
                                    <div className={cn("p-3 rounded-xl shadow-sm shrink-0 group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500", subject.iconBg)}>
                                        {React.cloneElement(subject.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-lg font-bold tracking-tight leading-none">{subject.name}</h3>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-60">CUET 2026-27 Module</p>
                                    </div>
                                </div>

                                <div className="p-5 flex-grow flex flex-col">
                                    <p className="text-[13px] font-normal text-slate-600 dark:text-slate-400 leading-relaxed text-left line-clamp-3 mb-5">
                                        {subject.description}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        {/* Pricing Row */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Single Access</p>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-xl font-bold text-foreground">₹{subject.price}</span>
                                                    <span className="text-[11px] font-medium text-slate-400 line-through opacity-50">₹{subject.originalPrice}</span>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-100 text-green-600 border-none font-bold text-[8px] px-2 py-0.5 rounded-md uppercase">SAVE {Math.round(((subject.originalPrice - subject.price) / subject.originalPrice) * 100)}%</Badge>
                                        </div>

                                        <Separator className="opacity-40" />

                                        {/* Buttons Row */}
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button variant="outline" className="flex-1 rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest border-slate-200 group/dl">
                                                <Download className="w-3.5 h-3.5 mr-1.5 transition-transform group/dl:-translate-y-0.5" />
                                                Free Sample
                                            </Button>
                                            <Button asChild className="flex-1 rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest shadow-md shadow-primary/10">
                                                <Link href="/store">
                                                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                                                    Get Access
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-16 pt-10 border-t border-slate-100 text-center animate-fade-in-up">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Quality Ensured By IDL Research Node</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {[
                            { label: "100% NCERT ALIGNED", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
                            { label: "CUET PATTERN VERIFIED", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
                            { label: "FACULTY CURATED", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {item.icon}
                                <span className="text-[10px] font-bold tracking-tight text-foreground/60">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
