
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, User, Mail, MessageSquare, Home } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions";

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  rating: z.number().min(1, { message: "Please provide a rating." }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
    const { toast } = useToast();
    const [hoverRating, setHoverRating] = useState(0);

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            name: '',
            email: '',
            category: '',
            rating: 0,
            feedback: '',
        },
    });

    const rating = form.watch('rating');

    const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
        const result = await submitFeedback(data);
        if (result.success) {
            toast({
                title: "Feedback Submitted",
                description: result.message,
            });
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
        <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
            <Link href="/" className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon">
                    <Home className="h-6 w-6 text-primary" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>
            <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
                <div className="space-y-6 mb-8 animate-fade-in-up text-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
                        Share Your Feedback
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground font-semibold">
                        We value your opinion and would love to hear about your experience.
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
                                                            <Input placeholder="Your Name (Optional)" {...field} className="pl-9" />
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
                                                            <Input type="email" placeholder="Your Email (Optional)" {...field} className="pl-9" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Feedback Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="general">General Feedback</SelectItem>
                                                        <SelectItem value="course-content">Course Content</SelectItem>
                                                        <SelectItem value="teacher">Teacher Experience</SelectItem>
                                                        <SelectItem value="technical-issue">Technical Issue</SelectItem>
                                                        <SelectItem value="suggestion">Suggestion</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem className="text-center space-y-2">
                                                <p className="font-medium text-muted-foreground">How would you rate your overall experience?</p>
                                                <FormControl>
                                                     <div className="flex justify-center gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                type="button"
                                                                key={star}
                                                                onMouseEnter={() => setHoverRating(star)}
                                                                onMouseLeave={() => setHoverRating(0)}
                                                                onClick={() => field.onChange(star)}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star className={cn(
                                                                    "w-8 h-8 transition-all duration-200",
                                                                    (hoverRating || rating) >= star 
                                                                        ? "text-yellow-400 fill-yellow-400 scale-110" 
                                                                        : "text-gray-300 hover:scale-110"
                                                                )} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-center"/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="feedback"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                        <Textarea 
                                                            placeholder="Tell us more about your experience..." 
                                                            className="min-h-[150px] pl-9"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full text-base h-10 font-bold" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                        <Send className="ml-2 h-4 w-4" />
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
