
'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAdmissions, getSignedUrlForPdf } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { User, Mail, Phone, Calendar, Home, GraduationCap, Building, Info, Briefcase, MapPin, KeyRound, Droplets, VenetianMask, Building2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { normalizeBranchId, recordMatchesBranch } from '@/lib/branch-utils';

interface Admission {
  id: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  fatherOccupation?: string;
  motherName: string;
  motherOccupation?: string;
  dob: string;
  gender?: string;
  bloodGroup?: string;
  aadharNumber?: string;
  apaarId?: string;
  email: string;
  studentPhone?: string;
  fatherPhone: string;
  motherPhone: string;
  address: string;
  state: string;
  pincode: string;
  classApplied: string;
  previousSchool?: string;
  additionalInfo?: string;
  createdAt: string;
  studentPhotoUrl?: string; // This is now a file path
  branch?: string;
}

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined | null }) => (
    <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);

function AdmissionPhoto({ filePath }: { filePath: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignedUrl() {
      if (!filePath) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await getSignedUrlForPdf(filePath);
      if (result.success && result.url) {
        setImageUrl(result.url);
      }
      setLoading(false);
    }
    fetchSignedUrl();
  }, [filePath]);

  if (loading) {
    return <Skeleton className="h-full w-full" />;
  }
  
  if (imageUrl) {
    return <Image src={imageUrl} alt="Student photo" width={132} height={170} className="object-cover h-full w-full"/>
  }

  return (
    <div className="text-center text-muted-foreground p-2">
        <User className="w-8 h-8 mx-auto mb-2" />
        <p className="text-xs">No Photo</p>
    </div>
  );
}

