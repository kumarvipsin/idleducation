'use client';

import { Card } from "@/components/ui/card";
import { Handshake } from "lucide-react";
import Image from "next/image";

const companies = [
    { name: "DDU-GKY", logo: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/ddu-gky.png" },
    { name: "Maulana Azad Education Foundation", logo: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/maef.png" },
    { name: "Ministry of Textiles", logo: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/ministry-of-textiles.png" },
    { name: "Delhi Government", logo: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/delhi-govt.png" },
];

const people = [
    { name: "Bhagwati Exports", logo: "https://ekhumfoundation.com/wp-content/uploads/2023/07/Bhagwati-Exports-1-1024x725.png" },
    { name: "Another Donor", logo: "https://static.vecteezy.com/system/resources/thumbnails/008/124/726/small/a-picture-of-a-logo-with-the-words-sri-lanka-on-it-vector.jpg" },
    { name: "New Foundation", logo: "https://png.pngtree.com/png-vector/20190302/ourmid/pngtree-green-leaf-logo-png-image_734493.jpg" },
    { name: "Charity Plus", logo: "https://png.pngtree.com/png-vector/20190302/ourmid/pngtree-green-leaf-logo-png-image_734493.jpg" },
];

export function Donors() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
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
