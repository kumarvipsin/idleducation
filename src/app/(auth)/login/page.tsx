'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase, Mail, Lock, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions";
import Link from "next/link";
import { useAuth, type UserProfile } from "@/context/auth-context";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

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

    if (result.success && result.user) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Update the auth context and session storage
      login(result.user as UserProfile);

      const redirectPath = result.user.role === 'admin' 
        ? '/admin/dashboard' 
        : `/${result.user.role}/dashboard`;
        
      router.push(redirectPath);

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#E0F2F1] dark:bg-background overflow-hidden relative">
      {/* Decorative background blobs for a premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#70A4A2]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#92C799]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-[440px] space-y-8 animate-fade-in-up relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-4">
            <BookOpen className="h-8 w-8 text-[#70A4A2]" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            LearnScape
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Empowering your academic journey
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50 dark:bg-gray-800/40 dark:border-gray-700 shadow-sm">
            <TabsTrigger 
              value="student" 
              className="rounded-xl data-[state=active]:bg-[#70A4A2] data-[state=active]:text-white py-3 transition-all font-semibold"
            >
              <GraduationCap className="mr-2 h-5 w-5" /> Student
            </TabsTrigger>
            <TabsTrigger 
              value="teacher" 
              className="rounded-xl data-[state=active]:bg-[#70A4A2] data-[state=active]:text-white py-3 transition-all font-semibold"
            >
              <Briefcase className="mr-2 h-5 w-5" /> Teacher
            </TabsTrigger>
          </TabsList>

          <Card className="mt-8 border-0 shadow-2xl bg-white/90 backdrop-blur-2xl dark:bg-gray-900/90 rounded-[2.5rem] overflow-hidden">
            <TabsContent value="student" className="m-0">
              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">Student Login</CardTitle>
                <CardDescription className="text-center text-base">
                  Sign in to access your courses and progress
                </CardDescription>
              </CardHeader>
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                  <CardContent className="space-y-5 px-10">
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#70A4A2] transition-colors" />
                              <Input 
                                placeholder="Email address" 
                                {...field} 
                                className="pl-12 h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-[#70A4A2] rounded-2xl text-lg" 
                              />
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
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#70A4A2] transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="Password" 
                                {...field} 
                                className="pl-12 h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-[#70A4A2] rounded-2xl text-lg" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-6 px-10 pb-10 pt-4">
                    <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-[#70A4A2] hover:bg-[#5e8e8c] text-white transition-all transform active:scale-[0.98] group" disabled={studentForm.formState.isSubmitting}>
                      {studentForm.formState.isSubmitting ? 'Authenticating...' : 'Login'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="text-center text-sm text-gray-500 font-medium">
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="text-[#70A4A2] font-bold hover:underline transition-all">
                        Sign up now
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="teacher" className="m-0">
              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">Teacher Login</CardTitle>
                <CardDescription className="text-center text-base">
                  Manage your classes and upload materials
                </CardDescription>
              </CardHeader>
              <Form {...teacherForm}>
                <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                  <CardContent className="space-y-5 px-10">
                    <FormField
                      control={teacherForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#70A4A2] transition-colors" />
                              <Input 
                                placeholder="Teacher email" 
                                {...field} 
                                className="pl-12 h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-[#70A4A2] rounded-2xl text-lg" 
                              />
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
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#70A4A2] transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="Password" 
                                {...field} 
                                className="pl-12 h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-[#70A4A2] rounded-2xl text-lg" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-6 px-10 pb-10 pt-4">
                    <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-[#70A4A2] hover:bg-[#5e8e8c] text-white transition-all transform active:scale-[0.98] group" disabled={teacherForm.formState.isSubmitting}>
                      {teacherForm.formState.isSubmitting ? 'Authenticating...' : 'Login'}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="text-center text-sm text-gray-500 font-medium">
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="text-[#70A4A2] font-bold hover:underline transition-all">
                        Sign up now
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
  );
}
