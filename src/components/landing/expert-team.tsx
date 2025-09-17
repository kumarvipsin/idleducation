
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { TeacherCard } from "./teacher-card";

export function ExpertTeam() {
  const { t } = useLanguage();

  const teamMembers = [
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "https://picsum.photos/seed/Economics-Teacher/400/500",
        avatarHint: "male professional"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "https://picsum.photos/seed/Math-Teacher/400/500",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "https://picsum.photos/seed/Social-Studies-Teacher/400/500",
        avatarHint: "female teacher"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "https://picsum.photos/seed/Mathematics-Teacher/400/500",
        avatarHint: "male professional"
    },
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "https://picsum.photos/seed/Biology-Teacher/400/500",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://picsum.photos/seed/Accounts-Teacher/400/500",
        avatarHint: "male teacher"
    },
    {
        name: "Nikhil Sharma",
        designation: "Marketing Head",
        experience: "7+ Years of Experience",
        avatar: "https://picsum.photos/seed/Marketing-Head/400/500",
        avatarHint: "male professional"
    },
    {
        name: "Nishu Sharma",
        designation: "Operations Head",
        experience: "6+ Years of Experience",
        avatar: "https://picsum.photos/seed/Operations-Head/400/500",
        avatarHint: "female professional"
    }
  ];

  return (
    <section className="w-full py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The power of an organisation is its team. We believe that great teams build great organisations.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeacherCard key={index} {...member} />
            ))}
          </div>
      </div>
    </section>
  );
}
