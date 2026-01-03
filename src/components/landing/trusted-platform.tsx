
'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function TrustedPlatform() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              India's <span className="text-primary">Trusted & Affordable</span> Educational Platform
            </h2>
            <p className="text-muted-foreground text-lg">
              Unlock your potential by signing up with IDL Education - The most affordable learning solution
            </p>
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-30"></div>
            
            {/* Character 1 */}
            <div className="absolute left-[10%] bottom-[10%] animate-float">
                <Image src="https://picsum.photos/seed/teacher/150/150" alt="Alakh Pandey" width={150} height={150} className="rounded-full" data-ai-hint="teacher profile" />
                 <div className="absolute bottom-20 -right-28 w-48 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg">
                    <p className="text-xs">PW is where students learn with love and can grow with guidance</p>
                    <div className="absolute left-0 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-primary"></div>
                </div>
            </div>

            {/* Character 2 */}
            <div className="absolute right-[10%] top-[10%] animate-float" style={{ animationDelay: '0.5s' }}>
                <Image src="https://picsum.photos/seed/student-lady/150/150" alt="Student" width={150} height={150} className="rounded-full" data-ai-hint="student profile" />
                 <div className="absolute top-8 -left-44 w-48 bg-white p-3 rounded-lg shadow-lg">
                    <p className="text-xs text-gray-800">Alakh Sir, What is PW?</p>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-white"></div>
                </div>
            </div>

             {/* Decorative dots */}
            <div className="absolute top-[15%] left-[20%] w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-[25%] right-[15%] w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
             <div className="absolute bottom-[10%] left-[45%] w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>

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
