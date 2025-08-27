import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function NcertSolutionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">NCERT Solutions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Detailed, step-by-step solutions for all your NCERT textbook questions. More content will be available here soon.
        </p>
      </CardContent>
    </Card>
  );
}
