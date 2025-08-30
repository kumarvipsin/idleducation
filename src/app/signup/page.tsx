'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { signUpUser } from "@/app/actions";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const studentForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const teacherForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleSignup = async (data: SignupValues, role: 'student' | 'teacher') => {
    const result = await signUpUser({ ...data, role });

    if (result.success) {
      toast({
        title: "Account Created",
        description: "You have been successfully signed up!",
      });
      router.push(`/${result.role}/dashboard`);
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.message,
      });
    }
  };

  const onStudentSubmit: SubmitHandler<SignupValues> = (data) => handleSignup(data, 'student');
  const onTeacherSubmit: SubmitHandler<SignupValues> = (data) => handleSignup(data, 'teacher');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] py-12">
      <Tabs defaultValue="student" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">
            <GraduationCap className="mr-2 h-4 w-4" /> Student Signup
          </TabsTrigger>
          <TabsTrigger value="teacher">
            <Briefcase className="mr-2 h-4 w-4" /> Teacher Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Create Student Account</CardTitle>
              <CardDescription>
                Join our platform to start your learning journey.
              </CardDescription>
            </CardHeader>
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={studentForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    {studentForm.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="teacher">
          <Card>
            <CardHeader>
              <CardTitle>Create Teacher Account</CardTitle>
              <CardDescription>
                Join our platform to manage your classes.
              </CardDescription>
            </CardHeader>
            <Form {...teacherForm}>
              <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                <CardContent className="space-y-4">
                     <FormField
                    control={teacherForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    {teacherForm.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </div>
  );
}
