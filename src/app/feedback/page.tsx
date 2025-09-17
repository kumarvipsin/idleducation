
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, User, Mail, MessageSquare, Home } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function FeedbackPage() {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) {
            toast({
                variant: "destructive",
                title: "Rating required",
                description: "Please select a star rating before submitting.",
            });
            return;
        }
        if (feedback.trim().length < 10) {
             toast({
                variant: "destructive",
                title: "Feedback too short",
                description: "Please provide at least 10 characters of feedback.",
            });
            return;
        }
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Feedback Submitted",
                description: "Thank you for your valuable feedback!",
            });
            setRating(0);
            setFeedback("");
            setName("");
            setEmail("");
            setCategory("");
            setIsSubmitting(false);
        }, 1000);
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
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-primary">Feedback Form</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8">
                             <div className="grid sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your Name (Optional)" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="email" placeholder="Your Email (Optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                                </div>
                            </div>
                             <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Feedback Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Feedback</SelectItem>
                                    <SelectItem value="course-content">Course Content</SelectItem>
                                    <SelectItem value="teacher">Teacher Experience</SelectItem>
                                    <SelectItem value="technical-issue">Technical Issue</SelectItem>
                                    <SelectItem value="suggestion">Suggestion</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="text-center space-y-2">
                                <p className="font-medium text-muted-foreground">How would you rate your overall experience?</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
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
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea 
                                        placeholder="Tell us more about your experience..." 
                                        className="min-h-[150px] pl-9"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="w-full text-base h-10 font-bold" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
