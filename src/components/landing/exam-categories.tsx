
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
import { cn } from "@/lib/utils";
import { schoolPrograms, competitivePrograms, allPrograms } from "@/lib/courses";

const svgTexture = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><g fill='rgba(30,58,138,0.1)' font-family='Arial, sans-serif' font-size='50' font-weight='bold'><text x='25' y='60' transform='rotate(-20)'>π</text><text x='225' y='100' transform='rotate(15)'>Σ</text><text x='125' y='180'>∞</text><text x='275' y='310' transform='rotate(25)'>√</text><text x='40' y='300'>α</text><text x='310' y='200' transform='rotate(-10)'>∫</text><text x='100' y='50'>β</text><text x='190' y='270' transform='rotate(5)'>Δ</text></g></svg>`;

const textureStyle = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
  backgroundSize: '500px 500px',
};


const ExploreMoreDialog = ({ triggerText, programs, dialogTitle, dialogDescription }: { triggerText: string, programs: typeof allPrograms, dialogTitle: string, dialogDescription: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-blue-800 font-bold">
                    {triggerText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
              className={cn("w-[90vw] sm:max-w-sm border-0 rounded-2xl shadow-lg")}
              style={{ 
                backgroundColor: 'white', 
                ...textureStyle, 
              }}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold text-primary">{dialogTitle}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full">
                    <div className="grid grid-cols-2 gap-3 p-4">
                        {programs.map((program) => (
                            <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
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

  return (
    <section className="w-full pt-6 md:pt-12 pb-6 md:pb-12 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Exam</span> <span style={{ color: '#adb5bd' }}>Categories</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            We offer comprehensive coaching for a wide range of exams. Find your path to success by exploring our categories below.
          </p>
        </div>
        <Card
            className="transition-all duration-300 border-0 rounded-2xl group shadow-[0_0_25px_5px_rgba(30,58,138,0.2)] mx-auto"
            style={{ 
              maxWidth: '100%',
              backgroundColor: 'white',
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
              backgroundSize: '500px 500px',
              animation: 'float 10s ease-in-out infinite',
            }}
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
                        {Array.from({ length: Math.ceil(schoolPrograms.length / 6) }).map((_, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {schoolPrograms.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
                                <Link href={program.href}>{program.name}</Link>
                                </Button>
                            ))}
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    </Carousel>
                    <div className="mt-8 flex justify-center">
                        <ExploreMoreDialog 
                            triggerText="Explore More" 
                            programs={schoolPrograms} 
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
                        opts={{ align: "start" }}
                        className="w-full"
                    >
                    <CarouselContent>
                        {Array.from({ length: Math.ceil(competitivePrograms.length / 6) }).map((_, slideIndex) => (
                        <CarouselItem key={slideIndex}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {competitivePrograms.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
                                <Link href={program.href}>{program.name}</Link>
                                </Button>
                            ))}
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    </Carousel>
                    <div className="mt-8 flex justify-center">
                    <ExploreMoreDialog 
                            triggerText="Explore More" 
                            programs={competitivePrograms} 
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
