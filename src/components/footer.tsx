
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, MapPin, Phone, Mail, Linkedin, Send, Youtube } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black text-white">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {/* Column 1: Our Branch */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Our Branch</h3>
                    <div className="bg-gray-900 p-4 rounded-md">
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Local Head Office : E-18 Krishan Vihar, Main Kanjhawala Road Delhi-110086</span>
                            </li>
                            <Separator className="my-3 bg-gray-700"/>
                             <li className="flex items-start justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Mukherjee Nagar, Delhi-110009</span>
                            </li>
                             <li className="flex items-start justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Mangol Puri, Delhi-110083</span>
                            </li>
                             <li className="flex items-start justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Budh Vihar, Delhi-110086</span>
                            </li>
                             <li className="flex items-start justify-start gap-3">
                                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                                <span>Burari, Delhi-110084</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Column 2: Connect With Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                    <div className="bg-gray-900 p-4 rounded-md">
                        <ul className="space-y-3 text-sm text-gray-400">
                             <li className="flex items-center justify-start gap-3">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a href="tel:01145035713" className="hover:underline">011 45035713</a>
                            </li>
                            <li className="flex items-center justify-start gap-3">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a href="tel:+918860040010" className="hover:underline">+91 8860040010</a>
                            </li>
                            <li className="flex items-center justify-start gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href="mailto:info@idleducation.in" className="hover:underline">info@idleducation.in</a>
                            </li>
                            <li className="flex items-center justify-start gap-3">
                                <Mail className="h-4 w-4 shrink-0" />
                                <a href="mailto:support@idleducation.in" className="hover:underline">support@idleducation.in</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Column 3: Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                    <div className="flex items-center justify-start gap-4">
                        <Link href="https://www.instagram.com/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="https://www.linkedin.com/company/idleducation" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
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
                    <div className="mt-6">
                        <h4 className="text-md font-semibold mb-2">IDL Learning App - Learn Smart</h4>
                        <div className="flex items-center gap-2">
                            <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                                    alt="Get it on Google Play"
                                    width={135}
                                    height={40}
                                    className="h-auto filter grayscale"
                                />
                            </Link>
                            <Link href="https://apps.apple.com/us/app/example" target="_blank" rel="noopener noreferrer">
                                <Image 
                                    src="https://www.pw.live/_next/static/media/apple-store-badge.acb101ce.webp"
                                    alt="Download on the App Store"
                                    width={120}
                                    height={40}
                                    className="h-auto filter grayscale"
                                />
                            </Link>
                        </div>
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
