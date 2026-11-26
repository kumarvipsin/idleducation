'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  BookOpen, LayoutDashboard, User, LogOut, ClipboardList, 
  Video, FileText, Bell, Sparkles, ShoppingBag, Award, Newspaper 
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/courses', label: 'My Courses', icon: BookOpen },
    { href: '/student/study-plan', label: 'Study Plan', icon: ClipboardList },
    { href: '/student/blog', label: 'IDL Blogs', icon: Newspaper },
    { href: '/student/profile', label: 'My Profile', icon: User },
  ];

  const mobileNavLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/student/courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/student/study-plan', label: 'Study Plan', icon: <ClipboardList className="w-5 h-5" /> },
    { href: '/student/blog', label: 'Blogs', icon: <Newspaper className="w-5 h-5" /> },
    { href: '/student/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/60 font-sans text-slate-800 antialiased">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r border-slate-200/80 bg-white">
          <SidebarHeader className="p-4 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
              <Image 
                src="/idllogo.png" 
                alt="IDL Education" 
                width={130} 
                height={38} 
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4 space-y-4">
            {/* Student Mini Profile Card */}
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Student'} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-extrabold text-[13.5px] tracking-[-0.01em] text-[#0B224D] truncate">{user?.name || 'Student'}</span>
                <span className="text-[11px] text-[#3B62A8] font-semibold tracking-[0.005em] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2864E8]"></span>
                  Active Aspirant
                </span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10.5px] font-extrabold text-[#475E82]/85 uppercase tracking-[0.08em]">
                Student Suite
              </div>
              <SidebarMenu>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/student/dashboard' 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`relative h-10 px-3 rounded-lg text-[13.5px] font-bold tracking-[0.005em] [word-spacing:0.03em] transition-all duration-150 ${
                          isActive 
                            ? "bg-[#E8F0FE] text-[#1D4ED8] ring-1 ring-inset ring-[#C7DBFC] shadow-[0_1px_2px_rgba(23,53,104,0.06)] hover:bg-[#E1ECFE] hover:text-[#1D4ED8] before:content-[''] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:rounded-r-full before:bg-[#2864E8]" 
                            : 'text-[#173568] hover:bg-[#E8EEF7]/75 hover:text-[#0B224D]'
                        }`}
                      >
                        <Link href={item.href} className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-[#2864E8]' : 'text-[#475E82]'}`} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>

            {/* Quick Explore Section */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 py-1.5 text-[10.5px] font-extrabold text-[#475E82]/85 uppercase tracking-[0.08em]">
                Explore More
              </div>
              <Link href="/paid-courses" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-bold tracking-[0.005em] text-[#334E75] hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] transition-colors">
                <BookOpen className="h-4 w-4 text-[#475E82]" />
                <span>All Courses</span>
              </Link>
              <Link href="/previous-year-questions" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-bold tracking-[0.005em] text-[#334E75] hover:bg-[#E8EEF7]/75 hover:text-[#0B224D] transition-colors">
                <FileText className="h-4 w-4 text-[#475E82]" />
                <span>PYQ Library</span>
              </Link>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-slate-100">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg h-9 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          {/* Top Navbar Header */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-slate-600 hover:text-primary cursor-pointer" />
              <div>
                <h1 className="text-[17px] md:text-[19px] font-extrabold text-[#173568] tracking-[-0.015em] [word-spacing:0.03em] flex items-center gap-2">
                  <span>Student Workspace</span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10.5px] font-bold text-[#1D4ED8] border-[#C7DBFC] bg-[#E8F0FE]">
                    Learning Portal
                  </Badge>
                </h1>
                <p className="text-[12px] font-medium text-[#475E82] hidden md:block">
                  Access your active curricula, live lectures, notes, and study plans.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/paid-courses">
                <Button size="sm" variant="outline" className="h-8 md:h-9 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg px-3 cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  <span className="hidden sm:inline">Explore Courses</span>
                  <span className="sm:hidden">Courses</span>
                </Button>
              </Link>

              <Link href="/student/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Student'} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>

          {/* Body Content */}
          <main className="flex-1 px-4 md:px-8 py-5 md:py-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Mobile Navigation Bar */}
        <MobileBottomNav links={mobileNavLinks} />
      </div>
    </SidebarProvider>
  );
}

export default withAuth(StudentLayout, ['student']);
