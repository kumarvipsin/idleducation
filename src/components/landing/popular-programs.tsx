
'use client';

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const popularProgramsEn = [
  "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIII", "CLASS IX", "CLASS X", "CLASS XI", "CLASS XII"
];
const popularProgramsHi = [
  "कक्षा V", "कक्षा VI", "कक्षा VII", "कक्षा VIII", "कक्षा IX", "कक्षा X", "कक्षा XI", "कक्षा XII"
];

export function PopularPrograms() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Popular Academic Programs</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore our popular programs available in English and Hindi.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle>Popular Academic Programs (English)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <Image src="https://placehold.co/150x60.png" alt="English Program Logo" width={150} height={60} className="rounded-md" data-ai-hint="logo design" />
              </div>
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {Array.from({ length: Math.ceil(popularProgramsEn.length / 4) }).map((_, slideIndex) => (
                    <CarouselItem key={slideIndex}>
                      <div className="grid grid-cols-2 gap-4">
                        {popularProgramsEn.slice(slideIndex * 4, slideIndex * 4 + 4).map((program) => (
                          <Button key={program} variant="outline" className="h-12 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
              </Carousel>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:bg-accent/90">
                  VISIT ENGLISH WEBSITE
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle>Popular Academic Programs (Hindi)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <Image src="https://placehold.co/150x60.png" alt="Hindi Program Logo" width={150} height={60} className="rounded-md" data-ai-hint="vision logo" />
              </div>
               <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {Array.from({ length: Math.ceil(popularProgramsHi.length / 4) }).map((_, slideIndex) => (
                    <CarouselItem key={slideIndex}>
                      <div className="grid grid-cols-2 gap-4">
                        {popularProgramsHi.slice(slideIndex * 4, slideIndex * 4 + 4).map((program) => (
                          <Button key={program} variant="outline" className="h-12 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90">
                            {program}
                          </Button>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
              </Carousel>
              <div className="mt-8 flex justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:bg-accent/90">
                  हिंदी वेबसाइट पर जाएँ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
