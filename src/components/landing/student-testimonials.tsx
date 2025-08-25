
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useLanguage } from "@/context/language-context";
import { Star } from "lucide-react";

const testimonials = [
    {
      name: "Aarav Sharma",
      class: "Class 10 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian student",
      testimonial: "The personalized learning paths have been a game-changer for my exam preparation. I feel much more confident in my abilities now.",
      testimonial_hi: "व्यक्तिगत सीखने के रास्ते मेरी परीक्षा की तैयारी के लिए गेम-चेंजर रहे हैं। अब मुझे अपनी क्षमताओं पर बहुत अधिक विश्वास है।",
    },
    {
      name: "Priya Singh",
      class: "Class 12 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "female student",
      testimonial: "IDL EDUCATION's teachers are incredibly supportive. The two-teacher model ensures that my doubts are always cleared instantly.",
      testimonial_hi: "आईडीएल एजुकेशन के शिक्षक अविश्वसनीय रूप से सहायक हैं। दो-शिक्षक मॉडल यह सुनिश्चित करता है कि मेरी शंकाओं का तुरंत समाधान हो जाए।",
    },
    {
      name: "Rohan Kumar",
      class: "Class 8 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "young student",
      testimonial: "Learning has become so much more fun and interactive with the app. I love the engaging video lessons and quizzes!",
      testimonial_hi: "ऐप के साथ सीखना बहुत अधिक मजेदार और इंटरैक्टिव हो गया है। मुझे आकर्षक वीडियो पाठ और क्विज़ पसंद हैं!",
    },
    {
      name: "Anika Verma",
      class: "Parent",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian parent",
      testimonial: "As a parent, I'm thrilled with the progress my child has made. The platform provides detailed reports that help me track his performance.",
      testimonial_hi: "एक अभिभावक के रूप में, मैं अपने बच्चे की प्रगति से बहुत खुश हूँ। प्लेटफ़ॉर्म विस्तृत रिपोर्ट प्रदान करता है जो मुझे उसके प्रदर्शन को ट्रैक करने में मदद करता है।",
    },
    {
      name: "Meera Iyer",
      class: "Parent",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian mother",
      testimonial: "The platform is fantastic. My daughter's confidence in math has soared since she started using IDL EDUCATION. The teachers are patient and knowledgeable.",
      testimonial_hi: "यह प्लेटफॉर्म शानदार है। जब से मेरी बेटी ने आईडीएल एजुकेशन का उपयोग करना शुरू किया है, तब से उसका गणित में आत्मविश्वास बढ़ गया है। शिक्षक धैर्यवान और जानकार हैं।",
    },
    {
      name: "Karan Malhotra",
      class: "Class 11 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "male student",
      testimonial: "Preparing for competitive exams felt overwhelming, but the structured courses and regular mock tests here have made a huge difference.",
      testimonial_hi: "प्रतियोगी परीक्षाओं की तैयारी भारी लग रही थी, लेकिन यहां के संरचित पाठ्यक्रमों और नियमित मॉक टेस्ट ने बहुत बड़ा अंतर पैदा किया है।",
    },
    {
      name: "Sunita Devi",
      class: "Parent",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian woman",
      testimonial: "The flexibility to learn anytime, anywhere has been perfect for my son's busy schedule. He can now revise lessons on the go.",
      testimonial_hi: "कभी भी, कहीं भी सीखने की सुविधा मेरे बेटे के व्यस्त कार्यक्रम के लिए एकदम सही रही है। वह अब चलते-फिरते पाठों को दोहरा सकता है।",
    },
    {
      name: "Vikram Reddy",
      class: "Class 9 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian boy",
      testimonial: "I used to struggle with Chemistry, but the visual experiments and simple explanations on the app have made it one of my favorite subjects.",
      testimonial_hi: "मैं पहले रसायन विज्ञान में संघर्ष करता था, लेकिन ऐप पर मौजूद दृश्य प्रयोगों और सरल व्याख्याओं ने इसे मेरे पसंदीदा विषयों में से एक बना दिया है।",
    },
    {
      name: "Nisha Gupta",
      class: "Class 7 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "young girl",
      testimonial: "The two-teacher model is the best! I get my questions answered without interrupting the class. It helps me understand concepts better.",
      testimonial_hi: "दो-शिक्षक मॉडल सबसे अच्छा है! मुझे कक्षा को बाधित किए बिना मेरे सवालों के जवाब मिल जाते हैं। यह मुझे अवधारणाओं को बेहतर ढंग से समझने में मदद करता है।",
    },
    {
      name: "Amit Patel",
      class: "Parent",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian father",
      testimonial: "Booking the free session was easy and it gave us a clear idea of the quality of teaching. We enrolled our son immediately after.",
      testimonial_hi: "मुफ्त सत्र बुक करना आसान था और इससे हमें शिक्षण की गुणवत्ता का स्पष्ट पता चल गया। हमने इसके तुरंत बाद अपने बेटे का नामांकन करा दिया।",
    },
    {
      name: "Sneha Reddy",
      class: "Class 10 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "teenage girl",
      testimonial: "The comprehensive study materials and notes are a lifesaver. I don't have to look for resources anywhere else.",
      testimonial_hi: "व्यापक अध्ययन सामग्री और नोट्स जीवन रक्षक हैं। मुझे कहीं और संसाधनों की तलाश करने की आवश्यकता नहीं है।",
    },
    {
      name: "Rajesh Kumar",
      class: "Parent",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "Indian parent",
      testimonial: "I appreciate the regular updates and performance reports. It keeps me involved in my child's academic journey.",
      testimonial_hi: "मैं नियमित अपडेट और प्रदर्शन रिपोर्ट की सराहना करता हूँ। यह मुझे मेरे बच्चे की शैक्षणिक यात्रा में शामिल रखता है।",
    },
    {
      name: "Ishaan Khan",
      class: "Class 8 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "young student",
      testimonial: "The quizzes and leaderboards make learning competitive and fun. I always try to get to the top of the leaderboard!",
      testimonial_hi: "क्विज़ और लीडरबोर्ड सीखने को प्रतिस्पर्धी और मजेदार बनाते हैं। मैं हमेशा लीडरबोर्ड के शीर्ष पर पहुंचने की कोशिश करता हूँ!",
    },
    {
      name: "Anjali Mehta",
      class: "Class 12 Student",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "female student",
      testimonial: "The teachers are not just educators but also mentors. They have guided me in making important career decisions.",
      testimonial_hi: "शिक्षक केवल शिक्षक ही नहीं, बल्कि संरक्षक भी हैं। उन्होंने मुझे महत्वपूर्ण करियर निर्णय लेने में मार्गदर्शन किया है।",
    },
];

export function StudentTestimonials() {
  const { t, language } = useLanguage();

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className="relative w-full max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4 h-full">
                    <Card className="h-full flex flex-col bg-muted shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex-1 flex flex-col justify-between text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="w-24 h-24 border-4 border-primary/20">
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint}/>
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="mb-4">
                            <p className="font-bold text-lg">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                            <div className="flex justify-center mt-2">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                            </div>
                        </div>
                        <blockquote className="text-base italic text-foreground/80 before:content-['“'] after:content-['”']">
                          {language === 'hi' ? testimonial.testimonial_hi : testimonial.testimonial}
                        </blockquote>
                      </CardContent>
                    </Card>
                  </div>
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
