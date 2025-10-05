'use client';

import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);
            const currentCount = Math.floor(end * percentage);
            setCount(currentCount);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [end, duration]);

    return <>{count.toLocaleString()}{suffix}</>;
};


const stats = [
    { count: 1000, suffix: '+', label: 'Visitors' },
    { count: 100, suffix: '+', label: 'Donors' },
    { count: 20, suffix: '+', label: 'Members' },
    { count: 50, suffix: '+', label: 'Volunteers' }
]

export function Stats() {
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="w-full py-8 md:py-12 bg-background text-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                {isInView ? <AnimatedCounter end={stat.count} suffix={stat.suffix} /> : '0'}
                            </p>
                            <p className="text-sm md:text-base font-medium text-muted-foreground">{stat.label}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
