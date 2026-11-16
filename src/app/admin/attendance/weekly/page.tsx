'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WeeklyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/attendance/reports?view=weekly');
  }, [router]);

  return (
    <div className="py-20 text-center text-xs text-slate-500">
      Loading Weekly Attendance Report...
    </div>
  );
}
