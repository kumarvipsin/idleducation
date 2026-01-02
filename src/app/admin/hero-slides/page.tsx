
'use client';

import { useEffect, useState } from 'react';
import { getCollection, addHeroSlide, editHeroSlide, deleteHeroSlide } from '@/app/actions';
import type { THeroSlide } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';
import { Textarea } from '@/components/ui/textarea';

const HeroSlideForm = ({
  slide,
  onSuccess,
}: {
  slide?: THeroSlide | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const apiCall = slide
      ? editHeroSlide(slide.id, formData)
      : addHeroSlide(formData);

    const result = await apiCall;

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-96 pr-4">
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" name="title" defaultValue={slide?.title} className="col-span-3" required /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Textarea id="description" name="description" defaultValue={slide?.description} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="buttonText" className="text-right">Button Text</Label><Input id="buttonText" name="buttonText" defaultValue={slide?.buttonText} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="buttonLink" className="text-right">Button Link</Label><Input id="buttonLink" name="buttonLink" defaultValue={slide?.buttonLink} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="order" className="text-right">Order</Label><Input id="order" name="order" type="number" defaultValue={slide?.order ?? 99} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">Image</Label>
                <div className="col-span-3 flex flex-col gap-2">
                    <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden border">
                    {preview ? <Image src={preview} alt="Image Preview" width={300} height={169} className="object-cover" /> 
                    : slide?.imageUrl ? <GcsImage filePath={slide.imageUrl} alt={slide.title} width={300} height={169} className="object-cover" />
                    : <ImageIcon className="w-8 h-8 text-muted-foreground"/>}
                    </div>
                    <Input id="image" name="image" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" required={!slide} />
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
  );
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<THeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<THeroSlide | null>(null);
  const [deletingSlide, setDeletingSlide] = useState<THeroSlide | null>(null);
  const { toast } = useToast();

  const fetchSlides = async () => {
    setLoading(true);
    const result = await getCollection('heroSlides');
    if (result.success && result.data) {
      setSlides(result.data as THeroSlide[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingSlide(null);
    fetchSlides();
  };

  const handleDelete = async () => {
    if (!deletingSlide) return;
    const result = await deleteHeroSlide(deletingSlide.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchSlides();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingSlide(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <AlertDialog open={!!deletingSlide} onOpenChange={(isOpen) => !isOpen && setDeletingSlide(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Hero Slides</CardTitle>
              <CardDescription>Add, edit, or delete slides for the homepage hero section.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingSlide(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Slide
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-16 w-32 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    slides.sort((a,b) => a.order - b.order).map((slide) => (
                      <TableRow key={slide.id}>
                        <TableCell>
                          <div className="w-32 h-16 rounded-md flex items-center justify-center bg-muted overflow-hidden">
                            {slide.imageUrl ? <GcsImage filePath={slide.imageUrl} alt={slide.title} width={128} height={64} className="object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground"/>}
                          </div>
                        </TableCell>
                        <TableCell>{slide.title}</TableCell>
                        <TableCell>{slide.order}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingSlide(slide); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingSlide(slide)}>
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
            <DialogTitle>{editingSlide ? 'Edit' : 'Add'} Hero Slide</DialogTitle>
            <DialogDescription>
              {editingSlide ? 'Update the details for this slide.' : 'Create a new slide for the homepage hero section.'}
            </DialogDescription>
          </DialogHeader>
          <HeroSlideForm slide={editingSlide} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the slide: <span className="font-semibold">{deletingSlide?.title}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
