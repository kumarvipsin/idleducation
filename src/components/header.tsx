'use client';
import Link from "next/link";
import {
    BookOpen, Menu, Phone, Mail, GraduationCap, FileText,
    ImageIcon, User, LayoutDashboard, LogOut, X, AlignJustify,
    ShoppingCart, MessageSquare, Info, ChevronDown, Heart, HelpCircle,
    FileType, UserPlus, IndianRupee, Landmark, ClipboardList,
    UserCircle, Building, Users, HandHeart, Banknote,
    Edit, Headset, CheckCircle2, MapPin, Search,
    Sparkles, PlayCircle, ShieldCheck, ChevronRight, Award, Bell, Rocket
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
import { createRazorpayOrder, recordDonation, getUpdates } from "@/app/actions";
import Image from "next/image";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader,
    DialogTitle, DialogTrigger
} from "./ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { cn } from "@/lib/utils";
import { GcsImage } from "./gcs-image";
import { ScrollArea } from "./ui/scroll-area";
import { ContactForm } from "./contact-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { AuthModal } from "./auth-modal";
import { AdmissionModal } from "./admission-modal";
import { BookDemoModal } from "./book-demo-modal";
import { FeedbackModal } from "./feedback-modal";
import { StudentEnquiryModal } from "./student-enquiry-modal";
import { ScholarshipModal } from "./scholarship-modal";
import { ContactModal } from "./contact-modal";
import { RecentUpdatesModal } from "./recent-updates-modal";
import { getAllCoursesCategories, type CourseCategory } from "@/app/actions/course-categories";

const megaMenuBg = "bg-white shadow-2xl";

const DEFAULT_COURSE_CATEGORIES: CourseCategory[] = [
    {
        id: "cat_free_courses",
        name: "FREE COURSES",
        slug: "free-courses",
        href: "/free-courses",
        order: 1,
        status: "active",
        subItems: [
            { id: "sub_class_9", label: "Class 9", classNumber: 9, slug: "class-9", href: "/free-courses?class=Class 9", order: 1, status: "active" },
            { id: "sub_class_10", label: "Class 10", classNumber: 10, slug: "class-10", href: "/free-courses?class=Class 10", order: 2, status: "active" },
        ],
    },
];

const donationCategories = [
    { title: "Skill Trainings", description: "Empower individuals with valuable skills.", goal: 100000, raised: 1500 },
    { title: "Children Education", description: "The gift of education for all.", goal: 100000, raised: 2200 },
    { title: "Tree Plantation", description: "Nurture a greener planet.", goal: 100000, raised: 1800 },
    { title: "Women Empowerment", description: "Uplift and empower women.", goal: 5000000, raised: 1250000 },
    { title: "Medical Assistance", description: "Provide critical healthcare.", goal: 3000000, raised: 300000 },
    { title: "Old Age Home", description: "Dignity and care for elders.", goal: 2500000, raised: 800000 },
];

