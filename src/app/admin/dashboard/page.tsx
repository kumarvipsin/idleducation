
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart, GraduationCap, UserPlus, Bell } from "lucide-react";
import { SessionBookings } from "./session-bookings";
import { OverviewChart } from "./overview-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentRegistrations } from "./recent-registrations";
import { ContactSubmissions } from "./contact-submissions";
import { RecentUpdates } from "./recent-updates";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-blue-100/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">2201</div>
              </CardContent>
          </Card>
          <Card className="bg-green-100/60 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Total Students</CardTitle>
                  <GraduationCap className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">1901</div>
              </CardContent>
          </Card>
           <Card className="bg-pink-100/60 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-pink-800 dark:text-pink-200">New Students</CardTitle>
                  <UserPlus className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-pink-900 dark:text-pink-100">1001</div>
              </CardContent>
          </Card>
           <Card className="bg-yellow-100/60 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Trained Students</CardTitle>
                  <BarChart className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">881</div>
              </CardContent>
          </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Users Overview</CardTitle>
                <CardDescription>Monthly statistics for user and student engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                <div className="w-full min-w-[700px]">
                  <OverviewChart />
                </div>
              </ScrollArea>
            </CardContent>
        </Card>
        
        <div className="space-y-6">
            <RecentRegistrations />
             <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Bell className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="text-sm font-medium">New Session Booked</p>
                            <p className="text-sm text-muted-foreground">A new free session was booked by Rohan. <span className="font-semibold">Check bookings</span>.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="grid gap-6">
          <SessionBookings />
      </div>
    </div>
  );
}
