'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase, User, Mail, Lock } from "lucide-react";
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
        description: result.message,
      });
      router.push('/login');
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
    <div className="relative min-h-full w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
        <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
             <div className="w-full max-w-lg mx-auto animate-fade-in-up">
                <Tabs defaultValue="student" >
                  <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                    <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                      <GraduationCap className="mr-2 h-4 w-4" /> Student Signup
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                      <Briefcase className="mr-2 h-4 w-4" /> Teacher Signup
                    </TabsTrigger>
                  </TabsList>
                   <Card className="shadow-2xl rounded-t-none border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                    <TabsContent value="student" className="m-0">
                        <CardHeader className="text-center">
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
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Full Name" {...field} className="pl-9" />
                                        </div>
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
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="student@example.com" {...field} className="pl-9" />
                                        </div>
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
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" placeholder="Password" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                              <Button type="submit" className="w-full" disabled={studentForm.formState.isSubmitting}>
                                {studentForm.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
                              </Button>
                               <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline text-primary">
                                Login
                                </Link>
                            </div>
                            </CardFooter>
                          </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="teacher" className="m-0">
                        <CardHeader className="text-center">
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
                                    <FormControl>
                                      <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Jane Smith" {...field} className="pl-9" />
                                        </div>
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
                                    <FormControl>
                                      <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="teacher@example.com" {...field} className="pl-9" />
                                        </div>
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
                                    <FormControl>
                                      <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" placeholder="Password" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                             <CardFooter className="flex-col gap-4">
                              <Button type="submit" className="w-full" disabled={teacherForm.formState.isSubmitting}>
                                {teacherForm.formState.isSubmitting ? 'Signing up...' : 'Sign Up'}
                              </Button>
                               <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline text-primary">
                                Login
                                </Link>
                            </div>
                            </CardFooter>
                          </form>
                        </Form>
                    </TabsContent>
                   </Card>
                </Tabs>
            </div>
        </div>
    </div>
  );
}
