'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import {
  FeeBatch,
  FeeClass,
  FeeStudent,
} from '@/types/fee-management';
import { useAuth } from '@/context/auth-context';
import {
  getFeeBatches,
  getFeeClasses,
  getFeeStudents,
} from '@/app/actions/fee-management';
import {
  BranchToolbarControl,
  ClassBatchCardsGrid,
  ClassBatchModals,
  ClassBatchQuickActions,
  useClassBatchController,
} from '@/components/admin/class-batch-manager';
import { RefreshCw, School } from 'lucide-react';

interface AttendanceClassBatchClientProps {
  initialBranch?: string;
  initialClasses: FeeClass[];
  initialBatches: FeeBatch[];
  initialStudents: FeeStudent[];
}

/**
 * Attendance Class & Batch management view mirroring Fee Management's exact live Class/Batch system.
 */
export function AttendanceClassBatchClient({
  initialBranch = '',
  initialClasses,
  initialBatches,
  initialStudents,
}: AttendanceClassBatchClientProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const isBranchAdmin = Boolean(user?.branchId && user?.branchId !== 'all');
  const branchAdminBranchId = isBranchAdmin
    ? user!.branchId === 'mangol-puri'
      ? 'mangolpuri'
      : user!.branchId!
    : null;

  const [selectedBranch, setSelectedBranch] = useState<string>(
    branchAdminBranchId || initialBranch || (!isBranchAdmin && user?.role === 'admin' ? 'all' : '')
  );
  const hasBranchSelection = Boolean(selectedBranch && selectedBranch !== 'none');

  const [classes, setClasses] = useState<FeeClass[]>(initialClasses);
  const [batches, setBatches] = useState<FeeBatch[]>(initialBatches);
  const [students, setStudents] = useState<FeeStudent[]>(initialStudents);

  const refreshAllData = async (branch = selectedBranch) => {
    if (!branch || branch === 'none') {
      setClasses([]);
      setBatches([]);
      setStudents([]);
      return;
    }

    startTransition(async () => {
      try {
        const [newClasses, newBatches, newStudents] = await Promise.all([
          getFeeClasses(branch),
          getFeeBatches(undefined, branch),
          getFeeStudents({ branchId: branch }),
        ]);

        if (newClasses?.success) setClasses(newClasses.data);
        if (newBatches?.success) setBatches(newBatches.data);
        if (newStudents?.success) setStudents(newStudents.data);
      } catch (err) {
        console.error('Failed to refresh attendance class/batch data:', err);
      }
    });
  };

  useEffect(() => {
    if (isBranchAdmin && branchAdminBranchId && selectedBranch !== branchAdminBranchId) {
      setSelectedBranch(branchAdminBranchId);
      refreshAllData(branchAdminBranchId);
    } else if (!isBranchAdmin && user?.role === 'admin' && !selectedBranch) {
      setSelectedBranch('all');
    }
  }, [isBranchAdmin, branchAdminBranchId, user?.role]);

  const latestBranchRef = useRef(selectedBranch);
  latestBranchRef.current = selectedBranch;

  useEffect(() => {
    refreshAllData(selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    const syncLatest = () => {
      const branch = latestBranchRef.current;
      if (branch && branch !== 'none' && document.visibilityState === 'visible') {
        refreshAllData(branch);
      }
    };
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') syncLatest();
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    const intervalId = window.setInterval(syncLatest, 45000);
    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.clearInterval(intervalId);
    };
  }, []);

  const classBatch = useClassBatchController({
    classes,
    selectedBranch,
    hasBranchSelection,
    onRefresh: () => refreshAllData(),
    isBranchAdmin,
    branchAdminBranchId: branchAdminBranchId || undefined,
  });

  // Ensure document.body never stays stuck with pointer-events: none after dialog close
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!classBatch.hasOpenModal && typeof document !== 'undefined') {
        if (document.body.style.pointerEvents === 'none') {
          document.body.style.pointerEvents = '';
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [classBatch.hasOpenModal]);

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col">
      {/* Left-aligned borderless/bg-less Branch & Sync toolbar matching Fee Management */}
      <section
        aria-label="Class and batch toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-[68px] z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
          <BranchToolbarControl
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            isBranchAdmin={isBranchAdmin}
            branchName={user?.branchName}
            controlClassName={toolbarControlClass}
          />

          <button
            type="button"
            onClick={() => refreshAllData()}
            disabled={isPending}
            className={`${toolbarControlClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Refresh class and batch data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0 ${isPending ? 'animate-spin' : ''}`}
            />
            <span>Sync</span>
          </button>
        </div>
      </section>

      {/* Main Content Area (1:1 match with Fee Management Class/Batch section) */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12 font-['Inter_Tight',sans-serif]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5">
          <div className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] text-[#2864E8] uppercase">
            <School className="w-[15px] h-[15px] shrink-0" />
            <span>CLASS/BATCH</span>
          </div>

          <ClassBatchQuickActions
            onCreateClass={classBatch.openCreateClassModal}
            onCreateBatch={() => classBatch.openCreateBatchModal()}
          />
        </div>

        <ClassBatchCardsGrid
          filteredClasses={classBatch.filteredClasses}
          batches={batches}
          students={students}
          hasBranchSelection={hasBranchSelection}
          selectedBatchPerClass={classBatch.selectedBatchPerClass}
          onSelectBatch={classBatch.setSelectedBatchPerClass}
          onEditClass={classBatch.openEditClassModal}
          onDeleteClass={cls => classBatch.requestDelete({ type: 'class', id: cls.id, name: cls.name })}
          onCreateBatch={classBatch.openCreateBatchModal}
          onEditBatch={classBatch.openEditBatchModal}
          onDeleteBatch={batch => classBatch.requestDelete({ type: 'batch', id: batch.id, name: batch.name })}
        />

        <ClassBatchModals
          controller={classBatch}
          classes={classes}
          isPending={isPending}
          renderDeleteDialog
          isBranchAdmin={isBranchAdmin}
          branchAdminBranchId={branchAdminBranchId || undefined}
        />
      </div>
    </div>
  );
}