const MegaMenu = ({ links, onLinkClick, iconShape = 'circle' }: { links?: any[], onLinkClick?: () => void, iconShape?: 'circle' | 'diamond' }) => (
    <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {links && links.map((link) => {
                // Register Now is specifically disabled per user request
                const isDisabled = link.disabled || link.label === "Register Now" || (link.href === "#" && !link.onClick);
                const handleClick = (e: React.MouseEvent) => {
                    if (link.onClick) {
                        e.preventDefault();
                        link.onClick();
                    }
                    if (!isDisabled) {
                        onLinkClick?.();
                    }
                };

                return (
                    <Link
                        key={link.label}
                        href={isDisabled ? '#' : link.href}
                        target={link.target}
                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                        onClick={handleClick}
                        className={cn(
                            "group relative flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-border/50 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300 hover:shadow-sm active:scale-[0.98] text-left",
                            isDisabled && "opacity-50 grayscale cursor-not-allowed pointer-events-none"
                        )}
                    >
                        {link.icon && (
                            <div className={cn(
                                "flex items-center justify-center shadow-md shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
                                iconShape === 'circle' ? "w-9 h-9 rounded-full" : "w-8 h-8 rounded-lg",
                                link.colorClasses || link.color || "bg-primary/10 text-primary"
                            )}>
                                <div className={cn(iconShape === 'diamond' && "")}>
                                    {link.icon}
                                </div>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-[13px] text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{link.label}</p>
                            <p className="text-[10px] font-semibold text-muted-foreground line-clamp-1 opacity-80 mt-0.5">{link.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary/20 group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                );
            })}
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
    const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(DEFAULT_COURSE_CATEGORIES);
    const [hoveredCourseCategory, setHoveredCourseCategory] = useState<string>("cat_free_courses");

    useEffect(() => {
        let isMounted = true;
        getAllCoursesCategories().then((res) => {
            if (isMounted && res.success && res.data && res.data.length > 0) {
                setCourseCategories(res.data);
                if (!res.data.some(c => c.id === hoveredCourseCategory)) {
                    setHoveredCourseCategory(res.data[0].id);
                }
            }
        });
        return () => { isMounted = false; };
    }, []);
    const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
    const [openMobileSubAccordion, setOpenMobileSubAccordion] = useState<string | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'signup'>('login');
    const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
    const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
    const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);
    const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);

    // Auto-open updates modal if redirected from /updates or ?updates=open
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('updates') === 'open') {
                setIsUpdatesOpen(true);
            }
        }
    }, [pathname]);

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
    const [donationCategory, setDonationCategory] = useState<string>("");
    const [donationStep, setDonationStep] = useState(1);
    const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
    const [donationAmount, setDonationAmount] = useState('');

    const [updates, setUpdates] = useState<any[]>([]);
    const [hasNewUpdates, setHasNewUpdates] = useState(false);

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
            name: 'IDL Education',
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

    const moreMenuGroups = [
        {
            title: "Explore",
            links: [
                { href: "/offline-centers", label: "Offline Centers", icon: <Building className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-blue-400 to-blue-600 text-white", description: "Visit our learning centers." },
                { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white", description: "Read articles and updates." },
                { href: '/gallery', label: "Gallery", icon: <ImageIcon className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-amber-400 to-amber-600 text-white", description: "Explore moments from our journey." },
            ]
        },
        {
            title: "Company",
            links: [
                { href: "/about", label: "About Us", icon: <Info className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white", description: "Learn more about our mission." },
                { href: "#", label: "Contact Us", icon: <MessageSquare className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-rose-400 to-rose-600 text-white", description: "Get in touch with us.", onClick: () => setIsContactOpen(true) },
                { href: "/journey", label: "The Journey", icon: <Rocket className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-amber-400 to-amber-600 text-white", description: "Milestones and evolution of IDL." },
            ]
        },
    ];

    const applyForLinks = [
        { href: "#", label: "Admission Form", icon: <FileType className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-blue-400 to-blue-600 text-white", description: "Start your journey today.", onClick: () => setIsAdmissionOpen(true) },
        { href: "#", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-orange-400 to-orange-600 text-white", description: "Experience our teaching style.", onClick: () => setIsBookDemoOpen(true) },
        { href: "#", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white", description: "Help us improve.", onClick: () => setIsFeedbackOpen(true) },
        { href: "#", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-purple-400 to-purple-600 text-white", description: "Have questions? Send us an enquiry.", onClick: () => setIsEnquiryOpen(true) },
        { href: "#", label: "Scholarship", icon: <Award className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-amber-400 to-amber-600 text-white", description: "Apply for our talent scholarship.", onClick: () => setIsScholarshipOpen(true) },
    ];

    const navItemClass = "relative h-full flex items-center py-2 px-3 text-[13px] font-bold tracking-tight text-foreground hover:text-primary hover:bg-transparent rounded-none uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100";

    const renderAuthSection = () => {
        if (loading) return <Skeleton className="h-9 w-20 rounded-md" />;

        if (user) {
            return (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Link
                        href={getDashboardPath(user)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-md border border-primary text-primary hover:bg-primary hover:text-white font-extrabold text-[9.5px] sm:text-[10px] uppercase tracking-wide transition-colors whitespace-nowrap h-8 sm:h-9 flex items-center cursor-pointer"
                    >
                        ADMIN
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 font-extrabold text-[9.5px] sm:text-[10px] uppercase tracking-wide transition-colors whitespace-nowrap h-8 sm:h-9 flex items-center cursor-pointer"
                    >
                        LOGOUT
                    </button>
                </div>
            );
        }

        return (
            <button 
                type="button"
                onClick={() => { setAuthDefaultMode('login'); setIsAuthOpen(true); }}
                className="group relative px-2.5 sm:px-3.5 py-1.5 rounded-md border border-primary transition-all duration-300 active:scale-95 overflow-hidden h-8 sm:h-9 flex items-center cursor-pointer whitespace-nowrap"
            >
                <div className="absolute inset-0 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative z-10 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-primary group-hover:text-white transition-colors">
                    LOGIN / REGISTER
                </span>
            </button>
        );
    };

    return (
        <>
            <header 
                data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
                className={cn(
                    "sticky top-0 z-[60] border-b transition-transform duration-300 h-16 bg-background/95 backdrop-blur-sm",
                    show ? "translate-y-0" : "-translate-y-full"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
                    <Link href="/" className="flex items-center justify-center -ml-2">
                        <Image src="/idllogo.png" alt="IDL Education Logo" width={48} height={48} className="h-12 w-auto" />
                    </Link>

                    <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex">
                        <nav className="items-center flex gap-x-1 h-full" onMouseLeave={handleMouseLeave}>
                            {!pathname.startsWith('/idl-foundation') ? (
                                <>
                                    <div onMouseEnter={() => handleMouseEnter('explore')} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'explore' && "after:scale-x-100 text-primary")}>ALL COURSES</Button>
                                        <div className={cn(
                                            "absolute top-full left-0 transition-all duration-300 ease-in-out z-50 pt-2",
                                            activeMenu === 'explore' ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"
                                        )}>
                                            <div className="bg-white dark:bg-slate-950 border rounded-xl shadow-lg p-2 flex flex-row divide-x divide-border">
                                                {/* Left Column: Categories */}
                                                <div className="w-56 flex flex-col gap-1 pr-2">
                                                    {courseCategories.map(c => (
                                                        <div
                                                            key={c.id}
                                                            onMouseEnter={() => setHoveredCourseCategory(c.id)}
                                                            className="w-full"
                                                        >
                                                            <Link
                                                                href={c.href}
                                                                onClick={() => setActiveMenu(null)}
                                                                className={cn(
                                                                    "group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left border border-transparent",
                                                                    hoveredCourseCategory === c.id
                                                                        ? "bg-muted/70 hover:border-border text-primary font-medium"
                                                                        : "hover:bg-muted/50 hover:border-border text-foreground"
                                                                )}
                                                            >
                                                                <div className="text-left flex-1">
                                                                    <p className={cn(
                                                                        "font-medium text-[13px] leading-tight transition-colors",
                                                                        hoveredCourseCategory === c.id ? "text-primary font-medium" : "text-foreground group-hover:text-primary"
                                                                    )}>
                                                                        {c.name}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className={cn(
                                                                    "w-4 h-4 transition-all",
                                                                    hoveredCourseCategory === c.id
                                                                        ? "text-primary translate-x-0.5 opacity-100"
                                                                        : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5"
                                                                )} />
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Right Column: Classes / Sub-courses */}
                                                <div className="w-60 pl-2 flex flex-col gap-1">
                                                    {(() => {
                                                        const activeCategory = courseCategories.find(c => c.id === hoveredCourseCategory) || courseCategories[0];
                                                        return activeCategory?.subItems?.map((sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={sub.href}
                                                                onClick={() => setActiveMenu(null)}
                                                                className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left border border-transparent hover:border-border"
                                                            >
                                                                <div className="text-left flex-1">
                                                                    <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">
                                                                        {sub.label}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                            </Link>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'apply' && "after:scale-x-100 text-primary")}>APPLY FOR</Button>
                                        <div className={cn(
                                            "absolute top-full left-0 transition-all duration-300 ease-in-out w-72 z-50 pt-2",
                                            activeMenu === 'apply' ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                                        )}>
                                            <div className="bg-white dark:bg-slate-950 border rounded-xl shadow-lg p-2 flex flex-col gap-1">
                                                {applyForLinks.map(l => (
                                                    <button
                                                        key={l.label}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setActiveMenu(null);
                                                            if (l.onClick) {
                                                                l.onClick();
                                                            } else if (l.href && l.href !== '#') {
                                                                router.push(l.href);
                                                            }
                                                        }}
                                                        className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left border border-transparent hover:border-border w-full"
                                                    >
                                                        <div className="text-left flex-1">
                                                            <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">{l.label}</p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center">
                                        <Button asChild variant="ghost" className={navItemClass}>
                                            <Link href="/store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                                <ShoppingCart className="h-4 w-4" /><span>STORE</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <div onMouseEnter={() => handleMouseEnter('more')} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'more' && "after:scale-x-100 text-primary")}>MORE</Button>
                                        <div className={cn(
                                            "absolute top-full right-0 md:left-0 transition-all duration-300 ease-in-out w-80 z-50 pt-2",
                                            activeMenu === 'more' ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                                        )}>
                                            <div className="bg-white dark:bg-slate-950 border rounded-xl shadow-lg p-4 flex flex-col gap-4">
                                                {moreMenuGroups.map(group => (
                                                    <div key={group.title} className="space-y-3">
                                                        <h4 className="text-[11px] font-semibold text-primary uppercase tracking-widest border-l-4 border-primary pl-3 text-left">{group.title}</h4>
                                                        <div className="flex flex-col gap-1">
                                                            {group.links.map(link => {
                                                                const isDisabled = (link as any).disabled || link.label === "Register Now" || (link.href === "#" && !link.onClick);
                                                                return (
                                                                    <Link
                                                                        key={link.label}
                                                                        href={isDisabled ? '#' : link.href}
                                                                        target={(link as any).target}
                                                                        rel={(link as any).target === '_blank' ? 'noopener noreferrer' : undefined}
                                                                        onClick={(e) => {
                                                                            if (link.onClick) { e.preventDefault(); link.onClick(); }
                                                                            if (!isDisabled) setActiveMenu(null);
                                                                        }}
                                                                        className={cn(
                                                                            "group relative flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left border border-transparent hover:border-border",
                                                                            isDisabled && "opacity-50 grayscale pointer-events-none"
                                                                        )}
                                                                    >
                                                                        <div className="text-left flex-1">
                                                                            <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">{link.label}</p>
                                                                        </div>
                                                                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-x-4 text-[10px] font-extrabold tracking-tight">
                                    <a href="tel:8860040010" className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /> 8860040010</a>
                                    <Separator orientation="vertical" className="h-4 bg-foreground/20" />
                                    <a href="mailto:info@idleducation.in" className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /> info@idleducation.in</a>
                                </div>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5">
                        {/* Call Action: Visible on Desktop only. On Mobile, call action is inside the mobile drawer */}
                        <a 
                            href="tel:8860040010" 
                            aria-label="Call IDL Education at 8860040010"
                            className="group hidden md:flex items-center gap-2 lg:gap-2.5 py-1 pl-1 pr-2 rounded-full transition-all duration-200 shrink-0 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                        >
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#EEF4FF] dark:bg-blue-950/60 border border-[#D6E4FF] dark:border-blue-900/60 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-[#E2EDFF] dark:group-hover:bg-blue-900/80 group-hover:border-blue-300 dark:group-hover:border-blue-800">
                                <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#1F4FA3] dark:text-blue-400 transition-transform duration-200 group-hover:scale-105" />
                            </div>
                            <span className="text-[15px] lg:text-[17.5px] font-bold text-[#0B1F4B] dark:text-slate-100 tracking-tight leading-none group-hover:text-[#1F4FA3] dark:group-hover:text-blue-400 transition-colors duration-200">
                                8860040010
                            </span>
                        </a>

                        {/* Recent Updates Notification Bell Trigger */}
                        <button 
                            type="button"
                            onClick={() => setIsUpdatesOpen(true)}
                            aria-label="Recent Updates"
                            title="Recent Updates"
                            className="group relative w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-[#EEF4FF] dark:bg-blue-950/60 border border-[#D6E4FF] dark:border-blue-900/60 flex items-center justify-center shrink-0 transition-all duration-200 hover:bg-[#E2EDFF] dark:hover:bg-blue-900/80 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer"
                        >
                            <Bell className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#1F4FA3] dark:text-blue-400 transition-transform duration-200 group-hover:scale-105" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white dark:ring-slate-900" />
                        </button>

                        <div className="flex items-center">
                            {isClient && renderAuthSection()}
                        </div>

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground h-9 w-9 -mr-1">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent 
                                side="left" 
                                data-mobile-drawer="true"
                                className="fixed inset-y-0 left-0 z-[9999] p-0 gap-0 w-full max-w-full flex flex-col h-full bg-gradient-to-b from-white via-[#FAFBFD] to-[#F3F7FC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-none shadow-none rounded-none overflow-hidden [&>button.absolute]:hidden"
                            >
                                {/* Ultra-subtle IDL ambient depth: Faint dotted pattern & soft blue glow */}
                                <div className="absolute inset-0 bg-[radial-gradient(#102A68_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
                                <div className="absolute bottom-32 right-[-10%] w-[320px] h-[320px] bg-blue-500/[0.025] dark:bg-blue-400/[0.015] rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute top-1/3 left-[-10%] w-[240px] h-[240px] bg-[#102A68]/[0.015] rounded-full blur-3xl pointer-events-none" />

                                {/* Full-Screen Top Header: Tightened 68-72px height, balanced padding, real logo, clean X */}
                                <SheetHeader className="px-5 sm:px-6 border-b border-slate-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm text-left flex flex-row items-center justify-between h-[68px] sm:h-[72px] min-h-[68px] sm:min-h-[72px] max-h-[68px] sm:max-h-[72px] space-y-0 shrink-0 relative z-10">
                                    <SheetTitle asChild>
                                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center group">
                                            <Image 
                                              src="/idllogo.png" 
                                              alt="IDL Education Logo" 
                                              width={100} 
                                              height={100} 
                                              className="h-[48px] sm:h-[52px] w-auto object-contain object-left" 
                                              priority 
                                            />
                                        </Link>
                                    </SheetTitle>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0 cursor-pointer"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5 stroke-[2]" />
                                    </button>
                                </SheetHeader>

                                {/* Body - Navigation & Controlled Spacing */}
                                <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col justify-between relative z-10">
                                    <div className="pt-2 sm:pt-2.5 pb-6">
                                        <nav className="divide-y divide-slate-100 dark:divide-slate-800/60 border-b border-slate-100 dark:border-slate-800/60 text-left">
                                            {/* 1. ALL COURSES ROW */}
                                            <Collapsible 
                                                open={openMobileAccordion === 'all-courses'} 
                                                onOpenChange={(isOpen: boolean) => setOpenMobileAccordion(isOpen ? 'all-courses' : null)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <button 
                                                        type="button"
                                                        className="px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-160 text-left cursor-pointer"
                                                    >
                                                        <span className="uppercase">ALL COURSES</span>
                                                        <ChevronDown className={cn(
                                                            "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-180 ease-out shrink-0",
                                                            openMobileAccordion === 'all-courses' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                        )} />
                                                    </button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="pb-4 pt-1 px-6 sm:px-7 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200">
                                                    {/* Vertical branch line for level 1 categories */}
                                                    <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-2 pl-4 space-y-3.5 py-1">
                                                        {courseCategories.map((cat) => {
                                                            const isSubOpen = openMobileSubAccordion === cat.id;
                                                            return (
                                                                <div key={cat.id} className="space-y-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setOpenMobileSubAccordion(isSubOpen ? null : cat.id)}
                                                                        className="w-full text-left font-semibold text-[15px] text-slate-800 dark:text-slate-200 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors flex items-center justify-between py-1 cursor-pointer"
                                                                    >
                                                                        <span>{cat.name}</span>
                                                                        <ChevronDown className={cn(
                                                                            "w-3.5 h-3.5 text-slate-400 transition-transform duration-180 ease-out shrink-0 mr-1",
                                                                            isSubOpen && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                                        )} />
                                                                    </button>
                                                                    {/* Level 2 sub-items with nested vertical branch line */}
                                                                    {isSubOpen && (
                                                                        <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-2 pl-3.5 py-1.5 space-y-2">
                                                                            {cat.subItems.map((sub) => (
                                                                                <Link
                                                                                    key={sub.id}
                                                                                    href={sub.href}
                                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                                    className="block text-[14px] text-slate-600 dark:text-slate-300 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors py-0.5"
                                                                                >
                                                                                    {sub.label}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>

                                            {/* 2. APPLY FOR ROW */}
                                            <Collapsible 
                                                open={openMobileAccordion === 'apply'} 
                                                onOpenChange={(isOpen: boolean) => setOpenMobileAccordion(isOpen ? 'apply' : null)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <button 
                                                        type="button"
                                                        className="px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-160 text-left cursor-pointer"
                                                    >
                                                        <span className="uppercase">APPLY FOR</span>
                                                        <ChevronDown className={cn(
                                                            "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-180 ease-out shrink-0",
                                                            openMobileAccordion === 'apply' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                        )} />
                                                    </button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="pb-4 pt-1 px-6 sm:px-7 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200">
                                                    {/* Vertical branch line */}
                                                    <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-2 pl-4 space-y-2.5 py-1">
                                                        {applyForLinks.map(({ href, label, onClick: linkOnClick }) => (
                                                            <button
                                                                key={label}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setIsMobileMenuOpen(false);
                                                                    if (linkOnClick) {
                                                                      linkOnClick();
                                                                    } else if (href && href !== '#') {
                                                                        router.push(href);
                                                                    }
                                                                }}
                                                                className="block w-full text-left text-[14.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors py-1 cursor-pointer"
                                                            >
                                                                {label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>

                                            {/* 3. MORE ROW */}
                                            <Collapsible 
                                                open={openMobileAccordion === 'more'} 
                                                onOpenChange={(isOpen: boolean) => setOpenMobileAccordion(isOpen ? 'more' : null)}
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <button 
                                                        type="button"
                                                        className="px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-160 text-left cursor-pointer"
                                                    >
                                                        <span className="uppercase">MORE</span>
                                                        <ChevronDown className={cn(
                                                            "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-180 ease-out shrink-0",
                                                            openMobileAccordion === 'more' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                        )} />
                                                    </button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="pb-4 pt-1 px-6 sm:px-7 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200">
                                                    {/* Vertical branch line */}
                                                    <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-2 pl-4 space-y-4 py-1">
                                                        {moreMenuGroups.map((group) => (
                                                            <div key={group.title} className="space-y-2">
                                                                <span className="text-[11px] font-bold text-[#102A68] dark:text-blue-400 uppercase tracking-wider block">
                                                                    {group.title}
                                                                </span>
                                                                <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-1.5 pl-3.5 space-y-2">
                                                                    {group.links.map((link) => {
                                                                        const isDisabled = (link as any).disabled || link.label === "Register Now" || (link.href === "#" && !link.onClick);
                                                                        const handleClick = (e: React.MouseEvent) => {
                                                                            if (link.onClick) {
                                                                                e.preventDefault();
                                                                                link.onClick();
                                                                            }
                                                                            if (!isDisabled) {
                                                                                setIsMobileMenuOpen(false);
                                                                            }
                                                                        };

                                                                        return (
                                                                            <Link
                                                                                key={link.label}
                                                                                href={isDisabled ? '#' : link.href}
                                                                                onClick={handleClick}
                                                                                className={cn(
                                                                                    "block text-[14px] text-slate-600 dark:text-slate-300 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors py-0.5",
                                                                                    isDisabled && "opacity-50 grayscale pointer-events-none"
                                                                                )}
                                                                            >
                                                                                {link.label}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Store link inside More folder */}
                                                        <div className="pt-1">
                                                            <Link
                                                                href="/store"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="flex items-center gap-2 text-[14.5px] font-semibold text-slate-800 dark:text-slate-200 hover:text-[#102A68] dark:hover:text-blue-400 transition-colors py-1"
                                                            >
                                                                <ShoppingCart className="h-4 w-4 text-[#102A68] dark:text-blue-400" />
                                                                <span>Store</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </nav>
                                    </div>

                                    {/* Bottom Call Area: Integrated footer background, grounded, respecting safe areas */}
                                    <div className="px-5 sm:px-6 py-4 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm shrink-0 mt-auto relative z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                                        <a 
                                            href="tel:8860040010" 
                                            className="w-full flex items-center justify-center gap-3 h-12 sm:h-12.5 rounded-xl bg-[#0B1F4B] hover:bg-[#071536] dark:bg-primary dark:hover:bg-primary/90 text-white transition-all duration-180 shadow-xs active:scale-[0.99] cursor-pointer"
                                        >
                                            <div className="w-7.5 h-7.5 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                                <Phone className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                                            </div>
                                            <div className="flex items-baseline gap-2.5">
                                                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-blue-200/90 dark:text-blue-200/80">
                                                    CALL NOW
                                                </span>
                                                <span className="text-[16px] font-bold text-white tracking-tight">
                                                    8860040010
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <AuthModal 
                isOpen={isAuthOpen} 
                onOpenChange={setIsAuthOpen} 
                defaultMode={authDefaultMode} 
            />

            <AdmissionModal
                isOpen={isAdmissionOpen}
                onOpenChange={setIsAdmissionOpen}
            />

            <BookDemoModal
                isOpen={isBookDemoOpen}
                onOpenChange={setIsBookDemoOpen}
            />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onOpenChange={setIsFeedbackOpen}
            />

            <StudentEnquiryModal
                isOpen={isEnquiryOpen}
                onOpenChange={setIsEnquiryOpen}
            />

            <ScholarshipModal
                isOpen={isScholarshipOpen}
                onOpenChange={setIsScholarshipOpen}
            />

            <ContactModal
                isOpen={isContactOpen}
                onOpenChange={setIsContactOpen}
            />

            <RecentUpdatesModal
                isOpen={isUpdatesOpen}
                onOpenChange={setIsUpdatesOpen}
            />
        </>
    );
}
