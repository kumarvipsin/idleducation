// src/app/admin/fees/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google';
import { FeeFontScope } from './fee-font-scope';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${inter.className} min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased`}
      style={{
        fontFamily: `'Inter', ${inter.style.fontFamily}, sans-serif`,
        ['--font-sans' as string]: `'Inter', ${inter.style.fontFamily}, sans-serif`,
      }}
    >
      <FeeFontScope
        fontFamily={inter.style.fontFamily}
        variableClass={inter.variable}
        interClass={inter.className}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body.fee-management-font-inter,
            body.fee-management-font-inter * {
              font-family: 'Inter', var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
