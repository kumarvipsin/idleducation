
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, UserCircle } from "lucide-react";

export default function DirectorProfilePage() {
  return (
    <div className="w-full bg-muted/40">
        <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-5xl mx-auto overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-primary/10 p-8 flex flex-col items-center justify-center text-center">
                <Avatar className="w-48 h-48 mb-4 border-4 border-primary shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8dGVhY2hlciUyMHByb2ZpbGV8ZW58MHx8fHwxNzU1OTY3MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Director's Photo" data-ai-hint="professional headshot" />
                <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold text-primary">Dr. Evelyn Reed</h1>
                <p className="text-lg text-foreground/80 mt-1">Director & Founder</p>
            </div>
            <div className="md:col-span-2 p-8">
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
                        Dr. Evelyn Reed is a visionary in the field of educational technology with over two decades of experience. Holding a Ph.D. in Education from Stanford University, she has dedicated her career to exploring the intersection of technology and learning. 
                    </p>
                    <p>
                        Before founding IDL EDUCATION, Dr. Reed was a celebrated professor and led several successful ed-tech initiatives that have been adopted by institutions worldwide. Her research on digital pedagogy is widely published, and she is a frequent keynote speaker at global education conferences. Dr. Reed's passion for accessible and effective education is the cornerstone of IDL EDUCATION's mission.
                    </p>
                </TabsContent>
                </Tabs>
            </div>
            </div>
        </Card>
        </div>
    </div>
  );
}
