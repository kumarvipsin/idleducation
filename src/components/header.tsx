'use client';
import Link from "next/link";
import {
    BookOpen, Menu, Phone, Mail, GraduationCap, FileText,
    ImageIcon, User, LayoutDashboard, LogOut, X, AlignJustify,
    ShoppingCart, MessageSquare, Info, ChevronDown, Heart, HelpCircle,
    FileType, UserPlus, IndianRupee, Landmark, ClipboardList,
    UserCircle, Building, Users, HandHeart, Banknote,
    Edit, Headset, CheckCircle2, MapPin, Search,
    Sparkles, PlayCircle, ShieldCheck, ChevronRight, Award, Bell
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

const megaMenuBg = "bg-white shadow-2xl";

const allCoursesCategories = [
    {
        id: "free-courses",
        name: "FREE COURSES",
        href: "/free-courses",
        subItems: [
            { label: "Class 8", href: "/free-courses?class=Class 8" },
            { label: "Class 9", href: "/free-courses?class=Class 9" },
            { label: "Class 10", href: "/free-courses?class=Class 10" },
            { label: "Class 11", href: "/free-courses?class=Class 11" },
            { label: "Class 12", href: "/free-courses?class=Class 12" },
            { label: "All Free Courses", href: "/free-courses" },
        ],
    },
    {
        id: "paid-courses",
        name: "PAID COURSES",
        href: "/paid-courses",
        subItems: [
            { label: "Class 9", href: "/paid-courses?class=Class 9" },
            { label: "Class 10", href: "/paid-courses?class=Class 10" },
            { label: "Class 11", href: "/paid-courses?class=Class 11" },
            { label: "Class 12", href: "/paid-courses?class=Class 12" },
            { label: "All Paid Courses", href: "/paid-courses" },
        ],
    },
    {
        id: "school-board",
        name: "SCHOOL BOARD",
        href: "/school",
        subItems: [
            { label: "Class 5 to 7", href: "/school?class=Class 5" },
            { label: "Class 8", href: "/school?class=Class 8" },
            { label: "Class 9", href: "/school?class=Class 9" },
            { label: "Class 10", href: "/school?class=Class 10" },
            { label: "Class 11", href: "/school?class=Class 11" },
            { label: "Class 12", href: "/school?class=Class 12" },
        ],
    },
    {
        id: "cuet-exam",
        name: "CUET EXAM",
        href: "/category/cuet",
        subItems: [
            { label: "Domain Subjects", href: "/category/cuet" },
            { label: "General Test (GT)", href: "/category/cuet" },
            { label: "Language Section", href: "/category/cuet" },
            { label: "All About CUET", href: "/resources/all-about-cuet" },
        ],
    },
    {
        id: "govt-exams",
        name: "GOVT. EXAMS",
        href: "/examcat",
        subItems: [
            { label: "SSC Exams", href: "/examcat" },
            { label: "Banking Exams", href: "/examcat" },
            { label: "Railway Exams", href: "/examcat" },
            { label: "Delhi Police", href: "/category/delhi-police" },
        ],
    },
    {
        id: "test-series",
        name: "TEST SERIES",
        href: "/resources/test-series",
        subItems: [
            { label: "Class 10 Test Series", href: "/resources/test-series" },
            { label: "Class 12 Test Series", href: "/resources/test-series" },
            { label: "CUET Mock Tests", href: "/resources/test-series" },
            { label: "Chapter Practice Tests", href: "/resources/test-series" },
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
    const [hoveredCourseCategory, setHoveredCourseCategory] = useState<string>("free-courses");
    const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
    const [donationCategory, setDonationCategory] = useState<string>("");
    const [donationStep, setDonationStep] = useState(1);
    const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
    const [donationAmount, setDonationAmount] = useState('');

    const [updates, setUpdates] = useState<Update[]>([]);
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
            title: "Learning & Updates",
            links: [
                { href: "/offline-centers", label: "Offline Centers", icon: <Building className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-blue-400 to-blue-600 text-white", description: "Visit our learning centers." },
                { href: "/workshop", label: "Workshops", icon: <Users className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-orange-400 to-orange-600 text-white", description: "Join our hands-on workshops." },
                { href: "/blog", label: "IDL Blog", icon: <FileText className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white", description: "Read articles and updates." },
                { href: "/updates", label: "Recent Updates", icon: <Bell className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-purple-400 to-purple-600 text-white", description: "Stay updated with latest news." },
            ]
        },
        {
            title: "Company",
            links: [
                { href: "/about", label: "About Us", icon: <Info className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white", description: "Learn more about our mission." },
                { href: "#", label: "Contact Us", icon: <MessageSquare className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-rose-400 to-rose-600 text-white", description: "Get in touch with us.", onClick: () => setIsContactOpen(true) },
                { href: '/gallery', label: "Gallery", icon: <ImageIcon className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-amber-400 to-amber-600 text-white", description: "Explore moments from our journey." },
            ]
        },
        {
            title: "Foundation",
            links: [
                { href: "/idl-foundation", label: "IDL Foundation", icon: <Heart className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-red-400 to-red-600 text-white", target: "_blank", description: "Support our cause." },
                { href: "/volunteer", label: "Volunteer", icon: <HandHeart className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-pink-400 to-pink-600 text-white", description: "Contribute to our mission." },
                { href: "#", label: "Register Now", icon: <UserPlus className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white", description: "Unlock full website access.", disabled: true },
            ]
        }
    ];

    const applyForLinks = [
        { href: "/admission", label: "Admission Form", icon: <FileType className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-blue-400 to-blue-600 text-white", description: "Start your journey today." },
        { href: "/book-demo", label: "Book Free Demo", icon: <GraduationCap className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-orange-400 to-orange-600 text-white", description: "Experience our teaching style." },
        { href: "/feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white", description: "Help us improve." },
        { href: "/student-enquiry", label: "Student Enquiry", icon: <HelpCircle className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-purple-400 to-purple-600 text-white", description: "Have questions? Send us an enquiry." },
        { href: "/scholarship", label: "Scholarship", icon: <Award className="h-4 w-4" />, colorClasses: "bg-gradient-to-br from-amber-400 to-amber-600 text-white", description: "Apply for our talent scholarship." },
    ];

    const navItemClass = "relative h-full flex items-center py-2 px-3 text-[13px] font-bold tracking-tight text-foreground hover:text-primary hover:bg-transparent rounded-none uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100";

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
            <Link href="/login" className="group relative px-5 py-1.5 rounded-md border border-primary transition-all duration-300 active:scale-95 overflow-hidden h-9 flex items-center">
                <div className="absolute inset-0 translate-y-full bg-primary transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative z-10 text-[10px] font-extrabold uppercase tracking-wide text-primary group-hover:text-white transition-colors">Login</span>
            </Link>
        );
    };

    return (
        <>
            <header className={cn(
                "sticky top-0 z-50 border-b transition-transform duration-300 h-16 bg-background/95 backdrop-blur-sm",
                show ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center h-full">
                    <Link href="/" className="flex items-center justify-center -ml-2">
                        <Image src="/logo.png" alt="IDL Education Logo" width={48} height={48} className="h-12 w-auto" />
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
                                                    {allCoursesCategories.map(c => (
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
                                                        const activeCategory = allCoursesCategories.find(c => c.id === hoveredCourseCategory) || allCoursesCategories[0];
                                                        return activeCategory.subItems.map((sub, idx) => (
                                                            <Link
                                                                key={idx}
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
                                                    <Link
                                                        key={l.label}
                                                        href={l.href}
                                                        onClick={() => setActiveMenu(null)}
                                                        className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left border border-transparent hover:border-border"
                                                    >
                                                        <div className="text-left flex-1">
                                                            <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">{l.label}</p>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                    </Link>
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
                                                                const isDisabled = link.disabled || link.label === "Register Now" || (link.href === "#" && !link.onClick);
                                                                return (
                                                                    <Link
                                                                        key={link.label}
                                                                        href={isDisabled ? '#' : link.href}
                                                                        target={link.target}
                                                                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
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
                    <div className="flex items-center gap-1">
                        <div className="hidden md:flex items-center gap-2">
                            <a href="tel:8860040010" className="flex items-center gap-2 p-1.5 rounded-xl transition-all">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div><p className="text-[8px] font-extrabold text-muted-foreground tracking-tight leading-tight uppercase">CALL NOW</p><p className="text-xs font-extrabold text-foreground leading-tight">8860040010</p></div>
                            </a>
                        </div>
                        <div className="flex items-center gap-1">
                            {isClient && renderAuthSection()}
                        </div>
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground h-10 w-10"><Menu className="h-5 w-5" /><span className="sr-only">Toggle menu</span></Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80">
                                <SheetHeader className="p-4 border-b bg-muted/10 text-left">
                                    <SheetTitle asChild>
                                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-row items-center justify-start gap-3 group text-left">
                                            <div className="relative w-16 h-16 shrink-0">
                                                <Image src="/logo.png" alt="IDL Education Logo" fill className="object-contain" />
                                            </div>
                                            <div className="flex flex-col leading-tight text-left">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-3xl font-extrabold text-primary tracking-tight uppercase">IDL</span>
                                                    <div className="flex flex-col text-[8px] font-bold text-muted-foreground tracking-tight leading-[1.1]">
                                                        <span>Institute Of</span>
                                                        <span>Distance Learning Pvt. Ltd.</span>
                                                    </div>
                                                </div>
                                                <span className="text-3xl font-extrabold text-primary tracking-tight -mt-1">Education</span>
                                            </div>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="h-[calc(100vh-5.5rem)] flex flex-col">
                                    <ScrollArea className="flex-1">
                                        <div className="p-4 space-y-6">
                                            <div className="space-y-3">
                                                <Collapsible open={openMobileAccordion === 'all-courses'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'all-courses' : null)}>
                                                    <CollapsibleTrigger asChild>
                                                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                            <span className="flex items-center gap-3 font-bold text-xs uppercase tracking-tight text-primary">
                                                                <BookOpen className="h-4 w-4" />
                                                                All Courses
                                                            </span>
                                                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                        </button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-1 py-3 bg-white space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {allCoursesCategories.map((cat) => (
                                                            <div key={cat.id} className="space-y-1">
                                                                <Link
                                                                    href={cat.href}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-wider text-left border-l-4 border-primary pl-2"
                                                                >
                                                                    <span>{cat.name}</span>
                                                                    <ChevronRight className="w-3.5 h-3.5 text-primary/50" />
                                                                </Link>
                                                                <div className="space-y-1 pl-2">
                                                                    {cat.subItems.map((sub, sIdx) => (
                                                                        <Link
                                                                            key={sIdx}
                                                                            href={sub.href}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left border border-transparent hover:border-border"
                                                                        >
                                                                            <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">{sub.label}</p>
                                                                            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-all" />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>

                                                <Collapsible open={openMobileAccordion === 'apply'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'apply' : null)}>
                                                    <CollapsibleTrigger asChild>
                                                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                            <span className="flex items-center gap-3 font-bold text-xs uppercase tracking-tight text-primary">
                                                                <GraduationCap className="h-4 w-4" />
                                                                Apply For
                                                            </span>
                                                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                        </button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-1 py-3 bg-white space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {applyForLinks.map(({ href, label, icon, description, colorClasses }) => (
                                                            <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98] text-left">
                                                                <div className="text-left">
                                                                    <p className="font-medium text-[13px] text-foreground leading-tight">{label}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>

                                                <Collapsible open={openMobileAccordion === 'more'} onOpenChange={(isOpen) => setOpenMobileAccordion(isOpen ? 'more' : null)}>
                                                    <CollapsibleTrigger asChild>
                                                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-muted transition-all border border-border group/trigger">
                                                            <span className="flex items-center gap-3 font-bold text-xs uppercase tracking-tight text-primary">
                                                                <AlignJustify className="h-4 w-4" />
                                                                More
                                                            </span>
                                                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/trigger:rotate-180 opacity-40" />
                                                        </button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-1 py-3 bg-white space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {moreMenuGroups.map((group) => (
                                                            <div key={group.title} className="space-y-2">
                                                                <h4 className="px-4 text-[10px] font-semibold text-primary uppercase tracking-widest text-left">{group.title}</h4>
                                                                <div className="space-y-1">
                                                                    {group.links.map((link) => {
                                                                        const isDisabled = link.disabled || link.label === "Register Now" || (link.href === "#" && !link.onClick);
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
                                                                                    "group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-all active:scale-[0.98] text-left",
                                                                                    isDisabled && "opacity-50 grayscale pointer-events-none"
                                                                                )}
                                                                            >
                                                                                <div className="text-left">
                                                                                    <p className="font-medium text-[13px] text-foreground leading-tight">{link.label}</p>
                                                                                </div>
                                                                            </Link>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t mt-auto bg-muted/10">
                                            {user ? (
                                                <Link href={getProfilePath(user)} className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Avatar className="h-10 w-10">
                                                        <GcsImage filePath={user.photoURL ?? ''} alt={user.name ?? ''} fill className="rounded-full object-cover" />
                                                        <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-sm font-extrabold truncate max-w-[120px]">{user.name}</span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-extrabold">{user.role}</span>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <Button variant="outline" className="w-full font-extrabold uppercase tracking-wide h-11 rounded-xl">LOGIN</Button>
                                                    </Link>
                                                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <Button className="w-full font-extrabold uppercase tracking-wide h-11 rounded-xl">SIGNUP</Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>



            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-white p-0 overflow-hidden">
                    <DialogHeader className="text-center p-8 pb-0">
                        <DialogTitle className="text-2xl font-extrabold text-primary tracking-tighter">Contact Us</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-[13px] font-extrabold">Have a query? Drop us a line below.</DialogDescription>
                    </DialogHeader>
                    <ContactForm onSuccess={() => setIsContactOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
