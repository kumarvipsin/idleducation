'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/student/dashboard');
    }

    const handleTeacherLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/teacher/dashboard');
    }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] py-12">
      <Tabs defaultValue="student" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">
            <GraduationCap className="mr-2 h-4 w-4" /> Student
          </TabsTrigger>
          <TabsTrigger value="teacher">
            <Briefcase className="mr-2 h-4 w-4" /> Teacher
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
              <CardDescription>
                Access your courses and track your progress.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleStudentLogin}>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <Input id="student-password" type="password" required />
                </div>
                </CardContent>
                <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="teacher">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Login</CardTitle>
              <CardDescription>
                Manage your classes and upload materials.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleTeacherLogin}>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input id="teacher-email" type="email" placeholder="teacher@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input id="teacher-password" type="password" required />
                </div>
                </CardContent>
                <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
