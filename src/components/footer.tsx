
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, Send, Youtube } from "lucide-react";
import Image from "next/image";
import { allPrograms } from "@/lib/courses";
import { Separator } from "./ui/separator";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/achievements", label: "Achievements" },
  { href: "/blog", label: "IDL Blog" },
  { href: "/idl-foundation", label: "IDL Foundation", target: "_blank" },
];

const resourceLinks = [
  { href: "/resources/notes", label: "Notes" },
  { href: "/resources/ncert-solutions", label: "NCERT Solutions" },
  { href: "/resources/previous-year-questions", label: "Previous Year Questions" },
  { href: "/resources/reference-books", label: "Reference Books" },
  { href: "/store", label: "IDL Store", target: "_blank" },
];

export function Footer() {
  return (
    <footer className="bg-[#F5F5F7] dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col items-center text-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Link href="/" className="flex flex-col items-center gap-2">
                        <Image src="/logo.png" alt="IDL Education Logo" width={72} height={72} />
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-black text-primary">IDL EDUCATION</span>
                            <span className="text-[0.4rem] text-primary/80 tracking-wider -mt-1 font-black">
                              (Institute of Distance Learning Pvt. Ltd.)
                            </span>
                        </div>
                    </Link>
                    <p className="text-lg text-muted-foreground font-dancing-script font-extrabold">
                      We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
                    </p>
                    <div className="flex items-center gap-2">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.linkedin.com/company/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </Link>
                        <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Twitter">
                          <Twitter className="h-4 w-4" />
                        </Link>
                         <Link href="https://t.me/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Telegram">
                          <Send className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.youtube.com/@idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="YouTube">
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
                                <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
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
                                <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
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
                            />
                        </Link>
                        <div className="cursor-not-allowed">
                            <Image 
                                src="https://www.pw.live/_next/static/media/apple-store-badge.acb101ce.webp"
                                alt="Download on the App Store"
                                width={135}
                                height={40}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
            <div className="container mx-auto px-4 md:px-6 py-1">
                <div className="flex flex-col sm:flex-row justify-between items-center text-[0.6rem]">
                    <div className="flex items-center gap-2">
                        <Image 
                            src="https://icon2.cleanpng.com/20180920/zs/kisspng-iso-9-iso-9-1-international-organization-for-s-aidima-implantacin-iso-14-y-gestion-de-sist-5ba370134a6743.6791764215374377153048.jpg" 
                            alt="ISO Certified" 
                            width={30} 
                            height={30}
                            className="rounded-full"
                        />
                        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
                    </div>
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
