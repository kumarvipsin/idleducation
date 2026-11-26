// src/app/admin/fees/layout.tsx
import React from 'react';

export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 bg-[#F8FAFC] dark:bg-slate-950 flex flex-col font-sans text-[#0B224D] dark:text-slate-100 antialiased">
      {children}
    </div>
  );
}
