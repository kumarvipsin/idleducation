
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
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-lg"></div>
                <CardContent className="relative flex flex-col items-center pt-12 flex-1 p-4">
                    <div className="w-28 h-28 rounded-full bg-pink-100 border-4 border-white dark:border-card shadow-md flex items-center justify-center overflow-hidden mb-4">
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
                    <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">{designation}</p>
                    
                    <div className="flex-grow"></div>

                    <div className="mt-4 w-full">
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full rounded-full">
                                MORE <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                        <Link href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
                        <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
                    </div>
                    
                </CardContent>
            </Card>
            <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-50 to-blue-100 border-none rounded-2xl shadow-2xl text-foreground">
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
                          <p className="inline-block bg-primary/10 text-primary font-bold text-sm px-4 py-2 rounded-full">
                              {experience}
                          </p>
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
