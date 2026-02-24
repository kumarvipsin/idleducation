'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, Send, 
  Briefcase, KeyRound, Globe, MapPin, 
  Calendar as CalendarIcon, FileText, Edit, Download, 
  Droplets, VenetianMask, CheckCircle, 
  ArrowRight, Sparkles, IndianRupee, Camera,
  Users, Home, X, Plus, Minus, CheckCircle2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState, useEffect, useRef } from "react";
import { getNextStudentId, submitAdmissionForm, createRazorpayOrder } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { format, getDaysInMonth } from "date-fns";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
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
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, { message: "Mother's name must be at least 2 characters." }),
  motherOccupation: z.string().optional(),
  dob: z.date({
    required_error: "Date of birth is required.",
  }).refine((dob) => {
    const today = new Date();
    const threeYearsAgo = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    return dob <= threeYearsAgo;
  }, { message: "Student must be at least 3 years old." }),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  bloodGroup: z.string().optional(),
  aadharNumber: z.string().regex(aadharRegex, { message: "Please enter a valid 12-digit Aadhar number." }).optional().or(z.literal('')),
  apaarId: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  studentPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }).optional().or(z.literal('')),
  fatherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  motherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  address: z.string().min(5, { message: "Address is required." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
  pincode: z.string().regex(pincodeRegex, { message: "Please enter a valid 6-digit pincode." }),
  classApplied: z.string().min(1, { message: "Please select a class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  branch: z.string().min(1, { message: "Please select your nearest branch." }),
  studentPhoto: z.any().optional(),
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i - 3);

const FormHeader = () => (
    <header className="bg-primary text-primary-foreground p-5 rounded-t-2xl">
        <div className="flex flex-row items-center justify-between gap-4 text-left">
            <div className="flex flex-row items-center gap-3">
                <img src="/logo.png" alt="IDL EDUCATION Logo" width="48" height="48" className="object-contain shrink-0" />
                <div className="flex flex-col text-left">
                    <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-[0.12em] leading-none">IDL EDUCATION</h1>
                    <span className="text-[6px] md:text-[7.5px] font-semibold text-white/80 leading-tight mt-1 block">
                        (Institute Of Distance Learning Pvt. Ltd.)
                    </span>
                </div>
            </div>
            
            <div className="hidden sm:flex flex-col items-start justify-center space-y-1 text-left shrink-0">
                <div className="flex items-center gap-2.5 text-[10px] font-semibold text-white/90">
                    <Phone className="w-3.5 h-3.5 text-white/50" />
                    <span>011 45035713</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-semibold text-white/90">
                    <Mail className="w-3.5 h-3.5 text-white/50" />
                    <span>info@idleducation.in</span>
                </div>
                <div className="flex items-center gap-2.5 text-[10px] font-semibold text-white/90">
                    <Globe className="w-3.5 h-3.5 text-white/50" />
                    <span>www.idleducation.in</span>
                </div>
            </div>
        </div>
    </header>
);

const PreviewField = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-2 text-left">
        <span className="text-[11px] font-semibold text-slate-500 leading-none">{label}</span>
        <span className="text-[13px] font-medium text-slate-900 leading-tight">{value || '—'}</span>
    </div>
);

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  
  const daysInMonth = React.useMemo(() => {
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
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate student ID. Please refresh the page.",
            });
        }
    }
    fetchStudentId();
  }, [form, toast]);

  const generatePdf = async () => {
    const contentToCapture = previewRef.current;
    if (!contentToCapture) return;

    try {
        const canvas = await html2canvas(contentToCapture, {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 800,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`${form.getValues('studentName')}_Admission_Form.pdf`);
    } catch (error) {
        console.error("PDF generation failed:", error);
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
        title: "Incomplete Form",
        description: "Please fill all required fields marked with * before previewing.",
      });
    }
  };

  const handleDownload = () => {
    generatePdf();
  };

  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'dob' && value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (value) {
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
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    } catch (error) {
        console.error("Submission failed:", error);
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
        name: 'IDL EDUCATION Admission',
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
        theme: { color: '#0d47a1' },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const classes = [
    "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIII", "CLASS IX", "CLASS X", "CLASS XI", "CLASS XII",
    "JEE", "NEET", "CUET", "CBSE", "NIOS", "SSC", "BANK PO", "RRB", "CLAT", "GATE", "DEFENCE", "DELHI POLICE"
  ];
  
  const branches = [
    "Mukherjee Nagar, Delhi-110009",
    "Mangol Puri, Delhi-110083",
    "Budh Vihar, Delhi-110086",
    "Burari, Delhi-110084"
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
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto py-12 px-4 md:px-[10%] relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-sm">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight uppercase">
                Admission{' '}
                <span className="relative inline-block">
                    <span className="relative z-10 text-primary">Form</span>
                    <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                        <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                            <path d="M0,15 Q50,5 100,15" />
                        </svg>
                    </div>
                </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-semibold">Start your academic journey with IDL EDUCATION.</p>
        </div>

        <Card className="shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up">
          <FormHeader />
          
          <CardContent className="p-0">
              <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                      <div className="md:col-span-8 p-6 space-y-4">
                          <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                  <FormItem className="space-y-0 w-full max-w-[200px]">
                                      <FormLabel className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">Student ID,s</FormLabel>
                                      <FormControl>
                                          <div className="relative group">
                                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                              <Input placeholder="Generating Stu ID..." {...field} readOnly className="pl-9 h-10 rounded-xl font-medium bg-white/80 border-slate-200 text-xs" />
                                          </div>
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="branch"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} value={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-9 h-12 rounded-xl border-slate-200 font-medium text-sm">
                                                      <SelectValue placeholder="Select Your Nearest Branch *" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {branches.map(b => (
                                                      <SelectItem key={b} value={b}>{b}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-2 pt-1" />
                                  </FormItem>
                              )}
                          />
                      </div>
                      <div className="md:col-span-4 p-6 flex flex-col items-center justify-center gap-4 bg-slate-50/30 dark:bg-slate-800/30">
                          <FormField
                              control={form.control}
                              name="studentPhoto"
                              render={({ field: { onChange, value, ...rest } }) => (
                                  <FormItem className="space-y-0">
                                      <FormLabel htmlFor="photo-upload" className="cursor-pointer block">
                                          <div className="w-[100px] h-[130px] rounded-xl bg-white border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden shadow-inner">
                                          {photoPreview ? (
                                                  <img src={photoPreview} alt="Student" width={100} height={130} className="object-cover h-full w-full"/>
                                          ) : (
                                                  <div className="text-center text-muted-foreground p-2">
                                                      <Camera className="w-5 h-5 mx-auto mb-1 opacity-40" />
                                                      <p className="text-[10px] font-medium">Photo</p>
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
                                      <FormMessage className="text-[10px] text-center pt-1" />
                                  </FormItem>
                              )}
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField control={form.control} name="studentName" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Student's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                          <div className="p-4 md:p-0 flex items-center bg-slate-50/20">
                              <FormField control={form.control} name="dob" render={({ field }) => (
                                  <FormItem className="space-y-0 w-full">
                                      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 h-full">
                                          <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                              <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-medium text-sm"><SelectValue placeholder="Day *" /></SelectTrigger>
                                              <SelectContent>{availableDays.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}</SelectContent>
                                          </Select>
                                          <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                              <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-medium text-sm"><SelectValue placeholder="Month *" /></SelectTrigger>
                                              <SelectContent>{months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}</SelectContent>
                                          </Select>
                                          <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                              <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-medium text-sm"><SelectValue placeholder="Year *" /></SelectTrigger>
                                              <SelectContent>{years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}</SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )} />
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField control={form.control} name="gender" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <div className="relative group">
                                      <VenetianMask className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm focus:ring-0"><SelectValue placeholder="Select Gender *" /></SelectTrigger></FormControl>
                                          <SelectContent>
                                              <SelectItem value="male">Male</SelectItem>
                                              <SelectItem value="female">Female</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                          </SelectContent>
                                      </Select>
                                  </div>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <div className="relative group">
                                      <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm focus:ring-0"><SelectValue placeholder="Select Blood Group" /></SelectTrigger></FormControl>
                                          <SelectContent>{bloodGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}</SelectContent>
                                      </Select>
                                  </div>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField control={form.control} name="fatherName" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Father's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="fatherOccupation" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Father's Occupation" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField control={form.control} name="fatherPhone" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 group-focus-within:text-primary">+91</span>
                                          <Input type="tel" placeholder="Father's Contact *" {...field} className="pl-16 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input type="email" placeholder="Email Address *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.toLowerCase())}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                      </div>

                      <FormField control={form.control} name="address" render={({ field }) => (
                          <FormItem className="space-y-0">
                              <FormControl>
                                  <div className="relative group h-full">
                                      <Home className="absolute left-4 top-5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Textarea placeholder="Full Residential Address *" className="min-h-[100px] pl-12 pt-4 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                  </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                      )} />

                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField control={form.control} name="state" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <div className="relative group">
                                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl><SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm focus:ring-0"><SelectValue placeholder="Select State *" /></SelectTrigger></FormControl>
                                          <SelectContent>{indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
                                      </Select>
                                  </div>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="pincode" render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Pincode *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} maxLength={6} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )} />
                      </div>

                      <FormField control={form.control} name="classApplied" render={({ field }) => (
                          <FormItem className="space-y-0">
                              <div className="relative group">
                                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl><SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-medium text-sm focus:ring-0"><SelectValue placeholder="Select Class/Course *" /></SelectTrigger></FormControl>
                                      <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                  </Select>
                              </div>
                              <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                      )} />
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                      <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold text-xs bg-white border-slate-200 shadow-sm" onClick={handlePreview}>
                          <FileText className="mr-2 h-4 w-4" /> Preview Application
                      </Button>
                      <Button type="button" className="flex-1 h-12 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => {
                          form.trigger().then(isValid => {
                              if (isValid) setIsPaymentDialogOpen(true);
                              else toast({ variant: "destructive", title: "Incomplete Form", description: "Please fix the errors before proceeding." });
                          });
                      }}>
                          <Send className="mr-2 h-4 w-4" /> Proceed to Submit
                      </Button>
                  </div>
              </form>
              </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-5xl h-[95vh] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl bg-white flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b bg-slate-50 flex flex-row items-center justify-between shrink-0">
            <div className="space-y-1 text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight text-primary">Application Review</DialogTitle>
              <DialogDescription className="font-semibold text-xs text-muted-foreground">Institutional validation of student record</DialogDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl font-bold h-9" onClick={() => setIsPreviewOpen(false)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button size="sm" className="rounded-xl font-bold h-9 bg-primary text-white" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" /> Save PDF
                </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div ref={previewRef} className="p-10 bg-white text-black min-h-[1120px] w-full max-w-[210mm] mx-auto">
               <div className="space-y-8">
                    <div className="border-[3px] border-primary p-1 rounded-3xl">
                        <div className="border border-primary/20 rounded-[1.25rem] overflow-hidden">
                            <FormHeader />
                            <div className="bg-primary/5 p-4 text-center border-b border-primary/10">
                                <h2 className="text-sm font-bold text-primary uppercase">STUDENT ADMISSION FORM</h2>
                                <p className="text-[10px] font-medium text-muted-foreground mt-1">Academic Session 2026-27</p>
                            </div>
                            <div className="p-8 space-y-10">
                                <div className="flex justify-between items-start gap-12">
                                    <div className="flex-1 space-y-6 text-left">
                                        <div className="grid grid-cols-2 gap-6">
                                            <PreviewField label="Student ID" value={form.getValues('studentId')} />
                                            <PreviewField label="Branch Node" value={form.getValues('branch')} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <PreviewField label="Admission Date" value={format(new Date(), 'dd/MM/yyyy')} />
                                            <PreviewField label="Status" value="PROVISIONAL" />
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <div className="w-[120px] h-[150px] bg-slate-50 border-2 border-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                                            {photoPreview ? <img src={photoPreview} alt="Student" style={{ width: '120px', height: '150px', objectFit: 'cover' }} /> : <User className="w-12 h-12 opacity-5" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-primary border-b pb-2 flex items-center gap-2"><User className="w-4 h-4"/> I. Student Identity</h3>
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                        <PreviewField label="Student Full Name" value={form.getValues('studentName')} />
                                        <PreviewField label="Date of Birth" value={formatDateForDisplay(form.getValues('dob'))} />
                                        <PreviewField label="Gender" value={capitalizeWords(form.getValues('gender') || '')} />
                                        <PreviewField label="Blood Group" value={form.getValues('bloodGroup')} />
                                        <PreviewField label="Aadhar Number" value={form.getValues('aadharNumber')} />
                                        <PreviewField label="APAAR/ABC ID" value={form.getValues('apaarId')} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-primary border-b pb-2 flex items-center gap-2"><Users className="w-4 h-4"/> II. Family Composition</h3>
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                        <PreviewField label="Father's Name" value={form.getValues('fatherName')} />
                                        <PreviewField label="Father's Occupation" value={form.getValues('fatherOccupation')} />
                                        <PreviewField label="Mother's Name" value={form.getValues('motherName')} />
                                        <PreviewField label="Mother's Occupation" value={form.getValues('motherOccupation')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
               <div className="mt-12 space-y-8 pt-12 border-t border-dashed border-slate-200">
                    <div className="border-[3px] border-primary p-1 rounded-3xl">
                        <div className="border border-primary/20 rounded-[1.25rem] overflow-hidden p-8 space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-primary border-b pb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> III. Contact Node</h3>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    <PreviewField label="Email Address" value={form.getValues('email')} />
                                    <PreviewField label="Father's Mobile" value={form.getValues('fatherPhone')} />
                                    <div className="col-span-2">
                                        <PreviewField label="Permanent Strategic Address" value={`${form.getValues('address')}, ${form.getValues('state')}, ${form.getValues('country')} - ${form.getValues('pincode')}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-primary border-b pb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> IV. Academic Trajectory</h3>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    <PreviewField label="Selected Path" value={form.getValues('classApplied')} />
                                    <PreviewField label="Previous School" value={form.getValues('previousSchool')} />
                                </div>
                            </div>
                            <div className="pt-12 space-y-12">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-600 text-left">
                                    Declaration: I hereby solemnly declare that all statements made in this application are true, complete and correct to the best of my knowledge and belief.
                                </div>
                                <div className="flex justify-between items-end pt-8">
                                    <div className="space-y-2 text-center"><div className="w-40 border-b border-slate-900 pb-16"></div><p className="text-[10px] font-semibold">Student Sign</p></div>
                                    <div className="space-y-2 text-center"><div className="w-40 border-b border-slate-900 pb-16"></div><p className="text-[10px] font-semibold">Guardian Sign</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
          </ScrollArea>
          <div className="p-6 border-t bg-slate-50 flex gap-4 shrink-0">
              <Button className="flex-1 h-14 rounded-2xl font-bold text-sm bg-primary text-white shadow-xl shadow-primary/20" onClick={() => { setIsPreviewOpen(false); setIsPaymentDialogOpen(true); }}>
                  PROCEED TO FINAL SUBMISSION <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-8 bg-white">
            <DialogHeader>
                <div className="flex justify-center mb-6"><div className="bg-primary/10 p-5 rounded-[2rem]"><IndianRupee className="w-14 h-14 text-primary" /></div></div>
                <DialogTitle className="text-center text-2xl font-bold text-slate-900">Registration Fee</DialogTitle>
                <DialogDescription className="text-center font-medium text-xs text-muted-foreground pt-2">One-time application processing fee</DialogDescription>
            </DialogHeader>
            <div className="py-8 space-y-6">
                <div className="flex justify-between items-center p-6 bg-muted/50 rounded-2xl border border-dashed border-primary/20">
                    <div className="space-y-0.5 text-left"><p className="text-[11px] font-semibold text-muted-foreground">Payable Amount</p><p className="text-[10px] font-medium text-primary">Valid for 2026-27 cycle</p></div>
                    <span className="text-3xl font-bold text-primary">₹10.00</span>
                </div>
                <Button type="button" onClick={handlePayment} className="w-full h-14 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95">
                    Pay Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-sm border-none shadow-2xl p-10 bg-white">
              <DialogHeader>
                  <div className="flex justify-center mb-6"><div className="bg-green-100 p-5 rounded-[2rem]"><CheckCircle className="w-14 h-14 text-green-500" /></div></div>
                  <DialogTitle className="text-center text-2xl font-bold text-slate-900">Sync Complete!</DialogTitle>
                  <DialogDescription className="text-center font-medium text-sm text-muted-foreground leading-relaxed pt-3">Your application has been received and indexed. Our academic node will contact you shortly.</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-8">
                  <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white">Dismiss Record</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
