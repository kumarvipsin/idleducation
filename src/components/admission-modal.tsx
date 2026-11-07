'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, 
  FileText, Edit, Download, Camera, ArrowRight, ArrowLeft,
  CheckCircle2, Lock, ShieldCheck, Globe, Trash2, Check,
  Calendar, MapPin, Briefcase, Send, Heart, X, CreditCard, Printer,
  Crop, RotateCw, ZoomIn, ZoomOut, Upload, Users, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getNextStudentId, submitAdmissionForm, createRazorpayOrder } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { PhotoCropModal } from "@/components/admission/photo-crop-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, getDaysInMonth } from "date-fns";
import Script from "next/script";
import { cn } from "@/lib/utils";

const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;
const aadharRegex = /^\d{12}$/;

const indianStates = [
  "Delhi"
];

const branches = [
  "Mukherjee Nagar, Delhi-110009",
  "Mangol Puri, Delhi-110083",
  "Krishan Vihar, Delhi-110086",
  "Budh Vihar, Delhi-110086"
];

const classes = [
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Class 12 PASS"
];
const programs = [
  "Foundation",
  "JEE",
  "NEET",
  "CUET",
  "Olympiad",
  "School Classes",
];

const boards = [
  "CBSE",
  "ICSE / ISC",
  "State Board",
  "IB / Cambridge",
  "Other",
];

const previousClasses = [
  "Class 5th",
  "Class 6th",
  "Class 7th",
  "Class 8th",
  "Class 9th",
  "Class 10th",
  "Class 11th",
  "Class 12th",
  "Other",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const admissionFormSchema = z.object({
  // STEP 1 — BRANCH
  studentId: z.string(),
  admissionSession: z.string().default('2026–27'),
  branch: z.string().min(1, { message: "Please select preferred branch." }),
  studentPhoto: z.any().optional(),

  // STEP 2 — STUDENT
  studentName: z.string().min(2, { message: "Student full name is required (min 2 letters)." }),
  dob: z.date({
    required_error: "Date of birth is required.",
  }).refine((dob) => {
    const today = new Date();
    const threeYearsAgo = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    return dob <= threeYearsAgo;
  }, { message: "Student must be at least 3 years old." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select gender." }),
  classApplied: z.string().min(1, { message: "Please select class / course." }),
  board: z.string().optional().or(z.literal('')),
  program: z.string().optional().or(z.literal('')),
  studentPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }).optional().or(z.literal('')),

  // STEP 3 — PARENT
  fatherName: z.string().min(2, { message: "Father / Guardian name is required." }),
  motherName: z.string().optional().or(z.literal('')),
  fatherPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }),
  parentEmail: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  fatherOccupation: z.string().optional().or(z.literal('')),

  // STEP 4 — CONTACT
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  address: z.string().min(5, { message: "Full residential address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(1, { message: "Please select state." }),
  pincode: z.string().regex(pincodeRegex, { message: "Enter a valid 6-digit pincode." }),
  emergencyContact: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit emergency number." }).optional().or(z.literal('')),

  // STEP 5 — ACADEMIC
  previousSchool: z.string().optional().or(z.literal('')),
  previousClass: z.string().optional().or(z.literal('')),
  previousPercentage: z.string().optional().or(z.literal('')),
  stream: z.string().optional().or(z.literal('')),
  scholarshipTest: z.string().optional().or(z.literal('')),

  // Additional & compatibility fields
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
  motherPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }).optional().or(z.literal('')),
  motherOccupation: z.string().optional().or(z.literal('')),
  telephone: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  bloodGroup: z.string().optional().or(z.literal('')),
  aadharNumber: z.string().optional().or(z.literal('')),
  apaarId: z.string().optional().or(z.literal('')),
  additionalInfo: z.string().optional().or(z.literal('')),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i - 3);

const STEPS = [
  { id: 1, title: 'Student', subtitle: 'Student & Branch', icon: User },
  { id: 2, title: 'Parents', subtitle: 'Parents & Contact', icon: Users },
  { id: 3, title: 'Academic', subtitle: 'Academic & Review', icon: GraduationCap },
];

