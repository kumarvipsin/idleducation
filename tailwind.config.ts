import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', ...fontFamily.sans],
      },
      colors: {
        // Shadcn UI theme tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        purple: {
          DEFAULT: 'hsl(var(--purple))',
          foreground: 'hsl(var(--purple-foreground))',
        },
        // IDL Education Premium Design System Tokens
        primaryBlue: {
          DEFAULT: '#0A5CFF',
          dark: '#0848CC',
          light: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#0A5CFF',
          600: '#0848CC',
          700: '#1D4ED8',
        },
        accentGold: {
          DEFAULT: '#E5B800',
          light: '#FDE047',
          dark: '#CA8A04',
          50: '#FEFCE8',
          100: '#FEF9C3',
        },
        neutral100: '#F8FAFC',
        neutral200: '#E2E8F0',
        neutral300: '#CBD5E1',
        neutral600: '#4B5563',
        neutral900: '#111827',
        surfacePrimary: '#FFFFFF',
        surfaceSecondary: '#F8FAFC',
        surfaceTertiary: '#F1F5F9',
        idlNavy: {
          DEFAULT: '#06122E',
          950: '#030B1E',
          900: '#06122E',
          800: '#0B1F4B',
          700: '#0A225C',
          600: '#0E2E7B',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '1': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        '2': '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)',
        '3': '0 8px 24px rgba(10,92,255,0.12), 0 4px 10px rgba(0,0,0,0.06)',
        'premium': '0 20px 40px -15px rgba(10, 92, 255, 0.08), 0 0 0 1px rgba(10, 92, 255, 0.05)',
      },
      keyframes: {
        'collapsible-down': {
          from: {
            height: '0',
            opacity: '0',
          },
          to: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
        },
        'collapsible-up': {
          from: {
            height: 'var(--radix-collapsible-content-height)',
            opacity: '1',
          },
          to: {
            height: '0',
            opacity: '0',
          },
        },
        'marquee-slower': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-vertical-slow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'marquee-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'morph': {
          '0%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          },
          '100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'marquee-slower': 'marquee-slower 60s linear infinite',
        'marquee-slower-reverse': 'marquee-slower 60s linear infinite reverse',
        'marquee-vertical-slow': 'marquee-vertical-slow 20s linear infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'gradient-x': 'gradient-x 5s ease infinite',
        'marquee-scroll': 'marquee-scroll 40s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 20s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
