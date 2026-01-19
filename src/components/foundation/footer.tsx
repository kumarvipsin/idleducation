'use client';

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Linkedin, Youtube, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
    { href: "#about", label: "About Us", isDialog: false },
    { href: "#donate", label: "Donate", isDialog: true },
    { href: "/volunteer", label: "Become a Volunteer" },
];

const socialLinks = [
    { href: "#", label: "Instagram", icon: <Instagram className="w-5 h-5"/> },
    { href: "#", label: "Facebook", icon: <Facebook className="w-5 h-5"/> },
    { href: "#", label: "YouTube", icon: <Youtube className="w-5 h-5"/> },
];

interface FoundationFooterProps {
  openDonateDialog: () => void;
}

export function FoundationFooter({ openDonateDialog }: FoundationFooterProps) {
    return (
        <footer className="bg-blue-950 text-gray-300">
            <Separator className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <Link href="/idl-foundation" className="flex flex-col items-center gap-2">
                            <Image src="/logo.png" alt="IDL Foundation Logo" width={72} height={72} />
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-black text-white">IDL FOUNDATION</span>
                            </div>
                        </Link>
                        <p className="text-lg text-white/80 font-dancing-script font-extrabold">A non-profit organization dedicated to empowering communities through education and skill development.</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                           {quickLinks.map(link => (
                                <li key={link.href}>
                                  {link.href === '#donate' ? (
                                      <button onClick={openDonateDialog} className="text-white/80 hover:text-white hover:underline underline-offset-4 transition-colors">{link.label}</button>
                                  ) : (
                                    <Link href={link.href} className="text-white/80 hover:text-white hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                                  )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Reach Us</h3>
                        <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-white" style={{width: 'calc(20% + 80px)'}}></div>
                        <ul className="space-y-2 text-sm text-white/80">
                        </ul>
                    </div>

                    {/* Column 4: Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                        <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-white" style={{width: 'calc(20% + 80px)'}}></div>
                        <div className="flex items-center gap-3">
                            {socialLinks.map(link => (
                                <Link key={link.label} href={link.href} className="p-2 bg-white/10 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors" aria-label={link.label}>
                                    {link.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-blue-900 border-t border-blue-800 py-2 text-center text-xs text-white/60">
                <p>&copy; {new Date().getFullYear()} IDL Foundation. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
