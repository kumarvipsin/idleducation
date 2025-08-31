
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, Send, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
                {/* Column 1: Brand Info */}
                <div>
                    <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <BookOpen className="h-8 w-8" />
                        <span className="text-2xl font-bold">IDL EDUCATION</span>
                    </Link>
                    <div className="bg-gray-900 p-4 rounded-md">
                      <p className="text-sm text-gray-400">
                          Empowering students with quality education to achieve their dreams.
                      </p>
                    </div>
                </div>

                {/* Column 2: Connect With Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                    <div className="bg-gray-900 p-4 rounded-md">
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href="mailto:info@idleducation.in" className="hover:underline">info@idleducation.in</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href="mailto:support@idleducation.in" className="hover:underline">support@idleducation.in</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a href="tel:+917011117585" className="hover:underline">+91 7011117585</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a href="tel:+918860040010" className="hover:underline">+91 8860040010</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Column 3: Our Branch */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Our Branch</h3>
                    <div className="bg-gray-900 p-4 rounded-md">
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Local Head Office : E-18 Krishan Vihar, Main Kanjhawala Road Delhi-110086</span>
                            </li>
                             <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Mukherjee Nagar, Delhi-110009</span>
                            </li>
                             <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Mangol Puri, Delhi-110083</span>
                            </li>
                             <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Budh Vihar, Delhi-110086</span>
                            </li>
                             <li className="flex items-start justify-center md:justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Krishan Vihar, Delhi-110086</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Column 4: Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.facebook.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </Link>
                        <Link href="https://x.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="Twitter">
                          <Twitter className="h-4 w-4" />
                        </Link>
                        <Link href="https://t.me/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="Telegram">
                          <Send className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.youtube.com/@idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="YouTube">
                          <Youtube className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-4 pt-2 flex flex-col sm:flex-row justify-between items-center text-xs">
                <p className="text-gray-500">&copy; {new Date().getFullYear()} IDL EDUCATION. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6 mt-2 sm:mt-0">
                    <Link href="#" className="text-gray-500 hover:text-white hover:underline underline-offset-4">
                    Terms of Service
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-white hover:underline underline-offset-4">
                    Privacy
                    </Link>
                </nav>
            </div>
        </div>
    </footer>
  );
}
