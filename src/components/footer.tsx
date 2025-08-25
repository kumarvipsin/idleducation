import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-12 px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-8 w-8" />
                    <span className="text-2xl font-bold">IDL EDUCATION</span>
                </Link>
                <p className="text-sm text-primary-foreground/80">
                    Empowering students with quality education to achieve their dreams.
                </p>
                <div className="flex gap-4">
                    <Link href="#" className="hover:text-primary-foreground/80" aria-label="Facebook">
                    <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="hover:text-primary-foreground/80" aria-label="Twitter">
                    <Twitter className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="hover:text-primary-foreground/80" aria-label="Instagram">
                    <Instagram className="h-6 w-6" />
                    </Link>
                </div>
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-lg">Contact Us</h4>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                    <span>E-18 KRISHAN VIHAR, NEAR HARIRAM KANJHWALA ROAD, DELHI-110086</span>
                    </div>
                    <a href="tel:+917011117585" className="flex items-center gap-2 hover:underline">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span>+91 70 1111 7585</span>
                    </a>
                    <a href="mailto:query@idleducation.in" className="flex items-center gap-2 hover:underline">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>query@idleducation.in</span>
                    </a>
                </div>
            </div>
            <div className="space-y-4 md:col-span-2 lg:col-span-2">
                 <div className="aspect-video w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.225888126903!2d144.9537353153169!3d-37.81720997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1622222222222!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map of IDL Education Location"
                        className="rounded-lg"
                    ></iframe>
                </div>
            </div>
        </div>
      <div className="border-t border-primary-foreground/20 py-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
            <p className="text-primary-foreground/70">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
                <Link href="#" className="hover:underline underline-offset-4">
                Terms of Service
                </Link>
                <Link href="#" className="hover:underline underline-offset-4">
                Privacy
                </Link>
            </nav>
        </div>
      </div>
    </footer>
  );
}
