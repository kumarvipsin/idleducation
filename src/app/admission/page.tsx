
'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Info, Send, Camera, Briefcase, KeyRound, Upload, Globe, MapPin, Calendar as CalendarIcon, FileText, Edit, Download, Hash, Home, Droplets, VenetianMask, CheckCircle, X, ArrowRight, Sparkles } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, getDaysInMonth } from "date-fns";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

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
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
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
    <header className="bg-primary text-primary-foreground p-6">
        <div className="flex flex-row items-center justify-start gap-4 text-left">
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
    "CLASS V", "CLASS VI", "CLASS VII", "CLASS VIIICLASS IX", "CLASS X", "CLASS XI", "CLASS XII",
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
          
          <CardContent className="p-4 md:p-8">
              <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                      <div className="md:col-span-2 space-y-2 text-sm">
                          <p className="font-bold">To,</p>
                          <p className="font-bold">The Managing Director,</p>
                          <p className="font-bold">IDL EDUCATION PVT. LTD.</p>
                          <FormField
                              control={form.control}
                              name="branch"
                              render={({ field }) => (
                                  <FormItem className="flex items-center gap-2">
                                  <FormLabel className="font-bold whitespace-nowrap">Branch <span className="text-destructive">*</span>:</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                      <SelectTrigger className="w-full h-10 rounded-xl">
                                          <SelectValue placeholder="Select Your Nearest Branch" />
                                      </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                      {branches.map(b => (
                                          <SelectItem key={b} value={b}>{b}</SelectItem>
                                      ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                      <div className="md:col-span-1 space-y-4 flex flex-col items-center">
                          <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                  <FormItem className="flex items-center gap-2 w-full">
                                  <FormLabel className="font-bold whitespace-nowrap">Stu ID. :</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Generating..." {...field} readOnly className="h-10 rounded-xl font-mono tracking-wider" />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                          <FormField
                              control={form.control}
                              name="studentPhoto"
                              render={({ field: { onChange, value, ...rest } }) => (
                                  <FormItem>
                                      <FormLabel htmlFor="photo-upload" className="cursor-pointer">
                                          <div className="w-[132px] h-[170px] mx-auto rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors">
                                          {photoPreview ? (
                                                  <Image src={photoPreview} alt="Student photo preview" width={132} height={170} className="object-cover h-full w-full"/>
                                          ) : (
                                                  <div className="text-center text-muted-foreground p-2">
                                                      <Upload className="w-6 h-6 mx-auto mb-2" />
                                                      <p className="text-[10px] font-bold uppercase">Upload Photo</p>
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
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>
                  </div>

                  <Separator className="opacity-50" />

                  <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <div className="relative group">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Student's Name *" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                          <FormItem>
                              <div className="grid grid-cols-3 gap-2">
                                  <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                      <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Day *" /></SelectTrigger>
                                      <SelectContent>
                                          {availableDays.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                  <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                      <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Month *" /></SelectTrigger>
                                      <SelectContent>
                                          {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                  <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                      <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Year *" /></SelectTrigger>
                                      <SelectContent>
                                          {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              </div>
                              <FormMessage />
                          </FormItem>
                      )}
                      />
                  </div>
                   <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                              <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                      <div className="relative group">
                                          <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <SelectTrigger className="pl-9 h-12 rounded-xl">
                                              <SelectValue placeholder="Select Gender *" />
                                          </SelectTrigger>
                                      </div>
                                      </FormControl>
                                      <SelectContent>
                                          <SelectItem value="male">Male</SelectItem>
                                          <SelectItem value="female">Female</SelectItem>
                                          <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="bloodGroup"
                          render={({ field }) => (
                              <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                      <div className="relative group">
                                          <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                          <SelectTrigger className="pl-9 h-12 rounded-xl">
                                              <SelectValue placeholder="Select Blood Group" />
                                          </SelectTrigger>
                                      </div>
                                      </FormControl>
                                      <SelectContent>
                                          {bloodGroups.map(group => (
                                              <SelectItem key={group} value={group}>{group}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="aadharNumber"
                          render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                  <div className="relative group">
                                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Input placeholder="Aadhar Number" {...field} className="pl-9 h-12 rounded-xl" maxLength={12} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="apaarId"
                          render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                  <div className="relative group">
                                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <Input placeholder="APAAR/ABC ID" {...field} className="pl-9 h-12 rounded-xl" />
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <div className="relative group">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Father's Name *" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="fatherOccupation"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                          <div className="relative group">
                                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Father's Occupation" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <div className="relative group">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Mother's Name *" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="motherOccupation"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                          <div className="relative group">
                                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Mother's Occupation" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <div className="relative group">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Input type="email" placeholder="Email Address *" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(e.target.value.toLowerCase())}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                      <FormItem>
                          <FormControl>
                              <div className="relative group">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-slate-400 group-focus-within:text-primary font-bold">+91</span>
                              <Input type="tel" placeholder="Student's Phone Number" {...field} className="pl-16 h-12 rounded-xl" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="fatherPhone"
                      render={({ field }) => (
                          <FormItem>
                          <FormControl>
                              <div className="relative group">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-slate-400 group-focus-within:text-primary font-bold">+91</span>
                                  <Input type="tel" placeholder="Father's Contact *" {...field} className="pl-16 h-12 rounded-xl" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
                              </div>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="motherPhone"
                      render={({ field }) => (
                          <FormItem>
                          <FormControl>
                              <div className="relative group">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-slate-400 group-focus-within:text-primary font-bold">+91</span>
                                  <Input type="tel" placeholder="Mother's Contact *" {...field} className="pl-16 h-12 rounded-xl" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                  </div>
                  
                  <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                      <FormItem>
                         <FormControl>
                              <div className="relative group">
                                  <Home className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Textarea placeholder="Full Address *" className="min-h-[100px] pl-9 rounded-xl pt-3" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />

                  <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                              <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <div className="relative group">
                                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                              <SelectTrigger className="pl-9 h-12 rounded-xl">
                                                  <SelectValue placeholder="Select a country *" />
                                              </SelectTrigger>
                                          </div>
                                      </FormControl>
                                      <SelectContent>
                                          {countries.map(country => (
                                              <SelectItem key={country} value={country}>{country}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                              <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <div className="relative group">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                      <SelectTrigger className="pl-9 h-12 rounded-xl">
                                          <SelectValue placeholder="Select a state *" />
                                      </SelectTrigger>
                                  </div>
                                  </FormControl>
                                  <SelectContent>
                                  {indianStates.map(state => (
                                      <SelectItem key={state} value={state}>{state}</SelectItem>
                                  ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                          <FormItem>
                              <FormControl>
                                  <div className="relative group">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <Input placeholder="Pincode *" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} maxLength={6} />
                                  </div>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="classApplied"
                      render={({ field }) => (
                          <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <div className="relative group">
                                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                  <SelectTrigger className="pl-9 h-12 rounded-xl">
                                      <SelectValue placeholder="Applying for Class *" />
                                  </SelectTrigger>
                              </div>
                              </FormControl>
                              <SelectContent>
                              {classes.map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="previousSchool"
                      render={({ field }) => (
                          <FormItem>
                          <FormControl>
                              <div className="relative group">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Input placeholder="Previous School Name (if any)" {...field} className="pl-9 h-12 rounded-xl" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                              </div>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                  </div>
                  <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl>
                         <div className="relative group">
                              <Info className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Textarea placeholder="Additional Information" className="min-h-[100px] pl-9 rounded-xl pt-3" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
                          </div>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </form>
              </Form>
          </CardContent>
        </Card>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Button type="button" size="lg" className="flex-1 rounded-xl font-bold h-12 shadow-lg shadow-primary/20" onClick={handlePreview} disabled={!form.getValues('studentId')}>
                <FileText className="mr-2 h-4 w-4" />
                Preview Form
            </Button>
        </div>
      </div>
    </div>
    
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="sm:max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Form Preview</DialogTitle>
          <DialogDescription className="font-bold text-xs uppercase tracking-widest opacity-60">Review your details before submission</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1 border rounded-xl overflow-hidden">
          <div ref={previewRef} className="bg-white text-black p-0">
             <Card className="shadow-none border-0 rounded-none overflow-hidden">
                  <FormHeader />
                  <div className="bg-muted/30 text-center py-2 border-b">
                      <h2 className="text-sm font-black tracking-widest text-foreground uppercase">STUDENT ADMISSION RECORD</h2>
                  </div>
                  <CardContent className="p-6 md:p-8 text-[11px] leading-relaxed">
                      <div className="grid grid-cols-3 gap-8 mb-6">
                           <div className="col-span-2 space-y-1">
                              <p className="font-bold">To,</p>
                              <p className="font-bold">The Managing Director,</p>
                              <p className="font-bold">IDL EDUCATION PVT. LTD.</p>
                              <p className="pt-2"><span className="font-bold uppercase opacity-60">Branch Node:</span> <span className="font-bold">{form.getValues('branch')}</span></p>
                          </div>
                           <div className="col-span-1 space-y-2 flex flex-col items-end">
                              <p className="font-mono bg-slate-100 px-2 py-1 rounded border"><span className="font-bold opacity-60">ID:</span> {form.getValues('studentId')}</p>
                              <div className="w-[100px] h-[130px] bg-muted border overflow-hidden rounded-lg shadow-inner flex items-center justify-center">
                                  {photoPreview ? <Image src={photoPreview} alt="Student photo" width={100} height={130} className="object-cover w-full h-full"/> : <User className="w-8 h-8 opacity-10" />}
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 font-bold">
                          {[
                              { label: "Student's Name", value: form.getValues('studentName') },
                              { label: "Date of Birth", value: formatDateForDisplay(form.getValues('dob')) },
                              { label: "Gender", value: form.getValues('gender'), class: "capitalize" },
                              { label: "Blood Group", value: form.getValues('bloodGroup') },
                              { label: "Aadhar Number", value: form.getValues('aadharNumber') },
                              { label: "APAAR/ABC ID", value: form.getValues('apaarId') },
                              { label: "Father's Name", value: form.getValues('fatherName') },
                              { label: "Mother's Name", value: form.getValues('motherName') },
                              { label: "Email Address", value: form.getValues('email') },
                              { label: "Father's Phone", value: form.getValues('fatherPhone') },
                              { label: "Mother's Phone", value: form.getValues('motherPhone') },
                              { label: "Class Applied", value: form.getValues('classApplied') },
                          ].map((item, idx) => (
                              <div key={idx} className="flex flex-col gap-0.5 border-b border-slate-100 pb-1">
                                  <span className="text-[8px] uppercase opacity-40 tracking-widest">{item.label}</span>
                                  <span className={cn("text-foreground", item.class)}>{item.value || 'N/A'}</span>
                              </div>
                          ))}
                          <div className="col-span-full flex flex-col gap-0.5 border-b border-slate-100 pb-1">
                              <span className="text-[8px] uppercase opacity-40 tracking-widest">Permanent Address</span>
                              <span className="text-foreground">{`${form.getValues('address')}, ${form.getValues('state')} - ${form.getValues('pincode')}`}</span>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
        </ScrollArea>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-4">
           <Button variant="outline" className="flex-1 rounded-xl font-bold h-12" onClick={() => setIsPreviewOpen(false)}>
              <Edit className="mr-2 h-4 w-4" />
              EDIT FORM
          </Button>
          <Button variant="secondary" className="flex-1 rounded-xl font-bold h-12" onClick={handleDownload} disabled={form.formState.isSubmitting}>
              <Download className="mr-2 h-4 w-4" />
              DOWNLOAD
          </Button>
          <Button className="flex-1 rounded-xl font-bold h-12 shadow-lg shadow-primary/20" onClick={() => { setIsPreviewOpen(false); setIsPaymentDialogOpen(true); }}>
            PROCEED TO PAY <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-8">
          <DialogHeader>
              <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-3xl">
                      <IndianRupee className="w-12 h-12 text-primary" />
                  </div>
              </div>
              <DialogTitle className="text-center text-2xl font-black">Registration Fee</DialogTitle>
              <DialogDescription className="text-center font-bold text-xs text-muted-foreground uppercase tracking-widest pt-2">
                  Complete the ₹10 registration payment to submit your application.
              </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-xl border border-dashed">
                  <span className="text-xs font-bold uppercase opacity-60">Amount Payable</span>
                  <span className="text-2xl font-black text-primary">₹10.00</span>
              </div>
              <Button 
                  type="button" 
                  onClick={handlePayment}
                  disabled={form.formState.isSubmitting}
                  className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
              >
                  {form.formState.isSubmitting ? 'PROCESSING...' : 'PAY NOW'}
              </Button>
          </div>
      </DialogContent>
    </Dialog>
    
    <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-[2rem] max-w-sm border-none shadow-2xl p-8">
            <DialogHeader>
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-3xl">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <DialogTitle className="text-center text-2xl font-black">Application Sent!</DialogTitle>
                <DialogDescription className="text-center font-bold text-xs text-muted-foreground leading-relaxed pt-2">
                    Your admission form has been received. Our academic counselors will contact you shortly to guide you forward.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
                <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">Close Record</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
