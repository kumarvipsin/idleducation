import React from 'react';

// ── 1. JEE Illustration: Pure Stylized 3D Atom (Matching All Courses Atom icon)
export function JeeIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                {/* Ambient Floor Shadow */}
                <radialGradient id="jeeFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
                </radialGradient>
                {/* Central 3D Nucleus */}
                <radialGradient id="jeeNucleus" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#93C5FD" />
                    <stop offset="30%" stopColor="#3B82F6" />
                    <stop offset="70%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#0B1B48" />
                </radialGradient>
                {/* Orbit 1: Tilted Left (-60 deg) */}
                <linearGradient id="jeeOrbit1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>
                {/* Orbit 2: Tilted Right (+60 deg) */}
                <linearGradient id="jeeOrbit2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                {/* Orbit 3: Horizontal */}
                <linearGradient id="jeeOrbit3" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                {/* Glowing Electron Sphere */}
                <radialGradient id="jeeElectron" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                </radialGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#jeeFloor)" />

            {/* Orbit 1 (Tilted -60 deg) */}
            <ellipse
                cx="50"
                cy="50"
                rx="37"
                ry="13.5"
                transform="rotate(-60 50 50)"
                fill="none"
                stroke="url(#jeeOrbit1)"
                strokeWidth="2.4"
            />

            {/* Orbit 2 (Tilted +60 deg) */}
            <ellipse
                cx="50"
                cy="50"
                rx="37"
                ry="13.5"
                transform="rotate(60 50 50)"
                fill="none"
                stroke="url(#jeeOrbit2)"
                strokeWidth="2.4"
            />

            {/* Orbit 3 (Horizontal 0 deg) */}
            <ellipse
                cx="50"
                cy="50"
                rx="37"
                ry="13.5"
                fill="none"
                stroke="url(#jeeOrbit3)"
                strokeWidth="2.4"
            />

            {/* Electron 1 (on Orbit 1) */}
            <circle cx="32" cy="19" r="4.2" fill="url(#jeeElectron)" />
            <circle cx="30.5" cy="17.5" r="1.3" fill="#FFFFFF" opacity="0.85" />

            {/* Electron 2 (on Orbit 2) */}
            <circle cx="68" cy="19" r="4.2" fill="url(#jeeElectron)" />
            <circle cx="66.5" cy="17.5" r="1.3" fill="#FFFFFF" opacity="0.85" />

            {/* Electron 3 (on Orbit 3) */}
            <circle cx="86" cy="50" r="4.2" fill="url(#jeeElectron)" />
            <circle cx="84.5" cy="48.5" r="1.3" fill="#FFFFFF" opacity="0.85" />

            {/* Central Volumetric Nucleus */}
            <circle cx="50" cy="50" r="14.5" fill="url(#jeeNucleus)" />
            {/* Specular Highlight on Nucleus */}
            <ellipse
                cx="46"
                cy="45.5"
                rx="4.8"
                ry="3"
                transform="rotate(-25 46 45.5)"
                fill="#FFFFFF"
                opacity="0.55"
            />
        </svg>
    );
}

