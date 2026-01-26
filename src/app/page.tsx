
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { getTopperTestimonials, getCollection, getTestimonials } from '@/app/actions';
import type { TTopperTestimonial, THeroSlide, TTestimonial } from '@/app/actions/types';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { TrustedPlatform } from '@/components/landing/trusted-platform';
import { DiscoverAdvantage } from '@/components/landing/discover-advantage';
import { GetAppSection } from '@/components/landing/get-app-section';
import { ScholarshipSection } from '@/components/landing/scholarship-section';
import { BlogSection } from '@/components/landing/blog-section';
import { SelectGoalSection } from '@/components/landing/select-goal-section';
import { BookDemoSection } from '@/components/landing/book-demo-section';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? (testimonialsResult.data as TTopperTestimonial[]) : [];

  const studentTestimonialsResult = await getTestimonials();
  const studentTestimonials = studentTestimonialsResult.success ? (studentTestimonialsResult.data as TTestimonial[]) : [];
  
  const heroSlidesResult = await getCollection('heroSlides');
  const heroSlides = heroSlidesResult.success ? (heroSlidesResult.data as THeroSlide[]) : [];

  return (
    <div className="flex flex-col bg-white dark:bg-black">
      <BuildSkillsSection slides={heroSlides} />
      <TrustedPlatform />
      <SelectGoalSection />
      <BookDemoSection />
      <AcademicExcellence />
      <ScholarshipSection />
      <StudentTestimonials testimonials={studentTestimonials} />
      <DiscoverAdvantage />
      <StudyResources />
      <ToppersTestimonials testimonials={testimonials} />
      <BlogSection />
      <GetAppSection />
    </div>
  );
}
