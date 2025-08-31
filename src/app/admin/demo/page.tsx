
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDemoPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
          <CardDescription>View and manage your demos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Demo content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
