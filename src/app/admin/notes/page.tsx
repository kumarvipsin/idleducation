'use client';
import { useEffect, useState } from 'react';
import { getNotes, setClassData, updatePart, addChapter, addTopic, deleteClass } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, File } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Topic {
  name: string;
  slug: string;
  pdfUrl?: string;
}
interface Chapter {
  name: string;
  slug: string;
  topics: Topic[];
  pdfUrl?: string;
}
interface Part {
  name: string;
  chapters: Chapter[];
}
interface ClassData {
  [partKey: string]: Part;
}
interface NoteDoc {
  id: string;
  data: ClassData;
}

type EditState = {
  type: 'class' | 'part' | 'chapter' | 'topic';
  action: 'add' | 'edit';
  data: any;
  classId?: string;
  partKey?: string;
  chapterIndex?: number;
} | null;

type DeleteState = {
    type: 'class';
    classId: string;
} | null;

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editState) return;

    const formData = new FormData(e.currentTarget);
    let result;
    const { type, classId, partKey, chapterIndex } = editState;
    
    try {
        if (type === 'class') {
             result = await setClassData('notes', formData.get('id') as string, {});
        } else if (type === 'part' && classId) {
            const partData = { name: formData.get('name') as string, chapters: [] };
            result = await updatePart('notes', classId, formData.get('key') as string, partData);
        } else if (type === 'chapter' && classId && partKey) {
            result = await addChapter('notes', classId, partKey, formData);
        } else if (type === 'topic' && classId && partKey && chapterIndex !== undefined) {
            result = await addTopic('notes', classId, partKey, chapterIndex, formData);
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
        setIsDialogOpen(false);
        setEditState(null);
    }
  };
  
  const handleDelete = async () => {
    if(!deleteState || deleteState.type !== 'class') return;
    const result = await deleteClass('notes', deleteState.classId);
    if(result.success) {
        toast({ title: "Success", description: result.message });
        fetchNotes();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeleteState(null);
  };

  const openDialog = (state: EditState) => {
    setEditState(state);
    setIsDialogOpen(true);
  };
  
  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
    ))
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setEditState(null); }}>
      <AlertDialog open={!!deleteState} onOpenChange={(isOpen) => !isOpen && setDeleteState(null)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Manage Notes</CardTitle><CardDescription>Manage content for classes, parts, chapters, and topics.</CardDescription></div>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => openDialog({ type: 'class', action: 'add', data: {} })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Class
                </Button>
              </DialogTrigger>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}><Card>
                  <div className="flex items-center p-4">
                    <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2"><span className="capitalize">{classDoc.id.replace('-', ' ')}</span></AccordionTrigger>
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog({type: 'part', action: 'add', data: {}, classId: classDoc.id })}><PlusCircle className="h-4 w-4" /></Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'class', classId: classDoc.id})}><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                    </div>
                  </div>
                  <AccordionContent><CardContent><Accordion type="multiple" className="w-full space-y-2">
                    {Object.entries(classDoc.data).map(([partKey, partData]) => {
                      if (partKey === 'id' || !partData || typeof partData !== 'object') return null;
                      return (<AccordionItem value={`${classDoc.id}-${partKey}`} key={partKey}><div className="flex items-center p-2 bg-muted/50 rounded-md">
                        <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2"><span>{partData.name}</span></AccordionTrigger>
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog({type: 'chapter', action: 'add', data: {}, classId: classDoc.id, partKey: partKey})}><PlusCircle className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div><AccordionContent className="p-2">
                        {Array.isArray(partData.chapters) && partData.chapters.map((chapter, chapterIndex) => (<AccordionItem value={`${classDoc.id}-${partKey}-${chapterIndex}`} key={chapterIndex} className="border-b-0"><div className="mb-2 p-2 border rounded-md">
                          <div className="flex justify-between items-center"><AccordionTrigger className="font-semibold text-sm italic p-2 hover:no-underline flex-1 w-full pr-2">{chapter.name} {chapter.pdfUrl && <File className="w-4 h-4 text-primary ml-2 inline"/>}</AccordionTrigger>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog({type: 'topic', action: 'add', data: {}, classId: classDoc.id, partKey: partKey, chapterIndex: chapterIndex})}><PlusCircle className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div><AccordionContent className="p-2"><ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                            {Array.isArray(chapter.topics) && chapter.topics.map((topic, topicIndex) => (<li key={topicIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                              <span>{topic.name} {topic.pdfUrl && <File className="w-3 h-3 text-primary ml-1 inline"/>}</span><div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </li>))}
                          </ul></AccordionContent>
                        </div></AccordionItem>))}
                      </AccordionContent></AccordionItem>)
                    })}
                  </Accordion></CardContent></AccordionContent>
                </Card></AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        
        {editState && (<DialogContent><DialogHeader><DialogTitle>{editState.action === 'add' ? 'Add New' : 'Edit'} {editState.type}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              {editState.type === 'class' && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="id" className="text-right">Class ID</Label><Input id="id" name="id" defaultValue={editState.data.id} className="col-span-3" placeholder="e.g., class-5"/></div>)}
              {editState.type === 'part' && (<><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="key" className="text-right">Part Key</Label><Input id="key" name="key" defaultValue={editState.partKey} className="col-span-3" placeholder="e.g., part-1-maths"/></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Part Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" placeholder="e.g., Mathematics"/></div></>)}
              {(editState.type === 'chapter' || editState.type === 'topic') && (<>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="pdf" className="text-right">PDF</Label><Input id="pdf" name="pdf" type="file" accept=".pdf" className="col-span-3" /></div>
              </>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the class <span className="font-semibold capitalize">{deleteState?.classId.replace('-', ' ')}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
