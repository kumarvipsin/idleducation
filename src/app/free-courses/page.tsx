
'use server';

import { Suspense } from 'react';
import { getFreeCourses } from '@/app/actions';
import { FreeCoursesClient } from './free-courses-client';

export default async function FreeCoursesPage() {
  const { success, data } = await getFreeCourses();
  const courses = success ? data : [];

  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4 text-center">Loading free courses...</div>}>
      <FreeCoursesClient courses={courses as any[]} />
    </Suspense>
  );
}
