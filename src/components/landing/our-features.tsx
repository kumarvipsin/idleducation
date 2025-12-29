'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "Expert Faculty",
    description: "Learn from highly skilled, experienced mentors.",
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: "Practical Learning",
    description: "Apply concepts through real, hands-on practice.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Flexible Batches",
    description: "Choose timings that suit your schedule.",
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-primary" />,
    title: "Affordable Fees",
    description: "Quality learning at genuinely fair pricing.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Quick Support",
    description: "Get immediate help whenever you need.",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Trusted Institute",
    description: "Known for consistent results and reliability.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-20 bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8')"}}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Our Features
          </h2>
          <p className="text-white/80 mt-2 max-w-2xl mx-auto">
            Discover the advantages that make our platform the best choice for your learning journey.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto bg-background/90 rounded-2xl shadow-2xl">
          <CardContent className="p-6 md:p-8">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-4 rounded-lg hover:bg-muted transition-colors">
                     <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="text-md font-bold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/about">View More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}
