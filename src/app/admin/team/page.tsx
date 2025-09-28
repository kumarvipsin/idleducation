
'use client';

import { useEffect, useState } from 'react';
import { getTeamMembers, addTeamMember, editTeamMember, deleteTeamMember } from '@/app/actions';
import type { TTeamMember } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropper } from '@/components/image-cropper';
import { GcsImage } from '@/components/gcs-image';
import { Textarea } from '@/components/ui/textarea';

const TeamMemberForm = ({
  member,
  onSuccess,
}: {
  member?: TTeamMember | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(member?.avatarUrl || null);
  const [photoForCropper, setPhotoForCropper] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    // Reset state when the member prop changes
    setPreview(member?.avatarUrl || null);
    setPhotoForCropper(null);
    setCroppedPhoto(null);
    setRemovePhoto(false);
  }, [member]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    if (croppedPhoto) {
        formData.append('avatar', croppedPhoto);
    }
    if (removePhoto) {
        formData.append('removePhoto', 'true');
    }
    
    const apiCall = member
      ? editTeamMember(member.id, formData)
      : addTeamMember(formData);

    const apiResult = await apiCall;

    if (apiResult.success) {
      toast({ title: 'Success', description: apiResult.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: apiResult.message });
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoForCropper(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onImageCropped = (croppedImageFile: File) => {
    setCroppedPhoto(croppedImageFile);
    setPreview(URL.createObjectURL(croppedImageFile)); 
  };
  
  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPreview(null);
    setCroppedPhoto(null);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-96 pr-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" defaultValue={member?.name} className="col-span-3" required/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="designation" className="text-right">Designation</Label>
            <Input id="designation" name="designation" defaultValue={member?.designation} className="col-span-3" required/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right">Experience</Label>
            <Input id="experience" name="experience" defaultValue={member?.experience} className="col-span-3" required/>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="biography" className="text-right">Biography</Label>
            <Textarea id="biography" name="biography" defaultValue={member?.biography} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order" className="text-right">Order</Label>
            <Input id="order" name="order" type="number" defaultValue={member?.order ?? 99} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar-upload" className="text-right">Avatar</Label>
            <div className="col-span-3 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <Avatar>
                        {(preview && !removePhoto) ? <AvatarImage src={preview} alt="Avatar Preview" /> : (member?.avatarUrl && !removePhoto) ? <GcsImage filePath={member.avatarUrl} alt={member.name} width={40} height={40} className="rounded-full" /> : <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback> }
                    </Avatar>
                     <Input id="avatar-upload" name="avatar-upload" type="file" onChange={handleFileChange} className="col-span-3" />
                </div>
                 {(member?.avatarUrl || preview) && (
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemovePhoto} className="w-fit">
                        <Trash2 className="w-4 h-4 mr-2"/> Remove Photo
                    </Button>
                )}
            </div>
          </div>
        </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
      <ImageCropper 
        isOpen={isCropperOpen} 
        onClose={() => setIsCropperOpen(false)} 
        imageSrc={photoForCropper} 
        onImageCropped={onImageCropped} 
        aspectRatio={1}
      />
    </>
  );
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TTeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TTeamMember | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    setLoading(true);
    const result = await getTeamMembers();
    if (result.success && result.data) {
      setMembers(result.data as TTeamMember[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    fetchMembers();
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    const result = await deleteTeamMember(deletingMember.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchMembers();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingMember(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <AlertDialog open={!!deletingMember} onOpenChange={(isOpen) => !isOpen && setDeletingMember(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Team Members</CardTitle>
              <CardDescription>Add, edit, or delete team members.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMember(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Avatar>
                             {member.avatarUrl ? <GcsImage filePath={member.avatarUrl} alt={member.name} width={40} height={40} className="rounded-full" /> : <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>}
                          </Avatar>
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.designation}</TableCell>
                        <TableCell>{member.experience}</TableCell>
                        <TableCell>{member.order}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingMember(member); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingMember(member)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
         <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update the details for this team member.' : 'Create a new team member to display on the website.'}
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm member={editingMember} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the team member: <span className="font-semibold">{deletingMember?.name}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
    
