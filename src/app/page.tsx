
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { OurFeatures } from '@/components/landing/our-features';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';
import { getTopperTestimonials, getCollection } from '@/app/actions';
import type { TTopperTestimonial, THeroSlide } from '@/app/actions/types';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { TrustedPlatform } from '@/components/landing/trusted-platform';
import { DirectorMessage } from '@/components/landing/director-message';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  const slidesResult = await getCollection('heroSlides');
  const slides = slidesResult.success ? (slidesResult.data as THeroSlide[]).sort((a,b) => a.order - b.order) : [];

  return (
    <div className="flex flex-col bg-white dark:bg-black">
      <BuildSkillsSection slides={slides} />
      <TrustedPlatform />
      <ExamCategories />
      <OurFeatures />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <ToppersTestimonials testimonials={testimonials as TTopperTestimonial[]} />
      <DirectorMessage />
    </div>
  );
}
