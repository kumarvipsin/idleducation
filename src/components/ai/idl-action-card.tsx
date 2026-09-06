'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { AIAction } from '@/lib/ai/types';

interface IdlActionCardProps {
  action: AIAction;
}

export function IdlActionCard({ action }: IdlActionCardProps) {
  const isExternal = action.type === 'external';

  return (
    <Link
      href={action.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center justify-between w-full max-w-xs px-3 py-2.5 rounded-[9px] bg-[#F8FAFE] dark:bg-[#0e1420] border border-[#D0DCFF]/70 dark:border-[#2a3a70]/60 hover:bg-[#EEF2FF] dark:hover:bg-[#1e2d5a]/50 hover:border-[#93AEFF]/60 dark:hover:border-[#3B82F6]/40 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <span className="text-[12.5px] font-medium text-[#0B1F4B] dark:text-slate-200 leading-tight pr-2">
        {action.label}
      </span>
      <span className="shrink-0 w-5 h-5 rounded-[5px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center text-[#1D4ED8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-150">
        {isExternal
          ? <ExternalLink className="w-3 h-3" />
          : <ArrowRight className="w-3 h-3" />
        }
      </span>
    </Link>
  );
}
