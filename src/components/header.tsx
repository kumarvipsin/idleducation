
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText, Image as ImageIcon, ShoppingCart, Plus, Minus, XCircle, FileType, Award, GraduationCap, X, ChevronDown, AlignJustify, ShoppingBag, HandHeart } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState, useCallback, useRef } from "react";
import { getUpdates, registerForScholarship } from "@/app/actions";
import { formatDistanceToNow } from 'date-fns';
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/cart-context";
import { GcsImage } from "./gcs-image";

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
const scholarshipClasses = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export function Header({ isIdlFoundationPage: isIdlFoundationPageProp = false }: { isIdlFoundationPage?: boolean }) {
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const brandName = "IDL EDUCATION";
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isScholarshipDialogOpen, setIsScholarshipDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isIdlFoundationPage = pathname === '/idl-foundation';
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 80) { // if scroll down hide the navbar
        setShow(false);
      } else { // if scroll up show the navbar
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);
  
  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: { studentName: '', class: '', mobile: '' },
  });
  
  const onScholarshipSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
    const result = await registerForScholarship(data as any);
    if (result.success) {
      toast({
        title: "Registration Successful",
        description: result.message,
      });
      form.reset();
      setIsScholarshipDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.message,
      });
    }
  };


  useEffect(() => {
    const fetchUpdates = async () => {
      const result = await getUpdates(3);
      if (result.success && result.data) {
        const fetchedUpdates = result.data as Update[];
        setUpdates(fetchedUpdates);

        if (fetchedUpdates.length > 0) {
          const lastChecked = localStorage.getItem('lastCheckedUpdate');
          const latestUpdateTimestamp = new Date(fetchedUpdates[0].createdAt).getTime();
          
          if (!lastChecked || latestUpdateTimestamp > parseInt(lastChecked, 10)) {
            setHasNewUpdates(true);
          }
        }
      }
    };
    if (!isIdlFoundationPage) {
        fetchUpdates();
    }
  }, [isIdlFoundationPage]);
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleNotificationOpenChange = (open: boolean) => {
    if (open) {
      localStorage.setItem('lastCheckedUpdate', Date.now().toString());
      setHasNewUpdates(false);
    }
  };

  const getDashboardPath = (user: UserProfile | null) => {
    if (!user || !user.role) return '/';
    return user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/dashboard`;
  };
  
  const getProfilePath = (user: UserProfile | null) => {
    if (!user || !user.role) return '/';
    return `/${user.role}/profile`;
  }

  const logoHref = '/';

  const renderAuthSection = () => {
    if (loading) {
      return <Skeleton className="h-7 w-7 rounded-full" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-7 w-7 rounded-full">
              <Avatar className="h-7 w-7">
                 <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link href={getDashboardPath(user)}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={getProfilePath(user)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
        <Button asChild variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
           <Link href="/login">
              <span className="sm:inline">{t('login')}</span>
           </Link>
         </Button>
    );
  };
  
  const navLinks = [
    { href: '/about', label: t('about'), icon: <Info className="h-4 w-4" /> },
    { href: '/contact', label: t('contact'), icon: <MessageSquare className="h-4 w-4" /> },
    { href: '/gallery', label: t('gallery'), icon: <ImageIcon className="h-4 w-4" /> },
    { href: "/idl-foundation", label: "IDL Foundation", icon: <HandHeart className="h-4 w-4" /> },
  ];

  const loggedInNavLinks = [
    { href: getDashboardPath(user), label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: getProfilePath(user), label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  const renderMobileAuthSection = () => {
    if (loading) {
        return (
            <div className="flex items-center gap-3 p-2 border-t">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="w-full space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        );
    }
    if (user) {
      return (
        <div className="p-2 border-t">
          <div className="flex items-center gap-3 mb-2 p-2 rounded-md bg-muted/50">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
              <AvatarFallback>
                {user.name ? user.name.charAt(0).toUpperCase() : <User />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-1">
            {loggedInNavLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted ${pathname === href ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {icon}
                {label}
              </Link>
            ))}
            <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const notificationDropdown = (
    <DropdownMenu onOpenChange={handleNotificationOpenChange}>
        <DropdownMenuTrigger asChild>
            <Button variant="link" className="relative h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                <Bell className="h-3 w-3" />
                {hasNewUpdates && (
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {updates.length}
                    </span>
                )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent Updates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {updates.length > 0 ? (
            updates.map(update => (
                <DropdownMenuItem key={update.id} className="group flex flex-col items-start gap-1 focus:bg-accent data-[highlighted]:text-accent-foreground">
                    <p className="font-semibold">{update.title}</p>
                    <p className="text-xs text-muted-foreground group-data-[highlighted]:text-accent-foreground">{update.description}</p>
                    <p className="text-xs text-muted-foreground self-end group-data-[highlighted]:text-accent-foreground">
                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                    </p>
                </DropdownMenuItem>
            ))
            ) : (
            <DropdownMenuItem>No new updates.</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
            <Link href="/notifications" className="text-center justify-center">
                View all notifications
            </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  
  if (!isClient) {
    return (
        <header className="sticky top-0 z-50 bg-[#F5F5F7] dark:bg-gray-900 border-b h-12 rounded-t-2xl">
            
        </header>
    );
  }

  return (
    <Collapsible asChild open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <header className={cn(
        "sticky top-0 z-50 border-b transition-transform duration-300 h-12",
        show ? "translate-y-0" : "-translate-y-full",
        isIdlFoundationPage ? "bg-background text-foreground" : "bg-[#F5F5F7]/80 dark:bg-gray-900/80 backdrop-blur-sm"
      )}>
          <div className="container mx-auto px-4 md:px-[10%] flex justify-between items-center h-12">
              <Link href={logoHref} className="flex items-center justify-center">
                <Image src="/logo.png" alt="IDL Education Logo" width={24} height={24} className="h-6 w-auto" />
                <div className="ml-1.5 flex flex-col leading-tight">
                    <span className={cn("text-sm font-bold", isIdlFoundationPage ? "text-primary" : "text-primary")}>
                        {isIdlFoundationPage ? "IDL FOUNDATION" : brandName}
                    </span>
                    {!isIdlFoundationPage && <span className="text-[0.4rem] text-primary/80 tracking-wider -mt-1">
                      (Institute of Distance Learning Pvt. Ltd.)
                    </span>}
                </div>
              </Link>
              <div className={cn("items-center hidden md:flex gap-x-1.5 md:gap-x-2")}>
                  {!isIdlFoundationPage ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                                    Menu
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {navLinks.map(({ href, label }) => (
                                    <DropdownMenuItem asChild key={href}>
                                        <Link href={href}>{label}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                                    <span className="sm:inline">APPLY FOR</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href="/scholarship">Apply Scholarship</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem asChild>
                                    <Link href="/admission">Admission Form</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem asChild>
                                    <Link href="/book-demo">Book Free Demo</Link>
                                </DropdownMenuItem>
                                 <DropdownMenuItem asChild>
                                    <Link href="/feedback">Feedback</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/student-enquiry">Student Enquiry</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                   <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                   <Button asChild variant="link" className="h-auto p-0 text-foreground font-semibold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Link href="/store">
                      IDL Store
                    </Link>
                  </Button>
                  <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                  {renderAuthSection()}
                  <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                  {notificationDropdown}
                    </>
                  ) : (
                    <div className="flex items-center gap-x-4 text-xs font-semibold text-foreground">
                      <a href="tel:7011117585" className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> 7011117585</a>
                      <Separator orientation="vertical" className="h-3 bg-foreground/20" />
                      <a href="mailto:info@idlfoundation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> info@idlfoundation.in</a>
                    </div>
                  )}
              </div>
               <div className="ml-auto md:hidden flex items-center gap-2">
                  {!isIdlFoundationPage && (
                    <>
                    <Link href="/store" className='text-foreground'>
                        <ShoppingBag className="h-4 w-4" />
                        <span className="sr-only">IDL Store</span>
                    </Link>
                    {notificationDropdown}
                    </>
                  )}
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className={cn("text-foreground hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground h-7 w-7")}>
                      {isMobileMenuOpen ? <X className="h-4 w-4" /> : <AlignJustify className="h-4 w-4" />}
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
          </div>
          <CollapsibleContent asChild>
            <div className={cn(
              "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down md:hidden", "duration-200"
            )}>
              <div className={cn("border-t bg-background")}>
                {!isIdlFoundationPage && (
                  <div className="p-2">
                    <nav className="grid grid-cols-3 gap-1 text-base font-medium">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-auto p-2 text-gray-800 dark:text-gray-300 font-bold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0 flex flex-col gap-1">
                                  Menu
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                              {navLinks.map(({ href, label }) => (
                                  <DropdownMenuItem asChild key={href}>
                                      <Link href={href} onClick={() => setIsMobileMenuOpen(false)}>{label}</Link>
                                  </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-auto p-2 text-gray-800 dark:text-gray-300 font-bold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0 flex flex-col gap-1">
                                  APPLY FOR
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                              <DropdownMenuItem asChild>
                                  <Link href="/scholarship" onClick={() => setIsMobileMenuOpen(false)}>Apply Scholarship</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                  <Link href="/admission" onClick={() => setIsMobileMenuOpen(false)}>Admission Form</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                  <Link href="/book-demo" onClick={() => setIsMobileMenuOpen(false)}>Book Free Demo</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                  <Link href="/feedback" onClick={() => setIsMobileMenuOpen(false)}>Feedback</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                  <Link href="/student-enquiry" onClick={() => setIsMobileMenuOpen(false)}>Student Enquiry</Link>
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      <Button asChild variant="ghost" className="h-auto p-2 text-gray-800 dark:text-gray-300 font-bold text-[0.6rem] uppercase hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0 flex flex-col gap-1">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="sm:inline">{t('login')}</span>
                      </Link>
                      </Button>
                    </nav>
                  </div>
                )}
                {renderMobileAuthSection()}
              </div>
            </div>
          </CollapsibleContent>
      </header>
    </Collapsible>
  );
}
