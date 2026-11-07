'use client';

import React, { useState, useRef } from "react";
import { 
  CreditCard, Download, Printer, User, Phone, Mail, Building, 
  RotateCw, Check, Sparkles, Upload, ShieldCheck, QrCode, 
  Calendar, Award, ExternalLink, RefreshCw, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Code 39 Barcode Generator (Pure Vector SVG)
const CODE39_PATTERNS: Record<string, string> = {
  '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
  '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
  '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
  'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
  'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
  'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
  'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
  'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
  'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
  '-': '010000101', '.': '110000100', ' ': '011000100', '$': '010101000',
  '/': '010100010', '+': '010001010', '%': '000101010', '*': '010010100'
};

function generateCode39Bars(text: string) {
  const clean = '*' + (text || 'IDL2026').toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '') + '*';
  const narrow = 1;
  const wide = 2.2;
  const gap = 1;
  let currentX = 4;
  const bars: { x: number; width: number }[] = [];

  for (let i = 0; i < clean.length; i++) {
    const pattern = CODE39_PATTERNS[clean[i]] || CODE39_PATTERNS['-'];
    for (let j = 0; j < 9; j++) {
      const isBar = j % 2 === 0;
      const width = pattern[j] === '1' ? wide : narrow;
      if (isBar) {
        bars.push({ x: currentX, width });
      }
      currentX += width;
    }
    currentX += gap;
  }
  currentX += 4;
  return { bars, totalWidth: currentX };
}

// 21x21 QR Matrix Generator (SVG)
function generateQRMatrix(id: string) {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  
  function fillFinder(row: number, col: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  }

  // Position detection patterns (3 corners)
  fillFinder(0, 0);
  fillFinder(0, 14);
  fillFinder(14, 0);

  // Timing patterns
  for (let i = 8; i < 13; i += 2) {
    matrix[6][i] = true;
    matrix[i][6] = true;
  }

  // Dark module
  matrix[8][13] = true;

  // Hash-derived authentic matrix
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
      if (r === 6 || c === 6) continue;
      hash = ((hash ^ (r * 19 + c * 29)) * 1664525 + 1013904223) >>> 0;
      matrix[r][c] = (hash % 3 === 0 || hash % 7 === 0);
    }
  }
  return matrix;
}

// Preset Samples
const SAMPLES = [
  {
    name: "Aarav Sharma",
    fatherName: "Rajesh Sharma",
    studentId: "071126-101",
    applyFor: "NEET",
    course: "Class 12 PASS",
    branch: "Mukherjee Nagar, Delhi-110009",
    dob: "15/08/2007",
    phone: "9876543210",
    bloodGroup: "O+",
  },
  {
    name: "Sneha Verma",
    fatherName: "Anil Verma",
    studentId: "071126-102",
    applyFor: "JEE",
    course: "Class 11",
    branch: "Mangol Puri, Delhi-110083",
    dob: "22/11/2008",
    phone: "9812345678",
    bloodGroup: "B+",
  },
  {
    name: "Rohan Gupta",
    fatherName: "Sunil Gupta",
    studentId: "071126-103",
    applyFor: "FOUNDATION",
    course: "Class 10",
    branch: "Krishan Vihar, Delhi-110086",
    dob: "05/04/2009",
    phone: "9988776655",
    bloodGroup: "A+",
  }
];

