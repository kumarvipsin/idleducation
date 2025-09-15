
'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const youtubeChannels = [
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "ANJALI VERMA",
    studentClass: "CLASS 12",
    studentPlace: "DELHI"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "ROHAN SHARMA",
    studentClass: "JEE ASPIRANT",
    studentPlace: "DELHI"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "PRIYA SINGH",
    studentClass: "NEET ASPIRANT",
    studentPlace: "DELHI"
  },
   {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "VIKRAM RATHORE",
    studentClass: "CLASS 10",
    studentPlace: "DELHI"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "SNEHA GUPTA",
    studentClass: "CLASS 11",
    studentPlace: "DELHI"
  },
  {
    name: "IDL EDUCATION",
    href: "https://www.youtube.com/@idleducation",
    videoId: "_t-tMW2-m5c",
    gradient: "from-amber-100 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10",
    iconColor: "text-red-600",
    studentName: "ARJUN MEHTA",
    studentClass: "SSC ASPIRANT",
    studentPlace: "DELHI"
  },
];

const toppers1 = [
  { img: "https://picsum.photos/seed/topper1/600/400", hint: "student success story" },
  { img: "https://picsum.photos/seed/topper2/600/400", hint: "student achievement" },
  { img: "https://picsum.photos/seed/topper3/600/400", hint: "exam success" },
  { img: "https://picsum.photos/seed/topper4/600/400", hint: "student journey" },
  { img: "https://picsum.photos/seed/topper5/600/400", hint: "academic excellence" },
  { img: "https://picsum.photos/seed/topper6/600/400", hint: "student testimonial" },
  { img: "https://picsum.photos/seed/topper7/600/400", hint: "education success" },
  { img: "https://picsum.photos/seed/topper8/600/400", hint: "student interview" },
];

const toppers2 = [...toppers1].reverse(); // Create a reversed version for the opposite direction

const toppers3 = [
  { img: "https://picsum.photos/seed/topper9/600/400", hint: "learning environment" },
  { img: "https://picsum.photos/seed/topper10/600/400", hint: "classroom success" },
  { img: "https://picsum.photos/seed/topper11/600/400", hint: "top student" },
  { img: "https://picsum.photos/seed/topper12/600/400", hint: "study group" },
  { img: "https://picsum.photos/seed/topper13/600/400", hint: "proud student" },
  { img: "https://picsum.photos/seed/topper14/600/400", hint: "achiever" },
  { img: "https://picsum.photos/seed/topper15/600/400", hint: "graduation day" },
  { img: "https://picsum.photos/seed/topper16/600/400", hint: "exam preparation" },
];

const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M21.582,6.186 c-0.23-0.854-0.908-1.532-1.762-1.762C18.258,4,12,4,12,4S5.742,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.742,2,12,2,12s0,4.258,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.742,20,12,20,12,20s6.258,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.258,22,12,22,12S22,7.742,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
    </svg>
);

const svgTexture = `
  <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
    <g fill='rgba(217,119,6,0.1)' fill-rule='evenodd'>
      <g fill='#c09533' fill-opacity='0.1' fill-rule='nonzero'>
        <path d='M20 20v40h40V20H20zM0 0v80h80V0H0z' />
      </g>
    </g>
  </svg>
`;

const textureStyle = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
  backgroundSize: '20px 20px',
};

const shineStyle = {
  backgroundImage: 'radial-gradient(circle at 50% 10%, #fffde4, #f4d03f, #d4af37, #b8860b)',
}


const ChannelCard = ({ channel, onCardClick }: { channel: (typeof youtubeChannels)[0], onCardClick: () => void }) => (
    <DialogTrigger asChild>
        <button onClick={onCardClick} className="group shrink-0 focus:outline-none p-2">
            <Card className={`overflow-hidden shadow-lg w-64 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0.5`} style={shineStyle}>
                <div 
                  className="bg-background/80 backdrop-blur-sm rounded-[.45rem] h-full p-2 text-center flex flex-col items-center justify-center gap-2"
                  style={textureStyle}
                >
                    <div className="relative">
                        <YoutubeIcon className={`w-12 h-12 ${channel.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                    <h3 className="font-bold text-sm">{channel.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1">
                        <p className="font-semibold text-foreground">{channel.studentName}</p>
                        <p>{channel.studentClass} | {channel.studentPlace}</p>
                    </div>
                </div>
            </Card>
        </button>
    </DialogTrigger>
);


export function ToppersTestimonials() {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedVideo(null);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <section className="w-full py-12 md:py-16 bg-[#27408b] text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-[10%]">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative z-10 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold">IDL Stars</h2>
              <p className="mt-4 text-lg text-white/80">Uncover the Journey to Rise and Shine</p>
              <DialogTrigger asChild>
                <Button variant="secondary" className="mt-6 bg-white text-primary hover:bg-white/90">Watch Videos</Button>
              </DialogTrigger>
            </div>
            <div className="relative h-[216px] lg:h-[288px] overflow-hidden">
                <div className="absolute inset-0 flex flex-col gap-4">
                    <div className="flex animate-marquee-slow">
                        {[...toppers1, ...toppers1].map((topper, index) => (
                            <div key={index} className="aspect-[4/3] p-2 w-48 shrink-0">
                                <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
                                    <Image src={topper.img} alt={`Topper ${index + 1}`} data-ai-hint={topper.hint} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-primary/30"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex animate-marquee-slow-reverse">
                         {[...toppers2, ...toppers2].map((topper, index) => (
                            <div key={index} className="aspect-[4/3] p-2 w-48 shrink-0">
                                <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
                                    <Image src={topper.img} alt={`Topper ${index + 1}`} data-ai-hint={topper.hint} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-primary/30"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex animate-marquee-slow">
                         {[...toppers3, ...toppers3].map((topper, index) => (
                            <div key={index} className="aspect-[4/3] p-2 w-48 shrink-0">
                                <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
                                    <Image src={topper.img} alt={`Topper ${index + 1}`} data-ai-hint={topper.hint} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-primary/30"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#27408b]/50 to-[#27408b]"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-[10%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-black dark:text-white">Topper's</span> <span style={{ color: '#ced4da' }}>Testimonials</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover how our top students achieved their goals. Watch their success stories and get inspired.
            </p>
          </div>
          
          <div className="relative w-full overflow-hidden">
            <div className="flex marquee-container">
              {[...youtubeChannels, ...youtubeChannels].map((channel, index) => (
                <ChannelCard key={`${channel.studentName}-${index}`} channel={channel} onCardClick={() => setSelectedVideo(channel.videoId)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedVideo && (
        <DialogContent className="sm:max-w-3xl h-[60vh] bg-background/80 backdrop-blur-lg border-primary/20 text-white rounded-2xl p-2">
            <DialogHeader>
              <DialogTitle className="sr-only">Topper Testimonial Video</DialogTitle>
            </DialogHeader>
            <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </DialogContent>
      )}
    </Dialog>
  );
}
