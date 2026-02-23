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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-gray-950 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[320px] z-10"
      >
        <Card className="border-none bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <CardHeader className="pt-6 pb-2 text-center">
            <Link href="/" className="mx-auto block w-fit mb-2">
              <div className="relative flex items-center justify-center w-14 h-14">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
                />
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border border-white/20">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
            <CardTitle className="text-base font-black tracking-tight text-gray-900 dark:text-white uppercase">Welcome Back</CardTitle>
            <CardDescription className="text-[9px] font-bold text-gray-500 dark:text-gray-400 capitalize tracking-widest mt-0.5">
              {activeTab} Portal
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-9">
                <TabsTrigger 
                  value="student" 
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[9px] font-black uppercase tracking-tight"
                >
                  <GraduationCap className="w-3 h-3 mr-1" /> Student
                </TabsTrigger>
                <TabsTrigger 
                  value="teacher" 
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[9px] font-black uppercase tracking-tight"
                >
                  <Briefcase className="w-3 h-3 mr-1" /> Teacher
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="Email address" 
                            {...field} 
                            className="pl-9 h-10 bg-gray-50 dark:bg-gray-800/50 border focus:ring-2 focus:ring-primary/20 rounded-lg transition-all text-xs" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[9px]" />
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
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password" 
                            placeholder="Password" 
                            {...field} 
                            className="pl-9 h-10 bg-gray-50 dark:bg-gray-800/50 border focus:ring-2 focus:ring-primary/20 rounded-lg transition-all text-xs" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[9px]" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-10 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group mt-2 shadow-lg shadow-primary/20" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Wait...' : 'Sign In'}
                  <ArrowRight className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pb-6 pt-2 flex flex-col gap-2">
            <div className="text-center text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              No account?{" "}
              <Link href="/signup" className="text-primary hover:underline transition-all font-black">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}