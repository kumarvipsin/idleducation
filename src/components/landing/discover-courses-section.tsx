'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Bold Illustrated Open CBSE Textbook with Bookmark, Star & Sparkles (Tile 01 - CBSE)
function CbseBookIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles */}
            <path d="M6 7L7.5 4.5L9 7L11.5 8.5L9 10L7.5 12.5L6 10L3.5 8.5L6 7Z" fill="#D97706" />
            <path d="M33 7L34.5 4.5L36 7L38.5 8.5L36 10L34.5 12.5L33 10L30.5 8.5L33 7Z" fill="#D97706" />
            <circle cx="20" cy="2.5" r="1.3" fill="#D97706" />
            <path d="M4 17L5 16L6 17L5 18Z" fill="#F59E0B" />
            <path d="M36 17L37 16L38 17L37 18Z" fill="#F59E0B" />

            {/* Academic Star of Excellence Floating on Top */}
            <path 
                d="M20 5L21.2 7.8L24.2 8.1L21.9 10L22.6 13L20 11.4L17.4 13L18.1 10L15.8 8.1L18.8 7.8L20 5Z" 
                fill="#FBBF24" 
                stroke="#D97706" 
                strokeWidth="0.8" 
                strokeLinejoin="round" 
            />

            {/* Soft Shadow Underneath */}
            <ellipse cx="20" cy="35.5" rx="14" ry="2.5" fill="#92400E" opacity="0.25" />

            {/* Solid Hardcover Base & Spine */}
            <path 
                d="M5 16.5C10.5 14.8 16 15 19.5 17.2V32.5C16 29.8 10.5 29.8 5 31.8V16.5Z" 
                fill="#B45309" 
                stroke="#78350F" 
                strokeWidth="1.3" 
                strokeLinejoin="round" 
            />
            <path 
                d="M35 16.5C29.5 14.8 24 15 20.5 17.2V32.5C24 29.8 29.5 29.8 35 31.8V16.5Z" 
                fill="#B45309" 
                stroke="#78350F" 
                strokeWidth="1.3" 
                strokeLinejoin="round" 
            />

            {/* Stacked Pages Thickness (Edge Depth) */}
            <path d="M5.5 30.5C10.5 28.5 16 28.5 19.5 30.5" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M34.5 30.5C29.5 28.5 24 28.5 20.5 30.5" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" />

            {/* Left Page (Warm Cream Sheet) */}
            <path 
                d="M6.5 15C11.5 13.5 16.5 13.8 19.5 15.8V29.8C16.5 27.8 11.5 27.5 6.5 29.2V15Z" 
                fill="#FFFBEB" 
                stroke="#D97706" 
                strokeWidth="1.3" 
                strokeLinejoin="round" 
            />
            {/* Right Page (Pure Bright Sheet) */}
            <path 
                d="M33.5 15C28.5 13.5 23.5 13.8 20.5 15.8V29.8C23.5 27.8 28.5 27.5 33.5 29.2V15Z" 
                fill="#FFFFFF" 
                stroke="#D97706" 
                strokeWidth="1.3" 
                strokeLinejoin="round" 
            />

            {/* Textbook Study Illustrations on Left Page (A+ badge & lines) */}
            <rect x="9" y="17.5" width="4.5" height="4.5" rx="1" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.8" />
            <path d="M11.2 18.5V21M10 19.8H12.5" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M15 18H18" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M15 21H18" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 24.5H18" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 27H16" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />

            {/* Textbook Study Illustrations on Right Page */}
            <path d="M22 18H31" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M22 21H29" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M22 24.5H31" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M22 27H28" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />

            {/* Bold Scarlet Ribbon Bookmark Draped Down Center */}
            <path d="M18.8 14.5V33.5L20 31.8L21.2 33.5V14.5H18.8Z" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
            <circle cx="20" cy="14.5" r="1.5" fill="#EF4444" />
        </svg>
    );
}

