'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookCopy, CheckCircle, PlusCircle } from "lucide-react";

const courseSections = {
  "Mathematics": [
    { title: "Introduction to Algebra", description: "Master the fundamentals of algebra.", progress: 75, enrolled: true },
    { title: "Calculus I", description: "Explore limits, derivatives, and integrals.", progress: 0, enrolled: false },
    { title: "Geometry", description: "Learn about shapes, sizes, positions of figures, and properties of space.", progress: 0, enrolled: false },
  ],
  "History": [
    { title: "World History: Ancient Civilizations", description: "Explore the ancient world from Mesopotamia to Rome.", progress: 45, enrolled: true },
    { title: "The American Revolution", description: "An in-depth study of the American Revolutionary War.", progress: 0, enrolled: false },
  ],
  "Science": [
    { title: "Chemistry 101", description: "Understand the basic principles of chemistry.", progress: 60, enrolled: true },
    { title: "Physics: Mechanics", description: "Learn about motion, forces, and energy.", progress: 0, enrolled: false },
    { title: "Biology: The Cell", description: "Discover the fundamental unit of life.", progress: 0, enrolled: false },
  ],
  "Arts": [
      { title: "Creative Writing Workshop", description: "Unleash your inner author.", progress: 20, enrolled: true },
      { title: "Introduction to Drawing", description: "Learn the basic techniques of drawing and composition.", progress: 0, enrolled: false },
  ]
};

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Browse Courses</CardTitle>
          <CardDescription>Explore our catalog and enroll in new courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["Mathematics"]}>
            {Object.entries(courseSections).map(([section, courses]) => (
              <AccordionItem value={section} key={section}>
                <AccordionTrigger className="text-xl font-semibold text-primary">{section}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {courses.map(course => (
                      <div key={course.title} className="p-4 border rounded-lg flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4">
                            <BookCopy className="w-8 h-8 text-primary mt-1" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                          </div>
                          {course.enrolled && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-medium">Progress</span>
                                  <span className="text-xs font-semibold">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} />
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                            {course.enrolled ? (
                                <Button variant="outline" className="w-full" disabled>
                                    <CheckCircle className="mr-2" />
                                    Enrolled
                                </Button>
                            ) : (
                                <Button className="w-full">
                                    <PlusCircle className="mr-2" />
                                    Enroll
                                </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
