
'use client';

import { Card } from "@/components/ui/card";

const stats = [
    { count: '100+', label: 'Visitors' },
    { count: '100+', label: 'Donors' },
    { count: '20+', label: 'Members' },
    { count: '50+', label: 'Volunteers' }
]

export function Stats() {
    return (
        <section className="w-full py-8 md:py-12 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="text-center p-4 bg-transparent border-none shadow-none">
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                {stat.count}
                            </p>
                            <p className="text-sm md:text-base font-medium text-muted-foreground">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
