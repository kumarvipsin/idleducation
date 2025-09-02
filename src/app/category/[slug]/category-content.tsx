
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Calendar, ChevronDown, MessageCircle, Tag, Target, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function CategoryContent({ data, slug, subCategories }: { data: any, slug: string, subCategories: string[] }) {
  
  return (
    <div>
      <section className="bg-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{data.name} Online Coaching, Complete Course for {data.name} Preparation</h1>
              <p className="text-base md:text-lg text-foreground/80">
                  {data.name} Online Coaching 2025 provides study material for the required sections. Students can solve mock tests and evaluate their performance in our {data.name} Online Coaching Class.
              </p>
          </div>
      </section>
      <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="border-b mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center space-x-8">
                  {subCategories.map((sub, index) => (
                      <button key={index} className={`whitespace-nowrap pb-2 border-b-2 font-medium ${index === 0 ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                          {sub}
                      </button>
                  ))}
              </div>
              <div className="flex items-center space-x-2">
                  {/* Placeholder for content */}
              </div>
          </div>
      </div>
      <div className="flex items-center overflow-x-auto space-x-4 mb-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      </div>
    </div>
  </div>
  );
}
