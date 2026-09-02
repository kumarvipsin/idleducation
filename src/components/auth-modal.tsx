'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, KeyRound, Mail, Lock, GraduationCap, 
  Briefcase, RotateCcw, ChevronDown, User, Send 
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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()} 
        className="w-[94vw] max-w-[420px] p-0 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-none focus:outline-hidden"
      >
        <DialogTitle className="sr-only">Student & Teacher Authentication</DialogTitle>
        
        {/* Top Logo */}
        <div className="pt-6 pb-4 text-center">
          <Image 
            src="/idllogo.png" 
            alt="IDL Education Logo" 
            width={160} 
            height={46} 
            className="h-10 w-auto object-contain mx-auto" 
            priority
          />
        </div>

        {/* Role Tabs */}
        <div className="border-t border-b border-slate-100 dark:border-slate-800">
          <Tabs value={userRole} onValueChange={handleRoleChange}>
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

        {/* Main Content Area (Contact Us divided inputs style) */}
        <div className="flex flex-col overflow-hidden">
          {authMethod === 'phone' ? (
            <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
              {!otpSent ? (
                /* Phone input cell */
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
                        handleSendOtp();
                      }
                    }}
                    className="pl-[72px] h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 tracking-wider"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  {/* Sent Phone Notification Row */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70">
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

                  {/* 1st time registration: Name input cell */}
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
                          handleVerifyOtp();
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
            /* Email Auth Cells */
            <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
              {emailMode === 'signup' && (
                <div className="relative group h-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input 
                    placeholder="Full Name *" 
                    value={signupForm.watch('name')}
                    onChange={(e) => signupForm.setValue('name', e.target.value)}
                    className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                  />
                </div>
              )}
              <div className="relative group h-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  type="email"
                  placeholder="Email Address *" 
                  value={emailMode === 'login' ? loginForm.watch('email') : signupForm.watch('email')}
                  onChange={(e) => {
                    if (emailMode === 'login') loginForm.setValue('email', e.target.value);
                    else signupForm.setValue('email', e.target.value);
                  }}
                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>
              <div className="relative group h-full">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  type="password"
                  placeholder={emailMode === 'login' ? "Password *" : "Create Password (min 6 chars) *"} 
                  value={emailMode === 'login' ? loginForm.watch('password') : signupForm.watch('password')}
                  onChange={(e) => {
                    if (emailMode === 'login') loginForm.setValue('password', e.target.value);
                    else signupForm.setValue('password', e.target.value);
                  }}
                  className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Footer / Submit Button (Contact Us Card Style) */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            {authMethod === 'phone' ? (
              !otpSent ? (
                <Button 
                  type="button" 
                  onClick={() => handleSendOtp()}
                  className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer" 
                  disabled={isSubmittingPhone || phone.length !== 10}
                >
                  {isSubmittingPhone ? 'SENDING OTP...' : 'GET OTP ON MOBILE'}
                  <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              ) : (
                <div className="space-y-2.5">
                  <Button 
                    type="button" 
                    onClick={() => handleVerifyOtp()}
                    className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer" 
                    disabled={isSubmittingPhone || otp.length < 4}
                  >
                    {isSubmittingPhone ? 'VERIFYING...' : (isNewUser ? 'REGISTER & LOGIN' : 'LOGIN TO DASHBOARD')}
                    <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Resend OTP
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-2.5">
                <Button 
                  type="button" 
                  onClick={() => {
                    if (emailMode === 'login') loginForm.handleSubmit(handleEmailLogin)();
                    else signupForm.handleSubmit(handleEmailSignup)();
                  }}
                  className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer" 
                >
                  {emailMode === 'login' ? 'SIGN IN WITH EMAIL' : 'CREATE ACCOUNT'}
                  <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>

                <div className="text-center">
                  {emailMode === 'login' ? (
                    <button 
                      type="button" 
                      onClick={() => setEmailMode('signup')}
                      className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-primary font-bold cursor-pointer"
                    >
                      Don't have email account? <span className="text-primary underline">Signup</span>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => setEmailMode('login')}
                      className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-primary font-bold cursor-pointer"
                    >
                      Have an account? <span className="text-primary underline">Signin</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Toggle auth method */}
            <div className="mt-3 text-center">
              {authMethod === 'phone' ? (
                <button 
                  type="button"
                  onClick={() => setAuthMethod('email')} 
                  className="text-[11px] text-slate-500 hover:text-primary font-semibold transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>Or use Email & Password</span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
