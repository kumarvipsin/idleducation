
'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { OurFeatures } from '@/components/landing/our-features';
import { ExpertTeam } from '@/components/landing/expert-team';
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';
import { TopCourses } from '@/components/landing/top-courses';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <TopCourses />
      <ExamCategories />
      <OurFeatures />
      <ExpertTeam />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <ToppersTestimonials />
    </div>
  );
}
