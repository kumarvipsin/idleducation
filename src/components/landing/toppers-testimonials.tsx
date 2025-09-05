
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import Link from "next/link";

const youtubeChannels = [
  {
    name: "IDL NCERT",
    subscribers: "1.35M",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-amber-700 dark:text-amber-400",
  },
  {
    name: "IDL Foundation",
    subscribers: "3.48M",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-amber-700 dark:text-amber-400",
  },
  {
    name: "IDL EDUCATION",
    subscribers: "11.5M",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-gray-200 to-gray-50 dark:from-gray-700/20 dark:to-gray-600/10",
    iconColor: "text-gray-600 dark:text-gray-300",
  },
];


const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M21.582,6.186 c-0.23-0.854-0.908-1.532-1.762-1.762C18.258,4,12,4,12,4S5.742,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.742,2,12,2,12s0,4.258,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.742,20,12,20,12,20s6.258,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.258,22,12,22,12S22,7.742,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
    </svg>
);


export function ToppersTestimonials() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Topper's Testimonials</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {youtubeChannels.map((channel, index) => (
                <Link key={index} href={channel.href} target="_blank" rel="noopener noreferrer" className="group">
                    <Card className={`overflow-hidden shadow-lg h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${channel.gradient} p-0.5`}>
                        <div className="bg-background/80 backdrop-blur-sm rounded-[.45rem] h-full p-6 text-center flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <YoutubeIcon className={`w-16 h-16 ${channel.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                            </div>
                            <h3 className="font-bold text-lg">{channel.name}</h3>
                            <p className="text-sm text-muted-foreground">{channel.subscribers} Subscribers</p>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
