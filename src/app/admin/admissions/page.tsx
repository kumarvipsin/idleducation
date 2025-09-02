
'use client';

import { useEffect, useState } from 'react';
import { getAdmissions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { User, Mail, Phone, Calendar, Home, GraduationCap, Building, Info, Briefcase } from 'lucide-react';

interface Admission {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  fatherOccupation?: string;
  motherName: string;
  motherOccupation?: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  classApplied: string;
  previousSchool?: string;
  additionalInfo?: string;
  createdAt: string;
  studentPhotoUrl?: string; // Assuming the photo URL is stored
}

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);

  useEffect(() => {
    const fetchAdmissions = async () => {
      setLoading(true);
      const result = await getAdmissions();
      if (result.success && result.data) {
        setAdmissions(result.data as Admission[]);
      }
      setLoading(false);
    };
    fetchAdmissions();
  }, []);

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
        </TableRow>
    ))
  );

  return (
    <Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Admission Submissions</CardTitle>
          <CardDescription>All submitted admission forms from students.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-220px)] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : admissions.length > 0 ? (
                  admissions.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell className="font-mono">{admission.studentId}</TableCell>
                      <TableCell className="font-medium">{admission.studentName}</TableCell>
                      <TableCell>{admission.classApplied}</TableCell>
                      <TableCell>
                        <div>{admission.email}</div>
                        <div>{admission.phone}</div>
                      </TableCell>
                      <TableCell>
                        {admission.createdAt ? format(new Date(admission.createdAt), 'PPp') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                         <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAdmission(admission)}>
                                View Details
                            </Button>
                        </DialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No admission forms have been submitted yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {selectedAdmission && (
          <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                  <DialogTitle>Admission Details: {selectedAdmission.studentName}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                         <div className="w-[132px] h-[170px] rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                           {selectedAdmission.studentPhotoUrl ? (
                              <Image src={selectedAdmission.studentPhotoUrl} alt="Student photo" width={132} height={170} className="object-cover h-full w-full"/>
                            ) : (
                              <div className="text-center text-muted-foreground p-2">
                                  <User className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-xs">No Photo</p>
                              </div>
                            )}
                         </div>
                      </div>
                      <div className="md:col-span-2 space-y-4 text-sm">
                          <h3 className="font-bold text-lg border-b pb-2">Student Information</h3>
                          <div className="grid grid-cols-2 gap-2">
                              <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/><strong>Name:</strong> {selectedAdmission.studentName}</p>
                              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/><strong>DOB:</strong> {selectedAdmission.dob}</p>
                              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/><strong>Email:</strong> {selectedAdmission.email}</p>
                              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground"/><strong>Phone:</strong> {selectedAdmission.phone}</p>
                          </div>
                          <p className="flex items-start gap-2"><Home className="h-4 w-4 text-muted-foreground mt-1"/><strong>Address:</strong> {selectedAdmission.address}</p>
                          
                          <h3 className="font-bold text-lg border-b pb-2 pt-4">Family Information</h3>
                          <div className="grid grid-cols-2 gap-2">
                              <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/><strong>Father:</strong> {selectedAdmission.fatherName}</p>
                              <p className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/><strong>Occupation:</strong> {selectedAdmission.fatherOccupation || 'N/A'}</p>
                              <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/><strong>Mother:</strong> {selectedAdmission.motherName}</p>
                              <p className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground"/><strong>Occupation:</strong> {selectedAdmission.motherOccupation || 'N/A'}</p>
                          </div>

                          <h3 className="font-bold text-lg border-b pb-2 pt-4">Academic Information</h3>
                          <div className="grid grid-cols-2 gap-2">
                               <p className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/><strong>Class Applied:</strong> {selectedAdmission.classApplied}</p>
                               <p className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground"/><strong>Previous School:</strong> {selectedAdmission.previousSchool || 'N/A'}</p>
                          </div>
                          <p className="flex items-start gap-2"><Info className="h-4 w-4 text-muted-foreground mt-1"/><strong>Additional Info:</strong> {selectedAdmission.additionalInfo || 'N/A'}</p>
                      </div>
                  </div>
              </ScrollArea>
          </DialogContent>
      )}
    </Dialog>
  );
}
