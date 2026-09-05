'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getUpdates } from '@/app/actions';
import { Calendar, ArrowRight, ArrowLeft, Bell, X } from "lucide-react";
import { format } from 'date-fns';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from "@/lib/utils";

export interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface RecentUpdatesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialUpdateId?: string | null;
}

const parseDate = (dateStr: string): Date => {
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
};

const formatDateBadge = (dateStr: string): string => {
  try {
    const d = parseDate(dateStr);
    return format(d, "dd MMM yyyy").toUpperCase();
  } catch {
    return dateStr;
  }
};

export function RecentUpdatesModal({
  isOpen,
  onOpenChange,
  initialUpdateId = null
}: RecentUpdatesModalProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'months' | 'updates' | 'detail'>('months');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Update | null>(null);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

  const shouldReduceMotion = useReducedMotion();

  // Instant data availability: pre-fetch updates on mount so data is ready with 0ms delay
  useEffect(() => {
    let isMounted = true;
    const fetchUpdatesData = async () => {
      try {
        const res = await getUpdates();
        if (isMounted && res?.success && res.data) {
          const list = res.data as Update[];
          setUpdates(list);

          // If initialUpdateId passed, open directly in detail view
          if (initialUpdateId) {
            const found = list.find(u => u.id === initialUpdateId);
            if (found) {
              const d = parseDate(found.createdAt);
              setSelectedMonth(format(d, 'MMMM yyyy').toUpperCase());
              setSelectedNotice(found);
              setView('detail');
            }
          }
        }
      } catch (err) {
        console.error("Error loading updates:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUpdatesData();
    return () => {
      isMounted = false;
    };
  }, [initialUpdateId]);

  // Fast reset when modal is closed (no artificial delay)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setView('months');
        setSelectedMonth(null);
        setSelectedNotice(null);
      }, 100);
    }
    onOpenChange(open);
  };

  // Group updates by Month Year (newest first)
  const groupedUpdates = useMemo(() => {
    const sorted = [...updates].sort((a, b) => {
      return parseDate(b.createdAt).getTime() - parseDate(a.createdAt).getTime();
    });

    const groups: { monthYear: string; items: Update[] }[] = [];
    const groupMap: Record<string, Update[]> = {};

    sorted.forEach((update) => {
      const d = parseDate(update.createdAt);
      const monthYear = format(d, 'MMMM yyyy').toUpperCase();
      if (!groupMap[monthYear]) {
        groupMap[monthYear] = [];
        groups.push({ monthYear, items: groupMap[monthYear] });
      }
      groupMap[monthYear].push(update);
    });

    return groups;
  }, [updates]);

  // Current notices for selected month
  const currentMonthNotices = useMemo(() => {
    if (!selectedMonth) return [];
    const group = groupedUpdates.find(g => g.monthYear === selectedMonth);
    return group ? group.items : [];
  }, [groupedUpdates, selectedMonth]);

  // Fast navigation handlers with immediate visual response
  const handleSelectMonth = (monthYear: string) => {
    setSlideDirection('forward');
    setSelectedMonth(monthYear);
    setView('updates');
  };

  const handleBackToMonths = () => {
    setSlideDirection('backward');
    setView('months');
  };

  const handleSelectNotice = (notice: Update) => {
    setSlideDirection('forward');
    setSelectedNotice(notice);
    setView('detail');
  };

  const handleBackToUpdates = () => {
    setSlideDirection('backward');
    setView('updates');
  };

  // Transition parameters calibrated to user specs
  const horizontalTransition = {
    duration: shouldReduceMotion ? 0.01 : 0.12, // 120ms (Target: 100–140ms)
    ease: [0.16, 1, 0.3, 1] as const
  };

  const verticalTransition = {
    duration: shouldReduceMotion ? 0.01 : 0.14, // 140ms (Target: 120–160ms)
    ease: [0.16, 1, 0.3, 1] as const
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        {/* FAST BACKDROP: 80-100ms fade-in, backdrop click prevented */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "duration-100 data-[state=closed]:duration-75 ease-out"
          )}
        />

        {/* CENTERING WRAPPER */}
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-5 pointer-events-none overscroll-contain">
          {/* FAST POPUP CONTAINER: 130-150ms open with 5px subtle vertical shift, 90-110ms close */}
          <DialogPrimitive.Content
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={cn(
              "pointer-events-auto relative w-[calc(100vw-1.5rem)] sm:w-[92vw] md:w-[88vw] max-w-[530px]",
              "rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-950/10 bg-white dark:bg-slate-950 p-0 overflow-hidden flex flex-col",
              "max-h-[calc(100dvh-48px)] sm:max-h-[calc(100dvh-64px)] my-auto",
              // Instant-feeling opening animation: 130ms open with subtle 5px rise, 90ms exit
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:slide-in-from-bottom-[5px] data-[state=closed]:slide-out-to-bottom-[4px]",
              "duration-130 data-[state=closed]:duration-90 ease-out",
              "motion-reduce:transition-none motion-reduce:transform-none"
            )}
            style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
          >
            {/* Top-Right Explicit Close Button with 60ms tactile press */}
            <DialogPrimitive.Close
              aria-label="Close modal"
              className="absolute right-3.5 sm:right-4 top-3.5 sm:top-4 w-8 h-8 rounded-lg flex items-center justify-center opacity-70 ring-offset-background transition-all duration-75 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1F4FA3] focus:ring-offset-2 z-30 cursor-pointer active:scale-90"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <AnimatePresence mode="wait" initial={false}>
              {/* ==================================================== */}
              {/* LEVEL 1: MONTH SELECTOR                              */}
              {/* ==================================================== */}
              {view === 'months' && (
                <motion.div
                  key="view-months"
                  initial={{ opacity: 0, x: slideDirection === 'backward' ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={horizontalTransition}
                  style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="px-5 sm:px-6 pt-5 pb-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 shrink-0">
                    <DialogHeader className="p-0 text-left space-y-0.5">
                      <DialogTitle className="text-[20px] sm:text-[22px] font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
                        Recent Updates
                      </DialogTitle>
                      <DialogDescription className="text-[13px] sm:text-[13.5px] font-normal text-slate-500 dark:text-slate-400 leading-normal">
                        Academic notices and important updates.
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  {/* Month List Content */}
                  <div className="overflow-y-auto overscroll-contain px-4 sm:px-5 py-3.5 space-y-2 max-h-[calc(100dvh-130px)] sm:max-h-[440px]">
                    {loading && groupedUpdates.length === 0 ? (
                      <div className="space-y-2 py-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : groupedUpdates.length > 0 ? (
                      groupedUpdates.map((group) => (
                        <button
                          key={group.monthYear}
                          type="button"
                          onClick={() => handleSelectMonth(group.monthYear)}
                          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-slate-50/90 dark:hover:bg-slate-800/60 hover:border-blue-200 dark:hover:border-blue-800/80 transition-all duration-75 group text-left cursor-pointer active:scale-[0.985] active:bg-slate-100 dark:active:bg-slate-800"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-[#102A68] dark:text-blue-300 shrink-0 transition-transform duration-75 group-hover:scale-105">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-[13.5px] sm:text-[14.5px] font-bold text-[#102A68] dark:text-white uppercase tracking-wide truncate">
                                {group.monthYear}
                              </span>
                              <span className="block text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {group.items.length} {group.items.length === 1 ? 'Notice' : 'Notices'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#102A68] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-75 shrink-0 ml-2" />
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                          <Bell className="w-4 h-4" />
                        </div>
                        <p className="text-[13.5px] font-bold text-[#102A68] dark:text-white">
                          No Updates Available
                        </p>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Check back soon for academic releases.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ==================================================== */}
              {/* LEVEL 2: MONTH UPDATES LIST                          */}
              {/* ==================================================== */}
              {view === 'updates' && selectedMonth && (
                <motion.div
                  key="view-updates"
                  initial={{ opacity: 0, x: slideDirection === 'forward' ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection === 'forward' ? -8 : 8 }}
                  transition={horizontalTransition}
                  style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
                  className="flex flex-col h-full"
                >
                  {/* Header with Back Control */}
                  <div className="px-5 sm:px-6 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800/80 pr-12 shrink-0">
                    <button
                      type="button"
                      onClick={handleBackToMonths}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#102A68] dark:text-blue-300 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors duration-75 mb-2 cursor-pointer group active:scale-[0.97]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-75 group-hover:-translate-x-0.5" />
                      <span>All Months</span>
                    </button>

                    <div className="text-left">
                      <h3 className="text-[17px] sm:text-[19px] font-bold text-[#102A68] dark:text-white tracking-tight uppercase">
                        {selectedMonth}
                      </h3>
                      <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                        {currentMonthNotices.length} {currentMonthNotices.length === 1 ? 'Notice' : 'Notices'}
                      </p>
                    </div>
                  </div>

                  {/* Notice Rows */}
                  <div className="overflow-y-auto overscroll-contain px-4 sm:px-5 py-2 divide-y divide-slate-150 dark:divide-slate-800/80 max-h-[calc(100dvh-150px)] sm:max-h-[440px]">
                    {currentMonthNotices.map((notice) => (
                      <button
                        key={notice.id}
                        type="button"
                        onClick={() => handleSelectNotice(notice)}
                        className="w-full text-left py-3 sm:py-3.5 px-2 flex items-center justify-between gap-3 group hover:bg-slate-50/80 dark:hover:bg-slate-900/60 rounded-lg transition-colors duration-75 cursor-pointer active:scale-[0.99] active:bg-slate-100 dark:active:bg-slate-800"
                      >
                        <div className="flex-1 min-w-0 pr-1">
                          {/* Notice Date */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
                            <span className="text-[11px] sm:text-[11.5px] font-bold text-[#102A68] dark:text-blue-400 uppercase tracking-wider">
                              {formatDateBadge(notice.createdAt)}
                            </span>
                          </div>

                          {/* Notice Title */}
                          <h4 className="text-[13.5px] sm:text-[14.5px] font-bold text-[#102A68] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-300 transition-colors duration-75 line-clamp-1 leading-snug">
                            {notice.title}
                          </h4>

                          {/* Short 1-Line Preview */}
                          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                            {notice.description}
                          </p>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#102A68] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-75 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ==================================================== */}
              {/* LEVEL 3: NOTICE DETAIL VIEW                          */}
              {/* ==================================================== */}
              {view === 'detail' && selectedNotice && (
                <motion.div
                  key="view-detail"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={verticalTransition}
                  style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)" }}
                  className="flex flex-col h-full"
                >
                  {/* Header with Back Control & Academic Tag */}
                  <div className="px-5 sm:px-6 pt-4 pb-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 shrink-0">
                    <button
                      type="button"
                      onClick={handleBackToUpdates}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#102A68] dark:text-blue-300 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors duration-75 mb-2 cursor-pointer group active:scale-[0.97]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-75 group-hover:-translate-x-0.5" />
                      <span>{selectedMonth || 'Notices'}</span>
                    </button>

                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#102A68] dark:text-blue-300 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                        Academic Notice
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                      <span className="text-[11px] font-extrabold text-[#102A68] dark:text-blue-400 uppercase tracking-wider">
                        {formatDateBadge(selectedNotice.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-[17px] sm:text-[20px] font-bold text-[#102A68] dark:text-white leading-snug tracking-tight">
                      {selectedNotice.title}
                    </h3>
                  </div>

                  {/* Notice Body: Full Announcement Content */}
                  <div className="overflow-y-auto overscroll-contain px-5 sm:px-6 py-4 sm:py-5 max-h-[calc(100dvh-170px)] sm:max-h-[420px]">
                    <p className="text-slate-700 dark:text-slate-200 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {selectedNotice.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
