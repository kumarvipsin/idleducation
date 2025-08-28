
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCoursesPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Manage all courses available on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Course creation and management tools will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