export default function AdminAdmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedBranchId = normalizeBranchId(user?.branchId);
  const isBranchAdmin = Boolean(normalizedBranchId && normalizedBranchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? normalizedBranchId : null;

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>(branchAdminBranchId || 'all');
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);

  useEffect(() => {
    if (isBranchAdmin && branchAdminBranchId && selectedBranch !== branchAdminBranchId) {
      setSelectedBranch(branchAdminBranchId);
    }
  }, [isBranchAdmin, branchAdminBranchId]);

  useEffect(() => {
    if (authLoading || !user) return;
    const fetchAdmissions = async () => {
      setLoading(true);
      const result = await getAdmissions(isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : undefined);
      if (result.success && result.data) {
        setAdmissions(result.data as Admission[]);
      }
      setLoading(false);
    };
    fetchAdmissions();
  }, [authLoading, user?.uid, isBranchAdmin, branchAdminBranchId]);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter(item => {
      const targetBranch = isBranchAdmin ? branchAdminBranchId : selectedBranch;
      if (!targetBranch || targetBranch === 'all') return true;
      return recordMatchesBranch(item, targetBranch);
    });
  }, [admissions, isBranchAdmin, branchAdminBranchId, selectedBranch]);

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return format(date, "dd/MM/yyyy");
    } catch (error) {
        return 'N/A';
    }
  };

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
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Admission Submissions</CardTitle>
              {isBranchAdmin && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-600" />
                  {user?.branchName || 'Mangol Puri Branch'}
                </span>
              )}
            </div>
            <CardDescription className="mt-1">
              {isBranchAdmin
                ? `Showing admission forms received for ${user?.branchName || 'Mangol Puri'}.`
                : 'All submitted admission forms from students across all branches.'}
            </CardDescription>
          </div>
          {!isBranchAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-medium">Branch:</span>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="text-xs border rounded-md px-2.5 py-1.5 bg-background font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">🌐 All Branches</option>
                <option value="mangolpuri">🏢 Mangol Puri</option>
                <option value="budh-vihar">🏢 Budh Vihar</option>
                <option value="krishan-vihar">🏢 Krishan Vihar</option>
                <option value="mukherjee-nagar">🏢 Mukherjee Nagar</option>
              </select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-220px)] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? renderSkeleton() : filteredAdmissions.length > 0 ? (
                  filteredAdmissions.map((admission) => (
                    <TableRow key={admission.id}>
                      <TableCell className="font-mono">{admission.studentId}</TableCell>
                      <TableCell className="font-medium">{admission.studentName}</TableCell>
                      <TableCell>{admission.classApplied}</TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {admission.branch || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>{admission.email}</div>
                        <div>{admission.fatherPhone}</div>
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
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No admission forms found for this branch.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {selectedAdmission && (
          <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                  <DialogTitle>Admission Details: {selectedAdmission.studentName}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] p-1">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
                    {/* Left Column for Photo and Basic Info */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="w-[132px] h-[170px] rounded-md bg-muted flex items-center justify-center overflow-hidden border mx-auto">
                           {selectedAdmission.studentPhotoUrl ? (
                              <AdmissionPhoto filePath={selectedAdmission.studentPhotoUrl} />
                            ) : (
                              <div className="text-center text-muted-foreground p-2">
                                  <User className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-xs">No Photo</p>
                              </div>
                            )}
                        </div>
                        <Card>
                            <CardContent className="p-4 space-y-3">
                                <DetailItem icon={<KeyRound size={16}/>} label="Student ID" value={selectedAdmission.studentId} />
                                <DetailItem icon={<User size={16}/>} label="Name" value={selectedAdmission.studentName} />
                                <DetailItem icon={<Calendar size={16}/>} label="Date of Birth" value={formatDateForDisplay(selectedAdmission.dob)} />
                                <DetailItem icon={<VenetianMask size={16}/>} label="Gender" value={selectedAdmission.gender} />
                                <DetailItem icon={<Droplets size={16}/>} label="Blood Group" value={selectedAdmission.bloodGroup} />
                                <DetailItem icon={<KeyRound size={16}/>} label="Aadhar Number" value={selectedAdmission.aadharNumber} />
                                <DetailItem icon={<KeyRound size={16}/>} label="APAAR/ABC ID" value={selectedAdmission.apaarId} />
                                <DetailItem icon={<Mail size={16}/>} label="Email" value={selectedAdmission.email} />
                                <DetailItem icon={<Phone size={16}/>} label="Student Phone" value={selectedAdmission.studentPhone} />
                                <DetailItem icon={<MapPin size={16}/>} label="Branch" value={selectedAdmission.branch} />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="p-4">
                               <CardTitle className="text-base">Address</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm">
                                <p>{`${selectedAdmission.address}, ${selectedAdmission.state} - ${selectedAdmission.pincode}`}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column for Family and Academic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Family Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-primary">Father's Details</h4>
                                    <DetailItem icon={<User size={16}/>} label="Name" value={selectedAdmission.fatherName} />
                                    <DetailItem icon={<Briefcase size={16}/>} label="Occupation" value={selectedAdmission.fatherOccupation} />
                                    <DetailItem icon={<Phone size={16}/>} label="Phone" value={selectedAdmission.fatherPhone} />
                                </div>
                                 <div className="space-y-4">
                                    <h4 className="font-semibold text-primary">Mother's Details</h4>
                                    <DetailItem icon={<User size={16}/>} label="Name" value={selectedAdmission.motherName} />
                                    <DetailItem icon={<Briefcase size={16}/>} label="Occupation" value={selectedAdmission.motherOccupation} />
                                    <DetailItem icon={<Phone size={16}/>} label="Phone" value={selectedAdmission.motherPhone} />
                                </div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle className="text-lg">Academic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem icon={<GraduationCap size={16}/>} label="Class Applied For" value={selectedAdmission.classApplied} />
                                <DetailItem icon={<Building size={16}/>} label="Previous School" value={selectedAdmission.previousSchool} />
                                <DetailItem icon={<Info size={16}/>} label="Additional Information" value={selectedAdmission.additionalInfo} />
                            </CardContent>
                        </Card>
                    </div>
                 </div>
              </ScrollArea>
          </DialogContent>
      )}
    </Dialog>
  );
}
