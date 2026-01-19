
'use client';

import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
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
            <div className="h-32 md:h-40 flex items-center justify-center">
              <Zap className="h-24 w-24 text-primary opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
