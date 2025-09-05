
'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";
import Link from "next/link";

const youtubeChannels = [
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Anjali Verma",
    studentClass: "Class 12",
    studentPlace: "Delhi"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Rohan Sharma",
    studentClass: "JEE Aspirant",
    studentPlace: "Mumbai"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Priya Singh",
    studentClass: "NEET Aspirant",
    studentPlace: "Kolkata"
  },
   {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Vikram Rathore",
    studentClass: "Class 10",
    studentPlace: "Chennai"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Sneha Gupta",
    studentClass: "Class 11",
    studentPlace: "Bengaluru"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "Arjun Mehta",
    studentClass: "SSC Aspirant",
    studentPlace: "Pune"
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

const svgTexture = `
  <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
    <g fill='rgba(217,119,6,0.1)' fill-rule='evenodd'>
      <g fill='#c09533' fill-opacity='0.1' fill-rule='nonzero'>
        <path d='M20 20v40h40V20H20zM0 0v80h80V0H0z' />
      </g>
    </g>
  </svg>
`;

const textureStyle = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
  backgroundSize: '20px 20px',
};


const ChannelCard = ({ channel }: { channel: (typeof youtubeChannels)[0] }) => (
    <Link href={channel.href} target="_blank" rel="noopener noreferrer" className="group shrink-0">
        <Card className={`overflow-hidden shadow-lg w-64 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${channel.gradient} p-0.5`}>
            <div 
              className="bg-background/80 backdrop-blur-sm rounded-[.45rem] h-full p-2 text-center flex flex-col items-center justify-center gap-2"
              style={textureStyle}
            >
                <div className="relative">
                    <YoutubeIcon className={`w-12 h-12 ${channel.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                <h3 className="font-bold text-sm">{channel.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">
                    <p className="font-semibold text-foreground">{channel.studentName}</p>
                    <p>{channel.studentClass} | {channel.studentPlace}</p>
                </div>
            </div>
        </Card>
    </Link>
);


export function ToppersTestimonials() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Topper's</span> <span style={{ color: '#adb5bd' }}>Testimonials</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover how our top students achieved their goals. Watch their success stories and get inspired.
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
            <div className="flex marquee-container gap-6">
                 {/* Render the list twice for a seamless loop */}
                {youtubeChannels.map((channel, index) => (
                    <ChannelCard key={`${channel.name}-${index}`} channel={channel} />
                ))}
                 {youtubeChannels.map((channel, index) => (
                    <ChannelCard key={`${channel.name}-${index}-clone`} channel={channel} />
                ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
