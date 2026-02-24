'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, Mail, Phone, GraduationCap, Building, Info, Send, 
  Briefcase, KeyRound, Upload, Globe, MapPin, 
  Calendar as CalendarIcon, FileText, Edit, Download, 
  Home, Droplets, VenetianMask, CheckCircle, X, 
  ArrowRight, Sparkles, IndianRupee, Banknote, Camera 
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
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { format, getDaysInMonth } from "date-fns";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { motion } from "framer-motion";

const phoneRegex = /^\d{10}$/;
const pincodeRegex = /^\d{6}$/;
const aadharRegex = /^\d{12}$/;
const MAX_FILE_SIZE = 100 * 1024; // 100KB

const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const countries = [
  "India", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

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
  studentPhoto: z.instanceof(File).optional().refine(file => !file || file.size <= MAX_FILE_SIZE, {
    message: `Max file size is 100KB.`,
  }),
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i - 3);

const FormHeader = () => (
    <header className="bg-primary text-primary-foreground p-6 rounded-t-2xl">
        <div className="flex flex-row items-center justify-between gap-4 text-left">
            <div className="flex flex-row items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                    <Image src="/logo.png" alt="IDL Education Logo" fill className="object-contain" />
                </div>
                <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-2.5">
                        <span className="text-3xl font-extrabold text-white tracking-tight uppercase">IDL</span>
                        <div className="flex flex-col text-[8px] font-bold text-white/60 tracking-tight leading-[1.1]">
                            <span>Institute Of</span>
                            <span>Distance Learning Pvt. Ltd.</span>
                        </div>
                    </div>
                    <span className="text-3xl font-extrabold text-white tracking-tight -mt-1">Education</span>
                </div>
            </div>
            
            <div className="hidden sm:flex flex-col items-start justify-center space-y-1 text-left shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/90">
                    <Phone className="w-3 h-3 text-white/60" />
                    <span>011 45035713</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/90">
                    <Mail className="w-3 h-3 text-white/60" />
                    <span>info@idleducation.in</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/90">
                    <Globe className="w-3 h-3 text-white/60" />
                    <span>www.idleducation.in</span>
                </div>
            </div>
        </div>
    </header>
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
    if (!contentToCapture) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the form content to download.",
      });
      return;
    }

    try {
        const canvas = await html2canvas(contentToCapture, {
            scale: 2,
            useCORS: true,
        });

        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imageData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        if (imgHeight > pdfHeight) {
            pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        } else {
            pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
        }
        
        pdf.save(`${form.getValues('studentName')}_Admission_Form.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Error",
            description: "Could not generate the PDF. Please try again.",
        });
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
        description: "Please fill all the required fields before previewing.",
      });
    }
  }

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
        console.error("Error submitting admission form:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to submit form. Please try again later." });
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
        name: 'IDL Education Admission',
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
        theme: {
            color: '#0d47a1',
        },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }


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
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };
  
  const formatDateForDisplay = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    return format(dateObj, "dd/MM/yyyy");
  };

  return (
    <>
    <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
    />
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="container mx-auto py-12 px-4 md:px-[10%] relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 mb-6"
            >
                <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-sm transition-all duration-500 hover:scale-110">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
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
            <p className="mt-2 text-sm text-muted-foreground font-semibold">
                Fill out the form below to start your journey with IDL Education.
            </p>
        </div>
        <Card className="shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <FormHeader />
          
          <CardContent className="p-0">
              <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                  {/* Row 1: Branch & Stu ID / Photo */}
                  <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                      <div className="md:col-span-8 p-6 space-y-4">
                          <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                  <FormItem className="space-y-0 w-full max-w-[200px]">
                                      <FormControl>
                                          <div className="relative group">
                                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                              <Input placeholder="Generating Stu ID..." {...field} readOnly className="pl-9 h-10 rounded-xl font-mono tracking-wider bg-white/80 border-slate-200 text-xs" />
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
                                                  <SelectTrigger className="pl-9 h-12 rounded-xl border-slate-200">
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
                                                  <Image src={photoPreview} alt="Student photo preview" width={100} height={130} className="object-cover h-full w-full"/>
                                          ) : (
                                                  <div className="text-center text-muted-foreground p-2">
                                                      <Camera className="w-5 h-5 mx-auto mb-1 opacity-40" />
                                                      <p className="text-[8px] font-black uppercase tracking-tighter">PHOTO</p>
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
                                                      reader.onloadend = () => {
                                                          setPhotoPreview(reader.result as string);
                                                      };
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

                  {/* Body Grid with Dividers */}
                  <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800 border-t">
                      {/* Row 2: Name & DOB */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="studentName"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Student's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                          <div className="p-4 md:p-0 flex items-center bg-slate-50/20">
                              <FormField
                                  control={form.control}
                                  name="dob"
                                  render={({ field }) => (
                                      <FormItem className="space-y-0 w-full">
                                          <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 h-full">
                                              <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                                  <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-bold text-[13px]"><SelectValue placeholder="Day *" /></SelectTrigger>
                                                  <SelectContent>
                                                      {availableDays.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}
                                                  </SelectContent>
                                              </Select>
                                              <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                                  <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-bold text-[13px]"><SelectValue placeholder="Month *" /></SelectTrigger>
                                                  <SelectContent>
                                                      {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                                  </SelectContent>
                                              </Select>
                                              <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                                  <SelectTrigger className="border-0 rounded-none h-14 bg-transparent focus:ring-0 px-4 font-bold text-[13px]"><SelectValue placeholder="Year *" /></SelectTrigger>
                                                  <SelectContent>
                                                      {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                                                  </SelectContent>
                                              </Select>
                                          </div>
                                          <FormMessage className="text-[10px] px-4 pb-2" />
                                      </FormItem>
                                  )}
                              />
                          </div>
                      </div>

                      {/* Row 3: Gender & Blood Group */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <VenetianMask className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                      <SelectValue placeholder="Select Gender *" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  <SelectItem value="male">Male</SelectItem>
                                                  <SelectItem value="female">Female</SelectItem>
                                                  <SelectItem value="other">Other</SelectItem>
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="bloodGroup"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                      <SelectValue placeholder="Select Blood Group" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {bloodGroups.map(group => (
                                                      <SelectItem key={group} value={group}>{group}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 4: IDs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="aadharNumber"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Aadhar Number" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" maxLength={12} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
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
                                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="APAAR/ABC ID" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 5: Father's Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="fatherName"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Father's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="fatherOccupation"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Father's Occupation" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 6: Mother's Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="motherName"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Mother's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="motherOccupation"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Mother's Occupation" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 7: Contacts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="fatherPhone"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <FormControl>
                                          <div className="relative group h-full">
                                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 group-focus-within:text-primary">+91</span>
                                              <Input type="tel" placeholder="Father's Contact *" {...field} className="pl-16 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                                          </div>
                                      </FormControl>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
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
                                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 group-focus-within:text-primary">+91</span>
                                              <Input type="tel" placeholder="Mother's Contact *" {...field} className="pl-16 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                                          </div>
                                      </FormControl>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 8: Student Email & Ph */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input type="email" placeholder="Email Address *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.toLowerCase())}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="studentPhone"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400 group-focus-within:text-primary">+91</span>
                                          <Input type="tel" placeholder="Student's Contact" {...field} className="pl-16 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 9: Address */}
                      <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                          <FormItem className="space-y-0">
                              <FormControl>
                                  <div className="relative group h-full">
                                      <Home className="absolute left-4 top-5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Textarea placeholder="Full Residential Address *" className="min-h-[100px] pl-12 pt-4 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                  </div>
                              </FormControl>
                              <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                          )}
                      />

                      {/* Row 10: Location Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="country"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                      <SelectValue placeholder="Country *" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {countries.map(country => (
                                                      <SelectItem key={country} value={country}>{country}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                      <SelectValue placeholder="State *" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {indianStates.map(state => (
                                                      <SelectItem key={state} value={state}>{state}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
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
                                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Pincode *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} maxLength={6} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 11: Academic Path */}
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                          <FormField
                              control={form.control}
                              name="classApplied"
                              render={({ field }) => (
                                  <FormItem className="space-y-0">
                                      <div className="relative group">
                                          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                      <SelectValue placeholder="Select Class/Course *" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  {classes.map(c => (
                                                      <SelectItem key={c} value={c}>{c}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                      </div>
                                      <FormMessage className="text-[10px] px-4 pb-2" />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="previousSchool"
                              render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Input placeholder="Previous School Name" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                              )}
                          />
                      </div>

                      {/* Row 12: Additional Info */}
                      <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                              <FormItem className="space-y-0">
                                  <FormControl>
                                      <div className="relative group h-full">
                                          <Info className="absolute left-4 top-5 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <Textarea placeholder="Any additional information or requirements..." className="min-h-[100px] pl-12 pt-4 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                                      </div>
                                  </FormControl>
                                  <FormMessage className="text-[10px] px-4 pb-2" />
                              </FormItem>
                          )}
                      />
                  </div>

                  {/* Footer / Submit Area */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                      <Button 
                          type="button" 
                          variant="outline"
                          className="flex-1 h-12 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-white border-slate-200 shadow-sm"
                          onClick={handlePreview}
                          disabled={!form.getValues('studentId')}
                      >
                          <FileText className="mr-2 h-4 w-4" />
                          Preview Application
                      </Button>
                      <Button 
                          type="button" 
                          className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                          onClick={() => {
                              form.trigger().then(isValid => {
                                  if (isValid) setIsPaymentDialogOpen(true);
                                  else toast({ variant: "destructive", title: "Incomplete Form", description: "Please fix the errors before proceeding." });
                              });
                          }}
                      >
                          <Send className="mr-2 h-4 w-4" />
                          Proceed to Submit
                      </Button>
                  </div>
              </form>
              </Form>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="sm:max-w-3xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-primary text-white">
          <DialogTitle className="text-2xl font-black tracking-tight">Application Preview</DialogTitle>
          <DialogDescription className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/60">Review your institutional record before final sync</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] bg-white">
          <div ref={previewRef} className="p-8">
             <div className="bg-white text-black">
                  <div className="flex flex-row items-center justify-between border-b-2 border-slate-100 pb-6 mb-6">
                      <div className="flex items-center gap-4">
                          <Image src="/logo.png" alt="Logo" width={60} height={60} />
                          <div className="flex flex-col">
                              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">IDL EDUCATION</h2>
                              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Distance Learning Excellence</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">STUDENT ID</p>
                          <p className="font-mono text-lg font-black bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{form.getValues('studentId')}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="md:col-span-3 space-y-4">
                          <div className="w-full aspect-[3/4] bg-slate-50 border rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                              {photoPreview ? (
                                  <Image src={photoPreview} alt="Student" width={150} height={200} className="object-cover w-full h-full" />
                              ) : (
                                  <User className="w-12 h-12 opacity-10" />
                              )}
                          </div>
                          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                              <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1 text-center">Assigned Branch</p>
                              <p className="text-[10px] font-bold text-center leading-tight">{form.getValues('branch')}</p>
                          </div>
                      </div>

                      <div className="md:col-span-9 grid grid-cols-2 gap-x-8 gap-y-4 font-bold text-[11px]">
                          {[
                              { label: "Full Name", value: form.getValues('studentName') },
                              { label: "Date of Birth", value: formatDateForDisplay(form.getValues('dob')) },
                              { label: "Gender", value: form.getValues('gender'), class: "capitalize" },
                              { label: "Blood Group", value: form.getValues('bloodGroup') },
                              { label: "Aadhar", value: form.getValues('aadharNumber') },
                              { label: "Class", value: form.getValues('classApplied') },
                              { label: "Father Name", value: form.getValues('fatherName') },
                              { label: "Mother Name", value: form.getValues('motherName') },
                              { label: "Email", value: form.getValues('email') },
                              { label: "Parent Contact", value: form.getValues('fatherPhone') },
                          ].map((item, idx) => (
                              <div key={idx} className="flex flex-col gap-0.5 border-b border-slate-50 pb-1">
                                  <span className="text-[8px] uppercase opacity-40 tracking-widest">{item.label}</span>
                                  <span className={cn("text-foreground", item.class)}>{item.value || '—'}</span>
                              </div>
                          ))}
                          <div className="col-span-full flex flex-col gap-0.5 border-b border-slate-50 pb-1 pt-2">
                              <span className="text-[8px] uppercase opacity-40 tracking-widest">Permanent Address</span>
                              <span className="text-foreground">{`${form.getValues('address')}, ${form.getValues('state')} - ${form.getValues('pincode')}`}</span>
                          </div>
                      </div>
                  </div>
             </div>
          </div>
        </ScrollArea>
        <div className="p-6 bg-slate-50 border-t flex gap-3">
           <Button variant="outline" className="flex-1 rounded-xl font-bold h-12 border-slate-200 bg-white" onClick={() => setIsPreviewOpen(false)}>
              <Edit className="mr-2 h-4 w-4" />
              MODIFY
          </Button>
          <Button className="flex-1 rounded-xl font-black h-12 bg-primary text-white shadow-lg shadow-primary/20" onClick={() => { setIsPreviewOpen(false); setIsPaymentDialogOpen(true); }}>
            PAY & SUBMIT <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-8">
          <DialogHeader>
              <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-5 rounded-[2rem]">
                      <IndianRupee className="w-14 h-14 text-primary" />
                  </div>
              </div>
              <DialogTitle className="text-center text-3xl font-black tracking-tight">Registration Fee</DialogTitle>
              <DialogDescription className="text-center font-bold text-xs text-muted-foreground uppercase tracking-[0.2em] pt-2">
                  One-time application processing fee
              </DialogDescription>
          </DialogHeader>
          <div className="py-8 space-y-6">
              <div className="flex justify-between items-center p-6 bg-muted/50 rounded-2xl border border-dashed border-primary/20">
                  <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payable Amount</p>
                      <p className="text-[10px] font-bold text-primary">Valid for 2026-27 cycle</p>
                  </div>
                  <span className="text-3xl font-black text-primary">₹10.00</span>
              </div>
              <Button 
                  type="button" 
                  onClick={handlePayment}
                  disabled={form.formState.isSubmitting}
                  className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
              >
                  {form.formState.isSubmitting ? 'SECURE SYNC...' : 'PAY NOW'}
                  <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
          </div>
      </DialogContent>
    </Dialog>
    
    <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-sm border-none shadow-2xl p-10">
            <DialogHeader>
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-5 rounded-[2rem]">
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                </div>
                <DialogTitle className="text-center text-3xl font-black tracking-tight">Sync Complete!</DialogTitle>
                <DialogDescription className="text-center font-bold text-sm text-muted-foreground leading-relaxed pt-3">
                    Your application has been received and indexed. Our academic node will contact you shortly to finalize your onboarding.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-8">
                <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10 bg-primary hover:bg-primary/90 text-white">DISMISS RECORD</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
