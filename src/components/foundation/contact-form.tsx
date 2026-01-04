
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

export function FoundationContactForm() {
    return (
        <section className="w-full py-16 md:py-24 bg-white text-black dark:text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-sm font-semibold tracking-wider mb-2 text-primary">• Contact us</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Get in touch with our expert team</h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <Input 
                                type="text" 
                                placeholder="Full Name" 
                                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder:text-muted-foreground rounded-lg h-12"
                            />
                             <Input 
                                type="email" 
                                placeholder="Email Address"
                                className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder:text-muted-foreground rounded-lg h-12"
                            />
                        </div>
                        <Select>
                            <SelectTrigger className="w-full text-left bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder:text-muted-foreground rounded-lg h-12">
                                <SelectValue placeholder="Looking for" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="volunteer">Volunteering</SelectItem>
                            </SelectContent>
                        </Select>
                        <Textarea 
                            placeholder="How Can We Help?" 
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 placeholder:text-muted-foreground rounded-lg min-h-[120px]"
                        />
                         <Button type="submit" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 px-6 group mx-auto flex items-center gap-2">
                            Submit your Form
                            <span className="h-6 w-6 rounded-full bg-background text-primary flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
}
