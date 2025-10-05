
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function About() {
    return (
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">About IDL Foundation</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Our commitment to creating a better society through education and empowerment.
                    </p>
                </div>
                <Card className="bg-background/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="flex flex-col text-left p-6 rounded-lg bg-primary/5 border-l-4 border-primary">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    To create a world where every individual has the opportunity to achieve their full potential through quality education and skill development, fostering a society of empowered, self-reliant, and responsible citizens.
                                </p>
                            </div>
                            
                            <div className="flex flex-col text-left p-6 rounded-lg bg-primary/5 border-l-4 border-primary">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    To provide accessible and innovative educational programs, vocational training, and healthcare support to underprivileged communities, with a special focus on children, women, and the elderly, enabling them to lead a life of dignity and respect.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

