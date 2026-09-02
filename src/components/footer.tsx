'use client';
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ContactForm } from "./contact-form";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "IDL Blog" },
];

const resourceLinks = [
  { href: "/resources/notes", label: "Notes" },
  { href: "/resources/ncert-solutions", label: "NCERT Solutions" },
  { href: "/resources/previous-year-questions", label: "Previous YQP" },
  { href: "/store", label: "IDL Store", target: "_blank" },
];

const programLinks = [
  { href: "/admission", label: "Admission Form" },
  { href: "/book-demo", label: "Book Free Demo" },
  { href: "/scholarship", label: "Scholarship" },
  { href: "/offline-centers", label: "Offline Centers" },
];

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-[#f8fafc] border-t border-slate-200 text-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col items-start -mt-5">
                        <Link href="/" className="flex items-center justify-start">
                            <Image 
                              src="/idllogoh.png" 
                              alt="IDL Education Logo" 
                              width={300} 
                              height={85} 
                              className="h-20 w-auto object-contain object-left" 
                              priority
                            />
                        </Link>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed text-left max-w-xs pl-0.5 -mt-3">
                          We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
                        </p>
                    </div>

                    <div className="flex items-center justify-start gap-2 pt-0.5">
                        {[
                          { icon: <Instagram className="h-4 w-4" />, label: "Instagram", href: "https://www.instagram.com/idleducation" },
                          { icon: <Facebook className="h-4 w-4" />, label: "Facebook", href: "https://www.facebook.com/idleducation" },
                          { icon: <Twitter className="h-4 w-4" />, label: "Twitter", href: "https://x.com/idleducation" },
                          { icon: <Youtube className="h-4 w-4" />, label: "YouTube", href: "https://www.youtube.com/@idleducation" }
                        ].map((social) => (
                          <Link
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-600 p-2 rounded-full border border-slate-200"
                            aria-label={social.label}
                          >
                            {social.icon}
                          </Link>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                      Quick Links
                    </h3>
                    <ul className="space-y-2.5 text-xs font-medium">
                        {quickLinks.map(link => (
                            <li key={link.href}>
                                {link.label === "Contact Us" ? (
                                    <button
                                        onClick={() => setIsContactOpen(true)}
                                        className="text-slate-600 flex items-center gap-2 text-left w-full cursor-pointer"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                        {link.label}
                                    </button>
                                ) : (
                                    <Link href={link.href} className="text-slate-600 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Resources */}
                <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                      Resources
                    </h3>
                    <ul className="space-y-2.5 text-xs font-medium">
                        {resourceLinks.map(link => (
                            <li key={link.href}>
                                <Link 
                                  href={link.href} 
                                  target={link.target} 
                                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} 
                                  className="text-slate-600 flex items-center gap-2"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Programs & Admissions */}
                <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                      Programs & Admissions
                    </h3>
                    <ul className="space-y-2.5 text-xs font-medium">
                        {programLinks.map(link => (
                            <li key={link.href}>
                                <Link 
                                  href={link.href} 
                                  className="text-slate-600 flex items-center gap-2"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="bg-white border-t border-slate-200/80 py-3.5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-slate-500">
                    <p className="text-center sm:text-left" suppressHydrationWarning>&copy; {new Date().getFullYear()} IDL Education. All Rights Reserved.</p>
                    <nav className="flex gap-6">
                        <Link href="/terms" className="text-slate-500">Terms</Link>
                        <Link href="/privacy" className="text-slate-500">Privacy</Link>
                    </nav>
                </div>
            </div>
        </div>

        <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-white p-8">
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-2xl font-extrabold text-primary tracking-tighter">Contact Us</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-[13px] font-extrabold">Have a query? Drop us a line below.</DialogDescription>
                </DialogHeader>
                <ContactForm onSuccess={() => setIsContactOpen(false)} />
            </DialogContent>
        </Dialog>
    </footer>
  );
}
