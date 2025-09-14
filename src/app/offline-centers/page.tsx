import { IndiaMap } from "@/components/india-map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const branches = [
    { name: "Local Head Office, Krishan Vihar", address: "E-18 Krishan Vihar, Main Kanjhawala Road Delhi-110086" },
    { name: "Mukherjee Nagar", address: "Delhi-110009" },
    { name: "Mangol Puri", address: "Delhi-110083" },
    { name: "Budh Vihar", address: "Delhi-110086" },
    { name: "Burari", address: "Delhi-110084" },
];

export default function OfflineCentersPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6" style={{ maxWidth: '79%' }}>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">Our Offline Centers</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80 mt-4">
                    Find an IDL EDUCATION center near you. We are ready to welcome you for an exceptional offline learning experience.
                </p>
            </div>

            <Card className="shadow-lg overflow-hidden">
                <CardContent className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-2 relative w-full aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
                        <IndiaMap />
                    </div>
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-4 text-primary border-b pb-2">Our Branches in Delhi</h2>
                        <div className="space-y-4">
                            {branches.map((branch, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold">{branch.name}</h3>
                                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
