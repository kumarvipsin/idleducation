
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FeedbackPage() {
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");

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
        
        toast({
            title: "Feedback Submitted",
            description: "Thank you for your valuable feedback!",
        });
        setRating(0);
        setFeedback("");
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">Share Your Feedback</CardTitle>
                    <CardDescription>We value your opinion and would love to hear about your experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="font-medium">How would you rate your experience?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star className={cn(
                                        "w-8 h-8 transition-colors",
                                        (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    )} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                         <p className="font-medium">Tell us more about your experience:</p>
                        <Textarea 
                            placeholder="Your feedback helps us improve..." 
                            className="min-h-[150px]"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                     <Button className="w-full" onClick={handleSubmit}>Submit Feedback</Button>
                </CardContent>
            </Card>
        </div>
    );
}
