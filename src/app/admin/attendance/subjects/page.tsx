import { Metadata } from 'next';
import { AttendanceClassBatchClient } from './attendance-class-batch-client';
import {
  getFeeBatches,
  getFeeClasses,
  getFeeStudents,
} from '@/app/actions/fee-management';
import { getServerAdminContext } from '@/lib/server-admin-auth';

export const metadata: Metadata = {
  title: 'Class & Batch Management | Attendance Portal',
  description: 'Manage branch-wise academic classes, batches, schedules, subjects, and enrolled students.',
};

export default async function AttendanceClassBatchPage({
  searchParams,
}: {
  searchParams?: Promise<{ branch?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const adminCtx = await getServerAdminContext();
  const initialBranch = adminCtx?.isBranchAdmin
    ? adminCtx.branchId
    : adminCtx?.isSuperAdmin
      ? sp.branch || 'all'
      : '';

  const [classesRes, batchesRes, studentsRes] = await Promise.all([
    getFeeClasses(initialBranch),
    getFeeBatches(undefined, initialBranch),
    getFeeStudents({ branchId: initialBranch }),
  ]);

  return (
    <AttendanceClassBatchClient
      initialBranch={initialBranch}
      initialClasses={classesRes.data}
      initialBatches={batchesRes.data}
      initialStudents={studentsRes.data}
    />
  );
}
