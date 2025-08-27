
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NeetIcon, IitJeeIcon, SchoolPrepIcon, UpscIcon, GovtJobIcon, DefenceIcon } from '@/components/landing/category-icons';

const categories = [
  {
    title: 'NEET',
    tags: ['class 11', 'class 12', 'Dropper'],
    Icon: NeetIcon,
    href: '/category/neet',
    bgColor: 'bg-red-50',
    accentColor: 'bg-red-100',
  },
  {
    title: 'IIT JEE',
    tags: ['class 11', 'class 12', 'Dropper'],
    Icon: IitJeeIcon,
    href: '/category/iit-jee',
    bgColor: 'bg-yellow-50',
    accentColor: 'bg-yellow-100',
  },
  {
    title: 'School Preparation',
    tags: ['class 6', 'class 7', 'class 8', 'More +'],
    Icon: SchoolPrepIcon,
    href: '/school',
    bgColor: 'bg-green-50',
    accentColor: 'bg-green-100',
  },
  {
    title: 'UPSC',
    tags: [],
    Icon: UpscIcon,
    href: '/category/govt-job-exams',
    bgColor: 'bg-indigo-50',
    accentColor: 'bg-indigo-100',
  },
  {
    title: 'Govt Job Exams',
    tags: ['SSC', 'Banking', 'Teaching', 'Judiciary'],
    Icon: GovtJobIcon,
    href: '/category/govt-job-exams',
    bgColor: 'bg-blue-50',
    accentColor: 'bg-blue-100',
  },
  {
    title: 'Defence',
    tags: ['NDA', 'CDS', 'AFCAT', 'Agniveer'],
    Icon: DefenceIcon,
    href: '/category/defence',
    bgColor: 'bg-gray-50',
    accentColor: 'bg-gray-100',
  },
];

export function ExamCategories() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Exam Categories</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            PW is preparing students for 35+ exam categories. Scroll down to find the one you are preparing for
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.title} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative ${category.bgColor}`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {category.tags.map((tag) => (
                        <Button key={tag} variant="outline" size="sm" className="rounded-full bg-white text-xs px-3 py-1 h-auto">
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 h-32 w-32 ${category.accentColor} rounded-bl-full flex items-center justify-center p-4`}>
                    <category.Icon className="w-16 h-16" />
                  </div>
                </div>
                 <Link href={category.href} className="font-semibold text-foreground/80 hover:text-primary inline-flex items-center group mt-4">
                  Explore Category
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
