'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Send, RotateCcw, ChevronDown, BookOpen, Calculator, FlaskConical, ClipboardList, GraduationCap } from 'lucide-react';
import { AIMessage, AIAction } from '@/lib/ai/types';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  onClose: () => void;
  isOpen: boolean;
}

const QUICK_ACTIONS = [
  { label: 'Courses', prompt: 'What IDL courses do you have?', icon: BookOpen },
  { label: 'Maths Help', prompt: 'Help me with a maths problem', icon: Calculator },
  { label: 'Science', prompt: 'Explain a science concept to me', icon: FlaskConical },
  { label: 'Exam Prep', prompt: 'How should I prepare for my exam?', icon: ClipboardList },
  { label: 'Admission', prompt: 'How do I apply for admission at IDL?', icon: GraduationCap },
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

  const isEmpty = messages.length === 0;

  return (
    <div
      role="dialog"
      aria-label="IDL AI Assistant"
      aria-modal="true"
      className={cn(
        'fixed z-[56] flex flex-col overflow-hidden',
        // Background: clean, near-white with very subtle warmth
        'bg-[#F9FAFB] dark:bg-[#0E1420]',
        // Precise border — 1px, very subtle
        'border border-slate-200/80 dark:border-slate-700/50',
        // Layered shadow — natural depth, not glowing
        'shadow-[0_8px_32px_rgba(11,31,75,0.10),0_1px_4px_rgba(11,31,75,0.06)]',
        'dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
        // Mobile: bottom sheet
        'bottom-0 left-0 right-0 rounded-t-[18px]',
        'h-[80vh] max-h-[600px]',
        // Desktop: compact floating panel
        'sm:bottom-[148px] sm:right-5 sm:left-auto sm:rounded-[14px]',
        'sm:w-[352px] sm:h-auto sm:max-h-[540px] xl:w-[368px]',
        // Open/close transition
        'transition-all duration-200 ease-out will-change-transform',
        isOpen
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-3 opacity-0 pointer-events-none'
      )}
    >
      {/* Top drag handle — mobile only */}
      <div className="sm:hidden flex justify-center pt-2.5 pb-0 shrink-0">
        <div className="w-8 h-1 rounded-full bg-slate-300/70 dark:bg-slate-700" />
      </div>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-4 sm:py-3 border-b border-slate-200/70 dark:border-slate-800/70 shrink-0 bg-white/80 dark:bg-[#0E1420]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          {/* IDL AI Mark */}
          <div className="w-8 h-8 rounded-[9px] bg-[#EEF2FF] dark:bg-[#1e2d5a]/60 border border-[#C7D4FF]/60 dark:border-[#2a3a70]/60 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2L9.5 5.5L13 5.5L10.5 7.5L11.5 11L8 9L4.5 11L5.5 7.5L3 5.5L6.5 5.5L8 2Z" fill="#1D4ED8" fillOpacity="0.9"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#0B1F4B] dark:text-slate-100 leading-none tracking-[-0.01em]">
              IDL Smart Assistant
            </p>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 leading-none mt-1">
              Your smart study assistant.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          {messages.length > 0 && (
            <button
              onClick={startNewChat}
              title="New chat"
              aria-label="Start new chat"
              className="p-1.5 rounded-[7px] text-slate-400 hover:text-[#1D4ED8] hover:bg-[#EEF2FF] dark:hover:bg-[#1e2d5a]/50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close IDL AI"
            className="p-1.5 rounded-[7px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CHAT / WELCOME AREA ── */}
      <div
        ref={chatAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
      >
        {isEmpty ? (
          /* ── WELCOME STATE ── */
          <div className="flex flex-col items-center justify-center h-full px-5 py-8 text-center">
            {/* IDL Logo — round with outline */}
            <div className="w-12 h-12 rounded-full bg-white dark:bg-white border-2 border-[#1D4ED8]/25 shadow-[0_2px_10px_rgba(29,78,216,0.12)] ring-4 ring-[#EEF2FF] dark:ring-blue-950/40 flex items-center justify-center p-2 mb-3.5 overflow-hidden shrink-0">
              <Image
                src="/idllogo.png"
                alt="IDL Education Logo"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <h2 className="text-[17px] font-bold text-[#0B1F4B] dark:text-slate-100 leading-tight tracking-[-0.01em] mb-1.5">
              Hi! I'm IDL AI
            </h2>
            <p className="text-[12.5px] text-slate-400 dark:text-slate-500 leading-[1.6] mb-6 max-w-[210px]">
              Ask me anything about courses,<br />study help, or admission.
            </p>

            {/* Quick action chips — compact, icon-led, text-first */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-[280px]">
              {QUICK_ACTIONS.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleActionClick(action.prompt)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5',
                      'text-[11.5px] font-medium tracking-[-0.005em]',
                      'rounded-[7px]',
                      'bg-white dark:bg-[#151c2e]',
                      'border border-slate-200 dark:border-slate-700/70',
                      'text-[#1e3464] dark:text-slate-300',
                      'hover:bg-[#EEF2FF] dark:hover:bg-[#1e2d5a]/60',
                      'hover:border-[#C7D4FF] dark:hover:border-[#2a3a70]',
                      'hover:text-[#1D4ED8] dark:hover:text-blue-300',
                      'transition-all duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1'
                    )}
                  >
                    <Icon className="w-3 h-3 shrink-0 text-[#1D4ED8]/60 dark:text-blue-400/60" aria-hidden="true" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── MESSAGES ── */
          <div className="flex flex-col px-3.5 py-4 gap-0">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} actions={actionsMap[idx]} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-end gap-2 mb-2.5">
                <div className="w-5 h-5 rounded-[6px] bg-[#EEF2FF] dark:bg-[#1e2d5a]/60 border border-[#C7D4FF]/60 dark:border-[#2a3a70]/60 flex items-center justify-center shrink-0 mb-0.5">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2L9.5 5.5L13 5.5L10.5 7.5L11.5 11L8 9L4.5 11L5.5 7.5L3 5.5L6.5 5.5L8 2Z" fill="#1D4ED8"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-[#151c2e] border border-slate-200/70 dark:border-slate-700/50 rounded-[12px] rounded-bl-[3px] px-3.5 py-2.5 shadow-[0_1px_4px_rgba(11,31,75,0.05)]">
                  <div className="flex items-center gap-1.5" aria-label="AI is thinking">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93AEFF] animate-bounce [animation-duration:1s] [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93AEFF] animate-bounce [animation-duration:1s] [animation-delay:180ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93AEFF] animate-bounce [animation-duration:1s] [animation-delay:360ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Error — looks like a message, not a red box */}
            {error && (
              <div className="flex items-end gap-2 mb-2.5">
                <div className="w-5 h-5 rounded-[6px] bg-[#EEF2FF] dark:bg-[#1e2d5a]/60 border border-[#C7D4FF]/60 flex items-center justify-center shrink-0 mb-0.5">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2L9.5 5.5L13 5.5L10.5 7.5L11.5 11L8 9L4.5 11L5.5 7.5L3 5.5L6.5 5.5L8 2Z" fill="#1D4ED8"/>
                  </svg>
                </div>
                <div className="bg-white dark:bg-[#151c2e] border border-slate-200/70 dark:border-slate-700/50 rounded-[12px] rounded-bl-[3px] px-3.5 py-2.5 shadow-[0_1px_4px_rgba(11,31,75,0.05)]">
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Scroll to bottom */}
      {showScrollBtn && !isEmpty && (
        <button
          onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to latest message"
          className="absolute bottom-[72px] right-3.5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#1D4ED8] transition-colors z-10"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ── INPUT AREA ── */}
      <div className="shrink-0 px-3.5 pb-3.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3 border-t border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-[#0E1420]/90 backdrop-blur-sm">
        <div
          className={cn(
            'flex items-center gap-2',
            'bg-[#F9FAFB] dark:bg-[#0c1218]',
            'border border-slate-200/80 dark:border-slate-700/60',
            'rounded-[11px]',
            'focus-within:border-[#93AEFF]/80 dark:focus-within:border-[#3B82F6]/50',
            'focus-within:shadow-[0_0_0_3px_rgba(147,174,255,0.15)]',
            'transition-all duration-150',
            'px-3.5 py-1.5'
          )}
        >
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={isLoading}
            rows={1}
            aria-label="Message IDL AI"
            className={cn(
              'flex-1 bg-transparent border-0 outline-none focus:ring-0 resize-none',
              'text-[13.5px] leading-[20px] text-[#0B1F4B] dark:text-slate-200',
              'placeholder:text-slate-400/80 dark:placeholder:text-slate-600',
              'py-1.5 px-0 m-0 max-h-[96px] min-h-[20px]',
              'disabled:opacity-60 block'
            )}
            style={{ height: 'auto' }}
          />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              'shrink-0 w-[30px] h-[30px] flex items-center justify-center',
              'rounded-[8px]',
              'bg-[#1D4ED8] dark:bg-[#2563EB]',
              'text-white',
              'shadow-[0_1px_4px_rgba(29,78,216,0.3)]',
              'hover:bg-[#1B45C0] dark:hover:bg-[#1D4ED8]',
              'hover:shadow-[0_2px_8px_rgba(29,78,216,0.4)]',
              'active:scale-[0.93]',
              'transition-all duration-150',
              'disabled:opacity-35 disabled:shadow-none disabled:hover:bg-[#1D4ED8] disabled:active:scale-100',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1'
            )}
          >
            <Send className="w-3.5 h-3.5 ml-px" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-300/80 dark:text-slate-700 mt-2 leading-none tracking-wide select-none">
          IDL AI · Powered by Google Gemini
        </p>
      </div>
    </div>
  );
}
