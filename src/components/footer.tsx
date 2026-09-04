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

const foundationLinks = [
  { href: "/idl-foundation", label: "IDL Foundation", target: "_blank" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/workshop", label: "Workshops" },
];

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-[#f8fafc] border-t border-slate-200 text-slate-700">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col items-start gap-4 lg:col-span-3">
                    <div className="flex flex-col items-start gap-3">
                        <Link href="/" className="flex items-center justify-start">
                            <Image 
                              src="/idllogo.png" 
                              alt="IDL Education Logo" 
                              width={105} 
                              height={105} 
                              className="h-[105px] w-auto object-contain object-left" 
                              priority
                            />
                        </Link>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed text-left max-w-xs">
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

                {/* 4 Link Sections (Shifted Right with Reduced Gap) */}
                <div className="lg:col-span-8 lg:col-start-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                          Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-xs font-medium pl-3.5">
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    {link.label === "Contact Us" ? (
                                        <button
                                            onClick={() => setIsContactOpen(true)}
                                            className="text-slate-600 hover:text-blue-600 text-left w-full cursor-pointer transition-colors"
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <Link href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors block">
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
                        <ul className="space-y-2.5 text-xs font-medium pl-3.5">
                            {resourceLinks.map(link => (
                                <li key={link.href}>
                                    <Link 
                                      href={link.href} 
                                      target={link.target} 
                                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} 
                                      className="text-slate-600 hover:text-blue-600 transition-colors block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Apply For */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                          Apply For
                        </h3>
                        <ul className="space-y-2.5 text-xs font-medium pl-3.5">
                            {programLinks.map(link => (
                                <li key={link.href}>
                                    <Link 
                                      href={link.href} 
                                      className="text-slate-600 hover:text-blue-600 transition-colors block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5: Foundation */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                          Foundation
                        </h3>
                        <ul className="space-y-2.5 text-xs font-medium pl-3.5">
                            {foundationLinks.map(link => (
                                <li key={link.href}>
                                    <Link 
                                      href={link.href} 
                                      target={link.target}
                                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                                      className="text-slate-600 hover:text-blue-600 transition-colors block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Know About IDL Education - Full Width */}
            <div className="mt-4 pt-4 text-left">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Know About IDL Education</h3>
              <p className="text-xs font-normal text-slate-500 leading-relaxed">
                IDL Education is a modern learning and coaching platform committed to helping students learn better, perform better, and achieve more. We provide classroom and online programs, expert guidance, regular assessments, doubt support, and comprehensive preparation for school and competitive examinations.
              </p>
              <p className="text-xs font-normal text-slate-500 leading-relaxed mt-2">
                Our focus is simple — strong fundamentals, consistent practice, personalized guidance, and measurable results. With dedicated educators and a student-first approach, we strive to make quality education accessible, structured, and outcome-oriented.
              </p>

              <h3 className="text-sm font-bold text-slate-900 mb-3 mt-6">We Stand Out Because</h3>
              <p className="text-xs font-normal text-slate-500 leading-relaxed">
                At IDL Education, we bring together experienced educators, personalized mentorship, structured courses, and focused preparation to create a learning experience built around every student&apos;s growth.
              </p>
              <p className="text-xs font-normal text-slate-500 leading-relaxed mt-2">
                From school academics to JEE, NEET &amp; CUET, we make quality education more accessible through comprehensive study resources, regular assessments, doubt support, and technology-enabled learning.
              </p>
              <p className="text-xs font-normal text-slate-500 leading-relaxed mt-2">
                We believe every student deserves the right guidance, the right environment, and the opportunity to achieve their full potential.
              </p>

              <h3 className="text-sm font-bold text-slate-900 mb-3 mt-6">Our Key Focus Areas</h3>
              <p className="text-xs font-normal text-slate-500 leading-relaxed">
                From strong academic foundations to competitive examination preparation, IDL Education brings together quality teaching, structured resources, regular assessments, and personalized mentorship — creating a complete learning ecosystem designed around student success.
              </p>

              <h3 className="text-sm font-bold text-slate-900 mb-3 mt-6">What Makes Us Different</h3>
              <p className="text-xs font-normal text-slate-500 leading-relaxed">
                At IDL Education, we go beyond traditional classroom learning by combining expert faculty, personal attention, structured learning, and continuous performance assessment. Our approach is designed to make concepts clear, learning consistent, and preparation focused.
              </p>
              <p className="text-xs font-normal text-slate-500 leading-relaxed mt-2">
                From Classes 6–12 to JEE, NEET &amp; CUET, students receive comprehensive academic support through quality study material, regular tests, doubt-solving, mentorship, and technology-enabled learning.
              </p>
              <p className="text-xs font-normal text-slate-500 leading-relaxed mt-2">
                We focus on helping every student understand better, improve consistently, and achieve their true potential.
              </p>
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
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-md shadow-none rounded-2xl border-2 border-primary/10 bg-white dark:bg-slate-900 p-0 overflow-hidden">
                <DialogHeader className="text-center p-8 pb-0">
                    <DialogTitle className="text-2xl font-extrabold text-primary tracking-tighter">Contact Us</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-[13px] font-extrabold">Have a query? Drop us a line below.</DialogDescription>
                </DialogHeader>
                <ContactForm onSuccess={() => setIsContactOpen(false)} />
            </DialogContent>
        </Dialog>
    </footer>
  );
}
