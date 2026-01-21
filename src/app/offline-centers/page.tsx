'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Building, Sparkles, MapPin } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

const cities = [
    "Mukherjee Nagar",
    "Mangol Puri",
    "Budh Vihar",
    "Krishan Vihar",
];

const centers = [
    {
      name: "Mukherjee Nagar, Delhi",
      address: "Plot No 123, Batra Cinema Complex, Dr Mukherjee Nagar, Delhi - 110009",
      imageUrl: "https://picsum.photos/seed/center1/400/300",
      imageHint: "classroom students",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Mangol Puri, Delhi",
      address: "Block B, Mangolpuri, New Delhi, Delhi 110083",
      imageUrl: "https://picsum.photos/seed/center2/400/300",
      imageHint: "modern classroom",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Budh Vihar, Delhi",
      address: "Phase 1, Budh Vihar, New Delhi, Delhi 110086",
      imageUrl: "https://picsum.photos/seed/center3/400/300",
      imageHint: "students learning",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Krishan Vihar, Delhi",
      address: "Near Krishan Vihar Metro, Delhi 110086",
      imageUrl: "https://picsum.photos/seed/center4/400/300",
      imageHint: "library books",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    }
];


export default function OfflineCentersPage() {
    return (
        <div className="bg-white dark:bg-background">
            <div className="container mx-auto px-4 md:px-6 py-2">
                <div className="bg-purple-600 text-white rounded-2xl p-4 scale-95">
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

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold">IDL Learning Centres Near You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {centers.map((center) => (
                        <Card key={center.name} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={center.imageUrl}
                                    alt={center.name}
                                    data-ai-hint={center.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{center.name}</h3>
                                <div className="flex items-start gap-2 text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0" />
                                    <p className="text-sm">{center.address}</p>
                                </div>
                                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                                    <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">Visit Centre</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <section className="bg-blue-50 dark:bg-background py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="text-orange-500 font-bold text-lg">Why IDL?</h3>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Unlock True Potential Through<br />Highest Personal Attention</h2>
                            <p className="text-muted-foreground">
                                At IDL we provide highest personal attention through our Student Obsessed Heroes and our Tech-integrated Systems.
                            </p>
                        </div>
                        <div>
                            <Image
                                src="https://picsum.photos/seed/why-idl/600/400"
                                alt="Teacher helping students"
                                data-ai-hint="teacher students"
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
