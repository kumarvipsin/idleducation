'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function TrustedPlatform() {
  return (
    <section className="w-full pt-6 md:pt-0 pb-6 md:pb-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mt-8">
              Bharat's Trusted &<br />Affordable<br />Educational Platform
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto lg:mx-0">
              Unlock your potential by signing up with IDL Education - The most affordable learning solution
            </p>
            <Button asChild size="lg" className="rounded-md bg-blue-600 hover:bg-blue-700">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="relative h-[280px] flex items-center justify-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
            
            {/* Character 1 */}
            <div className="absolute left-[10%] bottom-[10%] animate-float">
                <div className="relative w-[105px] h-[105px]">
                    <div className="absolute inset-[-14px] border-2 border-dashed border-gray-300 rounded-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                    <Image src="/teacher.png" alt="Amod Sir" width={105} height={105} className="rounded-full relative" data-ai-hint="teacher profile" />
                </div>
                 <div className="absolute bottom-7 -right-28 w-36 bg-white p-2 rounded-lg shadow-lg">
                    <p className="text-[0.6rem] leading-tight text-gray-800">IDL is where student learn with love and can grow with guidance</p>
                    <div className="absolute left-0 bottom-[-7px] w-0 h-0 border-l-[7px] border-l-transparent border-t-[7px] border-t-white"></div>
                </div>
            </div>

            {/* Character 2 */}
            <div className="absolute right-[5%] top-[10%] animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="relative w-[105px] h-[105px]">
                     <div className="absolute inset-[-14px] border-2 border-dashed border-gray-300 rounded-full animate-spin-slow-reverse">
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full"></div>
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
                    <Image src="/student.png" alt="Student" width={105} height={105} className="rounded-full relative" data-ai-hint="student profile" />
                </div>
                 <div className="absolute top-6 -left-32 w-36 bg-green-100 p-2 rounded-lg shadow-lg">
                    <p className="text-[0.6rem] leading-tight text-gray-800">Amod Sir, What is IDL?</p>
                    <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-green-100"></div>
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

const DotPattern = () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
);
