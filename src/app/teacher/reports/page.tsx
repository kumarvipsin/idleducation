
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherReportsPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Progress Reports</CardTitle>
          <CardDescription>View and manage student progress reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of submitted progress reports will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
