'use server';

import { Suspense } from 'react';
import { getPaidCourses } from '@/app/actions';
import { PaidCoursesClient } from './paid-courses-client';

export default async function PaidCoursesPage() {
  const { success, data } = await getPaidCourses();
  const courses = success ? data : [];

  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4 text-center">Loading paid courses...</div>}>
      <PaidCoursesClient courses={courses as any[]} />
    </Suspense>
  );
}
