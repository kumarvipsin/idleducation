import FeatureCard from '@/components/feature-card';
import PageHeader from '@/components/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck } from 'lucide-react';

const govExams = [
  {
    title: 'SSC Exams',
    description: 'Comprehensive preparation for all Staff Selection Commission exams.',
    href: '/gov-exams/ssc',
    icon: ShieldCheck,
  },
  {
    title: 'RRB Exams',
    description: 'Study materials and tests for Railway Recruitment Board exams.',
    href: '/gov-exams/rrb',
    icon: ShieldCheck,
  },
  {
    title: 'Delhi Police',
    description: 'Prepare for recruitment exams for various Delhi Police posts.',
    href: '/gov-exams/delhi-police',
    icon: ShieldCheck,
  },
];

export default function GovExamsPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Government Exam Prep"
        description="Your one-stop destination for acing competitive government exams."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {govExams.map((item) => (
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
