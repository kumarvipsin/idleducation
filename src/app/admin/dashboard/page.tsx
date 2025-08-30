
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart } from "lucide-react";
import { SessionBookings } from "./session-bookings";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+50 since last week</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">+2 new courses added</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Site Activity</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">Active users today</p>
              </CardContent>
          </Card>
      </div>
      
      <SessionBookings />
      
      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add, edit, or remove users from the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p>User management interface will be here.</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Create, update, and manage courses and materials.</CardDescription>
              </CardHeader>
              <CardContent>
                  <p>Course management interface will be here.</p>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
