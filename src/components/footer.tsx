import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                    <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <BookOpen className="h-8 w-8 text-primary-foreground" />
                        <span className="text-2xl font-bold text-primary-foreground">IDL EDUCATION</span>
                    </Link>
                    <p className="text-sm text-primary-foreground/80 max-w-sm mx-auto md:mx-0">
                        Empowering students with quality education to achieve their dreams.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Instagram">
                      <Instagram className="h-6 w-6" />
                    </Link>
                    <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Facebook">
                      <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground" aria-label="Twitter">
                      <Twitter className="h-6 w-6" />
                    </Link>
                </div>
            </div>
            <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs">
                <p className="text-primary-foreground/80">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                    <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline underline-offset-4">
                    Terms of Service
                    </Link>
                    <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground hover:underline underline-offset-4">
                    Privacy
                    </Link>
                </nav>
            </div>
        </div>
    </footer>
  );
}
