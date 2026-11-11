'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { 
  getEnrollments, 
  updateEnrollmentStatus, 
  deleteEnrollment 
} from '@/app/actions/enrollment';
import { type EnrollmentRecord } from '@/types/enrollment';
import { normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Building2, 
  Laptop, 
  Users, 
  Search, 
  Download, 
  RefreshCw, 
  Phone, 
  Mail, 
  MessageCircle, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Filter,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';

const BRANCH_TABS = [
  { key: 'all', label: 'All IDL Centres (Main View)', slugMatch: null },
  { key: 'mangolpuri', label: 'Mangol Puri Branch', slugMatch: 'mangol' },
  { key: 'budh-vihar', label: 'Budh Vihar Branch', slugMatch: 'budh' },
  { key: 'krishan-vihar', label: 'Krishan Vihar Branch', slugMatch: 'krishan' },
  { key: 'mukherjee-nagar', label: 'Mukherjee Nagar Branch', slugMatch: 'mukherjee' },
  { key: 'rohini', label: 'Rohini Branch', slugMatch: 'rohini' },
  { key: 'online', label: 'Online / Digital Campus', slugMatch: 'online' },
];

export default function AdminEnrollmentsPage() {
  const { user } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminKey = isBranchAdmin ? normalizedBranchId : null;

  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(branchAdminKey || 'all');

  useEffect(() => {
    if (isBranchAdmin && branchAdminKey && activeTab !== branchAdminKey) {
      setActiveTab(branchAdminKey);
    }
  }, [isBranchAdmin, branchAdminKey]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEnrollmentsData = async () => {
    setLoading(true);
    try {
      const res = await getEnrollments(isBranchAdmin && branchAdminKey ? branchAdminKey : undefined);
      if (res.success && res.data) {
        setEnrollments(res.data as EnrollmentRecord[]);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message || 'Failed to fetch enrollments' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEnrollmentsData();
    }
  }, [user?.uid, branchAdminKey]);

  // Compute counts per branch tab
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { all: enrollments.length };
    BRANCH_TABS.forEach(tab => {
      if (tab.key === 'all') return;
      const count = enrollments.filter(e => {
        const branchStr = (e.branch || '').toLowerCase();
        const slugStr = (e.branchSlug || '').toLowerCase();
        const match = tab.slugMatch || '';
        return branchStr.includes(match) || slugStr.includes(match);
      }).length;
      counts[tab.key] = count;
    });
    return counts;
  }, [enrollments]);

  // Filtered enrollments based on active tab, search term, mode, status
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(item => {
      // 1. Branch Tab
      if (isBranchAdmin && branchAdminKey) {
        if (!recordMatchesBranch(item, branchAdminKey)) {
          return false;
        }
      } else if (activeTab !== 'all') {
        const currentTabConfig = BRANCH_TABS.find(t => t.key === activeTab);
        const match = currentTabConfig?.slugMatch || '';
        const branchStr = (item.branch || '').toLowerCase();
        const slugStr = (item.branchSlug || '').toLowerCase();
        if (!branchStr.includes(match) && !slugStr.includes(match)) {
          return false;
        }
      }

      // 2. Search Term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = (item.studentName || '').toLowerCase().includes(query);
        const matchesFather = (item.fatherName || '').toLowerCase().includes(query);
        const matchesMobile = (item.mobile || '').includes(query);
        const matchesCourse = (item.course || '').toLowerCase().includes(query);
        const matchesClass = (item.classLevel || '').toLowerCase().includes(query);
        if (!matchesName && !matchesFather && !matchesMobile && !matchesCourse && !matchesClass) {
          return false;
        }
      }

      // 3. Mode Filter
      if (selectedMode !== 'all' && item.mode !== selectedMode) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'all' && (item.status || 'new') !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [enrollments, activeTab, searchTerm, selectedMode, selectedStatus]);

  // Overall Statistics for currently selected branch view
  const stats = useMemo(() => {
    const total = filteredEnrollments.length;
    const offline = filteredEnrollments.filter(e => e.mode === 'Offline').length;
    const online = filteredEnrollments.filter(e => e.mode === 'Online').length;
    const hybrid = filteredEnrollments.filter(e => e.mode === 'Hybrid').length;
    const newCount = filteredEnrollments.filter(e => !e.status || e.status === 'new').length;
    return { total, offline, online, hybrid, newCount };
  }, [filteredEnrollments]);

  // Status Updater
  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateEnrollmentStatus(id, newStatus);
    if (res.success) {
      toast({ title: 'Status Updated', description: res.message });
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      if (selectedEnrollment && selectedEnrollment.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, status: newStatus as any });
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enrollment record?')) return;
    setIsDeleting(id);
    const res = await deleteEnrollment(id);
    if (res.success) {
      toast({ title: 'Deleted', description: 'Enrollment deleted successfully.' });
      setEnrollments(prev => prev.filter(e => e.id !== id));
      if (selectedEnrollment?.id === id) {
        setIsDetailOpen(false);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setIsDeleting(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredEnrollments.length === 0) {
      toast({ title: 'No Data', description: 'No enrollments to export.' });
      return;
    }
    const headers = [
      'Student Name',
      'Father Name',
      'Mobile',
      'Email',
      'Learning Mode',
      'Branch',
      'Class',
      'Course',
      'Previous School',
      'Status',
      'Source',
      'Created At'
    ];
    const rows = filteredEnrollments.map(e => [
      `"${e.studentName || ''}"`,
      `"${e.fatherName || ''}"`,
      `"${e.mobile || ''}"`,
      `"${e.email || ''}"`,
      `"${e.mode || ''}"`,
      `"${e.branch || ''}"`,
      `"${e.classLevel || ''}"`,
      `"${e.course || ''}"`,
      `"${e.previousSchool || ''}"`,
      `"${e.status || 'new'}"`,
      `"${e.source || 'Website'}"`,
      `"${e.createdAt || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IDL_Enrollments_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Successful', description: 'CSV file downloaded.' });
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-wide uppercase mb-1">
            <UserCheck className="w-3.5 h-3.5 text-[#2864E8]" />
            <span>Admissions Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Student Enrollments Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Collect, track, and manage student enrollments grouped by individual branch or across the entire IDL Education network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEnrollmentsData}
            disabled={loading}
            className="gap-1.5 rounded-[5px]"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            <span>Refresh</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="gap-1.5 rounded-[5px]"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Branch Tabs (Grouped by Branch Name + Main IDL Website) */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-center gap-1.5 pb-2">
            {(isBranchAdmin ? BRANCH_TABS.filter(t => t.key === branchAdminKey) : BRANCH_TABS).map((tab) => {
              const isActive = activeTab === tab.key;
              const count = branchCounts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer",
                    isActive
                      ? "bg-[#2864E8] text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70"
                  )}
                >
                  <Building2 className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-slate-400")} />
                  <span>{tab.label}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <Card className="rounded-xl border shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Enrolled</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              {loading ? <Skeleton className="h-7 w-12" /> : stats.total}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Offline
            </span>
            <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
              {loading ? <Skeleton className="h-7 w-12" /> : stats.offline}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block flex items-center gap-1">
              <Laptop className="w-3 h-3" /> Online
            </span>
            <span className="text-2xl font-extrabold text-purple-700 mt-1 block">
              {loading ? <Skeleton className="h-7 w-12" /> : stats.online}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block flex items-center gap-1">
              <Users className="w-3 h-3" /> Hybrid
            </span>
            <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
              {loading ? <Skeleton className="h-7 w-12" /> : stats.hybrid}
            </span>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-xs col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> New / Pending
            </span>
            <span className="text-2xl font-extrabold text-rose-700 mt-1 block">
              {loading ? <Skeleton className="h-7 w-12" /> : stats.newCount}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by student name, father name, mobile, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs sm:text-sm rounded-[5px]"
          />
        </div>

        {/* Mode Filter */}
        <Select value={selectedMode} onValueChange={setSelectedMode}>
          <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs rounded-[5px]">
            <SelectValue placeholder="All Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs rounded-[5px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="enrolled">Enrolled</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Main Table */}
      <Card className="rounded-xl border shadow-xs overflow-hidden">
        <CardHeader className="py-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                {BRANCH_TABS.find(t => t.key === activeTab)?.label}
              </CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredEnrollments.length} enrollments in this view
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[850px]">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
                  <TableRow>
                    <TableHead className="w-[180px] font-bold text-xs">Student & Father</TableHead>
                    <TableHead className="w-[140px] font-bold text-xs">Contact</TableHead>
                    <TableHead className="w-[100px] font-bold text-xs">Mode</TableHead>
                    <TableHead className="w-[160px] font-bold text-xs">Branch</TableHead>
                    <TableHead className="w-[160px] font-bold text-xs">Class & Course</TableHead>
                    <TableHead className="w-[110px] font-bold text-xs">Date & Source</TableHead>
                    <TableHead className="w-[130px] font-bold text-xs">Status</TableHead>
                    <TableHead className="w-[100px] font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20 mt-1" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-3 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-44 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Users className="w-10 h-10 stroke-[1.2] mb-2" />
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No enrollments found</p>
                          <p className="text-xs text-slate-400 mt-0.5">Try switching the branch tab or clearing search filters.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                        
                        {/* Student & Father */}
                        <TableCell>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {item.studentName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>S/O, D/O:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{item.fatherName}</span>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                              +91 {item.mobile}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <a 
                              href={`tel:${item.mobile}`} 
                              title="Call Student"
                              className="w-5 h-5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a 
                              href={`https://wa.me/91${item.mobile}?text=${encodeURIComponent(`Hello ${item.studentName}, greeting from IDL Education. We received your enrollment request.`)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                            {item.email && (
                              <a 
                                href={`mailto:${item.email}`}
                                title={item.email}
                                className="w-5 h-5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                              >
                                <Mail className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </TableCell>

                        {/* Mode */}
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider py-0.5",
                              item.mode === 'Offline' && "border-blue-300 bg-blue-50 text-blue-700",
                              item.mode === 'Online' && "border-purple-300 bg-purple-50 text-purple-700",
                              item.mode === 'Hybrid' && "border-amber-300 bg-amber-50 text-amber-700"
                            )}
                          >
                            {item.mode}
                          </Badge>
                        </TableCell>

                        {/* Branch */}
                        <TableCell>
                          <div className="flex items-start gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[150px] truncate" title={item.branch}>
                            <MapPin className="w-3 h-3 text-[#2864E8] shrink-0 mt-0.5" />
                            <span className="truncate">{item.branch}</span>
                          </div>
                        </TableCell>

                        {/* Class & Course */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {item.classLevel}
                            </span>
                            {item.programTitle && (
                              <span className="text-[9.5px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                                {item.programTitle}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate max-w-[180px] mt-0.5" title={item.course}>
                            {item.course}
                          </div>
                          {item.subjects && item.subjects.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              {item.subjects.map((sub, sIdx) => (
                                <span key={sIdx} className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        {/* Date & Source */}
                        <TableCell>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                            {item.createdAt ? (
                              typeof item.createdAt === 'string' && item.createdAt.includes('T')
                                ? format(new Date(item.createdAt), 'dd MMM yyyy')
                                : 'Recent'
                            ) : 'Recent'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[100px]" title={item.source}>
                            {item.source || 'Website'}
                          </div>
                        </TableCell>

                        {/* Status Dropdown */}
                        <TableCell>
                          <Select 
                            value={item.status || 'new'} 
                            onValueChange={(val) => handleStatusChange(item.id, val)}
                          >
                            <SelectTrigger className={cn(
                              "h-7 text-[11px] font-semibold rounded-[4px]",
                              (!item.status || item.status === 'new') && "bg-rose-50 text-rose-700 border-rose-200",
                              item.status === 'contacted' && "bg-blue-50 text-blue-700 border-blue-200",
                              item.status === 'enrolled' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                              item.status === 'follow-up' && "bg-amber-50 text-amber-700 border-amber-200",
                              item.status === 'closed' && "bg-slate-100 text-slate-600 border-slate-200"
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="text-xs z-[130]">
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="enrolled">Enrolled</SelectItem>
                              <SelectItem value="follow-up">Follow-up</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                setSelectedEnrollment(item);
                                setIsDetailOpen(true);
                              }}
                              title="View Full Profile"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600 hover:text-blue-600" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeleting === item.id}
                              className="h-7 w-7 p-0 hover:bg-rose-50"
                              onClick={() => handleDelete(item.id)}
                              title="Delete Enrollment"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-[500px] rounded-2xl p-6 z-[140]">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50">
                {selectedEnrollment?.mode} Mode
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-700 bg-slate-50">
                Status: {selectedEnrollment?.status || 'new'}
              </Badge>
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 mt-1">
              {selectedEnrollment?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submitted via {selectedEnrollment?.source || 'Website'}
            </DialogDescription>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="space-y-3.5 text-xs text-slate-700 py-3">
              
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Father / Guardian:</span>
                  <span className="font-bold text-slate-900">{selectedEnrollment.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mobile Phone:</span>
                  <span className="font-bold text-slate-900">+91 {selectedEnrollment.mobile}</span>
                </div>
                {selectedEnrollment.email && (
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium block">Email:</span>
                    <span className="font-medium text-slate-900">{selectedEnrollment.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                {selectedEnrollment.programTitle && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Academic Program:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 text-right">
                      {selectedEnrollment.programTitle}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Branch / Center:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedEnrollment.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Class / Grade:</span>
                  <span className="font-bold text-blue-700">{selectedEnrollment.classLevel}</span>
                </div>
                {selectedEnrollment.subjects && selectedEnrollment.subjects.length > 0 && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-400 font-medium">Selected Subjects:</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[240px]">
                      {selectedEnrollment.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="font-bold text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Target Course:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[240px]">{selectedEnrollment.course}</span>
                </div>
                {selectedEnrollment.previousSchool && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Current School:</span>
                    <span className="font-medium text-slate-900">{selectedEnrollment.previousSchool}</span>
                  </div>
                )}
              </div>

              {/* Quick Communication CTA */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${selectedEnrollment.mobile}`}
                  className="h-9 px-3 rounded-[5px] bg-[#2864E8] text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1E4ED8]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Mobile</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedEnrollment.mobile}?text=${encodeURIComponent(`Hello ${selectedEnrollment.studentName}, greeting from IDL Education. We received your enrollment request.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-[5px] bg-emerald-600 text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-700"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)} className="rounded-[5px]">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
