import type { Metadata } from 'next';
import { getTopperTestimonials, getTestimonials } from '@/app/actions/data';
import type { TTopperTestimonial, TTestimonial } from '@/app/actions/types';
import { IdlStarsClient } from './idl-stars-client';

export const metadata: Metadata = {
  title: "Stories of our Brightest Stars! | IDL Education",
  description: 'Discover inspiring journeys, achievements, and real video stories shared by our proud students and parents.',
};

export const dynamic = 'force-dynamic';

export default async function IdlStarsPage() {
  const [topperResult, studentResult] = await Promise.all([
    getTopperTestimonials(),
    getTestimonials(),
  ]);

  const topperTestimonials = topperResult.success ? (topperResult.data as TTopperTestimonial[]) : [];

  // Also collect any student testimonials that have a videoId
  const studentVideos: TTopperTestimonial[] = [];
  if (studentResult.success && Array.isArray(studentResult.data)) {
    const existingVideoIds = new Set(topperTestimonials.map((t) => t.videoId));
    (studentResult.data as TTestimonial[]).forEach((s) => {
      if (s.videoId && !existingVideoIds.has(s.videoId)) {
        studentVideos.push({
          id: s.id,
          studentName: s.name,
          studentClass: s.achievement || 'IDL Student',
          videoId: s.videoId,
          quote: s.testimonial,
          achievement: s.achievement,
          createdAt: s.createdAt,
        });
      }
    });
  }

  const allVideoStories = [...topperTestimonials, ...studentVideos];

  return <IdlStarsClient initialTestimonials={allVideoStories} />;
}
