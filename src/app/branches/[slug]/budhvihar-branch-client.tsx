'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Clock, 
  GraduationCap, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Instagram,
  Youtube,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BRANCHES_DATA, BranchInfo } from '@/data/branches-data';
import { useToast } from '@/hooks/use-toast';
import { bookFreeSession, submitStudentEnquiry } from '@/app/actions/forms';
import { BookDemoModal } from '@/components/book-demo-modal';
import { AdmissionModal } from '@/components/admission-modal';
import { StudentEnquiryModal } from '@/components/student-enquiry-modal';
import { 
  EnrollNowModal, 
  JUNIOR_CLASSES, 
  JUNIOR_COURSES, 
  SECONDARY_CLASSES, 
  SECONDARY_COURSES, 
  SENIOR_CLASSES, 
  SENIOR_COURSES,
  JEE_NEET_CLASSES,
  JEE_NEET_COURSES
} from '@/components/enroll-now-modal';

interface TimetableSlot {
  subject: string;
  time: string;
}

interface TimetableColumn {
  dayCode: string;
  dayNames: string;
  slots: TimetableSlot[];
}

interface ClassTimetableEntry {
  classLabel: string;
  columns: [TimetableColumn, TimetableColumn];
}

const BUDHVIHAR_WEEKLY_TIMETABLE: Record<'9' | '10' | '11' | '12', ClassTimetableEntry> = {
  '9': {
    classLabel: 'Class 9',
    columns: [
      {
        dayCode: 'MWF',
        dayNames: '(Mon, Wed, Fri)',
        slots: [
          { subject: 'Mathematics', time: '4:00 – 5:00 PM' },
          { subject: 'Social Studies', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
      {
        dayCode: 'TTS',
        dayNames: '(Tue, Thu, Sat)',
        slots: [
          { subject: 'Science', time: '4:00 – 5:00 PM' },
          { subject: 'English', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
    ],
  },
  '10': {
    classLabel: 'Class 10',
    columns: [
      {
        dayCode: 'MWF',
        dayNames: '(Mon, Wed, Fri)',
        slots: [
          { subject: 'Science', time: '4:00 – 5:00 PM' },
          { subject: 'English', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
      {
        dayCode: 'TTS',
        dayNames: '(Tue, Thu, Sat)',
        slots: [
          { subject: 'Mathematics', time: '4:00 – 5:00 PM' },
          { subject: 'Social Studies', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
    ],
  },
  '11': {
    classLabel: 'Class 11',
    columns: [
      {
        dayCode: 'MWF',
        dayNames: '(Mon, Wed, Fri)',
        slots: [
          { subject: '---', time: '4:00 – 5:00 PM' },
          { subject: 'Biology', time: '5:00 – 6:00 PM' },
          { subject: 'Political Science', time: '6:00 – 7:00 PM' },
        ],
      },
      {
        dayCode: 'TTS',
        dayNames: '(Tue, Thu, Sat)',
        slots: [
          { subject: 'Mathematics', time: '4:00 – 5:00 PM' },
          { subject: 'Physics | Economics', time: '5:00 – 6:00 PM' },
          { subject: 'History', time: '6:00 – 7:00 PM' },
        ],
      },
    ],
  },
  '12': {
    classLabel: 'Class 12',
    columns: [
      {
        dayCode: 'MWF',
        dayNames: '(Mon, Wed, Fri)',
        slots: [
          { subject: '---', time: '4:00 – 5:00 PM' },
          { subject: '---', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
      {
        dayCode: 'TTS',
        dayNames: '(Tue, Thu, Sat)',
        slots: [
          { subject: 'Economics', time: '4:00 – 5:00 PM' },
          { subject: '---', time: '5:00 – 6:00 PM' },
          { subject: '---', time: '6:00 – 7:00 PM' },
        ],
      },
    ],
  },
};

interface SessionWeek {
  id: string;
  rangeLabel: string;
  monthKey: string;
  monthLabel: string;
}

interface SessionMonthOption {
  key: string;
  label: string;
}

interface AcademicSessionCalendar {
  weeks: SessionWeek[];
  months: SessionMonthOption[];
  currentWeekIndex: number;
}

const SESSION_START_UTC = Date.UTC(2026, 3, 1); // 01 Apr 2026
const SESSION_END_UTC = Date.UTC(2027, 2, 31);  // 31 Mar 2027
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function getTodayUtcFromIst(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === 'year')?.value ?? 2026);
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? 11);
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? 25);
  return Date.UTC(year, month - 1, day);
}

function formatDayMonthUtc(date: Date): string {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${dd} ${SHORT_MONTHS[date.getUTCMonth()]}`;
}

function buildAcademicSessionWeeks(now: Date = new Date()): AcademicSessionCalendar {
  const todayUtc = getTodayUtcFromIst(now);
  // Cap browsing automatically at the current week within the Apr 2026 – Mar 2027 session
  const effectiveMaxUtc = Math.min(Math.max(todayUtc, SESSION_START_UTC), SESSION_END_UTC);

  const weeks: SessionWeek[] = [];
  const monthMap = new Map<string, string>();

  let cursor = new Date(SESSION_START_UTC);
  while (cursor.getTime() <= effectiveMaxUtc) {
    const dow = cursor.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    if (dow === 0) {
      cursor.setUTCDate(cursor.getUTCDate() + 1);
      if (cursor.getTime() > effectiveMaxUtc) break;
    }

    const weekStart = new Date(cursor.getTime());
    const daysToSaturday = 6 - weekStart.getUTCDay();
    const rawEnd = new Date(weekStart.getTime());
    rawEnd.setUTCDate(weekStart.getUTCDate() + daysToSaturday);
    const weekEnd = rawEnd.getTime() > SESSION_END_UTC ? new Date(SESSION_END_UTC) : rawEnd;

    // Assign month cleanly without ever exposing a future month before it begins
    const spansMonth = weekStart.getUTCMonth() !== weekEnd.getUTCMonth();
    const endMonthFirstUtc = Date.UTC(weekEnd.getUTCFullYear(), weekEnd.getUTCMonth(), 1);
    const monthAnchor =
      spansMonth && weekEnd.getUTCDate() >= 4 && effectiveMaxUtc >= endMonthFirstUtc
        ? weekEnd
        : weekStart;

    const mYear = monthAnchor.getUTCFullYear();
    const mIdx = monthAnchor.getUTCMonth();
    const monthKey = `${mYear}-${String(mIdx + 1).padStart(2, '0')}`;
    const monthLabel = `${SHORT_MONTHS[mIdx]} ${mYear}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, monthLabel);
    }

    weeks.push({
      id: `${weekStart.getUTCFullYear()}-${String(weekStart.getUTCMonth() + 1).padStart(2, '0')}-${String(weekStart.getUTCDate()).padStart(2, '0')}`,
      rangeLabel: `${formatDayMonthUtc(weekStart)} – ${formatDayMonthUtc(weekEnd)}`,
      monthKey,
      monthLabel,
    });

    // Advance to next Monday (Saturday + 2 days)
    cursor = new Date(weekEnd.getTime());
    cursor.setUTCDate(weekEnd.getUTCDate() + 2);
  }

  const months: SessionMonthOption[] = Array.from(monthMap.entries()).map(([key, label]) => ({
    key,
    label,
  }));

  return {
    weeks,
    months,
    currentWeekIndex: Math.max(0, weeks.length - 1),
  };
}

// Future-Ready Branch Manager Timetable Configuration
export const BUDHVIHAR_TIMETABLE_CONFIG = {
  branchName: "Budh Vihar Branch",
  academicYear: "2026–2027",
  classes9_10: {
    durationBadge: "2 Hours / Day",
    mwf: {
      title: "MWF – Monday, Wednesday, Friday",
      badge: "Mon, Wed, Fri",
      slots: [
        { time: "4:00–5:00 PM", class9: "Mathematics", class10: "Mathematics" },
        { time: "5:00–6:00 PM", class9: "Social Studies", class10: "Social Studies" },
      ]
    },
    tts: {
      title: "TTS – Tuesday, Thursday, Saturday",
      badge: "Tue, Thu, Sat",
      slots: [
        { time: "4:00–5:00 PM", class9: "Science", class10: "Science" },
        { time: "5:00–6:00 PM", class9: "English", class10: "English" },
      ]
    }
  },
  classes11_12: {
    durationBadge: "1 Hour / Subject",
    accounts: {
      title: "Accounts",
      slots: [
        { days: "MWF (Mon, Wed, Fri)", time: "5:00–6:00 PM", classGrade: "Class 11" },
        { days: "TTS (Tue, Thu, Sat)", time: "5:00–6:00 PM", classGrade: "Class 12" },
      ]
    },
    economics: {
      title: "Economics",
      slots: [
        { days: "MWF (Mon, Wed, Fri)", time: "4:00–5:00 PM", classGrade: "Class 11" },
        { days: "TTS (Tue, Thu, Sat)", time: "4:00–5:00 PM", classGrade: "Class 12" },
      ]
    }
  },
  sundaySpecial: {
    timings: "9:00 AM – 2:00 PM",
    note: "Exact schedule (Test / Workshop / Revision) will be shared each week by the branch.",
    activities: [
      {
        title: "Weekly Tests",
        description: "Subject-wise assessment and practice tests to track progress.",
        timing: "9:00 AM – 10:30 AM"
      },
      {
        title: "Special Workshops",
        description: "Concept building, problem solving and exam strategy sessions.",
        timing: "10:45 AM – 12:15 PM"
      },
      {
        title: "Revision & Doubt Sessions",
        description: "Comprehensive revision and doubt clearing for better understanding.",
        timing: "12:30 PM – 2:00 PM"
      }
    ]
  }
};

interface BranchDetailClientProps {
  branch: BranchInfo;
}

export default function BudhviharBranchClient({ branch }: BranchDetailClientProps) {
  const { toast } = useToast();

  // Modals
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollDefaultClass, setEnrollDefaultClass] = useState<string>('');
  const [enrollDefaultCourse, setEnrollDefaultCourse] = useState<string>('');
  const [enrollProgramTitle, setEnrollProgramTitle] = useState<string>('');
  const [enrollAllowedClasses, setEnrollAllowedClasses] = useState<string[]>([]);
  const [enrollAllowedCourses, setEnrollAllowedCourses] = useState<string[]>([]);

  // Director Tab ('director' | 'profile')
  const [activeMessageTab, setActiveMessageTab] = useState<'director' | 'profile'>('director');

  // Timetable Tabs (Class 9, Class 10, Class 11, Class 12) + Auto Session Week/Month Navigation (Apr 2026 – Mar 2027)
  const [timetableTab, setTimetableTab] = useState<'9' | '10' | '11' | '12'>('9');
  const [sessionCalendar, setSessionCalendar] = useState<AcademicSessionCalendar>(() => buildAcademicSessionWeeks());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(() => buildAcademicSessionWeeks().currentWeekIndex);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Auto-sync current week & month when date rolls over (up to current week of Apr 2026 – Mar 2027)
  useEffect(() => {
    const syncCurrentWeek = () => {
      const updated = buildAcademicSessionWeeks();
      setSessionCalendar((prev) => {
        const latestWeekChanged =
          prev.weeks.length !== updated.weeks.length ||
          prev.weeks[prev.currentWeekIndex]?.id !== updated.weeks[updated.currentWeekIndex]?.id;
        if (!latestWeekChanged) return prev;
        setSelectedWeekIndex((prevIdx) =>
          prevIdx >= prev.currentWeekIndex ? updated.currentWeekIndex : Math.min(prevIdx, updated.currentWeekIndex)
        );
        return updated;
      });
    };

    const intervalId = window.setInterval(syncCurrentWeek, 15 * 60 * 1000);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncCurrentWeek();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const safeWeekIndex = Math.min(Math.max(selectedWeekIndex, 0), sessionCalendar.currentWeekIndex);
  const activeSessionWeek = sessionCalendar.weeks[safeWeekIndex] ?? sessionCalendar.weeks[sessionCalendar.currentWeekIndex];

  const handlePrevTimetableWeek = () => {
    setSelectedWeekIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextTimetableWeek = () => {
    setSelectedWeekIndex((prev) => Math.min(sessionCalendar.currentWeekIndex, prev + 1));
  };

  const handleSelectTimetableMonth = (monthKey: string) => {
    const latestWeek = sessionCalendar.weeks[sessionCalendar.currentWeekIndex];
    if (latestWeek && monthKey === latestWeek.monthKey) {
      setSelectedWeekIndex(sessionCalendar.currentWeekIndex);
      return;
    }
    const firstWeekIdx = sessionCalendar.weeks.findIndex((w) => w.monthKey === monthKey);
    if (firstWeekIdx !== -1) {
      setSelectedWeekIndex(firstWeekIdx);
    }
  };

  // Real PDF generator for Weekly Class Timetable
  const handleDownloadTimetable = () => {
    try {
      setIsDownloadingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Top Header Banner
      doc.setFillColor(15, 23, 42); // Navy
      doc.rect(0, 0, 210, 32, 'F');

      // Accent line
      doc.setFillColor(245, 158, 11); // Amber
      doc.rect(0, 32, 210, 2, 'F');

      // Header Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('IDL EDUCATION – BUDH VIHAR BRANCH', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text('A-1/6 Budh Vihar, Phase -1, Delhi-110086 | Helpline: +91 9058350731', 14, 21);
      doc.text('Official Weekly Class Timetable (Academic Session 2026–2027)', 14, 27);

      let y = 42;

      // Section 1: Classes 9–10 Timetable
      doc.setFillColor(239, 246, 255); // Blue 50
      doc.roundedRect(14, y, 182, 8, 1.5, 1.5, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CLASSES 9 & 10 – SCHOOL FOUNDATION PROGRAM', 18, y + 5.5);
      doc.setFontSize(8.5);
      doc.text('Badge: 2 Hours / Day', 152, y + 5.5);

      y += 12;

      // Subheader: MWF
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('MWF – Monday, Wednesday, Friday', 16, y);
      y += 4;

      // Table Header MWF
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Time', 20, y + 4.2);
      doc.text('Class 9', 80, y + 4.2);
      doc.text('Class 10', 140, y + 4.2);
      y += 6;

      // Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text('4:00–5:00 PM', 20, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Mathematics', 80, y + 4.2);
      doc.text('Mathematics', 140, y + 4.2);
      y += 6;

      // Row 2
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text('5:00–6:00 PM', 20, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.text('Social Studies', 80, y + 4.2);
      doc.text('Social Studies', 140, y + 4.2);
      y += 9;

      // Subheader: TTS
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TTS – Tuesday, Thursday, Saturday', 16, y);
      y += 4;

      // Table Header TTS
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Time', 20, y + 4.2);
      doc.text('Class 9', 80, y + 4.2);
      doc.text('Class 10', 140, y + 4.2);
      y += 6;

      // Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text('4:00–5:00 PM', 20, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text('Science', 80, y + 4.2);
      doc.text('Science', 140, y + 4.2);
      y += 6;

      // Row 2
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'normal');
      doc.text('5:00–6:00 PM', 20, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(126, 34, 206);
      doc.text('English', 80, y + 4.2);
      doc.text('English', 140, y + 4.2);
      y += 12;

      // Section 2: Classes 11 & 12 Commerce
      doc.setFillColor(243, 232, 255); // Purple 50
      doc.roundedRect(14, y, 182, 8, 1.5, 1.5, 'F');
      doc.setTextColor(109, 40, 217);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('CLASSES 11 & 12 – COMMERCE PROGRAM', 18, y + 5.5);
      doc.setFontSize(8.5);
      doc.text('Badge: 1 Hour / Subject', 147, y + 5.5);
      y += 12;

      // Table Header Commerce
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('Subject', 20, y + 4.2);
      doc.text('Days', 70, y + 4.2);
      doc.text('Time', 120, y + 4.2);
      doc.text('Class', 160, y + 4.2);
      y += 6;

      // Accounts Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Accounts', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('MWF (Mon, Wed, Fri)', 70, y + 4.2);
      doc.text('5:00–6:00 PM', 120, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Class 11', 160, y + 4.2);
      y += 6;

      // Accounts Row 2
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Accounts', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('TTS (Tue, Thu, Sat)', 70, y + 4.2);
      doc.text('5:00–6:00 PM', 120, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(126, 34, 206);
      doc.text('Class 12', 160, y + 4.2);
      y += 6;

      // Economics Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Economics', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('MWF (Mon, Wed, Fri)', 70, y + 4.2);
      doc.text('4:00–5:00 PM', 120, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(37, 99, 235);
      doc.text('Class 11', 160, y + 4.2);
      y += 6;

      // Economics Row 2
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Economics', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('TTS (Tue, Thu, Sat)', 70, y + 4.2);
      doc.text('4:00–5:00 PM', 120, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(126, 34, 206);
      doc.text('Class 12', 160, y + 4.2);
      y += 12;

      // Section 3: Sunday Special Program
      doc.setFillColor(254, 243, 199); // Amber 50
      doc.roundedRect(14, y, 182, 8, 1.5, 1.5, 'F');
      doc.setTextColor(180, 83, 9);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('SUNDAY SPECIAL PROGRAM', 18, y + 5.5);
      doc.setFontSize(8.5);
      doc.text('Sunday Timings: 9:00 AM – 2:00 PM', 133, y + 5.5);
      y += 11;

      // Activities
      const acts = [
        { title: 'Weekly Tests', desc: 'Subject-wise assessment and practice tests to track progress.' },
        { title: 'Special Workshops', desc: 'Concept building, problem solving and exam strategy sessions.' },
        { title: 'Revision & Doubt Sessions', desc: 'Comprehensive revision and doubt clearing for better understanding.' },
      ];

      acts.forEach((act) => {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, y, 182, 7.5, 1, 1, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`• ${act.title}:`, 18, y + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(act.desc, 65, y + 5);
        y += 9;
      });

      // Note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('* Exact schedule (Test / Workshop / Revision) will be shared each week by the branch.', 14, y + 3);

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('IDL Education – Budh Vihar Branch | Official Schedule', 14, 285);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 165, 285);

      doc.save('IDL_Budh_Vihar_Weekly_Timetable.pdf');
      toast({
        title: 'Timetable Downloaded',
        description: 'IDL_Budh_Vihar_Weekly_Timetable.pdf has been downloaded successfully.',
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: 'Download Failed',
        description: 'Could not generate the PDF timetable. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Hero Right Card Switcher ('demo' | 'enquiry') + Touch Swipe
  const [heroFormTab, setHeroFormTab] = useState<'demo' | 'enquiry'>('demo');
  const heroCardTouchStartXRef = useRef<number | null>(null);

  const handleHeroCardTouchStart = (e: React.TouchEvent) => {
    heroCardTouchStartXRef.current = e.touches[0].clientX;
  };

  const handleHeroCardTouchEnd = (e: React.TouchEvent) => {
    if (heroCardTouchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - heroCardTouchStartXRef.current;
    heroCardTouchStartXRef.current = null;
    if (Math.abs(deltaX) < 50) return;
    if (deltaX < 0 && heroFormTab === 'demo') {
      setHeroFormTab('enquiry');
    } else if (deltaX > 0 && heroFormTab === 'enquiry') {
      setHeroFormTab('demo');
    }
  };

  // Hero Free Demo Booking Form (Budh Vihar Branch)
  const [heroDemoMode, setHeroDemoMode] = useState<'' | 'Offline'>('');
  const [heroStudentName, setHeroStudentName] = useState('');
  const [heroGuardianName, setHeroGuardianName] = useState('');
  const [heroMobile, setHeroMobile] = useState('');
  const [heroClass, setHeroClass] = useState('');
  const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);
  const [heroBookedSummary, setHeroBookedSummary] = useState<{
    studentName: string;
    classCourse: string;
  } | null>(null);

  // Hero Student Enquiry Form (Budh Vihar Branch)
  const [heroEnqStudentName, setHeroEnqStudentName] = useState('');
  const [heroEnqGuardianName, setHeroEnqGuardianName] = useState('');
  const [heroEnqMobile, setHeroEnqMobile] = useState('');
  const [heroEnqClass, setHeroEnqClass] = useState('');
  const [heroEnqMessage, setHeroEnqMessage] = useState('');
  const [isHeroEnqSubmitting, setIsHeroEnqSubmitting] = useState(false);
  const [heroEnqSummary, setHeroEnqSummary] = useState<{
    studentName: string;
    classCourse: string;
    message: string;
  } | null>(null);

  const toTitleCase = (str: string) => str.replace(/\b([a-z])/g, (char) => char.toUpperCase());

  // FAQ Accordion (all closed by default; opens manually on click)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Explore Academic Programs horizontal carousel state
  const programsSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollProgramsLeft, setCanScrollProgramsLeft] = useState(false);
  const [canScrollProgramsRight, setCanScrollProgramsRight] = useState(true);

  const updateProgramsScrollState = () => {
    const el = programsSliderRef.current;
    if (!el) return;
    setCanScrollProgramsLeft(el.scrollLeft > 4);
    setCanScrollProgramsRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateProgramsScrollState();
    window.addEventListener('resize', updateProgramsScrollState);
    return () => window.removeEventListener('resize', updateProgramsScrollState);
  }, []);

  const scrollProgramsBy = (direction: 'left' | 'right') => {
    const el = programsSliderRef.current;
    if (!el) return;
    const step = Math.max(268, Math.round(el.clientWidth * 0.55));
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  const isBudhVihar = branch.id === 'budh-vihar' || branch.slug === 'budh-vihar';
  const heroPhone = isBudhVihar ? "+91 9058350731" : (branch.altPhone || branch.phone || "+91 9058350731");
  const heroTel = isBudhVihar ? "+919058350731" : (branch.phone?.replace(/[^0-9+]/g, '') || "+919058350731");

  const handleHeroDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroDemoMode) {
      toast({
        title: 'Select Session Mode',
        description: 'Please select Offline session mode to continue.',
        variant: 'destructive',
      });
      return;
    }
    if (heroStudentName.trim().length < 2) {
      toast({
        title: 'Student Name Required',
        description: 'Please enter the student full name.',
        variant: 'destructive',
      });
      return;
    }
    if (heroGuardianName.trim().length < 2) {
      toast({
        title: 'Guardian Name Required',
        description: 'Please enter parent / guardian name.',
        variant: 'destructive',
      });
      return;
    }
    if (!/^\d{10}$/.test(heroMobile)) {
      toast({
        title: 'Valid Mobile Required',
        description: 'Please enter a valid 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }
    if (!heroClass) {
      toast({
        title: 'Select Class',
        description: 'Please select a class / course.',
        variant: 'destructive',
      });
      return;
    }

    setIsHeroSubmitting(true);
    try {
      const result = await bookFreeSession({
        mode: heroDemoMode,
        studentName: heroStudentName.trim(),
        guardianName: heroGuardianName.trim(),
        classCourse: heroClass,
        mobile: heroMobile.trim(),
        state: 'Delhi',
        branch: 'Budh Vihar, Delhi-110086',
        nearestBranch: 'Budh Vihar, Delhi-110086',
        subjects: '',
        email: '',
      });

      if (result.success) {
        setHeroBookedSummary({
          studentName: heroStudentName.trim(),
          classCourse: heroClass,
        });
        toast({
          title: 'Free Demo Session Booked!',
          description: `Your Budh Vihar Branch demo session is confirmed for ${heroStudentName.trim()}.`,
        });
        setHeroDemoMode('');
        setHeroStudentName('');
        setHeroGuardianName('');
        setHeroMobile('');
        setHeroClass('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Failed to book demo session. Please try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsHeroSubmitting(false);
    }
  };

  const handleHeroEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEnqStudentName.trim().length < 2) {
      toast({
        title: 'Student Name Required',
        description: 'Please enter the student full name.',
        variant: 'destructive',
      });
      return;
    }
    if (heroEnqGuardianName.trim().length < 2) {
      toast({
        title: 'Guardian Name Required',
        description: 'Please enter parent / guardian name.',
        variant: 'destructive',
      });
      return;
    }
    if (!/^\d{10}$/.test(heroEnqMobile)) {
      toast({
        title: 'Valid Mobile Required',
        description: 'Please enter a valid 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }
    if (!heroEnqClass) {
      toast({
        title: 'Select Class',
        description: 'Please select a class / course.',
        variant: 'destructive',
      });
      return;
    }
    if (heroEnqMessage.trim().length < 2) {
      toast({
        title: 'Enquiry Details Required',
        description: 'Please specify stream, subject(s), or your question.',
        variant: 'destructive',
      });
      return;
    }

    setIsHeroEnqSubmitting(true);
    try {
      const result = await submitStudentEnquiry({
        studentName: heroEnqStudentName.trim(),
        guardianName: heroEnqGuardianName.trim(),
        classCourse: heroEnqClass,
        mobile: heroEnqMobile.trim(),
        state: 'Delhi',
        branch: 'Budh Vihar, Delhi-110086',
        message: heroEnqMessage.trim(),
      });

      if (result.success) {
        setHeroEnqSummary({
          studentName: heroEnqStudentName.trim(),
          classCourse: heroEnqClass,
          message: heroEnqMessage.trim(),
        });
        toast({
          title: 'Enquiry Submitted!',
          description: `Thank you ${heroEnqStudentName.trim()}, our Budh Vihar counsellor will reach out shortly.`,
        });
        setHeroEnqStudentName('');
        setHeroEnqGuardianName('');
        setHeroEnqMobile('');
        setHeroEnqClass('');
        setHeroEnqMessage('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Failed to submit enquiry. Please try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsHeroEnqSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white text-slate-800 antialiased selection:bg-[#142F70]/20 selection:text-[#142F70]">

      {/* ── SECTION 01: MAIN HERO SLIDE PROPORTIONS & PREMIUM ROYAL PURPLE-INDIGO THEME (LEFT STUDENT PHOTO + RIGHT DEMO/ENQUIRY FORM) ── */}
      <section className="relative w-full max-w-full overflow-hidden pt-0 pb-0 bg-white md:bg-[#14133B]">
        <div className="relative w-full max-w-full overflow-hidden flex items-start md:items-center min-h-0 md:min-h-[560px] lg:min-h-[580px] xl:min-h-[600px] px-0 md:px-12 lg:px-16 pt-0 md:pt-10 lg:pt-8 xl:pt-9 pb-0 md:pb-20 lg:pb-16 xl:pb-16">
          
          {/* Rich Royal Purple, Soft Luminous Violet & Deep Indigo-Navy Dimensional Background (Desktop/Tablet Only so Mobile Form is Full-Bleed Edge-to-Edge) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
          >
            {/* 1. Silky Eased Multi-Stop Base: Seamless Royal Purple Left Flowing Smoothly into Calm Deep Navy Right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 75% 65% at 40% 8%, rgba(154, 122, 246, 0.18) 0%, rgba(104, 72, 206, 0.08) 46%, transparent 80%), radial-gradient(ellipse 85% 92% at 24% 46%, rgba(132, 86, 238, 0.30) 0%, rgba(92, 56, 192, 0.16) 40%, rgba(42, 28, 108, 0.05) 68%, transparent 88%), linear-gradient(112deg, #4F28B0 0%, #46249E 15%, #3D218D 30%, #321E79 46%, #271B64 62%, #1D1851 78%, #161542 91%, #13133A 100%)',
              }}
            />

            {/* 2. Subtle Silky Top Rim Sheen */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200/25 to-transparent" />

            {/* 3. Subtle Studio Radial Backlight Behind Student Image Area (Centered on Tablet, Left-Aligned on Desktop) */}
            <div
              className="hidden md:block absolute top-[30%] lg:top-[46%] left-[50%] lg:left-[24%] -translate-x-1/2 -translate-y-1/2 w-[520px] lg:w-[680px] h-[360px] lg:h-[440px] rounded-full blur-[88px] opacity-85"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(184, 156, 255, 0.30) 0%, rgba(132, 90, 238, 0.18) 38%, rgba(78, 48, 174, 0.07) 66%, transparent 85%)',
              }}
            />

            {/* 4. Soft Atmospheric Mid-Bridge Diffusion (Keeps Right Form Side Calm, Deep & High-Contrast) */}
            <div
              className="absolute top-[22%] left-[44%] lg:left-[42%] -translate-x-1/2 -translate-y-1/2 w-[640px] md:w-[880px] h-[250px] md:h-[310px] -rotate-[8deg] rounded-full blur-[104px] opacity-70"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(164, 136, 248, 0.15) 0%, rgba(106, 74, 208, 0.08) 48%, transparent 82%)',
              }}
            />

            {/* 5. Calm Lower Grounding Wash for Smooth Student Blend & Overlapping White Contact Strip */}
            <div
              className="absolute bottom-0 inset-x-0 h-44 sm:h-52 md:h-56 pointer-events-none overflow-hidden"
              style={{
                background:
                  'radial-gradient(ellipse 68% 85% at 26% 100%, rgba(98, 62, 192, 0.18) 0%, rgba(48, 30, 118, 0.10) 50%, transparent 80%), linear-gradient(to top, rgba(16, 15, 48, 0.36) 0%, rgba(16, 15, 48, 0.12) 45%, transparent 100%)',
              }}
            />

            {/* 6. Crisp Subtle Bottom Horizon Line */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-200/20 to-transparent" />
          </div>

          {/* 2-Column Responsive Layout Matching Main Hero Slide Width (max-w-7xl) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
            
            {/* LEFT COLUMN: Balanced Student Visual Size, Halo Circle & Grounded Position (Hidden on Mobile) */}
            <div className="hidden md:flex w-full lg:max-w-[46%] xl:max-w-[45%] items-end justify-center lg:justify-start relative lg:self-end lg:-mb-5 xl:-mb-6">
              <div className="relative w-[255px] min-[360px]:w-[275px] sm:w-[315px] md:w-[350px] lg:w-[405px] xl:w-[435px] h-[280px] min-[360px]:h-[300px] sm:h-[340px] md:h-[380px] lg:h-[445px] xl:h-[470px] flex items-end justify-center">
                
                {/* 1. Refined Soft-Violet Studio Halo Circle */}
                <div
                  aria-hidden="true"
                  className="absolute top-4 min-[360px]:top-5 sm:top-6 md:top-7 lg:top-7 xl:top-8 left-[56%] -translate-x-1/2 w-[245px] min-[360px]:w-[265px] sm:w-[305px] md:w-[340px] lg:w-[385px] xl:w-[405px] h-[245px] min-[360px]:h-[265px] sm:h-[305px] md:h-[340px] lg:h-[385px] xl:h-[405px] rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 46% 34%, rgba(192, 166, 255, 0.22) 0%, rgba(134, 92, 238, 0.13) 44%, rgba(76, 46, 168, 0.05) 72%, transparent 88%)',
                    border: '1px solid rgba(226, 214, 255, 0.20)',
                    boxShadow: '0 0 56px rgba(122, 80, 232, 0.20), inset 0 1px 24px rgba(236, 228, 255, 0.12)',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.45) 88%, transparent 100%)',
                  }}
                />

                {/* 2. Student Photo with Eased Feathered Bottom Mask Blending Seamlessly into Hero Stage */}
                <div
                  className="relative w-full h-full pointer-events-none select-none"
                  style={{
                    maskImage:
                      'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.92) 77%, rgba(0,0,0,0.68) 84%, rgba(0,0,0,0.34) 91%, rgba(0,0,0,0.10) 96%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.92) 77%, rgba(0,0,0,0.68) 84%, rgba(0,0,0,0.34) 91%, rgba(0,0,0,0.10) 96%, transparent 100%)',
                  }}
                >
                  <Image
                    src="/scholarship.png"
                    alt="IDL Education Budh Vihar Student"
                    fill
                    priority
                    sizes="(max-width: 640px) 275px, (max-width: 1024px) 350px, 435px"
                    className="object-contain object-bottom drop-shadow-[0_18px_32px_rgba(14,12,44,0.42)]"
                  />
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Full-Bleed Edge-to-Edge on Mobile, Floating Card on Desktop */}
            <div className="w-full lg:max-w-[50%] xl:max-w-[48%] flex items-center justify-center lg:justify-end">
              <div
                onTouchStart={handleHeroCardTouchStart}
                onTouchEnd={handleHeroCardTouchEnd}
                className="w-full max-w-none md:max-w-[416px] xl:max-w-[432px] rounded-none md:rounded-[18px] bg-white border-0 border-b border-slate-100 md:border md:border-white/80 shadow-none md:shadow-[0_24px_56px_-14px_rgba(4,14,34,0.48),0_4px_14px_rgba(4,14,34,0.12)] px-4 pt-3.5 pb-5 sm:px-6 sm:pt-4 sm:pb-6 md:px-6 md:py-5 antialiased overflow-hidden"
              >
                {/* Minimal Underline Tabs (No Heavy Gray Box Background) */}
                <div className="grid grid-cols-2 border-b border-slate-200/70 md:border-slate-200/80 mb-4 md:mb-3.5">
                  {[
                    { key: 'demo' as const, label: 'Book Free Demo' },
                    { key: 'enquiry' as const, label: 'Student Enquiry' },
                  ].map((tab) => {
                    const isActive = heroFormTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setHeroFormTab(tab.key)}
                        className={cn(
                          "relative pb-3 pt-1 md:pb-2.5 md:pt-0.5 text-[13.5px] tracking-[-0.01em] md:tracking-[-0.005em] transition-colors duration-200 cursor-pointer select-none flex items-center justify-center bg-transparent",
                          isActive
                            ? "font-bold text-[#173568]"
                            : "font-medium text-slate-400 md:text-slate-500 hover:text-[#173568]"
                        )}
                      >
                        <span>{tab.label}</span>
                        {isActive && (
                          <motion.span
                            layoutId="heroFormTabUnderlineBV"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            className="absolute bottom-[-1px] inset-x-5 md:inset-x-4 h-[2.5px] md:h-[2px] rounded-full bg-[#2864E8]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Fixed-Height Smooth Sliding Form Body Matched to Hero Proportions Above Overlap */}
                <div className="min-h-0 md:min-h-[344px] xl:min-h-[354px] flex flex-col justify-between">
                  <AnimatePresence mode="wait" initial={false}>
                    {heroFormTab === 'demo' ? (
                      <motion.div
                        key="hero-demo-tab"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        {heroBookedSummary ? (
                          /* Clean Inline Confirmation View (Demo) */
                          <div className="py-5 text-center space-y-4 my-auto">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                              <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[#173568] tracking-[-0.02em] leading-snug">
                                Free Demo Session Booked!
                              </h2>
                              <p className="text-[13px] text-slate-600 mt-1.5 leading-[1.6]">
                                Thank you, <span className="font-bold text-[#173568]">{heroBookedSummary.studentName}</span>. Our Budh Vihar Branch counsellor will contact you shortly.
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50/90 border border-slate-200/70 p-3.5 text-left space-y-1.5 text-[12.5px]">
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Branch:</span>
                                <span className="font-bold text-[#173568]">Budh Vihar</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Mode:</span>
                                <span className="font-bold text-[#173568]">Offline</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Class:</span>
                                <span className="font-bold text-[#2864E8]">{heroBookedSummary.classCourse}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => setHeroBookedSummary(null)}
                              className="w-full h-10 rounded-lg bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-bold text-[14px] tracking-[0.01em] cursor-pointer"
                            >
                              Book Another Demo
                            </Button>
                          </div>
                        ) : (
                          /* Demo Form (Budh Vihar Branch) */
                          <form onSubmit={handleHeroDemoSubmit} className="flex-1 flex flex-col justify-between gap-4 md:gap-3.5" autoComplete="off">
                            <div className="space-y-3.5 md:space-y-3">
                              {/* Form Header */}
                              <div className="text-center pb-0.5">
                                <h2 className="text-[20px] sm:text-[21px] md:text-[20px] font-extrabold text-[#173568] tracking-[-0.025em] md:tracking-[-0.02em] leading-tight md:leading-snug">
                                  Book your Free Demo
                                </h2>
                              </div>

                              {/* Session Mode Selector: Offline on Left (Unselected by default), Online Disabled on Right */}
                              <div>
                                <div className="flex items-center gap-3 md:gap-2.5 mb-2.5 md:mb-2">
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                  <span className="text-[11.5px] font-medium md:font-semibold text-slate-400 md:text-slate-500 tracking-[0.015em] md:tracking-[0.01em]">
                                    Select the Session Mode
                                  </span>
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setHeroDemoMode(heroDemoMode === 'Offline' ? '' : 'Offline')}
                                    className={cn(
                                      "relative h-[42px] md:h-[36px] rounded-[10px] md:rounded-[8px] text-[13.5px] md:text-[12.5px] flex items-center justify-center transition-all duration-150 cursor-pointer select-none",
                                      heroDemoMode === 'Offline'
                                        ? "border border-[#2864E8] md:border-[1.5px] bg-[#EEF4FF] md:bg-[#F4F8FF] ring-1 ring-[#2864E8]/15 md:ring-0 font-semibold text-[#173568] shadow-[0_1px_4px_rgba(40,100,232,0.12)] md:shadow-[0_1px_4px_rgba(40,100,232,0.14)]"
                                        : "border border-slate-200/80 md:border-slate-200/90 bg-[#F8FAFC] md:bg-white font-medium text-[#173568]/85 md:text-slate-700 hover:border-[#2864E8]/45 md:hover:border-[#2864E8]/55 hover:bg-[#F4F8FF]/60 md:hover:bg-slate-50/60"
                                    )}
                                  >
                                    {heroDemoMode === 'Offline' && (
                                      <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-[#2864E8] text-white flex items-center justify-center shadow-sm">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      </span>
                                    )}
                                    Offline
                                  </button>

                                  <button
                                    type="button"
                                    disabled
                                    className="h-[42px] md:h-[36px] rounded-[10px] md:rounded-[8px] border border-slate-200/60 md:border-slate-200/75 bg-slate-50/70 md:bg-slate-50/80 text-[13.5px] md:text-[12.5px] font-medium text-slate-400/90 md:text-slate-400 cursor-not-allowed flex items-center justify-center select-none opacity-75"
                                    title="Online demo is currently unavailable"
                                  >
                                    Online
                                  </button>
                                </div>
                              </div>

                              {/* Enter Your Details Section */}
                              <div>
                                <div className="flex items-center gap-3 md:gap-2.5 mb-2.5 md:mb-2">
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                  <span className="text-[11.5px] font-medium md:font-semibold text-slate-400 md:text-slate-500 tracking-[0.015em] md:tracking-[0.01em]">
                                    Enter Your Details
                                  </span>
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                </div>

                                <div className="space-y-2.5">
                                  {/* Student Name */}
                                  <input
                                    type="text"
                                    value={heroStudentName}
                                    onChange={(e) => setHeroStudentName(toTitleCase(e.target.value))}
                                    placeholder="Enter Student Full Name *"
                                    className="w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
                                  />

                                  {/* Parent / Guardian Name */}
                                  <input
                                    type="text"
                                    value={heroGuardianName}
                                    onChange={(e) => setHeroGuardianName(toTitleCase(e.target.value))}
                                    placeholder="Father / Guardian Name *"
                                    className="w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
                                  />

                                  {/* Mobile Number (Clean Input Without OTP) */}
                                  <div className="flex items-center h-[44px] md:h-[38px] rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus-within:bg-white overflow-hidden focus-within:border-[#2864E8] focus-within:ring-2 focus-within:ring-[#2864E8]/15 transition-all">
                                    <span className="pl-3.5 pr-1.5 text-[13.5px] md:text-[12.5px] font-bold md:font-semibold text-[#173568]/75 md:text-slate-500 tabular-nums select-none shrink-0">
                                      +91
                                    </span>
                                    <input
                                      type="tel"
                                      maxLength={10}
                                      value={heroMobile}
                                      onChange={(e) => setHeroMobile(e.target.value.replace(/\D/g, ''))}
                                      placeholder="Enter your Mobile Number *"
                                      className="flex-1 min-w-0 h-full px-1 pr-3.5 bg-transparent text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal tabular-nums focus:outline-none"
                                    />
                                  </div>

                                  {/* Single Full-Width Class / Course Dropdown */}
                                  <div className="relative">
                                    <select
                                      value={heroClass}
                                      onChange={(e) => setHeroClass(e.target.value)}
                                      className={cn(
                                        "w-full h-[44px] md:h-[38px] pl-3.5 pr-9 md:pr-8 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium appearance-none focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all cursor-pointer",
                                        heroClass ? "text-[#173568] md:text-slate-800" : "text-slate-400 md:text-slate-400/90 font-normal"
                                      )}
                                    >
                                      <option value="" disabled>Class / Course *</option>
                                      {[
                                        'Class 4',
                                        'Class 5',
                                        'Class 6',
                                        'Class 7',
                                        'Class 8',
                                        'Class 9',
                                        'Class 10',
                                        'Class 11',
                                        'Class 12',
                                        'Class 12 PASS',
                                      ].map((c) => (
                                        <option key={c} value={c} className="text-slate-900">
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Primary Submit CTA */}
                            <button
                              type="submit"
                              disabled={isHeroSubmitting}
                              className="w-full h-[46px] md:h-[40px] rounded-[10px] md:rounded-[8px] bg-gradient-to-b from-[#2E6BF0] to-[#235CE0] md:bg-none md:bg-[#2864E8] hover:from-[#2660E4] hover:to-[#1C4FD0] md:hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white font-bold text-[14.5px] md:text-[14px] tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_18px_-4px_rgba(40,100,232,0.38)] md:shadow-[0_4px_14px_-2px_rgba(40,100,232,0.34)] md:hover:shadow-[0_6px_18px_-2px_rgba(40,100,232,0.44)] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-65 mt-auto"
                            >
                              {isHeroSubmitting ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Booking Session...</span>
                                </>
                              ) : (
                                <>
                                  <span>Book Free Demo</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="hero-enquiry-tab"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        {heroEnqSummary ? (
                          /* Clean Inline Confirmation View (Enquiry) */
                          <div className="py-5 text-center space-y-4 my-auto">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                              <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[#173568] tracking-[-0.02em] leading-snug">
                                Enquiry Submitted!
                              </h2>
                              <p className="text-[13px] text-slate-600 mt-1.5 leading-[1.6]">
                                Thank you, <span className="font-bold text-[#173568]">{heroEnqSummary.studentName}</span>. Our Budh Vihar Branch counsellor will contact you shortly.
                              </p>
                            </div>
                            <div className="rounded-xl bg-slate-50/90 border border-slate-200/70 p-3.5 text-left space-y-1.5 text-[12.5px]">
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Branch:</span>
                                <span className="font-bold text-[#173568]">Budh Vihar</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Class:</span>
                                <span className="font-bold text-[#2864E8]">{heroEnqSummary.classCourse}</span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-slate-500 font-medium">Enquiry:</span>
                                <span className="font-semibold text-slate-700 truncate max-w-[200px]">{heroEnqSummary.message}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => setHeroEnqSummary(null)}
                              className="w-full h-10 rounded-lg bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-bold text-[14px] tracking-[0.01em] cursor-pointer"
                            >
                              Submit Another Enquiry
                            </Button>
                          </div>
                        ) : (
                          /* Student Enquiry Form (Matching Demo Form UI & Dimensions) */
                          <form onSubmit={handleHeroEnquirySubmit} className="flex-1 flex flex-col justify-between gap-4 md:gap-3.5" autoComplete="off">
                            <div className="space-y-3.5 md:space-y-3">
                              {/* Form Header */}
                              <div className="text-center pb-0.5">
                                <h2 className="text-[20px] sm:text-[21px] md:text-[20px] font-extrabold text-[#173568] tracking-[-0.025em] md:tracking-[-0.02em] leading-tight md:leading-snug">
                                  Student Enquiry
                                </h2>
                              </div>

                              {/* Enter Your Details Section */}
                              <div>
                                <div className="flex items-center gap-3 md:gap-2.5 mb-2.5 md:mb-2">
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                  <span className="text-[11.5px] font-medium md:font-semibold text-slate-400 md:text-slate-500 tracking-[0.015em] md:tracking-[0.01em]">
                                    Enter Your Details
                                  </span>
                                  <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
                                </div>

                                <div className="space-y-2.5">
                                  {/* Student Name */}
                                  <input
                                    type="text"
                                    value={heroEnqStudentName}
                                    onChange={(e) => setHeroEnqStudentName(toTitleCase(e.target.value))}
                                    placeholder="Enter Student Full Name *"
                                    className="w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
                                  />

                                  {/* Parent / Guardian Name */}
                                  <input
                                    type="text"
                                    value={heroEnqGuardianName}
                                    onChange={(e) => setHeroEnqGuardianName(toTitleCase(e.target.value))}
                                    placeholder="Father / Guardian Name *"
                                    className="w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
                                  />

                                  {/* Mobile Number */}
                                  <div className="flex items-center h-[44px] md:h-[38px] rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus-within:bg-white overflow-hidden focus-within:border-[#2864E8] focus-within:ring-2 focus-within:ring-[#2864E8]/15 transition-all">
                                    <span className="pl-3.5 pr-1.5 text-[13.5px] md:text-[12.5px] font-bold md:font-semibold text-[#173568]/75 md:text-slate-500 tabular-nums select-none shrink-0">
                                      +91
                                    </span>
                                    <input
                                      type="tel"
                                      maxLength={10}
                                      value={heroEnqMobile}
                                      onChange={(e) => setHeroEnqMobile(e.target.value.replace(/\D/g, ''))}
                                      placeholder="Enter your Mobile Number *"
                                      className="flex-1 min-w-0 h-full px-1 pr-3.5 bg-transparent text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal tabular-nums focus:outline-none"
                                    />
                                  </div>

                                  {/* Class / Course Dropdown */}
                                  <div className="relative">
                                    <select
                                      value={heroEnqClass}
                                      onChange={(e) => setHeroEnqClass(e.target.value)}
                                      className={cn(
                                        "w-full h-[44px] md:h-[38px] pl-3.5 pr-9 md:pr-8 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium appearance-none focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all cursor-pointer",
                                        heroEnqClass ? "text-[#173568] md:text-slate-800" : "text-slate-400 md:text-slate-400/90 font-normal"
                                      )}
                                    >
                                      <option value="" disabled>Class / Course *</option>
                                      {[
                                        'Class 4',
                                        'Class 5',
                                        'Class 6',
                                        'Class 7',
                                        'Class 8',
                                        'Class 9',
                                        'Class 10',
                                        'Class 11',
                                        'Class 12',
                                        'Class 12 PASS',
                                      ].map((c) => (
                                        <option key={c} value={c} className="text-slate-900">
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>

                                  {/* Enquiry / Stream / Subject Message */}
                                  <textarea
                                    rows={2}
                                    value={heroEnqMessage}
                                    onChange={(e) => setHeroEnqMessage(e.target.value)}
                                    placeholder="Stream, Subject(s) or Enquiry Message *"
                                    className="w-full h-[66px] md:h-[60px] px-3.5 py-2.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all resize-none leading-snug"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Primary Submit CTA */}
                            <button
                              type="submit"
                              disabled={isHeroEnqSubmitting}
                              className="w-full h-[46px] md:h-[40px] rounded-[10px] md:rounded-[8px] bg-gradient-to-b from-[#2E6BF0] to-[#235CE0] md:bg-none md:bg-[#2864E8] hover:from-[#2660E4] hover:to-[#1C4FD0] md:hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white font-bold text-[14.5px] md:text-[14px] tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_18px_-4px_rgba(40,100,232,0.38)] md:shadow-[0_4px_14px_-2px_rgba(40,100,232,0.34)] md:hover:shadow-[0_6px_18px_-2px_rgba(40,100,232,0.44)] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-65 mt-auto"
                            >
                              {isHeroEnqSubmitting ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <span>Submit Enquiry</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 02: OVERLAPPING CONTACT, LOCATION, HOURS & SOCIAL MEDIA BAR (HIDDEN ON MOBILE, PRESERVED ON TABLET/DESKTOP) ── */}
      <div className="hidden md:block relative w-full z-30 md:-mt-10 lg:-mt-12 md:px-6 pointer-events-auto md:pb-3">
        <div className="container mx-auto px-0 max-w-[1360px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full rounded-[16px] md:rounded-[18px] bg-white border border-slate-200/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_20px_-8px_rgba(9,26,58,0.06),0_1px_3px_rgba(9,26,58,0.025)] md:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_12px_32px_-12px_rgba(9,26,58,0.09),0_2px_6px_rgba(9,26,58,0.03)] px-5 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-9 lg:py-6 lg:min-h-[108px] flex items-center antialiased"
          >
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-0 sm:gap-y-5 sm:gap-x-6 lg:gap-y-0 lg:gap-x-0 divide-y sm:divide-y-0 divide-slate-200/50 items-stretch">
              
              {/* Group 1 – Contact Us */}
              <div className="pb-3.5 sm:pb-0 lg:pr-6 xl:pr-7 flex items-center gap-4">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-b from-emerald-50 to-emerald-50/60 border border-emerald-200/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(16,185,129,0.06)] text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 lg:w-[17px] lg:h-[17px] stroke-[1.85] text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-500/85 tracking-[0.12em] uppercase block leading-none">Contact Us</p>
                  <a href={`tel:${heroTel}`} className="text-[14.5px] lg:text-[15px] xl:text-[15.5px] font-bold text-[#173568] hover:text-[#2864E8] mt-2 block leading-[1.35] tracking-[-0.015em] tabular-nums whitespace-nowrap transition-colors duration-150">
                    {heroPhone}
                  </a>
                </div>
              </div>

              {/* Group 2 – Branch Address */}
              <div className="relative py-3.5 sm:py-0 lg:px-6 xl:px-7 flex items-center gap-4 lg:before:content-[''] lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:-translate-y-1/2 lg:before:h-12 lg:before:w-px lg:before:bg-slate-200/75">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-b from-blue-50 to-blue-50/60 border border-blue-200/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(40,100,232,0.06)] text-[#2864E8] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 lg:w-[17px] lg:h-[17px] stroke-[1.85] text-[#2864E8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-500/85 tracking-[0.12em] uppercase block leading-none">Branch Address</p>
                  <p className="text-[14px] xl:text-[14.5px] text-[#173568] font-bold mt-2 leading-[1.42] tracking-[-0.01em] xl:whitespace-nowrap">
                    A-1/6 Budh Vihar, Delhi-86
                  </p>
                </div>
              </div>

              {/* Group 3 – Working Time */}
              <div className="relative py-3.5 sm:py-0 lg:px-6 xl:px-7 flex items-center gap-4 lg:before:content-[''] lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:-translate-y-1/2 lg:before:h-12 lg:before:w-px lg:before:bg-slate-200/75">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-b from-amber-50 to-amber-50/60 border border-amber-200/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(200,142,34,0.07)] text-[#C88E22] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 lg:w-[17px] lg:h-[17px] stroke-[1.85] text-[#C88E22]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-500/85 tracking-[0.12em] uppercase block leading-none">Working Time</p>
                  <p className="mt-2 text-[14px] xl:text-[14.5px] text-[#173568] font-bold leading-[1.42] tracking-[-0.01em] tabular-nums">
                    <span className="whitespace-nowrap">Mon – Sat:</span>{' '}
                    <span className="whitespace-nowrap">8:00 AM – 9:30 PM</span>
                  </p>
                </div>
              </div>

              {/* Group 4 – Connect Us (Instagram & YouTube Only) */}
              <div className="relative pt-3.5 sm:pt-0 lg:pl-6 xl:pl-7 flex items-center lg:before:content-[''] lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:-translate-y-1/2 lg:before:h-12 lg:before:w-px lg:before:bg-slate-200/75">
                <div className="min-w-0 flex-1">
                  <p className="text-[10.5px] font-bold text-slate-500/85 tracking-[0.14em] uppercase block leading-none pl-0.5">Connect Us</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    <a
                      href="https://www.instagram.com/idleducationbudhvihar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow IDL Education Budh Vihar on Instagram"
                      className="group inline-flex items-center justify-center gap-2 w-[126px] h-[38px] px-3.5 rounded-[11px] bg-white hover:bg-[#FFF5F8] border border-slate-200/85 hover:border-[#F3C2D4] shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_1px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_14px_-4px_rgba(225,48,108,0.18)] hover:-translate-y-[1.5px] active:translate-y-0 text-[#173568] hover:text-[#C1255B] text-[13.5px] font-semibold leading-none tracking-[-0.01em] transition-all duration-200 ease-out cursor-pointer"
                    >
                      <Instagram className="w-[16.5px] h-[16.5px] stroke-[2] text-[#E1306C] shrink-0 transition-transform duration-200 ease-out group-hover:scale-105" />
                      <span>Instagram</span>
                    </a>

                    <a
                      href="https://www.youtube.com/@IDLEducationBudhVihar"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Subscribe to IDL Education Budh Vihar on YouTube"
                      className="group inline-flex items-center justify-center gap-2 w-[126px] h-[38px] px-3.5 rounded-[11px] bg-white hover:bg-[#FFF5F5] border border-slate-200/85 hover:border-[#F7C4C4] shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_1px_rgba(15,23,42,0.02)] hover:shadow-[0_6px_14px_-4px_rgba(229,45,39,0.18)] hover:-translate-y-[1.5px] active:translate-y-0 text-[#173568] hover:text-[#C81E1E] text-[13.5px] font-semibold leading-none tracking-[-0.01em] transition-all duration-200 ease-out cursor-pointer"
                    >
                      <Youtube className="w-[18px] h-[18px] stroke-[2] text-[#E52D27] shrink-0 transition-transform duration-200 ease-out group-hover:scale-105" />
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SECTIONS 04–06: ACADEMIC PROGRAMS, TIMETABLE & BRANCH FACILITIES ── */}
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 idl-section-stack pt-6 sm:pt-7 md:pt-10 lg:pt-12 pb-6 sm:pb-7 md:pb-8 lg:pb-9">

        {/* ── SECTION 04: ACADEMIC PROGRAMS (COURSES & CLASSES OFFERED) ── */}
        <section className="relative w-full -mb-3">
          
          {/* Centered Section Heading matching Timetable Visual Hierarchy */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-6 lg:mb-7">
            <h2 className="text-[23px] min-[390px]:text-[25px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-[-0.025em] leading-tight">
              <span className="text-[#173568]">Explore </span>
              <span className="text-[#2864E8]">Our Programs</span>
            </h2>
          </div>

          {/* Horizontal Scrollable Programs Carousel */}
          <div className="relative -mx-3 sm:-mx-4 md:mx-0 md:px-10 lg:px-11">
            {/* Left Scroll Chevron */}
            <button
              type="button"
              onClick={() => scrollProgramsBy('left')}
              aria-label="Scroll academic programs left"
              disabled={!canScrollProgramsLeft}
              className={cn(
                "hidden md:flex items-center justify-center absolute left-0 top-[calc(50%-6px)] -translate-y-1/2 z-20 w-8 h-8 lg:w-9 lg:h-9 rounded-full border transition-all duration-200 cursor-pointer",
                canScrollProgramsLeft
                  ? "bg-white border-slate-200/80 text-[#2864E8] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)] hover:border-[#2864E8]/40 hover:bg-[#F5F8FF] hover:shadow-[0_4px_12px_-2px_rgba(40,100,232,0.16)] active:scale-95"
                  : "bg-white/70 border-slate-100 text-slate-300 opacity-50 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-[18px] h-[18px] stroke-[2.25]" />
            </button>

            {/* Right Scroll Chevron */}
            <button
              type="button"
              onClick={() => scrollProgramsBy('right')}
              aria-label="Scroll academic programs right"
              disabled={!canScrollProgramsRight}
              className={cn(
                "hidden md:flex items-center justify-center absolute right-0 top-[calc(50%-6px)] -translate-y-1/2 z-20 w-8 h-8 lg:w-9 lg:h-9 rounded-full border transition-all duration-200 cursor-pointer",
                canScrollProgramsRight
                  ? "bg-white border-slate-200/80 text-[#2864E8] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)] hover:border-[#2864E8]/40 hover:bg-[#F5F8FF] hover:shadow-[0_4px_12px_-2px_rgba(40,100,232,0.16)] active:scale-95"
                  : "bg-white/70 border-slate-100 text-slate-300 opacity-50 pointer-events-none"
              )}
            >
              <ChevronRight className="w-[18px] h-[18px] stroke-[2.25]" />
            </button>

            {/* Scroll Track */}
            <div
              ref={programsSliderRef}
              onScroll={updateProgramsScrollState}
              className="flex items-stretch gap-3.5 sm:gap-4 md:gap-[18px] lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-5 md:scroll-pl-0 pt-1 pb-3 px-4 sm:px-5 md:px-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {[
                {
                  id: 'junior-foundation',
                  classLabel: 'Class 4 - 8',
                  title: 'Junior Foundation',
                  image: '/mangolpuri/girl.png',
                  alt: 'Class 4 - 8 Junior Foundation Student',
                  priority: true,
                  onEnroll: () => {
                    setEnrollProgramTitle('Class 4–8 Junior Foundation');
                    setEnrollAllowedClasses(JUNIOR_CLASSES);
                    setEnrollAllowedCourses(JUNIOR_COURSES);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse(JUNIOR_COURSES[0]);
                    setIsEnrollOpen(true);
                  },
                },
                {
                  id: 'secondary-board',
                  classLabel: 'Class 9 - 10',
                  title: 'Secondary Board',
                  image: '/mangolpuri/boy.png',
                  alt: 'Class 9 and 10 CBSE Board Student',
                  priority: true,
                  onEnroll: () => {
                    setEnrollProgramTitle('Class 9 & 10 Secondary Board');
                    setEnrollAllowedClasses(SECONDARY_CLASSES);
                    setEnrollAllowedCourses(SECONDARY_COURSES);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse(SECONDARY_COURSES[0]);
                    setIsEnrollOpen(true);
                  },
                },
                {
                  id: 'jee-neet-preparation',
                  classLabel: 'Class 11 - 12 / 12 PASS',
                  title: 'JEE / NEET FOUNDATION',
                  image: '/mangolpuri/girl.png',
                  alt: 'JEE and NEET Foundation Student',
                  priority: true,
                  onEnroll: () => {
                    setEnrollProgramTitle('JEE / NEET FOUNDATION');
                    setEnrollAllowedClasses(JEE_NEET_CLASSES);
                    setEnrollAllowedCourses(JEE_NEET_COURSES);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse(JEE_NEET_COURSES[0]);
                    setIsEnrollOpen(true);
                  },
                },
                {
                  id: 'science-program',
                  classLabel: 'Class 11 - 12',
                  title: 'Science Program',
                  image: '/mangolpuri/boy.png',
                  alt: 'Class 11 and 12 Science Program Student',
                  priority: false,
                  onEnroll: () => {
                    setEnrollProgramTitle('Class 11 & 12 Science Program');
                    setEnrollAllowedClasses(SENIOR_CLASSES);
                    setEnrollAllowedCourses(['Class 11 & 12 Science Program (Physics, Chemistry, Mathematics & Biology)']);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse('Class 11 & 12 Science Program (Physics, Chemistry, Mathematics & Biology)');
                    setIsEnrollOpen(true);
                  },
                },
                {
                  id: 'commerce-program',
                  classLabel: 'Class 11 - 12',
                  title: 'Commerce Program',
                  image: '/mangolpuri/girl.png',
                  alt: 'Class 11 and 12 Commerce Program Student',
                  priority: false,
                  onEnroll: () => {
                    setEnrollProgramTitle('Class 11 & 12 Commerce Program');
                    setEnrollAllowedClasses(SENIOR_CLASSES);
                    setEnrollAllowedCourses(SENIOR_COURSES);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse(SENIOR_COURSES[0]);
                    setIsEnrollOpen(true);
                  },
                },
                {
                  id: 'humanities-program',
                  classLabel: 'Class 11 - 12',
                  title: 'Humanities Program',
                  image: '/mangolpuri/boy.png',
                  alt: 'Class 11 and 12 Humanities Program Student',
                  priority: false,
                  onEnroll: () => {
                    setEnrollProgramTitle('Class 11 & 12 Humanities Program');
                    setEnrollAllowedClasses(SENIOR_CLASSES);
                    setEnrollAllowedCourses(['Class 11 & 12 Humanities Program']);
                    setEnrollDefaultClass('');
                    setEnrollDefaultCourse('Class 11 & 12 Humanities Program');
                    setIsEnrollOpen(true);
                  },
                },
              ].map((program) => (
                <div
                  key={program.id}
                  onClick={program.onEnroll}
                  className="group snap-start shrink-0 w-[252px] min-[390px]:w-[262px] sm:w-[260px] lg:w-[256px] rounded-[14px] bg-[#F8FAFC] border border-slate-200/80 hover:border-[#2864E8]/35 p-3.5 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.06),0_10px_22px_-12px_rgba(23,53,104,0.10)] hover:shadow-[0_14px_28px_-12px_rgba(23,53,104,0.16)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer select-none"
                >
                  {/* Clean Top Image Frame Only (No Overlays or Badges) */}
                  <div className="relative w-full h-[178px] sm:h-[184px] rounded-[10px] overflow-hidden bg-gradient-to-b from-[#F0F6FE] via-[#EDF4FD] to-[#E5EFFC] ring-1 ring-inset ring-[#DCE8F8]/70 flex items-end justify-center pt-3">
                    <div className="relative w-full h-[166px] sm:h-[172px] transition-transform duration-300 ease-out group-hover:scale-[1.03] pointer-events-none">
                      <Image
                        src={program.image}
                        alt={program.alt}
                        fill
                        sizes="(max-width: 640px) 262px, 260px"
                        className="object-contain object-bottom"
                        priority={program.priority}
                      />
                    </div>
                  </div>

                  {/* Minimal Card Body: Class -> Heading -> Underlined Enroll Now Link */}
                  <div className="pt-4 pb-1.5 px-1 flex flex-col flex-1 justify-between text-left antialiased">
                    <div className="min-w-0">
                      <p className="text-[13px] sm:text-[13.5px] font-bold text-[#2864E8] tracking-[0.005em] leading-snug tabular-nums">
                        {program.classLabel}
                      </p>
                      <h3
                        style={{ wordSpacing: '0.1em' }}
                        className="text-[14px] sm:text-[14.5px] font-extrabold uppercase text-[#173568] tracking-[0.01em] group-hover:text-[#2864E8] transition-colors duration-200 leading-[1.35] mt-1.5"
                      >
                        {program.title}
                      </h3>
                    </div>

                    <div className="mt-5">
                      <span className="inline-block text-[14px] sm:text-[14.5px] font-bold text-[#2864E8] group-hover:text-[#173568] border-b-[1.5px] border-[#2864E8] group-hover:border-[#173568] pb-[3px] tracking-[0.005em] leading-none transition-colors duration-200">
                        Enroll Now
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ── SECTION 05: WEEKLY CLASS TIMETABLE ────────────────────────── */}
        <section id="weekly-timetable" className="relative w-full overflow-visible bg-white">

          {/* 1. Centered Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-5">
            <h2 className="text-[23px] min-[390px]:text-[25px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-[-0.025em] leading-tight">
              <span className="text-[#173568]">Weekly </span>
              <span className="text-[#2864E8]">Time-table</span>
            </h2>
          </div>

          {/* 2. Restrained Minimal Class Tabs */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-0.5 p-[3px] rounded-full bg-[#F5F8FC] border border-slate-200/50 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {[
                { id: '9', label: 'Class 9' },
                { id: '10', label: 'Class 10' },
                { id: '11', label: 'Class 11' },
                { id: '12', label: 'Class 12' },
              ].map((tab) => {
                const isActive = timetableTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTimetableTab(tab.id as any)}
                    className={cn(
                      "relative z-10 h-[32px] sm:h-[34px] px-3.5 min-[390px]:px-4 sm:px-5 rounded-full inline-flex items-center justify-center text-[12.5px] sm:text-[13px] tracking-[0.005em] leading-none whitespace-nowrap transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2864E8]/25 select-none",
                      isActive
                        ? "font-semibold text-[#2864E8]"
                        : "font-medium text-slate-500 hover:text-[#173568]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTimetableUnderlineBV"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-white ring-1 ring-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(40,100,232,0.04)] -z-10"
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Main 2-Column Content Layout (Clean Single-Level Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            
            {/* Left Column (lg:col-span-8) – Clean Weekly Timetable Card */}
            <div className="lg:col-span-8 flex flex-col">
              <AnimatePresence mode="wait">
                {(() => {
                  const activeSchedule = BUDHVIHAR_WEEKLY_TIMETABLE[timetableTab];
                  return (
                    <motion.div
                      key={`class-${timetableTab}-timetable`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-[14px] sm:rounded-[16px] bg-white border border-slate-200/80 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col h-full"
                    >
                      {/* Clean Subtle Header Strip with Consistent Month & Week Controls */}
                      <div className="bg-[#F8FAFD] border-b border-slate-200/75 px-4 py-2.5 sm:px-5 min-h-[52px] flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className="w-4 h-4 text-[#2864E8] shrink-0" />
                          <h3 className="text-[14.5px] sm:text-[15.5px] font-extrabold tracking-[-0.015em] text-[#173568] leading-snug">
                            {activeSchedule.classLabel}
                          </h3>
                        </div>

                        {/* Session Month Selector (Apr 2026 – Mar 2027, up to Current Month) + Week Stepper (up to Current Week) */}
                        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 min-w-0">
                          <div className="relative shrink-0">
                            <select
                              aria-label="Select timetable month"
                              value={activeSessionWeek?.monthKey ?? ''}
                              onChange={(e) => handleSelectTimetableMonth(e.target.value)}
                              className="h-[30px] pl-2 min-[360px]:pl-2.5 pr-5 min-[360px]:pr-6 rounded-md bg-white border border-slate-200/90 hover:border-slate-300 text-[12px] font-bold text-[#173568] appearance-none cursor-pointer focus:outline-none focus:border-[#2864E8] transition-colors"
                            >
                              {sessionCalendar.months.map((m) => (
                                <option key={m.key} value={m.key}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          <div className="inline-flex items-center h-[30px] rounded-md bg-white border border-slate-200/90 overflow-hidden min-w-0">
                            <button
                              type="button"
                              onClick={handlePrevTimetableWeek}
                              disabled={safeWeekIndex <= 0}
                              aria-label="Previous week"
                              className="w-[24px] min-[360px]:w-[26px] h-full flex items-center justify-center border-r border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-[#2864E8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-1.5 min-[360px]:px-2 sm:px-2.5 inline-flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-semibold text-slate-600 tabular-nums whitespace-nowrap select-none">
                              <Clock className="hidden min-[360px]:inline-block w-3 h-3 text-slate-400 shrink-0" />
                              <span>{activeSessionWeek?.rangeLabel}</span>
                            </span>
                            <button
                              type="button"
                              onClick={handleNextTimetableWeek}
                              disabled={safeWeekIndex >= sessionCalendar.currentWeekIndex}
                              aria-label="Next week"
                              className="w-[24px] min-[360px]:w-[26px] h-full flex items-center justify-center border-l border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-[#2864E8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Clean White Side-by-Side MWF / TTS Columns with Understated Separation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/75 flex-1 bg-white">
                        {activeSchedule.columns.map((col) => (
                          <div
                            key={col.dayCode}
                            className="px-4 py-3.5 sm:px-5 sm:py-4 lg:py-5 flex flex-col justify-start"
                          >
                            {/* Clean Weekday Header */}
                            <div className="flex items-baseline flex-wrap gap-2 pb-3 border-b border-slate-100">
                              <span className="text-[13px] sm:text-[13.5px] font-extrabold text-[#173568] tracking-[0.04em]">
                                {col.dayCode}
                              </span>
                              <span className="text-[12.5px] sm:text-[13px] font-medium text-slate-500">
                                {col.dayNames}
                              </span>
                            </div>

                            {/* Separate Subject & Timing Rows Aligned Side-by-Side */}
                            <div className="divide-y divide-slate-100">
                              {col.slots.map((slot, slotIdx) => {
                                const isEmptySlot = slot.subject === '---';
                                return (
                                  <div
                                    key={`${col.dayCode}-${slotIdx}`}
                                    className={cn(
                                      "flex items-center justify-between gap-3",
                                      slotIdx === col.slots.length - 1 ? "pt-3 pb-0" : "py-3"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "text-[13.5px] sm:text-[14px] leading-snug text-left min-w-0",
                                        isEmptySlot
                                          ? "font-medium text-slate-400 tracking-[0.14em] select-none"
                                          : "font-bold text-[#173568]"
                                      )}
                                    >
                                      {slot.subject}
                                    </span>
                                    <span className="text-[13px] sm:text-[13.5px] font-bold text-[#2864E8] tabular-nums whitespace-nowrap shrink-0 text-right">
                                      {slot.time}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Right Column (lg:col-span-4) – Matched Clean Sunday Special Card */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="rounded-[14px] sm:rounded-[16px] bg-white border border-slate-200/80 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col w-full h-full">
                {/* Matched Quiet Header Strip */}
                <div className="bg-[#F8FAFD] border-b border-slate-200/75 px-4 py-2.5 sm:px-5 min-h-[52px] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2864E8] shrink-0" />
                  <span className="font-extrabold text-[14.5px] sm:text-[15.5px] tracking-[-0.015em] text-[#173568] leading-snug">
                    Sunday Special
                  </span>
                </div>

                {/* Clean White List with Subtle Dividers */}
                <div className="px-4 py-1.5 sm:px-5 sm:py-2 flex-1 flex flex-col justify-center bg-white">
                  <div className="divide-y divide-slate-100">
                    <div className="flex items-center py-2.5 sm:py-3">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#173568] leading-[1.45]">
                        Weekly Subject Tests &amp; Assessment
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 sm:py-3">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#173568] leading-[1.45]">
                        Dedicated 1-on-1 Doubt Clearing
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 sm:py-3">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#173568] leading-[1.45]">
                        Special Concept &amp; Strategy Workshops
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 sm:py-3">
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#173568] leading-[1.45]">
                        Comprehensive Revision &amp; Answer Writing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── SECTION 06: BRANCH FACILITIES & LEARNING ENVIRONMENT ───── */}
        <section className="relative w-full overflow-hidden bg-white">
          
          {/* Centered Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-7 lg:mb-8">
            <h2 className="text-[23px] min-[390px]:text-[25px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-[-0.025em] leading-tight whitespace-nowrap">
              <span className="text-[#173568]">Branch </span>
              <span className="text-[#2864E8]">Facilities</span>
            </h2>
          </div>

          {/* Equal Grid: Clean Single-Column on Mobile (16px spacing), 3-Column on Desktop (Same images as Mangolpuri) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {[
              { src: "/mangolpuri/01.png", alt: "IDL Education Budh Vihar Smart Classroom" },
              { src: "/mangolpuri/05.png", alt: "IDL Education Budh Vihar Interactive Teaching" },
              { src: "/mangolpuri/03.png", alt: "IDL Education Budh Vihar Campus Reception" },
              { src: "/mangolpuri/04.png", alt: "IDL Education Budh Vihar Digital Smartboard" },
              { src: "/mangolpuri/06.png", alt: "IDL Education Budh Vihar Classroom Learning" },
              { src: "/mangolpuri/02.png", alt: "IDL Education Budh Vihar Batch Study Session" },
            ].map((facility, idx) => (
              <div
                key={idx}
                className="relative aspect-[16/9.5] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-100"
              >
                <Image
                  src={facility.src}
                  alt={facility.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover select-none pointer-events-none"
                />
              </div>
            ))}
          </div>

        </section>

      </div>

      {/* ── SECTION 06B: MEET BRANCH DIRECTOR (Below Branch Facilities) ── */}
      <section className="relative w-full overflow-hidden idl-section-y">
        
        {/* Subtle, Distraction-Free Soft Canvas Transition */}
        <div 
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFD 18%, #F8FAFD 82%, #FFFFFF 100%)',
          }}
        />

        {/* Inner Content Container */}
        <div className="relative z-10 w-full max-w-[1160px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          
          {/* Centered Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 lg:mb-12">
            <h2 className="text-[23px] min-[390px]:text-[25px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-[-0.025em] leading-tight">
              <span className="text-[#173568]">Meet </span>
              <span className="text-[#2864E8]">Branch Director</span>
            </h2>
          </div>

          {/* ── DESKTOP DIRECTOR LAYOUT (Balanced Editorial 2-Column Composition) ── */}
          <div className="hidden lg:grid grid-cols-12 gap-10 xl:gap-14 items-center">
            
            {/* Left Column: Clean, Natural Executive Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[390px] aspect-[10/10.8] rounded-2xl overflow-hidden border border-slate-200/75 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)] bg-slate-100">
                <Image
                  src="/budhvihar/chandu.png"
                  alt="Chandra Prakash - Academic Head & Branch Director"
                  fill
                  sizes="400px"
                  className="object-cover object-center select-none pointer-events-none"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Clean Editorial Tabs, Readable Copy & Refined Signature */}
            <div className="lg:col-span-7 flex flex-col justify-center lg:pl-2">
              <div className="w-full max-w-[600px]">
                
                {/* Subtle, Clean Tabs */}
                <div className="flex items-center gap-7 border-b border-slate-200/85 pb-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveMessageTab('director')}
                    className={cn(
                      "pb-3 text-[12px] xl:text-[12.5px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 cursor-pointer relative -mb-[13px] outline-none",
                      activeMessageTab === 'director'
                        ? "text-[#173568]"
                        : "text-slate-500 hover:text-[#173568]"
                    )}
                  >
                    <span>Director Message</span>
                    {activeMessageTab === 'director' && (
                      <motion.span
                        layoutId="activeLeadershipUnderlineDesktopBV"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-[#2864E8] rounded-full"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMessageTab('profile')}
                    className={cn(
                      "pb-3 text-[12px] xl:text-[12.5px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 cursor-pointer relative -mb-[13px] outline-none",
                      activeMessageTab === 'profile'
                        ? "text-[#173568]"
                        : "text-slate-500 hover:text-[#173568]"
                    )}
                  >
                    <span>Director Profile</span>
                    {activeMessageTab === 'profile' && (
                      <motion.span
                        layoutId="activeLeadershipUnderlineDesktopBV"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-[#2864E8] rounded-full"
                      />
                    )}
                  </button>
                </div>

                {/* Paragraph Content Grid Stack (Height locked to taller content for smooth switching) */}
                <div className="grid grid-cols-1">
                  {/* View 1: Director Message */}
                  <div
                    className={cn(
                      "col-start-1 row-start-1 w-full space-y-4 transition-opacity duration-200",
                      activeMessageTab === 'director'
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none invisible"
                    )}
                  >
                    <p className="text-[16px] xl:text-[16.5px] font-semibold text-[#173568] leading-[1.7] tracking-[-0.01em]">
                      &ldquo;At IDL Education Budh Vihar, our mission is to build deep conceptual clarity, disciplined study habits, and independent analytical thinking in every student. We firmly believe that when provided with the right mentorship, structured guidance, and continuous encouragement, every child has the potential to excel.&rdquo;
                    </p>

                    <p className="text-[14.5px] xl:text-[15px] font-normal text-slate-600 leading-[1.72]">
                      &ldquo;Through our rigorous weekly test evaluations, personalized one-on-one doubt clearing sessions, and consistent parent-teacher engagement, we ensure steady academic progress, confidence building, and top rank performance across school tests, CBSE Board exams, and competitive entrances.&rdquo;
                    </p>
                  </div>

                  {/* View 2: Director Profile */}
                  <div
                    className={cn(
                      "col-start-1 row-start-1 w-full space-y-4 transition-opacity duration-200",
                      activeMessageTab === 'profile'
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none invisible"
                    )}
                  >
                    <p className="text-[16px] xl:text-[16.5px] font-semibold text-[#173568] leading-[1.7] tracking-[-0.01em]">
                      &ldquo;Senior Mathematics Faculty with 7+ years of distinguished teaching and mentorship experience. M.Sc. Mathematics specialist dedicated to building deep mathematical intuition, visual problem solving, and structured conceptual clarity for CBSE Boards and competitive exams.&rdquo;
                    </p>

                    <p className="text-[14.5px] xl:text-[15px] font-normal text-slate-600 leading-[1.72]">
                      &ldquo;His signature teaching methodology combines structured shortcuts with strong fundamentals. Through chapter-wise test series and step-by-step exam preparation, he consistently guides students to achieve 95%+ marks and top percentiles.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Compact Integrated Signature & Designation */}
                <div className="mt-4 flex flex-col items-end text-right">
                  <h4 className="text-[19px] xl:text-[20px] font-extrabold text-[#173568] tracking-[-0.02em] leading-tight">
                    Chandra Prakash
                  </h4>
                  <p className="text-[11px] xl:text-[11.5px] font-bold text-[#2864E8] tracking-[0.08em] uppercase mt-1 leading-snug">
                    Academic Head &amp; Branch Director
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ── MOBILE & TABLET DIRECTOR LAYOUT (< lg) ── */}
          <div className="flex lg:hidden w-full max-w-none sm:max-w-xl mx-auto flex-col items-center text-center">
            
            {/* 1. Director Portrait (Refined Compact Mobile Footprint, Same Proportions) */}
            <div className="w-full max-w-[250px] min-[390px]:max-w-[268px] sm:max-w-[310px] mx-auto">
              <div className="relative w-full aspect-[10/10.8] rounded-2xl overflow-hidden border border-slate-200/75 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.12)] bg-slate-100">
                <Image
                  src="/budhvihar/chandu.png"
                  alt="Chandra Prakash - Academic Head & Branch Director"
                  fill
                  sizes="(max-width: 640px) 268px, 310px"
                  className="object-cover object-center select-none pointer-events-none"
                  priority
                />
              </div>
            </div>

            {/* 2. Director Identity */}
            <div className="mt-3 flex flex-col items-center text-center">
              <h3 className="text-[18.5px] sm:text-[20px] font-extrabold text-[#173568] tracking-[-0.02em] leading-tight">
                Chandra Prakash
              </h3>
              <p className="text-[11px] sm:text-[11.5px] font-bold text-[#2864E8] tracking-[0.08em] uppercase mt-1 leading-snug">
                Academic Head &amp; Branch Director
              </p>
            </div>

            {/* 3. Director Message / Director Profile Tabs (Touch-Friendly & Balanced) */}
            <div className="w-full flex items-center justify-center gap-5 sm:gap-7 border-b border-slate-200/80 mt-3.5 mb-4">
              <button
                type="button"
                onClick={() => setActiveMessageTab('director')}
                className={cn(
                  "px-2 pt-2 pb-2.5 min-h-[40px] text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 cursor-pointer relative -mb-px outline-none select-none",
                  activeMessageTab === 'director'
                    ? "text-[#173568]"
                    : "text-slate-500 hover:text-[#173568]"
                )}
              >
                <span>Director Message</span>
                {activeMessageTab === 'director' && (
                  <motion.span
                    layoutId="activeLeadershipUnderlineMobileBV"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute bottom-0 inset-x-1 h-[2px] bg-[#2864E8] rounded-full"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveMessageTab('profile')}
                className={cn(
                  "px-2 pt-2 pb-2.5 min-h-[40px] text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 cursor-pointer relative -mb-px outline-none select-none",
                  activeMessageTab === 'profile'
                    ? "text-[#173568]"
                    : "text-slate-500 hover:text-[#173568]"
                )}
              >
                <span>Director Profile</span>
                {activeMessageTab === 'profile' && (
                  <motion.span
                    layoutId="activeLeadershipUnderlineMobileBV"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute bottom-0 inset-x-1 h-[2px] bg-[#2864E8] rounded-full"
                  />
                )}
              </button>
            </div>

            {/* 4. Message or Profile Content Area (Clean Margins & Comfortable Bottom Clearance) */}
            <div className="w-full px-1 sm:px-2 pb-2 text-left">
              <div className="grid grid-cols-1">
                
                {/* View 1: Director Message */}
                <div
                  className={cn(
                    "col-start-1 row-start-1 w-full space-y-3 transition-opacity duration-200",
                    activeMessageTab === 'director'
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none invisible"
                  )}
                >
                  <p className="text-[14px] min-[390px]:text-[14.5px] sm:text-[15.5px] font-semibold text-[#173568] leading-[1.68] tracking-[-0.01em]">
                    &ldquo;At IDL Education Budh Vihar, our mission is to build deep conceptual clarity, disciplined study habits, and independent analytical thinking in every student. We firmly believe that when provided with the right mentorship, structured guidance, and continuous encouragement, every child has the potential to excel.&rdquo;
                  </p>

                  <p className="text-[13.5px] sm:text-[14.5px] font-normal text-slate-600 leading-[1.7]">
                    &ldquo;Through our rigorous weekly test evaluations, personalized one-on-one doubt clearing sessions, and consistent parent-teacher engagement, we ensure steady academic progress, confidence building, and top rank performance across school tests, CBSE Board exams, and competitive entrances.&rdquo;
                  </p>
                </div>

                {/* View 2: Director Profile */}
                <div
                  className={cn(
                    "col-start-1 row-start-1 w-full space-y-3 transition-opacity duration-200",
                    activeMessageTab === 'profile'
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none invisible"
                  )}
                >
                  <p className="text-[14px] min-[390px]:text-[14.5px] sm:text-[15.5px] font-semibold text-[#173568] leading-[1.68] tracking-[-0.01em]">
                    &ldquo;Senior Mathematics Faculty with 7+ years of distinguished teaching and mentorship experience. M.Sc. Mathematics specialist dedicated to building deep mathematical intuition, visual problem solving, and structured conceptual clarity for CBSE Boards and competitive exams.&rdquo;
                  </p>

                  <p className="text-[13.5px] sm:text-[14.5px] font-normal text-slate-600 leading-[1.7]">
                    &ldquo;His signature teaching methodology combines structured shortcuts with strong fundamentals. Through chapter-wise test series and step-by-step exam preparation, he consistently guides students to achieve 95%+ marks and top percentiles.&rdquo;
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 07: FREQUENTLY ASKED QUESTIONS ── */}
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-7 md:pt-8 lg:pt-9 pb-14 sm:pb-16 lg:pb-16">

        {/* ── SECTION 07: FREQUENTLY ASKED QUESTIONS (2-COLUMN FULL-WIDTH SECTION: 3 LEFT + 3 RIGHT) ── */}
        <section id="branch-faq" className="relative w-full">
          {/* Centered Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-7 lg:mb-8">
            <h2 className="text-[23px] min-[390px]:text-[25px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-[-0.025em] leading-tight">
              <span className="text-[#173568]">Frequently Asked </span>
              <span className="text-[#2864E8]">Questions</span>
            </h2>
          </div>

          {/* Clean 2-Column Accordion Grid (3 Questions Left + 3 Questions Right on Desktop, Unified List on Mobile) */}
          {(() => {
            const leftFaqs = [
              {
                q: "What is the landmark for IDL Education Budh Vihar?",
                a: "The centre is located at A-1/6 Budh Vihar, Phase -1, Delhi-110086, near Pocket-D Park & Brahm Shakti Hospital Road."
              },
              {
                q: "Which is the nearest metro station to Budh Vihar branch?",
                a: "Rithala Metro Station on the Red Line is the nearest metro station, approximately 7–8 minutes away by e-rickshaw or auto."
              },
              {
                q: "Does Budh Vihar branch provide printed study material?",
                a: "Yes, all enrolled students receive comprehensive printed study modules, chapter-wise worksheets, formula booklets, and previous 10 years question banks."
              }
            ];

            const rightFaqs = [
              {
                q: "What are the office visiting hours for IDL Education Budh Vihar?",
                a: "Our Budh Vihar centre is open from Monday to Saturday between 8:00 AM and 9:30 PM, and on Sundays from 9:00 AM to 2:00 PM for demo classes, parent counseling, and doubt sessions."
              },
              {
                q: "Can I take a free demo class before enrolling at Budh Vihar?",
                a: "Yes! IDL Education offers 2 complimentary trial demo classes for any student. You can click 'Book Free Demo' or visit the centre directly to schedule your demo slot."
              },
              {
                q: "What is the batch size at Budh Vihar branch?",
                a: "We maintain a strict maximum limit of 25 to 30 students per batch to guarantee personal faculty attention and individual doubt resolution."
              }
            ];

            const renderFaqColumn = (items: { q: string; a: string }[], offset: number, isRightCol: boolean) => (
              <div
                className={cn(
                  "min-w-0 w-full divide-y divide-slate-200/75",
                  isRightCol
                    ? "border-y border-slate-200/80"
                    : "border-t border-slate-200/80 lg:border-b"
                )}
              >
                {items.map((faq, idx) => {
                  const globalIdx = offset + idx;
                  const isOpen = openFaqIndex === globalIdx;
                  return (
                    <div key={globalIdx}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                        aria-expanded={isOpen}
                        className="w-full py-4 px-0.5 sm:px-1 text-left flex items-start justify-between gap-4 group cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2864E8]/25 rounded-md"
                      >
                        <span className="flex-1 min-w-0 text-[14px] sm:text-[15px] font-extrabold text-[#173568] group-hover:text-[#2864E8] tracking-[-0.015em] leading-[1.45] transition-colors duration-200">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 shrink-0 mt-[3px] transition-transform duration-200",
                            isOpen
                              ? "text-[#2864E8] rotate-180"
                              : "text-slate-400 group-hover:text-[#2864E8]"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-0.5 sm:px-1 pb-4 pr-7 sm:pr-8">
                              <p className="text-[13.5px] sm:text-[14.5px] font-normal text-slate-600 leading-[1.7]">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            );

            return (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-12 items-start">
                {renderFaqColumn(leftFaqs, 0, false)}
                {renderFaqColumn(rightFaqs, leftFaqs.length, true)}
              </div>
            );
          })()}
        </section>

      </div>

      {/* ── MODALS INTEGRATION ───────────────────────────────────────── */}
      <EnrollNowModal 
        isOpen={isEnrollOpen} 
        onOpenChange={setIsEnrollOpen} 
        defaultBranch="Budh Vihar, Delhi-110086"
        defaultClass={enrollDefaultClass}
        defaultCourse={enrollDefaultCourse}
        programTitle={enrollProgramTitle}
        allowedClasses={enrollAllowedClasses}
        allowedCourses={enrollAllowedCourses}
        source="Budh Vihar Branch Page"
      />
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onOpenChange={setIsBookDemoOpen}
        defaultBranch="Budh Vihar, Delhi-110086"
      />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
      <StudentEnquiryModal
        isOpen={isEnquiryOpen}
        onOpenChange={setIsEnquiryOpen}
        defaultBranch="Budh Vihar, Delhi-110086"
      />

    </div>
  );
}
