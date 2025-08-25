
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Info, MessageSquare, Bell, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsToggle } from "./settings-toggle";
import { useLanguage } from "@/context/language-context";
import { Input } from "./ui/input";

export function Header() {
  const { t } = useLanguage();
  const brandName = "IDL EDUCATION";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="bg-primary text-primary-foreground py-2 text-xs">
            <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
                    <a href="tel:+917011117585" className="flex items-center gap-2 hover:underline">
                        <Phone className="h-4 w-4" />
                        <span className="font-extrabold">+91 70 1111 7585</span>
                    </a>
                    <a href="mailto:query@idleducation.in" className="flex items-center gap-2 hover:underline">
                        <Mail className="h-4 w-4" />
                        <span className="font-extrabold">query@idleducation.in</span>
                    </a>
                </div>
            </div>
        </div>
        <div className="px-4 lg:px-6 h-16 flex items-center">
            <Link href="/" className="flex items-center justify-center">
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
            <Link
                href="/"
                className="text-sm font-medium hover:underline underline-offset-4"
            >
                {t('home')}
            </Link>
            <Link
                href="/about"
                className="text-sm font-medium hover:underline underline-offset-4"
            >
                {t('about')}
            </Link>
            <Link
                href="/contact"
                className="text-sm font-medium hover:underline underline-offset-4"
            >
                {t('contact')}
            </Link>
            <Button asChild>
                <Link href="/login" className="transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30">
                <LogIn className="mr-2 h-4 w-4" /> {t('login')}
                </Link>
            </Button>
            <Link href="/notifications">
                <Button variant="outline" size="icon">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </Link>
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
            <Sheet>
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
                    <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <HomeIcon className="h-5 w-5" />
                    {t('home')}
                    </Link>
                    <Link href="/about" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Info className="h-5 w-5" />
                    {t('about')}
                    </Link>
                    <Link href="/contact" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-5 w-5" />
                    {t('contact')}
                    </Link>
                    <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> {t('login')}
                    </Link>
                    </Button>
                </nav>
                </SheetContent>
            </Sheet>
            </div>
        </div>
    </header>
  );
}
