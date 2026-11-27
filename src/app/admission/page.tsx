import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import { AdmissionFormClient } from '@/components/admission-form-client';
import { resolveCatalogSelectionFromParams } from '@/lib/branch-courses';

export const dynamic = 'force-dynamic';

interface AdmissionPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(val: string | string[] | undefined): string | null {
  if (Array.isArray(val)) return val[0] ?? null;
  return val ?? null;
}

export default async function AdmissionPage({ searchParams }: AdmissionPageProps) {
  const [res, resolvedParams] = await Promise.all([
    getPublicBranchClassCatalog(),
    searchParams ? searchParams : Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);

  const initialSelection = resolveCatalogSelectionFromParams(res.data, {
    branch: getSingleParam(resolvedParams.branch) || getSingleParam(resolvedParams.center),
    classCourse: getSingleParam(resolvedParams.course) || getSingleParam(resolvedParams.class),
    title: getSingleParam(resolvedParams.title),
  });

  return (
    <AdmissionFormClient
      variant="page"
      initialCatalog={res.data}
      initialSelection={initialSelection}
    />
  );
}
