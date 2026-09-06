import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { ExpertTeachersSection } from '@/components/landing/expert-teachers-section';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { getTopperTestimonials, getCollection, getTestimonials, getExpertTeachers } from '@/app/actions';
import type { TTopperTestimonial, THeroSlide, TTestimonial, TExpertTeacher } from '@/app/actions/types';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { TrustedPlatform } from '@/components/landing/trusted-platform';
import { GetAppSection } from '@/components/landing/get-app-section';
import { ScholarshipSection } from '@/components/landing/scholarship-section';
import { DailyChallengeSection } from '@/components/landing/daily-challenge-section';
import { DiscoverCoursesSection } from '@/components/landing/discover-courses-section';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? (testimonialsResult.data as TTopperTestimonial[]) : [];

  const studentTestimonialsResult = await getTestimonials();
  const studentTestimonials = studentTestimonialsResult.success ? (studentTestimonialsResult.data as TTestimonial[]) : [];

  const expertTeachersResult = await getExpertTeachers();
  const expertTeachers = expertTeachersResult.success ? (expertTeachersResult.data as TExpertTeacher[]) : [];
  
  const heroSlidesResult = await getCollection('heroSlides');
  const heroSlides = heroSlidesResult.success ? (heroSlidesResult.data as THeroSlide[]) : [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-black">
      <BuildSkillsSection slides={heroSlides} />
      <DiscoverCoursesSection />
      <TrustedPlatform />
      <AcademicExcellence />
      <ExpertTeachersSection teachers={expertTeachers} />
      <ScholarshipSection />
      <StudentTestimonials testimonials={studentTestimonials} />
      <DailyChallengeSection />
      <StudyResources />
      <ToppersTestimonials testimonials={testimonials} />
      <GetAppSection />
    </div>
  );
}
