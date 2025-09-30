
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit } from 'lucide-react';
import Link from 'next/link';
import { getExamCategories } from '@/app/actions/data';
import type { TExamCategory } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

const resourceLinks = [
  { href: '/resources/previous-year-questions', label: 'Previous Year Question Paper', icon: <FileText /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
];

function ExamcatPageContent() {
  const [categories, setCategories] = useState<TExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<TExamCategory | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoriesResult = await getExamCategories();
      if (categoriesResult.success && categoriesResult.data) {
        const competitiveExams = (categoriesResult.data as TExamCategory[])
          .filter(cat => cat.group === 'competitive')
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        setCategories(competitiveExams);
        
        if (competitiveExams.length > 0) {
          const categoryFromUrl = competitiveExams.find(c => c.name === categoryParam);
          if (categoryFromUrl) {
            setActiveCategory(categoryFromUrl);
          } else {
            // Fallback to NEET or the first category if the param is invalid or not present
            const defaultCat = competitiveExams.find(c => c.name === 'NEET') || competitiveExams[0];
            setActiveCategory(defaultCat);
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [categoryParam]); // Re-run when the URL parameter changes

  const handleCategoryClick = (category: TExamCategory) => {
    setActiveCategory(category);
    router.push(`/examcat?category=${encodeURIComponent(category.name)}`, { scroll: false });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)}
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        {renderSkeleton()}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="mb-8">
        <Card className="overflow-hidden shadow-lg">
          <div className="relative w-full aspect-[16/4]">
             {activeCategory?.imageUrl ? (
                <GcsImage
                    filePath={activeCategory.imageUrl}
                    alt={`Banner for ${activeCategory.name}`}
                    fill
                    className="object-cover"
                />
            ) : (
                <Image
                    src="https://picsum.photos/seed/exam-banner/1920/480"
                    alt="Competitive Exams Banner"
                    data-ai-hint="students studying"
                    fill
                    className="object-cover"
                />
            )}
          </div>
        </Card>
      </section>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/examcat?category=${encodeURIComponent(c.name)}`}
                onClick={(e) => { e.preventDefault(); handleCategoryClick(c); }}
                className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                  ${activeCategory?.id === c.id 
                    ? 'border-primary text-primary bg-primary/10 rounded-full' 
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {activeCategory && (
        <section className="w-full pb-12 md:pb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="container mx-auto px-4 md:px-[10%]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                {`${activeCategory.name} Online Coaching 2025-2026`}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Everything you need to know about the curriculum, exams, and resources.
              </p>
            </div>
            <Card className="shadow-lg">
                <CardContent className="p-6 space-y-8">
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Syllabus & Study Strategy</h3>
                        <p className="text-muted-foreground">Detailed syllabus and study strategies for {activeCategory.name} will be updated here soon. Our curriculum is designed to cover all topics comprehensively, ensuring you are well-prepared for your exams. We focus on building a strong conceptual foundation and provide ample practice through assignments and tests.</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-bold text-xl mb-2 text-primary border-b pb-2">Exam Pattern & Key Dates</h3>
                        <p className="text-muted-foreground">Information about the exam pattern, marking scheme, and important dates for {activeCategory.name} will be made available here. Stay tuned for updates on registration deadlines, admit card availability, and exam schedules.</p>
                    </div>
                </CardContent>
            </Card>
            </div>
        </section>
      )}

      <section className="w-full py-12 md:py-24 bg-muted/30 rounded-lg animate-fade-in-up mt-16" style={{ animationDelay: '0.4s' }}>
          <div className="container mx-auto px-4 md:px-[10%]">
             <div className="text-center">
                <h3 className="font-bold text-2xl mb-6 text-primary border-b-2 border-primary/20 pb-2 inline-block">Essential Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resourceLinks.map(link => (
                        <Button asChild variant="outline" key={link.href} className="justify-start bg-background h-12 text-base">
                            <Link href={link.href}>
                                {link.icon}
                                <span className="ml-2">{link.label}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
          </div>
      </section>
    </div>
  );
}

export default function ExamcatPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Skeleton className="h-96 w-full max-w-4xl" /></div>}>
            <ExamcatPageContent />
        </Suspense>
    )
}
