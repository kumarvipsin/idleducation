
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, Target, Home } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const achievements = [
  {
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    title: "Top of the Class",
    description: "Achieved the highest score in 'Introduction to Algebra'.",
    date: "May 2024",
    imageUrl: "https://images.unsplash.com/photo-1596495578065-450763f0d420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcmVjZWl2aW5nJTIwYXdhcmR8ZW58MHx8fHwxNzU2MjY5ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "student award",
  },
  {
    icon: <Award className="w-8 h-8 text-blue-500" />,
    title: "Perfect Attendance",
    description: "Attended all classes during the Spring semester.",
    date: "June 2024",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "students classroom",
  },
  {
    icon: <Star className="w-8 h-8 text-red-500" />,
    title: "Rising Star",
    description: "Demonstrated outstanding improvement in 'Creative Writing'.",
    date: "April 2024",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "student participating",
  },
  {
    icon: <Target className="w-8 h-8 text-green-500" />,
    title: "History Buff",
    description: "Completed all assignments in 'World History' ahead of schedule.",
    date: "May 2024",
    imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvamVjdCUyMHRlYW13b3JrfGVufDB8fHx8MTc1NjI2OTg4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "students project",
  },
   {
    icon: <Trophy className="w-8 h-8 text-yellow-500" />,
    title: "Science Whiz",
    description: "Top project in the 'Chemistry 101' science fair.",
    date: "June 2024",
    imageUrl: "https://images.unsplash.com/photo-1576013342939-552b059f3775?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc2NpZW5jZSUyMGZhaXJ8ZW58MHx8fHwxNzU2MjY5OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "student science",
  },
   {
    icon: <Star className="w-8 h-8 text-red-500" />,
    title: "Avid Reader",
    description: "Read and reviewed 5 extra books for the literature club.",
    date: "March 2024",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwaW4lMjBsaWJyYXJ5fGVufDB8fHx8MTc1NjI2OTkyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "student library",
  },
];

export default function AchievementsPage() {
  return (
    <section className="w-full relative py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
        <Link href="/" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon">
                <Home className="h-6 w-6 text-primary" />
                <span className="sr-only">Home</span>
            </Button>
        </Link>
        <div className="container mx-auto px-4 md:px-[10%] mb-12">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 57%, rgba(237, 221, 83, 1) 100%)" }}>Our Achievers</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Our students are accomplishing great things. Here are a few of their recent achievements.
                </p>
            </div>
        </div>
        <div className="relative">
            <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-6 px-4 md:px-[10%]">
                {achievements.map((achievement, index) => (
                    <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                        <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                            <CardContent className="p-8 flex-grow flex flex-col">
                                <div className="mb-4">{achievement.icon}</div>
                                <h3 className="text-2xl font-black mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{achievement.title}</h3>
                                <p className="text-sm mt-2 text-muted-foreground flex-grow">{achievement.description}</p>
                                <p className="text-xs text-muted-foreground mt-4">{achievement.date}</p>
                            </CardContent>
                            <div className="relative aspect-[4/3] w-full mt-auto p-4">
                                <Image
                                src={achievement.imageUrl}
                                alt={achievement.title}
                                data-ai-hint={achievement.imageHint}
                                fill
                                className="object-cover rounded-md"
                                />
                            </div>
                        </Card>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </section>
  );
}
