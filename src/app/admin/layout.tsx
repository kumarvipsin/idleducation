
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuAccordion,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { BookOpen, LayoutDashboard, User, LogOut, Users, Shield, Settings, Database, SlidersHorizontal, ShoppingCart, Settings2, File, CreditCard, GraduationCap, Briefcase, MessageSquare, Mail, Presentation, Bell, FileText, MessageCircle as FeedbackIcon, Award, LifeBuoy, Video, Star, Image as ImageIcon, Tags, ChevronDown, BookCheck, UserCircle, HandHeart, IndianRupee, Menu, Home, Layers, Heart, DollarSign, Activity, ClipboardList, CalendarDays, BookMarked, Clock, AlertTriangle, PhoneCall, Share2, Bot, Building2, Radio, CalendarCheck, BarChart3, History } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GcsImage } from '@/components/gcs-image';
import React from 'react';
import { getNewSessionBookingsCount } from '@/app/actions';
import { getBranchDisplayName, normalizeBranchId } from '@/lib/branch-utils';
import { Header } from '@/components/header';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookingCount, setBookingCount] = React.useState(0);

  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const isBudhViharBranch =
    normalizedBranchId === 'budh-vihar' ||
    normalizedBranchId === 'krishan-vihar' ||
    normalizedBranchId === 'mangolpuri';
  const branchName = isBranchAdmin
    ? (user?.branchName || getBranchDisplayName(normalizedBranchId, true))
    : '';
  const sidebarBranchName = isBranchAdmin
    ? normalizedBranchId === 'mangolpuri'
      ? 'Mangolpuri'
      : (getBranchDisplayName(normalizedBranchId, false) || user?.branchName || '')
        .replace(/\s*\bbranch\b\s*/gi, '')
        .trim()
    : '';

  const branchAllowedPrefixes = [
    '/admin/dashboard',
    '/admin/attendance',
    '/admin/fees',
    '/admin/enrollments',
    '/admin/admissions',
    '/admin/enquiries',
    '/admin/scholarship',
    '/admin/profile',
    '/admin/users',
    '/admin/teachers',
    '/admin/demo',
    '/admin/messages',
    '/admin/blog',
    '/admin/updates',
  ];
  const isBranchRouteAllowed =
    !isBranchAdmin ||
    !pathname ||
    branchAllowedPrefixes.some(prefix => pathname.startsWith(prefix));

  React.useEffect(() => {
    if (isBranchAdmin && !isBranchRouteAllowed) {
      router.replace('/admin/dashboard');
    }
  }, [isBranchAdmin, isBranchRouteAllowed, router]);

  React.useEffect(() => {
    const fetchBookingsCount = async () => {
      const result = await getNewSessionBookingsCount(
        isBranchAdmin ? normalizedBranchId || undefined : undefined
      );
      if (result.success) {
        setBookingCount(result.count || 0);
      }
    };
    fetchBookingsCount();
  }, [pathname, isBranchAdmin, normalizedBranchId]); // Refetch on path or branch context change


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isFeesPage = Boolean(pathname?.startsWith('/admin/fees'));
  const isAttendancePage = Boolean(pathname?.startsWith('/admin/attendance'));
  const isProfileActive = Boolean(pathname?.startsWith('/admin/profile'));
  const isBranchUsersPage = Boolean(
    pathname?.startsWith('/admin/teachers') || pathname?.startsWith('/admin/users')
  );
  const isBranchRecordsPage = Boolean(
    pathname?.startsWith('/admin/enrollments') ||
    pathname?.startsWith('/admin/admissions') ||
    pathname?.startsWith('/admin/demo') ||
    pathname?.startsWith('/admin/enquiries') ||
    pathname?.startsWith('/admin/scholarship')
  );
  const isBranchUpdatesBlogPage = Boolean(
    pathname?.startsWith('/admin/blog') || pathname?.startsWith('/admin/updates')
  );
  const isSuperUserMgmtActive = Boolean(
    pathname?.startsWith('/admin/admins') ||
    pathname?.startsWith('/admin/users') ||
    pathname?.startsWith('/admin/teachers') ||
    pathname?.startsWith('/admin/access-logs')
  );
  const isSuperSubmissionsActive = Boolean(
    pathname?.startsWith('/admin/enrollments') ||
    pathname?.startsWith('/admin/admissions') ||
    pathname?.startsWith('/admin/demo') ||
    pathname?.startsWith('/admin/scholarship') ||
    pathname?.startsWith('/admin/enquiries') ||
    pathname?.startsWith('/admin/feedback') ||
    pathname?.startsWith('/admin/messages') ||
    pathname?.startsWith('/admin/support-tickets')
  );
  const isSuperCourseContentActive = Boolean(
    pathname?.startsWith('/admin/free-courses') ||
    pathname?.startsWith('/admin/paid-courses') ||
    pathname?.startsWith('/admin/study-resources') ||
    pathname?.startsWith('/admin/previous-year-questions') ||
    pathname?.startsWith('/admin/testimonials') ||
    pathname?.startsWith('/admin/expert-teachers') ||
    pathname?.startsWith('/admin/topper-testimonials')
  );
  const isSuperSiteMgmtActive = Boolean(
    pathname?.startsWith('/admin/hero-slides') ||
    pathname?.startsWith('/admin/blog') ||
    pathname?.startsWith('/admin/gallery') ||
    pathname?.startsWith('/admin/updates') ||
    pathname?.startsWith('/admin/excellence-results') ||
    pathname?.startsWith('/admin/social-media') ||
    pathname?.startsWith('/admin/ai-knowledge')
  );
  const isSuperStoreMgmtActive = Boolean(
    pathname?.startsWith('/admin/store-customers') ||
    pathname?.startsWith('/admin/store-orders')
  );
  const isSuperFoundationActive = Boolean(
    pathname?.startsWith('/admin/volunteer-applications') ||
    pathname?.startsWith('/admin/donations')
  );
  const [accordionValue, setAccordionValue] = React.useState<string>(
    isFeesPage
      ? 'fee-management'
      : isAttendancePage
        ? 'attendance'
        : isSuperUserMgmtActive
          ? 'user-management'
          : isSuperSubmissionsActive
            ? 'submissions'
            : isSuperCourseContentActive
              ? 'course-content'
              : isSuperSiteMgmtActive
                ? 'site-management'
                : isSuperStoreMgmtActive
                  ? 'store-management'
                  : isSuperFoundationActive
                    ? 'idl-foundation'
                    : ''
  );
  const [openBranchGroup, setOpenBranchGroup] = React.useState<
    'attendance' | 'users' | 'records' | 'updates-blog' | null
  >(
    isAttendancePage
      ? 'attendance'
      : isBranchUsersPage
        ? 'users'
        : isBranchRecordsPage
          ? 'records'
          : isBranchUpdatesBlogPage
            ? 'updates-blog'
            : null
  );

  React.useEffect(() => {
    if (isFeesPage) {
      setAccordionValue('fee-management');
    } else if (isAttendancePage) {
      setAccordionValue('attendance');
      setOpenBranchGroup('attendance');
    } else if (isSuperUserMgmtActive) {
      setAccordionValue('user-management');
    } else if (isSuperSubmissionsActive) {
      setAccordionValue('submissions');
    } else if (isSuperCourseContentActive) {
      setAccordionValue('course-content');
    } else if (isSuperSiteMgmtActive) {
      setAccordionValue('site-management');
    } else if (isSuperStoreMgmtActive) {
      setAccordionValue('store-management');
    } else if (isSuperFoundationActive) {
      setAccordionValue('idl-foundation');
    }

    if (isBranchUsersPage) {
      setOpenBranchGroup('users');
    } else if (isBranchRecordsPage) {
      setOpenBranchGroup('records');
    } else if (isBranchUpdatesBlogPage) {
      setOpenBranchGroup('updates-blog');
    }
  }, [
    isFeesPage,
    isAttendancePage,
    isSuperUserMgmtActive,
    isSuperSubmissionsActive,
    isSuperCourseContentActive,
    isSuperSiteMgmtActive,
    isSuperStoreMgmtActive,
    isSuperFoundationActive,
    isBranchUsersPage,
    isBranchRecordsPage,
    isBranchUpdatesBlogPage,
  ]);

  const usePolishedSidebar = isBudhViharBranch || !isBranchAdmin;
  const superNavLinkClass =
    "relative h-auto gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] font-bold tracking-[0.005em] [word-spacing:0.03em] text-[#173568] transition-all duration-150 hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] active:bg-[#DCE7F9] active:text-[#1D4ED8] data-[active=true]:bg-[#E8F0FE] data-[active=true]:text-[#1D4ED8] data-[active=true]:font-bold data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-[#C7DBFC] data-[active=true]:shadow-[0_1px_2px_rgba(23,53,104,0.06)] data-[active=true]:hover:bg-[#E1ECFE] data-[active=true]:hover:text-[#1D4ED8] data-[active=true]:[&_svg]:text-[#2864E8] data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-[#2864E8]";
  const superSubNavLinkClass =
    "relative h-7 gap-2 rounded-lg px-2.5 text-[12px] font-semibold tracking-[0.005em] [word-spacing:0.02em] text-[#334E75] transition-all duration-150 hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] active:bg-[#DCE7F9] active:text-[#1D4ED8] data-[active=true]:bg-[#E8F0FE] data-[active=true]:text-[#1D4ED8] data-[active=true]:font-bold data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-[#C7DBFC]/90 data-[active=true]:shadow-[0_1px_2px_rgba(23,53,104,0.04)] data-[active=true]:hover:bg-[#E1ECFE] data-[active=true]:hover:text-[#1D4ED8] data-[active=true]:[&_svg]:text-[#2864E8] [&>svg]:size-3.5";

  return (
    <>
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100svh-68px)] w-full bg-[#F8FAFC] dark:bg-slate-950">
          <Sidebar className={`md:top-[68px] md:h-[calc(100svh-68px)]${usePolishedSidebar ? ' antialiased' : ''}`}>
            <SidebarHeader className="pt-[76px] md:pt-2 px-2 pb-0">
              <Link
                href="/admin/profile"
                data-testid={isBranchAdmin ? "branch-sidebar-profile-card" : "super-sidebar-profile-card"}
                data-active={isProfileActive}
                className={
                  usePolishedSidebar
                    ? isProfileActive
                      ? "relative overflow-hidden group flex items-center gap-2.5 rounded-lg bg-[#E8F0FE] p-2 text-left text-sm ring-1 ring-inset ring-[#C7DBFC] shadow-[0_1px_2px_rgba(23,53,104,0.06)] transition-all duration-150 hover:bg-[#E1ECFE] before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-full before:bg-[#2864E8]"
                      : "group flex items-center gap-2.5 rounded-lg bg-transparent p-2 text-left text-sm transition-all duration-150 hover:bg-[#E8EEF7]/75"
                    : isProfileActive
                      ? "group flex items-center gap-2 rounded-md bg-sidebar-primary p-2 text-left text-sm font-medium text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                      : "group flex items-center gap-2 rounded-md bg-transparent p-2 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              >
                <Avatar className="h-10 w-10 shrink-0 overflow-hidden">
                  {user?.photoURL ? (
                    <GcsImage
                      filePath={user.photoURL}
                      alt={user?.name ?? (isBranchAdmin ? 'Branch Admin' : 'Super Admin')}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback
                      className={
                        usePolishedSidebar
                          ? isProfileActive
                            ? "bg-white text-[#1D4ED8] font-extrabold ring-1 ring-[#C7DBFC]"
                            : "bg-muted text-[#173568] font-extrabold"
                          : isProfileActive
                            ? "bg-white text-[#0B1B43] font-semibold"
                            : "bg-muted text-[#0B1B43] font-semibold"
                      }
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span
                    className={
                      usePolishedSidebar
                        ? isProfileActive
                          ? "text-[14px] font-extrabold tracking-[-0.01em] leading-snug text-[#1D4ED8] truncate"
                          : "text-[14px] font-extrabold tracking-[-0.01em] leading-snug text-[#0B224D] truncate"
                        : isProfileActive
                          ? "font-semibold text-white truncate"
                          : "font-semibold text-[#0B1B43] truncate"
                    }
                  >
                    {user?.name || (isBranchAdmin ? 'Branch Admin' : 'Super Admin')}
                  </span>
                  <span
                    className={
                      usePolishedSidebar
                        ? isProfileActive
                          ? "text-[11.5px] font-semibold tracking-[0.005em] leading-snug text-[#3B62A8]"
                          : "text-[11.5px] font-semibold tracking-[0.005em] leading-snug text-[#475E82]"
                        : isProfileActive
                          ? "text-xs text-blue-100/90"
                          : "text-xs text-muted-foreground"
                    }
                  >
                    {isBranchAdmin ? 'Branch Admin' : 'Super Admin'}
                  </span>
                </div>
              </Link>
              <div className="mt-1.5 border-b border-sidebar-border" />
            </SidebarHeader>
            <SidebarContent className="px-2 py-2">
              <SidebarMenu>
                {isBranchAdmin ? (() => {
                  const branchNavLinkClass = isBudhViharBranch
                    ? "relative h-auto rounded-lg px-2.5 py-2 text-left text-[13.5px] font-bold tracking-[0.005em] [word-spacing:0.03em] text-[#173568] transition-all duration-150 hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] active:bg-[#DCE7F9] active:text-[#1D4ED8] data-[active=true]:bg-[#E8F0FE] data-[active=true]:text-[#1D4ED8] data-[active=true]:font-bold data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-[#C7DBFC] data-[active=true]:shadow-[0_1px_2px_rgba(23,53,104,0.06)] data-[active=true]:hover:bg-[#E1ECFE] data-[active=true]:hover:text-[#1D4ED8] data-[active=true]:[&_svg]:text-[#2864E8] data-[active=true]:before:content-[''] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1.5 data-[active=true]:before:bottom-1.5 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-[#2864E8]"
                    : "h-auto rounded-md p-2 text-left text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground transition-colors";
                  const branchSubNavLinkClass = isBudhViharBranch
                    ? "relative h-7 rounded-lg px-2.5 text-[12px] font-semibold tracking-[0.005em] [word-spacing:0.02em] text-[#334E75] transition-all duration-150 hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] active:bg-[#DCE7F9] active:text-[#1D4ED8] data-[active=true]:bg-[#E8F0FE] data-[active=true]:text-[#1D4ED8] data-[active=true]:font-bold data-[active=true]:ring-1 data-[active=true]:ring-inset data-[active=true]:ring-[#C7DBFC]/90 data-[active=true]:shadow-[0_1px_2px_rgba(23,53,104,0.04)] data-[active=true]:hover:bg-[#E1ECFE] data-[active=true]:hover:text-[#1D4ED8] data-[active=true]:[&_svg]:text-[#2864E8]"
                    : "h-7 rounded-md px-2 text-xs font-normal text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground transition-colors";

                  const attendanceSubItems = [
                    {
                      href: '/admin/attendance',
                      label: 'Attendance Dashboard',
                      icon: SlidersHorizontal,
                      active:
                        pathname === '/admin/attendance' ||
                        pathname.startsWith('/admin/attendance/classes') ||
                        pathname.startsWith('/admin/attendance/students') ||
                        pathname.startsWith('/admin/attendance/student/') ||
                        pathname.startsWith('/admin/attendance/live') ||
                        pathname.startsWith('/admin/attendance/reports') ||
                        pathname.startsWith('/admin/attendance/weekly') ||
                        pathname.startsWith('/admin/attendance/monthly'),
                    },
                    { href: '/admin/attendance/schedule', label: 'Class Schedule', icon: CalendarDays, active: pathname.startsWith('/admin/attendance/schedule') },
                    { href: '/admin/attendance/subjects', label: 'Subjects', icon: BookOpen, active: pathname.startsWith('/admin/attendance/subjects') },
                    { href: '/admin/attendance/teachers', label: 'Teachers', icon: Briefcase, active: pathname.startsWith('/admin/attendance/teachers') },
                    { href: '/admin/attendance/mark', label: 'Mark Attendance', icon: ClipboardList, active: pathname.startsWith('/admin/attendance/mark') },
                    { href: '/admin/attendance/leave', label: 'Leave Management', icon: CalendarCheck, active: pathname.startsWith('/admin/attendance/leave') },
                    { href: '/admin/attendance/holidays', label: 'Holidays / Class Off', icon: Building2, active: pathname.startsWith('/admin/attendance/holidays') },
                    { href: '/admin/attendance/audit-log', label: 'Admin Audit Log', icon: History, active: pathname.startsWith('/admin/attendance/audit-log') },
                    { href: '/admin/attendance/settings', label: 'Settings & Demo Data', icon: Settings, active: pathname.startsWith('/admin/attendance/settings') },
                  ];

                  const userManagementSubItems = [
                    { href: '/admin/teachers', label: 'Teachers', icon: Briefcase, active: pathname.startsWith('/admin/teachers') },
                    { href: '/admin/users', label: 'Students', icon: Users, active: pathname.startsWith('/admin/users') },
                  ];

                  const branchRecordsSubItems = [
                    { href: '/admin/enrollments', label: 'Enroll Students', icon: GraduationCap, active: pathname.startsWith('/admin/enrollments') },
                    { href: '/admin/admissions', label: 'Admissions', icon: FileText, active: pathname.startsWith('/admin/admissions') },
                    { href: '/admin/demo', label: 'Free Demo', icon: Presentation, active: pathname.startsWith('/admin/demo'), badge: bookingCount },
                    { href: '/admin/enquiries', label: 'Student Enquiries', icon: MessageSquare, active: pathname.startsWith('/admin/enquiries') },
                    { href: '/admin/scholarship', label: 'Scholarship', icon: Award, active: pathname.startsWith('/admin/scholarship') },
                  ];

                  const updatesBlogSubItems = [
                    { href: '/admin/blog', label: 'IDL Blog', icon: FileText, active: pathname.startsWith('/admin/blog') },
                    { href: '/admin/updates', label: 'Recent Updates', icon: Bell, active: pathname.startsWith('/admin/updates') },
                  ];

                  const renderCountBadge = (count: number, active: boolean) => (
                    <span
                      className={
                        isBudhViharBranch
                          ? active
                            ? "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2864E8] px-1.5 text-[11px] font-extrabold tabular-nums text-white shadow-[0_1px_2px_rgba(40,100,232,0.25)]"
                            : "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DCE7F9] px-1.5 text-[11px] font-extrabold tabular-nums text-[#173568]"
                          : active
                            ? "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-semibold text-white"
                            : "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/10 px-1.5 text-[11px] font-semibold text-sidebar-primary"
                      }
                    >
                      {count}
                    </span>
                  );

                  const renderBranchDropdown = (config: {
                    groupKey: 'attendance' | 'users' | 'records' | 'updates-blog';
                    label: string;
                    icon: any;
                    isSectionActive: boolean;
                    items: Array<{ href: string; label: string; icon: any; active: boolean; badge?: number }>;
                  }) => {
                    const GroupIcon = config.icon;
                    const isOpen = openBranchGroup === config.groupKey;
                    const triggerActive = config.isSectionActive && !isOpen;
                    return (
                      <SidebarMenuItem key={config.groupKey}>
                        <SidebarMenuButton
                          type="button"
                          onClick={() =>
                            setOpenBranchGroup((prev) => (prev === config.groupKey ? null : config.groupKey))
                          }
                          isActive={triggerActive}
                          className={branchNavLinkClass}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <GroupIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{config.label}</span>
                          </span>
                          <ChevronDown
                            className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </SidebarMenuButton>
                        {isOpen && (
                          <div className="mx-2 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border pl-4 py-1">
                            {config.items.map((sub) => {
                              const SubIcon = sub.icon;
                              return (
                                <SidebarMenuButton
                                  key={sub.href}
                                  asChild
                                  isActive={sub.active}
                                  className={branchSubNavLinkClass}
                                >
                                  <Link href={sub.href} className="flex items-center justify-between gap-2 w-full min-w-0">
                                    <span className="flex items-center gap-2 min-w-0">
                                      <SubIcon className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">{sub.label}</span>
                                    </span>
                                    {typeof sub.badge === 'number' && sub.badge > 0 && (
                                      renderCountBadge(sub.badge, sub.active)
                                    )}
                                  </Link>
                                </SidebarMenuButton>
                              );
                            })}
                          </div>
                        )}
                      </SidebarMenuItem>
                    );
                  };

                  return (
                    <div className="space-y-3">
                      <div>
                        <div
                          data-testid="sidebar-branch-label"
                          className={
                            isBudhViharBranch
                              ? "mb-1.5 flex items-center gap-2 bg-transparent px-2 py-1 text-[12.5px] font-extrabold tracking-[0.005em] [word-spacing:0.03em] leading-tight text-[#173568]"
                              : "mb-1.5 flex items-center gap-2 bg-transparent px-2 py-1 text-xs font-semibold leading-tight text-[#0B1B43]"
                          }
                        >
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-sidebar-primary" />
                          <span className="truncate">{sidebarBranchName}</span>
                        </div>
                        <div>
                          <p
                            className={
                              isBudhViharBranch
                                ? "px-2 pb-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#475E82]/85"
                                : "px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/80"
                            }
                          >
                            Branch Portal
                          </p>
                          <div className="space-y-1">
                            {/* Dashboard */}
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'} className={branchNavLinkClass}>
                                <Link href="/admin/dashboard" className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-2.5 min-w-0">
                                    <SlidersHorizontal className="h-4 w-4 shrink-0" />
                                    <span className="truncate">Dashboard</span>
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Attendance System Dropdown */}
                            {renderBranchDropdown({
                              groupKey: 'attendance',
                              label: 'Attendance System',
                              icon: ClipboardList,
                              isSectionActive: isAttendancePage,
                              items: attendanceSubItems,
                            })}

                            {/* Fee Management */}
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/fees')} className={branchNavLinkClass}>
                                <Link href="/admin/fees" className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-2.5 min-w-0">
                                    <IndianRupee className="h-4 w-4 shrink-0" />
                                    <span className="truncate">Fee Management</span>
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* User Management Dropdown (Teachers & Students) */}
                            {renderBranchDropdown({
                              groupKey: 'users',
                              label: 'User Management',
                              icon: Users,
                              isSectionActive: isBranchUsersPage,
                              items: userManagementSubItems,
                            })}

                            {/* Submissions Dropdown */}
                            {renderBranchDropdown({
                              groupKey: 'records',
                              label: 'Submissions',
                              icon: FileText,
                              isSectionActive: isBranchRecordsPage,
                              items: branchRecordsSubItems,
                            })}

                            {/* Updates & Blog Dropdown (IDL Blog & Recent Updates) */}
                            {renderBranchDropdown({
                              groupKey: 'updates-blog',
                              label: 'Updates & Blog',
                              icon: Bell,
                              isSectionActive: isBranchUpdatesBlogPage,
                              items: updatesBlogSubItems,
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="space-y-1">
                    <p className="px-2 pb-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#475E82]/85">
                      Admin Portal
                    </p>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'} className={superNavLinkClass}>
                        <Link href="/admin/dashboard">
                          <SlidersHorizontal />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                )}
              </SidebarMenu>
              {!isBranchAdmin && (
                <SidebarMenuAccordion value={accordionValue} onValueChange={setAccordionValue} className="mt-1 gap-1">
                  <SidebarMenuSub value="user-management">
                    <SidebarMenuSubButton
                      isActive={isSuperUserMgmtActive && accordionValue !== 'user-management'}
                      className={superNavLinkClass}
                    >
                      <Users />
                      <span>User Management</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'user-management' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/admins')} className={superSubNavLinkClass}>
                        <Link href="/admin/admins">
                          <Shield />
                          <span>Admins</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/users')} className={superSubNavLinkClass}>
                        <Link href="/admin/users">
                          <GraduationCap />
                          <span>Students</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/teachers')} className={superSubNavLinkClass}>
                        <Link href="/admin/teachers">
                          <Briefcase />
                          <span>Teachers</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/access-logs')} className={superSubNavLinkClass}>
                        <Link href="/admin/access-logs">
                          <Activity />
                          <span>Access Hub</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="attendance">
                    <SidebarMenuSubButton
                      isActive={isAttendancePage && accordionValue !== 'attendance'}
                      className={superNavLinkClass}
                    >
                      <ClipboardList />
                      <span>Attendance</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'attendance' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === '/admin/attendance' ||
                          pathname.startsWith('/admin/attendance/classes') ||
                          pathname.startsWith('/admin/attendance/students') ||
                          pathname.startsWith('/admin/attendance/student/') ||
                          pathname.startsWith('/admin/attendance/live') ||
                          pathname.startsWith('/admin/attendance/reports') ||
                          pathname.startsWith('/admin/attendance/weekly') ||
                          pathname.startsWith('/admin/attendance/monthly')
                        }
                        className={superSubNavLinkClass}
                      >
                        <Link href="/admin/attendance">
                          <SlidersHorizontal />
                          <span>Attendance Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/schedule')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/schedule">
                          <CalendarDays />
                          <span>Class Schedule</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/subjects')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/subjects">
                          <BookOpen />
                          <span>Subjects</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/teachers')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/teachers">
                          <Briefcase />
                          <span>Teachers</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/mark')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/mark">
                          <ClipboardList />
                          <span>Mark Attendance</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/leave')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/leave">
                          <CalendarCheck />
                          <span>Leave Management</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/holidays')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/holidays">
                          <Building2 />
                          <span>Holidays / Class Off</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/audit-log')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/audit-log">
                          <History />
                          <span>Admin Audit Log</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/settings')} className={superSubNavLinkClass}>
                        <Link href="/admin/attendance/settings">
                          <Settings />
                          <span>Settings & Demo Data</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="fee-management">
                    <SidebarMenuSubButton
                      isActive={isFeesPage && accordionValue !== 'fee-management'}
                      className={superNavLinkClass}
                    >
                      <IndianRupee />
                      <span>Fee Management</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'fee-management' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={isFeesPage} className={superSubNavLinkClass}>
                        <Link href="/admin/fees">
                          <SlidersHorizontal />
                          <span>Fee Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="submissions">
                    <SidebarMenuSubButton
                      isActive={isSuperSubmissionsActive && accordionValue !== 'submissions'}
                      className={superNavLinkClass}
                    >
                      <FileText />
                      <span>Submissions</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'submissions' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/enrollments')} className={superSubNavLinkClass}>
                        <Link href="/admin/enrollments">
                          <GraduationCap />
                          <span>Enrollments</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/admissions')} className={superSubNavLinkClass}>
                        <Link href="/admin/admissions">
                          <FileText />
                          <span>Admissions</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/demo')} className={superSubNavLinkClass}>
                        <Link href="/admin/demo" className="flex items-center justify-between gap-2 w-full min-w-0">
                          <span className="flex items-center gap-2 min-w-0">
                            <Presentation className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Free Demo</span>
                          </span>
                          {bookingCount > 0 && (
                            <span
                              className={
                                pathname.startsWith('/admin/demo')
                                  ? "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2864E8] px-1.5 text-[11px] font-extrabold tabular-nums text-white shadow-[0_1px_2px_rgba(40,100,232,0.25)]"
                                  : "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DCE7F9] px-1.5 text-[11px] font-extrabold tabular-nums text-[#173568]"
                              }
                            >
                              {bookingCount}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/scholarship')} className={superSubNavLinkClass}>
                        <Link href="/admin/scholarship">
                          <Award />
                          <span>Scholarship</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/enquiries')} className={superSubNavLinkClass}>
                        <Link href="/admin/enquiries">
                          <MessageSquare />
                          <span>Student Enquiries</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/feedback')} className={superSubNavLinkClass}>
                        <Link href="/admin/feedback">
                          <FeedbackIcon />
                          <span>Feedback</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/messages')} className={superSubNavLinkClass}>
                        <Link href="/admin/messages">
                          <Mail />
                          <span>Contact Us</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/support-tickets')} className={superSubNavLinkClass}>
                        <Link href="/admin/support-tickets">
                          <LifeBuoy />
                          <span>Support Tickets</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="course-content">
                    <SidebarMenuSubButton
                      isActive={isSuperCourseContentActive && accordionValue !== 'course-content'}
                      className={superNavLinkClass}
                    >
                      <BookOpen />
                      <span>Course Content</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'course-content' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/free-courses')} className={superSubNavLinkClass}>
                        <Link href="/admin/free-courses">
                          <BookOpen />
                          <span>Free Courses</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/paid-courses')} className={superSubNavLinkClass}>
                        <Link href="/admin/paid-courses">
                          <DollarSign />
                          <span>Paid Courses</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/study-resources')} className={superSubNavLinkClass}>
                        <Link href="/admin/study-resources">
                          <BookCheck />
                          <span>Study Resources</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/previous-year-questions')} className={superSubNavLinkClass}>
                        <Link href="/admin/previous-year-questions">
                          <FileText />
                          <span>Prev. Year Questions</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/testimonials')} className={superSubNavLinkClass}>
                        <Link href="/admin/testimonials">
                          <MessageSquare />
                          <span>Our Students Say</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/expert-teachers')} className={superSubNavLinkClass}>
                        <Link href="/admin/expert-teachers">
                          <GraduationCap />
                          <span>Expert Teachers</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/topper-testimonials')} className={superSubNavLinkClass}>
                        <Link href="/admin/topper-testimonials">
                          <Video />
                          <span>Topper Testimonials</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="site-management">
                    <SidebarMenuSubButton
                      isActive={isSuperSiteMgmtActive && accordionValue !== 'site-management'}
                      className={superNavLinkClass}
                    >
                      <Settings2 />
                      <span>Site Management</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'site-management' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/hero-slides')} className={superSubNavLinkClass}>
                        <Link href="/admin/hero-slides">
                          <Layers />
                          <span>Hero Slides</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/blog')} className={superSubNavLinkClass}>
                        <Link href="/admin/blog">
                          <FileText />
                          <span>IDL Blog</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/gallery')} className={superSubNavLinkClass}>
                        <Link href="/admin/gallery">
                          <ImageIcon />
                          <span>Gallery</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/updates')} className={superSubNavLinkClass}>
                        <Link href="/admin/updates">
                          <Bell />
                          <span>Recent Updates</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/excellence-results')} className={superSubNavLinkClass}>
                        <Link href="/admin/excellence-results">
                          <Star />
                          <span>Excellence Results</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/social-media')} className={superSubNavLinkClass}>
                        <Link href="/admin/social-media">
                          <Share2 />
                          <span>Social Media Settings</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/ai-knowledge')} className={superSubNavLinkClass}>
                        <Link href="/admin/ai-knowledge">
                          <Bot />
                          <span>AI Knowledge (PDF)</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="store-management">
                    <SidebarMenuSubButton
                      isActive={isSuperStoreMgmtActive && accordionValue !== 'store-management'}
                      className={superNavLinkClass}
                    >
                      <ShoppingCart />
                      <span>Store Management</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'store-management' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/store-customers')} className={superSubNavLinkClass}>
                        <Link href="/admin/store-customers">
                          <Users />
                          <span>Customers</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/store-orders')} className={superSubNavLinkClass}>
                        <Link href="/admin/store-orders">
                          <ShoppingCart />
                          <span>Orders</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                  <SidebarMenuSub value="idl-foundation">
                    <SidebarMenuSubButton
                      isActive={isSuperFoundationActive && accordionValue !== 'idl-foundation'}
                      className={superNavLinkClass}
                    >
                      <Heart />
                      <span>IDL Foundation</span>
                      <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${accordionValue === 'idl-foundation' ? 'rotate-180' : ''}`} />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/volunteer-applications')} className={superSubNavLinkClass}>
                        <Link href="/admin/volunteer-applications">
                          <HandHeart />
                          <span>Volunteer</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/donations')} className={superSubNavLinkClass}>
                        <Link href="/admin/donations">
                          <IndianRupee />
                          <span>Donations</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuAccordion>
              )}
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-col flex-1 min-w-0">
            <header className="px-4 py-3 border-b border-[#E5EAF2] bg-white flex items-center justify-between md:hidden">
              {isBranchAdmin ? (
                <div className={`flex items-center gap-2 min-w-0${isBudhViharBranch ? ' antialiased' : ''}`}>
                  <Building2 className="h-4 w-4 text-[#2864E8] shrink-0" />
                  <span
                    className={
                      isBudhViharBranch
                        ? "text-[14px] font-extrabold tracking-[-0.01em] [word-spacing:0.03em] text-[#173568] truncate"
                        : "text-sm font-semibold text-[#0B1B43] truncate"
                    }
                  >
                    {branchName}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0 antialiased">
                  <Shield className="h-4 w-4 text-[#2864E8] shrink-0" />
                  <span className="text-[14px] font-extrabold tracking-[-0.01em] [word-spacing:0.03em] text-[#173568] truncate">
                    Super Admin
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 ml-auto">
                {user && (
                  <SidebarTrigger>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 shrink-0 overflow-hidden">
                        {user.photoURL ? (
                          <GcsImage
                            filePath={user.photoURL}
                            alt={user.name ?? ''}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </SidebarTrigger>
                )}
              </div>
            </header>
            <main
              className={
                isFeesPage || isAttendancePage
                  ? "flex-1 min-w-0 bg-slate-50/60 dark:bg-slate-950"
                  : isProfileActive
                    ? "flex-1 min-w-0 px-4 pt-4 pb-8 md:px-8 md:pt-6 md:pb-10 bg-white"
                    : "flex-1 min-w-0 px-4 pt-3 pb-6 md:px-6 md:pt-4 md:pb-6 bg-[#F8FAFC]"
              }
            >
              {isBranchAdmin && !isBranchRouteAllowed ? (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <div className="rounded-xl border border-[#E5EAF2] bg-white px-6 py-4 text-sm font-medium text-[#64748B] shadow-sm">
                    Redirecting to your branch dashboard...
                  </div>
                </div>
              ) : (
                children
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default withAuth(AdminLayout, ['admin']);
