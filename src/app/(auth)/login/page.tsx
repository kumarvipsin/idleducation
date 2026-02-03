'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
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
import Image from "next/image";
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Refined decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px] z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
          <CardHeader className="pt-10 pb-4 text-center">
            <Link href="/" className="mx-auto block w-fit mb-4">
              <Image 
                src="/logo.png" 
                alt="LearnScape Logo" 
                width={80} 
                height={80} 
                priority 
                className="drop-shadow-md"
              />
            </Link>
            <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome Back</CardTitle>
            <CardDescription className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
              {activeTab} login portal
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl h-11">
                <TabsTrigger 
                  value="student" 
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[11px] font-bold uppercase tracking-tight"
                >
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Student
                </TabsTrigger>
                <TabsTrigger 
                  value="teacher" 
                  className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[11px] font-bold uppercase tracking-tight"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Teacher
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                            className="pl-11 h-12 bg-gray-50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all text-sm" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
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
                            className="pl-11 h-12 bg-gray-50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-primary/20 rounded-2xl transition-all text-sm" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group mt-2" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Authenticating...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pb-10 pt-2 flex flex-col gap-4">
            <div className="text-center text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline transition-all">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
