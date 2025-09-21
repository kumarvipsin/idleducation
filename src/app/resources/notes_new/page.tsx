
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, TestTube2, Scale, Globe, Landmark, Atom, Sigma, Dna, ArrowRight, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNotes } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

type Subject = {
  name: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

const subjectIconMap: { [key: string]: React.ReactNode } = {
  maths: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  science: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
  social: <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
  english: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  physics: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
  chemistry: <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  biology: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
  history: <Landmark className="w-8 h-8 text-red-600 dark:text-red-400" />,
  geography: <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
  'political-science': <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
  economics: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
  default: <BookText className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
};

const subjectGradientMap: { [key: string]: string } = {
  maths: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
  science: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
  social: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30',
  english: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  physics: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',
  chemistry: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  biology: 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30',
  history: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
  geography: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
  'political-science': 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30',
  economics: 'from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30',
  default: 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30',
};

const getIcon = (key: string) => subjectIconMap[key.toLowerCase()] || subjectIconMap.default;
const getGradient = (key: string) => subjectGradientMap[key.toLowerCase()] || subjectGradientMap.default;

export default function NotesNewPage() {
  const [notesByClass, setNotesByClass] = useState<any>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchNotesData = async () => {
      setLoading(true);
      const result = await getNotes();
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).reduce((acc, classDoc) => {
          const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
            name: subjectData.name,
            href: `/resources/notes/${classDoc.id}/${subjectKey}`,
            icon: getIcon(subjectKey),
            gradient: getGradient(subjectKey),
          }));
          return acc;
        }, {});
        
        const sortedClasses = Object.keys(formattedData).sort((a, b) => {
             const getOrder = (name: string) => parseInt(name.replace('Class ', ''), 10) || 99;
             return getOrder(a) - getOrder(b);
        });

        setNotesByClass(formattedData);
        setClasses(sortedClasses);
        if (sortedClasses.length > 0) {
            const defaultClass = sortedClasses.find(c => c.includes('10')) || sortedClasses[0];
            setSelectedClass(defaultClass);
        }

      }
      setLoading(false);
    };

    fetchNotesData();
  }, []);

  const subjects = notesByClass[selectedClass] || [];
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="flex flex-col rounded-xl shadow-lg">
          <CardContent className="p-6 flex flex-col flex-grow items-start">
            <Skeleton className="h-10 w-10 rounded-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Notes for {selectedClass}</h1>
        <p className="text-muted-foreground">Find concise and comprehensive notes to help you revise and learn effectively.</p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
            {loading ? (
                 [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
            ) : (
                classes.map((className) => (
                <button
                    key={className}
                    onClick={() => handleClassChange(className)}
                    className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                    ${selectedClass === className 
                        ? 'border-primary text-primary bg-primary/10 rounded-md' 
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
                >
                    {className}
                </button>
                ))
            )}
          </div>
        </div>
      </div>

      <main className="flex-1">
        {loading ? renderSkeleton() : (
            <div key={animationKey} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {subjects && subjects.length > 0 ? (
                subjects.map((subject: Subject, index: number) => (
                <Card 
                    key={index} 
                    className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${subject.gradient}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                        <div className="flex justify-between items-start w-full mb-4">
                            {subject.icon}
                            <Badge variant="secondary">{selectedClass}</Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-1 flex-grow">{subject.name}</h3>
                        <Button asChild variant="default" className="mt-auto w-full">
                            <Link href={subject.href}>
                                VIEW MORE <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <Card className="p-8 inline-block">
                        <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                        <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                    </Card>
                </div>
            )}
            </div>
        )}
      </main>
    </div>
  );
}
