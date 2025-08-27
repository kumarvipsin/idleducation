import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PreviousYearQuestionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Previous Year Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Practice with past exam papers to get familiar with the format and types of questions. More content will be available here soon.
        </p>
      </CardContent>
    </Card>
  );
}