// 2. Bold 3D Precision Exam Timer with Golden Bells & Sparkles (Tile 02 - JEE & NEET)
function AlarmClockIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles & Ringing Waves */}
            <path d="M5 8L6.5 5.5L8 8L10.5 9.5L8 11L6.5 13.5L5 11L2.5 9.5L5 8Z" fill="#6366F1" />
            <path d="M34 8L35.5 5.5L37 8L39.5 9.5L37 11L35.5 13.5L34 11L31.5 9.5L34 8Z" fill="#6366F1" />
            <circle cx="20" cy="2.5" r="1.2" fill="#F59E0B" />
            <path d="M4 16C3.2 17.5 3 19 3 20" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M36 16C36.8 17.5 37 19 37 20" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />

            {/* Soft Shadow Underneath */}
            <ellipse cx="20" cy="35.5" rx="12" ry="2.2" fill="#312E81" opacity="0.25" />

            {/* Angled Golden Feet with Rubber Pads */}
            <path d="M12 30L9.5 34.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <path d="M28 30L30.5 34.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="9.5" cy="34.5" r="1.5" fill="#4338CA" />
            <circle cx="30.5" cy="34.5" r="1.5" fill="#4338CA" />

            {/* Twin Golden Bell Domes on Top */}
            <g transform="rotate(-28 11 11.5)">
                <path d="M6 12C6 8.5 10 6 13.5 8.5L14 13L6 12Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
                <path d="M7.5 10.5C8 8.5 11 7 13 8.5" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
            </g>
            <g transform="rotate(28 29 11.5)">
                <path d="M26 13L26.5 8.5C30 6 34 8.5 34 12L26 13Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
                <path d="M27 8.5C29 7 32 8.5 32.5 10.5" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* Center Golden Hammer */}
            <rect x="19" y="8" width="2" height="4" fill="#D97706" />
            <circle cx="20" cy="8" r="2.2" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

            {/* Main Clock Outer Ring (Deep Royal Indigo) */}
            <circle cx="20" cy="22" r="12.5" fill="#4338CA" stroke="#312E81" strokeWidth="1.4" />
            {/* Clock Inner Bezel (Vibrant Electric Violet) */}
            <circle cx="20" cy="22" r="10.8" fill="#6366F1" />
            {/* Dial Face (Bright Crisp White) */}
            <circle cx="20" cy="22" r="9" fill="#FFFFFF" />

            {/* Clock Dial Hour Marks (12, 3, 6, 9) */}
            <path d="M20 14.5V16" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 28V29.5" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.5 22H14" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M26 22H27.5" stroke="#312E81" strokeWidth="1.5" strokeLinecap="round" />

            {/* Minor Tick Dots */}
            <circle cx="24.5" cy="15.5" r="0.7" fill="#818CF8" />
            <circle cx="26.5" cy="17.5" r="0.7" fill="#818CF8" />
            <circle cx="26.5" cy="26.5" r="0.7" fill="#818CF8" />
            <circle cx="13.5" cy="17.5" r="0.7" fill="#818CF8" />

            {/* Clock Hands (Targeting Exam Time!) */}
            <path d="M20 22L16.5 19.5" stroke="#312E81" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 22L24.5 17.5" stroke="#4338CA" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M20 23.5L20 15.5" stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />

            {/* Center Pivot Pin */}
            <circle cx="20" cy="22" r="1.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
            <circle cx="20" cy="22" r="0.7" fill="#FFFFFF" />
        </svg>
    );
}

