'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase, Mail, Lock, Home, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions";
import Link from "next/link";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  captcha: z.string().min(6, { message: "Captcha is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [captcha, setCaptcha] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captchaText;
  };

  useEffect(() => {
    if (isClient) {
      setCaptcha(generateCaptcha());
    }
  }, [isClient]);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const studentForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', captcha: '' },
  });

  const teacherForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', captcha: '' },
  });

  const handleLogin = async (data: LoginValues) => {
    if (data.captcha.toUpperCase() !== captcha.toUpperCase()) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid captcha. Please try again.",
      });
      // Clear captcha field for retry
      if (studentForm.getValues().email === data.email) {
        studentForm.setValue('captcha', '');
      }
      if (teacherForm.getValues().email === data.email) {
        teacherForm.setValue('captcha', '');
      }
      refreshCaptcha();
      return;
    }
    
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
      refreshCaptcha();
    }
  };

  const onStudentSubmit: SubmitHandler<LoginValues> = (data) => handleLogin(data);
  const onTeacherSubmit: SubmitHandler<LoginValues> = (data) => handleLogin(data);

  return (
    <div className="relative w-full p-4 bg-white dark:bg-background overflow-y-auto">
        <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
            <div className="w-full max-w-lg mx-auto animate-fade-in-up">
              <Tabs defaultValue="student">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                  <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                    <GraduationCap className="mr-2 h-4 w-4" /> Student
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                    <Briefcase className="mr-2 h-4 w-4" /> Teacher
                  </TabsTrigger>
                </TabsList>
                <Card className="shadow-2xl rounded-t-none border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                  <TabsContent value="student" className="m-0">
                      <CardHeader className="text-center">
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
                             <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-md p-2 text-center font-bold text-lg tracking-widest select-none bg-cover" style={{backgroundImage: "url('https://www.publicdomainpictures.net/pictures/20000/nahled/plain-white-background.jpg')"}}>
                                    {isClient ? captcha : '...'}
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </div>
                             <FormField
                              control={studentForm.control}
                              name="captcha"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                      <Input placeholder="Enter Captcha" {...field} className="text-center tracking-widest" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardFooter className="flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={studentForm.formState.isSubmitting}>
                              {studentForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>
                             <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="underline text-primary">
                                Sign Up
                                </Link>
                            </div>
                          </CardFooter>
                        </form>
                      </Form>
                  </TabsContent>
                  <TabsContent value="teacher" className="m-0">
                      <CardHeader className="text-center">
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
                             <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-md p-2 text-center font-bold text-lg tracking-widest select-none bg-cover" style={{backgroundImage: "url('https://www.publicdomainpictures.net/pictures/20000/nahled/plain-white-background.jpg')"}}>
                                    {isClient ? captcha : '...'}
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={refreshCaptcha}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </div>
                             <FormField
                              control={teacherForm.control}
                              name="captcha"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                      <Input placeholder="Enter Captcha" {...field} className="text-center tracking-widest" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                          <CardFooter className="flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={teacherForm.formState.isSubmitting}>
                              {teacherForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                            </Button>
                             <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="underline text-primary">
                                Sign Up
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
