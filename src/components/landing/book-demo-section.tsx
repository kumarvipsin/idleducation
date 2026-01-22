'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function BookDemoSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Book your <span className="text-orange-500">Free Demo</span> session
            </h2>
            <p className="text-muted-foreground text-lg">
              Get a free academic counselling session
            </p>
            <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              <Link href="/book-demo">Book a free demo</Link>
            </Button>
          </div>
          <div className="relative h-80 flex items-center justify-center">
            <Image
              src="/idladv.png"
              alt="Students with a tablet"
              data-ai-hint="student teacher tablet"
              width={450}
              height={360}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
