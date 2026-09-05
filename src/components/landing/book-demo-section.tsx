'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BookDemoSection() {
  return (
    <section className="w-full py-2 md:py-4 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-2xl bg-white dark:bg-card p-3 md:p-5 border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-3 text-left relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                Book your <span className="text-orange-500">Free Demo</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Get a free academic counselling session
              </p>
              <Button asChild className="h-9 px-5 rounded-[8px] bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link href="/book-demo">
                  Book a free demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-48 md:h-64 flex items-end justify-center">
                <div className="relative w-[280px] h-[280px] transform md:translate-y-[10%]">
                    <div className="absolute inset-1/4 bg-blue-200/50 dark:bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
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
        </div>
      </div>
    </section>
  );
}
