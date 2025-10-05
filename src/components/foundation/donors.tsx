
'use client';

import { Card } from "@/components/ui/card";
import { Handshake } from "lucide-react";
import Image from "next/image";

const companies = [
    { name: "DDU-GKY", logo: "https://picsum.photos/seed/ddu/200/100" },
    { name: "Maulana Azad Education Foundation", logo: "https://picsum.photos/seed/maef/200/100" },
    { name: "Ministry of Textiles", logo: "https://picsum.photos/seed/textiles/200/100" },
    { name: "Delhi Government", logo: "https://picsum.photos/seed/delhi-govt/200/100" },
];

const people = [
    { name: "Bhagwati Exports", logo: "https://picsum.photos/seed/donor1/200/100" },
    { name: "Another Donor", logo: "https://picsum.photos/seed/donor2/200/100" },
    { name: "New Foundation", logo: "https://picsum.photos/seed/foundation/200/100" },
    { name: "Charity Plus", logo: "https://picsum.photos/seed/charity/200/100" },
];

export function Donors() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <Handshake className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Our Donors</h2>
                </div>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">10+ Companies and Organizations</h3>
                        <div className="w-full overflow-hidden">
                            <div className="flex animate-marquee-scroll-reverse">
                                {[...companies, ...companies].map((donor, index) => (
                                    <Card key={`company-${index}`} className="flex-shrink-0 w-64 flex items-center p-4 bg-card shadow-lg mx-3 rounded-lg">
                                        <p className="text-sm font-semibold text-center text-muted-foreground flex-1">{donor.name}</p>
                                        <div className="relative h-12 w-20 ml-4">
                                            <Image
                                                src={donor.logo}
                                                alt={`${donor.name} logo`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">100+ People</h3>
                        <div className="w-full overflow-hidden">
                            <div className="flex animate-marquee-scroll">
                                {[...people, ...people].map((donor, index) => (
                                    <Card key={`person-${index}`} className="flex-shrink-0 w-64 flex items-center p-4 bg-card shadow-lg mx-3 rounded-lg">
                                        <p className="text-sm font-semibold text-center text-muted-foreground flex-1">{donor.name}</p>
                                        <div className="relative h-12 w-20 ml-4">
                                            <Image
                                                src={donor.logo}
                                                alt={`${donor.name} logo`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
