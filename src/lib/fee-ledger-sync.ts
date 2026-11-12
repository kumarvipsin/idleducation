import type { FeeStudent, FeeLedgerEntry, FeePayment, LedgerStatus } from '../types/fee-management';
import { getStudentStatusForMonth, getActiveAdditionalSubjectsForMonth } from '../types/fee-management';
import { getMonthSequence, clampDueDateForMonth } from './fee-pure-helpers';

export interface FeeLedgerSyncDatabase {
  classes: any[];
  batches: any[];
  students: FeeStudent[];
  ledger: FeeLedgerEntry[];
  payments: FeePayment[];
  [key: string]: any;
}

/**
 * Returns YYYY-MM formatted string for the month preceding monthStr.
 */
export function getPreviousMonth(monthStr: string): string {
  const [y, m] = monthStr.split('-').map(Number);
  let prevYear = y;
  let prevMonth = m - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }
  return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}

/**
 * Pure ledger sync engine:
 * - Initializes ledger entries for a monthly (non-yearly) student from their joining month up to currentMonth.
 * - If joiningMonth < currentMonth, every strictly prior month (< currentMonth) missing a ledger entry is
 *   automatically marked PAID on its respective monthly due date (with matching FeePayment receipt).
 * - currentMonth itself is NEVER auto-collected so fee is collected manually in admin or online via Pay Fee.
 * - Preserves zero carry-forward arrears onto currentMonth for prior auto-settled months.
 * - Respects student.excludedMonths and student monthly status (disabled).
 */
