
'use client';

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Linkedin, Youtube, HandHeart } from "lucide-react";

const quickLinks = [
    { href: "#about", label: "About Us" },
    { href: "#donate", label: "Donate" },
    { href: "#events", label: "Events" },
    { href: "#contact", label: "Contact" },
];

const socialLinks = [
    { href: "#", label: "Instagram", icon: <Instagram className="w-5 h-5"/> },
    { href: "#", label: "Facebook", icon: <Facebook className="w-5 h-5"/> },
    { href: "#", label: "YouTube", icon: <Youtube className="w-5 h-5"/> },
];

export function FoundationFooter() {
    return (
        <footer className="bg-background text-gray-800 dark:text-gray-300">
            <Separator className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div>
                        <Link href="/idl-foundation" className="flex items-center gap-2 mb-4">
                            <Image src="/logo.png" alt="IDL Foundation Logo" width={32} height={32} />
                            <span className="text-lg font-bold text-primary">IDL FOUNDATION</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">A non-profit organization dedicated to empowering communities through education and skill development.</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                         <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                           {quickLinks.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
                        <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-primary" style={{width: 'calc(20% + 80px)'}}></div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                                <span>Y-25A Budh Vihar, Delhi-110086</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+917011117585" className="hover:text-primary hover:underline">+91 7011117585</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:info@idlfoundation.in" className="hover:text-primary hover:underline">info@idlfoundation.in</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us</h3>
                        <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-primary" style={{width: 'calc(20% + 80px)'}}></div>
                        <div className="flex items-center gap-3">
                            {socialLinks.map(link => (
                                <Link key={link.label} href={link.href} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label={link.label}>
                                    {link.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-900 mt-6 border-t border-gray-300 dark:border-gray-700 py-2 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} IDL Foundation. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
