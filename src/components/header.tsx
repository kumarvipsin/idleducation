'use client';
import Link from "next/link";
import {
    BookOpen, Menu, Phone, Mail, GraduationCap, FileText,
    ImageIcon, User, LayoutDashboard, LogOut, X, AlignJustify,
    ShoppingCart, MessageSquare, Info, ChevronDown, Heart, HelpCircle,
    FileType, UserPlus, IndianRupee, Landmark, ClipboardList,
    UserCircle, Building, Users, HandHeart, Banknote,
    Edit, Headset, CheckCircle2, MapPin, Search,
    Sparkles, PlayCircle, ShieldCheck, ChevronRight, Award, Bell, Rocket,
    Atom, Stethoscope, Presentation, MessageSquareText, CircleHelp, Target
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
        id: "cat_cbse",
        name: "CBSE",
        slug: "cbse",
        href: "/school",
        order: 1,
        status: "active",
        subItems: [
            {
                id: "sub_cbse_syllabus",
                label: "CBSE Syllabus",
                slug: "cbse-syllabus",
                href: "/school",
                order: 1,
                status: "active",
                items: [
                    { id: "cbse_syl_9", label: "Class 9", classNumber: 9, slug: "class-9", href: "/school?class=Class 9", order: 1, status: "active" },
                    { id: "cbse_syl_10", label: "Class 10", classNumber: 10, slug: "class-10", href: "/school?class=Class 10", order: 2, status: "active" },
                    { id: "cbse_syl_11", label: "Class 11", classNumber: 11, slug: "class-11", href: "/school?class=Class 11", order: 3, status: "active" },
                    { id: "cbse_syl_12", label: "Class 12", classNumber: 12, slug: "class-12", href: "/school?class=Class 12", order: 4, status: "active" },
                ],
            },
            {
                id: "sub_cbse_exam",
                label: "CBSE Exam",
                slug: "cbse-exam",
                href: "/school",
                order: 2,
                status: "active",
                items: [
                    { id: "cbse_exam_10", label: "Class 10", classNumber: 10, slug: "class-10", href: "/school?class=Class 10", order: 1, status: "active" },
                    { id: "cbse_exam_12", label: "Class 12", classNumber: 12, slug: "class-12", href: "/school?class=Class 12", order: 2, status: "active" },
                ],
            },
        ],
    },
    {
        id: "cat_jee",
        name: "JEE",
        slug: "jee",
        href: "/category/iit-jee",
        order: 2,
        status: "active",
        subItems: [
            {
                id: "sub_jee_main",
                label: "JEE Main",
                slug: "jee-main",
                href: "/category/iit-jee",
                order: 1,
                status: "active",
                items: [
                    { id: "jee_main_11", label: "Class 11", classNumber: 11, slug: "class-11", href: "/category/iit-jee?target=class-11", order: 1, status: "active" },
                    { id: "jee_main_12", label: "Class 12", classNumber: 12, slug: "class-12", href: "/category/iit-jee?target=class-12", order: 2, status: "active" },
                    { id: "jee_main_dropper", label: "Dropper / Repeater", slug: "dropper", href: "/category/iit-jee?target=dropper", order: 3, status: "active" },
                ],
            },
            {
                id: "sub_jee_adv",
                label: "JEE Advanced",
                slug: "jee-advanced",
                href: "/category/iit-jee",
                order: 2,
                status: "active",
                items: [
                    { id: "jee_adv_11", label: "Class 11", classNumber: 11, slug: "class-11", href: "/category/iit-jee?target=class-11", order: 1, status: "active" },
                    { id: "jee_adv_12", label: "Class 12", classNumber: 12, slug: "class-12", href: "/category/iit-jee?target=class-12", order: 2, status: "active" },
                    { id: "jee_adv_dropper", label: "Dropper / Repeater", slug: "dropper", href: "/category/iit-jee?target=dropper", order: 3, status: "active" },
                ],
            },
        ],
    },
    {
        id: "cat_neet",
        name: "NEET",
        slug: "neet",
        href: "/category/neet",
        order: 3,
        status: "active",
        subItems: [
            {
                id: "sub_neet_ug",
                label: "NEET UG",
                slug: "neet-ug",
                href: "/category/neet",
                order: 1,
                status: "active",
                items: [
                    { id: "neet_ug_11", label: "Class 11", classNumber: 11, slug: "class-11", href: "/category/neet?target=class-11", order: 1, status: "active" },
                    { id: "neet_ug_12", label: "Class 12", classNumber: 12, slug: "class-12", href: "/category/neet?target=class-12", order: 2, status: "active" },
                    { id: "neet_ug_dropper", label: "Dropper / Repeater", slug: "dropper", href: "/category/neet?target=dropper", order: 3, status: "active" },
                ],
            },
        ],
    },
];

