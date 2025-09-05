
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
                <Button variant="link" className="font-bold text-primary animate-pulse">
                    {triggerText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-center sm:text-center">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72">
                    <div className="grid grid-cols-2 gap-4 p-4">
                        {programs.map((program) => (
                            <Button key={program.name} asChild variant="outline" className="rounded-full border-primary hover:bg-primary/10 hover:text-primary">
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
  
  const svgTexture = `
    <svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'>
      <text x='10' y='30' font-size='14' fill='rgba(0,0,52,0.12)'>√x</text>
      <text x='60' y='50' font-size='14' fill='rgba(0,0,52,0.12)'>π</text>
      <text x='110' y='25' font-size='14' fill='rgba(0,0,52,0.12)'>Σ</text>
      <text x='25' y='80' font-size='14' fill='rgba(0,0,52,0.12)'>∫</text>
      <text x='90' y='120' font-size='14' fill='rgba(0,0,52,0.12)'>H₂O</text>
      <text x='130' y='90' font-size='14' fill='rgba(0,0,52,0.12)'>α</text>
      <text x='15' y='130' font-size='14' fill='rgba(0,0,52,0.12)'>E=mc²</text>
      <circle cx='85' cy='85' r='5' stroke='rgba(0,0,52,0.12)' stroke-width='1' fill='none'/>
      <ellipse cx='85' cy='85' rx='10' ry='4' transform='rotate(45 85 85)' stroke='rgba(0,0,52,0.12)' stroke-width='1' fill='none'/>
      <text x='40' y='105' font-size='14' fill='rgba(0,0,52,0.12)'>β</text>
      <text x='100' y='70' font-size='14' fill='rgba(0,0,52,0.12)'>Ω</text>
    </svg>
  `;

  const textureStyle = {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
  };

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 bg-background">
      <div className={`container mx-auto px-4 md:px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold">Exam <span style={{ color: '#adb5bd' }}>Categories</span></h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            We offer comprehensive coaching for a wide range of exams. Find your path to success by exploring our categories below.
          </p>
        </div>
        <Card
            className={`relative overflow-hidden shadow-lg h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0.5 ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ backgroundColor: '#dee2e6', animationDelay: '0.2s' }}
        >
            <div className="bg-background rounded-[.45rem] h-full" style={textureStyle}>
                <div className="flex flex-col lg:flex-row">
                    {/* Left Side */}
                    <div className="flex-1">
                    <CardContent className="p-6">
                        <Carousel
                        opts={{ align: "start", loop: true }}
                        className="w-full"
                        >
                        <CarouselContent>
                            {Array.from({ length: Math.ceil(popularProgramsEn.length / 6) }).map((_, slideIndex) => (
                            <CarouselItem key={slideIndex}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {popularProgramsEn.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                    <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm text-foreground bg-white/50 hover:bg-white/80 rounded-full border-primary hover:bg-primary/10 hover:text-primary">
                                    <Link href={program.href}>{program.name}</Link>
                                    </Button>
                                ))}
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
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
                        className="w-full"
                        >
                        <CarouselContent>
                            {Array.from({ length: Math.ceil(popularProgramsHi.length / 6) }).map((_, slideIndex) => (
                            <CarouselItem key={slideIndex}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {popularProgramsHi.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                    <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm text-foreground bg-white/50 hover:bg-white/80 rounded-full border-primary hover:bg-primary/10 hover:text-primary">
                                    <Link href={program.href}>{program.name}</Link>
                                    </Button>
                                ))}
                                </div>
                            </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
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
