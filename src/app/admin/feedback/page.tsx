
'use client';

import { useEffect, useState } from 'react';
import { getFeedbackSubmissions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, User, Mail, MessageSquare, Tag, Calendar } from 'lucide-react';

interface Feedback {
  id: string;
  name?: string;
  email?: string;
  category: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const result = await getFeedbackSubmissions();
      if (result.success && result.data) {
        setFeedback(result.data as Feedback[]);
      }
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  const feedbackByMonth = feedback.reduce((acc, item) => {
    const month = format(new Date(item.createdAt), 'MMMM yyyy');
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {} as { [key: string]: Feedback[] });

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
          <CardDescription>
            A total of <span className="font-bold text-primary">{feedback.length}</span> submissions have been received.
          </CardDescription>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[calc(100vh-280px)] w-full">
        {loading ? renderSkeleton() : Object.keys(feedbackByMonth).length > 0 ? (
          Object.entries(feedbackByMonth).map(([month, submissions]) => (
            <div key={month} className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pl-2 border-l-4 border-primary">{month}</h2>
              <div className="space-y-4">
                {submissions.map((item) => (
                  <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <RatingStars rating={item.rating} />
                           <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Tag className="w-4 h-4" />
                                <span>{item.category}</span>
                           </div>
                        </div>
                         <div className="text-xs text-muted-foreground text-right">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(item.createdAt), 'PPp')}</span>
                            </div>
                        </div>
                      </div>
                      
                      <div className="text-base text-foreground pt-2">
                        <p className="whitespace-pre-wrap">{item.feedback}</p>
                      </div>

                      <div className="border-t pt-3 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            <span>{item.name || 'Anonymous'}</span>
                        </div>
                        {item.email && (
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                <span>{item.email}</span>
                            </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
            <p>No feedback has been submitted yet.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
