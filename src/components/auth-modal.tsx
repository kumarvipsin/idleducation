'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, GraduationCap, Briefcase, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { loginUser, signUpUser } from "@/app/actions";
import Image from "next/image";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().trim().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onOpenChange, defaultMode = 'login' }: AuthModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [emailMode, setEmailMode] = useState<'login' | 'signup'>(defaultMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEmailMode(defaultMode);
    setErrors({});
  }, [defaultMode, isOpen]);

  const submitForm = async () => {
    if (isSubmitting) return;

    if (emailMode === 'login') {
      const parsed = loginSchema.safeParse({ email, password });
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      try {
        const result = await loginUser(parsed.data);

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
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const parsed = signupSchema.safeParse({ name, email, password });
      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        setErrors({
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        return;
      }

      setErrors({});
      setIsSubmitting(true);
      try {
        const result = await signUpUser({ ...parsed.data, role: userRole });

        if (result.success) {
          toast({
            title: "Account Created",
            description: "Please sign in with your credentials.",
          });
          setName('');
          setPassword('');
          setEmailMode('login');
        } else {
          toast({
            variant: "destructive",
            title: "Signup Failed",
            description: result.message,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitForm();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void submitForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <FormModalDialogContent
        maxWidthClass="max-w-[390px] sm:max-w-[410px]"
        className="p-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Student &amp; Teacher Authentication</DialogTitle>

        {/* Top IDL Logo */}
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

        {/* Role Tabs */}
        <div className="border-y border-slate-100 dark:border-slate-800">
          <Tabs value={userRole} onValueChange={(val) => setUserRole(val as 'student' | 'teacher')}>
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

        {/* Main Content Area: Email Auth Only */}
        <div className="p-4 sm:p-5 flex flex-col">
          <form noValidate onSubmit={handleFormSubmit} className="space-y-3">
            {emailMode === 'signup' && (
              <div>
                <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                  <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <Input
                    type="text"
                    name="name"
                    autoComplete="name"
                    enterKeyHint="next"
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    onKeyDown={handleInputKeyDown}
                    className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1 px-1">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-medium text-rose-500 mt-1 px-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl focus-within:border-[#102A68] dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-[#102A68]/15 transition-all h-12 group">
                <div className="pl-3.5 pr-2 pointer-events-none shrink-0">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#102A68] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <Input
                  type="password"
                  name="password"
                  autoComplete={emailMode === 'login' ? 'current-password' : 'new-password'}
                  enterKeyHint="go"
                  placeholder={emailMode === 'login' ? "Password *" : "Create Password (min 6 chars) *"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="h-full flex-1 bg-transparent border-0 rounded-none font-semibold text-[13px] text-slate-900 dark:text-white px-2 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                />
              </div>
              {errors.password && (
                <p className="text-[11px] font-medium text-rose-500 mt-1 px-1">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-[12px] font-bold bg-[#102A68] hover:bg-[#0c2255] text-white rounded-[8px] shadow-sm shadow-[#102A68]/20 transition-all active:scale-[0.98] uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting
                ? (emailMode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...')
                : (emailMode === 'login' ? 'SIGN IN WITH EMAIL' : 'CREATE ACCOUNT')}
              <ArrowRight className="h-4 w-4 ml-0.5" />
            </Button>

            <div className="text-center pt-1">
              {emailMode === 'login' ? (
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('signup');
                    setErrors({});
                  }}
                  className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#102A68] dark:hover:text-blue-400 font-bold cursor-pointer"
                >
                  Don&apos;t have an account? <span className="text-[#102A68] dark:text-blue-400 underline">Signup</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEmailMode('login');
                    setErrors({});
                  }}
                  className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#102A68] dark:hover:text-blue-400 font-bold cursor-pointer"
                >
                  Have an account? <span className="text-[#102A68] dark:text-blue-400 underline">Signin</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </FormModalDialogContent>
    </Dialog>
  );
}
