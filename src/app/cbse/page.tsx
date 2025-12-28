import FeatureCard from '@/components/feature-card';
import PageHeader from '@/components/page-header';
import { BookOpen, GraduationCap } from 'lucide-react';

const cbseClasses = Array.from({ length: 9 }, (_, i) => {
  const grade = i + 4;
  return {
    title: `Class ${grade}`,
    description: `Full curriculum for grade ${grade} based on the CBSE syllabus.`,
    href: `/cbse/class-${grade}`,
    icon: GraduationCap,
  };
});

export default function CbsePage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="CBSE Board Classes"
        description="Select your class to access subjects, notes, and practice materials."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cbseClasses.map((item) => (
          <FeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
}
