import FeatureCard from '@/components/feature-card';
import PageHeader from '@/components/page-header';
import { School } from 'lucide-react';

const niosCourses = [
  {
    title: 'Secondary Course (Class X)',
    description: 'Equivalent to the 10th standard. Wide range of subjects available.',
    href: '/nios/secondary',
    icon: School,
  },
  {
    title: 'Senior Secondary Course (Class XII)',
    description: 'Equivalent to the 12th standard, preparing you for higher education.',
    href: '/nios/sr-secondary',
    icon: School,
  },
  {
    title: 'Vocational Education',
    description: 'Skill-based courses to enhance employment opportunities.',
    href: '/nios/vocational',
    icon: School,
  },
];

export default function NiosPage() {
  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="NIOS Board Classes"
        description="Flexible and quality education with the National Institute of Open Schooling."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {niosCourses.map((item) => (
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
