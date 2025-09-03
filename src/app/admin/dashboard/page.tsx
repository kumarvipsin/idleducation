
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

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
          </Card>
           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              </CardContent>
          </Card>
           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved Students</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.newStudents}</div>
              </CardContent>
          </Card>
           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deny Users</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.deniedUsers}</div>
              </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Free Demo</CardTitle>
                  <Presentation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <p className="text-xs text-muted-foreground">+{stats.monthlyBookings} this month</p>
              </CardContent>
          </Card>
           <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Us</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">+{stats.monthlySubmissions} this month</p>
              </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUpdates}</div>
                  <p className="text-xs text-muted-foreground">+{stats.monthlyUpdates} this month</p>
              </CardContent>
          </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.monthlyActiveUsers} this month
                </p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
            </CardContent>
        </Card>
      </div>
      
      <div>
        <UserApproval />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
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
         <Card className="lg:col-span-2 xl:col-span-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardHeader>
                <CardTitle>User Composition</CardTitle>
                <CardDescription>Distribution of various user statuses.</CardDescription>
            </CardHeader>
            <CardContent>
                <UserCompositionChart />
            </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <RecentUpdates />
        </div>
      </div>

    </div>
  );
}
