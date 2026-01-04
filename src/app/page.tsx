
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

export const dynamic = 'force-dynamic';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  const slidesResult = await getCollection('heroSlides');
  const slides = slidesResult.success ? (slidesResult.data as THeroSlide[]).sort((a,b) => a.order - b.order) : [];

  return (
    <div className="flex flex-col bg-white dark:bg-black">
      <div className="mx-[2vw] mt-[1vh] rounded-2xl overflow-hidden">
        <BuildSkillsSection slides={slides} />
      </div>
      <TrustedPlatform />
      <ExamCategories />
      <OurFeatures />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <ToppersTestimonials testimonials={testimonials as TTopperTestimonial[]} />
    </div>
  );
}
