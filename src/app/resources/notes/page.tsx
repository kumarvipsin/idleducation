import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function NotesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Study Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Concise and comprehensive notes to help you revise and learn effectively. More content will be available here soon.
        </p>
      </CardContent>
    </Card>
  );
}
