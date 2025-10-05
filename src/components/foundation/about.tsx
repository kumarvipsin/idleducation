
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, Target } from "lucide-react";

export function About() {
    return (
        <section className="w-full py-8 bg-white dark:bg-gray-800/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <BookOpen className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">About IDL Foundation</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Our commitment to creating a better society through education and empowerment.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-background/50 border-t-4 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <Eye className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">Our Vision</h3>
                            <p className="text-muted-foreground">
                                To create a world where every individual has the opportunity to achieve their full potential through quality education and skill development, fostering a society of empowered, self-reliant, and responsible citizens.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-background/50 border-t-4 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <Target className="w-8 h-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">Our Mission</h3>
                            <p className="text-muted-foreground">
                                To provide accessible and innovative educational programs, vocational training, and healthcare support to underprivileged communities, with a special focus on children, women, and the elderly, enabling them to lead a life of dignity and respect.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
