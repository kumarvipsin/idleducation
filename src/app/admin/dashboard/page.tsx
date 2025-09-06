
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart, GraduationCap, UserPlus, Bell, XCircle, Briefcase, Presentation, MessageCircle, Megaphone, UserCheck, UserX } from "lucide-react";
import { OverviewChart } from "./overview-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentUpdates } from "./recent-updates";
import React, { useEffect, useState } from "react";
import { getTotalUsersCount, getTotalStudentsCount, getNewStudentsCount, getTotalTeachersCount, getDeniedUsersCount, getTotalSessionBookingsCount, getMonthlySessionBookingsCount, getTotalContactSubmissionsCount, getMonthlyContactSubmissionsCount, getTotalUpdatesCount, getMonthlyUpdatesCount, getActiveUsersCount, getMonthlyActiveUsersCount, getInactiveUsersCount } from "@/app/actions";
import { UserApproval } from "./user-approval";
import { UserCompositionChart } from "./user-composition-chart";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: '0',
    totalStudents: '0',
    newStudents: '0',
    totalTeachers: '0',
    deniedUsers: '0',
    totalBookings: '0',
    monthlyBookings: '0',
    totalSubmissions: '0',
    monthlySubmissions: '0',
    totalUpdates: '0',
    monthlyUpdates: '0',
    activeUsers: '0',
    monthlyActiveUsers: '0',
    inactiveUsers: '0',
  });

  useEffect(() => {
    async function fetchStats() {
      const [
        totalUsersRes,
        totalStudentsRes,
        newStudentsRes,
        totalTeachersRes,
        deniedUsersRes,
        totalBookingsRes,
        monthlyBookingsRes,
        totalSubmissionsRes,
        monthlySubmissionsRes,
        totalUpdatesRes,
        monthlyUpdatesRes,
        activeUsersRes,
        monthlyActiveUsersRes,
        inactiveUsersRes,
      ] = await Promise.all([
        getTotalUsersCount(),
        getTotalStudentsCount(),
        getNewStudentsCount(),
        getTotalTeachersCount(),
        getDeniedUsersCount(),
        getTotalSessionBookingsCount(),
        getMonthlySessionBookingsCount(),
        getTotalContactSubmissionsCount(),
        getMonthlyContactSubmissionsCount(),
        getTotalUpdatesCount(),
        getMonthlyUpdatesCount(),
        getActiveUsersCount(),
        getMonthlyActiveUsersCount(),
        getInactiveUsersCount(),
      ]);

      setStats({
        totalUsers: totalUsersRes.success ? String(totalUsersRes.count) : 'N/A',
        totalStudents: totalStudentsRes.success ? String(totalStudentsRes.count) : 'N/A',
        newStudents: newStudentsRes.success ? String(newStudentsRes.count) : 'N/A',
        totalTeachers: totalTeachersRes.success ? String(totalTeachersRes.count) : 'N/A',
        deniedUsers: deniedUsersRes.success ? String(deniedUsersRes.count) : 'N/A',
        totalBookings: totalBookingsRes.success ? String(totalBookingsRes.count) : 'N/A',
        monthlyBookings: monthlyBookingsRes.success ? String(monthlyBookingsRes.count) : 'N/A',
        totalSubmissions: totalSubmissionsRes.success ? String(totalSubmissionsRes.count) : 'N/A',
        monthlySubmissions: monthlySubmissionsRes.success ? String(monthlySubmissionsRes.count) : 'N/A',
        totalUpdates: totalUpdatesRes.success ? String(totalUpdatesRes.count) : 'N/A',
        monthlyUpdates: monthlyUpdatesRes.success ? String(monthlyUpdatesRes.count) : 'N/A',
        activeUsers: activeUsersRes.success ? String(activeUsersRes.count) : 'N/A',
        monthlyActiveUsers: monthlyActiveUsersRes.success ? String(monthlyActiveUsersRes.count) : 'N/A',
        inactiveUsers: inactiveUsersRes.success ? String(inactiveUsersRes.count) : 'N/A',
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: <Users className="h-4 w-4 text-muted-foreground" />, colors: "from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20" },
    { title: "Total Students", value: stats.totalStudents, icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />, colors: "from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20" },
    { title: "Total Teachers", value: stats.totalTeachers, icon: <Briefcase className="h-4 w-4 text-muted-foreground" />, colors: "from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20" },
    { title: "Approved Students", value: stats.newStudents, icon: <UserPlus className="h-4 w-4 text-muted-foreground" />, colors: "from-sky-100 to-sky-200 dark:from-sky-900/20 dark:to-sky-800/20" },
    { title: "Deny Users", value: stats.deniedUsers, icon: <XCircle className="h-4 w-4 text-muted-foreground" />, colors: "from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20" },
    { title: "Free Demo", value: stats.totalBookings, monthly: stats.monthlyBookings, icon: <Presentation className="h-4 w-4 text-muted-foreground" />, colors: "from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20" },
    { title: "Contact Us", value: stats.totalSubmissions, monthly: stats.monthlySubmissions, icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />, colors: "from-pink-100 to-pink-200 dark:from-pink-900/20 dark:to-pink-800/20" },
    { title: "Recent Updates", value: stats.totalUpdates, monthly: stats.monthlyUpdates, icon: <Megaphone className="h-4 w-4 text-muted-foreground" />, colors: "from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20" },
  ];
  
  const userStatusCards = [
      { title: "Active Users", value: stats.activeUsers, monthly: stats.monthlyActiveUsers, icon: <UserCheck className="h-4 w-4 text-muted-foreground" />, colors: "from-teal-100 to-teal-200 dark:from-teal-900/20 dark:to-teal-800/20" },
      { title: "Inactive Users", value: stats.inactiveUsers, icon: <UserX className="h-4 w-4 text-muted-foreground" />, colors: "from-slate-100 to-slate-200 dark:from-slate-900/20 dark:to-slate-800/20" },
  ]

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {statCards.map((card, index) => (
              <Card key={card.title} className={`bg-gradient-to-br ${card.colors} animate-fade-in-up`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                      {card.icon}
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      {card.monthly && <p className="text-xs text-muted-foreground">+{card.monthly} this month</p>}
                  </CardContent>
              </Card>
          ))}
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStatusCards.map((card, index) => (
             <Card key={card.title} className={`bg-gradient-to-br ${card.colors} animate-fade-in-up`} style={{ animationDelay: `${(statCards.length + index) * 0.05}s` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    {card.monthly && <p className="text-xs text-muted-foreground">+{card.monthly} this month</p>}
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <UserApproval />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
                <CardTitle>Users Overview</CardTitle>
                <CardDescription>Monthly statistics for user and student engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="w-full min-w-[600px]">
                  <OverviewChart />
                </div>
              </ScrollArea>
            </CardContent>
        </Card>
         <Card className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
                <CardTitle>User Composition</CardTitle>
                <CardDescription>Distribution of various user statuses.</CardDescription>
            </CardHeader>
            <CardContent>
                <UserCompositionChart />
            </CardContent>
        </Card>
        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <RecentUpdates />
        </div>
      </div>

    </div>
  );
}
