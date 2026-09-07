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
          className="shrink-0 w-5 h-5 rounded-[6px] bg-[#1D4ED8] flex items-center justify-center mr-2 mb-0.5 shadow-[0_1px_3px_rgba(29,78,216,0.2)]"
          aria-hidden="true"
        >
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
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[85%] px-3.5 py-2.5 break-words',
          isAI
            ? [
                'bg-[#131826] border border-[#232C40]',
                'text-slate-100',
                'shadow-[0_4px_16px_rgba(0,0,0,0.35)]',
                'rounded-[14px] rounded-bl-[4px]',
              ]
            : [
                'bg-[#1E3A8A]/55 border border-[#3B82F6]/45',
                'text-blue-50',
                'shadow-[0_2px_10px_rgba(29,78,216,0.25)]',
                'rounded-[14px] rounded-br-[4px]',
              ]
        )}
      >
        {isAI ? (
          <div className="prose prose-sm prose-invert max-w-none text-[13px] leading-[1.65]
            prose-p:my-0.5 prose-p:leading-[1.65]
            prose-headings:text-[13px] prose-headings:font-semibold prose-headings:text-white prose-headings:my-1
            prose-strong:text-white prose-strong:font-semibold
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
            prose-code:text-[12px] prose-code:bg-[#1A2234] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-200
            prose-pre:bg-[#1A2234] prose-pre:rounded-[8px] prose-pre:text-[12px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-[13px] leading-[1.6] text-blue-50">
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
