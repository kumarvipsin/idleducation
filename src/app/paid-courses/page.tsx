'use server';

import { getPaidCourses } from '@/app/actions';
import { PaidCoursesClient } from './paid-courses-client';

export default async function PaidCoursesPage() {
  const { success, data } = await getPaidCourses();
  const courses = success ? data : [];

  return <PaidCoursesClient courses={courses as any[]} />;
}
