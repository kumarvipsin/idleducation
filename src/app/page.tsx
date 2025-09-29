
import { ToppersTestimonials } from '@/components/landing/toppers-testimonials';
import { HomePageClient } from '@/components/landing/home-page-client';
import { getTopperTestimonials } from '@/app/actions';

export default async function Home() {
  const testimonialsResult = await getTopperTestimonials();
  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];

  return <HomePageClient testimonials={testimonials as any[]} />;
}
