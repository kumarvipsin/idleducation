// src/app/admin/fees/page.tsx
import { Metadata } from 'next';
import { FeesClient } from './fees-client';
import {
  getCurrentMonth,
  getFeeDashboardStats,
  getFeeClasses,
  getFeeBatches,
  getFeeStudents,
  getMonthlyLedger,
  getBranchYearlyReport,
  getFeePayments,
} from '@/app/actions/fee-management';
import { getServerAdminContext } from '@/lib/server-admin-auth';

export const metadata: Metadata = {
  title: 'Fee Management System | IDL Education Admin',
  description: 'Manage branch-wise classes, batches, student profiles, monthly ledger cycles, and fee receipts.',
};

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; branch?: string; month?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const adminCtx = await getServerAdminContext();
  const initialTab = sp.tab || 'overview';
  const initialBranch = adminCtx?.isBranchAdmin ? adminCtx.branchId : (sp.branch || ''); // Enforce branch admin scope server-side
  const currentMonth = await getCurrentMonth();
  const initialMonth = sp.month && sp.month <= currentMonth && sp.month >= '2026-04' ? sp.month : currentMonth;

  const [statsRes, classesRes, batchesRes, studentsRes, ledgerRes, yearlyRes, paymentsRes] = await Promise.all([
    getFeeDashboardStats(initialMonth, initialBranch),
    getFeeClasses(initialBranch),
    getFeeBatches(undefined, initialBranch),
    getFeeStudents({ branchId: initialBranch }),
    getMonthlyLedger(initialMonth, { branchId: initialBranch }),
    initialBranch && initialBranch !== 'none'
      ? getBranchYearlyReport('2026-27')
      : Promise.resolve({ success: true, data: null }),
    getFeePayments({ month: initialMonth, branchId: initialBranch }),
  ]);

  return (
    <FeesClient
      initialTab={initialTab}
      initialMonth={initialMonth}
      initialBranch={initialBranch}
      initialStats={statsRes.data}
      initialClasses={classesRes.data}
      initialBatches={batchesRes.data}
      initialStudents={studentsRes.data}
      initialLedger={ledgerRes.data}
      initialYearlyReport={yearlyRes.data ?? undefined}
      initialPayments={paymentsRes.data}
    />
  );
}
