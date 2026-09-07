'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, RotateCcw, ChevronDown, Plus } from 'lucide-react';
import { AIMessage, AIAction } from '@/lib/ai/types';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';

// ── 1. COURSES ILLUSTRATED ICON (Study Book & Sparkles) ──
function CoursesIllustIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
      {/* Top golden sparkle */}
      <path d="M26 6L27.5 3L29 6L32 7.5L29 9L27.5 12L26 9L23 7.5L26 6Z" fill="#F59E0B" />
      {/* Left Page Base */}
      <path d="M7 11.5C7 10.4 7.9 9.5 9 9.5H17.5V26.5H9C7.9 26.5 7 25.6 7 24.5V11.5Z" fill="#2563EB" />
      {/* Right Page Base */}
      <path d="M29 11.5C29 10.4 28.1 9.5 27 9.5H18.5V26.5H27C28.1 26.5 29 25.6 29 24.5V11.5Z" fill="#3B82F6" />
      {/* Spine & Pages */}
      <path d="M18 9.5V26.5" stroke="#1D4ED8" strokeWidth="1.6" />
      <rect x="9.5" y="12" width="5.5" height="1.6" rx="0.8" fill="#BFDBFE" />
      <rect x="9.5" y="15.5" width="5.5" height="1.6" rx="0.8" fill="#BFDBFE" />
      <rect x="9.5" y="19" width="4" height="1.6" rx="0.8" fill="#BFDBFE" />
      <rect x="21" y="12" width="5.5" height="1.6" rx="0.8" fill="#DBEAFE" />
      <rect x="21" y="15.5" width="5.5" height="1.6" rx="0.8" fill="#DBEAFE" />
      <rect x="21" y="19" width="4" height="1.6" rx="0.8" fill="#DBEAFE" />
      {/* Red Bookmark Ribbon */}
      <path d="M16 9.5V17L18 15.5L20 17V9.5" fill="#EF4444" />
    </svg>
  );
}

// ── 2. MATHS HELP ILLUSTRATED ICON (Purple Calculator & Math Symbols) ──
function MathsIllustIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
      {/* Golden Sparkle */}
      <path d="M27 7L28.2 4.8L30.5 3.6L28.2 2.4L27 0.2L25.8 2.4L23.5 3.6L25.8 4.8L27 7Z" fill="#F59E0B" />
      {/* Calculator Body */}
      <rect x="8" y="8" width="20" height="23" rx="4.5" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.4" />
      {/* LCD Screen */}
      <rect x="11" y="11" width="14" height="6" rx="2" fill="#EDE9FE" />
      <rect x="13" y="13" width="7" height="2" rx="1" fill="#7C3AED" />
      {/* Keypad Buttons */}
      <circle cx="13" cy="21" r="1.6" fill="#DDD6FE" />
      <circle cx="18" cy="21" r="1.6" fill="#DDD6FE" />
      <circle cx="23" cy="21" r="1.6" fill="#F59E0B" />
      <circle cx="13" cy="26" r="1.6" fill="#DDD6FE" />
      <circle cx="18" cy="26" r="1.6" fill="#DDD6FE" />
      <rect x="21.5" y="24.5" width="3.2" height="3.2" rx="1" fill="#10B981" />
    </svg>
  );
}

// ── 3. SCIENCE ILLUSTRATED ICON (Emerald Beaker Flask & Bubbles) ──
function ScienceIllustIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
      {/* Golden Sparkle */}
      <path d="M27 7L28 4.5L30.5 3.5L28 2.5L27 0L26 2.5L23.5 3.5L26 4.5L27 7Z" fill="#F59E0B" />
      {/* Flask Neck & Rim */}
      <path d="M14 7H22" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 7V12L9.5 21.5C8.8 22.8 9.7 24.5 11.2 24.5H24.8C26.3 24.5 27.2 22.8 26.5 21.5L21 12V7" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Emerald Glowing Liquid */}
      <path d="M11.5 18H24.5L23.8 22.5C23.5 23.2 22.8 23.8 22 23.8H14C13.2 23.8 12.5 23.2 12.2 22.5L11.5 18Z" fill="#10B981" />
      <path d="M12 18C14 17.2 16 18.8 18 18C20 17.2 22 18.8 24 18" stroke="#6EE7B7" strokeWidth="1.4" strokeLinecap="round" />
      {/* Bubbles */}
      <circle cx="15" cy="20.5" r="1.3" fill="#A7F3D0" />
      <circle cx="19" cy="16" r="1.6" fill="#6EE7B7" />
      <circle cx="21" cy="20.5" r="1" fill="#ECFDF5" />
    </svg>
  );
}

