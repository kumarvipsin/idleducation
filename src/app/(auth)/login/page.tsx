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
import { motion } from "framer-motion";

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#F0F9FF] via-[#E0F2F1] to-[#F0FFF4] dark:from-background dark:via-background dark:to-background overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#92C799]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-xl mb-6 ring-1 ring-black/5">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            LearnScape
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Your bridge to academic excellence
          </p>
        </div>

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 backdrop-blur-md dark:bg-gray-800/50 rounded-xl mb-6 shadow-sm border border-white/20">
            <TabsTrigger 
              value="student" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5 transition-all font-bold text-sm"
            >
              <GraduationCap className="mr-2 h-4 w-4" /> Student
            </TabsTrigger>
            <TabsTrigger 
              value="teacher" 
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5 transition-all font-bold text-sm"
            >
              <Briefcase className="mr-2 h-4 w-4" /> Teacher
            </TabsTrigger>
          </TabsList>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 rounded-[2rem] overflow-hidden ring-1 ring-black/5">
            <TabsContent value="student" className="m-0">
              <CardHeader className="pt-10 pb-6 text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-sm">Enter your credentials to access your portal</CardDescription>
              </CardHeader>
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                  <CardContent className="space-y-4 px-8">
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input 
                                placeholder="Email address" 
                                {...field} 
                                className="pl-11 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all" 
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
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="Password" 
                                {...field} 
                                className="pl-11 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 px-8 pb-10 pt-2">
                    <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group" disabled={studentForm.formState.isSubmitting}>
                      {studentForm.formState.isSubmitting ? 'Authenticating...' : 'Sign In'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="text-center text-xs text-gray-500 font-medium">
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="text-primary font-bold hover:underline transition-all">
                        Create one now
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="teacher" className="m-0">
              <CardHeader className="pt-10 pb-6 text-center">
                <CardTitle className="text-2xl font-bold">Teacher Portal</CardTitle>
                <CardDescription className="text-sm">Manage your classroom and resources</CardDescription>
              </CardHeader>
              <Form {...teacherForm}>
                <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                  <CardContent className="space-y-4 px-8">
                    <FormField
                      control={teacherForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input 
                                placeholder="Teacher email" 
                                {...field} 
                                className="pl-11 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all" 
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
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input 
                                type="password" 
                                placeholder="Password" 
                                {...field} 
                                className="pl-11 h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all" 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 px-8 pb-10 pt-2">
                    <Button type="submit" className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group" disabled={teacherForm.formState.isSubmitting}>
                      {teacherForm.formState.isSubmitting ? 'Authenticating...' : 'Sign In'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="text-center text-xs text-gray-500 font-medium">
                      Interested in joining our faculty?{" "}
                      <Link href="/contact" className="text-primary font-bold hover:underline transition-all">
                        Contact us
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Card>
        </Tabs>
      </motion.div>
    </div>
  );
}
