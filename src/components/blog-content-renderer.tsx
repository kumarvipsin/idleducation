'use client';

import React from 'react';
import { Link2, ChevronRight, CheckCircle2 } from 'lucide-react';

/**
 * @fileOverview A sophisticated content renderer for IDL Blog posts.
 * Supports:
 * - Bold: **text**
 * - Highlight: ==text==
 * - Numbered Headings: 1. Title
 * - CTA Boxes: Check : or Also Check :
 * - Bullet Points: - Item
 * - Symbols: ->, =>, (c), (r), (tm)
 */

export function BlogContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={index} className="h-4" />;

        // Numbered Headings (e.g., 1. Proper Study Plan)
        const headingMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (headingMatch) {
          return (
            <h2 key={index} className="text-lg md:text-xl font-black text-primary mt-10 mb-4 flex items-center gap-4 group">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                {headingMatch[1]}
              </span>
              <span className="border-b-2 border-primary/10 group-hover:border-primary/30 transition-all pb-1">
                {processText(headingMatch[2])}
              </span>
            </h2>
          );
        }

        // Section Headings (standard markdown style)
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-xl md:text-2xl font-black text-foreground mt-8 mb-4 border-l-4 border-primary/20 pl-4">{processText(trimmed.substring(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-2xl md:text-3xl font-black text-primary mt-10 mb-4">{processText(trimmed.substring(3))}</h2>;
        }

        // Premium CTA Boxes (Also Check :, Check :)
        if (trimmed.startsWith('Also Check :') || trimmed.startsWith('Check :')) {
          return (
            <div key={index} className="border border-primary/20 p-2 my-3 rounded-md flex items-center gap-3 transition-all hover:bg-primary/[0.03] group cursor-pointer shadow-none">
              <div className="bg-primary text-white p-1 rounded-sm shrink-0">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <span className="text-xs md:text-sm font-bold text-primary tracking-tight">
                    {processText(trimmed)}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-primary/30 group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
            </div>
          );
        }

        // Stylized Bullet Points
        if (trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-4 ml-2 md:ml-6 py-2 group">
              <div className="bg-emerald-500/10 p-1.5 rounded-full mt-1 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:text-inherit transition-colors" />
              </div>
              <span className="text-foreground/80 font-medium text-lg md:text-xl leading-relaxed">
                {processText(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        // Normal Paragraph with refined spacing and sizing
        return (
          <p key={index} className="leading-relaxed text-foreground/80 font-medium text-lg md:text-xl text-left tracking-tight">
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
        <strong key={i} className="font-black text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Highlight Styling
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/30 px-2 py-0.5 rounded-lg text-foreground font-black shadow-sm mx-1 inline-block transform -rotate-1">
          {part.slice(2, -2)}
        </mark>
      );
    }
    return part;
  });
}
