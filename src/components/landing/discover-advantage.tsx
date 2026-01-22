'use client';

import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-white dark:bg-card border p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Discover the <span className="text-orange-500">IDL Advantage</span>
              </h2>
              <p className="text-muted-foreground">
                Download the brochure to explore our programs, academic approach, and student
                support in detail.
              </p>
              <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Brochure
                </Link>
              </Button>
            </div>
            <div className="relative h-56 md:h-64 flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1622223373286-4db475b3b9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxicm9jaHVyZSUyMHxlbnwwfHx8fDE3NjkwOTgxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="IDL Education Brochure"
                    data-ai-hint="education brochure"
                    fill
                    className="object-cover rounded-md shadow-lg"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
