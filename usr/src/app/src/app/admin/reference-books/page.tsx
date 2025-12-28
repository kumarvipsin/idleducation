
'use client';

import { useEffect, useState } from 'react';
import { addReferenceBook, editReferenceBook, deleteReferenceBook, getReferenceBooks } from '@/app/actions';
import type { TReferenceBook } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Upload, Star, Image as ImageIcon, Link2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const BookForm = ({
  book,
  onSuccess,
}: {
  book?: TReferenceBook | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(book?.imageUrl || null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [category, setCategory] = useState(book?.category || 'Reference Books');

  useEffect(() => {
    setPreview(book?.imageUrl || null);
    setCategory(book?.category || 'Reference Books');
    setRemovePhoto(false);
  }, [book]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    if(removePhoto) {
        formData.append('removePhoto', 'true');
    }

    const apiCall = book
      ? editReferenceBook(book.id, formData)
      : addReferenceBook(formData);

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
      setRemovePhoto(false);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-96 pr-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" name="title" defaultValue={book?.title} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="author" className="text-right">Author</Label><Input id="author" name="author" defaultValue={book?.author} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price</Label><Input id="price" name="price" type="number" defaultValue={book?.price} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="originalPrice" className="text-right">Original Price</Label><Input id="originalPrice" name="originalPrice" type="number" defaultValue={book?.originalPrice} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="rating" className="text-right">Rating</Label><Input id="rating" name="rating" type="number" step="0.1" defaultValue={book?.rating} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="class" className="text-right">Class</Label><Input id="class" name="class" defaultValue={book?.class} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="subject" className="text-right">Subject</Label><Input id="subject" name="subject" defaultValue={book?.subject} className="col-span-3" required /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="edition" className="text-right">Edition</Label><Input id="edition" name="edition" defaultValue={book?.edition} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="set" className="text-right">Set</Label><Input id="set" name="set" defaultValue={book?.set} className="col-span-3" /></div>
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select name="category" defaultValue={category} onValueChange={(value) => setCategory(value as 'IDL Store' | 'Reference Books')}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="IDL Store">IDL Store</SelectItem>
                      <SelectItem value="Reference Books">Reference Books</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          {category === 'IDL Store' && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productId" className="text-right">Product ID</Label>
                <Input id="productId" name="productId" type="number" defaultValue={book?.productId} className="col-span-3" placeholder="Enter unique product ID"/>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="buyLink" className="text-right">Buy Link</Label><Input id="buyLink" name="buyLink" defaultValue={book?.buyLink} className="col-span-3" placeholder="https://example.com/buy" /></div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Image</Label>
            <div className="col-span-3 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                     {preview && !removePhoto ? <Image src={preview} alt="Preview" width={40} height={50} className="rounded-md object-cover" /> : (book?.imageUrl && !removePhoto) ? <GcsImage filePath={book.imageUrl} alt={book.title} width={40} height={50} className="rounded-md object-cover" /> : <div className="w-10 h-12 bg-muted rounded-md flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground"/></div>}
                    <Input id="image" name="image" type="file" onChange={handleFileChange} className="col-span-3" />
                </div>
                {(book?.imageUrl || preview) && !removePhoto && <Button type="button" variant="destructive" size="sm" onClick={() => setRemovePhoto(true)} className="w-fit"><Trash2 className="w-4 h-4 mr-2"/> Remove Photo</Button>}
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


export default function AdminReferenceBooksPage() {
  const [books, setBooks] = useState<TReferenceBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<TReferenceBook | null>(null);
  const [deletingBook, setDeletingBook] = useState<TReferenceBook | null>(null);
  const { toast } = useToast();

  const fetchBooks = async () => {
    setLoading(true);
    const result = await getReferenceBooks();
    if (result.success && result.data) {
      setBooks(result.data as TReferenceBook[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleDelete = async () => {
    if (!deletingBook) return;
    const result = await deleteReferenceBook(deletingBook.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchBooks();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingBook(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deletingBook} onOpenChange={(isOpen) => !isOpen && setDeletingBook(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Reference Books</CardTitle>
              <CardDescription>Add, edit, or delete reference books.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBook(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Book
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-10 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                           <div className="w-10 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                            {book.imageUrl ? <GcsImage filePath={book.imageUrl} alt={book.title} width={40} height={48} className="object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground"/>}
                           </div>
                        </TableCell>
                        <TableCell>{book.productId || 'N/A'}</TableCell>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.category}</TableCell>
                        <TableCell>{book.class}</TableCell>
                        <TableCell>₹{book.price}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingBook(book); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingBook(book)}>
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
            <DialogTitle>{editingBook ? 'Edit' : 'Add'} Book</DialogTitle>
            <DialogDescription>
              {editingBook ? 'Update the details for this book.' : 'Create a new reference book.'}
            </DialogDescription>
          </DialogHeader>
          <BookForm book={editingBook} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the book: <span className="font-semibold">{deletingBook?.title}</span>. This action cannot be undone.
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