// ── 2. NEET Illustration: Stethoscope (Matching All Courses Stethoscope icon) ─
export function NeetIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                {/* Ambient Floor Shadow */}
                <radialGradient id="neetFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                </radialGradient>
                {/* Metallic Chrome Binaural Tubes */}
                <linearGradient id="neetChrome" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="30%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                {/* Teal Silicone Tube Gradient */}
                <linearGradient id="neetTube" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="45%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#042F2E" />
                </linearGradient>
                {/* Metallic Chestpiece Outer Rim */}
                <radialGradient id="neetRim" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#475569" />
                </radialGradient>
                {/* Chestpiece Diaphragm Sensor */}
                <radialGradient id="neetDiaphragm" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="50%" stopColor="#0D9488" />
                    <stop offset="100%" stopColor="#042F2E" />
                </radialGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#neetFloor)" />

            {/* ── 1. Upper Binaural Stethoscope Tubes (Left and Right Ear Tubes) ── */}
            {/* Left Ear Tip Stem (vertical) */}
            <line x1="28" y1="14" x2="28" y2="22" stroke="url(#neetChrome)" strokeWidth="3.6" strokeLinecap="round" />
            {/* Right Ear Tip Stem (vertical) */}
            <line x1="50" y1="14" x2="50" y2="22" stroke="url(#neetChrome)" strokeWidth="3.6" strokeLinecap="round" />

            {/* Ear Tip Olives (Navy/Slate) */}
            <circle cx="28" cy="14" r="3.2" fill="#0F2942" />
            <circle cx="50" cy="14" r="3.2" fill="#0F2942" />

            {/* Upper U-Tube Frame (matching Lucide: M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1) */}
            <path
                d="M 28 22 H 24 C 20 22 17 25 17 30 V 42 C 17 55 61 55 61 42 V 30 C 61 25 58 22 54 22 H 50"
                stroke="url(#neetChrome)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Binaural Tension Spring */}
            <path d="M 22 34 Q 39 38 56 34" stroke="url(#neetChrome)" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* ── 2. Lower Looping Flexible Tube (matching Lucide: M8 15a6 6 0 0 0 12 0v-3) ── */}
            {/* Extends from bottom of upper U-frame, loops down and curves up to the right side */}
            <path
                d="M 39 52 V 58 C 39 79 78 79 78 58 V 46"
                stroke="url(#neetTube)"
                strokeWidth="5.2"
                strokeLinecap="round"
                fill="none"
            />

            {/* ── 3. Circular Chestpiece Diaphragm on Right (matching Lucide: circle cx="20" cy="10" r="2") ── */}
            <g transform="translate(78, 34)">
                {/* Stem connecting vertical tube into bottom of chestpiece */}
                <rect x="-2" y="10" width="4" height="4" rx="1" fill="url(#neetChrome)" />
                {/* Outer Metallic Beveled Rim */}
                <circle cx="0" cy="0" r="14.5" fill="url(#neetRim)" stroke="#334155" strokeWidth="0.8" />
                {/* Inner Teal Sensor Core */}
                <circle cx="0" cy="0" r="10.5" fill="url(#neetDiaphragm)" />
                {/* Concentric Medical Sensor Ring */}
                <circle cx="0" cy="0" r="6" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.7" />
                {/* White Center Reflection */}
                <circle cx="0" cy="0" r="2" fill="#FFFFFF" opacity="0.9" />
                {/* Specular Flare */}
                <ellipse
                    cx="-3.5"
                    cy="-3.5"
                    rx="4"
                    ry="2"
                    transform="rotate(-30 -3.5 -3.5)"
                    fill="#FFFFFF"
                    opacity="0.45"
                />
            </g>
        </svg>
    );
}

// ── 3. CBSE Illustration: Graduation Cap (Matching All Courses GraduationCap icon)
export function CbseIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                {/* Ambient Floor Shadow */}
                <radialGradient id="cbseFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#D97706" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                </radialGradient>
                {/* Cap Mortarboard Plate Top */}
                <linearGradient id="cbseCapTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="40%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                {/* Cap Skull Underneath */}
                <linearGradient id="cbseCapSkull" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0B1329" />
                </linearGradient>
                {/* Golden Button and Tassel */}
                <linearGradient id="cbseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                {/* Rolled Diploma Scroll */}
                <linearGradient id="cbseScroll" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CBD5E1" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#cbseFloor)" />

            {/* ── Rolled Diploma Scroll at base ── */}
            <g transform="translate(24, 74)">
                {/* Diploma Cylinder */}
                <rect x="0" y="0" width="52" height="9" rx="4.5" fill="url(#cbseScroll)" stroke="#94A3B8" strokeWidth="0.8" />
                {/* Inner Rolled Edge */}
                <ellipse cx="4.5" cy="4.5" rx="3" ry="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.6" />
                {/* Amber Ribbon Tie */}
                <rect x="23" y="-0.5" width="6" height="10" rx="1.5" fill="url(#cbseGold)" />
                <path d="M 26 9.5 L 23 15 L 26 13.5 L 29 15 Z" fill="url(#cbseGold)" />
            </g>

            {/* ── Graduation Cap (Mortarboard) ── */}
            {/* Skull Cap / Neck Arch (matching Lucide: M6 12.5V16a6 3 0 0 0 12 0v-3.5) */}
            <path
                d="M 28 42 V 54 C 28 66 72 66 72 54 V 42"
                stroke="#475569"
                strokeWidth="1.2"
                fill="url(#cbseCapSkull)"
            />
            {/* Soft highlight band on skull cap rim */}
            <path
                d="M 28 44 C 36 51 64 51 72 44"
                stroke="#64748B"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
            />

            {/* Diamond Mortarboard Plate Top (matching Lucide: M21.42 10.922 ... L12.83 5.18 ... L2.6 9.08) */}
            <polygon
                points="50,18 86,34 50,50 14,34"
                fill="url(#cbseCapTop)"
                stroke="#475569"
                strokeWidth="1"
            />
            {/* Beveled Edge Highlight */}
            <polyline
                points="14,34 50,50 86,34"
                stroke="#64748B"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
            />

            {/* Central Golden Button */}
            <circle cx="50" cy="34" r="3.2" fill="url(#cbseGold)" />

            {/* Golden Silk Tassel (matching Lucide: M22 10v6) */}
            <path
                d="M 50 34 C 64 36 82 42 84 50 L 84 66"
                stroke="url(#cbseGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
            />
            {/* Tassel Ring / Band */}
            <rect x="82.5" y="64" width="3" height="3" rx="0.8" fill="#B45309" />
            {/* Tassel Fringe Brush */}
            <polygon points="82,67 86,67 85.5,74 82.5,74" fill="url(#cbseGold)" />
        </svg>
    );
}

