'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Heart } from "lucide-react";
import Link from "next/link";

export default function IDLFoundationPage() {
  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-2xl animate-fade-in-up shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-4">
                        <Heart className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-primary">IDL Foundation</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Empowering Futures, One Student at a Time
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-8 space-y-4 text-center">
                    <p className="text-foreground/80 leading-relaxed">
                        Welcome to the IDL Foundation, the heart of our commitment to social responsibility. We believe in the transformative power of education and are dedicated to making it accessible to all, regardless of their background or circumstances.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                        Our foundation focuses on providing scholarships, resources, and mentorship to underprivileged students, ensuring that financial constraints do not stand in the way of their dreams. We partner with communities to build a supportive ecosystem for learning and growth.
                    </p>
                     <p className="text-foreground/80 leading-relaxed font-semibold text-primary">
                        More details about our initiatives, impact, and how you can get involved will be available here soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
