
'use client';
import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, Instagram, Facebook, Twitter, Info, Cog, MessageSquare, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { SettingsToggle } from "./settings-toggle";
import { useLanguage } from "@/context/language-context";

export function Header() {
  const { t } = useLanguage();
  const brandName = "IDL EDUCATION";

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground py-1 px-4 lg:px-6">
        <div className="container mx-auto flex justify-between items-center text-xs font-bold">
          <div className="hidden sm:flex items-center gap-4">
              <Link href="#" className="p-2 border border-primary-foreground/50 rounded-full hover:bg-primary-foreground/10" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 border border-primary-foreground/50 rounded-full hover:bg-primary-foreground/10" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 border border-primary-foreground/50 rounded-full hover:bg-primary-foreground/10" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <a href="tel:+917011117585" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" />
              <span>+91 70 1111 7585</span>
            </a>
            <a href="mailto:query@idleducation.in" className="flex items-center gap-1 hover:underline">
              <Mail className="h-3 w-3" />
              <span>query@idleducation.in</span>
            </a>
          </div>
          <div className="w-24 hidden sm:block"></div>
        </div>
      </div>
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b">
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
            <Link href="/login" className="transition-all duration-300 ease-in-out bg-primary text-primary-foreground hover:bg-transparent hover:text-primary hover:shadow-[inset_0_0_0_2px_hsl(var(--primary))]">
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
      </header>
    </div>
  );
}
