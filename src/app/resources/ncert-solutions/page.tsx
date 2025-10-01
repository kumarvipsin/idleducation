
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCheck, ArrowRight, Sigma, TestTube2, Landmark, Atom, Dna, BookText, Globe, Scale, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCollection } from '@/app/actions/data';
import { Skeleton } from '@/components/ui/skeleton';

type Subject = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const subjectIconMap: { [key: string]: React.ReactNode } = {
  maths: <Sigma className="w-6 h-6 text-green-600" />,
  science: <TestTube2 className="w-6 h-6 text-blue-600" />,
  social: <Landmark className="w-6 h-6 text-amber-600" />,
  english: <BookText className="w-6 h-6 text-purple-600" />,
  physics: <Atom className="w-6 h-6 text-sky-600" />,
  chemistry: <FlaskConical className="w-6 h-6 text-purple-600" />,
  biology: <Dna className="w-6 h-6 text-lime-600" />,
  history: <Landmark className="w-6 h-6 text-red-600" />,
  geography: <Globe className="w-6 h-6 text-orange-600" />,
  'political-science': <Scale className="w-6 h-6 text-indigo-600" />,
  economics: <TrendingUp className="w-6 h-6 text-pink-600" />,
  default: <BookText className="w-6 h-6 text-gray-600" />,
};

const getIcon = (key: string) => subjectIconMap[key.toLowerCase()] || subjectIconMap.default;

export default function NcertSolutionsPage() {
  const [solutionsByClass, setSolutionsByClass] = useState<any>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchSolutionsData = async () => {
      setLoading(true);
      const result = await getCollection('ncertSolutions');
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).reduce((acc, classDoc) => {
          const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
            name: subjectData.name,
            href: `/resources/ncert-solutions/${classDoc.id}/${subjectKey}`,
            icon: getIcon(subjectKey),
          }));
          return acc;
        }, {});
        
        const sortedClasses = Object.keys(formattedData).sort((a, b) => {
             const getOrder = (name: string) => parseInt(name.replace('Class ', ''), 10) || 99;
             return getOrder(a) - getOrder(b);
        });

        setSolutionsByClass(formattedData);
        setClasses(sortedClasses);
        if (sortedClasses.length > 0) {
            const defaultClass = sortedClasses.find(c => c.includes('10')) || sortedClasses[0];
            setSelectedClass(defaultClass);
        }
      }
      setLoading(false);
    };

    fetchSolutionsData();
  }, []);

  const subjects = solutionsByClass[selectedClass] || [];
  
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
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">NCERT Solutions for {selectedClass}</h1>
        <p className="text-muted-foreground">Explore our detailed, step-by-step solutions for your NCERT textbooks.</p>
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
                        ? 'border-primary text-primary bg-primary/10 rounded-full' 
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full'}`}
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
                <Link href={subject.href} key={index} className="group">
                  <Card 
                      className={`flex flex-col rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full bg-card`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                  >
                      <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                          <div className="mb-4">
                              {subject.icon}
                          </div>
                          <h3 className="text-lg font-semibold mb-1 flex-grow text-left">{subject.name}</h3>
                          <div className="w-full flex justify-end">
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                      </CardContent>
                  </Card>
                </Link>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <Card className="p-8 inline-block">
                        <BookCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-semibold">No solutions found for this class.</p>
                        <p className="text-sm text-muted-foreground">Please select another class to see available solutions.</p>
                    </Card>
                </div>
            )}
            </div>
        )}
      </main>
    </div>
  );
}
