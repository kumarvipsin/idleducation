'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText, ImageIcon, ShoppingCart, Plus, Minus, XCircle, FileType, Award, GraduationCap, X, ChevronDown, AlignJustify, ShoppingBag, HandHeart, HelpCircle, ArrowRight, UserCircle, UserPlus, MapPin, LifeBuoy, Heart, Atom, Landmark, MoreHorizontal, IndianRupee, Banknote, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState, useCallback, useRef } from "react";
import { getUpdates, registerForScholarship, createRazorpayOrder, recordDonation } from "@/app/actions";
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
import { ContactForm } from "./contact-form";
import Script from "next/script";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";


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

const MegaMenu = ({ links, title, children, onLinkClick }: { links?: { href: string; label: string; icon: React.ReactNode; description: string; target?: string, onClick?: () => void, colorClasses?: string }[], title: string, children?: React.ReactNode, onLinkClick?: () => void }) => (
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

const donationCategories = [
    { title: "Skill Trainings", description: "Empower individuals with valuable skills for a better future.", imageUrl: "https://picsum.photos/seed/training/1600/450", imageHint: "team training", goal: 100000, raised: 1500 },
    { title: "Street & Slum Children Education", description: "Light up a child's future with the gift of education.", imageUrl: "https://picsum.photos/seed/slum/1600/450", imageHint: "children studying", goal: 100000, raised: 2200 },
    { title: "Environment / Tree Plantation", description: "Help us nurture a greener and healthier planet.", imageUrl: "https://picsum.photos/seed/tree/1600/450", imageHint: "planting tree", goal: 100000, raised: 1800 },
    { title: "Women Empowerment", description: "Support initiatives that uplift and empower women.", imageUrl: "https://picsum.photos/seed/women/1600/450", imageHint: "women group", goal: 5000000, raised: 1250000 },
    { title: "Medical Assistance", description: "Provide critical healthcare to those who can't afford it.", imageUrl: "https://picsum.photos/seed/medical/1600/450", imageHint: "doctor patient", goal: 3000000, raised: 300000 },
    { title: "Senior Citizen/Old Age Home", description: "Ensure our elders live with dignity and care.", imageUrl: "https://picsum.photos/seed/elderly/1600/450", imageHint: "elderly people", goal: 2500000, raised: 800000 },
];

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
const scholarshipClasses = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

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
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [donationCategory, setDonationCategory] = useState<string>("");
  const [donationStep, setDonationStep] = useState(1);
  const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
  const [donationAmount, setDonationAmount] = useState('');

  const isIdlFoundationPage = pathname === '/idl-foundation';
  
  const handleDonateClick = () => {
    setDonationStep(2);
  }

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
        notes: {
            category: donationCategory,
            place: donorDetails.place,
        },
        theme: {
            color: '#0d47a1',
        },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  
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
    const result = await registerForScholarship({
        ...data,
        guardianName: data.studentName, // Use student name as guardian name for quick registration
        country: 'India',
        state: 'N/A',
      });
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
        return (
            <Dialog open={isDonateDialogOpen} onOpenChange={(open) => { setIsDonateDialogOpen(open); if (!open) setDonationStep(1); }}>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsDonateDialogOpen(true)} className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700 h-10 px-6">
                        DONATE <Heart className="w-4 h-4 ml-2 fill-white text-white" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-primary">Thank You for Your Support!</DialogTitle>
                        <DialogDescription className="text-center">
                            Your generosity helps us create a better world. Please choose where you'd like to make an impact.
                        </DialogDescription>
                    </DialogHeader>
                    {donationStep === 1 ? (
                        <div className="py-4 space-y-4">
                            <RadioGroup onValueChange={setDonationCategory} value={donationCategory}>
                                {donationCategories.map(category => (
                                    <div key={category.title} className="flex items-center space-x-2">
                                        <RadioGroupItem value={category.title} id={`header-${category.title}`} />
                                        <Label htmlFor={`header-${category.title}`}>{category.title}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <Button onClick={handleDonateClick} disabled={!donationCategory} className="w-full">
                                Donate to {donationCategory || "..."}
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-4 space-y-3">
                            <p className="text-center font-semibold text-sm">You are donating to "{donationCategory}".</p>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="header-amount" name="amount" type="number" placeholder="Enter Amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} className="pl-9 h-9 text-sm" />
                            </div>
                            <Input id="header-name" name="name" placeholder="Name (Optional)" value={donorDetails.name} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-contact" name="contact" placeholder="Contact (Optional)" value={donorDetails.contact} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-email" name="email" type="email" placeholder="Email (Optional)" value={donorDetails.email} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Input id="header-place" name="place" placeholder="Place (Optional)" value={donorDetails.place} onChange={handleDetailChange} className="h-9 text-sm" />
                            <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm">
                                <Banknote className="mr-2 h-4 w-4" />
                                Proceed to Final Payment
                            </Button>
                            <Button variant="link" onClick={() => setDonationStep(1)} className="text-xs w-full h-auto py-1">
                                Change Category
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        );
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2">
                <Avatar className="h-10 w-10">
                  <GcsImage filePath={user.photoURL ?? ''} alt={user.name ?? 'User'} fill className="rounded-full object-cover" />
                  <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : <User />}</AvatarFallback>
                </Avatar>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="start" side="top">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    return (
        <div className="p-2 grid grid-cols-2 gap-2 border-t">
            <Button asChild><Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link></Button>
            <Button asChild variant="outline"><Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link></Button>
        </div>
    );
  };
  
  const notificationDropdown = (
    <Popover onOpenChange={handleNotificationOpenChange}>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                <Bell className="h-4 w-4" />
                {hasNewUpdates && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                )}
            </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Recent Updates</h4>
                    <p className="text-sm text-muted-foreground">
                        Latest announcements from IDL.
                    </p>
                </div>
                <Separator />
                <div className="grid gap-2">
                    {updates.length > 0 ? (
                    updates.map(update => (
                        <div key={update.id} className="group grid grid-cols-[25px_1fr_80px] items-start gap-4">
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">{update.title}</p>
                                <p className="text-sm text-muted-foreground">{update.description}</p>
                            </div>
                            <p className="text-xs text-muted-foreground justify-self-end">
                                {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    ))
                    ) : (
                    <p className="text-sm text-muted-foreground">No new updates.</p>
                    )}
                </div>
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/notifications">View all notifications</Link>
                </Button>
            </div>
        </PopoverContent>
    </Popover>
  );

  const headerClasses = cn(
    "sticky top-0 z-50 border-b transition-transform duration-300 h-16",
    show ? "translate-y-0" : "-translate-y-full",
    "bg-background/95 backdrop-blur-sm"
  );
  
  const megaMenuBg = "bg-background/95 backdrop-blur-sm";

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <header className={cn(headerClasses, 'z-50')}>
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
                <Link href={logoHref} className="flex items-center justify-center -ml-2">
                  <Image src="/logo.png" alt="IDL Education Logo" width={48} height={48} className="h-12 w-auto" />
                </Link>
                
                 <div className="flex-1 justify-center items-center gap-1 ml-4 hidden md:flex">
                    <nav className="items-center flex gap-x-4 h-full" onMouseLeave={handleMouseLeave}>
                          {!isIdlFoundationPage ? (
                            <>
                              <div onMouseEnter={() => handleMouseEnter('explore')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'explore'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                    Explore
                                </Button>
                              </div>
                              <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'apply'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                  Apply For
                                </Button>
                              </div>
                              <div onMouseEnter={() => handleMouseEnter('more')} className="h-full flex items-center">
                                <Button variant="ghost" data-active={activeMenu === 'more'} className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 data-[active=true]:bg-primary/5 data-[active=true]:text-primary rounded-md capitalize" style={{ fontSize: '90%' }}>
                                    More <ChevronDown className={cn('ml-1 h-4 w-4 transition-transform', activeMenu === 'more' && 'rotate-180')} />
                                </Button>
                              </div>
                               <div className="h-full flex items-center">
                                <Button asChild variant="ghost" className="h-8 px-3 text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 rounded-md capitalize" style={{ fontSize: '90%' }}>
                                  <Link href="/store" target="_blank" rel="noopener noreferrer">
                                    IDL Store
                                  </Link>
                                </Button>
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
                                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground leading-tight">Call now</p>
                                <p className="text-sm font-semibold text-foreground leading-tight">70-1111-7585</p>
                            </div>
                        </a>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {isClient && renderAuthSection()}
                    </div>
                    
                     <div className="md:hidden">
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn("text-foreground hover:bg-black/10 dark:hover:bg-white/20 hover:text-foreground h-10 w-10")}>
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                    </div>
                </div>
            </div>
            <SheetContent side="left" className="p-0 w-80">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        <Link href={logoHref} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <Image src="/logo.png" alt="IDL Education Logo" width={32} height={32} />
                            <span className="text-lg font-bold text-primary">{isIdlFoundationPage ? "IDL Foundation" : "IDL EDUCATION"}</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-4.5rem)] flex flex-col">
                    <ScrollArea className="flex-1">
                        {!isIdlFoundationPage && (
                        <div className="p-2">
                            <nav className="grid gap-1">
                            <Collapsible open={openMobileAccordion === 'all-courses'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'all-courses' : null)}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between text-base py-3 px-4 h-auto rounded-lg">
                                        <span className="flex items-center gap-3 font-semibold"><BookOpen className="h-5 w-5" /> All Courses</span>
                                        <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
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
                                    <Button variant="ghost" className="w-full justify-between text-base py-3 px-4 h-auto rounded-lg">
                                        <span className="flex items-center gap-3 font-semibold"><GraduationCap className="h-5 w-5" /> Apply For</span>
                                        <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
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
                                    <Button variant="ghost" className="w-full justify-between text-base py-3 px-4 h-auto rounded-lg">
                                        <span className="flex items-center gap-3 font-semibold"><MoreHorizontal className="h-5 w-5" /> More</span>
                                        <ChevronDown className="h-5 w-5 transition-transform data-[state=open]:rotate-180" />
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
                            <Button asChild variant="ghost" className="w-full justify-start text-base p-3 h-auto rounded-lg">
                            <Link href="/store" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-semibold">
                                <ShoppingCart className="h-5 w-5" />
                                IDL Store
                            </Link>
                            </Button>
                            <Button asChild variant="ghost" className="w-full justify-start text-base p-3 h-auto rounded-lg">
                               <a href="tel:7011117585" className="flex items-center gap-3 font-semibold">
                                  <Phone className="h-5 w-5" />
                                  Call Now
                              </a>
                            </Button>
                            </nav>
                        </div>
                        )}
                    </ScrollArea>
                    <div className="p-2 border-t">
                        {renderMobileAuthSection()}
                    </div>
                </div>
            </SheetContent>
        </header>
      </Sheet>
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
            {activeMenu === 'explore' && <AllCoursesMegaMenu />}
            {activeMenu === 'apply' && <MegaMenu links={applyForLinks} title="" onLinkClick={() => setActiveMenu(null)} />}
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
