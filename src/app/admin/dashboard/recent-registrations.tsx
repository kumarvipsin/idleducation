
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Student {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  classCourse?: string;
}

export function RecentRegistrations() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentStudents = async () => {
      try {
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(studentsQuery);
        const recentStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];
        setStudents(recentStudents);
      } catch (error) {
        console.error('Error fetching recent students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStudents();
  }, []);

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
         <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="grid gap-1 flex-1">
               <Skeleton className="h-4 w-3/4" />
               <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-4 w-1/4" />
         </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>Today's newest students.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          renderSkeleton()
        ) : students.length > 0 ? (
          students.map(student => (
            <div key={student.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={student.photoURL} alt={student.name} data-ai-hint="person" />
                <AvatarFallback>
                  {student.name
                    ? student.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    : 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
              <div className="ml-auto font-medium">{student.classCourse || 'N/A'}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center">No new registrations today.</p>
        )}
      </CardContent>
    </Card>
  );
}
