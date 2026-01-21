
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Building, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

const toppers = [
    { name: "Prakhar Singh", percentile: "99.98", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/dhrumil-chauhan.png" },
    { name: "Tanmay Gupta", percentile: "99.95", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/ipsit-mittal.png" },
    { name: "Vedant Saxena", percentile: "99.94", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/aditya-neeraje.png" },
    { name: "Ketan S nagda", percentile: "99.94", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-4.png" },
];

const cities = [
    "Mukherjee Nagar",
    "Mangol Puri",
    "Budh Vihar",
    "Krishan Vihar",
];


export default function OfflineCentersPage() {
    return (
        <div className="bg-white dark:bg-background">
            <div className="container mx-auto px-4 md:px-6 py-2">
                <div className="bg-purple-600 text-white rounded-2xl p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                             <div className="flex items-center gap-2">
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                                <h1 className="text-3xl md:text-5xl font-bold">
                                    IDL Learning Centres Now in Delhi
                                </h1>
                            </div>
                            <div className="bg-yellow-400 text-black font-semibold py-2 px-4 inline-block -skew-x-12">
                                <p className="skew-x-12">Offline Courses for CUET | 6-10 Foundation</p>
                            </div>
                            <div className="flex gap-4">
                                <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg">
                                    Book a Visit <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-50 border-purple-600 rounded-lg">
                                    Download brochure
                                </Button>
                            </div>
                        </div>

                        <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                             <Image
                                src="https://images.unsplash.com/photo-1510531704581-5b2870972060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8Y2xhc3Nyb29tfGVufDB8fHx8MTc2OTAwOTMzOHww&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="IDL Offline Center"
                                data-ai-hint="classroom students"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold">Now Available in <span className="text-purple-600 underline decoration-yellow-400 decoration-4">Delhi</span></h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {cities.map(city => (
                        <Card key={city} className="p-4 flex items-center gap-3 hover:shadow-md hover:border-purple-600 transition-all cursor-pointer">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Building className="w-6 h-6 text-purple-600" />
                            </div>
                            <p className="font-semibold">{city}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
