import PageHeader from '@/components/page-header';
import ProgressChart from '@/components/dashboard/progress-chart';
import ContentRecommendations from '@/components/dashboard/content-recommendations';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <PageHeader
        title="Welcome to your Dashboard"
        description="Here's a snapshot of your learning journey. Keep up the great work!"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>
        <div className="lg:col-span-1">
          <ContentRecommendations />
        </div>
      </div>
    </div>
  );
}