// ── 4. CUET EXAM Illustration: Target / Bullseye (Matching All Courses Target icon)
export function CuetIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                {/* Ambient Floor Shadow */}
                <radialGradient id="cuetFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0D9488" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
                </radialGradient>
                {/* Outer Ring Gradient (matching Lucide: circle r="10") */}
                <radialGradient id="cuetOuterRing" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="45%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                </radialGradient>
                {/* Middle Ring Gradient (matching Lucide: circle r="6") */}
                <radialGradient id="cuetMidRing" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#99F6E4" />
                    <stop offset="50%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0D9488" />
                </radialGradient>
                {/* Inner Bullseye Core (matching Lucide: circle r="2") */}
                <radialGradient id="cuetBullseye" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="35%" stopColor="#F59E0B" />
                    <stop offset="80%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#9A3412" />
                </radialGradient>
                {/* Arrow Shaft Metallic Gradient */}
                <linearGradient id="cuetArrowShaft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                {/* Arrow Fletching Cyan */}
                <linearGradient id="cuetFletch" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#cuetFloor)" />

            {/* ── 3 Concentric Target Rings (Matching Lucide Target: r=10, r=6, r=2) ── */}
            {/* Outer Target Circle Disc */}
            <circle cx="48" cy="48" r="35" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.8" />
            <circle cx="48" cy="48" r="35" fill="url(#cuetOuterRing)" opacity="0.35" />

            {/* Outer Accent Rim */}
            <circle cx="48" cy="48" r="31" stroke="#0D9488" strokeWidth="1.8" fill="none" opacity="0.4" />

            {/* Middle Ring (Teal / Emerald) */}
            <circle cx="48" cy="48" r="23" fill="url(#cuetMidRing)" />
            <circle cx="48" cy="48" r="23" stroke="#0F766E" strokeWidth="1.6" fill="none" />

            {/* Middle Ring Inner White Gap */}
            <circle cx="48" cy="48" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />

            {/* Inner Bullseye Core (Golden Amber / Warm Accent) */}
            <circle cx="48" cy="48" r="9.5" fill="url(#cuetBullseye)" />
            <circle cx="48" cy="48" r="9.5" stroke="#B45309" strokeWidth="1" fill="none" />

            {/* Bullseye Center Dot */}
            <circle cx="48" cy="48" r="2.8" fill="#FFFFFF" />

            {/* Specular Glint on Upper-Left of Target */}
            <ellipse
                cx="34"
                cy="32"
                rx="14"
                ry="5"
                transform="rotate(-40 34 32)"
                fill="#FFFFFF"
                opacity="0.4"
            />

            {/* ── Precision Target Arrow (Hitting the Bullseye) ── */}
            <g>
                {/* Arrow Shaft (Tilted 42 deg) */}
                <line
                    x1="48"
                    y1="48"
                    x2="84"
                    y2="16"
                    stroke="url(#cuetArrowShaft)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                />

                {/* Arrow Fletching (Feathers at tail) */}
                <path d="M 81 19 L 88 16 L 86 23 Z" fill="url(#cuetFletch)" />
                <path d="M 84 16 L 81 9 L 77 15 Z" fill="url(#cuetFletch)" />

                {/* Arrow Tail Knock */}
                <circle cx="85" cy="15" r="2" fill="#0284C7" />

                {/* Impact Flare / Ripple at Bullseye */}
                <circle cx="48" cy="48" r="4.5" stroke="#FEF08A" strokeWidth="1.2" fill="none" opacity="0.8" />
            </g>
        </svg>
    );
}

