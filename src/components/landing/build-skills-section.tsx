'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Check } from "lucide-react";
import placeholderImages from '@/app/lib/placeholder-images.json';
import { Badge } from "../ui/badge";

const toppers = [
  {
    air: "293",
    name: "Damanpreet Singh",
    details: "General",
    image: placeholderImages.topper1.src,
    imageHint: placeholderImages.topper1.hint,
  },
  {
    air: "234",
    name: "Vedant Sakre",
    details: "99.99%ile in Physics",
    image: placeholderImages.topper2.src,
    imageHint: placeholderImages.topper2.hint,
  },
  {
    air: "413",
    name: "Shravani P Pore",
    details: "General",
    image: placeholderImages.topper3.src,
    imageHint: placeholderImages.topper3.hint,
  },
];

export function BuildSkillsSection({ slides }: { slides: any[] }) {
  return (
    <section className="w-full bg-[#f8f9fa] dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-[#211612] text-white rounded-2xl p-6 md:p-10" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgba(255,255,255,0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")` }}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full relative z-10">
            {/* Left side content */}
            <div className="md:col-span-3 flex flex-col justify-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
                <ArrowRight className="w-8 h-8" />
                {'EKLAVYA -> NEET 2026'}
              </h1>
              <p className="text-xl md:text-2xl font-bold">Test Series December Batch</p>
              
              <div className="relative inline-block self-start my-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-lg blur opacity-75"></div>
                <div className="relative px-4 py-2 bg-red-700 rounded-lg">
                  <h2 className="text-lg font-bold">Curated Questions Closest<br />To the Actual NEET Paper</h2>
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
              {toppers.map((topper) => (
                <div key={topper.name} className="flex flex-col items-center text-center space-y-2">
                  <div className="relative w-14 h-14 md:w-20 md:h-20">
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
          {/* Slider dots */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-6 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}