// ── 4. EXAM PREP ILLUSTRATED ICON (Rose Checklist Notebook & Pencil) ──
function ExamPrepIllustIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
      {/* Sparkles */}
      <path d="M26 6L27.5 4L29 6L31 7.5L29 9L27.5 11L26 9L24 7.5L26 6Z" fill="#F43F5E" />
      {/* Notebook Base */}
      <rect x="7.5" y="9" width="17" height="21" rx="3.5" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.4" />
      <rect x="9.5" y="11" width="13" height="17" rx="2" fill="#FFF1F2" />
      {/* Checklist items */}
      <rect x="11.5" y="14" width="3" height="3" rx="0.8" fill="#F43F5E" />
      <path d="M12 15.5L13 16.5L15.5 14" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M16 15.5H20.5" stroke="#F43F5E" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="11.5" y="19" width="3" height="3" rx="0.8" fill="#F43F5E" />
      <path d="M12 20.5L13 21.5L15.5 19" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M16 20.5H19.5" stroke="#F43F5E" strokeWidth="1.3" strokeLinecap="round" />
      {/* Angled Pencil */}
      <g transform="rotate(32 24 17)">
        <rect x="21" y="6" width="4" height="14" rx="1" fill="#FACC15" stroke="#A16207" strokeWidth="0.9" />
        <path d="M21 20L23 23L25 20H21Z" fill="#EA580C" />
        <circle cx="23" cy="22.5" r="0.5" fill="#111827" />
        <rect x="21" y="5" width="4" height="1.8" fill="#E11D48" />
      </g>
    </svg>
  );
}

// ── 5. ADMISSION ILLUSTRATED ICON (Mint Diploma Scroll & Ribbon Bow) ──
function AdmissionIllustIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={cn("shrink-0", className)} aria-hidden="true">
      {/* Sparkles */}
      <path d="M18 4V2" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13 5.5L11.5 4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23 5.5L24.5 4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
      {/* Scroll Roll */}
      <rect x="5.5" y="12" width="25" height="10.5" rx="3.5" fill="#6EE7B7" stroke="#047857" strokeWidth="1.4" />
      <path d="M8.5 12V22.5" stroke="#047857" strokeWidth="1.4" />
      <path d="M27.5 12V22.5" stroke="#047857" strokeWidth="1.4" />
      {/* Ribbon Wrap */}
      <rect x="16" y="11" width="4" height="12.5" rx="0.8" fill="#065F46" />
      <circle cx="18" cy="10.5" r="2" fill="#F59E0B" />
      {/* Ribbon Tails */}
      <path d="M17 23.5L15 28.5L17.5 27L19.5 28.5L19 23.5" fill="#065F46" />
      {/* Graduation Cap Accent */}
      <path d="M25 8L30 10.5L25 13L20 10.5L25 8Z" fill="#1E3A8A" />
      <path d="M22 11.8V14C22 15 23.3 15.8 25 15.8C26.7 15.8 28 15 28 14V11.8" stroke="#1E3A8A" strokeWidth="0.9" fill="#2563EB" />
      <path d="M29 11V15" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" />
      <circle cx="29" cy="15.5" r="0.8" fill="#F59E0B" />
    </svg>
  );
}

interface ChatPanelProps {
  onClose: () => void;
  isOpen: boolean;
}

