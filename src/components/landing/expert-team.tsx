'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { getTeamMembers } from "@/app/actions";
import type { TTeamMember } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamCarousel } from "./team-carousel";

export function ExpertTeam() {
  const { t } = useLanguage();
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
    <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The power of an organisation is its team. We believe that great teams build great organisations.
          </p>
        </div>
        {loading ? (
            <div className="flex flex-col items-center">
                <Skeleton className="h-64 w-full max-w-md rounded-lg" />
                <div className="flex gap-4 mt-8">
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
