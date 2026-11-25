'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions";
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

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleEmailLogin = async (data: LoginValues) => {
    const getRedirectTarget = (profile: UserProfile | null) => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect');
        if (redirectParam && redirectParam.startsWith('/')) {
          return redirectParam;
        }
      }
      if (profile?.role === 'admin') {
        return '/admin/dashboard';
      }
      return profile?.role ? `/${profile.role}/dashboard` : '/';
    };

    const result = await loginUser(data);
    if (result.success && result.user) {
      toast({ title: "Login Successful", description: "Welcome back!" });
      login(result.user as UserProfile);
      router.push(getRedirectTarget(result.user as UserProfile));
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
          <p className="text-xs text-muted-foreground font-semibold mt-1">Sign in with your email and password.</p>
        </div>

        {/* Contact-style Card */}
        <Card className="shadow-none rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <CardContent className="p-0">
            <Form {...form}>
              <form noValidate onSubmit={form.handleSubmit(handleEmailLogin)} className="flex flex-col overflow-hidden">
                {/* Email & Password login fields */}
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
                          type="email"
                          autoComplete="email"
                          enterKeyHint="next"
                          placeholder="Email Address *"
                          autoFocus
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              void form.handleSubmit(handleEmailLogin)();
                            }
                          }}
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
                          autoComplete="current-password"
                          enterKeyHint="go"
                          placeholder="Password *"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              void form.handleSubmit(handleEmailLogin)();
                            }
                          }}
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
                    disabled={form.formState.isSubmitting}
                    className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-none transition-all active:scale-[0.98] group uppercase cursor-pointer"
                  >
                    {form.formState.isSubmitting ? 'Signing in...' : 'Sign In with Email'}
                    <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <p className="text-center text-xs text-slate-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
