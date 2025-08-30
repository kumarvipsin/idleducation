'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BookCopy, Target, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getStudentProgressReports } from "@/app/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const chartData = [
  { month: "January", progress: 15 },
  { month: "February", progress: 30 },
  { month: "March", progress: 45 },
  { month: "April", progress: 60 },
  { month: "May", progress: 75 },
  { month: "June", progress: 90 },
];

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const courses = [
  { title: "Introduction to Algebra", description: "Master the fundamentals of algebra.", progress: 75, icon: <BookCopy className="w-8 h-8 text-primary" /> },
  { title: "World History: Ancient Civilizations", description: "Explore the ancient world from Mesopotamia to Rome.", progress: 45, icon: <BookCopy className="w-8 h-8 text-primary" /> },
  { title: "Chemistry 101", description: "Understand the basic principles of chemistry.", progress: 60, icon: <BookCopy className="w-8 h-8 text-primary" /> },
  { title: "Creative Writing Workshop", description: "Unleash your inner author.", progress: 20, icon: <BookCopy className="w-8 h-8 text-primary" /> },
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookCopy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">+2 from last semester</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">50%</div>
                  <p className="text-xs text-muted-foreground">Keep up the great work!</p>
              </CardContent>
          </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>An overview of your current courses and progress.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {courses.map(course => (
                      <div key={course.title} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            {course.icon}
                            <div className="flex-1">
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Progress</span>
                                <span className="text-xs font-semibold">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} />
                          </div>
                      </div>
                  ))}
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Monthly Progress</CardTitle>
                  <CardDescription>Your learning activity over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <BarChart data={chartData} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis
                              dataKey="month"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value) => value.slice(0, 3)}
                          />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="progress" fill="var(--color-progress)" radius={4} />
                      </BarChart>
                  </ChartContainer>
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
                    <p className="text-muted-foreground">{report.report}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No progress reports have been added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
