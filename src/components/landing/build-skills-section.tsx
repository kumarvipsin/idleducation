'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import Link from "next/link";
import { ArrowRight, Check, Plus, Zap } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react"

export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
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
    <section className="relative w-full py-12 bg-gray-100 dark:bg-black">
      <Carousel 
        setApi={setApi}
        opts={{ loop: false }}
        plugins={[autoplayPlugin.current]} 
        className="w-full"
      >
        <CarouselContent className="">
          <CarouselItem>
            <div className="px-4 md:px-6">
              <div className="relative bg-gradient-to-br from-[#2a1a1a] via-[#1a0c0c] to-black text-white rounded-2xl p-6 md:p-8 w-full max-w-6xl mx-auto flex items-center shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-red-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full relative z-10">
                  {/* Left Side */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center gap-2">
                       <p className="text-3xl md:text-4xl font-black tracking-wider text-white">EKLAVYA <span className="text-red-500">-&gt;</span> NEET 2026</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white/90 -mt-2">Test Series December Batch</h2>
                    
                    <div className="bg-[#d13b3b] text-white p-2 rounded-md inline-block shadow-lg">
                        <p className="font-bold text-sm md:text-base">Curated Questions Closest</p>
                        <p className="text-xs md:text-sm">To the Actual NEET Paper</p>
                    </div>

                    <div className="text-sm space-y-2 pt-2">
                        <p className="font-bold text-white">For Online Test Takers</p>
                        <p className="flex items-center gap-2"><Plus className="w-4 h-4 bg-yellow-400 text-black rounded-full p-0.5" /> Open for 24 hrs | Starts 00:00 Midnight</p>
                        <p className="flex items-center gap-2"><Plus className="w-4 h-4 bg-yellow-400 text-black rounded-full p-0.5" /> All Tests Available for Reattempts</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-3 rounded-lg">
                        <div>
                            <p className="text-white/80">Online Test Series</p>
                            <p><span className="line-through text-white/50">₹1999</span> <span className="text-xl font-bold text-yellow-400">₹499</span></p>
                        </div>
                        <div>
                            <p className="text-white/80">Offline + Online Test Series</p>
                            <p><span className="line-through text-white/50">₹4999</span> <span className="text-xl font-bold text-yellow-400">₹999</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Buy Now</Button>
                        <div className="flex items-center gap-1 text-xs">
                            <Zap className="w-4 h-4 text-yellow-400"/>
                            <p>Hurry <br/>Limited Time Offer</p>
                        </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="md:col-span-2 flex justify-around items-end gap-2 md:gap-4">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Image src="https://picsum.photos/seed/damanpreet/150/150" width={80} height={80} alt="Damanpreet Singh" data-ai-hint="student headshot" className="rounded-full border-4 border-orange-400" />
                        <div className="bg-[#d13b3b] text-white p-1 px-3 rounded-md text-center shadow-lg">
                            <p className="text-sm font-bold">AIR 293</p>
                            <p className="text-[0.6rem] -mt-1">General</p>
                        </div>
                        <p className="text-xs font-semibold">Damanpreet Singh</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 text-center mb-4">
                        <div className="bg-white text-blue-600 px-2 py-0.5 text-xs rounded-full font-bold mb-1">99.99%ile in Physics</div>
                        <Image src="https://picsum.photos/seed/vedant/150/150" width={100} height={100} alt="Vedant Sakre" data-ai-hint="student headshot" className="rounded-full border-4 border-orange-400" />
                        <div className="bg-[#d13b3b] text-white p-1 px-4 rounded-md text-center shadow-lg">
                            <p className="text-base font-bold">AIR 234</p>
                            <p className="text-[0.6rem] -mt-1">General</p>
                        </div>
                        <p className="text-sm font-semibold">Vedant Sakre</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Image src="https://picsum.photos/seed/shravani/150/150" width={80} height={80} alt="Shravani P Pore" data-ai-hint="student headshot" className="rounded-full border-4 border-orange-400" />
                        <div className="bg-[#d13b3b] text-white p-1 px-3 rounded-md text-center shadow-lg">
                            <p className="text-sm font-bold">AIR 413</p>
                            <p className="text-[0.6rem] -mt-1">General</p>
                        </div>
                        <p className="text-xs font-semibold">Shravani P Pore</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {[...Array(1)].map((_, i) => (
                <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                    "h-1.5 w-6 rounded-full transition-all duration-300",
                    current === i ? "bg-white" : "bg-white/50"
                )}
                />
            ))}
      </div>
    </section>
  );
}
