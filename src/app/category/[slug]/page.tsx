
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: { slug: string };
};

// Mock data for demonstration
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
        { title: "CUET (UG) 2025", description: "Integrated course for holistic preparation." },
        { title: "Current Affairs Module", description: "Stay updated with daily, weekly, and monthly coverage." },
        { title: "General Test Practice", description: "Sharpen your skills with expert feedback." },
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

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const data = categoryData[slug] || { name: "Category", description: "No information available for this category.", courses: [] };

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
              <CardHeader>
                  <BookOpen className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
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
