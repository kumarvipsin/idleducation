
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
    {
      name: "Anmol Rathore",
      achievement: "UPSC CSE 2023 AIR 7 | UPSC",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto-format=fit-crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      avatarHint: "woman professional",
      testimonial: "I used to regularly follow the youtube videos, prelims booster videos and specially editorial discussion from where I made important pointers. I also watched some history videos like Buddhism, Jainism as the topics were explained very clearly... all these were very...",
      testimonial_hi: "मैं नियमित रूप से यूट्यूब वीडियो, प्रीलिम्स बूस्टर वीडियो और विशेष रूप से संपादकीय चर्चा का पालन करता था, जहां से मैंने महत्वपूर्ण बिंदु बनाए। मैंने बौद्ध धर्म, जैन धर्म जैसे कुछ इतिहास वीडियो भी देखे क्योंकि विषयों को बहुत स्पष्ट रूप से समझाया गया था... ये सभी बहुत...",
    },
    {
      name: "Raja Majhi",
      achievement: "GATE 2024 AIR 1 | GATE",
      avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto-format=fit-crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      avatarHint: "male professional",
      testimonial: "I am Kaja Majhi, and I am thrilled to share that I have secured All India Rank 1 (AIR 1) in the GATE 2024 examination in ECE. From the very beginning, Physics Wallah stood out for its structured and comprehensive curriculum. The faculty members, with their in-depth knowledge and teaching expertise, ensured...",
      testimonial_hi: "मैं काजा माझी हूं, और मुझे यह साझा करते हुए बहुत खुशी हो रही है कि मैंने ईसीई में गेट 2024 परीक्षा में अखिल भारतीय रैंक 1 (एआईआर 1) हासिल की है। शुरू से ही, फिजिक्स वाला अपने संरचित और व्यापक पाठ्यक्रम के लिए सबसे अलग रहा। संकाय सदस्यों ने अपने गहन ज्ञान और शिक्षण विशेषज्ञता के साथ सुनिश्चित किया...",
    },
    {
      name: "Amit Kumar Mandal",
      achievement: "IBPS Topper | Banking",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto-format=fit-crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      avatarHint: "male teacher",
      testimonial: "PW helped me in establishing the basics of every subject through which I was able to progress quickly and was also able to increase my speed and also maintaining accuracy.",
      testimonial_hi: "पीडब्ल्यू ने मुझे हर विषय की मूल बातें स्थापित करने में मदद की, जिसके माध्यम से मैं तेजी से प्रगति करने में सक्षम था और अपनी गति बढ़ाने के साथ-साथ सटीकता बनाए रखने में भी सक्षम था।",
    },
    {
      name: "Priya Singh",
      achievement: "Class 12 Topper | CBSE",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto-format=fit-crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      avatarHint: "female student",
      testimonial: "IDL EDUCATION's teachers are incredibly supportive. The two-teacher model ensures that my doubts are always cleared instantly.",
      testimonial_hi: "आईडीएल एजुकेशन के शिक्षक अविश्वसनीय रूप से सहायक हैं। दो-शिक्षक मॉडल यह सुनिश्चित करता है कि मेरी शंकाओं का तुरंत समाधान हो जाए।",
    },
];

const QuoteIcon = () => (
    <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-6 left-6 text-gray-100 dark:text-gray-700">
        <path d="M18.8819 0.333344H0.256836V22.5H12.0318V35.6667H25.1985V16.0417L18.8819 0.333344Z" fill="currentColor"/>
        <path d="M46.7432 0.333344H28.1182V22.5H39.8932V35.6667H53.0598V16.0417L46.7432 0.333344Z" fill="currentColor"/>
    </svg>
);

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' ? testimonial.testimonial_hi : testimonial.testimonial;

  return (
    <div className="p-2 h-full">
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-foreground relative overflow-hidden"
      >
        <QuoteIcon />
        <CardContent className="p-6 pt-16 flex-1 flex flex-col">
          <ScrollArea className="h-24 flex-grow mb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <blockquote className="text-sm text-foreground/80 pr-4">
              {fullText}
            </blockquote>
          </ScrollArea>

          <div className="flex items-center gap-4 mt-auto">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
              <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-base">{testimonial.name}</p>
              <p className="text-xs text-primary font-semibold">{testimonial.achievement}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function StudentTestimonials() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: isMobile ? 1000 : 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="w-full py-12 md:py-24 bg-muted/40">
      <div className={`container mx-auto px-4 md:px-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">What Our </span>
            <span style={{ color: '#adb5bd' }}>Students Say</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className={`relative w-full max-w-5xl mx-auto ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '0.2s' }}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex md:left-[-2rem]" />
            <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 hidden md:inline-flex md:right-[-2rem]" />
             <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 md:hidden">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
