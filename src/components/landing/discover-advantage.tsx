
'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-4 md:py-7 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Discover the IDL Advantage
              </h2>
              <p className="text-blue-200">
                Download the brochure to explore our programs, academic approach, and student
                support in detail.
              </p>
              <Button asChild variant="secondary">
                <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Brochure
                </Link>
              </Button>
            </div>
            <div className="h-32 md:h-40 flex items-end justify-center">
              <Image
                src="/idladv.png"
                alt="IDL Advantage"
                data-ai-hint="education advantage"
                width={800}
                height={600}
                className="object-contain max-h-full w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
