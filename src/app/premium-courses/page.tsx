'use server';

import { Suspense } from 'react';
import { getPaidCourses } from '@/app/actions/paid-courses';
import { PremiumCoursesClient } from './premium-courses-client';
import type { TPaidCourse } from '@/app/actions/types';

export default async function PremiumCoursesPage() {
  const { success, data } = await getPaidCourses();
  // Purely backend-driven: only courses configured and saved in the Admin Panel / Firestore
  const courses = (success && data && Array.isArray(data)) ? (data as TPaidCourse[]) : [];

  return (
    <Suspense fallback={<div className="container mx-auto py-12 px-4 text-center text-slate-500">Loading premium courses...</div>}>
      <PremiumCoursesClient courses={courses} />
    </Suspense>
  );
}
