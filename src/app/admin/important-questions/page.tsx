
'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions, addChapter, updatePart, setClassData, addTopic, deleteClass } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Topic {
  name: string;
  slug: string;
}
interface Chapter {
  name: string;
  slug: string;
  topics: Topic[];
}
interface Part {
  name: string;
  chapters: Chapter[];
}
interface ClassData {
  [partKey: string]: Part;
}
interface QuestionDoc {
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

export default function AdminImportantQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editState, setEditState] = useState<EditState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    const result = await getImportantQuestions();
    if (result.success && result.data) {
      const formattedData = (result.data as any[]).map(doc => ({
        id: doc.id,
        data: doc,
      }));
      setQuestions(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    if (!editState) return;

    let result;
    const { type, classId, partKey, chapterIndex } = editState;

    try {
        if (type === 'class') {
             result = await setClassData('importantQuestions', formData.id, {});
        } else if (type === 'part' && classId) {
            const partData = { name: formData.name, chapters: [] };
            result = await updatePart('importantQuestions', classId, formData.key, partData);
        } else if (type === 'chapter' && classId && partKey) {
            const chapterData = { name: formData.name, slug: formData.slug, topics: [] };
            result = await addChapter('importantQuestions', classId, partKey, chapterData);
        } else if (type === 'topic' && classId && partKey && chapterIndex !== undefined) {
            const topicData = { name: formData.name, slug: formData.slug };
            result = await addTopic('importantQuestions', classId, partKey, chapterIndex, topicData);
        }
        
        if (result && result.success) {
            toast({ title: "Success", description: result.message });
            fetchQuestions();
        } else {
            throw new Error(result?.message || 'An unknown error occurred.');
        }
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
        setEditState(null);
        setIsDialogOpen(false);
    }
  };
  
  const handleDelete = async () => {
    if(!deleteState || deleteState.type !== 'class') return;
    const result = await deleteClass('importantQuestions', deleteState.classId);
    if(result.success) {
        toast({ title: "Success", description: result.message });
        fetchQuestions();
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deleteState} onOpenChange={(isOpen) => !isOpen && setDeleteState(null)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Manage Important Questions</CardTitle><CardDescription>Manage content for classes, parts, chapters, and topics.</CardDescription></div>
              <Button size="sm" onClick={() => openDialog({ type: 'class', action: 'add', data: {} })}><PlusCircle className="mr-2 h-4 w-4" /> Add Class</Button>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {questions.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
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
                          <div className="flex justify-between items-center"><AccordionTrigger className="font-semibold text-sm italic p-2 hover:no-underline flex-1 w-full pr-2">{chapter.name}</AccordionTrigger>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDialog({type: 'topic', action: 'add', data: {}, classId: classDoc.id, partKey: partKey, chapterIndex: chapterIndex})}><PlusCircle className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div><AccordionContent className="p-2"><ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                            {chapter.topics && chapter.topics.map((topic, topicIndex) => (<li key={topicIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                              <span>{topic.name}</span><div className="flex items-center gap-1">
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
          <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(Object.fromEntries(new FormData(e.currentTarget).entries())); }}>
            <div className="grid gap-4 py-4">
              {editState.type === 'class' && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="id" className="text-right">Class ID</Label><Input id="id" name="id" defaultValue={editState.data.id} className="col-span-3" placeholder="e.g., class-5"/></div>)}
              {editState.type === 'part' && (<><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="key" className="text-right">Part Key</Label><Input id="key" name="key" defaultValue={editState.partKey} className="col-span-3" placeholder="e.g., part-1-maths"/></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Part Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" placeholder="e.g., Mathematics"/></div></>)}
              {(editState.type === 'chapter' || editState.type === 'topic') && (<><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="slug" className="text-right">Slug</Label><Input id="slug" name="slug" defaultValue={editState.data.slug} className="col-span-3" /></div></>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the class <span className="font-semibold capitalize">{deleteState?.classId.replace('-', ' ')}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
