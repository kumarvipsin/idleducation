'use client';

import Image from 'next/image';

export function IndiaMap() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#e0f2fe] p-4 rounded-lg">
      <Image
        src="https://picsum.photos/800/600"
        alt="Map of India highlighting Delhi"
        data-ai-hint="India map Delhi"
        fill
        className="object-contain"
      />
    </div>
  );
}
