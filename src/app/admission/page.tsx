
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Info, Send, Camera, Briefcase, KeyRound, Upload, Globe, MapPin, Calendar, FileText } from "lucide-react";
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

const phoneRegex = /^\d{10}$/;

const admissionFormSchema = z.object({
  studentId: z.string(),
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, { message: "Mother's name must be at least 2 characters." }),
  motherOccupation: z.string().optional(),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  studentPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }).optional().or(z.literal('')),
  fatherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  motherPhone: z.string().regex(phoneRegex, { message: "Please enter a valid 10-digit mobile number." }),
  address: z.string().min(5, { message: "Address is required." }),
  classApplied: z.string().min(1, { message: "Please select a class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  branch: z.string().min(1, { message: "Please select a branch." }),
  studentPhoto: z.instanceof(File).optional(),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formImage, setFormImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentId: '',
      studentName: '',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      dob: '',
      email: '',
      studentPhone: '',
      fatherPhone: '',
      motherPhone: '',
      address: '',
      classApplied: '',
      previousSchool: '',
      additionalInfo: '',
      branch: 'Mukherjee Nagar, Delhi-110009',
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


  const generatePdf = (imageData: string, studentName: string) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const img = new (window as any).Image();
    img.src = imageData;
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = imgWidth / imgHeight;
      
      let finalImgWidth = pdfWidth;
      let finalImgHeight = pdfWidth / ratio;

      if (finalImgHeight > pdfHeight) {
        finalImgHeight = pdfHeight;
        finalImgWidth = pdfHeight * ratio;
      }
      
      const x = (pdfWidth - finalImgWidth) / 2;
      const y = (pdfHeight - finalImgHeight) / 2;

      pdf.addImage(imageData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      pdf.save(`${studentName}_Admission_Form.pdf`);
    };
  };

  const handlePreview = async () => {
    const isValid = await form.trigger();
    if (isValid && formRef.current) {
      try {
        const canvas = await html2canvas(formRef.current, {
          scale: 2, // Increase resolution for better quality
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        const imageData = canvas.toDataURL('image/png');
        setFormImage(imageData);
        setIsPreviewOpen(true);
      } catch (error) {
        console.error("Error generating form preview:", error);
        toast({
          variant: "destructive",
          title: "Preview Error",
          description: "Could not generate a preview of the form.",
        });
      }
    } else {
       toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill all the required fields before previewing.",
      });
    }
  }

  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (value) {
                formData.append(key, value as string);
            }
        });
        
        const result = await submitAdmissionForm(formData);

        if (result.success) {
            toast({ title: "Success", description: "Your admission form has been submitted successfully!" });
            if (formImage) {
              generatePdf(formImage, data.studentName);
            }
            setIsPreviewOpen(false);
            setFormImage(null);
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
  

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div ref={formRef}>
            <Card className="shadow-lg overflow-hidden">
            <header className="bg-[#03045e] text-white p-4">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-[0.17em]">IDL EDUCATION</h1>
                    <p className="text-sm text-gray-300">(Institute of Distance Learning Pvt. Ltd.)</p>
                </div>
                </div>
            </header>
            <div className="bg-gray-100 text-center py-2">
                <h2 className="text-lg font-bold tracking-widest">ADMISSION FORM</h2>
            </div>
            
            <CardContent className="p-8 bg-gray-50">
                <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-2 text-sm">
                            <p>To,</p>
                            <p>The Managing Director,</p>
                            <p>IDL EDUCATION PVT. LTD.</p>
                            <FormField
                                control={form.control}
                                name="branch"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                    <FormLabel className="font-bold whitespace-nowrap">Branch :</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger className="w-auto">
                                            <SelectValue placeholder="Select a branch" />
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
                        <div className="space-y-4 md:ml-auto">
                            <div className="flex items-center gap-2">
                                <FormLabel className="font-bold">Registration No.:</FormLabel>
                                <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="sr-only">Registration No.</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Generating..." {...field} readOnly className="h-8 font-mono tracking-wider flex-1" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
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
                            <FormLabel>Student's Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Full Name" {...field} className="pl-9" />
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
                            <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Input type="date" {...field} />
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
                            <FormLabel>Father's Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Input placeholder="Father's Full Name" {...field} />
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
                            <FormLabel>Father's Occupation</FormLabel>
                            <FormControl>
                            <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Engineer, Doctor" {...field} className="pl-9" />
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
                            <FormLabel>Mother's Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Input placeholder="Mother's Full Name" {...field} />
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
                            <FormLabel>Mother's Occupation</FormLabel>
                            <FormControl>
                            <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Teacher, Homemaker" {...field} className="pl-9" />
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
                            <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="email" placeholder="example@email.com" {...field} className="pl-9" />
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
                            <FormLabel>Student's Phone Number</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="tel" placeholder="10-digit mobile number" {...field} className="pl-9" />
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
                            <FormLabel>Father's Contact <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="tel" placeholder="10-digit mobile number" {...field} className="pl-9" />
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
                            <FormLabel>Mother's Contact <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="tel" placeholder="10-digit mobile number" {...field} className="pl-9" />
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
                            <FormLabel>Full Address <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Textarea placeholder="Enter your complete address" className="min-h-[100px]" {...field} />
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
                            <FormLabel>Applying for Class <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
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
                            <FormLabel>Previous School Name (if any)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Last school attended" {...field} className="pl-9"/>
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
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Any other information you would like to share" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </form>
                </Form>
            </CardContent>
            </Card>
        </div>
        <div className="mt-8">
            <Button type="button" size="lg" className="w-full" onClick={handlePreview} disabled={!form.getValues('studentId')}>
                <FileText className="mr-2 h-4 w-4" />
                Preview Form
            </Button>
        </div>
      </div>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Admission Form Preview</DialogTitle>
            <DialogDescription>Please review the details below before submitting.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 border rounded-md">
            {formImage ? (
              <Image src={formImage} alt="Admission form preview" width={800} height={1120} className="w-full h-auto" />
            ) : (
              <p>Generating preview...</p>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Edit</Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit & Download PDF
                  </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
