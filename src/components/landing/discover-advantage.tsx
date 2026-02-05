'use client';

import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-2 md:py-4 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-white dark:bg-card border p-3 md:p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-3 text-left relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                Discover the <span className="text-orange-500">IDL Advantage</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Download the brochure to explore our programs, academic approach, and student
                support in detail.
              </p>
              <Button asChild className="h-9 px-5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all border-none">
                <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  IDL Brochure
                </Link>
              </Button>
            </div>
            <div className="relative h-40 md:h-56 flex items-center justify-center">
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
