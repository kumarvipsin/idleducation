
'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 1000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const isMobile = useIsMobile();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedVideo(null);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8" style={{ maxWidth: '80%' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-black dark:text-white">Topper's</span> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">Testimonials</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover how our top students achieved their goals. Watch their success stories and get inspired.
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {youtubeChannels.map((channel, index) => (
                <CarouselItem key={`${channel.studentName}-${index}`} className="basis-full sm:basis-1/2 lg:basis-1/4">
                   <ChannelCard channel={channel} onCardClick={() => setSelectedVideo(channel.videoId)} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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
