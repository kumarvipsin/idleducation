import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold">LearnScape</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
          About Us
        </Link>
        <Link href="/director" className="text-sm font-medium hover:underline underline-offset-4">
          Director's Profile
        </Link>
        <Button asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Link>
        </Button>
      </nav>
    </header>
  );
}
