
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
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BookOpen, LayoutDashboard, User, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { Header } from '@/components/header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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

  const navLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/student/courses', label: 'Courses', icon: <BookOpen className="h-4 w-4" /> },
    { href: '/student/study-plan', label: 'Study Plan', icon: <ClipboardList className="h-4 w-4" /> },
    { href: '/student/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <>
    <Header />
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="p-4 flex flex-col items-center border-b bg-muted/30">
             <Avatar className="h-16 w-16 mb-2 border-2 border-primary shadow-sm">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Student'} />
                <AvatarFallback>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </AvatarFallback>
            </Avatar>
            <div className="text-center">
                <p className="font-bold text-sm truncate max-w-[140px]">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{user?.role}</p>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <Link href={link.href}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
         <div className="flex flex-col flex-1">
          <header className="p-4 border-b flex items-center md:hidden bg-background">
            <SidebarTrigger />
            <span className="ml-4 font-bold text-primary">Student Panel</span>
            <div className="ml-auto flex items-center gap-2">
                 {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.name ?? ''} />
                            <AvatarFallback>
                              {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
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
                        <DropdownMenuItem asChild>
                            <Link href="/student/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 bg-muted/20">
            {children}
          </main>
        </div>
        <MobileBottomNav links={navLinks} />
      </div>
    </SidebarProvider>
    </>
  );
}

export default withAuth(StudentLayout, ['student']);
