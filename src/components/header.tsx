'use client';
import Link from "next/link";
import { 
  BookOpen, LogIn, Menu, Phone, Mail, GraduationCap, FileText, 
  ImageIcon, User, LayoutDashboard, LogOut, X, AlignJustify, 
  ShoppingCart, MessageSquare, Info, ChevronDown, Heart, HelpCircle, 
  FileType, UserPlus, IndianRupee, Landmark, ClipboardList, 
  UserCircle, Building, Users, HandHeart, Banknote,
  Edit, Headset, Copy, CheckCircle2, MapPin, AlignLeft, Search, Bell
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { useEffect, useState, useCallback, useRef } from "react";
import { createRazorpayOrder, recordDonation, getUpdates, registerForScholarship } from "@/app/actions";
import Image from "next/image";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { GcsImage } from "./gcs-image";
import { allPrograms } from "@/lib/courses";
import { ScrollArea } from "./ui/scroll-area";
import { ContactForm } from "./contact-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

const megaMenuBg = "bg-background/95 backdrop-blur-sm";

const allCoursesCategories = [
    {
        name: "Free Courses",
        description: "High-quality free video lessons.",
        href: "/free-courses",
        icon: <BookOpen className="h-5 w-5" />,
        colorClasses: "bg-orange-50 text-orange-600 dark:bg-orange-900/20"
    },
    {
        name: "Paid Courses",
        description: "Premium structured learning.",
        href: "/paid-courses",
        icon: <IndianRupee className="h-5 w-5" />,
        colorClasses: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
    },
    {
        name: "School Board",
        description: "Prep for Class 5 to 12.",
        href: "/school",
        icon: <GraduationCap className="h-5 w-5" />,
        colorClasses: "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
    },
    {
        name: "CUET UG/PG",
        description: "University entrance tests.",
        href: "/category/cuet",
        icon: <GraduationCap className="h-5 w-5" />,
        colorClasses: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20"
    },
    {
        name: "Govt. Exams",
        description: "SSC, Banking, & Railway.",
        href: "/examcat?category=govt-job-exams",
        icon: <Landmark className="h-5 w-5" />,
        colorClasses: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
    },
    {
        name: "Test Series",
        description: "Rigorous preparation tests.",
        href: "#",
        icon: <ClipboardList className="h-5 w-5" />,
        colorClasses: "bg-rose-50 text-rose-600 dark:bg-rose-900/20"
    },
];

const donationCategories = [
    { title: "Skill Trainings", description: "Empower individuals with valuable skills.", imageUrl: "https://picsum.photos/seed/training/1600/450", imageHint: "team training", goal: 100000, raised: 1500 },
    { title: "Children Education", description: "The gift of education for all.", imageUrl: "https://picsum.photos/seed/slum/1600/450", imageHint: "children studying", goal: 100000, raised: 2200 },
    { title: "Tree Plantation", description: "Nurture a greener planet.", imageUrl: "https://picsum.photos/seed/tree/1600/450", imageHint: "planting tree", goal: 100000, raised: 1800 },
    { title: "Women Empowerment", description: "Uplift and empower women.", imageUrl: "https://picsum.photos/seed/women/1600/450", imageHint: "women group", goal: 5000000, raised: 1250000 },
    { title: "Medical Assistance", description: "Provide critical healthcare.", imageUrl: "https://picsum.photos/seed/medical/1600/450", imageHint: "doctor patient", goal: 3000000, raised: 300000 },
    { title: "Old Age Home", description: "Dignity and care for elders.", imageUrl: "https://picsum.photos/seed/elderly/1600/450", imageHint: "elderly people", goal: 2500000, raised: 800000 },
];

const MegaMenu = ({ links }: { links?: any[] }) => (
    <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {links && links.map((link) => (
                <Link key={link.href} href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className={cn("p-3 rounded-full mt-1 shadow-sm shrink-0", link.colorClasses || link.color || "bg-primary/10 text-primary")}>
                        {link.icon}
                    </div>
                    <div>
                        <p className="font-extrabold text-sm text-foreground">{link.label}</p>
                        <p className="text-[10px] font-bold text-muted-foreground line-clamp-1 opacity-80">{link.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export function Header() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [donationCategory, setDonationCategory] = useState<string>("");
  const [donationStep, setDonationStep] = useState(1);
  const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
  const [donationAmount, setDonationAmount] = useState('');

  const isIdlFoundationPage = pathname === '/idl-foundation';
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => window.removeEventListener('scroll', controlNavbar);
    }
  }, [controlNavbar]);
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardPath = (userProfile: UserProfile | null) => {
    if (!userProfile || !userProfile.role) return '/';
    return userProfile.role === 'admin' ? '/admin/dashboard' : `/${userProfile.role}/dashboard`;
  };
  
  const getProfilePath = (userProfile: UserProfile | null) => {
    if (!userProfile || !userProfile.role) return '/';
    return `/${userProfile.role}/profile`;
  }

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

  const handleDonateClick = () => setDonationStep(2);

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDonorDetails({ ...donorDetails, [e.target.name]: e.target.value });
  }

  const handlePayment = async () => {
    const amount = parseInt(donationAmount);
    if (isNaN(amount) || amount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid donation amount.' });
        return;
    }

    const result = await createRazorpayOrder({ amount: amount * 100, currency: 'INR' });
    if (!result.success || !result.order) {
        toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not create payment order.' });
        return;
    }
    const order = result.order;
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'IDL Foundation Donation',
        description: `Donation for ${donationCategory}`,
        order_id: order.id,
        handler: async function (response: any) {
            const donationData = {
                ...donorDetails,
                amount: amount,
                category: donationCategory,
                paymentId: response.razorpay_payment_id,
            };
            await recordDonation(donationData);
            toast({ title: 'Payment Successful', description: `Thank you for your donation of ₹${amount}!` });
            setDonationStep(1);
            setDonationCategory('');
            setDonationAmount('');
            setDonorDetails({ name: '', contact: '', email: '', place: '' });
            setIsDonateDialogOpen(false);
        },
        prefill: {
            name: donorDetails.name,
            email: donorDetails.email,
            contact: donorDetails.contact,
        },
        theme: {
            color: '#0d47a1',
        },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const navLinks = [
    { href: "/about", label: "About Us", icon: <Info className="h-4 w-4" />, color: "bg-blue-50 text-blue-600", description: "Learn more about our mission." },
    { href: "#", label: "Contact Us", icon: <MessageSquare className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-600", description: "Get in touch with us.", onClick: () => setIsContactOpen(true) },
    { href: '/gallery', label: "Gallery", icon: <ImageIcon className="h-4 w-4" />, color: "bg-violet-50 text-violet-600", description: "Explore moments from our journey." },
    { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" />, color: "bg-orange-50 text-orange-600", description: "Read articles and updates." },
    { href: "/offline-centers", label: "Offline Centers", icon: <Building className="h-4 w-4" />, color: "bg-rose-50 text-rose-600", description: "Visit our learning centers." },
    { href: "/workshop", label: "Workshops", icon: <Users className="h-4 w-4" />, color: "bg-indigo-50 text-indigo-600", description: "Join our hands-on workshops." },
    { href: "/volunteer", label: "Volunteer", icon: <HandHeart className="h-4 w-4" />, color: "bg-pink-50 text-pink-600", description: "Contribute to our mission." },
    { href: "/idl-foundation", label: "IDL Foundation", icon: <Heart className="h-4 w-4" />, color: "bg-red-50 text-red-600", target: "_blank", description: "Support our cause." },
  ];
  
  const applyForLinks = [
      { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" />, color: "bg-primary/5 text-primary", description: "Start your journey today." },
      { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, color: "bg-amber-50 text-amber-600", description: "Experience our teaching style." },
      { href: "/feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, color: "bg-sky-50 text-sky-600", description: "Help us improve." },
      { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, color: "bg-purple-50 text-purple-600", description: "Have questions? Send us an enquiry." },
  ];

  const renderAuthSection = () => {
    if (loading) return <Skeleton className="h-10 w-10 rounded-full" />;

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                 <GcsImage filePath={user.photoURL ?? ''} alt={user.name ?? ''} fill className="rounded-full object-cover" />
                <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : <User />}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <Link href={getProfilePath(user)}>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-extrabold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
        return (
            <Dialog open={isDonateDialogOpen} onOpenChange={(open) => { setIsDonateDialogOpen(open); if (!open) setDonationStep(1); }}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsDonateDialogOpen(true)} className="font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700 h-10 px-6">
                        Donate <Heart className="w-4 h-4 ml-2 fill-white text-white" />
                    </Button>
                </DialogTrigger>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
                    <DialogHeader className="text-center mb-6">
                        <DialogTitle className="text-2xl font-extrabold text-center text-primary">Thank You for Your Support!</DialogTitle>
                        <DialogDescription className="text-center font-bold">Your generosity helps us create a better world.</DialogDescription>
                    </DialogHeader>
                    {donationStep === 1 ? (
                        <div className="py-4 space-y-4">
                            <RadioGroup onValueChange={setDonationCategory} value={donationCategory}>
                                {donationCategories.map(category => (
                                    <div key={category.title} className="flex items-center space-x-2">
                                        <RadioGroupItem value={category.title} id={`header-${category.title}`} />
                                        <Label htmlFor={`header-${category.title}`} className="font-bold">{category.title}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <Button onClick={handleDonateClick} disabled={!donationCategory} className="w-full font-extrabold">
                                Donate to {donationCategory || "..."}
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-4 space-y-3">
                            <p className="text-center font-bold text-sm">You are donating to "{donationCategory}".</p>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="header-amount" name="amount" type="number" placeholder="Enter Amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} className="pl-9 h-9 text-sm" />
                            </div>
                            <Input id="header-name" name="name" placeholder="Name (Optional)" value={donorDetails.name} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-contact" name="contact" placeholder="Contact (Optional)" value={donorDetails.contact} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-email" name="email" type="email" placeholder="Email (Optional)" value={donorDetails.email} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-place" name="place" placeholder="Place (Optional)" value={donorDetails.place} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm font-extrabold">
                                <Banknote className="mr-2 h-4 w-4" />
                                Proceed to Final Payment
                            </Button>
                            <Button variant="link" onClick={() => setDonationStep(1)} className="text-xs w-full h-auto py-1 font-bold">Change Category</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
      <Link href="/login" className="group relative px-5 py-1.5 rounded-md border border-primary transition-all duration-300 active:scale-95 overflow-hidden h-9 flex items-center">
        <div className="absolute inset-0 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0" />
        <span className="relative z-10 text-[10px] font-extrabold uppercase tracking-wide text-primary group-hover:text-white transition-colors">Login</span>
      </Link>
    );
  };

  const headerClasses = cn(
    "sticky top-0 z-50 border-b transition-transform duration-300 h-16 bg-background/95 backdrop-blur-sm",
    show ? "translate-y-0" : "-translate-y-full"
  );

  return (
    <>
      <header className={headerClasses}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
              <Link href="/" className="flex items-center justify-center -ml-2">
                <Image src="/logo.png" alt="IDL Education Logo" width={48} height={48} className="h-12 w-auto" />
              </Link>
              
               <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex">
                  <nav className="items-center flex gap-x-1 h-full" onMouseLeave={handleMouseLeave}>
                        {!isIdlFoundationPage ? (
                          <>
                            <div onMouseEnter={() => handleMouseEnter('explore')} className="h-full flex items-center">
                              <Button variant="ghost" data-active={activeMenu === 'explore'} className="h-auto py-2 px-3 text-sm font-extrabold tracking-tight text-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md uppercase">ALL COURSES</Button>
                            </div>
                            <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center">
                              <Button variant="ghost" data-active={activeMenu === 'apply'} className="h-auto py-2 px-3 text-sm font-extrabold tracking-tight text-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md uppercase">APPLY FOR</Button>
                            </div>
                             <div className="h-full flex items-center">
                              <Button asChild variant="ghost" className="h-auto px-3 text-sm font-extrabold tracking-tight text-foreground hover:bg-primary/5 hover:text-primary rounded-md uppercase">
                                      <Link href="/store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                          <ShoppingCart className="h-4 w-4" /><span className="text-[11px]">STORE</span>
                                      </Link>
                                  </Button>
                              </div>
                               <div onMouseEnter={() => handleMouseEnter('more')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'more'} className="h-auto py-2 px-3 text-sm font-extrabold tracking-tight text-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md uppercase">MORE</Button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-x-4 text-[10px] font-extrabold tracking-tight">
                            <a href="tel:7011117585" className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> 701111 7585</a>
                            <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                            <a href="mailto:info@idlfoundation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> info@idlfoundation.in</a>
                          </div>
                        )}
                  </nav>
              </div>
              <div className="flex items-center gap-1">
                  <div className="hidden md:flex items-center gap-2">
                       <a href="tel:7011117585" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-all">
                          <div className="bg-primary/10 p-2 rounded-full"><Phone className="h-3 w-3 text-primary" /></div>
                          <div><p className="text-[8px] font-extrabold text-muted-foreground tracking-tight leading-tight">Call Expert</p><p className="text-xs font-extrabold text-foreground leading-tight">70-1111-7585</p></div>
                      </a>
                  </div>
                  <div className="flex items-center gap-1">
                    {isClient && renderAuthSection()}
                  </div>
                   <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-foreground h-10 w-10"><Menu className="h-5 w-5" /><span className="sr-only">Toggle navigation menu</span></Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetHeader className="p-4 border-b bg-muted/10">
                            <SheetTitle>
                                <Link href="/" className="flex flex-row items-center justify-start gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="relative w-16 h-16 shrink-0">
                                        <Image src="/logo.png" alt="IDL Education Logo" fill className="object-contain" />
                                    </div>
                                    <div className="flex flex-col leading-tight text-left">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-3xl font-extrabold text-primary tracking-tight uppercase">IDL</span>
                                            <div className="flex flex-col text-[8px] font-bold text-muted-foreground tracking-tight leading-[1.1] opacity-60">
                                                <span>Institute of</span>
                                                <span>Distance Learning Pvt. Ltd.</span>
                                            </div>
                                        </div>
                                        <span className="text-3xl font-extrabold text-primary tracking-tight -mt-1">
                                            {isIdlFoundationPage ? "Foundation" : "Education"}
                                        </span>
                                    </div>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="h-[calc(100vh-5.5rem)] flex flex-col">
                            <ScrollArea className="flex-1">
                                {!isIdlFoundationPage && (
                                <div className="p-4 space-y-6">
                                    <div className="space-y-3">
                                        <Collapsible open={openMobileAccordion === 'all-courses'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'all-courses' : null)}>
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                    <span className="flex items-center gap-3 font-extrabold text-xs uppercase tracking-tight text-primary">
                                                        <BookOpen className="h-4 w-4" /> 
                                                        All Courses
                                                    </span>
                                                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-1 py-3 bg-white space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {allCoursesCategories.map(({ href, name: label, icon, description, colorClasses }) => (
                                                    <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98]">
                                                        <div className={cn("p-2.5 rounded-full mt-0.5 shadow-sm shrink-0", colorClasses)}>{icon}</div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-extrabold text-[13px] text-foreground leading-tight">{label}</p>
                                                            <p className="text-[10px] font-extrabold text-muted-foreground leading-tight line-clamp-1 opacity-80">{description}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>

                                        <Collapsible open={openMobileAccordion === 'apply'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'apply' : null)}>
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                    <span className="flex items-center gap-3 font-extrabold text-xs uppercase tracking-tight text-primary">
                                                        <GraduationCap className="h-4 w-4" /> 
                                                        Apply For
                                                    </span>
                                                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-1 py-3 bg-white space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {applyForLinks.map(({ href, label, icon, description, color }) => (
                                                    <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98]">
                                                        <div className={cn("p-2.5 rounded-full mt-0.5 shadow-sm shrink-0", color)}>{icon}</div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-extrabold text-[13px] text-foreground leading-tight">{label}</p>
                                                            <p className="text-[10px] font-extrabold text-muted-foreground leading-tight line-clamp-1 opacity-80">{description}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>

                                        <Collapsible open={openMobileAccordion === 'more'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'more' : null)}>
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                    <span className="flex items-center gap-3 font-extrabold text-xs uppercase tracking-tight text-primary">
                                                        <AlignJustify className="h-4 w-4" /> 
                                                        Resources & Info
                                                    </span>
                                                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-1 py-3 bg-white space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {navLinks.map(({ href, label, icon, description, target, onClick, color }) => (
                                                    <Link key={href} href={onClick ? '#' : href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} onClick={() => {onClick?.(); setIsMobileMenuOpen(false)}} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98]">
                                                        <div className={cn("p-2.5 rounded-full mt-0.5 shadow-sm shrink-0", color)}>{icon}</div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-extrabold text-[13px] text-foreground leading-tight">{label}</p>
                                                            <p className="text-[10px] font-extrabold text-muted-foreground leading-tight line-clamp-1 opacity-80">{description}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>

                                    <div className="space-y-3">
                                        <Link href="/store" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border active:scale-[0.98]">
                                            <span className="flex items-center gap-3 font-extrabold text-xs uppercase tracking-tight text-orange-600">
                                                <ShoppingCart className="h-4 w-4" /> 
                                                IDL Store
                                            </span>
                                        </Link>

                                        <a href="tel:7011117585" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border active:scale-[0.98]">
                                            <span className="flex items-center gap-3 font-extrabold text-xs uppercase tracking-tight text-primary">
                                                <Phone className="h-4 w-4" /> 
                                                Call Expert
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                )}
                                <div className="p-4 border-t mt-auto bg-muted/10">
                                    {user ? (
                                        <Link href={getProfilePath(user)} className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Avatar className="h-10 w-10">
                                                <GcsImage filePath={user.photoURL ?? ''} alt={user.name ?? ''} fill className="rounded-full object-cover" />
                                                <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-extrabold truncate max-w-[120px]">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-extrabold">{user.role}</span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full font-extrabold uppercase tracking-wide h-12 rounded-xl shadow-lg shadow-primary/20">
                                                SIGN IN TO PORTAL
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </SheetContent>
                </Sheet>
              </div>
          </div>
      </header>
      
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
            {activeMenu === 'explore' && <MegaMenu links={allCoursesCategories.map(c => ({ ...c, label: c.name, color: c.colorClasses }))} />}
            {activeMenu === 'apply' && <MegaMenu links={applyForLinks} />}
            {activeMenu === 'more' && <MegaMenu links={navLinks.filter(l => !['About Us', 'Contact Us'].includes(l.label))} />}
          </div>
        </div>
      </div>

      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
              <DialogHeader className="text-center mb-6">
                  <DialogTitle className="text-2xl font-extrabold text-primary uppercase tracking-tighter">Contact Us</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-[13px] font-extrabold">Have a query? Drop us a line below.</DialogDescription>
              </DialogHeader>
              <ContactForm onSuccess={() => setIsContactOpen(false)} />
          </DialogContent>
      </Dialog>
    </>
  );
}
