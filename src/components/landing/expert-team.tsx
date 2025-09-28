
'use client';

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { TeacherCard } from "./teacher-card";
import { getTeachers } from "@/app/actions/user";
import type { UserProfile } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

interface Teacher extends UserProfile {
    designation?: string;
    experience?: string;
    biography?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export function ExpertTeam() {
  const { t } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      const result = await getTeachers();
      if (result.success && result.data) {
        setTeamMembers(result.data as Teacher[]);
      }
      setLoading(false);
    };
    fetchTeam();
  }, []);

  return (
    <section className="w-full py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The power of an organisation is its team. We believe that great teams build great organisations.
          </p>
        </div>
        {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-lg" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <TeacherCard 
                    key={member.id} 
                    name={member.name || ''}
                    designation={member.designation || 'Teacher'}
                    experience={member.experience || 'Experienced'}
                    biography={member.biography}
                    avatar={member.photoURL || ''}
                    avatarHint={`${member.name} photo`}
                    socialLinks={member.socialLinks}
                  />
                ))}
            </div>
        )}
      </div>
    </section>
  );
}