const getCategoryIcon = (id: string, name: string) => {
    const key = (name || id).toLowerCase();
    if (key.includes('cbse') || key.includes('school') || key.includes('free')) {
        return <GraduationCap className="w-5 h-5 shrink-0" strokeWidth={2.2} />;
    }
    if (key.includes('jee') || key.includes('iit')) {
        return <Atom className="w-5 h-5 shrink-0" strokeWidth={2.2} />;
    }
    if (key.includes('neet') || key.includes('medical')) {
        return <Stethoscope className="w-5 h-5 shrink-0" strokeWidth={2.2} />;
    }
    if (key.includes('cuet') || key.includes('entrance') || key.includes('target')) {
        return <Target className="w-5 h-5 shrink-0" strokeWidth={2.2} />;
    }
    return <BookOpen className="w-5 h-5 shrink-0" strokeWidth={2.2} />;
};

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

// ============================================================================
// SHARED DESKTOP NAVIGATION TOKENS & COMPONENTS (SOURCE OF TRUTH: ALL COURSES)
// ============================================================================
const DESKTOP_MENU_TOKENS = {
    panelBg: "bg-white dark:bg-slate-950",
    panelBorder: "border border-border",
    panelRadius: "rounded-none",
    panelShadow: "shadow-xl",
    dropdownAnimation: "absolute top-full left-0 transition-all duration-200 ease-in-out z-50",
    rowPadding: "px-4 py-3.5",
    iconContainer: "w-5 h-5 flex items-center justify-center shrink-0 transition-colors duration-150 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-transform [&>svg]:duration-150 group-hover:[&>svg]:translate-x-0.5",
    iconColorDefault: "text-[#0B1F4B] dark:text-slate-300 group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400",
    iconColorActive: "text-[#1D4ED8] dark:text-blue-400 [&>svg]:translate-x-0.5",
    rowGap: "gap-3.5",
    rowBase: "group relative flex items-center rounded-none transition-all duration-150 text-left border-l-2 cursor-pointer w-full",
    rowHover: "border-transparent hover:bg-muted/80 hover:border-primary text-foreground hover:text-primary",
    rowActive: "bg-muted/80 border-primary text-primary",
    textTypography: "font-bold text-[14px] leading-tight transition-colors",
    arrowClass: "w-4 h-4 transition-all shrink-0 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:opacity-100",
    arrowActive: "w-4 h-4 transition-all shrink-0 text-primary translate-x-0.5 opacity-100",
    groupHeading: "px-4 pt-2 pb-1 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider",
    divider: "my-1 border-t border-border",
};

interface DesktopMenuRowProps {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
    onMouseEnter?: () => void;
    onSelect?: () => void;
}

