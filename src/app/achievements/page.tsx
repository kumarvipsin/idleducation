'use client';
import { SelectionsChart } from "@/components/selections-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function AchievementsPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Our Achievements</h1>
        <p className="text-muted-foreground mt-2">Celebrating the milestones and successes of our students and institution.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selections Over the Years</CardTitle>
        </CardHeader>
        <CardContent>
          <SelectionsChart />
        </CardContent>
      </Card>
    </div>
  );
}
