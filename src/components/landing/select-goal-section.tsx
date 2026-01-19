
'use client';

import Link from "next/link";
import React from 'react';
import Image from "next/image";

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
    name: "Govt. Exams",
    icon: <Image src="/others.png" alt="Government Exams" width={64} height={64} />,
    href: "/examcat",
  },
  {
    name: "CBSE",
    icon: <Image src="/shuttle.png" alt="School Prep" width={64} height={64} />,
    href: "/school",
  },
];

export function SelectGoalSection() {
    return (
        <section className="w-full py-6 md:py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-accent">
                        Start Your Journey
                    </h2>
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
