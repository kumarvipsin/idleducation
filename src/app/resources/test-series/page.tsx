'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowLeft, Search, Filter, Lock, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const testSeries = [
    {
        title: "CUET (UG) 2026 Full Length Mock Test 1",
        subject: "General Test + Language",
        questions: 100,
        duration: "120 mins",
        type: "Free",
        status: "available"
    },
    {
        title: "Science Domain Practice Set - Physics",
        subject: "Physics",
        questions: 50,
        duration: "60 mins",
        type: "Premium",
        status: "locked"
    },
    {
        title: "Commerce Domain Practice Set - Accounts",
        subject: "Accountancy",
        questions: 50,
        duration: "60 mins",
        type: "Premium",
        status: "locked"
    }
];

export default function TestSeriesPage() {
    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative py-12">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                
                {/* Back Link */}
                <div className="mb-8">
                    <Button asChild variant="ghost" className="text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px] h-9 rounded-xl">
                        <Link href="/category/cuet">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to CUET Portal
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-3 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            Assessment Node
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            Test <span className="text-primary">Series</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-tight max-w-xl">
                            Simulated examination environments designed by senior faculty to perfect your time management and accuracy.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input placeholder="Search tests..." className="pl-10 h-11 w-full md:w-64 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-primary/10 transition-all" />
                        </div>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white border-slate-200 shadow-sm">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testSeries.map((test, i) => (
                        <Card key={i} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-2xl transition-all duration-500">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
                            
                            <CardHeader className="p-6 pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/5 rounded-xl text-primary shadow-inner">
                                        <ClipboardList className="w-6 h-6" />
                                    </div>
                                    <Badge variant={test.type === 'Free' ? 'secondary' : 'default'} className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none",
                                        test.type === 'Free' ? "bg-emerald-50 text-emerald-600" : "bg-primary text-white"
                                    )}>
                                        {test.type}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight text-slate-900 leading-tight group-hover:text-primary transition-colors text-left">{test.title}</CardTitle>
                                <CardDescription className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pt-1">{test.subject}</CardDescription>
                            </CardHeader>

                            <CardContent className="p-6 pt-0 space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Questions</p>
                                        <p className="text-sm font-black text-slate-700">{test.questions}</p>
                                    </div>
                                    <div className="w-[1px] h-8 bg-slate-100" />
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Time Limit</p>
                                        <p className="text-sm font-black text-slate-700">{test.duration}</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {test.status === 'locked' ? (
                                        <Button disabled className="w-full h-12 rounded-xl font-black text-[10px] tracking-widest uppercase bg-slate-100 text-slate-400 border-none shadow-none">
                                            <Lock className="w-3.5 h-3.5 mr-2" />
                                            Unlock with Premium
                                        </Button>
                                    ) : (
                                        <Button className="w-full h-12 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-primary/20 group/btn">
                                            Start Assessment
                                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-20 text-center space-y-8 animate-fade-in-up">
                    <Separator className="max-w-md mx-auto opacity-40" />
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { label: "Real-time Analytics", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "NTA Standard UI", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "Detailed Solutions", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {item.icon}
                                <span className="text-[10px] font-black tracking-widest text-slate-900 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
