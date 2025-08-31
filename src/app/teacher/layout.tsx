
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
import { BookOpen, LayoutDashboard, User, LogOut, Users, Upload, FileText } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">IDL EDUCATION</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="mt-5">
            <SidebarMenu>
               <SidebarMenuItem className="my-4">
                <SidebarMenuButton asChild isActive={pathname.startsWith('/teacher/profile')} className="h-auto py-2">
                  <Link href="/teacher/profile">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Teacher'} />
                      <AvatarFallback>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/teacher/dashboard'}
                >
                  <Link href="/teacher/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/teacher/students')}
                >
                  <Link href="/teacher/students">
                    <Users />
                    <span>Students</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/teacher/classes')}
                >
                  <Link href="/teacher/classes">
                    <BookOpen />
                    <span>My Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/teacher/reports')}
                >
                  <Link href="/teacher/reports">
                    <FileText />
                    <span>Progress Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/teacher/materials')}
                >
                  <Link href="/teacher/materials">
                    <Upload />
                    <span>Materials</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1">
          <header className="p-4 border-b flex items-center">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold ml-4">
              {user ? `Hi, ${user.name || 'Teacher'}` : 'Teacher Dashboard'}
            </h1>
          </header>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default withAuth(TeacherLayout, ['teacher']);
