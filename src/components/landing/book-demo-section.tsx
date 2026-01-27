'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BookDemoSection() {
  return (
    <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-2xl bg-white dark:bg-card p-4 md:p-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Book your <span className="text-orange-500">Free Demo</span>
              </h2>
              <p className="text-muted-foreground">
                Get a free academic counselling session
              </p>
              <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link href="/book-demo">
                  Book a free demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-56 md:h-64 flex items-end justify-center">
                <div className="relative w-[300px] h-[300px] transform translate-y-[10%]">
                    <div className="absolute inset-0 bg-dot-pattern opacity-30 rounded-lg"></div>
                    <Image
                        src="/idladv.png"
                        alt="Students with a tablet"
                        data-ai-hint="student teacher tablet"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
          </div>
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 800 400">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto" fill="orange">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            </defs>
            <circle cx="600" cy="200" r="10" fill="orange" fillOpacity="0.3">
                <animate attributeName="r" from="10" to="20" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle cx="600" cy="200" r="6" fill="orange" />
            <path
              d="M 590 200 Q 400 280 270 240"
              stroke="orange"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8, 8"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
