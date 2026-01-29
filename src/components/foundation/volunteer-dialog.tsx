
'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, MessageSquare, HandHeart, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitVolunteerForm } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export function VolunteerDialog() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            toast({
                title: "Application Submitted!",
                description: "Thank you for your interest. We will be in touch shortly.",
            });
            form.reset();
            setIsDialogOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: result.message,
            });
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-md">
                    Volunteer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                 <DialogHeader>
                    <DialogTitle>Become a Volunteer</DialogTitle>
                    <DialogDescription>
                        Join us in making a difference. Your time and skills can change lives.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                placeholder="Why do you want to volunteer? *" 
                                                className="min-h-[100px] pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                                <HandHeart className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
