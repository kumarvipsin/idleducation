
'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const popularProgramsEn = [
  "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIII", "CLASS IX", "CLASS X", "CLASS XI", "CLASS XII", "JEE", "NEET"
];
const popularProgramsHi = [
  "कक्षा V", "कक्षा VI", "कक्षा VII", "कक्षा VIII", "कक्षा IX", "कक्षा X", "कक्षा XI", "कक्षा XII", "जेईई", "नीट"
];

export function PopularPrograms() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="bg-primary/10 text-primary py-2 px-4 rounded-md inline-block">ACADEMIC PROGRAMS</CardTitle>
            </CardHeader>
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
                          <Button key={program} variant="secondary" className="h-12 font-semibold shadow-md border border-primary/20 hover:bg-primary/10 hover:text-primary text-xs sm:text-sm">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                    <CarouselPrevious className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
                    <CarouselNext className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
                </div>
              </Carousel>
              <div className="mt-16 flex justify-center">
                 <Button size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[inset_0_0_0_2px_hsl(var(--primary))]">
                  EXPLORE MORE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="bg-primary/10 text-primary py-2 px-4 rounded-md inline-block">TOP COURSES & CLASSES</CardTitle>
            </CardHeader>
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
                          <Button key={program} variant="secondary" className="h-12 font-semibold shadow-md border border-primary/20 hover:bg-primary/10 hover:text-primary text-xs sm:text-sm">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                    <CarouselPrevious className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
                    <CarouselNext className="static translate-y-0 text-primary hover:bg-primary hover:text-primary-foreground" />
                </div>
              </Carousel>
              <div className="mt-16 flex justify-center">
                 <Button size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[inset_0_0_0_2px_hsl(var(--primary))]">
                  EXPLORE MORE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
