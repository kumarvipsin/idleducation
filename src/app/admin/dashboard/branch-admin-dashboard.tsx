'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Check,
  CheckCircle2,
  Edit3,
  GraduationCap,
  Megaphone,
  MessageCircle,
  Plus,
  Presentation,
  RefreshCw,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
  XCircle,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { normalizeBranchId } from '@/lib/branch-utils';
import {
  getBranchDashboardData,
  type BranchDashboardPayload,
  type BranchUpdateItem,
} from '@/app/actions/branch-dashboard';
import {
  addUpdate,
  approveUser,
  deleteUpdate,
  denyUser,
  editUpdate,
} from '@/app/actions/admin';

const overviewChartConfig = {
  totalUsers: { label: 'Total Users', color: '#2864E8' },
  totalStudents: { label: 'Total Students', color: '#0B1B43' },
  newStudents: { label: 'Approved Students', color: '#0EA5E9' },
  trainedStudents: { label: 'Assigned Students', color: '#10B981' },
  totalTeachers: { label: 'Total Teachers', color: '#64748B' },
} satisfies ChartConfig;

const compositionChartConfig = {
  approvedStudents: { label: 'Approved Students', color: '#2864E8' },
  activeUsers: { label: 'Active Users', color: '#10B981' },
  inactiveUsers: { label: 'Inactive Users', color: '#94A3B8' },
  deniedUsers: { label: 'Denied Users', color: '#EF4444' },
} satisfies ChartConfig;

