
'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions, setClassData, updateSubject, updatePart, addChapter, addTopic, deleteClass, editClass } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, File, Book, Library } from 'lucide-react';
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
interface ClassData { [key: string]: Subject; }
interface QuestionDoc { id: string; data: ClassData; }

// State Types
type EditState = {
  type: 'class' | 'subject' | 'part' | 'chapter' | 'topic' | 'sub-topic';
  action: 'add' | 'edit';
  data: any;
  classId?: string; subjectKey?: string; partKey?: string; chapterIndex?: number; topicIndex?: number;
} | null;

type DeleteState = { type: 'class'; classId: string; } | null;

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
      const formattedData = (result.data as any[]).map(doc => ({ id: doc.id, data: doc, }));
      setQuestions(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editState) return;

    const formData = new FormData(e.currentTarget);
    let result;
    const { type, action, classId } = editState;
    
    try {
        if (type === 'class') {
            const newClassId = formData.get('id') as string;
            if (action === 'add') {
                result = await setClassData('importantQuestions', newClassId, {});
            } else if (action === 'edit' && classId) {
                result = await editClass('importantQuestions', classId, newClassId);
            }
        } else if (type === 'subject' && classId) {
            // Simplified: Add/Edit subject logic would go here
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
              <div><CardTitle>Manage Important Questions</CardTitle><CardDescription>Manage content for classes, subjects, parts, chapters, topics and sub-topics.</CardDescription></div>
                <Button size="sm" onClick={() => setEditState({ type: 'class', action: 'add', data: {} })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Class
                </Button>
            </CardHeader>
          </Card>
          {loading ? renderSkeleton() : (
            <Accordion type="multiple" className="w-full space-y-4">
              {questions.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
                <AccordionItem value={classDoc.id} key={classDoc.id}><Card>
                    <div className="flex items-center p-4">
                        <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline flex-1 w-full pr-2 capitalize">{classDoc.id.replace('-', ' ')}</AccordionTrigger>
                        <div className="flex items-center gap-2 mr-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditState({type: 'class', action: 'edit', data: {id: classDoc.id}, classId: classDoc.id }); }}><Edit className="h-4 w-4" /></Button>
                           <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {e.stopPropagation(); setDeleteState({type: 'class', classId: classDoc.id})}}><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                        </div>
                    </div>
                  <AccordionContent><CardContent className="space-y-2">
                    {Object.entries(classDoc.data).map(([subjectKey, subjectData]) => (
                      (subjectKey !== 'id' && typeof subjectData === 'object' && subjectData.name) && (
                        <Accordion key={subjectKey} type="multiple" className="w-full"><AccordionItem value={`${classDoc.id}-${subjectKey}`}>
                          <div className="flex items-center p-2 bg-muted/50 rounded-md">
                            <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline flex-1 w-full pr-2"><Library className="w-4 h-4 mr-2" />{subjectData.name}</AccordionTrigger>
                          </div>
                          <AccordionContent className="p-2">
                            {/* Render Chapters if they exist directly under subject */}
                            {Array.isArray(subjectData.chapters) && subjectData.chapters.map((chapter, chapIdx) => (
                                <p key={chapIdx}>{chapter.name}</p> // Placeholder
                            ))}
                            {/* Render Parts if they exist */}
                            {subjectData.parts && Object.entries(subjectData.parts).map(([partKey, partData]) => (
                                <Accordion key={partKey} type="multiple"><AccordionItem value={`${classDoc.id}-${subjectKey}-${partKey}`}>
                                  <div className="flex items-center p-2 my-2 bg-muted/30 rounded-md">
                                    <AccordionTrigger className="font-medium capitalize text-sm hover:no-underline flex-1 w-full pr-2"><BookOpen className="w-4 h-4 mr-2" />{partData.name}</AccordionTrigger>
                                  </div>
                                  <AccordionContent className="pl-4 border-l ml-4">
                                      {Array.isArray(partData.chapters) && partData.chapters.map((chapter, chapIdx) => (
                                        <p key={chapIdx}>{chapter.name}</p> // Placeholder
                                      ))}
                                  </AccordionContent>
                                </AccordionItem></Accordion>
                            ))}
                          </AccordionContent>
                        </AccordionItem></Accordion>
                      )
                    ))}
                  </CardContent></AccordionContent>
                </Card></AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        
        {editState && (<DialogContent><DialogHeader><DialogTitle>{editState.action === 'add' ? 'Add New' : 'Edit'} {editState.type}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              {editState.type === 'class' && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="id" className="text-right">Class ID</Label><Input id="id" name="id" defaultValue={editState.data.id} className="col-span-3" placeholder="e.g., class-5"/></div>)}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditState(null)}>Cancel</Button><Button type="submit">Save Changes</Button></DialogFooter>
          </form>
        </DialogContent>)}
        
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the class <span className="font-semibold capitalize">{deleteState?.classId.replace('-', ' ')}</span> and all its contents.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
