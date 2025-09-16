
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Info, Send, Camera, Briefcase, KeyRound, Upload, Globe, MapPin, Calendar as CalendarIcon, FileText, Edit, Download, Hash, Home } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState, useEffect, useRef } from "react";
import { getNextStudentId, submitAdmissionForm } from "@/app/actions";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const phoneRegex = /^\d{10}$/;

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
  email: z.string().email({ message: "Please enter a valid email." }),
  studentPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }).optional().or(z.literal('')),
  fatherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  motherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  address: z.string().min(5, { message: "Address is required." }),
  classApplied: z.string().min(1, { message: "Please select a class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  branch: z.string().min(1, { message: "Please select your nearest branch." }),
  studentPhoto: z.instanceof(File).optional(),
  transactionId: z.string().min(1, { message: "Transaction ID is required." }),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
      classApplied: '',
      previousSchool: '',
      additionalInfo: '',
      branch: '',
      transactionId: '',
    },
  });

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
        "studentName", "fatherName", "motherName", "dob", "email", "fatherPhone", "motherPhone", "address", "classApplied", "branch"
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
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 px-4 md:px-[10%]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
                  Admission Form
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
              </h1>
              <p className="mt-2 text-base text-muted-foreground font-semibold">
                  Fill out the form below to start your journey with IDL Education.
              </p>
          </div>
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <header className="bg-primary text-white p-4">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider">IDL EDUCATION</h1>
                    <p className="text-sm text-gray-300">(Institute of Distance Learning Pvt. Ltd.)</p>
                </div>
                </div>
            </header>
            
            <CardContent className="p-8">
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
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                            format(field.value, "dd/MM/yyyy")
                                            ) : (
                                            <span>Date of Birth *</span>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
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
                            <Textarea placeholder="Full Address *" className="min-h-[100px]" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
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
                            <Textarea placeholder="Additional Information" className="min-h-[100px]" {...field} onChange={(e) => field.onChange(capitalizeWords(e.target.value))} />
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
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Name</td><td className="p-2">{form.getValues('fatherName')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Occupation</td><td className="p-2">{form.getValues('fatherOccupation') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Name</td><td className="p-2">{form.getValues('motherName')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Occupation</td><td className="p-2">{form.getValues('motherOccupation') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Email Address</td><td className="p-2">{form.getValues('email')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Student's Phone</td><td className="p-2">{form.getValues('studentPhone') || 'N/A'}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Father's Contact</td><td className="p-2">{form.getValues('fatherPhone')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Mother's Contact</td><td className="p-2">{form.getValues('motherPhone')}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold align-top">Address</td><td className="p-2">{form.getValues('address')}</td></tr>
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Payment Confirmation</DialogTitle>
                        <DialogDescription>
                            Please scan the QR code to pay the ₹10 registration fee. After payment, enter the transaction ID and click submit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4 py-4">
                        <Image src="/qrcode.jpg" alt="Payment QR Code" width={200} height={200} />
                        <p className="font-bold text-lg">Scan to pay ₹10</p>
                        <FormField
                            control={form.control}
                            name="transactionId"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel>Transaction ID <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Enter your transaction ID" {...field} className="pl-9" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Submitting...' : 'Confirm Payment & Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
