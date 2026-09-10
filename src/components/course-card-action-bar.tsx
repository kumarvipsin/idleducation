'use client';

import { Play, ShoppingCart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * CourseCardActionBar
 *
 * Unified action bar for the bottom of all IDL course cards.
 * LEFT:  Medium info (language of instruction)
 * RIGHT: Context-aware CTA — "Free Video" (green) | "Buy Now" (orange) | "Explore" (blue)
 *
 * Use the same component for Free and Premium cards;
 * only `type` and `onAction` differ.
 */

interface CourseCardActionBarProps {
  /** Language / medium of instruction e.g. "Hindi / English" */
  medium?: string;
  /** Card variant – drives CTA color & label */
  type: 'free' | 'premium' | 'purchased';
  /** Click handler for the CTA */
  onAction?: () => void;
  /** Disable the CTA (e.g. while processing) */
  disabled?: boolean;
  /** Optional override label for the CTA */
  label?: string;
  className?: string;
}

export function CourseCardActionBar({
  medium,
  type,
  onAction,
  disabled,
  label,
  className,
}: CourseCardActionBarProps) {
  // ── CTA config by type ──────────────────────────────────────────
  const cta = {
    free: {
      label: label ?? 'Play Now',
      icon: <Play className="w-[11px] h-[11px] sm:w-3 sm:h-3 fill-current shrink-0" />,
      classes: [
        // Surface — very light green tint
        'bg-emerald-50 dark:bg-emerald-950/30',
        // Border — subtle green
        'border border-emerald-500/25 dark:border-emerald-500/20',
        // Text — IDL green
        'text-emerald-700 dark:text-emerald-400',
        // Hover
        'hover:bg-emerald-100 dark:hover:bg-emerald-950/50',
        'hover:border-emerald-500/40 dark:hover:border-emerald-500/35',
      ],
    },
    premium: {
      label: label ?? 'Buy Now',
      icon: <ShoppingCart className="w-[11px] h-[11px] sm:w-3 sm:h-3 shrink-0" />,
      classes: [
        'bg-orange-50 dark:bg-orange-950/30',
        'border border-orange-500/25 dark:border-orange-500/20',
        'text-orange-600 dark:text-orange-400',
        'hover:bg-orange-100 dark:hover:bg-orange-950/50',
        'hover:border-orange-500/40 dark:hover:border-orange-500/35',
      ],
    },
    purchased: {
      label: label ?? 'Explore',
      icon: <Play className="w-[11px] h-[11px] sm:w-3 sm:h-3 fill-current shrink-0" />,
      classes: [
        'bg-blue-50 dark:bg-blue-950/30',
        'border border-blue-500/25 dark:border-blue-500/20',
        'text-blue-700 dark:text-blue-400',
        'hover:bg-blue-100 dark:hover:bg-blue-950/50',
        'hover:border-blue-500/40 dark:hover:border-blue-500/35',
      ],
    },
  }[type];

  const showArrow = type !== 'free'; // arrow for Buy Now / Explore; play icon handles free

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'pt-1.5 sm:pt-2 mt-2 sm:mt-2',
        'border-t border-slate-100 dark:border-slate-800',
        className
      )}
    >
      {/* LEFT — Medium info */}
      <div className="flex items-center gap-1 min-w-0 overflow-hidden flex-1 pr-1.5">
        <span className="shrink-0 text-[9px] sm:text-[9.5px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 leading-none">
          Medium:
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate leading-none">
          {medium || 'Not Specified'}
        </span>
      </div>

      {/* RIGHT — CTA button */}
      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className={cn(
          // Layout
          'flex items-center gap-1 shrink-0',
          'whitespace-nowrap',
          // Size — compact, never wraps
          'h-[26px] sm:h-7',
          'px-1.5 sm:px-2',
          'rounded-[8px]',
          // Typography
          'text-[10px] sm:text-[11px] font-semibold',
          // Transitions — no scale, no glow
          'transition-colors duration-150',
          // Disabled
          'disabled:opacity-50 disabled:pointer-events-none',
          // Shadow — none
          'shadow-none',
          ...cta.classes
        )}
        aria-label={cta.label}
      >
        {cta.icon}
        <span>{cta.label}</span>
        {showArrow && (
          <ArrowRight className="w-[10px] h-[10px] shrink-0 opacity-70" />
        )}
      </button>
    </div>
  );
}
