
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, GraduationCap, Building, Info, Send, Camera, Briefcase, KeyRound, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { getNextStudentId, submitAdmissionForm } from "@/app/actions";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const admissionFormSchema = z.object({
  studentId: z.string(),
  studentName: z.string().min(2, { message: "Student name must be at least 2 characters." }),
  fatherName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(2, { message: "Mother's name must be at least 2 characters." }),
  motherOccupation: z.string().optional(),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address is required." }),
  classApplied: z.string().min(1, { message: "Please select a class." }),
  previousSchool: z.string().optional(),
  additionalInfo: z.string().optional(),
  studentPhoto: z.any()
    .refine((file) => file, "Student photo is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

export default function AdmissionPage() {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      phone: '',
      address: '',
      classApplied: '',
      previousSchool: '',
      additionalInfo: '',
      studentPhoto: undefined,
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


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('studentPhoto', file);
      form.clearErrors('studentPhoto');
    }
  };
  
  const generatePdf = (data: AdmissionFormValues) => {
    const doc = new jsPDF();
    const padding = 15;
    const lineHeight = 10;
    let y = padding;

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("IDL EDUCATION Admission Form", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += lineHeight * 2;
    
    // Photo
    if (photoPreview) {
       const img = new Image();
       img.src = photoPreview;
       doc.addImage(img, 'JPEG', doc.internal.pageSize.getWidth() - padding - 35, padding, 35, 45);
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Personal Details
    doc.setFont('helvetica', 'bold');
    doc.text("Personal Details", padding, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.text(`Student ID: ${data.studentId}`, padding, y);
    y += lineHeight;
    doc.text(`Student Name: ${data.studentName}`, padding, y);
    y += lineHeight;
    doc.text(`Date of Birth: ${data.dob}`, padding, y);
    y += lineHeight;
    doc.text(`Father's Name: ${data.fatherName}`, padding, y);
    y += lineHeight;
    doc.text(`Father's Occupation: ${data.fatherOccupation || 'N/A'}`, padding, y);
    y += lineHeight;
    doc.text(`Mother's Name: ${data.motherName}`, padding, y);
    y += lineHeight;
    doc.text(`Mother's Occupation: ${data.motherOccupation || 'N/A'}`, padding, y);
    y += lineHeight * 2;
    
    // Contact Details
    doc.setFont('helvetica', 'bold');
    doc.text("Contact Details", padding, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${data.email}`, padding, y);
    y += lineHeight;
    doc.text(`Phone: ${data.phone}`, padding, y);
    y += lineHeight;
    doc.text(`Address: ${data.address}`, padding, y, { maxWidth: doc.internal.pageSize.getWidth() - padding * 2 });
    y += lineHeight * 3;

    // Academic Details
    doc.setFont('helvetica', 'bold');
    doc.text("Academic Details", padding, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.text(`Applying for Class: ${data.classApplied}`, padding, y);
    y += lineHeight;
    doc.text(`Previous School: ${data.previousSchool || 'N/A'}`, padding, y);
    y += lineHeight;
    doc.text(`Additional Info: ${data.additionalInfo || 'N/A'}`, padding, y, { maxWidth: doc.internal.pageSize.getWidth() - padding * 2 });
    y += lineHeight * 5;

    // Signature
    doc.line(padding, y, doc.internal.pageSize.getWidth() - padding, y);
    y += 5;
    doc.setFont('helvetica', 'italic');
    doc.text("Authorized Signature", padding, y);

    doc.save(`${data.studentName}_Admission_Form.pdf`);
  };

  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });

        const result = await submitAdmissionForm(formData);

        if (result.success) {
            toast({ title: "Success", description: "Your admission form has been submitted successfully!" });
            generatePdf(data);
            form.reset();
            setPhotoPreview(null);
            // Fetch the next ID for the new form
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
    "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="text-center bg-primary text-primary-foreground p-8">
            <CardTitle className="text-3xl font-bold">Student Admission Form</CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-2">
              Please fill out the form below to apply for admission.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                   <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Generating ID..." {...field} readOnly className="pl-9 font-mono" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentPhoto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student's Photo <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <label className="cursor-pointer">
                                <div className="w-[132px] h-[170px] rounded-md bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground hover:border-primary transition-colors">
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Student photo preview" width={132} height={170} className="object-cover h-full w-full"/>
                                ) : (
                                    <div className="text-center text-muted-foreground p-2">
                                        <Camera className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-xs">Click to upload photo (35x45mm)</p>
                                    </div>
                                )}
                                </div>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                 />
                            </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
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
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting || !form.getValues('studentId')}>
                   {form.formState.isSubmitting ? 'Submitting...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit & Download PDF
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
