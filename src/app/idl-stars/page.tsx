import type { Metadata } from 'next';
import { getTestimonials } from '@/app/actions/data';
import type { TTestimonial } from '@/app/actions/types';
import { IdlStarsClient } from './idl-stars-client';

export const metadata: Metadata = {
  title: 'IDL Stars | Student Success Stories | IDL Education',
  description: 'Discover inspiring journeys, achievements, and real stories from top performing IDL Education students across NEET, JEE, CBSE, and foundation classes.',
};

export const dynamic = 'force-dynamic';

export default async function IdlStarsPage() {
  const result = await getTestimonials();
  const testimonials = result.success ? (result.data as TTestimonial[]) : [];

  return <IdlStarsClient initialTestimonials={testimonials} />;
}
