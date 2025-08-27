
'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { PopularPrograms } from '@/components/landing/popular-programs';
import { OurFeatures } from '@/components/landing/our-features';
import { ExpertTeam } from '@/components/landing/expert-team';
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <PopularPrograms />
      <OurFeatures />
      <ToppersTestimonials />
      <ExpertTeam />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
    </div>
  );
}
