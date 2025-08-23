import Link from "next/link";
import { BookOpen, LogIn, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export function Header() {
  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/director", label: "Director's Profile" },
    { href: "/achievements", label: "Achievements" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">IDL EDUCATION</span>
      </Link>
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
        {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4">
                {link.label}
            </Link>
        ))}
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Link>
        </Button>
      </nav>
      <div className="ml-auto md:hidden">
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
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-foreground hover:text-foreground/80">
                    {link.label}
                </Link>
              ))}
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
  );
}
