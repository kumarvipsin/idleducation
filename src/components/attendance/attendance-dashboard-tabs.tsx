'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, School, Users, Radio, FileText, Plus } from 'lucide-react';

interface AttendanceDashboardTabsProps {
  onAddClass?: () => void;
  onAddBatch?: () => void;
  onAddStudent?: () => void;
}

const ATTENDANCE_TABS = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    href: '/admin/attendance',
    icon: TrendingUp,
    match: (pathname: string) => pathname === '/admin/attendance',
  },
  {
    id: 'classes',
    label: 'CLASS/BATCH',
    href: '/admin/attendance/classes',
    icon: School,
    match: (pathname: string) => pathname.startsWith('/admin/attendance/classes'),
  },
  {
    id: 'students',
    label: 'STUDENTS',
    href: '/admin/attendance/students',
    icon: Users,
    match: (pathname: string) =>
      pathname.startsWith('/admin/attendance/students') ||
      pathname.startsWith('/admin/attendance/student/'),
  },
  {
    id: 'live',
    label: 'LIVE ATTENDANCE',
    href: '/admin/attendance/live',
    icon: Radio,
    match: (pathname: string) => pathname.startsWith('/admin/attendance/live'),
  },
  {
    id: 'reports',
    label: 'WEEKLY & MONTHLY REPORTS',
    href: '/admin/attendance/reports',
    icon: FileText,
    match: (pathname: string) =>
      pathname.startsWith('/admin/attendance/reports') ||
      pathname.startsWith('/admin/attendance/weekly') ||
      pathname.startsWith('/admin/attendance/monthly'),
  },
];

const quickActionClass =
  'group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none whitespace-nowrap';

const plusCircleClass =
  'w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors';

const plusIconClass =
  'w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors';

export function AttendanceDashboardTabs({
  onAddClass,
  onAddBatch,
  onAddStudent,
}: AttendanceDashboardTabsProps) {
  const pathname = usePathname() || '/admin/attendance';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5 print:hidden">
      <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
        <nav
          aria-label="Attendance Dashboard Sections"
          className="bg-transparent dark:bg-transparent p-0 rounded-none h-auto flex items-center gap-1 sm:gap-6 min-w-max border-0 shadow-none"
        >
          {ATTENDANCE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.match(pathname);
            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 uppercase cursor-pointer whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'text-[#2864E8] dark:text-blue-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-[15px] h-[15px] shrink-0" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Action Controls — Always visible across all 5 Attendance Dashboard tabs */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-1">
        {onAddClass ? (
          <button
            type="button"
            onClick={onAddClass}
            className={quickActionClass}
            title="Add Class"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>CLASS</span>
          </button>
        ) : (
          <Link
            href="/admin/attendance/classes?action=add-class"
            className={quickActionClass}
            title="Add Class"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>CLASS</span>
          </Link>
        )}

        {onAddBatch ? (
          <button
            type="button"
            onClick={onAddBatch}
            className={quickActionClass}
            title="Add Batch"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>BATCH</span>
          </button>
        ) : (
          <Link
            href="/admin/attendance/classes?action=add-batch"
            className={quickActionClass}
            title="Add Batch"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>BATCH</span>
          </Link>
        )}

        {onAddStudent ? (
          <button
            type="button"
            onClick={onAddStudent}
            className={quickActionClass}
            title="Add Student"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>STUDENT</span>
          </button>
        ) : (
          <Link
            href="/admin/attendance/students?action=add-student"
            className={quickActionClass}
            title="Add Student"
          >
            <span className={plusCircleClass}>
              <Plus className={plusIconClass} strokeWidth={2.5} />
            </span>
            <span>STUDENT</span>
          </Link>
        )}
      </div>
    </div>
  );
}
