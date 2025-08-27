import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ReferenceBooksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Reference Books</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Explore our curated list of reference books to deepen your understanding. More content will be available here soon.
        </p>
      </CardContent>
    </Card>
  );
}
