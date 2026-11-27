'use client';
import Link from "next/link";
import {
    BookOpen, Menu, Phone, Mail, GraduationCap, FileText,
    ImageIcon, User, LayoutDashboard, LogOut, X, AlignJustify,
    ShoppingCart, MessageSquare, Info, ChevronDown, Heart, HelpCircle,
    FileType, UserPlus, IndianRupee, Landmark, ClipboardList,
    UserCircle, Building, Users, HandHeart, Banknote,
    Edit, Headset, CheckCircle2, MapPin, Search,
    Sparkles, PlayCircle, ShieldCheck, ChevronRight, Award, Bell,
    Atom, Stethoscope, Presentation, MessageSquareText, CircleHelp, Target,
    Instagram, ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { normalizeBranchId } from "@/lib/branch-utils";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
import { FeedbackModal } from "./feedback-modal";
import { ContactModal } from "./contact-modal";
import { RecentUpdatesModal } from "./recent-updates-modal";
import { getAllCoursesCategories, type CourseCategory } from "@/app/actions/course-categories";

const megaMenuBg = "bg-white shadow-2xl";

const BRANCH_LINKS = [
    { name: "Budh Vihar", area: "A-1/6, Phase -1, Delhi-110086", href: "/branches/budh-vihar", active: true },
    { name: "Krishna Vihar", area: "E-18 Krishan Vihar, Delhi-110086", href: "/branches/krishna-vihar", active: true },
    { name: "Mangolpuri", area: "D-945 Mangolpuri, Delhi-110083", href: "/branches/mangolpuri", active: true },
    { name: "Mukherjee Nagar", area: "Near Batra Cinema, Delhi-110009", href: "/branches/mukherjee-nagar", active: false },
];

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
        id: "cat_free_courses",
        name: "Free Courses",
        slug: "free-courses",
        href: "/free-courses",
        order: 2,
        status: "active",
        subItems: [
            {
                id: "free_class_9",
                label: "Class 9",
                classNumber: 9,
                slug: "class-9",
                href: "/free-courses?class=Class 9",
                order: 1,
                status: "active",
            },
            {
                id: "free_class_10",
                label: "Class 10",
                classNumber: 10,
                slug: "class-10",
                href: "/free-courses?class=Class 10",
                order: 2,
                status: "active",
            },
            {
                id: "free_class_11",
                label: "Class 11",
                classNumber: 11,
                slug: "class-11",
                href: "/free-courses?class=Class 11",
                order: 3,
                status: "active",
            },
            {
                id: "free_class_12",
                label: "Class 12",
                classNumber: 12,
                slug: "class-12",
                href: "/free-courses?class=Class 12",
                order: 4,
                status: "active",
            },
        ],
    },
    {
        id: "cat_premium_courses",
        name: "Premium Courses",
        slug: "premium-courses",
        href: "/premium-courses",
        order: 3,
        status: "active",
        subItems: [
            {
                id: "premium_class_9",
                label: "Class 9",
                classNumber: 9,
                slug: "class-9",
                href: "/premium-courses?class=Class 9",
                order: 1,
                status: "active",
            },
            {
                id: "premium_class_10",
                label: "Class 10",
                classNumber: 10,
                slug: "class-10",
                href: "/premium-courses?class=Class 10",
                order: 2,
                status: "active",
            },
            {
                id: "premium_class_11",
                label: "Class 11",
                classNumber: 11,
                slug: "class-11",
                href: "/premium-courses?class=Class 11",
                order: 3,
                status: "active",
            },
            {
                id: "premium_class_12",
                label: "Class 12",
                classNumber: 12,
                slug: "class-12",
                href: "/premium-courses?class=Class 12",
                order: 4,
                status: "active",
            },
        ],
    },
];