interface AdmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdmissionModal({ isOpen, onOpenChange }: AdmissionModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [idCardLayout, setIdCardLayout] = useState<"portrait_waves" | "horizontal">("portrait_waves");
  const [submittedData, setSubmittedData] = useState<AdmissionFormValues | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const idCardRef = useRef<HTMLDivElement>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Always scroll to top when changing steps so top input is visible
  useEffect(() => {
    const resetScroll = () => {
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
    };
    resetScroll();
    const frame = requestAnimationFrame(resetScroll);
    const timer1 = setTimeout(resetScroll, 50);
    const timer2 = setTimeout(resetScroll, 220);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentStep]);

  // Passport Photo Crop & Position Adjustment States
  const [activeCropImage, setActiveCropImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  
  const daysInMonth = useMemo(() => {
    if (dob.year && dob.month) {
      const monthIndex = months.indexOf(dob.month);
      return getDaysInMonth(new Date(parseInt(dob.year, 10), monthIndex));
    }
    return 31;
  }, [dob.month, dob.year]);

  const availableDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentId: '',
      admissionSession: '2026–27',
      branch: '',
      studentName: '',
      gender: undefined,
      classApplied: '',
      board: '',
      program: '',
      studentPhone: '',
      fatherName: '',
      motherName: '',
      fatherPhone: '',
      parentEmail: '',
      fatherOccupation: '',
      email: '',
      address: '',
      city: '',
      state: 'Delhi',
      pincode: '',
      emergencyContact: '',
      previousSchool: '',
      previousClass: '',
      previousPercentage: '',
      stream: '',
      scholarshipTest: '',
      transactionId: 'N/A',
      motherPhone: '',
      motherOccupation: '',
      telephone: '',
      country: 'India',
      bloodGroup: '',
      aadharNumber: '',
      apaarId: '',
      additionalInfo: '',
    },
  });
  
  useEffect(() => {
    if (dob.day && dob.month && dob.year) {
      const monthIndex = months.indexOf(dob.month);
      if (monthIndex >= 0) {
        const date = new Date(parseInt(dob.year, 10), monthIndex, parseInt(dob.day, 10));
        form.setValue('dob', date, { shouldValidate: true });
      }
    }
  }, [dob, form]);
  
  useEffect(() => {
    if (parseInt(dob.day, 10) > daysInMonth) {
      setDob(d => ({ ...d, day: daysInMonth.toString() }));
    }
  }, [dob.day, daysInMonth]);

  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const blurTimer = setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 50);

      async function fetchStudentId() {
        const result = await getNextStudentId();
        if (result.success && result.studentId) {
          form.setValue('studentId', result.studentId);
        } else {
          form.setValue('studentId', `IDL-${Date.now().toString().slice(-6)}`);
        }
      }
      fetchStudentId();
      return () => clearTimeout(blurTimer);
    } else {
      setCurrentStep(1);
    }
  }, [isOpen, form]);

  const generatePdf = async () => {
    const contentToCapture = previewRef.current;
    if (!contentToCapture) return;

    try {
      const canvas = await html2canvas(contentToCapture, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 794,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight), '', 'FAST');
      pdf.save(`${form.getValues('studentName') || 'Student'}_Admission_Form.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({ variant: "destructive", title: "PDF Generation Failed", description: "Please try again." });
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof AdmissionFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ['branch', 'studentName', 'dob', 'gender', 'classApplied'];
      if (form.getValues('studentPhone')) {
        fieldsToValidate.push('studentPhone');
      }
      if (form.getValues('email')) {
        fieldsToValidate.push('email');
      }
    } else if (step === 2) {
      fieldsToValidate = ['fatherName', 'fatherPhone', 'address', 'city', 'state', 'pincode'];
      if (form.getValues('motherPhone')) {
        fieldsToValidate.push('motherPhone');
      }
      if (form.getValues('parentEmail')) {
        fieldsToValidate.push('parentEmail');
      }
      if (form.getValues('emergencyContact')) {
        fieldsToValidate.push('emergencyContact');
      }
    } else if (step === 3) {
      fieldsToValidate = [];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Required Fields Missing',
        description: 'Please complete all required fields marked with (*).',
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
    }
  };

  // Allow clicking 1, 2, 3 to view any step directly
  const handleStepClick = (targetStep: number) => {
    setCurrentStep(targetStep);
    if (stepContainerRef.current) {
      stepContainerRef.current.scrollTop = 0;
    }
  };

  // Master validation before preview or submit
  const validateCompulsoryFields = async (): Promise<boolean> => {
    // 1. Photo is compulsory
    if (!photoPreview) {
      setPhotoError("Student passport size photo is compulsory (*).");
      setCurrentStep(1);
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
      toast({
        variant: "destructive",
        title: "Photo Required",
        description: "Student passport size photo is compulsory (*). Please upload photo.",
      });
      return false;
    } else {
      setPhotoError(null);
    }

    // 2. Form compulsory fields
    const isBasicValid = await form.trigger([
      "branch",
      "studentName",
      "dob",
      "gender",
      "classApplied",
      "fatherName",
      "fatherPhone",
      "address",
      "city",
      "state",
      "pincode"
    ]);

    // Optional fields format validation if entered
    if (form.getValues('studentPhone')) await form.trigger('studentPhone');
    if (form.getValues('email')) await form.trigger('email');
    if (form.getValues('motherPhone')) await form.trigger('motherPhone');
    if (form.getValues('parentEmail')) await form.trigger('parentEmail');
    if (form.getValues('emergencyContact')) await form.trigger('emergencyContact');

    const errors = form.formState.errors;
    if (!isBasicValid || Object.keys(errors).length > 0) {
      const step1Fields: (keyof AdmissionFormValues)[] = ['branch', 'studentName', 'dob', 'gender', 'classApplied', 'studentPhone', 'email'];
      const step2Fields: (keyof AdmissionFormValues)[] = ['fatherName', 'fatherPhone', 'motherPhone', 'parentEmail', 'emergencyContact', 'address', 'city', 'state', 'pincode'];

      if (step1Fields.some(f => errors[f])) {
        setCurrentStep(1);
      } else if (step2Fields.some(f => errors[f])) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }

      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }

      const firstKey = Object.keys(errors)[0] as keyof AdmissionFormValues;
      const errorMsg = firstKey ? (errors[firstKey]?.message as string) : "Please complete all compulsory fields marked with (*).";
      toast({
        variant: "destructive",
        title: "Compulsory Fields Missing",
        description: errorMsg || "Please fill all required fields before proceeding.",
      });
      return false;
    }

    return true;
  };

  const handlePreview = async () => {
    const isValid = await validateCompulsoryFields();
    if (isValid) {
      setIsPreviewOpen(true);
    }
  };

  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'dob' && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const result = await submitAdmissionForm(formData);

      if (result.success) {
        setSubmittedData({ ...data });
        setIsThankYouOpen(true);
        form.reset();
        setCurrentStep(1);
      } else {
        toast({ variant: "destructive", title: "Submission Failed", description: result.message || "Please check your details and try again." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "A network or server error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await new Promise<boolean>((resolve) => {
        if (typeof window === 'undefined') return resolve(false);
        if ((window as any).Razorpay) return resolve(true);
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(true));
          existingScript.addEventListener('error', () => resolve(false));
          // Check again after 300ms in case already loaded
          setTimeout(() => resolve(!!(window as any).Razorpay), 300);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!isScriptLoaded && !(window as any).Razorpay) {
        toast({ 
          variant: "destructive", 
          title: "Payment Gateway Offline", 
          description: "Could not load Razorpay payment service. Please check your connection and try again." 
        });
        setIsSubmitting(false);
        return;
      }

      // 2. Create Razorpay order (₹10 = 1000 paise)
      const result = await createRazorpayOrder({ amount: 1000, currency: 'INR' });

      if (!result.success || (!result.order && !result.orderId)) {
        toast({ 
          variant: "destructive", 
          title: "Payment Gateway Error", 
          description: result.message || "Could not initialize payment. Please try again or contact support." 
        });
        setIsSubmitting(false);
        return;
      }

      const orderData = result.order || {};
      const orderId = result.orderId || orderData.id;
      const orderAmount = result.amount || orderData.amount || 1000;
      const orderCurrency = result.currency || orderData.currency || 'INR';
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RKEYtYbYMDeMpw";

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: "IDL Education",
        description: "Admission Processing Fee",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const txnId = response.razorpay_payment_id || `TXN-${Date.now().toString().slice(-6)}`;
            form.setValue('transactionId', txnId);
            setIsPaymentDialogOpen(false);
            
            // Direct submission with current validated form values
            const values = form.getValues();
            values.transactionId = txnId;
            await onSubmit(values);
          } catch (submitErr) {
            console.error("Submission failed after payment:", submitErr);
            toast({
              variant: "destructive",
              title: "Saving Error",
              description: "Payment was successful, but form submission encountered an issue. Please contact support.",
            });
          }
        },
        prefill: {
          name: form.getValues('studentName') || '',
          email: form.getValues('email') || '',
          contact: form.getValues('fatherPhone') || form.getValues('studentPhone') || '',
        },
        theme: {
          color: "#0F172A",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (resp: any) {
        toast({ 
          variant: "destructive", 
          title: "Payment Failed", 
          description: resp?.error?.description || "Payment was rejected or cancelled." 
        });
        setIsSubmitting(false);
      });
      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({ 
        variant: "destructive", 
        title: "Payment Error", 
        description: "Payment gateway error. Please try again." 
      });
      setIsSubmitting(false);
    }
  };

  const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatDateForDisplay = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, "dd/MM/yyyy");
  };

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

  const generateCode39Bars = (text: string): { bars: { x: number; width: number }[]; totalWidth: number } => {
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
  };

  const generateQRMatrix = (id: string) => {
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
    fillFinder(0, 0);
    fillFinder(0, 14);
    fillFinder(14, 0);
    for (let i = 8; i < 13; i += 2) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
    matrix[8][13] = true;
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        matrix[r][c] = (hash % 3) === 0;
      }
    }
    return matrix;
  };

  return (
    <>
      <Script id="razorpay-checkout-modal-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Main Admission Popup Modal */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <FormModalDialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          maxWidthClass="max-w-[480px] sm:max-w-[580px] md:max-w-[620px]"
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] rounded-[20px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0"
        >
          {/* Top Heading: Left-aligned, All Capital Letters, Small Font */}
          <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 sm:pr-14 bg-white dark:bg-slate-950 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-0.5 sm:gap-x-2 select-none text-left">
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-slate-700 dark:text-slate-200">
                ADMISSION FORM 2026–27
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-tight sm:whitespace-nowrap">
                (FOR OFFLINE STUDENTS ONLY)
              </span>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Admission Form 2026–27</DialogTitle>
            <DialogDescription>Complete the admission application in 3 simple steps.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">

              {/* Progress Stepper: Clean visual hierarchy matching master theme */}
              <div className="px-4 sm:px-7 pt-3 pb-2.5 sm:pt-3.5 sm:pb-3 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="max-w-[320px] sm:max-w-[360px] mx-auto flex items-center justify-between relative">
                  {/* Background Progress Bar Line */}
                  <div className="absolute left-6 right-6 sm:left-8 sm:right-8 top-3.5 sm:top-4 h-[2px] bg-slate-200/90 dark:bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
                    <div 
                      className="h-full bg-[#2864E8] transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                    />
                  </div>

                  {STEPS.map((s) => {
                    const isCompleted = currentStep > s.id;
                    const isActive = currentStep === s.id;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleStepClick(s.id)}
                        className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                      >
                        <div
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                            isCompleted 
                              ? "bg-[#2864E8] text-white shadow-xs" 
                              : isActive 
                                ? "bg-[#2864E8] text-white ring-4 ring-[#2864E8]/15" 
                                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:border-[#2864E8]/50"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <span>{s.id}</span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mt-1 transition-colors",
                            isActive ? "text-[#2864E8] dark:text-blue-400 font-bold" : isCompleted ? "text-slate-700 dark:text-slate-300 font-medium" : "text-slate-400 dark:text-slate-500 font-medium"
                          )}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Form Body */}
              <div ref={stepContainerRef} className="overflow-y-auto flex-1 min-h-0 overscroll-contain">
                <AnimatePresence mode="wait">
                  {/* STEP 1 — Student & Branch Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3 sm:space-y-3.5 text-left"
                    >
                      {/* Top Section: Left Details + Right Passport Photo */}
                      {/* Top Section: Responsive Grid (Horizontal Card on Mobile, 2-Column Sidebar on Desktop) */}
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_94px] gap-x-4 gap-y-3 sm:gap-y-3.5">
                        {/* Provisional ID: Order 1 on mobile, col 1 row 1 on desktop */}
                        <div className="order-1 sm:order-none sm:col-start-1 sm:row-start-1">
                          <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                              <FormItem className="space-y-0 text-left">
                                <FormLabel className="sr-only">Provisional Student ID</FormLabel>
                                <FormControl>
                                  <div className="flex items-center h-[38px] sm:h-[40px] border-b border-slate-200/90 dark:border-slate-700/80">
                                    <span className="text-[12px] sm:text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 mr-2 shrink-0 select-none">ID:</span>
                                    <Input 
                                      {...field} 
                                      readOnly 
                                      placeholder="Provisional ID"
                                      className="h-full border-0 bg-transparent text-[13px] sm:text-[13.5px] font-bold text-[#2864E8] dark:text-blue-400 font-mono tracking-tight focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-0 cursor-default select-all" 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Photo Upload Area:
                            - Mobile (<sm): order-2, compact horizontal arrangement
                            - Desktop (sm:): sm:col-start-2 sm:row-start-1 sm:row-span-3, vertical 94px passport box
                        */}
                        <div className="order-2 sm:order-none sm:col-start-2 sm:row-start-1 sm:row-span-3">
                          {/* MOBILE VERSION (<sm): Compact horizontal card layout */}
                          <div className="sm:hidden flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Compact Passport Thumbnail */}
                              <div
                                onClick={() => {
                                  if (photoPreview) {
                                    setActiveCropImage(photoPreview);
                                    setIsCropOpen(true);
                                  } else {
                                    fileInputRef.current?.click();
                                  }
                                }}
                                className={cn(
                                  "w-[48px] h-[62px] rounded-[7px] bg-white dark:bg-slate-950 border border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer shadow-xs",
                                  photoError
                                    ? "border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20"
                                    : "border-slate-300 dark:border-slate-700 hover:border-[#2864E8]"
                                )}
                                title={photoPreview ? "Click to crop & adjust photo" : "Click to upload passport photo"}
                              >
                                {photoPreview ? (
                                  <>
                                    <img src={photoPreview} alt="Passport Photo" className="w-full h-full object-cover block" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Crop className="w-3.5 h-3.5" />
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-0.5 p-1 text-center select-none">
                                    <Camera className={cn("w-4 h-4", photoError ? "text-rose-500" : "text-slate-400")} />
                                    <span className="text-[7.5px] text-slate-400 font-mono leading-none">35×45</span>
                                  </div>
                                )}
                              </div>

                              {/* Text Details */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={cn("text-[12px] font-semibold leading-tight", photoError ? "text-rose-600" : "text-slate-700 dark:text-slate-200")}>
                                    Student Photo <span className="text-rose-500">*</span>
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                                  Passport size (35×45mm, JPG/PNG)
                                </p>
                                {photoError && (
                                  <p className="text-[10px] text-rose-500 font-semibold leading-tight mt-0.5">
                                    Photo is compulsory *
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="shrink-0 flex items-center gap-1.5">
                              {photoPreview ? (
                                <>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setActiveCropImage(photoPreview);
                                      setIsCropOpen(true);
                                    }}
                                    className="h-7 px-2 text-[10.5px] font-semibold rounded-[6px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 shadow-none cursor-pointer flex items-center gap-1"
                                  >
                                    <Crop className="w-3 h-3" />
                                    <span>Crop</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-7 px-2 text-[10.5px] font-semibold rounded-[6px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 shadow-none cursor-pointer flex items-center gap-1"
                                  >
                                    <span>Change</span>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="h-7 px-2.5 text-[11px] font-semibold rounded-[6px] border border-blue-200 dark:border-blue-800/60 text-[#2864E8] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 shadow-none cursor-pointer flex items-center gap-1.5"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>Upload</span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* DESKTOP VERSION (sm:): Exact approved vertical 94px passport box */}
                          <div className="hidden sm:flex flex-col items-center justify-start gap-1.5 self-start pt-0.5 w-[94px]">
                            <div
                              onClick={() => {
                                if (photoPreview) {
                                  setActiveCropImage(photoPreview);
                                  setIsCropOpen(true);
                                } else {
                                  fileInputRef.current?.click();
                                }
                              }}
                              className={cn(
                                "w-[94px] aspect-[3.5/4.5] rounded-[9px] bg-slate-50/70 dark:bg-slate-900/60 border border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer shadow-xs",
                                photoError
                                  ? "border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20"
                                  : "border-slate-300 dark:border-slate-700 hover:border-[#2864E8] dark:hover:border-blue-400"
                              )}
                              title={photoPreview ? "Click to crop & adjust photo" : "Click to upload passport photo (Compulsory)"}
                            >
                              {photoPreview ? (
                                <>
                                  <img src={photoPreview} alt="Passport Photo" className="w-full h-full object-cover block" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-semibold uppercase gap-0.5">
                                    <Crop className="w-3.5 h-3.5" />
                                    <span>Adjust</span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-0.5 p-1 text-center select-none">
                                  <Camera className={cn("w-4 h-4 transition-colors", photoError ? "text-rose-500" : "text-slate-400 group-hover:text-[#2864E8]")} />
                                  <span className={cn("text-[9px] font-semibold leading-tight", photoError ? "text-rose-600" : "text-slate-600 dark:text-slate-300")}>Photo *</span>
                                  <span className="text-[7.5px] text-slate-400 font-mono leading-none">35×45mm</span>
                                  {photoError && (
                                    <span className="text-[7.5px] text-rose-500 font-bold leading-none mt-0.5">Required *</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {photoPreview ? (
                              <div className="flex items-center gap-1 w-[94px]">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCropImage(photoPreview);
                                    setIsCropOpen(true);
                                  }}
                                  className="h-6 px-1 text-[10px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-none flex items-center justify-center gap-0.5 flex-1"
                                  title="Crop & adjust photo"
                                >
                                  <Crop className="w-2.5 h-2.5" />
                                  <span>Crop</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                  }}
                                  className="h-6 px-1 text-[10px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-none flex items-center justify-center gap-0.5 flex-1"
                                  title="Change photo"
                                >
                                  <span>Change</span>
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-6 px-2 text-[10.5px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-none flex items-center justify-center gap-1 w-[94px]"
                              >
                                <Upload className="w-2.5 h-2.5" />
                                <span>Upload</span>
                              </Button>
                            )}
                          </div>

                          {/* Shared File Input for both Mobile & Desktop */}
                          <Input
                            id="photo-upload-modal"
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                                if (!validTypes.includes(file.type)) {
                                  toast({
                                    variant: "destructive",
                                    title: "Unsupported format",
                                    description: "Please upload a valid JPG, JPEG, or PNG image.",
                                  });
                                  e.target.value = "";
                                  return;
                                }
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    variant: "destructive",
                                    title: "Image too large",
                                    description: "Photo file size should be less than 10MB.",
                                  });
                                  e.target.value = "";
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const dataUrl = reader.result as string;
                                  setActiveCropImage(dataUrl);
                                  setIsCropOpen(true);
                                };
                                reader.readAsDataURL(file);
                              }
                              e.target.value = "";
                            }}
                          />
                        </div>

                        {/* Preferred Branch *: Full width on mobile, col 1 row 2 on desktop */}
                        <div className="order-3 sm:order-none sm:col-start-1 sm:row-start-2">
                          <FormField
                            control={form.control}
                            name="branch"
                            render={({ field }) => (
                              <FormItem className="space-y-0 text-left">
                                <FormLabel className="sr-only">Preferred Branch</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                                      <SelectValue placeholder="Preferred Branch *" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-56 z-[200]">
                                    {branches.map(b => (
                                      <SelectItem key={b} value={b} className="text-[13px] py-1.5 cursor-pointer font-medium">{b}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Student Full Name *: Full width on mobile, col 1 row 3 on desktop */}
                        <div className="order-4 sm:order-none sm:col-start-1 sm:row-start-3">
                          <FormField
                            control={form.control}
                            name="studentName"
                            render={({ field }) => (
                              <FormItem className="space-y-0 text-left">
                                <FormLabel className="sr-only">Student Full Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Student Full Name *" 
                                    {...field} 
                                    autoFocus={false}
                                    value={field.value}
                                    className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Row 4: Date of Birth * (Day, Month, Year) */}
                      <FormField
                        control={form.control}
                        name="dob"
                        render={() => (
                          <FormItem className="space-y-1 text-left">
                            <div className="flex items-center justify-between pb-0.5">
                              <span className="text-[11.5px] sm:text-[12px] font-medium text-slate-500 dark:text-slate-400">
                                Date of Birth <span className="text-rose-500">*</span>
                              </span>
                            </div>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                                <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-1 sm:px-1 text-[12px] sm:text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-65 [&>svg]:w-3 sm:[&>svg]:w-3.5 [&>svg]:h-3 sm:[&>svg]:h-3.5 [&>svg]:shrink-0 cursor-pointer">
                                    <SelectValue placeholder="Day *" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56 z-[200]">
                                    {availableDays.map(day => <SelectItem key={day} value={String(day)} className="text-[13px] py-1.5 cursor-pointer">{day}</SelectItem>)}
                                  </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-1 sm:px-1 text-[12px] sm:text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-65 [&>svg]:w-3 sm:[&>svg]:w-3.5 [&>svg]:h-3 sm:[&>svg]:h-3.5 [&>svg]:shrink-0 cursor-pointer">
                                    <SelectValue placeholder="Month *" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56 z-[200]">
                                    {months.map(m => <SelectItem key={m} value={m} className="text-[13px] py-1.5 cursor-pointer">{m}</SelectItem>)}
                                  </SelectContent>
                                </Select>

                                <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-1 sm:px-1 text-[12px] sm:text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-65 [&>svg]:w-3 sm:[&>svg]:w-3.5 [&>svg]:h-3 sm:[&>svg]:h-3.5 [&>svg]:shrink-0 cursor-pointer">
                                    <SelectValue placeholder="Year *" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56 z-[200]">
                                    {years.map(y => <SelectItem key={y} value={String(y)} className="text-[13px] py-1.5 cursor-pointer">{y}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                          </FormItem>
                        )}
                      />

                      {/* Row 5: Gender & Class / Course in 2-column grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Gender</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 cursor-pointer">
                                    <SelectValue placeholder="Gender *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="z-[200]">
                                  <SelectItem value="male" className="text-[13px] py-1.5 cursor-pointer">Male</SelectItem>
                                  <SelectItem value="female" className="text-[13px] py-1.5 cursor-pointer">Female</SelectItem>
                                  <SelectItem value="other" className="text-[13px] py-1.5 cursor-pointer">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="classApplied"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Class / Course</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 cursor-pointer">
                                    <SelectValue placeholder="Class / Course *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-56 z-[200]">
                                  {classes.map((c, i) => (
                                    <SelectItem key={`${c}-${i}`} value={c} className="text-[13px] py-1.5 cursor-pointer">{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 6: Student Mobile Number & Student Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="studentPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Student Mobile Number</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center h-[38px] sm:h-[40px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                                  <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                    +91
                                  </span>
                                  <Input 
                                    type="tel" 
                                    placeholder="Student Mobile Number (Optional)" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-full w-full border-0 !bg-transparent rounded-none pl-1 pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:outline-none shadow-none flex items-center leading-none" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Student Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Student Email (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                />
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 — Parents & Contact Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3 sm:space-y-3.5 text-left"
                    >
                      {/* Row 1: Father / Guardian Name & Mother Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Father / Guardian Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Father / Guardian Name *" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherName"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Mother Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Mother Name (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 2: Father Occupation & Mother Occupation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="fatherOccupation"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Father Occupation</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Father / Guardian Occupation (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherOccupation"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Mother Occupation</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Mother Occupation (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 3: Father / Guardian Mobile & Mother Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="fatherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Father / Guardian Mobile</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center h-[38px] sm:h-[40px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                                  <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                    +91
                                  </span>
                                  <Input 
                                    type="tel" 
                                    placeholder="Father / Guardian Mobile *" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-full w-full border-0 !bg-transparent rounded-none pl-1 pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:outline-none shadow-none flex items-center leading-none" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Mother Mobile</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center h-[38px] sm:h-[40px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                                  <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                    +91
                                  </span>
                                  <Input 
                                    type="tel" 
                                    placeholder="Mother Mobile (Optional)" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-full w-full border-0 !bg-transparent rounded-none pl-1 pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:outline-none shadow-none flex items-center leading-none" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 4: Parent Email & Emergency Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="parentEmail"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Parent Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Parent Email (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                />
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="emergencyContact"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Emergency Contact</FormLabel>
                              <FormControl>
                                <div className="relative flex items-center h-[38px] sm:h-[40px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                                  <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                    +91
                                  </span>
                                  <Input 
                                    type="tel" 
                                    placeholder="Emergency Contact (Optional)" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-full w-full border-0 !bg-transparent rounded-none pl-1 pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:outline-none shadow-none flex items-center leading-none" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 5: Full Residential Address * */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="space-y-0 text-left">
                            <FormLabel className="sr-only">Full Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Full Residential Address *" 
                                {...field} 
                                className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                          </FormItem>
                        )}
                      />

                      {/* Row 6: City *, State *, Pincode * in 3-column grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">City</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="City *" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">State</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 cursor-pointer">
                                    <SelectValue placeholder="State *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-56 z-[200]">
                                  {indianStates.map(st => <SelectItem key={st} value={st} className="text-[13px] py-1.5 cursor-pointer font-medium">{st}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Pincode</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Pincode *" 
                                  {...field} 
                                  maxLength={6} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                />
                              </FormControl>
                              <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 — Academic History & Review */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3.5 sm:space-y-4 text-left"
                    >
                      {/* Row 1: Apply For (NEET, JEE, FOUNDATION) & Previous School Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="program"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Apply For</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 cursor-pointer">
                                    <SelectValue placeholder="Apply For" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="z-[200]">
                                  <SelectItem value="NEET" className="text-[13px] py-1.5 cursor-pointer font-medium">NEET</SelectItem>
                                  <SelectItem value="JEE" className="text-[13px] py-1.5 cursor-pointer font-medium">JEE</SelectItem>
                                  <SelectItem value="FOUNDATION" className="text-[13px] py-1.5 cursor-pointer font-medium">FOUNDATION</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="previousSchool"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Previous School Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Previous School Name (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 2: Previous Marks / Grade & Stream */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="previousPercentage"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Previous Marks</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Previous Percentage / Grade (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stream"
                          render={({ field }) => (
                            <FormItem className="space-y-0 text-left">
                              <FormLabel className="sr-only">Stream</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Stream / Subjects (Optional)" 
                                  {...field} 
                                  className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Row 3: Scholarship / Entrance Test */}
                      <FormField
                        control={form.control}
                        name="scholarshipTest"
                        render={({ field }) => (
                          <FormItem className="space-y-0 text-left">
                            <FormLabel className="sr-only">Scholarship Test</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Scholarship / Entrance Test (Optional)" 
                                {...field} 
                                className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Review Summary Box */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-left mt-2">
                        <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#2864E8] dark:text-blue-400 mb-2">
                          Application Summary
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-[11.5px] sm:text-[12px]">
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] sm:text-[10.5px] uppercase font-medium">Student</span>
                            <strong className="font-semibold text-slate-800 dark:text-slate-100 truncate block mt-0.5">{form.watch('studentName') || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] sm:text-[10.5px] uppercase font-medium">Branch</span>
                            <strong className="font-semibold text-slate-800 dark:text-slate-100 truncate block mt-0.5">{form.watch('branch')?.split(',')[0] || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] sm:text-[10.5px] uppercase font-medium">Parent Mobile</span>
                            <strong className="font-semibold text-slate-800 dark:text-slate-100 truncate block mt-0.5">{form.watch('fatherPhone') || '—'}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] sm:text-[10.5px] uppercase font-medium">Course</span>
                            <strong className="font-semibold text-slate-800 dark:text-slate-100 truncate block mt-0.5">{form.watch('classApplied') || '—'}</strong>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Footer Action Bar */}
              <div className="px-3.5 sm:px-7 py-2.5 sm:py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="group h-[38px] sm:h-[40px] px-1 text-[12px] sm:text-[12.5px] font-bold tracking-[0.08em] uppercase text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer flex items-center gap-1.5 transition-colors focus:outline-none shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors group-hover:-translate-x-0.5 transition-transform duration-150" />
                    <span>BACK</span>
                  </button>
                ) : (
                  <div className="shrink-0" />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="group h-[38px] sm:h-[40px] px-1 font-bold text-[12px] sm:text-[12.5px] tracking-[0.08em] uppercase text-[#2864E8] hover:text-[#1E4ED8] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors focus:outline-none ml-auto shrink-0"
                  >
                    <span>NEXT STEP</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2864E8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      className="h-[38px] sm:h-[40px] px-2.5 sm:px-4 rounded-[6px] text-[11.5px] sm:text-[12.5px] font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer shadow-xs flex items-center gap-1 sm:gap-1.5 transition-all outline-none shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2864E8] dark:text-blue-400 shrink-0" />
                      <span>Preview</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await validateCompulsoryFields();
                        if (isValid) {
                          setIsPaymentDialogOpen(true);
                        }
                      }}
                      className="group h-[38px] sm:h-[40px] px-3 sm:px-5 md:px-6 rounded-[6px] font-bold text-[11.5px] sm:text-[12.5px] tracking-[0.06em] sm:tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_10px_rgba(40,100,232,0.28)] hover:shadow-[0_4px_16px_rgba(40,100,232,0.38)] active:shadow-sm active:translate-y-[0.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 uppercase shrink-0 whitespace-nowrap"
                    >
                      <span>SUBMIT &amp; PAY (₹10)</span>
                      <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/90 shrink-0" />
                    </Button>
                  </div>
                )}
              </div>

            </form>
          </Form>
        </FormModalDialogContent>
      </Dialog>

      {/* 1-Page A4 PDF Review Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] max-w-4xl h-[calc(100dvh-7.5rem)] max-h-[820px] rounded-2xl p-0 overflow-hidden border border-slate-300 bg-white flex flex-col shadow-2xl z-[150] top-[5.25rem] left-1/2 -translate-x-1/2 translate-y-0"
        >
          <DialogHeader className="px-4 sm:px-6 py-3 border-b bg-slate-50/90 flex flex-row items-center justify-between shrink-0 pr-14">
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-base sm:text-lg font-bold text-[#0B2A6F]">Admission Form 2026-27 (Preview)</DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">Single-page printable institutional enrollment copy</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-[8px] font-semibold h-8 text-xs cursor-pointer px-3 border-[#D7DFEA] text-[#17213A] hover:bg-slate-100" onClick={() => setIsPreviewOpen(false)}>
                <Edit className="w-3.5 h-3.5 mr-1 text-[#0B2A6F]" /> Edit
              </Button>
              <Button size="sm" className="rounded-[8px] font-semibold h-8 text-xs bg-[#0B2A6F] text-white hover:bg-[#081F52] cursor-pointer px-3.5 shadow-xs" onClick={generatePdf}>
                <Download className="w-3.5 h-3.5 mr-1" /> Save PDF
              </Button>
              <Button 
                size="sm" 
                className="rounded-[8px] font-semibold h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-3.5 shadow-xs" 
                onClick={async () => {
                  const isValid = await validateCompulsoryFields();
                  if (isValid) {
                    setIsPreviewOpen(false);
                    setIsPaymentDialogOpen(true);
                  }
                }}
              >
                <Lock className="w-3.5 h-3.5 mr-1" /> Submit (₹10)
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-slate-100/90 p-4 sm:p-6 flex justify-center items-start">
            <div 
              ref={previewRef} 
              className="bg-white text-[#17213A] shadow-xl border border-[#D7DFEA] w-[794px] h-[1123px] min-w-[794px] min-h-[1123px] max-h-[1123px] overflow-hidden p-[44px_48px] flex flex-col justify-between box-border text-[11px] leading-tight select-none relative"
              style={{ minWidth: '794px', minHeight: '1123px', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              <div>
                {/* Header with Organization Details */}
                <div className="border-b border-[#D7DFEA] pb-3.5 mb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-left">
                    <img src="/idllogo.png" alt="IDL Logo" className="h-11 w-auto object-contain" />
                    <div className="border-l border-[#D7DFEA] pl-3.5">
                      <div className="flex items-center gap-2 text-[9.5px] text-[#64748B] font-medium">
                        <span>Telephone: <strong className="text-[#17213A]">011 45035713</strong></span>
                        <span className="text-[#D7DFEA]">|</span>
                        <span>Email: <strong className="text-[#17213A]">info@idleducation.in</strong></span>
                        <span className="text-[#D7DFEA]">|</span>
                        <span>Website: <strong className="text-[#17213A]">www.idleducation.in</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-center">
                    <span 
                      style={{
                        display: 'inline-block',
                        color: '#0B2A6F',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        lineHeight: 1,
                        textTransform: 'uppercase'
                      }}
                    >
                      ADMISSION FORM 2026-27
                    </span>
                    <span className="text-[7.5px] font-bold text-[#64748B] tracking-wider mt-1 uppercase">
                      (FOR OFFLINE STUDENTS ONLY)
                    </span>
                  </div>
                </div>

                {/* Identity Header Strip / Application Summary Card */}
                <div className="border border-[#D7DFEA] bg-[#F5F7FA] rounded-lg p-3.5 mb-4 flex items-center justify-between">
                  <div className="grid grid-cols-3 gap-6 text-left flex-1 pr-6">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block">Application Form No.</span>
                      <span className="font-extrabold text-[13px] text-[#0B2A6F] font-mono tracking-tight">{form.getValues('studentId') || 'PROV-2026-001'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block">Admission Center / Branch</span>
                      <span className="font-bold text-[12px] text-[#17213A]">{form.getValues('branch')?.split(',')[0] || 'Mukherjee Nagar'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block">Date of Application</span>
                      <span className="font-bold text-[12px] text-[#17213A]">{format(new Date(), "dd MMMM yyyy")}</span>
                    </div>
                  </div>

                  <div className="w-[72px] h-[92px] border border-[#D7DFEA] bg-white rounded-md flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8.5px] text-[#64748B] font-bold text-center px-1 leading-tight">Affix Recent Photo</span>
                    )}
                  </div>
                </div>

                {/* Grid Info Sections */}
                <div className="space-y-3.5 text-left">
                  {/* Section 1: Student Identity */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        1. STUDENT IDENTITY &amp; DETAILS
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-x-5 gap-y-2 px-1">
                      <div><span className="text-[#64748B] text-[10px] font-medium">Student Name:</span> <strong className="text-[#17213A] text-[11px] font-semibold uppercase ml-1">{form.getValues('studentName') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Date of Birth:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{formatDateForDisplay(form.getValues('dob')) || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Gender:</span> <strong className="text-[#17213A] text-[11px] font-semibold capitalize ml-1">{form.getValues('gender') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Class:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('classApplied') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Student Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('studentPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Student Email:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('email') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 2: Parent / Guardian */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        2. PARENT / GUARDIAN INFORMATION
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-1">
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father / Guardian:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherName') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother Name:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherName') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father Occupation:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherOccupation') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother Occupation:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherOccupation') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Parent Email:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('parentEmail') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 3: Contact & Address */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        3. CONTACT &amp; RESIDENTIAL ADDRESS
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-x-5 gap-y-2 px-1">
                      <div className="col-span-2"><span className="text-[#64748B] text-[10px] font-medium">Residential Address:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('address') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">City / State / Pin:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('city') || ''}{form.getValues('city') ? ', ' : ''}{form.getValues('state') || '—'} - {form.getValues('pincode') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Branch:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('branch')?.split(',')[0] || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Emergency Contact:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('emergencyContact') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 4: Academic Background */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        4. ACADEMIC BACKGROUND
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-1">
                      <div><span className="text-[#64748B] text-[10px] font-medium">Apply For:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('program') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Previous School:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('previousSchool') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Percentage / Grade:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('previousPercentage') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Stream / Subjects:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('stream') || '—'}</strong></div>
                      <div className="col-span-2"><span className="text-[#64748B] text-[10px] font-medium">Scholarship / Entrance Test:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('scholarshipTest') || '—'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Declaration & Signatures */}
              <div className="border-t border-[#D7DFEA] pt-3 text-left">
                <p className="text-[8.5px] text-[#64748B] mb-5 leading-relaxed text-justify">
                  <strong className="text-[#17213A]">Declaration:</strong> I hereby declare that the particulars given above are true and correct to the best of my knowledge and belief. I agree to abide by the disciplinary rules, attendance policy, and academic schedule of IDL Education Academy. Fees once paid for registration are non-refundable.
                </p>

                <div className="grid grid-cols-3 gap-6 text-center items-end pt-3">
                  <div>
                    <div className="border-b border-[#64748B]/60 w-36 mx-auto mb-1.5"></div>
                    <span className="text-[9px] font-semibold text-[#17213A] block">Student Signature</span>
                    <span className="text-[7.5px] text-[#64748B] block mt-0.5">(Sign inside boundary)</span>
                  </div>
                  <div>
                    <div className="border-b border-[#64748B]/60 w-36 mx-auto mb-1.5"></div>
                    <span className="text-[9px] font-semibold text-[#17213A] block">Parent / Guardian Signature</span>
                    <span className="text-[7.5px] text-[#64748B] block mt-0.5">(Father / Mother / Guardian)</span>
                  </div>
                  <div>
                    <div className="border-b border-[#0B2A6F] w-36 mx-auto mb-1.5"></div>
                    <span className="text-[9px] font-bold text-[#0B2A6F] block">Authorized IDL Stamp &amp; Sign</span>
                    <span className="text-[7.5px] text-[#64748B] block mt-0.5">(Center Head / Admin)</span>
                  </div>
                </div>

                {/* Bottom Right Page Number */}
                <div className="text-right pt-2">
                  <span className="text-[8.5px] font-semibold text-[#64748B]">Page 1 of 1</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Razorpay Payment Verification Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:w-full sm:max-w-[440px] shadow-none rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 overflow-hidden top-[calc(4rem+0.75rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 z-[150]"
        >
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Application Processing Fee</DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              A nominal processing fee of ₹10 is required to generate your official admission confirmation.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-[5px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{form.getValues('studentName')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program Applied</span>
              <span className="font-bold text-slate-900 dark:text-white">{form.getValues('classApplied')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
              <span className="text-slate-900 dark:text-white">Total Payable</span>
              <span className="text-primary font-black">₹10.00</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="w-full sm:w-auto text-xs font-bold rounded-[8px] border-slate-300 dark:border-slate-700 cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isSubmitting} className="w-full sm:w-auto text-xs font-extrabold bg-gradient-to-r from-primary to-blue-700 hover:from-primary/95 hover:to-blue-700/95 text-white rounded-[8px] tracking-wide shadow-md shadow-primary/25 cursor-pointer">
              {isSubmitting ? 'Connecting...' : 'Pay ₹10 via Razorpay'}
            </Button>
          </DialogFooter>

          <div className="text-center pt-2">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> 256-Bit Encrypted Secure Payment
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success + ID Card Prompt Dialog */}
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white text-center">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Application Submitted!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Your admission form has been received. Download your Student ID Card below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-left">
            <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1.5">Your Student ID</p>
            <p className="text-base font-black text-slate-900 font-mono">{submittedData?.studentId}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{submittedData?.studentName}</p>
          </div>

          <DialogFooter className="mt-4 flex flex-col gap-2">
            <Button
              onClick={() => {
                setIsThankYouOpen(false);
                setIsIdCardOpen(true);
              }}
              className="w-full h-11 rounded-[8px] font-black text-xs bg-primary text-white cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              View &amp; Download ID Card
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsThankYouOpen(false);
                onOpenChange(false);
                setPhotoPreview(null);
              }}
              className="w-full h-10 rounded-[8px] font-bold text-xs cursor-pointer border-slate-200"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🎓 Student ID Card Dialog */}
      <Dialog open={isIdCardOpen} onOpenChange={(open) => {
        setIsIdCardOpen(open);
        if (!open) {
          onOpenChange(false);
          setPhotoPreview(null);
        }
      }}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[560px] p-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl z-[150] max-h-[96vh] flex flex-col"
        >
          <DialogTitle className="sr-only">Student ID Card</DialogTitle>
          <DialogDescription className="sr-only">Download your student identity card</DialogDescription>

          {/* Header */}
          <div className="bg-white px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Confirmed</p>
              <h3 className="text-sm font-extrabold text-[#0B2A6F]">Official Student ID Card</h3>
            </div>

            {/* Layout Switcher & Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1">
                <button
                  type="button"
                  onClick={() => setIdCardLayout("portrait_waves")}
                  className={cn(
                    "px-2 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer",
                    idCardLayout === "portrait_waves" ? "bg-[#0A225C] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Portrait Badge
                </button>
                <button
                  type="button"
                  onClick={() => setIdCardLayout("horizontal")}
                  className={cn(
                    "px-2 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer",
                    idCardLayout === "horizontal" ? "bg-[#0A225C] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Horizontal
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={isDownloadingCard}
                onClick={async () => {
                  if (!idCardRef.current) return;
                  setIsDownloadingCard(true);
                  try {
                    const { default: html2canvas } = await import('html2canvas');
                    const canvas = await html2canvas(idCardRef.current, {
                      scale: 3,
                      useCORS: true,
                      backgroundColor: null,
                      logging: false,
                    });
                    const link = document.createElement('a');
                    link.download = `${submittedData?.studentName || form.getValues('studentName') || 'Student'}_IDCard.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 px-2.5 text-xs font-bold rounded-[8px] cursor-pointer border-[#D7DFEA] text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> PNG
              </Button>
              <Button
                size="sm"
                disabled={isDownloadingCard}
                onClick={async () => {
                  if (!idCardRef.current) return;
                  setIsDownloadingCard(true);
                  try {
                    const { default: html2canvas } = await import('html2canvas');
                    const canvas = await html2canvas(idCardRef.current, {
                      scale: 3,
                      useCORS: true,
                      backgroundColor: null,
                      logging: false,
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const isPortrait = idCardLayout === 'portrait_waves';
                    const pdf = new jsPDF({
                      orientation: isPortrait ? 'portrait' : 'landscape',
                      unit: 'mm',
                      format: isPortrait ? [53.98, 85.60] : [85.60, 53.98],
                    });
                    pdf.addImage(imgData, 'PNG', 0, 0, isPortrait ? 53.98 : 85.60, isPortrait ? 85.60 : 53.98, '', 'FAST');
                    pdf.save(`${submittedData?.studentName || form.getValues('studentName') || 'Student'}_IDCard.pdf`);
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 px-3 text-xs font-extrabold rounded-lg bg-[#0B2A6F] text-white hover:bg-[#071942] cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
              </Button>

              <Link
                href="/student-id-card"
                target="_blank"
                className="h-8 px-2.5 text-[11px] font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 inline-flex items-center gap-1"
                title="Open Studio to customize card"
              >
                Studio <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Card Preview Area */}
          <div className="p-4 sm:p-5 flex items-center justify-center bg-slate-100/90 overflow-y-auto flex-1">
            {(() => {
              const studentIdVal = submittedData?.studentId || form.getValues('studentId') || '071126-101';
              const barcodeData = generateCode39Bars(studentIdVal);
              const qrMatrix = generateQRMatrix(studentIdVal);
              const studentNameVal = submittedData?.studentName || form.getValues('studentName') || 'Student Name';
              const applyForVal = (submittedData as any)?.applyFor || (form.getValues() as any)?.applyFor || submittedData?.stream || form.getValues('stream') || submittedData?.program || form.getValues('program') || 'NEET';
              const classVal = submittedData?.classApplied || form.getValues('classApplied') || 'Class 12 PASS';
              const fatherVal = submittedData?.fatherName || form.getValues('fatherName') || '—';
              const bloodVal = submittedData?.bloodGroup || form.getValues('bloodGroup') || 'O+';
              const phoneVal = submittedData?.studentPhone || form.getValues('studentPhone') || submittedData?.fatherPhone || form.getValues('fatherPhone') || '9876543210';
              const branchVal = (submittedData?.branch || form.getValues('branch') || 'Mukherjee Nagar, Delhi')?.split(',')[0];
              const nameLength = studentNameVal.length;

              if (idCardLayout === "portrait_waves") {
                return (
                  <div
                    ref={idCardRef}
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
                          <h2 style={{ margin: 0, fontSize: studentNameVal.length > 18 ? 14.5 : 17, fontWeight: 900, color: '#0A225C', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                            {studentNameVal}
                          </h2>
                          <p style={{ margin: '2px 0 0', fontSize: 9.5, color: '#2563EB', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {applyForVal} &bull; {classVal}
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
                          <strong style={{ color: '#0A225C', fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.05em' }}>{studentIdVal}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Father</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fatherVal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Blood</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0A225C', fontWeight: 800, fontSize: 9 }}>{bloodVal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Phone</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9 }}>+91 {phoneVal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Branch</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{branchVal}</span>
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
                  </div>
                );
              }

              // Horizontal Card
              return (
                <div
                  ref={idCardRef}
                  className="relative overflow-hidden select-none"
                  style={{
                    width: 460,
                    height: 290,
                    minWidth: 460,
                    minHeight: 290,
                    borderRadius: 14,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    background: 'linear-gradient(145deg, #0A225C 0%, #081B4B 50%, #051336 100%)',
                    boxShadow: '0 20px 45px -10px rgba(5, 19, 54, 0.5), 0 0 0 1.5px rgba(255, 255, 255, 0.12)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Subtle Gold Accent Bar at Top */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, #F5B51B 0%, #F8D06E 50%, #F5B51B 100%)',
                  }} />

                  {/* Header: Logo + Institute Brand | Student ID Card Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '3px 7px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}>
                        <img src="/idllogo.png" alt="IDL Education" style={{ height: 22, width: 'auto', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.15 }}>
                          IDL EDUCATION
                        </h4>
                        <p style={{ margin: '1px 0 0', fontSize: 7.5, color: '#94A3B8', letterSpacing: '0.04em', fontWeight: 500 }}>
                          Academy &bull; Learning Centre
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: 'rgba(245, 181, 27, 0.12)',
                        border: '1px solid rgba(245, 181, 27, 0.4)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}>
                        <p style={{ margin: 0, fontSize: 7.5, fontWeight: 800, color: '#F5B51B', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          STUDENT ID CARD
                        </p>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 7, color: '#94A3B8', letterSpacing: '0.04em', fontWeight: 500 }}>
                        Session 2026–27
                      </p>
                    </div>
                  </div>

                  {/* Middle: Photo + Student Identity + 2-Column Info Grid */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 18px 0 18px' }}>
                    {/* Student Photo */}
                    <div style={{
                      width: 82,
                      height: 104,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1.5px solid rgba(245, 181, 27, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center', padding: 4 }}>
                          <User style={{ width: 28, height: 28, color: 'rgba(255, 255, 255, 0.3)', margin: '0 auto' }} />
                          <span style={{ fontSize: 7, color: 'rgba(255, 255, 255, 0.4)', display: 'block', marginTop: 2 }}>Photo</span>
                        </div>
                      )}
                    </div>

                    {/* Identity & 2-Column Info Grid */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: nameLength > 22 ? 12 : nameLength > 16 ? 13.5 : 15,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {studentNameVal}
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: 8.5, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        S/O {fatherVal}
                      </p>

                      <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '6px 0 8px 0' }} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            STUDENT ID
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 9.5, fontWeight: 800, color: '#F5B51B', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                            {studentIdVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            DATE OF BIRTH
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8.5, fontWeight: 600, color: '#FFFFFF' }}>
                            {submittedData?.dob ? formatDateForDisplay(submittedData.dob) : form.getValues('dob') ? formatDateForDisplay(form.getValues('dob')) : '—'}
                          </p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            PROGRAM / CLASS
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8.5, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {applyForVal} &bull; {classVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            CENTER / BRANCH
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {branchVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            BLOOD GROUP
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#F5B51B' }}>
                            {bloodVal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Barcode Box + Footer Branding + Authorised Signatory */}
                  <div style={{ padding: '0 18px 10px 18px', marginTop: 'auto' }}>
                    <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 7 }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Barcode Block */}
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        padding: '3px 6px',
                        borderRadius: 4,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 130,
                      }}>
                        <svg viewBox={`0 0 ${barcodeData.totalWidth} 16`} width="100%" height="16" preserveAspectRatio="none" style={{ display: 'block' }}>
                          {barcodeData.bars.map((bar, idx) => (
                            <rect key={idx} x={bar.x} y={0} width={bar.width} height={16} fill="#0F172A" />
                          ))}
                        </svg>
                        <span style={{ fontSize: 6.5, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', letterSpacing: '0.08em', marginTop: 1, lineHeight: 1 }}>
                          {studentIdVal}
                        </span>
                      </div>

                      {/* Center subtle branding */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', fontWeight: 500 }}>
                          idleducation.in
                        </p>
                        <p style={{ margin: '1px 0 0', fontSize: 6, color: 'rgba(148, 163, 184, 0.7)' }}>
                          Official Student ID
                        </p>
                      </div>

                      {/* Authorised Signatory */}
                      <div style={{ textAlign: 'center', width: 95 }}>
                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.4)', marginBottom: 2, height: 12 }}></div>
                        <p style={{ margin: 0, fontSize: 6, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
                          AUTH. SIGNATORY
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Footer note */}
          <div className="px-6 pb-4 pt-2 text-center bg-white border-t border-slate-200 shrink-0">
            <p className="text-[11px] text-slate-500 font-medium">
              This is your verified institutional digital Student ID Card.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              onClick={() => {
                setIsIdCardOpen(false);
                onOpenChange(false);
                setPhotoPreview(null);
              }}
            >
              Close &amp; Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Passport Photo Crop & Position Adjustment Modal */}
      <PhotoCropModal
        isOpen={isCropOpen}
        imageSrc={activeCropImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={(croppedDataUrl, fileBlob) => {
          setPhotoPreview(croppedDataUrl);
          setActiveCropImage(croppedDataUrl);
          form.setValue('studentPhoto', fileBlob);
          setIsCropOpen(false);
          toast({
            title: "Photo adjusted & confirmed",
            description: "Passport photograph is ready for admission.",
          });
        }}
      />
    </>
  );
}
