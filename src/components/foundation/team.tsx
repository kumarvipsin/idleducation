'use client';

import { useState, useEffect } from 'react';
import { getTeamMembers } from '@/app/actions';
import { TeamCarousel } from '@/components/landing/team-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { TTeamMember } from '@/app/actions/types';

export function Team() {
    const [teamMembers, setTeamMembers] = useState<TTeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            const result = await getTeamMembers();
            if (result.success && result.data) {
                setTeamMembers(result.data as TTeamMember[]);
            }
            setLoading(false);
        };
        fetchTeam();
    }, []);

    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The dedicated individuals leading our mission forward.
                    </p>
                </div>
                {loading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-48 w-full max-w-xl mx-auto rounded-xl" />
                        <div className="flex justify-center gap-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-20 rounded-full" />)}
                        </div>
                    </div>
                ) : (
                    <TeamCarousel members={teamMembers} />
                )}
            </div>
        </section>
    );
}
