
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMessagesPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>View and manage messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Message management tools will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
