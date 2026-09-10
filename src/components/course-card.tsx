'use client';

/**
 * CourseCard — IDL Education Course Card Component.
 *
 * Implements refined visual balance:
 *  - Thumbnail (16:9) with central play overlay
 *  - Meta row: Orange Class left · Refined subtle language badge right
 *  - Course title: prominent, restrained line clamp
 *  - Detail row: BookOpen audience row
 *  - Date row: Calendar row ONLY if real start/end dates exist (hidden if no real dates)
 *  - Footer:
 *      LEFT:  FREE / 100% FREE (clean green status block)
 *      RIGHT: [ ▶ Free Video ] (subtle IDL light-blue tinted secondary CTA, never wraps)
 *      PREMIUM: [ Buy Now → ] (strong primary conversion action)
 */

import React from 'react';
import Image from 'next/image';
import { Play, Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Modern Colorful Academic Graduation Cap Icon (High Visibility & Contrast) ─
function AcademicCapIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* 1. Cap Base / Headband (Deep Navy Blue) */}
      <path
        d="M5.2 10.2V13.2C5.2 15 7.3 16.2 10 16.2C12.7 16.2 14.8 15 14.8 13.2V10.2C13.5 11.1 11.9 11.6 10 11.6C8.1 11.6 6.5 11.1 5.2 10.2Z"
        fill="#1E3A8A"
      />
      {/* 2. Base Highlight Accent */}
      <path
        d="M6.2 13.2C7.3 14.2 8.6 14.8 10 14.8C11.4 14.8 12.7 14.2 13.8 13.2C13.8 13.8 12.5 14.8 10 14.8C7.5 14.8 6.2 13.8 6.2 13.2Z"
        fill="#3B82F6"
      />
      {/* 3. Mortarboard Diamond Top (Vibrant Royal Blue) */}
      <path
        d="M10 3.2L1.5 7.4L10 11.6L18.5 7.4L10 3.2Z"
        fill="#2563EB"
      />
      {/* 4. Diamond 3D Light Sheen */}
      <path
        d="M10 3.2L1.5 7.4L10 8.8L15.6 6L10 3.2Z"
        fill="#60A5FA"
        opacity="0.65"
      />
      {/* 5. Center Golden Button */}
      <circle cx="10" cy="7.4" r="1.1" fill="#F59E0B" />
      {/* 6. Golden Tassel Cord (Hanging to the right) */}
      <path
        d="M10 7.4C12.5 7.8 15.2 8.8 15.8 10.5V13.6"
        stroke="#F59E0B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* 7. Golden Tassel Fringe */}
      <path
        d="M14.6 13.4H16.8L16.3 16.2C16.2 16.6 15.2 16.6 15.1 16.2L14.6 13.4Z"
        fill="#D97706"
      />
      <circle cx="15.7" cy="13.4" r="0.9" fill="#FBBF24" />
    </svg>
  );
}

export interface CourseCardProps {
  // ── Identity ──
  id: string;
  type: 'free' | 'premium';

  // ── Thumbnail ──
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  onThumbnailClick?: () => void;

  // ── Meta ──
  courseClass?: string;   // e.g. "Class 9"
  medium?: string;        // e.g. "Hindi", "Hindi Medium", "Hinglish", "English"
  subject?: string;

  // ── Title ──
  title: string;
  onTitleClick?: () => void;

  // ── Detail rows ──
  audience?: string;      // e.g. "For Class 9th UP Board"
  startDate?: string;     // e.g. "20 Apr, 2026"
  endDate?: string;       // e.g. "1 Apr, 2027"

  // ── Description (optional / fallback) ──
  description?: string;

  // ── Pricing (premium) ──
  price?: number;
  originalPrice?: number;

  // ── Actions ──
  isPurchased?: boolean;
  isProcessing?: boolean;
  onBuyNow?: () => void;
  renderExploreTrigger?: (children: React.ReactNode) => React.ReactNode;

  className?: string;
}

/** Format medium badge text to match Hindi / Hinglish / English badge style */
function formatMediumBadge(med?: string): string {
  if (!med) return 'HINGLISH';
  const lower = med.toLowerCase();
  if (lower.includes('hindi') && !lower.includes('english')) return 'हिन्दी';
  if (lower.includes('hinglish') || (lower.includes('hindi') && lower.includes('english'))) return 'HINGLISH';
  if (lower.includes('english')) return 'ENGLISH';
  return med.toUpperCase();
}

