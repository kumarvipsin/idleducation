'use client';
import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
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
    <footer className="relative bg-[#F4F7FB] dark:bg-background text-slate-700 dark:text-slate-300 border-t border-[#E8EDF5] dark:border-slate-800/80 overflow-hidden">
      {/* Ambient soft glow towards top-right */}
      <div className="absolute -top-12 right-[8%] w-[460px] sm:w-[620px] h-[320px] bg-blue-500/[0.025] dark:bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Very faint IDL dot texture (2-3% opacity, primarily in empty spaces) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(#0B1F4B 1px, transparent 1px)`,
          backgroundSize: `24px 24px`
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 md:pt-16 pb-10 sm:pb-12 md:pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_0.75fr_0.75fr_0.75fr_0.9fr] gap-x-6 sm:gap-x-8 lg:gap-x-5 xl:gap-x-8 gap-y-8 sm:gap-y-9 items-start">

          {/* Column 1: Brand & Socials (~28% desktop ratio) */}
          <div className="flex flex-col items-start col-span-2 lg:col-span-1 pr-0 lg:pr-2">
            <Link href="/" className="inline-block -mt-1 sm:-mt-2 mb-2 transition-opacity duration-150 hover:opacity-90">
              <Image 
                src="/idllogo.png" 
                alt="IDL Education Logo" 
                width={105} 
                height={105} 
                className="h-[88px] sm:h-[92px] w-auto object-contain object-left" 
                priority
              />
            </Link>

            <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 font-normal leading-[1.5] antialiased tracking-normal text-left max-w-[310px] sm:max-w-[330px] mb-5 sm:mb-6">
              We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center justify-start gap-2.5 sm:gap-3">
              {[
                { 
                  label: "Instagram", 
                  href: "https://www.instagram.com/idleducation",
                  icon: (
                    <svg className="w-[18.5px] h-[18.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2.5" y="2.5" width="19" height="19" rx="4.8" ry="4.8" />
                      <circle cx="12" cy="12" r="3.9" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
                    </svg>
                  )
                },
                { 
                  label: "Facebook", 
                  href: "https://www.facebook.com/idleducation",
                  icon: (
                    <svg className="w-[18.5px] h-[18.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  )
                },
                { 
                  label: "X / Twitter", 
                  href: "https://x.com/idleducation",
                  icon: (
                    <svg className="w-[17.5px] h-[17.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4.5l11.5 15h4.5l-11.5 -15z" />
                      <path d="M4 19.5l6.5 -6.5m2.5 -2.5l6.5 -6.5" />
                    </svg>
                  )
                },
                { 
                  label: "YouTube", 
                  href: "https://www.youtube.com/@idleducation",
                  icon: (
                    <svg className="w-[19.5px] h-[19.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <path d="m10 15 5-3-5-3z" />
                    </svg>
                  )
                }
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-[13px] bg-white dark:bg-card flex items-center justify-center border border-slate-200/70 dark:border-border/40 text-[#0B1F4B] dark:text-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-[#1D4ED8]/40 hover:text-[#1D4ED8] hover:bg-[#F7FAFD] dark:hover:bg-slate-800/70 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-150 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/60 focus-visible:ring-offset-2"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-3.5 sm:mb-4 border-l-2 border-[#1D4ED8] pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[12.5px] sm:text-[13px] font-medium pl-2.5" suppressHydrationWarning>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    onClick={link.label === "Contact Us" ? (e) => {
                      e.preventDefault();
                      setIsContactOpen(true);
                    } : undefined}
                    className="text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-all duration-150 ease-out hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-3.5 sm:mb-4 border-l-2 border-[#1D4ED8] pl-2.5">
              Resources
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[12.5px] sm:text-[13px] font-medium pl-2.5">
              {resourceLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    target={link.target} 
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} 
                    className="text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-all duration-150 ease-out hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Apply For */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-3.5 sm:mb-4 border-l-2 border-[#1D4ED8] pl-2.5">
              Apply For
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[12.5px] sm:text-[13px] font-medium pl-2.5">
              {programLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-all duration-150 ease-out hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Foundation */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-3.5 sm:mb-4 border-l-2 border-[#1D4ED8] pl-2.5">
              Foundation
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 text-[12.5px] sm:text-[13px] font-medium pl-2.5">
              {foundationLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    target={link.target}
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 transition-all duration-150 ease-out hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Get in Touch */}
          <div className="flex flex-col items-start w-full col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-[11.5px] sm:text-[12px] font-bold text-[#0B1F4B] dark:text-white uppercase tracking-[0.07em] mb-3.5 sm:mb-4 border-l-2 border-[#1D4ED8] pl-2.5">
              Get in Touch
            </h3>
            <div className="space-y-3 text-[12.5px] sm:text-[13px] pl-2.5 text-left w-full">
              <div className="space-y-0.5">
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal">Have questions?</p>
                <p className="text-[#0B1F4B] dark:text-white font-bold tracking-tight">Talk to our team</p>
              </div>

              <div className="space-y-2 pt-0.5">
                <a 
                  href="tel:8860040010" 
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 font-semibold transition-all duration-150 ease-out hover:translate-x-0.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>8860040010</span>
                </a>
                <a 
                  href="mailto:info@idleducation.in" 
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 font-semibold transition-all duration-150 ease-out hover:translate-x-0.5 break-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>info@idleducation.in</span>
                </a>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-bold text-[#1D4ED8] hover:text-[#0B1F4B] dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-white/80 dark:bg-card/60 backdrop-blur-xs border-t border-slate-200/70 dark:border-slate-800/80 py-3.5 sm:py-4">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4 text-[11.5px] sm:text-xs font-normal text-slate-500 dark:text-slate-400">
            <p className="text-center sm:text-left" suppressHydrationWarning>
              &copy; 2026 IDL Education. All Rights Reserved.
            </p>
            <nav className="flex items-center gap-6">
              <Link href="/terms" className="text-slate-500 hover:text-[#1D4ED8] dark:text-slate-400 dark:hover:text-blue-300 transition-colors duration-150">
                Terms
              </Link>
              <Link href="/privacy" className="text-slate-500 hover:text-[#1D4ED8] dark:text-slate-400 dark:hover:text-blue-300 transition-colors duration-150">
                Privacy
              </Link>
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
