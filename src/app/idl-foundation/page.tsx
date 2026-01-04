
'use client';

import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";
import { DonationCategories } from "@/components/foundation/donation-categories";
import { Stats } from "@/components/foundation/stats";
import { Donors } from "@/components/foundation/donors";
import { Glimpses } from "@/components/foundation/glimpses";
import { Events } from "@/components/foundation/events";
import { About } from "@/components/foundation/about";
import { Team } from "@/components/foundation/team";
import { FoundationFooter } from "@/components/foundation/footer";
import { useState } from "react";
import { FoundationContactForm } from "@/components/foundation/contact-form";
import { FAQ } from "@/components/foundation/faq";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const donationCategories = [
    { title: "Skill Trainings", description: "Empower individuals with valuable skills for a better future.", imageUrl: "https://picsum.photos/seed/training/600/400", imageHint: "team training", goal: 100000, raised: 1500 },
    { title: "Street & Slum Children Education", description: "Light up a child's future with the gift of education.", imageUrl: "https://picsum.photos/seed/slum/600/400", imageHint: "children studying", goal: 100000, raised: 2200 },
    { title: "Environment / Tree Plantation", description: "Help us nurture a greener and healthier planet.", imageUrl: "https://picsum.photos/seed/tree/600/400", imageHint: "planting tree", goal: 100000, raised: 1800 },
    { title: "Women Empowerment", description: "Support initiatives that uplift and empower women.", imageUrl: "https://picsum.photos/seed/women/600/400", imageHint: "women group", goal: 100000, raised: 2800 },
    { title: "Medical Assistance", description: "Provide critical healthcare to those who can't afford it.", imageUrl: "https://picsum.photos/seed/medical/600/400", imageHint: "doctor patient", goal: 100000, raised: 1200 },
    { title: "Senior Citizen/Old Age Home", description: "Ensure our elders live with dignity and care.", imageUrl: "https://picsum.photos/seed/elderly/600/400", imageHint: "elderly people", goal: 100000, raised: 2500 },
];

export default function IDLFoundationPage() {
    const [isDonateOpen, setIsDonateOpen] = useState(false);

    return (
        <div className="relative w-full bg-blue-950 dark:bg-gray-900 overflow-y-auto">
            <Header />
            <FoundationHero slides={donationCategories} />
            <DonationCategories 
                donationCategories={donationCategories} 
                openDonateDialog={() => setIsDonateOpen(true)} 
                isDonateDialogOpen={isDonateOpen}
                onDonateDialogChange={setIsDonateOpen}
            />
            <Stats />
            <Donors />
            <Glimpses />
            <Events />
            <About />
            <Team />
            <FAQ />
            <FoundationContactForm />
            <FoundationFooter openDonateDialog={() => setIsDonateOpen(true)} />
        </div>
    );
}
