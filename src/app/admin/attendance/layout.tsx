'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AttendanceProvider, useAttendance } from '@/context/attendance-context';
import {
  LayoutDashboard,
  CalendarDays,
  Radio,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  PhoneCall,
  BarChart3,
  Settings,
  Bell,
  MapPin,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Layers,
  Building2,
  FileSpreadsheet,
  Shield,
  Menu,
  X,
  History,
  CheckCircle2,
  AlertCircle,
  Info,
  Database,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/attendance-store';

function SaaSNavbar({ onToggleMobileMenu }: { onToggleMobileMenu: () => void }) {
  const { currentRole, setCurrentRole, isDemoData, absentFollowUps, leaveRequests } = useAttendance();
  const [branch, setBranch] = useState('Main Branch (Delhi)');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: UserRole[] = ['Super Admin', 'Admin', 'Teacher', 'Staff'];
  const pendingAbsents = absentFollowUps.filter(f => f.callStatus === 'Not Contacted').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a1128] text-white border-b border-slate-800/80 shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/admin/attendance" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 font-black text-white text-base">
              IDL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base lg:text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  IDL EDUCATION
                </span>
                {isDemoData && (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-[9px] font-bold uppercase tracking-wider py-0 px-1.5">
                    Demo Mode
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-blue-300 font-medium tracking-wide">
                Learn Today, Lead Tomorrow
              </p>
            </div>
          </Link>

          <div className="hidden xl:block h-7 w-[1px] bg-slate-700/60 mx-1" />

          {/* Subtitle Banner */}
          <div className="hidden xl:flex flex-col">
            <h2 className="text-xs font-semibold text-slate-200">Attendance Management System</h2>
            <span className="text-[11px] text-slate-400">Complete Solution for Smarter Attendance, Better Learning</span>
          </div>
        </div>

        {/* Right: Branch Selector, Role Switcher, Notifications, User Profile & Quote */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Quote Banner */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-blue-300 text-xs italic font-medium">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>&ldquo;Discipline Today, Brighter Tomorrow&rdquo;</span>
          </div>

          {/* Role Switcher (Requirement #20 Permission Control) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950/80 border border-blue-800/80 text-blue-200 text-xs font-bold hover:bg-blue-900/80 transition-colors"
              title="Change active user role to test permissions"
            >
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>Role: {currentRole}</span>
              <ChevronDown className="h-3 w-3 text-blue-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
                  Switch Active Role
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors ${
                      currentRole === r
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branch Picker */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer hover:bg-slate-700/60 transition-colors">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>{branch}</span>
            <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {pendingAbsents > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0a1128]">
                  {pendingAbsents}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Attendance Alerts</h4>
                  <Badge variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                    {pendingAbsents} Pending Calls
                  </Badge>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Aman Kumar (9A) Absent</p>
                      <p className="text-[11px] text-slate-500">2h missed in Mathematics. Parent not contacted yet.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Pending Leave Request</p>
                      <p className="text-[11px] text-slate-500">Karan Mehta applied for personal leave.</p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-3 text-center">
                  <Link
                    href="/admin/attendance/leave?tab=followup"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Follow-ups →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-700/60">
            <Avatar className="h-8 w-8 ring-2 ring-blue-500/40">
              <AvatarImage src="/amod_sharma.png" alt="Amod Sharma" />
              <AvatarFallback className="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-xs">
                AS
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white leading-tight">Amod Sharma</div>
              <div className="text-[10px] text-blue-300/90 font-medium capitalize">{currentRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DarkNavySidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  const pathname = usePathname();
  const { students, auditLogs } = useAttendance();

  const activeStudentsCount = students.filter(s => s.status === 'active').length;

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/attendance',
      icon: LayoutDashboard,
      active: pathname === '/admin/attendance',
    },
    {
      label: 'Live Attendance',
      href: '/admin/attendance/live',
      icon: Radio,
      active: pathname.startsWith('/admin/attendance/live'),
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500 text-white animate-pulse',
    },
    {
      label: 'Class Schedule',
      href: '/admin/attendance/schedule',
      icon: CalendarDays,
      active: pathname.startsWith('/admin/attendance/schedule'),
    },
    {
      label: 'Classes & Batches',
      href: '/admin/attendance/classes',
      icon: Layers,
      active: pathname.startsWith('/admin/attendance/classes'),
    },
    {
      label: 'Students',
      href: '/admin/attendance/students',
      icon: GraduationCap,
      active: pathname.startsWith('/admin/attendance/students') || pathname.startsWith('/admin/attendance/student/'),
      count: String(activeStudentsCount),
    },
    {
      label: 'Teachers',
      href: '/admin/attendance/teachers',
      icon: Users,
      active: pathname.startsWith('/admin/attendance/teachers'),
    },
    {
      label: 'Subjects',
      href: '/admin/attendance/subjects',
      icon: BookOpen,
      active: pathname.startsWith('/admin/attendance/subjects'),
    },
    {
      label: 'Leave Management',
      href: '/admin/attendance/leave',
      icon: CalendarCheck,
      active: pathname.startsWith('/admin/attendance/leave'),
    },
    {
      label: 'Holidays / Class Off',
      href: '/admin/attendance/holidays',
      icon: Building2,
      active: pathname.startsWith('/admin/attendance/holidays'),
    },
    {
      label: 'Reports & Analytics',
      href: '/admin/attendance/reports',
      icon: BarChart3,
      active: pathname.startsWith('/admin/attendance/reports'),
    },
    {
      label: 'Admin Audit Log',
      href: '/admin/attendance/audit-log',
      icon: History,
      active: pathname.startsWith('/admin/attendance/audit-log'),
      count: String(auditLogs.length),
    },
    {
      label: 'Settings & Demo Data',
      href: '/admin/attendance/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/attendance/settings'),
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080d1e] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <Link href="/admin/attendance" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow">
              IDL
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">IDL EDUCATION</span>
              <p className="text-[10px] text-slate-400 font-medium">Attendance &amp; CRUD SaaS</p>
            </div>
          </Link>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Management Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      item.active ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800/80 bg-[#070b19]/80 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Main Website Admin
            </span>
          </Link>
          <div className="px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CRUD Controls Active
            </span>
            <span className="text-[10px] text-slate-500 font-mono">v2.5</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useAttendance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let borderBg = 'bg-slate-900 text-white border-slate-800';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          borderBg = 'bg-rose-950 text-white border-rose-800';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          borderBg = 'bg-amber-950 text-white border-amber-800';
          Icon = AlertCircle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'info') {
          borderBg = 'bg-blue-950 text-white border-blue-800';
          Icon = Info;
          iconColor = 'text-blue-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border shadow-xl text-xs font-medium animate-in slide-in-from-bottom-2 duration-200 ${borderBg}`}
          >
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${iconColor}`} />
            <div className="flex-1">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MainAttendanceShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      <SaaSNavbar onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="flex-1 flex w-full">
        <DarkNavySidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AttendanceProvider>
      <MainAttendanceShell>{children}</MainAttendanceShell>
    </AttendanceProvider>
  );
}
