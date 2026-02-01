
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const foundationTestimonials = [
  {
    name: "Priya Sharma",
    role: "Volunteer",
    quote: "Volunteering at IDL Foundation has been an incredibly rewarding experience. Seeing the direct impact of our work on the community is truly inspiring.",
    avatar: "https://picsum.photos/seed/priya/200/200",
    avatarHint: "woman smiling"
  },
  {
    name: "Rajesh Kumar",
    role: "Donator",
    quote: "I'm proud to support a foundation that is so transparent and dedicated. They are making a real difference in the lives of many.",
    avatar: "https://picsum.photos/seed/rajesh/200/200",
    avatarHint: "man professional"
  },
  {
    name: "Anita Desai",
    role: "Beneficiary",
    quote: "The skill training program by IDL Foundation helped me get a job and support my family. I am forever grateful for this opportunity.",
    avatar: "https://picsum.photos/seed/anita/200/200",
    avatarHint: "woman happy"
  },
  {
    name: "Vikram Singh",
    role: "Corporate Partner",
    quote: "Partnering with IDL Foundation has been a fulfilling part of our CSR initiatives. Their professionalism and impact are commendable.",
    avatar: "https://picsum.photos/seed/vikram/200/200",
    avatarHint: "man suit"
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: typeof foundationTestimonials[0] }) => (
    <Card className="h-full flex flex-col p-6 bg-card shadow-lg rounded-xl">
        <blockquote className="text-muted-foreground italic flex-grow">"{testimonial.quote}"</blockquote>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <Avatar>
                <Image src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} width={40} height={40} className="rounded-full" />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
        </div>
    </Card>
);

export function FoundationTestimonials() {
  return (
    <section id="testimonials" className="w-full py-16 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">What People Are <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Saying</span></h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Hear from our volunteers, donors, and beneficiaries.
            </p>
        </div>
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 5000,
                    stopOnInteraction: true,
                }),
            ]}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {foundationTestimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
