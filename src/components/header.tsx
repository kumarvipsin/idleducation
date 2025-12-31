
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText, ImageIcon, ShoppingCart, Plus, Minus, XCircle, FileType, Award, GraduationCap, X, ChevronDown, AlignJustify, ShoppingBag, HandHeart, HelpCircle, ArrowRight, UserCircle, MapPin } from "lucide-react";
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

const MegaMenu = ({ links, title, children }: { links?: { href: string; label: string; icon: React.ReactNode; target?: string }[], title: string, children?: React.ReactNode }) => (
    <div className="container mx-auto px-4 md:px-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {links && links.map((link) => (
                <Link key={link.href} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
                    <div className="bg-primary/10 text-primary p-2 rounded-md">
                        {link.icon}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-foreground">{link.label}</p>
                    </div>
                </Link>
            ))}
            {children}
        </div>
    </div>
  );

export function Header() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const { logout } = useAuth();
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

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const logoHref = "/";

  const handleMouseEnter = (menu: string) => {
    if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
        setActiveMenu(null);
    }, 200);
  };

  const renderAuthSection = () => {
    if (loading) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
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
        <Button asChild variant="ghost" className="h-8 w-8 rounded-full">
           <Link href="/login">
              <UserCircle />
           </Link>
         </Button>
    );
  };
  
  const navLinks = [
    { href: '/about', label: t('about'), icon: <Info className="h-4 w-4" /> },
    { href: '/contact', label: t('contact'), icon: <MessageSquare className="h-4 w-4" /> },
    { href: '/gallery', label: t('gallery'), icon: <ImageIcon className="h-4 w-4" /> },
    { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" /> },
    { href: "/idl-foundation", label: "IDL Foundation", icon: <HandHeart className="h-4 w-4" />, target: "_blank" },
  ];
  
  const applyForLinks = [
      { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" /> },
      { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" /> },
      { href: "/feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" /> },
      { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" /> },
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
    return (
      <div className="p-2 border-t">
        <Link
          href="/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogIn className="h-4 w-4" />
          {t('login')}
        </Link>
      </div>
    );
  };
  
  const notificationDropdown = (
    <DropdownMenu onOpenChange={handleNotificationOpenChange}>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Bell className="h-4 w-4" />
                {hasNewUpdates && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
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

  const headerClasses = cn(
    "sticky top-0 z-50 border-b transition-transform duration-300 h-16",
    show ? "translate-y-0" : "-translate-y-full",
    "bg-background/95 backdrop-blur-sm"
  );
  
  const megaMenuBg = "bg-background/95 backdrop-blur-sm";

  return (
    <>
      <Collapsible asChild open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <header className={cn(headerClasses, 'z-50')}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-16">
                <Link href={logoHref} className="flex items-center justify-center">
                  <Image src="/logo.png" alt="IDL Education Logo" width={40} height={40} className="h-10 w-auto" />
                  <div className="ml-2 flex flex-col leading-tight">
                      <span className={cn("text-lg font-black", isIdlFoundationPage ? "text-primary" : "text-primary")}>
                          {isIdlFoundationPage ? "IDL FOUNDATION" : brandName}
                      </span>
                      {!isIdlFoundationPage && <span className="text-[0.4rem] text-primary/80 tracking-wider -mt-1 font-black">
                        (Institute of Distance Learning Pvt. Ltd.)
                      </span>}
                  </div>
                </Link>
                <nav className="items-center hidden md:flex gap-x-4 h-full" onMouseLeave={handleMouseLeave}>
                      {!isIdlFoundationPage ? (
                        <>
                          <div onMouseEnter={() => handleMouseEnter('menu')} className="h-full flex items-center">
                            <Button variant="link" className="p-0 h-auto text-sm font-semibold text-foreground hover:text-primary hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                                Menu
                            </Button>
                          </div>
                          <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center">
                            <Button variant="link" className="p-0 h-auto text-sm font-semibold text-foreground hover:text-primary hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                              Apply For
                            </Button>
                          </div>
                           <div className="h-full flex items-center">
                            <Button asChild variant="link" className="p-0 h-auto text-sm font-semibold text-foreground hover:text-primary hover:no-underline focus-visible:ring-0 focus-visible:ring-offset-0">
                              <Link href="/store" target="_blank" rel="noopener noreferrer">
                                IDL Store
                              </Link>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-x-4 text-sm font-semibold">
                          <a href="tel:7011117585" className="flex items-center gap-1 hover:text-primary"><Phone className="h-4 w-4" /> 7011117585</a>
                          <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                          <a href="mailto:info@idlfoundation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-4 w-4" /> info@idlfoundation.in</a>
                        </div>
                      )}
                  </nav>
                 <div className="ml-auto flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <p className="text-xs font-semibold hidden lg:block">
                      Call now<br/>
                      <span className="font-bold text-primary">1800-102-2727</span>
                    </p>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MapPin className="h-4 w-4" />
                    </Button>
                    {renderAuthSection()}
                    {!isIdlFoundationPage && notificationDropdown}
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("text-foreground hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground h-8 w-8 md:hidden")}>
                        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <AlignJustify className="h-4 w-4" />}
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
            </div>
             <CollapsibleContent asChild>
                <div className={cn(
                    "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down md:hidden",
                    "duration-200"
                )}>
                    <div className="border-t bg-background">
                        {!isIdlFoundationPage && (
                        <div className="p-2">
                            <nav className="grid gap-1">
                                <Collapsible>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                                    <span className="flex items-center gap-3"><Menu className="h-4 w-4" /> Menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-8">
                                    {navLinks.map(({ href, label, icon, target }) => (
                                        <Link key={href} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                                            {icon}
                                            {label}
                                        </Link>
                                    ))}
                                </CollapsibleContent>
                                </Collapsible>
                                <Collapsible>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                                    <span className="flex items-center gap-3"><UserCircle className="h-4 w-4" /> Apply For</span>
                                    <ChevronDown className="h-4 w-4" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="pl-8">
                                    {applyForLinks.map(({ href, label, icon }) => (
                                    <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                                        {icon}
                                        {label}
                                    </Link>
                                    ))}
                                </CollapsibleContent>
                                </Collapsible>
                            </nav>
                        </div>
                        )}
                        {renderMobileAuthSection()}
                    </div>
                </div>
            </CollapsibleContent>
        </header>
      </Collapsible>
       <div 
        onMouseEnter={() => handleMouseEnter(activeMenu || '')} 
        onMouseLeave={handleMouseLeave} 
        className={cn(
          "fixed top-16 left-0 w-full z-40 transition-all duration-300 ease-in-out",
          activeMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className={cn("absolute inset-x-0 top-0", megaMenuBg)}>
          <div className="pt-2 pb-4">
            {activeMenu === 'menu' && <MegaMenu links={navLinks} title="Main Menu" />}
            {activeMenu === 'apply' && <MegaMenu links={applyForLinks} title="Apply For" />}
          </div>
        </div>
      </div>
    </>
  );
}
