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
    <footer className="relative bg-gradient-to-b from-[#FAFCFF] via-[#F6F9FE] to-[#EEF5FC] dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-800/60 text-slate-600 dark:text-slate-400 overflow-hidden">
      {/* Ambient soft glow towards top-right and bottom-left matching GetAppSection */}
      <div className="absolute -top-24 right-[10%] w-[500px] h-[300px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-[5%] w-[400px] h-[250px] bg-blue-50/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-7 sm:pb-9 lg:pb-11">
        
        {/* Responsive Grid:
            Mobile: 2-column layout with top brand, 2x2 link grid, full-width contact
            Desktop: Proportionate 6-column layout with equalized link columns */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_0.75fr_0.75fr_0.75fr_0.75fr_1fr] gap-x-6 sm:gap-x-8 lg:gap-x-6 xl:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-0 items-start">

          {/* Group 1: Brand & Socials (Full width on mobile, Col 1 on desktop) */}
          <div className="flex flex-col items-start col-span-2 lg:col-span-1 pr-0 lg:pr-3">
            <Link href="/" className="inline-block -mt-1 mb-1.5 transition-opacity duration-150 hover:opacity-90">
              <Image 
                src="/idllogo.png" 
                alt="IDL Education Logo" 
                width={95} 
                height={95} 
                className="h-[52px] sm:h-[62px] lg:h-[72px] w-auto object-contain object-left dark:brightness-0 dark:invert" 
                priority
              />
            </Link>

            <p className="text-[12px] sm:text-[12.5px] text-slate-600 dark:text-slate-400 font-normal leading-[1.6] antialiased tracking-normal text-left max-w-[320px]">
              We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
            </p>

            {/* Social Media Icons right under IDL description */}
            <SocialLinks variant="footer" />
          </div>

          {/* Group 2: Quick Links (Col 1 on mobile Row 1, Col 2 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081B4B] dark:text-white uppercase tracking-[0.08em] mb-2 sm:mb-2.5 border-l-[2px] border-[#0A5CFF] pl-2 leading-none py-0.5">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-[12px] sm:text-[12.5px] font-medium pl-2" suppressHydrationWarning>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    onClick={link.label === "Contact Us" ? (e) => {
                      e.preventDefault();
                      setIsContactOpen(true);
                    } : undefined}
                    className="text-slate-600 dark:text-slate-400 hover:text-[#0A5CFF] dark:hover:text-white transition-colors duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 3: Resources (Col 2 on mobile Row 1, Col 3 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081B4B] dark:text-white uppercase tracking-[0.08em] mb-2 sm:mb-2.5 border-l-[2px] border-[#0A5CFF] pl-2 leading-none py-0.5">
              Resources
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-[12px] sm:text-[12.5px] font-medium pl-2">
              {resourceLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    target={link.target} 
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} 
                    className="text-slate-600 dark:text-slate-400 hover:text-[#0A5CFF] dark:hover:text-white transition-colors duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 4: Apply For (Col 1 on mobile Row 2, Col 4 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081B4B] dark:text-white uppercase tracking-[0.08em] mb-2 sm:mb-2.5 border-l-[2px] border-[#0A5CFF] pl-2 leading-none py-0.5">
              Apply For
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-[12px] sm:text-[12.5px] font-medium pl-2">
              {programLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 dark:text-slate-400 hover:text-[#0A5CFF] dark:hover:text-white transition-colors duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 5: Foundation (Col 2 on mobile Row 2, Col 5 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081B4B] dark:text-white uppercase tracking-[0.08em] mb-2 sm:mb-2.5 border-l-[2px] border-[#0A5CFF] pl-2 leading-none py-0.5">
              Foundation
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-[12px] sm:text-[12.5px] font-medium pl-2">
              {foundationLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    target={link.target} 
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} 
                    className="text-slate-600 dark:text-slate-400 hover:text-[#0A5CFF] dark:hover:text-white transition-colors duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 6: Get in Touch (Full width on mobile below grid, Col 6 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-2 lg:col-span-1 pt-3.5 sm:pt-4 lg:pt-0 border-t border-slate-200/80 dark:border-white/[0.06] lg:border-t-0">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081B4B] dark:text-white uppercase tracking-[0.08em] mb-2 sm:mb-2.5 border-l-[2px] border-[#0A5CFF] pl-2 leading-none py-0.5">
              Get in Touch
            </h3>
            <div className="space-y-2.5 text-[12px] sm:text-[12.5px] pl-2 text-left w-full">
              <div className="space-y-0.5">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Have questions?</p>
                <p className="text-[#081B4B] dark:text-white font-semibold tracking-tight text-[12.5px] sm:text-[13px]">Talk to our team</p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-1.5 sm:gap-4 lg:gap-1.5 pt-0.5">
                <a 
                  href="tel:8860040010" 
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-[#0A5CFF] font-medium transition-colors duration-150 py-0.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0A5CFF] shrink-0" />
                  <span>8860040010</span>
                </a>
                <a 
                  href="mailto:info@idleducation.in" 
                  className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-[#0A5CFF] font-medium transition-colors duration-150 py-0.5 whitespace-nowrap sm:whitespace-normal break-words"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0A5CFF] shrink-0" />
                  <span>info@idleducation.in</span>
                </a>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold text-[#0A5CFF] hover:text-[#0845c4] dark:text-[#60A5FA] dark:hover:text-white transition-colors cursor-pointer group py-0.5"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Divider & Bottom Copyright Bar */}
      <div className="border-t border-[#E2ECF8] dark:border-white/[0.08] py-2.5 sm:py-3">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-center text-[12px] sm:text-[12.5px] font-normal text-slate-500 dark:text-slate-400">
            <p suppressHydrationWarning>
              &copy; 2026 IDL All Rights Reserved.
            </p>
            <nav aria-label="Legal Links" className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 pr-14 sm:pr-0">
              <Link href="/terms" className="text-slate-500 hover:text-[#0A5CFF] dark:text-slate-400 dark:hover:text-white transition-colors duration-150">
                Terms
              </Link>
              <span className="text-slate-300 dark:text-slate-600 select-none">·</span>
              <Link href="/privacy" className="text-slate-500 hover:text-[#0A5CFF] dark:text-slate-400 dark:hover:text-white transition-colors duration-150">
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
