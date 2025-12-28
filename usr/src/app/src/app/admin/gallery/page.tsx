
'use client';

import { useEffect, useState } from 'react';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GcsImage } from '@/components/gcs-image';

type GalleryImage = {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  alt?: string;
  className?: string;
};

const GalleryImageForm = ({ onSuccess, existingCategories }: { onSuccess: () => void, existingCategories: string[] }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState<'existing' | 'new'>(existingCategories.length > 0 ? 'existing' : 'new');

  useEffect(() => {
    // If categories become available or unavailable, adjust the default selection
    if (existingCategories.length === 0) {
      setCategoryType('new');
    }
  }, [existingCategories]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const category = categoryType === 'new' ? formData.get('newCategory') : formData.get('category');
    formData.set('category', category as string);
    
    const result = await addGalleryImage(formData);

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
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Category</Label>
          <div className='col-span-3 flex gap-2'>
            <Button type="button" variant={categoryType === 'existing' ? 'default' : 'outline'} onClick={() => setCategoryType('existing')} disabled={existingCategories.length === 0}>Existing</Button>
            <Button type="button" variant={categoryType === 'new' ? 'default' : 'outline'} onClick={() => setCategoryType('new')}>New</Button>
          </div>
        </div>
        {categoryType === 'existing' ? (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right sr-only">Category</Label>
            <Select name="category" required>
                <SelectTrigger className="col-span-3 col-start-2">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {existingCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="newCategory" className="text-right sr-only">New Category</Label>
             <Input id="newCategory" name="newCategory" placeholder="Enter new category name" className="col-span-3 col-start-2" required />
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="layout" className="text-right">Layout</Label>
          <Select name="layout" defaultValue="default">
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select layout size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="col-span-2">Wide</SelectItem>
                    <SelectItem value="row-span-2">Tall</SelectItem>
                    <SelectItem value="col-span-2 row-span-2">Large</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">Image</Label>
          <div className="col-span-3 flex items-center gap-4">
            {preview && <Image src={preview} alt="Image Preview" width={64} height={64} className="rounded-md object-cover" />}
            <Input id="image" name="image" type="file" onChange={handleFileChange} required className="col-span-3" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          <Upload className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Uploading...' : 'Upload Image'}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const { toast } = useToast();

  const existingCategories = Array.from(new Set(images.map(img => img.category)));

  const fetchImages = async () => {
    setLoading(true);
    const result = await getGalleryImages();
    if (result.success && result.data) {
      setImages(result.data as GalleryImage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);
  
  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchImages();
  };

  const handleDelete = async () => {
    if (!deletingImage) return;
    const result = await deleteGalleryImage(deletingImage.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchImages();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingImage(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deletingImage} onOpenChange={(isOpen) => !isOpen && setDeletingImage(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Gallery</CardTitle>
              <CardDescription>Add or delete images from the public gallery.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="relative group">
                      <GcsImage filePath={image.imageUrl} alt={image.title} fill className="rounded-lg object-cover w-full aspect-square" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2 text-center text-white">
                        <p className="text-xs font-bold truncate">{image.title}</p>
                        <p className="text-xs text-muted-foreground">{image.category}</p>
                         <AlertDialogTrigger asChild>
                           <Button variant="destructive" size="sm" className="mt-2" onClick={() => setDeletingImage(image)}>
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </AlertDialogTrigger>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Image to Gallery</DialogTitle>
            <DialogDescription>
              Upload a new image. It will be visible on the public gallery page.
            </DialogDescription>
          </DialogHeader>
          <GalleryImageForm onSuccess={handleSuccess} existingCategories={existingCategories} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image titled "<span className="font-semibold">{deletingImage?.title}</span>". This action cannot be undone.
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
