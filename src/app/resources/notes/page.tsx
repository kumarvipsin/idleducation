'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, HelpCircle, Sigma, Lightbulb, Globe, Plus, Minus, X, Divide, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCollection } from '@/app/actions/data';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";

type Subject = {
  name: string;
  href: string;
  className: string;
  subjectKey: string;
};

const subjectThemes: { [key: string]: { 
  bg: string; 
  text: string; 
  spine: string; 
  icon: React.ReactNode;
}} = {
  maths: { 
    bg: "bg-[#FFF7D6]", 
    text: "text-[#A16207]", 
    spine: "bg-[#FDE68A]", 
    icon: (
      <div className="grid grid-cols-2 gap-1 opacity-20">
        <Plus className="w-8 h-8" strokeWidth={3} />
        <Minus className="w-8 h-8" strokeWidth={3} />
        <X className="w-8 h-8" strokeWidth={3} />
        <Divide className="w-8 h-8" strokeWidth={3} />
      </div>
    )
  },
  science: { 
    bg: "bg-[#E0F2FE]", 
    text: "text-[#0369A1]", 
    spine: "bg-[#BAE6FD]", 
    icon: <Lightbulb className="w-24 h-24 opacity-10" strokeWidth={1.5} /> 
  },
  social: { 
    bg: "bg-[#FEE2E2]", 
    text: "text-[#9F1239]", 
    spine: "bg-[#FECACA]", 
    icon: <Globe className="w-24 h-24 opacity-10" strokeWidth={1.5} /> 
  },
  english: { 
    bg: "bg-[#F5F3FF]", 
    text: "text-[#5B21B6]", 
    spine: "bg-[#DDD6FE]", 
    icon: <div className="text-7xl font-black opacity-10 select-none">A</div> 
  },
  default: { 
    bg: "bg-slate-50", 
    text: "text-slate-700", 
    spine: "bg-slate-200", 
    icon: <BookOpen className="w-24 h-24 opacity-10" strokeWidth={1.5} /> 
  },
};

const getTheme = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('math')) return subjectThemes.maths;
    if (lowerKey.includes('science') && !lowerKey.includes('social')) return subjectThemes.science;
    if (lowerKey.includes('social') || lowerKey.includes('history') || lowerKey.includes('geography') || lowerKey.includes('pol')) return subjectThemes.social;
    if (lowerKey.includes('english')) return subjectThemes.english;
    return subjectThemes.default;
};

function NotesPageContent() {
  const [notesByClass, setNotesByClass] = useState<any>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchNotesData = async () => {
      setLoading(true);
      const result = await getCollection('notes');
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).reduce((acc, classDoc) => {
          const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
          
          // Sort subjects within the class by the administrative order property
          acc[className] = Object.entries(classDoc.subjects)
            .sort(([, a]: any, [, b]: any) => (a.order || 99) - (b.order || 99))
            .map(([subjectKey, subjectData]: [string, any]) => ({
              name: subjectData.name,
              href: `/resources/notes/${classDoc.id}/${subjectKey}`,
              subjectKey: subjectKey,
              className: className,
            }));
          return acc;
        }, {});
        
        const sortedClasses = Object.keys(formattedData).sort((a, b) => {
             const getOrder = (name: string) => parseInt(name.replace('Class ', ''), 10) || 99;
             return getOrder(a) - getOrder(b);
        });

        setNotesByClass(formattedData);
        setClasses(sortedClasses);
        if (sortedClasses.length > 0) {
            const defaultClass = sortedClasses.find(c => c.includes('10')) || sortedClasses[0];
            setSelectedClass(defaultClass);
        }
      }
      setLoading(false);
    };

    fetchNotesData();
  }, []);

  const subjects = notesByClass[selectedClass] || [];
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-[240px] w-full rounded-2xl" />
        ))}
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight group inline-block">
            Notes For {selectedClass}
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-semibold">
            Find concise and comprehensive notes to help you revise and learn effectively.
        </p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
             {loading ? (
                 [...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
            ) : (
                classes.map((className: string) => (
                <button
                    key={className}
                    onClick={() => handleClassChange(className)}
                    className={`py-2 px-6 text-sm font-bold transition-all duration-300 rounded-full
                    ${selectedClass === className 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-muted-foreground hover:bg-muted'}`}
                >
                    {className}
                </button>
                ))
            )}
          </div>
        </div>
      </div>

      <main>
            {loading ? (
              renderSkeleton()
            ) : (
              <div key={animationKey} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in-up">
                {subjects && subjects.length > 0 ? (
                  subjects.map((subject: Subject, index: number) => {
                      const theme = getTheme(subject.subjectKey);
                      return (
                        <Link key={`${subject.href}-${index}`} href={subject.href} className="block group h-full">
                            <Card
                            className={cn(
                                "relative flex flex-col h-[240px] w-full rounded-2xl shadow-sm border-none transition-all duration-500 overflow-hidden",
                                "group-hover:shadow-xl group-hover:-translate-y-2 active:scale-95",
                                theme.bg
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Book Spine */}
                                <div className={cn("absolute left-0 top-0 bottom-0 w-3 md:w-4 opacity-40", theme.spine)} />
                                <div className={cn("absolute left-3 md:left-4 top-0 bottom-0 w-[1px] opacity-10", "bg-black")} />

                                <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">
                                    {/* Subject Name */}
                                    <div className="flex flex-col items-start text-left">
                                        <h3 className={cn("text-xl md:text-2xl font-black tracking-tight leading-tight", theme.text)}>
                                            {subject.name}
                                        </h3>
                                        <Badge variant="outline" className={cn("mt-2 border-current opacity-60 text-[10px] font-black uppercase tracking-widest px-2", theme.text)}>
                                            {selectedClass}
                                        </Badge>
                                    </div>

                                    {/* Background Icon Watermark */}
                                    <div className="absolute bottom-4 right-4 transform transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                                        {theme.icon}
                                    </div>
                                    
                                    <div className="mt-auto self-end">
                                        <div className={cn("p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0", theme.bg, "shadow-sm border border-black/5")}>
                                            <ArrowRight className="w-4 h-4", theme.text)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                      );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                        <Card className="p-8 inline-block bg-background/50 border-dashed">
                            <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                            <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                        </Card>
                    </div>
                )}
              </div>
            )}
      </main>
    </div>
  );
}

export default function NotesPage() {
    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-background">
            <div className="relative z-10 container mx-auto py-12">
                <Suspense fallback={
                    <div className="relative min-h-screen w-full bg-white dark:bg-background">
                    <div className="relative z-10 container mx-auto py-12">
                        <div className="mb-6 text-center">
                            <Skeleton className="h-9 w-64 mx-auto mb-2" />
                            <Skeleton className="h-5 w-96 mx-auto" />
                        </div>
                        <div className="mb-8 flex justify-center gap-2">
                            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />) /* Placeholder for skeletons */}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[240px] w-full rounded-2xl" />)}
                        </div>
                    </div>
                    </div>
                }>
                    <NotesPageContent />
                </Suspense>
            </div>
        </div>
    );
}
