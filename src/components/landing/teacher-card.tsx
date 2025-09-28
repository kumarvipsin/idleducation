
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
              className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg h-full flex flex-col"
            >
                <div className="relative w-full aspect-[4/5] md:aspect-[3/4]">
                    <GcsImage
                        filePath={avatar}
                        alt={name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="text-base md:text-lg font-bold uppercase tracking-wider text-foreground">{name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{designation}</p>
                    <div className="mt-4 text-center flex-grow flex items-end justify-center">
                        <DialogTrigger asChild>
                           <button className="text-xs font-semibold text-primary hover:underline underline-offset-4 group/link flex items-center justify-center mx-auto">
                                MORE <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                           </button>
                        </DialogTrigger>
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
