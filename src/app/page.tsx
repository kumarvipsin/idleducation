
'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { OurFeatures } from '@/components/landing/our-features';
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';

export default function Home() {
  return (
    <div className="flex flex-col bg-[#F0F8FF] dark:bg-background">
      <HeroSection />
      <OurFeatures />
      <ExamCategories />
      <AcademicExcellence />
      <StudyResources />
      <StudentTestimonials />
      <ToppersTestimonials />
    </div>
  );
}
