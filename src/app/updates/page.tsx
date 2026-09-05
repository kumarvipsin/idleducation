'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdatesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?updates=open');
  }, [router]);

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-[#FAFBFD] dark:bg-slate-950 p-6">
      <div className="w-8 h-8 rounded-full border-2 border-[#102A68] border-t-transparent animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Loading Recent Updates...
      </p>
    </div>
  );
}
