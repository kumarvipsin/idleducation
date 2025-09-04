
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, LogOut, User, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsToggle } from "./settings-toggle";
import { useLanguage } from "@/context/language-context";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUpdates } from "@/app/actions";
import { formatDistanceToNow } from 'date-fns';
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export function Header() {
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const brandName = "IDL EDUCATION";
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

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
       <Button asChild>
          <Link href="/login" className="transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30">
          <LogIn className="mr-2 h-4 w-4" /> {t('login')}
          </Link>
      </Button>
    );
  };
  
  const navLinks = [
    { href: '/', label: t('home'), icon: <HomeIcon className="h-5 w-5" /> },
    { href: '/about', label: t('about'), icon: <Info className="h-5 w-5" /> },
    { href: '/contact', label: t('contact'), icon: <MessageSquare className="h-5 w-5" /> },
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
        <Button asChild className="w-full">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" /> {t('login')}
            </Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="bg-primary text-primary-foreground py-1 text-xs">
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Button variant="link" size="sm" asChild className="text-primary-foreground hover:no-underline">
                    <a href="tel:+917011117585" className="flex items-center gap-1">
                        <Phone className="h-4 w-4 animate-ring" />
                        <span className="hidden sm:inline">+91 7011117585</span>
                    </a>
                </Button>
                 <div className="flex-1 text-center">
                    <div className="marquee">
                        <Link href="/admission" className="flex items-center gap-2 hover:underline">
                            <span className="font-bold">Admissions Open for Session 2024-25. Click here to apply!</span>
                        </Link>
                    </div>
                 </div>
                 <Button variant="link" size="sm" asChild className="text-primary-foreground hover:no-underline">
                    <Link href="/admission" className="flex items-center gap-1">
                        <FileText className="h-4 w-4"/>
                        <span>{t('admissionForm')}</span>
                    </Link>
                </Button>
            </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
            <Link href={logoHref} className="flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
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
            <DropdownMenu onOpenChange={handleNotificationOpenChange}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
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
            <SettingsToggle />
            </nav>
            <div className="ml-auto md:hidden flex items-center gap-2">
            <SettingsToggle />
            <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6" />
                    {hasNewUpdates && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full p-0 flex flex-col bg-background/80 backdrop-blur-sm rounded-b-lg">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
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
