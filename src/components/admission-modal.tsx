'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, 
  FileText, Edit, Download, Camera, ArrowRight, ArrowLeft,
  CheckCircle2, Lock, ShieldCheck, Globe, Trash2, Check,
  Calendar, MapPin, Briefcase, Send, Heart, X, CreditCard, Printer
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
import { getNextStudentId, submitAdmissionForm, createRazorpayOrder } from "@/app/actions";
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
  { id: 1, title: 'Center', subtitle: 'Branch & Photo', icon: Building },
  { id: 2, title: 'Student', subtitle: 'Student Identity', icon: User },
  { id: 3, title: 'Parents', subtitle: 'Guardian Information', icon: Briefcase },
  { id: 4, title: 'Contact', subtitle: 'Address & Phone', icon: Phone },
  { id: 5, title: 'Academic', subtitle: 'Program & Review', icon: GraduationCap },
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
      async function fetchStudentId() {
        const result = await getNextStudentId();
        if (result.success && result.studentId) {
          form.setValue('studentId', result.studentId);
        } else {
          form.setValue('studentId', `IDL-${Date.now().toString().slice(-6)}`);
        }
      }
      fetchStudentId();
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
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
    } else if (targetStep > currentStep) {
      for (let s = currentStep; s < targetStep; s++) {
        const valid = await validateStep(s);
        if (!valid) return;
      }
      setCurrentStep(targetStep);
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

  return (
    <>
      <Script id="razorpay-checkout-modal-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Main Admission Popup Modal */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent 
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] max-w-[540px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-none focus:outline-hidden max-h-[92vh] flex flex-col"
        >
          <DialogTitle className="sr-only">Admission Application Form</DialogTitle>
          <DialogDescription className="sr-only">5-Step official admission enrollment form</DialogDescription>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full overflow-hidden">

              {/* Modal Top Header with Logo */}
              <div className="pt-5 pb-3 text-center border-b border-slate-100 dark:border-slate-800 relative shrink-0">
                <img 
                  src="/idllogo.png" 
                  alt="IDL Education Logo" 
                  className="h-8 w-auto object-contain mx-auto" 
                />
              </div>

              {/* Mind Map / 5-Step Progress Stepper */}
              <div className="px-5 pt-5 pb-3 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center justify-between relative">
                  {/* Background Progress Bar Line */}
                  <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute left-6 top-4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
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
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                            isCompleted 
                              ? "bg-primary text-white scale-100 shadow-sm" 
                              : isActive 
                                ? "bg-primary text-white ring-4 ring-primary/20 scale-110" 
                                : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-primary/50"
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span>{s.id}</span>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wider mt-1.5 transition-colors hidden sm:block",
                            isActive ? "text-primary font-black" : isCompleted ? "text-slate-700 dark:text-slate-300" : "text-slate-400"
                          )}
                        >
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Step Sub-Header */}
              <div className="px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Step {currentStep} of 5
                  </span>
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {STEPS[currentStep - 1].subtitle}
                  </h3>
                </div>
                <span className="text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {Math.round((currentStep / 5) * 100)}%
                </span>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto flex-1 min-h-[280px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* Provisional Student ID */}
                      <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  {...field} 
                                  readOnly 
                                  placeholder="Provisional Student ID"
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 cursor-default" 
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-slate-400 pointer-events-none">
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
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Building className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                    <SelectValue placeholder="Select Preferred Branch Node *" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {branches.map(b => (
                                      <SelectItem key={b} value={b} className="text-xs font-medium">{b}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Photo Upload Cell */}
                      <div className="p-4 px-6 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-3.5">
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-14 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer"
                          >
                            {photoPreview ? (
                              <>
                                <img src={photoPreview} alt="Student" className="object-cover h-full w-full" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold uppercase">
                                  Change
                                </div>
                              </>
                            ) : (
                              <Camera className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Passport Size Photograph</p>
                            <p className="text-[11px] text-muted-foreground font-medium">Recent color photo for ID card (JPG/PNG max 2MB)</p>
                          </div>
                        </div>
                        <div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl h-10 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer shadow-none"
                          >
                            <Camera className="w-3.5 h-3.5 mr-1.5 text-primary" />
                            {photoPreview ? 'Change' : 'Upload'}
                          </Button>
                          <Input
                            id="photo-upload-modal"
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                form.setValue('studentPhoto', file);
                                const reader = new FileReader();
                                reader.onloadend = () => setPhotoPreview(reader.result as string);
                                reader.readAsDataURL(file);
                              } else {
                                setPhotoPreview(null);
                              }
                            }}
                          />
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
                      className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* Student Name */}
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Student Full Name *" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Date of Birth 3-Part Selector */}
                      <FormField
                        control={form.control}
                        name="dob"
                        render={() => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Calendar className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <div className="pl-12 h-14 flex items-center divide-x divide-slate-100 dark:divide-slate-800">
                                  <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                    <SelectTrigger className="h-full border-0 rounded-none font-bold text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Day *" /></SelectTrigger>
                                    <SelectContent className="max-h-56">{availableDays.map(day => <SelectItem key={day} value={String(day)} className="text-xs">{day}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                    <SelectTrigger className="h-full border-0 rounded-none font-bold text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Month *" /></SelectTrigger>
                                    <SelectContent className="max-h-56">{months.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                    <SelectTrigger className="h-full border-0 rounded-none font-bold text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Year *" /></SelectTrigger>
                                    <SelectContent className="max-h-56">{years.map(y => <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Gender & Blood Group in 2-column cell */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                      <SelectValue placeholder="Select Gender *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male" className="text-xs">Male</SelectItem>
                                      <SelectItem value="female" className="text-xs">Female</SelectItem>
                                      <SelectItem value="other" className="text-xs">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bloodGroup"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Heart className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                      <SelectValue placeholder="Blood Group (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bloodGroups.map(bg => <SelectItem key={bg} value={bg} className="text-xs">{bg}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Aadhar & APAAR ID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                        <FormField
                          control={form.control}
                          name="aadharNumber"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <ShieldCheck className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="Aadhar UID (12 Digits - Optional)" 
                                    {...field} 
                                    maxLength={12}
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="apaarId"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="APAAR / ABC ID (Optional)" 
                                    {...field} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
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
                      className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* Father's Name */}
                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Father's Full Name *" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Father's Occupation */}
                      <FormField
                        control={form.control}
                        name="fatherOccupation"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Briefcase className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Father's Occupation (e.g. Business, Service)" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Mother's Name */}
                      <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Mother's Full Name *" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Mother's Occupation */}
                      <FormField
                        control={form.control}
                        name="motherOccupation"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Briefcase className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Mother's Occupation (e.g. Homemaker, Professional)" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* Email Address */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  type="email" 
                                  placeholder="Email Address *" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Father's Mobile & Mother's Mobile */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                        <FormField
                          control={form.control}
                          name="fatherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    type="tel" 
                                    placeholder="Father's Mobile (10-Digit) *" 
                                    {...field} 
                                    maxLength={10} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="motherPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    type="tel" 
                                    placeholder="Mother's Mobile (10-Digit) *" 
                                    {...field} 
                                    maxLength={10} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* State & Pincode */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Globe className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                      <SelectValue placeholder="Select State / UT *" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-56">
                                      {indianStates.map(st => <SelectItem key={st} value={st} className="text-xs font-medium">{st}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="Pincode (6 Digits) *" 
                                    {...field} 
                                    maxLength={6} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Full Residential Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-5 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Building className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Textarea 
                                  placeholder="Full Residential Address (House/Flat, Street, Area) *" 
                                  {...field} 
                                  className="min-h-[85px] pl-12 pt-4 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                    >
                      {/* Course / Program Applied */}
                      <FormField
                        control={form.control}
                        name="classApplied"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                    <SelectValue placeholder="Class / Program Applying For *" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-56">
                                    {classes.map((c, i) => <SelectItem key={`${c}-${i}`} value={c} className="text-xs font-medium">{c}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                          </FormItem>
                        )}
                      />

                      {/* Previous School */}
                      <FormField
                        control={form.control}
                        name="previousSchool"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Building className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Previous School / College Name (Optional)" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Special Remarks */}
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem className="space-y-0 border-t border-slate-100 dark:border-slate-800">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input 
                                  placeholder="Special Notes / Learning Requirements (Optional)" 
                                  {...field} 
                                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" 
                                  onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Review Summary Box */}
                      <div className="p-4 px-6 bg-slate-50/70 dark:bg-slate-800/40 text-left">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Application Snapshot</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-slate-400">Student: </span><strong className="text-slate-800 dark:text-slate-200">{form.watch('studentName') || '—'}</strong></div>
                          <div><span className="text-slate-400">Center: </span><strong className="text-slate-800 dark:text-slate-200">{form.watch('branch')?.split(',')[0] || '—'}</strong></div>
                          <div><span className="text-slate-400">Mobile: </span><strong className="text-slate-800 dark:text-slate-200">{form.watch('fatherPhone') || '—'}</strong></div>
                          <div><span className="text-slate-400">Program: </span><strong className="text-slate-800 dark:text-slate-200">{form.watch('classApplied') || '—'}</strong></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fixed Footer Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-11 px-4 rounded-xl font-black text-[11px] uppercase border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-none cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-11 px-6 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreview}
                      className="h-11 px-4 rounded-xl font-black text-[11px] uppercase border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-primary shadow-none transition-all cursor-pointer"
                    >
                      <FileText className="mr-1 h-3.5 w-3.5 text-primary" /> Preview A4
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
                      className="h-11 px-5 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                    >
                      <span>Submit (₹10)</span>
                      <Send className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
        <DialogContent className="sm:max-w-4xl h-[95vh] rounded-2xl p-0 overflow-hidden border border-border bg-white flex flex-col">
          <DialogHeader className="p-4 border-b bg-slate-50 flex flex-row items-center justify-between shrink-0">
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-lg font-bold text-slate-900">Application Preview (A4 Format)</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Single-page printable institutional enrollment copy</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg font-semibold h-8 text-xs cursor-pointer" onClick={() => setIsPreviewOpen(false)}>
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button size="sm" className="rounded-lg font-semibold h-8 text-xs bg-slate-800 text-white hover:bg-slate-700 cursor-pointer" onClick={generatePdf}>
                <Download className="w-3.5 h-3.5 mr-1" /> Save PDF
              </Button>
              <Button 
                size="sm" 
                className="rounded-lg font-semibold h-8 text-xs bg-primary text-white hover:bg-primary/90 cursor-pointer" 
                onClick={() => {
                  setIsPreviewOpen(false);
                  setIsPaymentDialogOpen(true);
                }}
              >
                <Lock className="w-3.5 h-3.5 mr-1" /> Pay &amp; Submit (₹10)
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto bg-slate-200/60 p-4 sm:p-8 flex justify-center items-start">
            <div 
              ref={previewRef} 
              className="bg-white text-slate-900 shadow-xl border border-slate-300 w-[794px] h-[1123px] max-h-[1123px] overflow-hidden p-8 flex flex-col justify-between box-border text-[11px] leading-tight select-none relative"
              style={{ minWidth: '794px', minHeight: '1123px' }}
            >
              <div>
                {/* Header with Organization Details */}
                <div className="border-b-2 border-primary/40 pb-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="/idllogo.png" alt="IDL Logo" className="h-16 w-auto object-contain" />
                    <div className="text-left space-y-0.5">
                      <h1 className="text-xl font-black tracking-tight text-primary uppercase">IDL EDUCATION ACADEMY</h1>
                      <p className="text-[11px] font-semibold text-slate-600">Premier Coaching Institute for Pre-Foundation, Boards, NEET & IIT-JEE</p>
                      <p className="text-[9.5px] text-slate-500">Regd. Office: Main Road, Patna, Bihar | Contact: +91 9430485906 | Web: idleducation.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="border border-primary/30 rounded px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider inline-block">
                      Official Admission Form
                    </div>
                    <p className="text-[9.5px] text-slate-500 mt-1">Session: 2026-2027</p>
                  </div>
                </div>

                {/* Identity Header Strip */}
                <div className="grid grid-cols-12 gap-4 border border-slate-300 bg-slate-50/70 p-3 rounded mb-4 items-center">
                  <div className="col-span-9 grid grid-cols-3 gap-2 text-left">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Application Form No.</span>
                      <span className="font-extrabold text-xs text-primary font-mono">{form.getValues('studentId') || 'PROV-2026-001'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Admission Center / Branch</span>
                      <span className="font-bold text-xs">{form.getValues('branch')?.split(',')[0] || 'Patna Center'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Date of Application</span>
                      <span className="font-bold text-xs">{format(new Date(), "dd MMMM yyyy")}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <div className="w-20 h-24 border border-slate-400 bg-white rounded flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-slate-400 font-bold text-center px-1">Affix Recent Photo</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid Info Sections */}
                <div className="space-y-3.5 text-left">
                  {/* Section 1 */}
                  <div>
                    <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 bg-slate-100/80 px-2 py-0.5">
                      1. Student Identity & Details
                    </h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-2">
                      <div><span className="text-slate-500">Student Name:</span> <strong className="uppercase">{form.getValues('studentName') || '—'}</strong></div>
                      <div><span className="text-slate-500">Date of Birth:</span> <strong>{formatDateForDisplay(form.getValues('dob')) || '—'}</strong></div>
                      <div><span className="text-slate-500">Gender:</span> <strong className="capitalize">{form.getValues('gender') || '—'}</strong></div>
                      <div><span className="text-slate-500">Blood Group:</span> <strong>{form.getValues('bloodGroup') || 'N/A'}</strong></div>
                      <div><span className="text-slate-500">Aadhar UID:</span> <strong>{form.getValues('aadharNumber') || 'N/A'}</strong></div>
                      <div><span className="text-slate-500">APAAR / ABC ID:</span> <strong>{form.getValues('apaarId') || 'N/A'}</strong></div>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 bg-slate-100/80 px-2 py-0.5">
                      2. Parent / Guardian Information
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-2">
                      <div><span className="text-slate-500">Father's Name:</span> <strong>{form.getValues('fatherName') || '—'}</strong></div>
                      <div><span className="text-slate-500">Father's Occupation:</span> <strong>{form.getValues('fatherOccupation') || '—'}</strong></div>
                      <div><span className="text-slate-500">Mother's Name:</span> <strong>{form.getValues('motherName') || '—'}</strong></div>
                      <div><span className="text-slate-500">Mother's Occupation:</span> <strong>{form.getValues('motherOccupation') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 bg-slate-100/80 px-2 py-0.5">
                      3. Contact & Residential Address
                    </h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 px-2">
                      <div className="col-span-2"><span className="text-slate-500">Residential Address:</span> <strong>{form.getValues('address') || '—'}</strong></div>
                      <div><span className="text-slate-500">State / Pincode:</span> <strong>{form.getValues('state') || '—'} - {form.getValues('pincode') || '—'}</strong></div>
                      <div><span className="text-slate-500">Email:</span> <strong>{form.getValues('email') || '—'}</strong></div>
                      <div><span className="text-slate-500">Father's Mobile:</span> <strong>{form.getValues('fatherPhone') || '—'}</strong></div>
                      <div><span className="text-slate-500">Mother's Mobile:</span> <strong>{form.getValues('motherPhone') || '—'}</strong></div>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h2 className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 bg-slate-100/80 px-2 py-0.5">
                      4. Course & Academic Profile
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-2">
                      <div><span className="text-slate-500">Course / Class Enrolled:</span> <strong className="text-primary">{form.getValues('classApplied') || '—'}</strong></div>
                      <div><span className="text-slate-500">Previous Institution:</span> <strong>{form.getValues('previousSchool') || '—'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Declaration & Signatures */}
              <div className="border-t border-slate-300 pt-3 mt-4 text-left">
                <p className="text-[8.5px] text-slate-600 mb-6 leading-relaxed">
                  <strong>Declaration:</strong> I hereby declare that the particulars given above are correct to the best of my knowledge. I agree to abide by the disciplinary rules, attendance policy, and academic schedule of IDL Education Academy. Fees once paid for registration are non-refundable.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center items-end pt-4">
                  <div>
                    <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
                    <span className="text-[9.5px] font-semibold text-slate-600">Student Signature</span>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
                    <span className="text-[9.5px] font-semibold text-slate-600">Parent / Guardian Signature</span>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 w-36 mx-auto mb-1"></div>
                    <span className="text-[9.5px] font-semibold text-primary">Authorized IDL Stamp & Sign</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Razorpay Payment Verification Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border border-border">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Application Processing Fee</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              A nominal processing fee of ₹10 is required to generate your admission confirmation ID.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold">{form.getValues('studentName')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program Applied</span>
              <span className="font-bold">{form.getValues('classApplied')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
              <span>Total Payable</span>
              <span className="text-primary">₹10.00</span>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} className="w-full sm:w-auto text-xs font-bold cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isSubmitting} className="w-full sm:w-auto text-xs font-bold bg-primary text-white cursor-pointer">
              {isSubmitting ? 'Connecting...' : 'Pay ₹10 via Razorpay'}
            </Button>
          </DialogFooter>

          <div className="text-center pt-2">
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit Encrypted Secure Payment
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
          className="sm:max-w-lg p-0 rounded-2xl overflow-hidden bg-slate-100 border-0"
        >
          <DialogTitle className="sr-only">Student ID Card</DialogTitle>
          <DialogDescription className="sr-only">Download your student identity card</DialogDescription>

          {/* Header */}
          <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Complete</p>
              <h3 className="text-sm font-black text-slate-900">Your Student ID Card</h3>
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
                className="h-8 text-xs font-bold rounded-lg cursor-pointer"
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
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [86, 54] });
                    pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);
                    pdf.save(`${submittedData?.studentName || 'Student'}_IDCard.pdf`);
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 mr-1" /> PDF
              </Button>
            </div>
          </div>

          {/* Card Preview Area */}
          <div className="p-6 flex items-center justify-center">
            {/* ID Card — credit-card proportions 85.6 × 54mm, rendered at 380×240px */}
            <div
              ref={idCardRef}
              className="relative overflow-hidden select-none"
              style={{
                width: 380,
                height: 240,
                borderRadius: 16,
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Holographic shimmer strip top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: 'linear-gradient(90deg, #f59e0b, #10b981, #3b82f6, #8b5cf6, #f59e0b)',
              }} />

              {/* Background pattern circles */}
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 200, height: 200, borderRadius: '50%',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.15)',
              }} />
              <div style={{
                position: 'absolute', bottom: -60, left: -30,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.12)',
              }} />

              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: 4, bottom: 0, width: 4,
                background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)',
              }} />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 10, padding: '18px 16px 16px 20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                {/* Top: Logo + Institute name */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src="/idllogo.png" alt="IDL" style={{ height: 28, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>IDL Education</p>
                      <p style={{ margin: 0, fontSize: 7, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Academy • Patna</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 6.5, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student ID Card</p>
                    <p style={{ margin: 0, fontSize: 6.5, color: 'rgba(255,255,255,0.35)' }}>Session 2026-27</p>
                  </div>
                </div>

                {/* Middle: Photo + Details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 6 }}>
                  {/* Photo */}
                  <div style={{
                    width: 64, height: 76, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', padding: 4 }}>
                        <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.3)' }}>👤</div>
                        <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.3)' }}>No Photo</p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {submittedData?.studentName || '—'}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 7, color: 'rgba(255,255,255,0.5)' }}>S/O {submittedData?.fatherName || '—'}</p>

                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student ID</p>
                        <p style={{ margin: 0, fontSize: 7.5, fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{submittedData?.studentId || '—'}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date of Birth</p>
                        <p style={{ margin: 0, fontSize: 7.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{submittedData?.dob ? formatDateForDisplay(submittedData.dob) : '—'}</p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Program / Class</p>
                        <p style={{ margin: 0, fontSize: 7.5, fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{submittedData?.classApplied || '—'}</p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Center / Branch</p>
                        <p style={{ margin: 0, fontSize: 7, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{submittedData?.branch?.split(',')[0] || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Issue Date</p>
                    <p style={{ margin: 0, fontSize: 7, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{format(new Date(), 'dd MMM yyyy')}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {/* Barcode visual */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 20, justifyContent: 'center' }}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{
                          width: i % 3 === 0 ? 2 : 1,
                          height: 12 + (i % 5) * 1.5,
                          background: 'rgba(255,255,255,0.4)',
                          borderRadius: 1,
                        }} />
                      ))}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: 5.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em', fontFamily: 'monospace' }}>{submittedData?.studentId}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.35)' }}>idleducation.in</p>
                    <p style={{ margin: 0, fontSize: 6, color: 'rgba(255,255,255,0.25)' }}>+91 9430485906</p>
                  </div>
                </div>
              </div>

              {/* Holographic shimmer strip bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981, #f59e0b, #8b5cf6)',
                opacity: 0.7,
              }} />
            </div>
          </div>

          {/* Footer note */}
          <div className="px-6 pb-5 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              This is a provisional digital ID card. Physical ID card will be issued at the center.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              onClick={() => {
                setIsIdCardOpen(false);
                onOpenChange(false);
                setPhotoPreview(null);
              }}
            >
              Close & Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
