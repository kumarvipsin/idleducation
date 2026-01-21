
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { getTopperTestimonials, getCollection } from '@/app/actions';
import type { TTopperTestimonial, THeroSlide } from '@/app/actions/types';
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
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return (
    <div className="flex flex-col bg-white dark:bg-black">
      <BuildSkillsSection />
      <TrustedPlatform />
      <SelectGoalSection />
      <BookDemoSection />
      <AcademicExcellence />
      <ScholarshipSection />
      <StudentTestimonials />
      <DiscoverAdvantage />
      <StudyResources />
      <ToppersTestimonials testimonials={testimonials as TTopperTestimonial[]} />
      <BlogSection />
      <GetAppSection />
    </div>
  );
}
