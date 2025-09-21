
'use client';
import { useEffect, useState } from 'react';
import { getNotes, addClass, editClass, deleteClass, addSubject, addPart, addChapter, addTopic, addSubTopic } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Book, Library, Folder, File as FileIcon, Dot } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Data Structures
interface SubTopic { name: string; pdfUrl?: string; }
interface Topic { name: string; pdfUrl?: string; subTopics?: SubTopic[]; }
interface Chapter { name: string; pdfUrl?: string; topics?: Topic[]; }
interface Part { name: string; chapters: Chapter[]; }
interface Subject { name: string; parts?: { [key: string]: Part }; chapters?: Chapter[]; }
interface ClassData { name: string; subjects: { [key: string]: Subject }; }
interface NoteDoc { id: string; data: ClassData; }

// State Types
type ModalState = {
  type: 'class' | 'subject' | 'part' | 'chapter' | 'topic' | 'sub-topic';
  action: 'add' | 'edit';
  data?: any;
  path: { classId?: string; subjectKey?: string; partKey?: string; chapterIndex?: number; topicIndex?: number; };
} | null;

type DeleteState = { type: 'class'; classId: string; } | null;

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<NoteDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const { toast } = useToast();

  const fetchNotes = async () => {
    setLoading(true);
    const result = await getNotes();
    if (result.success && result.data) {
      const formattedData = (result.data as any[]).map(doc => ({ id: doc.id, data: doc, }));
      setNotes(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalState) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const pdfFile = formData.get('pdf') as File | null;
    let result;
    const { type, action, path } = modalState;
    
    try {
        if (type === 'class') {
            result = action === 'add' 
                ? await addClass('notes', name)
                : await editClass('notes', path.classId!, name);
        } else if (type === 'subject') {
            result = await addSubject('notes', path.classId!, name);
        } else if (type === 'part') {
            result = await addPart('notes', path.classId!, path.subjectKey!, name);
        } else if (type === 'chapter') {
            result = await addChapter('notes', path.classId!, path.subjectKey!, path.partKey, name, pdfFile);
        } else if (type === 'topic') {
            result = await addTopic('notes', path.classId!, path.subjectKey!, path.chapterIndex!, path.partKey, name, pdfFile);
        } else if (type === 'sub-topic') {
            result = await addSubTopic('notes', path.classId!, path.subjectKey!, path.chapterIndex!, path.topicIndex!, path.partKey, name, pdfFile);
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
        setModalState(null);
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
  
  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
    ))
  );

  return (
    <Dialog open={!!modalState} onOpenChange={(isOpen) => { if (!isOpen) setModalState(null); }}>
      <AlertDialog open={!!deleteState} onOpenChange={(isOpen) => !isOpen && setDeleteState(null)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>Manage Notes</CardTitle><CardDescription>Manage content for classes, subjects, parts, chapters, topics and sub-topics.</CardDescription></div>
                <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setModalState({ type: 'class', action: 'add', path: {} })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Class
                    </Button>
                </DialogTrigger>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}><Card>
                    <div className="flex items-center p-4">
                        <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2 capitalize">{classDoc.data.name || classDoc.id.replace('-', ' ')}</AccordionTrigger>
                        <div className="flex items-center gap-2 mr-2">
                           <DialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({type: 'class', action: 'edit', data: classDoc.data, path: {classId: classDoc.id} })}><Edit className="h-4 w-4" /></Button></DialogTrigger>
                           <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'class', classId: classDoc.id})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                           <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'subject', action: 'add', path: { classId: classDoc.id }})}><PlusCircle className="h-4 w-4 mr-2"/>Subject</Button></DialogTrigger>
                        </div>
                    </div>
                  <AccordionContent><CardContent className="space-y-2">
                    {classDoc.data.subjects && Object.entries(classDoc.data.subjects).map(([subjectKey, subjectData]) => (
                        <Accordion key={subjectKey} type="multiple" className="w-full"><AccordionItem value={`${classDoc.id}-${subjectKey}`}>
                          <div className="flex items-center p-2 bg-muted/50 rounded-md">
                            <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2"><Library className="w-4 h-4 mr-2" />{subjectData.name}</AccordionTrigger>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'part', action: 'add', path: { classId: classDoc.id, subjectKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Part</Button></DialogTrigger>
                            <DialogTrigger asChild><Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'chapter', action: 'add', path: { classId: classDoc.id, subjectKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Chapter</Button></DialogTrigger>
                          </div>
                          <AccordionContent className="p-2 pl-6">
                            {/* Render Chapters directly under subject */}
                            {subjectData.chapters?.map((chapter, chapIdx) => (
                                <Accordion key={chapIdx} type="multiple"><AccordionItem value={`${subjectKey}-chap-${chapIdx}`}><div className="flex items-center"><AccordionTrigger><Book className="w-4 h-4 mr-2"/>{chapter.name}</AccordionTrigger><DialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'topic', action: 'add', path: { classId: classDoc.id, subjectKey, chapterIndex: chapIdx }})}><PlusCircle className="h-4 w-4 mr-2"/>Topic</Button></DialogTrigger></div><AccordionContent className="pl-6">{chapter.topics?.map((topic, topicIdx) => (<p key={topicIdx}>{topic.name}</p>))}</AccordionContent></AccordionItem></Accordion>
                            ))}
                            {/* Render Parts */}
                            {subjectData.parts && Object.entries(subjectData.parts).map(([partKey, partData]) => (
                                <Accordion key={partKey} type="multiple"><AccordionItem value={`${subjectKey}-${partKey}`}>
                                  <div className="flex items-center p-2 my-2 bg-muted/30 rounded-md"><AccordionTrigger className="font-medium capitalize text-sm hover:no-underline flex-1 w-full pr-2"><Folder className="w-4 h-4 mr-2" />{partData.name}</AccordionTrigger><DialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'chapter', action: 'add', path: { classId: classDoc.id, subjectKey, partKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Chapter</Button></DialogTrigger></div>
                                  <AccordionContent className="pl-4 border-l ml-4">
                                      {partData.chapters?.map((chapter, chapIdx) => (
                                          <Accordion key={chapIdx} type="multiple"><AccordionItem value={`${partKey}-chap-${chapIdx}`}><div className="flex items-center"><AccordionTrigger><Book className="w-4 h-4 mr-2"/>{chapter.name}</AccordionTrigger><DialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'topic', action: 'add', path: { classId: classDoc.id, subjectKey, partKey, chapterIndex: chapIdx }})}><PlusCircle className="h-4 w-4 mr-2"/>Topic</Button></DialogTrigger></div><AccordionContent className="pl-6">{chapter.topics?.map((topic, topicIdx) => (<p key={topicIdx}>{topic.name}</p>))}</AccordionContent></AccordionItem></Accordion>
                                      ))}
                                  </AccordionContent>
                                </AccordionItem></Accordion>
                            ))}
                          </AccordionContent>
                        </AccordionItem></Accordion>
                    ))}
                  </CardContent></AccordionContent>
                </Card></AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        
        {modalState && (<DialogContent><DialogHeader><DialogTitle>{modalState.action === 'add' ? 'Add New' : 'Edit'} {modalState.type.replace('-', ' ')}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right capitalize">{modalState.type.replace('-', ' ')} Name</Label><Input id="name" name="name" defaultValue={modalState.data?.name || ''} className="col-span-3"/></div>
              {['chapter', 'topic', 'sub-topic'].includes(modalState.type) && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="pdf" className="text-right">PDF File</Label><Input id="pdf" name="pdf" type="file" accept=".pdf" className="col-span-3"/></div>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setModalState(null)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the class <span className="font-semibold capitalize">{deleteState?.classId.replace('-', ' ')}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