export function syncMonthlyStudentLedgersAndPriorPayments(params: {
  dbData: FeeLedgerSyncDatabase;
  student: FeeStudent;
  currentMonth: string;
  todayStr: string;
  currentMonthLabel: string;
  getMonthLabelSync?: (monthStr: string) => string;
}): { priorMonthsAutoPaid: number; currentMonthLabel: string } {
  const { dbData, student, currentMonth, todayStr, currentMonthLabel, getMonthLabelSync } = params;

  const resolveMonthLabel = (m: string) => {
    if (m === currentMonth) return currentMonthLabel;
    if (getMonthLabelSync) return getMonthLabelSync(m);
    // Standard default format: e.g. "2026-04" -> "April 2026"
    try {
      const [y, mon] = m.split('-').map(Number);
      const d = new Date(Date.UTC(y, (mon || 1) - 1, 1));
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    } catch {
      return m;
    }
  };

  const rawJoiningMonth = (student.joiningDate || todayStr).slice(0, 7);
  const dueDay = Math.min(31, Math.max(1, Number(student.dueDayOfMonth) || 5));

  // If joining month is strictly in the future, only initialize that future month as PENDING.
  if (rawJoiningMonth > currentMonth) {
    const existingFuture = dbData.ledger.find(l => l.studentId === student.id && l.month === rawJoiningMonth);
    if (!existingFuture) {
      const futureLabel = resolveMonthLabel(rawJoiningMonth);
      const dueDate = clampDueDateForMonth(rawJoiningMonth, dueDay);
      const addlFee = getActiveAdditionalSubjectsForMonth(student, rawJoiningMonth).reduce(
        (sum, s) => sum + (Number(s.fee) || 0),
        0
      );
      const monthlyBase = student.baseFee + addlFee;
      const monthlyNet = Math.max(0, student.baseFee - student.discountAmount) + addlFee;
      dbData.ledger.unshift({
        id: `led-${student.id}-${rawJoiningMonth}`,
        studentId: student.id,
        branchId: student.branchId,
        classId: student.classId,
        batchId: student.batchId,
        month: rawJoiningMonth,
        monthLabel: futureLabel,
        baseAmount: monthlyBase,
        discountAmount: student.discountAmount,
        netDueAmount: monthlyNet,
        carriedForwardDue: 0,
        paidAmount: 0,
        balanceAmount: monthlyNet,
        advanceAmount: 0,
        dueDate,
        status: todayStr > dueDate && monthlyNet > 0 ? 'OVERDUE' : 'PENDING',
        isOverdue: todayStr > dueDate && monthlyNet > 0,
        updatedAt: new Date().toISOString(),
      });
    }
    return { priorMonthsAutoPaid: 0, currentMonthLabel };
  }

  let monthSeq = getMonthSequence(rawJoiningMonth, currentMonth);
  // Guard against extreme accidental year typos while supporting multi-year historical enrollments.
  if (monthSeq.length > 120) {
    monthSeq = monthSeq.slice(-120);
  }

  let priorMonthsAutoPaid = 0;

  for (const curM of monthSeq) {
    if (student.excludedMonths?.includes(curM) || getStudentStatusForMonth(student, curM) === 'disabled') {
      continue;
    }
    const curMonthLabel = resolveMonthLabel(curM);
    const dueDate = clampDueDateForMonth(curM, dueDay);
    const addlFee = getActiveAdditionalSubjectsForMonth(student, curM).reduce(
      (sum, s) => sum + (Number(s.fee) || 0),
      0
    );
    const monthlyBase = student.baseFee + addlFee;
    const monthlyNet = Math.max(0, student.baseFee - student.discountAmount) + addlFee;
    const existingIdx = dbData.ledger.findIndex(l => l.studentId === student.id && l.month === curM);

    if (curM < currentMonth) {
      // Strictly prior months (< currentMonth): auto-collect missing months on their monthly due date.
      if (existingIdx === -1) {
        const priorLedger: FeeLedgerEntry = {
          id: `led-${student.id}-${curM}`,
          studentId: student.id,
          branchId: student.branchId,
          classId: student.classId,
          batchId: student.batchId,
          month: curM,
          monthLabel: curMonthLabel,
          baseAmount: monthlyBase,
          discountAmount: student.discountAmount,
          netDueAmount: monthlyNet,
          carriedForwardDue: 0,
          paidAmount: monthlyNet,
          balanceAmount: 0,
          advanceAmount: 0,
          dueDate,
          lastPaymentDate: dueDate,
          status: 'PAID',
          isOverdue: false,
          remarks: `Auto-collected prior month (${curMonthLabel}) on due date`,
          updatedAt: new Date().toISOString(),
        };
        dbData.ledger.unshift(priorLedger);
        priorMonthsAutoPaid += 1;

        if (monthlyNet > 0 && !dbData.payments.some(p => p.studentId === student.id && p.month === curM)) {
          const receiptNo = `REC-${curM.replace('-', '')}-${String(dbData.payments.length + 1).padStart(4, '0')}`;
          dbData.payments.unshift({
            id: `pay-prior-${student.id}-${curM}`,
            receiptNumber: receiptNo,
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            branchId: student.branchId,
            classId: student.classId,
            batchId: student.batchId,
            month: curM,
            monthLabel: curMonthLabel,
            amount: monthlyNet,
            paymentMode: 'cash',
            transactionRef: 'AUTO-PRIOR-MONTH',
            paymentDate: dueDate,
            collectedBy: 'Admin Desk',
            remarks: `Auto-collected prior month (${curMonthLabel}) on due date (${dueDate})`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } else {
      // curM === currentMonth: NEVER auto-collect. Keep unpaid until manual or website collection.
      if (existingIdx === -1) {
        const currentLedger: FeeLedgerEntry = {
          id: `led-${student.id}-${curM}`,
          studentId: student.id,
          branchId: student.branchId,
          classId: student.classId,
          batchId: student.batchId,
          month: curM,
          monthLabel: curMonthLabel,
          baseAmount: monthlyBase,
          discountAmount: student.discountAmount,
          netDueAmount: monthlyNet,
          carriedForwardDue: 0,
          paidAmount: 0,
          balanceAmount: monthlyNet,
          advanceAmount: 0,
          dueDate,
          status: todayStr > dueDate && monthlyNet > 0 ? 'OVERDUE' : 'PENDING',
          isOverdue: todayStr > dueDate && monthlyNet > 0,
          updatedAt: new Date().toISOString(),
        };
        dbData.ledger.unshift(currentLedger);
      } else {
        const prevM = getPreviousMonth(curM);
        const prevEntry = prevM >= rawJoiningMonth
          ? dbData.ledger.find(l => l.studentId === student.id && l.month === prevM)
          : undefined;
        const carriedForward = prevEntry ? Math.max(0, prevEntry.balanceAmount) : 0;
        const existing = dbData.ledger[existingIdx];
        const newNetDue = monthlyNet + carriedForward;
        const newBalance = Math.max(0, newNetDue - existing.paidAmount);
        const newAdvance = Math.max(0, existing.paidAmount - newNetDue);
        let newStatus: LedgerStatus = 'PENDING';
        if (newBalance === 0 && newAdvance > 0) newStatus = 'ADVANCE';
        else if (newBalance === 0 && existing.paidAmount > 0) newStatus = 'PAID';
        else if (existing.paidAmount > 0 && newBalance > 0) newStatus = 'PARTIAL';
        else if (todayStr > dueDate && newBalance > 0) newStatus = 'OVERDUE';

        dbData.ledger[existingIdx] = {
          ...existing,
          branchId: student.branchId,
          classId: student.classId,
          batchId: student.batchId,
          baseAmount: monthlyBase,
          discountAmount: student.discountAmount,
          carriedForwardDue: carriedForward,
          netDueAmount: newNetDue,
          balanceAmount: newBalance,
          advanceAmount: newAdvance,
          dueDate,
          status: newStatus,
          isOverdue: todayStr > dueDate && newBalance > 0,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  }

  return { priorMonthsAutoPaid, currentMonthLabel };
}
