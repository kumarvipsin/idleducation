
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, Target } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function About() {
    const svgTexture = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><g fill='rgba(30,58,138,0.05)'><circle cx='50' cy='50' r='50'/><circle cx='0' cy='50' r='50'/><circle cx='100' cy='50' r='50'/></g></svg>`;
    const textureStyle = {
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
      backgroundSize: '100px 100px',
    };

    return (
        <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-900/50" style={textureStyle}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">About IDL Foundation</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Our commitment to creating a better society through education and empowerment.
                    </p>
                </div>
                <Card className="bg-background/50 border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-4xl mx-auto">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary/10 text-primary p-5 rounded-full ring-4 ring-primary/5 mb-4">
                                    <Eye className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    To create a world where every individual has the opportunity to achieve their full potential through quality education and skill development, fostering a society of empowered, self-reliant, and responsible citizens.
                                </p>
                            </div>

                            <div className="relative h-full">
                                <Separator orientation="vertical" className="absolute left-1/2 -translate-x-1/2 top-0 h-full hidden md:block" />
                                <Separator orientation="horizontal" className="absolute top-1/2 -translate-y-1/2 left-0 w-full md:hidden" />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-primary/10 text-primary p-5 rounded-full ring-4 ring-primary/5 mb-4">
                                    <Target className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Our Mission</h3>
                                <p className="text-muted-foreground">
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
