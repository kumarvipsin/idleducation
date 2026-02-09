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
        // Redesigned to remove the icon and match paragraph text size for consistency
        const headingMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (headingMatch) {
          return (
            <div key={index} className="mt-8 mb-4 group">
              <h2 className="text-base md:text-lg font-black text-foreground flex items-baseline gap-2">
                <span className="text-primary font-black shrink-0">
                  {headingMatch[1]}.
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
            return <h3 key={index} className="text-lg md:text-xl font-black text-foreground mt-8 mb-3 border-l-4 border-primary pl-4">{processText(trimmed.substring(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-xl md:text-2xl font-black text-primary mt-10 mb-4">{processText(trimmed.substring(3))}</h2>;
        }

        // Minimalist CTA Paving (Also Check :, Check :)
        // Designed to be very small and clean without a distracting background or outline by default
        // Now features a highlight effect only on interaction (hover/active) and functional linking
        if (trimmed.startsWith('Also Check :') || trimmed.startsWith('Check :')) {
          // Extract link if present. Supports http, www, and local paths /path
          const urlRegex = /(https?:\/\/[^\s,]+|www\.[^\s,]+|\/[a-zA-Z0-9\-\/._]+)/;
          const match = trimmed.match(urlRegex);
          let href = "#";
          let isExternal = false;
          
          if (match) {
            href = match[0];
            if (href.startsWith('www.')) {
                href = 'https://' + href;
                isExternal = true;
            } else if (href.startsWith('http')) {
                isExternal = true;
            }
          }

          return (
            <a 
              key={index} 
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="py-1.5 px-4 my-3 flex items-center gap-2 transition-all hover:bg-primary/[0.05] active:bg-primary/10 group cursor-pointer rounded-full w-fit max-w-full no-underline"
            >
              <div className="text-primary shrink-0 opacity-60">
                <Link2 className="w-3 h-3" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] md:text-xs font-semibold text-primary leading-none">
                    {processText(trimmed, true)}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-primary/30 group-hover:translate-x-0.5 transition-all" />
            </a>
          );
        }

        // Stylized Bullet Points with consistent circular icons
        if (trimmed.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-2 md:ml-4 py-1.5 group">
              <div className="bg-primary/10 p-1 rounded-full mt-1.5 shrink-0 group-hover:bg-primary transition-colors">
                <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:bg-white transition-colors" />
              </div>
              <span className="text-foreground/90 font-medium text-base md:text-lg leading-relaxed text-left flex-1 tracking-tight">
                {processText(trimmed.substring(2))}
              </span>
            </div>
          );
        }

        // Normal Paragraph with increased size and medium weight for focused reading
        return (
          <p key={index} className="leading-relaxed text-foreground/90 font-medium text-base md:text-lg text-left tracking-tight px-1">
            {processText(line)}
          </p>
        );
      })}
    </div>
  );
}

function processText(text: string, noLinks = false) {
  // Replacement for arrows and symbols
  let processed = text
    .replace(/->/g, '→')
    .replace(/=>/g, '⇉')
    .replace(/\(c\)/g, '©')
    .replace(/\(r\)/g, '®')
    .replace(/\(tm\)/g, '™');

  // Split by bold (**text**), highlight (==text==), and URLs if not disabled
  const regex = noLinks 
    ? /(\*\*.*?\*\*|==.*?==)/g 
    : /(\*\*.*?\*\*|==.*?==|(?:https?:\/\/|www\.)[^\s,]+)/g;
    
  const parts = processed.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    // High-impact Bold Styling
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // High-contrast Academic Highlight
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/20 px-1.5 py-0.5 rounded text-foreground font-bold mx-0.5 transition-colors">
          {part.slice(2, -2)}
        </mark>
      );
    }
    // URL detection (if not disabled)
    if (!noLinks && /^(https?:\/\/|www\.)/.test(part)) {
        const href = part.startsWith('http') ? part : `https://${part}`;
        return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80 transition-opacity">
                {part}
            </a>
        );
    }
    return part;
  });
}
