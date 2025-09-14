
'use client';

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
    {
      name: "Priya Sharma",
      achievement: "Class 10 Topper | CBSE",
      avatar: "https://picsum.photos/seed/student1/100/100",
      avatarHint: "female student",
      testimonial: "IDL EDUCATION's structured approach and regular tests were a game-changer for my Class 10 boards. The teachers are incredibly supportive, and the platform made learning complex topics so much easier. I'm grateful for their guidance!",
      testimonial_hi: "आईडीएल एजुकेशन का संरचित दृष्टिकोण और नियमित परीक्षण मेरे कक्षा 10 बोर्ड के लिए गेम-चेंजर थे। शिक्षक अविश्वसनीय रूप से सहायक हैं, और मंच ने जटिल विषयों को सीखना बहुत आसान बना दिया। मैं उनके मार्गदर्शन के लिए आभारी हूं!",
    },
    {
      name: "Rohan Verma",
      achievement: "Scored 96% in Science | CBSE Class 12",
      avatar: "https://picsum.photos/seed/student2/100/100",
      avatarHint: "male student",
      testimonial: "Amod Sharma Sir's teaching method for Physics and Chemistry is phenomenal. He breaks down the most difficult concepts into simple, understandable parts. Thanks to him, I scored 96% in Science in my Class 12 exams!",
      testimonial_hi: "भौतिकी और रसायन विज्ञान के लिए अमोद शर्मा सर की शिक्षण पद्धति अभूतपूर्व है। वह सबसे कठिन अवधारणाओं को सरल, समझने योग्य भागों में तोड़ देते हैं। उनकी बदौलत, मैंने अपनी कक्षा 12 की परीक्षा में विज्ञान में 96% अंक प्राप्त किए!",
    },
    {
      name: "Aisha Khan",
      achievement: "Scored 98 in Maths | CBSE Class 10",
      avatar: "https://picsum.photos/seed/student3/100/100",
      avatarHint: "female professional",
      testimonial: "I used to struggle with Mathematics, but Amod Sharma Sir's classes at IDL EDUCATION made all the difference. His patient and clear explanations helped me score 98 in my Class 10 board exams. Highly recommended!",
      testimonial_hi: "मैं गणित के साथ संघर्ष करती थी, लेकिन आईडीएल एजुकेशन में अमोद शर्मा सर की कक्षाओं ने सब कुछ बदल दिया। उनके धैर्यपूर्ण और स्पष्ट स्पष्टीकरण ने मुझे अपनी कक्षा 10 की बोर्ड परीक्षा में 98 अंक प्राप्त करने में मदद की। अत्यधिक अनुशंसित!",
    },
    {
      name: "Arjun Singh",
      achievement: "Commerce Topper | CBSE Class 12",
      avatar: "https://picsum.photos/seed/student4/100/100",
      avatarHint: "male teacher",
      testimonial: "The two-teacher model at IDL EDUCATION is fantastic for clearing doubts instantly. The study materials provided were comprehensive and helped me excel in my Class 12 Commerce exams. The platform is truly dedicated to student success.",
      testimonial_hi: "आईडीएल एजुकेशन में दो-शिक्षक मॉडल संदेहों को तुरंत दूर करने के लिए शानदार है। प्रदान की गई अध्ययन सामग्री व्यापक थी और इसने मुझे अपनी कक्षा 12 की वाणिज्य परीक्षाओं में उत्कृष्टता प्राप्त करने में मदद की। यह मंच वास्तव में छात्र की सफलता के लिए समर्पित है।",
    },
];

const QuoteIcon = () => (
    <div className="absolute top-0 left-0 text-[8rem] leading-none font-bold text-primary/10 dark:text-primary/20 opacity-50 z-0">
        “
    </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: (typeof testimonials)[0] }) => {
  const { language } = useLanguage();
  const fullText = language === 'hi' ? testimonial.testimonial_hi : testimonial.testimonial;

  return (
    <div className="p-2 h-full">
      <Card
        className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-foreground"
      >
        <CardContent className="p-6 flex-1 flex flex-col relative">
          <QuoteIcon />
          <div className="relative z-10 flex-1 flex flex-col">
            <ScrollArea className="h-32 flex-grow mb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <blockquote className="text-sm text-foreground/80 pr-4 mt-8">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export function StudentTestimonials() {
  const { t } = useLanguage();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6" style={{ maxWidth: '79%' }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">What Our </span>
            <span className="text-gray-300">Students Say</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className="relative w-full mx-auto" style={{ animationDelay: '0.2s' }}>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
