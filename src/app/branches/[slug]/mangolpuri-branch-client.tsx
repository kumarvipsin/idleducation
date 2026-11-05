'use client';

import React, { useState } from 'react';
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
  CheckCircle2,
  ClipboardCheck,
  Presentation,
  Sun,
  Info
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

  // Gallery View All Modal
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-12 pb-16">

        {/* ── SECTION 01 & 02: HERO SECTION WITH OVERLAPPING 3-COLUMN INFO CARD ── */}
        <div className="relative pt-2 sm:pt-4">
          
          {/* Main Hero Container: Large Branch Building Image with Left-Side Dark Navy Gradient */}
          <div className="relative w-full min-h-[460px] sm:min-h-[440px] lg:h-[460px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.12)] bg-[#081533] flex flex-col justify-center">
            
            {/* Background Branch Building Image (Coaching centre positioned right-center) */}
            <div className="absolute inset-0">
              <Image
                src="/mangolpuri/mangolpuri-center.jpg"
                alt="IDL Education Mangolpuri Campus Building"
                fill
                priority
                sizes="(max-width: 1240px) 100vw, 1240px"
                className="object-cover object-[right_center] select-none"
              />
            </div>

            {/* Left-to-Right 50% Color Spread: Dark on Left, Smoothly Fading Light to 50%-55% for High Text Readability */}
            <div 
              className="absolute inset-0 pointer-events-none hidden lg:block"
              style={{
                background: 'linear-gradient(90deg, #071536 0%, #08193F 36%, rgba(8, 25, 63, 0.96) 44%, rgba(8, 25, 63, 0.65) 50%, rgba(8, 25, 63, 0.18) 54%, transparent 58%)'
              }}
            />
            {/* Tablet View: Extends slightly to cover 60%-65% content width smoothly */}
            <div 
              className="absolute inset-0 pointer-events-none hidden md:block lg:hidden"
              style={{
                background: 'linear-gradient(90deg, #071536 0%, #08193F 45%, rgba(8, 25, 63, 0.95) 55%, rgba(8, 25, 63, 0.6) 63%, rgba(8, 25, 63, 0.15) 68%, transparent 72%)'
              }}
            />
            {/* Mobile View: High-contrast coverage across full width with subtle right transparency */}
            <div 
              className="absolute inset-0 pointer-events-none md:hidden"
              style={{
                background: 'linear-gradient(90deg, #071536 0%, rgba(8, 25, 63, 0.97) 58%, rgba(8, 25, 63, 0.82) 100%)'
              }}
            />
            {/* Subtle bottom fade to blend with overlapping bottom information card */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#071536]/45 to-transparent pointer-events-none" />

            {/* Left-Side Dark Navy Content Panel */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-xl flex flex-col justify-center h-full pb-20 sm:pb-24 lg:pb-20 antialiased">
              
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-[1.12] drop-shadow-xs">
                Mangolpuri Branch
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-blue-100/95 font-medium mt-2.5 leading-relaxed max-w-lg">
                Focused Academic &amp; Commerce Coaching
              </p>

              {/* Two Compact Subject Cards: Translucent Blue and Purple with Graduation-Cap Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                
                {/* Card 1: Classes 4–10 (Subtle Translucent Blue with Clean Highlights) */}
                <div className="p-3.5 rounded-[5px] bg-[#122b64]/65 border border-blue-400/35 backdrop-blur-md text-white flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all hover:border-blue-400/50">
                  <div className="w-8 h-8 rounded-[5px] bg-blue-500/25 text-blue-200 flex items-center justify-center shrink-0 mt-0.5 border border-blue-300/40 shadow-2xs">
                    <GraduationCap className="w-4.5 h-4.5 text-blue-100" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-wide">Classes 4–10</p>
                    <p className="text-[11.5px] text-blue-100/95 mt-0.5 font-medium leading-snug">
                      Maths · Science · English · Social Studies
                    </p>
                  </div>
                </div>

                {/* Card 2: Classes 11–12 (Subtle Translucent Purple with Violet Accents) */}
                <div className="p-3.5 rounded-[5px] bg-[#291657]/65 border border-purple-400/35 backdrop-blur-md text-white flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all hover:border-purple-400/50">
                  <div className="w-8 h-8 rounded-[5px] bg-purple-500/25 text-purple-200 flex items-center justify-center shrink-0 mt-0.5 border border-purple-300/40 shadow-2xs">
                    <GraduationCap className="w-4.5 h-4.5 text-purple-100" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-wide">Classes 11–12</p>
                    <p className="text-[11.5px] text-purple-100/95 mt-0.5 font-medium leading-snug">
                      Accounts · Economics
                    </p>
                  </div>
                </div>

              </div>

              {/* CTA Buttons: Prominent Proportions, Rectangular with ONLY 5px Border Radius */}
              <div className="flex flex-wrap items-center gap-3.5 mt-6 sm:mt-7">
                <Button
                  asChild
                  className="h-12 px-7 rounded-[5px] font-bold text-sm bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.5)] transition-all duration-200 cursor-pointer flex items-center gap-2 group"
                >
                  <a
                    href={branch.mapLink || "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Get Direction</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-6 rounded-[5px] font-bold text-sm border border-white/50 bg-[#091530]/40 hover:bg-white/15 text-white backdrop-blur-md shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <a href={`tel:${heroTel}`}>
                    <Phone className="w-4 h-4 text-blue-200" />
                    <span>Call Branch</span>
                  </a>
                </Button>
              </div>

            </div>

          </div>

          {/* Bottom Floating Information Card (Exactly 3 Columns, Pastel Icons, Overlapping Hero, 10% Reduced Width) */}
          <div className="relative z-20 -mt-10 sm:-mt-12 lg:-mt-14 w-[90%] mx-auto rounded-2xl bg-gradient-to-b from-white via-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_14px_40px_-8px_rgba(11,27,61,0.09),0_2px_8px_rgba(11,27,61,0.03)] p-5 sm:p-6 lg:p-7 antialiased">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100/90 items-center">
              
              {/* Column 1 – Branch Location */}
              <div className="pt-2 md:pt-0 md:px-4 first:pl-0 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-[5px] bg-[#EFF6FF] border border-blue-200/80 text-[#2563EB] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold text-[#0F172A] tracking-wider uppercase">Branch Location</p>
                  <p className="text-xs sm:text-[12.5px] text-slate-600 font-medium mt-1 leading-snug">
                    D-945–46, Block-D, Mangolpuri,<br className="hidden sm:inline" /> Delhi-110083
                  </p>
                </div>
              </div>

              {/* Column 2 – Working Hours */}
              <div className="pt-3 md:pt-0 md:px-4 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-[5px] bg-[#FFFBEB] border border-amber-200/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold text-[#0F172A] tracking-wider uppercase">Working Hours</p>
                  <p className="text-xs sm:text-[12.5px] text-slate-600 font-medium mt-1 leading-tight">
                    Mon – Sat: 8:00 AM – 8:30 PM
                  </p>
                  <p className="text-xs sm:text-[12.5px] text-slate-600 font-medium mt-1 leading-tight">
                    Sun: 9:00 AM – 2:00 PM
                  </p>
                </div>
              </div>

              {/* Column 3 – Branch Contact */}
              <div className="pt-3 md:pt-0 md:px-4 last:pr-0 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-[5px] bg-[#ECFDF5] border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-bold text-[#0F172A] tracking-wider uppercase">Branch Contact</p>
                  <a href={`tel:${heroTel}`} className="text-sm font-extrabold text-[#0E2554] hover:text-[#2563EB] mt-1 block transition-colors">
                    {heroPhone}
                  </a>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Direct Branch Enquiry
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ── SECTION 03: MEET OUR DIRECTOR ── */}
        <section className="relative w-full overflow-hidden">
          
          {/* Section Heading & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10">
            {/* Small text with bullet point */}
            <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67]">Meet </span>
                <span className="text-[#155EEF] font-extrabold">Our Director</span>
              </span>
            </div>

            {/* Headline description in single line */}
            <h2 className="text-[18px] min-[390px]:text-[20px] sm:text-[23px] md:text-[26px] lg:text-[29px] font-[800] tracking-tight leading-tight max-w-5xl mx-auto whitespace-normal sm:whitespace-nowrap">
              <span className="text-[#062B67]">Dedicated Mentorship.{' '}</span>
              <span className="text-[#155EEF]">Inspiring Academic Excellence.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Portrait of Vijay Verma + Polished Leadership Badge underneath */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              {/* Photo Container with Soft Circular Backdrop */}
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-[340px] sm:h-[380px] lg:h-[400px] flex items-end justify-center">
                
                {/* Different Light Color Circle Backdrop behind photo (Outer edge blends smoothly into white background) */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] sm:w-[330px] lg:w-[360px] h-[290px] sm:h-[330px] lg:h-[360px] rounded-full pointer-events-none select-none"
                  style={{
                    background: 'radial-gradient(circle, #D8E9FE 0%, #E3F0FE 42%, #EFF6FE 68%, rgba(244, 248, 254, 0.6) 82%, transparent 100%)',
                  }}
                />

                {/* Subtle soft ambient glow for seamless boundary melting */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[330px] sm:w-[380px] h-[330px] sm:h-[380px] rounded-full bg-blue-100/30 blur-2xl pointer-events-none" 
                />

                {/* Vijay Verma Cutout Portrait (Crisp jacket, free standing, zero outline) */}
                <div 
                  className="relative w-full h-full flex items-end justify-center z-10"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.15) 1.5%, black 4%)',
                    maskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.15) 1.5%, black 4%)',
                  }}
                >
                  <Image
                    src="/mangolpuri/vijay.png"
                    alt="Vijay Verma - Academic Head & Branch Director"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_12px_28px_rgba(20,47,112,0.12)]"
                    priority
                  />
                </div>

              </div>

              {/* Unified Profile Plate: Connects Photo, Name and Designation into ONE cohesive unit */}
              <div className="relative z-20 -mt-6 sm:-mt-8 w-[92%] max-w-[290px] sm:max-w-[310px] bg-white rounded-xl border border-blue-100/90 shadow-[0_8px_22px_-6px_rgba(20,47,112,0.12)] p-3 sm:p-3.5 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-[#142F70] tracking-tight leading-tight">
                  Vijay Verma
                </h3>
                <p className="text-xs sm:text-[13px] font-bold text-[#2563EB] mt-0.5 tracking-wide">
                  Academic Head &amp; Branch Director
                </p>
              </div>

            </div>

            {/* Right Column: Leadership Details & Messages */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">

              {/* Message Switch Text Tabs (Only text, uppercase, smooth sliding blue underline) */}
              <div className="flex items-center gap-5 pt-1 border-b border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setActiveMessageTab('director')}
                  className={cn(
                    "pb-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative",
                    activeMessageTab === 'director'
                      ? "text-[#142F70]"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <span>DIRECTOR MESSAGE</span>
                  {activeMessageTab === 'director' && (
                    <motion.span
                      layoutId="activeLeadershipUnderline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-[#2563EB] rounded-full"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMessageTab('profile')}
                  className={cn(
                    "pb-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative",
                    activeMessageTab === 'profile'
                      ? "text-[#142F70]"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <span>DIRECTOR PROFILE</span>
                  {activeMessageTab === 'profile' && (
                    <motion.span
                      layoutId="activeLeadershipUnderline"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-[#2563EB] rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Dynamic Message Box: Constant Solid Height & Buttery Smooth Cross-Fade (Zero Layout Jump) */}
              <div className="relative min-h-[300px] sm:min-h-[280px] lg:min-h-[270px] p-5 sm:p-6 rounded-r-[5px] bg-[#F1F5F9]/80 border-l-4 border-[#2563EB] border-t-0 border-b-0 border-r-0 shadow-none overflow-hidden flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeMessageTab === 'director' ? (
                    <motion.div
                      key="director-message-view"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-3.5 my-auto"
                    >
                      <p className="text-sm sm:text-[15px] lg:text-[15.5px] font-semibold text-[#142F70] leading-[1.65]">
                        &ldquo;At IDL Education Mangolpuri, our mission is to build deep conceptual clarity, disciplined study habits, and independent analytical thinking in every student. We firmly believe that when provided with the right mentorship, structured guidance, and continuous encouragement, every child has the potential to excel.&rdquo;
                      </p>
                      <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] font-semibold text-slate-700 leading-[1.65]">
                        &ldquo;Through our rigorous weekly test evaluations, personalized one-on-one doubt clearing sessions, and consistent parent-teacher engagement, we ensure steady academic progress, confidence building, and top rank performance across school tests, CBSE Board exams, and competitive entrances.&rdquo;
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="profile-message-view"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="space-y-3.5 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-3">
                        <p className="text-sm sm:text-[15px] lg:text-[15.5px] font-semibold text-[#142F70] leading-[1.65]">
                          &ldquo;Senior Economics Faculty with 10+ years of distinguished teaching and mentorship experience. M.Com and UGC NET Qualified, specializing in Micro and Macro Economics, Indian Economic Development, and Applied Problem Solving for Class 11–12 CBSE Boards and CUET UG.&rdquo;
                        </p>
                        <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] font-semibold text-slate-700 leading-[1.65]">
                          &ldquo;His signature pedagogy simplifies complex economic graphs and models into intuitive concepts. Through chapter-wise test series and step-by-step answer-writing, he consistently guides students to achieve 95%+ marks and top percentiles.&rdquo;
                        </p>
                      </div>

                      {/* Actionable Button inside Profile */}
                      <div className="pt-2">
                        <Button
                          type="button"
                          onClick={() => setIsBookDemoOpen(true)}
                          className="h-10 px-5 rounded-[5px] font-bold text-xs sm:text-sm bg-[#142F70] hover:bg-[#0E2252] text-white shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Book a Free Demo</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

        {/* ── SECTION 04: ACADEMIC PROGRAMS (COURSES & CLASSES OFFERED) ── */}
        <section className="relative w-full overflow-hidden space-y-6 sm:space-y-8">
          
          {/* Centered Section Heading matching Meet Our Director Design System */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10">
            {/* Small text with bullet point */}
            <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67]">Our </span>
                <span className="text-[#155EEF] font-extrabold">Academic Programs</span>
              </span>
            </div>

            {/* Headline description in single line */}
            <h2 className="text-[18px] min-[390px]:text-[20px] sm:text-[23px] md:text-[26px] lg:text-[29px] font-[800] tracking-tight leading-tight max-w-5xl mx-auto whitespace-normal sm:whitespace-nowrap">
              <span className="text-[#062B67]">From Strong Foundations{' '}</span>
              <span className="text-[#155EEF]">to Board Excellence.</span>
            </h2>
          </div>

          {/* Three Vertical Program Cards (Classes 4-8, 9 & 10, 11 & 12) with Student Cutouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Classes 4 – 8 (Junior Foundation) */}
            <div
              onClick={() => setIsAdmissionOpen(true)}
              className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#155EEF]/50 p-0 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout */}
              <div className="relative h-56 sm:h-60 overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#EFF6FF] via-[#F4F8FE] to-[#E2EEFE]">
                {/* Soft ambient radial glow behind student */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#155EEF] border border-blue-200/80 text-xs font-bold shadow-2xs">
                  Classes 4 – 8
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[190px] sm:h-[205px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/student.png"
                    alt="Classes 4 - 8 Junior Foundation Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                <div>
                  {/* Program Title */}
                  <h3 className="text-xl font-bold text-[#142F70] tracking-tight group-hover:text-[#155EEF] transition-colors">
                    Junior Foundation Program
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2 leading-relaxed">
                    Build rock-solid basic concepts, mental maths, logical reasoning, and disciplined daily study habits.
                  </p>
                </div>

                {/* Subjects Covered */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Subjects Covered
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Maths
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Science
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      English
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Social Studies
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-start mt-auto">
                  <div className="h-10 px-5 rounded-[5px] font-bold text-xs sm:text-sm bg-[#142F70] hover:bg-[#0E2252] text-white shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Classes 9 & 10 (Secondary Board Foundation) */}
            <div
              onClick={() => setIsAdmissionOpen(true)}
              className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#0284C7]/50 p-0 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout */}
              <div className="relative h-56 sm:h-60 overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#F0F8FF] via-[#F4F9FF] to-[#DFEFFE]">
                {/* Soft ambient radial glow behind student */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#0284C7] border border-sky-200/80 text-xs font-bold shadow-2xs">
                  Classes 9 &amp; 10
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[190px] sm:h-[205px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/courses/cbse-student.png"
                    alt="Classes 9 and 10 CBSE Board Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                <div>
                  {/* Program Title */}
                  <h3 className="text-xl font-bold text-[#142F70] tracking-tight group-hover:text-[#0284C7] transition-colors">
                    Secondary Board Program
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2 leading-relaxed">
                    NCERT line-by-line mastery, rigorous weekly test evaluations, PYQs practice, and Board exam scoring strategies.
                  </p>
                </div>

                {/* Subjects Covered */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Subjects Covered
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Maths
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Science
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Social Studies
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      English
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-start mt-auto">
                  <div className="h-10 px-5 rounded-[5px] font-bold text-xs sm:text-sm bg-[#142F70] hover:bg-[#0E2252] text-white shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Classes 11 & 12 (Senior Commerce & CUET) */}
            <div
              onClick={() => setIsAdmissionOpen(true)}
              className="group relative rounded-2xl bg-white border border-slate-200/90 hover:border-[#7C3AED]/50 p-0 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Visual Showcase Top with Student Cutout */}
              <div className="relative h-56 sm:h-60 overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#FAF5FF] via-[#F8F4FD] to-[#EFE4FD]">
                {/* Soft ambient radial glow behind student */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

                {/* Badge on Image Header */}
                <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#7C3AED] border border-purple-200/80 text-xs font-bold shadow-2xs">
                  Classes 11 &amp; 12
                </span>

                {/* Real Student Cutout Photo */}
                <div className="relative w-full h-[190px] sm:h-[205px] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src="/courses/cuet-student.png"
                    alt="Classes 11 and 12 Commerce & CUET Student"
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                </div>

                {/* Soft bottom edge fade */}
                <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                <div>
                  {/* Program Title */}
                  <h3 className="text-xl font-bold text-[#142F70] tracking-tight group-hover:text-[#7C3AED] transition-colors">
                    Commerce Foundation
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-2 leading-relaxed">
                    Expert mentoring in Accounts &amp; Economics by Vijay Verma Sir and faculty for 95%+ Board scores and top university admission.
                  </p>
                </div>

                {/* Subjects Covered */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Subjects Covered
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Accounts
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Economics
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      Political Science
                    </div>
                    <div className="h-9 px-2 rounded-[5px] border border-slate-200/90 flex items-center justify-center text-center text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors bg-transparent">
                      History
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-start mt-auto">
                  <div className="h-10 px-5 rounded-[5px] font-bold text-xs sm:text-sm bg-[#142F70] hover:bg-[#0E2252] text-white shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── SECTION 05: WEEKLY CLASS TIMETABLE ────────────────────────── */}
        <section id="weekly-timetable" className="relative w-full overflow-hidden space-y-6 sm:space-y-8 bg-white">

          {/* 1. Centered Section Heading matching Design System */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            {/* Small text with bullet point */}
            <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67]">Weekly </span>
                <span className="text-[#155EEF] font-extrabold">Class Timetable</span>
              </span>
            </div>

            {/* Headline description in single line */}
            <h2 className="text-[18px] min-[390px]:text-[20px] sm:text-[23px] md:text-[26px] lg:text-[29px] font-[800] tracking-tight leading-tight max-w-5xl mx-auto whitespace-normal sm:whitespace-nowrap">
              <span className="text-[#062B67]">Structured Batches{' '}</span>
              <span className="text-[#155EEF]">for Focused Learning.</span>
            </h2>
          </div>

          {/* 2. Top Navigation Tabs (Class 9, Class 10, Class 11, Class 12) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-6 mb-7 sm:mb-9">
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
                    "px-5 sm:px-6 py-2 sm:py-2.5 rounded-[5px] text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer text-center",
                    isActive
                      ? "bg-[#142F70] text-white shadow-md ring-2 ring-blue-500/20"
                      : "bg-[#F8FAFC] text-[#0B2559] border border-slate-200/90 hover:bg-slate-100 hover:border-slate-300 shadow-2xs"
                  )}
                >
                  {tab.label}
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
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0E52C9] border border-blue-200/60 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                                Class 9 Timetable
                              </h3>
                              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                CBSE Foundation
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Regular 6-day academic schedule covering all major subjects
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                          <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>2 Hours / Day • Mon to Sat</span>
                        </div>
                      </div>

                      {/* MWF & TTS 2 Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {/* MWF Card */}
                        <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#142F70] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              MWF Batch
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Mon, Wed, Fri</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Mathematics</span>
                              <span className="text-xs font-semibold text-[#1D4ED8] bg-[#EBF2FE] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Social Studies</span>
                              <span className="text-xs font-semibold text-[#9A6208] bg-[#FEF3D6] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>

                        {/* TTS Card */}
                        <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#6B21A8] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              TTS Batch
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Tue, Thu, Sat</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Science</span>
                              <span className="text-xs font-semibold text-[#0D8249] bg-[#E6F8ED] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">English</span>
                              <span className="text-xs font-semibold text-[#6B32D6] bg-[#F2ECFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unified Complete Timetable Table */}
                      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                        <div className="bg-[#0B357B] px-4 py-2.5 flex items-center justify-between text-white">
                          <span className="font-bold text-xs sm:text-sm">Complete Class 9 Schedule (MWF + TTS)</span>
                          <span className="text-[11px] font-medium text-blue-100">4 Core Subjects • 6 Days</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                            <thead>
                              <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                                <th className="py-2.5 px-3 text-center w-[25%]">Days / Batch</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Time Slot</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Subject</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Focus Area</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                    MWF<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Mon, Wed, Fri</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                                    Mathematics
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  NCERT Concepts &amp; Practice
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#FEF3D6] text-[#9A6208]">
                                    Social Studies
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  History, Geography, Civics
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors border-t-2 border-slate-100">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8]">
                                    TTS<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Tue, Thu, Sat</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#E6F8ED] text-[#0D8249]">
                                    Science
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Physics, Chemistry, Biology
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                                    English
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Grammar, Writing &amp; Literature
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>6 Days / Week Regular Batches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Daily Homework &amp; Doubts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Weekly Sunday Assessment</span>
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
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0E52C9] border border-blue-200/60 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                                Class 10 Timetable
                              </h3>
                              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                CBSE Board Batch
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Focused board preparation with syllabus mastery and regular testing
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                          <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>2 Hours / Day • Board Prep</span>
                        </div>
                      </div>

                      {/* MWF & TTS 2 Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {/* MWF Card */}
                        <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#142F70] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              MWF Batch
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Mon, Wed, Fri</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Mathematics</span>
                              <span className="text-xs font-semibold text-[#1D4ED8] bg-[#EBF2FE] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Social Studies</span>
                              <span className="text-xs font-semibold text-[#9A6208] bg-[#FEF3D6] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>

                        {/* TTS Card */}
                        <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#6B21A8] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              TTS Batch
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Tue, Thu, Sat</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Science</span>
                              <span className="text-xs font-semibold text-[#0D8249] bg-[#E6F8ED] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">English</span>
                              <span className="text-xs font-semibold text-[#6B32D6] bg-[#F2ECFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unified Complete Timetable Table */}
                      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                        <div className="bg-[#142F70] px-4 py-2.5 flex items-center justify-between text-white">
                          <span className="font-bold text-xs sm:text-sm">Complete Class 10 Schedule (MWF + TTS)</span>
                          <span className="text-[11px] font-medium text-blue-100">Board Batch • Mon – Sat</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                            <thead>
                              <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                                <th className="py-2.5 px-3 text-center w-[25%]">Days / Batch</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Time Slot</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Subject</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Focus Area</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                    MWF<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Mon, Wed, Fri</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                                    Mathematics
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  NCERT Exemplar &amp; Board PYQs
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#FEF3D6] text-[#9A6208]">
                                    Social Studies
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Board Answer Writing &amp; Map Work
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors border-t-2 border-slate-100">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8]">
                                    TTS<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Tue, Thu, Sat</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#E6F8ED] text-[#0D8249]">
                                    Science
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Physics, Chem, Bio &amp; Numericals
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                                    English
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Board Pattern Writing &amp; Literature
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>100% Board Syllabus Coverage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Chapter-wise Tests &amp; Reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pre-Board Drills &amp; Presentation</span>
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
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0E52C9] border border-blue-200/60 flex items-center justify-center shrink-0">
                            <BarChart2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                                Class 11 Timetable
                              </h3>
                              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                Commerce Foundation
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Core commerce subjects with conceptual depth, practical problem solving and doubts
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                          <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>1 Hour / Subject • Commerce Focus</span>
                        </div>
                      </div>

                      {/* MWF & TTS 2 Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {/* MWF Card */}
                        <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#142F70] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              MWF Core Sessions
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Mon, Wed, Fri</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Economics</span>
                              <span className="text-xs font-semibold text-[#1D4ED8] bg-[#EBF2FE] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Accounts</span>
                              <span className="text-xs font-semibold text-[#0E52C9] bg-[#DBEAFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>

                        {/* TTS Card */}
                        <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#6B21A8] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              TTS Practice &amp; Support
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Tue, Thu, Sat</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Guided Practice &amp; Doubts</span>
                              <span className="text-xs font-semibold text-[#0D8249] bg-[#E6F8ED] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Pol Science / History</span>
                              <span className="text-xs font-semibold text-[#6B32D6] bg-[#F2ECFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unified Complete Timetable Table */}
                      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                        <div className="bg-[#0B357B] px-4 py-2.5 flex items-center justify-between text-white">
                          <span className="font-bold text-xs sm:text-sm">Complete Class 11 Schedule (MWF + TTS)</span>
                          <span className="text-[11px] font-medium text-blue-100">Commerce Batch</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                            <thead>
                              <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                                <th className="py-2.5 px-3 text-center w-[25%]">Days / Batch</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Time Slot</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Subject</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Focus Area</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                    MWF<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Mon, Wed, Fri</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                                    Economics
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Microeconomics &amp; Statistics
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF]">
                                    Accounts
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Journal, Ledger, Trial Balance
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors border-t-2 border-slate-100">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8]">
                                    TTS<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Tue, Thu, Sat</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#E6F8ED] text-[#0D8249]">
                                    Guided Practice
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Accounts Problem Solving &amp; Doubts
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                                    Pol Science / History
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Foundation &amp; Humanities Support
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Core Accounts &amp; Economics Rigor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Practical Ledger Problem Workshops</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Weekly Sunday Assessment &amp; Doubts</span>
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
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6B21A8] border border-purple-200/60 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                                Class 12 Timetable
                              </h3>
                              <span className="px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8]">
                                Commerce Board Batch
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Intensive board exam preparation with high-scoring accounting formats and PYQ drills
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                          <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                          <span>1 Hour / Subject • Board Prep</span>
                        </div>
                      </div>

                      {/* TTS & MWF 2 Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {/* TTS Card */}
                        <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#6B21A8] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              TTS Core Sessions
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Tue, Thu, Sat</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Economics</span>
                              <span className="text-xs font-semibold text-[#6B21A8] bg-[#F3E8FF] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Accounts</span>
                              <span className="text-xs font-semibold text-[#1D4ED8] bg-[#DBEAFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>

                        {/* MWF Card */}
                        <div className="rounded-xl border border-blue-200/90 bg-gradient-to-br from-blue-50/50 to-white p-3.5 sm:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-extrabold bg-[#142F70] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                              MWF Board Drills
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">Mon, Wed, Fri</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Board Answer Writing</span>
                              <span className="text-xs font-semibold text-[#1D4ED8] bg-[#EBF2FE] px-2 py-0.5 rounded-[4px]">4:00 – 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                              <span className="text-xs font-bold text-[#0B2559]">Pol Science / History</span>
                              <span className="text-xs font-semibold text-[#6B32D6] bg-[#F2ECFE] px-2 py-0.5 rounded-[4px]">5:00 – 6:00 PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Unified Complete Timetable Table */}
                      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                        <div className="bg-[#142F70] px-4 py-2.5 flex items-center justify-between text-white">
                          <span className="font-bold text-xs sm:text-sm">Complete Class 12 Schedule (TTS + MWF)</span>
                          <span className="text-[11px] font-medium text-blue-100">CBSE Commerce Board Batch</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                            <thead>
                              <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                                <th className="py-2.5 px-3 text-center w-[25%]">Days / Batch</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Time Slot</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Subject</th>
                                <th className="py-2.5 px-3 text-center w-[25%]">Focus Area</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#F3E8FF] text-[#6B21A8]">
                                    TTS<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Tue, Thu, Sat</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                                    Economics
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Macroeconomics &amp; IED Case Studies
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#DBEAFE] text-[#1E40AF]">
                                    Accounts
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Partnership, Company &amp; Cash Flow
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors border-t-2 border-slate-100">
                                <td className="py-2.5 px-2 text-center" rowSpan={2}>
                                  <span className="inline-block px-2.5 py-1 rounded-[5px] text-[11px] font-bold bg-[#EBF2FE] text-[#1D4ED8]">
                                    MWF<br />
                                    <span className="text-[9.5px] font-normal text-slate-500">Mon, Wed, Fri</span>
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  4:00 – 5:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                                    Board Answer Writing
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  CBSE PYQs &amp; Step-marking Practice
                                </td>
                              </tr>
                              <tr className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-2 text-center whitespace-nowrap text-slate-700 font-medium">
                                  5:00 – 6:00 PM
                                </td>
                                <td className="py-2.5 px-2 text-center">
                                  <span className="inline-block px-3 py-1 rounded-[5px] text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                                    Pol Science / History
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center text-xs text-slate-600">
                                  Board Pattern Mastery &amp; Doubts
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-5 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Dedicated Board Answer Writing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Fast Accounting Calculation Drills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pre-Board Mocks &amp; 1-on-1 Feedback</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column (lg:col-span-4) – Sunday Special Card */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs flex flex-col justify-between w-full h-full transition-all duration-200">
                {/* Header Banner */}
                <div className="bg-[#0B357B] px-5 py-3.5 flex items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="font-extrabold text-base sm:text-lg">
                      Sunday Special
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B] text-slate-950 shadow-2xs">
                    Special Schedule
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* 3 Activities */}
                  <div className="space-y-5">
                    {/* Activity 1 */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl border border-blue-400 bg-blue-50/60 text-[#0E52C9] flex items-center justify-center shrink-0 mt-0.5">
                        <ClipboardCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#0B2559]">
                          Weekly Tests
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Subject-wise assessment and practice tests to track progress.
                        </p>
                      </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl border border-blue-400 bg-blue-50/60 text-[#0E52C9] flex items-center justify-center shrink-0 mt-0.5">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#0B2559]">
                          Special Workshops
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Concept building, problem solving and exam strategy sessions.
                        </p>
                      </div>
                    </div>

                    {/* Activity 3 */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl border border-blue-400 bg-blue-50/60 text-[#0E52C9] flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#0B2559]">
                          Revision &amp; Doubt Sessions
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Comprehensive revision and doubt clearing for better understanding.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Note Box */}
                  <div className="rounded-xl bg-[#F1F6FE] border border-[#D5E3FC] p-4 text-xs mt-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Info className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                      <span className="font-bold text-[#0B2559]">Note:</span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] sm:text-xs bg-[#FEF3C7] text-[#92400E]">
                        Sunday timings: 9:00 AM – 2:00 PM
                      </span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      Exact schedule (Test / Workshop / Revision) will be shared each week by the branch.
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── SECTION 06: BRANCH FACILITIES & LEARNING ENVIRONMENT ───── */}
        <section className="relative w-full overflow-hidden space-y-6 sm:space-y-8 bg-white">
          
          {/* Centered Section Heading matching Design System */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10">
            {/* Small text with bullet point */}
            <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
              <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] shrink-0" />
              <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
                <span className="text-[#062B67]">Branch Facilities &amp;{' '}</span>
                <span className="text-[#155EEF] font-extrabold">Learning Environment</span>
              </span>
            </div>

            {/* Headline description in single line */}
            <h2 className="text-[18px] min-[390px]:text-[20px] sm:text-[23px] md:text-[26px] lg:text-[29px] font-[800] tracking-tight leading-tight max-w-5xl mx-auto whitespace-normal sm:whitespace-nowrap">
              <span className="text-[#062B67]">Modern Spaces{' '}</span>
              <span className="text-[#155EEF]">for Focused Learning.</span>
            </h2>
          </div>

          {/* Equal Grid: Only Photos, Identical Horizontal & Vertical Spacing (gap-5 sm:gap-6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { src: "/hub2.png", alt: "IDL Education Mangolpuri Facility 1" },
              { src: "/mangolpuri/mangolpuri-center.jpg", alt: "IDL Education Mangolpuri Facility 2" },
              { src: "/branch_rohini.png", alt: "IDL Education Mangolpuri Facility 3" },
              { src: "/01.png", alt: "IDL Education Mangolpuri Facility 4" },
              { src: "/02.png", alt: "IDL Education Mangolpuri Facility 5" },
              { src: "/about.png", alt: "IDL Education Mangolpuri Facility 6" },
            ].map((facility, idx) => (
              <div
                key={idx}
                onClick={() => setIsGalleryOpen(true)}
                className="group relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#155EEF]/50 transition-all duration-300 cursor-pointer bg-slate-100"
              >
                <Image
                  src={facility.src}
                  alt={facility.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

        </section>




        {/* ── SECTION 07: FAQ & EXPLORE OTHER IDL CENTRES ───────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Panel: Frequently Asked Questions */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <span className="w-1.5 h-6 bg-[#F59E0B] rounded-full shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#2563EB] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B2559] tracking-tight">
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Common questions about the Mangolpuri branch
                  </p>
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
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
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E3EDFB] bg-[#F6F9FE] overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#0B2559] hover:text-[#2563EB] transition-colors cursor-pointer select-none"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-[#2563EB] shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-[#E8F0FC]/60">
                          <p className="pt-2">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Explore Other IDL Centres */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <span className="w-1.5 h-6 bg-[#F59E0B] rounded-full shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#2563EB] shrink-0" />
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B2559] tracking-tight">
                      Explore Other IDL Centres
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Visit our other centres across Delhi for quality education.
                  </p>
                </div>
              </div>

              {/* 3 Branch Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
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
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/branches/${item.slug}`}
                    className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white hover:border-[#2563EB]/60 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                  >
                    {/* Branch Image */}
                    <div className="relative h-28 sm:h-32 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={`${item.name} Branch - IDL Education`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Bottom Card Info */}
                    <div className="p-3 flex items-end justify-between gap-1.5 bg-white">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <h4 className="text-xs sm:text-[13px] font-extrabold text-[#0B2559] group-hover:text-[#2563EB] transition-colors truncate">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-4.5 mt-0.5">
                          {item.pincode}
                        </p>
                      </div>

                      {/* Small Arrow Button (Strictly 5px radius) */}
                      <div className="w-7 h-7 rounded-[5px] bg-[#EBF3FE] group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* ── FULL GALLERY MODAL ───────────────────────────────────────── */}
      {isGalleryOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Inside Mangolpuri Campus Photos</h3>
              <button 
                type="button" 
                onClick={() => setIsGalleryOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="relative h-56 rounded-xl overflow-hidden border">
                <Image src="/hub2.png" alt="Smart Classroom" fill className="object-cover" />
              </div>
              <div className="relative h-56 rounded-xl overflow-hidden border">
                <Image src="/mangolpuri/mangolpuri.png" alt="Campus Building" fill className="object-cover" />
              </div>
              <div className="relative h-56 rounded-xl overflow-hidden border">
                <Image src="/01.png" alt="Classroom Teaching" fill className="object-cover" />
              </div>
              <div className="relative h-56 rounded-xl overflow-hidden border">
                <Image src="/02.png" alt="Lecture Hall" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS INTEGRATION ───────────────────────────────────────── */}
      <BookDemoModal isOpen={isBookDemoOpen} onOpenChange={setIsBookDemoOpen} />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
      <StudentEnquiryModal isOpen={isEnquiryOpen} onOpenChange={setIsEnquiryOpen} />

    </div>
  );
}
