'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { Download, ChevronDown, BookOpen, FileText, Languages, Zap, Globe, CheckCircle2, ArrowRight, BookCheck, X } from "lucide-react";
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
        title: "Preparing Download",
        description: `Generating secure link for ${label} syllabus...`,
    });
    
    const result = await getSignedUrlForPdf(path);
    if (result.success && result.url) {
        window.open(result.url, '_blank');
    } else {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Sorry, this syllabus file is currently being updated. Please try again later.",
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden border-b border-slate-50">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-8 animate-fade-in-up text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase">
                        ALL ABOUT <br/>
                        <span className="text-red-600">CUET (UG)</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm md:text-lg leading-relaxed max-w-lg">
                        Master every detail of the nation's biggest entrance exam. From registration to top college shortlisting, your journey starts here.
                    </p>
                    <Button asChild size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-red-600/20">
                        <Link href="/student-enquiry">Book Free Counselling</Link>
                    </Button>
                </div>
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden bg-white border-[12px] border-slate-50">
                        <Image src="/cuet.png" alt="CUET" fill className="object-contain p-10" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Syllabus Section */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
                        CUET (UG) <span className="text-red-600">Syllabus</span> 2026
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Official Curriculum Breakdown</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Languages */}
                    <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl group-hover:rotate-6 transition-transform duration-500">
                                <Languages className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Section I: Languages</h3>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                    Testing Reading Comprehension based on different types of passages–Factual, Literary and Narrative.
                                </p>
                            </div>
                            <Button 
                                onClick={() => handleDownload("cuet/syllabus/languages.pdf", "Section I: Languages")}
                                className="w-full rounded-xl font-black text-[10px] tracking-widest uppercase bg-blue-600 hover:bg-blue-700 text-white h-12 shadow-lg shadow-blue-600/20"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                        </CardContent>
                    </Card>

                    {/* General Aptitude */}
                    <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="p-5 bg-orange-50 text-orange-600 rounded-3xl group-hover:rotate-6 transition-transform duration-500">
                                <Zap className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Section III: General Test</h3>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                    General Knowledge, Current Affairs, General Mental Ability, Numerical Ability, Quantitative Reasoning.
                                </p>
                            </div>
                            <Button 
                                onClick={() => handleDownload("cuet/syllabus/general-test.pdf", "Section III: General Test")}
                                className="w-full rounded-xl font-black text-[10px] tracking-widest uppercase bg-orange-600 hover:bg-orange-700 text-white h-12 shadow-lg shadow-orange-600/20"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Domains */}
                    <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                            <div className="p-5 bg-red-50 text-red-600 rounded-3xl group-hover:rotate-6 transition-transform duration-500">
                                <Globe className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Section II: Domains</h3>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                    Subject-specific knowledge based on Class 12 NCERT curriculum across 27 available domains.
                                </p>
                            </div>
                            <Button 
                                onClick={() => setIsDomainsOpen(!isDomainsOpen)}
                                className="w-full rounded-xl font-black text-[10px] tracking-widest uppercase bg-red-600 hover:bg-red-700 text-white h-12 shadow-lg shadow-red-600/20"
                            >
                                {isDomainsOpen ? <X className="w-4 h-4 mr-2" /> : <BookCheck className="w-4 h-4 mr-2" />}
                                {isDomainsOpen ? "Close Subjects" : "View Subjects"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Domain Subjects Grid - Expandable */}
                <AnimatePresence>
                    {isDomainsOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100"
                        >
                            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Select Domain Subject</h4>
                                <Badge className="w-fit bg-red-50 text-red-600 border-red-100 font-black px-4 py-1 text-[9px] tracking-widest uppercase">NCERT Based</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {domainSubjects.map((subject, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleDownload(subject.path, subject.name)}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all group/sub text-left"
                                    >
                                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover/sub:text-red-600 transition-colors">
                                            {subject.name}
                                        </span>
                                        <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover/sub:bg-red-600 group-hover/sub:text-white transition-all">
                                            <Download className="w-3.5 h-3.5" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </section>
    </div>
  );
}
