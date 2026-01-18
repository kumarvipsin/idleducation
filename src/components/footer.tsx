import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, Send, Youtube } from "lucide-react";
import Image from "next/image";
import { allPrograms } from "@/lib/courses";
import { Separator } from "./ui/separator";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "IDL Blog" },
  { href: "/idl-foundation", label: "IDL Foundation", target: "_blank" },
];

const resourceLinks = [
  { href: "/resources/notes", label: "Notes" },
  { href: "/resources/ncert-solutions", label: "NCERT Solutions" },
  { href: "/resources/previous-year-questions", label: "Previous YQP" },
  { href: "/resources/reference-books", label: "Reference Books" },
  { href: "/store", label: "IDL Store", target: "_blank" },
];

export function Footer() {
  const svgTexture = `<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><g fill='rgba(30,58,138,0.05)' font-family='Arial, sans-serif' font-size='50' font-weight='bold'><text x='25' y='60' transform='rotate(-20)'>π</text><text x='225' y='100' transform='rotate(15)'>Σ</text><text x='125' y='180'>∞</text><text x='275' y='310' transform='rotate(25)'>√</text><text x='40' y='300'>α</text><text x='310' y='200' transform='rotate(-10)'>∫</text><text x='100' y='50'>β</text><text x='190' y='270' transform='rotate(5)'>Δ</text></g></svg>`;
  const textureStyle = {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgTexture)}")`,
    backgroundSize: '500px 500px',
  };

  return (
    <footer className="bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-300" style={textureStyle}>
        
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {/* Column 1: Brand and Socials */}
                <div className="flex flex-col items-center text-center gap-4 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                    <Link href="/" className="flex flex-col items-center gap-2">
                        <Image src="/logo.png" alt="IDL Education Logo" width={80} height={80} />
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-extrabold text-primary">IDL EDUCATION</span>
                            <span className="text-[0.4rem] text-primary/80 tracking-wider -mt-1 font-extrabold">
                              (Institute of Distance Learning Pvt. Ltd.)
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      We understand that every student has unique needs and abilities, that’s why our curriculum is designed to adapt to your needs and help you grow!
                    </p>
                    <div className="flex items-center gap-2">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </Link>
                        <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                          <Twitter className="h-4 w-4" />
                        </Link>
                         <Link href="https://t.me/idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
                          <Send className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.youtube.com/@idleducation" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                          <Youtube className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        {quickLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Column 3: Resources */}
                <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Resources</h3>
                    <ul className="space-y-2 text-sm">
                        {resourceLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors">{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Contact Us */}
                 <div>
                    <h3 className="text-md font-semibold mb-4 text-foreground">Contact Us</h3>
                    <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground text-left">
                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 shrink-0"/><span>Office Address: E-18 Krishan Vihar, Kanjhawala road, Hariram Sweets, Delhi-110086</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0"/> <a href="tel:+917011117585" className="hover:text-primary">Calling:  +91 7011117585</a></div>
                        <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08.12 4.79.12h.01c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zM12.04 20.1c-1.55 0-3.04-.49-4.28-1.38l-.3-.18-3.18.84.85-3.1-.19-.31c-.98-1.56-1.5-3.39-1.5-5.28 0-4.51 3.67-8.18 8.18-8.18s8.18 3.67 8.18 8.18-3.67 8.18-8.18 8.18zm4.49-5.37c-.27-.13-1.59-.78-1.84-.87-.25-.09-.43-.13-.62.13-.19.27-.7.87-.86 1.04-.16.18-.32.19-.59.06-.27-.13-1.15-.42-2.18-1.34s-1.66-2.09-1.86-2.43c-.2-.35-.02-.54.12-.68.12-.13.27-.32.4-.43.14-.11.18-.18.27-.3.09-.12.05-.23-.02-.32-.07-.09-.62-1.49-.85-2.04-.23-.55-.46-.48-.62-.48-.15 0-.32-.02-.49-.02s-.43.06-.65.3c-.22.25-.85.83-.85 2.02s.87 2.35 1 2.51c.13.16.85 1.35 2.98 2.62.5.31.89.49 1.2.62.5.21.94.18 1.3.11.39-.07 1.15-.47 1.32-.92.16-.45.16-.83.11-.92-.05-.09-.18-.13-.45-.26z"/></svg><a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp: +91 8860040010</a></div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0"/> <a href="mailto:info@idleducation.in" className="hover:text-primary">Email: info@idleducation.in</a></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700">
            <div className="container mx-auto px-4 md:px-6 py-1">
                <div className="flex flex-col sm:flex-row justify-between items-center text-[0.6rem]">
                    <div className="flex items-center gap-2">
                        <Image 
                            src="https://icon2.cleanpng.com/20180920/zs/kisspng-iso-9-iso-9-1-international-organization-for-s-aidima-implantacin-iso-14-y-gestion-de-sist-5ba370134a6743.6791764215374377153048.jpg" 
                            alt="ISO Certified" 
                            width={30} 
                            height={30}
                            className="rounded-full"
                        />
                        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
                    </div>
                    <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
                        <Link href="#" className="text-muted-foreground hover:text-primary hover:underline underline-offset-4">
                        Terms of Service
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary hover:underline underline-offset-4">
                        Privacy
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    </footer>
  );
}
