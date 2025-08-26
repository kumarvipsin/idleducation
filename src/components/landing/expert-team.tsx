
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
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "female teacher"
    },
    {
        name: t('team.member2.name'),
        designation: t('team.member2.designation'),
        experience: t('team.member2.experience'),
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "male teacher"
    },
    {
        name: t('team.member3.name'),
        designation: t('team.member3.designation'),
        experience: t('team.member3.experience'),
        avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "male professional"
    },
    {
        name: t('team.member4.name'),
        designation: t('team.member4.designation'),
        experience: t('team.member4.experience'),
        avatar: "https://images.unsplash.com/flagged/photo-1559475555-b26777ed3ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8dGVhY2hlcnMlMjB8ZW58MHx8fHwxNzU2MDk5NTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: "female scientist"
    },
    {
        name: t('team.member5.name'),
        designation: t('team.member5.designation'),
        experience: t('team.member5.experience'),
        avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "young professional"
    },
    {
        name: t('team.member6.name'),
        designation: t('team.member6.designation'),
        experience: t('team.member6.experience'),
        avatar: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
        avatarHint: "team working"
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-muted">
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
                className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300 group overflow-hidden border-transparent hover:border-primary/20"
                style={{ backgroundColor: '#191970' }}
              >
                <CardContent className="p-6 flex-1 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                        <Image
                            src={member.avatar}
                            alt={member.name}
                            data-ai-hint={member.avatarHint}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover rounded-full border-4 border-primary/10 transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-base text-gray-300">{member.designation}</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-200">
                        <Briefcase className="w-4 h-4 text-gray-300" />
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
