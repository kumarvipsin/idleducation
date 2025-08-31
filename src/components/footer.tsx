
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                {/* Column 1: Brand Info */}
                <div>
                    <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <BookOpen className="h-8 w-8" />
                        <span className="text-2xl font-bold">IDL EDUCATION</span>
                    </Link>
                    <p className="text-sm text-primary-foreground/80">
                        Empowering students with quality education to achieve their dreams.
                    </p>
                </div>

                {/* Column 2: Contact Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-3 text-sm text-primary-foreground/80">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>E-18 Krishan Vihar, Delhi-110086</span>
                        </li>
                    </ul>
                </div>
                
                {/* Column 3: Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground" aria-label="Instagram">
                          <Instagram className="h-6 w-6" />
                        </Link>
                        <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground" aria-label="Facebook">
                          <Facebook className="h-6 w-6" />
                        </Link>
                        <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground" aria-label="Twitter">
                          <Twitter className="h-6 w-6" />
                        </Link>
                    </div>
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
