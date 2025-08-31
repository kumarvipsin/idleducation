
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart, GraduationCap, UserPlus, Bell, XCircle, Briefcase } from "lucide-react";
import { OverviewChart } from "./overview-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentUpdates } from "./recent-updates";
import React, { useEffect, useState } from "react";
import { getTotalUsersCount, getTotalStudentsCount, getNewStudentsCount, getTotalTeachersCount, getDeniedStudentsCount } from "@/app/actions";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: '0',
    totalStudents: '0',
    newStudents: '0',
    totalTeachers: '0',
    deniedStudents: '0',
  });

  useEffect(() => {
    async function fetchStats() {
      const [
        totalUsersRes,
        totalStudentsRes,
        newStudentsRes,
        totalTeachersRes,
        deniedStudentsRes,
      ] = await Promise.all([
        getTotalUsersCount(),
        getTotalStudentsCount(),
        getNewStudentsCount(),
        getTotalTeachersCount(),
        getDeniedStudentsCount(),
      ]);

      setStats({
        totalUsers: totalUsersRes.success ? String(totalUsersRes.count) : 'N/A',
        totalStudents: totalStudentsRes.success ? String(totalStudentsRes.count) : 'N/A',
        newStudents: newStudentsRes.success ? String(newStudentsRes.count) : 'N/A',
        totalTeachers: totalTeachersRes.success ? String(totalTeachersRes.count) : 'N/A',
        deniedStudents: deniedStudentsRes.success ? String(deniedStudentsRes.count) : 'N/A',
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-blue-100/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUsers}</div>
              </CardContent>
          </Card>
          <Card className="bg-green-100/60 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalStudents}</div>
              </CardContent>
          </Card>
           <Card className="bg-pink-100/60 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-pink-800 dark:text-pink-200">Approved Students</CardTitle>
                  <UserPlus className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">{stats.newStudents}</div>
              </CardContent>
          </Card>
           <Card className="bg-yellow-100/60 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Total Teachers</CardTitle>
                  <Briefcase className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.totalTeachers}</div>
              </CardContent>
          </Card>
           <Card className="bg-red-100/60 dark:bg-red-900/30 border-red-200 dark:border-red-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Denied Students</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.deniedStudents}</div>
              </CardContent>
          </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
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
        <div className="lg:col-span-2">
          <RecentUpdates />
        </div>
      </div>

    </div>
  );
}