const QUICK_ACTIONS = [
  {
    label: 'Courses',
    prompt: 'What IDL courses do you have?',
    icon: CoursesIllustIcon,
    bgTint: 'bg-blue-950/70 border-blue-800/60',
  },
  {
    label: 'Maths Help',
    prompt: 'Help me with a maths problem',
    icon: MathsIllustIcon,
    bgTint: 'bg-purple-950/70 border-purple-800/60',
  },
  {
    label: 'Science',
    prompt: 'Explain a science concept to me',
    icon: ScienceIllustIcon,
    bgTint: 'bg-emerald-950/70 border-emerald-800/60',
  },
  {
    label: 'Exam Prep',
    prompt: 'How should I prepare for my exam?',
    icon: ExamPrepIllustIcon,
    bgTint: 'bg-rose-950/70 border-rose-800/60',
  },
  {
    label: 'Admission',
    prompt: 'How do I apply for admission at IDL?',
    icon: AdmissionIllustIcon,
    bgTint: 'bg-teal-950/70 border-teal-800/60',
  },
];

export function ChatPanel({ onClose, isOpen }: ChatPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [actionsMap, setActionsMap] = useState<Record<number, AIAction[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 180);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleScroll = () => {
    const el = chatAreaRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
  };

  const handleActionClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const startNewChat = () => {
    setMessages([]);
    setActionsMap({});
    setError(null);
    setInputValue('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    if (inputRef.current) inputRef.current.style.height = 'auto';

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const aiMessage: AIMessage = { role: 'assistant', content: data.answer };
      const nextIndex = newMessages.length;
      setMessages([...newMessages, aiMessage]);

      if (data.actions?.length > 0) {
        setActionsMap(prev => ({ ...prev, [nextIndex]: data.actions }));
      }
    } catch (err: any) {
      setError('Unable to reach the assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const [isActivating, setIsActivating] = useState(false);

  // Trigger brief activation animation sequence when opened
  useEffect(() => {
    if (isOpen) {
      setIsActivating(true);
      const timer = setTimeout(() => setIsActivating(false), 450);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Accessibility: dismiss panel on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const isEmpty = messages.length === 0;

  return (
    <div
      role="dialog"
      aria-label="IDL AI Study Copilot"
      aria-modal="true"
      style={{ backgroundColor: '#0A0D16' }}
      className={cn(
        'fixed z-[56] flex flex-col overflow-hidden',
        // Surface & Edge: Google Gemini deep dark studio container with crisp border & deep shadow
        'text-slate-100',
        'border border-[#222C40]',
        'shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]',
        // Mobile: compact floating sheet window with safe margins
        'bottom-3.5 left-2.5 right-2.5 mx-auto max-w-[calc(100%-20px)] w-[calc(100%-20px)] rounded-[20px]',
        'h-[74vh] min-h-[420px] max-h-[540px]',
        // Desktop: compact application window with 20px radius
        'sm:bottom-[76px] sm:right-6 sm:left-auto sm:max-w-none',
        'sm:w-[410px] md:w-[430px] sm:h-[530px] md:h-[550px] sm:max-h-[calc(100vh-96px)]',
        // Unique AI activation animation: opacity, translateY & subtle scale
        'transition-all duration-300 ease-out will-change-transform',
        isOpen
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-2.5 opacity-0 scale-[0.98] pointer-events-none'
      )}
    >
      {/* ── TOP HEADER (GEMINI MINIMAL DARK HEADER) ── */}
      <div 
        style={{ backgroundColor: '#0A0D16' }}
        className="flex items-center justify-between px-3.5 py-2.5 shrink-0 relative z-20 border-b border-[#1A2234]"
      >
        <div className="flex items-center gap-2">
          {/* Subtle glowing IDL spark */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-[1px] shadow-[0_0_10px_rgba(59,130,246,0.4)]">
            <div className="w-full h-full rounded-full bg-[#0A0D16] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
          <span className="text-[13px] font-medium tracking-tight text-white/95">
            IDL AI
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300">
            Copilot
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              title="Start new conversation"
              aria-label="New chat"
              className="w-7 h-7 rounded-full text-slate-400 hover:text-white hover:bg-[#1A2338] transition-colors duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close IDL AI Study Copilot"
            className="w-7 h-7 rounded-full text-slate-400 hover:text-white bg-[#141A28] hover:bg-[#1F273C] border border-slate-700/60 transition-colors duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ── REALISTIC GEMINI NEBULA BACKGROUND WORKSPACE ── */}
      <div 
        style={{ backgroundColor: '#0A0D16' }}
        className="flex-1 relative overflow-hidden flex flex-col"
      >
        {/* Core Gemini Deep Blue Radial Nebula Aura */}
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_95%_75%_at_50%_46%,rgba(29,78,216,0.36)_0%,rgba(15,23,42,0.70)_48%,rgba(10,13,22,0.98)_78%,#0A0D16_100%)]" 
          aria-hidden="true" 
        />
        {/* Intense Center Core Glow */}
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_42%,rgba(59,130,246,0.24)_0%,transparent_60%)]" 
          aria-hidden="true" 
        />
        {/* Subtle Ambient Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" 
          aria-hidden="true" 
        />
        {/* Micro-dot texture for depth */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[radial-gradient(#60A5FA_1px,transparent_1px)] [background-size:18px_18px]" 
          aria-hidden="true" 
        />

        <div
          ref={chatAreaRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain relative z-10 flex flex-col"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#2A364F transparent' }}
        >
          {isEmpty ? (
            /* ── GEMINI INSPIRED WELCOME STATE ── */
            <div className="flex flex-col items-center justify-center my-auto px-4 py-3 sm:py-3.5 text-center">
              {/* Central Glowing Emblem */}
              <div className="relative mb-3">
                <div className="absolute -inset-2 rounded-full bg-blue-500/25 blur-[10px] pointer-events-none" />
                <div className="relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-[16px] bg-gradient-to-b from-[#162138] to-[#0D1424] border border-blue-500/35 shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center p-2.5 overflow-hidden">
                  <Image
                    src="/idllogo.png"
                    alt="IDL Education Logo"
                    width={38}
                    height={38}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                    priority
                  />
                </div>
              </div>

              {/* Exact Gemini Greeting Typography */}
              <h2 className="text-[20px] sm:text-[22px] font-normal text-white leading-tight tracking-tight mb-1">
                What can I help with?
              </h2>
              <p className="text-[11.5px] sm:text-[12px] text-slate-400 leading-snug mb-3.5 max-w-[260px]">
                Ask about courses, admissions, exam tips, or learning help.
              </p>

              {/* Illustrated Quick Action Cards in Gemini Dark Glass */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-[310px] sm:max-w-[330px]">
                {QUICK_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  const isLast = idx === QUICK_ACTIONS.length - 1;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action.prompt)}
                      className={cn(
                        'group flex items-center gap-2 p-1.5 sm:p-2 text-left',
                        'rounded-[12px]',
                        'bg-[#121826]/85 hover:bg-[#1A2234]',
                        'border border-[#222C40] hover:border-blue-500/50',
                        'shadow-[0_2px_8px_rgba(0,0,0,0.35)]',
                        'hover:shadow-[0_4px_16px_rgba(29,78,216,0.25)]',
                        'hover:-translate-y-0.5 active:translate-y-0',
                        'transition-all duration-150 ease-out cursor-pointer',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                        isLast && 'col-span-2 justify-center'
                      )}
                    >
                      <div className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-[9px] flex items-center justify-center shrink-0 border transition-transform duration-150 group-hover:scale-105',
                        action.bgTint
                      )}>
                        <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </div>
                      <span className="text-[12px] sm:text-[12.5px] font-medium text-slate-200 group-hover:text-white tracking-tight truncate">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── MESSAGES CONVERSATION AREA ── */
            <div className="flex flex-col px-3.5 py-4 gap-0">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} actions={actionsMap[idx]} />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-end gap-2 mb-2.5">
                  <div className="w-5 h-5 rounded-[6px] bg-[#1D4ED8] flex items-center justify-center shrink-0 mb-0.5 shadow-[0_0_10px_rgba(29,78,216,0.5)]">
                    <svg viewBox="0 0 28 28" fill="none" className="w-3 h-3" aria-hidden="true">
                      <circle cx="14" cy="3" r="1.6" fill="white" />
                      <path d="M14 4.6V6.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      <rect x="2.5" y="9.8" width="2.2" height="6.4" rx="1.1" fill="white" opacity="0.9" />
                      <rect x="23.3" y="9.8" width="2.2" height="6.4" rx="1.1" fill="white" opacity="0.9" />
                      <rect x="4.2" y="6.8" width="19.6" height="14.4" rx="5.8" fill="white" />
                      <rect x="6.8" y="9.4" width="14.4" height="8.8" rx="3.4" fill="#0B2568" />
                      <rect x="9.4" y="11.4" width="2.8" height="4.6" rx="1.4" fill="white" />
                      <rect x="15.8" y="11.4" width="2.8" height="4.6" rx="1.4" fill="white" />
                    </svg>
                  </div>
                  <div className="bg-[#141A28] border border-[#242E44] rounded-[13px] rounded-bl-[3px] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    <div className="flex items-center gap-1.5" aria-label="AI is thinking">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-duration:1s] [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-duration:1s] [animation-delay:180ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-duration:1s] [animation-delay:360ms]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="flex items-end gap-2 mb-2.5">
                  <div className="w-5 h-5 rounded-[6px] bg-red-600 flex items-center justify-center shrink-0 mb-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-[#1B141B] border border-red-900/50 rounded-[13px] rounded-bl-[3px] px-3.5 py-2.5">
                    <p className="text-[13px] text-red-300 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom floating button */}
        {showScrollBtn && !isEmpty && (
          <button
            onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll to latest message"
            className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-[#161D2D] border border-slate-700 shadow-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors z-20"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── GEMINI PILL SEARCH / COMPOSER SECTION ── */}
      <div 
        style={{ backgroundColor: '#0A0D16' }}
        className="shrink-0 px-3.5 pt-2.5 pb-3 sm:px-4 sm:pt-2.5 sm:pb-3.5 border-t border-[#192233] relative z-20"
      >
        <div
          className={cn(
            'flex items-center gap-2',
            'bg-[#161B26] hover:bg-[#19202E]',
            'border border-[#283246] focus-within:border-blue-500/80',
            'rounded-[26px]',
            'focus-within:bg-[#182030]',
            'focus-within:ring-2 focus-within:ring-blue-500/20',
            'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
            'transition-all duration-150 ease-out',
            'pl-2.5 pr-2 py-1.5'
          )}
        >
          {/* Gemini '+' Action Button */}
          <button
            type="button"
            title="Attach or select prompt"
            aria-label="Add attachment"
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-[#20293B] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
          </button>

          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask IDL AI..."
            disabled={isLoading}
            rows={1}
            aria-label="Message IDL AI"
            className={cn(
              'flex-1 bg-transparent border-0 outline-none focus:ring-0 resize-none',
              'text-[13px] leading-[19px] text-slate-100',
              'placeholder:text-slate-400/80',
              'py-1 px-1 m-0 max-h-[72px] min-h-[22px]',
              'disabled:opacity-60 block'
            )}
            style={{ height: 'auto' }}
          />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              'shrink-0 w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] flex items-center justify-center',
              'rounded-full',
              'bg-[#1D4ED8] hover:bg-[#2563EB]',
              'text-white',
              'shadow-[0_0_12px_rgba(29,78,216,0.5)]',
              'hover:shadow-[0_0_16px_rgba(37,99,235,0.7)]',
              'active:scale-[0.92]',
              'transition-all duration-150 ease-out cursor-pointer',
              'disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400'
            )}
          >
            <Send className="w-3.5 h-3.5 ml-px" />
          </button>
        </div>
      </div>
    </div>
  );
}
