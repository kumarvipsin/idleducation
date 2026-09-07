'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSocialMediaSettings, type TSocialMediaSettings } from '@/app/actions/social-media';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ============================================================
// OFFICIAL RECOGNIZABLE SVG BRAND ICONS (Rule 1 & Rule 41)
// No emojis, lightweight, scalable, correct stroke & fill
// ============================================================

export function InstagramIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function TwitterXIcon({ className = "w-[17px] h-[17px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export interface TSocialItem {
  id: 'instagram' | 'youtube' | 'facebook' | 'twitter';
  name: string;
  url: string;
  ariaLabel: string;
  icon: React.ReactNode;
  brandHoverColor: string;
  brandBgHover: string;
}

// In-memory client cache to share settings across Header, Mobile Drawer, and Footer
let cachedSettings: TSocialMediaSettings | null = null;
let fetchPromise: Promise<TSocialMediaSettings | null> | null = null;

export function useSocialMediaLinks() {
  const [items, setItems] = useState<TSocialItem[]>(() => {
    if (cachedSettings) return buildSocialItems(cachedSettings);
    return [];
  });
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let isMounted = true;

    if (cachedSettings) {
      setItems(buildSocialItems(cachedSettings));
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getSocialMediaSettings().then((res) => {
        if (res.success && res.data) {
          cachedSettings = res.data;
          return res.data;
        }
        return null;
      });
    }

    fetchPromise.then((data) => {
      if (isMounted) {
        if (data) {
          setItems(buildSocialItems(data));
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, loading };
}

function buildSocialItems(settings: TSocialMediaSettings): TSocialItem[] {
  const list: TSocialItem[] = [];

  // Preferred order: Instagram -> YouTube -> Facebook (Rule 2)
  if (settings.instagram?.active && settings.instagram?.url?.trim()) {
    list.push({
      id: 'instagram',
      name: 'Instagram',
      url: settings.instagram.url.trim(),
      ariaLabel: 'Visit IDL Education on Instagram',
      icon: <InstagramIcon className="w-[18px] h-[18px]" />,
      brandHoverColor: 'hover:text-[#E4405F]',
      brandBgHover: 'hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30',
    });
  }

  if (settings.youtube?.active && settings.youtube?.url?.trim()) {
    list.push({
      id: 'youtube',
      name: 'YouTube',
      url: settings.youtube.url.trim(),
      ariaLabel: 'Visit IDL Education on YouTube',
      icon: <YouTubeIcon className="w-[18px] h-[18px]" />,
      brandHoverColor: 'hover:text-[#FF0000]',
      brandBgHover: 'hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30',
    });
  }

  if (settings.facebook?.active && settings.facebook?.url?.trim()) {
    list.push({
      id: 'facebook',
      name: 'Facebook',
      url: settings.facebook.url.trim(),
      ariaLabel: 'Visit IDL Education on Facebook',
      icon: <FacebookIcon className="w-[17px] h-[17px]" />,
      brandHoverColor: 'hover:text-[#1877F2]',
      brandBgHover: 'hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30',
    });
  }

  // Twitter / X (Included for footer display only)
  if (settings.twitter?.active && settings.twitter?.url?.trim()) {
    list.push({
      id: 'twitter',
      name: 'X (Twitter)',
      url: settings.twitter.url.trim(),
      ariaLabel: 'Visit IDL Education on X (Twitter)',
      icon: <TwitterXIcon className="w-[16px] h-[16px]" />,
      brandHoverColor: 'hover:text-black dark:hover:text-white',
      brandBgHover: 'hover:bg-black/10',
    });
  }

  return list;
}

// ============================================================
// REUSABLE SOCIAL LINKS COMPONENT (Rule 27)
// Supports variants: "header", "mobile-menu", "footer"
// ============================================================

interface SocialLinksProps {
  variant: 'header' | 'mobile-menu' | 'footer';
  className?: string;
  onLinkClick?: () => void;
}

export function SocialLinks({ variant, className, onLinkClick }: SocialLinksProps) {
  const { items } = useSocialMediaLinks();

  // If no social links configured, do not render empty containers (Rule 21 & Rule 22)
  if (!items || items.length === 0) {
    return null;
  }

  // ==========================================
  // VARIANT 1: DESKTOP HEADER (Rules 2, 3, 4, 5, 6, 31, 32)
  // Icon-only, 18–20px, subtle by default, tooltip on hover
  // NOTE: Twitter excluded from header per user request
  // ==========================================
  if (variant === 'header') {
    const headerItems = items.filter((s) => s.id !== 'twitter');
    if (headerItems.length === 0) return null;

    return (
      <TooltipProvider delayDuration={150}>
        <div className={cn("hidden md:flex items-center gap-1.5 lg:gap-2", className)}>
          {headerItems.map((social) => (
            <Tooltip key={social.id}>
              <TooltipTrigger asChild>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={cn(
                    "w-8 h-8 lg:w-9 lg:h-9 rounded-full",
                    "bg-[#EEF4FF] dark:bg-blue-950/60 border border-[#D6E4FF] dark:border-blue-900/60",
                    "flex items-center justify-center shrink-0",
                    "text-[#1F4FA3] dark:text-blue-400",
                    "transition-all duration-200 ease-out",
                    "hover:bg-[#E2EDFF] dark:hover:bg-blue-900/80 hover:border-blue-300 dark:hover:border-blue-800",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FA3]/50 focus-visible:ring-offset-2",
                    social.brandHoverColor
                  )}
                >
                  <span className="transition-transform duration-200 hover:scale-110 flex items-center justify-center">
                    {social.icon}
                  </span>
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6} className="px-2.5 py-1 text-xs font-semibold bg-[#0B1F4B] text-white border-none shadow-md">
                {social.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  // ==========================================
  // VARIANT 2: MOBILE MENU DRAWER (Rules 7, 8, 9, 30)
  // Lower portion of navigation drawer, "FOLLOW IDL", icon + text, min 44px target
  // NOTE: Twitter excluded from mobile menu drawer per user request
  // ==========================================
  if (variant === 'mobile-menu') {
    const menuItems = items.filter((s) => s.id !== 'twitter');
    if (menuItems.length === 0) return null;

    return (
      <div className={cn("space-y-2", className)}>
        <p className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          FOLLOW IDL
        </p>
        <div className="grid grid-cols-3 gap-2">
          {menuItems.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onLinkClick}
              aria-label={social.ariaLabel}
              className={cn(
                "flex items-center justify-center gap-1.5 h-11 px-2 rounded-[9px]",
                "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800",
                "text-slate-700 dark:text-slate-200 font-medium text-[12px] sm:text-[12.5px]",
                "shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                "hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
                "transition-colors duration-150 ease-out cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1",
                social.brandHoverColor
              )}
            >
              <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">{social.icon}</span>
              <span className="truncate">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VARIANT 3: FOOTER (Under Description in Column 1)
  // Minimal social icon row: transparent surface, 8px radius, subtle border, NO shadow
  // Includes: Instagram, YouTube, Facebook, and Twitter / X (Footer only)
  // ==========================================
  if (variant === 'footer') {
    const footerItems = items;
    if (footerItems.length === 0) return null;

    return (
      <div className={cn("mt-3 sm:mt-3.5", className)}>
        {/* Footer Column Heading matching Quick Links, Resources, etc. */}
        <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-2 sm:mb-2.5 border-l-2 border-[#1D4ED8] pl-2.5">
          Follow IDL
        </h3>

        {/* Minimal Social Icon Row: 38-40px square, 8px radius, transparent, subtle border, NO shadow */}
        <TooltipProvider delayDuration={150}>
          <div className="flex items-center gap-2.5 sm:gap-3 pl-2.5">
            {footerItems.map((social) => (
              <Tooltip key={social.id}>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className={cn(
                      "w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] rounded-[8px]",
                      "bg-transparent dark:bg-transparent",
                      "border border-slate-300/60 dark:border-slate-800/80",
                      "flex items-center justify-center shrink-0",
                      "text-[#0B1F4B] dark:text-slate-200",
                      "transition-colors duration-200 ease-out cursor-pointer",
                      "hover:bg-[#EEF4FF]/80 dark:hover:bg-blue-950/40 hover:border-slate-300 dark:hover:border-blue-900/60",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4FA3]/50 focus-visible:ring-offset-1",
                      "active:opacity-80",
                      social.brandHoverColor
                    )}
                  >
                    <span className="shrink-0 flex items-center justify-center">
                      {social.icon}
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5} className="px-2 py-0.5 text-[11px] font-semibold bg-[#0B1F4B] text-white border-none shadow-sm">
                  {social.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    );
  }

  return null;
}
