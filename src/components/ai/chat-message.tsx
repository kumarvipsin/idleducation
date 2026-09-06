'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIMessage, AIAction } from '@/lib/ai/types';
import { IdlActionCard } from './idl-action-card';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AIMessage;
  actions?: AIAction[];
}

export function ChatMessage({ message, actions }: ChatMessageProps) {
  const isAI = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full mb-2.5',
        isAI ? 'justify-start items-end' : 'justify-end items-end'
      )}
    >
      {/* AI avatar — small, consistent with header icon */}
      {isAI && (
        <div
          className="shrink-0 w-5 h-5 rounded-[6px] bg-[#EEF2FF] dark:bg-[#1e2d5a]/60 border border-[#C7D4FF]/60 dark:border-[#2a3a70]/60 flex items-center justify-center mr-2 mb-0.5"
          aria-hidden="true"
        >
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L9.5 5.5L13 5.5L10.5 7.5L11.5 11L8 9L4.5 11L5.5 7.5L3 5.5L6.5 5.5L8 2Z" fill="#1D4ED8" fillOpacity="0.9"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[83%] px-3.5 py-2.5 break-words',
          isAI
            ? [
                'bg-white dark:bg-[#151c2e]',
                'border border-slate-200/70 dark:border-slate-700/50',
                'text-[#1e293b] dark:text-slate-200',
                'shadow-[0_1px_4px_rgba(11,31,75,0.05)]',
                'rounded-[13px] rounded-bl-[3px]',
              ]
            : [
                'bg-[#EEF2FF] dark:bg-[#1e2d5a]/70',
                'border border-[#D0DCFF]/60 dark:border-[#2a3a70]/60',
                'text-[#0B1F4B] dark:text-blue-100',
                'rounded-[13px] rounded-br-[3px]',
              ]
        )}
      >
        {isAI ? (
          <div className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-[1.65]
            prose-p:my-0.5 prose-p:leading-[1.65]
            prose-headings:text-[13px] prose-headings:font-semibold prose-headings:text-[#0B1F4B] dark:prose-headings:text-slate-200 prose-headings:my-1
            prose-strong:text-[#0B1F4B] dark:prose-strong:text-slate-200 prose-strong:font-semibold
            prose-a:text-[#1D4ED8] dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
            prose-code:text-[12px] prose-code:bg-[#F1F5F9] dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[#0B1F4B] dark:prose-code:text-slate-200
            prose-pre:bg-[#F1F5F9] dark:prose-pre:bg-slate-800 prose-pre:rounded-[8px] prose-pre:text-[12px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-[13px] leading-[1.6] text-[#0B1F4B] dark:text-blue-50">
            {message.content}
          </p>
        )}

        {isAI && actions && actions.length > 0 && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {actions.map((action, idx) => (
              <IdlActionCard key={idx} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
