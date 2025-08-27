
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

const popularProgramsEn = [
  { name: "CLASS V", href: "/school" },
  { name: "CLASS VI", href: "/school" },
  { name: "CLASS VII", href: "/school" },
  { name: "CLASS VIII", href: "/school" },
  { name: "CLASS IX", href: "/school" },
  { name: "CLASS X", href: "/school" },
  { name: "CLASS XI", href: "/school" },
  { name: "CLASS XII", href: "/school" },
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

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            PW is preparing students for 35+ exam categories. Scroll down to find the one you are preparing for
          </p>
        </div>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-muted/20">
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
                            <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm">
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
                  <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                    <Link href="/school">EXPLORE MORE</Link>
                  </Button>
                </div>
              </CardContent>
            </div>
            
            {/* Divider */}
            <Separator orientation="vertical" className="h-auto hidden lg:block" />
            <Separator orientation="horizontal" className="block lg:hidden" />

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
                            <Button key={program.name} asChild variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm">
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
                  <Button asChild size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                    <Link href="/">EXPLORE MORE</Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
