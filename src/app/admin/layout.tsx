
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
import { BookOpen, LayoutDashboard, User, LogOut, Users, Shield, Settings, Database, SlidersHorizontal, ShoppingCart, Settings2, File, CreditCard, GraduationCap, Briefcase, MessageSquare, Mail, Presentation, Bell, FileText, MessageCircle as FeedbackIcon, Award, LifeBuoy, Video, Star, Image as ImageIcon, Tags, ChevronDown, BookCheck, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import withAuth from '@/components/with-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { getNewSessionBookingsCount } from '@/app/actions';
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

  React.useEffect(() => {
    const fetchBookingsCount = async () => {
      const result = await getNewSessionBookingsCount();
      if (result.success) {
        setBookingCount(result.count);
      }
    };
    fetchBookingsCount();
  }, [pathname]); // Refetch on path change to update after marking as seen


  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
    <Header />
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
          </SidebarHeader>
          <SidebarContent className="mt-2">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/profile')} className="h-auto py-2">
                    <Link href="/admin/profile">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photoURL ?? ''} alt={user?.name ?? 'Admin'} />
                        <AvatarFallback>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
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
                    <SidebarMenuButton asChild isActive={pathname === '/admin/dashboard'}>
                    <Link href="/admin/dashboard">
                        <SlidersHorizontal />
                        <span>Dashboard</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
            <SidebarMenuAccordion defaultValue="user-management">
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
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/staff')}>
                            <Link href="/admin/staff">
                                <Users />
                                <span>Staff</span>
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
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/feedback')}>
                            <Link href="/admin/feedback">
                                <FeedbackIcon />
                                <span>Feedback</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/messages')}>
                            <Link href="/admin/messages">
                                <MessageSquare />
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
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/exam-categories')}>
                            <Link href="/admin/exam-categories">
                                <Tags />
                                <span>Exam Categories</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/notes')}>
                            <Link href="/admin/notes">
                                <FileText />
                                <span>Manage Notes</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/ncert-solutions')}>
                           <Link href="/admin/ncert-solutions">
                                <BookCheck />
                                <span>NCERT & Imp Qs</span>
                           </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/previous-year-questions')}>
                            <Link href="/admin/previous-year-questions">
                                <FileText />
                                <span>Prev. Year Questions</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/reference-books')}>
                            <Link href="/admin/reference-books">
                                <BookOpen />
                                <span>Reference Books</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/testimonials')}>
                            <Link href="/admin/testimonials">
                                <MessageSquare />
                                <span>Our Students Say</span>
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
                <SidebarMenuSub value="site-content">
                    <SidebarMenuSubButton>
                        <Settings2 />
                        <span>Site Content</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </SidebarMenuSubButton>
                    <SidebarMenuSubItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/gallery')}>
                            <Link href="/admin/gallery">
                                <ImageIcon />
                                <span>Gallery</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/director')}>
                            <Link href="/admin/director">
                                <UserCircle />
                                <span>Director Profile</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/team')}>
                            <Link href="/admin/team">
                                <Users />
                                <span>Team Members</span>
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
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            </SidebarMenuAccordion>
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
      </div>
    </SidebarProvider>
    </>
  );
}

export default withAuth(AdminLayout, ['admin']);
