'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookCopy, Target, Award, Calendar as CalendarIcon, FileText, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getStudentProgressReports } from "@/app/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";

const courses = [
  { title: "Introduction to Algebra", description: "Master the fundamentals of algebra.", progress: 75, icon: <BookCopy className="w-8 h-8 text-white" />, bgColor: "bg-blue-500" },
  { title: "World History", description: "Explore ancient civilizations.", progress: 45, icon: <BookCopy className="w-8 h-8 text-white" />, bgColor: "bg-orange-500" },
  { title: "Chemistry 101", description: "Understand basic principles.", progress: 60, icon: <BookCopy className="w-8 h-8 text-white" />, bgColor: "bg-green-500" },
  { title: "Creative Writing", description: "Unleash your inner author.", progress: 20, icon: <BookCopy className="w-8 h-8 text-white" />, bgColor: "bg-purple-500" },
];

const achievements = [
  { icon: <Award className="w-6 h-6 text-yellow-500" />, title: "Top of the Class" },
  { icon: <Award className="w-6 h-6 text-blue-500" />, title: "Perfect Attendance" },
  { icon: <Award className="w-6 h-6 text-red-500" />, title: "Rising Star" },
];

interface ProgressReport {
  id: string;
  month: string;
  report: string;
  createdAt: any;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (user) {
      const fetchReports = async () => {
        const result = await getStudentProgressReports(user.uid);
        if (result.success && result.data) {
          setReports(result.data as ProgressReport[]);
        }
      };
      fetchReports();
    }
  }, [user]);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="opacity-80">Ready to learn something new today?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">+2 from last semester</p>
              </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">50%</div>
                  <Progress value={50} className="h-2 mt-2" />
              </CardContent>
          </Card>
           <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">3</div>
                   <p className="text-xs text-muted-foreground">Keep up the great work!</p>
              </CardContent>
          </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
        <Carousel
          opts={{ align: "start" }}
          className="w-full"
        >
          <CarouselContent>
            {courses.map((course, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className={`text-white overflow-hidden shadow-lg ${course.bgColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-full">{course.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold">{course.title}</h3>
                        <p className="text-xs opacity-80">{course.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={course.progress} className="bg-white/30 h-2" />
                      <div className="flex justify-between text-xs mt-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                    </div>
                     <Button variant="ghost" className="w-full mt-4 bg-white/20 hover:bg-white/30">
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex"/>
        </Carousel>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
              <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {achievements.map(achievement => (
                      <div key={achievement.title} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        {achievement.icon}
                        <span className="font-medium text-sm">{achievement.title}</span>
                      </div>
                  ))}
                   <Button variant="outline" asChild className="w-full">
                      <Link href="/student/achievements">View All</Link>
                   </Button>
              </CardContent>
          </Card>
          <Card className="md:col-span-2">
              <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                  <CardDescription>Your schedule for the upcoming weeks.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    // Example of marking days with events
                    modifiers={{ booked: [new Date(), new Date(Date.now() + 86400000 * 2)] }}
                    modifiersClassNames={{
                      booked: "bg-primary/20 text-primary rounded-full",
                    }}
                  />
              </CardContent>
          </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Monthly Progress Reports</CardTitle>
          <CardDescription>Feedback from your teachers on your progress.</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {reports.map((report) => (
                <AccordionItem value={report.id} key={report.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Report for {report.month}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{report.report}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-8">No progress reports have been added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
