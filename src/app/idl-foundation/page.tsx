'use client';

import { Button } from "@/components/ui/button";
import { Home, HandHeart, Target, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function IDLFoundationPage() {
    return (
        <div className="relative w-full bg-background overflow-y-auto">
            <header className="absolute top-0 left-0 right-0 z-20 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 p-2 rounded-md">
                        <Image src="/logo.png" alt="IDL Foundation Logo" width={32} height={32} />
                        <span className="text-lg font-bold text-white">IDL Foundation</span>
                    </Link>
                    <Link href="/" >
                        <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40">
                            <Home className="h-6 w-6" />
                            <span className="sr-only">Home</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <div 
                className="h-screen"
                style={{
                    background: 'linear-gradient(135deg, hsl(222, 84%, 20%) 0%, hsl(217, 91%, 60%) 100%)'
                }}
            >
                {/* The gradient background is now applied here */}
            </div>

            <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
                            <HandHeart className="w-8 h-8" />
                            About IDL Foundation
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
                            Committed to creating a brighter future through education, empowerment, and community development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                             <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                                    <p className="text-muted-foreground">To create a world where every individual has the opportunity to reach their full potential through quality education and sustainable community support.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                                    <p className="text-muted-foreground">The IDL Foundation is dedicated to providing educational resources, scholarships, and mentorship to underprivileged students. We strive to foster an environment of learning and growth that empowers individuals to become leaders and innovators in their communities.</p>
                                </div>
                            </div>
                        </div>

                         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                           <CardContent className="p-0">
                               <div className="relative aspect-video w-full">
                                    <Image
                                        src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Group of volunteers"
                                        data-ai-hint="volunteers community"
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                               </div>
                                <div className="p-4">
                                    <h4 className="font-bold">Our Activities</h4>
                                    <p className="text-sm text-muted-foreground mt-1">We organize educational workshops, provide scholarships, run mentorship programs, and engage in community outreach to ensure holistic development for students from all backgrounds.</p>
                                </div>
                           </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

        </div>
    );
}
