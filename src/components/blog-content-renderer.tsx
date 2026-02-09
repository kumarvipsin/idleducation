'use client';

import React from 'react';
import { Link2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview A sophisticated content renderer for IDL Blog posts.
 * Optimized for a "focusable study style" with consistent visual hierarchy.
 */

export function BlogContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={index} className="h-2" />;

        // Numbered Headings (e.g., 1. Proper Study Plan)
        // Renders as a structured section header with a subtle divider
        const headingMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (headingMatch) {
          return (
            <div key={index} className="mt-12 mb-6 group">
              <h2 className="text-xl md:text-2xl font-black text-primary flex items-center gap-4 border-b border-primary/5 pb-4">
                <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                  {headingMatch[1]}
                </span>
                <span className="flex-1 tracking-tight">
                  {processText(headingMatch[2])}
                </span>
              </h2>
            </div>
          );
        }

        // Section Headings (standard markdown style)
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-lg md:text-xl font-black text-foreground mt-10 mb-4 border-l-4 border-primary pl-4">{processText(trimmed.substring(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-xl md:text-2xl font-black text-primary mt-12 mb-6">{processText(trimmed.substring(3))}</h2>;
        }

        // Premium CTA Boxes (Also Check :, Check :)
        // Designed to be focusable but integrated with the text flow
        if (trimmed.startsWith('Also Check :') || trimmed.startsWith('Check :')) {
          return (
            <div key={index} className="p-3 my-4 flex items-center gap-3 transition-all hover:bg-primary/[0.04] group cursor-pointer bg-muted/30 rounded-lg border-l-4 border-primary/40 w-full max-w-3xl border border-muted-foreground/5">
              <div className="bg-primary text-white p-1 rounded-md shrink-0 shadow-sm">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <span className="text-sm md:text-base font-bold text-primary tracking-tight">
                    {processText(trimmed)}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary/30 group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
          );
        }

        // Stylized Bullet Points
        if (trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-2 md:ml-6 py-2 group">
              <div className="bg-primary/10 p-1 rounded-full mt-1.5 shrink-0 group-hover:bg-primary transition-colors">
                <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:bg-white transition-colors" />
              </div>
              <span className="text-foreground/80 font-normal text-sm md:text-base leading-relaxed text-left flex-1 tracking-tight">
                {processText(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        // Normal Paragraph
        return (
          <p key={index} className="leading-relaxed text-foreground/80 font-normal text-sm md:text-base text-left tracking-tight px-1">
            {processText(line)}
          </p>
        );
      })}
    </div>
  );
}

function processText(text: string) {
  // Replacement for arrows and symbols
  let processed = text
    .replace(/->/g, '→')
    .replace(/=>/g, '⇒')
    .replace(/\(c\)/g, '©')
    .replace(/\(r\)/g, '®')
    .replace(/\(tm\)/g, '™');

  // Split by bold (**text**) and highlight (==text==)
  const parts = processed.split(/(\*\*.*?\*\*|==.*?==)/g);

  return parts.map((part, i) => {
    // Bold Styling
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Highlight Styling
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/20 px-1.5 py-0.5 rounded text-foreground font-semibold mx-0.5 transition-colors">
          {part.slice(2, -2)}
        </mark>
      );
    }
    return part;
  });
}
