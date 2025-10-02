
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, Target, Home } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const achievements = [
  {
    icon: <Trophy className="w-10 h-10 text-yellow-500" />,
    title: "Top of the Class",
    description: "Achieved the highest score in 'Introduction to Algebra'.",
    date: "May 2024",
    image: { src: "https://images.unsplash.com/photo-1596495578065-450763f0d420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVjZWl2aW5nJTIwYXdhcmR8ZW58MHx8fHwxNzU2MjY5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Student receiving an award", hint: "student award" },
  },
  {
    icon: <Award className="w-10 h-10 text-blue-500" />,
    title: "Perfect Attendance",
    description: "Attended all classes during the Spring semester.",
    date: "June 2024",
    image: { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Group of students in a classroom", hint: "students classroom" },
  },
  {
    icon: <Star className="w-10 h-10 text-red-500" />,
    title: "Rising Star",
    description: "Demonstrated outstanding improvement in 'Creative Writing'.",
    date: "April 2024",
    image: { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8", alt: "Student raising hand in class", hint: "student participating" },
  },
  {
    icon: <Target className="w-10 h-10 text-green-500" />,
    title: "History Buff",
    description: "Completed all assignments in 'World History' ahead of schedule.",
    date: "May 2024",
    image: { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHRlYW13b3JrfGVufDB8fHx8MTc1NjI2OTg4MXww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Students working on a history project", hint: "students project" },
  },
   {
    icon: <Trophy className="w-10 h-10 text-yellow-500" />,
    title: "Science Whiz",
    description: "Top project in the 'Chemistry 101' science fair.",
    date: "June 2024",
    image: { src: "https://images.unsplash.com/photo-1576013342939-552b059f3775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc2NpZW5jZSUyMGZhaXJ8ZW58MHx8fHwxNzU2MjY5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080", alt: "Student with a science project", hint: "student science" },
  },
   {
    icon: <Star className="w-10 h-10 text-red-500" />,
    title: "Avid Reader",
    description: "Read and reviewed 5 extra books for the literature club.",
    date: "March 2024",
    image: { src: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaW4lMjBsaWJyYXJ5fGVufDB8fHx8MTc1NjI2OTkyMHww&ixlib=rb-4.1.0&q=80&w=1080", alt: "Student reading in a library", hint: "student library" },
  },
];

export default function AchievementsPage() {
  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12 px-4 md:px-6">
            <section className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Celebrating Student Success</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                Our students are accomplishing great things. Here are a few of their recent achievements.
                </p>
            </section>
            
            <div className="relative">
              <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-6 px-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-card">
                        <div className="relative w-full aspect-video">
                          <Image
                              src={achievement.image.src}
                              alt={achievement.image.alt}
                              data-ai-hint={achievement.image.hint}
                              fill
                              className="w-full object-cover"
                          />
                        </div>
                        <CardHeader className="flex-row items-center gap-4">
                            {achievement.icon}
                            <div className="flex-1">
                            <CardTitle className="text-xl">{achievement.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{achievement.description}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <p className="text-xs text-muted-foreground">{achievement.date}</p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
    </div>
  );
}