// 3. Illustrated Computer-Based Objective Test Screen (Tile 03 - CUET Exam CBT)
function CuetCbtExamIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles */}
            <path d="M8 6L9 4L10 6L12 7L10 8L9 10L8 8L6 7L8 6Z" fill="#10B981" />
            <path d="M33 6L34 4L35 6L37 7L35 8L34 10L33 8L31 7L33 6Z" fill="#10B981" />
            <circle cx="20" cy="3" r="1.2" fill="#F59E0B" />
            <circle cx="5" cy="18" r="1" fill="#059669" />
            <circle cx="36" cy="18" r="1" fill="#059669" />

            {/* Soft Shadow Underneath */}
            <ellipse cx="20" cy="35" rx="12" ry="2" fill="#065F46" opacity="0.22" />

            {/* Monitor Pedestal Base */}
            <path d="M13 32.5C13 31.8 14 31.5 15 31.5H25C26 31.5 27 31.8 27 32.5V33.5C27 34.2 26 34.5 25 34.5H15C14 34.5 13 34.2 13 33.5V32.5Z" fill="#047857" stroke="#064E3B" strokeWidth="0.8" />
            {/* Monitor Stand Neck */}
            <rect x="18" y="27" width="4" height="5.5" rx="1" fill="#059669" stroke="#047857" strokeWidth="0.8" />

            {/* Monitor Frame / Bezel */}
            <rect x="6.5" y="8.5" width="27" height="19.5" rx="3" fill="#059669" stroke="#047857" strokeWidth="1.4" />
            {/* Display Screen */}
            <rect x="8.5" y="10.5" width="23" height="15.5" rx="1.8" fill="#F0FDF4" />

            {/* Top Exam Header / Timer Bar on Screen */}
            <rect x="8.5" y="10.5" width="23" height="3.2" rx="1.5" fill="#A7F3D0" />
            <circle cx="11.5" cy="12.1" r="0.8" fill="#047857" />
            <path d="M14 12.1H18" stroke="#047857" strokeWidth="0.8" strokeLinecap="round" />
            {/* CBT Timer badge */}
            <rect x="25" y="11" width="5.5" height="2.2" rx="0.6" fill="#047857" />
            <path d="M26.2 12.1H29.3" stroke="#A7F3D0" strokeWidth="0.8" strokeLinecap="round" />

            {/* Question Line */}
            <path d="M11 15.5H22" stroke="#047857" strokeWidth="1.1" strokeLinecap="round" />

            {/* MCQ Option A (Selected Correct with Checkmark ✓) */}
            <circle cx="12.5" cy="18.5" r="1.7" fill="#10B981" />
            <path d="M11.6 18.5L12.3 19.3L13.5 17.7" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.5 18.5H23.5" stroke="#047857" strokeWidth="1" strokeLinecap="round" />

            {/* MCQ Option B (Unselected Radio Circle) */}
            <circle cx="12.5" cy="22.5" r="1.6" fill="#FFFFFF" stroke="#059669" strokeWidth="0.9" />
            <path d="M15.5 22.5H20.5" stroke="#6EE7B7" strokeWidth="1" strokeLinecap="round" />

            {/* Interactive Mouse Pointer / Cursor Click */}
            <path 
                d="M23 18.5L27 22.5L25 23L26.2 25.5L24.8 26L23.6 23.5L22 25V18.5Z" 
                fill="#F59E0B" 
                stroke="#B45309" 
                strokeWidth="0.7" 
                strokeLinejoin="round" 
            />
            {/* Click Ripple Sparkle */}
            <circle cx="23" cy="18.5" r="1.2" fill="#FEF08A" opacity="0.9" />
        </svg>
    );
}

// 6. Illustrated Exam Test Series Clipboard & Score Badge (Tile 06 - Test Series)
function TestSeriesClipboardIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles */}
            <path d="M29 6L30 4L31 6L33 7L31 8L30 10L29 8L27 7L29 6Z" fill="#F43F5E" />
            <path d="M7 8L8 6L9 8L11 9L9 10L8 12L7 10L5 9L7 8Z" fill="#F59E0B" />
            <circle cx="34" cy="15" r="1.2" fill="#E11D48" />

            {/* Soft Shadow Underneath */}
            <ellipse cx="20" cy="35" rx="11" ry="2" fill="#881337" opacity="0.22" />

            {/* Clipboard Backing Board */}
            <rect x="9" y="9" width="22" height="25" rx="3.5" fill="#BE123C" stroke="#881337" strokeWidth="1.4" />

            {/* Examination Test Paper Sheet */}
            <rect x="11.5" y="11.5" width="17" height="20.5" rx="1.8" fill="#FFF1F2" />

            {/* Top Metal Clamp Clip with Rivet */}
            <rect x="15" y="7" width="10" height="5.5" rx="1.6" fill="#FACC15" stroke="#A16207" strokeWidth="1" />
            <circle cx="20" cy="9.8" r="1.1" fill="#78350F" />

            {/* Test Question 1: Checkmark + Line */}
            <path d="M13.5 15.5L14.7 16.7L17 14.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 15.5H25.5" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />

            {/* Test Question 2: Checkmark + Line */}
            <path d="M13.5 19.5L14.7 20.7L17 18.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 19.5H24" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />

            {/* Test Question 3: Checkmark + Line */}
            <path d="M13.5 23.5L14.7 24.7L17 22.5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 23.5H22" stroke="#F43F5E" strokeWidth="1.2" strokeLinecap="round" />

            {/* 100% / Top Score Golden Star Seal on Paper */}
            <circle cx="23.5" cy="27.5" r="3.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            <path d="M23.5 25.5L24 26.8L25.3 27L24.3 27.9L24.6 29.2L23.5 28.5L22.4 29.2L22.7 27.9L21.7 27L23 26.8L23.5 25.5Z" fill="#D97706" />

            {/* Scoring Pencil Angled on the Right */}
            <g transform="rotate(25 28 20)">
                <rect x="25" y="10" width="3.5" height="15" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                <path d="M25 25L26.7 28L28.5 25H25Z" fill="#E11D48" />
                <circle cx="26.7" cy="27.5" r="0.5" fill="#111827" />
                <rect x="25" y="9.2" width="3.5" height="1.8" fill="#BE123C" />
            </g>
        </svg>
    );
}

