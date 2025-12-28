import PageHeader from "@/components/page-header";
import GeneratorForm from "@/components/study-plan/generator-form";

export default function StudyPlanPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="AI Study Plan Generator"
        description="Create a personalized study plan tailored to your goals and schedule. Fill out the details below to get started."
      />
      <div className="mt-8 max-w-4xl">
        <GeneratorForm />
      </div>
    </div>
  );
}
