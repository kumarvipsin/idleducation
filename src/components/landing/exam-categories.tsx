
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
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
import { useEffect, useState, useCallback, useRef } from 'react';
import { cn } from "@/lib/utils";
import { getExamCategories } from "@/app/actions";
import type { TExamCategory } from "@/app/actions/types";
import { Skeleton } from "../ui/skeleton";
import { GcsImage } from '../gcs-image';
import Autoplay from "embla-carousel-autoplay";

const svgTexture = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><g fill='rgba(30,58,138,0.1)' font-family='Arial, sans-serif' font-size='50' font-weight='bold'><text x='25' y='60' transform='rotate(-20)'>π</text><text x='225' y='100' transform='rotate(15)'>Σ</text><text x='125' y='180'>∞</text><text x='275' y='310' transform='rotate(25)'>√</text><text x='40' y='300'>α</text><text x='310' y='200' transform='rotate(-10)'>∫</text><text x='100' y='50'>β</text><text x='190' y='270' transform='rotate(5)'>Δ</text></g></svg>`;

const textureStyle = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
  backgroundSize: '500px 500px',
};


const ExploreMoreDialog = ({ triggerText, programs, dialogTitle, dialogDescription }: { triggerText: string, programs: TExamCategory[], dialogTitle: string, dialogDescription: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-blue-800 font-bold">
                    {triggerText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
              className={cn("w-full h-full max-h-screen sm:max-w-lg sm:h-auto border-0 rounded-none sm:rounded-2xl shadow-lg")}
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
                            <Button key={program.id} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
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
  const [categories, setCategories] = useState<TExamCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [schoolApi, setSchoolApi] = useState<CarouselApi>()
  const [competitiveApi, setCompetitiveApi] = useState<CarouselApi>()
  const [schoolCurrent, setSchoolCurrent] = useState(0)
  const [competitiveCurrent, setCompetitiveCurrent] = useState(0)

  const competitiveAutoplay = useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const result = await getExamCategories();
      if (result.success && result.data) {
        setCategories(result.data as TExamCategory[]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (schoolApi) {
      setSchoolCurrent(schoolApi.selectedScrollSnap());
      schoolApi.on("select", () => setSchoolCurrent(schoolApi.selectedScrollSnap()));
    }
    if (competitiveApi) {
      setCompetitiveCurrent(competitiveApi.selectedScrollSnap());
      competitiveApi.on("select", () => setCompetitiveCurrent(competitiveApi.selectedScrollSnap()));
    }
  }, [schoolApi, competitiveApi]);

  const schoolPrograms = categories.filter(c => c.group === 'school');
  const competitivePrograms = categories.filter(c => c.group === 'competitive');
  
  const schoolSlidesCount = Math.ceil(schoolPrograms.length / 6);
  const competitiveSlidesCount = Math.ceil(competitivePrograms.length / 6);

  const renderSkeleton = () => (
    <div className="flex-1">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
        <div className="mt-8 flex justify-center gap-2">
           {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-2 w-2 rounded-full" />)}
        </div>
      </CardContent>
    </div>
  );

  return (
    <section className="w-full pt-16 md:pt-20 pb-16 md:pb-20 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">
            Exam Categories
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
                {loading ? renderSkeleton() : (
                    <div className="flex-1">
                        <CardContent className="p-6">
                            <Carousel setApi={setSchoolApi} opts={{ align: "start", loop: true }} className="w-full">
                                <CarouselContent>
                                {Array.from({ length: schoolSlidesCount }).map((_, slideIndex) => (
                                    <CarouselItem key={slideIndex}>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {schoolPrograms.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                            <Button key={program.id} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
                                            <Link href={program.href}>{program.name}</Link>
                                            </Button>
                                        ))}
                                        </div>
                                    </CarouselItem>
                                ))}
                                </CarouselContent>
                            </Carousel>
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: schoolSlidesCount }).map((_, i) => (
                                    <button
                                    key={i}
                                    onClick={() => schoolApi?.scrollTo(i)}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all",
                                        schoolCurrent === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                                    )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </div>
                )}
                
                <Separator orientation="vertical" className="h-auto hidden lg:block bg-border" />
                <Separator orientation="horizontal" className="block lg:hidden bg-border" />

                {/* Right Side */}
                 {loading ? renderSkeleton() : (
                    <div className="flex-1">
                        <CardContent className="p-6">
                            <Carousel setApi={setCompetitiveApi} plugins={[competitiveAutoplay.current]} opts={{ align: "start", loop: true }} className="w-full">
                            <CarouselContent>
                                {Array.from({ length: competitiveSlidesCount }).map((_, slideIndex) => (
                                <CarouselItem key={slideIndex}>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {competitivePrograms.slice(slideIndex * 6, slideIndex * 6 + 6).map((program) => (
                                        <Button key={program.id} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm rounded-lg bg-white/50 border-primary/20 text-blue-900 hover:bg-primary/10 hover:text-primary transition-colors">
                                        <Link href={program.href}>{program.name}</Link>
                                        </Button>
                                    ))}
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            </Carousel>
                             <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: competitiveSlidesCount }).map((_, i) => (
                                    <button
                                    key={i}
                                    onClick={() => competitiveApi?.scrollTo(i)}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all",
                                        competitiveCurrent === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                                    )}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </div>
                )}
            </div>
        </Card>
      </div>
    </section>
  );
}
