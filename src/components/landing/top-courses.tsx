
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

const courses = [
  {
    title: "UPSC Foundation Course (Online)",
    bgColor: "bg-[#f4a261]",
    textColor: "text-white",
    buttons: [
      { text: "ENGLISH", href: "#" },
      { text: "हिन्दी", href: "#" },
    ],
  },
  {
    title: "UPSC Civil Services: Prelims Test Series",
    bgColor: "bg-[#2a9d8f]",
    textColor: "text-white",
    buttons: [
      { text: "ENGLISH", href: "#" },
      { text: "हिन्दी", href: "#" },
    ],
  },
  {
    title: "Drishti Publications' books and magazines on Amazon",
    bgColor: "bg-[#8367c7]",
    textColor: "text-white",
    buttons: [{ text: "VIEW MORE", href: "#" }],
  },
  {
    title: "हिंदी साहित्य (वैकल्पिक): ऑनलाइन कोर्स",
    bgColor: "bg-[#f4a261]",
    textColor: "text-white",
    buttons: [{ text: "VIEW MORE", href: "#" }],
  },
  {
    title: "Advanced Mathematics Course",
    bgColor: "bg-teal-500",
    textColor: "text-white",
    buttons: [{ text: "VIEW MORE", href: "#" }],
  }
];

export function TopCourses() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {courses.map((course, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <div className="p-1 h-full">
                  <Card className={`flex flex-col h-full rounded-lg shadow-lg overflow-hidden ${course.bgColor}`}>
                    <CardContent className="p-6 flex flex-col flex-grow items-center justify-center text-center">
                      <h3 className={`text-xl font-semibold mb-8 min-h-[6rem] flex items-center ${course.textColor}`}>
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-auto">
                        {course.buttons.map((button) => (
                          <Button key={button.text} asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-gray-300">
                            <Link href={button.href}>{button.text}</Link>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex md:left-[-2rem] bg-white text-black border-gray-300" />
          <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex md:right-[-2rem] bg-white text-black border-gray-300" />
        </Carousel>
      </div>
    </section>
  );
}
