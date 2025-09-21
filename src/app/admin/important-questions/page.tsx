
'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions, addClass, editClass, deleteClass, addSubject, addPart, addChapter, addTopic, addSubTopic, deleteSubject, deletePart, deleteChapter, deleteTopic, deleteSubTopic, editSubject, editPart, editChapter, editTopic, editSubTopic, getSignedUrlForPdf, reorderArrayItem } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Book, Library, Folder, File as FileIcon, Dot, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Data Structures
interface SubTopic { name: string; pdfUrl?: string; }
interface Topic { name: string; pdfUrl?: string; subTopics?: SubTopic[]; }
interface Chapter { name: string; pdfUrl?: string; topics?: Topic[]; }
interface Part { name: string; chapters: Chapter[]; order: number; }
interface Subject { name: string; parts?: { [key: string]: Part }; chapters?: Chapter[]; order: number; }
interface ClassData { name: string; subjects: { [key: string]: Subject }; order: number; }
interface QuestionDoc { id: string; data: ClassData; }

// State Types
type ModalState = {
  type: 'class' | 'subject' | 'part' | 'chapter' | 'topic' | 'sub-topic';
  action: 'add' | 'edit';
  data?: any;
  path: { classId?: string; subjectKey?: string; partKey?: string; chapterIndex?: number; topicIndex?: number; subTopicIndex?: number; };
} | null;

type DeleteState = 
    | { type: 'class'; classId: string; name: string; }
    | { type: 'subject'; path: { classId: string; subjectKey: string; }; name: string; }
    | { type: 'part'; path: { classId: string; subjectKey: string; partKey: string; }; name: string; }
    | { type: 'chapter'; path: { classId: string; subjectKey: string; partKey?: string; chapterIndex: number; }; name: string; }
    | { type: 'topic'; path: { classId: string; subjectKey: string; partKey?: string; chapterIndex: number; topicIndex: number; }; name: string; }
    | { type: 'sub-topic'; path: { classId: string; subjectKey: string; partKey?: string; chapterIndex: number; topicIndex: number; subTopicIndex: number; }; name: string; }
    | null;

const ViewPdfButton = ({ pdfUrl }: { pdfUrl: string }) => {
    const { toast } = useToast();
    const handleViewPdf = async () => {
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };

    return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleViewPdf}>
            <Eye className="h-4 w-4" />
        </Button>
    );
};

