
'use client';
import { useEffect, useState } from 'react';
import { getNotes, setClassData, deleteClass, updateSubject, updateBook, updateChapter } from '@/app/actions';
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
  books: Book[];
}
interface ClassData {
  [subject: string]: Subject;
}
interface NoteDoc {
  id: string; // This will be 'class-5', 'class-6', etc.
  data: ClassData;
}

// Form state can be complex, so let's define a type for it
type EditState = {
  type: 'class' | 'subject' | 'book' | 'chapter';
  data: any;
  classId?: string;
  subjectKey?: string;
  bookIndex?: number;
  chapterIndex?: number;
} | null;

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState>(null);
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

  const handleEdit = async (formData: any) => {
    if (!editState) return;
    
    let result;
    if (editState.type === 'chapter' && editState.classId && editState.subjectKey && editState.bookIndex !== undefined && editState.chapterIndex !== undefined) {
        result = await updateChapter('notes', editState.classId, editState.subjectKey, editState.bookIndex, editState.chapterIndex, { name: formData.name, slug: formData.slug });
    }
    // Implement other edit actions here...
    
    if (result && result.success) {
      toast({ title: "Success", description: result.message });
      fetchNotes();
      setEditState(null);
    } else {
      toast({ variant: "destructive", title: "Error", description: result?.message || "Failed to update." });
    }
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
                <Button size="sm" onClick={() => setEditState({ type: 'class', data: { id: '' }})}><PlusCircle className="mr-2 h-4 w-4"/> Add Class</Button>
            </DialogTrigger>
          </CardHeader>
        </Card>
        {loading ? renderSkeleton() : (
          <Accordion type="multiple" className="w-full space-y-4">
            {notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
              <AccordionItem value={classDoc.id} key={classDoc.id}>
                <Card>
                  <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline p-4 flex-1 w-full">
                     <div className="flex items-center justify-between w-full">
                        <span className="capitalize">{classDoc.id.replace('-', ' ')}</span>
                         <div className="flex items-center gap-2 mr-2">
                            <DialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditState({type: 'class', data: classDoc, classId: classDoc.id }); }}><Edit className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent>
                      <Accordion type="multiple" className="w-full space-y-2">
                         {Object.entries(classDoc.data).map(([key, value]) => {
                          if (key === 'id') return null;
                           return (
                              <AccordionItem value={`${classDoc.id}-${key}`} key={key}>
                                <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline p-2 bg-muted/50 rounded-md flex-1 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <span>{key}</span>
                                         <div className="flex items-center gap-2 mr-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                       {(value as Subject).books.map((book, bookIndex) => (
                                          <div key={bookIndex} className="mb-2 p-2 border rounded-md">
                                              <div className="flex justify-between items-center">
                                                  <p className="font-semibold text-sm italic p-2">{book.name} ({book.lang})</p>
                                                  <div className="flex items-center gap-1">
                                                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                  </div>
                                              </div>
                                              <ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                                                  {book.chapters.map((chapter, chapterIndex) => (
                                                      <li key={chapterIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                                                          <span>{chapter.name}</span>
                                                           <div className="flex items-center gap-1">
                                                              <DialogTrigger asChild>
                                                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditState({type: 'chapter', data: chapter, classId: classDoc.id, subjectKey: key, bookIndex, chapterIndex })}>
                                                                      <Edit className="h-3 w-3" />
                                                                  </Button>
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
                  <DialogTitle>{editState.type === 'class' && !editState.data.id ? 'Add New Class' : `Edit ${editState.type}`}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleEdit(Object.fromEntries(new FormData(e.currentTarget).entries())); }}>
                  <div className="grid gap-4 py-4">
                      {editState.type === 'class' && (
                           <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="id" className="text-right">Class ID</Label>
                              <Input id="id" name="id" defaultValue={editState.data.id} className="col-span-3" placeholder="e.g., class-5"/>
                          </div>
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
    </Dialog>
  );
}
