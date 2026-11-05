import { redirect } from 'next/navigation';

export default async function PaidCoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === 'string') {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => query.append(key, v));
    }
  }
  const qs = query.toString();
  redirect(`/premium-courses${qs ? `?${qs}` : ''}`);
}