// ── 5. TEST SERIES Illustration: Scorecard Sheet + Precision Timer ──────────
export function TestSeriesIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="testFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                </radialGradient>
                {/* Test Paper Gradient */}
                <linearGradient id="testPaper" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="80%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#EDE9FE" />
                </linearGradient>
                {/* Paper Header Ribbon */}
                <linearGradient id="testHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                {/* Stopwatch Bezel */}
                <linearGradient id="testTimerBezel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="45%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#4338CA" />
                </linearGradient>
                {/* Stopwatch Dial Glass */}
                <radialGradient id="testTimerDial" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#F5F3FF" />
                    <stop offset="100%" stopColor="#DDD6FE" />
                </radialGradient>
                {/* Checkmark Green */}
                <linearGradient id="testCheck" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#testFloor)" />

            {/* ── Examination Question / Answer Sheet (Tilted) ── */}
            <g transform="translate(14, 20)">
                {/* Paper Shadow */}
                <rect x="2" y="2" width="46" height="58" rx="4" fill="#6B21A8" opacity="0.1" />
                {/* Paper Sheet */}
                <rect
                    x="0"
                    y="0"
                    width="46"
                    height="58"
                    rx="4"
                    fill="url(#testPaper)"
                    stroke="#DDD6FE"
                    strokeWidth="0.8"
                />
                {/* Header Strip */}
                <path d="M 0 4 C 0 1.8 1.8 0 4 0 L 42 0 C 44.2 0 46 1.8 46 4 L 46 8 L 0 8 Z" fill="url(#testHeader)" />

                {/* Question Row 1 */}
                <circle cx="8" cy="17" r="3.2" fill="url(#testCheck)" />
                <path d="M 6.8 17 L 7.8 18.2 L 9.6 15.8" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                <line x1="14" y1="17" x2="36" y2="17" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />

                {/* Question Row 2 */}
                <circle cx="8" cy="26" r="3.2" fill="url(#testCheck)" />
                <path d="M 6.8 26 L 7.8 27.2 L 9.6 24.8" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                <line x1="14" y1="26" x2="30" y2="26" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />

                {/* Question Row 3 */}
                <circle cx="8" cy="35" r="3.2" fill="url(#testCheck)" />
                <path d="M 6.8 35 L 7.8 36.2 L 9.6 33.8" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                <line x1="14" y1="35" x2="26" y2="35" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />

                {/* Score Pill at bottom of paper */}
                <rect x="6" y="44" width="22" height="7" rx="3.5" fill="#EDE9FE" />
                <text x="17" y="49.5" fontSize="4.5" fontWeight="bold" fill="#7C3AED" textAnchor="middle" fontFamily="sans-serif">
                    100%
                </text>
            </g>

            {/* ── Precision Stopwatch / Timer (Overlapping on Right) ── */}
            <g transform="translate(68, 56)">
                {/* Top Crown Button */}
                <rect x="-2.5" y="-23" width="5" height="4" rx="1" fill="#7C3AED" />
                <rect x="-4" y="-25" width="8" height="2.5" rx="1.2" fill="#A855F7" />
                {/* Side Push-button (Lap) */}
                <rect x="12" y="-17" width="3.5" height="4.5" rx="1" transform="rotate(35 12 -17)" fill="#7C3AED" />

                {/* Outer Bezel */}
                <circle cx="0" cy="0" r="19" fill="url(#testTimerBezel)" />
                {/* Inner Dial Face */}
                <circle cx="0" cy="0" r="15" fill="url(#testTimerDial)" stroke="#C4B5FD" strokeWidth="0.8" />

                {/* Dial Tick Marks (12, 3, 6, 9) */}
                <line x1="0" y1="-13" x2="0" y2="-10.5" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="13" y1="0" x2="10.5" y2="0" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="0" y1="13" x2="0" y2="10.5" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="-13" y1="0" x2="-10.5" y2="0" stroke="#7C3AED" strokeWidth="1.4" strokeLinecap="round" />

                {/* Center Hub */}
                <circle cx="0" cy="0" r="2.2" fill="#4338CA" />

                {/* Sweep Hand pointing to ~11 o'clock */}
                <line x1="0" y1="0" x2="-6.5" y2="-8" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="0" cy="0" r="1" fill="#FFFFFF" />

                {/* Specular Dial Flare */}
                <ellipse cx="-4" cy="-5" rx="5" ry="3" transform="rotate(-30 -4 -5)" fill="#FFFFFF" opacity="0.45" />
            </g>
        </svg>
    );
}