export default function AdminImportantQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    const result = await getImportantQuestions();
    if (result.success && result.data) {
      const formattedData = (result.data as any[]).map(doc => ({ id: doc.id, data: doc, }));
      setQuestions(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!modalState) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const order = parseInt(formData.get('order') as string, 10);
    const pdfFile = formData.get('pdf') as File | null;
    let result;
    const { type, action, path } = modalState;
    
    try {
      if (type === 'class') {
        result = action === 'add' 
            ? await addClass('importantQuestions', name)
            : await editClass('importantQuestions', path.classId!, name, order);
      } else if (type === 'subject') {
          result = action === 'add' 
            ? await addSubject('importantQuestions', path.classId!, name)
            : await editSubject('importantQuestions', path.classId!, path.subjectKey!, name, order);
      } else if (type === 'part') {
          result = action === 'add'
            ? await addPart('importantQuestions', path.classId!, path.subjectKey!, name)
            : await editPart('importantQuestions', path.classId!, path.subjectKey!, path.partKey!, name, order);
      } else if (type === 'chapter') {
          result = action === 'add'
            ? await addChapter('importantQuestions', path.classId!, path.subjectKey!, path.partKey, name, pdfFile)
            : await editChapter('importantQuestions', path.classId!, path.subjectKey!, path.partKey, path.chapterIndex!, name, pdfFile);
      } else if (type === 'topic') {
          result = action === 'add'
            ? await addTopic('importantQuestions', path.classId!, path.subjectKey!, path.chapterIndex!, path.partKey, name, pdfFile)
            : await editTopic('importantQuestions', path.classId!, path.subjectKey!, path.partKey, path.chapterIndex!, path.topicIndex!, name, pdfFile);
      } else if (type === 'sub-topic') {
          result = action === 'add'
            ? await addSubTopic('importantQuestions', path.classId!, path.subjectKey!, path.chapterIndex!, path.topicIndex!, path.partKey, name, pdfFile)
            : await editSubTopic('importantQuestions', path.classId!, path.subjectKey!, path.partKey, path.chapterIndex!, path.topicIndex!, path.subTopicIndex!, name, pdfFile);
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
        setModalState(null);
    }
  };
  
  const handleDelete = async () => {
    if(!deleteState) return;
    let result;
    try {
        switch(deleteState.type) {
            case 'class':
                result = await deleteClass('importantQuestions', deleteState.classId);
                break;
            case 'subject':
                result = await deleteSubject('importantQuestions', deleteState.path.classId, deleteState.path.subjectKey);
                break;
            case 'part':
                result = await deletePart('importantQuestions', deleteState.path.classId, deleteState.path.subjectKey, deleteState.path.partKey);
                break;
            case 'chapter':
                result = await deleteChapter('importantQuestions', deleteState.path.classId, deleteState.path.subjectKey, deleteState.path.partKey, deleteState.name);
                break;
            case 'topic':
                result = await deleteTopic('importantQuestions', deleteState.path.classId, deleteState.path.subjectKey, deleteState.path.partKey, deleteState.path.chapterIndex, deleteState.name);
                break;
            case 'sub-topic':
                result = await deleteSubTopic('importantQuestions', deleteState.path.classId, deleteState.path.subjectKey, deleteState.path.partKey, deleteState.path.chapterIndex, deleteState.path.topicIndex, deleteState.name);
                break;
        }

        if (result && result.success) {
            toast({ title: "Success", description: result.message });
            fetchQuestions();
        } else {
            throw new Error(result?.message || 'Failed to delete.');
        }
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
        setDeleteState(null);
    }
  };

  const handleReorder = async (path: any, itemType: 'chapter' | 'topic' | 'subTopic', itemIndex: number, direction: 'up' | 'down') => {
    const result = await reorderArrayItem('importantQuestions', path, itemType, itemIndex, direction);
    if (result.success) {
        toast({ title: "Success", description: result.message });
        fetchQuestions();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
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
              <div><CardTitle>Manage Important Questions</CardTitle><CardDescription>Manage content for classes, subjects, parts, chapters, topics and sub-topics.</CardDescription></div>
                <Button size="sm" onClick={() => setModalState({ type: 'class', action: 'add', path: {} })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Class
                </Button>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {questions.sort((a, b) => (a.data.order || 99) - (b.data.order || 99)).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}><Card>
                    <div className="flex items-center p-4">
                        <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2 capitalize">{classDoc.data.name || classDoc.id.replace('-', ' ')}</AccordionTrigger>
                        <div className="flex items-center gap-2 mr-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({type: 'class', action: 'edit', data: classDoc.data, path: {classId: classDoc.id} })}><Edit className="h-4 w-4" /></Button>
                           <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'class', classId: classDoc.id, name: classDoc.data.name})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                           <Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'subject', action: 'add', path: { classId: classDoc.id }})}><PlusCircle className="h-4 w-4 mr-2"/>Subject</Button>
                        </div>
                    </div>
                  <AccordionContent><CardContent className="space-y-2">
                    {classDoc.data.subjects && Object.entries(classDoc.data.subjects).sort(([,a],[,b]) => (a.order || 99) - (b.order || 99)).map(([subjectKey, subjectData]) => (
                        <Accordion key={subjectKey} type="multiple" className="w-full"><AccordionItem value={`${classDoc.id}-${subjectKey}`}>
                          <div className="flex items-center p-2 bg-muted/50 rounded-md">
                            <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2"><Library className="w-4 h-4 mr-2" />{subjectData.name}</AccordionTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({ type: 'subject', action: 'edit', path: { classId: classDoc.id, subjectKey }, data: subjectData })}><Edit className="h-4 w-4"/></Button>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'subject', path: {classId: classDoc.id, subjectKey}, name: subjectData.name})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                            <Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'part', action: 'add', path: { classId: classDoc.id, subjectKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Part</Button>
                            <Button variant="ghost" size="sm" className="h-8" onClick={() => setModalState({ type: 'chapter', action: 'add', path: { classId: classDoc.id, subjectKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Chapter</Button>
                          </div>
                          <AccordionContent className="p-2 pl-6">
                            {/* Render Chapters directly under subject */}
                            {subjectData.chapters?.map((chapter, chapIdx) => (
                                <Accordion key={`chap-${chapIdx}`} type="multiple"><AccordionItem value={`${subjectKey}-chap-${chapIdx}`}><div className="flex items-center"><AccordionTrigger><Book className="w-4 h-4 mr-2"/>{chapter.name}</AccordionTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder({ classId: classDoc.id, subjectKey }, 'chapter', chapIdx, 'up')} disabled={chapIdx === 0}><ArrowUp className="h-4 w-4"/></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder({ classId: classDoc.id, subjectKey }, 'chapter', chapIdx, 'down')} disabled={chapIdx === (subjectData.chapters?.length ?? 0) - 1}><ArrowDown className="h-4 w-4"/></Button>{chapter.pdfUrl && <ViewPdfButton pdfUrl={chapter.pdfUrl} />}<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({ type: 'chapter', action: 'edit', path: { classId: classDoc.id, subjectKey, chapterIndex: chapIdx }, data: chapter })}><Edit className="h-4 w-4"/></Button><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'chapter', path: {classId: classDoc.id, subjectKey, chapterIndex: chapIdx}, name: chapter.name})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'topic', action: 'add', path: { classId: classDoc.id, subjectKey, chapterIndex: chapIdx }})}><PlusCircle className="h-4 w-4 mr-2"/>Topic</Button></div><AccordionContent className="pl-6">{chapter.topics?.map((topic, topicIdx) => (<p key={topicIdx}>{topic.name}</p>))}</AccordionContent></AccordionItem></Accordion>
                            ))}
                            {/* Render Parts */}
                            {subjectData.parts && Object.entries(subjectData.parts).sort(([,a],[,b]) => (a.order || 99) - (b.order || 99)).map(([partKey, partData]) => (
                                <Accordion key={partKey} type="multiple"><AccordionItem value={`${subjectKey}-${partKey}`}>
                                  <div className="flex items-center p-2 my-2 bg-muted/30 rounded-md"><AccordionTrigger className="font-medium capitalize text-sm hover:no-underline flex-1 w-full pr-2"><Folder className="w-4 h-4 mr-2" />{partData.name}</AccordionTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({ type: 'part', action: 'edit', path: { classId: classDoc.id, subjectKey, partKey }, data: partData })}><Edit className="h-4 w-4"/></Button><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'part', path: {classId: classDoc.id, subjectKey, partKey}, name: partData.name})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'chapter', action: 'add', path: { classId: classDoc.id, subjectKey, partKey }})}><PlusCircle className="h-4 w-4 mr-2"/>Chapter</Button></div>
                                  <AccordionContent className="pl-4 border-l ml-4">
                                      {partData.chapters?.map((chapter, chapIdx) => (
                                          <Accordion key={`part-chap-${chapIdx}`} type="multiple"><AccordionItem value={`${partKey}-chap-${chapIdx}`}><div className="flex items-center"><AccordionTrigger><Book className="w-4 h-4 mr-2"/>{chapter.name}</AccordionTrigger><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder({ classId: classDoc.id, subjectKey, partKey }, 'chapter', chapIdx, 'up')} disabled={chapIdx === 0}><ArrowUp className="h-4 w-4"/></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReorder({ classId: classDoc.id, subjectKey, partKey }, 'chapter', chapIdx, 'down')} disabled={chapIdx === (partData.chapters?.length ?? 0) - 1}><ArrowDown className="h-4 w-4"/></Button>{chapter.pdfUrl && <ViewPdfButton pdfUrl={chapter.pdfUrl} />}<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModalState({ type: 'chapter', action: 'edit', path: { classId: classDoc.id, subjectKey, partKey, chapterIndex: chapIdx }, data: chapter })}><Edit className="h-4 w-4"/></Button><AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteState({type: 'chapter', path: {classId: classDoc.id, subjectKey, partKey, chapterIndex: chapIdx}, name: chapter.name})}><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><Button variant="ghost" size="sm" onClick={() => setModalState({ type: 'topic', action: 'add', path: { classId: classDoc.id, subjectKey, partKey, chapterIndex: chapIdx }})}><PlusCircle className="h-4 w-4 mr-2"/>Topic</Button></div><AccordionContent className="pl-6">{chapter.topics?.map((topic, topicIdx) => (<p key={topicIdx}>{topic.name}</p>))}</AccordionContent></AccordionItem></Accordion>
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
              {['class', 'subject', 'part'].includes(modalState.type) && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="order" className="text-right">Order</Label><Input id="order" name="order" type="number" defaultValue={modalState.data?.order ?? 99} className="col-span-3"/></div>)}
              {['chapter', 'topic', 'sub-topic'].includes(modalState.type) && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="pdf" className="text-right">PDF File</Label><Input id="pdf" name="pdf" type="file" accept=".pdf" className="col-span-3"/></div>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setModalState(null)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the {deleteState?.type.replace('-', ' ')} <span className="font-semibold capitalize">{deleteState?.name}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
