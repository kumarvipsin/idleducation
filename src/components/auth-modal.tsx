'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, KeyRound, Mail, Lock, GraduationCap, 
  Briefcase, RotateCcw, ChevronDown, User, Send, ArrowRight 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser, signUpUser, sendPhoneOtp, verifyPhoneOtpAndLogin } from "@/app/actions";
import Image from "next/image";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onOpenChange, defaultMode = 'login' }: AuthModalProps) {
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

  // Email form state
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>(defaultMode);

  useEffect(() => {
    setEmailMode(defaultMode);
  }, [defaultMode]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  // Handle Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast({
        variant: "destructive",
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    setIsSubmittingPhone(true);
    const result = await sendPhoneOtp(cleanPhone, userRole);
    setIsSubmittingPhone(false);

    if (result.success) {
      setOtpSent(true);
      setIsNewUser(!!result.isNewUser);
      if (result.existingRole) {
        setUserRole(result.existingRole as 'student' | 'teacher');
      }
      toast({
        title: "OTP Sent",
        description: result.message + (result.otpPreview ? ` (Demo OTP: ${result.otpPreview})` : ''),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: result.message,
      });
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      toast({
        variant: "destructive",
        title: "OTP Required",
        description: "Please enter the OTP received on your mobile.",
      });
      return;
    }

    // If 1st time registration, Name is mandatory
    if (isNewUser && (!userName || userName.trim().length < 2)) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter your full name to complete registration.",
      });
      return;
    }

    setIsSubmittingPhone(true);
    const result = await verifyPhoneOtpAndLogin({
      phone,
      otp,
      role: userRole,
      name: isNewUser ? userName.trim() : undefined,
    });
    setIsSubmittingPhone(false);

    if (result.success && result.user) {
      toast({
        title: "Login Successful",
        description: `Welcome ${result.user.name || 'User'}!`,
      });

      login(result.user as UserProfile);
      onOpenChange(false);

      const redirectPath = result.user.role === 'admin' 
        ? '/admin/dashboard' 
        : `/${result.user.role}/dashboard`;
        
      router.push(redirectPath);
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.message,
      });
    }
  };

  // Handle Traditional Email Login
  const handleEmailLogin = async (data: LoginValues) => {
    const result = await loginUser(data);

    if (result.success && result.user) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      login(result.user as UserProfile);
      onOpenChange(false);

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

  // Handle Traditional Email Signup
  const handleEmailSignup: SubmitHandler<SignupValues> = async (data) => {
    const result = await signUpUser({ ...data, role: userRole });

    if (result.success) {
      toast({
        title: "Account Created",
        description: "Please sign in with your credentials.",
      });
      signupForm.reset();
      setEmailMode('login');
      loginForm.setValue('email', data.email);
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.message,
      });
    }
  };

  const handleRoleChange = (val: string) => {
    setUserRole(val as 'student' | 'teacher');
    setOtpSent(false);
    setOtp('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <FormModalDialogContent 
        maxWidthClass="max-w-[390px] sm:max-w-[410px]"
        className="p-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Student & Teacher Authentication</DialogTitle>
        
        {/* Top IDL Logo: Refined size proportional to header, tighter spacing */}
        <div className="pt-5 pb-3 text-center">
          <Image 
            src="/idllogo.png" 
            alt="IDL Education Logo" 
            width={160} 
            height={48} 
            className="h-11 sm:h-12 w-auto object-contain mx-auto" 
            priority
          />
        </div>

        {/* Role Tabs: Equal width, refined active/inactive hierarchy */}
        <div className="border-y border-slate-100 dark:border-slate-800">
          <Tabs value={userRole} onValueChange={handleRoleChange}>
            <TabsList className="grid w-full grid-cols-2 p-0 bg-transparent h-11 sm:h-12 rounded-none">
              <TabsTrigger 
                value="student" 
                className="rounded-none bg-transparent data-[state=active]:bg-[#102A68]/[0.04] data-[state=active]:text-[#102A68] dark:data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:border-b-2 data-[state=active]:border-[#102A68] dark:data-[state=active]:border-blue-400 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 h-full cursor-pointer border-b-2 border-transparent transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 shrink-0" /> Student
              </TabsTrigger>
              <TabsTrigger 
                value="teacher" 
                className="rounded-none bg-transparent data-[state=active]:bg-[#102A68]/[0.04] data-[state=active]:text-[#102A68] dark:data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:border-b-2 data-[state=active]:border-[#102A68] dark:data-[state=active]:border-blue-400 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-600 h-full cursor-pointer border-b-2 border-transparent transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 mr-1.5 shrink-0" /> Teacher
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Area: Compact, defined interactive inputs */}
        <div className="p-4 sm:p-5 flex flex-col">
          {authMethod === 'phone' ? (
            !otpSent ? (
              /* Phone input & CTA */
              <div className="space-y-3.5">
                <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 sm:h-12.5 group">
                  <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pr-2.5 border-r border-slate-200 dark:border-slate-700 select-none">
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone.length === 10) {
                        e.preventDefault();
                        handleSendOtp();
                      }
                    }}
                    className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13.5px] text-slate-900 dark:text-white px-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 tracking-wider"
                    autoFocus={false}
                  />
                </div>

                <Button 
                  type="button" 
                  onClick={() => handleSendOtp()}
                  disabled={isSubmittingPhone || phone.length !== 10}
                  className={cn(
                    "w-full h-12 text-[12px] font-bold rounded-[8px] transition-all duration-200 flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer",
                    phone.length === 10 && !isSubmittingPhone
                      ? "bg-[#102A68] hover:bg-[#0c2255] text-white shadow-sm shadow-[#102A68]/20 active:scale-[0.99]"
                      : "bg-[#102A68]/50 hover:bg-[#102A68]/50 text-white/85 cursor-not-allowed"
                  )}
                >
                  {isSubmittingPhone ? 'SENDING OTP...' : 'GET OTP ON MOBILE'}
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            ) : (
              /* OTP Verification View */
              <div className="space-y-3.5">
                {/* Sent Phone Notification Row */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-300 font-medium">
                    <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400 shrink-0" />
                    <span>OTP sent to <strong>+91 {phone}</strong></span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-[11px] text-[#102A68] dark:text-blue-400 hover:underline font-bold cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* 1st time registration: Name input */}
                {isNewUser && (
                  <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                    <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                      <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Full Name * (Required for new users)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                      autoFocus={false}
                      required
                    />
                  </div>
                )}

                {/* OTP input */}
                <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                  <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                    <KeyRound className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP *"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim().slice(0, 6))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && otp.length >= 4) {
                        e.preventDefault();
                        handleVerifyOtp();
                      }
                    }}
                    className="h-full flex-1 bg-transparent border-0 rounded-none font-bold text-[13.5px] tracking-[0.35em] text-center text-slate-900 dark:text-white pr-9 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 placeholder:tracking-normal"
                    autoFocus={false}
                  />
                </div>

                <Button 
                  type="button" 
                  onClick={() => handleVerifyOtp()}
                  disabled={isSubmittingPhone || otp.length < 4}
                  className={cn(
                    "w-full h-12 text-[12px] font-bold rounded-[8px] transition-all duration-200 flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer",
                    otp.length >= 4 && !isSubmittingPhone
                      ? "bg-[#102A68] hover:bg-[#0c2255] text-white shadow-sm shadow-[#102A68]/20 active:scale-[0.99]"
                      : "bg-[#102A68]/50 hover:bg-[#102A68]/50 text-white/85 cursor-not-allowed"
                  )}
                >
                  {isSubmittingPhone ? 'VERIFYING...' : (isNewUser ? 'REGISTER & LOGIN' : 'LOGIN TO DASHBOARD')}
                  <ArrowRight className="h-4 w-4 ml-0.5" />
                </Button>

                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-[11px] font-semibold text-slate-500 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer pt-1"
                >
                  <RotateCcw className="w-3 h-3" /> Resend OTP
                </button>
              </div>
            )
          ) : (
            /* Email Auth View */
            <div className="space-y-3">
              {emailMode === 'signup' && (
                <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                  <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input 
                    placeholder="Full Name *" 
                    value={signupForm.watch('name')}
                    onChange={(e) => signupForm.setValue('name', e.target.value)}
                    className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                  />
                </div>
              )}
              <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <Input 
                  type="email"
                  placeholder="Email Address *" 
                  value={emailMode === 'login' ? loginForm.watch('email') : signupForm.watch('email')}
                  onChange={(e) => {
                    if (emailMode === 'login') loginForm.setValue('email', e.target.value);
                    else signupForm.setValue('email', e.target.value);
                  }}
                  className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>
              <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <Input 
                  type="password"
                  placeholder={emailMode === 'login' ? "Password *" : "Create Password (min 6 chars) *"} 
                  value={emailMode === 'login' ? loginForm.watch('password') : signupForm.watch('password')}
                  onChange={(e) => {
                    if (emailMode === 'login') loginForm.setValue('password', e.target.value);
                    else signupForm.setValue('password', e.target.value);
                  }}
                  className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>

              <Button 
                type="button" 
                onClick={() => {
                  if (emailMode === 'login') loginForm.handleSubmit(handleEmailLogin)();
                  else signupForm.handleSubmit(handleEmailSignup)();
                }}
                className="w-full h-12 text-[12px] font-bold bg-[#102A68] hover:bg-[#0c2255] text-white rounded-[8px] shadow-sm shadow-[#102A68]/20 transition-all active:scale-[0.98] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5" 
              >
                {emailMode === 'login' ? 'SIGN IN WITH EMAIL' : 'CREATE ACCOUNT'}
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Button>

              <div className="text-center pt-1">
                {emailMode === 'login' ? (
                  <button 
                    type="button" 
                    onClick={() => setEmailMode('signup')}
                    className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#102A68] dark:hover:text-blue-400 font-bold cursor-pointer"
                  >
                    Don't have email account? <span className="text-[#102A68] dark:text-blue-400 underline">Signup</span>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setEmailMode('login')}
                    className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#102A68] dark:hover:text-blue-400 font-bold cursor-pointer"
                  >
                    Have an account? <span className="text-[#102A68] dark:text-blue-400 underline">Signin</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Toggle auth method: Clearly secondary action */}
          <div className="mt-4 pt-1 text-center">
            {authMethod === 'phone' ? (
              <button 
                type="button" 
                onClick={() => setAuthMethod('email')} 
                className="text-[12px] text-slate-500 hover:text-[#102A68] dark:text-slate-400 dark:hover:text-white font-medium transition-colors inline-flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Or use Email & Password</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setAuthMethod('phone')} 
                className="text-[12px] text-[#102A68] dark:text-blue-400 hover:underline font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Use Fast Mobile OTP Login</span>
              </button>
            )}
          </div>
        </div>
      </FormModalDialogContent>
    </Dialog>
  );
}
