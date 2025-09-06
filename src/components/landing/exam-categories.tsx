'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useRef, useState } from 'react';

const allPrograms = [
    // EN
    { name: "CLASS V", href: "/school?class=Class 5" },
    { name: "CLASS VI", href: "/school?class=Class 6" },
    { name: "CLASS VII", href: "/school?class=Class 7" },
    { name: "CLASS VIII", href: "/school?class=Class 8" },
    { name: "CLASS IX", href: "/school?class=Class 9" },
    { name: "CLASS X", href: "/school?class=Class 10" },
    { name: "CLASS XI", href: "/school?class=Class 11" },
    { name: "CLASS XII", href: "/school?class=Class 12" },
    { name: "JEE", href: "/category/iit-jee" },
    { name: "NEET", href: "/category/neet" },
    // HI
    { name: "CUET", href: "/category/cuet" },
    { name: "CBSE", href: "/school" },
    { name: "NIOS", href: "/school" },
    { name: "SSC", href: "/category/govt-job-exams" },
    { name: "BANK PO", href: "/category/govt-job-exams" },
    { name: "RRB", href: "/category/govt-job-exams" },
    { name: "CLAT", href: "/category/cuet" },
    { name: "GATE", href: "/category/iit-jee" },
    { name: "DEFENCE", href: "/category/defence" },
    { name: "DELHI POLICE", href: "/category/govt-job-exams" },
];

const popularProgramsEn = [
  { name: "CLASS V", href: "/school?class=Class 5" },
  { name: "CLASS VI", href: "/school?class=Class 6" },
  { name: "CLASS VII", href: "/school?class=Class 7" },
  { name: "CLASS VIII", href: "/school?class=Class 8" },
  { name: "CLASS IX", href: "/school?class=Class 9" },
  { name: "CLASS X", href: "/school?class=Class 10" },
  { name: "CLASS XI", href: "/school?class=Class 11" },
  { name: "CLASS XII", href: "/school?class=Class 12" },
  { name: "JEE", href: "/category/iit-jee" },
  { name: "NEET", href: "/category/neet" },
];
const popularProgramsHi = [
  { name: "CUET", href: "/category/cuet" },
  { name: "CBSE", href: "/school" },
  { name: "NIOS", href: "/school" },
  { name: "SSC", href: "/category/govt-job-exams" },
  { name: "BANK PO", href: "/category/govt-job-exams" },
  { name: "RRB", href: "/category/govt-job-exams" },
  { name: "CLAT", href: "/category/cuet" },
  { name: "GATE", href: "/category/iit-jee" },
  { name: "DEFENCE", href: "/category/defence" },
  { name: "DELHI POLICE", href: "/category/govt-job-exams" },
];

const ExploreMoreDialog = ({ triggerText, programs, dialogTitle, dialogDescription }: { triggerText: string, programs: typeof allPrograms, dialogTitle: string, dialogDescription: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="font-bold text-primary-foreground/80 hover:text-primary-foreground hover:underline">
                    {triggerText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm bg-background/50 backdrop-blur-md border-primary/20">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-primary">{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full">
                    <div className="grid grid-cols-2 gap-3 p-4">
                        {programs.map((program) => (
                            <Button key={program.name} asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg">
                                <Link href={program.href}>{program.name}</Link>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export function ExamCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full pt-6 md:pt-12 pb-6 md:pb-12 bg-background">
      <div className={`container mx-auto px-4 md:px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
           <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Exam</span> <span style={{ color: '#adb5bd' }}>Categories</span>
          </h2>
          <p className={`text-muted-foreground mt-2 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
            We offer comprehensive coaching for a wide range of exams. Find your path to success by exploring our categories below.
          </p>
        </div>
        <Card
            className={`transition-all duration-300 border-none rounded-2xl group bg-gradient-to-br from-primary via-primary to-accent ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '0.2s' }}
        >
            <div className="flex flex-col lg:flex-row">
                {/* Left Side */}
                <div className="flex-1">
                <CardContent className="p-6">
                    <Carousel
                        opts={{ align: "start" }}
                        className="w-full"
                    >
                    <CarouselContent>
                        {Array.from({ length: Math.ceil(popularProgramsEn.length / 6) }).map((_, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {popularProgramsEn.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-background/20 text-white border-white/30 hover:bg-background/30">
                                <Link href={program.href}>{program.name}</Link>
                                </Button>
                            ))}
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    </Carousel>
                    <div className="mt-4 flex justify-center">
                        <ExploreMoreDialog 
                            triggerText="Explore More" 
                            programs={popularProgramsEn} 
                            dialogTitle="For School Exams"
                            dialogDescription="Explore our comprehensive programs and find the perfect fit for your learning journey."
                        />
                    </div>
                </CardContent>
                </div>
                
                {/* Divider */}
                <Separator orientation="vertical" className="h-auto hidden lg:block bg-white/20" />
                <Separator orientation="horizontal" className="block lg:hidden bg-white/20" />

                {/* Right Side */}
                <div className="flex-1">
                <CardContent className="p-6">
                    <Carousel
                        opts={{ align: "start" }}
                        className="w-full"
                    >
                    <CarouselContent>
                        {Array.from({ length: Math.ceil(popularProgramsHi.length / 6) }).map((_, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {popularProgramsHi.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-background/20 text-white border-white/30 hover:bg-background/30">
                                <Link href={program.href}>{program.name}</Link>
                                </Button>
                            ))}
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    </Carousel>
                    <div className="mt-4 flex justify-center">
                    <ExploreMoreDialog 
                            triggerText="Explore More" 
                            programs={popularProgramsHi} 
                            dialogTitle="For Competitive Exams"
                            dialogDescription="Find the right course to ace your competitive exams and achieve your career goals."
                        />
                    </div>
                </CardContent>
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