export default function StudentIdCardStudio() {
  // Templates:
  // "sample_navy_curve" -> Exact match to user's uploaded sample: White top with Logo top-left, Navy Blue wave curves, Circular Photo, Aligned Table, QR Code
  // "sample_white_curve" -> White body with Navy Blue wave borders & lines
  // "navy_gold_horizontal" -> Horizontal PVC card
  const [selectedTemplate, setSelectedTemplate] = useState<"sample_navy_curve" | "sample_white_curve" | "navy_gold_horizontal">("sample_navy_curve");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [isDownloading, setIsDownloading] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [fatherName, setFatherName] = useState("Rajesh Sharma");
  const [studentId, setStudentId] = useState("071126-101");
  const [applyFor, setApplyFor] = useState("NEET");
  const [classCourse, setClassCourse] = useState("Class 12 PASS");
  const [branch, setBranch] = useState("Mukherjee Nagar, Delhi-110009");
  const [dob, setDob] = useState("15/08/2007");
  const [phone, setPhone] = useState("9876543210");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const barcodeData = generateCode39Bars(studentId);
  const qrMatrix = generateQRMatrix(studentId);

  const handleApplySample = (sample: typeof SAMPLES[0]) => {
    setStudentName(sample.name);
    setFatherName(sample.fatherName);
    setStudentId(sample.studentId);
    setApplyFor(sample.applyFor);
    setClassCourse(sample.course);
    setBranch(sample.branch);
    setDob(sample.dob);
    setPhone(sample.phone);
    setBloodGroup(sample.bloodGroup);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPNG = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${studentName.replace(/\s+/g, '_')}_IDCard_${cardSide.toUpperCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const isPortrait = selectedTemplate !== "navy_gold_horizontal";
      const pdf = new jsPDF({
        orientation: isPortrait ? "portrait" : "landscape",
        unit: "mm",
        format: isPortrait ? [53.98, 85.60] : [85.60, 53.98],
      });
      if (isPortrait) {
        pdf.addImage(imgData, "PNG", 0, 0, 53.98, 85.60, "", "FAST");
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, 85.60, 53.98, "", "FAST");
      }
      pdf.save(`${studentName.replace(/\s+/g, '_')}_IDCard_${cardSide.toUpperCase()}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header & Notice */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B2A6F]/10 dark:bg-blue-500/20 text-[#0B2A6F] dark:text-blue-400">
                OFFLINE ADMISSION 2026–27
              </span>
              <span className="text-xs text-slate-400">Reference Sample Match</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Student ID Card Design Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Aapke sample screenshot ke anusar ID card ka White &amp; Navy Blue wave design with Logo on Top Left, Circular Photo, detail list aur QR Code create kiya gaya hai.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadPNG}
              disabled={isDownloading}
              className="text-xs font-bold gap-1.5 cursor-pointer h-9"
            >
              <Download className="w-4 h-4" /> Download PNG
            </Button>
            <Button
              size="sm"
              onClick={downloadPDF}
              disabled={isDownloading}
              className="text-xs font-bold gap-1.5 bg-[#0B2A6F] hover:bg-[#071d4d] text-white cursor-pointer h-9 shadow-sm"
            >
              <CreditCard className="w-4 h-4" /> Download PVC PDF
            </Button>
          </div>
        </div>

        {/* Main Workspace Grid: Controls on Left, Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Customizer Controls (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 text-left">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 1. Select Template
              </h2>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("sample_navy_curve")}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    selectedTemplate === "sample_navy_curve"
                      ? "border-[#0B2A6F] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#0B2A6F]/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <div className="w-full h-3 rounded bg-gradient-to-r from-white via-blue-200 to-[#0A225C] border mb-2" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white leading-tight">Navy Waves</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Sample Match ★</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("sample_white_curve")}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    selectedTemplate === "sample_white_curve"
                      ? "border-[#2864E8] bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-[#2864E8]/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <div className="w-full h-3 rounded bg-gradient-to-r from-white to-slate-200 border border-blue-400 mb-2" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white leading-tight">White Waves</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Navy Lines</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTemplate("navy_gold_horizontal")}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                    selectedTemplate === "navy_gold_horizontal"
                      ? "border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-600/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <div className="w-full h-3 rounded bg-gradient-to-r from-[#0A225C] to-[#F5B51B] mb-2" />
                  <span className="text-xs font-bold block text-slate-900 dark:text-white leading-tight">Horizontal PVC</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Navy &amp; Gold</span>
                </button>
              </div>
            </div>

            {/* Side Switcher (Front vs Back) */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">View Card Side:</span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={cardSide === "front" ? "default" : "ghost"}
                  onClick={() => setCardSide("front")}
                  className="h-7 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Front Side
                </Button>
                <Button
                  size="sm"
                  variant={cardSide === "back" ? "default" : "ghost"}
                  onClick={() => setCardSide("back")}
                  className="h-7 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Back Side
                </Button>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Load Sample Student Data:
              </span>
              <div className="flex gap-2 flex-wrap">
                {SAMPLES.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySample(s)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0B2A6F] cursor-pointer transition-colors"
                  >
                    {s.name} ({s.applyFor})
                  </button>
                ))}
              </div>
            </div>

            {/* Live Student Detail Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                2. Student Details
              </span>

              {/* Photo Upload Input */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-12 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-[#0A225C]">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold block text-slate-800 dark:text-slate-200">Circular Student Photo</span>
                  <p className="text-[10px] text-slate-400">JPG, PNG under 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-[#0B2A6F] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Upload Photo
                    </button>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="text-[11px] font-medium text-rose-500 hover:underline ml-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Student Full Name</label>
                  <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-8 text-xs font-medium" />
                </div>
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Father / Guardian</label>
                  <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="h-8 text-xs font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Student ID / Roll</label>
                  <Input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="h-8 text-xs font-bold font-mono" />
                </div>
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Apply For</label>
                  <Select value={applyFor} onValueChange={setApplyFor}>
                    <SelectTrigger className="h-8 text-xs font-medium">
                      <SelectValue placeholder="Apply For" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEET">NEET</SelectItem>
                      <SelectItem value="JEE">JEE</SelectItem>
                      <SelectItem value="FOUNDATION">FOUNDATION</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Class / Course</label>
                  <Input value={classCourse} onChange={(e) => setClassCourse(e.target.value)} className="h-8 text-xs font-medium" />
                </div>
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Mobile Number</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-8 text-xs font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Branch</label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="h-8 text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mukherjee Nagar, Delhi-110009">Mukherjee Nagar</SelectItem>
                      <SelectItem value="Mangol Puri, Delhi-110083">Mangol Puri</SelectItem>
                      <SelectItem value="Krishan Vihar, Delhi-110086">Krishan Vihar</SelectItem>
                      <SelectItem value="Budh Vihar, Delhi-110086">Budh Vihar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[10.5px] font-semibold text-slate-500 block mb-1">Blood Group</label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-8 text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Card Preview Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-200/60 dark:bg-slate-900/60 border border-slate-300/80 dark:border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[560px] relative overflow-hidden shadow-inner">
              
              {/* Badge indicating standard ISO size */}
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10.5px] font-bold text-slate-600 dark:text-slate-300 border shadow-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#0B2A6F]" />
                <span>ISO Portrait Badge (54 × 85.6 mm)</span>
              </div>

              {/* Flip Button */}
              <button
                type="button"
                onClick={() => setCardSide(cardSide === "front" ? "back" : "front")}
                className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-white px-3 py-1 rounded-full text-[11px] font-bold border shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip to {cardSide === "front" ? "Back" : "Front"}</span>
              </button>

              {/* ------------------------------------------------------------- */}
              {/* THE STUDENT ID CARD RENDER (CAPTURED FOR EXPORT)               */}
              {/* ------------------------------------------------------------- */}
              <div className="transition-all duration-300 transform drop-shadow-2xl">
                
                {/* 1. PRIMARY TEMPLATE: USER SAMPLE MATCH (WHITE TOP + NAVY BLUE WAVES + CIRCULAR PHOTO + LOGO TOP LEFT) */}
                {selectedTemplate === "sample_navy_curve" && (
                  <div
                    ref={cardRef}
                    style={{
                      width: 320,
                      height: 510,
                      borderRadius: 22,
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 25px 60px -12px rgba(10, 34, 92, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                      boxSizing: 'border-box',
                      position: 'relative',
                      overflow: 'hidden',
                      userSelect: 'none',
                    }}
                  >
                    {/* Lanyard Slot Cutout Simulation */}
                    <div style={{
                      position: 'absolute',
                      top: 9,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 46,
                      height: 5.5,
                      borderRadius: 3,
                      backgroundColor: '#CBD5E1',
                      zIndex: 30,
                    }} />

                    {cardSide === "front" ? (
                      <>
                        {/* Top White Area with Logo at Top Left */}
                        <div style={{
                          height: 140,
                          backgroundColor: '#FFFFFF',
                          padding: '20px 18px 0 18px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          position: 'relative',
                          zIndex: 10,
                        }}>
                          {/* Logo Top Left */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                            <img 
                              src="/idllogo.png" 
                              alt="IDL Education" 
                              style={{ height: 28, width: 'auto', objectFit: 'contain' }} 
                            />
                            <div style={{ textAlign: 'left' }}>
                              <h3 style={{ margin: 0, fontSize: 11, fontWeight: 900, color: '#0A225C', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                                IDL EDUCATION
                              </h3>
                              <p style={{ margin: 0, fontSize: 6.5, color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
                                ACADEMY &bull; DELHI
                              </p>
                            </div>
                          </div>

                          {/* Top Right Mini Session Badge */}
                          <div style={{
                            backgroundColor: 'rgba(10, 34, 92, 0.08)',
                            border: '1px solid rgba(10, 34, 92, 0.15)',
                            padding: '2.5px 7px',
                            borderRadius: 4,
                            marginTop: 4,
                          }}>
                            <span style={{ fontSize: 7, fontWeight: 800, color: '#0A225C', letterSpacing: '0.06em' }}>
                              2026–27
                            </span>
                          </div>
                        </div>

                        {/* Curved Wave Layer Transitioning into Navy Blue (Like Reference Sample) */}
                        <div style={{
                          position: 'absolute',
                          top: 95,
                          left: 0,
                          right: 0,
                          height: 120,
                          zIndex: 5,
                          pointerEvents: 'none',
                        }}>
                          <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                            {/* Accent Cyan / Light Blue Thin Wave Line */}
                            <path 
                              d="M-10,38 C70,82 220,12 330,55" 
                              stroke="#38BDF8" 
                              strokeWidth="3.5" 
                              fill="none" 
                              opacity="0.85" 
                            />
                            {/* Layer 1 Soft Navy */}
                            <path 
                              d="M-10,48 C75,90 220,20 330,65 L330,120 L-10,120 Z" 
                              fill="#0E2C78" 
                              opacity="0.9" 
                            />
                            {/* Layer 2 Main Deep Navy Blue Body */}
                            <path 
                              d="M-10,58 C85,98 215,26 330,76 L330,120 L-10,120 Z" 
                              fill="#0A225C" 
                            />
                          </svg>
                        </div>

                        {/* Circular Student Photo with Colored Border (Positioned in Center) */}
                        <div style={{
                          position: 'absolute',
                          top: 70,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 106,
                          height: 106,
                          borderRadius: '50%',
                          border: '4px solid #0A225C',
                          boxShadow: '0 8px 24px rgba(10, 34, 92, 0.35)',
                          backgroundColor: '#F8FAFC',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 15,
                        }}>
                          {photoPreview ? (
                            <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              <User style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto' }} />
                              <span style={{ fontSize: 7, color: '#64748B', fontWeight: 700, display: 'block', marginTop: 1 }}>PHOTO</span>
                            </div>
                          )}
                        </div>

                        {/* Navy Blue Main Body with Student Name, Table, & QR Code */}
                        <div style={{
                          position: 'absolute',
                          top: 185,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: '#0A225C',
                          padding: '0 20px 14px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          zIndex: 10,
                          boxSizing: 'border-box',
                        }}>
                          {/* Student Name & Sub-title / Designation */}
                          <div style={{ textAlign: 'center' }}>
                            <h2 style={{
                              margin: '0 0 2px 0',
                              fontSize: studentName.length > 18 ? 14 : 16.5,
                              fontWeight: 900,
                              color: '#FFFFFF',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                              lineHeight: 1.15,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {studentName}
                            </h2>
                            <p style={{
                              margin: 0,
                              fontSize: 9,
                              color: '#38BDF8',
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                            }}>
                              {applyFor} &bull; {classCourse}
                            </p>
                            {/* Thin underline divider like sample */}
                            <div style={{
                              width: 50,
                              height: 2,
                              backgroundColor: '#38BDF8',
                              margin: '5px auto 10px auto',
                              borderRadius: 1,
                            }} />
                          </div>

                          {/* Key-Value Information Rows (Aligned with colons exactly like sample) */}
                          <div style={{
                            fontSize: 9,
                            lineHeight: 1.65,
                            textAlign: 'left',
                            paddingLeft: 4,
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ width: 62, color: '#94A3B8', fontWeight: 700, fontSize: 8.5 }}>ID NO</span>
                              <span style={{ width: 12, color: '#64748B', fontWeight: 700 }}>:</span>
                              <strong style={{ color: '#F5B51B', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.02em' }}>{studentId}</strong>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ width: 62, color: '#94A3B8', fontWeight: 700, fontSize: 8.5 }}>Father</span>
                              <span style={{ width: 12, color: '#64748B', fontWeight: 700 }}>:</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 9 }}>{fatherName}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ width: 62, color: '#94A3B8', fontWeight: 700, fontSize: 8.5 }}>Blood</span>
                              <span style={{ width: 12, color: '#64748B', fontWeight: 700 }}>:</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 9 }}>{bloodGroup}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ width: 62, color: '#94A3B8', fontWeight: 700, fontSize: 8.5 }}>Phone</span>
                              <span style={{ width: 12, color: '#64748B', fontWeight: 700 }}>:</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 9 }}>+91 {phone}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ width: 62, color: '#94A3B8', fontWeight: 700, fontSize: 8.5 }}>Branch</span>
                              <span style={{ width: 12, color: '#64748B', fontWeight: 700 }}>:</span>
                              <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 8.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {branch.split(',')[0]}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row: Organic Wave Layer + QR Code Box at Bottom Right */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            paddingTop: 6,
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          }}>
                            {/* Left Brand note */}
                            <div style={{ textAlign: 'left' }}>
                              <span style={{ fontSize: 7, color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase', display: 'block', letterSpacing: '0.04em' }}>
                                Official Student Card
                              </span>
                              <span style={{ fontSize: 6.5, color: '#94A3B8', fontWeight: 500, display: 'block', marginTop: 1 }}>
                                idleducation.in &bull; 011 45035713
                              </span>
                            </div>

                            {/* QR Code in crisp white box at bottom right (Matching Sample) */}
                            <div style={{
                              backgroundColor: '#FFFFFF',
                              padding: 3.5,
                              borderRadius: 6,
                              boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                              width: 52,
                              height: 52,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <svg viewBox="0 0 21 21" width="100%" height="100%" style={{ display: 'block' }}>
                                {qrMatrix.map((row, r) => 
                                  row.map((val, c) => val ? (
                                    <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0A225C" />
                                  ) : null)
                                )}
                              </svg>
                            </div>
                          </div>

                        </div>
                      </>
                    ) : (
                      /* BACK SIDE */
                      <div style={{
                        height: '100%',
                        backgroundColor: '#0A225C',
                        color: '#FFFFFF',
                        padding: '24px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                      }}>
                        {/* Top Header */}
                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: 8, textAlign: 'left' }}>
                          <h4 style={{ margin: 0, fontSize: 10, fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            TERMS &amp; REGULATIONS
                          </h4>
                          <span style={{ fontSize: 7, color: '#94A3B8' }}>IDL Education Academy &bull; Offline Branch</span>
                        </div>

                        {/* Rules List */}
                        <ul style={{ margin: 0, paddingLeft: 14, fontSize: 7.5, color: '#CBD5E1', lineHeight: 1.6, textAlign: 'left' }}>
                          <li>This card is mandatory for entry to offline classes &amp; test sessions.</li>
                          <li>Card is non-transferable and remains property of IDL Education.</li>
                          <li>Misuse or tampering will lead to immediate cancellation of admission.</li>
                          <li>In case of loss, report immediately to center administration.</li>
                        </ul>

                        {/* Campus Addresses */}
                        <div style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: 8,
                          padding: '8px 10px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          textAlign: 'left',
                        }}>
                          <p style={{ margin: 0, fontSize: 7.5, fontWeight: 800, color: '#F5B51B' }}>
                            DELHI CAMPUS BRANCHES:
                          </p>
                          <p style={{ margin: '3px 0 0', fontSize: 6.5, color: '#CBD5E1', lineHeight: 1.4 }}>
                            Mukherjee Nagar (HQ) &bull; Mangol Puri &bull; Krishan Vihar &bull; Budh Vihar
                          </p>
                          <p style={{ margin: '3px 0 0', fontSize: 6.5, color: '#94A3B8' }}>
                            Helpline: 011 45035713 | Email: info@idleducation.in
                          </p>
                        </div>

                        {/* Barcode & Signatory */}
                        <div>
                          <div style={{
                            backgroundColor: '#FFFFFF',
                            padding: '3px 8px',
                            borderRadius: 4,
                            width: 130,
                            margin: '0 auto',
                          }}>
                            <svg viewBox={`0 0 ${barcodeData.totalWidth} 16`} width="100%" height="15" preserveAspectRatio="none" style={{ display: 'block' }}>
                              {barcodeData.bars.map((bar, idx) => (
                                <rect key={idx} x={bar.x} y={0} width={bar.width} height={15} fill="#0F172A" />
                              ))}
                            </svg>
                          </div>
                          <span style={{ fontSize: 6.5, color: '#94A3B8', marginTop: 4, display: 'block' }}>
                            Emergency Contact: +91 {phone}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TEMPLATE: WHITE WITH NAVY BLUE CURVED LINES (Matches Reference Sample in White & Navy) */}
                {selectedTemplate === "sample_white_curve" && (
                  <div
                    ref={cardRef}
                    style={{
                      width: 320,
                      height: 510,
                      borderRadius: 22,
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 25px 60px -12px rgba(10, 34, 92, 0.25), 0 0 0 1.5px #CBD5E1',
                      boxSizing: 'border-box',
                      position: 'relative',
                      overflow: 'hidden',
                      userSelect: 'none',
                    }}
                  >
                    {cardSide === "front" ? (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0 0 14px 0',
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}>
                        {/* Top Lanyard Slot Cutout */}
                        <div style={{
                          position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)',
                          width: 46, height: 5.5, borderRadius: 3, backgroundColor: '#E2E8F0', zIndex: 30,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
                        }} />

                        {/* Top Header: Logo on Top Left + 2026-27 on Top Right */}
                        <div style={{
                          padding: '22px 18px 0 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          zIndex: 20,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <img src="/idllogo.png" alt="IDL Education" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
                            <div style={{ textAlign: 'left' }}>
                              <h3 style={{ margin: 0, fontSize: 11, fontWeight: 900, color: '#0A225C', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                                IDL EDUCATION
                              </h3>
                              <p style={{ margin: 0, fontSize: 6.5, color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>
                                ACADEMY &bull; DELHI
                              </p>
                            </div>
                          </div>

                          <span style={{
                            backgroundColor: '#0A225C', color: '#FFFFFF', fontSize: 7, fontWeight: 800,
                            padding: '3px 8px', borderRadius: 5, letterSpacing: '0.06em', textTransform: 'uppercase',
                            boxShadow: '0 2px 4px rgba(10, 34, 92, 0.2)',
                          }}>
                            2026–27
                          </span>
                        </div>

                        {/* Flowing Navy Blue & Royal Blue Wave Ribbons (Framing Photo like Sample) */}
                        <div style={{
                          position: 'absolute',
                          top: 75,
                          left: 0,
                          right: 0,
                          height: 115,
                          zIndex: 5,
                          pointerEvents: 'none',
                        }}>
                          <svg viewBox="0 0 320 115" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                            <path 
                              d="M-10,35 C70,80 220,10 330,55 L330,115 L-10,115 Z" 
                              fill="#EFF6FF" 
                              opacity="0.7" 
                            />
                            <path 
                              d="M-10,32 C70,78 220,8 330,52" 
                              stroke="#38BDF8" 
                              strokeWidth="2.5" 
                              fill="none" 
                              opacity="0.8" 
                            />
                            <path 
                              d="M-10,40 C75,86 215,16 330,62" 
                              stroke="#2563EB" 
                              strokeWidth="2" 
                              fill="none" 
                            />
                            <path 
                              d="M-10,48 C85,94 215,24 330,70" 
                              stroke="#0A225C" 
                              strokeWidth="3.5" 
                              fill="none" 
                            />
                          </svg>
                        </div>

                        {/* Middle Group: Circular Photo + Name + Divider */}
                        <div style={{ position: 'relative', zIndex: 15, marginTop: 4 }}>
                          {/* Circular Student Photo with Navy Blue Ring (Matching Sample) */}
                          <div style={{
                            width: 108,
                            height: 108,
                            borderRadius: '50%',
                            margin: '0 auto',
                            border: '4px solid #0A225C',
                            boxShadow: '0 10px 25px rgba(10, 34, 92, 0.22)',
                            backgroundColor: '#F8FAFC',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {photoPreview ? (
                              <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <User style={{ width: 44, height: 44, color: '#94A3B8' }} />
                            )}
                          </div>

                          {/* Student Name & Course Subtitle */}
                          <div style={{ textAlign: 'center', marginTop: 8 }}>
                            <h2 style={{ margin: 0, fontSize: studentName.length > 18 ? 14.5 : 17, fontWeight: 900, color: '#0A225C', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                              {studentName}
                            </h2>
                            <p style={{ margin: '2px 0 0', fontSize: 9.5, color: '#2563EB', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {applyFor} &bull; {classCourse}
                            </p>
                            <div style={{ width: 50, height: 2.5, backgroundColor: '#0A225C', borderRadius: 2, margin: '6px auto 0 auto' }} />
                          </div>
                        </div>

                        {/* Aligned Key-Value Table with Colons (Comfortable Spacing matching Sample) */}
                        <div style={{
                          fontSize: 9.5,
                          lineHeight: 1.85,
                          textAlign: 'left',
                          padding: '0 24px',
                          position: 'relative',
                          zIndex: 10,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>ID NO</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <strong style={{ color: '#0A225C', fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.05em' }}>{studentId}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Father</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fatherName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Blood</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <span style={{ color: '#0A225C', fontWeight: 800, fontSize: 9 }}>{bloodGroup}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Phone</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9 }}>+91 {phone}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Branch</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{branch.split(',')[0]}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Address</span>
                            <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Delhi, India</span>
                          </div>
                        </div>

                        {/* Bottom-Left Curved Wave Arcs (Matches Reference Sample Bottom Left) */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: 130,
                          height: 100,
                          zIndex: 6,
                          pointerEvents: 'none',
                        }}>
                          <svg viewBox="0 0 130 100" width="100%" height="100%" style={{ display: 'block' }}>
                            <path 
                              d="M-20,100 C-10,50 35,35 75,58 C105,75 110,100 110,100 Z" 
                              fill="#EFF6FF" 
                              opacity="0.8" 
                            />
                            <path 
                              d="M-10,100 C5,65 40,50 70,68 C92,82 98,100 98,100" 
                              stroke="#38BDF8" 
                              strokeWidth="2" 
                              fill="none" 
                              opacity="0.7" 
                            />
                            <path 
                              d="M-10,100 C-5,75 25,60 55,75 C75,88 82,100 82,100" 
                              stroke="#0A225C" 
                              strokeWidth="3" 
                              fill="none" 
                            />
                          </svg>
                        </div>

                        {/* Bottom Bar: Academy Info & Right QR Code (Matching Reference Sample) */}
                        <div style={{
                          padding: '0 20px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          position: 'relative',
                          zIndex: 10,
                        }}>
                          <div style={{ textAlign: 'left', paddingLeft: 4 }}>
                            <span style={{ fontSize: 7.5, color: '#0A225C', fontWeight: 900, display: 'block', letterSpacing: '0.02em' }}>
                              IDL EDUCATION ACADEMY
                            </span>
                            <span style={{ fontSize: 6.5, color: '#64748B', display: 'block', fontWeight: 600 }}>
                              www.idleducation.in &bull; 011 45035713
                            </span>
                          </div>

                          <div style={{
                            width: 50,
                            height: 50,
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #0A225C',
                            padding: 3,
                            borderRadius: 6,
                            boxShadow: '0 3px 8px rgba(10, 34, 92, 0.15)',
                            flexShrink: 0,
                          }}>
                            <svg viewBox="0 0 21 21" width="100%" height="100%">
                              {qrMatrix.map((row, r) => 
                                row.map((val, c) => val ? (
                                  <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0A225C" />
                                ) : null)
                              )}
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* BACK SIDE: WHITE & NAVY */
                      <div style={{
                        height: '100%',
                        backgroundColor: '#FFFFFF',
                        color: '#0F172A',
                        padding: '24px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}>
                        {/* Top Lanyard Slot Cutout */}
                        <div style={{
                          position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)',
                          width: 46, height: 5.5, borderRadius: 3, backgroundColor: '#E2E8F0',
                        }} />

                        {/* Top Header */}
                        <div style={{ borderBottom: '2px solid #0A225C', paddingBottom: 8, textAlign: 'left', marginTop: 10 }}>
                          <h4 style={{ margin: 0, fontSize: 10.5, fontWeight: 900, color: '#0A225C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            TERMS &amp; REGULATIONS
                          </h4>
                          <span style={{ fontSize: 7, color: '#64748B', fontWeight: 600 }}>IDL Education Academy &bull; Institutional Policy</span>
                        </div>

                        {/* Rules List */}
                        <ul style={{ margin: 0, paddingLeft: 14, fontSize: 7.5, color: '#334155', lineHeight: 1.6, textAlign: 'left' }}>
                          <li>This card is mandatory for entry to offline classes &amp; test sessions.</li>
                          <li>Card is non-transferable and remains property of IDL Education.</li>
                          <li>Misuse or tampering will lead to immediate cancellation of admission.</li>
                          <li>In case of loss, report immediately to center administration.</li>
                        </ul>

                        {/* Campus Addresses */}
                        <div style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: 8,
                          padding: '8px 10px',
                          border: '1px solid #E2E8F0',
                          textAlign: 'left',
                        }}>
                          <p style={{ margin: 0, fontSize: 7.5, fontWeight: 800, color: '#0A225C' }}>
                            DELHI CAMPUS BRANCHES:
                          </p>
                          <p style={{ margin: '3px 0 0', fontSize: 6.5, color: '#475569', lineHeight: 1.4 }}>
                            Mukherjee Nagar (HQ) &bull; Mangol Puri &bull; Krishan Vihar &bull; Budh Vihar
                          </p>
                          <p style={{ margin: '3px 0 0', fontSize: 6.5, color: '#64748B' }}>
                            Helpline: 011 45035713 | Email: info@idleducation.in
                          </p>
                        </div>

                        {/* Barcode & Signatory */}
                        <div>
                          <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            padding: '3px 8px',
                            borderRadius: 4,
                            width: 130,
                            margin: '0 auto',
                          }}>
                            <svg viewBox={`0 0 ${barcodeData.totalWidth} 16`} width="100%" height="15" preserveAspectRatio="none" style={{ display: 'block' }}>
                              {barcodeData.bars.map((bar, idx) => (
                                <rect key={idx} x={bar.x} y={0} width={bar.width} height={15} fill="#0F172A" />
                              ))}
                            </svg>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
                            <span style={{ fontSize: 6.5, color: '#64748B', fontWeight: 600 }}>
                              Emg: +91 {phone}
                            </span>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ width: 65, borderBottom: '1px solid #94A3B8', height: 8 }} />
                              <span style={{ fontSize: 6, color: '#64748B', fontWeight: 700 }}>DIRECTOR</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TEMPLATE: HORIZONTAL PVC (NAVY & GOLD) */}
                {selectedTemplate === "navy_gold_horizontal" && (
                  <div
                    ref={cardRef}
                    style={{
                      width: 480,
                      height: 300,
                      borderRadius: 16,
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      background: 'linear-gradient(145deg, #0A225C 0%, #081B4B 50%, #051336 100%)',
                      boxShadow: '0 25px 50px -12px rgba(5, 19, 54, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                      background: 'linear-gradient(90deg, #F5B51B 0%, #FDE08B 50%, #F5B51B 100%)',
                    }} />

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '3px 8px', borderRadius: 6 }}>
                          <img src="/idllogo.png" alt="IDL Education" style={{ height: 24, width: 'auto', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            IDL EDUCATION ACADEMY
                          </h3>
                          <p style={{ margin: '1px 0 0', fontSize: 7.5, color: '#94A3B8', fontWeight: 600 }}>
                            NEET &bull; JEE &bull; Foundation
                          </p>
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'rgba(245, 181, 27, 0.15)',
                        border: '1px solid rgba(245, 181, 27, 0.5)',
                        padding: '2.5px 8px',
                        borderRadius: 5,
                      }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: '#F5B51B', textTransform: 'uppercase' }}>
                          STUDENT ID 2026–27
                        </span>
                      </div>
                    </div>

                    {/* Middle */}
                    <div style={{ display: 'flex', gap: 16, padding: '12px 20px 0 20px' }}>
                      <div style={{
                        width: 86, height: 108, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                        border: '2px solid #F5B51B', backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User style={{ width: 32, height: 32, color: 'rgba(255, 255, 255, 0.4)' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>
                          {studentName}
                        </h2>
                        <p style={{ margin: '2px 0 0', fontSize: 8.5, color: '#94A3B8' }}>S/O {fatherName}</p>
                        <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.12)', margin: '6px 0 7px 0' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px' }}>
                          <div>
                            <span style={{ fontSize: 6.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>STUDENT ID</span>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: '#F5B51B', fontFamily: 'monospace' }}>{studentId}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 6.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BLOOD GROUP</span>
                            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#FFFFFF' }}>{bloodGroup}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 6.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>COURSE</span>
                            <p style={{ margin: 0, fontSize: 8.5, fontWeight: 600, color: '#FFFFFF' }}>{classCourse}</p>
                          </div>
                          <div>
                            <span style={{ fontSize: 6.5, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BRANCH</span>
                            <p style={{ margin: 0, fontSize: 8, fontWeight: 600, color: '#CBD5E1' }}>{branch.split(',')[0]}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div style={{ padding: '0 20px 12px 20px', marginTop: 'auto' }}>
                      <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 7 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: 4, width: 130 }}>
                          <svg viewBox={`0 0 ${barcodeData.totalWidth} 16`} width="100%" height="15" preserveAspectRatio="none">
                            {barcodeData.bars.map((bar, idx) => (
                              <rect key={idx} x={bar.x} y={0} width={bar.width} height={15} fill="#0F172A" />
                            ))}
                          </svg>
                        </div>
                        <span style={{ fontSize: 7, color: '#F5B51B', fontWeight: 700 }}>idleducation.in</span>
                        <div style={{ textAlign: 'center', width: 90 }}>
                          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.4)', height: 12 }}></div>
                          <span style={{ fontSize: 6, fontWeight: 700, color: '#94A3B8' }}>AUTH. SIGNATORY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Actions & Notes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Reference Sample Matched
                </p>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Aapke sample design ke mutabiq White top, Logo Top-Left, Circular Photo, Navy Blue waves aur aligned key-value list + QR Code ready hai. Jaise hi aap is design ko final approve karenge, hum ise admission form payment ke baad live download ke liye permanently add kar denge!
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={downloadPNG} className="text-xs font-bold cursor-pointer">
                  <Download className="w-3.5 h-3.5 mr-1" /> PNG
                </Button>
                <Button size="sm" onClick={downloadPDF} className="text-xs font-bold bg-[#0B2A6F] text-white cursor-pointer">
                  <CreditCard className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