/** Format audience row: "For Class 9th UP Board" */
function formatAudience(audience?: string, courseClass?: string, subject?: string): string {
  if (audience && audience.trim()) {
    const trimmed = audience.trim();
    return trimmed.toLowerCase().startsWith('for ') ? trimmed : `For ${trimmed}`;
  }
  const cls = courseClass || 'Class 9th';
  const clsFormatted = cls.toLowerCase().includes('class') ? cls : `Class ${cls}`;
  const subj = subject ? ` ${subject}` : ' Students';
  return `For ${clsFormatted} ${subj}`;
}

/**
 * Format dates row: "Starts 20 Apr, 2026 · Ends 1 Apr, 2027"
 * Returns null if no real dates exist, so the row can be hidden completely.
 */
function formatDates(startDate?: string, endDate?: string): string | null {
  const s = startDate?.trim();
  const e = endDate?.trim();
  if (s && e) return `Starts ${s} · Ends ${e}`;
  if (s) return `Starts ${s}`;
  if (e) return `Ends ${e}`;
  return null;
}

export function CourseCard({
  type,
  thumbnailUrl,
  thumbnailAlt,
  onThumbnailClick,
  courseClass,
  medium,
  subject,
  title,
  onTitleClick,
  audience,
  startDate,
  endDate,
  price = 0,
  originalPrice = 0,
  isPurchased,
  isProcessing,
  onBuyNow,
  renderExploreTrigger,
  className,
}: CourseCardProps) {
  const discountPct =
    originalPrice > price && price > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : (originalPrice > 0 && price === 0 ? 100 : (originalPrice ? 50 : 0));

  const formattedDates = formatDates(startDate, endDate);

  return (
    <div
      className={cn(
        // Outer card shell: rounded-[14px], subtle border, white/dark bg, smooth elevation
        'group/card flex flex-col h-full',
        'bg-white dark:bg-[#0f172a]',
        'border border-slate-200/85 dark:border-slate-800',
        'rounded-[14px] overflow-hidden',
        'shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md',
        'transition-all duration-200',
        className
      )}
    >
      {/* ══════════════════════════════════════════
          1. COVER / THUMBNAIL (16:9)
      ══════════════════════════════════════════ */}
      <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 group/thumb">
        <button
          type="button"
          onClick={onThumbnailClick}
          className="absolute inset-0 w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
          aria-label={`${type === 'free' ? 'Watch' : 'View'} ${title}`}
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={thumbnailAlt || title}
              fill
              unoptimized
              loading="lazy"
              className="object-cover group-hover/thumb:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] flex items-center justify-center">
              <span className="text-white/20 font-black text-2xl tracking-wider">IDL</span>
            </div>
          )}

        </button>
      </div>

      {/* ══════════════════════════════════════════
          2. TEXT BODY
      ══════════════════════════════════════════ */}
      <div className="flex flex-col justify-between flex-1 p-3 sm:p-3.5 md:p-4 bg-white dark:bg-[#0f172a]">
        <div>
          {/* ── ROW 1: Class (Orange) LEFT · Refined Language Badge RIGHT ── */}
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-[12px] sm:text-[13.5px] font-bold text-[#E05600] dark:text-orange-500 leading-none truncate">
              {courseClass || 'Class 9'}
            </span>
            <span className="shrink-0 text-[9.5px] sm:text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/80 rounded-[8px] px-2 sm:px-2.5 py-0.5 uppercase tracking-wide leading-none">
              {formatMediumBadge(medium)}
            </span>
          </div>

          {/* ── ROW 2: Title ── */}
          <h3
            role={onTitleClick ? 'button' : undefined}
            onClick={onTitleClick}
            title={title}
            className={cn(
              'font-bold text-[13.5px] sm:text-[15.5px] text-[#0B1F4B] dark:text-white leading-[1.28] line-clamp-2 min-h-[35px] sm:min-h-[40px] mb-1.5',
              onTitleClick && 'cursor-pointer hover:text-[#1D4ED8] transition-colors'
            )}
          >
            {title}
          </h3>

          {/* ── ROW 3: Detail 1 (Audience/Class) ── */}
          <div className="mb-1 text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-[12px] font-medium leading-snug truncate block">
              {formatAudience(audience, courseClass, subject)}
            </span>
          </div>

          {/* ── ROW 4: Detail 2 (Calendar Icon: Shown ONLY if real dates exist) ── */}
          {formattedDates && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[1.75] text-slate-600 dark:text-slate-400" />
              <span className="text-[11px] sm:text-[12.5px] leading-snug truncate">
                {formattedDates}
              </span>
            </div>
          )}
        </div>

        {/* ── ROW 5: Bottom Price & Action Footer (Anchored, Flex-End) ── */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-2.5 flex items-center justify-between gap-2">
          {/* Status / Price Block Left */}
          <div className="shrink-0 flex flex-col justify-end">
            {type === 'premium' ? (
              price > 0 ? (
                <>
                  <div className="flex items-baseline gap-1 leading-none">
                    <span className="text-[17px] sm:text-[19px] md:text-[21px] font-bold text-slate-900 dark:text-white">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {originalPrice > price && (
                      <span className="text-[11.5px] sm:text-[13px] text-slate-400 dark:text-slate-500 line-through font-normal">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {discountPct > 0 && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[10.5px] sm:text-[12px] leading-none mt-1">
                      {discountPct}% OFF
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col justify-end">
                  <span className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tight">
                    FREE
                  </span>
                  <span className="text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold text-emerald-600/90 dark:text-emerald-400/90 leading-none mt-1 tracking-tight">
                    100% FREE
                  </span>
                </div>
              )
            ) : (
              /* Free course: clean green status block */
              <div className="flex flex-col justify-end">
                <span className="text-[16px] sm:text-[18px] md:text-[20px] font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tight">
                  FREE
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] md:text-[9px] font-bold text-emerald-600/90 dark:text-emerald-400/90 leading-none mt-1 tracking-tight">
                  100% FREE
                </span>
              </div>
            )}
          </div>

          {/* Action CTA Right */}
          <div className="shrink-0 flex items-center justify-end">
            {type === 'premium' ? (
              isPurchased ? (
                renderExploreTrigger ? (
                  renderExploreTrigger(
                    <button
                      type="button"
                      className="h-[34px] sm:h-[36px] md:h-[38px] px-3.5 sm:px-4 rounded-[8px] sm:rounded-[9px] border border-[#1D4ED8]/30 bg-[#EEF4FF] dark:bg-blue-950/30 text-[#1D4ED8] dark:text-blue-400 hover:bg-[#E0ECFF] text-[12.5px] sm:text-[13px] md:text-[13.5px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-none"
                      aria-label={`Explore ${title}`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>Explore</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    className="h-[34px] sm:h-[36px] md:h-[38px] px-3.5 sm:px-4 rounded-[8px] sm:rounded-[9px] border border-[#1D4ED8]/30 bg-[#EEF4FF] dark:bg-blue-950/30 text-[#1D4ED8] dark:text-blue-400 hover:bg-[#E0ECFF] text-[12.5px] sm:text-[13px] md:text-[13.5px] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-none"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Explore</span>
                  </button>
                )
              ) : (
                /* Premium Course: Strong Conversion Primary Action */
                <button
                  type="button"
                  onClick={onBuyNow}
                  disabled={isProcessing}
                  className="h-[34px] sm:h-[36px] md:h-[38px] px-4 sm:px-4.5 rounded-[8px] sm:rounded-[9px] bg-[#0B1F4B] hover:bg-[#1D4ED8] text-white text-[12.5px] sm:text-[13px] md:text-[13.5px] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60 whitespace-nowrap"
                  aria-label={`Buy ${title}`}
                >
                  <span>{isProcessing ? 'Processing…' : 'Buy Now'}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                </button>
              )
            ) : (
              /* Free Course: Subtle Secondary Action — Light IDL Blue Tint, Soft Border, Small Play Icon */
              <button
                type="button"
                onClick={onThumbnailClick}
                className="h-[34px] sm:h-[36px] md:h-[38px] px-3.5 sm:px-4 rounded-[8px] sm:rounded-[9px] border border-[#1D4ED8]/25 dark:border-blue-500/30 bg-[#EEF4FF] dark:bg-blue-950/30 text-[#1D4ED8] dark:text-blue-400 hover:bg-[#E0ECFF] hover:border-[#1D4ED8]/45 dark:hover:bg-blue-900/40 text-[12.5px] sm:text-[13px] md:text-[13.5px] font-bold whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-none shrink-0"
                aria-label={`Watch ${title}`}
              >
                <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Play Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
