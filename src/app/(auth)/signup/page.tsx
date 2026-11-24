'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, GraduationCap, Briefcase, User, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { signUpUser } from "@/app/actions";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().trim().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  const emailForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleEmailSignup: SubmitHandler<SignupValues> = async (data) => {
    const result = await signUpUser({ ...data, role: userRole });
    if (result.success) {
      toast({ title: "Account Created", description: "Please sign in with your new credentials." });
      router.push('/login');
    } else {
      toast({ variant: "destructive", title: "Signup Failed", description: result.message });
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void emailForm.handleSubmit(handleEmailSignup)();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[420px]"
      >
        {/* Logo & heading above card */}
        <div className="text-center mb-6 animate-fade-in-up">
          <Link href="/" className="mx-auto block w-fit">
            <Image
              src="/idllogo.png"
              alt="IDL Education Logo"
              width={180}
              height={52}
              className="h-11 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <h1 className="text-xl font-extrabold text-primary mt-3 tracking-tight group inline-block">
            Start Your Journey
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">Create a new student or teacher account with email.</p>
        </div>

        {/* Contact-style Card */}
        <Card className="shadow-none rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <CardContent className="p-0">
            <Form {...emailForm}>
              <form noValidate onSubmit={emailForm.handleSubmit(handleEmailSignup)} className="flex flex-col overflow-hidden">
                {/* Role Tabs */}
                <div className="border-b border-slate-100 dark:border-slate-800">
                  <Tabs value={userRole} onValueChange={(val) => setUserRole(val as 'student' | 'teacher')}>
                    <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent h-12 rounded-none">
                      <TabsTrigger
                        value="student"
                        className="rounded-none bg-transparent data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-xs font-bold uppercase tracking-wider text-slate-400 h-full cursor-pointer border-b-2 border-transparent transition-all"
                      >
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Student
                      </TabsTrigger>
                      <TabsTrigger
                        value="teacher"
                        className="rounded-none bg-transparent data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary text-xs font-bold uppercase tracking-wider text-slate-400 h-full cursor-pointer border-b-2 border-transparent transition-all"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Teacher
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Email signup fields */}
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                  <FormField
                    control={emailForm.control}
                    name="name"
                    render={({ field }) => (
                      <div className="relative group h-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                          <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                          type="text"
                          autoComplete="name"
                          enterKeyHint="next"
                          placeholder="Full Name *"
                          autoFocus
                          {...field}
                          onKeyDown={handleEnterKey}
                          className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                        />
                        <FormMessage className="text-[10px] px-4 pb-2" />
                      </div>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <div className="relative group h-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                          <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                          type="email"
                          autoComplete="email"
                          enterKeyHint="next"
                          placeholder="Email Address *"
                          {...field}
                          onKeyDown={handleEnterKey}
                          className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                        />
                        <FormMessage className="text-[10px] px-4 pb-2" />
                      </div>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="password"
                    render={({ field }) => (
                      <div className="relative group h-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                          <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          enterKeyHint="go"
                          placeholder="Create Password (min 6 chars) *"
                          {...field}
                          onKeyDown={handleEnterKey}
                          className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                        />
                        <FormMessage className="text-[10px] px-4 pb-2" />
                      </div>
                    )}
                  />
                </div>

                {/* Footer: Submit Button */}
                <div className="p-5 bg-slate-50 border-t border-slate-100">
                  <Button
                    type="submit"
                    disabled={emailForm.formState.isSubmitting}
                    className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                  >
                    {emailForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Login link */}
        <p className="text-center text-xs text-slate-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
