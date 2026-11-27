import { Suspense } from 'react';
import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import CleanLeadFormClient from '@/components/clean-lead-form-client';

export const dynamic = 'force-dynamic';

export default async function StudentEnquiryPage() {
  const res = await getPublicBranchClassCatalog();

  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#FAFCFF]" />}>
      <CleanLeadFormClient formKind="enquiry" initialCatalog={res.data} />
    </Suspense>
  );
}
