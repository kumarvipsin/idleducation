
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText, Image as ImageIcon, ShoppingCart, Plus, Minus, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
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

const initialCartItems: CartItem[] = [
    { id: 1, name: 'Mathematics for Class 10', price: 600, quantity: 1, image: 'https://picsum.photos/seed/rdsharma10/100/100' },
    { id: 2, name: 'Science for Class 10', price: 650, quantity: 1, image: 'https://picsum.photos/seed/lakhmir10/100/100' },
];

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;
const scholarshipClasses = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

export function Header() {
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const brandName = "IDL EDUCATION";
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isScholarshipDialogOpen, setIsScholarshipDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: { studentName: '', class: '', mobile: '' },
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
        handleRemoveItem(itemId);
    } else {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };
  
  const onScholarshipSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
    const result = await registerForScholarship(data);
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
      const result = await getUpdates(3); // Fetch only the 3 most recent updates
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
    fetchUpdates();
  }, []);
  
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

  const logoHref = getDashboardPath(user);

  const renderAuthSection = () => {
    if (loading) {
      return <Button variant="ghost">Loading...</Button>;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
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
       <Button asChild variant="outline" className="h-8 py-1 uppercase font-bold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out">
          <Link href="/login">{t('login')}</Link>
      </Button>
    );
  };
  
  const navLinks = [
    { href: '/', label: t('home'), icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/about', label: t('about'), icon: <Info className="h-5 w-5" /> },
    { href: '/contact', label: t('contact'), icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/gallery', label: t('gallery'), icon: <ImageIcon className="h-5 w-5" /> },
  ];

  const loggedInNavLinks = [
    { href: getDashboardPath(user), label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: getProfilePath(user), label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  const renderMobileAuthSection = () => {
    if (loading) {
        return (
            <div className="flex items-center gap-3 p-4 border-t">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        );
    }
    if (user) {
      return (
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-md bg-muted/50">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
              <AvatarFallback>
                {user.name ? user.name.charAt(0).toUpperCase() : <User />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-2">
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
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      );
    }
    return (
       <div className="border-t p-4">
        <Button asChild className="w-full h-8 py-1 uppercase font-bold bg-purple text-purple-foreground rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" /> {t('login')}
            </Link>
        </Button>
      </div>
    );
  };

  const ScholarshipButton = () => (
     <Link href="/scholarship" className="hover:underline inline-block mr-16">
        <Badge variant="destructive" className="mr-2 animate-pulse text-red-500 bg-transparent border-none p-0 text-[0.6rem] font-bold uppercase">NEW</Badge>
        <span className="font-bold uppercase text-[0.6rem] text-black">
          <span className="hidden md:inline">IDL National Scholarship & Admission Test For Class 5 To 10</span>
          <span className="md:hidden">IDL Scholarship Test</span>
        </span>
    </Link>
  );

  const cartDropdown = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-7 w-7 rounded-full bg-background/50 hover:bg-muted/50">
                <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                )}
                <span className="sr-only">Open Cart</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel>My Cart</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cartItems.length > 0 ? (
                <>
                    <div className="max-h-64 overflow-y-auto pr-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" />
                                <div className="flex-1">
                                    <p className="font-medium text-xs truncate">{item.name}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                    </div>
                                </div>
                                <p className="font-semibold text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveItem(item.id)}><XCircle className="h-4 w-4" /></Button>
                            </div>
                        ))}
                    </div>
                     <DropdownMenuSeparator />
                     <div className="p-2 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>GST (18%)</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                     </div>
                     <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                          <Button className="w-full">Proceed to Checkout</Button>
                      </DropdownMenuItem>
                </>
            ) : (
                 <div className="text-center text-sm text-muted-foreground p-4">Your cart is empty.</div>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const notificationDropdown = (
    <DropdownMenu onOpenChange={handleNotificationOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-7 w-7 rounded-full bg-background/50 hover:bg-muted/50">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {hasNewUpdates && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            )}
            <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent Updates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {updates.length > 0 ? (
          updates.map(update => (
            <DropdownMenuItem key={update.id} className="flex flex-col items-start gap-1">
                <p className="font-semibold">{update.title}</p>
                <p className="text-xs text-muted-foreground">{update.description}</p>
                <p className="text-xs text-muted-foreground self-end">
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

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="bg-[#e9ecef] text-black text-xs">
            <div className="container mx-auto px-4 md:px-[10%] flex justify-between items-center h-8">
                <div className="flex items-center">
                    
                </div>
                <div className="flex-1 text-center overflow-hidden whitespace-nowrap">
                    <div className="marquee-container">
                        <div className="marquee">
                           <ScholarshipButton />
                        </div>
                         <div className="marquee">
                           <ScholarshipButton />
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-1">
                    {cartDropdown}
                    {notificationDropdown}
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 md:px-[10%] h-14 flex items-center">
            <Link href={logoHref} className="flex items-center justify-center">
            <Image src="/logo.png" alt="IDL Education Logo" width={40} height={40} className="h-8 w-auto filter hue-rotate-15 saturate-150" />
            <span className="ml-2 text-lg font-semibold">
                {brandName.split('').map((char, index) => (
                <span
                    key={index}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    {char}
                </span>
                ))}
            </span>
            </Link>
            <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium hover:underline underline-offset-4 ${pathname === href ? 'text-primary' : ''}`}
                  >
                    {label}
                  </Link>
                ))}
            {renderAuthSection()}
            </nav>
            <div className="ml-auto md:hidden flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col bg-white dark:bg-background">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto flex-grow">
                        <div className="p-4">
                        <nav className="grid gap-2 text-base font-medium">
                        {navLinks.map(({ href, label, icon }) => (
                            <Link
                            key={href}
                            href={href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-muted ${pathname === href ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}
                            >
                            {icon}
                            <span>{label}</span>
                            </Link>
                        ))}
                        </nav>
                    </div>
                  </div>

                  <div className="mt-auto shrink-0">
                    {renderMobileAuthSection()}
                  </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
    </header>
  );
}