function formatShortDate(iso?: string | null): string {
  if (!iso) return '—';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface StatCardConfig {
  title: string;
  value: number;
  supporting: string;
  supportingAccent?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  href?: string;
}

export function BranchAdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const branchScope =
    normalizedBranchId && normalizedBranchId !== 'all' ? normalizedBranchId : undefined;

  const [data, setData] = useState<BranchDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busyTeacherId, setBusyTeacherId] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const queuedRefreshRef = useRef(false);

  // Branch updates create/edit dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<BranchUpdateItem | null>(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [savingUpdate, setSavingUpdate] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadDashboard = useCallback(async (silent = false) => {
    if (inFlightRef.current) {
      queuedRefreshRef.current = true;
      return;
    }

    inFlightRef.current = true;
    if (!silent) {
      setLoading(true);
      setErrorMsg(null);
    }

    try {
      const res = await getBranchDashboardData(branchScope);
      if (!isMountedRef.current) return;
      if (res.success && res.data) {
        setData(res.data);
        setErrorMsg(null);
      } else if (!silent) {
        setErrorMsg(res.message || 'Unable to load branch dashboard metrics.');
      }
    } finally {
      inFlightRef.current = false;
      if (isMountedRef.current && !silent) {
        setLoading(false);
      }
      if (isMountedRef.current && queuedRefreshRef.current) {
        queuedRefreshRef.current = false;
        void loadDashboard(true);
      }
    }
  }, [branchScope]);

  useEffect(() => {
    void loadDashboard(false);
  }, [loadDashboard]);

  // Real-time auto-refresh whenever branch-scoped Firestore collections change, on tab focus, and periodically
  useEffect(() => {
    if (!branchScope) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleAutoRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        void loadDashboard(true);
      }, 300);
    };

    const collectionsToWatch = [
      'users',
      'deniedUsers',
      'sessionBookings',
      'contactSubmissions',
      'updates',
    ] as const;

    const unsubscribers = collectionsToWatch.map((colName) => {
      let initialized = false;
      return onSnapshot(
        collection(db, colName),
        () => {
          if (!initialized) {
            initialized = true;
            return;
          }
          scheduleAutoRefresh();
        },
        () => {
          // Listener errors fall back gracefully to interval/focus refresh without surfacing noise
        }
      );
    });

    const handleVisibilityOrFocus = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        scheduleAutoRefresh();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    const intervalId = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        void loadDashboard(true);
      }
    }, 30000);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribers.forEach((unsub) => unsub());
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, [branchScope, loadDashboard]);

  const handleTeacherDecision = async (teacherId: string, decision: 'approve' | 'deny') => {
    setBusyTeacherId(teacherId);
    const res = decision === 'approve' ? await approveUser(teacherId) : await denyUser(teacherId);
    if (res.success) {
      toast({
        title: decision === 'approve' ? 'Teacher Approved' : 'Teacher Application Denied',
        description: res.message,
      });
      await loadDashboard(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: res.message,
      });
    }
    setBusyTeacherId(null);
  };

  const openNewUpdateModal = () => {
    setEditingUpdate(null);
    setUpdateTitle('');
    setUpdateDescription('');
    setUpdateDialogOpen(true);
  };

  const openEditUpdateModal = (item: BranchUpdateItem) => {
    setEditingUpdate(item);
    setUpdateTitle(item.title);
    setUpdateDescription(item.description);
    setUpdateDialogOpen(true);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateDescription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please enter both a title and description for the branch update.',
      });
      return;
    }

    setSavingUpdate(true);
    const payload = { title: updateTitle.trim(), description: updateDescription.trim() };
    const res = editingUpdate
      ? await editUpdate(editingUpdate.id, payload)
      : await addUpdate(payload, branchScope);

    if (res.success) {
      toast({ title: 'Saved', description: res.message });
      setUpdateDialogOpen(false);
      await loadDashboard(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Save Update',
        description: res.message,
      });
    }
    setSavingUpdate(false);
  };

  const handleDeleteUpdate = async (id: string) => {
    const res = await deleteUpdate(id);
    if (res.success) {
      toast({ title: 'Update Removed', description: res.message });
      await loadDashboard(true);
    } else {
      toast({ variant: 'destructive', title: 'Delete Failed', description: res.message });
    }
  };

  const primaryStatCards: StatCardConfig[] = useMemo(() => {
    const s = data?.stats;
    if (!s) return [];
    return [
      {
        title: 'Total Users',
        value: s.totalUsers,
        supporting: 'Registered in branch',
        icon: Users,
        iconBg: 'bg-[#EFF6FF]',
        iconColor: 'text-[#2864E8]',
        href: '/admin/users',
      },
      {
        title: 'Total Students',
        value: s.totalStudents,
        supporting: 'Branch student roster',
        icon: GraduationCap,
        iconBg: 'bg-[#F0FDF4]',
        iconColor: 'text-[#15803D]',
        href: '/admin/users',
      },
      {
        title: 'Total Teachers',
        value: s.totalTeachers,
        supporting: 'Assigned branch faculty',
        icon: Briefcase,
        iconBg: 'bg-[#FFFBEB]',
        iconColor: 'text-[#B45309]',
        href: '/admin/teachers',
      },
      {
        title: 'Approved Students',
        value: s.approvedStudents,
        supporting: 'Verified active profiles',
        icon: UserPlus,
        iconBg: 'bg-[#F0F9FF]',
        iconColor: 'text-[#0369A1]',
        href: '/admin/users',
      },
      {
        title: 'Deny Users',
        value: s.deniedUsers,
        supporting: 'Declined registrations',
        icon: XCircle,
        iconBg: 'bg-[#FEF2F2]',
        iconColor: 'text-[#B91C1C]',
      },
      {
        title: 'Free Demo',
        value: s.totalBookings,
        supporting: `+${s.monthlyBookings} this month`,
        supportingAccent: s.monthlyBookings > 0,
        icon: Presentation,
        iconBg: 'bg-[#EEF2FF]',
        iconColor: 'text-[#4338CA]',
        href: '/admin/demo',
      },
      {
        title: 'Contact Us',
        value: s.totalSubmissions,
        supporting: `+${s.monthlySubmissions} this month`,
        supportingAccent: s.monthlySubmissions > 0,
        icon: MessageCircle,
        iconBg: 'bg-[#F8FAFC]',
        iconColor: 'text-[#0B1B43]',
        href: '/admin/messages',
      },
      {
        title: 'Recent Updates',
        value: s.totalUpdates,
        supporting: `+${s.monthlyUpdates} this month`,
        supportingAccent: s.monthlyUpdates > 0,
        icon: Megaphone,
        iconBg: 'bg-[#EFF6FF]',
        iconColor: 'text-[#2864E8]',
      },
    ];
  }, [data]);

  const userStatusCards: StatCardConfig[] = useMemo(() => {
    const s = data?.stats;
    if (!s) return [];
    return [
      {
        title: 'Active Users',
        value: s.activeUsers,
        supporting: `+${s.monthlyActiveUsers} this month`,
        supportingAccent: s.monthlyActiveUsers > 0,
        icon: UserCheck,
        iconBg: 'bg-[#ECFDF5]',
        iconColor: 'text-[#059669]',
        href: '/admin/users',
      },
      {
        title: 'Inactive Users',
        value: s.inactiveUsers,
        supporting: 'Currently paused accounts',
        icon: UserX,
        iconBg: 'bg-[#F1F5F9]',
        iconColor: 'text-[#64748B]',
        href: '/admin/users',
      },
    ];
  }, [data]);

  const compositionData = useMemo(() => {
    if (!data?.stats) return [];
    const { approvedStudents, activeUsers, inactiveUsers, deniedUsers } = data.stats;
    return [
      { key: 'approvedStudents', name: 'Approved Students', value: approvedStudents, fill: '#2864E8' },
      { key: 'activeUsers', name: 'Active Users', value: activeUsers, fill: '#10B981' },
      { key: 'inactiveUsers', name: 'Inactive Users', value: inactiveUsers, fill: '#94A3B8' },
      { key: 'deniedUsers', name: 'Denied Users', value: deniedUsers, fill: '#EF4444' },
    ].filter((item) => item.value > 0);
  }, [data]);

  const renderStatCard = (card: StatCardConfig) => {
    const Icon = card.icon;
    const inner = (
      <Card className="h-full min-h-[118px] rounded-xl border border-[#E5EAF2] bg-white shadow-[0_1px_2px_rgba(11,27,67,0.03)] transition-all hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(11,27,67,0.05)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-4 pb-2">
          <CardTitle className="text-[13px] font-medium text-[#64748B]">
            {card.title}
          </CardTitle>
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
          >
            <Icon className={`h-4 w-4 ${card.iconColor}`} />
          </span>
        </CardHeader>
        <CardContent className="px-5 pb-4 pt-1">
          <div
            data-testid={`stat-value-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="text-2xl font-bold tracking-tight text-[#172033] tabular-nums"
          >
            {card.value.toLocaleString('en-IN')}
          </div>
          <p
            className={`mt-1 text-xs font-medium ${
              card.supportingAccent ? 'text-[#2864E8]' : 'text-[#94A3B8]'
            }`}
          >
            {card.supporting}
          </p>
        </CardContent>
      </Card>
    );

    if (card.href) {
      return (
        <Link key={card.title} href={card.href} className="block focus:outline-none">
          {inner}
        </Link>
      );
    }

    return <div key={card.title}>{inner}</div>;
  };

  if (loading) {
    return (
      <div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[118px] w-full rounded-xl bg-[#E5EAF2]/70" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[118px] w-full rounded-xl bg-[#E5EAF2]/70" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <Card className="rounded-xl border border-[#FECACA] bg-white p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-[#0B1B43]">
              Unable to Load Branch Dashboard
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              {errorMsg || 'Your branch administrator session could not be verified.'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => loadDashboard(false)}
            className="border-[#E5EAF2] text-[#172033]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="space-y-6">
      {/* Primary 8 Metric Cards in Responsive 4-Column Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryStatCards.map(renderStatCard)}
      </div>

      {/* User Status Cards in Consistent 4-Column Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userStatusCards.map(renderStatCard)}
      </div>

      {/* Pending Teacher Approvals Section */}
      <Card className="rounded-xl border border-[#E5EAF2] bg-white shadow-[0_1px_2px_rgba(11,27,67,0.03)]">
        <CardHeader className="flex flex-col gap-2 border-b border-[#E5EAF2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-[#0B1B43]">
                Pending Teacher Approvals
              </CardTitle>
              <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2 py-0.5 text-xs font-semibold text-[#2864E8]">
                {data.pendingTeachers.length}
              </span>
            </div>
            <CardDescription className="mt-0.5 text-xs text-[#64748B]">
              Review new teacher registrations submitted for {data.admin.branchDisplayName}.
            </CardDescription>
          </div>
          <Link
            href="/admin/teachers"
            className="text-xs font-semibold text-[#2864E8] hover:underline"
          >
            View All Teachers
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {data.pendingTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2864E8]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-[#172033]">No Pending Approvals</p>
              <p className="mt-1 max-w-md text-xs text-[#64748B]">
                All teacher applications for {data.admin.branchName} have been reviewed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E5EAF2] bg-[#F8FAFC] hover:bg-[#F8FAFC]">
                    <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Name
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Email
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Branch
                    </TableHead>
                    <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Registered
                    </TableHead>
                    <TableHead className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pendingTeachers.map((teacher) => {
                    const isBusy = busyTeacherId === teacher.id;
                    return (
                      <TableRow key={teacher.id} className="border-b border-[#E5EAF2] last:border-b-0">
                        <TableCell className="px-5 py-3.5">
                          <div className="font-semibold text-[#172033]">{teacher.name}</div>
                          {teacher.designation && (
                            <div className="text-xs text-[#64748B]">{teacher.designation}</div>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-sm text-[#475569]">
                          {teacher.email}
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="inline-flex items-center rounded-md bg-[#F8FAFC] px-2 py-0.5 text-xs font-medium text-[#0B1B43] border border-[#E5EAF2]">
                            {teacher.branchName || data.admin.branchName}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-xs text-[#64748B] whitespace-nowrap">
                          {formatShortDate(teacher.createdAt)}
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleTeacherDecision(teacher.id, 'approve')}
                              className="h-8 rounded-lg bg-[#2864E8] px-3 text-xs font-semibold text-white hover:bg-[#1E50C8]"
                            >
                              <Check className="mr-1 h-3.5 w-3.5" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => handleTeacherDecision(teacher.id, 'deny')}
                              className="h-8 rounded-lg border-[#E5EAF2] bg-white px-3 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEF2F2] hover:border-[#FECACA]"
                            >
                              <X className="mr-1 h-3.5 w-3.5" />
                              Deny
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Grid: Users Overview & User Composition */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 rounded-xl border border-[#E5EAF2] bg-white shadow-[0_1px_2px_rgba(11,27,67,0.03)]">
          <CardHeader className="px-5 pt-5 pb-2">
            <CardTitle className="text-base font-semibold text-[#0B1B43]">
              Users Overview
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Cumulative monthly registrations for {data.admin.branchDisplayName} across the academic session.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <div className="w-full min-w-[540px]">
                <ChartContainer config={overviewChartConfig} className="min-h-[260px] w-full">
                  <LineChart
                    accessibilityLayer
                    data={data.monthlyStats}
                    margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EAF2" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                    <Line type="monotone" dataKey="totalUsers" stroke="#2864E8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalStudents" stroke="#0B1B43" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="newStudents" stroke="#0EA5E9" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="totalTeachers" stroke="#64748B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-xl border border-[#E5EAF2] bg-white shadow-[0_1px_2px_rgba(11,27,67,0.03)]">
          <CardHeader className="px-5 pt-5 pb-2">
            <CardTitle className="text-base font-semibold text-[#0B1B43]">
              User Composition
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Distribution of branch user statuses.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            {compositionData.length === 0 ? (
              <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#E5EAF2] bg-[#F8FAFC] p-6 text-center">
                <Users className="h-7 w-7 text-[#94A3B8] mb-2" />
                <p className="text-sm font-semibold text-[#172033]">No User Activity Yet</p>
                <p className="mt-1 text-xs text-[#64748B]">
                  Status distribution will appear once users register for {data.admin.branchDisplayName}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <ChartContainer config={compositionChartConfig} className="mx-auto aspect-square max-h-[210px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={compositionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={84}
                      strokeWidth={2}
                      stroke="#FFFFFF"
                    >
                      {compositionData.map((entry) => (
                        <Cell key={entry.key} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {compositionData.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between rounded-lg border border-[#E5EAF2] bg-[#F8FAFC] px-2.5 py-1.5"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] truncate">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="truncate">{entry.name}</span>
                      </span>
                      <span className="text-xs font-bold text-[#172033] tabular-nums ml-2">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Branch Recent Updates Section */}
      <Card className="rounded-xl border border-[#E5EAF2] bg-white shadow-[0_1px_2px_rgba(11,27,67,0.03)]">
        <CardHeader className="flex flex-col gap-2 border-b border-[#E5EAF2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-[#0B1B43]">
              Recent Updates
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-[#64748B]">
              Announcements and notices published for {data.admin.branchName}.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={openNewUpdateModal}
            className="h-9 rounded-lg bg-[#2864E8] px-3.5 text-xs font-semibold text-white hover:bg-[#1E50C8] shrink-0"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Branch Update
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          {data.updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E5EAF2] bg-[#F8FAFC] px-6 py-8 text-center">
              <Megaphone className="mb-2 h-6 w-6 text-[#94A3B8]" />
              <p className="text-sm font-semibold text-[#172033]">No Branch Updates Published</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Post an update to keep {data.admin.branchDisplayName} students and faculty informed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.updates.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-[#E5EAF2] bg-[#F8FAFC] p-4 sm:flex-row sm:items-start"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#172033]">{item.title}</h3>
                      <span className="text-[11px] font-medium text-[#94A3B8]">
                        {formatShortDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditUpdateModal(item)}
                      className="h-8 w-8 rounded-lg text-[#64748B] hover:bg-white hover:text-[#2864E8]"
                      aria-label="Edit branch update"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUpdate(item.id)}
                      className="h-8 w-8 rounded-lg text-[#64748B] hover:bg-white hover:text-[#B91C1C]"
                      aria-label="Delete branch update"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Branch Update Modal */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-xl border-[#E5EAF2] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#0B1B43]">
              {editingUpdate ? 'Edit Branch Update' : 'Add Branch Update'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B]">
              This announcement will be scoped strictly to {data.admin.branchName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUpdate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Title</label>
              <Input
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                placeholder="e.g., Unit Test Schedule Released"
                className="border-[#E5EAF2] text-[#172033]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Description</label>
              <Textarea
                rows={4}
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                placeholder="Write the announcement details..."
                className="border-[#E5EAF2] text-[#172033]"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpdateDialogOpen(false)}
                className="border-[#E5EAF2]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={savingUpdate}
                className="bg-[#2864E8] text-white hover:bg-[#1E50C8]"
              >
                {savingUpdate ? 'Saving...' : editingUpdate ? 'Save Changes' : 'Publish Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

