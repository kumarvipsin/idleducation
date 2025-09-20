
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Info, Send, Camera, Briefcase, KeyRound, Upload, Globe, MapPin, Calendar as CalendarIcon, FileText, Edit, Download, Hash, Home, Droplets, VenetianMask } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useState, useEffect, useRef } from "react";
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
  state: z.string().min(1, { message: "Please select a state." }),
  pincode: z.string().regex(pincodeRegex, { message: "Please enter a valid 6-digit pincode." }),
  classApplied: z.string().min(1, { message: "Please select a class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  branch: z.string().min(1, { message: "Please select your nearest branch." }),
  studentPhoto: z.instanceof(File).optional(),
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
      state: '',
      pincode: '',
      classApplied: '',
      previousSchool: '',
      additionalInfo: '',
      branch: '',
      transactionId: 'N/A', // Default to N/A, will be updated by Razorpay
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
            toast({ title: "Success", description: "Your admission form has been submitted successfully!" });
            
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
    <div className="relative min-h-screen w-full md:p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 px-4 md:px-0">
        <div className="md:max-w-4xl md:mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
                  Admission Form
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
              </h1>
              <p className="mt-2 text-base text-muted-foreground font-semibold">
                  Fill out the form below to start your journey with IDL Education.
              </p>
          </div>
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up md:rounded-2xl" style={{ animationDelay: '0.2s' }}>
            <header className="bg-primary text-white p-4">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider">IDL EDUCATION</h1>
                    <p className="text-sm text-gray-300">(Institute of Distance Learning Pvt. Ltd.)</p>
                </div>
                </div>
            </header>
            
            <CardContent className="p-4 md:p-8">
                <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-2 text-sm">
                            <p>To,</p>
                            <p>The Managing Director,</p>
                            <p>IDL EDUCATION PVT. LTD.</p>
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                    <FormLabel className="font-bold whitespace-nowrap">Branch <span className="text-destructive">*</span>:</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="w-full">
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
                                        <Input placeholder="Generating..." {...field} readOnly className="h-8 font-mono tracking-wider" />
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
                                            <div className="w-[132px] h-[170px] mx-auto rounded-md bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground">
                                            {photoPreview ? (
                                                    <Image src={photoPreview} alt="Student photo preview" width={132} height={170} className="object-cover h-full w-full"/>
                                            ) : (
                                                    <div className="text-center text-muted-foreground p-2">
                                                        <Upload className="w-6 h-6 mx-auto mb-2" />
                                                        <p className="text-xs">Upload Photo</p>
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

                    <Separator />

                    <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Student's Name *" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
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
                            <FormItem className="flex flex-col">
                                <div className="grid grid-cols-3 gap-2">
                                    <Select onValueChange={(value) => setDob(d => ({...d, day: value}))} value={dob.day}>
                                        <SelectTrigger><SelectValue placeholder="Day *" /></SelectTrigger>
                                        <SelectContent>
                                            {availableDays.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(value) => setDob(d => ({...d, month: value}))} value={dob.month}>
                                        <SelectTrigger><SelectValue placeholder="Month *" /></SelectTrigger>
                                        <SelectContent>
                                            {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(value) => setDob(d => ({...d, year: value}))} value={dob.year}>
                                        <SelectTrigger><SelectValue placeholder="Year *" /></SelectTrigger>
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
                                        <div className="relative">
                                            <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-9">
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
                                        <div className="relative">
                                            <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-9">
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
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Aadhar Number" {...field} className="pl-9" maxLength={12} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
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
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="APAAR/ABC ID" {...field} className="pl-9" />
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
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Father's Name *" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
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
                            <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Father's Occupation" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
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
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Mother's Name *" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
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
                            <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Mother's Occupation" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
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
                                <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="Email Address *" {...field} className="pl-9" onChange={(e) => field.onChange(e.target.value.toLowerCase())}/>
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
                                <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="tel" placeholder="Student's Phone Number" {...field} className="pl-9" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
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
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="tel" placeholder="Father's Contact *" {...field} className="pl-9" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} />
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
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="tel" placeholder="Mother's Contact *" {...field} className="pl-9" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}/>
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
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea placeholder="Full Address *" className="min-h-[100px] pl-9" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <SelectTrigger className="pl-9">
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
                                    <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Pincode *" {...field} className="pl-9" onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} maxLength={6} />
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
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <SelectTrigger className="pl-9">
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
                                <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Previous School Name (if any)" {...field} className="pl-9" onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
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
                           <div className="relative">
                                <Info className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea placeholder="Additional Information" className="min-h-[100px] pl-9" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
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
          <div className="mt-8">
              <Button type="button" size="lg" className="w-full" onClick={handlePreview} disabled={!form.getValues('studentId')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Preview Form
              </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Admission Form Preview</DialogTitle>
            <DialogDescription>Please review the details below before submitting.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 border rounded-md">
            <div ref={previewRef} className="bg-white text-black p-4">
               <Card className="shadow-none border-0">
                    <header className="bg-primary text-white p-4">
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-wider">IDL EDUCATION</h1>
                            <p className="text-sm text-gray-300">(Institute of Distance Learning Pvt. Ltd.)</p>
                        </div>
                        </div>
                    </header>
                    <div className="bg-muted/30 text-center py-2">
                        <h2 className="text-lg font-bold tracking-widest text-foreground">ADMISSION FORM</h2>
                    </div>
                    <CardContent className="p-8 text-sm">
                        <div className="grid grid-cols-3 gap-8 mb-6">
                             <div className="col-span-2 space-y-1">
                                <p>To,</p>
                                <p>The Managing Director,</p>
                                <p>IDL EDUCATION PVT. LTD.</p>
                                <p><span className="font-bold">Branch:</span> {form.getValues('branch')}</p>
                            </div>
                             <div className="col-span-1 space-y-2">
                                <p><span className="font-bold">Stu ID.:</span> {form.getValues('studentId')}</p>
                                <div className="w-[132px] h-[170px] bg-muted border overflow-hidden rounded-md">
                                    {photoPreview && <Image src={photoPreview} alt="Student photo" width={132} height={170} className="object-cover w-full h-full"/>}
                                </div>
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Student's Name</td><td className="p-2">{form.getValues('studentName')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Date of Birth</td><td className="p-2">{formatDateForDisplay(form.getValues('dob'))}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Gender</td><td className="p-2 capitalize">{form.getValues('gender')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Blood Group</td><td className="p-2">{form.getValues('bloodGroup') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Aadhar Number</td><td className="p-2">{form.getValues('aadharNumber') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">APAAR/ABC ID</td><td className="p-2">{form.getValues('apaarId') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Name</td><td className="p-2">{form.getValues('fatherName')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Occupation</td><td className="p-2">{form.getValues('fatherOccupation') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Name</td><td className="p-2">{form.getValues('motherName')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Occupation</td><td className="p-2">{form.getValues('motherOccupation') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Email Address</td><td className="p-2">{form.getValues('email')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Student's Phone</td><td className="p-2">{form.getValues('studentPhone') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Contact</td><td className="p-2">{form.getValues('fatherPhone')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Contact</td><td className="p-2">{form.getValues('motherPhone')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold align-top">Address</td><td className="p-2">{`${form.getValues('address')}, ${form.getValues('state')} - ${form.getValues('pincode')}`}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Applying for Class</td><td className="p-2">{form.getValues('classApplied')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Previous School</td><td className="p-2">{form.getValues('previousSchool') || 'N/A'}</td></tr>
                                <tr><td className="p-2 border-r border-gray-300 font-semibold align-top">Additional Information</td><td className="p-2">{form.getValues('additionalInfo') || 'N/A'}</td></tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
          </ScrollArea>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:justify-end">
             <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Form
            </Button>
            <Button variant="secondary" onClick={handleDownload} disabled={form.formState.isSubmitting}>
                <Download className="mr-2 h-4 w-4" />
                Download Form
            </Button>
            <Button onClick={() => { setIsPreviewOpen(false); setIsPaymentDialogOpen(true); }} disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              Proceed to Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Payment Confirmation</DialogTitle>
                <DialogDescription>
                    Please click the button below to pay the ₹10 registration fee.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4 py-4">
                <Button 
                    type="button" 
                    onClick={handlePayment}
                    disabled={form.formState.isSubmitting}
                    className="w-full"
                    size="lg"
                >
                    {form.formState.isSubmitting ? 'Processing...' : 'Pay ₹10 Now'}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
