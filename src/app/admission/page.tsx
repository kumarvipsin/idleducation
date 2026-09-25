'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, 
  FileText, Edit, Download, Camera, ArrowRight, ArrowLeft,
  CheckCircle2, Lock, ShieldCheck, Globe, Trash2, Check,
  Calendar, MapPin, Briefcase, Send, Heart, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
import { PhotoCropModal } from "@/components/admission/photo-crop-modal";
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
  motherPhone: z.string().optional().or(z.literal('')),
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
  { id: 1, title: 'Branch', subtitle: 'Branch & Session', icon: Building },
  { id: 2, title: 'Student', subtitle: 'Student Details', icon: User },
  { id: 3, title: 'Parent', subtitle: 'Parent Details', icon: Briefcase },
  { id: 4, title: 'Contact', subtitle: 'Contact Details', icon: Phone },
  { id: 5, title: 'Academic', subtitle: 'Academic Details', icon: GraduationCap },
];

export default function AdmissionPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [activeCropImage, setActiveCropImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
      state: '',
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
    async function fetchStudentId() {
        const result = await getNextStudentId();
        if (result.success && result.studentId) {
            form.setValue('studentId', result.studentId);
        } else {
            form.setValue('studentId', `IDL-${Date.now().toString().slice(-6)}`);
        }
    }
    fetchStudentId();
  }, [form]);

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
      fieldsToValidate = ['studentName', 'dob', 'gender', 'classApplied'];
      if (form.getValues('studentPhone')) {
        fieldsToValidate.push('studentPhone');
      }
    } else if (step === 3) {
      fieldsToValidate = ['fatherName', 'fatherPhone'];
      if (form.getValues('parentEmail')) {
        fieldsToValidate.push('parentEmail');
      }
    } else if (step === 4) {
      fieldsToValidate = ['address', 'city', 'state', 'pincode'];
      if (form.getValues('email')) {
        fieldsToValidate.push('email');
      }
      if (form.getValues('emergencyContact')) {
        fieldsToValidate.push('emergencyContact');
      }
    } else if (step === 5) {
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
      "branch", "studentName", "dob", "gender", "classApplied", "fatherName", "fatherPhone", "address", "city", "state", "pincode"
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
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });
        
        const result = await submitAdmissionForm(formData);

        if (result.success) {
            setIsThankYouOpen(true);
            setIsPreviewOpen(false);
            setIsPaymentDialogOpen(false);
            form.reset();
            setDob({ day: '', month: '', year: '' });
            setPhotoPreview(null);
            if(fileInputRef.current) fileInputRef.current.value = '';
            const nextIdResult = await getNextStudentId();
            if (nextIdResult.success && nextIdResult.studentId) {
                form.setValue('studentId', nextIdResult.studentId);
            }
        } else {
            toast({ variant: "destructive", title: "Submission Failed", description: result.message });
        }
    } catch (error) {
        console.error("Submission failed:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to submit admission form. Please try again." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handlePayment = async () => {
    const result = await createRazorpayOrder({ amount: 1000, currency: 'INR' });
    if (!result.success || !result.order) {
        toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not create payment order.' });
        return;
    }
    const order = result.order;
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'IDL EDUCATION',
        description: 'Admission Registration Fee',
        order_id: order.id,
        handler: async function (response: any) {
            form.setValue('transactionId', response.razorpay_payment_id);
            await form.handleSubmit(onSubmit)();
        },
        prefill: {
            name: form.getValues('studentName'),
            email: form.getValues('email'),
            contact: form.getValues('fatherPhone'),
        },
        theme: { color: '#002B49' },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const classes = [
    "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIII", "CLASS IX", "CLASS X", "CLASS XI", "CLASS XII",
    "JEE (MAIN + ADVANCED)", "NEET (MEDICAL)", "CUET (UG)", "CBSE BOARD", "NIOS", "SSC CGL / CHSL", "BANK PO / CLERK", "RRB NTPC", "CLAT", "GATE", "DEFENCE / NDA", "DELHI POLICE"
  ];
  
  const branches = [
    "Mukherjee Nagar, Delhi-110009",
    "Mangol Puri, Delhi-110083",
    "Krishan Vihar, Delhi-110086",
    "Budh Vihar, Delhi-110086"
  ];
  
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
    <div className="min-h-[90vh] w-full flex items-center justify-center p-4 py-8 bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[560px]"
      >
        {/* Top Header: Title + Close */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              Admission Form 2026–27
            </h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 font-normal">
              Complete the steps below to apply for admission.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer mt-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Card (Contact-Us Card UI Style) */}
        <Card className="shadow-none rounded-2xl border-2 border-primary/10 bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col overflow-hidden">

                {/* Mind Map / 5-Step Progress Stepper */}
                <div className="px-5 pt-6 pb-4 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
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
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
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
                              isActive ? "text-primary font-bold" : isCompleted ? "text-slate-700 dark:text-slate-300" : "text-slate-400"
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
                <div className="px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400/90 uppercase tracking-widest block">
                      Step {currentStep} of 5
                    </span>
                    <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {STEPS[currentStep - 1].subtitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {Math.round((currentStep / 5) * 100)}%
                  </span>
                </div>

                {/* Step Form Body (Divided Input Cells) */}
                <div className="flex flex-col min-h-[300px] justify-center">
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
                        {/* Provisional Student ID & Admission Session */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="studentId"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <FileText className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      {...field} 
                                      readOnly 
                                      placeholder="Provisional Student ID"
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-semibold text-[13px] text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal cursor-default" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium uppercase tracking-wider text-slate-400/80 pointer-events-none">
                                      Auto ID
                                    </span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <div className="relative group h-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <Calendar className="h-4 w-4 text-slate-400" />
                            </div>
                            <Input 
                              readOnly 
                              value="Admission Session: 2026–27"
                              className="pl-12 h-14 bg-transparent border-0 rounded-none font-semibold text-[13px] text-primary transition-all focus-visible:ring-0 focus-visible:ring-offset-0 cursor-default" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded pointer-events-none">
                              Active
                            </span>
                          </div>
                        </div>

                        {/* Preferred Branch * */}
                        <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Building className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                      <SelectValue placeholder="Preferred Branch *" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {branches.map(b => (
                                        <SelectItem key={b} value={b} className="text-xs font-medium">{b}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                            </FormItem>
                          )}
                        />

                        {/* Photo Upload Cell */}
                        <div className="p-4 px-6 flex items-center justify-between gap-4 bg-white dark:bg-slate-900">
                          <div className="flex items-center gap-3.5">
                            <div 
                              onClick={() => {
                                if (photoPreview) {
                                  setActiveCropImage(photoPreview);
                                  setIsCropOpen(true);
                                } else {
                                  fileInputRef.current?.click();
                                }
                              }}
                              className="w-14 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer"
                              title={photoPreview ? "Click to crop & adjust" : "Click to upload"}
                            >
                              {photoPreview ? (
                                <>
                                  <img src={photoPreview} alt="Student" className="object-cover h-full w-full" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-bold uppercase">
                                    Adjust
                                  </div>
                                </>
                              ) : (
                                <Camera className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-200">
                                {photoPreview ? "Photo Uploaded" : "Passport Size Photograph"}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-medium">3.5 × 4.5 cm • JPG or PNG</p>
                            </div>
                          </div>
                          <div>
                            {photoPreview ? (
                              <div className="flex items-center gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => {
                                    if (photoPreview) {
                                      setActiveCropImage(photoPreview);
                                      setIsCropOpen(true);
                                    }
                                  }}
                                  className="rounded-xl h-10 px-3 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer shadow-none"
                                >
                                  Adjust
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="rounded-xl h-10 px-3 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer shadow-none"
                                >
                                  Change
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl h-10 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 cursor-pointer shadow-none"
                              >
                                <Camera className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                Upload
                              </Button>
                            )}
                            <Input
                              id="photo-upload"
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
                        {/* Student Full Name * */}
                        <FormField
                          control={form.control}
                          name="studentName"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <User className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="Student Full Name *" 
                                    {...field} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize"
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                            </FormItem>
                          )}
                        />

                        {/* Date of Birth * (Day, Month, Year) */}
                        <FormField
                          control={form.control}
                          name="dob"
                          render={() => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <div className="pl-12 h-14 flex items-center divide-x divide-slate-100 dark:divide-slate-800">
                                    <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                      <SelectTrigger className="h-full border-0 rounded-none font-medium text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Day *" /></SelectTrigger>
                                      <SelectContent className="max-h-56">{availableDays.map(day => <SelectItem key={day} value={String(day)} className="text-xs">{day}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                      <SelectTrigger className="h-full border-0 rounded-none font-medium text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Month *" /></SelectTrigger>
                                      <SelectContent className="max-h-56">{months.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                      <SelectTrigger className="h-full border-0 rounded-none font-medium text-[13px] focus:ring-0 focus-visible:ring-0 shadow-none"><SelectValue placeholder="Year *" /></SelectTrigger>
                                      <SelectContent className="max-h-56">{years.map(y => <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                            </FormItem>
                          )}
                        />

                        {/* Gender * & Class / Course * in 2-column cell */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <User className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
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
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="classApplied"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <GraduationCap className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                        <SelectValue placeholder="Class / Course *" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">
                                        {classes.map((c, i) => (
                                          <SelectItem key={`${c}-${i}`} value={c} className="text-xs font-medium">{c}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Board & Applying For / Program in 2-column cell */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="board"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Building className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                        <SelectValue placeholder="Board (Optional)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {boards.map(b => (
                                          <SelectItem key={b} value={b} className="text-xs font-medium">{b}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="program"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <GraduationCap className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                        <SelectValue placeholder="Applying For / Program (Optional)" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {programs.map(p => (
                                          <SelectItem key={p} value={p} className="text-xs font-medium">{p}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Student Mobile Number (if applicable) */}
                        <FormField
                          control={form.control}
                          name="studentPhone"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Phone className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    type="tel" 
                                    placeholder="Student Mobile Number (Optional)" 
                                    {...field} 
                                    maxLength={10} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                            </FormItem>
                          )}
                        />
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
                        {/* Father / Guardian Name * & Mother Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="fatherName"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <User className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Father / Guardian Name *" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <User className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Mother Name (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Parent Mobile Number * & Parent Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="fatherPhone"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Phone className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      type="tel" 
                                      placeholder="Parent Mobile Number *" 
                                      {...field} 
                                      maxLength={10} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="parentEmail"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Mail className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      type="email" 
                                      placeholder="Parent Email (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Occupation (optional) */}
                        <FormField
                          control={form.control}
                          name="fatherOccupation"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Briefcase className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="Occupation (Optional, e.g. Business / Government / Service)" 
                                    {...field} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize" 
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
                        {/* Student / Parent Email & Emergency Contact Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Mail className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      type="email" 
                                      placeholder="Student / Parent Email (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(e.target.value.toLowerCase())} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="emergencyContact"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Phone className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      type="tel" 
                                      placeholder="Emergency Contact Number (Optional)" 
                                      {...field} 
                                      maxLength={10} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Full Address * */}
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-5 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <Building className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Textarea 
                                    placeholder="Full Address (House/Flat No., Street, Area, Landmark) *" 
                                    {...field} 
                                    className="min-h-[85px] pl-12 pt-4 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal resize-none" 
                                    onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                            </FormItem>
                          )}
                        />

                        {/* City *, State *, Pincode * in 3-column cell */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="City *" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Globe className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                        <SelectValue placeholder="Select State *" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">
                                        {indianStates.map(st => <SelectItem key={st} value={st} className="text-xs font-medium">{st}</SelectItem>)}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
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
                                      <MapPin className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Pincode (6 Digits) *" 
                                      {...field} 
                                      maxLength={6} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-semibold" />
                              </FormItem>
                            )}
                          />
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
                        className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800"
                      >
                        {/* Previous School Name & Previous Class */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="previousSchool"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <Building className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Previous School Name (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="previousClass"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <GraduationCap className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                                        <SelectValue placeholder="Previous Class (Optional)" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-56">
                                        {previousClasses.map(pc => (
                                          <SelectItem key={pc} value={pc} className="text-xs font-medium">{pc}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Previous Percentage / Grade & Stream / Subjects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                            control={form.control}
                            name="previousPercentage"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <FileText className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Previous Percentage / Grade (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="stream"
                            render={({ field }) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <div className="relative group h-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                      <GraduationCap className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <Input 
                                      placeholder="Stream / Subjects (Optional)" 
                                      {...field} 
                                      className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal capitalize" 
                                      onChange={(e) => field.onChange(capitalizeWords(e.target.value))} 
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Scholarship / Entrance Test (if applicable) */}
                        <FormField
                          control={form.control}
                          name="scholarshipTest"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormControl>
                                <div className="relative group h-full">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400/70 group-focus-within:text-primary transition-colors" />
                                  </div>
                                  <Input 
                                    placeholder="Scholarship / Entrance Test (Optional)" 
                                    {...field} 
                                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400/70 placeholder:font-normal" 
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Review Summary Box */}
                        <div className="p-4 px-6 bg-slate-50/70 dark:bg-slate-800/40 text-left">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Application Snapshot</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div><span className="text-slate-400 block text-[10px]">Student:</span><strong className="text-slate-800 dark:text-slate-200 truncate block">{form.watch('studentName') || '—'}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Center:</span><strong className="text-slate-800 dark:text-slate-200 truncate block">{form.watch('branch')?.split(',')[0] || '—'}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Parent Mobile:</span><strong className="text-slate-800 dark:text-slate-200 truncate block">{form.watch('fatherPhone') || '—'}</strong></div>
                            <div><span className="text-slate-400 block text-[10px]">Course / Program:</span><strong className="text-slate-800 dark:text-slate-200 truncate block">{form.watch('classApplied') || '—'}</strong></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Controls: Back & Next / Submit Actions */}
                <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary uppercase tracking-wide transition-colors cursor-pointer py-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 uppercase tracking-wide transition-colors cursor-pointer py-2 group"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary uppercase tracking-wide transition-colors cursor-pointer py-2"
                      >
                        <FileText className="h-3.5 w-3.5 text-primary" /> Preview A4
                      </button>
                      <Button
                        type="button"
                        onClick={() => {
                          form.trigger().then(isValid => {
                            if (isValid) setIsPaymentDialogOpen(true);
                            else toast({ variant: "destructive", title: "Incomplete Form", description: "Please fill all required fields before proceeding." });
                          });
                        }}
                        className="h-10 sm:h-11 px-5 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] group uppercase cursor-pointer"
                      >
                        <span>Submit (₹10)</span>
                        <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  )}
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* 1-Page A4 PDF Review Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl h-[95vh] rounded-2xl p-0 overflow-hidden border border-border bg-white flex flex-col">
          <DialogHeader className="p-4 border-b bg-slate-50 flex flex-row items-center justify-between shrink-0">
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-lg font-bold text-slate-900">Application Preview (A4 Format)</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">Single-page printable institutional enrollment copy</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg font-semibold h-8 text-xs" onClick={() => setIsPreviewOpen(false)}>
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button size="sm" className="rounded-lg font-semibold h-8 text-xs bg-primary text-white" onClick={generatePdf}>
                <Download className="w-3.5 h-3.5 mr-1" /> Save PDF
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-slate-100 p-4">
            {/* Exactly 1 Single-Page A4 Document Container */}
            <div 
              ref={previewRef} 
              className="bg-white text-slate-900 p-6 mx-auto border border-slate-300"
              style={{ width: '750px', minHeight: '1000px', maxHeight: '1050px', boxSizing: 'border-box' }}
            >
              {/* Institutional Header */}
              <div className="border-b-2 border-[#002B49] pb-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                  <img src="/idllogo.png" alt="IDL Education" className="h-10 w-auto object-contain" />
                  <div className="border-l border-slate-300 pl-3.5 space-y-0.5">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#334155', fontWeight: 600 }}>
                      <span>Telephone: 011 45035713</span>
                      <span style={{ color: '#94a3b8' }}>|</span>
                      <span>Email: info@idleducation.in</span>
                      <span style={{ color: '#94a3b8' }}>|</span>
                      <span>Website: www.idleducation.in</span>
                    </div>

                  </div>
                </div>
                <div className="text-right flex items-center">
                  <span className="bg-[#002B49] text-white text-[10px] font-bold px-3 py-1.5 rounded inline-block uppercase text-center">ADMISSION FORM 2026-27</span>
                </div>
              </div>

              {/* ID & Photo Top Bar */}
              <div className="flex justify-between items-start gap-4 mb-4 pb-3 border-b border-slate-200">
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 text-left text-xs">
                  <div><span className="text-[10px] font-semibold text-slate-500">Student ID: </span><strong className="text-slate-900">{form.getValues('studentId')}</strong></div>
                  <div className="flex"><span className="text-[10px] font-semibold text-slate-500 shrink-0">Branch:&nbsp;</span><strong className="text-slate-900">{form.getValues('branch') || '—'}</strong></div>
                  <div><span className="text-[10px] font-semibold text-slate-500">Admission Session: </span><strong className="text-slate-900">{form.getValues('admissionSession') || '2026–27'}</strong></div>
                  <div><span className="text-[10px] font-semibold text-slate-500">Class / Course: </span><strong className="text-slate-900">{form.getValues('classApplied') || '—'}</strong></div>
                </div>
                <div className="w-20 h-24 border border-slate-300 rounded bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Student Photo" className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-8 h-8 opacity-20 text-slate-500" />
                  )}
                </div>
              </div>

              {/* 1. Student Identity Table */}
              <div className="mb-3.5 text-left">
                <div className="bg-slate-100 px-2.5 py-1 border border-slate-300 font-bold text-[11px] text-[#002B49] uppercase">
                  1. Student Identity
                </div>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Full Name:</td>
                      <td className="p-1.5 font-bold text-slate-900 w-1/4">{form.getValues('studentName') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Date of Birth:</td>
                      <td className="p-1.5 font-bold text-slate-900 w-1/4">{formatDateForDisplay(form.getValues('dob')) || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Gender:</td>
                      <td className="p-1.5 font-medium text-slate-900">{capitalizeWords(form.getValues('gender') || '') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Class / Course:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('classApplied') || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Board:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('board') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Applying For / Program:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('program') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Student Mobile:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">{form.getValues('studentPhone') || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2. Parents / Guardian Table */}
              <div className="mb-3.5 text-left">
                <div className="bg-slate-100 px-2.5 py-1 border border-slate-300 font-bold text-[11px] text-[#002B49] uppercase">
                  2. Parents / Guardian Information
                </div>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Father / Guardian Name:</td>
                      <td className="p-1.5 font-bold text-slate-900 w-1/4">{form.getValues('fatherName') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Mother Name:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('motherName') || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Parent Mobile:</td>
                      <td className="p-1.5 font-bold text-slate-900">{form.getValues('fatherPhone') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Parent Email:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('parentEmail') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Occupation:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">{form.getValues('fatherOccupation') || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 3. Contact & Address Table */}
              <div className="mb-3.5 text-left">
                <div className="bg-slate-100 px-2.5 py-1 border border-slate-300 font-bold text-[11px] text-[#002B49] uppercase">
                  3. Contact & Residential Address
                </div>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Student / Parent Email:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('email') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Emergency Contact:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('emergencyContact') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Full Address:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">
                        {form.getValues('address') ? `${form.getValues('address')}, ${form.getValues('city') ? `${form.getValues('city')}, ` : ''}${form.getValues('state')} - ${form.getValues('pincode')}` : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Academic Details */}
              <div className="mb-4 text-left">
                <div className="bg-slate-100 px-2.5 py-1 border border-slate-300 font-bold text-[11px] text-[#002B49] uppercase">
                  4. Academic Details
                </div>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Previous School:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('previousSchool') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Previous Class:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('previousClass') || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Percentage / Grade:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('previousPercentage') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Stream / Subjects:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('stream') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Scholarship / Entrance Test:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">{form.getValues('scholarshipTest') || 'None'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Declaration & Signatures */}
              <div className="border-t border-slate-300 pt-3 text-left">
                <p className="text-[9.5px] text-slate-600 italic leading-tight">
                  Declaration: I hereby solemnly declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief.
                </p>

                <div className="flex justify-between items-end pt-8">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-900 pb-4" />
                    <p className="text-[10px] font-bold text-slate-800 uppercase mt-1">Student's Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full border-b border-slate-900 pb-4" />
                    <p className="text-[10px] font-bold text-slate-800 uppercase mt-1">Parent/Guardian Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-900 pb-4" />
                    <p className="text-[10px] font-bold text-[#002B49] uppercase mt-1">Authorized Signatory</p>
                  </div>
                </div>
              </div>

            </div>
          </ScrollArea>

          <div className="p-3.5 border-t bg-slate-50 flex items-center justify-between shrink-0">
            <span className="text-xs text-muted-foreground font-medium">
              Verified details? Proceed to confirm and pay.
            </span>
            <Button 
              className="h-9 px-5 rounded-lg font-bold text-xs bg-primary text-white" 
              onClick={() => { setIsPreviewOpen(false); setIsPaymentDialogOpen(true); }}
            >
              <span>Confirm & Pay (₹10)</span>
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clean Razorpay Payment Modal */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl border border-border p-6 bg-white text-slate-900">
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">Registration Fee</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">IDL Education Academic Session 2026–27</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-700">Application Charge</p>
                <p className="text-[10px] text-muted-foreground">One-time registration</p>
              </div>
              <span className="text-xl font-bold text-primary">₹10.00</span>
            </div>

            <Button 
              type="button" 
              onClick={handlePayment} 
              disabled={isSubmitting}
              className="w-full h-11 rounded-lg font-bold text-xs bg-primary hover:bg-primary/90 text-white"
            >
              {isSubmitting ? 'Processing...' : 'Pay ₹10.00 via Razorpay'}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground">
              Secure 128-bit Encrypted Transaction
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Clean Success Modal */}
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white text-center">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Application Submitted!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Your admission form has been received. Our team will contact you shortly.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-10 rounded-lg font-bold text-xs bg-primary text-white">
              Done
            </Button>
          </DialogFooter>
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

    </div>
  );
}