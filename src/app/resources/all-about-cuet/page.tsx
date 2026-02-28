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
  const [isDomainsOpen, setIsDomainsOpen] = useState(false);

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
      <section className="relative w-full py-16 md:py-28 bg-white overflow-hidden">
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
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
                            ALL ABOUT <br/>
                            <span className="text-red-600">CUET (UG)</span>
                        </h1>
                    </div>
                    
                    <p className="text-slate-600 font-bold text-base md:text-xl leading-relaxed max-w-lg opacity-80">
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
                    <div className="relative group">
                        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all duration-700" />
                        <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden bg-white border-[16px] border-slate-50 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <Image src="/cuet.png" alt="CUET Portal" fill className="object-contain p-12" priority />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Premium Syllabus Explorer - Modular UI */}
      <section className="py-20 md:py-32 bg-slate-50/30 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Section Title */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-3 text-red-600">
                        <div className="h-[1px] w-8 bg-current opacity-30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Directory</span>
                        <div className="h-[1px] w-8 bg-current opacity-30" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
                        Syllabus <span className="text-red-600">Explorer</span> 2026
                    </h2>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        Precision-engineered curriculum modules designed for strategic exam preparation. 
                        Download the official technical guidelines below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Section I & III Group */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Languages */}
                        <div className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110">
                                <Languages className="w-24 h-24" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shadow-sm border border-amber-100 transition-transform group-hover:rotate-6">
                                        <Languages className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Languages</h3>
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Section I</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">Testing proficiency through factual, literary and narrative reading comprehension nodes.</p>
                                <Button 
                                    onClick={() => handleDownload("cuet/syllabus/languages.pdf", "Section I: Languages")}
                                    className="w-full rounded-xl font-black text-[10px] tracking-widest uppercase bg-slate-900 hover:bg-primary text-white h-12 shadow-lg shadow-slate-900/10"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Blueprint
                                </Button>
                            </div>
                        </div>

                        {/* General Test */}
                        <div className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110">
                                <Zap className="w-24 h-24" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm border border-emerald-100 transition-transform group-hover:rotate-6">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">General Test</h3>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Section III</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">Comprehensive evaluation of logic, mental ability, and quantitative strategic reasoning.</p>
                                <Button 
                                    onClick={() => handleDownload("cuet/syllabus/general-test.pdf", "Section III: General Test")}
                                    className="w-full rounded-xl font-black text-[10px] tracking-widest uppercase bg-slate-900 hover:bg-primary text-white h-12 shadow-lg shadow-slate-900/10"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Blueprint
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Section II: Domains (Primary Action) */}
                    <div className="lg:col-span-7">
                        <div className={cn(
                            "relative h-full bg-white border rounded-[2rem] shadow-sm transition-all duration-700 overflow-hidden",
                            isDomainsOpen ? "border-red-200 shadow-2xl" : "border-slate-100 hover:border-red-100 hover:shadow-xl"
                        )}>
                            {/* Header Stripe */}
                            <div className="p-8 md:p-10 space-y-8 h-full flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm border border-red-100">
                                                <Globe className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">Domain Subjects</h3>
                                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Section II • 27 Disciplines</p>
                                            </div>
                                        </div>
                                        <p className="text-xs md:text-sm text-slate-500 font-bold leading-relaxed max-w-md pt-2">
                                            Deep-dive technical knowledge based exclusively on the Class 12 NCERT academic frameworks.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsDomainsOpen(!isDomainsOpen)}
                                        className={cn(
                                            "p-4 rounded-2xl transition-all duration-500 active:scale-90",
                                            isDomainsOpen ? "bg-slate-900 text-white rotate-90" : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                                        )}
                                    >
                                        {isDomainsOpen ? <X className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isDomainsOpen ? (
                                        <motion.div 
                                            key="open"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            className="flex-grow space-y-6 overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                                                {domainSubjects.map((subject, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleDownload(subject.path, subject.name)}
                                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-lg transition-all group/sub text-left"
                                                    >
                                                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover/sub:text-red-600 transition-colors">
                                                            {subject.name}
                                                        </span>
                                                        <div className="p-1.5 bg-white text-slate-400 rounded-lg group-hover/sub:bg-red-600 group-hover/sub:text-white shadow-sm border border-slate-100 transition-all">
                                                            <Download className="w-3.5 h-3.5" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="closed"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-auto pt-8 border-t border-slate-50 flex items-center gap-6"
                                        >
                                            <div className="flex -space-x-3">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {i === 4 ? "+23" : <BookCheck className="w-4 h-4 opacity-40" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tap arrow to explore all domain assets</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer Callout */}
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
