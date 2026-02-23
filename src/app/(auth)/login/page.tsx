'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, ArrowRight, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions";
import Link from "next/link";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { motion } from "framer-motion";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("student");

  const form = useForm<LoginValues>({
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8faff] dark:bg-slate-950 relative overflow-hidden">
      {/* Sophisticated Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] z-10"
      >
        <Card className="border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <CardHeader className="pt-10 pb-6 text-center">
            <Link href="/" className="mx-auto block w-fit mb-6">
              <div className="relative flex items-center justify-center w-16 h-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
                />
                
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
            <CardTitle className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest mt-2">
              {activeTab === 'student' ? 'Student Signin' : 'Teacher Signin'}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent h-12 border-b border-gray-100 dark:border-gray-800 rounded-none">
                <TabsTrigger 
                  value="student" 
                  className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all text-xs font-black uppercase tracking-widest text-gray-400 h-full"
                >
                  <GraduationCap className="w-4 h-4 mr-2" /> Student
                </TabsTrigger>
                <TabsTrigger 
                  value="teacher" 
                  className="rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all text-xs font-black uppercase tracking-widest text-gray-400 h-full"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> Teacher
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="Email address" 
                            {...field} 
                            className="pl-11 h-12 bg-gray-50 dark:bg-gray-800/50 border focus:ring-2 focus:ring-primary/20 rounded-lg transition-all text-sm" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                            className="pl-11 h-12 bg-gray-50 dark:bg-gray-800/50 border focus:ring-2 focus:ring-primary/20 rounded-lg transition-all text-sm" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-lg text-xs font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group mt-4 shadow-lg shadow-primary/20" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Processing...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pb-10 pt-2 flex flex-col gap-2">
            <div className="text-center text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              No account?{" "}
              <Link href="/signup" className="text-gray-400 hover:text-primary transition-all font-bold uppercase hover:underline">
                Signup
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
