
'use client';

import { useEffect, useState } from 'react';
import { getExcellenceResults, addExcellenceResult, editExcellenceResult, deleteExcellenceResult } from '@/app/actions';
import type { TExcellenceResult } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';

const ExcellenceResultForm = ({
  result,
  onSuccess,
}: {
  result?: TExcellenceResult | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const apiCall = result
      ? editExcellenceResult(result.id, formData)
      : addExcellenceResult(formData);

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
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryName" className="text-right">Category Name</Label>
          <Input id="categoryName" name="categoryName" defaultValue={result?.categoryName} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="order" className="text-right">Order</Label>
          <Input id="order" name="order" type="number" defaultValue={result?.order ?? 99} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">Image</Label>
          <div className="col-span-3 flex items-center gap-4">
            {preview ? <Image src={preview} alt="Image Preview" width={64} height={36} className="rounded-md object-cover aspect-video" /> 
            : result?.imageUrl ? <GcsImage filePath={result.imageUrl} alt={result.categoryName} width={64} height={36} className="rounded-md object-cover aspect-video" />
            : <div className="w-16 h-9 bg-muted rounded-md flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>}
            <Input id="image" name="image" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function AdminExcellenceResultsPage() {
  const [results, setResults] = useState<TExcellenceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<TExcellenceResult | null>(null);
  const [deletingResult, setDeletingResult] = useState<TExcellenceResult | null>(null);
  const { toast } = useToast();

  const fetchResults = async () => {
    setLoading(true);
    const result = await getExcellenceResults();
    if (result.success && result.data) {
      setResults(result.data as TExcellenceResult[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingResult(null);
    fetchResults();
  };

  const handleDelete = async () => {
    if (!deletingResult) return;
    const result = await deleteExcellenceResult(deletingResult.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchResults();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingResult(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <AlertDialog open={!!deletingResult} onOpenChange={(isOpen) => !isOpen && setDeletingResult(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Excellence Results</CardTitle>
              <CardDescription>Add, edit, or delete result images for categories.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingResult(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Result
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-16 w-32 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    results.sort((a,b) => a.order - b.order).map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="w-32 h-16 rounded-md flex items-center justify-center bg-muted overflow-hidden">
                            {result.imageUrl ? <GcsImage filePath={result.imageUrl} alt={result.categoryName} width={128} height={64} className="object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground"/>}
                          </div>
                        </TableCell>
                        <TableCell>{result.categoryName}</TableCell>
                        <TableCell>{result.order}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingResult(result); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingResult(result)}>
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
            <DialogTitle>{editingResult ? 'Edit' : 'Add'} Result</DialogTitle>
            <DialogDescription>
              {editingResult ? 'Update the details for this result.' : 'Create a new result to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>
          <ExcellenceResultForm result={editingResult} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the result for <span className="font-semibold">{deletingResult?.categoryName}</span>. This action cannot be undone.
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
