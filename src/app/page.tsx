<<<<<<< HEAD
import PageHeader from '@/components/page-header';
import ProgressChart from '@/components/dashboard/progress-chart';
import ContentRecommendations from '@/components/dashboard/content-recommendations';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Welcome to your Dashboard"
        description="Here's a snapshot of your learning journey. Keep up the great work!"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>
        <div className="lg:col-span-1">
          <ContentRecommendations />
        </div>
      </div>
=======
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

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return (
    <div className="flex flex-col bg-white dark:bg-background">
      <HeroSection />
      <OurFeatures />
      <ExamCategories />
      <AcademicExcellence />
      <StudentTestimonials />
      <StudyResources />
      <TopperTestimonialsClient testimonials={testimonials as any[]} />
>>>>>>> origin/main
    </div>
  );
}
