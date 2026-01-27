'use client';
import { Card } from "@/components/ui/card";
import { Award, Star, Trophy, Users } from "lucide-react";

export default function AchievementsPage() {
  const statCards = [
    { title: "Years of Excellence", value: "8+", icon: <Star className="h-6 w-6 text-yellow-500" /> },
    { title: "Successful Students", value: "5000+", icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: "Top Rankings", value: "100+", icon: <Trophy className="h-6 w-6 text-green-500" /> },
    { title: "Awards Won", value: "25+", icon: <Award className="h-6 w-6 text-red-500" /> },
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight group inline-block">
            Our Achievements
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-semibold">
            Celebrating the milestones and successes of our students and institution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <Card key={index} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="mb-4 flex justify-center">{stat.icon}</div>
            <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
            <p className="text-muted-foreground">{stat.title}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
