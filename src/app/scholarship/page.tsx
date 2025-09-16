
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Award, Calendar, IndianRupee, Home } from 'lucide-react';
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

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
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

export default function ScholarshipPage() {
    const { toast } = useToast();
    const [examDates, setExamDates] = useState({ sat: '', sun: '', monthYear: '' });
    const form = useForm<ScholarshipFormValues>({
        resolver: zodResolver(scholarshipSchema),
        defaultValues: {
            studentName: '',
            guardianName: '',
            class: '',
            mobile: '',
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
            toast({
                title: "Registration Successful",
                description: result.message,
            });
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
                    <Image
                        src="/logo.png"
                        alt="IDL Education Logo"
                        width={100}
                        height={100}
                        className="mx-auto filter hue-rotate-15 saturate-150"
                    />
                    <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
                        IDL National Scholarship & Admission Test
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
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="studentName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Enter student's name" {...field} />
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
                                                    <Input placeholder="Enter guardian's name" {...field} />
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
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a class" />
                                                        </SelectTrigger>
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
                                                <div className="flex items-center mt-1">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm h-10">
                                                        +91
                                                    </span>
                                                    <Input type="tel" id="phone" placeholder="Enter Your Mobile Number" className="rounded-l-none h-10" {...field}/>
                                                </div>
                                            </FormControl>
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
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
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
                                    <Button type="submit" className="w-full text-lg h-12 rounded-full font-bold" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Registering...' : 'Submit'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
