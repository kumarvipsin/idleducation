'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAttendance } from '@/context/attendance-context';

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatMonthYearLabel(ym: string): string {
  const [yStr, mStr] = (ym || '2026-09').split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  if (Number.isNaN(y) || Number.isNaN(m) || m < 1 || m > 12) return ym;
  return `${MONTH_NAMES_FULL[m - 1]} ${y}`;
}

export function getAcademicSessionForMonth(ym: string): string {
  const [yStr, mStr] = (ym || '2026-09').split('-');
  const y = parseInt(yStr, 10) || 2026;
  const m = parseInt(mStr, 10) || 9;
  const startYear = m >= 4 ? y : y - 1;
  const endShort = String(startYear + 1).slice(-2);
  return `${startYear}-${endShort}`;
}

interface AttendanceMonthPickerProps {
  onMonthChange?: (monthValue: string) => void;
}

const toolbarControlClass =
  'h-7 px-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 inline-flex items-center gap-1.5 cursor-pointer transition-colors select-none';

export function AttendanceMonthPicker({ onMonthChange }: AttendanceMonthPickerProps) {
  const { selectedMonth, setSelectedMonth, minDateStr, todayDateStr } = useAttendance();
  const [isOpen, setIsOpen] = useState(false);

  // Bounded strictly from system/student start (01 Apr 2026) up to current real-world month/year
  const { minMonthStr, maxMonthStr, minPickerYear, maxPickerYear } = useMemo(() => {
    const maxYm = todayDateStr.slice(0, 7);
    const minYm = minDateStr.slice(0, 7);
    const minYr = parseInt(minYm.split('-')[0], 10) || 2026;
    const maxYr = parseInt(maxYm.split('-')[0], 10) || 2026;

    return {
      minMonthStr: minYm,
      maxMonthStr: maxYm,
      minPickerYear: minYr,
      maxPickerYear: maxYr,
    };
  }, [minDateStr, todayDateStr]);

  const [pickerYear, setPickerYear] = useState<number>(() => {
    const parsed = parseInt((selectedMonth || maxMonthStr).split('-')[0], 10);
    return Number.isNaN(parsed) ? maxPickerYear : parsed;
  });

  const selectedLabel = formatMonthYearLabel(selectedMonth);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          const parsedYear = parseInt((selectedMonth || maxMonthStr).split('-')[0], 10);
          if (!Number.isNaN(parsedYear)) {
            setPickerYear(Math.min(maxPickerYear, Math.max(minPickerYear, parsedYear)));
          }
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Select month and year"
          className={toolbarControlClass}
        >
          <Calendar className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
          <span className="whitespace-nowrap">{selectedLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-[236px] p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50"
      >
        {/* Compact Year Selector (Exact Fee Dashboard UI — bounded by earliest data year & current year) */}
        <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            disabled={pickerYear <= minPickerYear}
            onClick={() => setPickerYear(y => Math.max(minPickerYear, y - 1))}
            aria-label="Previous year"
            className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight tabular-nums select-none">
            {pickerYear}
          </span>
          <button
            type="button"
            disabled={pickerYear >= maxPickerYear}
            onClick={() => setPickerYear(y => Math.min(maxPickerYear, y + 1))}
            aria-label="Next year"
            className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean 3x4 Month Grid (Exact Fee Dashboard UI — only months from data start to current month enabled) */}
        <div className="grid grid-cols-3 gap-1">
          {MONTH_NAMES_SHORT.map((monthName, idx) => {
            const monthValue = `${pickerYear}-${String(idx + 1).padStart(2, '0')}`;
            const isSelected = selectedMonth === monthValue;
            const isEnabled = monthValue >= minMonthStr && monthValue <= maxMonthStr;

            return (
              <button
                key={monthValue}
                type="button"
                disabled={!isEnabled}
                onClick={() => {
                  setSelectedMonth(monthValue);
                  onMonthChange?.(monthValue);
                  setIsOpen(false);
                }}
                className={`h-8 rounded-lg text-xs transition-all flex items-center justify-center select-none ${
                  isSelected
                    ? 'bg-[#2864E8] text-white font-semibold shadow-xs hover:bg-[#1E4ED8] cursor-pointer'
                    : isEnabled
                      ? 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2864E8] dark:hover:text-blue-400 cursor-pointer'
                      : 'text-slate-300 dark:text-slate-600 font-normal cursor-not-allowed'
                }`}
              >
                {monthName}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