function DesktopMenuRow({
    label,
    icon,
    href,
    onClick,
    isActive = false,
    disabled = false,
    onMouseEnter,
    onSelect,
}: DesktopMenuRowProps) {
    const isAction = Boolean(onClick || !href || href === '#');

    const innerContent = (
        <>
            {icon && (
                <div
                    className={cn(
                        DESKTOP_MENU_TOKENS.iconContainer,
                        isActive ? DESKTOP_MENU_TOKENS.iconColorActive : DESKTOP_MENU_TOKENS.iconColorDefault
                    )}
                >
                    {icon}
                </div>
            )}
            <div className="text-left flex-1 min-w-0">
                <p
                    className={cn(
                        DESKTOP_MENU_TOKENS.textTypography,
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}
                >
                    {label}
                </p>
            </div>
            <ChevronRight
                className={isActive ? DESKTOP_MENU_TOKENS.arrowActive : DESKTOP_MENU_TOKENS.arrowClass}
            />
        </>
    );

    const rowClassName = cn(
        DESKTOP_MENU_TOKENS.rowBase,
        DESKTOP_MENU_TOKENS.rowPadding,
        DESKTOP_MENU_TOKENS.rowGap,
        isActive ? DESKTOP_MENU_TOKENS.rowActive : DESKTOP_MENU_TOKENS.rowHover,
        disabled && "opacity-50 grayscale pointer-events-none"
    );

    if (isAction) {
        return (
            <div className="w-full" onMouseEnter={onMouseEnter}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        onSelect?.();
                        onClick?.();
                    }}
                    disabled={disabled}
                    className={rowClassName}
                >
                    {innerContent}
                </button>
            </div>
        );
    }

    return (
        <div className="w-full" onMouseEnter={onMouseEnter}>
            <Link
                href={disabled ? '#' : href!}
                onClick={() => onSelect?.()}
                className={rowClassName}
            >
                {innerContent}
            </Link>
        </div>
    );
}

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
    const [hoveredCourseCategory, setHoveredCourseCategory] = useState<string | null>(null);
    const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        getAllCoursesCategories().then((res) => {
            if (isMounted && res.success && res.data && res.data.length > 0) {
                setCourseCategories(res.data);
            }
        });
        return () => { isMounted = false; };
    }, []);
    const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
    const [openMobileSubAccordion, setOpenMobileSubAccordion] = useState<string | null>(null);
    const [openMobileThirdAccordion, setOpenMobileThirdAccordion] = useState<string | null>(null);
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
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setActiveMenu(null);
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
                window.removeEventListener('keydown', handleKeyDown);
            };
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
        if (menu === 'explore') {
            setHoveredCourseCategory(null);
            setHoveredSubItem(null);
        }
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        menuTimeoutRef.current = setTimeout(() => {
            setActiveMenu(null);
            setHoveredCourseCategory(null);
            setHoveredSubItem(null);
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
            title: "EXPLORE",
            links: [
                { href: "/offline-centers", label: "Offline Centers", icon: <Building className="w-5 h-5 shrink-0" strokeWidth={2.2} /> },
                { href: "/blog", label: "IDL Blog", icon: <FileText className="w-5 h-5 shrink-0" strokeWidth={2.2} /> },
                { href: '/gallery', label: "Gallery", icon: <ImageIcon className="w-5 h-5 shrink-0" strokeWidth={2.2} /> },
            ]
        },
        {
            title: "COMPANY",
            links: [
                { href: "/about", label: "About Us", icon: <Info className="w-5 h-5 shrink-0" strokeWidth={2.2} /> },
                { href: "#", label: "Contact Us", icon: <MessageSquare className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsContactOpen(true) },
                { href: "/journey", label: "The Journey", icon: <Rocket className="w-5 h-5 shrink-0" strokeWidth={2.2} /> },
            ]
        },
    ];

    const applyForLinks = [
        { href: "#", label: "Admission Form", icon: <FileText className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsAdmissionOpen(true) },
        { href: "#", label: "Book Free Demo", icon: <Presentation className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsBookDemoOpen(true) },
        { href: "#", label: "Feedback", icon: <MessageSquareText className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsFeedbackOpen(true) },
        { href: "#", label: "Student Enquiry", icon: <CircleHelp className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsEnquiryOpen(true) },
        { href: "#", label: "Scholarship", icon: <Award className="w-5 h-5 shrink-0" strokeWidth={2.2} />, onClick: () => setIsScholarshipOpen(true) },
    ];

    const navItemClass = "relative h-auto py-1.5 px-3 text-[13px] font-bold tracking-tight text-foreground hover:text-primary hover:bg-transparent rounded-none uppercase transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100";

    const renderAuthSection = () => {
        if (loading) return <Skeleton className="h-[41px] md:h-9 w-20 rounded-[8px]" />;

        if (user) {
            return (
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Link
                        href={getDashboardPath(user)}
                        className="px-2.5 sm:px-3 py-1.5 rounded-[8px] border border-primary text-primary hover:bg-primary hover:text-white font-extrabold text-[9.5px] sm:text-[10px] uppercase tracking-wide transition-colors whitespace-nowrap h-8 sm:h-9 flex items-center cursor-pointer"
                    >
                        ADMIN
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="px-2.5 sm:px-3 py-1.5 rounded-[8px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 font-extrabold text-[9.5px] sm:text-[10px] uppercase tracking-wide transition-colors whitespace-nowrap h-8 sm:h-9 flex items-center cursor-pointer"
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
                className="group relative px-2.5 min-[360px]:px-3 md:px-4 py-0 rounded-[6px] md:rounded-[8px] bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] border-0 shadow-[0_1px_6px_rgba(59,130,246,0.3)] hover:shadow-[0_2px_10px_rgba(59,130,246,0.45)] transition-all duration-300 active:scale-[0.97] overflow-hidden h-[34px] md:h-9 flex items-center justify-center cursor-pointer whitespace-nowrap"
            >
                {/* Slide-up fill animation on hover/active — all screen sizes */}
                <div className="absolute inset-0 translate-y-full bg-[#1565C0] transition-transform duration-300 group-hover:translate-y-0 group-active:translate-y-0" />
                <span className="relative z-10 text-[10px] min-[360px]:text-[10.5px] md:text-[10px] font-bold md:font-extrabold uppercase tracking-[0.07em] text-white transition-colors leading-none">
                    Login
                </span>
            </button>
        );
    };

    return (
        <>
            <header 
                suppressHydrationWarning
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

                    <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex h-full">
                        <nav suppressHydrationWarning className="items-center flex gap-x-1 h-full" onMouseLeave={handleMouseLeave}>
                            {!pathname.startsWith('/idl-foundation') ? (
                                <>
                                    <div onMouseEnter={() => handleMouseEnter('explore')} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'explore' && "after:scale-x-100 text-primary")}>ALL COURSES</Button>
                                        <div className={cn(
                                            DESKTOP_MENU_TOKENS.dropdownAnimation,
                                            activeMenu === 'explore' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                        )}>
                                            <div className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "flex flex-row divide-x divide-border")}>
                                                {/* Left Column: Main Section (w-64, with shared DesktopMenuRow) */}
                                                <div className="w-64 flex flex-col gap-1 p-2">
                                                    {courseCategories.map(c => (
                                                        <DesktopMenuRow
                                                            key={c.id}
                                                            label={c.name}
                                                            icon={getCategoryIcon(c.id, c.name)}
                                                            href={c.href}
                                                            isActive={hoveredCourseCategory === c.id}
                                                            onMouseEnter={() => {
                                                                setHoveredCourseCategory(c.id);
                                                                setHoveredSubItem(null);
                                                            }}
                                                            onSelect={() => setActiveMenu(null)}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Middle Column: Sub-section 1 (Equal size - w-56) */}
                                                {(() => {
                                                    if (!hoveredCourseCategory) return null;
                                                    const activeCategory = courseCategories.find(c => c.id === hoveredCourseCategory);
                                                    if (!activeCategory || !activeCategory.subItems?.length) return null;

                                                    const activeSubItem = hoveredSubItem ? activeCategory.subItems.find(s => s.id === hoveredSubItem) : null;
                                                    const hasLeafItems = Boolean(activeSubItem && activeSubItem.items && activeSubItem.items.length > 0);

                                                    return (
                                                        <>
                                                            <div className="w-56 p-2 flex flex-col gap-1 animate-in fade-in duration-150">
                                                                {activeCategory.subItems.map((sub) => {
                                                                    const isSubActive = hoveredSubItem === sub.id;
                                                                    return (
                                                                        <div
                                                                            key={sub.id}
                                                                            onMouseEnter={() => setHoveredSubItem(sub.id)}
                                                                            className="w-full"
                                                                        >
                                                                            <Link
                                                                                href={sub.href}
                                                                                onClick={() => setActiveMenu(null)}
                                                                                className={cn(
                                                                                    "group relative flex items-center gap-3 px-3.5 py-3 rounded-none transition-all duration-150 text-left border-l-2",
                                                                                    isSubActive
                                                                                        ? "bg-muted/80 border-primary text-primary"
                                                                                        : "border-transparent hover:bg-muted/50 hover:border-border text-foreground"
                                                                                )}
                                                                            >
                                                                                <div className="text-left flex-1">
                                                                                    <p className={cn(
                                                                                        "font-medium text-[13px] leading-tight transition-colors",
                                                                                        isSubActive ? "text-primary font-semibold" : "text-foreground group-hover:text-primary"
                                                                                    )}>
                                                                                        {sub.label}
                                                                                    </p>
                                                                                </div>
                                                                                <ChevronRight className={cn(
                                                                                    "w-4 h-4 transition-all shrink-0",
                                                                                    isSubActive
                                                                                        ? "text-primary translate-x-0.5 opacity-100"
                                                                                        : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5"
                                                                                )} />
                                                                            </Link>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Right Column: Sub-section 2 / Classes (Equal size - w-56) */}
                                                            {hasLeafItems && (
                                                                <div className="w-56 p-2 flex flex-col gap-1">
                                                                    <div className="px-3.5 pt-1.5 pb-2 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                                        Select Class
                                                                    </div>
                                                                    {activeSubItem?.items?.map((item) => (
                                                                        <Link
                                                                            key={item.id}
                                                                            href={item.href}
                                                                            onClick={() => setActiveMenu(null)}
                                                                            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-none hover:bg-muted/50 transition-all duration-150 text-left border-l-2 border-transparent hover:border-primary/40"
                                                                        >
                                                                            <div className="text-left flex-1">
                                                                                <p className="font-medium text-[13px] text-foreground leading-tight group-hover:text-primary transition-colors">
                                                                                    {item.label}
                                                                                </p>
                                                                            </div>
                                                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div onMouseEnter={() => handleMouseEnter('apply')} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'apply' && "after:scale-x-100 text-primary")}>APPLY FOR</Button>
                                        <div className={cn(
                                            DESKTOP_MENU_TOKENS.dropdownAnimation,
                                            "w-64",
                                            activeMenu === 'apply' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                        )}>
                                            <div suppressHydrationWarning className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "p-2 flex flex-col gap-1")}>
                                                {applyForLinks.map(l => (
                                                    <DesktopMenuRow
                                                        key={l.label}
                                                        label={l.label}
                                                        icon={l.icon}
                                                        href={l.href}
                                                        onClick={l.onClick}
                                                        onSelect={() => setActiveMenu(null)}
                                                    />
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
                                            DESKTOP_MENU_TOKENS.dropdownAnimation,
                                            "w-64",
                                            activeMenu === 'more' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                        )}>
                                            <div suppressHydrationWarning className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "p-2 flex flex-col gap-1")}>
                                                {moreMenuGroups.map((group, groupIdx) => (
                                                    <div key={group.title} suppressHydrationWarning className="flex flex-col gap-1">
                                                        {groupIdx > 0 && <div className={DESKTOP_MENU_TOKENS.divider} />}
                                                        <div className={DESKTOP_MENU_TOKENS.groupHeading}>
                                                            {group.title}
                                                        </div>
                                                        {group.links.map(link => (
                                                            <DesktopMenuRow
                                                                key={link.label}
                                                                label={link.label}
                                                                icon={link.icon}
                                                                href={link.href}
                                                                onClick={link.onClick}
                                                                disabled={(link as any).disabled || link.label === "Register Now"}
                                                                onSelect={() => setActiveMenu(null)}
                                                            />
                                                        ))}
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

                        <div className="flex items-center ml-0.5 sm:ml-0 md:ml-0">
                            {isClient && renderAuthSection()}
                        </div>

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground h-9 w-9 -mr-1 ml-2">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent 
                                side="left" 
                                data-mobile-drawer="true"
                                className="fixed inset-y-0 left-0 z-[9999] p-0 gap-0 w-full max-w-full flex flex-col h-[100dvh] max-h-[100dvh] bg-gradient-to-b from-white via-[#FAFBFD] to-[#F3F7FC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-none shadow-none rounded-none overflow-hidden [&>button.absolute]:hidden"
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

                                {/* Body - Scrollable Navigation Content */}
                                <div className="flex-1 overflow-y-auto overscroll-contain relative z-10">
                                    <div className="pt-2 sm:pt-2.5 pb-8">
                                        <nav className="divide-y divide-slate-100 dark:divide-slate-800/60 border-b border-slate-100 dark:border-slate-800/60 text-left">
                                            {/* 1. ALL COURSES ROW */}
                                            <div className="flex flex-col">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const isCurrentlyOpen = openMobileAccordion === 'all-courses';
                                                        setOpenMobileAccordion(isCurrentlyOpen ? null : 'all-courses');
                                                        if (isCurrentlyOpen) {
                                                            setOpenMobileSubAccordion(null);
                                                            setOpenMobileThirdAccordion(null);
                                                        }
                                                    }}
                                                    aria-expanded={openMobileAccordion === 'all-courses'}
                                                    aria-controls="mobile-accordion-all-courses"
                                                    className="touch-manipulation px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-100 text-left cursor-pointer select-none"
                                                >
                                                    <span className="uppercase">ALL COURSES</span>
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 text-slate-400 dark:text-slate-500 mobile-accordion-chevron shrink-0",
                                                        openMobileAccordion === 'all-courses' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                    )} />
                                                </button>
                                                <div
                                                    id="mobile-accordion-all-courses"
                                                    role="region"
                                                    aria-hidden={openMobileAccordion !== 'all-courses'}
                                                    data-open={openMobileAccordion === 'all-courses' ? 'true' : 'false'}
                                                    className="mobile-accordion-grid"
                                                >
                                                    <div className="overflow-hidden min-h-0 pb-3 pt-0.5 px-4 sm:px-6">
                                                        <div suppressHydrationWarning className="flex flex-col gap-1">
                                                            {courseCategories.map((cat) => {
                                                                const isSubOpen = openMobileSubAccordion === cat.id;
                                                                return (
                                                                    <div key={cat.id} className="flex flex-col">
                                                                        {/* Level 1: Category Row (52-58px) */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                const next = isSubOpen ? null : cat.id;
                                                                                setOpenMobileSubAccordion(next);
                                                                                setOpenMobileThirdAccordion(null);
                                                                                if (next) {
                                                                                    const target = e.currentTarget;
                                                                                    requestAnimationFrame(() => {
                                                                                        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                                                                    });
                                                                                }
                                                                            }}
                                                                            aria-expanded={isSubOpen}
                                                                            aria-controls={`mobile-sub-${cat.id}`}
                                                                            className={cn(
                                                                                "touch-manipulation group relative flex items-center justify-between px-3.5 sm:px-4 min-h-[54px] rounded-lg transition-colors duration-100 text-left border-l-[3px] w-full cursor-pointer select-none",
                                                                                isSubOpen
                                                                                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-primary text-primary"
                                                                                    : "border-transparent text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                                                                            )}
                                                                        >
                                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                <div className={cn(
                                                                                    "w-5 h-5 flex items-center justify-center shrink-0 transition-colors duration-100",
                                                                                    isSubOpen
                                                                                        ? "text-primary dark:text-blue-400"
                                                                                        : "text-[#0B1F4B] dark:text-slate-300 group-hover:text-primary"
                                                                                )}>
                                                                                    {getCategoryIcon(cat.id, cat.name)}
                                                                                </div>
                                                                                <span className={cn(
                                                                                    "text-[14.5px] sm:text-[15px] leading-tight truncate transition-colors duration-100",
                                                                                    isSubOpen ? "font-bold text-primary dark:text-blue-400" : "font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary"
                                                                                )}>
                                                                                    {cat.name}
                                                                                </span>
                                                                            </div>
                                                                            <ChevronDown className={cn(
                                                                                "w-4 h-4 text-slate-400 dark:text-slate-500 mobile-accordion-chevron shrink-0 ml-2",
                                                                                isSubOpen && "rotate-180 text-primary dark:text-blue-400"
                                                                            )} />
                                                                        </button>

                                                                        {/* Level 2: Nested Sub-items (CBSE Syllabus, CBSE Exam) */}
                                                                        <div
                                                                            id={`mobile-sub-${cat.id}`}
                                                                            role="region"
                                                                            aria-hidden={!isSubOpen}
                                                                            data-open={isSubOpen ? 'true' : 'false'}
                                                                            className="mobile-accordion-grid"
                                                                        >
                                                                            <div className="overflow-hidden min-h-0">
                                                                                <div className="border-l-[1.5px] border-slate-200 dark:border-slate-800 ml-5 pl-3 py-1 my-0.5 space-y-1">
                                                                                    {cat.subItems.map((sub) => {
                                                                                        const hasLeafs = sub.items && sub.items.length > 0;
                                                                                        const isThirdOpen = openMobileThirdAccordion === sub.id;

                                                                                        if (hasLeafs) {
                                                                                            return (
                                                                                                <div key={sub.id} className="flex flex-col">
                                                                                                    {/* Level 2 Row (44-50px) - Text + Chevron ONLY */}
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        onClick={(e) => {
                                                                                                            const next = isThirdOpen ? null : sub.id;
                                                                                                            setOpenMobileThirdAccordion(next);
                                                                                                            if (next) {
                                                                                                                const target = e.currentTarget;
                                                                                                                requestAnimationFrame(() => {
                                                                                                                    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                                                                                                });
                                                                                                            }
                                                                                                        }}
                                                                                                        aria-expanded={isThirdOpen}
                                                                                                        aria-controls={`mobile-third-${sub.id}`}
                                                                                                        className={cn(
                                                                                                            "touch-manipulation w-full text-left font-semibold text-[13.5px] sm:text-[14px] min-h-[44px] px-3 py-2 rounded-md transition-colors duration-100 flex items-center justify-between cursor-pointer select-none",
                                                                                                            isThirdOpen
                                                                                                                ? "text-primary bg-blue-50/60 dark:bg-blue-950/30 font-bold"
                                                                                                                : "text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900/50"
                                                                                                        )}
                                                                                                    >
                                                                                                        <span className="truncate">{sub.label}</span>
                                                                                                        <ChevronDown className={cn(
                                                                                                            "w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mobile-accordion-chevron shrink-0 ml-2",
                                                                                                            isThirdOpen && "rotate-180 text-primary"
                                                                                                        )} />
                                                                                                    </button>

                                                                                                    {/* Level 3: Classes (38-44px) */}
                                                                                                    <div
                                                                                                        id={`mobile-third-${sub.id}`}
                                                                                                        role="region"
                                                                                                        aria-hidden={!isThirdOpen}
                                                                                                        data-open={isThirdOpen ? 'true' : 'false'}
                                                                                                        className="mobile-accordion-grid"
                                                                                                    >
                                                                                                        <div className="overflow-hidden min-h-0">
                                                                                                            <div className="border-l-[1.5px] border-slate-200/80 dark:border-slate-800/80 ml-3 pl-2.5 py-0.5 my-0.5 space-y-0.5">
                                                                                                                {sub.items!.map((item) => (
                                                                                                                    <Link
                                                                                                                        key={item.id}
                                                                                                                        href={item.href}
                                                                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                                                                        className="group flex items-center justify-between min-h-[38px] px-2.5 py-1.5 rounded-md text-[13px] font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors duration-100 cursor-pointer"
                                                                                                                    >
                                                                                                                        <span className="truncate">{item.label}</span>
                                                                                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-120 shrink-0 ml-2" />
                                                                                                                    </Link>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        }

                                                                                        return (
                                                                                            <Link
                                                                                                key={sub.id}
                                                                                                href={sub.href}
                                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                                className="w-full text-left font-medium text-[13.5px] sm:text-[14px] min-h-[44px] px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-100 flex items-center justify-between cursor-pointer"
                                                                                            >
                                                                                                <span className="truncate">{sub.label}</span>
                                                                                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
                                                                                            </Link>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 2. APPLY FOR ROW */}
                                            <div className="flex flex-col">
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const isCurrentlyOpen = openMobileAccordion === 'apply';
                                                        setOpenMobileAccordion(isCurrentlyOpen ? null : 'apply');
                                                    }}
                                                    aria-expanded={openMobileAccordion === 'apply'}
                                                    aria-controls="mobile-accordion-apply"
                                                    className="touch-manipulation px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-100 text-left cursor-pointer select-none"
                                                >
                                                    <span className="uppercase">APPLY FOR</span>
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 text-slate-400 dark:text-slate-500 mobile-accordion-chevron shrink-0",
                                                        openMobileAccordion === 'apply' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                    )} />
                                                </button>
                                                <div
                                                    id="mobile-accordion-apply"
                                                    role="region"
                                                    aria-hidden={openMobileAccordion !== 'apply'}
                                                    data-open={openMobileAccordion === 'apply' ? 'true' : 'false'}
                                                    className="mobile-accordion-grid"
                                                >
                                                    <div className="overflow-hidden min-h-0 pb-3 pt-0.5 px-4 sm:px-6">
                                                        <div suppressHydrationWarning className="flex flex-col gap-1">
                                                            {applyForLinks.map(({ href, label, icon, onClick: linkOnClick }) => (
                                                                <button
                                                                    key={label}
                                                                    type="button"
                                                                    suppressHydrationWarning
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setIsMobileMenuOpen(false);
                                                                        if (linkOnClick) {
                                                                          linkOnClick();
                                                                        } else if (href && href !== '#') {
                                                                            router.push(href);
                                                                        }
                                                                    }}
                                                                    className="touch-manipulation group relative flex items-center justify-between px-3.5 sm:px-4 min-h-[52px] rounded-lg transition-all duration-100 text-left border-l-[3px] border-transparent hover:border-primary active:border-primary hover:bg-slate-50 active:bg-blue-50/80 text-slate-800 dark:text-slate-200 hover:text-primary active:text-primary w-full cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                        <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#0B1F4B] dark:text-slate-300 group-hover:text-primary group-active:text-primary transition-colors duration-100 [&>svg]:w-5 [&>svg]:h-5">
                                                                            {icon}
                                                                        </div>
                                                                        <span className="text-[14.5px] sm:text-[15px] font-semibold leading-tight truncate transition-colors text-slate-800 dark:text-slate-200 group-hover:text-primary group-active:text-primary">
                                                                            {label}
                                                                        </span>
                                                                    </div>
                                                                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-120 shrink-0 ml-2" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STORE ROW */}
                                            <div className="px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center">
                                                <Link
                                                    href="/store"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="touch-manipulation flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:text-primary transition-colors cursor-pointer select-none"
                                                >
                                                    <span className="flex items-center gap-2.5 uppercase">
                                                        <span>STORE</span>
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                                </Link>
                                            </div>

                                            {/* 3. MORE ROW */}
                                            <div className="flex flex-col">
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const isCurrentlyOpen = openMobileAccordion === 'more';
                                                        setOpenMobileAccordion(isCurrentlyOpen ? null : 'more');
                                                    }}
                                                    aria-expanded={openMobileAccordion === 'more'}
                                                    aria-controls="mobile-accordion-more"
                                                    className="touch-manipulation px-6 sm:px-7 min-h-[64px] sm:min-h-[68px] flex items-center justify-between w-full font-semibold text-[18px] sm:text-[19px] tracking-tight text-[#102A68] dark:text-white hover:bg-[#102A68]/[0.03] active:bg-[#102A68]/[0.06] dark:hover:bg-slate-900/60 transition-colors duration-100 text-left cursor-pointer select-none"
                                                >
                                                    <span className="uppercase">MORE</span>
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 text-slate-400 dark:text-slate-500 mobile-accordion-chevron shrink-0",
                                                        openMobileAccordion === 'more' && "rotate-180 text-[#102A68] dark:text-blue-400"
                                                    )} />
                                                </button>
                                                <div
                                                    id="mobile-accordion-more"
                                                    role="region"
                                                    aria-hidden={openMobileAccordion !== 'more'}
                                                    data-open={openMobileAccordion === 'more' ? 'true' : 'false'}
                                                    className="mobile-accordion-grid"
                                                >
                                                    <div className="overflow-hidden min-h-0 pb-3 pt-0.5 px-4 sm:px-6">
                                                        <div suppressHydrationWarning className="flex flex-col gap-1">
                                                            {moreMenuGroups.map((group, groupIdx) => (
                                                                <div key={group.title} suppressHydrationWarning className="flex flex-col gap-1">
                                                                    {groupIdx > 0 && <div className="my-1.5 border-t border-slate-200/70 dark:border-slate-800/80" />}
                                                                    <div className="px-3.5 pt-2 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                                        {group.title}
                                                                    </div>
                                                                    {group.links.map((link) => {
                                                                        const isDisabled = (link as any).disabled || link.label === "Register Now";
                                                                        const isAction = Boolean(link.onClick);

                                                                        const rowContent = (
                                                                            <>
                                                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                    <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#0B1F4B] dark:text-slate-300 group-hover:text-primary group-active:text-primary transition-colors duration-100 [&>svg]:w-5 [&>svg]:h-5">
                                                                                        {link.icon}
                                                                                    </div>
                                                                                    <span className="text-[14.5px] sm:text-[15px] font-semibold leading-tight truncate transition-colors text-slate-800 dark:text-slate-200 group-hover:text-primary group-active:text-primary">
                                                                                        {link.label}
                                                                                    </span>
                                                                                </div>
                                                                                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary group-hover:translate-x-0.5 transition-transform duration-120 shrink-0 ml-2" />
                                                                            </>
                                                                        );

                                                                        if (isAction) {
                                                                            return (
                                                                                <button
                                                                                    key={link.label}
                                                                                    type="button"
                                                                                    suppressHydrationWarning
                                                                                    onClick={() => {
                                                                                        setIsMobileMenuOpen(false);
                                                                                        if (link.onClick) link.onClick();
                                                                                    }}
                                                                                    className={cn(
                                                                                        "touch-manipulation group relative flex items-center justify-between px-3.5 sm:px-4 min-h-[52px] rounded-lg transition-all duration-100 text-left border-l-[3px] border-transparent hover:border-primary active:border-primary hover:bg-slate-50 active:bg-blue-50/80 text-slate-800 dark:text-slate-200 hover:text-primary active:text-primary w-full cursor-pointer",
                                                                                        isDisabled && "opacity-50 grayscale pointer-events-none"
                                                                                    )}
                                                                                >
                                                                                    {rowContent}
                                                                                </button>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <Link
                                                                                key={link.label}
                                                                                href={isDisabled ? '#' : link.href}
                                                                                suppressHydrationWarning
                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                className={cn(
                                                                                    "touch-manipulation group relative flex items-center justify-between px-3.5 sm:px-4 min-h-[52px] rounded-lg transition-all duration-100 text-left border-l-[3px] border-transparent hover:border-primary active:border-primary hover:bg-slate-50 active:bg-blue-50/80 text-slate-800 dark:text-slate-200 hover:text-primary active:text-primary cursor-pointer",
                                                                                    isDisabled && "opacity-50 grayscale pointer-events-none"
                                                                                )}
                                                                            >
                                                                                {rowContent}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                         </nav>
                                    </div>
                                </div>

                                {/* Bottom Call Area: Fixed at bottom, grounded, respecting safe areas */}
                                <div className="px-5 sm:px-6 py-4 border-t border-slate-200/70 dark:border-slate-800/80 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0 relative z-10 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                                    <a 
                                        href="tel:8860040010" 
                                        className="w-full flex items-center justify-center gap-2.5 h-12 sm:h-12.5 rounded-[10px] bg-[#0B1F4B] hover:bg-[#071536] active:bg-[#050E24] dark:bg-primary dark:hover:bg-primary/90 text-white transition-all duration-150 ease-out shadow-sm active:scale-[0.99] cursor-pointer"
                                    >
                                        <Phone className="w-5 h-5 text-white stroke-[2.2] shrink-0" />
                                        <span className="text-[18px] sm:text-[19px] font-bold text-white tracking-tight leading-none">
                                            8860040010
                                        </span>
                                    </a>
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
