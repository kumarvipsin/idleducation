import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { ExpertTeachersSection } from '@/components/landing/expert-teachers-section';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { getCollection, getTestimonials, getExpertTeachers } from '@/app/actions';
import type { THeroSlide, TTestimonial, TExpertTeacher } from '@/app/actions/types';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { GetAppSection } from '@/components/landing/get-app-section';
import { ScholarshipSection } from '@/components/landing/scholarship-section';
import { DailyChallengeSection } from '@/components/landing/daily-challenge-section';
import { DiscoverCoursesSection } from '@/components/landing/discover-courses-section';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const studentTestimonialsResult = await getTestimonials();
  const studentTestimonials = studentTestimonialsResult.success ? (studentTestimonialsResult.data as TTestimonial[]) : [];

  const expertTeachersResult = await getExpertTeachers();
  const expertTeachers = expertTeachersResult.success ? (expertTeachersResult.data as TExpertTeacher[]) : [];
  
  const heroSlidesResult = await getCollection('heroSlides');
  const heroSlides = heroSlidesResult.success ? (heroSlidesResult.data as THeroSlide[]) : [];

  return (
    <div data-landing-page="true" className="flex flex-col w-full min-h-screen bg-white dark:bg-black">
      <h1 className="sr-only">IDL Education</h1>
      <BuildSkillsSection slides={heroSlides} />
      <DiscoverCoursesSection />
      <AcademicExcellence />
      <ExpertTeachersSection teachers={expertTeachers} />
      {/* Scholarship & Admission Test Banner */}
      <ScholarshipSection />
      <StudentTestimonials testimonials={studentTestimonials.slice(0, 5)} />
      <DailyChallengeSection />
      <StudyResources />
      <GetAppSection />
    </div>
  );
}
