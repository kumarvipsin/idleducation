
'use client';

import { Button } from "@/components/ui/button";
import { Home, HandHeart, Target, Eye } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const foundationSlides = [
    {
        src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Happy students celebrating",
        hint: "students celebrating",
        title: "Winds of Change 2019",
        subtitle: "In the winds of change, we find our true direction.",
    },
    {
        src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Students in a classroom",
        hint: "students classroom",
        title: "Empowering Futures",
        subtitle: "Providing opportunities for every student to succeed.",
    },
    {
        src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Graduation ceremony",
        hint: "student graduation",
        title: "Building a Brighter Tomorrow",
        subtitle: "Our commitment to accessible education for all.",
    },
];

export default function IDLFoundationPage() {
    const autoplayPlugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    return (
        <div className="relative w-full bg-background overflow-y-auto">
             <Link href="/" className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon" className="text-white bg-black/20 hover:bg-black/40">
                    <Home className="h-6 w-6" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>

            <div className="h-screen">
                <Carousel
                    plugins={[autoplayPlugin.current]}
                    opts={{ loop: true }}
                    className="w-full h-full"
                >
                    <CarouselContent className="h-full">
                        {foundationSlides.map((slide, index) => (
                            <CarouselItem key={index} className="h-full">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        data-ai-hint={slide.hint}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute bottom-10 left-10 right-10 text-white z-10 p-4 rounded-lg bg-black/30 backdrop-blur-sm text-center">
                                        <h1 className="text-2xl md:text-4xl font-bold">{slide.title}</h1>
                                        <p className="text-sm md:text-lg mt-2 opacity-90">{slide.subtitle}</p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white border-white/50 hover:bg-black/50" />
                </Carousel>
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
