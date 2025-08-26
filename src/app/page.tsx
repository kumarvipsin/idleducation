
'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { PopularPrograms } from '@/components/landing/popular-programs';
import { OurFeatures } from '@/components/landing/our-features';
import { ExpertTeam } from '@/components/landing/expert-team';
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { ExamCategories } from '@/components/landing/exam-categories';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PopularPrograms />
      <OurFeatures />
      <ExamCategories />
      <ToppersTestimonials />
      <ExpertTeam />
      <StudentTestimonials />
    </div>
  );
}
