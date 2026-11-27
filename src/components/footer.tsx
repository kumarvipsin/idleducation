'use client';
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ContactModal } from "./contact-modal";
import { SocialLinks } from "./social-links";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/gallery", label: "Gallery" },
];

const resourceLinks = [
  { href: "/resources/notes", label: "Notes" },
  { href: "/resources/ncert-solutions", label: "NCERT Solutions" },
  { href: "/resources/previous-year-questions", label: "Previous YQP" },
];

const programLinks = [
  { href: "/admission", label: "Admission Form" },
  { href: "/book-demo", label: "Book Free Demo" },
  { href: "/student-enquiry", label: "Student Enquiry" },
];

const foundationLinks = [
  { href: "/idl-foundation", label: "IDL Foundation", target: "_blank" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/workshop", label: "Workshops" },
];

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const paymentTileClass =
    "inline-flex items-center justify-center h-[34px] sm:h-[38px] xl:h-[42px] w-[104px] min-[390px]:w-[110px] sm:w-[100px] xl:w-[116px] px-2 sm:px-2 xl:px-2.5 rounded-[5px] sm:rounded-[6px] border border-[#173568]/15 dark:border-white/14 bg-transparent text-[#1E3A6D]/60 dark:text-slate-300/65 select-none pointer-events-none cursor-default shrink-0";

  return (
    <footer className="relative border-t border-[#DCE6F5]/80 dark:border-white/[0.07] bg-gradient-to-b from-[#FBFDFF] via-[#F4F8FE] to-[#EAF2FC] dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-900 text-slate-600 dark:text-slate-400 overflow-hidden antialiased">
      {/* Subtle Ambient Soft Glows */}
      <div className="absolute -top-28 right-[8%] w-[520px] h-[300px] bg-blue-100/35 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-[6%] w-[440px] h-[260px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full md:container mx-auto px-3 sm:px-4 md:px-6 pt-6 sm:pt-7 md:pt-8 pb-4 sm:pb-5">
        
        {/* Responsive Grid:
            Mobile: 2-column layout with top brand, 2x2 link grid, full-width contact
            Desktop: Proportionate 6-column layout with balanced visual rhythm */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.35fr_0.78fr_0.82fr_0.85fr_0.82fr_1.05fr] gap-x-5 sm:gap-x-7 lg:gap-x-6 xl:gap-x-8 gap-y-4 sm:gap-y-5 lg:gap-y-0 items-start">

          {/* Group 1: Brand & Socials (Full width on mobile, Col 1 on desktop) */}
          <div className="flex flex-col items-start col-span-2 lg:col-span-1 pr-0 lg:pr-2">
            <Link href="/" className="inline-flex items-center mt-0 mb-1.5 sm:mb-2 transition-opacity duration-150 hover:opacity-90">
              <Image 
                src="/idllogo.png" 
                alt="IDL Education Logo" 
                width={180} 
                height={80} 
                className="h-[58px] sm:h-[62px] md:h-[66px] max-h-[58px] sm:max-h-[62px] md:max-h-[66px] w-auto object-contain object-left dark:brightness-0 dark:invert" 
                priority
              />
            </Link>

            <p className="text-[12.5px] sm:text-[13px] text-[#526682] dark:text-slate-400 font-normal leading-[1.62] tracking-[0.005em] text-left max-w-[320px] lg:max-w-[315px]">
              We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
            </p>

            {/* Social Media Icons right under IDL description */}
            <SocialLinks variant="footer" />
          </div>

          {/* Group 2: Quick Links (Col 1 on mobile Row 1, Col 2 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081A3D] dark:text-white uppercase tracking-[0.06em] mb-2 sm:mb-2.5 border-l-2 border-[#155EEF] dark:border-blue-400 pl-2.5 leading-none py-[2px]">
              Quick Links
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 pl-2.5" suppressHydrationWarning>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-[12.5px] sm:text-[13px] font-normal text-[#526682] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-white lg:hover:translate-x-[2px] transition-[color,transform] duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 3: Resources (Col 2 on mobile Row 1, Col 3 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081A3D] dark:text-white uppercase tracking-[0.06em] mb-2 sm:mb-2.5 border-l-2 border-[#155EEF] dark:border-blue-400 pl-2.5 leading-none py-[2px]">
              Resources
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 pl-2.5">
              {resourceLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[12.5px] sm:text-[13px] font-normal text-[#526682] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-white lg:hover:translate-x-[2px] transition-[color,transform] duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 4: Apply For (Col 1 on mobile Row 2, Col 4 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081A3D] dark:text-white uppercase tracking-[0.06em] mb-2 sm:mb-2.5 border-l-2 border-[#155EEF] dark:border-blue-400 pl-2.5 leading-none py-[2px]">
              Apply For
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 pl-2.5">
              {programLinks.map(link => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-[12.5px] sm:text-[13px] font-normal text-[#526682] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-white lg:hover:translate-x-[2px] transition-[color,transform] duration-150 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 5: Foundation (Col 2 on mobile Row 2, Col 5 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-1">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081A3D] dark:text-white uppercase tracking-[0.06em] mb-2 sm:mb-2.5 border-l-2 border-[#155EEF] dark:border-blue-400 pl-2.5 leading-none py-[2px]">
              Foundation
            </h3>
            <ul className="space-y-1 sm:space-y-1.5 pl-2.5">
              {foundationLinks.map(link => (
                <li key={link.href}>
                  <span className="text-[12.5px] sm:text-[13px] font-normal text-[#526682] dark:text-slate-400 py-0.5 inline-block cursor-default select-none">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Group 6: Get in Touch (Full width on mobile below grid, Col 6 on desktop) */}
          <div className="flex flex-col items-start w-full col-span-2 lg:col-span-1 pt-3.5 sm:pt-4 lg:pt-0 border-t border-[#DCE6F5]/80 dark:border-white/[0.06] lg:border-t-0">
            <h3 className="text-[11px] sm:text-[11.5px] font-bold text-[#081A3D] dark:text-white uppercase tracking-[0.06em] mb-2 sm:mb-2.5 border-l-2 border-[#155EEF] dark:border-blue-400 pl-2.5 leading-none py-[2px]">
              Get in Touch
            </h3>
            <div className="space-y-1 sm:space-y-1.5 pl-2.5 text-left w-full">
              <div className="flex flex-wrap lg:flex-col items-start gap-x-5 gap-y-1">
                <a 
                  href="tel:8860040010" 
                  className="group inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] text-[#526682] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-white font-normal tabular-nums transition-colors duration-150 py-0.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#627794] group-hover:text-[#155EEF] dark:text-slate-400 dark:group-hover:text-white transition-colors duration-150 shrink-0" />
                  <span>8860040010</span>
                </a>
                <a 
                  href="mailto:info@idleducation.in" 
                  className="group inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] text-[#526682] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-white font-normal transition-colors duration-150 py-0.5 whitespace-nowrap sm:whitespace-normal break-words"
                >
                  <Mail className="w-3.5 h-3.5 text-[#627794] group-hover:text-[#155EEF] dark:text-slate-400 dark:group-hover:text-white transition-colors duration-150 shrink-0" />
                  <span>info@idleducation.in</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Information & Non-Interactive Watermark Strip */}
        <div className="mt-5 sm:mt-6 lg:mt-6">
          <div className="text-left w-full">
            <h3 className="text-[12px] sm:text-[12.5px] font-bold text-[#081A3D] dark:text-white tracking-[0.01em] leading-snug">
              Payment
            </h3>
            <p className="mt-1 text-[12px] sm:text-[12.5px] text-[#526682] dark:text-slate-400 font-normal leading-[1.62]">
              IDL Education offers you multiple payment methods. Payment gateway partners use secure encryption technology to keep your transaction details confidential at all times. You may use Internet Banking, Wallet and QR Support to make your purchase.
            </p>
          </div>

          <div
            aria-label="Accepted payment methods"
            className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center gap-2 xl:gap-2.5 select-none"
          >
            {/* 1. Paytm */}
            <span className={paymentTileClass}>
              <span className="text-[14.5px] sm:text-[15.5px] xl:text-[17.5px] font-black tracking-[-0.04em] leading-none">
                pay<span className="font-bold opacity-85">tm</span>
              </span>
            </span>

            {/* 2. PhonePe */}
            <span className={`${paymentTileClass} gap-1.5`}>
              <svg viewBox="0 0 18 18" className="h-[15px] sm:h-[15.5px] xl:h-[18px] w-[15px] sm:w-[15.5px] xl:w-[18px] shrink-0" aria-hidden="true">
                <circle cx="9" cy="9" r="8.2" className="fill-current" />
                <text
                  x="9"
                  y="12.7"
                  textAnchor="middle"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontSize="10.5"
                  fontWeight="800"
                  className="fill-[#EEF4FC] dark:fill-[#0F172A]"
                >
                  पे
                </text>
              </svg>
              <span className="text-[12px] sm:text-[12px] xl:text-[13.5px] font-extrabold tracking-[-0.02em] leading-none whitespace-nowrap">
                PhonePe
              </span>
            </span>

            {/* 3. Google Pay */}
            <span className={`${paymentTileClass} gap-1 sm:gap-1.5`}>
              <svg viewBox="0 0 18 18" className="h-[13px] sm:h-[13px] xl:h-[14.5px] w-[13px] sm:w-[13px] xl:w-[14.5px] fill-current shrink-0" aria-hidden="true">
                <path d="M16.92 9.2c0-.6-.05-1.18-.15-1.74H9v3.29h4.45a3.8 3.8 0 0 1-1.65 2.5v2.07h2.67c1.56-1.44 2.45-3.56 2.45-6.12Z" />
                <path d="M9 17.25c2.23 0 4.1-.74 5.47-2l-2.67-2.07c-.74.5-1.69.79-2.8.79-2.15 0-3.98-1.45-4.63-3.4H1.61v2.13A8.25 8.25 0 0 0 9 17.25Z" />
                <path d="M4.37 10.57a4.96 4.96 0 0 1 0-3.14V5.3H1.61a8.26 8.26 0 0 0 0 7.4l2.76-2.13Z" />
                <path d="M9 4.03c1.21 0 2.3.42 3.16 1.24l2.37-2.37A8.05 8.05 0 0 0 9 .75 8.25 8.25 0 0 0 1.61 5.3l2.76 2.13C5.02 5.48 6.85 4.03 9 4.03Z" />
              </svg>
              <span className="text-[11.5px] sm:text-[11.5px] xl:text-[13px] font-bold tracking-[-0.02em] leading-none whitespace-nowrap">
                Google <span className="font-semibold opacity-90">Pay</span>
              </span>
            </span>

            {/* 4. BHIM UPI */}
            <span className={`${paymentTileClass} gap-0.5 sm:gap-1`}>
              <span className="text-[12.5px] sm:text-[12.5px] xl:text-[14.5px] font-black italic tracking-[0.02em] leading-none">
                BHIM
              </span>
              <svg viewBox="0 0 14 14" className="h-[11.5px] sm:h-[11.5px] xl:h-[13px] w-auto fill-current shrink-0" aria-hidden="true">
                <polygon points="1,1.5 6.8,7 1,12.5 3.3,12.5 9.1,7 3.3,1.5" opacity="0.65" />
                <polygon points="5.2,1.5 11,7 5.2,12.5 7.5,12.5 13.3,7 7.5,1.5" />
              </svg>
              <span className="text-[10px] sm:text-[10px] xl:text-[11.5px] font-extrabold italic tracking-[0.03em] leading-none opacity-85">
                UPI
              </span>
            </span>

            {/* 5. UPI */}
            <span className={`${paymentTileClass} flex-col`}>
              <span className="inline-flex items-center gap-0.5 leading-none">
                <span className="text-[14px] sm:text-[14.5px] xl:text-[17px] font-black italic tracking-[0.03em] leading-none">
                  UPI
                </span>
                <svg viewBox="0 0 14 14" className="h-[12px] sm:h-[12px] xl:h-[14px] w-auto fill-current shrink-0" aria-hidden="true">
                  <polygon points="1,1.5 6.8,7 1,12.5 3.3,12.5 9.1,7 3.3,1.5" opacity="0.6" />
                  <polygon points="5.2,1.5 11,7 5.2,12.5 7.5,12.5 13.3,7 7.5,1.5" />
                </svg>
              </span>
              <span className="text-[4.8px] sm:text-[4.8px] xl:text-[5.5px] font-bold uppercase tracking-[0.04em] leading-none mt-[2px] opacity-75 whitespace-nowrap">
                UNIFIED PAYMENTS INTERFACE
              </span>
            </span>

            {/* 6. Razorpay */}
            <span className={`${paymentTileClass} gap-1`}>
              <svg viewBox="0 0 16 16" className="h-[13.5px] sm:h-[13.5px] xl:h-[15.5px] w-auto fill-current shrink-0" aria-hidden="true">
                <polygon points="8.6,1.5 3.8,14.5 6.8,14.5 11.6,1.5" />
                <polygon points="2.2,9.4 7.6,6.1 6.3,9.7 1.3,12.2" opacity="0.7" />
              </svg>
              <span className="text-[12.5px] sm:text-[12.5px] xl:text-[14.5px] font-extrabold italic tracking-[-0.02em] leading-none whitespace-nowrap">
                Razorpay
              </span>
            </span>

            {/* 7. RuPay */}
            <span className={`${paymentTileClass} gap-0.5 sm:gap-1`}>
              <span className="text-[13.5px] sm:text-[14px] xl:text-[16px] font-black italic tracking-[-0.02em] leading-none">
                RuPay
              </span>
              <svg viewBox="0 0 14 14" className="h-[11.5px] sm:h-[12px] xl:h-[13.5px] w-auto fill-current shrink-0" aria-hidden="true">
                <polygon points="1,1.5 6.8,7 1,12.5 3.3,12.5 9.1,7 3.3,1.5" opacity="0.65" />
                <polygon points="5.2,1.5 11,7 5.2,12.5 7.5,12.5 13.3,7 7.5,1.5" />
              </svg>
            </span>

            {/* 8. Mastercard */}
            <span className={`${paymentTileClass} gap-1 sm:gap-1.5`}>
              <svg viewBox="0 0 26 16" className="h-[13px] sm:h-[13px] xl:h-[15px] w-auto fill-current shrink-0" aria-hidden="true">
                <circle cx="9.2" cy="8" r="6.8" opacity="0.88" />
                <circle cx="16.8" cy="8" r="6.8" opacity="0.52" />
              </svg>
              <span className="text-[10.5px] sm:text-[10.5px] xl:text-[12px] font-bold tracking-[-0.025em] leading-none whitespace-nowrap">
                mastercard
              </span>
            </span>

            {/* 9. EMI */}
            <span className={`${paymentTileClass} flex-col`}>
              <span className="inline-flex items-center gap-1 leading-none">
                <svg viewBox="0 0 16 14" className="h-[11.5px] sm:h-[11.5px] xl:h-[13px] w-auto fill-none stroke-current shrink-0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="1.5" width="14" height="11" rx="2" />
                  <line x1="1" y1="5.2" x2="15" y2="5.2" />
                  <line x1="4" y1="9" x2="7.5" y2="9" />
                </svg>
                <span className="text-[13px] sm:text-[13.5px] xl:text-[15.5px] font-black tracking-[0.04em] leading-none">
                  EMI
                </span>
              </span>
              <span className="text-[4.8px] sm:text-[4.8px] xl:text-[5.5px] font-bold uppercase tracking-[0.05em] leading-none mt-[2px] opacity-75 whitespace-nowrap">
                EASY INSTALLMENTS
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Divider & Bottom Copyright Bar */}
      <div className="border-t border-[#DCE6F5]/80 dark:border-white/[0.08] pt-3 pb-5 sm:py-3">
        <div className="w-full md:container mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center sm:text-left text-[11.5px] sm:text-[12px] font-normal text-[#5B6E88] dark:text-slate-400 gap-2">
            <p className="tracking-[0.005em] leading-snug" suppressHydrationWarning>
              &copy; 2026 IDL All Rights Reserved.
            </p>
            <nav aria-label="Legal Links" className="flex items-center justify-center gap-3 sm:gap-3.5 shrink-0 font-normal">
              <Link href="/terms" className="text-[#5B6E88] hover:text-[#155EEF] dark:text-slate-400 dark:hover:text-white transition-colors duration-150">
                Terms
              </Link>
              <span className="text-slate-300 dark:text-slate-600 select-none">·</span>
              <Link href="/privacy" className="text-[#5B6E88] hover:text-[#155EEF] dark:text-slate-400 dark:hover:text-white transition-colors duration-150">
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
