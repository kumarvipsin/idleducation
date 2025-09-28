
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
}

export function TeacherCard({ name, designation, experience, biography, avatar, avatarHint }: TeacherCardProps) {
     return (
        <Dialog>
            <Card 
              className="relative text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg h-full flex flex-col"
            >
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900/50 rounded-t-lg"></div>
                <CardContent className="relative flex flex-col items-center pt-12 flex-1 p-4">
                    <div className="w-28 h-28 rounded-full bg-background border-4 border-white dark:border-card shadow-md flex items-center justify-center overflow-hidden mb-4">
                        <div className="relative w-full h-full">
                             <GcsImage
                                filePath={avatar}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground">{name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{designation}</p>
                    
                    <div className="flex-grow"></div>

                     <div className="mt-4 text-center">
                        <DialogTrigger asChild>
                           <button className="text-xs font-semibold text-primary hover:underline underline-offset-4 group/link flex items-center">
                                MORE <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                           </button>
                        </DialogTrigger>
                    </div>

                    <div className="mt-4 flex justify-center">
                       <div className="flex items-center gap-3">
                            <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors active:bg-primary active:text-primary-foreground"><Facebook className="h-4 w-4" /></Link>
                            <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors active:bg-primary active:text-primary-foreground"><Instagram className="h-4 w-4" /></Link>
                            <Link href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors active:bg-primary active:text-primary-foreground"><Twitter className="h-4 w-4" /></Link>
                        </div>
                    </div>
                    
                </CardContent>
            </Card>
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
                  </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
