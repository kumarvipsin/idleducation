'use client';

import { OurFeatures } from '@/components/landing/our-features';
import { TopperTestimonialsClient } from '@/components/landing/topper-testimonials-client';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';
import type { TTopperTestimonial } from '@/app/actions/types';
import { HeroSection } from './hero-section';

export function HomePageClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  return (
    <div className="flex flex-col bg-white dark:bg-background">
      <HeroSection />
      <OurFeatures />
      <ExamCategories />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <TopperTestimonialsClient testimonials={testimonials} />
    </div>
  );
}
