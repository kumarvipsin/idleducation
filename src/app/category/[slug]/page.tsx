
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronDown, MessageCircle, Tag, Target, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";

const categoryData: { [key: string]: any } = {
  "neet": { 
      name: "NEET", 
      description: "Prepare for the National Eligibility cum Entrance Test with our comprehensive courses.",
      courses: [
        { title: "NEET Crash Course 2025", description: "An intensive program to cover the entire syllabus quickly." },
        { title: "NEET for Class 11", description: "Build a strong foundation for your medical entrance exams." },
        { title: "NEET for Class 12", description: "Advanced topics and extensive mock tests to ace the exam." },
      ]
  },
  "iit-jee": { 
      name: "IIT JEE", 
      description: "Your gateway to the top engineering colleges in India. Master the concepts with our expert faculty.",
      courses: [
        { title: "JEE Main & Advanced 2025", description: "Comprehensive course covering both Main and Advanced syllabus." },
        { title: "JEE Foundation for Class 11", description: "Start early to get a competitive edge." },
        { title: "JEE Dropper's Batch", description: "A dedicated program for students taking a gap year." },
      ]
  },
  "school-preparation": { 
      name: "School Preparation", 
      description: "Strengthen your concepts and score better in your school exams from Class 6 to 12.",
       courses: [
        { title: "Mathematics - Class 10", description: "Master the board syllabus with in-depth lessons." },
        { title: "Science - Class 12", description: "Physics, Chemistry, and Biology for your final school year." },
        { title: "Foundation for Middle School", description: "Covering key subjects for Classes 6 to 8." },
      ]
  },
  "cuet": { 
      name: "CUET", 
      description: "Prepare for the Common University Entrance Test with our structured and detailed courses.",
      courses: [
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students collaborating",
          title: "Pravesh CUET Commerce 2026",
          tags: ["NEW", "Hinglish"],
          target: "Targeted Batch for CUET Commerce 2026",
          startDate: "25 Aug, 2025",
          endDate: "31 May, 2026",
          price: "2,799",
          originalPrice: "8,000",
          discount: "65% applied",
        },
        {
          mode: "ONLINE",
          modeColor: "bg-blue-600",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "students learning",
          title: "Pravesh CUET Science 2026",
          tags: ["NEW", "Hinglish"],
          target: "For CUET 2026 Aspirants",
          startDate: "18 Aug, 2025",
          endDate: "30 Jun, 2026",
          price: "3,499",
          originalPrice: "3,999",
          discount: "13% applied",
        },
        {
          mode: "OFFLINE",
          modeColor: "bg-red-600",
          image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
          imageHint: "teacher with students",
          title: "Superclass - Pravesh CUET 2026",
          tags: ["NEW", "Hinglish"],
          target: "Targeted Batch for CUET 2026",
          startDate: "2 May, 2025",
          endDate: "30 Jun, 2026",
          price: "999",
          originalPrice: null,
          discount: null,
        }
      ]
  },
  "govt-job-exams": { 
      name: "Government Job Exams", 
      description: "Secure your future with a government job. We cover a wide range of exams like SSC, Banking, and more.",
      courses: [
        { title: "SSC CGL Tier I & II", description: "Comprehensive coaching for the Combined Graduate Level exam." },
        { title: "IBPS PO & Clerk", description: "Master quantitative aptitude, reasoning, and English for banking exams." },
        { title: "Teaching Eligibility Tests (TET)", description: "Prepare for state and central level teacher eligibility tests." },
      ]
  },
  "defence": { 
      name: "Defence Exams", 
      description: "Serve the nation by joining the armed forces. We provide coaching for NDA, CDS, AFCAT, and more.",
      courses: [
        { title: "NDA & NA Examination", description: "Prepare for the National Defence Academy entrance exam." },
        { title: "CDS (Combined Defence Services)", description: "Coaching for IMA, INA, AFA, and OTA." },
        { title: "AFCAT (Air Force Common Admission Test)", description: "Your gateway to a career in the Indian Air Force." },
      ]
  },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };

  if (slug !== 'cuet') {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{data.name}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
            {data.description}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.courses.length > 0 ? (
            data.courses.map((course: {title: string, description: string}, index: number) => (
              <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex-grow p-6">
                    <BookOpen className="w-10 h-10 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href="#">
                      View Course <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center">
              <Card className="p-8">
                  <p className="text-muted-foreground">No courses available in this category yet. Please check back later!</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CUET specific layout
  return (
     <div className="container mx-auto py-8 px-4 md:px-6">
       <div className="flex items-center overflow-x-auto space-x-4 mb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Button variant="outline" className="rounded-full whitespace-nowrap">Online</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Offline</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              Pricing <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Low to High</DropdownMenuItem>
            <DropdownMenuItem>High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full whitespace-nowrap">
              Language <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Hindi</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Power Batch</Button>
        <Button variant="outline" className="rounded-full whitespace-nowrap">Newly Launched</Button>
      </div>
      
       <div className="mb-6">
        <h2 className="text-lg font-semibold">Showing '{data.courses.length}' Total Batches</h2>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {data.courses.map((course: any, index: number) => (
           <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
             <div className="relative">
                <div className={`absolute top-0 left-0 text-white text-xs font-bold uppercase px-3 py-1 ${course.modeColor} rounded-br-lg`}>
                    {course.mode}
                </div>
                <Image
                    src={course.image}
                    alt={course.title}
                    data-ai-hint={course.imageHint}
                    width={600}
                    height={400}
                    className="w-full object-cover aspect-video"
                />
             </div>
             <CardContent className="p-4 flex flex-col flex-grow">
               <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold flex-grow">{course.title}</h3>
                {course.tags.map((tag: string) => (
                    <Badge key={tag} variant={tag === 'NEW' ? 'default' : 'secondary'}>{tag}</Badge>
                ))}
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
               </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Target className="w-4 h-4" />
                    <p>{course.target}</p>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <p>Starts on {course.startDate} <span className="mx-1">·</span> Ends on {course.endDate}</p>
                </div>

                <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-2xl font-bold">₹{course.price}</p>
                            {course.originalPrice && <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>}
                        </div>
                        {course.discount && (
                            <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                                <Tag className="w-4 h-4"/>
                                <span>{course.discount}</span>
                            </div>
                        )}
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">
                        {course.originalPrice ? '(FOR FULL BATCH)' : '(BOOK A SEAT)'}
                     </p>
                </div>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
  );
}
