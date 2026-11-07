'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Clock, 
  GraduationCap, 
  Atom, 
  BookOpen, 
  Users, 
  Navigation, 
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowRight,
  Monitor,
  Target,
  BarChart2,
  FileCheck2,
  Handshake,
  ImageIcon,
  ShieldCheck,
  X,
  Calculator,
  Globe,
  Calendar,
  Zap,
  FlaskConical,
  TrendingUp,
  Database,
  Download,
  HelpCircle,
  Sun
} from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BRANCHES_DATA, BranchInfo } from '@/data/branches-data';
import { useToast } from '@/hooks/use-toast';
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
  SENIOR_COURSES 
} from '@/components/enroll-now-modal';

// Future-Ready Branch Manager Timetable Configuration
export const MANGOLPURI_TIMETABLE_CONFIG = {
  branchName: "Mangolpuri Branch",
  academicYear: "2025–2026",
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

export default function MangolpuriBranchClient({ branch }: BranchDetailClientProps) {
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

  // Vijay Verma Tab ('director' | 'profile')
  const [activeMessageTab, setActiveMessageTab] = useState<'director' | 'profile'>('director');

  // Timetable Tabs (Class 9, Class 10, Class 11, Class 12)
  const [timetableTab, setTimetableTab] = useState<'9' | '10' | '11' | '12'>('9');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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
      doc.text('IDL EDUCATION – MANGOLPURI BRANCH', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text('D-945-46, Block-D, Mangolpuri, Delhi-110083 | Helpline: +91 8860040067', 14, 21);
      doc.text('Official Weekly Class Timetable (Academic Session 2025–2026)', 14, 27);

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
      doc.text('IDL Education – Mangolpuri Branch | Official Schedule', 14, 285);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 165, 285);

      doc.save('IDL_Mangolpuri_Weekly_Timetable.pdf');
      toast({
        title: 'Timetable Downloaded',
        description: 'IDL_Mangolpuri_Weekly_Timetable.pdf has been downloaded successfully.',
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

  // Demo Booking Form
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formClass, setFormClass] = useState('Class 10');
  const [formStream, setFormStream] = useState('Science');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Explore Other IDL Centres continuous slider & manual drag state
  const otherCentresSliderRef = useRef<HTMLDivElement>(null);
  const [isCentresSliderPaused, setIsCentresSliderPaused] = useState(false);
  const isCentresMouseDownRef = useRef(false);
  const centresStartXRef = useRef(0);
  const centresDragMovedRef = useRef(false);
  const centresResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize scroll position at half for infinite bidirectional free scrolling
  useEffect(() => {
    const el = otherCentresSliderRef.current;
    if (el) {
      const half = el.scrollWidth / 2;
      if (half > 0 && el.scrollLeft === 0) {
        el.scrollLeft = half;
      }
    }
  }, []);

  // Auto-scroll loop (continuous right-to-left running slider on both desktop & mobile)
  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.65; // gentle, smooth right-to-left continuous sliding

    const step = () => {
      const el = otherCentresSliderRef.current;
      if (el && !isCentresSliderPaused && !isCentresMouseDownRef.current) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
    };
  }, [isCentresSliderPaused]);

  // Seamless wrap during manual scroll in both directions
  const handleCentresScroll = () => {
    const el = otherCentresSliderRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half > 200) {
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      } else if (el.scrollLeft <= 2) {
        el.scrollLeft += half;
      }
    }
  };

  // Mouse drag handlers (free manual left-right drag on desktop)
  const handleCentresMouseDown = (e: React.MouseEvent) => {
    const el = otherCentresSliderRef.current;
    if (!el) return;
    isCentresMouseDownRef.current = true;
    setIsCentresSliderPaused(true);
    centresDragMovedRef.current = false;
    centresStartXRef.current = e.pageX;
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
  };

  const handleCentresMouseMove = (e: React.MouseEvent) => {
    const el = otherCentresSliderRef.current;
    if (!isCentresMouseDownRef.current || !el) return;
    const deltaX = e.pageX - centresStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      centresDragMovedRef.current = true;
    }
    el.scrollLeft -= deltaX;
    centresStartXRef.current = e.pageX;
  };

  const handleCentresMouseUp = () => {
    if (!isCentresMouseDownRef.current) return;
    isCentresMouseDownRef.current = false;
    setTimeout(() => {
      centresDragMovedRef.current = false;
    }, 80);
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
    centresResumeTimeoutRef.current = setTimeout(() => {
      setIsCentresSliderPaused(false);
    }, 2000);
  };

  const handleCentresMouseLeave = () => {
    if (isCentresMouseDownRef.current) {
      isCentresMouseDownRef.current = false;
      setTimeout(() => {
        centresDragMovedRef.current = false;
      }, 80);
    }
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
    centresResumeTimeoutRef.current = setTimeout(() => {
      setIsCentresSliderPaused(false);
    }, 1500);
  };

  // Touch swipe handlers (free manual left-right swipe on mobile)
  const handleCentresTouchStart = () => {
    setIsCentresSliderPaused(true);
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
  };

  const handleCentresTouchEnd = () => {
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
    centresResumeTimeoutRef.current = setTimeout(() => {
      setIsCentresSliderPaused(false);
    }, 2000);
  };

  // Manual arrow navigation controls (free jump left / right)
  const handleCentresScrollManual = (direction: 'left' | 'right') => {
    const el = otherCentresSliderRef.current;
    if (!el) return;
    setIsCentresSliderPaused(true);
    const cardStep = 250;
    const shift = direction === 'left' ? -cardStep : cardStep;
    el.scrollBy({ left: shift, behavior: 'smooth' });
    if (centresResumeTimeoutRef.current) clearTimeout(centresResumeTimeoutRef.current);
    centresResumeTimeoutRef.current = setTimeout(() => {
      setIsCentresSliderPaused(false);
    }, 2500);
  };

  // Branch cards list repeated for continuous loop
  const OTHER_IDL_CENTRES_ITEMS = [
    {
      name: "Budh Vihar",
      pincode: "Delhi – 110086",
      slug: "budh-vihar",
      image: "/images/branches/budh-vihar.jpg"
    },
    {
      name: "Krishna Vihar",
      pincode: "Delhi – 110086",
      slug: "krishna-vihar",
      image: "/images/branches/krishna-vihar.jpg"
    },
    {
      name: "Mukherjee Nagar",
      pincode: "Delhi – 110009",
      slug: "mukherjee-nagar",
      image: "/images/branches/mukherjee-nagar.jpg"
    }
  ];

  const LOOP_CENTRES = [
    ...OTHER_IDL_CENTRES_ITEMS,
    ...OTHER_IDL_CENTRES_ITEMS,
    ...OTHER_IDL_CENTRES_ITEMS,
    ...OTHER_IDL_CENTRES_ITEMS,
  ];

  const isMangolpuri = branch.id === 'mangolpuri' || branch.slug === 'mangolpuri';
  const heroAddress = isMangolpuri ? "D-945-46, Block-D, Mangolpuri, Delhi-110083" : branch.fullAddress;
  const heroPhone = isMangolpuri ? "+91 8860040067" : (branch.phone || "+91 8860040067");
  const heroTel = isMangolpuri ? "+918860040067" : (branch.phone?.replace(/[^0-9+]/g, '') || "+918860040067");

  const otherBranches = BRANCHES_DATA.filter((b) => b.id !== branch.id);

  const handleQuickFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please enter your name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Free Demo Class Reserved!',
        description: `Thank you ${formName}! Our coordinator will call you at ${formPhone} shortly.`,
      });
      setFormName('');
      setFormPhone('');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-[#142F70]/20 selection:text-[#142F70]">

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium antialiased">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href="/branches" className="hover:text-[#2563EB] transition-colors">Branches</Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{branch.name}</span>
        </nav>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4">

        {/* ── SECTION 01 & 02: HERO SECTION WITH OVERLAPPING 3-COLUMN INFO CARD ── */}
        <div className="relative pt-2 sm:pt-4">
          
          {/* ── DESKTOP HERO (Strictly Preserved for lg: screens) ── */}
          <div className="relative w-full h-[490px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(9,26,58,0.22)] bg-[#091A3A] hidden lg:flex flex-col justify-center">
            
            {/* Background Branch Building Image (Coaching centre positioned right-center) */}
            <div className="absolute inset-0">
              <Image
                src="/mangolpuri/mangolpuri.png"
                alt="IDL Education Mangolpuri Campus Building"
                fill
                priority
                sizes="1240px"
                className="object-cover object-[right_center] select-none brightness-[1.0] contrast-[1.02] saturate-[1.02]"
              />
            </div>

            {/* Left-to-Right Smooth Navy Gradient: Eased transition from high-contrast dark text area to photograph */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #091A3A 0%, #091A3A 26%, rgba(9, 26, 58, 0.96) 38%, rgba(9, 26, 58, 0.78) 46%, rgba(9, 26, 58, 0.38) 55%, rgba(9, 26, 58, 0.08) 64%, transparent 72%)'
              }}
            />
            {/* Subtle bottom fade to blend smoothly with overlapping bottom information card */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#091A3A]/70 via-[#091A3A]/30 to-transparent pointer-events-none" />

            {/* Left-Side Dark Navy Content Panel */}
            <div className="relative z-10 p-11 max-w-[620px] flex flex-col justify-center h-full pb-20 antialiased">
              
              {/* Institutional Campus Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.08] backdrop-blur-sm mb-3.5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-slate-200">
                  Offline Campus
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-[45px] font-extrabold tracking-[-0.03em] text-white leading-[1.12] drop-shadow-xs">
                Mangolpuri Branch
              </h1>

              {/* Description */}
              <p className="text-[15px] text-slate-300 font-normal tracking-[0.01em] mt-2.5 leading-relaxed max-w-lg">
                Focused Academic &amp; Commerce Coaching
              </p>

              {/* Two Academic Category Information Panels */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                
                {/* Card 1: Class 4–10 */}
                <div className="p-4 rounded-xl bg-blue-500/[0.08] hover:bg-blue-500/[0.12] border border-blue-400/10 hover:border-blue-400/20 text-white flex items-start gap-3 transition-colors duration-200 group">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-500/25 transition-colors">
                    <GraduationCap className="w-4.5 h-4.5 text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-blue-300/90 block whitespace-nowrap">Academic Foundation</span>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">Class 4–10</h3>
                    <p className="text-[12px] text-slate-300 mt-0.5 font-normal leading-snug">
                      Covered 4+ Subjects
                    </p>
                  </div>
                </div>

                {/* Card 2: Class 11–12 */}
                <div className="p-4 rounded-xl bg-purple-500/[0.08] hover:bg-purple-500/[0.12] border border-purple-400/10 hover:border-purple-400/20 text-white flex items-start gap-3 transition-colors duration-200 group">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-500/25 transition-colors">
                    <GraduationCap className="w-4.5 h-4.5 text-purple-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-purple-300/90 block whitespace-nowrap">COMMERCE FOUNDATION</span>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">Class 11–12</h3>
                    <p className="text-[12px] text-slate-300 mt-0.5 font-normal leading-snug">
                      Covered 4+ Subjects
                    </p>
                  </div>
                </div>

              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3.5 mt-7">
                <Button
                  asChild
                  className="h-12 px-7 rounded-[5px] font-semibold text-sm tracking-wide bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-[0_4px_16px_rgba(40,100,232,0.3)] hover:shadow-[0_6px_20px_rgba(40,100,232,0.4)] transition-all duration-200 cursor-pointer flex items-center gap-2.5 group"
                >
                  <a
                    href={branch.mapLink || "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get Direction</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-6 rounded-[5px] font-semibold text-sm tracking-wide border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white backdrop-blur-sm transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
                >
                  <a href={`tel:${heroTel}`}>
                    <Phone className="w-4 h-4 text-[#D9A441]" />
                    <span>Call Branch</span>
                  </a>
                </Button>
              </div>

            </div>

          </div>

          {/* ── MOBILE & TABLET HERO (Tailored for screens < lg) ── */}
          <div className="block lg:hidden rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_-12px_rgba(9,26,58,0.25)] bg-[#091A3A]">
            
            {/* 1. Dedicated Building Image Area (Crisp, High Quality, Fully Visible) */}
            <div className="relative w-full h-[200px] min-[390px]:h-[220px] sm:h-[260px] overflow-hidden bg-slate-900">
              <Image
                src="/mangolpuri/mangolpuri.png"
                alt="IDL Education Mangolpuri Campus Building"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1240px"
                className="object-cover object-[82%_center] brightness-[1.02] contrast-[1.03] select-none"
              />
              
              {/* Smooth Navy-to-Image bottom transition gradient */}
              <div 
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, #091A3A 0%, rgba(9, 26, 58, 0.85) 30%, rgba(9, 26, 58, 0.40) 65%, transparent 100%)'
                }}
              />
            </div>

            {/* 2. Content Area Below Image (Dark Navy, Smooth & Unobstructed) */}
            <div className="p-4 sm:p-6 pb-12 sm:pb-14 flex flex-col antialiased">
              
              {/* Institutional Campus Badge (Positioned directly above Mangolpuri Branch text, matching desktop) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.08] backdrop-blur-sm mb-3 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" />
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-200">
                  Offline Campus
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-[25px] min-[390px]:text-[27px] sm:text-3xl font-extrabold tracking-[-0.03em] text-white leading-[1.14]">
                Mangolpuri Branch
              </h1>

              {/* Description */}
              <p className="text-xs min-[390px]:text-[13px] sm:text-sm text-slate-300 font-normal tracking-[0.01em] mt-1.5 leading-snug">
                Focused Academic &amp; Commerce Coaching
              </p>

              {/* Two Academic Category Tiles: Side-by-Side 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2 min-[390px]:gap-2.5 mt-4">
                
                {/* Tile 1: Class 4–10 */}
                <div className="px-2.5 py-2.5 min-[390px]:px-3 min-[390px]:py-3 rounded-xl bg-blue-500/[0.08] hover:bg-blue-500/[0.12] border border-blue-400/15 text-white flex items-start gap-1.5 min-[390px]:gap-2 transition-colors">
                  <div className="w-5 h-5 min-[390px]:w-5.5 min-[390px]:h-5.5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-3 h-3 min-[390px]:w-3.5 min-[390px]:h-3.5 text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[7px] min-[390px]:text-[7.5px] font-bold uppercase tracking-wider text-blue-300/90 whitespace-nowrap block">
                      Academic Foundation
                    </span>
                    <h3 className="text-[12.5px] min-[390px]:text-[13.5px] font-bold text-white tracking-tight leading-snug mt-0.5">
                      Class 4–10
                    </h3>
                    <p className="text-[9.5px] min-[390px]:text-[10px] text-slate-300 mt-0.5 leading-tight font-normal whitespace-nowrap">
                      Covered 4+ Subjects
                    </p>
                  </div>
                </div>

                {/* Tile 2: Class 11–12 */}
                <div className="px-2.5 py-2.5 min-[390px]:px-3 min-[390px]:py-3 rounded-xl bg-purple-500/[0.08] hover:bg-purple-500/[0.12] border border-purple-400/15 text-white flex items-start gap-1.5 min-[390px]:gap-2 transition-colors">
                  <div className="w-5 h-5 min-[390px]:w-5.5 min-[390px]:h-5.5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-3 h-3 min-[390px]:w-3.5 min-[390px]:h-3.5 text-purple-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[7px] min-[390px]:text-[7.5px] font-bold uppercase tracking-wider text-purple-300/90 whitespace-nowrap block">
                      Commerce Foundation
                    </span>
                    <h3 className="text-[12.5px] min-[390px]:text-[13.5px] font-bold text-white tracking-tight leading-snug mt-0.5">
                      Class 11–12
                    </h3>
                    <p className="text-[9.5px] min-[390px]:text-[10px] text-slate-300 mt-0.5 leading-tight font-normal whitespace-nowrap">
                      Covered 4+ Subjects
                    </p>
                  </div>
                </div>

              </div>

              {/* CTA Action Buttons: Side-by-Side 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4">
                <Button
                  asChild
                  className="h-10 min-[390px]:h-11 px-3 sm:px-4 rounded-[5px] font-semibold text-xs sm:text-sm tracking-wide bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-[0_4px_14px_rgba(40,100,232,0.25)] hover:shadow-[0_6px_18px_rgba(40,100,232,0.35)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <a
                    href={branch.mapLink || "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get Direction</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-10 min-[390px]:h-11 px-3 sm:px-4 rounded-[5px] font-semibold text-xs sm:text-sm tracking-wide border border-white/20 bg-white/[0.08] hover:bg-white/[0.14] text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                >
                  <a href={`tel:${heroTel}`}>
                    <Phone className="w-3.5 h-3.5 text-[#D9A441] shrink-0" />
                    <span>Call Branch</span>
                  </a>
                </Button>
              </div>

            </div>

          </div>

          {/* Bottom Floating Information Bar (One Continuous Unified Panel, Exactly 3 Columns with Hairline Dividers) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 -mt-8 sm:-mt-10 lg:-mt-14 w-[92%] sm:w-[92%] lg:w-[94%] max-w-5xl mx-auto rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-[0_12px_36px_-6px_rgba(9,26,58,0.07),0_2px_6px_rgba(9,26,58,0.02)] p-4 sm:p-5 lg:px-8 lg:py-6 antialiased"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 items-center">
              
              {/* Group 1 – Branch Location */}
              <div className="pb-3.5 md:pb-0 md:pr-6 lg:pr-8 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-blue-50/90 border border-blue-100/80 text-[#2864E8] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#2864E8]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-[0.14em] uppercase block leading-none">Branch Location</p>
                  <p className="text-[12.5px] sm:text-[13px] lg:text-[13.5px] text-[#091A3A] font-semibold mt-1 leading-snug">
                    D-945–46, Block-D, Mangolpuri,<br />Delhi-110083
                  </p>
                </div>
              </div>

              {/* Group 2 – Working Hours */}
              <div className="py-3.5 md:py-0 md:px-6 lg:px-8 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-amber-50/90 border border-amber-100/80 text-[#D9A441] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#D9A441]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-[0.14em] uppercase block leading-none">Working Hours</p>
                  <p className="text-[12.5px] sm:text-[13px] text-[#091A3A] font-semibold mt-1 leading-snug">
                    Mon – Sat: 8:00 AM – 8:30 PM
                  </p>
                  <p className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-slate-500 font-medium mt-0.5 leading-snug">
                    Sun: Open on Prior Notice
                  </p>
                </div>
              </div>

              {/* Group 3 – Branch Contact */}
              <div className="pt-3.5 md:pt-0 md:pl-6 lg:pl-8 flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-emerald-50/90 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-[0.14em] uppercase block leading-none">Branch Contact</p>
                  <a href={`tel:${heroTel}`} className="text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-semibold text-[#091A3A] hover:text-[#2864E8] mt-1 block leading-snug tracking-tight transition-colors">
                    {heroPhone}
                  </a>
                  <p className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-slate-500 font-medium mt-0.5 leading-snug">
                    Direct Branch Enquiry
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* ── SECTION 03: MEET OUR DIRECTOR (100% Full-Width Background, Merges with White at Top & Bottom) ── */}
      <section className="relative w-full overflow-hidden pt-9 sm:pt-11 lg:pt-12 pb-14 sm:pb-16 lg:pb-14">
        
        {/* Edge-to-Edge 100% Left to Right Blue Gradient Background Layer (Smoothly Merges with White at Top & Bottom) */}
        <div 
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FF 12%, #EEF5FF 45%, #F0F6FF 68%, #F7FAFF 88%, #FFFFFF 100%)',
          }}
        />

        {/* Ambient Radial Soft Glow */}
        <div 
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(216, 233, 254, 0.45) 0%, rgba(238, 245, 255, 0.2) 55%, transparent 100%)',
          }}
        />

        {/* Subtle Concentric Orbital / Architectural Watermark (Reduced visibility by 50% for delicate elegance) */}
        <svg 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-[540px] h-[540px] text-[#2864E8]/[0.016] pointer-events-none select-none" 
          viewBox="0 0 400 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4" />
        </svg>

        {/* Inner Content Container: EXACT SAME 1240px Length As Hero Section */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading & Subtitle matching Academic Programs Design System */}
          {/* Centered Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-tight">
              <span className="text-[#173568]">Meet </span>
              <span className="text-[#2864E8]">Branch Director</span>
            </h2>
          </div>

          {/* ── DESKTOP DIRECTOR LAYOUT (Strictly Preserved for lg: screens) ── */}
          <div className="hidden lg:grid grid-cols-12 gap-12 xl:gap-16 items-center">
            
            {/* Left Column: Frameless Editorial Cutout + Soft Ambient Lighting + Integrated Identity */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              
              {/* Luminous Ambient Lighting & Soft Blue Glow */}
              <div 
                className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full pointer-events-none select-none blur-3xl opacity-60"
                style={{
                  background: 'radial-gradient(circle at 50% 45%, rgba(40, 100, 232, 0.16) 0%, rgba(216, 233, 254, 0.5) 45%, rgba(238, 245, 255, 0.75) 70%, transparent 100%)',
                }}
              />

              {/* Additional soft ambient light halo behind subject */}
              <div 
                className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-200/25 blur-2xl pointer-events-none" 
              />

              {/* Portrait Cutout (100% full scale, refined natural feather bottom blend) */}
              <div className="relative w-full max-w-[380px] flex flex-col items-center">
                
                {/* Large Frameless Portrait Cutout */}
                <div className="relative w-full h-[430px] flex items-end justify-center z-10">
                  <div 
                    className="relative w-full h-full flex items-end justify-center"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.05) 1.5%, rgba(0, 0, 0, 0.25) 3.5%, rgba(0, 0, 0, 0.6) 6%, rgba(0, 0, 0, 0.9) 9%, black 14%)',
                      maskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.05) 1.5%, rgba(0, 0, 0, 0.25) 3.5%, rgba(0, 0, 0, 0.6) 6%, rgba(0, 0, 0, 0.9) 9%, black 14%)',
                    }}
                  >
                    <Image
                      src="/mangolpuri/vijay.png"
                      alt="Vijay Verma - Academic Head & Branch Director"
                      fill
                      sizes="420px"
                      className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_14px_28px_rgba(23,53,104,0.12)]"
                      priority
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Seamless Open Editorial Message & Profile (No Box, Directly on Shared Canvas) */}
            <div className="lg:col-span-7 flex flex-col justify-center relative py-4 lg:pl-2">
              
              {/* Subtle Ambient Quotation Watermark Accent */}
              <svg 
                className="absolute -top-5 right-6 w-20 h-20 text-[#2864E8]/[0.05] pointer-events-none select-none" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Tabs Integrated Naturally into the Open Layout */}
              <div className="flex items-center gap-7 border-b border-[#173568]/15 pb-3 mb-6 relative z-10 max-w-xl">
                <button
                  type="button"
                  onClick={() => setActiveMessageTab('director')}
                  className={cn(
                    "pb-1 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer relative -mb-[13px]",
                    activeMessageTab === 'director'
                      ? "text-[#173568]"
                      : "text-[#64748B] hover:text-[#173568]"
                  )}
                >
                  <span>Director Message</span>
                  {activeMessageTab === 'director' && (
                    <motion.span
                      layoutId="activeLeadershipUnderlineDesktop"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute -bottom-[1px] inset-x-0 h-[2.5px] bg-[#2864E8] rounded-full"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMessageTab('profile')}
                  className={cn(
                    "pb-1 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer relative -mb-[13px]",
                    activeMessageTab === 'profile'
                      ? "text-[#173568]"
                      : "text-[#64748B] hover:text-[#173568]"
                  )}
                >
                  <span>Director Profile</span>
                  {activeMessageTab === 'profile' && (
                    <motion.span
                      layoutId="activeLeadershipUnderlineDesktop"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute -bottom-[1px] inset-x-0 h-[2.5px] bg-[#2864E8] rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Open Message Content Area - Fixed Grid Stack */}
              <div className="relative z-10 w-full max-w-2xl">
                
                {/* Paragraph Content Grid Stack (Height locked to taller content) */}
                <div className="grid grid-cols-1">
                  {/* View 1: Director Message */}
                  <div
                    className={cn(
                      "col-start-1 row-start-1 w-full space-y-5 transition-opacity duration-150",
                      activeMessageTab === 'director'
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none invisible"
                    )}
                  >
                    <p className="text-[18px] font-semibold text-[#173568] leading-[1.75] tracking-[-0.01em]">
                      &ldquo;At IDL Education Mangolpuri, our mission is to build deep conceptual clarity, disciplined study habits, and independent analytical thinking in every student. We firmly believe that when provided with the right mentorship, structured guidance, and continuous encouragement, every child has the potential to excel.&rdquo;
                    </p>

                    <p className="text-[15.5px] font-normal text-[#475569] leading-[1.8]">
                      &ldquo;Through our rigorous weekly test evaluations, personalized one-on-one doubt clearing sessions, and consistent parent-teacher engagement, we ensure steady academic progress, confidence building, and top rank performance across school tests, CBSE Board exams, and competitive entrances.&rdquo;
                    </p>
                  </div>

                  {/* View 2: Director Profile */}
                  <div
                    className={cn(
                      "col-start-1 row-start-1 w-full space-y-5 transition-opacity duration-150",
                      activeMessageTab === 'profile'
                        ? "opacity-100 z-10 pointer-events-auto"
                        : "opacity-0 z-0 pointer-events-none invisible"
                    )}
                  >
                    <p className="text-[18px] font-semibold text-[#173568] leading-[1.75] tracking-[-0.01em]">
                      &ldquo;Senior Economics Faculty with 10+ years of distinguished teaching and mentorship experience. M.Com and UGC NET Qualified, specializing in Micro and Macro Economics, Indian Economic Development, and Applied Problem Solving for Class 11–12 CBSE Boards and CUET UG.&rdquo;
                    </p>

                    <p className="text-[15.5px] font-normal text-[#475569] leading-[1.8]">
                      &ldquo;His signature pedagogy simplifies complex economic graphs and models into intuitive concepts. Through chapter-wise test series and step-by-step answer-writing, he consistently guides students to achieve 95%+ marks and top percentiles.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Director Signature & Designation */}
                <div className="pt-4 flex flex-col items-end text-right">
                  <h4 className="text-xl sm:text-[22px] font-extrabold text-slate-900 tracking-tight">
                    Vijay Verma
                  </h4>
                  <p className="text-[11px] font-bold text-[#2864E8] tracking-[0.06em] uppercase mt-0.5">
                    Academic Head &amp; Branch Director
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ── MOBILE DIRECTOR LAYOUT (Tailored for screens < lg) ── */}
          <div className="block lg:hidden max-w-xl mx-auto flex flex-col items-center text-center">
            
            {/* 1. Director Portrait (Wider & prominent 85-90% width, natural proportions, feathered bottom blend) */}
            <div className="relative w-[88%] max-w-[325px] min-[390px]:max-w-[340px] sm:max-w-[370px] mx-auto flex flex-col items-center justify-center">

              {/* Frameless Portrait Cutout Container */}
              <div className="relative w-full h-[290px] min-[390px]:h-[315px] sm:h-[345px] flex items-end justify-center z-10">
                <div 
                  className="relative w-full h-full flex items-end justify-center"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.08) 2%, rgba(0, 0, 0, 0.35) 5%, rgba(0, 0, 0, 0.75) 9%, black 16%)',
                    maskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.08) 2%, rgba(0, 0, 0, 0.35) 5%, rgba(0, 0, 0, 0.75) 9%, black 16%)',
                  }}
                >
                  <Image
                    src="/mangolpuri/vijay.png"
                    alt="Vijay Verma - Academic Head & Branch Director"
                    fill
                    sizes="(max-width: 640px) 340px, 370px"
                    className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(23,53,104,0.12)]"
                    priority
                  />
                </div>
              </div>

            </div>

            {/* 2. Director Identity (Directly Below Portrait, No Box, Natural Hierarchy) */}
            <div className="mt-2.5 sm:mt-3 flex flex-col items-center">
              <h3 className="text-[19px] min-[390px]:text-[20px] sm:text-[22px] font-extrabold text-[#173568] tracking-tight">
                Vijay Verma
              </h3>
              <p className="text-[10.5px] min-[390px]:text-[11px] sm:text-xs font-bold text-[#2864E8] tracking-[0.08em] uppercase mt-0.5">
                Academic Head &amp; Branch Director
              </p>
            </div>

            {/* 3. Director Message / Director Profile Tabs */}
            <div className="w-full flex items-center justify-center gap-6 border-b border-[#173568]/15 pb-2.5 mt-4 sm:mt-5 mb-4 relative z-10">
              <button
                type="button"
                onClick={() => setActiveMessageTab('director')}
                className={cn(
                  "pb-1 text-xs min-[390px]:text-[12.5px] sm:text-[13px] font-bold uppercase tracking-[0.10em] transition-colors cursor-pointer relative -mb-[11px]",
                  activeMessageTab === 'director'
                    ? "text-[#173568]"
                    : "text-[#64748B] hover:text-[#173568]"
                )}
              >
                <span>Director Message</span>
                {activeMessageTab === 'director' && (
                  <motion.span
                    layoutId="activeLeadershipUnderlineMobile"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute -bottom-[1px] inset-x-0 h-[2.5px] bg-[#2864E8] rounded-full"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveMessageTab('profile')}
                className={cn(
                  "pb-1 text-xs min-[390px]:text-[12.5px] sm:text-[13px] font-bold uppercase tracking-[0.10em] transition-colors cursor-pointer relative -mb-[11px]",
                  activeMessageTab === 'profile'
                    ? "text-[#173568]"
                    : "text-[#64748B] hover:text-[#173568]"
                )}
              >
                <span>Director Profile</span>
                {activeMessageTab === 'profile' && (
                  <motion.span
                    layoutId="activeLeadershipUnderlineMobile"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute -bottom-[1px] inset-x-0 h-[2.5px] bg-[#2864E8] rounded-full"
                  />
                )}
              </button>
            </div>

            {/* 4. Message or Profile Content Area */}
            <div className="w-full relative z-10 px-1 sm:px-3 text-left pb-4">
              <div className="grid grid-cols-1">
                
                {/* View 1: Director Message */}
                <div
                  className={cn(
                    "col-start-1 row-start-1 w-full space-y-3 transition-opacity duration-150",
                    activeMessageTab === 'director'
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none invisible"
                  )}
                >
                  <p className="text-[13.5px] min-[390px]:text-[14px] sm:text-[15px] font-semibold text-[#173568] leading-relaxed tracking-[-0.01em]">
                    &ldquo;At IDL Education Mangolpuri, our mission is to build deep conceptual clarity, disciplined study habits, and independent analytical thinking in every student. We firmly believe that when provided with the right mentorship, structured guidance, and continuous encouragement, every child has the potential to excel.&rdquo;
                  </p>

                  <p className="text-[12.5px] min-[390px]:text-[13px] sm:text-[13.5px] font-normal text-[#475569] leading-relaxed">
                    &ldquo;Through our rigorous weekly test evaluations, personalized one-on-one doubt clearing sessions, and consistent parent-teacher engagement, we ensure steady academic progress, confidence building, and top rank performance across school tests, CBSE Board exams, and competitive entrances.&rdquo;
                  </p>
                </div>

                {/* View 2: Director Profile */}
                <div
                  className={cn(
                    "col-start-1 row-start-1 w-full space-y-3 transition-opacity duration-150",
                    activeMessageTab === 'profile'
                      ? "opacity-100 z-10 pointer-events-auto"
                      : "opacity-0 z-0 pointer-events-none invisible"
                  )}
                >
                  <p className="text-[13.5px] min-[390px]:text-[14px] sm:text-[15px] font-semibold text-[#173568] leading-relaxed tracking-[-0.01em]">
                    &ldquo;Senior Economics Faculty with 10+ years of distinguished teaching and mentorship experience. M.Com and UGC NET Qualified, specializing in Micro and Macro Economics, Indian Economic Development, and Applied Problem Solving for Class 11–12 CBSE Boards and CUET UG.&rdquo;
                  </p>

                  <p className="text-[12.5px] min-[390px]:text-[13px] sm:text-[13.5px] font-normal text-[#475569] leading-relaxed">
                    &ldquo;His signature pedagogy simplifies complex economic graphs and models into intuitive concepts. Through chapter-wise test series and step-by-step answer-writing, he consistently guides students to achieve 95%+ marks and top percentiles.&rdquo;
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── SECTIONS 04+: ACADEMIC PROGRAMS & REMAINING CONTENT ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-12 pb-24 sm:pb-28 lg:pb-16">

        {/* ── SECTION 04: ACADEMIC PROGRAMS (COURSES & CLASSES OFFERED) ── */}
        <section className="relative w-full overflow-hidden space-y-6 sm:space-y-8">
          
          {/* Centered Section Heading matching Timetable Visual Hierarchy */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-tight">
              <span className="text-[#173568]">Explore </span>
              <span className="text-[#2864E8]">Academic Programs</span>
            </h2>
          </div>

          {/* Three Vertical Program Cards (Classes 4-8, 9 & 10, 11 & 12) with Student Cutouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Class 4 – 8 (Junior Foundation) */}
            <div
              onClick={() => {
                setEnrollProgramTitle('Class 4–8 Junior Foundation');
                setEnrollAllowedClasses(JUNIOR_CLASSES);
                setEnrollAllowedCourses(JUNIOR_COURSES);
                setEnrollDefaultClass('Class 4th');
                setEnrollDefaultCourse(JUNIOR_COURSES[0]);
                setIsEnrollOpen(true);
              }}
              className="group relative rounded-2xl bg-white border border-[#DCE8F8] hover:border-[#2864E8]/60 p-0 shadow-[0_4px_20px_-4px_rgba(23,63,70,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(23,63,70,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout on Soft Ice Blue Studio */}
              <div className="relative h-[185px] sm:h-[195px] lg:h-[235px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#E8F1FC] via-[#F1F6FD] to-[#E2EDFA]">
                {/* Soft ambient radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2864E8] border border-[#D5E5FD] text-[11px] sm:text-xs font-bold shadow-2xs">
                  Class 4 – 8
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[160px] sm:h-[170px] lg:h-[200px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/mangolpuri/girl.png"
                    alt="Class 4 - 8 Junior Foundation Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft natural bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 justify-between gap-4 sm:gap-5">
                <div>
                  {/* Program Title - Deep Navy with Royal Blue Hover */}
                  <h3 className="text-[16px] sm:text-[17px] lg:text-[19px] font-extrabold text-[#173568] tracking-tight uppercase group-hover:text-[#2864E8] transition-colors leading-snug">
                    JUNIOR FOUNDATION PROGRAM
                  </h3>

                  {/* Description - Slate Grey */}
                  <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-[#64748B] mt-2 leading-relaxed font-normal">
                    Build strong fundamentals, mental maths, and disciplined study habits.
                  </p>
                </div>

                {/* Action Footer - Deep Navy Button */}
                <div className="pt-3.5 sm:pt-4 border-t border-slate-100/90 flex items-center justify-start mt-auto">
                  <div className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-bold text-xs sm:text-sm bg-[#173568] hover:bg-[#102548] text-white shadow-[0_2px_8px_rgba(23,53,104,0.18)] hover:shadow-[0_4px_14px_rgba(23,53,104,0.28)] transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group/btn">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Class 9 & 10 (Secondary Board Foundation) */}
            <div
              onClick={() => {
                setEnrollProgramTitle('Class 9 & 10 Secondary Board');
                setEnrollAllowedClasses(SECONDARY_CLASSES);
                setEnrollAllowedCourses(SECONDARY_COURSES);
                setEnrollDefaultClass('Class 9th');
                setEnrollDefaultCourse(SECONDARY_COURSES[0]);
                setIsEnrollOpen(true);
              }}
              className="group relative rounded-2xl bg-white border border-[#DCE8F8] hover:border-[#2864E8]/60 p-0 shadow-[0_4px_20px_-4px_rgba(23,63,70,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(23,63,70,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout on Soft Ice Blue Studio */}
              <div className="relative h-[185px] sm:h-[195px] lg:h-[235px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#E8F1FC] via-[#F1F6FD] to-[#E2EDFA]">
                {/* Soft ambient radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2864E8] border border-[#D5E5FD] text-[11px] sm:text-xs font-bold shadow-2xs">
                  Class 9 &amp; 10
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[160px] sm:h-[170px] lg:h-[200px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/mangolpuri/boy.png"
                    alt="Class 9 and 10 CBSE Board Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft natural bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 justify-between gap-4 sm:gap-5">
                <div>
                  {/* Program Title - Deep Navy with Royal Blue Hover */}
                  <h3 className="text-[16px] sm:text-[17px] lg:text-[19px] font-extrabold text-[#173568] tracking-tight uppercase group-hover:text-[#2864E8] transition-colors leading-snug">
                    SECONDARY BOARD PROGRAM
                  </h3>

                  {/* Description - Slate Grey */}
                  <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-[#64748B] mt-2 leading-relaxed font-normal">
                    Complete NCERT mastery, weekly test series, and top scoring strategies.
                  </p>
                </div>

                {/* Action Footer - Deep Navy Button */}
                <div className="pt-3.5 sm:pt-4 border-t border-slate-100/90 flex items-center justify-start mt-auto">
                  <div className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-bold text-xs sm:text-sm bg-[#173568] hover:bg-[#102548] text-white shadow-[0_2px_8px_rgba(23,53,104,0.18)] hover:shadow-[0_4px_14px_rgba(23,53,104,0.28)] transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group/btn">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Class 11 & 12 (Senior Commerce & CUET) */}
            <div
              onClick={() => {
                setEnrollProgramTitle('Class 11 & 12 Commerce Foundation');
                setEnrollAllowedClasses(SENIOR_CLASSES);
                setEnrollAllowedCourses(SENIOR_COURSES);
                setEnrollDefaultClass('Class 11th');
                setEnrollDefaultCourse(SENIOR_COURSES[0]);
                setIsEnrollOpen(true);
              }}
              className="group relative rounded-2xl bg-white border border-[#DCE8F8] hover:border-[#2864E8]/60 p-0 shadow-[0_4px_20px_-4px_rgba(23,63,70,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(23,63,70,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout on Soft Ice Blue Studio */}
              <div className="relative h-[185px] sm:h-[195px] lg:h-[235px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#E8F1FC] via-[#F1F6FD] to-[#E2EDFA]">
                {/* Soft ambient radial glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#2864E8] border border-[#D5E5FD] text-[11px] sm:text-xs font-bold shadow-2xs">
                  Class 11 &amp; 12
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[160px] sm:h-[170px] lg:h-[200px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/mangolpuri/girl.png"
                    alt="Class 11 and 12 Commerce & CUET Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft natural bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1 justify-between gap-4 sm:gap-5">
                <div>
                  {/* Program Title - Deep Navy with Royal Blue Hover */}
                  <h3 className="text-[16px] sm:text-[17px] lg:text-[19px] font-extrabold text-[#173568] tracking-tight uppercase group-hover:text-[#2864E8] transition-colors leading-snug">
                    COMMERCE FOUNDATION
                  </h3>

                  {/* Description - Slate Grey */}
                  <p className="text-xs sm:text-[13px] lg:text-[13.5px] text-[#64748B] mt-2 leading-relaxed font-normal">
                    Mentorship in Accounts and Economics for 95%+ Board and CUET scores.
                  </p>
                </div>

                {/* Action Footer - Deep Navy Button */}
                <div className="pt-3.5 sm:pt-4 border-t border-slate-100/90 flex items-center justify-start mt-auto">
                  <div className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg font-bold text-xs sm:text-sm bg-[#173568] hover:bg-[#102548] text-white shadow-[0_2px_8px_rgba(23,53,104,0.18)] hover:shadow-[0_4px_14px_rgba(23,53,104,0.28)] transition-all duration-200 cursor-pointer inline-flex items-center gap-2 group/btn">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── SECTION 05: WEEKLY CLASS TIMETABLE ────────────────────────── */}
        <section id="weekly-timetable" className="relative w-full overflow-hidden space-y-6 sm:space-y-8 bg-white">

          {/* 1. Centered Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-6">
            <h2 className="text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-tight">
              <span className="text-[#173568]">Weekly </span>
              <span className="text-[#2864E8]">Class Timetable</span>
            </h2>
          </div>

          {/* 2. Top Navigation Tabs (Text-only matching Director Message & Profile style) */}
          <div className="flex items-center justify-center gap-7 sm:gap-9 border-b border-slate-200/70 pb-3 mb-7 sm:mb-8 max-w-md mx-auto">
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
                    "pb-2 text-xs sm:text-[13px] font-bold uppercase tracking-[0.08em] transition-colors duration-200 cursor-pointer relative -mb-[13px] outline-none select-none",
                    isActive
                      ? "text-[#173568]"
                      : "text-[#64748B] hover:text-[#173568]"
                  )}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeTimetableUnderline"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute -bottom-[1px] inset-x-0 h-[2.5px] bg-[#2864E8] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
            
            {/* Left Column (lg:col-span-8) – Dynamic Selected Class Timetable */}
            <div className="lg:col-span-8 flex flex-col">
              <AnimatePresence mode="wait">
                {/* 1. CLASS 9 TIMETABLE */}
                {timetableTab === '9' && (
                  <motion.div
                    key="class-9-timetable"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-[#DCE8F8] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(40,100,232,0.08)] flex flex-col justify-between h-full"
                  >
                    {/* Header Banner - Soft Blue Gradient Banner */}
                    <div className="bg-gradient-to-r from-[#173568] via-[#1E4DB7] to-[#2864E8] px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 text-white border-b border-[#173568]/30">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                        <h3 className="text-sm sm:text-[15px] lg:text-base font-extrabold tracking-tight text-white">
                          Class 9 (Time-Table)
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                        <span>2 Hours / Day • Mon to Sat</span>
                      </div>
                    </div>

                    {/* Merged 100% Full Content with Hairline Separation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 flex-1">
                      {/* MWF Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : MWF
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Mathematics</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Social Studies</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>

                      {/* TTS Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : TTS
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Science</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">English</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. CLASS 10 TIMETABLE */}
                {timetableTab === '10' && (
                  <motion.div
                    key="class-10-timetable"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-[#DCE8F8] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(40,100,232,0.08)] flex flex-col justify-between h-full"
                  >
                    {/* Header Banner - Soft Blue Gradient Banner */}
                    <div className="bg-gradient-to-r from-[#173568] via-[#1E4DB7] to-[#2864E8] px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 text-white border-b border-[#173568]/30">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                        <h3 className="text-sm sm:text-[15px] lg:text-base font-extrabold tracking-tight text-white">
                          Class 10 (Time-Table)
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                        <span>2 Hours / Day • Board Prep</span>
                      </div>
                    </div>

                    {/* Merged 100% Full Content with Hairline Separation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 flex-1">
                      {/* MWF Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : MWF
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Mathematics</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Social Studies</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>

                      {/* TTS Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : TTS
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Science</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">English</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. CLASS 11 TIMETABLE */}
                {timetableTab === '11' && (
                  <motion.div
                    key="class-11-timetable"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-[#DCE8F8] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(40,100,232,0.08)] flex flex-col justify-between h-full"
                  >
                    {/* Header Banner - Soft Blue Gradient Banner */}
                    <div className="bg-gradient-to-r from-[#173568] via-[#1E4DB7] to-[#2864E8] px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 text-white border-b border-[#173568]/30">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                        <h3 className="text-sm sm:text-[15px] lg:text-base font-extrabold tracking-tight text-white">
                          Class 11 (Time-Table)
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                        <span>1 Hour / Subject • Commerce Focus</span>
                      </div>
                    </div>

                    {/* Merged 100% Full Content with Hairline Separation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 flex-1">
                      {/* MWF Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : MWF
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Economics</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Accounts</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>

                      {/* TTS Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : TTS
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Guided Practice &amp; Doubts</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Pol Science / History</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. CLASS 12 TIMETABLE */}
                {timetableTab === '12' && (
                  <motion.div
                    key="class-12-timetable"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-[#DCE8F8] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(40,100,232,0.08)] flex flex-col justify-between h-full"
                  >
                    {/* Header Banner - Soft Blue Gradient Banner */}
                    <div className="bg-gradient-to-r from-[#173568] via-[#1E4DB7] to-[#2864E8] px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-2.5 text-white border-b border-[#173568]/30">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                        <h3 className="text-sm sm:text-[15px] lg:text-base font-extrabold tracking-tight text-white">
                          Class 12 (Time-Table)
                        </h3>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-white/15 text-blue-100 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                        <span>1 Hour / Subject • Commerce Focus</span>
                      </div>
                    </div>

                    {/* Merged 100% Full Content with Hairline Separation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 flex-1">
                      {/* TTS Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : TTS
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Economics</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Accounts</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>

                      {/* MWF Column */}
                      <div className="p-5 sm:p-6 flex flex-col justify-between">
                        <div className="flex items-center pb-3 border-b border-slate-200/80">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#2864E8] text-white shadow-xs">
                            <Calendar className="w-3.5 h-3.5 text-blue-200" />
                            Day : MWF
                          </span>
                        </div>
                        <div className="divide-y divide-slate-200/70 pt-1">
                          <div className="flex items-center justify-between py-2.5 first:pt-2 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Board Answer Writing</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">4:00 – 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2.5 first:pt-2.5 last:pb-0">
                            <span className="text-xs sm:text-[13px] font-bold text-[#173568]">Pol Science / History</span>
                            <span className="text-xs sm:text-[13px] font-bold text-[#2864E8] tabular-nums">5:00 – 6:00 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column (lg:col-span-4) – Sunday Special Card */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="rounded-2xl border border-[#DCE8F8] bg-white overflow-hidden shadow-[0_4px_20px_-4px_rgba(40,100,232,0.08)] flex flex-col justify-between w-full h-full transition-all duration-200">
                {/* Header Banner - Soft Blue Gradient Banner */}
                <div className="bg-gradient-to-r from-[#173568] via-[#1E4DB7] to-[#2864E8] px-5 py-3.5 sm:px-6 flex items-center gap-2.5 text-white border-b border-[#173568]/30">
                  <Calendar className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="font-extrabold text-sm sm:text-[15px] lg:text-base tracking-tight">
                    Sunday Special
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div className="divide-y divide-slate-200/70">
                    <div className="flex items-center py-2.5 first:pt-1 last:pb-1">
                      <span className="text-xs sm:text-[13px] font-bold text-[#173568] tracking-tight">
                        Weekly Subject Tests &amp; Assessment
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 first:pt-1 last:pb-1">
                      <span className="text-xs sm:text-[13px] font-bold text-[#173568] tracking-tight">
                        Dedicated 1-on-1 Doubt Clearing
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 first:pt-1 last:pb-1">
                      <span className="text-xs sm:text-[13px] font-bold text-[#173568] tracking-tight">
                        Special Concept &amp; Strategy Workshops
                      </span>
                    </div>
                    <div className="flex items-center py-2.5 first:pt-1 last:pb-1">
                      <span className="text-xs sm:text-[13px] font-bold text-[#173568] tracking-tight">
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
            <h2 className="text-[22px] min-[390px]:text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] font-extrabold tracking-tight whitespace-nowrap">
              <span className="text-[#173568]">Branch </span>
              <span className="text-[#2864E8]">Facilities</span>
            </h2>
          </div>

          {/* Equal Grid: Clean Single-Column on Mobile (16px spacing), 3-Column on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {[
              { src: "/mangolpuri/01.png", alt: "IDL Education Mangolpuri Smart Classroom" },
              { src: "/mangolpuri/05.png", alt: "IDL Education Mangolpuri Interactive Teaching" },
              { src: "/mangolpuri/03.png", alt: "IDL Education Mangolpuri Campus Reception" },
              { src: "/mangolpuri/04.png", alt: "IDL Education Mangolpuri Digital Smartboard" },
              { src: "/mangolpuri/06.png", alt: "IDL Education Mangolpuri Classroom Learning" },
              { src: "/mangolpuri/02.png", alt: "IDL Education Mangolpuri Batch Study Session" },
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




        {/* ── SECTION 07: FAQ & EXPLORE OTHER IDL CENTRES ───────────── */}
        <section className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 items-stretch">
            
            {/* Left Column: Frequently Asked Questions */}
            <div className="lg:pr-8 xl:pr-10 pb-8 sm:pb-9 lg:pb-0 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start gap-3 mb-5 pb-4 border-b border-slate-200/70">
                  <span className="w-1.5 h-6 bg-[#2864E8] rounded-full shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#2864E8] shrink-0" />
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#173568] tracking-tight">
                        Frequently Asked Questions
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
                      Common questions about the Mangolpuri branch
                    </p>
                  </div>
                </div>

                {/* Accordion List - 100% Full Width with Hairline Divider Lines */}
                <div className="divide-y divide-slate-200/80">
                  {[
                    {
                      q: "What is the landmark for IDL Education Mangolpuri?",
                      a: "The centre is located near Sanjay Gandhi Memorial Hospital and the Q-Block Bus Terminal on Main Market Road, Mangol Puri, Delhi – 110083."
                    },
                    {
                      q: "Which is the nearest metro station to Mangolpuri branch?",
                      a: "Peeragarhi Metro Station on the Green Line is the nearest metro station, approximately 6–7 minutes away by e-rickshaw or feeder bus."
                    },
                    {
                      q: "Does Mangolpuri branch provide printed study material?",
                      a: "Yes, all enrolled students receive comprehensive printed study modules, chapter-wise worksheets, formula booklets, and previous 10 years question banks."
                    }
                  ].map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="transition-colors">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full py-4 text-left flex items-center justify-between gap-3 group cursor-pointer select-none"
                        >
                          <span className={cn(
                            "text-xs sm:text-[13.5px] font-bold tracking-tight transition-colors leading-snug",
                            isOpen ? "text-[#2864E8]" : "text-[#173568] group-hover:text-[#2864E8]"
                          )}>
                            {faq.q}
                          </span>
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200",
                            isOpen ? "bg-[#EEF5FF] text-[#2864E8] rotate-180" : "text-slate-400 group-hover:text-[#2864E8] group-hover:bg-slate-50"
                          )}>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4 pt-0.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                                <p>{faq.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Explore Other IDL Centres */}
            <div className="lg:pl-8 xl:pl-10 pt-8 sm:pt-9 lg:pt-0 flex flex-col justify-between min-w-0 overflow-hidden pb-8 sm:pb-9 lg:pb-0">
              <div>
                {/* Header with Title and Manual Left/Right Controls */}
                <div className="flex items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-5 pb-3.5 sm:pb-4 border-b border-slate-200/70">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className="w-1.5 h-5 sm:h-6 bg-[#2864E8] rounded-full shrink-0" />
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2864E8] shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-[15px] min-[380px]:text-base sm:text-lg lg:text-xl font-extrabold text-[#173568] tracking-tight truncate">
                        Explore Other IDL Centres
                      </h3>
                      <p className="hidden sm:block text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 truncate">
                        Visit our other centres across Delhi for quality education.
                      </p>
                    </div>
                  </div>

                  {/* Manual Navigation Arrows */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCentresScrollManual('left')}
                      aria-label="Previous centre"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200/80 bg-white hover:bg-[#EEF5FF] text-slate-600 hover:text-[#2864E8] hover:border-[#2864E8]/40 transition-colors flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCentresScrollManual('right')}
                      aria-label="Next centre"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200/80 bg-white hover:bg-[#EEF5FF] text-slate-600 hover:text-[#2864E8] hover:border-[#2864E8]/40 transition-colors flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Continuous Running Loop Slider + Free Left/Right Manual Drag */}
                <div className="relative w-full overflow-hidden">
                  <div
                    ref={otherCentresSliderRef}
                    onScroll={handleCentresScroll}
                    onMouseEnter={() => setIsCentresSliderPaused(true)}
                    onMouseLeave={handleCentresMouseLeave}
                    onMouseDown={handleCentresMouseDown}
                    onMouseMove={handleCentresMouseMove}
                    onMouseUp={handleCentresMouseUp}
                    onTouchStart={handleCentresTouchStart}
                    onTouchEnd={handleCentresTouchEnd}
                    className="flex gap-3.5 sm:gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5 cursor-grab active:cursor-grabbing select-none"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {LOOP_CENTRES.map((item, idx) => (
                      <Link
                        key={`${item.slug}-${idx}`}
                        href={`/branches/${item.slug}`}
                        onClick={(e) => {
                          if (centresDragMovedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        className="w-[215px] min-[390px]:w-[230px] sm:w-[245px] shrink-0 rounded-xl border border-slate-200/80 overflow-hidden bg-white hover:border-[#2864E8]/60 hover:shadow-md transition-all duration-200 group flex flex-col justify-between shadow-2xs select-none"
                      >
                        {/* Branch Image */}
                        <div className="relative h-32 min-[390px]:h-36 sm:h-32 w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={`${item.name} Branch - IDL Education`}
                            fill
                            sizes="(max-width: 640px) 230px, 245px"
                            className="object-cover brightness-[1.01] contrast-[1.03] select-none pointer-events-none group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[10px] font-bold text-[#173568] border border-slate-200/60 shadow-xs pointer-events-none">
                            Delhi Centre
                          </div>
                        </div>

                        {/* Bottom Card Info */}
                        <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#2864E8] shrink-0" />
                              <h4 className="text-xs sm:text-[13px] font-bold text-[#173568] group-hover:text-[#2864E8] transition-colors leading-snug truncate">
                                {item.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 pl-5 mt-0.5 font-medium truncate">
                              {item.pincode}
                            </p>
                          </div>

                          {/* Subtle Action Row */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100/90 flex items-center justify-between text-[11px] font-semibold text-[#2864E8] group-hover:text-[#173568] transition-colors">
                            <span>View Branch</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Edge gradient masks for seamless premium look */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-white to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-3 sm:w-4 bg-gradient-to-l from-white to-transparent" />
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* ── MODALS INTEGRATION ───────────────────────────────────────── */}
      <EnrollNowModal 
        isOpen={isEnrollOpen} 
        onOpenChange={setIsEnrollOpen} 
        defaultBranch="Mangol Puri, Delhi-110083"
        defaultClass={enrollDefaultClass}
        defaultCourse={enrollDefaultCourse}
        programTitle={enrollProgramTitle}
        allowedClasses={enrollAllowedClasses}
        allowedCourses={enrollAllowedCourses}
        source="Mangolpuri Branch Page"
      />
      <BookDemoModal isOpen={isBookDemoOpen} onOpenChange={setIsBookDemoOpen} />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
      <StudentEnquiryModal isOpen={isEnquiryOpen} onOpenChange={setIsEnquiryOpen} />

    </div>
  );
}
