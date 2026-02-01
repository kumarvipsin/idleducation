'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { HandHeart } from "lucide-react";

export function FoundationMotive() {
  return (
    <section className="w-full py-16 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-white dark:bg-card p-6 md:p-8 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-left relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Service to Humanity
              </h2>
              <p className="text-muted-foreground">
                At the heart of IDL Foundation is a simple yet profound motive: 'Service to Humanity'. We are driven by the belief that every act of kindness, no matter how small, contributes to a better world. Our goal is to provide education, healthcare, and opportunities to those in need, fostering a community built on compassion and empowerment.
              </p>
              <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link href="/volunteer">
                  <HandHeart className="mr-2 h-4 w-4" />
                  Join Our Cause
                </Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-80 flex items-center justify-center">
                <Image
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Hands holding a heart"
                    data-ai-hint="charity giving"
                    fill
                    className="object-cover rounded-md shadow-lg"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
