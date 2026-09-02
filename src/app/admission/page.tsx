'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, 
  FileText, Edit, Download, Camera, ArrowRight,
  CheckCircle2, Lock, ShieldCheck, Globe, Trash2, Check
} from "lucide-react";
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

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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
    "Mukherjee Nagar Center, Delhi-110009",
    "Mangol Puri Center, Delhi-110083",
    "Budh Vihar Center, Delhi-110086",
    "Burari Center, Delhi-110084"
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
    <div className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="container mx-auto py-6 sm:py-8 px-4 max-w-4xl">
        
        {/* Main Form Card (Shadow Free, Crisp & Premium) */}
        <div className="border border-border/80 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-none">
          
          {/* Form Content Area */}
          <div className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

                {/* Section 1: Registration ID, Branch & Student Photo */}
                <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    
                    <div className="sm:col-span-8 space-y-4 text-left">
                      <div className="flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-700">
                        <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">1</span>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Registration & Preferred Center
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Provisional Student ID
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  readOnly 
                                  className="h-10 rounded-lg font-bold bg-white dark:bg-slate-900 border-slate-200 text-primary text-xs tracking-wide" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem className="space-y-1">
                              <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nearest Branch Node <span className="text-rose-500">*</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-slate-200 text-xs">
                                    <SelectValue placeholder="Select Preferred Branch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {branches.map(b => (
                                    <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Passport Photo Upload Card */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center">
                      <FormField
                        control={form.control}
                        name="studentPhoto"
                        render={({ field: { onChange, value, ...rest } }) => (
                          <FormItem className="space-y-1.5 text-center">
                            <FormLabel htmlFor="photo-upload" className="cursor-pointer block">
                              <div className="w-24 h-28 rounded-lg bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden relative group">
                                {photoPreview ? (
                                  <>
                                    <img src={photoPreview} alt="Student" className="object-cover h-full w-full" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                      Change
                                    </div>
                                  </>
                                ) : (
                                  <div className="p-2 text-center text-muted-foreground space-y-1">
                                    <Camera className="w-4 h-4 mx-auto text-slate-400" />
                                    <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Photo</p>
                                    <span className="text-[9px] text-muted-foreground">Upload</span>
                                  </div>
                                )}
                              </div>
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="photo-upload"
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  onChange(file);
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setPhotoPreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                  } else {
                                    setPhotoPreview(null);
                                  }
                                }}
                                {...rest}
                              />
                            </FormControl>
                            <p className="text-[9.5px] text-muted-foreground">Passport size photo</p>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Student Identity */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b pb-2 border-border">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">2</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Student Identity & Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Student Full Name <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Rahul Sharma" 
                              {...field} 
                              className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"
                              onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dob"
                      render={() => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Date of Birth <span className="text-rose-500">*</span>
                          </FormLabel>
                          <div className="grid grid-cols-3 gap-1.5">
                            <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Day" /></SelectTrigger>
                              <SelectContent>{availableDays.map(day => <SelectItem key={day} value={String(day)} className="text-xs">{day}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Month" /></SelectTrigger>
                              <SelectContent>{months.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Year" /></SelectTrigger>
                              <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Gender <span className="text-rose-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male" className="text-xs">Male</SelectItem>
                              <SelectItem value="female" className="text-xs">Female</SelectItem>
                              <SelectItem value="other" className="text-xs">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Select Blood Group" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{bloodGroups.map(bg => <SelectItem key={bg} value={bg} className="text-xs">{bg}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aadharNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aadhar UID (12 Digits)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12-digit Aadhar number" 
                              {...field} 
                              maxLength={12}
                              className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apaarId"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">APAAR / ABC ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="One Nation One Student ID" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: Parents / Guardian Information */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b pb-2 border-border">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">3</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Parents / Guardian Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Father's Name <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Father's full name" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatherOccupation"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Father's Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Business, Service, Teacher" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Mother's Name <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Mother's full name" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motherOccupation"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mother's Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Homemaker, Professional" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 4: Contact & Residential Address */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b pb-2 border-border">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">4</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Contact & Residential Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Email Address <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="student@example.com" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(e.target.value.toLowerCase())} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="10-digit mobile number" {...field} maxLength={10} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Father's Mobile <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="10-digit mobile number" {...field} maxLength={10} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Mother's Mobile <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="10-digit mobile number" {...field} maxLength={10} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Residential Address <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea placeholder="House / Flat No., Street, Landmark, Area" {...field} className="min-h-[65px] rounded-lg bg-white dark:bg-slate-900 border-border text-xs resize-none" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            State / UT <span className="text-rose-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Select State" /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-56">{indianStates.map(st => <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Pincode (6 Digits) <span className="text-rose-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 110009" {...field} maxLength={6} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 5: Academic Program & Previous School */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b pb-2 border-border">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-[11px] font-bold inline-flex items-center justify-center">5</span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Academic Program & Previous School
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="classApplied"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Class / Program Applying For <span className="text-rose-500">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs"><SelectValue placeholder="Select Program / Class" /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-56">{classes.map((c, i) => <SelectItem key={`${c}-${i}`} value={c} className="text-xs">{c}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Previous School / College Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Previous Institution Name" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Special Notes / Medical Remarks (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Any additional remarks or learning requirements" {...field} className="h-10 rounded-lg bg-white dark:bg-slate-900 border-border text-xs" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Footer */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">


                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full sm:w-auto h-10 px-5 rounded-lg font-bold text-xs border-border hover:bg-slate-50 transition-colors" 
                      onClick={handlePreview}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5 text-primary" /> 
                      Preview Application
                    </Button>
                    
                    <Button 
                      type="button" 
                      className="w-full sm:w-auto h-10 px-6 rounded-lg font-bold text-xs bg-primary hover:bg-primary/90 text-white transition-all active:scale-[0.98]" 
                      onClick={() => {
                        form.trigger().then(isValid => {
                          if (isValid) setIsPaymentDialogOpen(true);
                          else toast({ variant: "destructive", title: "Incomplete Form", description: "Please fill all required fields before proceeding." });
                        });
                      }}
                    >
                      <span>Proceed to Submit (₹10)</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

              </form>
            </Form>
          </div>
        </div>
      </div>

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
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><img src="/icon-phone.svg" alt="" width="11" height="11" /> 011 45035713</span>
                      <span style={{ color: '#94a3b8' }}>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><img src="/icon-mail.svg" alt="" width="11" height="11" /> info@idleducation.in</span>
                      <span style={{ color: '#94a3b8' }}>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><img src="/icon-globe.svg" alt="" width="11" height="11" /> www.idleducation.in</span>
                    </div>

                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-[#002B49] text-white text-[10px] font-bold px-2.5 py-1 rounded inline-block uppercase">ADMISSION FORM</span>
                  <p className="text-[10px] font-semibold text-slate-600 mt-1">Session 2026–2027</p>
                </div>
              </div>

              {/* ID & Photo Top Bar */}
              <div className="flex justify-between items-start gap-4 mb-4 pb-3 border-b border-slate-200">
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 text-left text-xs">
                  <div><span className="text-[10px] font-semibold text-slate-500">Student ID: </span><strong className="text-slate-900">{form.getValues('studentId')}</strong></div>
                  <div className="flex"><span className="text-[10px] font-semibold text-slate-500 shrink-0">Branch Node:&nbsp;</span><strong className="text-slate-900">{form.getValues('branch') || '—'}</strong></div>
                  <div><span className="text-[10px] font-semibold text-slate-500">Application Date: </span><strong className="text-slate-900">{format(new Date(), 'dd/MM/yyyy')}</strong></div>
                  <div><span className="text-[10px] font-semibold text-slate-500">Class/Course: </span><strong className="text-slate-900">{form.getValues('classApplied') || '—'}</strong></div>
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
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Blood Group:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('bloodGroup') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Aadhar UID:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('aadharNumber') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">APAAR / ABC ID:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('apaarId') || '—'}</td>
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
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Father's Name:</td>
                      <td className="p-1.5 font-bold text-slate-900 w-1/4">{form.getValues('fatherName') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Father's Occupation:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('fatherOccupation') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Mother's Name:</td>
                      <td className="p-1.5 font-bold text-slate-900">{form.getValues('motherName') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Mother's Occupation:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('motherOccupation') || '—'}</td>
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
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Email Address:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('email') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Student Mobile:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('studentPhone') || '—'}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Father's Mobile:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('fatherPhone') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Mother's Mobile:</td>
                      <td className="p-1.5 font-medium text-slate-900">{form.getValues('motherPhone') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Full Address:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">
                        {form.getValues('address') ? `${form.getValues('address')}, ${form.getValues('state')} - ${form.getValues('pincode')}` : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Academic Details */}
              <div className="mb-4 text-left">
                <div className="bg-slate-100 px-2.5 py-1 border border-slate-300 font-bold text-[11px] text-[#002B49] uppercase">
                  4. Academic Program & Previous School
                </div>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Selected Program:</td>
                      <td className="p-1.5 font-bold text-slate-900 w-1/4">{form.getValues('classApplied') || '—'}</td>
                      <td className="p-1.5 font-semibold text-slate-600 w-1/4 bg-slate-50">Previous School:</td>
                      <td className="p-1.5 font-medium text-slate-900 w-1/4">{form.getValues('previousSchool') || '—'}</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 font-semibold text-slate-600 bg-slate-50">Special Remarks:</td>
                      <td colSpan={3} className="p-1.5 font-medium text-slate-900">{form.getValues('additionalInfo') || 'None'}</td>
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

    </div>
  );
}