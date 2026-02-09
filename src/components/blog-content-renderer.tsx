'use client';

import React from 'react';
import { Link2, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview A sophisticated content renderer for IDL Blog posts.
 * Optimized for a "focusable study style" with consistent visual hierarchy.
 * Now includes centered headings with curves and sub-topic arrow indicators.
 */

export function BlogContentRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') return <div key={index} className="h-2" />;

        // 1. Centered Heading with Underline Curve (# Title)
        if (trimmed.startsWith('# ')) {
          return (
            <div key={index} className="py-8 text-center animate-fade-in-up">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground relative inline-block">
                <span className="relative z-10">{processText(trimmed.substring(2))}</span>
                <div className="absolute -bottom-2 left-0 w-full h-3 z-0">
                  <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                  </svg>
                </div>
              </h1>
            </div>
          );
        }

        // 2. Numbered Headings (e.g., 1. Proper Study Plan)
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
        if (trimmed.startsWith('Also Check :') || trimmed.startsWith('Check :')) {
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

        // 3. Sub-topic Arrow Indicator (-> Item)
        if (trimmed.startsWith('-> ')) {
          return (
            <div key={index} className="flex items-start gap-3 ml-8 md:ml-12 py-1 group animate-fade-in-up">
              <ArrowRight className="w-3 h-3 text-primary/60 shrink-0 mt-1.5 group-hover:translate-x-0.5 transition-transform" />
              <span className="text-muted-foreground font-bold text-sm md:text-base leading-relaxed text-left flex-1 tracking-tight">
                {processText(trimmed.substring(3))}
              </span>
            </div>
          );
        }

        // Stylized Bullet Points (- Item)
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

        // Normal Paragraph
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
  let processed = text
    .replace(/->/g, '→')
    .replace(/=>/g, '⇉')
    .replace(/\(c\)/g, '©')
    .replace(/\(r\)/g, '®')
    .replace(/\(tm\)/g, '™');

  const regex = noLinks 
    ? /(\*\*.*?\*\*|==.*?==)/g 
    : /(\*\*.*?\*\*|==.*?==|(?:https?:\/\/|www\.)[^\s,]+)/g;
    
  const parts = processed.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/20 px-1.5 py-0.5 rounded text-foreground font-bold mx-0.5 transition-colors">
          {part.slice(2, -2)}
        </mark>
      );
    }
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
