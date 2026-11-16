'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MonthlyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/attendance/reports?view=monthly');
  }, [router]);

  return (
    <div className="py-20 text-center text-xs text-slate-500">
      Loading Monthly Attendance Report...
    </div>
  );
}
