'use client';

import React from 'react';
import { AttendanceProvider, useAttendance } from '@/context/attendance-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function ToastContainer() {
  const { toasts, removeToast } = useAttendance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderBg = 'bg-slate-900 text-white border-slate-800';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          borderBg = 'bg-rose-950 text-white border-rose-800';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          borderBg = 'bg-amber-950 text-white border-amber-800';
          Icon = AlertCircle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          borderBg = 'bg-blue-950 text-white border-blue-800';
          Icon = Info;
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border shadow-xl text-xs font-medium animate-in slide-in-from-bottom-2 duration-200 ${borderBg}`}
          >
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MainAttendanceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased">
      <div className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </div>
      <ToastContainer />
    </div>
  );
}

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AttendanceProvider>
      <MainAttendanceShell>{children}</MainAttendanceShell>
    </AttendanceProvider>
  );
}
