
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Target, Eye, Users, PenSquare, UserCircle, Briefcase } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DirectorPage() {

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="my-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Director</h2>
        </div>
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-muted/40 p-8 flex flex-col items-center justify-center text-center">
              <Avatar className="w-48 h-48 mb-4 border-[6px] border-white shadow-lg">
                <AvatarImage src="/amod.jpg" alt="Director's Photo" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <h1 className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">AMOD KUMAR SHARMA</h1>
              <p className="text-base text-muted-foreground mt-1">Founder & Managing Director</p>
            </div>
            <div className="md:col-span-2 p-4 sm:p-8">
              <Tabs defaultValue="message" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="message">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Director's Message
                  </TabsTrigger>
                  <TabsTrigger value="biography">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Biography
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="message" className="mt-6 text-foreground/90 leading-relaxed">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                    "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the best tools for both our dedicated educators and our ambitious students. Together, we are not just learning; we are shaping the future."
                  </blockquote>
                </TabsContent>
                <TabsContent value="biography" className="mt-6 text-foreground/90 leading-relaxed space-y-4">
                  <p>
                    Amod Kumar Sharma is a visionary in the field of educational technology with over two decades of experience. He has dedicated his career to exploring the intersection of technology and learning.
                  </p>
                  <p>
                    Before founding IDL EDUCATION, Mr. Sharma was a celebrated professor and led several successful ed-tech initiatives that have been adopted by institutions nationwide. His research on digital pedagogy is widely published, and he is a frequent keynote speaker at global education conferences. Mr. Sharma's passion for accessible and effective education is the cornerstone of IDL EDUCATION's mission.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
