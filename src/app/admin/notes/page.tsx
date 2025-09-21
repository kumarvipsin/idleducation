
'use client';
import { useEffect, useState } from 'react';
import { getNotes, setClassData, updateSubject, addBook, addChapter } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Chapter {
  name: string;
  slug: string;
}
interface Book {
  name: string;
  lang: string;
  chapters: Chapter[];
}
interface Subject {
  name: string;
  books: Book[];
}
interface ClassData {
  [subject: string]: Subject;
}
interface NoteDoc {
  id: string; // This will be 'class-5', 'class-6', etc.
  data: ClassData;
}

type EditState = {
  type: 'class' | 'subject' | 'book' | 'chapter';
  action: 'add' | 'edit';
  data: any;
  classId?: string;
  subjectKey?: string;
  bookIndex?: number;
  chapterIndex?: number;
} | null;

type DeleteState = {
    type: 'class' | 'subject' | 'book' | 'chapter';
    classId: string;
    subjectKey?: string;
    bookIndex?: number;
    chapterIndex?: number;
    name: string;
} | null;


export default function AdminNotesPage() {
  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const { toast } = useToast();

  const fetchNotes = async () => {
    setLoading(true);
    const result = await getNotes();
    if (result.success && result.data) {
      const formattedData = (result.data as any[]).map(doc => ({
        id: doc.id,
        data: doc,
      }));
      setNotes(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    if (!editState) return;
    
    let result;
    const { type, action, classId, subjectKey, bookIndex, chapterIndex } = editState;

    try {
        if (type === 'class' && action === 'add') {
            result = await setClassData('notes', formData.id, {});
        } else if (type === 'subject' && classId) {
            const subjectData = { name: formData.name, books: [] };
            result = await updateSubject('notes', classId, formData.key, subjectData);
        } else if (type === 'book' && classId && subjectKey) {
            const bookData = { name: formData.name, lang: formData.lang, chapters: [] };
            result = await addBook('notes', classId, subjectKey, bookData);
        } else if (type === 'chapter' && classId && subjectKey && bookIndex !== undefined) {
             if (action === 'add') {
                const chapterData = { name: formData.name, slug: formData.slug };
                result = await addChapter('notes', classId, subjectKey, bookIndex, chapterData);
            }
        }
        
        if (result && result.success) {
            toast({ title: "Success", description: result.message });
            fetchNotes();
        } else {
            throw new Error(result?.message || 'An unknown error occurred.');
        }
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
        setEditState(null);
    }
  };

  const handleDelete = async () => {
    if(!deleteState) return;
    
    console.log("Deleting:", deleteState);
    toast({ title: "In Progress", description: "Delete functionality is not yet implemented."})

    setDeleteState(null);
  };


  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4">
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))
  );

  return (
    <Dialog open={!!editState} onOpenChange={(isOpen) => !isOpen && setEditState(null)}>
      <AlertDialog open={!!deleteState} onOpenChange={(isOpen) => !isOpen && setDeleteState(null)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage NCERT Solutions</CardTitle>
                <CardDescription>
                  View and manage the seeded NCERT solutions data (from the 'notes' collection).
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setEditState({ type: 'class', action: 'add', data: {} })}>
                      <PlusCircle className="mr-2 h-4 w-4"/> Add Class
                  </Button>
              </DialogTrigger>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}>
                  <Card>
                    <div className="flex items-center p-4">
                       <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2">
                          <span className="capitalize">{classDoc.id.replace('-', ' ')}</span>
                       </AccordionTrigger>
                       <div className="flex items-center gap-2 ml-auto shrink-0">
                          <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditState({type: 'subject', action: 'add', data: {}, classId: classDoc.id }); }}>
                                  <PlusCircle className="h-4 w-4" />
                              </Button>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditState({type: 'class', action: 'edit', data: {id: classDoc.id}, classId: classDoc.id }); }}>
                                  <Edit className="h-4 w-4" />
                             </Button>
                          </DialogTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <AccordionContent>
                      <CardContent>
                        <Accordion type="multiple" className="w-full space-y-2">
                           {Object.entries(classDoc.data).map(([key, value]) => {
                            if (key === 'id') return null;
                             return (
                                <AccordionItem value={`${classDoc.id}-${key}`} key={key}>
                                  <div className="flex items-center p-2 bg-muted/50 rounded-md">
                                      <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2">
                                          <span>{key}</span>
                                      </AccordionTrigger>
                                       <div className="flex items-center gap-2 ml-auto shrink-0">
                                          <DialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditState({type: 'book', action: 'add', data: {}, classId: classDoc.id, subjectKey: key})}}><PlusCircle className="h-4 w-4" /></Button>
                                          </DialogTrigger>
                                          <DialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                          </DialogTrigger>
                                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                      </div>
                                  </div>
                                  <AccordionContent className="p-2">
                                         {(value as Subject).books.map((book, bookIndex) => (
                                            <div key={bookIndex} className="mb-2 p-2 border rounded-md">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-sm italic p-2">{book.name} ({book.lang})</p>
                                                    <div className="flex items-center gap-1">
                                                        <DialogTrigger asChild>
                                                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setEditState({type: 'chapter', action: 'add', data: {}, classId: classDoc.id, subjectKey: key, bookIndex: bookIndex})}}><PlusCircle className="h-4 w-4" /></Button>
                                                        </DialogTrigger>
                                                        <DialogTrigger asChild>
                                                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                                        </DialogTrigger>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>
                                                <ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                                                    {book.chapters.map((chapter, chapterIndex) => (
                                                        <li key={chapterIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                                                            <span>{chapter.name}</span>
                                                             <div className="flex items-center gap-1">
                                                                  <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3 w-3" /></Button>
                                                                  </DialogTrigger>
                                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                  </AccordionContent>
                                </AccordionItem>
                             )
                           })}
                        </Accordion>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        
        {editState && (
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{editState.action === 'add' ? 'Add New' : 'Edit'} {editState.type}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(Object.fromEntries(new FormData(e.currentTarget).entries())); }}>
                  <div className="grid gap-4 py-4">
                      {editState.type === 'class' && (
                           <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="id" className="text-right">Class ID</Label>
                              <Input id="id" name="id" defaultValue={editState.data.id} className="col-span-3" placeholder="e.g., class-5"/>
                          </div>
                      )}
                      {editState.type === 'subject' && (
                           <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="key" className="text-right">Subject Key</Label>
                              <Input id="key" name="key" defaultValue={editState.subjectKey} className="col-span-3" placeholder="e.g., maths" readOnly={editState.action === 'edit'}/>
                              <Label htmlFor="name" className="text-right">Subject Name</Label>
                              <Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" placeholder="e.g., Mathematics"/>
                          </div>
                      )}
                      {editState.type === 'book' && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">Book Name</Label>
                              <Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" />
                          </div>
                           <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="lang" className="text-right">Language</Label>
                              <Input id="lang" name="lang" defaultValue={editState.data.lang} className="col-span-3" placeholder="en / hi"/>
                          </div>
                        </>
                      )}
                      {editState.type === 'chapter' && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">Name</Label>
                              <Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="slug" className="text-right">Slug</Label>
                              <Input id="slug" name="slug" defaultValue={editState.data.slug} className="col-span-3" />
                          </div>
                        </>
                      )}
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setEditState(null)}>Cancel</Button>
                      <Button type="submit">Save Changes</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
        )}

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected item: <span className="font-semibold">{deleteState?.name}</span>.
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