// 5. Polished Video Learning Display with Play Shield & Academic Star (Tile 05 - Free Courses)
function FreeCourseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles - Subtle & Minimal */}
            <path d="M7 9L8 7L9 9L11 10L9 11L8 13L7 11L5 10L7 9Z" fill="#F59E0B" />
            <path d="M33 7L34 5L35 7L37 8L35 9L34 11L33 9L31 8L33 7Z" fill="#EA580C" opacity="0.85" />
            <circle cx="20" cy="4" r="1.1" fill="#F59E0B" />

            {/* Soft Shadow Underneath */}
            <ellipse cx="20" cy="35" rx="11" ry="2" fill="#9A3412" opacity="0.18" />

            {/* Video Player Device Frame */}
            <rect x="7" y="10" width="26" height="21" rx="3.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.3" />

            {/* Screen Bezel / Inner Display */}
            <rect x="9" y="12" width="22" height="15" rx="2" fill="#FFF7ED" />

            {/* Top Device Header Strip */}
            <rect x="9" y="12" width="22" height="3" rx="1" fill="#FED7AA" opacity="0.6" />
            <circle cx="11.5" cy="13.5" r="0.7" fill="#EA580C" />
            <circle cx="13.5" cy="13.5" r="0.7" fill="#FBBF24" />

            {/* Video Play Button in Screen Center */}
            <circle cx="20" cy="19.5" r="4.2" fill="#EA580C" stroke="#C2410C" strokeWidth="0.8" />
            <path d="M19 17.8L22.2 19.5L19 21.2V17.8Z" fill="#FFFFFF" />

            {/* Video Progress Bar at Bottom of Screen */}
            <rect x="11" y="24.2" width="18" height="1.4" rx="0.7" fill="#FED7AA" />
            <rect x="11" y="24.2" width="9" height="1.4" rx="0.7" fill="#EA580C" />
            <circle cx="20" cy="24.9" r="1" fill="#C2410C" />

            {/* Lower Device Chin / Speaker Strip */}
            <rect x="13" y="28.5" width="14" height="1.2" rx="0.6" fill="#EA580C" opacity="0.6" />

            {/* Polished Academic Star Seal on Top-Right */}
            <circle cx="28.5" cy="9.5" r="3.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            <path d="M28.5 7.5L29.1 8.8L30.5 9L29.4 10L29.7 11.4L28.5 10.7L27.3 11.4L27.6 10L26.5 9L27.9 8.8L28.5 7.5Z" fill="#D97706" />
        </svg>
    );
}

// 6. Premium Royal Crown with Golden Sparkles (Tile 06 - Premium Courses)
function PremiumCourseIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 40" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
            {/* Ambient Sparkles */}
            <path d="M20 4L21.2 1.5L22.5 4L25 5.2L22.5 6.5L21.2 9L20 6.5L17.5 5.2L20 4Z" fill="#F59E0B" />
            <path d="M8 11L9 9L10 11L12 12L10 13L9 15L8 13L6 12L8 11Z" fill="#F59E0B" />
            <path d="M32 11L33 9L34 11L36 12L34 13L33 15L32 13L30 12L32 11Z" fill="#F59E0B" />
            
            {/* Velvet Base Cushion / Pedestal */}
            <path d="M9.5 27C9.5 25.5 13.5 24.5 20 24.5C26.5 24.5 30.5 25.5 30.5 27L29.5 32C29.5 33.2 25.5 34 20 34C14.5 34 10.5 33.2 10.5 32L9.5 27Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="1.2" />
            
            {/* Crown Body with Peaks */}
            <path 
                d="M8.5 17.5L12.5 27.5H27.5L31.5 17.5L25.5 22L20 13L14.5 22L8.5 17.5Z" 
                fill="#FBBF24" 
                stroke="#D97706" 
                strokeWidth="1.4" 
                strokeLinejoin="round" 
            />
            {/* Crown Front Shimmer */}
            <path 
                d="M13 26.5L14.5 22L20 15L25.5 22L27 26.5H13Z" 
                fill="#FDE68A" 
                opacity="0.85" 
            />
            
            {/* Jewels on Crown Peaks */}
            <circle cx="8.5" cy="17" r="2.2" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
            <circle cx="20" cy="12.5" r="2.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.8" />
            <circle cx="31.5" cy="17" r="2.2" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
            
            {/* Center Crown Emblem Jewel */}
            <polygon points="20,20.5 22.5,23.5 20,26.5 17.5,23.5" fill="#EF4444" />
            <polygon points="20,21.5 21.5,23.5 20,25.5 18.5,23.5" fill="#F87171" />

            {/* Crown Base Gold Rim */}
            <rect x="11.5" y="26.5" width="17" height="3" rx="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.9" />
            <circle cx="14.5" cy="28" r="0.9" fill="#10B981" />
            <circle cx="20" cy="28" r="0.9" fill="#3B82F6" />
            <circle cx="25.5" cy="28" r="0.9" fill="#EF4444" />
        </svg>
    );
}

