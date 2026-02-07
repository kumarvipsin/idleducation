
'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, GraduationCap, BookMarked } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getStudentEnrolledCourses } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchCourses = async () => {
        setLoading(true);
        const result = await getStudentEnrolledCourses(user.uid);
        if (result.success) {
          setCourses(result.data || []);
        }
        setLoading(false);
      };
      fetchCourses();
    }
  }, [user]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">My Premium Courses</CardTitle>
                <CardDescription className="text-sm font-medium">Access and manage your enrolled structured learning programs.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group border-muted-foreground/10">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {course.coverImageUrl ? (
                      <GcsImage
                        filePath={course.coverImageUrl}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5">
                        <BookOpen className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 text-white border-none font-bold text-[10px] uppercase px-2 py-0.5 shadow-sm">ENROLLED</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest bg-muted/50">{course.subject}</Badge>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{course.medium}</Badge>
                    </div>

                    <div className="mt-auto pt-4 border-t border-muted-foreground/5 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            <span>Batch: {course.batchName}</span>
                            <span>Validity: {course.validity}</span>
                        </div>
                        <Button asChild className="w-full font-bold rounded-xl shadow-lg shadow-primary/10 group/btn h-10">
                            <Link href="/paid-courses">
                                <PlayCircle className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                                CONTINUE STUDYING
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed py-20 flex flex-col items-center justify-center text-center bg-muted/5 rounded-2xl">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <BookMarked className="w-12 h-12 text-primary/30" />
              </div>
              <h3 className="text-xl font-extrabold text-foreground">No Enrolled Courses</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2 mb-6">
                You haven't enrolled in any premium courses yet. Start your journey today!
              </p>
              <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20">
                <Link href="/paid-courses">Explore Premium Courses</Link>
              </Button>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
