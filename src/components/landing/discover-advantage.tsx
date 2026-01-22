'use client';

import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-blue-100 dark:bg-blue-900/20 p-4 md:p-6">
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
            <div className="h-32 md:h-40 flex items-center justify-center">
              <Image
                src="https://www.lamission.edu/sites/lamc.edu/files/styles/inline_image_1100w_/public/2025-05/LAMC-Catalog-Cover.jpg?itok=G6IILm53"
                alt="IDL Education Brochure"
                data-ai-hint="education brochure"
                width={150}
                height={180}
                className="object-contain rounded-md shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
