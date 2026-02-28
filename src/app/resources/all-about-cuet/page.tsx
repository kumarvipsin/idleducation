'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
    Download, 
    Languages, 
    Zap, 
    Globe, 
    ArrowRight, 
    BookCheck, 
    X, 
    FileText, 
    Sparkles, 
    ShieldCheck,
    ChevronRight,
    Search,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSignedUrlForPdf } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const domainSubjects = [
    { name: "Physics", path: "cuet/syllabus/physics.pdf" },
    { name: "Chemistry", path: "cuet/syllabus/chemistry.pdf" },
    { name: "Mathematics", path: "cuet/syllabus/maths.pdf" },
    { name: "Biology", path: "cuet/syllabus/biology.pdf" },
    { name: "History", path: "cuet/syllabus/history.pdf" },
    { name: "Political Science", path: "cuet/syllabus/political-science.pdf" },
    { name: "Economics", path: "cuet/syllabus/economics.pdf" },
    { name: "Sociology", path: "cuet/syllabus/sociology.pdf" },
    { name: "Accountancy", path: "cuet/syllabus/accountancy.pdf" },
    { name: "Business Studies", path: "cuet/syllabus/business-studies.pdf" },
    { name: "Geography", path: "cuet/syllabus/geography.pdf" },
    { name: "Psychology", path: "cuet/syllabus/psychology.pdf" },
];

export default function AllAboutCuetPage() {
  const { toast } = useToast();

  const handleDownload = async (path: string, label: string) => {
    toast({
        title: "Generating Link",
        description: `Preparing secure access for ${label}...`,
    });
    
    const result = await getSignedUrlForPdf(path);
    if (result.success && result.url) {
        window.open(result.url, '_blank');
    } else {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "Resource is temporarily unavailable for offline updates.",
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FBFBFE] dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section - Premium Visual Narrative */}
      <section className="relative w-full py-12 md:py-20 bg-white overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#fee2e2_0%,transparent_50%)] opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <div className="space-y-10 animate-fade-in-up text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            Official 2026 Guide
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight uppercase">
                            ALL ABOUT <br/>
                            <span className="text-red-600">CUET (UG)</span>
                        </h1>
                    </div>
                    
                    <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed max-w-lg opacity-80">
                        The ultimate technical blueprint for India's largest entrance gateway. Master the syllabus, understand the marking, and secure your future.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button asChild size="lg" className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[11px] h-14 px-10 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95">
                            <Link href="/student-enquiry">Book Free Counselling</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm font-black uppercase tracking-widest text-[11px] h-14 px-10 hover:bg-slate-50 transition-all">
                            <Link href="/contact">Support Node</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px]">
                        <Image src="/cuet.png" alt="CUET Portal" fill className="object-contain p-4" priority />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Redesigned Compact & Premium Syllabus Matrix */}
      <section className="py-20 md:py-32 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Section Title */}
                <div className="text-left mb-12 space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Curriculum <span className="text-red-600">Matrix</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Download Official Syllabus PDFs for 2026</p>
                </div>

                <div className="space-y-4">
                    {/* Part 1: Languages & General Test (Split Row) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-red-600 rounded-xl shadow-sm border border-slate-100">
                                    <Languages className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase">Languages</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Section I</p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleDownload("cuet/syllabus/languages.pdf", "Section I: Languages")}
                                variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm bg-white"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="group flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-xl transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-red-600 rounded-xl shadow-sm border border-slate-100">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase">General Test</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Section III</p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleDownload("cuet/syllabus/general-test.pdf", "Section III: General Test")}
                                variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm bg-white"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Part 2: Domain Subjects (Wide Container) */}
                    <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm overflow-hidden group/domain">
                        <div className="p-1"> {/* Thin gutter */}
                            <div className="bg-slate-50/50 rounded-[calc(2rem-4px)] p-8 md:p-10 space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                            <Globe className="w-6 h-6 text-red-600" />
                                            Domain Specific Subjects
                                        </h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-9">Section II • 27 Specializations Available</p>
                                    </div>
                                    <Badge className="w-fit bg-red-600 text-white font-black text-[9px] tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg shadow-red-600/20">Class 12 NCERT Aligned</Badge>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {domainSubjects.map((subject, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleDownload(subject.path, subject.name)}
                                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white hover:border-red-600 hover:shadow-lg transition-all group/sub text-left"
                                        >
                                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight group-hover/sub:text-red-600 transition-colors truncate pr-2">
                                                {subject.name}
                                            </span>
                                            <div className="shrink-0 p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover/sub:bg-red-600 group-hover/sub:text-white transition-all">
                                                <Download className="w-3 h-3" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bottom Footer Callout */}
                <div className="text-center pt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Quality Certified By Academic Node</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {[
                            { label: "100% NCERT ALIGNED", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "NTA PATTERN VERIFIED", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
                            { label: "EXPERT REVIEWED", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> }
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
      </section>
    </div>
  );
}