interface CourseItem {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    href: string;
    bgColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

const courses: CourseItem[] = [
    {
        id: 'cbse',
        number: '01',
        title: 'CBSE',
        subtitle: 'Classes 9–12',
        href: '#',
        bgColor: 'bg-[#FEF1D4] hover:bg-[#FDE8BE] dark:bg-amber-950/50',
        borderColor: 'border-[#FBD99B] dark:border-amber-800/60',
        icon: CbseBookIcon,
    },
    {
        id: 'jee-neet',
        number: '02',
        title: 'JEE & NEET',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#E1ECFE] hover:bg-[#D4E3FD] dark:bg-indigo-950/50',
        borderColor: 'border-[#BED5FC] dark:border-indigo-800/60',
        icon: AlarmClockIcon,
    },
    {
        id: 'cuet',
        number: '03',
        title: 'CUET EXAM',
        subtitle: 'Classes 11–12',
        href: '#',
        bgColor: 'bg-[#D5F5E5] hover:bg-[#C2EED7] dark:bg-emerald-950/50',
        borderColor: 'border-[#A8E6C8] dark:border-emerald-800/60',
        icon: CuetCbtExamIcon,
    },
    {
        id: 'test-series',
        number: '04',
        title: 'TEST SERIES',
        subtitle: 'Mock Tests & PYQs',
        href: '#',
        bgColor: 'bg-[#FDE0E6] hover:bg-[#FCCED7] dark:bg-rose-950/50',
        borderColor: 'border-[#FBB6C4] dark:border-rose-800/60',
        icon: TestSeriesClipboardIcon,
    },
    {
        id: 'free-courses',
        number: '05',
        title: 'FREE COURSES',
        subtitle: 'Classes 9–12 • YouTube',
        href: '/free-courses',
        bgColor: 'bg-[#FFF1E6] hover:bg-[#FFE5D3] dark:bg-orange-950/40',
        borderColor: 'border-[#FED2B8] dark:border-orange-800/50',
        icon: FreeCourseIcon,
    },
    {
        id: 'premium-courses',
        number: '06',
        title: 'PREMIUM COURSES',
        subtitle: 'Exclusive & Live',
        href: '/courses',
        bgColor: 'bg-[#E0E7FE] hover:bg-[#D3DCFD] dark:bg-blue-950/50',
        borderColor: 'border-[#C2D1FC] dark:border-blue-800/60',
        icon: PremiumCourseIcon,
    },
];

export function DiscoverCoursesSection() {
    return (
        <section suppressHydrationWarning className="relative w-full bg-gradient-to-b from-transparent via-[#F7F9FD] to-[#F7F9FD] dark:bg-background -mt-5 sm:-mt-7 md:-mt-9 lg:-mt-11 z-20 pt-6 sm:pt-7 md:pt-8 pb-5 sm:pb-6 overflow-hidden">
            
            {/* Ambient Background Texture: Faint Academic Dot Grid (3-4% Opacity) */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                  backgroundSize: '16px 16px'
                }}
            />

            {/* Soft Ambient Depth: Low-Opacity Blue Radial Wash on Left/Center */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute -top-12 left-1/4 w-[520px] h-[340px] bg-blue-500/[0.045] dark:bg-blue-500/[0.03] blur-3xl rounded-full" 
            />

            {/* Very Subtle Warm Orange Accent toward Right Side */}
            <div 
                aria-hidden="true" 
                className="pointer-events-none absolute -bottom-12 right-1/6 w-[380px] h-[260px] bg-orange-500/[0.03] dark:bg-orange-500/[0.02] blur-3xl rounded-full" 
            />

            <div className="container mx-auto px-2.5 min-[360px]:px-3.5 sm:px-6 md:px-8 lg:px-8 xl:px-10 max-w-[1240px] relative z-10">
                
                {/* Floating Pure White Course Shelf (Visual Separation from #F7F9FD Background) */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 min-[360px]:p-3.5 sm:p-4 shadow-[0_12px_36px_-6px_rgba(16,42,104,0.07),0_4px_16px_-2px_rgba(16,42,104,0.03)] overflow-hidden">
                    
                    {/* Compact Label: Small orange dot + Courses We Offer */}
                    <div className="relative z-10 flex justify-center mb-2.5 min-[360px]:mb-3 sm:mb-3.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 min-[360px]:px-3.5 rounded-full bg-white/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/70 shadow-[0_1px_3px_rgba(16,42,104,0.04)] text-[#102A68] dark:text-blue-200 font-semibold text-[10.5px] min-[360px]:text-[11px] sm:text-[11.5px] tracking-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            Courses We Offer
                        </span>
                    </div>

                    {/* Mobile: 2x3 (grid-cols-2) | Tablet: 3x2 (md:grid-cols-3) | Desktop: 1 Row of 6 (lg:grid-cols-6) with distinct gap */}
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 min-[360px]:gap-3 sm:gap-3.5 lg:gap-2.5 xl:gap-3">
                        {courses.map((course) => {
                            const Icon = course.icon;
                            return (
                                <Link
                                    key={course.id}
                                    href={course.href}
                                    onClick={(e) => {
                                        if (course.href === '#') {
                                            e.preventDefault();
                                        }
                                    }}
                                    className={cn(
                                        "group relative flex flex-col justify-between rounded-xl border-[1.5px]",
                                        // Refined height: 130-138px on mobile; 100-106px on desktop (unchanged)
                                        "h-[130px] min-[360px]:h-[134px] min-[390px]:h-[138px] sm:h-[142px] lg:h-[100px] xl:h-[106px]",
                                        // Balanced internal text-safe padding: gives comfortable breathing room from all boundaries
                                        "p-3 min-[360px]:p-3.5 sm:p-4 lg:p-3 xl:p-3.5",
                                        "shadow-[0_2px_8px_-2px_rgba(16,42,104,0.06)] hover:shadow-[0_6px_16px_-3px_rgba(16,42,104,0.12)] transition-all duration-180 ease-out hover:-translate-y-0.5",
                                        course.bgColor,
                                        course.borderColor
                                    )}
                                >
                                    {/* 
                                      Top Row:
                                      - Mobile: Number on upper-left (order-1), Enriched larger Icon on upper-right (order-2)
                                      - Desktop: Icon on left (lg:order-1), Number on right (lg:order-2)
                                    */}
                                    <div className="flex items-start justify-between">
                                        <span className="order-1 lg:order-2 text-[10px] min-[360px]:text-[10.5px] lg:text-[9px] xl:text-[9.5px] font-mono font-bold text-slate-500 dark:text-slate-400 leading-none select-none">
                                            {course.number}
                                        </span>
                                        <div className="order-2 lg:order-1 shrink-0">
                                            <Icon className="w-12 h-12 min-[360px]:w-[50px] min-[360px]:h-[50px] sm:w-[52px] sm:h-[52px] lg:w-[34px] lg:h-[34px] xl:w-[38px] xl:h-[38px] transition-transform duration-180 ease-out group-hover:scale-105" />
                                        </div>
                                    </div>

                                    {/* 
                                      Bottom Row:
                                      - Course Title: Strong IDL Navy (#0B2154), controlled line-height, comfortable safe-insets
                                      - Supporting Class Info + Arrow: small controlled gap, comfortable spacing from tile boundaries
                                    */}
                                    <div className="mt-auto w-full">
                                        <h4 className="text-[12.5px] min-[360px]:text-[13.5px] min-[390px]:text-[14px] sm:text-[14.5px] lg:text-[11px] xl:text-[11.5px] font-extrabold text-[#0B2154] dark:text-white tracking-tight leading-[1.25] group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {course.title}
                                        </h4>
                                        <div className="flex items-center justify-between gap-1.5 mt-1 min-[360px]:mt-1.5 lg:mt-1">
                                            <p className="text-[10px] min-[360px]:text-[10.5px] min-[390px]:text-[11px] lg:text-[8.5px] xl:text-[9px] font-semibold text-slate-600 dark:text-slate-300 leading-none truncate">
                                                {course.subtitle}
                                            </p>
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-3 lg:h-3 text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-100 shrink-0 transition-transform duration-180 ease-out group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}
