
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, User, Mail, MessageSquare, Home, CheckCircle, GraduationCap, Phone, MapPin, HandHeart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitVolunteerForm } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const volunteerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address is required." }),
  availability: z.string().min(1, { message: "Please select your availability." }),
  reason: z.string().min(20, { message: "Please tell us why you want to volunteer (min. 20 characters)." }),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

const availabilityOptions = ["Weekdays", "Weekends", "Evenings", "Flexible"];

export default function VolunteerPage() {
    const { toast } = useToast();
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const form = useForm<VolunteerFormValues>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            availability: '',
            reason: '',
        },
    });

    const onSubmit: SubmitHandler<VolunteerFormValues> = async (data) => {
        const result = await submitVolunteerForm(data);
        if (result.success) {
            setIsSuccessOpen(true);
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: result.message,
            });
        }
    };

    return (
        <>
            <div className="relative min-h-screen w-full bg-white dark:bg-gray-900 overflow-y-auto">
                <Link href="/" className="absolute top-4 right-4 z-20">
                    <Button variant="ghost" size="icon">
                        <Home className="h-6 w-6 text-primary" />
                        <span className="sr-only">Home</span>
                    </Button>
                </Link>
                <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
                    <div className="space-y-6 mb-8 animate-fade-in-up text-center">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
                            Become a Volunteer
                        </h1>
                        <p className="mt-2 text-lg text-muted-foreground font-semibold">
                            Join us in making a difference. Your time and skills can change lives.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                            <CardContent className="space-y-6 p-8">
                               <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input placeholder="Your Name *" {...field} className="pl-9" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input type="email" placeholder="Your Email *" {...field} className="pl-9" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                             <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input type="tel" placeholder="Phone Number *" {...field} className="pl-9" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                                <Input placeholder="Your Address *" {...field} className="pl-9" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                         <FormField
                                            control={form.control}
                                            name="availability"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Your Availability *" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {availabilityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="reason"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                            <Textarea 
                                                                placeholder="Why do you want to volunteer with us? *" 
                                                                className="min-h-[120px] pl-9"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full text-base h-10 font-bold" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                                            <HandHeart className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                               </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <DialogTitle className="text-center text-2xl">Application Submitted!</DialogTitle>
                        <DialogDescription className="text-center">
                            Thank you for your interest in volunteering with us. We have received your application and will be in touch shortly.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsSuccessOpen(false)} className="w-full">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
