
'use server';

import { getFreeCourses } from '@/app/actions';
import { FreeCoursesClient } from './free-courses-client';

export default async function FreeCoursesPage() {
  const { success, data } = await getFreeCourses();
  const courses = success ? data : [];

  return <FreeCoursesClient courses={courses as any[]} />;
}
