
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-gray-200">
        <div className="container mx-auto py-12 px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2">
                    <BookOpen className="h-8 w-8 text-white" />
                    <span className="text-2xl font-bold text-white">IDL EDUCATION</span>
                </Link>
                <p className="text-sm text-gray-400">
                    Empowering students with quality education to achieve their dreams.
                </p>
                <div className="flex gap-4">
                    <Link href="https://www.instagram.com/idleducation" className="p-2 border border-gray-600 rounded-full hover:bg-gray-700" aria-label="Instagram">
                      <Instagram className="h-6 w-6" />
                    </Link>
                    <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 border border-gray-600 rounded-full hover:bg-gray-700" aria-label="Facebook">
                      <Facebook className="h-6 w-6" />
                    </Link>
                    <Link href="#" className="p-2 border border-gray-600 rounded-full hover:bg-gray-700" aria-label="Twitter">
                      <Twitter className="h-6 w-6" />
                    </Link>
                </div>
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-lg text-white">Contact Us</h4>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                    <span className="font-bold">Y-25A Budh Vihar, Phase-1, Delhi-110086</span>
                    </div>
                    <a href="tel:+917011117585" className="flex items-center gap-2 hover:underline">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span className="font-bold">+91 70 1111 7585</span>
                    </a>
                    <a href="tel:+918860040010" className="flex items-center gap-2 hover:underline">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span className="font-bold">+91 8860040010</span>
                    </a>
                    <a href="mailto:info@idleducation.in" className="flex items-center gap-2 hover:underline">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span className="font-bold">info@idleducation.in</span>
                    </a>
                </div>
            </div>
            <div className="space-y-4 md:col-span-2 lg:col-span-2">
                 <div className="aspect-video w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.893114539209!2d77.0596338753898!3d28.7525385756012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d014df076d16f%3A0x7334be2b321a32f!2sKrishan%20Vihar!5e0!3m2!1sen!2sin!4v1717586282035!5m2!1sen!2sin"
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
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
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
