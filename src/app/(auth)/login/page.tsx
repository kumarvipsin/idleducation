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
        className="w-full max-w-[380px] z-10"
      >
        <Card className="border-none bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <CardHeader className="pt-10 pb-2 text-center">
            <Link href="/" className="mx-auto block w-fit mb-4">
              <div className="relative flex items-center justify-center w-20 h-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
                />
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1.5 border border-dotted border-primary/30 rounded-full"
                />

                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-3 bg-primary/5 rounded-full blur-xl"
                />

                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl border border-white/20">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
            <CardTitle className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Welcome Back</CardTitle>
            <CardDescription className="text-[10px] font-bold text-gray-500 dark:text-gray-400 capitalize tracking-widest mt-1">
              {activeTab} Portal
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-11">
                <TabsTrigger 
                  value="student" 
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[10px] font-black uppercase tracking-tight"
                >
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Student
                </TabsTrigger>
                <TabsTrigger 
                  value="teacher" 
                  className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[10px] font-black uppercase tracking-tight"
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
                  className="w-full h-12 rounded-lg text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white transition-all transform active:scale-[0.98] group mt-4 shadow-lg shadow-primary/20" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Authenticating...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pb-10 pt-4 flex flex-col gap-4">
            <div className="text-center text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">
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