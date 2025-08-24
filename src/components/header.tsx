import Link from "next/link";
import { BookOpen, LogIn, Menu, Phone, Mail, Home as HomeIcon, User as UserIcon, Facebook, Twitter, Instagram, Info, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Header() {
  return (
    <div className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground py-2 px-4 lg:px-6">
        <div className="container mx-auto flex justify-between items-center text-xs font-medium">
          <div className="hidden sm:flex items-center gap-4">
              <Link href="#" className="hover:text-primary-foreground/80" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-primary-foreground/80" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-primary-foreground/80" aria-label="Twitter">
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
          <span className="ml-2 text-lg font-semibold">IDL EDUCATION</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            HOME
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            ABOUT
          </Link>
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                English
              </DropdownMenuItem>
              <DropdownMenuItem>
                Hindi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="ml-auto md:hidden flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                English
              </DropdownMenuItem>
              <DropdownMenuItem>
                Hindi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  HOME
                </Link>
                <Link href="/about" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Info className="h-5 w-5" />
                  ABOUT
                </Link>
                <Button asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login
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
