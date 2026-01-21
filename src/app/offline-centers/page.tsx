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
    "Lucknow", "Patna", "Muzaffarpur", "Patiala", "Nagpur", "Indore", "Adilabad", "Buldana",
    "Ahmedabad", "Bengaluru", "Bhopal", "Chennai", "Coimbatore", "Delhi", "Hyderabad", "Jaipur",
    "Kolkata", "Mumbai", "Pune", "Surat", "Visakhapatnam", "Guwahati", "Ranchi", "Bhubaneswar",
];


export default function OfflineCentersPage() {
    return (
        <div className="bg-white dark:bg-background">
            <div className="bg-orange-500 text-white rounded-b-3xl">
                <div className="container mx-auto px-4 md:px-6 py-8">
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
                                <Button variant="outline" className="bg-white text-orange-500 hover:bg-orange-50 border-orange-500 rounded-lg">
                                    Download brochure
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <Card className="bg-slate-900 border-none p-6 rounded-2xl shadow-2xl">
                                
                            </Card>
                             <div className="absolute -right-16 -bottom-10 hidden lg:block">
                                <Image src="https://www.pw.live/version14/assets/img/alakh-pandey-sir-photo.png" alt="Daksh Tayalia" width={200} height={300} className="object-contain" />
                                <div className="bg-white text-black p-1 px-2 rounded-md shadow-lg absolute bottom-12 right-12 text-center">
                                    <p className="font-extrabold text-2xl text-orange-500">99.99</p>
                                    <p className="text-xs font-semibold">Percentile</p>
                                    <p className="text-sm font-bold">Daksh Tayalia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-center gap-2 mt-6">
                        <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-8">
                     <h2 className="text-3xl md:text-4xl font-bold">Now Available in <span className="text-orange-500 underline decoration-yellow-300 decoration-4">37 Cities</span></h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {cities.map(city => (
                        <Card key={city} className="p-4 flex items-center gap-3 hover:shadow-md hover:border-orange-500 transition-all cursor-pointer">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Building className="w-6 h-6 text-orange-500" />
                            </div>
                            <p className="font-semibold">{city}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
