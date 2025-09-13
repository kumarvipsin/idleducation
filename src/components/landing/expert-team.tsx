
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Briefcase, Facebook, Twitter, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
        avatarHint: "Chandra Prakesh"
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
        avatarHint: "male teacher"
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            The power of an organisation is its team. We believe that great teams build great organisations. In IDL EDUCATION we have a great team who makes our achievements possible with there loyal efforts and continuous hard work.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-background"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="h-24 bg-primary/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 h-32">
                    <Image
                        src={member.avatar}
                        alt={member.name}
                        data-ai-hint={member.avatarHint}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover rounded-full border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                <CardContent className="p-6 pt-20 flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-foreground">{member.name}</h3>
                    <p className="text-sm font-semibold text-primary mt-1">{member.designation}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        {member.experience}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5"/></Link>
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5"/></Link>
                       <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5"/></Link>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </section>
  );
}
