'use client';

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, PlayCircle } from "lucide-react";

const EventVideo = ({ videoId, title }: { videoId: string, title: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="relative w-full aspect-video group cursor-pointer focus:outline-none">
                    <Image
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={title}
                        fill
                        className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-16 h-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <DialogHeader className="p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export function Events() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="text-center mb-8 px-4 md:px-6">
                <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Events & Highlights</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Watch highlights from our recent events and see the impact we're making together.
                </p>
            </div>
            <div className="relative">
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 pl-[10%]">
                        <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                            <EventVideo videoId="MILdOtfez8U" title="IDL Foundation Event Highlights" />
                        </div>
                        <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                            <EventVideo videoId="MILdOtfez8U" title="Community Skill Training Workshop" />
                        </div>
                        <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                            <EventVideo videoId="MILdOtfez8U" title="Annual Charity Gala" />
                        </div>
                        <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                            <EventVideo videoId="MILdOtfez8U" title="Tree Plantation Drive" />
                        </div>
                        <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                            <EventVideo videoId="MILdOtfez8U" title="Women Empowerment Seminar" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
