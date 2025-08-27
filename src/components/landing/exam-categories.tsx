
'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Shield, Briefcase, Atom, Stethoscope, Users } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "NEET",
    slug: "neet",
    subcategories: ["Class 11", "Class 12", "Dropper"],
    icon: <Stethoscope className="w-10 h-10 text-red-500" />,
    bgColor: "bg-red-50",
    darkBgColor: "dark:bg-red-900/20",
  },
  {
    title: "IIT JEE",
    slug: "iit-jee",
    subcategories: ["Class 11", "Class 12", "Dropper"],
    icon: <Atom className="w-10 h-10 text-blue-500" />,
    bgColor: "bg-blue-50",
    darkBgColor: "dark:bg-blue-900/20",
  },
  {
    title: "School Preparation",
    slug: "school",
    subcategories: ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"],
    icon: <Book className="w-10 h-10 text-yellow-500" />,
    bgColor: "bg-yellow-50",
    darkBgColor: "dark:bg-yellow-900/20",
  },
  {
    title: "CUET",
    slug: "cuet",
    subcategories: [],
    icon: <Users className="w-10 h-10 text-purple-500" />,
    bgColor: "bg-purple-50",
    darkBgColor: "dark:bg-purple-900/20",
  },
  {
    title: "Govt Job Exams",
    slug: "govt-job-exams",
    subcategories: ["SSC", "Banking", "Teaching", "Judiciary"],
    icon: <Briefcase className="w-10 h-10 text-green-500" />,
    bgColor: "bg-green-50",
    darkBgColor: "dark:bg-green-900/20",
  },
  {
    title: "Defence",
    slug: "defence",
    subcategories: ["NDA", "CDS", "AFCAT", "Agniveer"],
    icon: <Shield className="w-10 h-10 text-indigo-500" />,
    bgColor: "bg-indigo-50",
    darkBgColor: "dark:bg-indigo-900/20",
  },
];

const MAX_SUBCATEGORIES_VISIBLE = 4;

export function ExamCategories() {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (title: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };
  
  return (
    <section className="w-full py-12 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            IDL EDUCATION is preparing students for 35+ exam categories. Scroll down to find the one you are preparing for.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const isExpanded = expandedCategories[category.title] || false;
            const hasMore = category.subcategories.length > MAX_SUBCATEGORIES_VISIBLE;
            const visibleSubcategories = isExpanded ? category.subcategories : category.subcategories.slice(0, MAX_SUBCATEGORIES_VISIBLE);
            const linkPath = category.slug === 'school' ? '/school' : `/category/${category.slug}`;

            return (
              <Card key={category.title} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group ${category.bgColor} ${category.darkBgColor}`}>
                <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${category.bgColor} ${category.darkBgColor} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
                <CardContent className="p-6 relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                    <div className="p-3 bg-background rounded-full shadow-md">
                      {category.icon}
                    </div>
                  </div>
                  {category.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                      {visibleSubcategories.map((sub) => (
                          <Button key={sub} variant="outline" size="sm" className="bg-background/50 text-foreground text-xs rounded-full">
                          {sub}
                          </Button>
                      ))}
                      {hasMore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary text-xs font-semibold hover:bg-primary/10 rounded-full"
                          onClick={() => toggleExpanded(category.title)}
                        >
                          {isExpanded ? "View Less" : "More +"}
                        </Button>
                      )}
                      </div>
                  )}
                  <div className="mt-auto">
                    <Link href={linkPath} className="flex items-center font-semibold text-primary hover:underline">
                      Explore Category <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
