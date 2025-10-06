
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

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

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

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
          <div className="flex gap-2 mb-6">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g., Revise Chapter 3 of Maths"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
          </div>

          {tasks.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-muted-foreground">Progress</span>
                <span className="font-semibold">{completedTasks} / {totalTasks} Completed</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 text-sm font-medium transition-colors ${
                    task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                  }`}
                >
                  {task.text}
                </label>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <ClipboardList className="h-16 w-16 mx-auto mb-4" />
                    <p className="font-semibold">Your study plan is empty.</p>
                    <p className="text-sm">Add a new task to get started!</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
