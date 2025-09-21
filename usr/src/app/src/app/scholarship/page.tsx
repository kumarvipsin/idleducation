
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Award, Calendar, IndianRupee, Home, User, GraduationCap, Phone, MapPin, CheckCircle, Globe } from 'lucide-react';
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { registerForScholarship } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { format, lastDayOfMonth, getDate } from "date-fns";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

const scholarshipClasses = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

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

export default function ScholarshipPage() {
    const { toast } = useToast();
    const [examDates, setExamDates] = useState({ sat: '', sun: '', monthYear: '' });
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const form = useForm<ScholarshipFormValues>({
        resolver: zodResolver(scholarshipSchema),
        defaultValues: {
            studentName: '',
            guardianName: '',
            class: '',
            mobile: '',
            country: 'India',
            state: '',
        },
    });

    useEffect(() => {
      const today = new Date();
      const lastDay = lastDayOfMonth(today);
      let lastSunday = new Date(lastDay);
      let lastSaturday = new Date(lastDay);

      // Find last Sunday
      while (lastSunday.getDay() !== 0) {
        lastSunday.setDate(lastSunday.getDate() - 1);
      }
      
      // Find last Saturday
      lastSaturday.setDate(lastSunday.getDate() - 1);
      // If last day of month is a saturday, saturday should be last day of month and sunday should be the one before
      if (lastDay.getDay() === 6) {
        lastSaturday = lastDay;
        lastSunday = new Date(lastDay);
        lastSunday.setDate(lastDay.getDate() - 1);
      }


      setExamDates({
        sat: format(lastSaturday, 'do'),
        sun: format(lastSunday, 'do'),
        monthYear: format(today, 'MMMM yyyy')
      });
    }, []);

    const onSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
        const result = await registerForScholarship(data);
        if (result.success) {
            setIsThankYouOpen(true);
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: result.message,
            });
        }
    };
    
    return (
        <>
            <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
                <Link href="/" className="absolute top-4 right-4 z-20">
                    <Button variant="ghost" size="icon">
                        <Home className="h-6 w-6 text-primary" />
                        <span className="sr-only">Home</span>
                    </Button>
                </Link>
                {/* Content */}
                <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
                    
                    {/* Header Information */}
                    <div className="space-y-6 mb-8 animate-fade-in-up text-center">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
                            IDL Scholarship & Admission Test
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground font-semibold">
                            For Class V to X
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <Card className="bg-background/50 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                    <span className="text-sm font-semibold text-muted-foreground">Cash Prize</span>
                                    <p className="text-2xl font-bold text-primary">₹ 50 K</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <IndianRupee className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <span className="text-sm font-semibold text-muted-foreground">Scholarships</span>
                                    <p className="text-2xl font-bold text-primary">₹ 75 K</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <span className="text-sm font-semibold text-muted-foreground">Exam Dates</span>
                                    <p className="text-lg font-bold text-primary">{examDates.sat} & {examDates.sun}<br/>{examDates.monthYear}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                            <CardContent className="p-8 space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-primary">Register Here</h2>
                                </div>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="studentName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input placeholder="Enter student's name" {...field} className="pl-9" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="guardianName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input placeholder="Enter guardian's name" {...field} className="pl-9" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="class"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                        <div className="relative">
                                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <SelectTrigger className="pl-9">
                                                                <SelectValue placeholder="Select a class" />
                                                            </SelectTrigger>
                                                        </div>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {scholarshipClasses.map(c => (
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
                                            name="mobile"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <span className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                                                    <Input type="tel" placeholder="Enter Mobile Number" className="pl-16" {...field}/>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                            <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <SelectTrigger className="pl-9">
                                                            <SelectValue placeholder="Select your country *" />
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
                                                    <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <SelectTrigger className="pl-9">
                                                        <SelectValue placeholder="Select a state" />
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
                                        <Button type="submit" className="w-full text-base h-10 font-bold" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'Registering...' : 'Submit'}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <DialogTitle className="text-center text-2xl">Thank You!</DialogTitle>
                        <DialogDescription className="text-center">
                            You have successfully registered for the scholarship. We will contact you soon with further details.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsThankYouOpen(false)} className="w-full">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
