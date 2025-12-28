
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, ClipboardList, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  subject: string;
  dueDate?: string;
}

const subjects = ["General", "Maths", "Science", "History", "English", "Arts", "Other"];

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const storageKey = user ? `studyPlan_${user.uid}` : '';

  useEffect(() => {
    if (storageKey) {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, storageKey]);
  
  const handleToggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const filteredTasks = tasks.filter(task => activeFilter === 'All' || task.subject === activeFilter);
  const uniqueSubjectsInTasks = ['All', ...Array.from(new Set(tasks.map(t => t.subject)))];

  const AddTaskForm = () => {
    const [text, setText] = useState('');
    const [subject, setSubject] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>();

    const handleAddTask = () => {
        if (text.trim() === '' || subject.trim() === '') return;
        const newTask: Task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            subject: subject,
            dueDate: dueDate?.toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
        setText('');
        setSubject('');
        setDueDate(undefined);
        setIsAddDialogOpen(false);
    }

    return (
        <div className="grid gap-4 py-4">
            <Input placeholder="Task description..." value={text} onChange={(e) => setText(e.target.value)} />
            <Select onValueChange={setSubject} value={subject}>
                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                <SelectContent>
                    {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'PPP') : <span>Pick a due date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent>
            </Popover>
            <DialogFooter>
                <Button onClick={handleAddTask}><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </DialogFooter>
        </div>
    );
  }
  
  const getDateBadge = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) return <Badge variant="secondary">Today</Badge>;
    if (isTomorrow(date)) return <Badge variant="outline">Tomorrow</Badge>;
    if (isPast(date)) return <Badge variant="destructive">Overdue</Badge>;
    return <span className="text-xs text-muted-foreground">{format(date, 'MMM d')}</span>;
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            My Study Plan
          </CardTitle>
          <CardDescription>Organize your learning journey and stay on track.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto flex-grow">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-muted-foreground">Overall Progress</span>
                        <span className="font-semibold">{completedTasks} / {totalTasks} Completed</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto"><Plus className="mr-2 h-4 w-4" /> New Task</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Task</DialogTitle>
                            <DialogDescription>Fill in the details for your new study task.</DialogDescription>
                        </DialogHeader>
                        <AddTaskForm />
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {uniqueSubjectsInTasks.map(subject => (
                    <Button key={subject} variant={activeFilter === subject ? "default" : "outline"} size="sm" onClick={() => setActiveFilter(subject)} className="rounded-full h-8 whitespace-nowrap">
                        {subject}
                    </Button>
                ))}
            </div>


          <div className="space-y-3 min-h-[300px]">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border animate-fade-in-up">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                    <label
                    htmlFor={`task-${task.id}`}
                    className={`font-medium transition-colors cursor-pointer ${
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    }`}
                    >
                    {task.text}
                    </label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono">{task.subject}</Badge>
                        {task.dueDate && <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{getDateBadge(task.dueDate)}</div>}
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )) : (
                 <div className="text-center py-16 text-muted-foreground">
                    <ClipboardList className="h-16 w-16 mx-auto mb-4" />
                    <p className="font-semibold">No tasks here!</p>
                    <p className="text-sm">Add a new task to get started or change your filter.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
