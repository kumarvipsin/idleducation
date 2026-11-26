'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle,
  Edit,
  FileText,
  Megaphone,
  MoreVertical,
  PlusCircle,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
  ResponsiveContainer,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  type BranchPendingTeacher,
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
  totalUsers: {
    label: 'Total Users',
    color: 'hsl(var(--chart-1))',
  },
  totalStudents: {
    label: 'Total Students',
    color: 'hsl(var(--chart-2))',
  },
  newStudents: {
    label: 'New Students',
    color: 'hsl(var(--chart-3))',
  },
  trainedStudents: {
    label: 'Trained Students',
    color: 'hsl(var(--chart-4))',
  },
  totalTeachers: {
    label: 'Total Teachers',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const compositionChartConfig = {
  approvedStudents: {
    label: 'Approved Students',
    color: 'hsl(var(--chart-1))',
  },
  activeUsers: {
    label: 'Active Users',
    color: 'hsl(var(--chart-2))',
  },
  inactiveUsers: {
    label: 'Inactive Users',
    color: 'hsl(var(--chart-3))',
  },
  deniedUsers: {
    label: 'Denied Users',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const updateIconMap: { [key: string]: React.ReactNode } = {
  'New Course Announcement!': <Megaphone className="w-5 h-5 text-primary" />,
  'Algebra 101 Materials Updated': <FileText className="w-5 h-5 text-primary" />,
  'Upcoming Webinar': <Calendar className="w-5 h-5 text-primary" />,
  default: <Bell className="w-5 h-5 text-primary" />,
};

const getIconForTitle = (title: string) => {
  return updateIconMap[title] || updateIconMap.default;
};

function formatRelativeTime(iso?: string | null): string {
  if (!iso) return 'Just now';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return 'Just now';
  return formatDistanceToNow(dt, { addSuffix: true });
}

interface StatCardConfig {
  title: string;
  value: number;
  monthly?: number;
  colors: string;
  titleClass: string;
  valueClass: string;
  monthlyClass?: string;
  href?: string;
}

export function BranchAdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const branchScope =
    normalizedBranchId && normalizedBranchId !== 'all' ? normalizedBranchId : undefined;

  const [data, setData] = useState<BranchDashboardPayload | null>(null);
  const isBudhViharBranch = true;
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busyTeacherId, setBusyTeacherId] = useState<string | null>(null);
  const [selectedTeacherToDeny, setSelectedTeacherToDeny] = useState<BranchPendingTeacher | null>(null);
  const isMountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const queuedRefreshRef = useRef(false);

  // Branch updates create/edit/delete state
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<BranchUpdateItem | null>(null);
  const [deletingUpdate, setDeletingUpdate] = useState<BranchUpdateItem | null>(null);
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
      'enrollments',
      'studentEnquiries',
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
        title: decision === 'approve' ? 'Success' : 'Success',
        description: res.message,
      });
      await loadDashboard(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: res.message,
      });
    }
    setBusyTeacherId(null);
    if (decision === 'deny') {
      setSelectedTeacherToDeny(null);
    }
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
      toast({ title: 'Success', description: res.message });
      setUpdateDialogOpen(false);
      await loadDashboard(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: res.message,
      });
    }
    setSavingUpdate(false);
  };

  const handleConfirmDeleteUpdate = async () => {
    if (!deletingUpdate) return;
    const res = await deleteUpdate(deletingUpdate.id);
    if (res.success) {
      toast({ title: 'Success', description: res.message });
      await loadDashboard(true);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setDeletingUpdate(null);
  };

  const statCards: StatCardConfig[] = useMemo(() => {
    const s = data?.stats;
    if (!s) return [];
    return [
      {
        title: 'Total Users',
        value: s.totalUsers,
        colors: 'from-[#DCEBFF] via-[#E6F1FF] to-[#CEE3FF] border-[#B4D3FF] hover:border-[#8CB9FF] dark:from-blue-950/60 dark:via-blue-950/50 dark:to-blue-900/40 dark:border-blue-800/60',
        titleClass: 'text-[#173568] dark:text-blue-200',
        valueClass: 'text-[#0B224D] dark:text-white',
        href: '/admin/users',
      },
      {
        title: 'Total Students',
        value: s.totalStudents,
        colors: 'from-[#D3F8E2] via-[#E0FBEC] to-[#C2F4D8] border-[#9DEAC1] hover:border-[#76DCA7] dark:from-emerald-950/60 dark:via-emerald-950/50 dark:to-emerald-900/40 dark:border-emerald-800/60',
        titleClass: 'text-[#0F4C3A] dark:text-emerald-200',
        valueClass: 'text-[#06382A] dark:text-white',
        href: '/admin/users',
      },
      {
        title: 'Total Teachers',
        value: s.totalTeachers,
        colors: 'from-[#FFECC7] via-[#FFF2D6] to-[#FFE2AB] border-[#F9D082] hover:border-[#F2BD5B] dark:from-amber-950/60 dark:via-amber-950/50 dark:to-amber-900/40 dark:border-amber-800/60',
        titleClass: 'text-[#6B3B0A] dark:text-amber-200',
        valueClass: 'text-[#4B2604] dark:text-white',
        href: '/admin/teachers',
      },
      {
        title: 'Enroll Students',
        value: s.totalEnrollments ?? 0,
        monthly: s.monthlyEnrollments ?? 0,
        colors: 'from-[#FFE7D6] via-[#FFF0E6] to-[#FFD9BF] border-[#F8BF98] hover:border-[#F0A472] dark:from-orange-950/60 dark:via-orange-950/50 dark:to-orange-900/40 dark:border-orange-800/60',
        titleClass: 'text-[#7C2D12] dark:text-orange-200',
        valueClass: 'text-[#551B07] dark:text-white',
        monthlyClass: 'text-[#C2410C] dark:text-orange-300',
        href: '/admin/enrollments',
      },
      {
        title: 'Approved Students',
        value: s.approvedStudents,
        colors: 'from-[#D4F0FF] via-[#E2F5FF] to-[#C2E9FF] border-[#9CD9FA] hover:border-[#72C5F4] dark:from-sky-950/60 dark:via-sky-950/50 dark:to-sky-900/40 dark:border-sky-800/60',
        titleClass: 'text-[#0E4366] dark:text-sky-200',
        valueClass: 'text-[#072E4A] dark:text-white',
        href: '/admin/users',
      },
      {
        title: 'Active Users',
        value: s.activeUsers,
        monthly: s.monthlyActiveUsers,
        colors: 'from-[#CEF7F0] via-[#DCFBF6] to-[#B8F2E8] border-[#8EE5D6] hover:border-[#62D5C2] dark:from-teal-950/60 dark:via-teal-950/50 dark:to-teal-900/40 dark:border-teal-800/60',
        titleClass: 'text-[#0D4D4A] dark:text-teal-200',
        valueClass: 'text-[#063533] dark:text-white',
        monthlyClass: 'text-[#0F766E] dark:text-teal-300',
        href: '/admin/users',
      },
      {
        title: 'Inactive Users',
        value: s.inactiveUsers,
        colors: 'from-[#E2E8F2] via-[#EBF0F7] to-[#D6DFEC] border-[#C1CDDF] hover:border-[#A4B5CE] dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-900/80 dark:border-slate-700',
        titleClass: 'text-[#2D3E57] dark:text-slate-200',
        valueClass: 'text-[#17253B] dark:text-white',
        href: '/admin/users',
      },
      {
        title: 'Deny Users',
        value: s.deniedUsers,
        colors: 'from-[#FFDDE2] via-[#FFE6EA] to-[#FFCDD5] border-[#F9B4C0] hover:border-[#F291A3] dark:from-rose-950/60 dark:via-rose-950/50 dark:to-rose-900/40 dark:border-rose-800/60',
        titleClass: 'text-[#7A1C2E] dark:text-rose-200',
        valueClass: 'text-[#570E1E] dark:text-white',
      },
    ];
  }, [data]);

  const secondaryStatCards: StatCardConfig[] = useMemo(() => {
    const s = data?.stats;
    if (!s) return [];
    return [
      {
        title: 'Student Enquiries',
        value: s.totalEnquiries ?? 0,
        monthly: s.monthlyEnquiries ?? 0,
        colors: 'from-[#FCE0F3] via-[#FDEBF7] to-[#F8CEEA] border-[#F0B0DC] hover:border-[#E68ECA] dark:from-pink-950/60 dark:via-pink-950/50 dark:to-pink-900/40 dark:border-pink-800/60',
        titleClass: 'text-[#7A1958] dark:text-pink-200',
        valueClass: 'text-[#520B3A] dark:text-white',
        monthlyClass: 'text-[#B8257E] dark:text-pink-300',
        href: '/admin/enquiries',
      },
      {
        title: 'Free Demo',
        value: s.totalBookings,
        monthly: s.monthlyBookings,
        colors: 'from-[#DFE3FF] via-[#E8EBFF] to-[#D0D6FF] border-[#B4BFFA] hover:border-[#93A3F5] dark:from-indigo-950/60 dark:via-indigo-950/50 dark:to-indigo-900/40 dark:border-indigo-800/60',
        titleClass: 'text-[#232B74] dark:text-indigo-200',
        valueClass: 'text-[#151B54] dark:text-white',
        monthlyClass: 'text-[#3B49C4] dark:text-indigo-300',
        href: '/admin/demo',
      },
      {
        title: 'Recent Updates',
        value: s.totalUpdates,
        monthly: s.monthlyUpdates,
        colors: 'from-[#EBDFFF] via-[#F2E9FF] to-[#E0CEFF] border-[#CAAEFB] hover:border-[#B18BF6] dark:from-violet-950/60 dark:via-violet-950/50 dark:to-violet-900/40 dark:border-violet-800/60',
        titleClass: 'text-[#4A1D85] dark:text-violet-200',
        valueClass: 'text-[#310E61] dark:text-white',
        monthlyClass: 'text-[#6D28D9] dark:text-violet-300',
      },
    ];
  }, [data]);

  const compositionData = useMemo(() => {
    if (!data?.stats) return [];
    const { approvedStudents, activeUsers, inactiveUsers, deniedUsers } = data.stats;
    return [
      { name: 'approvedStudents', value: approvedStudents, fill: 'var(--color-approvedStudents)' },
      { name: 'activeUsers', value: activeUsers, fill: 'var(--color-activeUsers)' },
      { name: 'inactiveUsers', value: inactiveUsers, fill: 'var(--color-inactiveUsers)' },
      { name: 'deniedUsers', value: deniedUsers, fill: 'var(--color-deniedUsers)' },
    ];
  }, [data]);

  const compositionTotal = useMemo(() => {
    return compositionData.reduce((acc, curr) => acc + curr.value, 0);
  }, [compositionData]);

  const renderStatCard = (card: StatCardConfig, delayIndex: number) => {
    const inner = (
      <Card
        className={`flex h-full min-h-[110px] flex-col rounded-[14px] border bg-gradient-to-br bg-clip-padding ${card.colors} antialiased ring-1 ring-inset ring-white/45 dark:ring-white/10 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_-4px_rgba(15,23,42,0.06)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_10px_20px_-8px_rgba(15,23,42,0.10)] animate-fade-in-up`}
        style={{ animationDelay: `${delayIndex * 0.05}s` }}
      >
        <CardHeader className="space-y-0 px-5 pt-[18px] pb-1.5">
          <CardTitle
            style={{ wordSpacing: '0.03em' }}
            className={`text-[13.5px] font-bold tracking-[0.005em] leading-[1.3] ${card.titleClass}`}
          >
            {card.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-5 pb-[18px] pt-0">
          <div
            data-testid={`stat-value-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className={`text-[28px] sm:text-[30px] font-extrabold leading-[1.12] tracking-[-0.025em] tabular-nums ${card.valueClass}`}
          >
            {card.value}
          </div>
          {card.monthly !== undefined && (
            <p className={`mt-1.5 text-[11.5px] font-semibold tracking-[0.005em] leading-none opacity-90 ${card.monthlyClass || 'text-[#2864E8] dark:text-blue-300'}`}>
              +{card.monthly} this month
            </p>
          )}
        </CardContent>
      </Card>
    );

    if (card.href) {
      return (
        <Link
          key={card.title}
          href={card.href}
          className="block h-full rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
        >
          {inner}
        </Link>
      );
    }

    return (
      <div key={card.title} className="h-full">
        {inner}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[110px] w-full rounded-[14px]" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[110px] w-full rounded-[14px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <Card className={`p-6 ${isBudhViharBranch ? 'antialiased' : ''}`}>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2
              style={isBudhViharBranch ? { wordSpacing: '0.03em' } : undefined}
              className={
                isBudhViharBranch
                  ? 'text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100'
                  : 'text-base font-semibold'
              }
            >
              Unable to Load Branch Dashboard
            </h2>
            <p
              className={
                isBudhViharBranch
                  ? 'mt-1 text-[13px] font-medium tracking-[0.005em] text-[#475E82] dark:text-slate-400'
                  : 'mt-1 text-sm text-muted-foreground'
              }
            >
              {errorMsg || 'Your branch administrator session could not be verified.'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => loadDashboard(false)}
            className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const sectionTitleClass = isBudhViharBranch
    ? 'text-[18px] sm:text-[19px] font-extrabold tracking-[-0.015em] leading-snug text-[#173568] dark:text-slate-100'
    : undefined;
  const sectionTitleStyle = isBudhViharBranch ? { wordSpacing: '0.03em' } : undefined;
  const sectionDescClass = isBudhViharBranch
    ? 'text-[12.5px] sm:text-[13px] font-medium tracking-[0.005em] leading-snug text-[#475E82] dark:text-slate-400'
    : undefined;
  const tableHeadClass = isBudhViharBranch
    ? 'text-[12.5px] font-bold tracking-[0.01em] text-[#173568]/85 dark:text-slate-300'
    : undefined;

  return (
    <div className={isBudhViharBranch ? 'space-y-6 antialiased' : 'space-y-6'}>
      {/* KPI Metric Cards */}
      <div className="space-y-4">
        {/* Primary 8 Metric Cards (Exact Super Admin visual tiles & gradients) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {statCards.map((card, index) => renderStatCard(card, index))}
        </div>

        {/* Third Row Metric Card (Recent Updates) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {secondaryStatCards.map((card, index) => renderStatCard(card, statCards.length + index))}
        </div>
      </div>

      {/* Pending Teacher Approvals Section (Matching Super Admin UserApproval UI) */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
              Pending Teacher Approvals
            </CardTitle>
            <CardDescription className={sectionDescClass}>
              Approve or deny new teacher registrations for {data.admin.branchDisplayName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={sectionTitleStyle} className={tableHeadClass}>User Name</TableHead>
                    <TableHead style={sectionTitleStyle} className={tableHeadClass}>Email</TableHead>
                    <TableHead style={sectionTitleStyle} className={tableHeadClass}>Role</TableHead>
                    <TableHead style={sectionTitleStyle} className={`text-right ${tableHeadClass || ''}`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pendingTeachers.length > 0 ? (
                    data.pendingTeachers.map((teacher) => {
                      const isBusy = busyTeacherId === teacher.id;
                      return (
                        <TableRow key={teacher.id}>
                          <TableCell
                            className={
                              isBudhViharBranch
                                ? 'flex items-center gap-2 text-[13.5px] font-bold tracking-[0.005em] text-[#0B224D] dark:text-white'
                                : 'font-medium flex items-center gap-2'
                            }
                          >
                            <Briefcase className="h-4 w-4" />
                            {teacher.name}
                          </TableCell>
                          <TableCell
                            className={
                              isBudhViharBranch
                                ? 'text-[13px] font-medium tracking-[0.005em] text-[#334E75] dark:text-slate-300'
                                : undefined
                            }
                          >
                            {teacher.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                isBudhViharBranch
                                  ? 'capitalize text-[11.5px] font-bold tracking-[0.01em] text-[#173568] dark:text-slate-200'
                                  : 'capitalize'
                              }
                            >
                              teacher
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleTeacherDecision(teacher.id, 'approve')}
                              className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isBusy}
                              onClick={() => setSelectedTeacherToDeny(teacher)}
                              className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Deny
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className={
                          isBudhViharBranch
                            ? 'text-center text-[13px] font-semibold tracking-[0.005em] text-[#475E82] dark:text-slate-400'
                            : 'text-center text-muted-foreground'
                        }
                      >
                        No pending teachers.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid + Recent Updates (Matching Super Admin layout & gradients) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card
          className="lg:col-span-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <CardHeader>
            <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
              Users Overview
            </CardTitle>
            <CardDescription className={sectionDescClass}>
              Monthly statistics for user and student engagement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <div className="w-full min-w-[600px]">
                <ChartContainer config={overviewChartConfig} className="w-full h-[300px]">
                  <LineChart
                    data={data.monthlyStats}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border) / 0.5)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke={isBudhViharBranch ? '#334E75' : 'hsl(var(--muted-foreground))'}
                      fontSize={12}
                      fontWeight={isBudhViharBranch ? 600 : 400}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isBudhViharBranch ? '#334E75' : 'hsl(var(--muted-foreground))'}
                      fontSize={12}
                      fontWeight={isBudhViharBranch ? 600 : 400}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip
                      cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                      content={<ChartTooltipContent />}
                    />
                    <Legend
                      iconSize={12}
                      wrapperStyle={
                        isBudhViharBranch
                          ? { fontSize: '12px', fontWeight: 700, letterSpacing: '0.005em', paddingTop: '10px', color: '#173568' }
                          : { fontSize: '12px', paddingTop: '10px' }
                      }
                      verticalAlign="top"
                      align="right"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalUsers"
                      stroke="var(--color-totalUsers)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalStudents"
                      stroke="var(--color-totalStudents)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newStudents"
                      stroke="var(--color-newStudents)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="trainedStudents"
                      stroke="var(--color-trainedStudents)"
                      strokeWidth={2}
                      strokeDasharray="3 4 5 2"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalTeachers"
                      stroke="var(--color-totalTeachers)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card
          className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 animate-fade-in-up"
          style={{ animationDelay: '0.7s' }}
        >
          <CardHeader>
            <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
              User Composition
            </CardTitle>
            <CardDescription className={sectionDescClass}>
              Distribution of various user statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto aspect-square h-[250px] relative">
              <ChartContainer config={compositionChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={compositionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      {compositionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              {compositionTotal > 0 && (
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center text-center">
                  <div
                    className={
                      isBudhViharBranch
                        ? 'text-[28px] font-extrabold leading-[1.12] tracking-[-0.025em] tabular-nums text-[#0B224D] dark:text-white'
                        : 'text-2xl font-bold'
                    }
                  >
                    {compositionTotal.toLocaleString()}
                    <div
                      className={
                        isBudhViharBranch
                          ? 'mt-0.5 text-[12px] font-bold tracking-[0.01em] text-[#475E82] dark:text-slate-400'
                          : 'text-sm font-normal text-muted-foreground'
                      }
                    >
                      Total
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates (Matching Super Admin RecentUpdates UI) */}
        <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
                  Recent Updates
                </CardTitle>
                <CardDescription className={sectionDescClass}>
                  Latest announcements for {data.admin.branchName}.
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={openNewUpdateModal}
                className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-4">
                <div className="space-y-4">
                  {data.updates.length > 0 ? (
                    data.updates.map((update) => (
                      <div key={update.id} className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          {getIconForTitle(update.title)}
                        </div>
                        <div className="flex-1">
                          <h3
                            style={sectionTitleStyle}
                            className={
                              isBudhViharBranch
                                ? 'text-[13.5px] sm:text-[14px] font-bold tracking-[0.005em] leading-snug text-[#173568] dark:text-slate-100'
                                : 'font-semibold text-sm'
                            }
                          >
                            {update.title}
                          </h3>
                          <p
                            className={
                              isBudhViharBranch
                                ? 'mt-0.5 text-[12.5px] font-medium leading-relaxed text-[#334E75] dark:text-slate-300'
                                : 'text-xs text-muted-foreground'
                            }
                          >
                            {update.description}
                          </p>
                          <p
                            className={
                              isBudhViharBranch
                                ? 'mt-1 text-[11.5px] font-semibold tracking-[0.005em] leading-none text-[#2864E8]/85 dark:text-blue-300'
                                : 'text-xs text-muted-foreground mt-1'
                            }
                          >
                            {formatRelativeTime(update.createdAt)}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className={isBudhViharBranch ? 'text-xs font-semibold' : undefined}
                              onClick={() => openEditUpdateModal(update)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={isBudhViharBranch ? 'text-xs font-semibold' : undefined}
                              onClick={() => setDeletingUpdate(update)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  ) : (
                    <p
                      className={
                        isBudhViharBranch
                          ? 'py-12 text-center text-[13px] font-semibold tracking-[0.005em] text-[#475E82] dark:text-slate-400'
                          : 'text-center text-muted-foreground py-12'
                      }
                    >
                      No recent updates.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deny Teacher Confirmation Dialog */}
      <AlertDialog
        open={Boolean(selectedTeacherToDeny)}
        onOpenChange={(open) => {
          if (!open) setSelectedTeacherToDeny(null);
        }}
      >
        <AlertDialogContent className={isBudhViharBranch ? 'antialiased' : undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle
              style={sectionTitleStyle}
              className={
                isBudhViharBranch
                  ? 'text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100'
                  : undefined
              }
            >
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className={sectionDescClass}>
              This action will deny the registration for{' '}
              <span className="font-bold text-[#0B224D] dark:text-white">{selectedTeacherToDeny?.name}</span> and remove their
              data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
              onClick={() => setSelectedTeacherToDeny(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
              onClick={() => {
                if (selectedTeacherToDeny) {
                  void handleTeacherDecision(selectedTeacherToDeny.id, 'deny');
                }
              }}
            >
              Deny
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Branch Update Create / Edit Modal */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className={`sm:max-w-[425px] ${isBudhViharBranch ? 'antialiased' : ''}`}>
          <DialogHeader>
            <DialogTitle
              style={sectionTitleStyle}
              className={
                isBudhViharBranch
                  ? 'text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100'
                  : undefined
              }
            >
              {editingUpdate ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
            <DialogDescription className={sectionDescClass}>
              {editingUpdate
                ? 'Make changes to your post here. Click save when you are done.'
                : `Add a new update or announcement for ${data.admin.branchName}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="branch-update-title"
                  className={
                    isBudhViharBranch
                      ? 'text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200'
                      : 'text-right'
                  }
                >
                  Title
                </Label>
                <Input
                  id="branch-update-title"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className={`col-span-3 ${isBudhViharBranch ? 'text-[13px] font-medium' : ''}`}
                  placeholder="e.g., New Course Available"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="branch-update-description"
                  className={
                    isBudhViharBranch
                      ? 'text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200'
                      : 'text-right'
                  }
                >
                  Description
                </Label>
                <Textarea
                  id="branch-update-description"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  className={`col-span-3 ${isBudhViharBranch ? 'text-[13px] font-medium' : ''}`}
                  placeholder="Enter the details of the announcement."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={savingUpdate}
                className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
              >
                {savingUpdate
                  ? editingUpdate
                    ? 'Saving...'
                    : 'Posting...'
                  : editingUpdate
                    ? 'Save Changes'
                    : 'Post Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Branch Update Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deletingUpdate)}
        onOpenChange={(open) => {
          if (!open) setDeletingUpdate(null);
        }}
      >
        <AlertDialogContent className={isBudhViharBranch ? 'antialiased' : undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle
              style={sectionTitleStyle}
              className={
                isBudhViharBranch
                  ? 'text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100'
                  : undefined
              }
            >
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className={sectionDescClass}>
              This action cannot be undone. This will permanently delete the post titled &ldquo;
              <span className="font-bold text-[#0B224D] dark:text-white">{deletingUpdate?.title}</span>&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className={isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : undefined}
              onClick={() => setDeletingUpdate(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteUpdate}
              className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${isBudhViharBranch ? 'text-xs font-bold tracking-[0.01em]' : ''}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
