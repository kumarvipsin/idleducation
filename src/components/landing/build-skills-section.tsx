'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";


const slideData = [
  {
    title: "EKLAVYA -> NEET 2026",
    batch: "Test Series December Batch",
    toppers: [
      {
        air: "293",
        name: "Damanpreet Singh",
        details: "General",
        image: "https://picsum.photos/seed/1/200/200",
        imageHint: "student portrait",
      },
      {
        air: "234",
        name: "Vedant Sakre",
        details: "99.99%ile in Physics",
        image: "https://picsum.photos/seed/2/200/200",
        imageHint: "student portrait",
      },
      {
        air: "413",
        name: "Shravani P Pore",
        details: "General",
        image: "https://picsum.photos/seed/3/200/200",
        imageHint: "student portrait",
      },
    ],
  },
  {
    title: "ARJUNA -> JEE 2026",
    batch: "Full Course November Batch",
    toppers: [
      {
        air: "123",
        name: "Rohan Verma",
        details: "General",
        image: "https://picsum.photos/seed/4/200/200",
        imageHint: "student portrait",
      },
      {
        air: "158",
        name: "Priya Sharma",
        details: "99.98%ile in Maths",
        image: "https://picsum.photos/seed/5/200/200",
        imageHint: "student portrait",
      },
      {
        air: "201",
        name: "Amit Patel",
        details: "General",
        image: "https://picsum.photos/seed/6/200/200",
        imageHint: "student portrait",
      },
    ],
  },
  {
    title: "LAKSHYA -> Class 12 Boards",
    batch: "Crash Course Jan Batch",
    toppers: [
      {
        air: "1",
        name: "Anika Singh",
        details: "99.8%",
        image: "https://picsum.photos/seed/7/200/200",
        imageHint: "student portrait",
      },
      {
        air: "2",
        name: "Karan Desai",
        details: "99.6%",
        image: "https://picsum.photos/seed/8/200/200",
        imageHint: "student portrait",
      },
      {
        air: "3",
        name: "Sneha Reddy",
        details: "99.4%",
        image: "https://picsum.photos/seed/9/200/200",
        imageHint: "student portrait",
      },
    ],
  },
];


export function BuildSkillsSection({ slides }: { slides: any[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
 
  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="w-full bg-white dark:bg-black py-2">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel 
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {slideData.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="bg-[#211612] text-white rounded-2xl p-4 md:p-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(255,255,255,0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` }}>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full relative z-10">
                    {/* Left side content */}
                    <div className="md:col-span-3 flex flex-col justify-center space-y-4">
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
                        <ArrowRight className="w-8 h-8" />
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl font-bold">{slide.batch}</p>
                      
                      <div className="relative inline-block self-start my-2">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-lg blur opacity-75"></div>
                        <div className="relative px-4 py-2 bg-red-700 rounded-lg">
                          <h2 className="text-lg font-bold">Curated Questions Closest<br />To the Actual Exam Paper</h2>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-2">
                          <p className="font-semibold">For Online Test Takers</p>
                          <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Open for 24 hrs | Starts 00:00 Midnight</p>
                          <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> All Tests Available for Reattempts</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                            <p>Online Test Series</p>
                            <div className="flex items-baseline gap-2">
                                <span className="line-through text-white/70">₹1999</span>
                                <span className="font-bold text-lg text-yellow-300">₹499</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-white/10 p-2 rounded-md">
                            <p>Offline + Online Test Series</p>
                            <div className="flex items-baseline gap-2">
                                <span className="line-through text-white/70">₹4999</span>
                                <span className="font-bold text-lg text-yellow-300">₹999</span>
                            </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                          <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                              <Link href="#">Buy Now</Link>
                          </Button>
                          <div className="flex items-center gap-1">
                              <Zap className="w-5 h-5 text-yellow-300"/>
                              <p className="text-xs font-semibold">Hurry<br/>Limited Time Offer</p>
                          </div>
                      </div>
                    </div>

                    {/* Right side content (Toppers) */}
                    <div className="md:col-span-2 flex items-center justify-center gap-2 md:gap-4 lg:gap-6 pt-8 md:pt-0">
                      {slide.toppers.map((topper) => (
                        <div key={topper.name} className="flex flex-col items-center text-center space-y-2">
                          <div className="relative w-[30px] h-[30px] md:w-[30px] md:h-[30px]">
                            <Image src={topper.image} alt={topper.name} data-ai-hint={topper.imageHint} fill className="rounded-full object-cover border-4 border-white/50" />
                          </div>
                          {topper.details.startsWith('99') && <Badge variant="destructive" className="bg-red-600 text-white font-bold text-xs">{topper.details}</Badge>}
                           <div className="bg-red-700 border-2 border-yellow-400 p-1 rounded-md px-3 shadow-lg">
                              <p className="text-sm font-bold">AIR {topper.air}</p>
                              <p className="text-xs text-white/80">{topper.details.startsWith('99') ? 'General' : topper.details}</p>
                          </div>
                          <p className="text-sm font-semibold">{topper.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
         {/* Slider dots */}
        <div className="flex justify-center gap-2 mt-4 relative z-20">
          {slideData.map((_, i) => (
            <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
