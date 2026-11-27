'use client';
import Link from "next/link";
import { Phone, Mail, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { ContactModal } from "./contact-modal";
import { SocialLinks } from "./social-links";

interface FooterLinkItem {
  label: string;
  href?: string;
}

interface FooterColumn {
  title: string;
  items: FooterLinkItem[];
}

const footerColumns: FooterColumn[] = [
  {
    title: "About IDL",
    items: [
      { label: "Why IDL" },
      { label: "About Us", href: "/about" },
      { label: "About Amod Sir" },
      { label: "Academics Team" },
    ],
  },
  {
    title: "About Exam",
    items: [
      { label: "NEET" },
      { label: "JEE Main" },
      { label: "JEE Advance" },
      { label: "JEE Main+Advance" },
    ],
  },
  {
    title: "Student Desk",
    items: [
      { label: "Pay Fee", href: "/pay-fee" },
      { label: "Student Enquiry", href: "/student-enquiry" },
      { label: "Book Free Demo", href: "/book-demo" },
      { label: "Admission Form", href: "/admission" },
    ],
  },
  {
    title: "Useful Links",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Notes", href: "/resources/notes" },
      { label: "NCERT Solutions", href: "/resources/ncert-solutions" },
      { label: "Previous YQP", href: "/resources/previous-year-questions" },
    ],
  },
];

const legalItems: FooterLinkItem[] = [
  { label: "Privacy Policy" },
  { label: "Refund Rules" },
  { label: "Terms & Conditions" },
];

/** Renders a footer item with double-chevron marker; clickable only when an active href is configured. */
function FooterChevronItem({
  item,
  variant = "column",
}: {
  item: FooterLinkItem;
  variant?: "column" | "legal";
}) {
  const isLegal = variant === "legal";
  const spacingClass = isLegal
    ? "gap-1 sm:gap-1.5 text-[11px] min-[360px]:text-[11.5px] sm:text-[12.5px]"
    : "gap-1.5 text-[12px] min-[360px]:text-[13px] sm:text-[13.5px] py-0.5";
  const iconSizeClass = isLegal ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5";
  const baseClass = `inline-flex items-center font-normal text-[#C5D5EE] whitespace-nowrap ${spacingClass}`;

  const content = (
    <>
      <ChevronsRight
        className={`${iconSizeClass} text-[#6B95DC] stroke-[2.1] shrink-0 ${
          item.href
            ? "group-hover:text-[#93C5FD] transition-transform duration-150 lg:group-hover:translate-x-[2px]"
            : ""
        }`}
        aria-hidden="true"
      />
      <span>{item.label}</span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`group ${baseClass} hover:text-white transition-colors duration-150`}
      >
        {content}
      </Link>
    );
  }

  return <span className={`${baseClass} cursor-default select-none`}>{content}</span>;
}

export function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="relative border-t border-[#1A3365]/80 dark:border-white/[0.08] bg-gradient-to-b from-[#081A3F] via-[#071636] to-[#040E24] dark:from-[#040917] dark:via-[#060E24] dark:to-[#030712] text-[#C5D5EE] overflow-hidden antialiased">
      {/* Crisp Hairline Luminous Top Seam */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA]/35 to-transparent"
        aria-hidden="true"
      />
      {/* Subtle Ambient Sapphire Depth Glows */}
      <div className="pointer-events-none absolute -top-28 right-[8%] w-[520px] h-[300px] bg-[#2563EB]/[0.12] rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[6%] w-[440px] h-[260px] bg-[#1D4ED8]/[0.09] rounded-full blur-3xl" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full md:container mx-auto px-3.5 min-[360px]:px-4 sm:px-5 md:px-6 py-5 sm:py-7 lg:py-9">
        
        {/* Responsive Grid:
            Mobile: Compact 2x2 link columns (About IDL | About Exam, Student Desk | Useful Links) + Get in Touch & Follow IDL below
            Desktop: Balanced 5-column layout (About IDL, About Exam, Student Desk, Useful Links, Get in Touch + Follow IDL) */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.04fr_1.12fr_1.04fr_1.02fr_1.16fr] gap-x-3.5 min-[360px]:gap-x-5 sm:gap-x-7 lg:gap-x-6 xl:gap-x-8 gap-y-4 sm:gap-y-5 lg:gap-y-0 items-start">

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col items-start w-full col-span-1">
              <h3 className="text-[14px] min-[360px]:text-[14.5px] sm:text-[15px] font-extrabold text-white tracking-[-0.01em] leading-snug mb-1.5 sm:mb-2.5">
                {column.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2" suppressHydrationWarning>
                {column.items.map((item) => (
                  <li key={item.label}>
                    <FooterChevronItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Rightmost Column: Get in Touch + Follow IDL below email */}
          <div className="flex flex-col items-start w-full col-span-2 lg:col-span-1 pt-3.5 lg:pt-0 border-t border-white/[0.09] lg:border-t-0">
            <h3 className="text-[14px] min-[360px]:text-[14.5px] sm:text-[15px] font-extrabold text-white tracking-[-0.01em] leading-snug mb-1.5 sm:mb-2.5">
              Get in Touch
            </h3>
            <div className="space-y-1 sm:space-y-2 text-left w-full">
              <div className="flex flex-wrap lg:flex-col items-start gap-x-5 gap-y-1">
                <a 
                  href="tel:8860040010" 
                  className="group inline-flex items-center gap-2 text-[12px] min-[360px]:text-[13px] sm:text-[13.5px] text-[#C5D5EE] hover:text-white font-normal tabular-nums transition-colors duration-150 py-0.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#6B95DC] group-hover:text-[#93C5FD] transition-colors duration-150 shrink-0" />
                  <span>8860040010</span>
                </a>
                <a 
                  href="mailto:info@idleducation.in" 
                  className="group inline-flex items-center gap-2 text-[12px] min-[360px]:text-[13px] sm:text-[13.5px] text-[#C5D5EE] hover:text-white font-normal transition-colors duration-150 py-0.5 whitespace-nowrap sm:whitespace-normal break-words"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6B95DC] group-hover:text-[#93C5FD] transition-colors duration-150 shrink-0" />
                  <span>info@idleducation.in</span>
                </a>
              </div>
            </div>

            <div data-footer-social-slot className="w-full">
              <SocialLinks variant="footer" className="mt-3 sm:mt-4.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Bottom Grounding Band: Copyright Left + Legal Strip Right */}
      <div className="relative z-10 bg-[#030A1B]/55 border-t border-white/[0.08] pt-3 pb-4 sm:py-3.5">
        <div className="w-full md:container mx-auto px-3.5 min-[360px]:px-4 sm:px-5 md:px-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center sm:text-left text-[11.5px] sm:text-[12px] font-normal text-[#96ACD0] gap-2 sm:gap-4">
            <p className="tracking-[0.005em] leading-snug shrink-0" suppressHydrationWarning>
              &copy; 2026 IDL All Rights Reserved.
            </p>
            <nav
              aria-label="Legal Links"
              className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2.5 min-[360px]:gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-1 font-normal"
            >
              {legalItems.map((item) => (
                <FooterChevronItem key={item.label} item={item} variant="legal" />
              ))}
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
