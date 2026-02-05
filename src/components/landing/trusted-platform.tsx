'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function TrustedPlatform() {
  return (
    <section className="w-full py-6 md:py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bharat's Trusted & Affordable Learning Platform
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-medium">
              Unlock your potential by signing up with IDL Education - The most affordable learning solution
            </p>
            <Button asChild size="sm" className="rounded-full font-bold bg-orange-500 hover:bg-orange-600 text-white border-none">
              <Link href="/book-demo">Book a Demo</Link>
            </Button>
          </div>
          <div className="relative h-[240px] md:h-[280px] flex items-center justify-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
            
            {/* Character 1 - Teacher */}
            <div className="absolute left-[5%] bottom-[10%] animate-float">
                <div className="relative w-[90px] h-[90px] md:w-[105px] md:h-[105px]">
                    <div className="absolute inset-[-12px] border-2 border-dashed border-gray-300 rounded-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                    <Image src="/teacher.png" alt="Amod Sir" width={105} height={105} className="rounded-full relative" data-ai-hint="teacher profile" />
                </div>
                 <div className="absolute bottom-6 -right-32 md:-right-40 w-40 md:w-56 bg-white text-gray-800 p-2 rounded-lg shadow-lg border">
                    <p className="text-[9px] md:text-[10px] leading-tight text-primary font-medium">IDL is where dreams are encouraged, effort is empowered, and every student is guided to rise with confidence and purpose. 💫</p>
                    <div className="absolute left-0 bottom-[-7px] w-0 h-0 border-l-[7px] border-l-transparent border-t-[7px] border-t-white"></div>
                </div>
            </div>

            {/* Character 2 - Student */}
            <div className="absolute right-[5%] top-[10%] animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="relative w-[90px] h-[90px] md:w-[105px] md:h-[105px]">
                     <div className="absolute inset-[-12px] border-2 border-dashed border-gray-300 rounded-full animate-spin-slow-reverse">
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full"></div>
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
                    <Image src="/student.png" alt="Student" width={105} height={105} className="rounded-full relative" data-ai-hint="student profile" />
                </div>
                 <div className="absolute top-4 -left-28 md:-left-32 w-32 md:w-36 bg-green-50 p-2 rounded-lg shadow-lg border border-green-100">
                    <p className="text-[9px] md:text-[10px] leading-tight text-gray-800 font-medium">Amod Sir, What is IDL?</p>
                    <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-green-50"></div>
                </div>
            </div>

             {/* Decorative dots */}
            <div className="absolute top-[15%] left-[20%] w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-[25%] right-[15%] w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
             <div className="absolute bottom-[10%] left-[45%] w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>

          </div>
        </div>
      </div>
    </section>
  );
}