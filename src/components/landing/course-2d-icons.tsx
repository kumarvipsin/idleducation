import React from 'react';

// ── 1. JEE: Single 2D Atom / Science Icon ─────────────────────────────────────
export function Jee2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Center Nucleus Dot with Blue Accent */}
            <circle cx="12" cy="12" r="2.2" fill="#2563EB" stroke="none" />
            {/* Orbit 1: Tilted Left */}
            <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-35 12 12)" />
            {/* Orbit 2: Tilted Right */}
            <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(35 12 12)" />
            {/* Orbit 3: Vertical Axis */}
            <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(90 12 12)" strokeOpacity="0.75" />
        </svg>
    );
}

// ── 2. NEET: Single 2D Stethoscope Icon ───────────────────────────────────────
export function Neet2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Ear tips */}
            <path d="M5.5 4H7M12 4h1.5" />
            {/* Binaural U-Tube */}
            <path d="M6.5 4.5v3a3.5 3.5 0 0 0 7 0v-3" />
            {/* Lower flexible loop */}
            <path d="M10 11v2.5a4.5 4.5 0 0 0 9 0v-2.5" />
            {/* Chestpiece Diaphragm Sensor with Teal Accent */}
            <circle cx="19" cy="10" r="2.2" fill="#059669" stroke="#0B2858" strokeWidth="1.6" />
        </svg>
    );
}

// ── 3. CBSE: Single 2D Open Academic Book Icon ────────────────────────────────
export function Cbse2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Open Book Pages */}
            <path d="M2.5 6C5 4.8 8.5 4.8 12 7C15.5 4.8 19 4.8 21.5 6V19C19 17.8 15.5 17.8 12 20C8.5 17.8 5 17.8 2.5 19V6Z" />
            {/* Center Spine */}
            <path d="M12 7V20" />
            {/* Amber subtle accent lines on pages */}
            <path d="M5.5 10.5H9" stroke="#D97706" strokeWidth="1.5" />
            <path d="M5.5 13.5H8.5" stroke="#D97706" strokeWidth="1.5" />
            <path d="M15 10.5H18.5" stroke="#D97706" strokeWidth="1.5" />
            <path d="M15.5 13.5H18.5" stroke="#D97706" strokeWidth="1.5" />
        </svg>
    );
}

// ── 4. CUET EXAM: Single 2D Graduation Cap Icon ───────────────────────────────
export function Cuet2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Mortarboard Diamond Top */}
            <polygon points="12,5 22,10 12,15 2,10" fill="#F0FDFA" stroke="#0B2858" strokeWidth="1.85" strokeLinejoin="round" />
            {/* Skull Cap Arch */}
            <path d="M6 12.2V16.2C6 18.5 18 18.5 18 16.2V12.2" />
            {/* Tassel on Right with Cyan/Teal Accent */}
            <path d="M22 10V16" />
            <circle cx="22" cy="16.5" r="1.2" fill="#0D9488" stroke="none" />
        </svg>
    );
}

// ── 5. TEST SERIES: Single 2D Document Checklist Icon ─────────────────────────
export function TestSeries2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Document Outline */}
            <rect x="4.5" y="3.5" width="15" height="17" rx="2.5" />
            {/* Top Tab Clip */}
            <path d="M9.5 3.5V2.5A1 1 0 0 1 10.5 1.5H13.5A1 1 0 0 1 14.5 2.5V3.5" strokeWidth="1.4" />
            {/* Check item 1 with Violet Accent */}
            <circle cx="8" cy="8.5" r="1.1" fill="#7C3AED" stroke="none" />
            <path d="M11 8.5H16" />
            {/* Check item 2 with Violet Accent */}
            <circle cx="8" cy="12" r="1.1" fill="#7C3AED" stroke="none" />
            <path d="M11 12H16" />
            {/* Check item 3 with Violet Accent */}
            <circle cx="8" cy="15.5" r="1.1" fill="#7C3AED" stroke="none" />
            <path d="M11 15.5H16" />
        </svg>
    );
}

// ── 6. YOUTUBE CHANNEL: Single 2D Video Play Icon ─────────────────────────────
export function Youtube2DIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="#0B2858"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Video Screen / Player Rectangle */}
            <rect x="2.5" y="4.5" width="19" height="15" rx="4.5" />
            {/* Centered Play Triangle with Red Accent */}
            <polygon
                points="10,9 10,15 15.5,12"
                fill="#DC2626"
                stroke="#DC2626"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
        </svg>
    );
}
