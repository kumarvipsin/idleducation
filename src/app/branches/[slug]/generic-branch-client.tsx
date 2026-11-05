'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Train, 
  ShieldCheck, 
  Monitor, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Navigation, 
  GraduationCap, 
  Wind, 
  FileCheck, 
  Fingerprint, 
  Building2, 
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRANCHES_DATA, BranchInfo } from '@/data/branches-data';
import { useToast } from '@/hooks/use-toast';
import { BookDemoModal } from '@/components/book-demo-modal';
import { AdmissionModal } from '@/components/admission-modal';
import { StudentEnquiryModal } from '@/components/student-enquiry-modal';

interface BranchDetailClientProps {
  branch: BranchInfo;
}

export default function GenericBranchClient({ branch }: BranchDetailClientProps) {
  const { toast } = useToast();
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Inline Quick Demo Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formClass, setFormClass] = useState('Class 10');
  const [formStream, setFormStream] = useState('Science');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const otherBranches = BRANCHES_DATA.filter((b) => b.id !== branch.id);

  const handleQuickFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      toast({
        title: 'Missing Details',
        description: 'Please enter your name and contact phone number.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Demo Class Booked!',
        description: `Thank you ${formName}! Our ${branch.shortName} coordinator will call you on ${formPhone} shortly.`,
      });
      setFormName('');
      setFormPhone('');
    }, 800);
  };

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background text-foreground selection:bg-[#102A68]/15 selection:text-[#102A68]">
      {/* ── BREADCRUMB & TOP STRIP ──────────────────────────────────── */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span>Branches</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{branch.name}</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400">Admissions Open 2026-27</span>
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FF] via-white to-white dark:from-slate-950 dark:via-background dark:to-background border-b border-slate-100 dark:border-slate-800/80 pt-8 sm:pt-12 pb-12 sm:pb-16">
        {/* Subtle decorative mesh background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 dark:bg-blue-950/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100/40 dark:bg-amber-950/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Branch Title & Key Highlights */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-xs sm:text-[13px] font-bold text-[#102A68] dark:text-blue-300">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                <span>OFFLINE LEARNING CENTRE • DELHI</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#102A68] dark:text-white tracking-tight leading-[1.12]">
                {branch.name}
              </h1>

              <p className="text-base sm:text-lg lg:text-[19px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                {branch.tagline}
              </p>

              {/* Location Badge & Quick Facts Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Delhi - {branch.pincode}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs">
                  <Train className="w-3.5 h-3.5 text-rose-500" />
                  <span>{branch.nearestMetro} ({branch.metroLine})</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200/70 dark:border-amber-800/60 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{branch.rating} / 5</span>
                  <span className="font-normal text-amber-700 dark:text-amber-400">({branch.reviewCount})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Button
                  onClick={() => setIsBookDemoOpen(true)}
                  className="h-11 sm:h-12 px-6 sm:px-7 rounded-[8px] font-bold text-sm sm:text-base bg-[#102A68] hover:bg-[#0B1E4B] text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Book Free Demo Class
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="h-11 sm:h-12 px-5 sm:px-6 rounded-[8px] font-bold text-sm sm:text-base border-slate-300 dark:border-slate-700 text-[#102A68] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <a href={`tel:${branch.phone}`}>
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Call: {branch.phone}
                  </a>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="h-11 sm:h-12 px-4 rounded-[8px] font-semibold text-sm text-[#2563EB] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Link href={branch.mapLink} target="_blank" rel="noopener noreferrer">
                    <Navigation className="w-4 h-4" />
                    Directions
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: Hero Visual Card / Branch Highlight Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[22px] overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-[0_12px_40px_-10px_rgba(16,42,104,0.12)] bg-white dark:bg-slate-900">
                <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={branch.imageUrl}
                    alt={`${branch.name} Campus`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-widest font-semibold text-amber-300">Classroom & Mentorship</p>
                    <p className="text-base font-bold">{branch.shortName} Campus</p>
                  </div>
                </div>

                {/* Quick Info Ticker inside card */}
                <div className="p-4 sm:p-5 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-[13px] leading-snug">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">Address</span>
                      <span className="text-slate-600 dark:text-slate-400">{branch.fullAddress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-[13px] leading-snug">
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">Operating Hours</span>
                      <span className="text-slate-600 dark:text-slate-400">{branch.timingsWeekday}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personal Batch Size:</span>
                    <span className="text-xs font-bold text-[#102A68] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      {branch.batchSize}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-CARD ESSENTIAL DETAILS GRID ──────────────────────────── */}
      <section className="py-10 sm:py-14 bg-slate-50/60 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A68] dark:text-white tracking-tight">
              Branch Essentials & Connectivity
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              All the key information to plan your visit or reach out to our team at {branch.shortName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Address & Landmark */}
            <div className="p-5 sm:p-6 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Centre Location</h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {branch.fullAddress}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Landmark: </span>
                  {branch.landmark}
                </div>
              </div>
              <div className="mt-4 pt-2">
                <Link
                  href={branch.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open in Google Maps <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Metro & Commute */}
            <div className="p-5 sm:p-6 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800 flex items-center justify-center mb-4">
                  <Train className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Metro Connectivity</h3>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-2">
                  {branch.nearestMetro}
                </p>
                <span className="inline-block mt-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                  {branch.metroLine}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {branch.metroDistance}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Van/Cab: </span>
                {branch.transportInfo}
              </div>
            </div>

            {/* Card 3: Operational Timings */}
            <div className="p-5 sm:p-6 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Working Hours</h3>
                <div className="mt-2 space-y-1.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 block">Mon – Sat:</span>
                    <span>8:00 AM to 8:30 PM</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 block">Sunday:</span>
                    <span>9:00 AM to 2:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sunday Doubt Desk Active</span>
              </div>
            </div>

            {/* Card 4: Contact & Helpline */}
            <div className="p-5 sm:p-6 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Branch Helpline</h3>
                <p className="text-lg font-black text-[#102A68] dark:text-blue-300 mt-2">
                  +91 {branch.phone}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Email: {branch.email}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
                <Button
                  asChild
                  size="sm"
                  className="w-full h-8 text-xs font-bold bg-[#102A68] hover:bg-[#0B1E4B] text-white"
                >
                  <a href={`tel:${branch.phone}`}>Call Now</a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="w-full h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                >
                  Request Callback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THIS BRANCH & FACILITIES ─────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Branch Story & Mission */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-bold text-[#102A68] dark:text-blue-300">
                <span>CAMPUS OVERVIEW</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A68] dark:text-white tracking-tight leading-snug">
                Why Students Choose {branch.shortName}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {branch.overview}
              </p>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#102A68] dark:text-blue-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                  <span>Personal Attention Guarantee</span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400">
                  Strict batch caps of {branch.batchSize} allow each mentor to personally review every homework, question response, and test performance.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setIsAdmissionOpen(true)}
                  className="w-full sm:w-auto h-11 px-6 rounded-[8px] font-bold text-sm bg-[#102A68] hover:bg-[#0B1E4B] text-white shadow-sm cursor-pointer"
                >
                  Apply For Admission at {branch.shortName}
                </Button>
              </div>
            </div>

            {/* Right Column: 6 Feature / Facility Cards */}
            <div className="lg:col-span-7">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>Campus Facilities & Infrastructure</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branch.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-4.5 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                      {getFacilityIcon(facility.iconName)}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {facility.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES OFFERED AT THIS BRANCH ─────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-800/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">OFFLINE BATCHES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A68] dark:text-white tracking-tight mt-1">
              Courses Offered at {branch.shortName}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Structured CBSE & Entrance programs taught by our senior master teachers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {branch.courses.map((course, idx) => (
              <div
                key={idx}
                className="rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {course.badge}
                  </div>
                  <h3 className="text-base font-bold text-[#102A68] dark:text-white leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    Eligibility: {course.classes}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                      Subjects Covered:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {course.subjects.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsBookDemoOpen(true)}
                    className="w-full h-8.5 rounded-[6px] text-xs font-bold bg-[#102A68] hover:bg-[#0B1E4B] text-white cursor-pointer"
                  >
                    Book Demo Class
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK DEMO BOOKING FORM + MAP SECTION ──────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left: Interactive Quick Demo Form */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-[22px] bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-blue-200/80 dark:border-slate-800 shadow-sm">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950 text-xs font-bold text-[#102A68] dark:text-blue-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>2 DAYS FREE TRIAL</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#102A68] dark:text-white tracking-tight leading-snug">
                  Book Free Demo Class at {branch.shortName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 mb-6">
                  Experience our interactive smart classes and meet the teachers before taking admission.
                </p>

                <form onSubmit={handleQuickFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Parent / Student Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full h-10 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Select Class
                      </label>
                      <select
                        value={formClass}
                        onChange={(e) => setFormClass(e.target.value)}
                        className="w-full h-10 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Class 9">Class 9th</option>
                        <option value="Class 10">Class 10th</option>
                        <option value="Class 11">Class 11th</option>
                        <option value="Class 12">Class 12th</option>
                        <option value="CUET UG">CUET (UG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Stream / Goal
                      </label>
                      <select
                        value={formStream}
                        onChange={(e) => setFormStream(e.target.value)}
                        className="w-full h-10 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Science">Science (PCM/B)</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Humanities">Humanities</option>
                        <option value="Foundation">All Subjects (9-10)</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 mt-2 rounded-[8px] font-bold text-sm bg-[#102A68] hover:bg-[#0B1E4B] text-white shadow-md cursor-pointer transition-all"
                  >
                    {isSubmitting ? 'Reserving Your Seat...' : `Confirm Demo at ${branch.shortName}`}
                  </Button>
                </form>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Free & No Obligation
                </span>
                <a href={`tel:${branch.phone}`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                  Or Call {branch.phone}
                </a>
              </div>
            </div>

            {/* Right: Map & Location Directions */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-[22px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-7">
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#102A68] dark:text-white">
                      Google Maps & Directions
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Navigate seamlessly to {branch.shortName} via GPS.
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-[8px] text-xs font-bold text-[#102A68] dark:text-blue-300 border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
                  >
                    <Link href={branch.mapLink} target="_blank" rel="noopener noreferrer">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      Get Live Directions
                    </Link>
                  </Button>
                </div>

                {/* Map Iframe */}
                <div className="relative w-full h-[280px] sm:h-[340px] rounded-[16px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <iframe
                    title={`${branch.name} Map Location`}
                    src={`https://maps.google.com/maps?q=${branch.mapEmbedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Map Footer Note */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Nearest: <strong>{branch.nearestMetro}</strong> ({branch.metroLine})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Pin: <strong>{branch.pincode}</strong> (Delhi)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQS) ──────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">HAVE QUESTIONS?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A68] dark:text-white tracking-tight mt-1">
              Frequently Asked Questions: {branch.shortName}
            </h2>
          </div>

          <div className="space-y-3">
            {branch.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXPLORE OTHER IDL BRANCHES IN DELHI ────────────────────── */}
      <section className="py-12 sm:py-16 border-t border-slate-100 dark:border-slate-800/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider">OTHER CENTRES</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A68] dark:text-white tracking-tight mt-1">
                Explore Other IDL Centres Across Delhi
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherBranches.map((other) => (
              <div
                key={other.id}
                className="group rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wide">Delhi Centre</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {other.rating}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#102A68] dark:text-white group-hover:text-blue-600 transition-colors">
                    {other.name}
                  </h3>

                  <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-600 mt-0.5" />
                    <span className="line-clamp-2">{other.fullAddress}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <Train className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span>{other.nearestMetro}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    asChild
                    size="sm"
                    className="w-full h-8.5 rounded-[6px] text-xs font-bold bg-[#102A68] hover:bg-[#0B1E4B] text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Link href={`/branches/${other.slug}`}>
                      View {other.shortName} Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODALS INTEGRATION ─────────────────────────────────────── */}
      <BookDemoModal isOpen={isBookDemoOpen} onOpenChange={setIsBookDemoOpen} />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
      <StudentEnquiryModal isOpen={isEnquiryOpen} onOpenChange={setIsEnquiryOpen} />
    </div>
  );
}
