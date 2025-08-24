import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function DirectorProfilePage() {
  return (
    <div className="w-full py-12 px-4 md:px-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
        <div className="md:col-span-1 flex flex-col items-center text-center">
          <Avatar className="w-48 h-48 mb-4 border-4 border-primary">
            <AvatarImage src="https://images.unsplash.com/photo-1752118464988-2914fb27d0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8dGVhY2hlciUyMHByb2ZpbGV8ZW58MHx8fHwxNzU1OTY3MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Director's Photo" data-ai-hint="professional headshot" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-primary">Dr. Evelyn Reed</h1>
          <p className="text-lg text-foreground/80">Director & Founder</p>
        </div>
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-primary border-b pb-2">A Message from the Director</h2>
          <p className="text-foreground/90 leading-relaxed italic">
            "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the best tools for both our dedicated educators and our ambitious students. Together, we are not just learning; we are shaping the future."
          </p>
          <h2 className="text-2xl font-semibold text-primary border-b pb-2">Biography</h2>
          <p className="text-foreground/90 leading-relaxed">
            Dr. Evelyn Reed is a visionary in the field of educational technology with over two decades of experience. Holding a Ph.D. in Education from Stanford University, she has dedicated her career to exploring the intersection of technology and learning. Before founding IDL EDUCATION, Dr. Reed was a celebrated professor and led several successful ed-tech initiatives that have been adopted by institutions worldwide. Her research on digital pedagogy is widely published, and she is a frequent keynote speaker at global education conferences. Dr. Reed's passion for accessible and effective education is the cornerstone of IDL EDUCATION's mission.
          </p>
        </div>
      </section>
    </div>
  );
}
