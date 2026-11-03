import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRANCHES_DATA, getBranchBySlug } from '@/data/branches-data';
import BranchDetailClient from './branch-detail-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];
  BRANCHES_DATA.forEach((b) => {
    slugs.push({ slug: b.slug });
    b.aliases.forEach((alias) => {
      slugs.push({ slug: alias });
    });
  });
  return slugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);

  if (!branch) {
    return {
      title: 'Branch Not Found | IDL Education Delhi',
      description: 'The requested IDL Education branch could not be found.',
    };
  }

  return {
    title: `${branch.name} - IDL Education Delhi | Offline Coaching Centre`,
    description: `Visit IDL Education ${branch.name} in Delhi. ${branch.tagline}. Located at ${branch.fullAddress}, near ${branch.nearestMetro}. Offering CBSE Class 9-12, CUET coaching, smart classrooms, and personal mentoring. Call ${branch.phone}.`,
    openGraph: {
      title: `${branch.name} - IDL Education Delhi`,
      description: `${branch.tagline}. Located at ${branch.fullAddress}. Call ${branch.phone} for admissions.`,
      images: [
        {
          url: branch.imageUrl,
          width: 1200,
          height: 630,
          alt: `${branch.name} Campus`,
        },
      ],
    },
  };
}

export default async function BranchPage({ params }: PageProps) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  return <BranchDetailClient branch={branch} />;
}
