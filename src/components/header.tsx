'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, LogOut, User, LayoutDashboard, FileText, ImageIcon, ShoppingCart, Plus, Minus, XCircle, FileType, Award, GraduationCap, X, ChevronDown, AlignJustify, ShoppingBag, HandHeart, HelpCircle, ArrowRight, UserCircle, UserPlus, MapPin, LifeBuoy, Atom, Landmark, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState, useCallback, useRef } from "react";
import { registerForScholarship } from "@/app/actions";
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
import { ContactForm } from "./contact-form";

const allCoursesCategories = [
    {
        name: "IIT-JEE/NEET",
        description: "Prepare for engineering and medical entrance exams.",
        href: "/category/iit-jee",
        icon: <Atom className="h-5 w-5" />,
        colorClasses: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    },
    {
        name: "CUET UG/PG",
        description: "MBA, IPMAT, IIT JAM, CSIR NET, LAW, CUET, UGC NET...",
        href: "/category/cuet",
        icon: <GraduationCap className="h-5 w-5" />,
        colorClasses: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
    },
    {
        name: "CBSE BOARD",
        description: "CBSE Arts, CBSE Science, CBSE Commerce, ICSE, UP Board...",
        href: "/school",
        icon: <Award className="h-5 w-5" />,
        colorClasses: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
        name: "NIOS BOARD",
        description: "Flexible learning with the National Institute of Open Schooling.",
        href: "/new-work",
        icon: <BookOpen className="h-5 w-5" />,
        colorClasses: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
    },
    {
        name: "GOVT EXAM",
        description: "SSC, Banking, Judiciary, Teaching, Railway, UP Exams...",
        href: "/examcat?category=govt-job-exams",
        icon: <Landmark className="h-5 w-5" />,
        colorClasses: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
];

const StoreIcon = () => (
    <Image 
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCA4MCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGc+CjxwYXRoIGQ9Ik01LjgzMzk4IDguMDAwMzNIMjEuMTY3M0wxOS44MzQgMTQuNjY3SDcuMTY3MzJNNS44MzM5OCA4LjAwMDMzTDQuNTAwNjUgNC42NjY5OUgyLjUwMDY1TTUuODMzOTggOC4wMDAzM0w3LjE2NzMyIDE0LjY2N003LjE2NzMyIDE0LjY2N0w3LjgzMzk4IDE4LjAwMDNIMTkuMTY3MyIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjguNTAwNjUiIGN5PSIyMS42NjciIHI9IjEuMzMzMzMiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8Y2lyY2xlIGN4PSIxNy44MzQiIGN5PSIyMS42NjciIHI9IjEuMzMzMzMiIGZpbGw9ImN1cnJlbnRDb2xvciIvPgo8cGF0aCBkPSJNMTEuMTY3MyAxMS4zMzM3TDEzLjE2NzMgMTMuMzMzN0wxNy4xNjczIDkuMzMzNjYiIHN0cm9rZT0iI2Y5NzMxNiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+Cjx0ZXh0IHg9IjI4IiB5PSIxOSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJjdXJyZW50Q29sb3IiPlN0b3JlPC90ZXh0Pgo8L3N2Zz4="
        alt="IDL Store"
        width={68}
        height={24}
        className="h-6 w-auto"
    />
);

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

const AllCoursesMegaMenu = () => {
    return (
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                 {allCoursesCategories.map((category, index) => (
                    <Link key={index} href={category.href} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className={cn("p-3 rounded-lg mt-1", category.colorClasses)}>{category.icon}</div>
                        <div>
                            <p className="font-semibold text-sm text-foreground">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

const MegaMenu = ({ links, title, children, onLinkClick }: { links?: { href: string; label: string; icon: React.ReactNode; description: string; target?: string, colorClasses?: string, onClick?: () => void }[], title: string, children?: React.ReactNode, onLinkClick?: () => void }) => (
    <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {links && links.map((link) => (
                <Link key={link.href} href={link.onClick ? '#' : link.href} onClick={() => {link.onClick?.(); onLinkClick?.();}} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className={cn("p-3 rounded-lg mt-1", link.colorClasses || 'bg-muted')}>{link.icon}</div>
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isScholarshipDialogOpen, setIsScholarshipDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isIdlFoundationPage = pathname === '/idl-foundation';
  
  useEffect(() => {
    setMounted(true);
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

  const handleLogout = async () => {
    await logout();
    router.push('/');
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
    if (loading || !mounted) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
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
    
    if (isIdlFoundationPage) {
        return null;
    }

    return (
      <Button asChild variant="ghost" size="sm" className="rounded-lg text-primary hover:bg-primary/5 hover:text-primary border border-primary/20">
          <Link href="/login">Login</Link>
      </Button>
    );
  };
  
  const navLinks = [
    { href: '/about', label: t('about'), icon: <Info className="h-4 w-4" />, description: "Learn more about our mission and vision.", colorClasses: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400" },
    { href: '#', label: t('contact'), icon: <MessageSquare className="h-4 w-4" />, description: "Get in touch with us for any queries.", colorClasses: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", onClick: () => setIsContactOpen(true) },
    { href: '/gallery', label: t('gallery'), icon: <ImageIcon className="h-4 w-4" />, description: "Explore moments from our journey.", colorClasses: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
    { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" />, description: "Read articles and updates from our team.", colorClasses: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
    { href: "/idl-foundation", label: "IDL Foundation", icon: <HandHeart className="h-4 w-4" />, target: "_blank", description: "Support our cause and make a difference.", colorClasses: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  ];
  
  const applyForLinks = [
      { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" />, description: "Start your journey with us by filling out the admission form.", colorClasses: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
      { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, description: "Experience our teaching style with a free demo class.", colorClasses: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
      { href: "/feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, description: "Share your valuable feedback to help us improve.", colorClasses: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
      { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, description: "Have questions? Send us an enquiry.", colorClasses: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
      { href: "/volunteer", label: "Volunteer", icon: <HandHeart className="h-4 w-4" />, description: "Join our team of volunteers and contribute to our mission.", colorClasses: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  ];

  const loggedInNavLinks = [
    { href: getDashboardPath(user), label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: getProfilePath(user), label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  const renderMobileAuthSection = () => {
    if (loading || !mounted) {
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
          {loggedInNavLinks.map(link => (
            <Button asChild variant="ghost" className="w-full justify-start text-sm" key={link.href}>
              <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </Link>
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" /> Logout
          </Button>
        </div>
      );
    }

    return null;
  };

  const headerClasses = cn(
    "sticky top-0 z-50 transition-transform duration-300 h-16",
    show ? "translate-y-0" : "-translate-y-full",
    (pathname !== '/' && !isIdlFoundationPage) && "border-b",
    "bg-background/95 backdrop-blur-sm"
  );
  
  const megaMenuBg = "bg-background/95 backdrop-blur-sm";

  return (
    <>
      <Collapsible asChild open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <header className={cn(headerClasses, 'z-50')}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
                <Link href={logoHref} className="flex items-center justify-center -ml-2">
                  <Image src="/logo.png" alt="IDL Education Logo" width={48} height={48} className="h-12 w-auto" />
                </Link>
                
                 <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex">
                    <nav className="items-center flex gap-x-4 h-full" onMouseLeave={handleMouseLeave}>
                          {!isIdlFoundationPage ? (
                            <>
                              <div onMouseEnter={() => handleMouseEnter('all-courses')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'all-courses'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                    All Courses <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", activeMenu === 'all-courses' && "rotate-180")} />
                                </Button>
                              </div>
                               <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'apply'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                  Apply For
                                </Button>
                              </div>
                               <div onMouseEnter={() => handleMouseEnter('more')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'more'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                    More
                                </Button>
                              </div>
                               <div className="h-full flex items-center">
                                <Button asChild variant="ghost" className="h-auto p-2 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md capitalize">
                                  <Link href="/store" target="_blank" rel="noopener noreferrer">
                                    <StoreIcon />
                                  </Link>
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-x-4 text-sm font-semibold">
                              <a href="tel:7011117585" className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> 7011117585</a>
                              <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                              <a href="mailto:info@idlfoundation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> info@idlfoundation.in</a>
                            </div>
                          )}
                    </nav>
                 </div>
                <div className="flex items-center gap-1">
                    <div className="hidden md:flex items-center gap-2">
                        {isIdlFoundationPage ? (
                            null
                        ) : (
                            <a href="tel:7011117585" className="flex items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-full">
                                    <Phone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[0.6rem] text-muted-foreground leading-none">Call now</p>
                                    <p className="text-xs font-semibold text-foreground leading-tight">70-1111-7585</p>
                                </div>
                            </a>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1 md:hidden">
                        {mounted && renderAuthSection()}
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("text-foreground hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground h-10 w-10")}>
                                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <AlignJustify className="h-4 w-4" />}
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                     <div className="hidden md:flex">
                        {mounted && renderAuthSection()}
                    </div>
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
                                <Collapsible open={openMobileAccordion === 'all-courses'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'all-courses' : null)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-between text-sm">
                                            <span className="flex items-center gap-3"><BookOpen className="h-4 w-4" /> All Courses</span>
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-1 gap-1">
                                            {allCoursesCategories.map(({ href, name: label, icon, description, colorClasses }, index) => (
                                                <Link key={href + index} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                                     <div className={cn("p-2 rounded-md mt-1", colorClasses)}>{icon}</div>
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
                                        <Button variant="ghost" className="w-full justify-between text-sm">
                                            <span className="flex items-center gap-3"><GraduationCap className="h-4 w-4" /> Apply For</span>
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-1 gap-1">
                                            {applyForLinks.map(({ href, label, icon, description, colorClasses }) => (
                                                <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <div className={cn("p-2 rounded-md mt-1", colorClasses)}>{icon}</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{label}</p>
                                                        <p className="text-xs text-muted-foreground">{description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                 <Collapsible open={openMobileAccordion === 'more'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'more' : null)}>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-between text-sm">
                                            <span className="flex items-center gap-3"><MoreHorizontal className="h-4 w-4" /> More</span>
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="p-2">
                                        <div className="grid grid-cols-1 gap-1">
                                            {navLinks.map(({ href, label, icon, description, target, onClick, colorClasses }) => (
                                                <Link key={href} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} onClick={() => {onClick?.(); setIsMobileMenuOpen(false)}} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                                                    <div className={cn("p-2 rounded-md mt-1", colorClasses)}>{icon}</div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{label}</p>
                                                        <p className="text-xs text-muted-foreground">{description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <Button asChild variant="ghost" className="w-full justify-start text-sm">
                                  <Link href="/store" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                                    <ShoppingCart className="h-4 w-4" />
                                    IDL Store
                                  </Link>
                                </Button>
                                <Button asChild variant="ghost" className="w-full justify-start text-sm">
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
          "fixed top-16 left-0 w-full z-40 transition-all duration-300 ease-in-out",
          activeMenu ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className={cn("absolute inset-x-0 top-0 shadow-lg", megaMenuBg)}>
          <div className="pt-4 pb-4">
            {activeMenu === 'all-courses' && <AllCoursesMegaMenu />}
            {activeMenu === 'apply' && <MegaMenu links={applyForLinks} title="" onLinkClick={() => setActiveMenu(null)}/>}
            {activeMenu === 'more' && <MegaMenu links={navLinks} title="" onLinkClick={() => setActiveMenu(null)}/>}
          </div>
        </div>
      </div>
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
            <DialogHeader className="text-center mb-6">
                <DialogTitle className="text-2xl font-bold text-primary">Contact Us</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                    Fill out the form below and we'll get back to you as soon as possible.
                </DialogDescription>
            </DialogHeader>
            <ContactForm onSuccess={() => setIsContactOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
