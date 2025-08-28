
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProfilePage() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>View and manage your profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Admin profile details and editing form will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
