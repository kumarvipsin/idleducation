
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Briefcase } from "lucide-react";

export function ExpertTeam() {
  const { t } = useLanguage();

  const teamMembers = [
    {
        name: t('team.member1.name'),
        designation: t('team.member1.designation'),
        experience: t('team.member1.experience'),
        avatar: "/amod.jpg",
        avatarHint: "Amod Sharma"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "/manish.jpg",
        avatarHint: "Manish Sharma"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto-format=fit=crop&ixlib.rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "male professional"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "/xyz.png",
        avatarHint: "female scientist"
    },
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto-format=fit=crop&ixlib.rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "young professional"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://images.unsplash.com/flagged/photo-1559475555-b26777ed3ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxtYWxlJTIwdGVhY2hlcnxlbnwwfHx8fDE3NTYyMDAyODl8MA&ixlib.rb-4.1.0&q=80&w=1080",
        avatarHint: "male teacher"
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('team.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group relative flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20"></div>
                <div className="absolute top-20 w-32 h-32">
                    <Image
                        src={member.avatar}
                        alt={member.name}
                        data-ai-hint={member.avatarHint}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover rounded-full border-4 border-background shadow-md transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <CardContent className="p-6 pt-20 flex-1 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-card-foreground">{member.name}</h3>
                    <p className="text-base text-primary font-semibold">{member.designation}</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{member.experience}</span>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </section>
  );
}
