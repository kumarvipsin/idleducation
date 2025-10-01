
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, Send, Youtube } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { allPrograms } from "@/lib/courses";

const quickLinks = [
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About Us" },
  { href: "/achievements", label: "Achievements" },
];

const resourceLinks = [
  { href: "/resources/notes", label: "Notes" },
  { href: "/resources/ncert-solutions", label: "NCERT Solutions" },
  { href: "/resources/previous-year-questions", label: "Previous Year Papers" },
  { href: "/resources/reference-books", label: "Reference Books" },
];

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        <div className="container mx-auto px-4 md:px-6 pt-12">
           <Separator />
        </div>
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="IDL Education Logo" width={32} height={32} />
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-bold text-primary">IDL EDUCATION</span>
                            <span className="text-[0.4rem] text-primary/80 tracking-wider -mt-1">
                              (Institute of Distance Learning Pvt. Ltd.)
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
                    </p>
                    <div className="flex items-center gap-2">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.linkedin.com/company/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </Link>
                        <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                          <Twitter className="h-4 w-4" />
                        </Link>
                         <Link href="https://t.me/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Telegram">
                          <Send className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.youtube.com/@idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="YouTube">
                          <Youtube className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        {quickLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Column 3: Resources */}
                <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        {resourceLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Get our App */}
                <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Get Our App</h3>
                    <p className="text-sm text-muted-foreground mb-4">IDL Learning App - Learn Smart</p>
                    <div className="flex flex-col items-start gap-2">
                        <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                            <Image 
                                src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                                alt="Get it on Google Play"
                                width={135}
                                height={40}
                                className="h-auto"
                            />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center text-xs">
                    <p className="text-muted-foreground">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
                    <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
                        <Link href="#" className="text-muted-foreground hover:text-primary hover:underline underline-offset-4">
                        Terms of Service
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary hover:underline underline-offset-4">
                        Privacy
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    </footer>
  );
}
