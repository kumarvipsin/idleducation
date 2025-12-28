
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMailPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Mail</CardTitle>
          <CardDescription>View and manage your mail.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Mail content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
