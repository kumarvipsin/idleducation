'use client';

import Link from "next/link";
import React from 'react';

const DoctorIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="12" fill="#EBF5FF"/>
      <path d="M32 38C38.6274 38 44 33.5228 44 27C44 20.4772 38.6274 16 32 16C25.3726 16 20 20.4772 20 27C20 33.5228 25.3726 38 32 38Z" fill="#4A4A4A"/>
      <path d="M48 54C48 46.268 40.8366 40 32 40C23.1634 40 16 46.268 16 54H48Z" fill="white"/>
      <rect x="30" y="14" width="4" height="2" rx="1" fill="#FFD966"/>
      <rect x="28" y="12" width="8" height="2" rx="1" fill="#FFD966"/>
    </svg>
);

const EngineerIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#FFF3E0"/>
        <path d="M19 28C19 23.5817 22.5817 20 27 20H37C41.4183 20 45 23.5817 45 28V32H19V28Z" fill="#FFC107"/>
        <path d="M32 44C37.5228 44 42 39.5228 42 34C42 28.4772 37.5228 24 32 24C26.4772 24 22 28.4772 22 34C22 39.5228 26.4772 44 32 44Z" fill="#A1887F"/>
        <path d="M48 56C48 48.268 40.8366 42 32 42C23.1634 42 16 48.268 16 56H48Z" fill="#E0E0E0"/>
    </svg>
);

const SchoolIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#E8EAF6"/>
        <path d="M44 26L32 16L20 26V46C20 48.2091 21.7909 50 24 50H40C42.2091 50 44 48.2091 44 46V26Z" fill="white"/>
        <path d="M32 16V32" stroke="#4A90E2" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="32" cy="39" r="4" fill="#4A90E2"/>
        <path d="M28 50V58L32 54L36 58V50" stroke="white" strokeWidth="3" fill="#FF6B6B"/>
    </svg>
);

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
    icon: <DoctorIcon />,
    href: "/category/neet",
  },
  {
    name: "Engineer",
    icon: <EngineerIcon />,
    href: "/category/iit-jee",
  },
  {
    name: "6-10th",
    icon: <SchoolIcon />,
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
                    <h1 className="text-2xl md:text-3xl font-black text-accent">
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
