
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const studentForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const teacherForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (data: LoginValues) => {
    const result = await loginUser(data);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // The AuthProvider will handle fetching role and updating state.
      // We can force a reload to ensure the context picks up the new user.
      const redirectPath = result.role === 'admin' ? '/admin/dashboard' : `/${result.role}/dashboard`;
      router.push(redirectPath);
      router.refresh(); // This ensures the layout gets fresh server data if needed

    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message,
      });
    }
  };

  const onStudentSubmit: SubmitHandler<LoginValues> = (data) => handleLogin(data);
  const onTeacherSubmit: SubmitHandler<LoginValues> = (data) => handleLogin(data);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12">
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
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={studentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={studentForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={studentForm.formState.isSubmitting}>
                    {studentForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
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
            <Form {...teacherForm}>
              <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={teacherForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="teacher@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teacherForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={teacherForm.formState.isSubmitting}>
                    {teacherForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
