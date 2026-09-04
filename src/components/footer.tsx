'use client';
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ContactModal } from "./contact-modal";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/journey", label: "The Journey" },
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
        <div className="container mx-auto px-4 md:px-6 pt-8 pb-5 sm:pt-9 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col items-start gap-3 md:col-span-4 lg:col-span-3">
                    <div className="flex flex-col items-start gap-1 -mt-1.5 sm:-mt-2">
                        <Link href="/" className="flex items-center justify-start">
                            <Image 
                              src="/idllogo.png" 
                              alt="IDL Education Logo" 
                              width={105} 
                              height={105} 
                              className="h-[92px] sm:h-[96px] w-auto object-contain object-left" 
                              priority
                            />
                        </Link>
                        <p className="text-xs text-slate-500 font-medium leading-[1.48] text-left max-w-xs">
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
                            className="bg-white text-slate-600 p-2 rounded-full border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-colors"
                            aria-label={social.label}
                          >
                            {social.icon}
                          </Link>
                        ))}
                    </div>
                </div>

                {/* 4 Link Sections (2-column on mobile for compact height, 4-column on desktop) */}
                <div className="md:col-span-8 lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-6 lg:gap-4">
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                          Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-xs font-medium pl-3.5" suppressHydrationWarning>
                            {quickLinks.map(link => (
                                <li key={link.label}>
                                    <Link 
                                        href={link.href}
                                        onClick={link.label === "Contact Us" ? (e) => {
                                            e.preventDefault();
                                            setIsContactOpen(true);
                                        } : undefined}
                                        className="text-slate-600 hover:text-blue-600 transition-colors block"
                                    >
                                        {link.label}
                                    </Link>
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

                {/* Column 6: Get in Touch (Right-Side Space Utilization) */}
                <div className="md:col-span-12 lg:col-span-3 flex flex-col items-start">
                    <div className="w-full">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-l-3 border-blue-600 pl-2.5">
                          Get in Touch
                        </h3>
                        <div className="space-y-3 text-xs pl-3.5 text-left">
                            <div className="space-y-0.5">
                                <p className="text-slate-500 font-medium">Have questions?</p>
                                <p className="text-slate-900 font-bold">Talk to our team</p>
                            </div>

                            <div className="space-y-2 pt-0.5">
                                <a 
                                  href="tel:8860040010" 
                                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>8860040010</span>
                                </a>
                                <a 
                                  href="mailto:info@idleducation.in" 
                                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors break-all"
                                >
                                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>info@idleducation.in</span>
                                </a>
                            </div>

                            <div className="pt-1">
                                <button
                                  onClick={() => setIsContactOpen(true)}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer group"
                                >
                                  <span>Contact Us</span>
                                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Know About IDL Education - Full Width Left to Right on Desktop */}
            <div className="w-full mt-6 pt-5 sm:mt-7 sm:pt-6 border-t border-slate-200/70 text-left space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Know About IDL Education</h3>
                <div className="space-y-2 text-xs font-normal text-slate-500 leading-relaxed">
                  <p>
                    IDL Education is a modern learning and coaching platform committed to helping students learn better, perform better, and achieve more. We provide classroom and online programs, expert guidance, regular assessments, doubt support, and comprehensive preparation for school and competitive examinations.
                  </p>
                  <p>
                    Our focus is simple — strong fundamentals, consistent practice, personalized guidance, and measurable results. With dedicated educators and a student-first approach, we strive to make quality education accessible, structured, and outcome-oriented.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">We Stand Out Because</h3>
                <div className="space-y-2 text-xs font-normal text-slate-500 leading-relaxed">
                  <p>
                    At IDL Education, we bring together experienced educators, personalized mentorship, structured courses, and focused preparation to create a learning experience built around every student&apos;s growth.
                  </p>
                  <p>
                    From school academics to JEE, NEET &amp; CUET, we make quality education more accessible through comprehensive study resources, regular assessments, doubt support, and technology-enabled learning.
                  </p>
                  <p>
                    We believe every student deserves the right guidance, the right environment, and the opportunity to achieve their full potential.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Our Key Focus Areas</h3>
                <div className="space-y-2 text-xs font-normal text-slate-500 leading-relaxed">
                  <p>
                    From strong academic foundations to competitive examination preparation, IDL Education brings together quality teaching, structured resources, regular assessments, and personalized mentorship — creating a complete learning ecosystem designed around student success.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">What Makes Us Different</h3>
                <div className="space-y-2 text-xs font-normal text-slate-500 leading-relaxed">
                  <p>
                    At IDL Education, we go beyond traditional classroom learning by combining expert faculty, personal attention, structured learning, and continuous performance assessment. Our approach is designed to make concepts clear, learning consistent, and preparation focused.
                  </p>
                  <p>
                    From Classes 6–12 to JEE, NEET &amp; CUET, students receive comprehensive academic support through quality study material, regular tests, doubt-solving, mentorship, and technology-enabled learning.
                  </p>
                  <p>
                    We focus on helping every student understand better, improve consistently, and achieve their true potential.
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="bg-white border-t border-slate-200/80 py-3.5">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-slate-500">
                    <p className="text-center sm:text-left" suppressHydrationWarning>&copy; 2026 IDL Education. All Rights Reserved.</p>
                    <nav className="flex gap-6">
                        <Link href="/terms" className="text-slate-500 hover:text-blue-600 transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy</Link>
                    </nav>
                </div>
            </div>
        </div>

        <ContactModal 
            isOpen={isContactOpen} 
            onOpenChange={setIsContactOpen} 
        />
    </footer>
  );
}
