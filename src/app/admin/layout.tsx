
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const branchName = isBranchAdmin
    ? (user?.branchName || getBranchDisplayName(normalizedBranchId, true))
    : '';

  const branchAllowedPrefixes = [
    '/admin/dashboard',
    '/admin/fees',
    '/admin/enrollments',
    '/admin/admissions',
    '/admin/enquiries',
    '/admin/profile',
    '/admin/users',
    '/admin/teachers',
    '/admin/demo',
    '/admin/messages',
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
  const [accordionValue, setAccordionValue] = React.useState<string>(
    isFeesPage ? 'fee-management' : isAttendancePage ? 'attendance' : 'user-management'
  );

  React.useEffect(() => {
    if (isFeesPage) {
      setAccordionValue('fee-management');
    } else if (isAttendancePage) {
      setAccordionValue('attendance');
    }
  }, [isFeesPage, isAttendancePage]);

  return (
    <>
    <Header />
    <SidebarProvider>
      <div
        className={
          isFeesPage || isAttendancePage || isBranchAdmin
            ? "flex min-h-[calc(100svh-68px)] w-full bg-[#F8FAFC] dark:bg-slate-950"
            : "flex min-h-[calc(100svh-68px)] w-full bg-muted/20"
        }
      >
        <Sidebar className={isBranchAdmin ? "md:top-[68px] md:h-[calc(100svh-68px)] border-r border-[#E5EAF2] bg-white" : "md:top-[68px] md:h-[calc(100svh-68px)]"}>
          {isBranchAdmin && (
          <SidebarHeader className="pt-[76px] md:pt-3 px-3 pb-2">
            <Link
              href="/admin/profile"
              className={
                pathname.startsWith('/admin/profile')
                  ? "group flex items-center gap-3 rounded-xl border border-[#2864E8] bg-[#EFF6FF]/60 p-3 ring-1 ring-[#2864E8]/20 transition-colors"
                  : "group flex items-center gap-3 rounded-xl border border-[#E5EAF2] bg-[#F8FAFC] p-3 transition-colors hover:border-[#2864E8]/40 hover:bg-white"
              }
            >
              <Avatar className="h-10 w-10 shrink-0 border border-[#E5EAF2]">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Branch Admin'} />
                <AvatarFallback className="bg-[#0B1B43] text-white text-sm font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-[#172033] leading-tight">
                  {user?.name || 'Branch Admin'}
                </p>
                <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
                  Branch Admin
                </p>
                <div className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#2864E8]">
                  <Building2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">{branchName}</span>
                </div>
              </div>
            </Link>
          </SidebarHeader>
          )}
          <SidebarContent className={isBranchAdmin ? "px-2 py-2" : "px-1 pt-1 pb-2"}>
            <SidebarMenu>
                {!isBranchAdmin && (
                <SidebarMenuItem className="mb-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isProfileActive}
                      className={
                        isProfileActive
                          ? "h-auto py-2 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                          : "h-auto py-2"
                      }
                    >
                    <Link href="/admin/profile">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Super Admin'} />
                        <AvatarFallback
                          className={
                            isProfileActive
                              ? "bg-white text-[#0B1B43] font-semibold"
                              : "bg-muted text-[#0B1B43] font-semibold"
                          }
                        >
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                        <span className={isProfileActive ? "font-semibold text-white truncate" : "font-semibold text-[#0B1B43] truncate"}>
                          {user?.name}
                        </span>
                        <span className={isProfileActive ? "text-xs text-blue-100/90" : "text-xs text-muted-foreground"}>
                          Super Admin
                        </span>
                        </div>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                )}
                {isBranchAdmin ? (() => {
                  const branchNavLinkClass =
                    "h-auto rounded-lg px-3 py-2 text-[13.5px] font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0B1B43] data-[active=true]:bg-[#2864E8] data-[active=true]:text-white data-[active=true]:font-semibold data-[active=true]:shadow-sm";

                  const portalItems = [
                    { href: '/admin/dashboard', label: 'Dashboard', icon: SlidersHorizontal, active: pathname === '/admin/dashboard' },
                    { href: '/admin/fees', label: 'Fee Management', icon: IndianRupee, active: pathname.startsWith('/admin/fees') },
                    { href: '/admin/enrollments', label: 'Course Enrollments', icon: GraduationCap, active: pathname.startsWith('/admin/enrollments') },
                    { href: '/admin/admissions', label: 'Admissions', icon: FileText, active: pathname.startsWith('/admin/admissions') },
                    { href: '/admin/enquiries', label: 'Student Enquiries', icon: MessageSquare, active: pathname.startsWith('/admin/enquiries') },
                  ];

                  const directoryItems = [
                    { href: '/admin/users', label: 'Students & Users', icon: Users, active: pathname.startsWith('/admin/users') },
                    { href: '/admin/teachers', label: 'Teachers', icon: Briefcase, active: pathname.startsWith('/admin/teachers') },
                    { href: '/admin/demo', label: 'Free Demo', icon: Presentation, active: pathname.startsWith('/admin/demo'), badge: bookingCount },
                    { href: '/admin/messages', label: 'Contact Us', icon: FeedbackIcon, active: pathname.startsWith('/admin/messages') },
                  ];

                  const renderNavGroup = (title: string, items: Array<{ href: string; label: string; icon: any; active: boolean; badge?: number }>) => (
                    <div>
                      <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                        {title}
                      </p>
                      <div className="space-y-1">
                        {items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={item.active} className={branchNavLinkClass}>
                                <Link href={item.href} className="flex items-center justify-between w-full">
                                  <span className="flex items-center gap-3 min-w-0">
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                  </span>
                                  {typeof item.badge === 'number' && item.badge > 0 && (
                                    <span
                                      className={
                                        item.active
                                          ? "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[11px] font-semibold text-white"
                                          : "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2864E8]/15 px-1.5 text-[11px] font-semibold text-[#2864E8]"
                                      }
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </div>
                    </div>
                  );

                  return (
                    <div className="space-y-4">
                      {renderNavGroup('Branch Portal', portalItems)}
                      <div className="border-t border-[#E5EAF2] pt-3">
                        {renderNavGroup('Branch Records', directoryItems)}
                      </div>
                    </div>
                  );
                })() : (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                      <Link href="/admin/dashboard">
                        <SlidersHorizontal />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
             </SidebarMenu>
            {!isBranchAdmin && (
            <SidebarMenuAccordion value={accordionValue} onValueChange={setAccordionValue}>
                <SidebarMenuSub value="user-management">
                    <SidebarMenuSubButton>
                        <Users />
                        <span>User Management</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                         <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/admins')}>
                            <Link href="/admin/admins">
                                <Shield />
                                <span>Admins</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/users')}>
                            <Link href="/admin/users">
                                <GraduationCap />
                                <span>Students</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/teachers')}>
                            <Link href="/admin/teachers">
                                <Briefcase />
                                <span>Teachers</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/access-logs')}>
                            <Link href="/admin/access-logs">
                                <Activity />
                                <span>Access Hub</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="attendance">
                    <SidebarMenuSubButton>
                        <ClipboardList />
                        <span>Attendance</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/attendance'}>
                            <Link href="/admin/attendance">
                                <SlidersHorizontal />
                                <span>Overview</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/live')}>
                            <Link href="/admin/attendance/live">
                                <Radio />
                                <span>Live Attendance</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/schedule')}>
                            <Link href="/admin/attendance/schedule">
                                <CalendarDays />
                                <span>Class Schedule</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/mark')}>
                            <Link href="/admin/attendance/mark">
                                <ClipboardList />
                                <span>Mark Attendance</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/classes')}>
                            <Link href="/admin/attendance/classes">
                                <BookMarked />
                                <span>Classes & Batches</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/students') || pathname.startsWith('/admin/attendance/student/')}>
                            <Link href="/admin/attendance/students">
                                <Users />
                                <span>Students</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/teachers')}>
                            <Link href="/admin/attendance/teachers">
                                <Briefcase />
                                <span>Teachers</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/subjects')}>
                            <Link href="/admin/attendance/subjects">
                                <BookOpen />
                                <span>Class/Batch</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/leave')}>
                            <Link href="/admin/attendance/leave">
                                <CalendarCheck />
                                <span>Leave Management</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/holidays')}>
                            <Link href="/admin/attendance/holidays">
                                <Building2 />
                                <span>Holidays / Class Off</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/reports')}>
                            <Link href="/admin/attendance/reports">
                                <BarChart3 />
                                <span>Reports & Analytics</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/weekly')}>
                            <Link href="/admin/attendance/weekly">
                                <CalendarDays />
                                <span>Weekly Reports</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/monthly')}>
                            <Link href="/admin/attendance/monthly">
                                <CalendarDays />
                                <span>Monthly Reports</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/audit-log')}>
                            <Link href="/admin/attendance/audit-log">
                                <History />
                                <span>Admin Audit Log</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/attendance/settings')}>
                            <Link href="/admin/attendance/settings">
                                <Settings />
                                <span>Settings & Demo Data</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="fee-management">
                    <SidebarMenuSubButton>
                        <IndianRupee />
                        <span>Fee Management</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={isFeesPage}>
                            <Link href="/admin/fees">
                                <SlidersHorizontal />
                                <span>Fee Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="submissions">
                    <SidebarMenuSubButton>
                        <FileText />
                        <span>Submissions</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/enrollments')}>
                            <Link href="/admin/enrollments">
                                <GraduationCap />
                                <span>Enrollments</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/admissions')}>
                            <Link href="/admin/admissions">
                                <FileText />
                                <span>Admissions</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/demo')}>
                            <Link href="/admin/demo">
                                <Presentation />
                                <span>Free Demo</span>
                                {bookingCount > 0 && <SidebarMenuBadge>{bookingCount}</SidebarMenuBadge>}
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/scholarship')}>
                            <Link href="/admin/scholarship">
                                <Award />
                                <span>Scholarship</span>
                            </Link>
                        </SidebarMenuButton>
                         <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/enquiries')}>
                            <Link href="/admin/enquiries">
                                <MessageSquare />
                                <span>Student Enquiries</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/feedback')}>
                            <Link href="/admin/feedback">
                                <FeedbackIcon />
                                <span>Feedback</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/messages')}>
                            <Link href="/admin/messages">
                                <Mail />
                                <span>Contact Us</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/support-tickets')}>
                            <Link href="/admin/support-tickets">
                                <LifeBuoy />
                                <span>Support Tickets</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="course-content">
                    <SidebarMenuSubButton>
                        <BookOpen />
                        <span>Course Content</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/free-courses')}>
                           <Link href="/admin/free-courses">
                                <BookOpen />
                                <span>Free Courses</span>
                           </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/paid-courses')}>
                           <Link href="/admin/paid-courses">
                                <DollarSign />
                                <span>Paid Courses</span>
                           </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/study-resources')}>
                           <Link href="/admin/study-resources">
                                <BookCheck />
                                <span>Study Resources</span>
                           </Link>
                        </SidebarMenuButton>
                         <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/previous-year-questions')}>
                           <Link href="/admin/previous-year-questions">
                                <FileText />
                                <span>Prev. Year Questions</span>
                           </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/testimonials')}>
                            <Link href="/admin/testimonials">
                                <MessageSquare />
                                <span>Our Students Say</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/expert-teachers')}>
                            <Link href="/admin/expert-teachers">
                                <GraduationCap />
                                <span>Expert Teachers</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/topper-testimonials')}>
                            <Link href="/admin/topper-testimonials">
                                <Video />
                                <span>Topper Testimonials</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="site-management">
                    <SidebarMenuSubButton>
                        <Settings2 />
                        <span>Site Management</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/hero-slides')}>
                            <Link href="/admin/hero-slides">
                                <Layers />
                                <span>Hero Slides</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/blog')}>
                            <Link href="/admin/blog">
                                <FileText />
                                <span>IDL Blog</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/gallery')}>
                            <Link href="/admin/gallery">
                                <ImageIcon />
                                <span>Gallery</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/updates')}>
                            <Link href="/admin/updates">
                                <Bell />
                                <span>Recent Updates</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/excellence-results')}>
                            <Link href="/admin/excellence-results">
                                <Star />
                                <span>Excellence Results</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/social-media')}>
                            <Link href="/admin/social-media">
                                <Share2 />
                                <span>Social Media Settings</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/ai-knowledge')}>
                            <Link href="/admin/ai-knowledge">
                                <Bot />
                                <span>AI Knowledge (PDF)</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="store-management">
                    <SidebarMenuSubButton>
                        <ShoppingCart />
                        <span>Store Management</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/store-customers')}>
                            <Link href="/admin/store-customers">
                                <Users />
                                <span>Customers</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/store-orders')}>
                            <Link href="/admin/store-orders">
                                <ShoppingCart />
                                <span>Orders</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
                <SidebarMenuSub value="idl-foundation">
                    <SidebarMenuSubButton>
                        <Heart />
                        <span>IDL Foundation</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/volunteer-applications')}>
                            <Link href="/admin/volunteer-applications">
                                <HandHeart />
                                <span>Volunteer</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/donations')}>
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
          <header className={isBranchAdmin ? "px-4 py-3 border-b border-[#E5EAF2] bg-white flex items-center justify-between md:hidden" : "p-4 border-b flex items-center md:hidden"}>
            {isBranchAdmin && (
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-4 w-4 text-[#2864E8] shrink-0" />
                <span className="text-sm font-semibold text-[#0B1B43] truncate">{branchName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
                 {user && (
                    <SidebarTrigger>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
                            <AvatarFallback>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
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
                  : isBranchAdmin
                    ? "flex-1 min-w-0 px-4 pt-3 pb-6 md:px-6 md:pt-4 md:pb-6 bg-[#F8FAFC]"
                    : "flex-1 min-w-0 px-4 pt-3 pb-6 md:px-6 md:pt-4 md:pb-6 bg-muted/20"
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
