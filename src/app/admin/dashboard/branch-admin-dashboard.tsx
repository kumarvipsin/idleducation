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
  GraduationCap,
  Megaphone,
  MessageCircle,
  MoreVertical,
  PlusCircle,
  Presentation,
  RefreshCw,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
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
  icon: React.ReactNode;
  colors: string;
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
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20',
        href: '/admin/users',
      },
      {
        title: 'Total Students',
        value: s.totalStudents,
        icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20',
        href: '/admin/users',
      },
      {
        title: 'Total Teachers',
        value: s.totalTeachers,
        icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20',
        href: '/admin/teachers',
      },
      {
        title: 'Approved Students',
        value: s.approvedStudents,
        icon: <UserPlus className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-sky-100 to-sky-200 dark:from-sky-900/20 dark:to-sky-800/20',
        href: '/admin/users',
      },
      {
        title: 'Deny Users',
        value: s.deniedUsers,
        icon: <XCircle className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20',
      },
      {
        title: 'Free Demo',
        value: s.totalBookings,
        monthly: s.monthlyBookings,
        icon: <Presentation className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20',
        href: '/admin/demo',
      },
      {
        title: 'Contact Us',
        value: s.totalSubmissions,
        monthly: s.monthlySubmissions,
        icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-pink-100 to-pink-200 dark:from-pink-900/20 dark:to-pink-800/20',
        href: '/admin/messages',
      },
      {
        title: 'Recent Updates',
        value: s.totalUpdates,
        monthly: s.monthlyUpdates,
        icon: <Megaphone className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20',
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
        monthly: s.monthlyActiveUsers,
        icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-teal-100 to-teal-200 dark:from-teal-900/20 dark:to-teal-800/20',
        href: '/admin/users',
      },
      {
        title: 'Inactive Users',
        value: s.inactiveUsers,
        icon: <UserX className="h-4 w-4 text-muted-foreground" />,
        colors: 'from-slate-100 to-slate-200 dark:from-slate-900/20 dark:to-slate-800/20',
        href: '/admin/users',
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
        className={`h-full bg-gradient-to-br ${card.colors} animate-fade-in-up`}
        style={{ animationDelay: `${delayIndex * 0.05}s` }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          {card.icon}
        </CardHeader>
        <CardContent>
          <div
            data-testid={`stat-value-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            className="text-2xl font-bold"
          >
            {card.value}
          </div>
          {card.monthly !== undefined && (
            <p className="text-xs text-muted-foreground">+{card.monthly} this month</p>
          )}
        </CardContent>
      </Card>
    );

    if (card.href) {
      return (
        <Link key={card.title} href={card.href} className="block h-full focus:outline-none">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[118px] w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[118px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold">Unable to Load Branch Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {errorMsg || 'Your branch administrator session could not be verified.'}
            </p>
          </div>
          <Button variant="outline" onClick={() => loadDashboard(false)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary 8 Metric Cards (Exact Super Admin visual tiles & gradients) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {statCards.map((card, index) => renderStatCard(card, index))}
      </div>

      {/* User Status Cards (Exact Super Admin visual tiles & gradients) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStatusCards.map((card, index) => renderStatCard(card, statCards.length + index))}
      </div>

      {/* Pending Teacher Approvals Section (Matching Super Admin UserApproval UI) */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle>Pending Teacher Approvals</CardTitle>
            <CardDescription>
              Approve or deny new teacher registrations for {data.admin.branchDisplayName}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pendingTeachers.length > 0 ? (
                    data.pendingTeachers.map((teacher) => {
                      const isBusy = busyTeacherId === teacher.id;
                      return (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {teacher.name}
                          </TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              teacher
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              onClick={() => handleTeacherDecision(teacher.id, 'approve')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isBusy}
                              onClick={() => setSelectedTeacherToDeny(teacher)}
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
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
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
            <CardTitle>Users Overview</CardTitle>
            <CardDescription>
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
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
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
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
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
            <CardTitle>User Composition</CardTitle>
            <CardDescription>Distribution of various user statuses.</CardDescription>
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
                  <div className="text-2xl font-bold">
                    {compositionTotal.toLocaleString()}
                    <div className="text-sm font-normal text-muted-foreground">Total</div>
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
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>
                  Latest announcements for {data.admin.branchName}.
                </CardDescription>
              </div>
              <Button size="sm" onClick={openNewUpdateModal}>
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
                          <h3 className="font-semibold text-sm">{update.title}</h3>
                          <p className="text-xs text-muted-foreground">{update.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
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
                            <DropdownMenuItem onClick={() => openEditUpdateModal(update)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingUpdate(update)}>
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-12">No recent updates.</p>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deny the registration for{' '}
              <span className="font-semibold">{selectedTeacherToDeny?.name}</span> and remove their
              data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTeacherToDeny(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUpdate ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {editingUpdate
                ? 'Make changes to your post here. Click save when you are done.'
                : `Add a new update or announcement for ${data.admin.branchName}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch-update-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="branch-update-title"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., New Course Available"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch-update-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="branch-update-description"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter the details of the announcement."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={savingUpdate}>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post titled &ldquo;
              <span className="font-semibold">{deletingUpdate?.title}</span>&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUpdate(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteUpdate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
