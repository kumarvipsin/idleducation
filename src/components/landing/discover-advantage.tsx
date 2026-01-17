'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-7 md:py-14 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Discover the IDL Advantage
              </h2>
              <p className="text-muted-foreground">
                Download the brochure to explore our programs, academic approach, and student
                support in detail.
              </p>
              <Button asChild>
                <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Brochure
                </Link>
              </Button>
            </div>
            <div className="relative h-40 md:h-48">
              <Image
                src="https://img.freepik.com/premium-vector/happy-indian-student-girl-cartoon-character_713739-16.jpg"
                alt="Happy Student"
                data-ai-hint="happy student illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
