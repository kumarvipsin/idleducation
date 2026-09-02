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
  BookOpen, LayoutDashboard, User, LogOut, Users, Upload, 
  FileText, Bell, Video, PlusCircle, Sparkles, ChevronRight,
  HelpCircle, ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function TeacherLayout({
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
  
  const mobileNavLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/teacher/students', label: 'Students', icon: <Users className="w-5 h-5" /> },
    { href: '/teacher/classes', label: 'Classes', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/teacher/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { href: '/teacher/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const navItems = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/teacher/students', label: 'My Students', icon: Users },
    { href: '/teacher/classes', label: 'Class Schedules', icon: BookOpen },
    { href: '/teacher/reports', label: 'Progress & Tests', icon: FileText },
    { href: '/teacher/materials', label: 'Notes & Materials', icon: Upload },
    { href: '/teacher/profile', label: 'Faculty Profile', icon: User },
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
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4 space-y-4">
            {/* Teacher Mini Profile Card */}
            <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/20">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Teacher'} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-bold text-xs text-slate-900 truncate">{user?.name || 'Faculty Member'}</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Faculty
                </span>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instructor Portal
              </div>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === '/teacher/dashboard' 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`h-10 px-3 rounded-lg text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-primary text-white hover:bg-primary/95 hover:text-white shadow-xs font-bold' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-slate-100">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg h-9"
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
                <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Instructor Dashboard</span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-bold text-primary border-primary/20 bg-primary/5">
                    Faculty Suite
                  </Badge>
                </h1>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  Manage your batches, review submissions, and conduct live lectures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/teacher/classes">
                <Button size="sm" className="h-8 md:h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none px-3 cursor-pointer">
                  <Video className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Go Live</span>
                  <span className="sm:hidden">Live</span>
                </Button>
              </Link>

              <Link href="/teacher/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Avatar className="h-8 w-8 border border-slate-200">
                  <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Teacher'} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
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

export default withAuth(TeacherLayout, ['teacher']);
