
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
import { BookOpen, LayoutDashboard, User, LogOut, Trophy, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Header } from '@/components/header';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


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

  const mobileNavLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/student/courses', label: 'Courses', icon: <BookOpen /> },
    { href: '/student/study-plan', label: 'Study Plan', icon: <ClipboardList /> },
    { href: '/student/profile', label: 'Profile', icon: <User /> },
  ];

  return (
    <>
    <Header />
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader>
          </SidebarHeader>
          <SidebarContent className="mt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/student/profile')} className="h-auto py-2">
                  <Link href="/student/profile">
                      <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Student'} />
                      <AvatarFallback>
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                      </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                      </div>
                  </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/student/dashboard'}
                >
                  <Link href="/student/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/student/courses')}
                >
                  <Link href="/student/courses">
                    <BookOpen />
                    <span>My Courses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/student/achievements'}
                >
                  <Link href="/student/achievements">
                    <Trophy />
                    <span>Achievements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/student/study-plan'}
                >
                  <Link href="/student/study-plan">
                    <ClipboardList />
                    <span>Study Plan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
         <div className="flex flex-col flex-1">
          <header className="p-4 border-b flex items-center md:hidden">
            <div className="ml-auto flex items-center gap-2">
                 {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
                            <AvatarFallback>
                              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <SidebarTrigger />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-muted/20">
            {children}
          </main>
        </div>
        <MobileBottomNav links={mobileNavLinks} />
      </div>
    </SidebarProvider>
    </>
  );
}

export default withAuth(StudentLayout, ['student']);
