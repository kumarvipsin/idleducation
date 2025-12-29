import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { OurFeatures } from '@/components/landing/our-features';
import { TopperTestimonialsClient } from '@/components/landing/topper-testimonials-client';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { ExamCategories } from '@/components/landing/exam-categories';
import { getTopperTestimonials } from '@/app/actions';
import type { TTopperTestimonial } from '@/app/actions/types';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { TrustedBy } from '@/components/landing/trusted-by';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-[2vw] mt-[1vh] rounded-2xl overflow-hidden">
        <BuildSkillsSection />
      </div>
      <ExamCategories />
      <OurFeatures />
      <AcademicExcellence />
      <TrustedBy />
      <StudentTestimonials />
      <StudyResources />
      <TopperTestimonialsClient testimonials={testimonials as any[]} />
    </div>
  );
}
