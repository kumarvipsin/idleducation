import { Suspense } from 'react';
import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import ScholarshipFormClient from '@/components/scholarship-form-client';

export const dynamic = 'force-dynamic';

export default async function ScholarshipPage() {
  const res = await getPublicBranchClassCatalog();

  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#FAFCFF]" />}>
      <ScholarshipFormClient initialCatalog={res.data} />
    </Suspense>
  );
}
