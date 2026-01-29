
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Phone, Lock, Home, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { signUpStoreUser, loginStoreUser } from "@/app/actions/store-auth";
import { useStoreAuth, type StoreUserProfile } from "@/context/store-auth-context";
import { Suspense } from "react";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type SignupValues = z.infer<typeof signupSchema>;

const loginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  password: z.string().min(1, { message: "Password is required." }),
});
type LoginValues = z.infer<typeof loginSchema>;

function StoreAuthPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useStoreAuth();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('view') === 'signup' ? 'signup' : 'login';

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', mobile: '', password: '' },
  });

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: '', password: '' },
  });

  const handleSignup: SubmitHandler<SignupValues> = async (data) => {
    const result = await signUpStoreUser(data);

    if (result.success) {
      toast({
        title: "Account Created",
        description: "You have been successfully registered! Please log in.",
      });
      // You can switch to the login tab here if you have a way to control the Tabs component's value
    } else {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: result.message,
      });
    }
  };
  
  const handleLogin: SubmitHandler<LoginValues> = async (data) => {
    const result = await loginStoreUser(data);

    if (result.success && result.user) {
      toast({
        title: "Login Successful",
        description: "Welcome back to the IDL Store!",
      });
      login(result.user as StoreUserProfile);
      router.push('/store');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message,
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4 bg-white dark:bg-background overflow-y-auto">
        <Link href="/store" className="absolute top-4 right-4 z-20">
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </Link>
        <div className="relative z-10 container mx-auto py-12 md:px-[10%]">
             <div className="w-full max-w-lg mx-auto animate-fade-in-up">
                <Tabs defaultValue={defaultTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                      <Lock className="mr-2 h-4 w-4" /> Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background/80 backdrop-blur-sm rounded-t-lg rounded-b-none border-b-0 py-3">
                      <User className="mr-2 h-4 w-4" /> Signup
                    </TabsTrigger>
                  </TabsList>
                   <Card className="shadow-2xl rounded-t-none border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                    <TabsContent value="login" className="m-0">
                        <CardHeader className="text-center">
                          <CardTitle>Store Login</CardTitle>
                          <CardDescription>
                            Access your IDL Store account.
                          </CardDescription>
                        </CardHeader>
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                            <CardContent className="space-y-4">
                              <FormField
                                control={loginForm.control}
                                name="mobile"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Mobile Number" {...field} className="pl-9" type="tel" maxLength={10} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" placeholder="Password" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                            <CardFooter>
                              <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                                {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
                              </Button>
                            </CardFooter>
                          </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup" className="m-0">
                        <CardHeader className="text-center">
                          <CardTitle>Create Store Account</CardTitle>
                          <CardDescription>
                            Create an account to start shopping at the IDL Store.
                          </CardDescription>
                        </CardHeader>
                        <Form {...signupForm}>
                          <form onSubmit={signupForm.handleSubmit(handleSignup)}>
                            <CardContent className="space-y-4">
                                <FormField
                                control={signupForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Full Name" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={signupForm.control}
                                name="mobile"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Mobile Number" {...field} className="pl-9" type="tel" maxLength={10} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={signupForm.control}
                                name="password"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="password" placeholder="Password" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                             <CardFooter>
                              <Button type="submit" className="w-full" disabled={signupForm.formState.isSubmitting}>
                                {signupForm.formState.isSubmitting ? 'Creating Account...' : 'Sign Up'}
                              </Button>
                            </CardFooter>
                          </form>
                        </Form>
                    </TabsContent>
                   </Card>
                </Tabs>
            </div>
        </div>
    </div>
  );
}

export default function StoreAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoreAuthPageContent />
    </Suspense>
  )
}
