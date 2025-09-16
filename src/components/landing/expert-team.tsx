
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Facebook, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { TeacherCardV2 } from "./teacher-card-v2";

export function ExpertTeam() {
  const { t } = useLanguage();

  const teamMembers = [
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "/vijay.jpg",
        avatarHint: "Vijay Verma"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "/manish.jpg",
        avatarHint: "Manish Sharma"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "/vidhi.jpg",
        avatarHint: "Vidhi Sharma"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "/chandu.jpg",
        avatarHint: "Chandra Prakash"
    },
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "/amod.jpg",
        avatarHint: "Amod Sharma"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "/vikash.jpg",
        avatarHint: "Vikas Kumar"
    },
    {
        name: "Nikhil Sharma",
        designation: "Marketing Head",
        experience: "7+ Years of Experience",
        avatar: "https://picsum.photos/seed/nikhil/400/500",
        avatarHint: "male professional"
    },
    {
        name: "Nishu Sharma",
        designation: "Operations Head",
        experience: "6+ Years of Experience",
        avatar: "https://picsum.photos/seed/nishu/400/500",
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
              <TeacherCardV2 key={index} {...member} />
            ))}
          </div>
      </div>
    </section>
  );
}
