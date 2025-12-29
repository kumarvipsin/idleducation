import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { OurFeatures } from '@/components/landing/our-features';
import { TopperTestimonialsClient } from '@/components/landing/topper-testimonials-client';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';
import { getTopperTestimonials } from '@/app/actions';
import type { TTopperTestimonial } from '@/app/actions/types';
import { HeroSection } from '@/components/landing/hero-section';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return (
    <div className="flex flex-col bg-white dark:bg-background">
      <HeroSection />
      <BuildSkillsSection />
      <OurFeatures />
      <ExamCategories />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <TopperTestimonialsClient testimonials={testimonials as any[]} />
    </div>
  );
}
