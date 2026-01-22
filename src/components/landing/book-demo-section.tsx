'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BookDemoSection() {
  return (
    <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Book your <span className="text-orange-500">Free Demo</span> session
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
            <div className="relative h-40 md:h-48 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4/5 h-3/5 bg-pink-100/50 dark:bg-pink-900/20 rounded-[50%] blur-2xl"></div>
                </div>
              <Image
                src="/idladv.png"
                alt="Students with a tablet"
                data-ai-hint="student teacher tablet"
                width={200}
                height={180}
                className="object-contain relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
