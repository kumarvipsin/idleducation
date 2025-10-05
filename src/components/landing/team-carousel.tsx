'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GcsImage } from '@/components/gcs-image';
import { Facebook, Instagram, Twitter, ArrowLeft, ArrowRight } from 'lucide-react';
import { TTeamMember } from '@/app/actions/types';
import { cn } from '@/lib/utils';

const TeamMemberCard = ({ member }: { member: TTeamMember }) => (
    <Card className="max-w-xl mx-auto bg-white dark:bg-card shadow-xl rounded-2xl border-primary/10 overflow-hidden">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                     <GcsImage
                        filePath={member.avatarUrl}
                        alt={member.name}
                        fill
                        className="rounded-lg object-cover shadow-md"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{member.designation}</p>
                    {member.socialLinks && (
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                            {member.socialLinks.instagram && <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="w-4 h-4 text-muted-foreground hover:text-primary" /></a>}
                            {member.socialLinks.twitter && <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" /></a>}
                            {member.socialLinks.facebook && <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-4 h-4 text-muted-foreground hover:text-primary" /></a>}
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-4 text-justify">
                        {member.biography || 'A dedicated member of our expert team, committed to student success.'}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const TeamCarousel = ({ members }: { members: TTeamMember[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="space-y-8">
            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {members.map((member) => (
                            <div key={member.id} className="flex-shrink-0 flex-grow-0 basis-full min-w-0">
                                <TeamMemberCard member={member} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative flex items-center justify-center gap-4 px-12">
                 <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300 dark:bg-gray-700 -z-10" />
                {members.map((member, index) => (
                    <button key={member.id} onClick={() => scrollTo(index)} className="relative shrink-0">
                        <div className={cn(
                            "w-20 h-20 rounded-full overflow-hidden transition-all duration-300 grayscale hover:grayscale-0",
                             selectedIndex === index ? 'scale-125 grayscale-0 border-4 border-primary' : 'scale-90 opacity-60'
                        )}>
                            <GcsImage
                                filePath={member.avatarUrl}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </button>
                ))}
            </div>
             <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
