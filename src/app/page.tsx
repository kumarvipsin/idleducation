import { StudentTestimonials } from '@/components/landing/student-testimonials';
import { ExpertTeachersSection } from '@/components/landing/expert-teachers-section';
import { StudyResources } from '@/components/landing/study-resources';
import { AcademicExcellence } from '@/components/landing/academic-excellence';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { GetAppSection } from '@/components/landing/get-app-section';
import { ScholarshipSection } from '@/components/landing/scholarship-section';
import { TrustStatsSection } from '@/components/landing/trust-stats-section';
import { DiscoverCoursesSection } from '@/components/landing/discover-courses-section';
import { getCollection, getTestimonials, getExpertTeachers } from '@/app/actions';
import type { THeroSlide, TTestimonial, TExpertTeacher } from '@/app/actions/types';

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
      
      {/* 1. Hero Banner Section */}
      <BuildSkillsSection slides={heroSlides} />

      {/* 2. Explore Courses Section */}
      <DiscoverCoursesSection />

      {/* 3. Academic Results (Class 10, Class 12, CUET) */}
      <AcademicExcellence />

      {/* 4. Expert Teachers Carousel */}
      <ExpertTeachersSection teachers={expertTeachers} />

      {/* 5. Why Choose IDL Education */}
      <ScholarshipSection />

      {/* 5b. Standalone Trust Stats Strip */}
      <TrustStatsSection />

      {/* 6. Student Testimonials */}
      <StudentTestimonials testimonials={studentTestimonials.slice(0, 5)} />

      {/* 7. Study Resources (Notes, NCERT, PYQ) */}
      <StudyResources />

      {/* 8. IDL Learning App Showcase */}
      <GetAppSection />
    </div>
  );
}
