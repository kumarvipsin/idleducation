import nextDynamic from 'next/dynamic';
import { BuildSkillsSection } from '@/components/landing/build-skills-section';
import { getCollection, getTestimonials, getExpertTeachers } from '@/app/actions';
import type { THeroSlide, TTestimonial, TExpertTeacher } from '@/app/actions/types';

// ============================================================================
// ISOLATED SECTION CODE-SPLITTING
// Har section ko independent chunk me split kiya gaya hai taaki:
// 1. Jis section me change hoga, sirf wahi section fast recompile/reload hoga
// 2. Doosre sections un-affected rahenge aur Fast-Refresh lightning fast hoga
// ============================================================================

const DiscoverCoursesSection = nextDynamic(
  () => import('@/components/landing/discover-courses-section').then((mod) => mod.DiscoverCoursesSection),
  { ssr: true }
);

const AcademicExcellence = nextDynamic(
  () => import('@/components/landing/academic-excellence').then((mod) => mod.AcademicExcellence),
  { ssr: true }
);

const ExpertTeachersSection = nextDynamic(
  () => import('@/components/landing/expert-teachers-section').then((mod) => mod.ExpertTeachersSection),
  { ssr: true }
);

const ScholarshipSection = nextDynamic(
  () => import('@/components/landing/scholarship-section').then((mod) => mod.ScholarshipSection),
  { ssr: true }
);

const StudentTestimonials = nextDynamic(
  () => import('@/components/landing/student-testimonials').then((mod) => mod.StudentTestimonials),
  { ssr: true }
);

const DailyChallengeSection = nextDynamic(
  () => import('@/components/landing/daily-challenge-section').then((mod) => mod.DailyChallengeSection),
  { ssr: true }
);

const StudyResources = nextDynamic(
  () => import('@/components/landing/study-resources').then((mod) => mod.StudyResources),
  { ssr: true }
);

const GetAppSection = nextDynamic(
  () => import('@/components/landing/get-app-section').then((mod) => mod.GetAppSection),
  { ssr: true }
);

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

      {/* 5. Scholarship & Admission Test Banner */}
      <ScholarshipSection />

      {/* 6. Student Testimonials */}
      <StudentTestimonials testimonials={studentTestimonials.slice(0, 5)} />

      {/* 7. Daily Quiz & Challenge Section */}
      <DailyChallengeSection />

      {/* 8. Study Resources (Notes, NCERT, PYQ) */}
      <StudyResources />

      {/* 9. IDL Learning App Showcase */}
      <GetAppSection />
    </div>
  );
}
