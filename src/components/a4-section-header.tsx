'use client';

import React from 'react';

/** Institutional numbered section header using SVG circle rasterization so PDF/html2canvas centering matches DOM 1:1. */
export function A4SectionHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        className="shrink-0 block"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="9"
          r="8.25"
          fill="#FFFFFF"
          stroke="#D4D4D4"
          strokeWidth="1"
        />
        <text
          x="9"
          y="9.3"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#262626"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {step}
        </text>
      </svg>
      <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[#171717] leading-[1.3]">
        {title}
      </h3>
    </div>
  );
}
