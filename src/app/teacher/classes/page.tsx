
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherClassesPage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
          <CardDescription>Here is a list of all your classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Class list and management tools will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
