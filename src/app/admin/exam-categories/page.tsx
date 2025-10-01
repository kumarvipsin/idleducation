
'use client';

import { useEffect, useState, useRef } from 'react';
import { getExamCategories, addExamCategory, editExamCategory, deleteExamCategory } from '@/app/actions';
import { getTeachers } from '@/app/actions/user';
import type { TExamCategory } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Users, Image as ImageIcon, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';
import { ImageCropper } from '@/components/image-cropper';

interface User {
  id: string;
  name: string;
}

const ExamCategoryForm = ({
  category,
  teachers,
  onSuccess,
}: {
  category?: TExamCategory | null;
  teachers: User[];
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<'school' | 'competitive' | undefined>(category?.group);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>(category?.teacherIds || []);
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);

  useEffect(() => {
    setSelectedGroup(category?.group);
    setSelectedTeacherIds(category?.teacherIds || []);
    setPhotoPreview(null);
    setCroppedPhoto(null);
    setRemovePhoto(false);
  }, [category]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    
    selectedTeacherIds.forEach(id => {
      formData.append('teacherIds[]', id);
    });
    
    if (croppedPhoto) {
        formData.append('imageFile', croppedPhoto);
    }
    if (removePhoto) {
        formData.append('removePhoto', 'true');
    }

    const apiCall = category
      ? editExamCategory(category.id, formData)
      : addExamCategory(formData);

    const apiResult = await apiCall;

    if (apiResult.success) {
      toast({ title: 'Success', description: apiResult.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: apiResult.message });
    }
    setIsSubmitting(false);
  };
  
  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeacherIds(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemovePhoto(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onImageCropped = (croppedImageFile: File) => {
    setCroppedPhoto(croppedImageFile);
    setPhotoPreview(URL.createObjectURL(croppedImageFile));
  };
  
  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setCroppedPhoto(null);
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" defaultValue={category?.name} className="col-span-3" required/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">Group</Label>
            <Select name="group" value={selectedGroup} onValueChange={(value) => setSelectedGroup(value as 'school' | 'competitive')}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="school">School Exams</SelectItem>
                    <SelectItem value="competitive">Competitive Exams</SelectItem>
                </SelectContent>
            </Select>
          </div>
          {selectedGroup && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teachers" className="text-right">Teachers</Label>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="col-span-3 justify-between">
                          <span>{selectedTeacherIds.length > 0 ? `${selectedTeacherIds.length} selected` : 'Select Teachers'}</span>
                          <Users className="ml-2 h-4 w-4 text-muted-foreground" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                      <DropdownMenuLabel>Assign Teachers</DropdownMenuLabel>
                      <ScrollArea className="h-48">
                          {teachers.map(teacher => (
                              <DropdownMenuCheckboxItem
                                  key={teacher.id}
                                  checked={selectedTeacherIds.includes(teacher.id)}
                                  onCheckedChange={() => handleTeacherSelection(teacher.id)}
                                  onSelect={(e) => e.preventDefault()}
                              >
                                  {teacher.name}
                              </DropdownMenuCheckboxItem>
                          ))}
                      </ScrollArea>
                  </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Image</Label>
            <div className="col-span-3 flex items-center gap-4">
                {photoPreview && !removePhoto ? (
                    <Image src={photoPreview} alt="Image Preview" width={64} height={36} className="rounded-md object-cover aspect-video" /> 
                ) : (category?.imageUrl && !removePhoto) ? (
                    <GcsImage filePath={category.imageUrl} alt={category.name} width={64} height={36} className="rounded-md object-cover aspect-video" /> 
                ) : (
                    <div className="w-16 h-9 bg-muted rounded-md flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>
                )}
                <div className="flex flex-col gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => document.getElementById('image')?.click()}><Upload className="w-4 h-4 mr-2"/>Upload</Button>
                    <Input id="image" name="imageFile" type="file" onChange={handleFileChange} className="hidden" />
                    {(category?.imageUrl || photoPreview) && !removePhoto && <Button type="button" onClick={handleRemovePhoto} variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Remove</Button>}
                </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order" className="text-right">Order</Label>
            <Input id="order" name="order" type="number" defaultValue={category?.order ?? 99} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
      <ImageCropper 
        isOpen={isCropperOpen} 
        onClose={() => setIsCropperOpen(false)} 
        imageSrc={photoPreview} 
        onImageCropped={onImageCropped} 
        aspectRatio={16/9}
      />
    </>
  );
};

export default function AdminExamCategoriesPage() {
  const [categories, setCategories] = useState<TExamCategory[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TExamCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<TExamCategory | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [categoriesResult, teachersResult] = await Promise.all([
      getExamCategories(),
      getTeachers(),
    ]);

    if (categoriesResult.success && categoriesResult.data) {
      setCategories(categoriesResult.data as TExamCategory[]);
    }
    if (teachersResult.success && teachersResult.data) {
      setTeachers(teachersResult.data as User[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    const result = await deleteExamCategory(deletingCategory.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchData();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingCategory(null);
  };
  
  const schoolExams = categories.filter(c => c.group === 'school').sort((a,b) => (a.order || 99) - (b.order || 99));
  const competitiveExams = categories.filter(c => c.group === 'competitive').sort((a,b) => (a.order || 99) - (b.order || 99));
  
  const getTeacherNames = (teacherIds: string[] = []) => {
    if (!Array.isArray(teacherIds) || teacherIds.length === 0) return 'N/A';
    return teacherIds
      .map(id => teachers.find(t => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
      if (!isOpen) setEditingCategory(null);
      setIsDialogOpen(isOpen);
    }}>
       <AlertDialog open={!!deletingCategory} onOpenChange={(isOpen) => !isOpen && setDeletingCategory(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Exam Categories</CardTitle>
              <CardDescription>Add, edit, or delete categories for the homepage.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">School Exams</h3>
                    <ScrollArea className="h-[calc(100vh-350px)]">
                        <Table>
                            <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Teachers</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {loading ? [...Array(5)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell></TableRow>)) : schoolExams.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                      {cat.imageUrl ? <GcsImage filePath={cat.imageUrl} alt={cat.name} width={40} height={40} className="rounded-md object-cover" /> : <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>}
                                    </TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell className="text-xs">{getTeacherNames(cat.teacherIds)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => { setEditingCategory(cat); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon" onClick={() => setDeletingCategory(cat)}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                    </TableCell>
                                </TableRow>))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Competitive Exams</h3>
                    <ScrollArea className="h-[calc(100vh-350px)]">
                        <Table>
                            <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Teachers</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {loading ? [...Array(5)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-12" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell></TableRow>)) : competitiveExams.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                      {cat.imageUrl ? <GcsImage filePath={cat.imageUrl} alt={cat.name} width={40} height={40} className="rounded-md object-cover" /> : <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>}
                                    </TableCell>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell className="text-xs">{getTeacherNames(cat.teacherIds)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => { setEditingCategory(cat); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon" onClick={() => setDeletingCategory(cat)}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                    </TableCell>
                                </TableRow>))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
          </CardContent>
        </Card>
         <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit' : 'Add'} Category</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the details for this category.' : 'Create a new category for the homepage.'}
            </DialogDescription>
          </DialogHeader>
          <ExamCategoryForm category={editingCategory} teachers={teachers} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category: <span className="font-semibold">{deletingCategory?.name}</span>. This action cannot be undone.
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
