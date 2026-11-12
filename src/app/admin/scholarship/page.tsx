'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getScholarshipRegistrations } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { CANONICAL_BRANCHES, getBranchDisplayName, normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

interface Registration {
  id: string;
  studentName: string;
  guardianName: string;
  class: string;
  mobile: string;
  mode?: string;
  state?: string;
  city?: string;
  branch?: string;
  branchId?: string;
  branchName?: string;
  createdAt: string;
}

export default function AdminScholarshipPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;
  const branchDisplayName = isBranchAdmin
    ? user?.branchName || getBranchDisplayName(branchAdminBranchId, true)
    : null;

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>(branchAdminBranchId || 'all');

  const isMountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const queuedRefreshRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isBranchAdmin && branchAdminBranchId && selectedBranch !== branchAdminBranchId) {
      setSelectedBranch(branchAdminBranchId);
    }
  }, [isBranchAdmin, branchAdminBranchId, selectedBranch]);

  const fetchRegistrations = useCallback(async (silent = false) => {
    if (authLoading || !user) return;
    if (inFlightRef.current) {
      queuedRefreshRef.current = true;
      return;
    }

    inFlightRef.current = true;
    if (!silent) {
      setLoading(true);
    }

    try {
      const result = await getScholarshipRegistrations(
        isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined
      );
      if (isMountedRef.current && result.success && result.data) {
        setRegistrations(result.data as Registration[]);
      }
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current && !silent) {
        setLoading(false);
      }
      if (queuedRefreshRef.current && isMountedRef.current) {
        queuedRefreshRef.current = false;
        void fetchRegistrations(true);
      }
    }
  }, [authLoading, user, isBranchAdmin, branchAdminBranchId]);

  useEffect(() => {
    void fetchRegistrations(false);
  }, [fetchRegistrations]);

  // Auto-refresh live when new scholarship applications are submitted.
  useEffect(() => {
    if (authLoading || !user) return;
    let initialSnapshot = true;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const unsubscribe = onSnapshot(
      collection(db, 'scholarshipRegistrations'),
      () => {
        if (initialSnapshot) {
          initialSnapshot = false;
          return;
        }
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          void fetchRegistrations(true);
        }, 300);
      },
      () => {
        // Ignore transient snapshot permission errors; focus polling still refreshes.
      }
    );

    const handleVisibilityRefresh = () => {
      if (document.visibilityState === 'visible') {
        void fetchRegistrations(true);
      }
    };
    window.addEventListener('focus', handleVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityRefresh);

    return () => {
      unsubscribe();
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('focus', handleVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityRefresh);
    };
  }, [authLoading, user, fetchRegistrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const targetBranch = isBranchAdmin ? branchAdminBranchId : selectedBranch;
      if (!targetBranch || targetBranch === 'all') return true;
      return recordMatchesBranch(item, targetBranch);
    });
  }, [registrations, isBranchAdmin, branchAdminBranchId, selectedBranch]);

  const formatBranchLabel = (reg: Registration) => {
    if (reg.branch && reg.branch.trim()) return reg.branch;
    if (reg.branchName && reg.branchName.trim()) return reg.branchName;
    if (reg.branchId && normalizeBranchId(reg.branchId)) {
      return getBranchDisplayName(reg.branchId);
    }
    return '—';
  };

  const formatLocationLabel = (reg: Registration) => {
    const parts = [reg.city, reg.state].filter((p) => Boolean(p && p.trim()));
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
        <TableCell className="hidden xl:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Scholarship Registrations</CardTitle>
            {isBranchAdmin && branchDisplayName && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" />
                {branchDisplayName}
              </span>
            )}
          </div>
          <CardDescription className="mt-1">
            {isBranchAdmin
              ? `Showing scholarship applications submitted for ${branchDisplayName || 'your branch'}.`
              : 'All scholarship form submissions across branches.'}
          </CardDescription>
        </div>
        {!isBranchAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs border rounded-md px-2.5 py-1.5 bg-background font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">🌐 All Branches</option>
              {CANONICAL_BRANCHES.filter((b) => b.id !== 'online').map((branch) => (
                <option key={branch.id} value={branch.id}>
                  🏢 {branch.displayName}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="h-[calc(100vh-220px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Guardian Name</TableHead>
                  <TableHead className="hidden md:table-cell">Class</TableHead>
                  <TableHead className="hidden lg:table-cell">Mobile</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="hidden xl:table-cell">State / City</TableHead>
                  <TableHead>Submission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">
                        <div>{reg.studentName}</div>
                        {reg.mode && (
                          <div className="text-[11px] font-normal text-muted-foreground">
                            Mode: {reg.mode}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{reg.guardianName}</TableCell>
                      <TableCell className="hidden md:table-cell">{reg.class}</TableCell>
                      <TableCell className="hidden lg:table-cell font-mono text-xs">{reg.mobile}</TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {formatBranchLabel(reg)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">{formatLocationLabel(reg)}</TableCell>
                      <TableCell>
                        {reg.createdAt ? format(new Date(reg.createdAt), 'PPp') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground h-48">
                      {isBranchAdmin
                        ? 'No scholarship applications found for this branch yet.'
                        : 'No scholarship registrations have been submitted yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