const getCategoryIconDetails = (id: string, name: string) => {
    const key = (name || id).toLowerCase();
    if (key.includes('cbse') || key.includes('school')) {
        return {
            icon: <GraduationCap className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        };
    }
    if (key.includes('jee') || key.includes('iit')) {
        return {
            icon: <Atom className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-blue-50 dark:bg-blue-950/60 text-[#155EEF] dark:text-blue-400"
        };
    }
    if (key.includes('neet') || key.includes('medical')) {
        return {
            icon: <Stethoscope className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        };
    }
    if (key.includes('cuet') || key.includes('entrance') || key.includes('target')) {
        return {
            icon: <Target className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
        };
    }
    if (key.includes('free') || key.includes('youtube')) {
        return {
            icon: <PlayCircle className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
        };
    }
    if (key.includes('premium')) {
        return {
            icon: <Award className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
            colorClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
        };
    }
    return {
        icon: <BookOpen className="w-4 h-4 shrink-0" strokeWidth={2.2} />,
        colorClass: "bg-sky-50 dark:bg-sky-950/60 text-[#0066CC] dark:text-sky-400"
    };
};

const getCategoryIcon = (id: string, name: string) => {
    return getCategoryIconDetails(id, name).icon;
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
    panelBorder: "border border-[#E5EAF2] dark:border-slate-800",
    panelRadius: "rounded-[15px]",
    panelShadow: "shadow-[0_14px_34px_-10px_rgba(11,27,67,0.14),0_2px_6px_-2px_rgba(11,27,67,0.05)]",
    dropdownAnimation: "absolute top-full left-0 transition-all duration-200 ease-in-out z-50 pt-2",
    rowPadding: "px-3.5 py-1.5",
    iconContainer: "w-4.5 h-4.5 flex items-center justify-center shrink-0 transition-colors duration-150 [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:transition-transform [&>svg]:duration-150 group-hover:[&>svg]:translate-x-0.5",
    iconColorDefault: "text-[#0B1F4B] dark:text-slate-300 group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400",
    iconColorActive: "text-[#1D4ED8] dark:text-blue-400 [&>svg]:translate-x-0.5",
    rowGap: "gap-3",
    rowBase: "group relative flex items-center rounded-xl transition-all duration-150 text-left cursor-pointer w-full min-h-[36px]",
    rowHover: "text-foreground hover:text-primary",
    rowActive: "text-primary",
    textTypography: "font-semibold text-[13.5px] leading-tight transition-colors",
    arrowClass: "w-3.5 h-3.5 transition-all shrink-0 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:opacity-100",
    arrowActive: "w-3.5 h-3.5 transition-all shrink-0 text-primary translate-x-0.5 opacity-100",
    groupHeading: "px-3.5 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider",
    divider: "my-0.5 border-t border-border",
};

interface DesktopMenuRowProps {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    badge?: boolean;
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
    onMouseEnter?: () => void;
    onMouseMove?: () => void;
    onSelect?: () => void;
}

function DesktopMenuRow({
    label,
    icon,
    href,
    badge = false,
    onClick,
    isActive = false,
    disabled = false,
    onMouseEnter,
    onMouseMove,
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
            <div className="text-left flex-1 min-w-0 flex items-center justify-between">
                <p
                    className={cn(
                        DESKTOP_MENU_TOKENS.textTypography,
                        isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}
                >
                    {label}
                </p>
                {badge && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0 ml-1.5" />
                )}
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

    const handleMouseAction = () => {
        if (onMouseMove) onMouseMove();
        else if (onMouseEnter) onMouseEnter();
    };

    if (isAction) {
        return (
            <div className="w-full" onMouseEnter={onMouseEnter} onMouseMove={handleMouseAction}>
                <button
                    type="button"
                    onMouseEnter={onMouseEnter}
                    onMouseMove={handleMouseAction}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClick?.();
                        onSelect?.();
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
        <div className="w-full" onMouseEnter={onMouseEnter} onMouseMove={handleMouseAction}>
            <Link
                href={disabled ? '#' : href!}
                onMouseEnter={onMouseEnter}
                onMouseMove={handleMouseAction}
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
    const [isScrolled, setIsScrolled] = useState(false);

    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(DEFAULT_COURSE_CATEGORIES);
    const [hoveredCourseCategory, setHoveredCourseCategory] = useState<string | null>(null);
    const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        getAllCoursesCategories().then((res) => {
            if (isMounted && res.success && res.data && res.data.length > 0) {
                const dynamicCategories = res.data.filter(c => {
                    const key = (c.slug || c.id || c.name || '').toLowerCase();
                    if (key.includes('jee') || key.includes('neet') || key.includes('iit') || key.includes('medical')) {
                        return false;
                    }
                    return (
                        c.id !== 'cat_free_courses' && 
                        c.slug !== 'free-courses' && 
                        c.id !== 'cat_premium_courses' && 
                        c.slug !== 'premium-courses'
                    );
                }).map(c => {
                    if (c.name && c.name.toLowerCase() === 'free courses') {
                        return { ...c, name: 'Free Courses' };
                    }
                    return c;
                });
                const staticExtras = DEFAULT_COURSE_CATEGORIES.filter(c => 
                    c.id === 'cat_free_courses' || c.id === 'cat_premium_courses'
                );

                const getCategoryRank = (c: CourseCategory) => {
                    const key = (c.slug || c.id || c.name || '').toLowerCase();
                    if (key.includes('cbse') || key.includes('school')) return 1;
                    if (key.includes('free')) return 2;
                    if (key.includes('premium') || key.includes('paid')) return 3;
                    return c.order ?? 99;
                };

                const sorted = [...dynamicCategories, ...staticExtras].sort(
                    (a, b) => getCategoryRank(a) - getCategoryRank(b)
                );
                setCourseCategories(sorted);
            }
        });
        return () => { isMounted = false; };
    }, []);
    const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
    const [openMobileSubAccordion, setOpenMobileSubAccordion] = useState<string | null>(null);
    const [openMobileThirdAccordion, setOpenMobileThirdAccordion] = useState<string | null>(null);

    // Auto-close all open sections & subsections when mobile sidebar is closed
    useEffect(() => {
        if (!isMobileMenuOpen) {
            const timer = setTimeout(() => {
                setOpenMobileAccordion(null);
                setOpenMobileSubAccordion(null);
                setOpenMobileThirdAccordion(null);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isMobileMenuOpen]);

    // Also close mobile menu, desktop dropdowns & reset all subsections when user navigates to a new page
    useEffect(() => {
        setActiveMenu(null);
        setIsMobileMenuOpen(false);
        setOpenMobileAccordion(null);
        setOpenMobileSubAccordion(null);
        setOpenMobileThirdAccordion(null);
    }, [pathname]);

    // When switching or toggling top-level mobile accordion (ALL COURSES / APPLY FOR / MORE),
    // automatically reset all nested sub-accordions (CBSE, JEE, Syllabus, etc.)
    useEffect(() => {
        setOpenMobileSubAccordion(null);
        setOpenMobileThirdAccordion(null);
    }, [openMobileAccordion]);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'signup'>('login');
    const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleOpenAdmission = () => setIsAdmissionOpen(true);
        const handleOpenContact = () => setIsContactOpen(true);

        window.addEventListener('open-admission-modal', handleOpenAdmission);
        window.addEventListener('open-contact-modal', handleOpenContact);

        return () => {
            window.removeEventListener('open-admission-modal', handleOpenAdmission);
            window.removeEventListener('open-contact-modal', handleOpenContact);
        };
    }, []);

    const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
    const [donationCategory, setDonationCategory] = useState<string>("");
    const [donationStep, setDonationStep] = useState(1);
    const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
    const [donationAmount, setDonationAmount] = useState('');

    const [updates, setUpdates] = useState<any[]>([]);
    const [hasNewUpdates, setHasNewUpdates] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveMenu(null);
            }
        };
        const handlePointerDownOutside = (e: PointerEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setActiveMenu((prev) => (prev === 'profile' ? null : prev));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handlePointerDownOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('pointerdown', handlePointerDownOutside);
        };
    }, []);

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
            menuTimeoutRef.current = null;
        }
        if (menu === 'explore' && activeMenu !== 'explore') {
            setHoveredCourseCategory(null);
            setHoveredSubItem(null);
        }
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        if (menuTimeoutRef.current) {
            clearTimeout(menuTimeoutRef.current);
            menuTimeoutRef.current = null;
        }
        setActiveMenu(null);
        setHoveredCourseCategory(null);
        setHoveredSubItem(null);
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
                { href: "/blog", label: "Blog", icon: BookOpen, iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60" },
                { href: '/gallery', label: "Gallery", icon: ImageIcon, iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
            ]
        },
        {
            title: "COMPANY",
            links: [
                { 
                    href: "#", 
                    label: "Recent Updates", 
                    onClick: () => setIsUpdatesOpen(true), 
                    icon: Bell, 
                    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60",
                    badge: true 
                },
            ]
        },
    ];

    const applyForLinks: {
        href: string;
        label: string;
        onClick?: () => void;
        icon: typeof FileText;
        iconColor: string;
    }[] = [
        { href: "/admission", label: "Admission Form", icon: FileText, iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
        { href: "/book-demo", label: "Book Free Demo", icon: PlayCircle, iconColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60" },
        { href: "/student-enquiry", label: "Student Enquiry", icon: HelpCircle, iconColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
        { href: "/scholarship", label: "Scholarship", icon: Award, iconColor: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60" },
    ];

    const navItemClass = "relative h-auto py-1.5 px-3 text-[14px] font-extrabold tracking-[0.005em] [word-spacing:0.03em] text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8] hover:bg-transparent rounded-none antialiased transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[#1D4ED8] after:transition-transform after:duration-300 hover:after:scale-x-100";
    const navAuthButtonClass = "px-4 md:px-[18px] py-0 rounded-[6px] bg-[#0A1E4A] hover:bg-[#122D68] active:bg-[#071535] border-0 text-white/95 hover:text-white h-[33px] md:h-[36px] flex items-center justify-center cursor-pointer select-none touch-manipulation whitespace-nowrap font-semibold text-[12px] md:text-[13px] leading-none tracking-[0.06em] antialiased transition-colors duration-150 shadow-none outline-none focus-visible:outline-none";

    const renderAuthSection = () => {
        if (loading) return <Skeleton className="h-[33px] md:h-[36px] w-[74px] md:w-[82px] rounded-[6px]" />;

        if (user) {
            const normalizedBranch = normalizeBranchId(user.branchId);
            const isBranchAdmin = user.role === 'admin' && Boolean(normalizedBranch && normalizedBranch !== 'all');
            const roleLabel =
                user.role === 'admin'
                    ? isBranchAdmin
                        ? 'Branch Admin'
                        : 'Super Admin'
                    : user.role === 'teacher'
                      ? 'Teacher'
                      : user.role === 'student'
                        ? 'Student'
                        : 'Member';
            const displayName = (user.name || user.email?.split('@')[0] || 'User').trim();
            const nameParts = displayName.split(/\s+/).filter(Boolean);
            const initials =
                nameParts.length >= 2
                    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                    : displayName.slice(0, 2).toUpperCase() || 'U';
            const dashboardHref = getDashboardPath(user);
            const dashboardLabel = 'Dashboard';
            const triggerLabel = user.role === 'admin' ? 'ADMIN' : user.role === 'teacher' ? 'TEACHER' : user.role === 'student' ? 'STUDENT' : 'ACCOUNT';

            return (
                <div
                    ref={profileMenuRef}
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                    className="relative h-full flex items-center"
                >
                    <button
                        type="button"
                        data-testid="navbar-profile-trigger"
                        aria-label={`${displayName} – ${roleLabel}`}
                        aria-expanded={activeMenu === 'profile'}
                        aria-haspopup="menu"
                        onClick={() => {
                            if (activeMenu === 'profile') {
                                setActiveMenu(null);
                            } else {
                                handleMouseEnter('profile');
                            }
                        }}
                        className={navAuthButtonClass}
                    >
                        {triggerLabel}
                    </button>

                    <div
                        onMouseEnter={() => {
                            if (menuTimeoutRef.current) {
                                clearTimeout(menuTimeoutRef.current);
                                menuTimeoutRef.current = null;
                            }
                        }}
                        onMouseMove={() => {
                            if (menuTimeoutRef.current) {
                                clearTimeout(menuTimeoutRef.current);
                                menuTimeoutRef.current = null;
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                            "absolute top-full right-0 pt-2 w-[272px] z-[80] transition-all duration-200 ease-in-out",
                            activeMenu === 'profile'
                                ? "opacity-100 translate-y-0 visible pointer-events-auto"
                                : "opacity-0 -translate-y-1 invisible pointer-events-none"
                        )}
                    >
                        <div
                            role="menu"
                            aria-label="Profile menu"
                            data-testid="navbar-profile-menu"
                            data-state={activeMenu === 'profile' ? 'open' : 'closed'}
                            className="overflow-hidden rounded-[15px] border border-[#E5EAF2] bg-white shadow-[0_14px_34px_-10px_rgba(11,27,67,0.14),0_2px_6px_-2px_rgba(11,27,67,0.05)]"
                        >
                            <div className="px-3.5 py-3">
                                <div className="flex items-center gap-2.5">
                                    <Avatar className="h-[42px] w-[42px] border border-[#E5EAF2] shrink-0">
                                        <AvatarImage src={user.photoURL ?? undefined} alt={displayName} />
                                        <AvatarFallback className="bg-[#0B1B43] text-white text-sm font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[15px] font-extrabold tracking-[-0.01em] text-[#0B224D] leading-snug">
                                            {displayName}
                                        </p>
                                        <p className="truncate text-[12px] font-semibold tracking-[0.005em] text-[#475E82] leading-snug mt-0.5">
                                            {roleLabel}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px w-full bg-[#EFF3F8]" />
                            <div className="relative flex w-full items-stretch">
                                <Link
                                    href={dashboardHref}
                                    role="menuitem"
                                    onClick={() => setActiveMenu(null)}
                                    className="flex-1 flex h-[44px] items-center justify-center gap-2 px-3 text-[13.5px] font-bold tracking-[0.005em] text-[#173568] hover:bg-[#EAF2FF] active:bg-[#DBEAFE] focus:bg-[#EAF2FF] focus:text-[#0B224D] outline-none transition-colors cursor-pointer"
                                >
                                    <LayoutDashboard className="!h-[17px] !w-[17px] text-[#2864E8] shrink-0" />
                                    <span>{dashboardLabel}</span>
                                </Link>
                                <div
                                    aria-hidden="true"
                                    data-testid="dropdown-actions-divider"
                                    className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[18px] w-px -translate-x-1/2 -translate-y-1/2 bg-[#CBD5E1] dark:bg-slate-700"
                                />
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={async () => {
                                        setActiveMenu(null);
                                        await handleLogout();
                                    }}
                                    className="flex-1 flex h-[44px] items-center justify-center gap-2 px-3 text-[13.5px] font-bold tracking-[0.005em] text-[#DC2626] hover:bg-[#FEECEC] active:bg-[#FEE2E2] focus:bg-[#FEECEC] focus:text-[#B91C1C] outline-none transition-colors cursor-pointer"
                                >
                                    <LogOut className="!h-[17px] !w-[17px] text-[#DC2626] shrink-0" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <button 
                type="button" 
                onClick={() => { setAuthDefaultMode('login'); setIsAuthOpen(true); }}
                className={navAuthButtonClass}
            >
                LOGIN
            </button>
        );
    };

    return (
        <>
            <header 
                suppressHydrationWarning
                data-mobile-menu-open={isMobileMenuOpen ? "true" : "false"}
                className={cn(
                    "fixed top-0 left-0 right-0 w-full z-[60] border-b h-[75px] bg-white/[0.98] md:bg-background/95 dark:bg-background/95 backdrop-blur-md transition-[border-color,background-color] duration-200",
                    isScrolled 
                        ? "border-slate-200/90 dark:border-slate-800" 
                        : "border-slate-200/70 md:border-slate-100 dark:border-slate-800/80"
                )}
            >
                <div className="w-full md:container mx-auto px-3 sm:px-4 md:px-6 flex justify-between items-center h-full">
                    <div className="flex items-center gap-0.5 sm:gap-1 h-full">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                            className="md:hidden inline-flex items-center justify-center h-10 w-10 -ml-1.5 rounded-lg text-[#0A1E4A] dark:text-slate-100 hover:bg-[#0A1E4A]/[0.04] dark:hover:bg-slate-800/70 active:opacity-75 transition-colors duration-150 shrink-0 cursor-pointer touch-manipulation outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-none shadow-none"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                shapeRendering="geometricPrecision"
                                className="w-[24px] h-[24px]"
                                aria-hidden="true"
                            >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="16.5" y2="12" />
                                <line x1="3" y1="18" x2="12" y2="18" />
                            </svg>
                            <span className="sr-only">Toggle menu</span>
                        </button>
                        <Link href="/" className="flex items-center justify-center md:-ml-2 py-0 h-full">
                            <Image src="/idllogo.png" alt="IDL Education Logo" width={180} height={80} className="h-[68px] sm:h-[70px] md:h-[72px] max-h-[68px] sm:max-h-[70px] md:max-h-[72px] w-auto object-contain object-left" priority />
                        </Link>
                    </div>

                    <div className="flex-1 justify-start items-center gap-1 ml-4 hidden md:flex h-full">
                        <nav aria-label="Main Navigation" suppressHydrationWarning className="items-center flex gap-x-1 h-full">
                            {!pathname.startsWith('/idl-foundation') ? (
                                <>
                                    <div 
                                        onMouseEnter={() => handleMouseEnter('explore')} 
                                        onMouseLeave={handleMouseLeave}
                                        className="h-full flex items-center relative"
                                    >
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                if (activeMenu === 'explore') {
                                                    setActiveMenu(null);
                                                    setHoveredCourseCategory(null);
                                                    setHoveredSubItem(null);
                                                } else {
                                                    handleMouseEnter('explore');
                                                }
                                            }}
                                            className={cn(navItemClass, activeMenu === 'explore' && "after:scale-x-100 text-primary")}
                                        >
                                            All Courses
                                        </Button>
                                        <div 
                                            onMouseEnter={() => {
                                                if (menuTimeoutRef.current) {
                                                    clearTimeout(menuTimeoutRef.current);
                                                    menuTimeoutRef.current = null;
                                                }
                                            }}
                                            onMouseMove={() => {
                                                if (menuTimeoutRef.current) {
                                                    clearTimeout(menuTimeoutRef.current);
                                                    menuTimeoutRef.current = null;
                                                }
                                            }}
                                            onMouseLeave={handleMouseLeave}
                                            className={cn(
                                                DESKTOP_MENU_TOKENS.dropdownAnimation,
                                                activeMenu === 'explore' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                            )}
                                        >
                                            <div className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "flex flex-row divide-x divide-[#E5EAF2] dark:divide-slate-800 overflow-hidden")}>
                                                {/* Left Column: Main Course Categories */}
                                                <div className="w-56 sm:w-60 flex flex-col gap-0 p-1.5">
                                                    {courseCategories.map(c => {
                                                        const isCatActive = hoveredCourseCategory === c.id;
                                                        const hasSubItems = Boolean(c.subItems && c.subItems.length > 0);
                                                        const displayName = c.name?.toLowerCase() === 'free courses' ? 'Free Courses' : c.name;

                                                        const selectCategory = (e?: React.MouseEvent) => {
                                                            if (e) {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }
                                                            if (menuTimeoutRef.current) {
                                                                clearTimeout(menuTimeoutRef.current);
                                                                menuTimeoutRef.current = null;
                                                            }
                                                            setHoveredCourseCategory(c.id);
                                                            setHoveredSubItem(null);
                                                        };

                                                        return (
                                                            <DesktopMenuRow
                                                                key={c.id}
                                                                label={displayName}
                                                                href={hasSubItems ? '#' : c.href}
                                                                onClick={hasSubItems ? () => selectCategory() : undefined}
                                                                isActive={isCatActive}
                                                                onMouseEnter={() => selectCategory()}
                                                                onMouseMove={() => selectCategory()}
                                                                onSelect={hasSubItems ? undefined : () => setActiveMenu(null)}
                                                            />
                                                        );
                                                    })}
                                                </div>

                                                {/* Right Column: Selected Category Submenu */}
                                                {(() => {
                                                    if (!hoveredCourseCategory) return null;
                                                    const activeCategory = courseCategories.find(c => c.id === hoveredCourseCategory);
                                                    if (!activeCategory || !activeCategory.subItems?.length) return null;

                                                    const activeSubItem = hoveredSubItem 
                                                        ? activeCategory.subItems.find(s => s.id === hoveredSubItem) 
                                                        : null;
                                                    const hasLeafItems = Boolean(activeSubItem && activeSubItem.items && activeSubItem.items.length > 0);

                                                    return (
                                                        <div 
                                                            onMouseEnter={() => {
                                                                if (menuTimeoutRef.current) {
                                                                    clearTimeout(menuTimeoutRef.current);
                                                                    menuTimeoutRef.current = null;
                                                                }
                                                            }}
                                                            onMouseMove={() => {
                                                                if (menuTimeoutRef.current) {
                                                                    clearTimeout(menuTimeoutRef.current);
                                                                    menuTimeoutRef.current = null;
                                                                }
                                                            }}
                                                            className="flex flex-row divide-x divide-border"
                                                        >
                                                            <div className="w-52 sm:w-56 p-1.5 flex flex-col gap-0 animate-in fade-in duration-100">
                                                                {activeCategory.subItems.map((sub) => {
                                                                    const hasNestedItems = Boolean(sub.items && sub.items.length > 0);
                                                                    const isSubActive = hoveredSubItem === sub.id;

                                                                    const selectSubItem = (e?: React.MouseEvent) => {
                                                                        if (e) {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                        }
                                                                        if (menuTimeoutRef.current) {
                                                                            clearTimeout(menuTimeoutRef.current);
                                                                            menuTimeoutRef.current = null;
                                                                        }
                                                                        setHoveredSubItem(sub.id);
                                                                    };

                                                                    if (hasNestedItems) {
                                                                        return (
                                                                            <div
                                                                                key={sub.id}
                                                                                onMouseEnter={() => selectSubItem()}
                                                                                onMouseMove={() => selectSubItem()}
                                                                                className="w-full"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => selectSubItem(e)}
                                                                                    className={cn(
                                                                                        "group relative flex items-center justify-between gap-2.5 px-3.5 py-1.5 min-h-[36px] w-full rounded-none transition-all duration-150 text-left cursor-pointer",
                                                                                        isSubActive
                                                                                            ? "text-primary bg-primary/5"
                                                                                            : "text-foreground hover:text-primary hover:bg-muted/40"
                                                                                    )}
                                                                                >
                                                                                    <div className="text-left flex-1 min-w-0">
                                                                                        <p className={cn(
                                                                                            "text-[13px] leading-tight tracking-[-0.01em] transition-colors",
                                                                                            isSubActive ? "font-bold text-primary" : "font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary"
                                                                                        )}>
                                                                                            {sub.label}
                                                                                        </p>
                                                                                    </div>
                                                                                    <ChevronRight className={cn(
                                                                                        "w-3.5 h-3.5 transition-all shrink-0",
                                                                                        isSubActive
                                                                                            ? "text-primary translate-x-0.5 opacity-100"
                                                                                            : "text-muted-foreground/35 group-hover:text-primary group-hover:translate-x-0.5"
                                                                                    )} />
                                                                                </button>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // Direct leaf item (e.g. Class 9, Class 10 under Free Courses)
                                                                    return (
                                                                        <div
                                                                            key={sub.id}
                                                                            onMouseEnter={() => {
                                                                                if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                                                                            }}
                                                                            onMouseMove={() => {
                                                                                if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                                                                            }}
                                                                            className="w-full"
                                                                        >
                                                                            <Link
                                                                                href={sub.href}
                                                                                onClick={() => setActiveMenu(null)}
                                                                                className="group relative flex items-center justify-between gap-2.5 px-3.5 py-1.5 min-h-[36px] w-full rounded-none transition-all duration-150 text-left text-foreground hover:text-primary hover:bg-muted/40 cursor-pointer"
                                                                            >
                                                                                <div className="text-left flex-1 min-w-0">
                                                                                    <p className="text-[13px] leading-tight tracking-[-0.01em] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                                                                        {sub.label}
                                                                                    </p>
                                                                                </div>
                                                                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                                                            </Link>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Sub-section 2 / Classes (Equal size - w-48 to w-52) */}
                                                            {hasLeafItems && (
                                                                <div 
                                                                    onMouseEnter={() => {
                                                                        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                                                                    }}
                                                                    onMouseMove={() => {
                                                                        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
                                                                    }}
                                                                    className="w-48 sm:w-52 p-1.5 flex flex-col gap-0 animate-in fade-in duration-100"
                                                                >
                                                                    {activeSubItem?.items?.map((item) => (
                                                                        <Link
                                                                            key={item.id}
                                                                            href={item.href}
                                                                            onClick={() => setActiveMenu(null)}
                                                                            className="group relative flex items-center gap-2 px-3.5 py-1.5 min-h-[36px] rounded-none transition-all duration-150 text-left hover:text-primary hover:bg-muted/40 cursor-pointer"
                                                                        >
                                                                            <div className="text-left flex-1 min-w-0">
                                                                                <p className="font-semibold text-[13px] tracking-[-0.01em] text-slate-800 dark:text-slate-200 leading-tight group-hover:text-primary transition-colors">
                                                                                    {item.label}
                                                                                </p>
                                                                            </div>
                                                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/35 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div onMouseEnter={() => handleMouseEnter('apply')} onMouseLeave={handleMouseLeave} className="h-full flex items-center relative">
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                if (activeMenu === 'apply') {
                                                    setActiveMenu(null);
                                                } else {
                                                    handleMouseEnter('apply');
                                                }
                                            }}
                                            className={cn(navItemClass, (activeMenu === 'apply' || pathname === '/admission' || pathname === '/book-demo' || pathname === '/student-enquiry' || pathname === '/scholarship') && "after:scale-x-100 text-primary")}
                                        >
                                            Apply For
                                        </Button>
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
                                                        href={l.href}
                                                        onClick={l.onClick}
                                                        isActive={l.href !== '#' && pathname === l.href}
                                                        onSelect={() => setActiveMenu(null)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center">
                                        <Button asChild variant="ghost" className={cn(navItemClass, pathname === '/about' && "after:scale-x-100 text-primary")}>
                                            <Link href="/about">About Us</Link>
                                        </Button>
                                    </div>
                                    <div className="h-full flex items-center">
                                        <Button asChild variant="ghost" className={cn(navItemClass, pathname === '/contact' && "after:scale-x-100 text-primary")}>
                                            <Link href="/contact">Contact Us</Link>
                                        </Button>
                                    </div>
                                    <div 
                                        suppressHydrationWarning
                                        onMouseEnter={() => handleMouseEnter('branches')}
                                        onMouseLeave={handleMouseLeave}
                                        className="h-full flex items-center relative"
                                    >
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => {
                                                if (activeMenu === 'branches') {
                                                    setActiveMenu(null);
                                                } else {
                                                    handleMouseEnter('branches');
                                                }
                                            }}
                                            className={cn(navItemClass, (activeMenu === 'branches' || pathname.startsWith('/branches')) && "after:scale-x-100 text-primary")}
                                        >
                                            Branches
                                        </Button>
                                        <div 
                                            suppressHydrationWarning
                                            onMouseEnter={() => {
                                                if (menuTimeoutRef.current) {
                                                    clearTimeout(menuTimeoutRef.current);
                                                    menuTimeoutRef.current = null;
                                                }
                                            }}
                                            onMouseMove={() => {
                                                if (menuTimeoutRef.current) {
                                                    clearTimeout(menuTimeoutRef.current);
                                                    menuTimeoutRef.current = null;
                                                }
                                            }}
                                            onMouseLeave={handleMouseLeave}
                                            className={cn(
                                                DESKTOP_MENU_TOKENS.dropdownAnimation,
                                                "w-72",
                                                activeMenu === 'branches' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                            )}
                                        >
                                            <div suppressHydrationWarning className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "p-2 flex flex-col gap-1")}>
                                                {BRANCH_LINKS.map((branch) => branch.active ? (
                                                    <Link
                                                        key={branch.href}
                                                        href={branch.href}
                                                        suppressHydrationWarning
                                                        onClick={() => setActiveMenu(null)}
                                                        className="group relative flex items-center justify-between px-3.5 py-2 rounded-lg transition-all duration-150 text-left hover:bg-muted/50 cursor-pointer"
                                                    >
                                                        <div className="flex flex-col min-w-0" suppressHydrationWarning>
                                                            <p className="font-semibold text-[13px] tracking-[-0.01em] text-slate-800 dark:text-slate-200 leading-tight group-hover:text-primary transition-colors">
                                                                {branch.name}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                                                {branch.area}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                                    </Link>
                                                ) : (
                                                    <div
                                                        key={branch.href}
                                                        suppressHydrationWarning
                                                        className="group relative flex items-center justify-between px-3.5 py-2 rounded-lg text-left cursor-default select-none opacity-60"
                                                    >
                                                        <div className="flex flex-col min-w-0" suppressHydrationWarning>
                                                            <p className="font-semibold text-[13px] tracking-[-0.01em] text-slate-700 dark:text-slate-300 leading-tight">
                                                                {branch.name}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                                                {branch.area}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PAY FEE NAV ITEM */}
                                    <div className="h-full flex items-center">
                                        <Button asChild variant="ghost" className={cn(navItemClass, pathname === '/pay-fee' && "after:scale-x-100 text-primary")}>
                                            <Link href="/pay-fee">Pay Fee</Link>
                                        </Button>
                                    </div>

                                    <div onMouseEnter={() => handleMouseEnter('more')} onMouseLeave={handleMouseLeave} className="h-full flex items-center relative">
                                        <Button variant="ghost" className={cn(navItemClass, activeMenu === 'more' && "after:scale-x-100 text-primary")}>More</Button>
                                        <div className={cn(
                                            DESKTOP_MENU_TOKENS.dropdownAnimation,
                                            "w-64",
                                            activeMenu === 'more' ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                                        )}>
                                            <div suppressHydrationWarning className={cn(DESKTOP_MENU_TOKENS.panelBg, DESKTOP_MENU_TOKENS.panelBorder, DESKTOP_MENU_TOKENS.panelRadius, DESKTOP_MENU_TOKENS.panelShadow, "p-2 flex flex-col gap-1")}>
                                                        {moreMenuGroups.map((group, groupIdx) => (
                                                            <div key={group.title} suppressHydrationWarning className="flex flex-col gap-0">
                                                                {group.links.map(link => (
                                                            <DesktopMenuRow
                                                                key={link.label}
                                                                label={link.label}
                                                                href={link.href}
                                                                badge={(link as any).badge}
                                                                onClick={(link as any).onClick}
                                                                disabled={(link as any).disabled || link.label === "Register Now"}
                                                                onSelect={() => setActiveMenu(null)}
                                                            />
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center">
                                        <Button asChild variant="ghost" className={navItemClass}>
                                            <Link href="/store" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                                <ShoppingCart className="h-4 w-4" /><span>Store</span>
                                            </Link>
                                        </Button>
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
                    <div className="flex h-full items-center gap-2.5 sm:gap-3.5 md:gap-6">
                        {/* Call Action: Visible on Desktop only. On Mobile, call action is inside the mobile drawer */}
                        <a 
                            href="tel:8860040010" 
                            aria-label="Call IDL Education at 8860040010"
                            className="group hidden md:inline-flex items-center gap-2 py-1 text-[#0B1B43] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors duration-150 shrink-0"
                        >
                            <Phone className="h-[19px] w-[19px] text-[#0B1B43]/80 dark:text-slate-300 group-hover:text-[#2864E8] dark:group-hover:text-blue-400 transition-colors duration-150 shrink-0" strokeWidth={1.85} />
                            <span className="text-[17px] font-semibold tracking-[-0.01em] leading-none tabular-nums">
                                8860040010
                            </span>
                        </a>

                        {/* Minimal Instagram Action Icon */}
                        <a 
                            href="https://www.instagram.com/idleducation" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Follow IDL Education on Instagram"
                            title="Follow IDL Education on Instagram"
                            className="inline-flex items-center justify-center h-[38px] w-[38px] md:h-auto md:w-auto rounded-[7px] md:rounded-none text-[#0A1E4A]/90 md:text-[#0B1B43]/80 dark:text-slate-200 dark:md:text-slate-300 hover:text-[#155EEF] md:hover:text-[#2864E8] hover:bg-[#0A1E4A]/[0.04] md:hover:bg-transparent dark:hover:text-blue-400 active:opacity-75 md:active:opacity-100 transition-colors duration-150 shrink-0 cursor-pointer touch-manipulation outline-none focus-visible:outline-none"
                        >
                            <Instagram className="h-[28px] w-[28px] md:h-[24px] md:w-[24px]" strokeWidth={1.75} shapeRendering="geometricPrecision" />
                        </a>

                        <div className="flex h-full items-center">
                            {isClient && renderAuthSection()}
                        </div>

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetContent 
                                side="left" 
                                data-mobile-drawer="true" 
                                className="fixed inset-0 z-[9999] p-0 gap-0 flex flex-col w-full !w-full max-w-full !max-w-full h-full h-[100dvh] max-h-[100dvh] bg-white dark:bg-slate-950 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 shadow-none overflow-hidden antialiased [&>button.absolute]:hidden data-[state=open]:duration-200 data-[state=closed]:duration-150" 
                                style={{ width: '100%', maxWidth: '100%' }}
                            >
                                {/* Refined Minimal Header with Inset Hairline */}
                                <SheetHeader className="px-6 bg-white dark:bg-slate-950 text-left flex flex-row items-center justify-between h-[75px] min-h-[75px] max-h-[75px] space-y-0 shrink-0 relative z-10 overflow-visible outline-none focus:outline-none">
                                    <SheetTitle asChild>
                                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center -ml-1.5 py-0 h-full overflow-visible outline-none focus:outline-none">
                                            <Image 
                                              src="/idllogo.png" 
                                              alt="IDL Education Logo" 
                                              width={180} 
                                              height={80} 
                                              className="h-[78px] sm:h-[80px] md:h-[80px] max-h-[78px] sm:max-h-[80px] md:max-h-[80px] w-auto object-contain object-left shrink-0" 
                                              priority 
                                            />
                                        </Link>
                                    </SheetTitle>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-9 h-9 -mr-1.5 rounded-full flex items-center justify-center text-[#0A1E4A]/55 hover:text-[#0A1E4A] dark:text-slate-400 dark:hover:text-white hover:bg-[#0A1E4A]/[0.05] dark:hover:bg-slate-800/80 active:opacity-75 transition-colors duration-150 shrink-0 cursor-pointer touch-manipulation outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 border-none"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-[20px] h-[20px] stroke-[1.9]" shapeRendering="geometricPrecision" />
                                    </button>
                                </SheetHeader>
                                <div className="mx-6 h-px bg-[#E8EEF6] dark:bg-slate-800/80 shrink-0" aria-hidden="true" />

                                {/* Editorial Full-Screen Navigation Body */}
                                <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain relative z-10 bg-white dark:bg-slate-950">
                                    <nav aria-label="Mobile Navigation" className="px-6 text-left flex flex-col divide-y divide-[#EDF2F7] dark:divide-slate-800/80">

                                        {/* 1. ALL COURSES */}
                                        <div className="flex flex-col">
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const isCurrentlyOpen = openMobileAccordion === 'all-courses';
                                                    setOpenMobileAccordion(isCurrentlyOpen ? null : 'all-courses');
                                                    setOpenMobileSubAccordion(null);
                                                    setOpenMobileThirdAccordion(null);
                                                }}
                                                aria-expanded={openMobileAccordion === 'all-courses'}
                                                aria-controls="mobile-accordion-all-courses"
                                                className={cn(
                                                    "touch-manipulation group relative min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased transition-colors duration-150 text-left cursor-pointer select-none outline-none focus-visible:outline-none",
                                                    openMobileAccordion === 'all-courses' 
                                                        ? "text-[#1D4ED8] dark:text-blue-400" 
                                                        : "text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8]"
                                                )}
                                            >
                                                <span>All Courses</span>
                                                <span className={cn(
                                                    "w-7 h-7 -mr-0.5 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0",
                                                    openMobileAccordion === 'all-courses'
                                                        ? "bg-[#155EEF]/[0.09] text-[#155EEF] dark:bg-blue-500/15 dark:text-blue-400"
                                                        : "text-[#0A1E4A]/45 group-hover:text-[#155EEF] dark:text-slate-500"
                                                )}>
                                                    <ChevronDown className={cn(
                                                        "w-[16px] h-[16px] stroke-[2] mobile-accordion-chevron",
                                                        openMobileAccordion === 'all-courses' && "rotate-180"
                                                    )} shapeRendering="geometricPrecision" />
                                                </span>
                                            </button>
                                            <div
                                                id="mobile-accordion-all-courses"
                                                role="region"
                                                aria-hidden={openMobileAccordion !== 'all-courses'}
                                                data-open={openMobileAccordion === 'all-courses' ? 'true' : 'false'}
                                                className="mobile-accordion-grid"
                                            >
                                                <div className="overflow-hidden min-h-0">
                                                    <div className="ml-1.5 pl-4 border-l-[1.5px] border-[#155EEF]/30 dark:border-blue-500/30 py-0.5 mb-3.5 space-y-0.5">
                                                        {courseCategories.map((cat) => {
                                                            const isSubOpen = openMobileSubAccordion === cat.id;
                                                            const hasSubItems = cat.subItems && cat.subItems.length > 0;

                                                            return (
                                                                <div key={cat.id} className="flex flex-col">
                                                                    {/* Level 1: Category */}
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
                                                                            "touch-manipulation flex items-center justify-between py-2 px-2 -mx-2 rounded-lg min-h-[38px] transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none",
                                                                            isSubOpen 
                                                                                ? "text-[#155EEF] dark:text-blue-400 font-semibold" 
                                                                                : "text-[#173568] dark:text-slate-200 hover:text-[#1D4ED8] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40 font-semibold tracking-[0.005em] [word-spacing:0.02em]"
                                                                        )}
                                                                    >
                                                                        <span className="text-[13.5px] leading-snug tracking-[-0.005em]">
                                                                            {cat.name?.toLowerCase() === 'free courses' ? 'Free Courses' : cat.name}
                                                                        </span>
                                                                        <ChevronDown className={cn(
                                                                            "w-3.5 h-3.5 stroke-[2] text-[#0A1E4A]/40 dark:text-slate-500 mobile-accordion-chevron shrink-0 ml-auto",
                                                                            isSubOpen && "rotate-180 text-[#155EEF] dark:text-blue-400"
                                                                        )} />
                                                                    </button>

                                                                    {/* Level 2: Sub-items */}
                                                                    {hasSubItems && (
                                                                        <div
                                                                            id={`mobile-sub-${cat.id}`}
                                                                            role="region"
                                                                            aria-hidden={!isSubOpen}
                                                                            data-open={isSubOpen ? 'true' : 'false'}
                                                                            className="mobile-accordion-grid"
                                                                        >
                                                                            <div className="overflow-hidden min-h-0">
                                                                                <div className="ml-1.5 pl-3.5 border-l border-[#E2E9F3] dark:border-slate-800 py-1 mb-1 space-y-0.5">
                                                                                    {cat.subItems.map((sub) => {
                                                                                        const hasLeafs = sub.items && sub.items.length > 0;
                                                                                        const isThirdOpen = openMobileThirdAccordion === sub.id;

                                                                                        if (hasLeafs) {
                                                                                            return (
                                                                                                <div key={sub.id} className="flex flex-col">
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
                                                                                                            "touch-manipulation w-full text-left text-[12.5px] min-h-[34px] px-2 py-1.5 rounded-lg transition-colors duration-150 flex items-center justify-between cursor-pointer select-none",
                                                                                                            isThirdOpen 
                                                                                                                ? "font-semibold text-[#155EEF] dark:text-blue-300" 
                                                                                                                : "font-medium text-slate-600 dark:text-slate-300 hover:text-[#155EEF] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/50"
                                                                                                        )}
                                                                                                    >
                                                                                                        <span className="truncate pr-2">{sub.label}</span>
                                                                                                        <ChevronDown className={cn(
                                                                                                            "w-3 h-3 stroke-[2] text-[#0A1E4A]/40 dark:text-slate-500 mobile-accordion-chevron shrink-0 ml-auto",
                                                                                                            isThirdOpen && "rotate-180 text-[#155EEF] dark:text-blue-400"
                                                                                                        )} />
                                                                                                    </button>

                                                                                                    {/* Level 3: Classes */}
                                                                                                    <div
                                                                                                        id={`mobile-third-${sub.id}`}
                                                                                                        role="region"
                                                                                                        aria-hidden={!isThirdOpen}
                                                                                                        data-open={isThirdOpen ? 'true' : 'false'}
                                                                                                        className="mobile-accordion-grid"
                                                                                                    >
                                                                                                        <div className="overflow-hidden min-h-0">
                                                                                                            <div className="py-1 pl-3 ml-2 border-l border-[#155EEF]/20 dark:border-blue-800/70 space-y-0.5">
                                                                                                                {sub.items!.map((item) => (
                                                                                                                    <Link
                                                                                                                        key={item.id}
                                                                                                                        href={item.href}
                                                                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                                                                        className="group flex items-center justify-between min-h-[32px] px-2 py-1 rounded-md text-[12px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#155EEF] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/50 transition-colors duration-150 cursor-pointer"
                                                                                                                    >
                                                                                                                        <span className="truncate pr-2">{item.label}</span>
                                                                                                                        <ChevronRight className="w-3 h-3 text-[#0A1E4A]/25 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-auto" />
                                                                                                                    </Link>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        }

                                                                                        const isSubDisabled = !sub.href || sub.href === '#' || (sub as any).disabled;
                                                                                        if (isSubDisabled) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={sub.id}
                                                                                                    className="flex items-center justify-between min-h-[32px] px-2 py-1 text-[12.5px] font-medium text-slate-400 dark:text-slate-500 select-none cursor-default"
                                                                                                >
                                                                                                    <span className="truncate">{sub.label}</span>
                                                                                                </div>
                                                                                            );
                                                                                        }

                                                                                        return (
                                                                                            <Link
                                                                                                key={sub.id}
                                                                                                href={sub.href}
                                                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                                                className="group flex items-center justify-between min-h-[34px] px-2 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#155EEF] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/50 transition-colors duration-150 cursor-pointer"
                                                                                            >
                                                                                                <span className="truncate pr-2">{sub.label}</span>
                                                                                                <ChevronRight className="w-3 h-3 text-[#0A1E4A]/25 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-auto" />
                                                                                            </Link>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. APPLY FOR */}
                                        <div className="flex flex-col">
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const isCurrentlyOpen = openMobileAccordion === 'apply';
                                                    setOpenMobileAccordion(isCurrentlyOpen ? null : 'apply');
                                                    setOpenMobileSubAccordion(null);
                                                    setOpenMobileThirdAccordion(null);
                                                }}
                                                aria-expanded={openMobileAccordion === 'apply'}
                                                aria-controls="mobile-accordion-apply"
                                                className={cn(
                                                    "touch-manipulation group relative min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased transition-colors duration-150 text-left cursor-pointer select-none outline-none focus-visible:outline-none",
                                                    openMobileAccordion === 'apply' 
                                                        ? "text-[#1D4ED8] dark:text-blue-400" 
                                                        : "text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8]"
                                                )}
                                            >
                                                <span>Apply For</span>
                                                <span className={cn(
                                                    "w-7 h-7 -mr-0.5 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0",
                                                    openMobileAccordion === 'apply'
                                                        ? "bg-[#155EEF]/[0.09] text-[#155EEF] dark:bg-blue-500/15 dark:text-blue-400"
                                                        : "text-[#0A1E4A]/45 group-hover:text-[#155EEF] dark:text-slate-500"
                                                )}>
                                                    <ChevronDown className={cn(
                                                        "w-[16px] h-[16px] stroke-[2] mobile-accordion-chevron",
                                                        openMobileAccordion === 'apply' && "rotate-180"
                                                    )} shapeRendering="geometricPrecision" />
                                                </span>
                                            </button>
                                            <div
                                                id="mobile-accordion-apply"
                                                role="region"
                                                aria-hidden={openMobileAccordion !== 'apply'}
                                                data-open={openMobileAccordion === 'apply' ? 'true' : 'false'}
                                                className="mobile-accordion-grid"
                                            >
                                                <div className="overflow-hidden min-h-0">
                                                    <div className="ml-1.5 pl-4 border-l-[1.5px] border-[#155EEF]/30 dark:border-blue-500/30 py-0.5 mb-3.5 space-y-0.5">
                                                        {applyForLinks.map(({ href, label, onClick: linkOnClick }) =>
                                                            linkOnClick ? (
                                                                <button
                                                                    key={label}
                                                                    type="button"
                                                                    suppressHydrationWarning
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setIsMobileMenuOpen(false);
                                                                        setTimeout(() => {
                                                                            linkOnClick();
                                                                        }, 100);
                                                                    }}
                                                                    className="touch-manipulation group flex items-center justify-between py-2 px-2 -mx-2 rounded-lg min-h-[38px] transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none text-[#173568] dark:text-slate-200 hover:text-[#1D4ED8] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40"
                                                                >
                                                                    <span className="text-[13.5px] font-semibold tracking-[0.005em] [word-spacing:0.02em] leading-snug truncate">
                                                                        {label}
                                                                    </span>
                                                                    <ChevronRight className="w-3.5 h-3.5 text-[#0A1E4A]/30 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-2" />
                                                                </button>
                                                            ) : (
                                                                <Link
                                                                    key={label}
                                                                    href={href}
                                                                    suppressHydrationWarning
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className={cn(
                                                                        "touch-manipulation group flex items-center justify-between py-2 px-2 -mx-2 rounded-lg min-h-[38px] transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none",
                                                                        pathname === href
                                                                            ? "bg-[#155EEF]/[0.08] text-[#155EEF] dark:bg-blue-500/15 dark:text-blue-400"
                                                                            : "text-[#173568] dark:text-slate-200 hover:text-[#1D4ED8] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40"
                                                                    )}
                                                                >
                                                                    <span className="text-[13.5px] font-semibold tracking-[0.005em] [word-spacing:0.02em] leading-snug truncate">
                                                                        {label}
                                                                    </span>
                                                                    <ChevronRight className="w-3.5 h-3.5 text-[#0A1E4A]/30 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-2" />
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. ABOUT US */}
                                        <div className="flex items-center">
                                            <Link
                                                href="/about"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="touch-manipulation min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8] transition-colors duration-150 cursor-pointer select-none outline-none focus-visible:outline-none"
                                            >
                                                <span>About Us</span>
                                            </Link>
                                        </div>

                                        {/* 4. CONTACT US */}
                                        <div className="flex items-center">
                                            <Link
                                                href="/contact"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="touch-manipulation min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8] transition-colors duration-150 cursor-pointer select-none outline-none focus-visible:outline-none"
                                            >
                                                <span>Contact Us</span>
                                            </Link>
                                        </div>

                                        {/* 5. BRANCHES */}
                                        <div className="flex flex-col">
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const isCurrentlyOpen = openMobileAccordion === 'branches';
                                                    setOpenMobileAccordion(isCurrentlyOpen ? null : 'branches');
                                                    setOpenMobileSubAccordion(null);
                                                    setOpenMobileThirdAccordion(null);
                                                }}
                                                aria-expanded={openMobileAccordion === 'branches'}
                                                aria-controls="mobile-accordion-branches"
                                                className={cn(
                                                    "touch-manipulation group min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased transition-colors duration-150 text-left cursor-pointer select-none outline-none focus-visible:outline-none",
                                                    openMobileAccordion === 'branches' 
                                                        ? "text-[#1D4ED8] dark:text-blue-400" 
                                                        : "text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8]"
                                                )}
                                            >
                                                <span>Branches</span>
                                                <span className={cn(
                                                    "w-7 h-7 -mr-0.5 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0",
                                                    openMobileAccordion === 'branches'
                                                        ? "bg-[#155EEF]/[0.09] text-[#155EEF] dark:bg-blue-500/15 dark:text-blue-400"
                                                        : "text-[#0A1E4A]/45 group-hover:text-[#155EEF] dark:text-slate-500"
                                                )}>
                                                    <ChevronDown className={cn(
                                                        "w-[16px] h-[16px] stroke-[2] mobile-accordion-chevron",
                                                        openMobileAccordion === 'branches' && "rotate-180"
                                                    )} shapeRendering="geometricPrecision" />
                                                </span>
                                            </button>
                                            <div
                                                id="mobile-accordion-branches"
                                                role="region"
                                                aria-hidden={openMobileAccordion !== 'branches'}
                                                data-open={openMobileAccordion === 'branches' ? 'true' : 'false'}
                                                className="mobile-accordion-grid"
                                                suppressHydrationWarning
                                            >
                                                <div className="overflow-hidden min-h-0" suppressHydrationWarning>
                                                    <div className="ml-1.5 pl-4 border-l-[1.5px] border-[#155EEF]/30 dark:border-blue-500/30 py-0.5 mb-3.5 space-y-1" suppressHydrationWarning>
                                                        {BRANCH_LINKS.map((branch) => branch.active ? (
                                                            <Link
                                                                key={branch.href}
                                                                href={branch.href}
                                                                suppressHydrationWarning
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="touch-manipulation group flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40"
                                                            >
                                                                <div className="flex flex-col min-w-0" suppressHydrationWarning>
                                                                    <span className="text-[13.5px] font-semibold leading-snug truncate text-[#0A1E4A] dark:text-slate-100 group-hover:text-[#155EEF] dark:group-hover:text-blue-400 transition-colors">
                                                                        {branch.name}
                                                                    </span>
                                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                                                        {branch.area}
                                                                    </span>
                                                                </div>
                                                                <ChevronRight className="w-3.5 h-3.5 text-[#0A1E4A]/30 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-2" />
                                                            </Link>
                                                        ) : (
                                                            <div
                                                                key={branch.href}
                                                                suppressHydrationWarning
                                                                className="touch-manipulation flex items-center justify-between py-1.5 px-2 -mx-2 text-left w-[calc(100%+1rem)] cursor-default select-none opacity-50"
                                                            >
                                                                <div className="flex flex-col min-w-0" suppressHydrationWarning>
                                                                    <span className="text-[13.5px] font-semibold leading-snug truncate text-[#0A1E4A] dark:text-slate-200">
                                                                        {branch.name}
                                                                    </span>
                                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                                                        {branch.area}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6. PAY FEE */}
                                        <div className="flex items-center">
                                            <Link
                                                href="/pay-fee"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={cn(
                                                    "touch-manipulation min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased transition-colors duration-150 cursor-pointer select-none outline-none focus-visible:outline-none",
                                                    pathname === '/pay-fee'
                                                        ? "text-[#1D4ED8] dark:text-blue-400"
                                                        : "text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8]"
                                                )}
                                            >
                                                <span>Pay Fee</span>
                                            </Link>
                                        </div>

                                        {/* 7. MORE */}
                                        <div className="flex flex-col">
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const isCurrentlyOpen = openMobileAccordion === 'more';
                                                    setOpenMobileAccordion(isCurrentlyOpen ? null : 'more');
                                                    setOpenMobileSubAccordion(null);
                                                    setOpenMobileThirdAccordion(null);
                                                }}
                                                aria-expanded={openMobileAccordion === 'more'}
                                                aria-controls="mobile-accordion-more"
                                                className={cn(
                                                    "touch-manipulation group min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased transition-colors duration-150 text-left cursor-pointer select-none outline-none focus-visible:outline-none",
                                                    openMobileAccordion === 'more' 
                                                        ? "text-[#1D4ED8] dark:text-blue-400" 
                                                        : "text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8]"
                                                )}
                                            >
                                                <span>More</span>
                                                <span className={cn(
                                                    "w-7 h-7 -mr-0.5 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0",
                                                    openMobileAccordion === 'more'
                                                        ? "bg-[#155EEF]/[0.09] text-[#155EEF] dark:bg-blue-500/15 dark:text-blue-400"
                                                        : "text-[#0A1E4A]/45 group-hover:text-[#155EEF] dark:text-slate-500"
                                                )}>
                                                    <ChevronDown className={cn(
                                                        "w-[16px] h-[16px] stroke-[2] mobile-accordion-chevron",
                                                        openMobileAccordion === 'more' && "rotate-180"
                                                    )} shapeRendering="geometricPrecision" />
                                                </span>
                                            </button>
                                            <div
                                                id="mobile-accordion-more"
                                                role="region"
                                                aria-hidden={openMobileAccordion !== 'more'}
                                                data-open={openMobileAccordion === 'more' ? 'true' : 'false'}
                                                className="mobile-accordion-grid"
                                            >
                                                <div className="overflow-hidden min-h-0">
                                                    <div className="ml-1.5 pl-4 border-l-[1.5px] border-[#155EEF]/30 dark:border-blue-500/30 py-0.5 mb-3.5 space-y-0.5">
                                                        {moreMenuGroups.flatMap((group) => group.links).map((link: any) => {
                                                            const isDisabled = (link as any).disabled || link.label === "Register Now";
                                                            const isAction = Boolean((link as any).onClick);

                                                            const rowContent = (
                                                                <>
                                                                    <div className="flex items-center gap-2 min-w-0">
                                                                        <span className="text-[13.5px] font-medium leading-snug truncate">
                                                                            {link.label}
                                                                        </span>
                                                                        {link.badge && (
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shrink-0" />
                                                                        )}
                                                                    </div>
                                                                    <ChevronRight className="w-3.5 h-3.5 text-[#0A1E4A]/30 dark:text-slate-600 group-hover:text-[#155EEF] shrink-0 ml-2" />
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
                                                                            if ((link as any).onClick) (link as any).onClick();
                                                                        }}
                                                                        className={cn(
                                                                            "touch-manipulation group flex items-center justify-between py-2 px-2 -mx-2 rounded-lg min-h-[38px] transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none text-[#1E335A] dark:text-slate-200 hover:text-[#155EEF] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40",
                                                                            isDisabled && "opacity-45 grayscale pointer-events-none"
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
                                                                        "touch-manipulation group flex items-center justify-between py-2 px-2 -mx-2 rounded-lg min-h-[38px] transition-colors duration-150 text-left w-[calc(100%+1rem)] cursor-pointer select-none text-[#1E335A] dark:text-slate-200 hover:text-[#155EEF] hover:bg-[#F5F8FD] dark:hover:bg-slate-900/40",
                                                                        isDisabled && "opacity-45 grayscale pointer-events-none"
                                                                    )}
                                                                >
                                                                    {rowContent}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 8. STORE */}
                                        <div className="flex items-center">
                                            <Link
                                                href="/store"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="touch-manipulation group min-h-[52px] flex items-center justify-between w-full font-extrabold text-[15px] tracking-[0.005em] [word-spacing:0.03em] antialiased text-[#0B224D] dark:text-slate-100 hover:text-[#1D4ED8] transition-colors duration-150 cursor-pointer select-none outline-none focus-visible:outline-none"
                                            >
                                                <span>Store</span>
                                            </Link>
                                        </div>

                                    </nav>
                                    <div className="mx-6 h-px bg-[#EDF2F7] dark:bg-slate-800/80" aria-hidden="true" />
                                </div>

                                {/* Grounded Compact Contact Footer */}
                                <div className="px-6 py-3 pb-[max(0.875rem,calc(env(safe-area-inset-bottom)+0.625rem))] bg-[#F8FAFD] dark:bg-slate-900/60 border-t border-[#E8EEF6] dark:border-slate-800/80 shrink-0 relative z-10">
                                    <a 
                                        href="tel:8860040010" 
                                        aria-label="Call IDL Education at 8860040010"
                                        className="group w-full flex items-center justify-center gap-2.5 py-0.5 text-[#0A1E4A] dark:text-slate-100 hover:text-[#155EEF] dark:hover:text-blue-400 transition-colors duration-150 active:opacity-80 cursor-pointer touch-manipulation"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-[#155EEF]/[0.1] dark:bg-blue-500/15 flex items-center justify-center text-[#155EEF] dark:text-blue-400 shrink-0">
                                            <Phone className="w-[14px] h-[14px] stroke-[2.1]" shapeRendering="geometricPrecision" />
                                        </span>
                                        <span className="text-[15px] font-bold text-[#0A1E4A] dark:text-slate-100 group-hover:text-[#155EEF] dark:group-hover:text-blue-400 tracking-[0.02em] leading-none tabular-nums transition-colors duration-150">
                                            8860040010
                                        </span>
                                    </a>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Fixed Header Layout Spacer so content begins right below header */}
            <div className="h-[75px] w-full shrink-0 pointer-events-none select-none" aria-hidden="true" />

            <AuthModal 
                isOpen={isAuthOpen} 
                onOpenChange={setIsAuthOpen} 
                defaultMode={authDefaultMode} 
            />

            <AdmissionModal
                isOpen={isAdmissionOpen}
                onOpenChange={setIsAdmissionOpen}
            />

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onOpenChange={setIsFeedbackOpen}
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
