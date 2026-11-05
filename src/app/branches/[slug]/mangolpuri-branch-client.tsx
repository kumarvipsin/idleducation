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
        { time: "5:00–6:00 PM", class9: "SST", class10: "SST" },
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
    economics: {
      title: "Economics",
      slots: [
        { days: "MWF (Mon, Wed, Fri)", time: "4:00–5:00 PM", classGrade: "Class 11" },
        { days: "TTS (Tue, Thu, Sat)", time: "4:00–5:00 PM", classGrade: "Class 12" },
      ]
    },
    accountancy: {
      title: "Accountancy",
      slots: [
        { days: "MWF (Mon, Wed, Fri)", time: "5:00–6:00 PM", classGrade: "Class 11" },
        { days: "TTS (Tue, Thu, Sat)", time: "5:00–6:00 PM", classGrade: "Class 12" },
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

  // Timetable Tabs (Classes 9–10, Class 11, Class 12, Sunday Special)
  const [timetableTab, setTimetableTab] = useState<'9-10' | '11' | '12' | 'sunday'>('9-10');
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
      doc.text('SST', 80, y + 4.2);
      doc.text('SST', 140, y + 4.2);
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
      doc.setTextColor(37, 99, 235);
      doc.text('Class 12', 160, y + 4.2);
      y += 6;

      // Accountancy Row 1
      doc.setFillColor(255, 255, 255);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Accountancy', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('MWF (Mon, Wed, Fri)', 70, y + 4.2);
      doc.text('5:00–6:00 PM', 120, y + 4.2);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(126, 34, 206);
      doc.text('Class 11', 160, y + 4.2);
      y += 6;

      // Accountancy Row 2
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 6, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text('Accountancy', 20, y + 4.2);
      doc.setFont('helvetica', 'normal');
      doc.text('TTS (Tue, Thu, Sat)', 70, y + 4.2);
      doc.text('5:00–6:00 PM', 120, y + 4.2);
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
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800 selection:bg-[#142F70]/20 selection:text-[#142F70]">

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

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16">

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
                      Maths · Science · English · SST
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
                      Economics · Accountancy
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

          {/* Bottom Floating Information Card (Exactly 3 Columns, Pastel Icons, Overlapping Hero) */}
          <div className="relative z-20 -mt-10 sm:-mt-12 lg:-mt-14 mx-3 sm:mx-6 lg:mx-8 rounded-2xl bg-gradient-to-b from-white via-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_14px_40px_-8px_rgba(11,27,61,0.09),0_2px_8px_rgba(11,27,61,0.03)] p-5 sm:p-6 lg:p-7 antialiased">
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

        {/* ── SECTION 03: MEET OUR LEADERSHIP ─────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Large Professional Portrait of Vijay Verma */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[360px] sm:h-[400px] lg:h-[430px] rounded-xl overflow-hidden bg-white flex items-end justify-center">
                <Image
                  src="/vijay.png"
                  alt="Vijay Verma - Co-Founder & Branch Director"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain object-bottom scale-105"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Leadership Details */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              
              {/* Eyebrow with Small Yellow Accent Detail */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#2864E8] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-[2px] bg-[#F28A24]" />
                <span>MEET OUR LEADERSHIP</span>
              </div>

              {/* Main Name & Designation */}
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#142F70] tracking-tight">
                  Vijay Verma
                </h2>
                <p className="text-sm sm:text-base font-bold text-[#2864E8]">
                  Co-Founder &amp; Branch Director
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  IDL Education | Mangolpuri Branch
                </p>
              </div>

              {/* Two Compact Information Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Block 1 */}
                <div className="p-3.5 rounded-[5px] bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[5px] bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100/80 mt-0.5">
                    <Sparkles className="w-4.5 h-4.5 text-[#2864E8]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#142F70]">10+ Years</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Teaching &amp; Leadership Experience
                    </p>
                  </div>
                </div>

                {/* Block 2 */}
                <div className="p-3.5 rounded-[5px] bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[5px] bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100/80 mt-0.5">
                    <GraduationCap className="w-4.5 h-4.5 text-[#2864E8]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#142F70]">Branch Leadership</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Academic Excellence &amp; Student Success
                    </p>
                  </div>
                </div>
              </div>

              {/* Welcome Message in Subtle Quotation-Style Panel */}
              <div className="relative p-4 rounded-[5px] bg-blue-50/50 border-l-3 border-[#2864E8] border-y border-r border-slate-200/70 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
                <p className="italic font-medium text-slate-700">
                  &ldquo;Committed to delivering quality education, strong fundamentals and holistic growth for every student at the Mangolpuri Branch.&rdquo;
                </p>
              </div>

              {/* CTA Buttons: Rectangular with exactly 5px Border Radius */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  type="button"
                  onClick={() => setIsAdmissionOpen(true)}
                  className="h-11 px-6 rounded-[5px] font-bold text-xs sm:text-sm bg-[#142F70] hover:bg-[#0E2252] text-white shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Connect with Branch</span>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-5 rounded-[5px] font-bold text-xs sm:text-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Link href="/about">
                    <span>About IDL Education</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2864E8]" />
                  </Link>
                </Button>
              </div>

            </div>

          </div>
        </div>

        {/* ── SECTION 04: ACADEMIC PROGRAMS (COURSES & CLASSES OFFERED) ── */}
        <section className="rounded-2xl bg-gradient-to-b from-[#F0F5FD]/60 via-white to-[#F0F5FD]/40 border border-slate-200/80 shadow-2xs p-6 sm:p-8 lg:p-10 space-y-7">
          
          {/* Centered Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-4.5 rounded-full bg-[#F59E0B]" />
              <span className="text-xs font-black text-slate-800 tracking-wider uppercase">
                OUR ACADEMIC PROGRAMS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142F70] tracking-tight">
              Courses &amp; Classes Offered
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Comprehensive learning programs for school students from Class 4 to 12
            </p>
          </div>

          {/* Two Equal-Width Program Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Card 1: School Foundation Program */}
            <div
              onClick={() => setIsAdmissionOpen(true)}
              className="group relative rounded-2xl bg-[#F6F9FE] border border-[#DCE8FC] hover:border-[#2563EB]/40 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* 3D Illustration top right */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-6 w-24 sm:w-28 h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 pointer-events-none">
                <Image
                  src="/academic_cap_3d.png"
                  alt="School Foundation Program"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Content Top */}
              <div className="relative pr-24 sm:pr-28">
                {/* Pill Badge */}
                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#DCEAFE] text-[#2563EB] text-xs font-bold">
                  Classes 4 – 10
                </span>

                {/* Program Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#142F70] mt-3 tracking-tight">
                  School Foundation Program
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Build strong concepts, improve academic performance and prepare for higher classes.
                </p>
              </div>

              {/* Subjects Covered Section */}
              <div className="mt-6 sm:mt-7">
                <p className="text-xs font-bold text-[#142F70] mb-2.5 tracking-tight">
                  Subjects Covered
                </p>

                {/* 4 Chips in horizontal row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {/* Maths */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2ECFC] shadow-2xs">
                    <Calculator className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-slate-800">Maths</span>
                  </div>

                  {/* Science */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2ECFC] shadow-2xs">
                    <FlaskConical className="w-4 h-4 text-[#9333EA]" />
                    <span className="text-xs font-bold text-slate-800">Science</span>
                  </div>

                  {/* English */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2ECFC] shadow-2xs">
                    <BookOpen className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-slate-800">English</span>
                  </div>

                  {/* SST */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2ECFC] shadow-2xs">
                    <Globe className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-xs font-bold text-slate-800">SST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Commerce Program */}
            <div
              onClick={() => setIsAdmissionOpen(true)}
              className="group relative rounded-2xl bg-[#FAF8FE] border border-[#ECE5FA] hover:border-[#7C3AED]/40 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* 3D Illustration top right */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-6 w-24 sm:w-28 h-24 sm:h-28 transition-transform group-hover:scale-105 duration-300 pointer-events-none">
                <Image
                  src="/academic_chart_3d.png"
                  alt="Commerce Program"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Content Top */}
              <div className="relative pr-24 sm:pr-28">
                {/* Pill Badge */}
                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EFE8FD] text-[#7C3AED] text-xs font-bold">
                  Classes 11 – 12
                </span>

                {/* Program Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#142F70] mt-3 tracking-tight">
                  Commerce Program
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Specialized coaching for Commerce stream with concept clarity and exam-oriented preparation.
                </p>
              </div>

              {/* Subjects Covered Section */}
              <div className="mt-6 sm:mt-7">
                <p className="text-xs font-bold text-[#142F70] mb-2.5 tracking-tight">
                  Subjects Covered
                </p>

                {/* 2 Chips in horizontal row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {/* Economics */}
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EDE7FA] shadow-2xs">
                    <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-bold text-slate-800">Economics</span>
                  </div>

                  {/* Accountancy */}
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EDE7FA] shadow-2xs">
                    <Database className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-bold text-slate-800">Accountancy</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* ── SECTION 05: WEEKLY CLASS TIMETABLE ────────────────────────── */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#F2F7FF] via-[#F8FAFC] to-[#EFF5FE] border border-[#DCE7F6] p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
          {/* Subtle background ambient blur */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* 1. Section Heading (Centered) */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF2FE] border border-[#D0E0FD] mb-3">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-bold tracking-wider text-[#1D4ED8] uppercase">
                CLASS TIMETABLE – MANGOLPURI BRANCH
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B2559] tracking-tight">
              Weekly Class{' '}
              <span className="relative inline-block">
                Timetable
                {/* Hand-drawn yellow swoop underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#F59E0B]"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 8.5C55 3.5 145 3.5 197 8.5"
                    stroke="#F59E0B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              A structured learning schedule for focused and effective preparation.
            </p>
          </div>

          {/* 2. Top Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7 mb-8 sm:mb-10">
            {[
              { id: '9-10', label: 'Classes 9–10', icon: Calendar },
              { id: '11', label: 'Class 11', icon: GraduationCap },
              { id: '12', label: 'Class 12', icon: GraduationCap },
              { id: 'sunday', label: 'Sunday Special', icon: Sun },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = timetableTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimetableTab(tab.id as any)}
                  className={cn(
                    "px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer flex items-center gap-2",
                    isActive
                      ? "bg-[#0B357B] text-white shadow-md ring-2 ring-blue-500/20"
                      : "bg-white text-[#0B2559] border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#0B357B]")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
            
            {/* Left Column (lg:col-span-8) */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* CARD 1: Classes 9–10 Timetable */}
              <div className={cn(
                "rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all duration-200",
                timetableTab === '9-10' ? "border-blue-300 ring-2 ring-blue-500/10" : "border-slate-200/90"
              )}>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0E52C9] flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                      Classes 9–10 Timetable
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                    <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>2 Hours / Day</span>
                  </div>
                </div>

                {/* Sub-cards Grid (MWF & TTS) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* MWF Sub-card */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-[#0E52C9] px-4 py-2.5 flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-white" />
                      <span className="font-bold text-xs sm:text-sm">
                        MWF – Mon, Wed, Fri
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                          <th className="py-2.5 px-3.5 text-center w-[38%]">Time</th>
                          <th className="py-2.5 px-3 text-center w-[31%]">Class 9</th>
                          <th className="py-2.5 px-3 text-center w-[31%]">Class 10</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              4:00 – 5:00 PM
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                              Mathematics
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#EBF2FE] text-[#1D4ED8]">
                              Mathematics
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              5:00 – 6:00 PM
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-4 py-1 rounded-lg text-xs font-semibold bg-[#FEF3D6] text-[#9A6208]">
                              SST
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-4 py-1 rounded-lg text-xs font-semibold bg-[#FEF3D6] text-[#9A6208]">
                              SST
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* TTS Sub-card */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-[#0E52C9] px-4 py-2.5 flex items-center gap-2 text-white">
                      <Calendar className="w-4 h-4 text-white" />
                      <span className="font-bold text-xs sm:text-sm">
                        TTS – Tue, Thu, Sat
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#F0F5FD] text-[#0B2559] font-bold border-b border-slate-200/80">
                          <th className="py-2.5 px-3.5 text-center w-[38%]">Time</th>
                          <th className="py-2.5 px-3 text-center w-[31%]">Class 9</th>
                          <th className="py-2.5 px-3 text-center w-[31%]">Class 10</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              4:00 – 5:00 PM
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#E6F8ED] text-[#0D8249]">
                              Science
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#E6F8ED] text-[#0D8249]">
                              Science
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              5:00 – 6:00 PM
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                              English
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[#F2ECFE] text-[#6B32D6]">
                              English
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              {/* CARD 2: Classes 11–12 Timetable */}
              <div className={cn(
                "rounded-2xl border bg-white p-5 sm:p-6 shadow-xs transition-all duration-200",
                (timetableTab === '11' || timetableTab === '12') ? "border-blue-300 ring-2 ring-blue-500/10" : "border-slate-200/90"
              )}>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0E52C9] flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0B2559]">
                      Classes 11–12 Timetable
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-blue-200/70">
                    <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>1 Hour / Subject</span>
                  </div>
                </div>

                {/* Sub-cards Grid (Economics & Accountancy) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Economics Sub-card */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-[#EBF3FE] px-4 py-2.5 flex items-center gap-2 border-b border-[#D8E6FC]">
                      <BarChart2 className="w-4 h-4 text-[#0E52C9]" />
                      <span className="font-extrabold text-xs sm:text-sm text-[#0B2559]">
                        Economics
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#F8FAFD] text-[#0B2559] font-bold border-b border-slate-200/80">
                          <th className="py-2.5 px-3 text-center w-[36%]">Days</th>
                          <th className="py-2.5 px-3 text-center w-[34%]">Time</th>
                          <th className="py-2.5 px-3 text-center w-[30%]">Class</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className={cn("hover:bg-slate-50/60 transition-colors", timetableTab === '11' && "bg-blue-50/50")}>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#DBEAFE] text-[#1E40AF]">
                              MWF (Mon, Wed, Fri)
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-700 font-medium whitespace-nowrap">
                            4:00 – 5:00 PM
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={cn(
                              "inline-block px-2.5 py-0.5 rounded-md text-xs font-bold",
                              timetableTab === '11' ? "bg-blue-600 text-white shadow-2xs" : "bg-[#E0F2FE] text-[#0369A1]"
                            )}>
                              Class 11
                            </span>
                          </td>
                        </tr>
                        <tr className={cn("hover:bg-slate-50/60 transition-colors", timetableTab === '12' && "bg-purple-50/50")}>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                              TTS (Tue, Thu, Sat)
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-700 font-medium whitespace-nowrap">
                            4:00 – 5:00 PM
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={cn(
                              "inline-block px-2.5 py-0.5 rounded-md text-xs font-bold",
                              timetableTab === '12' ? "bg-purple-600 text-white shadow-2xs" : "bg-[#F3E8FF] text-[#6B21A8]"
                            )}>
                              Class 12
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Accountancy Sub-card */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="bg-[#EBF3FE] px-4 py-2.5 flex items-center gap-2 border-b border-[#D8E6FC]">
                      <Database className="w-4 h-4 text-[#0E52C9]" />
                      <span className="font-extrabold text-xs sm:text-sm text-[#0B2559]">
                        Accountancy
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#F8FAFD] text-[#0B2559] font-bold border-b border-slate-200/80">
                          <th className="py-2.5 px-3 text-center w-[36%]">Days</th>
                          <th className="py-2.5 px-3 text-center w-[34%]">Time</th>
                          <th className="py-2.5 px-3 text-center w-[30%]">Class</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className={cn("hover:bg-slate-50/60 transition-colors", timetableTab === '11' && "bg-blue-50/50")}>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#DBEAFE] text-[#1E40AF]">
                              MWF (Mon, Wed, Fri)
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-700 font-medium whitespace-nowrap">
                            5:00 – 6:00 PM
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={cn(
                              "inline-block px-2.5 py-0.5 rounded-md text-xs font-bold",
                              timetableTab === '11' ? "bg-blue-600 text-white shadow-2xs" : "bg-[#E0F2FE] text-[#0369A1]"
                            )}>
                              Class 11
                            </span>
                          </td>
                        </tr>
                        <tr className={cn("hover:bg-slate-50/60 transition-colors", timetableTab === '12' && "bg-purple-50/50")}>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                              TTS (Tue, Thu, Sat)
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-700 font-medium whitespace-nowrap">
                            5:00 – 6:00 PM
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={cn(
                              "inline-block px-2.5 py-0.5 rounded-md text-xs font-bold",
                              timetableTab === '12' ? "bg-purple-600 text-white shadow-2xs" : "bg-[#F3E8FF] text-[#6B21A8]"
                            )}>
                              Class 12
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column (lg:col-span-4) – Sunday Special Card */}
            <div className="lg:col-span-4 flex flex-col">
              <div className={cn(
                "rounded-2xl border bg-white overflow-hidden shadow-xs flex flex-col justify-between w-full h-full transition-all duration-200",
                timetableTab === 'sunday' ? "border-amber-400 ring-2 ring-amber-500/20 shadow-md" : "border-slate-200/90"
              )}>
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

          {/* 4. Bottom Action: Download Full Timetable (PDF) Button */}
          <div className="flex justify-center mt-8 sm:mt-10">
            <Button
              type="button"
              onClick={handleDownloadTimetable}
              disabled={isDownloadingPdf}
              className="px-8 py-3.5 rounded-xl bg-[#0B357B] hover:bg-[#08285D] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2.5 cursor-pointer h-auto"
            >
              <Download className={cn("w-5 h-5", isDownloadingPdf && "animate-bounce")} />
              <span>{isDownloadingPdf ? "Preparing Timetable PDF..." : "Download Full Timetable (PDF)"}</span>
            </Button>
          </div>

        </section>

        {/* ── SECTION 06: BRANCH FACILITIES & LEARNING ENVIRONMENT ───── */}
        <section className="rounded-2xl bg-gradient-to-b from-[#F0F5FD]/60 via-white to-[#F0F5FD]/40 border border-slate-200/80 shadow-2xs p-6 sm:p-8 lg:p-10 space-y-7">
          
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-4.5 rounded-full bg-[#F59E0B]" />
                <span className="text-xs font-black text-slate-800 tracking-wider uppercase">
                  BRANCH FACILITIES &amp; LEARNING ENVIRONMENT
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#142F70] tracking-tight">
                A Better Environment for Better Learning
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
                A comfortable, focused and student-friendly environment designed to support academic growth.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <ImageIcon className="w-4 h-4 text-[#2864E8]" />
              <span>View All Photos</span>
            </button>
          </div>

          {/* Asymmetric 4-Image Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            
            {/* Left side – Large featured image: Smart Classrooms */}
            <div
              onClick={() => setIsGalleryOpen(true)}
              className="lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] lg:min-h-[490px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group cursor-pointer bg-slate-100"
            >
              <Image
                src="/hub2.png"
                alt="Smart Classrooms - IDL Education Mangolpuri"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent pointer-events-none" />
              
              {/* White Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto max-w-[calc(100%-24px)] sm:max-w-xs p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100">
                  <Monitor className="w-4.5 h-4.5 text-[#2864E8]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#142F70] tracking-tight">
                    Smart Classrooms
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Tech-enabled learning for better concept clarity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side – 3 Smaller Images */}
            <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5">
              
              {/* Right side – Upper image: Reception Area (Wide landscape) */}
              <div
                onClick={() => setIsGalleryOpen(true)}
                className="relative h-48 sm:h-56 lg:h-[235px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group cursor-pointer bg-slate-100"
              >
                <Image
                  src="/branch_rohini.png"
                  alt="Reception Area - IDL Education Mangolpuri"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent pointer-events-none" />

                {/* White Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-3 sm:left-3 sm:right-auto max-w-[calc(100%-24px)] sm:max-w-xs p-2.5 sm:p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100">
                    <Building2 className="w-4 h-4 text-[#2864E8]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#142F70] tracking-tight">
                      Reception Area
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                      A welcoming and student-friendly space.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lower row – 2 side-by-side images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
                
                {/* Lower left image: Study Environment */}
                <div
                  onClick={() => setIsGalleryOpen(true)}
                  className="relative h-44 sm:h-48 lg:h-[235px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group cursor-pointer bg-slate-100"
                >
                  <Image
                    src="/about.png"
                    alt="Study Environment - IDL Education Mangolpuri"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent pointer-events-none" />

                  {/* White Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-3 sm:left-3 sm:right-auto max-w-[calc(100%-24px)] p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100">
                      <BookOpen className="w-3.5 h-3.5 text-[#2864E8]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#142F70] tracking-tight truncate">
                        Study Environment
                      </h4>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">
                        A quiet and focused space for self-study.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lower right image: Branch Infrastructure */}
                <div
                  onClick={() => setIsGalleryOpen(true)}
                  className="relative h-44 sm:h-48 lg:h-[235px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs group cursor-pointer bg-slate-100"
                >
                  <Image
                    src="/02.png"
                    alt="Branch Infrastructure - IDL Education Mangolpuri"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent pointer-events-none" />

                  {/* White Caption Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-3 sm:left-3 sm:right-auto max-w-[calc(100%-24px)] p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2864E8] flex items-center justify-center shrink-0 border border-blue-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2864E8]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#142F70] tracking-tight truncate">
                        Branch Infrastructure
                      </h4>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">
                        Modern, safe and well-equipped facilities.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </section>




        {/* ── SECTION 07: FAQ & EXPLORE OTHER IDL CENTRES ───────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Panel: Frequently Asked Questions */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
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
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
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
