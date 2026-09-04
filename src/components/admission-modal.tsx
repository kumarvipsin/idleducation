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
  Crop, RotateCw, ZoomIn, ZoomOut, Upload
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, getDaysInMonth } from "date-fns";
import Script from "next/script";
import { cn } from "@/lib/utils";

const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;
const aadharRegex = /^\d{12}$/;

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const branches = [
  "Head Office - Patna Main Campus",
  "Boring Road Branch, Patna",
  "Kankarbagh Branch, Patna",
  "Bailey Road Learning Center, Patna",
  "Delhi NCR Regional Center",
  "Online / Distance Coaching Mode"
];

const classes = [
  "Class 6th Foundation", "Class 7th Foundation", "Class 8th Foundation",
  "Class 9th (Pre-Board & Olympiad)", "Class 10th (Board & Olympiad Prep)",
  "Class 11th - Medical (NEET-UG Target)", "Class 11th - Engineering (JEE Main & Adv)",
  "Class 11th - Commerce & Applied Arts", "Class 12th - Medical (NEET-UG Target)",
  "Class 12th - Engineering (JEE Main & Adv)", "Class 12th - Board Focus",
  "Target Repeater Batch (NEET)", "Target Repeater Batch (JEE)",
  "Crash Course / Test Series Program"
];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const admissionFormSchema = z.object({
  studentId: z.string(),
  studentName: z.string().min(2, { message: "Student full name is required (min 2 letters)." }),
  fatherName: z.string().min(2, { message: "Father's name is required." }),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, { message: "Mother's name is required." }),
  motherOccupation: z.string().optional(),
  dob: z.date({
    required_error: "Date of birth is required.",
  }).refine((dob) => {
    const today = new Date();
    const threeYearsAgo = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    return dob <= threeYearsAgo;
  }, { message: "Student must be at least 3 years old." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select gender." }),
  bloodGroup: z.string().optional(),
  aadharNumber: z.string().regex(aadharRegex, { message: "Enter a valid 12-digit Aadhar number." }).optional().or(z.literal('')),
  apaarId: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  studentPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }).optional().or(z.literal('')),
  fatherPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }),
  motherPhone: z.string().regex(phoneRegex, { message: "Enter a valid 10-digit mobile number." }),
  telephone: z.string().optional().or(z.literal('')),
  address: z.string().min(5, { message: "Full residential address is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  state: z.string().min(1, { message: "Please select state." }),
  pincode: z.string().regex(pincodeRegex, { message: "Enter a valid 6-digit pincode." }),
  classApplied: z.string().min(1, { message: "Please select course/class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  branch: z.string().min(1, { message: "Please select nearest branch." }),
  studentPhoto: z.any().optional(),
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i - 3);

const STEPS = [
  { id: 1, title: 'Center', subtitle: 'Center Details', icon: Building },
  { id: 2, title: 'Student', subtitle: 'Student Details', icon: User },
  { id: 3, title: 'Parents', subtitle: 'Parents Details', icon: Briefcase },
  { id: 4, title: 'Contact', subtitle: 'Contact Details', icon: Phone },
  { id: 5, title: 'Academic', subtitle: 'Academic & Review', icon: GraduationCap },
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
  const [submittedData, setSubmittedData] = useState<AdmissionFormValues | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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
  const [rawPhotoUrl, setRawPhotoUrl] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropScale, setCropScale] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropRotate, setCropRotate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialCropX: 0, initialCropY: 0 });

  const handleCropMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialCropX: cropX,
      initialCropY: cropY,
    };
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setCropX(dragStartRef.current.initialCropX + dx);
    setCropY(dragStartRef.current.initialCropY + dy);
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialCropX: cropX,
        initialCropY: cropY,
      };
    }
  };

  const handleCropTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setCropX(dragStartRef.current.initialCropX + dx);
    setCropY(dragStartRef.current.initialCropY + dy);
  };

  const handleCropTouchEnd = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!rawPhotoUrl) return;
    const canvas = document.createElement('canvas');
    // High-res standard Indian passport aspect ratio (350px x 450px -> 3.5cm x 4.5cm)
    canvas.width = 350;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 350, 450);

      ctx.save();
      // Center of canvas
      ctx.translate(175, 225);
      // Viewport is 175px x 225px, canvas is 350px x 450px -> factor of 2
      ctx.translate(cropX * 2, cropY * 2);
      ctx.rotate((cropRotate * Math.PI) / 180);
      ctx.scale(cropScale, cropScale);

      const aspect = img.width / img.height;
      let drawW = 350;
      let drawH = 350 / aspect;
      if (drawH < 450) {
        drawH = 450;
        drawW = 450 * aspect;
      }
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPhotoPreview(croppedDataUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'student-passport-photo.jpg', { type: 'image/jpeg' });
          form.setValue('studentPhoto', file);
        }
      }, 'image/jpeg', 0.92);

      setIsCropOpen(false);
    };
    img.src = rawPhotoUrl;
  };

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
      studentName: '',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      email: '',
      studentPhone: '',
      fatherPhone: '',
      motherPhone: '',
      telephone: '',
      address: '',
      country: 'India',
      state: '',
      pincode: '',
      classApplied: '',
      previousSchool: '',
      additionalInfo: '',
      branch: '',
      transactionId: 'N/A',
      gender: undefined,
      bloodGroup: '',
      aadharNumber: '',
      apaarId: '',
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
      fieldsToValidate = ['branch'];
    } else if (step === 2) {
      fieldsToValidate = ['studentName', 'dob', 'gender'];
    } else if (step === 3) {
      fieldsToValidate = ['fatherName', 'motherName'];
    } else if (step === 4) {
      fieldsToValidate = ['email', 'fatherPhone', 'motherPhone', 'state', 'pincode', 'address'];
    } else if (step === 5) {
      fieldsToValidate = ['classApplied'];
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

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
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

  const handleStepClick = async (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
    } else if (targetStep > currentStep) {
      for (let s = currentStep; s < targetStep; s++) {
        const valid = await validateStep(s);
        if (!valid) return;
      }
      setCurrentStep(targetStep);
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollTop = 0;
      }
    }
  };

  const handlePreview = async () => {
    const result = await form.trigger([
      "studentName", "fatherName", "motherName", "dob", "email", "fatherPhone", "motherPhone", "address", "state", "pincode", "classApplied", "branch", "gender"
    ]);
    if (result) {
      setIsPreviewOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill all mandatory fields marked with an asterisk (*) to preview application.",
      });
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

  return (
    <>
      <Script id="razorpay-checkout-modal-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Main Admission Popup Modal */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[calc(100vw-1.25rem)] sm:w-[92vw] md:w-[88vw] max-w-[800px] max-h-[88vh] sm:max-h-[84vh] shadow-2xl shadow-slate-950/20 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-200 ease-out z-50"
        >
          {/* Modal Header: Trustworthy, clean and concise */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
            <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
              Admission Form 2026–27
            </DialogTitle>
            <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
              Complete the steps below to apply for admission.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">

              {/* Progress Stepper: Clean visual hierarchy */}
              <div className="px-5 sm:px-7 pt-3.5 pb-2.5 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="max-w-[560px] mx-auto flex items-center justify-between relative">
                  {/* Background Progress Bar Line */}
                  <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-3.5 sm:top-4 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute left-4 sm:left-6 top-3.5 sm:top-4 h-[2px] bg-[#102A68] dark:bg-blue-500 -translate-y-1/2 z-0 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  />

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
                              ? "bg-[#102A68] text-white shadow-xs" 
                              : isActive 
                                ? "bg-[#102A68] text-white ring-4 ring-[#102A68]/15" 
                                : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:border-[#102A68]/40"
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
                            "text-[11px] sm:text-[12px] font-medium mt-1 transition-colors",
                            isActive ? "text-[#102A68] dark:text-blue-400 font-semibold" : isCompleted ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                          )}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Summary: Compact single horizontal information row */}
              <div className="px-5 sm:px-7 py-2.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-[12px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
                  Step {currentStep} of 5 · <span className="font-semibold text-slate-900 dark:text-white">{STEPS[currentStep - 1].subtitle}</span>
                </span>
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#102A68] dark:text-blue-400 bg-[#102A68]/8 dark:bg-blue-500/15 px-2.5 py-0.5 rounded-full">
                  {Math.round((currentStep / 5) * 100)}%
                </span>
              </div>

              {/* Scrollable Form Body */}
              <div ref={stepContainerRef} className="overflow-y-auto flex-1 min-h-0 overscroll-contain">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 text-left"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {/* Provisional Student ID */}
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Provisional Student ID
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/75 dark:bg-slate-900/60 shadow-xs flex items-center justify-between px-3 h-10 sm:h-11">
                                  <Input 
                                    {...field} 
                                    readOnly 
                                    placeholder="Provisional Student ID"
                                    className="h-full border-0 bg-transparent text-[14px] sm:text-[15px] font-semibold text-[#102A68] dark:text-blue-400 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-0 cursor-default select-all" 
                                  />
                                  <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md shrink-0 select-none">
                                    Auto ID
                                  </span>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Preferred Branch */}
                        <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Preferred Branch <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                      <SelectValue placeholder="Select Preferred Branch" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-56">
                                      {branches.map(b => (
                                        <SelectItem key={b} value={b} className="text-[13px] sm:text-[14px] font-medium text-[#18233A]">{b}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Photo Upload Area */}
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Passport Size Photograph
                        </label>
                        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 shadow-xs flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {/* Rigid Passport Box (w: 58px, h: 74px -> ~3.5:4.5 passport ratio) */}
                            <div 
                              onClick={() => {
                                if (rawPhotoUrl || photoPreview) {
                                  setIsCropOpen(true);
                                } else {
                                  fileInputRef.current?.click();
                                }
                              }}
                              className="w-[58px] h-[74px] rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#102A68] dark:hover:border-blue-400 transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer shadow-xs aspect-[35/45]"
                              title={photoPreview ? "Click to crop & adjust position" : "Click to upload photo"}
                            >
                              {photoPreview ? (
                                <>
                                  <img src={photoPreview} alt="Student" className="w-full h-full object-cover block" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-semibold uppercase gap-0.5">
                                    <Crop className="w-3.5 h-3.5" />
                                    <span>Adjust</span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1 p-1 text-center">
                                  <Camera className="w-4 h-4 text-slate-400 group-hover:text-[#102A68] transition-colors" />
                                  <span className="text-[9px] text-slate-400 font-medium leading-none">35×45mm</span>
                                </div>
                              )}
                            </div>
                            <div className="text-left min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-white truncate">
                                  {photoPreview ? "Photo Uploaded" : "Passport Size Photograph"}
                                </p>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#102A68]/8 text-[#102A68] dark:text-blue-400 dark:bg-blue-400/10 shrink-0">
                                  3.5 × 4.5 cm
                                </span>
                              </div>
                              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                JPG or PNG • Passport-size photo
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 justify-end">
                            {photoPreview ? (
                              <>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setIsCropOpen(true)}
                                  className="rounded-lg h-8 px-2.5 text-[12px] font-medium border border-slate-200 dark:border-slate-700 text-[#102A68] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs flex items-center gap-1 focus:ring-0 focus:outline-none"
                                >
                                  <Crop className="w-3 h-3" />
                                  Adjust
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="rounded-lg h-8 px-2.5 text-[12px] font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs flex items-center gap-1 focus:ring-0 focus:outline-none"
                                >
                                  Change
                                </Button>
                              </>
                            ) : (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg h-9 px-3 text-[12px] sm:text-[13px] font-semibold border border-slate-200 dark:border-slate-700 text-[#102A68] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 cursor-pointer shadow-xs flex items-center gap-1.5 focus:ring-0 focus:outline-none"
                              >
                                <Upload className="w-3.5 h-3.5 text-[#102A68] dark:text-blue-400" />
                                Choose Photo
                              </Button>
                            )}
                            <Input
                              id="photo-upload-modal"
                              ref={fileInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  form.setValue('studentPhoto', file);
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const dataUrl = reader.result as string;
                                    setRawPhotoUrl(dataUrl);
                                    setPhotoPreview(dataUrl);
                                    setCropScale(1);
                                    setCropX(0);
                                    setCropY(0);
                                    setCropRotate(0);
                                    setIsCropOpen(true);
                                  };
                                  reader.readAsDataURL(file);
                                } else {
                                  setPhotoPreview(null);
                                  setRawPhotoUrl(null);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left"
                    >
                      {/* Student Name & DOB in 2-column grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {/* Student Full Name */}
                        <FormField
                          control={form.control}
                          name="studentName"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Student Full Name <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. Rahul Sharma" 
                                    {...field} 
                                    autoFocus={false}
                                    value={field.value}
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize"
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        {/* Date of Birth 3-Part Selector */}
                        <FormField
                          control={form.control}
                          name="dob"
                          render={() => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Date of Birth <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                    <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                      <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-2.5">
                                        <SelectValue placeholder="Day" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">{availableDays.map(day => <SelectItem key={day} value={String(day)} className="text-[13px]">{day}</SelectItem>)}</SelectContent>
                                    </Select>
                                  </div>
                                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                    <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                      <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-2.5">
                                        <SelectValue placeholder="Month" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">{months.map(m => <SelectItem key={m} value={m} className="text-[13px]">{m}</SelectItem>)}</SelectContent>
                                    </Select>
                                  </div>
                                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                    <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                      <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-2.5">
                                        <SelectValue placeholder="Year" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">{years.map(y => <SelectItem key={y} value={String(y)} className="text-[13px]">{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Gender & Blood Group in 2-column cell */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Gender <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                      <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male" className="text-[13px] sm:text-[14px]">Male</SelectItem>
                                      <SelectItem value="female" className="text-[13px] sm:text-[14px]">Female</SelectItem>
                                      <SelectItem value="other" className="text-[13px] sm:text-[14px]">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bloodGroup"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Heart className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Blood Group
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                      <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bloodGroups.map(bg => <SelectItem key={bg} value={bg} className="text-[13px] sm:text-[14px]">{bg}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Aadhar & APAAR ID in 2-column cell */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="aadharNumber"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Aadhar UID
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="12-Digit Aadhar UID" 
                                    {...field} 
                                    maxLength={12}
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3"
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="apaarId"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                APAAR / ABC ID
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="APAAR / ABC ID (Optional)" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left"
                    >
                      {/* Father's Name & Occupation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="fatherName"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Father's Full Name <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. Rajesh Sharma" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fatherOccupation"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Father's Occupation
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. Business / Service" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Mother's Name & Occupation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="motherName"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Mother's Full Name <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. Sunita Sharma" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherOccupation"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Mother's Occupation
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. Homemaker / Professional" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left"
                    >
                      {/* Email Address & Telephone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Email Address <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    type="email" 
                                    placeholder="e.g. student@gmail.com" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                    onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="telephone"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Telephone / Landline
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    type="tel" 
                                    placeholder="e.g. 011 45035713 (Optional)" 
                                    {...field} 
                                    maxLength={15} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Father's Mobile & Mother's Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="fatherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Father's Mobile <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    type="tel" 
                                    placeholder="e.g. 9876543210" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Mother's Mobile <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    type="tel" 
                                    placeholder="e.g. 9876543211" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Student Mobile & State */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="studentPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Student Mobile
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    type="tel" 
                                    placeholder="e.g. 9876543212 (Optional)" 
                                    {...field} 
                                    maxLength={10} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Globe className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                State / UT <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                      <SelectValue placeholder="Select State / UT" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-56">
                                      {indianStates.map(st => <SelectItem key={st} value={st} className="text-[13px] sm:text-[14px]">{st}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Pincode & Residential Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                        <div className="sm:col-span-1">
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                  Pincode <span className="text-[#E11D48]">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                    <Input 
                                      placeholder="6 Digits" 
                                      {...field} 
                                      maxLength={6} 
                                      className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                  <Building className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                  Full Residential Address <span className="text-[#E11D48]">*</span>
                                </FormLabel>
                                <FormControl>
                                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                    <Input 
                                      placeholder="House/Flat No., Street, Area, Landmark" 
                                      {...field} 
                                      className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left"
                    >
                      {/* Course / Program Applied & Previous School */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        <FormField
                          control={form.control}
                          name="classApplied"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Class / Program Applying For <span className="text-[#E11D48]">*</span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                      <SelectValue placeholder="Select Class / Program" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-56">
                                      {classes.map((c, i) => <SelectItem key={`${c}-${i}`} value={c} className="text-[13px] sm:text-[14px]">{c}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="previousSchool"
                          render={({ field }) => (
                            <FormItem className="space-y-1.5">
                              <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                <Building className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                Previous School / College Name
                              </FormLabel>
                              <FormControl>
                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                  <Input 
                                    placeholder="e.g. St. Xavier's High School" 
                                    {...field} 
                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Special Remarks */}
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem className="space-y-1.5">
                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                              Special Notes / Learning Requirements
                            </FormLabel>
                            <FormControl>
                              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                <Input 
                                  placeholder="Any specific learning needs or preferences (Optional)" 
                                  {...field} 
                                  className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Review Summary Box */}
                      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                          Application Snapshot
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[12px] sm:text-[13px]">
                          <div><span className="text-slate-500 dark:text-slate-400 block text-[11px]">Student</span><strong className="font-semibold text-slate-900 dark:text-slate-100 truncate block">{form.watch('studentName') || '—'}</strong></div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-[11px]">Center</span><strong className="font-semibold text-slate-900 dark:text-slate-100 truncate block">{form.watch('branch')?.split(',')[0] || '—'}</strong></div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-[11px]">Mobile</span><strong className="font-semibold text-slate-900 dark:text-slate-100 truncate block">{form.watch('fatherPhone') || '—'}</strong></div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-[11px]">Program</span><strong className="font-semibold text-slate-900 dark:text-slate-100 truncate block">{form.watch('classApplied') || '—'}</strong></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Footer Action */}
              <div className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl text-[13px] sm:text-[14px] font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer ml-auto w-full sm:w-auto justify-center"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 ml-auto w-full sm:w-auto justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl text-[13px] sm:text-[14px] font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4 text-[#102A68] dark:text-blue-400" /> Preview A4
                    </Button>
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await form.trigger();
                        if (isValid) {
                          setIsPaymentDialogOpen(true);
                        } else {
                          const errors = form.formState.errors;
                          const firstKey = Object.keys(errors)[0] as keyof AdmissionFormValues;
                          const errorMsg = firstKey ? (errors[firstKey]?.message as string) : "Please complete all required fields.";
                          toast({ 
                            variant: "destructive", 
                            title: "Incomplete Form", 
                            description: errorMsg || "Please fill all required fields before proceeding." 
                          });
                        }
                      }}
                      className="h-10 sm:h-11 px-5 sm:px-6 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer justify-center"
                    >
                      <span>Submit (₹10)</span>
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>

            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 1-Page A4 PDF Review Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] max-w-4xl h-[calc(100dvh-7.5rem)] max-h-[820px] rounded-2xl p-0 overflow-hidden border border-slate-300 bg-white flex flex-col shadow-2xl z-50 top-[5.25rem] left-1/2 -translate-x-1/2 translate-y-0"
        >
          <DialogHeader className="px-4 sm:px-6 py-3 border-b bg-slate-50/90 flex flex-row items-center justify-between shrink-0 pr-14">
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-base sm:text-lg font-bold text-[#0B2A6F]">Admission Form 2026-27 (Preview)</DialogTitle>
              <DialogDescription className="text-xs text-[#64748B]">Single-page printable institutional enrollment copy</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg font-semibold h-8 text-xs cursor-pointer px-3 border-[#D7DFEA] text-[#17213A] hover:bg-slate-100" onClick={() => setIsPreviewOpen(false)}>
                <Edit className="w-3.5 h-3.5 mr-1 text-[#0B2A6F]" /> Edit
              </Button>
              <Button size="sm" className="rounded-lg font-semibold h-8 text-xs bg-[#0B2A6F] text-white hover:bg-[#081F52] cursor-pointer px-3.5 shadow-xs" onClick={generatePdf}>
                <Download className="w-3.5 h-3.5 mr-1" /> Save PDF
              </Button>
              <Button 
                size="sm" 
                className="rounded-lg font-semibold h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-3.5 shadow-xs" 
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsPaymentDialogOpen(true);
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
                  <div className="text-right flex items-center">
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '28px',
                        padding: '0 12px',
                        border: '1.5px solid #0B2A6F',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(11, 42, 111, 0.04)',
                        color: '#0B2A6F',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        lineHeight: 1,
                        boxSizing: 'border-box',
                      }}
                    >
                      <span style={{ display: 'inline-block', lineHeight: 1 }}>
                        ADMISSION FORM 2026-27
                      </span>
                    </div>
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
                      <span className="font-bold text-[12px] text-[#17213A]">{form.getValues('branch')?.split(',')[0] || 'Patna Center'}</span>
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
                  {/* Section 1 */}
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
                      <div><span className="text-[#64748B] text-[10px] font-medium">Blood Group:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('bloodGroup') || 'N/A'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Aadhar UID:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('aadharNumber') || 'N/A'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">APAAR / ABC ID:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('apaarId') || 'N/A'}</strong></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        2. PARENT / GUARDIAN INFORMATION
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-1">
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father's Name:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherName') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father's Occupation:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherOccupation') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother's Name:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherName') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother's Occupation:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherOccupation') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        3. CONTACT &amp; RESIDENTIAL ADDRESS
                      </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-x-5 gap-y-2 px-1">
                      <div className="col-span-2"><span className="text-[#64748B] text-[10px] font-medium">Residential Address:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('address') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">State / Pincode:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('state') || '—'} - {form.getValues('pincode') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Email:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('email') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Father's Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('fatherPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Mother's Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('motherPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Student Mobile:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('studentPhone') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Telephone:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('telephone') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <div className="bg-[#F5F7FA] border border-[#D7DFEA] border-l-[3px] border-l-[#0B2A6F] px-2.5 py-1 rounded-[3px] flex items-center mb-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#0B2A6F]">
                        4. COURSE &amp; ACADEMIC PROFILE
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 px-1">
                      <div><span className="text-[#64748B] text-[10px] font-medium">Course / Class Enrolled:</span> <strong className="text-[#0B2A6F] text-[11.5px] font-bold ml-1">{form.getValues('classApplied') || '—'}</strong></div>
                      <div><span className="text-[#64748B] text-[10px] font-medium">Previous Institution:</span> <strong className="text-[#17213A] text-[11px] font-semibold ml-1">{form.getValues('previousSchool') || '—'}</strong></div>
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

                {/* Subtle Document Footer */}
                <div className="border-t border-[#D7DFEA] mt-4 pt-1.5 flex items-center justify-between text-[8px] text-[#64748B]">
                  <span>IDL Education Academy &bull; Institutional Admission Record</span>
                  <span>Admission Form 2026–27</span>
                  <span>Page 1 of 1</span>
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
          className="w-[95vw] sm:w-full sm:max-w-[440px] shadow-none rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 overflow-hidden top-[calc(4rem+0.75rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0"
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
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="w-full sm:w-auto text-xs font-bold rounded-[5px] border-slate-300 dark:border-slate-700 cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isSubmitting} className="w-full sm:w-auto text-xs font-extrabold bg-gradient-to-r from-primary to-blue-700 hover:from-primary/95 hover:to-blue-700/95 text-white rounded-[5px] tracking-wide shadow-md shadow-primary/25 cursor-pointer">
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
              className="w-full h-11 rounded-xl font-black text-xs bg-primary text-white cursor-pointer flex items-center justify-center gap-2"
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
              className="w-full h-10 rounded-xl font-bold text-xs cursor-pointer border-slate-200"
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
          className="sm:max-w-[510px] p-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl"
        >
          <DialogTitle className="sr-only">Student ID Card</DialogTitle>
          <DialogDescription className="sr-only">Download your student identity card</DialogDescription>

          {/* Header */}
          <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Confirmed</p>
              <h3 className="text-sm font-extrabold text-[#0B2A6F]">Official Student ID Card</h3>
            </div>
            <div className="flex items-center gap-2">
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
                    link.download = `${submittedData?.studentName || 'Student'}_IDCard.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 text-xs font-bold rounded-lg cursor-pointer border-[#D7DFEA] text-slate-700 hover:bg-slate-50"
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
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 53.98] });
                    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98, '', 'FAST');
                    pdf.save(`${submittedData?.studentName || 'Student'}_IDCard.pdf`);
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 text-xs font-extrabold rounded-lg bg-[#0B2A6F] text-white hover:bg-[#071942] cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> DOWNLOAD STUDENT ID
              </Button>
            </div>
          </div>

          {/* Card Preview Area */}
          <div className="p-5 flex items-center justify-center bg-slate-100/90">
            {/* ID Card — standard credit-card proportions 85.60 × 53.98mm, rendered at 460×290px */}
            {(() => {
              const studentIdVal = submittedData?.studentId || form.getValues('studentId') || '040926-111';
              const barcodeData = generateCode39Bars(studentIdVal);
              const studentNameVal = submittedData?.studentName || form.getValues('studentName') || 'Student Name';
              const nameLength = studentNameVal.length;

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
                        S/O {submittedData?.fatherName || form.getValues('fatherName') || '—'}
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
                            {submittedData?.classApplied || form.getValues('classApplied') || '—'}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            CENTER / BRANCH
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {(submittedData?.branch || form.getValues('branch'))?.split(',')[0] || '—'}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            ISSUE DATE
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#CBD5E1' }}>
                            {format(new Date(), 'dd MMM yyyy')}
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
          <div className="px-6 pb-4 pt-1 text-center">
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

      {/* Passport Photo Crop & Position Adjustment Dialog */}
      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-white border border-[#D5DDEA] rounded-2xl shadow-2xl z-50">
          <DialogHeader className="p-5 border-b border-[#D5DDEA] bg-slate-50/70 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#102A68]/10 text-[#102A68] flex items-center justify-center shrink-0">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-[17px] font-bold text-[#18233A]">Passport Photo Adjustment</DialogTitle>
                <DialogDescription className="text-[12px] text-[#52627A]">
                  Drag to move photo • Zoom & rotate to fit standard 35×45mm frame
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 flex flex-col items-center justify-center bg-slate-100/70">
            {/* Viewport Frame (35:45 ratio -> 175px x 225px) */}
            <div 
              className="w-[175px] h-[225px] relative overflow-hidden rounded-[10px] border-2 border-[#102A68] bg-black shadow-lg select-none cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
              onTouchStart={handleCropTouchStart}
              onTouchMove={handleCropTouchMove}
              onTouchEnd={handleCropTouchEnd}
            >
              {rawPhotoUrl && (
                <img 
                  src={rawPhotoUrl} 
                  alt="Crop preview" 
                  draggable={false}
                  className="absolute top-1/2 left-1/2 origin-center max-w-none pointer-events-none select-none"
                  style={{
                    width: '175px',
                    height: '225px',
                    objectFit: 'cover',
                    transform: `translate(-50%, -50%) translate(${cropX}px, ${cropY}px) rotate(${cropRotate}deg) scale(${cropScale})`,
                  }}
                />
              )}

              {/* Passport guidelines overlay: Oval for face placement & crosshair */}
              <div className="absolute inset-0 pointer-events-none border border-white/20">
                {/* Oval guide */}
                <div className="absolute top-[16%] left-[20%] w-[60%] h-[60%] border border-dashed border-white/70 rounded-[50%] shadow-xs" />
                {/* Eye level line */}
                <div className="absolute top-[38%] left-[22%] right-[22%] border-b border-white/40" />
                {/* Chin line */}
                <div className="absolute bottom-[22%] left-[30%] right-[30%] border-b border-white/40" />
              </div>

              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none tracking-wide">
                Drag to Move
              </div>
            </div>

            {/* Controls Bar */}
            <div className="w-full mt-5 space-y-3 bg-white p-3.5 rounded-xl border border-[#D5DDEA] shadow-xs">
              {/* Zoom slider */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCropScale(s => Math.max(0.7, +(s - 0.1).toFixed(2)))}
                  className="h-7 w-7 p-0 text-[#52627A] hover:text-[#102A68] hover:bg-slate-100 rounded-md"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <input
                  type="range"
                  min="0.7"
                  max="2.8"
                  step="0.05"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="flex-1 accent-[#102A68] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCropScale(s => Math.min(2.8, +(s + 0.1).toFixed(2)))}
                  className="h-7 w-7 p-0 text-[#52627A] hover:text-[#102A68] hover:bg-slate-100 rounded-md"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-[12px] font-semibold text-[#18233A] w-10 text-right font-mono">
                  {Math.round(cropScale * 100)}%
                </span>
              </div>

              {/* Action Buttons: Rotate & Reset */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCropRotate(r => (r + 90) % 360)}
                  className="h-8 px-2.5 text-[12px] font-medium text-[#52627A] hover:text-[#102A68] hover:bg-slate-100 rounded-lg flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotate 90°
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCropScale(1);
                    setCropX(0);
                    setCropY(0);
                    setCropRotate(0);
                  }}
                  className="h-8 px-2.5 text-[12px] font-medium text-[#52627A] hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Reset Position
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-[#D5DDEA] bg-white flex items-center justify-between sm:justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCropOpen(false)}
              className="rounded-xl h-10 px-4 text-[13px] font-semibold border-[#D5DDEA] text-[#52627A] hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApplyCrop}
              className="rounded-xl h-10 px-5 text-[13px] font-bold bg-[#102A68] hover:bg-[#102A68]/90 text-white shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Apply & Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
