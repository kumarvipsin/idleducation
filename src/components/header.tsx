
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, Search, LogOut, User, Users, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsToggle } from "./settings-toggle";
import { useLanguage } from "@/context/language-context";
import { Input } from "./ui/input";
import { useAuth, type UserProfile } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUpdates } from "@/app/actions";
import { formatDistanceToNow } from 'date-fns';

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

  useEffect(() => {
    const fetchUpdates = async () => {
      const result = await getUpdates(3); // Fetch only the 3 most recent updates
      if (result.success && result.data) {
        setUpdates(result.data as Update[]);
      }
    };
    fetchUpdates();
  }, []);

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

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="bg-primary text-primary-foreground py-2 text-xs">
            <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
                    <a href="tel:+917011117585" className="flex items-center gap-2 hover:underline">
                        <Phone className="h-4 w-4" />
                        <span className="font-extrabold">+91 70 1111 7585</span>
                    </a>
                </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
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
                <Button variant="ghost" size="icon">
                    <Bell className="h-6 w-6" />
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
                <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                 <div className="relative mt-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-9 rounded-full w-full" />
                </div>
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  {navLinks.map(({ href, label, icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-2.5 hover:text-foreground ${pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                    >
                      {icon}
                      {label}
                    </Link>
                  ))}
                    {user ? (
                      <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" /> {t('login')}
                        </Link>
                      </Button>
                    )}
                </nav>
                </SheetContent>
            </Sheet>
            </div>
        </div>
    </header>
  );
}
