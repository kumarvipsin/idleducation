'use client';
import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ContactModal } from "./contact-modal";
import { SocialLinks } from "./social-links";

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
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 md:pt-16 pb-12 sm:pb-14 md:pb-16">
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

            <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 font-normal leading-[1.6] antialiased tracking-normal text-left max-w-[310px] sm:max-w-[330px]">
              We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
            </p>

            {/* Social Media Icons right under IDL description */}
            <SocialLinks variant="footer" />
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
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 font-semibold transition-all duration-150 ease-out hover:translate-x-0.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                  <span>8860040010</span>
                </a>
                <a 
                  href="mailto:info@idleducation.in" 
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 font-semibold transition-all duration-150 ease-out hover:translate-x-0.5 whitespace-nowrap sm:whitespace-normal break-words"
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
      <div className="bg-white/80 dark:bg-card/60 backdrop-blur-xs border-t border-slate-200/70 dark:border-slate-800/80 py-2 sm:py-2.5">
        <div className="max-w-[1240px] mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-row flex-nowrap justify-center sm:justify-between items-center gap-x-2 sm:gap-x-4 text-[9.5px] min-[360px]:text-[10.5px] sm:text-xs font-normal text-slate-500 dark:text-slate-400 leading-tight whitespace-nowrap overflow-x-auto scrollbar-none">
            <p className="shrink-0" suppressHydrationWarning>
              &copy; 2026 IDL Education. All Rights Reserved.
            </p>
            <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link href="/terms" className="text-slate-500 hover:text-[#1D4ED8] dark:text-slate-400 dark:hover:text-blue-300 transition-colors duration-150">
                Terms
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
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
