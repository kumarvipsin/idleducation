'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText, ImageIcon, ShoppingCart, Plus, Minus, XCircle, FileType, Award, GraduationCap, X, ChevronDown, AlignJustify, ShoppingBag, HandHeart, HelpCircle, ArrowRight, UserCircle, UserPlus, MapPin, LifeBuoy, CalendarClock, ScreenShare, FileJson, Star, Search, ToyBrick, Book, Sun, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
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
import { allPrograms, schoolPrograms, competitivePrograms } from "@/lib/courses";
import { ScrollArea } from "./ui/scroll-area";

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

const CoursesMegaMenu = () => {
    const { t } = useLanguage();

      const findByTarget = [
        { name: "School tuition", description: "For Class 3-12", href: "/school" },
      ];

      const applicationLinks = [
        { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" />, description: "Start your journey with us by filling out the admission form." },
        { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, description: "Experience our teaching style with a free demo class." },
        { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, description: "Have questions? Send us an enquiry." },
        { href: "/feedback", label: "Feedback Form", icon: <MessageSquare className="h-4 w-4" />, description: "Share your valuable feedback to help us improve." },
      ];

      const exploreLinks = [
        { label: "IDL Foundation", href: "/idl-foundation", target: "_blank", icon: <HandHeart className="h-4 w-4" />, description: "Support our cause and make a difference." },
        { label: "Volunteer", href: "/volunteer", icon: <HandHeart className="h-4 w-4" />, description: "Join our team of volunteers and contribute to our mission." },
        { label: "Gallery", href: "/gallery", icon: <ImageIcon className="h-4 w-4" />, description: "Explore moments from our journey." },
        { label: "IDL Blog", href: "/blog", icon: <FileText className="h-4 w-4" />, description: "Read articles and updates from our team." },
      ];

      const leftColumnLinks = [
        {
          icon: <CalendarClock className="h-5 w-5 text-red-500" />,
          title: "Long Term Courses",
          description: "Guaranteed improvement in marks or get your fees back",
          href: "#",
        },
        {
          icon: <ScreenShare className="h-5 w-5 text-blue-500" />,
          title: "One-to-one LIVE classes",
          description: "Learn one-to-one with a teacher for a personalised experience",
          href: "#",
        },
        {
          icon: <FileJson className="h-5 w-5 text-yellow-500" />,
          title: "Topic specific courses",
          description: "Master any topic at just ₹1",
          href: "#",
        },
      ];
    
      const coursesForKids = [
        {
          icon: <ToyBrick className="h-6 w-6 text-purple-500" />,
          title: "English Superstar",
          age: "Age 4-8",
          description: "Level based holistic English program",
          href: "#",
        },
        {
          icon: <Sun className="h-6 w-6 text-orange-500" />,
          title: "Summer Camp",
          age: "For Lkg - Grade 10",
          description: "Limited-time summer learning experience",
          href: "#",
        },
        {
          icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
          title: "Spoken English",
          age: "Class 3 - 5",
          description: "See your child speak fluently",
          href: "#",
        },
        {
          icon: <Book className="h-6 w-6 text-green-500" />,
          title: "Learn Maths",
          age: "Class 1 and 2",
          description: "Build a strong foundation in mathematics",
          href: "#",
        },
      ];

    return (
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="flex flex-col gap-2">
                {leftColumnLinks.map((link) => (
                    <Link key={link.title} href={link.href} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="bg-muted p-2 rounded-lg">{link.icon}</div>
                    <div>
                        <p className="font-semibold text-sm text-foreground">{link.title}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                    </Link>
                ))}
                <div className="bg-purple-100/50 dark:bg-purple-900/20 p-3 rounded-lg mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold text-sm">Courses for Kids</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        {coursesForKids.map((course) => (
                            <Link key={course.title} href={course.href} className="group bg-white dark:bg-card p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                    {course.icon}
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{course.title}</p>
                                        <p className="text-xs font-semibold text-red-500">{course.age}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                                    </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
                </div>

                {/* Column 2 */}
                <div className="border-x px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Search className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-base">Find courses by target</h3>
                    </div>
                     <div className="flex flex-col gap-1">
                        {findByTarget.map((item) => (
                            <Link key={item.name} href={item.href} className="group p-2 rounded-md hover:bg-muted flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-semibold">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
                
                {/* Column 3 */}
                <div className="px-4">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-base">Apply Now</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        {applicationLinks.map(item => (
                            <Link key={item.href} href={item.href} className="group p-2 rounded-md hover:bg-muted text-sm text-foreground flex justify-between items-center">
                                <span>{item.label}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                    <Separator className="my-4" />
                     <h3 className="font-semibold text-base">Explore</h3>
                      <div className="flex flex-col gap-1">
                        {exploreLinks.map(item => (
                            <Link key={item.href} href={item.href} target={item.target} rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} className="group p-2 rounded-md hover:bg-muted text-sm text-foreground flex justify-between items-center">
                                <span>{item.label}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MegaMenu = ({ links, title, children }: { links?: { href: string; label: string; icon: React.ReactNode; description: string; target?: string }[], title: string, children?: React.ReactNode }) => (
    <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {links && links.map((link) => (
                <Link key={link.href} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg mt-1">{link.icon}</div>
                    <div>
                        <p className="font-semibold text-sm text-foreground">{link.label}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
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
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);

  const isIdlFoundationPage = pathname === '/idl-foundation';
  
  const StoreIcon = () => (
    <div className="flex items-center gap-1.5 text-current">
        <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 absolute top-[5px] left-1/2 -translate-x-1/2 text-orange-500"
            >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <span className="font-semibold text-sm">Store</span>
    </div>
  );

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
  
  const branches = [
    { name: "Mukherjee Nagar, Delhi-110009", href: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6" },
    { name: "Mangol Puri, Delhi-110086", href: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6" },
    { name: "Budh Vihar, Delhi-110086", href: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6" },
    { name: "Krishan Vihar, Delhi-110086", href: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6" },
  ];

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
                 <GcsImage filePath={user.photoURL ?? ''} alt={user.name ?? ''} fill className="rounded-full object-cover" />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <Link href={getProfilePath(user)}>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                </Link>
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
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <UserCircle />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Login</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/signup">
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Sign Up</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  };
  
  const navLinks = [
    { href: "/about", label: t('about'), icon: <Info className="h-4 w-4" />, description: "Learn more about our mission and vision." },
    { href: "/contact", label: t('contact'), icon: <MessageSquare className="h-4 w-4" />, description: "Get in touch with us for any queries." },
    { href: "/gallery", label: t('gallery'), icon: <ImageIcon className="h-4 w-4" />, description: "Explore moments from our journey." },
    { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" />, description: "Read articles and updates from our team." },
    { href: "/idl-foundation", label: "IDL Foundation", icon: <HandHeart className="h-4 w-4" />, target: "_blank", description: "Support our cause and make a difference." },
  ];
  
  const applicationLinks = [
      { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" />, description: "Start your journey with us by filling out the admission form." },
      { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, description: "Experience our teaching style with a free demo class." },
      { href: "/feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, description: "Share your valuable feedback to help us improve." },
      { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, description: "Have questions? Send us an enquiry." },
      { href: "/volunteer", label: "Volunteer", icon: <HandHeart className="h-4 w-4" />, description: "Join our team of volunteers and contribute to our mission." },
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
      return null;
    }
    return null;
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
    "sticky top-0 z-50 border-b transition-transform duration-300",
    (pathname === '/' || pathname === '/idl-foundation' || pathname === '/store') ? 'h-20' : 'h-12',
    show ? "translate-y-0" : "-translate-y-full",
    "bg-background/95 backdrop-blur-sm"
  );
  
  const megaMenuBg = "bg-background/95 backdrop-blur-sm";

  return (
    <>
      <Collapsible asChild open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <header className={cn(headerClasses, 'z-50')}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
                <Link href={logoHref} className="flex items-center justify-center -ml-2">
                  <Image src="/logo.png" alt="IDL Education Logo" width={64} height={64} className="h-16 w-auto" />
                </Link>
                
                 <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex">
                    <nav className="items-center flex gap-x-4 h-full" onMouseLeave={handleMouseLeave}>
                          {!isIdlFoundationPage ? (
                            <>
                                <div onMouseEnter={() => handleMouseEnter('courses')} className="h-full flex items-center">
                                    <Button variant="outline" data-active={activeMenu === 'courses'} className="h-9 px-4 text-sm font-semibold border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-lg flex items-center gap-1 data-[active=true]:bg-primary/5 data-[active=true]:text-primary">
                                        Courses <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="h-full flex items-center">
                                    <Button asChild variant="ghost" className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md capitalize" style={{ fontSize: '90%' }}>
                                      <Link href="/about">About Us</Link>
                                    </Button>
                                  </div>
                                  <div className="h-full flex items-center">
                                    <Button asChild variant="ghost" className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md capitalize" style={{ fontSize: '90%' }}>
                                      <Link href="/contact">Contact Us</Link>
                                    </Button>
                                  </div>
                               <div className="h-full flex items-center">
                                <Link href="/store" target="_blank" rel="noopener noreferrer" className="group h-8 px-3 rounded-md flex items-center text-foreground hover:bg-primary/5 focus-visible:ring-0 focus-visible:ring-offset-0">
                                    <StoreIcon />
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-x-4 text-xs font-semibold">
                              <a href="tel:7011117585" className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> 7011117585</a>
                              <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                              <a href="mailto:info@idlfoundation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> info@idlfoundation.in</a>
                            </div>
                          )}
                    </nav>
                </div>
                <div className="flex items-center gap-1">
                    <div className="hidden md:flex items-center gap-2">
                         <a href="tel:7011117585" className="flex items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors">
                            <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                                <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[0.6rem] text-muted-foreground leading-tight">Call now</p>
                                <p className="text-sm font-bold text-foreground leading-tight tracking-wider">70-1111-7585</p>
                            </div>
                        </a>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!isIdlFoundationPage && notificationDropdown}
                      {isClient && renderAuthSection()}
                    </div>
                    
                    <CollapsibleTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className={cn("text-foreground hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground h-8 w-8")}>
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
                                <Collapsible open={openMobileAccordion === 'courses'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'courses' : null)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between text-sm">
                                            <span className="flex items-center gap-3"><BookOpen className="h-4 w-4" /> Courses</span>
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                     <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-2 gap-1">
                                            {allPrograms.map(({ href, name }) => (
                                                <Link key={name} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <p className="font-semibold text-sm">{name}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <Collapsible open={openMobileAccordion === 'explore'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'explore' : null)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between text-sm">
                                            <span className="flex items-center gap-3"><Menu className="h-4 w-4" /> Explore</span>
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-1 gap-1">
                                            {navLinks.map(({ href, label, icon, description, target }) => (
                                                <Link key={href} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <div className="bg-muted p-2 rounded-md mt-1">{icon}</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{label}</p>
                                                        <p className="text-xs text-muted-foreground">{description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <Collapsible open={openMobileAccordion === 'apply'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'apply' : null)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-sm">
                                            <span className="flex items-center gap-3"><GraduationCap className="h-4 w-4" /> Apply For</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-1 gap-1">
                                            {applicationLinks.map(({ href, label, icon, description }) => (
                                                <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <div className="bg-muted p-2 rounded-md mt-1">{icon}</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{label}</p>
                                                        <p className="text-xs text-muted-foreground">{description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <Button asChild variant="outline" className="w-full justify-start text-sm">
                                  <Link href="/store" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                                    <StoreIcon />
                                  </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start text-sm">
                                   <a href="tel:7011117585" className="flex items-center gap-3">
                                      <Phone className="h-4 w-4" />
                                      Call Now (70-1111-7585)
                                  </a>
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
       <div 
        onMouseEnter={() => handleMouseEnter(activeMenu || '')} 
        onMouseLeave={handleMouseLeave} 
        className={cn(
          "fixed top-12 left-0 w-full z-40 transition-all duration-300 ease-in-out",
          activeMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className={cn("absolute inset-x-0 top-0 shadow-lg", megaMenuBg)}>
          <div className="pt-4 pb-4">
            {activeMenu === 'courses' && <CoursesMegaMenu />}
            {activeMenu === 'explore' && <MegaMenu links={navLinks} title="" />}
            {activeMenu === 'apply' && <MegaMenu links={applicationLinks} title="" />}
          </div>
        </div>
      </div>
    </>
  );
}
