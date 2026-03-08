'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
    Download, 
    Languages, 
    Zap, 
    Globe, 
    ArrowRight, 
    FlaskConical,
    BarChart3,
    Landmark,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSignedUrlForPdf } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
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

const streamCatalogs = [
    {
        title: "Science Stream",
        description: "A comprehensive guide covering domain requirements for Physics, Chemistry, Biology, and Mathematics. Includes eligibility for top STEM programs.",
        icon: <FlaskConical className="w-6 h-6" />,
        color: "blue",
        subjects: ['Physics & Chemistry', 'Biology / Maths', 'Computer Science', 'Environmental Science'],
        path: "cuet/catalogs/science.pdf"
    },
    {
        title: "Commerce Stream",
        description: "Everything a Commerce student needs to know about Accountancy, BST, and Economics domains for admission to premium B-Schools.",
        icon: <BarChart3 className="w-6 h-6" />,
        color: "emerald",
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Entrepreneurship'],
        path: "cuet/catalogs/commerce.pdf"
    },
    {
        title: "Humanities Stream",
        description: "Navigating the diverse world of Arts and Social Sciences. Deep dive into History, Pol Science, and Geography domain analysis.",
        icon: <Landmark className="w-6 h-6" />,
        color: "amber",
        subjects: ['History & Geography', 'Political Science', 'Sociology', 'Psychology'],
        path: "cuet/catalogs/humanities.pdf"
    }
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
            description: "Resource is temporarily unavailable.",
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FBFBFE] dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section with Premium Blurs */}
      <section className="relative w-full pt-0 pb-12 md:pt-0 md:pb-20 bg-white overflow-hidden">
        {/* Floating Decorative Elements */}
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at:50%_-20%,#fee2e2_0%,transparent_50%)] opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                <div className="space-y-8 animate-fade-in-up text-left">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight uppercase">
                        ALL ABOUT <span className="text-red-600">CUET (UG)</span>
                    </h1>
                    
                    <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed max-w-lg opacity-80">
                        The ultimate technical blueprint for India's largest entrance gateway. Master the syllabus, understand the marking, and secure your future.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button asChild size="lg" className="rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold h-14 px-10 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)] transition-all hover:scale-105 active:scale-95">
                            <Link href="/student-enquiry">Book Free Counselling</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm font-semibold h-14 px-10 hover:bg-slate-50 transition-all">
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

      {/* 2. Syllabus Matrix Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-left mb-12 space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Curriculum <span className="text-red-600">Matrix</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-left">Download Official Syllabus PDFs for 2026</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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

                    <Card className="rounded-[2rem] border-slate-100 bg-white shadow-sm overflow-hidden group/domain">
                        <div className="p-1">
                            <div className="bg-slate-50/50 rounded-[calc(2rem-4px)] p-8 md:p-10 space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1 text-left">
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
            </div>
        </div>
      </section>

      {/* 3. Academic Catalogs Section */}
      <section className="py-20 md:py-32 bg-slate-50/50 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-left mb-16 space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Academic <span className="text-red-600">Catalogs</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-left">Comprehensive stream-wise guides for UG admissions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {streamCatalogs.map((catalog, index) => (
                        <Card key={index} className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                            <div className={cn(
                                "h-2",
                                catalog.color === 'blue' ? 'bg-blue-600' :
                                catalog.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
                            )} />
                            <CardContent className="p-8 space-y-6">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                                    catalog.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    catalog.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                )}>
                                    {catalog.icon}
                                </div>
                                <div className="space-y-2 text-left">
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{catalog.title}</h3>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        {catalog.description}
                                    </p>
                                </div>
                                <div className="space-y-2 pb-2 text-left">
                                    {catalog.subjects.map(s => (
                                        <div key={s} className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                catalog.color === 'blue' ? 'bg-blue-600' :
                                                catalog.color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
                                            )} /> 
                                            {s}
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    className={cn(
                                        "w-full rounded-xl text-white font-black text-[10px] tracking-widest uppercase h-12 shadow-lg transition-all",
                                        catalog.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' :
                                        catalog.color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 
                                        'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                                    )} 
                                    onClick={() => handleDownload(catalog.path, catalog.title)}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download Guide
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 4. Footer Callout */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center animate-fade-in-up">
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
      </section>
    </div>
  );
}
