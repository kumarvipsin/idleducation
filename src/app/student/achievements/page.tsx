import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, Target } from "lucide-react";

const achievements = [
  {
    icon: <Trophy className="w-10 h-10 text-yellow-500" />,
    title: "Top of the Class",
    description: "Achieved the highest score in 'Introduction to Algebra'.",
    date: "May 2024",
  },
  {
    icon: <Award className="w-10 h-10 text-blue-500" />,
    title: "Perfect Attendance",
    description: "Attended all classes during the Spring semester.",
    date: "June 2024",
  },
  {
    icon: <Star className="w-10 h-10 text-red-500" />,
    title: "Rising Star",
    description: "Demonstrated outstanding improvement in 'Creative Writing'.",
    date: "April 2024",
  },
  {
    icon: <Target className="w-10 h-10 text-green-500" />,
    title: "History Buff",
    description: "Completed all assignments in 'World History' ahead of schedule.",
    date: "May 2024",
  },
   {
    icon: <Trophy className="w-10 h-10 text-yellow-500" />,
    title: "Science Whiz",
    description: "Top project in the 'Chemistry 101' science fair.",
    date: "June 2024",
  },
   {
    icon: <Star className="w-10 h-10 text-red-500" />,
    title: "Avid Reader",
    description: "Read and reviewed 5 extra books for the literature club.",
    date: "March 2024",
  },
];

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Achievements</CardTitle>
          <CardDescription>A collection of your accomplishments and milestones.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <Card key={index} className="flex flex-col">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
