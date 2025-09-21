'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions, addChapter, updatePart, setClassData, addTopic, deleteClass, editChapter, editTopic } from '@/app/actions';
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
  topicIndex?: number;
} | null;

type DeleteState = {
    type: 'class';
    classId: string;
} | null;

const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

export default function AdminImportantQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editState) return;

    const formData = new FormData(e.currentTarget);
    let result;
    const { type, action, classId, partKey, chapterIndex, topicIndex, data } = editState;
    
    try {
        if (type === 'class' && action === 'add') {
             result = await setClassData('importantQuestions', formData.get('id') as string, {});
        } else if (type === 'part' && classId) {
            const partName = formData.get('name') as string;
            const newPartKey = generateSlug(partName);
            if (action === 'add') {
                 const partData = { name: partName, chapters: [] };
                 result = await updateDoc('importantQuestions', classId, { [newPartKey]: partData });
            } else if (action === 'edit' && partKey) {
                result = await updatePart('importantQuestions', classId, partKey, formData);
            }
        } else if (type === 'chapter' && classId && partKey) {
            if (action === 'add') {
              result = await addChapter('importantQuestions', classId, partKey, formData);
            } else if (action === 'edit' && chapterIndex !== undefined) {
              result = await editChapter('importantQuestions', classId, partKey, chapterIndex, formData);
            }
        } else if (type === 'topic' && classId && partKey && chapterIndex !== undefined) {
            if (action === 'add') {
                result = await addTopic('importantQuestions', classId, partKey, chapterIndex, formData);
            } else if (action === 'edit' && topicIndex !== undefined) {
                result = await editTopic('importantQuestions', classId, partKey, chapterIndex, topicIndex, formData);
            }
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
  
  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
    ))
  );

  return (
    <Dialog open={!!editState} onOpenChange={(isOpen) => { if (!isOpen) setEditState(null); }}>
      <AlertDialog open={!!deleteState} onOpenChange={(isOpen) => !isOpen && setDeleteState(null)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Manage Important Questions</CardTitle><CardDescription>Manage content for classes, parts, chapters, and topics.</CardDescription></div>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setEditState({ type: 'class', action: 'add', data: {} })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {questions.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}><Card>
                  <div className="flex items-center p-4">
                    <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2"><span className="capitalize">{classDoc.id.replace('-', ' ')}</span></AccordionTrigger>
                    <div className="flex items-center gap-2 ml-auto shrink-0">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditState({type: 'part', action: 'add', data: {}, classId: classDoc.id })}><PlusCircle className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'class', classId: classDoc.id})}><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                    </div>
                  </div>
                  <AccordionContent><CardContent><Accordion type="multiple" className="w-full space-y-2">
                    {Object.entries(classDoc.data).map(([partKey, partData]) => {
                      if (partKey === 'id' || !partData || typeof partData !== 'object' || !partData.name) return null;
                      return (<AccordionItem value={`${classDoc.id}-${partKey}`} key={partKey}><div className="flex items-center p-2 bg-muted/50 rounded-md">
                        <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2"><span>{partData.name}</span></AccordionTrigger>
                        <div className="flex items-center gap-2 ml-auto shrink-0">
                           <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditState({type: 'chapter', action: 'add', data: {}, classId: classDoc.id, partKey: partKey})}><PlusCircle className="h-4 w-4" /></Button>
                          </DialogTrigger>
                           <DialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditState({type: 'part', action: 'edit', data: { name: partData.name }, classId: classDoc.id, partKey: partKey})}><Edit className="h-4 w-4" /></Button>
                            </DialogTrigger>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div><AccordionContent className="p-2">
                        {Array.isArray(partData.chapters) && partData.chapters.map((chapter, chapterIndex) => (<AccordionItem value={`${classDoc.id}-${partKey}-${chapterIndex}`} key={chapterIndex} className="border-b-0"><div className="mb-2 p-2 border rounded-md">
                          <div className="flex justify-between items-center"><AccordionTrigger className="font-semibold text-sm italic p-2 hover:no-underline flex-1 w-full pr-2">{chapter.name} {chapter.pdfUrl && <File className="w-4 h-4 text-primary ml-2 inline"/>}</AccordionTrigger>
                            <div className="flex items-center gap-1">
                               <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditState({type: 'topic', action: 'add', data: {}, classId: classDoc.id, partKey: partKey, chapterIndex: chapterIndex})}><PlusCircle className="h-4 w-4" /></Button>
                               </DialogTrigger>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditState({type: 'chapter', action: 'edit', data: chapter, classId: classDoc.id, partKey: partKey, chapterIndex: chapterIndex})}><Edit className="h-4 w-4" /></Button>
                                </DialogTrigger>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div><AccordionContent className="p-2"><ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                            {Array.isArray(chapter.topics) && chapter.topics.map((topic, topicIndex) => (<li key={topicIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                              <span>{topic.name} {topic.pdfUrl && <File className="w-3 h-3 text-primary ml-1 inline"/>}</span><div className="flex items-center gap-1">
                                 <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditState({type: 'topic', action: 'edit', data: topic, classId: classDoc.id, partKey: partKey, chapterIndex: chapterIndex, topicIndex: topicIndex})}><Edit className="h-3 w-3" /></Button>
                                </DialogTrigger>
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
              {editState.type === 'part' && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Part Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" placeholder="e.g., Mathematics"/></div>)}
              {(editState.type === 'chapter' || editState.type === 'topic') && (<>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" defaultValue={editState.data.name} className="col-span-3" /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="pdf" className="text-right">PDF</Label><Input id="pdf" name="pdf" type="file" accept=".pdf" className="col-span-3" /></div>
              </>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditState(null)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the class <span className="font-semibold capitalize">{deleteState?.classId.replace('-', ' ')}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
