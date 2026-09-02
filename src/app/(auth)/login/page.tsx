'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, KeyRound, Mail, Lock, ArrowRight, GraduationCap, 
  Briefcase, RotateCcw, ChevronDown, User, Send
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser, sendPhoneOtp, verifyPhoneOtpAndLogin } from "@/app/actions";
import Link from "next/link";
import Image from "next/image";
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
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast({ variant: "destructive", title: "Invalid Mobile Number", description: "Please enter a valid 10-digit mobile number." });
      return;
    }
    setIsSubmittingPhone(true);
    const result = await sendPhoneOtp(cleanPhone, userRole);
    setIsSubmittingPhone(false);
    if (result.success) {
      setOtpSent(true);
      setIsNewUser(!!result.isNewUser);
      if (result.existingRole) setUserRole(result.existingRole as 'student' | 'teacher');
      toast({ title: "OTP Sent", description: result.message + (result.otpPreview ? ` (Demo OTP: ${result.otpPreview})` : '') });
    } else {
      toast({ variant: "destructive", title: "Failed to Send OTP", description: result.message });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({ variant: "destructive", title: "OTP Required", description: "Please enter the OTP received on your mobile." });
      return;
    }
    if (isNewUser && (!userName || userName.trim().length < 2)) {
      toast({ variant: "destructive", title: "Name Required", description: "Please enter your full name to complete registration." });
      return;
    }
    setIsSubmittingPhone(true);
    const result = await verifyPhoneOtpAndLogin({ phone, otp, role: userRole, name: isNewUser ? userName.trim() : undefined });
    setIsSubmittingPhone(false);
    if (result.success && result.user) {
      toast({ title: "Login Successful", description: `Welcome ${result.user.name || 'User'}!` });
      login(result.user as UserProfile);
      const redirectPath = result.user.role === 'admin' ? '/admin/dashboard' : `/${result.user.role}/dashboard`;
      router.push(redirectPath);
    } else {
      toast({ variant: "destructive", title: "Verification Failed", description: result.message });
    }
  };

  const handleEmailLogin = async (data: LoginValues) => {
    const result = await loginUser(data);
    if (result.success && result.user) {
      toast({ title: "Login Successful", description: "Welcome back!" });
      login(result.user as UserProfile);
      const redirectPath = result.user.role === 'admin' ? '/admin/dashboard' : `/${result.user.role}/dashboard`;
      router.push(redirectPath);
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: result.message });
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
        {/* Logo above card */}
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
            Welcome Back
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">Sign in to your student or teacher account.</p>
        </div>

        {/* Contact-style Card */}
        <Card className="shadow-none rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <CardContent className="p-0">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col overflow-hidden">
              
              {/* Role Tabs — styled as header row */}
              <div className="border-b border-slate-100 dark:border-slate-800">
                <Tabs value={userRole} onValueChange={(val) => { setUserRole(val as 'student' | 'teacher'); setOtpSent(false); setOtp(''); setPhone(''); }}>
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

              {/* Phone OTP Fields */}
              {authMethod === 'phone' ? (
                <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                  {!otpSent ? (
                    /* Step 1: Phone number input cell */
                    <div className="relative group h-full">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                        <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      </div>
                      <div className="absolute left-11 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 border-r border-slate-200 pr-3 pointer-events-none">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit mobile number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && phone.length === 10) {
                            e.preventDefault();
                            handleSendOtp(e);
                          }
                        }}
                        className="pl-[72px] h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 tracking-wider"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      {/* OTP Step: Phone display (non-editable cell) */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60">
                        <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          <span>OTP sent to <strong>+91 {phone}</strong></span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setOtpSent(false); setOtp(''); }}
                          className="text-[11px] text-primary hover:underline font-bold cursor-pointer"
                        >
                          Change
                        </button>
                      </div>

                      {/* New User: Name field */}
                      {isNewUser && (
                        <div className="relative group h-full">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input
                            type="text"
                            placeholder="Full Name * (Required for new users)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                            autoFocus
                            required
                          />
                        </div>
                      )}

                      {/* OTP input cell */}
                      <div className="relative group h-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                          <KeyRound className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP *"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.trim().slice(0, 6))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && otp.length >= 4) {
                              e.preventDefault();
                              handleVerifyOtp(e);
                            }
                          }}
                          className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] tracking-[0.4em] text-center transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 placeholder:tracking-normal"
                          autoFocus={!isNewUser}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Email login fields */
                <Form {...form}>
                  <div className="grid grid-cols-1 divide-y divide-slate-100">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <div className="relative group h-full">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input 
                            placeholder="Email Address *" 
                            {...field} 
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          />
                          <FormMessage className="text-[10px] px-4 pb-2" />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div className="relative group h-full">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input 
                            type="password"
                            placeholder="Password *" 
                            {...field} 
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          />
                          <FormMessage className="text-[10px] px-4 pb-2" />
                        </div>
                      )}
                    />
                  </div>
                </Form>
              )}

              {/* Footer: Submit Button (Contact-Us style) */}
              <div className="p-5 bg-slate-50 border-t border-slate-100">
                {authMethod === 'phone' ? (
                  !otpSent ? (
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSubmittingPhone || phone.length !== 10}
                      className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                    >
                      {isSubmittingPhone ? 'Sending OTP...' : 'Get OTP on Mobile'}
                      <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  ) : (
                    <div className="space-y-2.5">
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isSubmittingPhone || otp.length < 4}
                        className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                      >
                        {isSubmittingPhone ? 'Verifying...' : (isNewUser ? 'Register & Login' : 'Login to Dashboard')}
                        <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Resend OTP
                      </button>
                    </div>
                  )
                ) : (
                  <Button
                    type="button"
                    onClick={form.handleSubmit(handleEmailLogin)}
                    disabled={form.formState.isSubmitting}
                    className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                  >
                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign In with Email'}
                    <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                )}

                {/* Toggle auth method */}
                <div className="mt-3 text-center">
                  {authMethod === 'phone' ? (
                    <button
                      type="button"
                      onClick={() => setAuthMethod('email')}
                      className="text-[11px] text-slate-500 hover:text-primary font-semibold transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <span>Or login with Email & Password</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAuthMethod('phone')}
                      className="text-[11px] text-primary hover:underline font-bold transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Use Fast Mobile OTP Login</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <p className="text-center text-xs text-slate-500 mt-5">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
