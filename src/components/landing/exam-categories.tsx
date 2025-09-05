
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Atom, Dna, FlaskConical, Sigma } from 'lucide-react';
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
import Autoplay from "embla-carousel-autoplay";

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
                <Button variant="link" className="font-bold text-primary animate-pulse">
                    {triggerText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-primary">{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full">
                    <div className="grid grid-cols-2 gap-3 p-4">
                        {programs.map((program) => (
                            <Button key={program.name} asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-full">
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
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );


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
    <section ref={sectionRef} className="w-full pt-12 md:pt-24 pb-6 md:pb-12 bg-background">
      <div className={`container mx-auto px-4 md:px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
           <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Exam</span> <span style={{ color: '#adb5bd' }}>Categories</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            We offer comprehensive coaching for a wide range of exams. Find your path to success by exploring our categories below.
          </p>
        </div>
        <Card
            className={`relative overflow-hidden transition-all duration-300 bg-transparent border-none shadow-none ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl blur-lg opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-background rounded-lg">
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none">
                    <Atom className="absolute -top-4 -left-4 w-24 h-24 text-primary" />
                    <FlaskConical className="absolute -bottom-8 -right-4 w-28 h-28 text-green-500" />
                    <Dna className="absolute top-1/2 -right-6 w-20 h-20 text-red-500 -translate-y-1/2" />
                    <Sigma className="absolute bottom-4 left-4 w-16 h-16 text-yellow-500" />
                </div>
                <div className="flex flex-col lg:flex-row">
                    {/* Left Side */}
                    <div className="flex-1">
                    <CardContent className="p-6">
                        <Carousel
                            opts={{ align: "start", loop: true }}
                            plugins={[autoplayPlugin.current]}
                            className="w-full"
                        >
                        <CarouselContent>
                            {Array.from({ length: Math.ceil(popularProgramsEn.length / 6) }).map((_, slideIndex) => (
                            <CarouselItem key={slideIndex}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {popularProgramsEn.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                    <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm text-foreground bg-white/50 hover:bg-white/80 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
                                    <Link href={program.href}>{program.name}</Link>
                                    </Button>
                                ))}
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        </Carousel>
                        <div className="mt-16 flex justify-center">
                            <ExploreMoreDialog 
                                triggerText="EXPLORE MORE" 
                                programs={popularProgramsEn} 
                                dialogTitle="For School Exams"
                                dialogDescription="Explore our comprehensive programs and find the perfect fit for your learning journey."
                            />
                        </div>
                    </CardContent>
                    </div>
                    
                    {/* Divider */}
                    <Separator orientation="vertical" className="h-auto hidden lg:block bg-border" />
                    <Separator orientation="horizontal" className="block lg:hidden bg-border" />

                    {/* Right Side */}
                    <div className="flex-1">
                    <CardContent className="p-6">
                        <Carousel
                            opts={{ align: "start", loop: true }}
                            plugins={[autoplayPlugin.current]}
                            className="w-full"
                        >
                        <CarouselContent>
                            {Array.from({ length: Math.ceil(popularProgramsHi.length / 6) }).map((_, slideIndex) => (
                            <CarouselItem key={slideIndex}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {popularProgramsHi.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                    <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm text-foreground bg-white/50 hover:bg-white/80 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary">
                                    <Link href={program.href}>{program.name}</Link>
                                    </Button>
                                ))}
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        </Carousel>
                        <div className="mt-16 flex justify-center">
                        <ExploreMoreDialog 
                                triggerText="EXPLORE MORE" 
                                programs={popularProgramsHi} 
                                dialogTitle="For Competitive Exams"
                                dialogDescription="Find the right course to ace your competitive exams and achieve your career goals."
                            />
                        </div>
                    </CardContent>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
