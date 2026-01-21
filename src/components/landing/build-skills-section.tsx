
'use client';

import Image from "next/image";

export function BuildSkillsSection() {
  return (
    <section className="w-full bg-white dark:bg-black py-2">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden">
            <Image 
                src="https://picsum.photos/seed/banner/1920/640"
                alt="IDL Education Banner"
                data-ai-hint="education banner"
                fill
                className="object-cover"
            />
        </div>
      </div>
    </section>
  );
}
