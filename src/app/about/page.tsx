import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Target, Eye, Users } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    { name: "Jane Doe", role: "Lead Curriculum Designer", image: "https://placehold.co/100x100.png" },
    { name: "John Smith", role: "Head of Technology", image: "https://placehold.co/100x100.png" },
    { name: "Emily White", role: "Student Success Manager", image: "https://placehold.co/100x100.png" },
    { name: "Chris Green", role: "Lead Developer", image: "https://placehold.co/100x100.png" },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">About IDL EDUCATION</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
          We are dedicated to revolutionizing the educational landscape by providing an intuitive and powerful platform for both students and teachers.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-16 items-center">
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            data-ai-hint="team collaboration"
            alt="Our Team"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Target className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To empower educators and inspire students by creating a seamless, accessible, and engaging digital learning environment. We believe that technology can bridge gaps in education and unlock the full potential of every learner.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Eye className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">
                To become the leading platform for online education, known for our commitment to quality, innovation, and user success. We envision a future where learning is not confined to classrooms, but is a lifelong journey of discovery.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 flex items-center justify-center gap-4">
          <Users className="w-8 h-8" /> Meet Our Team
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-foreground/80">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
