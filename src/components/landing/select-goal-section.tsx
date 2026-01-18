'use client';

import Link from "next/link";
import React from 'react';
import Image from "next/image";

const ExploreIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#E0F2F1"/>
        <circle cx="32" cy="32" r="18" fill="#4DB6AC"/>
        <path d="M46.5858 21.5858L26 42.1716" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46.5858 21.5858L36 18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46.5858 21.5858L50.1716 31.1716" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const goals = [
  {
    name: "Doctor",
    icon: <Image src="/doctor.png" alt="Doctor" width={64} height={64} />,
    href: "/category/neet",
  },
  {
    name: "Engineer",
    icon: <Image src="/engineers.png" alt="Engineer" width={64} height={64} />,
    href: "/category/iit-jee",
  },
  {
    name: "6-10th",
    icon: <Image src="/shuttle.png" alt="School Prep" width={64} height={64} />,
    href: "/school",
  },
  {
    name: "Explore",
    icon: <ExploreIcon />,
    href: "/examcat",
  },
];

export function SelectGoalSection() {
    return (
        <section className="w-full py-6 md:py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-xl md:text-2xl font-black text-accent">
                        Start Your Journey
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Select your goal and we will guide you with a personalized learning path.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 max-w-2xl mx-auto">
                    {goals.map((goal) => (
                        <Link key={goal.name} href={goal.href} className="group">
                            <div className="flex flex-col items-center gap-2">
                                <div className="rounded-2xl bg-white shadow-md group-hover:shadow-xl transition-shadow p-2">
                                    {goal.icon}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{goal.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
