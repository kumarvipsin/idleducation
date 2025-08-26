'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const popularProgramsEn = [
  "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIII", "CLASS IX", "CLASS X", "CLASS XI", "CLASS XII", "JEE", "NEET"
];
const popularProgramsHi = [
  "CUCT", "CBSE", "NIOS", "SSC", "BANK PO", "RRB", "CLAT", "GATE", "DEFENCE", "DELHI POLICE"
];

export function PopularPrograms() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-white"
            style={{ backgroundColor: '#1D1842' }}
          >
            <CardHeader className="text-center">
              <CardTitle className="bg-white/10 text-white py-2 px-4 rounded-md inline-block">ACADEMIC PROGRAMS</CardTitle>
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
                          <Button key={program} variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm bg-white/5 border-gray-600 hover:bg-white/10">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                    <CarouselPrevious className="static translate-y-0 text-white border-gray-600 hover:bg-white/10" />
                    <CarouselNext className="static translate-y-0 text-white border-gray-600 hover:bg-white/10" />
                </div>
              </Carousel>
              <div className="mt-16 flex justify-center">
                 <Button size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-accent text-accent-foreground">
                  EXPLORE MORE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 text-white"
            style={{ backgroundColor: '#1D1842' }}
          >
            <CardHeader className="text-center">
              <CardTitle className="bg-white/10 text-white py-2 px-4 rounded-md inline-block">TOP COURSES & CLASSES</CardTitle>
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
                           <Button key={program} variant="outline" className="h-12 font-semibold shadow-sm text-xs sm:text-sm bg-white/5 border-gray-600 hover:bg-white/10">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4">
                    <CarouselPrevious className="static translate-y-0 text-white border-gray-600 hover:bg-white/10" />
                    <CarouselNext className="static translate-y-0 text-white border-gray-600 hover:bg-white/10" />
                </div>
              </Carousel>
              <div className="mt-16 flex justify-center">
                 <Button size="lg" className="font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-accent text-accent-foreground">
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
