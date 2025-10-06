
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Zap, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function About() {
    return (
        <section id="about" className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">About IDL Foundation</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Our commitment to creating a better society through education and empowerment.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 dark:from-red-800/70 dark:via-pink-800/70 dark:to-purple-900/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className="bg-white/20 text-white p-4 rounded-full mb-4">
                                <Eye className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Vision</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                To create a world where every individual has the opportunity to achieve their full potential through quality education and skill development.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 dark:from-red-800/70 dark:via-pink-800/70 dark:to-purple-900/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                             <div className="bg-white/20 text-white p-4 rounded-full mb-4">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Mission</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                To provide accessible and innovative educational programs, vocational training, and healthcare support to underprivileged communities.
                            </p>
                        </CardContent>
                    </Card>
                     <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 dark:from-red-800/70 dark:via-pink-800/70 dark:to-purple-900/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                             <div className="bg-white/20 text-white p-4 rounded-full mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Approach</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                We believe in a holistic approach, combining technology and grassroots efforts to create sustainable and scalable solutions for social change.
                            </p>
                        </CardContent>
                    </Card>
                     <Card className="bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 dark:from-red-800/70 dark:via-pink-800/70 dark:to-purple-900/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                             <div className="bg-white/20 text-white p-4 rounded-full mb-4">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Our Impact</h3>
                            <p className="text-white/80 text-sm leading-relaxed">
                                We have touched thousands of lives through our programs, providing education, skills, and opportunities for a better future.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
