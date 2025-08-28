
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentProfilePage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Student profile details and editing form will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
