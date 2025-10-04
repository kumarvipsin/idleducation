'use client';
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { GcsImage } from "@/components/gcs-image";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

type TeacherCardProps = {
    name: string;
    designation: string;
    experience: string;
    biography?: string;
    avatar: string;
    avatarHint: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export function TeacherCard({ name, designation, experience, biography, avatar, avatarHint, socialLinks }: TeacherCardProps) {
     return (
        <Dialog>
            <DialogTrigger asChild>
                <Card 
                  className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-card rounded-lg h-full flex flex-col cursor-pointer"
                >
                    <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                        <GcsImage
                            filePath={avatar}
                            alt={name}
                            fill
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                         <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-base md:text-lg font-bold uppercase tracking-wider">{name}</h3>
                            <p className="text-xs md:text-sm text-white/90">{designation}</p>
                            <p className="text-xs text-white/80 mt-1">{experience}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-5 h-5 text-white"/>
                        </div>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white text-foreground">
                <div className="p-4 pt-8">
                  <div className="relative flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full border-4 border-white/80 shadow-lg flex items-center justify-center overflow-hidden -mt-24 mb-4 bg-primary">
                          <div className="relative w-full h-full">
                              <GcsImage
                                  filePath={avatar}
                                  alt={name}
                                  fill
                                  className="object-cover"
                              />
                          </div>
                      </div>
                      <DialogTitle className="text-2xl font-bold tracking-tight text-primary">{name}</DialogTitle>
                      <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">
                          {designation}
                      </DialogDescription>
                      
                       <div className="mt-4 w-full flex justify-center">
                           <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                {experience}
                            </div>
                      </div>

                       {biography && (
                        <p className="text-sm text-muted-foreground mt-4 text-center">
                          {biography}
                        </p>
                      )}
                      
                      {socialLinks && (Object.values(socialLinks).some(link => link)) && (
                          <div className="flex items-center justify-center gap-2 mt-4">
                              {socialLinks.instagram && (
                                  <Link href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                                      <Instagram className="h-4 w-4" />
                                  </Link>
                              )}
                              {socialLinks.facebook && (
                                  <Link href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                                      <Facebook className="h-4 w-4" />
                                  </Link>
                              )}
                              {socialLinks.twitter && (
                                  <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                                      <Twitter className="h-4 w-4" />
                                  </Link>
                              )}
                          </div>
                      )}
                  </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