// ── 6. YOUTUBE CHANNEL Illustration: Smart Learning Screen + Play Button ────
export function YoutubeIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="ytFloor" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </radialGradient>
                {/* Modern Display Frame */}
                <linearGradient id="ytFrame" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="60%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                {/* Screen Glass */}
                <linearGradient id="ytScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E3A8A" />
                    <stop offset="40%" stopColor="#0F1E4A" />
                    <stop offset="100%" stopColor="#08102A" />
                </linearGradient>
                {/* Premium Volumetric YouTube Play Button */}
                <linearGradient id="ytBadge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF4D4D" />
                    <stop offset="40%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
                {/* Stand / Desk Base */}
                <linearGradient id="ytStand" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                {/* Open Notebook Pages */}
                <linearGradient id="ytBook" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
            </defs>

            {/* Ambient Floor Shadow */}
            <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="url(#ytFloor)" />

            {/* ── Open Knowledge Notebook resting under display ── */}
            <g transform="translate(20, 71)">
                {/* Left Page */}
                <path d="M 30 7 Q 15 2 0 6 L 0 11 Q 15 7 30 11 Z" fill="url(#ytBook)" />
                {/* Right Page */}
                <path d="M 30 7 Q 45 2 60 6 L 60 11 Q 45 7 30 11 Z" fill="url(#ytBook)" />
                {/* Book Spine */}
                <line x1="30" y1="6" x2="30" y2="12" stroke="#94A3B8" strokeWidth="1.2" />
                {/* Text lines */}
                <line x1="5" y1="8.5" x2="24" y2="8.5" stroke="#CBD5E1" strokeWidth="0.8" />
                <line x1="36" y1="8.5" x2="55" y2="8.5" stroke="#CBD5E1" strokeWidth="0.8" />
            </g>

            {/* ── Monitor Stand ── */}
            <path d="M 46 64 L 54 64 L 56 73 L 44 73 Z" fill="url(#ytStand)" />
            <ellipse cx="50" cy="73" rx="14" ry="2.5" fill="#475569" />

            {/* ── Smart Video Learning Display ── */}
            <g transform="translate(17, 16)">
                {/* Outer Monitor Bezel with Soft Bevel */}
                <rect
                    x="0"
                    y="0"
                    width="66"
                    height="48"
                    rx="5"
                    fill="url(#ytFrame)"
                    stroke="#475569"
                    strokeWidth="0.8"
                />

                {/* Inner Screen Display */}
                <rect x="2.5" y="2.5" width="61" height="43" rx="3.5" fill="url(#ytScreen)" />

                {/* Top Video Header: Live Stream / Academic Lecture Badge */}
                <circle cx="8" cy="7.5" r="1.8" fill="#EF4444" />
                <line x1="12" y1="7.5" x2="28" y2="7.5" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />

                {/* Soundwave / Audio Equalizer in bottom-left */}
                <line x1="7" y1="36" x2="7" y2="39" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
                <line x1="10" y1="34" x2="10" y2="39" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
                <line x1="13" y1="32" x2="13" y2="39" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
                <line x1="16" y1="35" x2="16" y2="39" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />

                {/* Video Scrubber / Progress Bar */}
                <line x1="22" y1="38" x2="58" y2="38" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="22" y1="38" x2="42" y2="38" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="42" cy="38" r="1.8" fill="#FFFFFF" />

                {/* ── Volumetric YouTube Play Button Centerpiece ── */}
                <g transform="translate(19, 13)">
                    {/* Ambient Glow */}
                    <rect x="0" y="0" width="28" height="19" rx="5.5" fill="#EF4444" opacity="0.25" filter="blur(2px)" />
                    {/* Red Rounded Button Body */}
                    <rect
                        x="0"
                        y="0"
                        width="28"
                        height="19"
                        rx="5.5"
                        fill="url(#ytBadge)"
                        stroke="#FECACA"
                        strokeWidth="0.6"
                    />
                    {/* Centered White Play Triangle */}
                    <polygon points="11,5.5 11,13.5 19,9.5" fill="#FFFFFF" />
                    {/* Specular Highlight */}
                    <ellipse cx="8" cy="4" rx="5" ry="1.8" transform="rotate(-15 8 4)" fill="#FFFFFF" opacity="0.4" />
                </g>
            </g>
        </svg>
    );
}
