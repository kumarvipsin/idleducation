
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const featureData: { [key: string]: any } = {
  "expert-faculty": {
    title: "100+ Expert Faculty",
    imageUrl: "https://img.freepik.com/premium-vector/happy-school-staff-portrait-diverse-group-teachers-smiling-together_1323048-59433.jpg",
    imageHint: "teacher classroom",
    content: "Our faculty comprises highly qualified and experienced educators from top institutions. They are not just teachers but mentors who are dedicated to nurturing students' potential and guiding them toward academic excellence. With a deep understanding of their subjects and a passion for teaching, our instructors provide personalized attention and create an engaging learning environment that fosters curiosity and critical thinking.",
  },
  "quality-education": {
    title: "100% Quality Education",
    imageUrl: "https://www.jirs.ac.in/uploads/blog/7a76ecbb7e5d2a599c5e90471d0d7790.jpg",
    imageHint: "teacher student",
    content: "We are committed to delivering the highest quality education through interactive and engaging classes. Our teaching methodology is designed to make learning enjoyable and effective. We utilize modern teaching aids, real-world examples, and a hands-on approach to ensure that students not only understand the concepts but can also apply them in practical scenarios, preparing them for future challenges.",
  },
  "complete-syllabus": {
    title: "100% Complete Syllabus",
    imageUrl: "https://picsum.photos/seed/syllabus/1200/600",
    imageHint: "books pencils",
    content: "Our curriculum ensures thorough coverage of all subjects and topics as per the latest academic syllabus. We meticulously plan our lessons to cover every aspect of the curriculum, leaving no stone unturned. Regular assessments and revision sessions are conducted to reinforce learning and ensure that students are well-prepared for their examinations, giving them the confidence to excel.",
  },
  "two-teacher-model": {
    title: "Unique Two-Teacher Model",
    imageUrl: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0ZWFjaGVycyUyMGdydXAlMjBtZW58ZW58MHx8fHwxNzU5MjkzODYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "teachers collaborating",
    content: "Our innovative two-teacher model ensures that every student gets the attention they need. One teacher leads the class, explaining concepts, while the second teacher is dedicated to instantly clearing any doubts that arise. This dual-teacher approach creates a seamless and interactive learning environment where students can ask questions without hesitation and receive immediate clarification, leading to a deeper understanding of the subject matter.",
  },
  "all-in-one-learning": {
    title: "All-in-One Learning, Anytime, Anywhere.",
    imageUrl: "https://images.unsplash.com/photo-1592188657297-c6473609e988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzdHVkZW50fGVufDB8fHx8MTc1OTI3NjQ3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "student laptop",
    content: "Our platform is a one-stop solution for all your learning needs. With access to a vast library of study materials, including tests, sample papers, and comprehensive notes, you can learn at your own pace, anytime, and anywhere. Our user-friendly interface and mobile compatibility make it easy for you to stay on top of your studies, whether you are at home or on the go.",
  },
};

export default function FeatureDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const feature = featureData[slug];

  if (!feature) {
    notFound();
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F5F5F7] dark:bg-gray-900 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6 text-primary" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
        <div className="w-full">
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up">
            <div className="relative w-full h-64">
                <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    data-ai-hint={feature.imageHint}
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center p-4">
                        {feature.title}
                     </h1>
                 </div>
            </div>
            <CardContent className="p-6 md:p-10">
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed text-justify">
                {feature.content}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
