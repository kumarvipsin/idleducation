'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { TTeamMember } from '@/app/actions/types';
import { TeacherCard } from './teacher-card';

export const TeamCarousel = ({ members }: { members: TTeamMember[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 5000, stopOnInteraction: true }),
    ]);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    if (!members || members.length === 0) {
        return null;
    }

    return (
        <div className="relative px-12 group">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {members.map((member) => (
                        <div key={member.id} className="pl-4 flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                             <TeacherCard
                                name={member.name}
                                designation={member.designation}
                                experience={member.experience}
                                biography={member.biography}
                                avatar={member.avatarUrl}
                                avatarHint={`${member.name} photo`}
                                socialLinks={member.socialLinks}
                            />
                        </div>
                    ))}
                </div>
            </div>
             <div className="absolute top-1/2 -translate-y-1/2 left-0 hidden md:block">
                <Button variant="ghost" size="icon" onClick={scrollPrev} className="rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>
             <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden md:block">
                <Button variant="ghost" size="icon" onClick={scrollNext} className="rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white">
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
