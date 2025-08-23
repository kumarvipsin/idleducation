import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BookOpen, BarChart3, Upload, Users, Trophy, Award, Star, Target } from "lucide-react";
import Image from "next/image";

const achievements = [
  {
    icon: <Trophy className="w-10 h-10 text-yellow-500" />,
    title: "Top of the Class",
    description: "Achieved the highest score in 'Introduction to Algebra'.",
  },
  {
    icon: <Award className="w-10 h-10 text-blue-500" />,
    title: "Perfect Attendance",
    description: "Attended all classes during the Spring semester.",
  },
  {
    icon: <Star className="w-10 h-10 text-red-500" />,
    title: "Rising Star",
    description: "Demonstrated outstanding improvement in 'Creative Writing'.",
  },
  {
    icon: <Target className="w-10 h-10 text-green-500" />,
    title: "History Buff",
    description: "Completed all assignments in 'World History' ahead of schedule.",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Welcome to LearnScape
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  An interactive educational platform designed for seamless learning and teaching experiences.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Student Login</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">Teacher Login</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1609660100545-05f3799a941b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxlZHVjYXRpb25hbHxlbnwwfHx8fDE3NTU5NjA1MTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              data-ai-hint="online learning"
              alt="Hero"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Key Features</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you and your students need to succeed in one platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 xl:grid-cols-4 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Interactive Courses</h3>
              <p className="text-sm text-foreground/80">Engaging and accessible course content for students.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Progress Tracking</h3>
              <p className="text-sm text-foreground/80">Intuitive progress trackers for students to monitor their learning journey.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Easy Material Upload</h3>
              <p className="text-sm text-foreground/80">A simple interface for teachers to upload course materials.</p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Class Management</h3>
              <p className="text-sm text-foreground/80">Powerful tools for teachers to manage their classes and students.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary">What Our Users Say</h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from students and teachers who love using LearnScape.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:grid-cols-2 mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Sarah T.</CardTitle>
                    <p className="text-sm text-foreground/80">Student</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"LearnScape has transformed the way I study. The interactive courses are so engaging, and I can easily track my progress. It's fantastic!"</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Michael J.</CardTitle>
                    <p className="text-sm text-foreground/80">Teacher</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>"Managing my classes has never been easier. Uploading materials is a breeze, and the platform provides all the tools I need to support my students."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="achievements" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Celebrating Student Success</h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our students are accomplishing great things. Here are a few of their recent achievements.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-12">
            {achievements.map((achievement, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 pb-4">
                  {achievement.icon}
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild>
                <Link href="/student/achievements">View All Achievements</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
